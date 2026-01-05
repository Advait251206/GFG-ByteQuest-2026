const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile, updateUserPassword, deleteUserAccount } = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);
router.delete('/account', protect, deleteUserAccount);

module.exports = router;
