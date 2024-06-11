import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FinancialPlanService {
  interfaceURL = environment.interfaceURL;
  constructor(public http: HttpClient) {}

  GetMarriagePlan(
    mode,
    currentAge,
    targetMarriageAge,
    avgInvestReturns,
    expectedInflation,
    estimatedCostOfMarriage,
    existingSavingsGoal,
    investmentPlanned,
    customerID,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceURL + 'marriageplan';
      const params = {
        mode,
        currentAge,
        targetMarriageAge,
        avgInvestReturns,
        expectedInflation,
        estimatedCostOfMarriage,
        existingSavingsGoal,
        investmentPlanned,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in marriageplan api function as :', ex);
      return null;
    }
  }
  GetMarriagePlanGraph(
    mode,
    currentAge,
    targetMarriageAge,
    avgInvestReturns,
    expectedInflation,
    estimatedCostOfMarriage,
    existingSavingsGoal,
    investmentPlanned,
    customerID,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceURL + 'marriageplangraph';
      const params = {
        mode,
        currentAge,
        targetMarriageAge,
        avgInvestReturns,
        expectedInflation,
        estimatedCostOfMarriage,
        existingSavingsGoal,
        investmentPlanned,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in marriageplangraph api function as :', ex);
      return null;
    }
  }
  GetVacationPlan(
    mode,
    travelDate,
    avgInvestReturns,
    expectedInflation,
    estimatedCostOfVacation,
    existingSavingsGoal,
    investmentPlanned,
    customerID,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceURL + 'vacationplan';
      const params = {
        mode,
        travelDateAfter: travelDate,
        avgInvestReturns,
        expectedInflation,
        estimatedCostOfVacation,
        existingSavingsGoal,
        investmentPlanned,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in vacationplan api function as :', ex);
      return null;
    }
  }
  GetVacationPlanGraph(
    mode,
    travelDate,
    avgInvestReturns,
    expectedInflation,
    estimatedCostOfVacation,
    existingSavingsGoal,
    investmentPlanned,
    customerID,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceURL + 'vacationplangraph';
      const params = {
        mode,
        travelDateAfter: travelDate,
        avgInvestReturns,
        expectedInflation,
        estimatedCostOfVacation,
        existingSavingsGoal,
        investmentPlanned,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in vacationplangraph api function as :', ex);
      return null;
    }
  }
  GetEducationPlan(
    mode,
    currentAge,
    targetHigherEducationAge,
    avgInvestReturns,
    expectedInflation,
    estimatedCostOfEducation,
    existingSavingsGoal,
    investmentPlanned,
    customerID,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceURL + 'educationplan';
      const params = {
        mode,
        currentAge,
        targetHigherEducationAge,
        avgInvestReturns,
        expectedInflation,
        estimatedCostOfEducation,
        existingSavingsGoal,
        investmentPlanned,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in educationplan api function as :', ex);
      return null;
    }
  }
  GetEducationPlanGraph(
    mode,
    currentAge,
    targetHigherEducationAge,
    avgInvestReturns,
    expectedInflation,
    estimatedCostOfEducation,
    existingSavingsGoal,
    investmentPlanned,
    customerID,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceURL + 'educationplangraph';
      const params = {
        mode,
        currentAge,
        targetHigherEducationAge,
        avgInvestReturns,
        expectedInflation,
        estimatedCostOfEducation,
        existingSavingsGoal,
        investmentPlanned,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in educationplan api function as :', ex);
      return null;
    }
  }
  GetHousePlan(
    mode,
    housePurchaseDateAfter,
    avgInvestReturns,
    expectedInflation,
    estimatedCostOfHouse,
    existingSavingsGoal,
    investmentPlanned,
    customerID,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceURL + 'houseplan';
      const params = {
        mode,
        housePurchaseDateAfter,
        avgInvestReturns,
        expectedInflation,
        estimatedCostOfHouse,
        existingSavingsGoal,
        investmentPlanned,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in houseplan api function as :', ex);
      return null;
    }
  }
  GetHousePlanGraph(
    mode,
    housePurchaseDateAfter,
    avgInvestReturns,
    expectedInflation,
    estimatedCostOfHouse,
    existingSavingsGoal,
    investmentPlanned,
    customerID,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceURL + 'houseplangraph';
      const params = {
        mode,
        housePurchaseDateAfter,
        avgInvestReturns,
        expectedInflation,
        estimatedCostOfHouse,
        existingSavingsGoal,
        investmentPlanned,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in houseplangraph api function as :', ex);
      return null;
    }
  }
  GetTargetCorpus(
    mode,
    targetCorpusRequiredAfter,
    avgInvestReturns,
    expectedTargetCorpusAmt,
    investmentPlanned,
    customerID,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceURL + 'targetcorpus';
      const params = {
        mode,
        targetCorpusRequiredAfter,
        avgInvestReturns,
        expectedTargetCorpusAmt,
        investmentPlanned,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in targetcorpus api function as :', ex);
      return null;
    }
  }
  GetTargetCorpusGraph(
    mode,
    targetCorpusRequiredAfter,
    avgInvestReturns,
    expectedTargetCorpusAmt,
    investmentPlanned,
    customerID,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceURL + 'targetcorpusgraph';
      const params = {
        mode,
        targetCorpusRequiredAfter,
        avgInvestReturns,
        expectedTargetCorpusAmt,
        investmentPlanned,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in targetcorpus api function as :', ex);
      return null;
    }
  }

  //Added by Uddesh on Feb 19, 2022
  GetCarPlan(
    mode,
    carPurchaseDateAfter,
    avgInvestReturns,
    expectedInflation,
    estimatedCostOfCar,
    existingSavingsGoal,
    investmentPlanned,
    customerID,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceURL + 'carplan';
      const params = {
        mode,
        carPurchaseDateAfter,
        avgInvestReturns,
        expectedInflation,
        estimatedCostOfCar,
        existingSavingsGoal,
        investmentPlanned,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in carplan api function as :', ex);
      return null;
    }
  }
  GetCarPlanGraph(
    mode,
    carPurchaseDateAfter,
    avgInvestReturns,
    expectedInflation,
    estimatedCostOfCar,
    existingSavingsGoal,
    investmentPlanned,
    customerID,
    portfolio
  ) {
    try {
      const webMethod = this.interfaceURL + 'carplangraph';
      const params = {
        mode,
        carPurchaseDateAfter,
        avgInvestReturns,
        expectedInflation,
        estimatedCostOfCar,
        existingSavingsGoal,
        investmentPlanned,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in carplangraph api function as :', ex);
      return null;
    }
  }
  GetRetirementPlan(
    mode : any,
        Age : any,
        RetirementAge : any,
        ExpectedLifeSpan : any,
        AvgInvestmentReturnsPreRetirement: any,
        AvgInvestmentReturnsPostRetirement: any,
        AvgInflationRate : any,
        MonthlyExpenses: any,
        ExpectedExpenses: any,
        existingSavingsForGoal: any,
        investmentPlanned:any,
        customerID : any,
        portfolio : any
  ) {
    try {
      const webMethod = this.interfaceURL + 'retirementplan';
      const params = {
        mode ,
        Age,
        RetirementAge,
        ExpectedLifeSpan,
        AvgInvestmentReturnsPreRetirement,
        AvgInvestmentReturnsPostRetirement,
        AvgInflationRate,
        MonthlyExpenses,
        ExpectedExpenses,
        existingSavingsForGoal,
        investmentPlanned,
        customerID ,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Error occured in retirementplan api function as :', ex);
      return null;
    }
  }
  
  //Added by Uddesh on Mar 03, 2022
  GetRetirementPlanGraph(
    mode : any,
        Age : any,
        RetirementAge : any,
        ExpectedLifeSpan : any,
        AvgInvestmentReturnsPreRetirement: any,
        AvgInvestmentReturnsPostRetirement: any,
        AvgInflationRate : any,
        MonthlyExpenses: any,
        ExpectedExpenses: any,
        existingSavingsForGoal: any,
        investmentPlanned:any,
        customerID : any,
        portfolio : any
  ){
    try{
      const webMethod = this.interfaceURL + 'RetirementPlanGraph';
      const params = {
        mode ,
        Age,
        RetirementAge,
        ExpectedLifeSpan,
        AvgInvestmentReturnsPreRetirement,
        AvgInvestmentReturnsPostRetirement,
        AvgInflationRate,
        MonthlyExpenses,
        ExpectedExpenses,
        existingSavingsForGoal,
        investmentPlanned,
        customerID ,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    }catch(ex){
      console.log('Exception Caught in GetRetirementPlanGraph!!!', ex);
    }
  }

  //Added by Uddesh on Mar 14, 2022
  GetInsuranceNeedAnalysis(
    mode: any,
    currentAge: any,
    lifeExpectancy: any,
    avgInvestReturns: any,
    expectedInflation: any,
    insuranceCoverGuranteed: any,
    monthlyExpense: any,
    existingInsuranceCover: any,
    outstandingLoan: any,
    customerID: any,
    portfolio: any
  ) {
    try {
      const webMethod = this.interfaceURL + 'InsuranceNeedAnalysis';
      const params = {
        mode,
        currentAge,
        lifeExpectancy,
        avgInvestReturns,
        expectedInflation,
        insuranceCoverGuranteed,
        monthlyExpense,
        existingInsuranceCover,
        outstandingLoan,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Exception caught in GetInsuranceNeedAnalysis()', ex);
      return null;
    }
  }
  //Added by Uddesh on Mar 14, 2022
  GetInsuranceNeedAnalysisGraph(
    mode: any,
    currentAge: any,
    lifeExpectancy: any,
    avgInvestReturns: any,
    expectedInflation: any,
    insuranceCoverGuranteed: any,
    monthlyExpense: any,
    existingInsuranceCover: any,
    outstandingLoan: any,
    customerID: any,
    portfolio: any
  ) {
    try {
      const webMethod = this.interfaceURL + 'InsuranceNeedAnalysisGraph';
      const params = {
        mode,
        currentAge,
        lifeExpectancy,
        avgInvestReturns,
        expectedInflation,
        insuranceCoverGuranteed,
        monthlyExpense,
        existingInsuranceCover,
        outstandingLoan,
        customerID,
        portfolio,
      };
      return this.http.post<any>(webMethod, params);
    } catch (ex) {
      console.log('Exception caught in GetInsuranceNeedAnalysisGraph()', ex);
      return null;
    }
  }
}
