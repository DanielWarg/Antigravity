const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    try {
        console.log('Testing OpenAI Key...');
        const list = await openai.models.list();
        console.log('Success! Found models:', list.data.length);
        console.log('Available models include:', list.data.slice(0, 3).map(m => m.id));
    } catch (error) {
        console.error('Error validating key:', error.message);
        if (error.code) console.error('Error code:', error.code);
    }
}

main();
