var path = require('path');
const cors = require('cors');
const logger = require('morgan');
const express = require('express');
var favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');  // parse Cookie header and populate req.cookies.
const configs = require('./configs/configs');

// firebase admin SDK
const firebaseAdmin = require('./services/firebase-admin.services');

const app = express();

app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// try enable cors
app.use(function (req, res, next) {
    // allow all origin
    res.header("Access-Control-Allow-Origin", "*");
    // allow all headers
    res.header("Access-Control-Allow-Headers", "*");
    // allow all methods
    res.header("Access-Control-Allow-Methods", "*");
    // Disable caching for content files
    res.header("Cache-Control", "No-Cache, No-Store, Must-Revalidate");
    res.header("Pragma", "No-Cache");
    res.header("Expires", 0);
    next()
});

// log all the incoming request body part so what is received can be check in console.
app.use(function (req, res, next) {
    console.log(req.body);
    next();
});

// define all routes
const IndexRoutes = require('./routes/routes');
const UserRoutes = require('./routes/user.routes');
const UploadRoutes = require('./routes/upload.routes');
const PostRoutes = require('./routes/post.routes');
const CommentDetailsRoutes = require('./routes/commentDetails.routes');
const CategoryRoutes = require('./routes/category.routes');
app.use('/', IndexRoutes);
app.use('/users', UserRoutes);
app.use('/upload', UploadRoutes);
app.use('/posts', PostRoutes);
app.use('/comments', CommentDetailsRoutes);
app.use('/category', CategoryRoutes);


// error handler, if request parameters do not fullfil validations a error message would be sent back as response.
// app.use(function (error, req, res, next) {
//     // specific for validation errors
//     if (error instanceof ValidationError) {
//         return res.status(error).json({
//             success: false,
//             message: error.message
//         });
//     }
// });

// catch wrong url
app.use(async (req, res, next) => {
    return res.status(404).json({
        success: false,
        message: 'wrong url.'
    });
})

app.listen(configs.port || process.env.PORT, async () => {
    console.log("🚀 App is listening on port: " + `${configs.port}`);
})