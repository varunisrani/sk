const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// AI Pastor Alert endpoint
app.get('/api/ai-pastor-alert', async (req, res) => {
  try {
    console.log('Checking AI Pastor Alert webhook...');
    
    const response = await fetch('https://ssdsdss.app.n8n.cloud/webhook-test/da633149-fb2b-46fd-96f1-3177de663d1d', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Echad-Connect/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If it's not JSON, treat as text
      const text = await response.text();
      data = { message: text, type: 'text' };
    }

    console.log('AI Pastor Alert response:', data);
    
    // Return the data with timestamp
    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
      source: 'ai-pastor-webhook'
    });

  } catch (error) {
    console.error('Error fetching AI Pastor Alert:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'echad-connect-api',
    timestamp: new Date().toISOString() 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📡 AI Pastor Alert endpoint: http://localhost:${PORT}/api/ai-pastor-alert`);
});

module.exports = app;