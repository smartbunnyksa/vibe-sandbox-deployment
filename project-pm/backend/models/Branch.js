const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  facilities: [{
    type: String
  }],
  operatingHours: {
    opening: {
      type: String,
      required: true
    },
    closing: {
      type: String,
      required: true
    },
    days: [{
      type: String,
      enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    }]
  },
  stats: {
    totalPlayers: {
      type: Number,
      default: 0
    },
    activePlayers: {
      type: Number,
      default: 0
    },
    monthlyRevenue: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Branch', branchSchema);
