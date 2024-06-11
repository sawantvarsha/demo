import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { HomeApiService } from 'src/app/services/home-api.service';
import { SafePipe } from 'src/app/pipes/safe.pipe';

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
  ImageLink: string;
  RelativeTime: string;
  Time: number;
  List_Name: string;
  Recommend: string;
  Like: string;
  LikesCount: number;
  Documents: string;
  Tags: string;
}

interface AttachmentFilesModel {
  Filename: string;
  Link: string;
}

enum FilterActionEnum {
  'Recent',
  'Liked',
  'Recommended',
  'Popular',
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  isProd = environment.production;
  domainURL = environment.domainURL;
  sslURL = environment.sslURL;
  isSSL = environment.isSSL;
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
  LoadingFlag: boolean;
  IsBackButtonEnabled: boolean;

  get FilterAction() {
    return FilterActionEnum;
  }
  activeFilter: FilterActionEnum = FilterActionEnum.Recent;
  constructor(
    private apiservice: WorkflowApiService,
    public homeApi: HomeApiService,
    public router: Router,
    public safePipe: SafePipe
  ) {
    this.RMWBondProductDetailsArr = [];
    this.LoadingFlag = true;
  }
  ngOnDestroy(): void {
    this.homeApi.RediretToHomeBuySellPledge = '';
  }

  ngOnInit(): void {
    this.IsBackButtonEnabled =
      this.homeApi.RediretToHomeBuySellPledge === '' ? false : true;

    setTimeout(() => {
      this.getNewsConfig();
      this.getNews();
    });
  }

  ngAfterViewInit(): void {
    const images = document.getElementsByClassName('news-image');
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
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
    const response = this.apiservice.getNewsConfig();
    if (Object.keys(response).length > 0) {
      this.showStage1Buttons = response.show_news_stage1_buttons;
      this.showStage2Buttons = response.show_news_stage2_buttons;
    }
  }

  getNews(popup: boolean = false, tags: string = '') {
    const response = this.apiservice.fetchNewsDetails('', '', '', '', tags);
    const newsArray: NewsDetailsModel[] = [];
    if (response.length > 0) {
      this.LoadingFlag = false;
      response.forEach((item) => {
        const date = moment(item.News_Publish_At, 'MM-DD-YYYY HH:mm:ss');
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
              .substr(0, 500) + '...',
          ImageLink: this.getImage(item.News_ID) || '',
          ValidFrom: item.ValidFrom,
          ValidTo: item.ValidTill,
          RelativeTime: moment(date).fromNow(),
          Time: moment(date).unix(),
          List_Name: item.List_Name,
          Recommend: item.Recommend ? item.Recommend : 'N',
          Like: this.getNewsLikeAPI(item.News_ID) || 'N',
          LikesCount: this.getNoOfNewsLikesAPI(item.News_ID) || 0,
          Documents: item.Documents || '',
          Tags: item.Tags || '',
        };
        // console.log(moment(date).fromNow());
        newsArray.push(newsItem);
      });
    }

