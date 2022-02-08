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
  userId!: number
  tabIndex = 0
  data!: All

  constructor(
    private _userService: UserService,
    private _keskuService: KeskuService,
    private _globalService: GlobalService,
    private _cookieService: CookieService,
    private _socialAuthService: SocialAuthService,
    private _matDialog: MatDialog,
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
          if (data.length > 0) this.userId = data[0].id
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
      this.initData()
    })    
  }

  initData() {
    this._keskuService.initAccounts(this.userId).then(result => {
      this.data = {
        akun: result
      }
      this.isLoading = false
    })   
  }

  logout() {
    this._cookieService.delete('DSaAs13S', '/')
    this._socialAuthService.signOut(true)
    window.location.href = environment.redirect_auth
  }

  addAccount() {
    this.showaddAccountDialog().subscribe(data => {
      if (data) {
        // this.sanitizeResult(data)
        this.sendApiAddAccount(data)
      }
    })
  }

  private showaddAccountDialog() {
    const DialogRef = this._matDialog.open(AddAccountComponent, {
      data: {
        // trx: trx,
        // akuns: this.akuns,
        // trxs: this.trxs
      }
    })

    return DialogRef.afterClosed()
  }

  private sendApiAddAccount(akun: Akun) {
    akun.id_book = this.userId
    this._keskuService.checkAccountName(akun).then(ok => {
      if (ok) {
        this._keskuService.addAccount(akun).then(data => {
          console.log(data)
        })
      } else {
        this._globalService.showSnackBar('Failed, account duplicate', 3000)
      }
      this.tabIndex = 3;
    })
    //
      // if (data) {
      //   if (data.id_new) {
      //     this._dhonstudioFunctionService.showSnackBar('Add Transaction Success', 5000)
      //     trx.id_trx = data.id_new
      //     this.addRow(0, trx)
      //     this._dhonstudioFunctionService.reloadData()
      //   } else {
      //     this._dhonstudioFunctionService.showSnackBar('Edit Transaction Success', 5000)
      //     this.editRow(trx)
      //   }
      // } else {
      //   this._dhonstudioFunctionService.showSnackBar('Failed, Akun Name Not Found!', 5000)
      // }
    //   console.log(data)
    // })
  }

  addTransaction() {

  }

  resetFilter(event: any) {

  }

}
