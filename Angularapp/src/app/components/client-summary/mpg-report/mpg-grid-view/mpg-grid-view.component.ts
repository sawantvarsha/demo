import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppConfig } from 'src/app/services/config.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';

@Component({
  selector: 'app-mpg-grid-view',
  templateUrl: './mpg-grid-view.component.html',
  styleUrls: ['./mpg-grid-view.component.scss']
})
export class MpgGridViewComponent implements OnInit {

  currentUser: any;
  // Login_Id: string;
  expandedParent: any;
  
  shwSidenav = true;
  shwFiltersFlg = true;
  entity: any;
  constructor(public authenticationService: AuthService,private apifunction: WorkflowApiService
    ) {
      this.expandedParent = {
        isMPG: true,
        isFilter: false,
        isMenu: false,
      }
    // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  
    // this.Login_Id = this.currentUser.userName; 
    // this.apifunction.Login_Id =  this.currentUser;  ruchira
   }

  ngOnInit(): void {
    this.currentUser = AppConfig.settings.oRes.userName;
    this.entity = AppConfig.settings.oRes.homeEntityID;
    try {
  
    this.apifunction.getBlotterCode(this.currentUser).subscribe(
        (data) => {
          console.log('Jyoti  data.Get_blottercodeResult', data);
          this.apifunction.BlotterItems = data
          if(sessionStorage.getItem('MPGfromPWB') === 'true' ){
            let MPGDatafromPWB = JSON.parse(sessionStorage.getItem('MPGDatafromPWB') )
            let selectedMPGitem = this.apifunction.BlotterItems.find(x=> parseInt(x.BCM_ID)  === parseInt(MPGDatafromPWB.MPG_ID) )
            if(selectedMPGitem){
              this.apifunction.setSelectedMPG(selectedMPGitem)
            }
            else{
              this.apifunction.setSelectedMPG(this.apifunction.BlotterItems[0]);
            }
            
          }
          else{ 
            console.log('Jyoti this.apifunction.BlotterItems',this.apifunction.BlotterItems[0]);
            this.apifunction.setSelectedMPG(this.apifunction.BlotterItems[0]);
          }
         
        },
        (error) => {
          console.log("Error occured in fetching insertShare: ", error);
        }
      );
    }
    catch (error) {
      console.log(error);
    }
  }

  toggleSidenav(){
    try {
      this.shwSidenav = !this.shwSidenav;
    // this.shwFiltersFlg = !this.shwFiltersFlg; 
    }
    catch (error) {
      console.log(error);
    }
  }
  changeLayout(expand:any){
    this.expandedParent = expand
    console.log("Jyoti expand",expand)
  }
   
  toggleFilters(){
    try {
      // this.shwSidenav = !this.shwSidenav;
    this.shwFiltersFlg = !this.shwFiltersFlg;
    }
    catch (error) {
      console.log(error);
    }
  }

}
