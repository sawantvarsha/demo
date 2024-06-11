import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sip-details',
  templateUrl: './sip-details.component.html',
  styleUrls: ['./sip-details.component.scss']
})
export class SipDetailsComponent implements OnInit {
  IsBackButtonEnabled: boolean;
  showSIPDetails: boolean = false;
  isUserRM: boolean;
  CustomerID: any;
  CustomerName: any;
  CIF: any;
  username: any;
  EntityId: any;
  LoginId: any;
  SipDetails: any[] = [];
  SipData: any[] = [];
  index: any;
  sipDates: any[] = [];
  totalSIP: number;
  SipOverview: any;
  isActive: any;
  showPauseActions: boolean;
  NoteMasterID: any;
  SIPName: any;
  baseCcy: any;
  loader: boolean;
  loaderDates: boolean;
  actionResult: any;
  //Added by Uddesh on 2 Feb 2022
  pauseDatesArray: any[];
  PauseSIPDates: any[];
  pausedDates: any;
  openActiveAction: boolean;
  ActiveSIPDates: any[];
  MFlist: boolean = false;
  SIPdatestoggle: boolean = true;
  fundsData: any[]; //Added by Alolika G | 14-02-2022
  getFundsData: any[];
  constructor(private homeApi: HomeApiService,
    private custApi: CustomerApiService,
    public location: Location,
    private authapi: AuthService,) {
    this.showPauseActions = false;
    this.pauseDatesArray = [];
  }

  ngOnInit(): void {
    this.IsBackButtonEnabled = this.homeApi.RediretToHomeBuySellPledge === '' ? false : true;
    this.isUserRM = this.authapi.UserType.toUpperCase().includes('RM') ? true : false;
    this.EntityId = this.authapi.EntityID;
    if (!this.isUserRM) {
      try {

        this.CustomerID = this.homeApi.CustomerId;
        this.CustomerName = this.homeApi.CustomerName;
        this.CIF = this.homeApi.CIF;
        this.username = this.homeApi.CustomerName.split('|')[0];
        this.LoginId = this.authapi.UserName;
        this.NoteMasterID = Number(sessionStorage.getItem('NoteMasterID'));
        this.custApi.getBankBaseCCYOBS.subscribe(() => {
          this.baseCcy = this.custApi.bankBaseCCY;
          this.getSIPOverview();
          this.getSipDetails(0);
        })

      } catch (EX) {
        console.log(EX);
      }
    }





  }

  //--Changes done by AlolikaG on 1st Feb 2022. Assigned by Parikshit K. --START

  getSIPOverview() {
    this.loader = true;
    try {
      let paramList = []
      let SPName = "USP_CustSIPOverview"
      paramList.push({
        "Param1": "FINIQ_COMMON"
      },
        {
          "Param1": "@CustomerID",
          "Param2": this.CustomerID
        },
        {
          "Param1": "@EntityID",
          "Param2": this.EntityId
        },
        {
          "Param1": "@LoginUser",
          "Param2": this.LoginId
        },
        {
          "Param1": "@ccy",
          "Param2": this.baseCcy
        })
      this.homeApi.SIPGenericStoredProcedure(SPName, paramList).subscribe(res => {
        if (res) {
          this.loader = false;

          this.SipOverview = [];
          this.SipOverview = res.ExecGenericStoredProcedureResult[0];

        }
      })
      // this.homeApi.getSIPOverview(this.CustomerID, this.EntityId, this.LoginId, this.baseCcy).subscribe(res => {
      //   if (res) {
      //     this.loader = false;
      //     this.SipOverview = [];
      //     this.SipOverview = res.ExecGenericStoredProcedureResult[0];
      //   }
      // })
    } catch (error) {

    }
  }

  getSipDetails(i) {
    try {
      let paramList = []
      let SPName = "USP_CustSIPDetails"
      paramList.push({
        "Param1": "FINIQ_COMMON"
      },
        {
          "Param1": "@CustomerID",
          "Param2": this.CustomerID
        },
        {
          "Param1": "@EntityID",
          "Param2": this.EntityId
        },
        {
          "Param1": "@LoginUser",
          "Param2": this.LoginId
        },
        {
          "Param1": "@ccy",
          "Param2": this.baseCcy
        })
      this.homeApi.SIPGenericStoredProcedure(SPName, paramList).subscribe(res => {
        if (res) {
          this.loader = false;
          this.SipDetails = [];
          this.SipDetails = res.ExecGenericStoredProcedureResult;
          this.showDetails(this.SipDetails[i], i);
          // this.showUnderlying(this.SipDetails[i], i); //Added by Alolika G | 14-02-2022
        }
      })
      // this.homeApi.getSIPDetails(this.CustomerID, this.EntityId, this.LoginId, this.baseCcy).subscribe(res => {
      //   if (res) {
      //     this.SipDetails = [];
      //     this.SipDetails = res.ExecGenericStoredProcedureResult;
      //     this.showDetails(this.SipDetails[i], i);
      //     // this.showUnderlying(this.SipDetails[i], i); //Added by Alolika G | 14-02-2022
      //   }
      // })
    } catch (error) {

    }
  }

