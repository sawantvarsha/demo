import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { ApifunctionsService } from 'src/app/components/dashboard-new/services/apifunctions.service';
import { CommonfunctionsService } from 'src/app/components/dashboard-new/services/commonfunctions.service';


declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-scheduled-requests',
  templateUrl: './scheduled-requests.component.html',
  styleUrls: ['./scheduled-requests.component.scss']
})
export class ScheduledRequestsComponent implements OnInit {
  data: any[] = [];
  FromDate: any;
  ToDate: any;
  UserID: any;
  api: any;
  productList:any=[];
  UserData: any
  scheduledreq: any;
  CommonDataProducts:any=[];
  scheduledreqAll: any = [];
  Requestid="Request ID"
  format = "Format"
  Solvefor = "Solve for"
  size = "Size"
  scheduleNames:any=[]
  constructor(public apiservice: ApifunctionsService, public commonfunctions: CommonfunctionsService,
    private router: Router) { }
  // private getportfolioforalldealsSubscription: Subscription | undefined;
  ngOnInit(): void {
    this.CommonDataProducts = this.apiservice.GetCommonDataType('ProductDisplayNames_Dashboard');
    console.log("Comms on init",this.CommonDataProducts)  
    this.getPortfolio();
  }
  async getPortfolio() {

    const month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const FromDate = '';
    const ToDate = '';
    const workflowId = 1;
    const queueid = 0;
    const queryToSearch = '';
    const Flag = 'S';
    let that = this;
    await this.apiservice.BBVWorkflowBlotterPrevQuotes(queryToSearch, FromDate, ToDate, "").then((res: any) => {
      console.log("schedule res ",res);
      
      const parseString = require('xml2js').parseString;
      console.log(parseString)
      parseString(res.getTokensResult, function (_err: any, result: any) {
        // console.log('scheduled req', result.NewDataSet.DUMMY);
        that.scheduledreqAll = result.NewDataSet.DUMMY.slice(0, 5);
      });
    });
    console.log('scheduled request', this.scheduledreqAll);

  }

