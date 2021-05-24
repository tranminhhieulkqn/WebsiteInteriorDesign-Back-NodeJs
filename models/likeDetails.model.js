const { Model, schema, field } = require('firestore-schema-validator');

/**
 * Define schema Like Details in database.
 */
const likeDetailsSchema = schema({
    authorID: field('ID of the person who liked the Post').string().trim(),
    postID: field('ID of Post').string().trim()
})

class LikeDetailsModel extends Model {
    static get _collectionPath() {
        return 'likeDetails';
    }

    static get _schema() {
        return likeDetailsSchema;
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

    static async getByIDPost(postID = '') {
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
            authorID: this.authorID,
            postID: this.postID
        }
    }
}

module.exports = LikeDetailsModel;