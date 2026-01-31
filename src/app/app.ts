
import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth-service';
 import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'; 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule, MatIconModule, MatToolbarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private authService = inject(AuthService); 
  
 
  isLoggedIn = signal<boolean>(false);
  currentUser = signal<string | null>(null);
  userRole = signal<string | null>(null); 

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn.set(!!user);
      this.currentUser.set(user?.name || null);
      this.userRole.set(user?.role || null);
    });
  }

  logout() {
    this.authService.logout();
  }
}
