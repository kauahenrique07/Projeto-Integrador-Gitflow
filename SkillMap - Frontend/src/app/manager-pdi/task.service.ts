import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = 'https://localhost:8080/task';
  constructor(private http: HttpClient) { }

  updateTaskStatus(id: number, newStatus: string): Observable<Task> {
    const url = `${this.baseUrl}/${id}/status`;
    return this.http.put<Task>(url, newStatus);
  }
  getTasksByUserId(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/user/${userId}`);
  }

  insert(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}`, task);
  }


  findAll(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}`);
  }



}
