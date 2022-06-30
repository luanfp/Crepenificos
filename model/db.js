// DB ------------
const Sequelize = require('sequelize');
const sequelize = new Sequelize('dbcrepenificos', 'root', '123456987', {
  /*host: "34.132.95.98",*/
  host:"localhost",
  dialect: 'mysql'
})

sequelize.authenticate().then(function(){
  console.log("DB Sucess! :)");
}).catch(function(){
  console.log("DB Failed :(");
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.orders = require("./orders.model.js")(sequelize, Sequelize);

module.exports = db;

// DB ------------


const Orders = sequelize.define('orders',{
  code:{
    type:Sequelize.STRING
  },
  category:{
    type:Sequelize.INTEGER
  },
  description:{
    type:Sequelize.STRING
  },
  status:{
    type:Sequelize.STRING
  }
});

//Orders.sync({force:true});

/*Pedidos.create({
  code: "123",
  category: 1,
  description: "Presunto e Queijo",
  status: "0"
})*/

/*Pedidos.destroy({
  where: {
    code:"123"
  }
})*/
