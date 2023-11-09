import {ChangeDetectorRef, Component, Inject, NgZone} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { CompetenceService } from '../competencies/competence.service';
import { IdealCompetenceService } from '../competencies/ideal-competence.service';

@Component({
  selector: 'app-register-competencies',
  templateUrl: './register-competencies.component.html',
  styleUrls: ['./register-competencies.component.css']
})
export class RegisterCompetenciesComponent {

  competencies: any[] = [];
  selectedCompetencies: any[] = new Array(10).fill(null);
  selected1: any = null;
  selected2: any = null;
  selected3: any = null;
  selected4: any = null;
  selected5: any = null;
  selected6: any = null;
  selected7: any = null;
  selected8: any = null;
  selected9: any = null;
  selected10: any = null;


  constructor(
    public dialogRef: MatDialogRef<RegisterCompetenciesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {job: any, competencies: any[]},
    private competenceService: CompetenceService,  // Injeta o CompetenceService
    private idealCompetenceService: IdealCompetenceService,  // Injeta o IdealCompetenceService
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchCompetencies();
    this.selectedCompetencies = Array(10).fill(null);
  }

  getSelectedValue(index: number): any {
    return this.selectedCompetencies[index];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  fetchCompetencies(): void {
    this.competenceService.getCompetencies().subscribe(
      competencies => {
        this.competencies = competencies;  // atualiza a lista de competências com a resposta do servidor
      },
      error => {
        console.log(error);  // lida com erros
      }
    );
  }


  onCompetencySelected(event: any, index: number): void {
    this.selectedCompetencies[index] = event;
    console.log('Selected competence for index', index, ':', this.selectedCompetencies[index]);
  }




  compareCompetencies(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
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


    console.log('Selected competencies:', this.selectedCompetencies);

    this.selectedCompetencies.forEach(competence => {
      if (competence) {
        let idealCompetence = {
          role: { id: this.data.job.id },
          competence: { id: competence.id }
        };

        console.log('Sending ideal competence:', idealCompetence);

        this.idealCompetenceService.saveCompetence(idealCompetence).subscribe(
          response => {
            console.log('Success response:', response);
          },
          error => {
            console.log('Error:', error);
          }
        );
      }
    });
    this.dialogRef.close();
  }


}
