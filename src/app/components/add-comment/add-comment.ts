
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments-service';
import { CommentRequest } from '../../models/commentModel';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-comment.html',
  styleUrl: './add-comment.scss',
})
export class AddComment implements OnInit {
  private commentsService = inject(CommentsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskId = signal<number | null>(null);
  errorMass = signal<string | null>(null);

  addCommentForm = new FormGroup({
    body: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('taskId');
    
    
    if (id) {
      this.taskId.set(Number(id));
    } else {
      this.errorMass.set('לא נמצא מזהה משימה בניתוב');
      this.router.navigate(['/teams']);
    }
  }

  onSubmit() {
    if (this.addCommentForm.invalid || !this.taskId()) {
      this.addCommentForm.markAllAsTouched();
      return;
    }

    const formData = this.addCommentForm.value;

    const commentData: CommentRequest = {
      taskId: this.taskId()!,
      body: String(formData.body),
    };


    this.commentsService.addComment(commentData).subscribe({
      next: (res) => {
        this.addCommentForm.reset();
        this.errorMass.set(null);
        this.router.navigate(['tasks', this.taskId(), 'comments']);
      },
      error: (err) => {
        
        const errorMessage = err.error?.error || err.error?.message || err.message || 'שגיאה לא ידועה';
        this.errorMass.set(errorMessage);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['tasks', this.taskId(), 'comments']);
  }
}
