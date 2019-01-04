const mongoose = require('mongoose');
const passport = require('passport');
require('../config/passport');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../../../models/user");

router.post('/register', function(req, res) {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        res.json({success: false, msg: 'Please pass username and password.'});
    } else {
        const newUser = new User();
        newUser.hash = newUser.setPassword(password);

        const errors = newUser.validateEmailUsernameAccessibility(email, username);
        errors.then((result) => console.log(result))

        let usernameError = '';
        let emailError = '';

        // doesEmailAlreadyExist.then(user => {
        //     if (user) {
        //         emailError = 'Fuck iif email'
        //     } else {
        //        newUser.email = email;
        //     }
        // });
        //
        // doesUsernameAlreadyExist.then(user => {
        //     if (user) {
        //         usernameError = 'fuckoff username';
        //     } else {
        //         newUser.username = username;
        //     }
        // });

        console.log(newUser);

        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successfully created new user.'});
        });
    }
});

router.post('/login', function(req, res) {
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

module.exports = router;