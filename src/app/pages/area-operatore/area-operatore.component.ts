import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ClientiService,
  Cliente,
  InserisciClienteRequest
} from '../../services/clienti.service';
import {
  Consegna,
  ConsegneService
} from '../../services/consegne.service';

type ClienteInModifica = InserisciClienteRequest & {
  clienteID: number;
};

type ConsegnaInModifica = {
  consegnaID: number;
  clienteID: number;
  dataRitiro: string;
  dataConsegna: string;
  stato: string;
  chiaveConsegna: string;
};

@Component({
  selector: 'app-area-operatore',
  standalone: false,
  templateUrl: './area-operatore.component.html',
  styleUrls: ['./area-operatore.component.css']
})
export class AreaOperatoreComponent implements OnInit {
  clienti: Cliente[] = [];
  consegne: Consegna[] = [];

  loadingClienti = false;
  loadingConsegne = false;

  erroreClienti = '';
  erroreConsegne = '';
  messaggio = '';

  nuovoCliente: InserisciClienteRequest = this.createEmptyCliente();

  clienteInModifica: ClienteInModifica | null = null;

  nuovaConsegna: { clienteID: number; dataRitiro: string } = {
    clienteID: 0,
    dataRitiro: ''
  };

  consegnaInModifica: ConsegnaInModifica | null = null;

  statiConsegna: string[] = [
    'Da ritirare',
    'In deposito',
    'In consegna',
    'Consegnata',
    'In giacenza'
  ];

  constructor(
    private clientiService: ClientiService,
    private consegneService: ConsegneService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.caricaClienti();
    this.caricaConsegne();
  }

  private createEmptyCliente(): InserisciClienteRequest {
    return {
      nominativo: '',
      via: '',
      comune: '',
      provincia: '',
      telefono: '',
      email: '',
      note: ''
    };
  }

  private createEmptyConsegna(): { clienteID: number; dataRitiro: string } {
    return {
      clienteID: 0,
      dataRitiro: ''
    };
  }

  private resetMessaggi(): void {
    this.messaggio = '';
    this.erroreClienti = '';
    this.erroreConsegne = '';
  }

  private formatDateForInput(data: string | Date | null | undefined): string {
    if (!data) {
      return '';
    }

    const date = new Date(data);

    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString().split('T')[0];
  }

  private formatNullableText(value: string | null | undefined): string {
    return value ?? '';
  }

  caricaClienti(): void {
    this.loadingClienti = true;
    this.erroreClienti = '';

    this.clientiService.getClienti().subscribe({
      next: (data: Cliente[]) => {
        this.clienti = data;
        this.loadingClienti = false;
      },
      error: (err) => {
        this.erroreClienti = err?.error || 'Errore durante il caricamento dei clienti.';
        this.loadingClienti = false;
      }
    });
  }

  caricaConsegne(): void {
    this.loadingConsegne = true;
    this.erroreConsegne = '';

    this.consegneService.getConsegne().subscribe({
      next: (data: Consegna[]) => {
        this.consegne = data;
        this.loadingConsegne = false;
      },
      error: (err) => {
        this.erroreConsegne = err?.error || 'Errore durante il caricamento delle consegne.';
        this.loadingConsegne = false;
      }
    });
  }

  inserisciCliente(): void {
    this.resetMessaggi();

    this.clientiService.inserisciCliente(this.nuovoCliente).subscribe({
      next: (res) => {
        this.messaggio = res?.message || 'Cliente inserito con successo.';
        this.nuovoCliente = this.createEmptyCliente();
        this.caricaClienti();
      },
      error: (err) => {
        this.erroreClienti = err?.error || 'Errore durante l’inserimento del cliente.';
      }
    });
  }

  apriModificaCliente(cliente: Cliente): void {
    this.resetMessaggi();

    this.clienteInModifica = {
      clienteID: cliente.clienteID,
      nominativo: this.formatNullableText(cliente.nominativo),
      via: this.formatNullableText(cliente.via),
      comune: this.formatNullableText(cliente.comune),
      provincia: this.formatNullableText(cliente.provincia),
      telefono: this.formatNullableText(cliente.telefono),
      email: this.formatNullableText(cliente.email),
      note: this.formatNullableText(cliente.note)
    };
  }

  annullaModificaCliente(): void {
    this.clienteInModifica = null;
    this.erroreClienti = '';
  }

  salvaModificaCliente(): void {
    if (!this.clienteInModifica) {
      return;
    }

    this.resetMessaggi();

    const { clienteID, ...payload } = this.clienteInModifica;

    this.clientiService.modificaCliente(clienteID, payload).subscribe({
      next: (res) => {
        this.messaggio = res?.message || 'Cliente aggiornato con successo.';
        this.clienteInModifica = null;
        this.caricaClienti();
      },
      error: (err) => {
        this.erroreClienti = err?.error || 'Errore durante la modifica del cliente.';
      }
    });
  }

