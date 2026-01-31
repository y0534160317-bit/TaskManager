

import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {  Observable } from "rxjs";
import { Team } from "../models/teamModel";



@Injectable({ providedIn: 'root' })
export class TeamsService {
  private readonly Url = 'http://localhost:3000/api/teams';
  private http = inject(HttpClient);


  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.Url);
  }

  addTeam(data: string): Observable<Team> {
    return this.http.post<Team>(this.Url, { name: data });
  }

  addMemberToTeam(teamId: number, userId: number) {
    return this.http.post(`${this.Url}/${teamId}/members`, { userId });
  }
}
