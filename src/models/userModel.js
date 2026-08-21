const fs = require("fs");
const path = require("path");

const dataDirectory = path.join(__dirname, "../../data");
const usersFile = path.join(dataDirectory, "users.json");

function ensureDataFile() {
    if (!fs.existsSync(dataDirectory)) {
        fs.mkdirSync(dataDirectory, { recursive: true });
    }

    if (!fs.existsSync(usersFile)) {
        fs.writeFileSync(usersFile, "[]", "utf8");
    }
}

function readUsers() {
    ensureDataFile();

    const data = fs.readFileSync(usersFile, "utf8");

    try {
        return JSON.parse(data);
    } catch (error) {
        throw new Error("User data storage is corrupted.");
    }
}

function writeUsers(users) {
    ensureDataFile();

    fs.writeFileSync(
        usersFile,
        JSON.stringify(users, null, 2),
        "utf8"
    );
}

function findUserByEmail(email) {
    const users = readUsers();

    return users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
    );
}

function findUserById(id) {
    const users = readUsers();

    return users.find((user) => user.id === id);
}

function createUser(user) {
    const users = readUsers();

    users.push(user);

    writeUsers(users);

    return user;
}

module.exports = {
    findUserByEmail,
    findUserById,
    createUser
};