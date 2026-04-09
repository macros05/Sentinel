import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlockedAppService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBlockedApps(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/blocked-apps/user/${userId}`);
  }

  addBlockedApp(userId: number, appName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/blocked-apps`, {
      user_id: userId,
      app_name: appName,
      limit_seconds: 3600
    });
  }

  deleteBlockedApp(appId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/blocked-apps/${appId}`);
  }
}