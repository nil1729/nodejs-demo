const ErrorResponse = require('../utils/ErrorResponse'),
	asyncHandler = require('../middleware/asyncHandler'),
	User = require('../models/User'),
	jwt = require('jsonwebtoken');

module.exports = asyncHandler(async (req, res, next) => {
	// Proceed for authentication
	let token;

	// Check request headers has a "authorization" key
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		// Set token from request headers
		token = req.headers.authorization.split(' ')[1]; // Bearer tokenXXX
	}

	const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	const user = await User.findOne({ where: { email: decodedToken.email } });

	if (!user)
		throw ErrorResponse(
			'Oops! No user found. Maybe your account disabled or permanently deleted.',
			403
		);

	req.user = user;
	next();
});
