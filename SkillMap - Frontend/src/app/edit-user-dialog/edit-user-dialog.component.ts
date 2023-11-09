import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../users/user.service';
import { Department, User } from '../users/user.model';
import { RoleService } from '../create-role-dialog/role.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css', '../create-user-dialog/create-user-dialog.component.css']
})
export class EditUserDialogComponent implements OnInit {
  editUserForm!: FormGroup;
  departments: Department[] = [];
  users: User[] = [];
  managers: User[] = [];
  roles: any[] = [];
  accessTypes = [
    { value: 'ADMIN', viewValue: 'Administrador' },
    { value: 'USER', viewValue: 'Usuário' },
    { value: 'MANAGER', viewValue: 'Gestor' }
  ];

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.userService.getUser(this.data.id).subscribe(userDetails => {
        this.data = { ...this.data, ...userDetails };
        console.log('Dados recebidos do usuário:', this.data);

        this.initializeForm();

        // Apenas para garantir que o nome esteja carregado
        // @ts-ignore
        this.editUserForm.get('name').setValue(this.data.name);

        this.cdr.detectChanges();
        this.loadAdditionalData();
      }, error => {
        console.error('Erro ao buscar os detalhes do usuário:', error);
      });
    }
    else {
      console.error('Dados do usuário não fornecidos corretamente.');
    }
  }



  private loadAdditionalData(): void {
    this.userService.getDepartments().subscribe(departments => {
      this.departments = departments;
    });

    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.managers = this.users.filter(user => (user.accessType || []).includes('MANAGER'));
    });

    this.roleService.findAll().subscribe(roles => {
      this.roles = roles;
      console.log("Competências carregadas:", roles);
    });
  }


  private initializeForm(): void {
    const userAccess = Array.isArray(this.data.accessType) ? this.data.accessType : [this.data.accessType];
    const accessControls = this.accessTypes.map(access => this.fb.control(userAccess.includes(access.value)));

    this.editUserForm = this.fb.group({
      id: [this.data.id, Validators.required],
      name: [this.data.name, Validators.required],
      department: [this.data.department ? this.data.department.id : null, Validators.required],
      role: [this.data.role ? this.data.roleId : null, Validators.required],
      manager: [this.data.managerId, Validators.required],
      accessType: this.fb.array(accessControls),
      email: [this.data.email, [Validators.required, Validators.email]],
      password: [this.data.password, Validators.required],
      needsPasswordChange: [this.data.needsPasswordChange || false],
      userStatus: [this.data.userStatus || true]
    });
  }

  private fetchData(): void {
    this.userService.getDepartments().subscribe(departments => {
      this.departments = departments;
    });

    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.managers = this.users.filter(user => (user.accessType || []).includes('MANAGER'));

    });

    this.roleService.findAll().subscribe(roles => {
      this.roles = roles;
      console.log("Competências carregadas:", roles);
    });
  }

  onSubmit(): void {
    console.log('Nome do usuário antes de transformar formData:', this.editUserForm.get('name')?.value);

    if (this.editUserForm.valid) {
      const formData = this.editUserForm.value;

      // map, é um metodo que percorre todo array retorna um novo array, com base na função fornecida (formData.Accesstype)
      // isChecked é o valor atual do array que estamos mapeando é true se retornar "isChecked" caso contrario é falso
      // index é utilizado pra mostrar o indice do item no array, sera utilizado para referenciar o acesso correspondente em this.acessTypes
      // return isChecked ? this.accessTypes[index].value : null; essa linha verifica se o valor é true, se sim pega o valor.
      // Filter serve para que após mapealmento, remova todos os valores que sejam nulos, deixando somente os campos marcados no Form.
      formData.accessType = formData.accessType.map((isChecked: boolean, index: number) => {
        return isChecked ? this.accessTypes[index].value : null;
      }).filter((v: string | null) => v !== null);


      //transforma o departamento selecionado em objeto para envio.
      const selectedDepartment = this.departments.find(dept => dept.id == formData.department);
      formData.department = selectedDepartment;

      //transforma o cargo selecionado em um objeto para envio.
      const selectedRole = this.roles.find(role => role.id == formData.role);
      formData.role = selectedRole;

      if (formData.manager) {
        formData.managerId = formData.manager;
        delete formData.manager;
      }

      console.log('Dados enviados para o backend:', formData);

      this.userService.updateUser(formData).subscribe(updatedUser => {
        console.log("usuário atualizado: " + updatedUser);
        this.dialogRef.close(updatedUser);
      }, error => {
        console.error('Erro ao atualizar o usuário: ', error);
      });
    } else {
      console.error('Formulário inválido');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
