import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuthentication(state.url);
  }

  private checkAuthentication(url: string): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      
      this.authService.redirectUrl = url;

      
      this.router.navigate(['/login']);
      return false;
    }
  }
}