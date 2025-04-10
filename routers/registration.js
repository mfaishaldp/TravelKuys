const express = require('express')
const routerRegistration = express.Router()
const Controller = require('../controllers/controller')
const userController = require('../controllers/userController')
const {isLoggedIn,isAdmin} = require('../middlewares/auth')


//! Registration
routerRegistration.get('/',userController.showRegistration)
routerRegistration.post('/',userController.postRegistration)

module.exports = routerRegistration