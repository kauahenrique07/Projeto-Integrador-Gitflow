import { Component, OnInit } from '@angular/core';
import { NewTaskDialogComponent } from '../new-task-dialog.component/new-task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { JohariWindowComponent } from '../johari-window.component/johari-window.component';

interface Task {
  title: string;
  description: string;
  deadline: string;
  status: 'Pendente' | 'Em andamento' | 'Concluído';
}

@Component({
  selector: 'app-user-management-pdi',
  templateUrl: './user-pdi-management.component.html',
  styleUrls: ['./user-pdi-management.component.css']
})
export class UserPdiManagementComponent implements OnInit {
  tasks: Task[] = [
    {
      title: 'Aprender Angular',
      description: 'Concluir o tutorial de Angular',
      deadline: '2023-06-01',
      status: 'Em andamento'
    },
    {
      title: 'Aprender TypeScript',
      description: 'Ler o manual de TypeScript',
      deadline: '2023-06-15',
      status: 'Pendente'
    },
    {
        title: 'Ler sobre Metodologias Ágeis',
        description: 'Leitura de livros e aprofundamento em Scrum e métodos ágeis',
        deadline: '2023-06-15',
        status: 'Concluído'
      },
  ];

  constructor(private dialog: MatDialog) { }

  openNewTaskDialog() {
    const dialogRef = this.dialog.open(NewTaskDialogComponent);
  
    dialogRef.afterClosed().subscribe((newTask) => {
      if (newTask) {
        this.tasks.push(newTask);
      }
    });
  }
  ngOnInit(): void {
  }
}