import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PC, SpecificationField } from '../_models/pc';

@Injectable({ providedIn: 'root' })
export class PCService {
    private baseUrl = `${environment.apiUrl}/api/pcs`;

    constructor(private http: HttpClient) {}

    getAll(): Observable<PC[]> {
        console.log('PC Service - getAll called, URL:', this.baseUrl);
        return this.http.get<PC[]>(this.baseUrl);
    }

    getById(id: number): Observable<PC> {
        console.log('PC Service - getById called, URL:', `${this.baseUrl}/${id}`);
        return this.http.get<PC>(`${this.baseUrl}/${id}`);
    }

    create(pc: PC): Observable<PC> {
        console.log('PC Service - Creating PC:', pc);
        console.log('PC Service - URL:', this.baseUrl);
        return this.http.post<PC>(this.baseUrl, pc);
    }

    update(id: number, pc: PC): Observable<PC> {
        return this.http.put<PC>(`${this.baseUrl}/${id}`, pc);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    getSpecificationFields(categoryId: number): Observable<SpecificationField[]> {
        return this.http.get<SpecificationField[]>(`${this.baseUrl}/specifications/${categoryId}`);
    }
} 