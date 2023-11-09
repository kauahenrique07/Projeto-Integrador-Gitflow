import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {AssessmentService} from "../pending-assessments/assessment.service";
import {Assessment} from "../pending-assessments/assessment.model";
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-competency-assessment-intro',
  templateUrl: './competency-assessment-intro.component.html',
  styleUrls: ['./competency-assessment-intro.component.css']
})
export class CompetencyAssessmentIntroComponent {
  assessments: Assessment[] = [];
  assessment: Assessment | null = null;
  constructor(private authService: AuthService,
              private assessmentService: AssessmentService,
              private router: Router,
              private route: ActivatedRoute) {
  }



  ngOnInit(): void {
    this.assessment = history.state.assessment;
    console.log(this.assessment?.type)
  }



  assessmentButton(): void {
    if (this.assessment && this.assessment.type === "Self") {
      this.router.navigate(['/user-evaluation'], { state: { assessment: this.assessment } });
    }else if(this.assessment && this.assessment.type === "MANAGER"){
      this.router.navigate(['/manager-evaluation'], { state: { assessment: this.assessment } });
    }else if(this.assessment && this.assessment.type === "PEER"){
      this.router.navigate(['/peer-evaluation'], { state: { assessment: this.assessment } });
    }else{
      console.log("Deu ruim")
    }

  }


  }
