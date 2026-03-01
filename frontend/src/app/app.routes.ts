import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login'
import { DashboardComponent } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
{ path: '', redirectTo: 'login', pathMatch: 'full' },
    
    { 
        path: 'login', 
        component: LoginComponent,
        canActivate: [guestGuard] 
    },
    
    { 
        path: 'dashboard', 
        component: DashboardComponent,

        canActivate: [authGuard] 
    }
]