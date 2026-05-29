import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatisticheService } from '../../services/statistiche.service';

export interface StatisticaConsegna {
  dal: string | null;
  al: string | null;
  stato: string | null;
  numeroConsegne: number;
  tempoMedioConsegnaOre: number | null;
}

@Component({
  selector: 'app-statistiche',
  standalone: false,
  templateUrl: './statistiche.component.html',
  styleUrls: ['./statistiche.component.css']
})
export class StatisticheComponent implements OnInit {
  statistiche: StatisticaConsegna[] = [];

  filtri = {
    Dal: '',
    Al: '',
    Stato: ''
  };

  loading = false;
  errore = '';

  statiDisponibili: string[] = [
    'Da ritirare',
    'In consegna',
    'Consegnata'
  ];

  constructor(
    private statisticheService: StatisticheService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.caricaStatistiche();
  }

  caricaStatistiche(): void {
    this.loading = true;
    this.errore = '';

    this.statisticheService.getStatistiche(
      this.filtri.Dal,
      this.filtri.Al,
      this.filtri.Stato
    ).subscribe({
      next: (data: StatisticaConsegna[]) => {
        this.statistiche = data;
        this.loading = false;
      },
      error: () => {
        this.errore = 'Errore durante il caricamento delle statistiche.';
        this.loading = false;
      }
    });
  }

  filtra(): void {
    this.caricaStatistiche();
  }

  resetFiltri(): void {
    this.filtri = {
      Dal: '',
      Al: '',
      Stato: ''
    };

    this.caricaStatistiche();
  }

  goBack(): void {
    this.router.navigate(['/area-operatore']);
  }

  get totaleConsegne(): number {
    return this.statistiche.reduce((tot, item) => tot + item.numeroConsegne, 0);
  }

  get mediaOre(): number | null {
    const validi = this.statistiche
      .filter(x => x.tempoMedioConsegnaOre !== null)
      .map(x => x.tempoMedioConsegnaOre as number);

    if (validi.length === 0) {
      return null;
    }

    const somma = validi.reduce((a, b) => a + b, 0);
    return somma / validi.length;
  }
}