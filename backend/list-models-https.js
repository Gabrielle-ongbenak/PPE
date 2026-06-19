const https = require('https');
require('dotenv').config();

async function listModelsHttps() {
    const apiKey = process.env.GEMINI_API_KEY;
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models?key=${apiKey}`,
        method: 'GET'
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
            console.log('Status:', res.statusCode);
            console.log('Models:', body);
        });
    });

    req.on('error', (e) => {
        console.error('Error:', e);
    });

    req.end();
}

listModelsHttps();
