import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Cliente {
  clienteID: number;
  nominativo: string | null;
  via: string | null;
  comune: string | null;
  provincia: string | null;
  telefono: string | null;
  email: string | null;
  note: string | null;
}

export interface InserisciClienteRequest {
  nominativo: string;
  via: string;
  comune: string;
  provincia: string;
  telefono: string;
  email: string;
  note: string;
}

export interface ModificaClienteRequest {
  nominativo?: string;
  via?: string;
  comune?: string;
  provincia?: string;
  telefono?: string;
  email?: string;
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientiService {
  private apiUrl = '/api/clienti';

  constructor(private http: HttpClient) {}

  getClienti(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  inserisciCliente(cliente: InserisciClienteRequest): Observable<any> {
    return this.http.post(this.apiUrl, cliente);
  }

  modificaCliente(id: number, cliente: ModificaClienteRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}