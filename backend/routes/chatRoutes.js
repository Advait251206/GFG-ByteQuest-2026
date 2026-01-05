const express = require('express');
const router = express.Router();
const { chatHandler, getChatHistory, deleteChatHistory, deleteChatMessage } = require('../controllers/chatController');

router.post('/message', chatHandler);
router.get('/history', getChatHistory);
router.delete('/history', deleteChatHistory);
router.delete('/message/:msgId', deleteChatMessage);

module.exports = router;
