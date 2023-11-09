
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assessment } from './assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private baseUrl = 'https://localhost:8080/evaluation';

  constructor(private http: HttpClient) {}

  getPendingAssessments(userId: number): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.baseUrl}/pending/${userId}`);
  }
}
