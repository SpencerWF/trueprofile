import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      console.log(`Logged In Guard activated`)
      return this.checkLogin();
  }

  checkLogin(): boolean {
    if(this.auth.isAuthenticated$) {
      console.log("Authentication is passing")
      return true;
    }

    console.log("Redirect to home");
    this.auth.loginWithRedirect();
    // this.router.navigate(['/home-component'])
    return false;
  }
}

