const taskService = require('../services/task.service');

// Obtenir toutes les tâches
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Obtenir une tâche par ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Créer une nouvelle tâche
exports.createTask = async (req, res) => {
  try {
    const { nom, description, statut } = req.body;
    if (!nom) {
      return res.status(400).json({ message: 'Le champ "nom" est requis' });
    }
    const newTask = await taskService.createTask({ nom, description, statut });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  try {
    const { nom, description, statut } = req.body;
    const updatedTask = await taskService.updateTask(req.params.id, {
      nom,
      description,
      statut
    });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const deleted = await taskService.deleteTask(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
