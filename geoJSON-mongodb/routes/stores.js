const express = require('express');
const router = express.Router();

// Controllers
const { getStores, addStore } = require('../controllers/stores');

router.route('/').get(getStores);
router.route('/').post(addStore);

module.exports = router;
