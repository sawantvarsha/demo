import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { EcHomeService } from '../../services/ec-home.service';
import { AppConfig } from 'src/app/services/config.service';
import { environment } from 'src/environments/environment';

const $: any = require('jquery');
@Component({
  selector: 'app-docs-modal',
  templateUrl: './docs-modal.component.html',
  styleUrls: ['./docs-modal.component.scss']
})
export class DocsModalComponent implements OnInit {

  _object = Object
  attachmentType: any;
  miscDDL1Val: any;
  miscDDL2Val: any;
  fileArray: any[] = [];
  fileArray1: any[] = [];
  CountryofDistribution = [];
  commonData: any = [];
  errorMsg = ''
  resMsg = ''
  successMsg: boolean = false
  miscDDL2: Object = {
    "Label": "Country",
    "Options": [],
    "Active": false,
  }
  asseturl = environment.asseturl;
  languageCode: any
  countryCode: any
  pageloadflag = false;
  attachBtn = true

  @Input() showOverlay: boolean = true;
  @Input() tableData: Object[] = [];
  @Input() title: string = "Uploaded/Generated Documents";
  @Input() displayMode: 'ATTACH' | 'VIEW' | 'BOTH' = 'VIEW';
  @Input() attachmentOptions: IDDLOption[] = [
                                        {key: "Indicative_Termsheet", value:"Termsheet"},
                                        {key: "KID", value:"KID"},
                                      ];
  @Input() labelsData: ILabel[] = [];

  @Input() miscDDL1: Object = {
    "Label": "Language",
    "Options": [
      { 'Key': 'Czech', 'Value': 'Czech' },
      { 'Key': 'Czechia', 'Value': 'Czechia' },
      { 'Key': 'Dutch', 'Value': 'Dutch' },
      { 'Key': 'English', 'Value': 'English' },
      { 'Key': 'Finnish', 'Value': 'Finnish' },
      { 'Key': 'French', 'Value': 'French' },
      { 'Key': 'Galician', 'Value': 'Galician' },
      { 'Key': 'German', 'Value': 'German' },
      { 'Key': 'Greece', 'Value': 'Greece' },
      { 'Key': 'Greek', 'Value': 'Greek' },
      { 'Key': 'Guernsey', 'Value': 'Guernsey' },
      { 'Key': 'Hungarian', 'Value': 'Hungarian' },
      { 'Key': 'Italian', 'Value': 'Italian' },
      { 'Key': 'Italy', 'Value': 'Italy' },
      { 'Key': 'Norwegian', 'Value': 'Norwegian' },
      { 'Key': 'Polish', 'Value': 'Polish' },
      { 'Key': 'Portuguese', 'Value': 'Portuguese' },
      { 'Key': 'Russian', 'Value': 'Russian' },
      { 'Key': 'Spanish', 'Value': 'Spanish' },
      { 'Key': 'Swedish', 'Value': 'Swedish' },
    ],
    "Active": false,
  }

  // @Input() miscDDL2: Object = {
  //   "Label": "Country",
  //   "Options": [
  //     { key: "India", value: "India" },
  //     { key: "UK", value: "UK" },
  //   ],
  //   "Active": false,
  // }



  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(public homeApiService: EcHomeService) {
    // console.log("ctor tableData >> ",this.tableData);
  }

  ngOnInit() {

    setTimeout(async () => {
      if (this.displayMode == 'ATTACH') {
        this.commonData = await this.homeApiService.GetCommonDataEuroConnect("EQC_Europe");
        this.CountryofDistribution = this.parseCommonDatatoJSONArr('CountryofDistribution');
        this.miscDDL2['Options'] = this.CountryofDistribution;
        this.pageloadflag = true;
        await this.populateFilesArray(this.labelsData[2].value);
      }
      if(this.displayMode == 'BOTH'){
        this.pageloadflag = true;
        await this.populateFilesArray(this.labelsData[2].value);
      }
    })


  }

  checkIfCallable(arg: any): boolean{
    try {
      return (arg && typeof arg === 'function');
    } catch (error) {
      console.log(error);
    }
  }

