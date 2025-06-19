const express = require('express');
const { createChitRegister, getAllChitRegisters, getByRegId,closeChitRegister,getOpenChitRegisters,getByRegIdAllStatus,getChitsByCusId} = require('../Controllers/ChitRegisterController');
const router = express.Router();

router.get('/open',getOpenChitRegisters);

router.post('/', createChitRegister);
router.get('/', getAllChitRegisters);
router.get('/:regId',getByRegId);
router.put('/close/:regId', closeChitRegister);
router.get('/all-status/:regId', getByRegIdAllStatus);
router.get('/by-cusid/:cusId', getChitsByCusId);
module.exports = router;
