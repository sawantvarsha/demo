import { Component, OnInit, Input } from '@angular/core';
import { WorkflowApiService } from '../../../services/workflow-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { AuthService } from '../../../services/auth/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss']
})
export class GridViewComponent implements OnInit {

  @Input() scenarioDataValue = [];

  Year: any;
  Month: any;
  DateP: any;
  fromDate: any;
  toDate: any;
  username: any;
  userType: any;
  entityID: any;
  icon: any;
  Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  spData = [];
  width: any;
  height: any;
  gridColumn: any;
  postercolumn: any;
  alignment = [];
  chartColors = ['#dfc2e4', '#fbe19f', '#9ad3f0', '#bce4b1', '#ed7d31', '#a5a5a5', '#619010', '#388a90', '#6143b7', '#a3085f', '#85593d', '#878787', '#b19c0c'];
  lblError = '';
  options = {};
  columnOptions = {};
  graphdata = [];
  showTile = true;
  expand = false;
  showSettings = false;
  filterdata = [];
  TimePeriodFilter = [];
  imgUrl: string;

  isProd = environment.production;
  columns: string[];
  constructor(private api: WorkflowApiService, private cfs: CommonApiService, private auth: AuthService) { }

  ngOnInit(): void {
    this.username = 'superuser1' //sessionStorage.getItem('Username'); 
    this.entityID = '6'
    let d = new Date();
    this.Year = d.getFullYear();
    this.Month = this.Months[d.getMonth() + 1];
    this.DateP = d.getDate() + '-' + this.Month + '-' + this.Year;
    let ScenarioNo = this.scenarioDataValue['Linkname'] || this.scenarioDataValue['LinkName'];
    this.width = this.scenarioDataValue['PanelWidth'];
    this.height = this.scenarioDataValue['PanelHeight'];
    if (this.isProd) { this.imgUrl = 'assets/App_Resources/'; } else { this.imgUrl = '../../../../assets/App_Resources/'; }

    this.icon = this.imgUrl + "images/icons/" + this.scenarioDataValue['ControlType'] + ".png";
    this.fromDate = this.DateP;
    this.toDate = this.DateP;

    if (ScenarioNo.Trim === "Scenario 19" || ScenarioNo.Trim === "Scenario 20" || ScenarioNo.Trim === "Scenario 21") {
      this.Month = ""
    }
    console.log(this.Year, this.Month, this.DateP);
    console.log(this.scenarioDataValue);


    if (this.scenarioDataValue["TimePeriodFilter"]! == []) {
      this.TimePeriodFilter = [];
      this.TimePeriodFilter = this.scenarioDataValue["TimePeriodFilter"].split('|');
    }
    console.log(this.filterdata);

    this.api.CallStoreProcMaster(this.scenarioDataValue['LinkName'] || this.scenarioDataValue['LinkName'], this.scenarioDataValue['UserType'], this.auth.EntityID, '', this.scenarioDataValue['StoreProcName'], this.username, '', '', '', this.DateP, this.fromDate, this.toDate, this.Month, this.Year).subscribe(response => {
      if (response !== null) {
        // let that = this;
        // xml2js.parseString(res.CallStoreProcMasterResult,
        // eslint-disable-next-line

        //   function (err, result) {

        //     if(result.DocumentElement !== ''){

        //       that.spData = result.DocumentElement.DUMMY;
        //       console.log( that.spData);
        //     } else{
        //       that.spData = [];
        //     }
        //   });

        let data = response.res;
        if (JSON.parse(data).DocumentElement !== '') {
          this.columns = Object.keys(JSON.parse(data).DocumentElement.DUMMY[0]);
          console.log(this.columns);
          this.spData = JSON.parse(data).DocumentElement.DUMMY;
          console.log(this.spData[0][this.columns[0]][0]);
        } else {
          this.spData = [];
        }

        if (this.spData.length !== 0) {
          this.lblError = '';
          switch (this.scenarioDataValue['ControlType']) {
            case 'Grid':
              this.gridColumn = Object.keys(this.spData[0]).length;
              this.alignText()
              break;

            case 'Poster':
              this.postercolumn = this.spData.length / 2;
              // this.alignText()
              break;

            case 'Pie':
              let keys = Object.keys(this.spData[0]);
              console.log(keys);
              this.graphdata = [];
              this.spData.forEach(element => {
                this.graphdata.push([element[keys[0]][0], parseFloat(element[keys[1]])]);
              });
              this.options = {

                tooltip: {
                  trigger: 'both',
                },
                colors: this.chartColors,
                // changed
                width: this.width - 50,
                height: this.height - 100,
                is3D: true,
                // changed
                // tooltip: {
                //   isHtml: true
                // },
                legend: { textStyle: { color: 'white' } },
                backgroundColor: 'transparent',
                chartArea: { left: 10, top: 10, width: '100%', height: '100%', Margin: '0 auto' },
                pieSliceTextStyle: {
                  color: 'black',
                },
                // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
              };
              break;
            case 'Column':
              let keys1 = Object.keys(this.spData[0]);
              console.log(keys1);
              this.graphdata = [];
              this.spData.forEach(element => {
                this.graphdata.push([element[keys1[0]][0], parseFloat(element[keys1[1]])]);
              });
              this.columnOptions = {

                width: this.width - 100,
                height: this.height - 100,
                colors: this.chartColors,
                hAxis: {
                  textStyle: {
                    color: '#808080'
                  },
                },
                vAxis: {
                  textStyle: {
                    color: '#808080'
                  },
                },
                backgroundColor: { fill: 'transparent' },
                titleTextStyle: {
                  color: '#808080'
                },
                legend: { position: 'bottom' },

              };
              break;
            case 'Bar':
              let keys2 = Object.keys(this.spData[0]);
              console.log(keys2);
              this.graphdata = [];
              this.spData.forEach(element => {
                this.graphdata.push([element[keys2[0]][0], parseFloat(element[keys2[1]])]);
              });
              this.columnOptions = {

                width: this.width - 100,
                height: this.height - 100,
                colors: this.chartColors,
                hAxis: {
                  textStyle: {
                    color: '#808080'
                  },
                },
                vAxis: {
                  textStyle: {
                    color: '#808080'
                  },
                },
                backgroundColor: { fill: 'transparent' },
                titleTextStyle: {
                  color: '#808080'
                },
                legend: { position: 'bottom' },

              };
              break;

          }
        } else {
          this.lblError = 'No data available.'
        }





      }
    })
  }

