import { DecimalPipe } from '@angular/common';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { SignalrApiService } from 'src/app/services/signalR/signalr-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
// import { TradingInsightsComponent } from '../../fx-order/trading-insights/trading-insights.component';

@Component({
  selector: 'app-product-watchlist',
  templateUrl: './product-watchlist.component.html',
  styleUrls: ['./product-watchlist.component.scss'],
})
export class ProductWatchlistComponent implements OnInit {
  isRM: boolean;
  baseCCY: string;
  ClientSummaryResult: any[];
  watchlistData: any[];
  //added by Uddesh on 25 Jan, 2022
  allproductData: any[];
  searchKey: any;
  showSuggestions: boolean;
  watchlistSearchItems: any[];
  //Changed By MohanP | 04Feb22
  //Changed by Rohit T. Asked by Parikshit K. 31-Jan-2021
  watchlistColors = [
    '#104437', //vdarkgreen
    '#0D654E', //darkgreen
    '#00926C', //grreen
    '#CD4E41', //vdarkred
    '#B32E20', //darkred
    '#85190E', //red
  ];

  filterdProducts: any;
  custDetails: { CustomerID: number; CustomerName: string; GroupId: string };
  WatchlistData: any;
  watchlistNames: any[];

  @Output() getWatchlistNamesEvent = new EventEmitter<any>();
  selectedWatchlist: any;
  selectedWatchlistData: any = [];
  EQWLFeed: any;
  // @Input() selectedWatchlist: any;

  newWatchlistName: any = '';
  isNewWatchlist: any;
  rangeArray: any;
  username: string;
  custId: string;

  @Input() get NewWatchlistName(): any {
    return this.newWatchlistName;
  }
  set NewWatchlistName(NewWatchlistName: any) {
    this.newWatchlistName = NewWatchlistName;
    console.log('new watchlist', this.newWatchlistName);

    this.selectedWatchlist = this.newWatchlistName;
    this.watchlistData = undefined;
    this.FetchWatchListNames();
  }
  @Input() get AddNewWatchList(): any {
    return this.isNewWatchlist;
  }
  set AddNewWatchList(AddNewWatchList: any) {
    this.isNewWatchlist = AddNewWatchList;
    // this.FetchWatchListNames();
    console.log('new watchlist', this.newWatchlistName);
  }

  @Input() get SelectedWatchlist(): any {
    return this.selectedWatchlist;
  }

  set SelectedWatchlist(SelectedWatchlist: any) {
    this.selectedWatchlist = SelectedWatchlist;
    console.log('selectedWatchlist', this.selectedWatchlist);
    this.GetProductLIstofWatchlist();
  }
  selectedRMCustomerDetails: {
    custName: string;
    custId: string;
    userName: string;
  };
  mode: any;
  isUserRM: boolean;

  @Input() get CustomerDetails() {
    return this.selectedRMCustomerDetails;
  }
  set CustomerDetails(CustomerDetails) {
    this.selectedRMCustomerDetails = CustomerDetails;
    this.username = this.selectedRMCustomerDetails?.userName;
    this.custId = this.selectedRMCustomerDetails?.custId;

    this.FetchWatchListNames();

    // console.log(this.selectedRMCustomerDetails);
  }
  @Input() get Mode() {
    return this.mode;
  }
  set Mode(Mode) {
    this.mode = Mode;
    this.isUserRM = this.mode === 'RM';
    console.log(this.mode);
  }

  constructor(
    public commonApi: CommonApiService,
    public workflowApi: WorkflowApiService,
    public authApi: AuthService,
    public custApi: CustomerApiService,
    public homeApi: HomeApiService,
    public decimalPipe: DecimalPipe,
    public signalRApi: SignalrApiService,
    public ref: ChangeDetectorRef
  ) {
    this.isRM = false;
    this.watchlistData = [];
    this.showSuggestions = false;
    this.watchlistSearchItems = [];
    this.username = '';
    this.custId = '';
  }

