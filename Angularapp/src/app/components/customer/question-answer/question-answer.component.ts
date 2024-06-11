import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerApiService } from '../../../services/customer-api.service';
import { FxdCommonfunctionsService } from '../../FXD/services/fxd-commonfunctions.service';

@Component({
  selector: 'app-question-answer',
  templateUrl: './question-answer.component.html',
  styleUrls: ['./question-answer.component.scss']
})
export class QuestionAnswerComponent implements OnInit, OnDestroy {

  @Input() FormName: string;
  isProd = environment.production;
  IsLoading: boolean = true;
  QuestionsAnswers = [];
  QuestionswithSection = [];
  Sectionlist = [];
  Errormsg: string;
  RiskAssesmentFormSubscriber: Subscription;
  GetKYCFormSubscriber: Subscription;

  constructor(private CustApi: CustomerApiService,public FXD_cfs: FxdCommonfunctionsService) {
    this.fnDefaultValues();
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this.QuestionsAnswers = [];
    this.QuestionswithSection = [];
    this.Sectionlist = [];
    this.IsLoading = false;
    this.CustApi.Resetriskaccesment();
    if (this.RiskAssesmentFormSubscriber) this.RiskAssesmentFormSubscriber.unsubscribe();
    if (this.GetKYCFormSubscriber) this.GetKYCFormSubscriber.unsubscribe();
  }

  ngOnInit(): void {

    this.IsLoading = true;
    this.fnGetForm();
  }

  fnDefaultValues(): void {
    // this.IsLoading = false;  
    this.Errormsg = '';
  }

  fnGetForm() {
    if (this.FormName !== '') {
      this.CustApi.Resetriskaccesment();
      this.CustApi.getRiskassesmentForm(this.FormName);
    }

    this.RiskAssesmentFormSubscriber = this.CustApi.riskaccesmentObserver.subscribe((res) => {
      if (res.length > 0) {
        if (Object.keys(res).length !== 0) {
          this.fnConvertReponse(res);
          this.fnGetFilledAnswers();
        }
      }
    });
  }

  fnGetFilledAnswers() {
    // Load CIRP Form

    this.GetKYCFormSubscriber = this.CustApi.fetchKYCFormDetails(this.FormName, sessionStorage.getItem('CustomerID')).subscribe((res) => {
      if (res.DB_GetKYCRiskProfileSummary_DataResult.length > 0 && this.IsLoading) {
        this.QuestionsAnswers = [];
        res.DB_GetKYCRiskProfileSummary_DataResult.forEach((element) => {
          if (element.DataType === 'radio' && element.Question_NO !== '0' && this.QuestionswithSection.length > 0) {
            let IsQuestionPresent: boolean = false;
            // Check if Question is present, If yes then append the answer comma seperated
            if (this.QuestionsAnswers.length > 0) {
              this.QuestionsAnswers.forEach(ele => {
                if (ele.QuestionNumber === Number(element.Question_NO)) {
                  IsQuestionPresent = true;
                  ele.value = ele.value + ', ' + element.Answer;
                }
              });
            }
            // If Question is not present
            if (!IsQuestionPresent) {
              this.QuestionsAnswers.push({
                dataType: 'SectionValue',
                sectionHeader: '',
                QuestionNumber: Number(element.Question_NO),
                SectionName: this.QuestionswithSection[Number(element.Question_NO) - 1].sectionName,
                key: element.Question,
                value: element.Answer,
              });
            }
          }
        }
        );
      }
      this.IsLoading = false;
      this.QuestionsAnswers.sort(this.sortByQuestionNumber);
    });
  }
 
  sortByQuestionNumber(a, b) {
    if (a.QuestionNumber < b.QuestionNumber) {
      return -1;
    }
    if (a.QuestionNumber > b.QuestionNumber) {
      return 1;
    }
    return 0;
  }


  fnConvertReponse(actualResponse: any) {
    try {
      if (actualResponse !== '' || actualResponse !== null || actualResponse !== undefined) {
        this.QuestionswithSection = [];
        this.Sectionlist = [];
        actualResponse.forEach((element) => {
          if (element.DataType === 'Section') {
            this.Sectionlist.push(element.DisplayName);
          }
          if (element.DataType === 'Question') {
            this.QuestionswithSection.push({
              questionNumber: element.QuestionNo,
              sectionName: this.Sectionlist[Number(element.Section) - 1]
            });
          }
        });
        console.log(this.QuestionswithSection);
        console.log(this.Sectionlist);
      }
    } catch (Exception) {
      console.log('Exception in ConvertResponse:' + Exception);
    }
  }


  
}

