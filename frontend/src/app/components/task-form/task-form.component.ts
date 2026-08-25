import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  statutOptions = ['à faire', 'en cours', 'terminée'];
  taskId?: number;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      statut: ['à faire']
    });
  }

  ngOnInit(): void {
    console.log('TaskFormComponent init');
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = idParam !== null;
    this.taskId = this.isEdit ? Number(idParam) : undefined;

    if (this.isEdit && this.taskId !== undefined && !isNaN(this.taskId)) {
      this.taskService.getTask(this.taskId).subscribe({
        next: (task) => this.taskForm.patchValue(task),
        error: () => this.router.navigate(['/'])
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    const task: Task = this.taskForm.value;

    if (this.isEdit) {
      this.taskService.updateTask(this.taskId!, task).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.taskService.createTask(task).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
