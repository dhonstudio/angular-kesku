import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Akun, All } from 'src/app/models/kesku.model';
import { HubService } from 'src/app/services/hub.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnChanges {
  isLoaded = false
  displayedColumns = ['akunName', 'amount']
  akuns!: Akun[]
  cash!: Akun[]
  banks!: Akun[]
  fintechs!: Akun[]
  emoneys!: Akun[]
  outcomes!: Akun[]
  @Input() data!: All

  constructor(
    private hubService: HubService,
  ) { }

  ngOnInit(): void {
    if (this.hubService.sendDataSubs == undefined) {    
      this.hubService.sendDataSubs = this.hubService.    
      sendDataEmitter.subscribe((data) => {
        this.receiveData(data) 
      })    
    }
  }

  ngOnChanges(): void {
    this.initData()
  }

  private receiveData(data: Akun[]) {
    this.data = {
      userId: this.data.userId,
      akun: data,
      trx: this.data.trx
    }

    this.ngOnChanges()
  }

  private initData() {
    this.akuns = []
    if (this.data && this.data.akun.length > 0) {
      this.akuns = this.data.akun

      this.cash = []
      this.banks = []
      this.fintechs = []
      this.emoneys = []
      this.outcomes = []

      let akunTypes = this.akuns.map(x => x.akunType)
      akunTypes.forEach((element, key) => {
        if (element == 1) this.cash.push(this.akuns[key])
        if (element == 2) this.banks.push(this.akuns[key])
        if (element == 3) this.fintechs.push(this.akuns[key])
        if (element == 4) this.emoneys.push(this.akuns[key])
        if (element == 5) this.outcomes.push(this.akuns[key])
      })

      this.isLoaded = true
    } else {
      this.isLoaded = true
    }
  }

}
