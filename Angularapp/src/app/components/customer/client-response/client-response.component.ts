import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { environment } from 'src/environments/environment';
// import { runInThisContext } from 'vm';
declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-client-response',
  templateUrl: './client-response.component.html',
  styleUrls: ['./client-response.component.scss'],
})
export class ClientResponseComponent implements OnInit {
  interfaceUrl = environment.interfaceURL;
  Format = 'PDF';
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  expanded = false;
  hideOnExpand: boolean;
  allCorpActions = [] as any;
  allCorpActionsDates = [] as any;
  allCorpActionList = [] as any;
  corpActionDD: string;
  corpActionDatesDD: string;
  allCorpActionsDatesList = [] as any;
  // gridHeaders = [] as any;
  getYN = [] as any;
  toDate: string;
  fromDate: string;
  allCorpActionData: any;
  allCorpActionsSubscription: Subscription;
  allCorpDataWithChoiceSubscription: Subscription;
  GetFaciltyDataSubscription: Subscription;
  GetDocumentEmailcountSubscription: Subscription;
  RuleoutputHistorySubscription: Subscription;
  GetClientResYNSubscription: Subscription;
  GetDocHoldingQtySubscription: Subscription;
  shareDetailsCorpAction: any;
  allCorpData: any;
  shareList: any;
  search: any;
  selectedBIndex = 0;
  showSuggestions: boolean;
  NoteMasterId: any;
  details: any;
  showShareDetails: boolean;
  selectedIndex = -1;
  allCorpDataWithChoice: void;
  GetFaciltyData: void;
  documentEmailCount: void;
  defautData: any;
  product: any;
  ProductName: any;
  ShareDetails: any;
  shareCode = [] as any;
  Underlying = [] as any;
  currency = [] as any;
  tradeDate: any;
  valueDate: any;
  templateCode = [] as any;
  NoteMasterData = [] as any;
  exchange = [] as any;
  responseDate = [] as any;
  recordDate = [] as any;
  announcementDate = [] as any;
  Currency = [] as any;
  Exchange = [] as any;
  dividendPerAnnum = [] as any;
  taxApplicableYN = [] as any;
  dividendTrue: boolean;
  templateCodeID = [] as any;
  StatusDD: any;
  customerID: any;
  choiceMetaData: any;
  actionDataValue: any;
  searchByDataValue: any;
  security: any;
  ClientYN: any;
  hideRuleContent: boolean[] = [false];
  editFlag: boolean[] = [false];
  PortfolioDD: any;
  QualifyingQuantityeEdit: any;

  gridHeadersJson = [
    {
      colName: 'CTMID',
      colDisplayName: 'CTM ID',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmCTMHoldingQty',
      colDisplayName: 'Holding Ref',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmID',
      colDisplayName: 'ID',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmCustomer',
      colDisplayName: 'Customer',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmportfolio',
      colDisplayName: 'Portfolio',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmQualifyingQuantity',
      colDisplayName: 'Qualifying Quantity',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmViewDocument',
      colDisplayName: 'View Client Notification',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmDocmailed',
      colDisplayName: 'Email Sent',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmHoldingQty',
      colDisplayName: 'Holding Quantity',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmUnitOfEntitlement',
      colDisplayName: 'Unit of Entitlement',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmEntitlementProposed',
      colDisplayName: 'Entitlement Proposed',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmEntitlementActual',
      colDisplayName: 'Entitlement Actual',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmTxnCode',
      colDisplayName: 'Transaction Code',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmn_HoldQuanCAWCn',
      colDisplayName: 'Holding Quantity',
      visibleYN: '',
      editableYN: '',
    },

    {
      colName: 'clmn_rightsQuanCAWC',
      colDisplayName: 'Rights Quantity (Proposed)',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmCustID',
      colDisplayName: 'Customer ID',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmClientRes',
      colDisplayName: 'Client Response',
      visibleYN: '',
      editableYN: '',
    },

    {
      colName: 'clmPayIn',
      colDisplayName: 'Payment In',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmShareCal',
      colDisplayName: 'Security Calculation Method',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmCashQuantity',
      colDisplayName: 'Cash Quantity',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmCashCc',
      colDisplayName: 'Cash Currency',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmShareQuantity',
      colDisplayName: 'Security Quantity',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmRightsOpt',
      colDisplayName: 'Rights Opted',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmRightsApplied',
      colDisplayName: 'Excess Rights Applied',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmRightsPrice',
      colDisplayName: 'Excess Rights Price',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmRightsAllocated',
      colDisplayName: 'Excess Rights Allocated',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmn_HoldQuanCAWCn',
      colDisplayName: 'Warrants Opted',
      visibleYN: '',
      editableYN: '',
    },

    {
      colName: 'clmWarrantsApplied',
      colDisplayName: 'Excess Warrants Applied',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmWarrantsPrice',
      colDisplayName: 'Excess Warrants Price',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmWarrantsAllocated',
      colDisplayName: 'Excess Warrants Allocated',
      visibleYN: '',
      editableYN: '',
    },
    {
      colName: 'clmTaxPer',
      colDisplayName: 'Tax (%)',
      visibleYN: '',
      editableYN: '',
    },
  ];

