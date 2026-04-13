import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RequestService, CreateRequestDto } from '../../services/request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './request-form.html',
  styleUrls: ['./request-form.css']
})
export class RequestFormComponent {
  
  // Wir binden das Formular an ein Objekt, das unserem DTO entspricht
  newRequest: Partial<CreateRequestDto> = {
    title: '',
    projectId: '',
    estimatedCost: undefined
  };

  constructor(private requestService: RequestService, private router: Router) {}

  submitRequest(): void {
    // Validierung, um sicherzustellen, dass alle Felder ausgefüllt sind
    if (this.newRequest.title && this.newRequest.projectId && this.newRequest.estimatedCost && this.newRequest.travelDate) {
      
      // Wir erstellen ein vollständiges DTO-Objekt
      const requestData: CreateRequestDto = {
        title: this.newRequest.title,
        projectId: this.newRequest.projectId,
        estimatedCost: this.newRequest.estimatedCost,
        travelDate: this.newRequest.travelDate,
        employeeId: 101, // Platzhalter, kommt später vom Login
      };

      this.requestService.addRequest(requestData)
        .subscribe(() => {
          // Nach erfolgreichem Erstellen zurück zum Dashboard
          this.router.navigate(['/dashboard']);
        });
    } else {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.');
    }
  }
}
