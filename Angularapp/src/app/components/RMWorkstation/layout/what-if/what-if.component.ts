import { DatePipe } from '@angular/common';
import { identifierName, ThisReceiver } from '@angular/compiler';
import {
  Component,
  OnInit,
  Input,
  ViewChildren,
  ElementRef,
  QueryList,
  ViewChild,
} from '@angular/core';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { _MatSelectBase } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableService } from 'angular-google-charts/lib/services/data-table.service';
import { table } from 'console';
import { index, thresholdSturges, tickIncrement } from 'd3';
import e from 'express';
import { Table } from 'jspdf-autotable';
import { elementAt, share } from 'rxjs/operators';
import { CustomerApiService } from 'src/app/services/customer-api.service';

@Component({
  selector: 'app-what-if',
  templateUrl: './what-if.component.html',
  styleUrls: ['./what-if.component.scss'],
})
export class WhatIfComponent implements OnInit {
  @ViewChildren('listTrigger')
  private listTrigger: QueryList<ElementRef>;
  @ViewChild('searchInput')
  private searchInput: ElementRef;

  @Input() EquityAutocallableNote: any;

  autoSelected: boolean = false;
  setDropdown: any[] = [];
  scenariosObject: any;
  scenariosArray: any[] = [];
  setsArray: any[] = [];
  landingOptions: any[] = ['Shapes', 'GBM', 'Index'];
  StatisticDataType: any = 'PercentageOfSpot';
  searchBarString: any = '';
  displaySuggestions: boolean = false;
  showChartFlag: boolean = true;
  editFlag: boolean = false;
  selectedSet: number = 1;
  setCount: any;
  GBMFlag: boolean;
  volatility: any = 0;
  spotPerc: any = 0;
  scenarioIndex: any;
  securityIndex: any;
  GBMDataFlag: boolean[] = [false, false, false];
  NoteMasterID: any;
  shareNameList: any;
  shareNameListDisplay: any[] = [];
  TemplateId: any;
  AbsoluteSpot: boolean = false;
  templateCode: any;
  templateDataCSV: any;
  Tenor: any;
  graphdata: any = [];
  graphdata1: any = [];
  Record: any[] = [];
  showChart: any = false;
  finalGraphData: any[] = [];
  KIKO: any;
  statistics: any = 'Spot';
  arrVolList: any;
  showPlotArea: boolean = false;
  showShapesPanel: boolean = false;
  allInfoScenarios: any = [];
  PayoffArray: any = [];
  showPayoff: boolean = false;
  selectCount: any = [false, false, false, false];
  tempData: any[];
  delData: any = [];
  tableHeader: any = [''];
  showTableFlag: boolean = false;
  dtTableData: any[];
  TableData: any = [];
  ProductName: any;
  spot: number;
  PercentfinalGraphData: any = [];
  subsfinalgraphdata: any = [];
  arrKIKOValues: any;
  strScenarioString: string;
  shares: any;
  TargetValues: any;
  allScenarioSelected: boolean = true;
  configErroFlag: boolean = false;
  errorMsg: any;
  autoBtnDisabled: any = false;
  plotBtnDisabled: boolean = false;
  arrActualInitialSpot: any = [];
  temporaryData: any[];
  strike: any;
  KI: any;
  givenInfo: any[];
  givenInfoData: any[];
  tempScenario: any = []
  sharesOrder: any = []
  stretchBy: number = 1;
  // colors: any = ['#F44336', '#E91E63', '#7046E5', '#BE60ED', '#0E88FA', '#69D4CF', '#39D062', '#FFD438', '#FE9D2C', '#FD433F', '#F44336', '#E91E63', '#7046E5', '#BE60ED', '#0E88FA', '#69D4CF', '#39D062', '#FFD438', '#FE9D2C', '#FD433F']
  colors: any = ['#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#fffac8', '#aaffc3', '#808000', '#ffd8b1', '#a9a9a9']
  disableDelete: boolean = true;
  scenarioCurve: any;
  autoClicked: boolean = false;
  KO: any;
  tempFinalData: any[];
  fullyFinalData: any[];
  selectedRow: any;
  finalGraphData1: any[];
  finalGraphData2: any[];
  finalGraphData3: any[];
  finalGraphData4: any[];
  allColors: any = ['#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#fffac8', '#aaffc3','#808000', '#ffd8b1','#a9a9a9'];
  colorsRow1: any = ['#3cb44b', '#911eb4', '#fabed4', '#aaffc3'];
  colorsRow2: any = ['#ffe119', '#42d4f4', '#469990', '#808000'];
  colorsRow3: any = ['#4363d8', '#f032e6', '#dcbeff', '#ffd8b1'];
  colorsRow4: any = ['#f58231','#bfef45', '#fffac8','#a9a9a9'];
  constructor(
    public custApi: CustomerApiService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res) => {
      console.log(res);
      this.NoteMasterID = res.nmid;
      this.ProductName = res.prodname;
      console.log(this.NoteMasterID);
    });
    //this.GetRecords(this.NoteMasterID);
    this.GetShareNameList(this.NoteMasterID);
    this.getTemplateID(this.NoteMasterID);
    this.GetMaxScenarioNo(this.NoteMasterID);
    this.GetTenor(this.NoteMasterID);
    this.GetKIKOValues(this.NoteMasterID);
    // this.GetInitialSpots(this.NoteMasterID);

    this.EquityAutocallableNote = this.ProductName;
  }

  clickBack() {
    console.log('Bye.');
    this.router.navigate(['rmw']);
  }

  autoBtnClick() {
    this.autoClicked = true
    this.showPlotArea = true;
    this.autoBtnDisabled = true;
    this.scenariosArray = [];
    this.setsArray = [];
    var tempArray = [];
    console.log(this.autoSelected);
    this.strScenarioString = '';

    console.log(this.shareNameList);
    console.log(this.arrKIKOValues);

    this.GetInitialSpots(this.NoteMasterID);

    var xValue = [];
    var yValue = [];

    if (this.statistics === 'Actual') {
    } else {
      for (let i = 0; i < this.arrKIKOValues.length; i++) {
        xValue[i] = this.arrKIKOValues[i].split(':')[0].trim();
        yValue[i] = this.arrKIKOValues[i].split(':')[1].trim();
      }
      this.spot = yValue[0];
      // console.log(xValue, yValue);
    }
    console.log(yValue);
    console.log(this.strike, this.KO, this.KI)
    this.TargetValues = []
    if (this.KO && this.KI) {
      let KIStrikeDiff = (parseFloat(this.KI) + parseFloat(this.strike)) / 2
      let KOStrikeDiff = (parseFloat(this.KO) + parseFloat(this.strike)) / 2
      const KIDiff = (parseFloat(this.strike) - KIStrikeDiff)
      const KODiff = (parseFloat(this.KO) - KOStrikeDiff)
      this.TargetValues[0] = parseFloat(this.KI) - KIDiff
      this.TargetValues[1] = KIStrikeDiff
      this.TargetValues[2] = KOStrikeDiff
      this.TargetValues[3] = parseFloat(this.KO) + KODiff
    }
    //Start | ChitraM | 24-Mar-23 | Case to handle NO KI
    else if(this.KO && !this.KI){
      // let KIStrikeDiff = (parseFloat(this.KI) + parseFloat(this.strike)) / 2
      let KOStrikeDiff = (parseFloat(this.KO) + parseFloat(this.strike)) / 2;
      // const KIDiff = (parseFloat(this.strike) - KIStrikeDiff)
      const KODiff = (parseFloat(this.KO) - KOStrikeDiff);
      // this.TargetValues[0] = parseFloat(this.KI) - KIDiff
      // this.TargetValues[1] = KIStrikeDiff
      this.TargetValues[0] = KOStrikeDiff; //midpoint
      this.TargetValues[1] = parseFloat(this.strike) - KODiff; //ChitraM | 10-Apr-23 | As asked by KundanA
       this.TargetValues[2] = parseFloat(this.KO) + KODiff; 
    
    }
    //End | ChitraM | 24-Mar-23 | Case to handle NO KI
    // if (yValue.length > 1) {
    //   this.TargetValues = [];
    //   for (let i = 0; i < yValue.length + 1; i++) {
    //     if (i === 0) {
    //       this.TargetValues[i] =
    //         (parseFloat(yValue[i]) + parseFloat(yValue[i + 1])) / 2 -
    //         Math.abs(parseFloat(yValue[i]) - parseFloat(yValue[i + 1]));
    //       if (this.TargetValues[i] < 0) {
    //         this.TargetValues[i] = yValue[i] / 2;
    //       }
    //     } else if (i === yValue.length) {
    //       this.TargetValues[i] =
    //         (parseFloat(yValue[i - 1]) + parseFloat(yValue[i - 2])) / 2 +
    //         Math.abs(parseFloat(yValue[i - 1]) - parseFloat(yValue[i - 2]));
    //     } else {
    //       this.TargetValues[i] =
    //         (parseFloat(yValue[i]) + parseFloat(yValue[i - 1])) / 2;
    //     }
    //   }
    //   console.log(this.TargetValues);
    // } else {
    //   this.TargetValues[0] = yValue[0] / 2;
    //   this.TargetValues[1] = (3 * yValue[0]) / 2;
    // }
    let scenarios = [];
    console.log(this.TargetValues)
    if (this.arrVolList.length > 0) {
      for (let ishares = 0; ishares < this.shares.length; ishares++) {
        //For creating scenarioDetails string.
        const scenario: any = {};
        for (
          let iScenarios = 0;
          iScenarios < this.TargetValues.length;
          iScenarios++
        ) {
          this.strScenarioString =
            this.strScenarioString +
            'GBM(1)(' +
            this.arrVolList[ishares] * 100 +
            ')(' +
            this.TargetValues[iScenarios] +
            ')';
          if (iScenarios !== this.TargetValues.length - 1) {
            this.strScenarioString = this.strScenarioString + '#';
          }
        }
        if (ishares !== this.shares.length - 1) {
          this.strScenarioString = this.strScenarioString + '$';
        }
      }

      this.GetWhatIfAnalysis();
      console.log(this.strScenarioString);

      for (let k = 0; k < this.TargetValues.length; k++) {
        //For displaying the scanrio details on the screen.
        const scenario: any = {};
        var gbm = [];
        for (let j = 0; j < this.shares.length; j++) {
          gbm.push(
            'GBM(1)(' +
            (this.arrVolList[j] * 100).toFixed(2) +
            ')(' +
            this.TargetValues[k] +
            ')'
          );
          console.log(
            j,
            k,
            'GBM(1)(' +
            (this.arrVolList[j] * 100).toFixed(2) +
            ')(' +
            this.TargetValues[k] +
            ')'
          );

          this.allInfoScenarios.push(
            'GBM(1)(' +
            (this.arrVolList[j] * 100).toFixed(2) +
            ')(' +
            this.TargetValues[k] +
            ')'
          );

          if (k !== this.TargetValues.length) {
            scenario.scenario = gbm;
          }
        }
        if (k !== this.TargetValues.length) {
          scenarios.push(scenario);
          this.setScenario(scenarios);
        }
      }
    }

    console.log(this.scenariosArray);

    this.configureTableHeader();
    // for(let i = 0; i < this.scenariosArray.length; i++) {
    //   this.shares.forEach(ele => {
    //     this.tableHeader.push(ele);
    //   })
    // }
    console.log(this.shareNameListDisplay);

    this.shareNameListDisplay.forEach((element: any) => {
      var shareInfoObj = {
        name: element,
        isGBM: true,
        isIndex: false,
        isShape: false,
      };
      tempArray.push(shareInfoObj);
    });
    this.scenariosArray.forEach((it) => {
      it.shares = tempArray;
    });

    console.log(this.scenariosArray);
    console.log(this.allInfoScenarios);
    console.log(this.strScenarioString, scenarios, this.scenariosArray);
    this.autoBtnDisabled = false;
  }

  setScenario(scenarios) {
    console.log(scenarios);
    var sceneNO = this.scenariosArray.length;
    this.scenariosObject = {
      set: +this.selectedSet,
      scenarioNo:
        this.scenariosArray.length === 0
          ? 1
          : this.scenariosArray[this.scenariosArray.length - 1].scenarioNo + 1,
      scenarioName:
        this.scenariosArray.length === 0
          ? 1
          : this.scenariosArray[this.scenariosArray.length - 1].scenarioNo + 1,
      shares: [
        // { name: 'Apple', isGBM: true, isIndex: false, isShape: false },
        // { name: 'Microsoft', isGBM: true, isIndex: false, isShape: false },
        // { name: 'IBM', isGBM: true, isIndex: false, isShape: false },
      ],
      info: [
        scenarios[sceneNO].scenario[0],
        scenarios[sceneNO].scenario[1],
        scenarios[sceneNO].scenario[2],
        scenarios[sceneNO].scenario[3],
      ],
      landingoptions: ['Shapes', 'GBM', 'Index'],
      GBM: [[], [], []],
    };
    // this.scenariosArray.push(this.scenariosObject);
    // this.setsArray.push(this.scenariosArray);

    this.scenariosArray.push(this.scenariosObject);

    // this.shareNameListDisplay.forEach(it => {
    //   var obj = {
    //     name: it,
    //     isGBM: true,
    //     isIndex: false,
    //     isShape: false
    //   }

    // })

    console.log("SCENARIO ARRAY", this.scenariosArray);
    this.setsArray.push(this.scenariosObject);
  }

  selectLandingOption(SceneIndex, secIndex, landingIndex) {
    console.log(SceneIndex, secIndex, landingIndex);
    if (landingIndex === 0) {
      this.selectShapes(SceneIndex, secIndex, landingIndex);
    } else if (landingIndex === 1) {
      this.selectGBM(SceneIndex, secIndex, landingIndex);
    } else if (landingIndex === 2) {
      this.selectIndex(SceneIndex, secIndex, landingIndex);
    }
  }

  selectShapes(_SceneIndex, _secIndex, _landingIndex) {
    console.log('Shapes', _SceneIndex);
    this.scenarioIndex = _SceneIndex;
    this.securityIndex = _secIndex;
    this.showShapesPanel = true;
  }

  selectGBM(_SceneIndex, _secIndex, _landingIndex) {
    this.scenarioIndex = _SceneIndex;
    this.securityIndex = _secIndex;
    // console.log("GBM", index, secIndex);
    this.GBMFlag = true;

    //this.scenariosArray[SceneIndex].shares[secIndex].isGBM = true;
  }

  selectIndex(_SceneIndex, _secIndex, _landingIndex) {
    // console.log('Index', index);
  }

  changeView() {
    console.log('View');
  }

  addSet() {
    var tempArray = [];
    console.log(this.setsArray);
    this.scenariosArray = [];
    this.selectedSet = this.setCount + 1;

    this.scenariosObject = {
      set: (this.setCount = this.setCount + 1),
      scenarioNo: 1,
      scenarioName: 1,
      shares: [
        //   { name: 'Apple', isGBM: false, isIndex: false, isShape: false },
        //   { name: 'Microsoft', isGBM: false, isIndex: false, isShape: false },
        //   { name: 'IBM', isGBM: false, isIndex: false, isShape: false },
      ],
      info: [],
      landingoptions: ['Shapes', 'GBM', 'Index'],
      GBM: [
        ['0', '0'],
        ['0', '0'],
        ['0', '0'],
      ],
    };
    this.setsArray.push(this.scenariosObject);
    this.setsArray.forEach((it) => {
      if (it.set === this.selectedSet) {
        this.scenariosArray.push(it);
      }
    });
    this.shareNameListDisplay.forEach((element: any) => {
      var shareInfoObj = {
        name: element,
        isGBM: false,
        isIndex: false,
        isShape: false,
      };
      tempArray.push(shareInfoObj);
    });
    this.scenariosArray.forEach((it) => {
      it.shares = tempArray;
    });
    this.setDropdown.push(this.scenariosObject.set);
    if (this.setsArray.length === 1) {
      this.disableDelete = true
    } else {
      this.disableDelete = false
    }
    this.resetGraph()
  }

  addScenario() {
    this.finalGraphData = [];
    var sceneNO;
    var tempArray = [];
    console.log(this.scenariosArray.length);
    sceneNO =
      this.scenariosArray.length === 0
        ? 1
        : this.scenariosArray[this.scenariosArray.length - 1].scenarioNo + 1;
    console.log(sceneNO);
    this.scenariosObject = {
      set: +this.selectedSet,
      scenarioNo:
        this.scenariosArray.length === 0
          ? 1
          : this.scenariosArray[this.scenariosArray.length - 1].scenarioNo + 1,
      scenarioName:
        this.scenariosArray.length === 0
          ? 1
          : this.scenariosArray[this.scenariosArray.length - 1].scenarioNo + 1,
      shares: [
        // { name: 'Apple', isGBM: false, isIndex: false, isShape: false },
        // { name: 'Microsoft', isGBM: false, isIndex: false, isShape: false },
        // { name: 'IBM', isGBM: false, isIndex: false, isShape: false },
      ],
      info: [],
      landingoptions: ['Shapes', 'GBM', 'Index'],
      GBM: [
        ['0', '0'],
        ['0', '0'],
        ['0', '0'],
      ],
    };
    // this.scenariosArray.push(this.scenariosObject);
    // this.setsArray.push(this.scenariosArray);

    this.setsArray.push(this.scenariosObject);

    this.scenariosArray = [];
    console.log(this.setsArray, this.selectedSet);
    this.setsArray.forEach((it) => {
      if (it.set === +this.selectedSet) {
        this.scenariosArray.push(it);
        //console.log('Pushing...');
      }
    });

    this.shareNameListDisplay.forEach((element: any) => {
      var shareInfoObj = {
        name: element,
        isGBM: false,
        isIndex: false,
        isShape: false,
      };
      tempArray.push(shareInfoObj);
    });
    // this.scenariosArray.forEach(it => {
    //   it.shares = tempArray;
    // })
    this.scenariosArray[sceneNO - 1].shares = tempArray;

    console.log(this.scenariosArray);
  }

  cancelScenario(i: any) {
    console.log(i);
    this.setsArray.forEach((it, index) => {
      if (it.scenarioNo === this.scenariosArray[i].scenarioNo) {
        //console.log(index);
        this.setsArray.splice(index, 1);
      }
    });
    this.scenariosArray.splice(i, 1);
  }

  textChangeSearch(event) {
    this.searchBarString = event.target.value;
    console.log(this.searchBarString);

    if (this.searchBarString.length > 0) {
      this.displaySuggestions = true;
    } else {
      this.displaySuggestions = false;
    }
    // this.scenariosArray.forEach((it) => {
    //   if(it.scenarioName.includes())
    // })
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    console.log(this.listTrigger, index, event);
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        (index === 0
          ? this.listTrigger.last
          : this.listTrigger.get(index - 1)
        ).nativeElement.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        (index === this.listTrigger.length - 1
          ? this.listTrigger.first
          : this.listTrigger.get(index + 1)
        ).nativeElement.focus();
        break;
      case 'Escape':
        event.stopPropagation();
        (index === this.listTrigger.length - 1
          ? this.listTrigger.first
          : this.listTrigger.get(index + 1)
        ).nativeElement.blur();
        this.searchInput.nativeElement.focus();
        break;
    }
  }

  selectedSecurityfromSearch(item) {
    console.log(item);
    var Rowcopy = item;
    this.displaySuggestions = false;

    this.scenariosObject = {
      set: +this.selectedSet,
      scenarioNo:
        this.scenariosArray[this.scenariosArray.length - 1].scenarioNo + 1,
      scenarioName: Rowcopy.scenarioName,
      name: ['Apple', 'Microsoft', 'IBM'],
      info: ['GBM(1)(85)(99.8)', 'GBM(1)(85)(99.8)', 'GBM(1)(85)(99.8)'],
      landingoptions: ['Shapes', 'GBM', 'Index'],
      GBM: [
        ['0', '0'],
        ['0', '0'],
        ['0', '0'],
      ],
    };

    this.setsArray.push(this.scenariosObject);
    this.scenariosArray = [];
    console.log(this.setsArray, this.selectedSet);
    this.setsArray.forEach((it) => {
      if (it.set === +this.selectedSet) {
        this.scenariosArray.push(it);
      }
    });

    console.log(this.scenariosArray);
  }

  editScenarioName() { }

  TogglePlotType() {
    if (this.showChartFlag) {
      this.showChartFlag = false;
      this.showTableFlag = true;

      console.log(this.tableHeader);
    } else {
      this.showChartFlag = true;
      this.showTableFlag = false;
    }
  }

  fnActualOrSpot(stat) {
    //this.GetInitialSpots(this.NoteMasterID);
    this.statistics = stat;
    console.log(this.statistics);

    if (this.Record) {
      this.finalGraphData = [];
      this.PercentfinalGraphData = [];
      console.log('REcords', this.Record);
      const sharesInScenario = [...new Set(this.Record.map((e) => e.Asset))];
      const scenariosArr = this.Record.reduce((group, product) => {
        const { Asset } = product;
        group[Asset] = group[Asset] ?? [];
        group[Asset].push(product);
        return group;
      }, {});
      console.log(sharesInScenario, scenariosArr);
      console.log(this.spot);


      sharesInScenario.forEach((s, _ind) => {
        const scenario1 = scenariosArr[s].map((e, index) => {
          const scenario: any = {};
          scenario.x = index;
          if (stat === 'Actual') {
            console.log("Actual Values.");
            scenario.y = e.Scenario1 * parseFloat(this.arrActualInitialSpot[_ind]) / 100;
          } else {
            console.log("Spot  Values.");
            scenario.y = (e.Scenario1 / this.spot) * 100;
          }

          return scenario;
        });
        var scenarioObj = {
          name: s,
          data: scenario1,
          scenario: 1,
        };
        this.PercentfinalGraphData.push(scenarioObj);

        const scenario2 = scenariosArr[s].map((e, index) => {
          const scenario: any = {};
          scenario.x = index;
          if (stat === 'Actual') {
            scenario.y = e.Scenario2 * parseFloat(this.arrActualInitialSpot[_ind]) / 100;
          } else {
            scenario.y = (e.Scenario2 / this.spot) * 100;
          }
          return scenario;
        });
        var scenarioObj = {
          name: s,
          data: scenario2,
          scenario: 2,
        };
        this.PercentfinalGraphData.push(scenarioObj);

        const scenario3 = scenariosArr[s].map((e, index) => {
          const scenario: any = {};
          scenario.x = index;
          if (stat === 'Actual') {
            scenario.y = e.Scenario3 * parseFloat(this.arrActualInitialSpot[_ind]) / 100;
          } else {
            scenario.y = (e.Scenario3 / this.spot) * 100;
          }
          return scenario;
        });
        var scenarioObj = {
          name: s,
          data: scenario3,
          scenario: 3,
        };
        this.PercentfinalGraphData.push(scenarioObj);

        const scenario4 = scenariosArr[s].map((e, index) => {
          const scenario: any = {};
          scenario.x = index;
          if (stat === 'Actual') {
            scenario.y = e.Scenario4 * parseFloat(this.arrActualInitialSpot[_ind]) / 100;
          } else {
            scenario.y = (e.Scenario4 / this.spot) * 100;
          }
          return scenario;
        });
        var scenarioObj = {
          name: s,
          data: scenario4,
          scenario: 4,
        };
        this.PercentfinalGraphData.push(scenarioObj);

        this.subsfinalgraphdata = [];
        this.subsfinalgraphdata = this.finalGraphData;
        this.finalGraphData = this.PercentfinalGraphData;

        // console.log(s, scenario1, scenario2, scenario3, scenario4);
        console.log("FINAL", this.finalGraphData);
      });
      this.addStrikeAndKI();
    }
    // }
  }

  setChanged() {
    this.scenariosArray = [];
    console.log(this.setsArray);
    this.setsArray.forEach((it) => {
      if (it.set === +this.selectedSet) {
        this.scenariosArray.push(it);
      }
    });
    console.log(this.scenariosArray);
  }

  genGBM() {
    var strGBM = 'GBM(1)(' + this.volatility + ')(' + this.spotPerc + ')';

    this.scenariosArray[this.scenarioIndex].info[this.securityIndex] = strGBM;
    this.scenariosArray[this.scenarioIndex].shares[this.securityIndex].isGBM =
      true;

    // this.scenariosArray[this.scenarioIndex].GBM[this.securityIndex][0] = this.volatility;
    // this.scenariosArray[this.scenarioIndex].GBM[this.securityIndex][1] = this.spotPerc;
    // console.log(this.scenariosArray[this.scenarioIndex].GBM[this.securityIndex]);
    console.log(this.scenariosArray, this.volatility);

    this.GBMDataFlag[this.securityIndex] = true;
  }

  plotBtn() {
    var autoBtn = document.getElementById('autoBtn');
    this.plotBtnDisabled = true;
    // autoBtn.disabled = true;
    this.showPlotArea = true;
    this.showPayoff = true;
    this.PayoffArray = [];
    this.strScenarioString = '';
    for (let ishares = 0; ishares < this.shares.length; ishares++) {
      //For creating scenarioDetails string.
      this.scenariosArray.forEach((_ele, _index) => {
        this.strScenarioString = this.strScenarioString + _ele.info[ishares];
        if (_index !== this.scenariosArray.length - 1) {
          this.strScenarioString = this.strScenarioString + '#';
        }
      });
      if (ishares !== this.shares.length - 1) {
        this.strScenarioString = this.strScenarioString + '$';
      }
    }
    console.log(this.strScenarioString);
    this.GetWhatIfAnalysis();
    if (this.PayoffArray.length) {
      console.log(this.finalGraphData);
      this.showChart = true;
      this.showPlotArea = true;
      this.showPayoff = true;
    }
    this.plotBtnDisabled = false;
  }

  getTemplateID(NoteMasterID) {
    this.custApi.GetTemplateIDFromNMID(NoteMasterID).subscribe(async (res) => {
      if (res) {
        console.log(res);
        this.TemplateId = res.GetTemplateIDFromNMIDResult;
        await this.GetTemplateCode(this.TemplateId);
        this.GetScheduleCSV(NoteMasterID, this.TemplateId);
        this.GetWhatIfCSV(this.TemplateId);
      } else {
        console.log('TemplateId not found.');
      }
    });
  }

  async GetTemplateCode(templateid) {
    const res: any = await this.custApi.GetTemplateCode(templateid);
    this.templateCode = res.GetTemplateCodeResult;
    //.subscribe((res) => {
    //   if (res) {
    //     console.log(res);
    //     this.templateCode = res.GetTemplateCodeResult;
    //   }
    // })
  }

  GetScheduleCSV(NoteMasterID, TemplateID) {
    this.custApi.GetScheduleCSV(NoteMasterID, TemplateID).subscribe((res) => {
      if (res) {
        console.log(res);
      }
    });
  }

  GetMaxScenarioNo(NotemasterID) {
    this.custApi.GetMaxScenarioNo(NotemasterID).subscribe((res) => {
      if (res) {
        console.log(res);
        var maxscenenario = res.GetMaxScenarioNoResult;
      }
    });
  }

  async GetRecords(NotemasterID, selectedRow) {
    this.showChart = false;
    this.showPlotArea = true;
    this.showPayoff = true;

    var sScenarioNo = 1;
    var UserID = sessionStorage.getItem('FinIQUserID'); //'SOLAR_S1';
    var strikeData = [];
    var KIData = [];

    const recordsREs: any = await this.custApi.GetRecords(
      NotemasterID,
      sScenarioNo,
      UserID
    );
    if (recordsREs) {
      console.log(recordsREs);
      this.Record = recordsREs.GetRecordsResult;
      // this.scenarioCurve = recordsREs.GetRecordsResult[0].Scenario_CurveName
      // this.scenarioCurve = recordsREs.GetRecordsResult[0].Scenario_CurveName.split(/[#,$]/, this.scenariosArray.length)
      // this.scenariosArray.forEach((it, index) => {
      //   it.scenarioCurve = this.scenarioCurve[index];
      // });
      console.log(this.scenarioCurve)
      if (this.Record) {
        console.log(this.scenariosArray.length);
        console.log('REcords', this.Record);
        this.tempFinalData = []
        // this.finalGraphData = [];
        this.TableData = [];

        const sharesInScenario = [...new Set(this.Record.map((e) => e.Asset))];
        const scenariosArr = this.Record.reduce((group, product) => {
          const { Asset } = product;
          group[Asset] = group[Asset] ?? [];
          group[Asset].push(product);
          return group;
        }, {});
        this.sharesOrder = []
        console.log(sharesInScenario, scenariosArr);
        sharesInScenario.forEach((share) => {
          this.sharesOrder.push(share.substring(share.indexOf('-') + 1).trim())
        })
        console.log(this.sharesOrder)

        console.log(this.scenariosArray.length);
        sharesInScenario.forEach((s) => {
          this.tempScenario = []
          // let scenario1 = scenariosArr[s].map((e, index) => {
          //   const scene: any = {};
          //   scene.x = index;
          //   scene.y = e.Scenario1;
          //   console.log(scene);
          //   return scene;
          // });
          scenariosArr[s].forEach((e, index) => {
            const scene: any = {};
            scene.x = index;
            scene.y = e.Scenario1;
            // console.log(scene);
            this.tempScenario.push(scene)
          })

          // console.log(this.tempScenario.length)
          // console.log(this.tempScenario[8])
          // console.log(this.tempScenario[this.tempScenario.length-1])
          console.log(this.tempScenario)
          const scenarioObj1 = {
            name: s,
            data: this.tempScenario,
            scenario: 1,
          };
          console.log(scenarioObj1);
          this.tempFinalData.push(scenarioObj1);
          console.log("FINAL 1", scenarioObj1);

          if (this.scenariosArray.length > 1) {
            console.log('Scenario 2 pushed');
            const scenario2 = scenariosArr[s].map((e, index) => {
              const scenario: any = {};
              scenario.x = index;
              scenario.y = e.Scenario2;
              return scenario;
            });

            const scenarioObj2 = {
              name: s,
              data: scenario2,
              scenario: 2,
            };
            console.log("FINAL 2", scenarioObj2);
            // this.finalGraphData[1] = scenarioObj2;
            this.tempFinalData.push(scenarioObj2);
          }

          if (this.scenariosArray.length > 2) {
            console.log('Scenario 3 pushed');
            const scenario3 = scenariosArr[s].map((e, index) => {
              const scenario: any = {};
              scenario.x = index;
              scenario.y = e.Scenario3;
              return scenario;
            });

            const scenarioObj3 = {
              name: s,
              data: scenario3,
              scenario: 3,
            };
            console.log("FINAL 3", scenarioObj3);
            // this.finalGraphData[2] = scenarioObj3;
            this.tempFinalData.push(scenarioObj3);
          }
          //console.log(s, scenario1, scenario2, scenario3);

          if (this.scenariosArray.length > 3) {
            console.log("Scenario 4 pushed");
            const scenario4 = scenariosArr[s].map((e, index) => {
              const scenario: any = {};
              scenario.x = index;
              scenario.y = e.Scenario4;
              return scenario;
            });
            const scenarioObj4 = {
              name: s,
              data: scenario4,
              scenario: 4,
            }
            console.log("FINAL 4", scenarioObj4);
            // this.finalGraphData[3] = scenarioObj4;
            this.tempFinalData.push(scenarioObj4);
          }

          if (this.scenariosArray.length > 4) {
            console.log("Scenario 5 pushed");
            const scenario5 = scenariosArr[s].map((e, index) => {
              const scenario: any = {};
              scenario.x = index;
              scenario.y = e.Scenario5;
              return scenario;
            });
            var scenarioObj5 = {
              name: s,
              data: scenario5,
              scenario: 5,
            }
            console.log("FINAL 5", scenarioObj5);
            // this.finalGraphData[4] = scenarioObj5;
            this.tempFinalData.push(scenarioObj5);
          }
        });
        console.log("Fully FINAL", this.tempFinalData);
        let tempFinalDataRecord = this.tempFinalData
        if (this.selectedRow) {
          this.tempData = [];
          this.tempFinalData.forEach((ele, index) => {
            if (ele.scenario) {
              if (ele.scenario !== selectedRow) {
                tempFinalDataRecord[index].data = [];
              }
            }
          });
        }
        console.log(tempFinalDataRecord)
        // this.finalGraphData = []
        this.tempFinalData = tempFinalDataRecord
        // this.finalGraphData = tempFinalDataRecord


        for (let i = 0; i <= this.Tenor; i++) {
          var objArr = []
          this.tempFinalData.forEach(ele => {
            objArr.push(ele.data[i].y);
          })
          this.TableData.push(objArr);
        }
        //console.log(s, scenario1, scenario2, scenario3, scenario4);
      };
      console.log(this.tempFinalData);
      this.tempFinalData.forEach((it) => {
        it.name = 'Scenario:' + it.scenario + it.name;
      });

      for (let i = 0; i <= this.Tenor; i++) {
        var objArr = [];
        this.tempFinalData.forEach((ele) => {
          objArr.push(ele.data[i].y);
        });
        this.TableData.push(objArr);
      }
      this.finalGraphData = this.tempFinalData
      this.addStrikeAndKI();


      console.log(this.TableData);
      this.configureTableHeader();
    } else {
      console.log('No Records Found');
    }

    this.showChart = true;
  }

  GetRecords_Low(NotemasterID) {
    var scenarioNo = 1;
    this.custApi.GetRecords_Low(NotemasterID, scenarioNo).subscribe((res) => {
      if (res) {
        console.log(res);
        var low = res.GetRecords_LowResult;
      }
    });
  }

  GetRecords_High(NotemasterID) {
    var scenarioNo = 1;
    this.custApi.GetRecords_High(NotemasterID, scenarioNo).subscribe((res) => {
      if (res) {
        console.log(res);
        var high = res.GetRecords_HighResult;
      }
    });
  }

  GetKIKOValues(NotemasterID) {
    this.custApi
      .GetKIKOValues(NotemasterID, this.AbsoluteSpot)
      .subscribe((res) => {
        if (res) {
          console.log(res);
          let KIKITemp = res.GetKIKOValuesResult;
          this.KIKO = KIKITemp.replaceAll("Barrier", "KO")
          // this.KIKO.replace("Barrier", "KO")
          var yValue = [];
          var xValue = [];
          this.arrKIKOValues = this.KIKO.split(';').map((element) =>
            element.trim()
          );
          console.log(this.arrKIKOValues);
          this.givenInfo = []; //ChitraM | 6-Jan-23 | added Product Details info
          this.givenInfoData = []; //ChitraM | 14-Mar-23 | added Product Details info
          for (let i = 0; i < this.arrKIKOValues.length; i++) {
            xValue[i] = this.arrKIKOValues[i].split(':')[0].trim();
            yValue[i] = this.arrKIKOValues[i].split(':')[1].trim();

            if (xValue[i].includes('Strike')) {
              this.strike = yValue[i];
            } else if (xValue[i].includes('KI')) {
              this.KI = yValue[i];
            } else if (xValue[i].includes('KO')) {
              // xValue[i].replace('Barrier', 'KO')
              this.KO = yValue[i];
            }
          //  this.givenInfo[i] = xValue[i] + " : " + yValue[i]; //ChitraM | 6-Jan-23 | added Product Details info
          this.givenInfo[i] = xValue[i];  //ChitraM | 14-Mar-23 | added Product Details info
          this.givenInfoData[i] = yValue[i];  //ChitraM | 14-Mar-23 | added Product Details info

          console.log("givenInfoData", this.givenInfoData);
          console.log("givenInfo", this.givenInfo);
          }
          //this.givenInfo = xValue;
          // console.log(xValue, yValue);
          // console.log(this.strike, this.KI);
          this.spot = yValue[0];
          console.log(this.spot);
        }
      });
  }

  GetWhatIfCSV(templateid) {
    this.custApi.GetWhatIfCSV(templateid).subscribe((res) => {
      if (res) {
        console.log(res);
        this.templateDataCSV = res.GetWhatIfCSVResult;
        this.GetVolListForWhatIf(this.NoteMasterID);
      }
    });
  }

  GetInitialSpots(NotemasterID) {
    // var templateDataCSV;
    this.custApi
      .GetInitialSpots(NotemasterID, this.templateCode, this.templateDataCSV)
      .subscribe((res) => {
        if (res) {
          console.log(res);
          var actualSpots = res.GetInitialSpotsResult;
          this.arrActualInitialSpot = actualSpots.split(',');
          console.log(this.arrActualInitialSpot);
        }
      });
  }

  GetShareNameList(NotemasterID) {
    this.custApi.GetShareNameList(NotemasterID).subscribe((res) => {
      if (res) {
        console.log(res);
        this.shareNameList = [];
        this.shareNameList = res.GetShareNameListResult;

        this.shares = this.shareNameList
          .split(',')
          .map((element) => element.trim());
        console.log(this.shares);

        this.setInitialScenario();
        //this.GetRecords(this.NoteMasterID);
      }
    });
  }

  setInitialScenario() {
    this.scenariosObject = {
      set: 1,
      scenarioNo: 1,
      scenarioName: 1,
      shares: [],
      info: [],
      landingoptions: ['Shapes', 'GBM', 'Index'],
      GBM: [
        ['0', '0'],
        ['0', '0'],
        ['0', '0'],
      ],
    };
    this.setCount = 1;

    this.setDropdown = [];
    this.setDropdown.push(this.scenariosObject.set);
    this.setsArray.push(this.scenariosObject);

    this.setsArray.forEach((it) => {
      if (it.set === this.selectedSet) {
        this.scenariosArray.push(it);
      }
    });

    console.log(this.scenariosArray);
    console.log(this.setsArray);
    var tempArray = [];
    var shareListArray = this.shareNameList.split(',').map((it) => it.trim());
    console.log(shareListArray);
    shareListArray.forEach((element: any, index: string | number) => {
      var shareInfoObj = {
        name: element,
        isGBM: false,
        isIndex: false,
        isShape: false,
      };
      console.log(index);
      tempArray.push(shareInfoObj);
      // this.scenariosArray[0].shares[index].push(shareInfoObj);
    });
    this.scenariosArray[0].shares = tempArray;
    console.log(this.scenariosArray);

    this.scenariosArray[0].shares.forEach((share) => {
      this.shareNameListDisplay.push(share.name);
    });
  }

  GetAbsKO(NotemasterID) {
    this.custApi.GetShareNameList(NotemasterID).subscribe((res) => {
      if (res) {
        console.log(res);
        var AbsSpot = res.GetAbsKOResult;
      }
    });
  }

  GetTenor(NotemasterID) {
    console.log(NotemasterID);
    this.custApi.GetTenor(NotemasterID).subscribe((res) => {
      if (res) {
        this.Tenor = res.GetTenorResult[0].tenor;
        console.log(this.Tenor);
        var xArray = [];

        for (let i = 0; i < this.Tenor; i++) {
          xArray.push(i);
        }
        console.log(xArray);
      }
    });
  }

  GetVolListForWhatIf(NotemasterID) {
    this.custApi
      .GetVolListForWhatIf(
        NotemasterID,
        this.templateDataCSV,
        this.templateCode
      )
      .subscribe((res) => {
        if (res) {
          this.arrVolList = res.GetVolListForWhatIfResult;
          this.arrVolList = this.arrVolList
            .split(',')
            .map((element) => element.trim());

          console.log(this.arrVolList);
        } else {
          console.log('NO VOL');
        }
      });
  }

  ButtonAscending_Click() {
    this.Increment('Linear Ascending');
    this.showShapesPanel = false;
  }
  ButtonDescending_Click() {
    this.Increment('Linear Descending');
    this.showShapesPanel = false;
  }
  ButtonSemicircle_Click() {
    this.Increment('Semicircle');
    this.showShapesPanel = false;
  }
  ButtonInvertedSemicircle_Click() {
    this.Increment('Inverted Semicircle');
    this.showShapesPanel = false;
  }
  ButtonHyperbola2_Click() {
    this.Increment('Hyberbola(Quadrant2)');
    this.showShapesPanel = false;
  }
  ButtonHyperbola4_Click() {
    this.Increment('Hyberbola(Quadrant4)');
    this.showShapesPanel = false;
  }
  ButtonHyperbola3_Click() {
    this.Increment('Hyberbola(Quadrant3)');
    this.showShapesPanel = false;
  }
  ButtonHyperbola1_Click() {
    this.Increment('Hyberbola(Quadrant1)');
    this.showShapesPanel = false;
  }
  ButtonSin_Click() {
    this.Increment('Sin');
    this.showShapesPanel = false;
  }
  ButtonReverseSin_Click() {
    this.Increment('Reverse Sin');
    this.showShapesPanel = false;
  }
  ButtonCos_Click() {
    this.Increment('Cos');
    this.showShapesPanel = false;
  }
  ButtonReverseCos_Click() {
    this.Increment('Reverse Cos');
    this.showShapesPanel = false;
  }
  ButtonNike_Click() {
    this.Increment('Nike');
    this.showShapesPanel = false;
  }
  ButtonReverseNike_Click() {
    this.Increment('Reverse Nike');
    this.showShapesPanel = false;
  }
  ButtonNikeMirror_Click() {
    this.Increment('Nike Mirror');
    this.showShapesPanel = false;
  }
  ButtonReverseNikeMirror_Click() {
    this.Increment('Reverse Nike Mirror');
    this.showShapesPanel = false;
  }
  ButtonValley_Click() {
    this.Increment('Valley');
    this.showShapesPanel = false;
  }
  ButtonHill_Click() {
    this.Increment('Mountain');
    this.showShapesPanel = false;
  }
  ButtonUpAndFlat_Click() {
    this.Increment('Up And Flat');
    this.showShapesPanel = false;
  }
  ButtonDownAndFlat_Click() {
    this.Increment('Down And Flat');
    this.showShapesPanel = false;
  }

  Increment(curveType) {
    console.log(curveType);
    this.scenariosArray[this.scenarioIndex].shares[this.securityIndex].isShape =
      true;
    this.scenariosArray[this.scenarioIndex].info[this.securityIndex] =
    curveType+ "(" +this.stretchBy + ")"; 
    // ChitraM | 3-Jan-22 | shapes what-if not generating | added stretched by
  }

  Refresh() {
    this.scenariosArray = [];
    this.setsArray = [];
    this.resetVariables();
    this.GetShareNameList(this.NoteMasterID);
    this.getTemplateID(this.NoteMasterID);
    this.GetMaxScenarioNo(this.NoteMasterID);
    this.GetTenor(this.NoteMasterID);
    this.GetKIKOValues(this.NoteMasterID);

    this.EquityAutocallableNote = this.ProductName;

    this.scenariosObject = {
      set: 1,
      scenarioNo: 1,
      scenarioName: 1,
      shares: [
        // { name: 'Apple', isGBM: false, isIndex: false, isShape: false },
        // { name: 'Microsoft', isGBM: false, isIndex: false, isShape: false },
        // { name: 'IBM', isGBM: false, isIndex: false, isShape: false },
      ],
      info: [],
      landingoptions: ['Shapes', 'GBM', 'Index'],
      GBM: [
        ['0', '0'],
        ['0', '0'],
        ['0', '0'],
      ],
    };
    this.setCount = 1;

    this.setDropdown = [];
    this.setDropdown.push(this.scenariosObject.set);
    this.setsArray.push(this.scenariosObject);

    this.setsArray.forEach((it) => {
      if (it.set === this.selectedSet) {
        this.scenariosArray.push(it);
      }
    });

    this.scenariosArray[0].shares.forEach((share) => {
      this.shareNameListDisplay.push(share.name);
    });

    var tempArray = [];
    var shareListArray = this.shareNameList.split(',').map((it) => it.trim());
    console.log(shareListArray);
    shareListArray.forEach((element: any, index: string | number) => {
      var shareInfoObj = {
        name: element,
        isGBM: false,
        isIndex: false,
        isShape: false,
      };
      console.log(index);
      tempArray.push(shareInfoObj);
      // this.scenariosArray[0].shares[index].push(shareInfoObj);
    });
    this.scenariosArray[0].shares = tempArray;
    console.log(this.scenariosArray);

    this.scenariosArray[0].shares.forEach((share) => {
      this.shareNameListDisplay.push(share.name);
    });

    console.log(this.scenariosArray);
    console.log(this.setsArray);
  }

  resetVariables() {
    this.selectCount = 1;
    this.setDropdown = [];
    this.scenariosArray = [];
    this.setsArray = [];
    this.selectedSet = 1;
    this.volatility = 0;
    this.spotPerc = 0;
    this.graphdata = [];
    this.graphdata1 = [];
    this.Record = [];
    this.finalGraphData = [];
    this.showPlotArea = false;
    this.showShapesPanel = false;
    this.allInfoScenarios = [];
    this.PayoffArray = [];
    this.showPayoff = false;
    this.selectCount = [false, false, false, false, false, false, false, false];
    this.tempData = [];
    this.delData = [];
  }

  scenarioSelection(k) {
    this.allScenarioSelected = false
    for (let i = 0; i < this.selectCount.length; i++) {
      this.selectCount[i] = false
    }
    this.selectCount[k] = true
    this.showChart = false
    this.showPlotArea = false
    this.selectedRow = k + 1
    // this.finalGraphData = this.fullyFinalData

    // this.GetRecords(this.NoteMasterID, this.selectedRow);
    // console.log(this.selectCount[k]);
    this.showChart = true
    this.showPlotArea = true
    // console.log(k, this.finalGraphData);
  }

  selectAllScenarios() {
    for (let i = 0; i < this.selectCount.length; i++) {
      this.selectCount[i] = false
    }
    this.allScenarioSelected = !this.allScenarioSelected;
    //console.log(this.allScenarioSelected);
    //console.log(this.selectCount);
    console.log(this.finalGraphData);


    // if (!this.allScenarioSelected) {
    //   this.temporaryData = [];
    //   this.scenariosArray.forEach((_it, index) => {
    //     this.selectCount[index] = false;
    //   });
    //   this.temporaryData = this.finalGraphData;
    //   console.log(this.temporaryData);
    //   this.finalGraphData = [];
    // } else if (this.allScenarioSelected) {
    //   this.scenariosArray.forEach((_it, index) => {
    //     this.selectCount[index] = true;
    //   });
    //   console.log(this.temporaryData);
    //   this.finalGraphData = this.temporaryData;
    //   // this.fullyFinalData = this.finalGraphData 
    //   // tempData = this.finalGraphData;
    //   // /this.plotBtn();
    // }

    console.log(this.selectCount);
    console.log(this.finalGraphData);
    // this.plotBtn()
    // this.scenariosArray.forEach((_element, index) => {
    //     if(this.selectCount[index] === true){
    //       checkCount++;
    //     }
    // });
    // if(checkCount === this.scenariosArray.length) {
    //   this.allScenarioSelected = true;
    // } else {
    //   this.allScenarioSelected = false;
    // }
  }

  DeleteSet() {
    console.log(this.selectedSet, this.setsArray);
    this.setsArray.forEach((it, index) => {
      if (it.set === this.selectedSet) {
        this.setsArray.splice(index, 1);
      } else {
        console.log('No Deletion.');
      }
    });
    this.setDropdown.splice(
      this.setDropdown.findIndex((x) => x === this.selectedSet),
      1
    );
    console.log(this.scenariosArray, this.setsArray);
    this.selectedSet = this.setsArray[0].set;
    this.setChanged()
    if (this.setsArray.length === 1) {
      this.disableDelete = true
    } else {
      this.disableDelete = false
    }
    this.resetGraph()
  }

  GetWhatIfAnalysis() {
    var distt = false;
    var highlow = 'FIX';
    var Amplitude = 1;
    var scenario_no = 1;
    var handInput = '';
    var midLifeDate: any = new Date();
    midLifeDate = this.datepipe.transform(midLifeDate, 'dd-MMM-yyyy');
    var startDay = 1;
    var EntityID = 149;
    var AbsoluteSpot = false;
    var spotSim = [];
     // var UserID = 'SOLAR_S1'; //Commented by ChitraM | 20-Feb-23 | Hardcoded userid
    var UserID = sessionStorage.getItem('FinIQUserID'); // Added by ChitraM | 20-Feb-23
    this.PayoffArray = []
    console.log(
      this.NoteMasterID,
      highlow,
      this.templateCode,
      this.strScenarioString,
      distt,
      Amplitude,
      scenario_no,
      handInput,
      midLifeDate,
      this.templateDataCSV,
      startDay,
      EntityID,
      AbsoluteSpot,
      spotSim,
      true,
      UserID
    );
    this.custApi
      .GetWhatIfAnalysis(
        this.NoteMasterID,
        highlow,
        this.templateCode,
        this.strScenarioString,
        distt,
        Amplitude,
        scenario_no,
        handInput,
        midLifeDate,
        this.templateDataCSV,
        startDay,
        EntityID,
        AbsoluteSpot,
        spotSim,
        true,
        UserID
      )
      .subscribe((res) => {
        if (res) {
          var WhatIfAnalysisResult = res.GetWhatIfAnalysisResult;
          WhatIfAnalysisResult.forEach((element) => {
            if (element.OutputSummary.includes("ConfigError")) {
              this.configErroFlag = true;
              this.errorMsg = element.OutputSummary;
            } else {
               this.PayoffArray.push(element.OutputSummary);
              //this.PayoffArray.push(element.OutputSummary.replaceAll(".", "<br>")); 
            }
          });
          console.log(WhatIfAnalysisResult);
          console.log("PAYOFF", this.PayoffArray)
          if (this.PayoffArray.length) {
            this.showPayoff = true;
          }
          this.GetRecords(this.NoteMasterID, this.selectedRow);
        } else {
          console.log('NO VOL');
        }
      });
    console.log("PAYOFF", this.PayoffArray)
  }

  configureTableHeader() {
    this.tableHeader = [];
    for (let i = 0; i < this.scenariosArray.length; i++) {
      this.shares.forEach((ele) => {
        this.tableHeader.push(ele);
      });
    }
  }

  addStrikeAndKI() {
    var actualStrikesArr = [];
    var actualKIArr = [];
    var data = [];
    this.finalGraphData1 = []
    this.finalGraphData2 = []
    this.finalGraphData3 = []
    this.finalGraphData4 = []
    this.finalGraphData.forEach((ele) => {
      if (ele.scenario === 1) {
        this.finalGraphData1.push(ele);
      }
    });
    this.finalGraphData.forEach((ele) => {
      if (ele.scenario === 2) {
        this.finalGraphData2.push(ele);
      }
    });
    this.finalGraphData.forEach((ele) => {
      if (ele.scenario === 3) {
        this.finalGraphData3.push(ele);
      }
    });
    this.finalGraphData.forEach((ele) => {
      if (ele.scenario === 4) {
        this.finalGraphData4.push(ele);
      }
    });

    if (this.statistics === 'Spot') {
      var strikeData = [];
      var KIData = [];
      var KOData = [];

      for (let i = 0; i < this.Tenor; i++) {
        var obj = {
          x: i,
          y: this.strike
        }
        strikeData.push(obj);

        if (this.KI) {
          var obj1 = {
            x: i,
            y: this.KI
          }
          KIData.push(obj1);
        }
        if (this.KO) {
          var obj1 = {
            x: i,
            y: this.KO
          }
          KOData.push(obj1);
        }
      }
      var strikeObj = {
        name: "Strike",
        data: strikeData,
      }
      this.finalGraphData.push(strikeObj);
      this.finalGraphData1.push(strikeObj);
      this.finalGraphData2.push(strikeObj);
      this.finalGraphData3.push(strikeObj);
      this.finalGraphData4.push(strikeObj);
      // this.fullyFinalData.push(strikeObj);
      if (this.KI) {
        var KIObj = {
          name: "Knock In",
          data: KIData,
        }
        this.finalGraphData.push(KIObj);
        this.finalGraphData1.push(KIObj);
        this.finalGraphData2.push(KIObj);
        this.finalGraphData3.push(KIObj);
        this.finalGraphData4.push(KIObj);
        // this.fullyFinalData.push(KIObj);
      }
      if (this.KO) {
        var KOObj = {
          name: "Knock Out",
          data: KOData,
        }
        this.finalGraphData.push(KOObj);
        this.finalGraphData1.push(KOObj);
        this.finalGraphData2.push(KOObj);
        this.finalGraphData3.push(KOObj);
        this.finalGraphData4.push(KOObj);
        // this.fullyFinalData.push(KOObj);
      }

    }
    else if (this.statistics === 'Actual') {
      var strikesAndKI = [];
      console.log(this.KI);
      this.arrActualInitialSpot.forEach((_element, _index) => {
        var obj1 = {
          type: "Strike: " + this.shares[_index],
          value: (this.strike * parseInt(_element) / 100)
        }
        strikesAndKI.push(obj1);
        if (this.KI) {
          var obj2 = {
            type: "KI: " + this.shares[_index],
            value: (this.KI * parseFloat(_element) / 100)
          }
          strikesAndKI.push(obj2);
        }

      });
      console.log(strikesAndKI);

      for (let i = 0; i < strikesAndKI.length; i++) {
        data = [];
        for (let j = 0; j < this.Tenor; j++) {
          var object = {
            x: j,
            y: strikesAndKI[i].value
          }
          data.push(object);
        }
        var dataOBJ = {
          name: strikesAndKI[i].type,
          data: data
        }
        this.finalGraphData.push(dataOBJ);
        // this.fullyFinalData.push(dataOBJ)
      }

    }

    console.log(this.finalGraphData1)
    console.log(this.finalGraphData2)
    console.log(this.finalGraphData3)
    console.log(this.finalGraphData4)

  }
  resetGraph() {
    this.finalGraphData = []
    this.sharesOrder = []
    this.showPlotArea = false
    this.PayoffArray = false
    // this.autoClicked = false
  }
}



