import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Akun, Trx } from '../models/kesku.model';

@Injectable({
  providedIn: 'root'
})
export class HubService {
  sendDataEmitter = new EventEmitter()
  sendDataSubs!: Subscription
  addAccountEmitter = new EventEmitter()
  addAccountSubs!: Subscription
  addTransactionEmitter = new EventEmitter()
  addTransactionSubs!: Subscription

  constructor() { }

  sendData(akun: Akun[], trx: Trx[], filtered: string = '') {
    let compile = {
      akun: akun,
      trx: trx,
      filtered: filtered
    }
    
    this.sendDataEmitter.emit(compile)
  }

  addAccount() {
    this.addAccountEmitter.emit()
  }

  addTransaction() {
    this.addTransactionEmitter.emit()
  }
}
