import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
})
export class WatchlistComponent implements OnInit {
  isProd = environment.production;
  expandToggle = true;
  watchlistPlaceholder: string;

  @Output() newItemEvent = new EventEmitter<{
    value: string;
    indexExpandViewToggle: boolean;
    watchlistRecord: any;
  }>();
  @Output() selectWatchlistDataEvent = new EventEmitter<any>();
  @Output() selectWatchlistSearchItemEvent = new EventEmitter<any>();
  @Output() deleteWatchlistShare = new EventEmitter<any>();
  watchlistSearchItems: any;
  filteredWatchlistSearchItems: any;
  heatmapWatchlistData: any;
  sortedWatchlist: any;
  isNewWatchlist: any;
  activeShareIndex: any;
  selectedProduct: any;
  //Changed by MohanP | 03feb22
  @Input() get AddNewWatchList(): any {
    return this.isNewWatchlist;
  }
  set AddNewWatchList(AddNewWatchList: any) {
    this.isNewWatchlist = AddNewWatchList;
  }

  @Input() get WatchlistData(): any {
    return this.watchlistData;
  }
  // Changed by Rohit T. Asked by Mohan P. 31-Jan-2021
  set WatchlistData(WatchlistData: any) {
    this.watchlistData = WatchlistData;
    // console.log(this.watchlistData)
    this.sortedWatchlist = WatchlistData;
    this.heatmapWatchlistData = this.sortedWatchlist?.sort(
      (a, b) => b.percentage - a.percentage
    ); //added Validations by Uddesh
    // console.log(this.heatmapWatchlistData)

    // this.watchlistData.forEach((w) => {
    //   w.bgColor =
    //     w.data1 <= 0
    //       ? w.data1 < 1 && w.data1 >= 0.5
    //         ? w.data1 < 0.5 && w.data1 >= 1
    //           ? this.watchlistColors[2]
    //           : this.watchlistColors[4]
    //         : this.watchlistColors[5]
    //       : this.watchlistColors[0];
    //   return w;
    // });

    console.log('watchlist', this.watchlistData);
    if (this.watchlistData == undefined) {
      this.emptylist = true;
    } else {
      this.emptylist = false;
    }
  }
  @Input() get WatchlistSearchItems(): any {
    return this.watchlistSearchItems;
  }

  set WatchlistSearchItems(WatchlistSearchItems: any) {
    this.watchlistSearchItems = WatchlistSearchItems;

    // this.watchlistSearchItems.forEach((w) => {
    //   w.bgColor =
    //     w.data1 <= 0
    //       ? w.data1 < 1 && w.data1 >= 0.5
    //         ? w.data1 < 0.5 && w.data1 >= 1
    //           ? this.watchlistColors[2]
    //           : this.watchlistColors[4]
    //         : this.watchlistColors[5]
    //       : this.watchlistColors[0];
    //   return w;
    // });

    console.log('watchlist', this.watchlistSearchItems);
  }
  @Input() Page: any;
  watchlistList = ['W1', 'W2', 'W3', 'W4', 'W5'];
  selectedWatchlist = 'W1';
  changeRowToggle: any = []; //toggle for showing buy cell rowwise
  // Changed by Rohit T. Asked by Mohan P. 31-Jan-2021
  watchlistToggle = false; //toggle for table and heatmap view
  showSearchPopup = false; //toggle for search popup
  selectedSearchTab = 'All';

  showSettingPopup = false; //for setting popup
  addIconToggle = false;

  changeNo = -0.5;
  changeNoHigh = -0.6;
  changeNoLow = -0.99;
  // Changed by Rohit T. Asked by Mohan P. 31-Jan-2021
  watchlistColors = [
    '#00926C', //grreen
    '#0D654E', //darkgreen
    '#104437', //vdarkgreen
    '#85190E', //red
    '#B32E20', //darkred
    '#CD4E41', //vdarkred
  ];
  watchlistData: any[];
  searchKey: any;
  watchlistExpandViewToggle: boolean = true; //for expand functionality
  showBuySell = false;
  showSuggestions: boolean;
  emptylist: boolean;
  constructor(public commonApi: CommonApiService) {
    this.watchlistPlaceholder = 'Search';
    this.showSuggestions = false;
    this.searchKey = '';
    this.emptylist = false;
  }

  selectedWatchlistRecord: any;
  watchlist = [
    {
      EquityName: 'COALINDIA.NS',
      LongName: 'Coal India Limited',
      LTP: '169.20',
      Change: '-1.55 (-0.91%)',
      ChangeinPer: -0.91,
      color: '',
      bgColor: '',
    },
  ];
  ngOnInit(): void {
    console.log(this.Page);
    console.log('watchlistadata', this.watchlistData);
    this.toggleHeatmap();
  }

  addNewItem(
    value: string,
    indexExpandViewToggle: boolean,
    watchlistRecord: any
  ) {
    this.newItemEvent.emit({ value, indexExpandViewToggle, watchlistRecord });
  }

  changerow(index: any) {
    for (let i = 0; i < this.watchlistData.length; i++) {
      this.changeRowToggle[i] = false;
    }
    this.changeRowToggle[index] = true;
  }

  invertRowToggle() {
    for (let i = 0; i < this.watchlistData.length; i++) {
      this.changeRowToggle[i] = false;
    }
  }

  addWatchlist(_event: any) {}

  selectWatchlistData(wld) {
    this.selectWatchlistDataEvent.emit(wld);
  }
  selectWatchlistSearchItem(searchItem) {
    this.showSuggestions = false;
    this.selectWatchlistSearchItemEvent.emit(searchItem);
    this.searchKey = '';
  }
  searchWatchListItems() {
    if (this.searchKey?.length > 2) {
      this.showSuggestions = true;
      this.filteredWatchlistSearchItems = this.watchlistSearchItems.filter(
        (item) =>
          item.id.toLowerCase().includes(this.searchKey.toLowerCase()) ||
          item.value.toLowerCase().includes(this.searchKey.toLowerCase())
      );
      console.log('filterd products', this.filteredWatchlistSearchItems);
      this.activeShareIndex = 0;
      this.selectShare();
    } else {
      this.showSuggestions = false;
    }
  }

  closePopups() {
    this.showSuggestions = false;
  }

  DeleteSharefromWatchlist(item: any) {
    console.log('delete item', item);
    this.deleteWatchlistShare.emit(item);
  }
  // Changed by Rohit T. Asked by Mohan P. 31-Jan-2021
  toggleList() {
    this.watchlistToggle = true;
  }

  toggleHeatmap() {
    this.watchlistToggle = false;
  }
  changeSearchIndex(dir) {
    switch (dir) {
      case 'DOWN':
        this.activeShareIndex =
          this.filteredWatchlistSearchItems.length - 1 === this.activeShareIndex
            ? 0
            : this.activeShareIndex + 1;

        break;
      case 'UP':
        this.activeShareIndex =
          this.activeShareIndex > 0
            ? this.activeShareIndex - 1
            : this.filteredWatchlistSearchItems.length - 1;

        break;

      default:
        break;
    }
    this.selectShare();
    this.commonApi.ScrollTo('.productSuggestion', '.active-item', 'down');

    console.log(this.filteredWatchlistSearchItems);
  }
  selectShare() {
    this.filteredWatchlistSearchItems.forEach((s, i) => {
      s.active = false;
      if (i === this.activeShareIndex) {
        s.active = true;
      }
    });
    this.selectedProduct = this.filteredWatchlistSearchItems.filter(
      (s) => s.active
    )[0];
  }
}
