import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { CyclesComponent } from './cycles/cycles.component';
import { ListCyclesComponent } from './list-cycles/list-cycles.component';
import { UserMainScreenComponent } from './user-main-screen/user-main-screen.component';
import { CompetencyAssessmentIntroComponent } from './competency-assessment-intro/competency-assessment-intro.component';
import { PendingAssessmentsComponent } from './pending-assessments/pending-assessments.component';
import { UserEvaluationComponent } from './user-evaluation/user-evaluation.component';
import { PeerEvaluationComponent } from './peer-evaluation/peer-evaluation.component';
import { ManagerEvaluationComponent } from './manager-evaluation/manager-evaluation.component';
import { UserPdiComponent } from './user-pdi/user-pdi.component';
import { ManagerPdiComponent } from './manager-pdi/manager-pdi.component';
import { UserPdiManagementComponent } from './user-pdi-management/user-pdi-management.component';
import { ManagerAderenciaComponent } from './manager-aderencia/manager-aderencia.component';
import { CreateRoleDialogComponent } from './create-role-dialog/create-role-dialog.component';
import {AuthGuard} from "./guards/auth.guard";
import {EmployeeJohariWindowComponent} from "./employee-johari-window/employee-johari-window.component";
import {EmployeePdiComponent} from "./employee-pdi/employee-pdi.component";
import {AdherenceComponent} from "./Adherence/adherence.component";
import {AdminGuard} from "./guards/admin.guard";
import {ManagerGuard} from "./guards/manager.guard";
import {AdherenceRankingComponent} from "./adherence-ranking/adherence-ranking.component";


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'cycles', component: CyclesComponent, canActivate: [AuthGuard] },
  { path: 'list-cycles', component: ListCyclesComponent, canActivate: [AuthGuard] },
  { path: 'user-main-screen', component: UserMainScreenComponent, canActivate: [AuthGuard] },
  { path: 'competency-intro', component: CompetencyAssessmentIntroComponent, canActivate: [AuthGuard] },
  { path: 'pending-assessments', component: PendingAssessmentsComponent, canActivate: [AuthGuard] },
  { path: 'user-evaluation', component: UserEvaluationComponent, canActivate: [AuthGuard] },
  { path: 'peer-evaluation', component: PeerEvaluationComponent, canActivate: [AuthGuard] },
  { path: 'manager-evaluation', component: ManagerEvaluationComponent, canActivate: [ManagerGuard] },
  { path: 'user-pdi', component: UserPdiComponent, canActivate: [AuthGuard] },
  { path: 'user-pdi-management', component: UserPdiManagementComponent, canActivate: [AuthGuard] },
  { path: 'manager-pdi', component: ManagerPdiComponent, canActivate: [ManagerGuard] },
  { path: 'manager-aderencia', component: ManagerAderenciaComponent, canActivate: [AuthGuard] },
  { path: 'create-role', component: CreateRoleDialogComponent, canActivate: [AuthGuard] },
  { path: 'employee-johari-window', component: EmployeeJohariWindowComponent, canActivate: [AuthGuard]},
  { path: 'employee-pdi', component: EmployeePdiComponent, canActivate: [ManagerGuard]},
  { path: 'adherence', component: AdherenceComponent, canActivate: [ManagerGuard]},
  { path: 'adherence-ranking', component: AdherenceRankingComponent, canActivate: [ManagerGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
