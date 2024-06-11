import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FxOrderAbnService } from 'src/app/services/fx-order-abn.service';

@Component({
  selector: 'app-fx-transactions-abn',
  templateUrl: './fx-transactions-abn.component.html',
  styleUrls: ['./fx-transactions-abn.component.scss']
})
export class FxTransactionsAbnComponent implements OnInit {

  orderId: any;
  message: any;
  constructor(public activatedRoute: ActivatedRoute, public fxABNService: FxOrderAbnService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(res => {
      this.orderId = res.orderid
      this.fxABNService.getOrderDetails(this.orderId).subscribe(orderdet => {
        console.log('Order Details', orderdet);
      })
    })
  }

}