  async ngOnInit() {
    // this.custDetails = {
    //   CustomerID: 102,
    //   CustomerName: 'Apollo',
    //   GroupId: '',
    // };
    // this.signalRApi.startConnection();

    if (this.isUserRM) {
      this.username = this.selectedRMCustomerDetails?.userName;
      this.custId = this.selectedRMCustomerDetails?.custId;
    } else {
      this.username = this.authApi.UserName;
      this.custId = this.homeApi.CustomerId;
    }

    this.signalRApi.PriceFeedObs.subscribe((EQFeed) => {
      if (EQFeed !== 'No Price' && this.selectedWatchlistData?.length > 0) {
        try {
          this.EQWLFeed = JSON.parse(EQFeed);
          console.log(this.EQWLFeed);
          if (this.selectedWatchlistData.length > 0) {
            this.selectedWatchlistData.forEach((wl) => {
              if (wl.Underlying) {
                if (wl.Underlying.split('.')[0] === this.EQWLFeed.FeedCode) {
                  const feedInfo = Object.assign(
                    {},
                    ...this.EQWLFeed.FeedInfo.map((item) => ({
                      [item['FieldName']]: item['FeedValue'],
                    }))
                  );

                  // this.EQWLFeed.FeedInfo.map((e) => {
                  //   let obj = {};
                  //   obj[e['FieldName']] = e['FeedValue'];
                  //   return obj;
                  // });
                  wl.spotbidquote =
                    feedInfo.SpotBidQuote === undefined
                      ? wl.spotbidquote
                      : feedInfo.SpotBidQuote;
                  wl.spotaskquote =
                    feedInfo.SpotAskQuote === undefined
                      ? wl.spotaskquote
                      : feedInfo.SpotAskQuote;

                  wl.DayChange = feedInfo.netchange;
                  wl.LTP = feedInfo.previousclose;
                  wl.perdiff = feedInfo.perdiff;
                  console.log(wl.Underlying, feedInfo);
                }
              }
            });

            this.watchlistData = this.selectedWatchlistData
              .filter((p) => p.Isin !== '')
              .map((c) => {
                // console.log(c)




                const obj = {
                  id: c.Underlying.trim(),
                  value: c.name,
                  data1: c.spotaskquote || c.LTP,
                    // data2: c.Note_Master_Id,
                    data2:
                      this.decimalPipe.transform(
                        c.DayChange,
                        c.DecimalAmount > 2 ? '1.2-' + c.DecimalAmount : '1.2'
                      ) +
                      ' (' +
                      this.decimalPipe.transform(
                        c.perdiff,
                        c.DecimalAmount > 2 ? '1.2-' + c.DecimalAmount : '1.2'
                      ) +
                      '%)',
                    //Changed by Rohit T. Asked by Parikshit K. 31-Jan-2021
                    bgColor:
                      parseFloat(c.perdiff) >= 0
                        ? parseFloat(c.perdiff) < 1.0
                          ? parseFloat(c.perdiff) >= 0.5
                            ? this.watchlistColors[1]
                            : this.watchlistColors[2]
                          : this.watchlistColors[0]
                        : parseFloat(c.perdiff) > -1.0
                        ? parseFloat(c.perdiff) >= -0.5
                          ? this.watchlistColors[3]
                          : this.watchlistColors[4]
                        : this.watchlistColors[5],

                    data3: c.Note_Master_Id,
                    //Added by Rohit T. Asked by Parikshit K. 31-Jan-2021
                    color:
                      parseFloat(c.perdiff) >= 0
                        ? this.watchlistColors[0]
                        : this.watchlistColors[5],
                    percentage: parseFloat(c.perdiff),
                  };
                return obj;
              });
          }
        } catch (error) {
          console.log(error);
        }
      }
      this.ref.detectChanges();
    });

    this.homeApi.getAllProducts().subscribe((res) => {
      console.log('all products', res);
      this.allproductData = res.ListProduct.items;
      this.watchlistSearchItems = this.allproductData
        .filter((p) => p.Isin !== '')
        .map((c) => {
          const obj = {
            id: c.Feedcode || c.Isin,
            value: c.Product_Name,
            data1: c.Note_Master_Id,
            data2: c.Isin,
            data3: c.Note_Master_Id,
            data4: c.Currency,
            data5: c.Type,
          };
          return obj;
        });
      console.log('all products', this.allproductData);
    });
    this.custApi.getBankBaseCCYOBS.subscribe(async (ccy) => {
      this.baseCCY = ccy;

      this.homeApi.CustomerMappedToRM =
        await this.workflowApi.GetClientSummaryAsync(
          this.authApi.EntityID,
          this.authApi.UserName,
          this.baseCCY
        );
    });

    this.FetchWatchListNames();
  }

  FetchWatchListNames() {
    this.custApi
      .GetWatchListNamesMulti(this.username, this.custId)
      .then((res) => {
        this.watchlistNames = res.GetWatchListAPIResponse.items;
        if (this.watchlistNames) {
          console.log('watchlist names', this.watchlistNames);
          if (this.newWatchlistName !== '') {
            this.watchlistNames.push({ WatchlistName: this.newWatchlistName });
            this.newWatchlistName = '';
            this.getWatchlistNamesEvent.emit({
              isNew: true,
              watchlistNames: this.watchlistNames,
            });
          } else {
            this.getWatchlistNamesEvent.emit({
              isNew: false,
              watchlistNames: this.watchlistNames,
            });
          }
        }
      });
  }

