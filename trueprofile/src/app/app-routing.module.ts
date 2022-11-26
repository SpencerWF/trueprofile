import { NgModule } from '@angular/core';
import { AuthGuard } from '@auth0/auth0-angular';
import { LoggedInGuard } from './auth/logged-in.guard';
import { RouterModule, Routes } from '@angular/router'; //Second Requirement for Angular Routing
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { TwitchLoginComponent } from './twitch-login/twitch-login.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TwitterLoginComponent } from './twitter-login/twitter-login.component';

const routes: Routes = [
  { path: 'home-component', component: HomeComponent }, //Second Requirement for Angular Routing
  { path: 'twitch-login', component: TwitchLoginComponent}, //Route for user login Twitch
  { path: 'twitter-login', component: TwitterLoginComponent}, //Route for user login Twitter
  { path: 'settings-component', component: SettingsComponent, canActivate:[AuthGuard] },
  { path: '',   redirectTo: '/settings-component', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ], //Second Requirement for Angular Routing
  exports: [RouterModule]
})
export class AppRoutingModule { }
 