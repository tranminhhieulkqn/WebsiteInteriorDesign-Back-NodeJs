const { Model, schema, field } = require('firestore-schema-validator');

/**
 * Define schema Post in database.
 */
const postSchema = schema({
    authorID: field('Author ID').string().trim(),
    title: field('Title').string().trim(),
    summary: field('Summary Content').string().trim().nullable(),
    thumbnail: field('Thumbnail').string().trim().nullable(),
    content: field('Main Content').string().trim().nullable(),
    gallery: field('Gallery').array().default([]).nullable(),
    category: field('Category').array().default([]).nullable(),
    keywords: field('Keywords').array().default([]).nullable(),
    status: field('Post Status').string().default('draft'),
    likeCount: field('Like Count').number().default(0)
})

class PostModel extends Model {
    static get _collectionPath() {
        return 'posts'
    }

    static get _schema() {
        return postSchema
    }

    get likeCount() {
        return this.likeCount;
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
            tittle: this.tittle,
            thumbnail: this.thumbnail,
            gallery: this.gallery,
            summary: this.summary,
            content: this.content,
            category: this.category,
            keywords: this.keywords,
            status: this.status,
            likeCount: this.likeCount
        }
    }
}

module.exports = PostModel;