const db = require('../models');
const Task = db.task;

// Récupérer toutes les tâches
exports.getAllTasks = async () => {
  return await Task.findAll({ order: [['createdAt', 'DESC']] });
};

// Récupérer une tâche par ID
exports.getTaskById = async (id) => {
  return await Task.findByPk(id);
};

// Créer une nouvelle tâche
exports.createTask = async ({ nom, description, statut }) => {
  return await Task.create({ nom, description, statut });
};

// Mettre à jour une tâche
exports.updateTask = async (id, { nom, description, statut }) => {
  const task = await Task.findByPk(id);
  if (!task) return null;

  task.nom = nom ?? task.nom;
  task.description = description ?? task.description;
  task.statut = statut ?? task.statut;

  await task.save();
  return task;
};

// Supprimer une tâche
exports.deleteTask = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) return false;

  await task.destroy();
  return true;
};
