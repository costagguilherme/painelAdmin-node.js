const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const session = require("express-session")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./users/UsersController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")

//View engine
app.set('view engine', 'ejs')

// Sessions
app.use(session({
    secret: "dlsakdqfgthskajdksaj",
    cookie: {maxAge: 3000000}
}))

//Body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Arquivos estáticos
app.use(express.static('public'))

// Database
connection.authenticate().then(() => {
        console.log('Conexão com o BD feita!')
    }).catch((error) => {
        console.log(error)
})

// Rotas de categories, articles e users
app.use("/",categoriesController)
app.use("/", articlesController)
app.use("/", usersController)


//Exibição de todos os artigos
app.get("/", (req, res) => {

    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories})

        })
    })
})

// Exibição de artigo individualmente
app.get("/:slug", (req, res) => {
    let slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {

        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories})
    
            })

        } 

        else {
            res.redirect("/")
        }
    }).catch(error => {
        res.redirect("/")

    })
    
})

app.listen(8080, function (erro) {

    if (erro) {
        console.log('Ocorreu um erro')
    }

    else {
        console.log('Servidor iniciado com sucesso!')
    }
})


// Filtro por categorias

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug

    Category.findOne({
        where: {
            slug: slug
        }, include: [{model: Article}]
    }).then(category => {
        if (category != undefined) {

            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories  })
            })
        }

        else {
            res.redirect("/")
        }
    }).catch(erro => {
        res.redirect("/")

    })
})