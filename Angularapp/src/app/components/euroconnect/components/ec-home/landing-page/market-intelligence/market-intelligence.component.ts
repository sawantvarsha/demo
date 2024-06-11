// Changes added by Mayuri D. on 05-July-2022.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ChartType } from 'angular-google-charts';
import { EcCommonService } from 'src/app/components/euroconnect/services/ec-common.service';
import { EcHomeService } from 'src/app/components/euroconnect/services/ec-home.service';
import { AuthService } from 'src/app/services/auth/auth.service';

export interface QuickLinksGrid {
  Actions: string;
  RFQ_ID: number;
  BBVA_ID: number;
  Product_Name: string;
  Underlyings: string;
  Currency: string;
  Size: string;
  Coupon: string;
  Price: string;
  Format: string;
  Queue_Status: string;
  ProductType: string;
}

class PopularProductChart {
  type: string;
  data: any[];
  options: any = {};
  columnNames: any[];
  width: any;
  height: any;
}

class PopularUnderlyingChart {
  typePiechart = ChartType.PieChart
  data: any[];
  options: any = {};
  columnNames: any[];
  width: any;
  height: any;
}

class PopularTenorChart {
  type: string;
  data: any[];
  options: any = {};
  columnNames: any[];
  width: any;
  height: any;
}

class UnderlyingChartData {
  UnderlyingCode: string;
  UnderlyingType: string;
}

declare var require: any;
// declare var $: any;
const $: any = require('jquery');

@Component({
  selector: 'app-market-intelligence',
  templateUrl: './market-intelligence.component.html',
  styleUrls: ['./market-intelligence.component.scss'],
})
export class MarketIntelligenceComponent implements OnInit, OnDestroy {
  constructor(public Echome: EcHomeService, public EcCommon: EcCommonService,public auth:AuthService) {
    this.loginID = this.EcCommon.getLoggedInUserName()[0].UserId;
  }
  ngOnDestroy(): void {
    this.Echome.payOffList = []
  }

  loginID: any = '';
  expanded = false;
  tempID: any = -1;

  successMsg: string;
  ErrorMsg: string;
  payoffListQL = [];

  ePricerSelection: string;
  AutocallGridData: any;
  RCGridData: any;
  ParticipationGridData: any;
  CreditGridData: any;
  ERGridData: any;
  AQGridData: any;
  DQGridData: any;

  dataSourceAutocall: MatTableDataSource<QuickLinksGrid>;
  dataSourceRC: MatTableDataSource<QuickLinksGrid>;
  dataSourceParticipation: MatTableDataSource<QuickLinksGrid>;
  dataSourceCredit: MatTableDataSource<QuickLinksGrid>;
  dataSourceER: MatTableDataSource<QuickLinksGrid>;
  dataSourceAQ: MatTableDataSource<QuickLinksGrid>;
  dataSourceDQ: MatTableDataSource<QuickLinksGrid>;

  selectedPopular: any = [];

  PopularProdList: any[] = [];
  PopularProductChecked: string = '';
  popularProdSelected: number;

  CheckedUnderlyingList: string[] = [];
  CheckedUnderlyingString: string = '';
  underlyingVal: boolean[] = [];

  productData: any = [];
  underlyingData: any = [];
  tenorData: any;
  percentProductData: any[] = [];
  percentUnderlyingData: any[] = [];
  percentTenorData: any[] = [];
  productDataTotal: any = 0;
  underlyingDataTotal: any = 0;
  tenorDataTotal: any = 0;
  PopularProdChart: PopularProductChart;

  previousOptionsID: string = '';
  previoussubOptionsID: string = '';

  PopularTenorList: any[] = [];
  PopularTenorSelected: number = -1;
  PopularTenorChecked: string = '';
  disableTenorOption: string = 'Others';
  inputudl = 40;

