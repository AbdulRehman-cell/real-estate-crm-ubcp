const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: false,
      default: null
    },
    leaseStart: {
      type: Date,
      required: [true, 'Lease start date is required']
    },
    leaseEnd: {
      type: Date,
      required: [true, 'Lease end date is required']
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Terminated', 'Expired'],
      default: 'Active',
      trim: true
    },
    monthlyRent: {
      type: Number,
      default: 0,
      min: [0, 'Monthly rent must be a non-negative number']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Tenant', tenantSchema);