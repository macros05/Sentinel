import { Component, OnInit} from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { TaskService } from '../../services/task/task.service';
import { FilterCompletedPipe } from '../../pipes/filter-completed/filter-completed-pipe';
@Component({
  selector: 'app-task-list',
  imports: [MaterialModule, FilterCompletedPipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit{

  tasks: any[] = [];
  newTaskTitle: string = '';
  userId: number = 0;

  private refreshInterval: any;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('user_id');
    if (storedId){
      this.userId = Number(storedId)
      this.loadTasks();
      this.refreshInterval = setInterval(() => {
        this.loadTasks();
      }, 1000);
    }
  }

  loadTasks() {
    this.taskService.getTasks(this.userId).subscribe(data => {
        this.tasks = data;
    });
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;

    this.taskService.createTask(this.userId, this.newTaskTitle).
    subscribe(newTask => {
      this.tasks = [newTask, ...this.tasks];
      this.newTaskTitle = '';
    })
  }

  toggleTask(task: any) {
    const newStatus = !task.completed;

    task.completed = newStatus;

    this.taskService.updateTaskStatus(task.id, newStatus).
    subscribe({
      error: () => {
        task.completed = !newStatus;
        alert("Error al actualizar la tarea")
      }
    })

    
  }
}
