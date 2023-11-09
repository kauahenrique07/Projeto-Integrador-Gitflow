import {Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";



@Injectable({
  providedIn: 'root'
})

export class CyclesService {
  private apiURL = 'https://localhost:8080/evaluationcycle';


  constructor(private http: HttpClient) {

  }

  createCycle(cycle: any): Observable<any>{
    const headers = { 'Content-Type': 'application/json'}
    return this.http.post<any>(this.apiURL, cycle, {headers});
  }

  findAll(): Observable<any[]>{
    return this.http.get<any[]>(this.apiURL);
  }

}
