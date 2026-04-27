const express = require('express');
const router = express.Router();
const chitIdController = require('../Controllers/ChitidController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', chitIdController.createChitId);
router.get('/', chitIdController.getChitIds);
router.put('/:id', chitIdController.updateChitId);
router.delete('/:id', chitIdController.deleteChitId);

module.exports = router;