import { Component, OnInit } from '@angular/core';
// import { ApifunctionService } from '../apifunction.service';
// import { Subscription } from 'rxjs';
import { CommonfunctionService } from '../commonfunction.service';
// import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { DatePipe, Location } from '@angular/common';
import { ApifunctionService } from '../apifunction.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';

declare var require: any;
// declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-clientwise-fx-position',
  templateUrl: './clientwise-fx-position.component.html',
  styleUrls: ['./clientwise-fx-position.component.scss'],
})
export class ClientwiseFxPositionComponent implements OnInit {
  userType: any;
  isUserRM: boolean;
  Customer: any;
  CustomerID: any;
  CustomerName: any;
  transactionData: any[] = [];
  startDate = this.datepipe.transform(new Date(), 'dd-MMM-yyyy'); // '21-Jan-2021';
  endDate = this.datepipe.transform(new Date(), 'dd-MMM-yyyy'); // '21-Jan-2021';;
  MarketType: string;
  errorMsg: string;
  LoadingFlag: boolean;
  PairWiseData: any[] = [];
  CollateralData: any;
  CashFlowData: any;
  filteredsandFData: any;
  NoofRecords: any;

  ccySubscription: Subscription;
  sandflistSubscription: Subscription;
  doneTradeSummarySubscription: Subscription;
  currencyListSubscription;

