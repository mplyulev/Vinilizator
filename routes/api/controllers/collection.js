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

router.get('/getMarket', function(req, res) {
    const db = require('../../../config/keys').mongoURI;
    const usersCollection = db.getCollection('users');
    console.log(usersCollection);
    usersCollection.find('', function(err, result) {
        console.log(result);
        res.send({ success: true, collection: result});
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
            const isAlreadyInSellList = user.forSale && user.forSale.filter(vinyl => vinyl.id === req.body.release.id).length === 0 ? false : true;

            if (isAlreadyInSellList) {
                res.send({ success: false, msg: req.body.release.artists_sort + ' - ' + req.body.release.title + ' is already for sell!'});
            } else {
                user.forSale.push(req.body.release);
                user.save(function(err) {
                    if (err) {
                        res.send({ success: false, msg: "Could't add item for sell. Please try again later"});
                    } else {
                        res.send({
                            success: true,
                            msg: req.body.release.artists_sort + ' - ' + req.body.release.title + ' successfully added for sell!'
                        })
                    }
                });
            }
        }
    });
});

//Remove from sell
router.post('/removeFromSell', function(req, res) {
    User.findById(req.body.userId, function(err, user) {
        if (user) {
            const newSellList = user.forSale && user.forSale.filter(vinyl => {
                if (vinyl.id !== req.body.release.id) {
                    return vinyl;
                }
            });

            user.forSale = newSellList;

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
});

module.exports = router;