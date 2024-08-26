import { Component, OnInit } from '@angular/core';
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
import { firstValueFrom } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';


interface Task {
  id?: number | null;
  title: string;
  status?: string;
  assigned_to?: {
    id: number;
    first_name: string;
    last_name: string;
  } | null;
}

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [MatCardModule, CdkDropListGroup, CdkDropList, CdkDrag, MatInputModule,
    MatFormFieldModule, FormsModule, MatButtonModule, MatIconModule, CommonModule, MatSelectModule, MatOptionModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})




export class LandingpageComponent implements OnInit {

  constructor(private http: HttpClient) { }

  router = inject(Router);

  userData: { first_name: string; last_name: string } | null = null;

  users: any[] = []; 
  selectedUserId: number | null = null;  


  todo: Task[] = [
    { id: null, title: 'Get to work', assigned_to: null },
    { id: null, title: 'Pick up groceries', assigned_to: null },
  ];

  done: Task[] = [
    { id: null, title: 'Brush teeth', assigned_to: null },
    { id: null, title: 'Take a shower', assigned_to: null },
    { id: null, title: 'Check e-mail', assigned_to: null }
  ];

  progress: Task[] = [
    { id: null, title: 'read a book', assigned_to: null },
    { id: null, title: 'Walking', assigned_to: null }
  ];

  getCookieValue(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  ngOnInit() {
    const isLoggedIn = this.getCookieValue('csrftoken') !== null;

    if (isLoggedIn) {
      this.loadUserTasks();
      this.fetchFirstnameAndLastname();
      this.loadUsers();
    } else {
      console.error('User is not logged in. Skipping initialization.');
    }
  }

  async loadUserTasks() {
    const token = this.getCookieValue('csrftoken');
    if (token) {
      this.http.get<any[]>('http://localhost:8000/loadTasks/', {
        headers: { 'X-CSRFToken': token },
        withCredentials: true
      })
        .subscribe(
          (response: any[]) => {
            if (response && Array.isArray(response)) {
              this.todo = response.filter((task: any) => task.status === 'todo');
              this.done = response.filter((task: any) => task.status === 'done');
              this.progress = response.filter((task: any) => task.status === 'progress');

            } else {
              console.error('Unexpected response format:', response);
            }
          },
          error => {
            console.error('Error:', error.status, error.message, error.error);
          }
        );
    } else {
      console.error('CSRF token is missing.');
    }
  }

  loadUsers() {
    const token = this.getCookieValue('csrftoken');
    if (token) {
      this.http.get<any[]>('http://localhost:8000/api/users/', {
        headers: { 'X-CSRFToken': token },
        withCredentials: true
      })
        .subscribe(
          (response: any[]) => {
            this.users = response; 
          },
          error => {
            console.error('Error loading users:', error.status, error.message, error.error);
          }
        );
    } else {
      console.error('CSRF token is missing.');
    }
  }

  logout() {
    const deleteCookie = () => {
      document.cookie = 'csrftoken=; Max-Age=0; path=/; domain=localhost;';
      document.cookie = 'csrftoken=; Max-Age=0; path=/; domain=;';
      document.cookie = 'csrftoken=; Max-Age=0; path=/;';
      document.cookie = 'csrftoken=; Max-Age=0;';
    };
  
    deleteCookie();
    
    this.router.navigateByUrl('login').then(() => {
      window.location.reload();
    });
  }
  
  
  
  
  
  

  addTask(taskInput: HTMLInputElement, assignedUserId: number | null): void {
    const taskTitle = taskInput.value;
    const csrftoken = this.getCookieValue('csrftoken');

    if (taskTitle && csrftoken) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      });

      const taskData = {
        title: taskTitle,
        status: 'todo',
        assigned_to: assignedUserId,
      };

      this.http.post<{ id: number }>('http://localhost:8000/tasks/', taskData, { headers: headers, withCredentials: true })
        .subscribe(
          (response: {id: number}) => {

            const assignedUser = this.users.find(user => user.id === assignedUserId);

            const newTask: Task = {
              id: response.id,
              title: taskTitle,
              status: 'todo',
              assigned_to: assignedUser 
            };

            this.todo.push(newTask);
            console.log('Task created successfully', response);
          },
          (error: any) => {
            console.error('Error:', error.status, error.message, error.error);
          }
        );

      taskInput.value = '';
      this.selectedUserId = null; 
    } else {
      console.error('CSRF token is missing or user is not authenticated.');
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

  async fetchFirstnameAndLastname() {
    const csrfToken = this.getCookieValue('csrftoken') ?? ''; 
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    try {
      const response = await firstValueFrom(
        this.http.get<{ first_name: string; last_name: string }>('http://localhost:8000/api/getusername/', { headers, withCredentials: true })
      );
      this.userData = response;
    } catch (error) {
      console.error('Error fetching firstname & lastname', error);
    }
  }
  
  

}


