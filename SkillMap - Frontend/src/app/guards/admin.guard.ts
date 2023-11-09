import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(): boolean | UrlTree {
    const currentUser = this.authService.currentUserValue;

    if (!currentUser || !currentUser.token) {
      return this.router.parseUrl('/login');
    }


    const tokenParts = currentUser.token.split('.');
    if (tokenParts.length !== 3) {
      return this.router.createUrlTree(['/login']);
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    const accessType = payload.accessType;

    // Verifica se o usuário tem ADMIN
    if (accessType && Array.isArray(accessType) && accessType.includes('ADMIN')) {
      //permite o acesso
      return true;
    } else {
      return this.router.createUrlTree(['/user-main-screen']);
    }
  }
}
