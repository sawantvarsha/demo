import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {

  @Input() card: any;

  width = document.documentElement.clientWidth;
  height = document.documentElement.clientWidth;


  constructor() { }

  ngOnInit(): void {
  }

}
