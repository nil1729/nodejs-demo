const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Only in Development Environment
if (process.env.NODE_ENV !== 'production') {
	// load env vars
	dotenv.config({ path: './config/config.env' });
}

const app = express();

// Connect Database
connectDB();

// Body Parser
app.use(express.json());

// Enable cors
app.use(cors());

// Set Static Folders
app.use(express.static(__dirname + '/public'));

// Routes
app.use('/api/v1/stores', require('./routes/stores'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server started in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
