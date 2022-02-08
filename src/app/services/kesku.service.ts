import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Akun } from '../models/kesku.model';
import { GlobalService } from './angular_services/global.service';

@Injectable({
  providedIn: 'root'
})
export class KeskuService {
  private db = 'project'
  private accountTable = 'kesku_akun'
  private auth = {
    username: 'admin',
    password: 'admin'
  }

  constructor(
    private _httpClient: HttpClient,
    private _globalService: GlobalService,
  ) { }

  async initAccounts(id_book: number): Promise<Akun[]> {
    let get = `id_book=${id_book}`
    return (await firstValueFrom(this._httpClient.get<any>(`${this._globalService.apiUrl}/${this.db}/${this.accountTable}?${get}`, this._globalService.setHttpOptions({username:this.auth.username, password: this.auth.password})))).data
  }

  async checkAccountName(akun: Akun) {
    let get = `akunName=${akun.akunName}&id_book=${akun.id_book}`
    return (await firstValueFrom(this._httpClient.get<any>(`${this._globalService.apiUrl}/${this.db}/${this.accountTable}?${get}`, this._globalService.setHttpOptions({username:this.auth.username, password: this.auth.password})))).data.length == 0 ? true : false
  }

  async addAccount(akun: Akun) {
    const result = new Array
    Object.keys(akun).forEach((element, key) => {
      // if (Object.values(akun)[key] !== undefined) {
        result.push(element + '=' + Object.values(akun)[key])
      // }
    })
    const post = result.join('&')
    return (await firstValueFrom(this._httpClient.post<any>(`${this._globalService.apiUrl}/${this.db}/${this.accountTable}`, post, this._globalService.setHttpOptions({username:this.auth.username, password: this.auth.password})))).data
  }
}
