import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { TaskService } from '../../services/task/task.service';
import { FilterCompletedPipe } from '../../pipes/filter-completed/filter-completed-pipe';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule, MaterialModule, FilterCompletedPipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit, OnDestroy {

  tasks: any[] = [];
  newTaskTitle: string = '';
  userId: number = 0;
  private pendingToggleIds = new Set<number>();

  private refreshInterval: any;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('user_id');
    if (storedId) {
      this.userId = Number(storedId);
      this.loadTasks();
      this.refreshInterval = setInterval(() => {
        this.loadTasks();
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadTasks() {
    this.taskService.getTasks(this.userId).subscribe(data => {
      this.tasks = data.map(serverTask => {
        if (this.pendingToggleIds.has(serverTask.id)) {
          const local = this.tasks.find(t => t.id === serverTask.id);
          return local ?? serverTask;
        }
        return serverTask;
      });
    });
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;

    this.taskService.createTask(this.userId, this.newTaskTitle).
    subscribe(newTask => {
      this.tasks = [newTask, ...this.tasks];
      this.newTaskTitle = '';
    });
  }

  toggleTask(task: any) {
    const newStatus = !task.completed;
    task.completed = newStatus;
    this.pendingToggleIds.add(task.id);

    this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
      next: () => {
        this.pendingToggleIds.delete(task.id);
      },
      error: () => {
        task.completed = !newStatus;
        this.pendingToggleIds.delete(task.id);
        alert("Error al actualizar la tarea");
      }
    });
  }
}
