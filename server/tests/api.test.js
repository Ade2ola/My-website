const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/utils/prisma');

describe('My-Website CMS API & Security Test Suite', () => {

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Health & Public Endpoints', () => {
    it('GET /health should return status OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
    });

    it('GET /api/v1/site should return published site bundle', async () => {
      const res = await request(app).get('/api/v1/site');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('siteConfig');
      expect(res.body).toHaveProperty('homeData');
      expect(res.body).toHaveProperty('aboutData');
      expect(res.body).toHaveProperty('booksData');
      expect(Array.isArray(res.body.booksData)).toBe(true);
    });

    it('GET /api/v1/site/books should return books array', async () => {
      const res = await request(app).get('/api/v1/site/books');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('2. Authentication & Authorization Controls', () => {
    let agent;
    let csrfToken;

    beforeEach(() => {
      agent = request.agent(app);
    });

    it('POST /api/v1/admin/settings without auth should return 401', async () => {
      const res = await request(app).patch('/api/v1/admin/settings').send({ siteTitle: 'Hacked' });
      expect(res.statusCode).toBe(401);
    });

    it('POST /api/v1/auth/login with wrong password should fail', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@dessyackerman.com', password: 'wrongpassword' });
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/v1/auth/login with valid credentials should succeed and issue CSRF token', async () => {
      const res = await agent
        .post('/api/v1/auth/login')
        .send({ email: 'admin@dessyackerman.com', password: 'dessy123' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.csrfToken).toBeDefined();
      csrfToken = res.body.csrfToken;
    });

    it('PATCH /api/v1/admin/home without CSRF token should return 403', async () => {
      // Login first
      const loginRes = await agent
        .post('/api/v1/auth/login')
        .send({ email: 'admin@dessyackerman.com', password: 'dessy123' });

      const res = await agent
        .patch('/api/v1/admin/home')
        .send({ heroTitle: 'New Title' });

      expect(res.statusCode).toBe(403);
    });

    it('PATCH /api/v1/admin/home with valid session and CSRF token should update DB', async () => {
      const loginRes = await agent
        .post('/api/v1/auth/login')
        .send({ email: 'admin@dessyackerman.com', password: 'dessy123' });

      const token = loginRes.body.csrfToken;

      const res = await agent
        .patch('/api/v1/admin/home')
        .set('X-CSRF-Token', token)
        .send({ heroTitle: 'Tested Archive Title' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify persistence via public API
      const siteRes = await request(app).get('/api/v1/site');
      expect(siteRes.body.homeData.heroTitle).toBe('Tested Archive Title');
    });

    it('POST /api/v1/auth/logout should destroy session', async () => {
      const loginRes = await agent
        .post('/api/v1/auth/login')
        .send({ email: 'admin@dessyackerman.com', password: 'dessy123' });

      const token = loginRes.body.csrfToken;

      const logoutRes = await agent.post('/api/v1/auth/logout');
      expect(logoutRes.statusCode).toBe(200);

      // Subsequent admin request should be rejected with 401
      const res = await agent
        .patch('/api/v1/admin/home')
        .set('X-CSRF-Token', token)
        .send({ heroTitle: 'Unauthorized Edit' });

      expect(res.statusCode).toBe(401);
    });
  });

});
