'use strict';

var mongoose = require('mongoose');

/* DB */
var mongoose = require('mongoose');
// require('../api/models/admin')
// require('../api/models/users');


// mongoose.connect("mongodb://172.10.1.7:27017/mydaily", {user : 'mydaily', pass : 'mydaily7890'});
mongoose.connect("mongodb://localhost:27017/mydaily");
//mongoose.connect("mongodb://52.39.212.226:27017/mydaily", {user : "mydaily", pass : "My61936DaU432t"});
// mongoose.connect("mongodb://52.34.207.5:27017/mydaily", {
//     user: "mydaily",
//     pass: "My61936DaU432t"
// }); //Local
// mongoose.connect("mongodb://localhost:27017/mydaily", {
//     // user: "mydaily",
//     //  pass: "My61936DaU432t"
// }); //Staging
//mongoose.connect("mongodb://172.10.1.7:27017/rahultiwari", {user : 'rahultiwari', pass : 'rahultiwari2017'});


mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection failed"));
db.once('open', function () {
    console.log("Database connected successfully!");
});
// mongoose.set('debug', true);

/* end DB */