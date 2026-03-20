import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockedAppService } from '../../services/blocked-app/blocked-app';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-blocked-apps-list',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './blocked-apps-list.html',
  styleUrl: './blocked-apps-list.scss',
})
export class BlockedAppsList implements OnInit {
  
  apps: any[] = [];
  newAppName: string = '';
  userId: number = 0; 
  
  constructor(private blockedAppService: BlockedAppService) {}

  ngOnInit() {
    const storedId = localStorage.getItem('user_id');
    
    if (storedId) {
      this.userId = Number(storedId)
      this.loadApps();

    }
  }

  loadApps() {
    this.blockedAppService.getBlockedApps(this.userId).subscribe(data => {
      this.apps = data;
    });
  }

  addApp() {
    if (!this.newAppName.trim()) return;

    this.blockedAppService.addBlockedApp(this.userId, this.newAppName)
      .subscribe(newApp => {
        this.apps.push(newApp);
        this.newAppName = '';
      });
  }

  deleteApp(appId: number) {
    if (!confirm("¿Seguro que quieres desbloquear esta app?")) return;

    this.blockedAppService.deleteBlockedApp(appId).subscribe(() => {
      this.apps = this.apps.filter(app => app.id !== appId);
    });
  }
}