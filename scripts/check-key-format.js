const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPaths = ['.env', '.env.local'];

envPaths.forEach(file => {
    const fullPath = path.resolve(__dirname, '../', file);
    if (fs.existsSync(fullPath)) {
        console.log(`--- Checking ${file} ---`);
        const config = dotenv.parse(fs.readFileSync(fullPath));
        const key = config.SUPABASE_SERVICE_ROLE_KEY || '';

        console.log(`Key Length: ${key.length}`);
        console.log(`Starts with eyJ: ${key.startsWith('eyJ')}`);
        console.log(`First 5 chars: ${key.substring(0, 5)}...`);
    } else {
        console.log(`--- ${file} missing ---`);
    }
});
