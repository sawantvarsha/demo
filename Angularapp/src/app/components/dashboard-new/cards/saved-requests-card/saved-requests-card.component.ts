import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApifunctionsService } from 'src/app/components/dashboard-new/services/apifunctions.service';
import { CommonfunctionsService } from 'src/app/components/dashboard-new/services/commonfunctions.service';

@Component({
  selector: 'app-saved-requests-card',
  templateUrl: './saved-requests-card.component.html',
  styleUrls: ['./saved-requests-card.component.scss']
})
export class SavedRequestsCardComponent implements OnInit {

  saveReq: any = [];
  RequestID: any;
  SolveFor: any;
  Format: any;
  Size: any;
  SavedReq: any = [];
  underlyings: any = [];
  indiidualUnderlying: any = [];
  fetchedUnderlyings: any = [];
  Requestid="Request ID"
  format = "Format"
  Solvefor = "Solve for"
  size = "Size"
  CommonDataProducts:any=[]
  constructor(public commonfunctions: CommonfunctionsService,
    public apifunctions: ApifunctionsService,
    private router: Router) { }

  ngOnInit(): void {
    this.fetchSavedRequests();
    this.CommonDataProducts = this.apifunctions.GetCommonDataType('ProductDisplayNames_Dashboard');
    console.log("Comms on init",this.CommonDataProducts)  
  }

  fetchSavedRequests() {
    // console.log('inside saved req');
    try {
      const month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const today = new Date();
      const FromDate = ('0' + today.getDate()).slice(-2) + '-' + month_names[today.getMonth() > 0?today.getMonth() - 1:11] + '-' + (today.getMonth() > 0 ?today.getFullYear() : today.getFullYear() - 1);
      const ToDate = ('0' + today.getDate()).slice(-2) + '-' + month_names[today.getMonth()] + '-' + today.getFullYear();
      const Type: any = '';
      const PageNo: any = '1';
      const RowsPerPage: any = '5';
      const PortfolioType: any = 'OWNER';
      this.saveReq = this.apifunctions.GetPortfolioForAllDeals(FromDate, "Single Pricer", PageNo, PortfolioType, RowsPerPage, ToDate, Type, (this.commonfunctions.getLoggedInUserName()));
      console.log('saved req', this.saveReq);
      this.saveReq.forEach((res: any) => {
        this.underlyings.push(res.Share);
        console.log('underlying for saved', this.underlyings);
        res.Size = this.commonfunctions.formatNotional(res.Size);
      });
    } catch (error) {

    }
  }
  isValid(_saveReq: any = []) {
    return typeof !(_saveReq == 'undefined' || _saveReq.lenght <= 0);
  }

  fetchReqIDDetails(RFQID: any, ViewOnly: boolean) {
    try {
      this.SavedReq = this.apifunctions.getRedirectionData(RFQID);
      console.log('saved req', this.SavedReq);

      if (ViewOnly === true) {

        if (this.SavedReq[0].SubTemplate === 'AutocallablePhoenix') {
          this.router.navigate(['/Autocall', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: true }]);
        }
        if (this.SavedReq[0].SubTemplate === 'DualFIAutocallablePhoenix') {
          this.router.navigate(['/dualautocall', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: true }]);
        }
        // if (preQuoteData1.TemplateCode === 'ReverseConvertible') {
        if (this.SavedReq[0].SubTemplate === 'ReverseConvertible') {
          this.router.navigate(['/ReverseConvertible', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: true }]);
        }
        if (this.SavedReq[0].SubTemplate === 'DualFIReverseConvertible') {
          this.router.navigate(['/dualRC', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: true }]);
        }
        if (this.SavedReq[0].SubTemplate === 'Credit Tranche'
          || this.SavedReq[0].SubTemplate === 'CreditTranche'
          || this.SavedReq[0].SubTemplate === 'Credit Tranche Ind'
          || this.SavedReq[0].SubTemplate === 'CreditTrancheInd') {
          this.router.navigate(['/credittranche', {PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: true }]);
        }
        if (this.SavedReq[0].SubTemplate === 'Participation') {
          this.router.navigate(['/Participation', {PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: true }]);
        }
        if (this.SavedReq[0].SubTemplate === 'DailyRangeAccrual') {
          this.router.navigate(['/DRAAutoCall', {PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: true }]);
        }
        if (this.SavedReq[0].SubTemplate === 'DualFIDailyRangeAccrual') {
          this.router.navigate(['/dualDRAAutoCall', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: true }]);
        }
        // added by Suvarna P || 24Jun2022 || BBVACLI-306 || Go to button not working for CLN and Bonus Product || assigned by Pranav D.
        if (this.SavedReq[0].SubTemplate === 'BonusEnhancedNote') {
          this.router.navigate(['/Bonus', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: true }]);
        }
        if (this.SavedReq[0].SubTemplate === 'CreditLinkedNote') {
          this.router.navigate(['/CreditLinkedNote', {PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: true }]);
        }

        if (this.SavedReq[0].SubTemplate === 'DualCurrencyNote' ) {
          this.router.navigate(['/FX', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: true }]);
        }
      } else {
        if (this.SavedReq[0].SubTemplate === 'AutocallablePhoenix' ) {
          this.router.navigate(['/Autocall', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: false }]);
        }
        if (this.SavedReq[0].SubTemplate === 'DualFIAutocallablePhoenix') {
          this.router.navigate(['/dualautocall', {PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: false }]);
        }
        // if (preQuoteData1.TemplateCode === 'ReverseConvertible') {
        if (this.SavedReq[0].SubTemplate === 'ReverseConvertible') {
          this.router.navigate(['/ReverseConvertible', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: false }]);
        }
        if (this.SavedReq[0].SubTemplate === 'DualFIReverseConvertible') {
          this.router.navigate(['/dualRC', {PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: false }]);
        }
        if (this.SavedReq[0].SubTemplate === 'Credit Tranche'
          || this.SavedReq[0].SubTemplate === 'CreditTranche'
          || this.SavedReq[0].SubTemplate === 'Credit Tranche Ind'
          || this.SavedReq[0].SubTemplate === 'CreditTrancheInd') {
          this.router.navigate(['/credittranche', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: false }]);
        }
        if (this.SavedReq[0].SubTemplate === 'Participation') {
          this.router.navigate(['/Participation', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: false }]);
        }
        if (this.SavedReq[0].SubTemplate === 'DailyRangeAccrual') {
          this.router.navigate(['/DRAAutoCall', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: false }]);
        }
        if (this.SavedReq[0].SubTemplate === 'DualFIDailyRangeAccrual') {
          this.router.navigate(['/dualDRAAutoCall', {PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: false }]);
        }
        // added by Suvarna P || 24Jun2022 || BBVACLI-306 || Go to button not working for CLN and Bonus Product || assigned by Pranav D.
        if (this.SavedReq[0].SubTemplate === 'BonusEnhancedNote') {
          this.router.navigate(['/Bonus', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: false }]);
        }
        if (this.SavedReq[0].SubTemplate === 'CreditLinkedNote') {
          this.router.navigate(['/CreditLinkedNote', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: false }]);
        }

        if (this.SavedReq[0].SubTemplate === 'DualCurrencyNote') {
          this.router.navigate(['/FX', { PORTFOLIO_ID: this.SavedReq[0].PortfolioID, viewOnly: false }]);
        }
      }

    } catch (error) {

    }
  }

}

