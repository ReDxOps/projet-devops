import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', [
      'createTask',
      'getTask',
      'updateTask',
      'deleteTask'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Configure tous les retours de mock AVANT de créer le composant
    mockTaskService.createTask.and.returnValue(of({
      id: 1,
      nom: 'Nouvelle tâche',
      description: 'Description ici',
      statut: 'à faire',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    mockTaskService.updateTask.and.returnValue(of({
      id: 1,
      nom: 'Tâche modifiée',
      description: 'Description ici',
      statut: 'à faire',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    mockTaskService.getTask.and.returnValue(of({
      id: 1,
      nom: 'Tâche existante',
      description: 'Description',
      statut: 'à faire',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      declarations: [TaskFormComponent],
      providers: [
        FormBuilder,
        { provide: TaskService, useValue: mockTaskService },
        { provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: convertToParamMap({})
            }
          } },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call createTask on form submit for new task', () => {
    component.taskForm.patchValue({
      nom: 'Nouvelle tâche',
      description: 'Description ici',
      statut: 'à faire'
    });

    component.onSubmit();

    expect(mockTaskService.createTask).toHaveBeenCalledWith({
      nom: 'Nouvelle tâche',
      description: 'Description ici',
      statut: 'à faire'
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not submit if form is invalid', () => {
    component.taskForm.patchValue({
      nom: '',
      description: 'Description ici',
      statut: 'à faire'
    });

    component.onSubmit();

    expect(mockTaskService.createTask).not.toHaveBeenCalled();
  });
});