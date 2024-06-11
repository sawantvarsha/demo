import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LCMApiService } from 'src/app/services/lcmapi.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-greeks',
  templateUrl: './greeks.component.html',
  styleUrls: ['./greeks.component.scss']
})
export class GreeksComponent implements OnInit {

  constructor( public location: Location,public lcmApi : LCMApiService, public authApi : AuthService) { }

  greekTable: any = [];
  Note_Master_Id : any ;
  UserId : any ;
  @Input() productDetails : any = [];
  greeksFlag: boolean;
  dataFlag = true;

  ngOnInit(): void {
  
    this.greekTable = [ 
      {
        model : "Flat Vol.",
        greekType : "Delta",
        ibmn : -0.2,
        aapl : -2.5
      },
      {
        model : "Flat Vol.",
        greekType : "Delta",
        ibmn : -0.2,
        aapl : -2.5
      },
    ]
    this.dataFlag = true;
    this.Note_Master_Id = this.productDetails.Note_Master_ID;

    this.lcmApi.CalculateMTMGreeks(this.Note_Master_Id,sessionStorage.getItem('Username')).subscribe((res)=>  {
      // console.log("CalculateMTMGreeks",res.CalculateMTMGreeksResult);
      let greeksRes = res.CalculateMTMGreeksResult;

      if(greeksRes != '') {
        this.dataFlag = false;
      }
       

      // console.log("-----------greeks",greeksRes)
      if(greeksRes == "false")
        this.greeksFlag = false;
      else 
        this.greeksFlag = true;
      // console.log("tflag = ",this.greeksFlag)
    })
  }

  back() {
    this.location.back();
  }

}
