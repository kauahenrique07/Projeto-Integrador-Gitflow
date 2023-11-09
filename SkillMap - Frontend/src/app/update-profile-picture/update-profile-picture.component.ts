import {Component, ElementRef, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import {UserService} from "../users/user.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-update-profile-picture',
  templateUrl: './update-profile-picture.component.html',
  styleUrls: ['./update-profile-picture.component.css']
})
export class UpdateProfilePictureComponent {
  @ViewChild('imagePreview', { static: false }) imagePreview!: ElementRef;
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.nativeElement.src = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.selectedFile) {
      const userId = this.authService.currentUserValue.id;
      this.userService.updateProfilePicture(userId, this.selectedFile).subscribe(
        () => {
          const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: "Sucesso",
              message: "Foto de perfil atualizada com sucesso!",
              width: '350px'
            }
          });

          confirmationDialogRef.afterClosed().subscribe(() => {
            this.dialog.closeAll();
          });
        },
        error => {
          console.error("Erro ao atualizar a foto" + error)

        }
      );
    }
  }
}
