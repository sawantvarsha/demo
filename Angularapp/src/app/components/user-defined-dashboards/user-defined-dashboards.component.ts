import { Component, OnInit } from '@angular/core';
import { WorkflowApiService} from '../../services/workflow-api.service';
import { CommonApiService } from '../../services/common-api.service';
import { environment } from 'src/environments/environment';
import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-user-defined-dashboards',
  templateUrl: './user-defined-dashboards.component.html',
  styleUrls: ['./user-defined-dashboards.component.scss']
})
export class UserDefinedDashboardsComponent implements OnInit {
  dashboard = 'All';
  dashboardList = [];
  showMenu = false;
  txtSearch = '';
  icons = [];
  images =[];
  username: any;
  userType: any;
  entityID: any;
  scenarioList = [];
  showImg =[];
  gridData: any;
  Year: any;
  Month:any;
  DateP: any;
  fromDate: any;
  toDate: any;
  selectedScenario: any;
  loaderFlag = true;
  
  layout =[];
  layoutname ='';
  lblError = '';
  Dashboard_Detail = [];
  Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 
  isProd = environment.production;
  imgUrl: string;
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.addLayout(event.currentIndex);
    }
    this.selectedScenario = event.previousIndex;
  }

  constructor(private api: WorkflowApiService, private cfs: CommonApiService) { }

  ngOnInit(): void {
    this.username = 'superuser1' //sessionStorage.getItem('Username'); //
    this.entityID =  '6'; //
    let d = new Date();
    this.Year = d.getFullYear();
    this.Month = this.Months[ d.getMonth() + 1];
    this.DateP = d.getDate() + '-' + this.Month + '-' + this.Year;
    this.fromDate = this.toDate = this.DateP;
    console.log(this.Year, this.Month, this.DateP);
    if (this.isProd) { this.imgUrl = 'assets/App_Resources/'; } else { this.imgUrl = '../../../../assets/App_Resources/'; }
   
    this.api.Get_UserType(this.username).subscribe(res=>{
      if(res !== null && res.length !== 0){
        console.log(res);
        this.userType = res[0].Dashboard_Group;
        
    // this.api.Get_Dashboard_Master(this.userType, this.entityID).subscribe(res=>{
    //   if(res !== null && res.length !== 0){
    //     console.log(res);
    //   }
    // });
        this.getLayout();
      }
    });

  
    this.api.GetDashboardScenarioHeader(this.username, this.userType,this.entityID, '').subscribe(res=>{
      if(res !== null){
        if(res.Get_Dashboard_ScenarioHeaderResult.length !== 0){
          
          this.scenarioList = res.Get_Dashboard_ScenarioHeaderResult.sort((a, b) => (a.ScenarioHeader > b.ScenarioHeader) ? 1 : -1);
          this.images = [];
          this.scenarioList.forEach(element => {
            this.showImg.push(false);
            this.images.push( this.imgUrl + "images/" + element.ControlType + ".png")
          this.icons.push(this.imgUrl + "images/icons/" + element.ControlType + ".png")
          });
        }
      }
    });
   
    this.cfs.deleteTileObserver.subscribe(res=>{
      if(res.length !== 0){
        let filterData = this.gridData.filter(data =>{
         if(data.Linkname !== res[0]  && data.SequenceNo !== res[1]){
           return data;
         }
        })
  
        this.gridData = filterData;
      }

    });
  }

  addLayout(sequenceNo){
    let data = [];
    data = this.gridData[sequenceNo];
    
    this.layout.push({"sequenceNo": sequenceNo + 1,"entity": this.entityID, "scenarioNo": data['LinkName'],"username": this.username,"userType": this.userType,
    "from": this.fromDate,"to": this.toDate,"dayRange": '',"date": this.DateP,"year": this.Year,"month": this.Month,"layoutID": this.layoutname});
    console.log(this.layout);
  }
  saveLayout(){
    
    this.api.Delete_Dashboard_Data( this.entityID, this.username, this.userType, this.dashboard).subscribe(res=>{
      if(res.length !== 0){
        console.log(res);
        if(this.layoutname === ''){

          this.gridData.forEach(res =>{
            this.layout.push({"sequenceNo": res.SequenceNo ,"entity": this.entityID, "scenarioNo": res.Linkname,"username": this.username,"userType": this.userType,
            "from": this.fromDate,"to": this.toDate,"dayRange": '',"date": this.DateP,"year": this.Year,"month": this.Month,"layoutID": this.dashboard});
            
          })

          this.layout.forEach(element => {
            this.api.Insert_Dashboard_Data(element.sequenceNo, element.entity, element.scenarioNo, element.username, element.userType, element.from, element.to, element.dayRange, element.date, element.year, element.month, this.dashboard).subscribe(res => {
              console.log(res)
              this.lblError = 'Layout saved successfully.'
              this.getLayout();
            }, err => {
              console.log(err)
              this.lblError = 'Failed to save layout.'
            });;
          });
        } else{
          this.layout.forEach(element => {
            this.api.Insert_Dashboard_Data(element.sequenceNo, element.entity, element.scenarioNo, element.username, element.userType, element.from, element.to, element.dayRange, element.date, element.year, element.month, this.layoutname).subscribe(res => {
              console.log(res)
              this.lblError = 'Layout saved successfully.'
              this.getLayout();
            }, err => {
              console.log(err)
              this.lblError = 'Failed to save layout.'
            });;
          });
        }
      }
    })



  }

  layoutChanged(){
    this.gridData = [];
    if(this.dashboard !== 'All'){

      this.gridData = this.Dashboard_Detail.filter((d: any) => d.LayoutID === this.dashboard);
    } else{

      this.gridData = this.Dashboard_Detail;
    }
    this.layout = [];
  }

  getLayout(){
    this.api.Get_Dashboard_Detail(this.username, this.userType,this.entityID).subscribe(res =>{
      if(res !== null){
        console.log(res);
        this.dashboardList = res.Get_Dashboard_DetailResult.map(item => item.LayoutID)
        .filter((value, index, self) => self.indexOf(value) === index);
        this.Dashboard_Detail = res.Get_Dashboard_DetailResult;
        // this.dashboard = this.dashboardList[0];
      

        console.log(this.Dashboard_Detail);
        this.gridData = res.Get_Dashboard_DetailResult;
        this.layoutChanged();
        this.loaderFlag = false;
      }
    })
  }

}
