import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  startSession(durationMinutes: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/sessions/start`, {
      user_id: userId,
      duration_minutes: durationMinutes
    });
  }

  completeSession(sessionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/sessions/complete/${sessionId}`, {});
  }
}

