import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";
import {UserCompetencePayload} from "./user-competence-payload.model";

@Injectable({
  providedIn: 'root'
})
export class UserCompetenceService {
  private apiURL = 'https://localhost:8080/usercompetence';

  constructor(private http: HttpClient) { }

  getCompetencies(): Observable<any> {
    return this.http.get<any>(this.apiURL);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(error);
  }

  addUserCompetencesBatch(userCompetences: {
    evaluationCycleId: number;
    competenceId: number;
    userId: string
  }[]): Observable<any> {
    return this.http.post(`${this.apiURL}/batch`, userCompetences)
      .pipe(
        catchError(this.handleError)
      );
  }
}
