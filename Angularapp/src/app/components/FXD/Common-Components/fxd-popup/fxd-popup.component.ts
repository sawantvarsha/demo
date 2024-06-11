import { Component, OnInit , Input,Output,EventEmitter,OnDestroy } from '@angular/core';
import { FxdCommonfunctionsService } from '../../services/fxd-commonfunctions.service';

@Component({
  selector: 'app-fxd-popup',
  templateUrl: './fxd-popup.component.html',
  styleUrls: ['./fxd-popup.component.scss', '../../products/aqdq/aqdq.component.scss'] //Urmila A | 11-Sep-23
})
export class FxdPopupComponent implements OnInit, OnDestroy  {

  @Input() DCDRfqId:any;
  @Input() SaveTradeOpen:boolean;
  @Input() OrderPlacedPopup:boolean;
  @Input() orderMsg:any;
  @Input() DealNo:any;
  @Input() Orderplace:any;
  @Input() EmailQuote:any;
  @Input() LockedDealPopUp:any;
  @Input() RFQLockedBy:any;
  @Input() AllDataLoaded:any;
  @Input() routeToDealerClicked:boolean;
  @Input() confirmedRouteDealer:boolean;
  @Input() RouteToDealerExecuted:boolean;
  @Input() RejectRedirectedOrder:boolean;
  @Input() RejectedOrderMSG:any;
  @Input() priceLoader:boolean;
  @Output() RouteToDealer = new EventEmitter<any>();
  @Output() cancelPrice = new EventEmitter<any>();

  constructor(public FXD_cfs:FxdCommonfunctionsService) { }

  ngOnInit(): void {

    console.log('AllDataLoaded',this.AllDataLoaded)

  }


  ngOnDestroy(){
    // this.FXD_cfs.saveTradeDone=false;
    this.AllDataLoaded=undefined;
    this.FXD_cfs.fxdpopupOpenClose=false; //  HSBCPBIN-528 | Chaitanya M | 03 Aug 2023
  }


  closePop(){
    this.FXD_cfs.fxdpopupOpenClose=false;
    this.FXD_cfs.LockedDealPopUp=false
    this.LockedDealPopUp=false;
    this.OrderPlacedPopup=false;
    this.EmailQuote=false;
    this.SaveTradeOpen=false;
    this.routeToDealerClicked=false;
    this.RejectRedirectedOrder=false
    this.RejectedOrderMSG=''
    this.priceLoader=false
  }

  fnConfirmRouteToDealer(){
    this.FXD_cfs.fxdpopupOpenClose=false;
    this.RouteToDealer.emit();
  }

  CancelPricing(){
    this.priceLoader=false
    this.cancelPrice.emit()
  }
}
