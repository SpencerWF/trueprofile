import { Component, OnInit } from '@angular/core';
import { concatMap, tap, pluck } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-app-metadata',
  template: `<div *ngIf="metadata">
      <pre>{{ metadata | json }}</pre>
    </div>`,
  styleUrls: ['./app-metadata.component.scss']
})
export class AppMetadataComponent implements OnInit {
  metadata = {};
  constructor(public auth: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.auth.user$
    // .pipe(
    //   concatMap((user) => {
    //     if(user!==null && user!==undefined) {
    //       this.http.get(
    //         encodeURI(`https://dev-f5zxf23m.eu.auth0.com/api/v2/users/${user.sub}`)
    //       )
        
    //     }
    //   }),
    //   pluck('app_metadata'),
    //   tap((meta) => (this.metadata = meta as Object))
    // )
    // .subscribe();
  }

}
