import { AfterViewChecked, Component, ElementRef, OnInit } from '@angular/core';
import { ModelsetupApiService } from '../../../services/modelsetup-api.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';

@Component({
  selector: 'app-model-setup',
  templateUrl: './model-setup.component.html',
  styleUrls: ['./model-setup.component.scss'],
})
export class ModelSetupComponent implements OnInit, AfterViewChecked {
  selectedTab = 4;
  modelData = [];
  edit = false;
  editpopup = false;
  editTable = false;
  editToggle = true;
  showInvestment = true;
  blottersHeaders = {
    'Model Code': {
      filterFlg: false,
      key: 'ModelCode',
    },
    'Model Name': {
      filterFlg: false,
      key: 'ModelName',
    },
    'Created By': {
      filterFlg: false,
      key: 'CreatedBy',
    },
  };
  FXblottersHeaders = {
    'Transaction Date': {
      filterFlg: false,
      key: 'TranDateandTime',
    },
    'Trade ID': {
      filterFlg: false,
      key: 'OrderID',
    },
    Product: {
      filterFlg: false,
      key: 'Product',
    },
    Direction: {
      filterFlg: false,
      key: 'Direction',
    },
    'Currency Pair': {
      filterFlg: false,
      key: 'CurrencyPair',
    },
    'Sell Ccy': {
      filterFlg: false,
      key: 'BillingCurrency',
    },
    'Sell Amt': {
      filterFlg: false,
      key: 'Ccy1_Amount',
    },
    'Buy Ccy': {
      filterFlg: false,
      key: 'CreditCurrency',
    },
    'Buy Amt': {
      filterFlg: false,
      key: 'Ccy2_Amount',
    },
    Rate: {
      filterFlg: false,
      key: 'Rate',
    },
    'Value Date': {
      filterFlg: false,
      key: 'Value_Date',
    },
  };
  filterStr: any = '';
  record_index: any;
  rec_indx: any;
  isUserRM: boolean;
  userType: any;
  filterFlag1: boolean;
  RMOrderBlotter = [];
  RMOrderBlotterCopy1 = [];
  RMBlotterFilter = [];
  blotter = [];
  blotterFilter = [];
  blotterCopy1 = [];
  p: any;
  q: any;
  r: any;
  transaction = [];
  filteredWorflowRecords = [];
  filterFlag = true;
  data = [];
  modelCode: any;
  modelName: any;
  createdBy: any;
  createdAt: any;
  investmentObjective: any;
  expectedReturns: any;
  xml: string;
  addForm: UntypedFormGroup;
  rows: UntypedFormArray;
  itemForm: UntypedFormGroup;
  add = false;
  myDate = new Date();
  objInvst = [];
  modelData1 = [];
  changeName = false;
  changeCode = false;
  changeInvst = false;
  changeReturn = false;
  index: any;
  popup = false;
  del_index: any;
  yesFlag = false;
  benckmarkID: any;
  getData: any;
  selected: any;
  editToggledel = false;
  message: any;
  messageFlag = false;
  modelCodemsgflg = false;
  modelNamemsgflg = false;
  modelCodemsg: any;
  modelNamemsg: any;
  allocationFlag = false;

  popupinvstobj: any;
  popupmodelName: any;

  delFlag = false;
  addpopuprecord = false;
  respFlag: any;
  modelCompFlag = false;
  addFlag = false;

  modelAllocationData = [];
  schemeArray = [];
  templateArray: any;
  schemeName: any;
  templateName: any;
  benchmarkAllocationData = [];
  modelComposition = [];
  Ballocation: any;
  addnewrec = false;
  modelAlloc = [];
  duplicateFlag = false;
  rcd: any;
  category: any;
  loggedInUsername: any;
  duplicateFlagArray = [];
  checkboxFlag = false;
  schCode: any;
  sel: any;

  modelCompositionGraphData: any;
  modelCompositionGraphOptions: any;
  modelCompositionGraphType: any;
  modelCompositionChartColors: string[];

