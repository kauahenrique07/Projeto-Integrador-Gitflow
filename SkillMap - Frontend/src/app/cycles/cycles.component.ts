import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CyclesService} from "./cycles.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog";

@Component({
    selector: 'app-cycles',
    templateUrl: './cycles.component.html',
    styleUrls: ['./cycles.component.css']
})
export class CyclesComponent {
    createCycleForm!: FormGroup;
    errorMessage: string | null = null;

  constructor(public dialogRef: MatDialogRef<CyclesComponent>,
                private fb: FormBuilder,
                private cyclesService: CyclesService,
                private dialog: MatDialog
                ) {}

    ngOnInit(): void {
        this.createCycleForm = this.fb.group({
            title: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
        });
    }

  onSubmit(): void {
    if (this.createCycleForm.valid) {
      console.log('Formulário é válido, tentando criar ciclo');
      this.cyclesService.createCycle(this.createCycleForm.value)
        .subscribe({
          next: response => {
            console.log(response);
            this.dialogRef.close();
            this.dialog.open(ConfirmationDialogComponent,{
              data:{
                title: "Sucesso!",
                message: "Ciclo criado com sucesso:" + this.createCycleForm.value.title,
                width: "350px"
              }
            })
          },
          error: err => {
            console.log(err);
            // Aqui verificamos se o erro tem um body e um campo message
            this.errorMessage = err.error?.message || 'Erro desconhecido';
          }
        });
    }
  }
}
