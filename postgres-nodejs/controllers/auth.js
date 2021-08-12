const checker = require('../utils/checkFields'),
	ErrorResponse = require('../utils/ErrorResponse'),
	asyncHandler = require('../middleware/asyncHandler'),
	User = require('../models/User'),
	jwt = require('jsonwebtoken'),
	bcrypt = require('bcrypt');

exports.registerHandler = asyncHandler(async (req, res, next) => {
	let { name, email, password, phoneNumber } = req.body;

	// Check Body for required fields
	if (!name || !email || !password || !phoneNumber || (name && name.trim().length === 0)) {
		throw new ErrorResponse('Please provide all required fields', 400);
	}

	// Check for Valid inputs
	name = name.replace(/\s{2,}/g, ' ');
	if (!checker.alphabetic(name)) {
		throw new ErrorResponse('Please provide a Name with only alphabetic characters', 400);
	}

	if (!checker.email(email)) {
		throw new ErrorResponse('Please provide a valid email address', 400);
	}

	if (!checker.phoneNumber(phoneNumber)) {
		throw new ErrorResponse('Please provide a valid Indian phone number', 400);
	}

	// if (!checker.password(password)) {
	// 	throw new ErrorResponse('Please provide a strong password', 400);
	// }
	const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_LENGTH));
	let mobileNumber = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber;

	let newUser = await User.create({
		name,
		email: email.toLowerCase(),
		password: hashedPassword,
		phoneNumber: mobileNumber,
	});

	req.responseData = {
		user: newUser.dataValues,
		statusCode: 201,
		message: 'Registration Successful',
	};

	next();
});

exports.loginHandler = asyncHandler(async (req, res, next) => {
	let { email, password } = req.body;

	// Check Body for required fields
	if (!email || !password) {
		throw new ErrorResponse('Please provide all required fields', 400);
	}
	if (!checker.email(email)) {
		throw new ErrorResponse('Please provide a valid email address', 400);
	}

	const user = await User.findOne({ email });
	if (!user) throw new ErrorResponse('Email address or password is incorrect', 403);

	const hashedPassword = user.password;
	const isMatch = await bcrypt.compare(password, hashedPassword);
	if (!isMatch) throw new ErrorResponse('Email address or password is incorrect', 403);

	req.responseData = {
		user,
		statusCode: 200,
		message: 'Login Successful',
	};

	next();
});

// Send Token with Cookie
exports.sendTokenResponse = asyncHandler(async (req, res, next) => {
	const { user, statusCode, message } = req.responseData;

	// Create Token
	const accessToken = await jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});

	res.status(statusCode).json({
		success: true,
		message,
		responses: {
			accessToken,
			user,
		},
	});
});
