import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog";
import { MatDialog } from "@angular/material/dialog";
import { UpdateProfilePictureComponent } from "../update-profile-picture/update-profile-picture.component";
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component'; // Importe o componente de diálogo de troca de senha

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  onFormSubmit() {
    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;

    if (!email || !password) {
      this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: "Erro",
          message: "Por favor, insira um e-mail e senha válidos.",
          width: "350px"
        }
      });
      return;
    }

    this.authService.login(email, password).subscribe(user => {
      if (user && user.token) {
        // Verifique se needsPasswordChange é verdadeiro
        if (this.authService.currentUserValue.needsPasswordChange) {
          const passwordDialogRef = this.dialog.open(ChangePasswordDialogComponent, {
            width: '400px'
          });

          passwordDialogRef.afterClosed().subscribe(passwordChanged => {
            if (passwordChanged) {
              // Se a senha foi alterada com sucesso, informa ao usuário e redireciona para a tela de login
              this.dialog.open(ConfirmationDialogComponent, {
                data: {
                  title: "Senha Alterada",
                  message: "Sua senha foi alterada com sucesso. Por favor, faça login novamente com a nova senha.",
                  width: "350px"
                }
              });
              this.router.navigate(['/login']); // Redirecione para a tela de login
            }
          });
          return;
        } else {
          this.navigateAfterLogin();
        }
      }
    }, error => {
      let title = "Erro";
      let message = "";
      let width = "350px";

      switch (error?.status) {
        case 400:
          message = "E-Mail ou senha incorretos!";
          break;
        case 401:
          message = "E-mail ou senha incorretos!";
          break;
        case 403:
          if (error?.error === "Usuário bloqueado. Entre em contato com o administrador.") {
            message = "Bloqueado por segurança após inúmeras tentativas de login, favor procurar um administrador";
          } else {
            message = "Acesso negado. Você não tem permissão para acessar este recurso.";
          }
          break;
        case 404:
          message = "Recurso não encontrado. Por favor, verifique a URL ou procure ajuda.";
          break;
        case 500:
          message = "Erro interno do servidor. Por favor, tente novamente mais tarde.";
          break;
        default:
          message = "Ocorreu um erro desconhecido. Por favor, tente novamente ou procure suporte.";
      }

      if (message) {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: title,
            message: message,
            width: width
          }
        });
      }
    });
  }

  // Método para lidar com a navegação após o login
  navigateAfterLogin() {
    console.log("Método navigateAfterLogin chamado");

    const tokenParts = localStorage.getItem('currentUser')?.split('.');
    if (tokenParts && tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      const accessType = payload.accessType;

      console.log("Token decodificado:", payload);

      // verifica se profile picture é null
      if (!this.authService.currentUserValue.profilePicture) {
        console.log("profilePicture é null ou undefined");

        const dialogRef = this.dialog.open(UpdateProfilePictureComponent, {
          width: '400px'
        });

        console.log("Diálogo aberto");

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.router.navigate(['/user-main-screen']);
          }
        });
        return;
      } else {
        console.log("profilePicture tem valor:", this.authService.currentUserValue.profilePicture);  // <-- Adicione esta linha
      }

      if (accessType === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user-main-screen']);
      }
    } else {
      console.log("Token não encontrado ou inválido")
    }
  }


}
