const app = require('express')();
const https = require('https');
const fs = require('fs');

//GET home route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// we will pass our 'app' to 'https' server
https.createServer({
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
    passphrase: 'kavitha'
}, app)
.listen(3000);