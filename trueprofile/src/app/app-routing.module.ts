import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; //Second Requirement for Angular Routing
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home-component', component: HomeComponent }, //Second Requirement for Angular Routing
  { path: 'settings-component', component: SettingsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ], //Second Requirement for Angular Routing
  exports: [RouterModule]
})
export class AppRoutingModule { }
 