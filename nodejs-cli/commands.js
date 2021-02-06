const { program } = require('commander');
const { prompt, questions } = require('./questions');
const {
	addCustomer,
	updateCustomer,
	removeCustomer,
	findCustomer,
	listCustomers,
} = require('./db/customers');

module.exports = async () => {
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
};
