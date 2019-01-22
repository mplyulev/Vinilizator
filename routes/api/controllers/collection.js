require('../config/passport');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../../../models/user");

router.get('/getCollection', function(req, res) {
    User.findById(passport.session.sessionID, function(err, user) {
        if (user) {
            const collectionType = req.query.collectionType;
            res.send({ success: true, collection: user[collectionType]});
        }
    });
});

// Add item to collection
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

//Remove item from collection
router.post('/removeFromCollection', function(req, res) {
    User.findById(passport.session.sessionID, function(err, user) {
        console.log(user);
        if (user) {
            const newCollection = user.vinylCollection && user.vinylCollection.filter(vinyl => {
                if (vinyl.id !== req.body.release.id) {
                    return vinyl;
                }
            });

            user.vinylCollection = newCollection;

            user.save(function(err) {
                if (err) {
                    res.send({ success: false, msg: "Could't remove item from collection. Please try again later" });
                } else {
                    res.send({
                        success: true,
                        msg: req.body.release.artists_sort + ' - ' + req.body.release.title + ' successfully removed from your collection!'
                    })
                }
            });
        }


    });
});

//Remove item from wishlist
router.post('/removeFromWishlist', function(req, res) {
    User.findById(passport.session.sessionID, function(err, user) {
        if (user) {
            const newWishlist = user.wishlist && user.wishlist.filter(vinyl => {
                if (vinyl.id !== req.body.release.id) {
                    return vinyl;
                }
            });

            user.wishlist = newWishlist;

            user.save(function(err) {
                if (err) {
                    console.log(error);
                    res.send({ success: false, msg: "Could't remove item from wishlist. Please try again later" });
                } else {
                    res.send({
                        success: true,
                        msg: req.body.release.artists_sort + ' - ' + req.body.release.title + ' successfully removed from your wishlist!'
                    })
                }
            });
        }
    });
});

//Add item to wishlist
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
                        res.send({ success: false, msg: "Could't add item to wishlist. Please try again later"});
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

module.exports = router;