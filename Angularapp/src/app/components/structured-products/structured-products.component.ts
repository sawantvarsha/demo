import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { environment } from '../../../environments/environment';
import { EqcApifunctionService } from './Services/eqc-apifunction.service';
import { EqcCommonfunctionsService } from './Services/eqc-commonfunctions.service';
// import { EqcApifunctionService } from './Services/eqc-apifunction.service';

@Component({
  selector: 'app-structured-products',
  templateUrl: './structured-products.component.html',
  styleUrls: ['./structured-products.component.scss'],
})
export class StructuredProductsComponent implements OnInit, OnDestroy {
  pageTitle = 'EQC Products';
  isProd = environment.production;
  IsLandingPage: boolean;
  subpages = [];
  Mode: string;
  UserGroup: string;
  PricingMode: string;
  AppMode: string;
  SwitchAutoManual: boolean;
  DisabledSwitchAppMode: boolean;

  constructor(
    public AuthorAPI: AuthService,
    public CustAPI: CustomerApiService,
    public commonApi: CommonApiService,
    public EQC_cfs: EqcCommonfunctionsService,
    public EQC_afs: EqcApifunctionService,
    public ref: ChangeDetectorRef
  ) {
    this.IsLandingPage = true;
    this.Mode = 'FXOSEN';
    this.UserGroup = 'Dealer';
    this.PricingMode = 'AUTO';
    this.SwitchAutoManual = false;
    this.DisabledSwitchAppMode = false;
  }

  ngOnDestroy(): void {
    this.subpages = [];
  }

  ngOnInit(): void {
    this.EQC_afs.SetLoggedInUser();
    // this.EQC_afs.AuthenticateUser().subscribe((Res) => {
    //   this.EQC_afs.SetToken(Res.token);
    //   // this.fnLoadValuesInSubPage();
    // });

    this.CustAPI.getPledgedAgainstData(
      'CSP_EQCProductsLevelAccessUserType'
    ).subscribe((res) => {
      if (res) {
        // this.fnLoadValuesInSubPage();
        const cards: any[] = res.Get_Configurable_Common_DataResult.map(
          (res) => {
            const obj: any = {};
            obj.name = res.DATA_VALUE;
            obj.order = res.Misc2.split(',')[0];
            obj.Product_Id = res.Misc2.split(',')[1];
            obj.Product_Code = res.DATA_VALUE;
            obj.Product_Name = res.DATA_VALUE;
            obj.displayYN = res.Misc1.split(',').includes(
              sessionStorage.getItem('UserType').toString().toUpperCase()
            );
            obj.activeYN = res.ActiveYN === '';
            return obj;
          }
        );
        this.subpages = cards.sortBy('order');
        console.log(this.subpages);
        this.ref.detectChanges();

        // res.Get_Configurable_Common_DataResult.forEach((element) => {
        //   if (element) {
        //     this.subpages.forEach((res) => {
        //       if (res.name === element.DATA_VALUE) {
        //         res.displayYN = [element.Misc1].includes(
        //           sessionStorage.getItem('UserType').toString().toUpperCase()
        //         );
        //       }
        //     });
        //   }
        // });
      }
    });
  }

  fnLoadValuesInSubPage() {
    this.subpages = [
      {
        name: 'ELN',
        Product_Id: '27',
        Product_Code: 'ELN',
        Product_Name: 'ELN',
        displayYN: false,
        activeYN: false,
      },
      {
        name: 'FCN',
        Product_Id: '28',
        Product_Code: 'FCN',
        Product_Name: 'FCN',
        displayYN: false,
        activeYN: false,
      },
      {
        name: 'DRA',
        Product_Id: '106',
        Product_Code: 'DRA',
        Product_Name: 'DRA',
        displayYN: false,
        activeYN: false,
      },
      {
        name: 'Accu',
        Product_Id: '',
        Product_Code: 'Accu',
        Product_Name: 'Accu',
        displayYN: false,
        activeYN: false,
      },
      {
        name: 'Decu',
        Product_Id: '29',
        Product_Code: 'Decu',
        Product_Name: 'Decu',
        displayYN: false,
        activeYN: false,
      },
      {
        name: 'Options',
        Product_Id: '23',
        Product_Code: 'Options',
        Product_Name: 'Options',
        displayYN: false,
        activeYN: false,
      },
      {
        name: 'BEN',
        Product_Id: '70',
        Product_Code: 'BEN',
        Product_Name: 'BEN',
        displayYN: false,
        activeYN: false,
      },
      {
        name: 'Phoenix',
        Product_Id: '51',
        Product_Code: 'Phoenix',
        Product_Name: 'Phoenix',
        displayYN: false,
        activeYN: false,
      },
    ];
  }

  fnchangeProduct(choice) {
    this.commonApi.HideSidebar(true);
    this.IsLandingPage = false;
    this.subpages.forEach((res) => {
      if (res) {
        if (res.name === choice) {
          res.activeYN = true;
        } else {
          res.activeYN = false;
        }
      }
    });
  }

  closeProduct() {
    this.commonApi.HideSidebar(false);
    this.IsLandingPage = true;
    this.ngOnInit();
  }

  fnSwitchAutoManualMode() {
    // this.SwitchAutoManual ?  this.SwitchAutoManual = false : this.SwitchAutoManual = true;
  }
}
