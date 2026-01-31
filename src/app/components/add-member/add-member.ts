
import { Component, inject, signal, OnInit } from '@angular/core'; 
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamsService } from '../../services/teams-service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router'; 
@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-member.html',
  styleUrl: './add-member.scss',
})
export class AddMember implements OnInit { 
  private teamService = inject(TeamsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  teamId = signal<number | null>(null); 
  errorMass = signal<string | null>(null);
  
  addMemberForm = new FormGroup({
    userId: new FormControl('', [Validators.required, Validators.min(1)]), 
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

    if (this.addMemberForm.invalid || !this.teamId()) {
      this.addMemberForm.markAllAsTouched();
      return;
    }

    const formData = this.addMemberForm.value;
    const user_id = Number(formData.userId);
    

    this.teamService.addMemberToTeam(this.teamId()!, user_id).subscribe({ 
      next: (res) => {
        this.addMemberForm.reset();
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