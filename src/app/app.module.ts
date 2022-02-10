import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { secret } from 'src/environments/secret';
import { AddAccountComponent } from './components/add-account/add-account.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountsComponent } from './components/accounts/accounts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AddAccountComponent,
    AccountsComponent,
    DashboardComponent,
    AddTransactionComponent,
    TransactionsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,

    //social-login
    SocialLoginModule,

    //angular-material
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatRadioModule,

    //ng-bootstrap
    NgbModule,

    ReactiveFormsModule,
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true }},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {
      appearance: 'fill',
      floatLabel: 'none'
    }},
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    {provide: 'SocialAuthServiceConfig', useValue: {
      autoLogin: true,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            /*
            | -------------------------------------------------------------------
            |  Create file secret.ts and secret.prod.ts in environments folder fill this code:
            |  export const secret = {
            |    googleClientId : 'your-client-id.apps.googleusercontent.com'
            |  };
            */
            secret.googleClientId
          )
        }
      ]
    } as SocialAuthServiceConfig},
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
