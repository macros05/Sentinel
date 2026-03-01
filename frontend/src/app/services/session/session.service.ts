import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SessionService {

  private apiUrl = environment.apiUrl;

  constructor(private http:HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token')
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

    startSession(durationMinutes: number, userId: number): Observable <any> {
      const body = {
        user_id: userId,
        duration_minutes: durationMinutes
      };
      return this.http.post(
        `${this.apiUrl}/sessions/start`,
        body,
        { headers: this.getAuthHeaders()}
      );
    }

    completeSession(sessionId: number): Observable <any> {
      return this.http.post(
        `${this.apiUrl}/sessions/complete/${sessionId}`,
        {},
        { headers: this.getAuthHeaders()}
      );
    }
  }

