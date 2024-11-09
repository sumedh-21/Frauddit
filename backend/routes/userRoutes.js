const express = require('express');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/protected', verifyToken, (req, res) => {
  res.send('This is a protected route, user is authenticated!');
});

module.exports = router;