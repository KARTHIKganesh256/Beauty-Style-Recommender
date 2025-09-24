import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mapQueriesFromInput } from './utils/mapQueries.js';
import { normalizeProducts, dedupeAndLimit } from './utils/normalize.js';
import { fetchFlipkartProducts } from './providers/flipkart.js';
import { fetchAmazonProducts } from './providers/amazon.js';
import { fetchAjioProducts } from './providers/ajio.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/recommend', async (req, res) => {
  try {
    const { skinTone, undertone, location } = req.body || {};
    if (!skinTone && !undertone) {
      return res.status(400).json({ error: 'skinTone or undertone is required' });
    }

    const queryPlan = mapQueriesFromInput({ skinTone, undertone, location });

    const [flipkart, amazon, ajio] = await Promise.all([
      fetchFlipkartProducts(queryPlan),
      fetchAmazonProducts(queryPlan),
      fetchAjioProducts(queryPlan)
    ]);

    const all = [...flipkart, ...amazon, ...ajio];
    const normalized = all.map(normalizeProducts).flat();
    const limited = dedupeAndLimit(normalized, 40);
    res.json({ products: limited });
  } catch (err) {
    console.error('Recommend error', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});


