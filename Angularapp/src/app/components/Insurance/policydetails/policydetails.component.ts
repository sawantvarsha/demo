import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonApiService } from '../../../services/common-api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomerApiService } from '../../../services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { Router } from '@angular/router';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { AppConfig } from 'src/app/services/config.service';
import { elementAt } from 'rxjs/operators';
@Component({
  selector: 'app-policydetails',
  templateUrl: './policydetails.component.html',
  styleUrls: ['./policydetails.component.scss'],
})
export class PolicydetailsComponent implements OnInit {
  insuranceDetails = [];
  CustomerName = '';
  custId: any;
  baseCCY: string;
  IsBackButtonEnabled: boolean;
  showPolicy: boolean = false;
  PruLIPData: any = [];
  PolicyRiderData: any[] = [];
  PolicyRelData: any = [];
  loader: boolean;
  loader2: boolean;
  loader1: boolean;
  PolicyRiderDataRes: any = [];
  PruLIPDataRes: any;
  PolicyRelDataRes: any;
  showPolicyDetailsflag: any = [];
  showRiderDescflag: any = [];

  previousIndex: any;
  userType: any;
  isUserRM: boolean;
  loginID: any;
  CIF: any;
  EntityID: any;
  showRiderPopup: boolean = false;
  showPopup: boolean = false;
  policyName: any;
  policyNo: any;
  openSurrenderPopup: boolean = false;
  showRiderProduct: boolean = false;

  //Added by Uddesh on 3rd June 2022 START
  riderSliderIndex: any;
  relSliderIndex: any;
  showPrevArrowforRider: boolean;
  showNextArrowforRider: boolean;
  showPrevArrowforRel: boolean;
  showNextArrowforRel: boolean;
  selectedSurrenderPolicy: any;
  riderListArray: any;
  getRiderDesc: any;
  prevIndex: any;
  showPolicyRiderDesc: boolean;
  benefitCode: any;
  productRiderArray: any[] = [];
  riderListArray1: any;
  riderListArray2: any;
  showRiderDescflag1: any;
  productRiderArray1: any[] = [];
  riderLoader: boolean;


  constructor(
    public cfs: CommonApiService,
    public authapi: AuthService,
    public custapi: CustomerApiService,
    public homeapi: HomeApiService,
    public router: Router,
    public wfs: WorkflowApiService,
    public ref: ChangeDetectorRef
  ) {
    //Added by Uddesh on 3rd June, 2022 START
    this.openSurrenderPopup = false;
    this.riderSliderIndex = 0;
    this.relSliderIndex = 0;
    this.showNextArrowforRider = false;
    this.showPrevArrowforRider = false;
    this.showNextArrowforRel = false;
    this.showPrevArrowforRel = false;

    //Added by Uddesh on 3rd June, 2022 DONE
  }

  ngOnInit(): void {
    // Do not remove

    this.IsBackButtonEnabled =
      this.homeapi.RediretToHomeBuySellPledge === '' ? false : true;
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.IsBackButtonEnabled =
      this.homeapi.RediretToHomeBuySellPledge === '' ? false : true;
    this.userType = this.authapi.UserType;
    this.isUserRM = this.authapi.UserType.toUpperCase().includes('RM')
      ? true
      : false;
    this.EntityID = this.authapi.EntityID;
    // this.baseCCY = sessionStorage.getItem("BankBaseCcy");
    // this.CustomerName = sessionStorage.getItem('CustomerName');
    // this.custId = sessionStorage.getItem('CustomerID');
    if (!this.isUserRM) {
      try {
        this.custId = this.homeapi.CustomerId;
        this.CustomerName = this.homeapi.CustomerName;
        this.CIF = this.homeapi.CIF;
        this.loginID = this.authapi.UserName;
      } catch (EX) {
        console.log(EX);
      }
    }
    this.custapi.getBankBaseCCYOBS.subscribe((ccy) => {
      this.baseCCY = ccy;

      this.homeapi
        .GetCustInsuranceDetails(
          this.custId,
          this.CustomerName,
          this.authapi.EntityID,
          this.baseCCY,
          this.homeapi.Portfolio || ''
        )
        .subscribe((res) => {
          if (res.length !== 0) {
            //console.log(res);
            this.insuranceDetails = res.Get_CustInsuranceDetails_LCYEResult;
            this.getSurrenderValue();
          }
        });
    });

    // this.getRiderDetails();
  }

  ngOnDestroy(): void {
    this.homeapi.RediretToHomeBuySellPledge = '';
  }

