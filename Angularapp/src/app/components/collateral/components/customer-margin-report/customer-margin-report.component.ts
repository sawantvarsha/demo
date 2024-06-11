import { Component, OnInit, ElementRef } from '@angular/core';
import { CollateralApiService } from '../../collateral-api/collateral-api.service';
import { CustomerApiService } from '../../../../services/customer-api.service';

@Component({
  selector: 'app-customer-margin-report',
  templateUrl: './customer-margin-report.component.html',
  styleUrls: [
    './customer-margin-report.component.scss'
    , '../../collateral.component.scss'
  ]
})
export class CustomerMarginReportComponent implements OnInit {


  currentOpenExpandableRow = -1;
  globalMarginData = [];
  globalMarginView = [];
  globalMarginViewUnique = [];
  rmNamesList = [];
  customerGroups = [];
  customerIds = [];
  selectedRM = '-1';
  selectedCustomerGroup = '-1';
  customerDisabled = true;

  firstDataLoadDone = false;
  baseCCY: string;

  constructor(private elem: ElementRef, private collateralApi: CollateralApiService, private custapi: CustomerApiService) { }

  ngOnInit() {
    const that = this;
    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    this.custapi.getBankBaseCCYOBS.subscribe(ccy =>{
      this.baseCCY = ccy;
    })
    this.collateralApi.globalMarginData.subscribe((d: []) => {
      try {
        // console.log(d);
        if (d) {
          that.globalMarginData.length = 0;
          that.globalMarginData = d;
          that.processGlobalMarginData();
        } else {
          that.globalMarginData.length = 0;
          that.globalMarginView.length = 0;
        }
      } catch (ex) {
  //console.log(ex);
      }
    });

    for (let i = 0; i < this.elem.nativeElement.getElementsByClassName('expandable-row').length; i++) {
      this.expandDetails(i);
    }

    this.collateralApi.RMNamesData.subscribe((d: []) => {
      try {
        if (d) {
          that.rmNamesList = d.map((rm: any) => rm.Rel_Manager_Name);
          if (that.customerGroups.length === 0) {
            const rmList = that.rmNamesList.reduce((str, rm) => str === '' ? str + '\'' + rm + '\'' : str + ',\'' + rm + '\'', '');
            that.collateralApi.GetGlobalMarginReportData('0', '2', 'Dealer4', '', rmList, 'customerGroup', this.baseCCY);
          }
        }
      } catch (ex) {
  //console.log(ex);
      }
    });

    this.collateralApi.CustomerGroup.subscribe((d: []) => {
      // console.log(d);
      try {
        if (d) {
          that.customerGroups = d.map((cg: any) => {
            return {
              GroupId: cg.Group_Id,
              GroupName: cg.Group_Name
            };
          });
          that.customerDisabled = false;
          that.customerGroups.forEach((cg: any) => {
            if (that.customerIds.filter((cid: any) => cid.GroupId === cg.GroupId).length === 0) {
              this.collateralApi.GetGlobalMarginReportData(cg.GroupId, '4', 'Dealer4', '', '', 'customerId',this.baseCCY);
            }
          });
        }
      } catch (ex) {
  //console.log(ex);
      }
    });

    this.collateralApi.CustomerId.subscribe((d: any) => {
      try {
        if (d.data) {
          that.customerIds = d.data.map((c: any) => {
            return {
              CustomerId: c.CustomerId,
              GroupId: d.GroupId
            };
          });
          if (!that.globalMarginData.length && !that.firstDataLoadDone) {
            const allGroupIds = that.customerGroups.reduce((str, c) => str === '' ? str + '\'' + c.GroupId + '\'' : str + ',\'' + c.GroupId + '\'', '');
            that.collateralApi.GetGlobalMarginReportData(allGroupIds, '5', 'Dealer4', that.customerIds[0].CustomerId, '', 'globalMarginReport',this.baseCCY);
            that.firstDataLoadDone = true;
          }
          // that.collateralApi.GetGlobalMarginReportData(that.customerGroups[0].GroupId, '5', 'Dealer4', '', '\'' + that.selectedCustomerGroup + '\'', 'globalMarginReport');
        }
      } catch (ex) {
  //console.log(ex);
      }
    });

    this.collateralApi.GetGlobalMarginReportData(' ', '1', 'Dealer4', '', '', 'rmNames',this.baseCCY);

  }

  expandDetails(index, groupId = '') {
    // console.log(index);
    const expandableRow = this.elem.nativeElement.getElementsByClassName('expandable-row')[index] as HTMLTableRowElement;
    // console.log(expandableRow);
    if (expandableRow.classList.contains('expanded')) {
      expandableRow.classList.replace('expanded', 'collapsed');
    } else {
      if (groupId !== '') {
        this.collateralApi.expandRow(groupId);
      }
      expandableRow.classList.replace('collapsed', 'expanded');
    }
  }

