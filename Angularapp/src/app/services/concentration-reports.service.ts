import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConcentrationReportsService {
  interfaceURL = environment.interfaceURL;
  headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }
  // async getConcentrationReports(entityId: any,UserId: any, BlotterCode: any, from: any, to: any, DealFacing: any, WhereClause: any,RowsPerPage: any,PageNo: any, ExcelFlag: any ) {
  //   try{
  //     // const webUrl = 'http://52.163.118.116/FinIQService/RestAPIMPGMaster.svc/fillGridAllTemplateUsingSPGen';
  //     const webUrl = "http://52.172.28.47/finiqservice/RestAPIMPGMaster.svc/fillGridAllTemplateUsingSPGen";
  //     const param = {
  //       entityId,
  //       UserId,
  //       BlotterCode,
  //       from,
  //       to,
  //       DealFacing,
  //       WhereClause,
  //       RowsPerPage,
  //       PageNo,
  //       ExcelFlag
  //     };
  //     // console.log("parameters=",param)
  //       return this.http.post<any>(webUrl, param).toPromise();
  //   }
  //   catch(error){

  //   }
  // }

  getConcentrationReports(
          entityId,
          UserId,
          BlotterCode,
          from,
          to,
          // DealFacing,
          // WhereClause,
          RowsPerPage,
          PageNo,
          // ExcelFlag
  ) {
    try {
      // console.log(this.Login_Id);
      console.log('getConcentrationReports');
      const webMethod = this.interfaceURL + 'fillGridAllTemplateUsingSPGen1';
      const body = {
        entityId: entityId,
        UserId: UserId, // "Nikhilkumar",
        BlotterCode: BlotterCode, //"10097",  10074
        from: from, //"16-Feb-2021",
        to: to, //"16-Feb-2021",
        DealFacing: 'ALL',
        WhereClause: '',
        RowsPerPage: RowsPerPage, //"15",
        PageNo: PageNo, //"1",
        ExcelFlag: '0',
      };
      return this.http.post<any>(webMethod,body);
    } 
    catch (error) {
      console.log(error);
    }
  }


  getBlotterCode(UserId) 
  {
    try 
    {
      // console.log('getBlotterCode1');
      const webMethod = this.interfaceURL + 'getBlotterCode1';
      const body = 
      {
        BCMLevelSpec: "Primary",
        UserId: UserId, // "Nikhilkumar",       
      };
      return this.http.post<any>(webMethod,body);
    } 
    catch (error) 
    {
      console.log(error);
    }
  }  

  getMetaData(BlotterCode)
  {
    try 
    {
      // console.log('getMetaData1');
      const webMethod = this.interfaceURL + 'getMetaData1';
      const body = 
      {
        Blottercode: BlotterCode,        
      };
      console.log("-----------------",body)
      return this.http.post<any>(webMethod,body);
    } 
    catch (error) 
    {
      console.log(error);
    }
  }


}
