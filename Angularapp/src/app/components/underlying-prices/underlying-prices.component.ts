import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ChartInput } from 'src/app/extras/underlying-linechart/underlying-linechart.component';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { EventDatesService } from '../../services/eventdates.service';
import { LCMApiService } from 'src/app/services/lcmapi.service';
import { AppConfig } from 'src/app/services/config.service';

@Component({
  selector: 'app-underlying-prices',
  templateUrl: './underlying-prices.component.html',
  styleUrls: ['./underlying-prices.component.scss']
})
export class UnderlyingPricesComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  @Input('NMID') NMID;
  @Input('underlying1') underlying1 = '';
  @Input('underlying2') underlying2 = '';
  @Input('underlying3') underlying3 = '';
  @Input('underlying4') underlying4 = '';
  @Input('productName') productName = '';
  @Input('productCatalogueFirstRowData') productCatalogueFirstRowData;
  @Input('productCatalogueThirdRowData') productCatalogueThirdRowData;
  @Input() rmwdataArray: any[] = [];
  @Input('koYN') koYN = '';
  @Input('kiYN') kiYN = '';
  @Input('strikeYN') strikeYN = '';
  @Input('couponBarrierYN') couponBarrierYN = '';
  @Input('payoff') payoff = '';
  @Input('histTableData') histTableData = [];
  @Input('cancellationData') cancellationData = [];
  @Input('obsTableData') obsTableData = []; // Portfolio Snapshot : Stepwise Autocall and Coupon Barrier in Timeline chart | 12-Sep-2023

  // data1: any;
  // @Input() get() : any {
  //   return this.data1;
  // }
  constructor(
    private lcmapi: LCMApiService,
    public datePipe: DatePipe,
    private custapi: CustomerApiService,
    private eventDate: EventDatesService,
  ) {}

  spotValChart: any[] = [];
  noteMasterID: any;
  templateCode: any = 'EquityAutocallables'; //Hardcoded for Sntndr || Asked by Nitish K, Kundan A
  templateDataCSV: any =
    'TradeDate;InitialSpotList;ShareCcyString;IRString;VolString;TenorDays;init_exp;PathExp1;PayOff;OutputExpression1'; //Hardcoded for Sntndr || Asked by Nitish K, Kundan A
  Mode: any = 'tradedate'; //Hardcoded for Sntndr || Asked by Nitish K, Kundan A
  dates: any = [];
  spots: any = [];
  dates2: any = [];
  spots2: any = [];
  dates3: any = [];
  spots3: any = [];
  dates4: any = [];
  spots4: any = [];
  showChart3: boolean = false;
  showChart4: boolean = false;
  VisitedPerAct: any = 'Actual';
  monthsArr = [
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
    'Nov',
    'Dec',
  ];
  uniqueMonth: any = [];
  uniqueMonthCombined: any = [];
  // productName : any = "";
  Underlying1 = '';
  templateID: any = '8'; //Hardcoded for Sntndr || Asked by Nitish K, Kundan A
  getWhatIfResp: any = '';

  // underlying1 = "";
  Underlying2 = '';
  Underlying3 = '';
  Underlying4 = '';
  showPerformanceTradeDate: boolean = false;
  showthreeCharts = false;
  showFourCharts = false;
  underlyingsCount: number = 4;
  knockOutDate : string = '';
  autocallFlag : boolean = false;

  mon_2_1 = [];
  loader1 = true;
  loader2 = true;
  commonDates: any = [];
  maturityDate: any = '';
  nextCouponDate: any = '';
  // pastCouponDate: any = '';
  rangeTillMaturityDate: any = [];
  lastCommonDate: any = '';
  EventsData:any=[];
  ObservationDates:any=[];

  returnsChartData: ChartInput = {
    title: '',
    series: [
      {
        name: '',
        data: [],
      },
    ],
    width: 300,
    height: 350,
    chartType: 'line',
    theme: 'dark',
    Xlabels: [],
    tooltipLabels: [],
    lineColor: '#00BEFE',
    markerSize: 5,
    showLabel: true,
  };
  returnsChartData1: ChartInput = {
    title: '',
    series: [
      {
        name: '',
        data: [],
      },
    ],
    width: 300,
    height: 350,
    chartType: 'line',
    theme: 'dark',
    Xlabels: [],
    tooltipLabels: [],
    lineColor: '#00BEFE',
    markerSize: 2,
    showLabel: true,
  };

  returnsChartData2: ChartInput = {
    title: '',
    series: [
      {
        name: '',
        data: [],
      },
    ],
    width: 300,
    height: 350,
    chartType: 'line',
    theme: 'dark',
    Xlabels: [],
    tooltipLabels: [],
    lineColor: '#00BEFE',
    markerSize: 2,
    showLabel: true,
  };

  performanceFromTradeDate: ChartInput = {
    title: '',
    series: [
      // {
      //   name: 'KO',
      //   data: [],
      // },
      // {
      //   name: 'Put Strike',
      //   data: [],
      // },
      // {
      //   name: 'KI',
      //   data: [],
      // },
      // {
      //   name: 'Coupon Barrier',
      //   data: [],
      // },
      // {
      //   name: '',
      //   data: [],
      // },
      // {
      //   name: '',
      //   data: [],
      // },
      // {
      //   name: '',
      //   data: [],
      // },
      // {
      //   name: '',
      //   data: [],
      // },
    ],
    width:  '100%',
    height: 350,
    chartType: 'line',
    theme: 'dark',
    Xlabels: [],
    tooltipLabels: [],
    lineColor: '#00BEFE',
    markerSize: 2,
    showLabel: true,
  };

  underlying3Chart: ChartInput = {
    title: '',
    series: [
      {
        name: '',
        data: [],
      },
    ],
    width: 300,
    height: 350,
    chartType: 'line',
    theme: 'dark',
    Xlabels: [],
    tooltipLabels: [],
    lineColor: '#00BEFE',
    markerSize: 2,
    showLabel: true,
  };

  underlying4Chart: ChartInput = {
    title: '',
    series: [
      {
        name: '',
        data: [],
      },
    ],
    width: 300,
    height: 350,
    chartType: 'line',
    theme: 'dark',
    Xlabels: [],
    tooltipLabels: [],
    lineColor: '#00BEFE',
    markerSize: 2,
    showLabel: true,
  };
  // performanceFromTradeDate:  any[] = [];

  ngOnInit(): void {
    this.underlyingsCount = 0;
    this.noteMasterID = this.NMID;

    this.Underlying1 = this.underlying1;
    this.Underlying2 = this.underlying2;
    this.Underlying3 = this.underlying3;
    this.Underlying4 = this.underlying4;
    const checkAutocall = this.obsTableData?.find((el) => el['autocalledYN'] === 'Y');
    if(checkAutocall !== undefined){
      this.knockOutDate = this.obsTableData[this.obsTableData.length - 1]['observation_Date'];
      this.autocallFlag = true;
    }
    else if(this.obsTableData?.length > 0 && this.obsTableData[0]['cancelledYN'] === 'Y'){
      this.knockOutDate = this.obsTableData[0]['cancelledOn'];
      this.autocallFlag = true;
    }
    else if(this.cancellationData?.length > 0 && this.cancellationData[0]['cancelledYN'] === 'Y'){
      this.knockOutDate = this.cancellationData[0]['cancelledOn'];
      this.autocallFlag = true;
    }

    //this.getSpotDatesChart(this.Underlying1, this.Underlying2);
    this.getChart1();
    this.getEventsData();
  }

  DateFormat(wcfDateStr) {
    try {
      // console.log("CHECK DATE",wcfDateStr)
      if (!wcfDateStr) return '';
      const date1 = new Date(parseInt(wcfDateStr.substr(6)))
        .toString()
        .split(' ');
        // console.log("DATE CHECK 2",date1)
      let date2 = date1[2] + '-' + date1[1] + '-' + date1[3];
      return date2;
    } catch (e) {
      console.log(e);
    }
  }

  getEventsData(){
    this.eventDate.GetProductSchedulefromDB_for_wiki(this.NMID).subscribe((data)=>{
      this.EventsData = data;
      // data?.forEach(element => {
      //   element.PS_Fixing_Date = this.datepipe.transform(element.PS_Fixing_Date, 'dd-MMM-yyyy');
      // });


      for (let index = 0; index < this.EventsData.length; index++) {
        const element = this.EventsData[index];
        element.PS_Fixing_Date = this.datePipe.transform(element.PS_Fixing_Date.split('T')[0], 'dd-MMM-yyyy');
       // console.log("dates",element,this.DateFormat(element.PS_Fixing_Date.split(' ')[0]) );// element.PS_Fixing_Date.toDateString()
        //this.DateFormat(element.PS_Fixing_Date.split(' ')[0]);
        // let datenew:string;
        // datenew = this.datepipe.transform(element.PS_Fixing_Date, 'dd-MMM-yyyy');
        // console.log(datenew)
      }

      // this.ObservationDates = 
      // let ObservationDatesObjArray = this.EventsData.filter((x) =>
      //         x.PS_TSM_Code === 'Coupon'
      //       );

      this.ObservationDates = [];
      let tempDateArr = [];
      let mmObj = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12,
      };
      let dt, mm, yr;
      // Arrow function to push Events and their dates in ObservationDates array in the form of MM/DD/YYYY format
      this.EventsData.forEach(element => {
        // tempDateArr = element.PS_Fixing_Date.trim().split('-');
        // dt = parseInt(tempDateArr[0]);
        // mm = mmObj[tempDateArr[1]];
        // yr = parseInt(tempDateArr[2]);
        const getIconEvent = this.obsTableData?.filter((el) => {
          return el.observation_Date.trim().replaceAll(" ", "-") === element.PS_Fixing_Date
        });
        if(getIconEvent?.length > 0){
          if(this.payoff === 'Autocall'){
            if(this.autocallFlag){
              if(new Date(element.PS_Fixing_Date) <= new Date(this.knockOutDate)){
                this.ObservationDates.push({'Date': element.PS_Fixing_Date.trim(), 'Event':element.PS_TSM_Code.trim(), 'icon':  this.SetStatusCss(getIconEvent[0]['status'], getIconEvent[0]['payout'], Number(getIconEvent[0]['autocall_Coupon']).toFixed(2), getIconEvent[0]['coupon'], getIconEvent[0]['guaranteed'])});
              }
            }
            else{
              this.ObservationDates.push({'Date': element.PS_Fixing_Date.trim(), 'Event':element.PS_TSM_Code.trim(), 'icon':  this.SetStatusCss(getIconEvent[0]['status'], getIconEvent[0]['payout'], Number(getIconEvent[0]['autocall_Coupon']).toFixed(2), getIconEvent[0]['coupon'], getIconEvent[0]['guaranteed'])});
            }
          }
          else if(this.payoff === 'Digital'){
            if(this.autocallFlag){
              if(new Date(element.PS_Fixing_Date) <= new Date(this.knockOutDate)){
                this.ObservationDates.push({'Date': element.PS_Fixing_Date.trim(), 'Event':element.PS_TSM_Code.trim(), 'icon':  this.SetStatusCss(getIconEvent[0]['status'], getIconEvent[0]['payout'], getIconEvent[0]['coupon'], getIconEvent[0]['guaranteed'])});
              }
            }
            else{
              this.ObservationDates.push({'Date': element.PS_Fixing_Date.trim(), 'Event':element.PS_TSM_Code.trim(), 'icon':  this.SetStatusCss(getIconEvent[0]['status'], getIconEvent[0]['payout'], getIconEvent[0]['coupon'], getIconEvent[0]['guaranteed'])});
            }
          }
          else if(this.payoff === 'European Digital'){
            if(this.autocallFlag){
              if(new Date(element.PS_Fixing_Date) <= new Date(this.knockOutDate)){
                this.ObservationDates.push({'Date': element.PS_Fixing_Date.trim(), 'Event':element.PS_TSM_Code.trim(), 'icon':  this.SetStatusCss(getIconEvent[0]['status'], getIconEvent[0]['payout'], getIconEvent[0]['coupon'], getIconEvent[0]['guaranteed'])});
              }
            }
            else{
              this.ObservationDates.push({'Date': element.PS_Fixing_Date.trim(), 'Event':element.PS_TSM_Code.trim(), 'icon':  this.SetStatusCss(getIconEvent[0]['status'], getIconEvent[0]['payout'], getIconEvent[0]['coupon'], getIconEvent[0]['guaranteed'])});
            }
          }
          else if(this.payoff === 'Issuer Callable'){
            if(this.autocallFlag){
              if(new Date(element.PS_Fixing_Date) <= new Date(this.knockOutDate)){
                this.ObservationDates.push({'Date': element.PS_Fixing_Date.trim(), 'Event':element.PS_TSM_Code.trim(), 'icon':  this.SetStatusCss(getIconEvent[0]['status'], getIconEvent[0]['payout'], Number(getIconEvent[0]['call_Coupon']).toFixed(2), getIconEvent[0]['coupon'], getIconEvent[0]['guaranteed'])});
              }
            }
            else{
              this.ObservationDates.push({'Date': element.PS_Fixing_Date.trim(), 'Event':element.PS_TSM_Code.trim(), 'icon':  this.SetStatusCss(getIconEvent[0]['status'], getIconEvent[0]['payout'], Number(getIconEvent[0]['call_Coupon']).toFixed(2), getIconEvent[0]['coupon'], getIconEvent[0]['guaranteed'])});
            }
          }
          else if(this.payoff === 'Reverse'){
            if(this.autocallFlag){
              if(new Date(element.PS_Fixing_Date) <= new Date(this.knockOutDate)){
                this.ObservationDates.push({'Date': element.PS_Fixing_Date.trim(), 'Event':element.PS_TSM_Code.trim(), 'icon':  this.SetStatusCss(getIconEvent[0]['status'], getIconEvent[0]['payout'], getIconEvent[0]['guaranteed'])});
              }
            }
            else{
              this.ObservationDates.push({'Date': element.PS_Fixing_Date.trim(), 'Event':element.PS_TSM_Code.trim(), 'icon':  this.SetStatusCss(getIconEvent[0]['status'], getIconEvent[0]['payout'], getIconEvent[0]['guaranteed'])});
            }
          }
          else if(this.payoff === 'Vanilla'){
            if(this.autocallFlag){
              if(new Date(element.PS_Fixing_Date) <= new Date(this.knockOutDate)){
                this.ObservationDates.push({'Date': element.PS_Fixing_Date.trim(), 'Event':element.PS_TSM_Code.trim(), 'icon':  this.SetStatusCss(getIconEvent[0]['status'], getIconEvent[0]['payout'], getIconEvent[0]['guaranteed'])});
              }
            }
            else{
              this.ObservationDates.push({'Date': element.PS_Fixing_Date.trim(), 'Event':element.PS_TSM_Code.trim(), 'icon':  this.SetStatusCss(getIconEvent[0]['status'], getIconEvent[0]['payout'], getIconEvent[0]['guaranteed'])});
            }
          }
        }
      });
    });
  }

  getSpotDatesChart(Underlying1, Underlying2) {
    // Get date in MM/DD/YYYY format
    function getMMDDYYYY(date) {
      var today = new Date(date);
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      return mm + '/' + dd + '/' + yyyy;
    }

    // Date arithmetic to get next or previous date as per increment
    function getNextDate(date, increment) {
      var nextDay = new Date(date);
      nextDay.setDate(date.getDate() + increment);
      return nextDay;
    }

    // given dates in mm/dd/yyyy format (excluding start, including last date)
    function getDatesBetweenRange(startDate, lastDate) {
      let dt = startDate;
      let range = [];
      // range.push(startDate);
      while (dt !== lastDate) {
        dt = getMMDDYYYY(getNextDate(new Date(dt), 1));
        range.push(dt);
      }
      // range.push(lastDate);
      return range;
    }

    // Function to get last working date
    function fetchLastCommonDate(arr) {
      let lastDate = getMMDDYYYY(getNextDate(new Date(), -1));
      let ind = arr.indexOf(lastDate);
      let lastDate2;
      if (ind === -1) {
        let cnt = 5;
        while (cnt) {
          console.log('IN WHILE LOOP LAST DATE', lastDate);
          lastDate2 = new Date(lastDate);
          lastDate = getMMDDYYYY(getNextDate(lastDate2, -1));
          if (arr.indexOf(lastDate) !== -1) break;
          cnt--;
        }
      }
      return lastDate;
    }

    this.lcmapi
      .GetSpotsforNmid(
        this.noteMasterID,
        this.templateCode,
        this.templateDataCSV,
        this.Mode,
        AppConfig.settings.oRes.homeEntityID
      )
      .subscribe((res) => {
        let spotRes: any = res;

        // if (res == '') {
        //   spotRes.length == 0;
        // } else {
        //   spotRes = res.GetSpotsForNMIDResult;
        // }

        let temp = [];

        // for ACTUAL underlyings
        if (spotRes.length != 0 && this.VisitedPerAct == 'Actual') {
          // Find Maturity Date from rmwdataArray using NMID
          let str = '';
          let after_ = '';
          let maturityDate = '8/4/2023';
          for (let i = 0; i < this.rmwdataArray.length; i++) {
            str = this.rmwdataArray[i].Product_Name;
            after_ = str.slice(str.indexOf('#') + 1);
            if (after_ === this.NMID.toString()) {
              maturityDate = this.rmwdataArray[i].Maturity_Date;
              // this.pastCouponDate = this.rmwdataArray[i].PastCoupon;
              // this.nextCouponDate = this.rmwdataArray[i].NextCouponDate;
              break;
            }
          }

          let tempDateArr = maturityDate.split('-');
          let dt = parseInt(tempDateArr[0]);
          let mmObj = {
            Jan: 1,
            Feb: 2,
            Mar: 3,
            Apr: 4,
            May: 5,
            Jun: 6,
            Jul: 7,
            Aug: 8,
            Sep: 9,
            Oct: 10,
            Nov: 11,
            Dec: 12,
          };
          let mm = mmObj[tempDateArr[1]];
          let yr = parseInt(tempDateArr[2]);

          maturityDate = mm + '/' + dt + '/' + yr;
          this.maturityDate = maturityDate;

          // tempDateArr = this.pastCouponDate.split('-');
          // dt = parseInt(tempDateArr[0]);
          // mm = mmObj[tempDateArr[1]];

          // for one underlying actual graph data
          if (Underlying1?.trim() && !Underlying2?.trim()) { //to handle empty/white-space in second-underlying i.e. when only one UL exist || KaustubhS || 01-Sep-2023
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date1 != ' ') {
                temp[i] = spotRes[i].Date1;
                let dateTemp = temp[i].split(' ');

                this.dates[i] = dateTemp[0];
                this.spots[i] = spotRes[i].Spot1;
              }
            }
            let actualValArray = [];
            actualValArray = this.getActualSpotData(this.dates, this.spots);
            console.log('ONE UNDERLYING', actualValArray);

            this.commonDates = this.dates.filter((x) => x != '');

            this.lastCommonDate = fetchLastCommonDate(this.commonDates);
            let ind;

            let indexOfLastDate = this.commonDates.indexOf(this.lastCommonDate);

            let dt1 = new Date(this.maturityDate);
            let dt2 = new Date(this.lastCommonDate);
            // If maturity date is before lastcommon date
            if (dt1 < dt2) {
              this.returnsChartData.Xlabels = this.commonDates;
              this.returnsChartData.series[0].data = actualValArray[1];
            } else {
              // Iterating over commonDates array and populating data for all underlyings apexcharts
              for (let i = 0; i < this.commonDates.length; i++) {
                ind = actualValArray[0].indexOf(this.commonDates[i]);
                this.returnsChartData.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  actualValArray[1][ind] != 'NaN' &&
                  actualValArray[1][ind] != '' &&
                  actualValArray[1][ind] != undefined
                )
                  this.returnsChartData.series[0].data.push(
                    Number(actualValArray[1][ind]).toFixed(2)
                  );
                else this.returnsChartData.series[0].data.push(null);
              }
            }

            if (this.returnsChartData.series[0].data.length == 0) {
              this.loader1 = true;
            } else {
              this.loader1 = false;
            }
            this.showChart3 = true;
            this.showChart4 = false;
          }
          // for two underlyings actual graph data
          else if (
            Underlying1?.trim() &&
            Underlying2?.trim() &&
            this.Underlying3?.trim().length <= 1
          ) {
            this.loader1 = false;
            this.showChart3 = false;
            this.showthreeCharts = false;
            this.showFourCharts = false;
            let temp2 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date1 != ' ') {
                temp2[i] = spotRes[i].Date1;
                let dateTemp = temp2[i].split(' ');

                this.dates[i] = dateTemp[0];
                this.spots[i] = spotRes[i].Spot1;
              }
            }
            let temp1 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date2 != ' ') {
                temp1[i] = spotRes[i].Date2;
                let dateTemp = temp1[i].split(' ');

                this.dates2[i] = dateTemp[0];
                this.spots2[i] = spotRes[i].Spot2;
              }
            }

            let actualValArray = [];
            actualValArray = this.getActualSpotData(this.dates, this.spots);
            let actualValArray1 = [];
            actualValArray1 = this.getActualSpotData(this.dates2, this.spots2);

            this.commonDates = this.dates.filter((x) =>
              this.dates2.includes(x)
            );
            this.lastCommonDate = fetchLastCommonDate(this.commonDates);

            let ind;
            let indexOfLastDate = this.commonDates.indexOf(this.lastCommonDate);

            let dt1 = new Date(this.maturityDate);
            let dt2 = new Date(this.lastCommonDate);
            // If maturity date is before lastcommon date
            if (dt1 < dt2) {
              this.returnsChartData1.Xlabels = this.commonDates;
              this.returnsChartData2.Xlabels = this.commonDates;

              this.returnsChartData1.series[0].data = actualValArray[1];
              this.returnsChartData2.series[0].data = actualValArray1[1];
            } else {
              // Iterating over commonDates array and populating data for all underlyings apexcharts
              for (let i = 0; i < this.commonDates.length; i++) {
                ind = actualValArray[0].indexOf(this.commonDates[i]);
                this.returnsChartData1.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  actualValArray[1][ind] != 'NaN' &&
                  actualValArray[1][ind] != '' &&
                  actualValArray[1][ind] != undefined
                )
                  this.returnsChartData1.series[0].data.push(
                    Number(actualValArray[1][ind]).toFixed(2)
                  );
                else this.returnsChartData1.series[0].data.push(null);
              }

              for (let i = 0; i < this.commonDates.length; i++) {
                ind = actualValArray1[0].indexOf(this.commonDates[i]);
                this.returnsChartData2.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  actualValArray1[1][ind] != 'NaN' &&
                  actualValArray1[1][ind] != '' &&
                  actualValArray1[1][ind] != undefined
                )
                  this.returnsChartData2.series[0].data.push(
                    Number(actualValArray1[1][ind]).toFixed(2)
                  );
                else this.returnsChartData2.series[0].data.push(null);
              }
            }

            let len1 = this.returnsChartData1.series[0].data.length;
            let len2 = this.returnsChartData2.series[0].data.length;
            let l1;
            // console.log("LENGTHDS=",len1,len2);
            // if(len1 > len2)
            // {
            //   // this.returnsChartData2.series[0].data = [];
            //   l1 = this.returnsChartData2.series[0].data.length - 1;
            //   console.log("L! =",l1,this.returnsChartData1.series[0].data.length - 1)
            //   for(let i= 0 ;i < len1 ; i++)
            //   {
            //     this.returnsChartData2.series[0].data.push(Number(this.returnsChartData2.series[0].data[l1]).toFixed(2));
            //   }
            // }
            // else if(len2 > len1)
            // {
            //   // this.returnsChartData1.series[0].data = [];
            //   l1 = this.returnsChartData1.series[0].data.length - 1;
            //   console.log("L! =",l1,this.returnsChartData1.series[0].data.length - 1)
            //   for(let i= 0 ;i < len1 ; i++)
            //   {
            //     this.returnsChartData1.series[0].data.push(Number(this.returnsChartData1.series[0].data[l1]).toFixed(2));
            //   }
            // }
            this.showChart4 = true;
          }
          // for three underlyings actual graph data
          else if (
            Underlying1?.trim() &&
            Underlying2?.trim() &&
            this.Underlying3?.trim().length > 1 &&
            this.Underlying4?.trim().length <= 1
          ) {
            this.loader1 = false;
            this.showthreeCharts = true;
            let temp2 = [];

            // first underlying val
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date1 != ' ') {
                temp2[i] = spotRes[i].Date1;
                let dateTemp = temp2[i].split(' ');
                this.dates[i] = dateTemp[0];
                this.spots[i] = spotRes[i].Spot1;
              }
            }
            // second underlying val
            let temp1 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date2 != ' ') {
                temp1[i] = spotRes[i].Date2;
                let dateTemp = temp1[i].split(' ');

                this.dates2[i] = dateTemp[0];
                this.spots2[i] = spotRes[i].Spot2;
              }
            }

            // third underlying val
            let tempArr3 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date3 != ' ') {
                tempArr3[i] = spotRes[i].Date3;
                let dateTemp = tempArr3[i].split(' ');
                this.dates3[i] = dateTemp[0];
                this.spots3[i] = spotRes[i].Spot3;
              }
            }

            let actualValArray1 = [];
            actualValArray1 = this.getActualSpotData(this.dates, this.spots);

            let actualValArray2 = [];
            actualValArray2 = this.getActualSpotData(this.dates2, this.spots2);

            let actualValArray3 = [];
            actualValArray3 = this.getActualSpotData(this.dates3, this.spots3);

            this.commonDates = this.dates.filter((x) =>
              this.dates2.includes(x)
            );
            this.commonDates = this.commonDates.filter((x) =>
              this.dates3.includes(x)
            );

            // console.log(getNextDate(new Date(), -1));

            this.lastCommonDate = fetchLastCommonDate(this.commonDates);

            //             // issueDate =
            //   //  Create a new date object
            //           const new_Date = new Date();
            // // Converting date to string
            //           const result = new_Date.toLocaleString();

            // console.log("The date string according to current locale is: " + result);
            // // Convert the date object to US specific date string
            // const result2 = new_Date.toLocaleString("en-US");
            // console.log("The date string according to US specific locale is: " + result2);
            // Date.prototype.addDays = function(days) {
            //   var date = new Date(this.valueOf());
            //   date.setDate(date.getDate() + days);
            //   return date;
            // }

            let ind;

            let indexOfLastDate = this.commonDates.indexOf(this.lastCommonDate);

            let dt1 = new Date(this.maturityDate);
            let dt2 = new Date(this.lastCommonDate);
            // If maturity date is before lastcommon date
            if (dt1 < dt2) {
              this.returnsChartData1.Xlabels = this.commonDates;
              this.returnsChartData2.Xlabels = this.commonDates;
              this.underlying3Chart.Xlabels = this.commonDates;

              this.returnsChartData1.series[0].data = actualValArray1[1];
              this.returnsChartData2.series[0].data = actualValArray2[1];
              this.underlying3Chart.series[0].data = actualValArray3[1];
            } else {
              // Iterating over commonDates array and populating data for all underlyings apexcharts
              for (let i = 0; i < this.commonDates.length; i++) {
                ind = actualValArray1[0].indexOf(this.commonDates[i]);
                this.returnsChartData1.Xlabels[i] = this.commonDates[i];
                if (
                  i <= indexOfLastDate &&
                  actualValArray1[1][ind] != 'NaN' &&
                  actualValArray1[1][ind] != '' &&
                  actualValArray1[1][ind] != undefined
                )
                  this.returnsChartData1.series[0].data.push(
                    Number(actualValArray1[1][ind]).toFixed(2)
                  );
                else this.returnsChartData1.series[0].data.push(null);
              }

              for (let i = 0; i < this.commonDates.length; i++) {
                ind = actualValArray2[0].indexOf(this.commonDates[i]);
                this.returnsChartData2.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  actualValArray2[1][ind] != 'NaN' &&
                  actualValArray2[1][ind] != '' &&
                  actualValArray2[1][ind] != undefined
                )
                  this.returnsChartData2.series[0].data.push(
                    Number(actualValArray2[1][ind]).toFixed(2)
                  );
                else this.returnsChartData2.series[0].data.push(null);
              }

              for (let i = 0; i < this.commonDates.length; i++) {
                ind = actualValArray3[0].indexOf(this.commonDates[i]);
                this.underlying3Chart.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  actualValArray3[1][ind] != 'NaN' &&
                  actualValArray3[1][ind] != '' &&
                  actualValArray3[1][ind] != undefined
                )
                  this.underlying3Chart.series[0].data.push(
                    Number(actualValArray3[1][ind]).toFixed(2)
                  );
                else this.underlying3Chart.series[0].data.push(null);
              }
            }

          } 
          // For FOUR underlyings ACTUAL graph data
          else if (
            Underlying1?.trim() &&
            Underlying2?.trim() &&
            this.Underlying3?.trim().length > 1 &&
            this.Underlying4?.trim().length > 1
          ) {
            this.loader1 = false;
            this.showthreeCharts = false;
            this.showFourCharts = true;

            // first underlying val
            let temp2 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date1 != ' ') {
                temp2[i] = spotRes[i].Date1;
                let dateTemp = temp2[i].split(' ');
                this.dates[i] = dateTemp[0];
                this.spots[i] = spotRes[i].Spot1;
              }
            }
            // second underlying val
            let temp1 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date2 != ' ') {
                temp1[i] = spotRes[i].Date2;
                let dateTemp = temp1[i].split(' ');

                this.dates2[i] = dateTemp[0];
                this.spots2[i] = spotRes[i].Spot2;
              }
            }

            // third underlying val
            let tempArr3 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date3 != ' ') {
                tempArr3[i] = spotRes[i].Date3;
                let dateTemp = tempArr3[i].split(' ');
                this.dates3[i] = dateTemp[0];
                this.spots3[i] = spotRes[i].Spot3;
              }
            }

            // fourth underlying val
            let tempArr4 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date4 != ' ') {
                tempArr4[i] = spotRes[i].Date4;
                let dateTemp = tempArr4[i].split(' ');
                this.dates4[i] = dateTemp[0];
                this.spots4[i] = spotRes[i].Spot4;
              }
            }

            let actualValArray1 = [];
            actualValArray1 = this.getActualSpotData(this.dates, this.spots);

            let actualValArray2 = [];
            actualValArray2 = this.getActualSpotData(this.dates2, this.spots2);

            let actualValArray3 = [];
            actualValArray3 = this.getActualSpotData(this.dates3, this.spots3);

            let actualValArray4 = [];
            actualValArray4 = this.getActualSpotData(this.dates4, this.spots4);

            this.commonDates = this.dates.filter((x) =>
              this.dates2.includes(x)
            );
            this.commonDates = this.commonDates.filter((x) =>
              this.dates3.includes(x)
            );
            this.commonDates = this.commonDates.filter((x) =>
              this.dates4.includes(x)
            );

            // get last common date from intersection array
            this.lastCommonDate = fetchLastCommonDate(this.commonDates);

            let ind;
            let indexOfLastDate = this.commonDates.indexOf(this.lastCommonDate);

            let dt1 = new Date(this.maturityDate);
            let dt2 = new Date(this.lastCommonDate);
            // If maturity date is before lastcommon date
            if (dt1 < dt2) {
              this.returnsChartData1.Xlabels = this.commonDates;
              this.returnsChartData2.Xlabels = this.commonDates;
              this.underlying3Chart.Xlabels = this.commonDates;
              this.underlying4Chart.Xlabels = this.commonDates;

              this.returnsChartData1.series[0].data = actualValArray1[1];
              this.returnsChartData2.series[0].data = actualValArray2[1];
              this.underlying3Chart.series[0].data = actualValArray3[1];
              this.underlying4Chart.series[0].data = actualValArray4[1];
            } else {
              // Iterating over commonDates array and populating data for all underlyings apexcharts
              for (let i = 0; i < this.commonDates.length; i++) {
                ind = actualValArray1[0].indexOf(this.commonDates[i]);
                this.returnsChartData1.Xlabels[i] = this.commonDates[i];
                if (
                  i <= indexOfLastDate &&
                  actualValArray1[1][ind] != 'NaN' &&
                  actualValArray1[1][ind] != '' &&
                  actualValArray1[1][ind] != undefined
                )
                  this.returnsChartData1.series[0].data.push(
                    Number(actualValArray1[1][ind]).toFixed(2)
                  );
                else this.returnsChartData1.series[0].data.push(null);
              }

              for (let i = 0; i < this.commonDates.length; i++) {
                ind = actualValArray2[0].indexOf(this.commonDates[i]);
                this.returnsChartData2.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  actualValArray2[1][ind] != 'NaN' &&
                  actualValArray2[1][ind] != '' &&
                  actualValArray2[1][ind] != undefined
                )
                  this.returnsChartData2.series[0].data.push(
                    Number(actualValArray2[1][ind]).toFixed(2)
                  );
                else this.returnsChartData2.series[0].data.push(null);
              }

              for (let i = 0; i < this.commonDates.length; i++) {
                ind = actualValArray3[0].indexOf(this.commonDates[i]);
                this.underlying3Chart.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  actualValArray3[1][ind] != 'NaN' &&
                  actualValArray3[1][ind] != '' &&
                  actualValArray3[1][ind] != undefined
                )
                  this.underlying3Chart.series[0].data.push(
                    Number(actualValArray3[1][ind]).toFixed(2)
                  );
                else this.underlying3Chart.series[0].data.push(null);
              }

              for (let i = 0; i < this.commonDates.length; i++) {
                ind = actualValArray4[0].indexOf(this.commonDates[i]);
                this.underlying4Chart.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  actualValArray4[1][ind] != 'NaN' &&
                  actualValArray4[1][ind] != '' &&
                  actualValArray4[1][ind] != undefined
                )
                  this.underlying4Chart.series[0].data.push(
                    Number(actualValArray4[1][ind]).toFixed(2)
                  );
                else this.underlying4Chart.series[0].data.push(null);
              }
            }
          }
        } 
        // for SPOT PERCENT underlyings
        else if (spotRes.length != 0 && this.VisitedPerAct == 'Percent') {
          let str = '';
          let after_ = '';
          let maturityDate = '8/4/2023';
          for (let i = 0; i < this.rmwdataArray.length; i++) {
            str = this.rmwdataArray[i].Product_Name;
            after_ = str.slice(str.indexOf('#') + 1);
            if (after_ === this.NMID.toString()) {
              maturityDate = this.rmwdataArray[i].Maturity_Date;
              break;
            }
          }

          let tempDateArr = maturityDate.split('-');
          let dt = parseInt(tempDateArr[0]);
          let mmObj = {
            Jan: 1,
            Feb: 2,
            Mar: 3,
            Apr: 4,
            May: 5,
            Jun: 6,
            Jul: 7,
            Aug: 8,
            Sep: 9,
            Oct: 10,
            Nov: 11,
            Dec: 12,
          };
          let mm = mmObj[tempDateArr[1]];
          let yr = parseInt(tempDateArr[2]);

          maturityDate = mm + '/' + dt + '/' + yr;
          this.maturityDate = maturityDate;

          // this.showChart3 = false;
          // For one underlying Percent
          if (this.Underlying1 != '' && this.Underlying2 == ' ') {
            let returnArr = [];
            let temp = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date1 != '') {
                temp[i] = spotRes[i].Date1;
                let dateTemp = temp[i].split(' ');

                this.dates[i] = dateTemp[0];
                this.spots[i] = spotRes[i].Spot1;
              }
            }
            let temp1 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (this.dates[i] != '') {
                temp1.push(this.dates[i]);
              }
            }
            this.dates = ' ';
            this.dates = temp1;
            this.returnsChartData.series.name = this.Underlying1;
            for (let i = 0; i < spotRes.length; i++) {
              this.returnsChartData.series[0].data = [];
              this.returnsChartData.Xlabels = [];
              this.returnsChartData.tooltipLabels[i] = this.dates[i];
            }
            returnArr = this.getPerSpotChart(this.dates, this.spots);
            // for(let i=0; i < this.dates.length; i++ )
            // {
            //   this.returnsChartData.Xlabels[i] = returnArr[0][i] ;
            // }
            // for(let i=0; i < returnArr[1].length; i++ )
            // {
            //   if(returnArr[1][i] != 'NaN' && returnArr[1][i] != '' && returnArr[1][i] != undefined)
            //   this.returnsChartData.series[0].data.push(returnArr[1][i]);
            // }
            this.commonDates = this.dates.filter((x) => x != '');

            this.lastCommonDate = fetchLastCommonDate(this.commonDates);

            let indexOfLastDate = this.commonDates.indexOf(this.lastCommonDate);

            let ind;

            let dt1 = new Date(this.maturityDate);
            let dt2 = new Date(this.lastCommonDate);
            // If maturity date is before lastcommon date
            if (dt1 < dt2) {
              this.returnsChartData.Xlabels = this.commonDates;
              this.returnsChartData.series[0].data = returnArr[1];
            } else {
              // Iterating over commonDates array and populating data for all underlyings apexcharts
              for (let i = 0; i < this.commonDates.length; i++) {
                ind = returnArr[0].indexOf(this.commonDates[i]);
                this.returnsChartData.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  returnArr[1][ind] != 'NaN' &&
                  returnArr[1][ind] != '' &&
                  returnArr[1][ind] != undefined
                )
                  this.returnsChartData.series[0].data.push(
                    Number(returnArr[1][ind]).toFixed(2)
                  );
                else this.returnsChartData.series[0].data.push(null);
              }
            }

            if (this.returnsChartData.series[0].data.length == 0) {
              this.loader1 = true;
            } else {
              this.loader1 = false;
            }
            this.showChart3 = true;
            this.showChart4 = false;
          }
          // For two underlying Percent
          else if (
            Underlying1 != undefined &&
            Underlying2 != undefined &&
            this.Underlying3.length <= 1
          ) {
            let returnArr = [];
            let temp = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date1 != ' ') {
                temp[i] = spotRes[i].Date1;
                let dateTemp = temp[i].split(' ');

                this.dates[i] = dateTemp[0];
                this.spots[i] = spotRes[i].Spot1;
              }
            }
            let temp1 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (this.dates[i] != '') {
                temp1.push(this.dates[i]);
              }
            }
            //for 2nd underlying in 2 charts
            let datesNew = [];
            let spotNew = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date2 != '') {
                temp[i] = spotRes[i].Date2;
                let dateTemp = temp[i].split(' ');

                datesNew[i] = dateTemp[0];
                spotNew[i] = spotRes[i].Spot2;
              }
            }
            let temp2 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (this.dates[i] != '') {
                temp2.push(datesNew[i]);
              }
            }
            this.dates = ' ';
            this.dates = temp1;
            // console.log("Returns array for 2 udrlyings = ",returnArr);
            this.returnsChartData1.series.name = this.Underlying1;
            this.returnsChartData2.series.name = this.Underlying2;
            returnArr = this.getPerSpotChart(this.dates, this.spots);

            datesNew = [];
            datesNew = temp2;
            let returnArr2 = this.getPerSpotChart(datesNew, spotNew);

            this.lastCommonDate = fetchLastCommonDate(this.commonDates);

            let indexOfLastDate = this.commonDates.indexOf(this.lastCommonDate);

            let ind;
            let dt1 = new Date(this.maturityDate);
            let dt2 = new Date(this.lastCommonDate);
            // If maturity date is before lastcommon date
            if (dt1 < dt2) {
              this.returnsChartData1.Xlabels = this.commonDates;
              this.returnsChartData2.Xlabels = this.commonDates;

              this.returnsChartData1.series[0].data = returnArr[1];
              this.returnsChartData2.series[0].data = returnArr2[1];
            } else {
              // Iterating over commonDates array and populating data for all underlyings apexcharts
              for (let i = 0; i < this.commonDates.length; i++) {
                ind = returnArr[0].indexOf(this.commonDates[i]);
                this.returnsChartData1.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  returnArr[1][ind] != 'NaN' &&
                  returnArr[1][ind] != '' &&
                  returnArr[1][ind] != undefined
                )
                  this.returnsChartData1.series[0].data.push(
                    Number(returnArr[1][ind]).toFixed(2)
                  );
                else this.returnsChartData1.series[0].data.push(null);
              }

              for (let i = 0; i < this.commonDates.length; i++) {
                ind = returnArr2[0].indexOf(this.commonDates[i]);
                this.returnsChartData2.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  returnArr2[1][i] != 'NaN' &&
                  returnArr2[1][i] != '' &&
                  returnArr2[1][i] != undefined
                )
                  this.returnsChartData2.series[0].data.push(
                    Number(returnArr2[1][ind]).toFixed(2)
                  );
                else this.returnsChartData2.series[0].data.push(null);
              }
            }

            if (this.returnsChartData.series[0].data.length == 0) {
              this.loader1 = true;
            } else {
              this.loader1 = false;
            }
            this.showChart3 = false;
            this.showChart4 = true;
            //ended for 2nd underlying in 2 charts
          } 
          // for 3 underlyings percent graph
          else if (
            Underlying1 != undefined &&
            Underlying2 != undefined &&
            this.Underlying3.length > 1 &&
            this.Underlying4.length <= 1
          ) {
            let returnArr = [];
            let temp = [];
            // 1st Underlying Vals
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date1 != '') {
                temp[i] = spotRes[i].Date1;
                let dateTemp = temp[i].split(' ');

                this.dates[i] = dateTemp[0];
                this.spots[i] = spotRes[i].Spot1;
              }
            }
            let temp1 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (this.dates[i] != '') {
                temp1.push(this.dates[i]);
              }
            }
            // 2nd Underlying Vals
            let datesNew = [];
            let spotNew = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date2 != '') {
                temp[i] = spotRes[i].Date2;
                let dateTemp = temp[i].split(' ');

                datesNew[i] = dateTemp[0];
                spotNew[i] = spotRes[i].Spot2;
              }
            }
            let temp2 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (this.dates[i] != '') {
                temp2.push(datesNew[i]);
              }
            }
            // 3rd Underlying Vals
            let datesNew3 = [];
            let spotNew3 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date3 != '') {
                temp[i] = spotRes[i].Date3;
                let dateTemp = temp[i].split(' ');

                datesNew3[i] = dateTemp[0];
                spotNew3[i] = spotRes[i].Spot3;
              }
            }
            let temp3 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (this.dates[i] != '') {
                temp3.push(datesNew3[i]);
              }
            }

            this.dates = ' ';
            this.dates = temp1;
            returnArr = this.getPerSpotChart(this.dates, this.spots);

            datesNew = [];
            datesNew = temp2;
            let returnArr2 = this.getPerSpotChart(datesNew, spotNew);

            datesNew3 = [];
            datesNew3 = temp3;
            let returnArr3 = this.getPerSpotChart(datesNew3, spotNew3);

            this.commonDates = this.dates.filter((x) => datesNew.includes(x));
            this.commonDates = this.commonDates.filter((x) =>
              datesNew3.includes(x)
            );

            this.lastCommonDate = fetchLastCommonDate(this.commonDates);

            this.returnsChartData1.series.name = this.Underlying1;
            this.returnsChartData2.series.name = this.Underlying2;
            this.underlying3Chart.series.name = this.Underlying3;

            let indexOfLastDate = this.commonDates.indexOf(this.lastCommonDate);

            let ind;

            let dt1 = new Date(this.maturityDate);
            let dt2 = new Date(this.lastCommonDate);
            // If maturity date is before lastcommon date
            if (dt1 < dt2) {
              this.returnsChartData1.Xlabels = this.commonDates;
              this.returnsChartData2.Xlabels = this.commonDates;
              this.underlying3Chart.Xlabels = this.commonDates;

              this.returnsChartData1.series[0].data = returnArr[1];
              this.returnsChartData2.series[0].data = returnArr2[1];
              this.underlying3Chart.series[0].data = returnArr3[1];
            } else {
              // Iterating over commonDates array and populating data for all underlyings apexcharts
              for (let i = 0; i < this.commonDates.length; i++) {
                ind = returnArr[0].indexOf(this.commonDates[i]);
                this.returnsChartData1.Xlabels[i] = this.commonDates[i];
                // this.returnsChartData1.series[0].data.push(Number(returnArr[1][ind]).toFixed(2));
                if (
                  i <= indexOfLastDate &&
                  returnArr[1][ind] != 'NaN' &&
                  returnArr[1][ind] != '' &&
                  returnArr[1][ind] != undefined
                )
                  this.returnsChartData1.series[0].data.push(
                    Number(returnArr[1][ind]).toFixed(2)
                  );
                else this.returnsChartData1.series[0].data.push(null);
              }

              for (let i = 0; i < this.commonDates.length; i++) {
                ind = returnArr2[0].indexOf(this.commonDates[i]);
                this.returnsChartData2.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  returnArr2[1][ind] != 'NaN' &&
                  returnArr2[1][ind] != '' &&
                  returnArr2[1][ind] != undefined
                )
                  this.returnsChartData2.series[0].data.push(
                    Number(returnArr2[1][ind]).toFixed(2)
                  );
                else this.returnsChartData2.series[0].data.push(null);
              }

              this.showChart3 = false;
              this.showChart4 = true;

              for (let i = 0; i < this.commonDates.length; i++) {
                ind = returnArr3[0].indexOf(this.commonDates[i]);
                this.underlying3Chart.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  returnArr3[1][ind] != 'NaN' &&
                  returnArr3[1][ind] != '' &&
                  returnArr3[1][ind] != undefined
                )
                  this.underlying3Chart.series[0].data.push(
                    Number(returnArr3[1][ind]).toFixed(2)
                  );
                else this.underlying3Chart.series[0].data.push(null);
              }
            }

            // console.log("--------------------",this.underlying3Chart.series)
            this.showChart3 = false;
            this.showChart4 = false;
            this.showthreeCharts = true;
            // console.log("3 underlyings charts = ",this.returnsChartData1,this.returnsChartData2,this.underlying3Chart)
            //ended for 3rd underlying in 3 charts
          } 
          // for 4 underlyings percent graph
          else if (
            Underlying1 != undefined &&
            Underlying2 != undefined &&
            this.Underlying3.length > 1 &&
            this.Underlying4.length > 1
          ) {
            let returnArr = [];
            let temp = [];
            // 1st Underlying Vals
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date1 != '') {
                temp[i] = spotRes[i].Date1;
                let dateTemp = temp[i].split(' ');

                this.dates[i] = dateTemp[0];
                this.spots[i] = spotRes[i].Spot1;
              }
            }
            let temp1 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (this.dates[i] != '') {
                temp1.push(this.dates[i]);
              }
            }
            // 2nd Underlying Vals
            let datesNew = [];
            let spotNew = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date2 != '') {
                temp[i] = spotRes[i].Date2;
                let dateTemp = temp[i].split(' ');

                datesNew[i] = dateTemp[0];
                spotNew[i] = spotRes[i].Spot2;
              }
            }
            let temp2 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (this.dates[i] != '') {
                temp2.push(datesNew[i]);
              }
            }
            // 3rd Underlying Vals
            let datesNew3 = [];
            let spotNew3 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date3 != '') {
                temp[i] = spotRes[i].Date3;
                let dateTemp = temp[i].split(' ');

                datesNew3[i] = dateTemp[0];
                spotNew3[i] = spotRes[i].Spot3;
              }
            }
            let temp3 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (this.dates[i] != '') {
                temp3.push(datesNew3[i]);
              }
            }
            // 4th Underlying Vals
            let datesNew4 = [];
            let spotNew4 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (spotRes[i].Date4 != '') {
                temp[i] = spotRes[i].Date4;
                let dateTemp = temp[i].split(' ');

                datesNew4[i] = dateTemp[0];
                spotNew4[i] = spotRes[i].Spot4;
              }
            }
            let temp4 = [];
            for (let i = 0; i < spotRes.length; i++) {
              if (this.dates[i] != '') {
                temp4.push(datesNew4[i]);
              }
            }

            this.dates = ' ';
            this.dates = temp1;
            returnArr = this.getPerSpotChart(this.dates, this.spots);

            datesNew = [];
            datesNew = temp2;
            let returnArr2 = this.getPerSpotChart(datesNew, spotNew);

            datesNew3 = [];
            datesNew3 = temp3;
            let returnArr3 = this.getPerSpotChart(datesNew3, spotNew3);

            datesNew4 = [];
            datesNew4 = temp4;
            let returnArr4 = this.getPerSpotChart(datesNew4, spotNew4);

            this.commonDates = this.dates.filter((x) => datesNew.includes(x));
            this.commonDates = this.commonDates.filter((x) =>
              datesNew3.includes(x)
            );
            this.commonDates = this.commonDates.filter((x) =>
              datesNew4.includes(x)
            );

            this.lastCommonDate = fetchLastCommonDate(this.commonDates);

            this.returnsChartData1.series.name = this.Underlying1;
            this.returnsChartData2.series.name = this.Underlying2;
            this.underlying3Chart.series.name = this.Underlying3;
            this.underlying4Chart.series.name = this.Underlying4;

            let indexOfLastDate = this.commonDates.indexOf(this.lastCommonDate);

            let ind;

            let dt1 = new Date(this.maturityDate);
            let dt2 = new Date(this.lastCommonDate);
            // If maturity date is before lastcommon date
            if (dt1 < dt2) {
              this.returnsChartData1.Xlabels = this.commonDates;
              this.returnsChartData2.Xlabels = this.commonDates;
              this.underlying3Chart.Xlabels = this.commonDates;
              this.underlying4Chart.Xlabels = this.commonDates;

              this.returnsChartData1.series[0].data = returnArr[1];
              this.returnsChartData2.series[0].data = returnArr2[1];
              this.underlying3Chart.series[0].data = returnArr3[1];
              this.underlying4Chart.series[0].data = returnArr4[1];
            } else {
              // Iterating over commonDates array and populating data for all underlyings apexcharts
              for (let i = 0; i < this.commonDates.length; i++) {
                ind = returnArr[0].indexOf(this.commonDates[i]);
                this.returnsChartData1.Xlabels[i] = this.commonDates[i];
                // this.returnsChartData1.series[0].data.push(Number(returnArr[1][ind]).toFixed(2));
                if (
                  i <= indexOfLastDate &&
                  returnArr[1][ind] != 'NaN' &&
                  returnArr[1][ind] != '' &&
                  returnArr[1][ind] != undefined
                )
                  this.returnsChartData1.series[0].data.push(
                    Number(returnArr[1][ind]).toFixed(2)
                  );
                else this.returnsChartData1.series[0].data.push(null);
              }

              for (let i = 0; i < this.commonDates.length; i++) {
                ind = returnArr2[0].indexOf(this.commonDates[i]);
                this.returnsChartData2.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  returnArr2[1][ind] != 'NaN' &&
                  returnArr2[1][ind] != '' &&
                  returnArr2[1][ind] != undefined
                )
                  this.returnsChartData2.series[0].data.push(
                    Number(returnArr2[1][ind]).toFixed(2)
                  );
                else this.returnsChartData2.series[0].data.push(null);
              }
              for (let i = 0; i < this.commonDates.length; i++) {
                ind = returnArr3[0].indexOf(this.commonDates[i]);
                this.underlying3Chart.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  returnArr3[1][ind] != 'NaN' &&
                  returnArr3[1][ind] != '' &&
                  returnArr3[1][ind] != undefined
                )
                  this.underlying3Chart.series[0].data.push(
                    Number(returnArr3[1][ind]).toFixed(2)
                  );
                else this.underlying3Chart.series[0].data.push(null);
              }
              for (let i = 0; i < this.commonDates.length; i++) {
                ind = returnArr4[0].indexOf(this.commonDates[i]);
                this.underlying4Chart.Xlabels[i] = this.commonDates[i];

                if (
                  i <= indexOfLastDate &&
                  returnArr4[1][ind] != 'NaN' &&
                  returnArr4[1][ind] != '' &&
                  returnArr4[1][ind] != undefined
                )
                  this.underlying4Chart.series[0].data.push(
                    Number(returnArr4[1][ind]).toFixed(2)
                  );
                else this.underlying4Chart.series[0].data.push(null);
              }
            }

            this.showChart3 = false;
            this.showChart4 = false;
            this.showthreeCharts = false;
            this.showFourCharts = true;
          }
        }
      });
    return this.showChart3;
  }

  ChangePerActual(value: any) {
    this.VisitedPerAct = value;
    this.loader1 = true;
    // console.log("changed val",this.VisitedPerAct);
    this.showChart3 = false;
    this.showChart4 = false;
    this.showthreeCharts = false;
    this.showFourCharts = false;
    this.returnsChartData.series[0].data = [];
    this.returnsChartData.Xlabels = [];
    this.returnsChartData1.series[0].data = [];
    this.returnsChartData1.Xlabels = [];
    this.returnsChartData2.series[0].data = [];
    this.returnsChartData2.Xlabels = [];
    this.underlying3Chart.series[0].data = [];
    this.underlying3Chart.Xlabels = [];
    this.underlying4Chart.series[0].data = [];
    this.underlying4Chart.Xlabels = [];
    this.getSpotDatesChart(this.Underlying1, this.Underlying2);
  }

  getChart1() {
    // this.custapi
    //   .GetTemplateIDFromNMID(this.noteMasterID)
    //   .subscribe(async (res) => {
        this.templateID = '8'; //Hardcoded for Sntndr || Asked by Nitish K, Kundan A
        // if (this.templateID != '') {
        //   this.custapi.GetWhatIfCSV(this.templateID).subscribe((res) => {
        //     this.getWhatIfResp = res.GetWhatIfCSVResult;
        //   });
        // }

        this.lcmapi
          .GetSpotsforNmid(
            this.noteMasterID,
            this.templateCode,
            this.templateDataCSV,
            this.Mode,
            AppConfig.settings.oRes.homeEntityID
          )
          .subscribe((res) => {

            function getDDMMMYYYY(date) {
              let monthsarr = [
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
                'Nov',
                'Dec',
              ];
              var today = new Date(date);
              var dd = today.getDate();
              var mm = today.getMonth();
              var yyyy = today.getFullYear();
              return (dd < 10 ? '0' + dd : dd) + ' ' + monthsarr[mm] + ' ' + yyyy;
            }

            function getMMDDYYYY(date) {
              var today = new Date(date);
              var dd = today.getDate();
              var mm = today.getMonth() + 1;
              var yyyy = today.getFullYear();
              return mm + '/' + dd + '/' + yyyy;
            }
            function getNextDate(date, increment) {
              var nextDay = new Date(date);
              nextDay.setDate(date.getDate() + increment);
              return nextDay;
            }

            // given dates in mm/dd/yyyy format (excluding start, including last date)
            function getDatesBetweenRange(startDate, lastDate) {
              let dt = startDate;
              let range = [];
              // range.push(startDate);
              while (dt !== lastDate) {
                dt = getMMDDYYYY(getNextDate(new Date(dt), 1));
                range.push(dt);
              }
              // range.push(lastDate);
              return range;
            }

            function fetchLastCommonDate(arr) {
              // let lastDate = getMMDDYYYY(new Date());
              let lastDate = getDDMMMYYYY(getNextDate(new Date(), -1));
              let ind = arr.indexOf(lastDate);
              let lastDate2;
              if (ind === -1) {
                let cnt = 5;
                while (cnt) {
                  lastDate2 = new Date(lastDate);
                  lastDate = getDDMMMYYYY(getNextDate(lastDate2, -1));
                  if (arr.indexOf(lastDate) !== -1) break;
                  cnt--;
                }
                // Get the latest observation date from the array for expired deals
                if(cnt == 0){
                  const arrTemp = arr.filter(function(el){
                    return (new Date(el) < new Date());
                  });
                  lastDate = getDDMMMYYYY(arrTemp[arrTemp.length - 1]);
                }
              }
              // this.lastCommonDate = lastDate;
              return lastDate;
            }

            // Find Maturity Date from rmwdataArray using NMID
            let str = '';
            let after_ = '';
            let maturityDate = '8/4/2023';
            for (let i = 0; i < this.rmwdataArray.length; i++) {
              str = this.rmwdataArray[i].Product_Name;
              after_ = str.slice(str.indexOf('#') + 1);
              if (after_ === this.NMID.toString()) {
                maturityDate = this.rmwdataArray[i].Maturity_Date;
                break;
              }
            }

            let tempDateArr = maturityDate.split('-');
            let dt = parseInt(tempDateArr[0]);
            let mmObj = {
              Jan: 1,
              Feb: 2,
              Mar: 3,
              Apr: 4,
              May: 5,
              Jun: 6,
              Jul: 7,
              Aug: 8,
              Sep: 9,
              Oct: 10,
              Nov: 11,
              Dec: 12,
            };
            let mm = mmObj[tempDateArr[1]];
            let yr = parseInt(tempDateArr[2]);

            maturityDate = mm + '/' + dt + '/' + yr;
            this.maturityDate = maturityDate;

            let spotRes: any = [];
            spotRes = res;
            let temp = [];

            if (this.Underlying1 != '' && !this.Underlying2?.trim()) { //to handle empty/white-space in second-underlying i.e. when only one UL exist || KaustubhS || 01-Sep-2023
              for (let i = 0; i < spotRes.length; i++) {
                if (spotRes[i].Date1 != ' ') {
                  // temp[i] = spotRes[i].Date1;
                  // let dateTemp = temp[i].split(' ');

                  this.dates[i] = spotRes[i].Date1;
                  this.spots[i] = spotRes[i].Spot1;
                }
              }
              let performanceArray = [];
              performanceArray = this.getPerStrikeChart(this.dates, this.spots, 1);

              this.commonDates = this.dates.filter((x) => x != '');
              this.lastCommonDate = fetchLastCommonDate(this.commonDates);

              let indexOfLastDate = this.commonDates.indexOf(
                this.lastCommonDate
              );
              if(this.knockOutDate === ''){
                this.knockOutDate = this.lastCommonDate;
              }

              let ind;

              let months = [];
              let monthArray = [];
              // for (let i = 0; i < this.dates.length; i++) {
              //   if (this.dates[i] != '' && this.dates[i] != undefined) {
              //     months.push(this.datePipe.transform(new Date(this.dates[i])));
              //     months[i] = months[i].split(' ');
              //     monthArray.push(months[i][0] + '-' + months[i][2]);
              //   }
              //   // monthArray2.push(months2[i][0] ) ;
              // }

              // for(let i=0; i < performanceArray[1].length; i++ )
              // {
              //   this.performanceFromTradeDate.series[3].data.push(Number(performanceArray[1][i]).toFixed(2));
              //   // months.push(this.datePipe.transform(new Date(performanceArray[0][i])));
              //   // months[i] = months[i].split(" ");
              //   // monthArray.push(months[i][0] + '_' + months[i][2]) ;
              // }

              let dt1 = new Date(this.maturityDate);
              let dt2 = new Date(this.lastCommonDate);
              // If maturity date is before lastcommon date
              if (dt1 < dt2) {
                this.performanceFromTradeDate.Xlabels = this.commonDates;

                // this.performanceFromTradeDate.series[4].data = performanceArray[1];
                this.performanceFromTradeDate.series.push({name: this.Underlying1, data: performanceArray[1]});
              } else {
                let seriesValue = [];
                for (let i = 0; i < this.commonDates.length; i++) {
                  ind = performanceArray[0].indexOf(this.commonDates[i]);
                  this.performanceFromTradeDate.Xlabels[i] =
                    this.commonDates[i];
                  // this.performanceFromTradeDate.series[3].data.push(Number(performanceArray[1][ind]).toFixed(2));
                  if (
                    i <= indexOfLastDate &&
                    performanceArray[1][ind] != 'NaN' &&
                    performanceArray[1][ind] != '' &&
                    performanceArray[1][ind] != undefined && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)
                  )
                  seriesValue.push(
                      Number(performanceArray[1][ind]).toFixed(2)
                    );
                  else seriesValue.push(null);
                }
                this.performanceFromTradeDate.series.push({name: this.Underlying1, data: seriesValue});
              }
              // for(let i = 0; i < this.rangeTillMaturityDate.length; i++) {
              //   this.performanceFromTradeDate.Xlabels[performanceArray[0].length+i] = this.rangeTillMaturityDate[i];
              //   this.performanceFromTradeDate.series[3].data.push(null);
              // }
              // this.uniqueMonthCombined = [...new Set(monthArray)];
              // this.performanceFromTradeDate.series[4].name = this.Underlying1;
              // this.performanceFromTradeDate.series.length = 5;
              this.underlyingsCount = 1;
              this.lastCommonDate = this.knockOutDate.trim().replaceAll(" ", "-");
            } else if (
              this.Underlying1 != undefined &&
              this.Underlying2 != undefined &&
              this.Underlying3.length <= 1
            ) {
              // let temp2 = [];
              for (let i = 0; i < spotRes.length; i++) {
                // 1st Underlying Vals
                if (spotRes[i].Date1 != ' ') {
                  this.dates[i] = spotRes[i].Date1;
                  this.spots[i] = spotRes[i].Spot1;
                }
                // 2nd Underlying Vals
                if (spotRes[i].Date2 != ' ') {
                  this.dates2[i] = spotRes[i].Date2;
                  this.spots2[i] = spotRes[i].Spot2;
                }
              }

              // // 2nd Underlying Vals
              // let temp1 = [];
              // for (let i = 0; i < spotRes.length; i++) {
              //   if (spotRes[i].Date2 != ' ') {
              //     // temp1[i] = spotRes[i].Date2;
              //     // let dateTemp = temp1[i].split(' ');

              //     this.dates2[i] = spotRes[i].Date2;
              //     this.spots2[i] = spotRes[i].Spot2;
              //   }
              // }

              let performanceArray1 = [];
              performanceArray1 = this.getPerStrikeChart(this.dates, this.spots, 1);

              let performanceArray2 = [];
              performanceArray2 = this.getPerStrikeChart(
                this.dates2,
                this.spots2,
                2
              );

              this.commonDates = this.dates.filter((x) =>
                this.dates2.includes(x)
              );
              this.lastCommonDate = fetchLastCommonDate(this.commonDates);

              let indexOfLastDate = this.commonDates.indexOf(
                this.lastCommonDate
              );

              // let months2 = [];
              // let monthArray2 = [];
              // for (let i = 0; i < performanceArray1[0].length; i++) {
              //   if (this.dates[i] != '' && this.dates[i] != undefined) {
              //     // console.log("i",this.dates[i])
              //     months2.push(
              //       this.datePipe.transform(new Date(this.dates[i]))
              //     );
              //     months2[i] = months2[i].split(' ');
              //     monthArray2.push(months2[i][0] + '-' + months2[i][2]);
              //   }
              //   // monthArray2.push(months2[i][0] ) ;
              // }
              // this.uniqueMonthCombined = [...new Set(monthArray2)];
              // console.log("uniqueMonthCombined",this.uniqueMonthCombined)

              // for(let i=0; i < performanceArray2[1].length; i++ )
              // {
              //   this.performanceFromTradeDate.series[4].data.push(Number(performanceArray2[1][i]).toFixed(2));
              //   // months2.push(this.datePipe.transform(new Date(performanceArray2[0][i])));
              //   // months2[i] = months2[i].split(" ");
              //   // monthArray2.push(months2[i][0] + '_' + months2[i][2]) ;
              // }
              // // this.uniqueMonthCombined = [...new Set(monthArray2)];

              if(this.knockOutDate === ''){
                this.knockOutDate = this.lastCommonDate;
              }

              let ind;
              let dt1 = new Date(this.maturityDate);
              let dt2 = new Date(this.lastCommonDate);
              // If maturity date is before lastcommon date
              if (dt1 < dt2) {
                this.performanceFromTradeDate.Xlabels = this.commonDates;

                // this.performanceFromTradeDate.series[4].data =
                //   performanceArray1[1];
                // this.performanceFromTradeDate.series[5].data =
                //   performanceArray2[1];
                this.performanceFromTradeDate.series.push({name: this.Underlying1, data: performanceArray1[1]});
                this.performanceFromTradeDate.series.push({name: this.underlying2, data: performanceArray2[1]});
              } else {
                let seriesValue1 = [];
                let seriesValue2 = [];
                for (let i = 0; i < this.commonDates.length; i++) {
                  ind = performanceArray1[0].indexOf(this.commonDates[i]);
                  this.performanceFromTradeDate.Xlabels[i] =
                    this.commonDates[i];
                  // this.performanceFromTradeDate.series[3].data.push(Number(performanceArray1[1][ind]).toFixed(2));
                  if (
                    i <= indexOfLastDate &&
                    performanceArray1[1][ind] != 'NaN' &&
                    performanceArray1[1][ind] != '' &&
                    performanceArray1[1][ind] != undefined && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)
                  )
                  seriesValue1.push(
                      Number(performanceArray1[1][ind]).toFixed(2)
                    );
                  else seriesValue1.push(null);

                  ind = performanceArray2[0].indexOf(this.commonDates[i]);
                  // this.performanceFromTradeDate.series[4].data.push(Number(performanceArray2[1][ind]).toFixed(2));
                  if (
                    i <= indexOfLastDate &&
                    performanceArray2[1][ind] != 'NaN' &&
                    performanceArray2[1][ind] != '' &&
                    performanceArray2[1][ind] != undefined && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)
                  )
                  seriesValue2.push(
                      Number(performanceArray2[1][ind]).toFixed(2)
                    );
                  else seriesValue2.push(null);
                }
                this.performanceFromTradeDate.series.push({name: this.Underlying1, data: seriesValue1});
                this.performanceFromTradeDate.series.push({name: this.underlying2, data: seriesValue2});
              }

              // this.performanceFromTradeDate.series[4].name = this.Underlying1;
              // this.performanceFromTradeDate.series[5].name = this.Underlying2;
              // this.performanceFromTradeDate.series.length = 6;
              this.underlyingsCount = 2;
              this.lastCommonDate = this.knockOutDate.trim().replaceAll(" ", "-");
            } else if (
              this.Underlying1 != undefined &&
              this.Underlying2 != undefined &&
              this.Underlying3.length > 1 && this.Underlying4.length <= 1
            ) {
              // let temp2 = [];
              for (let i = 0; i < spotRes.length; i++) {
                // 1st Underlying Vals
                if (spotRes[i].Date1 != ' ') {
                  this.dates[i] = spotRes[i].Date1;
                  this.spots[i] = spotRes[i].Spot1;
                }
                // 2nd Underlying Vals
                if (spotRes[i].Date2 != ' ') {
                  this.dates2[i] = spotRes[i].Date2;
                  this.spots2[i] = spotRes[i].Spot2;
                }
                // third underlying val
                if (spotRes[i].Date3 != ' ') {
                  this.dates3[i] = spotRes[i].Date3;
                  this.spots3[i] = spotRes[i].Spot3;
                }
              }
              
              // let temp1 = [];
              // for (let i = 0; i < spotRes.length; i++) {
              //   if (spotRes[i].Date2 != ' ') {
              //     // temp1[i] = spotRes[i].Date2;
              //     // let dateTemp = temp1[i].split(' ');

              //     this.dates2[i] = spotRes[i].Date2;
              //     this.spots2[i] = spotRes[i].Spot2;
              //   }
              // }
              // // third underlying val
              // // let tempArr3 = [];
              // for (let i = 0; i < spotRes.length; i++) {
              //   if (spotRes[i].Date3 != ' ') {
              //     // tempArr3[i] = spotRes[i].Date3;
              //     // let dateTemp = tempArr3[i].split(' ');

              //     this.dates3[i] = spotRes[i].Date3;
              //     this.spots3[i] = spotRes[i].Spot3;
              //   }
              // }

              let performanceArray1 = [];
              performanceArray1 = this.getPerStrikeChart(this.dates, this.spots, 1);
              let performanceArray2 = [];
              performanceArray2 = this.getPerStrikeChart(
                this.dates2,
                this.spots2,
                2
              );
              let performanceArray3 = [];
              performanceArray3 = this.getPerStrikeChart(
                this.dates3,
                this.spots3,
                3
              );

              this.commonDates = this.dates.filter((x) =>
                this.dates2.includes(x)
              );
              this.commonDates = this.commonDates.filter((x) =>
                this.dates3.includes(x)
              );

              this.lastCommonDate = fetchLastCommonDate(this.commonDates);

              let indexOfLastDate = this.commonDates.indexOf(
                this.lastCommonDate
              );

              if(this.knockOutDate === ''){
                this.knockOutDate = this.lastCommonDate;
              }

              let ind;
              let dt1 = new Date(this.maturityDate);
              let dt2 = new Date(this.lastCommonDate);
              // If maturity date is before lastcommon date
              if (dt1 < dt2) {
                this.performanceFromTradeDate.Xlabels = this.commonDates;

                // this.performanceFromTradeDate.series[4].data =
                //   performanceArray1[1];
                // this.performanceFromTradeDate.series[5].data =
                //   performanceArray2[1];
                // this.performanceFromTradeDate.series[6].data =
                //   performanceArray3[1];
                this.performanceFromTradeDate.series.push({name: this.Underlying1, data: performanceArray1[1]});
                this.performanceFromTradeDate.series.push({name: this.underlying2, data: performanceArray2[1]});
                this.performanceFromTradeDate.series.push({name: this.underlying3, data: performanceArray3[1]});
                
              } else {
                let seriesValue1 = [];
                let seriesValue2 = [];
                let seriesValue3 = [];
                for (let i = 0; i < this.commonDates.length; i++) {
                  ind = performanceArray1[0].indexOf(this.commonDates[i]);
                  this.performanceFromTradeDate.Xlabels[i] =
                    this.commonDates[i];
                  // this.performanceFromTradeDate.series[3].data.push(Number(performanceArray1[1][ind]).toFixed(2));
                  if (
                    i <= indexOfLastDate &&
                    performanceArray1[1][ind] != 'NaN' &&
                    performanceArray1[1][ind] != '' &&
                    performanceArray1[1][ind] != undefined && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)
                  )
                  seriesValue1.push(
                      Number(performanceArray1[1][ind]).toFixed(2)
                    );
                  else seriesValue1.push(null);

                  ind = performanceArray2[0].indexOf(this.commonDates[i]);
                  // this.performanceFromTradeDate.series[4].data.push(Number(performanceArray2[1][ind]).toFixed(2));
                  if (
                    i <= indexOfLastDate &&
                    performanceArray2[1][ind] != 'NaN' &&
                    performanceArray2[1][ind] != '' &&
                    performanceArray2[1][ind] != undefined && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)
                  )
                  seriesValue2.push(
                      Number(performanceArray2[1][ind]).toFixed(2)
                    );
                  else seriesValue2.push(null);

                  ind = performanceArray3[0].indexOf(this.commonDates[i]);
                  // this.performanceFromTradeDate.series[5].data.push(Number(performanceArray3[1][ind]).toFixed(2));
                  if (
                    i <= indexOfLastDate &&
                    performanceArray3[1][ind] != 'NaN' &&
                    performanceArray3[1][ind] != '' &&
                    performanceArray3[1][ind] != undefined && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)
                  )
                  seriesValue3.push(
                      Number(performanceArray3[1][ind]).toFixed(2)
                    );
                  else seriesValue3.push(null);
                }

                this.performanceFromTradeDate.series.push({name: this.Underlying1, data: seriesValue1});
                this.performanceFromTradeDate.series.push({name: this.underlying2, data: seriesValue2});
                this.performanceFromTradeDate.series.push({name: this.underlying3, data: seriesValue3});
              }

              // let months2 = [];
              // let monthArray2 = [];
              // for (let i = 0; i < this.dates.length; i++) {
              //   if (this.dates[i] != '' && this.dates[i] != undefined) {
              //     months2.push(
              //       this.datePipe.transform(new Date(this.dates[i]))
              //     );
              //     months2[i] = months2[i].split(' ');
              //     monthArray2.push(months2[i][0] + '-' + months2[i][2]);
              //   }
              //   // monthArray2.push(months2[i][0] ) ;
              // }
              // this.uniqueMonthCombined = [...new Set(monthArray2)]
              // console.log("unique months",this.uniqueMonthCombined)

              // for(let i=0; i < performanceArray1[1].length; i++ )
              // {
              //   this.performanceFromTradeDate.series[3].data.push(Number(performanceArray1[1][i]).toFixed(2));
              // }

              // for(let i=0; i < performanceArray2[1].length; i++ )
              // {
              //   this.performanceFromTradeDate.series[4].data.push(Number(performanceArray2[1][i]).toFixed(2));
              //   // months2.push(this.datePipe.transform(new Date(performanceArray2[0][i])));
              //   // months2[i] = months2[i].split(" ");
              //   // monthArray2.push(months2[i][0] + '_' + months2[i][2]) ;
              // }
              // this.uniqueMonthCombined = [...new Set(monthArray2)]
              // this.performanceFromTradeDate.series[4].name = this.Underlying1;
              // this.performanceFromTradeDate.series[5].name = this.Underlying2;
              // this.performanceFromTradeDate.series[6].name = this.Underlying3;
              // this.performanceFromTradeDate.series.length = 7;
              this.underlyingsCount = 3;
              this.lastCommonDate = this.knockOutDate.trim().replaceAll(" ", "-");

              // for(let i=0; i < performanceArray3[1].length; i++ )
              // {
              //   this.performanceFromTradeDate.series[5].data.push(Number(performanceArray3[1][i]).toFixed(2));
              // }

              // this.performanceFromTradeDate.Xlabels =  [];
              // this.performanceFromTradeDate.tooltipLabels = [];
            }
            else if (
              this.Underlying1 != undefined &&
              this.Underlying2 != undefined &&
              this.Underlying3.length > 1 && this.Underlying4.length > 1
            ) {
              // 1st Underlying Vals
              // let temp2 = [];
              for (let i = 0; i < spotRes.length; i++) {
                // 1st Underlying Vals
                if (spotRes[i].Date1 != ' ') {
                  this.dates[i] = spotRes[i].Date1;
                  this.spots[i] = spotRes[i].Spot1;
                }
                // 2nd Underlying Vals
                if (spotRes[i].Date2 != ' ') {
                  this.dates2[i] = spotRes[i].Date2;
                  this.spots2[i] = spotRes[i].Spot2;
                }
                // third underlying val
                if (spotRes[i].Date3 != ' ') {
                  this.dates3[i] = spotRes[i].Date3;
                  this.spots3[i] = spotRes[i].Spot3;
                }
                // fourth underlying val
                if (spotRes[i].Date4 != ' ') {
                  this.dates4[i] = spotRes[i].Date4;
                  this.spots4[i] = spotRes[i].Spot4;
                }
              }
              // 2nd Underlying Vals
              // let temp1 = [];
              // for (let i = 0; i < spotRes.length; i++) {
              //   if (spotRes[i].Date2 != ' ') {
              //     this.dates2[i] = spotRes[i].Date2;
              //     this.spots2[i] = spotRes[i].Spot2;
              //   }
              // }
              // // third underlying val
              // // let tempArr3 = [];
              // for (let i = 0; i < spotRes.length; i++) {
              //   if (spotRes[i].Date3 != ' ') {
              //     this.dates3[i] = spotRes[i].Date3;
              //     this.spots3[i] = spotRes[i].Spot3;
              //   }
              // }
              // // fourth underlying val
              // // let tempArr4 = [];
              // for (let i = 0; i < spotRes.length; i++) {
              //   if (spotRes[i].Date4 != ' ') {
              //     this.dates4[i] = spotRes[i].Date4;
              //     this.spots4[i] = spotRes[i].Spot4;
              //   }
              // }


              let performanceArray1 = [];
              performanceArray1 = this.getPerStrikeChart(this.dates, this.spots, 1);
              let performanceArray2 = [];
              performanceArray2 = this.getPerStrikeChart(
                this.dates2,
                this.spots2,
                2
              );
              let performanceArray3 = [];
              performanceArray3 = this.getPerStrikeChart(
                this.dates3,
                this.spots3,
                3
              );
              let performanceArray4 = [];
              performanceArray4 = this.getPerStrikeChart(
                this.dates4,
                this.spots4,
                4
              );

              this.commonDates = this.dates.filter((x) =>
                this.dates2.includes(x)
              );
              this.commonDates = this.commonDates.filter((x) =>
                this.dates3.includes(x)
              );
              this.commonDates = this.commonDates.filter((x) =>
                this.dates4.includes(x)
              );

              this.lastCommonDate = fetchLastCommonDate(this.commonDates);

              let indexOfLastDate = this.commonDates.indexOf(
                this.lastCommonDate
              );

              if(this.knockOutDate === ''){
                this.knockOutDate = this.lastCommonDate;
              }

              let ind;
              let dt1 = new Date(this.maturityDate);
              let dt2 = new Date(this.lastCommonDate);
              // If maturity date is before lastcommon date
              if (dt1 < dt2) {
                this.performanceFromTradeDate.Xlabels = this.commonDates;

                // this.performanceFromTradeDate.series[4].data =
                //   performanceArray1[1];
                // this.performanceFromTradeDate.series[5].data =
                //   performanceArray2[1];
                // this.performanceFromTradeDate.series[6].data =
                //   performanceArray3[1];
                // this.performanceFromTradeDate.series[7].data =
                //   performanceArray4[1];
                this.performanceFromTradeDate.series.push({name: this.Underlying1, data: performanceArray1[1]});
                this.performanceFromTradeDate.series.push({name: this.underlying2, data: performanceArray2[1]});
                this.performanceFromTradeDate.series.push({name: this.underlying3, data: performanceArray3[1]});
                this.performanceFromTradeDate.series.push({name: this.underlying4, data: performanceArray4[1]});
              } else {
                let seriesValue1 = [];
                let seriesValue2 = [];
                let seriesValue3 = [];
                let seriesValue4 = [];
                for (let i = 0; i < this.commonDates.length; i++) {
                  ind = performanceArray1[0].indexOf(this.commonDates[i]);
                  this.performanceFromTradeDate.Xlabels[i] =
                    this.commonDates[i];
                  // this.performanceFromTradeDate.series[3].data.push(Number(performanceArray1[1][ind]).toFixed(2));
                  if (
                    i <= indexOfLastDate &&
                    performanceArray1[1][ind] != 'NaN' &&
                    performanceArray1[1][ind] != '' &&
                    performanceArray1[1][ind] != undefined && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)
                  )
                  seriesValue1.push(
                      Number(performanceArray1[1][ind]).toFixed(2)
                    );
                  else seriesValue1.push(null);

                  ind = performanceArray2[0].indexOf(this.commonDates[i]);
                  // this.performanceFromTradeDate.series[4].data.push(Number(performanceArray2[1][ind]).toFixed(2));
                  if (
                    i <= indexOfLastDate &&
                    performanceArray2[1][ind] != 'NaN' &&
                    performanceArray2[1][ind] != '' &&
                    performanceArray2[1][ind] != undefined && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)
                  )
                  seriesValue2.push(
                      Number(performanceArray2[1][ind]).toFixed(2)
                    );
                  else seriesValue2.push(null);

                  ind = performanceArray3[0].indexOf(this.commonDates[i]);
                  // this.performanceFromTradeDate.series[5].data.push(Number(performanceArray3[1][ind]).toFixed(2));
                  if (
                    i <= indexOfLastDate &&
                    performanceArray3[1][ind] != 'NaN' &&
                    performanceArray3[1][ind] != '' &&
                    performanceArray3[1][ind] != undefined && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)
                  )
                  seriesValue3.push(
                      Number(performanceArray3[1][ind]).toFixed(2)
                    );
                  else seriesValue3.push(null);

                  ind = performanceArray4[0].indexOf(this.commonDates[i]);
                  // this.performanceFromTradeDate.series[5].data.push(Number(performanceArray3[1][ind]).toFixed(2));
                  if (
                    i <= indexOfLastDate &&
                    performanceArray4[1][ind] != 'NaN' &&
                    performanceArray4[1][ind] != '' &&
                    performanceArray4[1][ind] != undefined && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)
                  )
                  seriesValue4.push(
                      Number(performanceArray4[1][ind]).toFixed(2)
                    );
                  else seriesValue4.push(null);
                }
                this.performanceFromTradeDate.series.push({name: this.Underlying1, data: seriesValue1});
                this.performanceFromTradeDate.series.push({name: this.underlying2, data: seriesValue2});
                this.performanceFromTradeDate.series.push({name: this.underlying3, data: seriesValue3});
                this.performanceFromTradeDate.series.push({name: this.underlying4, data: seriesValue4});
              }

              // this.performanceFromTradeDate.series[4].name = this.Underlying1;
              // this.performanceFromTradeDate.series[5].name = this.Underlying2;
              // this.performanceFromTradeDate.series[6].name = this.Underlying3;
              // this.performanceFromTradeDate.series[7].name = this.Underlying4;
              // this.performanceFromTradeDate.series.length = 8;
              this.underlyingsCount = 4;
              this.lastCommonDate = this.knockOutDate.trim().replaceAll(" ", "-");

            }

            this.custapi
              .GetKIKOValues(this.noteMasterID, true)
              .subscribe((res) => {
                if(res !== null){
                  let kikoVal = res?.getKIKOValuesResult;
                  kikoVal = kikoVal.split(';');
                  let len = 0;
                  if (this.dates.length != 0) len = this.dates.length;
                  else if (this.dates2.length != 0) len = this.dates2.length;

                  // let tempVals = [];
                  // let vals = [];
                  // let labels = [];
                  // let values = [];
                  
                  // this.performanceFromTradeDate.Xlabels =  [];

                  // this.performanceFromTradeDate.series[0].tooltipLabels = [];
                  // this.performanceFromTradeDate.series[0].data = [];
                  // this.performanceFromTradeDate.series[1].data = [];
                  // this.performanceFromTradeDate.series[2].data = [];
                  // this.performanceFromTradeDate.series[3].data = [];


                  // for (let i = 0; i < this.commonDates.length; i++) {
                  //   this.performanceFromTradeDate.Xlabels[i] =   this.commonDates[i];
                  //   this.performanceFromTradeDate.series[0].tooltipLabels[i] = 'Strike' + ':' + i + ' ' + 'days';
                  // }
                  // for (let i = 0; i < this.rangeTillMaturityDate.length; i++) {
                  //   this.performanceFromTradeDate.Xlabels[this.commonDates.length + i] = this.rangeTillMaturityDate[i];
                  //   this.performanceFromTradeDate.series[0].tooltipLabels[this.commonDates.length + i] = 'Strike' + ':' + this.commonDates.length + i + ' ' + 'days';
                  // }

                  for (let i = 0; i < kikoVal.length; i++) {
                    // tempVals[i] = kikoVal[i].split(':');
                    // labels[i] = tempVals[i][0];
                    // values[i] = tempVals[i][1];
                    
                    const filter = kikoVal[i].split(':')[0];
                    const value = kikoVal[i].split(':')[1];
                    
                    switch(filter) {
                      case 'Barrier Details':
                        if(this.koYN !== 'N'){
                          // Portfolio Snapshot : Stepwise Autocall and Coupon Barrier in Timeline chart | 12-Sep-2023
                          let j = 0;
                          let autocall = '';
                          let autocallArr = []
                          for (let i = 0; i < this.commonDates.length; i++) {
                            if(this.obsTableData !== null && this.obsTableData.length > 0){
                              if(new Date(this.commonDates[i]) <= new Date(this.obsTableData[j]['observation_Date'])){
                              
                              }
                              else{
                                if(j < this.obsTableData.length - 1){
                                  j = j + 1;
                                }
                              }
                              autocall = this.obsTableData[j]['autocall_Trigger'];
                              if(autocall === '-'){
                                autocall = null;
                              }
                            }
                            else{
                              autocall = value;
                            }
                            if(this.autocallFlag && new Date(this.commonDates[i]) > new Date(this.knockOutDate)){
                              autocall = null;
                            }
                            autocallArr.push(autocall);
                          }
                          this.performanceFromTradeDate.series.push({name: 'Autocall', data: autocallArr});
                          // for (let i = 0; i < this.rangeTillMaturityDate.length; i++) {
                          //   this.performanceFromTradeDate.series[0].data.push(
                          //     value
                          //   );
                          // }
                        }
                        break;
                      // case 'Call Strike':
                      //   let strikeArr = [];
                      //   for (let i = 0; i < this.commonDates.length; i++) {
                      //     if(this.autocallFlag && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)){
                      //       strikeArr.push(value);
                      //     }
                      //     else if(!this.autocallFlag){
                      //       strikeArr.push(value);
                      //     }
                      //     else{
                      //       strikeArr.push(null);
                      //     }
                      //   }
                      //   this.performanceFromTradeDate.series.push({name: 'Call Strike', data: strikeArr});
                      //   // for (let i = 0; i < this.rangeTillMaturityDate.length; i++) {
                      //   //   this.performanceFromTradeDate.series[1].data.push(
                      //   //     value
                      //   //   );
                      //   // }
                      //   break;
                      case 'KI Details':
                        let KIArr = [];
                        for (let i = 0; i < this.commonDates.length; i++) {
                          if(this.autocallFlag && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)){
                            KIArr.push(value);
                          }
                          else if(!this.autocallFlag){
                            KIArr.push(value);
                          }
                          else{
                            KIArr.push(null);
                          }
                        }
                        this.performanceFromTradeDate.series.push({name: 'KI', data: KIArr});
                        // for (let i = 0; i < this.rangeTillMaturityDate.length; i++) {
                        //   this.performanceFromTradeDate.series[2].data.push(
                        //     value
                        //   );
                        // }
                        break;
                      case 'Lower Coupon Barrier':
                        if(this.couponBarrierYN !== 'N'){
                          let k = 0;
                          let couponTrigger = '';
                          let couponArr = [];
                          for (let i = 0; i < this.commonDates.length; i++) {
                            if(this.obsTableData !== null && this.obsTableData.length > 0){
                              if(new Date(this.commonDates[i]) <= new Date(this.obsTableData[k]['observation_Date'])){
                              
                              }
                              else{
                                if(k < this.obsTableData.length - 1){
                                  k = k + 1;
                                }
                              }
                              couponTrigger = this.obsTableData[k]['coupon_Trigger'];
                              if(couponTrigger === '-'){
                                couponTrigger = null;
                              }
                            }
                            else{
                              couponTrigger = value;
                            }
                            if(this.autocallFlag && new Date(this.commonDates[i]) > new Date(this.knockOutDate)){
                              couponTrigger = null;
                            }
                            couponArr.push(couponTrigger);
                          }
                          this.performanceFromTradeDate.series.push({name: 'Coupon Barrier', data: couponArr});
                          // for (let i = 0; i < this.rangeTillMaturityDate.length; i++) {
                          //   this.performanceFromTradeDate.series[3].data.push(
                          //     value
                          //   );
                          // }
                        }
                        
                        break;
                      default:
                        let strikeArr = [];
                        for (let i = 0; i < this.commonDates.length; i++) {
                          if(this.autocallFlag && new Date(this.commonDates[i]) <= new Date(this.knockOutDate)){
                            strikeArr.push(value);
                          }
                          else if(!this.autocallFlag){
                            strikeArr.push(value);
                          }
                          else{
                            strikeArr.push(null);
                          }
                        }
                        this.performanceFromTradeDate.series.push({name: filter, data: strikeArr});
                        // for (let i = 0; i < this.rangeTillMaturityDate.length; i++) {
                        //   this.performanceFromTradeDate.series[1].data.push(
                        //     value
                        //   );
                        // }
                        break;
                    }

                  }
                  
                  // if(this.koYN === 'N'){
                  //   this.performanceFromTradeDate.series = this.performanceFromTradeDate.series.filter(
                  //     function(el){
                  //       return el.name !== 'KO';
                  //     }
                  //   );
                  // }
                  // if(this.strikeYN === 'N'){
                  //   this.performanceFromTradeDate.series = this.performanceFromTradeDate.series.filter(
                  //     function(el){
                  //       return el.name !== 'Call Strike';
                  //     }
                  //   );
                  // }
                  // if(this.kiYN === 'N'){
                  //   this.performanceFromTradeDate.series = this.performanceFromTradeDate.series.filter(
                  //     function(el){
                  //       return el.name !== 'KI';
                  //     }
                  //   );
                  // }
                  // if(this.couponBarrierYN === 'N'){
                  //   this.performanceFromTradeDate.series = this.performanceFromTradeDate.series.filter(
                  //     function(el){
                  //       return el.name !== 'Coupon Barrier';
                  //     }
                  //   );
                  // }
                  
                  

                  // console.log("BEFORE IF-------------",this.Underlying1.length,this.Underlying2.length,this.Underlying3.length)
                  // console.log("FLAGS=",(this.Underlying1.length > 1),(this.Underlying2.length > 1),(this.Underlying3.length > 1))
                  // if(this.Underlying1.length > 1 && this.Underlying2.length > 1 && this.Underlying3.length <= 1)
                  // {
                  //   let len1 = this.performanceFromTradeDate.series[3].data.length;
                  //   let len2 = this.performanceFromTradeDate.series[4].data.length;
                  //   let maxLen ;
                  //   if(len1 > len2)
                  //     maxLen = len1;
                  //   else
                  //     maxLen = len2;
                  //     let l1 , l2;
                  //   for(let i= 0 ;i < maxLen ; i++)
                  //   {
                  //     // if 2nd len is greter push elements in first underlying array
                  //     if(maxLen == len2)
                  //     {
                  //       l1 = this.performanceFromTradeDate.series[3].data.length - 1;
                  //       this.performanceFromTradeDate.series[3].data.push(Number(this.performanceFromTradeDate.series[3].data[l1]).toFixed(2));
                  //       this.performanceFromTradeDate.series[0].data.push(values[0]);
                  //       this.performanceFromTradeDate.series[1].data.push(values[1]);
                  //       this.performanceFromTradeDate.series[2].data.push(values[2]);
                  //     }
                  //   }

                  // }
                }
                if (this.performanceFromTradeDate.series[0].length == 0) {
                  this.loader2 = true;
                } else {
                  this.loader2 = false;
                }

                this.showPerformanceTradeDate = true;
              });
          });
      // });
  }

  getPerSpotChart(dates, spots) {
    // let months = [];
    // let monthArray = [];
    // for (let i = 0; i < dates.length; i++) {
    //   if (dates[i] != '' && dates[i] != undefined) {
    //     // console.log("in if");
    //     months.push(this.datePipe.transform(new Date(dates[i])));
    //     months[i] = months[i].split(' ');
    //     // monthArray.push(months[i][0] + '_' + months[i][2]) ;
    //     monthArray.push(months[i][0]);
    //   }
    // }
    // this.uniqueMonth = [...new Set(monthArray)];
    let newSpotArr = [];
    let arr = [];
    let j = 0;
    for (let i = 0; i < dates.length; i++) {
      if (spots[i] != '') {
        arr[j] = spots[i];
      }
    }
    for (let i = 0; i < dates.length; i++) {
      if (spots[i] != '') {
        newSpotArr[i] = spots[i];
      } else {
        newSpotArr[i] = newSpotArr[arr.length - 1];
      }
    }
    let calculatedSpots = [];
    let tempDates = [];
    let a = 0;
    for (let i = 0; i < dates.length; i++) {
      // calculatedSpots[i] = (((spots[i])/spots[0])*100);
      if (dates[i] != undefined) {
        calculatedSpots[a] = (newSpotArr[i] / newSpotArr[0]) * 100;
        tempDates[a] = dates[i];
        a++;
      }
    }
    dates = [];
    dates = tempDates;

    for (let i = 0; i < dates.length; i++) {
      calculatedSpots[i] = Number(calculatedSpots[i]).toFixed(2);
    }
    let array = [];

    array[0] = dates;
    array[1] = calculatedSpots;
    // console.log("ARRAY =",array);
    return array;
  }

  getPerStrikeChart(dates, spots, stockIdx) { 
    let calculatedSpots = [];
    // Take Trade date spot from Historical performance table | 13-Dec-2023
    let tradeDateSpot;
    if(this.histTableData?.length > 0){
      tradeDateSpot = Number(this.histTableData[0]['fP' + stockIdx].replaceAll(",", ""));
    }
    else{
      tradeDateSpot = spots[0];
    }
    for (let i = 0; i < dates.length; i++) {
      const overRideSpot = this.histTableData?.filter((el, j) => {
          return el.date.trim() === dates[i].trim() && j !== 0
      });
      if (overRideSpot?.length > 0) {
          calculatedSpots[i] = Number(100 + Number(overRideSpot[0]['performance' + stockIdx])).toFixed(2);
      }
      else if(spots[i] != '' && i !== 0){
          calculatedSpots[i] = Number((spots[i] / tradeDateSpot) * 100).toFixed(2);
      }
      else {
          calculatedSpots[i] = Number(100).toFixed(2);
      }
      dates[i] = dates[i].trim().replaceAll('-' , ' ');
    }
    let array = [];
    array[0] = dates;
    array[1] = calculatedSpots;
    // console.log("ARRAY =",array);
    return array;
  }

  getActualSpotData(dates, spots) {
    {
      let months = [];
      let monthArray = [];
      for (let i = 0; i < dates.length; i++) {
        if (dates[i] != '' && dates[i] != undefined) {
          // console.log("in if");
          months.push(this.datePipe.transform(new Date(dates[i])));
          months[i] = months[i].split(' ');
          // monthArray.push(months[i][0] + '_' + months[i][2]) ;
          monthArray.push(months[i][0]);
        }
      }
      console.log('Months = ', monthArray);
      this.uniqueMonth = [...new Set(monthArray)];
      console.log('uniqueMonth = ', this.uniqueMonth);
      let newSpotArr = [];
      let arr = [];
      let j = 0;
      for (let i = 0; i < dates.length; i++) {
        if (spots[i] != '') {
          arr[j] = spots[i];
        }
      }
      for (let i = 0; i < dates.length; i++) {
        if (spots[i] != '') {
          newSpotArr[i] = spots[i];
        } else {
          newSpotArr[i] = newSpotArr[arr.length - 1];
        }
      }

      let array = [];

      array[0] = dates;
      array[1] = newSpotArr;
      // console.log("ARRAY =",array);
      return array;
    }
  }

  SetStatusCss(sts: string, payout: string, ...args: string[]): string{
    try {
      //check if status is 'PENDING', if true then return question mark css or else proceed ahead assuming that the second value for status will always be 'YES'.
      if(sts.toUpperCase() === 'PENDING') return 'question';
      
      //Today's date is after observation date, now can apply tick/hyphen/cross mark
      if(+payout < 0) return 'red-cross';
      if(+payout === 0) return 'yellow-hyphen';
      const sum = args.reduce((sum: number, curr) => sum + (+curr || 0) , 0);
      if(sum <= +payout) return 'dark-green tick';
      if(sum > +payout) return 'light-green tick';
      return '';
    } catch (error) {
      console.log(error);
    }
  }
}
