import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import generateRouter from './routes/generate.js';
import proxyRouter from './routes/proxy.js';
import scriptsRouter from './routes/scripts.js';

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Routes
app.use('/api/generate', generateRouter);
app.use('/api/proxy', proxyRouter);
app.use('/api/scripts', scriptsRouter);

app.listen(PORT, () => {
  console.log(`[Server] StoryVibe backend running on http://localhost:${PORT}`);
  console.log(`[Server] API endpoints:`);
  console.log(`  POST /api/generate          - Submit generation task`);
  console.log(`  GET  /api/generate/:id/stream - SSE progress stream`);
  console.log(`  GET  /api/generate/:id/result - Get final result`);
  console.log(`  POST /api/proxy/jimeng      - Jimeng API proxy`);
  console.log(`  POST /api/proxy/qwen        - Qwen-OMNI proxy`);
  console.log(`  GET  /api/scripts           - List all scripts`);
  console.log(`  POST /api/scripts           - Save script`);
});
