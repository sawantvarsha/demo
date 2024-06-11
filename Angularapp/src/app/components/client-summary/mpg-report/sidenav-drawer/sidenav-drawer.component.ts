
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { MAT_DATE_FORMATS } from '@angular/material/core';
// import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
// import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// import { ApifunctionService } from '../apifunction.service';
import { WorkflowApiService } from '../../../../services/workflow-api.service';

@Component({
  selector: 'app-sidenav-drawer',
  templateUrl: './sidenav-drawer.component.html',
  styleUrls: ['./sidenav-drawer.component.scss']

})
export class SidenavDrawerComponent implements OnInit {
  @Output() expandedChange: EventEmitter<any> = new EventEmitter();
  @Input() expanded: any

  txtSearch = '';
  //ss BlotterItems = [];
  showFilter = true;
  sWorkflowToSearch: any;
  selectedMPGitem: any;
  showMenu: boolean;

  constructor(public apifunction: WorkflowApiService) {

  }


  ngAfterViewInit(): void {
    //  this.selectDefaultMPG();
    console.log('ngAfterViewInit')


  }
  ngOnInit(): void {
    this.showMenu = false;
    try {



      this.apifunction.selectedMPGObserver.subscribe((res: any) => {
        // this.currDate = new Date();
        // this.sTokenToSearch = "";
        if (res) {
          console.log(res);
          this.selectedMPGitem = res;
          // BCM_ID: 10207
          // BCM_long_name: "Asset Allocation Gap by Portfolio"
          // this.currDate = new Date();
          // this.setMPGData();
        }
      });
    }
    catch (error) {
      console.log(error);
    }
  }

  mpg_click(mpgItem: any, event: any) {
    try {
      var elements = document.getElementsByClassName("list-item")
      // console.log(elements)
      for (var i = 0, len = elements.length; i < len; i++) {
        elements[i].classList.remove("active")
      }
      // console.log(event)

      event.target.classList.add("active");



      this.apifunction.setFilterToggle.next(false);
      this.apifunction.setSelectedMPG(mpgItem);
    }
    catch (error) {
      console.log(error);
    }
  }
  toggleMenu() {
    this.showMenu = !this.showMenu;
    // if (this.showMenu === false){
    //   this.expandedChange.emit({isMPG : true, isFilter: true, isMenu: false});
    // }
    // else {
    //   this.expandedChange.emit({isMPG : true, isFilter: true, isMenu: true});
    // }

    if (this.showMenu === false) {
      if (this.expanded.isFilter === false) {
        this.expandedChange.emit({ isMPG: true, isFilter: false, isMenu: false });
      } else {
        this.expandedChange.emit({ isMPG: true, isFilter: true, isMenu: false });
      }
    }
    else {
      if (this.expanded.isFilter === false) {
        this.expandedChange.emit({ isMPG: true, isFilter: false, isMenu: true });
      } else {
        this.expandedChange.emit({ isMPG: true, isFilter: true, isMenu: true });
      }
    }
    // console.log(this.expanded);
  }

}
