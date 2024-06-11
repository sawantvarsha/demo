import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Input,
  OnDestroy,
} from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { HomeApiService } from 'src/app/services/home-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-multi-selection-customer-search',
  templateUrl: './multi-selection-customer-search.component.html',
  styleUrls: ['./multi-selection-customer-search.component.scss'],
})
export class MultiSelectionCustomerSearchComponent
  implements OnInit, OnDestroy
{
  @Output() sendCustomerDetails = new EventEmitter<any>();
  @Output() selectedCustomerValue = new EventEmitter<string>();
  @Output() selectedArray = new EventEmitter<any>();

  //17 Feb 2022
  @Output() newCustomerArray = new EventEmitter<any>();

  @Output() CustomerDetailsArray = new EventEmitter<any>();
  @Input() DefaultValue: Subject<string>;

  userType: string;
  isUserRM: boolean;
  username: string;
  customersOfRMArray: any = [];
  portfolioList: any = [];
  selectedCustomerDetails: any = [];
  accountList: any = [];
  CurrencyList: any = [];
  portfolioAccount: any = [];
  portfolio: any;
  Account_Number: any;
  CustomerName: any;
  notional: number;
  Units: number;
  successMsg: string;
  selectedCustomer: any;
  searchedCustomers: any = [];
  showSuggestions: boolean;
  showSuggestions1: boolean;
  showSuggestions2: boolean;
  selectedCustomerIndex = 0;
  sendCustomer: any;
  selectedCust: any;
  defaultValueSubscription: Subscription;
  custOfRMSubscription: Subscription;
  custProfileFromCustIDSubscription: Subscription;
  isProfileCreated: boolean;
  customerProfiles: any;
  CustomerDisplayName: any;
  Customerid: any;

  selectedCustomerArray: any = [];
  showSelectedCustomer = false;
  checkedStatusCust: any = [];
  selectedCustomerArrayNew: any = [];

  constructor(
    private elem: ElementRef,
    public cfs: CommonApiService,
    private custApi: CustomerApiService,
    private homeApi: HomeApiService,
    private authApi: AuthService
  ) {
    this.customerProfiles = [];
  }
  ngOnDestroy() {
    // start - Added by Nilam V on 15-June-21
    if (this.defaultValueSubscription !== undefined) {
      this.defaultValueSubscription.unsubscribe();
    }
    if (this.custOfRMSubscription !== undefined) {
      this.custOfRMSubscription.unsubscribe();
    }
    if (this.custProfileFromCustIDSubscription !== undefined) {
      this.custProfileFromCustIDSubscription.unsubscribe();
      this.custApi.GetCustProfileFromCustID.next([]);
    }
    // End
  }
  ngOnInit(): void {
    this.userType = this.authApi.UserType;
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    this.username = this.authApi.UserName;

    this.custApi.getCustomersOfRM(this.username);

    // for(let i = 0; i < 10; i++){
    //   this.checkedStatusCust[i] = false;
    // }

    // Subscription
    this.custOfRMSubscription = this.custApi.GetCustomersOfRMObserver.subscribe(
      (res: any) => {
        if (res.length) {
          this.customersOfRMArray = [];
          res.forEach((element) => {
            this.customersOfRMArray.push(element);

            this.customersOfRMArray.forEach((a) => {
              a.CustFlag = false;
            });
            this.CustomerDetailsArray.emit(this.customersOfRMArray);

            this.checkedStatusCust.push({
              flag: false,
              cust: element,
            });
          });
          // console.log("\nCustomers of RM: ", this.customersOfRMArray);
        }
      }
    );

    this.custProfileFromCustIDSubscription =
      this.custApi.GetCustProfileFromCustIDObserver.subscribe((res: any) => {
        if (res.length) {
          if (res.length > 0) {
            this.selectedCustomerDetails = [];
            this.customerProfiles = res;
            const map = new Map();
            for (const item of res) {
              if (!map.has(item.PortfolioName)) {
                map.set(item.PortfolioName, true); // set any value to Map
                this.portfolioList.push(item.PortfolioName);
              }
            }
            res.forEach((element) => {
              this.selectedCustomerDetails.push(element);
              this.accountList.push(element.AccountNo);
              this.CurrencyList.push(element.SICurrency);
              this.portfolioAccount.push(
                element.PortfolioName,
                element.AccountNo,
                element.SICurrency
              );
            });
            this.portfolio = this.portfolioList[0];
            this.Account_Number = this.accountList[0];
            this.homeApi.Profiles.PortfolioDetails = this.customerProfiles
              .filter((c) => c.AccountNo !== null)
              .map(
                (c) =>
                  new Object({
                    Portfoio: c.PortfolioName,
                    AccountNumber: c.AccountNo,
                    Currency: c.SICurrency,
                  })
              );
            this.homeApi.CustomerName = this.sendCustomer.CustomerName;
            // console.log(          "Selected Cust Details: ",          this.selectedCustomerDetails  );
            // this.updateCcy();
            this.sendCustomerDetails.emit(this.selectedCustomerDetails);
            this.selectedCustomerValue.emit(this.sendCustomer);
            // this.custApi.sendCustomerDetails(this.selectedCustomerDetails);
          } else {
            this.selectedCustomerValue.emit(this.sendCustomer); // Added by Nilam V on 16-June-2021
          }
        } else {
          this.sendCustomerDetails.emit('');
        }
      });
    // Added by Nilam V on 15-June-21
    setTimeout(() => {
      if (this.DefaultValue !== undefined) {
        this.defaultValueSubscription = this.DefaultValue.subscribe((value) => {
          if (value) {
            this.selectedCustomer = value;
          }
        });
      }
    }, 500);

    // End
  }

  selectCustomer(e) {
    this.selectedCustomer = '';

    this.portfolioList = [];
    this.accountList = [];
    this.CurrencyList = [];
    try {
      // const customer = $('.HoverSuggestion').data('customer');
      const customer = e;
      const customerID = customer.CustomerID;
      this.CustomerName = customer.CustomerName;

      let alreadyExistFlag = false;
      // console.log("Customer ID: ", customerID);
      this.notional = 0;
      this.Units = 0;
      this.successMsg = '';
      this.sendCustomer = customer;
      // this.selectedCustomer = customer.CustomerName || this.selectedCustomer;

      // changes for multicheckbox on 2 Feb 2022   revert on 17 Feb 2022

      this.selectedCustomerArrayNew.forEach((element) => {
        if (element.CustomerID === customer.CustomerID) {
          console.log('already exits');
          alreadyExistFlag = true;
        }
      });

      if (alreadyExistFlag) {
        console.log('already exits');
      } else {
        this.selectedCustomerArray.push(customer.CustomerName);
        this.selectedArray.emit(this.selectedCustomerArray);

        this.selectedCustomerArrayNew.push({
          CustomerID: customer.CustomerID,
          CustomerName: customer.CustomerName,
          EmailId: customer.EmailID,
          RMName: customer.RM,
        });

        this.newCustomerArray.emit(this.selectedCustomerArrayNew);
      }

      console.log(
        'multi select',
        this.selectedCustomerArray,
        this.selectedCustomerArrayNew
      );

      // const selectedCustArray = this.customersOfRMArray.filter((customer) => {
      //   return customer.CustomerName === customer.CustomerName;
      // });

      // console.log("selected customer list", this.selectedCustomerArray);

      // this.searchedCustomers = this.customersOfRMArray.filter((customer) => {
      //   return customer.CustomerName === customer;
      // });     //on 17 Feb

      this.custApi.GetCustProfileDetailsFromCustID(customerID);

      // 31 Jan 2022 change for multi-checkbox
      this.showSuggestions =
        this.showSuggestions1 =
        this.showSuggestions2 =
          false;
    } catch (Error) {
      // console.log(Error);
    }
  }

  selectCustomer1(_e) {
    try {
      console.log('on click', _e);
      const customer = $('.HoverSuggestion').data('mf');

      this.searchedCustomers = this.customersOfRMArray.filter((customer) => {
        return customer.CustomerName === customer;
      });

      for (let i = 0; i < this.customersOfRMArray.length; i++) {
        if (this.customersOfRMArray[i].CustomerName === customer) {
          this.selectedCust = this.customersOfRMArray[i];
        }
      }
      if (customer === '') {
        this.selectCustomer('');
      } else {
        this.selectCustomer(this.selectedCust);
      }

      this.successMsg = '';
      this.Units = 0;
      this.notional = 0;
      this.PortfolioChange();
    } catch (Error) {
      // this.custApifunction.log(4, Error, 'share-component.component.ts', 'selectShare()');
    }
  }
  PortfolioChange() {
    throw new Error('Method not implemented.');
  }

  onClickedOutside(_e: Event) {
    try {
      this.showSuggestions = false;
      // this.showSelectedCustomer = true;  chage for multicheckbox
      // //console.log('Clicked outside:', e);
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  ChangeIndex(_e) {
    try {
      this.selectedCustomerIndex = 0;
      this.selectedCustomerIndex = 0;
      this.selectedCustomerIndex = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
      // this.custApifunction.log(4, Error, 'share-component.component.ts', 'ChangeIndex()');
    }
  }

  clearSelectedCustomerList(customerName, index) {
    console.log('customer..', customerName, index);
    this.showSelectedCustomer = !this.showSelectedCustomer;

    //Changes on 08 Feb 2022 by Ashwini H. for deleting selected customer

    this.selectedCustomerArray.splice(index, 1);
    this.selectedArray.emit(this.selectedCustomerArray);

    this.selectedCustomerArrayNew.splice(index, 1);
    this.newCustomerArray.emit(this.selectedCustomerArrayNew);

    console.log(
      'after delete',
      this.selectedCustomerArray,
      this.selectedCustomerArrayNew
    );
  }

  checkedCustomer(customer: any, i: any) {
    const customer1 = customer;
    // const customerID = customer1.CustomerID;
    this.CustomerName = customer1.CustomerName;

    // console.log("compare", this.checkedStatusCust[i].cust.CustomerName ,this.CustomerName)
    if (this.customersOfRMArray[i].CustFlag === true) {
      // this.checkedStatusCust[i].flag = false;

      this.customersOfRMArray[i].CustFlag = false;
      this.CustomerDetailsArray.emit(this.customersOfRMArray);
      this.clearSelectedCustomerList(this.CustomerName, i);
    } else if (this.customersOfRMArray[i].CustFlag === false) {
      // this.checkedStatusCust[i].flag = true;

      this.customersOfRMArray[i].CustFlag = true;
      this.CustomerDetailsArray.emit(this.customersOfRMArray);

      this.sendCustomer = customer;

      this.selectedCustomerArray.push(customer.CustomerName);
      this.selectedArray.emit(this.selectedCustomerArray);
      // console.log("select", this.selectedCustomerArray)
    }
    // console.log("checked", this.checkedStatusCust);
  }
}
