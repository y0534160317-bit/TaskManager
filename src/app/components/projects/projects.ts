import { Component, inject, signal,OnInit  } from '@angular/core';
import { ProjectsService } from '../../services/projects-service';
import { Project } from '../../models/projectModel';
import { Router ,ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements OnInit {
  private projectsService = inject(ProjectsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 
  projects = signal<Project[]>([])
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  teamId = signal<number | null>(null); 

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('teamId');
    
    if (id) {
      this.teamId.set(Number(id));
      this.loadProjects();
    } else {
      this.error.set('לא נמצא מזהה קבוצה בניתוב');
      this.router.navigate(['/teams']); 
    }
  }
  loadProjects(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.projectsService.getProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.isLoading.set(false);

           const filteredProjects = data.filter(
          project => project.team_id === this.teamId());
        this.projects.set(filteredProjects);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('אירעה שגיאה בטעינת הפרויקטים. נסה שנית מאוחר יותר.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  retry(): void {
    this.loadProjects();
  }


  navigateToTasks(projectId: number): void {
    this.router.navigate(['projects', projectId, 'tasks']);
  }
 navigateToAddProject(): void {
    this.router.navigate(['teams', this.teamId(), 'projects', 'new']);
  }

}
