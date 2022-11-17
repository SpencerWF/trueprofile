import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-twitch-login',
  templateUrl: './twitch-login.component.html',
  styleUrls: ['./twitch-login.component.scss']
})
export class TwitchLoginComponent implements OnInit {

  paramsObject: Object = {};

  constructor(public auth: AuthService, private route: ActivatedRoute) {
    auth.loginWithRedirect()
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params};
        console.log(this.paramsObject);
      });
  }

}
