import { Component, OnInit } from '@angular/core';
import { PROFILES } from '../mock-profiles';
import { Profile } from '../profile';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {

  profiles:Profile[] = PROFILES;
  profile_titles:string[] = [];
  

  constructor() {
    for(let index = 0; index < this.profiles.length; index++) {
      this.profile_titles.push(this.profiles[index].name);
    }
  }

  ngOnInit(): void {
  }

  changeAccountType(event?: MouseEvent) {
    const evtMsg = event ? ' Event target is ' + (event.target as HTMLElement).textContent : '';
    alert('Changed Account Type ' + evtMsg);
    if (event) { event.stopPropagation(); }
  }
}

