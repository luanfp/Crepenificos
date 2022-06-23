// Express and Handlebars
const express = require('express');
const exphbs  = require('express-handlebars');

const app = express();
const hbs = exphbs.create({
  layoutsDir: __dirname + '/views/layouts',
  extname: '.hbs',
  helpers: {
          //foo: function () { return 'FOO!'; },
          //bar: function () { return 'BAR!'; }
      }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

// Body Parser
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.use(express.static('public'));
var appRoutes = require('./routes/appRoutes');

app.use('/', appRoutes);

// Listen
const port = 8081;
var server = app.listen(port, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
