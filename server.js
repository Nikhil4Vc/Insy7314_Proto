require("dotenv").config();

const fs = require("fs");
const https = require("https");

const app = require("./src/app");

const PORT = process.env.HTTPS_PORT || 5000;

const sslOptions = {
    key: fs.readFileSync("./certificates/server.key"),
    cert: fs.readFileSync("./certificates/server.crt")
};

https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HustleHub+ HTTPS server running on https://localhost:${PORT}`);
});