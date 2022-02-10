import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  formGroup!: FormGroup
  akunNames!: string[]
  akunName = new FormControl()
  akunType = new FormControl()

  constructor(
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<AddAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.createForm()
    this.akunNames = data.akuns.map((x: { akunName: string }) => x.akunName)
  }

  ngOnInit(): void {
  }

  private createForm() {
    this.formGroup = this.formBuilder.group({
      akunName: this.akunName,
      akunType: this.akunType,
    })
  }

  saveAccount() {
    this.matDialogRef.close(this.formGroup.value)
  }

  invalid() {
    return this.formGroup.invalid || this.akunNames.includes(this.formGroup.value.akunName)
  }

}
