import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TrackingRequest {
  chiaveConsegna: string;
  dataRitiro: string;
}

export interface TrackingResponse {
  stato: string;
  dataRitiro: string;
  dataConsegna: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private apiUrl = 'https://localhost:7193/api/tracking';

  constructor(private http: HttpClient) {}

  cercaConsegna(payload: TrackingRequest): Observable<TrackingResponse> {
    return this.http.post<TrackingResponse>(this.apiUrl, payload);
  }
}