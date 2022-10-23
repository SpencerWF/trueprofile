import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import * as e from 'express';
import { environment } from 'src/environments/environment';
import { Profile } from '../profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() profile?: Profile;
  // profile_

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if(this.profile?.custom_img!='' && this.profile?.custom_img!=null) {
      this.http.get(`${environment.API_ADDRESS}/public/images/${this.profile.custom_img}.jpg`).subscribe(profile_img => {
        if(profile_img!==undefined) {
          console.log(profile_img);
        } else {
          console.log("Profile image is not defined");
        }
      });
    }
  }
}
