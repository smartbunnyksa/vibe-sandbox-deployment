const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Get user details
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update user details
router.put('/:id', [
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('email').optional().isEmail(),
  body('phone').optional().isString(),
  body('password').optional().isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
