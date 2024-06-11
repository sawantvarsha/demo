import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Aq } from '../../Models/aq.model';
import { EqcApifunctionService } from '../../Services/eqc-apifunction.service';
import { EqcCommonfunctionsService } from '../../Services/eqc-commonfunctions.service';

@Component({
  selector: 'app-aq',
  templateUrl: './aq.component.html',
  styleUrls: ['./aq.component.scss']
})
export class AqComponent implements OnInit, OnDestroy {

  @Input() ViewMode: string;

  aqModel: Aq;
  LoadingPrices: boolean = false;
  AccumPricingSubscription: Subscription;
  LoopAccumPricingSubscribe: Subscription;


  constructor(public EQC_cfs: EqcCommonfunctionsService, public EQC_afs: EqcApifunctionService) {
    this.aqModel = new Aq();
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    if (this.AccumPricingSubscription) this.AccumPricingSubscription.unsubscribe();
    if (this.LoopAccumPricingSubscribe) this.LoopAccumPricingSubscribe.unsubscribe();
    try {
      clearInterval(this.aqModel.interval);
    } catch (ex) {

    }

  }

  ngOnInit(): void {
    console.log('AQ');
  }

  ResetAllFields() {
    if (this.AccumPricingSubscription) this.AccumPricingSubscription.unsubscribe();
    if (this.LoopAccumPricingSubscribe) this.LoopAccumPricingSubscribe.unsubscribe();
    try {
      this.stopTimer();
      clearInterval(this.aqModel.interval);
    } catch (ex) {

    }
  }

  ChangeKO() {
    try {
      this.ResetAllFields();
      if (this.aqModel.KO === '' || this.aqModel.KO === '0.00' || this.aqModel.KO === '0') {
        // this.ErrorMsg = 'Please enter valid KO % of Intial';
      }

      if (parseFloat(this.aqModel.KO) < 102) {
        // this.ErrorMsg = 'KO % should be greater than or equal to 102';
      }

    }
    catch (error) {
      //console.log("Error:", error);
    }
  }

  changeTenor() {
    try {
      this.ResetAllFields();
      if ((this.aqModel.Tenor == 0) || (this.aqModel.Tenor > 60 && this.aqModel.SelectedTenorType === 'Month') || (this.aqModel.Tenor > 5 && this.aqModel.SelectedTenorType === 'Year')) {

        // this.ErrorMsg = 'Please enter valid tenor.';
      } else {
        this.fnGetNotionalChanged();
      }
    }
    catch (error) {
      //console.log("Error:", error);
    }
  }

  // event to set Solve For and set values accordingly
  setSolveFor() {
    try {
      this.ResetAllFields();
      if (this.aqModel.SolveFor === 'UPFRONT') {
        this.aqModel.Upfront = '0.00';
        this.aqModel.Strike = '98.00';
      } else {
        this.aqModel.Upfront = '0.50';
        this.aqModel.Strike = '0.00';
      }
    }
    catch (error) {
      //console.log("Error:", error);
    }
  }

  changeDailyNoOfShare() {
    this.ResetAllFields();
    this.fnGetNotionalChanged();
  }

  fnGetNotionalChanged() {
    this.EQC_afs.calculateNotional(this.aqModel).subscribe(Res => {
      if (Res) {
        this.aqModel.AccrualDays = Number(JSON.parse(Res.responseData));
        this.EQC_afs.SetToken(Res.token);

        this.EQC_afs.fnGetSpot(this.aqModel).subscribe(spotRes => {
          if (spotRes) {
            this.aqModel.Notional = Number((Number(this.aqModel.AccrualDays) * Number(JSON.parse(spotRes.responseData)[0].Spot)) * Number(this.aqModel.DailyNoOfShares)).toFixed(2);
            this.EQC_afs.SetToken(spotRes.token);
            this.aqModel.RemainingNotional = this.aqModel.DailyNoOfShares.toString();// that.Notional;
            this.aqModel.TotalNotional = this.aqModel.DailyNoOfShares.toString();// that.Notional;
          }
        });
      }
    });
  }

