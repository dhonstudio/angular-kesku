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
        if (element.akunType > 0 && element.akunType < 5) this.akunMinusOutcomes.push(this.akunNames[key])
      })
      this.initAutoComplete()
    }
  }  

  ngOnInit(): void {
  }

  private createForm() {
    this.formGroup = this.formBuilder.group({
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
