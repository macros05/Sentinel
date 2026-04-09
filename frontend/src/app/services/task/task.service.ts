import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasks(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tasks/user/${userId}`);
  }

  createTask(userId: number, title: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks`, {
      user_id: userId,
      title: title,
      completed: false
    });
  }

  updateTaskStatus(taskId: number, completed: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${taskId}`, { completed });
  }
}
