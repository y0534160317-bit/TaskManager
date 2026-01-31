import { Component, inject, signal,OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/taskModel';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select'; 

@Component({
  selector: 'app-add-tasks',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule, MatSelectModule, MatCardModule, MatIconModule],
  templateUrl: './add-tasks.html',
  styleUrl: './add-tasks.scss',
})
export class AddTasks  implements OnInit {
  private tasksService = inject(TasksService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
   projectId   = signal<number | null>(null);

  addTaskForm = new FormGroup({
  title: new FormControl('', [Validators.required, Validators.minLength(3)]),
  description: new FormControl(''),
  status: new FormControl('todo'),
  priority: new FormControl('medium'),
  assigned_id: new FormControl('', [Validators.min(1)]),
  due_date: new FormControl(''),
  order_index: new FormControl('', [Validators.min(0)])
});


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('projectId');
    
    
    if (id) {
      this.projectId.set(Number(id));
    } else {
      this.errorMass.set('לא נמצא מזהה פרויקט בניתוב');
      this.router.navigate(['/teams']);
    }
  }
  errorMass = signal<string | null>(null);

  onSubmit() {
    if (this.addTaskForm.invalid || !this.projectId()) {
      this.addTaskForm.markAllAsTouched();
      return;
    }
    const formData = this.addTaskForm.value;
    const t: Task = {
      projectId: this.projectId()!, 
      title: String(formData.title),
      description: formData.description || undefined,
      status: formData.status || undefined,
      priority: formData.priority || undefined,
      assignedId: Number(formData.assigned_id) || undefined,
      dueDate: formData.due_date ? new Date(formData.due_date) : undefined,
      orderIndex: Number(formData.order_index) || undefined,
    }
      this.tasksService.addTask(t).subscribe({
        next: (res) => {
           this.addTaskForm.reset();
             this.errorMass.set(null);
        },
        error: (err) => {
          this.errorMass.set(err.message);
        }
      });

        this.router.navigate(['projects', this.projectId(), 'tasks']);

  }
}



