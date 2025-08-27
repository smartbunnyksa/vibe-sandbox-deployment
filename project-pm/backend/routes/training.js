const express = require('express');
const router = express.Router();
const TrainingSession = require('../models/TrainingSession');
const { body, validationResult } = require('express-validator');

// Get all training sessions
router.get('/', async (req, res) => {
  try {
    const { coach, group, branch, date } = req.query;
    const filter = {};
    if (coach) filter.coach = coach;
    if (group) filter.group = group;
    if (branch) filter.branch = branch;
    if (date) filter.date = new Date(date);

    const sessions = await TrainingSession.find(filter)
      .populate('coach', 'firstName lastName')
      .populate('group', 'name')
      .populate('branch', 'name city');
    res.send(sessions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a specific training session
router.get('/:id', async (req, res) => {
  try {
    const session = await TrainingSession.findById(req.params.id)
      .populate('coach', 'firstName lastName')
      .populate('group', 'name')
      .populate('branch', 'name city')
      .populate('attendance.player', 'user')
      .populate('rpe.individualRatings.player', 'user');
    if (!session) {
      return res.status(404).send({ error: 'Training session not found' });
    }
    res.send(session);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Create a new training session
router.post('/', [
  body('title').isString().notEmpty(),
  body('coach').isMongoId(),
  body('group').isMongoId(),
  body('branch').isMongoId(),
  body('date').isISO8601(),
  body('startTime').isString().notEmpty(),
  body('endTime').isString().notEmpty(),
  body('duration').isInt({ min: 1 }),
  body('type').isIn(['technical', 'tactical', 'physical', 'friendly', 'assessment'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const session = new TrainingSession(req.body);
    await session.save();
    res.status(201).send(session);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a training session
router.put('/:id', [
  body('title').optional().isString().notEmpty(),
  body('coach').optional().isMongoId(),
  body('group').optional().isMongoId(),
  body('branch').optional().isMongoId(),
  body('date').optional().isISO8601(),
  body('startTime').optional().isString().notEmpty(),
  body('endTime').optional().isString().notEmpty(),
  body('duration').optional().isInt({ min: 1 }),
  body('type').optional().isIn(['technical', 'tactical', 'physical', 'friendly', 'assessment'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const session = await TrainingSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) {
      return res.status(404).send({ error: 'Training session not found' });
    }
    res.send(session);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Delete a training session
router.delete('/:id', async (req, res) => {
  try {
    const session = await TrainingSession.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).send({ error: 'Training session not found' });
    }
    res.send({ message: 'Training session deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
