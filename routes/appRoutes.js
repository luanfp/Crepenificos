var express = require('express');
var appRoutes = express.Router();

const db = require("../model/db"); // DB connect
//db.sequelize.sync({ force: false }).then(() => {
  //console.log("Drop and re-sync db.");
//});

const Orders = db.orders;
const Op = db.Sequelize.Op;

appRoutes.get('/', (req, res, next) => {
    res.render('home', {
        //layout: false,
        helpers: {
            //foo() { return 'foo.'; }
        }
    });
});

appRoutes.get('/display', (req, res, next) => {
  res.render('display2', {
        layout: 'mainDisplay2'
  });
});

/*
appRoutes.get('/display2', (req, res, next) => {
  res.render('display2', {
        layout: 'mainDisplay2'
  });
});
*/

appRoutes.get('/cart', (req, res, next) => {
    res.render('cart2', {
        layout: 'mainCart2',
        scanQrCode: true
    });
});

/*
appRoutes.get('/cart2', (req, res, next) => {
    res.render('cart2', {
        layout: 'mainCart2',
        scanQrCode: true
    });
});
*/

appRoutes.get('/orders', (req, res, next) => {
    res.render('orders', {
        layout: 'mainOrders'
    });
});
appRoutes.get('/ordersList', (req, res, next) => {
    res.render('ordersList', {
        layout: 'mainOrders'
    });
});

appRoutes.get('/ordersListQueue', (req, res, next) => {
    res.render('ordersListQueue', {
        layout: 'mainOrdersQueue'
    });
});

appRoutes.post('/order', (req, res, next) => {

  const code = req.body.code;
  console.log(code);
  var condition = code ? { code: { [Op.eq]: `${code}` } } : null;
  Orders.findOne({ where: condition })
    .then(data => {
      if (data !== null) {

        res.status(404).send({
          message: `Cannot find order with code=${code}.`
        });

      } else {

        //res.send(data);
        Orders.create({
          code: req.body.code,
          category: req.body.category,
          description: req.body.title,
          status: "0"
        }).then(data => {
            res.status(200).send(req.body);
          }).catch(err => {
            res.status(400).send({
              message:
                err.message || "Some error occurred while creating the order."
            });
          });

      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving order with code=" + id
      });
    });

});
appRoutes.post('/orderCancel', (req, res, next) => {

   //console.log(req.body);
   const code = req.body.code;
   if(code>0){
   Orders.destroy({
     where: { code: code }
   })
     .then(num => {
       if (num == 1) {
         res.status(200).send({
           message: "Order was deleted successfully!"
         });
       } else {
         res.status(404).send({
           message: `Cannot delete order with code=${code}. Maybe order was not found!`
         });
       }
     })
     .catch(err => {
       res.status(500).send({
         message: "Could not delete order with code=" + id
       });
     });
   }

});

appRoutes.post('/orderPutInQueue', (req, res, next) => {

/*  Orders.count({
    where: { status: '1' },
  }).then(data => {
  console.log(data);
  if(data<6){
*/
      Orders.update({ status: 1 }, {
        where: {
          code: req.body.code
        }
      }).then(num => {
        if (num == 1) {
          res.status(200).send({
            message: "Order was updated successfully!"
          });
        } else {
          res.status(404).send({
            message: `Cannot update order. Maybe order was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete order with code=" + req.body.code
        });
      });
/*
  }else{

      res.status(400).send({
        message: `Error. Only 6 in Queue!`
      });

  }
  }).catch(err => {
    res.status(500).send({
      message: "Error. Only 6 in Queue!"
    });
  });
*/
});
appRoutes.post('/orderPutInProgress', (req, res, next) => {

  Orders.count({
    where: { status: '2' },
  }).then(data => {
  console.log(data);
  if(data<6){

      Orders.update({ status: 2 }, {
        where: {
          code: req.body.code
        }
      }).then(num => {
        if (num == 1) {
          res.status(200).send({
            message: "Order was updated successfully!"
          });
        } else {
          res.status(404).send({
            message: `Cannot update order. Maybe order was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete order with code=" + req.body.code
        });
      });

  }else{

        res.status(400).send({
          message: `Error. Only 6 in Progress!`
        });

  }
  }).catch(err => {
      res.status(500).send({
        message: "Error. Only 6 in Progress!"
      });
  });

});
appRoutes.post('/orderPutDone', (req, res, next) => {

  Orders.update({ status: 3 }, {
    where: {
      code: req.body.code
    }
  }).then(num => {
    if (num == 1) {
      res.status(200).send({
        message: "Order was updated successfully!"
      });
    } else {
      res.status(404).send({
        message: `Cannot update order. Maybe order was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete order with code=" + req.body.code
    });
  });

});
appRoutes.post('/orderPutDelivered', (req, res, next) => {

  Orders.update({ status: 4 }, {
    where: {
      code: req.body.code
    }
  }).then(num => {
    if (num == 1) {
      res.status(200).send({
        message: "Order was updated successfully!"
      });
    } else {
      res.status(404).send({
        message: `Cannot update order. Maybe order was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete order with code=" + req.body.code
    });
  });

});


appRoutes.get('/getAllUnUsedQueue', (req, res, next) => {

  Orders.findAll({ where: { status: '1' },  order: [['updatedAt', 'ASC']] })
    .then(data => {
      res.status(200).send((JSON.stringify(data)));
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving order with status=1"
      });
    });

});
appRoutes.get('/getAllUnUsed', (req, res, next) => {

  Orders.findAll({ where: { status: '0' },  order: [['createdAt', 'DESC']] })
    .then(data => {
      res.status(200).send((JSON.stringify(data)));
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving order with status=0"
      });
    });

});
appRoutes.get('/getAllInQueue', (req, res, next) => {

  Orders.findAll({ where: { status: '1'}, order: [['updatedAt', 'ASC']]})
    .then(data => {
      res.status(200).send((JSON.stringify(data)));
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving order with status=1"
      });
    });

});
appRoutes.get('/getSixInQueue', (req, res, next) => {

  Orders.findAll({ where: { status: '1'}, limit: 6, order: [['updatedAt', 'ASC']]})
    .then(data => {
      res.status(200).send((JSON.stringify(data)));
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving order with status=1"
      });
    });

});
appRoutes.get('/getAllInProgress', (req, res, next) => {

  Orders.findAll({ where: { status: '2' },  order: [['updatedAt', 'ASC']] })
    .then(data => {
      res.status(200).send((JSON.stringify(data)));
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving order with status=2"
      });
    });

});
appRoutes.get('/getAllDone', (req, res, next) => {

  Orders.findAll({ where: { status: '3' },  order: [['updatedAt', 'ASC']] })
    .then(data => {
      res.status(200).send((JSON.stringify(data)));
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving order with status=3"
      });
    });

});
appRoutes.get('/getAllDelivered', (req, res, next) => {

  Orders.findAll({ where: { status: '4' },  order: [['updatedAt', 'DESC']] })
    .then(data => {
      res.status(200).send((JSON.stringify(data)));
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving order with status=4"
      });
    });

});

module.exports = appRoutes;