  eliminaCliente(id: number): void {
    if (!confirm('Vuoi eliminare questo cliente?')) {
      return;
    }

    this.resetMessaggi();

    this.clientiService.deleteCliente(id).subscribe({
      next: (res) => {
        this.messaggio = res?.message || 'Cliente eliminato con successo.';
        this.caricaClienti();

        if (this.clienteInModifica?.clienteID === id) {
          this.clienteInModifica = null;
        }
      },
      error: (err) => {
        this.erroreClienti = err?.error || 'Errore durante l’eliminazione del cliente.';
      }
    });
  }

  inserisciConsegna(): void {
    this.resetMessaggi();

    if (!this.nuovaConsegna.clienteID || this.nuovaConsegna.clienteID <= 0) {
      this.erroreConsegne = 'Seleziona un cliente valido.';
      return;
    }

    if (!this.nuovaConsegna.dataRitiro) {
      this.erroreConsegne = 'Inserisci la data di ritiro.';
      return;
    }

    this.consegneService.inserisciConsegna(this.nuovaConsegna).subscribe({
      next: (res) => {
        this.messaggio = res?.message || 'Consegna inserita con successo.';
        this.nuovaConsegna = this.createEmptyConsegna();
        this.caricaConsegne();
      },
      error: (err) => {
        this.erroreConsegne = err?.error || 'Errore durante l’inserimento della consegna.';
      }
    });
  }

  apriModificaConsegna(consegna: Consegna): void {
    this.resetMessaggi();

    this.consegnaInModifica = {
      consegnaID: consegna.consegnaID,
      clienteID: consegna.clienteID,
      dataRitiro: this.formatDateForInput(consegna.dataRitiro),
      dataConsegna: this.formatDateForInput(consegna.dataConsegna),
      stato: consegna.stato ?? 'Da ritirare',
      chiaveConsegna: consegna.chiaveConsegna ?? ''
    };
  }

  annullaModificaConsegna(): void {
    this.consegnaInModifica = null;
    this.erroreConsegne = '';
  }

  salvaModificaConsegna(): void {
    if (!this.consegnaInModifica) {
      return;
    }

    this.resetMessaggi();

    const payload = {
      clienteID: this.consegnaInModifica.clienteID,
      dataRitiro: this.consegnaInModifica.dataRitiro || null,
      dataConsegna: this.consegnaInModifica.dataConsegna || null,
      stato: this.consegnaInModifica.stato,
      chiaveConsegna: this.consegnaInModifica.chiaveConsegna
    };

    this.consegneService.modificaConsegna(this.consegnaInModifica.consegnaID, payload).subscribe({
      next: (res) => {
        this.messaggio = res?.message || 'Consegna aggiornata con successo.';
        this.consegnaInModifica = null;
        this.caricaConsegne();
      },
      error: (err) => {
        this.erroreConsegne = err?.error || 'Errore durante la modifica della consegna.';
      }
    });
  }

  eliminaConsegna(id: number): void {
    if (!confirm('Vuoi eliminare questa consegna?')) {
      return;
    }

    this.resetMessaggi();

    this.consegneService.eliminaConsegna(id).subscribe({
      next: (res) => {
        this.messaggio = res?.message || 'Consegna eliminata con successo.';
        this.caricaConsegne();

        if (this.consegnaInModifica?.consegnaID === id) {
          this.consegnaInModifica = null;
        }
      },
      error: (err) => {
        this.erroreConsegne = err?.error || 'Errore durante l’eliminazione della consegna.';
      }
    });
  }

  cambiaStatoRapido(consegna: Consegna, nuovoStato: string): void {
    if (!nuovoStato || consegna.stato === nuovoStato) {
      return;
    }

    this.resetMessaggi();

    this.consegneService.modificaStatoConsegna(consegna.consegnaID, nuovoStato).subscribe({
      next: (res) => {
        this.messaggio = res?.message || 'Stato aggiornato con successo.';

        if (this.consegnaInModifica?.consegnaID === consegna.consegnaID) {
          this.consegnaInModifica.stato = nuovoStato;

          if (nuovoStato !== 'Consegnata') {
            this.consegnaInModifica.dataConsegna = '';
          } else if (!this.consegnaInModifica.dataConsegna) {
            this.consegnaInModifica.dataConsegna = this.formatDateForInput(new Date());
          }
        }

        this.caricaConsegne();
      },
      error: (err) => {
        this.erroreConsegne = err?.error || 'Errore durante l’aggiornamento dello stato.';
        this.caricaConsegne();
      }
    });
  }

  getDataDisplay(value: string | Date | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.toISOString();
  }

  goToStats(): void {
    this.router.navigate(['/statistiche']);
  }
}