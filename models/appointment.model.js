
const { Model, schema, field } = require('firestore-schema-validator');

/**
 * Define schema Post in database.
 */
const appointmentSchema = schema({
    customerID: field('Customer ID').string().trim(),
    displayNameC: field('Customer Display Name').string().trim(),
    emailC: field('Customer\'s Email').string().trim(),
    phoneC: field('Customer\'s Phone').string().trim(),
    addressC: field('Customer\'s Address').string().trim(),

    designerID: field('Desinger ID').string().trim(),
    displayNameD: field('Designer Display Name').string().trim(),
    emailD: field('Designer\'s Email').string().trim(),
    phoneD: field('Designer\'s Phone').string().trim().nullable(),

    dateRange: field('Date Appointment').array().default([]),
    location: field('Location').string().trim(),
    transactionDetails: field('Transaction Details').string().trim(),
    dateCreated: field('Date Created').date().nullable(),
})
class AppointmentModel extends Model {
    static get _collectionPath() {
        return 'appointments'
    }

    static get _schema() {
        return appointmentSchema
    }

    toJSON() {
        return {
            id: this._id, // ID of Document stored in Cloud Firestore
            createdAt: this._createdAt, // ISO String format date of Document's creation.
            updatedAt: this._updatedAt, // ISO String format date of Document's last update.
            customerID: this.customerID,
            displayNameC: this.displayNameC,
            emailC: this.emailC,
            phoneC: this.phoneC,
            addressC: this.addressC,
            designerID: this.designerID,
            displayNameD: this.displayNameD,
            emailD: this.emailD,
            phoneD: this.phoneD,
            dateRange: this.dateRange,
            location: this.location,
            transactionDetails: this.transactionDetails,
            dateCreated: this.dateCreated,
        }
    }
}

module.exports = AppointmentModel;