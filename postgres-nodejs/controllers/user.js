const ErrorResponse = require('../utils/ErrorResponse'),
	asyncHandler = require('../middleware/asyncHandler'),
	User = require('../models/User'),
	sequelize = require('../db'),
	Insurance = require('../models/Insurance'),
	{ GoldInsurance, HealthInsurance, CovidInsurance } = require('../models/InsuranceTypes'),
	Ticket = require('../models/Ticket'),
	VALID_INSURANCE_TYPES = ['covid', 'health', 'gold'];

exports.applyForInsurance = asyncHandler(async (req, res, next) => {
	let { insuranceType, nomineeInfo, healthInsuranceType, gstDetails } = req.body;

	// Check Body for required fields
	if (
		!insuranceType ||
		(insuranceType && !VALID_INSURANCE_TYPES.includes(insuranceType.toLowerCase()))
	) {
		throw new ErrorResponse('Please provide a valid insurance type you apply for', 400);
	}

	let newInsurance = await Insurance.create({
		userId: req.user.userId,
		insuranceType,
	});

	if (insuranceType === 'covid') {
		await CovidInsurance.create({ nomineeInfo, insuranceId: newInsurance.insuranceId });
	}
	if (insuranceType === 'health') {
		await HealthInsurance.create({
			nomineeInfo,
			healthInsuranceType,
			insuranceId: newInsurance.insuranceId,
		});
	}
	if (insuranceType === 'gold') {
		await GoldInsurance.create({ gstDetails, insuranceId: newInsurance.insuranceId });
	}

	let newTicket = await Ticket.create({ insuranceId: newInsurance.insuranceId });
	return res.json(newTicket);
});

exports.getTickets = asyncHandler(async (req, res, next) => {
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
			comments
		FROM users 
			INNER JOIN insurances ON insurances.user_id = users.user_id  
			INNER JOIN tickets ON insurances.insurance_id = tickets.insurance_id
			LEFT JOIN covid_insurances ON covid_insurances.insurance_id = insurances.insurance_id
			LEFT JOIN health_insurances ON health_insurances.insurance_id = insurances.insurance_id
			LEFT JOIN gold_insurances ON gold_insurances.insurance_id = insurances.insurance_id
		WHERE users.user_id = '${req.user.userId}';
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
		obj.user_id = undefined;

		return obj;
	});

	return res.json(responseData);
});
