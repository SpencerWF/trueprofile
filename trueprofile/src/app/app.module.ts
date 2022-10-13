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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { LoginButtonComponent } from './login-button/login-button.component';
import { AppMetadataComponent } from './app-metadata/app-metadata.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    HomeComponent,
    ProfileComponent,
    LoginButtonComponent,
    AppMetadataComponent,
    PageNotFoundComponent
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
      // The domain and client id defined by angular "single-page" application on auth0
      domain: 'dev-f5zxf23m.eu.auth0.com',
      clientId: 'Awb7qfm27im6F0I0p79iHMTMORzI0oag',

      // Request this audience at user authentication time
      audience: 'https://dev-f5zxf23m.eu.auth0.com/api/v2/',

      // Request this scope at user authentication time
      scope: 'read:current_user',
      httpInterceptor: {
        allowedList: [ //TODO: Need to add an item with admin scope for testing
          '/api',
          '/api/*',
          {
            // Match any request that starts 'https://dev-f5zxf23m.eu.auth0.com/api/v2/' (Note asterisk)
            uri: 'https://dev-f5zxf23m.eu.auth0.com/api/v2/*',
            tokenOptions: {
              //Attached token should target this audience
              audience: 'https://dev-f5zxf23m.eu.auth0.com/api/v2/',

              // The attached token should have these scopes
              scope: 'read:current_user'
            }
          }
        ]
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
