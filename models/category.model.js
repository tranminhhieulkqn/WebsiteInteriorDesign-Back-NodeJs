const { Model, schema, field } = require('firestore-schema-validator');

/**
 * Define schema Post in database.
 */
const categorySchema = schema({
    name: field('Name').string().trim(),
    summary : field('Summary').string().trim().nullable(),
    description_first: field('Description Fisrt').string().trim().nullable(),
    description_second: field('Description Second').string().trim().nullable(),
    images_feature: field('Image Feature').array().default([]).nullable(),
    images: field('Image').array().default([]).nullable(),
})

class CategoryModel extends Model {
    static get _collectionPath() {
        return 'categories'
    }

    static get _schema() {
        return categorySchema
    }

    // this.toJSON() by default returns this._data,
    // but you might want to display it differently
    // (eg. don't show password in responses,
    // combine firstName and lastName into fullName, etc.)
    toJSON() {
        return {
            cid: this._id, // ID of Document stored in Cloud Firestore
            createdAt: this._createdAt, // ISO String format date of Document's creation.
            updatedAt: this._updatedAt, // ISO String format date of Document's last update.
            name: this.name,
            description: this.description,
            images: this.images,
        }
    }
}

module.exports = CategoryModel;