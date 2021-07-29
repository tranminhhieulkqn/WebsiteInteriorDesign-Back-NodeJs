const router = require('express').Router();
const AppointmentController = require('../controllers/appointment.controller');

router.route('/create')
    .post(AppointmentController.create);

router.route('/get')
    .get(AppointmentController.getAllappointment);

router.route('/getByID')
    .get(AppointmentController.getByID); 

router.route('/getByUser')
    .get(AppointmentController.getAllByUser);

module.exports = router;