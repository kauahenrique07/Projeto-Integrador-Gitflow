import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Assessment } from './assessment.model';
import {AssessmentService} from "./assessment.service";
import {AuthService} from "../auth.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pending-assessments',
  templateUrl: './pending-assessments.component.html',
  styleUrls: ['./pending-assessments.component.css']
})
export class PendingAssessmentsComponent implements OnInit {
  assessments: Assessment[] = [];
  showTooltip: boolean = false;
  statusMap = {
    NOT_STARTED: "Não Iniciado",
    STARTED: "Iniciado",
    FINALIZED: "Finalizado",
    INACTIVE: "Inativado"
  }

  typeMap = {
    Self: "Autoavaliação",
    PEER: "Colega",
    MANAGER: "Subordinado"
  }


  constructor(private assessmentService: AssessmentService,
              private authService: AuthService,
              private dialog: MatDialog,
              private router: Router,
              private cdr: ChangeDetectorRef) {}

  translateStatus(status: string): string {
    // @ts-ignore
    return this.statusMap[status] || status;
  }

  translateType(type: string):string {
    // @ts-ignore
    return this.typeMap[type] || type;
  }

  toggleTooltip() {
    console.log("acionando tooltip")
    this.showTooltip = !this.showTooltip;
    this.cdr.detectChanges();
  }


  assessmentButton(assessment: Assessment): void{
    const startDate = new Date(assessment.startDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    const endDate = new Date(assessment.endDate);
    if(startDate > today){
      this.dialog.open(ConfirmationDialogComponent, {
        data:{
          title: "Erro",
          message: "Essa avaliação está indisponível, só poderá ser acessada em: " + startDate.toLocaleDateString() + ".",
          width: "350px"
        }
      });
    } else if(endDate < today) {
      this.dialog.open(ConfirmationDialogComponent, {
        data:{
          title: "Erro",
          message: "O Período dessa avaliação já chegou ao fim",
          width: "350px"
        }
      });
    }else {
      this.router.navigate(['/competency-intro'], { state: { assessment: assessment } });
    }
  }

  goBack(): void{
    this.router.navigate(['/user-main-screen'])
  }

  showHelp(): void{}


  ngOnInit(): void {
    const userId = this.authService.currentUserId;

    if (userId) {
      this.assessmentService.getPendingAssessments(userId).subscribe(data => {
        this.assessments = data;
      });
    }else {
      this.router.navigate(['/competency-intro']);
    }

  }
}
