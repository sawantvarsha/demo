
import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
//import { ApifunctionsService } from 'src/app/services/apifunctions.service';
import { ApifunctionsService } from 'src/app/components/dashboard-new/services/apifunctions.service';
import { CommonfunctionsService } from 'src/app/components/dashboard-new/services/commonfunctions.service';
import { environment } from 'src/environments/environment';


declare var require: any;
// declare var $: any;
const $: any = require('jquery');

interface AttachmentFilesModel {
  Filename: string;
  Link: string;
}


@Component({
  selector: 'app-rmw',
  templateUrl: './rmw.component.html',
  styleUrls: ['./rmw.component.scss']
})
export class RmwComponent implements OnInit {

  @Input() RMWBondProductDetailsArr: any = [];
  @Input() popupFlag: any;
  @Input() ListName: any;


  productfilter: any;
  sortBy: any;
  sortOrder: any;
  // rowsperpage: any;
  pageIndex: any;
  pageSize: any;

  ddlNoteCcy: any;
  template: any;
  UnderlyingCurrency = 'All';
  CCY = [];
  ReceivedCCY: any;
  folderName: any;
  search: any = '';

  RMWBondProductDetailsArr1: any = [];
  isProd = environment.production;
  showOptionsFlag = false;
  classApplied = false;
  currentItemsToShow: any;
  productInfoFlag = false;
  ProductDetailsArr: any;
  NoteMasterID: any = '';
  ISIN: any = '';

  // attachment variables;
  attachmentCount: number = 0;
  attachmentFiles: AttachmentFilesModel[] = [];
  showAttachmentsPopup = false;
  showFolderPopupFlag = false;
  folderlist: any;
  publicListArr: any;
  successMsg = '';
  errorMsg = '';
  docurl = environment.interfaceURL;
  totalcount: any;
  asseturl = environment.asseturl;
  // filters

  publicList: any;
  privateList: any;
  filterISIN: any;
  bondType: any;
  guarantor: any;
  Issuer: any;
  LTVMin: any;
  LTVMax: any;
  bidYTMMin: any;
  bidYTMMax: any;
  askYTMMin: any;
  askYTMMax: any;
  bidPriceMin: any;
  bidPriceMax: any;
  askPriceMin: any;
  askPriceMax: any;
  couponMin: any;
  couponMax: any;
  PRR: any;
  riskLevel: any;
  exchange: any;
  snpRating: any;
  moodyRating: any;
  fitchRating: any;
  maturityFrom: any;
  maturityTo: any;
  publicFlag = false;
  privateFlag = false;
  filterCriteria: any = '';
  ListType: any = '';


  constructor(public api: ApifunctionsService, public cfs: CommonfunctionsService) { 
    this.ddlNoteCcy = 'All';
    this.UnderlyingCurrency = 'All';
    this.RMWBondProductDetailsArr = [];
    this.RMWBondProductDetailsArr1 = [];
  }

