const express = require('express');
const router = express.Router();
const MaintenanceRequest = require('../models/MaintenanceRequest');
const { requireAdmin } = require('../middleware/adminAuth');

// GET /api/maintenancerequests - List all maintenance requests
router.get('/', async (req, res, next) => {
  try {
    const requests = await MaintenanceRequest.find().sort({ dateReported: -1 });
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

// GET /api/maintenancerequests/:id - Get single request by ID
router.get('/:id', async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }
    res.json(request);
  } catch (err) {
    next(err);
  }
});

// POST /api/maintenancerequests - Create a new maintenance request
router.post('/', async (req, res, next) => {
  try {
    const { title, propertyId, description, priority, status, dateReported } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newRequest = new MaintenanceRequest({
      title: title.trim(),
      propertyId: propertyId || '',
      description: description || '',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dateReported: dateReported || new Date()
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// PUT /api/maintenancerequests/:id - Update an existing maintenance request
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { title, propertyId, description, priority, status, dateReported } = req.body;

    const updatedData = {};
    if (title !== undefined) updatedData.title = title.trim();
    if (propertyId !== undefined) updatedData.propertyId = propertyId;
    if (description !== undefined) updatedData.description = description;
    if (priority !== undefined) updatedData.priority = priority;
    if (status !== undefined) updatedData.status = status;
    if (dateReported !== undefined) updatedData.dateReported = dateReported;

    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    res.json(updatedRequest);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// DELETE /api/maintenancerequests/:id - Delete a maintenance request
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const deletedRequest = await MaintenanceRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }
    res.json({ message: 'Maintenance request deleted successfully', id: req.params.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;