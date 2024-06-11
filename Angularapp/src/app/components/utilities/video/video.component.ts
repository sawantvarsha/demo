import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  constructor(private utilitiesApi: UtilitiesService) {}

  isProd = environment.production;

  SelectedTab = 'video';
  VideoInfoSubscription: Subscription;

  VideoDetails: any;
  ServiceResponseVideo: any;
  isActiveVideo = [];
  showVideoDetail = [];
  showMoreInfo = false;

  @Input() expandedVideoCompView: boolean = false;
  @Output() newVideoEvent = new EventEmitter<{ openPopUpVideo: boolean }>();

  ngOnInit(): void {
    for (let i = 0; i < 4; i++) {
      this.isActiveVideo[i] = false;
    }

    this.isActiveVideo[0] = true;

    this.expandedVideoCompView = false;
    this.utilitiesApi.getVideoInfo();
    this.VideoInfoSubscription = this.utilitiesApi.VideoInfo.subscribe(
      (res) => {
        if (res != '') {
          // console.log("Video Info ...", res);
          this.VideoDetails = [];
          this.ServiceResponseVideo = [];
          this.ServiceResponseVideo = res.ExecGenericStoredProcedureResult;
          // console.log("Service response..", this.ServiceResponseVideo);
          try {
            for (
              let i = 0;
              i < Object.keys(this.ServiceResponseVideo).length;
              i++
            ) {
              let mid = this.ServiceResponseVideo[i].Param4.length / 2;
              this.VideoDetails.push({
                VideoName: this.ServiceResponseVideo[i].Param3,
                VideoInformation: this.ServiceResponseVideo[i].Param4.slice(
                  0,
                  mid
                ),
                VideoLink: this.ServiceResponseVideo[i].Param7,
                shortInfo: this.ServiceResponseVideo[i].Param4.slice(mid),
              });
            }
          } catch (ex) {}
        }
      }
    );
  }

  showExpandedView(openPopUpVideo: any) {
    this.expandedVideoCompView = true;
    this.newVideoEvent.emit({ openPopUpVideo });
  }

  accordionVideo(index) {
    // this.isActiveVideo[index] = !this.isActiveVideo[index];

    // for (let i = 0; i < this.VideoDetails.length; i++) {
    //   this.isActiveVideo[i] = !this.isActiveVideo[i];
    // }

    console.log(index);
    for (let i = 0; i < this.VideoDetails.length; i++) {
      if (i === index) {
        this.isActiveVideo[i] = !this.isActiveVideo[i];
        // this.showVideoDetail[i] = !this.showVideoDetail[i];
      }
    }
    console.log(this.isActiveVideo);
  }
}
