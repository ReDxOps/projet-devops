import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const dummyTask: Task = {
    id: 1,
    nom: 'Test task',
    description: 'Test description',
    statut: 'à faire',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'aucune requête n’est restée ouverte
  });

  it('should fetch all tasks', () => {
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].nom).toBe('Test task');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush([dummyTask]);
  });

  it('should fetch a single task by ID', () => {
    service.getTask(1).subscribe(task => {
      expect(task.nom).toBe('Test task');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/tasks/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTask);
  });

  it('should create a task', () => {
    service.createTask(dummyTask).subscribe(task => {
      expect(task.nom).toBe('Test task');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/tasks');
    expect(req.request.method).toBe('POST');
    req.flush(dummyTask);
  });

  it('should update a task', () => {
    const updatedTask = { ...dummyTask, nom: 'Updated' };

    service.updateTask(1, updatedTask).subscribe(task => {
      expect(task.nom).toBe('Updated');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/tasks/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTask);
  });

  it('should delete a task', () => {
    service.deleteTask(1).subscribe(response => {
      expect(response).toBeNull(); // car void
    });

    const req = httpMock.expectOne('http://localhost:3000/api/tasks/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
