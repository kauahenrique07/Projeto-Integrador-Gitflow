import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { JohariWindowComponent } from '../johari-window.component/johari-window.component';
import {UserService} from "../users/user.service";
import {AuthService} from "../auth.service";
import {EvaluationService} from "./evaluation.service";

interface Employee {
  id: number;
  name: string;
}

@Component({
  selector: 'app-manager-pdi',
  templateUrl: './manager-pdi.component.html',
  styleUrls: ['./manager-pdi.component.css']
})
export class ManagerPdiComponent implements OnInit {
  employees: Employee[] = [];
  isUserEvaluationComplete: boolean = false;
  isPeerEvaluationComplete: boolean = false;
  isManagerEvaluationComplete: boolean = false;
  areAllEvaluationsComplete: boolean = false;
  constructor(private router: Router,
              private userService: UserService,
              private authService:AuthService,
              private evaluationService: EvaluationService) { }

  viewOwnPDI(): void{
    this.router.navigate([`/user-pdi`]);
  }

  viewPDI(): void {

  }

  ngOnInit(): void {
    const userId = this.authService.currentUserId;

    if (userId !== null) {
      this.evaluationService.isUserEvaluationFinalized(userId).subscribe(result => {
        this.isUserEvaluationComplete = result;
      });
      this.evaluationService.isPeerEvaluationFinalized(userId).subscribe(result => {
        this.isPeerEvaluationComplete = result;
      });
      this.evaluationService.isManagerEvaluationFinalized(userId).subscribe(result => {
        this.isManagerEvaluationComplete = result;
      });
      this.evaluationService.areAllEvaluationsFinalized(userId).subscribe(result => {
        this.areAllEvaluationsComplete = result;
      });


      this.userService.getUsersByManagerId(userId).subscribe(users => {
        console.log(users);

        this.employees = users.map(user => {
          return {
            id: user.id,
            name: user.name
          }
        });

      });
    }
  }


  navigateToEmployeePdi(employee: Employee): void {
    this.router.navigate(['/employee-pdi'], { state: { employee: employee } });
  }
}
