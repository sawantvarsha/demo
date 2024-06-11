import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
//Changed By MohanP | 04Feb22

@Component({
  selector: 'app-recommended-product-list',
  templateUrl: './recommended-product-list.component.html',
  styleUrls: ['./recommended-product-list.component.scss'],
})
export class RecommendedProductListComponent implements OnInit {
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;

  Customerid: any;
  RecommendedList: any[];
  TempRecommendedList: any[];
  AssetTempRecommendedList: any[];
  searchInput: any = '';
  duplicatelist: any[];
  showNoProductsMsg: boolean = false;

  selectedAssetVariable = 'notselected';
  mode = 'new';
  transactionType = 'All';
  filteredTab = 'All';
  totalCount = 0;
  filterTabs = [
    {
      title: 'STRONG SELL',
      value: 0,
    },
    {
      title: 'SELL',
      value: 0,
    },
    {
      title: 'NEUTRAL',
      value: 0,
    },
    {
      title: 'BUY',
      value: 0,
    },
    {
      title: 'STRONG BUY',
      value: 0,
    },
  ];

  assetClass = [
    {
      assetCls: 'All',
      isChecked: true,
      AssetCode: 'All',
    },
    {
      assetCls: 'Shares',
      isChecked: true,
      AssetCode: 'EQ',
    },
    {
      assetCls: 'Funds',
      isChecked: true,
      AssetCode: 'UT',
    },
    {
      assetCls: 'Bonds',
      isChecked: true,
      AssetCode: 'FI',
    },
    // {
    //   "assetCls" : "Mutual Funds",
    //   "isChecked" : false,
    //   "AssetCode": 'MF'
    // },
  ];
  selectedAsset = 'Shares';
  searchStringAsset = '';

  //Filters

  filterHeaderArray = [
    {
      columnName: 'Asset Class',
      isChecked: false,
    },
    {
      columnName: 'Sector',
      isChecked: false,
    },
    {
      columnName: 'Risk Rating',
      isChecked: false,
    },
  ];

  RiskRate = [];
  fileName = '';
  selectedAssetClasses: any;
  todaysDate: any;

  constructor(
    private afs: CustomerApiService,
    public commonApi: CommonApiService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.GetProductList();

    this.Customerid = sessionStorage.getItem('CustomerID');
    console.log(this.Customerid);

    this.todaysDate = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
  }

  loadProducts(searchInput) {
    this.showNoProductsMsg = false;
    console.log(searchInput);
    try {
      if (searchInput != '') {
        this.RecommendedList = [];
        // this.RecommendedList = this.duplicatelist.filter((it) => { return (it.PSL_Code.toUpperCase() == searchInput || it.PSL_Product_Name.toLowerCase() == searchInput) })
        this.RecommendedList = this.duplicatelist.filter((data) => {
          return (
            data.PSL_Product_Name.toLowerCase().indexOf(
              searchInput.toLowerCase()
            ) !== -1 ||
            data.PSL_Code.toString()
              .toLowerCase()
              .indexOf(searchInput.toString().toLowerCase()) !== -1
          );
        });
        if (this.RecommendedList.length == 0) {
          console.log('No Products Found');
          this.showNoProductsMsg = true;
        }
      } else if (searchInput == '') {
        console.log('hello');
        this.RecommendedList = this.duplicatelist;
        this.showNoProductsMsg = false;
      }
    } catch (error) {
      this.RecommendedList = this.duplicatelist;
    }
  }

