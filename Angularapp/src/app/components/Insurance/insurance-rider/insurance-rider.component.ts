import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-insurance-rider',
  templateUrl: './insurance-rider.component.html',
  styleUrls: ['./insurance-rider.component.scss']
})
export class InsuranceRiderComponent implements OnInit {

  @Input() policyNo: any;
  @Input() benefitCode: any;
  @Input() riderData: any;
  riderDetailsArray: any;

  constructor() { }

  ngOnInit(): void {
    console.log("riderData",this.benefitCode);
    this.getRiderDescription();
  }

  getRiderDescription() {
    try {
      // this.riderData.forEach(element => {
      //   if(element.BenefitCode === this.benefitCode && element.PolicyNo === this.policyNo) {
      //     this.riderDetailsArray = element;
      //     console.log("this.riderDetailsArray", this.riderDetailsArray)
      //   }
      // });
    } catch (error) {
      
    }
  }
}
