
import { Component, inject, signal } from '@angular/core';
import { TeamsService } from '../../services/teams-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-team',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule, MatIconModule],
  templateUrl: './add-team.html',
  styleUrl: './add-team.scss',
})
export class AddTeam {
  private teamService = inject(TeamsService);
  private router = inject(Router); 

  addTeamForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]), 
  });

  errorMass = signal<string | null>(null);

  onSubmit() {
    if (this.addTeamForm.invalid) {
      this.addTeamForm.markAllAsTouched();
      return;
    }

    const formData = this.addTeamForm.value;
    
    if (!formData.name) {
      this.errorMass.set('נא למלא את שם הקבוצה');
      return;
    }


    this.teamService.addTeam(formData.name).subscribe({
      next: (res) => {
        this.addTeamForm.reset(); 
        this.errorMass.set(null);
        
        this.router.navigate(['/teams']);
      },
      error: (err) => {
        
        const errorMessage = err.error?.error || err.error?.message || err.message || 'שגיאה לא ידועה';
        this.errorMass.set(errorMessage);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/teams']);
  }
}