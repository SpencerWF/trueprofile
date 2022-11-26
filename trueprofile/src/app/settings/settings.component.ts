import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Profile } from '../profile';
import { PROFILES } from '../mock-profiles';
import { EMPTY_PROFILES } from '../empty-profiles';

import { Streamer } from '../streamer';
import { STREAMER } from '../mock-streamer';
import { EMPTY_STREAMER} from '../empty-streamer';

import { environment } from '../../environments/environment';

import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';

import { TwitchService } from '../twitch-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
  @Input() twitch_callback: string = environment.TWITCH_CALLBACK;

  profiles:Profile[];
  mock_profiles:Profile[] = PROFILES;
  empty_profiles:Profile[] = EMPTY_PROFILES;
  profile_titles:string[] = [];
  mock_streamer:Streamer = STREAMER;
  empty_streamer:Streamer = EMPTY_STREAMER;
  streamer:Streamer;

  twitch_token: string | null = '';

  constructor(public auth: AuthService, private http: HttpClient) {
    // this.subscription = this.twitchService.currentToken.subscribe(token => this.twitch_token = token);
    // this.twitch_token = this.twitchService.tokenSource.complete();

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
      console.log(`Status code is: ${streamer_result.status}`);
      if(streamer_result) {
        console.table(streamer_result);
        this.streamer = streamer_result;
        this.twitch_token = sessionStorage.getItem('twitch_code');
        if(streamer_result.twitch_name === null && this.twitch_token) {
          // this.twitch_token = sessionStorage.getItem("twitch_code");
          sessionStorage.removeItem("twitch_code");
          this.http.put(`${environment.API_ADDRESS}/api/streamer/twitch_code/`, {code:this.twitch_token}).subscribe();
        }
        this.getProfiles();
      } else {
        console.log("Streamer not found");
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

