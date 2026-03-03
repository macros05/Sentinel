import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


  login (credentials: any): Observable<any> {

    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    return this.http.post(`${this.apiUrl}/auth/login`, formData);
  }

  register(data: { email: string, password: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/auth/register`, data);
}
}
