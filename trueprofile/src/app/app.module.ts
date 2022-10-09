import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module'; //First Requirement for Angular Routing
import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AuthModule } from '@auth0/auth0-angular';
import { LoginButtonComponent } from './login-button/login-button.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    HomeComponent,
    ProfileComponent,
    LoginButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, //First Requirement for Angular Routing
    MatTabsModule,
    MatRadioModule,
    MatDividerModule,
    HttpClientModule,
    FormsModule,

    //Import Auth0 authentication module 
    AuthModule.forRoot({
      domain: 'dev-f5zxf23m.eu.auth0.com',
      clientId: '6fx5x7nOozGVzssb23NjG6LWIWleihf4'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
