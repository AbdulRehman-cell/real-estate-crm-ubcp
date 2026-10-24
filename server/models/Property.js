const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Property name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Property address is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['Apartment', 'Single Family', 'Multi Family', 'Commercial', 'Condo', 'Townhouse'],
      default: 'Apartment',
    },
    status: {
      type: String,
      required: [true, 'Property status is required'],
      enum: ['Occupied', 'Vacant', 'Under Maintenance', 'Available'],
      default: 'Vacant',
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [0, 'Monthly rent must be a non-negative number'],
      default: 0,
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: [0, 'Bedrooms must be a non-negative number'],
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: [0, 'Bathrooms must be a non-negative number'],
    },
    squareFeet: {
      type: Number,
      default: 0,
      min: [0, 'Square feet must be a non-negative number'],
    },
    images: {
      type: [String],
      default: ['https://picsum.photos/seed/prop1/800/600'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Property', propertySchema);