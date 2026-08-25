export interface Task {
  id?: number; // facultatif à la création
  nom: string;
  description?: string;
  statut: 'à faire' | 'en cours' | 'terminée';
  createdAt?: string;
  updatedAt?: string;
}
