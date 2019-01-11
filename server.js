const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
let session = require('express-session');

const authentication = require('./routes/api/controllers/authentication');
const collection = require('./routes/api/controllers/collection');

const app = express();

app.use(bodyParser.json());
app.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}));
let router = express.Router();
app.use(router);

const db = require('./config/keys').mongoURI;

mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error));

app.use(passport.initialize());
app.use('/api/controllers/authentication', authentication);
app.use('/api/controllers/collection', collection);

app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

