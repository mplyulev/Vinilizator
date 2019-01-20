const express = require('express');
const passport = require('passport');
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

        const encryptedPassword = newUser.setPassword(password);

        newUser.hash = encryptedPassword.hash;
        newUser.salt = encryptedPassword.salt;

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
                    res.json({success: true, msg: 'Successfully created new user.', token: newUser.generateJwt()});
                    newUser.generateJwt();
                });
            }
        });
    }
});

router.post('/login',function(req, res) {
    User.findOne( {
        $or: [
            { email : req.body.email },
            { username: req.body.email }
        ]
    }, function(err, user) {
        if (err) throw err;
        console.log(user);
        if (!user) {
            res.json({success: false, msg: 'Wrong username/email or password'});
        } else {
            const { password } = req.body;
            const {hash, salt} = user;
            const userModel = new User();
            const isPasswordValid = userModel.validatePassword(password, hash, salt);

            if (isPasswordValid) {
                res.json({success: true, token: userModel.generateJwt()});
                passport.session.sessionID = user._id;
            } else {
                res.json({success: false, msg: 'Wrong username/email or password'});
            }

        }
    });
});

module.exports = router;