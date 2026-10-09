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
      await agent
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

      const res = await agent
        .patch('/api/v1/admin/home')
        .set('X-CSRF-Token', token)
        .send({ heroTitle: 'Unauthorized Edit' });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('3. Writing Desk CMS CRUD Operations', () => {
    let agent;
    let csrfToken;

    beforeAll(async () => {
      agent = request.agent(app);
      const loginRes = await agent
        .post('/api/v1/auth/login')
        .send({ email: 'admin@dessyackerman.com', password: 'dessy123' });
      csrfToken = loginRes.body.csrfToken;
    });

    it('should create and update a Work-in-Progress (WIP) project', async () => {
      const createRes = await agent
        .post('/api/v1/admin/writing-projects')
        .set('X-CSRF-Token', csrfToken)
        .send({
          title: 'Chronicles of Ash',
          status: 'Drafting Chapter 5',
          progress: 35,
          wordCount: '22,000 / 70,000 words',
          synopsis: 'A tale of embers and magic.'
        });

      expect(createRes.statusCode).toBe(201);
      const projId = createRes.body.data.id;

      const updateRes = await agent
        .patch(`/api/v1/admin/writing-projects/${projId}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          title: 'Chronicles of Ash',
          status: 'Drafting Chapter 6',
          progress: 40,
          wordCount: '25,000 / 70,000 words',
          synopsis: 'A updated tale of embers and magic.'
        });

      expect(updateRes.statusCode).toBe(200);
      expect(updateRes.body.data.progress).toBe(40);

      const siteRes = await request(app).get('/api/v1/site');
      const found = siteRes.body.deskData.projects.find(p => p.id === projId);
      expect(found).toBeDefined();
      expect(found.status).toBe('Drafting Chapter 6');

      // Set as primary project
      const primaryRes = await agent
        .patch(`/api/v1/admin/writing-projects/${projId}/set-primary`)
        .set('X-CSRF-Token', csrfToken);
      expect(primaryRes.statusCode).toBe(200);

      const reSiteRes = await request(app).get('/api/v1/site');
      expect(reSiteRes.body.deskData.projects[0].id).toBe(projId);
      expect(reSiteRes.body.deskData.projects[0].isPrimary).toBe(true);
    });

    it('should create and update Timeline Logs, Snippets, and Sneak Peeks', async () => {
      // Timeline Log
      const logRes = await agent
        .post('/api/v1/admin/desk-logs')
        .set('X-CSRF-Token', csrfToken)
        .send({ date: 'October 10, 2026', text: 'Finished drafting the climax scene.' });
      expect(logRes.statusCode).toBe(201);

      // Snippet
      const snipRes = await agent
        .post('/api/v1/admin/snippets')
        .set('X-CSRF-Token', csrfToken)
        .send({ source: 'Kindred Chapter 2', text: 'Shadows danced in the candlelight...' });
      expect(snipRes.statusCode).toBe(201);

      // Sneak Peek
      const peekRes = await agent
        .post('/api/v1/admin/sneak-peeks')
        .set('X-CSRF-Token', csrfToken)
        .send({ title: 'Map Preview', desc: 'Hand-drawn map of the city.' });
      expect(peekRes.statusCode).toBe(201);

      const siteRes = await request(app).get('/api/v1/site');
      expect(siteRes.body.deskData.updates.length).toBeGreaterThan(0);
      expect(siteRes.body.deskData.snippets.length).toBeGreaterThan(0);
      expect(siteRes.body.deskData.sneakPeeks.length).toBeGreaterThan(0);
    });
  });

  describe('4. Bookshelf & Character Art Studio CRUD Operations', () => {
    let agent;
    let csrfToken;

    beforeAll(async () => {
      await prisma.book.deleteMany({ where: { slug: 'starlight-academy' } });
      agent = request.agent(app);
      const loginRes = await agent
        .post('/api/v1/auth/login')
        .send({ email: 'admin@dessyackerman.com', password: 'dessy123' });
      csrfToken = loginRes.body.csrfToken;
    });

    it('should create a new book with Character Art Studio images and verify public bundle', async () => {
      const bookPayload = {
        slug: 'starlight-academy',
        title: 'Starlight Academy',
        genre: 'Dark Academia',
        tagline: 'Secrets beneath ancient stone.',
        synopsis: 'A mysterious academy shrouded in secrets.',
        coverColor: '#2b3a4a',
        coverDoodle: 'star',
        characterArtImage: 'assets/starlight-char-art.jpg',
        characterArtCaption: 'Concept sketch of Elyse in the library',
        characterArtPlaceholder: 'Character Art Studio',
        authorNotes: 'Written on rainy autumn nights.',
        characters: [
          { name: 'Elyse Vance', role: 'Protagonist', desc: 'A scholar of ancient runes.' }
        ],
        playlist: [
          { title: 'Academia Nocturne', artist: 'Chamber Orchestra' }
        ],
        purchaseLinks: [
          { store: 'IndieBound', url: 'https://indiebound.org', disabled: false }
        ]
      };

      const res = await agent
        .post('/api/v1/admin/books')
        .set('X-CSRF-Token', csrfToken)
        .send(bookPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.characterArtImage).toBe('assets/starlight-char-art.jpg');

      const siteRes = await request(app).get('/api/v1/site');
      const created = siteRes.body.booksData.find(b => b.slug === 'starlight-academy');
      expect(created).toBeDefined();
      expect(created.characterArtImage).toBe('assets/starlight-char-art.jpg');
      expect(created.characters.length).toBe(1);
    });
  });

  describe('5. About Page CMS CRUD Operations', () => {
    let agent;
    let csrfToken;

    beforeAll(async () => {
      agent = request.agent(app);
      const loginRes = await agent
        .post('/api/v1/auth/login')
        .send({ email: 'admin@dessyackerman.com', password: 'dessy123' });
      csrfToken = loginRes.body.csrfToken;
    });

    it('should update About settings, tropes, genres, hobbies, and fun facts', async () => {
      const aboutRes = await agent
        .patch('/api/v1/admin/about')
        .set('X-CSRF-Token', csrfToken)
        .send({
          pageTitle: 'About Dessy Ackerman',
          pageSubtitle: 'Storyteller & Dreamer',
          whyIWrite: 'I write to build sanctuaries for wandering minds.',
          anonLocation: 'Cozy Corner Bakery',
          anonCompanion: 'Rafayel Plushie',
          anonBeverage: 'Espresso with Oat Milk'
        });

      expect(aboutRes.statusCode).toBe(200);

      const tropeRes = await agent
        .post('/api/v1/admin/tropes')
        .set('X-CSRF-Token', csrfToken)
        .send({ name: 'Enemies to Lovers', description: 'Fire meeting ice.' });

      expect(tropeRes.statusCode).toBe(201);

      const siteRes = await request(app).get('/api/v1/site');
      expect(siteRes.body.aboutData.pageTitle).toBe('About Dessy Ackerman');
      expect(siteRes.body.aboutData.whyIWrite).toBe('I write to build sanctuaries for wandering minds.');
      expect(siteRes.body.aboutData.anonymityDetails.location).toBe('Cozy Corner Bakery');
      expect(siteRes.body.aboutData.favoriteTropes.some(t => t.name === 'Enemies to Lovers')).toBe(true);
    });
  });

});
