import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { CyclesComponent } from './cycles/cycles.component';
import { UsersComponent } from './users/users.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CompetenciesComponent } from './competencies/competencies.component';
import { EditCompetenciesDialogComponent } from './edit-competencies-dialog/edit-competencies-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { CreateCycleComponent } from './create-cycle/create-cycle.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog';
import { MatTableModule } from '@angular/material/table';
import { ListCyclesComponent } from './list-cycles/list-cycles.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { UserMainScreenComponent } from './user-main-screen/user-main-screen.component';
import { CompetencyAssessmentIntroComponent } from './competency-assessment-intro/competency-assessment-intro.component';
import { PendingAssessmentsComponent } from './pending-assessments/pending-assessments.component';
import { UserEvaluationComponent } from './user-evaluation/user-evaluation.component';
import { PeerEvaluationComponent } from './peer-evaluation/peer-evaluation.component';
import { ManagerEvaluationComponent } from './manager-evaluation/manager-evaluation.component';
import { UserPdiComponent } from './user-pdi/user-pdi.component';
import { MatCard, MatCardModule } from '@angular/material/card';
import { ManagerPdiComponent } from './manager-pdi/manager-pdi.component';
import { MatList, MatListModule } from '@angular/material/list';
import { UserPdiManagementComponent } from './user-pdi-management/user-pdi-management.component';
import { NewTaskDialogComponent } from './new-task-dialog.component/new-task-dialog.component';
import { JohariWindowComponent } from './johari-window.component/johari-window.component';
import { ManagerAderenciaComponent } from './manager-aderencia/manager-aderencia.component';
import { CreateRoleDialogComponent } from './create-role-dialog/create-role-dialog.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { MatRadioModule } from '@angular/material/radio';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {RegisterCompetenciesComponent} from "./register-competencies-dialog/register-competencies.component";
import {EmployeeJohariWindowComponent} from "./employee-johari-window/employee-johari-window.component";
import {EmployeePdiComponent} from "./employee-pdi/employee-pdi.component";
import {AddTaskDialogComponent} from "./add-task-dialog/add-task-dialog.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {AdherenceComponent} from "./Adherence/adherence.component";
import { NgApexchartsModule } from 'ng-apexcharts';
import * as IntroJS from 'intro.js';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { TourMatMenuModule } from 'ngx-tour-md-menu';
import {UpdateProfilePictureComponent} from "./update-profile-picture/update-profile-picture.component";
import {ChangePasswordDialogComponent} from "./change-password-dialog/change-password-dialog.component";
import {AdherenceRankingComponent} from "./adherence-ranking/adherence-ranking.component";
import {NgrokHeaderInterceptor} from "./helpers/ngrok-header.interceptor";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    CyclesComponent,
    UsersComponent,
    CreateUserDialogComponent,
    CompetenciesComponent,
    EditCompetenciesDialogComponent,
    CreateCycleComponent,
    ConfirmationDialogComponent,
    ListCyclesComponent,
    EditUserDialogComponent,
    UserMainScreenComponent,
    CompetencyAssessmentIntroComponent,
    PendingAssessmentsComponent,
    UserEvaluationComponent,
    PeerEvaluationComponent,
    ManagerEvaluationComponent,
    UserPdiComponent,
    ManagerPdiComponent,
    UserPdiManagementComponent,
    NewTaskDialogComponent,
    JohariWindowComponent,
    ManagerAderenciaComponent,
    CreateRoleDialogComponent,
    RegisterCompetenciesComponent,
    EmployeeJohariWindowComponent,
    EmployeePdiComponent,
    AddTaskDialogComponent,
    AdherenceComponent,
    OnboardingComponent,
    UpdateProfilePictureComponent,
    ChangePasswordDialogComponent,
    AdherenceRankingComponent
  ],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatSlideToggleModule,
    HttpClientModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSelectModule,
    PerfectScrollbarModule,
    MatTableModule,
    MatCardModule,
    MatListModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgApexchartsModule,
    TourMatMenuModule.forRoot()

  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NgrokHeaderInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