  fetchScheduledReqDetails(ReqID: any, ViewOnly: boolean, _productName:string) {
    try {
      this.scheduledreq = this.apiservice.getPreviousQuoteCloneData(ReqID, 'PS_ID');
      console.log('scheduled req', this.scheduledreq);

      if (ViewOnly) {
        if (this.scheduledreq.SubTemplateCode === 'AutocallablePhoenix' || this.scheduledreq.SubTemplateCode === 'AutocallablePhoenix') {
          this.router.navigate(['/Autocall', { PS_ID: ReqID, viewOnly: true }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'ReverseConvertible') {
          this.router.navigate(['/ReverseConvertible', { PS_ID: ReqID, viewOnly: true }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'Credit Tranche'
          || this.scheduledreq.SubTemplateCode === 'CreditTranche'
          || this.scheduledreq.SubTemplateCode === 'Credit Tranche Ind'
          || this.scheduledreq.SubTemplateCode === 'CreditTrancheInd') {
          this.router.navigate(['/credittranche', { PS_ID: ReqID, viewOnly: true }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'Participation') {
          this.router.navigate(['/Participation', { PS_ID: ReqID, viewOnly: true }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'DailyRangeAccrual') {
          this.router.navigate(['/DRAAutoCall', { PS_ID: ReqID, viewOnly: true }]);
        }
        // added by Suvarna P || 24Jun2022 || BBVACLI-306 || Go to button not working for CLN and Bonus Product || assigned by Pranav D.
        if (this.scheduledreq.SubTemplateCode === 'BonusEnhancedNote') {
          this.router.navigate(['/Bonus', { PS_ID: ReqID, viewOnly: true }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'CreditLinkedNote') {
          this.router.navigate(['/CreditLinkedNote', { PS_ID: ReqID, viewOnly: true }]);
        }
        // BBVACLI-523 Pranav D 13-Oct-2022
        if (this.scheduledreq.SubTemplateCode === 'DualCurrencyNote') {
          this.router.navigate(['/FX', { PS_ID: ReqID, viewOnly: true }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'CreditLinear') {
          this.router.navigate(['/LinearTranche', { PS_ID: ReqID, viewOnly: true }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'DualFIReverseConvertible') {
          this.router.navigate(['/dualRC', { PS_ID: ReqID, viewOnly: true }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'DualFIAutocallablePhoenix') {
          this.router.navigate(['/dualautocall', { PS_ID: ReqID, viewOnly: true }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'DualFIDailyRangeAccrual') {
          this.router.navigate(['/dualDRAAutoCall', { PS_ID: ReqID, viewOnly: true }]);
        }
  
      } else {
        if (this.scheduledreq.SubTemplateCode === 'AutocallablePhoenix' || this.scheduledreq.SubTemplateCode === 'AutocallablePhoenix') {
          this.router.navigate(['/Autocall', { PS_ID: ReqID, viewOnly: false }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'ReverseConvertible') {
          this.router.navigate(['/ReverseConvertible', { PS_ID: ReqID, viewOnly: false }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'Credit Tranche'
          || this.scheduledreq.SubTemplateCode === 'CreditTranche'
          || this.scheduledreq.SubTemplateCode === 'Credit Tranche Ind'
          || this.scheduledreq.SubTemplateCode === 'CreditTrancheInd') {
          this.router.navigate(['/credittranche', { PS_ID: ReqID, viewOnly: false }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'Participation') {
          this.router.navigate(['/Participation', { PS_ID: ReqID, viewOnly: false }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'DailyRangeAccrual') {
          this.router.navigate(['/DRAAutoCall', { PS_ID: ReqID, viewOnly: false }]);
        }
        // added by Suvarna P || 24Jun2022 || BBVACLI-306 || Go to button not working for CLN and Bonus Product || assigned by Pranav D.
        if (this.scheduledreq.SubTemplateCode === 'BonusEnhancedNote') {
          this.router.navigate(['/Bonus', { PS_ID: ReqID, viewOnly: false }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'CreditLinkedNote') {
          this.router.navigate(['/CreditLinkedNote', { PS_ID: ReqID, viewOnly: false }]);
        }
        // BBVACLI-523 Pranav D 13-Oct-2022
        if (this.scheduledreq.SubTemplateCode === 'DualCurrencyNote') {
          this.router.navigate(['/FX', { PS_ID: ReqID, viewOnly: false }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'CreditLinear') {
          this.router.navigate(['/LinearTranche', { PS_ID: ReqID, viewOnly: false }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'DualFIReverseConvertible') {
          this.router.navigate(['/dualRC', { PS_ID: ReqID, viewOnly: false }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'DualFIAutocallablePhoenix') {
          this.router.navigate(['/dualautocall', { PS_ID: ReqID, viewOnly: false }]);
        }
        if (this.scheduledreq.SubTemplateCode === 'DualFIDailyRangeAccrual') {
          this.router.navigate(['/dualDRAAutoCall', { PS_ID: ReqID, viewOnly: false }]);
        }
      }
      
    } catch (error) {

    }
  }

  // START : BBVAEPCLI-48 Pranav D 17-Jan-2023 Cancel req functionality done
  CancelScheduleReq(ReqID: any) {
    try {
      let res = this.apiservice.updateScheduleFlagAndRFQ("", ReqID, "CANCEL");
      console.log('cancel schedule', res);
      if (res) {
        this.getPortfolio();
      }
    } catch (error) {

    }
  }
  // END : BBVAEPCLI-48 Pranav D 17-Jan-2023 Cancel req functionality done
  ProductNameTransform(ProductCode:any){
    // console.log("this.CommonDataProducts" ,this.CommonDataProducts);
    this.CommonDataProducts.forEach((Element:any)=>{
      console.log("Element.misc1",Element.misc1,ProductCode[0]);
      if(ProductCode[0]==Element.Data_Value){
        return Element.misc1
        // ProductCode=Element
      }
    });
  }
}
