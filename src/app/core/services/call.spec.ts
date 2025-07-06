import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CallService } from './call';
import { Call } from '../../core/models/call.model';

describe('CallService', () => {
  let service: CallService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CallService],
    });

    service = TestBed.inject(CallService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('deve buscar todos os chamados', () => {
    const mockCalls: Call[] = [
      { id: 1, title: 'Teste', description: '...', status: 'Aberto', createdAt: '' },
    ];

    service.getAll().subscribe((calls) => {
      expect(calls.length).toBe(1);
      expect(calls[0].title).toBe('Teste');
    });

    const req = httpMock.expectOne('http://localhost:3000/calls');
    expect(req.request.method).toBe('GET');
    req.flush(mockCalls);
  });

  it('deve criar um chamado', () => {
    const newCall: Partial<Call> = {
      title: 'Novo',
      description: '...',
      status: 'Aberto',
    };

    const createdCall: Call = {
      id: 1,
      title: 'Novo',
      description: '...',
      status: 'Aberto',
      createdAt: '2023-01-01T00:00:00Z',
    };

    service.create(newCall).subscribe((call) => {
      expect(call.id).toBe(1);
      expect(call.title).toBe('Novo');
    });

    const req = httpMock.expectOne('http://localhost:3000/calls');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCall);
    req.flush(createdCall);
  });

  it('deve atualizar um chamado', () => {
    const updatedCall: Call = {
      id: 1,
      title: 'Atualizado',
      description: '...',
      status: 'Fechado',
      createdAt: '2023-01-01T00:00:00Z',
    };

    service.update(1, updatedCall).subscribe((call) => {
      expect(call.status).toBe('Fechado');
      expect(call.title).toBe('Atualizado');
    });

    const req = httpMock.expectOne('http://localhost:3000/calls/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedCall);
    req.flush(updatedCall);
  });

  it('deve excluir um chamado', () => {
    service.delete(1).subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/calls/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