  GetProductList() {
    this.afs.GetProductList().subscribe((res) => {
      if (res) {
        console.log(res);

        this.RecommendedList = res.GetProductListResult.filter((it) => {
          return (
            it.PSL_Active_YN == 'Y' && it.PSL_market_Sentiment != 'STRING BUY'
          );
        });
        this.duplicatelist = this.RecommendedList;
        this.TempRecommendedList = this.RecommendedList;

        // Changes by Ashwini H. by Mohan P. on 03 Feb 2022

        this.totalCount = this.RecommendedList.length;

        console.log('filter', this.filterTabs);

        let array = [];

        for (let item of this.RecommendedList) {
          if (item.PSL_Underlying_Risk_Rating != '') {
            array.push(item.PSL_Underlying_Risk_Rating);
            // console.log(array);
          }
        }
        var Arr = array;
        var mySet = new Set(array);
        Arr = [...mySet];
        console.log(Arr);

        for (let i = 0; i < Arr.length; i++) {
          this.RiskRate.push({
            columnName: Arr[i],
            isChecked: false,
          });
        }

        let setiment_array = [];

        for (let item of this.RecommendedList) {
          if (item.PSL_market_Sentiment != '') {
            setiment_array.push(item.PSL_market_Sentiment);
            // console.log(array);
          }
        }
        var ArrSentiment = setiment_array;
        var mySetiment = new Set(setiment_array);
        ArrSentiment = [...mySetiment];
        console.log(Arr);

        // this.filterTabs = [];
        // for(let i = 0; i< ArrSentiment.length; i++ ){
        //    this.filterTabs.push({
        //       "title" : ArrSentiment[i],
        //       "value" : 0
        //       });
        console.log('filter', this.filterTabs, ArrSentiment);
        // }

        this.filterTabs.forEach((f) => {
          f.value = this.RecommendedList.filter(
            (t) =>
              t.PSL_market_Sentiment.toUpperCase() === f.title.toUpperCase()
          ).length;
        });

        // this.filterTabs.sort((a,b) => a.title.localeCompare(b.title));
        this.RiskRate.sort((a, b) => a.columnName.localeCompare(b.columnName));
      }
    });
  }

  // Changes by Ashwini H. by Mohan P. on 03 Feb 2022

  selectFilter(selectedFilter) {
    this.filteredTab = selectedFilter;

    if (this.selectedAssetVariable === 'notselected') {
      if (this.filteredTab != 'All') {
        this.RecommendedList = this.duplicatelist.filter((data) => {
          return (
            data.PSL_market_Sentiment.toLowerCase() ===
            this.filteredTab.toLowerCase()
          );
        });

        this.TempRecommendedList = this.RecommendedList;
      } else if (this.filteredTab === 'All') {
        this.RecommendedList = this.duplicatelist;
        this.TempRecommendedList = this.duplicatelist;
      }
    } else if (this.selectedAssetVariable === 'selected') {
      if (this.filteredTab != 'All') {
        this.RecommendedList = this.AssetTempRecommendedList.filter((data) => {
          return (
            data.PSL_market_Sentiment.toLowerCase() ===
            this.filteredTab.toLowerCase()
          );
        });
        this.TempRecommendedList = this.duplicatelist.filter((data) => {
          return (
            data.PSL_market_Sentiment.toLowerCase() ===
            this.filteredTab.toLowerCase()
          );
        });
        // this.TempRecommendedList = this.RecommendedList;
      } else if (this.filteredTab === 'All') {
        this.RecommendedList = this.duplicatelist;
        this.TempRecommendedList = this.duplicatelist;
      }
    }
  }

  columnWiseFilter(event) {
    this.showNoProductsMsg = false;
    let value = event.target.value.toLowerCase();
    console.log('value', value, this.assetClass);

    if (this.searchInput != '') {
      this.RecommendedList = this.duplicatelist.filter((data) => {
        return (
          (data.PSL_Product_Name.toLowerCase().indexOf(value.toLowerCase()) !==
            -1 ||
            data.PSL_Code.toString()
              .toLowerCase()
              .indexOf(value.toString().toLowerCase()) !== -1) &&
          this.assetClass
            .filter((a) => a.isChecked)
            .map((a) => a.AssetCode)
            .includes(data.PSL_Asset_Class)
        );
      });
      if (this.RecommendedList.length === 0) {
        this.showNoProductsMsg = true;
      }
    } else if (this.searchInput === '') {
      this.RecommendedList = this.duplicatelist.filter((f) => {
        return this.assetClass
          .filter((a) => a.isChecked)
          .map((a) => a.AssetCode)
          .includes(f.PSL_Asset_Class);
      });
    }
    // this.changeAssetClassChecked()
    this.filterTabsCountUpdate();
  }

