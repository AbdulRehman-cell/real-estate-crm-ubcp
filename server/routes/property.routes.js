const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { requireAdmin } = require('../middleware/adminAuth');

// GET /api/properties - List all properties
router.get('/', async (req, res, next) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    next(err);
  }
});

// GET /api/properties/:id - Get single property
router.get('/:id', async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    next(err);
  }
});

// POST /api/properties - Create new property
router.post('/', async (req, res, next) => {
  try {
    const { name, address, type, status, monthlyRent } = req.body;
    
    if (!name || !address) {
      return res.status(400).json({ error: 'Name and address are required' });
    }

    const property = new Property({
      name,
      address,
      type: type || 'Apartment',
      status: status || 'Vacant',
      monthlyRent: typeof monthlyRent === 'number' ? monthlyRent : Number(monthlyRent) || 0
    });

    const savedProperty = await property.save();
    res.status(201).json(savedProperty);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// PUT /api/properties/:id - Update property
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { name, address, type, status, monthlyRent } = req.body;

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (name !== undefined) property.name = name;
    if (address !== undefined) property.address = address;
    if (type !== undefined) property.type = type;
    if (status !== undefined) property.status = status;
    if (monthlyRent !== undefined) property.monthlyRent = Number(monthlyRent) || 0;

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// DELETE /api/properties/:id - Delete property
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully', id: req.params.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;