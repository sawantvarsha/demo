// Changes added by Mayuri D. on 05-July-2022.

import { Component, Input, OnInit, AfterViewInit, AfterViewChecked, ElementRef } from '@angular/core';
import { EcCommonService } from 'src/app/components/euroconnect/services/ec-common.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { NewsServiceService } from 'src/app/components/euroconnect/services/news-service.service';
import { WorkbenchServiceService } from 'src/app/components/euroconnect/services/workbench-service.service';

declare var require: any;
// declare var $: any;
const $: any = require('jquery');

declare global {
  interface Array<T> {
    sortBy(p: any): Array<T>;
  }
}
// tslint:disable-next-line: space-before-function-paren
Array.prototype.sortBy = function (p): Array<any> {
  return this.slice(0).sort((a: any, b: any) => {
    return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
  });
};

interface NewsDetailsModel {
  Headline: string;
  NewsActive: string;
  NewsCode: string;
  NewsID: string;
  NewsLink: string;
  NewsPublishAt: string;
  NewsPublishBy: string;
  NewsSize: string;
  NewsDescription: string;
  NewsDescriptionShort: string;
  ValidFrom: string;
  ValidTo: string;
  ImageLink1: string;
  ImageLink: string;
  RelativeTime: string;
  Time: number;
  List_Name: string;
  Recommend: string;
  Like: string;
  LikesCount: number;
  Documents: string;
  Tags: string;
  productList: any;
  MarketOpportunities: string;
}

interface AttachmentFilesModel {
  Filename: string;
  Link: string;
  Type: string;
}

enum FilterActionEnum {
  'Recent',
  'Liked',
  'Recommended',
  'Popular',
  'MarketOpportunities',
}

