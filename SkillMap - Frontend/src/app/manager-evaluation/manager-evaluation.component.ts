import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Assessment} from "../pending-assessments/assessment.model";
import {CompetenceService} from "../competencies/competence.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog";
import {MatDialog} from "@angular/material/dialog";
import {ManagerCompetenceService} from "./manager-competence.service";
import {Router} from "@angular/router";

interface Skill {
  quadrant: string;
  description: string;
  core: string;
  id: number;
}

@Component({
    selector: 'app-manager-evaluation',
    templateUrl: './manager-evaluation.component.html',
    styleUrls: ['./manager-evaluation.component.css']
  })
  export class ManagerEvaluationComponent implements OnInit {
  skills: Skill[] = [];
  selectedSkills: Skill[] = [];
  assessment: Assessment | null = null;
  isLoading: boolean = true;
  hasError: boolean = false;
  isSubmitting: boolean = false;
  groupedSkills: {[key: string]: Skill[] } ={};
  constructor(private competenceService: CompetenceService,
              private cdRef: ChangeDetectorRef,
              private dialog: MatDialog,
              private managerCompetenceService: ManagerCompetenceService,
              private router: Router) {}

  ngOnInit() {
    this.assessment = history.state.assessment;
    console.log(this.assessment);
    console.log(this.assessment?.evaluatorId);

    this.competenceService.getCompetencies().subscribe(
      (skills: Skill[]) => {
        // Agrupando habilidades por 'core'
        for (let skill of skills) {
          if (!this.groupedSkills[skill.core]) {
            this.groupedSkills[skill.core] = [];
          }
          this.groupedSkills[skill.core].push(skill);
        }

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

  getKeys(obj: { [key: string]: any }): string[] {
    return Object.keys(obj);
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
    if(!this.assessment?.evaluateeId || !this.assessment?.cycleId){
      console.error("evaluateeId ou cycleId estão faltando")
      return;
    }

    const managerCompetences = this.selectedSkills.map(skill => {
      return{
        userId: this.assessment?.evaluateeId,
        competenceId: skill.id,
        evaluationCycleId: this.assessment!.cycleId,
        managerId: this.assessment?.evaluatorId
      };
    });

    console.log("dados enviados para o backend: ", managerCompetences);
    this.isSubmitting = true;
    this.managerCompetenceService.addManagerCompetencesBatch(managerCompetences).subscribe(
      response => {
        console.log("Compettencias enviadas com sucesso: ", response)
        this.isSubmitting = false;
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data:{
            title: "Sucesso",
            message:"Parabens!!!  Você finalizou a avaliação de: "+ this.assessment?.evaluateeName + "<br> :)",
            width: "50px"
          }
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/pending-assessments']);
        });
      },
        error => {
          this.isSubmitting = false;
          this.dialog.open(ConfirmationDialogComponent, {
            data:{
              title: "Erro",
              message: "Erro ao enviar as competências, procure um administrador.",
              width: "50px"
            }
          });
        console.log("Deu algum erro mano")
      }
    )
  }

  exit(): void {}
}
