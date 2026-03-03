import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {

  showRegister = false;

  credentials = { email: '', password: '' };

  registerData = { email: '', password: '', confirmPassword: '' };

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleForm() {
    this.showRegister = !this.showRegister;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLogin() {
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user_id', response.user_id.toString());
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Email o contraseña incorrectos';
      }
    });
  }

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.registerData.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.authService.register({
      email: this.registerData.email,
      password: this.registerData.password
    }).subscribe({
      next: () => {
        this.successMessage = '¡Cuenta creada! Ya puedes iniciar sesión.';
        this.registerData = { email: '', password: '', confirmPassword: '' };
        setTimeout(() => this.toggleForm(), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.detail === 'Email already registered'
          ? 'Este email ya está registrado'
          : 'Error al crear la cuenta';
      }
    });
  }
}