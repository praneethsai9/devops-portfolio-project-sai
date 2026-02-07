const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
  describe('Health Checks', () => {
    it('should return healthy status on /health', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.environment).toBe('test');
    });

    it('should return ready status on /ready', async () => {
      const response = await request(app)
        .get('/ready')
        .expect(200);

      expect(response.body.ready).toBe(true);
    });
  });

  describe('GET /api/items', () => {
    it('should return all items', async () => {
      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return a specific item', async () => {
      const response = await request(app)
        .get('/api/items/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .get('/api/items/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Item not found');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item with valid data', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({
          name: 'Test Item',
          description: 'This is a test item'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Item');
    });

    it('should reject item with missing name', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({
          description: 'No name provided'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should reject item with short name', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({
          name: 'ab',
          description: 'Short name'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details[0]).toContain('at least 3 characters');
    });

    it('should reject item with missing description', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({
          name: 'Test Item'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});