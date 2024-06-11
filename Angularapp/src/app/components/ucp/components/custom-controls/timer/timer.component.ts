import { Component, Input, OnInit } from '@angular/core';
import {CoreModule} from '../../../../../core/core.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  counter: number;
  @Input() countNum: any;
  className: string = 'blue';

  constructor() {  }

  ngOnInit(): void {
    try{
      if (this.countNum) {
        this.startTimer();
      }
      console.log("TIMER Count:.............", this.countNum);
    }
    catch(e){
      console.log("Error in ngOnInit :", e)
    }
  }

  ngOnChanges() {
    try{
      if (this.countNum) {
        console.log("TIMER Count:.............", this.countNum);
        this.startTimer();
      }
    }
    catch(e){
      console.log("Error in ngOnChanges :", e)
    }
  }

  startTimer(): void {
    try{
      this.counter = this.countNum;
      let interval = setInterval(() => {
        if (this.counter > 0) {
          this.counter--;
          this.className = (this.counter < 6) ? 'red' : (this.counter < 10) ? 'orange' : (this.counter < 20) ? 'green' : 'blue';
        }
      }, 1000);
    }
    catch(e){
      console.log("Error in startTimer :", e)
    }
  }
  
}
