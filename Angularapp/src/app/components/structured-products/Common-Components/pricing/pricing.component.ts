import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EqcApifunctionService } from '../../Services/eqc-apifunction.service';

@Component({
  selector: 'app-eqc-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class EQCPricingComponent implements OnInit, OnDestroy {

  @Input() ViewMode: string;
  @Input() ClassModel: any;
  @Input() startLoading: string;
  domainURL = environment.domainURL;


  constructor(public EQC_afs: EqcApifunctionService) { }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    // this.ClassModel.PPDetails = [];
  }

  ngOnInit(): void {
    this.ClassModel.PPDetailsStr = '';
    this.ClassModel.PPDetails = [];
    this.EQC_afs.fnGetLPList(this.ClassModel).subscribe(Res => {
      if (Res) {
        JSON.parse(Res.responseData).forEach(LPServiceRes => {
          if (LPServiceRes) {
            if (LPServiceRes.Link_Provider_Status === 'UP' && LPServiceRes.Link_Provider_Name !== 'HSBC') {
              if (this.ClassModel.PPDetailsStr === '') {
                this.ClassModel.PPDetailsStr = LPServiceRes.Link_Provider_Name;
              } else {
                this.ClassModel.PPDetailsStr = this.ClassModel.PPDetailsStr + ',' + LPServiceRes.Link_Provider_Name;
              }
              this.ClassModel.PPDetails.push({
                rfq: '',
                lp: LPServiceRes.Link_Provider_Name,
                price: '',
                ClientYield: '',
                MaxNotional: '',
                MinNotional: '',
                timer: '',
                PricerFlag: 'false'
              });
            }
          }
        });
      }
    });
  }


}
