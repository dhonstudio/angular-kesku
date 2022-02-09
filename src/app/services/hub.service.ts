import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

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

  sendData(data: any) {
    this.sendDataEmitter.emit(data)
  }

  addAccount() {
    this.addAccountEmitter.emit()
  }

  addTransaction() {
    this.addTransactionEmitter.emit()
  }
}
