import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LCMApiService } from 'src/app/services/lcmapi.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
@Component({
  selector: 'app-stress-test',
  templateUrl: './stress-test.component.html',
  styleUrls: ['./stress-test.component.scss']
})
export class StressTestComponent implements OnInit {

  current_spot : any = '' ;
  current_vol : any = "" ;
  spotPercChange : number = 20;
  volPercChange : number = 20 ;
  model:any = "flat vol";
  stressTestResponse : any = [];
  Note_Master_Id : any ;
  UserId : any  = "SOLAR_S1"
  @Input() productDetails : any = [];
  dataFlag = false;


  constructor(public lcmApi : LCMApiService, public authApi : AuthService, public ngxXml2jsonService: NgxXml2jsonService) { }

  ngOnInit(): void {
    console.log("in stress test " , this.productDetails)
    this.stressTestResponse = [];
    this.current_spot = '' ;
    this.current_vol = ""; 
    this.UserId = this.authApi.UserName;

    if(this.productDetails){
      if(this.productDetails.Latest_Spot_Bid === "0" || this.productDetails.Latest_Spot_Bid === "")
      {
        if(![null, '', ' ', undefined].includes(this.productDetails.Previous_Spot_Bid)){
          this.current_spot = parseFloat(this.productDetails.Previous_Spot_Bid).toFixed(2);
        }
        if(![null, '', ' ', undefined].includes(this.productDetails.EANSIP2)){
          this.current_spot = this.current_spot + ' , ' + parseFloat(this.productDetails.EANSIP2).toFixed(2);
        }
        if(![null, '', ' ', undefined].includes(this.productDetails.EANSIP3)){
          this.current_spot = this.current_spot + ' , ' + parseFloat(this.productDetails.EANSIP3).toFixed(2);
        }
        
        // this.current_vol =  parseFloat(this.productDetails.STRIKE_VOLATILITY_PC).toFixed(2) + ' , ' + parseFloat(this.productDetails.EANSVol2).toFixed(2) + ' , ' + parseFloat(this.productDetails.EANSVol).toFixed(2);
      }
    

      else
      {

        if(![null, '', ' ', undefined].includes(this.productDetails.Latest_Spot_Bid)){
          this.current_spot = parseFloat(this.productDetails.Latest_Spot_Bid).toFixed(2);
        }
        if(![null, '', ' ', undefined].includes(this.productDetails.EANSFP2)){
          this.current_spot = this.current_spot + ' , ' + parseFloat(this.productDetails.EANSFP2).toFixed(2);
        }
        if(![null, '', ' ', undefined].includes(this.productDetails.EANSFP3)){
          this.current_spot = this.current_spot + ' , ' + parseFloat(this.productDetails.EANSFP3).toFixed(2);
        }

       

      }
      if(![null, '', ' ', undefined].includes(this.productDetails.STRIKE_VOLATILITY_PC)){
        this.current_vol =  parseFloat(this.productDetails.STRIKE_VOLATILITY_PC).toFixed(2);
      }
      if(![null, '', ' ', undefined].includes(this.productDetails.EANSVol2)){
        this.current_vol =  this.current_vol + ' , ' + parseFloat(this.productDetails.EANSVol2).toFixed(2);
      }
      if(![null, '', ' ', undefined].includes(this.productDetails.EANSVol)){
        this.current_vol =  this.current_vol + ' , ' + parseFloat(this.productDetails.EANSVol).toFixed(2);
      }
    }
  }

  async load(){
    this.dataFlag = true;
    // Added on 01 Aug 2022
    this.Note_Master_Id = this.productDetails.Note_Master_ID;
    // console.log("stress product details", this.productDetails);
    // this.stressTestResponse = await this.lcmApi.Calculate_StressMTM_Scenarios(this.Note_Master_Id, this.UserId);
    // if(this.stressTestResponse){
    //   // console.log("stress", this.stressTestResponse, this.Note_Master_Id);
    // }
    this.stressTestResponse = [];
       
    this.lcmApi.Calculate_StressMTM_Scenarios(this.Note_Master_Id, this.UserId).subscribe(
      (res) => {
        console.log(res);
    
      },
      (err) => {
        console.log(err);
      } 
    );

    // console.log("on load", this.current_spot, this.current_vol, this.spotPercChange, this.volPercChange);
    // this.stressTestResponse = [{
    //   "Assets" : "AAPL.OQ",
    //   "Strike" : "110.80",
    //   "SpotChange" : "-25",
    //   "VolChange" : "-10",
    //   "Spot" : "97.77",
    //   "Vol" : "0.39",
    //   "Price" : "91.07",
    // },
    // {
    //   "Assets" : "AAPL.OQ",
    //   "Strike" : "110.80",
    //   "SpotChange" : "-25",
    //   "VolChange" : "0",
    //   "Spot" : "97.77",
    //   "Vol" : "0.44",
    //   "Price" : "88.90",
    // }];
    this.Note_Master_Id = this.productDetails.Note_Master_ID;

    this.lcmApi.StressTest(this.Note_Master_Id,sessionStorage.getItem('Username'),this.authApi.EntityID , this.model,this.spotPercChange, this.volPercChange  )
    .subscribe((res)=>{
      // console.log("stress test = ",res);
            let stressRes = res.StressTestResult;
           
            // if(stressRes == '') 
            // {
            //   this.dataFlag = false;
            // }
            // else {
            //   this.dataFlag = true;
            // }
            var json = JSON.stringify(stressRes);
            var temp = JSON.parse(json);
         
            var parser = new DOMParser();
            var xml = parser.parseFromString(temp, "text/xml");
            var obj = this.ngxXml2jsonService.xmlToJson(xml);
            this.stressTestResponse = obj['NewDataSet'].dtStressTest;
            // console.log("stress -----------",this.stressTestResponse);
    })



  }

}
