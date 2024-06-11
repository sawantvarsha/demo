import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-icons',
  templateUrl: './svg-icons.component.html',
  styleUrls: ['./svg-icons.component.scss']
})
export class SvgIconsComponent implements OnInit {

  constructor() { }
  @Input() icon: string;
  @Input() width: string;
  @Input() height: string;
  @Input() active: boolean;
  @Input() fill: string;

  ngOnInit(): void {
    console.log("icon" , this.icon)
    // this.icon = "Accumulator"
  }

}
