const express = require('express');
const router = express.Router();

// Mock data for stats
const stats = {
  totalPlayers: 1240,
  monthlyRevenue: 125000,
};

// Endpoint to get stats
router.get('/', (req, res) => {
  res.json(stats);
});

module.exports = router;
