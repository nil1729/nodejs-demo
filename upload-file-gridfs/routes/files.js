const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');

const conn = mongoose.createConnection(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// init Gfs
let gfs;

conn.once('open', async () => {
	// init Stream
	gfs = await Grid(conn.db, mongoose.mongo);
	gfs.collection('uploads');
	console.log('Connected....');
});

// Storage Engine
const storage = new GridFsStorage({
	db: conn,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: 'uploads',
				};
				resolve(fileInfo);
			});
		});
	},
});

const upload = multer({ storage });

// @route POST  /api/upload
// desc Upload Files to DB
router.post('/upload', upload.single('dbFile'), async (req, res) => {
	return res.redirect('/');
});

// @route GET /api/files
// desc Get All Files
router.get('/files', async (req, res) => {
	gfs.files.find().toArray(function (err, files) {
		if (err) {
			return res.status(500).json({
				message: err,
			});
		}
		if (!files || files.length === 0) {
			return res.status(404).json({
				message: 'No Files Found',
			});
		}
		return res.status(200).json({
			files,
		});
	});
});

// @route GET /api/files/:filename
// desc Get a Single File
router.get('/files/:filename', async (req, res) => {
	gfs.files.findOne({ filename: req.params.filename }, function (err, file) {
		if (err) {
			return res.status(500).json({
				message: err,
			});
		}
		if (!file) {
			return res.status(404).json({
				message: 'No File Found with Given ID',
			});
		}
		return res.status(200).json({
			file,
		});
	});
});

// @route GET /api/images/:filename
// desc Show Original Images
router.get('/images/:filename', async (req, res) => {
	gfs.files.findOne({ filename: req.params.filename }, function (err, file) {
		if (err) {
			return res.status(500).json({
				message: err,
			});
		}
		if (!file) {
			return res.status(404).json({
				message: 'No File Found with Given ID',
			});
		}
		if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
			var readstream = gfs.createReadStream({ filename: file.filename });
			return readstream.pipe(res);
		}
		return res.status(400).json({
			message: 'Invalid File Type',
		});
	});
});

// @route DELETE /api/images/:id
// desc Delete a Image with Given ID
router.delete('/images/:id', async (req, res) => {
	gfs.remove({ _id: req.params.id, root: 'uploads' }, function (err) {
		if (err) {
			return res.status(500).json({
				message: err,
			});
		}
		res.redirect('back');
	});
});

// @route GET/
// desc Loads Upload Form
router.get('/', async (req, res) => {
	let images;
	gfs.files.find().toArray(function (err, files) {
		if (err) {
			console.log(err);
			return res.render('index');
		}
		images = files.filter(
			file =>
				file.contentType === 'image/jpeg' || file.contentType === 'image/png'
		);
		res.render('index', { images });
	});
});

module.exports = router;
