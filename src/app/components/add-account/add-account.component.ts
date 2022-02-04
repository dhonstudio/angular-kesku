import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  formGroup!: FormGroup
  akunName = new FormControl()

  constructor(
    private _formBuilder: FormBuilder,
    private _matDialogRef: MatDialogRef<AddAccountComponent>,
  ) { 
    this.createForm()
  }

  ngOnInit(): void {
  }

  private createForm() {
    this.formGroup = this._formBuilder.group({
      akunName: this.akunName,
    });
  }

  saveAccount() {
    this._matDialogRef.close(this.formGroup.value);    
  }

}
