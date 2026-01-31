import { Component, inject, signal ,OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/taskModel';
import { Router, ActivatedRoute } from '@angular/router';
 import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select'; 


@Component({
  selector: 'app-update-task',
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatSelectModule],
  templateUrl: './update-task.html',
  styleUrl: './update-task.scss',
})
export class UpdateTask implements OnInit {
private tasksService = inject(TasksService);
private router = inject(Router);
  private route = inject(ActivatedRoute);
 

  taskId = signal<number | null>(null); 
  projectId = signal<number | null>(null); 
  isLoading = signal<boolean>(false); 
  errorMass = signal<string | null>(null);

  updateTaskForm = new FormGroup({
  title: new FormControl('', [Validators.required, Validators.minLength(3)]),
  description: new FormControl(''),
  status: new FormControl(''),
  priority: new FormControl(''),
  assigned_id: new FormControl('', [Validators.min(1)]),
  due_date: new FormControl(''),
  order_index: new FormControl('', [Validators.min(0)])
});

ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('taskId');
    
    
    if (id) {
      this.taskId.set(Number(id));
      this.loadTask(); 
    } else {
      this.errorMass.set('לא נמצא מזהה משימה בניתוב');
      this.router.navigate(['/teams']);
    }
  }

  loadTask(): void {
    this.isLoading.set(true);
    this.errorMass.set(null);

    this.tasksService.getTaskById(this.taskId()!).subscribe({
      next: (task) => {
        
             this.updateTaskForm.patchValue({
          title: task.title,
          description: task.description || '',
          status: task.status || '',
          priority: task.priority || '',
          assigned_id: task.assigned_id ? String(task.assigned_id) : '', 
          due_date: task.due_date ? this.formatDateForInput(task.due_date) : '', 
          order_index: task.order_index ? String(task.order_index) : '' 
        });
     
        this.projectId.set(task.project_id); 
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMass.set('אירעה שגיאה בטעינת המשימה');
        this.isLoading.set(false);
      }
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; 
  }




  onSubmit() {
    if (this.updateTaskForm.invalid || !this.taskId()) {
      this.updateTaskForm.markAllAsTouched();
      return;
    }

    const formData = this.updateTaskForm.value;

    const t: Task = {
      id: this.taskId()!,
      projectId: this.projectId()!, 
      title: String(formData.title),
      description: formData.description || undefined,
      status: formData.status || undefined,
      priority: formData.priority || undefined,
      assignedId: Number(formData.assigned_id) || undefined,
      dueDate: formData.due_date ? new Date(formData.due_date) : undefined,
      orderIndex: Number(formData.order_index) || undefined,
    }
      this.tasksService.updateTask(this.taskId()!, t).subscribe({
        next: (res) => {
           this.updateTaskForm.reset();
             this.errorMass.set(null);
            ;
        },
        error: (err) => {
          this.errorMass.set(err.message);
        }
      });

     this.router.navigate(['projects', this.projectId(), 'tasks']);
   }

     cancel(): void {
    this.router.navigate(['projects', this.projectId(), 'tasks']);
  }
}
