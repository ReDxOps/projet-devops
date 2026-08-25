const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

// GET /api/tasks - liste de toutes les tâches
router.get('/', taskController.getAllTasks);

// GET /api/tasks/:id - une tâche par ID
router.get('/:id', taskController.getTaskById);

// POST /api/tasks - créer une nouvelle tâche
router.post('/', taskController.createTask);

// PUT /api/tasks/:id - mettre à jour une tâche
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - supprimer une tâche
router.delete('/:id', taskController.deleteTask);

module.exports = router;
