const { Model, schema, field } = require('firestore-schema-validator');

/**
 * Define schema Post in database.
 */
const postsHistory = schema({
    userID: field('User ID').string().trim(),
    viewedPosts: field('Viewed Posts').array().default([]).nullable(),
    likedPosts: field('Liked Posts').array().default([]).nullable(),
})

class PostsHistoryModel extends Model {
    static get _collectionPath() {
        return 'postsHistory'
    }

    static get _schema() {
        return postsHistory
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
        }
    }
}

module.exports = PostsHistoryModel;