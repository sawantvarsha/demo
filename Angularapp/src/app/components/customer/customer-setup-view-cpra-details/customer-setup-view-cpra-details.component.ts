import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/services/config.service';
import { CustomerApiService } from '../../../services/customer-api.service';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { environment } from 'src/environments/environment';
import { HomeApiService } from 'src/app/services/home-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-customer-setup-view-cpra-details',
  templateUrl: './customer-setup-view-cpra-details.component.html',
  styleUrls: ['./customer-setup-view-cpra-details.component.scss']
})
export class CustomerSetupViewCpraDetailsComponent implements OnInit, OnDestroy, AfterViewChecked {

  isProd = environment.production;
  IsLoading = true;
  msg = '';
  AvgCPRADetails = '';
  type = 'PieChart';
  RiskRating: string = sessionStorage.getItem('RiskRating');
  // chartColors = [
  //   '#DFC2E4',
  //   '#9AD3F0',
  //   '#BCE4B1',
  //   '#FBE19F'
  // ];
  // chartColorsLegends = [
  //   { label: 'Cash', color: '#DFC2E4', },
  //   { label: 'Certificates', color: '#ed7d31', },
  //   { label: 'ETFs', color: '#a5a5a5', },
  //   { label: 'Equities', color: '#FBE19F', },
  //   { label: 'Fixed Income', color: '#9AD3F0', },
  //   { label: 'FX', color: '#619010', },
  //   { label: 'Mutual Funds', color: '#BCE4B1', }
  // ];
  chartColorsLegends = [];
  FinIQColorCodes = ['#dfc2e4', '#fbe19f', '#9ad3f0', '#bce4b1', '#ed7d31', '#a5a5a5', '#619010', '#388a90', '#6143b7', '#a3085f', '#85593d', '#878787', '#b19c0c'];
  options = {
    pieHole: 0,
    // pieSliceText: 'none',
    legend: { position: 'none' },
    colors: [],
    width: '350',
    height: '225',
    chartArea: {
      left: '0',
      top: '0',
      right: '0',
      width: '100%',
      height: '100%',
      Margin: '0',
    },
    is3D: true,
    backgroundColor: { fill: 'transparent' },
    pieSliceTextStyle: { color: '#000000' }
  };

  viewKYCQuestionsAnswers = [];
  RiskProfileGraphDetailsArray = [];
  CPRAGraph = [];

  formName = AppConfig.settings.CSP_UpdateCIRPFormName;
  clientFormName = AppConfig.settings.CSP_UpdateCIRPPageHeaderName;
  GetKYCFormSubscriber: Subscription;
  ViewCPRADataSubscription: Subscription;
  ProductsList = [];

  constructor(private afs: CustomerApiService, private ds: WorkflowApiService, public elem: ElementRef, public Home_api: HomeApiService, public Auth_api: AuthService) { }

