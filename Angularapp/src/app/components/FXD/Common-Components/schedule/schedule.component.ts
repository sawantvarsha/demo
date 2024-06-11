import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FxdApifunctionService } from '../../services/fxd-apifunction.service';
import * as xml2js from 'xml2js';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FxdCommonfunctionsService } from '../../services/fxd-commonfunctions.service';
import { ExcelService } from 'src/app/services/excel.service';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'] //stylesheet added by Urmila A | 18-sep-23
})
export class ScheduleComponent implements OnInit, OnDestroy, OnChanges {

  @Input() NoteMasterID: string;

  // Extra param
  ParseString: string;
  SampleArray:any[] = [];
  SampleObject = Object;
  Headers = [];
  Values:any = [] = [];
  SampleString: string;
  MonoObjectString = [];
  SampleArray2 = [];
  map = new Map<object, string>();
  LoadSchedule: boolean = false;
  VanillaArr:any =[];

  // Added by Urmila A | 7-Dec-22  |start
  @Input() ProductCode: any;
  @Input() ExternalXML:any;
  @Input() TemplateCode:any;
  @Input() TemplateID:any;
  @Input() ScheduleDescription:any;
  // changes added/modified by Urmila A | 22-sep-23 | start
  @Input() Pivotflag: boolean;
  @Input() Trfflag: boolean;
  @Input() Aqdqflag: boolean;
  @Input() vanillaFlag:boolean;
  @Input() barrierFlag:boolean;
  @Input() strategyFlag:boolean;
  // changes added/modified by Urmila A | 22-sep-23 | ends

  @Input() ScheduleCallWithGuarenteeperiod:boolean;
  @Input() ViewSchedulePopup:boolean; //Urmila A |  27-Jan-23 | LGTGTWINT-1163
  @Input() Gperiod:any; //Urmila A | 7-Feb-23
  FXDScheduleSubscriber:Subscription;

  @Input() GperiodChange:any;  //added by UrmilaA | LGTGTWINT-1914 | 8-June-23
  reload: boolean = false;
  // Added by Urmila A | 7-Dec-22 |end
  constructor(private ngxXml2jsonService: NgxXml2jsonService,private FXD_afs: FxdApifunctionService, 
    private AuthAPI:AuthService,public FXD_cfs: FxdCommonfunctionsService ,  public excelService: ExcelService , private datePipe: DatePipe , private decimalPipe : DecimalPipe 
   ) { }

    // Added changes by Mayuri D. on 12-Dec-2022 | LGTGTWINT : 581 | start
  HeadersArray : any = [
  {
    Key : "RS_Fixing_Date"  , 
    Value : "Fixing Date",
    Type : "Date"
  } ,
  {
    Key : "RS_Maturity_Date"  , //Modified by Urmila A | LGTGTWINT-811 | 10-Jan-23
    Value : "Settlement Date",
    Type : "Date" 
  }, 
  {
    Key : "Option_Direction"  , 
    Value : "Option Direction",
    Type : "char" 
  },
  {
    Key : "Product_Type"  , 
    Value : "Product Type",
    Type : "char"  
  },
  {
    Key : "Option"  , 
    Value : "Option",
    Type : "char"  
  },
  {
    Key : "Underlying" , 
    Value : "Underlying" ,
    Type : "char" 
  },
  {
    Key : "Strike"  , 
    Value : "Strike" ,
    Type : "char" 
  },
  {
    Key : "Lower_Barrier", 
    Value : "Lower Barrier" ,
    Type : "char" 
  }, 
  {
    Key : "Upper_Barrier", 
    Value : "Upper Barrier" ,
    Type : "char" 
  },
  {
    Key : "Notional", 
    Value : "Notional" ,
    Type : "Number" 
  },  
  {
    Key : "Notional_Ccy", 
    Value : "Notional Ccy" ,
    Type : "char" 
  }];
  JsonList : any
   // Added changes by Mayuri D. on 12-Dec-2022 | LGTGTWINT : 581 | End

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this.LoadSchedule = false;
    this.ViewSchedulePopup = false;
    // this.ScheduleCallWithGuarenteeperiod = false;
 
