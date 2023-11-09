import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../users/user.service';
import { Department, User } from '../users/user.model';
import { CreationSuccessResponse } from './CreationSuccessResponse';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../confirmation-dialog/confirmation-dialog';
import {RoleService} from "../create-role-dialog/role.service";
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.css']
})
export class CreateUserDialogComponent implements OnInit {
  createUserForm!: FormGroup;
  departments: Department[] = [];
  users: User[] = [];
  managers: User[] = [];
  roles: any[] = []
  selectedProfilePicture: File | null = null;
  private isProcessingChange = false;
  constructor(
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private roleService: RoleService
  ) {}

  accessTypes = [
    {value: 'ADMIN', viewValue: 'Administrador'},
    {value: 'USER', viewValue: 'Usuário'},
    {value: 'MANAGER', viewValue: 'Gestor'}
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.fetchData();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
    this.debugFormErrors();

  }

  private debugFormErrors(): void {
    Object.keys(this.createUserForm.controls).forEach(key => {
      const control = this.createUserForm.get(key);
      if (control && control.errors) {
        Object.keys(control.errors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', control.errors ? control.errors[keyError] : null);
        });
      }
    });
}



  private initializeForm(): void {
    const accessTypeControls = this.accessTypes.map(() => this.fb.control(false));

    this.createUserForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      department: ['', Validators.required],
      role: ['', Validators.required],
      manager: ['', Validators.required],
      accessType: this.fb.array(accessTypeControls, this.atLeastOneCheckboxSelected),
      email: ['', [Validators.required, Validators.email]],
      password: ['skillmap123', Validators.required],
      needsPasswordChange: [true],
      userStatus: [true]
    });

  }

  private fetchData(): void {
    this.userService.getDepartments().subscribe(departments => {
      this.departments = departments;
    });

    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.managers = this.users.filter(user => user.accessType.includes('MANAGER'));
    });

    this.roleService.findAll().subscribe(roles => {
      this.roles = roles;
    });

  }

  private atLeastOneCheckboxSelected(control: AbstractControl): ValidationErrors | null {
    const selectedAny = control.value.some((selected: boolean) => selected);
    return selectedAny ? null : { required: true };
  }



  isFormInvalid(): boolean {
    return !this.createUserForm.valid;
  }


  onSubmit(): void {
    console.log('Submit foi chamado!!!!')
    if (this.isFormInvalid()) {
      console.log('Formulário inválido, não podemos submeter');
      this.dialog.open(ConfirmationDialogComponent, {
        data: {title: 'Erro', message: 'Todos os campos são obrigatórios para criação de usuário.'},
        width: '350px'
      });
      return;
    }
    const formValue = this.createUserForm.value;
    const selectedAccessTypes = this.accessTypes
      .filter((_, index) => formValue.accessType[index])
      .map(type => type.value);
    formValue.accessType = selectedAccessTypes;
    const selectedRole = this.roles.find(role => role.id == formValue.role);
    formValue.role = selectedRole;
    const selectedDepartment = this.departments.find(dept => dept.id == formValue.department);
    formValue.department = selectedDepartment;

    // Pega o ID do manager selecionado.
    let selectedManager = this.managers.find(manager => manager.id == formValue.manager);
    if (selectedManager) {
      formValue.managerId = selectedManager.id;
    } else if (formValue.manager == "0") {
      formValue.managerId = null;
    }
    // Remova a propriedade manager de formValue
    delete formValue.manager;

    const formData = new FormData();

    // Convertendo formValue para JSON e adicionando ao FormData
    const userJson = JSON.stringify(formValue);
    formData.append('user', new Blob([userJson], { type: 'application/json' }));

    // Usar o formData na chamada ao serviço
    this.userService.createUser(formData).subscribe(
      (response: CreationSuccessResponse) => {
        const dialogData: ConfirmationDialogData = {
          title: 'Sucesso',
          message: response.message ? response.message : 'Usuário criado com sucesso, mas a mensagem do servidor não está disponível.'
        };
        this.dialog.open(ConfirmationDialogComponent, {
          data: dialogData,
          width: '350px'
        });
        this.dialogRef.close(this.createUserForm.value);
      },
      (error: any) => {
        console.error('Erro ao criar usuário: ', error);
        const errorMessage = Array.isArray(error.error.errors) ? error.error.errors.join(', ') : error.error.errors;
        const dialogData: ConfirmationDialogData = {
          title: 'Erro',
          message: errorMessage ? errorMessage : 'Erro ao criar usuário. Por favor, tente novamente mais tarde.'
        };
        this.dialog.open(ConfirmationDialogComponent, {
          data: dialogData,
          width: '350px'
        });
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getControlValidation(controlName: string, validationName: string): boolean {
    const control = this.createUserForm.get(controlName);
    return control?.hasError(validationName) && control.touched ? true : false;
  }

  getFormControl(controlName: string): AbstractControl | null {
    return this.createUserForm.get(controlName);
  }

  protected readonly event = event;
}
