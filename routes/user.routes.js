const router = require('express').Router();
const authorize = require('../middleware/authorize.guard')
const UserController = require('../controllers/user.controller');

const roles = authorize.roles;

router.route('/register')
    .post(UserController.register);

router.route('/login')
    .post(UserController.login);

router.route('/get')
    .get(UserController.getAllUser);

router.route('/get/:id')
    .get(UserController.getUserByID);

router.route('/update/:id')
    .put(UserController.update);

router.route('/changepassword/:id')
    .put(UserController.changePassword);

router.route('/delete/:id')
    .delete(authorize.permit([roles.admin]), UserController.delete);

module.exports = router