    //added by UrmilaA | LGTGTWINT-1914 | 8-June-23 | start
    if((!this.GperiodChange && !this.ViewSchedulePopup) || this.Gperiod == 0){
      this.FXD_cfs.schedulePopupOpenClose.next(false); //Urmila A | 13-feb-23
      if(this.FXDScheduleSubscriber) this.FXDScheduleSubscriber.unsubscribe();
    }
    //added by UrmilaA | LGTGTWINT-1914 | 8-June-23 | ends
    
  }

  ngOnChanges(){
   console.log('prod enabled: ', this.Aqdqflag, this.Trfflag, this.Pivotflag)
    // console.log('GperiodChange',this.GperiodChange,this.ScheduleCallWithGuarenteeperiod)
    if(this.ScheduleCallWithGuarenteeperiod && this.ScheduleCallWithGuarenteeperiod !== undefined){ //Urmila A |  27-Jan-23 | LGTGTWINT-1163
      if(this.FXDScheduleSubscriber && this.Gperiod == 0 ){  //modified by UrmilaA | LGTGTWINT-1914 | 8-June-23 
        this.FXDScheduleSubscriber.unsubscribe()
      }
      this.fnGetSchedule();
    }
  
  }

  ngOnInit(): void {
   
        if(this.ScheduleCallWithGuarenteeperiod === false && this.ScheduleCallWithGuarenteeperiod !== undefined || this.ViewSchedulePopup){  //Urmila A |  27-Jan-23 | LGTGTWINT-1163
          this.fnGetSchedule();
        }
    
    }

  // Modified by Urmila A, | 9-Dec-22 | start
  // changes in Req parameters, response key/values mapping modification, 
  // commented Buy/Sell values assigning part, added date sorting function , schedule loader !
  fnGetSchedule() {
    const that = this;
    //API req params modified by Urmila A | 22-sep-23 | Urmila A | Core-migration
    this.FXDScheduleSubscriber = this.FXD_afs.fnGetSchedule(this.NoteMasterID.toString(),this.FXD_afs.EntityID,this.FXD_afs.UserName,
      this.ExternalXML,this.TemplateCode,this.TemplateID).subscribe((res) => {
      if (res) {
        if(res !== null && res.errors == undefined){ //modified by Urmila A | 22-Sep-23
            console.log('schedule res',res);
           
            // xml2js.parseString(res, function () {
            //  this.SampleArray = JSON.parse(JSON.stringify(res).toString()).SchdeuleData;
            // });

            this.SampleArray = res.SchdeuleData;
     
            this.LoadSchedule = true;
            this.reload  =false;
            // this.SampleArray = JSON.parse(JSON.stringify(res.GetScheduleResult).toString()).SchdeuleData;
            for (let i = 0; i < this.SampleArray.length; i++) {
              this.SampleObject = this.SampleArray[i];
              for (var key in this.SampleObject) {
                if(key === 'RM_Action_Class' && this.SampleObject[key] === "Input XML" ){
                  // console.log(this.SampleObject[key]);
                  xml2js.parseString(that.SampleObject['RS_Message_Format'], function () {
                    console.log(that.SampleObject['RS_Message_Format']);
  
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(that.SampleObject['RS_Message_Format'], 'text/xml');
                    // console.log(that.ngxXml2jsonService.xmlToJson(xml));
                    that.Values.push(that.ngxXml2jsonService.xmlToJson(xml)['NewDataSet'].quoteDetails)
                  });
                }
                if (this.isEmpty(this.SampleObject[key])) {
                  this.SampleObject[key] = "";
                }
                // if (this.SampleObject[key] === 'B') {
                //   this.SampleObject[key] = 'Buy';
                // }
                // if (this.SampleObject[key] === 'S') {
                //   this.SampleObject[key] = 'Sell';
                // }
                if (this.SampleObject[key] === ' ') {
                  this.SampleObject[key] = '0.00';
                }
                if (key === 'Notional') {
                  this.SampleObject[key] = this.SampleObject[key].replace(/,/g, '');
                }
              }
              this.SampleArray[i] = this.SampleObject;
            }
            // Added changes by Mayuri D. on 12-Dec-2022 | LGTGTWINT : 581 | start
            if(this.Trfflag || this.Pivotflag)
            {
              this.HeadersArray[2] = {
                Key : "OptionType"  , 
                Value : "Option Direction",
                Type : "char" 
              }
              this.HeadersArray[3] = {
                Key : "Barrier"  , 
                Value : "Product Type",
                Type : "char"  
              }
            }
            // Added changes by Mayuri D. on 12-Dec-2022 | LGTGTWINT : 581 | End
  
            //Sorting added by Urmila A | 9-Dec-22
            this.Values = this.SampleArray;      
            this.Values.forEach(element => {
                  element.RS_Fixing_Date = new Date(element.RS_Fixing_Date);
                  element.RS_Fixing_Date = element.RS_Fixing_Date.getFullYear() +  "-" + ("0" + (element.RS_Fixing_Date.getMonth() + 1)).substr(-2, 2) +
                  "-" +("0" + element.RS_Fixing_Date.getDate()).substr(-2, 2);
                  element.RS_Fixing_Date = new Date(element.RS_Fixing_Date);
            });
            this.Values = [...this.Values].sort(
              (objA, objB) => objA.RS_Fixing_Date.getTime() - objB.RS_Fixing_Date.getTime(),
            );
            // console.log(' after sort: ',this.Values)
        
  
            //for AQDQ, guarentee period till date in contract summary , by Urmila A | 13-Dec-22   
            if(this.ScheduleCallWithGuarenteeperiod)   { //Urmila A | 10-feb-23
                if(this.ProductCode === 'FXAQ' || this.ProductCode === 'FXDQ'  ){ //&& this.ScheduleCallWithGuarenteeperiod
                  this.VanillaArr = this.Values.filter(item => item.Product_Type === 'VANILLA')
                  // console.log(' after sorting vanilla: ',this.VanillaArr)
                  let index:any;
                  index = this.VanillaArr.findLastIndex((n:any) => n.Product_Type === 'VANILLA')
                  if(this.VanillaArr.length === 0 || this.VanillaArr.length === undefined) { 
                    this.FXD_afs.FXD_Schedule_GuratenteeTillDate_AQDQ.next({Gperiod: this.Gperiod,GperiodTill: '0'}) 
                  }else{
                    this.FXD_afs.FXD_Schedule_GuratenteeTillDate_AQDQ.next({Gperiod: this.Gperiod,
                    GperiodTill:this.FXD_cfs.convertDate(this.VanillaArr[index].RS_Fixing_Date)})
                  }            
                }
            }    
            
                  
        }else{  //Added by Urmila A | 17-feb-23 | LGTGTWINT-1397
        
          this.NotificationFunction("Error", "Error", 'No Response Received');
          this.LoadSchedule = false;
          this.ViewSchedulePopup=false;
        }
       
      }else{
        this.NotificationFunction("Error", "Error", 'No Response Received');
        this.LoadSchedule = false; //Urmila A | 16-Jan-23 | LGTGTWINT-1064
        this.ViewSchedulePopup=false;
      }
    });
  }
  // Modified by Urmila A | 9-Dec-22 | end

  // Refresh / close schedule function added by Urmila A | 9-Dec-22
  fnReload(){
    this.reload = true;
    this.fnGetSchedule();
  }
  fnCloseSchedule(){
    this.reload= false;
    this.FXD_cfs.schedulePopupOpenClose.next(false);
  }

  // Refresh / close schedule function added by Urmila A | 9-Dec-22 | End
 
  
  FormatNumberwithoutevent(amount: string) {
    try{
      if (amount.trim() === '') {
        amount = '0.00';
      } else {
        amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }catch(ex){

    }
    // //console.log(target.id, $('#' + target.id)[0].value);
    // const notional =amount;
    
    // //console.log(notional);
    return amount;
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  addKeyValue(obj, key, data) {
    //console.log(obj, key, data);
    obj[key] = data;
    return obj;
  }

  //Added by Urmila A | 17-feb-23 | LGTGTWINT-1397
  NotificationFunction(type , header, reason)
  {
    this.FXD_cfs.fnSetNotificationFXD({ // Shifted function to FXDCommnService, to avoid EQC service injection, by Urmila A | 27-Dec-22
      NotificationType: type , //'Error',
      header: header , // 'Error',
      body: reason,
      DateandTime: ''
    });
  }
  //end

  // Added changes by Mayuri D. on 12-Dec-2022 | LGTGTWINT : 581 | start
  exporttoExcel() {
    try {
      this.JsonList = [];
      for(let i = 0 ; i < this.Values.length;i++)
      {
          let val1 : Object;
          val1 = { }
          this.HeadersArray.forEach((element , index) => {
          console.log(  index , element)
          var val = this.HeadersArray[index].Key
          val1[this.HeadersArray[index].Value] = this.HeadersArray[index].Type === "char" ? this.HeadersArray[index].Value === "Option Direction" ? this.Values[i][val] === "B" ? "Buy" : "Sell" : this.Values[i][val] : this.HeadersArray[index].Type === "Date" ? this.datePipe.transform(new Date(this.Values[i][val]),'dd-MMM-yyyy')  : this.decimalPipe.transform(this.Values[i][val], '1.2-2')

          });
          console.log("value is " , val1)
          this.JsonList.push(val1)
       }
        
      this.excelService.exportAsExcelFile(this.JsonList, 'View Schedule');
      
    } catch (ex) { }
  }
  // Added changes by Mayuri D. on 12-Dec-2022 | LGTGTWINT : 581 | end
 
}