  showDetails(item, i) {
    this.isActive = i;
    this.showSIPDetails = true;
    this.SipData = [];
    this.SipData = item;
    this.index = i;
    console.log("this.SipData", this.SipData , i);
    this.getImpDates(item.Param16);
    this.NoteMasterID = item.Param16;
    this.SIPName = item.Param1;
    this.getSIPFundDetails();
    // this.showUnderlying(item, i);

  }

  // Added by Alolika G on 17-02-2022
  getSIPFundDetails() {
    try {
      let paramList = []
      let SPName = "USP_SIPFundDetails"
      paramList.push({
        "Param1": "FINIQ_COMMON"
      },
      {
        "Param1": "@CustomerID",
        "Param2": this.CustomerID
      },
      {
        "Param1": "@EntityID",
        "Param2": this.EntityId
      },
      {
        "Param1": "@LoginUser",
        "Param2": this.LoginId
      },
       {
        "Param1": "@ccy",
        "Param2": this.baseCcy
      })
      this.homeApi.getMFExecGenericStoredProcedure(SPName, paramList).subscribe(res => {
        if(res) {
          this.getFundsData = [];
          this.fundsData
          const Fundetails: any = {};
          // let tempFundsData = res.ExecGenericStoredProcedureResult[0].GenericResponse;
          let tempFundsData = res.ExecGenericStoredProcedureResult;
          // tempFundsData.forEach((element,i) => {
          //   if(element.GenericResponse[i].Key === 'SIP' && element.GenericResponse[i].Value === this.SIPName) {
          //     this.fundsData = element.GenericResponse;
          //     return;
          //   }
          // });
          this.fundsData = tempFundsData.filter((e) => {
            const sips = e.GenericResponse.filter(g => g.Key === "SIP" && g.Value === this.SIPName);
            return sips.length > 0;
            // console.log("e.GenericResponse[i].Key", e.GenericResponse[i],i, e.GenericResponse[i].Key)
            // return e.GenericResponse[i].Key === 'SIP' && e.GenericResponse[i].Value === this.SIPName;
          })
          this.fundsData = this.fundsData[0].GenericResponse;
          console.log("this.fundsData", this.fundsData);
          const allFunds: any[] = this.fundsData.filter(e => e.Key.includes('fund'))
          const allInvAmt: any[] = this.fundsData.filter(e => e.Key.includes('InvAmt'))
          const allContributions: any[] = this.fundsData.filter(e => e.Key.includes('Contribution_Perc'))
          Fundetails.BundledFunds = [];

          allFunds.forEach((f, i) => {
            if (!!f.Value) {
              let fundObj: any = {};
              fundObj.FundName = allFunds[i].Value;
              fundObj.InvAmt = allInvAmt[i].Value;
              fundObj.Contribution = allContributions[i].Value;
              Fundetails.BundledFunds.push(fundObj);
            }
          })

          let FundDetailstemp = Fundetails.BundledFunds;
          FundDetailstemp.forEach((element, _i) => {
            this.getFundsData.push({
              "fundName": element.FundName,
              "InvAmount": parseFloat(element.InvAmt),
              "Contribution": parseFloat(element.Contribution)             
            })
          })
          
          console.log("this.Fundetails", Fundetails);
          console.log("this.getFundsData", this.getFundsData);

        }
      })
    } catch (error) {
      
    }
  }

  //Added by Alolika G | 14-02-2022
  showUnderlying(item, i) {
    this.fundsData = [];
    this.index = i;
    this.fundsData.push({'fundName': item.Param2, 'amount': item.Param9}, //f1
    {'fundName': item.Param3, 'amount': item.Param10},//f2
    {'fundName': item.Param4, 'amount': item.Param12},//f4
    {'fundName': item.Param5, 'amount': item.Param13},//f5
    {'fundName': item.Param6, 'amount': item.Param24},//f6
    {'fundName': item.Param7, 'amount': ""},//f7
    {'fundName': item.Param8, 'amount': item.Param24});//f8

    // console.log("this.fundsData1", this.fundsData);

    // let fundsTemp = [];
    // this.fundsData.forEach(element => {
    //   if(element.Key.includes('fund')) {

    //   }
    // });


  }

