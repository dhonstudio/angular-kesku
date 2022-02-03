import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/angular_services/user.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

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
  userId!: number
  tabIndex = 0

  constructor(
    private userService: UserService,
    private cookieService: CookieService,
  ) { 
    // this.userService.checkUser('project', 'user_ci', {username:'admin', password:'admin'}, 'doon13@gmail.com', 'email').then(data => {
    //   if (data.length > 0) this.socialUser.name = data[0].fullName
    // })
    this.userId = parseInt(CryptoJS.AES.decrypt(this.cookieService.get('DSaAs13S'), 'DSaAs13S').toString(CryptoJS.enc.Utf8))
    this.userService.checkUser('project', 'user_ci', {username:'admin', password:'admin'}, `${this.userId}`, 'id').then(data => {
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
