import { Component, OnInit } from '@angular/core';
import { JohariWindowComponent } from '../johari-window.component/johari-window.component';
import {TaskService} from "../manager-pdi/task.service";
import {Employee} from "../employee-johari-window/employee-johari-window.component"
import {AddTaskDialogComponent} from "../add-task-dialog/add-task-dialog.component";
import {MatDialog} from "@angular/material/dialog";


interface Task {
  title: string;
  description: string;
  deadline: string;
  taskStatusEnum: string;
}

@Component({
  selector: 'app-employee-pdi',
  templateUrl: './employee-pdi.component.html',
  styleUrls: ['./employee-pdi.component.css']
})
export class EmployeePdiComponent implements OnInit {
  tasks: Task[] = []
  employee: Employee | null = null;

  //constante em nível de classe pois o const apresentou erro
  static readonly STATUS_MAPPING: { [key: string]: string } = {
    'PENDENTE': 'Pendente',
    'EM_ANDAMENTO': 'Em Andamento',
    'CONCLUIDA': 'Concluído'
  };
  constructor(private taskService: TaskService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.employee = history.state.employee;
    console.log(this.employee?.id)
    this.taskService.getTasksByUserId(this.employee!.id).subscribe(tasks =>{
      this.tasks = tasks.map(task =>{
        return{
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          taskStatusEnum: task.taskStatusEnum
        }
      })
    })

  }

  createNewTask(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '400px',
      data: { title: '',
              description: '',
              deadline: '',
              taskStatusEnum: 'PENDENTE',
              userId: this.employee?.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Tarefa adicionada:', result);
        this.tasks.push(result)
      }
    });
  }
  getFriendlyStatus(status: string): string {
    return EmployeePdiComponent.STATUS_MAPPING[status] || status;
  }
}
