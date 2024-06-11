import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-icons',
  templateUrl: './svg-icons.component.html',
  styleUrls: ['./svg-icons.component.scss']
})
export class SvgIconsComponent  {

  @Input() icon: string;
  @Input() width: string;
  @Input() height: string;
  @Input() active: boolean;
  @Input() fill: string;

  constructor() { }

}
