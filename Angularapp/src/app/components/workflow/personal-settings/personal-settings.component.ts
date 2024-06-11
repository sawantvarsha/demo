import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkflowUCPService } from 'src/app/services/workflow-ucp.service';
import { isNullOrUndefined } from 'is-what';
import { elementAt } from 'rxjs/operators';
import { DatePipe } from '@angular/common'; // Added by Mitali D - 04-04-2023 - LGTGTWINT-1811

@Component({
  selector: 'app-personal-settings',
  templateUrl: './personal-settings.component.html',
  styleUrls: ['./personal-settings.component.scss']
})
export class PersonalSettingsComponent implements OnInit {

  workflow: any;
  @Input() wflList;
  @Input() queueList;
  selectedWID;
  selectedQID;
  @Input() FromDate;
  @Input() uid;
  @Input() wflSettings;
  isEvtFilter:boolean = true;
  graphZoom:number;
  Rangeddl=["Default","Past Month","Past 3 Month","Past 6 Month","Past 9 Month","Past 12 Month","Past 18 Month","Past 24 Month"]
  selectedRange:any;
  fromSelected:boolean;
  ToDate:any;
  statusAlert:any;
  @Output() close = new EventEmitter<any>();
  templateList: any;
  selectedTID: any;
  rowsPerPage: any;
  showActions:boolean;
  connectorLine: any;
  travelledLine: any;
  @Input() autoRefreshEnabled: any;
  @Input() autoRefresh :any
  @Output() autoRefreshChange: EventEmitter<any> = new EventEmitter();
  @Output() autoRefreshEnabledChange: EventEmitter<any> = new EventEmitter();
  successMsg = ''
  errorMsg = ''
  favWorkflows: string;
  favWflList: any;
  // Added by Mitali D - 03-04-2023 - LGTGTWINT-1818 - START
  showDispPriorityBtn:boolean = false 
  getWSSWorkflowNamesSub: any; 
  wssWflNames: any; 
  showDP:boolean = false
  @Input() serverTimeStamp: any; // Added by Mitali D - 04-04-2023 - LGTGTWINT-1813
  // Added by Mitali D - 03-04-2023 - LGTGTWINT-1818 - END
 
  constructor(public wfl: WorkflowUCPService, public datePipe: DatePipe) { // Changed by Mitali D - 04-04-2023 - LGTGTWINT-1811
  }

  ngOnInit(): void {
    console.log('personal settings')
    this.getWorkflowCustomSettings()
    
  }

  // Added by Mitali D - 03-04-2023 - LGTGTWINT-1818 - START
  ngOnDestroy()
  {
    if(this.getWSSWorkflowNamesSub){
      this.getWSSWorkflowNamesSub.unsubscribe();
    }
  }
  // Added by Mitali D - 03-04-2023 - LGTGTWINT-1818 - END

