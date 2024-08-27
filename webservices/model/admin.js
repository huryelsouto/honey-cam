
const fs = require('fs');
const path = require('path');

// Load admins data from the JSON file
const adminsFilePath = path.join(__dirname, '../data/admins.json');
let admins = JSON.parse(fs.readFileSync(adminsFilePath, 'utf-8'));

class Admin {
    static findAll() {
        return admins;
    }

    static findByPk(id) {
        return admins.find(admin => admin.id === id);
    }

    static findOne({ where: { name } }) {
        return admins.find(admin => admin.name === name);
    }
}

module.exports = Admin;
