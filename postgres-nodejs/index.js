if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// Importing all necessary modules
const express = require('express'),
	authRoutes = require('./routes/auth'),
	userRoutes = require('./routes/user'),
	employeeRoutes = require('./routes/employee'),
	errorHandler = require('./middleware/errorHandler'),
	sequelize = require('./db'),
	app = express();

// Middleware read JSON Request Body
app.use(express.json());

// use logger for development
if (process.env.NODE_ENV !== 'production') {
	app.use(require('morgan')('dev'));
	app.use(require('cors')());
}

// PORT for this Web Application
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		console.log('Database connection has been established successfully.');
		console.log(`Server started on port ${PORT}.`);
	} catch (err) {
		console.error('Unable to connect to the database:', err);
	}
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/employee', employeeRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Handle unhandled Promise rejections
process.on('unhandledRejection', (err) => {
	console.log(`Error: ${err.message}`);

	// Closed the Server
	server.close(() => {
		sequelize.close();
		console.log('Server closed due to unhandled promise rejection');
		process.exit(1);
	});
});
