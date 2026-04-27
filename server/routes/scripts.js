import express from 'express';

const router = express.Router();

// In-memory script store (replace with Supabase in production)
const scriptStore = new Map();

// Seed with demo data
scriptStore.set('demo-1', {
  id: 'demo-1',
  title: 'Demo Script',
  status: 'draft',
  duration: '30s',
  version: 'v1',
  shots: [],
  createdAt: Date.now(),
});

// List all scripts
router.get('/', (_req, res) => {
  const scripts = Array.from(scriptStore.values());
  res.json({ scripts });
});

// Get single script
router.get('/:id', (req, res) => {
  const script = scriptStore.get(req.params.id);
  if (!script) return res.status(404).json({ error: 'Script not found' });
  res.json(script);
});

// Save script
router.post('/', (req, res) => {
  const script = req.body;
  script.id = script.id || `script-${Date.now()}`;
  script.updatedAt = Date.now();
  scriptStore.set(script.id, script);
  res.json({ id: script.id, status: 'saved' });
});

// Delete script
router.delete('/:id', (req, res) => {
  const existed = scriptStore.delete(req.params.id);
  if (!existed) return res.status(404).json({ error: 'Script not found' });
  res.json({ status: 'deleted' });
});

export default router;
