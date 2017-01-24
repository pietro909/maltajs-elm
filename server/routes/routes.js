module.exports= function(app) {
    var model     = require('../models/schema');
    var nodemailer = require('../../node_modules/nodemailer');
    var sgTransport = require('../../node_modules/nodemailer-sendgrid-transport');
    var jsdom = require('../../node_modules/jsdom');
    var path = require('path');
  
    var rootPath = '../../'; //path.resolve(__dirname);

      //app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


    // OMG serverside rendering! ...maybe
    app.get('/ssrjed', function(req, res) {
      var Elm = require(path.join(rootPath, 'public/dist/js/app-min.js'));
      jsdom.env(
        path.join(rootPath, 'public/index.html'), //with included script src to compiled_elm.js
        //div id="main"></div>',
        //'/public/index.html',
        function (err,window) {
          if (err != null) {
            return console.error("error", err);
          }
          document = window.document;
          console.log(document)
          //Elm.Main.embed(document.getElementById('main'));
          //Elm.Main.fullscreen();
          //document.createElement('div')
          //window.setTimeout(function() {

            res.render('elm-template.html', {
              head: document.head.innerHTML,
              body: document.body.innerHTML
            })
          //}, 400)
        }
      );
    });

    /**
     * Get subscribers list
     * http://localhost:3000/api/subscribers
     */
    app.get('/api/joined', function(req, res) {
        var query = model.Subscribers.find();

        query.exec(function(err,subscribers){
            console.log(subscribers);
            res.send(subscribers);
        });
    });

    /**
     * Add subscriber
     * http://localhost:3000/api/add-subscriber
     */
    app.post('/api/add-subscriber', function(req, res) {
        console.log(req.body);
        var subscriber = new model.Subscribers();

        subscriber.subscriberFirstName = req.body.name;
        subscriber.subscriberLastName = req.body.surname;
        subscriber.subscriberCompany = req.body.company;
        subscriber.subscriberEmail = req.body.email;

        subscriber.save(function(err, subscriber) {
            if (err) {
                // if an error occurs, show it in console
                console.log(err);
                return err;
            }

            res.send({
                'subscriber': subscriber.subscriberFirstName
            });
        });
    });

    app.post('/api/contact', function(req, res) {
        console.log(req.body);

        var options = {
          auth: {}
        };

        var client = nodemailer.createTransport(sgTransport(options));

        var email = {
          from: req.body.email,
          to: 'boggdan.dumitriu@gmail.com, tzuuc@yahoo.com, contact@maltajs.com',
          subject: 'MaltaJs Conference 2016',
          text: '',
          html: 'This a message from: '+ req.body.name + '<br>' +
                '<p>Phone no: ' + req.body.phone + '</p></br>' +
                '<p>Message: ' + req.body.message + '</p>' 
        };

        client.sendMail(email, function(err, info){
            if (err ){
              console.log(error);
            }
            else {
              console.log('Message sent: ' + info.message);
              res.send('Email sent succesfully');
            }
        });
    });
};
