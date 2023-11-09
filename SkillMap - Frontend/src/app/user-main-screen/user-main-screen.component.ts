import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog";

@Component({
  selector: 'app-user-main-screen',
  templateUrl: './user-main-screen.component.html',
  styleUrls: ['./user-main-screen.component.css']
})
export class UserMainScreenComponent implements OnInit {
  isAdmin: boolean = false;
  name: string | undefined;
  isManager: boolean = false;
  constructor(private authService: AuthService,
              private router: Router,
              private dialog: MatDialog) {}

  ngOnInit() {
    const user = this.authService.currentUserValue;

    if (user && user.accessType) {
      this.isAdmin = user.accessType.includes('ADMIN');
      this.isManager = user.accessType.includes('MANAGER');
    }

    this.name = user && user.name ? user.name : 'Usuário';

    console.log('Is Admin:', this.isAdmin);
    console.log('Is Manager:', this.isManager);
  }


  adherenceClick(){
    if(this.authService.currentUserValue.accessType.includes("MANAGER")){
      this.router.navigate(['/adherence']);
    }else{
      this.dialog.open(ConfirmationDialogComponent,{
        data:{
          title: "Acesso Negado",
          message: "Essa tela é exclusiva para gestores",
          width: "350px"
        }
      });
    }
  }
}
