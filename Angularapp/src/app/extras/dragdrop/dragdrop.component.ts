import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dragdrop',
  templateUrl: './dragdrop.component.html',
  styleUrls: ['./dragdrop.component.scss']
})
export class DragdropComponent  {
  timePeriods = [
    {
      height: '300px',
      width: '400px',
      value: 'Box 1'
    },
    {
      height: '500px',
      width: '400px',
      value: 'Box 2'
    },
    {
      height: '400px',
      width: '400px',
      value: 'Box 3'
    },
    {
      height: '100px',
      width: '400px',
      value: 'Box 4'
    },
    {
      height: '400px',
      width: '200px',
      value: 'Box 5'
    }
  ];
  constructor() {

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
    // console.log(this.timePeriods);
  }

}
