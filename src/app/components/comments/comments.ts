

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments-service';
import { Comment } from '../../models/commentModel';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
})
export class Comments implements OnInit {
  private commentsService = inject(CommentsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  comments = signal<Comment[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  taskId = signal<number | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('taskId');
    
    
    if (id) {
      this.taskId.set(Number(id));
      this.loadComments();
    } else {
      this.error.set('לא נמצא מזהה משימה בניתוב');
      this.router.navigate(['/teams']);
    }
  }

  loadComments(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.commentsService.getCommentsByTask(this.taskId()!).subscribe({
      next: (data) => {
        this.comments.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('אירעה שגיאה בטעינת התגובות. נסה שנית מאוחר יותר.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  retry(): void {
    this.loadComments();
  }

  navigateToAddComment(): void {
    this.router.navigate(['tasks', this.taskId(), 'comments', 'new']);
  }

  goBack(): void {
   
    this.router.navigate(['/teams']); 
  }
}
