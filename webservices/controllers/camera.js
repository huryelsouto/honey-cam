const path = require('path');
// Importa o módulo express e cria um roteador para as rotas relacionadas ao serviço sweetcam
const sweetcamRouter = require('express').Router()
// Importa os serviços relacionados ao sweetcam
const sweetcamServices = require('../services/sweetcam-services')
// Importa os serviços relacionados aos usuários
const userServices = require('../services/user-services')
// Importa o módulo bcrypt para lidar com o hashing de senhas
const bcrypt = require("bcrypt");

// Variável para armazenar o momento em que o processo de login começou
let beginTimeOfLogin = 0;

// Rota principal que determina se o usuário será redirecionado para a visualização de vídeo ou imagem com base na configuração atual do serviço
sweetcamRouter.get('/', (req, res) => {
    // Obtém o tipo de mídia atual (vídeo ou imagem)
    const medium = sweetcamServices.getMedium()
    // Se a mídia for vídeo
    if (medium === "video") {
        // Configura o objeto de configuração para a visualização de vídeo
        const config = {
            ...sweetcamServices.getCamVideoConfig(),
            ...sweetcamServices.getBrandConfig(),
            userName: req.session.username
        }
        // Renderiza a visualização de vídeo passando as configurações
        res.sendFile(path.join(__dirname, "../views/video.html"))
    }
    // Se a mídia for imagem
    if (medium === "picture") {
        // Configura o objeto de configuração para a visualização de imagem
        const config = {
            ...sweetcamServices.getCamPictureConfig(),
            ...sweetcamServices.getBrandConfig(),
            userName: req.session.username
        }
        // Renderiza a visualização de imagem passando as configurações
        res.sendFile(path.join(__dirname, "../views/picture.html"));
    }
})

// Rota para exibir a página de login
sweetcamRouter.get('/login', (req, res) => {
    // Renderiza a página de login passando as configurações da marca
    res.sendFile(path.join(__dirname, "../views/login.html"))
})

// Rota para lidar com o processo de login
sweetcamRouter.post('/login', async (req, res) => {
    // Obtém a sessão atual
    let session = req.session;
    // Obtém o limite de tentativas de login
    let loginLimit = sweetcamServices.getLoginLimit()
    // Se a contagem de tentativas de login não existir na sessão, define-a como 0 e armazena o momento atual
    if (!session.loginTimes) {
        session.loginTimes = 0;
        beginTimeOfLogin = Date.now()
    }
    // Obtém o momento atual
    const currentTime = Date.now()
    // Se o tempo desde o início do processo de login for inferior a 60 segundos
    if (currentTime - beginTimeOfLogin <= 60_000) {
        // Incrementa a contagem de tentativas de login
        session.loginTimes += 1;
        // Se a contagem de tentativas de login ultrapassar o limite
        if (session.loginTimes > loginLimit) {
            // Retorna uma resposta de erro indicando que o limite de tentativas de login foi atingido
            return res.status(403).send({ error: "login request reached limit" })
        }
    } else {
        // Se passou mais de 60 segundos desde o último início de login, redefine a contagem de tentativas de login como 1 e armazena o momento atual
        session.loginTimes = 1;
        beginTimeOfLogin = Date.now()
    }

    // Obtém o nome de usuário e a senha da requisição
    const username = req.body.username
    const password = req.body.password

    // Obtém o hash da senha do usuário pelo nome de usuário
    const passwordHash = await userServices.findUserPasswordHashByName(username);
    // Se não encontrar um hash de senha correspondente ao nome de usuário, retorna um erro de usuário não encontrado
    if (!passwordHash) {
        return res.status(404).send({ error: "user not found" })
    }
    // Compara a senha fornecida com o hash de senha armazenado
    if (await bcrypt.compare(password, passwordHash)) {
        // Se as senhas corresponderem, armazena o nome de usuário na sessão e retorna uma mensagem de sucesso
        session.username = username
        return res.status(200).send({ message: "succeed" })
    } else {
        // Se as senhas não corresponderem, retorna um erro de senha incorreta
        return res.status(401).send({ error: "wrong password" })
    }
})

// Rota para efetuar logout
sweetcamRouter.get('/logout', (req, res) => {
    // Destroi a sessão do usuário
    req.session.destroy();
    // Redireciona para a página de login
    res.redirect('/login');
})

// Exporta o roteador sweetcamRouter para ser utilizado em outros arquivos
module.exports = sweetcamRouter
