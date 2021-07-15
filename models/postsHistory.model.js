const { Model, schema, field } = require('firestore-schema-validator');

/**
 * Define schema Post in database.
 */
const postsHistory = schema({
    id_cus: field('ID customer').string().trim(),
    viewed_posts: field('Posts Viewed').array().default([]).nullable(),
    liked_posts: field('Posts Liked').array().default([]).nullable(),
})

class PostsHistoryModel extends Model {
    static get _collectionPath() {
        return 'postsviewed'
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
            pid: this._id, // ID of Document stored in Cloud Firestore
            createdAt: this._createdAt, // ISO String format date of Document's creation.
            updatedAt: this._updatedAt, // ISO String format date of Document's last update.
            id_cus: this.id_cus,
            viewed_posts: this.viewed_posts,
            liked_posts: this.liked_posts,
        }
    }
}

module.exports = PostsHistoryModel;