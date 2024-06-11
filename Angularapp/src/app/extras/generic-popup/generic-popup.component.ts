import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-generic-popup',
  templateUrl: './generic-popup.component.html',
  styleUrls: ['./generic-popup.component.scss']
})
export class GenericPopupComponent implements OnInit, AfterViewInit {

  @Input("title") _title: string = "";
  @Input("message") _message: string = "";
  @Input() _button1: any = null;
  @Input() _button2: any = null;
  @Input("overlay") _overlay: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
  }

}
