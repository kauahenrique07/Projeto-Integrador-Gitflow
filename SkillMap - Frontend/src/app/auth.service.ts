import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //behaviorsubject armazena o estado da autenticação do usuário
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {

    return this.http.post<any>(`https://localhost:8080/usuario/login`, { email, password })
      .pipe(map(user => {
        console.log('Response from server:', user);

        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          console.log("User set in AuthService:", this.currentUserValue);
          console.log("User ID:", this.currentUserValue.id);
        }
        return user;
      }));
  }

  public get currentUserId(): number | null {
    const currentUser = this.currentUserValue;
    return currentUser && currentUser.id ? currentUser.id : null;
  }


  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
