import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { RoleService } from './role.service';
import {CreationSuccessResponse} from "../create-user-dialog/CreationSuccessResponse";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog";


@Component({
  selector: 'app-create-role-dialog',
  templateUrl: './create-role-dialog.component.html',
  styleUrls: ['./create-role-dialog.component.css']
})
export class CreateRoleDialogComponent {

  createRoleForm = this.fb.group({
    title: ['', Validators.required]
  });

  constructor(
    public dialogRef: MatDialogRef<CreateRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private roleService: RoleService,
    private dialog: MatDialog) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveRole(): void {
    if (this.createRoleForm.valid) {
      this.roleService.createRole(this.createRoleForm.value)
        .subscribe({
          next: response => {
            this.dialog.open(ConfirmationDialogComponent, {
              data: {
                title: "Sucesso",
                message: "Cargo: " + this.createRoleForm.value.title + " Criado com sucesso!",
                width: '350px'
              }
            });
            console.log(response);
            this.dialogRef.close();
          },
          error: error => {
            console.error('Erro completo:', error)
            this.dialog.open(ConfirmationDialogComponent, {
              data: {
                title: "Erro",
                message: error.error.message || 'Ocorreu um erro desconhecido.',
                width: '350px'
              }
            });
          }
        });
    }
  }
}
