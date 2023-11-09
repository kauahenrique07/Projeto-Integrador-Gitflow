import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('usuario/login')) {
      return next.handle(request);  // Bypass this interceptor for login requests
    }

    const currentUser = this.authService.currentUserValue;

    if (currentUser && currentUser.token) {
      console.log('Attaching token to request');

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          console.log('Token expirou ou não autorizado.');

          // Limpar o usuário atual e redirecionar para login
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        // Se não for um erro 401, simplesmente passa o erro adiante.
        return throwError(err);
      })
    );
  }
}
