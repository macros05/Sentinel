import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppUsage {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getUsageHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/usage/user/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}