  chkcolors = [
    'A8E6CF',
    'A4C9FF',
    '9EDED8',
    'FFF7AE',
    'E7E6EF',
    'AFECFA',
    'DBE9B7',
    'F4DADA',
    'F0A986',
    '98E1C6',
    '90BDFF',
    '8FD9D2',
    'FFF59A',
    'DBDAE7',
    '9CE7F9',
    'D3E4A7',
    'EFCACA',
    'EE9F78',
    'FFEFD7',
    '88DDBD',
    '7BB1FF',
    '80D4CC',
    'FFF385',
    'CFCDDF',
    '89E3F8',
    'CBDF98',
    'EBBBBB',
    'ED966B',
    'FFE7C3',
    '78D8B5',
    '67A5FF',
    '70CEC6',
    'FFF171',
    'C3C1D7',
    '75DEF6',
    'C4DB88',
    'E6ABAB',
    'EB8C5D',
    'FFD79A',
    '69D4AC',
    '5299FF',
    '61C9C0',
    'FFEF5C',
    'B7B4CF',
    '62DAF5',
    'BCD678',
    'E19B9B',
    'E98250',
    'FFCE85',
    '59CFA3',
    '3E8CFF',
    '52C4B9',
    'FFED48',
    'ABA8C7',
    '4FD5F4',
    'B4D169',
    'DD8B8B',
    'E87942',
    'FFC671',
    '49CB9B',
    '2A80FF',
    '43BFB3',
    'FFEB34',
    '9F9BBF',
    '3CD1F3',
    'ACCC59',
    'D87C7C',
    'FFBE5D',
    'E9CD4C',
    '39C692',
    '1574FF',
    '43BFB3',
    'FFE91F',
    '938FB7',
    '29CCF2',
    'A4C84A',
    'D36C6C',
    'FFB648',
    'E7C93E',
    '34B686',
    'FFE70B',
    '8782AF',
    'E6C531',
    'CB3A87',
    'FF7832',
    '863D96',
    'BF1A2F',
    '1EA896',
    '5893D4',
    '8186D5',
    'B8B2A6',
    '2AB7CA',
    '6497B1',
    '96A6E7',
    'C4C8A5',
    '98D3FF',
    'FB7AE4',
    'C8B1D9',
    'C5C7EC',
    '47DAF1',
  ];

  SelectedPeriodProduct: string;
  SelectedPeriodUnderlying: string;
  SelectedPeriodTenor: string;
  quickLinksSelectedPeriodProduct: string;
  quickLinksSelectedPeriodUnderlying: string;
  quickLinksSelectedPeriodTenor: string;
  quickLinksSeleceted: number = 0;

  PopularUnderlying: PopularUnderlyingChart;
  PopularTenor: PopularTenorChart;
  PopularUnderlyingChart: UnderlyingChartData[];

  PeriodList: string[] = ['This Month', 'This Week'];
  selectedPeriod: String = '';

  async ngOnInit() {
    console.log(" in market")
    await this.EcCommon.getEntityOfUser().then((data: any) => {
      this.EcCommon.userInfo = [
        {UserId:this.auth.UserName},
        {EntityId:data[0].Entity_id},
        {UserGroupId:sessionStorage.getItem('FinIQGroupID')},
        {Usertype:this.auth.UserType},
        
      ];
      
    })
    for (let i = 0; i < 100; i++) {
      var length = 6;
      var chars = '0123456789ABCDEF';
      var hex = '';
      while (length--) hex += chars[(Math.random() * 16) | 0];
      // //console.log(hex);
    }

    this.tempID = -1;

    this.SelectedPeriodProduct = 'Month';
    this.SelectedPeriodUnderlying = 'Month';
    this.SelectedPeriodTenor = 'Month';

    this.quickLinksSelectedPeriodProduct = 'Month';
    this.quickLinksSelectedPeriodUnderlying = 'Month';
    this.quickLinksSelectedPeriodTenor = 'Month';

    //console.log("input...");
    //console.log(document.getElementsByTagName('input').length);
    //console.log(document.getElementsByTagName('input'));
    //console.log(this.cfs.getLoggedInUserName);
    await this.GetPopularData();

    // this.PopularProducts(this.SelectedPeriodProduct);
    // this.Underlying(this.SelectedPeriodUnderlying);
    // this.Tenor(this.SelectedPeriodTenor);
    await this.defaultChecked();
    this.successMsg = '';
    this.ErrorMsg = '';

    for (var i = 0; i < 3; i++) {
      this.selectedPopular[i] = false;
    }
    this.selectedPopular[1] = true;

    if (
      this.Echome.payOffList === undefined ||
      this.Echome.payOffList.length <= 0
    ) {
      // this.validationArr = this.apifunctions.BBVAFetchValidation('EQ');
      // this.apifunctions.GetDealEntryUSAM();
      this.Echome.getPayOffList();
    }
    this.payoffListQL = [];
    this.Echome.payOffList.forEach((item) => {
      if (item.display === true) {
        this.payoffListQL.push(item.auditTProductType);
      }
    });

    console.log(this.PopularUnderlying);
    
  }

