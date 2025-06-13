const express = require('express');
const router = express.Router();
const todayRateController = require('../Controllers/TodayRateController');

router.get('/', todayRateController.getTodayRates);
router.post('/', todayRateController.createTodayRate);
router.get('/by-date', todayRateController.getTodayRateForDate);
module.exports = router;
