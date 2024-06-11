import { Component, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { HolidayCalenderSetupService } from 'src/app/services/holiday-calender-setup.service';
import { CommonfunctionService } from '../fx-order/commonfunction.service';
import { AppConfig } from 'src/app/services/config.service';

@Component({
  selector: 'app-holiday-calender-viewer',
  templateUrl: './holiday-calender-viewer.component.html',
  styleUrls: ['./holiday-calender-viewer.component.scss']
})
export class HolidayCalenderViewerComponent implements OnInit {

  currency_response : any = [];
  holidayDetails : any = [];

  fromDate : any = "";
  toDate : any = "";
  selectedCCY : any = "All";
  currentYear : any = "";
  holidayName : any = "";
  eventName : any = "";

  currentMonth :any = "";
  WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  daysInMonth : number = 0 ;
  noOFdays : any = []; 
  array_of_calendar : any = [];

  holidayEvents : any = [];
  toggleTableView : boolean = false;
  fetchHolidayRecord : any = [];
  showEditPopup : boolean = false;

  toggle_addupdate : string = "Edit";
  selectedHolidayName : any = "";
  selectedHolidayType : any = "";
  selectedEvent : any = "";
  selectedDate : any = "";
  selectedHolidayID : any = "";

  message : any = "";
  errormsg : any = "";
  eventType : any = ["All", "Fixed", "Variable", "Weekend"]; 
  holidayDetailsFilter : any = [];
  selectedEventType : any = "All";
  eventNameFilter : any = "";
  eventTypeFilter : any = "";

  selectedAllCcy : boolean = true;
  selectedCCYName : any = "";
  currency_response_filter : any = [];
  searchname : any = "";
  holidayEventCCY : any = [];

  constructor(public location: Location,
    public holidayCalenderApi : HolidayCalenderSetupService,
    public datePipe : DatePipe,
    public commonfunctionApi : CommonfunctionService) { }

  async ngOnInit(){

    this.currentYear = new Date().getFullYear(); 
    this.currentMonth = this.datePipe.transform(new Date().getMonth(), "MMM");
    let date = new Date();
    this.fromDate = this.datePipe.transform(new Date(date.getFullYear(), 0, 1), "dd-MMM-yyyy");  //first day
    this.toDate = this.datePipe.transform(new Date(date.getFullYear(), 12, 0), "dd-MMM-yyyy");
    this.daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

    this.getCurrency();
    this.getCurrencyDetails(this.selectedCCY);
    // console.log("this.currency",this.currency_response)\
    this.getCalendar();
  }

getCalendar(){

  this.array_of_calendar = [];
  this.noOFdays = [];

  for(let i = 0; i< 12; i++){
    this.array_of_calendar.push({
      month : i,
      date : new Date(this.currentYear, i+1 , 0).getDate(),
  
    });

   
    for(let j = 1; j < this.array_of_calendar[i].date+1; j++){
      this.noOFdays.push({
        mnth : i,
        day : j,
        month : this.MONTHS[i],
        weekdayno : new Date(this.currentYear, i, j).getDay(),
        weekday : this.WEEKDAYS[new Date(this.currentYear, i, j).getDay()],
        date : this.datePipe.transform(new Date(this.currentYear, i, j), "dd-MMM-yyyy")
      });
    }
  }


  // console.log("this.array_of_calendar.date", this.noOFdays);
}


  back() {
    this.location.back();
  }

  async getCurrency(){
    let res = await this.holidayCalenderApi.GetCurrencyOrAsset()
    .then((res: any) => {
      if(res){
        this.currency_response = res;
      }
    }
    )
    .catch((err) => console.log(err));

    if(this.currency_response.length != 0){
      this.currency_response_filter = this.currency_response;
    }
    //temparory change
  //  this.currency_response = this.currency_response.filter((ele : any) => 
  //     (ele.code).length == 3
  //   )

    // console.log("cu", this.currency_response);
  }

  async getCurrencyDetails(ccy : string){

    if(ccy != "All"){
      this.selectedAllCcy = false; 
    }

    this.holidayEvents = [];
    this.holidayEventCCY = [];
    this.holidayDetails = [];
    this.selectedCCY = ccy;

    let tempArr = [];
    

    this.holidayDetails = await this.holidayCalenderApi.GetHolidayCalenderRecords(this.selectedCCY, "", this.fromDate, this.toDate, this.holidayName, this.eventName )
    .then((res: any) => {res.GetHolidayCalender_Records_APIResult; tempArr=res;}
    )
    .catch((err) => console.log(err));

    this.holidayDetails = tempArr;
    
    if(this.holidayDetails){
      this.holidayDetails.forEach((element:any) => {
        element.formattedDate = this.datePipe.transform(element.holidayDate,"dd-MMM-yyyy");
        this.holidayEvents.push(element.formattedDate);
        this.holidayEventCCY.push(element.currency);
      });
      this.holidayDetailsFilter = this.holidayDetails;
    }
    

    this.getCalendar();

    // console.log("...holiday details", this.holidayEvents)

  
  }

  getYear(prev_next : string){
    if(prev_next == 'previous'){
      this.currentYear = this.currentYear - 1;
    }
    else if(prev_next == 'next'){
      this.currentYear = this.currentYear + 1;
    }

    this.fromDate = this.datePipe.transform(new Date(this.currentYear, 0, 1), "dd-MMM-yyyy");  //first day
    this.toDate = this.datePipe.transform(new Date(this.currentYear, 12, 0), "dd-MMM-yyyy");
    // console.log("from date and to date", this.fromDate, this.toDate);
    this.getCurrencyDetails(this.selectedCCY);

  }

  // function to update fields in Holiday Edit Popup
  updateEditHolidayPopup() {
    let id = document.getElementById("editHolidayPopupID")['value'];
    let rec = this.fetchHolidayRecord.filter((ele)=>{return id==ele.id})[0]
    
    this.selectedHolidayName = rec["holidayName"];
    this.selectedHolidayType = rec["holidayType"];
    this.selectedEvent = rec["misc"];
    this.selectedHolidayID = rec["id"];
  }

  editHolidayPopup(date : any){
   this.message = "";
   this.showEditPopup = true;
   this.selectedDate = date;
   this.fetchHolidayRecord = this.holidayDetails.filter((ele : any) => 
      ele.formattedDate == date
    );
    
    if(this.fetchHolidayRecord.length){
      this.toggle_addupdate = "Edit";
      this.selectedHolidayName = this.fetchHolidayRecord[0].holidayName;
      this.selectedHolidayType = this.fetchHolidayRecord[0].holidayType;
      this.selectedEvent = this.fetchHolidayRecord[0].misc;
      this.selectedHolidayID = this.fetchHolidayRecord[0].id;
      this.selectedCCYName = this.fetchHolidayRecord[0].currency;
    }
    else{
      this.toggle_addupdate = "Add";
      this.selectedHolidayName = "";
      this.selectedHolidayType = "";
      this.selectedEvent = "";
      this.selectedHolidayID = "1";
      this.selectedCCYName = this.currency_response[0].code;
    }
    this.validateHolidayFields();
    // console.log("holiday record", this.fetchHolidayRecord)
  }


  // Added on 02 Aug 2022 for Add, Update and Delete
  async saveHolidayCalendar(IUorD : string){

    let selectedCCY : string[] = [this.selectedCCYName];
    let selectedDate : string[] = [this.selectedDate];

    if(selectedCCY?.length > 0 && selectedDate?.length > 0 && this.selectedHolidayType != '' ){
      this.message = "";
      this.errormsg = "";
      if(IUorD == 'D'){
        let response = await this.holidayCalenderApi.DeleteRecords(this.selectedHolidayID, AppConfig.settings.oRes.userName, "0.0.0.0")
        .then((res: any) => {
          if(res){
            if(IUorD == 'D'){
              this.message = "Record deleted successfully";
              this.getCurrencyDetails(this.selectedCCYName);
            }
          }
        }
        )
        .catch((err) => console.log(err));
      }
      else{
        let response = await this.holidayCalenderApi.SaveHolidayCalendar(this.selectedHolidayID, selectedCCY, this.selectedHolidayType, selectedDate, this.selectedHolidayName, this.selectedEvent, IUorD, "N", AppConfig.settings.oRes.userName, "0.0.0.0")
        .then((res: any) => {
          if(res){
            if(IUorD == 'I'){
              this.message = "Record added successfully";
              setTimeout(() => {
                // this.showEditPopup = false
              }, 5000);
              this.getCurrencyDetails(this.selectedCCYName);
            }
            else if(IUorD == 'U'){
              this.message = "Record updated successfully"
              this.getCurrencyDetails(this.selectedCCYName);
            }
          }
        }
        )
        .catch((err) => console.log(err));
      }
    }
    else{
      this.validateHolidayFields();
    }

  }

  validateHolidayFields(){
    if(this.selectedCCYName == ''){
      this.errormsg = "Please select currency";
    }
    else if(this.selectedDate == ''){
      this.errormsg = "Please select date"
    }
    else if(this.selectedHolidayType == ''){
      this.errormsg = "Please enter holiday type"
    }
    else{
      this.errormsg = "";
    }
  }


  filterHolidayDetails(){
    this.holidayDetails = this.holidayDetailsFilter;

    this.holidayDetails = this.holidayDetails.filter((ele : any) => {
      if(this.selectedEventType != 'All' && this.eventNameFilter == "" && this.eventTypeFilter == ""){
        return ((ele.HolidayType).toUpperCase() == this.selectedEventType.toUpperCase());
      }
      else if(this.selectedEventType != 'All' && this.eventNameFilter != "" && this.eventTypeFilter == ""){
        return ((ele.HolidayType).toUpperCase() == this.selectedEventType.toUpperCase()) && (ele.HolidayName).toUpperCase().includes(this.eventNameFilter.toUpperCase());
      }
      else if(this.selectedEventType != 'All' && this.eventTypeFilter != "" && this.eventNameFilter == ""){
        return ((ele.HolidayType).toUpperCase() == this.selectedEventType.toUpperCase())  && (ele.Misc).toUpperCase().includes(this.eventTypeFilter.toUpperCase());
      }
      else if(this.selectedEventType != 'All' && this.eventNameFilter != "" && this.eventTypeFilter != ""){
        return ((ele.HolidayType).toUpperCase() == this.selectedEventType.toUpperCase()) && (ele.HolidayName).toUpperCase().includes(this.eventNameFilter.toUpperCase()) && (ele.Misc).toUpperCase().includes(this.eventTypeFilter.toUpperCase());
      }
      else if(this.selectedEventType == 'All' && this.eventNameFilter != "" && this.eventTypeFilter == ""){
        return (ele.HolidayName).toUpperCase().includes(this.eventNameFilter.toUpperCase());
      }
      else if(this.selectedEventType == 'All' && this.eventNameFilter == "" && this.eventTypeFilter != ""){
        return (ele.Misc).toUpperCase().includes(this.eventTypeFilter.toUpperCase());
      }
      else if(this.selectedEventType == 'All' && this.eventNameFilter != "" && this.eventTypeFilter != ""){
        return (ele.HolidayName).toUpperCase().includes(this.eventNameFilter.toUpperCase()) && (ele.Misc).toUpperCase().includes(this.eventTypeFilter.toUpperCase());
      }
      else{
        return this.holidayDetailsFilter;
      }
    })

    // date wise filter
    this.holidayDetails = this.holidayDetails.filter((ele : any) => {
      return new Date(ele.formattedDate) >= new Date(this.fromDate) && new Date(ele.formattedDate) <= new Date(this.toDate);
    })

    this.holidayEvents = [];
    this.holidayDetails.forEach((element:any) => {
      this.holidayEvents.push(element.formattedDate);
      this.holidayEventCCY.push(element.Currency);
    });
    this.getCalendar();
  }


  getStartDate(event : any){
    this.fromDate = this.datePipe.transform(new Date(event.target.value), "dd-MMM-yyyy");  //first day
    this.filterHolidayDetails();
  }

  getEndDate(event : any){
    this.toDate = this.datePipe.transform(new Date(event.target.value), "dd-MMM-yyyy");
    this.filterHolidayDetails();
  }

  // Added on 05 Aug 2022 asked by Vipul  B

  selectAllCCY(){
    this.selectedAllCcy = !this.selectedAllCcy;
    if(this.selectedAllCcy){
      this.selectedCCY = "All";
      this.getCurrencyDetails(this.selectedCCY);
    }
    else{
      this.holidayEventCCY = [];
    }
  }

  searchCCY(event){
  
    let item = event.target.value;
    this.currency_response = this.currency_response_filter.filter((data:any) => {
      return data.code.toLowerCase().includes(item.toLowerCase());
      });

  }

}
