import { Component, OnInit } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { LPScanService } from 'src/app/services/lpscan.service';
import { ApifunctionService } from '../../fx-order/apifunction.service';
import { FxdApifunctionService } from '../../FXD/services/fxd-apifunction.service';

@Component({
  selector: 'app-lp-status',
  templateUrl: './lp-status.component.html',
  styleUrls: ['./lp-status.component.scss'],
})
export class LpStatusComponent implements OnInit {
  statusResponse: any;


  FXDStatusResponse: any;
  FXDloaderup: boolean;

  priceResponse: any;
  ppdetails: any;

  //for ELN
  ELNStatusResponse: any;
  ELNPriceResponse: any;
  ELNloaderup: boolean;
  shareList: any;
  suggestionArray: any;
  showsharesuggestionBox: boolean;
  shareKeyword: any;
  ELNTenorNo: any;
  ELNTenorType: any;
  selectedShare: any;
  ELNstrike: any;
  ELNDatesResponse: any;
  lpRows: any;

  //FOR CASH FX (SPOT)
  CashFXStatusResponse: any;
  CashFXloaderup: boolean;
  CurrencyList: any;
  CashFXInCcy: any;
  inCcyKey: any;
  depCcyKey: any;
  CahsFXDepCcy: any;
  CashFXshowInCcy: boolean;
  CashFXshowDepCcy: boolean;
  ccyFilterList: any;
  CashFXTenor: any;
  CashFXBuySell: any;
  investCcyList: any;
  depositCcyList: any;
  InvestCcyListCache: any;
  depositCcyListCache: any;
  CashFXDatesResponse: any;
  //For FDX
  FXDinCcyKey: any;
  FXDdepCcyKey: any;
  FXDInCcy: any;
  FXDDepCcy: any;
  FXDshowInCcy: any;
  FXDshowDepCcy: boolean;
  FXDBuySell : any;
  FXDTenor : any;
  FXDStrike : any;
  FXDDatesResponse : any;
  constructor(
    private lp: LPScanService,
    public commonApi: CommonApiService,
    private apifun: ApifunctionService,
    private custapi: CustomerApiService,
    private fxdapi : FxdApifunctionService
  ) {
    this.showsharesuggestionBox = false;
    this.selectedShare = 'AAPL.OQ';
    this.shareKeyword = this.selectedShare;
    this.ELNTenorNo = 6;
    this.ELNTenorType = 'Month';
    this.ELNstrike = 97;
    this.ELNloaderup = false;

    this.CashFXloaderup = false;
    // this.CurrencyList = ['AED', 'AUD', 'CAD', 'CHF', 'CNH', 'EUR', 'GBP', 'HKD', 'INR', 'JPY', 'NOK', 'NZD', 'SEK', 'SGD', 'THB', 'USD', 'XAG', 'XAU', 'ZAR'];
    this.inCcyKey = this.CashFXInCcy = 'USD';
    this.depCcyKey = this.CahsFXDepCcy = 'JPY';
    this.CashFXshowInCcy = false;
    this.CashFXshowDepCcy = false;
    this.CashFXBuySell = 'SELL';
    this.CashFXTenor = 'spot';
    this.FXDloaderup = false;
    this.FXDinCcyKey = this.FXDInCcy = 'EUR';
    this.FXDdepCcyKey = this.FXDDepCcy = 'USD';
    this.FXDshowInCcy = false;
    this.FXDshowDepCcy = false;
    this.FXDTenor = '3M'
    this.FXDBuySell = 'SELL'
    this.FXDStrike = 1.1333
  }

  async ngOnInit() {
    this.custapi.allTradablePair.subscribe((res) => {
      if (res) {
        this.CurrencyList = res;
        this.investCcyList = this.CurrencyList.map((item) => item.Asset1);
        this.investCcyList = [
          ...new Set(this.investCcyList?.map((item) => item)),
        ];
        this.InvestCcyListCache = this.investCcyList;
        // console.log('invest ccy', this.investCcyList);
      }
    });
    this.lpRows = await this.lp.getStatusCheckRows();
    this.lpRows = this.lpRows.filter((l) => l.active);
    // console.log(this.lpRows);
    this.shareList = this.lp.getShareList()?.sort((a, b) => {
      if (a.Feedcode < b.Feedcode) {
        return -1;
      } else {
        return 1;
      }
    });
    this.SelectedCcy('cashfx', 'deposit', 'JPY');
    this.checkforFXDDates();
    this.checkforCashFXDates();
  }

