import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Injectable({
  providedIn: 'root',
})
export class ModelsetupApiService {
  interfaceURL = environment.interfaceURL;

  public benchmarkmasterData = new BehaviorSubject<any>([]);
  benchmarkmasterDataObserver = this.benchmarkmasterData;

  GetInvestmentObjective = new BehaviorSubject([]);
  GetInvestmentObjectiveObserver = this.GetInvestmentObjective.asObservable();

  deleteBenchmark = new BehaviorSubject('');
  deleteBenchmarkObserver = this.deleteBenchmark.asObservable();

  insertBenchmark = new BehaviorSubject('');
  insertBenchmarkObserver = this.insertBenchmark.asObservable();

  updateBenchmark = new BehaviorSubject('');
  updateBenchmarkObserver = this.updateBenchmark.asObservable();

  benchmarkMaster = new BehaviorSubject('');
  benchmarkMasterObserver = this.benchmarkMaster.asObservable();
  benchmarkAllocation = new BehaviorSubject([]);
  benchmarkAllocationObserver = this.benchmarkAllocation.asObservable();
  schemeCode = new BehaviorSubject('');
  schemeCodeObserver = this.schemeCode.asObservable();
  templateMaster = new BehaviorSubject('');
  templateMasterObserver = this.templateMaster.asObservable();
  benchmarkComposition = new BehaviorSubject([]);
  benchmarkCompositionObserver = this.benchmarkComposition.asObservable();
  deleteRecord = new BehaviorSubject('');
  deleteRecordObserver = this.deleteRecord.asObservable();
  saveBusinessAllocation = new BehaviorSubject('');
  saveBusinessAllocationObserver = this.saveBusinessAllocation.asObservable();
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(public http: HttpClient) {}

  getModelSetupData() {
    const webMethod = this.interfaceURL + 'GetBenchmarkMasterData';
    const parameters = {};
    return this.http.get(webMethod, parameters);
  }

  // getInvestmentObjective() {
  //   const webMethod = this.interfaceURL + 'GetInvestmentObjective';
  //   const parameters = {
  //   };
  //   const headerOptions = new HttpHeaders()
  //   .set('Accept', 'application/xml')
  //   .set('Response-Type', 'Text');
  //   return this.http.get(webMethod, parameters, { headers, responseType: 'json' });
  // }

  // getInvestmentObjective() {

  //   const webMethod = this.interfaceURL + 'GetInvestmentObjective';
  //   const that = this;
  //   const parameters = {

  //   };
  //   $.ajax({
  //     async: true,
  //     crossDomain: true,
  //     type: 'GET',
  //     url: webMethod,
  //     data: JSON.stringify(parameters),
  //     contentType: 'application/json; charset=utf-8',
  //     dataType: 'json',
  //     headers: {
  //       'Cache-Control': 'no-cache',
  //       'Access-Control-Allow-Origin': '*'
  //     },
  //     success: (data) => {
  //       console.log(data);
  //       xml2js.parseString(data.body.getDataFromUSPCustomFilterResult, (err, result) => {

  //         that.GetInvestmentObjective.next(data);
  //       });

