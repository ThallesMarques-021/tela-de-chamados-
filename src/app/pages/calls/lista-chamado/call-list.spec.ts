import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

import { CallListComponent } from './call-list';
import { CallService } from '../../../core/services/call';
import { SnackService } from '../../../core/services/snack.service';
import { Call } from '../../../core/models/call.model';
import { MatPaginatorModule } from '@angular/material/paginator';

describe('CallListComponent', () => {
  let component: CallListComponent;
  let fixture: ComponentFixture<CallListComponent>;
  let callService: jasmine.SpyObj<CallService>;
  let snackService: jasmine.SpyObj<SnackService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const callServiceSpy = jasmine.createSpyObj('CallService', ['getAll', 'delete']);
    callServiceSpy.getAll.and.returnValue(of([]));
    const snackSpy = jasmine.createSpyObj('SnackService', ['success', 'error']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        CallListComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatPaginatorModule,
      ],
      providers: [
        { provide: CallService, useValue: callServiceSpy },
        { provide: SnackService, useValue: snackSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CallListComponent);
    component = fixture.componentInstance;
    callService = TestBed.inject(CallService) as jasmine.SpyObj<CallService>;
    snackService = TestBed.inject(SnackService) as jasmine.SpyObj<SnackService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os chamados', () => {
    const mockCalls: Call[] = [
      {
        id: 1,
        title: 'Teste',
        description: 'desc',
        status: 'Aberto',
        createdAt: '2023-01-01',
      },
    ];
    callService.getAll.and.returnValue(of(mockCalls));

    component.loadCalls();

    expect(callService.getAll).toHaveBeenCalled();
    expect(component.calls.length).toBe(1);
    expect(component.dataSource.data.length).toBe(1);
  });

  it('deve aplicar filtros corretamente', () => {
    const calls: Call[] = [
      {
        id: 1,
        title: 'Chamado',
        description: '',
        status: 'Aberto',
        createdAt: '2023-01-01',
      },
      {
        id: 2,
        title: 'Outro',
        description: '',
        status: 'Fechado',
        createdAt: '2023-01-01',
      },
    ];
    component.calls = calls;
    component.dataSource.data = calls;
    component.filterForm.setValue({
      id: '',
      title: 'Chamado',
      status: '',
      createdAt: '',
    });

    component.applyFilters();

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].title).toBe('Chamado');
  });

  it('deve abrir o modal de criação', () => {
    callService.getAll.and.returnValue(of([]));
    dialog.open.and.returnValue({ afterClosed: () => of(true) } as any);
    spyOn(component, 'loadCalls');

    component.openCreateModal();

    expect(dialog.open).toHaveBeenCalled();
    expect(component.loadCalls).toHaveBeenCalled();
  });

  it('deve abrir o modal de edição com dados', () => {
    const call: Call = {
      id: 1,
      title: 'Editar',
      description: '',
      status: 'Aberto',
      createdAt: '',
    };
    dialog.open.and.returnValue({ afterClosed: () => of(true) } as any);
    spyOn(component, 'loadCalls');

    component.editCall(call);

    expect(dialog.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({ data: call })
    );
    expect(component.loadCalls).toHaveBeenCalled();
  });

  it('deve excluir chamado após confirmação', () => {
    const call: Call = {
      id: 1,
      title: 'Excluir',
      description: '',
      status: 'Fechado',
      createdAt: '...',
    };
    dialog.open.and.returnValue({ afterClosed: () => of(true) } as any);
    callService.delete.and.returnValue(of(undefined));
    spyOn(component, 'loadCalls').and.callThrough();

    component.confirmDelete(call);

    expect(dialog.open).toHaveBeenCalled();
    expect(callService.delete).toHaveBeenCalledWith(1);
    expect(snackService.success).toHaveBeenCalledWith(
      'Chamado excluído com sucesso!'
    );
    expect(component.loadCalls).toHaveBeenCalled();
  });

  it('deve exibir erro ao falhar na exclusão', () => {
    callService.getAll.and.returnValue(of([]));
    const call: Call = {
      id: 1,
      title: 'Falha',
      description: '',
      status: 'Aberto',
      createdAt: '2023-01-01',
    };

    dialog.open.and.returnValue({ afterClosed: () => of(true) } as any);
    callService.delete.and.returnValue(
      throwError(() => new Error('Erro inesperado'))
    );

    component.confirmDelete(call);

    expect(dialog.open).toHaveBeenCalled();
    expect(callService.delete).toHaveBeenCalledWith(1);
    expect(snackService.error).toHaveBeenCalledWith(
      'Erro ao excluir o chamado.'
    );
  });
});