  async getSurrenderValue() {
    try {
      this.insuranceDetails.forEach(async (element, i) => {
        const response = await this.homeapi
          .Get_PruSurval_Data(element.Policy_Number)
          .then((res) => {
            // console.log("response surrender",res);
            if (res.length !== 0) {
              let policyData = res[0];
              if (element.Policy_Number === policyData.PolicyNumber) {
                this.insuranceDetails[i].SurrenderPolicyValue =
                  policyData.SurrenderValue;
              }
            } else {
              this.insuranceDetails[i].SurrenderPolicyValue = '';
            }
            // return res;
          })
          .catch((err) => console.log(err));
      });
      // console.log('this.insuranceDetails', this.insuranceDetails);
    } catch (error) { }
  }

  fnRedirectToHomePage() {
    if (this.homeapi.RediretToHomeBuySellPledge === 'HOME') {
      // this.homeapi.openPopup =true;
      this.router.navigate(['/home']);
      this.homeapi.RediretToHomeBuySellPledge = '';
    } else {
      // this.router.navigate(['/portfolioallocation']);
    }
  }

  showPolicyDetails(policyno, i) {

    this.showPolicyDetailsflag[this.previousIndex] = false;
    // console.log("policyno", policyno);
    // this.showPolicy = !this.showPolicy;
    // if (this.showPolicy === true) {
    this.cfs.ScrollTo('app-policydetails', '.policy-container', 'up');
    this.getPolicyRel(policyno);
    this.getPolicyRider(policyno);
    this.getPruLIP(policyno);
    // if (this.previousIndex === i) {
    this.showPolicyDetailsflag[i] = true;
    // } else{
    // this.showPolicyDetailsflag[i] = !this.showPolicyDetailsflag[i];
    // }
    this.previousIndex = i;
    // }
    
  }

  closePolicyDetails(_no, i) {
    // console.log("no, i", no,i);
    this.showPolicyDetailsflag[i] = false;
  }

  getPruLIP(policyno: any) {
    try {
      this.loader = true;
      if (policyno !== undefined || policyno !== null) {
        this.homeapi.Get_PruLIP(policyno).subscribe((res) => {
          if (res) {
            this.loader = false;
            this.PruLIPData = [];
            this.PruLIPDataRes =
              res.PolicyDetailsResponseBody.PolicyILPDetailsResponse;
            if (
              res.PolicyDetailsResponseBody.PolicyILPDetailsResponse !== null
            ) {
              // console.log("res", this.PruLIPDataRes);
              this.PruLIPData =
                res.PolicyDetailsResponseBody.PolicyILPDetailsResponse[0];
            } else {
              this.PruLIPData = [];
            }
          }
        });
      }
    } catch (error) {
      this.PruLIPData = [];
    }
  }

  getPolicyRider(policyno: any) {
    try {
      this.loader1 = true;
      if (policyno !== undefined || policyno !== null) {
        this.homeapi.Get_PolicyRider(policyno).subscribe((res) => {
          if (res) {
            // this.loader1 = false;
            this.PolicyRiderData = [];
            // this.PolicyRiderDataRes =
            //   res.PolicyDetailsResponseBody.PolicyRiderDetailsResponse;
            // if (
            //   res.PolicyDetailsResponseBody.PolicyRiderDetailsResponse !== null
            // ) {
            //   this.PolicyRiderData =
            //     res.PolicyDetailsResponseBody.PolicyRiderDetailsResponse[0];
            // } else {
            //   this.PolicyRiderData = [];
            // }

            //Updated by Uddesh on 3rd June, 2022 STARTED
            this.loader1 = false;
            this.PolicyRiderDataRes =
              res.PolicyDetailsResponseBody.PolicyRiderDetailsResponse;
            if (
              res.PolicyDetailsResponseBody.PolicyRiderDetailsResponse !== null
            ) {
              this.PolicyRiderDataRes.forEach(element => {
                this.PolicyRiderData.push(
                  element
                );
              });

            } else {
              this.PolicyRiderData = [];
              this.PolicyRiderDataRes = [];

            }

            // const dummyData = {
            //   Application_Date: '8/10/2021 12:00:00 AM',
            //   Approval_Date: '8/10/2021 12:00:00 AM',
            //   Benefit_Code: 'NEWPOLICY',
            //   Benefit_Code_Description: 'NEWPOLICY Crisis Cover',
            //   Commencement_Date: '',
            //   Currency: 'USD',
            //   Declaration_Date: '8/10/2021 12:00:00 AM',
            //   Payment_Method: 'CASH',
            //   Policy_No: 'A000081518',
            //   Policy_Term: 0,
            //   Policy_Year: '0',
            //   Premium_Mode: '',
            //   Premium_Start: 350,
            //   Product_Code: '',
            //   Rider_No: 'RDR0000002',
            //   Rider_Premium_Term: 0,
            //   Status_Code: 'Proposal',
            //   Sum_Assured: 50000,
            //   Total_Extra_Premium: 10000,
            //   Unique_Rider_Identifier: 0,
            // };

            // this.PolicyRiderData.push(dummyData);
            // console.log('policy', this.PolicyRiderData);

            if (this.PolicyRiderData.length > 1) {
              this.showNextArrowforRider = true;
              this.showPrevArrowforRider = false;
            }
            //Changes made by Uddesh on 3rd June, 2022 DONE
          }
        });
      }
    } catch (error) {
      this.PolicyRiderDataRes = [];
      this.PolicyRiderData = [];
    }
  }

