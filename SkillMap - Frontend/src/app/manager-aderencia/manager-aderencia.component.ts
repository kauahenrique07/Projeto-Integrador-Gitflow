import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { JohariWindowComponent } from '../johari-window.component/johari-window.component';

interface Employee {
  name: string;
  hasResponded: boolean;
  role: string;
}

@Component({
  selector: 'app-manager-aderencia',
  templateUrl: './manager-aderencia.component.html',
  styleUrls: ['./manager-aderencia.component.css']
})
export class ManagerAderenciaComponent implements OnInit {
  employees: Employee[] = [
    {
      name: 'Kauã Henrique Reis',
      hasResponded: true,
      role: 'Help Desk N2'
    },
    {
      name: 'José Vitor Martins Sito',
      hasResponded: false,
      role: 'Analista Funcional'
    },
    {
        name: 'Bruno Vian',
        hasResponded: false,
        role: 'Analista de Testes' 
    },
    {
        name: 'Felipe José Leite',
        hasResponded: true,
        role: 'Estagiário' 
    },
    {
        name: 'Matheus Piscina',
        hasResponded: true,
        role: 'Desenvolvedor Java SR' 
    },
    {
        name: 'Gabriel Bello',
        hasResponded: true,
        role: 'Devops SR' 
    }
  ];

  constructor(private router: Router) { }

  viewOwnPDI(): void{

  }

  viewPDI(): void {
    this.router.navigate([`/user-pdi-management`]);
  }

  ngOnInit(): void {
  }

  navigateToEmployeePdi(employee: Employee): void {
    //this.router.navigateByUrl(`/pdi/${employee.name}`);
  }
}