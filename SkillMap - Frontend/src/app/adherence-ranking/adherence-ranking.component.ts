import { Component, OnInit } from '@angular/core';
import { UserService } from "../users/user.service";
import { Employee } from "../employee-johari-window/employee-johari-window.component";
import { AdherenceService } from "../Adherence/adherence.service";
import { AuthService } from "../auth.service";
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from "@angular/router";
export interface EmployeeWithAdherence extends Employee {
  adherence: number;
}

@Component({
  selector: 'app-adherence-ranking',
  templateUrl: './adherence-ranking.component.html',
  styleUrls: ['./adherence-ranking.component.css']
})
export class AdherenceRankingComponent implements OnInit {
  employees: Employee[] = [];
  rankedEmployees: EmployeeWithAdherence[] = [];

  constructor(
    private userService: UserService,
    private adherenceService: AdherenceService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    const userId = this.authService.currentUserId;
    if (userId !== null) {
      this.userService.getUsersByManagerId(userId).subscribe(users => {
        this.employees = users.map(user => {
          return {
            id: user.id,
            name: user.name,
            roleId: user.roleId || 0,
            role: user.role,
            profilePicture: user.profilePictureUrl
          };
        });

        let adherenceRequests = this.employees.map(employee => {
          return this.adherenceService.getAdherenceByUserId(employee.id).pipe(map(adherenceValue => {
            return { ...employee, adherence: adherenceValue };
          }));
        });

        forkJoin(adherenceRequests).subscribe((employeesWithAdherence: EmployeeWithAdherence[]) => {
          this.rankedEmployees = employeesWithAdherence.sort((a, b) => b.adherence - a.adherence);
        });
      });
    }
  }

  goBack(): void{
    this.router.navigate(['/adherence'])
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    const firstInitial = parts[0].charAt(0);
    const lastInitial = parts[parts.length - 1].charAt(0);
    const initials = (firstInitial + lastInitial).toUpperCase();
    return initials;
  }
}
