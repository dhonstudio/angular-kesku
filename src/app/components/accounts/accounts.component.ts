import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  filterForm = new FormControl()
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
        this.akuns[key].deleteable = !this.trxs.map(x => x.id_akun).includes(element.id_akun) && !this.trxs.map(x => x.to_akun).includes(element.id_akun)
      })
      this.initializeDataSource()
    }
  }

  private initAkunTypeName(akun: Akun) {
    return akun.akunType == 1 ? 'Cash' : akun.akunType == 2 ? 'Bank' : akun.akunType == 3 ? 'Fintech' : akun.akunType == 4 ? 'Emoney' : akun.akunType == 5 ? 'Outcome' : akun.akunType == 6 ? 'Income' : akun.akunType == 7 ? 'Receiveable' : akun.akunType == 8 ? 'Payable' : 'Saving'
  }

  private initializeDataSource() {
    this.dataSource = new MatTableDataSource(this.akuns)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort

    if (this.filterForm.value) {
      this.filterForm.setValue(this.filterForm.value)
      this.filter(this.filterForm.value)
    }
  }

  private addAccount() {
    this.showaddAccountDialog().subscribe(data => {
      if (data) {
        delete(data.id_akun)
        this.sendApiAddAccount(data)
      }
    })
  }

  editAccount(akun: Akun) {
    this.showaddAccountDialog(akun).subscribe(data => {
      if (data) {
        this.sendApiAddAccount(data)
      }
    })
  }

  private showaddAccountDialog(akun?: Akun) {
    const DialogRef = this.matDialog.open(AddAccountComponent, {
      data: {
        akuns: this.akuns,
        akun: akun
      }
    })

    return DialogRef.afterClosed()
  }

  private sendApiAddAccount(akun: Akun) {
    akun.id_book = this.data.userId
    if (akun.id_akun) {
      this.keskuService.addAccount(akun).then(data => {
        this.editRow(data)
        this.globalService.showSnackBar('Success', 3000)
      })
    } else {
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
  }

  private addRow(index: number, akun: Akun) {
    akun.akunTypeName = this.initAkunTypeName(akun)
    this.akuns.splice(index, 0, akun)
    this.table.renderRows()
    this.initializeDataSource()
    this.hubService.reloadData()
  }

  private editRow(akun: Akun) {
    akun.akunTypeName = this.initAkunTypeName(akun)
    this.akuns = this.akuns.filter((value)=>{
      if (value.id_akun == akun.id_akun){
        value.stamp = value.stamp
        value.akunName = akun.akunName
        value.akunTypeName = akun.akunTypeName
        value.position = akun.position
      }
      return true
    })
    this.initializeDataSource()
    this.hubService.reloadData()
  }

  async deleteAccount(akun: Akun) {
    const index = this.akuns.findIndex(a => a.id_akun === akun.id_akun)
    const row = this.deleteRow(index)
    const undo = this.globalService.showSnackBarWithUndo(`Account Name: ${row.akunName} Deleted`, 'Delete Account Canceled', 3000)
    if (await undo) {
      this.addRow(index, row)
    } 
    else this.sendApiDeleteAccount(akun)
  }

  private deleteRow(index: number){
    const row = this.akuns.splice(index, 1)
    this.table.renderRows()
    this.initializeDataSource()
    return row[0]
  }

  private sendApiDeleteAccount(akun: Akun) {
    this.keskuService.deleteAccount(akun.id_akun)
    this.hubService.reloadData()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.filter(filterValue)
  }

  private filter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase()
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

}
