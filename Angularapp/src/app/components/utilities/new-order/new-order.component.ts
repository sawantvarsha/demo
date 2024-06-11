import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonApiService } from '../../../services/common-api.service';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CustomerApiService } from '../../../services/customer-api.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit, OnDestroy {

  isProd = environment.production;
  RiskRating = [0, 1, 2, 3, 4, 5];
  // chart Data
  successMsg = '';
  ApplicationType = 'Subscription';
  notional = 0;
  Units: any;
  loadflag = false;
  areaTitle = '';
  areaType = 'AreaChart';
  areaData = [['2013', 1000, 400],
  ['2014', -1170, 460],
  ['2015', 660, 1120],
  ['2016', 1030, 540]];
  colorFlag = 1;
  areaColumnNames = ['Year', 'Sales'];
  areaOptions = {
    width: '400',
    height: '300',
    legend: 'none'
  };
  isOrderBooked: boolean;
  Msg = '';
  refNo = '';
  nominalText = 'Please Enter Nominal Amount';
  nominalText2 = 'Number of units';
  Funddata: any = [];
  ExistingHoldings: any;
  remainingUnits = 0;
  MFCode: any = '';
  RM = '';
  Book = '';
  // Parameters added by Ketan S.
  chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      easing: 'easeInOutBack',
      duration: 520
    },
    showLines: true,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'rgba(200, 200, 200, 0.05)',
          lineWidth: 1
        },
        display: false,
      }],
      yAxes: [{
        gridLines: {
          color: 'rgba(200, 200, 200, 0.08)',
          lineWidth: 1
        },
        display: false,
      }]
    },
    legend: {
      display: false,
      labels: {
        fontColor: '#000000',
      },
      position: 'top'
    },
    bezierCurve: false
  };
  chartData = [];
  chartLabels = [];
  Chartcolor = [{
    backgroundColor: 'rgba(0, 154, 255, .1)',
    borderColor: 'rgb(0, 154, 255)',
    pointBackgroundColor: 'rgb(103, 58, 183)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
  }];

  Account_Name: string;
  Account_Number: string;
  accountList = [];
  Address_Details: string;
  BSB: string;
  Contact_Number: string;
  CustomerType: string;
  CustomerName: string;
  DOB: string;
  IdentificationType: string;
  IdentificationNo: string;
  Nationality: string;
  Nature_of_Business: string;
  Postal_Details: string;
  CustomerID: any;
  username: string;
  ShowChart = false;
  isOrderSuccess: boolean;
  portfolio: string;
  portfolioList = [];
  portfolioAccount = [];
  currency: any;
  multiportfoliodata: Subscription;
  constructor(public cfs: CommonApiService, public afs: WorkflowApiService, public route: ActivatedRoute, public custApi: CustomerApiService) {
    this.Msg = '';
    this.isOrderBooked = false;
  }

  ngOnInit() {
    this.ApplicationType = 'Subscription';
    this.username = sessionStorage.getItem('Username');
    console.log(this.route.snapshot.paramMap.get('MFCode'));
    this.MFCode = this.route.snapshot.paramMap.get('MFCode');
    this.afs.getMFDetails(this.MFCode);
    this.afs.MFDetails.subscribe((res: any) => {
      if (res) {
        try {
          if (res) {
            this.Funddata = res;
            this.afs.getmultiPortfolio(this.username);
            this.notional = this.cfs.FormatNumberValue(this.Funddata.Min_Inv_Amt[0]);
            this.unitCalculations(this.cfs.UnformatNumberwithoutevent(this.notional), this.Funddata.BidNav[0]);
            this.Funddata.forEach(mf => {
              mf.FundSize[0] = parseFloat(mf.FundSize[0]).toFixed(2);
            });
          }
        } catch (ex) {

        }
      }
    });
    this.afs.ResetMFDetails();
    this.afs.getMFDetails(this.MFCode);
    this.afs.getMFNAVHistorychart(this.MFCode, '', '', '1Y').subscribe(res => {
      const data = res.GetDateChartdataResult;
      if (data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        if (data.length > 0) {
          const MFHistoryDataArr = data.map(r => r.IH_Fixing_Value);
          const MFHistoryLabelArr = data.map(r => r.IH_Fixing_Date);
          const MFHistoryData = {
            data: MFHistoryDataArr.splice(MFHistoryDataArr.length - 10, MFHistoryDataArr.length),
            label: this.Funddata.Name,
          };
          this.chartData.push(MFHistoryData);
          this.chartLabels = MFHistoryLabelArr.splice(MFHistoryLabelArr.length - 10, MFHistoryLabelArr.length);
          this.ShowChart = true;
        }

        // this.chartData[0].data = array;
      }
    });

    // this.cfs.MFDataObserver.subscribe(data => {
    //   if (data.lenght !== 0) {
    //     console.log(data);
    //     this.Funddata = data;

    //   }
    // });

    this.afs.fundSubscribeObserver.subscribe((data: any) => {

      if (data.length !== 0) {
        this.isOrderBooked = true;
        //   this.successMsg = data;
        this.loadflag = false;
        if (data === 'FAIL' || data === 'Undefined') {
          this.Msg = 'Order placement failed';
          this.isOrderSuccess = false;
        } else {

          this.Msg = 'Order placed successfully.';
          this.refNo = data;
          this.isOrderSuccess = true;

        }
      }
    });

    this.afs.holdingsObserver.subscribe((res: any) => {
      if (res.length !== 0) {
        if (res.GetHoldingsResult.length !== 0) {
          this.ExistingHoldings = res.GetHoldingsResult[0].Units;
    //console.log(res);
          if (this.ExistingHoldings >= this.Units) {
            this.remainingUnits = this.ExistingHoldings - this.Units;
            // eslint-disable-next-line max-len
            // this.afs.FundsOrderEntry(0, this.Funddata.Code[0], 'Redeemption', 'RD', '', '', '00000', 'SRS', this.remainingUnits, this.Funddata.Ccy[0]);
            this.afs.FundsOrderEntry(0, this.Funddata.Code[0], 'Redeemption', 'RD', '', '', '00000', 'SRS', this.remainingUnits, this.Funddata.Ccy[0], this.RM, this.Book, this.CustomerType, this.CustomerName, this.DOB, this.IdentificationType, this.IdentificationNo, this.Nationality, this.Account_Number, this.portfolio, this.username);

          } else {
            this.loadflag = false;
            this.successMsg = 'Holding units less than redeem units.';
          }

        } else {
          this.loadflag = false;
          this.successMsg = 'Holding units less than redeem units.';

        }
      }
    });

    this.custApi.getCustAccountDetails.subscribe(res => {
      if (res.length !== 0) {
  //console.log(res);

        this.Account_Name = res.Account_Name;
        // this.Account_Number = res.accountnumber;
        this.Address_Details = res.Address_Details;
        this.BSB = res.BSB;
        this.Contact_Number = res.Contact_no;
        this.CustomerType = res.CustomerType;
        this.CustomerID = res.CustomerID;
        this.CustomerName = res.misc1;
        this.DOB = res.Date_of_birth;
        this.IdentificationType = res.Identification_type;
        this.IdentificationNo = res.Identificatoin_number;
        this.Nationality = res.Nationality;
        this.Nature_of_Business = res.NatureOfBusiness;
        this.Postal_Details = res.Postal_Address;
        // this.portfolio = res.portfolio;
      }
    });



    this.multiportfoliodata = this.afs.multiportfolioObserver.subscribe(res => {
      if (res.length !== 0 && res.status)  {
        this.portfolioAccount = [];
        res = res.message ;
        res.forEach(element => {
          this.portfolioAccount.push([element.portfolio, element.accountnumber, element.Accountcurrency]);
        });
        this.portfolioList = [];
        this.accountList = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.portfolioAccount.length; i++) {
          if (this.portfolioAccount[i][2] === this.Funddata.Ccy[0]) {

            this.portfolioList.push(this.portfolioAccount[i][0]);
            this.accountList.push(this.portfolioAccount[i][1]);
            // this.accountList.push(this.portfolioAccount[i]);
            // this.ccy.push(this.portfolioAccount[i][2]);
          }
        }
        this.portfolio = this.portfolioList[0];
        this.Account_Number = this.accountList[0];
        // this.PortfolioChange();
  //console.log(this.portfolioAccount);
      }
    });
  }

  unitCalculations(nominal, nav) {
    try {
      // alert("done");
      if (this.ApplicationType === 'Subscription') {
        (nav !== 0) ? (this.Units = nominal / nav) : (this.Units = 0);
        this.Units = this.Units.toFixed(2);
        this.Units = this.cfs.FormatNumberValue(this.Units);
        this.successMsg = '';
      } else {
        (nav !== 0) ? (this.Units = nominal * nav) : (this.Units = 0);
        this.Units = this.Units.toFixed(2);
        this.Units = this.cfs.FormatNumberValue(this.Units);
        this.successMsg = '';
      }

    } catch (error) {
      // console.log("Error:", error);
    }
  }

  subscribed() {
    try {

      if (this.Funddata.BidNav[0] === 0) {
        this.successMsg = 'NAV is 0. Please select other fund';
        this.loadflag = false;
      } else if (isNaN(this.cfs.UnformatNumberwithoutevent(this.notional)) === true) {
        this.successMsg = 'Please enter the valid notional.';
        this.loadflag = false;
      } else if (this.cfs.UnformatNumberwithoutevent(this.notional) <= 0) {
        this.successMsg = 'Please enter the notional.';
        this.loadflag = false;
      } else if (parseFloat(this.cfs.UnformatNumberwithoutevent(this.notional)) <= parseFloat(this.Funddata.Min_Inv_Amt[0]) && this.ApplicationType === 'Subscription') {
        this.successMsg = 'Nominal Amount should be more than or equal to ' + this.Funddata.Ccy[0] + ' ' + this.Funddata.Min_Inv_Amt[0];
        this.loadflag = false;
      } else if (parseFloat(this.cfs.UnformatNumberwithoutevent(this.notional)) <= parseFloat(this.Funddata.Min_Inv_Amt[0])) {
        this.successMsg = 'Nominal Amount should be more than or equal to ' + this.Funddata.Ccy[0] + ' ' + this.Funddata.Min_Inv_Amt[0];
        // this.successMsg = 'Nominal Amount should be more than or equal to Min. Initial Investment Amount.';
        this.loadflag = false;
      } else {
        if (this.Funddata.Code[0]) {

          if (this.ApplicationType === 'Subscription') {
            const amount = this.notional.toString().replace(',', '');
            this.afs.FundsOrderEntry(amount, this.Funddata.Code[0], 'Subscription', 'SB', '', '', '00000', '',  this.Units.replace(',', ''), this.Funddata.Ccy[0], this.RM, this.Book, this.CustomerType, this.CustomerName, this.DOB, this.IdentificationType, this.IdentificationNo, this.Nationality, this.Account_Number, this.portfolio, this.username);

          } else if (this.ApplicationType === 'Redemption') {
            this.afs.GetHoldingsDetailsForRedeem(this.CustomerID, this.Funddata.Code[0]);

          }
        } else {
          this.successMsg = 'Fund Code is unavailable.';
        }

      }
      //   this.successMsg = '';
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  applicationTypeChange() {
    // alert(this.ApplicationType);
    this.Units = 0;
    this.notional = 0;
    if (this.ApplicationType === 'Subscription') {
      this.nominalText = 'Please Enter Nominal Amount';
      this.nominalText2 = 'Number of units';
    } else {
      this.nominalText = 'Please Enter Redeem Units';
      this.nominalText2 = 'Redeem Amount';
    }

  }

  clear() {
    this.notional = 0;
    this.Units = 0;
    this.Msg = '';
    this.successMsg = '';
  }
  addNotional(incr) {
    this.notional = parseFloat(this.cfs.UnformatNumberwithoutevent(this.notional)) + incr;
    this.notional = this.cfs.FormatNumberValue(this.notional);
    this.unitCalculations(this.cfs.UnformatNumberwithoutevent(this.notional), this.Funddata.BidNav[0]);
  }

  ChangeSelectedportfolio() {
    for (let i = 0; i < this.portfolioList.length; i++) {
      if (this.portfolioList[i] === this.portfolio) {
        this.Account_Number = this.accountList[i];
      }
    }
    if (this.Account_Number === '') {
      this.successMsg = 'Portfolio with selected bond currency is not available. Please select different bond';

    }
  }
  ngOnDestroy() {
    this.Msg = '';
    console.log('On Destroy Called');
    this.isOrderBooked = false;
    this.afs.ResetFundSubscribe();
    // this.afs.multiportfolio.next([]);
    this.multiportfoliodata.unsubscribe();
  }
}
