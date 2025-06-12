const express = require('express');
const router = express.Router();
const chitIdController = require('../Controllers/ChitidController');

// POST /api/chitids
router.post('/', chitIdController.createChitId);

// GET /api/chitids
router.get('/', chitIdController.getChitIds);

module.exports = router;