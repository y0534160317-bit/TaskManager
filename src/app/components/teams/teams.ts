import { Component, inject, signal } from '@angular/core';
import { Team } from '../../models/teamModel';
import { TeamsService } from '../../services/teams-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  imports: [ CommonModule],
  standalone: true,
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams {
  private teamsService = inject(TeamsService);
private router = inject(Router);
  teams = signal<Team[]>([])
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTeams();
  }
  loadTeams(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.teamsService.getTeams().subscribe({
      next: (data) => {
        this.teams.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('אירעה שגיאה בטעינת הקבוצות. נסה שנית מאוחר יותר.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }




  navigateToProjects(teamId:number): void {
    this.router.navigate(['teams', teamId, 'projects']);
  }
 
  navigateToAddTeam(): void {
    this.router.navigate(['teams/new']);
  }
  navigateToAddMember(teamId: number): void {
    this.router.navigate(['teams', teamId, 'add-member']);
  }
  retry(): void {
    this.loadTeams();
  }
}