const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    vinylCollection: {
        type: Array
    },
    wishlist: {
        type: Array
    },
    favoriteStyles: {
        type: Array
    },
    shouldShowSelling: {
        type: Boolean
    },
    hideCollection: {
        type: Boolean
    },
    playTracksFromCollection: {
        type: Boolean
    },
    playTracksFromFavorites: {
        type: Boolean
    },
    hash: String,
    salt: String
});

userSchema.methods.setPassword = password => {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.hash = crypto.pbkdf2Sync(password, new Buffer(this.salt,'binary'), 1000, 64, 'sha1').toString('base64');
    const encryptedPassword = {
        hash: this.hash,
        salt: this.salt
    };
    return encryptedPassword;
};

userSchema.methods.validatePassword = function(password, hash, salt) {
    const currentHash = crypto.pbkdf2Sync(password, new Buffer(salt,'binary'), 1000, 64, 'sha1').toString('base64');
    return hash === currentHash;
};

userSchema.methods.validateEmailUsernameAccessibility = (email, username) => {
    const errors = {};
    return User.findOne( {
        $or: [
            { email : email },
            { username: username }
        ]
    }).then(function(user) {
        if (user && user.email === email) {
            errors.email = true;
        }

        if (user && user.username === username) {
            errors.username = true;
        }

       return errors
    });
};

userSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, 'asdq34dfagdfsg');
};

module.exports = User = mongoose.model('user', userSchema);