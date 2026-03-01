import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlockedAppService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getBlockedApps(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/blocked-apps/user/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  addBlockedApp(userId: number, appName: string): Observable<any> {
    const body = {
      user_id: userId,      
      app_name: appName,
      limit_seconds: 3600   
    };
    return this.http.post(
      `${this.apiUrl}/blocked-apps`,
      body,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteBlockedApp(appId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/blocked-apps/${appId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}