const path = require('path');
const assert = require('assert');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../environments/.env') });

const {
    HOST,
    PORT,
    HOST_URL,
    SECRET_KEY,
    CREDENTIAL_PATH,
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
    FILE_SIZE_MAX,
} = process.env;

assert(HOST, 'HOST is required');
assert(PORT, 'PORT is required');
assert(CREDENTIAL_PATH, 'CREDENTIAL PATH is required');
assert(DATABASE_URL, 'DATABASE URL is required');
assert(STORAGE_BUCKET, 'STORAGE BUCKET is required');

module.exports = {
    host: HOST,
    port: PORT,
    url: HOST_URL,
    secretKey: SECRET_KEY,
    credentialPath: CREDENTIAL_PATH,
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    storageBucket: STORAGE_BUCKET,
    projectId: PROJECT_ID,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
    firebaseAdminConfig: {
        credentialPath: CREDENTIAL_PATH,
        databaseURL: DATABASE_URL,
        storageBucket: STORAGE_BUCKET
    },
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        databaseURL: DATABASE_URL,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID,
        measurementId: MEASUREMENT_ID
    },
    fileSizeMax: FILE_SIZE_MAX,
}