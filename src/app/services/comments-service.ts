
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment, CommentRequest } from '../models/commentModel';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly apiUrl = 'http://localhost:3000/api/comments';
  private http = inject(HttpClient);

  getCommentsByTask(taskId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?taskId=${taskId}`);
  }

  addComment(comment: CommentRequest): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }
}