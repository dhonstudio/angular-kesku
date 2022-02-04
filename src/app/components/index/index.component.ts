import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/angular_services/user.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { SocialAuthService } from 'angularx-social-login';

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
    private _userService: UserService,
    private _cookieService: CookieService,
    private _socialAuthService: SocialAuthService,
  ) { 
    // this.userService.checkUser('project', 'user_ci', {username:'admin', password:'admin'}, 'doon13@gmail.com', 'email').then(data => {
    //   if (data.length > 0) this.socialUser.name = data[0].fullName
    // })
    if (this._cookieService.get('DSaAs13S')) {
      this.userId = parseInt(CryptoJS.AES.decrypt(this._cookieService.get('DSaAs13S'), 'DSaAs13S').toString(CryptoJS.enc.Utf8))
      this.initUser()
    } else {
      this._socialAuthService.authState.subscribe(user => {
        this._userService.checkUser('project', 'user_ci', {username:'admin', password:'admin'}, user.email, 'email').then(data => {
          if (data.length > 0) this.socialUser.name = data[0].fullName
          this.initUser()
        })
      })
    }
  }

  ngOnInit(): void {
  }

  initUser() {
    this._userService.checkUser('project', 'user_ci', {username:'admin', password:'admin'}, `${this.userId}`, 'id').then(data => {
      if (data.length > 0) this.socialUser.name = data[0].fullName
    })
  }

  logout() {
    this._cookieService.delete('DSaAs13S', '/')
    this._socialAuthService.signOut(true)
    window.location.href = environment.redirect_auth
  }

  addTransaction() {

  }

  resetFilter(event: any) {

  }

}
