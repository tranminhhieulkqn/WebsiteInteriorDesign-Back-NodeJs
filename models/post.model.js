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
    category: field('Category').string().default("Interior Design").nullable(),
    keywords: field('Keywords').array().default([]).nullable(),
    dateCreated: field('Date Created').date().nullable(),
    status: field('Post Status').string().default('draft'),
    liked: field('List Liked User').array().default([]),
    averageRating: field('Average Rating').number().default(0),
    mainColor: field('Main color').array().default([]),
    pattern: field('Pattern').array().default([]),
    displayNameAuthor: field('Author\'s Display Name').string().trim(),
    authorAvatar: field('Avatar of the person who commented the Post').string().trim(),
})

class PostModel extends Model {
    static get _collectionPath() {
        return 'posts'
    }

    static get _schema() {
        return postSchema
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
            authorID: this.authorID,
            title: this.title,
            summary: this.summary,
            thumbnail: this.thumbnail,
            content: this.content,
            gallery: this.gallery,
            category: this.category,
            keywords: this.keywords,
            dateCreated: this.dateCreated,
            status: this.status,
            liked: this.liked,
            averageRating: this.averageRating,
            mainColor: this.mainColor,
            pattern: this.pattern,
            displayNameAuthor: this.displayNameAuthor,
            authorAvatar: this.authorAvatar
        }
    }
}

module.exports = PostModel;