  corporateDetailsWithChoice: any;
  CTM_ID = [] as any;
  CTMHoldingQty = [] as any;
  ID = [] as any;
  Customer = [] as any;
  Portfolio = [] as any;
  QualifyingQuantity: any;
  viewDoc: any;
  Docmailed = [] as any;
  HoldingQty = [] as any;
  UnitOfEntitlement = [] as any;
  EntitlementProposed = [] as any;
  EntitlementActual = [] as any;
  TxnCode = [] as any;
  HoldQuanCAWC = [] as any;
  rightsQuanCAWC = [] as any;
  CustID = [] as any;
  ClientRes = [] as any;
  PayIn = [] as any;
  ShareCal = [] as any;
  CashQuantity = [] as any;
  CashCcy = [] as any;
  ShareQuantity = [] as any;
  RightsOpt = [] as any;
  RightsApplied = [] as any;
  RightsPrice = [] as any;
  RightsAllocated = [] as any;
  WarrantsOpt = [] as any;
  WarrantsApplied = [] as any;
  WarrantsPrice = [] as any;
  WarrantsAllocated = [] as any;
  TaxPerc = [] as any;
  gridHeaders = [] as any;
  allGridData: any[];
  visibleFlag: boolean;
  GetClientResYNData: void;
  ClientResDropDown = [] as any;
  ClientresYN: any;
  ClientDropDown = [] as any;
  DocmailedYN = [] as any;
  paymentType = [] as any;
  PayInDD = [] as any;
  ClientDD = [] as any;
  UpdateFlag = [] as any;
  statusProcessed = [] as any;
  paymentTypeDD = [] as any;
  currentProduct: any;
  documentDetails: any;
  activeNoteMasterId = [] as any;
  PDFLink: any;
  CustomerID: string;
  noteID: any;
  sendEmailFlag: boolean[] = [false];
  noDataFlag = false;
  selectedshare: boolean;
  selectedcash: boolean;
  CashQuantityedit: any;
  ShareQuantityedit: any;
  LoginId: any;
  CIF: any;

  constructor(
    public afs: WorkflowApiService,
    public cfs: CustomerApiService,
    private api: WorkflowApiService,
    public com: CommonApiService,
    public elem: ElementRef,
    private http: HttpClient,
    private homeApi: HomeApiService,
    private authapi: AuthService
  ) {
    this.toDate = moment('2020-10-15T00:00:00').format('DD-MMM-YYYY');
    this.fromDate = moment('2020-10-15T00:00:00').format('DD-MMM-YYYY');
  }

