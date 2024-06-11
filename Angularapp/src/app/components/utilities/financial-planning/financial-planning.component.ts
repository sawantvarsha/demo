import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonfunctionService } from '../../../components/fx-order/commonfunction.service';
import { CustomerApiService } from '../../../services/customer-api.service';
import { ApifunctionService } from '../../../components/fx-order/apifunction.service';
import { AppConfig } from 'src/app/services/config.service';
import { HomeApiService } from './../../../services/home-api.service';
import { FinancialPlanService } from 'src/app/services/financial-plan.service';
import {
  FinancialPlanningModel,
  pieChartOptions,
  ChartOptions,
} from './financial-planning.model';
import { DecimalPipe } from '@angular/common';
import * as moment from 'moment';

enum FinancialModes {
  MP = 'MP',
  IP = 'IP',
  TCP = 'TCP',
  RP = 'RP',
  EP = 'EP',
  HP = 'HP',
  CP = 'CP',
  TP = 'TP',
}
@Component({
  selector: 'app-financial-planning',
  templateUrl: './financial-planning.component.html',
  styleUrls: ['./financial-planning.component.scss'],
})
export class FinancialPlanningComponent implements OnInit {
  @Input() pageMode: number;
  @Output() GoalData: EventEmitter<any> = new EventEmitter();

  financialPlanningModel: FinancialPlanningModel;
  public linecolumnChartOptions: Partial<ChartOptions>;
  public pieChartOptions: Partial<pieChartOptions>;
  showRP: boolean = false;
  showEP: boolean = false;
  today = new Date();
  meridian = this.today.getHours() >= 12 ? 'pm' : 'am';
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
  showHome: boolean;
  selectedPlanner: any;
  CurrencyList = [];
  error_message: string = '';
  MarriagePlanning = [
    {
      DisplayName: 'Current Age',
      controlType: 'range',
      IsDisabled: false,
      value: 10, // Assigned Default value
      min: 0,
      max: 30,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25, 30],
      afterInput: 'years',
      id: 'CA',
      keyword: 'CURRAGE',
    },
    {
      DisplayName: 'Target Marriage Age',
      controlType: 'range',
      IsDisabled: false,
      value: 27, // Assigned Default value
      min: 18,
      max: 48,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [18, 23, 28, 33, 38, 43, 48],
      afterInput: 'years',
      id: 'TGA',
      keyword: 'MARRIAGEAGE',
    },
    {
      DisplayName: 'Avg. Investment Returns (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 12, // Assigned Default value
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'AIR',
      keyword: 'RETURNS',
    },
    {
      DisplayName: 'Expected Inflation (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 7,
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'EI',
      keyword: 'INFLATION',
    },
    {
      DisplayName: 'Estimated Cost of Marriage',
      controlType: 'input',
      IsDisabled: false,
      value: '1,500,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'MARRIAGECOST',
    },
    {
      DisplayName: 'Existing Savings for the Goal',
      controlType: 'input',
      IsDisabled: false,
      value: '250,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXISTSAVINGS',
    },
    {
      DisplayName: 'Monthly Investment Planned',
      controlType: 'input',
      IsDisabled: false,
      value: '5,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'INVESTMENTVALUE',
    },
    {
      DisplayName: 'Initial Investment Planned',
      controlType: 'input',
      IsDisabled: true,
      value: '690,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'INITIALINVESTMENTVALUE',
    },

