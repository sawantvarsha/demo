import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import * as moment from 'moment';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { PortfolioAnalyticsService } from 'src/app/services/portfolio-analytics.service';
// import { ExcelHandlerServiceService } from 'src/app/services/excel-handler-service.service';

@Component({
  selector: 'app-correlation-analytics',
  templateUrl: './correlation-analytics.component.html',
  styleUrls: ['./correlation-analytics.component.scss'],
})
export class CorrelationAnalyticsComponent implements OnInit {
  @ViewChild('searchInput')
  private searchInput: ElementRef;
  @ViewChildren('listTrigger')
  private listTrigger: QueryList<ElementRef>;
  securityList: string[] = [];
  selectedSecurities: any[] = [];
  securityListString: string = '';
  correlationMatrix: any;
  securityStatus: Array<boolean>;
  securityName: string = '';
  showSearchResults: boolean = false;
  tooltip: HTMLElement;
  tooltipTitle: any;
  customerID: string;
  currentTab: string = '';
  error: {
    flag: boolean;
    message: string;
  } = null;
  fetchedSecurities: any[] = [];
  facilityCode: string = '';
  internalSecurities: any[] = [];
  externalSecurities: any[] = [];
  isShowFilters: boolean = false;
  securityFilters: string[] = [
    'Equity & Equity MF',
    'Debt MF',
    'Hybrid & Other MF',
  ];
  selectedFilter: number = null;
  FromDate: any = '';
  ToDate: any = new Date();
  isInternalSecuritiesError: boolean;
  today: Date = new Date(this.ToDate);

