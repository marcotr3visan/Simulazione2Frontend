import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Consegna {
  consegnaID: number;
  clienteID: number;
  dataRitiro: string;
  dataConsegna?: string | null;
  stato?: string | null;
  chiaveConsegna?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ConsegneService {
  private apiUrl = 'https://localhost:7193/api/consegne';

  constructor(private http: HttpClient) {}

  getConsegne(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  inserisciConsegna(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  eliminaConsegna(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  modificaConsegna(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }

  modificaStatoConsegna(id: number, stato: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/stato`, { stato });
  }
}