const { Sequelize } = require("sequelize");

const sequelize = new Sequelize ("nome do banco", "nome do usuario", "senha",{
    host:'localhost',
    dialect:'mysql'
});

sequelize.authenticate().then(function(){
    console.log("Conexão realizada")
}).catch(function(){
    console.log("Erro na conexão")
})

module.exports = sequelize;

