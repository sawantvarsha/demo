import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/services/config.service';
import { MenuApiService } from 'src/app/services/menu-api.service';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';

import { CustomerApiService } from '../../services/customer-api.service';
@Component({
  selector: 'app-register-menu',
  templateUrl: './register-menu.component.html',
  styleUrls: ['./register-menu.component.scss']
})
export class RegisterMenuComponent implements OnInit, OnDestroy {
  login = '';
  portal = 'RM Portal';
  userType = '';
  loginRMDetails = [];
  mainMenu: string;
  subMenu: string;
  menuDisplay = [] as any;
  targetArray = [] as any;
  name: any;
  customMenu = [] as any;
  userTypeDD = 'RM';
  menuUpdated = false;
  portalArray = [
    {
      menu: 'RM portal',
      submenu: 'RM'
    },
    {
      menu: 'Client Portal',
      submenu: 'Client'
    },
    {
      menu: 'Admin Portal',
      submenu: 'Admin'
    }
  ];
  menuArray: any[] = [];

  sidebarArray = [];
  allsidebarMenuList = [];
  menuArrayClient = [{}];
  menuArrayEmployer = [{}];
  msg: string;
  sidebarData: Subscription;
  selectedPortal: any;
  chkAllMenu: any;
  isAddNewRow: boolean;
  AddNewRowBtnLabel: any;
  constructor(public cfs: CustomerApiService, private api: WorkflowApiService, public menuApi: MenuApiService) {
    this.isAddNewRow = false;
    this.AddNewRowBtnLabel = 'Add';
    this.portalArray = AppConfig.settings.CSP_MenuTypes.split(',').map(m => { return { menu: m.trim() + ' Portal', submenu: m.replace(/\s/g, '').trim() } });
  }

  ngOnDestroy() {
    this.allsidebarMenuList = [];
    this.chkAllMenu = false;
    // this.sidebarData.unsubscribe();
  }

  ngOnInit(): void {
    this.msg = '';
    this.menuUpdated = false;
    this.login = sessionStorage.getItem('Username');
    this.userType = sessionStorage.getItem('UserType');
    this.defaultValues('RM');
    switch (this.userType.toUpperCase()) {
      case 'CLIENT':
        this.userType = 'Client';
        break;
      case 'RM':
        this.userType = 'RM';
        break;
      case 'EMPLOYER':
        break;
      case 'ADMIN':
        this.userType = 'Admin';
        break;

      default:
        break;
    }



    console.log('upadted menu register', this.menuArray);
    this.api.getMenuObserver.subscribe(res => {
      if (res === 'Success') {
        this.msg = 'Menu updated successfully';
        this.menuUpdated = true;
      } else {
        this.menuUpdated = false;
      }
    });
  }

  getPortal(portal) {
    // this.allsidebarMenuList=[];
    // this.menuArray = [];
    this.defaultValues(portal);
    console.log('active portal', portal);
    this.userTypeDD = portal;

  }

  saveMenuData() {

    this.defaultValues(this.userTypeDD);
  }

  defaultValues(portal) {
    this.selectedPortal = portal;
    this.menuApi.getMenu(portal).subscribe(
      (res: any) => {
        console.log(res);
        const menuArr = res.GetMenudataResult;
        if (menuArr) {
          this.menuArray = menuArr;
          this.menuArray = this.menuArray.map(m => {
            const menu = {
              menu: m.Menu,
              submenu: m.SubMenu,
              SelectedYN: 'N',
              position: m.Position,
              path: m.Path,
              isEdit: false,
              App_ID: m.App_ID
            };
            return menu;

          });
          this.cfs.GetSidebar(this.userTypeDD).subscribe(res => {
            // console.log('usertype0', this.userType, res);
            this.allsidebarMenuList = res;
            if (this.allsidebarMenuList.length !== 0) {
              // this.menuArray.forEach(ele1 => {
              //   this.allsidebarMenuList.forEach(ele2 => {
              //     if (ele1.menu.toLowerCase() === ele2.Menu.toLowerCase() && ele1.submenu.toLowerCase() === ele2.Submenu.toLowerCase() && ele2.DisplayYN === 'Y') {
              //       ele1.SelectedYN = 'Y';
              //       ele1.position = ele1.Position;
              //     }
              //   });
              // });
              this.menuArray.forEach(m =>
                m.Checked = this.allsidebarMenuList
                  .filter(
                    a =>
                      (m.menu.toUpperCase() === a.Menu.toUpperCase() && m.submenu.toUpperCase() === a.Submenu.toUpperCase() && a.DisplayYN === 'Y')).length > 0
              );
              console.log(this.menuArray);
            }
          });
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  editRow(editableRow, index) {

    console.log(editableRow, index);
    this.menuArray[index].isEdit = true;
    this.menuArray[index].position = this.menuArray[index].position;
  }

  saveRow(editableRow, _index) {
    if (!this.isAddNewRow) {
      this.menuApi.updateMenuPosition(
        this.userTypeDD,
        editableRow.menu,
        editableRow.submenu,
        editableRow.Checked ? 'Y' : 'N',
        editableRow.position,
        editableRow.App_ID,
        editableRow.path
      ).subscribe(res => {
        console.log(res);
        if (res) {
          this.menuUpdated = true;
          this.msg = 'Row Updated successfully';
          editableRow.isEdit = false;
          setTimeout(() => {
            this.menuUpdated = false;
            this.msg = '';
          }, 3000);
        } else {
          this.menuUpdated = true;
          this.msg = 'Row Update Unsuccessful';
        }
      });
      // console.log(editableRow, index);
    } else {
      const App_ID = editableRow.App_ID === undefined ? 'ND_Ang_' + editableRow.menu.replace(/\s/g, '_') : editableRow.App_ID;
      this.menuApi.addMenu(this.userTypeDD, editableRow.menu, editableRow.submenu, editableRow.Checked ? 'Y' : 'N', editableRow.position, App_ID, editableRow.path).subscribe((res: any) => {
        console.log(res);
        this.menuUpdated = true;
        this.msg = res.Insert_MenuMainResult;
        editableRow.isEdit = false;
        setTimeout(() => {
          this.menuUpdated = false;
          this.msg = '';
        }, 3000);
      });
    }
  }
  selectAllMenu() {
    this.menuArray.forEach(m => {
      m.Checked = !this.chkAllMenu;
      this.menuApi.updateMenuPosition(this.userTypeDD, m.menu, m.submenu, m.Checked ? 'Y' : 'N', m.position, m.App_ID, m.path).subscribe(res => {
        console.log(res);
        this.menuUpdated = true;
        this.msg = 'Row Updated successfully';
        setTimeout(() => {
          this.menuUpdated = false;
          this.msg = '';
        }, 3000);
      });
    });

  }
  addNewMenu() {
    this.isAddNewRow = !this.isAddNewRow;
    if (this.isAddNewRow) {
      this.AddNewRowBtnLabel = 'Cancel';
      this.menuArray.unshift({ isEdit: true });
      console.log(this.menuArray);
    } else {
      this.AddNewRowBtnLabel = 'Add';
      this.menuArray.shift();
    }
  }
  refresh(){
    this.getPortal(this.selectedPortal)    
  }
}
