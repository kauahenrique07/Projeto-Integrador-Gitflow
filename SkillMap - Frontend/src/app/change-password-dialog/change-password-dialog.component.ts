import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import {UserService} from "../users/user.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent {
  passwordForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*')
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService,
              private userService: UserService,
              private dialog: MatDialog) {
  }

  onSubmit() {
    if (this.passwordForm.valid && this.passwordForm.value.newPassword === this.passwordForm.value.confirmPassword) {
      const userId = this.authService.currentUserValue.id;
      this.userService.changeUserPassword(userId, this.passwordForm.value.newPassword as string).subscribe(() => {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: "Senha Alterada",
            message: "Sua senha foi alterada com sucesso. Por favor, faça login com a nova senha.",
            width: "350px"
          }
        });
        dialogRef.afterClosed().subscribe(() => {
          this.dialog.closeAll();
        });

      }, error => {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: "Erro",
            message: "Ocorreu um erro ao tentar alterar sua senha. Por favor, tente novamente.",
            width: "350px"
          }
        });
      });
    } else {
      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: "Requisitos de Senha",
          message: "A senha deve ter pelo menos 10 caracteres, incluindo 1 letra maiúscula, 1 letra minúscula e 1 caractere especial.",
          width: "400px"
        }
      });
    }
  }

}
