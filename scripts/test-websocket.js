const WebSocket = require('ws');

console.log('--- Testing WebSocket Connection ---');
const ws = new WebSocket('ws://localhost:1234/test-room');

ws.on('open', () => {
    console.log('✅ WebSocket Connected!');
    ws.close();
});

ws.on('error', (err) => {
    console.error('❌ WebSocket Error:', err.message);
});

ws.on('close', () => {
    console.log('ℹ️  WebSocket Closed');
});