  ngOnInit(): void {
    try {
      this.StatusDD = 'Processed';
      this.security = '';
      this.search = '';
      this.actionDataValue = ''; //Added by Alolika G | 16-02-2022
      // this.customerID = '32882';
      this.customerID = this.homeApi.CustomerId;
      this.LoginId = this.authapi.UserName; //Added by Alolika G | 16-02-2022
      this.CIF = this.homeApi.CIF;
      const that = this;
      this.GetRMData();
      this.cfs.GetCorpActionsWithFlag('', '', '', '', '', '', this.customerID);
      this.allCorpActionsSubscription =
        this.cfs.GetCorpActionsWithFlagObs.subscribe((res) => {
          if (
            res.length !== 0 &&
            res.Get_Corporate_Action_Details_WithFlagResult !== null
          ) {
            this.allCorpData = res.Get_Corporate_Action_Details_WithFlagResult;
            if (this.allCorpData.length < 0 || this.allCorpData === '') {
              this.noDataFlag = true;
            } else {
              this.noDataFlag = false;
            }
            // console.log('all corp data',this.allCorpData)

            // for (let i = 0; i < this.allCorpData.length; i++) {
            //   this.getYNFlag(this.allCorpData[i].Note_Master_ID, i);
            //   this.hideRuleContent[i] = false;
            // }
          }
        });
      // console.log(this.noDataFlag);
      // this.GetFacilty();
      // this.GetDocumentEmailcount();
      // this.GetRuleoutputHistoryDetails();
      this.api.GetShareList('');
      this.api.sharelistObserver.subscribe((res: any) => {
        if (res) {
          this.shareList = res;
        }
      });
      this.cfs.GetCAWithChoiceMetadataObs.subscribe((res) => {
        this.choiceMetaData = res;
        // console.log('meta data visibility ', this.choiceMetaData, templateCode);
      });
      this.api.shareDetailsObserver.subscribe((res: any) => {
        if (res.length !== 0) {
          that.details = res.ProductDetails;
          // console.log(res.ProductDetails, typeof (res));
          if (this.shareList.length) {
            that.showShareDetails = true;
            that.search = '';
            that.shareList = [];
            that.shareList.length = 0;
            this.search = that.details.Product_Name;
            this.security = that.details.Feedcode;
          }
        }
      });
    } catch (error) {}
  }

  selectToDate(date) {
    try {
      this.toDate = moment(date).format('DD-MMM-YYYY');
    } catch (error) {}
  }
  selectFromDate(date) {
    try {
      this.fromDate = moment(date).format('DD-MMM-YYYY');
    } catch (error) {}
  }

