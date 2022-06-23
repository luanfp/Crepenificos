module.exports = (sequelize, Sequelize) => {
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

  return Orders;
};