  async defaultChecked() {
    this.popularProdSelected = 0;
    if (this.PopularProdList[0] !== undefined) {
      await this.PopularProductsCheckedChanged(0, true, this.PopularProdList[0]);
    }

    if (this.PopularTenorList[0] !== 'Others') {
      this.PopularTenorSelected = 0;
      await this.PopularTenorCheckedChanged(0, true, this.PopularTenorList[0]);
    } else {
      this.ErrorMsg =
        'No Data present for tenor for this ' + this.SelectedPeriodTenor;
    }

    if (this.underlyingData[0] !== undefined) {
      console.log("this.underlyingData[0]", this.underlyingData[0])
      if (this.underlyingData[0].UnderlyingCode !== 'Others') {
        this.underlyingVal[0] = true;
        await this.PopularUnderlyingCheckedChange(
          null,
          true,
          this.underlyingData[0].UnderlyingCode,
          this.underlyingData[0].AssetType,
          0
        );
      } else {
        this.ErrorMsg =
          'No Data present for underlunigs for this ' + this.SelectedPeriodTenor;
      }
    }

    // console.log(" in default checked" ,  this.underlyingData[0].UnderlyingCode,this.underlyingData[0].AssetType)
  }

  PopularTenorCheckedChanged(
    index: any,
    ChangedCheckBoxVal: boolean,
    TenorVal: string
  ) {
    console.log('index', index);
    this.ErrorMsg = '';
    if (ChangedCheckBoxVal == true) {
      this.PopularTenorChecked = TenorVal;
    } else {
      this.PopularTenorChecked = '';
    }
  }

  async GetPopularData() {
    let res: any = [];
    console.log(
      'in popular data',
      this.SelectedPeriodProduct,
      this.SelectedPeriodUnderlying,
      this.SelectedPeriodTenor,
      this.inputudl
    );
    res = await this.Echome.BBVAGetPopularData(
      this.SelectedPeriodProduct,
      this.SelectedPeriodUnderlying,
      this.SelectedPeriodTenor,
      this.inputudl
    );
    if (res) {
      this.productData = res.GetPopularProductsResponse;
      this.underlyingData = res.GetPopularUnderlyingsResponse;
      this.tenorData = res.GetPopularTenorsResponse;

      console.log(
        'tenor data',
        this.productData,
        this.underlyingData,
        this.tenorData
      );
      await this.PopularProducts(false);
      await this.Underlying(false);
      await this.Tenor(false);
    }
  }

