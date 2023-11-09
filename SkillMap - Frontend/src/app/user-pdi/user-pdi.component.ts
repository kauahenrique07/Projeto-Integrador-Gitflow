import { Component, OnInit } from '@angular/core';
import { JohariWindowComponent } from '../johari-window.component/johari-window.component';
import {AuthService} from "../auth.service";
import {TaskService} from "../manager-pdi/task.service";
import {Router} from "@angular/router";



interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  taskStatusEnum: string;
  startDate: string;
}

@Component({
  selector: 'app-user-pdi',
  templateUrl: './user-pdi.component.html',
  styleUrls: ['./user-pdi.component.css']
})
export class UserPdiComponent implements OnInit {
  tasks: Task[] = [];

  //constante em nível de classe pois o const apresentou erro
  static readonly STATUS_MAPPING: { [key: string]: string } = {
    'PENDENTE': 'Pendente',
    'EM_ANDAMENTO': 'Em Andamento',
    'CONCLUIDA': 'Concluído'
  };

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router) { }

  ngOnInit(): void {
    const userId = this.authService.currentUserId;

    if(userId !== null){
    this.taskService.getTasksByUserId(userId).subscribe(tasks =>{
      this.tasks = tasks.map(task =>{
        return{
          id: task.id,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          taskStatusEnum: task.taskStatusEnum,
          startDate: task.startDate
        }
      })
    })
    }else{
      console.error("Userid é null")
    }


  }


  goBack(): void{
    this.router.navigate(['/user-main-screen'])
  }

  getProgressBarColor(task: Task): string {
    if (task.taskStatusEnum === 'CONCLUIDA') {
      return 'green';
    }
    const percentage = this.calculateProgress(task);
    if (percentage >= 0 && percentage <= 25) return 'green';
    if (percentage > 25 && percentage <= 50) return 'yellow';
    if (percentage > 50 && percentage <= 75) return 'orange';
    return 'red'; // Para porcentagens de 75 a 100
  }



  getProgressDisplay(task: Task): string {
    if (task.taskStatusEnum === 'CONCLUIDA') {
      return 'Concluído';
    }
    return `${this.calculateProgress(task)}%`;
  }


  calculateProgress(task: Task): number {
    if (task.taskStatusEnum === 'CONCLUIDA') {
      return 100;
    }
    const start = new Date(task.startDate);
    const endDate = new Date(task.deadline);
    const totalTime = Math.abs(endDate.getTime() - start.getTime());
    const elapsed = Math.abs(new Date().getTime() - start.getTime());
    const percentage = (elapsed / totalTime) * 100;

    return Math.round(percentage);
  }





  onStatusChange(newStatus: string, task: Task): void {
    this.taskService.updateTaskStatus(task.id, newStatus).subscribe(updatedTask => {
      // Atualiza a tarefa na lista local com a tarefa atualizada que vem da API.
      const index = this.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
    });
  }
  getFriendlyStatus(status: string): string {
    return UserPdiComponent.STATUS_MAPPING[status] || status;
  }
}
