require('../config/passport');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../../../models/user");

router.post('/addToCollection', function(req, res) {
    User.findById(passport.session.sessionID, function(err, user) {
        if (user) {
            const isVinylAlreadyAdded = user.vinylCollection && user.vinylCollection.filter(vinyl => vinyl.id === req.body.release.id).length === 0 ? false : true;

            if (isVinylAlreadyAdded) {
                res.send({ success: false, msg: req.body.release.artists_sort + ' - ' + req.body.release.title + ' is already added to your collection!'});
            } else {
                user.vinylCollection.push(req.body.release);
                user.save(function(err) {
                    if (err) {
                        res.send({ success: false, msg: "Could't add item to collection. Please try again later" });
                    } else {
                        res.send({
                            success: true,
                            msg: req.body.release.artists_sort + ' - ' + req.body.release.title + ' successfully added to your collection!'
                        })
                    }
                });
            }
        }
    });
});

router.post('/addToWishlist', function(req, res) {
    User.findById(passport.session.sessionID, function(err, user) {
        if (user) {
            const isVinylAlreadyAdded = user.wishlist && user.wishlist.filter(vinyl => vinyl.id === req.body.release.id).length === 0 ? false : true;

            if (isVinylAlreadyAdded) {
                res.send({ success: false, msg: req.body.release.artists_sort + ' - ' + req.body.release.title + ' is already added to your wishlist!'});
            } else {
                user.wishlist.push(req.body.release);
                user.save(function(err) {
                    if (err) {
                        res.send({ success: false, msg: "Could't add item to wishlist. Please try again later" });
                    } else {
                        res.send({
                            success: true,
                            msg: req.body.release.artists_sort + ' - ' + req.body.release.title + ' successfully added to your wishlist!'
                        })
                    }
                });
            }
        }
    });
});

router.post('/remove', function(req, res) {
    User.findOne( {
        $or: [
            { email : req.body.email },
            { username: req.body.email }
        ]
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({success: false, msg: 'Wrong username/email or password'});
        } else {
            const { password } = req.body;
            const {hash, salt} = user;
            const userModel = new User();
            const isPasswordValid = userModel.validatePassword(password, hash, salt);

            if (isPasswordValid) {
                res.json({success: true, token: userModel.generateJwt()});
            } else {
                res.json({success: false, msg: 'Wrong username/email or password'});
            }

        }
    });
});

module.exports = router;