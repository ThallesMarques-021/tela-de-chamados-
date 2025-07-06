import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Call } from '../models/call.model';

@Injectable({ providedIn: 'root' })
export class CallService {
  private baseUrl = 'http://localhost:3000/calls';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Call[]> {
    return this.http.get<Call[]>(this.baseUrl);
  }

  create(call: Partial<Call>): Observable<Call> {
    return this.http.post<Call>(this.baseUrl, call);
  }

  update(id: number, call: Call): Observable<Call> {
    return this.http.put<Call>(`${this.baseUrl}/${id}`, call);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