  CheckStatus(temp: any) {
    this.statusResponse = '';
    switch (temp) {
      case 'EQC':

        this.ELNloaderup = true;
        this.lp.EQCcheckStatus().subscribe((res) => {
          console.log(res);
          this.statusResponse = res;
          this.ELNStatusResponse = JSON.parse(this.statusResponse.responseData);
          // console.log('res', this.ELNStatusResponse);
          this.ELNloaderup = false;
          for (let i = 0; i < this.ELNStatusResponse.length; i++) {
            this.ELNStatusResponse[i].ELNOUT = 'Offline';
          }
        });
        break;

      case 'FXD':
        // console.log("FXD Details",this.FXDInCcy, this.FXDDepCcy, this.FXDBuySell, this.FXDTenor, this.FXDStrike, this.FXDDatesResponse)
        this.FXDloaderup = true;
        this.lp.FXDPriceCheck(this.FXDInCcy, this.FXDDepCcy, this.FXDBuySell, this.FXDTenor, this.FXDStrike, this.FXDDatesResponse).subscribe((res) => {
          // console.log('8979', res);

          this.statusResponse = res;
          this.FXDStatusResponse =
            this.statusResponse.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody;
          for (let i = 0; i < this.FXDStatusResponse.length; i++) {
            this.FXDStatusResponse[i].premium = 'Online';
          }
          // console.log('1430', this.FXDStatusResponse);
          this.FXDloaderup = false;
        });
        break;

      case 'CashFX':
        this.CashFXloaderup = true;
        this.lp
          .FXSPOTPriceCheck(
            this.CashFXInCcy + ' - ' + this.CahsFXDepCcy,
            this.CashFXBuySell,
            this.CashFXDatesResponse
          )
          .subscribe((res) => {
            // console.log('Cash FX res', res);
          this.statusResponse = res;
          this.CashFXStatusResponse =
            this.statusResponse.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse;
          for (let i = 0; i < this.CashFXStatusResponse?.length; i++) {
            this.CashFXStatusResponse[i].NearSpotRate = 'Online';
              // console.log('spot');
          }
          this.CashFXloaderup = false;
        });
        break;

      case 'All':
        this.ELNloaderup = true;
        this.lp.EQCcheckStatus().subscribe((res) => {
          // console.log(res);
          const temp1 = res;
          this.ELNStatusResponse = JSON.parse(temp1.responseData);
          // console.log('res', this.ELNStatusResponse);
          this.ELNloaderup = false;
          for (let i = 0; i < this.ELNStatusResponse.length; i++) {
            this.ELNStatusResponse[i].ELNOUT = 'Offline';
          }
        });

        this.FXDloaderup = true;
        this.lp.FXDPriceCheck(this.FXDInCcy, this.FXDDepCcy, this.FXDBuySell, this.FXDTenor, this.FXDStrike, this.FXDDatesResponse).subscribe((res) => {
          // console.log("8979", res)
          const temp2 = res;
          this.FXDStatusResponse =
            temp2.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody;
          for (let i = 0; i < this.FXDStatusResponse.length; i++) {
            this.FXDStatusResponse[i].premium = 'Online';
          }
          // console.log('1430', this.FXDStatusResponse);
          this.FXDloaderup = false;
        });

        this.CashFXloaderup = true;
        this.lp
          .FXSPOTPriceCheck(
            this.CashFXInCcy + ' - ' + this.CahsFXDepCcy,
            this.CashFXBuySell,
            this.CashFXDatesResponse
          )
          .subscribe((res) => {
          const temp3 = res;
          this.CashFXStatusResponse =
            temp3.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse;
          for (let i = 0; i < this.CashFXStatusResponse?.length; i++) {
            this.CashFXStatusResponse[i].NearSpotRate = 'Online';
              // console.log('spot');
          }
          this.CashFXloaderup = false;
        });

        break;
    }
  }

