
import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
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
