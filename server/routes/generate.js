import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { taskQueue, taskResults } from '../lib/queue.js';
import { generateScriptWithProgress } from '../lib/generator.js';

const router = express.Router();

// Submit generation task
router.post('/', async (req, res) => {
  const { analysis, answers, userText, formatSettings } = req.body;
  const taskId = uuidv4();

  const task = {
    id: taskId,
    status: 'queued',
    stage: 'idle',
    message: 'Queued for processing',
    percent: 0,
    logs: [],
    result: null,
    error: null,
    createdAt: Date.now(),
    analysis,
    answers,
    userText,
    formatSettings,
  };

  taskQueue.set(taskId, task);

  // Start generation in background (non-blocking)
  generateScriptWithProgress(taskId).catch(err => {
    console.error(`[Generate] Task ${taskId} failed:`, err);
    const t = taskQueue.get(taskId);
    if (t) {
      t.status = 'error';
      t.error = err.message;
      t.message = 'Generation failed';
    }
  });

  res.json({ taskId, status: 'queued', message: 'Task submitted' });
});

// SSE stream for real-time progress
router.get('/:taskId/stream', (req, res) => {
  const { taskId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const send = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send current state immediately
  const task = taskQueue.get(taskId);
  if (task) {
    send({ type: 'status', ...task });
  }

  // Poll for updates
  const interval = setInterval(() => {
    const t = taskQueue.get(taskId);
    if (!t) {
      send({ type: 'error', message: 'Task not found' });
      clearInterval(interval);
      res.end();
      return;
    }

    send({
      type: 'progress',
      stage: t.stage,
      message: t.message,
      percent: t.percent,
      logs: t.logs.slice(-5), // Send last 5 logs
      status: t.status,
    });

    if (t.status === 'completed' || t.status === 'error') {
      clearInterval(interval);
      setTimeout(() => res.end(), 500);
    }
  }, 500);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

// Get final result
router.get('/:taskId/result', (req, res) => {
  const { taskId } = req.params;
  const task = taskQueue.get(taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({
    status: task.status,
    result: task.result,
    error: task.error,
    logs: task.logs,
  });
});

// Get all active tasks
router.get('/', (_req, res) => {
  const tasks = Array.from(taskQueue.values()).map(t => ({
    id: t.id,
    status: t.status,
    stage: t.stage,
    percent: t.percent,
    message: t.message,
    createdAt: t.createdAt,
  }));
  res.json({ tasks });
});

export default router;
