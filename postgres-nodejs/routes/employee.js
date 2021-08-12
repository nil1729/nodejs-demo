const express = require('express'),
	router = express.Router(),
	checkEmployee = require('../middleware/checkEmployee'),
	{
		registerHandler,
		sendTokenResponse,
		loginHandler,
		getAllTickets,
		updateTicket,
	} = require('../controllers/employee');

router.route('/register').post(registerHandler, sendTokenResponse);
router.route('/login').post(loginHandler, sendTokenResponse);

router.route('/tickets').get(checkEmployee, getAllTickets);
router.route('/tickets/update').put(checkEmployee, updateTicket);

module.exports = router;
