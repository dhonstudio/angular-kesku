import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Akun, All, Trx } from 'src/app/models/kesku.model';
import { GlobalService } from 'src/app/services/angular_services/global.service';
import { HubService } from 'src/app/services/hub.service';
import { KeskuService } from 'src/app/services/kesku.service';
import { AddAccountComponent } from '../add-account/add-account.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnChanges {
  displayedColumns = ['stamp', 'akunName', 'akunType', 'action']
  dataSource!: MatTableDataSource<Akun>
  akuns!: Akun[]
  trxs!: Trx[]
  isLoaded = false
  @Input() data!: All
  @Input() filtered = ''
  @Output() changeTab = new EventEmitter<number>()
  @ViewChild(MatTable) table!: MatTable<Akun>
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    private globalService: GlobalService,
    private keskuService: KeskuService,
    private hubService: HubService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this.hubService.addAccountSubs == undefined) {    
      this.hubService.addAccountSubs = this.hubService.    
      addAccountEmitter.subscribe(() => {    
        this.addAccount()
      })    
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initData()
  }

  private initData() {
    if (this.data && this.data.akun) {
      this.akuns = this.data.akun
      this.trxs = this.data.trx
      this.akuns.forEach((element, key) => {
        this.akuns[key].akunTypeName = this.initAkunTypeName(element)
      })
      this.initializeDataSource()
    }
  }

  private initAkunTypeName(akun: Akun) {
    return akun.akunType == 1 ? 'Cash' : akun.akunType == 2 ? 'Bank' : akun.akunType == 3 ? 'Fintech' : akun.akunType == 4 ? 'Emoney' : 'Outcome'
  }

  private initializeDataSource() {
    this.dataSource = new MatTableDataSource(this.akuns)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  private addAccount() {
    this.showaddAccountDialog().subscribe(data => {
      if (data) {
        this.sendApiAddAccount(data)
      }
    })
  }

  private showaddAccountDialog() {
    const DialogRef = this.matDialog.open(AddAccountComponent, {
      data: {
        akuns: this.akuns
      }
    })

    return DialogRef.afterClosed()
  }

  private sendApiAddAccount(akun: Akun) {
    akun.id_book = this.data.userId
    this.keskuService.checkAccountName(akun).then(ok => {
      if (ok) {
        this.keskuService.addAccount(akun).then(data => {
          this.addRow(this.akuns.length, data)
          this.globalService.showSnackBar('Success', 3000)
        })
      } else {
        this.globalService.showSnackBar('Failed, account duplicate', 3000)
      }
      this.changeTab.emit(3)
    })
  }

  private addRow(index: number, akun: Akun) {
    akun.akunTypeName = this.initAkunTypeName(akun)
    this.akuns.splice(index, 0, akun)
    this.table.renderRows()
    this.initializeDataSource()
    this.hubService.sendData(this.akuns, this.trxs)
  }

  async deleteAccount(index: number, akun: Akun) {
    let index_paginator = index + (this.paginator.pageIndex * this.paginator.pageSize)
    let index_fix = index_paginator - (this.akuns.length - 1)
    let index_final = 0
    if (index_fix < 0) index_final = - index_fix
    else index_final = index_fix
    const row = this.deleteRow(index_final)
    const undo = this.globalService.showSnackBarWithUndo(`Account Name: ${row.akunName} Deleted`, 'Delete Account Canceled', 3000)
    if (await undo) {
      this.addRow(index_final, row)
    } else this.sendApiDeleteAccount(akun)
  }

  private deleteRow(index: number){
    const row = this.akuns.splice(index, 1)
    this.table.renderRows()
    this.initializeDataSource()
    return row[0]
  }

  private sendApiDeleteAccount(akun: Akun) {
    this.keskuService.deleteAccount(akun.id_akun)
    this.hubService.sendData(this.akuns, this.trxs)
  }

}
