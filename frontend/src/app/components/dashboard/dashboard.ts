import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// Importiert den Service und das Daten-Interface.
import { RequestService, ExpenseRequest } from '../../services/request';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  requests: ExpenseRequest[] = [];
  private refreshSubscription!: Subscription;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadData();

    this.refreshSubscription = this.requestService.refreshNeeded$.subscribe(() => {
      this.loadData();
    });
  }

  /**
   * Holt die aktuellen Anträge vom Backend und enthält jetzt eine
   * detaillierte Fehlerprotokollierung.
   */
  loadData(): void {
    console.log('Starte Ladevorgang: Sende GET-Request an das Backend...');
    
    this.requestService.getRequests().subscribe({
      // Dieser Block wird bei einer ERFOLGREICHEN Antwort ausgeführt.
      next: (data) => {
        console.log('Erfolg! Daten vom Backend geladen:', data);
        this.requests = data;
      },
      
      // =================================================================
      // === DIESER BLOCK WIRD NUR BEI EINEM FEHLER AUSGEFÜHRT ===
      error: (err) => {
        // Wir loggen den Fehler sehr auffällig in der Browser-Konsole.
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('!!! FEHLER BEIM LADEN DER DATEN IN DER KOMPONENTE !!!');
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('Das ist der wahre Fehlergrund:', err);
        
        // Wir setzen die Liste auf leer, weshalb die Tabelle nichts anzeigt.
        this.requests = []; 
      }
      // =================================================================
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