  priceValidation(priceValue: any, pricestr: string) {
    try {
      if (pricestr === 'Strike (%)' && parseFloat(priceValue) > 100) {
        // this.ErrorMsg = 'Strike % should be less than 100';
        return false;
      }
      if (pricestr !== 'Strike (%)' && (priceValue === '' || parseFloat(priceValue) <= 0 || parseFloat(priceValue) >= 100)) {
        // this.ErrorMsg = pricestr + ' should be greater than 0 and less than 100';
      }
    } catch (error) {
    }
  }

  fnUnderlyingchanged(e) {
    if (e) {
      this.fnGetNotionalChanged();
    }
  }

  fnValidations() {
    try {
      if ((this.aqModel.Tenor === 0) || (this.aqModel.Tenor > 60 && this.aqModel.SelectedTenorType === 'MONTH') || (this.aqModel.Tenor > 5 && this.aqModel.SelectedTenorType === 'YEAR')) {
        // this.ErrorMsg = 'Please enter valid tenor';
        return false;
      }
      if (this.aqModel.DailyNoOfShares === 0) {
        // this.ErrorMsg = 'Please enter valid daily no. of shares';
        return false;
      }
      if (this.aqModel.Notional === '0' || this.aqModel.Notional === '0.00' || this.aqModel.Notional === '') {
        // this.ErrorMsg = 'Please enter valid notional';
        return false;
      }

      if (this.aqModel.Underlying === '') {
        // this.ErrorMsg = 'Please select valid share';
        return false;
      }

      if (this.aqModel.SolveFor !== 'Strike' && parseFloat(this.aqModel.Strike) > 100) {
        // this.ErrorMsg = 'Strike % should be less than 100';
        return false;
      }

      if (this.aqModel.SolveFor !== 'UPFRONT' && (this.aqModel.Upfront === '0.00' || this.aqModel.Upfront === '' || this.aqModel.Upfront === '0')) {
        // this.ErrorMsg = 'Upfront (%) should be greater than 0 and less than 100';
        return false;
      }

      if (this.aqModel.KO === '' || this.aqModel.KO === '0.00' || this.aqModel.KO === '0') {
        // this.ErrorMsg = 'Please enter valid KO % of Intial';
        return false;
      }

      if (parseFloat(this.aqModel.KO) < 102) {
        // this.ErrorMsg = 'KO % should be greater than or equal to 102';
        return false;
      }

      if ((parseFloat(this.aqModel.SelectedGuaranteePeriod) > (Number(this.aqModel.Tenor) / 3)) && this.aqModel.SelectedTenorType === 'MONTH') {
        // this.ErrorMsg = 'Guarantee period should be less than or equal to 1/3 of tenor.';
        return false;
      }

      if (this.aqModel.Tenor == 1 && this.aqModel.SelectedTenorType === 'YEAR') {
        if (parseFloat(this.aqModel.SelectedGuaranteePeriod) / 4) {
          // this.ErrorMsg = 'Guarantee period should be less than or equal to 1/3 of tenor.';
          return false;
        }
      }

      // if (this.ErrorMsg === '') {
      //     this.timeLeft = 0;
      //     this.orderID = '';
      //     this.orderflag = false;
      //     this.AllPrices = [];
      //     this.lpArr = [];
      //     this.sortedAllPrices = [];
      //     this.RFQIDArray = [];
      //     this.timerStarted = false;
      //     this.loadflag = true;
      //     this.AccumPrice('', '');
      // }
      this.fnEQCPrice();
      return true;
    } catch (error) {
      //console.log('Error:', error);
    }
    return true;
  }

