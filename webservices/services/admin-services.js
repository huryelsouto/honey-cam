
const Admin = require('../model/admin') // Importa o modelo Admin
const fs = require('fs') // Módulo para lidar com sistema de arquivos
const multer = require('multer') // Middleware para upload de arquivos
const bcrypt = require('bcrypt') // Biblioteca para hash de senhas
const transporter = require('../utils/nodemailer'); // Módulo para envio de e-mails

// Função para obter o número de administradores
const getNumberOfAdmins = async () => {
    return Admin.findAll().length; // Conta o número de admins no JSON
}

// Função para adicionar um novo administrador
const addAdmin = async (name, password) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newAdmin = { id: Admin.findAll().length + 1, name, passwordHash };
    Admin.findAll().push(newAdmin);

    // Atualiza o arquivo JSON
    const adminsFilePath = path.join(__dirname, '../data/admins.json');
    fs.writeFileSync(adminsFilePath, JSON.stringify(Admin.findAll(), null, 4));

    return newAdmin;
}

module.exports = { getNumberOfAdmins, addAdmin };

// Função de exemplo para upload de marcas
const uploadBrands = (req, res, next) => {
    res.send("Upload de marcas realizado com sucesso!");
};

// Função de exemplo para upload de imagens
const uploadImages = (req, res, next) => {
    res.send("Upload de imagens realizado com sucesso!");
};

// Função de exemplo para upload de vídeos
const uploadVideos = (req, res, next) => {
    res.send("Upload de vídeos realizado com sucesso!");
};

module.exports = {
    getNumberOfAdmins,
    addAdmin,
    uploadBrands,
    uploadImages,
    uploadVideos
};
