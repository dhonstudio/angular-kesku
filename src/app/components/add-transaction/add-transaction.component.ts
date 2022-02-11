import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { Akun } from 'src/app/models/kesku.model';
import { GlobalService } from 'src/app/services/angular_services/global.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {
  formGroup!: FormGroup
  akunNames!: string[]
  akunMinusOutcomes!: string[]
  notes!: string[]
  id_trx = new FormControl()
  akunName = new FormControl()
  method = new FormControl()
  amount = new FormControl()
  toName = new FormControl()
  note = new FormControl()
  filteredAkunName!: Observable<string[]>
  filteredToName!: Observable<string[]>
  filteredNote!: Observable<string[]>

  constructor(
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<AddTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.createForm()
    if (data.akunName) {
      this.akunName.setValue(data.akunName)
    }
    if (data.trxs) {
      let notes: string[] = data.trxs.map((x: { note: string }) => x.note)
      this.notes = notes.filter((element, i) => i === notes.indexOf(element)).filter((a) => a)
    }
    if (data.akuns) {
      this.akunMinusOutcomes = []
      this.akunNames = data.akuns.map((x: { akunName: string }) => x.akunName)
      data.akuns.forEach((element: Akun, key: number) => {
        if ((element.akunType > 0 && element.akunType < 5) || element.akunType == 9) this.akunMinusOutcomes.push(this.akunNames[key])
      })
      this.initAutoComplete()
    }
    if (data.trx) {
      this.id_trx.setValue(data.trx.id_trx)
      this.akunName.setValue(data.trx.akunName)
      if (data.trx.amount < 0) {
        this.method.setValue('2')
        this.amount.setValue(`${-data.trx.amount}`)
      } else {
        this.method.setValue('1')
        this.amount.setValue(`${data.trx.amount}`)
      }
      this.toName.setValue(data.trx.toName)
      this.note.setValue(data.trx.note)
    } else {
      this.id_trx.setValue(`0`)
    }
  }  

  ngOnInit(): void {
  }

  private createForm() {
    this.formGroup = this.formBuilder.group({
      id_trx: this.id_trx,
      akunName: this.akunName,
      method: this.method,
      amount: this.amount,
      toName: this.toName,
      note: this.note,
    })
  }
  
  private initAutoComplete() {
    this.filteredAkunName = this.akunName.valueChanges.pipe(
      startWith(''),
      map(value => this.globalService.filter(value, this.akunMinusOutcomes)),
    )

    this.filteredToName = this.toName.valueChanges.pipe(
      startWith(''),
      map(value => this.globalService.filter(value, this.akunNames)),
    )

    this.filteredNote = this.note.valueChanges.pipe(
      startWith(''),
      map(value => this.globalService.filter(value, this.notes)),
    )    
  }

  saveTransaction() {
    this.matDialogRef.close(this.formGroup.value)
  }

  invalid() {
    return (
      this.formGroup.invalid || 
      !this.akunMinusOutcomes.includes(this.formGroup.value.akunName)
    )
  }
}
