import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Akun, All } from 'src/app/models/kesku.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnChanges {
  displayedColumns = ['stamp', 'akunName', 'akunType', 'action']
  dataSource!: MatTableDataSource<Akun>
  @Input() data!: All;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.initData()
  }

  ngOnInit(): void {
  }

  private initData() {
    console.log(this.data)
    if (this.data) {
      this.dataSource = new MatTableDataSource(this.data.akun)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

}