  ngAfterViewChecked() {
    // //console.log("out")
    Array.prototype.forEach.call(this.elem.nativeElement.getElementsByTagName('rect'), (rect: HTMLElement) => {
      if (rect.getAttribute('fill') === '#ffffff') {
        // //console.log("hello")
        rect.setAttribute('fill', '#ffffff00');
      }
    });
  }
  ngOnInit(): void {
    // this.ds.getCPRAData(sessionStorage.getItem('RiskRating'), sessionStorage.getItem('Username'));

    // Load CIRP Form
    // this.GetKYCFormSubscriber = this.afs.fetchKYCFormDetails(this.formName, sessionStorage.getItem('CustomerID')).subscribe((res) => {
    //   if (res.DB_GetKYCRiskProfileSummary_DataResult.length > 0) {
    //     res.DB_GetKYCRiskProfileSummary_DataResult.forEach(
    //       (element) => {
    //         if (element.DataType === 'radio' && element.Question_NO !== '0') {
    //           this.viewKYCQuestionsAnswers.push({
    //             dataType: 'SectionValue',
    //             sectionHeader: '',
    //             QuestionNumber: element.Question_NO,
    //             key: element.Question,
    //             value: element.Answer,
    //           });
    //         }
    //       }
    //     );
    //     this.IsLoading = false;
    //   } else {
    //     this.IsLoading = false;
    //     this.msg = 'Complete your CPRA';
    //   }
    // });

    this.ds.getCPRAData(this.Home_api.RiskRating, this.Auth_api.UserName).subscribe((res) => {
      if (res.getKYCDataResult !== null) {
        this.AvgCPRADetails = res.getKYCDataResult[0].RiskRatingDetails[0].Avg_Value;
        let InvestmentObjective = '';
        let tempArray = [];
        this.CPRAGraph = [];
        let Colors = [];
        let tempoption = {};
        // get products list
        this.afs.GetProductsListofUpdateCIRP(this.AvgCPRADetails).subscribe(res => {
          if (res.RiskProfileDetailsResult.length > 0) {
            this.parseTheProductsList(res.RiskProfileDetailsResult[0].Avg_Score_Description);
          }
        });

        this.RiskProfileGraphDetailsArray = res.getKYCDataResult[0].RiskprofileGraphDetails;
        this.RiskProfileGraphDetailsArray.forEach((ele, index) => {
          if (ele === null) {
            this.RiskProfileGraphDetailsArray.splice(index - 1, index);
          }
        });
        // Color productwise color array
        if (this.RiskProfileGraphDetailsArray.length > 0) {
          this.RiskProfileGraphDetailsArray.forEach((element, _index) => {
            if (this.chartColorsLegends.length === 0) {
              this.chartColorsLegends.push({ label: element.Scheme_Name, color: this.FinIQColorCodes[this.chartColorsLegends.length] });
            } else {
              let labelFound = false;
              this.chartColorsLegends.forEach(ele => {
                if (ele.label === element.Scheme_Name) {
                  labelFound = true;
                }
              });
              if (!labelFound) {
                this.chartColorsLegends.push({ label: element.Scheme_Name, color: this.FinIQColorCodes[this.chartColorsLegends.length] });
              }
            }
          });
        }
        this.chartColorsLegends.sort(this.sortBylabel);
        if (this.RiskProfileGraphDetailsArray.length > 0) {
          this.RiskProfileGraphDetailsArray.forEach((element, index) => {
            try {
              if (element !== null) {
                if (InvestmentObjective === '') {
                  // First chart
                  InvestmentObjective = element.InvestmentObjective;
                  // tempArray.push([
                  //   element.Scheme_Name,
                  //   parseFloat(element.BA_Allocation),
                  // ]);
                  tempArray.push({
                    title:  element.Scheme_Name,
                    value: parseFloat(element.BA_Allocation),
                  });
                } else if (InvestmentObjective === element.InvestmentObjective) {
                  // tempArray.push([
                  //   element.Scheme_Name,
                  //   parseFloat(element.BA_Allocation),
                  // ]);
                  tempArray.push({
                    title:  element.Scheme_Name,
                    value: parseFloat(element.BA_Allocation),
                  });
                  console.log(tempArray)
                } else if (InvestmentObjective !== element.InvestmentObjective) {
                  Colors = [];
                  tempArray.forEach(ele => {
                    this.chartColorsLegends.forEach(colorchartele => {
                      // if (ele[0] === 'MF' && colorchartele.label === 'Mutual Funds') {
                      //   Colors.push(colorchartele.color);
                      // } else 
                      if (ele[0] === colorchartele.label) {
                        Colors.push(colorchartele.color);
                      }
                    });
                  });
                  // tempArray = this.sort_without_key(tempArray);
                  // this.options.colors = Colors;
                  // tempoption = this.options;
                  tempoption = this.fngetChartOption();
                  tempoption['colors'] = Colors;
                  this.CPRAGraph.push({
                    chartName: InvestmentObjective,
                    data: tempArray,
                    options: tempoption
                  });
                  InvestmentObjective = '';
                  tempArray = [];
                  // tempArray.push([
                  //   element.Scheme_Name,
                  //   parseFloat(element.BA_Allocation),
                  // ]);
                  tempArray.push({
                    title:  element.Scheme_Name,
                    value: parseFloat(element.BA_Allocation),
                  });
                  console.log(tempArray)
                }
                if (index === this.RiskProfileGraphDetailsArray.length - 1) {
                  // Last index
                  Colors = [];
                  tempArray.forEach(ele => {
                    this.chartColorsLegends.forEach(colorchartele => {
                      // if (ele[0] === 'MF' && colorchartele.label === 'Mutual Funds') {
                      //   Colors.push(colorchartele.color);
                      // } else 
                      if (ele[0] === colorchartele.label) {
                        Colors.push(colorchartele.color);
                      }
                    });
                  });
                  // this.options.colors = Colors;
                  // tempoption = this.options;
                  InvestmentObjective = element.InvestmentObjective;
                  tempoption = this.fngetChartOption();
                  tempoption['colors'] = Colors;
                  this.CPRAGraph.push({
                    chartName: InvestmentObjective,
                    data: tempArray,
                    options: tempoption
                  });
                  tempArray = [];
                }
                // console.log('this.AllChartsData', this.CPRAGraph);
              }
            } catch (e) {
              console.log('Null data found on investment objective');
            }
          });
        }
        this.IsLoading = false;
      } else {
        this.IsLoading = false;
        // this.msg = 'Complete your CPRA';
      }
    });
  }

