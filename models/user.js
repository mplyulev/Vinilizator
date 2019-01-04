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
    hash: String,
    salt: String
});

userSchema.methods.setPassword = password => {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

    return this.hash;
};

userSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.validateEmailUsernameAccessibility = async (email, username) => {
    const errors = {};

    const sameEmailError = User.findOne({ email: email }).then(function(result) {
        if (result) {
            errors.emailError = true;
        }
    });

    const sameUsernameError = User.findOne({ username: username }).then(function(result) {
        if (result) {
            errors.usernameError = true
        }
    });

    return errors;
};

// userSchema.methods.validateUsernameAccessibility = username => {
//
//     return User.findOne({ username: username }).then(function(result) {
//         return result !== null;
//     });
// };

userSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports = User = mongoose.model('user', userSchema);