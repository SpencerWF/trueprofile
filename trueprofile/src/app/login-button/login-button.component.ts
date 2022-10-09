import { Component, Inject, OnInit } from '@angular/core';

// Import the AuthService type from the SDK
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-button',
  template: `
    <ng-container *ngIf="auth.isAuthenticated$ | async; else loggedOut">
      <button (click)="auth.logout({ returnTo: 'http://localhost:4200' })">
        Log out
      </button>
    </ng-container>

    <ng-template #loggedOut>
      <button (click)="auth.loginWithRedirect()">Log in</button>
    </ng-template>
  `,
  styles: [],
})

export class LoginButtonComponent {
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
  ngOnInit(): void {
  }

}
