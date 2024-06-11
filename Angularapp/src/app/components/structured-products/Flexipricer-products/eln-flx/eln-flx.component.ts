import { Component, Input, OnInit } from '@angular/core';
import { EqcApifunctionService } from '../../Services/eqc-apifunction.service';
import { EqcCommonfunctionsService } from '../../Services/eqc-commonfunctions.service';

@Component({
  selector: 'app-eln-flx',
  templateUrl: './eln-flx.component.html',
  styleUrls: ['./eln-flx.component.scss'],
})
export class ElnFlxComponent implements OnInit {
  @Input() RequestMode: any;
  ReceivedCCY: any;
  CCY = [];
  SolveForvalue: any;
  Strike: any;
  IBPrice: any;
  ErrorMsg: any;
  constructor(private EQC_afs: EqcApifunctionService, public EQC_cfs: EqcCommonfunctionsService) {}

  ngOnInit(): void {
    this.SolveForvalue = 'StrikePercentage';
    this.ReceivedCCY = this.EQC_afs.loadCurrency();
    try {
      this.ReceivedCCY.forEach((element) => {
        const ccyData = element.Ccy;
        this.CCY.push(ccyData);
      });
    } catch (error) {}
  }

  setSolveFor() {
    // try {
    //   this.reset();
    //   this.calculateIBPrice();
    //   const target = this.EQC_cfs.GetEventTarget(e);
    //   this.SolveFor = target.value;
    //   //console.log('change: ' + target.value);
    //   if (this.SolveForvalue === 'PricePercentage') {
    //     this.ClientYield = '0.00';
    //     this.Strike = '98.50';
    //     // this.upfront = '0.00';
    //     this.IBPrice = '0.00';
    //   } else {
    //     this.ClientYield = '5.00';
    //     this.Strike = '0.00';
    //     this.upfront = '0.50';
    //     this.calculateIBPrice();
    //   }
    // } catch (error) {
    //   //console.log("Error:", error);
    // }
  }

  
  priceValidation(priceValue: any, pricestr: string) {
    try {
      if (
        priceValue === '' ||
        parseFloat(priceValue) <= 0 ||
        parseFloat(priceValue) >= 100
      ) {
        this.ErrorMsg = pricestr + ' should be greater than 0 and less than 100';
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  reset() {
    try {
      // this.timeLeft = 0;
      // clearInterval(this.interval);
      // this.EQC_cfs.setReceivedPrices({});

      // this.clearFlag = true;
      // this.PPDetails = '';
      // this.sortedAllPrices = [];
      // this.lpArr = [];
      // this.AllPrices = [];
      // this.orderID = '';
      // this.loadflag = false;
      // this.orderflag = false;
      // this.ErrorMsg = '';
      // this.accordflag = false;
      // this.bookOrderFlag = false;
      // this.lblOrderBlotter = '+ Order Blotter';
      // this.lblOrderDetail = '+ Order Details';
      // this.tblAllocation = [];
      // this.tblAllocation.push('');
      // this.allocatedNotional = '0.00';
      // this.remainingNotional = parseFloat(
      //   this.Notional.toString().replace(/,/g, '')
      // ).toFixed(2);
      // this.totalNotional = parseFloat(
      //   this.Notional.toString().replace(/,/g, '')
      // ).toFixed(2);
      // this.priceFlag = true;
      // this.blotterFlag = false;
      // // this.ValueChanged();
      // if (this.SolveForvalue === 'PricePercentage') {
      //   this.IBPrice = '0.00';
      // } else {
      //   this.Strike = '0.00';
      // }
      // return false;
    } catch (error) {
      //console.log("Error:", error);
    }
  }

}
