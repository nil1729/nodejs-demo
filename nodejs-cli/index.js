require('dotenv').config();
const {
	addCustomer,
	updateCustomer,
	removeCustomer,
	findCustomer,
	listCustomers,
} = require('./db/customers');
const { connectDB } = require('./db');
const inquirer = require('inquirer');

connectDB();

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

const { program } = require('commander');
program
	.version('1.2.0')
	.description('Customer management System Using NodeJS CLI');

program
	.command('add')
	.alias('a')
	.description('Add a Customer to Database')
	.action(() => {
		prompt(questions).then(answer => addCustomer(answer));
	});
program
	.command('update <id>')
	.alias('u')
	.description('Update an existing Customer with given ID')
	.action(id => {
		prompt(questions).then(answer => updateCustomer(answer, id));
	});
program
	.command('remove <id>')
	.alias('r')
	.description('Remove an existing Customer with given ID')
	.action(id => removeCustomer(id));
program
	.command('find <name>')
	.alias('f')
	.description('Find Customers with given Name')
	.action(name => findCustomer(name));
program
	.command('list')
	.alias('l')
	.description('Find all Customers saved on Database')
	.action(listCustomers);
program.parseAsync(process.argv);
