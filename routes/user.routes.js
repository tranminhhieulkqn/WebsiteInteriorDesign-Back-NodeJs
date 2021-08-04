const router = require('express').Router();
const authorize = require('../middleware/authorize.guard')
const UserController = require('../controllers/user.controller');

const roles = authorize.roles;

// request parameter query: body.all
router.route('/register')
    .post(UserController.register);

// request parameter query: password
router.route('/hashpassword')
    .get(UserController.hashPassword);

// request parameter: email, password
router.route('/login')
    .post(UserController.login);

// not request parameter query
router.route('/get')
    .get(UserController.getAllUser);

router.route('/getWithPagination')
    .get(UserController.getUserPagination);

router.route('/getByRole')
    .get(UserController.getAllByRole);

router.route('/getByRecommendedDesigner')
    .get(UserController.getRecommendedDesignerbyIDUser);

// request parameter query: id(userID) or email
router.route('/getBy')
    .get(UserController.getUserBy);

// request parameter query: body.all
router.route('/update')
    .put(UserController.update);

// request parameter query: email, newPassword
router.route('/changepassword')
    .put(UserController.changePassword);

// request parameter query: id(userID)
router.route('/delete')
    .delete(authorize.permit([roles.admin]), UserController.delete);

module.exports = router