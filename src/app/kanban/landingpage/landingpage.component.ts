import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [MatCardModule, CdkDropListGroup, CdkDropList, CdkDrag, MatInputModule,
    MatFormFieldModule, FormsModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})

export class LandingpageComponent implements OnInit {

  constructor(private http: HttpClient) { }

  router = inject(Router);


  todo = [
    { id: null, title: 'Get to work' },
    { id: null, title: 'Pick up groceries' },
  ];

  done = [
    { id: null, title: 'Brush teeth' },
    { id: null, title: 'Take a shower' },
    { id: null, title: 'Check e-mail' },
  ];

  progress = [
    { id: null, title: 'read a book' },
    { id: null, title: 'Walking' }
  ];

  ngOnInit() {
    //this.loadTasks();
  }

  async loadTasks() {

    interface Task {
      id: number | null;
      title: string;
      status: string;
    }
  

    const token = localStorage.getItem('csrftoken');
    if (token) {
      this.http.get<Task[]>('http://localhost:8000/loadTasks/', {
        headers: { 'X-CSRFToken': token }
      })
      .subscribe(
        (response: any) => {
          console.log('Response:', response);
          this.todo = response.filter((task: Task) => task.status === 'todo');
          this.done = response.filter((task: Task) => task.status === 'done');
          this.progress = response.filter((task: Task) => task.status === 'progress');
        },
        error => {
          console.error('Error:', error.status, error.message, error.error);
        }
      );
    }
  }
  


  logout() {
    this.router.navigateByUrl('login')
  }

  addTask(taskInput: HTMLInputElement): void {
    const taskTitle = taskInput.value;
    const token = localStorage.getItem('csrftoken');
    if (taskTitle && token) {
      this.http.post('http://localhost:8000/tasks/',
        { title: taskTitle, status: 'todo' },
        {
          headers: { 'X-CSRFToken': token }
        }
      )
        .subscribe(
          (response: any) => {
            const newTask = { id: response.id, title: taskTitle };
            this.todo.push(newTask);
            console.log('Task created successfully', response);
          },
          error => {
            console.error('Error:', error.status, error.message, error.error);
          }
        );

      taskInput.value = '';
    }
  }


  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const newStatus = this.getStatus(event.container.element.nativeElement.id);


      const task = event.item.data;

      if (!task || !task.id) {
        console.error('Task oder Task-ID nicht definiert:', task);
        return;
      }

      this.http.put(`http://localhost:8000/tasks/${task.id}/`, { status: newStatus })
        .subscribe(
          response => console.log('Task updated successfully', response),
          error => console.error('Error updating task', error)
        );
    }
  }

  getStatus(containerId: string): string {
    switch (containerId) {
      case 'todolist':
        return 'todo';
      case 'progresslist':
        return 'progress';
      case 'donelist':
        return 'done';
      default:
        console.error('Unrecognized container ID:', containerId);
        return '';
    }
  }

  deleteTask(index: number, list: string) {
    let task;
    if (list === 'todo') {
      task = this.todo.splice(index, 1)[0];
    } else if (list === 'progress') {
      task = this.progress.splice(index, 1)[0];
    } else if (list === 'done') {
      task = this.done.splice(index, 1)[0];
    }

    if (task && task.id) {
      this.http.delete(`http://localhost:8000/tasks/${task.id}/delete/`)
        .subscribe(
          response => console.log('Task deleted successfully', response),
          error => console.error('Error deleting task', error)
        );
    }
  }





}


