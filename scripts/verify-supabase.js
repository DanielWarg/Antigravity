const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

console.log('--- Verifying Supabase Connection & Table ---');

// Load env from both .env and .env.local (same logic as server.js)
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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error('Missing URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
    console.log('Attempting to insert test record into "documents"...');

    const { data: insertData, error: insertError } = await supabase
        .from('documents')
        .upsert({
            name: 'verify_script_test',
            data: `\\x${Buffer.from('test_data').toString('hex')}`, // Match server.js logic (bytea hex)
        })
        .select();

    if (insertError) {
        console.error('❌ Insert Error:', insertError.message);
        console.error('Details:', insertError);
    } else {
        console.log('✅ Insert Successful:', insertData);
    }

    console.log('Attempting to read test record...');
    const { data: readData, error: readError } = await supabase
        .from('documents')
        .select('*')
        .eq('name', 'verify_script_test')
        .single();

    if (readError) {
        console.error('❌ Read Error:', readError.message);
    } else {
        console.log('✅ Read Successful:', readData);
    }
}

test();