  initFields(refreshOnlyFavWfl=false){
    if (!isNullOrUndefined(this.wflSettings)) {
      if(!refreshOnlyFavWfl)
      {
      this.selectedWID = this.wflSettings.WCS_WTM_ID === 0 ? this.wflList[0].WTM_Id : this.wflSettings.WCS_WTM_ID
      this.getWSSWorkflowNames(); 
      this.getQueues(this.selectedWID)
      this.getTemplateList()
      this.selectedQID = this.wflSettings.WCS_QM_ID
     
      this.isEvtFilter = this.wflSettings.WCS_Date_Filter === 'Event'?true:false
      this.graphZoom = this.wflSettings.WCS_GP_ZoomScale
      this.selectedRange = this.wflSettings.Misc3!==""?this.wflSettings.Misc3:'Default'
      this.fromSelected = this.wflSettings.Misc3!==""?false:true
      this.FromDate = this.datePipe.transform(this.wflSettings.WCS_From_Date, 'dd-MMM-yyyy')  //this.wfl.getDateFromEpochStr(this.wflSettings.WCS_From_Date)
      this.ToDate = this.datePipe.transform(this.wflSettings.WCS_To_Date, 'dd-MMM-yyyy') //  this.wflSettings.WCS_To_Date //this.wfl.getDateFromEpochStr(this.wflSettings.WCS_To_Date)
      this.statusAlert = this.wflSettings.Misc1==="Y"?true:false
      this.rowsPerPage=this.wflSettings.WCS_Page_Size;
      this.showActions = this.wflSettings.WCS_Action_Column === 'Show'?true:false
      this.connectorLine= this.wflSettings.WCS_GP_ConnectorColor.includes('#')? this.wflSettings.WCS_GP_ConnectorColor :'#'+this.wflSettings.WCS_GP_ConnectorColor;
      this.travelledLine= this.wflSettings.WCS_GP_TraveledColor.includes('#')? this.wflSettings.WCS_GP_TraveledColor :'#'+this.wflSettings.WCS_GP_TraveledColor;

      }
      
      this.favWflList = this.wflSettings.Misc2.split(',').slice(0, -1);
      this.favWorkflows = ''
      this.favWflList.forEach(element => {
        let wfl = this.wflList.find(x=>x.WTM_Id.toString() === element)
        if(wfl)
        {
            this.favWorkflows = this.favWorkflows + wfl.Value + ','
        }
      });
      if(this.favWorkflows.charAt(this.favWorkflows.length - 1)=== ',')
        this.favWorkflows = this.favWorkflows.slice(0,-1)
    }
  }

  changeWfl() {
    this.getQueues(this.selectedWID)
    this.getTemplateList()
    this.getWSSWorkflowNames(); // Added by Mitali D - 03-04-2023 - LGTGTWINT-1818
  }

  changeDate(type) {
    if(type)
    {}
  }

  closepopup() {
    // console.log("close")
    this.close.emit();
  }

  getTemplateList() {
    try {
      // Changed by Mitali D - 13-09-2023 - START
      let selectedwfltype = this.wflList.find(x=>x.WTM_Id.toString() === this.selectedWID.toString()).Value
      this.wfl.getTemplateDetails(this.uid, this.selectedWID,selectedwfltype).subscribe(
      // Changed by Mitali D - 13-09-2023 - END
        (res) => {
          this.templateList = res // Changed by Mitali D - 13-09-2023
          this.templateList = this.templateList.filter(x=> x.Template_Name.trim().length)
          this.selectedTID = this.wflSettings.WCS_Default_Template === 0 || !this.templateList.find(x=>x.Id.toString() === this.wflSettings.WCS_Default_Template.toString() ) ? '%%': this.wflSettings.WCS_Default_Template.toString() 
          // if(firstload)
          //    this.initFields();
          // console.log(this.templateList)
        }
      )
      
    } catch (error) {
      console.log(error)
    }
  }

  getQueues(WTMID) {
    try {
      this.queueList = []
      this.wfl.getQueueWFCustSettings(this.uid, WTMID).subscribe(
        (res) => {
          this.queueList = res; // Changed by Mitali D - 21-09-2023 - FIN1EURINT-613 
          this.queueList=[{QM_Name: 'All', QUG_Queue_ID:0}].concat(this.queueList)
          if(!this.queueList.find(x=>x.QUG_Queue_ID === this.selectedQID))
            this.selectedQID = 0
        }

      )
    } catch (error) {
      console.log(error)
    }

  }

