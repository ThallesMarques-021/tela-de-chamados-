import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { Call } from '../../../core/models/call.model';
import { CallService } from '../../../core/services/call';
import { CallModalComponent } from '../modal-chamados/call-modal';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { SnackService } from '../../../core/services/snack.service';

@Component({
  standalone: true,
  selector: 'app-call-list',
  templateUrl: './call-list.html',
  styleUrls: ['./call-list.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatPaginatorModule,
  ],
})
export class CallListComponent implements OnInit {
  calls: Call[] = [];
  dataSource = new MatTableDataSource<Call>();
  columns: string[] = ['id', 'title', 'status', 'createdAt', 'actions'];
  filterForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private callService: CallService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackService: SnackService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadCalls();
    this.setupFilterSubscription();
  }

  private buildForm(): void {
    this.filterForm = this.fb.group({
      id: [''],
      title: [''],
      status: [''],
      createdAt: [''],
    });
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.applyFilters();
    });
  }

  loadCalls(): void {
    this.callService.getAll().subscribe((data) => {
      this.calls = data;
      this.dataSource = new MatTableDataSource<Call>(this.calls);
      if (this.paginator) {
    this.dataSource.paginator = this.paginator;
  }
    });
  }

  applyFilters(): void {
    const { id, title, status, createdAt } = this.filterForm.value;

    this.dataSource.filterPredicate = (data: Call, filter: string) => {
      const search = JSON.parse(filter);
      const matchId = search.id === '' || String(data.id).includes(search.id);
      const matchTitle = data.title
        .toLowerCase()
        .includes(search.title.toLowerCase());
      const matchStatus = search.status === '' || data.status === search.status;
      const matchCreatedAt =
        search.createdAt === '' ||
        data.createdAt.toLowerCase().includes(search.createdAt.toLowerCase());
      return matchId && matchTitle && matchStatus && matchCreatedAt;
    };

    this.dataSource.filter = JSON.stringify({
      id: id || '',
      title: title || '',
      status: status || '',
      createdAt: createdAt || '',
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(CallModalComponent, {
      width: '500px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadCalls();
    });
  }

  editCall(call: Call): void {
    const dialogRef = this.dialog.open(CallModalComponent, {
      width: '500px',
      data: call,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadCalls();
    });
  }

  confirmDelete(call: Call): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: `Excluir Chamado #${call.id}`,
        message: `Tem certeza que deseja excluir o chamado "${call.title}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.callService.delete(call.id).subscribe({
          next: () => {
            this.loadCalls();
            this.snackService.success('Chamado excluído com sucesso!');
          },
          error: () => {
            this.snackService.error('Erro ao excluir o chamado.');
          },
        });
      }
    });
  }
}
