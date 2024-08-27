
const fs = require('fs');
const path = require('path');

// Load users data from the JSON file
const usersFilePath = path.join(__dirname, '../data/users.json');
let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

class User {
    static findAll() {
        return users;
    }

    static findByPk(id) {
        return users.find(user => user.id === id);
    }

    static findOne({ where: { name } }) {
        return users.find(user => user.name === name);
    }
}

module.exports = User;
