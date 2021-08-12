const ErrorResponse = require('../utils/ErrorResponse');

module.exports = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;
	error.errors = err.errors;
	console.log(err);

	// JWT Error
	if (err.name === 'JsonWebTokenError') {
		const message = `Session Expired. Please login again.`;
		error = new ErrorResponse(message, 401);
	}

	return res.status(error.statusCode || 500).json({
		success: false,
		message: error.message.trim() || 'Something went wrong! Please try again.',
		errors: error.errors,
	});
};
