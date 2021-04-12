const express = require('express')
const dotenv = require('dotenv')
const logger = require('morgan')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');  //Parse Cookie header and populate req.cookies.
var cors = require('cors')
var validate = require('express-validation');
const expressValidator = require('express-validator')
const mongoose = require('mongoose')

const app = express();
app.use(logger('dev'));

const PORT = process.env.PORT || 3000

const db = mongoose.connection;
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb+srv://minhhieu:minhhieu@interiordesign.yn207.mongodb.net/InteriorDesign?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false  }).then(() => console.log('DB Connected!'));
db.on('error', (err) => {
    console.log('DB connection error:', err.message);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//Log all the incoming request body part so what is received can be check in console.
app.use(function (req, res, next) {
    console.log(req.body);
    next();
});

// app.use('/', routes);

//error handler, if request parameters do not fullfil validations a error message would be sent back as response.
app.use(function (err, req, res, next) {
    // specific for validation errors
    if (err instanceof validate.ValidationError) {

        return res.json({status: err.status, errorMessage: err});

    }
});

//Start listing application on defined port in configuration file.

app.listen(PORT);
console.log('Express server listening on port ' + PORT);

