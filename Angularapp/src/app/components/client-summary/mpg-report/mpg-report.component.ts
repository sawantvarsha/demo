import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

import { WorkflowApiService } from '../../../services/workflow-api.service';



@Component({
  selector: 'app-mpg-report',
  templateUrl: './mpg-report.component.html',
  styleUrls: ['./mpg-report.component.scss']
})
export class MpgReportComponent implements OnInit {

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
    this.currentUser = sessionStorage.getItem("Username");
    this.entity = this.authenticationService.EntityID;
    try {
      console.log('in constructor');
    this.apifunction.getBlotterCode(this.currentUser).subscribe(
        (data) => {
          this.apifunction.BlotterItems = data.Get_blottercodeResult;
            this.apifunction.setSelectedMPG(this.apifunction.BlotterItems[0]);
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
    console.log(expand)
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