@Component({
  selector: 'app-landing-page-news',
  templateUrl: './landing-page-news.component.html',
  styleUrls: ['./landing-page-news.component.scss'],
})
export class LandingPageNewsComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() expandedcontent: boolean;

  constructor(
    public EcNews: NewsServiceService,
    public EcCommon: EcCommonService,
    public EcWorkbench: WorkbenchServiceService
    ,public elementRef: ElementRef
  ) {
    this.RMWBondProductDetailsArr = [];
  }

  successMsg: string;
  ErrorMsg: string;
  previousOptionsID: string = '';
  previoussubOptionsID: string = '';

  pageIndex: any;
  pageSize: any;
  totalcount: any = 0;
  currentItemsToShow: any;
  startIndex: any;
  outerWidth: number;
  zoomPercentage: number;
  pageEnd: number;

  isProd = environment.production;
  news: NewsDetailsModel[];
  relatedNews: NewsDetailsModel[];
  newsFiltered: NewsDetailsModel[];

  attachmentCount: number;
  attachmentFiles: AttachmentFilesModel[] = [];
  showAttachmentsPopup = false;
  showStage2Popup = false;

  RMWBondProductDetailsArr: any = [];
  showOptionsFlag = false;
  popupFlag = true;
  productDetailFlag = false;

  stage2NewsId = '';
  stage2Headline = '';
  stage2Time = '';
  stage2ImageLink = '';
  stage2Description = '';
  stage2ExternalLink = '';
  stage2Like = '';
  stage2Documents = '';
  stage2ProductList = '';

  headline = '';
  ListName = '';
  search = '';

  largeCount = 0;
  mediumCount = 0;
  loopingIndex = 0;

  showStage1Buttons = false;
  showStage2Buttons = true;
  ContentHideConfig = true;
  asseturl = environment.asseturl;

  totalCountFlag: boolean = true;

  hashTagArr: string[] = [];
  hashTags = '';
  get FilterAction() {
    return FilterActionEnum;
  }
  activeFilter: FilterActionEnum = FilterActionEnum.Recent;

  pdfSource = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";


  imgURL: any;
  filePreviewFlag = false;
  isImage = false;
  fileLink = '';
  iframeinterval: any;
  showContactInfoFlag = false;
  contactDetails = '';
  showContactInfoPopupFlag = false;
  validationArr: any;
  EntityCode: any;

  async ngOnInit(): Promise<void> {
    $(document).ready(function () {
      $(".mat-paginator-page-size-label").text("Items Per Page:");
    });
    // const res = this.EcCommon.getEntityCode();
    const res = await this.EcCommon.getEntityCode();

    console.log(res);
    this.EntityCode = res;
    console.log('EntityCode', res, this.EntityCode);

    if (
      this.EcNews.validationArr === undefined ||
      this.EcNews.validationArr.length <= 0
    ) {
      this.validationArr = this.EcNews.BBVAFetchValidation('EQ');
    } else {
      this.validationArr = this.EcNews.validationArr;
    }

    if (this.validationArr) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.validationArr.length; i++) {
        switch (this.validationArr[i].Setting_Name) {
          case 'BBVA_ContactDetails':
            // this.showContactInfoFlag = this.validationArr[i].Default_Value;
            this.contactDetails = this.validationArr[i].Default_Value;
            break;
        }
      }
    }

    $('#filters').hide();
    $('#loading').show();
    setTimeout(() => {
      this.getNewsConfig();
      this.getNews(
        false,
        '',
        '',
        '',
        this.pageIndex + 1,
        '',
        '',
        this.pageSize,
        '',
        ''
      );
      $('#loading').hide();
      // this.totalcount = this.newsFiltered.length;
      //console.log(this.newsFiltered);
      if (this.newsFiltered && this.newsFiltered.length > 0) {
        this.currentItemsToShow = this.newsFiltered.slice(0, this.pageSize);
      }
    });
    //Changed by Amogh K | 9-mar-2022
    this.pageIndex = 0;
    this.pageSize = 3;
    this.onPageChange({
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
      reload: true,
    });
  }

  ngAfterViewInit(): void {
    const images = document.getElementsByClassName('news-image');
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < images.length; i++) {
      const element = images[i] as HTMLImageElement;
      element.onerror = () => {
        //console.log(element, element.parentElement);
        element.parentElement.style.display = 'none';
        element.parentElement.parentElement.style.gridTemplateColumns = '100%';
      };
    }
  }

  ngAfterViewChecked(): void {
    this.hideStage2ImageContainerOnError();
  }

  getNewsConfig() {
    const response = this.EcNews.getNewsConfig();
    if (Object.keys(response).length > 0) {
      this.showStage1Buttons = response.show_news_stage1_buttons;
      this.showStage2Buttons = response.show_news_stage2_buttons;
      this.ContentHideConfig = response.ContentHideConfig;
      //console.log(this.ContentHideConfig);
    }
  }

  getNews(
    popup: boolean = false,
    tags: string = '',
    NoOfRecords,
    LikeValue,
    PageNumber,
    Popular,
    Recommended,
    RowsPerPage,
    newsID,
    MarketOppurturnities
  ) {
    let res: any;
    res = this.EcNews.fetchNewsDetails(
      '',
      NoOfRecords,
      '',
      '',
      tags,
      LikeValue,
      PageNumber,
      Popular,
      Recommended,
      RowsPerPage,
      tags === '' ? this.search : '',
      MarketOppurturnities,
      this.EntityCode
    );
    // const response = res.items;
    //console.log(res);
    //console.log(res.items);
    // changes by Suvarna P || 21Apr2022 || to show only active Images - logic changes|| assigned by Pranav D || start
    // changes by Suvarna P || 20Apr2022 || to show only active Images || assigned by Pranav D
    // const response = res.items;
    // changed by Suvarna P || 27Apr2022 || Null response handling assigned by Pranav D.
    var response = [];
    if (res.items && res.items.length > 0) {
      response = res.items.filter((item1) => item1['News_ActiveYN'] === 'Y');
    }
    // changes by Suvarna P || 21Apr2022 || to show only active Images - logic changes|| assigned by Pranav D || end
    //console.log(response);

    const newsArray: NewsDetailsModel[] = [];
    if (response !== undefined && response.length > 0) {
      if (this.totalCountFlag == true) {
        this.totalcount = response[0].Total_Count;
        //Changed by Amogh K | 8-mar-2022
        this.pageEnd =
          this.pageIndex * this.pageSize + parseInt(this.pageSize) <=
          this.totalcount
            ? this.pageIndex * this.pageSize + parseInt(this.pageSize)
            : this.totalcount;
      }
      response.forEach((item) => {
        // if (newsID === '') {
        const date = moment(item.News_Publish_At, 'MM-DD-YYYY HH:mm:ss');
        let newsInfo: any = [];
        let newslikeres: any = [];
        if (newsID !== '') {
          if (newsID === item.News_ID) {
            //console.log(newsID, item.News_ID, item)
            newsInfo = this.getNewsLikeAPI(item.News_ID, item.List_Name);
            if (
              newsInfo.GetNewsLikeResponseDetails &&
              newsInfo.GetNewsLikeResponseDetails.Like_Value
            ) {
              newslikeres = newsInfo.GetNewsLikeResponseDetails;
            } else {
              newslikeres = { Like_Value: 'N', 'Number Of Likes': '0' };
            }
          }
        } else {
          newsInfo = item.GetNewsLikeResponseDetails; // this.getNewsLikeAPI(item.News_ID, item.List_Name);
          if (newsInfo && newsInfo.Like_Value) {
            newslikeres = newsInfo;
          } else {
            newslikeres = { Like_Value: 'N', 'Number Of Likes': '0' };
          }
        }
        // //console.log(newsInfo);

        // if (newsInfo.GetNewsLikeResponseDetails && newsInfo.GetNewsLikeResponseDetails.Like_Value) {

        const newsItem: NewsDetailsModel = {
          Headline: item.Headline,
          NewsActive: item.News_ActiveYN,
          NewsCode: item.News_Code,
          NewsID: item.News_ID,
          NewsLink: item.News_Link,
          NewsPublishAt: item.News_Publish_At,
          NewsPublishBy: item.News_Publish_By,
          NewsSize: item.News_Size.toLowerCase() || 'small',
          NewsDescription: (item.News_Description || ' ').replace(
            /(?:\r\n|\r|\n|\?)/g,
            '<br>'
          ),
          // NewsDescriptionShort: (item['News_Description'] + '').split('. ').slice(0, 2).join('. '),
          NewsDescriptionShort:
            (item.News_Description + '' || ' ')
              .replace(/(?:\r\n|\r|\n|\?)/g, '<br>')
              .substr(0, 300) + '...',
          ImageLink1: '', //this.getImage(item.News_ID) || '',
          ImageLink: this.getNewsImgResourcePath(item.ImageName),
          ValidFrom: item.ValidFrom,
          ValidTo: item.ValidTill,
          RelativeTime: moment(date).fromNow(),
          Time: moment(date).unix(),
          List_Name: item.List_Name,
          Recommend: item.Recommend ? item.Recommend : 'N',
          Like: newslikeres.Like_Value || 'N',
          LikesCount: newslikeres['Number Of Likes'] || 0,
          Documents: item.Documents || '',
          Tags: item.Tags || '',
          productList:
            newsID !== ''
              ? newsInfo.GetContentProductResponseDetails
              : item.GetContentProductResponseDetails,
          MarketOpportunities: item.MarketOppurtunities
            ? item.MarketOppurtunities
            : 'N',
        };
        newsArray.push(newsItem);

        // //console.log(newsArray);
      });
    }

    if (popup) {
      if (newsArray.length > 0) {
        // //console.log('123456');
        this.RMWBondProductDetailsArr = [];
        this.relatedNews = newsArray.filter(
          (n) => n.NewsID !== this.stage2NewsId
        );
        // //console.log(this.relatedNews, newsArray);
        this.RMWBondProductDetailsArr = newsArray.filter(
          (n) => n.NewsID === this.stage2NewsId
        )[0].productList;
      } else {
        this.relatedNews = [];
        this.news = [];
        this.currentItemsToShow = [];
      }
    } else {
      if (newsArray.length > 0) {
        this.news = newsArray;
        this.newsFiltered = this.news.sortBy('Time').reverse();
        // this.totalcount = this.newsFiltered.length;
        this.currentItemsToShow = this.newsFiltered.slice(0, this.pageSize);
      } else {
        this.relatedNews = [];
        this.news = [];
        this.currentItemsToShow = [];
      }
    }
    // //console.log(this.RMWBondProductDetailsArr);
    // $('#loading').hide();
    this.totalCountFlag = true;
  }

  getNewsSizeClass(size: string, newsIndex: number): string {
    if (this.activeFilter !== FilterActionEnum.Recent) {
      //////// Following code working and acceptable for most of the cases. DO NOT DELETE
      // if (newsIndex === 0 || newsIndex === 1) {
      //   return 'news-large';
      // } else if (newsIndex > 1 && newsIndex < 4) {
      //   return 'news-medium';
      // } else {
      //   return 'news-small';
      // }
      /////// End of Code
      //console.log(newsIndex);
      if (newsIndex === 0) {
        this.loopingIndex = 1;
        this.largeCount = 1;
        this.mediumCount = 0;
        return 'news-large';
      }

      for (this.loopingIndex; this.loopingIndex <= newsIndex; ) {
        if (
          this.getNewsDisplayStyle(
            this.newsFiltered[this.loopingIndex].NewsID
          ) === 'inherit'
        ) {
          if (this.largeCount < 2) {
            this.largeCount += 1;
            this.loopingIndex += 1;
            return 'news-large';
          } else if (this.mediumCount < 2) {
            this.mediumCount += 1;
            this.loopingIndex += 1;
            return 'news-medium';
          } else {
            this.loopingIndex += 1;
            return 'news-small';
          }
        } else {
          this.loopingIndex += 1;
          return 'news-small';
          // if (this.largeCount < 2) {
          //   return 'news-large';
          // } else {
          //   return 'news-medium';
          // }
        }
      }
      return 'news-small';
    } else {
      // //console.log(size);
      if (size) {
        switch (size.toLowerCase()) {
          case 'small':
            return 'news-small';
          case 'medium':
            return 'news-medium';
          case 'large':
            return 'news-large';
          default:
            return 'news-small';
        }
      } else {
        return 'news-small';
      }
    }
  }

  getNewsDisplayStyle(newsId: string) {
    const selectedNews = this.news.filter((n) => n.NewsID === newsId);
    switch (this.activeFilter) {
      case FilterActionEnum.Liked:
        return selectedNews[0].Like === 'Y' ? 'inherit' : 'none';
      case FilterActionEnum.Recommended:
        return selectedNews[0].Recommend === 'Y' ? 'inherit' : 'none';
      default:
        return 'inherit';
    }
  }
  //performanec change by suvarna
  getNewsImgResourcePath(fileName: string) {
    const response = this.EcNews.getNewsImgResourcePath(fileName);
    if (response.length > 0) {
      return response;
    }
  }

  getImage(newsId: string) {
    const response = this.EcNews.getNewsImage(newsId);
    if (response.length > 0) {
      return response;
    }
  }

  getAttachment(filename: string) {
    const response = this.EcNews.getNewsAttachment(filename);
    if (response.length > 0) {
      return response;
    }
  }
  // performance chnage by suvarna
  getPreviewURL() {
    const response = this.EcNews.GetPreviewURL();
    if (response.length > 0) {
      return response;
    }
  }

  getLikeImage(like: string) {
    return like === 'N'
      ? this.asseturl + '/like.svg'
      : this.asseturl + 'liked.svg';
  }

  getNewsLikeAPI(newsId: string, listName: any) {
    const response = this.EcNews.getNewsLikeAPI(
      newsId,
      listName,
      this.EntityCode
    );
    // //console.log(newsId, response);
    return response;
  }

  // getNoOfNewsLikesAPI(newsId: string): number {
  //   const response = this.apiservice.getNoOfNewsLikesAPI(newsId);
  //   // //console.log(newsId, response);
  //   return response;
  // }

  setNewsLikeAPI(likeCurrentValue: string, newsId: string, listName: any) {
    const likeValue = likeCurrentValue === 'Y' ? 'N' : 'Y';
    const response = this.EcNews.setNewsLikeAPI(
      newsId,
      likeValue,
      this.EntityCode
    );
    // //console.log(response);
    if (response.toLowerCase() === 'success') {
      this.news.map((n) => {
        if (n.NewsID === newsId) {
          n.Like = likeValue;
        }
      });
      this.newsFiltered = this.news.sortBy('Time').reverse();
      // this.totalcount = this.newsFiltered.length;
      this.currentItemsToShow = this.newsFiltered.slice(0, this.pageSize);
      this.stage2Like = likeValue;
    }

    const likesCount = this.getNewsLikeAPI(newsId, listName)['Number of Likes'];
    const newsItem = this.news.filter((n) => n.NewsID === newsId)[0];
    newsItem.LikesCount = likesCount;
    return false;
  }

  shouldShowNewsDescription(news: NewsDetailsModel, index: number) {
    if (this.activeFilter !== FilterActionEnum.Recent) {
      if (index < 4) {
        return true;
      } else {
        return false;
      }
    } else {
      if (news.NewsSize === 'small') {
        return false;
      } else {
        return true;
      }
    }
  }

  fillAttachmentPopup(newsId: string, flag: any, newsArr: any) {
    this.attachmentFiles.length = 0;
    const documentsValue = newsArr.filter((n) => n.NewsID === newsId)[0]
      .Documents;
    // //console.log(documentsValue, this.news.filter(n => n.NewsID === newsId)[0]);
    if (documentsValue !== '') {
      const documents = documentsValue.split(',');
      this.attachmentCount = documents.length;
      documents.forEach((d) => {
        const attachments: AttachmentFilesModel = {
          Filename: d,
          Link: this.EcNews.getNewsAttachment(d),
          Type: d.toString().split('.')[1],
        };
        this.attachmentFiles.push(attachments);
      });
      this.showAttachmentsPopup = flag;
    }
    return false;
  }

  clearAttachmentPopup() {
    this.attachmentFiles.length = 0;
    this.attachmentCount = 0;
    this.showAttachmentsPopup = false;
    return false;
  }

  fillStage2Popup(newsId: string) {
    this.totalCountFlag = false;
    if (!this.ContentHideConfig) {
      $('#loading').show();
      setTimeout(() => {
        this.stage2NewsId = newsId;
        this.fillAttachmentPopup(this.stage2NewsId, false, this.news);
        const selectedNews = this.news.filter((n) => n.NewsID === newsId)[0];
        //console.log(selectedNews);
        if (selectedNews !== undefined) {
          this.stage2Headline = selectedNews.Headline;
          this.stage2ImageLink = selectedNews.ImageLink;
          this.stage2Time = selectedNews.RelativeTime;
          this.stage2Description = selectedNews.NewsDescription;
          this.stage2ExternalLink = selectedNews.NewsLink;
          this.stage2Like = selectedNews.Like;
          this.stage2Documents = selectedNews.Documents;
          this.stage2ProductList = selectedNews.List_Name;

          //console.log(this.stage2ExternalLink);
          this.getNews(
            true,
            selectedNews.Tags,
            '',
            '',
            '1',
            '',
            '',
            '99',
            newsId,
            ''
          );
          this.hashTagArr = [];
          this.hashTags = '';
          if (selectedNews.Tags != '') {
            this.hashTagArr = selectedNews.Tags.split(',');
            for (let i = 0; i < this.hashTagArr.length; i++) {
              this.hashTags = this.hashTags + ' #' + this.hashTagArr[i];
            }
          }
          this.showStage2Popup = true;
        } else {
          $('#loading').hide();
        }
      });
    }
    return false;
  }

  fillStage2RelatedPopup(newsId: string, headline: any, list: any) {
    // //console.log(newsId);
    this.filePreviewFlag = false;
    this.totalCountFlag = false;
    if (!this.ContentHideConfig) {
      $('#loading').show();
      setTimeout(() => {
        this.stage2NewsId = newsId;
        this.headline = headline;
        this.ListName = list;
        // this.RMWBondProductDetailsArr = [];
        // if (list !== null && list !== '') {
        //   const res = this.apiservice.GetRMWProductDetails('', '', '', 'Product_Name asc', '\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\'', 50, list, 1, ' Where Template_Code in (\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\')', '', 'Public');
        //   if (res.items !== undefined) {
        //     this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
        //     //console.log(this.RMWBondProductDetailsArr);
        //     // this.totalcount =res.items.length;
        //   }

        // }
        this.fillAttachmentPopup(this.stage2NewsId, false, this.relatedNews);
        const selectedNews = this.relatedNews.filter(
          (n) => n.NewsID === newsId
        )[0];
        //  //console.log(this.news, newsId, this.newsFiltered, this.relatedNews);
        if (selectedNews !== undefined) {
          this.stage2Headline = selectedNews.Headline;
          this.stage2ImageLink = selectedNews.ImageLink;
          this.stage2Time = selectedNews.RelativeTime;
          this.stage2Description = selectedNews.NewsDescription;
          this.stage2ExternalLink = selectedNews.NewsLink;
          this.stage2Like = selectedNews.Like;
          this.stage2Documents = selectedNews.Documents;
          this.stage2ProductList = selectedNews.List_Name;

          this.getNews(
            true,
            selectedNews.Tags,
            '',
            '',
            '1',
            '',
            '',
            '99',
            newsId,
            ''
          );
          this.hashTagArr = [];
          this.hashTags = '';
          if (selectedNews.Tags != '') {
            this.hashTagArr = selectedNews.Tags.split(',');
            for (let i = 0; i < this.hashTagArr.length; i++) {
              this.hashTags = this.hashTags + ' #' + this.hashTagArr[i];
            }
          }
          this.showStage2Popup = true;
        } else {
          $('#loading').hide();
        }
      });
    }
    return false;
  }

  clearStage2Popup() {
    this.stage2Headline = '';
    this.stage2ImageLink = '';
    this.stage2Time = '';
    this.stage2Description = '';
    this.stage2ExternalLink = '';
    this.stage2Like = '';
    this.stage2Documents = '';
    this.stage2ProductList = '';
    this.showStage2Popup = false;
    this.filePreviewFlag = false;
    return false;
  }

  hideStage2ImageContainerOnError() {
    const images = document.getElementsByClassName('stage2-news-image');
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < images.length; i++) {
      const element = images[i] as HTMLImageElement;
      element.onerror = () => {
        //console.log(element, element.parentElement);
        element.style.display = 'none';
        // element.parentElement.style.display = 'none';
        // element.parentElement.parentElement.style.gridTemplateColumns = '100%';
      };
    }
  }

  changeFilter(filter: FilterActionEnum) {
    $('#loading').show();
    this.totalCountFlag = true;
    setTimeout(() => {
      this.activeFilter = filter;
      this.pageIndex = 0;
      switch (filter) {
        case FilterActionEnum.Recent:
          if (this.activeFilter === FilterActionEnum.Recent) {
            this.getNews(
              false,
              '',
              '',
              '',
              this.pageIndex + 1,
              '',
              '',
              this.pageSize,
              '',
              ''
            );
          }
          this.newsFiltered = this.news.sortBy('Time').reverse();
          break;
        case FilterActionEnum.Popular:
          if (this.activeFilter === FilterActionEnum.Popular) {
            this.getNews(
              false,
              '',
              '',
              '',
              this.pageIndex + 1,
              'Y',
              '',
              this.pageSize,
              '',
              ''
            );
          }
          this.newsFiltered = this.news.sortBy('LikesCount').reverse();
          break;
        case FilterActionEnum.Liked:
          //console.log(filter, this.activeFilter);
          if (this.activeFilter === FilterActionEnum.Liked) {
            //console.log(filter, FilterActionEnum.Liked);
            this.getNews(
              false,
              '',
              '',
              'Y',
              this.pageIndex + 1,
              '',
              '',
              this.pageSize,
              '',
              ''
            );
          }
          this.newsFiltered = this.news.sortBy('LikesCount').reverse();
          break;
        case FilterActionEnum.Recommended:
          if (this.activeFilter === FilterActionEnum.Recommended) {
            this.getNews(
              false,
              '',
              '',
              '',
              this.pageIndex + 1,
              '',
              'Y',
              this.pageSize,
              '',
              ''
            );
          }
          this.newsFiltered = this.news.sortBy('Time').reverse();
          break;
        case FilterActionEnum.MarketOpportunities:
          if (this.activeFilter === FilterActionEnum.MarketOpportunities) {
            this.getNews(
              false,
              '',
              '',
              '',
              this.pageIndex + 1,
              '',
              '',
              this.pageSize,
              '',
              'Y'
            );
          }
          this.newsFiltered = this.news.sortBy('Time').reverse();
          break;
        default:
          this.newsFiltered = this.news.sortBy('Time').reverse();
          break;
      }
      // this.totalcount = this.newsFiltered.length;
      this.currentItemsToShow = this.newsFiltered.slice(0, this.pageSize);
      $('#loading').hide();
    });
    return false;
  }

  // showpopup start- 28-July-2020
  showPopup(headline: any, list: any) {
    $('#loading').show();
    setTimeout(() => {
      //console.log(headline, list);
      $('#filters').show();
      this.headline = headline;
      this.ListName = list;
      this.productDetailFlag = true;
      this.RMWBondProductDetailsArr = [];
      if (list !== null && list !== '') {
      //Added by AdilP & RajeshC @10-04-2023
        const res :any = this.EcWorkbench.GetRMWProductDetails(
          '',
          '',
          '',
          'Product_Name asc',
          "'AutocallablePhoenix','ReverseConvertible','Participation','CreditTranche','ACC','DAC','EQC_Europe'",
          50,
          list,
          1,
          " Where Template_Code in ('AutocallablePhoenix','ReverseConvertible','Participation','CreditTranche','ACC','DAC','EQC_Europe')",
          '',
          'Public',
          'Y',
          this.EntityCode,
          ''
        );
        if (res.items !== undefined) {
          this.RMWBondProductDetailsArr = JSON.parse(
            res.items.replace(/\n/g, '')
          );
          //console.log(this.RMWBondProductDetailsArr);
          // this.totalcount =res.items.length;
        }
      }
      $('#loading').hide();
    });
    return false;
  }
  // showpopup end- 28-July-2020
  // added by mahima gaggad on 05 nov 2020 to load products of a news
  loadProducts(headline: any, list: any) {
    if (!this.ContentHideConfig) {
      $('#loading').show();
      setTimeout(() => {
        //console.log(headline, list);
        this.headline = headline;
        this.ListName = list;
        this.RMWBondProductDetailsArr = [];
        if (list !== null && list !== '') {
          const res :any = this.EcWorkbench.GetRMWProductDetails(
            '',
            '',
            '',
            'Product_Name asc',
            "'AutocallablePhoenix','ReverseConvertible','Participation','CreditTranche'",
            50,
            list,
            1,
            " Where Template_Code in ('AutocallablePhoenix','ReverseConvertible','Participation','CreditTranche')",
            '',
            'Public',
            'N',
            this.EntityCode,
            ''
          );
          this.RMWBondProductDetailsArr = JSON.parse(
            res.items.replace(/\n/g, '')
          );
          //console.log(this.RMWBondProductDetailsArr);
        }
        $('#loading').hide();
      });
    }
    return false;
  }
  // end - added by mahima gaggad on 05 nov 2020 to load products of a news
  hidePopup() {
    $('#filters').hide();
    this.productDetailFlag = false;
    return false;
  }

  showProductDetail() {
    this.productDetailFlag = !this.productDetailFlag;
    return false;
  }

  addClassToPage() {
    $('div.cdk-overlay-pane').addClass('home-page-dropwdown');
    this.outerWidth = window.outerWidth;
    //  this.elementRef.nativeElement.style.setProperty('--screenSize', this.outerWidth);
    this.zoomPercentage = this.outerWidth / 1920;
    //console.log(this.zoomPercentage)
    $('div.home-page-dropwdown').css('zoom', this.zoomPercentage);
    //  $(window).bind('resize', () => {
    //   this.outerWidth = window.outerWidth;
    //   this.zoomPercentage = ((this.outerWidth / 1920));
    //   // this.elementRef.nativeElement.style.setProperty('--zoomPercent', this.zoomPercentage);
    //   //console.log(this.zoomPercentage)
    //   $("div.home-page-dropwdown").css("zoom", this.zoomPercentage);
    // });
  }
  onPageChange($event) {
    //Changed by Amogh K | 9-mar-2022
    this.totalCountFlag = true;
    if ($event.reload) {
      this.pageIndex = 0;
    } else {
      this.pageIndex = $event.pageNo;
    }
    this.pageSize = $event.pageSize;
    this.startIndex = this.pageSize * this.pageIndex;
    // this.changeFilter(this.activeFilter);
    $('#loading').show();
    setTimeout(() => {
      switch (this.activeFilter) {
        case FilterActionEnum.Recent:
          if (this.activeFilter === FilterActionEnum.Recent) {
            this.getNews(
              false,
              '',
              '',
              '',
              this.pageIndex + 1,
              '',
              '',
              this.pageSize,
              '',
              ''
            );
          }
          this.newsFiltered = this.news.sortBy('Time').reverse();
          break;
        case FilterActionEnum.Popular:
          if (this.activeFilter === FilterActionEnum.Popular) {
            this.getNews(
              false,
              '',
              '',
              '',
              this.pageIndex + 1,
              'Y',
              '',
              this.pageSize,
              '',
              ''
            );
          }
          this.newsFiltered = this.news.sortBy('LikesCount').reverse();
          break;
        case FilterActionEnum.Liked:
          if (this.activeFilter === FilterActionEnum.Liked) {
            this.getNews(
              false,
              '',
              '',
              'Y',
              this.pageIndex + 1,
              '',
              '',
              this.pageSize,
              '',
              ''
            );
          }
          this.newsFiltered = this.news.sortBy('LikesCount').reverse();
          break;
        case FilterActionEnum.Recommended:
          if (this.activeFilter === FilterActionEnum.Recommended) {
            this.getNews(
              false,
              '',
              '',
              '',
              this.pageIndex + 1,
              '',
              'Y',
              this.pageSize,
              '',
              ''
            );
          }
          this.newsFiltered = this.news.sortBy('Time').reverse();
          break;
        case FilterActionEnum.MarketOpportunities:
          if (this.activeFilter === FilterActionEnum.MarketOpportunities) {
            this.getNews(
              false,
              '',
              '',
              '',
              this.pageIndex + 1,
              '',
              '',
              this.pageSize,
              '',
              'Y'
            );
          }
          this.newsFiltered = this.news.sortBy('Time').reverse();
          break;
        default:
          this.newsFiltered = this.news.sortBy('Time').reverse();
          break;
      }
      $('#loading').hide();
    });
    this.pageEnd =
      this.pageIndex * this.pageSize + parseInt(this.pageSize) <=
      this.totalcount
        ? this.pageIndex * this.pageSize + parseInt(this.pageSize)
        : this.totalcount;
    //console.log(this.newsFiltered);
    if (this.newsFiltered && this.newsFiltered.length > 0) {
      this.currentItemsToShow = this.newsFiltered.slice(
        this.startIndex,
        this.startIndex + this.pageSize
      );
    }
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

  openfilePreviewDiv_old(fURL: any, type: any, filename: any) {
    console.log(' type is ', type);
    this.filePreviewFlag = true;
    this.fileLink = fURL;
    //console.log(type);
    // const mimeType = mime.lookup(type);
    // //console.log(mimeType.match(/image\/*/));

    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    if (!allowedExtensions.exec(filename)) {
      this.isImage = false;
      this.imgURL = "https://docs.google.com/gview?url=" + fURL + "&embedded=true";
      //console.log(this.imgURL);
      this.iframeinterval = setInterval(() => {
        $('#iframeDocViewer').src = this.imgURL;
      }, 2000);
    } else {
      this.isImage = true;
      this.imgURL = fURL;
      //console.log(this.imgURL);
    }
    // if (mimeType.match(/image\/*/) == null) {
    //   this.isImage = false;
    //   this.imgURL = "https://docs.google.com/gview?url=" + fURL + "&embedded=true";
    //   //console.log(this.imgURL);
    //   this.iframeinterval = setInterval(() => {
    //     $('#iframeDocViewer').src = this.imgURL;
    //   }, 2000);

    // } else {
    //   this.isImage = true;
    //   this.imgURL = fURL;
    //   //console.log(this.imgURL);

    // }

    // https://docs.google.com/gview?url=https://bbvaepricer.test-equity-connect.com/FinIQService/FinIQPublishNewsService.svc/File/Suitability rules.xlsx&embedded=true
    //
  }

  openfilePreviewDiv(fURL: any, type: any, filename: any) {
    console.log(type);
    this.filePreviewFlag = true;
    this.fileLink = fURL;
    //console.log(type);
    // const mimeType = mime.lookup(type);
    // //console.log(mimeType.match(/image\/*/));

    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    const officDocsExtensions = /(\.doc|\.docx|\.xls|\.xlsx)$/i;
    // const otherDocsExtensions =/(\.txt|\.html|\.json)$/i;

    if (!allowedExtensions.exec(filename)) {
      this.isImage = false;
      // this.imgURL = "https://docs.google.com/gview?url=" + fURL + "&embedded=true";

      this.imgURL = fURL;

      if (officDocsExtensions.exec(filename)) {
        // var contents = this.fs.readFileSync("configuration.json");
        // var jsonContent = JSON.parse(contents);

        // var previewURL = jsonContent.imgResourcePath;
        var previewURL = this.getPreviewURL();
        // alert(previewURL);
        // this.imgURL = "https://view.officeapps.live.com/op/embed.aspx?src=" + fURL
        if (previewURL.includes('google')) {
          this.imgURL = previewURL + fURL + '&embedded=true';
        } else {
          this.imgURL = previewURL + fURL;
        }
        // this.imgURL = "https://docs.google.com/gview?url=" + fURL + "&embedded=true";
        // this.imgURL = "http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc=" + fURL
      }
      // this.imgURL = "https://docs.google.com/gview?url=" + 'https://bbvaepricer.test-equity-connect.com/FinIQService/FinIQPublishNewsService.svc/File/2021-10 Million Dollar Vagary. Parrying inflation punches with luxury stocks.pdf' + "&embedded=true";
      // this.DemoDoc =fURL;
      // //console.log(this.imgURL, this.DemoDoc);
      // this.iframeinterval = setInterval(() => {
      $('#iframeDocViewer').src = this.imgURL;

      //   // $('#iframeDocViewer').reload();
      //   // document.getElementById("iframeDocViewer").contentDocument.location.reload(true);
      // }, 2000);
    } else {
      this.isImage = true;
      this.imgURL = fURL;
      //console.log(this.imgURL);
    }
    // if (mimeType.match(/image\/*/) == null) {
    //   this.isImage = false;
    //   this.imgURL = "https://docs.google.com/gview?url=" + fURL + "&embedded=true";
    //   //console.log(this.imgURL);
    //   this.iframeinterval = setInterval(() => {
    //     $('#iframeDocViewer').src = this.imgURL;
    //   }, 2000);

    // } else {
    //   this.isImage = true;
    //   this.imgURL = fURL;
    //   //console.log(this.imgURL);

    // }

    // https://docs.google.com/gview?url=https://bbvaepricer.test-equity-connect.com/FinIQService/FinIQPublishNewsService.svc/File/Suitability rules.xlsx&embedded=true
    //
  }

  closefilePreviewDiv() {
    this.filePreviewFlag = false;
    this.imgURL = '';
    this.fileLink = '';
    $('.iframe-loading').css('background-image', 'none');
    clearInterval(this.iframeinterval);
  }

  iframeloadevent_old() {
    // //console.log('1234567');
    $('.iframe-loading').css('background-image', 'none');
    // $('iframe').contents().find('body').css({ 'background-color': 'white !important' });
    // //console.log('12345');
    clearInterval(this.iframeinterval);
  }
  //performance change
  iframeloadevent() {
    // alert(this.imgURL);
    //console.log('1234567');
    if ($('#iframeDocViewer').contents().find('body').length) {
      //console.log('1234');
      // this.iframeinterval = setInterval(() => {
      //   //console.log('11111');
      $('#iframeDocViewer').src = this.imgURL;
      //   window.frames["iframeDocViewer"].location.reload();

      // }, 5000);
    } else {
      $('.iframe-loading').css('background-image', 'none');
      clearInterval(this.iframeinterval);
    }
    const officDocsExtensions = /(\.doc|\.docx|\.xls|\.xlsx|\.txt)$/i;

    if (officDocsExtensions.exec(this.imgURL)) {
      // alert('Closing Doc loader');
      $('.iframe-loading').css('background-image', 'none');
    }
  }

  showContactInfoPopup() {
    this.showContactInfoPopupFlag = true;
  }

  hideContactInfoPopup() {
    this.showContactInfoPopupFlag = false;
  }

  toggleExpand() {
    this.expandedcontent = !this.expandedcontent;
    // if (this.expanded === true) {
    //   this.hideOnExpand = false;
    // } else {
    //   this.hideOnExpand = true;
    // }
    // //console.log(this.expanded);
  }
}
