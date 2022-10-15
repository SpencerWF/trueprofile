import { Component, OnInit, Input } from '@angular/core';
import { PROFILES } from '../mock-profiles';
import { Profile } from '../profile';
import { environment } from '../../environments/environment';

import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
  @Input() callback_address: string = environment.CALLBACK_ADDRESS;

  profiles:Profile[] = PROFILES;
  profile_titles:string[] = [];
  

  constructor(public auth: AuthService, private http: HttpClient) {
    for(let index = 0; index < this.profiles.length; index++) {
      this.profile_titles.push(this.profiles[index].name);
    }
  }

  ngOnInit(): void {
    if(environment.production==false) {
      console.log("Printing this now")
      this.createUser();
      // console.table(this.auth.getUser())
    }
  }

  twitter_signin(event?: MouseEvent) {
    console.log("Twitter Signin Attempt");
  }

  changeAccountType(event?: MouseEvent) {
    const evtMsg = event ? ' Event target is ' + (event.target as HTMLElement).textContent : '';
    alert('Changed Account Type ' + evtMsg);
    if (event) { event.stopPropagation(); }
  }

  createUser() {
    if(this.auth.isAuthenticated$) {

      console.log(`User is authenticated and about to do API call`)

      this.http.get('http://localhost:8080/api/private/').subscribe(result => console.log(result));
    }
  }
}

