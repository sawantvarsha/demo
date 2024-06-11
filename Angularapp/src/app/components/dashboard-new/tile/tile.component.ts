import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ApifunctionsService } from '../services/apifunctions.service';

// const $ = require('jquery')

@Component({
  selector: 'app-tile-new',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileNewComponent implements OnInit {

  @Input() card: any;
  @Input() svg: any;
  @Input() Status: any;
  @Input() productsChartData:any;
  @Input() underlyingsChartData:any;
  @Input() tenorsChartData:any;
  @Input() CardList:any;
  @Input() selectedSegment: any;
  @Input() hiddenCards:any = [];
  @Output() showCardEvent = new EventEmitter;
  @Output() closeCardEvent = new EventEmitter;
  

  width = document.documentElement.clientWidth;
  height = document.documentElement.clientWidth;
  

  constructor() { }

  ngOnInit(): void {
    
  }
  CloseCard(){
    console.log("Card Status",this.card.Status);
    
    this.card.Status=! this.card.Status;

  }

  showCard(event:any){
    console.log("show card", event);
    this.showCardEvent.emit(event);
    // this.cardPopped.emit(card);
  }

  closeCard(card:any){
    console.log('close ', card);
    this.closeCardEvent.emit(card);
    
  }

  updateHiddenCard(event:any){
    this.hiddenCards = event
  }
  
  

}
