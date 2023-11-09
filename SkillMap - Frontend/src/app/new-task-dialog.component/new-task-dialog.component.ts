import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-task-dialog',
  templateUrl: './new-task-dialog.component.html',
  styleUrls: ['./new-task-dialog.component.css']
})
export class NewTaskDialogComponent {
  task = {
    title: '',
    description: '',
    deadline: '',
    status: 'Pendente' as 'Pendente' | 'Em andamento' | 'Concluído',
  };

  constructor(private dialogRef: MatDialogRef<NewTaskDialogComponent>) {}

  save() {
    this.dialogRef.close(this.task);
  }

  cancel() {
    this.dialogRef.close();
  }
}