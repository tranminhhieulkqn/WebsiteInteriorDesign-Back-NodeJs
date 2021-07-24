const { Model, schema, field } = require('firestore-schema-validator');

const predictResultSchema = schema({
    userID: field('User ID').string().trim(),
    imageURL: field('Image URL').string().trim(),
    status: field('Status').string().trim().default('private'),
    labelPredict: field('Label Predict').string().trim(),
    probability :field('Probability').array().default([]),
    dateCreated: field('Date Created').date().nullable(),
})


class PredictResultModel extends Model {
    static get _collectionPath() {
        return 'predictResult'
    }

    static get _schema() {
        return predictResultSchema
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
            imageURL: this.imageURL,
            status: this.status,
            labelPredict: this.labelPredict,
            probability: this.probability,
            dateCreated: this.updatedAt
        }
    }
}


module.exports = PredictResultModel;