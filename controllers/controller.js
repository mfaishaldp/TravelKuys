const {Travel,Category} = require('../models')
class Controller {
    static async showLandingPage (req,res) {
        try {

            //! Session
            let {email,role,name,userId} = req.session

            res.render('landingPage',{email,role,name,userId})
        } catch (error) {
            res.send(error)
        }
    }
    static async showSchedule (req,res) {
        try {
            let {nameTravel} = req.query
            let dataTravelCategory = await Travel.getTravelCategoryActive(nameTravel)

            //! Session
            let {email,role,name,userId} = req.session

            res.render('schedulePage',{dataTravelCategory, email, role, name,userId})
            
        } catch (error) {
            res.send(error)
        }
    }
    static async showListSchedule(req,res) {
        try {
            let {error} = req.query

            //! Session
            let {email,role,name,userId} = req.session

            let dataTravelCategory = await Travel.getTravelCategory()
            res.render('scheduleListPage',{dataTravelCategory,error,email,role,name,userId})
        } catch (error) {
            res.send(error)
        }
    }
    static async showAddSchedule(req,res) {
        try {

            let {error} = req.query

            if (error) {
                error = error.split(',')
            }

            //! Session
            let {email,role,name,userId} = req.session

            let dataCategory = await Category.getCategory()
            res.render('scheduleAddPage',{dataCategory,error,email,role,name,userId})
        } catch (error) {
            res.send(error)
        }
    }
    static async postAddSchedule(req,res) {
        try {
            let data = await Travel.createTravel(req.body)
            
            res.redirect('/schedules')
            
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => {
                    return el.message
                })
            }
            res.redirect(`/schedules/add?error=${error}`)
            // res.send(error)
        }
    }
    static async showEditTravel (req,res) {
        try {

            let {error} = req.query
            if (error) {
                error = error.split(',')
            }

            //! Session
            let {email,role,name,userId} = req.session

            let {id} = req.params
            let dataTravelCategoryById = await Travel.getTravelCategoryById(id)
            let dataCategory = await Category.getCategory()

            res.render('scheduleEditPage',{dataTravelCategoryById,dataCategory,error,email,role,name,userId})
        } catch (error) {
            res.send(error)
        }
    }
    static async postEditTravel(req,res) {
        try {
            let {id} = req.params
            await Travel.updateTravel(id, req.body)

            res.redirect('/schedules/list')
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => {
                    return el.message
                })
            }
            let {id} = req.params
            res.redirect(`/schedules/list/${id}/edit?error=${error}`)
        }
    }
    static async destroyTravel(req,res) {
        try {

            let {id} = req.params
            await Travel.deleteTravel(id)
            res.redirect('/schedules/list')
        } catch (error) {
            res.redirect(`/schedules/list?error=${error.msg}`)
        }
    }
    static async showListCategory (req,res){
        try {

            let {deleted} = req.query

            //! Session
            let {email,role,name,userId} = req.session

            let dataCategory = await Category.getCategory()
            res.render('categoryListPage',{dataCategory,deleted,email,role,name,userId})
        } catch (error) {
            res.send(error)
        }
    }
    static async showAddCategory(req,res) {
        try {

            let {error} = req.query

            if (error) {
                error = error.split(',')
            }

            //! Session
            let {email,role,name,userId} = req.session

            res.render('categoryAddPage',{error,email,role,name,userId})
        } catch (error) {
            res.send(error)
        }
    }
    static async postAddCategory(req,res) {
        try {
            let data = await Category.createCategory(req.body)
            res.redirect('/categories/list')
            
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => {
                    return el.message
                })
            }
            res.redirect(`/categories/add?error=${error}`)
        }
    }
    static async showEditCategory (req,res) {
        try {

            let {error} = req.query
            if (error) {
                error = error.split(',')
            }

            //! Session
            let {email,role,name,userId} = req.session

            let {id} = req.params
            let dataCategoryById = await Category.getCategoryById(id)

            res.render('categoryEditPage',{dataCategoryById,error,email,role,name,userId})
        } catch (error) {
            res.send(error)
        }
    }
    static async postEditCategory(req,res) {
        try {
            let {id} = req.params
            await Category.updateCategory(id, req.body)

            res.redirect('/categories/list')
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                error = error.errors.map(el => {
                    return el.message
                })
            }
            let {id} = req.params
            res.redirect(`/categories/list/${id}/edit?error=${error}`)
        }
    }
    static async destroyCategory(req,res) {
        try {

            let {id} = req.params
            let dataNameDeleted = (await Category.getCategoryById(id)).nameCategory

            await Category.deleteCategory(id)
            res.redirect(`/categories/list?deleted=${dataNameDeleted}`)
        } catch (error) {
            
            res.send(error)
        }
    }
    
}
module.exports = Controller