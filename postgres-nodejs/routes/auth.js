const express = require('express'),
	router = express.Router(),
	{ registerHandler, sendTokenResponse, loginHandler } = require('../controllers/auth');

router.route('/register').post(registerHandler, sendTokenResponse);
router.route('/login').post(loginHandler, sendTokenResponse);

module.exports = router;
