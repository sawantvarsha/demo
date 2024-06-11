import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomerApiService } from '../../../services/customer-api.service';
import { CustomerCommonfunctionsService } from '../../../services/customer-commonfunctions.service';
import { AppConfig } from 'src/app/services/config.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { AuthService } from '../../../services/auth/auth.service';
import { LanguageService } from '../../langService/language.service';

@Component({
  selector: 'app-customer-setup-update-cpra-details',
  templateUrl: './customer-setup-update-cpra-details.component.html',
  styleUrls: ['./customer-setup-update-cpra-details.component.scss'],
})
export class CustomerSetupUpdateCpraDetailsComponent implements OnInit {
  isProd = environment.production;
  @Output() KYCCompletedChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() MoveToNextPage: EventEmitter<boolean> = new EventEmitter();
  @Input() OnlyUpdateCIRP: boolean;
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
    'Nov',
    'Dec',
  ];
  EntityCode: string = '';
  EntityID: string = '';
  target: HTMLElement;

  CustomerID: string = '';
  formName = AppConfig.settings.CSP_UpdateCIRPFormName;
  clientFormName = AppConfig.settings.CSP_UpdateCIRPPageHeaderName;
  IsLoading: boolean = true;
  isError: boolean = false;
  isRiskRatingGenerated: boolean = false;
  showKYCResult: boolean = false;
  ErrorMsg: string = '';
  FeedBackID: any;
  Form_ID: string = '';
  AvgCPRADetails: string = '';
  RiskRating: any;
  RiskProfile: any;
  today = new Date();
  dateFormatted =
    this.today.getMonth() +
    1 +
    '/' +
    this.today.getDate() +
    '/' +
    this.today.getFullYear();
  quationsList = [];
  ActualQuestionaries = [];
  FinIQRequestHeader = {
    EntityCode: '',
    EntityID: '',
    LoginID: '',
    MachineIP: '192.168.20.135',
    // RequestAt: '15-Jul-2020 04:22:54 PM',
    RequestAt:
      this.today.getDate() +
      '-' +
      this.months[this.today.getMonth()] +
      '-' +
      this.today.getFullYear() +
      ' ' +
      this.today.getHours() +
      ':' +
      this.today.getMinutes() +
      ':' +
      this.today.getSeconds(),
    SourceSystem: 'FinIQ Test Excel',
    ExternalRequestID: '906d3433-a5e9-496d-9f8f-196ee5b7fba8',
    CustomerID: '',
    Formname: AppConfig.settings.CSP_UpdateCIRPFormName,
    OldNewFlag: AppConfig.settings.CSP_FormOldNewFlag,
    // OldNewFlag: 'New',
  };
  FinalQuestionAnswered = [
    {
      FeedBack_ID: '',
      User_ID: '',
      Form_ID: '',
      Temp_Name: '',
      Question_NO: '',
      Question: '',
      Answer: '',
      Points: '',
      DataType: '',
      Date_OF_Submission: '',
    },
  ];
  FinalQuestionAnsweredNew = [
    {
      Key: '',
      Value: '',
    },
  ];
  viewKYCQuestionsAnswers = [];
  AllChartsData = [];
  CPRAGraph = [];
  answerList = {};
  totalRiskRating: any;

  SubmitKYCFormSubscriber: Subscription;
  ViewCPRADataSubscription: Subscription;
  GetKYCFormSubscriber: Subscription;
  KYCRiskRatingReponse: any;
  ChartTitle = 'Pie chart';
  type = 'PieChart';
  chartColors = ['#DFC2E4', '#9AD3F0', '#BCE4B1', '#FBE19F'];
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
  FinIQColorCodes = [
    '#dfc2e4',
    '#fbe19f',
    '#9ad3f0',
    '#bce4b1',
    '#ed7d31',
    '#a5a5a5',
    '#619010',
    '#388a90',
    '#6143b7',
    '#a3085f',
    '#85593d',
    '#878787',
    '#b19c0c',
  ];

  options = {
    pieHole: 0,
    // pieSliceText: 'none',
    legend: { position: 'none' },
    backgroundColor: { fill: 'transparent' },
    width: '350',
    height: '225',
    colors: this.chartColors,
    chartArea: { left: '0px', top: '0px', width: '100%', height: '100%' },
    tooltip: {
      isHTML: true,
    },
    is3D: true,
    pieSliceTextStyle: { color: '#000000' },
  };
  IsKYCDoneAtSecStage: boolean = false;
  IsClientKYCDone: string = '';
  ProductsList = [];
  SubmittingquestionAnswers: boolean = false;

  constructor(
    private afs: CustomerApiService,
    public cfs: CustomerCommonfunctionsService,
    public router: Router,
    public commonApi: CommonApiService,
    public authorApi: AuthService,
    public languageApi: LanguageService
  ) {}

  ngOnInit(): void {
    this.IsKYCDoneAtSecStage = AppConfig.settings.CSP_IsKYCDoneAtSecStage;
    this.IsClientKYCDone = sessionStorage.getItem('isClientKYCDone');
    this.CustomerID = sessionStorage.getItem('Username');
    if (this.CustomerID === null || this.CustomerID === undefined) {
      this.CustomerID = sessionStorage.getItem('TempCustomerID');
    }
    this.EntityCode = this.authorApi.EntityCode;
    this.EntityID = this.authorApi.EntityID;
    this.FinIQRequestHeader.EntityCode = this.authorApi.EntityCode;
    this.FinIQRequestHeader.EntityID = this.EntityID;
    this.FinIQRequestHeader.CustomerID =
      AppConfig.settings.CSP_IsKYCDoneAtSecStage === true
        ? ''
        : sessionStorage.getItem('CustomerID');
    let meridian = this.today.getHours() >= 12 ? 'pm' : 'am';
    this.FinIQRequestHeader.RequestAt =
      this.FinIQRequestHeader.RequestAt + ' ' + meridian;
    // Complete KYC ONLY
    this.afs.getRiskassesmentForm(this.formName);
    this.SubmitKYCFormSubscriber = this.afs.riskaccesmentObserver.subscribe(
      (res) => {
        if (Object.keys(res).length !== 0) {
          this.ConvertReponse(res);
          this.ActualQuestionaries = res;
          this.IsLoading = false;
        }
      }
    );
  }
  areAllQuestionsareAnswered() {
    this.isError = false;
    var IsQuestionRemainsUnattempted: boolean = false;
    this.quationsList.forEach((item: any) => {
      if (item.answer === '' && !IsQuestionRemainsUnattempted) {
        IsQuestionRemainsUnattempted = true;
        // document.getElementById("Question_NO_" + item.Question_NO + "_ID").scrollIntoView(); // Commented by Ketan S

        this.isError = true;
        this.ErrorMsg = 'Please attempt all questions.';
        this.ErrorMsgVanish();
        return false;
      }
    });
    if (this.ErrorMsg !== '') {
      this.isError = false;
      return false;
    } else {
      return true;
    }
  }

  ErrorMsgVanish() {
    const x = document.getElementById('snackbar');
    x.className = 'show';
    // document.body.scrollTop = 0;
    // document.documentElement.scrollTop = 0;
    setTimeout(() => {
      x.className = x.className.replace('show', '');
      this.ErrorMsg = '';
      this.isError = false;
    }, 3000);
  }

  IsValidKYCAnswers() {
    this.SubmittingquestionAnswers = true;
    this.ErrorMsg = '';
    this.isError = false;
    if (this.areAllQuestionsareAnswered()) {
      // All Questions are answered
      this.FinalAnswerSubmit();
    } else {
      // All Questions are not answered
      // this.isError = true;
      // this.ErrorMsg = 'Please attempt all questions.';
      // this.ErrorMsgVanish();
      this.SubmittingquestionAnswers = false;
    }
  }

  FinalAnswerSubmit() {
    let Section;
    Section = '';
    this.FinalQuestionAnswered = [];
    this.FinalQuestionAnsweredNew = [];
    this.quationsList.forEach((element) => {
      if (Section !== element.Section) {
        // Section Changed
        Section = element.Section;
        this.FinalQuestionAnswered.push({
          FeedBack_ID: this.FeedBackID,
          User_ID: this.CustomerID,
          Form_ID: this.Form_ID,
          Temp_Name: this.formName,
          Question_NO: '0',
          Question: '',
          Answer: '',
          Points: '',
          DataType: 'Section',
          Date_OF_Submission: element.Date_OF_Submission,
        });
      }
      if (Section === element.Section && Section !== '') {
        // Fill Options
        this.FinalQuestionAnswered.push({
          // eslint-disable-next-line max-len
          FeedBack_ID: this.FeedBackID,
          User_ID: this.CustomerID,
          Form_ID: this.Form_ID,
          Temp_Name: this.formName,
          Question_NO: element.Question_NO,
          Question: element.quation,
          Answer: element.answer,
          Points: 'undefined',
          DataType: element.DataType,
          Date_OF_Submission: element.Date_OF_Submission,
        });
      }
    });

    this.FinalQuestionAnswered.forEach((questionElemet: any) => {
      let QuestionNumber = '';
      let AnswerNumber = 0;
      if (questionElemet.Question_NO !== '0') {
        AnswerNumber = 1;
        QuestionNumber = questionElemet.Question_NO;
        this.ActualQuestionaries.forEach((element: any) => {
          if (
            QuestionNumber === element.QuestionNo &&
            element.DataType === 'radio'
          ) {
            if (
              element.DataType === 'radio' &&
              element.DisplayName === questionElemet.Answer
            ) {
              this.FinalQuestionAnsweredNew.push({
                Key: 'Q' + QuestionNumber,
                Value: AnswerNumber.toString(),
              });
            } else {
              AnswerNumber = AnswerNumber + 1;
            }
          }
        });
      }
    });

    this.FinIQRequestHeader.LoginID = this.CustomerID;
    try {
      if (sessionStorage.getItem('UserType') !== 'RM') {
        if (sessionStorage.getItem('CustomerID')) {
          this.FinIQRequestHeader.CustomerID =
            sessionStorage.getItem('CustomerID');
        } else {
          this.FinIQRequestHeader.CustomerID = '';
        }
      } else {
        this.FinIQRequestHeader.CustomerID = '';
      }
    } catch (ex) {
      this.FinIQRequestHeader.CustomerID = '';
    }

    // this.FinIQRequestHeader.CustomerID = AppConfig.settings.CSP_IsKYCDoneAtSecStage === true ? '' : sessionStorage.getItem('CustomerID');
    this.answerList = {
      FinIQRequestHeader: this.FinIQRequestHeader,
      CRRCalculationRequest: this.FinalQuestionAnsweredNew,
    };
    this.afs.insertKYCformdetail(this.answerList).subscribe((response) => {
      if (response) {
        this.showKYCResult = true;
        this.KYCRiskRatingReponse = response[0];
        if (this.KYCRiskRatingReponse.RiskRatingDetails[0].RiskRating !== '') {
          this.totalRiskRating =
            this.KYCRiskRatingReponse.RiskRatingDetails[0].RiskRating;
          this.AvgCPRADetails =
            this.KYCRiskRatingReponse.RiskRatingDetails[0].Avg_Value;
          if (this.totalRiskRating) {
            this.showKYCResult = true;
            this.cfs.setiskycflag(true);
            this.isRiskRatingGenerated = true;
            // Update Risk rating and risk profile
            sessionStorage.setItem(
              'RiskProfile',
              this.KYCRiskRatingReponse.RiskRatingDetails[0].RiskProfile.toLowerCase()
            );
            sessionStorage.setItem(
              'RiskRating',
              this.KYCRiskRatingReponse.RiskRatingDetails[0].RiskRating
            );
            sessionStorage.setItem(
              'AvgValue',
              this.KYCRiskRatingReponse.RiskRatingDetails[0].Avg_Value
            );

            this.afs
              .GetProductsListofUpdateCIRP('Conservative')
              .subscribe((res) => {
                if (res.RiskProfileDetailsResult.length > 0) {
                  this.parseTheProductsList(
                    res.RiskProfileDetailsResult[0].Avg_Score_Description
                  );
                  // this.parseTheProductsList('Bonds:Y | Certificates:Y | ETFs:Y | Futures:Y | FX:N | Money Market Funds:N | Options:Y');
                }
              });

            let InvestmentObjective = '';
            let tempArray = [];
            let Colors = [];
            this.AllChartsData = [];
            let tempoption = {};
            let RiskProfileGraphDetailsArray =
              this.KYCRiskRatingReponse.RiskprofileGraphDetails;
            RiskProfileGraphDetailsArray = RiskProfileGraphDetailsArray.filter(
              function (item) {
                return item !== null;
              }
            );
            // RiskProfileGraphDetailsArray.forEach((element, index) => {
            //   if(element === null){
            //     RiskProfileGraphDetailsArray.splice(index, 1);
            //   }
            // });
            // Color productwise color array
            if (RiskProfileGraphDetailsArray.length > 0) {
              RiskProfileGraphDetailsArray.forEach((element, _index) => {
                if (this.chartColorsLegends.length === 0) {
                  this.chartColorsLegends.push({
                    label: element.Scheme_Name,
                    color: this.FinIQColorCodes[this.chartColorsLegends.length],
                  });
                } else {
                  let labelFound: boolean = false;
                  this.chartColorsLegends.forEach((ele) => {
                    if (ele.label === element.Scheme_Name) {
                      labelFound = true;
                    }
                  });
                  if (!labelFound) {
                    this.chartColorsLegends.push({
                      label: element.Scheme_Name,
                      color:
                        this.FinIQColorCodes[this.chartColorsLegends.length],
                    });
                  }
                }
              });
            }
            this.chartColorsLegends.sort(this.sortBylabel);
            if (RiskProfileGraphDetailsArray.length > 0) {
              // var DummyOptions = this.options;
              RiskProfileGraphDetailsArray.forEach((element, index) => {
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
                    } else if (
                      InvestmentObjective === element.InvestmentObjective
                    ) {
                      // tempArray.push([
                      //   element.Scheme_Name,
                      //   parseFloat(element.BA_Allocation),
                      // ]);
                      tempArray.push({
                        title:  element.Scheme_Name,
                        value: parseFloat(element.BA_Allocation),
                      });
                    } else if (
                      InvestmentObjective !== element.InvestmentObjective
                    ) {
                      Colors = [];
                      tempArray.forEach((ele) => {
                        this.chartColorsLegends.forEach((colorchartele) => {
                          if (
                            ele[0] === 'MF' &&
                            colorchartele.label === 'Mutual Funds'
                          ) {
                            Colors.push(colorchartele.color);
                          } else if (ele[0] === colorchartele.label) {
                            Colors.push(colorchartele.color);
                          }
                        });
                      });
                      // this.options.colors = Colors;
                      tempoption = this.fngetChartOption();
                      tempoption['colors'] = Colors;

                      this.AllChartsData.push({
                        chartName: InvestmentObjective,
                        data: tempArray,
                        options: tempoption,
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
                    }
                    if (index === RiskProfileGraphDetailsArray.length - 1) {
                      // Last index
                      Colors = [];
                      tempArray.forEach((ele) => {
                        this.chartColorsLegends.forEach((colorchartele) => {
                          if (
                            ele[0] === 'MF' &&
                            colorchartele.label === 'Mutual Funds'
                          ) {
                            Colors.push(colorchartele.color);
                          } else if (ele[0] === colorchartele.label) {
                            Colors.push(colorchartele.color);
                          }
                        });
                      });
                      // this.options.colors = Colors;
                      InvestmentObjective = element.InvestmentObjective;
                      tempoption = this.fngetChartOption();
                      tempoption['colors'] = Colors;
                      this.AllChartsData.push({
                        chartName: InvestmentObjective,
                        data: tempArray,
                        options: tempoption,
                      });
                      tempArray = [];
                    }
                    // console.log('this.AllChartsData', this.AllChartsData);
                  }
                } catch (e) {
                  console.log('Null data found on investment objective');
                }
              });
            }
          }
          if (!this.IsKYCDoneAtSecStage) {
            if (sessionStorage.getItem('isClientKYCDone') !== 'true') {
              sessionStorage.setItem('UserType', 'CLIENT');
              setTimeout(() => {
                this.afs.UpdateSidebarObserver(
                  sessionStorage.getItem('UserType')
                );
              }, AppConfig.settings.FormTimeOut * 1000);
            }
            this.KYCCompletedChanged.emit(true); // left side menu updated
          } else {
            // KYC at 2nd Stage
            let JSONToString: any = {};

            JSONToString['LoginId'] = this.CustomerID;
            try {
              if (
                sessionStorage.getItem('AvgValue') !== undefined ||
                sessionStorage.getItem('AvgValue') !== null
              ) {
                JSONToString['AvgValue'] = sessionStorage.getItem('AvgValue');
              }
              if (
                sessionStorage.getItem('RiskProfile') !== undefined ||
                sessionStorage.getItem('RiskProfile') !== null
              ) {
                JSONToString['RiskProfile'] =
                  sessionStorage.getItem('RiskProfile');
              }
              if (
                sessionStorage.getItem('RiskRating') !== undefined ||
                sessionStorage.getItem('RiskRating') !== null
              ) {
                JSONToString['RiskRating'] =
                  sessionStorage.getItem('RiskRating');
              }
            } catch (ex) {
              console.log(
                'Error occured while saving KYC Result in SetData service :',
                ex
              );
            }

            this.afs
              .SetClientSetupformSavedForFuture(
                this.CustomerID,
                JSON.stringify(JSONToString)
              )
              .subscribe((res) => {
                try {
                  if (res.InsertJSONResult === true) {
                    this.isError = true;
                    this.ErrorMsg = 'Saved info';
                    this.ErrorMsgVanish();
                  } else {
                    this.isError = true;
                    this.ErrorMsg = 'Try again';
                    this.ErrorMsgVanish();
                  }
                } catch (exeception) {
                  console.log(
                    'Error occured while executing SetClientSetupFormSavedForFuture service: ' +
                      exeception
                  );
                }
              });
          }
        } else {
          this.showKYCResult = false;
          this.isRiskRatingGenerated = false;
          this.isError = true;
          this.ErrorMsg = 'Error occured while saving KYC Details.';
          this.ErrorMsgVanish();
        }

        this.SubmittingquestionAnswers = false;
        // console.log(response);
      }
    });
    // this.ViewCPRADataSubscription = this.wfs.viewCPRADataObserver.subscribe((res) => {
    //   if (res.length !== 0 && res !== undefined) {

    //     this.AvgCPRADetails = res[0].RiskRatingDetails[0].Avg_Value;
    //     let InvestmentObjective = '';
    //     let tempArray = [];
    //     this.CPRAGraph = [];
    //     let Colors = [];
    //     const RiskProfileGraphDetailsArray =
    //       res.getKYCDataResult[0].RiskprofileGraphDetails;

    //     RiskProfileGraphDetailsArray.forEach((ele, index) => {
    //       if (ele === null) {
    //         // console.log('true 1',ele,index);
    //         RiskProfileGraphDetailsArray.splice(index - 1, index);
    //         // console.log('true');
    //       }
    //     });
    //     if (RiskProfileGraphDetailsArray.length > 0) {
    //       RiskProfileGraphDetailsArray.forEach((element, index) => {
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
    //                   if (ele[0] === 'MF' && colorchartele.label === 'Mutual Funds') {
    //                     Colors.push(colorchartele.color);
    //                   } else if (ele[0] === colorchartele.label) {
    //                     Colors.push(colorchartele.color);
    //                   }
    //                 });
    //               });
    //               this.options.colors = Colors;
    //               this.AllChartsData.push({
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
    //             if (index === RiskProfileGraphDetailsArray.length - 1) {
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
    //               this.AllChartsData.push({
    //                 chartName: InvestmentObjective,
    //                 data: tempArray,
    //                 options: this.options
    //               });
    //               tempArray = [];
    //             }
    //             console.log('this.AllChartsData', this.AllChartsData);
    //           }
    //         } catch (e) {
    //           console.log('Null data found on investment objective');
    //         }
    //       });
    //     }
    //     console.log('viewCPRADataObserver', this.CPRAGraph[0].data);
    //   }
    // });
    // this.afs.getKYCriskRating(this.formName, this.FeedBackID, this.Form_ID, this.CustomerID).subscribe(
    //   (res: any) => {
    //     try {
    //       if (res[0].RiskRating !== '') {
    //         this.totalRiskRating = res[0].RiskRating;
    //         if (this.totalRiskRating > 0) {
    //           this.showKYCResult = true;
    //           this.cfs.setiskycflag(true);
    //           this.RiskRatingGenerated = true;
    //         }
    //       } else {
    //         this.showKYCResult = false;
    //         this.RiskRatingGenerated = false;
    //         this.ErrorMessage = 'Error occured while saving KYC Details.';
    //       }
    //     } catch (Error) {
    //       console.log(Error);

    //     }
    //   });
    // this.custApi.updateSidebarBS.next(this.userType);
  }
  ConvertReponse(actualResponse: any) {
    try {
      if (
        actualResponse !== '' ||
        actualResponse !== null ||
        actualResponse !== undefined
      ) {
        let question, questionNumber, section;
        this.quationsList = [];
        let optionsList = [];
        let riskList = [];
        question = '';
        questionNumber = 0;
        section = '';
        actualResponse.forEach((element, index) => {
          const that = this;
          if (element.QuestionNo > 0) {
            if (questionNumber === element.QuestionNo) {
              if (element.DataType === 'radio') {
                optionsList.push(element.DisplayName);
                riskList.push(element.Riskrating);
              }
              if (index === actualResponse.length - 1) {
                if (question !== '' && optionsList.length > 0) {
                  // this.quationsList.push({ quation: question, 'optionsList': optionsList, answer: '', riskRating: riskList });
                  this.quationsList.push({
                    quation: question,
                    optionsList,
                    answer: '',
                    riskRating: riskList,
                    FeedBack_ID: '',
                    User_ID: '',
                    Form_ID: this.Form_ID,
                    Temp_Name: that.formName,
                    Date_OF_Submission: this.dateFormatted,
                    Question_NO: questionNumber,
                    DataType: 'radio',
                    Section: section,
                  });
                }
              }
            } else {
              if (question !== '' && optionsList.length > 0) {
                // this.quationsList.push({ quation: question, 'optionsList': optionsList, answer: '', riskRating: riskList });
                this.quationsList.push({
                  quation: question,
                  optionsList,
                  answer: '',
                  riskRating: riskList,
                  FeedBack_ID: '',
                  User_ID: '',
                  Form_ID: this.Form_ID,
                  Temp_Name: that.formName,
                  Date_OF_Submission: this.dateFormatted,
                  Question_NO: questionNumber,
                  DataType: 'radio',
                  Section: section,
                });
              }
              questionNumber = element.QuestionNo;
              section = element.Section;
              this.Form_ID = element.FormID;
              if (element.DataType === 'Question') {
                question = element.DisplayName;
                optionsList = [];
                riskList = [];
              }
            }
          }
        });
        const currLang = this.languageApi.translate.translations;
        this.quationsList.forEach((q) => {
          q.quation = this.languageApi.translatePipe.transform(
            q.quation.trim(),
            currLang
          );
          if (q.optionsList.length > 0) {
            const options :any[] = [];
            q.optionsList.forEach((opt) => {
              opt = this.languageApi.translatePipe.transform(
                opt.trim(),
                currLang
              );
              options.push(opt);
            });
            q.optionsList = options;
          }
        });
        console.log('CPRA Questions', this.quationsList);
      }
    } catch (Exception) {
      console.log('Exception in ConvertResponse:' + Exception);
    }
  }
  ShowKYCANswers() {
    this.GetKYCFormSubscriber = this.afs
      .fetchKYCFormDetails(this.formName, this.CustomerID)
      .subscribe((res) => {
        if (res.DB_GetKYCRiskProfileSummary_DataResult.length > 0) {
          res.DB_GetKYCRiskProfileSummary_DataResult.forEach((element) => {
            if (element.DataType === 'radio' && element.Question_NO !== '0') {
              this.viewKYCQuestionsAnswers.push({
                dataType: 'SectionValue',
                sectionHeader: '',
                QuestionNumber: element.Question_NO,
                key: element.Question,
                value: element.Answer,
              });
            }
          });
          this.IsLoading = false;
        } else {
          this.IsLoading = false;
          // this.msg = 'Complete your CPRA';
          this.isError = true;
          this.ErrorMsg = 'Complete your CPRA';
          this.ErrorMsgVanish();
        }
      });
  }
  completeKYC() {
    // if(this.IsKYCDoneAtSecStage){
    //   this.router.navigate(['customersetup/3/FPFCL']);
    // }else{
    this.router.navigate(['welcome']);
    // }
  }
  doneKYC() {
    this.MoveToNextPage.emit(true); // left side menu updated
  }
  parseTheProductsList(inputStringProductsList: string) {
    // ProductsList
    let divideStringonVerticalBar = [];
    if (inputStringProductsList.includes('|')) {
      // inputStringProductsList = inputStringProductsList.replace(/\s/g, '');
      divideStringonVerticalBar = inputStringProductsList.split('|');
      // console.log(divideStringonVerticalBar);
      this.ProductsList = [];
      divideStringonVerticalBar.forEach((element) => {
        if (element.includes(':')) {
          let productNameandVisibility = element.split(':');
          // console.log(productNameandVisibility);
          productNameandVisibility[1] = productNameandVisibility[1].trim();
          productNameandVisibility[1] = productNameandVisibility[1].replace(
            /\s/g,
            ''
          );
          this.ProductsList.push({
            ProductName: productNameandVisibility[0],
            Visibility: productNameandVisibility[1] === 'Y' ? 'Y' : 'N',
          });
        } else {
          this.ProductsList.push({ ProductName: element, Visibility: 'N' });
        }
      });
    }
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
  scroll(i: number) {
    // el.scrollIntoView({behavior: 'smooth'});
    // document.getElementById("Question_NO_" + this.quationsList[i+2].Question_NO + "_ID").scrollIntoView()
    console.log(i);
    if( i < (this.quationsList.length - 1)){
      // document.getElementById("Question_NO_" + this.quationsList[i+1].Question_NO + "_ID").scrollIntoView({behavior: "smooth",
      // block: "start",
      // inline: "nearest"});
      console.log("Question_NO_" + this.quationsList[i+1].Question_NO + "_ID");
    }
    
    
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
