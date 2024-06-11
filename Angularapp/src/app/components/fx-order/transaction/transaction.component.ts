import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonfunctionService } from '../commonfunction.service';
import { ApifunctionService } from '../apifunction.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent implements OnInit, OnDestroy {
  show = 'blotter';
  commonfunction: CommonfunctionService;
  apifunction: ApifunctionService;
  newtransaction: boolean;
  blotter: boolean;
  maturing: boolean;
  newTradeFlagSub: Subscription;
  newTradeFlag: boolean = false;
  constructor(
    commonfunct: CommonfunctionService,
    apifunct: ApifunctionService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.commonfunction = commonfunct;
    this.apifunction = apifunct;
    this.newtransaction = false;
    this.blotter = true;
    this.maturing = false;
    this.newTradeFlag = false;
  }

  ngOnDestroy() {
    this.newTradeFlagSub.unsubscribe();
    this.newTradeFlag = false;
    this.commonfunction.newTradeFlagBS.next(false);
  }
  ngOnInit() {
    // this.newTradeFlag = false;
    // this.blotter = true;
    this.route.params.subscribe((params) => {
      if (Number(params.mode) === 0) {
        this.newTradeFlag = true;
        this.changeProduct('newtransaction');
        this.blotter = false;
      } else {
        this.newTradeFlag = false;
        this.blotter = true;
      }
    });
    this.commonfunction.showobservar.subscribe((show) => {
      if (show === 'newtransaction') {
        this.show = 'newtransaction';
      }
    });

    // this.commonfunction.NewTrade();
    this.newTradeFlagSub = this.commonfunction.newTradeFlagObs.subscribe(
      (tradeFlag) => {
        //
        if (tradeFlag === true) {
          //console.log('tradeFlag',tradeFlag);
          this.newTradeFlag = true;
          // this.newtransaction = true;
          this.changeProduct('newtransaction');
          this.blotter = false;
          // this.changeProduct('newtransaction');
        } else {
          this.newTradeFlag = false;
          this.blotter = true;
        }
      }
    );
  }

  loadBlotter() {
    //this.apifunction.getSandFBlotterDetails(date,date);
  }

  changeProduct(choice) {
    this.newtransaction = false;
    this.blotter = false;
    this.maturing = false;

    switch (choice) {
      case 'newtransaction':
        this.newtransaction = true;
        break;
      case 'blotter':
        this.blotter = true;
        break;
      case 'maturing':
        this.maturing = true;
        break;

      default:
        // this.blotter = true;
        break;
    }
  }
  back() {
    try {
      this.router.navigateByUrl('dashboardFx/1');
    } catch (ex) {
      console.log(ex);
    }
  }
}
