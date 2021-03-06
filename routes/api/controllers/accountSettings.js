const express = require('express');
const router = express.Router();
const User = require("../../../models/user");



//Save favorites
router.post('/saveFavorites', function(req, res) {
    User.findById(req.body.userId, function(err, user) {
        if (user) {
            user.favoriteStyles = req.body.favoriteStyles;
            user.save();
        }
    });
});

//Toggle visibility of records marked for sell in private collection
router.post('/toggleSellingVisibility', function(req, res) {
    User.findById(req.body.userId, function(err, user) {
        if (user) {
            user.shouldShowSelling = req.body.shouldShowSelling;
            user.save();
        }
    });
});

router.post('/togglePlayer', function(req, res) {
    User.findById(req.body.userId, function(err, user) {
        if (user) {
            user.playTracksFromFavorites = req.body.playTracksFromFavorites;
            user.save();    
        }
    });
});

router.post('/toggleCollectionVisibility', function(req, res) {
    User.findById(req.body.userId, function(err, user) {
        if (user) {
            user.hideCollection = req.body.hideCollection;
            user.save();
        }
    });
});


//Remove style from favorites
router.get('/getFavoriteStyles', function(req, res) {
    User.findById(req.query.userId, function(err, user) {
        if (user) {
            res.send({ success: true, favoriteStyles: user.favoriteStyles});
        }
    });
});

module.exports = router;