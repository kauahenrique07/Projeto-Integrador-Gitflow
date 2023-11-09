import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class PeerCompetenceService {
  private apiURL = 'https://localhost:8080/peercompetence';

  constructor(private http: HttpClient) { }

  getCompetencies(): Observable<any> {
    return this.http.get<any>(this.apiURL);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(error);
  }

  addPeerCompetencesBatch(peerCompetences: {
    peerId: number | undefined;
    evaluationCycleId: number | undefined;
    competenceId: number;
    userId: string | undefined
  }[]): Observable<any> {
    return this.http.post(`${this.apiURL}/batch`, peerCompetences)
      .pipe(
        catchError(this.handleError)
      );
  }
}
