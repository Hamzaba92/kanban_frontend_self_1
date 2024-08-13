import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [MatCardModule, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

  

  todo: string[] = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done: string[] = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  progress: string[] = ['Learning', 'Walking'];

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

}
