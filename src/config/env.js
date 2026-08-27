const requiredEnvironmentVariables = [
    "JWT_SECRET",
    "MONGODB_URI"
];

for (const variable of requiredEnvironmentVariables) {
    if (!process.env[variable]) {
        throw new Error(
            `Missing required environment variable: ${variable}`
        );
    }
}

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    mongodbUri: process.env.MONGODB_URI
};