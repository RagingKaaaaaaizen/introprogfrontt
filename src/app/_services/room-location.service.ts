import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const baseUrl = `${environment.apiUrl}/api/room-locations`;

@Injectable({ providedIn: 'root' })
export class RoomLocationService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(baseUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${baseUrl}/${id}`);
  }

  create(roomLocation: any): Observable<any> {
    return this.http.post<any>(baseUrl, roomLocation);
  }

  update(id: number, roomLocation: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}/${id}`, roomLocation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/${id}`);
  }
} 