const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const items = require('./routes/api/items');

const app = express();

//Bodyparser Middleware
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;


//Use Routes
app.use('./routes/api/items', items)

mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected!'))
    .catch(error => console.log(error));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));