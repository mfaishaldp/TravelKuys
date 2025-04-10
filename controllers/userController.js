const {User, Profile, Travel, Transaction} = require('../models')


class userController {
    static async showRegistration(req,res){
        try {
            let {error} = req.query
            if(error) {
                error = error.split(',')
            }
            //! Session
            let {email,role,name,userId} = req.session

            res.render('userRegistrationPage',{error,email,role,name,userId})
        } catch (error) {
            res.send(error)
        }
    }
    static async postRegistration(req,res){
        try {
            let {name, birthDate, identityNumber, phoneNumber} = req.body //profile
            let {email, password, role} = req.body //user

            let newDataUser = await User.createUser(email, password, role)
            let UserId = newDataUser.id
            if (name !== '' && birthDate !== '' && identityNumber !== '' && phoneNumber !== '') { //! kalo form Profile sudah lengkap
                await Profile.createProfile(name, birthDate, identityNumber, phoneNumber, UserId)
                res.redirect('/login')
            } else { //! kalo form Profile belum lengkap maka delete user yang baru terbuat
                await User.deleteUserById(UserId)
                await Profile.createProfile(name, birthDate, identityNumber, phoneNumber, UserId) //! untuk trigger error pada form Profile
            }

        } catch (error) {
            
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => {
                    return el.message
                })
            }
            // res.send(error)
            res.redirect(`/registration?error=${error}`)
        }
    }
    static async showLogin(req,res) {
        try {
            let error = req.query
            
            //! Session
            let {email,role,name,userId} = req.session

            res.render('userLoginPage',{error,email,role,name,userId})
        } catch (error) {
            res.send(error)
        }
    }
    static async postLogin(req,res) {
        try {

            let {email,password} = req.body
            let userLogin = await User.decryptPassword(email,password)
            // console.log(req.session);
            
            if (userLogin.checkPassword) {
                req.session.userId = userLogin.dataUserProfile.id
                req.session.email = userLogin.dataUserProfile.email
                req.session.role = userLogin.dataUserProfile.role
                req.session.name = userLogin.dataUserProfile.Profile.name

                // console.log(req.session);
                // req.session.destroy()

                res.redirect(`/schedules/${req.session.userId}`)
            }
            
        } catch (error) {
            res.redirect(`/login?name=${error.name}&msg=${error.msg}`)
        }
    }
    static async userLogout(req,res) {
        try {
            req.session.destroy() //! clear session
            res.redirect('/schedules')
        } catch (error) {
            res.send(error)
        }
    }
    static async showUserBook(req,res){
        try {

            let {error} = req.query //!

            //! Session
            let {email,role,name,userId} = req.session
            let {travelId} = req.params
            
            let dataTravelCategoryById = await Travel.getTravelCategoryById(travelId)

            res.render('userBookPage',{dataTravelCategoryById,email,role,name,userId,error})
            
        } catch (error) {
            res.send(error)
        }
    }
    static async postUserBook(req,res) {
        try {

            let {travelId, userId} = req.params
            let {quantityOrder} = req.body
            let dataTravelCategoryById = await Travel.getTravelCategoryById(travelId)
            let {schedule,capacity} = dataTravelCategoryById

            let insertDataTrans = {
                schedule,
                TravelId : +travelId,
                UserId : +userId,
                quantityOrder : +quantityOrder,
                totalPrice : dataTravelCategoryById.Category.price * +quantityOrder
            }

            await Transaction.createTransaction(insertDataTrans, capacity) //! create new transaction

            await Travel.decrementCapacity(travelId,quantityOrder) //! kurangin capacity travel

            // console.log(insertDataTrans);
            // console.log(dataTravelCategoryById.dataValues);
            // console.log(req.body, 'body');
            // console.log(req.params, 'params');

            res.redirect(`/schedules/${userId}`)
            
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => {
                    return el.message
                })
            }
            res.redirect(`/schedules/${req.params.userId}/book/${req.params.travelId}?error=${error}`)
            // res.send(error)
        }
    }
    static async convertPdf(req,res) {
        try {

            // let {travelId} = req.params
            // let dataTravelCategoryById = await Travel.getTravelCategoryById(travelId)

            // let idMaxTransaction = await Transaction.max('id');

            let {userId} = req.params
            let dataTransactionUserTravel = await Transaction.getTransactionUserTravel(userId)
            
            let arr = []
            dataTransactionUserTravel.map(el => {
                arr.push({
                    idTransaction : el.id,
                    quantityOrder : el.quantityOrder,
                    totalPrice : el.totalPrice,
                    email : el.User.email,
                    nameTravel : el.Travel.nameTravel,
                    schedule : el.Travel.schedule
                })
            })
            
            await Transaction.exportPdf(arr,userId)
            // res.send(dataTransactionUserTravel)
            res.redirect(`/schedules/${userId}`)
            
            // http://localhost:3000/schedules/28/convert //! to run this controller
        } catch (error) {
            console.log(error);
            
            res.send(error)
        }
    }
    
}
module.exports = userController