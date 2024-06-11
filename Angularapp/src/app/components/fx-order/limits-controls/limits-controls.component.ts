import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApifunctionService } from '../apifunction.service';
import { Subscription } from 'rxjs';
import { CommonfunctionService } from '../commonfunction.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { Location } from '@angular/common';
import { CommonApiService } from 'src/app/services/common-api.service';
import { MultiRequestService } from 'src/app/services/multi-request.service';

@Component({
  selector: 'app-limits-controls',
  templateUrl: './limits-controls.component.html',
  styleUrls: ['./limits-controls.component.scss']
})
export class LimitsControlsComponent implements OnInit, OnDestroy {
  userType: any;
  isUserRM: boolean;
  Customer: any;
  CustomerID: any;
  CustomerName: any;
  transactionData: any[] = [];
  editField: string;
  headerOptions: any;
  public Displaymessage: any;
  public TransactionLimitData: ITransactionLimit[];
  public InputObj: ITransactionLimit[];
  public messagevisiblity: any = true;
  // apifunction: ApifunctionService;

  private transactionlimitSubscription: Subscription;
  private IUDtransactionlimitSubscription: Subscription;
  spreadMultiplier: string;
  showSpreadPopup = true;
  Spread: string;
  domainURL = environment.domainURL;
  addFlag: boolean;
  ccyList: any[] = [];
  TransactionLimitDataCopy: any[];
  loadFlag: boolean = true;

  constructor(
    public authApi: AuthService,
    public homeApi: HomeApiService,
    public location: Location,
    private afs: ApifunctionService,
    public cfs: CommonfunctionService,
    public com: CommonApiService,
    public multiApi: MultiRequestService

  ) {
    try {

      this.TransactionLimitDataOnLoad();
    }
    catch (error) {
      //console.log(error.message);

    }
  }

