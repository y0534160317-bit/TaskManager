import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task, Task_ret } from '../models/taskModel';
import { Observable, throwError } from 'rxjs'; // ✅ הוספת throwError
import { map } from 'rxjs/operators'; // ✅ הוספת map

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly Url = 'http://localhost:3000/api/tasks';
  private http = inject(HttpClient);

  getTasks() {
    return this.http.get<Task_ret[]>(this.Url);
  }
  // ✅ חדש: קבלת משימה לפי ID - סינון מתוך הרשימה
  getTaskById(taskId: number): Observable<Task_ret> {
    return this.getTasks().pipe(
      map(tasks => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
          throw new Error(`Task with id ${taskId} not found`);
        }
        return task;
      })
    );
  }

  addTask(task: Task) {
    return this.http.post<Task>(this.Url, task);
  }

  updateTask(taskId: number, task: Task) {
    return this.http.patch<Task>(`${this.Url}/${taskId}`, task);
  }

  deleteTask(taskId: number) {
    return this.http.delete(`${this.Url}/${taskId}`);
  }
}
