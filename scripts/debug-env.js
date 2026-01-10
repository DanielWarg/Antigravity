const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

console.log('--- Debugging Environment Loading ---');

['.env', '.env.local'].forEach(file => {
    const fullPath = path.resolve(__dirname, '../', file);
    if (fs.existsSync(fullPath)) {
        console.log(`Found ${file}`);
        const config = dotenv.parse(fs.readFileSync(fullPath));
        const keys = Object.keys(config);
        console.log(`  Keys found: ${keys.join(', ')}`);

        if (keys.includes('NEXT_PUBLIC_SUPABASE_URL')) {
            console.log(`  NEXT_PUBLIC_SUPABASE_URL: Present (Length: ${config.NEXT_PUBLIC_SUPABASE_URL.length})`);
        } else {
            console.log(`  NEXT_PUBLIC_SUPABASE_URL: MISSING`);
        }

        if (keys.includes('SUPABASE_SERVICE_ROLE_KEY')) {
            console.log(`  SUPABASE_SERVICE_ROLE_KEY: Present (Length: ${config.SUPABASE_SERVICE_ROLE_KEY.length})`);
        } else {
            console.log(`  SUPABASE_SERVICE_ROLE_KEY: MISSING`);
        }
    } else {
        console.log(`Missing ${file}`);
    }
});
console.log('--- End Debug ---');
