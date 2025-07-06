import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallModalComponent } from './call-modal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { SnackService } from '@core/services/snack.service';
import { CallService } from '@app/core/services/call';
import { Call } from '@core/models/call.model';

describe('CallModalComponent', () => {
  let component: CallModalComponent;
  let fixture: ComponentFixture<CallModalComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CallModalComponent>>;
  let mockCallService: jasmine.SpyObj<CallService>;
  let mockSnack: jasmine.SpyObj<SnackService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockCallService = jasmine.createSpyObj('CallService', ['create', 'update']);
    mockSnack = jasmine.createSpyObj('SnackService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [CallModalComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: CallService, useValue: mockCallService },
        { provide: SnackService, useValue: mockSnack },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CallModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve criar um chamado com sucesso', () => {
    component.callForm.setValue({
      title: 'Teste',
      description: 'Teste desc',
      status: 'Aberto',
    });

    const mockCall: Call = {
      id: 1,
      title: 'Teste',
      description: 'Teste desc',
      status: 'Aberto',
      createdAt: new Date().toISOString(),
    };

    mockCallService.create.and.returnValue(of(mockCall));

    component.save();

    expect(mockCallService.create).toHaveBeenCalled();
    expect(mockSnack.success).toHaveBeenCalledWith(
      'Chamado criado com sucesso!'
    );
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('deve exibir erro se falhar ao criar chamado', () => {
    component.callForm.setValue({
      title: 'Teste',
      description: 'Teste desc',
      status: 'Aberto',
    });

    mockCallService.create.and.returnValue(throwError(() => new Error('Erro')));

    component.save();

    expect(mockSnack.error).toHaveBeenCalledWith('Erro ao criar chamado.');
  });

  it('deve fechar o modal ao cancelar', () => {
    component.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
