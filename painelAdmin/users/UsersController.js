const express = require("express")
const router = express.Router()
const User = require("./User")
const Category = require("../categories/Category")
const bcrypt = require("bcryptjs")
const adminAuth = require("../middlewares/adminAuth")


// Listagem de usuários
router.get("/admin/users",  adminAuth, (req, res) => {
    if (req.session.user == undefined) {
        res.redirect("/")
    }
    
    User.findAll().then(users => {
        res.render("admin/users/allUsers", {users: users})
    })
})


// Cadastro de usuário
router.get("/admin/users/create", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/users/create", {categories: categories})


    })
    
})

// Salvando usuário no BD
router.post("/users/create", (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({where: {email: email}}).then(user => {
        if (user == undefined) {

            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)
        
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch(() => {
                res.redirect("/")
            })

        } else {
            res.redirect("/admin/users/create")
        }
    })

})


// Tela de login
router.get("/login", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/users/login", {categories: categories})
    })
})

// Fazer login
router.post("/authenticate", (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({where: {email: email}}).then(user => {
        if (user != undefined) {
            let correct = bcrypt.compareSync(password, user.password)

            if (correct) {

                req.session.user = {
                    id: user.id,
                    email: user.email}
                    res.redirect("/admin/articles")


            } else {
                res.redirect("/login")
            }

        } 
        
        else {
            res.redirect("/login")
        }
    })
})


// Logout
router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router