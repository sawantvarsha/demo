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
  selector: 'app-common-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.scss'],
})
export class CommonCustomerSearchComponent implements OnInit, OnDestroy {
  @Output() sendCustomerDetails = new EventEmitter<any>();
  @Output() selectedCustomerValue = new EventEmitter<string>();
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

    // Subscription
    this.custOfRMSubscription = this.custApi.GetCustomersOfRMObserver.subscribe(
      (res: any) => {
        if (res.length) {
          this.customersOfRMArray = [];
          res.forEach((element) => {
            this.customersOfRMArray.push(element);
          });
          console.log('\nCustomers of RM: ', this.customersOfRMArray);
        }
      }
    );
    // this.workflowApi
    // .GetClientSummary(
    //   this.authApi.EntityID,
    //   this.authApi.UserName,
    //   this.homeApi.baseCCY
    // )
    // .subscribe((res) => {
    //   if (res.length !== 0) {
    //     let data: any[] = [];
    //     data = JSON.parse(res.GetRMPortalClientSummary_LCYEResult);
    //     this.customersOfRMArray = [];

    //     data.forEach((element) => {
    //       let obj = {
    //         CustomerID: element.CustomerID,
    //         CustomerName: element.LongName,
    //         EmailID: element.EmailId,
    //         RM: element.RelManager,
    //         CIF: element.CIF,
    //         Notemasterid: element.Notemasterid,
    //         Username: element.UserLogin,
    //       };
    //       this.customersOfRMArray.push(obj);
    //     });
    //   }
    // });

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
            // console.log(          "Selected Cust Details: ",          this.selectedCustomerDetails,          this.selectedCustomer        );
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
    this.portfolioList = [];
    this.accountList = [];
    this.CurrencyList = [];
    try {
      // const customer = $('.HoverSuggestion').data('customer');
      const customer = e;
      const customerID = customer.CustomerID;
      this.CustomerName = customer.CustomerName;

      // console.log("Customer ID: ", customerID);
      this.notional = 0;
      this.Units = 0;
      this.successMsg = '';
      this.sendCustomer = customer;
      this.selectedCustomer = customer.CustomerName || this.selectedCustomer;
      this.searchedCustomers = this.customersOfRMArray.filter((customer) => {
        // return mf.Name === fund;
        return customer.CustomerID === customerID;
      });
      this.custApi.GetCustProfileDetailsFromCustID(customerID);
      // console.log(this.searchMF);
      // this.selectedCustomer = "";
      this.showSuggestions =
        this.showSuggestions1 =
        this.showSuggestions2 =
          false;

      // this.nowname = this.data.Name;
    } catch (Error) {
      // console.log(Error);
    }
  }

  selectCustomer1(_e) {
    try {
      const customer = $('.HoverSuggestion').data('mf');
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
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
}
