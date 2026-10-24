const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const { requireAdmin } = require('../middleware/adminAuth');

// GET /api/tenants - List all tenants
router.get('/', async (req, res, next) => {
  try {
    const tenants = await Tenant.find().sort({ createdAt: -1 });
    res.json(tenants);
  } catch (error) {
    next(error);
  }
});

// GET /api/tenants/:id - Get single tenant by ID
router.get('/:id', async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    next(error);
  }
});

// POST /api/tenants - Create a new tenant
router.post('/', async (req, res, next) => {
  try {
    const { fullName, email, phone, propertyId, leaseStart, leaseEnd, status } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'fullName and email are required' });
    }

    const tenant = new Tenant({
      fullName,
      email,
      phone,
      propertyId,
      leaseStart,
      leaseEnd,
      status: status || 'Active'
    });

    const savedTenant = await tenant.save();
    res.status(201).json(savedTenant);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

// PUT /api/tenants/:id - Update tenant
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { fullName, email, phone, propertyId, leaseStart, leaseEnd, status } = req.body;

    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    if (fullName !== undefined) tenant.fullName = fullName;
    if (email !== undefined) tenant.email = email;
    if (phone !== undefined) tenant.phone = phone;
    if (propertyId !== undefined) tenant.propertyId = propertyId;
    if (leaseStart !== undefined) tenant.leaseStart = leaseStart;
    if (leaseEnd !== undefined) tenant.leaseEnd = leaseEnd;
    if (status !== undefined) tenant.status = status;

    const updatedTenant = await tenant.save();
    res.json(updatedTenant);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

// DELETE /api/tenants/:id - Delete tenant
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json({ message: 'Tenant deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;