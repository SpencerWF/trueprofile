import { Component, OnInit, Input } from '@angular/core';
import { PROFILES } from '../mock-profiles';
import { Profile } from '../profile';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
  @Input() callback_address: string = environment.CALLBACK_ADDRESS;

  profiles:Profile[] = PROFILES;
  profile_titles:string[] = [];
  

  constructor() {
    for(let index = 0; index < this.profiles.length; index++) {
      this.profile_titles.push(this.profiles[index].name);
    }
  }

  ngOnInit(): void {
  }

  twitter_signin(event?: MouseEvent) {
    console.log("Twitter Signin Attempt");
  }

  changeAccountType(event?: MouseEvent) {
    const evtMsg = event ? ' Event target is ' + (event.target as HTMLElement).textContent : '';
    alert('Changed Account Type ' + evtMsg);
    if (event) { event.stopPropagation(); }
  }
}