  getPolicyRel(policyno: any) {
    try {
      this.loader2 = true;
      if (policyno !== undefined || policyno !== null) {
        this.homeapi.Get_PolicyRelationship(policyno).subscribe((res) => {
          if (res) {
            // this.loader2 = false;
            this.PolicyRelData = [];
            // this.PolicyRelDataRes =
            //   res.PolicyDetailsResponseBody.PolicyRelationshipDetailsResponse;
            // if (
            //   res.PolicyDetailsResponseBody
            //     .PolicyRelationshipDetailsResponse !== null
            // ) {
            //   this.PolicyRelData =
            //     res.PolicyDetailsResponseBody.PolicyRelationshipDetailsResponse[0];
            // } else {
            //   this.PolicyRelData = [];
            // }

            //Updated by Uddesh on 3rd June, 2022 STARTED
            this.loader2 = false;
            this.PolicyRelDataRes =
              res.PolicyDetailsResponseBody.PolicyRelationshipDetailsResponse;
            if (
              res.PolicyDetailsResponseBody
                .PolicyRelationshipDetailsResponse !== null
            ) {
              this.PolicyRelDataRes.forEach(element => {
                this.PolicyRelData.push(
                  element);
              });

            } else {
              this.PolicyRelData = [];
              this.PolicyRelDataRes = [];

            }

            // const dummyRelData = {
            //   Alternate_name: "",
            //   Benefiary_Owner_Appointed_Date: "8/10/2021 12:00:00 AM",
            //   BeneficiaryPercentage: 100,
            //   DOB: "5/8/1985 12:00:00 AM",
            //   Given_name: "",
            //   Height: 142,
            //   IDCTRY: "US",
            //   IDNUM: "Z5623475",
            //   IDTYPE: "PP",
            //   Nationality: "US",
            //   PolicyNo: "A000081518",
            //   Policy_Relationship_Ind: "PH",
            //   REMARKS: "Eligible",
            //   Relationship_Type: "P",
            //   Salutation: "Mr.",
            //   Smoker: "No",
            //   Surname: "PQR",
            //   Weight: 72.5
            // }
            // this.PolicyRelData.push(dummyRelData);
            // console.log("policyrelation", this.PolicyRelData)

            if (this.PolicyRelData.length > 1) {
              this.showNextArrowforRel = true;
              this.showPrevArrowforRel = false;
            }
            //Changes made by Uddesh on 3rd June, 2022 DONE
          }
        });
      }
    } catch (error) {
      this.PolicyRelData = [];
      this.PolicyRelDataRes = [];

    }
  }

  //Added by Alolika G on 3rd Feb 2022. Assigned by Parikshit K --START
  generatePolicyDoc(item) {
    try {
      this.wfs
        .generateDoc(
          this.EntityID,
          this.authapi.EntityCode,
          this.authapi.EntityName,
          this.loginID,
          item.Misc1,
          item.Misc2,
          item.Misc3
        )

        .subscribe((response) => {
          var fileURL =
            AppConfig.settings.CSP_DocGen_Virtual_Path +
            '/' +
            response[0].GeneratedFilePath.split('\\')[2];
          window.open(fileURL);
          // console.log(fileURL, "fileurl");
        });
    } catch (error) { }
  }
  //Added by Alolika G on 3rd Feb 2022. Assigned by Parikshit K --END

  clickRiderIcon(name, no) {
    try {
      this.showPopup = !this.showPopup;
      this.showRiderPopup = !this.showRiderPopup;
      this.policyName = name;
      this.policyNo = no;
      this.getRiderList();
      this.getRiderDetails();
    } catch (error) { }
  }

  clickRiderProduct(data) {
    // this.showPopup = !this.showPopup;
    this.showRiderProduct = !this.showRiderProduct
    this.benefitCode = data;
    // this.getRiderDetails();
  }

  closePopup() {
    this.showPopup = !this.showPopup;
    this.showRiderPopup = !this.showRiderPopup;
  }

  closeRiderPopup() {
    this.closePopup();
    this.showRiderProduct = !this.showRiderProduct
  }