  ccyList: any[];
  sandFData: any;
  sandffilterLen: any;
  sandfLen: any;

  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
  ];
  DoneTradeSummaryData: any[];
  AmountDecimalPlaces: any;
  CurrencyListData: any[];
  LoadingMTMFlag: boolean = false;
  isValidDate: boolean;
  errorMsgCol: string;
  errorMsgCash: string;
  errorMsgPair: string;
  errorMsgSF: string;

  constructor(
    private afs: ApifunctionService,
    public com: CommonfunctionService,
    public authApi: AuthService,
    public homeApi: HomeApiService,
    public location: Location,
    private datepipe: DatePipe,
    public commonApi: CommonApiService
  ) {
    // this.EntityName = "Private Banking";
    this.MarketType = 'FX';
  }

  ngOnInit(): void {
    this.userType = this.authApi.UserType;
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (!this.isUserRM) {
      this.Customer = this.homeApi.CustomerName;
      this.CustomerID = this.homeApi.CustomerId;
      if (this.Customer.includes(',')) {
        this.CustomerName = this.Customer.split('|')[0];
      } else {
        this.CustomerName = this.Customer;
      }
    }
    this.afs.GetCurrencyList();

    this.ccySubscription = this.afs.GetCurrencyPairObserver.subscribe((res) => {
      //console.log(res);
      if (res.length) {
        // this.ccyList = res;
        // console.log(this.ccyList);
        this.ccyList = res.filter((d) => {
          return d['GoodOrder'] === 'Y';
        });

        this.sandFData.map((d) => {
          let decimal = this.ccyList.filter((p) => {
            return p['PairCode'] === d.CurrencyPair;
          });
          d.Rate = d.Rate.toFixed(decimal[0].DecimalRate);
          if (d.Direction === 'B') {
            d.Ccy1_Amount = parseFloat(d.Ccy1_Amount).toFixed(
              decimal[0].SecondAmountDecimal
            );
            d.Ccy2_Amount = parseFloat(d.Ccy2_Amount).toFixed(
              decimal[0].AmountDecimal
            );
          } else {
            d.Ccy1_Amount = parseFloat(d.Ccy1_Amount).toFixed(
              decimal[0].AmountDecimal
            );
            d.Ccy2_Amount = parseFloat(d.Ccy2_Amount).toFixed(
              decimal[0].SecondAmountDecimal
            );
          }
        });
      }
    });

    this.doneTradeSummarySubscription =
      this.afs.DoneTradeSummaryDataObs.subscribe((res: any) => {
        if (res.length !== 0) {
          try {
            const that = this;
            this.DoneTradeSummaryData = [];
            let parseString = require('xml2js').parseString;
            parseString(res, function (_err, result) {
              // that.SampleObjectData =  result.NewDataSet.Trecords;
              if (result.NewDataSet.Trecords !== undefined) {
                that.FillDataintoDoneTradeSummary(result.NewDataSet.Trecords);
              }
            });
          } catch (ex) {
            console.log(ex);
          }
        }
      });

    this.currencyListSubscription = this.afs.CurrencyListObs.subscribe(
      (res) => {
        if (res.length !== 0) {
          this.CurrencyListData = res;
        }
      }
    );

    this.sandflistSubscription =
      this.afs.SandFblotterDetailsforsingleCustomerObserver.subscribe(
        (res: any) => {
          this.LoadingFlag = true;
          if (res !== null) {
            console.log(res);
            this.sandFData = res;
            let sandFDataCopy: any[] = [];
            sandFDataCopy = res;
            if (sandFDataCopy !== undefined) {
              this.sandFData = sandFDataCopy.filter(function (e) {
                return e.Status === 'New Trade';
              });
            }
            if (this.sandFData === [] || this.sandFData === undefined) {
              if (this.sandFData === undefined) {
                this.filteredsandFData = this.sandFData = [];
                this.ChangeLen();
                this.errorMsgSF = 'No data found.';
                this.LoadingFlag = false;
              }
              this.filteredsandFData = this.sandFData = [];
              this.ChangeLen();
            } else {
              try {
                this.sandFData = this.sandFData.filter((rec) => {
                  return rec['Product'] !== '';
                });

                this.sandFData.map((d) => {
                  d.TranDateandTime = formatDate(
                    d.TranDateandTime,
                    'dd-MMM-yyyy',
                    'en-US',
                    '+0530'
                  );
                  d.Value_Date = formatDate(
                    d.Value_Date,
                    'dd-MMM-yyyy',
                    'en-US',
                    '+0530'
                  );
                });
                this.sandFData.map((d) => {
                  // d.TranDateandTime = this.setfiniqdateformat(d.TranDateandTime);
                  // d.Value_Date = formatDate(d.Value_Date, 'dd-MMM-yyyy', 'en-US', '+0530');
                  // if (this.ccyList !== undefined) {
                  let decimal = this.ccyList.filter((p) => {
                    return p['PairCode'] === d.CurrencyPair;
                  });
                  d.Rate = d.Rate.toFixed(decimal[0].DecimalRate);
                  if (d.Direction === 'B') {
                    d.Ccy1_Amount = parseFloat(d.Ccy1_Amount).toFixed(
                      decimal[0].SecondAmountDecimal
                    );
                    d.Ccy2_Amount = parseFloat(d.Ccy2_Amount).toFixed(
                      decimal[0].AmountDecimal
                    );
                  } else {
                    d.Ccy1_Amount = parseFloat(d.Ccy1_Amount).toFixed(
                      decimal[0].AmountDecimal
                    );
                    d.Ccy2_Amount = parseFloat(d.Ccy2_Amount).toFixed(
                      decimal[0].SecondAmountDecimal
                    );
                  }
                  // }else{
                  //   this.ccyFlag = true;
                  // }
                });
              } catch (ex) {
                console.log(ex);
              }
              this.filteredsandFData = this.sandFData;
              this.NoofRecords = this.filteredsandFData.length;
              this.sort_by_key(this.filteredsandFData, 'OrderID', 'Dsc');
              // this.filterdata();
              this.ChangeLen();
              this.LoadingFlag = false;
              this.errorMsgSF = '';
            }
          } else {
            this.errorMsgSF = 'No data found.';
            this.LoadingFlag = false;
          }
        }
      );
    this.loadData();
  }

  loadData() {
    this.getPairWiseData();
    this.getCollateralFlowData();
    this.getFXCashFlowData();
    this.GetDoneTradeSummaryData();
    this.getSandFblotterData();
  }

  getPairWiseData() {
    try {
      this.LoadingFlag = true;
      this.afs
        .GetPairWiseMTMData(
          this.CustomerID,
          this.authApi.EntityID,
          this.MarketType,
          this.startDate,
          this.endDate,
          '',
          ''
        )
        .subscribe((res) => {
          if (res) {
            this.PairWiseData = [];
            if (res.GetPairWiseMTMDataResult === null) {
              this.errorMsgPair = 'No data found.';
              this.LoadingFlag = false;
            } else {
              this.errorMsgPair = '';
              this.LoadingFlag = false;
              this.PairWiseData = res.GetPairWiseMTMDataResult;
              // this.checkDataLoaded();
            }
          }
        });
    } catch (error) {}
  }

  getCollateralFlowData() {
    try {
      this.LoadingFlag = true;
      this.afs
        .GetCollateralFlowData(
          this.CustomerID,
          this.Customer,
          this.authApi.EntityID,
          this.startDate,
          this.endDate,
          '',
          '',
          ''
        )
        .subscribe((res) => {
          if (res) {
            if (res.length !== 0) {
              // //console.log(res);
              if (res.GetCollateralFlowDataResult === null) {
                this.errorMsgCol = 'No data found.';
                this.LoadingFlag = false;
              } else {
                this.errorMsgCol = '';
                this.CollateralData = res.GetCollateralFlowDataResult;
              }
            }
          }
        });
    } catch (error) {}
  }

  getFXCashFlowData() {
    try {
      this.LoadingFlag = true;
      this.afs
        .getFXCashFlowData(
          this.CustomerID,
          this.authApi.EntityID,
          this.MarketType,
          this.startDate,
          this.endDate,
          '',
          ''
        )
        .subscribe((res) => {
          if (res) {
            this.CashFlowData = [];
            if (res.length !== 0) {
              // //console.log(res);
              if (res.GetFXCashFlowDataResult === null) {
                this.errorMsgCash = 'No data found.';
                this.LoadingFlag = false;
              } else {
                this.errorMsgCash = '';
                this.CashFlowData = res.GetFXCashFlowDataResult;
                // this.checkDataLoaded();
              }
            }
          }
        });
    } catch (error) {}
  }

  GetDoneTradeSummaryData() {
    try {
      this.afs.GetDoneTradeSummaryData(
        '/Date(' + this.dateToEpocFormat(this.startDate) + ')/',
        '/Date(' + this.dateToEpocFormat(this.endDate) + ')/',
        this.CustomerID,
        this.authApi.UserName,
        '1000',
        '1'
      );
      // this.afs.GetDoneTradeSummaryData("\/Date(" + this.dateToEpocFormat(this.startDate) + ")\/",
      // "\/Date(" + this.dateToEpocFormat(this.endDate) + ")\/", this.CustomerID, this.authApi.UserName, '1000', '1').subscribe(res => {
      //   if(res) {
      //     if (res !== null) {
      //       console.log(res);
      //       this.sandFData = res;
      //       if (this.sandFData === [] || this.sandFData === undefined) {
      //         if (this.sandFData === undefined) {
      //           this.filteredsandFData = this.sandFData = [];
      //           this.ChangeLen();
      //           this.errorMsg = 'No data found.'
      //           this.LoadingFlag = false;
      //         }
      //         this.filteredsandFData = this.sandFData = [];
      //         this.ChangeLen();
      //       } else {
      //         try {
      //           this.sandFData = this.sandFData.filter(rec => {
      //             return (rec['Product'] !== '');
      //           });
      //           this.sandFData.map(d => {
      //             d.TranDateandTime = this.setfiniqdateformat(d.TranDateandTime);
      //             d.Value_Date = formatDate(d.Value_Date, 'dd-MMM-yyyy', 'en-US', '+0530');
      //             // if (this.ccyList !== undefined) {
      //             let decimal = this.ccyList.filter(p => {
      //               return (p['PairCode'] === d.CurrencyPair);
      //             });
      //             d.Rate = d.Rate.toFixed(decimal[0].DecimalRate);
      //             if (d.Direction === 'B') {
      //               d.Ccy1_Amount = parseFloat(d.Ccy1_Amount).toFixed(decimal[0].SecondAmountDecimal);
      //               d.Ccy2_Amount = parseFloat(d.Ccy2_Amount).toFixed(decimal[0].AmountDecimal);

      //             } else {
      //               d.Ccy1_Amount = parseFloat(d.Ccy1_Amount).toFixed(decimal[0].AmountDecimal);
      //               d.Ccy2_Amount = parseFloat(d.Ccy2_Amount).toFixed(decimal[0].SecondAmountDecimal);
      //             }
      //             // }else{
      //             //   this.ccyFlag = true;
      //             // }
      //           });
      //         } catch (ex) {
      //           console.log(ex);
      //         }
      //         this.filteredsandFData = this.sandFData;
      //         this.NoofRecords = this.filteredsandFData.length;
      //         this.sort_by_key(this.filteredsandFData, 'OrderID', 'Dsc');
      //         // this.filterdata();
      //         this.ChangeLen();
      //         this.LoadingFlag = false;
      //         this.errorMsg = '';
      //       }
      //     }
      //   }
      // })
    } catch (error) {}
  }

  getSandFblotterData() {
    try {
      this.filteredsandFData = [];
      this.afs.getSandFblotterDetailsforsingleCustomer(
        this.startDate,
        this.endDate,
        this.CustomerID,
        'm'
      );
    } catch (error) {}
  }

  ChangeLen() {
    this.sandffilterLen = this.filteredsandFData.length;
    this.sandfLen = this.sandFData.length;
  }

  setfiniqdateformat(strdate: string) {
    try {
      let finiqformatdate: string;
      let datearr = strdate.split('/');
      if (datearr.length > 1) {
        finiqformatdate =
          (datearr[1].length > 1 ? datearr[1] : '0' + datearr[1]) +
          '-' +
          this.months[Number(datearr[0]) - 1] +
          '-' +
          datearr[2];
      } else {
        return strdate;
      }
      return finiqformatdate;
    } catch (ex) {
      console.log(ex);
    }
  }

  MarkToMarket() {
    try {
      this.LoadingMTMFlag = true;
      this.afs
        .PerformMTM(this.CustomerID, this.authApi.EntityID)
        .subscribe((res) => {
          if (res) {
            if (res.PerformMTMResult) {
              this.LoadingMTMFlag = false;
              this.errorMsg = 'Mark to market action performed successfully.';
            } else {
              this.LoadingMTMFlag = false;
              this.errorMsg = 'Mark to market action failed.';
            }
            setTimeout(() => {
              this.LoadingMTMFlag = false;
              this.errorMsg = '';
            }, 3000);
          }
        });
    } catch (error) {}
  }

  back() {
    this.location.back();
  }

  sort_by_key(array, key, Direction) {
    if (Direction === 'Asc') {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } else {
      return array.sort(function (a, b) {
        var x = b[key];
        var y = a[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    }
    return null;
  }

  dateToEpocFormat(date) {
    try {
      // var d = new Date();
      var d = new Date(date);
      var year = d.getFullYear();
      var month = d.getMonth();
      var day = d.getDate();

      return new Date(year, month, day).getTime();
    } catch (e) {
      return null;
    }
  }

  FillDataintoDoneTradeSummary(data) {
    // this.SampleObjectData = data;

    data.forEach((obj) => {
      const that = this;
      let DoneTradeSummaryDatats: any = {};
      if (
        new Date(obj.Trade_date[0].toString()) >= new Date(that.startDate) &&
        new Date(obj.Trade_date[0].toString()) <= new Date(that.endDate)
      ) {
        DoneTradeSummaryDatats['Trade_ref'] = obj.Trade_ref[0].toString();
        DoneTradeSummaryDatats['Asset_Class'] = obj.Asset_Class[0].toString();
        DoneTradeSummaryDatats['Trade_date'] = obj.Trade_date[0].toString();
        DoneTradeSummaryDatats['Ccy_Ref'] = obj.Ccy_Ref[0].toString();
        DoneTradeSummaryDatats['Trade_size'] = this.FormatCCYBasedAmount(
          obj.Trade_size[0].toString(),
          obj.Ccy_Ref[0].toString()
        );
        DoneTradeSummaryDatats['Product_ref'] = obj.Product_ref[0].toString();
        DoneTradeSummaryDatats['Product_quoted_at'] =
          obj.Product_quoted_at[0].toString();
        DoneTradeSummaryDatats['Order_placed_at'] =
          obj.Order_placed_at[0].toString();
        DoneTradeSummaryDatats['Trade_verified_at'] = ''.toString();
        DoneTradeSummaryDatats['Deal_facing'] = obj.Deal_facing[0].toString();
        DoneTradeSummaryDatats['client_cpty_ref'] =
          obj.client_cpty_ref[0].toString();
        DoneTradeSummaryDatats['entity_ref'] = obj.entity_ref[0].toString();
        DoneTradeSummaryDatats['Book_Ref'] = obj.Book_Ref[0].toString();
        DoneTradeSummaryDatats['RM_Ref'] = obj.RM_Ref[0].toString();
        DoneTradeSummaryDatats['USD_Revenue'] = this.FormatCCYBasedAmount(
          obj.USD_Revenue[0].toString(),
          obj.Ccy_Ref[0].toString()
        );
        DoneTradeSummaryDatats['ActiveYN'] = obj.ActiveYN[0].toString();
        this.DoneTradeSummaryData.push(DoneTradeSummaryDatats);
      }
    });
    this.NoofRecords = this.DoneTradeSummaryData.length;
  }

  FormatCCYBasedAmount(value, CCYName: string) {
    this.CurrencyListData.forEach((obj) => {
      if (obj.CurrencyCode === CCYName) {
        this.AmountDecimalPlaces = obj.DecimalAmount;
      }
    });
    return this.com.FormatNumberWithoutEventForAmount(
      value,
      this.AmountDecimalPlaces
    );
  }

  validateDate() {
    const custStartDate = this.startDate;
    const custEndDate = this.endDate;
    const StartDate = this.datepipe.transform(custStartDate, 'yyyy-MM-dd');
    const EndDate = this.datepipe.transform(custEndDate, 'yyyy-MM-dd');
    if (EndDate < StartDate) {
      // console.log('Validate*******************88');
      this.errorMsg = 'Please enter valid To and From date.';
      this.isValidDate = false;
    } else {
      this.isValidDate = true;
    }
  }

  selectDate(date) {
    this.validateDate();
    if (this.isValidDate) {
      // this.loadData();
    } else {
      this.errorMsg = 'Please enter valid To and From date.';
    }
    return this.datepipe.transform(date, 'dd-MMM-yyyy');
  }
}
