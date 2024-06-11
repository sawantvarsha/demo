import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-view-kyc-details',
  templateUrl: './customer-view-kyc-details.component.html',
  styleUrls: ['./customer-view-kyc-details.component.scss']
})
export class CustomerViewKycDetailsComponent implements OnInit, OnDestroy, AfterViewChecked {

  isProd = environment.production;
  IsLoading = true;
  msg = '';
  AvgCPRADetails = '';
  type = 'PieChart';
  RiskRating: string = sessionStorage.getItem('RiskRating');
  chartColors = [
    '#DFC2E4',
    '#9AD3F0',
    '#BCE4B1',
    '#FBE19F'
  ];
  chartColorsLegends = [];
  FinIQColorCodes = ['#dfc2e4', '#fbe19f', '#9ad3f0', '#bce4b1', '#ed7d31', '#a5a5a5', '#619010', '#388a90', '#6143b7', '#a3085f', '#85593d', '#878787', '#b19c0c'];
  options = {
    pieHole: 0,
    // pieSliceText: 'none',
    legend: { position: 'none' },
    colors: this.FinIQColorCodes,
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

  // formName = AppConfig.settings.CSP_UpdateCIRPFormName;
  formName = 'Know Your Customer';
  // clientFormName = AppConfig.settings.CSP_UpdateKYCFormName;
  clientFormName = 'Customer KYC';
  GetKYCFormSubscriber: Subscription;
  ViewCPRADataSubscription: Subscription;
  ProductsList = [];
  quationsList = [];
  Form_ID: string = '';

  constructor(private ds: WorkflowApiService, public elem: ElementRef) { }

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
    this.ds.getCPRAData(sessionStorage.getItem('RiskRating'), sessionStorage.getItem('Username'));

    // Load CIRP Form
    // this.GetKYCFormSubscriber = this.afs.fetchKYCFormDetails(this.formName, sessionStorage.getItem('CustomerID')).subscribe((res) => {
    //   if (res.DB_GetKYCRiskProfileSummary_DataResult.length > 0) {
    //     res.DB_GetKYCRiskProfileSummary_DataResult.forEach(
    //       (element) => {
    //         if (element.DataType === 'radio' && element.Question_NO !== '0') {
    //           let IsQuestionPresent: boolean = false;
    //           if(this.viewKYCQuestionsAnswers.length > 0){
    //             this.viewKYCQuestionsAnswers.forEach(ele=>{
    //               if(ele.QuestionNumber === element.Question_NO){
    //                 IsQuestionPresent = true;
    //                 ele.value = ele.value + ', '+ element.Answer;
    //               }
    //             });
    //           }
    //           if(!IsQuestionPresent){
    //             this.viewKYCQuestionsAnswers.push({
    //               dataType: 'SectionValue',
    //               sectionHeader: '',
    //               QuestionNumber: element.Question_NO,
    //               key: element.Question,
    //               value: element.Answer,
    //             });
    //           }              
    //         }
    //       }
    //     );
    //     this.IsLoading = false;
    //   } else {
    //     this.IsLoading = false;
    //     this.msg = 'Complete your CPRA';
    //   }
    // });

    // Commented by Ketan S on 11Aug21 as asked by Parikshit Sir

    // this.ds.getCPRAData(sessionStorage.getItem('RiskRating'), sessionStorage.getItem('Username')).subscribe((res) => {
    //   if (res.getKYCDataResult !== null) {
    //     this.AvgCPRADetails = res.getKYCDataResult[0].RiskRatingDetails[0].Avg_Value;
    //     let InvestmentObjective = '';
    //     let tempArray = [];
    //     this.CPRAGraph = [];
    //     let Colors = [];
    //     // get products list
    //     this.afs.GetProductsListofUpdateCIRP('Conservative').subscribe(res => {
    //       if (res.RiskProfileDetailsResult.length > 0) {
    //         this.parseTheProductsList(res.RiskProfileDetailsResult[0].Avg_Score_Description);
    //       }
    //     });

    //     this.RiskProfileGraphDetailsArray = res.getKYCDataResult[0].RiskprofileGraphDetails;
    //     this.RiskProfileGraphDetailsArray.forEach((ele, index) => {
    //       if (ele === null) {
    //         this.RiskProfileGraphDetailsArray.splice(index - 1, index);
    //       }
    //     });
    //     // Color productwise color array
    //     if (this.RiskProfileGraphDetailsArray.length > 0) {
    //       this.RiskProfileGraphDetailsArray.forEach((element, index) => {
    //         if (this.chartColorsLegends.length === 0) {
    //           this.chartColorsLegends.push({ label: element.Scheme_Name, color: this.FinIQColorCodes[this.chartColorsLegends.length] });
    //         } else {
    //           let labelFound = false;
    //           this.chartColorsLegends.forEach(ele => {
    //             if (ele.label === element.Scheme_Name) {
    //               labelFound = true;
    //             }
    //           });
    //           if (!labelFound) {
    //             this.chartColorsLegends.push({ label: element.Scheme_Name, color: this.FinIQColorCodes[this.chartColorsLegends.length] });
    //           }
    //         }
    //       });
    //     }
    //     this.chartColorsLegends.sort(this.sortBylabel);
    //     if (this.RiskProfileGraphDetailsArray.length > 0) {
    //       this.RiskProfileGraphDetailsArray.forEach((element, index) => {
    //         try {
    //           if (element !== null) {
    //             if (InvestmentObjective === '') {
    //               // First chart
    //               InvestmentObjective = element.InvestmentObjective;
    //               tempArray.push([
    //                 element.Scheme_Name,
    //                 parseFloat(element.BA_Allocation),
    //               ]);
    //             } else if (InvestmentObjective === element.InvestmentObjective) {
    //               tempArray.push([
    //                 element.Scheme_Name,
    //                 parseFloat(element.BA_Allocation),
    //               ]);
    //             } else if (InvestmentObjective !== element.InvestmentObjective) {
    //               Colors = [];
    //               tempArray.forEach(ele => {
    //                 this.chartColorsLegends.forEach(colorchartele => {
    //                   // if (ele[0] === 'MF' && colorchartele.label === 'Mutual Funds') {
    //                   //   Colors.push(colorchartele.color);
    //                   // } else 
    //                   if (ele[0] === colorchartele.label) {
    //                     Colors.push(colorchartele.color);
    //                   }
    //                 });
    //               });
    //               tempArray = this.sort_without_key(tempArray);
    //               this.options.colors = Colors;
    //               this.CPRAGraph.push({
    //                 chartName: InvestmentObjective,
    //                 data: tempArray,
    //                 options: this.options
    //               });
    //               InvestmentObjective = '';
    //               tempArray = [];
    //               tempArray.push([
    //                 element.Scheme_Name,
    //                 parseFloat(element.BA_Allocation),
    //               ]);
    //             }
    //             if (index === this.RiskProfileGraphDetailsArray.length - 1) {
    //               // Last index
    //               Colors = [];
    //               tempArray.forEach(ele => {
    //                 this.chartColorsLegends.forEach(colorchartele => {
    //                   if (ele[0] === 'MF' && colorchartele.label === 'Mutual Funds') {
    //                     Colors.push(colorchartele.color);
    //                   } else if (ele[0] === colorchartele.label) {
    //                     Colors.push(colorchartele.color);
    //                   }
    //                 });
    //               });
    //               this.options.colors = Colors;
    //               this.CPRAGraph.push({
    //                 chartName: InvestmentObjective,
    //                 data: tempArray,
    //                 options: this.options
    //               });
    //               tempArray = [];
    //             }
    //             console.log('this.AllChartsData', this.CPRAGraph);
    //           }
    //         } catch (e) {
    //           console.log('Null data found on investment objective');
    //         }
    //       });
    //     }
    //   } else {
    //     // this.IsLoading = false;
    //     // this.msg = 'Complete your CPRA';
    //   }
    // });
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
  ConvertReponse(actualResponse: any) {
    try {
      if (
        actualResponse !== '' ||
        actualResponse !== null ||
        actualResponse !== undefined
      ) {
        // let question, questionNumber, section;
        this.quationsList = [];
        // let optionsList = [];
        // let riskList = [];
        // question = '';
        // questionNumber = 0;
        // section = '';
        actualResponse.forEach((element, _index) => {
          const that = this;
          if (element.DataType === 'Question') {
            this.quationsList.push({
              quation: element.DisplayName,
              optionsType: '',
              optionsList: [],
              answer: '',
              riskRating: [],
              FeedBack_ID: '',
              User_ID: '',
              Form_ID: this.Form_ID,
              Temp_Name: that.formName,
              Question_NO: element.QuestionNo,
              DataType: 'Question',
              Section: element.Section,
              controlType: 'sectionContent'
            });
          }
          if (element.DataType === 'radio') {
            if (element.DisplayName !== '') {
              this.quationsList.forEach(questionListObj => {
                if (Number(questionListObj.Question_NO) === Number(element.QuestionNo)) {
                  questionListObj.optionsList.push(element.DisplayName);
                  questionListObj.riskRating.push(element.Riskrating);
                  questionListObj.optionsType = 'radio';
                }
              });
            }
          }
          if (element.DataType === 'checkbox') {
            if (element.DisplayName !== '') {
              this.quationsList.forEach(questionListObj => {
                if (Number(questionListObj.Question_NO) === Number(element.QuestionNo)) {
                  questionListObj.optionsList.push({
                    optionName: element.DisplayName,
                    value: element.DisplayName,
                    Ischecked: false,
                  });
                  questionListObj.riskRating.push(element.Riskrating);
                  questionListObj.optionsType = 'checkbox';
                }
              });
            }
          }
          if (element.DataType === 'Section') {
            this.quationsList.push({
              quation: '',
              optionsList: [],
              answer: '',
              riskRating: '',
              FeedBack_ID: '',
              User_ID: '',
              Form_ID: this.Form_ID,
              Temp_Name: that.formName,
              Question_NO: '',
              DataType: 'label',
              Section: element.DisplayName,
              controlType: 'sectionHeader'
            });
          }
        });
        // console.log(this.quationsList);
      }
    } catch (Exception) {
      console.log('Exception in ConvertResponse:' + Exception);
    }
  }

}