  fnEQCPrice() {
    this.LoadingPrices = true;
    this.AccumPricingSubscription = this.EQC_afs.fnAccumPricing(this.aqModel).subscribe(Res => {
      if (Res) {
        this.aqModel.PricingTimming = 60;
        this.EQC_afs.SetToken(Res.token);
        var TempArray = [];
        this.aqModel.PPwithRFQ = '';
        this.aqModel.PPwithRFQ = Res.responseData;
        TempArray = Res.responseData.split(',');
        TempArray.forEach(ppDetailsObj => {
          if (ppDetailsObj) {
            var LPFound: boolean = false;
            this.aqModel.PPDetails.forEach(aqModelPPDtailsobj => {
              aqModelPPDtailsobj.price = 0; // Make Price 0
              if (aqModelPPDtailsobj.lp.toString().toUpperCase() === ((ppDetailsObj.split('-'))[0]).toString().toUpperCase()) {
                LPFound = true;
                aqModelPPDtailsobj.rfq = (ppDetailsObj.split('-'))[1]
              }
            });
            if (!LPFound) {
              this.aqModel.PPDetails.push({
                rfq: (ppDetailsObj.split('-'))[1],
                lp: (ppDetailsObj.split('-'))[0],
                price: 0,
                ClientYield: '',
                MaxNotional: '',
                MinNotional: '',
                timer: '',
                PricerFlag: 'false'
              });
            }
          }
        });

        if (Res.responseData !== "") {
          this.aqModel.interval = setInterval(() => {
            if (this.aqModel.PricingTimming > 0) {
              this.LoopAccPricing(this.aqModel.PPwithRFQ);
              this.aqModel.PricingTimming = this.aqModel.PricingTimming - 5;
            } else if (this.aqModel.PricingTimming === 0) {
              clearInterval(this.aqModel.interval);
              // this.aqModel
              // Check here that if price receive to any LP or not otherwise clear the LP
            }
          }, 5000);
        }
      }
    });
  }

  LoopAccPricing(PPDetails: any) {
    this.LoopAccumPricingSubscribe = this.EQC_afs.fnLoopAccumPricing(PPDetails).subscribe(loopAccumObj => {
      if (loopAccumObj) {
        try {
          if (this.aqModel.PricingTimming > 0) {
            this.fnSetLoopPrices(JSON.parse(loopAccumObj.responseData));
          }
          this.EQC_afs.SetToken(loopAccumObj.token);
        } catch (EX) {

        }
      }
    });
  }

  fnSetLoopPrices(LoopPricingServiceResponse: any) {
    if (LoopPricingServiceResponse.length > 0) {
      LoopPricingServiceResponse.forEach(LoopPricingServiceResponseObj => {
        this.aqModel.PPDetails.forEach((PPDetailsObj, i) => {

          // Check RFQ ID to paste recent prices
          if (LoopPricingServiceResponseObj.EP_ER_QuoteRequestId === PPDetailsObj.rfq) {
            PPDetailsObj.price = LoopPricingServiceResponseObj.AccDecOUT;
            PPDetailsObj.clientyield = LoopPricingServiceResponseObj.ClientYield;
            PPDetailsObj.maxnotional = LoopPricingServiceResponseObj.MaxNotional;
            PPDetailsObj.minnotional = LoopPricingServiceResponseObj.MinNotional;
            if (PPDetailsObj.PricerFlag === 'false' && PPDetailsObj.price !== '') {
              PPDetailsObj.timer = this.startCountDown(180, i);
              PPDetailsObj.PricerFlag = 'true';
            }
            console.log(PPDetailsObj);
          }
        });
      });
    }
  }

  startCountDown(sec, index) {
    let counter = sec;
    var interval1 = setInterval(() => {
      if (this.aqModel.PPDetails.length <= 0) {
        clearInterval(interval1);
      }
      if (this.aqModel.PPDetails.length > 0) {
        this.aqModel.PPDetails[index].timer = counter;
        counter--;
      }
      if (counter < 0) {
        clearInterval(interval1);
        this.LPTimout(index);
        this.stopTimer();
      };
    }, 1000);
  }

  LPTimout(index) {
    this.aqModel.PPDetails[index].price = '';
    this.aqModel.PPDetails[index].clientyield = '';
    this.aqModel.PPDetails[index].maxnotional = '';
    this.aqModel.PPDetails[index].minnotional = '';
    this.aqModel.PPDetails[index].PricerFlag = 'false';
    this.aqModel.PPDetails[index].timer = 0;
  }

  stopTimer() {
    this.aqModel.PPDetails.forEach(PPDetailsObj => {
      if(PPDetailsObj.timer <= 0){
        PPDetailsObj.price = '';
        PPDetailsObj.clientyield = '';
        PPDetailsObj.maxnotional = '';
        PPDetailsObj.minnotional = '';
        PPDetailsObj.PricerFlag = 'false';
        PPDetailsObj.timer = 0;
      }
    });
  }
}
