const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  medicalInfo: {
    allergies: [String],
    medicalConditions: [String],
    medications: [String],
    doctorInfo: String
  },
  subscription: {
    type: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly', 'family'],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active'
    },
    price: {
      type: Number,
      required: true
    }
  },
  attendance: [{
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingSession'
    },
    date: Date,
    status: {
      type: String,
      enum: ['present', 'absent', 'excused']
    },
    notes: String
  }],
  performance: {
    overallRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    skills: {
      technical: Number,
      tactical: Number,
      physical: Number,
      mental: Number
    },
    progress: [{
      date: Date,
      category: String,
      score: Number,
      notes: String
    }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Virtual for age
playerSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000));
});

module.exports = mongoose.model('Player', playerSchema);
