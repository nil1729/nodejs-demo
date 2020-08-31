if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config({ path: './config/config.env' });
}
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');

connectDB();

app.listen(PORT, () => {
	console.log(`Server started on ${process.env.NODE_ENV} mode at port ${PORT}`);
});
