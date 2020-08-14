const Customer = require('../models/Customer');
const { db } = require('./index');
const addCustomer = async customer => {
	try {
		const savedCustomer = await Customer.create(customer);
		console.info(`Customer added to Database with ID ${savedCustomer._id}`);
	} catch (e) {
		console.log("Mongoose Error! Customer didn't added to Database");
	}
	db.close();
};
const updateCustomer = async (customer, id) => {
	try {
		await Customer.updateOne({ _id: id }, customer);
		console.info(`Customer with ID ${id} Updated Successfully`);
	} catch (e) {
		console.log("Mongoose Error! Customer didn't updated to Database");
	}
	db.close();
};

const removeCustomer = async id => {
	try {
		await Customer.remove({ _id: id });
		console.info(`Customer with ID ${id} Removed Successfully`);
	} catch (e) {
		console.log("Mongoose Error! Customer didn't Deleted from Database");
	}
	db.close();
};

module.exports = {
	addCustomer,
	updateCustomer,
	removeCustomer,
};
