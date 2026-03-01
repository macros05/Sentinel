import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { response } from 'express';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-login',
  imports: [MaterialModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {

  credentials = {
    email: '',
    password: ''
  }

  errorMessage = ''

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.errorMessage = '',

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login Exitoso!', response);

        localStorage.setItem('token', response.access_token);
        if (response.user_id) {
            localStorage.setItem('user_id', response.user_id.toString());
        }

        console.log('Navegando al dashboard...'); 
      
        this.router.navigate(['/dashboard']);
        localStorage.setItem('user_id', response.user_id.toString());

        this.router.navigate(['/dashboard']);
        
      }, 
      error: (error) => {
        console.error('Error de login', error),
        this.errorMessage = 'Email o contraseña incorrectos'
      }
    })
  }
}
