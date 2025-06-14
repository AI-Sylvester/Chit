const express = require('express');
const { createChitRegister, getAllChitRegisters, getByRegId,closeChitRegister,getOpenChitRegisters,getByRegIdAllStatus} = require('../Controllers/ChitRegisterController');
const router = express.Router();

router.get('/open',getOpenChitRegisters);

router.post('/', createChitRegister);
router.get('/', getAllChitRegisters);
router.get('/:regId',getByRegId);
router.put('/close/:regId', closeChitRegister);
router.get('/all-status/:regId', getByRegIdAllStatus);
module.exports = router;
