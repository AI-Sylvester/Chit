const express = require('express');
const { closeChit } = require('../Controllers/ChitCloseController');
const router = express.Router();

router.post('/', closeChit);

module.exports = router;