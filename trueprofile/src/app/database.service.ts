import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

//Typical but not necessary
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  api_url = environment.api_address;

  constructor(private http: HttpClient) { }

  this.http.get()
}
