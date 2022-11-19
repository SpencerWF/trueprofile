import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {
  // private tokenSource = new BehaviorSubject('');
  // public readonly currentToken: Observable<string> = this.tokenSource.asObservable();

  // twitch_token: string = "";
  public tokenSource = new AsyncSubject<string>();

  setTwitchToken(token: string) {
    this.tokenSource.next(token);
  }

  // getTwitchToken() {
  //   return this.twitch_token;
  // }

  constructor() { }
}
