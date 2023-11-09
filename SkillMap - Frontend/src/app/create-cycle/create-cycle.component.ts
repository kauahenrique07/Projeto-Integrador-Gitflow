import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-create-cycle',
    templateUrl: './create-cycle.component.html',
    styleUrls: ['./create-cycle.component.css']
})
export class CreateCycleComponent {
    createCycleForm!: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.createCycleForm = this.fb.group({
          title: ['', [Validators.required, Validators.maxLength(255)]],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
        });
    }

    onSubmit(): void {
        if (this.createCycleForm.valid) {
            console.log('Formulário é válido, tentando criar ciclo');

        } else {
            console.log('Formulário é inválido, não é possível criar ciclo');
        }
    }
}