  getImpDates(NMID) {
    try {
      this.loaderDates = true;
      let paramList = []
      let SPName = "USP_CustSIPInstallmentDetails"
      paramList.push({
        "Param1": "FINIQ_COMMON"
      },
        {
          "Param1": "@CustomerID",
          "Param2": this.CustomerID
        },
        {
          "Param1": "@EntityID",
          "Param2": this.EntityId
        },
        {
          "Param1": "@LoginUser",
          "Param2": this.LoginId
        },
        {
          "Param1": "@note_master_id",
          "Param2": NMID,
        },
        {
          "Param1": "@ccy",
          "Param2": this.baseCcy
        })
      this.homeApi.SIPGenericStoredProcedure(SPName, paramList).subscribe(res => {
        if (res) {
          this.loaderDates = false;
          this.sipDates = [];
          this.sipDates = res.ExecGenericStoredProcedureResult;
          this.sipDates = res.ExecGenericStoredProcedureResult.sort((a, b) => {
            const dateA: any = new Date(a.Param2);
            const dateB: any = new Date(b.Param2);
            return dateA - dateB;
          })
        }
      })
      // this.homeApi.getSIPDates(this.CustomerID, this.EntityId, this.LoginId, NMID, this.baseCcy).subscribe(res => {
      //   if (res) {
      //     this.loaderDates = false;
      //     this.sipDates = [];
      //     this.sipDates = res.ExecGenericStoredProcedureResult;
      //     this.sipDates = res.ExecGenericStoredProcedureResult.sort((a, b) => {
      //       const dateA: any = new Date(a.Param2);
      //       const dateB: any = new Date(b.Param2);
      //       return dateA - dateB;
      //     });
      //   }
      // })
    } catch (error) {

    }
  }
  //--Changes done by AlolikaG on 1st Feb 2022. Assigned by Parikshit K. --END


  //Added by Uddesh on 1 Feb 2022
  openPauseAction(item: any) {
    this.showPauseActions = true;

    //Added by AlolikaG on 3rd Feb 2022 to display dates >= today -- START
    const today = new Date();
    today.setHours(0,0,0,0);
    // console.log("pause clicked");
    this.PauseSIPDates = [];
    this.sipDates.forEach(element => {
      if((new Date(element.Param2) >= today)) {
        this.PauseSIPDates.push(element);
      }
    });
    //Added by AlolikaG on 3rd Feb 2022 to display dates >= today --END 

    if (this.NoteMasterID != item.Param16) {
      this.getImpDates(item.Param16);
      this.NoteMasterID = item.Param16;
      this.SIPName = item.Param1;
    }

  }

  ClosePopups() {
    this.showPauseActions = false;
    this.pauseDatesArray = [];
    this.openActiveAction = false;
  }

  checkboxAction(item) {
    let date = (new Date(item.Param2))?.toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$2-$1-$3');
    if (this.pauseDatesArray) {
      if (this.pauseDatesArray.includes(date)) {
        this.pauseDatesArray.splice(
          this.pauseDatesArray.indexOf(date),
          1
        );
      } else {
        this.pauseDatesArray.push(date);
      }
    } else {
      this.pauseDatesArray.push(date);
    }
    // console.log('dates pause', this.pauseDatesArray);
  }

  SkipInstallments(mode){
    let dateStr: any = '';
    this.pauseDatesArray.forEach(i => dateStr= dateStr+i.toString()+',');
    // console.log("dateStr", dateStr)
    dateStr = dateStr.slice(0,-1);
    console.log(dateStr)
    this.showPauseActions = false;
    this.openActiveAction = false;
    let paramList = []
    let SPName = "USPUpdateSIPDetails"
    paramList.push({
      "Param1": "FINIQ_COMMON"
    },
      {
        "Param1": "@NoteMasterId",
        "Param2": this.NoteMasterID
      },
      {
        "Param1": "@UserId",
        "Param2": this.LoginId
      },
      {
        "Param1": "@NextDueDates",
        "Param2": dateStr,
      },
      {
        "Param1": "@Mode",
        "Param2": mode
      })
    this.homeApi.SIPGenericStoredProcedure(SPName, paramList).subscribe(res => {
      if(res) {
      // this.getImpDates(this.NoteMasterID);
      this.getSipDetails(this.index);
      this.pauseDatesArray = [];
      }
    })
    // this.homeApi.getSIPActions(this.NoteMasterID, this.LoginId, dateStr, mode).subscribe((res) => {
    //   console.log(res);
    //   if (res) {
    //     // this.getImpDates(this.NoteMasterID);
    //     this.getSipDetails(this.index);
    //     this.pauseDatesArray = [];
    //   }
    // })
  }

