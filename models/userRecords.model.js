const { Model, schema, field } = require('firestore-schema-validator');

/**
 * Define schema Post in database.
 */
const userRecords = schema({
    userID: field('User ID').string().trim(),
    viewedPosts: field('Viewed Posts').array().default([]).nullable(),
    likedPosts: field('Liked Posts').array().default([]).nullable(),
    favoriteStyles: field('Favorite Styles').array().default([]).nullable(),
})

class UserRecordsModel extends Model {
    static get _collectionPath() {
        return 'userRecords'
    }

    static get _schema() {
        return userRecords
    }

    // this.toJSON() by default returns this._data,
    // but you might want to display it differently
    // (eg. don't show password in responses,
    // combine firstName and lastName into fullName, etc.)
    toJSON() {
        return {
            id: this._id, // ID of Document stored in Cloud Firestore
            createdAt: this._createdAt, // ISO String format date of Document's creation.
            updatedAt: this._updatedAt, // ISO String format date of Document's last update.
            userID: this.userID,
            viewedPosts: this.viewedPosts,
            likedPosts: this.likedPosts,
            favoriteStyles: this.favoriteStyles
        }
    }
}

module.exports = UserRecordsModel;