  ngOnDestroy(): void {
    this.viewKYCQuestionsAnswers = [];
    this.formName = '';
    this.msg = '';
    this.AvgCPRADetails = '';
    this.IsLoading = false;
    if (this.GetKYCFormSubscriber) { this.GetKYCFormSubscriber.unsubscribe(); }
    if (this.ViewCPRADataSubscription) { this.ViewCPRADataSubscription.unsubscribe(); }
    // throw new Error('Method not implemented.');
  }

  parseTheProductsList(inputStringProductsList: string) {
    // ProductsList
    let divideStringonVerticalBar = [];
    if (inputStringProductsList.includes('|')) {
      // inputStringProductsList = inputStringProductsList.replace(/\s/g, '');
      divideStringonVerticalBar = inputStringProductsList.split('|');
      // console.log(divideStringonVerticalBar);
      divideStringonVerticalBar.forEach(element => {
        if (element.includes(':')) {
          const productNameandVisibility = element.split(':');
          // console.log(productNameandVisibility);
          productNameandVisibility[1] = productNameandVisibility[1].trim();
          productNameandVisibility[1] = productNameandVisibility[1].replace(/\s/g, '');
          this.ProductsList.push(
            { ProductName: productNameandVisibility[0], Visibility: productNameandVisibility[1] === 'Y' ? 'Y' : 'N' }
          );
        } else {
          this.ProductsList.push(
            { ProductName: element, Visibility: 'N' }
          );
        }
      });
    }
  }
  sort_without_key(tempArray: any) {
    //pattern that takes care of alphanumeric
    var reA = /[^a-zA-Z]/g;
    var reN = /[^0-9]/g;
    // tempArray.sort((a,b) {return a-b})
    tempArray = tempArray.sort(function (a, b) {
      var aA = a[0].replace(reA, "");
      var bA = b[0].replace(reA, "");
      if (aA === bA) {
        var aN = parseInt(a[0].replace(reN, ""), 10);
        var bN = parseInt(b[0].replace(reN, ""), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
      } else {
        return aA > bA ? 1 : -1;
      }
    });
    return tempArray;
  }
  sortBylabel(a, b) {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  }

  fngetChartOption(){
    return {
      pieHole: 0,
      // pieSliceText: 'none',
      legend: { position: 'none' },
      colors: [],
      width: '350',
      height: '225',
      chartArea: {
        left: '0',
        top: '0',
        right: '0',
        width: '100%',
        height: '100%',
        Margin: '0',
      },
      is3D: true,
      backgroundColor: { fill: 'transparent' },
      pieSliceTextStyle: { color: '#000000' }
    };
  }
}
