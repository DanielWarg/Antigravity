const { Server } = require('@hocuspocus/server');
const { createClient } = require('@supabase/supabase-js');
const Y = require('yjs');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const logFile = path.resolve(__dirname, '../server.log');
function log(msg) {
    const entry = `[${new Date().toISOString()}] ${msg}\n`;
    console.log(msg);
    fs.appendFileSync(logFile, entry);
}

// Load environment variables from .env and .env.local
const envPaths = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../.env.local')
];

envPaths.forEach(envPath => {
    if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        for (const k in envConfig) {
            // Only set if value is not empty (avoid overwriting with empty strings)
            if (envConfig[k]) {
                process.env[k] = envConfig[k];
            }
        }
    }
});

// Initialize Supabase client
// NOTE: We need the SERVICE_ROLE_KEY to bypass RLS/Auth since this runs on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase URL or Service Key missing. Persistence will be disabled.');
}

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

const server = new Server({
    port: process.env.PORT ? parseInt(process.env.PORT) : 1234,

    async onConnect(data) {
        log(`🔌 onConnect: ${data.documentName}`);
    },

    async onDisconnect(data) {
        log(`❌ onDisconnect: ${data.documentName}`);
    },

    async onUpdate(data) {
        log(`🔄 onUpdate: ${data.documentName} (update length: ${data.update.length})`);
    },

    async onLoadDocument(data) {
        if (!supabase) {
            log('⚠️ No Supabase client, skipping load');
            return;
        }

        log(`📥 onLoadDocument: ${data.documentName}`);

        try {
            const { data: doc, error } = await supabase
                .from('documents')
                .select('data')
                .eq('name', data.documentName)
                .single();

            if (error) {
                if (error.code !== 'PGRST116') {
                    log(`❌ Error loading document: ${error.message}`);
                } else {
                    log('ℹ️ Document not found (fresh start)');
                }
                return;
            }

            if (doc && doc.data) {
                log(`✅ Loaded document data (hex length: ${doc.data.length})`);
                let hexString = doc.data;
                if (typeof hexString === 'string' && hexString.startsWith('\\x')) {
                    hexString = hexString.slice(2);
                }
                const update = new Uint8Array(Buffer.from(hexString, 'hex'));

                // Apply the update to the server's Y.Doc
                Y.applyUpdate(data.document, update);
                log(`✅ Applied update to document. Nodes map size: ${data.document.getMap('nodes').size}`);
            }
        } catch (e) {
            log(`❌ Exception in onLoadDocument: ${e.message}`);
        }
    },

    async onStoreDocument(data) {
        if (!supabase) return;

        log(`💾 onStoreDocument: ${data.documentName}`);

        try {
            // Correctly encode the Y.Doc state as a single update binary
            const update = Y.encodeStateAsUpdate(data.document);
            const hexData = Buffer.from(update).toString('hex');
            // Supabase/Postgres bytea commonly uses "\\x" prefixed hex strings
            const byteaHex = `\\x${hexData}`;

            log(`📤 Storing binary update (length: ${update.length} bytes, hex length: ${hexData.length})`);

            const { error } = await supabase
                .from('documents')
                .upsert({
                    name: data.documentName,
                    data: byteaHex,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'name' });

            if (error) {
                log(`❌ Error saving document: ${error.message}`);
            } else {
                log('✅ Document saved successfully');
            }
        } catch (e) {
            log(`❌ Exception in onStoreDocument: ${e.message}`);
        }
    },
});

server.listen().then(() => {
    log(`Hocuspocus server listening on port ${server.configuration.port}`);
    if (supabase) {
        log('✅ Persistence enabled (Supabase)');
    } else {
        log('❌ Persistence disabled (Missing credentials)');
    }
});
