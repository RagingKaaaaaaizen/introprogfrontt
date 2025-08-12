import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { PCComponent } from '../_models';

const baseUrl = `${environment.apiUrl}/api/pc-components`;

@Injectable({ providedIn: 'root' })
export class PCComponentService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<PCComponent[]> {
    return this.http.get<PCComponent[]>(baseUrl);
  }

  getById(id: number): Observable<PCComponent> {
    return this.http.get<PCComponent>(`${baseUrl}/${id}`);
  }

  getByPCId(pcId: number): Observable<PCComponent[]> {
    return this.http.get<PCComponent[]>(`${baseUrl}/pc/${pcId}`);
  }

  getByItemId(itemId: number): Observable<PCComponent[]> {
    return this.http.get<PCComponent[]>(`${baseUrl}/item/${itemId}`);
  }

  create(component: PCComponent): Observable<PCComponent> {
    return this.http.post<PCComponent>(baseUrl, component);
  }

  update(id: number, component: Partial<PCComponent>): Observable<PCComponent> {
    return this.http.put<PCComponent>(`${baseUrl}/${id}`, component);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/${id}`);
  }

  returnToStock(id: number): Observable<void> {
    return this.http.post<void>(`${baseUrl}/${id}/return-to-stock`, {});
  }
} 