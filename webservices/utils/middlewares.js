// Importação dos módulos necessários para os middlewares
const logger = require('./logger') // Módulo de logging
const jwt = require('jsonwebtoken') // Biblioteca para gerar e verificar tokens JWT
const jwtServices = require('../utils/jwt-services') // Serviços relacionados a tokens JWT

// Lista de caminhos a serem monitorados para logging
const pathsToBeMonitored = ["/", "/test", "/login"]
// Lista de caminhos que exigem login de usuário
const pathsRequireUserLogin = ["/"]
// Lista de caminhos que exigem login de administrador
const pathsRequireAdminLogin = [
    "/picture", "/video", "/rtsp/start",
    "/rtsp/stop", "/user", "/config/cam-picture",
    "/config/cam-video", "/images", "/videos"
]

// Middleware para registrar informações sobre requisições
const requestLogger = (req, res, next) => {
    /* Verifica se a requisição deve ser monitorada */
    if (pathsToBeMonitored.includes(req.path)) {
        const log = {
            path: req.path,
            method: req.method,
            body: req.body,
            ip: req.socket.remoteAddress
        }
        logger.info(log) // Registra informações da requisição no logger
    }
    next() // Chama o próximo middleware na cadeia
}

// Middleware para autenticação de usuários
const authentication = (req, res, next) => {
    if (pathsRequireUserLogin.includes(req.path) && req.session.username === undefined) {
        return res.redirect("/login") // Redireciona para a página de login se o usuário não estiver autenticado
    }
    next() // Chama o próximo middleware na cadeia
}

// Middleware para verificar tokens JWT de administradores
const verifyToken = (req, res, next) => {
    if (pathsRequireAdminLogin.includes(req.path)) {
        const decodedToken = jwt.verify(jwtServices.getJWTToken(req), process.env.JWT_SECRET)
        if (!decodedToken.username) {
            return res.status(401).json({ error: 'token invalid' }) // Retorna erro se o token for inválido
        }
    }
    next() // Chama o próximo middleware na cadeia
}

// Middleware para lidar com endpoints desconhecidos
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' }) // Retorna erro para endpoint desconhecido
}

// Middleware para lidar com erros
const errorHandler = (error, request, response, next) => {
    logger.error(error.message) // Registra mensagem de erro no logger

    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        }) // Retorna erro se o token JWT for inválido
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        }) // Retorna erro se o token JWT estiver expirado
    }

    next(error) // Chama o próximo middleware na cadeia
}

// Exportação dos middlewares para serem utilizados em outros módulos
module.exports = {requestLogger, authentication, verifyToken, unknownEndpoint, errorHandler}
