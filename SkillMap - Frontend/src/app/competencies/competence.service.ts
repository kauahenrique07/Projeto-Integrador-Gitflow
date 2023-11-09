import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {
  private apiURL = 'https://localhost:8080/competence';

  constructor(private http: HttpClient) { }

  getCompetencies(): Observable<any> {
    return this.http.get<any>(this.apiURL);
  }

}
