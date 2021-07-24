const router = require('express').Router();
const PredictResult = require('../controllers/predictResult.controller');

router.route('/create')
    .post(PredictResult.create);

router.route('/get')
    .get(PredictResult.getAllPredictResult);

router.route('/update')
    .put(PredictResult.update);


module.exports = router;