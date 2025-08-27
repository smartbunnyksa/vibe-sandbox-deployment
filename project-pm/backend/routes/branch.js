const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const { body, validationResult } = require('express-validator');

// Get all branches
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find().populate('manager', 'firstName lastName email phone');
    res.send(branches);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a specific branch
router.get('/:id', async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id).populate('manager', 'firstName lastName email phone');
    if (!branch) {
      return res.status(404).send({ error: 'Branch not found' });
    }
    res.send(branch);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Create a new branch
router.post('/', [
  body('name').isString().notEmpty(),
  body('city').isString().notEmpty(),
  body('address').isString().notEmpty(),
  body('phone').isString().notEmpty(),
  body('email').isEmail(),
  body('manager').isMongoId(),
  body('capacity').isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const branch = new Branch(req.body);
    await branch.save();
    res.status(201).send(branch);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a branch
router.put('/:id', [
  body('name').optional().isString().notEmpty(),
  body('city').optional().isString().notEmpty(),
  body('address').optional().isString().notEmpty(),
  body('phone').optional().isString().notEmpty(),
  body('email').optional().isEmail(),
  body('manager').optional().isMongoId(),
  body('capacity').optional().isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) {
      return res.status(404).send({ error: 'Branch not found' });
    }
    res.send(branch);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Delete a branch
router.delete('/:id', async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).send({ error: 'Branch not found' });
    }
    res.send({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
