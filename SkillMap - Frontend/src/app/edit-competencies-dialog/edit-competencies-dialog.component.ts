import {ChangeDetectorRef, Component, Inject, NgZone} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompetenceService } from '../competencies/competence.service';
import { IdealCompetenceService } from '../competencies/ideal-competence.service';
import { forkJoin } from 'rxjs';
import {error} from "@angular/compiler-cli/src/transformers/util";
import {map, tap} from "rxjs/operators";

@Component({
  selector: 'app-edit-competencies-dialog',
  templateUrl: './edit-competencies-dialog.component.html',
  styleUrls: ['./edit-competencies-dialog.component.css']
})
export class EditCompetenciesDialogComponent {

  competencies: any[] = [];
  selectedCompetencies: any[] = new Array(10).fill(null);



    constructor(
      public dialogRef: MatDialogRef<EditCompetenciesDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {job: any, competencies: any[]},
      private competenceService: CompetenceService,
      private idealCompetenceService: IdealCompetenceService,
      private ngZone: NgZone,
      private cdr: ChangeDetectorRef
  ) {}



  ngOnInit(): void {
    console.log("Entire data object:", this.data);

    this.loadAllCompetencies().subscribe(() => {
      if (this.data.job && this.data.job.competencies && Array.isArray(this.data.job.competencies) && this.data.job.competencies.length > 0) {

        this.selectedCompetencies.length = 0;

        this.data.job.competencies.forEach((comp: any) => {
          this.selectedCompetencies.push({...{ id: comp.competence.id, ...comp.competence }});
        });

        while (this.selectedCompetencies.length < 10) {
          this.selectedCompetencies.push(null);
        }

      } else {
        this.loadIdealCompetenciesForJob().subscribe(idealCompetencies => {
          this.selectedCompetencies = idealCompetencies;

          while (this.selectedCompetencies.length < 10) {
            this.selectedCompetencies.push(null);
          }
          console.log("selectedCompetencies after init:", this.selectedCompetencies);
        });
      }
      this.cdr.detectChanges();
    });
  }





  loadAllCompetencies() {
    return this.competenceService.getCompetencies().pipe(
      tap(competencies => {
        this.competencies = competencies;
      })
    );
  }
    onNoClick(): void {
    this.dialogRef.close();
  }

  fetchCompetencies(): void {
    this.competenceService.getCompetencies().subscribe(
      competencies => {
        this.competencies = competencies;
        this.cdr.detectChanges();
        console.log('Dados recebidos:', competencies);
        console.log("Competências buscadas:", this.competencies);
      },
      error => {
        console.log('Erro detalhado:', error);
      }
    );
  }


  loadIdealCompetenciesForJob() {
    return this.idealCompetenceService.getIdealCompetenciesForJob(this.data.job.id).pipe(
      tap(competences => {
        console.log("Competências ideais retornadas para o cargo:", competences);
      }),
      map(data => data.map(item => item.competence))
    );
  }


  onCompetencySelected(event: any, index: number): void {
    this.selectedCompetencies[index] = event;
  }




  getSelectedValue(index: number): any {
    return this.selectedCompetencies[index];
  }



  compareCompetencies(c1: any, c2: any): boolean {
    return c1 && c2 && c1.id === c2.id;
  }






  getAvailableCompetencies(index: number): any[] {
        return this.competencies.filter(competence => {
            let isAvailable = !this.selectedCompetencies.map(c => c?.id).includes(competence.id) || this.selectedCompetencies[index] === competence;
            return isAvailable;
        });
    }


    trackByFn(index: any, item: any): any {
        return item.id;
    }
  saveCompetencies(): void {
    // Formata a lista de competências para enviar ao backend
    const formattedCompetencies = this.selectedCompetencies.map(competence => {
      if (competence && competence.id) {
        return {
          role: { id: this.data.job.id },
          competence: { id: competence.id }
        };
      } else {
        return null;
      }
    }).filter(comp => comp !== null);

    console.log('Enviando competências ideais:', formattedCompetencies);

    // Atualiza todas as competências de uma vez
    this.idealCompetenceService.updateCompetenciesForRole(this.data.job.id, formattedCompetencies).subscribe(
      response => {
        console.log("Competências atualizadas com sucesso: ", response);
      },
      error => {
        console.log('Erro ao atualizar competências: ', error);
      }
    );

    this.dialogRef.close();
  }



}

