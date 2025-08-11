# AI Pastor Alert API Setup

## Installation

1. **Install API dependencies:**
```bash
# Rename the package.json file
mv server-package.json api-package.json

# Install dependencies for the API
npm install --prefix . express cors node-fetch nodemon
```

2. **Start the API server:**
```bash
# Start the API server (runs on port 3001)
node server.js

# Or for development with auto-reload:
npx nodemon server.js
```

## Usage

The API server provides the following endpoints:

- **GET /api/ai-pastor-alert** - Fetches data from the AI Pastor webhook
- **GET /health** - Health check endpoint

## Testing

You can test the API directly:
```bash
curl http://localhost:3001/api/ai-pastor-alert
curl http://localhost:3001/health
```

## Integration

The AI Pastor Alert component in the frontend automatically connects to `http://localhost:3001/api/ai-pastor-alert` every 24 hours and displays any responses.

## Running Both Services

1. **Terminal 1 - API Server:**
```bash
node server.js
```

2. **Terminal 2 - Frontend:**
```bash
npm run dev
```

The frontend (port 8080) will communicate with the API server (port 3001) to fetch AI Pastor alerts.