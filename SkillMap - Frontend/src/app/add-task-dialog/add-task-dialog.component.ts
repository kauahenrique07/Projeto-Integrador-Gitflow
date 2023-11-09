import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {MatDatepicker} from "@angular/material/datepicker";
import {Assessment} from "../pending-assessments/assessment.model";
import {TaskService} from "../manager-pdi/task.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog";
MatDialog
@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css']
})
export class AddTaskDialogComponent implements OnInit{
  assessment: Assessment | null = null;
  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }



  onAdd(): void {
    console.log(this.data)
    this.taskService.insert(this.data).subscribe(
      (response) => {
        console.log("Task inserida com sucesso!", response);
        this.dialogRef.close(response);
      },
      (error) => {
        console.error("Erro ao inserir task:", error);
      }
    );


  this.dialogRef.close(this.data);
  }

  ngOnInit() {

  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
