import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HubService {
  reloadDataEmitter = new EventEmitter();
  reloadDataSubs!: Subscription;
  addAccountEmitter = new EventEmitter();
  addAccountSubs!: Subscription;

  constructor() { }

  reloadData() {
    this.reloadDataEmitter.emit();
  }

  addAccount() {
    this.addAccountEmitter.emit();
  }
}
