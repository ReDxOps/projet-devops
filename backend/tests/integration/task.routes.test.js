require('dotenv').config();

const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/models');

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('Task API endpoints', () => {
  let taskId;

  test('POST /api/tasks - crée une tâche', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        nom: 'Tâche API',
        description: 'Créée via l’API',
        statut: 'à faire'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nom).toBe('Tâche API');
    taskId = res.body.id;
  });

  test('GET /api/tasks - retourne les tâches', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/tasks/:id - retourne une tâche', async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(taskId);
  });

  test('PUT /api/tasks/:id - modifie une tâche', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ nom: 'Tâche modifiée', statut: 'terminée' });

    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe('Tâche modifiée');
    expect(res.body.statut).toBe('terminée');
  });

  test('DELETE /api/tasks/:id - supprime une tâche', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(204);
  });

  test('GET /api/tasks/:id - retourne 404 après suppression', async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(404);
  });
});
