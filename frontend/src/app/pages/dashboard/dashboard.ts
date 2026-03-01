import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Added HttpClient import

import { SessionService } from '../../services/session/session.service';
import { BlockedAppService } from '../../services/blocked-app/blocked-app';

import { AppUsageList } from '../../components/app-usage-list/app-usage-list';
import { BlockedAppsList } from '../../components/blocked-apps-list/blocked-apps-list';
import { MaterialModule } from '../../material/material.module';
import { TaskList } from '../../components/task-list/task-list';

import { NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule, BlockedAppsList, AppUsageList, TaskList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnDestroy, OnInit {

  WORK_MINUTES = 25;

  timeLeft: number = this.WORK_MINUTES * 60;
  isRunning: boolean = false;
  timerInterval: any;
  isWatcherRunning: boolean = false;
  
  currentSessionId: number | null = null;
  user_id: number = 0;

  apps: any[] = [];
  private refreshInterval: any;
  endTime: number = 0;

  // Added the API URL needed for the toggleWatcher function
  private apiUrl = "http://127.0.0.1:8000";

  constructor(
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef,
    private blockedAppService: BlockedAppService,
    private ngZone: NgZone,
    private http: HttpClient,
    private router: Router
  ) {
  }
ngOnInit(): void {
  const storedId = localStorage.getItem('user_id');
  if (storedId) {
    this.user_id = Number(storedId);
    
    this.ngZone.run(() => {
      this.loadDashboardData();
    });

    this.ngZone.runOutsideAngular(() => {
      this.refreshInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.loadDashboardData();
        });
      }, 5000); 
    });
  }
}

  loadDashboardData() {
  this.blockedAppService.getBlockedApps(this.user_id).subscribe(data => {
    this.ngZone.run(() => { 
      this.apps = data;
    });
  });
}

  get formatTime(): string {
    const minutes: number = Math.floor(this.timeLeft / 60);
    const seconds: number = this.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  setDuration(minutes: number) {
    if (this.isRunning) {
      this.pauseTimer();
    }
    this.WORK_MINUTES = minutes;

    this.timeLeft = 60 * minutes;

    this.currentSessionId = null
  } 

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.isRunning) return;

    this.endTime = Date.now() + (this.timeLeft * 1000);
     
    if (!this.currentSessionId) {
      this.sessionService.startSession(this.WORK_MINUTES, this.user_id)
        .subscribe(session => {
          this.currentSessionId = session.id;
          this.runClock();
        });
    } else {
      this.runClock();
    }
  }

  runClock() {
    this.isRunning = true;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() =>{
      const now = Date.now();
      const diffBytes = this.endTime - now;
      const remainingSeconds = Math.ceil(diffBytes/1000);
      this.timeLeft = remainingSeconds;

      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.finishSession();
      }
      this.cdr.detectChanges();

    }, 200);
  }

  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
  }

  finishSession() {
    this.pauseTimer();
    if (this.currentSessionId) {
      this.sessionService.completeSession(this.currentSessionId)
        .subscribe(() => {
          alert("¡Felicidades! Has completado una sesión de enfoque 🌲");
          this.resetTimer();
        });
    }
  }

  resetTimer() {
    this.pauseTimer();
    this.timeLeft = this.WORK_MINUTES * 60;
    this.currentSessionId = null;
    this.isRunning = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
toggleWatcher() {
    const token = localStorage.getItem('token'); 
    const userId = localStorage.getItem('user_id'); 

    if (!token || !userId) {
      alert("Error: Missing credentials. Please log in again.");
      return;
    }

    const action = this.isWatcherRunning ? 'stop' : 'start';
    const payload = { action: action, token: token, user_id: userId };

    this.http.post(`${this.apiUrl}/watcher/toggle`, payload).subscribe({
      next: (res: any) => {
        this.isWatcherRunning = (res.status === 'started');
        console.log(`Watcher ${res.status}`);
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Error with the Watcher", err);
        alert("Failed to connect to the Watcher backend.");
      }
    });
  }

logout() {
    if (this.isWatcherRunning) {
      this.http.post(`${this.apiUrl}/watcher/toggle`, { action: 'stop' }).subscribe();
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user_id');

    this.router.navigate(['/login']);
  }
}