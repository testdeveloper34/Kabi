'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();

module.exports = app; // for testing

// custom files
// var utils = require('./api/helpers/util');
require('./config/db');

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

    // All api requests
    app.use(function(req, res, next) {
        // CORS headers
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        // Set custom headers for CORS
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization');

        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    //Check to call web services where token is not required//
    app.use('/api/*', function(req, res, next) {
        var freeAuthPath = [
            '/api/sendSubscriptionEmail',
            '/api/getActivePlan',
            '/api/addContractor',
            '/api/forgotPassword',
            '/api/adminLogin',
            '/api/userLogin',
            '/api/contractorLogin',
            '/api/updateUserPic',
            '/api/dashboardCount',
            '/api/userLogOut',
            '/api/getCmsPageByName',
            '/api/updateStripeStatusWebHook',
            '/api/addSubscription'
        ];
        var available = false;
        for (var i = 0; i < freeAuthPath.length; i++) {
            if (freeAuthPath[i] == req.baseUrl) {
                available = true;
                break;
            }
        }
        if (!available) {
            // utils.ensureAuthorized(req, res, next);
            next();
        } else {
            next();
        }
    });

    // enable SwaggerUI
    app.use(swaggerExpress.runner.swaggerTools.swaggerUi());

    // install middleware
    swaggerExpress.register(app);

    var port = process.env.PORT || 5001;
    app.listen(port);


    if (swaggerExpress.runner.swagger.paths['/hello']) {
        console.log('try this:\ncurl http://127.0.0.1:' + port);
    }
});
