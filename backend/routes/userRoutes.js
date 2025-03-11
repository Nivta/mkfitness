const express = require('express');
const { registerUser,updateUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/update', updateUser);

module.exports = router;
