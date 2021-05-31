const moment = require('moment');
const bcrypt = require('bcrypt');
const { Model, schema, field } = require('firestore-schema-validator');

const saltRounds = 10;

/**
 * Define schema User in database.
 */
const userSchema = schema({
    iud: field('User ID').string().trim(),
    displayName: field('Display Name').string().trim().nullable(),
    gender: field('Gender').boolean().default(true).nullable(),
    password: field('Password').string()
        .match(/[A-Z]/, '%s must contain an uppercase letter.')
        .match(/[a-z]/, '%s must contain a lowercase letter.')
        .match(/[0-9]/, '%s must contain a digit.')
        .minLength(8),
    email: field('Email Address').string().email(),
    emailVerificationCode: field('Email Verification Code').string().nullable(),
    avatarURL: field('Avatar image').string().nullable(),
    birthDate: field('Birth Date')
        .date('YYYY-MM-DD')
        .before(
            moment()
                .subtract(13, 'years')
                .toISOString(),
            'You must be at least 13 years old.',
        ).nullable(),
    phone: field('Phone Number').string().nullable(),
    address: field('Address').string().nullable(),
    about: field('About').string().nullable(),
    followed: field('Users Followed').array().default([]).nullable(),
    role: field('Role User').string().default('user'),
    status: field('Usage Status').string().default('using')
})

class UserModel extends Model {
    static get _collectionPath() {
        return 'users'
    }

    static get _schema() {
        return userSchema
    }

    checkPassword(password) {
        return bcrypt.compareSync(password, this._data.password);
    }

    // You can define additional methods...
    static async getByEmail(email) {
        return await this.getBy('email', email)
    }

    // ... or getters.
    get isEmailVerified() {
        return Boolean(this._data.emailVerificationCode)
    }

    get displayName() {
        return `${this._data.displayName}`
    }

    // this.toJSON() by default returns this._data,
    // but you might want to display it differently
    // (eg. don't show password in responses,
    // combine firstName and lastName into displayName, etc.)
    toJSON() {
        return {
            id: this._id, // ID of Document stored in Cloud Firestore
            createdAt: this._createdAt, // ISO String format date of Document's creation.
            updatedAt: this._updatedAt, // ISO String format date of Document's last update.
            displayName: this.displayName,
            email: this.email,
            isEmailVerified: this.isEmailVerified,
            role: this.role,
            gender: this.gender,
            avatarURL: this.avatarURL,
            birthDate: this.birthDate,
            phone: this.phone,
            address: this.address,
            followed: this.followed,
            role: this.role,
            status: this.status
        }
    }
}

UserModel.prehook('password', (data, user) => {
    try {
        const hashPass = bcrypt.hashSync(user.password, saltRounds);
        user.password = hashPass;
    } catch (error) {
        console.error(error);
    }
})

UserModel.on('save', async (user) => {
    try {
        user.about = user.about | `I'm ${user.displayName}`;
        user.emailVerificationCode = user.email;
        const hashPass = bcrypt.hashSync(user.password, saltRounds);
        user.password = hashPass;
    } catch (error) {
        console.error(error);
    }
})

UserModel.on('updated', async (user) => {
    try {
        user.about = user.about | `I'm ${user.displayName}`;
        user.emailVerificationCode = user.email;
        const hashPass = bcrypt.hashSync(user.password, saltRounds);
        user.password = hashPass;
    } catch (error) {
        console.error(error);
    }
})

module.exports = UserModel