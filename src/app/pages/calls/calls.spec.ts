import { TestBed } from '@angular/core/testing';
import { CallService } from '@app/core/services/call';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CallService', () => {
  let service: CallService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CallService],
    });
    service = TestBed.inject(CallService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });
});
