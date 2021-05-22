const cors = require('cors')
const logger = require('morgan')
const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');  // parse Cookie header and populate req.cookies.
const configs = require('./configs/configs')

// firebase admin SDK
const firebaseAdmin = require('./services/firebase-admin.services');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// log all the incoming request body part so what is received can be check in console.
app.use(function (req, res, next) {
    console.log(req.body);
    next();
});

// define all routes
const IndexRoutes = require('./routes/routes');
const UserRoutes = require('./routes/user.routes');
const UploadRoutes = require('./routes/upload.routes')
app.use('/', IndexRoutes);
app.use('/users', UserRoutes);
app.use('/upload', UploadRoutes);

app.listen(configs.port, async () => {
    console.log("🚀 App is listening on port: " + `${configs.port}`);
})