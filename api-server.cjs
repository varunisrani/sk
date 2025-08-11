const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = process.env.PORT || 3001;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Content-Type': 'application/json'
};

// Function to make HTTPS request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const contentType = response.headers['content-type'] || '';
          let parsedData;
          
          if (contentType.includes('application/json')) {
            parsedData = JSON.parse(data);
          } else {
            parsedData = { message: data, type: 'text' };
          }
          
          resolve({
            success: true,
            data: parsedData,
            timestamp: new Date().toISOString(),
            source: 'ai-pastor-webhook',
            statusCode: response.statusCode
          });
        } catch (error) {
          resolve({
            success: true,
            data: { message: data, type: 'text' },
            timestamp: new Date().toISOString(),
            source: 'ai-pastor-webhook'
          });
        }
      });
    });
    
    request.on('error', (error) => {
      reject({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      reject({
        success: false,
        error: 'Request timeout',
        timestamp: new Date().toISOString()
      });
    });
  });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }
  
  console.log(`${new Date().toISOString()} - ${req.method} ${url.pathname}`);
  
  // AI Pastor Alert endpoint
  if (url.pathname === '/api/ai-pastor-alert' && req.method === 'GET') {
    try {
      console.log('🔍 Checking AI Pastor Alert webhook...');
      
      const result = await makeRequest('https://ssdsdss.app.n8n.cloud/webhook-test/e698cbc9-8ba0-47cc-8aec-937a97b75b08');
      
      console.log('✅ AI Pastor Alert response:', result.success ? 'Success' : 'Error');
      if (result.data) {
        console.log('📄 Response data:', typeof result.data === 'object' ? JSON.stringify(result.data, null, 2) : result.data);
      }
      
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(result, null, 2));
      
    } catch (error) {
      console.error('❌ Error fetching AI Pastor Alert:', error);
      
      const errorResponse = {
        success: false,
        error: error.message || error.error || 'Internal server error',
        timestamp: new Date().toISOString()
      };
      
      res.writeHead(500, corsHeaders);
      res.end(JSON.stringify(errorResponse, null, 2));
    }
    return;
  }
  
  // Health check endpoint
  if (url.pathname === '/health' && req.method === 'GET') {
    console.log('💚 Health check requested');
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'echad-connect-api',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }, null, 2));
    return;
  }
  
  // 404 for other endpoints
  console.log(`❓ 404 - Not found: ${url.pathname}`);
  res.writeHead(404, corsHeaders);
  res.end(JSON.stringify({
    error: 'Not Found',
    path: url.pathname,
    availableEndpoints: ['/api/ai-pastor-alert', '/health'],
    timestamp: new Date().toISOString()
  }, null, 2));
});

// Start server
server.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log('   ECHAD CONNECT - AI PASTOR ALERT API');
  console.log('========================================');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🔔 AI Pastor Alert: http://localhost:${PORT}/api/ai-pastor-alert`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log('⏰ Ready to serve AI Pastor alerts!');
  console.log('========================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});