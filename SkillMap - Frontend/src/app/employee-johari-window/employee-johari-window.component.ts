import { Component, OnInit } from '@angular/core';
import { JohariService } from '../johari-window.component/johari.service';
import {AuthService} from "../auth.service";
import {UserService} from "../users/user.service";
export interface Employee {
  id: number;
  name: string;
  roleId?: number;
  profilePicture?: string;
  role: string;
}

interface Competence {
  code: string;
  title: string;
}

interface JohariArea {
  id: number;
  description: string;
  core: string;
  quadrant: string;
  reference: string;
}

interface JohariWindowData {
  openArea: JohariArea[];
  blindSpot: JohariArea[];
  hiddenArea: JohariArea[];
  unknownArea: JohariArea[];
}


@Component({
  selector: 'app-employee-johari-window',
  templateUrl: '../johari-window.component/johari-window.component.html',
  styleUrls: ['../johari-window.component/johari-window.component.css']
})
export class EmployeeJohariWindowComponent implements OnInit {
  employee: Employee | null = null;
  quadrantTitles = ['Eu aberto', 'Eu cego', 'Eu secreto', 'Eu desconhecido'];

  idealCompetencies: Competence[] = [];

  openQuadrant: Competence[] = [];
  blindQuadrant: Competence[] = [];
  hiddenQuadrant: Competence[] = [];
  unknownQuadrant: Competence[] = [];

  quadrants: Competence[][] = [this.openQuadrant, this.blindQuadrant, this.hiddenQuadrant, this.unknownQuadrant];

  constructor(private johariService: JohariService,
              private authService: AuthService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.employee = history.state.employee;
    console.log(this.employee)
    if (this.employee && typeof this.employee.id !== 'undefined') {
      const userId = this.employee.id;

      this.userService.getIdealCompetencesByUserId(userId)
        .subscribe((competenciesData: any[]) => {
          this.idealCompetencies = competenciesData.map(item => ({
            code: item.competence.reference,
            title: item.competence.description
          }));
        });

      this.johariService.getJohariWindowForUser(userId)
        .subscribe((data: JohariWindowData) => {
          this.openQuadrant = data.openArea.map((comp: JohariArea) => ({ code: comp.reference, title: comp.description }));
          this.blindQuadrant = data.blindSpot.map((comp: JohariArea) => ({ code: comp.reference, title: comp.description }));
          this.hiddenQuadrant = data.hiddenArea.map((comp: JohariArea) => ({ code: comp.reference, title: comp.description }));
          this.unknownQuadrant = data.unknownArea.map((comp: JohariArea) => ({ code: comp.reference, title: comp.description }));
          this.quadrants = [this.openQuadrant, this.blindQuadrant, this.hiddenQuadrant, this.unknownQuadrant];
        });
    } else {
      console.log("deu erro");
    }
  }

}
