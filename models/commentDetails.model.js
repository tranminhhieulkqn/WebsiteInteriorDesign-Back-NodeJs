const { Model, schema, field } = require('firestore-schema-validator');

/**
 * Define schema Like Details in database.
 */
const commentDetailsSchema = schema({
    postID: field('ID of Post').string().trim(),
    authorID: field('ID of the person who commented the Post').string().trim(),
    displayNameAuthor: field('Author\'s Display Name').string().trim(),
    authorAvatar: field('Avatar of the person who commented the Post').string().trim(),
    content: field('Comment Content').string().trim(),
    rated: field('Rated').number(),
    liked: field('List user liked comment.').array().default([]).nullable(),
    dateCreated: field('Date Created').date().nullable(),
})

class CommentDetailsModel extends Model {
    static get _collectionPath() {
        return 'commentDetails';
    }

    static get _schema() {
        return commentDetailsSchema;
    }

    static async checkExist(postID = '', authorID = '') {
        var likes = await this._collectionRef
            .where('postID', '==', postID)
            .where('authorID', '==', authorID)
            .get();
        var check = false;
        await likes.forEach((like) => {
            check = true;
        });
        return Boolean(check);
    }

    static async getCommentByIDPost(postID = '') {
        return await this.getAllBy('postID', postID);
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
            postID: this.postID,
            authorID: this.authorID,
            displayNameAuthor: this.displayNameAuthor,
            authorAvatar: this.authorAvatar,
            content: this.content,
            rated: this.rated,
            dateCreated: this.dateCreated,
        }
    }
}

module.exports = CommentDetailsModel;