import { Component, inject, signal, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Task, Task_ret } from '../../models/taskModel';
import { AddTasks } from '../add-tasks/add-tasks';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks implements OnInit {
  private tasksService = inject(TasksService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  tasks = signal<Task_ret[]>([])
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  projectId = signal<number | null>(null);



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('projectId');

    if (id) {
      this.projectId.set(Number(id));
      this.loadasks();
    } else {
      this.error.set('לא נמצא מזהה פרויקט בניתוב');
      this.router.navigate(['/projects']);
    }
  }
  loadasks(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.tasksService.getTasks().subscribe({
      next: (data) => {
        const filteredTasks = data.filter(
          task => task.project_id === this.projectId()
        );

        this.tasks.set(filteredTasks);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('אירעה שגיאה בטעינת המשימות. נסה שנית מאוחר יותר.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  retry(): void {
    this.loadasks();
  }

  navigateToUpdate(taskId: number): void {
    this.router.navigate(['tasks', taskId, 'update']);

  }

    navigateToAdd(project_id:number): void {
    this.router.navigate(['projects', project_id, 'tasks', 'new']);

  }

  deleteTask(taskId: number): void {
    this.tasksService.deleteTask(taskId).subscribe({
      next: () => {
        const updatedTasks = this.tasks().filter(task => task.id !== taskId);
        this.tasks.set(updatedTasks);
      },
      error: (err) => {
        this.error.set('אירעה שגיאה במחיקת המשימה. נסה שנית מאוחר יותר.');
      }
    });
  }


navigateToComments(taskId: number): void {
  this.router.navigate(['tasks', taskId, 'comments']);
}
}
