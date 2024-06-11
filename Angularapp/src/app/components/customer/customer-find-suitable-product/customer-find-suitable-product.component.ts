import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-customer-find-suitable-product',
  templateUrl: './customer-find-suitable-product.component.html',
  styleUrls: ['./customer-find-suitable-product.component.scss']
})
export class CustomerFindSuitableProductComponent implements OnDestroy {

  PageTitle: string;
  activeQuestionIndex: number;

  SampleForm = [
    {
      DisplayName: 'Tell us your purpose of investment',
      options: ['to grow your funds', 'to earn fixed additional income', 'to lower income tax burden', 'to meet financial goals such as childs education, retirement planning'],
      displayType: 'sequential',
      answer:''
    },
    {
      DisplayName: 'Arctic, you are',
      options: ['Individual', 'Corporate'],
      displayType: 'sequential',
      answer:''
    },
    {
      DisplayName: 'Tell us your purpose of investment',
      options: ['to grow your funds', 'to earn fixed additional income', 'to lower income tax burden', 'to meet financial goals such as childs educations, retirement planning'],
      displayType: 'quadrant',
      answer:''
    },
  ];

  constructor() {
    this.fnResetAllValues();
    this.activeQuestionIndex = 0;
    
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    try {
      this.fnResetAllValues();
    } catch (ex) {
      console.log('NgOnDestroy: Customer-Find-Suitable-Product: ', ex);
    }
  }

  
  fnResetAllValues() {
    this.PageTitle = '';
  }

  fnTickAnswer(qustionIndex, selectedAnswer){
    this.SampleForm[qustionIndex].answer = selectedAnswer;
    if(this.SampleForm[qustionIndex].answer !== '' ){
      this.activeQuestionIndex++;
    }
  }

}
