import { Component, OnInit } from '@angular/core';
import {UserService} from "../users/user.service";
import {Employee} from "../employee-johari-window/employee-johari-window.component";
import {AuthService} from "../auth.service";
import {AdherenceService} from "./adherence.service";
import {ChartDataset, ChartOptions} from 'chart.js';
import { ApexNonAxisChartSeries, ChartComponent, ApexResponsive, ApexChart} from "ng-apexcharts";
import {Router} from "@angular/router";

@Component({
  selector: 'app-adherence',
  templateUrl: './adherence.component.html',
  styleUrls: ['./adherence.component.css']
})


export class AdherenceComponent implements OnInit {
employees: Employee[] = [];
competenceDistribution: Map<string, number> | undefined;
public pieChartLabels: string[] | undefined;
public pieChartData: number[] = [];
public chartOptions: {
  series: number[];
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
} | undefined;
adherence: number | undefined;
competencePerceivedDistribution: Map<string, number> | undefined;
public pieChartDataPerceived: number[] = [];
public pieChartLabelsPerceived: string[] | undefined;
selectedEmployee: Employee | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private adherenceService: AdherenceService,
    private router : Router) { }


  onEmployeeCardClick(employee: Employee) {
    console.log('Selected user:', employee);
    this.selectedEmployee = employee;
    // Buscar a distribuição ideal
    this.adherenceService.getCompetenceDistributionByRoleId(employee.roleId)
      .subscribe(distribution => {
        this.competenceDistribution = distribution;
        this.pieChartLabels = this.getLabelsArray(distribution);
        this.pieChartData = this.getDataArray(distribution);
        console.log(this.pieChartData);
        this.chartOptions = {
          series: this.pieChartData,
          chart: {
            width: 380,
            type: "pie"
          },
          labels: this.pieChartLabels,
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }]
        };
      });

    // Buscar a aderência
    this.adherenceService.getAdherenceByUserId(employee.id)
      .subscribe(adherenceValue => {
        this.adherence = adherenceValue;
        console.log('Adherence for', employee.name, ':', this.adherence + '%');
      });

    // Buscar a distribuição percebida
    this.adherenceService.getCompetenceDistributionByUserId(employee.id)
      .subscribe(distribution => {
        this.competencePerceivedDistribution = distribution;
        this.pieChartLabelsPerceived = this.getLabelsArray(distribution);
        this.pieChartDataPerceived = this.getDataArray(distribution);
        // Você também pode definir opções de gráfico específicas para o gráfico percebido, se necessário
      });
  }





  getLabelsArray(distribution: any): string[] {
    return Object.keys(distribution);
  }

  getDataArray(distribution: any): number[] {
    return Object.values(distribution);
  }

  goBack(): void{
    this.router.navigate(['/user-main-screen'])
  }



  getInitials(name: string): string {
    const parts = name.split(' ');
    const firstInitial = parts[0].charAt(0);
    const lastInitial = parts[parts.length - 1].charAt(0);
    const initials = (firstInitial + lastInitial).toUpperCase();

    return initials;
  }




  ngOnInit(): void {
    const userId = this.authService.currentUserId;
    if (userId !== null){
    this.userService.getUsersByManagerId(userId).subscribe(users => {
      console.log(users);

      this.employees = users.map(user =>{
        return{
          id: user.id,
          name: user.name,
          roleId: user.roleId || 0,
          role: user.role,
          profilePicture: user.profilePictureUrl
        }
      })

    })

  }


  }
}
