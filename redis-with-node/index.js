const express = require('express');
const app = express();
const axios = require('axios');
const { createClient } = require('redis');

const RedisClient = createClient();

(async () => {
	RedisClient.on('error', (err) => console.log('Redis Client Error', err));
	await RedisClient.connect();
})();

const getOrSetCache = async (key, cb) => {
	let response = await RedisClient.get(key);
	if (response) return JSON.parse(response);

	// Fresh Data
	const fresh_data = await cb();
	await RedisClient.setEx(key, 3600, JSON.stringify(fresh_data));
	return fresh_data;
};

app.get('/photos', async (req, res) => {
	const key = `photos?albumId=${req.query.album_id}`;
	const photos = await getOrSetCache(key, async () => {
		const { data } = await axios.get(`https://jsonplaceholder.typicode.com/${key}`);
		return data;
	});
	return res.json(photos);
});

app.get('/photos/:photo_id', async (req, res) => {
	const key = `photos/${req.params.photo_id}`;
	const photo = await getOrSetCache(key, async () => {
		const { data } = await axios.get(`https://jsonplaceholder.typicode.com/${key}`);
		return data;
	});
	return res.json(photo);
});

app.listen(3000);
