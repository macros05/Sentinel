import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getTasks(userId: number): Observable<any[]>{
   return this.http.get<any[]>(
    `${this.apiUrl}/tasks/user/${userId}`,
    { headers: this.getAuthHeaders() }
   );
  }

  createTask(userId: number, title: string): Observable<any> {
    const body = {
      user_id : userId,
      title : title,
      completed: false
    };
    return this.http.post(
      `${this.apiUrl}/tasks`,
      body,
      { headers: this.getAuthHeaders()}
    )
  }

  updateTaskStatus(taskId: number, completed: boolean): Observable<any> {
    const body = { completed: completed};
    return this.http.put(
      `${this.apiUrl}/tasks/${taskId}`,
      body,
      { headers: this.getAuthHeaders()}
    )
  }
}
