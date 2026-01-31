

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { authResponse, User } from '../models/userModel';
import { BehaviorSubject,  Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly Url = 'http://localhost:3000/api/auth';
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private platformId = inject(PLATFORM_ID);
  
  private currentUserSubject: BehaviorSubject<User | null>;
  currentUser$: Observable<User | null>;

  constructor() {
    const initialUser = this.isBrowser() 
      ? JSON.parse(localStorage.getItem('user') || 'null')
      : null;
    
    this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token');
  }

  register(data: { name: string; email: string; password: string }): Observable<authResponse> {
    return this.http.post<authResponse>(`${this.Url}/register`, data).pipe(
      tap((res) => {
        this.saveSession(res);
      })
    );
  }

  login(data: { email: string; password: string }): Observable<authResponse> {
    return this.http.post<authResponse>(`${this.Url}/login`, data).pipe(
      tap((res) => {
        this.saveSession(res);
      })
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private saveSession(res: authResponse) {
    if (!this.isBrowser()) return;
    
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('token', res.token);
    this.currentUserSubject.next(res.user);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
