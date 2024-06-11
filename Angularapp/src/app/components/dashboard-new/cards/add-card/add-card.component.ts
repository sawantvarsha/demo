import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {
  @Output() showCard = new EventEmitter;
  selectedCard : any = "";
  @Input() hiddenCards = [];
  @Output() hiddenCardsChanged = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
    console.log();
    
  }

  addCard(){
    this.hiddenCards = this.hiddenCards.filter(ele=>{return ele!==this.selectedCard})
    console.log("add card ", this.selectedCard, this.hiddenCards);
    
    this.showCard.emit(this.selectedCard);
    this.hiddenCardsChanged.emit(this.hiddenCards);
  }

}
