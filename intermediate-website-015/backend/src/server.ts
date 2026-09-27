import express from 'express';
import cors from 'cors';
import { gisRouter } from './routes/gisRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/gis', gisRouter);

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'WATERSCOPE GIS Backend Engine',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`⚡ WATERSCOPE GIS Backend Server running on http://localhost:${PORT}`);
});
