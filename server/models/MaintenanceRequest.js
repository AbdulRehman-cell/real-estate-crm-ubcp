const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    propertyId: {
      type: String,
      required: [true, 'Property ID is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    status: {
      type: String,
      required: true,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    dateReported: {
      type: Date,
      default: Date.now
    },
    dateResolved: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);