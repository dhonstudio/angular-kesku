import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/angular_services/user.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { SocialAuthService } from 'angularx-social-login';
import { Akun, All, Trx } from 'src/app/models/kesku.model';
import { KeskuService } from 'src/app/services/kesku.service';
import { HubService } from 'src/app/services/hub.service';
import { Observable } from 'rxjs';

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
  tabIndex = 0
  filter = 'filter'
  data!: All

  private db_user = 'project'
  private tbl_user = 'user_ci'
  private username = 'admin'
  private password = 'admin'
  private userId!: number

  constructor(
    private cookieService: CookieService,
    private socialAuthService: SocialAuthService,
    private userService: UserService,
    private keskuService: KeskuService,
    private hubService: HubService,
  ) {
    this.checkCookie()
  }

  private checkCookie() {
    if (this.cookieService.get('DSaAs13S')) {
      this.userId = parseInt(CryptoJS.AES.decrypt(this.cookieService.get('DSaAs13S'), 'DSaAs13S').toString(CryptoJS.enc.Utf8))
      this.initUser()
    } else {
      this.socialAuthService.authState.subscribe(user => {
        this.userService.checkUser(this.db_user, this.tbl_user, {username:this.username, password:this.password}, user.email, 'email').then(data => {
          if (data.length > 0) {
            this.userId = data[0].id
            this.initUser()
          } else {
            //register
          }
        })
      })
    }
  }

  private initUser() {
    this.userService.checkUser(this.db_user, this.tbl_user, {username:this.username, password:this.password}, this.userId, 'id').then(data => {
      this.socialUser.name = data[0].fullName
      this.initData()
    })    
  }

  private initData() {
    this.keskuService.initAccounts(this.userId).then(akun => {
      this.keskuService.initTransactions(this.userId).then(trx => {
        this.data = {
          userId: this.userId,
          akun: akun,
          trx: trx
        }
        this.isLoading = false
      })
    })   
  }

  ngOnInit(): void {
    if (this.hubService.sendDataSubs == undefined) {    
      this.hubService.sendDataSubs = this.hubService.    
      sendDataEmitter.subscribe((data) => {
        this.receiveData(data.akun, data.trx)
        this.filter = data.filtered
      })    
    }
  }
  
  private receiveData(akun: Akun[], trx: Trx[]) {
    this.data = {
      userId: this.data.userId,
      akun: akun,
      trx: trx
    }
  }

  logout() {
    this.cookieService.delete('DSaAs13S', '/')
    this.socialAuthService.signOut(true)
    window.location.href = environment.redirect_auth
  }

  addAccount() {
    this.hubService.addAccount()
  }

  addTransaction() {
    this.hubService.addTransaction()
  }

  changeTab(event: number) {
    this.tabIndex = event
  }

  resetTab(value: any) {
    if (this.tabIndex != 1) this.filter = ''
    this.tabIndex = value.index
    if (this.tabIndex != 1) this.filter = ''
  }

  filterTransactions(event: string) {
    this.tabIndex = 1
    this.filter = event
  }

}
