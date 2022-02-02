import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
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
    name: ""
  }
  tabIndex = 0

  constructor(
    private userService: UserService,
  ) { 
    this.userService.checkUser('doon13@gmail.com').then(data => {
      if (data.length > 0) this.socialUser.name = data[0].fullName
    })
  }

  ngOnInit(): void {
  }

  logout() {

  }

  addTransaction() {

  }

  resetFilter(event: any) {

  }

}
