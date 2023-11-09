import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { CreationSuccessResponse } from '../create-user-dialog/CreationSuccessResponse';
import { Department } from './user.model';
import {FormControl, ɵValue} from "@angular/forms";


interface Competence {
  code: string;
  title: string;
}



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:8080/usuario';

  constructor(private http: HttpClient) { }



  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  unlockUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/unlockUser`, {}, { responseType: 'text' as 'json' });
  }

  completeAdminTour(id: number): Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/${id}/completeAdminTour`, {}, {responseType: 'text' as 'json'});
  }

  createUser(user: any): Observable<CreationSuccessResponse> {
    return this.http.post<CreationSuccessResponse>(this.apiUrl, user).pipe(
      tap(response => console.log('Resposta recebida para a criação do usuário: ', response)),
      catchError(error => {
        console.error('Erro na criação do usuário: ', error);
        return throwError(error);
      })
    );
  }

  getDepartments(): Observable<Department[]> {
  return this.http.get<Department[]>('https://localhost:8080/department');
}

  getDepartment(id: number): Observable<Department> {
    return this.http.get<Department>(`https://localhost:8080/department/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  updateUserStatus(userId: number, userStatus: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${userId}/status`, { userStatus });
  }

  getUsersByManagerId(managerId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/manager/${managerId}`);
  }

  getIdealCompetencesByUserId(id: number): Observable<Competence[]> {
    return this.http.get<Competence[]>(`${this.apiUrl}/${id}/ideal-competence`);
  }


  updateProfilePicture(userId: number, file: File): Observable<void> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http.put<void>(`${this.apiUrl}/${userId}/profilepicture`, formData, { headers: headers });
  }

  changeUserPassword(userId: number, newPassword: string) {
    const params = new HttpParams().set('newPassword', newPassword);
    return this.http.put(`${this.apiUrl}/${userId}/changeUserPassword`, {}, { params: params });
  }




}
