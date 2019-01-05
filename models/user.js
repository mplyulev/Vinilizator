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
    const encryptedPassword = {
        hash: this.hash,
        salt: this.salt
    };

    return encryptedPassword;
};

userSchema.methods.validatePassword = function(password, hash, salt) {
    const currentHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
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
    }, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports = User = mongoose.model('user', userSchema);