  async Underlying(flag: boolean) {
    if (this.inputudl > 100) {
      document.getElementById('txtinputudl').classList.add('error');
      $(
        '<div class="error-input"></div><div class="validate-popup active"><span>Please enter valid underlying  count</span></div>'
      ).insertAfter('#txtinputudl');
      $('.validate-popup').delay(5000).fadeOut('slow');
    } else {
      $('.validate-popup').each(function () {
        $(this).remove();
      });
      $('.error-input').each(function () {
        $(this).remove();
      });
      if (document.getElementById('txtinputudl')) {
        document.getElementById('txtinputudl').classList.remove('error');
      }
    }
    this.tempID = -1;
    this.CheckedUnderlyingString = '';
    this.CheckedUnderlyingList = [];
    this.underlyingVal = [];
    this.successMsg = '';
    this.ErrorMsg = '';
    this.underlyingDataTotal = 0;
    this.PopularUnderlying = new PopularUnderlyingChart();
    this.PopularUnderlyingChart = [];
    this.percentUnderlyingData = [];
    this.PopularUnderlying.typePiechart = ChartType.PieChart
    //Added by Mahima G on 2 Apr 2021 | Asked by Priya L
    if (flag) {
      this.underlyingData = await this.Echome.BBVAGetPopularUnderlyings(
        this.loginID,
        this.SelectedPeriodUnderlying,
        this.inputudl
      );
    }
    //console.log('data....', this.underlyingData)
    // //console.log('popular underlying....', this.PopularUnderlying.columnNames)
    this.PopularUnderlying.data = [[]];
    this.PopularUnderlying.columnNames = [];
    for (var i = 0; i < this.underlyingData.length; i++) {
      this.underlyingDataTotal =
        this.underlyingDataTotal + this.underlyingData[i].Count;
      // this.PopularUnderlying.data[0].push(this.underlyingData[i].Count);
      this.PopularUnderlying.columnNames.push(
        this.underlyingData[i].UnderlyingCode
      ); // + "(%)");

      // if (i == 0) {

      //   this.Underlying1 = this.underlyingData[i].UnderlyingCode;
      //   this.Underlying1Type = this.underlyingData[i].AssetType;
      // }
      // if (i == 1) {
      //   this.Underlying2 = this.underlyingData[i].UnderlyingCode;
      //   this.Underlying2Type = this.underlyingData[i].AssetType;
      // }
      // if (i == 2) {
      //   this.Underlying3 = this.underlyingData[i].UnderlyingCode;
      //   this.Underlying3Type = this.underlyingData[i].AssetType;
      // }
      // if (i == 3) {
      //   this.Underlying4 = this.underlyingData[i].UnderlyingCode;
      //   this.Underlying4Type = this.underlyingData[i].AssetType;
      // }
      // if (i == 4) {
      //   this.Underlying5 = this.underlyingData[i].UnderlyingCode;
      // }
    }

    for (var i = 0; i < this.underlyingData.length; i++) {
      this.percentUnderlyingData[i] =
        (this.underlyingData[i].Count / this.underlyingDataTotal) * 100;
      // this.PopularUnderlying.data[i].push(this.percentUnderlyingData[i]);
    }

    //console.log(this.PopularUnderlying.columnNames)
    //console.log(this.percentUnderlyingData)

    for (var i = 0; i < this.percentUnderlyingData.length; i++) {
      this.PopularUnderlying.data[i] = [
        this.PopularUnderlying.columnNames[i],
        this.percentUnderlyingData[i],
      ];
    }
    //console.log(this.PopularUnderlying.data)

    this.CheckedUnderlyingList = [];
    for (let i = 0; i < this.inputudl; i++) {
      this.underlyingVal[i] = false;
    }

    // this.underlyingVal[2] = false;
    // this.underlyingVal[3] = false;
    // this.underlyingVal[4] = false;
    // this.underlyingVal[5] = false;
    // this.underlyingVal[6] = false;
    if (this.underlyingData[0].UnderlyingCode !== 'Others') {
      this.underlyingVal[0] = true;
      this.PopularUnderlyingCheckedChange(
        null,
        true,
        this.underlyingData[0].UnderlyingCode,
        this.underlyingData[0].AssetType,
        0
      );
    } else {
      // Error message changed || PriyaL || 02May2022 || Issue reported by AbeerJ
      this.ErrorMsg =
        'No Data present for underlyings for this ' +
        this.SelectedPeriodUnderlying;
    }

    this.PopularUnderlying.options = {
      // colors: ['#a8edcb', '#ffffb1', '#ffcccb', '#add8e6', '#d5aaff', '#FFAEA5', '#c6dbda', '#fedfbf'],
      colors: this.chkcolors,
      // isStacked: 'true',
      // bar: { groupWidth: '80%' },
      legend: {
        position: 'none',
        alignment: 'center',
        textStyle: { fontSize: 16 },
      },
      vAxis: {
        baselineColor: '#fff',
        gridlineColor: '#fff',
        textPosition: 'none',
        direction: -1,
      },
      chartArea: { left: '3%', top: '16%', width: '80%', height: '80%' }, //Changed by Amogh Kulkarni on 18-Nov-2021, Jira No. 234
      backgroundColor: 'transparent',
      pieHole: 0.55,
      tooltip: {
        textStyle: { fontName: 'verdana', fontSize: 12 },
        isHtml: true,
        text: 'percentage',
      },
      pieSliceText: 'percentage',
      pieSliceTextStyle: {
        color: '#000000',
      },
      // enableInteractivity: false
    };

    this.PopularUnderlying.width = 350;
    this.PopularUnderlying.height = 350;
  }

