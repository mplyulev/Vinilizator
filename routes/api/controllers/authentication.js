const express = require('express');
const router = express.Router();
const User = require("../../../models/user");

router.post('/register', function (req, res) {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        res.json({ success: false, msg: 'Please pass username and password.' });
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
                return res.json({ success: false, usernameError: true, msg: 'Username is taken' });
            }

            if (errors && errors.email) {
                return res.json({ success: false, emailError: true, msg: 'Email already registered' });
            }

            if (errors && !errors.username && !errors.email) {
                newUser.save(function (err) {
                    if (err) {
                        return res.json({ success: false, msg: 'Problem with registration. Please try again later' });
                    }
                    res.json({ success: true, msg: 'Successfully created new user.', token: newUser.generateJwt(), userId: newUser._id });
                });
            }
        });
    }
});

router.post('/login', function (req, res) {
    User.findOne({
        $or: [
            { email: req.body.email },
            { username: req.body.email }
        ]
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ success: false, msg: 'Wrong username/email or password' });
        } else {
            const { password } = req.body;
            const { hash, salt } = user;
            const userModel = new User();
            const isPasswordValid = userModel.validatePassword(password, hash, salt);

            if (isPasswordValid) {
                res.json({ success: true, token: userModel.generateJwt(), userId: user._id });
            } else {
                res.json({ success: false, msg: 'Wrong username/email or password' });
            }
        }
    });
});

router.post('/changePassword', function (req, res) {
    User.findById(req.body.userId, function (err, user) {
        if (err) throw err;

        if (user) {
            const { oldPassword, newPassword, repeatPassword } = req.body;
            const { hash, salt } = user;
            const userModel = new User();
            const isPasswordValid = userModel.validatePassword(oldPassword, hash, salt) && newPassword === repeatPassword;

            if (isPasswordValid) {
                const encryptedPassword = userModel.setPassword(newPassword);
                user.hash = encryptedPassword.hash;
                user.salt = encryptedPassword.salt;

                user.save(function (err) {
                    if (err) {
                        res.send({ success: false, msg: "Could't change password. Please try again later" });
                    } else {
                        res.send({
                            success: true,
                            msg: 'You have successfully changed your password'
                        })
                    }
                });
            } else {
                res.json({ success: false, msg: 'Wrong password' });
            }
        }
    });
});

module.exports = router;