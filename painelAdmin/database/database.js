const Sequelize = require("sequelize")

const connection = new Sequelize('painelbd', 'root', 'root12345', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection