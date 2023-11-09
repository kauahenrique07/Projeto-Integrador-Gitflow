import { Component, OnInit, Type, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CyclesComponent } from '../cycles/cycles.component';
import { UsersComponent } from '../users/users.component';
import { CompetenciesComponent } from '../competencies/competencies.component';
import { ListCyclesComponent } from '../list-cycles/list-cycles.component';
import {OnboardingComponent} from "../onboarding/onboarding.component";
import {AuthService} from "../auth.service";
import {UserService} from "../users/user.service";
import {User} from "../users/user.model";
import {error} from "@angular/compiler-cli/src/transformers/util";



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  selectedOption: string = 'cycles';
  component: Type<any> = ListCyclesComponent;
  modalTop: string = '0px';
  modalLeft: string = '0px';
  showOnboarding: boolean = false;
  tourSteps: any[] = [
    {
      anchorId: "ciclos",
      title: "Gerenciar Ciclos",
      content: "Aqui você pode gerenciar os ciclos."
    },
    {
      anchorId: "usuarios",
      title: "Gerenciar Usuários",
      content: "Aqui você pode gerenciar os usuários."
    },
    {
      anchorId: "cargos",
      title: "Gerenciar Cargos",
      content: "Aqui você pode gerenciar os cargos."
    }
  ];

  // Variáveis de controle do tour nativo
  isTourActive = false;
  currentTourStep = 0;
  endOnboardingAndStartTour() {
    this.showOnboarding = false;
    this.startNativeTour();
  }
  constructor(
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    console.log("Completou o tour de onboarding: " + currentUser.hasCompletedTour);
    if (currentUser && !currentUser.hasCompletedTour){
      this.showOnboarding = true;
    }
  }


  adjustModalPosition() {
    const currentStep = this.tourSteps[this.currentTourStep];
    const element = document.querySelector(`[tourAnchor="${currentStep.anchorId}"]`);
    if (element) {
      const rect = element.getBoundingClientRect();
      this.modalTop = (rect.top - 70) + 'px'; // Subtrair 10px ou o valor que achar mais apropriado
      this.modalLeft = (rect.left + rect.width + 20) + 'px';
    }
  }




  ngAfterViewInit(): void {}

  nextNativeStep() {
    if (this.currentTourStep < this.tourSteps.length - 1) {
      this.currentTourStep++;
      this.adjustModalPosition();
    } else {
      this.endNativeTour();
    }
  }

  startOnboarding() {
    this.showOnboarding = true;
  }



  startNativeTour() {
    this.isTourActive = true;
    this.currentTourStep = 0;
    this.adjustModalPosition();
  }



  adminCompletedTour(user: User){
    this.userService.completeAdminTour(user.id).subscribe(
      () => {
        console.log("Usuário terminou o tour");
      },
      error =>{
        console.error("Erro ao finalizar o tour")
      }

    )
  }

  endNativeTour() {
    this.isTourActive = false;
    this.currentTourStep = 0;

    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.adminCompletedTour(currentUser);
    }

  }

  selectOption(option: string) {
    this.selectedOption = option;
    if (option === 'cycles') {
      this.component = ListCyclesComponent;
    } else if (option === 'users') {
      this.component = UsersComponent;
    } else if (option === 'competencies') {
      this.component = CompetenciesComponent;
    }
  }

  logout() {
    this.authService.logout();
    console.log('Usuário saiu.');
  }
}
