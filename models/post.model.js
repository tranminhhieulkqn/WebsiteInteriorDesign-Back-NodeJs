const { Model, schema, field } = require('firestore-schema-validator');

/**
 * Define schema Post in database.
 */
const postSchema = schema({
    authorID: field('Author ID').string().trim(),
    tittle: field('Tittle').string().trim(),
    thumbnail: field('Thumbnail').string().trim(),
    gallery: field('Gallery').array().default([]).nullable(),
    sumary: field('Summary Content').string().trim().nullable(),
    content: field('Main Content').string().trim(),
    category: field('Category').string().trim().nullable(),
    keywords: field('Keywords').string().trim().nullable(),
    isPublic: field('Post Status').boolean().default(false),
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
            sumary: this.sumary,
            content: this.content,
            category: this.category,
            keywords: this.keywords,
            isPublic: this.isPublic,
            likeCount: this.likeCount
        }
    }
}

module.exports = PostModel;