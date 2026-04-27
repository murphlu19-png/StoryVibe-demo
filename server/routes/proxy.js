import express from 'express';
import { callJimeng } from '../lib/jimeng.js';
import { callQwenOmni } from '../lib/qwen.js';

const router = express.Router();

// Jimeng API proxy
router.post('/jimeng', async (req, res) => {
  try {
    const result = await callJimeng(req.body);
    res.json(result);
  } catch (err) {
    console.error('[Jimeng Proxy] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Qwen-OMNI proxy
router.post('/qwen', async (req, res) => {
  try {
    const { analysis, answers } = req.body;
    const result = await callQwenOmni(analysis, answers);
    res.json(result);
  } catch (err) {
    console.error('[Qwen Proxy] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
