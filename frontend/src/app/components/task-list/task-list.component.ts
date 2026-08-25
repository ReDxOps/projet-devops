import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  statusFilter: string = 'tous';

  get filteredTasks(): Task[] {
    if (this.statusFilter === 'tous') {
      return this.tasks;
    }
    return this.tasks.filter(task => task.statut === this.statusFilter);
  }

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    console.log('TaskListComponent chargé');
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des tâches', err);
        this.loading = false;
      }
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== id);
    });
  }
}
