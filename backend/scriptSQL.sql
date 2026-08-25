-- Création de la base de données
CREATE DATABASE IF NOT EXISTS todolist_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE todolist_db;

-- Création de la table des tâches
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT NULL,
  statut ENUM('à faire', 'en cours', 'terminée') DEFAULT 'à faire',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
