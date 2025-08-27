const mongoose = require('mongoose');

const trainingSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  type: {
    type: String,
    enum: ['technical', 'tactical', 'physical', 'friendly', 'assessment'],
    required: true
  },
  intensity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  location: {
    type: String
  },
  objectives: [{
    type: String
  }],
  exercises: [{
    name: String,
    duration: Number,
    description: String
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  attendance: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'excused'],
      default: 'absent'
    },
    arrivedAt: Date,
    leftAt: Date,
    notes: String
  }],
  notes: {
    coachNotes: String,
    performanceSummary: String,
    issues: [String],
    improvements: [String]
  },
  rpe: {
    average: {
      type: Number,
      min: 1,
      max: 10
    },
    individualRatings: [{
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
      },
      rating: {
        type: Number,
        min: 1,
        max: 10
      }
    }]
  }
}, {
  timestamps: true
});

// Index for efficient querying
trainingSessionSchema.index({ date: 1, startTime: 1 });
trainingSessionSchema.index({ coach: 1, date: 1 });
trainingSessionSchema.index({ group: 1, date: 1 });

module.exports = mongoose.model('TrainingSession', trainingSessionSchema);
