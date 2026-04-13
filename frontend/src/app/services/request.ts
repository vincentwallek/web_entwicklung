import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Beschreibt, wie ein vollständiges Spesenantrags-Objekt aussieht,
 * das wir vom Backend erhalten.
 */
export interface ExpenseRequest {
  id: number;
  status: string;
  title: string;
  employeeId: number;
  projectId: string;
  estimatedCost: number;
  travelDate: Date;
  description?: string;
  submittedAt?: Date;
}

/**
 * Beschreibt die Daten, die wir an das Backend senden müssen,
 * um einen neuen Antrag zu erstellen.
 */
export type CreateRequestDto = Omit<ExpenseRequest, 'id' | 'status' | 'submittedAt'>;


@Injectable({
  providedIn: 'root'
})
export class RequestService {
  // Die Adresse unseres FastAPI-Backends.
  private apiUrl = 'http://127.0.0.1:3001';

  // Der "Radiosender" für die Kommunikation zwischen Komponenten.
  private _refreshNeeded$ = new Subject<void>();

  /**
   * Ein öffentliches Observable, das Komponenten abonnieren können.
   */
  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  constructor(private http: HttpClient) { }

  /**
   * Ruft die Liste aller Spesenanträge vom Backend ab.
   * (Zurückgesetzt auf die einfache, funktionierende Version ohne Fehlerbehandlung).
   */
  getRequests(): Observable<ExpenseRequest[]> {
    return this.http.get<ExpenseRequest[]>(`${this.apiUrl}/requests`);
  }

  /**
   * Sendet einen neuen Spesenantrag an das Backend.
   * Sendet nach Erfolg ein Signal, um die Dashboard-Liste zu aktualisieren.
   */
  addRequest(request: CreateRequestDto): Observable<ExpenseRequest> {
    return this.http.post<ExpenseRequest>(`${this.apiUrl}/requests`, request).pipe(
      tap(() => {
        // Sendet die "Bitte aktualisieren"-Nachricht an alle Zuhörer.
        this._refreshNeeded$.next();
      })
    );
  }
}
