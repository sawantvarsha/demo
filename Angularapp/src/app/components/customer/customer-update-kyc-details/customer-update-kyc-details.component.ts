import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomerApiService } from '../../../services/customer-api.service';
import { CustomerCommonfunctionsService } from '../../../services/customer-commonfunctions.service';
import { AppConfig } from 'src/app/services/config.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-customer-update-kyc-details',
  templateUrl: './customer-update-kyc-details.component.html',
  styleUrls: ['./customer-update-kyc-details.component.scss'],
})
export class CustomerUpdateKycDetailsComponent implements OnInit {
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
  formName = AppConfig.settings.CSP_UpdateKYCFormName;
  // formName = 'Know Your Customer';
  clientFormName = AppConfig.settings.CSP_UpdateKYCPageHeader;
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
  IsRetryLoading: boolean = false;
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
    Formname: AppConfig.settings.CSP_UpdateKYCFormName,
    // Formname: 'Know Your Customer',
    OldNewFlag: AppConfig.settings.CSP_KYCFormFlag,
    // OldNewFlag: 'Old',
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
      answerType: '',
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
    colors: [],
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
  CustomerName: string = sessionStorage.getItem('CustomerName');

  constructor(
    private afs: CustomerApiService,
    public cfs: CustomerCommonfunctionsService,
    public router: Router,
    public commonApi: CommonApiService,
    public authorApi: AuthService
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
    this.FinIQRequestHeader.CustomerID = sessionStorage.getItem('CustomerID');
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
      if (item.quation !== '' && item.optionsType !== 'checkbox') {
        if (item.answer === '' && !IsQuestionRemainsUnattempted) {
          IsQuestionRemainsUnattempted = true;
          try {
            document
              .getElementById('Question_NO_' + item.Question_NO + '_ID')
              .scrollIntoView();
          } catch (ex) {
            console.log('Error occured while finding the Element: ', ex);
          }
          this.isError = true;
          this.ErrorMsg = 'Please attempt all questions.';
          this.ErrorMsgVanish();
          return false;
        }
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
    }
  }

  FinalAnswerSubmit() {
    this.FinalQuestionAnswered = [];
    this.FinalQuestionAnsweredNew = [];
    this.quationsList.forEach((element) => {
      if (element.Section !== '' && element.quation !== '') {
        if (element.optionsType === 'checkbox') {
          element.optionsList.forEach((optionsTypeEle, optionsTypeindex) => {
            if (optionsTypeEle.Ischecked) {
              this.FinalQuestionAnswered.push({
                // eslint-disable-next-line max-len
                FeedBack_ID: this.FeedBackID,
                User_ID: this.CustomerID,
                Form_ID: this.Form_ID,
                Temp_Name: this.formName,
                Question_NO: element.Question_NO,
                Question: element.quation,
                Answer: (optionsTypeindex + 1).toString(),
                Points: 'undefined',
                DataType: element.DataType,
                Date_OF_Submission: element.Date_OF_Submission,
                answerType: 'checkbox',
              });
            }
          });
        } else {
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
            answerType: 'radio',
          });
        }
      }
    });
    // console.log(this.FinalQuestionAnswered);
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
        if (questionElemet.answerType === 'checkbox') {
          this.FinalQuestionAnsweredNew.push({
            Key: 'Q' + QuestionNumber,
            Value: questionElemet.Answer,
          });
        }
      }
    });

    this.FinIQRequestHeader.LoginID = this.CustomerID;
    this.FinIQRequestHeader.CustomerID = sessionStorage.getItem('CustomerID');
    this.answerList = {
      FinIQRequestHeader: this.FinIQRequestHeader,
      CRRCalculationRequest: this.FinalQuestionAnsweredNew,
    };
    this.afs.insertKYCformdetail(this.answerList).subscribe((response) => {
      if (response) {
        this.showKYCResult = true;
        this.IsRetryLoading = false;
        this.KYCRiskRatingReponse = response[0];
        if (this.KYCRiskRatingReponse.RiskRatingDetails[0].RiskRating !== '') {
          if (this.totalRiskRating) {
            this.showKYCResult = true;
          }
        } else {
          this.showKYCResult = false;
          this.isRiskRatingGenerated = false;
          this.isError = true;
          this.ErrorMsg = 'Error occured while saving KYC Details.';
          this.ErrorMsgVanish();
        }
        // console.log(response);
      }
    });
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
        actualResponse.forEach((element) => {
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
              Date_OF_Submission: this.dateFormatted,
              Question_NO: element.QuestionNo,
              DataType: 'Question',
              Section: element.Section,
              controlType: 'sectionContent',
            });
          }
          if (element.DataType === 'radio') {
            if (element.DisplayName !== '') {
              this.quationsList.forEach((questionListObj) => {
                if (
                  Number(questionListObj.Question_NO) ===
                  Number(element.QuestionNo)
                ) {
                  questionListObj.optionsList.push(element.DisplayName);
                  questionListObj.riskRating.push(element.Riskrating);
                  questionListObj.optionsType = 'radio';
                }
              });
            }
          }
          if (element.DataType === 'checkbox') {
            if (element.DisplayName !== '') {
              this.quationsList.forEach((questionListObj) => {
                if (
                  Number(questionListObj.Question_NO) ===
                  Number(element.QuestionNo)
                ) {
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
              Date_OF_Submission: this.dateFormatted,
              Question_NO: '',
              DataType: 'label',
              Section: element.DisplayName,
              controlType: 'sectionHeader',
            });
          }
        });
        // console.log(this.quationsList);
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
    this.router.navigate(['welcome']);
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
  ReSubmitForm() {
    this.IsRetryLoading = true;
    this.IsValidKYCAnswers();
  }
}
