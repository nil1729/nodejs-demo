if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const mysql = require('mysql');
const app = express();
const bcrypt = require('bcrypt');

// Connection
const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_USER_PASSWORD,
	database: process.env.DB_DATABASE,
});

// Connect to Database
db.connect((err) => {
	if (err) {
		throw err;
	}
	console.log('Database Connected');
});

app.use(express.json());
/**
 *
 * Create new Database
 *
 */
app.get('/create/database', (req, res) => {
	let query = `CREATE DATABASE testing_db_api`;

	db.query(query, (error, results) => {
		if (error) throw error;
		console.log(results);
		res.send('Database Created ....');
	});
});

/**
 *
 * Create a Users Table
 *
 */
app.get('/create/table/users', (req, res) => {
	let query = `
        create table users(
            id int auto_increment,
            first_name varchar(100),
            last_name varchar(100),
            email varchar(75),
            password varchar(255),
            location varchar(75),
            dept varchar(75) default "development",
            is_admin tinyint default 0,
            register_date datetime default current_timestamp,
            primary key(id)
        );
    `;
	db.query(query, (error, results) => {
		if (error) throw error;
		console.log(results);
		res.send('Users table Created ....');
	});
});

/**
 *
 * Create a Posts Table
 *
 */
app.get('/create/table/posts', (req, res) => {
	let query = `
        create table posts(
            id int auto_increment,
            user_id int,
            body text,
            title varchar(100),
            publish_date datetime default current_timestamp,
            primary key(id),
            foreign key(user_id) references users(id)
        );
    `;
	db.query(query, (error, results) => {
		if (error) throw error;
		console.log(results);
		res.send('Posts table Created ....');
	});
});

/**
 *
 * Data insertion to tables
 *
 */
app.post('/add/users', (req, res) => {
	let {
		firstName,
		lastName,
		password,
		email,
		location,
		dept,
		is_admin,
	} = req.body;

	bcrypt.hash(password, 10, (err, hash) => {
		if (err) throw err;
		password = hash.toString();
		let query = `
            insert into users (first_name, last_name, email, password, location, is_admin, dept)
                values("${firstName}", "${lastName}", "${email}", "${password}", "${location}", "${is_admin}", "${dept}");
            `;
		db.query(query, (error) => {
			if (error) throw error;
			res.send('User Added ....');
		});
	});
});

app.post('/add/users', (req, res) => {
	let {
		firstName,
		lastName,
		password,
		email,
		location,
		dept,
		is_admin,
	} = req.body;

	bcrypt.hash(password, 10, (err, hash) => {
		if (err) throw err;
		password = hash.toString();
		let query = `
            insert into users (first_name, last_name, email, password, location, is_admin, dept)
                values("${firstName}", "${lastName}", "${email}", "${password}", "${location}", "${is_admin}", "${dept}");
            `;
		db.query(query, (error) => {
			if (error) throw error;
			res.send('User Added ....');
		});
	});
});

app.get('/users', (req, res) => {
	let query = `
        select concat(first_name,' ', last_name) as full_name, email, location, dept from users;
    `;
	db.query(query, (error, results) => {
		if (error) throw error;
		res.json(results);
	});
});

app.get('/users/:id', (req, res) => {
	let query = `
        select concat(first_name,' ', last_name) as full_name, email, location, dept from users where id=${req.params.id};
    `;
	db.query(query, (error, results) => {
		if (error) throw error;
		if (results.length === 1) res.json(results[0]);
		else res.json({ message: 'Not Found any user' });
	});
});

app.put('/users/:id', (req, res) => {
	let { firstName, lastName, email, location, dept, is_admin } = req.body;
	let query = `
        update users 
            set first_name="${firstName}", 
                last_name="${lastName}", 
                email="${email}", 
                location="${location}", 
                dept="${dept}", 
                is_admin=${is_admin} 
            where id=${req.params.id};
    `;
	db.query(query, (error) => {
		if (error) throw error;
		res.send('User Updated ....');
	});
});

app.delete('/users/:id', (req, res) => {
	let query = `
        delete from users where id=${req.params.id};
    `;
	db.query(query, (error) => {
		if (error) throw error;
		res.send('User Deleted ....');
	});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server started on http://${process.env.DB_HOST}:${PORT}`);
});
