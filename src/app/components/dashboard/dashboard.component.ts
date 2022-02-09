import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Akun, All } from 'src/app/models/kesku.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnChanges {
  isLoaded = false;
  displayedColumns = ['akunName', 'amount'];
  akuns!: Akun[]
  cash!: Akun[]
  banks!: Akun[]
  @Input() data!: All

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initData()
  }

  private initData() {
    this.akuns = []
    if (this.data && this.data.akun.length > 0) {
      this.akuns = this.data.akun

      this.cash = []
      this.banks = []

      let akunTypes = this.akuns.map(x => x.akunType)
      akunTypes.forEach((element, key) => {
        if (element == 1) this.cash.push(this.akuns[key])
        if (element == 2) this.banks.push(this.akuns[key])
      });

      this.isLoaded = true
    }
  }



}
