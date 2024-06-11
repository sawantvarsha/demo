	import { Component, OnInit, Inject, EventEmitter, Output, ElementRef, ChangeDetectorRef, Input,ViewChild, TemplateRef,HostBinding, Renderer2  } from '@angular/core';
	import { HttpClient, HttpHeaders } from '@angular/common/http';
	import { FormGroup, FormControl, Validators } from '@angular/forms';
	import { UCPMODE } from 'src/app/services/ucp/UCPMODE.enum';
	import { ApifunctionService } from 'src/app/services/ucp/apifunction.service';
	import { BehaviorSubject, from, Observable, of, Subscription} from 'rxjs';
	import {delay, map, startWith} from 'rxjs/operators';
	import {  } from '@angular/core/testing';
	import * as JsonToXML from 'js2xmlparser';
	//import * as converter from 'xml-js';
	import { CommonModule } from '@angular/common'; //Added by RajeshC || Can't bind to ngclass since it isn't a known property of button.

	// import {UCPControlServiceController} from 'Controllers/'
	// import 'rxjs/add/operator/toPromise';
	import { _isNumberValue } from '@angular/cdk/coercion';
	// import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';
	// import { element } from 'protractor';
	// import { this.isNullOrUndefined } from 'util';
	import { debug } from 'console';
	// import { AuthenticationService } from 'src/app/services/authentication.service';
	//import { AuthService } from 'src/app/services/auth/auth.service'; //Added by RajeshC 
	// import { User } from 'src/app/services/user';
	import { error } from '@angular/compiler/src/util';
	import { E, V } from '@angular/cdk/keycodes';
	import { AutocompleteService } from 'src/app/services/ucp/autocomplete.service';

	import { LoaderService } from 'src/app/services/ucp/LoaderService';
	import { environment } from 'src/environments/environment';
	//import { environment } from '../../../environments/environment';
	import * as _moment from 'moment';
	import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
 	// import { SignalRService } from 'src/app/services/signal-r.service';
	//import { SignalrApiService } from 'src/app/services/signalR/signalr-api.service';
	//import { CommonFunctionsService } from '../../structured-products/Services/common-functions.service';
	// import { CommonFunctionsService } from 'src/app/Services/Shared Controls/CommonServices/common-functions.service';
	
	import { Theme } from 'src/app/themeService/theme.module';
	// import  {Theme}  from 'src/app/ThemeService/theme.module';
	import { ThemeserviceService } from 'src/app/themeService/themeservice.service';
	// import { ThemeServiceService } from "src/app/ThemeService/theme-service.service";
	import{light,dark,} from 'src/app/themeService/theme.module';
	// import  {light,dark,blue, SeaBlue}  from 'src/app/ThemeService/theme.module';
	import  * as UCPCTLSERVICE from 'src/app/models/UCPCRESTSERVICE.model';
	const moment =  _moment;

	declare var require: any;

	enum Status {
		Success = 1,
			Fail = 0
	}

	@Component({
		selector: 'app-ucpdealentry',
		templateUrl: './UCPDealEntry.component.html',
		styleUrls: ['./UCPDealEntry.component.css']
	})
	export class UCPDealEntryComponent implements OnInit {

		@Output() formChangeEvent = new EventEmitter < any > ();

		@Input() Embedded_Template: any //added by devesh //Multi_UCP_template
		@Input() Embedded_Control: string = ""; //added by devesh //Multi_UCP
		@Output() Multi_UCP_Savestatus = new EventEmitter < any > (); //added by devesh
		@Input() Multi_UCP_index: number; //added by devesh
		@Input() Multi_UCP_length: number;
		// @Input() PostCardCurrTemplate: any;
		// @Input() PostCardTemplates: any;
		@Output() FX_Native_Output = new EventEmitter < any > (); /// added by OnkarE
		@Output() HandleFXNIntersection = new EventEmitter<any>();
		//@Input() FX_Native_TemplateData: any;
		//@Input() FX_Native_Flag: boolean;
		@Input() FX_Native_Fields: any;
		//@Input() FX_Native_Product: any;
		@Input() ChangedField: any;
		@Input() ChangedFieldVal: any;
		@HostBinding('class.showtabs') showtabs_visible_css:boolean=false;
		myControl = new FormControl();
		// signalr: SignalService;
		//signalr: SignalRService  
		selectedValue:any;
	DefaultValue:any;
		IsRecipeMode: boolean;
		iPreviousNoteMasterId: any;
		iChildTemplateCount: any;
		sschemeAlias: '';
		layoutColWidth: any;
		layoutLblWidth: any;
		totalWidth: Number;
		filteredOptions: Observable < any[] >
			schemeOptions: Observable < any > ;
		templateOptions: Observable < any > ;
		bookingModelOptions: Observable < any > ;
		entityData: any;
		show_tabs: boolean = false;
		show_hide_text: string = "Show Tabs";
		custGridStaticData: any;
		subscription: Subscription; //added by devesh 
		custGridColumns: any;
		//customtab_sync_status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); //added by devesh 
		//customtab_sync: Observable<boolean> = this.customtab_sync_status.asObservable();
		customtab_all_triggered: boolean = false;
		customergrid_all_triggered: boolean = false;
		readLayoutResponse: any;
		customersList: any;
		sWarningtextArr: string[] = [];
		objCustomTabXML: any = [];
		objCustomerGridXML: any = [];
		Login_Id: string;
		//currentUser: User;
		CustGridWFLRow: any;
		showTabText: string = "Show Tabs";
		mappedTabs: any[];
		mappedTabsExtra: any[];
		viewScheduleFlag: boolean;
		oUCPAppTablesData: any[] = [];
		ApplTypeFlag: boolean = false;
		notemasterIdGenerated: boolean = false;templates: any;
		AllTemplatesSearchOptions: Observable<any>;
		userGroup: string;
		showPricingGrid: any;
		DSNFunctionExecution:Map<string,any> = new Map(); //Added by devesh on 12-April-2021
		QueueNo: any;
		queueButtonsData: any;
		WFLqueueButtons: any[]=[];
		PPData: any;
		dtWFLButtons=[];
		sWFLButtonActionText="";
		sWFLButtonActionCode="";
		sSaveMessageText="";
		sCancelMessageText="";
		sTokenId:any;
		sInsertUpdate: string; // Added by OnkarE on 28-Apr-2021 to handle Insert/Update in SaveUCP function
		sschemeName: any;
		btnPoolreadonly:boolean; //Added by Devesh on 12-May-2021
		extraModules: any;
		PanelYesNo: boolean = true;
		leftPadding: string = "0.5px";
		ParsedFormula:Map<string,string>=new Map(); ///Added by devesh on 14-June-2021
		custid_index:number=-1;
		SMADataObj: any;
		hardblock_triggered:boolean=false;
		warning_triggered:boolean=false;
		HideCustomerGridMarketLeg: boolean;
		PricingMode: string;
		priceFunctions: any[];
		EQPrices: any;
		firstRFQ: any;
		triggerPrice: any;
		rfqList: any;
		PricingMethod: string;
		pricingID: number = 0;
		controlSeq: any;
		headerForQuote: any;
		PricingIntersectionFields: any;
		PricingOutputField: any;
		headerForQuoteField: any;
		globalWarningArr: any [];
		tabSeqMode: any;
		hedgingTypeinWFL: any;
		sSecondaryExecutionCode: any;
		hideEmptyFields: any;
		orientation: string; // Added by OnkarE on 10-Apr-2023
		iCurrentDealCount: any;
		sClickedButton : string; //Added by RajeshC || WFLButtonAction
		parentCustGridLength: number;
		@Input()
		set Multi_UCP_Saveall(value: boolean) {
			console.log(value);
			if (value) {
				this.CheckDraft();
			}

		}


		private dataLoadCheck = new BehaviorSubject(false);
		dataLoadCheckObserver = this.dataLoadCheck.asObservable();
		controlsLoaded = false;
		functionsLoaded = false;
		functionsParametersFetched = false;
		udfDropdownsLoaded = false;

		// mandatoryImageUrl = require('F:\LGTAngular\LGTSourceCode_08-Feb-2023\Gateway_Markets\src\assets\App_Resources\App_Resources');
		form: FormGroup;

		dealLayout: any = {};
		controls: any;
		Entityddl: any = [];
		Moduleddl: any = [];
		Schemeddl: any = [];
		Templateddl: any = [];
		module: string;
		scheme: any;
		template: any;
		RowSize: number = 10; // Set default values as per .net for templates for which values not set from layout style mapping - added by OnkarE on 01-Apr-2022
		ColSize: number = 4; // Set default values as per .net for templates for which values not set from layout style mapping - added by OnkarE on 01-Apr-2022
		selectedBookingModel: any;
		selectedEntity: any;
		defaultDropdowns: any[] = [];
		dropdowns: any[] = [];
		defaultSearchArrays: any[] = [];
		searchArrays: any[] = [];
		shareArray: any[] = [];
		ddlTypes: string[] = [];
		functions: any[] = [];
		customerGridfunctions: any[] = [];
		intersections: any;
		buttonLinkedfunctions: any[] = [];
		functionParameters: any[] = [];
		customTabFuntions: any[] = [];
		functionTargetFields: any[] = [];
		TemplateData: any[] = [];
		EntityText = '';
		ModuleText = '';
		AssetText = '';
		ProductText = '';
		HedgingTypeText = '';
		DefaultModule = '';
		DefaultScheme = '';
		DefaultTemplate: '';
		DefaultSubtemplate: ''; ///added by devesh 
		BtnDraftName = '';
		BtnSaveName = '';
		BtnSimulationName = '';
		BtnRepriceName = '';
		BtnClearName = '';
		Message: any;
		ErrorMessage: any;
		DefaultValuesAvailable = false;
		productdDrafted = false;
		draftclicked = 0;
		ctCtr = 0;
		cgrowindex = -1; //Added by SwatiP
		custTabFlag = false;
		iMGRModuleID = 0;
		iMGRSchemeID = 0;
		iMGRTemplateID = 0;
		iProductId = 0;
		iSchemeCode = 0;
		iTemplateID = 0;
		iDefaultProductId = 0;      
		iDefaultSchemeId = 0;
		iDefaultTemplateId = 0;
		customTabCtr = 0;
		CustomTabs = {
			columns: [],
			data: []
		};
		CustomTabsArray: any[] = [];
		CustomerGrid = {
			columns: [],
			data: []
		};
		CustomerGridArray: any[] = [];
		tableRow: any[] = [];
		loader: Boolean = false;
		loader1: boolean = false;
		_iterableDiffers: any;
		NoteMasterID: any;
		PrevNoteMasterID: any;
		headerOptions = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		custGridTableRow: any[] = [];
		templateCode: '';
		sTemplateCode: any;
		allTemplates: any[] = [];
		sUCPMode: any;
		sUCPPreviousMode: any;
		iTemplateSrNo: number;
		blnMigrationSuccessful: Boolean;

		oProductRecipeDetails: any;
		sMigrationMode: any;
		ParentUDFRow: any;
		recFlag: boolean;
		iRecipeParentNoteMasterId = -1;
		sParentTemplateCode: '';
		iNoteMasterID: string="0";
		iNoteDealID: string;
		moduleControl = new FormControl();
		moduleData: any;
		schemeControl = new FormControl();
		schemeData: any;
		templateControl = new FormControl();
		templateData: any;
		bookingModelControl = new FormControl();
		bookingModelData: any[];
		isHedgingHidden = false;
		isSubTemp = false;
		subTempControl = new FormControl();
		subTemplate: any;
		subTemplateData: any;
		subTemplateOptions: Observable < any > ;
		sCustomTabUDFField: string = ""; //added by devesh for customtab static details
		iMaxRowCountForCustomTab: number; //added by devesh for customtab static details
		sProductName: string = "";
		controlHt: number = 40;
		common_data: any;
		disabled: boolean = false;
		showtabsFlag: boolean = false;
		tabSearch: string = "";
		entityId: string = "4"; /// To be used for entity id through login information - hardcoded as of now
		functions_all: any[] = []; //added by devesh on 6-Mar-2021
		Application_type: string = ""; //added by devesh on 9-Mar-2021
		IsSavingProcedureInSingleAction:boolean=false; //added by devesh on 11-Mar-2021
		countForLoader: number = 1;
		max_ColSize:number=30; //added by devesh on 8-April-2021 for layout related changes
		max_Rowsize:number=100; //added by devesh on 8-April-2021 for layout related changes // Changed to 100 by OnkarE as per new changes - on 09-May-2023
		cboHedgingtype:boolean=false;
		selectedTabName = "TPTRADECAPTURE";	// added by BhagyashriB on 26-Apr-2021
		h2DealEntry = "Deal Entry";		// added by BhagyashriB on 27-Apr-2021
		layoutloaded:boolean=false;
		ShowUDF:boolean=false;
		ShowCustom:boolean=false;
		ShowCustGrid:boolean=false;
		ShowStaticField:boolean=false;
		strmandate_triggered:boolean=false;
		@ViewChild('Promptbox') Promptbox: TemplateRef<any>;
		@ViewChild('Dealentry', {static: false}) Dealentry:ElementRef<any>;
		@ViewChild('Custom') Custom:ElementRef<any>;
		@ViewChild('UDF') UDF:ElementRef<any>;
		@ViewChild('CustGrid') CustGrid:ElementRef<any>;
		@ViewChild('PricingGrid') PricingGrid:ElementRef<any>;
		private PromptDialogRef;
		oProductSchedule:any=[];
		oViewSchedule: any[] =[];		//Added by BhagyashriB on 14-Sept-2021 | for view schedule
		CustomStaticTabDetails: any[] = []			//Added by BhagyashriB on 16-Sept-2021 | to send as input to package schedule component
		EditModeMappedTOWFBMSTField:string="";
		oEditrights:any=[];
		oEditrightsCustomer:any=[];
		oEditrightsCustom:any=[];
		data: any;
		selectedTheme:any; // Added by OnkarE on 03-Feb-2022
  		themeList: Theme[]; // Added by OnkarE on 03-Feb-2022
		Subscription:  Subscription; // Added by OnkarE on 04-Feb-2022
		constructor(private http: HttpClient, private api: ApifunctionService, private elemRef: ElementRef, private ref: ChangeDetectorRef, private _autodata:AutocompleteService,
		private loaderService: LoaderService,public matDialog: MatDialog, private renderer:Renderer2, public themeService: ThemeserviceService) {
			// this.authenticationService.currentUser.subscribe(x => this.currentUser = x); private commonfunctionsservice: CommonFunctionsService
			//console.log(baseUrl);
			this.Login_Id = sessionStorage.getItem('FinIQUserID') ? sessionStorage.getItem('FinIQUserID') : 'HSDealer1';
			this.userGroup = sessionStorage.getItem('FinIQGroupID') ? sessionStorage.getItem('FinIQGroupID') : 'HSBCDealer'; /// Added by OnkarE to get actual user's login id after merging deal entry in setup - on 25-Jan-2021
			//// Replaced all hardcoded 'Dealer1' values with this.Login_Id --- by OnkarE on 25-Jan-2020
			 //this.signalr = new SignalRService(commonfunctionsservice);
			//this.signalr = new SignalrApiService();
		}

		async ngOnInit() {
			try{
			// this.loaderService.status.subscribe(val => {
			// 	if (val) {
			// 		this.loader1 = val;
			// 		this.countForLoader = this.countForLoader + 1;
			// 	} else {
			// 		this.countForLoader = this.countForLoader - 1;
			// 		if (this.countForLoader == 0) {
			// 			this.loader1 = val;
			// 		}
			// 	}
			// })
			const that = this;
			this.getentityData();
			this.GetCommonDataDropdownValues();
			this.notemasterIdGenerated = false;
			this.recFlag = false;
			this.blnMigrationSuccessful = false;
			var currLocation;

			/// Theme changes added by OnkarE on 03-Feb-2022
			console.log("Localstorage is: ", localStorage)
			this.themeList=this.themeService.getAvailableThemes();
			this.Subscription = this.themeService.themeEmit.subscribe(res => {
				this.selectedTheme = res;
			})
			console.log("Theme service: ", this.themeService, this.themeService.themeEmit, this.Subscription, this.selectedTheme)
			this.themeList = this.themeList.filter(e => e.name == this.selectedTheme)
			console.log("Theme::: ", this.selectedTheme, this.themeList)
			if(this.selectedTheme === 'dark'){
				this.themeService.setActiveTheme(dark);
			}
			else if(this.selectedTheme==='light'){
				this.themeService.setActiveTheme(light);
			}
			// else if(this.selectedTheme==='blue'){
			// 	this.themeService.setActiveTheme(blue);
			// }
			// else if(this.selectedTheme==='SeaBlue'){
			// 	this.themeService.setActiveTheme(SeaBlue);
			// }
			

			//this.getAllTemplates();
			currLocation = window.location.href.toString();
			console.log("Curr location: ", currLocation)
			this.getAllTemplates();
			if (currLocation.includes("TemplateCode")) {
				console.log("Location is::::: ", window.location.href)
				var tempArr = currLocation.split("&");
				for (let i = 0; i < tempArr.length; i++) {
					if (tempArr[i].toUpperCase().includes("TEMPLATECODE")) {
						var tempArr2 = tempArr[i].split("=")
						this.templateCode = tempArr2[tempArr2.length - 1].trim();
					}
				}
				//this.templateCode = tempArr[tempArr.length - 1];
				console.log("Template Code is now::::::", this.templateCode);
			}
			if(currLocation.includes("PanelYesNo=N")){
				/// Added this to hide left panel in case only when udf fields are to be displayed and no any template change action - added by OnkarE on 21-May-2021 as per discussion with RohitP
				this.PanelYesNo = false;
				this.leftPadding = "15px";
			}
			/// Code changes to handle WFL Mode when deal entry page is opened in read only mode from Workflow blotter - OnkarE on 10-Nov-2020
			if (currLocation.includes("UCPWFL")) {
				var temparr1 = currLocation.split("&");
				console.log("Current location split array for WFL mode: ", temparr1);
				for (let i = 0; i < temparr1.length; i++) {
					if (temparr1[i].toUpperCase().includes("NOTEMASTERID")) {
						var tempArr2 = temparr1[i].split("=")
						this.iNoteMasterID = tempArr2[tempArr2.length - 1].replace("N:", "").trim();
					}
					if (temparr1[i].toUpperCase().includes("DEALNUM")) {
						var tempArr3 = temparr1[i].split("=")
						if (tempArr3[tempArr3.length - 1].toUpperCase().includes("D")) {
							this.iNoteDealID = tempArr3[tempArr3.length - 1].replace("D:", "").trim();
						} else if (tempArr3[tempArr3.length - 1].toUpperCase().includes("R")) {
							this.iNoteDealID = tempArr3[tempArr3.length - 1].replace("R:", "").trim();
						} else
							this.iNoteDealID = "";//null; //changed by devesh on 29-April-2021
					}
					if (temparr1[i].toUpperCase().includes("WORKFLOWMODE")) {
						var tempArr4 = temparr1[i].split("=")
						this.sUCPMode = tempArr4[tempArr4.length - 1].trim();
					}
					if(temparr1[i].toUpperCase().includes("QUEUEID")){
						/// Added this condistion to get queue no to get queue button details later - by OnkarE on 08-Apr-2021
						var tempArr5 = temparr1[i].split("=")
						this.QueueNo = tempArr5[tempArr5.length - 1].replace("Q:", "").trim();
					}
					if(temparr1[i].toUpperCase().includes("TOKENID")){
						/// Added this condistion to get queue no to get queue button details later - by OnkarE on 08-Apr-2021
						var tempArr5 = temparr1[i].split("=")
						this.sTokenId = tempArr5[tempArr5.length - 1].replace("T:", "").trim();
					}
					if(temparr1[i].toUpperCase().includes("USERGROUP")){
						var tempArrx = temparr1[i].split("=")
						this.userGroup = tempArrx[tempArrx.length - 1].trim();
					}
					if(temparr1[i].toUpperCase().includes("LOGINID")){
						var tempArry = temparr1[i].split("=")
						this.Login_Id = tempArry[tempArry.length - 1].trim();
					}

				}
				// this.api.DB_Check_Lock_Status((this.sTokenId ? this.sTokenId.toString() : ""), this.Login_Id).subscribe(
				// 	(response:any) =>{
				// 		if(response.response.length > 0){
				// 			console.log("Deal is alredy locked by ", response.response[0].lockedBy);
				// 			this.ErrorMessage = "Deal has been Locked by " + response.response[0].lockedBy;
				// 			console.log(this.ErrorMessage);
				// 		}
				// 		else{
				// 			this.api.DB_Insert_Lock_Status(this.sTokenId.toString(),this.Login_Id,"").subscribe(
				// 				(data:any)=>{
				// 					console.log("DB_Insert_Lock_Status", data);
				// 				}
				// 			);
				// 		}
						
				// 	}
				// );

				console.log("User and usergroup in UCPWFL mode are: ", this.Login_Id, this.userGroup);
			} else {
				/// Set UCP Mode to UCPQEN for normal case - changed by OnkarE on 10-Nov-2020
				this.sUCPMode = UCPMODE[UCPMODE.UCPQEN];
			}
			await this.getModuleData();
			console.log("UCPMODE is: ", this.sUCPMode)
			if (this.Embedded_Control.toUpperCase() == "MULTIUCP") {
				console.log("value of embedded control", this.Embedded_Control, (this.isNullOrUndefined(this.Multi_UCP_length ? "" : this.Multi_UCP_length)));
			}
			
			this.getShares();
			this.GetCustomerNames(); /// To get customer names list - by OnkarE on 06-Jan-2021
			this.initializeUCPControl(this.sUCPMode);

			this.dataLoadCheckObserver.subscribe(() => {
				if (this.controlsLoaded && this.functionsLoaded && this.udfDropdownsLoaded && this.functionsParametersFetched) {
					that.functionParameters.forEach((fp: string) => {
						const control = that.controls.filter((c: any) => c.fieldName === fp)[0];
						// console.log(data);
						// if (control) {
						//   that.udfFieldValueChange(control);
						// }
					});
				}
			});

			this.api.udfDropdownDataObserver.subscribe(
				(res: any[]) => {
					const start = performance.now();
					// console.log(res);
					if (res) {
						that.ddlTypes = [...new Set(res.map(f => f.type))];
						that.ddlTypes.forEach((d: any) => {
							// that.dropdowns[d] = res.filter((c: any) => c.type === d).map((c: any) => ({ code: c.code.trim() }));
							that.defaultDropdowns[d] = res.filter((c: any) => c.type === d).map((c: any) => ({
								code: c.code.trim()
							}));
							that.defaultSearchArrays[d] = res.filter((c: any) => c.type === d);

						});
					}
					console.log('set udf dropdowns', that.defaultSearchArrays, performance.now() - start);

				}
			);

			this.api.GetUDFFieldDropdownValues(this.selectedEntity, 0, this.Login_Id);
			// this.getShares(this.defaultSearchArrays);
			}catch(e){
				console.log("Error in CustomerGridValueChange :", e)
			}
		}
		async StartEQPrices(data){
			try{
			//this.signalr.connectSignalRCore();
			console.log("EQ Prices Starting:: ", data, this);
			let span = 0;
			let respFunc = this.priceFunctions.filter(e => e.ufD_Function_Name != 'QuoteResponseOutput');
			this.PricingMethod = "SignalR"
			console.log("Price functions are: ", this.priceFunctions, respFunc);
			await this.executeFunction(respFunc, "FUNCTION");
			console.log("RFQ List in deal entry: " ,this.rfqList);
			this.pricingID = 0 //this.commonfunctionsservice.getPricingID();
			var product = this.controls.filter(e => e.fieldName === 'TemplateName')[0].value;
			var tempArr = this.rfqList.split(",");
			/// Below code was used for OldSignalR Pricing
			// for (let i = 0; i < tempArr.length; i++) {
			// 	let RFQ = tempArr[i].split("-")[1];
			//     let CPTY = tempArr[i].split("-")[0];
			// 	this.signalr.ConnectNew(RFQ, CPTY, product, "StrikePercentage", i+1)
			// }
			// let id = setInterval(function(){
			// 	if(span >= 10){
			// 		clearInterval(id);
			// 	}
			// 	else {
			// 		this.executeFunction(respFunc, "FUNCTION");
			// 		span++;			  
			// 	}
			//   }.bind(this), 5000);
		}
		catch(e){
		  console.log("Error in StartEQPrices :", e)
			}
		}
		async getPricingIntersections(){
			try{
				await this.api.GetUCPToOtherControlIntersectionMapping(this.template.template_Id, "Pricing").subscribe(
					(response:any) => { 
					if (response.status === Status.Success) {
						const res = response.response;
						console.log("Price Intersection response is:::: ", res)
						this.PricingIntersectionFields = res;
						if(this.PricingIntersectionFields) {
							this.PricingOutputField = this.PricingIntersectionFields.filter(e => e.intersection_Field == 'PR_PRICING_OUTPUT') ? this.PricingIntersectionFields.filter(e => e.intersection_Field == 'PR_PRICING_OUTPUT')[0].ucP_Clone_Field : "";
							this.headerForQuoteField = this.PricingIntersectionFields.filter(e => e.intersection_Field == 'PR_TOKEN') ? this.PricingIntersectionFields.filter(e => e.intersection_Field == 'PR_TOKEN')[0].ucP_Clone_Field : "";
						}
						console.log("this.PricingOutputField ", this.PricingOutputField, this.headerForQuoteField)
					}
				});
			}
			catch (e) {
				console.log("Error in getPricingIntersections :", e)
			}
		}
		async SavePricingOrder(orderObj) {
			try{
			console.log("The data is::: ", orderObj)
			// this.controls.filter(e => e.fieldName == 'ParentID')[0].value = orderObj.rfq;
			// this.controls.filter(e => e.fieldName == 'ClientPrice')[0].value = orderObj.price;
			// this.controls.filter(e => e.fieldName == 'ClientYieldPerc')[0].value = orderObj.clientyield;
			for (let i = 0; i < this.PricingIntersectionFields.length; i++) {
				for (let j = 0; j < Object.keys(orderObj).length; j++) {
					if(this.PricingIntersectionFields[i].intersection_Field == Object.keys(orderObj)[j]){
						this.PricingIntersectionFields[i].value = orderObj[Object.keys(orderObj)[j]]
					}				
				}			
			}
			await this.AssignEQCToUCPIntersection();
			await this.CheckDraft();
			}
			catch(e){
				console.log("Error in SavePricingOrder :", e)
			}
		}
		async AssignEQCToUCPIntersection(){
			try{
				var isTransitive = false;
				this.PricingIntersectionFields.forEach(element => {
					let sUDFField = element.ucP_Clone_Field;
					for (let i = 0; i < this.controls.length; i++) {
						if (this.controls[i].fieldName === sUDFField) {
							this.controls[i].value = element.value;
							this.controls[i].currentValue = element.value;
						}
					}
				});
				console.log("Controls are::: ", this.controls)
			}
			catch (e) {
				console.log("Error in AssignEQCToUCPIntersection :", e)
			}
		}
		async getAllTemplatesforsearch(){
			try{
			//this.templates == []
			if(this.templates == ''   || this.templates == null || this.templates == undefined){
				const tempPromise = this._autodata.GetProdSchemeTemplateForSearch().toPromise();
				await tempPromise.then(  
				data => {  
					this.templates = data.response; 
					console.log( this.templates);
					// this.DefaultValue = data.GetProdSchemeTemplateForSearchResult[1].Template_Name //Added by Swati to display default template name
					console.log("GetProdSchemeTemplateForSearchResult");
					console.log( this.selectedValue);
					this.AllTemplatesSearchOptions = this.myControl.valueChanges ////added for autocomplete
					.pipe(
								startWith(''),
						map(value => typeof value === 'string' ? value : value.Template_Name),
						map(name => name ? this._filter1(name) : this.templates.slice())
					); }  
				);
			}
			}
			catch(e){
				console.log("Error in getAllTemplatesforsearch :", e)
			}
		}
		async searchTemplate(){
			try{
			console.log("Keyup event on typing::: ", this.selectedValue)
			//|| this.templates == []
			if(Number(this.selectedValue.length) === 1 && (this.templates == ''   || this.templates == null || this.templates == undefined)){
			const tempPromise1 = this._autodata.GetProdSchemeTemplateForSearch().toPromise();
			await tempPromise1.then(  
				data => {  
				this.templates = data.GetProdSchemeTemplateForSearchResult; 
				console.log( this.templates);
				this.AllTemplatesSearchOptions = this.myControl.valueChanges ////added for autocomplete
				.pipe(
							startWith(''),
					map(value => typeof value === 'string' ? value : value.Template_Name),
					map(name => name ? this._filter1(name) : this.templates.slice())
				); }  
				);
			}
		}
		catch(e){
			console.log("Error in searchTemplate :", e)
		}

		}
		onChange(selectedvalue: string) {
			try{
			console.log("Side Nav Page::: ", selectedvalue, this.selectedValue);
			// this.sidenavService.sendTemplate(this.selectedValue.ST_Template_ID);
			console.log("Template id set is ",this.selectedValue.ST_Template_ID);
			this.moduleData = {};
			this.template = {};
			this.moduleData.product_Id = this.selectedValue.Product_Id;
			this.moduleData.product_Name = this.selectedValue.Product_Name;
			this.template.template_Code = this.selectedValue.Template_Code;
			this.template.template_Id = this.selectedValue.ST_Template_ID.toString();
			this.template.Template_Name = this.selectedValue.Template_Name;
			this.DefaultModule = this.selectedValue.Product_Id;
			this.DefaultScheme = this.selectedValue.Scheme_Code;
			this.DefaultTemplate = this.selectedValue.ST_Template_ID.toString();
			this.changeModule();
			//this._autodata.set_template_id(this.selectedValue.ST_Template_ID);  //added by devesh
		}
		catch(e){
			console.log("Error in onChange :", e);
		}
		}
	
		private _filter1(value: string): any[] { //added for autocomplete display purpose
		try{
		const filterValue = value.toLowerCase();
	
		return this.templates.filter(option => option.Product_Name.toLowerCase().indexOf(filterValue ) > -1 || 
			option.Scheme_Name.toLowerCase().indexOf(filterValue ) > -1 || 
			option.Template_Name.toLowerCase().indexOf(filterValue ) > -1 );
	
		// return this.templates.filter(option => option.Template_Name.toLowerCase().includes(filterValue));
		} 
		catch(e){
			console.log("Error in _filter1 :", e)
		}
	} 

		ShowTemplatename1(option) {  //added for autocomplete display purpose
			try{
			console.log("selected search template:",option )
			//this.selectedValue=option;
			
			if (option!=null ||option!=undefined)
				return option.Template_Name;
			}
			catch(e){
				console.log("Error in ShowTemplatename1 :", e)
			}
		}
		ngOnChanges() {
			try{
			if ((this.Embedded_Control.toUpperCase() == "NATIVEFX" || this.Embedded_Control.toUpperCase() == "FUNDS") && !this.isNullOrUndefined(this.FX_Native_Fields)) {
				this.AssignParentControlValuesToUCPControl();
			}
			console.log("Changes triggered!! ")
		}catch (e){
			console.log("Error in ngOnChanges :", e)
		}
		}
		// ngAfterViewInit(){
			// 	this.assignControlSeq();
			// }
		
		getAllTemplates() {
			try {
				this.api.getAllTemplates(this.userGroup, this.Login_Id, String(this.selectedEntity), true, "DEAL ENTRY").then((data: any) => {
					if (data.status === Status.Success) {
						this.allTemplates = data.response;
					}
				});
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in getAllTemplates :"+error);
			} finally {}
		}
		trackData(_: number, control: any): any {
			try{
			return control.fieldName;
			}
			catch(e){
				console.log("Error in trackData :", e)
			}
		}

		initializeUCPControl(UCPMode) {
			try {
				const that = this;
				//// This function is similar to LoadAllEntityLinkedData in .net - OnkarE on 10-Nov-2020
				if (UCPMode === 'UCPQEN') {
					/// Added inside if condition for UCPQEN Mode - OnkarE on 10-Nov-2020 
					this.api.GetStaticAccessMatrix(this.userGroup, this.Login_Id, String(this.selectedEntity)).then(
						async (response: any) => {
							// console.log(response);
							if (response.status === Status.Success) {
								await this.getAllTemplatesforsearch();
								const res = response.response;
								this.SMADataObj = res != null ? res[0] : null;
								// console.log(res);
								if (this.SMADataObj != null) {
									that.EntityText = res[0].usaM_LabelEntityText;
									that.ModuleText = res[0].usaM_LabelModuleText;
									that.AssetText = res[0].usaM_LabelAssetText;
									that.ProductText = res[0].usaM_LabelProductText;
									that.HedgingTypeText = res[0].usaM_LabelHedgingTypeText;
									that.DefaultModule = res[0].usaM_DefaultModule ? res[0].usaM_DefaultModule : this.Moduleddl[0].product_Id;
									that.DefaultScheme = res[0].usaM_DefaultScheme;
									that.DefaultTemplate = res[0].usaM_DefaultTemplate;
									that.BtnDraftName = res[0].usaM_ButtonDraftCaption;
									that.BtnSaveName = res[0].usaM_ButtonSaveCaption;
									that.BtnRepriceName = res[0].usaM_ButtonRepriceCaption;
									that.BtnSimulationName = res[0].usaM_ButtonSimulationCaption;
									that.BtnClearName = res[0].usaM_ButtonClearCaption;
									// console.log(this.templates.filter(e => e.ST_Template_ID === that.DefaultTemplate)[0].Template_Name);
									// this.selectedValue = this.templates.filter(e => e.ST_Template_ID == that.DefaultTemplate)[0];
									// this.DefaultValue = this.templates.filter(e => e.ST_Template_ID == that.DefaultTemplate)[0].Template_Name;
									// that.module = this.templates.filter(e => e.ST_Template_ID == that.DefaultTemplate)[0].Product_Id;
									// this.DefaultScheme = this.templates.filter(e => e.ST_Template_ID == that.DefaultTemplate)[0].Scheme_Code;
									// this.template.template_Code = this.templates.filter(e => e.ST_Template_ID == that.DefaultTemplate)[0].Template_Code;
									// this.template.template_Id = this.templates.filter(e => e.ST_Template_ID == that.DefaultTemplate)[0].ST_Template_ID.toString();
									// this.template.Template_Name = this.templates.filter(e => e.ST_Template_ID == that.DefaultTemplate)[0].Template_Name;
								}
								else {
									that.EntityText = "Entity";
									that.ModuleText = "Module";
									that.AssetText = "Scheme";
									that.ProductText = "Template";
									that.HedgingTypeText = "Hedging Type";
									that.BtnDraftName = "Draft";
									that.BtnSaveName = "Save";
									that.BtnRepriceName = "Reprice";
									that.BtnSimulationName = "Simulation";
									that.BtnClearName = "Clear";
								}
								//  that.selectedBookingModel =  'Product';
								that.module = that.DefaultModule;

								if (this.Embedded_Control.toUpperCase() == "") { //this.Embedded_Control.toUpperCase()!="MULTIUCP" && this.Embedded_Control.toUpperCase()!="NATIVEFX"
									const testModule = this.Moduleddl.filter(a => a.product_Id === this.DefaultModule);
									this.moduleData = {};
									this.moduleData.product_Id = testModule[0].product_Id;
									this.moduleData.product_Name = testModule[0].product_Name
									console.log("Module data is: ", this.moduleData);
								}
								//that.scheme = Number(that.DefaultScheme);
								//that.template = Number(that.DefaultTemplate);         
								that.DefaultValuesAvailable = true;
								if (this.Embedded_Control.toUpperCase()=="MULTIUCP" || this.Embedded_Control.toUpperCase()=="NATIVEFX" || this.Embedded_Control.toUpperCase()=="FUNDS" || this.Embedded_Control.toUpperCase() == "POSTCARD") { //if multiucp go to template mapping as template id available
									//this.template=this.Multi_UCP_template;
									console.log("Multiucp template details ", this.Embedded_Template);
									// this.getTemplateMapping(); //commented by devesh on 9-Oct-2020
									this.module = this.Embedded_Template.product_Id;
									this.DefaultModule = this.Embedded_Template.product_Id;
									this.DefaultScheme = this.Embedded_Template.scheme_Code;
									this.DefaultTemplate = this.Embedded_Template.template_ID;
									this.DefaultSubtemplate = this.Embedded_Template.subtemplate_ID //to be changed later to subtemplate id
									//this.changeTemplate();
									this.changeModule(); //logic changed as told by Hemlata Anap to follow dotnet flow
								}
								// else if(this.FX_Native_Flag){ /// added this condition by OnkarE to handle FX Native flag on 08-Mar-2021
								// 	console.log("FX NATIVE FLAG IS::: ", this.FX_Native_Flag);
								// 	this.module = this.FX_Native_Product;
								// 	this.DefaultModule = this.FX_Native_Product;
								// 	this.DefaultScheme = this.FX_Native_TemplateData[0].scheme_Code;
								// 	this.DefaultTemplate = this.FX_Native_TemplateData[0].sT_Template_ID;
								// 	this.changeModule();
								// 	// this.DefaultSubtemplate = this.Multi_UCP_template.subtemplate_ID 
								// }
								else if (this.templateCode) {
									// Logic to handle AnotherUCP datatype
									console.log(this.templateCode, this.allTemplates);
									if (this.allTemplates != null && this.allTemplates.length > 0) {
										var currTemplate = this.allTemplates.filter((c: any) => c.template_Code === this.templateCode);
										console.log("Curr temp details are::: ", currTemplate, this.extraModules);
										// this.module = currTemplate[0].product_Id;
										this.moduleData = {};
										this.moduleData.product_Id = currTemplate[0].product_Id;
										this.moduleData.product_Name = this.extraModules.filter(e => e.product_Id == currTemplate[0].product_Id)[0].product_Name;
										// this.moduleData.product_Name = testModule1[0].product_Name
										this.DefaultModule = currTemplate[0].product_Id;
										this.DefaultScheme = currTemplate[0].scheme_Code;
										this.DefaultTemplate = currTemplate[0].template_ID;
										console.log("ANOTHER UCP", this.moduleData, this.DefaultModule, this.extraModules)
										this.changeModule();
									}
									// else {
									//   setTimeout(() => {
									//     var currTemplate = this.allTemplates.filter((c: any) => c.template_Code === this.templateCode);
									//     console.log("Curr temp details are after 3 seconds::: ", currTemplate);
									//     this.module = currTemplate[0].product_Id;
									//     this.DefaultModule = currTemplate[0].product_Id;
									//     this.DefaultScheme = currTemplate[0].scheme_Code;
									//     this.DefaultTemplate = currTemplate[0].template_ID;
									//     this.changeModule();
									//   }, 3000);
									// }
								} else { //normal flow in rest cases
									this.changeModule();
								}
							}
						}
					);
				} else if (UCPMode === 'UCPWFL') {
					/// GetNoteMasterNoteDealId functionality in .net is already implemented in angular on page load. So notemasterId is available in this case. - OnkarE - 10-Nov-2020

					this.api.GetStaticAccessMatrix(this.userGroup, this.Login_Id, String(this.selectedEntity)).then(
						(response: any) => {
							// console.log(response);
							if (response.status === Status.Success) {
								const res = response.response;
								this.SMADataObj = res != null ? res[0] : null;
								// console.log(res);
								if (this.SMADataObj != null) {
									that.EntityText = res[0].usaM_LabelEntityText;
									that.ModuleText = res[0].usaM_LabelModuleText;
									that.AssetText = res[0].usaM_LabelAssetText;
									that.ProductText = res[0].usaM_LabelProductText;
									that.HedgingTypeText = res[0].usaM_LabelHedgingTypeText;
									that.BtnDraftName = res[0].usaM_ButtonDraftCaption;
									that.BtnSaveName = res[0].usaM_ButtonSaveCaption;
									that.BtnRepriceName = res[0].usaM_ButtonRepriceCaption;
									that.BtnSimulationName = res[0].usaM_ButtonSimulationCaption;
									that.BtnClearName = res[0].usaM_ButtonClearCaption;
								}
								else {
									that.EntityText = "Entity";
									that.ModuleText = "Module";
									that.AssetText = "Scheme";
									that.ProductText = "Template";
									that.HedgingTypeText = "Hedging Type";
									that.BtnDraftName = "Draft";
									that.BtnSaveName = "Save";
									that.BtnRepriceName = "Reprice";
									that.BtnSimulationName = "Simulation";
									that.BtnClearName = "Clear";
								}
								// that.selectedBookingModel =  'Product';
								//that.scheme = Number(that.DefaultScheme);
								//that.template = Number(that.DefaultTemplate);         
								that.DefaultValuesAvailable = true;
								this.disabled = true; /// Added by OnkarE on 15-Feb-2021 to disable '+' button in custom tab and customer grid in UCPWFL mode
								this.getDealDetails();
								//this.DrawWFLButtons();
								//this.getQueueButtonDetails();
							}
						}
					);
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in initializeUCPControl :"+error);
			} finally {}




		}

		getDealDetails() {
			// Added by OnkarE on 10-Nov-2020
			try {
				console.log("Inside Get Deal details: ")
				this.api.GetDealDetails(this.iNoteMasterID ? this.iNoteMasterID : "", this.iNoteDealID ? this.iNoteDealID : "").subscribe(
					(response: any) => {
						if (response.status === Status.Success) {
							const res = response.response;
							console.log("Response of Get Deal Details is:  ", res, response)
							if(res && res.length > 0) {
								this.sTemplateCode = res[0].template_Code;
								this.iTemplateID = res[0].template_ID;
								// iSubTemplateID = Integer.Parse(res[0].Link_No.ToString)
								this.iTemplateSrNo = res[0].template_Sr_No;
								this.hedgingTypeinWFL = res[0].hedging_Type;
								// sRecepieFlag = res[0].RecepieFlag '<HemlataA on 16-Apr-2015 07:02:02 PM: >
								//this.Message = "ID:" + this.iNoteMasterID + " " + res[0].product_Name //to display product name in wfl mode /// Changed sProductName to Message by OnkarE on 17-dec-2021 as sProductName was not looking proper as per css
								this.sProductName = "ID:" + this.iNoteMasterID + " " + res[0].product_Name; // Assigned value to sProductName but not used in HTML side - OnkarE
								// Session.Add("oDealDetails" & SessionId, oDealDetails.Length)
								// Session.Add("DefaultHedgingType" & SessionId, res[0].Hedging_Type)
								this.DefaultSubtemplate = res[0].link_No; //added by devesh for subtemplate rendering on opening deal
								this.GetDynamicNoteDealsValues(this.iNoteMasterID ? this.iNoteMasterID : "", this.iNoteDealID ? this.iNoteDealID : ""); // Calling this method to get Customer Grid data in UCPWFL mode - by OnkarE on 18-Feb-2021
								this.SetStaticValuesFromTemplateCodeInMigrationMode(); /// Calling this method to set module and scheme - by OnkarE on 10-Nov-2020
							}
							else {
								this.sProductName = "Deal details not found.";
							}
							
						}
					}
				);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in getDealDetails :"+error);
			} finally {}

		}
		
		GetDynamicNoteDealsValues(iNoteMasterID, iNoteDealID) {
			// Calling this method to get Customer Grid data in UCPWFL mode - by OnkarE on 18-Feb-2021
			try {
				this.api.GetDynamicNoteDealsValues(iNoteMasterID, iNoteDealID).subscribe(
					(response: any) => {
						if (response.status === Status.Success) {
							const res = response.response;
							let custwflvalues;
							////////
							var parseString = require('xml2js').parseString;
							parseString(res, function(err, result) {
							console.dir(result,err);						
							//debugger;						
							//custwflvalues = (!this.isNullOrUndefined(result.NewDataSet.DUMMY) ? result.NewDataSet.DUMMY : []); //because few old templates have customtab1 in xml instead of customtab
							//Modified by RajeshC || 24-Feb-2023
							custwflvalues = (!(result.NewDataSet.DUMMY == null || result.NewDataSet.DUMMY == undefined) ? result.NewDataSet.DUMMY : []);
							//custwflvalues = (!(this.result.NewDataSet.DUMMY == null || this.result.NewDataSet.DUMMY == undefined)? result.NewDataSet.DUMMY : []);
						});
						this.CustGridWFLRow=custwflvalues; //added as it was giving error for direct assignment
							console.log('Customer Grid data in UCPWFL mode is', this.CustGridWFLRow, this.custGridTableRow);

						}
					}
				);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in GetDynamicNoteDealsValues :"+error);
			} finally {}
			// console.log(this.Entityddl);
		}

		DrawWFLButtons(){
			// Added by OnkarE on 08-Apr-2021
			try {
				this.api.GetQueueButtonDetails(this.QueueNo, "" ,this.userGroup).subscribe(
					(response: any) => {
						if (response.status === Status.Success) {
							const res = response.response;
							console.log('QueueButtonDetailsData is', res);
							this.queueButtonsData = res;
							this.dtWFLButtons=this.queueButtonsData.filter(btn=>btn.qbM_Enabled_YN=='Y');
							this.dtWFLButtons.map(i=>{i.showbtn=true,i.readonly=false});
							console.log("WFL buttons",this.dtWFLButtons);

						}
					}
				);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in DrawWFLButtons :"+error);
			} finally {}
		}

		Get_Avail_Login_For_PPAsync(){
			// Added by OnkarE on 14-Apr-2021
			try {
				this.api.Get_Avail_Login_For_PPAsync(this.Login_Id, this.template.template_Code, "" , "N").subscribe(
					(response: any) => {
						if (response.status === Status.Success) {
							const res = response.response;
							this.PPData = [];
							console.log('Get_Avail_Login_For_PPAsync is', res);
							res.forEach(element => {
								this.PPData.push({'PP': element.pP_Code})
							});
							// this.PPData = res.map(e => e.PP = e.pP_Code);
							console.log("PP data input is: ", this.PPData);
						}
					}
				);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in Get_Avail_Login_For_PPAsync :"+error);
			} finally {}
		}

		getentityData() {
			try {
				this.api.getEntityData(this.Login_Id).subscribe(
					(response: any) => {
						if (response.status === Status.Success) {
							const res = response.response;
							// console.log(res);
							this.Entityddl = res;
							this.entityData = res[0].entity_Name;
							this.selectedEntity = res[0].entity_ID;
							console.log("Selected Entity is:: ", this.selectedEntity)
						}
						// console.log(this.Entityddl);
					}
				);
				


			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in getentityData :"+error);
			} finally {}
			// console.log(this.Entityddl);
		}

		async getModuleData() {
			console.log();
			try {
				console.log("UCP MODE ISSSSSSSSS", this.sUCPMode);
				await this.api.getModuleData(this.userGroup, this.sUCPMode, this.Login_Id, String(this.selectedEntity)).then(
					(response: any) => {
						if (response.status === Status.Success) {
							const res = response.response;
							console.log(res);
							this.Moduleddl = res;
							this.extraModules = res;
							// this.moduleData = this.Moduleddl.filter(a => a.product_Id === this.DefaultModule);
							this.filteredOptions = this.moduleControl.valueChanges ////added for autocomplete
								.pipe(
									startWith(''),
									map(value => typeof value === 'string' ? value : value.product_Name),
									map(name => name ? this._filter(name) : this.Moduleddl.slice())
								);
							console.log("Module Data iss:::::::::::: ", this.filteredOptions, this.Moduleddl);
						}
					}
				);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in getModuleData :"+error);
			} finally {}
			// console.log(this.Moduleddl);
		}

		async GetCustomerNames() {
			/// Added by OnkarE on 05-Jan-2021
			try {
				await this.api.GetCustomerNames(String(this.selectedEntity), "", this.Login_Id).then(
					(response: any) => {
						if (response.status === Status.Success) {
							const res = response.response;
							this.customersList = res;
							console.log("CustomerGetResponse is:::: ", response)
							// if(this.loader == true){
							// 	debugger;
							// 	//this.loader = false;
							// }
						}
					}
				);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in GetCustomerNames :"+error);
			} finally {}
			// console.log(this.Moduleddl);
		}

		private _filter(value: string): any[] { //added for autocomplete display purpose
			try{
			const filterValue = value.toLowerCase();
			return this.Moduleddl.filter(option => option.product_Name.toLowerCase().includes(filterValue));
			}
			catch(e){
				console.log("Error in _filter :", e);
			}
		}
		ShowProductName(option) { //added for autocomplete display purpose
			try{
			console.log("selected product:", option)
			if (option != null || option != undefined)
				return option.product_Name;
			}
			catch (e){
				console.log("Error in ShowProductName :", e)
			}
		}
		getSchemeData(CBOModule: any) {
			try {
				// if(this.recFlag){
				//   
				//   this.changeScheme();
				// }
				// else {
				this.api.getSchemeData(CBOModule, this.sUCPMode, this.Login_Id, String(this.selectedEntity), this.userGroup).then(
					(response: any) => {

						if (response.status === Status.Success) {
							const res = response.response;
							// console.log(res);
							if (res == null || res == "" || res.length == 0) {
								// alert('Scheme is not mapped to this module!')
								this.DefaultValuesAvailable = false;
							} else {
								this.DefaultValuesAvailable = true;
								this.Schemeddl = res;
								// console.log(this.Schemeddl);
								if (this.recFlag || this.blnMigrationSuccessful) {
									// this.scheme = this.iSchemeCode;
									// var tempscheme = res.filter((c: any) => c.scheme_Code === this.iSchemeCode);
									// this.sschemeAlias = tempscheme[0].scheme_Alias;

									this.scheme = (this.Schemeddl.filter((c: any) => c.scheme_Code === this.iSchemeCode))[0];
									this.sschemeAlias = this.scheme.scheme_Alias;
								} else {
									var sscode = Number(this.DefaultModule === CBOModule ? this.DefaultScheme : res[0].scheme_Code);
									this.scheme = res.filter((c: any) => c.scheme_Code === sscode)[0];
									if(this.scheme == undefined || this.scheme == ''){
										this.scheme = {scheme_Alias: '', scheme_Code: '', scheme_Name:''};
										this.scheme.scheme_Alias = this.Schemeddl[0].scheme_Alias;
										this.scheme.scheme_Code = this.Schemeddl[0].scheme_Code;
										this.scheme.scheme_Name = this.Schemeddl[0].scheme_Name;
									}
									this.sschemeAlias = this.scheme ? this.scheme.scheme_Alias : this.Schemeddl[0].scheme_Alias ;
									console.log("Selected Scheme is...................", this.sschemeAlias, res);
								}
								// console.log("Scheme Data is: ", this.scheme, this.Schemeddl)
								// this.schemeData = this.scheme;
								this.schemeOptions = this.schemeControl.valueChanges ////added for autocomplete
									.pipe(
										startWith(''),
										map(value => typeof value === 'string' ? value : value.scheme_Name),
										map(name => name ? this._filterScheme(name) : this.Schemeddl.slice())
									);
								console.log("Scheme options:: ", this.schemeOptions);
								this.changeScheme();
							}
						}
					}
				);
				//}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in GetSchemeData :"+error);
			} finally {}
			// console.log(this.Schemeddl);
		}

		private _filterScheme(value: string): any[] { //added for autocomplete display purpose
			try{
			const filterValue = value.toLowerCase();
			return this.Schemeddl.filter(option => option.scheme_Name.toLowerCase().includes(filterValue));
			}
			catch(e){
				console.log("Error in _filterScheme :", e)
			}
		}
		ShowSchemeName(option) { //added for autocomplete display purpose
			try{
			console.log("selected scheme:", option)
			if (option != null || option != undefined)
				return option.scheme_Name;
			}
			catch(e){
				console.log("Error in ShowSchemeName :", e)
			}
		}

		getTemplateData(schemeId: any) {
			try {
				// if(this.recFlag){
				//   
				//   this.changeTemplate();
				// }
				// else {
				switch (this.Embedded_Control.toUpperCase()) {
					case "MULTIUCP":
						this.Application_type = "MULTIUCP";
						this.ApplTypeFlag = true;
						//this.IsSavingProcedureInSingleAction=true;
						break;
					case "POSTCARD":
						this.Application_type = "POSTCARD";
						this.ApplTypeFlag = true;
						//this.IsSavingProcedureInSingleAction=true;
						break;
					default:
						this.Application_type = "DEAL ENTRY";
						this.ApplTypeFlag = false;
						// console.log("Save Visibility Check: ", this.SMADataObj, this.ShowStaticField)
						// if(this.SMADataObj.saveVisibility.toUpperCase() == 'TRUE' && this.ShowStaticField == true) {
						// 		this.IsSavingProcedureInSingleAction = false;
						// }
						// else 
						// 	this.IsSavingProcedureInSingleAction= true;
						break;
				}
				console.log("Loading templates with current scheme is........", schemeId, this.scheme.scheme_Code, Number(schemeId), Number(this.scheme.scheme_Code), this.DefaultScheme);
				this.api.getTemplateData(schemeId.toString(), this.Application_type, this.sUCPMode, this.Login_Id, String(this.selectedEntity), this.userGroup).then(
					(response: any) => {

						if (response.status === Status.Success) {
							const res = response.response;
							// console.log(res);
							this.Templateddl = res;
							this.TemplateData = res;
							// console.log(this.Schemeddl, '1');
							console.log("temp.......->", this.DefaultScheme, schemeId.toString());
							console.log("Temp data for recipe", this.TemplateData);
							if (res == null || res == "" || res.length == 0) {
								this.DefaultValuesAvailable = false;
							} else {
								this.DefaultValuesAvailable = true;
								var defTemp = this.DefaultScheme === schemeId.toString() ? this.DefaultTemplate : res[0].template_Id.toString();
								console.log("Template condition checking...... ", this.DefaultTemplate, res[0].template_Id.toString(), defTemp);
								if (this.recFlag || this.blnMigrationSuccessful || this.sUCPMode === 'UCPWFL')
									this.template = this.Templateddl.filter((t: {
										template_Id: string;
									}) => t.template_Id + '' === (this.iTemplateID.toString()))[0];
								else
									this.template = this.Templateddl.filter((t: {
										template_Id: string;
									}) => t.template_Id + '' === (defTemp))[0];
								console.log("tempplate code again", this.template);
								//this.getTemplateMapping(); coomented by devesh 0n 9-Oct-2020 as its called inside change template
								this.changeTemplate();
							}
							this.templateOptions = this.templateControl.valueChanges ////added for autocomplete
								.pipe(
									startWith(''),
									map(value => typeof value === 'string' ? value : value.template_Name),
									map(name => name ? this._filterTemplate(name) : this.Templateddl.slice())
								);
							console.log("Template options:: ", this.templateOptions);

						}
					}
				);
				//}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in getTemplateData :"+error);
			} finally {}
		}

		private _filterTemplate(value: string): any[] { //added for autocomplete display purpose
			try{

			
			const filterValue = value.toLowerCase();
			return this.Templateddl.filter(option => option.template_Name.toLowerCase().includes(filterValue));
			}catch(e){
				
				console.log("Error in _filterTemplate :", e)
			}
		}
		ShowTemplateName(option) { //added for autocomplete display purpose
			try{

			
			console.log("selected template:", option)
			if (option != null || option != undefined)
				return option.template_Name;
			}catch(e){
				
				console.log("Error in ShowTemplateName :", e)
			}
		}

		getShares() {
			try {
				const that = this;
				this.api.GetShares().subscribe(
					(response: any) => {
						that.shareArray = response;
						for (var i = 0; i < that.shareArray.length; i++) {
							var obj = that.shareArray[i];
							obj.id = obj.code
							obj.code = obj.longName;
						}
						console.log(that.shareArray)
					}
				);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in getShares :"+error);
			} finally {}

		}
		getTemplateMapping() {
			try {
				let Apptype:string="";
				switch(this.Embedded_Control.toUpperCase())
					{
						case "MULTIUCP":Apptype="Multi UCP";
						break;
						case "POSTCARD":Apptype="Postcard";
						break;
						default: Apptype="Deal Entry";
						break; 
					}
					//(this.Embedded_Control=="MULTIUCP"?'Multi UCP':'Deal Entry')
				this.api.getTemplateMapping(this.template.template_Id,Apptype, this.template.template_Name, this.sUCPMode, this.Login_Id, this.userGroup).then(
					(response: any) => {
						if (response.status === Status.Success) {
							const res = response.response;
							console.log("Get template mapping response::: ", res);
							if(res) { /// Added by OnkarE on 30-Dec-2021
								this.showPricingGrid = res[0].showPricingGrid;
								this.PricingMode = res[0].pricingMode;
								this.hideEmptyFields = res[0].hideEmptyFields;
								if(this.PricingMode == 'EQ'){
									/// This is to start signalR in case of EQ Pricing and get EQ Pricing intersections - Added by OnkarE on 27-Sept-2021
									//this.signalr.connectSignalRCore();
									this.getPricingIntersections();
								}
								console.log("ShowPricing grid.... ", this.showPricingGrid);
								if (this.Embedded_Control =="MULTIUCP" || this.Embedded_Control=="NATIVEFX" || this.Embedded_Control =="POSTCARD") {
									this.RowSize = res[0].udF_RowSize;
									this.ColSize = res[0].udF_ColSize;
									this.layoutColWidth = Number(res[0].columnWidth) != 0 ? res[0].columnWidth : 160;
									this.layoutLblWidth = Number(res[0].labelWidth) != 0 ? res[0].labelWidth : 160;
								} else {
									this.RowSize = res[0].rowSize != null ? res[0].rowSize : 4;
									this.ColSize = res[0].colSize != null ? res[0].colSize : 10;
									this.layoutColWidth = Number(res[0].columnWidth) != 0 ? res[0].columnWidth : 160;
									this.layoutLblWidth = Number(res[0].labelWidth) != 0 ? res[0].labelWidth : 160;
								}
								if (Number(this.layoutLblWidth) === 0 && Number(this.layoutColWidth) > 0)
									this.totalWidth = Number(this.layoutColWidth) + 50;
								else if (Number(this.layoutColWidth) === 0)
									this.totalWidth = 185;
								else 
									this.totalWidth = 185;

								this.tabSeqMode = res[0].tabSeqMode;
								this.orientation = res[0].orientation; // Added by OnkarE on 10-Apr-2023
							}
							
							
							console.log("Layout Col width and lbl width are:: ", Number(this.layoutColWidth), Number(this.layoutLblWidth), this.totalWidth);
							// this.totalWidth = this.layoutColWidth + this.layoutLblWidth;

							console.log("Colsize and Rowsize are: ",this.ColSize, this.RowSize);
						}
						else{
							console.error(response.response);
							//this.api.WriteErrorLogs("Error occured in getTemplateMapping :"+response.response);
						}
					}
				);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in getTemplateMapping :"+error);
			} finally {}

		}

		setTabIndexSeq(){
			// Added by OnkarE on 17-Nov-2021 
			try{
				if(this.tabSeqMode == 'Vertical' || this.tabSeqMode == '' || this.tabSeqMode == null || this.tabSeqMode == undefined) {
					/// Setting tab index to zero to work tab functionality in normal case
					this.controls.forEach(element => {
						element.tabIndex = 0;
					});
				}
				else if(this.tabSeqMode == 'Horizontal') {
					let iTabIndexCount = 0;
					for (let i = 1; i <= 30; i++) {
						for (let j = 1; j <= 50; j++) {
							this.controls[iTabIndexCount].tabIndex = ((j*30) + i);
							iTabIndexCount = iTabIndexCount + 1;
						}		
					}
				}
				else if(this.tabSeqMode == 'Custom') {
					// Do nothing as tab index will be set from field details 
				}
			}
			catch (e) {

			}
		}

		changeModule() {
			try {
				console.log("Module is changing, current scheme is...................!!!!!!!!!!!!!!!!!!!!", this.moduleData);
				console.log(this.Moduleddl, this.DefaultModule)
				this.scheme = null;
				this.template = '';
				this.Schemeddl = [];
				this.Templateddl = [];
				//this.Schemeddl.length = 0;
				//this.Templateddl.length = 0;
				this.controlsLoaded = false;
				this.udfDropdownsLoaded = false;
				this.functionsLoaded = false;
				this.functionsParametersFetched = false;
				this.tableRow = [];
				//this.Message = '';
				// console.log('Module', this.module);
				console.log("sUCPMode", this.sUCPMode);

				switch (this.sUCPMode) {
					case 'UCPQEN':
						this.module = this.moduleData ? this.moduleData.product_Id : this.DefaultModule;
						break;
					default:
						this.module = this.iProductId.toString();
						break;
				}
				console.log("Passing modules as", this.module);


				if (this.module) {

					this.getSchemeData(this.module);
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in changeModule :"+error);
			} finally {}

		}

		changeScheme() {
			try {
				// console.log("Scheme Data is: ", this.schemeData)
				this.template = '';
				this.Templateddl = [];
				//this.Templateddl.length = 0;
				this.controlsLoaded = false;
				this.udfDropdownsLoaded = false;
				this.functionsLoaded = false;
				this.functionsParametersFetched = false;
				this.tableRow = [];
				//this.Message = '';

				switch (this.sUCPMode) {
					case 'UCPQEN':
						// this.scheme = Number(this.DefaultScheme)
						break;
					default:
						this.scheme.scheme_Code = this.iSchemeCode;
						this.scheme.scheme_Alias = this.sschemeAlias ? this.sschemeAlias : ""; 
						this.scheme.scheme_Name = this.sschemeName ? this.sschemeName : ""; 
						break;
				}
				console.log('Scheme', this.scheme);
				if (this.scheme) {
					this.getTemplateData(this.scheme.scheme_Code);
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in changeScheme :"+error);
			} finally {}

		}

		sort_by_key(array, key) {
			return array.sort(function(a, b) {
				var x = a[key];
				var y = b[key];
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
		}
		async changeTemplate() {
			try {
				const that = this;
				this.globalWarningArr = [];
				this.controlsLoaded = false;
				this.udfDropdownsLoaded = false;
				this.functionsLoaded = false;
				this.functionsParametersFetched = false;
				this.tableRow = [];
				this.ErrorMessage = '';
				this.loader = true;
				this.dropdowns = [];
				this.searchArrays = [];
				//this.Message = ''
				this.custGridTableRow = [];
				this.controls=null; //added by devesh on 8-April-2021 for layout related changes
				this.CustomerGrid.columns=[]; //added by devesh on 26-July-2021 for customergrid related changes
				this.CustomerGrid.data=[];
				this.oViewSchedule=[];
				this.oProductSchedule=[];

				switch (this.sUCPMode) {
					case 'UCPQEN':
						this.sTemplateCode = this.template.template_Code;
						this.iTemplateID = this.template.template_Id;
						// this.template.template_Id = Number(this.DefaultTemplate)
						break;
					default:
						// debugger
						// if(this.template === '')
						//   this.template = {};
						this.template.template_Id = this.iTemplateID;
						this.template.template_Code = this.sTemplateCode;
						break;
				}
				this.selectedValue = {};
				this.selectedValue.Product_Id = this.module;
				// this.selectedValue.Product_Name; = ;
				this.selectedValue.Template_Code = this.template.template_Code;
				this.selectedValue.ST_Template_ID = this.template.template_Id ;
				this.selectedValue.Template_Name = this.template.template_Name;
				this.selectedValue.Scheme_Code = this.scheme.scheme_Code;

				const headerOptions = new HttpHeaders({
					'Content-Type': 'application/json'
				});
				console.log("REC Data for template", this.template);
				this.getTemplateMapping();



				if (this.template.saveChild_YN === 'Y') {
					this.IsRecipeMode = true;
				} else {
					this.IsRecipeMode = false;
				}

				this.GetMappedTabsDetails(); /// Added by OnkarE on 9-Feb-2021 to get tabs list

				await this.api.GetFunctionDetails(this.template.template_Id).then( //to load all functions data to be executed on template change as list remains same irrespective of subtemplate //removed async await here             
					(response: any) => {
						const start = performance.now();
						if (response.status === Status.Success) {
							that.functions = [];
							that.functionParameters = [];

							that.customTabFuntions = [];
							that.functionTargetFields = [];
							console.log("Response is.........", response);
							if (response.response) {
								var res: any[] = response.response;
								res = this.sort_by_key(res, 'priority');
								console.log("Sorted function array:: ", res);
								this.functions_all = res;
								sessionStorage.removeItem("oFunctionDefinition");
								sessionStorage.setItem("oFunctionDefinition",JSON.stringify(this.functions_all));
								// console.log(res);
								const functionTypes = [...new Set(res.map(f => f.ufD_Function_TYpe))];
								// console.log(functionTypes);
								const functions = [];
								const keywords = ['IF', '=', '>', '<', '(', ')', ','];
								functionTypes.forEach(ft => {
									var custArr = res.filter(fn => fn.functionMode === 'Custom');
									this.customerGridfunctions = res.filter(fn => fn.functionMode === 'Client');
									console.log("Custom Array is: ", custArr);

									functions[ft] = res.filter(f => f.ufD_Function_TYpe === ft).map(f => {
										let params: any[] = [];
										let eventparams: any[] = [];
										let customParams: any[] = [];

										if (f.event.trim() != "" && f.functionMode != 'Custom') { //Added by Swati to fetch seperate button linked functions
											eventparams = [...new Set(f.ufD_CSV_Input.toUpperCase().split('~').filter((i: string) => i.length))];
											//this.buttonLinkedfunctions.push(...f);
										} else {
											params = [...new Set(f.ufD_CSV_Input.split('~').filter((i: string) => i.length))];
											if (f.functionMode === 'Custom') {
												customParams = [...new Set(f.ufD_CSV_Input.split('~BA.').filter((i: string) => i.length))];
												console.log("CUSTOM PArams:::: ", customParams)
											}

										}
										let Target = [...new Set(f.ufD_Target_Field.split('~').filter((i: string) => i.length))];
										if (f.ufD_Function_TYpe === ft) {
											if (ft === 'FORMULA') {
												params = params.filter((p: any) => !(keywords.includes(p) || this.IsValidNumber(p))); /// to be checked
											} else if (ft === 'FUNCTION') {

												if (f.ufD_Function_Name == 'Split_csv_string') {
													//debugger;
												}
												params = params.filter((p: any) => !(keywords.includes(p) || this.IsValidNumber(p)));
												customParams = customParams.filter((p: any) => !(keywords.includes(p) || this.IsValidNumber(p)));
											} else if (ft === 'WCF SERVICE') {
												//debugger
												params = params.filter((p: any) => !(keywords.includes(p) || this.IsValidNumber(p)));
												//customParams = customParams.filter((p: any) => !(keywords.includes(p) || this.IsValidNumber(p)));
											}

											// console.log(params);
											if (params != undefined)
												that.functionParameters.push(...params);
											if (customParams != undefined && this.template.basket_Size == "7")
												that.customTabFuntions.push(...customParams);
											if (Target != undefined)
												that.functionTargetFields.push(...Target);
											if (eventparams != undefined)
												that.buttonLinkedfunctions.push(...eventparams);
											return f;
										}
									});
								});
								that.functions = functions;
								that.functionParameters = [...new Set(that.functionParameters)];
								that.buttonLinkedfunctions = [...new Set(that.buttonLinkedfunctions)];
								console.log("All Functions-------------------------------------> ", functions, that.functionParameters, that.customTabFuntions);
								console.log("All button linked Functions-------------------------------------> ", functions, that.buttonLinkedfunctions);
								//debugger;
								this.parseFormula(functions['FORMULA']);
								that.functionsLoaded = true;
								that.functionsParametersFetched = true;
								that.dataLoadCheck.next(true);
								//this.loader = false; //commented by devesh for loader changes
							} else {
								//this.loader = false; //commented by devesh for loader changes
							}

						}
						console.log('set functions', performance.now() - start);
					}
				);

				this.GetCustomStaticTabDetails(this.template.template_Id);
				await this.GetIntersectionMappingDetails(this.template.template_Id); //Added here by Devesh on 11-Jun-2021 and removed from setudf
				this.FillSubTemplate(); //read layout and function execution inside subtemplate change as default values,visibility,etc might change depending on subtemplate      
				this.fillHedgeType(); /////changes to be made for loading customer grid and its functions depending on hedging type later

				if (this.recFlag) {
					this.SetDataContractForDealSave();
				}
				//this.loader = false;
				this.cgrowindex = -1;
			} catch (error) {
				console.log(error);
				//this.api.WriteErrorLogs("Error occured in changeTemplate :"+error);
			}
		}

		async FillSubTemplate() { //put async await here as response was not being received before read layouts function in changesubtemplate
			try {
				console.log("Loading sub template details for template...", this.template.template_Code);
				this.loader = true; //added by devesh for loader changes
				await this.api.GetSubTemplate(String(this.template.template_Id)).then(response => {
					if (response.status === Status.Success) {
						const res = response.response;
						this.subTemplateData = res;
						if (this.subTemplateData.length > 1) { //added as always one row is returned if no subtemplate is mapped with tom_id=0
							this.isSubTemp = true;
							if (!this.isNullOrUndefined(this.DefaultSubtemplate) && Number(this.DefaultSubtemplate) != 0) { //to assign default subtemplate received from deal details or multiucp
								this.subTemplate = this.subTemplateData.filter(sub => sub.toM_ID == this.DefaultSubtemplate)[0];
							} else {
								this.subTemplate = this.subTemplateData[0]; //else setting first value as default
							}
						} else {
							this.subTemplate = this.subTemplateData[0];
							this.isSubTemp = false;
						}
						console.log("Sub template data: ", this.subTemplateData);
						this.changesubtemplate();

						this.subTemplateOptions = this.subTempControl.valueChanges.pipe(
							startWith(''),
							map(value => typeof value === 'string' ? value : value.template_Name),
							map(name => name ? this._filterSubTemplate(name) : this.subTemplateData.slice())
						);
						console.log("Sub template options: ", this.subTemplateOptions);

					} else {
						this.isSubTemp = false;
						console.log("Error while getsubtemplate service response", response.response);
						this.loader = false; //added by devesh for loader changes
					}

				});
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in FillSubtemplate :"+error);
			} finally {}



			//this.changesubtemplate();
		}
		_filterSubTemplate(value: string): void {
			try{
			const filterValue = value.toLowerCase();
			return this.subTemplateData.filter(option => option.toM_Sub_Template_Name.toLowerCase().includes(filterValue));
			}catch(e){
				console.log("Error in _filterSubTemplate :", e)
			}
		}
		ShowSubTemplateName(option): void {
			try {
			console.log("Selected sub template: ", option);
			if (option !== null && option !== undefined)
				return option.toM_Sub_Template_Name;
			}catch(e){
				console.log("Error in ShowSubTemplateName :", e)
			}
		}
		fillHedgeType() {
			try {
				let tempHedgingData = this.template ? this.template.hedging_Type ?  this.template.hedging_Type.toString().split("") : [] : [];
				let strHedgingType = [];
				this.bookingModelData = ["Back to Back", "Dynamic", "Market", "Order", "Pooling", "Product", "RFQ", "UDF"];
				if (this.template !== null && this.template !== undefined) {
					if (this.template.hedging_Type !== null) {
						//console.log("Hedging type array::: ", this.template.hedging_Type.toString().split(""), this.SMADataObj.usaM_HedgingTypeVisiblity.toString().split(""))
						if(tempHedgingData[tempHedgingData.length - 1] === 'Y' || this.SMADataObj == null){
							strHedgingType = this.template.hedging_Type.toString().split("");
						} 
						else {
							strHedgingType = this.SMADataObj.usaM_HedgingTypeVisiblity.toString().split("");
						}

						// if (strHedgingType.length >= 1) strHedgingType[0] === "Y" ? this.isHedgingHidden = true : this.isHedgingHidden = false;
						if (strHedgingType.length >= 2) {
							if (strHedgingType[1] === "N") {
								this.bookingModelData.splice(this.bookingModelData.indexOf("Back to Back"), 1);
							}
						} else {
							this.bookingModelData.splice(this.bookingModelData.indexOf("Back to Back"), 1);
						}
						if (strHedgingType.length >= 3) {
							if (strHedgingType[2] === "N") {
								this.bookingModelData.splice(this.bookingModelData.indexOf("Dynamic"), 1);
							}
						} else {
							this.bookingModelData.splice(this.bookingModelData.indexOf("Dynamic"), 1);
						}
						if (strHedgingType.length >= 4) {
							if (strHedgingType[3] === "N") {
								this.bookingModelData.splice(this.bookingModelData.indexOf("Order"), 1);
							}
						} else {
							this.bookingModelData.splice(this.bookingModelData.indexOf("Order"), 1);
						}
						if (strHedgingType.length >= 5) {
							if (strHedgingType[4] === "N") {
								this.bookingModelData.splice(this.bookingModelData.indexOf("Pooling"), 1);
							}
						} else {
							this.bookingModelData.splice(this.bookingModelData.indexOf("Pooling"), 1);
						}
						if (strHedgingType.length >= 6) {
							if (strHedgingType[5] === "N") {
								this.bookingModelData.splice(this.bookingModelData.indexOf("Product"), 1);
							}
						} else {
							this.bookingModelData.splice(this.bookingModelData.indexOf("Product"), 1);
						}
						if (strHedgingType.length >= 7) {
							if (strHedgingType[6] === "N") {
								this.bookingModelData.splice(this.bookingModelData.indexOf("RFQ"), 1);
							}
						} else {
							this.bookingModelData.splice(this.bookingModelData.indexOf("RFQ"), 1);
						}
						if (strHedgingType.length >= 8) {
							if (strHedgingType[7] === "N") {
								this.bookingModelData.splice(this.bookingModelData.indexOf("Market"), 1);
							}
						} else {
							this.bookingModelData.splice(this.bookingModelData.indexOf("Market"), 1);
						}
						if (strHedgingType.length >= 9) {
							if (strHedgingType[8] === "N") {
								this.bookingModelData.splice(this.bookingModelData.indexOf("UDF"), 1);
							}
						} else {
							this.bookingModelData.splice(this.bookingModelData.indexOf("UDF"), 1);
						}
					}
					if(tempHedgingData[tempHedgingData.length - 1] === 'Y' ||  this.SMADataObj == null){
						this.selectedBookingModel = this.bookingModelData[0];
					} 
					else {
						this.selectedBookingModel = this.SMADataObj.usaM_DefaultHedgingType ? this.SMADataObj.usaM_DefaultHedgingType :  this.bookingModelData[0];
					}
					
					if(this.sUCPMode === 'UCPWFL'){
						this.selectedBookingModel = this.hedgingTypeinWFL ? this.hedgingTypeinWFL :  this.bookingModelData[0];
					}
				}

				

				this.bookingModelOptions = this.bookingModelControl.valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value),
						map(name => name ? this._filterBookingModel(name) : this.bookingModelData.slice())
					);
				console.log("Booking Model options:: ", this.bookingModelOptions, this.bookingModelData, this.selectedBookingModel);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in FillHedtype :"+error);
			} finally {}

		}

		_filterBookingModel(value: string): any[] {
			try {
			const filterValue = value.toLowerCase();
			return this.bookingModelData.filter(option => option.toLowerCase().includes(filterValue));
			}	catch(e){
			console.log("Error in _filterBookingModel :", e)
			}
		}

		ShowBookingModel(option) {
			try {
			console.log("Selected booking model: ", option);
			if (option != null && option != undefined)
				return option;
			}catch(e){
				console.log("Error in ShowBookingModel :", e)
			}
		}

		assignFormatValuesToUDFFields(control) {
			try {
				var tempArr = this.controls.filter(e => e.sourcingLink == control.fieldName);
				if (!this.isNullOrUndefined(tempArr)) {
					tempArr.forEach(element => {
						element.udF_Format = this.getRoundingRate(control.value, control.dataType, element.dataType);
						element.value = this.formatKLMB(element.value, element.udF_Format);
					});
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in assignFormatValuesToUDFFields :"+error);
			} finally {}
		}

		async udfFieldValueChange(_control: any, event ? : string) {
			//this.loaderService.display(true);
			try {
				let functionsOnChangedControl = [];
				let spsOnChangedControl = [];
				let formulasOnChangedControl = [];
				let wcfservicesOnChangedControl = [];
				let control;
				// console.log(" udfFieldValuChnange function started the execution with control ::::::::::::::::::::: ", control, typeof(control));
				this.ErrorMessage = '';
				//this.Message = '';
				if(!this.isNullOrUndefined(_control.loader))
				{
				control=_control.control;
				console.log("loader started from udffieldvalue change",_control);
				this.loader = true;
				}
				else
				{
					control=_control;
				}
				//console.log("ALL Function params",this.functionParameters,"functions",this.functions);
				if (control.dataType.toUpperCase() == 'CURRENCY' || control.dataType.toUpperCase() == 'CURRENCY PAIR') {
					this.assignFormatValuesToUDFFields(control);
				}
				if (this.isNullOrUndefined(event)) {
					if (control.dataType.toUpperCase() == 'STATIC BUTTON') { //Added by swati for button linked functions //&& this.buttonLinkedfunctions.includes(control.fieldName)
						switch (control.sourcingLink.toUpperCase()) {
							case 'DRAFT':
								this.CheckDraft();
								break;
							case 'SAVE':
								this.InsertTokenDatasavebtn();
								break;
							case 'SIMULATION':
								break;
							case 'REPRICE':
								this.btnReprice_Click();
								break;
							case 'CLEAR':
								this.ClearTemplateFields();
								break;
							default:
								this.InvokeButtonLinkedFunctions(control.fieldName);
								break;
						}
					}
					else if (this.functionParameters.includes(control.fieldName) || this.functionParameters.includes(String(control.fieldName).toUpperCase())) { //added toupper case only for formula as csv input is in uppercase

						if (this.functions_all) {
							functionsOnChangedControl = this.functions_all.filter(f => f.functionMode == 'Product' && f.event == '' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK').filter((f: any) => f.ufD_CSV_Input.split('~').includes(control.fieldName) || f.ufD_CSV_Input.split('~').includes(String(control.fieldName).toUpperCase())); //added hardblock filter not to allow harblock func exe on tab out //made to upper case only for formula as csvinput is also in uppercase
						}
						
						await this.InvokeWarningFunctions("UDF",control.fieldName,-1)
						if(this.warning_triggered==true){
						console.log("Warning triggered in UDF Fields");	
						//    this.loader = false;
						//    return;
						}
						if (functionsOnChangedControl.length) {
							await this.executeFunction(functionsOnChangedControl, "");
						}
					} 
				} else if (!this.isNullOrUndefined(event)) { //this.buttonLinkedfunctions.includes(control.fieldName.toUpperCase()
					// else if(!this.isNullOrUndefined(event) && this.buttonLinkedfunctions.filter(f => f.functionMode == 'Product' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK' && f.event == event )){

					await this.executeFunction(this.functions_all.filter((f: any) => f.event == event).filter((f: any) => f.ufD_CSV_Input.split('~').includes(control.fieldName)), "", null, event)

				}
				if(this.Embedded_Control == 'NATIVEFX' || this.Embedded_Control == "Funds"){
					this.AssignUCPControlValuesToParentControl(); // Added by OnkarE on 24-Mar-2021 - to handle FX native intersctions
				}
				this.InvokeCustomTabUDFMETIntersection(control); ///for custom tab intersection
				await this.invokeCustomTabFunctions(control.fieldName, -1); ///for custom tab functions
				await this.invokeCustomerGridFunctions(control.fieldName, -1); ///for customer grid functions
				this.InvokeIntersectionFieldMapping("UDF", control, -1); ///for customer grid intersections
				if (control.scheduleChk=="Y") //Schedule check Y/N logic as per dotnet to rgenerate schedule when field value is changed
				{
					this.oProductSchedule=[];
					this.oViewSchedule = [];		//Added by BhagyashriB on 14-Sept-2021 | for view schedule
					//this.CreateAppTableDataContract();
				}
				if (this.Multi_UCP_index == this.Multi_UCP_length - 1) { //for replicating values only of latest row in multiucp
					sessionStorage.removeItem('oFieldDetails');
					sessionStorage.setItem('oFieldDetails', JSON.stringify({
						udfFields: this.controls,
						commonData: this.common_data,
						function: this.functions_all
					})); //added functions in discrete manner because json.stringify was not working properly on overall functions json array
				}
				if(!this.isNullOrUndefined(_control.loader))
				{
				//control=control.control;
				console.log("loader ended from udffieldvalue change");
							
				if(control.dataType.toUpperCase() == 'STATIC BUTTON' && (control.sourcingLink.toUpperCase() == 'DRAFT') && !this.strmandate_triggered) {
					this.loader = true;
				}
				else {
					this.loader=false;
				}


				}
				//this.loaderService.display(false);
			} catch (error) {
				console.error(error);
				this.loader = false;
				//this.api.WriteErrorLogs("Error occured in udfFieldValuChange :"+error);
			} finally {}
			// console.log(control);
		}

		CustomTabValueChange(control: any) {
			try {
				this.ErrorMessage = '';
				//this.Message = '';
				// console.log((control.target.value));
				// console.log((control.target.id));

				// console.log((this.CustomTabs.columns));

				(this.CustomTabs.data.filter((field) => field.fieldName === control.columnName)).map((field) => field.currentValue = control.value);

				console.log((this.CustomTabs.data));

				this.CustomTabs.data.forEach(field => {
					Object.defineProperty(this.objCustomTabXML, [field.fieldName].toString(), {
						value: field.currentValue,
						writable: true,
						enumerable: true,
						configurable: true
					});
				});

				console.log('yyyyyyyyyyyyy');
				console.log(OBJtoXML(this.objCustomTabXML));

				function OBJtoXML(obj) {
					var xml = '';
					for (var prop in obj) {
						xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
						if (obj[prop] instanceof Array) {
							for (var array in obj[prop]) {
								xml += "<" + prop + ">";
								xml += OBJtoXML(new Object(obj[prop][array]));
								xml += "</" + prop + ">";
							}
						} else if (typeof obj[prop] == "object") {
							xml += OBJtoXML(new Object(obj[prop]));
						} else {
							xml += obj[prop];
						}
						xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
					}
					var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
					return xml
				}

				(this.controls.filter((field) => field.fieldName === 'StaticCustomTabXML')).map((field) => field.value = OBJtoXML(this.objCustomTabXML));

				console.log(this.controls);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in CustomTabValueChange :"+error);
			} finally {}
		}

		async CustomerGridValueChange(control: any) {
			try {
				this.ErrorMessage = '';
				//this.Message = '';
				//(this.CustomerGrid.data.filter((field) => field.columnName === control.columnName)).map((field) => field.value = control.value);
				// let cust_id;
				for (let i = 0; i < this.CustomerGrid.data.length; i++) {
					if (this.CustomerGrid.data[i].columnName === control.field_element.columnName) {
						//this.CustomerGrid.data[i] = control.field_element; //removed as was causing issue
						this.custGridTableRow[control.index][i] = control.field_element;
						// if (control.field_element.columnName =='clmnCustomerName')
						// {
						// 	cust_id =this.customersList.filter(c=>c.code==this.custGridTableRow[control.index][i].value)[0].id;
						// }
						break;
					}
				}
				// for (let i = 0; i < this.CustomerGrid.data.length; i++) {
				// 	if (this.CustomerGrid.data[i].columnName === 'clmnCustomerId') {
				// 		///this.CustomerGrid.data[i].value=(this.isNullOrUndefined(cust_id)?"":String(cust_id));
				// 		this.custGridTableRow[control.index][i].value=(this.isNullOrUndefined(cust_id)?"":String(cust_id));
				// 		break;
				// 	}
				// }
				console.log("Customer grid value changes ----- > ", (this.CustomerGrid.data));
				console.log("Customer grid value changes ----- > ", (this.custGridTableRow));
				//debugger;
				this.cgrowindex = control.index;
				await this.InvokeWarningFunctions("GRID",control.field_element.columnName,this.cgrowindex)
				if(this.warning_triggered==true){
					console.log("Warning triggered in customer grid")
					// this.loader = false;
					// return;
				}

				await this.invokeCustomerGridFunctions(control.field_element.columnName, this.cgrowindex); //as control_index is already set to cgrowindex above

				this.InvokeIntersectionFieldMapping("GRID", control, this.cgrowindex);
            ///Added by Devesh for Unwind case on 24-Feb-2022, other cases can also be added here
			        let dtparentrow:any=[];
					let iSum:number=0;
					let dtChildrenRow:any=[];
					let parent_index: number=-1;
			switch(this.sUCPMode.toString().toUpperCase()){
				case "UCPUNW":
				case "UNWFUL":
					// let dtparentrow:any=[];
					// let iSum:number=0;
					// let dtChildrenRow:any=[];
					// let parent_index: number=-1;
				   if(this.custGridTableRow[control.index].find(function(e) { return e.columnName == 'Parent_Deal_ID'}).value!="")
				  {
				// 	dtparentrow=this.custGridTableRow.filter(element=>{element.find(function(e) {
				// 	  return e.columnName == 'Note_Deal_ID'
				// 	 }).value == this.custGridTableRow[control.index].find(function(e) {
				// 	  return e.columnName == 'Parent_Deal_ID'
				// 	}).value
				//    });

				   dtparentrow=this.custGridTableRow.filter(e=>e.find(c=>c.columnName==="Note_Deal_Id").value == this.custGridTableRow[control.index].find(c=>c.columnName==="Parent_Deal_ID").value);

				   //parent_index=this.custGridTableRow.findIndex() //need to write function for getting index
  
				  if(dtparentrow.length>0)
				  {
					  dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerNotional' }).value = String(Number(this.unformatNumber(dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerNotional'}).value)) - Number(this.unformatNumber(this.custGridTableRow[control.index].find(function(e) {return e.columnName == 'clmnCustomerNotional' }).value)));
					  
					  parent_index = this.custGridTableRow.findIndex(e=>e.find(c=>c.columnName==="Note_Deal_Id").value == dtparentrow[0].find(c=>c.columnName==="Note_Deal_Id").value)
 
				      console.log("Parent row:",dtparentrow,"Index: ",parent_index);
					  
					  ///clmnCustomerNotional part
					 this.cgrowindex = control.index;
					 await this.InvokeWarningFunctions("GRID","clmnCustomerNotional",this.cgrowindex)
					 if(this.warning_triggered==true){
					   console.log("Warning triggered in customer grid")				
						 }
					 await this.invokeCustomerGridFunctions("clmnCustomerNotional", this.cgrowindex); //as control_index is already set to cgrowindex above
					 await this.InvokeIntersectionFieldMapping("GRID", {field_element:this.custGridTableRow[control.index].filter(e=>e.columnName == 'clmnCustomerNotional')}, this.cgrowindex);
  
					  
					 //for parent row index as per dotnet code					 
					 this.cgrowindex = parent_index;
					 
					 await this.InvokeWarningFunctions("GRID","clmnCustomerNotional",this.cgrowindex)
					 if(this.warning_triggered==true){
					   console.log("Warning triggered in customer grid")				
						 }
					 await this.invokeCustomerGridFunctions("clmnCustomerNotional", this.cgrowindex); //as control_index is already set to cgrowindex above
					 await this.InvokeIntersectionFieldMapping("GRID", {field_element:this.custGridTableRow[parent_index].filter(e=>e.columnName == 'clmnCustomerNotional')}, this.cgrowindex);
  

					 
					 ////clmnCustomerQuantity part

					 if(this.custGridColumns.includes("clmnCustomerQuantity"))
					 {
						dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerQuantity' }).value = Number(this.unformatNumber(dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerQuantity'}).value)) - Number(this.unformatNumber(this.custGridTableRow[control.index].find(function(e) {return e.columnName == 'clmnCustomerQuantity' }).value))
					 
						this.cgrowindex = control.index;
						await this.InvokeWarningFunctions("GRID","clmnCustomerQuantity",this.cgrowindex)
						if(this.warning_triggered==true){
						  console.log("Warning triggered in customer grid")				
							}
						await this.invokeCustomerGridFunctions("clmnCustomerQuantity", this.cgrowindex); //as control_index is already set to cgrowindex above
						await this.InvokeIntersectionFieldMapping("GRID", {field_element:this.custGridTableRow[control.index].filter(e=>e.columnName == 'clmnCustomerQuantity')}, this.cgrowindex);
	 
						 
						//for parent row index as per dotnet code					 
						this.cgrowindex = parent_index;
						
						await this.InvokeWarningFunctions("GRID","clmnCustomerQuantity",this.cgrowindex)
						if(this.warning_triggered==true){
						  console.log("Warning triggered in customer grid")				
							}
						await this.invokeCustomerGridFunctions("clmnCustomerQuantity", this.cgrowindex); //as control_index is already set to cgrowindex above
						await this.InvokeIntersectionFieldMapping("GRID", {field_element:this.custGridTableRow[parent_index].filter(e=>e.columnName == 'clmnCustomerQuantity')}, this.cgrowindex);
					 }
					 
					 
					 // dtChildrenRow = this.custGridTableRow.filter(element=>{element.find(function(e) {
					  // 	return e.columnName == 'Parent_Deal_ID'
					  //    }).value == dtparentrow[0].find(function(e) {
					  // 	return e.columnName == 'Note_Deal_ID'
					  //   }).value
					  // });
  
					  // for(let i=0;i<dtChildrenRow.length;i++)
					  // {
					  // 	iSum=iSum+Number(this.unformatNumber(dtChildrenRow[i].find(function(e) {
					  // 		return e.columnName == 'clmnCustomerNotional'
					  // 	  }).value))
					  // }
  
				  }  
					 
				}
				break;

				case "UCPREV":
					
				   if(this.custGridTableRow[control.index].find(function(e) { return e.columnName == 'Parent_Deal_ID'}).value!="")
  
				  {
				// 	dtparentrow=this.custGridTableRow.filter((element,i)=>{
				// 	if(element.find(function(e) {
				// 	  return e.columnName == 'Note_Deal_ID'
				// 	 }).value == this.custGridTableRow[control.index].find(function(e) {
				// 	  return e.columnName == 'Parent_Deal_ID'
				// 	}).value)
				// 	{parent_index=i;}
				//    });

				   dtparentrow=this.custGridTableRow.filter(e=>e.find(c=>c.columnName==="Note_Deal_Id").value == this.custGridTableRow[control.index].find(c=>c.columnName==="Parent_Deal_ID").value);
                   
				   
				   //parent_index=this.custGridTableRow.findIndex() //need to write function for getting index
  
				  if(dtparentrow.length>0)
				  {

                   parent_index = this.custGridTableRow.findIndex(e=>e.find(c=>c.columnName==="Note_Deal_Id").value == dtparentrow[0].find(c=>c.columnName==="Note_Deal_Id").value)
 
				   console.log("Parent row:",dtparentrow,"Index: ",parent_index);

					dtChildrenRow = this.custGridTableRow.filter(element=>{element.find(function(e) {
							return e.columnName == 'Parent_Deal_ID'
						   }).value == dtparentrow[0].find(function(e) {
							return e.columnName == 'Note_Deal_ID'
						  }).value
						});
				    
						if(dtChildrenRow.length>0)
						{
							for(let i=0;i<dtChildrenRow.length;i++)
					       {
					  	     iSum=iSum+Number(this.unformatNumber(dtChildrenRow[i].find(function(e) {
					  		 return e.columnName == 'clmnCustomerNotional'
					  	    }).value))
					       }
						}
				    
					if(Number(this.unformatNumber(dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerNotional'}).value)) < iSum)
					{
                           if(Number(this.unformatNumber(dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerNotional'}).value)) > 0)
						   {
							this.custGridTableRow[control.index].find(function(e) { return e.columnName == 'clmnCustomerNotional'}).value = Number(this.unformatNumber(dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerNotional'}).value))  - iSum + this.custGridTableRow[control.index].find(function(e) { return e.columnName == 'clmnCustomerNotional'}).value;
						   }
						   else
						   {
							this.custGridTableRow[control.index].find(function(e) { return e.columnName == 'clmnCustomerNotional'}).value = Number(this.unformatNumber(dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerNotional'}).value)) + iSum - this.custGridTableRow[control.index].find(function(e) { return e.columnName == 'clmnCustomerNotional'}).value;
						   }


						   ///clmnCustomerNotional part
						   this.cgrowindex = control.index;
					       await this.InvokeWarningFunctions("GRID","clmnCustomerNotional",this.cgrowindex)
					       if(this.warning_triggered==true){
					          console.log("Warning triggered in customer grid")				
						    }
					       await this.invokeCustomerGridFunctions("clmnCustomerNotional", this.cgrowindex); //as control_index is already set to cgrowindex above
					       await this.InvokeIntersectionFieldMapping("GRID", {field_element:this.custGridTableRow[control.index].filter(e=>e.columnName == 'clmnCustomerNotional')}, this.cgrowindex);
  
					  
					        //for parent row index as per dotnet code					 
					      this.cgrowindex = parent_index;					 
					      await this.InvokeWarningFunctions("GRID","clmnCustomerNotional",this.cgrowindex)
					      if(this.warning_triggered==true){
					        console.log("Warning triggered in customer grid")				
						  }
					      await this.invokeCustomerGridFunctions("clmnCustomerNotional", this.cgrowindex); //as control_index is already set to cgrowindex above
					      await this.InvokeIntersectionFieldMapping("GRID", {field_element:this.custGridTableRow[parent_index].filter(e=>e.columnName == 'clmnCustomerNotional')}, this.cgrowindex);
					}
					
					//for customerquantity part as per dotnet code
					iSum=0; 

					if(dtChildrenRow.length>0)
						{
							for(let i=0;i<dtChildrenRow.length;i++)
					       {
					  	     iSum=iSum+Number(this.unformatNumber(dtChildrenRow[i].find(function(e) {
					  		 return e.columnName == 'clmnCustomerQuantity'
					  	    }).value))
					       }
						}


						if(Number(this.unformatNumber(dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerQuantity'}).value)) < iSum)
						{
							   if(Number(this.unformatNumber(dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerQuantity'}).value)) > 0)
							   {
								this.custGridTableRow[control.index].find(function(e) { return e.columnName == 'clmnCustomerQuantity'}).value = Number(this.unformatNumber(dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerQuantity'}).value))  - iSum + this.custGridTableRow[control.index].find(function(e) { return e.columnName == 'clmnCustomerQuantity'}).value;
							   }
							   else
							   {
								this.custGridTableRow[control.index].find(function(e) { return e.columnName == 'clmnCustomerQuantity'}).value = Number(this.unformatNumber(dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerQuantity'}).value)) + iSum - this.custGridTableRow[control.index].find(function(e) { return e.columnName == 'clmnCustomerQuantity'}).value;
							   }
	
	
							   ///clmnCustomerNotional part
							   this.cgrowindex = control.index;
							   await this.InvokeWarningFunctions("GRID","clmnCustomerQuantity",this.cgrowindex)
							   if(this.warning_triggered==true){
								  console.log("Warning triggered in customer grid")				
								}
							   await this.invokeCustomerGridFunctions("clmnCustomerQuantity", this.cgrowindex); //as control_index is already set to cgrowindex above
							   await this.InvokeIntersectionFieldMapping("GRID", {field_element:this.custGridTableRow[control.index].filter(e=>e.columnName == 'clmnCustomerQuantity')}, this.cgrowindex);
	  
						  
								//for parent row index as per dotnet code					 
							  this.cgrowindex = parent_index;					 
							  await this.InvokeWarningFunctions("GRID","clmnCustomerQuantity",this.cgrowindex)
							  if(this.warning_triggered==true){
								console.log("Warning triggered in customer grid")				
							  }
							  await this.invokeCustomerGridFunctions("clmnCustomerQuantity", this.cgrowindex); //as control_index is already set to cgrowindex above
							  await this.InvokeIntersectionFieldMapping("GRID", {field_element:this.custGridTableRow[parent_index].filter(e=>e.columnName == 'clmnCustomerQuantity')}, this.cgrowindex);
	
						}
				   }
				 }
					break;
  
			   default:				  
				   break; 
			}
  
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in CustomerGridValueChange :"+error);
			} finally {}

		}
		///Added by Devesh for setting cutomerid from customer name
		setcustomerid(control: any){
			try{
				if (this.custid_index>-1)
				{
					let cust_id =this.customersList.filter(c=>c.code==control.name)[0].id;
					this.custGridTableRow[control.row_index][this.custid_index].value=(this.isNullOrUndefined(cust_id)?"":String(cust_id));
					this.CustomerGridValueChange({
						field_element: this.custGridTableRow[control.row_index][this.custid_index],
						index: control.row_index
					});
				}		
			}
			catch(ex){
				console.error(ex);
				//this.api.WriteErrorLogs("Error occured in setcustomerid :"+ex);
			}
		}

		//Added by SwatiP TO handle customer grid intersections
		InvokeIntersectionFieldMapping(CallingFieldType: any, CallingFieldName: any, iCallingRowIndex: any) {
			try {
				let drAssignment: any;
				let drSum: any;
				// debugger;
				if (!this.isNullOrUndefined(this.intersections) && this.intersections.length > 0) {
					if (this.CustomerGrid.data.length > 0) {
						switch (CallingFieldType.toUpperCase()) {
							case "UDF":
								drAssignment = this.intersections.filter((c: any) => c.ucP_Clone_Field === CallingFieldName.fieldName && c.ucP_Field_Dir == 'Outward');
								if (drAssignment != undefined && drAssignment.length > 0) {
									this.SetIntersectionFieldValues(drAssignment, iCallingRowIndex);
								}

								break;
							case "GRID":
								drSum = this.intersections.filter((c: any) => c.intersection_Field === CallingFieldName.field_element.columnName && c.ucP_Field_Dir == 'Inward' && c.ucP_Clone_Sum != '');
								if (drSum != undefined && drSum.length > 0) {
									this.SumCustomerGridValues(drSum);
								}
								drAssignment = this.intersections.filter((c: any) => c.intersection_Field === CallingFieldName.field_element.columnName && c.ucP_Field_Dir == 'Inward');
								if (drAssignment != undefined && drAssignment.length > 0) {
									this.SetIntersectionFieldValues(drAssignment, iCallingRowIndex);
								}
								this.HideMarketLeg();
								break;
							case "":
								drAssignment = this.intersections.filter((c: any) => c.ucP_Field_Dir == 'Outward');
								if (drAssignment != undefined && drAssignment.length > 0) {
									this.SetIntersectionFieldValues(drAssignment, iCallingRowIndex);
								}
								drAssignment = this.intersections.filter((c: any) => c.ucP_Field_Dir == 'Inward');
								if (drAssignment != undefined && drAssignment.length > 0) {
									for (let j = 0; j < this.custGridTableRow.length; j++) {
										this.SetIntersectionFieldValues(drAssignment, j);
									}
								}
								drSum = this.intersections.filter((c: any) => c.ucP_Field_Dir == 'Inward' && c.ucP_Clone_Sum != '');
								if (drSum != undefined && drSum.length > 0) {
									this.SumCustomerGridValues(drSum);
								}
								break;
						}
					}
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in InvokeIntersectionFieldMapping :"+error);
			} finally {}
		}
		//Added by SwatiP TO handle customer grid intersections
		async SetIntersectionFieldValues(drAssignment: any, iCallingRowIndex: any) {
			try {
				
				let sFieldName: any;
				let sFieldValue: any;
				let sDealDirection: any;
				let FieldDirection: any;
				let legcheck: boolean;
				let IsTransitive: boolean = false;
				for (let iCnt = 0;iCnt <= drAssignment.length - 1; iCnt++) {
					legcheck = false;
					sDealDirection = drAssignment[iCnt].dealDirection.toUpperCase();
					FieldDirection = drAssignment[iCnt].ucP_Field_Dir.toUpperCase();
					switch (FieldDirection) {
						case 'OUTWARD':
							sFieldName = drAssignment[iCnt].ucP_Clone_Field;
							const udfField = this.controls.filter((c: any) => c.fieldName === sFieldName);
							if (!this.isNullOrUndefined(udfField) && udfField.length > 0)
								sFieldValue = udfField[0].value;
							const custField: any = drAssignment[iCnt].intersection_Field;

							for (let j = 0; j < this.custGridTableRow.length; j++) {
								legcheck = false;
								let isTransitive=false;
								this.custGridTableRow[j].forEach(element => {
									if (element.columnName == "clmnCustomerLeg" && sDealDirection.includes(element.value.toUpperCase()))
										legcheck = true;
									if (element.columnName == custField && legcheck == true) {
										switch(element.type.toUpperCase())
										{
											case "AMOUNT":
											case "NUMBER":
											case "INTEGER":
												//if (Number(element.value) != Number(sFieldValue.replace(/,/g, ''))) {
													if (Number(element.value) != Number(sFieldValue)) {
													isTransitive = true; 
												}											
											break;
											default:
												if(element.value.trim()!=sFieldValue.trim()){
													isTransitive = true;
												}
											break;	
										}
										element.value = sFieldValue;
										if (isTransitive)
										{
										this.CustomerGridValueChange({
											field_element: element,
											index: j
										}); //to call dependent customer functions
										}							
									}
								});
							}
							break;
						case 'INWARD':
							sFieldName = drAssignment[iCnt].ucP_Clone_Field;
							this.custGridTableRow[iCallingRowIndex].forEach(async element => {
								if (element.columnName == "clmnCustomerLeg" && sDealDirection.includes(element.value.toUpperCase()))
									legcheck = true;
								if (element.columnName == drAssignment[iCnt].intersection_Field && legcheck == true){
									sFieldValue = element.value;

									const TargetControl: any = this.controls.filter((c: any) => c.fieldName === sFieldName);  //shifted by SwatiP on 6-Dec-2021
							if (!this.isNullOrUndefined(TargetControl) && TargetControl.length > 0) { //21-12-2020
								TargetControl[0].value = sFieldValue;
								TargetControl[0].currentValue = sFieldValue;
								this.ref.detectChanges();
								await this.udfFieldValueChange(TargetControl[0]); //to call transitive functions and intersections
							}
								}
							});
							break;
					}
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in SetIntersectionFieldValues :"+error);
			} finally {}
		}

		//Added by SwatiP TO handle customer grid intersections
		async SumCustomerGridValues(drSum: any) {
			try {
				let sDealDirection: any;
				let FieldDirection: any;
				let legcheck: boolean;
				let sUDFFieldName: any;
				let dblSum: any = 0;
				for (let iCnt = 0;
					(iCnt <= (drSum.length - 1)); iCnt++) {
					legcheck = false;
					sDealDirection = drSum[iCnt].dealDirection.toUpperCase();
					FieldDirection = drSum[iCnt].ucP_Field_Dir.toUpperCase();
					switch (FieldDirection) {
						case 'OUTWARD':
							continue; //not possible case
						case 'INWARD':
							sUDFFieldName = drSum[iCnt].ucP_Clone_Sum;
							const custField: any = drSum[iCnt].intersection_Field;
							for (let j = 0; j < this.custGridTableRow.length; j++) {
								legcheck = false;
								this.custGridTableRow[j].forEach(element => {
									var val = '';
									if (element.columnName == "clmnCustomerLeg" && sDealDirection.includes(element.value.toUpperCase()))
										legcheck = true;
									if (element.columnName == custField && legcheck == true) {
										//this.formatKLMB(String(element.value), element.ucgM_format)
										val = element.value ? (element.value.includes(',') ? element.value.replace(/,/g, '') : this.formatKLMB(element.value, element.ucgM_format).replace(/,/g, '')) : '0';
										dblSum = Number(dblSum) + Number(val);
									}
									
								});
							}
							console.log("Clone Sum: ", dblSum)
							const udfField = this.controls.filter((c: any) => c.fieldName === sUDFFieldName);
							if (!this.isNullOrUndefined(udfField) && udfField.length > 0)
								udfField[0].value = dblSum;
							udfField[0].currentValue = dblSum;
							await this.udfFieldValueChange(udfField[0]); //to call transitive functions and intersections
							break;
					}
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in SumCustomerGridValues :"+error);
			} finally {}
		}


		async customTabFieldValueChange(control: any) {

			// console.log(control);
			// for (let j = 0; j < this.tableRow.length; j++) {
			//   this.tableRow[j];

			// }
			try {
				// (!this.isNullOrUndefined(control.loader)?this.loader = true:this.loader=this.loader);
				console.log("control field element: ", control.field_element, "index", control.index);
				for (let i = 0; i < this.CustomTabs.data.length; i++) {
					if (this.CustomTabs.data[i].fieldName === control.field_element.fieldName) {
						this.CustomTabs.data[i] = control.field_element;
						this.tableRow[control.index][i] = control.field_element; //since value was not updating in the table
						this.setCustomTabIntersection(this.CustomTabs.data[i].fieldName, i, control.index); //calling intersection here itself to avoid repeating for loop
					}
				}
				console.log("Custom tab field value changes........", control.field_element, this.CustomTabs.data);
				console.log("Custom table ", this.tableRow);
				this.ctCtr = control.index;
				this.ErrorMessage = '';
				//this.Message = '';

				await this.invokeCustomTabFunctions(control.field_element.fieldName, this.ctCtr); //as control_index is already set to ctctr above
				this.generateCustomTabXML();
				// (!this.isNullOrUndefined(control.loader)?this.loader=false:this.loader=this.loader);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in customTabFieldValueChange :"+error);
			} finally {}
		}

		executeBasketArrayFormula(refFieldsArr, index) {
			try {
				let functionMode = "Custom";
				console.log(index);


				refFieldsArr.forEach(element => {
					let strFormulaID = element.id + element.columnName;
					let funcName = element.formulae;
					

				});


			}
			catch (e) {
				console.log("Error in executeBasketArrayFormula", e);
			}
		}

		executeFormula(formula: any, event ? : string) {
			try
			{
				if (!this.isNullOrUndefined(formula)) { //if check added to avoid errors if no formulae are mapped 
				//this.parseFormula(formulas, event);

				const outputForm = (formula.ufD_Function_Output_Form + '').toUpperCase();
				//const TargetControl: any = this.controls.filter((c: any) => c.fieldName === formula.ufD_Target_Field);
				let TargetControl: any;
				if (String(formula.ufD_Target_Field).toUpperCase() == "HEDGINGTYPE"){
					TargetControl = this.selectedBookingModel;				
				}
				else{
				switch (formula.functionMode) {
					case 'Custom':
						TargetControl = this.CustomTabs.data.filter((c: any) => c.fieldName === formula.ufD_Target_Field);
						break;
					case 'Client':
					case 'Market':
						TargetControl = this.CustomerGrid.data.filter((c: any) => c.columnName === formula.ufD_Target_Field);
						break;
					default:
						TargetControl = this.controls.filter((c: any) => c.fieldName === formula.ufD_Target_Field);
						break;
				}
				}


			//
			let form_name=this.ParsedFormula.get(String(formula.ufD_ID));




			console.log("Formula syntax before splitting ",form_name);
				let str_form_name = form_name.trim().replace(/[+]/g, '@+@').replace(/[-]/g, '@-@').replace(/[*]/g, '@*@').replace(/[%]/g, '@%@').replace(/[*]/g, '@*@').replace(/[/]/g, '@/@').replace(/[(]/g, '@(@').replace(/[)]/g, '@)@').replace(/[{]/g, '@{@').replace(/[}]/g, '@}@').replace(/[=]/g, '@=@').replace(/[>]/g, '@>@').replace(/[<]/g, '@<@').replace(/[&]/g, '@&@').replace(/[|]/g, '@|@').replace(/[?]/g, '@?@').replace(/[:]/g, '@:@').replace(/[!]/g, '@!@').replace(/[,]/g, '@,@').replace(/[[]/g, '@[@').replace(/]/g, '@]@');
				console.log("Long form", str_form_name);
				let strArr: string[] = str_form_name.split('@');
				for (let iStr: number = 0; iStr < strArr.length; iStr++) {
					if (String(strArr[iStr]).trim().toUpperCase().startsWith('UDF.')) {
						
						formula.CallingField = strArr[iStr];
						console.log("UDF field", strArr[iStr], formula);
						if(this.globalWarningArr && !this.globalWarningArr.some(e => e.CallingField == strArr[iStr] && e.Function == formula.ufD_ID)) {
							var tempObj = {
								CallingField: strArr[iStr],
								Function: formula.ufD_ID,
								Warning: ""
							}
							this.globalWarningArr.push(tempObj)
						}					
						console.log("UDF field data type", this.controls.filter((c: any) => (String(c.fieldName).toUpperCase() == (String(strArr[iStr])).trim().toUpperCase().replace('UDF.', '')))[0].dataType);
						let appendcomma = false;
						if ((this.controls.filter((c: any) => (String(c.fieldName).toUpperCase() == (String(strArr[iStr])).trim().toUpperCase().replace('UDF.', '')))[0].dataType != 'AMOUNT') && (this.controls.filter((c: any) => (String(c.fieldName).toUpperCase() == (String(strArr[iStr])).trim().toUpperCase().replace('UDF.', '')))[0].dataType != 'NUMBER') && (this.controls.filter((c: any) => (String(c.fieldName).toUpperCase() == (String(strArr[iStr])).trim().toUpperCase().replace('UDF.', '')))[0].dataType != 'INTEGER')) {
							appendcomma = true;
						}

						strArr[iStr] = this.controls.filter((c: any) => (String(c.fieldName).toUpperCase() == (String(strArr[iStr])).trim().toUpperCase().replace('UDF.', '')))[0].value;
						console.log("before check", strArr[iStr]);
						strArr[iStr] = (appendcomma ? "'" + (strArr[iStr]) + "'" : (_isNumberValue(strArr[iStr].toString().replace(/,/g, '')) ? strArr[iStr].toString().replace(/,/g, '') : "0")); //upper_case?strArr[iStr].toUpperCase():
						console.log("after check", strArr[iStr]);
					} else if (String(strArr[iStr]).trim().toUpperCase().startsWith('BA.')) { //for custom tab
						console.log("Custom tab field", strArr[iStr]);
						//debugger;
						//console.log("Custom tab data type",this.CustomTabs.data[]);//.filter((c: any) => (String(c.fieldName).toUpperCase() == (String(strArr[iStr])).trim().toUpperCase().replace('UDF.','')))[0].dataType);
						for (let i = 0; i < this.CustomTabs.data.length; i++) {
							if (String(this.CustomTabs.data[i].fieldName).toUpperCase() == (String(strArr[iStr])).trim().toUpperCase().replace('BA.', '')) {
								console.log("Custom tab data type", this.CustomTabs.data[i].dataType); //taken customtabs.data as datatype remains common irrespective of row
								let appendcomma = false;
								if ((this.CustomTabs.data[i].dataType != 'AMOUNT') && (this.CustomTabs.data[i].dataType != 'NUMBER') && (this.CustomTabs.data[i].dataType != 'INTEGER')) {
									appendcomma = true;
								}
								strArr[iStr] = this.tableRow[this.ctCtr][i].value; //getting value of that particular row of custom tab field
								console.log("before check", strArr[iStr]);
								strArr[iStr] = (appendcomma ? "'" + (strArr[iStr]) + "'" : (_isNumberValue(strArr[iStr].toString().replace(/,/g, '')) ? strArr[iStr].toString().replace(/,/g, '') : "0")); //upper_case?strArr[iStr].toUpperCase():
								console.log("after check", strArr[iStr]);
								break;
							}
						}
					} else if (String(strArr[iStr]).trim().toUpperCase().startsWith('CG.')) { //for customer grid
						//debugger;
						console.log("Customer grid field", strArr[iStr]);
						for (let i = 0; i < this.CustomerGrid.data.length; i++) {
							if (String(this.CustomerGrid.data[i].columnName).toUpperCase() == (String(strArr[iStr])).trim().toUpperCase().replace('CG.', '')) {

								let appendcomma = false;
								if ((this.CustomerGrid.data[i].type.toUpperCase() != 'AMOUNT') && (this.CustomerGrid.data[i].type.toUpperCase() != 'NUMBER') && (this.CustomerGrid.data[i].type.toUpperCase() != 'INTEGER')) {
									appendcomma = true;
								}
								strArr[iStr] = this.custGridTableRow[this.cgrowindex][i].value; //getting value of that particular row of custom tab field
								console.log("before check", strArr[iStr]);
								strArr[iStr] = (appendcomma ? "'" + (strArr[iStr]) + "'" : (_isNumberValue(strArr[iStr].toString().replace(/,/g, '')) ? strArr[iStr].toString().replace(/,/g, '') : "0")); //upper_case?strArr[iStr].toUpperCase():
								console.log("after check", strArr[iStr]);
								break;
							}
						}
					}
				}
				let form_exp = strArr.join('@');
				form_exp = form_exp.trim().replace(/@/g, '');
				console.log("Formula before exe", form_exp);
				let result;
				try {
					result = eval(form_exp);
					console.log("Final Solution::: ", TargetControl, eval(form_exp));
				} catch (err) {
					console.log("Error occured in eval statement", err);
					//this.api.WriteErrorLogs("Error occured in execute formula: "+formula.ufD_Function_Name+" :"+err);
				}
				//let result = eval(form_exp);
				if (outputForm == 'HARD BLOCK' && result.toString().trim().length>0) 
				{
					if(this.sWarningtextArr.findIndex(e => e.includes(result.toString().trim())) == -1){
						this.sWarningtextArr.push( result.toString().trim());
						this.hardblock_triggered=true;
					}
				
				}
				else if(outputForm == 'WARNING' && result.toString().trim().length>0){
					if(this.sWarningtextArr.findIndex(e => e.includes(result.toString().trim())) == -1) {
						if(this.globalWarningArr.length > 1) {
							for (let i = 0; i < this.globalWarningArr.length; i++) {
								if(this.globalWarningArr[i].CallingField == formula.CallingField && this.globalWarningArr[i].Function == formula.ufD_ID){
									this.globalWarningArr[i].Warning = result.toString().trim();
								}
							}
						}
						console.log("Global Warning Array is: ", this.globalWarningArr);
						this.sWarningtextArr.push( result.toString().trim());
						this.warning_triggered=true;
					}
				}
				else
				{
					// if(outputForm == 'WARNING' && result.toString().trim().length == 0) {
					// 	if(this.globalWarningArr.length > 1) {
					// 		for (let i = 0; i < this.globalWarningArr.length; i++) {
					// 			if(this.globalWarningArr[i].CallingField == formula.CallingField && this.globalWarningArr[i].Function == formula.ufD_ID){
					// 				const index = this.sWarningtextArr.findIndex(e => e.includes(this.globalWarningArr[i].Warning));
					// 				if (index > -1) {
					// 					this.sWarningtextArr.splice(index, 1);
					// 				}
					// 				this.globalWarningArr[i].Warning = "";
					// 			}
					// 		}
					// 	}
					// }
					this.dataAssignmentAfterFormula(formula, TargetControl, outputForm, result, event);
				}

				

				// if(this.sWarningtextArr.length>0) //added by Devesh for Hardblock related changes on 18-Jun-2021
				// 	{
				// 		var tempStr = "";
				// 		for (let i = 0; i < this.sWarningtextArr.length; i++) {
				// 			if(this.sWarningtextArr[i] != '')	
				// 				this.sWarningtextArr[i] = this.sWarningtextArr[i].toString() + "\n";
				// 		}
				// 		tempStr = this.sWarningtextArr.join("");
				// 		this.ErrorMessage = tempStr;
				// 	}
			}
			}
			catch (error) {
				//this.api.WriteErrorLogs("Error occured in execute formula: "+formula.ufD_Function_Name+" :"+error);
				console.error(error);
			}
		}

		parseBasketArrayForrmulae(formulae: any[]) {
			try {
				if (!this.isNullOrUndefined(formulae) && formulae.length>0)
				{
				formulae.forEach(formula => {
					let form_name = formula.formulae;
					//const TargetControl: any = (formula.functionMode=== 'Custom'?this.CustomTabs.data.filter((c: any) => c.fieldName === formula.ufD_Target_Field):this.controls.filter((c: any) => c.fieldName === formula.ufD_Target_Field));  //added this.CustomTabs to handle if target field is in custom tab
					//let upper_case=false;    
					if (String(form_name).toUpperCase().includes('IF') && !(String(form_name).toUpperCase().includes('DATEDIFF('))) {
						form_name = this.convert_to_js(String(form_name)) //added by devesh to convert code to js syntax from vb
						//upper_case=true; //convert udf value to upper case for if condition check only
					}
					if (String(form_name).toUpperCase().includes('MATH.') || String(form_name).toUpperCase().includes(' MOD ') || String(form_name).toUpperCase().includes('CINT') || String(form_name).toUpperCase().includes('CSTR') || String(form_name).includes('^')) { //added by devesh to convert math functions to js format
						form_name = form_name.replace(/MATH.MIN/ig, 'Math.min').replace(/MATH.MAX/ig, 'Math.max').replace(/MATH.SQRT/ig, 'Math.sqrt').replace(/MATH.SIGN/ig, 'Math.sign').replace(/MATH.ROUND/ig, 'Math.round').replace(/MATH.CEILING/ig, 'Math.ceil').replace(/MATH.FLOOR/ig, 'Math.floor').replace(/MATH.ABS/ig, 'Math.abs').replace(/MATH.POW/ig, 'Math.pow').replace(/MATH.LOG/ig, 'Math.log').replace(/MATH.LOG10/ig, 'Math.log10').replace(/MATH.EXP/ig, 'Math.exp').replace('^', '**').replace(/\bMOD\b/ig, '%').replace(/\bCINT\b/ig, 'parseInt').replace(/\bCSTR\b/ig, 'String');
					}
					if (String(form_name).includes('.SPLIT(') || String(form_name).includes('.Split(') || String(form_name).includes('.split(')) {
						form_name = form_name.replace('.SPLIT(', '@.split(').replace('.Split(', '@.split(').replace('.split(', '@.split('); //replacing .split by @.split since it comes appended with udf.field.split() syntax  
						if (String(form_name).charAt(form_name.length - 1) === ')') {
							form_name = this.replaceAt(String(form_name), form_name.length - 1, ']');
							// if(_isNumberValue(String(form_name).charAt(form_name.length - 2))){
							//   form_name = this.replaceAt(String(form_name), form_name.length - 3, '[');
							// }
							for (let i = form_name.length - 1; i > 0; i--) {
								if (String(form_name).charAt(i) === '(') {
									form_name = this.replaceAt(String(form_name), i, '[');
									break;
								}
							}
						}
					}
					if (String(form_name).includes('.REPLACE(') || String(form_name).includes('.Replace(') || String(form_name).includes('.replace(')) {
						form_name = form_name.replace('.REPLACE(', '@.replace(').replace('.Replace(', '@.replace(').replace('.replace(', '@.replace('); //replacing .replace by @.replace since it comes appended with udf.field.replace() syntax  
					}
		
					if (String(form_name).includes('LCase(') || String(form_name).includes('UCase(') || String(form_name).includes('Left(') || String(form_name).includes('Right(') || String(form_name).includes('Ltrim(') || String(form_name).includes('Rtrim(') || String(form_name).includes('Len(') || String(form_name).includes('Mid(') || String(form_name).includes('DateDiff(')) {
						let extrafunc = "function UCase(stringToTrim) { return stringToTrim.toUpperCase();} function LCase(stringToTrim) { return stringToTrim.toLowerCase();} function Left(sString, fLength) { return sString.substr(0, fLength);} function Right(sString,fLength) { return sString.substr(sString.length-fLength,sString.length);} function Ltrim(stringToTrim) { return stringToTrim.replace(/^\\s+/,'');} function Rtrim(stringToTrim) { return stringToTrim.replace(/\\s+$/,'');} function Len(stringToTrim) { return stringToTrim.length;} function Mid(stringToTrim,start,length) { return stringToTrim.substr(start,length);} function DateDiff(interval,startdate,enddate) { switch(interval) { case'd': return Math.abs((Date.parse(startdate)-Date.parse(enddate))/(1000*3600*24)); break; }}"; //for passing functions in string format to eval
						form_name = extrafunc + ' ' + form_name;
					}
					console.log("Basket Array Formula sntax after conversion:", form_name);
					if(form_name != "")	
						this.ParsedFormula.set(String(formula.id),form_name)
				});
				}
				console.log("List of basket array parsed formulae ",this.ParsedFormula);
			}
			catch (e) {
				console.log("Error in parseBasketArrayForrmulae: ", e)
			}
		}

		parseFormula(formulae: any[]) {
			//console.log(formula);
			try {
				// console.log("Executing formula", formula);
				// console.log("Inside Execute Formulae-------->", this.controls);
				if (!this.isNullOrUndefined(formulae) && formulae.length>0)
				{
				formulae.forEach(formula => {
					let form_name = formula.ufD_Function_Name;
					//const TargetControl: any = (formula.functionMode=== 'Custom'?this.CustomTabs.data.filter((c: any) => c.fieldName === formula.ufD_Target_Field):this.controls.filter((c: any) => c.fieldName === formula.ufD_Target_Field));  //added this.CustomTabs to handle if target field is in custom tab
					//let upper_case=false;    
					if (String(form_name).toUpperCase().includes('IF') && !(String(form_name).toUpperCase().includes('DATEDIFF('))) {
						form_name = this.convert_to_js(String(form_name)) //added by devesh to convert code to js syntax from vb
						//upper_case=true; //convert udf value to upper case for if condition check only
					}
					if (String(form_name).toUpperCase().includes('MATH.') || String(form_name).toUpperCase().includes(' MOD ') || String(form_name).toUpperCase().includes('CINT') || String(form_name).toUpperCase().includes('CSTR') || String(form_name).includes('^')) { //added by devesh to convert math functions to js format
						form_name = form_name.replace(/MATH.MIN/ig, 'Math.min').replace(/MATH.MAX/ig, 'Math.max').replace(/MATH.SQRT/ig, 'Math.sqrt').replace(/MATH.SIGN/ig, 'Math.sign').replace(/MATH.ROUND/ig, 'Math.round').replace(/MATH.CEILING/ig, 'Math.ceil').replace(/MATH.FLOOR/ig, 'Math.floor').replace(/MATH.ABS/ig, 'Math.abs').replace(/MATH.POW/ig, 'Math.pow').replace(/MATH.LOG/ig, 'Math.log').replace(/MATH.LOG10/ig, 'Math.log10').replace(/MATH.EXP/ig, 'Math.exp').replace('^', '**').replace(/\bMOD\b/ig, '%').replace(/\bCINT\b/ig, 'parseInt').replace(/\bCSTR\b/ig, 'String');
					}
					if (String(form_name).includes('.SPLIT(') || String(form_name).includes('.Split(') || String(form_name).includes('.split(')) {
						form_name = form_name.replace('.SPLIT(', '@.split(').replace('.Split(', '@.split(').replace('.split(', '@.split('); //replacing .split by @.split since it comes appended with udf.field.split() syntax  
						if (String(form_name).charAt(form_name.length - 1) === ')') {
							form_name = this.replaceAt(String(form_name), form_name.length - 1, ']');
							// if(_isNumberValue(String(form_name).charAt(form_name.length - 2))){
							//   form_name = this.replaceAt(String(form_name), form_name.length - 3, '[');
							// }
							for (let i = form_name.length - 1; i > 0; i--) {
								if (String(form_name).charAt(i) === '(') {
									form_name = this.replaceAt(String(form_name), i, '[');
									break;
								}
							}
						}
					}
					if (String(form_name).includes('.REPLACE(') || String(form_name).includes('.Replace(') || String(form_name).includes('.replace(')) {
						form_name = form_name.replace('.REPLACE(', '@.replace(').replace('.Replace(', '@.replace(').replace('.replace(', '@.replace('); //replacing .replace by @.replace since it comes appended with udf.field.replace() syntax  
					}
		
					if (String(form_name).includes('LCase(') || String(form_name).includes('UCase(') || String(form_name).includes('Left(') || String(form_name).includes('Right(') || String(form_name).includes('Ltrim(') || String(form_name).includes('Rtrim(') || String(form_name).includes('Len(') || String(form_name).includes('Mid(') || String(form_name).includes('DateDiff(')) {
						let extrafunc = "function UCase(stringToTrim) { return stringToTrim.toUpperCase();} function LCase(stringToTrim) { return stringToTrim.toLowerCase();} function Left(sString, fLength) { return sString.substr(0, fLength);} function Right(sString,fLength) { return sString.substr(sString.length-fLength,sString.length);} function Ltrim(stringToTrim) { return stringToTrim.replace(/^\\s+/,'');} function Rtrim(stringToTrim) { return stringToTrim.replace(/\\s+$/,'');} function Len(stringToTrim) { return stringToTrim.length;} function Mid(stringToTrim,start,length) { return stringToTrim.substr(start,length);} function DateDiff(interval,startdate,enddate) { switch(interval) { case'd': return Math.abs((Date.parse(startdate)-Date.parse(enddate))/(1000*3600*24)); break; }}"; //for passing functions in string format to eval
						form_name = extrafunc + ' ' + form_name;
					}
					console.log("Formula sntax after conversion:", form_name);
					this.ParsedFormula.set(String(formula.ufD_ID),form_name)
				});
				}
				console.log("List of parsed formulae ",this.ParsedFormula);
			} catch (ex) {
				console.log("Error occured in parsing formula", ex);
				//this.api.WriteErrorLogs("Error occured in parse formula: "+ex);
			}
		}

		replaceAt(string, index, replace) {
			try{
			return string.substring(0, index) + replace + string.substring(index + 1);
			}
			catch(e){
				console.log("Error in replaceAt :", e)
			}
		}

		convert_to_js(formula: string) {
			try {
				formula = formula.replace(/\s+=/g, '=').replace(/\=\s+/g, '=').replace(/\s+=\s+/g, '=') //for replacing spaces between '=' and other variables for next regex given below
				if (!this.isNullOrUndefined(formula.match(/,/g))) {
					if ((formula.match(/,/g)).length == 2) { //for handling ternary opeartor 
						formula = formula.replace(/\bIF\b/ig, '').replace(',', '?').replace(',', ':').replace(/\b=/g, '==').replace(/<>/g, '!=').replace(/"/g, "'").replace(/“/g, "'").replace(/”/g, "'").replace(/\bANDALSO\b/ig, '&&').replace(/\bAND\b/ig, '&&').replace(/\bORELSE\b/ig, '||').replace(/\bOR\b/ig, '||'); //put /\b=\b/ regex because synatx may conatin <=,>=,etc 
						console.log("Ternary operator syntax in js:", formula);
						return formula;
					} else if ((formula.match(/,/g)).length > 2) {
						formula = this.generateternarycode(formula); //
						formula = formula.replace(/\b=/g, '==').replace(/<>/g, '!=').replace(/"/g, "'").replace(/“/g, "'").replace(/”/g, "'").replace(/\bANDALSO\b/ig, '&&').replace(/\bAND\b/g, '&&').replace(/\bORELSE\b/ig, '||').replace(/\bOR\b/ig, '||'); //put /\b=\b/ regex because synatx may conatin <=,>=,etc 
						console.log("Multiple Ternary operator syntax in js", formula);
						return formula;
					}
				}
				formula = formula.replace(/\bEND IF\b/i, '}').replace(/\bIF\b/ig, 'if(').replace(/\bTHEN\b/ig, ')').replace(/\bELSE\b/ig, '}else').replace(/\bRETURN\b/ig, '{').replace(/\bELSEIF\b/ig, '}else if(').replace(/\b=/g, '==').replace(/<>/g, '!=').replace(/\bANDALSO\b/ig, '&&').replace(/\bAND\b/g, '&&').replace(/\bORELSE\b/ig, '||').replace(/\bOR\b/ig, '||').replace(/"/g, "'");
				console.log("if else syntax in js:", formula);
				return formula;
			} catch (error) {
				console.error(error);
				this.api.WriteErrorLogs("Error occured in convert_to_js :"+error);
			} finally {}

		}

		// async callFunctionsInSequence(funcIndex: number, functions: any[], functionType: string, index_ctr ? : number){
		// 	this.sWarningtextArr = []; //to clear warning text
		// 	let hardblocklist = [];
		// 	const that = this;
		// 	console.log("========>>>>>>> Function calls with index", funcIndex, functions[funcIndex]);
		// 	if(funcIndex < functions.length){
		// 		let func = functions[funcIndex];

		// 		// console.log("Function def is:::::: ", func);
		// 		let TargetControl: any;
		// 		if (func.functionMode === 'Custom') {
		// 			TargetControl = that.CustomTabs.data.filter((c: any) => c.fieldName === func.ufD_Target_Field);
		// 		} else if (func.functionMode === 'Client' || func.functionMode === 'Market') {
		// 			TargetControl = that.CustomerGrid.data.filter((c: any) => c.columnName === func.ufD_Target_Field);
		// 		} else {
		// 			TargetControl = that.controls.filter((c: any) => c.fieldName === func.ufD_Target_Field);
		// 		}
		// 		//const TargetControl: any = (func.functionMode=== 'Custom'?that.CustomTabs.data.filter((c: any) => c.fieldName === func.ufD_Target_Field):that.controls.filter((c: any) => c.fieldName === func.ufD_Target_Field));  //added this.CustomTabs to handle if target field is in custom tab
		// 		// console.log("Target controls are::::::", TargetControl);
		// 		let ufD_CSV_InputArr = [];
		// 		var searchArr = this.controls;
		// 		var searchArr_customtab = ((!this.isNullOrUndefined(index_ctr) && this.customtab_all_triggered == true) ? this.tableRow[index_ctr] : this.tableRow[this.ctCtr]); //this.CustomTabs.data;
		// 		var searchArr_custgrid = ((!this.isNullOrUndefined(index_ctr) && this.customergrid_all_triggered == true) ? this.custGridTableRow[index_ctr] : this.custGridTableRow[this.cgrowindex]);
		// 		var params: any[] = [];
		// 		ufD_CSV_InputArr = func.ufD_CSV_Input.split('~');
		// 		// console.log("ufD_CSV_InputArr is: ", ufD_CSV_InputArr);
		// 		let ref_obj_arr = func.ufD_Reference_Object_CSV.split('~');
		// 		// console.log("ref_obj_arr is: ", ref_obj_arr);
		// 		for (let i = 0; i < ufD_CSV_InputArr.length; i++) {
		// 			if (ufD_CSV_InputArr[i] != "" || ufD_CSV_InputArr[i] != null || ufD_CSV_InputArr[i].length > 0) {
		// 				switch (ref_obj_arr[i]) { //as length of ufd_csv & ref_obj_arr is same and one-to-one mapped
		// 					case "Default":
		// 						searchArr.forEach(element => {
		// 							if (element.fieldName === String(ufD_CSV_InputArr[i]).replace('UDF.', '')) //added UDF. because custom tab funcs i/p csv contains udf. for udf i/ps but product funcs doesn't
		// 								params.push(element);
		// 						});
		// 						switch (String(ufD_CSV_InputArr[i]).replace('UDF.', '').toUpperCase()) //if input csv contains names which are not a part of searcharr  like templateid, notemasterid,etc, cases to be added here below for it
		// 						{
		// 							case 'TEMPLATEID':
		// 								params.push({
		// 									dataType: "",
		// 									value: String(this.template.template_Id)
		// 								});
		// 								break;
		// 							case 'NOTEMASTERID':
		// 								params.push({
		// 									dataType: "",
		// 									value: String(this.iNoteMasterID)
		// 								});
		// 								break;
		// 							case 'ENTITYID':
		// 								params.push({
		// 									dataType: "",
		// 									value: "4"
		// 								});
		// 								break;	
		// 							default:
		// 								break;
		// 						}
		// 						break;
		// 					case "Basket":
		// 					case "Custom":
		// 						searchArr_customtab.forEach(element => {
		// 							if (element.fieldName === String(ufD_CSV_InputArr[i]).replace('BA.', ''))
		// 								params.push(element);
		// 						});
		// 						break;
		// 					case "Customer Grid":
		// 						searchArr_custgrid.forEach(element => {
		// 							if (element.columnName === ufD_CSV_InputArr[i])
		// 								params.push(element);
		// 						});
		// 						break;
		// 				}
		// 			}
		// 		}

		// 		// console.log("Function name, Parameters list   ", func.ufD_Function_Name, params);
		// 		// console.log('R2' + params[1]);
		// 		const funcName = func.ufD_Function_Name;
		// 		const dbName = func.ufD_DB_Name;
		// 		const classname = func.ufD_Class_Name;

		// 		// console.log(func);
		// 		const outputForm = (func.ufD_Function_Output_Form + '').toUpperCase();

		// 		let csvFunctionParameter = '';
		// 		const blnValuesAvailableCheck = true;
		// 		const dropdownNames = Object.keys(this.dropdowns);
		// 		params.forEach(p => {
		// 			// console.log("Before::::", p.value);
		// 			let controlValue: any = '';
		// 			let datatype: any;
		// 			if (func.functionMode === 'Client' || func.functionMode === 'Market') {
		// 				if (p.type != undefined)
		// 					datatype = p.type.toUpperCase()
		// 				else
		// 					datatype = p.type
		// 			} else {
		// 				if (p.datatype != undefined)
		// 					datatype = p.dataType.toUpperCase()
		// 				else
		// 					datatype = p.dataType
		// 			}
		// 			switch (datatype) {
		// 				case 'AMOUNT':
		// 				case 'NUMBER':
		// 				case 'INTEGER':
		// 					controlValue = p.value ? (p.value.includes(',') ? p.value.replace(/,/g, '') : this.formatKLMB(p.value, p.udF_Format).replace(/,/g, '')) : '0';
		// 					// console.log("Amount case controlvalue is :", controlValue);
		// 					//// following 2 lines are added just to handle sir's assignment -> to handle in sql function written by Swati.
		// 					if (controlValue.includes('.00')) {
		// 						controlValue = controlValue.replace('.00', '');
		// 					}
		// 					break;
		// 				default:
		// 					if (!p.value && dropdownNames.includes(p.dataType)) {
		// 						p.value = this.dropdowns[p.dataType][0].code;
		// 					} else {
		// 						// console.log("After!!!", p.value);
		// 						controlValue = p.value;
		// 						// if(controlValue.includes('.00')){    //TEMP TO check functions (formatted number giving error in functions)
		// 						//   controlValue =  controlValue.replace('.00',''); //commented as discussed with Swati P,giving error for freq datatype
		// 						// }
		// 						// console.log('BETWWNNNNNNNNNNNNN', controlValue)
		// 					}
		// 					break;
		// 			}

		// 			csvFunctionParameter += (csvFunctionParameter.length ? ',\'' : '\'') + controlValue + '\'';

		// 		});

		// 		// csvFunctionParameter = '\'' + csvFunctionParameter + '\'';
		// 		// console.log("This is function name----->^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", funcName);
		// 		// console.log(csvFunctionParameter, typeof(csvFunctionParameter));
		// 		// console.log(that.dropdowns);
		// 		if (blnValuesAvailableCheck) {
		// 			// console.log("Input parameters for function calls:: ", csvFunctionParameter);
		// 			if (functionType.toUpperCase() === 'WCF SERVICE') { //Added by Swati 
		// 				var wcfparam: any[] = [];					
		// 					let strcsvFunctionParameter = csvFunctionParameter.replace(/\'/gi,"'~@"); //to remove single quotes from parameters
		// 					var temparr = [];
		// 					temparr = strcsvFunctionParameter.split("~@,");
		// 					temparr.forEach((element) => { 
		// 						wcfparam.push(element.toString().replace(/~@/g, ''));
		// 					});
		// 					// wcfparam.forEach( (e) => {e.replace("~@", '') });
		// 					console.log("2.... Input parameters for WCF Service calls:: ", wcfparam);
		// 				await this.api.InvokeWCFServiceMigration(dbName, classname, funcName, wcfparam, outputForm, TargetControl[0] ? TargetControl[0].displayName : "", func.functionMode).then(
		// 					 (response: any) => {
		// 						if (response.status === Status.Success) {
		// 							const res = response.response;
		// 							// console.log("swaaaaaaaaaaa wcf", res)
		// 							if (res) {
		// 								 this.dataAssignmentAfterExecuteFunction(funcIndex, functions, functionType, index_ctr, func, TargetControl, outputForm, res);
		// 							}
		// 						}
		// 					});
		// 			} else {
		// 				await this.api.ExecuteFunction(funcName, functionType, csvFunctionParameter, dbName, outputForm, TargetControl[0] ? TargetControl[0].displayName : "", func.functionMode).then(
		// 					(response: any) => {
		// 						if (response.status === Status.Success) {
		// 							const res = response.response;
		// 							// console.log("Function call response: $$$$$$$$$$$$", res);
		// 							if (res) {
		// 								if (!this.isNullOrUndefined(index_ctr) && (this.customtab_all_triggered == true)) { //triggering funcs only if customtab_all_triggered iset and value of index is defined
		// 									this.ctCtr = index_ctr;
		// 									// console.log("Sync row done,ctctr value is:", this.ctCtr);
		// 								}
		// 								if (!this.isNullOrUndefined(index_ctr) && (this.customergrid_all_triggered == true)) { //triggering funcs only if customergrid_all_triggered iset and value of index is defined
		// 									this.cgrowindex = index_ctr;

		// 								}

		// 								if (outputForm == 'HARD BLOCK') {
		// 									///////////////////
		// 									// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
		// 									//console.log(target, res);
		// 									let hardblkres = JSON.parse(res);

		// 									if (hardblkres) {
		// 										if (hardblkres.DocumentElement) {
		// 											if (hardblkres.DocumentElement.DUMMY) {
		// 												if (hardblkres.DocumentElement.DUMMY.Column1 != null && hardblkres.DocumentElement.DUMMY.Column1.trim() != "") {
		// 													this.sWarningtextArr.push(hardblkres.DocumentElement.DUMMY.Column1.trim());
		// 													hardblocklist.push(true);
		// 												} else {
		// 													hardblocklist.push(false);
		// 												}

		// 											} else {
		// 												hardblocklist.push(false);
		// 											}
		// 										}
		// 									}
		// 									////////
		// 									if (hardblocklist.length == functions.length) {
		// 										var tempStr = "";
		// 										for (let i = 0; i < this.sWarningtextArr.length; i++) {
		// 											this.sWarningtextArr[i] = this.sWarningtextArr[i].toString() + "\n";
		// 										}
		// 										tempStr = this.sWarningtextArr.join("");
		// 										this.ErrorMessage = tempStr;
		// 										// console.log("Latest Error Message is: ", this.ErrorMessage)
		// 										let count = 0;
		// 										hardblocklist.forEach(ele => {
		// 											if (ele == false) {
		// 												count = count + 1;
		// 											}
		// 										});

		// 										if (count == hardblocklist.length) {
		// 											//this.hardblock_status.next(false);
		// 											this.loader = true;
		// 											debugger
		// 											this.SetDataContractForDealSave();
		// 										} else {
		// 											//this.hardblock_status.next(true);
		// 											this.loader = false;
		// 										}
		// 									}
		// 								} else {
		// 									 this.dataAssignmentAfterExecuteFunction(funcIndex, functions, functionType, index_ctr, func, TargetControl, outputForm, JSON.parse(res));

		// 								}
		// 							}
		// 						}
		// 						else if(response.status === Status.Fail){
		// 							console.log("Error occured in execute function: ",response.response);
		// 							console.error("Error occured in execute function: ",response.response);
		// 						}
		// 					},(error:any)=>{console.error(error);console.log(error);});
		// 			}
		// 		}

		// 	}
		// }

		async executeFunction(functions: any[], functionType: string, index_ctr ? : number, event ? : string) {
			try {

				const that = this;
				console.log("Inside Execute Function-------->", functionType);
				if (!this.isNullOrUndefined(functions)) { //to avoid errors if functions array count is zero
					//await this.callFunctionsInSequence(0, functions, functionType, index_ctr)
					//this.sWarningtextArr = []; //to clear warning text
					//let hardblocklist = [];
					console.log("List of functions for Execution: ", functions.filter(e => e.ufD_Function_TYpe.toUpperCase() == 'FUNCTION'))
					//functions.forEach(async (func: any) => {
					for (const func of functions) {
						// console.log("Function def is:::::: ", func);
						let blnValuesAvailableCheck = true; //shifted here by devesh 
						let TargetControl: any;
						let functionType = func.ufD_Function_TYpe;
						//added below part by Devesh for synchronization changes of particular row on 30-June-2021
						if (!this.isNullOrUndefined(index_ctr) && (this.customtab_all_triggered == true)) { //triggering funcs only if customtab_all_triggered iset and value of index is defined
							this.ctCtr = index_ctr;
							// console.log("Sync row done,ctctr value is:", this.ctCtr);
						}
						if (!this.isNullOrUndefined(index_ctr) && (this.customergrid_all_triggered == true)) { //triggering funcs only if customergrid_all_triggered iset and value of index is defined
							this.cgrowindex = index_ctr;
						}
						
						if (functionType.toUpperCase() == 'FORMULA') {
							this.executeFormula(func, event);
							continue;
						}
						if (String(func.ufD_Target_Field).toUpperCase() == "HEDGINGTYPE"){
							TargetControl = null;				
						}
						else{
						if (func.functionMode === 'Custom') {
							TargetControl = that.CustomTabs.data.filter((c: any) => c.fieldName === func.ufD_Target_Field);
						} else if (func.functionMode === 'Client' || func.functionMode === 'Market') {
							TargetControl = that.CustomerGrid.data.filter((c: any) => c.columnName === func.ufD_Target_Field);
						} else {
							TargetControl = that.controls.filter((c: any) => c.fieldName === func.ufD_Target_Field);
						}
						}					
						//const TargetControl: any = (func.functionMode=== 'Custom'?that.CustomTabs.data.filter((c: any) => c.fieldName === func.ufD_Target_Field):that.controls.filter((c: any) => c.fieldName === func.ufD_Target_Field));  //added this.CustomTabs to handle if target field is in custom tab
						// console.log("Target controls are::::::", TargetControl);
						let ufD_CSV_InputArr = [];
						let arrMandatoryInputCSV=[];
						var searchArr = this.controls;
						var searchArr_customtab = ((!this.isNullOrUndefined(index_ctr) && this.customtab_all_triggered == true) ? this.tableRow[index_ctr] : this.tableRow[this.ctCtr]); //this.CustomTabs.data;
						var searchArr_custgrid = ((!this.isNullOrUndefined(index_ctr) && this.customergrid_all_triggered == true) ? this.custGridTableRow[index_ctr] : this.custGridTableRow[this.cgrowindex]);
						var params: any[] = [];
						ufD_CSV_InputArr = func.ufD_CSV_Input.split('~');
						arrMandatoryInputCSV =func.ufD_Mandatory_CSV.split('~');
						if (String(func.ufD_Target_Field).toUpperCase() == "HEDGINGTYPE"){
							arrMandatoryInputCSV.splice(0,1).splice(arrMandatoryInputCSV.indexOf(""),1);
						}
						arrMandatoryInputCSV.splice(0,1).splice(arrMandatoryInputCSV.indexOf(""),1); //splicing blank & first values to keep arrmadatorycsv length in sync
						// console.log("ufD_CSV_InputArr is: ", ufD_CSV_InputArr);
						let ref_obj_arr = func.ufD_Reference_Object_CSV.split('~');
						// console.log("ref_obj_arr is: ", ref_obj_arr);
						for (let i = 0; i < ufD_CSV_InputArr.length; i++) {
							if (ufD_CSV_InputArr[i] != "" && ufD_CSV_InputArr[i] != null && ufD_CSV_InputArr[i].length > 0) {
								switch (ref_obj_arr[i]) { //as length of ufd_csv & ref_obj_arr is same and one-to-one mapped
									case "Default":
																			
										switch (String(ufD_CSV_InputArr[i]).toUpperCase()) //.replace('UDF.', '') //if input csv contains names which are not a part of searcharr  like templateid, notemasterid,etc, cases to be added here below for it
										{
											case 'TEMPLATEID':
												params.push({
													dataType: "",
													value: String(this.template.template_Id)
												});
												break;
											case 'NOTEMASTERID':
												params.push({
													dataType: "",
													value: String(this.iNoteMasterID)
												});
												break;
											case 'ENTITYID':
												if(!this.isNullOrUndefined(this.selectedEntity)){
													params.push({
														dataType: "",
															value: ""
													});
												}else{
												//case 'ENTTITY_ID':		
												params.push({
													dataType: "",
														value: String(this.selectedEntity)
												});
												}
												console.log("Entity ID:: ", this.selectedEntity, func)
												break;
											case 'LOGINNAME':
											case 'LOGIN':
											case 'USER':
											case 'USERID':
											case 'USER_ID':
												params.push({
													dataType: "",
													value: this.Login_Id
												});
												break;
											case 'HEDGINGTYPE':
												params.push({
													dataType: "",
													value: this.selectedBookingModel
												});
												break;
											case 'PRODUCTID':
												params.push({
													dataType: "",
													value: this.moduleData.product_Id
												});
												break;
											case 'PRODUCTCODE':
												params.push({
													dataType: "",
													value: this.Embedded_Control.toUpperCase()=="MULTIUCP" || this.Embedded_Control.toUpperCase()=="NATIVEFX" || this.Embedded_Control.toUpperCase()=="FUNDS" || this.Embedded_Control.toUpperCase() == "POSTCARD" ? this.Embedded_Template.product_Name : this.moduleData.product_Name
												});
												break;
											case 'PRODUCTSCHEDULE':
												let sScheduleXML = await this.RegenerateProductScheduleInPreviewMode();
												params.push({
													dataType: "",
													value: sScheduleXML
												});
												break;	
											default:
												// params.push({
												// 	dataType: "",
												// 	value: "0"
												// });
													//////logic shifted here as per .net code 
													// searchArr.forEach(element => {
													// 	if (element.fieldName === String(ufD_CSV_InputArr[i]).replace('UDF.', '')) //added UDF. because custom tab funcs i/p csv contains udf. for udf i/ps but product funcs doesn't
													// 		params.push(element);
													// });
													let element =searchArr.filter(ele=>ele.fieldName === String(ufD_CSV_InputArr[i]).replace('UDF.', ''))
													if (!this.isNullOrUndefined(element))
													{
														if(element.length>0)
														{
															params.push(element[0]);
														}
														else
														{
														blnValuesAvailableCheck=false; //not to trigger function if params are insufficient
														console.log("Element not present on layout or not defined: ",String(ufD_CSV_InputArr[i]).replace('UDF.', ''));
														console.log("Function : ",func.ufD_Function_Name," will not be executed");
														}
													}
													else
														{
														blnValuesAvailableCheck=false; //not to trigger function if params are insufficient
														console.log("Element not present on layout or not defined: ",String(ufD_CSV_InputArr[i]).replace('UDF.', ''));
														console.log("Function : ",func.ufD_Function_Name," will not be executed");
														}
													//console.log("Parameter not define", String(ufD_CSV_InputArr[i]).replace('UDF.', '').toUpperCase());
												break;
										}
										//}//
										break;
									case "Basket":
									case "Custom":
										searchArr_customtab.forEach(element => {
											if (element.fieldName === String(ufD_CSV_InputArr[i]).replace('BA.', ''))
												params.push(element);
										});
										break;
									case "Customer Grid":
									// 	if(String(ufD_CSV_InputArr[i]).toUpperCase()=="NOTEMASTERID"){
									// 		params.push({
									// 			dataType: "",
									// 			value: String(this.iNoteMasterID)
									// 		});
									// 	}
									// 	else{
									// 	searchArr_custgrid.forEach(element => {
									// 		if (element.columnName === ufD_CSV_InputArr[i])
									// 			params.push(element);
									// 	});
									// }
									//Added by RajeshC || Issue for functions having reference field Customer grid 
									switch (String(ufD_CSV_InputArr[i]).toUpperCase()) //.replace('UDF.', '') //if input csv contains names which are not a part of searcharr  like templateid, notemasterid,etc, cases to be added here below for it
									{
										case 'TEMPLATEID':
											params.push({
												dataType: "",
												value: String(this.template.template_Id)
											});
											break;
										case 'NOTEMASTERID':
											params.push({
												dataType: "",
												value: String(this.iNoteMasterID)
											});
											break;
										case 'ENTITYID':
											if(!this.isNullOrUndefined(this.selectedEntity)){
												params.push({
													dataType: "",
														value: ""
												});
											}else{
												//case 'ENTTITY_ID':		
											params.push({
												dataType: "",
													value: String(this.selectedEntity)
											});
											}
											console.log("Entity ID:: ", this.selectedEntity, func)
											break;
										case 'LOGINNAME':
										case 'LOGIN':
										case 'USER':
										case 'USERID':
										case 'USER_ID':
											params.push({
												dataType: "",
												value: this.Login_Id
											});
											break;
										case 'HEDGINGTYPE':
											params.push({
												dataType: "",
												value: this.selectedBookingModel
											});
											break;
										case 'PRODUCTID':
											params.push({
												dataType: "",
												value: this.moduleData.product_Id
											});
											break;
										case 'PRODUCTCODE':
											params.push({
												dataType: "",
												value: this.Embedded_Control.toUpperCase()=="MULTIUCP" || this.Embedded_Control.toUpperCase()=="NATIVEFX" || this.Embedded_Control.toUpperCase()=="FUNDS" || this.Embedded_Control.toUpperCase() == "POSTCARD" ? this.Embedded_Template.product_Name : this.moduleData.product_Name
											});
											break;
										case 'PRODUCTSCHEDULE':
											let sScheduleXML = await this.RegenerateProductScheduleInPreviewMode();
											params.push({
												dataType: "",
												value: sScheduleXML
											});
											break;	
										default:
										searchArr_custgrid.forEach(element => {
											if (element.columnName === ufD_CSV_InputArr[i])
												params.push(element);
										});
												break;
										}

								}
							}
						}
						console.log("Length of paramas",params.length);
						console.log("Lenght of arrmandatoryCSV",arrMandatoryInputCSV.length);
						if (arrMandatoryInputCSV.length>0 && arrMandatoryInputCSV.length==params.length) //to ensure all params are included & length of arrmandatory & params is same
						{
						for (let i=0; i<arrMandatoryInputCSV.length;i++)
						{
							if(arrMandatoryInputCSV[i].toUpperCase()=='Y' && params[i].value.trim()=='')
							{
								blnValuesAvailableCheck=false; //not to trigger function if all mandatory fields are not present
								console.log("Mandatory field value blank : ",params[i]," Function : ",func.ufD_Function_Name," will not be executed");
								break;
							}
							}
						}

						// console.log("Function name, Parameters list   ", func.ufD_Function_Name, params);
						// console.log('R2' + params[1]);
						const funcName = func.ufD_Function_Name;
						const dbName = func.ufD_DB_Name;
						const classname = func.ufD_Class_Name;

						// console.log(func);
						const outputForm = (func.ufD_Function_Output_Form + '').toUpperCase();

						let csvFunctionParameter = '';
						
						const dropdownNames = Object.keys(this.dropdowns);
						params.forEach(p => {
							// console.log("Before::::", p.value);
							let controlValue: any = '';
							let datatype: any;
							if (func.functionMode === 'Client' || func.functionMode === 'Market') {
								if (p.type != undefined)
									datatype = p.type.toUpperCase()
								else
									datatype = p.dataType.toUpperCase()  //changed by swati from type to datatype(goes where for client function whose input is udf field)
							} else {
								if (p.datatype != undefined)
									datatype = p.dataType.toUpperCase()
								else
									datatype = p.dataType
							}
							switch (datatype) {
								case 'AMOUNT':
								case 'NUMBER':
								case 'INTEGER':
									controlValue = p.value ? (p.value.includes(',') ? p.value.replace(/,/g, '') : this.formatKLMB(p.value, p.udF_Format).replace(/,/g, '')) : '0';
									// console.log("Amount case controlvalue is :", controlValue);
									//// following 2 lines are added just to handle sir's assignment -> to handle in sql function written by Swati.
									// if (controlValue.includes('.00')) {
									// 	controlValue = controlValue.replace('.00', '');
									// }
									break;
								default:
									if (!p.value && dropdownNames.includes(p.dataType)) {
										p.value = this.dropdowns[p.dataType][0].code;
									} else {
										// console.log("After!!!", p.value);
										controlValue = p.value;
										// if(controlValue.includes('.00')){    //TEMP TO check functions (formatted number giving error in functions)
										//   controlValue =  controlValue.replace('.00',''); //commented as discussed with Swati P,giving error for freq datatype
										// }
										// console.log('BETWWNNNNNNNNNNNNN', controlValue)
									}
									break;
							}

							csvFunctionParameter += (csvFunctionParameter.length ? ',\'' : '\'') + controlValue + '\'';

						});

						let sInputCol = func.ufD_CSV_Input.toString();
						let arrRefCol = sInputCol != "" ?  sInputCol.split("~") : [];
						let sOutputCol = func.ufD_CSV_Output.toString();
						let arrOutputCol = [];
						if(sOutputCol){
							sOutputCol = sOutputCol.substring(1);
							arrOutputCol = sOutputCol ? sOutputCol.split("~") : [];
						}
						let sParaCol = sInputCol + sOutputCol
						let arrINputCol = sParaCol ? sParaCol.split("~") : [];
						//csvFunctionParameter = '\'' + csvFunctionParameter + '\'';
						console.log("This is function name----->^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", funcName);
						console.log(csvFunctionParameter, typeof(csvFunctionParameter));
						console.log(that.dropdowns);
						let response: any;
						if (blnValuesAvailableCheck) {
							//this.ClearTargetFieldValuesBeforeCallingFunction(funcName, functionType, outputForm, func, TargetControl);
							if (!this.CheckFunctionExecution(funcName, functionType, csvFunctionParameter, dbName, outputForm,classname,func.ufD_cacheYN,func,TargetControl,event))
							{
							//do nothing value taken from cache & assigned before hand in the function itself 
							}
							else{
							///value not taken from cache & function triggered
							console.log("Input parameters for Function calls:: ", func, csvFunctionParameter);
							if (functionType.toUpperCase() === 'WCF SERVICE') { //Added by Swati 
								var wcfparam: any[] = [];
								let strcsvFunctionParameter = csvFunctionParameter.replace(/\'/gi, "'~@"); //to remove single quotes from parameters
								var temparr = [];
								temparr = strcsvFunctionParameter.split("~@,");
								temparr.forEach((element) => {
									wcfparam.push(element.toString().replace(/~@/g, '').replace(/[']/g, ''));
								});
								// wcfparam.forEach( (e) => {e.replace("~@", '') });
								console.log("2.... Input parameters for WCF Service calls:: ", wcfparam);
								//this.loader1 = true;
								// await this.api.InvokeWCFServiceMigration(dbName, classname, funcName, wcfparam, outputForm, TargetControl[0] ? TargetControl[0].displayName : "", func.functionMode).then(
								// 	async (response: any) => {
								// 		if (response.status === Status.Success) {
								// 			const res = response.response;
								// 			// console.log("swaaaaaaaaaaa wcf", res)
								// 			if (res) {
								// 				await this.dataAssignmentAfterExecuteFunction(func, TargetControl, outputForm, res);
								// 				setTimeout(() => {
								// 					this.loader1=false;
								// 				}, 700);
								// 			}
								// 		}
								// 	});
								try {
									response = await this.api.InvokeWCFServiceMigration(dbName, classname, funcName, wcfparam, outputForm, TargetControl[0] ? TargetControl[0].displayName : "", func.functionMode);
									if (response.status === Status.Success) {
										const res = response.response;
										// console.log("swaaaaaaaaaaa wcf", res)
										if (res) {
											this.dataAssignmentAfterExecuteFunction(func, TargetControl, outputForm, res, event);
											//this.loader1 = false;
											if (func.ufD_cacheYN.toString().toUpperCase()=='Y') //insert value in dictionary for cache
											{
											let oDSNFunctionExecution:DSNFunctionExecution =new DSNFunctionExecution();
											oDSNFunctionExecution.ClassNameField=classname;
											oDSNFunctionExecution.ExeNameField=dbName;
											oDSNFunctionExecution.FunctionNameField=funcName;
											oDSNFunctionExecution.FunctionTypeField=functionType;
											oDSNFunctionExecution.InputParametersField=csvFunctionParameter;
											oDSNFunctionExecution.OutputField=func.ufD_Target_Field;
											this.DSNFunctionExecution.set((JSON.stringify(oDSNFunctionExecution)),res); //JSON.parse not required here for response as it is from wcf service
											console.log("Updated dictionary value",this.DSNFunctionExecution); 
											}										 
										}
									} else if (response.status === Status.Fail) {
										//console.log("Error occured in execute function: ",response.response);
										//this.loader1 = false;
										console.error("Error occured in execute function: ", response.response);
										//this.api.WriteErrorLogs("Error occured in  InvokeWCFServiceMigration: "+funcName+" :"+response.response);
									} else {
										//this.loader1 = false;
										console.error("Error occured in execute function: ", response.response);
										//this.api.WriteErrorLogs("Error occured in  InvokeWCFServiceMigration: "+funcName+" :"+response.response);
									}

								} catch (error) {
									//this.loader1 = false;
									console.error("Error occured in execute function: ", error);
									//this.api.WriteErrorLogs("Error occured in  InvokeWCFServiceMigration: "+funcName+" :"+response.response);
								}

							}
							else if(functionType.toUpperCase() === 'REST JSON') {
								/// Added REST JSON by OnkarE on 23-Aug-2021
								// let strpara = csvFunctionParameter.replace(/,/g, "~")
								// strpara = strpara.replace(/'/g, "");
								// let STRiNPut = strpara ? strpara.split("~") : [];
								let strPara = encodeURIComponent(csvFunctionParameter);
								let STRiNPut = strPara.split("'%2C'")
								for (let i = 0; i < STRiNPut.length; i++) {
									STRiNPut[i] = decodeURIComponent(STRiNPut[i]).replace(/'/g, "") 
								}
								// let STRout = sParaCol ? sParaCol.split("~") : [];
								let strJsonTags = func.ufD_Parameter_CSV;
								let samplejson = func.ufD_SampleRequest;
								let arrJsontags = [];
								let samplejsonObj = JSON.parse(samplejson);
								let InputKeys = Object.keys(samplejsonObj);
								console.log("REST JSON input formation::: ", strJsonTags, samplejson, arrINputCol, arrRefCol, STRiNPut);
								if(strJsonTags){
									strJsonTags = strJsonTags.substring(1);
									arrJsontags = strJsonTags ? strJsonTags.split("~") : [];
									if(arrRefCol[0] == ""){
										arrRefCol.shift();
									}
									if(arrRefCol[arrRefCol.length - 1] == ""){
										arrRefCol.pop();
									}
									var inputjsonObj = {};
									for (let i = 0; i < STRiNPut.length; i++) {
										inputjsonObj[InputKeys[i]] = STRiNPut[i]
									}
									console.log("REST JSON Formation is: ", samplejsonObj, inputjsonObj);
									if(JSON.stringify(dbName).toUpperCase().includes('QUOTE')){
										this.headerForQuote = this.controls.filter(e => e.fieldName == this.headerForQuoteField) ? this.controls.filter(e => e.fieldName == this.headerForQuoteField)[0].value : "";
									}
									console.log("Header for QUOTE: ", this.headerForQuote)
									response = await this.api.InvokeRestJSON(dbName, JSON.stringify(inputjsonObj), this.headerForQuote);
									if (response.status === Status.Success) {
										const res = response.response;
										// console.log("Function call response: $$$$$$$$$$$$", res);
										if (res) {										
										await this.dataAssignmentAfterExecuteFunction(func, TargetControl, outputForm, JSON.parse(res), event);
										//this.loader1 = false;
										// if (func.ufD_cacheYN.toString().toUpperCase()=='Y') { //insert value in dictionary for cache
										// 	let oDSNFunctionExecution:DSNFunctionExecution =new DSNFunctionExecution();
										// 	oDSNFunctionExecution.ClassNameField=classname;
										// 	oDSNFunctionExecution.ExeNameField=dbName;
										// 	oDSNFunctionExecution.FunctionNameField=funcName;
										// 	oDSNFunctionExecution.FunctionTypeField=functionType;
										// 	oDSNFunctionExecution.InputParametersField=csvFunctionParameter;
										// 	oDSNFunctionExecution.OutputField=func.ufD_Target_Field;
										// 	this.DSNFunctionExecution.set((JSON.stringify(oDSNFunctionExecution)),JSON.parse(res)); //JSON.parse required here as o/p is obtained from sql func
										// 	console.log("Updated dictionary value",this.DSNFunctionExecution); 
										// }											
											
										}
									} else if (response.status === Status.Fail) {
										//this.loader1 = false;
										console.log("Error occured in rest json execution: ", response.response);
										console.error("Error occured in rest json execution: ", response.response);
										//this.api.WriteErrorLogs("Error occured in  InvokeRestJSON: "+funcName+" :"+response.response);
									} else {
										//this.loader1 = false;
										console.log("Error occured in rest json execution: ", response.response);
										console.error("Error occured in rest json execution: ", response.response);
										//this.api.WriteErrorLogs("Error occured in  InvokeRestJSON: "+funcName+" :"+response.response);
									}
								}
							}
							else {
								//this.loader1 = true;
								try {
									// let param = [];
									// param.push({ "Param_Name": "", 'Param_Value': csvFunctionParameter, 'Param_BDType': "String" });
									//response = this._autodata.ExecuteFunction(funcName,dbName,outputForm,csvFunctionParameter);
									
									response = await this.api.ExecuteFunction(funcName, functionType, csvFunctionParameter, dbName, outputForm, TargetControl[0] ? TargetControl[0].displayName : "", func.functionMode);
									//this._autodata.test_Execute_SP(funcName, dbName, param, "FUNCTION", "NO", true);
									//await this.api.ExecuteFunction(funcName, functionType, csvFunctionParameter, dbName, outputForm, TargetControl[0] ? TargetControl[0].displayName : "", func.functionMode)
									
									//await this.api.ExecuteFunction(funcName, functionType, csvFunctionParameter, dbName, outputForm, TargetControl[0] ? TargetControl[0].displayName : "", func.functionMode).then(
									//async (response: any) => {

									if (response.status === Status.Success) {
										const res = response.response;
										// console.log("Function call response: $$$$$$$$$$$$", res);
										if (res) {
											if (!this.isNullOrUndefined(index_ctr) && (this.customtab_all_triggered == true)) { //triggering funcs only if customtab_all_triggered iset and value of index is defined
												this.ctCtr = index_ctr;
												// console.log("Sync row done,ctctr value is:", this.ctCtr);
											}
											if (!this.isNullOrUndefined(index_ctr) && (this.customergrid_all_triggered == true)) { //triggering funcs only if customergrid_all_triggered iset and value of index is defined
												this.cgrowindex = index_ctr;

											}

											if (outputForm == 'HARD BLOCK') {
												
												let hardblkres = JSON.parse(res);
												//this.loader1 = false;
												if (hardblkres) {
													if (hardblkres.DocumentElement) {
														if (hardblkres.DocumentElement.DUMMY) {
															if (hardblkres.DocumentElement.DUMMY[0].Column1[0] != null && hardblkres.DocumentElement.DUMMY[0].Column1[0].trim() != "") {
																if(this.sWarningtextArr.findIndex(e => e.includes(hardblkres.DocumentElement.DUMMY[0].Column1[0].trim())) == -1){
																	this.sWarningtextArr.push(hardblkres.DocumentElement.DUMMY[0].Column1[0].trim());
																	this.hardblock_triggered=true;
																}																															
															} 
														} 
														
													}
												}
												
											}
											else if(outputForm == 'WARNING'){
												let warningres = JSON.parse(res);
												//this.loader1 = false;
												if (warningres) {
													if (warningres.DocumentElement) {
														if (warningres.DocumentElement.DUMMY) {
															if (warningres.DocumentElement.DUMMY.Column1 != null && warningres.DocumentElement.DUMMY.Column1.trim() != "") {
																if(this.sWarningtextArr.findIndex(e => e.includes(warningres.DocumentElement.DUMMY.Column1.trim())) == -1) {
																	this.sWarningtextArr.push(warningres.DocumentElement.DUMMY.Column1.trim());
																	this.warning_triggered=true;
																}
																															
															}
															else { /// Added by OnkarE on 22-Mar-2022 to clear warning text when response is null 
																this.sWarningtextArr = [];
															} 														
														} 
													}
												}
											}
											else if (outputForm=='PROMPT'){
											let promptres=JSON.parse(res)
												if(promptres){
													if (promptres.DocumentElement){
														if(promptres.DocumentElement.DUMMY){
															if (promptres.DocumentElement.DUMMY.Column1 != null && promptres.DocumentElement.DUMMY.Column1.trim() != ""){
																const dialogConfig = new MatDialogConfig();
																dialogConfig.width = "350px";
																dialogConfig.height = "180px";
																//dialogConfig.disableClose = true;
																dialogConfig.data={title:this.template.template_Name,dialogText:promptres.DocumentElement.DUMMY.Column1.trim()};															
																this.PromptDialogRef=this.matDialog.open(this.Promptbox, dialogConfig);
															}
														}
													}
												}
											}
											else {
												await this.dataAssignmentAfterExecuteFunction(func, TargetControl, outputForm, JSON.parse(res), event);
												//this.loader1 = false;
												if (func.ufD_cacheYN.toString().toUpperCase()=='Y') //insert value in dictionary for cache
											{
											let oDSNFunctionExecution:DSNFunctionExecution =new DSNFunctionExecution();
											oDSNFunctionExecution.ClassNameField=classname;
											oDSNFunctionExecution.ExeNameField=dbName;
											oDSNFunctionExecution.FunctionNameField=funcName;
											oDSNFunctionExecution.FunctionTypeField=functionType;
											oDSNFunctionExecution.InputParametersField=csvFunctionParameter;
											oDSNFunctionExecution.OutputField=func.ufD_Target_Field;
											this.DSNFunctionExecution.set((JSON.stringify(oDSNFunctionExecution)),JSON.parse(res)); //JSON.parse required here as o/p is obtained from sql func
											console.log("Updated dictionary value",this.DSNFunctionExecution); 
											}											
											}
										}
									} else if (response.status === Status.Fail) {
										//this.loader1 = false;
										console.log("Error occured in execute function: ", response.response);
										console.error("Error occured in execute function: ", response.response);
										//this.api.WriteErrorLogs("Error occured in execute function: "+funcName+" :"+response.response);
									} else {
										//this.loader1 = false;
										console.log("Error occured in execute function: ", response.response);
										console.error("Error occured in execute function: ", response.response);
										//this.api.WriteErrorLogs("Error occured in execute function: "+funcName+" :"+response.response);
									}
								} catch (error) {
									//this.loader1 = false;
									console.error("Error occured in execute function: ", error);
									//this.api.WriteErrorLogs("Error occured in execute function: "+funcName+" :"+response.response);
								}
								//}); //this.loader1=false; //,(error:any)=>{console.error(error);console.log(error);}
							} //
							}

						}
					};
					//this.loader = false; //commented by devesh for loader changes
					if(this.sWarningtextArr.length>0) //added by Devesh for Hardblock related changes on 18-Jun-2021
					{
						var tempStr = "";
						for (let i = 0; i < this.sWarningtextArr.length; i++) {
							if(!this.sWarningtextArr[i].includes("\n\n"))
								this.sWarningtextArr[i] = this.sWarningtextArr[i].toString() + "\n";
						}
						tempStr = this.sWarningtextArr.join("");
						this.ErrorMessage = tempStr;
					}
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error occured in execute function: "+error);
			} finally {
			}
		}
		PromptYes_click(){
			try {
				if(this.sUCPMode=="UCPQEN"){ //As per dotnet logic
					this.SaveData();
				}
			} 
			catch (error) {
				//this.api.WriteErrorLogs("Error occured in PromptYes_click :"+error);
			}
		}
		// PromptNo_click(){ //no need done directly from html side
		// 	try {
		// 		this.PromptDialogRef.close();
		// 	} 
		// 	catch (error) {
		// 	}
		// }

		async RegenerateProductScheduleInPreviewMode(){
			try {
				let response: any;
				this.CreateAppTableDataContract();
				response = await this.api.GetProductSchedule(Number(this.iTemplateID), "", this.oUCPAppTablesData, true,[] , false, "", Number(this.entityId), this.sUCPMode, this.iNoteMasterID ? Number(this.iNoteMasterID) : 0, this.Login_Id)
				if (response.status === Status.Success) {
					const res = response.response;				
					if (res) {
					//let Prodsched=JSON.parse(res); //commented since already parsed data is received
					let xml;
					
					xml = JsonToXML.parse("ProductSchedule", res);				
					xml = xml.replace('<ProductSchedule>', '<DocumentElement>'); //added replacement logic because parsing function was not assigning same parent name to child node so assigned name of all nodes to custom tab and then changed name of parent node to documentelement
					xml = xml.slice(0, xml.lastIndexOf('</ProductSchedule>')) + xml.slice(xml.lastIndexOf('</ProductSchedule>')).replace('</ProductSchedule>', '</DocumentElement>');
					xml = xml.replace("<?xml version='1.0'?>", "");
					console.log("ProductSchedule xml", String(xml));
					///logic for assigning xml value to particular udf field
					return String(xml);
					}
					else{
						return "";
					}
				}
				else {
					console.log("Ressponse failed: ",response);
					//this.api.WriteErrorLogs("Ressponse failed in RegenerateProductScheduleInPreviewMode: "+response.response);
					return "";
				}
				
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Ressponse failed in RegenerateProductScheduleInPreviewMode: "+error);
			}
		}
		ClearTargetFieldValues(outputForm:string, functionMode:string, target:any,column_index:number) {  //function modified by Devesh for clearing target field if response is null on 16-nov-2021
			try {
				const that = this;
				console.log("Clear target value function call....", target[0].displayName);
				switch (String(functionMode).toUpperCase()) {
					case "CUSTOM":
						//for (let i = 0; i < this.tableRow[this.ctCtr].length; i++) {
						if(this.ctCtr!=-1)
							{
							switch (outputForm) {
								case 'DATASET':									
										switch (target[0].dataType) { 
											case 'COMMON DATA':							
												this.dropdowns[target[0].fieldName] = this.dropdowns[target[0].sourcingLink];//[]; //Added by Devesh for restoring to default if response received is null on 16-Nov-2021
												this.searchArrays[target[0].fieldName] = this.dropdowns[target[0].sourcingLink];//[];
												if (target[0].udF_Feature1 != 'Allow Blank Row' && target[0].defaultValue === '' && this.dropdowns[target[0].sourcingLink || target[0].fieldName] != null) {
													if (this.dropdowns[target[0].fieldName || target[0].sourcingLink].length > 0) {
														// this.tableRow[this.ctCtr][i].value = "";
														// this.tableRow[this.ctCtr][i].currentValue = "";
														this.tableRow[this.ctCtr][column_index].value = this.dropdowns[target[0].fieldName || target[0].sourcingLink][0].code; //Added by Devesh for restoring to default if response received is null on 16-Nov-2021
														this.tableRow[this.ctCtr][column_index].currentValue = this.dropdowns[target[0].fieldName || target[0].sourcingLink][0].code;
													}
												}
												break;
											case 'CURRENCY':
												this.dropdowns[target[0].fieldName] = []; //Added by Devesh for restoring to default if response received is null on 16-Nov-2021
												this.searchArrays[target[0].fieldName] = [];
												this.tableRow[this.ctCtr][column_index].value = ""; 
												this.tableRow[this.ctCtr][column_index].currentValue = ""; 
												break;
											case 'CHART': 
												this.tableRow[this.ctCtr][column_index].value = [];
												this.tableRow[this.ctCtr][column_index].sourcingLink = "";
												this.tableRow[this.ctCtr][column_index].chartoption = {}
												break;
										}
									this.ref.detectChanges();
									this.customTabFieldValueChange({
										field_element: this.tableRow[this.ctCtr][column_index],
										index: this.ctCtr
									});
									break;
								case 'SINGLE VALUE':
									target.forEach((tc: any) => {
											console.log(tc);
											this.tableRow[this.ctCtr][column_index].value = "";
											this.tableRow[this.ctCtr][column_index].currentValue = "";
									});
									break;
							}
							this.ref.detectChanges();						
						}
						break;
					case "CLIENT":
					case "MARKET":					
						if (this.cgrowindex != -1) {
							//for (let i = 0; i < this.custGridTableRow[this.cgrowindex].length; i++) {
								//if (this.custGridTableRow[this.cgrowindex][i].columnName === target[0].columnName) {
									switch (outputForm) {
										case 'DATASET':
												
												switch (String(target[0].type).toUpperCase()) { 
													case 'COMMON DATA':
														this.dropdowns[target[0].columnName + "_cg_" + String(this.cgrowindex)] = this.dropdowns[target[0].sourcingLink]; // [];
														this.searchArrays[target[0].columnName + "_cg_" + String(this.cgrowindex)] = this.dropdowns[target[0].sourcingLink];// [];
														if (target[0].udF_Feature1 != 'Allow Blank Row' && target[0].defaultValue === '' && this.dropdowns[target[0].sourcingLink || target[0].columnName] != null) {
															if (this.dropdowns[(target[0].columnName + "_cg_" + String(this.cgrowindex)) || target[0].sourcingLink].length > 0) {
																// this.custGridTableRow[this.cgrowindex][i].value = "";
																// this.custGridTableRow[this.cgrowindex][i].currentValue = "";
																this.custGridTableRow[this.cgrowindex][column_index].value = this.dropdowns[(target[0].columnName + "_cg_" + String(this.cgrowindex))|| target[0].sourcingLink][0].code;
																this.custGridTableRow[this.cgrowindex][column_index].currentValue = this.dropdowns[(target[0].columnName + "_cg_" + String(this.cgrowindex)) || target[0].sourcingLink][0].code;
															}
														}
														break;
													case 'CURRENCY':
														this.dropdowns[target[0].columnName + String(this.cgrowindex)] =  [];
														this.searchArrays[target[0].columnName + String(this.cgrowindex)] =  [];
														this.custGridTableRow[this.cgrowindex][column_index].value = "";
														this.custGridTableRow[this.cgrowindex][column_index].currentValue = "";
														break;
													case 'CHART': 
														this.custGridTableRow[this.cgrowindex][column_index].value = [];
														this.custGridTableRow[this.cgrowindex][column_index].sourcingLink = "";
														this.custGridTableRow[this.cgrowindex][column_index].chartoption = {};
														break;
												}																			
											this.ref.detectChanges();
											break;
										case 'SINGLE VALUE':
											this.custGridTableRow[this.cgrowindex][column_index].value = "";
											this.custGridTableRow[this.cgrowindex][column_index].currentValue = "";
											this.ref.detectChanges();																		
											break;																	
									}
									this.ref.detectChanges();								
								//} 
							//} 
						}
						break;
					case "PRODUCT":
					default:
						switch (outputForm) {
							case 'DATASET':						

									switch (target[0].dataType) {
										case 'UCP USER CONTROL':
											target[0].gridDt = [];
											break;
										case 'COMMON DATA':								
											this.dropdowns[target[0].fieldName] = this.dropdowns[target[0].sourcingLink];//[];
											this.searchArrays[target[0].fieldName] = this.dropdowns[target[0].sourcingLink];// [];
											if (target[0].udF_Feature1 != 'Allow Blank Row'  && this.dropdowns[target[0].sourcingLink || target[0].fieldName] != null) {
												target[0].value = this.dropdowns[target[0].fieldName || target[0].sourcingLink][0].code;//"";
											}
											break;
										case 'CURRENCY':	
											this.dropdowns[target[0].fieldName] = []; //Added by Devesh for restoring to default if response received is null on 16-Nov-2021
											this.searchArrays[target[0].fieldName] = [];									
											target[0].value = ""; 
											break;
										case 'CHART': 
											target[0].value = [];																				
									}								
								this.ref.detectChanges();
								this.udfFieldValueChange(target[0]);
								break;
							case 'SINGLE VALUE':
								target.forEach(async (tc: any) => {											
									tc.value = "";
								});
								break;									
						}
						this.ref.detectChanges();				
						break;
				}
			} catch (e) {
				console.log("Error in ClearTargetFieldValues", e)
				//this.api.WriteErrorLogs("Error in ClearTargetFieldValuesBeforeCallingFunction: "+e);
			}
		}


		CheckFunctionExecution(funcName:string, functionType:string, csvFunctionParameter:string, dbName:string, outputForm:string,classname:string,Cache_YN:string,func:any,TargetControl:any,event ? : string):boolean {
			try{
				//returned true from this function if value is not taken from cache else returned false
				if (Cache_YN.toUpperCase()=='N' || outputForm.toUpperCase()=='HARD BLOCK' || outputForm.toUpperCase()=='WARNING' || outputForm.toUpperCase()=='PROMPT')
				{
					return true;
				}
				else
				{
				if(!this.isNullOrUndefined(this.DSNFunctionExecution))
				{
					let oDSNFunctionExecution:DSNFunctionExecution =new DSNFunctionExecution();
					oDSNFunctionExecution.ClassNameField=classname;
					oDSNFunctionExecution.ExeNameField=dbName;
					oDSNFunctionExecution.FunctionNameField=funcName;
					oDSNFunctionExecution.FunctionTypeField=functionType;
					oDSNFunctionExecution.InputParametersField=csvFunctionParameter;
					oDSNFunctionExecution.OutputField=func.ufD_Target_Field;
					if(this.DSNFunctionExecution.has(JSON.stringify(oDSNFunctionExecution))) //since .has() was not working with object datatype as key so converted to string
					{
						let resp = this.DSNFunctionExecution.get(JSON.stringify(oDSNFunctionExecution));
						console.log("Value received from Cache response: ",resp);
						this.dataAssignmentAfterExecuteFunction(func,TargetControl,outputForm,resp,event); 
						return false;
					}
					else
					{
						return true;
					}
				}
				else
				{
					return true;
				}
				}
			}
			catch(error)
			{
				//this.api.WriteErrorLogs("Error in CheckFunctionExecution: "+error);
			}	
			finally{

			}
		}

		async dataAssignmentAfterExecuteFunction(func: any, target: any[], outputForm: string, res: any, event ? : string) {
			try {

				const that = this;
				
				let sOverrrideEditRights = func.overrideEditRightsYN;
				// console.log(func, target, outputForm, res);
				if (String(func.ufD_Target_Field).toUpperCase() == "HEDGINGTYPE")
				{
					if (this.bookingModelData.includes(res)){
						this.selectedBookingModel = res
						that.changeHedgeType()
					}
				}
				else
				{
				switch (String(func.functionMode).toUpperCase()) { //to handle value assignment depending on whether target field is in custom tab,udf,customer grid
					case "CUSTOM":
						///////////
						// console.log("Data assignment of custom tab at row index as: ", this.ctCtr);
						for (let i = 0; i < this.tableRow[this.ctCtr].length; i++) {
							if (this.tableRow[this.ctCtr][i].fieldName === target[0].fieldName) {
								////////
								if (res.DocumentElement) {
									switch (outputForm) {
										case 'DATASET':
											if (res.DocumentElement.DUMMY) {
												// console.log("Debugging", res.DocumentElement.DUMMY, res.DocumentElement.DUMMY[0])
												var dataSetArr = [];
												dataSetArr.push(res.DocumentElement.DUMMY)
												let ddlValues;
												//   const datasetKey = Object.keys(dataSetArr[0]);
												//  console.log("key d",datasetKey);
												//  const ddlValues = [...dataSetArr.map((d: any) => ({ code: d[datasetKey[0]] }))];
												//   console.log("ddlvalue",ddlValues);
												// var keyinarr = Object.keys(dataSetArr[0][0])[0];
												// const ddlValues = dataSetArr[0].map(item => {
												// 	let container = {};
												// 	container['code'] = (typeof(item[keyinarr]) != 'object') ? item[keyinarr] : null;
												// 	return container;
												// })
												if (dataSetArr[0].length>1)
												{
												var keyinarr = Object.keys(dataSetArr[0][0])[0];
												ddlValues = dataSetArr[0].map(item => {
													let container = {};
													container['code'] = (typeof(item[keyinarr]) != 'object') ? item[keyinarr] : null;
													return container;
												})
												}
												else
												{
												const datasetKey = Object.keys(dataSetArr[0]);
												console.log("key d",datasetKey);
												ddlValues = [...dataSetArr.map((d: any) => ({ code: d[datasetKey[0]] }))];
												}
												const ddlValues1 = [...dataSetArr];
												// console.log("ddlValues1", ddlValues1);
												switch (target[0].dataType) { //here this.tableRow[this.ctCtr][i] & target[0] both are same
													case 'COMMON DATA':
														// console.log(res.DocumentElement.DUMMY.map((d: any) => d[datasetKey[0]]));
														// console.log("Custom tab Target field", this.tableRow[this.ctCtr][i].fieldName);
														this.dropdowns[target[0].fieldName] = ddlValues;
														this.searchArrays[target[0].fieldName] = ddlValues1;

														if (target[0].udF_Feature1 != 'Allow Blank Row' && target[0].defaultValue === '' && this.dropdowns[target[0].sourcingLink || target[0].fieldName] != null) {
															// console.log("Inside ngChanges", target[0], this.dropdowns);
															if (this.dropdowns[target[0].fieldName || target[0].sourcingLink].length > 0) {
																this.tableRow[this.ctCtr][i].value = this.dropdowns[target[0].fieldName || target[0].sourcingLink][0].code;
																this.tableRow[this.ctCtr][i].currentValue = this.dropdowns[target[0].fieldName || target[0].sourcingLink][0].code;
															}
														}
														// console.log(this.tableRow[this.ctCtr][i].fieldName, " Values are getting appended--> ", this.dropdowns, ddlValues);
														// console.log("Drop", this.dropdowns);
														break;
													case 'CURRENCY':
														// console.log("CURRRRRRRRRR", ddlValues, "CUR!!!!!!!", ddlValues1);
														ddlValues1[0].map(d => d.code = d.Currency); //made changes for currecny dpdown specific
														// console.log("ddlval_cur", ddlValues1[0]);
														this.dropdowns[target[0].fieldName] = ddlValues1[0];
														this.searchArrays[target[0].fieldName] = ddlValues1;
														// console.log("Drop", this.dropdowns);
														this.tableRow[this.ctCtr][i].value = this.dropdowns[target[0].fieldName][0].code; //added by devesh as selected value was not getting assigned in currency field
														this.tableRow[this.ctCtr][i].currentValue = this.dropdowns[target[0].fieldName][0].code; //added by devesh as selected value was not getting assigned in currency field
														break;
													case 'CHART': //added by devesh //chart datatype mostly not used in custom tab but case kept as it is 
														// console.log("Chart data in raw json: ", res.DocumentElement.DUMMY);
														if(this.tableRow[this.ctCtr][i].sourcingLink == '3D Chart') { /// added this condition by OnkarE on 03-Feb-2022
															this.tableRow[this.ctCtr][i].value = this.dropdowns[target[0].fieldname];
														}
														else {
														this.tableRow[this.ctCtr][i].value = res.DocumentElement.DUMMY.map(function(e) { //shorten format work for any no.of columns 
															return Object.keys(e).map(function(k) {
																return (_isNumberValue(e[k]) ? Number(e[k]) : e[k]);
															});
														});
														}
														// console.log("Chart data in 2D array format: ", this.tableRow[this.ctCtr][i].value);
														//further logic to be written
														switch (target[0].sourcingLink) {
															case 'Pie':
																this.tableRow[this.ctCtr][i].sourcingLink = 'PieChart';
																break;
															case 'Doughnut':
																this.tableRow[this.ctCtr][i].sourcingLink = 'PieChart';
																this.tableRow[this.ctCtr][i].chartoption = {
																	pieHole: 0.4
																};
																break;
															case 'Line':
																this.tableRow[this.ctCtr][i].sourcingLink = 'LineChart';
																break;
															case 'Bar':
																this.tableRow[this.ctCtr][i].sourcingLink = 'ColumnChart';
																break;
															case 'Funnel': //not supported
																break;
															case 'Pyramid': //not supported
																//target[0].sourcingLink='ColumnChart';
																break;
															case 'Bubble':
																//target[0].sourcingLink='ColumnChart';
																break;
														}
														if (target[0].udF_Feature1 == "Allow 3D") //added for 3d feature
														{
															this.tableRow[this.ctCtr][i].chartoption = {
																is3D: true
															};
														} else {
															this.tableRow[this.ctCtr][i].chartoption = {};
														}
														console.log("Target for chart ", this.tableRow[this.ctCtr][i]); //to check values after processing
														break;
												}
												console.log("Target", this.tableRow[this.ctCtr][i].fieldName);
												console.log("Drop", this.dropdowns);
											}
											this.ref.detectChanges();
											this.customTabFieldValueChange({
												field_element: this.tableRow[this.ctCtr][i],
												index: this.ctCtr
											});
											break;
										case 'SINGLE VALUE':
											target.forEach((tc: any) => {
												var isTransitive = false;
												if (res) {
													if (res.DocumentElement) {
														if (res.DocumentElement.DUMMY) {
															// console.log("TC Val", tc.value.trim().valueOf());
															// console.log("RESP", res.DocumentElement.DUMMY.Column1.trim().valueOf());
															if (res.DocumentElement.DUMMY.Column1 != null && tc.value.trim() != res.DocumentElement.DUMMY.Column1.trim()) {
																switch (tc.dataType) {
																	case 'AMOUNT':
																	case 'NUMBER':
																		if (Number(this.tableRow[this.ctCtr][i].value) != Number(res.DocumentElement.DUMMY.Column1.replace(/,/g, ''))) {
																			isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
																		}
																		this.tableRow[this.ctCtr][i].value = this.formatKLMB(res.DocumentElement.DUMMY.Column1, tc.udF_Format);
																		this.tableRow[this.ctCtr][i].currentValue = this.formatKLMB(res.DocumentElement.DUMMY.Column1, tc.udF_Format);
																		break;
																	case 'INTEGER':
																		this.tableRow[this.ctCtr][i].value = this.formatKLMB(res.DocumentElement.DUMMY.Column1, tc.udF_Format);
																		this.tableRow[this.ctCtr][i].currentValue = this.formatKLMB(res.DocumentElement.DUMMY.Column1, tc.udF_Format);
																		isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
																		break;
																		// case 'DATE':
																		//   tc.value   
																		// break;
																	default:
																		this.tableRow[this.ctCtr][i].value = res.DocumentElement.DUMMY.Column1;
																		this.tableRow[this.ctCtr][i].currentValue = res.DocumentElement.DUMMY.Column1;
																		isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
																		//console.log(this.CustomTabs.data, this.tableRow)
																		this.ref.detectChanges();
																		break;
																}
																if (func.ufD_Cascade_YN == 'N') //Added by SwatiP for circular function calling
																	return;
																if (isTransitive) { //added by devesh for transitivity issue on 12-Oct-2020
																	this.customTabFieldValueChange({
																		field_element: this.tableRow[this.ctCtr][i],
																		index: this.ctCtr
																	});
																}
															}
														} else { //else condition added by devesh for blanking out if response is null,discussed with Akshay D on 14-Oct-2020
															switch (tc.dataType) {
																case 'AMOUNT':
																case 'NUMBER':
																	this.tableRow[this.ctCtr][i].value = "";
																	this.tableRow[this.ctCtr][i].currentValue = "";
																	console.log("NULLL value blanked");
																	break;
															}
														}
													}
												}
												// console.log("Calling custom tab field Change again..................................->");
											});
											break;
										case 'VISIBLE':
											// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
											// console.log(target, res);
											if (sOverrrideEditRights=="N" || sOverrrideEditRights=="") //override edit rights added as per dotnet code by Devesh on 4-Oct-2021
											{
												if (this.oEditrightsCustom.length>0)
												{
													let dtVisible:any[]=this.oEditrightsCustom.filter(x=>x.eR_Visible_YN.toString().substr(0, 1)=="Y")
													if(dtVisible.length>0)
													{
														if(dtVisible.filter(x=>x.eR_UDF_Field==func.ufD_Target_Field))
														{
															return;
														}
													}
												}
											}
											target.forEach((tc: any) => {
												if (res) {
													if (res.DocumentElement) {
														if (res.DocumentElement.DUMMY) {
															console.log(tc)
															if (res.DocumentElement.DUMMY.Column1 === 'TRUE' || res.DocumentElement.DUMMY.Column1 === 'True') {
																this.tableRow[this.ctCtr][i].visibleOpt = 'Y';
																this.tableRow[this.ctCtr][i].visibility = "Y";
																if(!this.CustomTabs.columns.includes(this.tableRow[this.ctCtr][i].displayName)){
																this.CustomTabs.columns.splice(i, 0, this.tableRow[this.ctCtr][i].displayName)
																}
															} else{
																this.tableRow[this.ctCtr][i].visibleOpt = 'N';
																this.tableRow[this.ctCtr][i].visibility = "N";
																this.CustomTabs.columns.splice(i, 1);
															}
														}
													}
												}
											});
											break;
										case 'INVISIBLE':
											// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
											// console.log(target, res);
											target.forEach((tc: any) => {
												if (res) {
													if (res.DocumentElement) {
														if (res.DocumentElement.DUMMY) {
															console.log(tc)
															if (res.DocumentElement.DUMMY.Column1 === 'FALSE' || res.DocumentElement.DUMMY.Column1 === 'False') {
																this.tableRow[this.ctCtr][i].visibleOpt = 'Y';
																this.tableRow[this.ctCtr][i].visibility = "Y";
																if(!this.CustomTabs.columns.includes(this.tableRow[this.ctCtr][i].displayName)){
																this.CustomTabs.columns.splice(i, 0, this.tableRow[this.ctCtr][i].displayName)
																}
															} else{
																this.tableRow[this.ctCtr][i].visibleOpt = 'N';
																this.tableRow[this.ctCtr][i].visibility = "N";
																this.CustomTabs.columns.splice(i, 1);
															}
														}
														// this.udfFieldValueChange(tc);
														// this.ref.detectChanges();
													}
												}
											});
											break;
										case 'READONLY':
											// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
											// console.log(target, res);
											if (sOverrrideEditRights=="N" || sOverrrideEditRights=="") //override edit rights added as per dotnet code by Devesh on 4-Oct-2021
											{
												if (this.oEditrightsCustom.length>0)
												{
													let dtEnabled:any[]=this.oEditrightsCustom.filter(x=>x.eR_Visible_YN.toString().substr(1, 1)=="Y")
													if(dtEnabled.length>0)
													{
														if(dtEnabled.filter(x=>x.eR_UDF_Field==func.ufD_Target_Field))
														{
															return;
														}
													}
												}
											}
											target.forEach((tc: any) => {
												if (res) {
													if (res.DocumentElement) {
														if (res.DocumentElement.DUMMY) {
															console.log(tc);
															if (res.DocumentElement.DUMMY.Column1 === 'FALSE' || res.DocumentElement.DUMMY.Column1 === 'False') {
																this.tableRow[this.ctCtr][i].readOnly = 'N';
															} else
																this.tableRow[this.ctCtr][i].readOnly = 'Y';
														}
													}
												}
											});
											break;
									}
									this.ref.detectChanges();
								} 

								else if(this.isNullOrUndefined(res.DocumentElement) && func.ufD_Function_TYpe.toUpperCase() != 'WCF SERVICE') //Added by devesh for clearing fields if response is null of fucntion execution
								{
									this.ClearTargetFieldValues(outputForm,func.functionMode,target,i);
								}
								
								else {
									//else case added by Swati for wcf service handling
									switch (outputForm) {
										case 'SINGLE VALUE':
											target.forEach((tc: any) => {
												if (res) {

													switch (tc.dataType) {
														case 'AMOUNT':
														case 'NUMBER':

															this.tableRow[this.ctCtr][i].value = this.formatKLMB(res, tc.udF_Format);
															break;
														case 'INTEGER':

															this.tableRow[this.ctCtr][i].value = this.formatKLMB(res, tc.udF_Format);
															break;
														case 'DATE':
															this.tableRow[this.ctCtr][i].value = res;
															// var matdatepickerElements: HTMLCollection = document.getElementsByTagName('mat-datepicker'); //Suggested by Saurabh K.                        
															// for (let c = 0; c < matdatepickerElements.length; c++) {
															// 	var targetDate = matdatepickerElements[c].nextElementSibling.childNodes[0].childNodes[0].childNodes[0].nodeValue;
															// 	if (targetDate == this.tableRow[this.ctCtr][i].displayName) {
															// 		( < HTMLInputElement > (matdatepickerElements[c].parentElement.firstElementChild)).value = tc.value;
															// 		break;
															// 	}
															// } //commented by Devesh on 9-Jun-2021 as its not needed now,handled in datecontrol itself

															break;
														default:

															this.tableRow[this.ctCtr][i].value = res;
															this.tableRow[this.ctCtr][i].currentValue = res;
															this.custTabFlag = true;
															// console.log(this.CustomTabs.data)
															this.ref.detectChanges();

															break;
													}
													this.customTabFieldValueChange({
														field_element: this.tableRow[this.ctCtr][i],
														index: this.ctCtr
													});

												}

												console.log("Calling Custom tab field Change again..................................->");

											});
											break;
									}
								} ////

							} //if
						} //for

						break;
					case "CLIENT":
					case "MARKET":



						// for (let j = 0; j < this.custGridTableRow.length; j++) {
						//   if(this.isUDFFieldChange==true){
						//   this.custGridTableRow[j].forEach(element => {
						//     if(element.columnName == "clmnCustomerLeg"){
						//     var legtype = element.value;
						//     if(String(func.functionMode).toUpperCase() == "MARKET"){

						//       if(legtype=='CounterParty')
						//       this.cgrowindex = j;
						//       }
						//       if(String(func.functionMode).toUpperCase() == "CLIENT"){
						//         if(legtype=='Customer')
						//         this.cgrowindex = j;
						//       }
						//     } 
						//   });
						// }
						// console.log("Data assignment of customer grid at row index as: ", this.cgrowindex);
						if (this.cgrowindex != -1) {

							for (let i = 0; i < this.custGridTableRow[this.cgrowindex].length; i++) {
								//if((this.custGridTableRow[this.cgrowindex][i].columnName == 'clmnCustomerLeg' && this.custGridTableRow[this.cgrowindex][i].value=='CounterParty' && String(func.functionMode).toUpperCase() == "MARKET" && this.custGridTableRow[this.cgrowindex][i].columnName === target[0].columnName) || (this.custGridTableRow[this.cgrowindex][i].columnName == 'clmnCustomerLeg' && this.custGridTableRow[this.cgrowindex][i].value=='Customer' && String(func.functionMode).toUpperCase() == "CLIENT" && this.custGridTableRow[this.cgrowindex][i].columnName === target[0].columnName)){
								if (this.custGridTableRow[this.cgrowindex][i].columnName === target[0].columnName) {

									if (res.DocumentElement) {
										switch (outputForm) {
											case 'DATASET':
												if (res.DocumentElement.DUMMY) {
													// console.log("Debugging", res.DocumentElement.DUMMY, res.DocumentElement.DUMMY[0])
													var dataSetArr = [];
													dataSetArr.push(res.DocumentElement.DUMMY)
													let ddlValues

													if (dataSetArr[0].length>0) //Changed by RajeshC 04-05-2023 for functions returning only 1 value
													{
														var keyinarr = Object.keys(dataSetArr[0][0])[0];
														ddlValues = dataSetArr[0].map(item => {
															let container = {};
															container['code'] = (typeof(item[keyinarr]) != 'object') ? item[keyinarr] : item[keyinarr][0]; // changed by OnkarE on 20-Apr-2023
															return container;
														})
													}
													else
													{
														const datasetKey = Object.keys(dataSetArr[0]);
														console.log("key d",datasetKey);
														ddlValues = [...dataSetArr.map((d: any) => ({ code: d[datasetKey[0]] }))];
													}
													console.log("ddlvalue",ddlValues);
													const ddlValues1 = [...dataSetArr];
													// console.log("ddlValues1", ddlValues1);
													switch (String(target[0].type).toUpperCase()) { //here this.custGridTableRow[this.ctCtr][i] & target[0] both are same
														case 'COMMON DATA':
															// console.log(res.DocumentElement.DUMMY.map((d: any) => d[datasetKey[0]]));
															// console.log("CustomER grid Target field", this.custGridTableRow[this.cgrowindex][i].columnName);
															this.dropdowns[target[0].columnName +"_cg_" + String(this.cgrowindex)] = ddlValues;
															this.searchArrays[target[0].columnName +"_cg_" + String(this.cgrowindex)] = ddlValues1;

															if (target[0].udF_Feature1 != 'Allow Blank Row' && target[0].defaultValue === '' && this.dropdowns[target[0].sourcingLink || target[0].columnName] != null) {
																// console.log("Inside ngChanges", target[0], this.dropdowns);
																if (this.dropdowns[(target[0].columnName + "_cg_" + String(this.cgrowindex)) || target[0].sourcingLink].length > 0) {
																	this.custGridTableRow[this.cgrowindex][i].value = this.dropdowns[(target[0].columnName + "_cg_" + String(this.cgrowindex)) || target[0].sourcingLink][0].code;
																	this.custGridTableRow[this.cgrowindex][i].currentValue = this.dropdowns[(target[0].columnName + "_cg_" + String(this.cgrowindex)) || target[0].sourcingLink][0].code;
																}
															}
															// console.log(this.custGridTableRow[this.cgrowindex][i].fieldName, " Values are getting appended--> ", this.dropdowns, ddlValues);
															// console.log("Drop", this.dropdowns);
															break;
														case 'CURRENCY':
															// console.log("CURRRRRRRRRR", ddlValues, "CUR!!!!!!!", ddlValues1);
															ddlValues1[0].map(d => d.code = d.Currency); //made changes for currecny dpdown specific
															// console.log("ddlval_cur", ddlValues1[0]);
															this.dropdowns[target[0].columnName] = ddlValues1[0];
															this.searchArrays[target[0].columnName] = ddlValues1;
															// console.log("Drop", this.dropdowns);
															this.custGridTableRow[this.cgrowindex][i].value = this.dropdowns[target[0].columnName][0].code; //added by devesh as selected value was not getting assigned in currency field
															this.custGridTableRow[this.cgrowindex][i].currentValue = this.dropdowns[target[0].columnName][0].code; //added by devesh as selected value was not getting assigned in currency field
															break;
														case 'CHART': //added by devesh //chart datatype mostly not used in custom tab but case kept as it is 
															// console.log("Chart data in raw json: ", res.DocumentElement.DUMMY);
															if(this.custGridTableRow[this.cgrowindex][i].sourcingLink == '3D Chart') { /// added this condition by OnkarE on 03-Feb-2022
																this.custGridTableRow[this.cgrowindex][i].value = this.dropdowns[target[0].fieldname];
															}
															else {
															this.custGridTableRow[this.cgrowindex][i].value = res.DocumentElement.DUMMY.map(function(e) { //shorten format work for any no.of columns 
																return Object.keys(e).map(function(k) {
																	return (_isNumberValue(e[k]) ? Number(e[k]) : e[k]);
																});
															});
															}
															// console.log("Chart data in 2D array format: ", this.custGridTableRow[this.cgrowindex][i].value);
															//further logic to be written
															switch (target[0].sourcingLink) {
																case 'Pie':
																	this.custGridTableRow[this.cgrowindex][i].sourcingLink = 'PieChart';
																	break;
																case 'Doughnut':
																	this.custGridTableRow[this.cgrowindex][i].sourcingLink = 'PieChart';
																	this.custGridTableRow[this.cgrowindex][i].chartoption = {
																		pieHole: 0.4
																	};
																	break;
																case 'Line':
																	this.custGridTableRow[this.cgrowindex][i].sourcingLink = 'LineChart';
																	break;
																case 'Bar':
																	this.custGridTableRow[this.cgrowindex][i].sourcingLink = 'ColumnChart';
																	break;
																case 'Funnel': //not supported
																	break;
																case 'Pyramid': //not supported
																	//target[0].sourcingLink='ColumnChart';
																	break;
																case 'Bubble':
																	//target[0].sourcingLink='ColumnChart';
																	break;
															}
															if (target[0].udF_Feature1 == "Allow 3D") //added for 3d feature
															{
																this.custGridTableRow[this.cgrowindex][i].chartoption = {
																	is3D: true
																};
															} else {
																this.custGridTableRow[this.cgrowindex][i].chartoption = {};
															}
															console.log("Target for chart ", this.custGridTableRow[this.cgrowindex][i]); //to check values after processing
															break;
													}
													// console.log("Target", this.custGridTableRow[this.cgrowindex][i].fieldName);
													// console.log("Drop", this.dropdowns);
												}
												this.ref.detectChanges();
												// this.CustomerGridValueChange({field_element:this.custGridTableRow[this.cgrowindex][i],index:this.cgrowindex});
												break;
											case 'SINGLE VALUE':
												target.forEach((tc: any) => {
													var isTransitive = false;
													console.log("cust grid func: ", func.ufD_Function_Name, res);
													if (res) {
														if (res.DocumentElement) {
															if (res.DocumentElement.DUMMY) {
																// console.log("TC Val", tc.value.trim().valueOf());
																// console.log("RESP", res.DocumentElement.DUMMY.Column1.trim().valueOf());
																if (typeof(res.DocumentElement.DUMMY) === 'object' && res.DocumentElement.DUMMY.Column1 != null && tc.value.trim() != res.DocumentElement.DUMMY.Column1.trim()) { // modified this case by OnkarE on 25-Apr-2023
																	switch (tc.type.toUpperCase()) {
																		case 'AMOUNT':
																		case 'NUMBER':
																			if (Number(this.custGridTableRow[this.cgrowindex][i].value) != Number(res.DocumentElement.DUMMY.Column1.replace(/,/g, ''))) {
																				isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
																			}
																			this.custGridTableRow[this.cgrowindex][i].value = this.formatKLMB(res.DocumentElement.DUMMY.Column1, tc.udF_Format);
																			this.custGridTableRow[this.cgrowindex][i].currentValue = this.formatKLMB(res.DocumentElement.DUMMY.Column1, tc.udF_Format);
																			break;
																		case 'INTEGER':
																			this.custGridTableRow[this.cgrowindex][i].value = this.formatKLMB(res.DocumentElement.DUMMY.Column1, tc.udF_Format);
																			this.custGridTableRow[this.cgrowindex][i].currentValue = this.formatKLMB(res.DocumentElement.DUMMY.Column1, tc.udF_Format);
																			isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
																			break;
																			// case 'DATE':
																			//   tc.value   
																			// break;
																		default:
																			console.log("Cust grid data assign: ", this.custGridTableRow[this.cgrowindex][i], res.DocumentElement.DUMMY.Column1)
																			this.custGridTableRow[this.cgrowindex][i].value = res.DocumentElement.DUMMY.Column1;
																			//this.custGridTableRow[this.cgrowindex][i].currentValue = res.DocumentElement.DUMMY.Column1;
																			//console.log(this.CustomTabs.data, this.custGridTableRow)
																			this.ref.detectChanges();
																			isTransitive = true;
																			break;
																	}
																	if (func.ufD_Cascade_YN == 'N') //Added by SwatiP for circular function calling
																		return;

																	if (isTransitive) { //added by devesh for transitivity issue on 12-Oct-2020
																		this.CustomerGridValueChange({
																			field_element: this.custGridTableRow[this.cgrowindex][i],
																			index: this.cgrowindex
																		});
																	}
																}
																else if(res.DocumentElement.DUMMY[0] && res.DocumentElement.DUMMY[0].Column1[0]){ // Added this case by OnkarE on 25-Apr-2023
																	switch (tc.type.toUpperCase()) {
																		case 'AMOUNT':
																		case 'NUMBER':
																			if (Number(this.custGridTableRow[this.cgrowindex][i].value) != Number(res.DocumentElement.DUMMY[0].Column1[0].replace(/,/g, ''))) {
																				isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
																			}
																			this.custGridTableRow[this.cgrowindex][i].value = this.formatKLMB(res.DocumentElement.DUMMY[0].Column1[0], tc.udF_Format);
																			this.custGridTableRow[this.cgrowindex][i].currentValue = this.formatKLMB(res.DocumentElement.DUMMY[0].Column1[0], tc.udF_Format);
																			break;
																		case 'INTEGER':
																			this.custGridTableRow[this.cgrowindex][i].value = this.formatKLMB(res.DocumentElement.DUMMY[0].Column1[0], tc.udF_Format);
																			this.custGridTableRow[this.cgrowindex][i].currentValue = this.formatKLMB(res.DocumentElement.DUMMY[0].Column1[0], tc.udF_Format);
																			isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
																			break;
																			// case 'DATE':
																			//   tc.value   
																			// break;
																		default:
																			console.log("Cust grid data assign: ", this.custGridTableRow[this.cgrowindex][i], res.DocumentElement.DUMMY[0].Column1[0])
																			this.custGridTableRow[this.cgrowindex][i].value = res.DocumentElement.DUMMY[0].Column1[0];
																			//this.custGridTableRow[this.cgrowindex][i].currentValue = res.DocumentElement.DUMMY[0].Column1[0];
																			//console.log(this.CustomTabs.data, this.custGridTableRow)
																			this.ref.detectChanges();
																			isTransitive = true;
																			break;
																	}
																	if (func.ufD_Cascade_YN == 'N') //Added by SwatiP for circular function calling
																		return;

																	if (isTransitive) { //added by devesh for transitivity issue on 12-Oct-2020
																		this.CustomerGridValueChange({
																			field_element: this.custGridTableRow[this.cgrowindex][i],
																			index: this.cgrowindex
																		});
																	}
																}
															} else { //else condition added by devesh for blanking out if response is null,discussed with Akshay D on 14-Oct-2020
																switch (tc.dataType) {
																	case 'AMOUNT':
																	case 'NUMBER':
																		this.custGridTableRow[this.cgrowindex][i].value = "";
																		this.custGridTableRow[this.cgrowindex][i].currentValue = "";
																		console.log("NULLL value blanked");
																		break;
																}
															}
														}
													}
													// console.log("Calling customer grid field Change again..................................->");
												});
												break;
											case 'VISIBLE':
												// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
												// console.log(target, res);
												if (sOverrrideEditRights=="N" || sOverrrideEditRights=="") //override edit rights added as per dotnet code by Devesh on 4-Oct-2021
												{
												if (this.oEditrightsCustomer.length>0)
												{
													let dtVisible:any[]=this.oEditrightsCustomer.filter(x=>x.eR_Visible_YN.toString().substr(0, 1)=="Y")
													if(dtVisible.length>0)
													{
														if(dtVisible.filter(x=>x.eR_UDF_Field==func.ufD_Target_Field))
														{
															return;
														}
													}
												}
												}
												target.forEach((tc: any) => {
													if (res) {
														if (res.DocumentElement) {
															if (res.DocumentElement.DUMMY) {
																console.log(tc);
																if (res.DocumentElement.DUMMY.Column1 === 'TRUE' || res.DocumentElement.DUMMY.Column1 === 'True') {
																	this.custGridTableRow[this.cgrowindex][i].visibleOpt = 'Y';
																} else
																	this.custGridTableRow[this.cgrowindex][i].visibleOpt = 'N';
															}
														}
													}
												});
												break;
											case 'INVISIBLE':
												// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
												// console.log(target, res);
												target.forEach((tc: any) => {
													if (res) {
														if (res.DocumentElement) {
															if (res.DocumentElement.DUMMY) {
																console.log(tc);
																if (res.DocumentElement.DUMMY.Column1 === 'FALSE' || res.DocumentElement.DUMMY.Column1 === 'False') {
																	this.custGridTableRow[this.cgrowindex][i].visibleOpt = 'Y';
																	//this.udfFieldValueChange(tc);
																} else
																	this.custGridTableRow[this.cgrowindex][i].visibleOpt = 'N';
															}
															// this.udfFieldValueChange(tc);
															// this.ref.detectChanges();
														}
													}
												});
												break;
											case 'READONLY':
												// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
												// console.log(target, res);
												if (sOverrrideEditRights=="N" || sOverrrideEditRights=="") //override edit rights added as per dotnet code by Devesh on 4-Oct-2021
												{
													if (this.oEditrightsCustomer.length>0)
													{
														let dtEnabled:any[]=this.oEditrightsCustomer.filter(x=>x.eR_Visible_YN.toString().substr(1, 1)=="Y")
														if(dtEnabled.length>0)
														{
															if(dtEnabled.filter(x=>x.eR_UDF_Field==func.ufD_Target_Field))
															{
																return;
															}
														}
													}
												}
												target.forEach((tc: any) => {
													if (res) {
														if (res.DocumentElement) {
															if (res.DocumentElement.DUMMY) {
																console.log(tc);
																if (res.DocumentElement.DUMMY.Column1 === 'FALSE' || res.DocumentElement.DUMMY.Column1 === 'False') {
																	this.custGridTableRow[this.cgrowindex][i].readOnly = 'N';
																} else
																	this.custGridTableRow[this.cgrowindex][i].readOnly = 'Y';
															}
														}
													}
												});
												break;
										}
										this.ref.detectChanges();
									} 
									
									else if(this.isNullOrUndefined(res.DocumentElement) && func.ufD_Function_TYpe.toUpperCase() != 'WCF SERVICE') //Added by devesh for clearing fields if response is null of fucntion execution
									{
									this.ClearTargetFieldValues(outputForm,func.functionMode,target,i);
									}
									
									else {
										//else case added by Swati for wcf service handling
										switch (outputForm) {
											case 'SINGLE VALUE':
												target.forEach((tc: any) => {
													if (res) {

														switch (tc.dataType) {
															case 'AMOUNT':
															case 'NUMBER':

																this.custGridTableRow[this.cgrowindex][i].value = this.formatKLMB(res, tc.udF_Format);
																break;
															case 'INTEGER':

																this.custGridTableRow[this.cgrowindex][i].value = this.formatKLMB(res, tc.udF_Format);
																break;
															case 'DATE':
																this.custGridTableRow[this.cgrowindex][i].value = res;
																// var matdatepickerElements: HTMLCollection = document.getElementsByTagName('mat-datepicker'); //Suggested by Saurabh K.                        
																// for (let c = 0; c < matdatepickerElements.length; c++) {
																// 	var targetDate = matdatepickerElements[c].nextElementSibling.childNodes[0].childNodes[0].childNodes[0].nodeValue;
																// 	if (targetDate == this.custGridTableRow[this.cgrowindex][i].displayName) {
																// 		( < HTMLInputElement > (matdatepickerElements[c].parentElement.firstElementChild)).value = tc.value;
																// 		break;
																// 	}
																// } //commented by Devesh on 9-Jun-2021 as its not required now.
																break;
															default:

																this.custGridTableRow[this.cgrowindex][i].value = res;
																this.custGridTableRow[this.cgrowindex][i].currentValue = res;
																this.custTabFlag = true;
																console.log(this.CustomTabs.data)
																this.ref.detectChanges();

																break;
														}
														this.CustomerGridValueChange({
															field_element: this.custGridTableRow[this.cgrowindex][i],
															index: this.cgrowindex
														});

													}

													// console.log("Calling Custom tab field Change again..................................->");

												});
												break;
										}
									} ////

								} //if
							} //for
						} //if -1 check
						//} //double for
						break;
					case "PRODUCT":
						if (res.DocumentElement) {
							switch (outputForm) {
								case 'DATASET':
									
									if (res.DocumentElement.DUMMY) {
										// console.log("Debugging", res.DocumentElement.DUMMY, res.DocumentElement.DUMMY[0])
										var dataSetArr = [];
										dataSetArr.push(res.DocumentElement.DUMMY);
										let ddlValues;
										// const datasetKey = Object.keys(dataSetArr[0]);

										// const ddlValues =  res.DocumentElement.DUMMY.map(function(e) {
										//    return Object.values(e).map((m:any)=> ({code:(!this.isNullOrUndefined(m) || !isObject(m))? m:'' }));}); //changed by SwatiP on 22-12-2020


										// var keyinarr = Object.keys(dataSetArr[0][0])[0];
										// const ddlValues = dataSetArr[0].map(item => {
										// 	let container = {};
										// 	container['code'] = (typeof(item[keyinarr]) != 'object') ? item[keyinarr] : null;
										// 	return container;
										// })
										if (dataSetArr[0].length>1)
										{
										var keyinarr = Object.keys(dataSetArr[0][0])[0];
										ddlValues = dataSetArr[0].map(item => {
											let container = {};
											container['code'] = (typeof(item[keyinarr]) != 'object') ? item[keyinarr] : null;
											return container;
										})
										}
										else
										{
										const datasetKey = Object.keys(dataSetArr[0]);
										console.log("key d",datasetKey);
										ddlValues = [...dataSetArr.map((d: any) => ({ code: d[datasetKey[0]] }))];
										}
										// const ddlValues = [...dataSetArr.map((d: any) => ({ code: d[datasetKey[0]] }))];
										// console.log("key d",datasetKey);
										// console.log("ddlvalue", ddlValues);
										const ddlValues1 = [...dataSetArr];
										// console.log("ddlValues1", ddlValues1);
										switch (target[0].dataType) {
											case 'UCP USER CONTROL':
												target[0].gridDt = res.DocumentElement.DUMMY;
												console.log("Grid data function output is: ", target[0]);
												break;
											case 'COMMON DATA':
												// console.log(res.DocumentElement.DUMMY.map((d: any) => d[datasetKey[0]]));
												// console.log("TArget", target[0].fieldName);

												this.dropdowns[target[0].fieldName] = ddlValues;
												this.searchArrays[target[0].fieldName] = ddlValues1;

												if (target[0].udF_Feature1 != 'Allow Blank Row'  && this.dropdowns[target[0].sourcingLink || target[0].fieldName] != null) { //&& target[0].defaultValue === ''
													// console.log("Inside ngChanges", target[0], this.dropdowns);
													// if(this.dropdowns[target[0].fieldName || target[0].sourcingLink].length > 0)
													target[0].value = this.dropdowns[target[0].fieldName || target[0].sourcingLink][0].code;
												}
												// console.log(target[0].fieldName, " Values are getting appended--> ", this.dropdowns, ddlValues);
												// console.log(this.dropdowns);
												// if(target[0].value === '' && target[0].udF_Feature1 != 'Allow Blank Row'){
												//   this.dropdowns[target[0].fieldName].Selected = 0;
												// } 
												// console.log("Drop", this.dropdowns);
												break;
											case 'CURRENCY':

												// console.log(res.DocumentElement.DUMMY.map((d: any) => d[datasetKey[0]]));
												// console.log("CURRRRRRRRRR", ddlValues, "CUR!!!!!!!", ddlValues1);
												//var cur_dtset:any[]=ddlValues1[0];
												//cur_dtset.forEach(element=>element.code=element.Currency);
												//cur_dtset.forEach(element=>console.log("Element",element[0]));
												//cur_dtset.forEach(element=>element.forEach(d => {d.code=d.Currency}));
												ddlValues1[0].map(d => d.code = d[Object.keys(d)[0]]); //made changes for currecny dpdown specific
												// console.log("ddlval_cur", ddlValues1[0]);
												this.dropdowns[target[0].fieldName] = ddlValues1[0];
												this.searchArrays[target[0].fieldName] = ddlValues1;
												// console.log("Drop", this.dropdowns);
												target[0].value = this.dropdowns[target[0].fieldName][0].code; //added by devesh as selected value was not getting assigned in currency field
												// console.log(this.dropdowns);
												break;
											case 'CHART': //added by devesh 
												console.log("Chart data in raw json: ", target[0], res.DocumentElement.DUMMY);
												if(target[0].sourcingLink == '3D Chart') { /// added this condition by OnkarE on 03-Feb-2022
													target[0].value = res.DocumentElement.DUMMY;
												}
												else {
												target[0].value = res.DocumentElement.DUMMY.map(function(e) { //shorten format work for any no.of columns 
													return Object.keys(e).map(function(k) {
														return (_isNumberValue(e[k]) ? Number(e[k]) : e[k]);
													});
												});
												}
												// console.log("Chart data in 2D array format: ", target[0].value);

												//further logic to be written  ///commented as logic is shifted to readlayout itself so no need here
												//   switch(target[0].sourcingLink)
												//   {
												//     case 'Pie':
												//       target[0].sourcingLink='PieChart';
												//       break;
												//     case 'Doughnut':
												//      target[0].sourcingLink='PieChart';
												//      target[0].chartoption={pieHole:0.4};
												//        break;
												//     case 'Line':
												//       target[0].sourcingLink='LineChart';
												//       break;
												//     case 'Bar':
												//       target[0].sourcingLink='ColumnChart';
												//       break;
												//     case 'Funnel': //not supported

												//       break;
												//     case 'Pyramid': //not supported
												//       //target[0].sourcingLink='ColumnChart';
												//       break;
												//     case 'Bubble':
												//       //target[0].sourcingLink='ColumnChart';
												//       break;

												//   }
												//  if (target[0].udF_Feature1=="Allow 3D") //added for 3d feature
												//   {
												//     target[0].chartoption={is3D:true};
												//   }

												console.log("Target for chart ", target[0]); //to check values after processing
												break;
										}
										// console.log("TArget", target[0].fieldName);
										// console.log("Drop", this.dropdowns);
									}
									this.ref.detectChanges();
									await this.udfFieldValueChange(target[0]);
									break;
								case 'SINGLE VALUE':
									target.forEach(async (tc: any) => {
										//console.log("Target control IS---------->###################################################################", tc, tc.value);
										var isTransitive = false;
										if (res) {
											if (res.DocumentElement) {
												if (res.DocumentElement.DUMMY) {
													// console.log("TC Val",tc.value.trim().valueOf());
													// console.log("RESP",res.DocumentElement.DUMMY.Column1.trim().valueOf());
													if (res.DocumentElement.DUMMY.Column1 != null && tc.value.trim() != res.DocumentElement.DUMMY.Column1.trim()) {
														switch (tc.dataType) {
															case 'AMOUNT':
															case 'NUMBER':
																if (Number(tc.value) != Number(res.DocumentElement.DUMMY.Column1.replace(/,/g, ''))) {
																	isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
																	tc.value = this.formatKLMB(res.DocumentElement.DUMMY.Column1, tc.udF_Format);
																}

																break;
															case 'INTEGER':
																if (tc.value.trim() != res.DocumentElement.DUMMY.Column1.trim()) {
																	isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
																	tc.value = res.DocumentElement.DUMMY.Column1;
																}

																//this.formatKLMB(res.DocumentElement.DUMMY.Column1, tc.udF_Format);
																break;
																// case 'DATE':
																//   tc.value   
																// break;
															case 'HYPER LINK':
																var url;
																console.log("in hyperlink");
																tc.value = res.DocumentElement.DUMMY.Column1;
																break;
															case 'UCP USER CONTROL':
																if(tc.sourcingLink === 'Generic Div'){
																}
																	target[0].gridDt = res.DocumentElement.DUMMY;
																	console.log("Grid data function output is: ", target[0]);
																	break;
        												//Added by VijayH for Image Datatype as output after Function Execution on 9-March-2022
															// case 'IMAGE':
															// 	console.log("The data is.......");
															// 	this.api.ImageIOAfterFunctionExecution_Angular(res.DocumentElement.DUMMY.Column1).subscribe((response: any) => {
															// 		tc.image_Data = response.response
															// 		console.log("The data ImageIOAfterFunctionExecution_Angular is......", tc);
															// 	});
															// break;
															default:
																// console.log(tc)
																if (tc.value.trim() != res.DocumentElement.DUMMY.Column1.trim()) {
																	isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
																	tc.value = res.DocumentElement.DUMMY.Column1;
																}
																if(tc.fieldName == this.PricingOutputField){
																	/// Added this condition to handle price (quote) output - in clear pricing grid function																						
																	this.rfqList = tc.value;																
																}

																this.ref.detectChanges();
																break;
														}
														if (func.ufD_Cascade_YN == 'N') //Added by SwatiP for circular function calling
															return;

														if (isTransitive) { //added by devesh for transitivity issue on 12-Oct-2020
															await this.udfFieldValueChange(tc, event);
															//this.AssignUCPControlValuesToParentControl(); // Added by OnkarE on 25-Mar-2021 - to handle FX native intersctions //commented by devesh as its already called inside udfFieldValueChange
														}
													}
												} else { //else condition added by devesh for blanking out if response is null,discussed with Akshay D on 14-Oct-2020

													switch (tc.dataType) {
														case 'AMOUNT':
														case 'NUMBER':
															tc.value = "";
															console.log("NULLL value blanked");
															break;
													}
												}
											}
										}

										// console.log("Calling UDF Change again..................................->");

									});
									break;
								case 'VISIBLE':
									// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
									// console.log(target, res);
									if (sOverrrideEditRights=="N" || sOverrrideEditRights=="") //override edit rights added as per dotnet code by Devesh on 4-Oct-2021
									{
									if (this.oEditrights.length>0)
									{
										let dtVisible:any[]=this.oEditrights.filter(x=>x.eR_Visible_YN.toString().substr(0, 1)=="Y")
										if(dtVisible.length>0)
										{
											if(dtVisible.filter(x=>x.eR_UDF_Field==func.ufD_Target_Field))
											{
												return;
											}
										}
									}
									}
									target.forEach((tc: any) => {
										if (res) {
											if (res.DocumentElement) {
												if (res.DocumentElement.DUMMY) {
													if (res.DocumentElement.DUMMY.Column1 === 'TRUE' || res.DocumentElement.DUMMY.Column1 === 'True') {
														tc.visibleOpt = 'Y';
														//this.udfFieldValueChange(tc);
													} else
														tc.visibleOpt = 'N';

													// Added by OnkarE to handle hideEmptyFields condition on formula execution - on 02-Feb-2022
													if(this.hideEmptyFields == "Y") {
														var testElem = document.getElementById(tc.fieldName);
														if(tc.fieldName != "" && tc.fieldName != null) {
															if(tc.visibleOpt == "N") {
																testElem.style.display = "none"
															}
															else if(tc.visibleOpt == "Y") {
																testElem.style.display = "grid"
															}
														}										
													}
												}
												// this.udfFieldValueChange(tc);
												// this.ref.detectChanges();
											}
										}
									});
									break;
								case 'INVISIBLE':
									// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
									// console.log(target, res);
									target.forEach((tc: any) => {
										if (res) {
											if (res.DocumentElement) {
												if (res.DocumentElement.DUMMY) {
													if (res.DocumentElement.DUMMY.Column1 === 'FALSE' || res.DocumentElement.DUMMY.Column1 === 'False') {
														tc.visibleOpt = 'Y';
														//this.udfFieldValueChange(tc);
													} else
														tc.visibleOpt = 'N';

													// Added by OnkarE to handle hideEmptyFields condition on formula execution - on 02-Feb-2022
													if(this.hideEmptyFields == "Y") {
														var testElem = document.getElementById(tc.fieldName);
														if(tc.fieldName != "" && tc.fieldName != null) {
															if(tc.visibleOpt == "N") {
																testElem.style.display = "none"
															}
															else if(tc.visibleOpt == "Y") {
																testElem.style.display = "grid"
															}
														}										
													}
												}
												// this.udfFieldValueChange(tc);
												// this.ref.detectChanges();
											}
										}
									});
									break;
								case 'READONLY':
									// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
									// console.log(target, res);
									if (sOverrrideEditRights=="N" || sOverrrideEditRights=="") //override edit rights added as per dotnet code by Devesh on 4-Oct-2021
									{
										if (this.oEditrights.length>0)
										{
											let dtEnabled:any[]=this.oEditrights.filter(x=>x.eR_Visible_YN.toString().substr(1, 1)=="Y")
											if(dtEnabled.length>0)
											{
												if(dtEnabled.filter(x=>x.eR_UDF_Field==func.ufD_Target_Field))
												{
													return;
												}
											}
										}
									}
									target.forEach((tc: any) => {
										if (res) {
											if (res.DocumentElement) {
												if (res.DocumentElement.DUMMY) {
													if (res.DocumentElement.DUMMY.Column1 === 'FALSE' || res.DocumentElement.DUMMY.Column1 === 'False') {
														tc.readOnly = 'N';
														//this.udfFieldValueChange(tc);
													} else
														tc.readOnly = 'Y';
												}
												// this.udfFieldValueChange(tc);
												// this.ref.detectChanges();
											}
										}
									});
									break;
									case 'MANDATORY':
										target.forEach((tc: any) => {
			
											if (res === 'TRUE' || res === 'true') {
												tc.mandatory = 'Y';
											} else {
												tc.mandatory = 'N';
											}
			
										});
									break;

							}
							this.ref.detectChanges();
						} 
						else if(func.ufD_Function_TYpe.toUpperCase() == 'REST JSON') {
							switch (outputForm) {
								case 'SINGLE VALUE':
									let csvOutput : String = func.ufD_CSV_Output.toString();
									let paramOutput : String = func.ufD_Parameter_CSV.toString();
									let outParams : any[] = csvOutput.split("~");
									let jsonOutParams : any[] = paramOutput.split("~");
									if(jsonOutParams && jsonOutParams.length > 0 && jsonOutParams[0] == ""){
										jsonOutParams.shift();
									}
									if(jsonOutParams && jsonOutParams.length > 0 && jsonOutParams[jsonOutParams.length - 1] == "") {
										jsonOutParams.pop();
									}
									if(outParams && outParams.length > 0 && outParams[0] == "") {
										outParams.shift();
									}
									if(outParams && outParams.length > 0 && outParams[outParams.length - 1] == "") {
										outParams.pop();
									}
									console.log("Output of REST JSON: ", res, outParams, jsonOutParams)
									for (let i = 0; i < outParams.length; i++) {
										if(outParams[i].toString() != "") {
											for (let j = 0; j < this.controls.length; j++) {
												if(outParams[i].toString() == this.controls[j].fieldName){
													this.controls[j].value = res[jsonOutParams[i]];
													if(this.controls[j].fieldName == this.PricingOutputField){	
														this.NoteMasterID = undefined;																					
														this.rfqList = this.controls[j].value;
														this.triggerPrice = this.controls[j].value;
														/// code for new SignalR callhub part 
														//this.signalr.callHubCore(this.rfqList, this.headerForQuote)
														console.log("Tigger Price is: ", this.triggerPrice)
													}
													// if(this.controls[j].fieldName == 'responseData2'){																						
													// 	this.EQPrices = this.controls[j].value;		
													// 	let tempArr = this.EQPrices != "" ? JSON.parse(this.EQPrices).filter(e => e.AccDecOUT != "") : []
													// 	if(tempArr && tempArr.length > 0){
													// 		this.triggerPrice = tempArr[0].AccDecOUT
													// 	}										
													// 	console.log("Assign EQ prices: ", tempArr, this.triggerPrice)
													// }
													await this.udfFieldValueChange(this.controls[j]);
												}											
											}										
										}									
									}
								break;
							}
						}
						else if(this.isNullOrUndefined(res.DocumentElement) && func.ufD_Function_TYpe.toUpperCase() != 'WCF SERVICE') //Added by devesh for clearing fields if response is null of fucntion execution
						{
							this.ClearTargetFieldValues(outputForm,func.functionMode,target,-1);
						}
						else {
							//else case added by Swati for wcf service handling
							switch (outputForm) {
								case 'SINGLE VALUE':
									target.forEach(async (tc: any) => {
										var isTransitive = false;
										if (res) {

											switch (tc.dataType) {
												case 'AMOUNT':
												case 'NUMBER':
													// tc.value = this.formatKLMB(res.DocumentElement.DUMMY.Column1, tc.udF_Format);
													if (Number(tc.value) != Number(res.replace(/,/g, ''))) {
														isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
														tc.value = this.formatKLMB(res, tc.udF_Format);
													}


													//

													break;
												case 'INTEGER':
													//tc.value = this.formatKLMB(res.DocumentElement.DUMMY.Column1, tc.udF_Format);
													if (tc.value.trim() != res.trim()) {
														isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
														tc.value = this.formatKLMB(res, tc.udF_Format);
													}

													break;
												case 'DATE':
													//tc.value = res;												
													// var matdatepickerElements: HTMLCollection = document.getElementsByTagName('mat-datepicker'); //Suggested by Saurabh K.                        
													// for (let c = 0; c < matdatepickerElements.length; c++) {
													// 	var targetDate = matdatepickerElements[c].nextElementSibling.childNodes[0].childNodes[0].childNodes[0].nodeValue;
													// 	if (targetDate == tc.displayName) {
													// 		( < HTMLInputElement > (matdatepickerElements[c].parentElement.firstElementChild)).value = tc.value;
													// 		break;
													// 	}
													// }
													if (tc.value.trim() != res.trim()) {
														isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
														tc.value = res;
													}
													

													break;
												default:
													// console.log(tc)
													if (tc.value.trim() != res.trim()) {
														isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
														tc.value = res;
													}

													this.ref.detectChanges();
													break;
											}

											if (isTransitive) { //added by devesh for transitivity issue on 12-Oct-2020
												await this.udfFieldValueChange(tc);
												//this.AssignUCPControlValuesToParentControl(); // Added by OnkarE on 25-Mar-2021 - to handle FX native intersctions //commented by devesh as its already called inside udfFieldValueChange
											}

										}

										// console.log("Calling UDF Change again..................................->");

									});
									break;
							}
						} ////
						break;
							default:
								switch(String(target[0].fieldName).toUpperCase()){
									case 'HEDGINGTYPE':
										if (that.bookingModelData.includes(target[0].fieldName)){
										that.selectedBookingModel = res.DocumentElement.DUMMY.Column1
										that.changeHedgeType()
										}
										break;
								}
								break;
					}
				}
				if (this.Multi_UCP_index == this.Multi_UCP_length - 1) {
					sessionStorage.removeItem('oFieldDetails');
					sessionStorage.setItem('oFieldDetails', JSON.stringify({
						udfFields: this.controls,
						commonData: this.common_data,
						function: this.functions_all
					})); //added functions in discrete manner because json.stringify was not working properly on overall functions json array
				}

				// await this.callFunctionsInSequence(funcIndex+1, functions, functionType, index_ctr)





			} catch (error) {
				console.error("Error in dataAssignmentAfterExecuteFunction: ", error);
				//this.loader=false; //added by devesh on 8-April-2021 because if error occured in readlayout, loader was still visible
				//this.api.WriteErrorLogs("Error in dataAssignmentAfterExecuteFunction: "+error);
			} finally {}
		}

		dataAssignmentAfterFormula(func: any, target: any[], outputForm: string, res: any, event ? : string) {
			// console.log(func, target, outputForm, res);

			////////
			try {
				if (String(func.ufD_Target_Field).toUpperCase() == "HEDGINGTYPE")
				{
					if (this.bookingModelData.includes(res)){
						this.selectedBookingModel = res
						this.changeHedgeType()
					}
				}
				else
				{
				switch (String(func.functionMode).toUpperCase()) {
					case "CUSTOM": //
						///
						// console.log("Data assignment of custom tab at row index as: ", this.ctCtr);
						for (let i = 0; i < this.tableRow[this.ctCtr].length; i++) {
							if (this.tableRow[this.ctCtr][i].fieldName === target[0].fieldName) {
								switch (outputForm) {
									case 'SINGLE VALUE':
										target.forEach((tc: any) => {

											var isTransitive = false;
											// console.log("TC Val", this.tableRow[this.ctCtr][i].value);
											// console.log("RESP of formula", !this.isNullOrUndefined(res) ? res : '');
											if (res != null && String(this.tableRow[this.ctCtr][i].value).trim() != res) {
												switch (this.tableRow[this.ctCtr][i].dataType) {
													case 'AMOUNT':
													case 'NUMBER':
														if (Number(this.tableRow[this.ctCtr][i].value) != Number(res)) {
															isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
														}
														this.tableRow[this.ctCtr][i].value = this.formatKLMB(String(res), tc.udF_Format);
														this.tableRow[this.ctCtr][i].currentValue = this.formatKLMB(String(res), tc.udF_Format);
														break;
													case 'INTEGER':
														this.tableRow[this.ctCtr][i].value = this.formatKLMB(String(res), tc.udF_Format);
														this.tableRow[this.ctCtr][i].currentValue = this.formatKLMB(String(res), tc.udF_Format);
														isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
														break;

													default:
														this.tableRow[this.ctCtr][i].value = res;
														this.tableRow[this.ctCtr][i].currentValue = res;
														break;

												}
												// console.log(this.CustomTabs.data)
												this.ref.detectChanges();
												if (func.ufD_Cascade_YN == 'N') //Added by SwatiP for circular function calling
													return;
												if (isTransitive) { //added by devesh for transitivity issue on 12-Oct-2020
													this.customTabFieldValueChange({
														field_element: this.tableRow[this.ctCtr][i],
														index: this.ctCtr
													});
												}
											}
											//}
											else if (String(res) != '') { //else if condition added if response is same as tc value and also not null. To avoid blanking of value if both are same
												//do nothing, let the value remain as it is
											} else { //else condition added by devesh for blanking out if response is null,discussed with Akshay D on 14-Oct-2020

												switch (tc.dataType) {
													case 'AMOUNT':
													case 'NUMBER':
														this.tableRow[this.ctCtr][i].value = "";
														this.tableRow[this.ctCtr][i].currentValue = "";
														console.log("NULLL value blanked");
														break;
												}
											}


											// console.log("Calling UDF Change again..................................->");

										});
										break;
									case 'VISIBLE':
										// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
										// console.log(target, res);
										target.forEach((tc: any) => {
											console.log(tc);
											if (res === 'TRUE' || res === 'True') {
												this.tableRow[this.ctCtr][i].visibleOpt = 'Y';
												this.tableRow[this.ctCtr][i].visibility = "Y";
												if(!this.CustomTabs.columns.includes(this.tableRow[this.ctCtr][i].displayName)){
													this.CustomTabs.columns.splice(i, 0, this.tableRow[this.ctCtr][i].displayName)
												}
												//this.udfFieldValueChange(tc);
											} else {
												this.tableRow[this.ctCtr][i].visibleOpt = 'N';
												this.tableRow[this.ctCtr][i].visibility = "N";
												this.CustomTabs.columns.splice(i, 1);
											}

										});
										break;
									case 'INVISIBLE':
										// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
										// console.log(target, res);
										target.forEach((tc: any) => {
											console.log(tc);
											if (res === 'FALSE' || res === 'False') {
												this.tableRow[this.ctCtr][i].visibleOpt = 'Y';
												this.tableRow[this.ctCtr][i].visibility = "Y";
												if(!this.CustomTabs.columns.includes(this.tableRow[this.ctCtr][i].displayName)){
													this.CustomTabs.columns.splice(i, 0, this.tableRow[this.ctCtr][i].displayName)
												}
												//this.udfFieldValueChange(tc);
											} else {
												this.tableRow[this.ctCtr][i].visibleOpt = 'N';
												this.tableRow[this.ctCtr][i].visibility = "N";
												this.CustomTabs.columns.splice(i, 1);
											}

										});
										break;
									case 'READONLY':
										// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
										// console.log(target, res);
										target.forEach((tc: any) => {
											console.log(tc);
											if (res === 'FALSE' || res === 'False') {
												this.tableRow[this.ctCtr][i].readOnly = 'N';
												//this.udfFieldValueChange(tc);
											} else {
												this.tableRow[this.ctCtr][i].readOnly = 'Y';
											}

										});
										break;

								}

							} //if
						} //for

						///
						break;
					case "CLIENT":
					case "MARKET":



						//  for (let j = 0; j < this.custGridTableRow.length; j++) {
						//    if(this.isUDFFieldChange==true){
						//    this.custGridTableRow[j].forEach(element => {
						//      if(element.columnName == "clmnCustomerLeg"){
						//      var legtype = element.value;
						//      if(String(func.functionMode).toUpperCase() == "MARKET"){

						//        if(legtype=='CounterParty')
						//        this.cgrowindex = j;
						//        }
						//        if(String(func.functionMode).toUpperCase() == "CLIENT"){
						//          if(legtype=='Customer')
						//          this.cgrowindex = j;
						//        }
						//      } 
						//    });
						//  }
						// console.log("Data assignment of customer grid at row index as: ", this.cgrowindex);
						if (this.cgrowindex != -1) {

							for (let i = 0; i < this.custGridTableRow[this.ctCtr].length; i++) {
								if (this.custGridTableRow[this.cgrowindex][i].columnName === target[0].columnName) {
									switch (outputForm) {
										case 'SINGLE VALUE':
											target.forEach((tc: any) => {
												var isTransitive = false;
												// console.log("TC Val", tc.value);
												// console.log("RESP of formula", !this.isNullOrUndefined(res) ? res : '');
												if (res != null && String(this.custGridTableRow[this.cgrowindex][i].value).trim() != res) {
													// debugger;
													switch (this.custGridTableRow[this.cgrowindex][i].type.toUpperCase()) {
														case 'AMOUNT':
														case 'NUMBER':
															if (Number(this.custGridTableRow[this.cgrowindex][i].value) != Number(res)) {
																isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
															}
															this.custGridTableRow[this.cgrowindex][i].value = this.formatKLMB(String(res), tc.udF_Format);
															this.custGridTableRow[this.cgrowindex][i].currentValue = this.formatKLMB(String(res), tc.udF_Format);
															break;
														case 'INTEGER':
															this.custGridTableRow[this.cgrowindex][i].value = this.formatKLMB(String(res), tc.udF_Format);
															this.custGridTableRow[this.cgrowindex][i].currentValue = this.formatKLMB(String(res), tc.udF_Format);
															isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
															break;
														default:
															this.custGridTableRow[this.cgrowindex][i].value = res;
															this.custGridTableRow[this.cgrowindex][i].currentValue = res;
															break;
													}

													this.ref.detectChanges();
													if (func.ufD_Cascade_YN == 'N') //Added by SwatiP for circular function calling
														return;
													if (isTransitive) { //added by devesh for transitivity issue on 12-Oct-2020
														this.CustomerGridValueChange({
															field_element: this.custGridTableRow[this.cgrowindex][i],
															index: this.cgrowindex
														});
													}
												}
												//}
												else if (String(res) != '') { //else if condition added if response is same as tc value and also not null. To avoid blanking of value if both are same
													//do nothing, let the value remain as it is
												} else { //else condition added by devesh for blanking out if response is null,discussed with Akshay D on 14-Oct-2020
													switch (tc.dataType) {
														case 'AMOUNT':
														case 'NUMBER':
															this.custGridTableRow[this.cgrowindex][i].value = "";
															this.custGridTableRow[this.cgrowindex][i].currentValue = "";
															console.log("NULLL value blanked");
															break;
													}
												}
												console.log("Calling UDF Change again..................................->");
											});
											break;
										case 'VISIBLE':
											// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
											console.log(target, res);
											target.forEach((tc: any) => {
												console.log(tc)
												if (res === 'TRUE' || res === 'True') {
													this.custGridTableRow[this.cgrowindex][i].visibleOpt = 'Y';
													this.custGridTableRow[this.cgrowindex][i].visible = 'Y'; // Added by OnkarE on 22-Mar-2022
													//this.udfFieldValueChange(tc);
												} else {
													this.custGridTableRow[this.cgrowindex][i].visibleOpt = 'N';
													this.custGridTableRow[this.cgrowindex][i].visible = 'N'; // Added by OnkarE on 22-Mar-2022
												}
												
											});
											break;
										case 'INVISIBLE':
											// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
											console.log(target, res);
											target.forEach((tc: any) => {
												console.log(tc);
												if (res === 'FALSE' || res === 'False') {
													this.custGridTableRow[this.cgrowindex][i].visibleOpt = 'Y';
													this.custGridTableRow[this.cgrowindex][i].visible = 'Y'; // Added by OnkarE on 22-Mar-2022
													//this.udfFieldValueChange(tc);
												} else {
													this.custGridTableRow[this.cgrowindex][i].visibleOpt = 'N';
													this.custGridTableRow[this.cgrowindex][i].visible = 'N'; // Added by OnkarE on 22-Mar-2022
												}
											});
											break;
										case 'READONLY':
											// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
											console.log(target, res);
											target.forEach((tc: any) => {
												console.log(tc);
												if (res === 'FALSE' || res === 'False') {
													this.custGridTableRow[this.cgrowindex][i].readOnly = 'N';
													//this.udfFieldValueChange(tc);
												} else {
													this.custGridTableRow[this.cgrowindex][i].readOnly = 'Y';
												}

											});
											break;

									}

								} //if
							} //for

						} //if -1 check
						//} //double for
						break;
					case "PRODUCT": //default case taken as product 
					default:
						///
						switch (outputForm) {
							case 'SINGLE VALUE':
								target.forEach(async (tc: any) => {

									var isTransitive = false;
									// console.log("TC Val", tc.value);
									// console.log("RESP of formula", !this.isNullOrUndefined(res) ? res : '');
									if (res != null && String(tc.value).trim() != res) {
										switch (tc.dataType) {
											case 'AMOUNT':
											case 'NUMBER':
												if (Number(tc.value) != Number(res)) {
													isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
												}
												tc.value = this.formatKLMB(String(res), tc.udF_Format);
												break;
											case 'INTEGER':
												tc.value = this.formatKLMB(String(res), tc.udF_Format);
												isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
												break;

											default:
												isTransitive = true; //added only for number and amount case so made true in other cases as it is made true on 12-Oct-2020
												tc.value = this.convertToString(res);
												this.ref.detectChanges();
												break;
										}
										if (func.ufD_Cascade_YN == 'N') //Added by SwatiP for circular function calling
											return;
										if (isTransitive) { //added by devesh for transitivity issue on 12-Oct-2020
											await this.udfFieldValueChange(tc, event);
										}
									}
									//}
									else if (String(res) != '') { //else if condition added if response is same as tc value and also not null. To avoid blanking of value if both are same
										//do nothing, let the value remain as it is
									} else { //else condition added by devesh for blanking out if response is null,discussed with Akshay D on 14-Oct-2020

										switch (tc.dataType) {
											case 'AMOUNT':
											case 'NUMBER':
												tc.value = "";
												console.log("NULLL value blanked");
												break;
										}
									}


									// console.log("Calling UDF Change again..................................->");

								});
								break;
							case 'VISIBLE':
								// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
								// console.log(target, res);
								target.forEach((tc: any) => {

									if (res === 'TRUE' || res === 'True') {
										tc.visibleOpt = 'Y';
										tc.visibility = 'Y';
										//this.udfFieldValueChange(tc);
									} else {
										tc.visibleOpt = 'N';
										tc.visibility = 'N';
									}

									// Added by OnkarE to handle hideEmptyFields condition on formula execution - on 02-Feb-2022
									if(this.hideEmptyFields == "Y") {
										var testElem = document.getElementById(tc.fieldName);
										if(tc.fieldName != "" && tc.fieldName != null) {
											if(tc.visibility == "N") {
												testElem.style.display = "none"
											}
											else if(tc.visibility == "Y") {
												testElem.style.display = "grid"
											}
										}										
									}

								});



								break;
							case 'INVISIBLE':
								// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
								// console.log(target, res);
								target.forEach((tc: any) => {

									if (res === 'FALSE' || res === 'False') {
										tc.visibleOpt = 'Y';
										tc.visibility = 'Y';
										//this.udfFieldValueChange(tc);
									} else {
										tc.visibleOpt = 'N';
										tc.visibility = 'N';
									}

									// Added by OnkarE to handle hideEmptyFields condition on formula execution - on 02-Feb-2022
									if(this.hideEmptyFields == "Y") {
										var testElem = document.getElementById(tc.fieldName);
										if(tc.fieldName != "" && tc.fieldName != null) {
											if(tc.visibility == "N") {
												testElem.style.display = "none"
											}
											else if(tc.visibility == "Y") {
												testElem.style.display = "grid"
											}
										}										
									}

								});
								break;
							case 'READONLY':
								// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", outputForm);
								// console.log(target, res);
								target.forEach((tc: any) => {

									if (res === 'FALSE' || res === 'False') {
										tc.readOnly = 'N';
										//this.udfFieldValueChange(tc);
									} else {
										tc.readOnly = 'Y';
									}

								});
								break;
								case 'MANDATORY':
									target.forEach((tc: any) => {
		
										if (res === 'TRUE' || res === 'true') {
											tc.mandatory = 'Y';
										} else {
											tc.mandatory = 'N';
										}
		
									});
								break;

						}
						///
						break;
				}
			}
				///////////
				this.ref.detectChanges();
				//}
				if (this.Multi_UCP_index == this.Multi_UCP_length - 1) {
					sessionStorage.removeItem('oFieldDetails');
					sessionStorage.setItem('oFieldDetails', JSON.stringify({
						udfFields: this.controls,
						commonData: this.common_data,
						function: this.functions_all
					})); //added functions in discrete manner because json.stringify was not working properly on overall functions json array
				}
			} catch (error) {
				console.error("Error in dataAssignmentAfteFormula: ",error);
				//this.api.WriteErrorLogs("Error in dataAssignmentAfteFormula: "+error);
			} finally {}
		}
		getDropdownSelectedValueIndex(control: any) {
			try {
				return this.dropdowns[control.sourcingLink].findIndex((d: {
					code: any;
				}) => d.code === control.currentValue);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in getDropdownSelectedValueIndex: "+error);
			} finally {}
		}

		getSelectedTemplateIndex(template: any) {
			try {
				return this.Templateddl.findIndex((t: {
					template_Code: any;
				}) => t.template_Code === template.template_Code);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in getSelectedTemplateIndex: "+error);
			} finally {}
		}

		selectDate(control: any, date: string) {
			try {
				console.log(date);
				control.value = date;
				// this.form.get(control).setValue(date);
				// this.changeFieldValues();
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in selectDate: "+error);
			} finally {}
		}

		formatNumber(control: {
			value: string;udF_Format: number;
		}) {
			// console.log(control);
			try {
				if (isNaN(parseFloat(control.value))) {
					// return '';
					control.value = '';
				} else {
					control.value = this.formatKLMB(control.value, control.udF_Format);
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in formatNumber: "+error);
			} finally {}
		}

		unformatNumber(value: string) {
			// console.log(control);
			try {
				if (value) {

					return Number(value.replace(/\,/g, ''));
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in unformatNumber: "+error);
			} finally {}
			// control.currentValue.replace(/,/g, '');
		}

		IsValidNumber(val: any): boolean {
			try{
			return /^\d+(.\d*?)?$/.test(val);
			}catch(e){
				console.log("Error in IsValidNumber :", e)
			}
		}

		formatKLMB(value: string, precision = 2) {
			try {
				if (value.trim() == "") {
					return value;
				}
				//if(!isNaN(Number(value)) === true){ /// added this condition to handle string values like 'true', 'abc' in 'value' instead of any numbers - by OnkarE on 22-Mar-2021
					value = value.replace(/,/g, '');
					if ((value.match(/([kK]{1})/g)) != null) {
						value = (parseFloat(value.replace(/[kK]/g, '')) * 1000).toFixed(precision);
					} else if ((value.match(/([lL]{1})/g)) != null) {
						value = (parseFloat(value.replace(/[lL]/g, '')) * 100000).toFixed(precision);
					} else if ((value.match(/([mM]{1})/g)) != null) {
						value = (parseFloat(value.replace(/[mM]/g, '')) * 1000000).toFixed(precision);
					} else if ((value.match(/([bB]{1})/g)) != null) {
						value = (parseFloat(value.replace(/[bB]/g, '')) * 1000000000).toFixed(precision);
					}
					//value = parseFloat(value).toFixed(precision).replace(/\d(?=(\d{3})+\.)/g, '$&,');
					if(precision == 2)
						value = parseFloat(value).toFixed(precision).replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ','); // Changed by Onkar on 05-May-2023
					else 
						value = parseFloat(value).toFixed(precision).replace(/\d(?=(\d{3})+\.)/g, '$&,');
					return value;
				// }
				// else 
				// 	return "";
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in formatKLMB: "+error);
			} finally {}
		}

		//Added by SwatiP ON 3-MARCH-2021
		async btnReprice_Click() {
			try {
				await this.InvokeButtonLinkedFunctions('btnReprice');

			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in btnReprice_Click: "+error);
			} finally {}
		}
		async CheckDraft() {
			try {
				this.loader = true;
				await this.InvokeButtonLinkedFunctions('btnDraft');
				this.SaveData();
				console.log("Started drafting the template!");
				// if (this.tableRow.length) {
				//   this.draftclicked = this.draftclicked + 1;
				// } else {
				//   this.SaveData();
				// }
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in CheckDraft: "+error);
			} finally {}
		}
		DraftResponse(res) {
			try {
				console.log(res);
				if (res === 'OK') {
					this.ErrorMessage = '';
					this.SaveData();
				} else if (res === 'Error') {
					this.ErrorMessage = 'Error or Blank value in mandatory field(s)';
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in DraftResponse: "+error);
			} finally {}
		}
		async SaveData() {
			try {
				this.ErrorMessage = "";
				console.log("Customer Grid data while drafting the response is =====", this.custGridTableRow, this.CustomerGrid.data)
				// RaiseEvent clearWarning() ''need to call
				console.log("saving the data!");
				this.sWarningtextArr = []; //clearing warning if any before validation 
				if (this.ValidateData() === true) {
					console.log("No Error from ValidateData...")
					await this.InvokeHardBlockPromptFunctions()
					if(!this.hardblock_triggered)
					{
						this.SetDataContractForDealSave();
					}
					else
					{
						this.loader = false;
					}
				} else {
					this.loader = false;
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in SaveData: "+error);
			} finally {}

		}

		ValidateData(): boolean {
			let blnWarning:boolean = true;
			try {
				if (!this.controls) {
					this.loader = false;
					return false;
				}
				let strMandate = '';
				this.strmandate_triggered=false;
				// this.controls.filter((c: any) => c.mandatory === 'Y' && c.value !== undefined).forEach((control: any) => {
				//   if (control !== null && control.dataType !== 'SHARE COLLECTION') {
				//     control.error = false;
				//     console.log("Element Ref console---> ", this.elemRef, control);
				//     this.elemRef.nativeElement.querySelector('#' + control.fieldName).style.borderColor = 'white';
				//     this.elemRef.nativeElement.querySelector('#' + control.fieldName).parentElement.parentElement.parentElement.parentElement.classList.remove('mat-form-field-invalid');
				//   }
				// });

				///////////udf fields validation
				this.controls.filter((c: any) => c.mandatory === 'Y' && (c.value === undefined || c.value === '')).forEach((control: any) => {
					//this.elemRef.nativeElement.querySelector('#' + control.fieldName).classList.add('.mat-form-field-invalid')
					// this.elemRef.nativeElement.querySelector('#' + control.fieldName).parentElement.parentElement.parentElement.parentElement.classList.remove('ng-valid');
					if (control.dataType !== 'SHARE COLLECTION'){
						console.log("Mandatory field issue in: ", control);
						this.elemRef.nativeElement.querySelector('#' + control.fieldName).parentElement.parentElement.parentElement.parentElement.classList.add('mat-form-field-invalid');
					}
					control.error = true;
					strMandate = strMandate + control.displayName + ', ';
				});

				if (strMandate) {
					this.loader = false;
					this.ErrorMessage = 'Error or Blank value in mandatory field(s) : ' + strMandate.slice(0, -2) + '.';
					this.strmandate_triggered=true;
					//return false;
					blnWarning =false;
					}


				//////////custom tab validation
				if (this.template.basket_Size == 7)
				{
				for(let i=0;i<this.tableRow.length;i++)
				{
					this.tableRow[i].filter(c=>c.mandatory === 'Y' && (c.value === undefined || c.value === '')).forEach(control=>{
						if (control.dataType !== 'SHARE COLLECTION'){
							console.log("Mandatory field issue in custom tab: ", control);
							this.elemRef.nativeElement.querySelector('#' + control.fieldName).parentElement.parentElement.parentElement.parentElement.classList.add('mat-form-field-invalid');
						}
						control.error = true;
						strMandate = strMandate + control.displayName + ', ';
					});

					if (strMandate) {
						this.loader = false;
						this.ErrorMessage = 'Error or Blank value in mandatory field(s) : ' + strMandate.slice(0, -2) + '.';
						this.strmandate_triggered=true;
						blnWarning =false;
						break;
						}
				}
				}	



					switch(this.selectedBookingModel.toUpperCase())
					{
					case "PRODUCT":
					case "UDF":
						break;
					default :
						if (!this.ValidateCustomerGridData()){
								blnWarning=false;
						}                      
						break;  
					}

					return blnWarning;
				// else
				// {
				// 	return true;
				// }
			} catch (error) {
				this.strmandate_triggered=true;
				console.error(error);
				//this.api.WriteErrorLogs("Error in ValidateData: "+error);
			} finally {}
		}

		ValidateCustomerGridData():boolean{ //function will return false if validation not proper & vice-versa
			try{
				//let blncust_valid:boolean=true;
				let strMandate="";
					for(let i=0;i<this.custGridTableRow.length;i++)
					{
						///////mandatory fields check
						//Need to uncomment
						this.custGridTableRow[i].filter(c=>c.mandatory === 'Y' && (c.value === undefined || c.value === '')).forEach(control=>{
							if (control.type !== 'SHARE COLLECTION'){
								console.log("Mandatory field issue in customergrid: ", control);
								//this.elemRef.nativeElement.querySelector('#' + control.columnName).parentElement.parentElement.parentElement.parentElement.classList.add('mat-form-field-invalid');
							}
							control.error = true;
							strMandate = strMandate + control.displayName + ', ';
						});

						///////edit rights check
						if(this.oEditrightsCustomer.length>0)
						{
							let dtEditrightsCustomer=this.oEditrightsCustomer.filter(x=>x.eR_Visible_YN.substr(2,1)=='Y');
							if (dtEditrightsCustomer.length>0)
							{
							for(let cnt=0;cnt<dtEditrightsCustomer.length;cnt++)
							{
								this.custGridTableRow[i].forEach(control => {
									if(control.columnName==dtEditrightsCustomer[cnt].eR_UDF_Field)
									{
										if (control.type !== 'SHARE COLLECTION' && (control.value === undefined || control.value === ''))
										{
											console.log("Mandatory field issue in customergrid: ", control);
											this.elemRef.nativeElement.querySelector('#' + control.columnName).parentElement.parentElement.parentElement.parentElement.classList.add('mat-form-field-invalid');
										}
										control.error = true;
										strMandate = strMandate + control.displayName + ', ';
									}
									
								});
							}
							}

						}

						if (strMandate) {
							this.loader = false;
							this.ErrorMessage = 'Error or Blank value in mandatory field(s) : ' + strMandate.slice(0, -2) + '.';
							this.strmandate_triggered=true;
							break;
						}

						////////valid customer_id check
						let Cust_Id = this.custGridColumns.includes("clmnCustomerId") ? Number(this.custGridTableRow[i].find(function(e) {
							return e.columnName === 'clmnCustomerId'
						}).value) : 0 ;

						Cust_Id==0? this.ErrorMessage="Customer id should not be blank. Unknown error occured. Please try again.":"";
						
						////////blank notional check

						if (this.template.blankNotionalYN=="Y" && this.sUCPMode != "UCPUNW" && this.sUCPMode !="UCPREV" && this.sUCPMode !="UNWFUL") //as per dotnet logic
					{
						let Nominal_Amount = this.custGridColumns.includes("clmnCustomerNotional") ? Number(this.custGridTableRow[i].find(function(e) {
							return e.columnName === 'clmnCustomerNotional'
						}).value) : 0 ;
											
						Nominal_Amount==0?this.ErrorMessage = "Investment amount field is blank.":"";	
					}				

					}
				
				
				if (this.ErrorMessage=="")
				{
					this.strmandate_triggered=true;			
					return true;
				}						
				else
				{
					this.loader = false; // Added by OnkarE on 22-Mar-2022 to turn off loader when there is error (validation notification) form ValidateCustomerGridData.
					return false;
					
				}
				
				
			}
			catch (error) {			
				console.error(error);
				//this.api.WriteErrorLogs("Error in ValidateCustomerGridData: "+error);
			} finally {}
		}


		GetRecipeDetails() {
			try {
				var iParentTemplateId, iParentTemplateSrNo;
				this.sMigrationMode = 'Recipe';
				this.sParentTemplateCode = this.template.template_Code;
				this.iRecipeParentNoteMasterId = this.iPreviousNoteMasterId;
				this.sUCPPreviousMode = this.sUCPMode
				console.log("Inside getrec details", this.template, this.template.template_Id, this.iTemplateSrNo);
				switch (this.sUCPMode) {
					case 'FEDCHIL':
					case 'UCPCHIL':
						iParentTemplateId = this.template.template_Id
						iParentTemplateSrNo = Number(this.iTemplateSrNo)
						iParentTemplateId = this.template.template_Id
						iParentTemplateSrNo = Number(this.iTemplateSrNo)
						break;
					default:
						//iParentTemplateId = CInt(sDefaultTemplateId)
						//    iParentTemplateSrNo = this.iTemplateSrNo
						break;
				}
				this.api.GetAppTableDatainXMLFormat(iParentTemplateSrNo, this.sParentTemplateCode, -1).subscribe(
					(response: any) => {
						if (response.status === Status.Success) {
							const sRecipeDetails = response.response;
							/// XML Parsing is done here!!
							console.log("XML PArsing.....", sRecipeDetails);
							var parser, xmlDoc;
							parser = new DOMParser();
							xmlDoc = parser.parseFromString(sRecipeDetails, "application/xml");
							this.ParentUDFRow = this.xml2json(xmlDoc);
							this.ParentUDFRow = this.ParentUDFRow.DocumentElement.DUMMY;
							console.log(this.xml2json(xmlDoc));
							// let parseString = require('xml2json').parseString; 
							// parseString(sRecipeDetails, function (err, result) 
							// { console.log(JSON.parse(result)); });
							console.log(xmlDoc.getElementsByTagName("Template_ID")[0].childNodes[0].nodeValue);
							// console.log(xmlDoc.getElementsByTagName("Date_of_birth")[0].childNodes[0].nodeValue);
						}
					});

				this.api.GetChildTemplates(iParentTemplateId, "GROUP", "", "").then(
					(response: any) => {
						if (response.status === Status.Success) {
							const oProductRecipeInstance = response.response;
							if (oProductRecipeInstance.length > 0) {
								for (var iCount = 0; iCount < oProductRecipeInstance.length; iCount++) {
									// debugger
									this.sTemplateCode = oProductRecipeInstance[iCount].template_code;
									this.template.template_Code = oProductRecipeInstance[iCount].template_code;

									console.log("Recipe mapping started for child template- ", this.sTemplateCode, this.template.template_Code, oProductRecipeInstance);
									this.iChildTemplateCount = this.iChildTemplateCount + 1;

									this.api.GetRecipeMapping(iParentTemplateId, Number(oProductRecipeInstance[iCount].ubB_BB_Template_Id),
										Number(oProductRecipeInstance[iCount].ubB_Child_Template_Count),
										oProductRecipeInstance[iCount].ubB_Recipe_Type).then(
										(response: any) => {
											if (response.status === Status.Success) {
												this.oProductRecipeDetails = response.response;
												console.log("GetRecipeMapping response", this.oProductRecipeDetails, this.sUCPMode)
												if (this.oProductRecipeDetails.length > 0) {} else {
													console.log("No UDF/ROH fields mapping found for child template- ", this.templateCode);
												}
												//this.SetStaticValuesFromTemplateCodeInMigrationMode();
												this.api.GetStaticDetailsFromTemplate(this.sTemplateCode).then(
													(response: any) => {
														if (response.status === Status.Success) {

															const oStaticDataDetails = response.response[0];
															this.iProductId = Number(oStaticDataDetails.product_Id)
															this.iSchemeCode = Number(oStaticDataDetails.scheme_code)
															this.iTemplateID = Number(oStaticDataDetails.template_ID)
															this.iDefaultProductId = Number(oStaticDataDetails.product_Id)
															this.iDefaultSchemeId = Number(oStaticDataDetails.scheme_code)
															this.iDefaultTemplateId = Number(oStaticDataDetails.template_ID)
															// this.sTemplateCode = oStaticDataDetails.template_Code;
															this.sschemeAlias = oStaticDataDetails.scheme_Alias;
														}
													});
												if (oProductRecipeInstance[iCount].ubB_ROH_Mode.toUpperCase() === 'DEAL ENTRY') {
													console.log("MODEEEEEEEEE", this.iSchemeCode)
													switch (this.sUCPMode) {
														case 'FEDCHIL':
															this.SetDataContractForDealSave();
															this.sUCPMode = UCPMODE[UCPMODE.FEDCHIL];
															break;
														case 'UCPCHIL':
															this.recFlag = true;
															this.changeModule();
															// this.sUCPMode = UCPMODE[UCPMODE.UCPQEN];
															// setTimeout(() => {

															// }, 5000);
															break;
														case 'UCPQEN':
															this.SetDataContractForDealSave();
															break;
													}
												}
											}
										});
								}

							} else {
								console.log("child mapping not found for parent template ", this.sTemplateCode);
							}

						}
					});
				this.blnMigrationSuccessful = true;
				this.sMigrationMode = '';
				return true;
			} catch (error) {
				console.log(error);
				//this.api.WriteErrorLogs("Error in GetRecipeDetails: "+error);
			} finally {}
		}

		SetStaticValuesFromTemplateCodeInMigrationMode() {
			try {
				console.log("Calling SetStaticValuesFromTemplateCodeInMigrationMode", this.sTemplateCode)
				// this.api.GetStaticDetailsFromTemplate(this.sTemplateCode).then(
				// 	(response: any) => {
				// 		if (response.status === Status.Success) {

				// 			const oStaticDataDetails = response.response[0];
				// 			this.iProductId = Number(oStaticDataDetails.product_Id)
				// 			this.iSchemeCode = Number(oStaticDataDetails.scheme_code)
				// 			this.iTemplateID = Number(oStaticDataDetails.template_ID)
				// 			this.iDefaultProductId = Number(oStaticDataDetails.product_Id)
				// 			this.iDefaultSchemeId = Number(oStaticDataDetails.scheme_code)
				// 			this.iDefaultTemplateId = Number(oStaticDataDetails.template_ID)
				// 			// this.sTemplateCode = oStaticDataDetails.template_Code;
				// 			this.sschemeAlias = oStaticDataDetails.scheme_Alias;
				// 			this.sschemeName = oStaticDataDetails.scheme_Name;
				// 			if (this.sUCPMode === 'UCPWFL') {
				// 				/// Calling change module to load module and scheme - by OnkarE on  10-Nov-2020
				// 				if (this.Embedded_Control.toUpperCase() != "MULTIUCP") {
				// 					const testModule1 = this.Moduleddl.filter(a => a.product_Id === this.iProductId.toString());
				// 					this.moduleData = {};
				// 					this.moduleData.product_Id = testModule1[0].product_Id;
				// 					this.moduleData.product_Name = testModule1[0].product_Name
				// 					console.log("Module data is: ", this.moduleData);
				// 				}
				// 				this.changeModule();
				// 			}
				// 		}
				// 	});

				this.api.GetStaticData(Number(this.iNoteMasterID)).then(
					(response: any) => {
						if (response.status === Status.Success) {

							const oStaticDataDetails = response.response[0];
							this.iProductId = Number(oStaticDataDetails.product_Id)
							this.iSchemeCode = Number(oStaticDataDetails.scheme_code)
							this.iTemplateID = Number(oStaticDataDetails.template_ID)
							this.iDefaultProductId = Number(oStaticDataDetails.product_Id)
							this.iDefaultSchemeId = Number(oStaticDataDetails.scheme_code)
							this.iDefaultTemplateId = Number(oStaticDataDetails.template_ID)
							// this.sTemplateCode = oStaticDataDetails.template_Code;
							this.sschemeAlias = oStaticDataDetails.scheme_Alias;
							this.sschemeName = oStaticDataDetails.scheme_Name;
							this.DefaultSubtemplate = oStaticDataDetails.subTemplateId;
							this.iTemplateSrNo = oStaticDataDetails.template_Sr_No;
							if (this.sUCPMode === 'UCPWFL') {
								/// Calling change module to load module and scheme - by OnkarE on  10-Nov-2020
								if (this.Embedded_Control.toUpperCase() != "MULTIUCP") {
									const testModule1 = this.Moduleddl.filter(a => a.product_Id === this.iProductId.toString());
									this.moduleData = {};
									this.moduleData.product_Id = testModule1[0].product_Id;
									this.moduleData.product_Name = testModule1[0].product_Name
									console.log("Module data is: ", this.moduleData);
								}
								this.changeModule();
							}
						}
					});
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in SetStaticValuesFromTemplateCodeInMigrationMode: "+error);
			} finally {}
		}

		SetInterFaceLinkTFromOtherControls() {
			try {
				var sParentFieldName, sChildFieldName, iUDFFieldPosition;
				if (this.sMigrationMode == 'Recipe') {
					/// result.DocumentElement.DUMMY[0].AML_Check[0]
					console.log("inside SetInterFaceLinkTFromOtherControls ", this.oProductRecipeDetails, this.ParentUDFRow, this.iTemplateID);
					if (this.oProductRecipeDetails.length > 0) {
						for (var iCnt = 0; iCnt < this.oProductRecipeDetails.length; iCnt++) {
							sParentFieldName = this.oProductRecipeDetails[iCnt].ubB_UDF_Parent //Parent field
							sChildFieldName = this.oProductRecipeDetails[iCnt].ubB_UDF_Pointer //child field
							//find field position in current template
							// iUDFFieldPosition = Array.FindIndex(oFieldDetails, Function(x)(Not IsNothing(x.FieldName))
							// AndAlso x.FieldName.ToString.ToUpper.Trim = sChildFieldName.ToUpper)
							switch (this.oProductRecipeDetails[iCnt].ubB_Field_Type.toUpperCase()) {
								case 'UDF':
									if (this.ParentUDFRow.hasOwnProperty(sParentFieldName)) {
										this.controls.forEach(element => {
											if (element.fieldName != undefined && element.fieldName === sChildFieldName) {
												element.defaultValue = this.ParentUDFRow[sParentFieldName];
												element.currentValue = this.ParentUDFRow[sParentFieldName];
												element.value = this.ParentUDFRow[sParentFieldName];;
											}
										});
										console.log("Data to child.... ", this.controls);
										//set parent field value to curent position default value 
										//ofieldDetails(iUDFFieldPosition).DefaultValue = drMigration.Item(sParentFieldName).ToString
									}
									break;
							}
							//set current value
							//oFieldDetails(iUDFFieldPosition).CurrentValue = oFieldDetails(iUDFFieldPosition).DefaultValue
						}
					}
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in SetInterFaceLinkTFromOtherControls: "+error);
			} finally {}
		}

		async SetDataContractForDealSave() {
			try {
				const that = this;
				this.loader = true;
				// Added following condition for sInsertUpdate by OnkarE on 28-Apr-2021
				if(this.sUCPMode == 'UCPQEN'){
					this.sInsertUpdate = "Insert"
				}
				else {
					this.sInsertUpdate = "Update"
				}

				this.notemasterIdGenerated = false;
				// console.log(this.controls);
				const ODCUCPAppTablesData: any[] = [];
				const ODCProductDetailsRequest: any[] = [];
				// const ODCDynamicCustGridData: any[][] = [];
				const ODCDynamicCustGridData: any[] = []; // for dynamic data of customer grid
			let ODCLegDetails: any[] = [];
				//new Array(this.custGridTableRow.length); /// for static data of customer grid
				let ODCProductSchedule:any[]=[];
				let ODCViewSchedule:any[]=[];
				// console.log(this.TemplateData);
				// if(!this.Multi_UCP){
				//   // var currScheme = this.Schemeddl.filter((c: any) => c.scheme_Code === this.scheme);
				//   console.log("Curr Scheme Alias is:: ", this.sschemeAlias);
				// }
				console.log("Temp data", this.TemplateData);
				console.log("Curr Scheme Alias is:: ", this.sschemeAlias);
				console.log("Current sub template id: ", this.subTemplate.toM_ID);

				//debugger;
				// let obj_temp1 = new UCPRESTSERVICE ();
				let obj_temp = new UCPCTLSERVICE.ProductDetailsRequest ();
				//obj_temp.Type = this.sschemeAlias + '', //this.Multi_UCP ? this.template.schemeAlias+'' :
				obj_temp.Type = "Demo Products",
				obj_temp.AssetClass = this.TemplateData[0].template_Asset_Class, //this.Multi_UCP ?'EQ':
				obj_temp.Note_Asset_Class = this.TemplateData[0].template_Asset_Class, //this.Multi_UCP ?'EQ':
				obj_temp.Template_ID = this.template.template_Id, //this.Multi_UCP ? this.template.template_Id :
					//Entity_ID: this.selectedEntity,
					obj_temp.Entity_ID = 3,
					obj_temp.CreationMode = 'Deal Entry',
					obj_temp.template_Name = this.template.template_Name, //this.Multi_UCP ? this.template.template_Name :
					obj_temp.Created_By = this.Login_Id,
					obj_temp.Hedging_Type = this.selectedBookingModel,
					obj_temp.Reference_Number = this.iRecipeParentNoteMasterId.toString(),
					obj_temp.Product_Name = this.template.template_Name,
					//Link_No: Number(this.subTemplate.toM_ID==""?0:this.subTemplate.toM_ID), //subtemplate saving on draft click
					obj_temp.Link_No = 3,
					obj_temp.Note_Master_Id = this.sUCPMode == 'UCPQEN' ? 0 : Number(this.iNoteMasterID)
				const obj = {
					Type: this.sschemeAlias + '', //this.Multi_UCP ? this.template.schemeAlias+'' :
					AssetClass: this.TemplateData[0].template_Asset_Class, //this.Multi_UCP ?'EQ':
					Note_Asset_Class: this.TemplateData[0].template_Asset_Class, //this.Multi_UCP ?'EQ':
					Template_ID: this.template.template_Id, //this.Multi_UCP ? this.template.template_Id :
					Entity_ID: this.selectedEntity,
					CreationMode: 'Deal Entry',
					template_Name: this.template.template_Name, //this.Multi_UCP ? this.template.template_Name :
					Created_By: this.Login_Id,
					Hedging_Type: this.selectedBookingModel,
					Reference_Number: this.iRecipeParentNoteMasterId.toString(),
					Product_Name: this.template.template_Name,
					Link_No: this.subTemplate.toM_ID, //subtemplate saving on draft click
					Note_Master_Id: this.sUCPMode == 'UCPQEN' ? 0 : Number(this.iNoteMasterID)
				};

				// if(this.IsRecipeMode){
				//    obj.Reference_Number = iRecipeParentNoteMasterId.ToString 
				// }

				ODCProductDetailsRequest.push(obj_temp);
				// console.log(ODCProductDetailsRequest);
				console.log("TempOBJ", obj_temp);


				this.controls.forEach((element: any) => {
					// if (element.dataType) {
					// 	console.log(element, element.fieldName, element.value);
					// }

					if (element.fieldName && element.value) {
						//console.log("Insinde iffffffffffffffff", this.template.template_Code, this.sTemplateCode);
						let temp_apptable = new UCPCTLSERVICE.ODCUCPAppTablesData();
						temp_apptable.Template_Code= this.sTemplateCode
						temp_apptable.Template_ID= this.iTemplateID
						temp_apptable.Field_Name= element.fieldName
						temp_apptable.UDF_Format= element.udF_Format == null ? 0 : element.udF_Format
						temp_apptable.Field_Data_Type= element.dataType
							temp_apptable.Field_Value= element.value ? this.unformatValueBeforeSave(element) : element.value //
						ODCUCPAppTablesData.push(temp_apptable);
						// ODCUCPAppTablesData.push({
						// 	Template_Code: this.sTemplateCode,
						// 	Template_ID: this.iTemplateID,
						// 	Field_Name: element.fieldName,
						// 	UDF_Format: element.udF_Format == null ? 0 : element.udF_Format,
						// 	Field_Data_Type: element.dataType,
						// 	// Field_Value: element.value
						// 	Field_Value: element.value ? this.unformatValueBeforeSave(element) : element.value, //
						// 	//Added by RajeshC || SaveUCP handling
						// 	Field_Old_Value:"",
						// 	Field_Display_Name:"",
						// 	Reference:"",
						// 	//UDF_Format:""
						// });
						// console.log("Final response----------> ", ODCUCPAppTablesData);
					}
				});

				for (let j = 0; j < ODCDynamicCustGridData.length; j++) {
					ODCDynamicCustGridData[j] = [];
				}
				for (let j = 0; j < ODCLegDetails.length; j++) {
					ODCLegDetails[j] = [];
				}


				if(this.selectedBookingModel != "Product" && this.selectedBookingModel != "RFQ" && this.selectedBookingModel != "UDF"){
					if (this.custGridTableRow.length > 0) {
						/// customer grid data saving - by OnkarE on 15-Dec-2020
						for (let i = 0; i < this.custGridTableRow.length; i++) {
							this.custGridTableRow[i].forEach((element: any) => {
								if(element.ucgM_ColumnType.toUpperCase() != "STATIC") { // Added this condition by OnkarE on 04-May-2023 same as .Net
									ODCDynamicCustGridData.push({
										// customerID: this.custGridColumns.includes("clmnCustomerId") ? Number(this.custGridTableRow[i].find(function(e) {										
										// 	return e.columnName === 'clmnCustomerId'
										// }).value.replace(/,/g, '')) : 0, //added global replace to replace at nos like 2,000,000 - by OnkarE on 07-Jan-2022
										// customerID: this.custGridColumns.includes("clmnCustomerId") ? Number(this.custGridTableRow[i].find(function(e) {										
										// 	return e.columnName === 'clmnCustomerId'
										// }).value) : 0,
										customerID: this.custGridColumns.includes("clmnCustomerId") ? 
										(this.custGridTableRow[i].find(function(e) {										
											return e.columnName === 'clmnCustomerId'
										}).value) == null ? 0 : Number(this.custGridTableRow[i].find(function(e) {										
											return e.columnName === 'clmnCustomerId'
										}).value) : 0,
										LegCount: String(i + 1), /// To be confirmed with Note_Ref column
										Note_deal_Id: this.custGridColumns.includes("Note_Deal_Id") ? 
														(this.custGridTableRow[i].find(function(e) {										
															return e.columnName === 'Note_Deal_Id'
														}).value) == null ? "" : (this.custGridTableRow[i].find(function(e) {										
															return e.columnName === 'Note_Deal_Id'
														}).value) : "", // Added this code by OnkarE on 03-May-2023 for getting Note_deal_id for each leg, it will be blank for new row
										
										
										//"", /// Need to check with rohit sir
										Field_Name: element.noteDealsColumn,
										//Field_Value: element.value ? this.unformatCustGridValueBeforeSave(element) : element.value,
										Field_Value: element.value ? this.unformatCustGridValueBeforeSave(element) : "",
										//Added by RajeshC || SAVEUCP // Modified by OnkarE on 03-May-2023
										NoteOrders_Clmn: null,
										NoteAccount_Clmn: null,
										NoteDealsMisc_Clmn: null,
										NoteMaster_Clmn: null,
									})
								}
								
							});
						
                      ODCLegDetails = this.SetCustomerGridDataContract(i,ODCLegDetails);

						}
					}
				}
				if(this.template.AllowScheduleFireAndForget == 'N') {
					if(this.oProductSchedule.length>0) //direct push if schedule already exists else generate schedule
					{
					ODCProductSchedule=this.CreateProdSchedDataContract(this.oProductSchedule);
					}
					else
					{
					let dtProdSched= await this.GenerateProductSchedule();
					ODCProductSchedule= this.isNullOrUndefined(dtProdSched)? [] : dtProdSched;
					}

					if(this.oViewSchedule.length>0) //added here but pending on controller sied & datacontract to be verified by Bhagyashri B. Also not considered fire&forget as of now
					{
						ODCViewSchedule=this.CreateViewSchedDataContract(this.oViewSchedule);
					}
					else
					{
						let dtViewSched = await this.GenerateViewSchedule();
						ODCViewSchedule= this.isNullOrUndefined(dtViewSched)? [] : dtViewSched;
					}
				}
				

				
				console.log("Customer Grid Dynamic Data Saving Input is: ", ODCDynamicCustGridData)
				console.log("Customer Grid Leg Details Data Saving Input is: ", ODCLegDetails);
				const MergedContract = {
					ODCProductDetailsRequest,
					ODCUCPAppTablesData,
					ODCDynamicCustGridData,
					ODCLegDetails,
					ODCViewSchedule,
					ODCProductSchedule,
					sEntryMode: this.sUCPMode,
					sUserID: this.Login_Id,
					sInsertUpdate: this.sInsertUpdate
				};

				console.log("Drafting the data with my current data is::: ", MergedContract);
				this.api.SaveUCP(MergedContract).then(
					(response: any) => {
						if (response.status ? response.status === Status.Success : false) {
							const res = response.response;
							console.log(res);

							that.NoteMasterID = res[0].noteMasterID;
							this.iTemplateSrNo = Number(res[0].templateSrNo); //added number conversion as res was received in string type
							this.productdDrafted = true;
							if (res) {
								if (this.template.saveChild_YN === 'Y') {
									//this.template.saveChild_YN = 'N';
									this.sUCPPreviousMode = this.sUCPMode
									this.sUCPMode = UCPMODE[UCPMODE.UCPCHIL];
									this.iPreviousNoteMasterId = that.NoteMasterID;
									localStorage.setItem('iParentTemplateId', this.template.template_Id);
									localStorage.setItem('iParentTemplateCode', this.template.template_Code);
									localStorage.setItem('iProductId', this.module);
									localStorage.setItem('iSchemeCode', this.scheme.scheme_Code);
									if (res[0].productName)
										localStorage.setItem('parentProdName', res[0].productName)
									that.NoteMasterID = -1;
									if (this.GetRecipeDetails()) {
										console.log("Child templates saving is done!!")
										this.iTemplateID = Number(localStorage.getItem('iParentTemplateId'));
										this.sTemplateCode = localStorage.getItem('iParentTemplateCode');
										this.iProductId = Number(localStorage.getItem('iProductId'));
										this.iSchemeCode = Number(localStorage.getItem('iSchemeCode'));
										var parentProdName = localStorage.getItem('parentProdName');
										this.NoteMasterID = this.iRecipeParentNoteMasterId;
										this.changeModule();
										if (parentProdName != undefined || parentProdName != null)
											this.Message = parentProdName + " drafted successfully with reference number " + this.NoteMasterID + ". Please save to continue.";
										//this.Message = this.template.template_Name.trim() + ' saved successfully with reference number ' + this.NoteMasterID;
										else
											this.Message = "Product drafted successfully with reference number " + this.NoteMasterID + ". Please save to continue.";
										// console.log(this.Message);

										this.iPreviousNoteMasterId = that.NoteMasterID;
										//that.NoteMasterID = -1;
									}
								} else {
									if (this.recFlag) {
										this.InsertTokenDatasavebtn();
									} else {
										if (this.Embedded_Control.toUpperCase() != "MULTIUCP" && this.Embedded_Control.toUpperCase() !='POSTCARD' && this.PanelYesNo == true) { //mulitucp condition added by devesh to hide draft message on save all for multiucp on 13-Oct-2020
											if(this.sInsertUpdate == 'Insert'){ /// Added this condition for UCPQEN mode - by OnkarE on 30-Apr-2021
												if (res[0].productName) {
													if(this.selectedBookingModel == 'RFQ' || this.selectedBookingModel == 'UDF'){
														this.Message = res[0].productName + " drafted successfully with reference number " + res[0].noteMasterID + ".";
													}
													else {	
														this.Message = res[0].productName + " drafted successfully with reference number " + res[0].noteMasterID + ". Please save to continue.";
													}
												}
												//this.Message = this.template.template_Name.trim() + ' saved successfully with reference number ' + res[0].noteMasterID;
												else {
													if(this.selectedBookingModel == 'RFQ' || this.selectedBookingModel == 'UDF'){
														this.Message = "Product drafted successfully with reference number " + res[0].noteMasterID + ".";
													}
													else {
														this.Message = "Product drafted successfully with reference number " + res[0].noteMasterID + ". Please save to continue.";
													}
												}
												this.notemasterIdGenerated = true;											
											}
											else if(this.sInsertUpdate == 'Update'){ /// Added this condition for UCPWFl, PRDAMD mode - by OnkarE on 30-Apr-2021
												this.Message = res[0].savingMessage;
												this.SaveDataAmendModeNext();
											}
											
										}
										else if(this.PanelYesNo == false){
											// 	window.opener.postMessage({'notemaster':res[0].noteMasterID, 'templateId':this.iTemplateID, 'test':"abc"} , "http://localhost:4200/");
											console.log("Data sending to popup: ", res[0].noteMasterID); 
											this.InsertTokenDatasavebtn();
											//Commented by RajeshC
											//window.opener.postMessage({'noteMaster':res[0].noteMasterID, 'templateId':this.iTemplateID,'origin':'ucp_angularfxcashtiles'}, environment.FXCashTilesURL);
										}
									}
								}
								this.loader = false;
								console.log(that.NoteMasterID, "this.IsSavingProcedureInSingleAction ", this.IsSavingProcedureInSingleAction);
							if(this.IsSavingProcedureInSingleAction){
								console.log("Inserring token as IsSavingProcedureInSingleAction is true ")
								if (this.Embedded_Control.toUpperCase() == "MULTIUCP") {
									this.Multi_UCP_Savestatus.emit(this.Multi_UCP_index); //to indicate draft completed for particular index of multiucp and start next index
									this.InsertTokenDatasavebtn();
								} //for multiucp save after draft
								else{
									this.InsertTokenDatasavebtn();
								}
							}
							}
						} else {
							this.loader = false;
							if(response.title == 'One or more validation errors occurred.') {
								this.ErrorMessage = 'One or more validation errors occurred.'
							}
							else 
								this.ErrorMessage = response.response ? response.response : "Error while saving.";
							//this.api.WriteErrorLogs("Error occured in SetDataContract: "+response.response);
						}
					}
				);
			} catch (error) {
				console.error(error, "Error in SetDataContract");
				//this.api.WriteErrorLogs("Error occured in SetDataContract: "+error);
			} finally {}
			// console.log(this.Moduleddl);
		}

		unformatValueBeforeSave(control: any) {
			try {
				switch (control.dataType) {
					case 'AMOUNT':
						return this.unformatNumber(control.value);
					case 'NUMBER':
						return this.unformatNumber(control.value);
					case 'INTEGER':
						return this.unformatNumber(control.value);
					case 'FILEPATH':
					case 'TEXT':
					case 'TEXTAREA':
						return this.convertToString(control.value)
					case 'CHART':
						return "";
					case 'DATE':
						return moment(control.value).format("DD-MMM-YYYY");
					default:
						return control.value;
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in unformatValueBeforeSave: "+error);
			} finally {}
		}
		
		SetCustomerGridDataContract(i:number,ODCLegDetails:any[]):any[]{
		try{
			console.log("SetCustomerGridDataContract", i,  this.custGridColumns, this.custGridTableRow[i] )
			ODCLegDetails.push({
				Nominal_Amount: this.custGridColumns.includes("clmnCustomerNotional") ? 
				(isNaN( Number(this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnCustomerNotional'
				}).value.replaceAll(",",""))) ? 0 :Number(this.custGridTableRow[i].find(function(e) { 
					return e.columnName === 'clmnCustomerNotional'
				}).value.replaceAll(",",""))) : 0,  //added replace "," as it was returning NaN // Added replaceAll by OnkarE on 04-May-2023
				//Nominal_Amount:0,
				Deal_Customer_Type: this.custGridColumns.includes("clmnCustomerLeg") ? this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnCustomerLeg'
				}).value : '',
				Customer_Name: this.custGridColumns.includes("clmnCustomerName") ? this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnCustomerName'
				}).value : '',
				CustomerID: this.custGridColumns.includes("clmnCustomerId") ? 
				((this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnCustomerId'
				}).value) == undefined ? 0 : Number((this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnCustomerId'
				}).value))) : 0,
				No_Of_Shares: this.custGridColumns.includes("clmnCustomerQuantity") ? Number(this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnCustomerQuantity'
				}).value) : 0,
				Strike_Price: this.custGridColumns.includes("clmnCustCptyStrike") ? Number(this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnCustCptyStrike'
				}).value) : 0,
				BS_Direction: this.custGridColumns.includes("clmnCustomerDealDirection") ? this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnCustomerDealDirection'
				}).value : '',
				Customer_Price_NR: this.custGridColumns.includes("clmnCustCptyCustPrice") ? Number(this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnCustCptyCustPrice'
				}).value) : 0,
				RM_Name: this.custGridColumns.includes("clmnRMName") ? this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnRMName'
				}).value : '',
				RM_Employee_ID: this.custGridColumns.includes("clmnCustomerRMId") ? 
				((this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnCustomerRMId'
				}).value) == undefined ? '' : (this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnCustomerRMId'
				}).value) )  : '',
				Book_Name: this.custGridColumns.includes("clmnBookName") ? this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnBookName'
				}).value : '',
				Book_ID: this.custGridColumns.includes("clmnBookID") ? this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnBookID'
				}).value : '',
				Currency: this.custGridColumns.includes("clmnCustomerCurrency") ? this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'clmnCustomerCurrency'
				}).value : '',
				Note_Deal_Id: this.custGridColumns.includes("Note_Deal_Id") ? this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'Note_Deal_Id'
				}).value : '',
				LegCount: String(i + 1),
				//Added by RajeshC || SAVEUCP
				//START
				Customer_Yield:0,
				Spot_Price:0,
				Remark:"",
				//END
				Deal_Type: "Manual", // Changed by OnkarE on 04-May-2023
				Parent_Deal_ID: this.custGridColumns.includes("Parent_Deal_ID") ? this.custGridTableRow[i].find(function(e) {
					return e.columnName === 'Parent_Deal_ID'
				}).value : '',
				Order_Status:  'Manual' /// to be confirmed from RohitP
			})

			switch (this.sUCPMode.toUpperCase())
			{
				case "UCPUNW":
				case "UCPREV":
				case "UNWFUL":	
				  
					if (this.custGridTableRow[i].find(function(e) {	return e.columnName === 'Note_Deal_Id'	}).value == "" )
					    ODCLegDetails[i].Order_Status = "Unwind"
                    else if (this.custGridTableRow[i].find(function(e) { return e.columnName === 'clmnCustomerLeg' }).value == "COUNTERPARTY" )
					    ODCLegDetails[i].Order_Status = "Unwind"
                    else
					    ODCLegDetails[i].Order_Status = "New" //TryCast(dgvCustCpty.Rows(intRow).FindControl("Order_Status"), TextBox).Text.Trim /// to be confirmed from RohitP
                   
					break;

						//below part to be confirmed with Rohit P so commented as of now
					// 	if (this.custGridTableRow[i].find(function(e) {	return e.columnName === 'Note_Ref'	}).value == "" )
					// 	{
					// 		If iAddOnLegCount = 0 Then
                    //         iAddOnLegCount = Convert.ToInt32(ServiceProvider.UCPControlService.GetMaxCountForLegCount(iNoteMasterID.ToString))
                    //         ServiceProvider.CloseUCPControlService()
                    //         oStructCustomerInfo(iLegCount).LegCount = CStr(iAddOnLegCount + 1)
                    //         iAddOnLegCount = iAddOnLegCount + 1
                    //       Else
                    //         oStructCustomerInfo(iLegCount).LegCount = CStr(iAddOnLegCount + 1)
                    //         iAddOnLegCount = iAddOnLegCount + 1
                    //     End If
					// 	}                       

                    //   else
					//     {
					// 		ODCLegDetails[i].LegCount = this.custGridTableRow[i].find(function(e) {	return e.columnName === 'Note_Ref'	}).value
					//     }
				case "DLSADD":
					if (this.custGridTableRow[i].find(function(e) {	return e.columnName === 'Note_Deal_Id'	}).value == "" )
					    ODCLegDetails[i].Order_Status = "Add on New"
                    else if (this.custGridTableRow[i].find(function(e) { return e.columnName === 'clmnCustomerLeg' }).value == "COUNTERPARTY" )
					    ODCLegDetails[i].Order_Status = "Add on New"
                    else
					    ODCLegDetails[i].Order_Status = "New"
			     break;
			}

             return ODCLegDetails;
		}
		catch(error){
			console.error(error, "Error in SetCustomerGridDataContract");
		}
		finally{}
	}

		unformatCustGridValueBeforeSave(control: any) {
			try {
				switch (control.type) {
					case 'AMOUNT':
						return this.unformatNumber(control.value).toString();
					case 'NUMBER':
						return this.unformatNumber(control.value).toString();
					case 'INTEGER':
						return this.unformatNumber(control.value).toString();
					case 'FILEPATH':
					case 'TEXT':
					case 'TEXTAREA':
						return this.convertToString(control.value)
					case 'CHART':
						return "";
					case 'DATE':
						return moment(control.value).format("DD-MMM-YYYY").toString();
					default:
						return control.value;
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in unformatValueBeforeSave: "+error);
			} finally {}
		}

		convertToString(val) {
			try {
			/// Equivalent to gFixSQLString - added by OnkarE on 15-Feb-2021
			return val.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
				switch (char) {
					/// commented follwing cases by OnkarE on 17-Aug-2021 to resolve textarea escape seq issue reported by NitishK. Jira ID: UWI 159
					// case "\0":
					// 	return "\\0";
					// case "\x08":
					// 	return "\\b";
					// case "\x09":
					// 	return "\\t";
					// case "\x1a":
					// 	return "\\z";
					
					// 	case "\n":
					// 	return "\\n";
					// case "\r":
					// 	return "\\r";
					// case "\"":
					// case "'":
					// case "\\":
					// case "%":
					// 	return "\\" + char; // prepends a backslash to backslash, percent,
						// and double/single quotes


					default:
						return char;
				}
			});
		}catch(e){
			console.log("Error in convertToString :", e)
		}
		}
		

		checkTrUDFVisibility(elem:HTMLElement,Col_index: number,Row_index:number, control: any) {
			try {
				let fHt = "65px";
				if(this.orientation && this.orientation.toUpperCase() == 'EAST-WEST'){
					fHt = "50px";
				}
				if (control.controlHeight && control.controlHeight > 1) {
					fHt = ((Number(control.controlHeight)+1) * 27) + "px";
				}
				//console.log("checkTrUDFVisibility : ", Col_index, this.ColSize, Row_index, this.RowSize, control.displayName)
				if(Col_index<this.ColSize && Row_index<this.RowSize)
				{
					let displayStyle = "grid";
					if(this.hideEmptyFields == "Y") {
						if(control.fieldName != "" && control.fieldName != null) {
							if(control.visibility == "N") { 
								displayStyle = "none"
							}
						}
						else {
							displayStyle = "none"
						}
					}
					elem.style.setProperty("height", fHt, "important");
					elem.style.display = displayStyle;
					
				}
				else
				{
					elem.style.display = 'none';
				}
			} catch (error) {
				console.error(error);
			} finally {}
		}


		checkUDFVisibility(Col_index: number,Row_index:number, control: any) {
			try {
				//const mod = index % 49;
				let fHt = "40px";
				if (control.controlHeight && control.controlHeight > 1) {
					fHt = (control.controlHeight * 27) + "px";
				}
				// if (index > 49 * this.ColSize) {
				// 	return {
				// 		'display': 'none'
				// 	};
				// }
				// if ((mod) >= this.RowSize) {
				// 	return {
				// 		'display': 'none'
				// 	};
				// } else {
				// 	if (control.controlHeight && control.controlHeight > 0) {
				// 		return {
				// 			'display': 'grid'
				// 		}
				// 	} else
				// 		return {
				// 			'display': 'grid'
				// 		};
				// }
				if(this.orientation && this.orientation.toUpperCase() == 'EAST-WEST'){ /// setting height to 50px in this case - OnkarE on 11-Apr-2023
					if(Col_index<this.ColSize && Row_index<this.RowSize) //Added by Devesh because of multiucp row,col rendering issue
					{
						let displayStyle = "grid";
						if(this.hideEmptyFields == "Y") {
							if(control.fieldName != "" && control.fieldName != null) {
								if(control.visibility == "N") { 
									displayStyle = "none"
								}
							}
							else {
								displayStyle = "none"
							}
						}
							return {
								'display': displayStyle,
								'height': '50px'
							}
					}
					else
					{
							return {
							'display': 'none'
						}
					}
				}
				else {
					if(Col_index<this.ColSize && Row_index<this.RowSize) //Added by Devesh because of multiucp row,col rendering issue
					{
						let displayStyle = "grid";
						if(this.hideEmptyFields == "Y") {
							if(control.fieldName != "" && control.fieldName != null) {
								if(control.visibility == "N") { 
									displayStyle = "none"
								}
							}
							else {
								displayStyle = "none"
							}
						}
							return {
								'display': displayStyle,
								'height':((control.dataType =='SHARE COLLECTION' || control.udF_Feature1 === 'Railway Line' || control.dataType == 'CHART' || control.dataType == 'TEXTAREA' 
								|| control.dataType == 'UCP USER CONTROL' || control.dataType == 'IMAGE' || control.dataType == 'TIME' || (control.dataType == 'TEXT' && (Number(control.controlHeight)) > 0) 
								|| (control.dataType == 'AMOUNT' && (Number(control.controlHeight)) > 0) || (control.dataType == 'NUMBER' && (Number(control.controlHeight)) > 0) || (control.dataType == 'INTEGER' && (Number(control.controlHeight)) > 0)
								|| (control.udF_Feature1 && control.udF_Feature1.includes('Radio Button')) )?'fit-content':'65px')  /// Railway line condition added by OnkarE on 08-June-2021, Chart added by OnkarE on 09-June-2021		//Radio button added by BhagyashriB on 13-Oct-2021
							}
					}
					else
					{
							return {
							'display': 'none'
						}
					}
				}
				
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in checkUDFVisibility: "+error);
			} finally {}
		}

		addHeightStyle(control) {
			try{
			if (control.controlHeight && control.controlHeight > 0) {
				return {
					'grid-row': 'none'
				}
			}
			}catch(e){
				console.log("Error in addHeightStyle :", e)
			}
		}

		ReadCustomTabDetails(templateID: number, subtemplateID: string) {
			try {
				const that = this;
				this.CustomTabs.columns = [];
				this.CustomTabs.data = [];
				this.tableRow = []; //for clearing table 
				let dtEditRightsCustom:any=[];
				
				// control1: Number;
				//this.loader = true; //added by devesh for loader changes
				if(this.template.basket_Size == "N"){
					this.api.getBasketEntryColumnDetails(this.template.template_Id).subscribe(
						(response: any) => {
							if (response.status === Status.Success) { 
								console.log("getBasketEntryColumnDetails:: ", response.response);
								const dropdownNames = Object.keys(that.defaultDropdowns);
								const searchArrayNames = Object.keys(that.defaultSearchArrays);
								var tempArr = [];
								for (let i = 0; i < response.response.length; i++) {
									var obj = {displayName : "", dataType: "", sourcingLink:"", fieldName: "",defaultValue:"",visibility:"",readOnly:"",mandatory:"",formulae:"",sequenceNo:"",tildaSepFormulaColumns:"",udF_Feature1:"",currentValue:"",id:""};
									obj.displayName =  response.response[i].columnHeader;
									obj.dataType =  response.response[i].dataType;
									obj.sourcingLink =  response.response[i].sourcingLink;
									obj.fieldName =  response.response[i].columnName;
									obj.defaultValue =  response.response[i].defaultValue;
									obj.visibility =  response.response[i].visibleYN == true ? "Y" : "N";
									obj.readOnly =  response.response[i].readOnlyYN == true ? "Y" : "N";
									obj.mandatory =  response.response[i].mandatory == true ? "Y" : "N";
									obj.formulae =  response.response[i].formulae;
									obj.sequenceNo =  response.response[i].sequenceNo;
									obj.tildaSepFormulaColumns =  response.response[i].tildaSepFormulaColumns;
									obj.udF_Feature1 = "";
									obj.currentValue =  response.response[i].defaultValue;
									obj.id = response.response[i].id;								
									tempArr.push(obj);
								}
								
								tempArr.forEach((c: any) => {
									if ((c.dataType === 'AMOUNT' || c.dataType === 'NUMBER') && !(this.isNullOrUndefined(c.defaultValue) || c.defaultValue == "")) { //added by devesh for default value formatting as per udf format
										c.defaultValue = this.formatKLMB(c.defaultValue, c.udF_Format);
									}
									if(c.dataType === 'COMMON DATA') {
										if (c.sourcingLink.length) {
											that.dropdowns[c.sourcingLink] = this.common_data.filter((control: any) => control.type === c.sourcingLink);
											that.searchArrays[c.sourcingLink] = this.common_data.filter((control: any) => control.type === c.sourcingLink);									
											this.fillControlCombo(c, this.dropdowns[c.sourcingLink]);
										} else {
											that.dropdowns[c.fieldName] = [];
											that.searchArrays[c.fieldName] = [];
										}
									}
									c.value = c.defaultValue;
									if (dropdownNames.includes(c.dataType)) {
										that.dropdowns[c.fieldName] = that.defaultDropdowns[c.dataType];
										if(c.udF_Feature1.includes('Multiselect Dropdown') && c.defaultValue == ""){
											c.value = "";
										}
										else
											c.value = c.value || c.defaultValue || c.currentValue || that.dropdowns[c.fieldName][0].code;
									}
									if (searchArrayNames.includes(c.dataType)) {
										that.searchArrays[c.fieldName] = that.defaultSearchArrays[c.dataType];
										if(c.udF_Feature1.includes('Multiselect Dropdown') && c.defaultValue == ""){
											c.value = "";
										}
										else
											c.value = c.value || c.defaultValue || c.currentValue;
									}
									//c.rowNo = 0;  //commented as no need
									switch(this.sUCPMode.toUpperCase())
									{
										case "UCPQEN":
										case "UCPWFL":
										case "FEDREJ": case "FEDCHK": case "UCPUNW": case "UCPREV": case "UNWFUL": case "PRDCHK":
											//do nothing for these, let readonly & visiblity be same as received from service side
											break;
										default: //for other cases where edit rights are needed
											if(this.oEditrightsCustom.length>0)
											{
												dtEditRightsCustom=this.oEditrightsCustom.filter(x=>x.eR_UDF_Field==c.fieldName);
												if (dtEditRightsCustom.length>0)
												{
													if (dtEditRightsCustom[0].eR_Visible_YN.toString().substr(1, 1) == "Y") 
														{
															c.readOnly = 'Y';
														}
													else
														{
															c.readOnly = 'N';
														}
													
													if (dtEditRightsCustom[0].eR_Visible_YN.toString().substr(0, 1).toString() == "Y")
														{
															c.visibility = 'Y';
														}
													else
													{
														c.visibility = 'N';
													}											                                          
												}
											}								
										break;
									}
									
								});

								that.CustomTabs.columns = tempArr.filter(x=>x.visibility=="Y").map(e => e.displayName);
								that.CustomTabs.data = tempArr;
								this.parseBasketArrayForrmulae(tempArr);
								localStorage.setItem('dtcustomTab'+String(this.template.template_Id), JSON.stringify(that.CustomTabs.data));
								console.log("Basket Array Fields are : ", tempArr, that.CustomTabs);
								that.setcustomtab();
							}
						});
				}
				else {
					this.api.ReadCustomTabDetails(templateID, subtemplateID, this.sUCPMode).then(
						(res: any[]) => {
							console.log(res);
							if (res) {
								const dropdownNames = Object.keys(that.defaultDropdowns);
								const searchArrayNames = Object.keys(that.defaultSearchArrays);
								res.forEach((c: any) => {
									if ((c.dataType === 'AMOUNT' || c.dataType === 'NUMBER') && !(this.isNullOrUndefined(c.defaultValue) || c.defaultValue == "")) { //added by devesh for default value formatting as per udf format
										c.defaultValue = this.formatKLMB(c.defaultValue, c.udF_Format);
									}
									if(c.dataType === 'COMMON DATA') {
										if (c.sourcingLink.length) {
											that.dropdowns[c.sourcingLink] = this.common_data.filter((control: any) => control.type === c.sourcingLink);
											that.searchArrays[c.sourcingLink] = this.common_data.filter((control: any) => control.type === c.sourcingLink);									
											this.fillControlCombo(c, this.dropdowns[c.sourcingLink]);
										} else {
											that.dropdowns[c.fieldName] = [];
											that.searchArrays[c.fieldName] = [];
										}
									}
									c.value = c.defaultValue;
									if (dropdownNames.includes(c.dataType)) {
										that.dropdowns[c.fieldName] = that.defaultDropdowns[c.dataType];
										if(c.udF_Feature1.includes('Multiselect Dropdown') && c.defaultValue == ""){
											c.value = "";
										}
										else
											c.value = c.value || c.defaultValue || c.currentValue || that.dropdowns[c.fieldName][0].code;
									}
									if (searchArrayNames.includes(c.dataType)) {
										that.searchArrays[c.fieldName] = that.defaultSearchArrays[c.dataType];
										if(c.udF_Feature1.includes('Multiselect Dropdown') && c.defaultValue == ""){
											c.value = "";
										}
										else
											c.value = c.value || c.defaultValue || c.currentValue;
									}
									//c.rowNo = 0;  //commented as no need
									switch(this.sUCPMode.toUpperCase())
									{
										case "UCPQEN":
										case "UCPWFL":
										case "FEDREJ": case "FEDCHK": case "UCPUNW": case "UCPREV": case "UNWFUL": case "PRDCHK":
											//do nothing for these, let readonly & visiblity be same as received from service side
											break;
										default: //for other cases where edit rights are needed
											if(this.oEditrightsCustom.length>0)
											{
												dtEditRightsCustom=this.oEditrightsCustom.filter(x=>x.eR_UDF_Field==c.fieldName);
												if (dtEditRightsCustom.length>0)
												{
													if (dtEditRightsCustom[0].eR_Visible_YN.toString().substr(1, 1) == "Y") 
														{
															c.readOnly = 'Y';
														}
													else
														{
															c.readOnly = 'N';
														}
													
													if (dtEditRightsCustom[0].eR_Visible_YN.toString().substr(0, 1).toString() == "Y")
														{
															c.visibility = 'Y';
														}
													else
													{
														c.visibility = 'N';
													}											                                          
												}
											}								
										break;
									}
									
								});
		
								that.CustomTabs.columns = res.filter(x=>x.visibility=="Y").map(e => e.displayName);
								that.CustomTabs.data = res;
								localStorage.setItem('dtcustomTab'+String(this.template.template_Id), JSON.stringify(that.CustomTabs.data));
								//that.IncTableRowCount();
								that.setcustomtab();
								//this.loader = false; //added by devesh for loader changes
							}
							console.log('Custom Tab data..');
							console.log(this.CustomTabs.data, this.CustomTabs.columns);
							//this.loader = false;
						}
					);
				}


			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in ReadCustomTabDetails: "+error);
			} finally {}
		}
		GetCustGridDetails(templateID: number) {
			try {
				const that = this;
				this.CustomerGrid.columns = [];
				this.CustomerGrid.data = [];
				console.log("Requesting static customer grid details for template id:  ", templateID);
				this.api.GetCustGridDetails(templateID, "Grid").then(
					(response) => {
						console.log('Static Customer Grid Data is.....', response.response);
						this.custGridStaticData = response.response;
					}
				);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in GetCustGridDetails: "+error);
			} finally {}
		}
		GetCustomerGridColumnDetails(templateID: number) {
			try {
				
				const that = this;
				this.CustomerGrid.columns = [];
				this.CustomerGrid.data = [];
				console.log("Requesting customer grid details for template id and sUCPMode is:  ", templateID, this.sUCPMode);
				let blnreadonly=true;
				if(this.sUCPMode.toString().toUpperCase() == 'DLSAMD' || this.sUCPMode.toString().toUpperCase() =='UCPORD' || this.sUCPMode.toString().toUpperCase() =='UCPQEN' || this.sUCPMode.toString().toUpperCase() =='DLSADD') //As per .net logic
				{
				this.btnPoolreadonly=false;
				}
				else
				{
				this.btnPoolreadonly=true;
				}
				switch(this.sUCPMode.toString().toUpperCase())
				{
					case "UCPQEN":
					case "UCPPRC":	
					case "DLSAMD":
					case "DLSADD":
					case "RECADD":
					case "UCPFED":
					case "UCPUNW":
					case "UCPREV":
					case "UNWAMD":
					case "UNWFUL":
						blnreadonly=false;
						break;
					case "UCPWFL":
						blnreadonly=true;
						break;
					default:
						blnreadonly=true;
						break;
				}
				this.api.GetCustomerGridColumnDetails(templateID).then(
					(response) => {
						const res = response.response;
						console.log(res);
						console.log('Customer Grid data..', res);
						var dropdownNames = Object.keys(this.defaultDropdowns);
						var searchArrayNames = Object.keys(this.defaultSearchArrays);
						if (res) {
							res.forEach((c: any) => {
								c.value = c.defaultValue;
								blnreadonly ? c.readOnly='Y': c.readOnly='N';

								//Added by Devesh on 26-Jul-2021
								if (dropdownNames.includes(c.type.toUpperCase())) {
									this.dropdowns[c.columnName] = that.defaultDropdowns[c.type.toUpperCase()];
									c.value = c.value || c.defaultValue || c.currentValue || that.dropdowns[c.columnName][0].code;
								}
								if (searchArrayNames.includes(c.type.toUpperCase())) {
									this.searchArrays[c.columnName] = that.defaultSearchArrays[c.type.toUpperCase()];
									c.value = c.value || c.defaultValue || c.currentValue;
								}							
								});
							// if (this.sUCPMode === 'UCPWFL') {
							// 	res.forEach(element => {
							// 		element.readOnly = 'Y';
							// 	});
							// }
							that.custGridColumns = res.map(e => e.columnName);
							that.CustomerGrid.columns = res.map(e => e.displayName);
							that.CustomerGrid.data = res
							that.custid_index=that.CustomerGrid.columns.findIndex(x=>x=="Customer Id");
							//.filter(ele=> ele.visible === 'Y'); 
							// Added filter condition by OnkarE on 17-Feb-2021 - to display cust grid columns whose visible option is 'Y' -- to avoid unnecesary gaps in displaying colunns in cust grid td 
							localStorage.setItem('dtcustomerGrid'+String(this.template.template_Id), JSON.stringify(that.CustomerGrid.data));
							res.filter((c: any) => c.type.toUpperCase() === 'COMMON DATA').forEach((control: any) => {
								/// Code to load data in customer grid columns for COMMON DATA type - by OnkarE on 05-Jan-2021
								if (control.sourcingLink.length) {
									that.dropdowns[control.sourcingLink] = this.common_data.filter((c: any) => c.type === control.sourcingLink);
									that.searchArrays[control.sourcingLink] = this.common_data.filter((c: any) => c.type === control.sourcingLink);
								} else {
									that.dropdowns[control.columnName] = [];
									that.searchArrays[control.columnName] = [];
								}
							});
							
							//commented by Devesh on 26-Jul-2021 as handled in above foreach loop	
							// if (res.find(({
							// 		columnName
							// 	}) => columnName === 'clmnCustomerName')) {
							// 	that.searchArrays["clmnCustomerName"] = that.customersList
							// }
							console.log("Dropdowns searchArrays in customer grid details........", that.searchArrays);
							//that.IncCustGridTableRowCount();

							that.changeHedgeType();
						}
					}
				);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in GetCustomerGridColumnDetails: "+error);
			} finally {}
		}

		async GetIntersectionMappingDetails(templateID: number) {
			try {

				//Intersection fetching SwatiP
				this.api.GetIntersectionMappingDetails(templateID).subscribe(
					(response: any) => {

						if (response.status === Status.Success) {
							console.log("Intersection data");
							console.log(response);
							this.intersections = response.response;
							sessionStorage.removeItem("oIntersectionDetails");
							sessionStorage.setItem("oIntersectionDetails",JSON.stringify(this.intersections));
							//this.InvokeIntersectionFieldMapping("", "", -1); //removed by Devesh as no need to keep it here
						}
						else {
							//debugger;
							//this.loader = false; no need removed by Devesh on 11-Jun-2021
							console.log("Failed to load intersection data: ",response.response);
						}
					});
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in GetIntersectionMappingDetails: "+error);
				//this.loader = false;
			} finally {}
		}
		customDataTrack(_:Number, index: any): any {
			try{
				// console.log(_, index);
			return index;
			}catch(e){
				console.log("Error in customDataTrack :", e)
			}
			
		}

		customerGridTrack(_:Number,  index: any): any {
			try{
			// console.log(_, index);
			return index;
		}catch(e){
			console.log("Error in customerGridTrack :", e)
		}
		}

		stringifyData(data: any) {
			try{
			return JSON.stringify(data);
		}catch(e){
			console.log("Error in stringifyData :", e)
		}
		}

		getBasketEntryColumnDetails() {
			try{
			this.api.getBasketEntryColumnDetails(this.template.template_Id).subscribe(
				(response: any) => {
					if (response.status === Status.Success) { 
						console.log("getBasketEntryColumnDetails:: ", response.respone);
					}
				});
			}catch(e){
				console.log("Error in getBasketEntryColumnDetails :", e)
			}
		}

		GetBasketArrayFunctionDetails() {
			try{

			
			this.api.GetBasketArrayFunctionDetails(this.template.template_Id).subscribe(
				(response: any) => {
					if (response.status === Status.Success) { 
						console.log("GetBasketArrayFunctionDetails:: ", response.respone);
					}
				});
			}catch(e){
				console.log("Error in GetBasketArrayFunctionDetails :", e)
			}
		}

		IncTableRowCount() {
			try {
				const that = this;
				console.log("Basket size", this.template.basket_Size);
				let maxcustom_rowcount = 0;
				(this.template.basket_Size == 7 ? maxcustom_rowcount = 7 : maxcustom_rowcount = 1000); //7 for custom tab and more than taht for basket array
				console.log("Max row count: ", maxcustom_rowcount);
				if (this.custTabFlag === true) {
					console.log("Done!!!", this.tableRow);
					this.custTabFlag = false;
				} else {
					console.log("Adding new row in custom tab... ");
					// this.ctCtr = 0;
					this.CustomTabs.data.forEach(c => {
						if (that.ddlTypes.includes(c.dataType) && !Object.keys(that.dropdowns).includes(c.fieldName)) {
							that.dropdowns[c.fieldName] = that.defaultDropdowns[c.dataType];
							that.searchArrays[c.fieldName] = that.defaultSearchArrays[c.dataType];
						}
						// c.rowNo = this.ctCtr;
					});

					// this.ctCtr += 1;
					// console.log("After adding Row No:: ", this.ctCtr)
					if (this.tableRow.length < maxcustom_rowcount) {
						/// create memory, add class using 'new' and pass that to next
						/// create struct
						this.tableRow.push(JSON.parse(localStorage.getItem('dtcustomTab'+String(this.template.template_Id)))); //to add custom tab default values received from service side
					} else {
						console.log('Max Limit');
						this.ErrorMessage = 'Max Limit Reached';
					}

					console.log("Table Rows are::::: ", this.tableRow);



					for (let i = 0; i < this.CustomTabs.data.length; i++) {

						this.setCustomTabIntersection(this.CustomTabs.data[i].fieldName, i, this.tableRow.length - 1) //taken tableRow.length since length increase on add button
						this.invokeCustomTabFunctions(this.CustomTabs.data[i].fieldName, this.tableRow.length - 1); //to trigger custom tab functions after rows are added
						this.InvokeUnexecutedFunctions("Custom",this.CustomTabs.data[i].fieldName,this.tableRow.length-1); //to execute function having only udf fields as input and target as custom tab
					}

					// for(const control of this.controls) //added because if udfmetdata fields have customtab intersection & default values is to be populated through intersection
					// {
					//   this.InvokeCustomTabUDFMETIntersection(control);
					// }
					this.generateCustomTabXML();
					//this.loader = false;
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in IncTableRowCount: "+error);
			} finally {}
		}

		setCustomTabIntersection(callingFieldCustomTab: string, col_index: number, row_index: number) { ///for intersection from custom tab to udf field
			try {
				if (row_index > -1) {

					const res = this.controls.filter((c: any) => String(c.customTabReference).toUpperCase().trim() == "IN(" + callingFieldCustomTab.toUpperCase() + ":" + (row_index + 1) + ")");

					if (res.length > 0) {
						console.log("Custom tab to udf intersection", res);
						console.log("value of custom tab passed for intersection", this.tableRow[row_index][col_index].value);
						res.forEach(async element => { //taken for-each as there can be more than one element with same customtab intersection at a particular row index
							element.value = this.tableRow[row_index][col_index].value;
							await this.udfFieldValueChange(element); //for trigerring any functions on its value change
						});
					}
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in setCustomTabIntersection: "+error);
			} finally {}
		}

		InvokeCustomTabUDFMETIntersection(udfcontrol: any) { //for intersection from  udf field to custom tab
			try {
				if (String(udfcontrol.customTabReference).toUpperCase().includes('OUT(')) {
					console.log("before spliting udfcontrol", udfcontrol);
					let splitcust = String(udfcontrol.customTabReference).replace('OUT(', '').replace(')', '').split(':');
					if (splitcust.length > 1) {
						for (let i = 0; i < this.CustomTabs.data.length; i++) {
							if (String(this.CustomTabs.data[i].fieldName).toUpperCase() == splitcust[0].toUpperCase()) {
								if (splitcust[1].toUpperCase().trim() == "ALL") {
									this.tableRow.forEach(row => {
										row[i].value = udfcontrol.value; //updating each row in all case
										//customtab field value change to be called here later
									});

								} else {
									if (this.tableRow.length + 1 > Number(splitcust[1])) {
										this.tableRow[Number(splitcust[1]) - 1][i].value = udfcontrol.value;
										this.customTabFieldValueChange({
											field_element: this.tableRow[Number(splitcust[1]) - 1][i],
											index: Number(splitcust[1]) - 1
										}); //to trigger any functions which are mapped for that particular field after intersection
									}
								}
								console.log("custom tab values after intersection", this.tableRow);
							}
						}
						this.generateCustomTabXML();
					}
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in InvokeCustomTabUDFMETIntersection: "+error);
			} finally {}
		}

		async invokeCustomTabFunctions(callingFieldCustomTab: string, row_index: number) {
			try {
				// console.log("Inside invokecustomTabFuntions", this.customTabFuntions);
				let functionsOnChangedControl = [];
				let spsOnChangedControl = [];
				let formulasOnChangedControl = [];
				let tempFormulaArr = [];
				if(this.template.basket_Size == "N"){
					this.CustomTabs.data.forEach(element => {
						if(element.tildaSepFormulaColumns.includes(callingFieldCustomTab)){
							tempFormulaArr.push(element);
						}
					});
					this.executeBasketArrayFormula(tempFormulaArr, row_index)
				}
				else {
					if (this.customTabFuntions.length > 0) { //added length check to avoid errors if no functions are mapped 

						if (row_index > -1) { ///index >-1 means calling field is from custom tab
		
							if (this.customTabFuntions.find(a => a.includes(callingFieldCustomTab)) || this.customTabFuntions.find(a => a.includes(callingFieldCustomTab.toUpperCase())) ) { //added to upper for formula trigeering  //|| this.functions_all.filter(e=> e.functionMode === 'Custom').length > 0
		
								this.ctCtr = row_index; //to assign values at the specific row in custom tab if invoked from inctablerow
								console.log("Custom tab calling field for funciton exec:", callingFieldCustomTab, " & row index:", row_index);
		
								if (this.functions_all) {
									functionsOnChangedControl = this.functions_all.filter((f: any) => f.ufD_CSV_Input.split('~').includes("BA." + callingFieldCustomTab) || f.ufD_CSV_Input.split('~').includes("BA." + callingFieldCustomTab.toUpperCase())); //added BA. inside includes because i/p csv can contain ~UDF. which will not be splitted by ~BA.  //to upper added only for formula because csv i/p is in uppercase
								}
								
								// if (this.functions['SP']) {
								// 	spsOnChangedControl = this.functions['SP'].filter((f: any) => f.ufD_CSV_Input.split('~').includes("BA." + callingFieldCustomTab));
								// }
								// if (this.functions['FORMULA']) {
								// 	formulasOnChangedControl = this.functions['FORMULA'].filter((f: any) => f.ufD_CSV_Input.split('~').includes("BA." + callingFieldCustomTab.toUpperCase())); //to upper added only for formula because csv i/p is in uppercase
								// }
								console.log(functionsOnChangedControl, spsOnChangedControl, formulasOnChangedControl, callingFieldCustomTab);
								if (functionsOnChangedControl.length) {
									//this.loaderService.display(true);
									await this.executeFunction(functionsOnChangedControl, "");
									//this.loaderService.display(false);
								}
		
								// let functionFromUDF = this.functions_all.filter(e=> e.functionMode == 'Custom' && e.ufD_Target_Field == callingFieldCustomTab);  /// added to trigger functions if input csv contains only udf fields and target field is custom
								// if (functionFromUDF.length) {
								// 	//this.loaderService.display(true);
								// 	await this.executeFunction(functionFromUDF, "");
								// 	//this.loaderService.display(false);
								// }
								// if (spsOnChangedControl.length) {
								// 	this.executeFunction(spsOnChangedControl, 'SP');
								// }
								// if (formulasOnChangedControl.length) {
								// 	this.executeFormula(formulasOnChangedControl);
								// }
							}
						} else { //calling field from udf,invoke custom tab funcs which include a udf value as input which are triggered on its respective value change
							//debugger;
							if (this.functionParameters.includes(callingFieldCustomTab) || this.functionParameters.includes(String(callingFieldCustomTab).toUpperCase())) { /////////done rough coding to be checked and done later as on 7-Dec-2020
								//done filtering for custom because calling field being in udf was not present in customTabFuntions array
								if (this.functions_all) {
									functionsOnChangedControl = this.functions_all.filter(f => f.functionMode == 'Custom').filter((f: any) => f.ufD_CSV_Input.split('~').includes("UDF." + callingFieldCustomTab) || f.ufD_CSV_Input.split('~').includes(callingFieldCustomTab.toUpperCase())); ///to upper added only for formula because csv i/p is in uppercase & removed UDF. here because csv input field doesnt contain udf. for metadata fields only in formula,its present in functions though
								}
		
								// if (this.functions['SP']) {
								// 	spsOnChangedControl = this.functions['SP'].filter(f => f.functionMode == 'Custom').filter((f: any) => f.ufD_CSV_Input.split('~').includes("UDF." + callingFieldCustomTab));
								// }
		
								// if (this.functions['FORMULA']) {
								// 	formulasOnChangedControl = this.functions['FORMULA'].filter(f => f.functionMode == 'Custom').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingFieldCustomTab.toUpperCase())); //to upper added only for formula because csv i/p is in uppercase & removed UDF. here because csv input field doesnt contain udf. for metadata fields only in formula,its present in functions though
								// }
								console.log(functionsOnChangedControl, spsOnChangedControl, formulasOnChangedControl, callingFieldCustomTab);
		
								// if (formulasOnChangedControl.length) {
								// 	for (let i = 0; i < this.tableRow.length; i++) { ///kept formula separate because formula exec remains in sync with ctcr as service is not called and execution is faster
								// 		this.ctCtr = i;
								// 		this.executeFormula(formulasOnChangedControl);
								// 	}
								// }
		
								if (functionsOnChangedControl.length > 0) { //not to trigger for loop unnecessarily if no functions/formula are triggered
									//this.loaderService.display(true);
									for (let i = 0; i < this.tableRow.length; i++) { //for loop for triggering func for every row
										this.customtab_all_triggered = true; //setting boolean to true
										if (functionsOnChangedControl.length) {
											await this.executeFunction(functionsOnChangedControl, "", i);
										}
										// if (spsOnChangedControl.length) {
										// 	this.executeFunction(spsOnChangedControl, 'SP', i);
										// }
									} ///
									//this.loaderService.display(false);
								}
							}
						}
		
					} ///
				}


			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in invokeCustomTabFunctions: "+error);
			} finally {}


		}
		async InvokeUnexecutedFunctions(Type:string,callingField:string,row_index:number){
			try 
			{
				let functionexe=[];  
				switch (Type.toUpperCase()) {
					case "CUSTOM":
						this.ctCtr = row_index; //to assign values at the specific row in custom tab if invoked from inctablerow
						let functionFromUDF = this.functions_all.filter(e=> e.functionMode == 'Custom' && e.ufD_Target_Field == callingField);  /// added to trigger functions if input csv contains only udf fields and target field is custom					
						//functionFromUDF=functionFromUDF.filter(item => !this.customTabFuntions.find(i => i === i.ufD_CSV_Input.split('~').includes("BA." + callingFieldCustomTab) || f.ufD_CSV_Input.split('~').includes("BA." + callingFieldCustomTab.toUpperCase())))
						//functionFromUDF=functionFromUDF.filter(f=> !(this.customTabFuntions.includes(f.ufD_CSV_Input.split('~').replace("UDF.",""))|| this.customTabFuntions.includes(f.ufD_CSV_Input.split('~').replace("UDF.","").toUpperCase())));
						if (functionFromUDF.length) 
						{	
							for(const func of functionFromUDF)
							{
							if(this.customTabFuntions.filter(f=>func.ufD_CSV_Input.includes("BA."+f) || func.ufD_CSV_Input.includes(String("BA."+f).toUpperCase())).length==0)
							{
								functionexe.push(func); //to push only those functions whose inputs are not at all from custom tab
							}
							}							
							if(functionexe.length>0)
							{
								await this.executeFunction(functionexe, "");							
							}
						}
						break;
					case "GRID":
						this.cgrowindex=row_index;
						let Clientfunctions=[]; 
						let Marketfunctions=[]; 
						for (const element of this.custGridTableRow[row_index]){
							if (element.columnName == "clmnCustomerLeg" && element.value == 'Customer') { // to check which leg functions to be executed
								Clientfunctions= this.functions_all.filter(f => f.functionMode == 'Client' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK').filter((f: any) => f.ufD_Target_Field==callingField);
								if (Clientfunctions.length) {								
									Clientfunctions.forEach(func => {
										if(this.custGridColumns.filter(f=>func.ufD_CSV_Input.includes(f) || func.ufD_CSV_Input.includes(String(f).toUpperCase())).length==0) //added uppercase for formula
										{
										functionexe.push(func); //to push only those functions whose inputs are not at all from custgrid
										}
									});
									if(functionexe.length>0){
									await this.executeFunction(functionexe, "");
									break;
									}
								}
							}
							else if(element.columnName == "clmnCustomerLeg" && element.value == 'CounterParty'){
								Marketfunctions= this.functions_all.filter(f => f.functionMode == 'Market' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK').filter((f: any) => f.ufD_Target_Field==callingField);
								if (Marketfunctions.length) {								
									Marketfunctions.forEach(func => {
										if(this.custGridColumns.filter(f=>func.ufD_CSV_Input.includes(f)|| func.ufD_CSV_Input.includes(String(f).toUpperCase())).length==0) //added upper case for formula
										{
										functionexe.push(func); //to push only those functions whose inputs are not at all from custgrid
										}
									});
									if(functionexe.length>0){
									await this.executeFunction(functionexe, "");
									break;
									}
								}
							}
						}	
						break;
					default:
						break;
				}
			} 
			catch (error) 
			{
			}
		}

		//Added by SwatiP for customer grid function calling
		async invokeCustomerGridFunctions(callingField: string, row_index: number) {
			try {

				// console.log("Inside invokeCustomerGridFunctions", this.functionParameters);
				let ClientfunctionsOnChangedControl = [];
				let MarketfunctionsOnChangedControl = [];
				let ClientspsOnChangedControl = [];
				let MarketspsOnChangedControl = [];
				let ClientformulasOnChangedControl = [];
				let MarketformulasOnChangedControl = [];
				if (this.custGridTableRow.length == 0)
					return;
				if (this.functionParameters.length > 0) { //added length check to avoid errors if no functions are mapped 

					if (row_index > -1) { ///index >-1 means calling field is from customer grid

						if (this.functionParameters.find(a => a.includes(callingField)) || this.functionParameters.find(a => a.includes(callingField.toUpperCase()))) { //added to upper for formula trigeering

							this.cgrowindex = row_index; //to assign values at the specific row in custom tab if invoked from inctablerow
							// console.log("Customer tab calling field for funciton exec:", callingField, " & row index:", row_index);



							if (this.functions_all) {
								ClientfunctionsOnChangedControl = this.functions_all.filter(f => f.functionMode == 'Client' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingField) || f.ufD_CSV_Input.split('~').includes(callingField.toUpperCase()));
								MarketfunctionsOnChangedControl = this.functions_all.filter(f => f.functionMode == 'Market' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingField) || f.ufD_CSV_Input.split('~').includes(callingField.toUpperCase()));
							}
							console.log("Client Level Functions: ", row_index,  ClientfunctionsOnChangedControl, this.functions_all.filter(f => f.functionMode == 'Client'))
							// if (this.functions['SP']) {
							// 	ClientspsOnChangedControl = this.functions['SP'].filter(f => f.functionMode == 'Client').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingField));
							// }
							// if (this.functions['SP']) {
							// 	MarketspsOnChangedControl = this.functions['SP'].filter(f => f.functionMode == 'Market').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingField));
							// }
							// if (this.functions['FORMULA']) {
							// 	ClientformulasOnChangedControl = this.functions['FORMULA'].filter(f => f.functionMode == 'Client').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingField.toUpperCase())); //to upper added only for formula because csv i/p is in uppercase
							// }
							// if (this.functions['FORMULA']) {
							// 	MarketformulasOnChangedControl = this.functions['FORMULA'].filter(f => f.functionMode == 'Market').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingField.toUpperCase())); //to upper added only for formula because csv i/p is in uppercase
							// }
							//console.log(functionsOnChangedControl, spsOnChangedControl, formulasOnChangedControl, callingField);
							//this.custGridTableRow[row_index].forEach(element => {
								//this.loaderService.display(true);
							for (const element of this.custGridTableRow[row_index]){
								if (element.columnName == "clmnCustomerLeg" && element.value == 'Customer') { // to check which leg functions to be executed
									if (ClientfunctionsOnChangedControl.length) {
										await this.executeFunction(ClientfunctionsOnChangedControl, "");
									}
									// if (ClientspsOnChangedControl.length) {
									// 	this.executeFunction(ClientspsOnChangedControl, 'SP');
									// }
									// if (ClientformulasOnChangedControl.length) {
									// 	this.executeFormula(ClientformulasOnChangedControl);
									// }
								} else if (element.columnName == "clmnCustomerLeg" && element.value == 'CounterParty') {
									if (MarketfunctionsOnChangedControl.length) {
										await this.executeFunction(MarketfunctionsOnChangedControl, "");
									}
									// if (MarketspsOnChangedControl.length) {
									// 	this.executeFunction(MarketspsOnChangedControl, 'SP');
									// }
									// if (MarketformulasOnChangedControl.length) {
									// 	this.executeFormula(MarketformulasOnChangedControl);
									// }
								}
								//this.loaderService.display(false);
							}
							//});//

						}
					} else { //calling field from udf,invoke funcs which include a udf value as input which are triggered on its respective value change
						//debugger;
						if (this.functionParameters.includes(callingField) || this.functionParameters.includes(String(callingField).toUpperCase())) {
							if (this.functions['FUNCTION']) {
								ClientfunctionsOnChangedControl = this.functions_all.filter(f => f.functionMode == 'Client' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingField) || f.ufD_CSV_Input.split('~').includes(callingField.toUpperCase()));
								MarketfunctionsOnChangedControl = this.functions_all.filter(f => f.functionMode == 'Market' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingField) || f.ufD_CSV_Input.split('~').includes(callingField.toUpperCase()));
							}

							// if (this.functions['SP']) {
							// 	ClientspsOnChangedControl = this.functions['SP'].filter(f => f.functionMode == 'Client').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingField));
							// 	MarketspsOnChangedControl = this.functions['SP'].filter(f => f.functionMode == 'Market').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingField));

							// }

							// if (this.functions['FORMULA']) {
							// 	ClientformulasOnChangedControl = this.functions['FORMULA'].filter(f => f.functionMode == 'Client').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingField.toUpperCase())); //to upper added only for formula because csv i/p is in uppercase
							// 	MarketformulasOnChangedControl = this.functions['FORMULA'].filter(f => f.functionMode == 'Market').filter((f: any) => f.ufD_CSV_Input.split('~').includes(callingField.toUpperCase())); //to upper added only for formula because csv i/p is in uppercase
							// }
							// console.log(ClientfunctionsOnChangedControl,MarketfunctionsOnChangedControl, spsOnChangedControl, formulasOnChangedControl, callingField);


							for (let i = 0; i < this.custGridTableRow.length; i++) { //for loop for triggering func for every row
								this.customergrid_all_triggered = true; //setting boolean to true
								this.cgrowindex = i;
								this.custGridTableRow[i].forEach(element => {
									//this.loaderService.display(true);
									if (element.columnName == "clmnCustomerLeg" && element.value == 'Customer') {

										// if(this.custGridTableRow[i][0].columnName =="clmnCustomerLeg" && this.custGridTableRow[i][0].value=='Customer'){

										if (ClientfunctionsOnChangedControl.length) {
											this.executeFunction(ClientfunctionsOnChangedControl, "", i);
										}

										// if (ClientspsOnChangedControl.length) {
										// 	this.executeFunction(ClientspsOnChangedControl, 'SP', i);
										// }
										// if (ClientformulasOnChangedControl.length) {
										// 	this.executeFormula(ClientformulasOnChangedControl);
										// }

									} else if (element.columnName == "clmnCustomerLeg" && element.value == 'CounterParty') {
										//else if(this.custGridTableRow[i][0].columnName =="clmnCustomerLeg" && this.custGridTableRow[i][0].value=='CounterParty'){
										if (MarketfunctionsOnChangedControl.length) {
											this.executeFunction(MarketfunctionsOnChangedControl, "",i);
										}
										// if (MarketspsOnChangedControl.length) {
										// 	this.executeFunction(MarketspsOnChangedControl, 'SP');
										// }
										// if (MarketformulasOnChangedControl.length) {
										// 	this.executeFormula(MarketformulasOnChangedControl);
										// }
									}
									//this.loaderService.display(false);
								});


								// delay(2000); //wait for 200ms to execute all functions to keep value of cgrowindex in sync, otherwise it will get incremented in for loop before o/p is received of execute
							} ///

						}
					}

				} ///
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in invokeCustomerGridFunctions: "+error);
			} finally {}

		}

		HandleAnotherUCP(control) {
			try {
				console.log("In Deal entry from field template: ", control);
				var res1, res2, url;
				if (control.sourcingLink) {
					res1 = this.controls.filter((c: any) => c.fieldName === control.sourcingLink);
					res2 = res1[0].value.split("~");
					console.log(res1, res2);
					if(res2[0].toString().toUpperCase() == 'QEN'){
						url = location.href + "?&WorkflowMode=UCPQEN&Mode=4.5&TemplateCode=" + res2[1] + "&AnotherUCP=Y&TokenID=''&Master_Popup=POPUP&UserGroup=" + this.userGroup + "&LoginID="+this.Login_Id;
					}
					else if(res2[0].toString().toUpperCase() == 'WFL'){
						url = location.href + "?WorkflowMode=UCPWFL&DealNum=D:&NoteMasterid=N:" + res2[1] + "&AnotherUCP=Y&TokenID=''&&ButtonID=7&&ButtonName==''&&ButtonCaption=''&&Master_Popup=POPUP&UserGroup=" + this.userGroup + "&LoginID="+this.Login_Id;
					}

					console.log("URL is:::::", url)
					window.open(url, "", "top=150,left=250,status=1,scrollbars=1,resizable=1,width=1300,height=800");
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in HandleAnotherUCP: "+error);
			} finally {}
		}

		//Added by SwatiP on 2-march-2021
		HandleHyperLink(control) {
			let functionsOnChangedControl = [];
			try {
				console.log("In Deal entry from field template(hyperlink): ", control);
				// if (control.sourcingLink) {
				functionsOnChangedControl = this.functions_all.filter((f: any) => f.ufD_Target_Field === control.fieldName);
				if (functionsOnChangedControl.length) {
					//this.loaderService.display(true);
					this.executeFunction(functionsOnChangedControl, "");
					//this.loaderService.display(false);
				}
				if (control.value != "") {
					if(control.value.includes(",")){
						var tempArr = control.value.split(",");
						window.open(tempArr[0], tempArr[1], "top=150,left=250,status=1,scrollbars=1,resizable=1,width=1300,height=800");
					}
					else 
						window.open(control.value, "", "top=150,left=250,status=1,scrollbars=1,resizable=1,width=1300,height=800");
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteE rrorLogs("Error in HandleHyperLink: "+error);
			} finally {}
		}
		//Added by SwatiP on 2-march-2021
		async InvokeButtonLinkedFunctions(btnid) {
			let functionsOnChangedControl = [];
			let spsOnChangedControl = [];
			let formulasOnChangedControl = [];
			let wcfservicesOnChangedControl = [];
			try {
				// if (control.fieldName){
				// 	btnid=control.fieldName;
				// }
				// else{
				// 	btnid=control.id;
				// }
				switch (btnid) {
					case 'btnDraft':
						if (this.functions_all) {
							functionsOnChangedControl = this.functions_all.filter((f: any) => f.event == 'Draft');
						}
						// if (this.functions['SP']) {
						// 	spsOnChangedControl = this.functions['SP'].filter((f: any) => f.event == 'Draft');
						// }
						// if (this.functions['FORMULA']) {
						// 	formulasOnChangedControl = this.functions['FORMULA'].filter((f: any) => f.event == 'Draft');
						// }
						// if (this.functions['WCF SERVICE']) {
						// 	//wcfservicesOnChangedControl = this.functions['WCF SERVICE'].filter((f: any) => f.event.toUpperCase().split("~").includes(control.sourcingLink.toUpperCase()))
						// 	wcfservicesOnChangedControl = this.functions['WCF SERVICE'].filter((f: any) => f.event == 'Draft');
						// }
						break;
					case 'btnSave':
						if (this.functions_all) {
							functionsOnChangedControl = this.functions_all.filter((f: any) => f.event == 'Save');
						}
						// if (this.functions['SP']) {
						// 	spsOnChangedControl = this.functions['SP'].filter((f: any) => f.event == 'Save');
						// }
						// if (this.functions['FORMULA']) {
						// 	formulasOnChangedControl = this.functions['FORMULA'].filter((f: any) => f.event == 'Save');
						// }
						// if (this.functions['WCF SERVICE']) {
						// 	//wcfservicesOnChangedControl = this.functions['WCF SERVICE'].filter((f: any) => f.event.toUpperCase().split("~").includes(control.sourcingLink.toUpperCase()))
						// 	wcfservicesOnChangedControl = this.functions['WCF SERVICE'].filter((f: any) => f.event == 'Save');
						// }
						break;
					case 'btnSimulation':
						break;
					case 'btnReprice':
						if (this.functions_all) {
							functionsOnChangedControl = this.functions_all.filter((f: any) => f.event == 'Reprice');
						}
						// if (this.functions['SP']) {
						// 	spsOnChangedControl = this.functions['SP'].filter((f: any) => f.event == 'Reprice');
						// }
						// if (this.functions['FORMULA']) {
						// 	formulasOnChangedControl = this.functions['FORMULA'].filter((f: any) => f.event == 'Reprice');
						// }
						// if (this.functions['WCF SERVICE']) {
						// 	//wcfservicesOnChangedControl = this.functions['WCF SERVICE'].filter((f: any) => f.event.toUpperCase().split("~").includes(control.sourcingLink.toUpperCase()))
						// 	wcfservicesOnChangedControl = this.functions['WCF SERVICE'].filter((f: any) => f.event == 'Reprice');
						// }
						break;
					default:
						if (this.functions_all) {
							functionsOnChangedControl = this.functions_all.filter((f: any) => f.event == btnid);
						}
						// if (this.functions['SP']) {
						// 	spsOnChangedControl = this.functions['SP'].filter((f: any) => f.event == btnid);
						// }
						// if (this.functions['FORMULA']) {
						// 	formulasOnChangedControl = this.functions['FORMULA'].filter((f: any) => f.event == btnid);
						// }
						// if (this.functions['WCF SERVICE']) {
						// 	//wcfservicesOnChangedControl = this.functions['WCF SERVICE'].filter((f: any) => f.event.toUpperCase().split("~").includes(control.sourcingLink.toUpperCase()))
						// 	wcfservicesOnChangedControl = this.functions['WCF SERVICE'].filter((f: any) => f.event == btnid);
						// }
						break;
				}
				if (functionsOnChangedControl.length) {
					//this.loaderService.display(true);
					await this.executeFunction(functionsOnChangedControl, "", null, btnid) //this.functions_all.filter((f: any) => f.event == 'Reprice')
					//this.loaderService.display(false);
					//this.executeFunction(functionsOnChangedControl, 'FUNCTION',null,btnid);
				}
				//    if (spsOnChangedControl.length) {
				// 		this.executeFunction(spsOnChangedControl, 'SP',null,btnid);
				//    }
				// 			if (formulasOnChangedControl.length) {
				//    this.executeFormula(formulasOnChangedControl,btnid);
				// 			}
				//    if (wcfservicesOnChangedControl.length) {
				// 		this.executeFunction(wcfservicesOnChangedControl, 'WCF SERVICE',null,btnid);
				//    }


			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in InvokeButtonLinkedFunctions: "+error);
			} finally {}
		}
		HandleGridData(control) {
			try {
				console.log("Grid event emitted in deal entry component.... ", control);
				this.controls.forEach(element => {
					if (element.fieldName === control.fieldName && element.displayName === control.displayName) {
						element.value = control.xmlVal
					}
				});
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in HandleGridData: "+error);
			} finally {}
		}

		async changeHedgeType() {
			try {
				if(this.selectedBookingModel != 'Product' && this.selectedBookingModel != 'RFQ' && this.selectedBookingModel != 'UDF'){
					if(this.CustomerGrid.columns && this.CustomerGrid.columns.length == 0) {
						this.GetCustomerGridColumnDetails(this.template.template_Id);
						this.GetCustGridDetails(this.template.template_Id);	
					}
				}
				this.custGridTableRow = [];
				this.IncCustGridTableRowCount();
				if ((this.selectedBookingModel === 'Pooling' || this.selectedBookingModel === 'Back to Back') && this.custGridTableRow.length < 2) {
					this.IncCustGridTableRowCount();
					console.log("Template data is::: ", this.template)
				}
				if (this.sUCPMode === 'UCPWFL' || this.sUCPMode == "DLSADD") {
					/// Added this to load customer grid data in wfl mode - by OnkarE on 18-Feb-2021
					// if (this.CustGridWFLRow && this.CustGridWFLRow.length > 0) {
					// 	for (let i = 0; i < this.custGridTableRow.length; i++) {
					// 		for (let j = 0; j < this.custGridTableRow[i].length; j++) {
					// 			var tempIndex = Object.keys(this.CustGridWFLRow[0]).indexOf(this.custGridTableRow[i][j].noteDealsColumn);
					// 			this.custGridTableRow[i][j].value = this.CustGridWFLRow[i][Object.keys(this.CustGridWFLRow[i])[tempIndex]];
					// 		}
					// 	}
					// }
					if(this.CustGridWFLRow.length>this.custGridTableRow.length)
					{
						for(let r=this.custGridTableRow.length;r<this.CustGridWFLRow.length;r++)
						{
						this.IncCustGridTableRowCount();
						}
					}
					// for (let j = 0; j < this.custGridTableRow.length; j++) { //row
					// 	for (var key in this.CustGridWFLRow[j]) { //respective field value in xml 
					// 		for (let k = 0; k < this.CustomerGrid.data.length; k++) { //column
					// 			if (this.CustGridWFLRow[j].hasOwnProperty(key)) {
					// 				//console.log(key + ": " + obj[key]);
					// 				if (this.custGridTableRow[j][k].noteDealsColumn == String(key)) {
					// 					this.custGridTableRow[j][k].value = this.CustGridWFLRow[j][key][0]; //assigning value as value converted from xml to json comes in array format
					// 					this.custGridTableRow[j][k].currentValue = this.CustGridWFLRow[j][key][0];
					// 				}
					// 			}
					// 		}
					// 	}
					// }
					for (let j = 0; j < this.custGridTableRow.length; j++) { //row
							for (let k = 0; k < this.CustomerGrid.data.length; k++) { //column
							//if (this.CustGridWFLRow[j].hasOwnProperty(key)) {
									//console.log(key + ": " + obj[key]);
								//if (this.custGridTableRow[j][k].noteDealsColumn == String(key)) {
									//let i=Object.keys(this.CustGridWFLRow[j]).toString().toLowerCase().indexOf(String(this.custGridTableRow[j][k].noteDealsColumn).toLowerCase());
									//let i= this.CustGridWFLRow[j].findIndex(x=>Object.keys(x).toString().toLowerCase()==String(this.custGridTableRow[i][j].noteDealsColumn).toLowerCase());
									//let i= this.CustGridWFLRow[j].findIndex(item=>String(this.custGridTableRow[i][j].noteDealsColumn).toLowerCase()===String(item).toLowerCase());
									this.custGridTableRow[j][k].value = this.CustGridWFLRow[j][String(this.custGridTableRow[j][k].noteDealsColumn)][0]; //assigning value as value converted from xml to json comes in array format
									this.custGridTableRow[j][k].currentValue = this.CustGridWFLRow[j][String(this.custGridTableRow[j][k].noteDealsColumn)][0];
									await this.invokeCustomerGridFunctions(this.CustomerGrid.data[k].columnName, j); //to trigger customer grid functions after rows are added
									await this.InvokeUnexecutedFunctions("GRID",this.CustomerGrid.data[k].columnName, j) //to trigger unexecuted functions having input totally from udf fields & type as client/market
									this.custGridTableRow[j][k].value = this.CustGridWFLRow[j][String(this.custGridTableRow[j][k].noteDealsColumn)][0]; //assigning values again as datasource functions needed for dropdown filling need to be triggered by default values & then their resp. selected values of dropdown needs to be assigned
									this.custGridTableRow[j][k].currentValue = this.CustGridWFLRow[j][String(this.custGridTableRow[j][k].noteDealsColumn)][0]; //assigning value as value converted from xml to json comes in array format
								//}
							//}

							}

					}
					this.InvokeIntersectionFieldMapping("", "", this.custGridTableRow.length - 1);
					console.log("Customer Grid in UCPWFL mode... Data binding done... ", this.custGridTableRow);
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in changeHedgeType: "+error);
			} finally {}
		}

		async IncCustGridTableRowCount() {
			try {
				const that = this;

				console.log("Inc Cust Griddddd::::", this.CustomerGrid.data, this.CustomerGrid.columns);
				
				const dropdownNames = Object.keys(that.defaultDropdowns);
				const searchArrayNames = Object.keys(that.defaultSearchArrays);
				// if (that.controls) {
				// 	that.controls.filter((c: any) => {
				// 		if (dropdownNames.includes(c.dataType)) {
				// 			that.dropdowns[c.columnName] = that.defaultDropdowns[c.dataType];
				// 			c.value = c.value || c.defaultValue || c.currentValue || that.dropdowns[c.columnName][0].code;
				// 		}
				// 		if (searchArrayNames.includes(c.dataType)) {
				// 			that.searchArrays[c.columnName] = that.defaultSearchArrays[c.dataType];
				// 			c.value = c.value || c.defaultValue || c.currentValue;
				// 		}
				// 	});
				// }
				console.log("Original rows in customer grid are =====", this.custGridTableRow, this.CustomerGrid.data)
				//debugger;
				if (this.template.max_Client_Legs != "" && this.template.max_Client_Legs != 0) {
					if (this.custGridTableRow.length < this.template.max_Client_Legs) {                  

						this.custGridTableRow.push(JSON.parse(localStorage.getItem('dtcustomerGrid'+String(this.template.template_Id))))
						console.log("Length of custGridTableRow is: ", this.custGridTableRow.length);
						this.CustomerGrid.data.forEach(c => {
							if(c.type.toUpperCase() === 'COMMON DATA')
								{
								if (c.sourcingLink.length) {
									//that.dropdowns[c.sourcingLink] = this.common_data.filter((common: any) => common.type === c.sourcingLink);
									//that.searchArrays[c.sourcingLink] = this.common_data.filter((common: any) => common.type === c.sourcingLink);
									that.dropdowns[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = that.dropdowns[c.sourcingLink]; //Added by Devesh on 17-Nov-2021 for dropdown issue
									that.searchArrays[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = that.searchArrays[c.sourcingLink];
									} 
								else {
									that.dropdowns[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = [];
									that.searchArrays[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = [];
									}
								}
					
						});
						
					} else {
						console.log('Max Limit');
						this.ErrorMessage = 'Max Limit Reached';
					}
				} else {
					this.custGridTableRow.push(JSON.parse(localStorage.getItem('dtcustomerGrid'+String(this.template.template_Id)))) //Added template id for fixing seesion issue in postcard
					
					this.CustomerGrid.data.forEach(c => { //Added by Devesh for dropdown issue on 17-Nov-2021
						if(c.type.toUpperCase() === 'COMMON DATA')
							{
							if (c.sourcingLink.length) {
								//that.dropdowns[c.sourcingLink] = this.common_data.filter((common: any) => common.type === c.sourcingLink);
								//that.searchArrays[c.sourcingLink] = this.common_data.filter((common: any) => common.type === c.sourcingLink);
								that.dropdowns[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = that.dropdowns[c.sourcingLink]; //Added by Devesh on 17-Nov-2021 for dropdown issue
								that.searchArrays[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = that.searchArrays[c.sourcingLink];
								} 
							else {
								that.dropdowns[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = [];
								that.searchArrays[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = [];
								}
							}
				
					});
				}

				console.log("Final rows in customer grid are =====", this.custGridTableRow, this.CustomerGrid.data)
				//this.executeFunction(this.customerGridfunctions, 'FUNCTION');
				for (let i = 0; i < this.CustomerGrid.data.length; i++) {

					// this.setCustomTabIntersection(this.CustomTabs.data[i].fieldName,i,this.tableRow.length-1) //taken tableRow.length since length increase on add button
					await this.invokeCustomerGridFunctions(this.CustomerGrid.data[i].columnName, this.custGridTableRow.length - 1); //to trigger customer grid functions after rows are added
					await this.InvokeUnexecutedFunctions("GRID",this.CustomerGrid.data[i].columnName, this.custGridTableRow.length - 1) //to trigger unexecuted functions having input totaly from udf fields & type as client/market
				}
				this.InvokeIntersectionFieldMapping("", "", this.custGridTableRow.length - 1);
				//this.loader = false;
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in IncCustGridTableRowCount: "+error);
			} finally {}
		}

		decTableRowCount(index: number) {
			try {
				console.log(this.tableRow);
				if (this.tableRow.length > 1) { //delete only if row is greater than 1
					this.tableRow.splice(index, 1);

					for (let j = 0; j < this.tableRow.length; j++) { //taken tableRow.length since it is updated here and so taken double for loop as toal row count is changed here
						for (let i = 0; i < this.CustomTabs.data.length; i++) {
							this.setCustomTabIntersection(this.CustomTabs.data[i].fieldName, i, j)
						}
					}
					this.generateCustomTabXML();
				}

				this.ErrorMessage = '';
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in decTableRowCount: "+error);
			} finally {}
		}

	async decCustGridTableRowCount(row:any) {
			try {
				console.log(this.custGridTableRow);
			let index = row.index;
			let btntxt = row.btn_text;
			//changes done as per dotnet code by Devesh on 6-April-2022
            if((this.sUCPMode == "UCPUNW" || this.sUCPMode == "UCPREV" || this.sUCPMode == "UNWFUL") && btntxt == "+" ) //unwful added by devesh on 7/5/2019 as told by Hemlata A
                {
				  if (this.custGridTableRow[index].find(function(e) { return e.columnName == 'Parent_Deal_ID'}).value == "")
                    //<Rohit Padole || Added on 18-Feb-2017 || Unwind Leg as last row>
                    this.AddClientLegToCustomerGrid(this.custGridTableRow.length, index)
                    //AddClientLegToCustomerGrid(index + 1)
                    //</Rohit Padole || Added on 18-Feb-2017 || Unwind Leg as last row>                
		         }
            else
			{
				this.CustomerGrid.data.forEach(c => { //Added by Devesh for dropdown issue on 17-Nov-2021
					if(c.type.toUpperCase() === 'COMMON DATA')
						{
						
						for(let i=index;i<this.custGridTableRow.length-1;i++) //for assigning next index values to previous
						{
							this.dropdowns[c.columnName +"_cg_"+ String(i)] = this.dropdowns[c.columnName +"_cg_"+ String(i+1)];
							this.searchArrays[c.columnName +"_cg_"+ String(i)] = this.dropdowns[c.columnName +"_cg_"+ String(i+1)];
						}
						
						this.dropdowns[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = []; //for clearing last index value not cleared from above loop
						this.searchArrays[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = [];

					}		
				});
				 let dtparentrow:any=[];
				 let parent_index = -1;
				 let drOriginalParentDealData = JSON.parse(localStorage.getItem('dtOriginalDealData'+String(this.template.template_Id)));
				 dtparentrow=this.custGridTableRow.filter(e=>e.find(c=>c.columnName==="Note_Deal_Id").value == this.custGridTableRow[index].find(c=>c.columnName==="Parent_Deal_ID").value);
				  if(dtparentrow.length>0 && !this.isNullOrUndefined(drOriginalParentDealData))
				  {
					  parent_index = this.custGridTableRow.findIndex(e=>e.find(c=>c.columnName==="Note_Deal_Id").value == dtparentrow[0].find(c=>c.columnName==="Note_Deal_Id").value)
					  //dtparentrow[0].find(function(e) { return e.columnName == 'clmnCustomerNotional' }).value = String(Number(this.unformatNumber(drOriginalParentDealData[parent_index].find(function(e) {return e.columnName == 'clmnCustomerNotional' }).value))); //restoring original values
				      console.log("Parent row:",dtparentrow,"Index: ",parent_index);
					 //for parent row index as per dotnet code					 
					 this.cgrowindex = parent_index;
					 await this.InvokeWarningFunctions("GRID","clmnCustomerNotional",this.cgrowindex)
					 if(this.warning_triggered==true){
					   console.log("Warning triggered in customer grid")				
						 }
					 await this.invokeCustomerGridFunctions("clmnCustomerNotional", this.cgrowindex); //as control_index is already set to cgrowindex above
					 await this.InvokeIntersectionFieldMapping("GRID", {field_element:this.custGridTableRow[parent_index].filter(e=>e.columnName == 'clmnCustomerNotional')}, this.cgrowindex);
				 }
				this.custGridTableRow.splice(index, 1);
				this.ErrorMessage = '';
			}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in decCustGridTableRowCount: "+error);
			} finally {}
		}

		HideMarketLeg(){
			try{
				console.log("HideMarketLeg::: ", this.cgrowindex, this.custGridTableRow[this.cgrowindex])			
				if(this.template.tM_HideMarketLeg == 'Y')
				{  
					this.custGridTableRow.forEach(element => {
						console.log("inside HideMarket: ", element)
						var tempObj = element.filter(e => e.columnName == 'clmnCustomerLeg')[0];
						if(tempObj.value == 'CounterParty'){
							element.HideCustomerGridMarketLeg = true;
						}
						else {
							element.HideCustomerGridMarketLeg = false;
						}
					});
				}
				else
					this.HideCustomerGridMarketLeg = false;			
			} catch (error) {
				console.error(error);
			}		
		}
		xml2json(srcDOM) {
			try {
				let children = [...srcDOM.children];

				// base case for recursion. 
				if (!children.length) {
					return srcDOM.innerHTML
				}

				// initializing object to be returned. 
				let jsonResult = {};

				for (let child of children) {

					// checking is child has siblings of same name. 
					let childIsArray = children.filter(eachChild => eachChild.nodeName === child.nodeName).length > 1;

					// if child is array, save the values as array, else as strings. 
					if (childIsArray) {
						if (jsonResult[child.nodeName] === undefined) {
							jsonResult[child.nodeName] = [this.xml2json(child)];
						} else {
							jsonResult[child.nodeName].push(this.xml2json(child));
						}
					} else {
						jsonResult[child.nodeName] = this.xml2json(child);
					}
				}
				return jsonResult;
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in xml2json: "+error);
			} finally {}
		}
		InsertTokenDatasavebtn() {
			try {
				this.loader = true;
				this.InvokeButtonLinkedFunctions('btnSave');
				console.log("The last step to save the template involves NotemasterID: -> ", Number(this.NoteMasterID), typeof(Number(this.NoteMasterID)));
				this.api.InsertToken(Number(this.NoteMasterID), this.Login_Id).then(
					(response: any) => {
						if (response.status === Status.Success) {
							console.log(response);
							if (this.recFlag) {
								this.recFlag = false; // applicable for child in recipe
								this.blnMigrationSuccessful = false;
								this.sUCPMode = UCPMODE[UCPMODE.UCPQEN];
							} else {
								this.Message = 'Request saved : ' + this.NoteMasterID;
								this.productdDrafted = false;
								if(this.Embedded_Control.toUpperCase() == "MULTIUCP" || this.Embedded_Control.toUpperCase() == "POSTCARD"){
									this.notemasterIdGenerated = true;
								}
							}
							this.loader = false;
						} else {
							this.loader = false;
							this.Message = "";
							this.ErrorMessage = "Error while inserting token. Please check template workflow mapping.";
						}
					}
				);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in InsertTokenDatasavebtn: "+error);
			} finally {}
		}

		ClearTemplateFields() {
			this.sWarningtextArr = [];
			this.changeTemplate();
			//this.changesubtemplate();
		}
		// Coding for AnotherUCP - Added by Onkar

		OpenNewWindow() {
			try{
			window.open("/AngularUCP")
			}catch(e){
				console.log("Error in OpenNewWindow :", e)
			}
		}

		Show_HideTabs() {
			try {
				if (this.show_hide_text.toUpperCase() == "SHOW TABS") {
					this.show_hide_text = "Hide Tabs";
					this.show_tabs = true;
				} else {
					this.show_hide_text = "Show Tabs";
					this.show_tabs = false;
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in Show_HideTabs: "+error);
			} finally {}
		}
		async changesubtemplate() {
			try {
				this.loader = true;
				//this.udfloaded_status.next(false);
				/////shifted here from template change
				await this.GetTemplateRelatedMapping(); //function added by devesh for functiondef filtering as per .net
				await this.setUDFFields(); //read layout and other methods written inside setudffields
				//this.getBasketEntryColumnDetails();
				//this.GetBasketArrayFunctionDetails();
				this.sUCPMode ==='UCPQEN'?this.cboHedgingtype=false:this.cboHedgingtype=true;			
				this.setcontrolsVisibility();
				this.assignControlSeq(); //added her by Devesh to remove timeout issue		
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in changesubtemplate: "+error);
			} finally {}
		}

		async GetTemplateRelatedMapping() {
			try
			{
			this.functions_all=JSON.parse(sessionStorage.getItem("oFunctionDefinition"));	//added session part because function_all value is altered after filtering & main function_all can be retained as mode changes from wfl button actions
			this.intersections=JSON.parse(sessionStorage.getItem("oIntersectionDetails"));
			switch(this.sUCPMode.toString().toUpperCase())
			{
				case "UCPQEN":
				case "UCPPRC":
					if (this.Embedded_Control.toUpperCase() == "MULTIUCP") {					
						this.functions_all=this.functions_all.filter(f=>f.function_Execution.toUpperCase().includes("MULTIUCP"));					
						console.log("Filtered functions for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.functions_all);
						this.intersections=this.intersections.filter(i=>i.ucpMode.toUpperCase().includes("MULTIUCP"));
						console.log("Filtered intersections for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.intersections);
					} 
					else if (this.Embedded_Control.toUpperCase() == 'POSTCARD') {
						this.functions_all=this.functions_all.filter(f=>f.function_Execution.toUpperCase().includes("POSTCARD"));					
						console.log("Filtered functions for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.functions_all);
						this.intersections=this.intersections.filter(i=>i.ucpMode.toUpperCase().includes("POSTCARD"));
						console.log("Filtered intersections for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.intersections);
					}
					else{
						this.functions_all=this.functions_all.filter(f=>f.function_Execution.toUpperCase().includes("DEAL ENTRY"));
						console.log("Filtered functions for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.functions_all);
						this.intersections=this.intersections.filter(i=>i.ucpMode.toUpperCase().includes("DEAL ENTRY"));
						console.log("Filtered intersections for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.intersections);
					}
					break;
				case "UCPWFL":
				case "FEDCHK":
				case "FEDREJ":
					//this.functions_all=this.functions_all.filter(f=>f.function_Execution.toUpperCase().includes("DEAL DETAILS") || (f.ufD_Function_Output_Form.toUpperCase()=="DATASET") || (f.ufD_Function_Output_Form.toUpperCase()=="VISIBLE" || f.ufD_Function_Output_Form.toUpperCase()=="INVISIBLE"))); //filtering as per .net logic
					this.functions_all=this.functions_all.filter(f=>f.ufD_Function_Output_Form.toUpperCase()=='DATASET' || ((f.function_Execution.toUpperCase().includes("DEAL DETAILS")) && f.ufD_Function_Output_Form.toUpperCase()=="VISIBLE" || f.ufD_Function_Output_Form.toUpperCase()=="INVISIBLE"));
					if(this.sWFLButtonActionCode ==""){} //Added by SwatiP on 22-9-2021 for restrict wfl
					else{
						this.functions_all=this.functions_all.filter(f=>!(f.restrict_WFL_Button.includes(",",this.sWFLButtonActionCode,",")))
					}
					console.log("Filtered functions for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.functions_all);
					this.intersections=this.intersections.filter(i=>i.ucpMode.toUpperCase().includes("DEAL DETAILS"));
					console.log("Filtered intersections for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.intersections);
					break;	
				case "UCPCHIL":
					this.functions_all=this.functions_all.filter(f=>f.function_Execution.toUpperCase().includes("RECIPE"));
					console.log("Filtered functions for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.functions_all);
					this.intersections=this.intersections.filter(i=>i.ucpMode.toUpperCase().includes("RECIPE"));
					console.log("Filtered intersections for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.intersections);
					break;
				case "UCPFED": 
				case "PRDAMD": 
				case "PRDMAK": 
				case "FEDCHIL": 
				case "FEDMAK": 
				case "DLSAMD": 
				case "DLSADD": 
				case "UCPUNW": 
				case "UNWAMD": 
				case "UCPORD": 
				case "UCPREV": 
				case "UNWFUL": 
				case "RECADD":
					this.functions_all=this.functions_all.filter(f=>f.function_Execution.toUpperCase().includes("AMEND"));
					// MODIFIED by OnkarE on 25-Apr-2023 - to resolve cust grid function calling issue 
					if(!this.isNullOrUndefined(this.sWFLButtonActionText)){
						if(this.sWFLButtonActionText ==""){} //Added by SwatiP on 22-9-2021 for restrict wfl
						else{
							//debugger;
							this.functions_all=this.functions_all.filter(f=>!(f.restrict_WFL_Button.includes(","+this.sWFLButtonActionText+",")))
						}
					}
					
					console.log("sWFLButtonActionText: ", this.sWFLButtonActionText)
					console.log("Filtered functions for UCP mode: ",this.sUCPMode.toString().toUpperCase()," are ", this.functions_all);
					this.intersections=this.intersections.filter(i=>i.ucpMode.toUpperCase().includes("AMEND"));
					console.log("Filtered intersections for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.intersections);
					
					break;	
				case "UCPMGR":
					this.functions_all=this.functions_all.filter(f=>f.function_Execution.toUpperCase().includes("INTERFACE"));
					console.log("Filtered functions for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.functions_all);
					this.intersections=this.intersections.filter(i=>i.ucpMode.toUpperCase().includes("INTERFACE"));
					console.log("Filtered intersections for UCP mode: ",this.sUCPMode.toString().toUpperCase(),"are ", this.intersections);
					break;
			}

			if(this.sUCPMode.toString().toUpperCase()!="UCPQEN") //edit rights handling
			{
				let response:any;
				response = await this.api.GetEditRightsInfo(Number(this.iTemplateID),Number(this.QueueNo),this.EditModeMappedTOWFBMSTField,"",this.sUCPMode.toString(),"",this.Login_Id,this.entityId,this.subTemplate.toM_ID); 
				const res=response.response;
				if (res)
				{
					this.oEditrights=res;
					console.log("Edit rights response from service: ",this.oEditrights);
					this.oEditrightsCustomer=this.oEditrights.filter(x=>x.eR_Group_Type=='Deal' || x.eR_Group_Type=='Market' || x.eR_Group_Type=='Client');
					this.oEditrightsCustom=this.oEditrights.filter(x=>x.eR_Group_Type=='CUSTOM');
					console.log("Editrights customer grid: ",this.oEditrightsCustomer);
					console.log("Editrights cutom tab: ",this.oEditrightsCustom);
				}
	
			}

			if(this.template.basket_Size == 'N'){
				const keywords = ['IF', '=', '>', '<', '(', ')', ','];
				this.api.GetBasketArrayFunctionDetails(this.template.template_Id).subscribe(
					(response: any) => {
						if (response.status === Status.Success) { 
							console.log("GetBasketArrayFunctionDetails:: ", response.response);
							this.functions_all = response.response;
							let customParams: any[] = [];
							this.customTabFuntions = [];
							response.response.forEach(f => {
								customParams = [...new Set(f.ufD_CSV_Input.split('~BA.').filter((i: string) => i.length))];
								customParams = customParams.filter((p: any) => !(keywords.includes(p) || this.IsValidNumber(p)));
								this.customTabFuntions.push(...customParams);
							});
						}
				});
				console.log("Basket array functions are: ", this.customTabFuntions);
			}
			}
			catch(error)
			{
				//this.api.WriteErrorLogs("Error in GetTemplateRelatedMapping: "+error);
			}
		}
		async setUDFFields() {
		try
		{
				const that = this;
				this.layoutloaded=false;
				console.log("Input parameters for ReadLayout are: ", this.template.template_Id, this.template.template_Code, "Subtemplate name & id: ", this.subTemplate.toM_Sub_Template_Name, this.subTemplate.toM_ID);
				if (this.Embedded_Control.toUpperCase() == "MULTIUCP" && !this.isNullOrUndefined(sessionStorage.getItem('oFieldDetails'))) {
					this.controls = JSON.parse(sessionStorage.getItem('oFieldDetails')).udfFields;
					this.common_data = JSON.parse(sessionStorage.getItem('oFieldDetails')).commonData;
					this.functions = JSON.parse(sessionStorage.getItem('oFieldDetails')).function; //taking functions list from session as if normal flow is done here the respone of list of function from service side is received after dealy and exception occurs in below code. 
					///////////added this lines of code from else condt as json stringify doesn't work on nested array so session storage is not possible for dropdown & search array </start>
					this.controls.filter((c: any) => c.dataType === 'COMMON DATA').forEach((control: any) => {
						if (control.sourcingLink.length) {
							this.dropdowns[control.sourcingLink] = this.common_data.filter((c: any) => c.type === control.sourcingLink);
							this.searchArrays[control.sourcingLink] = this.common_data.filter((c: any) => c.type === control.sourcingLink);
							this.dropdowns[control.fieldName] = this.dropdowns[control.sourcingLink]
							this.searchArrays[control.fieldName] = this.searchArrays[control.sourcingLink]
						} else {
							this.dropdowns[control.fieldName] = [];
							this.searchArrays[control.fieldName] = [];
						}
					});
					var dropdownNames = Object.keys(that.defaultDropdowns);
					var searchArrayNames = Object.keys(that.defaultSearchArrays);
					if (this.controls) {
						this.controls.filter((c: any) => {
							if (dropdownNames.includes(c.dataType)) {
								this.dropdowns[c.fieldName] = that.defaultDropdowns[c.dataType];
								c.value = c.value || c.defaultValue || c.currentValue || that.dropdowns[c.fieldName][0].code;
							}
							if (searchArrayNames.includes(c.dataType)) {
								this.searchArrays[c.fieldName] = that.defaultSearchArrays[c.dataType];
								c.value = c.value || c.defaultValue || c.currentValue;
							}
						});
					}
					/////</end>
					//this.loaderService.display(true);
					console.log("Same template as previous row in MultiUCP, controls----->", this.controls, this.dropdowns, this.searchArrays, JSON.parse(sessionStorage.getItem('oFieldDetails')));
					console.log("List of Product funcs", (!this.isNullOrUndefined(this.functions) ? this.functions.filter(f => f.functionMode == 'Product') : "")); //added null or undefined check to avoid error on filter operation
					await this.executeFunction((!this.isNullOrUndefined(this.functions) ? this.functions.filter(f => f.functionMode == 'Product' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK' && f.event == '') : this.functions), ""); //added hardblock filter not to allow harblock func exe on load //to execute only product level functions, custom and other types will be triggered when rows are added in particular tab not from here
					//await this.executeFunction((!this.isNullOrUndefined(this.functions['WCF SERVICE']) ? this.functions['WCF SERVICE'].filter(f => f.functionMode == 'Product' && f.event == '') : this.functions['WCF SERVICE']), 'WCF SERVICE'); // On load wcf added on 03-Nov-2020
					//await this.executeFormula((!this.isNullOrUndefined(this.functions['FORMULA']) ? this.functions['FORMULA'].filter(f => f.functionMode == 'Product' && f.event == '') : this.functions['FORMULA']));
					console.log('execute functions ends..');
					
					//this.loaderService.display(false);
					that.udfDropdownsLoaded = true; ////statement copied as it is from below conditions of api call
					that.dataLoadCheck.next(true);
					that.controlsLoaded = true;
					that.dataLoadCheck.next(true);
					this.layoutloaded=true;
					this.loader = false;
				} else {
					//await this.api.readLayout(this.template.template_Id, this.template.template_Code, this.Application_type, this.sUCPMode, this.iTemplateSrNo, this.subTemplate.toM_ID, this.Login_Id, this.userGroup,this.EditModeMappedTOWFBMSTField).then(
					//Added by RajeshC || RestrictWFLbutton handling
					var sClickedWFLButton = JSON.parse(sessionStorage.getItem("prdAmdButton"));
					if(sClickedWFLButton == null){
						this.sClickedButton = "";
					} else {
						this.sClickedButton = sClickedWFLButton.caption; 
					}
					await this.api.ReadFieldDetailsAngular(this.template.template_Id, this.template.template_Code, this.Application_type, this.sUCPMode, this.iTemplateSrNo, this.subTemplate.toM_ID, this.Login_Id, this.userGroup,this.EditModeMappedTOWFBMSTField,this.selectedBookingModel,this.iNoteMasterID, this.isNullOrUndefined(this.QueueNo) ? 0 : Number(this.QueueNo), Number(this.entityId), this.sClickedButton ).then(
						async (response: any) => {
							const start = performance.now();
							if (response.status === Status.Success) {
								const res = response.response;
								this.readLayoutResponse = res;
								console.log("Read Layout Response ::: ", res);
								//this.GetCustomerNames(); /// To get customer names list - by OnkarE on 06-Jan-2021
								if(this.showPricingGrid == 'Y')
									this.Get_Avail_Login_For_PPAsync(); // To get default PP available for template - Added by OnkarE on 14-Apr-2021
								if (res.udfFields != null) {
									that.controls = res.udfFields;
									// that.common_data = res.commonData
									that.controls.filter((c: any) => c.dataType === 'COMMON DATA').forEach((control: any) => {
										if (control.sourcingLink.length) {
											that.dropdowns[control.sourcingLink] = that.common_data.filter((c: any) => c.type === control.sourcingLink);
											that.searchArrays[control.sourcingLink] = that.common_data.filter((c: any) => c.type === control.sourcingLink);
											// this.dropdowns[control.fieldName] = this.dropdowns[control.sourcingLink];
											// this.searchArrays[control.fieldName] = this.searchArrays[control.sourcingLink];
											this.fillControlCombo(control, this.dropdowns[control.sourcingLink]);

										} else {
											that.dropdowns[control.fieldName] = [];
											that.searchArrays[control.fieldName] = [];
										}
									});

									console.log("Read layout dropdowns data: ", this.dropdowns);
									//Start by SWatiP for wfl button datatype
									this.controls.filter((c: any) => c.dataType === 'WFL BUTTON').forEach((control: any) => {
										if(this.sWFLButtonActionText == ""){
											if (control.sourcingLink.length) {
												if(!this.isNullOrUndefined(this.queueButtonsData))
												{
												this.WFLqueueButtons.push(this.queueButtonsData.filter(btn=>btn.caption==control.sourcingLink)[0]);
												this.WFLqueueButtons.map(i=>{i.showbtn=true,i.readonly=false});
												}
											} 
										}
										else if(this.sWFLButtonActionText.toString().trim() != control.sourcingLink.toString().trim()){
											if (control.sourcingLink.length) {
												// this.WFLqueueButtons=this.queueButtonsData.filter(btn=>btn.caption==control.sourcingLink);
												// this.WFLqueueButtons.map(i=>{i.showbtn=true,i.readonly=true});
												this.WFLqueueButtons.filter(function (btn) {
													return btn.caption==control.sourcingLink;
												}).map(function (btn) {
													return btn.showbtn=true,btn.readonly=true;
												})
											} 
										}
										else{
											if (control.sourcingLink.length) {
												// this.WFLqueueButtons=this.queueButtonsData.filter(btn=>btn.caption==this.sWFLButtonActionText && btn.mode.toUpperCase()=="MODE");
												// this.WFLqueueButtons.map(i=>{i.showbtn=false,i.readonly=false});
												this.WFLqueueButtons.filter(function (btn) {
													return btn.caption==control.sourcingLink && btn.mode.toUpperCase()=="MODE";
												}).map(function (btn) {
													return btn.showbtn=false,btn.readonly=false;
												})
											} 
										}
									});
									//End by SwatiP

									that.controls.forEach((c: any) => { //added by devesh for default value formatting as per udf format

										if ((c.dataType === 'AMOUNT' || c.dataType === 'NUMBER') && c.sourcingLink != '') {
											if(this.controls.filter((e) => e.fieldName == c.sourcingLink)[0]) /// Added by OnkarE on 21-Apr-2021 to avoid error in below line
											c.udF_Format = this.getRoundingRate(this.controls.filter((e) => e.fieldName == c.sourcingLink)[0].defaultValue, this.controls.filter((e) => e.fieldName == c.sourcingLink)[0].dataType, c.dataType)
										}

										if ((c.dataType === 'AMOUNT' || c.dataType === 'NUMBER') && !(this.isNullOrUndefined(c.defaultValue) || c.defaultValue == "")) {
											c.defaultValue = this.formatKLMB(c.defaultValue, c.udF_Format);
										}

										if (c.dataType === 'UCP USER CONTROL') {
											/// Added by OnkarE on 01-Feb-2021
											that.dropdowns[c.sourcingLink] = that.common_data.filter((d: any) => d.code === c.sourcingLink);
											c.gridDt = [];
											// c.defaultValue = c.defaultValue.replace(/['"]+/g, '');
											//c.gridDt = this.xml2json(c.defaultValue);
											// console.log("UCP generic grid::: ", c)
										}

									});
									that.controls.forEach((c: any) => {
										//c.value = c.defaultValue;
										c.value = c.defaultValue; // Changed by OnkarE on 03-Feb-2022 as suggested by RohitP
										c.visibleOpt = '';
										if (Number(c.column_Width) > Number(this.totalWidth)) {
											this.totalWidth = Number(c.column_Width);
										}
										if (this.sUCPMode === 'UCPWFL') {
											// Setting all udf_fields in read only mode for UCPWFL mode - OnkarE on 10-Nov-2020
											c.readOnly = 'Y'
										}
										if (c.dataType == 'CHART') {
											let test = "#838383";
											//this.themeList && this.themeList.length > 0 ? this.themeList[0].properties['--chartheadertextcolor'] : "black"; /// Added by OnkarE on 03-Feb-2022 to get chart header text color from theme
											console.log("chart color: ",this.themeList )
											c.chartoption = {}; //setting default chartoptions, value gets overwrite or remains same depending on below cases
											switch (c.sourcingLink) {
												case 'Pie':
													c.sourcingLink = 'PieChart';
													c.chartoption = {
														titleTextStyle: {
															color: test,    
															fontName: 'Verdana, Geneva, Tahoma, sans-serif',
															fontSize: 12,
															bold: false  
															// italic: <boolean>   // true of false
														},
														legend: {
															textStyle: { color: '#838383' }
														}
													};
													break;
												case 'Doughnut':
													c.sourcingLink = 'PieChart';
													
													c.chartoption = {
														pieHole: 0.4,
														titleTextStyle: {
															color: test,    
															fontName: 'Verdana, Geneva, Tahoma, sans-serif',
															fontSize: 12,
															bold: false  
															// italic: <boolean>   // true of false
														},
														legend: {
															textStyle: { color: '#838383' }
														}
													};
													break;
												case 'Line':
													c.sourcingLink = 'LineChart';
													c.chartoption = {
														titleTextStyle: {
															color: test,    
															fontName: 'Verdana, Geneva, Tahoma, sans-serif',
															fontSize: 12,
															bold: false  
															// italic: <boolean>   // true of false
														},
														hAxis: {
															textStyle:{color: '#838383'}
														},
														vAxis: {
															textStyle:{color: '#838383'}
														}
														
													};
													break;
												case 'Bar':
													c.sourcingLink = 'ColumnChart';
													c.chartoption = {
														titleTextStyle: {
															color: test,    
															fontName: 'Verdana, Geneva, Tahoma, sans-serif',
															fontSize: 12,
															bold: false  
															// italic: <boolean>   // true of false
														},
														hAxis: {
															textStyle:{color: '#838383'}
														},
														vAxis: {
															textStyle:{color: '#838383'}
														}
														
													};
													break;
												case 'Funnel': //not supported

													break;
												case 'Pyramid': //not supported
													//target[0].sourcingLink='ColumnChart';
													break;
												case 'Bubble':
													//c.sourcingLink='BubbleChart';
													break;
											}
											if (c.udF_Feature1 == "Allow 3D") //added for 3d feature
											{
												c.chartoption = {
													is3D: true,
													titleTextStyle: {
														color: test,    
														fontName: 'Verdana, Geneva, Tahoma, sans-serif',
														fontSize: 12,
														bold: false  
														// italic: <boolean>   // true of false
													},
													legend: {
														textStyle: { color: '#838383' }
													}
												};
											}
										}
										if(c.dataType == 'DATE'){
											if(c.udF_Feature1.toUpperCase() != 'ALLOW BLANK DATE' && c.defaultValue == ''){
												c.value = moment(new Date()).format("DD-MMM-YYYY");
											}
										}
									});
									const dropdownNames = Object.keys(that.defaultDropdowns);
									const searchArrayNames = Object.keys(that.defaultSearchArrays);
									if (that.controls) {
										that.controls.filter((c: any) => {
											if (dropdownNames.includes(c.dataType)) {
												that.dropdowns[c.fieldName] = that.defaultDropdowns[c.dataType];
												if(c.udF_Feature1.includes('Multiselect Dropdown') && c.defaultValue == ""){
													c.value = "";
												}
												else
													c.value = c.value || c.defaultValue || c.currentValue || that.dropdowns[c.fieldName][0].code;
											}
											if (searchArrayNames.includes(c.dataType)) {
												that.searchArrays[c.fieldName] = that.defaultSearchArrays[c.dataType];
												if(c.udF_Feature1.includes('Multiselect Dropdown') && c.defaultValue == ""){
													c.value = "";
												}
												else
													c.value = c.value || c.defaultValue || c.currentValue;
											}
										});
									}
									// console.log('execute functions start in page load ..', this.controls, that.controls)
									// console.log("Function callss....")
									if (this.sMigrationMode === 'Recipe') {
										this.SetInterFaceLinkTFromOtherControls();
									}
									
									if (this.blnMigrationSuccessful) {
										console.log("Inside parents mapping", this.ParentUDFRow);
										this.controls.forEach(element => {
											if (element.fieldName != undefined && this.ParentUDFRow.hasOwnProperty(element.fieldName)) {
												element.defaultValue = this.ParentUDFRow[element.fieldName];
												element.currentValue = this.ParentUDFRow[element.fieldName];
												element.value = this.ParentUDFRow[element.fieldName];;
											}
										});
										console.log("Latest fields after parent loading after recipe sucessful ", this.controls);
									}
									console.log("function calling starts here onk.....");
								}

								////////added here by devesh because of intersection issues as field templates were not loaded before call
								//this.udfloaded_status.next(true);
								console.log("All UDF field loaded now");
								if (this.Multi_UCP_index == this.Multi_UCP_length - 1) {
									sessionStorage.removeItem('oFieldDetails');
									sessionStorage.setItem('oFieldDetails', JSON.stringify({
										udfFields: this.controls,
										commonData: this.common_data,
										function: this.functions_all //{
										// 	FUNCTION: this.functions['FUNCTION'],
										// 	FORMULA: this.functions['FORMULA'],
										// 	SP: this.functions['SP'],
										// 	"WCF SERVICE": this.functions['WCF SERVICE']
										// }
									})); //added functions in discrete manner because json.stringify was not working properly on overall functions jso array
								}
								////////
								if((this.Embedded_Control == 'NATIVEFX' || this.Embedded_Control == "Funds") && this.FX_Native_Fields){ // Added by OnkarE to handle on load intersections
									this.AssignParentControlValuesToUCPControl();
								}
								console.log("Multti UCPPPPPPPP::::::::: ", this.Embedded_Control.toUpperCase()) ///loaded before subtemplate as custom tab and customer grid are independent of subtemplate
								//this.loaderService.display(true);
							if (this.Embedded_Control.toUpperCase()!=="MULTIUCP" && this.Embedded_Control.toUpperCase()!=="NATIVEFX") { // added by devesh on 29-jul-2020, dont load customer grid and custom tab if multiucp to make it faster else normal flow 
									//this.ReadCustomTabDetails(this.template.template_Id, String(this.subTemplate.toM_ID));
									//this.GetIntersectionMappingDetails(this.template.template_Id); //Added by SwatiP //commented by Devesh on 11-Jun-2021
									this.CustomTabs.columns = [];
									this.CustomTabs.data = [];
									this.tableRow = []; //for clearing table 
									let dtEditRightsCustom:any=[];
									const dropdownNames = Object.keys(that.defaultDropdowns);
									const searchArrayNames = Object.keys(that.defaultSearchArrays);

									if(this.template.basket_Size=="7")
									{
									if(res.customTab != null)
									{
									if(res.customTab.length>0)
									{
										res.customTab.forEach(c => {		
										if(c.dataType === 'COMMON DATA') {
											if (c.sourcingLink.length) {
												that.dropdowns[c.sourcingLink] = this.common_data.filter((control: any) => control.type === c.sourcingLink);
												that.searchArrays[c.sourcingLink] = this.common_data.filter((control: any) => control.type === c.sourcingLink);									
												this.fillControlCombo(c, this.dropdowns[c.sourcingLink]);
											} else {
												that.dropdowns[c.fieldName] = [];
												that.searchArrays[c.fieldName] = [];
											}
										}
										c.value = c.currentValue;
										if (dropdownNames.includes(c.dataType)) {
											that.dropdowns[c.fieldName] = that.defaultDropdowns[c.dataType];
											if(c.udF_Feature1.includes('Multiselect Dropdown') && c.defaultValue == ""){
												c.value = "";
											}
											else
												c.value = c.value || c.defaultValue || c.currentValue || that.dropdowns[c.fieldName][0].code;
										}
										if (searchArrayNames.includes(c.dataType)) {
											that.searchArrays[c.fieldName] = that.defaultSearchArrays[c.dataType];
											if(c.udF_Feature1.includes('Multiselect Dropdown') && c.defaultValue == ""){
												c.value = "";
											}
											else
												c.value = c.value || c.defaultValue || c.currentValue;
										}
										//c.rowNo = 0;  //commented as no need
										switch(this.sUCPMode.toUpperCase())
										{
											case "UCPQEN":
											case "UCPWFL":
											case "FEDREJ": case "FEDCHK": case "UCPUNW": case "UCPREV": case "UNWFUL": case "PRDCHK":
												//do nothing for these, let readonly & visiblity be same as received from service side
												break;
											default: //for other cases where edit rights are needed
												if(this.oEditrightsCustom.length>0)
												{
													dtEditRightsCustom=this.oEditrightsCustom.filter(x=>x.eR_UDF_Field==c.fieldName);
													if (dtEditRightsCustom.length>0)
													{
														if (dtEditRightsCustom[0].eR_Visible_YN.toString().substr(1, 1) == "Y") 
															{
																c.readOnly = 'Y';
															}
														else
															{
																c.readOnly = 'N';
															}
														if (dtEditRightsCustom[0].eR_Visible_YN.toString().substr(0, 1).toString() == "Y")
															{
																c.visibility = 'Y';
															}
														else
														{
															c.visibility = 'N';
														}											                                          
													}
												}								
											break;
										}
									});
									that.CustomTabs.columns = res.customTab.filter(x=>x.visibility=="Y").map(e => e.displayName);
									that.CustomTabs.data = res.customTab;
									localStorage.removeItem('dtcustomTab'+String(this.template.template_Id));
									localStorage.setItem('dtcustomTab'+String(this.template.template_Id), JSON.stringify(that.CustomTabs.data));
										//this.setcustomtab();	
									if(this.sUCPMode=="UCPQEN")
									{
										this.tableRow.push(JSON.parse(localStorage.getItem('dtcustomTab'+String(this.template.template_Id))));
										for(let i=0;i<this.CustomTabs.data.length;i++)
										{
											this.setCustomTabIntersection(this.CustomTabs.data[i].fieldName, i,this.tableRow.length-1); 
										}
									}								
									else
									{
										if (this.sCustomTabUDFField != "") {
											let customtabxml = String(this.controls.filter(c => c.fieldName == this.sCustomTabUDFField)[0].value).replace(/\\n/g,"");
											let customtabjson;
											console.log("reverse mapped");
											var parseString = require('xml2js').parseString;
											parseString(customtabxml, function(err, result) {
												console.dir(result,err);
												// customtabjson=result.DocumentElement.CustomTab;
												//customtabjson = (!this.isNullOrUndefined(result.DocumentElement.CustomTab) ? result.DocumentElement.CustomTab : result.DocumentElement.CustomTab1); //because few old templates have customtab1 in xml instead of customtab
												//Modified by RajeshC || 24-Feb-2023
												if(!this.isNullOrUndefined(result) && JSON.stringify(result).includes("DocumentElement")){
													customtabjson = (!(result.DocumentElement.CustomTab == null || result.DocumentElement.CustomTab == undefined ) ? result.DocumentElement.CustomTab : result.DocumentElement.CustomTab1)
												}
												else if(!this.isNullOrUndefined(result) && JSON.stringify(result).includes("NewDataSet")) { // Handled this condition by OnkarE on 16-May-2023
													if(JSON.stringify(result).includes("CustomTab1")){
														customtabjson = result.NewDataSet.CustomTab1;
													}
													else {
														customtabjson = result.NewDataSet.CustomTab;
													}
													
												}
											}.bind(this));
											console.log("WFL values of customtab", customtabjson);
											for (let i = 0; i < customtabjson.length; i++) {
												this.tableRow.push(JSON.parse(localStorage.getItem('dtcustomTab'+String(this.template.template_Id)))); //to push default data to keep rest parameters same and row count in sync received in wfl mode
											}
											for (let j = 0; j < this.tableRow.length; j++) { //row
												for (var key in customtabjson[j]) { //respective field value in xml 
													for (let k = 0; k < this.CustomTabs.data.length; k++) { //column
														if (this.checkIfKeyExist(customtabjson[j], key)) { // Added this function instead of hasOwenProperty - by OnkarE on 28-Mar-2023 as hasOwenProperty is case sensitive
															//console.log(key + ": " + obj[key]);
															if (this.tableRow[j][k].fieldName.toUpperCase() == String(key).toUpperCase()) { // Added toUpperCase() by OnkarE on 28-Mar-2023 to resolve issue of custom tab values not getting applied 
																this.tableRow[j][k].value = customtabjson[j][key][0]; //assigning value as value converted from xml to json comes in array format
																this.tableRow[j][k].currentValue = customtabjson[j][key][0];
															}
														}
													}
												}
											}
											// Added by OnkarE on 16-May-2023
											let FiletredCtr = this.controls.filter(e => String(e.customTabReference).toUpperCase().includes('OUT('))
											FiletredCtr.forEach(e => {
												this.InvokeCustomTabUDFMETIntersection(e)
											})
											
											console.log("Custom tab values in wfl mode", this.tableRow);
										}	
									}
									console.log("Custom tab :",this.tableRow);
									//////////////////
										// let cust_func=[];
										// cust_func=this.functions_all.filter(f => f.functionMode == 'Custom' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK' && (f.ufD_Function_Output_Form.toUpperCase()=="VISIBLE" || f.ufD_Function_Output_Form.toUpperCase()=="INVISIBLE" || f.ufD_Function_Output_Form.toUpperCase()=="READONLY") && f.event == '');
										// if (cust_func.length > 0) { //not to trigger for loop unnecessarily if no functions/formula are triggered									
										// 	for (let i = 0; i < this.tableRow.length; i++) { //for loop for triggering func for every row										
										// 		this.customtab_all_triggered = true; //setting boolean to true
										// 		if (cust_func.length) {
										// 			await this.executeFunction(cust_func, "", i);
										// 		}										
										// 	} 
										// }
										//////////////////
											}										
										} 
									}

									else
									{
										if(res.oBaksetArray!=null)
										{
											if(res.oBaksetArray.length>0)
											{
												var tempArr = [];
												for (let i = 0; i < res.oBaksetArray.length; i++) {
														var obj = {displayName : "", dataType: "", sourcingLink:"", fieldName: "",defaultValue:"",visibility:"",readOnly:"",mandatory:"",formulae:"",sequenceNo:"",tildaSepFormulaColumns:"",udF_Feature1:"",currentValue:"",id:""};
														obj.displayName =  res.oBaksetArray[i].columnHeader;
														obj.dataType =  res.oBaksetArray[i].dataType;
														obj.sourcingLink =  res.oBaksetArray[i].sourcingLink;
														obj.fieldName =  res.oBaksetArray[i].columnName;
														obj.defaultValue =  res.oBaksetArray[i].defaultValue;
														obj.visibility =  res.oBaksetArray[i].visibleYN == true ? "Y" : "N";
														obj.readOnly =  res.oBaksetArray[i].readOnlyYN == true ? "Y" : "N";
														obj.mandatory =  res.oBaksetArray[i].mandatory == true ? "Y" : "N";
														obj.formulae =  res.oBaksetArray[i].formulae;
														obj.sequenceNo =  res.oBaksetArray[i].sequenceNo;
														obj.tildaSepFormulaColumns =  res.oBaksetArray[i].tildaSepFormulaColumns;
														obj.udF_Feature1 = "";
														obj.currentValue =  res.oBaksetArray[i].defaultValue;
														obj.id = res.oBaksetArray[i].id;								
														tempArr.push(obj);
												}
												tempArr.forEach((c: any) => {
													if ((c.dataType === 'AMOUNT' || c.dataType === 'NUMBER') && !(this.isNullOrUndefined(c.defaultValue) || c.defaultValue == "")) { //added by devesh for default value formatting as per udf format
														c.defaultValue = this.formatKLMB(c.defaultValue, c.udF_Format);
													}
													if(c.dataType === 'COMMON DATA') {
														if (c.sourcingLink.length) {
															that.dropdowns[c.sourcingLink] = this.common_data.filter((control: any) => control.type === c.sourcingLink);
															that.searchArrays[c.sourcingLink] = this.common_data.filter((control: any) => control.type === c.sourcingLink);									
															this.fillControlCombo(c, this.dropdowns[c.sourcingLink]);
														} else {
															that.dropdowns[c.fieldName] = [];
															that.searchArrays[c.fieldName] = [];
														}
													}
													c.value = c.defaultValue;
													if (dropdownNames.includes(c.dataType)) {
														that.dropdowns[c.fieldName] = that.defaultDropdowns[c.dataType];
														if(c.udF_Feature1.includes('Multiselect Dropdown') && c.defaultValue == ""){
															c.value = "";
														}
														else
															c.value = c.value || c.defaultValue || c.currentValue || that.dropdowns[c.fieldName][0].code;
													}
													if (searchArrayNames.includes(c.dataType)) {
														that.searchArrays[c.fieldName] = that.defaultSearchArrays[c.dataType];
														if(c.udF_Feature1.includes('Multiselect Dropdown') && c.defaultValue == ""){
															c.value = "";
														}
														else
															c.value = c.value || c.defaultValue || c.currentValue;
													}
													//c.rowNo = 0;  //commented as no need
													switch(this.sUCPMode.toUpperCase())
													{
														case "UCPQEN":
														case "UCPWFL":
														case "FEDREJ": case "FEDCHK": case "UCPUNW": case "UCPREV": case "UNWFUL": case "PRDCHK":
															//do nothing for these, let readonly & visiblity be same as received from service side
															break;
														default: //for other cases where edit rights are needed
															if(this.oEditrightsCustom.length>0)
															{
																dtEditRightsCustom=this.oEditrightsCustom.filter(x=>x.eR_UDF_Field==c.fieldName);
																if (dtEditRightsCustom.length>0)
																{
																	if (dtEditRightsCustom[0].eR_Visible_YN.toString().substr(1, 1) == "Y") 
																		{
																			c.readOnly = 'Y';
																		}
																	else
																		{
																			c.readOnly = 'N';
																		}
																	if (dtEditRightsCustom[0].eR_Visible_YN.toString().substr(0, 1).toString() == "Y")
																		{
																			c.visibility = 'Y';
																		}
																	else
																	{
																		c.visibility = 'N';
																	}											                                          
													}
															}								
														break;
													}
												});
												that.CustomTabs.columns = tempArr.filter(x=>x.visibility=="Y").map(e => e.displayName);
												that.CustomTabs.data = tempArr;
												this.parseBasketArrayForrmulae(tempArr);
												localStorage.removeItem('dtcustomTab'+String(this.template.template_Id));
												localStorage.setItem('dtcustomTab'+String(this.template.template_Id), JSON.stringify(that.CustomTabs.data));
												if(this.sUCPMode=="UCPQEN")
												{
													this.tableRow.push(JSON.parse(localStorage.getItem('dtcustomTab'+String(this.template.template_Id))));
												}
											}
										}
									}
									if(this.selectedBookingModel != 'Product' && this.selectedBookingModel != 'RFQ' && this.selectedBookingModel != 'UDF'){
										//this.GetCustomerGridColumnDetails(this.template.template_Id);
										//this.GetCustGridDetails(this.template.template_Id);
										if(res.custGrid!=null)
										{
											if(res.custGrid.length>0)
											{
												this.CustomerGrid.columns = [];
												this.CustomerGrid.data = [];
												//console.log("Requesting customer grid details for template id and sUCPMode is:  ", templateID, this.sUCPMode);
												let blnreadonly=true;
												if(this.sUCPMode.toString().toUpperCase() == 'DLSAMD' || this.sUCPMode.toString().toUpperCase() =='UCPORD' || this.sUCPMode.toString().toUpperCase() =='UCPQEN' || this.sUCPMode.toString().toUpperCase() =='DLSADD') //As per .net logic
												{
												this.btnPoolreadonly=false;
												}
												else
												{
												this.btnPoolreadonly=true;
												}
												switch(this.sUCPMode.toString().toUpperCase())
												{
													case "UCPQEN":
													case "UCPPRC":	
													case "DLSAMD":
													case "DLSADD":
													case "RECADD":
													case "UCPFED":
													case "UCPUNW":
													case "UCPREV":
													case "UNWAMD":
													case "UNWFUL":
														blnreadonly=false;
														break;
													case "UCPWFL":
														blnreadonly=true;
														break;
													default:
														blnreadonly=true;
														break;
												}  
												//////////
												res.custGrid.forEach((row ,index) => {
														row.forEach((c: any) => {
															c.value = c.defaultValue;
															c.udF_Format = c.ucgM_format; //Added by Devesh for formatting issue in executefunction on 15-Nov-2021 
															//blnreadonly ? c.readOnly='Y': c.readOnly='N';
															if (dropdownNames.includes(c.type.toUpperCase())) {
																this.dropdowns[c.columnName] = that.defaultDropdowns[c.type.toUpperCase()];
																c.value = c.value || c.defaultValue || c.currentValue || that.dropdowns[c.columnName][0].code;
															}
															if (searchArrayNames.includes(c.type.toUpperCase())) {
																this.searchArrays[c.columnName] = that.defaultSearchArrays[c.type.toUpperCase()];
																c.value = c.value || c.defaultValue || c.currentValue;
															}	
															if(c.type.toUpperCase() == 'COMMON DATA')
															{
																
																if (c.sourcingLink.length) {
																	that.dropdowns[c.sourcingLink] = this.common_data.filter((common: any) => common.Type === c.sourcingLink);
																	that.searchArrays[c.sourcingLink] = this.common_data.filter((common: any) => common.Type === c.sourcingLink);
																	that.dropdowns[c.columnName + "_cg_" + String(index)] = that.dropdowns[c.sourcingLink]; //Added by Devesh on 17-Nov-2021 for dropdown issue
																	that.searchArrays[c.columnName + "_cg_" + String(index)] = that.searchArrays[c.sourcingLink];
																	
																} else {
																	that.dropdowns[c.columnName + "_cg_" + String(index)] = [];
																	that.searchArrays[c.columnName + "_cg_" + String(index)] = [];
																}
																
															}
															
															//console.log("cust_grid_index",index, this.dropdowns);												
														});	 									
												});
												that.custGridColumns = res.custGrid[0].map(e => e.columnName);
												that.CustomerGrid.columns = res.custGrid[0].map(e => e.displayName);
												that.CustomerGrid.data = res.custGrid[0]
												that.custid_index=that.CustomerGrid.columns.findIndex(x=>x=="Customer Id");
												localStorage.removeItem('dtcustomerGrid'+String(this.template.template_Id));
												localStorage.setItem('dtcustomerGrid'+String(this.template.template_Id), JSON.stringify(that.CustomerGrid.data));
										if(this.sUCPMode!="UCPQEN" && this.sUCPMode!="UCPWFL") //Added by Devesh on 7-April-2022 for handling other modes as per dotnet code
										{
											localStorage.removeItem('dtOriginalDealData'+String(this.template.template_Id));
											localStorage.setItem('dtOriginalDealData'+String(this.template.template_Id), JSON.stringify(res.custGrid));
										}
												this.custGridTableRow = [];
												this.custGridTableRow = res.custGrid;
												//this.BindCustomerGridData(); // Added by OnkarE on 31-Dec-2021 - Equivalent function to dgvCustCpty_RowDataBound function in .Net 
												
												
												////////Added to keep row index in sync for visiblity & readonly functions 
												// let client_func =[];
												// let market_func=[];
												// client_func = this.functions_all.filter(f => f.functionMode == 'Client' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK' && (f.ufD_Function_Output_Form.toUpperCase()=="VISIBLE" || f.ufD_Function_Output_Form.toUpperCase()=="INVISIBLE" || f.ufD_Function_Output_Form.toUpperCase()=="READONLY") && f.event == '');
												// market_func = this.functions_all.filter(f => f.functionMode == 'Market' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK' && (f.ufD_Function_Output_Form.toUpperCase()=="VISIBLE" || f.ufD_Function_Output_Form.toUpperCase()=="INVISIBLE" || f.ufD_Function_Output_Form.toUpperCase()=="READONLY") && f.event == '');
												// for (let i = 0; i < this.custGridTableRow.length; i++) { //for loop for triggering func for every row
												// 	this.customergrid_all_triggered = true; //setting boolean to true
												// 	this.cgrowindex = i;
												// 	this.custGridTableRow[i].forEach(element => {
												// 		if (element.columnName == "clmnCustomerLeg" && element.value == 'Customer') {
												// 			if (client_func.length) {
												// 				this.executeFunction(client_func, "", i);
												// 			}														
												// 		} else if (element.columnName == "clmnCustomerLeg" && element.value == 'CounterParty') {
												// 			if (market_func.length) {
												// 				this.executeFunction(market_func, "",i);
												// 			}													
												// 		}												
												// 	});				
												// }
												///////
											}
										}
									}
								}
								if(res.dropdowns!=null)
								{
									if(res.dropdowns.length>0)
									{
										let dpfields = Object.keys(this.dropdowns);
										res.dropdowns.forEach(element => {
											//if(dpfields.includes(element.fieldname))
											{
												this.dropdowns[element.fieldname]=JSON.parse(element.value);
												if(this.dropdowns[element.fieldname].length>0)
											{											
												if(Object.keys(this.dropdowns[element.fieldname][0]).includes('Code'))
												{
													this.dropdowns[element.fieldname].map(c=>c.code=c.Code);
												}
												else if(element.fieldname.includes("_cg_")){
													that.dropdowns[element.fieldname].map(d => d.code = d[Object.keys(d)[0]])
												}
												else
												{
													let ct = this.controls.filter(c=>c.fieldName==element.fieldname);
													if(ct[0])
													{
														switch(ct[0].dataType.toUpperCase())
														{
															case "CURRENCY":
															case "COMMON DATA":	
																this.dropdowns[element.fieldname].map(d => d.code = d[Object.keys(d)[0]])
																break;
															case "CHART":
																if(ct[0].sourcingLink == '3D Chart') { /// added this condition by OnkarE on 03-Feb-2022
																	ct[0].value = this.dropdowns[element.fieldname];
																}
																else {
																ct[0].value=this.dropdowns[element.fieldname].map(function(e) { //shorten format work for any no.of columns 
																	return Object.keys(e).map(function(k) {
																		return (_isNumberValue(e[k]) ? Number(e[k]) : e[k]);
																	});
																});
																}
																console.log("Chart Data in ReadFieldDetails: ", ct[0].displayName, ct[0])
																break;	
														}
													}
												}											
											}
											}
										});
										console.log("setudf dropdowns",this.dropdowns);
									}
								}
								this.setTabIndexSeq(); /// Added by OnkarE to set tab index based on tab seq mode on 18-Nov-2021
								console.log('execute functions start in page load for Product func type..', this.controls, that.controls)
								console.log("Function callss....");
								console.log("List of Product funcs", (!this.isNullOrUndefined(this.functions_all) ? this.functions_all.filter(f => f.functionMode == 'Product') : "")); //added null or undefined check to avoid error on filter operation
								//await this.executeFunction((!this.isNullOrUndefined(this.functions['FUNCTION']) ? this.functions['FUNCTION'].filter(f => f.functionMode == 'Product' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK' && f.event == '') : this.functions['FUNCTION']), 'FUNCTION'); //added hardblock filter not to allow harblock func exe on load //to execute only product level functions, custom and other types will be triggered when rows are added in particular tab not from here
								//await this.executeFunction((!this.isNullOrUndefined(this.functions['WCF SERVICE']) ? this.functions['WCF SERVICE'].filter(f => f.functionMode == 'Product' && f.event == '') : this.functions['WCF SERVICE']), 'WCF SERVICE'); // On load wcf added on 03-Nov-2020
								//this.executeFormula((!this.isNullOrUndefined(this.functions['FORMULA']) ? this.functions['FORMULA'].filter(f => f.functionMode == 'Product' && f.event == '') : this.functions['FORMULA']));
								//await this.executeFunction(this.functions_all.filter(f => f.functionMode == 'Product' && f.ufD_Function_Output_Form.toUpperCase() != 'HARD BLOCK' && (f.ufD_Function_Output_Form.toUpperCase()=="VISIBLE" || f.ufD_Function_Output_Form.toUpperCase()=="INVISIBLE" || f.ufD_Function_Output_Form.toUpperCase()=="READONLY") && f.event == ''), "") //changed by devesh on 08-Mar-2021  //f.functionMode == 'Product' &&
								console.log('execute functions ends..')
								//this.loaderService.display(false);
								this.layoutloaded=true;
								this.loader=false;
								that.udfDropdownsLoaded = true;
								that.dataLoadCheck.next(true);
								that.controlsLoaded = true;
								that.dataLoadCheck.next(true);
								//this.assignControlSeq();	
							}
							else {
								/// Added this by OnkarE on 17-Dec-2021
								this.ErrorMessage = "Error in ReadFeildDetails. Please check logs for more details.";
								this.loader = false;
							}
						}
					);
				}
				
		}
		catch(error)
		{
			console.log("Error in SetUDF", error);
			//this.api.WriteErrorLogs("Error in SetUDF: "+error);
			this.layoutloaded=true;
			this.loader = false; /// Changed on 21-June-2021 on discussion with DeveshJ
		}	
		}

		assignControlSeq(){
			try {
				
				//setTimeout(function () {				
					console.log("Deal entry div",this.Dealentry);
					console.log("Custom tab div",this.Custom);
					console.log("UDF div",this.UDF);
					console.log("Custgrid div",this.CustGrid);
					console.log("PricingGrid div",this.PricingGrid);				

					if(this.template.dealEntryControlSequence != '' && !this.isNullOrUndefined(this.Dealentry))
					{
						let seq_Arr=this.template.dealEntryControlSequence.split("~");
						let NullElem=this.renderer.createElement('null');			
						let elem_Arr=[];
						seq_Arr.forEach(element => {
							switch(element.replace("#",""))
							{
								case "Custom":
									elem_Arr.push((this.Custom?this.Custom.nativeElement:NullElem));
									break;
								case "UDF":
									elem_Arr.push((this.UDF?this.UDF.nativeElement:NullElem));
									break;
								case "CustomerGrid":
									elem_Arr.push((this.CustGrid?this.CustGrid.nativeElement:NullElem));
									break;
								case "PricingGrid":
									elem_Arr.push((this.PricingGrid?this.PricingGrid.nativeElement:NullElem));
									break;
							}
						});
						
						for(let i=0;i<elem_Arr.length;i++)
						{						
							this.renderer.appendChild(this.Dealentry.nativeElement,elem_Arr[i]); //If element is already present, it will not add duplicate and rearrange the sequence itself
						}									

					}	
				// }.bind(this), 1000);
			}
			catch (e) {
				console.log("Error in assignControlSeq :", e)
			}
		}

		async GetCommonDataDropdownValues() {
			try{
			const tempPromise1 = this.api.GetCommonDataDropdownValues();
			await tempPromise1.then(  
				(data : any) => {  
					console.log("GetCommonDataDropdownValues: ", data)
					this.common_data = data.response
			});
		}catch(e){
			console.log("Error in GetCommonDataDropdownValues :", e)
		}
			
		}

		fillControlCombo(control: any, dt: any[]){
			try{
				//console.log("in fillControlCombo: ", this.dropdowns, control);
				if(control.udF_Feature1.includes("Custom Sort")){
					this.dropdowns[control.fieldName] = dt.sort((a,b) => a.customSort - b.customSort);
					this.searchArrays[control.fieldName] = dt.sort((a,b) => a.customSort - b.customSort);
				}
				else {
					this.dropdowns[control.fieldName] = dt;
					this.searchArrays[control.fieldName] = dt;
				}
				//console.log("Sorted datatype array: ", this.dropdowns);
			}
			catch(e){
				console.log("Error in : fillControlCombo", e)
				//this.api.WriteErrorLogs("Error in fillControlCombo: "+e);
			}
		}
		getRoundingRate(defaultValue: string, dataType1: string, dataType2: string) {
			try {
				let iDecimalrate: string = "0";
				if (defaultValue.trim() != "") {
					if (dataType1.toUpperCase() == 'CURRENCY') {
						var tempArr = this.defaultSearchArrays['CURRENCY'].filter(r => r.code == defaultValue)
						if (!this.isNullOrUndefined(tempArr)) {
							if (dataType2.toUpperCase() == 'AMOUNT') {
								iDecimalrate = tempArr[0].decimalAmount
							} else {
								iDecimalrate = tempArr[0].decimalRate
							}
						}
					} else if (dataType1.toUpperCase() == 'CURRENCY PAIR') {
						var tempArr = this.defaultSearchArrays['CURRENCY PAIR'].filter(r => r.code == defaultValue);
						if (!this.isNullOrUndefined(tempArr)) {
							iDecimalrate = tempArr[0].decimalRate
						}
					}
				}
				return iDecimalrate;
			} catch (e) {
				console.error("Error in getRoundingRate", e, defaultValue, dataType1, dataType2);
				//this.api.WriteErrorLogs("Error in getRoundingRate :"+e +" :"+defaultValue+" :"+ dataType1+" :"+ dataType2);
				console.log(defaultValue, dataType1, dataType2);
			}


		}
		generateCustomTabXML() {
			try {
				if (this.tableRow.length > 0) {
					let dtcustom = this.getCustomTabDetailsFromGrid();
					let xml;
					//logic for converting json to xml to be coded
					xml = JsonToXML.parse("CustomTab1", dtcustom);
					xml = xml.replace('<CustomTab1>', '<DocumentElement>'); //added replacement logic because parsing function was not assigning same parent name to child node so assigned name of all nodes to custom tab and then changed name of parent node to documentelement
					xml = xml.slice(0, xml.lastIndexOf('</CustomTab1>')) + xml.slice(xml.lastIndexOf('</CustomTab1>')).replace('</CustomTab1>', '</DocumentElement>');
					xml = xml.replace("<?xml version='1.0'?>", "");
					console.log("Custom tab xml to be saved", String(xml));
					///logic for assigning xml value to particular udf field
					if (this.sCustomTabUDFField != "") {
						const ctrl = this.controls.filter(c => c.fieldName == this.sCustomTabUDFField)[0];
						if (!this.isNullOrUndefined(ctrl)) {
							ctrl.value = String(xml);
							console.log("Xml value assigned to udf field", ctrl);
						}
					} else {
						///raise error of checking custom tab mapping if required
					}
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in generateCustomTabXML :"+error);
			} finally {}
		}
		GetCustomStaticTabDetails(template_Id: number) { //added by devesh for getting static details of custom tab
			try {
				this.api.GetCustomTabDetails(template_Id).subscribe((response: any) => {
					if (response.status === Status.Success) {
						console.log(response);
						this.CustomStaticTabDetails = response.response;
						console.log("Custom tab staic details:", this.CustomStaticTabDetails);
						if (!this.isNullOrUndefined(this.CustomStaticTabDetails) && this.CustomStaticTabDetails.length > 0) {
							let dtcustomtabstaticdetails = this.CustomStaticTabDetails.filter(c => c.cT_TabId == "tpCustom");
							if (!this.isNullOrUndefined(dtcustomtabstaticdetails) && dtcustomtabstaticdetails.length > 0) {
								this.sCustomTabUDFField = dtcustomtabstaticdetails[0].cT_UCP_CloneInward;
								this.iMaxRowCountForCustomTab = Number(dtcustomtabstaticdetails[0].cT_MaxRowCount);
							} else {
								this.sCustomTabUDFField = "";
								this.iMaxRowCountForCustomTab = 0;
							}
						}
					}
				});
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in GetCustomStaticTabDetails :"+error);
			} finally {}
		}
		getCustomTabDetailsFromGrid(): any[] {
			try {
				let cust_table = [];
				for (let j = 0; j < this.tableRow.length; j++) {
					var cust_row = {};
					for (let i = 0; i < this.CustomTabs.data.length; i++) {
						cust_row[this.CustomTabs.data[i].fieldName] = this.tableRow[j][i].value;
					}
					cust_table.push(cust_row);
				}
				console.log("new cust xml", cust_table);
				return cust_table;
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in getCustomTabDetailsFromGrid :"+error);
			} finally {}
		}
		setcustomtab() {
			try {
				if (this.sUCPMode === 'UCPQEN') { //if qen mode than normal flow
					this.IncTableRowCount();
				} else { //for other modes read custom tab data received from udf field
					if (this.sCustomTabUDFField != "") {
						let customtabxml = String(this.controls.filter(c => c.fieldName == this.sCustomTabUDFField)[0].value).replace(/\\n/g,"");
						let customtabjson;
						console.log("reverse mapped");
						var parseString = require('xml2js').parseString;
						parseString(customtabxml, function(err, result) {
							console.dir(result,err);
							// customtabjson=result.DocumentElement.CustomTab;
							customtabjson = (!this.isNullOrUndefined(result.DocumentElement.CustomTab) ? result.DocumentElement.CustomTab : result.DocumentElement.CustomTab1); //because few old templates have customtab1 in xml instead of customtab
						});
						console.log("WFL values of customtab", customtabjson);
						for (let i = 0; i < customtabjson.length; i++) {
							this.tableRow.push(JSON.parse(localStorage.getItem('dtcustomTab'+String(this.template.template_Id)))); //to push default data to keep rest parameters same and row count in sync received in wfl mode
						}
						for (let j = 0; j < this.tableRow.length; j++) { //row
							for (var key in customtabjson[j]) { //respective field value in xml 
								for (let k = 0; k < this.CustomTabs.data.length; k++) { //column
									if (customtabjson[j].hasOwnProperty(key)) {
										//console.log(key + ": " + obj[key]);
										if (this.tableRow[j][k].fieldName == String(key)) {
											this.tableRow[j][k].value = customtabjson[j][key][0]; //assigning value as value converted from xml to json comes in array format
											this.tableRow[j][k].currentValue = customtabjson[j][key][0];
										}
									}
								}
							}
						}
						console.log("Custom tab values in wfl mode", this.tableRow);
					}
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in setcustomtab :"+error);
			} finally {}
		}

		async InvokeHardBlockPromptFunctions() {
			try {
				let FunctionHardBlockProduct = [];
				this.hardblock_triggered=false;
				if (this.functions_all) {
					FunctionHardBlockProduct = this.functions_all.filter((f: any) => f.ufD_Function_Output_Form.toUpperCase() == 'HARD BLOCK'); //.filter(f=>f.functionMode=='Product')
				}

				switch (this.selectedBookingModel.toString().toUpperCase()) {
					case "PRODUCT":
					case "ORDER":
					case "RFQ":
					case "PRICE":
						FunctionHardBlockProduct = FunctionHardBlockProduct.filter(f => f.functionMode == 'Product' || f.functionMode === 'Custom');
						break;
					case "MARKET":
						FunctionHardBlockProduct = FunctionHardBlockProduct.filter(f => f.functionMode == 'Market' || f.functionMode == 'Product' || f.functionMode === 'Custom');
						break;
					case "DYNAMIC":
						FunctionHardBlockProduct = FunctionHardBlockProduct.filter(f => f.functionMode === 'Client' || f.functionMode == 'Product' || f.functionMode === 'Custom');
						break;
					default:
						FunctionHardBlockProduct = FunctionHardBlockProduct;
						break;

				}

				if (FunctionHardBlockProduct.length) {
					//this.loaderService.display(true);
					console.log("The hardblock functions are ", FunctionHardBlockProduct); //list of all hardblock functions
					await this.executeFunction(FunctionHardBlockProduct, "");				

				} 
				else {
					this.hardblock_triggered=false;
				}
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in InvokeHardBlockPromptFunctions :"+error);
			} finally {}
		}

		async InvokeWarningFunctions(sControltype:string,CallingFieldName:string,icallingRowIndex:number){
		try{
			let FunctionsWarning=[];
			let Clientwarningfunctions=[];
			let Marketwarningfunctions=[];		
			this.warning_triggered=false;
			if (this.functions_all) {
				FunctionsWarning = this.functions_all.filter((f: any) => f.ufD_Function_Output_Form.toUpperCase() == 'WARNING'); //.filter(f=>f.functionMode=='Product')
				console.log("List of warning functions: ",FunctionsWarning);
			}
			if (FunctionsWarning.length>0){
			switch (sControltype.toUpperCase()) {
				case "UDF":
						FunctionsWarning=FunctionsWarning.filter(f=>f.functionMode=="Product").filter((f: any) => f.ufD_CSV_Input.split('~').includes(CallingFieldName) || f.ufD_CSV_Input.split('~').includes(CallingFieldName.toUpperCase()));
						await this.executeFunction(FunctionsWarning,"");
					break;
				case "GRID":
					Clientwarningfunctions = FunctionsWarning.filter(f => f.functionMode == 'Client').filter((f: any) => f.ufD_CSV_Input.split('~').includes(CallingFieldName) || f.ufD_CSV_Input.split('~').includes(CallingFieldName.toUpperCase()));
					Marketwarningfunctions = FunctionsWarning.filter(f => f.functionMode == 'Market').filter((f: any) => f.ufD_CSV_Input.split('~').includes(CallingFieldName) || f.ufD_CSV_Input.split('~').includes(CallingFieldName.toUpperCase()));
					if (icallingRowIndex>-1){
					this.cgrowindex=icallingRowIndex;
					for (const element of this.custGridTableRow[icallingRowIndex]){
						if (element.columnName == "clmnCustomerLeg" && element.value == 'Customer') { // to check which leg functions to be executed
							if (Clientwarningfunctions.length) {
								await this.executeFunction(Clientwarningfunctions, "");
								break;
							}
						} 
						else if (element.columnName == "clmnCustomerLeg" && element.value == 'CounterParty') {
							if (Marketwarningfunctions.length) {
								await this.executeFunction(Marketwarningfunctions, "");
								break;
							}
						}					
					}
					}
					else {
						for (let i = 0; i < this.custGridTableRow.length; i++) { //for loop for triggering func for every row
							this.customergrid_all_triggered = true; //setting boolean to true
							this.cgrowindex = i;
							for (const element of this.custGridTableRow[i]){
								if (element.columnName == "clmnCustomerLeg" && element.value == 'Customer') { // to check which leg functions to be executed
									if (Clientwarningfunctions.length) {
										await this.executeFunction(Clientwarningfunctions, "",i);
										break;
									}
								} 
								else if (element.columnName == "clmnCustomerLeg" && element.value == 'CounterParty') {
									if (Marketwarningfunctions.length) {
										await this.executeFunction(Marketwarningfunctions, "",i);
										break;
									}
								}					
							}
						}
					}
					break;
				case "CUSTOM":
					//to be coded
					break;	
				default:
					break;
			}
		}
			// if(this.sWarningtextArr.length>0){
			// 	var tempStr = "";
			// 	for (let i = 0; i < this.sWarningtextArr.length; i++) {
			// 			this.sWarningtextArr[i] = this.sWarningtextArr[i].toString() + "\n";
			// 		}
			// 	tempStr = this.sWarningtextArr.join("");
			// 	this.ErrorMessage = tempStr;
			// 	this.warning_triggered=true;
			// }
			// else{
			// 	this.warning_triggered=false;
			// }
		}
		catch(error){
			//this.api.WriteErrorLogs("Error in InvokeWarningFunctions :"+error);
		}
		}
		generateternarycode(command: string): string {
			let strCode: string = "";
			let strLegs: string[] = null;
			let strMain: string = "";
			let EndIndex: number = 0;
			let middleIndex: number = 0;
			let StartIndex: number = 0;
			let length: number = -1;
			let closeIndex: number = 0;
			try {
				strMain = command;
				strMain = strMain.trim();
				strLegs = strMain.split(',');
				if (strLegs[0].trim().toUpperCase().startsWith("IF")) {
					strMain = strMain.replace(strMain.substring(0, 3), ""); //(0, 3);
					strMain = strMain.slice(0, -1); //replace(strMain.substring(strMain.length - 1,1), "").trim();//strMain.Remove((strMain.length - 1), 1).Trim();
					length = strMain.length;
					strLegs = strMain.split(',');
					StartIndex = strMain.indexOf(",");
					EndIndex = strMain.lastIndexOf(",");
					middleIndex = strMain.indexOf(",", (StartIndex + 1));
					if ((StartIndex < 0)) {
						StartIndex = 0;
					}

					if ((EndIndex < 0)) {
						EndIndex = 0;
					}

					if ((middleIndex < 0)) {
						middleIndex = 0;
					}

					strCode = strCode + "if(" + strLegs[0] + ")";
					if (strLegs[1].toUpperCase().startsWith("IF")) {
						closeIndex = this.getCloseIndex(strMain.indexOf("("), strMain.replace(strMain.substring(0, StartIndex), "")) //Remove(0, StartIndex));
						strCode = strCode + (this.generateternarycode(strMain.substr((StartIndex + 1), ((Number(closeIndex) - StartIndex) + 4))));
					} else {
						strCode = strCode + (this.generateternarycode(strMain.substr((StartIndex + 1), (EndIndex - (StartIndex - 1)))));
					}

					strCode = strCode + " else{";
					if (strLegs[1].toUpperCase().startsWith("IF")) {
						strCode = strCode + (this.generateternarycode(strMain.substr((Number(closeIndex) + StartIndex), (length - (Number(closeIndex) - 5)))));
					} else {
						strCode = strCode + (this.generateternarycode(strMain.substr((middleIndex + 1), (length - (middleIndex - 1)))));
					}

					strCode = strCode + "}";
				} else {
					//strCode=strCode+"{" + strLegs[0]+"}";
					strCode = strCode + strLegs[0] + ";";
				}

				return strCode.toString();
			} catch (ex /*:Exception*/ ) {
				//this.api.WriteErrorLogs("Error in generateternarycode :"+ex);
				return "";
			}
		}

		getCloseIndex(iIndex: number, str: string): number {
			try {
				let i: number = 0;
				iIndex = iIndex;
				let currentIndex: number = 0;
				let boolOpenFound: boolean = false;
				str = str.trim();
				for (let Chr = 0; Chr < str.length; Chr++) {
					currentIndex = (currentIndex + 1);
					if ((str.charAt(Chr) == '(')) {
						i = (i + 1);
						boolOpenFound = true;
					} else if ((str.charAt(Chr) == ')')) {
						i = (i - 1);
					}

					if (((i == 0) && boolOpenFound)) {
						return currentIndex;
					}
				}

				return -1;
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in getCloseIndex :"+error);
			} finally {}
		}

		showhHideTabs() {
			try{
			//// Added by OnkarE on 19-Feb-2021
			this.showtabsFlag = !this.showtabsFlag;
			if (this.showtabsFlag) {
				this.showTabText = "Hide Tabs";
				this.showtabs_visible_css=true;
			} else {
				this.showTabText = "Show Tabs";
				this.selectedTabName.toUpperCase()=="TPTRADECAPTURE"?this.showtabs_visible_css=false:this.showtabs_visible_css=true;
				}
			}
			catch(e)
			{
				console.log("Error in showhHideTabs :", e)
			}
		}

		GetMappedTabsDetails() {
			//// Added by OnkarE on 19-Feb-2021
			console.log("GetMappedTabsDetails data callllllll........ ", this.iTemplateID.toString(), "0", this.sUCPMode, this.userGroup);
			try {
			//Added by OnkarE || 25-10-2023
				this.api.GetMappedTabsDetails(this.iTemplateID.toString(), "0", this.sUCPMode, this.userGroup, this.Login_Id).then(
					(response: any) => {
						if (response.status === Status.Success) {
							const res = response.response;
							res.forEach(element => {
								element.isActive = false;
							});
							console.log("GetMappedTabsDetails data........ ", res);
							this.mappedTabs = res;
							this.mappedTabsExtra = res;
							var index = this.mappedTabs.findIndex(x => x.uciF_Field_Name == "tpTradeCapture");
							var foundItem;
							if (index != -1) {
								foundItem = this.mappedTabs.splice(index, 1)[0]
							} else {
								foundItem = { uciF_Field_Name: "tpTradeCapture", uciF_Display_Name: "Product Parameters", uciF_Misc3: 1 };
							}
							foundItem.isActive = true;
							console.log("Found Item: ", foundItem);
							this.mappedTabs.unshift(foundItem);
							this.mappedTabsExtra = this.mappedTabs;
							console.log("MappedTabs: ", this.mappedTabs);
						}
					}
				);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in GetMappedTabsDetails :"+error);
			} finally {}
		}

		applyTabsFilter() {
			//// Added by OnkarE on 22-Feb-2021
			
			try {
				this.mappedTabs = this.mappedTabsExtra;
				this.mappedTabs = this.mappedTabs.filter((e: any) => e.uciF_Display_Name.toUpperCase().includes(this.tabSearch.toUpperCase()));
				console.log("applyTabsFilter........ ", this.tabSearch, this.mappedTabs);
			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in applyTabsFilter :"+error);
			} finally {}
		}

		openClickedTab(data: any) {
			//// Added by OnkarE on 22-Feb-2021
			console.log("openClickedTab........ ", data);
			try {
				this.selectedTabName = data.uciF_Field_Name;		// Added by BhagyashriB on 26-Apr-2021 when clicked on 'Show tabs' item
				this.mappedTabs = this.mappedTabsExtra;
				// this.tabSearch = "";
				this.mappedTabs.forEach(element => {
					if (data.uciF_Field_Name === element.uciF_Field_Name) {
						element.isActive = true;
					} else
						element.isActive = false;
				});
				console.log('selectedTabName........ ', this.selectedTabName.toUpperCase());
				switch (this.selectedTabName.toUpperCase()) {		// Added by BhagyashriB on 26-Apr-2021 when clicked on 'Show tabs' item
					case 'TPCSVSCHEDULE':
						this.h2DealEntry = 'Deal Entry (View Schedule)';
						this.showtabs_visible_css=true;
						this.CreateAppTableDataContract();
						break;
					case 'TPCHANGEAUDIT':
						this.h2DealEntry = "Deal Entry (Amendment)";
						this.showtabs_visible_css=true;
						this.CreateAppTableDataContract();
						break
					case 'UCP_PRODUCTSCHEDULE':
						this.h2DealEntry = "Deal Entry (UCP Product Schedule)";
						this.showtabs_visible_css=true;
						this.CreateAppTableDataContract();
						break;
				 	case 'TPPACKAGESCHEDULE':
						this.h2DealEntry = "Deal Entry (Package Schedule)";
						this.showtabs_visible_css=true;
						this.CreateAppTableDataContract();
						break;
					case 'TPINDEXHISTORY':
						this.h2DealEntry= "Deal Entry (Index History)";
						this.showtabs_visible_css=true;
						break;	
					default:
						this.h2DealEntry = "Deal Entry";
						(this.showTabText == "Hide Tabs"?this.showtabs_visible_css=true:this.showtabs_visible_css=false);
						break;
				}
				this.applyTabsFilter();

			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in openClickedTab :"+error);
			} finally {}
		}

		CreateAppTableDataContract() {
			//// Added by OnkarE on 22-Feb-2021
			this.oUCPAppTablesData = [];
			console.log("CreateAppTableDataContract........ ", this.oUCPAppTablesData);
			try {
				this.controls.forEach(element => {
					if (element.fieldName != '' && !this.isNullOrUndefined(element.dataType)) 
					{
						var tempVal = "";
						if (element.value === '' || element.value === undefined || element.value === null) 
						{
							tempVal = 'NULLVALUE';
						}
						else
						{					
						switch (element.dataType.toUpperCase()) {
							case "NUMBER":
							case "AMOUNT":
							case "DOUBLE":
							case "INTEGER":
							case "FX VALUE":
								tempVal = element.value.toString().replace(",", "");
								break;
							case "DATE":
								tempVal = element.value.toString();
								break;
							case "DATETIME":
								tempVal = element.value.toString();
								break;
							case "COMMON DATA":
								if (element.udF_Feature1.toUpperCase().includes("MULTISELECT DROPDOWN"))
									tempVal = this.convertToString(element.value.replace(",", "~"));
								else
									tempVal = this.convertToString(element.value);
								break;
							default:
								tempVal = this.convertToString(element.value);
								break;
						}

						}
						// if (element.value === '' || element.value === undefined || element.value === null) {
						// 	tempVal = 'NULLVALUE';
						// }

						this.oUCPAppTablesData.push({
							Template_Code: this.sTemplateCode,
							Template_ID: this.iTemplateID,
							Field_Name: element.fieldName,
							UDF_Format: element.udF_Format,
							Field_Data_Type: element.dataType,
							Field_Value: tempVal
						});
					}
				});
				console.log("oUCPApptabledata is::: ", this.oUCPAppTablesData);

			} catch (error) {
				console.error(error);
				//this.api.WriteErrorLogs("Error in CreateAppTableDataContract :"+error);
			} finally {}
		}

		setcontrolsVisibility() {
			try{
			var sCallingModeControlsVisibility: string = "";
			sCallingModeControlsVisibility = this.template.dealEntryControlsVisibility;
			console.log("sCallingModeControlsVisibility ", sCallingModeControlsVisibility);
			(sCallingModeControlsVisibility.includes('Custom')?this.ShowCustom=true:this.ShowCustom=false);
			(sCallingModeControlsVisibility.includes('UDF')?this.ShowUDF=true:this.ShowUDF=false);
			(sCallingModeControlsVisibility.includes('CustomerGrid')?this.ShowCustGrid=true:this.ShowCustGrid=false);
			(sCallingModeControlsVisibility.includes('StaticField')?this.ShowStaticField=true:this.ShowStaticField=false);
			
			switch (this.Embedded_Control.toUpperCase()) {
				case "MULTIUCP":					
					this.IsSavingProcedureInSingleAction=true;
					break;
				case "POSTCARD":					
					this.IsSavingProcedureInSingleAction=true;
					break;
				default:					
					console.log("Save Visibility Check: ", this.SMADataObj, this.ShowStaticField)
					if(this.SMADataObj != null && this.SMADataObj.saveVisibility.toUpperCase() == 'TRUE' && this.ShowStaticField == true) {
							this.IsSavingProcedureInSingleAction = false;
					}
					else 
						this.IsSavingProcedureInSingleAction= true;
					break;
			}
				}catch(e){
					console.log("Error in CustomerGridValueChange :",e)
				}
		}

		///////// Native FX section starts here ////////////////////
		AssignParentControlValuesToUCPControl() {
			try{
			/// Added by OnkarE to handle fx native intersection on 08-Mar-2021
			let iUDFFieldPosition = -1;
			let isTransitive = false;
			console.log("AssignParentControlValuesToUCPControl is:: ", this.FX_Native_Fields, this.controls);
			if (!this.isNullOrUndefined(this.FX_Native_Fields)) //added by devesh to avoid null errors
			{
			this.FX_Native_Fields.forEach(element => {
				let sUDFField = element.ucP_Clone_Field;
				for (let i = 0; i < this.controls.length; i++) {
					if (this.controls[i].fieldName === sUDFField) {
						if (this.controls[i].value === element.value) {
							isTransitive = false;
						} else {
							isTransitive = true;
						}
						this.controls[i].value = element.value;
						this.controls[i].currentValue = element.value;
						if (isTransitive) {
							this.udfFieldValueChange(this.controls[i]);
							this.InvokeIntersectionFieldMapping("UDF", sUDFField, -1);
						}
					}
				}
			});
			}		
			console.log("After intresection.... ", this.controls);
				}catch(e){
					console.log("Error in AssignParentControlValuesToUCPControl :", e)
				}
		}

		AssignUCPControlValuesToParentControl(){
			try{
			/// Added by OnkarE to handle fx native intersection on 24-Mar-2021
			// console.log("AssignUCPControlValuesToParentControl...", this.Embedded_Control, this.FX_Native_Fields, this.controls);
			let dtTemp = [];
			if(!this.isNullOrUndefined(this.FX_Native_Fields)) //added by devesh to avoid null errors
			{
			dtTemp = this.FX_Native_Fields;
			dtTemp.forEach(element => {
				let sUDFField = element.ucP_Clone_Field;
				for (let i = 0; i < this.controls.length; i++) {
					if (this.controls[i].fieldName === sUDFField) {
						element.value = this.controls[i].value;
					}
				}
			});
			this.FX_Native_Fields = dtTemp;
			this.HandleFXNIntersection.emit(this.FX_Native_Fields);
			// console.log("Emitting from deal entry:: ", this.FX_Native_Fields, this.HandleFXNIntersection);
			}
			}catch(e){
				console.log("Error in AssignUCPControlValuesToParentControl :", e)
			}

		}
		///////// Native FX section ends here /////////////////////////
		async WFLButtonActions(btn: any) {

			try {
				console.log("button clicked", btn);
				let sWFLButtonActionMode = btn.mode;
				this.sWFLButtonActionText = btn.caption;
				this.sWFLButtonActionCode = btn.wB_Code;
				let sSecondaryExecutionType = btn.wB_execution_object_type_sec;
				this.sSecondaryExecutionCode = btn.wB_execution_object_subtype_sec;
				//let sLastModifiedAtfortoken = this.api.GetLastModifiedAt //to be coded
				let sEditRightGroupNameMappedToWFLButton = btn.wB_execution_object_type_sec.toString() + "|" + btn.wB_execution_object_subtype_sec.toString(); //'Mode and EditGroupName
				let sMisc5 = btn.wB_Misc5.toString();
				let iRowIndex: number = -1; //Added by Devesh on 23-Feb-2022
				this.EditModeMappedTOWFBMSTField = "";
				if (sMisc5 != "") {
					let WFLMessage = sMisc5.split("~");
					this.sSaveMessageText = WFLMessage[0];
					this.sCancelMessageText = "";
					//Session.Add("sSaveMessageTextWFLActionButton" & SessionId, sSaveMessageText)
					if (WFLMessage.length > 1)
						this.sCancelMessageText = WFLMessage[1];
					else
						this.sCancelMessageText = ""
					//Session.Add("sCancelMessageTextWFLActionButton" & SessionId, sCancelMessageText)
				}
				if (this.sSaveMessageText == "") { //Added by SwatiP on 16-9-2021
					this.sSaveMessageText = "Yes"
				}
				if (this.sCancelMessageText == "") {
					this.sCancelMessageText = "No"
				}
				if (sEditRightGroupNameMappedToWFLButton != "") {
					let sSplit = sEditRightGroupNameMappedToWFLButton.split("|");
					if (sSplit[0].toString().toUpperCase() == "MODE" || sSplit[0].toString().toUpperCase() == "TAB")
						sEditRightGroupNameMappedToWFLButton = sSplit[1].toString();
					this.EditModeMappedTOWFBMSTField = sEditRightGroupNameMappedToWFLButton;
				}
				if (sWFLButtonActionMode.toString().toUpperCase().includes("TAB")) {
					//to be coded as show tab functionality not done yet
				} else if (sWFLButtonActionMode.toString().toUpperCase().includes("SP")) {
					//to be coded
					let sSPname = btn.modeValue.toString();
					if (sSPname != "") {
						const iPushTokenReq = {
							ButtonName: btn.caption.toString(),
							NoteMasterID: Number(this.iNoteMasterID), //int
							Remark: "",
							TemplateId: Number(this.iTemplateID), //int
							TokenId: Number(this.sTokenId), //int
							QueueId: Number(this.QueueNo), //int
							UserGroup: this.userGroup,
							UserID: this.Login_Id,
							SPName: btn.modeValue.toString(),
							NoteDealId: this.iNoteDealID,
							GroupID: 0
						};
						this.api.WFLButtonSPAction(iPushTokenReq).subscribe(
							(resp: any) => {
								if (resp.status == Status.Success) {
									let oPushTokenRes = resp.response;
									console.log("Response after sp", oPushTokenRes);
									this.QueueNo = oPushTokenRes.queueId;
									this.sUCPMode = UCPMODE[UCPMODE.UCPWFL];
									this.oEditrights = []; //Added as per dotnet code for override edit rights
									this.oEditrightsCustom = [];
									this.oEditrightsCustomer = [];
									this.DrawWFLButtons();
									this.setUDFFields(); //swa try
									this.getDealDetails();
									this.Message = oPushTokenRes.message;
								}
							});
					}
				} else if (sWFLButtonActionMode.toString().toUpperCase().includes("MODE")) {
					console.log("Mode passed is ", btn.modeValue.toString().toUpperCase());
					if (btn.modeValue.toString().toUpperCase() == "PRICE") {} else {
						switch (btn.modeValue.toString().toUpperCase()) //added only few modes in switch case as of now for testing
						{
							case "UCPFED":
								this.sUCPMode = UCPMODE[UCPMODE.UCPFED];
								this.cboHedgingtype = false;
								sessionStorage.setItem("prdAmdButton", JSON.stringify(btn));
								this.loader = true;
								await this.GetTemplateRelatedMapping();
								this.getDealDetails(); // Added by OnkarE on 17-Apr-2023
								await this.setUDFFields();
								this.InvokeButtonLinkedFunctions('WB_' + btn.wB_ID);
								this.DrawAmendModeCancelSaveButtons(btn, this.sSaveMessageText, this.sCancelMessageText);
								//addcolumnsincustomergrid() pending part
								break;
							case "FEDCHIL":
								this.sUCPMode = UCPMODE[UCPMODE.UCPFED];
								sessionStorage.setItem("prdAmdButton", JSON.stringify(btn));
								this.loader = true;
								await this.GetTemplateRelatedMapping();
								this.getDealDetails(); // Added by OnkarE on 17-Apr-2023
								await this.setUDFFields();
								this.InvokeButtonLinkedFunctions('WB_' + btn.wB_ID);
								this.DrawAmendModeCancelSaveButtons(btn, this.sSaveMessageText, this.sCancelMessageText);
								break;
							case "UCPORD":
							case "FEDMAK":
							case "FEDCHK":
							case "PRDCHK":
							case "FEDREJ":
								break;
							case "PRDAMD":
							case "PRDMAK":
								this.sUCPMode = UCPMODE[UCPMODE.PRDAMD];
								sessionStorage.setItem("prdAmdButton", JSON.stringify(btn));
								this.loader = true;
								await this.GetTemplateRelatedMapping();
								this.getDealDetails(); // Added by OnkarE on 17-Apr-2023
								await this.setUDFFields();
								this.InvokeButtonLinkedFunctions('WB_' + btn.wB_ID);
								this.DrawAmendModeCancelSaveButtons(btn, this.sSaveMessageText, this.sCancelMessageText);
								break;
							case "DLSAMD":
								this.sUCPMode = UCPMODE[UCPMODE.DLSAMD];
								this.btnPoolreadonly = true;
								sessionStorage.setItem("prdAmdButton", JSON.stringify(btn));
								this.loader = true;
								await this.GetTemplateRelatedMapping();
								this.getDealDetails(); // Added by OnkarE on 17-Apr-2023
								await this.setUDFFields();
								this.InvokeButtonLinkedFunctions('WB_' + btn.wB_ID);
								this.DrawAmendModeCancelSaveButtons(btn, this.sSaveMessageText, this.sCancelMessageText);
								break;
							case "DLSADD":
								this.sUCPMode = UCPMODE[UCPMODE.DLSADD];
								this.btnPoolreadonly = false;
								sessionStorage.setItem("prdAmdButton", JSON.stringify(btn));
								this.loader = true;
								this.GetCustomerGridRowCount(); // Added by OnkarE on 17-Apr-2023
								await this.GetTemplateRelatedMapping();
								this.getDealDetails(); // Added by OnkarE on 17-Apr-2023
								await this.setUDFFields();
								if(Number(this.iCurrentDealCount) > 0) { // Added by OnkarE on 17-Apr-2023
									this.selectedBookingModel = "Pooling";
								}
								else {
									this.selectedBookingModel = "Dynamic";
								}
								//this.changeHedgeType();	
								//this.IncCustGridTableRowCount();

								this.parentCustGridLength = Number(this.custGridTableRow.length - 1); // Added by OnkarE on 06-May-2023
								console.log("parentCustGridLength: ", this.parentCustGridLength)  
								this.AddClientLegToCustomerGrid(this.custGridTableRow.length, this.custGridTableRow.length-1)
								this.DisableCustomerGridData();
								this.InvokeButtonLinkedFunctions('WB_' + btn.wB_ID);
								this.DrawAmendModeCancelSaveButtons(btn, this.sSaveMessageText, this.sCancelMessageText);
								break;
							case "UCPPRC":
								break;
							case "UNWIND":
								this.sUCPMode = UCPMODE[UCPMODE.UCPUNW];
								this.btnPoolreadonly = true;
								if (this.iNoteDealID != "") {
									for (let j = 0; j < this.custGridTableRow.length; j++) //as per dotnet code to get row index from note_deal_id
									{
										this.custGridTableRow[j].forEach(element => {
											if (element.columnName == "Note_Deal_Id") {
												if (element.value == this.iNoteDealID) {
													iRowIndex = j;
												}
											}
										});
									}
								}
								sessionStorage.setItem("prdAmdButton", JSON.stringify(btn));
								this.loader = true;
								await this.GetTemplateRelatedMapping();
								this.getDealDetails(); // Added by OnkarE on 17-Apr-2023

								await this.setUDFFields();
								if ((this.sUCPMode == "UCPUNW" || this.sUCPMode == "UCPREV") && iRowIndex != -1) //for unwind & other related cases
								{
									await this.AddClientLegToCustomerGrid(this.custGridTableRow.length, iRowIndex); //added new function to avoid code complexity due to other modes being included
								}
								this.InvokeButtonLinkedFunctions('WB_' + btn.wB_ID);
								this.DrawAmendModeCancelSaveButtons(btn, this.sSaveMessageText, this.sCancelMessageText);
								break;
							case "UCPREV":
								this.sUCPMode = UCPMODE[UCPMODE.UCPREV];
								this.btnPoolreadonly = true;
								if (this.iNoteDealID != "") {
									for (let j = 0; j < this.custGridTableRow.length; j++) //as per dotnet code to get row index from note_deal_id
									{
										this.custGridTableRow[j].forEach(element => {
											if (element.columnName == "Note_Deal_Id") {
												if (element.value == this.iNoteDealID) {
													iRowIndex = j;
												}
											}
										});
									}
								}
								sessionStorage.setItem("prdAmdButton", JSON.stringify(btn));
								this.loader = true;
								await this.GetTemplateRelatedMapping();
								this.getDealDetails(); // Added by OnkarE on 17-Apr-2023
								await this.setUDFFields();
								if ((this.sUCPMode == "UCPUNW" || this.sUCPMode == "UCPREV") && iRowIndex != -1) //for unwind & other related cases
								{
									await this.AddClientLegToCustomerGrid(this.custGridTableRow.length, iRowIndex); //added new function to avoid code complexity due to other modes being included
								}
								this.InvokeButtonLinkedFunctions('WB_' + btn.wB_ID);
								this.DrawAmendModeCancelSaveButtons(btn, this.sSaveMessageText, this.sCancelMessageText);
								break;
						}
		
		
					}
				}
			} catch (error) {
				//this.api.WriteErrorLogs("Error in WFLButtonActions :"+error);
			}
		}

		async GetCustomerGridRowCount()
		{
			try 
			{			
				this.api.GetCustomerGridRowCount(Number(this.iNoteMasterID)).subscribe(
					(response: any) => {
						if (response.status === Status.Success) {
							const res = response.response;				
							if (res) 
							{
								this.iCurrentDealCount = res;
							}
						}
					}
				);
				
			}
			catch (error) 
			{
				
			}
		}

		// Added this function by OnkarE on 19-Apr-2023
		DisableCustomerGridData() {
			try {
				console.log("inside DisableCustomerGridData ", this.custGridTableRow, this.CustGridWFLRow, this.iCurrentDealCount);
				if(Number(this.iCurrentDealCount) > 0){
					for (let i = 0; i < Number(this.iCurrentDealCount); i++) {
						for (let j = 0; j < this.custGridTableRow[i].length; j++) {
							this.custGridTableRow[i][j].readOnly = 'Y';
						}					
					}
				}
				console.log("inside 2 DisableCustomerGridData ", this.custGridTableRow, this.CustGridWFLRow, this.iCurrentDealCount);
			}
			catch (e) {
				console.log("Error in DisableCustomerGridData :", e);
			}
		}

		BindCustomerGridData() { /// Added by OnkarE on 30-Dec-2021 -- Equivalent function to dgvCustCpty_RowDataBound function in .Net 
			try {
				// Step 1 -  Disable All columns in customer grid 
				// Setp 2 - Apply properties from Dynamic Customer Grid Mapping - Done aleady from SP
				if(this.sUCPMode == 'UCPFED' || this.sUCPMode == 'DLSAMD') {
					for (let j = 0; j < this.custGridTableRow.length; j++) { 
						for (let k = 0; k < this.CustomerGrid.data.length; k++) {
							if(this.sUCPMode == 'UCPFED') {
								this.custGridTableRow[j][k].readOnly = 'Y';
							}
							for (let i = 0; i < this.oEditrightsCustomer.length; i++) {
								// console.log("UCPFED mode:1 ", this.sSecondaryExecutionCode, this.oEditrightsCustomer[i].eR_Group_Name, this.custGridTableRow[j][k].columnName, this.oEditrightsCustomer[i].eR_UDF_Field);
								if(this.sSecondaryExecutionCode == this.oEditrightsCustomer[i].eR_Group_Name) {
									// Step 3 - Apply properties from Edit Rights
									// console.log("UCPFED mode:2 ", this.custGridTableRow[j][k].columnName, this.oEditrightsCustomer[i].eR_UDF_Field);
									if(this.custGridTableRow[j][k].columnName == this.oEditrightsCustomer[i].eR_UDF_Field){
										console.log("UCPFED mode:3 ", this.custGridTableRow[j][k].columnName, this.oEditrightsCustomer[i].eR_UDF_Field);
										this.custGridTableRow[j][k].visible = this.oEditrightsCustomer[i].eR_Visible_YN.substring(0, 1).toUpperCase();
										this.custGridTableRow[j][k].readOnly = this.oEditrightsCustomer[i].eR_Visible_YN.substring(1, 2).toUpperCase();
										this.custGridTableRow[j][k].mandatory = this.oEditrightsCustomer[i].eR_Visible_YN.substring(2, 3).toUpperCase();
									}
								}								
							}

						}
					}
				}
				console.log("Selected booking model is:: ", this.selectedBookingModel);                         
			}
			catch (e) {
				console.log("Error in addColumnInCustomerGrid :", e);
			}
		}

		DrawAmendModeCancelSaveButtons(sWFLbtn:any,sSaveText:string,sCancelText:string) 
		{
			try
			{
			console.log("button who's Yes/No will be displayed",sWFLbtn, sSaveText,sCancelText);
			sWFLbtn.showbtn=false;
			this.dtWFLButtons.forEach(btn => {btn.readonly=true});
			this.WFLqueueButtons.forEach(btn => {btn.readonly=true});
			}
			catch(error)
			{
				//this.api.WriteErrorLogs("Error in DrawAmendModeCancelSaveButtons :"+error);
			}
		}
		SaveDataAmendMode()
		{
			try
			{
				console.log("Save Data Amend Mode: ", this.iNoteMasterID)
				this.SaveData();
			}
			catch(error){
				//this.api.WriteErrorLogs("Error in SaveDataAmendMode :"+error);
			}
		}
		RefreshWFLMode()
		{
			try
			{
				this.sUCPMode=UCPMODE[UCPMODE.UCPWFL];
				this.cboHedgingtype=true;
				this.loader = true;
				//this.dtWFLButtons.forEach(btn => {btn.readonly=false});
				this.fillHedgeType(); // Added by OnkarE on 05-May-2023 to set hedging type back to original
				this.GetTemplateRelatedMapping();
				this.DrawWFLButtons();
				this.sWFLButtonActionText="";
				this.setUDFFields();
			}
			catch(error){
				//this.api.WriteErrorLogs("Error in RefreshWFLMode :"+error);
			}
		}
		SaveDataAmendModeNext(){
			// Added by OnkarE on 30-Apr-2021. This function will be called after saveucp success in prdamd mode.
			try
			{
				var btnDetails = JSON.parse(sessionStorage.getItem("prdAmdButton"));
				console.log("Save Data Amend Mode Next: ", this.iNoteMasterID, this.sTokenId, this.QueueNo, this.iTemplateID, btnDetails);
				const token = { "token" : {
					TemplateId : Number(this.iTemplateID),
					TokenId : Number(this.sTokenId),
					QueueId : Number(this.QueueNo),
					UserGroup : this.userGroup,
					UserID : this.Login_Id,
					ButtonName: btnDetails.caption.toString(), 
					NoteMasterID:Number(this.iNoteMasterID) , 
					Remark: "", 
					SPName: btnDetails.modeValue.toString(),
					NoteDealId:this.iNoteDealID,
					GroupID: 0
				} }
				console.log("Push token Inputs: ", token);
				this.api.Pushtoken(token).subscribe(
					(response: any) => {
						if (response.status === Status.Success) {
							const res = response.response;
							console.log("Push Token Response:: ", res)
							if(res){
								this.QueueNo = res.QueueId;
								if(this.Message == ''){
									this.Message = res.Message;
								}
							}
							else {
								this.Message = "Deal cannot be saved.";
							}
							this.sUCPMode = UCPMODE[UCPMODE.UCPWFL];
							this.initializeUCPControl(this.sUCPMode);
						}
					}
				);
				
			}
			catch(error){
				//this.api.WriteErrorLogs("Error in SaveDataAmendModeNext :"+error);
			}
		}

		SetProductSchedule(_schedule:any)
		{
			try {
				console.log("Set prod sche")
				this.oProductSchedule=[];
				this.oProductSchedule=_schedule;
				
			} catch (error) {
				//this.api.WriteErrorLogs("Error in SetProductSchedule :"+error);
			}
		}

		SetViewSchedule(_viewSchedule: any[]) {		//Added by BhagyashriB on 15-Sept-2021 | for view schedule tab
			try	{
				this.oViewSchedule = [];
				this.oViewSchedule = _viewSchedule;
			} catch (error) {
				//this.api.WriteErrorLogs("Error in SetViewSchedule :" + error);
			}
		}

		SetPackageSchedule(_customTabDetails: any[]) {		//Added by BhagyashriB on 16-Sept-2021 | for package schedule
			try {
				this.CustomStaticTabDetails = _customTabDetails;
				//IsInwardIntersectionMappingChanged = true		//session variable from .net
				//LastTabVisited = "TPPACKAGESCHEDULE"
			} catch (error) {
				//this.api.WriteErrorLogs("Error in SetPackageSchedule :" + error);
			}
		}


		CreateProdSchedDataContract(dtSchedule:any):any{
			let dtProdschedule=[];
			try {
			if(dtSchedule.length>0){
				for(let i=0;i<dtSchedule.length;i++){        
				dtProdschedule.push({
				'PS_Fixing_Date':dtSchedule[i].pS_Fixing_Date,
				'PS_Settlement_Date':dtSchedule[i].pS_Settlement_Date,
				'PS_TSM_Code':dtSchedule[i].pS_TSM_Code,
				'PS_TSM_Id': dtSchedule[i].pS_TSM_Id,
				'PS_NM_Id' :dtSchedule[i].pS_NM_Id,
				'PS_Accrual_StartDate':   dtSchedule[i].pS_Accrual_StartDate,
				'PS_Accrual_EndDate' :   dtSchedule[i].pS_Accrual_EndDate,
				'PS_Message_Format' : dtSchedule[i].pS_Message_Format,
				'PS_Created_AT' :  dtSchedule[i].pS_Created_AT,
				'PS_Created_By' : dtSchedule[i].pS_Created_By,
				'PS_Updated_AT' : new Date(Date.now()).toDateString(),
				'PS_Updated_By' : this.Login_Id,
				'PS_Active_YN'  : dtSchedule[i].pS_Active_YN,
				'PS_Remark'     : dtSchedule[i].pS_Remark,
				'PS_Id'         : dtSchedule[i].pS_Id,
				'PS_Misc1'      : dtSchedule[i].pS_Misc1,
				'PS_Misc2'      : dtSchedule[i].pS_Misc2,
				'PS_Misc3'      : dtSchedule[i].pS_Misc3,
				'PS_Status'     : dtSchedule[i].pS_Status
				});
			}       
			}
			console.log("Data contract of Product schedule",dtProdschedule);
			return dtProdschedule;
		
			
			} catch (error) {
			
			}
		}

		async GenerateProductSchedule()
		{
			try 
			{
				let response: any;
				this.CreateAppTableDataContract();
				response = await this.api.GetProductSchedule(Number(this.iTemplateID), "", this.oUCPAppTablesData, true,[] , false, "", Number(this.entityId), this.sUCPMode, this.iNoteMasterID ? Number(this.iNoteMasterID) : 0, this.Login_Id)
				if (response.status === Status.Success) {
					const res = response.response;				
					if (res) 
					{
						let dtprodschedule=this.CreateProdSchedDataContract(res);
						console.log("Product Schedule from service side: ",dtprodschedule);
						return dtprodschedule;
					}
				}
			}
			catch (error) 
			{
				
			}
		}

		async GenerateViewSchedule()
		{
			try 
			{
				let response: any;
				this.CreateAppTableDataContract();
				response= await this.api.GetRuleSchedule(Number(this.iTemplateID), "", this.oUCPAppTablesData, true, [], false, "", Number(this.entityId), this.sUCPMode, this.iNoteMasterID ? Number(this.iNoteMasterID) : 0, this.Login_Id)
				if (response.status === Status.Success) {
					const res = response.response;				
					if (res) 
					{
						let dtviewschedule=this.CreateViewSchedDataContract(res);
						console.log("Product Schedule from service side: ",dtviewschedule);
						return dtviewschedule;
					}
				}
				
			} catch (error) {
				
			}
		}

		CreateViewSchedDataContract(dtSchedule:any):any
		{
			let dtViewSched=[];
			try 
			{
							
				if(dtSchedule.length>0){
					for(let i=0;i<dtSchedule.length;i++){        
					dtViewSched.push({
						RS_Schedule_Date: dtSchedule.rS_Schedule_Date,
						RS_Schedule_PreDate:dtSchedule.rS_Schedule_PreDate,
						RS_Accrual_EndDate: dtSchedule.rS_Accrual_EndDate,
						RS_Accrual_StartDate: dtSchedule.rS_Accrual_StartDate,
						RS_RM_ID: dtSchedule.rS_RM_ID,
						RM_Action_Class: dtSchedule.rM_Action_Class,
						RM_Description: dtSchedule.rM_Description,
						RS_Message_Format:dtSchedule.rS_Message_Format,
						RM_Frequency:dtSchedule.rM_Frequency,
						RM_Misc2: dtSchedule.rM_Misc2,
						RM_Seq_No: dtSchedule.rM_Seq_No,
						RS_Id: dtSchedule.rS_Id,
						RM_RMDSRC_ID: dtSchedule.rM_RMDSRC_ID
					});
				}       
				}
				console.log("Data contract of View schedule",dtViewSched);
				return dtViewSched;
			} 
			catch (error) 
			{
				console.log("Error in CreateViewSchedDataContract :", error)
			}
		}

		
		isNullOrUndefined(value: any) { // Added by OnkarE
			try{
			return value === null || value === undefined;
			}catch(e){
				console.log("Error in isNullOrUndefined :", e)
			}
		}

		checkIfKeyExist = (objectName, keyName) => { // Added this function instead of hasOwenProperty - by OnkarE on 28-Mar-2023 as hasOwenProperty is case sensitive
			try{
			let keyExist = Object.keys(objectName).some(key => key.toUpperCase() == keyName.toUpperCase());
			return keyExist;
			} catch(e){
				console.log("Error in checkIfKeyExist :", e)
			}
		};

		async AddClientLegToCustomerGrid(iNewRowIndex:number,iParentRowIndex:number) //Added by Devesh as per dotnet logic
	  {
		  try
		  {
			if (this.template.max_Client_Legs != "" && this.template.max_Client_Legs != 0) { //to check max client leg count
				if (this.custGridTableRow.length < this.template.max_Client_Legs) { 					
						//continue further
				} else {
					console.log('Max Limit',iNewRowIndex);
					this.ErrorMessage = 'Max Limit Reached';
					return;
				}

			}
            this.loader = true; // Added by OnkarE on 06-May-2023       
			switch(this.sUCPMode.toString().toUpperCase())
				{
						case "UCPUNW":
						case "UCPREV":
						case "UNWFUL":

							this.custGridTableRow.push(JSON.parse(localStorage.getItem('dtcustomerGrid'+String(this.template.template_Id))))
							console.log("Length of custGridTableRow is: ", this.custGridTableRow.length);
							this.CustomerGrid.data.forEach(c => {
								if(c.type.toUpperCase() === 'COMMON DATA')
									{
									 if (c.sourcingLink.length) {										
										this.dropdowns[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = this.dropdowns[c.sourcingLink]; //Added by Devesh on 17-Nov-2021 for dropdown issue
										this.searchArrays[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = this.searchArrays[c.sourcingLink];
										} 
									else {
										this.dropdowns[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = [];
										this.searchArrays[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = [];
										 }
									}
						
							});


							if(!this.isNullOrUndefined(iParentRowIndex) && iParentRowIndex!=-1)
							{
								let Note_Deal_ID = this.custGridTableRow[iParentRowIndex].find(function(e) { return e.columnName == 'Note_Deal_Id'}).value
								for(let i=0;i<this.CustomerGrid.data.length;i++)
								{
									this.custGridTableRow[this.custGridTableRow.length-1][i].value=this.custGridTableRow[iParentRowIndex][i].value;
									 
									 if(this.custGridTableRow[this.custGridTableRow.length-1][i].columnName=="Parent_Deal_ID")
									 this.custGridTableRow[this.custGridTableRow.length-1][i].value = Note_Deal_ID;

									 if (this.custGridTableRow[this.custGridTableRow.length-1][i].columnName=="Note_Deal_Id")
									 this.custGridTableRow[this.custGridTableRow.length-1][i].value="";

									 if(this.custGridTableRow[this.custGridTableRow.length-1][i].columnName=="clmnCustomerDealDirection")
									 {
										this.custGridTableRow[iParentRowIndex][i].value.toUpperCase()=="BUY"?this.custGridTableRow[this.custGridTableRow.length-1][i].value="Sell":this.custGridTableRow[this.custGridTableRow.length-1][i].value="Buy";
									 }

									 if (this.custGridTableRow[this.custGridTableRow.length-1][i].columnName=="clmnCustomerNotional")
									 this.custGridTableRow[this.custGridTableRow.length-1][i].value="0";

									 if (this.custGridTableRow[this.custGridTableRow.length-1][i].columnName=="Note_Ref")
									 this.custGridTableRow[this.custGridTableRow.length-1][i].value=""; 
									 
								}	

								for (let i = 0; i < this.CustomerGrid.data.length; i++) { //Added to execute func after all values are set from above loop

									// this.setCustomTabIntersection(this.CustomTabs.data[i].fieldName,i,this.tableRow.length-1) //taken tableRow.length since length increase on add button
									await this.invokeCustomerGridFunctions(this.CustomerGrid.data[i].columnName, this.custGridTableRow.length - 1); //to trigger customer grid functions after rows are added
									await this.InvokeUnexecutedFunctions("GRID",this.CustomerGrid.data[i].columnName, this.custGridTableRow.length - 1) //to trigger unexecuted functions having input totaly from udf fields & type as client/market
								}
								this.InvokeIntersectionFieldMapping("", "", this.custGridTableRow.length - 1);
							}
							
						    break;
						default:

							this.custGridTableRow.push(JSON.parse(localStorage.getItem('dtcustomerGrid'+String(this.template.template_Id))))
							console.log("CustGridTableRow is: ", this.custGridTableRow);
							this.CustomerGrid.data.forEach(c => {
								if(c.type.toUpperCase() === 'COMMON DATA')
									{
									 if (c.sourcingLink.length) {										
										this.dropdowns[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = this.dropdowns[c.sourcingLink]; //Added by Devesh on 17-Nov-2021 for dropdown issue
										this.searchArrays[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = this.searchArrays[c.sourcingLink];
										} 
									else {
										this.dropdowns[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = [];
										this.searchArrays[c.columnName +"_cg_"+ String(this.custGridTableRow.length-1)] = [];
										 }
									}
						
							});

							for(let i=0;i<this.CustomerGrid.data.length;i++)
								{
									if(this.custGridTableRow[this.custGridTableRow.length-1][i].visible.toUpperCase() != "Y" && (this.custGridTableRow[this.custGridTableRow.length-1][i].columnName.toUpperCase() != "NOTE_DEAL_ID" && (this.custGridTableRow[this.custGridTableRow.length-1][i].columnName.toUpperCase() != "DEAL_REFERENCE_NUMBER"))) { /// Added this condition by OnkarE on 02-May-2023
										this.custGridTableRow[this.custGridTableRow.length-1][i].value = this.custGridTableRow[this.custGridTableRow.length-2][i].value; //as per logic of dotnet code
									}
									else {
										this.custGridTableRow[this.custGridTableRow.length-1][i].value = "";
									}	
						
									if(this.custGridTableRow[this.custGridTableRow.length-1][i].columnName=="clmnCustomerLeg")
									 this.custGridTableRow[this.custGridTableRow.length-1][i].value="Customer";

									if(this.custGridTableRow[this.custGridTableRow.length-1][i].columnName=="clmnCustomerDealDirection")
									 this.custGridTableRow[this.custGridTableRow.length-1][i].value="Buy";

									// Commented this by OnkarE on 03-May-2023 to reoslve saving issue - same as .Net
									// if(this.custGridTableRow[this.custGridTableRow.length-1][i].columnName=="clmnCustomerId")
									//  this.custGridTableRow[this.custGridTableRow.length-1][i].value= 0;
									
									// Added by OnkarE on 03-May-2023 to get Note_deal_Id as blank for newly added leg
									if(this.custGridTableRow[this.custGridTableRow.length-1][i].columnName.toUpperCase()=="NOTE_DEAL_ID")
									 this.custGridTableRow[this.custGridTableRow.length-1][i].value = ""; 
									
									 // Added by OnkarE on 03-May-2023 to get legcount for newly added leg
									//  if(this.custGridTableRow[this.custGridTableRow.length-1][i].columnName.toUpperCase()=="DEAL_REFERENCE_NUMBER")
									//  	this.custGridTableRow[this.custGridTableRow.length-1][i].value = this.custGridTableRow.length; 

									if(this.custGridTableRow[this.custGridTableRow.length-1][i].columnName=="clmnCustomerRMId")
									 this.custGridTableRow[this.custGridTableRow.length-1][i].value= 0;	
								}

								console.log("Cust grid before function calls: ", this.CustomerGrid.data)
								for (let i = 0; i < this.CustomerGrid.data.length; i++) { //Added to execute func after all values are set from above loop

									// this.setCustomTabIntersection(this.CustomTabs.data[i].fieldName,i,this.tableRow.length-1) //taken tableRow.length since length increase on add button
									await this.invokeCustomerGridFunctions(this.CustomerGrid.data[i].columnName, this.custGridTableRow.length - 1); //to trigger customer grid functions after rows are added
									await this.InvokeUnexecutedFunctions("GRID",this.CustomerGrid.data[i].columnName, this.custGridTableRow.length - 1) //to trigger unexecuted functions having input totaly from udf fields & type as client/market
								}
								this.InvokeIntersectionFieldMapping("", "", this.custGridTableRow.length - 1);
								this.loader = false; // Added by OnkarE on 06-May-2023
							break;
				}			
		  }
		  catch (error) 
		  {
			  
		  }
	  }


	}


	export class DSNFunctionExecution{
		FunctionTypeField :string
		ExeNameField:string
		ClassNameField:string
		FunctionNameField:string
		InputParametersField:string
		OutputField:string
	}