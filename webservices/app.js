require('dotenv').config()
const {requestLogger, authentication, verifyToken, unknownEndpoint, errorHandler} = require('./utils/middlewares')
const express = require('express')
const cameraRouter = require('./controllers/camera')
const adminRouter = require('./controllers/admin')
const app = express()
const sessions = require('express-session')
const cookieParser = require("cookie-parser")

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(requestLogger)
app.use(authentication)
app.use(verifyToken)
app.use(cameraRouter)
app.use(adminRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app