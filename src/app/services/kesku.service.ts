import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Akun, Trx } from '../models/kesku.model';
import { GlobalService } from './angular_services/global.service';

@Injectable({
  providedIn: 'root'
})
export class KeskuService {
  private db = 'project'
  private accountTable = 'kesku_akun'
  private trxTable = 'kesku_trx'
  private auth = {
    username: 'admin',
    password: 'admin'
  }

  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalService,
  ) { }

  async initAccounts(id_book: number): Promise<Akun[]> {
    let get = `id_book=${id_book}`
    return (await firstValueFrom(this.httpClient.get<any>(`${this.globalService.apiUrl}/${this.db}/${this.accountTable}?${get}`, this.globalService.setHttpOptions({username:this.auth.username, password: this.auth.password})))).data
  }

  async initTransactions(id_book: number): Promise<Trx[]> {
    let get = `id_book=${id_book}`
    return (await firstValueFrom(this.httpClient.get<any>(`${this.globalService.apiUrl}/${this.db}/${this.trxTable}?${get}`, this.globalService.setHttpOptions({username:this.auth.username, password: this.auth.password})))).data
  }

  async checkAccountName(akun: Akun) {
    let get = `akunName=${akun.akunName}&id_book=${akun.id_book}`
    return (await firstValueFrom(this.httpClient.get<any>(`${this.globalService.apiUrl}/${this.db}/${this.accountTable}?${get}`, this.globalService.setHttpOptions({username:this.auth.username, password: this.auth.password})))).data.length == 0 ? true : false
  }

  async addAccount(akun: Akun) {
    const result = new Array
    Object.keys(akun).forEach((element, key) => {
      result.push(element + '=' + Object.values(akun)[key])
    })
    const post = result.join('&')
    return (await firstValueFrom(this.httpClient.post<any>(`${this.globalService.apiUrl}/${this.db}/${this.accountTable}`, post, this.globalService.setHttpOptions({username:this.auth.username, password: this.auth.password})))).data
  }

  async deleteAccount(id_akun: number) {
    return (await firstValueFrom(this.httpClient.get<any>(`${this.globalService.apiUrl}/${this.db}/${this.accountTable}/delete/${id_akun}`, this.globalService.setHttpOptions({username:this.auth.username, password: this.auth.password})))).data
  }

  async addTransaction(trx: Trx) {
    const result = new Array
    Object.keys(trx).forEach((element, key) => {
      if (Object.values(trx)[key] !== undefined) {
        result.push(element + '=' + Object.values(trx)[key])
      }
    })
    const post = result.join('&')
    return (await firstValueFrom(this.httpClient.post<any>(`${this.globalService.apiUrl}/${this.db}/${this.trxTable}`, post, this.globalService.setHttpOptions({username:this.auth.username, password: this.auth.password})))).data
  }

  async deleteTransaction(id_trx: number) {
    return (await firstValueFrom(this.httpClient.get<any>(`${this.globalService.apiUrl}/${this.db}/${this.trxTable}/delete/${id_trx}`, this.globalService.setHttpOptions({username:this.auth.username, password: this.auth.password})))).data
  }

  totalAccount(akun: Akun[], trx: Trx[]) {
    akun.forEach((element, key) => {
      if (element.akunType != 5)
      element.total = 
        trx.filter(x => x.id_akun == element.id_akun).map(t => t.debit).reduce((acc, value) => acc + value, 0)
        +trx.filter(x => x.to_akun == element.id_akun).map(t => t.kredit).reduce((acc, value) => acc + value, 0)
        -trx.filter(x => x.id_akun == element.id_akun).map(t => t.kredit).reduce((acc, value) => acc + value, 0)
        -trx.filter(x => x.to_akun == element.id_akun).map(t => t.debit).reduce((acc, value) => acc + value, 0)
      else
      element.total = 
        trx.filter(x => x.to_akun == element.id_akun).map(t => t.kredit).reduce((acc, value) => acc + value, 0)
    })

    return akun
  }
}
