import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalService,
  ) { }

  async checkUser(email: string): Promise<User[]> {
    let get = `email=${email}`
    return (await firstValueFrom(this.httpClient.get<any>(`${this.globalService.apiUrl}/project/user_ci?${get}`, this.globalService.httpOptions))).data;
  }

}
