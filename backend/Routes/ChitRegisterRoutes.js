const express = require('express');
const { createChitRegister, getAllChitRegisters, getByRegId,closeChitRegister} = require('../Controllers/ChitRegisterController');
const router = express.Router();

router.post('/', createChitRegister);
router.get('/', getAllChitRegisters);
router.get('/:regId',getByRegId);
router.put('/close/:regId', closeChitRegister);
module.exports = router;
