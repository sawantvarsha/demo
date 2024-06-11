import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rm-customer-mapper',
  templateUrl: './rm-customer-mapper.component.html',
  styleUrls: ['./rm-customer-mapper.component.scss'],
})
export class RmCustomerMapperComponent implements OnInit {
  isProd = environment.production;
  rmName: string;
  rmGroup: string;
  customerGroups = [];
  unmappedCustomers = [];
  mappedCustomers = [];
  selectedCustomerGroup: string;
  mapped = false;
  customersForMapping = [];
  msg = '';
  loadflag = false;
  selectedCustomer: any;
  customersOfRMArray: any[];
  customerList: any;
  customerGrpList: any[];
  customerArray: any = [];
  selectedCustomers: any[] = [];
  customers: any[] = [];
  selectedGroup: any[];
  entityID: any;
  constructor(public custApi: CustomerApiService, public ref: ChangeDetectorRef, public authorApi: AuthService) {
    this.customerList = [];
    this.customersOfRMArray = [];
    this.mappedCustomers = [];
    this.customerGrpList = [];
    this.selectedCustomer = '';
    this.selectedCustomerGroup = '';
  }

  ngOnInit(): void {
    this.msg = '';
    this.rmGroup = sessionStorage.getItem('FinIQUserID');
    this.rmName = sessionStorage.getItem('FinIQUserID');
    this.entityID = this.authorApi.EntityID;
    this.custApi.getCustomerGroupForMapping(this.entityID);
    this.customersForMapping = [];
    this.selectedCustomer = '';

    this.custApi.GetAllCustomerGroupsObserver.subscribe((res) => {
      if (res.length !== 0) {
        this.customerList = res;
        this.customerList = this.customerList.filter(c => c.CustomerGroup !== '').map(c => {
          return {
            AIO_Account_No: c.AIO_Account_No,
            CustomerGroup: c.CustomerGroup,
            CustomerId: c.CustomerId,
            CustomerName: c.CustomerName
          };
        });
        this.customerGrpList = [... new Set(this.customerList.map(c =>
          new Object(
            {
              CustomerGroup: c.CustomerGroup,
              CustomerList: new Object({
                CustomerName: c.CustomerName,
                CustomerId: c.CustomerId
              }),
              isGroupMapped: false
            }
          )))];
        // this.customerGroups.forEach((grp, i) => {
        //   const grpObj = { CustomerGroup: grp, CustomerList: this.customerList[i], isGroupMapped: false }
        //   this.customerGrpList.push(grpObj);
        // })
        // this.customerGroups.forEach((grp) => {
        //   const grpObj = { CustomerGroup: grp, CustomerList: this.customerList, isGroupMapped: false };
        //   this.customerGrpList.push(grpObj);
        // });

        // this.customerGroups.forEach(grp => {
        //   this.custApi.getMappingStatus(grp);
        // })
        console.log(this.customerList);
        console.log('Customer List', this.customerList);
        console.log('customerGrpList', this.customerGrpList);

        this.custApi.getCustomersOfRM(this.rmName);

      } else {
      }
    });

    this.custApi.GetCustomerStatusObserver.subscribe((res) => {
      try {
        this.unmappedCustomers = [];
        this.mappedCustomers = [];
        if (res.response.Get_Map_UnMapped_Customers_From_Group_For_Mapping_CSPResult.length !== 0) {
          // console.log(res);
          const CustomerGroup = res.CustomerGroup;
          const customerList: any[] = res.response.Get_Map_UnMapped_Customers_From_Group_For_Mapping_CSPResult;

          this.customerGrpList.forEach(grp => {
            if (grp.CustomerGroup === CustomerGroup) {
              grp.CustomerList = customerList;
              this.customerList.forEach(cust => {
                if (cust.MAPPED_YN === 'Y') {
                  grp.isGroupMapped = true;
                } else if (cust.MAPPED_YN === 'N') {
                  grp.isGroupMapped = false;
                }
              });
            }
          });
          this.ref.detectChanges();
        } else {
        }
      } catch (e) { }
    });

    console.log('CustGRpListStatus', this.customerGrpList);

  }

  getCustomers(CustomerGroup) {
    // this.msg = '';
    this.customersForMapping = [];
    this.selectedCustomerGroup = CustomerGroup;
    this.custApi.getMappingStatus(CustomerGroup);
  }

