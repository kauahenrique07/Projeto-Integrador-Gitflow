import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Assessment} from "../pending-assessments/assessment.model";
import {CompetenceService} from "../competencies/competence.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog";
import {UserCompetenceService} from "./user-competence.service";
import {User} from "../users/user.model";
import {Competence} from "../competencies/competence.model";
import {EvaluationCycle} from "./evaluation-cycle.model";
import {Router} from "@angular/router";

interface Skill {
  quadrant: string;
  description: string;
  id: number;
}



interface UserCompetence {
  user: User;
  competence: Competence;
  evaluationCycle: EvaluationCycle;
}

@Component({
  selector: 'app-user-evaluation',
  templateUrl: './user-evaluation.component.html',
  styleUrls: ['./user-evaluation.component.css']
})
export class UserEvaluationComponent implements OnInit {
  skills: Skill[] = [];
  selectedSkills: Skill[] = [];
  assessment: Assessment | null = null;
  isLoading: boolean = true;
  hasError: boolean = false;
  isSubmitting: boolean = false;
  constructor(private competenceService: CompetenceService,
              private cdRef: ChangeDetectorRef,
              public dialog: MatDialog,
              private userCompetenceService: UserCompetenceService,
              private router: Router) {}

  ngOnInit() {
    this.assessment = history.state.assessment;

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
    if (!this.assessment?.evaluateeId || !this.assessment?.cycleId) {
      console.error('evaluateeId or cycleId estao falntand');
      return;
    }

    if (this.selectedSkills.length < 10) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: "Erro",
          message: "Você precisa selecionar 10 competências para finalizar a avaliação.",
          width: "50px"
        }
      })
    }

    const userCompetences = this.selectedSkills.map(skill => {
      return {
        userId: this.assessment!.evaluateeId,
        competenceId: skill.id,
        evaluationCycleId: this.assessment!.cycleId
      };
    });


    if (this.selectedSkills.length == 10) {
      console.log('Dados enviados para o backend:', userCompetences);
      this.isSubmitting = true;
      this.userCompetenceService.addUserCompetencesBatch(userCompetences).subscribe(
        response => {
          console.log('Competências enviadas com sucesso!', response);
          this.isSubmitting = false;
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: "Sucesso",
              message: "Parabéns!!!!! Você finalizou sua autoavaliação :)",
              width: "50px"
            }
          });
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/pending-assessments']);
          });
        }
        ,
        error => {
          this.isSubmitting = false;
          this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: "Erro",
              message: "Erro ao enviar as competências, procure um administrador.",
              width: "50px"
            }
          });
        }
      );
    }
  }
  exit(): void {}
}
