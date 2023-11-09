import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiURL = 'https://localhost:8080/role'; // Coloque aqui o endpoint da sua API

  constructor(private http: HttpClient) { }

  createRole(role: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(this.apiURL, role, { headers });
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiURL);
  }
}