  selectedWatchlistDataEvent(_event) {
    console.log(_event);
  }

  selectWatchlistSearchItemEvent(_event) {
    console.log('selected share', _event);
    this.custApi
      .AddSharetoWatchListMulti(
        this.authApi.UserName,
        this.selectedWatchlist,
        this.selectedWatchlist,
        _event ? _event.data1 : '',
        this.homeApi.CustomerId,
        _event ? _event.data5 : ''
      )
      .then(() => {
        this.GetProductLIstofWatchlist();
      });
    // this.watchlistData.push(_event);
  }

  deleteWatchlistShare(_event) {
    console.log('share from product watch', _event);
    this.custApi
      .DeleteShareFromWatchListMulti(
        this.selectedWatchlist,
        _event.data3,
        this.homeApi.CustomerId,
        _event.data5
      )
      .then(() => {
        this.GetProductLIstofWatchlist();
        if (this.watchlistData.length === 1) {
          this.FetchWatchListNames();
        }
      });
  }
  closePopups() {
    this.showSuggestions = false;
    this.searchKey = '';
  }

  SelectProduct(item: any) {
    this.showSuggestions = false;
    console.log('selected Item', item);
    this.WatchlistData = item;
  }

  filterProducts() {
    if (this.searchKey?.length > 2) {
      this.showSuggestions = true;
      this.filterdProducts = this.allproductData.filter((item) =>
        item.Feedcode.toLowerCase().includes(this.searchKey.toLowerCase())
      );
      this.searchKey = '';
      console.log('filterd products', this.filterdProducts);
    } else {
      this.showSuggestions = false;
    }
  }
  calculateColorRange(data) {
    const range = data
      .map((e) => parseFloat(e.perdiff))
      .sort((a, b) => (a > b ? 1 : -1));
    console.log(range);
  }
  //Changed by MohanP | 03feb22
  GetProductLIstofWatchlist() {
    this.custApi
      .GetWatchListDataMulti(this.username, this.custId, this.selectedWatchlist)
      .then((res) => {
        console.log('selected watchlist data', res);
        this.selectedWatchlistData = res.GetWatchListDataAPIResponse.items;
        console.log('watchlist Data', this.selectedWatchlistData);
        if (this.selectedWatchlistData !== null) {
          this.rangeArray = this.calculateColorRange(
            this.selectedWatchlistData
          );
          this.watchlistData = this.selectedWatchlistData
            .filter((p) => p.Isin !== '')
            .map((c) => {
              // console.log(c.perdiff)
              const obj = {
                id: c.Underlying.trim(),
                value: c.name,
                // value: c.Product_Name,
                data1: c.LTP,
                // data2: c.Note_Master_Id,
                data2:
                  this.decimalPipe.transform(
                    c.DayChange,
                    c.DecimalAmount > 2 ? '1.2-' + c.DecimalAmount : '1.2'
                  ) +
                  ' (' +
                  this.decimalPipe.transform(c.perdiff, '1.2-2') +
                  '%)',
                //Changed by Rohit T. Asked by Parikshit K. 31-Jan-2021

                // watchlistColors = [
                //   '#00926C', //grreen
                //   '#0D654E', //darkgreen
                //   '#104437', //vdarkgreen
                //   '#85190E', //red
                //   '#B32E20', //darkred
                //   '#CD4E41', //vdarkred
                // ];
                bgColor:
                  parseFloat(c.perdiff) >= 0
                    ? parseFloat(c.perdiff) < 1.0
                      ? parseFloat(c.perdiff) >= 0.5
                        ? this.watchlistColors[1]
                        : this.watchlistColors[2]
                      : this.watchlistColors[0]
                    : parseFloat(c.perdiff) > -1.0
                    ? parseFloat(c.perdiff) >= -0.5
                      ? this.watchlistColors[3]
                      : this.watchlistColors[4]
                    : this.watchlistColors[5] || this.watchlistColors[0],

                data3: c.Note_Master_Id,
                data4: c.Exchange,
                data5: c.Type,
                //Added by Rohit T. Asked by Parikshit K. 31-Jan-2021
                color:
                  parseFloat(c.perdiff) >= 0
                    ? this.watchlistColors[0]
                    : this.watchlistColors[5],
                percentage: parseFloat(c.perdiff),
              };
              return obj;
            });
        } else {
          this.watchlistData = undefined;
          // this.FetchWatchListNames();
        }
      });
  }
}
