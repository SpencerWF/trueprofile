import { Component, OnInit } from '@angular/core';
import { concatMap, tap, map } from 'rxjs/operators';

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
  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // this.auth.user$
    // .pipe(
    //   concatMap((user) =>
    //       this.http.get(
    //         encodeURI(`https://dev-f5zxf23m.eu.auth0.com/api/v2/users/${user.sub}`)
    //       )
    //     ),
    //   map((user) => user['app_metadata']),
    //   tap((meta) => (this.metadata = meta))
    // )
    // .subscribe();
  }

}
