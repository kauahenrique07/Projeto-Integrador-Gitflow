import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const currentUser = this.authService.currentUserValue;

    // Se o usuário não estiver autenticado, redirecione para o login.
    if (!currentUser || !currentUser.token) {
      return this.router.parseUrl('/login');
    }

    
    return true;
  }
}
