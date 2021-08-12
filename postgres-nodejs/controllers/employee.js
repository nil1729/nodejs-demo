const checker = require('../utils/checkFields'),
	ErrorResponse = require('../utils/ErrorResponse'),
	asyncHandler = require('../middleware/asyncHandler'),
	Employee = require('../models/Employee'),
	jwt = require('jsonwebtoken'),
	bcrypt = require('bcrypt'),
	sequelize = require('../db'),
	Insurance = require('../models/Insurance'),
	{ GoldInsurance, HealthInsurance, CovidInsurance } = require('../models/InsuranceTypes'),
	Ticket = require('../models/Ticket'),
	VALID_INSURANCE_TYPES = ['covid', 'health', 'gold'];

exports.registerHandler = asyncHandler(async (req, res, next) => {
	let { name, email, password } = req.body;

	// Check Body for required fields
	if (!name || !email || !password || (name && name.trim().length === 0)) {
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

	const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_LENGTH));

	let newUser = await Employee.create({
		name,
		email: email.toLowerCase(),
		password: hashedPassword,
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

	const user = await Employee.findOne({ where: { email } });
	if (!user) throw new ErrorResponse('Email address or password is incorrect', 403);

	const hashedPassword = user.password;
	const isMatch = await bcrypt.compare(password, hashedPassword);
	if (!isMatch) throw new ErrorResponse('Email address or password is incorrect', 403);

	req.responseData = {
		user: user.dataValues,
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
			employee: { ...user, password: undefined },
		},
	});
});

exports.getAllTickets = asyncHandler(async (req, res, next) => {
	let query = `
		SELECT 
			status, 
			ticket_id, 
			insurance_type,
			COALESCE(health_insurance_type, 'NA') as health_insurance_type,
			COALESCE(health_insurances.nominee_info, 'NA') as nominee_health,
			COALESCE(health_insurances.policy_no, 'NA') as policy_health,
			COALESCE(covid_insurances.nominee_info, 'NA') as nominee_covid,
			COALESCE(covid_insurances.policy_no, 'NA') as policy_covid,
			COALESCE(gold_insurances.policy_no, 'NA') as policy_gold,
			issue_date,
			end_date,
			application_date,
			insurances.insurance_id as insurance_id,
			users.user_id,
			COALESCE(gst_details, 'NA') as gst_details,
			comments,
            name, email, phone_number
		FROM users 
			INNER JOIN insurances ON insurances.user_id = users.user_id  
			INNER JOIN tickets ON insurances.insurance_id = tickets.insurance_id
			LEFT JOIN covid_insurances ON covid_insurances.insurance_id = insurances.insurance_id
			LEFT JOIN health_insurances ON health_insurances.insurance_id = insurances.insurance_id
			LEFT JOIN gold_insurances ON gold_insurances.insurance_id = insurances.insurance_id;
	`;

	const [results, metadata] = await sequelize.query(query);

	let responseData = results.map((ticket) => {
		let obj = { ...ticket };

		Object.keys(ticket).forEach((key) => {
			if (
				(key.startsWith('policy') || key.startsWith('nominee')) &&
				!key.endsWith(ticket.insurance_type)
			) {
				obj[key] = undefined;
			}
		});

		obj.policy_number = obj[`policy_${ticket.insurance_type}`];
		obj[`policy_${ticket.insurance_type}`] = undefined;

		if (obj[`nominee_${ticket.insurance_type}`]) {
			obj.nominee_info = obj[`nominee_${ticket.insurance_type}`];
			obj[`nominee_${ticket.insurance_type}`] = undefined;
		}

		if (ticket.insurance_type !== 'health') obj.health_insurance_type = undefined;
		if (ticket.insurance_type !== 'gold') obj.gst_details = undefined;

		return obj;
	});

	return res.json(responseData);
});

exports.updateTicket = asyncHandler(async (req, res, next) => {
	let { ticketId, issue_date, end_date, comments, policy_number } = req.body;

	if (!ticketId || (ticketId && !checker.uuid(ticketId)))
		throw new ErrorResponse('Invalid Ticket Id', 400);

	let ticket = await Ticket.findOne({ where: { ticketId } });
	if (!ticket) throw new ErrorResponse('Ticket not found', 404);

	let insurance = await Insurance.findOne({ where: { insuranceId: ticket.insuranceId } });
	let insuranceTypeInstance;

	if (insurance.insuranceType === 'covid') {
		insuranceTypeInstance = await CovidInsurance.findOne({
			where: { insuranceId: ticket.insuranceId },
		});
	}

	if (insurance.insuranceType === 'health') {
		await HealthInsurance.findOne({ where: { insuranceId: ticket.insuranceId } });
	}
	if (insurance.insuranceType === 'gold') {
		await GoldInsurance.findOne({ where: { insuranceId: ticket.insuranceId } });
	}

	if (policy_number) {
		insuranceTypeInstance.policyNo = policy_number;
	}

	if (comments) {
		ticket.comments = comments;
	}

	if (issue_date) {
		insurance.issue_date = new Date(issue_date);
	}
	if (end_date) {
		insurance.end_date = new Date(end_date);
	}

	await insurance.save();
	await ticket.save();
	await insuranceTypeInstance.save();

	return res.json({ insurance, ticket, insuranceTypeInstance });
});
