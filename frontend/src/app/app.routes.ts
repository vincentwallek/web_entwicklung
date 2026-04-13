// frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';

// Wir importieren die Komponenten, die als "Bühnenbilder" dienen sollen
import { DashboardComponent } from './components/dashboard/dashboard';
import { RequestFormComponent } from './components/request-form/request-form';

export const routes: Routes = [
    // --- REGEL 1: Die Startseite ---
    // Wenn der Benutzer zur Haupt-URL geht (z.B. http://localhost:4200),
    // leite ihn sofort weiter zur '/dashboard'-Route.
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    
    // --- REGEL 2: Das Dashboard ---
    // Wenn die URL '/dashboard' lautet, lade die DashboardComponent
    // auf die <router-outlet>-Bühne.
    { path: 'dashboard', component: DashboardComponent },
    
    // --- REGEL 3: Das Formular ---
    // Wenn die URL '/create-request' lautet, lade die RequestFormComponent
    // auf die <router-outlet>-Bühne.
    { path: 'create-request', component: RequestFormComponent },
    
    // Hier könnten später weitere Routen hin, z.B. für eine Login-Seite
];