  // Changed by Mitali D - 31-01-2024 - HSBCFXEINT-67 -  - personal settings save not working - START
  saveCustomSettings() {
    this.successMsg = ''
    this.errorMsg = ''
    let settings;
    this.FromDate = this.datePipe.transform(this.FromDate, 'yyyy-MM-dd');
    this.ToDate = this.datePipe.transform(this.ToDate, 'yyyy-MM-dd');
    if (this.fromSelected) {
      settings = {
        WCS_Action_Column: this.showActions ? 'Show' : 'Hide',
        WCS_Date_Filter: this.isEvtFilter ? 'Event' : 'Last Modified',
        WCS_Default_Scheme: 'Scheme',
        WCS_Default_Template: this.selectedTID === '%%' ? 0 : this.selectedTID,
        WCS_From_Date:this.FromDate, 
        WCS_Login_Id: this.uid,
        WCS_Page_Size: this.rowsPerPage,
        WCS_QM_ID: this.selectedQID,
        WCS_Queue_View: 'Link', 
        WCS_To_Date:this.ToDate,  
        WCS_WTM_ID: this.selectedWID,
        Misc1: this.statusAlert ? 'Y' : 'N',
        Misc2: '',
        Misc3: !this.fromSelected ? this.selectedRange : '',
        Misc4: '',
        WCS_GP_ZoomScale: this.graphZoom,
        WCS_GP_ConnectorColor: this.connectorLine,
        WCS_GP_TraveledColor: this.travelledLine,
        WCS_Misc5: '',
        WCS_Misc6: '',
        WCS_Misc7: '',
        WCS_Misc8: '',
        WCS_Misc9: '',
        WCS_Misc10: '',
        WCS_Misc11: '',
        WCS_Misc12: '',
        WCS_Misc13: '',
        WCS_Misc14: '',
        WCS_Misc15: '',
      }
    } else { 
      settings = {
        WCS_Action_Column: this.showActions ? 'Show' : 'Hide',
        WCS_Date_Filter: this.isEvtFilter ? 'Event' : 'Last Modified',
        WCS_Default_Scheme: 'Scheme',
        WCS_Default_Template: this.selectedTID === '%%' ? 0 : this.selectedTID,
        WCS_From_Date: '1900-01-01',   
        WCS_Login_Id: this.uid,
        WCS_Page_Size: this.rowsPerPage,
        WCS_QM_ID: this.selectedQID,
        WCS_Queue_View: 'Link', 
        WCS_To_Date: '1900-01-01',    
        WCS_WTM_ID: this.selectedWID,
        Misc1: this.statusAlert ? 'Y' : 'N',
        Misc2: '',
        Misc3: !this.fromSelected ? this.selectedRange : '',
        Misc4: '',
        WCS_GP_ZoomScale: this.graphZoom,
        WCS_GP_ConnectorColor: this.connectorLine,
        WCS_GP_TraveledColor: this.travelledLine,
        WCS_Misc5: '',
        WCS_Misc6: '',
        WCS_Misc7: '',
        WCS_Misc8: '',
        WCS_Misc9: '',
        WCS_Misc10: '',
        WCS_Misc11: '',
        WCS_Misc12: '',
        WCS_Misc13: '',
        WCS_Misc14: '',
        WCS_Misc15: '',
      }
    }
    if (this.rowsPerPage === '') {
      this.errorMsg = 'Page size cannot be empty.'
      return;
    }
    else if (Date.parse(this.ToDate) < Date.parse(this.FromDate)) {
      this.errorMsg = 'From date cannot be greater than to date.'
      return;
    }

    try {
      this.wfl.savePersonalSettings(settings).subscribe(
        (res) => {
          if (res.result === true) {
            this.successMsg = 'Personalized workflow data saved successfully.'
            this.errorMsg = ''
           
            setTimeout(()=>{
              this.successMsg = "";
            }, 5000);
          }
          else {
            this.errorMsg = 'Error occured while filling Workflow Setting Details.'
          }
         
        }
      )

    } catch (error) {
      //console.log(error)
    }

  }
  // Changed by Mitali D - 31-01-2024 - HSBCFXEINT-67 -  - personal settings save not working - END

  setAutoRefresh(value)
  {
  //Added by Shraddha d || 3-Apr-2023 || LGTGTINT-1810
    this.successMsg='';
    if(value > 600 ||  value <10)
    { 
        this.errorMsg = 'Please enter valid Refresh Time between 10 to 600.'
        return;

    }
    this.errorMsg='';
    this.autoRefreshChange.emit(value)
  }

