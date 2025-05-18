const router = require('express').Router();

// Ping endpoint for testing connection
router.get('/ping', (req, res) => {
  res.json({ message: 'Server is up and running!', timestamp: new Date() });
});

module.exports = router;
