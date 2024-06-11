import { Component, OnInit } from '@angular/core';

import { ApifunctionsService } from 'src/app/components/dashboard-new/services/apifunctions.service';
import { CommonfunctionsService } from 'src/app/components/dashboard-new/services/commonfunctions.service';

@Component({
  selector: 'app-access-videos-card',
  templateUrl: './access-videos-card.component.html',
  styleUrls: ['./access-videos-card.component.scss']
})
export class AccessVideosCardComponent implements OnInit {
  flag = false;
  nflag = true;
  Video_popup: Boolean = false;
  currentTab: number = 1;
  videoAndDocList: any = [];
  videoList: any[] = [];
  imgResourcePath: any;
  videoPath: any;

  constructor(public apifunctions: ApifunctionsService, public commonfunctions: CommonfunctionsService) { }

  ngOnInit(): void {
    this.getVideos();
  }

  toggleDisplayDiv(tab: number) {
    this.currentTab = tab
    console.log("Flipped");
  }

  toggleVideoPopup(name: any) {
    this.videoPath = this.apifunctions.getVideoAndDocsPath(name);
    this.Video_popup = true;
    console.log('video path', this.videoPath);
  }

  closeVideoPopup() {
    this.Video_popup = false;
  }

  getVideos() {
    try {
      this.videoAndDocList = this.apifunctions.getVideoAndDocs((this.commonfunctions.getLoggedInUserName()),"");
      console.log('getList', this.videoAndDocList);
      this.videoAndDocList?.forEach((res: any) => {
        if ((res.Extension).toUpperCase() === 'MP4' || (res.Extension).toUpperCase() === 'MOV' || (res.Extension).toUpperCase() === 'WMV' || (res.Extension).toUpperCase() === 'AVI') {
          this.videoList.push(res.Document_Name);
        }
      });
      console.log('getVideos', this.videoList);
      
    } catch (error) {

    }
  }
}
