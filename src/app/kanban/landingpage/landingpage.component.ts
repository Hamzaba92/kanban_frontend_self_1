import { Component } from '@angular/core';
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

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [MatCardModule, CdkDropListGroup, CdkDropList, CdkDrag, MatInputModule,
     MatFormFieldModule, FormsModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

  todo: string[] = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done: string[] = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  progress: string[] = ['Learning', 'Walking'];

  addTask(taskInput: HTMLInputElement): void {
    const task = taskInput.value;
    if (task) {
      this.todo.push(task);
      taskInput.value = '';
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  deleteTask(index:number, list:string){
    if (list === 'todo'){
      this.todo.splice(index, 1);
    } else if (list === 'progress'){
      this.todo.splice(index, 1);
    } else if(list === 'done'){
      this.done.splice(index, 1);
    }

    }



  }


