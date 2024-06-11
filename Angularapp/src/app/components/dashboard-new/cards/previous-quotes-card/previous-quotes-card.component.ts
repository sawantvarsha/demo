import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';
import { ApifunctionsService } from 'src/app/components/dashboard-new/services/apifunctions.service';
import { CommonfunctionsService } from 'src/app/components/dashboard-new/services/commonfunctions.service';
import { EcHomeService } from 'src/app/components/euroconnect/services/ec-home.service';

declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-previous-quotes-card',
  templateUrl: './previous-quotes-card.component.html',
  styleUrls: ['./previous-quotes-card.component.scss']
})
export class PreviousQuotesCardComponent implements OnInit {

  prevQuoteArr: any = [];
  selectedRFQIDDetails: any = [];
  CommonDataProducts:any=[];


  constructor(public commonfunctions: CommonfunctionsService,
    public apifunctions: ApifunctionsService,
    private router: Router,
    public echome: EcHomeService) { }

  ngOnInit(): void {
    this.fetchPrevQuotes();
  }

  async fetchPrevQuotes() {
    try {
      const month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const today = new Date();
      let FromDate = ('0' + today.getDate()).slice(-2) + '-' + month_names[today.getMonth() > 0?today.getMonth() - 1 : 11] + '-' + (today.getMonth() > 0 ?today.getFullYear() : today.getFullYear() - 1);
      let leapYearCheck = today.getFullYear() % 4;
      if(leapYearCheck != 0 && ( FromDate == '29-Feb-'+today.getFullYear() || FromDate == '30-Feb-'+today.getFullYear() ||FromDate == '31-Feb-'+today.getFullYear() ))
      {
        FromDate = '28-Feb-'+today.getFullYear();
      } 
      const ToDate = ('0' + today.getDate()).slice(-2) + '-' + month_names[today.getMonth()] + '-' + today.getFullYear();
      const workflowId = '1';
      const queueid = '0';
      //const queryToSearch = '';
      const queryToSearch = 'EQC_Europe';
      const Flag = 'P';
      let that = this;
      // value changed in API call by Pranav D 6-Mar-2023 needed only 5 records BBVACLI-934
    //  this.apifunctions.BBVWorkflowBlotterPrevQuotes(queryToSearch, workflowId, queueid, FromDate, ToDate, Flag, this.rowsperpage,1)!.subscribe((res: any) => {
    //     const parseString = require('xml2js').parseString;
         
    //     parseString(res.getTokensResult, function (err: any, result: any) {
           
    //       // Changes done by Pranav D 6-Mar-2023 BBVACLI-934 as only 5 records are required.
    //       that.prevQuoteArr = result.NewDataSet.DUMMY.splice(0, 5);
    //     });
    //     if (res.getTokensResult.length>=0){
    //       this.loadFlag = false;
    //     }
         
    //   });

    let res = await this.apifunctions.BBVWorkflowBlotterPrevQuotes(queryToSearch, FromDate, ToDate, "");
      const parseString = require('xml2js').parseString;
      parseString(res, function (err: any, result: any) {
         
        // Changes done by Pranav D 6-Mar-2023 BBVACLI-934 as only 5 records are required.
        that.prevQuoteArr = result.NewDataSet.DUMMY.splice(0, 5);
        console.log(that.prevQuoteArr,"that.prevQuoteArr")
    
      //Commented by Apurva K as loadFlag is missing from HTML code
      // if (res.getTokensResult.length>=0){
      //   this.loadFlag = false;
      // }
      console.log(that.prevQuoteArr,"that.prevQuoteArr1")
    });
    
    } catch (error) {

    }
  }

