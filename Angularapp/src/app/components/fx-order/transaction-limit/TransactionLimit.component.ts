/* eslint-disable @angular-eslint/component-selector */
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
  selector: 'app-TransactionLimit',
  templateUrl: 'TransactionLimit.component.html',
  styleUrls: ['TransactionLimit.component.css']
})

export class TransactionLimitComponent implements OnInit, OnDestroy {
  editField: string;
  headerOptions: any;
  public Displaymessage: any;
  public TransactionLimitData: ITransactionLimit[];
  public InputObj: ITransactionLimit[];
  public messagevisiblity: any = true;
  apifunction: ApifunctionService;

  private transactionlimitSubscription: Subscription;
  private IUDtransactionlimitSubscription: Subscription;
  spreadMultiplier: string;
  showSpreadPopup = true;
  Spread: string;
  domainURL = environment.domainURL;
  userType: any;
  isUserRM: boolean;
  Customer: any;
  CustomerID: any;
  CustomerName: any;
  transactionData: any[] = [];
  addFlag: boolean;
  ccyList: any[] = [];
  TransactionLimitDataCopy: any[];

  constructor(private afs: ApifunctionService,
    public cfs: CommonfunctionService,
    public authApi: AuthService,
    public homeApi: HomeApiService,
    public location: Location,
    public com: CommonApiService,
    public multiApi: MultiRequestService) {
    try {
      this.apifunction = afs;

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
  ngOnInit() {
    this.userType = this.authApi.UserType;
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    if (!this.isUserRM) {
      this.Customer = this.homeApi.CustomerName;
      this.CustomerID = this.homeApi.CustomerId;
    }

    this.getCcyPairs();

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
  }

  getCcyPairs() {
      try {
        this.apifunction.getCcyPairsDetails('ASSET1', '', 'ASSET1_API', 'FXCAPI').subscribe(res => {
          if(res) {
            if(res.index === 'ASSET1_API') {
              this.ccyList = res.body;
              console.log("ccylist", this.ccyList);
            }
          }
        });
      } catch (error) {
        
      }
  }


  TransactionLimitDataOnLoad() {
    var elems = document.querySelectorAll(".errorCell");

    [].forEach.call(elems, function (el) {
      el.classList.remove("errorCell");
    });
    this.messagevisiblity = true;
    var length;
    this.apifunction.getTransactionLimits();
    this.transactionlimitSubscription = this.apifunction.transactionLimitsObserver.subscribe(res => {
      if (res) {
        try {
          //console.log(res);
          length = res.length;
          this.TransactionLimitData = this.TransactionLimitDataCopy = res;
          for (let i = 0; i < length; i++) {
            this.TransactionLimitData[i].LimitAmount = this.formatNotionalWithComma_Common(Number(this.TransactionLimitData[i].LimitAmount.toString().replace(/\,/g, "")).toFixed(2));
            this.TransactionLimitData[i].Daily_Limit = this.formatNotionalWithComma_Common(Number(this.TransactionLimitData[i].Daily_Limit.toString().replace(/\,/g, "")).toFixed(2));
            this.TransactionLimitData[i].Utilised_Daily_Limit = this.formatNotionalWithComma_Common(Number(this.TransactionLimitData[i].Utilised_Daily_Limit.toString().replace(/\,/g, "")).toFixed(2));
            // this.TransactionLimitData[i].Remaining_Daily_Limit = this.formatNotionalWithComma_Common(Number(this.TransactionLimitData[i].Remaining_Daily_Limit.toString().replace(/\,/g, "")).toFixed(0));
            // this.TransactionLimitData[i].Remaining_Daily_Limit = this.formatNotionalWithComma_Common(parseFloat(this.TransactionLimitData[i]['Daily_Limit'].toString().replace(/\,/g, "")) - parseFloat(this.TransactionLimitData[i]['Utilised_Daily_Limit'].toString().replace(/\,/g, "")));
            this.TransactionLimitData[i].Remaining_Daily_Limit = ((Number(this.com.UnformatNumberwithcomma(this.TransactionLimitData[i]['Daily_Limit'])) - Number(this.com.UnformatNumberwithcomma(this.TransactionLimitData[i]['Utilised_Daily_Limit']))).toFixed(2).toString());
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

  updateList(id: number, property: string, event: any) {
    var elems = document.querySelectorAll(".errorCell");

    [].forEach.call(elems, function (el) {
      el.classList.remove("errorCell");
    });
    this.messagevisiblity = true;
    var editField;
    if (property == 'LimitAmount') {
      editField = event.target.value;
      this.TransactionLimitData[id][property] = this.FormatNotionalCommon(editField.replace(/\,/g, ""))
    } else if (property == 'Daily_Limit' || property == 'Utilised_Daily_Limit') {
      editField = event.target.value;
      this.TransactionLimitData[id][property] = this.FormatNotionalCommon(editField.replace(/\,/g, ""))
      // this.TransactionLimitData[id]['Remaining_Daily_Limit'] = this.formatNotionalWithComma_Common(parseFloat(this.TransactionLimitData[id]['Daily_Limit'].toString().replace(/\,/g, "")) - parseFloat(this.TransactionLimitData[id]['Utilised_Daily_Limit'].toString().replace(/\,/g, "")));
      this.TransactionLimitData[id]['Remaining_Daily_Limit'] = ((Number((this.TransactionLimitData[id]['Daily_Limit']).replace(/\,/g, "")) - Number((this.TransactionLimitData[id]['Utilised_Daily_Limit']).replace(/\,/g, ""))).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else if(property == 'Cust_Code'){
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

  remove(id: any) {
    var elems = document.querySelectorAll(".errorCell");

    [].forEach.call(elems, function (el) {
      el.classList.remove("errorCell");
    });

    this.messagevisiblity = true;
    var obj = [];
    if (this.TransactionLimitData[id].TLInsertOrUpdateOrDelete != "I") {
      this.TransactionLimitData[id].TLInsertOrUpdateOrDelete = "D";
      this.TransactionLimitData[id].LimitAmount = this.TransactionLimitData[id].LimitAmount.toString().replace(/\,/g, "");
      this.TransactionLimitData[id].Daily_Limit = this.TransactionLimitData[id].Daily_Limit.toString().replace(/\,/g, "");
      this.TransactionLimitData[id].Utilised_Daily_Limit = this.TransactionLimitData[id].Utilised_Daily_Limit.toString().replace(/\,/g, "");
      this.TransactionLimitData[id].Remaining_Daily_Limit = this.TransactionLimitData[id].Remaining_Daily_Limit.toString().replace(/\,/g, "");
      obj.push(this.TransactionLimitData[id]);

      this.apifunction.InsertUpdateDeleteTransactionLimit(obj);
      this.IUDtransactionlimitSubscription == this.apifunction.IUDTransactionLimitObserver.subscribe(res => {
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
    this.TransactionLimitData.splice(id, 1);
  }

  add() {
    var elems = document.querySelectorAll(".errorCell");
    this.addFlag = true;
    [].forEach.call(elems, function (el) {
      el.classList.remove("errorCell");
      el.classList.add("add");
    });
    this.messagevisiblity = true;
    this.TransactionLimitData.push({ "Limit_ID": 0, "Cust_Code": "", "LimitCcy": "", "LimitAmount": '', "Daily_Limit": '', "Utilised_Daily_Limit": '', "Remaining_Daily_Limit": '', "TLInsertOrUpdateOrDelete": "I", "editable": true });
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

    for (let i = 0; i < len; i++) {
      if (this.TransactionLimitData[i].TLInsertOrUpdateOrDelete != "") {
        if (this.TransactionLimitData[i].Cust_Code == '') {
          document.getElementsByClassName("Cust_Code")[i].classList.add("errorCell");
          validData = false;
        }
        if (this.TransactionLimitData[i].LimitCcy == '') {
          document.getElementsByClassName("LimitCcy")[i].classList.add("errorCell");
          validData = false;
        }
        if (this.TransactionLimitData[i].LimitAmount == '') {
          document.getElementsByClassName("LimitAmount")[i].classList.add("errorCell");
          validData = false;
        }
      }

      if (this.TransactionLimitData[i].TLInsertOrUpdateOrDelete != "") {
        if (this.TransactionLimitData[i].Utilised_Daily_Limit === "") {
          this.TransactionLimitData[i].Utilised_Daily_Limit = "0";
        }
        this.InputObj.push(this.TransactionLimitData[i]);
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

    this.apifunction.InsertUpdateDeleteTransactionLimit(this.InputObj);
    this.apifunction.IUDTransactionLimitObserver.subscribe(res => {
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

  formatNotionalWithComma_Common(n: any) {
    if (n == "") {
      var val = n;
      var parts = val.toString();
      return parts;
    } else {
      var val = n;
      var parts = val.toString();
      var num = parts.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return num;
    }
  }

  //for formatting
  onlyNumeric(evt) { // With one decimal for notional like 2.5k
    //
    try {
      //No special characters allowed, only single dot is allowed, (k,m,b) allowed, used for fields like Contract amounts
      var event = evt;

      var iKeyCode = (evt.which) ? evt.which : evt.keyCode

      if (iKeyCode == 9) {
        return true;
      } else if (event.keyCode == 65 && event.ctrlKey) {
        event.target.select();
      } else {
        if (!evt.shiftKey) {
          if ((evt.target.value == "" || (evt.target.selectionStart) == 0) && (iKeyCode == 110 || iKeyCode == 190 || (iKeyCode == 66 || ((iKeyCode == 75) || (iKeyCode == 77))))) {
            return false;
          } else if (((iKeyCode >= 48) && (iKeyCode <= 57)) || ((iKeyCode >= 96) && (iKeyCode <= 105)) || iKeyCode == 110 || iKeyCode == 190 || iKeyCode == 8 || iKeyCode == 46 || iKeyCode == 66 || ((iKeyCode == 75) || (iKeyCode == 77)) || ((iKeyCode >= 37) && (iKeyCode <= 40))) {
            if ((iKeyCode == 66 || ((iKeyCode == 75) || (iKeyCode == 77))) && ((evt.target.selectionEnd != evt.target.value.length) || (evt.target.value[(evt.target.selectionEnd) - 1]) == ".")) {
              return false;
            }
            if ((evt.target.value).indexOf('.') > -1 && (iKeyCode == 110 || iKeyCode == 190)) {
              return false;
            } else if (((evt.target.value).indexOf('k') > -1 || (evt.target.value).indexOf('m') > -1 || (evt.target.value).indexOf('b') > -1)) {
              if (iKeyCode == 46 || iKeyCode == 8) {
                evt.target.value = evt.target.value.substring(0, evt.target.value.length - 1)
                return true;
              }
              return false;
            } else if (iKeyCode == 46) {
              evt.target.value = evt.target.value.substring(0, evt.target.value.length - 1)
            }
            return true;
          } else {
            return false;
          }
        } else if (iKeyCode == 37 || iKeyCode == 39) {
          return true;
        } else {
          return false;
        }
      } //END
    } catch (error) {
      //console.log(error.message);
    } finally {
      iKeyCode = "";
    }
  }



  FormatNotionalCommon(notional: any) {

    var rel_Amount = /\d+(K$(?![K|M|B])|M$(?![K|M|B])|B$(?![K|M|B]))/i;
    var rel_Char = /(K|M|B)/i;
    var pos;
    var number;
    var rel_invalidChar = /[\#|\@|!|\&|\*|\%|\\|\+|\*|\^]/;

    try {
      if (notional.search(rel_invalidChar) != -1) {
        return "";
      }

      if ((notional.search(rel_Amount) === -1)) {
        if (notional != "" && notional.search(',') == -1) {
          number = parseFloat(notional)
          return number.toLocaleString();

        } else {
          return "";
        }
      }

      if (notional.search(rel_Amount) != -1) {
        if ((notional.search('K') != -1) || (notional.search('k') != -1)) {
          pos = notional.search(rel_Char);
          if (pos != 0) {
            number = notional.substring(0, pos);
            number = number * 1000;
          } else {
            return "";
          }
          return number.toLocaleString();
        }
        if ((notional.search('M') != -1) || (notional.search('m') != -1)) {
          pos = notional.search(rel_Char);
          if (pos != 0) {
            number = notional.substring(0, pos);
            number = number * 1000000;
          } else {
            return "";
          }
          return number.toLocaleString();
        }
        if ((notional.search('B') != -1) || (notional.search('b') != -1)) {
          pos = notional.search(rel_Char);
          if (pos != 0) {
            number = notional.substring(0, pos);
            number = number * 1000000000;
          } else {
            if (notional.search(/[A-Z]/i) != -1)
              return "";
            return "";
          }
          return number.toLocaleString();
        }
      } else {
        if (notional.search(/[A-Z]/i) != -1) {
          return "";
        } else {
          return notional;
        }
      }
    } catch (error) {
      return "";
    } finally {

    }
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
      if(this.Customer === element.Cust_Code) {
        subArray.push(element);
      }
    });
    if(subArray.length > 0) {
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
  Limit_ID: Number;
  Cust_Code: string;
  LimitCcy: string;
  LimitAmount: string;
  Daily_Limit: string;
  Utilised_Daily_Limit: string;
  Remaining_Daily_Limit: string;
  TLInsertOrUpdateOrDelete: string;
  editable: boolean;

}