  GetRMData() {
    try {
      this.allCorpActions = this.cfs.GetAllCorpAction();
      // console.log(this.allCorpActions);
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.allCorpActions.length; i++) {
        this.allCorpActionList.push(this.allCorpActions[i].Misc1);
      }
      // const templateCode = this.allCorpActions[this.allCorpActions.findIndex(item => item.Misc1 === this.corpActionDD)].Data_value;

      this.allCorpActionsDates = this.cfs.GetCorpActionDate();
      this.corpActionDD = this.allCorpActionList[0];
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this.allCorpActionsDates.length; i++) {
        this.allCorpActionsDatesList.push(this.allCorpActionsDates[i].Misc1);
      }
      // console.log(this.allCorpActionsDatesList);
    } catch (error) {}
  }

  getYNFlag(NoteMasterId, i) {
    try {
      this.cfs.GetCertificateYN(NoteMasterId);
      this.cfs.getYNObs.subscribe((res) => {
        this.getYN[i] = res;
      });
      if (this.getYN[i] === 'N') {
        this.statusProcessed[i] = 'false';
      } else {
        this.statusProcessed[i] = 'false';
      }
      // console.log('this.getYN', this.statusProcessed[i]);
    } catch (error) {
      // console.log(error);
    }
  }

  shareDetailsCorpActionBS(NoteMasterId, i) {
    try {
      this.cfs.GetShareDetailsCorpAct(NoteMasterId);
      this.cfs.shareDetailsCorpActionObs.subscribe((res) => {
        this.ShareDetails = res[0];
      });

      this.shareCode[i] = this.ShareDetails.Asset;
      this.Underlying[i] = this.ShareDetails.LongName;
      this.Currency[i] = this.ShareDetails.Currency;
      // console.log('share details', this.shareCode);
    } catch (error) {}
  }

  changeMetaDataVisibility(corpActionDD) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const templateCode =
        this.allCorpActions[
          this.allCorpActions.findIndex((item) => item.Misc1 === corpActionDD)
        ].Data_value;
      this.cfs.GetCAWithChoiceMetadataC(templateCode);
      this.gridHeadersJson.forEach((ele) => {
        ele.editableYN = '';
        ele.visibleYN = '';
      });
    } catch (error) {
      // console.log(error);
    }
  }

  loadAllCorpActionData() {
    try {
      if (this.search.length < 0 || this.search === '') {
        this.security = '';
      }
      if (this.StatusDD === '' || this.StatusDD.length < 0) {
        this.StatusDD = '';
      }
      this.actionDataValue =
        this.allCorpActions[
          this.allCorpActions.findIndex(
            (record) => record.Misc1 === this.corpActionDD
          )
        ].Data_value;
      this.cfs.GetCorpActionsWithFlag(
        '',
        '',
        '',
        this.actionDataValue,
        this.security,
        this.StatusDD,
        this.customerID
      );

      // this.allCorpActionsSubscription = this.cfs.CorpActionDetailsObserver.subscribe(res => {
      //   this.allCorpData = res;
      // });
      // if (this.allCorpData.length < 0 || this.allCorpData === '') {
      //   this.noDataFlag = true;
      // }
      // else {
      //   this.noDataFlag = false;
      // }
      // for (let i = 0; i < this.allCorpData.length; i++) {
      //   this.getYNFlag(this.allCorpData[i].Note_Master_ID, i);
      //   this.hideRuleContent[i] = false;
      // }
    } catch (error) {}
  }

  getDataOnExpand(product, i) {
    try {
      this.editFlag[i] = false;
      // console.log('this.currentProduct', product);
      // this.changeMetaDataVisibility(product);
      this.activeNoteMasterId[i] = product.Note_Master_ID;
      this.templateCode[i] = product.template_code;
      this.templateCodeID[i] = product.Template_ID;
      this.shareDetailsCorpActionBS(this.activeNoteMasterId[i], i);
      this.cfs.GetNotemasterDetails(this.activeNoteMasterId[i]);
      this.GetClientResYN(this.templateCode[i], i);
      this.cfs.GetNotemasterDetailsObs.subscribe((res) => {
        this.NoteMasterData = res[0];
      });
      this.Exchange[i] = this.NoteMasterData.exchange;
      // console.log('exchange', this.Exchange[i]);
      this.responseDate[i] = moment(
        this.NoteMasterData.Published_DateTime
      ).format('DD-MMM-YYYY');
      this.recordDate[i] = moment(this.NoteMasterData.Value_date).format(
        'DD-MMM-YYYY'
      );
      this.announcementDate[i] = moment(this.NoteMasterData.Trade_Date).format(
        'DD-MMM-YYYY'
      );
      this.dividendPerAnnum[i] = this.NoteMasterData.Customer_Price;
      if (this.dividendPerAnnum !== '' || this.dividendPerAnnum === '0') {
        this.dividendTrue = true;
      } else {
        this.dividendTrue = false;
      }
      this.taxApplicableYN[i] =
        this.NoteMasterData.Withholding_Tax_Applicable_YN;

      this.LoadCorporateActionDetailsWithChoice(
        this.activeNoteMasterId[i],
        product.Asset,
        'False',
        this.templateCodeID[i],
        this.StatusDD ? 'Processed' : 'Processed',
        this.customerID
      );
      // grid data
      // console.log('corporateDetailsWithChoice', this.corporateDetailsWithChoice);
      this.CTM_ID[i] = this.corporateDetailsWithChoice[0].CTM_ID;
      this.CTMHoldingQty[i] =
        this.corporateDetailsWithChoice[0].CTM_Holding_Snapshot_ID;
      this.ID[i] = this.corporateDetailsWithChoice[0].CEHDS_ID;
      this.Customer[i] = this.corporateDetailsWithChoice[0].CustomerName;
      this.GetFacilty(
        this.customerID,
        this.shareCode[i],
        this.activeNoteMasterId[i],
        i
      ); // portfolio
      this.GetDocHoldingQty(this.activeNoteMasterId[i], this.customerID, i); // QualifyingQuantity
      // view doc is a input box
      this.GetDocumentEmailcount(this.activeNoteMasterId[i], i); // email sent
      // this.Docmailed = this.corporateDetailsWithChoice[0].//
      this.HoldingQty[i] = this.corporateDetailsWithChoice[0].Quantity;
      this.UnitOfEntitlement[i] =
        this.corporateDetailsWithChoice[0].CTM_Currency;
      this.EntitlementProposed[i] =
        this.corporateDetailsWithChoice[0].CTM_Proposed_Pay_Amt;
      this.EntitlementActual[i] = this.corporateDetailsWithChoice[0].CTM_Actual;
      this.TxnCode[i] =
        this.corporateDetailsWithChoice[0].CTM_Tran_Code_CRPACTChoice;
      this.HoldQuanCAWC[i] =
        this.corporateDetailsWithChoice[0].CEHDS_CEHD_BUY_Settled_Quantity;
      // rightsQuanCAWC is a input box
      this.CustID[i] =
        this.corporateDetailsWithChoice[0].CEHDS_CEHD_Customer_ID;
      this.ClientRes[i] =
        this.corporateDetailsWithChoice[0].CRBP_Client_Response_YN;
      // drop down data
      // this.GetClientResYN();
      this.PayIn[i] = this.corporateDetailsWithChoice[0].CRBP_Payment_Type;
      // dropdown
      this.GetPaymentTp_CA(this.templateCode[i], this.activeNoteMasterId[i], i);
      this.ShareCal[i] =
        this.corporateDetailsWithChoice[0].CRBP_Share_Calculation_Method;
      this.CashQuantity[i] = this.corporateDetailsWithChoice[0].CRBP_Cash_PC;
      this.CashCcy[i] = this.corporateDetailsWithChoice[0].CRBP_Currency;
      this.ShareQuantity[i] = this.corporateDetailsWithChoice[0].CRBP_Share_PC;
      this.RightsOpt[i] = this.corporateDetailsWithChoice[0].CRBP_Rights_Opted;
      this.RightsApplied[i] =
        this.corporateDetailsWithChoice[0].CRBP_Rights_Applied;
      this.RightsPrice[i] =
        this.corporateDetailsWithChoice[0].CRBP_Rights_Price;
      this.RightsAllocated[i] =
        this.corporateDetailsWithChoice[0].CRBP_Rights_Allocated;
      this.WarrantsOpt[i] =
        this.corporateDetailsWithChoice[0].CRBP_Warrants_Opted;
      this.WarrantsApplied[i] = this.corporateDetailsWithChoice[0].CEHDS_ID;
      this.WarrantsPrice[i] =
        this.corporateDetailsWithChoice[0].CRBP_Warrants_Price;
      this.WarrantsAllocated[i] =
        this.corporateDetailsWithChoice[0].CRBP_Warrants_Allocated;
      this.TaxPerc[i] = this.corporateDetailsWithChoice[0].CRBP_TaxPerc;
      // console.log('this.CashQuantity[i] and this.ShareQuantity[i]', this.CashQuantity[i] , this.ShareQuantity[i]);
      this.gridHeaders = [];
      this.cfs.GetCAWithChoiceMetadataC(this.allCorpData[i].template_code);
      this.choiceMetaData.forEach((element) => {
        if (element.visibleYN === 'Y') {
          this.gridHeadersJson.forEach((ele) => {
            if (ele.colName === element.column_Name) {
              this.gridHeaders.push(ele.colDisplayName);
              ele.visibleYN = element.visibleYN;
            }
          });
        }
      });
      this.choiceMetaData.forEach((element) => {
        if (element.visibleYN === 'Y') {
          this.gridHeadersJson.forEach((ele) => {
            if (ele.colName === element.column_Name) {
              ele.visibleYN = element.visibleYN;
            }
          });
        }
      });
      this.choiceMetaData.forEach((element) => {
        if (element.EditableYN === 'Y') {
          this.gridHeadersJson.forEach((ele) => {
            if (ele.colName === element.column_Name) {
              ele.editableYN = element.EditableYN;
            }
          });
        }
      });
    } catch (error) {
      // console.log(error);
    }
  }

  GetDocumentDetails(item, _i) {
    try {
      // console.log(item, i);
      const PdfURL = this.http.get<any>(
        this.interfaceUrl +
          'Get_DocumentDetails/' +
          item.Note_Master_ID +
          '/' +
          this.customerID,
        { headers: this.headerOptions }
      );
      PdfURL.subscribe((res) => {
        if (res) {
          // console.log('res', res);
          this.PDFLink = res.URL;
          window.open(this.PDFLink);
        }
      });
    } catch (error) {}
  }
  sendEmail(item, i) {
    try {
      this.cfs.GetEmailNotification(item.Note_Master_ID);
      this.cfs.GetEmailNotificationObs.subscribe((res) => {
        this.sendEmailFlag[i] = res;
      });
    } catch (error) {}
  }
  GetPaymentTp_CA(templateCode, NoteMasterId, i) {
    try {
      this.paymentTypeDD[i] = [];
      this.paymentType = [];
      this.cfs.GetPaymentTp_CA(templateCode, NoteMasterId);
      this.cfs.GetPaymentTp_CAObs.subscribe((res) => {
        this.paymentType[i] = res;
      });
      // console.log('result in GetPaymentTp_CA', this.paymentType);
      this.paymentType[i].forEach((element) => {
        this.paymentTypeDD[i].push(element.Precisioncol);
      });
    } catch (error) {
      // console.log(error);
    }
  }
  UpdateClientResponse(item, i) {
    try {
      this.cfs.UpdateCashSharePrice(
        parseFloat(this.CashQuantityedit.replace(',', '')),
        this.CashCcy[i],
        this.templateCode[i],
        this.customerID,
        item.Note_Master_ID,
        this.PayInDD,
        this.ClientYN,
        this.HoldingQty[i],
        this.RightsApplied[i],
        this.RightsAllocated[i],
        this.RightsPrice[i],
        parseFloat(this.ShareQuantityedit.replace(',', '')),
        this.ShareCal[i],
        '',
        this.TaxPerc[i],
        this.WarrantsAllocated[i],
        this.WarrantsApplied[i],
        this.WarrantsOpt[i],
        this.WarrantsPrice[i],
        this.CIF
      );
      this.cfs.UpdateCashSharePriceObs.subscribe((res) => {
        this.UpdateFlag[i] = res;
      });
      // console.log('this upadted?', this.UpdateFlag[i]);
      if (this.UpdateFlag[i]) {
        this.getDataOnExpand(item, i);
      } else {
        // console.log('No updates recorded');
      }
      this.editFlag[i] = false;
    } catch (error) {
      // console.log(error);
    }
  }

  GetFacilty(customerID, shareCode, NoteMasterId, i) {
    try {
      this.GetFaciltyData = this.cfs.GetFacilty(
        customerID,
        shareCode,
        NoteMasterId
      );
      this.GetFaciltyDataSubscription = this.cfs.GetFaciltyObserver.subscribe(
        (res) => {
          this.Portfolio[i] = res[0];
        }
      );
      // console.log('portfolioDD', this.PortfolioDD);
    } catch (error) {}
  }

  GetDocHoldingQty(NoteMasterId, customerID, _i) {
    try {
      this.GetFaciltyData = this.cfs.GetDocHoldingQty(NoteMasterId, customerID);
      this.GetDocHoldingQtySubscription =
        this.cfs.GetDocHoldingQtyObs.subscribe((res) => {
          // console.log('result in GetDocHoldingQty', res);
          this.QualifyingQuantity = res;
        });
    } catch (error) {}
  }

  GetDocumentEmailcount(NoteMasterId, i) {
    try {
      this.DocmailedYN[i] = [];
      this.documentEmailCount = this.cfs.GetDocumentEmailcount(NoteMasterId);
      this.GetDocumentEmailcountSubscription =
        this.cfs.GetDocumentEmailcountObs.subscribe((res) => {
          // console.log('result in GetDocumentEmailcount', res);
          this.Docmailed[i] = res;
          if (this.Docmailed[0].Countcol === '0') {
            this.DocmailedYN[i] = 'N';
          } else {
            this.DocmailedYN[i] = 'Y';
          }
        });
    } catch (error) {}
  }
  GetClientResYN(templateCode, i) {
    try {
      // this.ClientResDropDown = [];
      this.ClientDD[i] = [];
      this.GetClientResYNData = this.cfs.GetClientResYN(templateCode);
      this.GetClientResYNSubscription = this.cfs.GetClientResYNObs.subscribe(
        (res) => {
          this.ClientResDropDown = res;
        }
      );
      this.ClientResDropDown.forEach((element) => {
        this.ClientDD[i].push(element.Precisioncol);
      });
      // console.log('result in GetClientResYNData', this.ClientDD[i]);
    } catch (error) {}
  }

  toggle(i) {
    this.editFlag[i] = false;
    try {
      this.hideRuleContent[i] = !this.hideRuleContent[i];
    } catch (error) {}
  }

  editToggle(i, _item) {
    this.CashQuantityedit = '';
    this.ShareQuantityedit = '';
    this.editFlag[i] = !this.editFlag[i];
    this.selectedshare = false;
    this.selectedcash = false;
  }
  exitEdit(i) {
    this.editFlag[i] = false;
  }

  LoadCorporateActionDetailsWithChoice(
    NoteMasterId,
    shareCode,
    blnRecompute,
    templateCode,
    queueName,
    customerID
  ) {
    try {
      this.allCorpDataWithChoice = this.cfs.GetCorpActionWithChoiceDetails(
        NoteMasterId,
        shareCode,
        blnRecompute,
        templateCode,
        queueName,
        customerID,
        this.LoginId,
        this.CIF
      );
      this.allCorpDataWithChoiceSubscription =
        this.cfs.CorpActionWithChoiceDetailsObs.subscribe((res) => {
          // console.log('result in CorpActionWithChoiceDetailsObs', res);
          this.corporateDetailsWithChoice = res;
        });
    } catch (error) {}
  }

  selectShareOnEnter(_e) {
    try {
      const ShareInfo = $('.HoverSuggestion').data('sharedata');
      this.selectShareOnClick(ShareInfo);
      // this.PortfolioChange();
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  selectShareOnClick(NoteMasterId) {
    try {
      this.selectedBIndex = 0;
      this.showSuggestions = false;
      this.api.GetIndividualShareDetails(NoteMasterId); //  NoteMasterId
      const selectedShare = this.shareList.filter(
        (b) => b.Note_Master_Id === NoteMasterId
      )[0];
      //  console.log(selectedShare);
      this.NoteMasterId = selectedShare.Note_Master_id;
      this.security = selectedShare.Feedcode;
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  timeout(_timeout: any) {
    throw new Error('Method not implemented.');
  }

  searchShare() {
    try {
      // console.log(this.search);
      const that = this;
      if (this.search.trim().length >= 2) {
        this.api.sharelistObserver.subscribe((b) => {
          // console.log(b);
          that.shareList = b
            .filter(
              (item) =>
                item.Product_Name.toLowerCase().startsWith(
                  this.search.toLowerCase()
                ) ||
                item.Feedcode.toLowerCase().startsWith(
                  this.search.toLowerCase()
                )
            )
            .map(
              (item) =>
                (item = {
                  Currency: item.Currency,
                  Exchange: item.Exchange,
                  Feedcode: item.Feedcode,
                  Note_Master_Id: item.Note_Master_Id,
                  ProductName1: (item.Product_Name + '').trim().toLowerCase(),
                  Product_Name: (item.Product_Name + '').trim(),
                })
            );
        });
      } else {
        this.shareList = [];
        this.shareList.length = 0;
      }
    } catch (error) {
      // console.log("Error:", error);
    }
  }

  ChangeIndex(_e) {
    try {
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
    } catch (Error) {
      // this.apifunction.log(4, Error, 'share-component.component.ts', 'ChangeIndex()');
    }
  }
  onClickedOutside(_e: Event) {
    try {
      this.showSuggestions = false;
      // //console.log('Clicked outside:', e);
    } catch (error) {
      // console.log("Error:", error);
    }
  }
  changePayment(payIn) {
    this.ShareQuantity = 0.0;
    // console.log(payIn, this.QualifyingQuantity);
    if (payIn === 'Cash') {
      this.ShareQuantityedit = 0.0;
      this.CashQuantityedit = this.QualifyingQuantity.toString();
      new Intl.NumberFormat('en-us', { minimumFractionDigits: 2 }).format(
        this.CashQuantityedit
      );
      this.selectedcash = true;
      this.selectedshare = false;
    } else if (payIn === 'Share') {
      this.CashQuantityedit = 0.0;
      this.ShareQuantityedit = this.QualifyingQuantity.toString();
      new Intl.NumberFormat('en-us', { minimumFractionDigits: 2 }).format(
        this.ShareQuantityedit
      );
      this.selectedshare = true;
      this.selectedcash = false;
    } else if (payIn === 'Both') {
      this.CashQuantityedit = this.QualifyingQuantity.toString();
      new Intl.NumberFormat('en-us', { minimumFractionDigits: 2 }).format(
        this.CashQuantityedit
      );
      this.ShareQuantityedit = 0.0;
      this.selectedshare = false;
      this.selectedcash = false;
    }
  }

  changeQuantites(value, type) {
    if (type === 'cash') {
      this.ShareQuantityedit = this.com.FormatNumberr(
        this.QualifyingQuantity - value
      );
    } else if ('share') {
      this.CashQuantityedit = this.com.FormatNumberr(
        this.QualifyingQuantity - value
      );
    }
    value = '';
  }
}
