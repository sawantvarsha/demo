import { Component, OnInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

import { environment } from 'src/environments/environment';

import * as moment from 'moment';
import { ApifunctionsService } from 'src/app/components/dashboard-new/services/apifunctions.service';

import { PageEvent } from '@angular/material/paginator';
declare var require: any;
const $: any = require('jquery');

interface NewsDetailsModel {
  Headline: any;
  NewsActive: any;
  NewsCode: any;
  NewsID: any;
  NewsLink: any;
  NewsPublishAt: any;
  NewsPublishBy: any;
  NewsSize: any;
  NewsDescription: any;
  NewsDescriptionShort: any;
  ValidFrom: any;
  ValidTo: any;
  ImageLink: any;
  ImageLink1: any;
  RelativeTime: any;
  Time: number;
  List_Name: any;
  Recommend: any;
  Like: any;
  LikesCount: number;
  Documents: any;
  Tags: any;
  productList: any;
  MarketOpportunities: any;
}
interface AttachmentFilesModel {
  Filename: any;
  Link: any;
  Type: any;
}

@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.scss']
})

export class ContentCardComponent implements OnInit {
  filterSortByVal = 'Asc';
  filters: any = {};
  noOfRecords1 = 0;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 8, 10];
  pageNo = 0;
  pageFirstRecord = (this.pageNo * this.pageSize) + 1;
  pageLastRecord = this.pageSize;
  pageEvent: PageEvent = new PageEvent;
  pageEvent1: PageEvent = new PageEvent;
  refEntityData:any = [];
  refEntityData1 = [];
  news: NewsDetailsModel[] = [];
  newsFiltered: NewsDetailsModel[] = [];
  currentItemsToShow: any;
  relatedNews: any = [];
  totalCountFlag: boolean | undefined;
  RMWBondProductDetailsArr: any = [];
  totalcount: any;
  search: any = '';
  stage2NewsId: any;
  // pageSize: any;
  pageIndex: any;
  newsArray: any[] = [];
  showPopup: boolean = false;
  showAttachments: Boolean = false;
  selectedNews: any;
  displayTags: any[] = [];

  flag = false;
  nflag = true;
  Video_popup: Boolean = false;
  currentTab: number = 1;
  stage2Headline = '';
  stage2Time = '';
  stage2ImageLink = '';
  stage2Description = '';
  stage2ExternalLink = '';
  stage2Like = '';
  stage2Documents = '';
  stage2ProductList = '';
  hashTagArr: string[] = [];
  hashTags = '';

  attachmentCount: number = 0;
  attachmentFiles: AttachmentFilesModel[] = [];
  TagsList: any[] = [];
  showAttachmentsPopup = false;
  showStage2Popup = false;
  ContentHideConfig = true;



  imgURL: any;
  filePreviewFlag = false;
  isImage = false;
  fileLink = '';
  iframeinterval: any;
  showContactInfoFlag = false;
  contactDetails = '';
  showContactInfoPopupFlag = false;
  validationArr: any;
  viewer = 'google';
  selectedType = 'docx';
  DemoDoc = "http://www.africau.edu/images/default/sample.pdf";



  headline = '';
  ListName = '';
  NewsLikeFlag : any = [];

  productDetailFlag = false;
  popupFlag = true;
  // BBVACLI-316 Pranav D 18-Jan-2023 
  relatedNewsHeader: any
  relatedNewsArr: any[] = [];

  constructor(private apiservice: ApifunctionsService) {
    this.RMWBondProductDetailsArr = [];
  }

  filter: any[] = ["Recent", "Liked", "Research Backed", "Popular", "Market Opportunities"];
  Visited: any = 0
  segments: any[] = [];
  selectedSegment: number = 0;
  selectedFilter: any = '';
  advices: any[] = [];
  asseturl = environment.asseturl;

  productListFlag: any = [];

  ngOnInit(): void {
    // this.filter = ['Recent','Liked','Research Backed','Popular','Market Opportunities'];
    this.selectedSegment = 0;
    this.selectedFilter = this.filter[0];
    // this.refEntityData = this.referenceEntityTableData.slice(0, this.pageSize);

    // this.handleFilterChange(this.selectedFilter)
    setTimeout(() => {
      this.getNewsConfig();
      this.getNews(false, '', '', '', this.pageIndex + 1, '', '', 99, '', '');
      // this.totalcount = this.newsFiltered.length;
      // this.currentItemsToShow 

    });
    this.pageIndex = 0;
    this.pageSize = 6;
    // console.log(this.filter)
  }
  ChangeFilter(_e: any, value: any) {
    this.Visited = value;
  }
  handleFilterChange(selectedFilter: any) {
    this.loadFilteredNews(selectedFilter);
  }

  loadFilteredNews(selectedFilter: any) {

    try {
      switch (selectedFilter) {
        case 'Recent':
          this.getNews(false, '', '', '', this.pageIndex + 1, '', '', this.pageSize, '', '');
          break;
        case 'Liked':
          this.getNews(false, '', '', 'Y', this.pageIndex + 1, '', '', this.pageSize, '', '');
          break;
        case 'Research Backed':
          this.getNews(false, '', '', '', this.pageIndex + 1, '', 'Y', this.pageSize, '', '');
          break;
        case 'Popular':
          this.getNews(false, '', '', '', this.pageIndex + 1, 'Y', '', this.pageSize, '', '');
          break;
        case 'Market Opportunities':
          this.getNews(false, '', '', '', this.pageIndex + 1, '', '', this.pageSize, '', 'Y');
          break;
      }
    } catch (error) {

    }

  } 

  ToggleAttachments() {
    this.showAttachments = !this.showAttachments;

  }
  showStage1Buttons=false
  showStage2Buttons=true
  getNewsConfig() {
    const response:any = this.apiservice.getNewsConfig();
    if (Object.keys(response).length > 0) {
      console.log(response)
      this.showStage1Buttons = response.show_news_stage1_buttons;
      this.showStage2Buttons = response.show_news_stage2_buttons;
      this.ContentHideConfig = response.ContentHideConfig;
      console.log(this.ContentHideConfig);
    }
  }
  async getNews(
    popup: boolean = false,
    tags: any = '',
    NoOfRecords: any='All',
    LikeValue: any,
    PageNumber: any='1',
    Popular: any,
    Recommended: any,
    RowsPerPage: any='10',
    newsID: any,
    MarketOppurturnities: any) {
    let res: any;
    res = await this.apiservice.fetchNewsDetails('', NoOfRecords, '', '', tags, LikeValue, PageNumber, Popular, Recommended, RowsPerPage, tags === '' ? this.search : '', MarketOppurturnities);


    const response = res.items;
    console.log("Response News", res);

    const newsArray: NewsDetailsModel[] = [];
    if (response !== undefined && response.length > 0) {
      if (this.totalCountFlag == true) {
        this.totalcount = response[0].Total_Count;
      }
      // Added by Apurva K|| 04-May-2023|| News_LongDescription
      response.forEach((item: { News_Publish_At: any; News_ID: any; List_Name: any; GetNewsLikeResponseDetails: any; Headline: any; News_ActiveYN: any; News_Code: any; News_Link: any; News_Publish_By: any; News_Size: any; News_Description: any; ImageName: any; ValidFrom: any; ValidTill: any; Recommend: any; Documents: any; Tags: any; GetContentProductResponseDetails: any; MarketOppurtunities: any; News_LongDescription:any}) => {
        // if (newsID === '') {
        const date = moment(item.News_Publish_At, 'MM-DD-YYYY HH:mm:ss');
        let newsInfo: any = [];
        let newslikeres: any = []
        if (newsID !== '') {
          if (newsID === item.News_ID) {
            console.log(newsID, item.News_ID, item)
            newsInfo = this.getNewsLikeAPI(item.News_ID, item.List_Name);
            if (newsInfo.GetNewsLikeResponseDetails && newsInfo.GetNewsLikeResponseDetails.Like_Value) {

              newslikeres = newsInfo.GetNewsLikeResponseDetails;
            } else {
              newslikeres = { 'Like_Value': 'N', 'Number Of Likes': '0' };
            }
          }
        } else {
          newsInfo = item.GetNewsLikeResponseDetails;// this.getNewsLikeAPI(item.News_ID, item.List_Name);
          if (newsInfo && newsInfo.Like_Value) {
            newslikeres = newsInfo;
          } else {
            newslikeres = { 'Like_Value': 'N', 'Number Of Likes': '0' };
          }
        }
        // console.log(newsInfo);

        // if (newsInfo.GetNewsLikeResponseDetails && newsInfo.GetNewsLikeResponseDetails.Like_Value) {

        const newsItem: NewsDetailsModel = {
          Headline: item.News_Description,
          NewsActive: item.News_ActiveYN,
          NewsCode: item.News_Code,
          NewsID: item.News_ID,
          NewsLink: item.News_Link,
          NewsPublishAt: item.News_Publish_At,
          NewsPublishBy: item.News_Publish_By,
          NewsSize: item.News_Size.toLowerCase() || 'small',
          NewsDescription: (item.News_LongDescription || ' ').replace(/(?:\r\n|\r|\n|\?)/g, "<br>"),
          // NewsDescriptionShort: (item['News_Description'] + '').split('. ').slice(0, 2).join('. '),
          NewsDescriptionShort: (item.News_Description + '' || ' ').replace(/(?:\r\n|\r|\n|\?)/g, "<br>").substr(0, 300) + '...',
          ImageLink1: '', //this.getImage(item.News_ID) || '',
          ImageLink: this.getNewsImgResourcePath(item.ImageName),
          // ImageLink: '',
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
          productList: newsID !== '' ? newsInfo.GetContentProductResponseDetails : item.GetContentProductResponseDetails,
          MarketOpportunities: item.MarketOppurtunities ? item.MarketOppurtunities : 'N'
        };
        newsArray.push(newsItem);
        console.log(newsItem.ImageLink,"ImageLink");
        // console.log(newsItem.productList[0].TOM_Sub_Template_Code);
        this.newsArray = newsArray;


      });
    }

    if (popup) {
      if (newsArray.length > 0) {
        // console.log('123456');
        this.RMWBondProductDetailsArr = [];
        this.relatedNews = newsArray.filter(n => n.NewsID !== this.stage2NewsId);
        // console.log(this.relatedNews, newsArray);
        this.RMWBondProductDetailsArr = (newsArray.filter(n => n.NewsID === this.stage2NewsId))[0].productList;
      } else {
        this.relatedNews = [];
        this.news = [];
        this.currentItemsToShow = [];

      }
    } else {
      if (newsArray.length > 0) {
        this.currentItemsToShow = newsArray;
        this.totalcount = this.currentItemsToShow.length;
        // this.newsFiltered = this.news.sortBy('Time').reverse();
        // this.totalcount = this.newsFiltered.length;
        this.news = this.currentItemsToShow.slice(0, this.pageSize);
        
      } else {
        this.relatedNews = [];
        this.news = [];
        this.currentItemsToShow = [];
      }
    }

    console.log("get news ", this.news, this.newsArray, this.newsFiltered);
    
    // console.log(this.RMWBondProductDetailsArr);
    // $('#loading').hide();
    this.totalCountFlag = true;
  }
  clearAttachmentPopup() {
    this.attachmentFiles.length = 0;
    this.attachmentCount = 0;
    this.showAttachmentsPopup = false;
    return false;
  }

  fillAttachmentPopup(newsId: string, flag: any, _newsArr: any) {
    console.log("fillAttachmentPopup");
    this.attachmentFiles.length = 0;
    // newsArr.forEach((element:any) => { 
    //   if(element.News_ID==newsId){

    //   }

    // });
    //const documentsValue = newsArr.filter( (n:any) => n.NewsID === newsId).Documents;

    // const documentsValue:any = newsArr.filter((n:any) => n.NewsID === newsId)[0]?.Documents;
    //const tagsValue = newsArr.filter((n:any) => n.NewsID === newsId)[0]?.Tags;

    // <!-- Anubhav Goyal | 19-01-2023 | BBVACLI-761 | Unable to click/redirect to different content -->
    const documentsValue:any = this.news.filter((n:any) => n.NewsID === newsId)[0]?.Documents;
    const tagsValue = this.news.filter((n:any) => n.NewsID === newsId)[0]?.Tags;
    // console.log("Tags Value");
    // console.log(tagsValue);
    // console.log(documentsValue, this.news.filter(n => n.NewsID === newsId)[0]);
    if (documentsValue !== "") {
      const documents:any = documentsValue.split(',');
      this.attachmentCount = documents.length;

      documents.forEach((d: any) => {
        const attachments: AttachmentFilesModel = {
          Filename: d,
          Link: this.apiservice.getNewsAttachment(d),
          Type: d.toString().split('.')[1]
        };
        console.log("Attachment Files");
        console.log(this.attachmentFiles);
        this.attachmentFiles.push(attachments);
      });
      this.showAttachmentsPopup = flag;

    }

    if (tagsValue !== "") {
      const TagsList = tagsValue.split(',');
      // this.attachmentCount = Tags.length;

      // Tags.forEach((d:any)   => {
      //   const attachments: AttachmentFilesModel = {
      //     Filename: d,
      //     Link: this.apiservice.getNewsAttachment(d),
      //     Type: d.toString().split('.')[1]
      //   };
      console.log("Tags");
      //console.log(this.TagsList);
      this.TagsList = [];
      this.TagsList.push(TagsList);
    }
    console.log(this.TagsList[0]);
    this.displayTags = this.TagsList[0];

    return false;
  }

  fillStage2Popup(newsId: string) {
    console.log("fill stage 2 pop up");
    this.totalCountFlag = false;
    this.stage2NewsId = newsId;
    this.fillAttachmentPopup(this.stage2NewsId, false, this.news);
    if (!this.ContentHideConfig) {
      $('#loading').show();
      setTimeout(() => {
        this.stage2NewsId = newsId;
        this.fillAttachmentPopup(this.stage2NewsId, false, this.news);
        const selectedNews = this.news.filter(n => n.NewsID === newsId)[0];
        console.log(selectedNews);
        if (selectedNews !== undefined) {
          this.stage2Headline = selectedNews.Headline;
          this.stage2ImageLink = selectedNews.ImageLink;
          this.stage2Time = selectedNews.RelativeTime;
          this.stage2Description = selectedNews.NewsDescription;
          this.stage2ExternalLink = selectedNews.NewsLink;
          this.stage2Like = selectedNews.Like;
          this.stage2Documents = selectedNews.Documents;
          this.stage2ProductList = selectedNews.List_Name;

          console.log(this.stage2ExternalLink);
          this.getNews(true, selectedNews.Tags, '', '', '1', '', '', '99', newsId, '');
          this.hashTagArr = [];
          this.hashTags = ''
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
  // <!-- Anubhav Goyal | 19-01-2023 | BBVACLI-761 | Unable to click/redirect to different content -->
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
  // <!-- Anubhav Goyal | 19-01-2023 | BBVACLI-761 | Unable to click/redirect to different content -->
  fillStage2RelatedPopup(newsId: string, headline: any, list: any) {
    // console.log(newsId);
    this.filePreviewFlag = false;
    this.totalCountFlag = false;
    if (!this.ContentHideConfig) {
      $('#loading').show();
      setTimeout(() => {
        this.stage2NewsId = newsId;
        this.headline = headline;
        this.ListName = list;
        console.log("List");
        // this.RMWBondProductDetailsArr = [];
        // if (list !== null && list !== '') {
        //   const res = this.apiservice.GetRMWProductDetails('', '', '', 'Product_Name asc', '\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\'', 50, list, 1, ' Where Template_Code in (\'AutocallablePhoenix\',\'ReverseConvertible\',\'Participation\',\'CreditTranche\')', '', 'Public');
        //   if (res.items !== undefined) {
        //     this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
        //     console.log(this.RMWBondProductDetailsArr);
        //     // this.totalcount =res.items.length;
        //   }
        // }
        this.fillAttachmentPopup(this.stage2NewsId, false, this.relatedNews);
        const selectedNews = this.relatedNews.filter((n:any) => n.NewsID === newsId)[0];
        //  console.log(this.news, newsId, this.newsFiltered, this.relatedNews);
        if (selectedNews !== undefined) {
          this.stage2Headline = selectedNews.Headline;
          this.stage2ImageLink = selectedNews.ImageLink;
          this.stage2Time = selectedNews.RelativeTime;
          this.stage2Description = selectedNews.NewsDescription;
          this.stage2ExternalLink = selectedNews.NewsLink;
          this.stage2Like = selectedNews.Like;
          this.stage2Documents = selectedNews.Documents;
          this.stage2ProductList = selectedNews.List_Name;
          this.getNews(true, selectedNews.Tags, '', '', '1', '', '', '99', newsId, '');
          this.hashTagArr = [];
          this.hashTags = ''
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

  getNewsLikeAPI(newsId: any, listName: any) {
    const response:any = this.apiservice.getNewsLikeAPI(newsId, listName);
    // console.log(newsId, response);
    return response;
  }

  getNewsImgResourcePath(fileName: any): any {
    //const response:any = 
    return this.apiservice.getNewsImgResourcePath(fileName);
    // if (response.length > 0) {
    //   return response;
    // }
  }

  clickNewsHeadline(item: any) {
    try {
      this.showPopup = !this.showPopup;
      this.selectedNews = item;
      for(let i = 0; i < this.selectedNews?.productList?.length; i++){
        this.productListFlag[i] = false;
      }
      this.getRelatedNews(item);
    } catch (error) {
    }
  }
  // BBVACLI-752 Pranav D 18-Jan-2023
  getRelatedNews(item: any) {
    try {
      this.relatedNewsArr = [];
      this.news.forEach((data: any) => {
        if (item.NewsID !== data.NewsID) {
          this.relatedNewsArr.push(data);
        }
        console.log('related News', this.relatedNewsArr);
      });
    } catch (error) {

    }
  }

  closePopup() {
    try {
      this.showPopup = false;
    } catch (error) {

    }
  }
  toggleDisplayDiv(tab: number) {
    this.currentTab = tab
    console.log("Flipped");
  }
  toggleVideoPopup() {
    this.Video_popup = !this.Video_popup;
  }
  openfilePreviewDiv(fURL: any, _type: any, filename: any) {
    this.ToggleAttachments();
    this.filePreviewFlag = true;
    this.fileLink = fURL;
    console.log(fURL);
    // const mimeType = mime.lookup(type);
    // console.log(mimeType.match(/image\/*/));

    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    const officDocsExtensions = /(\.doc|\.docx|\.xls|\.xlsx)$/i;
    // const otherDocsExtensions =/(\.txt|\.html|\.json)$/i;

    if (!allowedExtensions.exec(filename)) {
      this.isImage = false;
      // this.imgURL = "https://docs.google.com/gview?url=" + fURL + "&embedded=true";

      this.imgURL = fURL;


      console.log(this.imgURL, this.DemoDoc);
      // this.iframeinterval = setInterval(() => {
      $('#iframeDocViewer').src = this.imgURL;

    } else {
      this.isImage = true;
      this.imgURL = fURL;
      console.log(this.imgURL);
    }

  }

  iframeloadevent() {

    if ($("#iframeDocViewer").contents().find("body").length) {

      // this.iframeinterval = setInterval(() => {
      //   console.log('11111');
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

  // Added on 07 Nov 2022
  async setNewsLike(newsId: any, likeValue: any, listName : any, indexNews: any){
    let likeValueNew = likeValue == 'Y' ? 'N' : 'Y';
    let index = (indexNews == -1) ? this.news.findIndex(ele => ele.NewsID === newsId) : indexNews; 
    let response = await this.apiservice.setNewsLikeAPI(newsId, likeValueNew);
    if(response){
       let responseNewsLike = await this.getNewsLikeAPI(newsId, listName);
       if(responseNewsLike){
        this.news.filter(n => n.NewsID === newsId)[0].Like = responseNewsLike?.GetNewsLikeResponseDetails?.Like_Value;
        if(this.selectedFilter == 'Liked' && responseNewsLike?.GetNewsLikeResponseDetails?.Like_Value == 'N'){
          this.news.splice(index, 1);
        }
        if(this.selectedNews){
         this.selectedNews.Like = responseNewsLike?.GetNewsLikeResponseDetails?.Like_Value;
        }
       }
    }
  }
	
	
  // Added on 08 Nov 2022 for News Search
  getNewsSearch(event : any){
    // console.log("search", event);
    this.search = event.target.value;
    this.handleFilterChange(this.selectedFilter);
  }
  getPageInfo(pageInfo:any) {
    console.log(this.news, this.newsArray, this.newsFiltered);
    
    //console.log('pageinfo', pageInfo);
    try {
      // this.referenceEntityTableData = this.afs.GetReferenceEntityLookupData();
      // console.log('ref data', this.referenceEntityTableData);
      // this.refEntityData = this.referenceEntityTableData;  
      this.noOfRecords1 = pageInfo.length;
      this.pageNo = pageInfo.pageIndex;
      this.pageSize = pageInfo.pageSize;
      this.pageFirstRecord = (this.pageNo * this.pageSize) + 1;
      this.pageLastRecord = ((this.pageNo + 1) * this.pageSize) >= this.noOfRecords1
        ? this.noOfRecords1 : ((this.pageNo + 1) * this.pageSize);
      let filtersPresent = false;
      Object.keys(this.filters).forEach(f => { if (!filtersPresent && this.filters[f].length) { filtersPresent = true; } });
      console.log('filters', this.filters);
      if (!filtersPresent) {
        this.news = this.currentItemsToShow.slice(this.pageNo * this.pageSize, this.pageNo * this.pageSize + this.pageSize);
        // this.refEntityData = this.referenceEntityTableData.slice(this.pageNo * this.pageSize, this.pageNo * this.pageSize + this.pageSize);
      } else {
        // this.noOfRecords1 =this.refEntityData1.length;
        // this.pageNo = 0;
        // this.pageFirstRecord = (this.pageNo * this.pageSize) + 1;
        // this.pageLastRecord = this.pageSize;

       // this.refEntityData = this.refEntityData1.slice(this.pageNo * this.pageSize, this.pageNo * this.pageSize + this.pageSize);
        this.currentItemsToShow = this.newsFiltered.slice(this.pageNo * this.pageSize, this.pageNo * this.pageSize + this.pageSize);
      }


    } catch (error) {
      console.log(error);
    }
  }

  hidePopup() {
    $('#filters').hide();
    this.productDetailFlag = false;
    return false;
  }

  showProductDetail() {
    this.productDetailFlag = !this.productDetailFlag;
    // return false;
  }

    // showpopup start- 28-July-2020
    showPopup1(headline: any, list: any) {
      $('#loading').show();
      setTimeout(async () => {
        console.log("headline",headline, list);
        $('#filters').show();
        this.headline = headline;
        this.ListName = list;
        this.productDetailFlag = true;
        this.RMWBondProductDetailsArr = [];
        if (list !== null && list !== '') {
          debugger
          const res:any = await this.apiservice.GetRMWProductDetails('', '', '', 'Product_Name asc',
            '\'EQC_Europe\',\'YieldEnhancement\',\'Participation\',\'ACC\',\'DAC\'',
            '50', list, '1', ' Where Template_Code in (\'EQC_Europe\',\'YieldEnhancement\',\'Participation\',\'ACC\',\'DAC\')',
            '', 'Public');
          if (res.items !== undefined) {
            console.log("res RMWBondProductDetailsArr", res)
            this.RMWBondProductDetailsArr = JSON.parse(res.items.replace(/\n/g, ''));
            console.log("RMWBondProductDetailsArr", this.RMWBondProductDetailsArr);
            // this.totalcount =res.items.length;
          }
  
        }
        $('#loading').hide();
      });
      return false;
    }
  
    
  redirectOptions(index: any) {
    try {
      console.log('Index', index, this.productListFlag[index]);
      this.productListFlag[index] = true;
      console.log("productListFlag", this.productListFlag, this.selectedNews?.productList)


    } catch (error) {
      console.log('Error:', error);
    }
    return false;
  }

  hideOptions(index: any) {
    try {
      this.productListFlag[index] = false;
    } catch (error) {
      console.log('Error:', error);
    }
    return false;
  }


}
