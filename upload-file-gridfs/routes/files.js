const express = require('express');
const router = express.Router();

router.post('/upload', async (req, res) => {
	return res.send(req.body);
});

module.exports = router;