  alignText() {
    let method = '';
    method = this.scenarioDataValue['MethodName'].toString(); //.reverse().join('')
    console.log(method);
    let array = [];
    array = method.split('|')[0].split('');
    this.alignment = [];
    array.forEach((element,i) => {
      switch (element) {
        case 'L':
          this.alignment.push('left');
          break;
        case 'R':

          this.alignment.push('right');
          break;
        case 'C':
          this.alignment.push('center');
          break;
        case 'A':
          this.spData.forEach(element => {
            element[this.columns[i]][0] = this.cfs.FormatNumberValue(element[this.columns[i]]) ;
          });
          this.alignment.push('right');
          break;
        case 'I':
          this.alignment.push('right');
          break;
        default:
          this.alignment.push('left');

      }
    });

    console.log(this.alignment);
  }

  setGrid() {
    return 'repeat(' + (this.gridColumn) + ' , 1fr)';
  }

  setGridPoster() {
    return 'repeat(' + (this.postercolumn) + ' , 1fr)';
  }

  expandDiv() {
    this.width = this.width * 2;
    this.height = this.height * 2;
    this.columnOptions = {

      width: this.width - 150,
      height: this.height - 100,
      colors: this.chartColors,
      hAxis: {
        textStyle: {
          color: '#808080'
        },
      },
      vAxis: {
        textStyle: {
          color: '#808080'
        },
      },
      backgroundColor: { fill: 'transparent' },
      titleTextStyle: {
        color: '#808080'
      },
      legend: { position: 'bottom' },

    };
    this.options = {

      tooltip: {
        trigger: 'both',
      },
      colors: this.chartColors,
      // changed
      width: this.width - 150,
      height: this.height - 100,
      is3D: true,
      // changed
      // tooltip: {
      //   isHtml: true
      // },
      legend: { textStyle: { color: 'white' } },
      backgroundColor: 'transparent',
      chartArea: { left: 25, top: 10, width: '100%', height: '100%', Margin: '10 auto' },
      pieSliceTextStyle: {
        color: 'black',
      },
      // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
    };
  }
  collapseDiv() {
    this.width = this.width / 2;
    this.height = this.height / 2;
    this.columnOptions = {

      width: this.width - 100,
      height: this.height - 100,
      colors: this.chartColors,
      hAxis: {
        textStyle: {
          color: '#808080'
        },
      },
      vAxis: {
        textStyle: {
          color: '#808080'
        },
      },
      backgroundColor: { fill: 'transparent' },
      titleTextStyle: {
        color: '#808080'
      },
      legend: { position: 'bottom' },

    };
    this.options = {

      tooltip: {
        trigger: 'both',
      },
      colors: this.chartColors,
      // changed
      width: this.width - 50,
      height: this.height - 100,
      is3D: true,
      // changed
      // tooltip: {
      //   isHtml: true
      // },
      legend: { textStyle: { color: 'white' } },
      backgroundColor: 'transparent',
      chartArea: { left: 25, top: 10, width: '100%', height: '100%', Margin: '10 auto' },
      pieSliceTextStyle: {
        color: 'black',
      },
      // colors: ['#d4ab8b', '#ccb6a6', '#c8936a', '#ba7845'],
    };
  }
  deleteTile() {
    //  this.cfs.removetile([this.scenarioDataValue['Linkname'] || this.scenarioDataValue['LinkName'], this.scenarioDataValue['SequenceNo'] ]);
  }


}
