import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/angular_services/user.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { SocialAuthService } from 'angularx-social-login';
import { MatDialog } from '@angular/material/dialog';
import { AddAccountComponent } from '../add-account/add-account.component';
import { Akun, All } from 'src/app/models/kesku.model';
import { KeskuService } from 'src/app/services/kesku.service';
import { GlobalService } from 'src/app/services/angular_services/global.service';
import { HubService } from 'src/app/services/hub.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  currentVersion = environment.appVersion
  isLoading = true
  shortName = 'MR'
  socialUser = {
    name: ""
  }
  private userId!: number
  tabIndex = 0
  data!: All

  constructor(
    private cookieService: CookieService,
    private socialAuthService: SocialAuthService,
    private userService: UserService,
    private keskuService: KeskuService,
    private hubService: HubService,
  ) {
    if (this.cookieService.get('DSaAs13S')) {
      this.userId = parseInt(CryptoJS.AES.decrypt(this.cookieService.get('DSaAs13S'), 'DSaAs13S').toString(CryptoJS.enc.Utf8))
      this.initUser()
    } else {
      this.socialAuthService.authState.subscribe(user => {
        this.userService.checkUser('project', 'user_ci', {username:'admin', password:'admin'}, user.email, 'email').then(data => {
          if (data.length > 0) {
            this.userId = data[0].id
            this.initUser()
          } else {
            this.logout()
          }
        })
      })
    }
  }

  ngOnInit(): void {
    if (this.hubService.reloadDataSubs == undefined) {    
      this.hubService.reloadDataSubs = this.hubService.    
      reloadDataEmitter.subscribe(() => {    
        this.initData() 
      })    
    }
  }

  initUser() {
    this.userService.checkUser('project', 'user_ci', {username:'admin', password:'admin'}, this.userId, 'id').then(data => {
      if (data.length > 0) this.socialUser.name = data[0].fullName
      this.initData()
    })    
  }

  initData() {
    this.keskuService.initAccounts(this.userId).then(result => {
      this.data = {
        userId: this.userId,
        akun: result
      }
      this.isLoading = false
    })   
  }

  logout() {
    this.cookieService.delete('DSaAs13S', '/')
    this.socialAuthService.signOut(true)
    window.location.href = environment.redirect_auth
  }

  addAccount() {
    this.hubService.addAccount()
  }

  changeTab(event: number) {
    this.tabIndex = event
  }

  

  addTransaction() {

  }

  resetFilter(event: any) {

  }

}
