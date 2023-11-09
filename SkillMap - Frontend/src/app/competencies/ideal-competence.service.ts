import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdealCompetenceService {
  private apiURL = 'https://localhost:8080/idealcompetence';

  constructor(private http: HttpClient) { }

  saveCompetence(competence: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(this.apiURL, competence, { headers });
  }

  getCompetenceCountForJob(jobId: number): Observable<number> {
    return this.http.get<number>(`${this.apiURL}/count/${jobId}`);
  }

  getIdealCompetenciesForJob(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/role/${jobId}`);
  }

  updateCompetenciesForRole(roleId: number, competencies: any[]): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put<any>(`${this.apiURL}/role/${roleId}`, competencies, { headers });
  }





}
