import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Akun } from 'src/app/models/kesku.model';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  formGroup!: FormGroup
  akunNames!: string[]
  positions: number[] = []
  id_akun = new FormControl()
  akunName = new FormControl()
  akunType = new FormControl()
  position = new FormControl()

  constructor(
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<AddAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm()
    if (data.akun) {
      this.id_akun.setValue(data.akun.id_akun)
      this.akunName.setValue(data.akun.akunName)
      this.akunType.setValue(`${data.akun.akunType}`)
      let event = {
        value: `${data.akun.akunType}`
      }
      this.initPosition(event)
      this.position.setValue(`${data.akun.position}`)
      this.akunNames = []
      data.akuns.forEach((element: { akunName: string }) => {
        if (element.akunName != data.akun.akunName) this.akunNames.push(element.akunName)
      })
    } else {
      this.id_akun.setValue(`0`)
      this.akunNames = data.akuns.map((x: { akunName: string }) => x.akunName)
    }
  }

  ngOnInit(): void {
  }

  private createForm() {
    this.formGroup = this.formBuilder.group({
      id_akun: this.id_akun,
      akunName: this.akunName,
      akunType: this.akunType,
      position: this.position,
    })
  }

  initPosition(event: any) {
    let akunType = parseInt(event.value)
    let matchAkunType: Akun[] = this.data.akuns.filter((x: { akunType: any }) => x.akunType == akunType)
    this.positions = []
    matchAkunType.forEach((element, key) => {
      if (akunType != 5 && akunType != 6) this.positions.push(key+2)
    })
  }

  saveAccount() {
    this.matDialogRef.close(this.formGroup.value)
  }

  invalid() {
    return this.formGroup.invalid || this.akunNames.includes(this.formGroup.value.akunName)
  }

}
