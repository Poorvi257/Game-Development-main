const express = require('express');
const agentController = require('../../controllers/agentController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', agentController.getAllAgents);

router.post('/lock', authMiddleware, agentController.insertLockedAgent);

module.exports = router;