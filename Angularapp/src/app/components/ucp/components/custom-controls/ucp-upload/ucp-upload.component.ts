import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as XLSX from 'xlsx';
import * as JsonToXML from "js2xmlparser";
import { visitAll } from '@angular/compiler';
import { ReplaySubject } from 'rxjs';
@Component({
  selector: 'app-ucp-upload',
  templateUrl: './ucp-upload.component.html',
  styleUrls: ['./ucp-upload.component.css']
})
export class UCPUploadComponent implements OnInit {
  file: File = null;
  @Input() FileType: any;
  @Input() control: any;
  @Input() UCPMode : string;
  @Input() width: any;
  worksheet: any;
  @Output() FileData = new EventEmitter<any>();
  windowObj: Window;
  constructor() { }

  ngOnInit(): void {

  }

  onSelectFile(event) {
    try{
    console.log("Eventtt:: ", event);
      if (event.target.files && event.target.files[0]) {
        this.file = event.target.files[0];
        var ext = this.file.name.split(".")[1];
        var type = this.file.type;
        if(this.FileType=="BYTE"){
          
          this.getByteArray(this.file).subscribe((byteArray:string) => {
            this.control.currentValue = "Extension:"+ ext + "|Type:" + type + "|Data:"+ byteArray;
            this.control.value= "Extension:"+ ext + "|Type:" + type + "|Data:"+  byteArray;
            this.FileData.emit(this.control);
            //this.convertBase64ToPDF(this.control.value)
          })
        }else if(this.FileType=="XML"){
      
          this.file = event.target.files[0];
            this.readExcel();
          
        }
      
      }
    }
    catch(e){
      console.log("Error in onSelectFile :", e)
    }

  }
  readExcel() {
    try{
      let readFile = new FileReader();
      readFile.onload = (e) => {
        console.log(e)
        let storeData:any;
        storeData = readFile.result;
        var data = new Uint8Array(storeData);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        this.worksheet = workbook.Sheets[first_sheet_name];
        let importJSON:any;
        importJSON = XLSX.utils.sheet_to_json(this.worksheet, { raw: false });
        var xml=JsonToXML.parse("XML", JSON.stringify(importJSON));
        this.control.currentValue=xml;
        this.control.value=xml;
        this.FileData.emit(this.control);
      }
      readFile.readAsArrayBuffer(this.file);
    }
    catch(e){
      console.log("Error in readExcel :", e)
    }
  }
  getByteArray(file) {
    // return new Promise(function (resolve, reject) {
    //   let fileReader = new FileReader();
    //   fileReader.readAsArrayBuffer(file);
    //   fileReader.onload = function (ev) {
    //     let array: any;
    //     array = ev.target.result;
    //     const fileByteArray = [];
    //     let bytesData: any;
    //     for (let i = 0; i < new Uint8Array(array).length; i++) {
    //       fileByteArray.push(new Uint8Array(array)[i]);
    //     }
    //     //  return fileByteArray;
    //     resolve(fileByteArray);  // successful
    //   }
    //   fileReader.onerror = reject; // call reject if error
    // })

    try{
    /// Added following code by OnkarE on 26-May-2021 as above code doesn't work for large files. 
      const result = new ReplaySubject<string>(1);
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (event) => result.next(btoa(event.target.result.toString()));
      return result;
    }
    catch(e){
      console.log("Error in getByteArray :", e)
    }
  }


  convertBase64ToPDF(val) {
    /// Function to test uploaded files preview. Added just for confirmation. Function call is commented. 
    try {
      let docData;
      docData = val.split("|")
      console.log("-------", val, docData);
      let result = docData[2].split(":")[1];
      let type = docData[1].split(":")[1];
      let html = '';
      console.log("byteArray is:: ", result);
      // return new Blob([byteArray], {type: 'application/pdf'});
      html += "<html>";
      html += '<body style="margin:0!important">';
      // html += '<embed width="100%" height="100%" src="data:application/pdf;base64,' + result + '" type="application/pdf" />';
      html += '<embed width="100%" height="100%" src="data:' + type + ';base64,' + result + '" type=' + type + ' />';
      html += "</body>";
      html += "</html>";
      
      setTimeout(() => {
        //  const win = window.open('', "_blank");  
        let windowObj = window.open('', 'popup', 'width=900,height=900,');
        windowObj.document.write(html);
      }, 100);

      
    } catch (ex) {
      console.log(ex);
    }
  }

  ////////////Added by Devesh on 19_Jul_2021
  OpenUploadedFile(control){
    try{
  ///Extension:pdf|Type:application/pdf|Data:JVBERi0xL
      debugger;  
      let docData;
      docData = control.value.split("|")
      console.log("-------", control.value, docData);
      let result = docData[2].split(":")[1];
      let type = docData[1].split(":")[1];
     const blob = this.b64toBlob(result, type);
     const blobUrl = URL.createObjectURL(blob);    
     //window.location = blobUrl;
     window.open(blobUrl,control.fieldName, 'width=900,height=900,');
    }
    catch(err){
    }
  }
  b64toBlob (b64Data:string, contentType:string='', sliceSize:number=512)  {
    try{
      const byteCharacters = atob(b64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }
    catch(e){
      console.log("Error in b64toBlob :", e)
    }
  }
}
