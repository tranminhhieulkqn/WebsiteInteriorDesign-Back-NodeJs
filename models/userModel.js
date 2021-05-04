var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

/**
 * Define table User in database.
 */
var UserSchema = new mongoose.Schema({
    firstName: { type: String, },
    lastName: { type: String, },
    birthDay: { type: Date, default: Date.now },
    gender: { type: Boolean, required: true, default: true }, // true for male, false for female
    username: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    avatarURL: { type: String },
    phone: { type: String, minLength: 10, manLength: 11 },
    email: { type: String, required: true, lowercase: true, unique: true },
    address: { type: String, maxLenth: 100 },
    role: { type: String, lowercase: true, default: 'user' }
});

/**
 * Sample json to create User
    Method: POST
    {
         "firstName" : "Tran Minh",
         "lastName" : "Hieu",
         "birthDate": "",
         "gender": true,
         "username" : "tranminhhieu",
         "password" : "hieu",
         "phone" : "0354176292",
         "email" : "tranminhhieulkqn@gmail.com",
         "address" : "Duc Loi, Mo Duc, Quang Ngai",
         "role" : "admin"
    }
 */

/**
 * Bcrypt middleware on UserSchema
 */
UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

/**
 * Password verification
 * @param {String} password 
 * @returns verification result
 */
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

/**
 * Make this available to our users in our Node applications
 */
module.exports = mongoose.model('User', UserSchema);