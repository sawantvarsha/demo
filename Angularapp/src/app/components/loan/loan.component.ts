import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss']
})
export class LoanComponent implements OnInit {
  showLoanOrderEntry: boolean;
  showOverdraft: boolean;

  constructor(public cfs: CommonApiService, public route: ActivatedRoute) {
    this.showLoanOrderEntry = true;
    this.showOverdraft = false;
  }

  ngOnInit(): void {


    this.route.params.subscribe(params => {
      if (params.loanType) {
        this.showLoanOrderEntry = false;
        this.showOverdraft = false;

        switch (params.loanType.toUpperCase()) {
          case 'LOAN':
            this.showLoanOrderEntry = true;

            break;
          case 'OVERDRAFT':
            this.showOverdraft = true;
            break;

          default:
            this.showLoanOrderEntry = true;
            break;
        }

      }
    });

    this.cfs.getactivetabObserver.subscribe((res: any) => {
      if (res) {
  //console.log(res);
        this.changeProduct(res);
      }
    });
  }

  changeProduct(choice) {
    this.showLoanOrderEntry = false;
    this.showOverdraft = false;

    switch (choice) {
      case 'loan':
        this.showLoanOrderEntry = true;

        break;
      case 'overdraft':
        this.showOverdraft = true;
        break;;

      default:
        this.showLoanOrderEntry = true;
        break;
    }
  }
}
