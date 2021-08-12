const express = require('express'),
	router = express.Router(),
	checkAuthentication = require('../middleware/checkAuthentication'),
	{ applyForInsurance, getTickets } = require('../controllers/user');

router.route('/apply').post(checkAuthentication, applyForInsurance);
router.route('/tickets').get(checkAuthentication, getTickets);

module.exports = router;
