import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from 'src/app/services/customer-api.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit {
  dropDownList = [] as any;
  docUploadDD: string;
  fileUploaded: number[] = [0];
  fileChosen: number[] = [0];
  eventList: any;
  eventCodeList = [] as any;
  fileData: any;
  uploadFileData: any[] = [];
  constructor(public cfs: CustomerApiService) {
    this.fileData = [];
    this.docUploadDD = '';
    this.eventList = [];
  }

  ngOnInit(): void {


    this.cfs.GetCSPEvents().subscribe(res => {
      if (res) {
        // console.log('sharelist:', res);
        this.eventList = res;
        this.dropDownData();
      }
    });

    // this.cfs.GetCSPEventsObservable.subscribe((res: any) => {
    //   if (res) {
    //     // console.log('sharelist:', res);
    //     this.eventList = res;
    //   }
    // });

  }
  uploadDoc() {

  }

  fileSelectionFunction(event: any) {
    // console.log('File selection');


    this.fileUploaded[this.fileUploaded.length - 1] = 1;
    this.fileData.Name = event.target.files[0].name;
    for (let i = 0; i < this.eventList.length; i++) {
      if (this.eventList[i].Event_Name === this.docUploadDD) {
        this.fileData.EventCode = this.eventList[i].Event_Code;
      }
    }


    this.getByteArray(event.target.files[0]).then((byteArray) => {
      let jsonObject: any;
      jsonObject = { ImgData: byteArray };

      // console.log(jsonObject.ImgData)
      this.fileData.FileDetails = jsonObject.ImgData;
    }).catch(err => console.log(err));;

    // console.log(this.fileData.FileDetails);


  }

  getByteArray(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (ev) => {
        let array: any;
        array = ev.target.result;
        const fileByteArray = [];
        // const bytesData: any;
        for (let i = 0; i < new Uint8Array(array).length; i++) {
          fileByteArray.push(new Uint8Array(array)[i]);
        }

        resolve(fileByteArray);  // successful
      };
      fileReader.onerror = reject; // call reject if error
    });
  }

  selectFunctionDD() {

    if (this.fileUploaded[this.fileUploaded.length - 1] === 1) {
      this.fileUploaded.push(0);
      this.fileChosen.push(0);
    }

  }

  dropDownData() {
    try {
      for (let i = 0; i < this.eventList.length; i++) {
        this.dropDownList.push(this.eventList[i].Event_Name);
      }
      this.docUploadDD = this.dropDownList[0];
    }
    catch (error) {

    }
  }

}
