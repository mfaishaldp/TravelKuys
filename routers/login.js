const express = require('express')
const routerLogin = express.Router()
const Controller = require('../controllers/controller')
const userController = require('../controllers/userController')
const {isLoggedIn,isAdmin} = require('../middlewares/auth')


//! Login
routerLogin.get('/',userController.showLogin)
routerLogin.post('/',userController.postLogin)

module.exports = routerLogin