  fetchRFQIDDetails(RFQID: any, ViewOnly: boolean) {
    try {
      this.selectedRFQIDDetails = this.apifunctions.getPreviousQuoteCloneData(RFQID, 'RFQID');
      console.log('received rfq data', RFQID, this.selectedRFQIDDetails);

      if (ViewOnly === true) {

        if (this.selectedRFQIDDetails.SubTemplateCode === 'Autocallable Phoenix' || this.selectedRFQIDDetails.SubTemplateCode === 'AutocallablePhoenix') {
          this.router.navigate(['/Autocall', { RFQ_ID: RFQID, viewOnly: true }]);
        }
        if (this.selectedRFQIDDetails.SubTemplateCode === 'DualFIAutocallablePhoenix') {
          this.router.navigate(['/dualautocall', { RFQ_ID: RFQID, viewOnly: true }]);
        }
        // if (preQuoteData1.TemplateCode === 'ReverseConvertible') {
        if (this.selectedRFQIDDetails.SubTemplateCode === 'ReverseConvertible') {
          this.router.navigate(['/ReverseConvertible', { RFQ_ID: RFQID, viewOnly: true }]);
        }
        if (this.selectedRFQIDDetails.SubTemplateCode === 'DualFIReverseConvertible') {
          this.router.navigate(['/dualRC', { RFQ_ID: RFQID, viewOnly: true }]);
        }
        if (this.selectedRFQIDDetails.TemplateCode === 'Credit Tranche'
          || this.selectedRFQIDDetails.TemplateCode === 'CreditTranche'
          || this.selectedRFQIDDetails.TemplateCode === 'Credit Tranche Ind'
          || this.selectedRFQIDDetails.TemplateCode === 'CreditTrancheInd') {
          this.router.navigate(['/credittranche', { RFQ_ID: RFQID, viewOnly: true }]);
        }
        if (this.selectedRFQIDDetails.TemplateCode === 'Participation') {
          this.router.navigate(['/Participation', { RFQ_ID: RFQID, viewOnly: true }]);
        }
        if (this.selectedRFQIDDetails.SubTemplateCode === 'DailyRangeAccrual') {
          this.router.navigate(['/DRAAutoCall', { RFQ_ID: RFQID, viewOnly: true }]);
        }
        if (this.selectedRFQIDDetails.SubTemplateCode === 'DualFIDailyRangeAccrual') {
          this.router.navigate(['/dualDRAAutoCall', { RFQ_ID: RFQID, viewOnly: true }]);
        }
        // added by Suvarna P || 24Jun2022 || BBVACLI-306 || Go to button not working for CLN and Bonus Product || assigned by Pranav D.
        if (this.selectedRFQIDDetails.SubTemplateCode === 'BonusEnhancedNote') {
          this.router.navigate(['/Bonus', { RFQ_ID: RFQID, viewOnly: true }]);
        }
        if (this.selectedRFQIDDetails.SubTemplateCode === 'CreditLinkedNote') {
          this.router.navigate(['/CreditLinkedNote', { RFQ_ID: RFQID, viewOnly: true }]);
        }

        if (this.selectedRFQIDDetails.SubTemplateCode === 'DualCurrencyNote' || this.selectedRFQIDDetails.TemplateCode === '"DualCurrencyNote') {
          this.router.navigate(['/FX', { RFQ_ID: RFQID, viewOnly: true }]);
        }
      } else {
        if (this.selectedRFQIDDetails.SubTemplateCode === 'Autocallable Phoenix' || this.selectedRFQIDDetails.SubTemplateCode === 'AutocallablePhoenix') {
          this.router.navigate(['/Autocall', { RFQ_ID: RFQID, viewOnly: false }]);
        }
        if (this.selectedRFQIDDetails.SubTemplateCode === 'DualFIAutocallablePhoenix') {
          this.router.navigate(['/dualautocall', { RFQ_ID: RFQID, viewOnly: false }]);
        }
        // if (preQuoteData1.TemplateCode === 'ReverseConvertible') {
        if (this.selectedRFQIDDetails.SubTemplateCode === 'ReverseConvertible') {
          this.router.navigate(['/ReverseConvertible', { RFQ_ID: RFQID, viewOnly: false }]);
        }
        if (this.selectedRFQIDDetails.SubTemplateCode === 'DualFIReverseConvertible') {
          this.router.navigate(['/dualRC', { RFQ_ID: RFQID, viewOnly: false }]);
        }
        if (this.selectedRFQIDDetails.TemplateCode === 'Credit Tranche'
          || this.selectedRFQIDDetails.TemplateCode === 'CreditTranche'
          || this.selectedRFQIDDetails.TemplateCode === 'Credit Tranche Ind'
          || this.selectedRFQIDDetails.TemplateCode === 'CreditTrancheInd') {
          this.router.navigate(['/credittranche', { RFQ_ID: RFQID, viewOnly: false }]);
        }
        if (this.selectedRFQIDDetails.TemplateCode === 'Participation') {
          this.router.navigate(['/Participation', { RFQ_ID: RFQID, viewOnly: false }]);
        }
        if (this.selectedRFQIDDetails.SubTemplateCode === 'DailyRangeAccrual') {
          this.router.navigate(['/DRAAutoCall', { RFQ_ID: RFQID, viewOnly: false }]);
        }
        if (this.selectedRFQIDDetails.SubTemplateCode === 'DualFIDailyRangeAccrual') {
          this.router.navigate(['/dualDRAAutoCall', { RFQ_ID: RFQID, viewOnly: false }]);
        }
        // added by Suvarna P || 24Jun2022 || BBVACLI-306 || Go to button not working for CLN and Bonus Product || assigned by Pranav D.
        if (this.selectedRFQIDDetails.SubTemplateCode === 'BonusEnhancedNote') {
          this.router.navigate(['/Bonus', { RFQ_ID: RFQID, viewOnly: false }]);
        }
        if (this.selectedRFQIDDetails.SubTemplateCode === 'CreditLinkedNote') {
          this.router.navigate(['/CreditLinkedNote', { RFQ_ID: RFQID, viewOnly: false }]);
        }

        if (this.selectedRFQIDDetails.SubTemplateCode === 'DualCurrencyNote' || this.selectedRFQIDDetails.TemplateCode === '"DualCurrencyNote') {
          this.router.navigate(['/FX', { RFQ_ID: RFQID, viewOnly: false }]);
        }
      }
    } catch (error) {

    }
  }

}
