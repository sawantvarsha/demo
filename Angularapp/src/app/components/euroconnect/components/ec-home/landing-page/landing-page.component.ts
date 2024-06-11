// Changes added by Mayuri D. on 05-July-2022.


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor() { }
  expanded = false;

  successMsg: string;
  ErrorMsg: string;
  previousOptionsID: string = '';
  previoussubOptionsID: string = '';

  ngOnInit(): void {
  }

  emptyLabels() {
    this.successMsg = '';
    this.ErrorMsg = '';
    if (document.getElementById(this.previousOptionsID)) {
      var previous = document.getElementById(this.previousOptionsID)
      if (previous.style.display == "block") {
        previous.style.display = "none";
      }
    }
    if (document.getElementById(this.previoussubOptionsID)) {
      var previoussubOptions = document.getElementById(this.previoussubOptionsID)
      if (previoussubOptions.style.display == "block") {
        previoussubOptions.style.display = "none";
      }
    }
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    // if (this.expanded === true) {
    //   this.hideOnExpand = false;
    // } else {
    //   this.hideOnExpand = true;
    // }
    // //console.log(this.expanded);
  }

  
}
