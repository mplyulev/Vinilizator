const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const authentication = require('./routes/api/controllers/authentication');
const collection = require('./routes/api/controllers/collection');
const accountSettings = require('./routes/api/controllers/accountSettings');

const app = express();

app.use(bodyParser.json());
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
app.use('/api/controllers/accountSettings', accountSettings);

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

