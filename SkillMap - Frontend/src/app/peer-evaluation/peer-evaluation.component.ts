import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Assessment} from "../pending-assessments/assessment.model";
import {CompetenceService} from "../competencies/competence.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog";
import {MatDialog} from "@angular/material/dialog";
import {PeerCompetenceService} from "./peer-competence.service";
import {Router} from "@angular/router";

interface Skill {
  quadrant: string;
  description: string;
  id: number;
}

@Component({
  selector: 'app-peer-evaluation',
  templateUrl: './peer-evaluation.component.html',
  styleUrls: ['./peer-evaluation.component.css']
})
export class PeerEvaluationComponent implements OnInit {
  skills: Skill[] = [];
  selectedSkills: Skill[] = [];
  assessment: Assessment | null = null;
  isLoading: boolean = true;
  hasError: boolean = false;
  isSubmitting: boolean = false;
  constructor(private competenceService: CompetenceService,
              private cdRef: ChangeDetectorRef,
              private dialog: MatDialog,
              private peerCompetenceService: PeerCompetenceService,
              private router: Router) {}

  ngOnInit() {
    this.assessment = history.state.assessment;
    console.log(this.assessment)
    this.competenceService.getCompetencies().subscribe(
      (skills: Skill[]) => {
        this.skills = skills;
        this.cdRef.detectChanges();
        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to load skills:', error);
        this.isLoading = false;
        this.hasError = true;
      }
    );
  }

  selectSkill(skill: Skill): void {
    if (this.selectedSkills.includes(skill)) {
      this.deselectSkill(skill);
    } else if (this.selectedSkills.length < 10) {
      this.selectedSkills.push(skill);
    } else {
      this.openErrorDialog();
    }
  }

  openErrorDialog(): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data:{
        title: "Erro",
        message: "Você já selecionou 10 competências,caso <br> queria selecionar alguma outra, terá que <br> desmarcar uma das já selecionadas :)",
        width: "50px"
      }
    });
  }


  deselectSkill(skill: Skill): void {
    const index = this.selectedSkills.indexOf(skill);
    this.selectedSkills.splice(index, 1);
  }

  onSubmit(): void {
    if(!this.assessment?.evaluateeId || !this.assessment?.cycleId) {
      console.error("dados incompletos de avaliado e ciclo")
      return;
    }

    const peerCompetences = this.selectedSkills.map(skill => {
      return{
        userId: this.assessment?.evaluateeId,
        competenceId: skill.id,
        evaluationCycleId: this.assessment?.cycleId,
        peerId: this.assessment?.evaluatorId
      };
    });

    console.log("dados enviados ao backend: ", peerCompetences);
    this.isSubmitting = true;
    this.peerCompetenceService.addPeerCompetencesBatch(peerCompetences).subscribe(
      response => {
        console.log("Competências enviadas com sucesso: ", response);
        this.isSubmitting = false;
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: "Sucesso",
            message: "Parabéns!!!! Você finalizou a avaliação de: " + this.assessment?.evaluateeName,
            width: "50px"
          }
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/pending-assessments']);
        });
      },
      error =>{
        this.isSubmitting = false;
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: "Erro",
            message: "Erro ao enviar as competências, procure um administrador.",
            width: "50px"
          }
        });
      }
    )

  }



  exit(): void {}
}
