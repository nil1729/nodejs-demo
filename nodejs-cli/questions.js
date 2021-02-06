const inquirer = require('inquirer');
const questions = [
	{
		type: 'input',
		name: 'firstName',
		message: 'Customer First Name',
	},
	{
		type: 'input',
		name: 'lastName',
		message: 'Customer Last Name',
	},
	{
		type: 'input',
		name: 'email',
		message: 'Customer Email Address',
	},
	{
		type: 'number',
		name: 'phone',
		message: 'Customer Phone Number',
	},
];

const prompt = inquirer.createPromptModule();

module.exports = {
	prompt,
	questions,
};