  changesAssetClass(event) {
    this.selectedAsset = event.target.value;
    let value;
    if (this.selectedAsset === 'Shares') {
      value = 'EQ';
    } else if (this.selectedAsset === 'Funds') {
      value = 'FI';
    } else if (this.selectedAsset === 'Bonds') {
      value = 'UT';
    } else if (this.selectedAsset === 'Mutual Funds') {
      value = 'MF';
    }

    console.log('value', value);

    if (value != '') {
      this.RecommendedList = this.duplicatelist.filter((data) => {
        return (
          data.PSL_Asset_Class.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      });
    } else if (value === '') {
      this.RecommendedList = this.duplicatelist;
    }
  }

  refresh() {
    this.RecommendedList = this.duplicatelist;
    this.showNoProductsMsg = false;
    this.searchInput = '';
    this.filteredTab = 'All';
    for (let i = 0; i < this.assetClass.length; i++) {
      this.assetClass[i].isChecked = true;
    }
  }

  filterSearch(event, parameter) {
    console.log('', event.target.value, parameter);
  }

  changeAssetClassChecked(asset, i) {
    console.log('checked', asset, i);

    this.assetClass[i].isChecked = !this.assetClass[i].isChecked;

    if (
      this.assetClass[i].assetCls === 'All' &&
      this.assetClass[i].isChecked === true
    ) {
      for (let i = 1; i < this.assetClass.length; i++) {
        this.assetClass[i].isChecked = true;
      }
      this.RecommendedList = this.duplicatelist;
    } else if (
      this.assetClass[i].assetCls === 'All' &&
      this.assetClass[i].isChecked === false
    ) {
      for (let i = 1; i < this.assetClass.length; i++) {
        this.assetClass[i].isChecked = false;
      }
    }

    if (this.assetClass[i].assetCls !== 'All') {
      this.assetClass[0].isChecked = false;
    }

    console.log('checked', this.assetClass);

    const checkedAssetCode = this.assetClass
      .filter((a) => a.isChecked)
      .map((c) => c.AssetCode.toUpperCase());

    if (checkedAssetCode.length === 3) {
      this.assetClass[0].isChecked = true;
    }
    // asset
    console.log('checkedAssetCode', checkedAssetCode);

    if (this.filteredTab === 'All') {
      if (checkedAssetCode.length !== 0) {
        this.selectedAssetVariable = 'selected';
        this.RecommendedList = this.duplicatelist.filter((d) =>
          checkedAssetCode.includes(d.PSL_Asset_Class.toUpperCase())
        );
        this.AssetTempRecommendedList = this.RecommendedList;
      } else if (
        checkedAssetCode.length === 0 ||
        checkedAssetCode === undefined
      ) {
        this.selectedAssetVariable = 'notselected';
        console.log('empty', this.RecommendedList);
        this.RecommendedList = this.duplicatelist;
        this.AssetTempRecommendedList = this.duplicatelist;
      }
    } else if (this.filteredTab !== 'All') {
      if (checkedAssetCode.length !== 0) {
        this.selectedAssetVariable = 'selected';
        this.RecommendedList = this.TempRecommendedList.filter((d) =>
          checkedAssetCode.includes(d.PSL_Asset_Class.toUpperCase())
        );

        this.AssetTempRecommendedList = this.duplicatelist.filter((d) =>
          checkedAssetCode.includes(d.PSL_Asset_Class.toUpperCase())
        );
        // this.TempRecommendedList = this.RecommendedList;
      } else if (
        checkedAssetCode.length === 0 ||
        checkedAssetCode === undefined
      ) {
        // this.selectedAssetVariable = 'notselected';
        console.log('empty', this.RecommendedList);
        this.RecommendedList = this.duplicatelist;
        // this.AssetTempRecommendedList = this.duplicatelist;
        // this.TempRecommendedList = this.duplicatelist;
      }
    }
    this.filterTabsCountUpdate();
  }

  accordion(i) {
    this.filterHeaderArray[i].isChecked = !this.filterHeaderArray[i].isChecked;
    console.log(this.filterHeaderArray);
  }

  exportToExcel() {
    const selectedAssetCode = this.assetClass
      .filter((a) => a.isChecked)
      .map((c) => c.assetCls);
    if (selectedAssetCode[0] === 'All') {
      this.selectedAssetClasses = 'Shares_Bonds_Funds';
    } else {
      this.selectedAssetClasses = selectedAssetCode.map((x) => x).join('_');
    }

    console.log(
      'Asset Class',
      this.assetClass,
      selectedAssetCode,
      this.selectedAssetClasses
    );
    this.fileName =
      'RecommendedProducts_' +
      this.filteredTab +
      '_' +
      this.selectedAssetClasses +
      '_' +
      this.todaysDate +
      '.xlsx';
    const element = document.getElementById('productlist-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

  filterTabsCountUpdate() {
    this.totalCount = this.RecommendedList.length;
    this.filterTabs.forEach((f) => {
      f.value = this.RecommendedList.filter(
        (t) => t.PSL_market_Sentiment.toUpperCase() === f.title.toUpperCase()
      ).length;
    });
  }
}
