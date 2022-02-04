import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private _cookieService: CookieService,
    private _socialAuthService: SocialAuthService,
  ) { }

  canActivate(): boolean | Observable<boolean> {
    if (this._cookieService.get('DSaAs13S')) {
      return true
    } else {
      return this._socialAuthService.authState.pipe(
        map((socialUser: SocialUser) => !!socialUser),
        tap((isLoggedIn: boolean) => {
          if (!isLoggedIn) {
            window.location.href = environment.redirect_auth
          }
        })
      );
    }
  }
}
