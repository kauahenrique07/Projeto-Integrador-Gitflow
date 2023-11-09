import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  isUserEvaluationFinalized(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/user/${userId}/isFinalized`);
  }

  isPeerEvaluationFinalized(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/peer/${userId}/isFinalized`);
  }

  isManagerEvaluationFinalized(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/manager/${userId}/isFinalized`);
  }

  areAllEvaluationsFinalized(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/all/${userId}/isFinalized`);
  }
}
