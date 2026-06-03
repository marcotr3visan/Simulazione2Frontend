import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StatisticaConsegna {
  dal: string | null;
  al: string | null;
  stato: string | null;
  numeroConsegne: number;
  tempoMedioConsegnaOre: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticheService {
  private apiUrl = 'https://localhost:7193/api/statistiche/consegne';

  constructor(private http: HttpClient) {}

  getStatistiche(Dal?: string, Al?: string, Stato?: string): Observable<StatisticaConsegna[]> {
    let params = new HttpParams();

    if (Dal) {
      params = params.set('Dal', Dal);
    }

    if (Al) {
      params = params.set('Al', Al);
    }

    if (Stato) {
      params = params.set('Stato', Stato);
    }

    return this.http.get<StatisticaConsegna[]>(this.apiUrl, { params });
  }
}