    if (popup) {
      this.relatedNews = newsArray.filter(
        (n) => n.NewsID !== this.stage2NewsId
      );
    } else {
      this.news = newsArray;
      this.news.sort((a, b) => {
        return a.Time - b.Time;
      });
      this.newsFiltered = this.news.reverse();
    }
    console.log(this.news);
  }

  getNewsSizeClass(size: string, newsIndex: number): string {
    if (this.activeFilter !== FilterActionEnum.Recent) {
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
        }
      }
      return 'news-small';
    } else {
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

  getImage(newsId: string) {
    const response = this.apiservice.getNewsImageContent(newsId);
    if (response.length > 0) {
      return response;
    }
  }

  getAttachment(filename: string) {
    const response = this.apiservice.getNewsAttachment(filename);
    if (response.length > 0) {
      return response;
    }
  }

  getLikeImage(like: string) {
    return like === 'N'
      ? this.isProd
        ? 'assets/like.svg'
        : './../../assets/like.svg'
      : this.isProd
      ? 'assets/liked.svg'
      : './../../assets/liked.svg';
  }

  getNewsLikeAPI(newsId: string): string {
    let response: any = this.apiservice.getNewsLikeAPI(newsId);
    console.log(newsId, response);
    if (this.isSSL) {
      response = this.safePipe.transform(
        response.URL.replace(
          /\b(http:\/\/)(?:\d{1,3}\.){3}\d{1,3}\b/g,
          window.location.protocol + '//' + this.sslURL
        ),
        'resourceUrl'
      );
    }
    return response;
  }

  getNoOfNewsLikesAPI(newsId: string): number {
    const response = this.apiservice.getNoOfNewsLikesAPI(newsId);

    return response;
  }

  setNewsLikeAPI(likeCurrentValue: string, newsId: string) {
    const likeValue = likeCurrentValue === 'Y' ? 'N' : 'Y';
    const response = this.apiservice.setNewsLikeAPI(newsId, likeValue);
    // console.log(response);
    if (response.toLowerCase() === 'success') {
      this.news.map((n) => {
        if (n.NewsID === newsId) {
          n.Like = likeValue;
        }
      });
      this.news.sort((a, b) => {
        // eslint-disable-next-line one-var
        // const dateA: any = new Date(a[6].Value);
        // const dateB: any = new Date(b[6].Value);
        return a.Time - b.Time;
      });
      this.newsFiltered = this.news.reverse();
      this.stage2Like = likeValue;
    }

    const likesCount = this.getNoOfNewsLikesAPI(newsId);
    const newsItem = this.news.filter((n) => n.NewsID === newsId)[0];
    newsItem.LikesCount = likesCount;
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

  fillAttachmentPopup(newsId: string) {
    this.attachmentFiles.length = 0;
    const documentsValue = this.news.filter((n) => n.NewsID === newsId)[0]
      .Documents;
    // console.log(documentsValue, this.news.filter(n => n.NewsID === newsId)[0]);
    const documents = documentsValue.split(',');
    this.attachmentCount = documents.length;
    documents.forEach((d) => {
      const attachments: AttachmentFilesModel = {
        Filename: d,
        Link: this.apiservice.getNewsAttachment(d),
      };
      this.attachmentFiles.push(attachments);
    });
    this.showAttachmentsPopup = true;
  }

  clearAttachmentPopup() {
    this.attachmentFiles.length = 0;
    this.attachmentCount = 0;
    this.showAttachmentsPopup = false;
  }

  fillStage2Popup(newsId: string) {
    setTimeout(() => {
      this.stage2NewsId = newsId;
      const selectedNews = this.news.filter((n) => n.NewsID === newsId)[0];
      this.stage2Headline = selectedNews.Headline;
      this.stage2ImageLink = selectedNews.ImageLink;
      this.stage2Time = selectedNews.RelativeTime;
      this.stage2Description = selectedNews.NewsDescription;
      this.stage2ExternalLink = selectedNews.NewsLink;
      this.stage2Like = selectedNews.Like;
      this.stage2Documents = selectedNews.Documents;
      this.stage2ProductList = selectedNews.List_Name;

      this.getNews(true, selectedNews.Tags);

      this.showStage2Popup = true;
    });
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
  }

  hideStage2ImageContainerOnError() {
    const images = document.getElementsByClassName('stage2-news-image');
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
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
    switch (filter) {
      case FilterActionEnum.Recent:
        if (this.activeFilter === FilterActionEnum.Recent) {
          this.getNews();
        }
        this.news.sort((a, b) => {
          // eslint-disable-next-line one-var
          // const dateA: any = new Date(a[6].Value);
          // const dateB: any = new Date(b[6].Value);
          return a.Time - b.Time;
        });
        this.newsFiltered = this.news.reverse();
        break;
      case FilterActionEnum.Popular:
        this.news.sort((a, b) => {
          // eslint-disable-next-line one-var
          // const dateA: any = new Date(a[6].Value);
          // const dateB: any = new Date(b[6].Value);
          return a.LikesCount - b.LikesCount;
        });
        this.newsFiltered = this.news.reverse();
        // this.newsFiltered = this.news.sortBy('LikesCount').reverse();
        break;
      default:
        // this.newsFiltered = this.news.sortBy('Time').reverse();
        this.news.sort((a, b) => {
          // eslint-disable-next-line one-var
          // const dateA: any = new Date(a[6].Value);
          // const dateB: any = new Date(b[6].Value);
          return a.Time - b.Time;
        });
        this.newsFiltered = this.news.reverse();
        break;
    }
    this.activeFilter = filter;
  }

  // showpopup start- 28-July-2020
  showPopup(headline: any, list: any) {
    setTimeout(() => {
      //console.log(headline, list);
      this.headline = headline;
      this.ListName = list;
      this.RMWBondProductDetailsArr = [];
      if (list !== null && list !== '') {
        const res = this.apiservice.GetRMWProductDetails(
          '',
          '',
          'All',
          'Product_Name asc',
          "'Bonds','Fund_Setup','FCNMemory','Equity_Setup'",
          50,
          list,
          1,
          " Where Template_Code in ('Bonds','Fund_Setup','FCNMemory','Equity_Setup')",
          '',
          'Public'
        );
        this.RMWBondProductDetailsArr = JSON.parse(
          res.items.replace(/\n/g, '')
        );
        //console.log(this.RMWBondProductDetailsArr);
      }
    });
  }
  // showpopup end- 28-July-2020
  hidePopup() {
    this.productDetailFlag = false;
  }

  showProductDetail() {
    this.productDetailFlag = !this.productDetailFlag;
  }

  fnRedirectToHomePage() {
    if (this.homeApi.RediretToHomeBuySellPledge === 'HOME') {
      // this.homeapi.openPopup =true;
      this.router.navigate(['/home']);
      this.homeApi.RediretToHomeBuySellPledge = '';
    } else {
      // this.router.navigate(['/portfolioallocation']);
    }
  }
}
