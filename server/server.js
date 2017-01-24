var express = require("../node_modules/express");
var bodyParser = require("../node_modules/body-parser");
var morgan = require("../node_modules/morgan");
var db = require("./db.js");
var app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + './../public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('views', './server/views');
app.set('view engine', 'pug');
app.use(bodyParser.json());

var routes = require('./routes/routes');
routes(app);

// App start
app.listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});
