const express = require("express")
const router = express.Router()
const Category = require("./Category")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")


// Criação de nova categoria
router.get("/admin/categories/new", adminAuth, (req, res) => {
    res.render("admin/categories/new")
})


//Salvar categoria no BD
router.post("/categories/save", adminAuth, (req, res) => {
    let title = req.body.title
    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories/new")
        })

    } else {
        res.redirect("admin/categories/new")
    }
})


// Exibição de categorias
router.get("/admin/categories", adminAuth, (req, res) => {
    Category.findAll({raw: true}).then(categorias => {
        res.render("admin/categories/allCategories", {
            categorias: categorias
        })

    })
})


// Deletar categorias

router.post("/categories/delete", adminAuth, (req,res) => {
    let id = req.body.id
    if (id != undefined) {

        if (!isNaN(id)) { // Se o id for um número

            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })

        }
        
        else {
            res.redirect("/admin/categories")
        }

    } 
    
    else {

        res.redirect("/admin/categories")
    }
})


// Edição de categorias

router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
    let id = req.params.id
    if (isNaN(id)){ //Se o id não for um número
        res.redirect("/admin/categories")
    }

    Category.findByPk(id).then(category => {
        if(category != undefined) {
            res.render("admin/categories/edit", {category: category})
        } else {
            res.redirect("/admin/categories")

        }

}).catch(erro => {
    res.redirect("/admin/categories")

    })

})

// Salvar categoria editada

router.post("/categories/update", adminAuth, (req, res) => {
    let id = req.body.id
    let title = req.body.title

    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id:id
        }
    }).then(() => {
        res.redirect("/admin/categories")

    })

})

module.exports = router