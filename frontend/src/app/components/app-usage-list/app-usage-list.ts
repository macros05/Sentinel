import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUsage } from '../../services/app-usage/app-usage';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-usage-list',
  imports: [CommonModule, MaterialModule],
  templateUrl: './app-usage-list.html',
  styleUrl: './app-usage-list.scss',
})
export class AppUsageList implements OnInit, OnDestroy {

  usageList: any[] = [];
  user_id: number = 0;
  private refreshInterval: any;

  constructor(private usageService: AppUsage) {}

  ngOnInit() {
    const storedId = localStorage.getItem('user_id');
    if (storedId) {
      this.user_id = Number(storedId);
      this.loadUsage();
      this.refreshInterval = setInterval(() => {
        this.loadUsage();
      }, 5000);
    }
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadUsage() {
    this.usageService.getUsageHistory(this.user_id).subscribe(data => {
      const todayStr = new Date().toISOString().split('T')[0]; 
      
      this.usageList = data.filter(item => item.date === todayStr);
      
      this.usageList.sort((a, b) => b.total_seconds - a.total_seconds);
    });
  }

  formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${seconds % 60}s`; 
  }
}