  changeRM() {
    this.customerDisabled = true;
    this.globalMarginData.length = 0;
    this.globalMarginView.length = 0;
    this.selectedCustomerGroup = '-1';
    this.customerGroups.length = 0;
    this.customerIds.length = 0;
    this.firstDataLoadDone = false;
    if (this.selectedRM === '-1') {
      const rmList = this.rmNamesList.reduce((str, rm) => str === '' ? str + '\'' + rm + '\'' : str + ',\'' + rm + '\'', '');
      this.collateralApi.GetGlobalMarginReportData('0', '2', 'Dealer4', '', rmList, 'customerGroup',this.baseCCY);
    } else {
      this.collateralApi.GetGlobalMarginReportData('0', '2', 'Dealer4', '', '\'' + this.selectedRM + '\'', 'customerGroup',this.baseCCY);
    }
  }

  changeCustomer() {
    const allGroupIds = this.customerGroups.reduce((str, c) => str === '' ? str + '\'' + c.GroupId + '\'' : str + ',\'' + c.GroupId + '\'', '');
    if (this.selectedCustomerGroup === '-1') {
      this.collateralApi.GetGlobalMarginReportData(allGroupIds, '5', 'Dealer4', this.customerIds[0].CustomerId, '', 'globalMarginReport',this.baseCCY);
    } else {
      this.collateralApi.GetGlobalMarginReportData('\'' + this.selectedCustomerGroup + '\'', '5', 'Dealer4', this.customerIds.filter((c: any) => c.GroupId)[0].CustomerId, '', 'globalMarginReport',this.baseCCY);
    }
  }

  refresh() {
    this.globalMarginData.length = 0;
    this.globalMarginView.length = 0;
    this.selectedCustomerGroup = '-1';
    this.customerGroups.length = 0;
    this.customerIds.length = 0;
    this.firstDataLoadDone = false;
    this.collateralApi.GetGlobalMarginReportData(' ', '1', 'Dealer4', '', '', 'rmNames',this.baseCCY);
  }

  processGlobalMarginData() {
    try {
      // console.log(this.globalMarginData);
      const that = this;
      that.globalMarginView.length = 0;
      const globalMarginDataFiltered = this.globalMarginData.map((gm: any) => {
        const row: any = {
          GroupId: gm.Group_Id || ' ',
          AccountName: gm.AccountName || ' ',
          ExposureCode: gm.ExposureCode || ' ',
          ApprovedLimit: gm.ApprovedLimit || ' ',
          LimitUsed: gm.LimitUsed || ' ',
          AvailableLimit: gm.AvailableLimit || ' ',
          CEMargin: gm.CEMargin_Collateral || ' ',
          MTM: gm.MTM || ' ',
          ACB: gm.ACB || ' ',
          IMMMCM: gm.IMMMCM || ' ',
          ShortfallStatus: gm.ShoarfallStatus || ' ',
          ShortfallSince: gm.ShortfallSince || ' ',
          CustomerId: gm.Customer_Id || ' ',
          RMCode: gm.RMCode || ' ',
          FreeMargin: gm.FreeMargin || ' ',
          AccountNo: gm.AccountNo || ' ',
          LimitExcessSince: gm.LimitExcessSince || ' ',
          MarginRequiredMM: gm.MarginRequired_MM || ' ',
          MarginRequiredCM: gm.MarginRequired_CM || ' '
        };
        return row;
      });
      // this.globalMarginViewUnique = this.globalMarginData.map((gm: any) => gm.Group_Id).filter((value, index, self) => self.indexOf(value) === index);
      // console.log(this.globalMarginViewUnique);
      const groupIds = [];
      let index = 0;
      globalMarginDataFiltered.forEach(row => {
        let viewRow;
        if (!groupIds.includes(row.GroupId)) {
          viewRow = row;
          viewRow.RowSpan = {};
          Object.keys(row).forEach((k) => {
            viewRow.RowSpan[k] = 1;
          });
          viewRow.MergedRowIndex = index;
          index += 1;
          groupIds.push(row.GroupId);
        } else {
          const previousRow = that.globalMarginView.filter((r) => r.GroupId === row.GroupId)[0];
          viewRow = {};
          viewRow.RowSpan = {};
          Object.keys(previousRow).forEach((k) => {
            if (k !== 'RowSpan') {
              if (previousRow[k] === row[k]) {
                previousRow.RowSpan[k] += 1;
              } else {
                viewRow.RowSpan[k] = 1;
                viewRow[k] = row[k];
              }
            }
          });
        }
        that.globalMarginView.push(viewRow);
      });
      const allGroupIds = this.globalMarginData.map((gm: any) => gm.Group_Id);
      for (let i = 1; i < allGroupIds.length; i++) {
        if (allGroupIds[i - 1] !== allGroupIds[i]) {
          this.globalMarginView.splice(i, 0, { expandable: true, GroupId: allGroupIds[i - 1] });
          allGroupIds.splice(i, 0, allGroupIds[i]);
        }
      }
      // console.log(this.globalMarginView);
      this.globalMarginView.splice(allGroupIds.length, 0, { expandable: true, GroupId: allGroupIds[allGroupIds.length - 1] });
    } catch (ex) {
//console.log(ex);
    }
  }


}