  mapCustomers() {
    // this.loadflag = true;
    // this.custApi.insertRMUpdateInfo(this.customersForMapping);
    // this.customersForMapping = [];
    this.customers = this.selectedCustomers;
    if (this.customers.length === 0) {
      this.msg = 'Please select Customer.';
      // this.loadflag = true;
    } else {
      this.customers.push(
        {
          RCM_Id: '',
          LoginID: '',
          RM_Group_Name: '',
          RM_Manager_Name: '',
          RM_Group_Key: '',
          RM_Parent_Group_key: '',
          RM_GS_Type: 'G',
          Customer_GS_Type: 'G',
          Customer_Group_Name: '',
          Customer_Name: '',
          Access_Type: 'Y',
          MainRM_YN: 'N',
          Valid_From: '',
          Valid_To: '',
          RM_Key: '',
          Created_By: '',
          Created_At: '',
          LRM_Id: '',
          RM_ID: '',
          Customer_ID: '',
          EntityID: 4
        }
      );
      this.custApi.insertRMUpdateInfo(this.customers).subscribe(res => {
        try {
          if (res.Insert_CustomerRM_MapResult === true) {
            this.loadflag = false;
            this.msg = 'Customer RM Mapping updated successfully';
            this.customersForMapping = [];
            // this.getCustomers(selectedGrp.CustomerGroup);
            for (let i = 0; i < this.customers.length; i++) {
              this.getMappingStatus(this.customers[i].Customer_Group_Name);
            }
          }
          else {
            this.loadflag = true;
            this.msg = 'Customer RM Mapping update Failed';
          }
          this.selectedGroup = [];
          this.customers = [];
          this.selectedCustomers = [];
        } catch (e) {
          this.msg = 'Customer RM Mapping update Failed';
        }
      });
      // console.log(this.selectedGroup);
    }
  }

  getMappingStatus(CustomerGroup) {
    this.custApi.getMappingStatus(CustomerGroup);
  }

  mapUnmapCustomer(selectedGrp) {
    try {
      this.msg = '';
      this.customerGrpList.forEach(_g => {
        // if (g.CustomerGroup === selectedGrp.CustomerGroup) {
        //   g.isGroupMapped = !g.isGroupMapped;
        // }
      });
      console.log('Selected Grp', selectedGrp);
      // for (let i = 0; i < selectedGrp.CustomerList.length; i++) {
      //   if (selectedGrp.CustomerGroup === selectedGrp.CustomerList[i].CustomerGroup) {
      //     this.selectedCustomers.push(
      //       {
      //         RCM_Id: '', // selectedGrp.CustomerList[i].RCM_Id,
      //         LoginID: sessionStorage.getItem('Username'),
      //         RM_Group_Name: sessionStorage.getItem('Username'),
      //         RM_Manager_Name: sessionStorage.getItem('FinIQUserID'),
      //         RM_Group_Key: '', // selectedGrp.CustomerList[i].RM_Group_Key,
      //         RM_Parent_Group_key: '', // selectedGrp.CustomerList[i].RM_Parent_Group_key,
      //         RM_GS_Type: 'G',
      //         Customer_GS_Type: 'G',
      //         Customer_Group_Name: selectedGrp.CustomerGroup,
      //         Customer_Name: selectedGrp.CustomerList[i].CustomerName,
      //         Access_Type: 'Y',
      //         MainRM_YN: 'N',
      //         Valid_From: '', // selectedGrp.CustomerList[i].Valid_From,
      //         Valid_To: '', // selectedGrp.CustomerList[i].Valid_To,
      //         RM_Key: '', // selectedGrp.CustomerList[i].RM_Key,
      //         Created_By: sessionStorage.getItem('Username'),
      //         Created_At: '', // selectedGrp.CustomerList[i].Created_At,
      //         LRM_Id: '', // selectedGrp.CustomerList[i].LRM_Id,
      //         RM_ID: '', // selectedGrp.CustomerList[i].RM_ID,
      //         Customer_ID: selectedGrp.CustomerList[i].CustomerId,
      //         EntityID: 4
      //       }
      //     );
      //   }
      // }
    } catch (ex) {
      console.log('Error while selecting customer: ', ex);
    }

  }
}
