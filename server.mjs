import express from 'express';
import dotenv from 'dotenv';
import { fetchTopClickbank, fetchTopDigistore } from './vault-rotator.js';
import fs from 'fs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

async function refreshVault() {
  const clickbank = await fetchTopClickbank();
  const digistore = await fetchTopDigistore();
  const offers = [...clickbank, ...digistore].sort(() => Math.random() - 0.5).slice(0, 4);
  fs.writeFileSync('./vault-data.js', `module.exports = { offers: ${JSON.stringify(offers, null, 2)} }`);
  return offers;
}

app.get('/refresh-vault', async (req, res) => {
  const updated = await refreshVault();
  res.json({ success: true, updated });
});

app.get('/', (req, res) => {
  res.send('✅ Vault refresh server is running.');
});

setTimeout(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server live at http://0.0.0.0:${PORT}`);
  });
}, 3000);