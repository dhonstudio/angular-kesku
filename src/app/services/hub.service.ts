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

  constructor() { }

  sendData(data: any) {
    this.sendDataEmitter.emit(data)
  }

  addAccount() {
    this.addAccountEmitter.emit()
  }
}