  //     },
  //     error: (error) => {
  //       // console.log(error);
  //     }
  //   });
  //   // return this.CcyPairs;
  // }
  getInvestmentObjective() {
    const webMethod = this.interfaceURL + 'GetInvestmentObjective';
    const parameters = {};
    const that = this;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'GET',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'xml',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        // xml2js.parseString(data);
        // console.log("in service...",data);
        // that.GetInvestmentObjective.next(data);
        console.log(data);
        that.GetInvestmentObjective.next(data);
      },
      error(error) {
        console.log('Error : ' + error);
      },
    });
  }

  deleteBenchmarkMasterData(Benchmark_Id) {
    const webMethod = this.interfaceURL + 'DeltebenchmarkMaster';
    const parameters = {
      Benchmark_Ids: Benchmark_Id,
    };
    const that = this;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        console.log(data);
        that.deleteBenchmark.next(data);
      },
      error(error) {
        console.log('Error : ' + error);
      },
    });
  }

  insertBenchmarkMasterData(
    Benchmark_Code,
    Benchmark_Created_At,
    Benchmark_Created_By,
    Benchmark_Expected_Return,
    Benchmark_Misc1,
    Benchmark_Name
  ) {
    const webMethod = this.interfaceURL + 'Insert_benchmarkMaster';
    const parameters = {
      Benchmark_Code: Benchmark_Code,
      Benchmark_Created_At: Benchmark_Created_At,
      Benchmark_Created_By: Benchmark_Created_By,
      Benchmark_Expected_Return: Benchmark_Expected_Return,
      Benchmark_Misc1: Benchmark_Misc1,
      Benchmark_Name: Benchmark_Name,
    };
    const that = this;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        console.log(data);
        that.insertBenchmark.next(data);
      },
      error(error) {
        console.log('Error : ' + error);
      },
    });
  }

  updateBenchmarkMasterData(
    Benchmark_Code,
    Benchmark_Name,
    Benchmark_Misc1,
    Benchmark_Expected_Return,
    Benchmark_Id
  ) {
    const webMethod = this.interfaceURL + 'UpdatebenchmarkMaster';
    const parameters = {
      Benchmark_Code: Benchmark_Code,
      Benchmark_Name: Benchmark_Name,
      Benchmark_Misc1: Benchmark_Misc1,
      Benchmark_Expected_Return: Benchmark_Expected_Return,
      Benchmark_Id: Benchmark_Id,
    };
    const that = this;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        console.log(data);
        that.updateBenchmark.next(data);
      },
      error(error) {
        console.log('Error : ' + error);
      },
    });
  }

  getBenchmarkMaster() {
    const webMethod = this.interfaceURL + 'getBenchmarkMaster';
    const parameters = {};

    const that = this;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        console.log(data);
        that.benchmarkMaster.next(data);
      },
      error(error) {
        console.log('Error : ' + error);
      },
    });
  }

  // getschemeCode(){
  //   const webMethod =  this.interfaceURL + 'getSchemeCode';
  //   const parameters = {
  //   };

  //   const that = this;
  //   $.ajax({
  //     async: true,
  //     crossDomain: true,
  //     type: 'POST',
  //     url: webMethod,
  //     data: JSON.stringify(parameters),
  //     contentType: 'application/json; charset=utf-8',
  //     dataType: 'xml',
  //     headers: {
  //       'Cache-Control': 'no-cache',
  //       'Access-Control-Allow-Origin': '*'
  //     },
  //     success(data) {
  //       console.log(data);
  //       that.schemeCode.next(data);
  //     },
  //     error(error) {
  //       console.log('Error : ' + error);
  //     }
  //   });
  // }

  getschemeCode() {
    const webMethod = this.interfaceURL + 'getSchemeCode';
    const parameters = {};

    const that = this;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'xml',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        console.log(data);
        that.schemeCode.next(data);
      },
      error(error) {
        console.log('Error : ' + error);
      },
    });
  }

  getbenchmarkAllocationData(I_Benchmark_Id) {
    const webMethod = this.interfaceURL + 'getbenchmarkAllocationData';
    const parameters = {
      I_Benchmark_Id: I_Benchmark_Id,
    };
    const that = this;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        console.log(data);
        that.benchmarkAllocation.next(data);
      },
      error(error) {
        console.log('Error : ' + error);
        that.benchmarkAllocation.next([]);
      },
    });
  }

  // getTemplateMaster(SchemeCode){
  //   const webMethod =  this.interfaceURL + 'getTemplateMaster';
  //   const parameters = {
  //     SchemeCode : SchemeCode
  //   };
  //   console.log("parameters",parameters);
  //   const that = this;
  //   $.ajax({
  //     async: true,
  //     crossDomain: true,
  //     type: 'POST',
  //     url: webMethod,
  //     data: JSON.stringify(parameters),
  //     contentType: 'application/json; charset=utf-8',
  //     dataType: 'json',
  //     headers: {
  //       'Cache-Control': 'no-cache',
  //       'Access-Control-Allow-Origin': '*'
  //     },
  //     success(data) {
  //       console.log(data);
  //       that.templateMaster.next(data);
  //     },
  //     error(error) {
  //       console.log('Error : ' + error);
  //     }
  //   });
  // }

  getTemplateMaster(SchemeCode) {
    const webMethod = this.interfaceURL + 'getTemplateMaster';
    const parameters = {
      SchemeCode: SchemeCode,
    };
    console.log('parameters', parameters);
    const that = this;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'xml',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        console.log(data);
        that.templateMaster.next(data);
      },
      error(error) {
        console.log('Error : ' + error);
      },
    });
  }

  // getBenchmarkComposition(BenchmarkId){
  //   const webMethod =  this.interfaceURL + 'getBenchmarkComposition';
  //   const parameters = {
  //     BenchmarkId : BenchmarkId
  //   };
  //   // console.log("parameters",parameters);
  //   const that = this;
  //   $.ajax({
  //     async: true,
  //     crossDomain: true,
  //     type: 'POST',
  //     url: webMethod,
  //     data: JSON.stringify(parameters),
  //     contentType: 'application/json; charset=utf-8',
  //     dataType: 'json',
  //     headers: {
  //       'Cache-Control': 'no-cache',
  //       'Access-Control-Allow-Origin': '*'
  //     },
  //     success(data) {
  //       console.log(data);
  //       that.benchmarkComposition.next(data);
  //     },
  //     error(error) {
  //       console.log('Error : ' + error);
  //     }
  //   });
  // }

  getBenchmarkComposition(BenchmarkId) {
    const webMethod = this.interfaceURL + 'getBenchmarkComposition';
    const parameters = {
      BenchmarkId: BenchmarkId,
    };
    const that = this;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        console.log(data);
        that.benchmarkComposition.next(data);
      },
      error(error) {
        console.log('Error : ' + error);
      },
    });
  }

  delete(BA_Id, TC_Id) {
    const webMethod = this.interfaceURL + 'DeleteRecord';
    const parameters = {
      BA_Id: BA_Id,
      TC_Id: TC_Id,
    };
    // console.log("parameters",parameters);
    const that = this;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        console.log(data);
        that.deleteRecord.next(data);
      },
      error(error) {
        console.log('Error : ' + error);
      },
    });
  }

  saveBusinessAlloction(I_AppMode, userID) {
    const webMethod = this.interfaceURL + 'DB_Save_Business_Allocation';
    const parameters = {
      I_AppMode: I_AppMode,
      userID: userID,
    };
    // console.log("parameters",parameters);
    const that = this;
    $.ajax({
      async: true,
      crossDomain: true,
      type: 'POST',
      url: webMethod,
      data: JSON.stringify(parameters),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      success(data) {
        console.log(data);
        that.saveBusinessAllocation.next(data);
      },
      error(error) {
        console.log('Error : ' + error);
      },
    });
  }
}
