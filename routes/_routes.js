var express = require('express');
var router = express.Router();
const roles = require('../helper/roles')
const authorize = require('../middleware/authorize')
var IndexController = require('../controllers/indexController');

router.route('/')
    .get(authorize.permit([]), IndexController.getWelcomeMessage);

module.exports = router;