import { Component, OnInit} from '@angular/core';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { CommonApiService } from 'src/app/services/common-api.service';


@Component({
  selector: 'app-proposal-generation-preview',
  templateUrl: './proposal-generation-preview.component.html',
  styleUrls: ['./proposal-generation-preview.component.scss']
})
export class ProposalGenerationPreviewComponent implements OnInit {
  PreviewDataResult: any;
  type = 'PieChart';
  chartData = [];
  ProposalId = this.afs.ProposalId;
  nameproposal = this.afs.nameproposal;
  AUM =  this.afs.AUM;
  baseCCY = this.afs.baseCCY;

  chartColors = [
    '#dfc2e4', '#fbe19f', '#9ad3f0', '#bce4b1', '#ed7d31', '#a5a5a5', '#619010', '#388a90', '#6143b7', '#a3085f', '#85593d', '#878787', '#b19c0c'
  ];
  
  options = {
    pieHole: 0.4,
    // pieSliceText: 'none',
    backgroundColor: {
      fill: 'transparent'
    },
    legend: {
      // position: 'bottom',
      textStyle: {
        color: 'white',
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'both',
    },
    colors: this.chartColors,
    // changed
    width: '600',
    height: '200',
    is3D: true,

   
    chartArea: { left: 80, top: 40, width: '80%', height: '80%', Margin: '0 auto' },
    pieSliceTextStyle: {
      color: 'black',
    },
   
    
    // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
  };
  
  constructor(private afs: CustomerApiService, public cfs: CommonApiService ) {
    
  }

  ngOnInit(): void {

    console.log(this.ProposalId);
    console.log(this.nameproposal);
    console.log(this.AUM);
    console.log(this.baseCCY);
    
    this.DB_Get_GridData();
    this.chartData = [
      // ["x" ,12],
      // ["y" ,15],
      // ["z" ,20],
    ];
  }

  DB_Get_GridData() {
    
    this.afs.DB_Get_GridData(this.afs.ProposalId)
    .subscribe((res) => {
      if (res) {

        console.log(res);   
        this.PreviewDataResult = res;
        this.chartData = [];
        this.PreviewDataResult.forEach(element => {
          this.chartData.push([element.code, parseFloat(element.Nominal)]);
        });
        console.log(this.chartData);
      }
    });
  }

}
