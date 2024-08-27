// Importação do módulo nodemailer para envio de e-mails
const nodemailer = require('nodemailer');

// Configuração para o serviço de e-mail, utilizando variáveis de ambiente para as credenciais
const mailConfig = {
    service: process.env.EMAIL_SERVICE, // Serviço de e-mail (ex: Gmail, Outlook, etc.)
    host: process.env.EMAIL_HOST, // Host do serviço de e-mail
    secure: true, // Indica se a conexão deve ser segura (SSL/TLS)
    port: 465, // Porta de conexão
    auth: {
        user: process.env.EMAIL_ADDRESS, // Endereço de e-mail do remetente
        pass: process.env.EMAIL_PASSWORD, // Senha do remetente
    },
}

console.log(mailConfig) // Imprime as configurações para depuração

// Cria um transporte para envio de e-mails com as configurações especificadas
const transporter = nodemailer.createTransport(mailConfig)

// Exporta o transporte para ser utilizado em outros módulos
module.exports = transporter
