const router = require('express').Router();

const UserRecords = require('../controllers/userRecords.controller');

router.route('/view')
    .post(UserRecords.viewPost);

router.route('/saveFavorite')
    .post(UserRecords.saveFavorite);

router.route('/get')
    .get(UserRecords.getAllUserRecord);

router.route('/getByUser')
    .get(UserRecords.getUserRecordByUser);


module.exports = router;