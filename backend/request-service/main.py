# main.py
from fastapi import FastAPI, HTTPException, status # "status" importieren für 204
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Literal, Optional
from datetime import datetime

# --- 1. Definition der Datenmodelle ---

RequestStatus = Literal[
    'DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 
    'BUDGET_CONFIRMED', 'BUDGET_DENIED', 'PAID', 'PAYOUT_FAILED'
]

class CreateRequestDto(BaseModel):
    title: str
    employeeId: int
    projectId: str
    estimatedCost: float
    travelDate: datetime
    description: Optional[str] = None

# NEU: Ein Update-Modell. Es ist identisch zum Create-Modell,
# da PUT die gesamte Ressource erwartet.
class UpdateRequestDto(CreateRequestDto):
    pass

class Request(BaseModel):
    id: int
    status: RequestStatus
    title: str
    employeeId: int
    projectId: str
    estimatedCost: float
    travelDate: datetime
    description: Optional[str] = None
    submittedAt: Optional[datetime] = None


# --- 2. Erstellen der FastAPI-Anwendung ---
app = FastAPI()

# Eine Liste der Adressen, die auf unsere API zugreifen dürfen.
origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Erlaube die oben genannten Adressen
    allow_credentials=True,     # Erlaube Cookies (wird später wichtig)
    allow_methods=["*"],        # Erlaube alle Methoden (GET, POST, PUT, DELETE)
    allow_headers=["*"],        # Erlaube alle Header
)

# --- 3. Eine simple In-Memory-Datenbank ---
db: List[Request] = []
id_counter = 1


# --- 4. Definition der API-Endpunkte ---

@app.post("/requests", response_model=Request, status_code=status.HTTP_201_CREATED)
def create_request(request_dto: CreateRequestDto):
    """
    Erstellt einen neuen Spesenantrag im Status 'DRAFT'.
    """
    global id_counter
    new_request = Request(
        id=id_counter,
        status="DRAFT",
        **request_dto.dict()
    )
    db.append(new_request)
    id_counter += 1
    return new_request

@app.get("/requests", response_model=List[Request])
def get_all_requests():
    """
    Gibt alle erstellten Anträge zurück.
    """
    return db

# --- NEUER ENDPUNKT: GET /requests/{id} ---
@app.get("/requests/{request_id}", response_model=Request)
def get_request_by_id(request_id: int):
    """
    Ruft einen einzelnen Spesenantrag anhand seiner ID ab.
    """
    # Suche den Antrag in unserer "Datenbank"
    request = next((req for req in db if req.id == request_id), None)
    if request is None:
        # Wenn nicht gefunden, werfe einen 404-Fehler
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    return request

# --- NEUER ENDPUNKT: PUT /requests/{id} ---
@app.put("/requests/{request_id}", response_model=Request)
def update_request(request_id: int, request_dto: UpdateRequestDto):
    """
    Aktualisiert einen bestehenden Spesenantrag.
    PUT erwartet, dass alle Felder gesendet werden (kompletter Ersatz).
    """
    request_index = -1
    for i, req in enumerate(db):
        if req.id == request_id:
            request_index = i
            break

    if request_index == -1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

    # Erstelle das aktualisierte Objekt unter Beibehaltung der alten ID und des Status
    updated_request = Request(
        id=request_id,
        status=db[request_index].status, # Status bleibt beim Update erstmal gleich
        **request_dto.dict()
    )
    db[request_index] = updated_request
    return updated_request

# --- NEUER ENDPUNKT: DELETE /requests/{id} ---
@app.delete("/requests/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_request(request_id: int):
    """
    Löscht einen Spesenantrag anhand seiner ID.
    """
    global db
    original_len = len(db)
    # Erstelle eine neue Liste, die den zu löschenden Antrag nicht mehr enthält
    db = [req for req in db if req.id != request_id]

    if len(db) == original_len:
        # Wenn sich die Länge der Liste nicht geändert hat, wurde nichts gefunden
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    
    # Bei DELETE wird standardmäßig keine Antwort gesendet (204 No Content)
    return
