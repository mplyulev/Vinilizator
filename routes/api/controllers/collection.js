require('../config/passport');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../../../models/user");

router.get('/getCollection', function(req, res) {
    User.findById(req.query.userId, function(err, user) {
        if (user) {
            const collectionType = req.query.collectionType;
            res.send({ success: true, collection: user[collectionType]});
        }
    });
});


//Get all selling vinyls from all users
router.get('/getMarket', function(req, res) {
    let allSelling = [];
    User.find({}, function(err, result) {
        result.map(user => {
            user.vinylCollection.filter(vinyl => {
                if (vinyl.forSale) {
                    allSelling.push(vinyl);
                };
            });
        });

        res.send({ success: true, collection: allSelling});
    });
});

// Add item to collection
router.post('/addToCollection', function(req, res) {
    User.findById(req.body.userId, function(err, user) {
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
    User.findById(req.body.userId, function(err, user) {
        if (user) {
            const newCollection = user.vinylCollection && user.vinylCollection.filter(vinyl => {
                if (vinyl.id !== req.body.release.id) {
                    return vinyl;
                }
            });

            const newSellList = user.forSale && user.forSale.filter(vinyl => {
                if (vinyl.id !== req.body.release.id) {
                    return vinyl;
                }
            });

            user.forSale = newSellList;

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
    User.findById(req.body.userId, function(err, user) {
        if (user) {
            const newWishlist = user.wishlist && user.wishlist.filter(vinyl => {
                if (vinyl.id !== req.body.release.id) {
                    return vinyl;
                }
            });

            user.wishlist = newWishlist;

            user.save(function(err) {
                if (err) {
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
    User.findById(req.body.userId, function(err, user) {
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

//Add to sell list
router.post('/addToSellList', function(req, res) {
    User.findById(req.body.userId, function(err, user) {
        if (user) {
            let isAlreadyInSellList;
            user.vinylCollection.map((vinyl, index) => {
                if (vinyl.id === req.body.release.id) {
                    isAlreadyInSellList = vinyl.forSale ? true : false

                    if (isAlreadyInSellList) {
                        res.send({
                            success: false,
                            msg: req.body.release.artists_sort + ' - ' + req.body.release.title + ' is already for sell!'
                        });
                    } else {
                        vinyl.forSale = true;
                        vinyl.soldBy = user.username;
                        vinyl.notes = req.body.sellData.notes;
                        vinyl.price = req.body.sellData.price;
                        vinyl.condition = req.body.sellData.condition;
                        user.vinylCollection.splice(index, 1, vinyl);
                        user.save(function(err) {
                            if (err) {
                                res.send({ success: false, msg: "Could't add item for sell. Please try again later" });
                            } else {
                                res.send({
                                    success: true,
                                    msg: req.body.release.artists_sort + ' - ' + req.body.release.title + ' successfully added for sell!'
                                })
                            }
                        });
                    }
                    return;
                }
            });
        }
    });
});

//Remove from sell
router.post('/removeFromSell', function(req, res) {
    User.findById(req.body.userId, function(err, user) {
        if (user) {
            user.vinylCollection && user.vinylCollection.map((vinyl, index) => {
                if (vinyl.id === req.body.release.id && vinyl.forSale) {
                    vinyl.forSale = false;
                    user.vinylCollection.splice(index, 1, vinyl);
                    user.save(function(err) {
                        if (err) {
                            res.send({ success: false, msg: "Could't remove item from sell. Please try again later" });
                        } else {
                            res.send({
                                success: true,
                                msg: req.body.release.artists_sort + ' - ' + req.body.release.title + ' successfully removed item from sell list!'
                            })
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;