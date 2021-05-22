const firebaseAdmin = require("firebase-admin");
const configs = require('../configs/configs')

const firebaseConfig = configs.firebaseAdminConfig;
const serviceAccount = require(firebaseConfig.credentialPath);
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: firebaseConfig.databaseURL,
    storageBucket: firebaseConfig.storageBucket,
});
console.log("Connected to project " + firebaseAdmin.app().name + " on Firebase Admin - Server");

module.exports = firebaseAdmin