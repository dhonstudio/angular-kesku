import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  currentVersion = environment.appVersion
  isLoading = false
  shortName = 'MR'
  socialUser = {
    name: "Muhammd Ramadhon"
  }
  tabIndex = 0

  constructor() { }

  ngOnInit(): void {
  }

  logout() {

  }

  addTransaction() {

  }

  resetFilter(event: any) {

  }

}
