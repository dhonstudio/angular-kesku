import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  apiUrl = environment.API_URL;
  httpOptions = {headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa("admin:admin")
  })};

  constructor() { }
}