  constructor(
    public asf: ModelsetupApiService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private fb: UntypedFormBuilder,
    public elem: ElementRef
  ) {
    this.addForm = this.fb.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required],
    });

    this.rows = this.fb.array([]);
    this.modelCompositionChartColors = [
      '#dfc2e4',
      '#fbe19f',
      '#9ad3f0',
      '#bce4b1',
      '#ed7d31',
      '#a5a5a5',
      '#619010',
      '#388a90',
      '#6143b7',
      '#a3085f',
      '#85593d',
      '#878787',
      '#b19c0c',
    ];
    this.modelCompositionGraphType = 'PieChart';
    this.modelCompositionGraphOptions = {
      pieHole: 0.8,
      pieSliceText: 'none',
      legend: {
        position: 'right',
        textStyle: {
          color: '#fff',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'both',
      },
      colors: this.modelCompositionChartColors,
      width: '350',
      height: '190',
      hAxis: {
        textStyle: {
          color: '#808080',
        },
      },
      vAxis: {
        textStyle: {
          color: '#808080',
        },
      },
      titleTextStyle: {
        color: '#808080',
      },
      backgroundColor: '#FFFFFF00',
      chartArea: { left: 10, top: 10, width: '100%', height: '100%' },
    };
    this.modelCompositionGraphData = [];
  }

  ngAfterViewChecked() {
    Array.prototype.forEach.call(
      this.elem.nativeElement.getElementsByTagName('rect'),
      (rect: HTMLElement) => {
        if (rect.getAttribute('fill') === '#ffffff') {
          rect.setAttribute('fill', '#ffffff00');
        }
      }
    );
  }
  ngOnInit(): void {
    this.schemeName = 'PMSProductMaster';
    this.asf.getTemplateMaster('2');
    this.templateName = 'Fund Products';
    this.filterFlag1 = true;
    this.selected = -1;
    this.sel = null;
    this.message = '';
    this.category = 'Consumer Cyclicals';
    this.loggedInUsername = sessionStorage.getItem('Username');
    // this.investmentObjective = "Regular Income";
    this.userType = sessionStorage.getItem('UserType');
    this.isUserRM = this.userType.toUpperCase().includes('RM') ? true : false;
    console.log('myDate', this.myDate, this.loggedInUsername);
    console.log(
      'values',
      this.modelCode,
      this.modelName,
      this.expectedReturns,
      this.objInvst,
      this.createdAt,
      this.createdBy
    );

    this.data = this.modelData;

    this.asf.getModelSetupData().subscribe((res) => {
      if (res) {
        let benchmarkData = res;
        this.getData = res;
        console.log('res', res);
        for (let i = 0; i < Object.keys(benchmarkData).length; i++) {
          // console.log("getModelSetupData",res);
          this.modelData.push({
            checkbox: [{ id: i, checked: false }],
            edit: 'Edit',
            code: benchmarkData[i].Benchmark_Code,
            name: benchmarkData[i].Benchmark_Name,
            // objective:  this.investmentObjective,
            objective: benchmarkData[i].Benchmark_Misc1,
            return: benchmarkData[i].Benchmark_Expected_Return,
            created_by: benchmarkData[i].Benchmark_Created_By,
            ID: benchmarkData[i].Benchmark_Id,
            created_at: benchmarkData[i].Benchmark_Created_At,
          });
        }
      }
      // console.log(" this.modelData",this.modelData,this.modelData[0].ID);
      console.log(' this.modelData', this.modelData);
    });

    // this.asf.getInvestmentObjective().subscribe(res => {
    //   if (res) {
    //     console.log("getInvestmentObjective",res)
    //   }
    // });
    this.asf.getInvestmentObjective();
    this.asf.GetInvestmentObjectiveObserver.subscribe((res: any) => {
      if (res) {
        console.log('getInvestmentObjective', res);
        console.log('getInvestmentObjective length', res.length);
        // console.log(parseXmlToJson(res));

        if (res.length != 0) {
          var jsonText = JSON.stringify(this.ngxXml2jsonService.xmlToJson(res));
          const obj = JSON.parse(jsonText);
          var result = Object.keys(obj).map((key) => [Number(key), obj[key]]);

          console.log(result);
          const res1 = result[0];
          const res2 = Object.entries(res1[1]);
          const res4 = res2[2];
          const res5 = Object.entries(res4[1]);
          const res6 = Object.entries(res5[1]);
          const res7 = Object.entries(res6[1][1]);
          const res8 = Object.entries(res7[1][1]);

          let temp = [];

          for (let i = 0; i < res8.length; i++) {
            temp[i] = res8[i][1];
          }
          for (let i = 0; i < res8.length; i++) {
            this.objInvst[i] = temp[i].Data_Value;
          }

          console.log('temp', this.objInvst);
          for (let i = 0; i < res8.length; i++) {
            // console.log("temp",i,this.objInvst[i]);
          }
        }
        // const xml = require('txml');
        // const dom = xml(res);
        // console.log("dom",dom);
        // xml.stringify(dom);
        // function parseXmlToJson(xml) {
        //     const json = {};
        //     for (const res of xml.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)) {
        //         const key = res[1] || res[3];
        //         const value = res[2] && parseXmlToJson(res[2]);
        //         json[key] = ((value && Object.keys(value).length) ? value : res[2]) || null;

        //     }
        //     return json;
        // }
        // console.log("...",typeof (res));
        // const data = res;
        // const obj = JSON.parse(data);
        // console.log("obj",obj);
        // let parseString = require('xml2js').parseString;
        // parseString(obj, function (err, result) {
        //   console.dir(".....",result.NewDataSet.DocumentElement.DUMMY);

        // });
      }
    });

    this.asf.deleteBenchmarkObserver.subscribe((res: any) => {
      if (res) {
        this.asf.getModelSetupData().subscribe((res) => {
          if (res) {
            console.log('getModelSetupData in delete = ', res);
          }
        });
      }
    });

    // if(this.modelNamemsgflg == false && this.modelCodemsgflg == false)
    // {
    // this.messageFlag = true;
    // this.message = "Record saved successfully.";
    this.asf.insertBenchmarkObserver.subscribe((res: any) => {
      if (res) {
        console.log('insertBenchmarkMasterData', res);
        if (res == true) {
          this.messageFlag = true;
          this.message = 'Record saved successfully.';

          this.asf.getModelSetupData().subscribe((res) => {
            if (res) {
              console.log('save_records = res after insert(DB) =', res);
            }
          });
        }
      }
    });
    // }
    this.asf.updateBenchmarkObserver.subscribe((res: any) => {
      if (res == true) {
        this.asf.getModelSetupData().subscribe((res) => {
          if (res) {
            console.log('getModelSetupData db true = ', res);
          }
        });
      }
    });

    this.asf.getBenchmarkMaster();
    this.asf.benchmarkMasterObserver.subscribe((res) => {
      if (res) {
        console.log('getBenchmarkMaster = ', res);
      }
    });

    // this.asf.getbenchmarkAllocationData("5");
    this.asf.benchmarkAllocationObserver.subscribe((res) => {
      console.log('getbenchmarkAllocationData = ', res);

      console.log('len = ', res.length);
      if (res.length != 0) {
        this.respFlag = true;
        this.Ballocation = [];

        this.modelCompFlag = true;
        //   res1 = Object.entries(res1[1]);
        //   console.log("this.b-allocation = ", res1)
        this.Ballocation = res;

        for (let i = 0; i < Object.keys(res).length; i++) {
          this.modelAllocationData.push({
            checkbox: [{ checked: false }],
            // save:"",
            // scheme:"Equities",
            // template:"Shares",
            schemeName: this.Ballocation[i].Scheme_Name,
            temp_name: this.Ballocation[i].Template_Name,
            subtemp: 'Sector',
            cat: 'Consumer',
            cat_allo: this.Ballocation[i].TC_Category,
            subtemp_all: this.Ballocation[i].SubTemplateAllocation,
            allocation: this.Ballocation[i].TC_Allocation,
            created_by: this.Ballocation[i].BA_Created_By,
            created_at: this.Ballocation[i].BA_Created_At,
            BA_allocation: this.Ballocation[i].BA_Allocation,
            BA_Id: this.Ballocation[i].BA_Id,
            BA_schemeId: this.Ballocation[i].BA_Scheme_Id,
            BA_tempId: this.Ballocation[i].BA_Template_Id,
            benchmarkId: this.Ballocation[i].Benchmark_Id,
            tc_Id: this.Ballocation[i].TC_Id,
          });
        }
      }
      console.log(' this.modelAllocationData = ', this.modelAllocationData);
    });
    this.asf.getschemeCode();
    this.asf.schemeCodeObserver.subscribe((res) => {
      if (res != '') {
        // this.schemeArray = res;
        var jsonText = JSON.stringify(this.ngxXml2jsonService.xmlToJson(res));
        const obj = JSON.parse(jsonText);
        var result = Object.keys(obj).map((key) => [Number(key), obj[key]]);
        var res1 = result[0];
        res1 = Object.entries(res1[1]);
        res1 = res1[1];
        res1 = Object.entries(res1[1]);
        res1 = res1[1];
        res1 = Object.entries(res1[1]);
        let schemeEntries = [];
        // console.log("res1 = ",res1.length);
        for (let i = 0; i < res1.length; i++) {
          var res2 = Object.values(res1[i][1]);
          // console.log("res2 = ",res2,res2[0],i);
          schemeEntries.push({
            schemeCode: res2[0],
            schemeName: res2[1],
          });
        }
        this.schemeArray = schemeEntries;
        console.log('schemeArray = ', this.schemeArray);
      }
    });
    // this.asf.getTemplateMaster("2");
    this.asf.templateMasterObserver.subscribe((res) => {
      if (res) {
        var jsonText = JSON.stringify(this.ngxXml2jsonService.xmlToJson(res));
        const obj = JSON.parse(jsonText);
        var result = Object.keys(obj).map((key) => [Number(key), obj[key]]);
        var res1 = result[0];
        res1 = Object.entries(res1[1]);
        res1 = res1[1];
        res1 = Object.entries(res1[1]);
        res1 = res1[1];
        res1 = Object.entries(res1[1]);
        let templateEntries = [];
        console.log('length = ', res1.length, res1);
        for (let i = 0; i < res1.length; i++) {
          var res2 = Object.values(res1[i][1]);
          // console.log("res2 = ",res2,i);
          templateEntries.push({
            tempID: res2[0],
            tempName: res2[1],
          });
        }
        this.templateArray = templateEntries;
        console.log('templateArray = ', this.templateArray);
      }
    });
    // this.asf.getBenchmarkComposition("5");
    this.asf.benchmarkCompositionObserver.subscribe((res: any[]) => {
      if (res.length > 0) {
        let compArray: any[] = [];
        console.log('getBenchmarkComposition = ', res);
        // this.modelCompositionGraphData = [
        //   ['Work', 11],
        //   ['Eat', 2],
        //   ['Commute', 2],
        //   ['Watch TV', 2],
        //   ['Sleep', 7]
        // ];
        res.forEach((comp) => {
          compArray.push([comp.Scheme, parseFloat(comp.Allocation)]);
        });
        this.modelCompositionGraphData = compArray;
        // for (let i = 0; i < Object.keys(res).length; i++) {
        //   this.modelComposition.push({
        //     scheme: compArray[i].Scheme,
        //     allocation: compArray[i].Allocation
        //   })
        // }
        console.log('this.modelComposition = ', this.modelComposition);
      }
    });
    this.asf.deleteRecordObserver.subscribe((res) => {
      if (res) {
        console.log('deleteRecordObserver = ', res);
      }
    });
  }

  add_records() {
    console.log('in add records');
    this.add = true;
    this.messageFlag = false;
    let len = this.modelData.length;
    console.log('len', len);
    if (this.add == true) {
      this.edit_records(len);
    }

    this.modelData.push({
      checkbox: [{ id: len, checked: false }],
      edit: 'Edit',
      code: '',
      name: '',
      objective: '',
      // objective: this.objInvst[0],
      return: '',
      created_by: 'superuser1',
      created_at: this.myDate,
    });
    console.log('add_records=', this.modelData);
  }
  save_record() {
    // this.modelData[len].code=
    console.log(this.add);
    if (this.add == true) {
      console.log('in SAVE ADD FLAG = ', this.add);
      this.createdAt = this.myDate;
      let len = this.modelData.length - 1;
      console.log('LENGTH ===', len);
      this.modelData[len].code = this.modelCode;
      this.modelData[len].name = this.modelName;
      this.modelData[len].created_by = 'superuser1';
      this.modelData[len].created_at = this.createdAt;
      this.modelData[len].return = this.expectedReturns;
      this.investmentObjective = this.objInvst[0];
      // this.editTable = true;
      this.modelData[len].objective = this.investmentObjective;
      // this.modelData[len].objective = "Capital Protection";
      // this.modelData[len].objective = this.investmentObjective;
      this.modelData[len].objective = '';
      console.log(
        'SAVE =',
        this.modelData,
        this.modelData[len].code,
        this.modelData[len].name
      );

      if (
        this.modelData[len].code == undefined &&
        this.modelData[len].name == undefined
      ) {
        this.modelCodemsgflg = true;
        this.modelCodemsg = 'Please enter valid Benchmark Code.';
        console.log(
          'in both empty',
          this.modelNamemsgflg,
          this.modelCodemsgflg
        );
      } else if (this.modelData[len].code == undefined) {
        this.modelCodemsgflg = true;
        this.modelCodemsg = 'Please enter valid Benchmark Code.';
        console.log('in code empty', this.modelCodemsgflg);
      } else if (this.modelData[len].name == undefined) {
        this.modelCodemsgflg = true;
        this.modelNamemsgflg = true;
        this.modelCodemsg = 'Please enter valid Benchmark Name.';
        console.log('in name empty', this.modelNamemsgflg);
      } else if (
        this.modelData[len].code != undefined &&
        this.modelData[len].name != undefined
      ) {
        // this.edit = false;
        // this.editTable = false;
        // this.editToggle = true;
        // this.modelData[len].objective = this.investmentObjective;
        this.modelNamemsgflg = false;
        this.modelCodemsgflg = false;
        let c = this.modelData[len].code;
        let n = this.investmentObjective;
        let len1 = this.modelData.length;
        console.log('len(in else if) :', len1, this.investmentObjective);
        for (let i = 0; i < len1 - 1; i++) {
          // console.log("i =",i);
          this.duplicateFlagArray[i] = false;
          if (c == this.modelData[i].code && n == this.modelData[i].objective) {
            this.duplicateFlagArray[i] = true;
            console.log(
              'duplicate entry cant save the record',
              this.modelData[i].code,
              this.modelData[i].objective
            );
            // this.modelData.splice(i,1);
            // console.log("this.modelData[i].objective ", this.modelData[i].code,this.modelData[i].objective,this.duplicateFlag);
          }
          if (c != this.modelData[i].code && n != this.modelData[i].objective) {
            this.duplicateFlagArray[i] = false;
            // console.log("not a duplicate = ",this.modelData[i].code, this.modelData[i].objective,this.duplicateFlag);
          }
        }
        console.log('Duplicate Flag Array = ', this.duplicateFlagArray);
        for (let i = 0; i < len1 - 1; i++) {
          // if(this.duplicateFlag != true)
          // {
          this.duplicateFlag = false;
          // }
          if (this.duplicateFlagArray[i] == true) {
            this.duplicateFlag = true;
            break;
            // console.log("in if",i,this.duplicateFlagArray[i]);
          }
          // if(this.duplicateFlagArray[i] == false && this.duplicateFlagArray[i] == this.duplicateFlagArray[i+1])
          // {
          //   this.duplicateFlag = false;
          //   console.log("in 2nd if",i,this.duplicateFlagArray[i]);
          // }
        }
        // for(let i=0;i<len1-1;i++)
        // {
        //   if(this.duplicateFlagArray[i] == false && this.duplicateFlagArray[i] == this.duplicateFlagArray[i+1])
        //   {
        //     this.duplicateFlag = false;
        //     console.log("in 2nd if",i,this.duplicateFlagArray[i]);
        //   }
        // }
        console.log('dupliacte flag = ', this.duplicateFlag);
        // this.duplicateFlag = false;
        if (this.duplicateFlag == false) {
          this.edit = false;
          this.editTable = false;
          this.editToggle = true;
          this.asf.insertBenchmarkMasterData(
            this.modelData[len].code,
            this.createdAt,
            'superuser1',
            this.modelData[len].return,
            this.modelData[len].objective,
            this.modelData[len].name
          );
          console.log(
            'save_records values(non duplicate) = ',
            this.modelData[len].code,
            this.createdAt,
            this.modelData[len].return,
            this.modelData[len].objective,
            this.modelData[len].name
          );
          console.log(
            'save_records in duplicate flag false = ',
            this.modelData,
            this.duplicateFlag
          );
        }
      }
    }

    if (
      (this.edit == true && this.changeCode == true) ||
      (this.edit == true && this.changeName == true) ||
      (this.edit == true && this.changeReturn == true) ||
      (this.edit == true && this.changeInvst == true)
    ) {
      console.log('save index', this.index);
      if (this.index == this.modelData[this.index].checkbox[0].id) {
        console.log('in edit and save for record no. = ', this.index);
        console.log('innn saveee', this.modelData);
        this.edit = false;
        this.benckmarkID = this.modelData[this.index].ID;

        console.log('benckmarkID', this.benckmarkID, this.modelCode);
        this.asf.updateBenchmarkMasterData(
          this.modelData[this.index].code,
          this.modelData[this.index].name,
          this.modelData[this.index].objective,
          this.modelData[this.index].return,
          this.benckmarkID
        );
      }
    }
  }
  checkbox(i, _e) {
    this.editToggledel = true;
    this.selected = i;
    console.log('in checkbox', this.selected);
    // console.log("",e.target.value);
    this.modelData[i].checkbox[0].checked = true;
    // console.log("bbb",this.modelData[i].checkbox[0].checked,this.modelData);
    this.del_index = i;
  }

  delete_record(i) {
    if (this.modelData[i].checkbox[0].checked == true) {

      console.log('id in delete', this.del_index);
      let benchmark_id = this.modelData[this.del_index].ID;
      console.log('id in benchmark_id', benchmark_id);
      this.asf.deleteBenchmarkMasterData(benchmark_id);
      this.modelData.splice(this.del_index, 1);
    }
    console.log('aftr delte', this.modelData);
  }
  yesToggle() {
    this.yesFlag = true;
    this.editToggledel = false;
    // console.log("ggg",this.yesFlag);
    if (this.yesFlag) {
      // console.log("ggg",this.yesFlag);
      this.delete_record(this.del_index);
    }
    this.popup = false;
  }
  del() {
    this.popup = true;
  }
  cancel_popup() {
    this.popup = false;
  }
  edit_records(i: any) {
    this.edit = true;
    this.editTable = true;
    this.editToggle = !this.editToggle;
    this.record_index = i;
    console.log('edit_records', this.edit, this.record_index);
  }
  Onkeyup(i, e) {
    // console.log("r---",this.modelCode);
    this.changeCode = true;
    this.modelCode = e.target.value;
    console.log('r--===-', this.modelCode);
    this.modelData[i].code = this.modelCode;
    console.log(
      'this.mode',
      this.modelName,
      this.modelCode,
      this.expectedReturns
    );
  }
  OnkeyupmodelName(i, e) {
    this.changeName = true;
    this.modelName = e.target.value;
    console.log('after', this.modelName);
    this.modelData[i].name = this.modelName;
    console.log(
      'this.mode',
      this.modelName,
      this.modelCode,
      this.expectedReturns
    );
  }
  OnkeyupexpectedReturns(i, e) {
    this.changeReturn = true;
    this.expectedReturns = e.target.value;
    console.log('after', this.expectedReturns);
    this.modelData[i].return = this.expectedReturns;
    console.log(
      'this.mode',
      this.modelName,
      this.modelCode,
      this.expectedReturns
    );
  }
  edit_entry(i: any) {
    this.index = i;
    console.log('edit_entry index', this.index);
    // if(i == this.modelData[i].checkbox[0].id )
    // {
    //   console.log("in edit for record no. = ",i);
    //   this.modelData[i].code=this.modelCode;
    //   this.modelData[i].name=this.modelName;
    //   this.modelData[i].return=this.expectedReturns;
    // }
    // console.log("this.mode",this.modelName,this.modelCode,this.expectedReturns);
  }
  cancel() {
    this.edit = false;
    this.editTable = false;
    this.editToggle = !this.editToggle;
    console.log('...', this.add, this.edit, this.editToggle);
    let len = this.modelData.length;

    if (this.add == true && this.editToggle == true) {
      // console.log("in cancel",len-1);
      this.modelData.splice(len - 1, 1);
    }
    console.log(',,,', this.modelData);
  }

  filtering(e, columnName) {
    console.log('columnName', columnName);
    let result = [];
    let value = e.target.value.toLowerCase();

    result = this.modelData.filter((data) => {
      if (columnName == 'code')
        return data.code.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      else if (columnName == 'name') {
        console.log('in name');
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      } else if (columnName == 'created_by')
        return (
          data.created_by.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
    });

    console.log('result', result);

    this.modelData = result;
  }
  filter(header) {
    // this.filterFlag = false;
    for (const [key, value] of Object.entries(this.blottersHeaders)) {
      if (this.blottersHeaders[`${key}`].filterFlg)
        this.blottersHeaders[`${key}`].filterFlg = true;
      console.log(
        'this.blottersHeaders[`${key}`].filterFlg =',
        this.blottersHeaders[`${key}`].filterFlg,
        key,
        value
      );
    }
    this.blottersHeaders[header].filterFlg = true;
  }
  hideFilter(_e) {
    this.modelData = this.data;

    console.log('result cancel', this.data);
    // this.filterFlag = true;
    for (const [key] of Object.entries(this.blottersHeaders))
      this.blottersHeaders[`${key}`].filterFlg = false;
  }

  changeInvstObj(i, event) {
    this.changeInvst = true;

    if (i == this.modelData[i].checkbox[0].id) {
      let instobj = event.target.value;
      // this.investmentObjective = event.target.value;
      console.log('this.objInvst', i, instobj, this.investmentObjective);

      // for(let i=0;i<this.modelData.length;i++)
      // {

      console.log('====', this.modelData[i].checkbox[0].id);
      this.modelData[i].objective = instobj;
      console.log('this.modelData[i].objective', this.modelData[i].objective);
      this.investmentObjective = this.modelData[i].objective;
      console.log('this.investmentObjective', this.investmentObjective);
      this.modelData = this.modelData;
    }
    // }

    console.log(' this.modelData changeInvstObj', this.modelData);
  }

  load() {
    this.messageFlag = false;
    this.asf.getModelSetupData().subscribe((res) => {
      if (res) {
        console.log('in load= ', res);
        let benchmarkData = res;
        let data = [];
        // console.log("res",res);
        for (let i = 0; i < Object.keys(benchmarkData).length; i++) {
          data.push({
            checkbox: [{ id: i, checked: false }],
            edit: 'Edit',
            code: benchmarkData[i].Benchmark_Code,
            name: benchmarkData[i].Benchmark_Name,
            objective: benchmarkData[i].Benchmark_Misc1,
            return: benchmarkData[i].Benchmark_Expected_Return,
            created_by: benchmarkData[i].Benchmark_Created_By,
            ID: benchmarkData[i].Benchmark_Id,
            created_at: benchmarkData[i].Benchmark_Created_At,
          });
        }
        this.modelData = data;
        console.log(' this.modelData', this.modelData);
      }
    });
  }

  modelAllocation(i) {
    this.allocationFlag = true;
    this.modelAllocationData = [];
    this.modelComposition = [];
    console.log(
      'the record number is',
      i,
      this.modelData[i].objective,
      this.modelData[i].name,
      this.modelData[i].ID
    );
    this.popupinvstobj = this.modelData[i].objective;
    this.popupmodelName = this.modelData[i].name;
    this.asf.getbenchmarkAllocationData(this.modelData[i].ID);
    this.asf.getBenchmarkComposition(this.modelData[i].ID);
  }

  addModelAllo() {
    // this.addpopuprecord = true;
    this.addnewrec = true;
    // let len=this.modelAllocationData.length ;
    // console.log("len of model allocation data",len);
    // this.modelAlloc = this.modelAllocationData;
    // let len1= this.modelAlloc.length ;
    // console.log("len of model allocation data",len1);
    // this.modelAlloc.push({
    //   checkbox: [{checked: false}],
    //   save:"",
    //   schemeName : "",
    //   temp_name : "",
    //   subtemp: "",
    //   cat: "",
    //   cat_allo: "",
    //   subtemp_all: "",
    //   allocation: "",
    //   created_by: "",
    //   created_at: "",
    //   BA_allocation: "",
    //   BA_Id: "",
    //   BA_schemeId : "",
    //   BA_tempId : "",
    //   benchmarkId : "",
    // })
    // console.log("add_records modelAlloc =",this.modelAlloc);
    this.respFlag = true;
    const obj = {
      checkbox: [{ checked: false }],
      // save:"",
      schemeName: 'PMSProductMaster',
      temp_name: 'Bonds',
      subtemp: '',
      cat: '',
      cat_allo: '',
      subtemp_all: '',
      allocation: '',
      created_by: '',
      created_at: '',
      BA_allocation: '',
      BA_Id: '',
      BA_schemeId: '',
      BA_tempId: '',
      benchmarkId: '',
      tc_Id: '',
    };
    this.modelAllocationData.push(obj);
    let l = this.modelAllocationData.length - 1;
    this.editmodelAllocation(l);
    console.log('ADD = ', this.modelAllocationData, l);
  }

  editmodelAllocation(i) {
    this.editpopup = true;
    this.rcd = i;
    console.log(
      'In edit popup for record = ',
      i,
      this.modelAllocationData.length,
      this.editpopup
    );
  }

  // OnkeyupSrno(i,event)
  // {
  //   this.data[i].srno = event.target.value;
  //   console.log("In on keyup for srno = ",this.data[i].srno);
  // }
  OnkeyupCatAllo(i, event) {
    this.modelAllocationData[i].cat_allo = event.target.value;
    console.log(
      'In on keyup for cat_allo = ',
      this.modelAllocationData[i].cat_allo
    );
  }
  OnkeyupSubtmp(i, event) {
    this.modelAllocationData[i].subtemp_all = event.target.value;
    console.log(
      'In on keyup for subtemp_all = ',
      this.modelAllocationData[i].subtemp_all
    );
  }
  OnkeyupAllocation(i, event) {
    this.modelAllocationData[i].allocation = event.target.value;
    console.log(
      'In on keyup for allocation = ',
      this.modelAllocationData[i].allocation
    );
  }
  savePopup(i) {
    this.editpopup = false;
    this.modelAllocationData[i].created_at = this.myDate;
    this.modelAllocationData[i].created_by = this.loggedInUsername;
    //  this.modelAllocationData[i].tc_Id = ;
    //  this.modelAllocationData[i].BA_Id = ;
    console.log(
      ' created at = ',
      this.modelAllocationData[i].created_at,
      this.modelAllocationData[i].created_by
    );
    this.delFlag = false;
  }
  cancelPopup(i) {
    if (this.addnewrec) {
      this.editpopup = false;
      this.modelAllocationData.splice(i, 1);
      this.delFlag = false;
      // this.respFlag = false;
    } else {
      this.editpopup = false;
      this.delFlag = false;
      // this.respFlag = false;
    }
  }
  closepopup() {
    this.allocationFlag = false;
    this.addnewrec = false;
    this.delFlag = false;
    this.sel = null;
    this.modelCompFlag = false;
  }
  changeScheme(i, event) {
    // this.schemeName = event.target.value;
    this.modelAllocationData[i].schemeName = event.target.value;
    console.log('Scheme Name', this.modelAllocationData[i].schemeName);
    for (let i = 0; i < this.schemeArray.length; i++) {
      // console.log("lll",this.schemeArray[i].schemeName,i);
      let schemeNm = event.target.value;
      let sc = this.schemeArray[i].schemeName;
      if (schemeNm == sc) {
        this.schCode = this.schemeArray[i].schemeCode;
        console.log('scheme code ', this.schCode);
        this.asf.getTemplateMaster(this.schCode);
      }
    }
  }
  changeTemplate(i, event) {
    this.modelAllocationData[i].temp_name = event.target.value;
    console.log('Template Name', this.modelAllocationData[i].temp_name);
  }
  changeCategory(event) {
    this.category = event.target.value;
  }
  checkboxSelection(i) {
    this.sel = i;
    console.log('in popup checkbox', this.sel);
    this.checkboxFlag = true;
    this.delFlag = true;
  }
  deleteModelAllo() {}
  append(value) {
    let final_value;
    final_value = value + '.00';
    console.log('final_value', final_value);
    return final_value;
  }
}