  // Tenor(Duration: any) {
  Tenor(flag: boolean) {
    this.PopularTenorChecked = '';
    this.PopularTenorSelected = -1;
    this.tempID = -1;
    var tenortemp;
    this.successMsg = '';
    this.ErrorMsg = '';
    this.tenorDataTotal = 0;
    this.PopularTenorList = [];
    this.PopularTenor = new PopularTenorChart();
    this.PopularTenor.type = 'PieChart';
    //Added by Mahima G on 2 Apr 2021 | Asked by Priya L
    if (flag) {
      this.tenorData = this.Echome.BBVAGetPopularTenors(
        this.loginID,
        this.SelectedPeriodTenor
      );
    }

    this.PopularTenor.data = [['']];
    this.PopularTenor.columnNames = [''];
    for (var i = 0; i < this.tenorData.length; i++) {
      // this.PopularTenor.data[0].push(this.tenorData[i].Count);
      this.tenorDataTotal = this.tenorDataTotal + this.tenorData[i].Count;

      tenortemp = this.tenorData[i].Tenor;
      tenortemp = tenortemp.replace('YEAR', 'Y');
      tenortemp = tenortemp.replace('DAYS', 'D');
      tenortemp = tenortemp.replace('MONTH', 'M');
      this.PopularTenor.columnNames.push(tenortemp); // + "(%)");
      this.PopularTenorList.push(tenortemp);
    }
    for (var i = 0; i < this.tenorData.length; i++) {
      this.percentTenorData[i] =
        (this.tenorData[i].Count / this.tenorDataTotal) * 100;
      this.PopularTenor.data[0].push(this.percentTenorData[i]);
    }
    for (var i = 0; i < this.percentTenorData.length; i++) {
      this.PopularTenor.data[i] = [
        this.PopularTenor.columnNames[i + 1],
        this.percentTenorData[i],
      ];
    }
    //console.log(this.productData)
    //console.log(this.percentTenorData)
    //console.log(this.PopularTenor.data)
    //console.log(this.PopularTenor.columnNames)

    this.PopularTenor.options = {
      // colors: ['#a8edcb', '#ffffb1', '#ffcccb', '#add8e6', '#fedfbf'],
      colors: this.chkcolors,
      // isStacked: 'true',
      // bar: { groupWidth: '80%' },
      legend: {
        position: 'none',
        alignment: 'center',
        textStyle: { fontSize: 16 },
      },
      vAxis: {
        baselineColor: '#fff',
        gridlineColor: '#fff',
        textPosition: 'none',
        direction: -1,
      },
      chartArea: { left: '3%', top: '16%', width: '80%', height: '80%' }, //Changed by Amogh Kulkarni on 18-Nov-2021, Jira No. 234
      backgroundColor: 'transparent',
      pieHole: 0.55,
      tooltip: {
        textStyle: { fontName: 'verdana', fontSize: 12 },
        isHtml: true,
        text: 'percentage',
      },
      pieSliceTextStyle: {
        color: '#000000',
      },
      // enableInteractivity: false
    };

    this.PopularTenor.width = 350;
    this.PopularTenor.height = 350;

    if (this.PopularTenorList[0] !== 'Others') {
      this.PopularTenorSelected = 0;
      this.PopularTenorCheckedChanged(0, true, this.PopularTenorList[0]);
    } else {
      this.ErrorMsg =
        'No Data present for tenor for this ' + this.SelectedPeriodTenor;
    }
  }

  showsubOptions(id: any) {
    this.tempID = -1;
    this.successMsg = '';
    this.ErrorMsg = '';
    if (document.getElementById(this.previoussubOptionsID)) {
      var previous = document.getElementById(this.previoussubOptionsID);

      if (this.previoussubOptionsID == id) {
        if (previous.style.display == 'block') {
          previous.style.display = 'none';
        } else {
          previous.style.display = 'block';
        }
        return false;
      }
      if (previous.style.display == 'block') {
        previous.style.display = 'none';
      }
    }

    //console.log(id);
    var e = document.getElementById(id);
    if (e.style.display == 'none') {
      e.style.display = 'block';
    } else {
      e.style.display = 'none';
    }

    this.previoussubOptionsID = id;
    //document.getElementById(id).setAttribute('style', 'visibility : visible;')
  }

