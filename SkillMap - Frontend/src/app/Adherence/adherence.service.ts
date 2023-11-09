// Importações necessárias
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdherenceService {


  private apiURL: string = 'https://localhost:8080/adherence';

  constructor(private http: HttpClient) { }

  getCompetenceDistributionByRoleId(roleId: number | undefined): Observable<Map<string, number>> {
    const url = `${this.apiURL}/competenceDistribution/${roleId}`;
    return this.http.get<Map<string, number>>(url);
  }

  getCompetenceDistributionByUserId(userId: number | undefined): Observable<Map<string, number>>{
    const url = `${this.apiURL}/evaluationCompetenceDistribution/${userId}`;
    return this.http.get<Map<string, number>>(url);
  }

  getAdherenceByUserId(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiURL}/${userId}`);
  }
}