  async getRiderDetails() {
    try {
      this.riderLoader = true;
      const response = await this.homeapi
        .Get_PruPRider_Data()
        .then((res) => {
          // console.log("response surrender",res);
          this.riderLoader = false;

          if (res.length !== 0) {
            this.getRiderDesc = res;
            // this.ref.detectChanges();

            // console.log('failed res not', res);
          } else {
            // console.log('failed');
          }
          // return res;
        })
        .catch((err) => console.log(err));

      // console.log('this.insuranceDetails', this.insuranceDetails);
    } catch (error) { }
  }


  CloseSurrenderPopup() {
    this.openSurrenderPopup = false;
  }

  PrevData(foritem: any) {
    switch (foritem) {
      case 'forRider':
        if (this.riderSliderIndex > 0) {
          this.riderSliderIndex--;
        }
        if (this.riderSliderIndex == 0) {
          this.showPrevArrowforRider = false;
        }
        this.showNextArrowforRider = true;
        break;

      case 'forRel':
        if (this.relSliderIndex > 0) {
          this.relSliderIndex--;
        }
        if (this.relSliderIndex == 0) {
          this.showPrevArrowforRel = false;
        }
        this.showNextArrowforRel = true;
        break;
    }
  }

  NextData(foritem: any) {
    switch (foritem) {
      case 'forRider':

        if (this.riderSliderIndex < this.PolicyRiderData.length) {
          this.riderSliderIndex++;
        }
        if (this.riderSliderIndex + 1 == this.PolicyRiderData.length) {
          this.showNextArrowforRider = false;
        }
        this.showPrevArrowforRider = true;
        break;

      case 'forRel':
        if (this.relSliderIndex < this.PolicyRelData.length) {
          this.relSliderIndex++;
        }
        if (this.relSliderIndex + 1 == this.PolicyRelData.length) {
          this.showNextArrowforRel = false;
        }
        this.showPrevArrowforRel = true;
        break;
    }
  }


  getSelectedSurrenderPolicyData(data: any) {
    this.selectedSurrenderPolicy = data;
    this.openSurrenderPopup = !this.openSurrenderPopup;
    // console.log("openSurrenderPopup", this.selectedSurrenderPolicy, this.openSurrenderPopup);
  }

  async getRiderList() {
    try {
      this.showRiderDescflag = [];
      this.showRiderDescflag1 = [];
      const response = await this.homeapi.DB_GetBenefitCodeDesc()
        .then((res) => {
          // console.log("response surrender", res);
          if (res.length !== 0) {
            this.riderListArray = res.BenefitCodeDescResponseBody.BenefitCodeDescResponse;
            // console.log('riderListArray', this.riderListArray);
          } else {
            // console.log('riderListArray ');
          }

          const list = this.riderListArray.slice();
          const middleIndex = Math.ceil(list.length / 2);

          this.riderListArray1 = list.splice(0, middleIndex);
          this.riderListArray2 = list.splice(-middleIndex);

          // console.log("firstHalf",firstHalf);  // [1, 2, 3]
          // console.log("secondHalf",secondHalf); // [4, 5, 6]
          // console.log(list); 
          // return res;
        })
        .catch((err) => console.log(err));

      // console.log('this.insuranceDetails', this.insuranceDetails);
    } catch (error) {

    }
  }

  showRiderDesc(code, index, grid) {
    try {
      switch (grid) {
        case 'first':
          this.cfs.ScrollTo('app-policydetails', '.rider-code-grid', 'up');
          this.showRiderDescflag[index] = !this.showRiderDescflag[index];
          // this.getRiderDetails(code);
          this.prevIndex = index;
          let tempArray = [];
          this.getRiderDesc.forEach(element => {
            if (code === element.BenefitCode) {
              tempArray.push(element);
            }
          });
          this.productRiderArray[index] = tempArray;
        break;

        case 'second':
          this.cfs.ScrollTo('app-policydetails', '.rider-code-grid', 'up');
          this.showRiderDescflag1[index] = !this.showRiderDescflag1[index];

          // this.getRiderDetails(code);
          this.prevIndex = index;

          let tempArray1 = [];
          this.getRiderDesc.forEach(element => {
            if (code === element.BenefitCode) {
              tempArray1.push(element);
            }
          });
          this.productRiderArray1[index] = tempArray1;
        break;

        default:
          break;
      }


    } catch (error) {

    }
  }

  closeRiderDesc(index, grid) {
    // console.log("no, i", no,i);
    try {
      switch (grid) {
        case 'first':
          this.showRiderDescflag[index] = false;
        break;

        case 'second':
          this.showRiderDescflag1[index] = false;
        break;

        default:
        break;
      }
    } catch (error) {

    }

  }

}