  //--Changes done by AlolikaG on 2nd Feb 2022. Assigned by Parikshit K. --START
  SipActions(NMID, dates, mode, i) {
    try {
      let paramList = []
      let SPName = "USPUpdateSIPDetails"
      paramList.push({
        "Param1": "FINIQ_COMMON"
      },
        {
          "Param1": "@NoteMasterId",
          "Param2": NMID
        },
        {
          "Param1": "@UserId",
          "Param2": this.LoginId
        },
        {
          "Param1": "@NextDueDates",
          "Param2": dates,
        },
        {
          "Param1": "@Mode",
          "Param2": mode
        })
      this.homeApi.SIPGenericStoredProcedure(SPName, paramList).subscribe(res => {
        if (res) {
          this.actionResult = res.ExecGenericStoredProcedureResult;
          // console.log("this.actionResult", this.actionResult);
          this.getSipDetails(i);
        }
      })
      // this.homeApi.getSIPActions(NMID, this.LoginId, dates, mode).subscribe(res => {
      //   if (res) {
      //     this.actionResult = res.ExecGenericStoredProcedureResult;
      //     // console.log("this.actionResult", this.actionResult);
      //     this.getSipDetails(i);
      //   }
      // })
    } catch (error) {

    }
  }
  //--Changes done by AlolikaG on 2nd Feb 2022. Assigned by Parikshit K. --END

  //--Changes done by AlolikaG on 4th Feb 2022. Assigned by Parikshit K. --START
  getSipPausedDates(item, i) {
    try {
      let paramList = []
      let SPName = "USP_CustSIPActivateschedule"
      paramList.push({
        "Param1": "FINIQ_COMMON"
      },
        {
          "Param1": "@CustomerID",
          "Param2": this.CustomerID
        },
        {
          "Param1": "@EntityID",
          "Param2": this.EntityId
        },
        {
          "Param1": "@LoginUser",
          "Param2": this.LoginId,
        },
        {
          "Param1": "@note_master_id",
          "Param2": item.Param16
        },
        {
          "Param1": "@ccy",
          "Param2": this.baseCcy
        })
      this.homeApi.SIPGenericStoredProcedure(SPName, paramList).subscribe(res => {
        if (res) {
          this.pausedDates = [];
          this.pausedDates = res.ExecGenericStoredProcedureResult;
          // console.log("this.actionResult", this.actionResult);
          this.pausedDates = res.ExecGenericStoredProcedureResult.sort((a, b) => {
            const dateA: any = new Date(a.Param2);
            const dateB: any = new Date(b.Param2);
            return dateA - dateB;
          });
          this.openActiveAction = true;
          this.NoteMasterID = item.Param16;
          this.SIPName = item.Param1;
          this.index = i;
        }
      })
      // this.homeApi.getSIPpausedDates(this.CustomerID, this.EntityId, this.LoginId, item.Param16, this.baseCcy).subscribe(res => {
      //   if (res) {
      //     this.pausedDates = [];
      //     this.pausedDates = res.ExecGenericStoredProcedureResult;
      //     // console.log("this.actionResult", this.actionResult);
      //     this.pausedDates = res.ExecGenericStoredProcedureResult.sort((a, b) => {
      //       const dateA: any = new Date(a.Param2);
      //       const dateB: any = new Date(b.Param2);
      //       return dateA - dateB;
      //     });
      //     this.openActiveAction = true;
      //     this.NoteMasterID = item.Param16;
      //     this.SIPName = item.Param1;
      //     this.index = i;
      //   }
      // })
    } catch (error) {

    }
  }
  //--Changes done by AlolikaG on 4th Feb 2022. Assigned by Parikshit K. --END

  toggleforMFList(i) {
    try {
      switch (i) {
        case 0:
          this.MFlist = true;
          this.SIPdatestoggle = false
          break;

          case 1:
            this.MFlist = false;
            this.SIPdatestoggle = true
            break;
      
        default:
          break;
      }
    } catch (error) {
      
    }
  }

  
  back() {
    this.location.back();
  }

}