  PriceCheck(temp: any) {
    switch (temp) {
      case 'EQC':
        // this.CheckStatus('EQC')
        // if(!this.ELNStatusResponse){
        //   this.CheckStatus('EQC')
        // }
        // for(let i=0;i<this.ELNStatusResponse.length ;i++){
        //   this.ELNStatusResponse[i].ELNOUT = 'Offline'
        // }
        // console.log('in');
        // this.ELNloaderup = true;
        // this.lp.EQCPriceQuote().subscribe((res) => {
        //   console.log('price', res);
        //   this.ppdetails = res.responseData;

        //   this.lp.EQCPriceQuoteResponse(this.ppdetails).subscribe((res) => {
        //     console.log("quote res", JSON.parse(res.responseData))

        //     this.ELNPriceResponse = JSON.parse(res.responseData);

        //     // for (let i = 0; i < this.ELNPriceResponse.length  ; i++) {
        //     //   for (let j = 0; j < this.ELNStatusResponse.length; j++) {
        //     //     if((this.ELNStatusResponse[j].ELNOUT == '-') && (this.ELNPriceResponse[i].PP_CODE.toUpperCase() == this.ELNStatusResponse[j].Link_Provider_Name) ){
        //     //       this.ELNStatusResponse[j].ELNOUT = this.ELNPriceResponse[i].ELNOUT;
        //     //       console.log('loop', this.ELNStatusResponse[j])
        //     //     }
        //     //   }
        //     // }

        //     for (let j = 0; j < this.ELNStatusResponse.length; j++) {
        //       for (let i = 0; i < this.ELNPriceResponse.length  ; i++) {
        //         if((this.ELNStatusResponse[j].ELNOUT == 'Offline') && (this.ELNPriceResponse[i].PP_CODE.toUpperCase() == this.ELNStatusResponse[j].Link_Provider_Name) ){
        //           this.ELNStatusResponse[j].ELNOUT = this.ELNPriceResponse[i].ELNOUT;
        //           console.log('loop', this.ELNStatusResponse[j])
        //         }
        //       }
        //       if(this.ELNStatusResponse[j].ELNOUT == 'Offline'){
        //         this.ELNStatusResponse[j].ELNOUT = '-';
        //       }
        //     }

        //   });
        //   this.ELNloaderup = false;
        // });

        this.ELNloaderup = true;

        this.lp
          .getDates(this.selectedShare, this.ELNTenorNo, this.ELNTenorType)
          .subscribe((res) => {
            if (res) {
              this.ELNDatesResponse = JSON.parse(res.responseData);
              // console.log('dates', this.ELNDatesResponse);

              this.lp
                .EQCPriceQuote(
                  this.selectedShare,
                  this.ELNTenorNo,
                  this.ELNTenorType,
                  this.ELNstrike,
                  this.ELNDatesResponse
                )
                .subscribe((res) => {
                  // console.log('price', res);
                  this.ppdetails = res.responseData;

                  setTimeout(() => {
                    this.lp
                      .EQCPriceQuoteResponse(this.ppdetails)
                      .subscribe((res) => {
                        // console.log(res);

                        this.ELNPriceResponse = JSON.parse(res.responseData);
                        this.ELNStatusResponse = this.ELNPriceResponse;
                        // console.log('response', this.ELNPriceResponse);
                        this.ELNloaderup = false;
                      });
                  }, 10000);
                });
            }
          });

        break;

      case 'FXD':
        this.FXDloaderup = true;
        this.lp.FXDPriceCheck(this.FXDInCcy, this.FXDDepCcy, this.FXDBuySell, this.FXDTenor, this.FXDStrike, this.FXDDatesResponse).subscribe((res) => {
          // console.log('8979', res);

          this.statusResponse = res;
          this.FXDStatusResponse =
            this.statusResponse.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody;
          for (let i = 0; i < this.FXDStatusResponse.length; i++) {
            this.FXDStatusResponse[i].premium =
              this.FXDStatusResponse[i].premium.toFixed(4);
          }
          this.FXDloaderup = false;
        });
        break;

      case 'CashFX':
        this.CashFXloaderup = true;
        // console.log(
        //   this.CashFXInCcy + ' - ' + this.CahsFXDepCcy,
        //   this.CashFXBuySell,
        //   this.CashFXDatesResponse
        // );
        this.lp
          .FXSPOTPriceCheck(
            this.CashFXInCcy + ' - ' + this.CahsFXDepCcy,
            this.CashFXBuySell,
            this.CashFXDatesResponse
          )
          .subscribe((res) => {
            // console.log('Cash FX res', res);
          this.statusResponse = res;
          this.CashFXStatusResponse =
            this.statusResponse.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse;
          this.CashFXloaderup = false;
          // console.log("****", this.CashFXStatusResponse)
        });
        break;

      case 'All':
        // this.ELNloaderup = true;
        // this.lp.EQCPriceQuote(this.selectedShare, this.ELNTenorNo, this.ELNTenorType, this.ELNstrike, ).subscribe((res) => {
        //   console.log('price', res);
        //   this.ppdetails = res.responseData;
        //   setTimeout(() => {
        //     this.lp.EQCPriceQuoteResponse(this.ppdetails).subscribe((res) => {
        //       console.log(res);
        //       this.ELNPriceResponse = JSON.parse(res.responseData);
        //       this.ELNStatusResponse=this.ELNPriceResponse;
        //       this.ELNloaderup = false;
        //     });
        //   }, 10000);
        // });

        this.ELNloaderup = true;

        this.lp
          .getDates(this.selectedShare, this.ELNTenorNo, this.ELNTenorType)
          .subscribe((res) => {
            if (res) {
              this.ELNDatesResponse = JSON.parse(res.responseData);
              // console.log('dates', this.ELNDatesResponse);

              this.lp
                .EQCPriceQuote(
                  this.selectedShare,
                  this.ELNTenorNo,
                  this.ELNTenorType,
                  this.ELNstrike,
                  this.ELNDatesResponse
                )
                .subscribe((res) => {
                  // console.log('price', res);
                  this.ppdetails = res.responseData;

                  setTimeout(() => {
                    this.lp
                      .EQCPriceQuoteResponse(this.ppdetails)
                      .subscribe((res) => {
                        // console.log(res);

                        this.ELNPriceResponse = JSON.parse(res.responseData);
                        this.ELNStatusResponse = this.ELNPriceResponse;
                        // console.log('response', this.ELNPriceResponse);
                        this.ELNloaderup = false;
                      });
                  }, 10000);
                });
            }
          });

        this.FXDloaderup = true;
        this.lp.FXDPriceCheck(this.FXDInCcy, this.FXDDepCcy, this.FXDBuySell, this.FXDTenor, this.FXDStrike, this.FXDDatesResponse).subscribe((res) => {
          const temp5 = res;
          this.FXDStatusResponse =
            temp5.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody;
          for (let i = 0; i < this.FXDStatusResponse.length; i++) {
            this.FXDStatusResponse[i].premium =
              this.FXDStatusResponse[i].premium.toFixed(4);
          }
          this.FXDloaderup = false;
        });

        this.CashFXloaderup = true;
        this.lp
          .FXSPOTPriceCheck(
            this.CashFXInCcy + ' - ' + this.CahsFXDepCcy,
            this.CashFXBuySell,
            this.CashFXDatesResponse
          )
          .subscribe((res) => {
            // console.log('Cash FX res', res);
          const temp4 = res;
          this.CashFXStatusResponse =
            temp4.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse;
          this.CashFXloaderup = false;
        });

        break;
    }
  }


