import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsRoutingModule } from './calls-routing-module';
import { CallModalComponent } from './modal-chamados/call-modal';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CallListComponent } from './lista-chamado/call-list';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CallsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule,
    CallModalComponent,
    CallListComponent,
  ],
})
export class CallsModule {}
