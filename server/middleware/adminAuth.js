const jwt = require('jsonwebtoken')
const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me'

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  if (!token) return res.status(401).json({ error: 'Admin authentication required' })
  try { jwt.verify(token, ADMIN_SECRET); next() }
  catch { res.status(401).json({ error: 'Invalid or expired admin token' }) }
}

module.exports = { requireAdmin, ADMIN_SECRET }
