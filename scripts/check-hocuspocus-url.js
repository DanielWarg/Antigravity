const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const config = dotenv.parse(fs.readFileSync(envPath));
    console.log('NEXT_PUBLIC_HOCUSPOCUS_URL:', config.NEXT_PUBLIC_HOCUSPOCUS_URL);
} else {
    console.log('.env.local missing');
}
