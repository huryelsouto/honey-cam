// Importa o módulo 'Router' do Express para criar um roteador para as rotas de administração
const adminRouter = require('express').Router()

// Importa os serviços relacionados à administração
const adminServices = require('../services/admin-services')

// Importa os serviços relacionados aos usuários
const userServices = require('../services/user-services');

// Importa os serviços relacionados à sweetcam
const sweetcamServices = require('../services/sweetcam-services')

// Importa o módulo 'bcrypt' para lidar com criptografia de senhas
const bcrypt = require("bcrypt")

// Importa o módulo 'jsonwebtoken' para geração e verificação de tokens JWT
const jwt = require('jsonwebtoken')

// Importa os serviços JWT personalizados
const jwtServices = require("../utils/jwt-services")

// Define um prefixo para as rotas de administração baseado na variável de ambiente ADMIN_PATH
const prefix = process.env.ADMIN_PATH

// Rota para login de administrador
adminRouter.post(`/${prefix}/login`, async (req, res) => {
    // Extrai o nome de usuário e senha do corpo da requisição
    const {username, password} = req.body

    // Verifica se o nome de usuário ou senha não foram fornecidos
    if (!username || !password) {
        return res.status(400).send({error: 'username or password is null'}).end()
    }

    // Busca no serviço de administração as credenciais do administrador pelo nome de usuário
    const {passwordHash, name, id} = await adminServices.findAdminCredentialsByName(username)

    // Compara a senha fornecida com a senha armazenada no banco de dados
    if (await bcrypt.compare(password, passwordHash)) {
        // Se a comparação for bem-sucedida, gera um token JWT para o usuário
        const userForToken = {
            id: id,
            username: username
        }
        // O token será válido por 3600 segundos (1 hora)
        const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        // Retorna o token JWT e o nome de usuário
        res.status(200).send({ token, username })
    } else {
        // Se a comparação falhar, envia um e-mail de notificação sobre a tentativa de login falhada
        adminServices.sendEmail("Attempt to login as admin failed");
        // Retorna um status de não autorizado (401) e uma mensagem de erro
        res.status(401).send({ error: 'failed' })
    }
})

// Rota para atualização de senha de administrador
adminRouter.patch(`/${prefix}/password`, async (req, res) => {
    // Extrai a nova senha do corpo da requisição
    const newPassword = req.body.newPassword

    // Verifica se a nova senha não foi fornecida
    if (!newPassword) {
        return res.status(400).send({error: 'provide new password is null'}).end()
    }

    // Decodifica o token JWT presente na requisição para obter o ID do administrador
    const decodedToken = jwt.verify(jwtServices.getJWTToken(req), process.env.JWT_SECRET)
    const id = decodedToken.id
    // Atualiza a senha do administrador com a nova senha fornecida
    await adminServices.updatePassword(id, newPassword)
    // Retorna uma resposta de sucesso com uma mensagem indicando que a senha foi atualizada
    return res.status(200).send({message: "password update succeed"}).end()
})

// Rota para obtenção da imagem da câmera
adminRouter.get(`/${prefix}/picture`, (req, res) => {
    // Monta a configuração para a página de imagem da câmera com as configurações atuais
    const config = {
        ...sweetcamServices.getCamPictureConfig(),
        ...sweetcamServices.getBrandConfig(),
        userName: "admin"
    }
    // Renderiza a página de imagem da câmera com a configuração montada
    res.render("picture", config);
})

// Rota para obtenção do vídeo da câmera
adminRouter.get(`/${prefix}/video`, (req, res) => {
    // Monta a configuração para a página de vídeo da câmera com as configurações atuais
    const config = {
        ...sweetcamServices.getCamVideoConfig(),
        ...sweetcamServices.getBrandConfig(),
        userName: "admin"
    }
    // Renderiza a página de vídeo da câmera com a configuração montada
    res.render("video", config)
})

// Rota para adição de usuário para o serviço sweetcam
adminRouter.post(`/${prefix}/user`, async (req, res) => {
    // Extrai as informações do usuário do corpo da requisição
    const userInfo = req.body
    // Adiciona o usuário ao sistema utilizando os serviços relacionados aos usuários
    const savedUser = await userServices.addUser(userInfo.name, userInfo.password)
    // Retorna uma resposta indicando que o usuário foi adicionado com sucesso
    res.status(201).json(savedUser)
})

// Rota para revisão da configuração da imagem da câmera
adminRouter.patch(`/${prefix}/config/cam-picture`, (req, res) => {
    // Extrai o nome e o valor da configuração do corpo da requisição
    const {name, value} = req.body
    // Atualiza a configuração da imagem da câmera utilizando os serviços relacionados à administração
    adminServices.configCamPicture(name, value)
    // Retorna uma resposta indicando que a configuração foi atualizada com sucesso
    res.status(200).send({ message: `${name} has been updated to ${value}` })
})

// Rota para obtenção da configuração da imagem da câmera
adminRouter.get(`/${prefix}/config/cam-picture`, (req, res) => {
    // Obtém a configuração atual da imagem da câmera utilizando os serviços relacionados à sweetcam
    const camPictureConfig = sweetcamServices.getCamPictureConfig()
    // Retorna a configuração em formato JSON
    res.json(camPictureConfig)
})

// Rota para revisão da configuração do vídeo da câmera
adminRouter.patch(`/${prefix}/cam-video`, (req, res) => {
    // Extrai o nome e o valor da configuração do corpo da requisição
    const {name, value} = req.body
    // Atualiza a configuração do vídeo da câmera utilizando os serviços relacionados à administração
    adminServices.configCamVideo(name, value)
    // Retorna uma resposta indicando que a configuração foi atualizada com sucesso
    res.status(200).send({ message: `${name} has been updated to ${value}` })
})

// Rota para obtenção da configuração do vídeo da câmera
adminRouter.get(`/${prefix}/cam-video`, (req, res) => {
    // Obtém a configuração atual do vídeo da câmera utilizando os serviços relacionados à sweetcam
    const camVideoConfig = sweetcamServices.getCamVideoConfig()
    // Retorna a configuração em formato JSON
    res.json(camVideoConfig)
})

// Rota para upload de imagem da marca
adminRouter.post(`/${prefix}/brands`, adminServices.uploadBrands, (req, res) => {
    // Extrai o caminho do arquivo da imagem da marca enviado na requisição
    const path = (req.file.path).split(/public/)[1]
    // Retorna uma resposta de sucesso indicando que o upload foi realizado com sucesso e o caminho onde a imagem foi armazenada
    res.status(200).send({ message: 'Succeed', storedPath: path })
})

// Rota para upload de imagem panorâmica
adminRouter.post(`/${prefix}/images`, adminServices.uploadImages, (req, res) => {
    // Extrai o caminho do arquivo da imagem panorâmica enviado na requisição
    const path = (req.file.path).split(/public/)[1]
    // Retorna uma resposta de sucesso indicando que o upload foi realizado com sucesso e o caminho onde a imagem foi armazenada
    res.status(200).send({ message: 'Succeed', storedPath: path })
})

// Rota para upload de vídeo panorâmico
adminRouter.post(`/${prefix}/videos`, adminServices.uploadVideos, (req, res) => {
    // Extrai o caminho do arquivo do vídeo panorâmico enviado na requisição
    const path = (req.file.path).split(/public/)[1]
    // Retorna uma resposta de sucesso indicando que o upload foi realizado com sucesso e o caminho onde o vídeo foi armazenado
    res.status(200).send({ message: 'Succeed', storedPath: path })
})

// Exporta o roteador adminRouter para ser utilizado em outros arquivos
module.exports = adminRouter
