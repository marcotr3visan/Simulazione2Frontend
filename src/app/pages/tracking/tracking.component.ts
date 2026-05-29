import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface TrackingRequest {
  chiaveConsegna: string;
  dataRitiro: string;
}

interface TrackingResponse {
  stato: string;
  dataRitiro: string;
  dataConsegna: string | null;
}

@Component({
  selector: 'app-tracking',
  standalone: false,
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent {
  formData: TrackingRequest = {
    chiaveConsegna: '',
    dataRitiro: ''
  };

  risultato: TrackingResponse | null = null;
  errore = '';
  loading = false;

  private apiUrl = 'https://localhost:7193/tracking'; 

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    this.errore = '';
    this.risultato = null;

    if (!this.formData.chiaveConsegna.trim() || !this.formData.dataRitiro) {
      this.errore = 'Chiave consegna e data di ritiro sono obbligatorie.';
      return;
    }

    this.loading = true;

    this.http.post<TrackingResponse>(this.apiUrl, this.formData).subscribe({
      next: (response) => {
        this.risultato = response;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 404 || err.status === 400) {
          this.errore = 'Nessuna consegna trovata con i dati inseriti.';
        } else {
          this.errore = 'Si è verificato un errore durante il tracking della consegna.';
        }
      }
    });
  }

  resetForm(): void {
    this.formData = {
      chiaveConsegna: '',
      dataRitiro: ''
    };
    this.risultato = null;
    this.errore = '';
    this.loading = false;
  }
}