import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { EqcApifunctionService } from '../../Services/eqc-apifunction.service';
// import { NgxXml2jsonService } from 'ngx-xml2json';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-share-details',
  templateUrl: './share-details.component.html',
  styleUrls: ['./share-details.component.scss'],
})
export class ShareDetailsComponent implements OnInit, OnChanges {
  @Input() ShareName: Subject<any>;
  @Input() SubjectSharesList: Subject<any>;
  @Input() RemoveShare: Subject<any>;

  SharesList = [];
  height: number = 140;
  width: number = 400;

  ShareDetails = [];
  chartColors = ['#f2a832'];
  historychart = {
    type: 'LineChart',
    title: 'Spot Rate',
    data: [],
    options: {
      chartArea: { left: '40', right: '20' },
      titleTextStyle: { color: '#808080' },
      backgroundColor: { fill: 'transparent' },
      colors: this.chartColors,
      hAxis: {
        title: 'Spot rate',
        textPosition: 'none',
        titleTextStyle: {
          color: '#808080',
        },
        gridlineColor: '#424242',
        gridlines: {
          color: '#424242',
          count: 4,
        },
        minorGridlines: {
          color: '#424242',
        },
      },
      vAxis: {
        title: '',
        textStyle: {
          color: '#808080',
        },
        gridlineColor: '#424242',
        gridlines: {
          color: '#424242',
          count: 3,
        },
        minorGridlines: {
          color: '#424242',
        },
      },
      legend: {
        position: 'none',
      },
    },
  };

  AsofDate: string = '';
  // private ngxXml2jsonService: NgxXml2jsonService
  constructor(public EQC_afs: EqcApifunctionService) {}

  ngOnChanges(): void {}

  ngOnInit(): void {
    try {
      this.ShareName.subscribe((v) => {
        if (v) {
          this.ShareDetails = [];
          // this.EQC_afs.GetShareHistoricalData(v).subscribe(
          //   (res: any) => {
          //     if (res) {
          //       try {
          //         const parser = new DOMParser();
          //         this.historychart.data = [];
          //         const xml = parser.parseFromString(res, 'text/xml');
          //         (this.ngxXml2jsonService.xmlToJson(xml)['GetPriceHistory_DataResponse']['GetPriceHistory_DataResult']['a:HistoryPrice']).forEach(ele => {
          //           this.historychart.data.push(['' + ele['a:TradeDate'], parseInt(ele['a:ClosePrice'])]);
          //           // ShareCode = ele['a:RIC'];
          //         });

          //         console.log(this.historychart.data);
          //       } catch (ex) {
          //         console.log('Error occured while getting historical rates: ', ex);
          //       }
          //     }
          //   }
          // );
          this.fnAddShare(v, false);
        }
      });
    } catch (EX) {}
    try {
      this.RemoveShare.subscribe((v) => {
        if (Number(v) >= 0) {
          this.fnRemoveShare(v);
        }
      });
    } catch (Ex) {}
    try {
      this.SubjectSharesList.subscribe((v) => {
        if (v) {
          console.log(v);
          let IsSharePresent: boolean = false;
          if (this.SharesList.length > 0) {
            this.SharesList.forEach((res) => {
              IsSharePresent = false;
              this.ShareDetails.forEach((element) => {
                if (v !== element.RICCode) {
                  IsSharePresent = true;
                }
              });
              if (!IsSharePresent) {
                // this.EQC_afs.GetShareHistoricalData(res).subscribe(
                //   (res: any) => {
                //     if (res) {
                //       try {
                //         const parser = new DOMParser();
                //         this.historychart.data = [];
                //         const xml = parser.parseFromString(res, 'text/xml');
                //         (this.ngxXml2jsonService.xmlToJson(xml)['GetPriceHistory_DataResponse']['GetPriceHistory_DataResult']['a:HistoryPrice']).forEach(ele => {
                //           this.historychart.data.push(['' + ele['a:TradeDate'], parseInt(ele['a:ClosePrice'])]);
                //           // ShareCode = ele['a:RIC'];
                //         });

                //       } catch (ex) {
                //         console.log('Error occured while getting historical rates: ', ex);
                //       }
                //     }
                //   }
                // );
                this.fnAddShare(res, true);
              }
            });
          } else {
            this.fnAddShare(v, true);
          }
        }
      });
    } catch (Ex) {}
  }

  fnAddShare(UnderlyingCode, ShowLastInsertedShare) {
    let IsSharePresent: boolean = false;
    if (this.SharesList.length > 0) {
      IsSharePresent = false;
      this.ShareDetails.forEach((element) => {
        if (UnderlyingCode !== element.RICCode) {
          IsSharePresent = true;
        }
      });
      if (!IsSharePresent) {
        this.EQC_afs.fnGetSpot(UnderlyingCode).subscribe((res) => {
          try {
            if (res) {
              if (res.responseData !== "[]") {
                this.ShareDetails.push(JSON.parse(res.responseData)[0]);
                console.log(this.ShareDetails);
                this.AsofDate = JSON.parse(res.responseData)[0]['AsOfDate'];
                this.ShareDetails[this.ShareDetails.length - 1]['activeYN'] =
                  true;
                if (ShowLastInsertedShare) {
                  // Multi Share
                  this.ShareDetails.forEach((v, index) => {
                    if (index === this.ShareDetails.length - 1) {
                      v['activeYN'] = true;
                    } else {
                      v['activeYN'] = false;
                    }
                  });
                  console.log(this.ShareDetails);
                }
              } else {
                // Single Share
              }
            }
          } catch (Ex) {}
        });
      }
    } else {
      this.EQC_afs.fnGetSpot(UnderlyingCode).subscribe((res) => {
        try {
          if (res) {
            if (res.responseData !== "[]") {
              this.ShareDetails.push(JSON.parse(res.responseData)[0]);
              console.log(this.ShareDetails);
              this.AsofDate = JSON.parse(res.responseData)[0]['AsOfDate'];
              this.ShareDetails[this.ShareDetails.length - 1]['activeYN'] =
                true;
              if (ShowLastInsertedShare) {
                // Multi Share
                this.ShareDetails.forEach((v, index) => {
                  if (index === this.ShareDetails.length - 1) {
                    v['activeYN'] = true;
                  } else {
                    v['activeYN'] = false;
                  }
                });
                console.log(this.ShareDetails);
              }
            } else {
              // Single Share
            }
          }
        } catch (Ex) {}
      });
    }
  }

  fnRemoveShare(index) {
    // this.ShareDetails.forEach((v, i) => {
    //   if (v === UnderlyingCode) {
    this.ShareDetails.splice(index, 1);
    if (this.ShareDetails.length > 0) {
      this.ShareDetails.forEach((res, i) => {
        if (i === this.ShareDetails.length - 1) {
          res.activeYN = true;
        } else {
          res.activeYN = false;
        }
      });
    }
    //   }
    // });
  }

  fnchangeProduct(ShareName) {
    this.ShareDetails.forEach((Res) => {
      if (Res.RICCode === ShareName) {
        Res.activeYN = true;
      } else {
        Res.activeYN = false;
      }
    });
  }
}
