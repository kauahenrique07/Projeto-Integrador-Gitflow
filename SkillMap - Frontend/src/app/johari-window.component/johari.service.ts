
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JohariService {

  private apiUrl = 'https://localhost:8080/johari/window';

  constructor(private http: HttpClient) { }

  getJohariWindowForUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }
}
