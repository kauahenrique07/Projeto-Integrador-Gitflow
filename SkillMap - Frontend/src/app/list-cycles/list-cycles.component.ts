import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CyclesComponent } from '../cycles/cycles.component';
import {CyclesService} from "../cycles/cycles.service";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-list-cycles',
  templateUrl: './list-cycles.component.html',
  styleUrls: ['./list-cycles.component.css']
})
export class ListCyclesComponent implements OnInit {
  // Array para armazenar os ciclos (inicio ele vazio)
  cycles: any[] = [];

  displayedColumns: string[] = ['titulo', 'dataInicio', 'dataFim', 'editar'];

  constructor(private router: Router,
              private dialog: MatDialog,
              private cyclesService: CyclesService,
              private authService: AuthService) { }


  ngOnInit(): void {
    console.log(this.authService.currentUserValue);
    this.getAllCycles();
  }

  navigateToUserMainScreen(): void {
    this.router.navigate(['/user-main-screen']);
  }

  get isUser(): boolean {
    const currentUser = this.authService.currentUserValue;
    return currentUser && currentUser.accessType && currentUser.accessType.includes('USER');
  }

  getAllCycles(): void {
    this.cyclesService.findAll().subscribe((cycles: any[]) => {
      this.cycles = cycles;
    })

  }

  onEdit(ciclo: any): void {

    console.log('Editar ciclo:', ciclo);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(CyclesComponent, {
      width: '25%',
      height: '55%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
