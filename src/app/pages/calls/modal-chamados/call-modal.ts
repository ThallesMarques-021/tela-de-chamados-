import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { CallService } from '../../../core/services/call';
import { Call } from '../../../core/models/call.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackService } from '../../../core/services/snack.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-call-modal',
  templateUrl: './call-modal.html',
  styleUrls: ['./call-modal.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class CallModalComponent implements OnInit {
  callForm!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private callService: CallService,
    private dialogRef: MatDialogRef<CallModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Call | null,
    private snackBar: MatSnackBar,
    private snackService: SnackService
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;

    this.callForm = this.fb.group({
      title: [this.data?.title || '', Validators.required],
      description: [this.data?.description || '', Validators.required],
      status: [this.data?.status || 'Aberto', Validators.required],
    });
  }

  save(): void {
    if (this.callForm.invalid) return;

    const formValue = this.callForm.value;

    if (this.isEdit && this.data) {
      const updatedCall: Call = {
        ...this.data,
        ...formValue,
      };

      this.callService.update(this.data.id, updatedCall).subscribe({
        next: () => {
          this.snackService.success('Chamado atualizado com sucesso!');
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackService.error('Erro ao atualizar chamado.');
        },
      });
    } else {
      const newCall: Partial<Call> = {
        ...formValue,
        createdAt: new Date().toISOString(),
      };

      this.callService.create(newCall).subscribe({
        next: () => {
          this.snackService.success('Chamado criado com sucesso!');
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackService.error('Erro ao criar chamado.');
        },
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