  async PopularProducts(flag: boolean) {
    console.log('in popular product', flag);
    this.tempID = -1;
    this.successMsg = '';
    this.ErrorMsg = '';
    this.productDataTotal = 0;
    this.PopularProdList = [];
    this.PopularProdChart = new PopularProductChart();
    this.PopularProdChart.type = 'PieChart';
    //Added by Mahima G on 2 Apr 2021 | Asked by Priya L
    if (flag) {
      this.productData = await this.Echome.BBVAGetPopularProducts(
        this.loginID,
        this.SelectedPeriodProduct
      );
    }
    this.PopularProdChart.data = [['', '']];
    this.PopularProdChart.columnNames = [''];

    for (var i = 0; i < this.productData.length; i++) {
      this.productDataTotal = this.productDataTotal + this.productData[i].Count;
      // this.PopularProdChart.data[0].push(this.productData[i].Count);

      if (this.productData[i].Product == 'AutocallablePhoenix') {
        this.PopularProdList.push('Autocall');
        this.PopularProdChart.columnNames.push('Autocall');
      }
      if (this.productData[i].Product == 'ReverseConvertible') {
        this.PopularProdList.push('RC');
        this.PopularProdChart.columnNames.push('RC');
      }
      if (this.productData[i].Product == 'CreditTranche') {
        this.PopularProdList.push('Credit');
        this.PopularProdChart.columnNames.push('Credit');
      }
      if (this.productData[i].Product == 'Participation') {
        this.PopularProdList.push('Participation');
        this.PopularProdChart.columnNames.push('Participation');
      }
      if (this.productData[i].Product == 'EQC_Europe') {
        this.PopularProdList.push('Autocallable');
        this.PopularProdChart.columnNames.push('Autocallable');
      }
      if (this.productData[i].Product == 'YieldEnhancement') {
        this.PopularProdList.push('Yield Enhancement');
        this.PopularProdChart.columnNames.push('Yield Enhancement');
      }
      if (this.productData[i].Product == 'DiscountCertificates') {
        this.PopularProdList.push('Discount Certificates');
        this.PopularProdChart.columnNames.push('Discount Certificates');
      }
      if (this.productData[i].Product == 'ACC') {
        this.PopularProdList.push('Accumulator');
        this.PopularProdChart.columnNames.push('Accumulator');
      }
      if (this.productData[i].Product == 'DAC') {
        this.PopularProdList.push('Decumulator');
        this.PopularProdChart.columnNames.push('Decumulator');
      }
    }

    for (var i = 0; i < this.productData.length; i++) {
      this.percentProductData[i] =
        (this.productData[i].Count / this.productDataTotal) * 100;
      // this.PopularProdChart.data[0].push(this.percentProductData[i]);
    }
    for (var i = 0; i < this.productData.length; i++) {
      this.PopularProdChart.data[i] = [
        this.PopularProdChart.columnNames[i + 1],
        this.percentProductData[i],
      ];
      // this.PopularProdChart.data[0].push(this.percentProductData[i]);
    }
    // //console.log(this.PopularProdChart.data)
    // //console.log(this.PopularProdChart.columnNames)

    this.PopularProdChart.options = {
      // colors: ['#a8edcb', '#ffffb1', '#ffcccb', '#add8e6', '#d5aaff'],
      colors: this.chkcolors,
      // ['1D486F', '225483', '276198', '2D6FAD', '327CC2', '418ACE', '5697D3', '6BA4D9', '80B1DE', '95BEE4'],
      // isStacked: 'true',
      // tooltip : { text : 'percentage' },
      // bar: { groupWidth: '80%' },
      legend: {
        position: 'none',
        alignment: 'center',
        textStyle: { fontSize: 16 },
      },
      vAxis: {
        baselineColor: '#fff',
        gridlineColor: '#fff',
        textPosition: 'none',
        // direction: -1
      },
      pieHole: 0.55,
      chartArea: { left: '3%', top: '16%', width: '80%', height: '80%' }, //Changed by Amogh Kulkarni on 18-Nov-2021, Jira No. 234
      backgroundColor: 'transparent',
      tooltip: {
        textStyle: { fontName: 'verdana', fontSize: 12 },
        isHtml: true,
        text: 'percentage',
      },
      pieSliceTextStyle: {
        color: '#000000',
      },
      // tooltipWidth : 50
      // enableInteractivity: false
    };

    this.PopularProdChart.width = 350;
    this.PopularProdChart.height = 350;

    this.popularProdSelected = 0;
    this.PopularProductsCheckedChanged(0, true, this.PopularProdList[0]);
  }

