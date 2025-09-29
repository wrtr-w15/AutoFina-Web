const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
  console.log('=== WEBHOOK RECEIVED ===');
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('========================');
  
  res.status(200).json({ 
    success: true, 
    message: 'Webhook received successfully',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Test webhook server running on http://localhost:${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook`);
});