  ngOnDestroy() {
    if (this.transactionlimitSubscription !== undefined) {
      this.transactionlimitSubscription.unsubscribe();
    }
    if (this.IUDtransactionlimitSubscription !== undefined) {
      this.IUDtransactionlimitSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.userType = this.authApi.UserType;
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (!this.isUserRM) {
      this.Customer = this.homeApi.CustomerName;
      this.CustomerID = this.homeApi.CustomerId;
    }
    this.getCcyPairs();
    // this.TransactionLimitDataOnLoad();

    //     try {
    //       if(!this.isUserRM) {
    //         this.TransactionLimitDataOnLoad();
    //       }
    //     }
    //     catch (error) {
    // //console.log(error.message);

    //     }

    this.Spread = '0.00';
    this.afs.getConfigValue('TradingSwitch_FXTrading');
    this.afs.getConfigValue('SpreadMultiplier_FXTrading');
    this.cfs.showpopupspreadObserver.subscribe(_value => {
      this.showSpreadPopup = true;
    });
    this.cfs.spreadMultiplierObserver.subscribe(value => {
      this.spreadMultiplier = value;
      this.showSpreadPopup = true;
    });
    this.cfs.spreadvalueObserver.subscribe(value => {
      this.Spread = value;
    });

    this.transactionlimitSubscription = this.afs.transactionLimitsObserver.subscribe(res => {
      if (res) {
        try {
          console.log("TransactionLimitData", res);
          this.loadFlag = false;

          length = res.length;
          this.TransactionLimitData = this.TransactionLimitDataCopy = res;
          for (let i = 0; i < this.TransactionLimitData.length; i++) {
            this.TransactionLimitData[i].LimitAmount = this.cfs.FormatNumberPrecision(this.TransactionLimitData[i].LimitAmount);
            this.TransactionLimitData[i].Remaining_Daily_Limit = this.TransactionLimitData[i].Daily_Limit - this.TransactionLimitData[i].Utilised_Daily_Limit;
            this.TransactionLimitData[i].Daily_Limit = this.cfs.FormatNumberPrecision(this.TransactionLimitData[i].Daily_Limit);
            this.TransactionLimitData[i].Utilised_Daily_Limit = this.cfs.FormatNumberPrecision(this.TransactionLimitData[i].Utilised_Daily_Limit);
            this.TransactionLimitData[i].Remaining_Daily_Limit = this.cfs.FormatNumberPrecision(this.TransactionLimitData[i].Remaining_Daily_Limit);
            this.TransactionLimitData[i].editable = false;
          }
          if (this.isUserRM) {

          } else {
            this.TransactionLimitData = this.TransactionLimitData.filter(d => d.Cust_Code === this.Customer)
          }

        } catch (ex) {
          //console.log(ex);
        }

      }
    });
  }
  TransactionLimitDataOnLoad() {
    this.loadFlag = true;

    this.CustomerName = '';
    var elems = document.querySelectorAll(".errorCell");

    [].forEach.call(elems, function (el) {
      el.classList.remove("errorCell");
    });
    this.messagevisiblity = true;
    // var length;
    this.afs.getTransactionLimits();

  }

  getCcyPairs() {
    try {
      this.loadFlag = true;
      this.afs.getCcyPairsDetails('ASSET1', '', 'ASSET1_API', 'FXCAPI').subscribe(res => {
        if (res) {
          this.loadFlag = false;
          if (res.index === 'ASSET1_API') {
            this.ccyList = res.body;
            console.log("ccylist", this.ccyList);
          }
        }
      });
    } catch (error) {

    }
  }

  updateList(id: number, property: string, event: any) {
    var elems = document.querySelectorAll(".errorCell");

    [].forEach.call(elems, function (el) {
      el.classList.remove("errorCell");
    });
    this.messagevisiblity = true;
    var editField;
    if (property == 'LimitAmount') {
      editField = event.target.value;
      this.TransactionLimitData[id][property] = this.cfs.NotionalChange(event);
      // this.TransactionLimitData[id][property] = this.formatNotionalWithComma_Common(editField.replace(/\,/g, ""))
    } else if (property == 'Daily_Limit' || property == 'Utilised_Daily_Limit') {
      editField = event.target.value;
      this.TransactionLimitData[id][property] = this.cfs.NotionalChange(event);
      // this.TransactionLimitData[id]['Remaining_Daily_Limit'] = this.formatNotionalWithComma_Common(parseFloat(this.TransactionLimitData[id]['Daily_Limit'].toString().replace(/\,/g, "")) - parseFloat(this.TransactionLimitData[id]['Utilised_Daily_Limit'].toString().replace(/\,/g, "")));
      // this.TransactionLimitData[id]['Remaining_Daily_Limit'] = ((Number((this.TransactionLimitData[id]['Daily_Limit']).replace(/\,/g, "")) - Number((this.TransactionLimitData[id]['Utilised_Daily_Limit']).replace(/\,/g, ""))).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      this.TransactionLimitData[id].Remaining_Daily_Limit =
        this.cfs.FormatNumberPrecision(Number(this.cfs.UnformatNumberFromFloat(this.TransactionLimitData[id].Daily_Limit)) -
          Number(this.cfs.UnformatNumberFromFloat(this.TransactionLimitData[id].Utilised_Daily_Limit)));
    } else if (property == 'Cust_Code') {
      this.TransactionLimitData[id][property] = event.CustomerName;
    }
    else {
      editField = event.target.value;
      this.TransactionLimitData[id][property] = editField;
    }

    if (this.TransactionLimitData[id].TLInsertOrUpdateOrDelete == "") {
      this.TransactionLimitData[id].TLInsertOrUpdateOrDelete = "U";
    }

    //for checking uniquencess of ccyPair
    //var index;
    // var index = this.TransactionLimitData.findIndex(x => x.APS_Ccypair_Code == this.TransactionLimitData[id].APS_Ccypair_Code);

  }

  add() {
    var elems = document.querySelectorAll(".errorCell");
    this.addFlag = true;
    [].forEach.call(elems, function (el) {
      el.classList.remove("errorCell");
      el.classList.add("add");
    });
    this.messagevisiblity = true;
    this.TransactionLimitData.push({ "Limit_ID": 0, "Cust_Code": this.isUserRM ? '' : this.Customer, "LimitCcy": "", "LimitAmount": '', "Daily_Limit": '', "Utilised_Daily_Limit": '', "Remaining_Daily_Limit": '', "TLInsertOrUpdateOrDelete": "I", "editable": true });
    return false;
  }

  SaveDataInDB() {
    var elems = document.querySelectorAll(".errorCell");

    [].forEach.call(elems, function (el) {
      el.classList.remove("errorCell");
    });

    this.InputObj = [];
    this.messagevisiblity = true;
    this.Displaymessage = '';
    var len;
    len = this.TransactionLimitData.length;
    var InputLen;
    var validData = true;
    let tempArray = this.TransactionLimitData.slice();
    for (let i = 0; i < len; i++) {
      if (tempArray[i].TLInsertOrUpdateOrDelete != "") {
        if (tempArray[i].Cust_Code == '') {
          document.getElementsByClassName("Cust_Code")[i].classList.add("errorCell");
          validData = false;
        }
        if (tempArray[i].LimitCcy == '') {
          document.getElementsByClassName("LimitCcy")[i].classList.add("errorCell");
          validData = false;
        }
        if (tempArray[i].LimitAmount == '') {
          document.getElementsByClassName("LimitAmount")[i].classList.add("errorCell");
          validData = false;
        }
      }

      if (tempArray[i].TLInsertOrUpdateOrDelete != "") {
        if (tempArray[i].Utilised_Daily_Limit === "") {
          tempArray[i].Utilised_Daily_Limit = "0";
        }
        this.InputObj.push(tempArray[i]);
        InputLen = this.InputObj.length;
        this.InputObj[InputLen - 1].LimitAmount = (this.InputObj[InputLen - 1].LimitAmount.toString().replace(/\,/g, "").split(".")[0]);
        this.InputObj[InputLen - 1].Daily_Limit = (this.InputObj[InputLen - 1].Daily_Limit.toString().replace(/\,/g, "").split(".")[0]);
        this.InputObj[InputLen - 1].Utilised_Daily_Limit = (this.InputObj[InputLen - 1].Utilised_Daily_Limit.toString().replace(/\,/g, "").split(".")[0]);
        this.InputObj[InputLen - 1].Remaining_Daily_Limit = (this.InputObj[InputLen - 1].Remaining_Daily_Limit.toString().replace(/\,/g, "").split(".")[0]);
      }

    }
    if (!validData) {
      this.Displaymessage += "Invalid Data !!";
      this.messagevisiblity = false;
      return;
    }

    this.afs.InsertUpdateDeleteTransactionLimit(this.InputObj);
    this.afs.IUDTransactionLimitObserver.subscribe(res => {
      if (res) {
        try {
          //console.log(res);
          this.Displaymessage = "Data saved succesfully";
          this.TransactionLimitDataOnLoad();
          this.messagevisiblity = false;
          return;
        } catch (ex) {
          //console.log(ex);
        }

      }
    });
  }

  remove(id: any) {
    var elems = document.querySelectorAll(".errorCell");

    [].forEach.call(elems, function (el) {
      el.classList.remove("errorCell");
    });
    let tempArray = this.TransactionLimitData.slice();
    this.messagevisiblity = true;
    var obj = [];
    if (tempArray[id].TLInsertOrUpdateOrDelete != "I") {
      tempArray[id].TLInsertOrUpdateOrDelete = "D";
      tempArray[id].LimitAmount = tempArray[id].LimitAmount.toString().replace(/\,/g, "");
      tempArray[id].Daily_Limit = tempArray[id].Daily_Limit.toString().replace(/\,/g, "");
      tempArray[id].Utilised_Daily_Limit = tempArray[id].Utilised_Daily_Limit.toString().replace(/\,/g, "");
      tempArray[id].Remaining_Daily_Limit = tempArray[id].Remaining_Daily_Limit.toString().replace(/\,/g, "");
      obj.push(tempArray[id]);

      this.afs.InsertUpdateDeleteTransactionLimit(obj);
      this.IUDtransactionlimitSubscription == this.afs.IUDTransactionLimitObserver.subscribe(res => {
        if (res) {
          try {
            //console.log(res);
            this.Displaymessage = "Record removed succesfully";
            this.messagevisiblity = false;
          } catch (ex) {
            //console.log(ex);
          }

        }
      });
    }
    tempArray.splice(id, 1);
    this.TransactionLimitData = tempArray;
  }

  selectedCustomerValue1(e) {
    console.log(e);
    this.CustomerName = e.CustomerName.split('|')[0];
    this.CustomerID = e.CustomerID;
    this.Customer = e.CustomerName;
    let tempArray = [];
    let subArray = []
    tempArray = this.TransactionLimitData.slice();
    tempArray.forEach(element => {
      if (this.Customer === element.Cust_Code) {
        subArray.push(element);
      }
    });
    if (subArray.length > 0) {
      this.TransactionLimitData = subArray;
    } else {
      this.TransactionLimitData = subArray;
      this.messagevisiblity = false;
      this.Displaymessage = 'No records found.'
    }

  }

  back() {
    this.location.back();
  }

}

interface ITransactionLimit {
  Limit_ID: any;
  Cust_Code: any;
  LimitCcy: any;
  LimitAmount: any;
  Daily_Limit: any;
  Utilised_Daily_Limit: any;
  Remaining_Daily_Limit: any;
  TLInsertOrUpdateOrDelete: any;
  editable: boolean;

}
