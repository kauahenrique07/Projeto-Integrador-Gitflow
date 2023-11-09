import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditCompetenciesDialogComponent } from '../edit-competencies-dialog/edit-competencies-dialog.component';
import { CreateRoleDialogComponent } from '../create-role-dialog/create-role-dialog.component';
import { RoleService } from '../create-role-dialog/role.service';
import {IdealCompetenceService} from "./ideal-competence.service";
import {RegisterCompetenciesComponent} from "../register-competencies-dialog/register-competencies.component";
import {CreationSuccessResponse} from "../create-user-dialog/CreationSuccessResponse";


@Component({
  selector: 'app-competencies',
  templateUrl: './competencies.component.html',
  styleUrls: ['./competencies.component.css']
})
export class CompetenciesComponent implements OnInit {
  jobs: any[] = [];

  constructor(
      public dialog: MatDialog,
      private roleService: RoleService,
      private idealCompetenceService: IdealCompetenceService  // Injete o IdealCompetenceService aqui
  ) {}

  ngOnInit(): void {
    this.getJobs();
  }


  openRegisterCompetenciesDialog(job: any): void {
    const dialogRef = this.dialog.open(RegisterCompetenciesComponent, {
      data: {job: job}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O diálogo foi fechado');
      this.getJobs();
    });
  }

  getJobs(): void {
    this.roleService.findAll().subscribe((jobs: any[]) => {
      this.jobs = jobs;

      // Para cada cargo, obtenha a contagem de competências ideais e defina na propriedade do cargo
      this.jobs.forEach(job => {
        this.idealCompetenceService.getCompetenceCountForJob(job.id).subscribe(count => {
          job.competencies = count;
        });
      });

    }, (error: any) => {
      console.log(error);
    });
  }

  openCreateRoleDialog(): void {
    const dialogRef = this.dialog.open(CreateRoleDialogComponent, {
      width: '300px',
      height: '200',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getJobs();
      console.log('O diálogo foi fechado');
    });
  }

  openEditCompetenciesDialog(job: any): void {
    const dialogRef = this.dialog.open(EditCompetenciesDialogComponent, {
      data: {job: job, competencies: job.competencies}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O diálogo foi fechado');
    });
  }
}