  async PopularProductsCheckedChanged(
    index: any,
    ChangedCheckBoxVal: boolean,
    ProdName: string
  ) {
    console.log('index', index , this.inputudl);
    this.tempID = -1;
    this.ErrorMsg = '';
    //console.log(this.underlyingData);
    
      for (let k = 0; k < this.inputudl; k++) {
        this.underlyingVal[k] = false;
        console.log(" this.underlyingData[k]" , this.underlyingData[k])
        //DrishtyR | 18-Aug-2021 | Underlying deselection related change on product selection chane
        if(this.underlyingData[k]!== undefined)
        {
          if (
          
            this.underlyingData[k].UnderlyingCode !== undefined &&
            this.underlyingData[k].UnderlyingCode !== ''
          ) {
            this.PopularUnderlyingCheckedChange(
              null,
              false,
              this.underlyingData[k].UnderlyingCode,
              this.underlyingData[k].AssetType,
              k
            );
          }
        }
       
      }
    
   
    // this.underlyingVal[0] = false;
    // this.underlyingVal[1] = false;
    // this.underlyingVal[2] = false;
    // this.underlyingVal[3] = false;
    //Added by Mahima G on 2 Apr 2021
    // this.underlyingVal[4] = false;
    // this.underlyingVal[5] = false;
    // this.underlyingVal[6] = false;
    // this.CheckedUnderlyingList = [];
    // this.CheckedUnderlyingString = "";
    if (ChangedCheckBoxVal == true) {
      this.PopularProductChecked = ProdName;
    } else {
      this.PopularProductChecked = '';
    }

    if (this.PopularProductChecked == 'Autocall')
      this.ePricerSelection = 'Phoenix';
    if (this.PopularProductChecked == 'RC') this.ePricerSelection = 'BRC';
    if (this.PopularProductChecked == 'Participation')
      this.ePricerSelection = 'Participation';
    if (this.PopularProductChecked == 'Credit') {
      this.ePricerSelection = 'Credit';

      // this.CheckedUnderlyingList = [];
      // this.CheckedUnderlyingString = "";
    }

    if (this.PopularProductChecked == 'Autocallable')
      this.ePricerSelection = 'EarlyRedemption';
    if (this.PopularProductChecked == 'Accumulator')
      this.ePricerSelection = 'AQ';
    if (this.PopularProductChecked == 'Decumulator')
      this.ePricerSelection = 'DQ';
    if (this.PopularProductChecked == 'Yield Enhancement')
      this.ePricerSelection = 'YieldEnhancement';
    if (this.PopularProductChecked == 'Discount Certificates')
      this.ePricerSelection = 'DiscountCertificates';
    //DrishtyR | 18-Aug-2021 | Underlying deselection related change on product selection chane
    if (this.underlyingData[0].UnderlyingCode !== 'Others') {
      this.underlyingVal[0] = true;
      this.PopularUnderlyingCheckedChange(
        null,
        true,
        this.underlyingData[0].UnderlyingCode,
        this.underlyingData[0].AssetType,
        0
      );
    }
  }

  async PopularUnderlyingCheckedChange(
    e: any,
    ChangedCheckBoxVal: boolean,
    UnderlyingName: string,
    AssetType: string,
    id: any
  ) {
    try {
      this.tempID = -1;
      console.log("in ", UnderlyingName, AssetType, id);
      this.ErrorMsg = '';
      var spliceIndex: number;
      console.log("selected underlying ", e, ChangedCheckBoxVal, UnderlyingName, AssetType, id);
      if (this.CheckedUnderlyingList.length < 5) {
        if (ChangedCheckBoxVal == true) {
          if (this.CheckedUnderlyingList.indexOf(UnderlyingName) == -1) {
            if (this.PopularProductChecked != 'Credit' && AssetType == 'EQ') {
              this.CheckedUnderlyingList.push(UnderlyingName);
              this.ErrorMsg = '';
            } else if (
              this.PopularProductChecked == 'Credit' &&
              AssetType == 'CR'
            ) {
              this.CheckedUnderlyingList.push(UnderlyingName);
              this.ErrorMsg = '';
            } else {
              this.ErrorMsg = 'Underlying not supported by this Product.';
              this.tempID = id;
            }
          }
        } else {
          if (this.CheckedUnderlyingList.indexOf(UnderlyingName) != -1) {
            spliceIndex = this.CheckedUnderlyingList.indexOf(UnderlyingName);
            this.CheckedUnderlyingList.splice(spliceIndex, 1);
          }
        }
        // //console.log(this.CheckedUnderlyingList);
      } else {
        if (!ChangedCheckBoxVal) {
          if (this.CheckedUnderlyingList.indexOf(UnderlyingName) != -1) {
            spliceIndex = this.CheckedUnderlyingList.indexOf(UnderlyingName);
            this.CheckedUnderlyingList.splice(spliceIndex, 1);
          }
        }
      }

      this.CheckedUnderlyingString = this.CheckedUnderlyingList.toString();
      console.log(this.CheckedUnderlyingList);
    } catch (error) {
      //console.log(error);
    }
  }

