require('dotenv').config();

const db = require('../../src/models');
const taskService = require('../../src/services/task.service');

// Mock de la base de données avec Sequelize en mémoire
beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('Task Service', () => {
  test('should create a new task', async () => {
    const task = await taskService.createTask({
      nom: 'Test task',
      description: 'Une tâche de test',
      statut: 'à faire'
    });

    expect(task).toHaveProperty('id');
    expect(task.nom).toBe('Test task');
    expect(task.description).toBe('Une tâche de test');
    expect(task.statut).toBe('à faire');
  });

  test('should retrieve all tasks', async () => {
    const tasks = await taskService.getAllTasks();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
  });

  test('should retrieve a task by ID', async () => {
    const task = await taskService.createTask({
      nom: 'Tâche 2',
      description: 'Deuxième tâche',
      statut: 'en cours'
    });

    const found = await taskService.getTaskById(task.id);
    expect(found.nom).toBe('Tâche 2');
    expect(found.statut).toBe('en cours');
  });

  test('should update a task', async () => {
    const task = await taskService.createTask({
      nom: 'À modifier',
      description: '',
      statut: 'à faire'
    });

    const updated = await taskService.updateTask(task.id, {
      nom: 'Modifiée',
      statut: 'terminée'
    });

    expect(updated.nom).toBe('Modifiée');
    expect(updated.statut).toBe('terminée');
  });

  test('should delete a task', async () => {
    const task = await taskService.createTask({
      nom: 'À supprimer',
      description: '',
      statut: 'à faire'
    });

    const deleted = await taskService.deleteTask(task.id);
    expect(deleted).toBe(true);

    const shouldBeNull = await taskService.getTaskById(task.id);
    expect(shouldBeNull).toBeNull();
  });
});