    {
      DisplayName: 'Expected Cost of Marriage<br>(on Target Marriage Age)',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXPMARRIAGECOST',
      fontSize: '24',
    },
    {
      DisplayName: 'Monthly Investment Required',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'REQMIP',
      fontSize: '16',
    },
    {
      DisplayName: 'Networth of Investments<br>(on Target Marriage Age)',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'NETWORTH',
      fontSize: '24',
    },
    {
      DisplayName: 'Gap',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'GAP',
      fontSize: '16',
    },
  ];
  InsuranceNeedAnalysisPlanning = [
    {
      DisplayName: 'Current Age',
      controlType: 'range',
      IsDisabled: false,
      value: 25, // Assigned Default value
      min: 0,
      max: 50,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 10, 20, 30, 40, 50],
      afterInput: 'years',
      id: 'CA',
      keyword: 'CURRAGE',
    },
    {
      DisplayName: 'Life Expectancy of the Dependant',
      controlType: 'range',
      IsDisabled: false,
      value: 85, // Assigned Default value
      min: 55,
      max: 105,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [55, 65, 75, 85, 95, 105],
      afterInput: 'years',
      id: 'LEX',
      keyword: 'LIFEEX',
    },
    {
      DisplayName: 'Avg. Investment Returns (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 9, // Assigned Default value
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'AIR',
      keyword: 'RETURNS',
    },
    {
      DisplayName: 'Expected Inflation (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 7,
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'EI',
      keyword: 'INFLATION',
    },
    {
      DisplayName: 'Insurance Cover Guaranteed (Current)',
      controlType: 'input',
      IsDisabled: false,
      value: '10,975,320', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'INSURANCECOVERGUARANTEED',
    },
    {
      DisplayName: 'Monthly Expense of the<Dependant(s)>',
      controlType: 'input',
      IsDisabled: false,
      value: '25,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'MONTHLYEXPENSE',
    },
    {
      DisplayName: 'Existing Insurance Cover',
      controlType: 'input',
      IsDisabled: false,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXISTINGINSURANCECOVER',
    },
    {
      DisplayName: 'Outstanding Loan',
      controlType: 'input',
      IsDisabled: false,
      value: '100,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'OUTSTANDINGLOAN',
    },
    {
      DisplayName: 'Expected Insurance Cover',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '10,875,320', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXPECTEDINSURANCECOVER',
      fontSize: '24',
    },
    {
      DisplayName: 'Additional Cover Required',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '10,975,320', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'ADDITIONALCOVERREQ',
      fontSize: '24',
    },
    {
      DisplayName: 'Total Insurance Cover<br>(Current)',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: '10,875,320', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'TOTALINSURANCECOVER',
      fontSize: '24',
    },
    {
      DisplayName: 'Gap',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'GAP',
      fontSize: '16',
    },
  ];
  TargetCorpusPlanning = [
    {
      DisplayName: 'Target Corpus Required after',
      controlType: 'range',
      IsDisabled: false,
      value: '10', // Assigned Default value
      min: '0',
      max: '30',
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25, 30],
      afterInput: 'years',
      id: 'TCRA',
      keyword: 'TARGETCORPUSAFTER',
    },
    {
      DisplayName: 'Avg. Investment Returns (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: '12', // Assigned Default value
      min: '0',
      max: '25',
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'AIR',
      keyword: 'RETURNS',
    },
    {
      DisplayName: 'Estimated Target Corpus Amount',
      controlType: 'input',
      IsDisabled: false,
      value: '10,000,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      id: 'ETCA',
      keyword: 'ESTIMATEDCORPUS',
    },
    {
      DisplayName: 'Monthly Investment Planned',
      controlType: 'input',
      IsDisabled: false,
      value: '45,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'INVESTMENTVALUE',
    },
    {
      DisplayName: 'Expected Target Corpus Amt<br>(on Target Year)',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '10,000,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXPCORPUS',
      fontSize: '24',
    },
    {
      DisplayName: 'Monthly Investment Required',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '45,059', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'REQMIP',
      fontSize: '16',
    },
    {
      DisplayName: 'Networth of Investments<br>(on Target Year)',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'NETWORTH',
      fontSize: '24',
    },
    {
      DisplayName: 'Gap',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: 0, // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'GAP',
      fontSize: '16',
    },
  ];
  RetirementPlanning = [
    {
      DisplayName: 'Current Age',
      controlType: 'range',
      IsDisabled: false,
      value: 25, // Assigned Default value
      min: 20,
      max: 45,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [20, 25, 30, 35, 40, 45],
      afterInput: 'per annum',
      id: 'CA',
      keyword: 'CURRAGE',
    },
    {
      DisplayName: 'Retirement Age',
      controlType: 'range',
      IsDisabled: false,
      value: 60, // Assigned Default value
      min: 40,
      max: 70,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [40, 45, 50, 55, 60, 65, 70],
      afterInput: 'per annum',
      id: 'RA',
      keyword: 'RETIAGE',
    },
    {
      DisplayName: 'Life Expectancy',
      controlType: 'range',
      IsDisabled: false,
      value: 85, // Assigned Default value
      min: 65,
      max: 115,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [65, 75, 85, 95, 105, 115],
      afterInput: 'per annum',
      id: 'LE',
      keyword: 'LIFEEXP',
    },
    {
      DisplayName: 'Avg. Investment Returns Pre Retirement<br>(% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 12, // Assigned Default value
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'AIRPRE',
      keyword: 'RETURNSPRE',
    },
    {
      DisplayName: 'Avg. Investment Returns Post Retirement<br>(% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 9, // Assigned Default value
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'AIRPOST',
      keyword: 'RETURNSPOST',
    },
    {
      DisplayName: 'Expected Inflation (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 7,
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'EI',
      keyword: 'INFLATION',
    },
    {
      DisplayName: 'Monthly Expenses (Current)',
      controlType: 'input',
      IsDisabled: false,
      value: '25,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'MONTHLYEXPENSE',
    },
    {
      DisplayName: 'Expected % of Expenses<br>(Post Retirement)',
      controlType: 'range',
      IsDisabled: false,
      value: 100,
      min: 25,
      max: 150,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 2,
      range: [25, 50, 75, 100, 125, 150],
      afterInput: 'per annum',
      id: 'EEPR',
      keyword: 'EXEXPENSE',
    },
    {
      DisplayName: 'Existing Savings for the Goal',
      controlType: 'input',
      IsDisabled: false,
      value: '250,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXISSAVING',
    },
    {
      DisplayName: 'Monthly Investment Planned',
      controlType: 'input',
      IsDisabled: false,
      value: '9,332', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'INVESTMENTVALUE',
    },
    {
      DisplayName: 'Initial Investment Planned',
      controlType: 'input',
      IsDisabled: true,
      value: '250,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'INITIALINVESTMENTVALUE',
    },
    {
      DisplayName: 'Monthly Expenses (On Target Retirement Age)',
      controlType: 'input',
      IsDisabled: true,
      value: '266,915', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'MONTHLTARGETYEXPENSE',
    },
    {
      DisplayName: 'Currency',
      controlType: 'select',
      IsDisabled: false,
      value: 'USD', // Assigned Default value
      optionList: ['AUD', 'EUR', 'USD'],
      textAlignment: 'right',
      inputValueType: 'Number',
      ColumnNo: 1,
    },
    {
      DisplayName: 'Expected Expense Required<br>(on Target Retirement Age)',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXPECEXREQ',
      fontSize: '24',
    },
    {
      DisplayName: 'Monthly Investment Required',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'MONTHLYINV',
      fontSize: '24',
    },
    {
      DisplayName: 'Networth<br>(on Target Retirement Age)',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: 0, // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'NETWORTH',
      fontSize: '16',
    },
    {
      DisplayName: 'Gap',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: 0, // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'GAP',
      fontSize: '16',
    },
  ];
  EducationPlanning = [
    {
      DisplayName: 'Current Age',
      controlType: 'range',
      IsDisabled: false,
      value: '11', // Assigned Default value
      min: '0',
      max: '30',
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25, 30],
      afterInput: 'years',
      id: 'CA',
      keyword: 'CURRAGE',
    },
    {
      DisplayName: 'Target Higher Education Year at Age',
      controlType: 'range',
      IsDisabled: false,
      value: '21', // Assigned Default value
      min: '15',
      max: '40',
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [15, 20, 25, 30, 35, 40],
      afterInput: 'years',
      id: 'TGA',
      keyword: 'HIGHEREDUCATIONAGE',
    },
    {
      DisplayName: 'Avg. Investment Returns (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: '12', // Assigned Default value
      min: '0',
      max: '25',
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'AIR',
      keyword: 'RETURNS',
    },
    {
      DisplayName: 'Expected Inflation (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: '12', // Assigned Default value
      min: '0',
      max: '25',
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'EI',
      keyword: 'INFLATION',
    },
    {
      DisplayName:
        'Estimated Cost of Education<br>(on Target Higher Education Start Year)',
      controlType: 'input',
      IsDisabled: false,
      value: '1,500,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EDUCATIONCOST',
    },
    {
      DisplayName: 'Existing Savings for the Goal',
      controlType: 'input',
      IsDisabled: false,
      value: '250,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXISTSAVINGS',
    },
    {
      DisplayName: 'Monthly Investment Planned',
      controlType: 'input',
      IsDisabled: false,
      value: '5,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'INVESTMENTVALUE',
    },
    {
      DisplayName: 'Initial Investment Planned',
      controlType: 'input',
      IsDisabled: true,
      value: '690,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'INITIALINVESTMENTVALUE',
    },

    {
      DisplayName:
        'Expected Cost of Education<br>(on Target Higher Education Start Year)',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXPEDUCATIONCOST',
      fontSize: '24',
    },
    {
      DisplayName: 'Monthly Investment Required',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'REQMIP',
      fontSize: '16',
    },
    {
      DisplayName:
        'Networth of Investments<br>(on Target Higher Education Start Year)',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'NETWORTH',
      fontSize: '24',
    },
    {
      DisplayName: 'Gap',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: 0, // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'GAP',
      fontSize: '16',
    },
  ];
  TravelPlanning = [
    {
      DisplayName: 'Travel Date after (Years)',
      controlType: 'range',
      IsDisabled: false,
      value: 6, // Assigned Default value
      min: 0,
      max: 30,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25, 30],
      afterInput: 'years',
      id: 'TDA',
      keyword: 'TDA',
    },
    {
      DisplayName: 'Avg. Investment Returns (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 12, // Assigned Default value
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'AIR',
      keyword: 'AIR',
    },
    {
      DisplayName: 'Expected Inflation (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 7, // Assigned Default value
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'EI',
      keyword: 'EI',
    },
    {
      DisplayName: 'Estimated Cost of Vacation<br> (Current)',
      controlType: 'input',
      IsDisabled: false,
      value: '600,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      id: 'ECV',
      keyword: 'ECV',
    },
    {
      DisplayName: 'Existing Savings for the Goal',
      controlType: 'input',
      IsDisabled: false,
      value: '50,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      id: 'ES',
      keyword: 'ES',
    },
    {
      DisplayName: 'Monthly Investment Planned',
      controlType: 'input',
      IsDisabled: false,
      value: '6,800', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      id: 'MIP',
      keyword: 'INVESTMENTVALUE',
    },
    {
      DisplayName: 'Initial Investment',
      controlType: 'input',
      IsDisabled: true,
      value: '50,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      id: 'II',
      keyword: 'INITIALINVESTMENTVALUE',
    },
    {
      DisplayName: 'Expected Cost of Vacation<br>(on Target Year)',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXPVACATIONCOST',
      fontSize: '24',
    },
    {
      DisplayName: 'Monthly Investment Required',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'REQMIP',
      fontSize: '16',
    },
    {
      DisplayName: 'Networth of Investments<br>(on Target Year)',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'NETWORTH',
      fontSize: '24',
    },
    {
      DisplayName: 'Gap',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'GAP',
      fontSize: '16',
    },
  ];
  HousePlanning = [
    {
      DisplayName: 'House Purchase Date After',
      controlType: 'range',
      IsDisabled: false,
      value: 10, // Assigned Default value
      min: 0,
      max: 30,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25, 30],
      afterInput: 'years',
      id: 'HPA',
      keyword: 'HOUSEPURCHASEAFTER',
    },
    {
      DisplayName: 'Avg. Investment Returns (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 5, // Assigned Default value
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'years',
      id: 'TMA',
      keyword: 'RETURNS',
    },
    {
      DisplayName: 'Expected Inflation (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 7,
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'EI',
      keyword: 'INFLATION',
    },
    {
      DisplayName: 'Estimated Cost of House<br>(Current)',
      controlType: 'input',
      IsDisabled: false,
      value: '1,500,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'HOUSECOST',
    },
    {
      DisplayName: 'Existing Savings for the Goal',
      controlType: 'input',
      IsDisabled: false,
      value: '250,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXISTSAVINGS',
    },
    {
      DisplayName: 'Monthly Investment Planned',
      controlType: 'input',
      IsDisabled: false,
      value: '5,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'INVESTMENTVALUE',
    },
    {
      DisplayName: 'Initial Investment',
      controlType: 'input',
      IsDisabled: true,
      value: '690,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'INITIALINVESTMENTVALUE',
    },

    {
      DisplayName: 'Expected Cost of House<br>(on Target Year)',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXPHOUSECOST',
      fontSize: '24',
    },
    {
      DisplayName: 'Monthly Investment Required',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'REQMIP',
      fontSize: '16',
    },
    {
      DisplayName: 'Networth of Investments<br>(on Target Year)',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'NETWORTH',
      fontSize: '24',
    },
    {
      DisplayName: 'Gap',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'GAP',
      fontSize: '16',
    },
  ];
  CarPlanning = [
    {
      DisplayName: 'Car Purchase Date After',
      controlType: 'range',
      IsDisabled: false,
      value: 10, // Assigned Default value
      min: 0,
      max: 30,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25, 30],
      afterInput: 'years',
      id: 'CA',
      keyword: 'CPDA',
    },
    {
      DisplayName: 'Avg. Investment Returns (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 5, // Assigned Default value
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'years',
      id: 'TMA',
      keyword: 'AIRPA',
    },
    {
      DisplayName: 'Expected Inflation (% p.a.)',
      controlType: 'range',
      IsDisabled: false,
      value: 7,
      min: 0,
      max: 25,
      textAlignment: 'right',
      inputValueType: 'range',
      ColumnNo: 1,
      range: [0, 5, 10, 15, 20, 25],
      afterInput: 'per annum',
      id: 'EI',
      keyword: 'INFLATION',
    },
    {
      DisplayName: 'Estimated Cost of Car<br>(Current)',
      controlType: 'input',
      IsDisabled: false,
      value: '15,00,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'CARCOST',
    },
    {
      DisplayName: 'Existing Savings for the Goal',
      controlType: 'input',
      IsDisabled: false,
      value: '250,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXISTSAVINGS',
    },
    {
      DisplayName: 'Monthly Investment Planned',
      controlType: 'input',
      IsDisabled: false,
      value: '5,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'INVESTMENTVALUE',
    },
    {
      DisplayName: 'Initial Investment',
      controlType: 'input',
      IsDisabled: true,
      value: '690,000', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'INITIALINVESTMENTVALUE',
    },

    {
      DisplayName: 'Expected Cost of Car<br>(on Target Year)',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'EXPCARCOST',
      fontSize: '24',
    },
    {
      DisplayName: 'Monthly Investment Required',
      controlType: 'leftlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'REQMIP',
      fontSize: '16',
    },
    {
      DisplayName: 'Networth of Investments<br>(on Target Year)',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'NETWORTH',
      fontSize: '24',
    },
    {
      DisplayName: 'Gap',
      controlType: 'rightlabel',
      IsDisabled: true,
      value: '0', // Assigned Default value
      textAlignment: 'right',
      inputValueType: 'Amount',
      ColumnNo: 2,
      keyword: 'GAP',
      fontSize: '16',
    },
  ];
  investmentMode: any;
  isMIP: any;
  selectedPlanning: any;
  currency: any;
  constructor(
    public router: Router,
    public commonApi: CommonfunctionService,
    public CustApi: CustomerApiService,
    public FXApi: ApifunctionService,
    public homeApi: HomeApiService,
    public custApi: CustomerApiService,
    public financialPlanningApi: FinancialPlanService,
    public decimalPipe: DecimalPipe
  ) {
    if (this.pageMode === undefined) {
      this.pageMode = 2;
    }
    this.showHome = true;
    this.investmentMode = 'MIP'; //LUMPSUM
    this.isMIP = this.investmentMode === 'MIP';
    this.financialPlanningModel = new FinancialPlanningModel();
    this.linecolumnChartOptions = this.financialPlanningModel.lineChartOptions;
    this.pieChartOptions = this.financialPlanningModel.pieChartOptions;
  }

  ngOnInit(): void {
    this.currency = this.homeApi.baseCCY;

    this.custApi.getBankBaseCCYOBS.subscribe((ccy) => {
      if (ccy === '') {
        this.custApi.setBankBaseCCY(AppConfig.settings.BankBaseCCy);
        this.currency = AppConfig.settings.BankBaseCCy;
      } else {
        this.currency = ccy;
      }
    });
    this.showHome = true;
    if (this.pageMode === undefined) {
      this.pageMode = 2;
    }
    this.fnGetInvestPlanning();

    this.FXApi.ResetGetAllTradablePairsSF();
    this.FXApi.GetAllTradablePairs();
    this.FXApi.GetAllTradablePairsSFObserver.subscribe((res) => {
      try {
        if (res.length > 0) {
          res.forEach((ccyEle) => {
            if (this.CurrencyList.length > 0) {
              let IsCcyFound: boolean = false;
              this.CurrencyList.forEach((CurrencyListEle) => {
                if (CurrencyListEle === ccyEle.Asset1) {
                  IsCcyFound = true;
                }
              });
              if (!IsCcyFound) {
                this.CurrencyList.push(ccyEle.Asset1);
              }
            } else {
              this.CurrencyList.push(ccyEle.Asset1);
            }
          });

          if (this.CurrencyList.length > 0) {
            this.RetirementPlanning.forEach((ele) => {
              if (ele.DisplayName === 'Currency') {
                ele.optionList = this.CurrencyList;
                ele.value = 'USD'; // Assigned Default value
              }
            });
          }
        }
      } catch (ex) {}
    });
    this.fnCalculate();
  }

  fnGetInvestPlanning() {
    this.RetirementPlanning.forEach((ele) => {
      if (ele.DisplayName === 'Investment Profile') {
        ele.value = this.homeApi.RiskProfile;
      }
    });
    this.EducationPlanning.forEach((ele) => {
      if (ele.DisplayName === 'Investment Profile') {
        ele.value = this.homeApi.RiskProfile;
      }
    });
  }

  changeTab(choice) {
    console.log('selected TAB', choice);
    // this.showEP = false;
    // this.showRP = false;
    switch (choice) {
      case 'HOME':
        this.investmentMode = 'MIP';
        this.isMIP = true;
        this.showHome = true;
        this.ResetAll();
        break;
      case FinancialModes.MP:
        this.showHome = false;
        this.selectedPlanning = 'MP';
        this.fnCalculate();
        break;
      case FinancialModes.IP:
        this.showHome = false;
        this.selectedPlanning = 'IP';
        break;
      case FinancialModes.TCP:
        this.showHome = false;
        this.selectedPlanning = 'TCP';
        break;
      case FinancialModes.RP:
        this.showHome = false;
        this.selectedPlanning = 'RP';
        break;
      case FinancialModes.EP:
        this.showHome = false;
        this.selectedPlanning = 'EP';
        break;
      case FinancialModes.HP:
        this.showHome = false;
        this.selectedPlanning = 'HP';
        break;
      case FinancialModes.CP:
        this.showHome = false;
        this.selectedPlanning = 'CP';

        break;
      case FinancialModes.TP:
        this.showHome = false;
        this.selectedPlanning = 'TP';

        this.financialPlanningApi
          .GetVacationPlanGraph(
            'MIP',
            6,
            12,
            7,
            600000,
            600000,
            6800,
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((vp) => {
            console.log(vp);
            const values: any[] = vp.VacationPlanningGraphResp;
            if (values.length > 0) {
              this.linecolumnChartOptions.series[0].data = values.map((v) =>
                parseFloat(v.vacationCost.toFixed(2))
              );
              this.linecolumnChartOptions.series[1].data = values.map((v) =>
                parseFloat(v.networth.toFixed(2))
              );
              // this.linecolumnChartOptions.series[2].data = values.map(
              //   (v) => v.vacationCost
              // );
              this.linecolumnChartOptions.labels = values.map((v) => v.year);

              this.pieChartOptions.series = [6800, 600000];
            }
          });
        break;
      default:
        this.showHome = true;
        break;
    }
    this.ResetAll();
    this.fnCalculate();
  }
  fnCalculate() {
    // let EPorRP: string = this.showEP ? 'EP' : 'RP';

    switch (this.selectedPlanning) {
      case FinancialModes.MP:
        console.log(FinancialModes.MP);
        this.financialPlanningApi
          .GetMarriagePlan(
            this.investmentMode,
            this.MarriagePlanning.find(
              (m) => m.keyword.toUpperCase() === 'CURRAGE'
            ).value,
            this.MarriagePlanning.find(
              (m) => m.keyword.toUpperCase() === 'MARRIAGEAGE'
            ).value,
            this.MarriagePlanning.find(
              (m) => m.keyword.toUpperCase() === 'RETURNS'
            ).value,
            this.MarriagePlanning.find(
              (m) => m.keyword.toUpperCase() === 'INFLATION'
            ).value,
            this.commonApi.UnformatNumberFromFloat(
              this.MarriagePlanning.find(
                (m) => m.keyword.toUpperCase() === 'MARRIAGECOST'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.MarriagePlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXISTSAVINGS'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.MarriagePlanning.find(
                (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((mp) => {
            try {
              console.log(mp);
              // this.MarriagePlanning.find(
              //   (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              // ).value
              this.MarriagePlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXPMARRIAGECOST'
              ).value = mp.expectedCostOfMarriage;
              this.MarriagePlanning.find(
                (m) => m.keyword.toUpperCase() === 'GAP'
              ).value = Math.floor(mp.gap);
              this.MarriagePlanning.find(
                (m) => m.keyword.toUpperCase() === 'INITIALINVESTMENTVALUE'
              ).value = this.decimalPipe.transform(
                mp.initialInvestment,
                '1.0-0'
              );
              this.MarriagePlanning.find(
                (m) => m.keyword.toUpperCase() === 'REQMIP'
              ).value = mp.investmentRequired;
              this.MarriagePlanning.find(
                (m) => m.keyword.toUpperCase() === 'NETWORTH'
              ).value = mp.networthOfInvestment;
              // const values: any[] = mp.MarriagePlanningGraphResp;
            } catch (error) {
              console.log(error);
            }
          });
        this.financialPlanningApi
          .GetMarriagePlanGraph(
            this.investmentMode,
            this.MarriagePlanning.find(
              (m) => m.keyword.toUpperCase() === 'CURRAGE'
            ).value,
            this.MarriagePlanning.find(
              (m) => m.keyword.toUpperCase() === 'MARRIAGEAGE'
            ).value,
            this.MarriagePlanning.find(
              (m) => m.keyword.toUpperCase() === 'RETURNS'
            ).value,
            this.MarriagePlanning.find(
              (m) => m.keyword.toUpperCase() === 'INFLATION'
            ).value,
            this.commonApi.UnformatNumberFromFloat(
              this.MarriagePlanning.find(
                (m) => m.keyword.toUpperCase() === 'MARRIAGECOST'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.MarriagePlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXISTSAVINGS'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.MarriagePlanning.find(
                (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((mp) => {
            console.log(mp);
            const values: any[] = mp.MarriagePlanningGraphResp;
            if (values.length > 0) {
              this.linecolumnChartOptions.series[0].data = values.map((m) =>
                parseFloat(m.marriageCost.toFixed(2))
              );
              this.linecolumnChartOptions.series[1].data = values.map((m) =>
                parseFloat(m.networth.toFixed(2))
              );
              this.linecolumnChartOptions.labels = values.map((m) => m.year);

              this.pieChartOptions.series = [6800, 60000];
              this.pieChartOptions.labels = ['Interest', 'Principal'];
              this.linecolumnChartOptions.tooltip = {
                enabled: true,
                x: {
                  show: true,
                  format: 'dd MMM',
                  formatter: (val) => {
                    return moment(val).format('YYYY').toString();
                  },
                },
                y: {
                  formatter: (val) => {
                    return this.commonApi.FormatNumberr(val);
                  },
                  title: {
                    formatter: function (_seriesName) {
                      return _seriesName;
                    },
                  },
                },
              };
            }
          });
        break;
      case FinancialModes.IP:
        //Added by Uddesh on March 14, 2022
        this.financialPlanningApi
          .GetInsuranceNeedAnalysis(
            this.investmentMode,
            this.InsuranceNeedAnalysisPlanning.find(
              (m) => m.keyword.toUpperCase() === 'CURRAGE'
            ).value,
            this.InsuranceNeedAnalysisPlanning.find(
              (m) => m.keyword.toUpperCase() === 'LIFEEX'
            ).value,
            this.InsuranceNeedAnalysisPlanning.find(
              (m) => m.keyword.toUpperCase() === 'RETURNS'
            ).value,
            this.InsuranceNeedAnalysisPlanning.find(
              (m) => m.keyword.toUpperCase() === 'INFLATION'
            ).value,
            this.commonApi.UnformatNumberFromFloat(
              this.InsuranceNeedAnalysisPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INSURANCECOVERGUARANTEED'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.InsuranceNeedAnalysisPlanning.find(
                (m) => m.keyword.toUpperCase() === 'MONTHLYEXPENSE'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.InsuranceNeedAnalysisPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXISTINGINSURANCECOVER'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.InsuranceNeedAnalysisPlanning.find(
                (m) => m.keyword.toUpperCase() === 'OUTSTANDINGLOAN'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((ip) => {
            console.log('Master check Response Insurance', ip);
            const values: any[] = ip;
            if (values) {
              console.log('*/*/**/');
              this.InsuranceNeedAnalysisPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXPECTEDINSURANCECOVER'
              ).value = Math.floor(ip.expectedInsuranceCover);
              this.InsuranceNeedAnalysisPlanning.find(
                (m) => m.keyword.toUpperCase() === 'ADDITIONALCOVERREQ'
              ).value = Math.floor(ip.additionalCoverRequired);
              this.InsuranceNeedAnalysisPlanning.find(
                (m) => m.keyword.toUpperCase() === 'TOTALINSURANCECOVER'
              ).value = Math.floor(ip.totalInsuranceCover);
              this.InsuranceNeedAnalysisPlanning.find(
                (m) => m.keyword.toUpperCase() === 'GAP'
              ).value = Math.floor(ip.gap);
            }
          });
        //for graph
        this.financialPlanningApi
          .GetInsuranceNeedAnalysisGraph(
            this.investmentMode,
            this.InsuranceNeedAnalysisPlanning.find(
              (m) => m.keyword.toUpperCase() === 'CURRAGE'
            ).value,
            this.InsuranceNeedAnalysisPlanning.find(
              (m) => m.keyword.toUpperCase() === 'LIFEEX'
            ).value,
            this.InsuranceNeedAnalysisPlanning.find(
              (m) => m.keyword.toUpperCase() === 'RETURNS'
            ).value,
            this.InsuranceNeedAnalysisPlanning.find(
              (m) => m.keyword.toUpperCase() === 'INFLATION'
            ).value,
            this.commonApi.UnformatNumberFromFloat(
              this.InsuranceNeedAnalysisPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INSURANCECOVERGUARANTEED'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.InsuranceNeedAnalysisPlanning.find(
                (m) => m.keyword.toUpperCase() === 'MONTHLYEXPENSE'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.InsuranceNeedAnalysisPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXISTINGINSURANCECOVER'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.InsuranceNeedAnalysisPlanning.find(
                (m) => m.keyword.toUpperCase() === 'OUTSTANDINGLOAN'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((ip) => {
            console.log('Master check Response Insurance Graph', ip);
            const values: any[] = ip.InsuranceNeedAnalysisGraphResp;
            if (values) {
              this.linecolumnChartOptions.series[0].data = values.map((m) =>
                parseFloat(m.yearlyExpense.toFixed(2))
              );
              this.linecolumnChartOptions.series[1].data = values.map((m) =>
                parseFloat(m.yearendNetworth.toFixed(2))
              );
              this.linecolumnChartOptions.labels = values.map((m) => m.year);
              this.linecolumnChartOptions.tooltip = {
                enabled: true,
                x: {
                  show: true,
                  format: 'dd MMM',
                  formatter: (val) => {
                    return moment(val).format('YYYY').toString();
                  },
                },
                y: {
                  formatter: (val) => {
                    return this.commonApi.FormatNumberr(val);
                  },
                  title: {
                    formatter: function (_seriesName) {
                      return _seriesName;
                    },
                  },
                },
              };
            }
          });
        break;
      case FinancialModes.TCP:
        this.financialPlanningApi
          .GetTargetCorpus(
            this.investmentMode,
            this.TargetCorpusPlanning.find(
              (m) => m.keyword.toUpperCase() === 'TARGETCORPUSAFTER'
            ).value,
            this.TargetCorpusPlanning.find(
              (m) => m.keyword.toUpperCase() === 'RETURNS'
            ).value,
            this.commonApi.UnformatNumberFromFloat(
              this.TargetCorpusPlanning.find(
                (m) => m.keyword.toUpperCase() === 'ESTIMATEDCORPUS'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.TargetCorpusPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((mp) => {
            try {
              console.log(mp);
              // this.MarriagePlanning.find(
              //   (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              // ).value
              this.TargetCorpusPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXPCORPUS'
              ).value = mp.expectedTargetCorpus;
              this.TargetCorpusPlanning.find(
                (m) => m.keyword.toUpperCase() === 'GAP'
              ).value = Math.floor(mp.gap);
              this.TargetCorpusPlanning.find(
                (m) => m.keyword.toUpperCase() === 'REQMIP'
              ).value = mp.investmentRequired;
              this.TargetCorpusPlanning.find(
                (m) => m.keyword.toUpperCase() === 'NETWORTH'
              ).value = mp.networthOfInvestment;
              // const values: any[] = mp.MarriagePlanningGraphResp;
            } catch (error) {
              console.log(error);
            }
          });
        this.financialPlanningApi
          .GetTargetCorpusGraph(
            this.investmentMode,
            this.TargetCorpusPlanning.find(
              (m) => m.keyword.toUpperCase() === 'TARGETCORPUSAFTER'
            ).value,
            this.TargetCorpusPlanning.find(
              (m) => m.keyword.toUpperCase() === 'RETURNS'
            ).value,
            this.commonApi.UnformatNumberFromFloat(
              this.TargetCorpusPlanning.find(
                (m) => m.keyword.toUpperCase() === 'ESTIMATEDCORPUS'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.TargetCorpusPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((mp) => {
            try {
              console.log(mp);
              const values: any[] = mp.TargetCorpusGraphResp;
              if (values.length > 0) {
                this.linecolumnChartOptions.series[0].data = values.map((m) =>
                  parseFloat(m.networth.toFixed(2))
                );
                this.linecolumnChartOptions.series[1].data = values.map((m) =>
                  parseFloat(m.networth.toFixed(2))
                );
                this.linecolumnChartOptions.labels = values.map((m) => m.year);

                this.pieChartOptions.series = [6800, 60000];
                this.pieChartOptions.labels = ['Interest', 'Principal'];
                this.linecolumnChartOptions.tooltip = {
                  enabled: true,
                  x: {
                    show: true,
                    format: 'dd MMM',
                    formatter: (val) => {
                      return moment(val).format('YYYY').toString();
                    },
                  },
                  y: {
                    formatter: (val) => {
                      return this.commonApi.FormatNumberr(val);
                    },
                    title: {
                      formatter: function (_seriesName) {
                        return _seriesName;
                      },
                    },
                  },
                };
              }
            } catch (error) {
              console.log(error);
            }
          });
        break;
      case FinancialModes.RP:
        // Retirement Planning
        let AvgInflationRate = 0,
          ExpectedLifeSpan = 0,
          RetirementAge = 0;
        let RPAge = 0,
          RPAvgInvestmentReturnsPreRet = 0,
          RPAvgInvestmentReturnsPostRet = 0,
          RPInitialInvestment = 0,
          RPMonthlyExpenses = 0,
          RPExpectedExpenses = 0,
          RPExistinSavings = 0;
        this.RetirementPlanning.forEach((RPObj) => {
          // console.log('Master Check Uddesh', this.RetirementPlanning);
          if (RPObj.value !== '') {
            //RPObj.controlType === 'input' &&
            switch (RPObj.DisplayName) {
              case 'Current Age':
                RPAge = Number(RPObj.value);
                break;
              case 'Retirement Age':
                RetirementAge = Number(RPObj.value);
                break;
              case 'Life Expectancy':
                ExpectedLifeSpan = Number(RPObj.value);
                break;
              case 'Avg. Investment Returns Pre Retirement<br>(% p.a.)':
                RPAvgInvestmentReturnsPreRet = Number(RPObj.value);
                break;
              case 'Avg. Investment Returns Post Retirement<br>(% p.a.)':
                RPAvgInvestmentReturnsPostRet = Number(RPObj.value);
                break;
              case 'Monthly Expenses (Current)':
                try {
                  RPMonthlyExpenses = Number(
                    RPObj.value.toLocaleString().replace(',', '')
                  );
                } catch (Ex) {}
                break;
              case 'Expected % of Expenses<br>(Post Retirement)':
                try {
                  RPExpectedExpenses = Number(
                    RPObj.value.toLocaleString().replace(',', '')
                  );
                } catch (Ex) {}
                break;

              case 'Existing Savings for the Goal':
                try {
                  RPExistinSavings = Number(
                    RPObj.value.toLocaleString().replace(',', '')
                  );
                } catch (Ex) {}
                break;

              case 'Expected Inflation (% p.a.)':
                AvgInflationRate = Number(RPObj.value);
                break;
              case 'Monthly Investment Planned':
                try {
                  RPInitialInvestment = Number(
                    RPObj.value.toLocaleString().replace(',', '')
                  );
                } catch (Ex) {}
                break;
              // case 'Expected % of Expenses<br>(Post Retirement)':
              //   try {
              //     RPExpectedExpPer = Number(
              //       RPObj.value.toLocaleString().replace(',', '')
              //     );
              //   } catch (Ex) {}
              //   break;
            }
          }
        });
        // Request Formation
        const RetirementPlanningParameters = {
          FinIQRequestHeader: {
            EntityCode: AppConfig.settings.CSP_EntityDetails.Entity_Code,
            LoginID: sessionStorage.getItem('Username'),
            MachineIP: '',
            RequestAt:
              this.today.getDate() +
              '-' +
              this.months[this.today.getMonth() + 1] +
              '-' +
              this.today.getFullYear() +
              ' ' +
              this.today.getHours() +
              ':' +
              this.today.getMinutes() +
              ':' +
              this.today.getSeconds() +
              ' ' +
              this.meridian,
            RequestID: '',
            SourceSystem: 'Angular Request',
            Token: '',
          },
          FinancialPlanningReq: {
            mode: this.investmentMode,
            Age: RPAge,
            RetirementAge,
            ExpectedLifeSpan,
            AvgInvestmentReturnsPreRetirement: RPAvgInvestmentReturnsPreRet,
            AvgInvestmentReturnsPostRetirement: RPAvgInvestmentReturnsPostRet,
            AvgInflationRate,
            MonthlyExpenses: RPMonthlyExpenses,
            ExpectedExpenses: RPExpectedExpenses,
            existingSavingsForGoal: RPExistinSavings,
            InitialInvestment: RPInitialInvestment,
            PlanningType: 'Retirement',
            custId: this.homeApi.CustomerId,
            portfolio: this.homeApi.BestPortfolio[0].PortfolioName,
          },
        };
        console.log(
          'Master Uddesh Parameter Check',
          RetirementPlanningParameters
        );
        this.financialPlanningApi
          .GetRetirementPlan(
            this.investmentMode,
            RPAge,
            RetirementAge,
            ExpectedLifeSpan,
            RPAvgInvestmentReturnsPreRet,
            RPAvgInvestmentReturnsPostRet,
            AvgInflationRate,
            RPMonthlyExpenses,
            RPExpectedExpenses,
            RPExistinSavings,
            RPInitialInvestment,
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((res) => {
            console.log('Master Uddesh Response Check', res);
            if (res) {
              this.RetirementPlanning.forEach((RPObj) => {
                switch (RPObj.DisplayName) {
                  case 'Expected Expense Required<br>(on Target Retirement Age)':
                    RPObj.value = this.commonApi.FormatNumberr(
                      Math.round(res.expectedExpenseRequired)
                    );
                    break;
                  case 'Monthly Investment Required':
                    RPObj.value = this.commonApi.FormatNumberr(
                      Math.round(res.investmentRequired)
                    );
                    break;
                  case 'Lumpsum Investment Required':
                    RPObj.value = this.commonApi.FormatNumberr(
                      Math.round(res.investmentRequired)
                    );
                    break;
                  case 'Networth<br>(on Target Retirement Age)':
                    RPObj.value = this.commonApi.FormatNumberr(
                      Math.round(res.networth)
                    );
                    break;
                  case 'Gap':
                    RPObj.value = this.commonApi.FormatNumberr(
                      Math.round(res.gap)
                    );
                    break;
                  case 'Initial Investment Planned':
                    RPObj.value = this.commonApi.FormatNumberr(
                      Math.round(res.initialInvestment)
                    );
                    break;
                  case 'Monthly Expenses (On Target Retirement Age)':
                    RPObj.value = this.commonApi.FormatNumberr(
                      Math.round(res.monthlyExpense)
                    );
                    break;
                }
              });
              // console.log("after response check", this.RetirementPlanning)
            }
          });

        this.financialPlanningApi
          .GetRetirementPlanGraph(
            this.investmentMode,
            RPAge,
            RetirementAge,
            ExpectedLifeSpan,
            RPAvgInvestmentReturnsPreRet,
            RPAvgInvestmentReturnsPostRet,
            AvgInflationRate,
            RPMonthlyExpenses,
            RPExpectedExpenses,
            RPExistinSavings,
            RPInitialInvestment,
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((res) => {
            console.log('Retirement PLan Graph Response /*/*/*/*/*/', res);
            if (res) {
              const values: any[] = res.RetirementPlanningGraphResp;
              if (values.length > 0) {
                this.linecolumnChartOptions.series[0].data = values.map(
                  (m) => parseFloat(m.retirementExpense.toFixed(2))
                  // parseFloat((m.retirementExpense/100000000000).toFixed(2))
                );
                this.linecolumnChartOptions.series[1].data = values.map(
                  (m) => parseFloat(m.networth.toFixed(2))
                  // parseFloat((m.networth/10000000).toFixed(2))
                );
                this.linecolumnChartOptions.labels = values.map((m) => m.year);

                // this.pieChartOptions.series = [6800, 60000];
                // this.pieChartOptions.labels = ['Interest', 'Principal'];
                this.linecolumnChartOptions.tooltip = {
                  enabled: true,
                  x: {
                    show: true,
                    format: 'dd MMM',
                    formatter: (val) => {
                      return moment(val).format('YYYY').toString();
                    },
                  },
                  y: {
                    formatter: (val) => {
                      return this.commonApi.FormatNumberr(val);
                    },
                    title: {
                      formatter: function (_seriesName) {
                        return _seriesName;
                      },
                    },
                  },
                };
              }
            }
          });
        break;
      case FinancialModes.EP:
        this.financialPlanningApi
          .GetEducationPlan(
            this.investmentMode,
            this.EducationPlanning.find(
              (m) => m.keyword.toUpperCase() === 'CURRAGE'
            ).value,
            this.EducationPlanning.find(
              (m) => m.keyword.toUpperCase() === 'HIGHEREDUCATIONAGE'
            ).value,
            this.EducationPlanning.find(
              (m) => m.keyword.toUpperCase() === 'RETURNS'
            ).value,
            this.EducationPlanning.find(
              (m) => m.keyword.toUpperCase() === 'INFLATION'
            ).value,
            this.commonApi.UnformatNumberFromFloat(
              this.EducationPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EDUCATIONCOST'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.EducationPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXISTSAVINGS'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.EducationPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((mp) => {
            try {
              console.log(mp);
              // this.EducationPlanning.find(
              //   (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              // ).value
              this.EducationPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXPEDUCATIONCOST'
              ).value = mp.expectedCostOfEducation;
              this.EducationPlanning.find(
                (m) => m.keyword.toUpperCase() === 'GAP'
              ).value = Math.floor(mp.gap);
              this.EducationPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INITIALINVESTMENTVALUE'
              ).value = this.decimalPipe.transform(
                mp.initialInvestment,
                '1.0-0'
              );
              this.EducationPlanning.find(
                (m) => m.keyword.toUpperCase() === 'REQMIP'
              ).value = mp.investmentRequired;
              this.EducationPlanning.find(
                (m) => m.keyword.toUpperCase() === 'NETWORTH'
              ).value = mp.networthOfInvestment;
              // const values: any[] = mp.MarriagePlanningGraphResp;
            } catch (error) {
              console.log(error);
            }
          });

        this.financialPlanningApi
          .GetEducationPlanGraph(
            this.investmentMode,
            this.EducationPlanning.find(
              (m) => m.keyword.toUpperCase() === 'CURRAGE'
            ).value,
            this.EducationPlanning.find(
              (m) => m.keyword.toUpperCase() === 'HIGHEREDUCATIONAGE'
            ).value,
            this.EducationPlanning.find(
              (m) => m.keyword.toUpperCase() === 'RETURNS'
            ).value,
            this.EducationPlanning.find(
              (m) => m.keyword.toUpperCase() === 'INFLATION'
            ).value,
            this.commonApi.UnformatNumberFromFloat(
              this.EducationPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EDUCATIONCOST'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.EducationPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXISTSAVINGS'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.EducationPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((mp) => {
            console.log(mp);
            const values: any[] = mp.EducationPlanningGraphResp;
            if (values.length > 0) {
              this.linecolumnChartOptions.series[0].data = values.map((m) =>
                parseFloat(m.educationCost.toFixed(2))
              );
              this.linecolumnChartOptions.series[1].data = values.map((m) =>
                parseFloat(m.networth.toFixed(2))
              );
              this.linecolumnChartOptions.labels = values.map((m) => m.year);

              this.pieChartOptions.series = [6800, 60000];
              this.pieChartOptions.labels = ['Interest', 'Principal'];
              this.linecolumnChartOptions.tooltip = {
                enabled: true,
                x: {
                  show: true,
                  format: 'dd MMM',
                  formatter: (val) => {
                    return moment(val).format('YYYY').toString();
                  },
                },
                y: {
                  formatter: (val) => {
                    return this.commonApi.FormatNumberr(val);
                  },
                  title: {
                    formatter: function (_seriesName) {
                      return _seriesName;
                    },
                  },
                },
              };
            }
          });
        // Education Planning
        // let Age = 0,
        //   AvgInvestmentReturns = 0,
        //   EducationCost = 0,
        //   EducationStartAge = 0,
        //   InitialInvestment = 0,
        //   MonthlyContribution = 0;
        // this.EducationPlanning.forEach((EPObj) => {
        //   if (EPObj.controlType === 'input' && EPObj.value !== '') {
        //     switch (EPObj.DisplayName) {
        //       case 'Student/Child Age':
        //         Age = Number(EPObj.value);
        //         break;
        //       case 'Avg. Investment Returns(%)':
        //         AvgInvestmentReturns = Number(EPObj.value);
        //         break;
        //       case 'Estimated Education Cost Required':
        //         try {
        //           EducationCost = Number(EPObj.value.replace(',', ''));
        //         } catch (Ex) {}
        //         break;
        //       case 'Target Education Start Age':
        //         try {
        //           EducationStartAge = Number(EPObj.value.replace(',', ''));
        //         } catch (Ex) {}
        //         break;
        //       case 'Initial Investment':
        //         try {
        //           InitialInvestment = Number(EPObj.value.replace(',', ''));
        //         } catch (Ex) {}
        //         break;
        //       case 'Current Monthly Contributions':
        //         try {
        //           MonthlyContribution = Number(EPObj.value.replace(',', ''));
        //         } catch (Ex) {}
        //         break;
        //     }
        //   }
        // });
        // // Request Formation
        // const parameters = {
        //   FinIQRequestHeader: {
        //     EntityCode: AppConfig.settings.CSP_EntityDetails.Entity_Code,
        //     LoginID: sessionStorage.getItem('Username'),
        //     MachineIP: '',
        //     RequestAt:
        //       this.today.getDate() +
        //       '-' +
        //       this.months[this.today.getMonth() + 1] +
        //       '-' +
        //       this.today.getFullYear() +
        //       ' ' +
        //       this.today.getHours() +
        //       ':' +
        //       this.today.getMinutes() +
        //       ':' +
        //       this.today.getSeconds() +
        //       ' ' +
        //       this.meridian,
        //     RequestID: '',
        //     SourceSystem: 'Stanhope Angular Request',
        //     Token: '',
        //   },
        //   FinancialPlanningReq: {
        //     Age,
        //     AvgInvestmentReturns,
        //     EducationCost,
        //     EducationStartAge,
        //     InitialInvestment,
        //     MonthlyContribution,
        //     PlanningType: 'Education',
        //   },
        // };

        // this.CustApi.GetFinancialPlan(parameters).subscribe((res) => {
        //   if (res.FinIQResponseHeader.Status === 'Succeed') {
        //     this.EducationPlanning.forEach((EPObj) => {
        //       switch (EPObj.DisplayName) {
        //         case 'Networth with Current Contributions (On Target Date)':
        //           EPObj.value = this.commonApi.FormatNumberr(
        //             res.FinancialPlanningResponseBody.FinancialPlanningResponse
        //               .Networth
        //           );
        //           break;
        //         case 'Monthly Contributions Required':
        //           EPObj.value = this.commonApi.FormatNumberr(
        //             res.FinancialPlanningResponseBody.FinancialPlanningResponse
        //               .MonthlyContribution
        //           );
        //           break;
        //         case 'Monthly Withdrawal (Post Retirement)':
        //           EPObj.value = this.commonApi.FormatNumberr(
        //             res.FinancialPlanningResponseBody.FinancialPlanningResponse
        //               .MonthlyWithdrawal
        //           );
        //           break;
        //         // case 'Initial Investment':
        //         // EPObj.value = this.commonApi.FormatNumberWithoutEventForAmount(res.FinancialPlanningResponseBody.FinancialPlanningResponse.InitialInvestment, 2);
        //         // break;
        //       }
        //     });
        //   }
        // });

        break;
      case FinancialModes.HP:
        this.financialPlanningApi
          .GetHousePlan(
            this.investmentMode,
            this.HousePlanning.find(
              (m) => m.keyword.toUpperCase() === 'HOUSEPURCHASEAFTER'
            ).value,
            this.HousePlanning.find(
              (m) => m.keyword.toUpperCase() === 'RETURNS'
            ).value,
            this.HousePlanning.find(
              (m) => m.keyword.toUpperCase() === 'INFLATION'
            ).value,
            this.commonApi.UnformatNumberFromFloat(
              this.HousePlanning.find(
                (m) => m.keyword.toUpperCase() === 'HOUSECOST'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.HousePlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXISTSAVINGS'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.HousePlanning.find(
                (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((mp) => {
            try {
              console.log(mp);
              // this.HousePlanning.find(
              //   (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              // ).value
              this.HousePlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXPHOUSECOST'
              ).value = mp.expectedCostOfHouse;
              this.HousePlanning.find(
                (m) => m.keyword.toUpperCase() === 'GAP'
              ).value = Math.floor(mp.gap);
              this.HousePlanning.find(
                (m) => m.keyword.toUpperCase() === 'INITIALINVESTMENTVALUE'
              ).value = this.decimalPipe.transform(
                mp.initialInvestment,
                '1.0-0'
              );
              this.HousePlanning.find(
                (m) => m.keyword.toUpperCase() === 'REQMIP'
              ).value = mp.investmentRequired;
              this.HousePlanning.find(
                (m) => m.keyword.toUpperCase() === 'NETWORTH'
              ).value = mp.networthOfInvestment;
              // const values: any[] = mp.MarriagePlanningGraphResp;
            } catch (error) {
              console.log(error);
            }
          });
        this.financialPlanningApi
          .GetHousePlanGraph(
            this.investmentMode,
            this.HousePlanning.find(
              (m) => m.keyword.toUpperCase() === 'HOUSEPURCHASEAFTER'
            ).value,
            this.HousePlanning.find(
              (m) => m.keyword.toUpperCase() === 'RETURNS'
            ).value,
            this.HousePlanning.find(
              (m) => m.keyword.toUpperCase() === 'INFLATION'
            ).value,
            this.commonApi.UnformatNumberFromFloat(
              this.HousePlanning.find(
                (m) => m.keyword.toUpperCase() === 'HOUSECOST'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.HousePlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXISTSAVINGS'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.HousePlanning.find(
                (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((mp) => {
            console.log(mp);
            const values: any[] = mp.HousePlanningGraphResp;
            if (values.length > 0) {
              this.linecolumnChartOptions.series[0].data = values.map((m) =>
                parseFloat(m.houseCost.toFixed(2))
              );
              this.linecolumnChartOptions.series[1].data = values.map((m) =>
                parseFloat(m.networth.toFixed(2))
              );
              this.linecolumnChartOptions.labels = values.map((m) => m.year);

              this.pieChartOptions.series = [6800, 60000];
              this.pieChartOptions.labels = ['Interest', 'Principal'];
            }
          });
        break;
      case FinancialModes.CP:
        //Added by Uddesh on 19 Feb, 2022
        console.log(FinancialModes.CP);
        this.financialPlanningApi
          .GetCarPlan(
            this.investmentMode,
            this.CarPlanning.find((m) => m.keyword.toUpperCase() === 'CPDA')
              .value,
            this.CarPlanning.find((m) => m.keyword.toUpperCase() === 'AIRPA')
              .value,
            this.CarPlanning.find(
              (m) => m.keyword.toUpperCase() === 'INFLATION'
            ).value,
            this.commonApi.UnformatNumberFromFloat(
              this.CarPlanning.find(
                (m) => m.keyword.toUpperCase() === 'CARCOST'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.CarPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXISTSAVINGS'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.CarPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((mp) => {
            try {
              console.log(mp);
              // this.CarPlanning.find(
              //   (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              // ).value
              this.CarPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXPCARCOST'
              ).value = mp.expectedCostOfCar;
              this.CarPlanning.find(
                (m) => m.keyword.toUpperCase() === 'GAP'
              ).value = Math.floor(mp.gap);
              this.CarPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INITIALINVESTMENTVALUE'
              ).value = this.decimalPipe.transform(
                mp.initialInvestment,
                '1.0-0'
              );
              this.CarPlanning.find(
                (m) => m.keyword.toUpperCase() === 'REQMIP'
              ).value = mp.investmentRequired;
              this.CarPlanning.find(
                (m) => m.keyword.toUpperCase() === 'NETWORTH'
              ).value = mp.networthOfInvestment;
              // const values: any[] = mp.MarriagePlanningGraphResp;
            } catch (error) {
              console.log(error);
            }
          });
        this.financialPlanningApi
          .GetCarPlanGraph(
            this.investmentMode,
            this.CarPlanning.find((m) => m.keyword.toUpperCase() === 'CPDA')
              .value,
            this.CarPlanning.find((m) => m.keyword.toUpperCase() === 'AIRPA')
              .value,
            this.CarPlanning.find(
              (m) => m.keyword.toUpperCase() === 'INFLATION'
            ).value,
            this.commonApi.UnformatNumberFromFloat(
              this.CarPlanning.find(
                (m) => m.keyword.toUpperCase() === 'CARCOST'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.CarPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXISTSAVINGS'
              ).value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.CarPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((mp) => {
            console.log(mp);
            const values: any[] = mp.CarPlanningGraphResp;
            if (values.length > 0) {
              this.linecolumnChartOptions.series[0].data = values.map((m) =>
                parseFloat(m.carCost.toFixed(2))
              );
              this.linecolumnChartOptions.series[1].data = values.map((m) =>
                parseFloat(m.networth.toFixed(2))
              );
              this.linecolumnChartOptions.labels = values.map((m) => m.year);

              this.pieChartOptions.series = [6800, 60000];
              this.pieChartOptions.labels = ['Interest', 'Principal'];
              this.linecolumnChartOptions.tooltip = {
                enabled: true,
                x: {
                  show: true,
                  format: 'dd MMM',
                  formatter: (val) => {
                    return moment(val).format('YYYY').toString();
                  },
                },
                y: {
                  formatter: (val) => {
                    return this.commonApi.FormatNumberr(val);
                  },
                  title: {
                    formatter: function (_seriesName) {
                      return _seriesName;
                    },
                  },
                },
              };
            }
          });
        break;
      case FinancialModes.TP:
        console.log(FinancialModes.TP);
        this.financialPlanningApi
          .GetVacationPlan(
            this.investmentMode,
            this.TravelPlanning.find((m) => m.keyword.toUpperCase() === 'TDA')
              .value,
            this.TravelPlanning.find((m) => m.keyword.toUpperCase() === 'AIR')
              .value,
            this.TravelPlanning.find((m) => m.keyword.toUpperCase() === 'EI')
              .value,
            this.commonApi.UnformatNumberFromFloat(
              this.TravelPlanning.find((m) => m.keyword.toUpperCase() === 'ECV')
                .value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.TravelPlanning.find((m) => m.keyword.toUpperCase() === 'ES')
                .value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.TravelPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((mp) => {
            try {
              console.log(mp);
              // this.TravelPlanning.find(
              //   (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              // ).value
              this.TravelPlanning.find(
                (m) => m.keyword.toUpperCase() === 'EXPVACATIONCOST'
              ).value = mp.expectedCostOfVacation;
              this.TravelPlanning.find(
                (m) => m.keyword.toUpperCase() === 'GAP'
              ).value = Math.floor(mp.gap);
              this.TravelPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INITIALINVESTMENTVALUE'
              ).value = this.decimalPipe.transform(
                mp.initialInvestment,
                '1.0-0'
              );
              this.TravelPlanning.find(
                (m) => m.keyword.toUpperCase() === 'REQMIP'
              ).value = mp.investmentRequired;
              this.TravelPlanning.find(
                (m) => m.keyword.toUpperCase() === 'NETWORTH'
              ).value = mp.networthOfInvestment;
              // const values: any[] = mp.MarriagePlanningGraphResp;
            } catch (error) {
              console.log(error);
            }
          });
        this.financialPlanningApi
          .GetVacationPlanGraph(
            this.investmentMode,
            this.TravelPlanning.find((m) => m.keyword.toUpperCase() === 'TDA')
              .value,
            this.TravelPlanning.find((m) => m.keyword.toUpperCase() === 'AIR')
              .value,
            this.TravelPlanning.find((m) => m.keyword.toUpperCase() === 'EI')
              .value,
            this.commonApi.UnformatNumberFromFloat(
              this.TravelPlanning.find((m) => m.keyword.toUpperCase() === 'ECV')
                .value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.TravelPlanning.find((m) => m.keyword.toUpperCase() === 'ES')
                .value
            ),
            this.commonApi.UnformatNumberFromFloat(
              this.TravelPlanning.find(
                (m) => m.keyword.toUpperCase() === 'INVESTMENTVALUE'
              ).value
            ),
            this.homeApi.CustomerId,
            this.homeApi.BestPortfolio[0].PortfolioName
          )
          .subscribe((mp) => {
            console.log(mp);
            const values: any[] = mp.VacationPlanningGraphResp;
            if (values.length > 0) {
              this.linecolumnChartOptions.series[0].data = values.map((m) =>
                parseFloat(m.vacationCost.toFixed(2))
              );
              this.linecolumnChartOptions.series[1].data = values.map((m) =>
                parseFloat(m.networth.toFixed(2))
              );
              this.linecolumnChartOptions.labels = values.map((m) => m.year);

              this.pieChartOptions.series = [6800, 60000];
              this.pieChartOptions.labels = ['Interest', 'Principal'];
            }
          });
        break;

      default:
        break;
    }
  }
  ResetAll() {
    this.MarriagePlanning = [
      {
        DisplayName: 'Current Age',
        controlType: 'range',
        IsDisabled: false,
        value: 10, // Assigned Default value
        min: 0,
        max: 30,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25, 30],
        afterInput: 'years',
        id: 'CA',
        keyword: 'CURRAGE',
      },
      {
        DisplayName: 'Target Marriage Age',
        controlType: 'range',
        IsDisabled: false,
        value: 27, // Assigned Default value
        min: 18,
        max: 48,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [18, 23, 28, 33, 38, 43, 48],
        afterInput: 'years',
        id: 'TGA',
        keyword: 'MARRIAGEAGE',
      },
      {
        DisplayName: 'Avg. Investment Returns (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 12, // Assigned Default value
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'AIR',
        keyword: 'RETURNS',
      },
      {
        DisplayName: 'Expected Inflation (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 7,
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'EI',
        keyword: 'INFLATION',
      },
      {
        DisplayName: 'Estimated Cost of Marriage',
        controlType: 'input',
        IsDisabled: false,
        value: '1,500,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'MARRIAGECOST',
      },
      {
        DisplayName: 'Existing Savings for the Goal',
        controlType: 'input',
        IsDisabled: false,
        value: '250,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXISTSAVINGS',
      },
      {
        DisplayName: 'Monthly Investment Planned',
        controlType: 'input',
        IsDisabled: false,
        value: '5,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'INVESTMENTVALUE',
      },
      {
        DisplayName: 'Initial Investment Planned',
        controlType: 'input',
        IsDisabled: true,
        value: '690,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'INITIALINVESTMENTVALUE',
      },

      {
        DisplayName: 'Expected Cost of Marriage<br>(on Target Marriage Age)',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXPMARRIAGECOST',
        fontSize: '24',
      },
      {
        DisplayName: 'Monthly Investment Required',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'REQMIP',
        fontSize: '16',
      },
      {
        DisplayName: 'Networth of Investments<br>(on Target Marriage Age)',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'NETWORTH',
        fontSize: '24',
      },
      {
        DisplayName: 'Gap',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'GAP',
        fontSize: '16',
      },
    ];
    this.InsuranceNeedAnalysisPlanning = [
      {
        DisplayName: 'Current Age',
        controlType: 'range',
        IsDisabled: false,
        value: 25, // Assigned Default value
        min: 0,
        max: 50,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 10, 20, 30, 40, 50],
        afterInput: 'years',
        id: 'CA',
        keyword: 'CURRAGE',
      },
      {
        DisplayName: 'Life Expectancy of the Dependant',
        controlType: 'range',
        IsDisabled: false,
        value: 85, // Assigned Default value
        min: 55,
        max: 105,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [55, 65, 75, 85, 95, 105],
        afterInput: 'years',
        id: 'LEX',
        keyword: 'LIFEEX',
      },
      {
        DisplayName: 'Avg. Investment Returns (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 9, // Assigned Default value
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'AIR',
        keyword: 'RETURNS',
      },
      {
        DisplayName: 'Expected Inflation (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 7,
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'EI',
        keyword: 'INFLATION',
      },
      {
        DisplayName: 'Insurance Cover Guaranteed (Current)',
        controlType: 'input',
        IsDisabled: false,
        value: '10,975,320', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'INSURANCECOVERGUARANTEED',
      },
      {
        DisplayName: 'Monthly Expense of the Family',
        controlType: 'input',
        IsDisabled: false,
        value: '25,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'MONTHLYEXPENSE',
      },
      {
        DisplayName: 'Existing Insurance Cover',
        controlType: 'input',
        IsDisabled: false,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXISTINGINSURANCECOVER',
      },
      {
        DisplayName: 'Outstanding Loan',
        controlType: 'input',
        IsDisabled: false,
        value: '100,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'OUTSTANDINGLOAN',
      },
      {
        DisplayName: 'Expected Insurance Cover',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '10,875,320', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXPECTEDINSURANCECOVER',
        fontSize: '24',
      },
      {
        DisplayName: 'Additional Cover Required',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '10,975,320', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'ADDITIONALCOVERREQ',
        fontSize: '24',
      },
      {
        DisplayName: 'Total Insurance Cover<br>(Current)',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '10,875,320', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'TOTALINSURANCECOVER',
        fontSize: '24',
      },
      {
        DisplayName: 'Gap',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'GAP',
        fontSize: '16',
      },
    ];
    this.TargetCorpusPlanning = [
      {
        DisplayName: 'Target Corpus Required after',
        controlType: 'range',
        IsDisabled: false,
        value: '10', // Assigned Default value
        min: '0',
        max: '30',
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25, 30],
        afterInput: 'years',
        id: 'TCRA',
        keyword: 'TARGETCORPUSAFTER',
      },
      {
        DisplayName: 'Avg. Investment Returns (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: '12', // Assigned Default value
        min: '0',
        max: '25',
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'AIR',
        keyword: 'RETURNS',
      },
      {
        DisplayName: 'Estimated Target Corpus Amount',
        controlType: 'input',
        IsDisabled: false,
        value: '10,000,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        id: 'ETCA',
        keyword: 'ESTIMATEDCORPUS',
      },
      {
        DisplayName: 'Monthly Investment Planned',
        controlType: 'input',
        IsDisabled: false,
        value: '45,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'INVESTMENTVALUE',
      },
      {
        DisplayName: 'Expected Target Corpus Amt<br>(on Target Year)',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '10,000,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXPCORPUS',
        fontSize: '24',
      },
      {
        DisplayName: 'Monthly Investment Required',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '45,059', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'REQMIP',
        fontSize: '16',
      },
      {
        DisplayName: 'Networth of Investments<br>(on Target Year)',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'NETWORTH',
        fontSize: '24',
      },
      {
        DisplayName: 'Gap',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'GAP',
        fontSize: '16',
      },
    ];
    this.RetirementPlanning = [
      {
        DisplayName: 'Current Age',
        controlType: 'range',
        IsDisabled: false,
        value: 25, // Assigned Default value
        min: 20,
        max: 45,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [20, 25, 30, 35, 40, 45],
        afterInput: 'years',
        id: 'CA',
        keyword: 'CURRAGE',
      },
      {
        DisplayName: 'Retirement Age',
        controlType: 'range',
        IsDisabled: false,
        value: 60, // Assigned Default value
        min: 40,
        max: 70,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [40, 45, 50, 55, 60, 65, 70],
        afterInput: 'years',
        id: 'RA',
        keyword: 'RETIAGE',
      },
      {
        DisplayName: 'Life Expectancy',
        controlType: 'range',
        IsDisabled: false,
        value: 85, // Assigned Default value
        min: 65,
        max: 115,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [65, 75, 85, 95, 105, 115],
        afterInput: 'years',
        id: 'LE',
        keyword: 'LIFEEXP',
      },
      {
        DisplayName: 'Avg. Investment Returns Pre Retirement<br>(% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 12, // Assigned Default value
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'AIRPRE',
        keyword: 'RETURNSPRE',
      },
      {
        DisplayName: 'Avg. Investment Returns Post Retirement<br>(% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 9, // Assigned Default value
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'AIRPOST',
        keyword: 'RETURNSPOST',
      },
      {
        DisplayName: 'Expected Inflation (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 7,
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'EI',
        keyword: 'INFLATION',
      },
      {
        DisplayName: 'Monthly Expenses (Current)',
        controlType: 'input',
        IsDisabled: false,
        value: '25,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'MONTHLYEXPENSE',
      },
      {
        DisplayName: 'Expected % of Expenses<br>(Post Retirement)',
        controlType: 'range',
        IsDisabled: false,
        value: 100,
        min: 25,
        max: 150,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 2,
        range: [25, 50, 75, 100, 125, 150],
        afterInput: 'per annum',
        id: 'EXEXPENSE',
        keyword: 'EXEXPENSE',
      },
      {
        DisplayName: 'Existing Savings for the Goal',
        controlType: 'input',
        IsDisabled: false,
        value: '250,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXISSAVING',
      },
      {
        DisplayName: 'Monthly Investment Planned',
        controlType: 'input',
        IsDisabled: false,
        value: '9,332', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'INVESTMENTVALUE',
      },
      {
        DisplayName: 'Initial Investment Planned',
        controlType: 'input',
        IsDisabled: true,
        value: '250,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'INITIALINVESTMENTVALUE',
      },
      {
        DisplayName: 'Monthly Expenses (On Target Retirement Age)',
        controlType: 'input',
        IsDisabled: true,
        value: '266,915', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'MONTHLTARGETYEXPENSE',
      },
      {
        DisplayName: 'Currency',
        controlType: 'select',
        IsDisabled: false,
        value: 'USD', // Assigned Default value
        optionList: ['AUD', 'EUR', 'USD'],
        textAlignment: 'right',
        inputValueType: 'Number',
        ColumnNo: 1,
      },
      {
        DisplayName: 'Expected Expense Required<br>(on Target Retirement Age)',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXPECEXREQ',
        fontSize: '24',
      },
      {
        DisplayName: 'Monthly Investment Required',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'MONTHLYINV',
        fontSize: '24',
      },
      {
        DisplayName: 'Networth<br>(on Target Retirement Age)',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: 0, // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'NETWORTH',
        fontSize: '16',
      },
      {
        DisplayName: 'Gap',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: 0, // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'GAP',
        fontSize: '16',
      },
    ];
    this.EducationPlanning = [
      {
        DisplayName: 'Current Age',
        controlType: 'range',
        IsDisabled: false,
        value: '11', // Assigned Default value
        min: '0',
        max: '30',
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25, 30],
        afterInput: 'years',
        id: 'CA',
        keyword: 'CURRAGE',
      },
      {
        DisplayName: 'Target Higher Education Year at Age',
        controlType: 'range',
        IsDisabled: false,
        value: '21', // Assigned Default value
        min: '0',
        max: '30',
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [15, 20, 25, 30, 35, 40],
        afterInput: 'years',
        id: 'TGA',
        keyword: 'HIGHEREDUCATIONAGE',
      },
      {
        DisplayName: 'Avg. Investment Returns (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: '12', // Assigned Default value
        min: '0',
        max: '25',
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'AIR',
        keyword: 'RETURNS',
      },
      {
        DisplayName: 'Expected Inflation (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: '12', // Assigned Default value
        min: '0',
        max: '25',
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'EI',
        keyword: 'INFLATION',
      },
      {
        DisplayName:
          'Estimated Cost of Education<br>(on Target Higher Education Start Year)',
        controlType: 'input',
        IsDisabled: false,
        value: '1,500,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EDUCATIONCOST',
      },
      {
        DisplayName: 'Existing Savings for the Goal',
        controlType: 'input',
        IsDisabled: false,
        value: '250,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXISTSAVINGS',
      },
      {
        DisplayName: 'Monthly Investment Planned',
        controlType: 'input',
        IsDisabled: false,
        value: '5,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'INVESTMENTVALUE',
      },
      {
        DisplayName: 'Initial Investment Planned',
        controlType: 'input',
        IsDisabled: true,
        value: '690,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'INITIALINVESTMENTVALUE',
      },

      {
        DisplayName:
          'Expected Cost of Education<br>(on Target Higher Education Start Year)',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXPEDUCATIONCOST',
        fontSize: '24',
      },
      {
        DisplayName: 'Monthly Investment Required',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'REQMIP',
        fontSize: '16',
      },
      {
        DisplayName:
          'Networth of Investments<br>(on Target Higher Education Start Year)',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'NETWORTH',
        fontSize: '24',
      },
      {
        DisplayName: 'Gap',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'GAP',
        fontSize: '16',
      },
    ];
    this.TravelPlanning = [
      {
        DisplayName: 'Travel Date after (Years)',
        controlType: 'range',
        IsDisabled: false,
        value: 6, // Assigned Default value
        min: 0,
        max: 30,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25, 30],
        afterInput: 'years',
        id: 'TDA',
        keyword: 'TDA',
      },
      {
        DisplayName: 'Avg. Investment Returns (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 12, // Assigned Default value
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'AIR',
        keyword: 'AIR',
      },
      {
        DisplayName: 'Expected Inflation (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 7, // Assigned Default value
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'EI',
        keyword: 'EI',
      },
      {
        DisplayName: 'Estimated Cost of Vacation<br> (Current)',
        controlType: 'input',
        IsDisabled: false,
        value: '600,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        id: 'ECV',
        keyword: 'ECV',
      },
      {
        DisplayName: 'Existing Savings for the Goal',
        controlType: 'input',
        IsDisabled: false,
        value: '50,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        id: 'ES',
        keyword: 'ES',
      },
      {
        DisplayName: 'Monthly Investment Planned',
        controlType: 'input',
        IsDisabled: false,
        value: '6,800', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        id: 'MIP',
        keyword: 'INVESTMENTVALUE',
      },
      {
        DisplayName: 'Initial Investment',
        controlType: 'input',
        IsDisabled: true,
        value: '50,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        id: 'II',
        keyword: 'INITIALINVESTMENTVALUE',
      },
      {
        DisplayName: 'Expected Cost of Vacation<br>(on Target Year)',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXPVACATIONCOST',
        fontSize: '24',
      },
      {
        DisplayName: 'Monthly Investment Required',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'REQMIP',
        fontSize: '16',
      },
      {
        DisplayName: 'Networth of Investments<br>(on Target Year)',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'NETWORTH',
        fontSize: '24',
      },
      {
        DisplayName: 'Gap',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'GAP',
        fontSize: '16',
      },
    ];
    this.HousePlanning = [
      {
        DisplayName: 'House Purchase Date After',
        controlType: 'range',
        IsDisabled: false,
        value: 10, // Assigned Default value
        min: 0,
        max: 30,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25, 30],
        afterInput: 'years',
        id: 'HPA',
        keyword: 'HOUSEPURCHASEAFTER',
      },
      {
        DisplayName: 'Avg. Investment Returns (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 5, // Assigned Default value
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'years',
        id: 'TMA',
        keyword: 'RETURNS',
      },
      {
        DisplayName: 'Expected Inflation (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 7,
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'EI',
        keyword: 'INFLATION',
      },
      {
        DisplayName: 'Estimated Cost of House<br>(Current)',
        controlType: 'input',
        IsDisabled: false,
        value: '1,500,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'HOUSECOST',
      },
      {
        DisplayName: 'Existing Savings for the Goal',
        controlType: 'input',
        IsDisabled: false,
        value: '250,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXISTSAVINGS',
      },
      {
        DisplayName: 'Monthly Investment Planned',
        controlType: 'input',
        IsDisabled: false,
        value: '5,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'INVESTMENTVALUE',
      },
      {
        DisplayName: 'Initial Investment',
        controlType: 'input',
        IsDisabled: true,
        value: '690,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'INITIALINVESTMENTVALUE',
      },

      {
        DisplayName: 'Expected Cost of House<br>(on Target Year)',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXPHOUSECOST',
        fontSize: '24',
      },
      {
        DisplayName: 'Monthly Investment Required',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'REQMIP',
        fontSize: '16',
      },
      {
        DisplayName: 'Networth of Investments<br>(on Target Year)',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'NETWORTH',
        fontSize: '24',
      },
      {
        DisplayName: 'Gap',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'GAP',
        fontSize: '16',
      },
    ];
    this.CarPlanning = [
      {
        DisplayName: 'Car Purchase Date After',
        controlType: 'range',
        IsDisabled: false,
        value: 10, // Assigned Default value
        min: 0,
        max: 30,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25, 30],
        afterInput: 'years',
        id: 'CA',
        keyword: 'CPDA',
      },
      {
        DisplayName: 'Avg. Investment Returns (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 5, // Assigned Default value
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'years',
        id: 'TMA',
        keyword: 'AIRPA',
      },
      {
        DisplayName: 'Expected Inflation (% p.a.)',
        controlType: 'range',
        IsDisabled: false,
        value: 7,
        min: 0,
        max: 25,
        textAlignment: 'right',
        inputValueType: 'range',
        ColumnNo: 1,
        range: [0, 5, 10, 15, 20, 25],
        afterInput: 'per annum',
        id: 'EI',
        keyword: 'INFLATION',
      },
      {
        DisplayName: 'Estimated Cost of Car<br>(Current)',
        controlType: 'input',
        IsDisabled: false,
        value: '1,500,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'CARCOST',
      },
      {
        DisplayName: 'Existing Savings for the Goal',
        controlType: 'input',
        IsDisabled: false,
        value: '250,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXISTSAVINGS',
      },
      {
        DisplayName: 'Monthly Investment Planned',
        controlType: 'input',
        IsDisabled: false,
        value: '5,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'INVESTMENTVALUE',
      },
      {
        DisplayName: 'Initial Investment',
        controlType: 'input',
        IsDisabled: true,
        value: '690,000', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'INITIALINVESTMENTVALUE',
      },

      {
        DisplayName: 'Expected Cost of Car<br>(on Target Year)',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'EXPCARCOST',
        fontSize: '24',
      },
      {
        DisplayName: 'Monthly Investment Required',
        controlType: 'leftlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'REQMIP',
        fontSize: '16',
      },
      {
        DisplayName: 'Networth of Investments<br>(on Target Year)',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'NETWORTH',
        fontSize: '24',
      },
      {
        DisplayName: 'Gap',
        controlType: 'rightlabel',
        IsDisabled: true,
        value: '0', // Assigned Default value
        textAlignment: 'right',
        inputValueType: 'Amount',
        ColumnNo: 2,
        keyword: 'GAP',
        fontSize: '16',
      },
    ];
    this.fnGetInvestPlanning();
    this.FXApi.GetAllTradablePairs();
  }

  fnApply() {
    let Networth: any = '';
    let Goal: string = '';

    switch (this.selectedPlanning) {
      case 'MP':
        Goal = 'Marraige planning';
        this.MarriagePlanning.forEach((RPObj) => {
          switch (RPObj.DisplayName) {
            case 'Networth of Investments<br>(on Target Marriage Age)':
              Networth = parseFloat(RPObj.value.toString())
                .toFixed(2)
                .toString();
              break;
          }
        });
        break;
      case 'IP':
        Goal = 'Insurance Need Analysis';
        this.InsuranceNeedAnalysisPlanning.forEach((RPObj) => {
          switch (RPObj.DisplayName) {
            case 'Networth of Investments<br>(on Target Marriage Age)':
              Networth = parseFloat(RPObj.value.toString())
                .toFixed(2)
                .toString();
              break;
          }
        });
        break;
      case 'TCP':
        Goal = 'Target Corpus';
        this.EducationPlanning.forEach((RPObj) => {
          switch (RPObj.DisplayName) {
            case 'Networth of Investments<br>(on Target Year)':
              Networth = parseFloat(RPObj.value.toString())
                .toFixed(2)
                .toString();
              break;
          }
        });
        break;
      case 'RP':
        Goal = 'Retirement Planning';
        this.RetirementPlanning.forEach((RPObj) => {
          switch (RPObj.DisplayName) {
            case 'Networth (On Retirement)':
              Networth = parseFloat(RPObj.value.toString())
                .toFixed(2)
                .toString();
              break;
          }
        });
        break;
      case 'EP':
        Goal = 'Education Planning';
        this.EducationPlanning.forEach((RPObj) => {
          switch (RPObj.DisplayName) {
            case 'Networth of Investments<br>(on Target Higher Education Start Year)':
              Networth = parseFloat(RPObj.value.toString())
                .toFixed(2)
                .toString();
              break;
          }
        });
        break;
      case 'HP':
        Goal = 'House Planning';
        this.HousePlanning.forEach((RPObj) => {
          switch (RPObj.DisplayName) {
            case 'Networth of Investments<br>(on Target Year)':
              Networth = parseFloat(RPObj.value.toString())
                .toFixed(2)
                .toString();
              break;
          }
        });
        break;
      case 'CP':
        Goal = 'Car Planning';
        this.CarPlanning.forEach((RPObj) => {
          switch (RPObj.DisplayName) {
            case 'Networth of Investments<br>(on Target Year)':
              Networth = parseFloat(RPObj.value.toString())
                .toFixed(2)
                .toString();
              break;
          }
        });
        break;
      case 'TP':
        Goal = 'Travel Planning';
        this.TravelPlanning.forEach((RPObj) => {
          switch (RPObj.DisplayName) {
            case 'Networth of Investments<br>(on Target Year)':
              Networth = parseFloat(RPObj.value.toString())
                .toFixed(2)
                .toString();
              break;
          }
        });
        break;
    }
    this.GoalData.emit({
      Goal: Goal,
      TargetGoal: Networth,
    });
  }

  fnGetCalculationOutput() {
    this.fnCalculate();
  }

  fnClosePopUp() {
    this.GoalData.emit({ Goal: '', TargetGoal: '' });
  }
  toggleInvestmentMode() {
    this.investmentMode = this.isMIP ? 'MIP' : 'LUMPSUM';
    let investmentModeDisplayName = this.isMIP ? 'Monthly' : 'Lumpsum';
    switch (this.selectedPlanning) {
      case FinancialModes.MP:
        this.MarriagePlanning.find(
          (m) => m.keyword === 'INVESTMENTVALUE'
        ).DisplayName = investmentModeDisplayName + ' Investment Planned';

        this.MarriagePlanning.find((m) => m.keyword === 'REQMIP').DisplayName =
          investmentModeDisplayName + ' Investment Required';
        break;
      case FinancialModes.IP:
        break;
      case FinancialModes.TCP:
        this.TargetCorpusPlanning;
        console.log(FinancialModes.TCP);
        this.TargetCorpusPlanning.find(
          (m) => m.keyword === 'INVESTMENTVALUE'
        ).DisplayName = investmentModeDisplayName + ' Investment Planned';

        this.TargetCorpusPlanning.find(
          (m) => m.keyword === 'REQMIP'
        ).DisplayName = investmentModeDisplayName + ' Investment Required';
        break;
      case FinancialModes.RP:
        investmentModeDisplayName = this.isMIP ? 'Monthly' : 'Lumpsum';
        this.RetirementPlanning.find(
          (r) => r.keyword === 'MONTHLYINV'
        ).DisplayName = investmentModeDisplayName + ' Investment Required';
        this.RetirementPlanning.find(
          (r) => r.keyword === 'INVESTMENTVALUE'
        ).DisplayName = investmentModeDisplayName + ' Investment Planned';
        break;
      case FinancialModes.EP:
        this.EducationPlanning.find(
          (m) => m.keyword === 'INVESTMENTVALUE'
        ).DisplayName = investmentModeDisplayName + ' Investment Planned';

        this.EducationPlanning.find((m) => m.keyword === 'REQMIP').DisplayName =
          investmentModeDisplayName + ' Investment Required';
        break;
      case FinancialModes.HP:
        this.HousePlanning;
        console.log(FinancialModes.TP);
        this.HousePlanning.find(
          (m) => m.keyword === 'INVESTMENTVALUE'
        ).DisplayName = investmentModeDisplayName + ' Investment Planned';

        this.HousePlanning.find((m) => m.keyword === 'REQMIP').DisplayName =
          investmentModeDisplayName + ' Investment Required';
        break;
      case FinancialModes.CP:
        this.CarPlanning;
        console.log(FinancialModes.TP);
        this.CarPlanning.find(
          (m) => m.keyword === 'INVESTMENTVALUE'
        ).DisplayName = investmentModeDisplayName + ' Investment Planned';

        this.CarPlanning.find((m) => m.keyword === 'REQMIP').DisplayName =
          investmentModeDisplayName + ' Investment Required';
        break;
      case FinancialModes.TP:
        this.TravelPlanning.find(
          (m) => m.keyword === 'INVESTMENTVALUE'
        ).DisplayName = investmentModeDisplayName + ' Investment Planned';

        this.TravelPlanning.find((m) => m.keyword === 'REQMIP').DisplayName =
          investmentModeDisplayName + ' Investment Required';
        break;

      default:
        break;
    }
    this.fnCalculate();
    console.log(this.investmentMode);
  }

  changeSliderValue(value) {
    this.error_message = '';
    switch (this.selectedPlanning) {
      case FinancialModes.MP:
        this.MarriagePlanning.find((m) => m.id === value.id).value =
          value.ticks;
        console.log(
          'Target Age',
          this.MarriagePlanning.find((m) => m.id === 'TGA').value
        );
        console.log(
          'Current Age',
          this.MarriagePlanning.find((m) => m.id === 'CA').value
        );
        if (
          Number(this.MarriagePlanning.find((m) => m.id === 'TGA').value) <
          Number(this.MarriagePlanning.find((m) => m.id === 'TGA').min)
        ) {
          this.MarriagePlanning.find((m) => m.id === 'TGA').value =
            this.MarriagePlanning.find((m) => m.id === 'TGA').min;
        } else if (
          Number(this.MarriagePlanning.find((m) => m.id === 'TGA').value) >
          Number(this.MarriagePlanning.find((m) => m.id === 'TGA').max)
        ) {
          // console.log("More than max")
          this.MarriagePlanning.find((m) => m.id === 'TGA').value =
            this.MarriagePlanning.find((m) => m.id === 'TGA').max;
          // console.log(this.MarriagePlanning.find((m) => m.id === 'TGA').value)
        }
        if (
          Number(this.MarriagePlanning.find((m) => m.id === 'TGA').value) <=
          Number(this.MarriagePlanning.find((m) => m.id === 'CA').value)
        ) {
          this.error_message = 'Current Age cannot be more than Target Age.';
          return false;
        } else {
          this.error_message = '';
        }
        break;
      case FinancialModes.IP:
        this.InsuranceNeedAnalysisPlanning.find(
          (m) => m.id === value.id
        ).value = value.ticks;
        //for current Age
        if (
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'CA').value
          ) <
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'CA').min
          )
        ) {
          this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'CA').value =
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'CA').min;
        } else if (
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'CA').value
          ) >
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'CA').max
          )
        ) {
          this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'CA').value =
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'CA').max;
        }
        //for Life Expectancy of the Dependant
        if (
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'LEX').value
          ) <
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'LEX').min
          )
        ) {
          this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'LEX').value =
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'LEX').min;
        } else if (
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'LEX').value
          ) >
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'LEX').max
          )
        ) {
          this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'LEX').value =
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'LEX').max;
        }
        //Avg. Investment Returns (% p.a.)
        if (
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'AIR').value
          ) <
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'AIR').min
          )
        ) {
          this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'AIR').value =
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'AIR').min;
        } else if (
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'AIR').value
          ) >
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'AIR').max
          )
        ) {
          this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'AIR').value =
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'AIR').max;
        }
        //Expected Inflation (% p.a.)
        if (
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'EI').value
          ) <
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'EI').min
          )
        ) {
          this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'EI').value =
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'EI').min;
        } else if (
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'EI').value
          ) >
          Number(
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'EI').max
          )
        ) {
          this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'EI').value =
            this.InsuranceNeedAnalysisPlanning.find((m) => m.id === 'EI').max;
        }
        break;
      case FinancialModes.TCP:
        this.TargetCorpusPlanning.find((m) => m.id === value.id).value =
          value.ticks;
        // if (
        //   this.TargetCorpusPlanning.find((m) => m.id === 'TGA').value <
        //   this.TargetCorpusPlanning.find((m) => m.id === 'CA').value
        // ) {
        //   this.error_message = 'Current Age cannot be more than Target Age.';
        // }
        break;
      case FinancialModes.RP:
        this.RetirementPlanning.find((m) => m.id === value.id).value =
          value.ticks;

        //for current Age
        if (
          Number(this.RetirementPlanning.find((m) => m.id === 'CA').value) <
          Number(this.RetirementPlanning.find((m) => m.id === 'CA').min)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'CA').value =
            this.RetirementPlanning.find((m) => m.id === 'CA').min;
        } else if (
          Number(this.RetirementPlanning.find((m) => m.id === 'CA').value) >
          Number(this.RetirementPlanning.find((m) => m.id === 'CA').max)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'CA').value =
            this.RetirementPlanning.find((m) => m.id === 'CA').max;
        }

        //for Retirement Age
        if (
          Number(this.RetirementPlanning.find((m) => m.id === 'RA').value) <
          Number(this.RetirementPlanning.find((m) => m.id === 'RA').min)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'RA').value =
            this.RetirementPlanning.find((m) => m.id === 'RA').min;
        } else if (
          Number(this.RetirementPlanning.find((m) => m.id === 'RA').value) >
          Number(this.RetirementPlanning.find((m) => m.id === 'RA').max)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'RA').value =
            this.RetirementPlanning.find((m) => m.id === 'RA').max;
        }

        //for Life Expectancy
        if (
          Number(this.RetirementPlanning.find((m) => m.id === 'LE').value) <
          Number(this.RetirementPlanning.find((m) => m.id === 'LE').min)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'LE').value =
            this.RetirementPlanning.find((m) => m.id === 'LE').min;
        } else if (
          Number(this.RetirementPlanning.find((m) => m.id === 'LE').value) >
          Number(this.RetirementPlanning.find((m) => m.id === 'LE').max)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'LE').value =
            this.RetirementPlanning.find((m) => m.id === 'LE').max;
        }

        //for Avg. Investment Returns Pre Retirement<br>(% p.a.)
        if (
          Number(this.RetirementPlanning.find((m) => m.id === 'AIRPRE').value) <
          Number(this.RetirementPlanning.find((m) => m.id === 'AIRPRE').min)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'AIRPRE').value =
            this.RetirementPlanning.find((m) => m.id === 'AIRPRE').min;
        } else if (
          Number(this.RetirementPlanning.find((m) => m.id === 'AIRPRE').value) >
          Number(this.RetirementPlanning.find((m) => m.id === 'AIRPRE').max)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'AIRPRE').value =
            this.RetirementPlanning.find((m) => m.id === 'AIRPRE').max;
        }

        //for Avg. Investment Returns Post Retirement<br>(% p.a.)
        if (
          Number(
            this.RetirementPlanning.find((m) => m.id === 'AIRPOST').value
          ) <
          Number(this.RetirementPlanning.find((m) => m.id === 'AIRPOST').min)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'AIRPOST').value =
            this.RetirementPlanning.find((m) => m.id === 'AIRPOST').min;
        } else if (
          Number(
            this.RetirementPlanning.find((m) => m.id === 'AIRPOST').value
          ) >
          Number(this.RetirementPlanning.find((m) => m.id === 'AIRPOST').max)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'AIRPOST').value =
            this.RetirementPlanning.find((m) => m.id === 'AIRPOST').max;
        }

        //for Expected Inflation (% p.a.)
        if (
          Number(this.RetirementPlanning.find((m) => m.id === 'EI').value) <
          Number(this.RetirementPlanning.find((m) => m.id === 'EI').min)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'EI').value =
            this.RetirementPlanning.find((m) => m.id === 'EI').min;
        } else if (
          Number(this.RetirementPlanning.find((m) => m.id === 'EI').value) >
          Number(this.RetirementPlanning.find((m) => m.id === 'EI').max)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'EI').value =
            this.RetirementPlanning.find((m) => m.id === 'EI').max;
        }

        //for Expected % of Expenses<br>(Post Retirement)
        if (
          Number(this.RetirementPlanning.find((m) => m.id === 'EEPR')?.value) <
          Number(this.RetirementPlanning.find((m) => m.id === 'EEPR')?.min)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'EEPR').value =
            this.RetirementPlanning.find((m) => m.id === 'EEPR').min;
        } else if (
          Number(this.RetirementPlanning.find((m) => m.id === 'EEPR')?.value) >
          Number(this.RetirementPlanning.find((m) => m.id === 'EEPR')?.max)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'EEPR').value =
            this.RetirementPlanning.find((m) => m.id === 'EEPR').max;
        }

        break;
      case FinancialModes.EP:
        this.RetirementPlanning.find((m) => m.id === value.id).value =
          value.ticks;
        if (
          Number(this.RetirementPlanning.find((m) => m.id === 'TGA').value) <
          Number(this.RetirementPlanning.find((m) => m.id === 'TGA').min)
        ) {
          this.RetirementPlanning.find((m) => m.id === 'TGA').value =
            this.RetirementPlanning.find((m) => m.id === 'TGA').min;
        } else if (
          Number(this.RetirementPlanning.find((m) => m.id === 'TGA').value) >
          Number(this.RetirementPlanning.find((m) => m.id === 'TGA').max)
        ) {
          // console.log("More than max")
          this.RetirementPlanning.find((m) => m.id === 'TGA').value =
            this.RetirementPlanning.find((m) => m.id === 'TGA').max;
          // console.log(this.MarriagePlanning.find((m) => m.id === 'TGA').value)
        }
        if (
          this.RetirementPlanning.find((m) => m.id === 'TGA').value <=
          this.RetirementPlanning.find((m) => m.id === 'CA').value
        ) {
          this.error_message = 'Current Age cannot be more than Target Age.';
          return false;
        }
        break;
      case FinancialModes.HP:
        this.HousePlanning.find((m) => m.id === value.id).value = value.ticks;
        // if (
        //   this.HousePlanning.find((m) => m.id === 'TGA').value <
        //   this.HousePlanning.find((m) => m.id === 'CA').value
        // ) {
        //   this.error_message = 'Current Age cannot be more than Target Age.';
        // }
        break;
      case FinancialModes.CP:
        this.CarPlanning.find((m) => m.id === value.id).value = value.ticks;
        // if (
        //   this.CarPlanning.find((m) => m.id === 'TGA').value <
        //   this.CarPlanning.find((m) => m.id === 'CA').value
        // ) {
        //   this.error_message = 'Current Age cannot be more than Target Age.';
        // }
        break;
      case FinancialModes.TP:
        this.TravelPlanning.find((m) => m.id === value.id).value = value.ticks;
        break;

      default:
        break;
    }
    this.fnCalculate();
  }
}