  toggleAutoRefresh(event)
  {
    this.autoRefreshEnabledChange.emit(event.target.checked)
  }

  getFromDateForRange()
  {
    let d= new Date(this.FromDate) //Added by Shraddha d || 3-Apr-2023 || LGTGTINT-1827
    switch(this.selectedRange){

      case "Past Month":
        d.setMonth(d.getMonth()-1);
        break;
      
      case "Past 3 Month":
        d.setMonth(d.getMonth()-3);
        break;
      
      case "Past 6 Month":
        d.setMonth(d.getMonth()-6);
        break;
      
      case "Past 9 Month":
        d.setMonth(d.getMonth()-9);
        break;
      
      case "Past 12 Month":
        d.setMonth(d.getMonth()-12);
        break;
      
      case "Past 18 Month":
        d.setMonth(d.getMonth()-18);
        break;
      
      case "Past 24 Month":
        d.setMonth(d.getMonth()-24);
        break;
      
      default: 
        d=new Date();
        break;
    }

    return d;
  }

  addToFav()
  {
    try {
      this.errorMsg = ''
      this.successMsg = ''
      this.wfl.addFavWfl(this.selectedWID,this.uid).subscribe(
        (res)=>{
          if(res.InsertWorkflowCustomSettingResult)
          {
            this.successMsg = 'Workflow added in favourites'
            this.getWorkflowCustomSettings(true)
            
          }
          else
          {
            this.errorMsg = 'Workflow already added / limit exceeded for adding workflow'
          }
        }
      )
      
    } catch (error) {
      this.errorMsg = 'Error occured while Adding Favorite Workflow.'
      console.log(error)
    }
      
  }

  removeFavWfl()
  {
    try {
      this.errorMsg = ''
      this.successMsg = ''
      this.wfl.removeFavWfl(this.selectedWID,this.uid).subscribe(
        (res)=>{
          if(res.DeleteWorkflowCustomSettingResult)
          {
            this.successMsg = 'Workflow removed from favourites'
            this.getWorkflowCustomSettings(true)
            
          }
          else
          {
            this.errorMsg = 'Cannot remove from favourites'
          }
        }
      )
      
    } catch (error) {
      this.errorMsg = 'Error occured while deleting Favorite Workflow.'
      console.log(error)
    }

  }

  showAddFavButton()
  {
    if(!isNullOrUndefined(this.favWflList) && !isNullOrUndefined(this.selectedWID))
    {
      if(this.favWflList.find(x=> x === this.selectedWID.toString()))
      return false
      else
      return true
    }
    return true;
    
  }

  getWorkflowCustomSettings(refreshOnlyFavWfl=false)
  {
    this.wfl.getWorkflowCustomSettings(sessionStorage.getItem('Username')).subscribe(
      (res)=>{
        this.wflSettings = res[0] // Changed by Mitali D - 13-09-2023 - FIN1EURINT-613
        this.initFields(refreshOnlyFavWfl)
      }
    )
  }

  // Changed by Mitali D - 12-06-2023 - LGTGTWINT-2107 - START
  // Added by Mitali D - 03-04-2023 - LGTGTWINT-1818 - START
  getWSSWorkflowNames()
  {
    this.wssWflNames = [this.wflList.find(x=>x.WTM_Id === this.selectedWID)]
    
    // this.getWSSWorkflowNamesSub = this.wfl.getWSSWorkflowNamesForDispPriority(sessionStorage.getItem('Username'),"Login",this.selectedWID).subscribe(
    //   (res)=>{
    //     this.wssWflNames=res.getWSSWorkflowNamesResult;
    //     if(res.getWSSWorkflowNamesResult.length)
    //     {
    //       this.showDispPriorityBtn=true;
    //     }
    //     else
    //     {
    //       this.showDispPriorityBtn=false;
    //     }

    //   }
    // )
    
  }
  // Added by Mitali D - 03-04-2023 - LGTGTWINT-1818 - END
  // Changed by Mitali D - 12-06-2023 - LGTGTWINT-2107 - END

}
