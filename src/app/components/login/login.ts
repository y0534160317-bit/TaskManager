

import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router); 

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  
  errorMass = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMass.set('אנא מלא את כל השדות בצורה תקינה');
      return;
    }

    const formData = this.loginForm.value;
    
    if (typeof formData.email === 'string' && typeof formData.password === 'string') {
      this.errorMass.set(null);
      this.successMessage.set(null);
      
      this.authService.login({ email: formData.email, password: formData.password }).subscribe({
        next: (res) => {
    
          this.successMessage.set('התחברות בוצעה בהצלחה! מעביר...');
      
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 1000);
        },
        error: (err) => {

          
          if (err.status === 401) {
            this.errorMass.set('אימייל או סיסמה שגויים. אנא נסה שוב.');
          } else if (err.status === 404) {
            this.errorMass.set('משתמש לא קיים במערכת. האם נרשמת?');
          } else if (err.status === 0) {
            this.errorMass.set('לא ניתן להתחבר לשרת. בדוק את החיבור.');
          } else if (err.status === 500) {
            this.errorMass.set('שגיאת שרת. נסה שוב מאוחר יותר.');
          } else {
            this.errorMass.set(err.message || 'שגיאה בהתחברות. נסה שוב.');
          }
        }
      });
    }
  }
  
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
