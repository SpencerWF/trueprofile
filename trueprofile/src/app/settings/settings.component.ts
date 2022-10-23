import { Component, OnInit, Input } from '@angular/core';
import { Profile } from '../profile';
import { PROFILES } from '../mock-profiles';
import { EMPTY_PROFILES } from '../empty-profiles';

import { Streamer } from '../streamer';
import { STREAMER } from '../mock-streamer';
import { EMPTY_STREAMER} from '../empty-streamer';

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

  profiles:Profile[];
  mock_profiles:Profile[] = PROFILES;
  empty_profiles:Profile[] = EMPTY_PROFILES;
  profile_titles:string[] = [];
  mock_streamer:Streamer = STREAMER;
  empty_streamer:Streamer = EMPTY_STREAMER;
  streamer:Streamer;
  

  constructor(public auth: AuthService, private http: HttpClient) {
    this.streamer = this.empty_streamer;
    for(let index = 0; index < this.empty_profiles.length; index++) {
      this.profile_titles.push(this.empty_profiles[index].name);
    }
    this.profiles=this.empty_profiles;
  }

  ngOnInit(): void {
    this.getUserData();
  }

  twitter_signin(event?: MouseEvent) {
    console.log("Twitter Signin Attempt");
  }

  changeAccountType(event?: MouseEvent) {
    const evtMsg = event ? ' Event target is ' + (event.target as HTMLElement).textContent : '';
    alert('Changed Account Type ' + evtMsg);
    if (event) { event.stopPropagation(); }
  }

  getUserData() {
    if(environment.MYSQL !== undefined && environment.MYSQL == false){
      // Get mock data for no mysql environments
      this.getMockStreamer();
      this.getMockProfiles();
    } else {
      this.getStreamer();
      //TODO: What if there is no streamer?  Will basically be handled on backend, but should report error here if there still isn't a streamer?
    }
  }

  getStreamer() {
    this.http.get<Streamer>(`${environment.API_ADDRESS}/api/streamer/id/`, {observe:'body', responseType:'json'}).subscribe((streamer_result) => {
      if(streamer_result) {
        console.table(streamer_result);
        this.streamer = streamer_result;
        this.getProfiles();
      }
    });
  }

  getProfiles() {
    console.log("Getting Profiles");
    this.http.get<Profile[]>(`${environment.API_ADDRESS}/api/profile/id`).subscribe(profiles_result => {
      console.table(profiles_result);
      this.profiles = profiles_result;
      // for(const [key, value] of Object.entries(profiles_result)) {
      //   this.profile_titles.push(value.name);
      //   // console.log(`Key has value: ${key}`);
      //   this.profiles[parseInt(key)] = {
      //     name: value.name,
      //     img_change_type: value.img_change_type,
      //     custom_img: value.custom_img,
      //     text_change_type: value.text_change_type,
      //     custom_text: value.custom_text
      //   }
      // }
    });
  }

  getMockStreamer() {
    this.streamer = this.mock_streamer;
  }

  getMockProfiles() {
    for(let index = 0; index < this.mock_profiles.length; index++) {
      this.profile_titles.push(this.mock_profiles[index].name);
    }
    this.profiles=this.mock_profiles;
  }
}