  ngOnChanges() {
    this.sortBy = 'Product_Name';
    this.sortOrder = 'asc';
    // this.rowsperpage = 50;
    this.productfilter = '';
    this.pageIndex = 0;
    this.pageSize = 5;
    this.template = '';
    this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
    this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, this.pageSize);
    this.totalcount = this.RMWBondProductDetailsArr.length;
  }

   async ngOnInit() {

    console.log('ngoninit');
    this.attachmentCount = 0;
    this.sortBy = 'Product_Name';
    this.sortOrder = 'asc';
    this.productfilter = '';
    this.pageIndex = 0;
    this.pageSize = 5;
    this.template = '';
    this.filterCriteria = '';
    this.snpRating = '';

    // this.CCY = this.api.BBVALoadCCY();

    if (this.popupFlag) {
      this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
      this.totalcount = this.RMWBondProductDetailsArr.length;
      this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, 5);
      // this.templateChange();
      this.publicList = this.ListName;
      this.listChange();
    } else {
      $('#loading').show();
      setTimeout(async() => {
        this.folderName = '';
        this.templateChange();
        const str = this.generatefilterstr();
        const res:any = await this.api.GetRMWProductDetails(this.template, this.productfilter, this.ddlNoteCcy, this.sortBy + ' ' + this.sortOrder, '\'EQC_Europe\',\'YieldEnhancement\',\'Participation\',\'ACC\',\'DAC\'', this.pageSize, this.folderName, this.pageIndex + 1, str
          , this.filterCriteria, this.ListType);

        this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
        this.totalcount = res.Count;
        this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
        this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, 5);


      });
    }


  }

  calculateYears(Maturity: any, Issue: any) {
    const diff = Math.abs(new Date(Maturity).getFullYear() - new Date(Issue).getFullYear());
    return diff;
  }
  onClickedOutside(e: Event, i: string) {
    const profileDocument =  document.getElementById('profile' + i) as HTMLInputElement;
    profileDocument.style.visibility = 'hidden';

  }
  showOptionPopup(i: string) {
    const profileVisibility =  document.getElementById('profile' + i) as HTMLInputElement;
    profileVisibility.style.visibility = 'visible';
  }

  txtSearch() {
    $('#loading').show();
    setTimeout(() => {
      let lType = '';
      this.folderName = '';
      console.log(this.ListName);
      if (this.ListName !== undefined && this.ListName !== '') {
        this.folderName = this.ListName;
        lType = 'Public';
        console.log(lType);
      }
      if (this.ListType !== undefined && this.ListType !== '') {
        lType = this.ListType;
      }
      console.log(lType);
      this.pageIndex = 0;
      this.RMWBondProductDetailsArr = [];
      this.totalcount = 0;
      let templateCode = '';
      if (this.template === '') {
        templateCode = '(\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\',\'DailyRangeAccrual\',\'BonusEnhancedNote\')';
      } else {
        templateCode = '(\'' + this.template + '\')';
      }
      const res:any = this.api.GetRMWProductDetailsGenericFilter(this.search, this.pageIndex + 1, this.pageSize, templateCode, this.folderName, lType);
      if (res.items !== null && res.items !== undefined) {
        this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
        this.totalcount = res.Count;
      }
      this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
      this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, this.pageSize);
    });
  }

  showsearchPopup() {
    this.search = '';
    this.classApplied = !this.classApplied;
  }

  hidefilter() {
    this.classApplied = false;
    return false;
  }

  async applyFilter() {
    $('#loading').show();
    setTimeout(async() => {
      const str = this.generatefilterstr();
      let lType = '';
      this.folderName = '';
      // console.log(this.ListName);
      if (this.ListName !== undefined && this.ListName !== '') {
        this.folderName = this.ListName;
        lType = 'Public';
        console.log(lType);
      }
      if (this.ListType !== undefined && this.ListType !== '') {
        lType = this.ListType;
      }

      this.RMWBondProductDetailsArr = [];
      this.totalcount = 0;
      const res:any = await this.api.GetRMWProductDetails('', this.productfilter, this.ddlNoteCcy, this.sortBy + ' ' + this.sortOrder, '\'' + this.template + '\'', this.pageSize, this.folderName, this.pageIndex + 1, str, this.filterCriteria, lType);
      // console.log(res.items);
      if (res.items !== null && res.items !== undefined) {
        this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
        this.totalcount = res.Count;
      }

      this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
      this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, this.pageSize);
      console.log(this.currentItemsToShow);
      this.pageIndex = 0;
      this.classApplied = false;
      $('#loading').hide();
    });
    return false;
  }



  onPageChange($event:any) {
    this.classApplied = false;
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    let lType = '';
    this.folderName = '';
    console.log(this.ListName);
    if (this.ListName !== undefined && this.ListName !== '') {
      this.folderName = this.ListName;
      lType = 'Public';
      console.log(lType);
    }
    if (this.ListType !== undefined && this.ListType !== '') {
      lType = this.ListType;
    }

    $('#loading').show();
    setTimeout(() => {

      if (this.search !== '') {
        this.RMWBondProductDetailsArr = [];
        this.totalcount = 0;
        let templateCode = '';
        if (this.template === '') {
          templateCode = '(\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\',\'DailyRangeAccrual\',\'BonusEnhancedNote\')';
        } else {
          templateCode = '(\'' + this.template + '\')';
        }
        const res:any = this.api.GetRMWProductDetailsGenericFilter(this.search, this.pageIndex + 1, this.pageSize, templateCode, this.folderName, this.ListType);
        if (res.items !== null && res.items !== undefined) {
          this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
          this.totalcount = res.Count;
        }
      } else {
        let str = '';
        if (this.popupFlag) {
          str = this.generatefilterstr();
        }


        this.RMWBondProductDetailsArr = [];
        this.totalcount = 0;
        const res:any = this.api.GetRMWProductDetails('', this.productfilter, this.ddlNoteCcy, this.sortBy + ' ' + this.sortOrder, '\'' + this.template + '\'', this.pageSize, this.folderName, this.pageIndex + 1, str, this.filterCriteria, lType);
        if (res.items !== null && res.items !== undefined) {
          this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
          this.totalcount = res.Count;
        }
      }
      this.RMWBondProductDetailsArr1 = this.RMWBondProductDetailsArr;
      this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(0, this.pageSize);
    });


  }

  showProductInfo(ProductDetailsArr: any) {
    this.classApplied = false;
    this.ProductDetailsArr = ProductDetailsArr;
    this.productInfoFlag = !this.productInfoFlag;
  }


  hideProductInfo() {
    this.productInfoFlag = false;
  }

  getLikeImage(like: string) {
    return like === '0' ?
      this.isProd ? 'assets/like.svg' : './../../assets/like.svg' :
      this.isProd ? 'assets/liked.svg' : './../../assets/liked.svg';
  }

  likeProduct(notemasterID: string, likeCurrentValue: string) {
    const likeValue = likeCurrentValue === '1' ? '0' : '1';
    let response;
    if (likeCurrentValue === '0') {
      response = this.api.likeProduct(notemasterID);
    } else {
      response = this.api.unlikeProduct(notemasterID);
    }
    if (response) {
      this.RMWBondProductDetailsArr.map((r:any) => {
        if (r.Note_Master_ID === notemasterID) {
          r.Number_Of_Likes = likeValue;
        }
      });
      this.RMWBondProductDetailsArr1.map((r:any) => {
        if (r.Note_Master_ID === notemasterID) {
          r.Number_Of_Likes = likeValue;
        }
      });

      this.currentItemsToShow = this.RMWBondProductDetailsArr.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize);

    }
  }

  fillAttachmentPopup(NoteMasterID: string) {
    this.attachmentFiles.length = 0;
    const documents = this.api.ProductAttachmentList(NoteMasterID);
    if (documents) {
      this.attachmentCount = documents.length;
      documents.forEach((d:any) => {
        const attachments: AttachmentFilesModel = {
          Filename: d.Document_Output_Path,
          Link: this.docurl + NoteMasterID + '/' + d.DGT_ID
        };
        this.attachmentFiles.push(attachments);
      });
    } else {
      this.attachmentCount = 0;
    }
    this.showAttachmentsPopup = true;
  }




  clearAttachmentPopup() {
    this.attachmentFiles.length = 0;
    this.attachmentCount = 0;
    this.showAttachmentsPopup = false;
  }

  showFolderPopup(ISIN: any, NoteMasterID: any) {
    this.successMsg = '';
    this.errorMsg = '';
    // this.folderlist = this.api.GetFolders(sessionStorage.getItem('Username'));
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.folderlist.length; i++) {
      this.folderlist[i].isChecked = false;
    }
    this.ISIN = ISIN;
    this.NoteMasterID = NoteMasterID;
    this.showFolderPopupFlag = true;
  }

  folderchkchange(index: any) {
    this.successMsg = '';
    this.errorMsg = '';
    this.folderlist[index].isChecked = !this.folderlist[index].isChecked;
    if (this.folderlist[index].isChecked) {
      const res:any = this.api.SaveProductToFolder(this.folderlist[index].PF_Folder_Name, this.NoteMasterID, '32264', '4', sessionStorage.getItem('Username'), 'Private');
      if (res.Status) {
        this.errorMsg = '';
        this.successMsg = 'Product added successfully to the ' + this.folderlist[index].PF_Folder_Name + ' folder.';
      } else {
        this.successMsg = '';
        this.errorMsg = res.Remark; // this.ISIN + ' already exists under selected folder(s).';
      }
    }

  }

  hideFolderPopup() {
    this.showFolderPopupFlag = false;
  }

  saveproducttofolder() {
    // tslint:disable-next-line: prefer-for-of
    // for (let i = 0; i < this.folderlist.length; i++) {
    //   if (this.folderlist[i].isChecked) {
    //     const res = this.api.SaveProductToFolder(this.folderlist[i].PF_Folder_Name, this.NoteMasterID, '32264', '4', 'Dealer1', 'Private');
    //     if (res.Status) {
    //       this.errorMsg = '';
    //       this.successMsg = this.ISIN + ' added successfully to the folder(s).';
    //     } else {
    //       this.successMsg = '';
    //       this.errorMsg = this.ISIN + ' already exists under selected folder(s).';
    //     }
    //   }

    // }
    this.showFolderPopupFlag = false;
  }

  // showAttachment(ISIN: any) {
  //   if (this.attachmentArr.filter(i => i.ISIN === ISIN).length > 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  generatefilterstr() {
    this.filterCriteria = '';
    let wherestr = ' Where ';


    // console.log(this.ListName, this.publicList, this.privateList);
    if (this.template === '') {
      wherestr = wherestr + ' Template_Code in (\'EQC_Europe\',\'YieldEnhancement\',\'Participation\',\'ACC\',\'DAC\')';
    } else {
      wherestr = wherestr + ' Template_Code in (\'' + this.template + '\')';
    }

    if (this.productfilter !== '') {
      wherestr = wherestr + ' and Product_Name like \'%' + this.productfilter + '%\'';
    }
    if (this.ddlNoteCcy !== 'All') {
      wherestr = wherestr + ' and Currency=\'' + this.ddlNoteCcy + '\'';
    }
    if (!this.popupFlag) {
      this.ListName = '';

      if (this.publicList !== '') {
        // wherestr = wherestr + ' and PF.PF_Folder_Name like \'%' + this.publicList + '%\'';
        this.ListName = this.publicList;
        this.ListType = 'Public';
      }
      if (this.privateList !== '') {
        // wherestr = wherestr + ' and PF.PF_Folder_Name like \'%' + this.privateList + '%\'';
        this.ListName = this.privateList;
        this.ListType = 'Private';
      }

    }
    if (this.filterISIN !== undefined && this.filterISIN !== '') {
      wherestr = wherestr + ' and ISIN = \'' + this.filterISIN + '\'';
    }
    // if (this.bondType !== undefined && this.bondType !== '') {
    //   this.filterCriteria = this.filterCriteria + ' and NM.NM_Bond_Type = \'' + this.bondType + '\'';
    // }
    // if (this.guarantor !== '') {
    //   wherestr = wherestr + ' and Guarantor like \'%' + this.guarantor + '%\'';
    // }
    // if (this.Issuer !== '') {
    //   wherestr = wherestr + ' and Issuer_Name like \'%' + this.Issuer + '%\'';
    // }
    // if (this.LTVMin !== '' && this.LTVMax !== '') {
    //   wherestr = wherestr + ' and NM_Bonds_LTV between ' + this.LTVMin + ' and ' + this.LTVMax;
    // }
    // if (this.bidYTMMin !== '' && this.bidYTMMax !== '') {
    //   wherestr = wherestr + ' and NMP_Bid_Yield between ' + this.bidYTMMin + ' and ' + this.bidYTMMax;
    // }
    // if (this.askYTMMin !== '' && this.askYTMMax !== '') {
    //   wherestr = wherestr + ' and NMP_Ask_Yield between ' + this.askYTMMin + ' and ' + this.askYTMMax;
    // }
    // if (this.bidPriceMin !== '' && this.bidPriceMax !== '') {
    //   wherestr = wherestr + ' and NMP_Bid_Price between ' + this.bidPriceMin + ' and ' + this.bidPriceMax;
    // }
    // if (this.askPriceMin !== '' && this.askPriceMax !== '') {
    //   wherestr = wherestr + ' and NMP_Ask_Price between ' + this.askPriceMin + ' and ' + this.askPriceMax;
    // }
    // // console.log('aa', this.PRR);
    // if (this.PRR !== undefined && this.PRR !== '' && this.PRR.length > 0) {
    //   wherestr = wherestr + ' and Note_Product_Rating  in (' + this.PRR + ')';
    // }

    // if (this.maturityFrom !== '' && this.maturityTo !== '') {
    //   wherestr = wherestr + ' and Maturity_Date between ' + this.maturityFrom + ' and ' + this.maturityTo;
    // }

    // // console.log(wherestr);
    // if (this.snpRating !== '') {

    //   wherestr = wherestr + ' and Misc1 in (\'' + (this.snpRating + '').replace(/,/g, '\',\'') + '\')';
    // }
    // if (this.moodyRating !== '') {
    //   wherestr = wherestr + ' and Curve_Code in (\'' + (this.moodyRating + '').replace(/,/g, '\',\'') + '\')';
    // }

    // if (this.fitchRating !== '') {
    //   wherestr = wherestr + ' and Bond_Fitch_Rating in (\'' + (this.fitchRating + '').replace(/,/g, '\',\'') + '\')';
    // }

    return wherestr;
  }

  templateChange() {
    this.productfilter = '';
    this.ddlNoteCcy = 'All';
    this.publicList = '';
    this.privateList = '';
    this.filterISIN = '';
    this.bondType = '';
    this.guarantor = '';
    this.Issuer = '';
    this.LTVMin = '';
    this.LTVMax = '';
    this.bidYTMMin = '';
    this.bidYTMMax = '';
    this.askYTMMin = '';
    this.askYTMMax = '';
    this.bidPriceMin = '';
    this.bidPriceMax = '';
    this.askPriceMin = '';
    this.askPriceMax = '';
    this.couponMin = '';
    this.couponMax = '';
    this.PRR = '';
    this.riskLevel = '';
    this.exchange = '';
    this.snpRating = '';
    this.moodyRating = '';
    this.fitchRating = '';
    this.maturityFrom = '';
    this.maturityTo = '';
    this.ListType = '';
    // this.folderlist = this.api.GetFolders(sessionStorage.getItem('Username'));
    // this.publicListArr = this.api.GetFolders('');

  }

  listChange() {
    if (this.publicList === '' || this.privateList === '') {
      this.publicFlag = false;
      this.privateFlag = false;
    }
    if (this.publicList !== '') {
      this.privateFlag = true;
    }
    if (this.privateList !== '') {
      this.publicFlag = true;
    }
  }

  Clear() {
    // this.template = '';
    this.templateChange();
    return false;
  }

}