  async GetGridData(event: any) {
    this.tempID = -1;
    this.successMsg = '';
    this.ErrorMsg = '';

    if (event.index == 1) {
      $('#loading').show();
      setTimeout(async () => {
        if (this.payoffListQL.includes('AutocallablePhoenix')) {
          this.AutocallGridData = await this.Echome.BBVAGetRecentRequests(
            'AutocallablePhoenix',
            '0'
          );
          if (this.AutocallGridData && this.AutocallGridData.length > 0) {
            this.dataSourceAutocall = new MatTableDataSource<QuickLinksGrid>(
              this.AutocallGridData
            );
          }
        }
        //console.log(this.dataSourceAutocall);
        if (this.payoffListQL.includes('ReverseConvertible')) {
          this.RCGridData = await this.Echome.BBVAGetRecentRequests(
            'ReverseConvertible',
            '0'
          );
          if (this.RCGridData && this.RCGridData.length > 0) {
            this.dataSourceRC = new MatTableDataSource<QuickLinksGrid>(
              this.RCGridData
            );
          }
        }
        if (this.payoffListQL.includes('Participation')) {
          this.ParticipationGridData = await this.Echome.BBVAGetRecentRequests(
            'Participation',
            '0'
          );
          if (
            this.ParticipationGridData &&
            this.ParticipationGridData.length > 0
          ) {
            this.dataSourceParticipation =
              new MatTableDataSource<QuickLinksGrid>(
                this.ParticipationGridData
              );
          }
        }
        if (this.payoffListQL.includes('CreditTranche')) {
          this.CreditGridData = await this.Echome.BBVAGetRecentRequests(
            'CreditTranche',
            '0'
          );
          if (this.CreditGridData && this.CreditGridData.length > 0) {
            this.dataSourceCredit = new MatTableDataSource<QuickLinksGrid>(
              this.CreditGridData
            );
          }
        }
        if (this.payoffListQL.includes('EQC_Europe')) {
          this.ERGridData = await this.Echome.BBVAGetRecentRequests(
            'EQC_Europe',
            '0'
          );
          if (this.ERGridData && this.ERGridData.length > 0) {
            this.dataSourceER = new MatTableDataSource<QuickLinksGrid>(
              this.ERGridData
            );
          }
        }
        if (this.payoffListQL.includes('ACC')) {
          this.AQGridData = await this.Echome.BBVAGetRecentRequests('ACC', '0');
          if (this.AQGridData && this.AQGridData.length > 0) {
            this.dataSourceAQ = new MatTableDataSource<QuickLinksGrid>(
              this.AQGridData
            );
          }
        }
        if (this.payoffListQL.includes('DAC')) {
          this.DQGridData = await this.Echome.BBVAGetRecentRequests('DAC', '0');
          if (this.DQGridData && this.DQGridData.length > 0) {
            this.dataSourceDQ = new MatTableDataSource<QuickLinksGrid>(
              this.DQGridData
            );
          }
        }
        // this.DRAGridData = this.afs.BBVAGetRecentRequests("DailyRangeAccrual", "0");
        // this.dataSourceDRA = new MatTableDataSource<QuickLinksGrid>(this.DRAGridData);
        $('#loading').hide();
      });
    }
  }

  changePopular(num) {
    console.log(num);
    for (var i = 0; i < 3; i++) {
      this.selectedPopular[i] = false;
    }
    this.selectedPopular[num] = true;
    console.log(this.selectedPopular);
  }
}
