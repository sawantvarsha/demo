import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-margin-details',
  templateUrl: './margin-details.component.html',
  styleUrls: ['./margin-details.component.scss']
})
export class MarginDetailsComponent  {

  @Input() id: number;
  @Input() groupId: string;

  constructor() { }

  

}