  setAttachmentType(event: any){
    try {
      if(event.target.value === "KID"){
        this.miscDDL1["Active"] = true;
        this.miscDDL2["Active"] = true;
      } else {
        this.miscDDL1["Active"] = false;
        this.miscDDL2["Active"] = false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  setTableWidgetHeight(){
    try {
      switch (this.displayMode) {
        case "ATTACH":
          return '55%';
        case "VIEW":
          return '88%';
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }
  // code changes done by AdilP || FIN1EURINT-242
  async SaveFiles(event: any){
    try {
      this.errorMsg = '';
      //this.successMsg='';
      let eventCode = ''
      const attachedFiles: any[] = event?.target?.files || [];
      this.fileArray = this.fileArray.length > 0 ? this.fileArray : [];
      
      if (!attachedFiles.length) {
        this.errorMsg = "Please select a file to upload"
        return;
      }
      let doctype: any = document.querySelector('#docType');
      
      if (!this.attachmentType) {
        this.errorMsg = "Select document type first"
        let doc_file: HTMLInputElement = document.querySelector("#docFile");
        doc_file.value = '';
        return;
      }
      if (this.attachmentType.toString() == "KID") {
        eventCode = "KID"
        if  (!(this.languageCode || this.countryCode)) {
          this.languageCode = 'English'
          this.countryCode = 'United Kingdom of Great Britain and Northern Ireland'
        }
      } else if (this.attachmentType.toString() == "Indicative_Termsheet") {
        eventCode = "Indicative_Termsheet"
        this.languageCode = ''
        this.countryCode = ''
      }


      for (let i = 0; i < attachedFiles.length; i++) {
        const currFile = attachedFiles[0];
        await this.ReadFileBase64(currFile).then(async (data: FileReader) => {
          const obj = {
            "FileName": currFile.name,
            "QuoteRequestID": this.labelsData[2].value,
            "EventCode": eventCode,
            "ISIN": this.labelsData[3].value,
            "DGI_Image": data.result.toString().split(",")[1],
            "DocType": currFile.name.split(".").pop().toString().toUpperCase(),
            "DocumentLanguage": this.languageCode ? this.languageCode.toString() : "",
            "DocumentCountry": this.countryCode ? this.countryCode.toString() : ""
          }

       
          
          this.fileArray.push(obj);

        });
        
      }
      this.attachBtn = false;
      //this.successMsg= "Document attached to queue. Click on Attach Document to upload."
    } catch (error) {
      console.log(error);
    }
  }

  ReadFileBase64(file: File){
    return new Promise((resolve, reject) => {
      try {
        const fileReader: FileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = data => resolve(fileReader);
        fileReader.onerror = err => reject(err);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  }

  closeModal(){
    try {
      this.errorMsg = ''
      this.closeModalEvent.emit(false);
    } catch (error) {
      console.log(error);
    }
  }

  async UploadDocs($event: any){
    try {
      this.errorMsg = ''
      //this.successMsg = ''
      this.pageloadflag = true;
      if (this.fileArray && this.fileArray.length > 0)
      for (let i = 0; i < this.fileArray.length; i++) {
        const element = this.fileArray[i];
        const res: any = await this.homeApiService.addAttachment(element);
        if (res && res.Status == "success") {
          
            this.successMsg = true;
            this.resMsg = "Document Attached Successfully"
            
            let doc_file: any = document.querySelector("#docFile");
            doc_file.value = ''
            
            await this.populateFilesArray(this.labelsData[2].value);
          } else {
            this.successMsg = true;
            this.errorMsg = "Error"
            this.resMsg = "Error in Uploading Document"
            this.pageloadflag= false;
          }
        }
      // else {
      //   this.successMsg = true;
      //   this.errorMsg = "Error"
      //   this.resMsg = "Error in Uploading document"
      //   this.pageloadflag= false;
      // }
      this.attachBtn = true;
    } catch (error) {
      console.log(error);
    }
  }
  parseCommonDatatoJSONArr(Field_Name: any) {
    let commonDataJSONArr: any = [];
    const index = this.commonData.findIndex(obj => obj.Field_Name === Field_Name);

    const displayTxt = (this.commonData[index].Display_Text).split(',');
    const saveTxt = (this.commonData[index].Save_text).split(',');
    if (displayTxt && displayTxt.length > 0) {
      for (let i = 0; i < displayTxt.length; i++) {
        if (displayTxt[i] !== '') {
          commonDataJSONArr.push({ 'Key': displayTxt[i], 'Value': saveTxt[i] === '' ? displayTxt[i] : saveTxt[i] });
        }

      }
    }
    if (Field_Name !== 'CountryofDistribution') {
      commonDataJSONArr.sort((a, b) => (a.Key > b.Key) ? 1 : -1);
    }
    return commonDataJSONArr;
  }
  downloadAttachment(idx, targetFile) {
    // added by AdilP || FIN1EURINT-242
    let AllFiles = []
    if(targetFile == "DB"){
      AllFiles = this.fileArray1;
    }else{
      AllFiles= this.fileArray;
    }
    // //console.log(res);
    if (AllFiles !== null && AllFiles !== undefined && AllFiles.length > 0) {
      // //console.log(this.ViewAttachmentRes);
      // const bytes = new Uint8Array(this.fileArray[idx].DocumentByteFile);
      // const blob = new Blob([bytes], { type: 'application/doc' }); //DocumentFileType
      // const link = document.createElement('a');
      // link.href = window.URL.createObjectURL(blob);
      // link.download = this.fileArray[idx].DocumentName;
      // link.click();

      const downloadLink = document.createElement('a');
      let fileName = AllFiles[idx].FileName;
      downloadLink.href = 'data:application/octet-stream;base64,' + AllFiles[idx].DGI_Image;
      downloadLink.download = fileName;
      downloadLink.click();
    }
    else {
      //this.attachmentErrorMsg = 'Attachment not available. Please try again later.';

    }
  }
  async populateFilesArray(DealNo) {
    try {
      const res: any = await this.homeApiService.ViewTermsheet(DealNo, "IndicativeTermsheet");
      const res1: any = await this.homeApiService.ViewTermsheet(DealNo, "KID");
      const thisRef = this;
      this.fileArray1 =[]
      if (res?.length) {
        res.forEach((item: any) => {
          if (item.Status.toString().toUpperCase() === 'SUCCESS') {

            const obj = {
              "FileName": item["Document_Output_Path"],
              "QuoteRequestID": this.labelsData[2].value,
              "EventCode": "IndicativeTermsheet",
              "ISIN": this.labelsData[3].value,
              "DGI_Image": item.DGI_Image,
              "DocType": '',
              "DocumentLanguage": item["DocumentLanguage"],
              "DocumentCountry": item["DocumentCountry"]
            }
            thisRef.fileArray1.push(obj);
          }

        })
      }
      if (res1?.length) {
        res1.forEach((item: any) => {
          if (item.Status.toString().toUpperCase() === 'SUCCESS') {

            const obj = {
              "FileName": item["Document_Output_Path"],
              "QuoteRequestID": this.labelsData[2].value,
              "EventCode": "KID",
              "ISIN": this.labelsData[3].value,
              "DGI_Image": item.DGI_Image,
              "DocType": '',
              "DocumentLanguage": item["DocumentLanguage"],
              "DocumentCountry": item["DocumentCountry"]
            }
            thisRef.fileArray1.push(obj);
          }

        })
      }
      this.pageloadflag = false;
      
    } catch (error) {
      console.log("error ", error)
    }
  }

  removeAttachment(idx) {
    if (this.fileArray !== null && this.fileArray !== undefined && this.fileArray.length > 0) {
      this.fileArray.splice(idx, 1);
    }
    let doc_file: any = document.querySelector("#docFile");
    doc_file.value = ''

  }
  toggleSuccessMessage() {
    this.successMsg = false;
  }

}

export interface ILabel {
  title: string,
  value: string
}
export interface IDDLOption {
  key: string,
  value: string
}

