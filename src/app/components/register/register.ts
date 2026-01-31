
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
 import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule, MatIconModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  
  errorMass = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMass.set('אנא מלא את כל השדות בצורה תקינה');
      return;
    }
    
    const formData = this.registerForm.value;

    if (typeof formData.username === 'string' && 
        typeof formData.email === 'string' && 
        typeof formData.password === 'string') {
      
      this.errorMass.set(null);
      this.successMessage.set(null);
      
      this.authService.register({ 
        name: formData.username, 
        email: formData.email, 
        password: formData.password 
      }).subscribe({
        next: (res) => {
          this.successMessage.set('הרשמה בוצעה בהצלחה! מעביר לדף המשימות...');
          
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 1000);
        },
        error: (err) => {
          
          if (err.status === 409) {
            this.errorMass.set('האימייל כבר קיים במערכת. האם אתה כבר רשום?');
          } else if (err.status === 400) {
            this.errorMass.set('נתונים לא תקינים. בדוק את השדות.');
          } else if (err.status === 0) {
            this.errorMass.set('לא ניתן להתחבר לשרת. בדוק את החיבור.');
          } else if (err.status === 500) {
            this.errorMass.set('שגיאת שרת. נסה שוב מאוחר יותר.');
          } else {
            this.errorMass.set(err.message || 'שגיאה בהרשמה');
          }
        }
      });
    }
  }
  
  goToLogin() {
    this.router.navigate(['/login']);
  }
}