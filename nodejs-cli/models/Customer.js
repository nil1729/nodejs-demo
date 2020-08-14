const mongoose = require('mongoose');

const customerSchema = mongoose.Schema(
	{
		firstName: { type: String },
		lastName: { type: String },
		email: { type: String },
		phone: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
