const express = require('express');
const Admin = require('../models/Admin');
const { requireAdmin } = require('../middleware/adminAuth');
const router = express.Router();

router.get('/', async (req, res) => { try { res.json(await Admin.find().sort('-createdAt')); } catch (e) { res.status(500).json({ error: 'Failed to fetch.' }); } });
router.get('/:id', async (req, res) => { try { const doc = await Admin.findById(req.params.id); if (!doc) return res.status(404).json({ error: 'Not found.' }); res.json(doc); } catch (e) { res.status(404).json({ error: 'Not found.' }); } });
router.post('/', async (req, res) => { try { res.status(201).json(await Admin.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); } });
router.put('/:id', requireAdmin, async (req, res) => { try { const doc = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!doc) return res.status(404).json({ error: 'Not found.' }); res.json(doc); } catch (e) { res.status(400).json({ error: e.message }); } });
router.delete('/:id', requireAdmin, async (req, res) => { try { const doc = await Admin.findByIdAndDelete(req.params.id); if (!doc) return res.status(404).json({ error: 'Not found.' }); res.json({ message: 'Deleted.' }); } catch (e) { res.status(404).json({ error: 'Not found.' }); } });

module.exports = router;