import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from '../create-user-dialog/create-user-dialog.component';
import { User, Department } from './user.model';
import { UserService } from './user.service';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import {RoleService} from "../create-role-dialog/role.service";
import {AuthService} from "../auth.service";
import { Router } from '@angular/router';
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog";



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  selectedOption: string = '';
  showForm: boolean = false;



  newUser: User = {
    id: 0,
    name: '',
    department: { id: 0, name: '' },
    role: '',
    managerId: 0,
    managerName: '',
    accessType: [],
    email: '',
    password: 'skillmap123',
    needsPasswordChange: false,
    userStatus: true,
    isLocked: false,
    hasCompletedTour: false
  };
// array usuarios iniciado vazio
  users: User[] = [];
  roles: any[] = []
  constructor(public dialog: MatDialog,
              private userService: UserService,
              private roleService: RoleService,
              private authService: AuthService,
              private router: Router) {}


   // carrega a lista dos users com o get da api, feito ao inicar o app
  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      console.log('Users:', users)
      this.users = users;
    });

    this.roleService.findAll().subscribe(roles => {
      this.roles = roles;
    });
  }

  getManagerName(managerId: number): string {
    const manager = this.users.find(user => user.id === managerId);
    return manager ? manager.name : 'N/A';
}

  onAddUser() {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users.push(result);
        this.showForm = false;
        this.newUser = {
          id: 0,
          name: '',
          department: { id: 0, name: '' },
          role: '',
          managerId: 0,
          managerName: '',
          accessType: [],
          email: '',
          password: 'skillmap123',
          needsPasswordChange: false,
          userStatus: true,
          isLocked: false,
          hasCompletedTour: false
        };
      }
    });
  }

  onUnlockUser(user: User) {
    this.userService.unlockUser(user.id).subscribe(
      () => {
        console.log('Usuário desbloqueado com sucesso!');
        this.dialog.open(ConfirmationDialogComponent, {
          data:{
            title: "Exito",
            message: "Usuário: " + user.name + " Desbloqueado com sucesso" ,
            width: "350px"
          }
        });
        const dialogRef = ConfirmationDialogComponent
      },
      error => {
        console.error('Erro ao desbloquear o usuário:', error);
        this.dialog.open(ConfirmationDialogComponent, {
          data:{
            title: "Erro",
            message: "Erro ao desbloquera o usuário: " + error,
            width: "350px"
          }
        });
      }
    );
  }


  onSubmit() {
    this.newUser.id = this.users.length + 1;
     // Adiciona um novo usuário à lista
    this.users.push(this.newUser);
    this.newUser = {
      id: 0,
      name: '',
      department: { id: 0, name: '' },
      role: '',
      managerId: 0,
      managerName: '',
      accessType: [],
      email: '',
      password: 'skillmap123',
      needsPasswordChange: false,
      userStatus: true,
      isLocked: false,
      hasCompletedTour: false
    };
    this.showForm = false;
  }

  onEditUser(rawUserData: any) {
    const userToEdit: User = {
      id: rawUserData.id,
      name: rawUserData.name,
      department: { id: rawUserData.departmentId || 0, name: rawUserData.departmentName },
      role: rawUserData.role,
      managerId: rawUserData.managerId,
      managerName: rawUserData.managerName || 'N/A',
      accessType: rawUserData.accessType[0],
      email: rawUserData.email,
      password: rawUserData.password,
      needsPasswordChange: rawUserData.needsPasswordChange,
      userStatus: rawUserData.userStatus,
      isLocked: rawUserData.isLocked,
      hasCompletedTour: rawUserData.hasCompletedTour
    };


    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '450px',
      data: userToEdit,
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.users.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.users[index] = result;
        }
      }
    });
  }


  onUserStatusChange(user: User) {
    const confirmChange = window.confirm('Tem certeza de que deseja alterar o status do usuário: ' + user.id + user.name + ' para inativo?');
    if (confirmChange) {
      this.userService.updateUserStatus(user.id, false).subscribe(
        () => {
          user.userStatus = false;
        },
        error => {
          console.error('Erro ao atualizar o status do usuário: ', error);
        }
      );
    }
  }

}

