# Projektkontext: Reise-Spesen-Planer

### 1. Projekt-Übersicht

**Projektname:** Reise-Spesen-Planer

**Ziel:** Eine Full-Stack-Webanwendung zur Verwaltung des gesamten Lebenszyklus von Spesenanträgen, von der Einreichung bis zur Auszahlung.

**Architektur (Vision):** Eine Microservice-Architektur, bestehend aus einem Frontend und **vier dedizierten Backend-Services**, die jeweils eine spezifische Geschäftslogik kapseln.

### 2. Detaillierte Architektonische Vision (Die Rollen der Services)

Der Kern des Projekts ist der klar definierte Prozessablauf, bei dem ein Antrag von einem Service zum nächsten weitergereicht wird:

1.  **`request-service` (Der Eingang):**
    *   **Zweck:** Dient als zentraler Einstiegspunkt für Benutzer.
    *   **Aufgaben:** Erstellen, Lesen, Aktualisieren und Löschen (CRUD) von Spesenanträgen. Verwaltet den initialen Status (z.B. `DRAFT`, `SUBMITTED`).
    *   **Status:** Dies ist der bisher einzige implementierte Service.

2.  **`approval-service` (Die Genehmigung):**
    *   **Zweck:** Simuliert die Genehmigungslogik.
    *   **Aufgaben:** Übernimmt Anträge mit dem Status `SUBMITTED`. Kann den Status auf `APPROVED` oder `REJECTED` ändern.

3.  **`budget-service` (Die Finanzprüfung):**
    *   **Zweck:** Prüft die finanzielle Deckung.
    *   **Aufgaben:** Übernimmt Anträge mit dem Status `APPROVED`. Ändert den Status auf `BUDGET_CONFIRMED` oder `BUDGET_DENIED`.

4.  **`payout-service` (Die Auszahlung):**
    *   **Zweck:** Führt die finale Auszahlung durch.
    *   **Aufgaben:** Übernimmt Anträge mit dem Status `BUDGET_CONFIRMED`. Setzt den finalen Status auf `PAID` oder `PAYOUT_FAILED`.

### 3. Inter-Service-Kommunikation (Wichtiges Architekturelement)

**Die Kommunikation zwischen den Services soll ausschließlich über direkte, synchrone REST-API-Aufrufe erfolgen.** Es soll **kein Message Bus** (wie RabbitMQ oder Kafka) verwendet werden.

*   **Beispiel-Flow:** Wenn ein Antrag im `request-service` den Status `SUBMITTED` erreicht, ist es die Aufgabe eines Services, einen `POST`-Request an eine Ressource des `approval-service` zu senden. Dieser ruft nach seiner Bearbeitung wiederum den `budget-service` auf usw.
*   **Programmiermodell:** Obwohl das Kommunikationsmuster synchron ist (Anfrage-Antwort), soll die **Implementierung innerhalb jedes FastAPI-Services asynchron (`async def` / `await`)** erfolgen. Dies nutzt die Stärken von FastAPI für eine hohe Performance und vermeidet das Blockieren des Servers bei I/O-Operationen (wie z.B. dem Warten auf einen HTTP-Aufruf an einen anderen Service).

### 4. Aktueller Implementierungs-Status

Von der geplanten Architektur wurde bisher **nur der `request-service`** als funktionsfähiger FastAPI-Prototyp implementiert, zusammen mit dem Angular-Frontend, das dessen API konsumiert. Die Ordner für die anderen Services existieren, sind aber leer.

### 5. Genutzter Technologie-Stack

*   **Backend:** Python 3, FastAPI, Uvicorn, In-Memory-Liste als temporäre "Datenbank".
*   **Frontend:** Angular (Standalone), TypeScript, Node.js, npm, CSS.
*   **Version Control:** Git, GitHub.

### 6. Start-Anleitungen

*   **Backend (`request-service`):**
    1.  `cd backend/request-service`
    2.  `.\venv\Scripts\Activate.ps1` (oder `source venv/bin/activate`)
    3.  `uvicorn main:app --reload --port 3001 --host 0.0.0.0`

*   **Frontend:**
    1.  `cd frontend`
    2.  `ng serve --open`

### 7. Zukünftige Ziele & Abgabe-Anforderungen (Offene Punkte)

*   **Implementierung der fehlenden Services:** Die Logik für `approval-`, `budget-` und `payout-service` muss erstellt werden.
*   **Implementierung der REST-Inter-Service-Kommunikation:** Die Aufruf-Ketten zwischen den Services müssen implementiert werden.
*   **Persistente Datenbank:** Die In-Memory-Liste muss durch eine echte Datenbank (z.B. SQLite, PostgreSQL) ersetzt werden.
*   **HATEOAS:** Die API-Antworten sollen Links zu möglichen Folge-Aktionen enthalten.
*   **OAuth2:** Die API muss mit einem Login-System abgesichert werden.
*   **Kubernetes Deployments:** Die fertigen Services sollen in Docker-Container verpackt und für ein Deployment mit Kubernetes vorbereitet werden.
*   **`.gitignore`-Konfiguration:** Eine korrekt konfigurierte `.gitignore`-Datei ist essenziell und bereits vorhanden, um `node_modules`, `venv` und andere generierte Dateien von der Versionskontrolle auszuschließen.
*   **API-Dokumentation (Swagger):** FastAPI generiert automatisch eine interaktive Swagger-UI, die unter `http://localhost:3001/docs` verfügbar ist und als Dokumentation der API-Endpunkte dient.

### Setup & Start (Befehle)

**1. Code herunterladen**
git clone <URL_ZUM_GIT_REPOSITORY>
cd reise-spesen-planer

**2. Backend einrichten (Terminal 1)**
cd backend/request-service
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1 | macOS/Linux: source venv/bin/activate
pip install -r requirements.txt

**3. Frontend einrichten (Terminal 2)**
cd frontend
npm install

**4. Anwendung starten**
# Im Backend-Terminal (Terminal 1):
uvicorn main:app --reload --port 3001 --host 0.0.0.0

# Im Frontend-Terminal (Terminal 2):
ng serve --open



Notizen:
- packages in git Ignore
- Swagger Dokumentation für Endpunkte (bei FastAPI automatisch)
- Hatoas für alle API Endpunkte
- REST/ gRPC/ Kafka für Microservice Kommunikation möglichst alle 3 einbauen, mindestens 2 -> bis jetzt REST bei request-service
- RESTful
- oAuth2 für authentifizierung/ autorisierung
- Kubernetics Deployments mit Scaling/ Autoscaling werte sinnvoll wählen (begründbar)
- npm Module und andere lokale Dateien wie venv in Git Ignore (wichtig)
- Services Zustandslos
- echte Microservice struktur: eine Businesslogik, eine API und eine Datenbank pro Service
- Docker Images, Volumes
- Api Gateway -> auth. und autorisierung (idp) -> Server auch
- Kubernetes Control Plane auf eigenem Server
- Versionierung der npm modules
