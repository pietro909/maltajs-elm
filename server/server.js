var express = require("../node_modules/express");
var bodyParser = require("../node_modules/body-parser");
var morgan = require("../node_modules/morgan");
var db = require("./db.js");
var app = express();

// Set the port
app.set("port", process.env.PORT || 3000);
// Set the server working directory
app.use(express.static(__dirname + './../public'));
// log every request to the console
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
//app.engine('jade', ejs.renderFile);
//app.set('view engine', 'html');
app.set('views', './views');
app.set('view engine', 'pug');


app.use(bodyParser.json());

var routes = require('./routes/routes');
// Routes using Express
routes(app);
// App start
app.listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});
