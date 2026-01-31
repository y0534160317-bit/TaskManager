

import { Component, inject, signal, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects-service';
import { ProjectRequest } from '../../models/projectModel'; 
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-project.html',
  styleUrl: './add-project.scss',
})
export class AddProject implements OnInit {
  private projectsService = inject(ProjectsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  teamId = signal<number | null>(null);
  errorMass = signal<string | null>(null);
  
  addProjectForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('')
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('teamId');
    
    
    if (id) {
      this.teamId.set(Number(id));
    } else {
      this.errorMass.set('לא נמצא מזהה קבוצה בניתוב');
      this.router.navigate(['/teams']);
    }
  }

  onSubmit() {
    if (this.addProjectForm.invalid || !this.teamId()) {
      this.addProjectForm.markAllAsTouched();
      return;
    }

    const formData = this.addProjectForm.value;
    
    

    
    const projectData: ProjectRequest = {
      teamId: this.teamId()!,
      name: String(formData.name),
      description: formData.description || undefined
    };


    this.projectsService.addProject(projectData).subscribe({
      next: (res) => {
      
        this.addProjectForm.reset();
        this.errorMass.set(null);
        this.router.navigate(['teams', this.teamId(), 'projects']);
      },
      error: (err) => {
        
        const errorMessage = err.error?.error || err.error?.message || err.message || 'שגיאה לא ידועה';
        this.errorMass.set(errorMessage);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['teams', this.teamId(), 'projects']);
  }
}