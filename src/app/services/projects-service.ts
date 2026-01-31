import { inject, Injectable } from '@angular/core';
import { Project,ProjectRequest  } from '../models/projectModel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly Url = 'http://localhost:3000/api/projects';
  private http = inject(HttpClient);


  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.Url);
  }

   addProject(project: ProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.Url, project);
  }

}
