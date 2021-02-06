#!/usr/bin/env node
require('dotenv').config();
const { connectDB } = require('./db');
const commander = require('./commands');
connectDB();
commander();