  showShareSuggestions() {
    // console.log("sharelist in suggestions", this.shareList)

    this.suggestionArray = this.shareList?.filter((item) =>
      item.Feedcode.toLowerCase().includes(this.shareKeyword.toLowerCase())
    );
    // console.log("suggestions", this.suggestionArray)
  }

  SelectShare(item: any) {
    this.selectedShare = item;
    this.shareKeyword = this.selectedShare;
    this.showsharesuggestionBox = false;
    // console.log('selected Share', this.selectedShare);
  }
  refresh(){
    this.ELNStatusResponse = null;    
    this.CashFXStatusResponse = null;    
    this.FXDStatusResponse = null;    
  }
  closePopups() {
    this.showsharesuggestionBox = false;
    this.CashFXshowInCcy = false;
    this.CashFXshowDepCcy = false;
    this.FXDshowInCcy = false;
    this.FXDshowDepCcy = false;
    this.inCcyKey = this.CashFXInCcy;
    this.depCcyKey = this.CahsFXDepCcy;
  }
  showCcySuggestion(ccy: any, type: any) {
    switch (type) {
      case 'invest':
        this.investCcyList = this.InvestCcyListCache?.filter((item) =>
          item.toLowerCase().includes(ccy.toLowerCase())
        );
        break;
      case 'deposit':
        this.depositCcyList = this.depositCcyListCache?.filter((item) =>
          item.toLowerCase().includes(ccy.toLowerCase())
        );
        // console.log("dep", this.depositCcyList);
        break;
    }
  }
  SelectedCcy(type: any, mode: any, ccy: any) {
    // console.log('type', type, 'mode', mode, 'ccy', ccy);
    switch (type) {
      case 'cashfx':
        if (mode == 'invest') {
          this.inCcyKey = this.CashFXInCcy = ccy;
          this.CashFXshowInCcy = false;
          this.depositCcyList = this.CurrencyList.filter(
            (item) => item.Asset1 === ccy
          );
          this.depositCcyList = this.depositCcyList.map((item) => item.Asset2);
          this.depositCcyListCache = this.depositCcyList;
          // console.log('deposit ccy', this.depositCcyList);
          this.depCcyKey = this.CahsFXDepCcy = '';
        } else {
          this.depCcyKey = this.CahsFXDepCcy = ccy;
          this.CashFXshowDepCcy = false;
          this.apifun.GetFXDatesForSpotForward(
            this.CashFXInCcy + ' - ' + this.CahsFXDepCcy,
            'SPOT',
            1,
            1
          );
        }
        // this.apifun.GetFXDatesForSpotForwardSF.subscribe((res) => {
        //   if (res) {
        //     this.CashFXDatesResponse = res;
        //     this.CashFXDatesResponse =
        //       this.CashFXDatesResponse?.body.PairDates.PairDateInfo;
        //   }
        // });
        this.checkforCashFXDates();
        break;
      case 'fxd':
        if (mode == 'invest') {
          this.FXDinCcyKey = this.FXDInCcy = ccy;
          this.FXDshowInCcy = false;
          this.depositCcyList = this.CurrencyList.filter(
            (item) => item.Asset1 === ccy
          );
          this.depositCcyList = this.depositCcyList.map((item) => item.Asset2);
          this.depositCcyListCache = this.depositCcyList;
          // console.log('deposit ccy', this.depositCcyList);
          this.FXDdepCcyKey = this.FXDDepCcy = '';
        } else {
          this.FXDdepCcyKey = this.FXDDepCcy = ccy;
          this.FXDshowDepCcy = false;
          // this.fxdapi.GetDatesCalculationforVB('6', 27 ,'FXOption', this.FXDInCcy, this.FXDDepCcy,'180', this.FXDTenor, 'TOK').subscribe((res)=>{
          //   if(res){
          //     this.FXDDatesResponse = res.Get_FinIQ_CalculateDatesWrapperResult;
          //   }
          // });
          this.checkforFXDDates();
        }
        // console.log(this.FXDInCcy, this.FXDDepCcy)
        break;
    }
  }
  checkforFXDDates(){
    this.fxdapi.GetDatesCalculationforVB('6', 27 ,'FXOption', this.FXDInCcy, this.FXDDepCcy,'180', this.FXDTenor, 'TOK').subscribe((res)=>{
      if(res){
        this.FXDDatesResponse = res.Get_FinIQ_CalculateDatesWrapperResult;
      }
    });
  }
  checkforCashFXDates(){
    this.apifun.GetFXDatesForSpotForwardSF.subscribe((res) => {
      if (res) {
        this.CashFXDatesResponse = res;
        this.CashFXDatesResponse =
          this.CashFXDatesResponse?.body.PairDates.PairDateInfo;
      }
    });
  }
}
