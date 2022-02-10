import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Akun, All, Trx } from 'src/app/models/kesku.model';
import { HubService } from 'src/app/services/hub.service';
import { KeskuService } from 'src/app/services/kesku.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnChanges {
  isLoaded = false
  displayedColumns = ['akunName', 'amount']
  akuns!: Akun[]
  trxs!: Trx[]
  cash!: Akun[]
  banks!: Akun[]
  fintechs!: Akun[]
  emoneys!: Akun[]
  outcomes!: Akun[]
  incomes!: Akun[]
  receiveables!: Akun[]
  payables!: Akun[]
  totalCash!: number
  totalBanks!: number
  totalFintechs!: number
  totalEmoneys!: number
  totalOutcomes!: number
  totalIncomes!: number
  totalReceiveables!: number
  totalPayables!: number
  totalAsset!: number
  hideTotalAsset = true
  @Input() data!: All
  @Output() filterTransactions = new EventEmitter<string>()

  constructor(
    private hubService: HubService,
    private keskuService: KeskuService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.initData()
  }

  private receiveData(akun: Akun[], trx: Trx[]) {
    this.data = {
      userId: this.data.userId,
      akun: akun,
      trx: trx
    }

    this.ngOnChanges()
  }

  private initData() {
    if (this.data && this.data.akun) {
      this.akuns = this.data.akun
      this.trxs = this.data.trx
      this.akuns = this.keskuService.totalAccount(this.akuns, this.trxs)

      this.cash = []
      this.banks = []
      this.fintechs = []
      this.emoneys = []
      this.outcomes = []
      this.incomes = []
      this.receiveables = []
      this.payables = []

      let akunTypes = this.akuns.map(x => x.akunType)
      akunTypes.forEach((element, key) => {
        if (element == 1) this.cash.push(this.akuns[key])
        if (element == 2) this.banks.push(this.akuns[key])
        if (element == 3) this.fintechs.push(this.akuns[key])
        if (element == 4) this.emoneys.push(this.akuns[key])
        if (element == 5) this.outcomes.push(this.akuns[key])
        if (element == 6) this.incomes.push(this.akuns[key])
        if (element == 7) this.receiveables.push(this.akuns[key])
        if (element == 8) this.payables.push(this.akuns[key])
      })

      this.totalCash = this.cash.map(t => t.total).reduce((acc, value) => acc + value, 0)
      this.totalBanks = this.banks.map(t => t.total).reduce((acc, value) => acc + value, 0)
      this.totalFintechs = this.fintechs.map(t => t.total).reduce((acc, value) => acc + value, 0)
      this.totalEmoneys = this.emoneys.map(t => t.total).reduce((acc, value) => acc + value, 0)
      this.totalOutcomes = this.outcomes.map(t => t.total).reduce((acc, value) => acc + value, 0)
      this.totalIncomes = this.incomes.map(t => t.total).reduce((acc, value) => acc + value, 0)
      this.totalReceiveables = this.receiveables.map(t => t.total).reduce((acc, value) => acc + value, 0)
      this.totalPayables = this.payables.map(t => t.total).reduce((acc, value) => acc + value, 0)

      this.totalAsset = 
        this.totalCash + this.totalBanks + this.totalFintechs + this.totalEmoneys
        + this.totalReceiveables - this.totalPayables

      this.isLoaded = true
    } else {
      this.isLoaded = true
    }
  }

  showTotalAsset() {
    this.hideTotalAsset = false
  }

  showTransactions(akunName: string) {
    this.filterTransactions.emit(akunName)
  }

}
