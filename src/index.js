/**
 * My DevOps Portfolio API
 * A simple but production-grade Express.js REST API
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

// ==================== Middleware ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==================== Data Storage ====================
let items = [
  { id: 1, name: 'Sample Item 1', description: 'This is a sample item' },
  { id: 2, name: 'Sample Item 2', description: 'Another sample item' }
];

// ==================== Validation ====================
function validateItem(data) {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string') {
    errors.push('name is required and must be a string');
  } else if (data.name.trim().length < 3) {
    errors.push('name must be at least 3 characters');
  } else if (data.name.trim().length > 100) {
    errors.push('name must be less than 100 characters');
  }
  
  if (!data.description || typeof data.description !== 'string') {
    errors.push('description is required and must be a string');
  } else if (data.description.trim().length < 5) {
    errors.push('description must be at least 5 characters');
  } else if (data.description.trim().length > 500) {
    errors.push('description must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ==================== Error Handling Middleware ====================
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body',
      message: ENV === 'development' ? err.message : undefined
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: ENV === 'development' ? err.message : undefined
  });
});

// ==================== Health Check Endpoints ====================

app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: ENV,
    uptime: process.uptime()
  });
});

app.get('/ready', (req, res) => {
  res.status(200).json({
    ready: true,
    timestamp: new Date().toISOString()
  });
});

// ==================== API Endpoints ====================

app.get('/api/items', (req, res) => {
  console.log(`Retrieving ${items.length} items`);
  
  res.status(200).json({
    success: true,
    message: 'Items retrieved successfully',
    data: items,
    count: items.length
  });
});

app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Item not found',
      id
    });
  }
  
  console.log(`Retrieved item: ${id}`);
  res.status(200).json({
    success: true,
    message: 'Item retrieved successfully',
    data: item
  });
});

app.post('/api/items', (req, res) => {
  const validation = validateItem(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.errors
    });
  }
  
  const newItem = {
    id: Math.max(...items.map(i => i.id), 0) + 1,
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    createdAt: new Date().toISOString()
  };
  
  items.push(newItem);
  console.log(`Item created: ${newItem.id} - ${newItem.name}`);
  
  res.status(201).json({
    success: true,
    message: 'Item created successfully',
    data: newItem
  });
});

app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(i => i.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Item not found',
      id
    });
  }
  
  const validation = validateItem(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.errors
    });
  }
  
  items[itemIndex] = {
    ...items[itemIndex],
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    updatedAt: new Date().toISOString()
  };
  
  console.log(`Item updated: ${id}`);
  res.status(200).json({
    success: true,
    message: 'Item updated successfully',
    data: items[itemIndex]
  });
});

app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(i => i.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Item not found',
      id
    });
  }
  
  const deletedItem = items.splice(itemIndex, 1)[0];
  console.log(`Item deleted: ${id}`);
  
  res.status(200).json({
    success: true,
    message: 'Item deleted successfully',
    data: deletedItem
  });
});

// ==================== 404 Handler ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'not found',
    path: req.path,
    method: req.method
  });
});

// ==================== Server Startup ====================
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DevOps Portfolio API Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Server:       http://localhost:${PORT}
  Environment:  ${ENV}
  Health:       http://localhost:${PORT}/health
  Readiness:    http://localhost:${PORT}/ready
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  });
  
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
}

module.exports = app;