import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Akun, All, Trx } from 'src/app/models/kesku.model';
import { GlobalService } from 'src/app/services/angular_services/global.service';
import { HubService } from 'src/app/services/hub.service';
import { KeskuService } from 'src/app/services/kesku.service';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnChanges, AfterViewInit {
  displayedColumns = ['stamp', 'akunName', 'amount', 'action']
  dataSource!: MatTableDataSource<Trx>
  akuns!: Akun[]
  trxs!: Trx[]
  @Input() data!: All
  @Output() changeTab = new EventEmitter<number>()
  @ViewChild(MatTable) table!: MatTable<Trx>
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    private globalService: GlobalService,
    private hubService: HubService,
    private keskuService: KeskuService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this.hubService.addTransactionSubs == undefined) {    
      this.hubService.addTransactionSubs = this.hubService.addTransactionEmitter.subscribe(() => {    
        this.addTransaction()
      })    
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initData()
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    }
  }

  private initData() {
    this.akuns = []
    if (this.data && this.data.akun.length > 0) {
      this.akuns = this.data.akun
      this.trxs = this.data.trx

      this.initializeDataSource()
    }
  }

  private initializeDataSource() {
    this.trxs.forEach((element, key) => {      
      element.akunName = this.initAkunName(element, 'id_akun')
      element.toName = this.initAkunName(element, 'to_akun')
      if (element.kredit > 0) element.debit = -element.kredit
      else element.debit = element.debit
    });
    this.dataSource = new MatTableDataSource(this.trxs)
  }

  private initAkunName(akun: Trx, type: string) {
    if (type == 'id_akun') return this.akuns.find(x => x.id_akun == akun.id_akun && x.id_book == akun.id_book)?.akunName
    else if (type == 'to_akun') return this.akuns.find(x => x.id_akun == akun.to_akun && x.id_book == akun.id_book)?.akunName
    else return ""
  }

  private addTransaction() {
    this.showaddTransactionDialog().subscribe(data => {
      if (data) {
        data.id_book = this.data.userId
        this.sendApiAddTransaction(this.sanitizeResult(data))
      }
    })
  }

  private showaddTransactionDialog() {
    const DialogRef = this.matDialog.open(AddTransactionComponent, {
      data: {
        akuns: this.akuns
      }
    })

    return DialogRef.afterClosed()
  }

  private sanitizeResult(data: any): Trx {
    Object.keys(data).forEach((element, key) => {
      if (element == 'akunName') {
        data['id_akun'] = this.akuns.find(x => x.akunName == data['akunName'] && x.id_book == data['id_book'])?.id_akun
      } else if (element == 'toName') {
        if (Object.values(data)[key] == '' || Object.values(data)[key] === null) {
          data[element] = 0
        } else {
          data['to_akun'] = this.akuns.find(x => x.akunName == data['toName'] && x.id_book == data['id_book'])?.id_akun
        }        
      } else if (element == 'method') {
        if (Object.values(data)[key] == '1') {
          data['debit'] = data['amount']
          data['kredit'] = 0
        } else if (Object.values(data)[key] == '2') {
          data['debit'] = 0
          data['kredit'] = data['amount']
        }
      } else if (element == 'note' && Object.values(data)[key] === null) {
        delete(data['note'])
      }
    })
    delete(data['method'])
    delete(data['amount'])
    return data
  }

  private sendApiAddTransaction(trx: Trx) {
    this.keskuService.addTransaction(trx).then(data => {
      this.addRow(this.akuns.length, data)
      this.globalService.showSnackBar('Success', 3000)
    })
    this.changeTab.emit(1)
  }

  private addRow(index: number, trx: Trx) {
    if (trx.kredit > 0) trx.debit = trx.kredit
    trx.akunName = this.initAkunName(trx, 'id_akun')
    trx.toName = this.initAkunName(trx, 'to_akun')

    this.trxs.splice(index, 0, trx)
    if (this.trxs.length > 1) this.table.renderRows()
    this.initializeDataSource()
    this.ngAfterViewInit()
    // this.hubService.sendData(this.trxs)
  }

  async deleteTransaction(index: number, trx: Trx) {
    let index_paginator = index + (this.paginator.pageIndex * this.paginator.pageSize)
    let index_fix = index_paginator - (this.trxs.length - 1)
    let index_final = 0
    if (index_fix < 0) index_final = - index_fix
    else index_final = index_fix
    const row = this.deleteRow(index_final)
    const undo = this.globalService.showSnackBarWithUndo(`Transaction ID: ${row.id_trx} Deleted`, 'Delete Transaction Canceled', 3000)
    if (await undo) {
      this.addRow(index_final, row)
    } else this.sendApiDeleteTransaction(trx)
  }

  private deleteRow(index: number){
    const row = this.trxs.splice(index, 1)
    this.table.renderRows()
    this.initializeDataSource()
    this.ngAfterViewInit()
    return row[0]
  }

  private sendApiDeleteTransaction(trx: Trx) {
    this.keskuService.deleteTransaction(trx.id_trx)
    this.hubService.sendData(this.akuns)
  }

}
