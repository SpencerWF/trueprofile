import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { TwitchService } from '../twitch-service.service';

type twitchParams = {
  code: string,
  scope: string,
  state: string
}

@Component({
  selector: 'app-twitch-login',
  templateUrl: './twitch-login.component.html',
  styleUrls: ['./twitch-login.component.scss']
})
export class TwitchLoginComponent implements OnInit {

  

  paramsObject: any = {};

  constructor(public auth: AuthService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params};
        // console.table(this.paramsObject.params.code);

        if(this.paramsObject.params.code != '') {
          // this.twitchService.setTwitchToken(this.paramsObject.code);
          // this.twitchService.setTwitchToken(this.paramsObject.params.code);
          // console.log(this.paramsObject.code);

          localStorage.setItem('twitch_code', this.paramsObject.params.code);
          this.auth.loginWithRedirect()
        }
      });
  }
}
