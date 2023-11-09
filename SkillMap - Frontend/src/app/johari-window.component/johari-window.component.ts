import { Component, OnInit } from '@angular/core';
import { JohariService } from './johari.service';
import {AuthService} from "../auth.service";
import {UserService} from "../users/user.service";


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
  selector: 'app-johari-window',
  templateUrl: './johari-window.component.html',
  styleUrls: ['./johari-window.component.css']
})
export class JohariWindowComponent implements OnInit {

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
    const userId = this.authService.currentUserId;
    if (userId !== null) {

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

        // Atualizar o array de quadrantes após preenchê-los com os dados
        this.quadrants = [this.openQuadrant, this.blindQuadrant, this.hiddenQuadrant, this.unknownQuadrant];
      });
  }else{
      console.log("deu erro")
    }
}
}
