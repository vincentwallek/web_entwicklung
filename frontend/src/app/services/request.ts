import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map, tap } from 'rxjs';

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
  // localhost verhindert CORS/Host-Mismatch, wenn das Frontend unter localhost läuft.
  private apiUrl = 'http://localhost:3001';

  // Der "Radiosender" für die Kommunikation zwischen Komponenten.
  private _refreshNeeded$ = new Subject<void>();

  /**
   * Ein öffentliches Observable, das Komponenten abonnieren können.
   */
  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  constructor(private http: HttpClient) { }

  private normalizeRequestsResponse(payload: unknown): ExpenseRequest[] {
    if (Array.isArray(payload)) {
      return payload as ExpenseRequest[];
    }

    if (payload && typeof payload === 'object' && Array.isArray((payload as { requests?: unknown }).requests)) {
      return (payload as { requests: ExpenseRequest[] }).requests;
    }

    return [];
  }

  /**
   * Ruft die Liste aller Spesenanträge vom Backend ab.
   * (Zurückgesetzt auf die einfache, funktionierende Version ohne Fehlerbehandlung).
   */
  getRequests(): Observable<ExpenseRequest[]> {
    return this.http.get<unknown>(`${this.apiUrl}/requests`).pipe(
      map((payload) => this.normalizeRequestsResponse(payload))
    );
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
