const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')
const userController = require('../controllers/userController')
const {isLoggedIn,isAdmin} = require('../middlewares/auth')

router.get('/',Controller.showLandingPage)
router.use('/registration',require('./registration'))
router.use('/login',require('./login'))
router.use('/logout',require('./logout'))
router.use('/schedules',require('./schedules'))
router.use('/categories',require('./categories'))


module.exports = router

// //! Registration
// router.get('/registration',userController.showRegistration)
// router.post('/registration',userController.postRegistration)

// //! Login
// router.get('/login',userController.showLogin)
// router.post('/login',userController.postLogin)

// //! Logout
// router.get('/logout',userController.userLogout)


// //! Schedules
// router.get('/schedules',Controller.showSchedule)

// router.get('/schedules/add',isLoggedIn,isAdmin,Controller.showAddSchedule)
// router.post('/schedules/add',Controller.postAddSchedule)

// router.get('/schedules/list',isLoggedIn,isAdmin,Controller.showListSchedule)

// router.get('/schedules/list/:id/edit',isLoggedIn,isAdmin,Controller.showEditTravel)
// router.post('/schedules/list/:id/edit', Controller.postEditTravel)

// router.get('/schedules/list/:id/delete',isLoggedIn,isAdmin,Controller.destroyTravel)


// //! Categories
// router.get('/categories/list',isLoggedIn,isAdmin,Controller.showListCategory)

// router.get('/categories/add',isLoggedIn,isAdmin,Controller.showAddCategory)
// router.post('/categories/add',Controller.postAddCategory)

// router.get('/categories/list/:id/edit',isLoggedIn,isAdmin,Controller.showEditCategory)
// router.post('/categories/list/:id/edit', Controller.postEditCategory)

// router.get('/categories/list/:id/delete',isLoggedIn,isAdmin,Controller.destroyCategory)


// //! User
// router.get('/schedules/:userId',isLoggedIn,Controller.showSchedule)

// router.get('/schedules/:userId/book/:travelId',isLoggedIn,userController.showUserBook)
// router.post('/schedules/:userId/book/:travelId',userController.postUserBook)

// router.get('/schedules/:userId/convert',isLoggedIn,userController.convertPdf) //! http://localhost:3000/schedules/28/convert

// module.exports = router