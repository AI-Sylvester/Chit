const express = require('express');
const { closeChit } = require('../Controllers/ChitCloseController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.post('/', closeChit);

module.exports = router;