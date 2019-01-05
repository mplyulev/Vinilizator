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
        const newUser = new User({
            email,
            username
        });

        newUser.hash = newUser.setPassword(password).hash;
        newUser.salt = newUser.setPassword(password).salt;

        const validateEmailUsernameAccessibility = newUser.validateEmailUsernameAccessibility(email, username);
        validateEmailUsernameAccessibility.then(errors => {
            if (errors && errors.username) {
                return res.json({success: false, usernameError: true, msg: 'Username is taken'});
            }

            if (errors && errors.email) {
                return res.json({success: false, emailError: true, msg: 'Email already registered'});
            }

            if (errors && !errors.username && !errors.email) {
                newUser.save(function (err) {
                    if (err) {
                        return res.json({success: false, msg: 'Problem with registration. Please try again later'});
                    }
                    res.json({success: true, msg: 'Successfully created new user.'});
                });
            }
        });
    }
});

router.post('/login', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({success: false, msg: 'There is no user registered with this email'});
        } else {
            const { password, hash, salt } = req.body;
            const userModel = new User();
            console.log(password);

            const isPasswordValid = userModel.validatePassword(password, hash, salt);
            console.log(isPasswordValid);

            // isPasswordValid.then(isPasswordValid => {
            //     if (isPasswordValid) {
            //         res.json({success: true, token: User.generateJwt()});
            //     } else {
            //         res.json({success: false, msg: 'Wrong password'});
            //     }
            // })


            // user.comparePassword(req.body.password, function (err, isMatch) {
            //     if (isMatch && !err) {
            //         // if user is found and password is right create a token
            //         const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
            //         // return the information including token as JSON
            //         res.json({success: true, token: 'JWT ' + token});
            //     } else {
            //         res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
            //     }
            // });
        }
    });
});

module.exports = router;