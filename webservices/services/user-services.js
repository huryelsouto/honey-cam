// Importação do modelo User do diretório model
const User = require("../model/user");
// Importação do módulo bcrypt para lidar com hash de senhas
const bcrypt = require("bcrypt");
// Importação do módulo fs para manipulação de arquivos
const fs = require('fs');
const path = require('path');

// Função para adicionar um novo usuário
const addUser = async (name, password) => {
    // Definição do número de rounds de hashing
    const saltRounds = 10;
    // Geração do hash da senha fornecida pelo usuário
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Simulação de inserção no "banco de dados" JSON
    const newUser = { id: User.findAll().length + 1, name, passwordHash };
    User.findAll().push(newUser);

    // Atualizando o arquivo JSON
    const usersFilePath = path.join(__dirname, '../data/users.json');
    fs.writeFileSync(usersFilePath, JSON.stringify(User.findAll(), null, 4));

    return newUser;
}

// Função para autenticar um usuário
const authenticateUser = async (name, password) => {
    // Busca do usuário pelo nome
    const user = User.findOne({ where: { name } });
    if (!user) {
        throw new Error('User not found');
    }

    // Comparação da senha fornecida com o hash armazenado
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
        throw new Error('Incorrect password');
    }

    return user;
}

// Função para encontrar o hash da senha de um usuário pelo nome
const findUserPasswordHashByName = (name) => {
    const usersFilePath = path.join(__dirname, '../data/users.json');
    
    if (!fs.existsSync(usersFilePath)) {
        throw new Error('Users file not found');
    }

    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    const user = usersData.find(user => user.name === name);

    if (!user) {
        throw new Error('User not found');
    }

    return user.passwordHash;
}

module.exports = { addUser, authenticateUser, findUserPasswordHashByName };
