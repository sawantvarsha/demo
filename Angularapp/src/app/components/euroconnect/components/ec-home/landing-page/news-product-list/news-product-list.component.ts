// Changes added by Mayuri D. on 06-July-2022.

import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsServiceService } from 'src/app/components/euroconnect/services/news-service.service';


declare var require: any;
const $: any = require('jquery');
@Component({
  selector: 'app-news-product-list',
  templateUrl: './news-product-list.component.html',
  styleUrls: ['./news-product-list.component.scss']
})
export class NewsProductListComponent implements OnInit, AfterViewInit {
  @Input() list: any;
  @Input() RMWBondProductDetailsArr: any;
  redirectOptionFlag = false;
  constructor(public EcNews : NewsServiceService, private router: Router) { 
    this.RMWBondProductDetailsArr = []
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // if (this.list !== null && this.list !== '') {
    //   const res = this.apiservice.GetRMWProductDetails('', '', 'All', 'Product_Name asc', '\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\'', 50, this.list, 1, ' Where Template_Code in (\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\')', '', 'Public');
    //   if (res.items !== undefined) {
    // this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
    if (this.RMWBondProductDetailsArr &&  this.RMWBondProductDetailsArr.length > 0) {
      for (let i = 0; i < this.RMWBondProductDetailsArr.length; i++) {
        this.RMWBondProductDetailsArr[i]['showOptionsFlag'] = false;
      }
    }
    //   }
    //    //console.log(this.RMWBondProductDetailsArr);
    // }
  }

  redirectOptions(index: any) {
    try {
      //console.log('Index', index, this.RMWBondProductDetailsArr[index]);
      this.RMWBondProductDetailsArr[index]['showOptionsFlag'] = true;



    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }

  hideOptions(index: any) {
    try {
      this.RMWBondProductDetailsArr[index]['showOptionsFlag'] = false;
    } catch (error) {
      //console.log('Error:', error);
    }
    return false;
  }



  redirecttopricer(component, RFQID) {
    $('#loading').show();
    setTimeout(() => {
      this.defaultApiCall();
      this.router.navigate([component, { RFQ_ID: RFQID }]);
    });

  }

  defaultApiCall() {

    // Removed onbehalf dependency || PriyaL || 25Apr2022 || Assigned by Pranav D
    // if (this.apiservice.allBooksData === undefined || this.apiservice.allBooksData.length <= 0) {
    //   const allBooksData = this.apiservice.getAllBooksMappedToLogin();
    // }
    if (this.EcNews.shares === undefined || this.EcNews.shares.length <= 0) {
      const shares = this.EcNews.BBVALoadShares('EQ',"","EQC_Europe");
    }
    if (this.EcNews.CCY === undefined || this.EcNews.CCY.length <= 0) {
      const ReceivedCCY = this.EcNews.BBVALoadCCY();
    }
    if (this.EcNews.validationArr === undefined || this.EcNews.validationArr.length <= 0) {
      const validationArr = this.EcNews.BBVAFetchValidation('EQ');
    }
    if (this.EcNews.indexTrancheArr === undefined || this.EcNews.indexTrancheArr.length <= 0) {
      const indexTrancheArr = this.EcNews.BBVALoadSharesCR('CR',"","CreditTranche");
    }
    if (this.EcNews.floatingRefArr === undefined || this.EcNews.floatingRefArr.length <= 0) {
      const floatingRefArr = this.EcNews.BBVALoadSharesIR('IR',"","CreditTranche");
    }

  }


}