  constructor(
    private portfolioAnalyticsService: PortfolioAnalyticsService,
    public ngxXml2jsonService: NgxXml2jsonService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    try {
      this.FromDate = moment(this.subtractDaysFromDate(365)).format(
        'DD-MMM-YYYY'
      );
      this.ToDate = moment(new Date()).format('DD-MMM-YYYY');
      this.portfolioAnalyticsService.portfolioDetailsData.subscribe(
        (res) => {
          console.log(res);
          this.internalSecurities = [];
          this.externalSecurities = [];
          this.fetchedSecurities = [];
          this.selectedSecurities = [];
          this.securityList = [];
          this.customerID = res.CustomerID;
          this.facilityCode = res.FacilityCode;
          this.getPortfolioHoldings();
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  subtractDaysFromDate(days: number) {
    try {
      var date: Date = new Date(this.today);
      date.setDate(this.today.getDate() - days);
      return date;
    } catch (error) {
      console.log(error);
    }
  }

  public setFocusOnFirstMenuItem(event: KeyboardEvent): void {
    if (event.key == 'ArrowDown' || event.key == 'ArrowUp') {
      if (this.listTrigger != null && this.listTrigger.first != null) {
        console.log(this.listTrigger.first.nativeElement);
        this.listTrigger.first.nativeElement.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    switch (event.key) {
      case 'ArrowUp':
        event.stopPropagation();
        (index === 0
          ? this.listTrigger.last
          : this.listTrigger.get(index - 1)
        ).nativeElement.focus();
        break;
      case 'ArrowDown':
        event.stopPropagation();
        (index === this.listTrigger.length - 1
          ? this.listTrigger.first
          : this.listTrigger.get(index + 1)
        ).nativeElement.focus();
        break;
      case 'Escape':
        event.stopPropagation();
        (index === this.listTrigger.length - 1
          ? this.listTrigger.first
          : this.listTrigger.get(index + 1)
        ).nativeElement.blur();
        this.searchInput.nativeElement.focus();
        break;
    }
  }

  toggleSubTab(subtab: string) {
    try {
      if (subtab != this.currentTab) {
        if (subtab == 'internal') {
          this.securityList = this.internalSecurities.slice();
        } else if (subtab == 'external') {
          this.securityList = this.externalSecurities.slice();
          this.selectDeselectFilters(0);
        }
        console.log(this.securityList);
        this.currentTab = subtab;
      }
    } catch (error) {
      console.log(error);
    }
  }

  roundTo = function (num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  floor(input) {
    return Math.floor(input) < 60 ? 60 : Math.floor(input);
  }

  textChangeSearch() {
    if (this.securityName.length > 0) {
      this.showSearchResults = true;
    } else {
      this.showSearchResults = false;
    }
  }

  hideResultsWithDelay() {
    setTimeout(() => {
      this.securityName = '';
      this.showSearchResults = false;
    }, 200);
  }

  getBenchmarkSecurityList() {
    try {
      console.log('Called');
      this.portfolioAnalyticsService.getBenchmarkSecurityList().subscribe(
        (res) => {
          console.log(res);
          var xmlString: string = res.response;
          const parser = new DOMParser();
          const xml = parser.parseFromString(xmlString, 'text/xml');
          const obj = this.ngxXml2jsonService.xmlToJson(xml);
          this.externalSecurities = obj['NewDataSet'].DUMMY;

          this.externalSecurities.forEach((it) => (it.Code = it.Code.trim()));
          this.internalSecurities = this.externalSecurities.filter(
            (it: any) => {
              return this.fetchedSecurities.includes(it.Code.trim());
            }
          );
          this.externalSecurities = this.externalSecurities.filter(
            (it: any) => {
              return !this.internalSecurities.includes(it);
            }
          );
          if (this.internalSecurities.length == 0)
            this.isInternalSecuritiesError = true;
          else this.isInternalSecuritiesError = false;
          //Changes done by Shravan S | 09-02-2022
          console.log(this.internalSecurities, this.externalSecurities);
          this.currentTab = '';
          this.toggleSubTab('internal');
          var num: number = this.securityList.length;
          this.securityStatus = new Array(num).fill(false);
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  selectedSecuritiesChanged(security: any) {
    try {
      console.log(security);
      var index: number = this.selectedSecurities.indexOf(security);
      console.log(index);
      if (index != -1) {
        // this.securityStatus[index] = false;
        this.selectedSecurities.remove(security);
        this.removeSecurity(index);
      } else {
        if (this.selectedSecurities.length < 10) {
          // this.securityStatus[index] = true;
          this.selectedSecurities.push(security);
        } else {
          this.error = {
            flag: true,
            message: "You can't select more than 10 securities",
          };
        }
        this.hideResultsWithDelay();
        this.getCorrelationMatrix();
        let searchBox = <HTMLElement>document.querySelector('.search-box');
        searchBox.focus();
      }
    } catch (error) {
      console.log(error);
    }
  }

  removeSecurity(index: number) {
    try {
      this.correlationMatrix.splice(index, 1);
      this.correlationMatrix.forEach((el) => el.splice(index, 1));
    } catch (error) {
      console.log(error);
    }
  }

  getCorrelationMatrix() {
    try {
      this.securityListString = '';
      // for (var i = 0; i < this.selectedSecurities.length; i++) {
      //   this.securityListString += this.selectedSecurities[i].Code;
      //   if (i != this.selectedSecurities.length - 1) {
      //     this.securityListString += ",";
      //   }
      // }
      var selectedSecurities: string[] = [];
      this.selectedSecurities.forEach((it) =>
        selectedSecurities.push(it.Code.trim())
      );
      var FromDate = moment(this.FromDate).format('YYYY-MM-DD');
      var ToDate = moment(this.ToDate).format('YYYY-MM-DD');
      this.portfolioAnalyticsService
        .getCorrelationMatrix(
          selectedSecurities,
          '',
          'Nifty 50',
          FromDate,
          ToDate,
          this.customerID,
          this.facilityCode,
          []
        )
        .subscribe(
          (res) => {
            console.log(res);
            console.log(typeof res.response[0][0]);
            this.correlationMatrix = res.response;
          },
          (err) => {
            console.log(err);
          }
        );
    } catch (error) {
      console.log(error);
    }
  }

  stringLengthTooLong(obj: string, length: number) {
    return obj.length > length ? '...' : '';
  }

  showTooltip(i: number, j: number, el, className) {
    this.tooltip = this.renderer.createElement('span');
    this.tooltipTitle =
      this.selectedSecurities[i].LongName +
      `<br/> v/s <br/>` +
      this.selectedSecurities[j].LongName;
    // console.log(this.tooltipTitle);
    // console.log(el.parentNode);
    // console.log(el);
    // console.log(this.el);
    var span = this.renderer.createElement('span');
    span.innerHTML = this.tooltipTitle;
    // console.log(span);
    this.tooltip.appendChild(span);
    // this.renderer.appendChild(
    //   this.tooltip,
    //   this.renderer.appendChild(this.tooltipTitle)
    // );
    // console.log(this.tooltip);
    // console.log(el.parentNode.childNodes[j + 2]);
    this.renderer.appendChild(el.parentNode.childNodes[j + 2], this.tooltip);
    this.renderer.addClass(this.tooltip, className);
    this.renderer.addClass(this.tooltip, 'tooltip_show');
  }

  hideTooltip() {
    var elements = document.getElementsByClassName('tooltip_show');
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  getPortfolioHoldings() {
    try {
      this.portfolioAnalyticsService
        .getPortfolioHoldingsEQCash(this.customerID, this.facilityCode)
        .subscribe(
          (res) => {
            if (res) {
              console.log(res);
              var xmlString: string =
                res.GetPortfolioHoldingsEQCashResult.response;
              const parser = new DOMParser();
              const xml = parser.parseFromString(xmlString, 'text/xml');
              const obj = this.ngxXml2jsonService.xmlToJson(xml);
              console.log(obj);
              var jsonList = obj['NewDataSet'].DUMMY;
              console.log(jsonList);

              this.fetchedSecurities = [];
              jsonList.forEach((element) => {
// Changed by MohanP | 2 Feb'22 
                switch (element.CEHDF_Transaction_Code.toUpperCase()) {
                  case 'INITIAL INVESTMENT':
                    break;
                  case 'NOTE PURCHASE':
                  case 'SB':
                  case 'PUR':
                    this.fetchedSecurities.push(
                      element.CEHDF_Stock_Code.trim()
                    );

                    break;

                  default:
                    break;
                }
              });
// Changed by MohanP | 2 Feb'22 
              console.log(this.fetchedSecurities);
              this.getBenchmarkSecurityList();
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } catch (error) {
      console.log(error);
    }
  }

  toggleFilter() {
    this.isShowFilters = !this.isShowFilters;
  }

  selectDeselectFilters(index: number) {
    if (this.selectedFilter != index) {
      switch (index) {
        case 0: {
          this.securityList = this.externalSecurities.filter((it: any) => {
            // console.log(it.LongName);
            // console.log(it.LongName.toUpperCase().includes("EQUITY"));
            // console.log(!it.LongName.toUpperCase().includes("FUND"));
            return (
              it.LongName.toUpperCase().includes('EQUITY') ||
              !it.LongName.toUpperCase().includes('FUND') ||
              it.LongName.toUpperCase().includes('ETF') ||
              it.LongName.toUpperCase().includes('NIFTY')
            );
          });
          break;
        }
        case 1: {
          this.securityList = this.externalSecurities.filter((it: any) => {
            return it.LongName.toUpperCase().includes('DEBT');
          });
          break;
        }
        case 2: {
          this.securityList = this.externalSecurities.filter((it: any) => {
            return (
              !it.LongName.toUpperCase().includes('EQUITY') &&
              !it.LongName.toUpperCase().includes('DEBT') &&
              it.TypeAsset.toUpperCase().includes('UT') &&
              !it.LongName.toUpperCase().includes('ETF') &&
              !it.LongName.toUpperCase().includes('NIFTY')
            );
          });
          break;
        }
      }
      this.selectedFilter = index;
      console.log(this.securityList);
    }
  }

  datesChanged() {
    try {
      this.FromDate = moment(this.FromDate).format('DD-MMM-YYYY');
      this.ToDate = moment(this.ToDate).format('DD-MMM-YYYY');
      console.log(
        new Date(this.FromDate),
        new Date(this.ToDate),
        this.ToDate > this.FromDate
      );
      if (new Date(this.ToDate) > new Date(this.FromDate)) {
        console.log(this.FromDate, this.ToDate);
        this.getCorrelationMatrix();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
