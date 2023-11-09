import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class ManagerCompetenceService {
  private apiURL = 'https://localhost:8080/managercompetence';

  constructor(private http: HttpClient) { }

  getCompetencies(): Observable<any> {
    return this.http.get<any>(this.apiURL);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(error);
  }

  addManagerCompetencesBatch(managerCompetences: {
    evaluationCycleId: number;
    competenceId: number;
    managerId: number | undefined;
    userId: string | undefined
  }[]): Observable<any> {
    return this.http.post(`${this.apiURL}/batch`, managerCompetences)
      .pipe(
        catchError(this.handleError)
      );
  }
}
