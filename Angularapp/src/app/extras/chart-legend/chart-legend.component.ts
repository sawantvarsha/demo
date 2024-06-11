import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { ChartService } from './../../themeService/chart.service';
import { CommonApiService } from './../../services/common-api.service';

export type legendData = {
  label: string,
  color: string
};
@Component({
  selector: 'app-chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.scss']
})


export class ChartLegendComponent implements OnInit {

  @Input() graphdata: any;
  legendDataArray: legendData[] = [];
  colors: any;

  constructor(public commonApi: CommonApiService, public chartService: ChartService,) { }

  ngOnInit(): void {

    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      if (!!paletteres) {
        let pallete: any = this.chartService.getPallete(paletteres);
        // console.log(pallete);
        this.colors = pallete.colors
        // console.log(this.colors);
        this.setLegendData()
      }
    });
  }
  setLegendData() {
    if (this.graphdata.length !== 0 && this.colors.length !== 0) {
      console.log(this.colors)
      this.graphdata.forEach((element, index) => {
        element.color = this.colors[index];
      });
      console.log(this.graphdata)
    }

    // this.graphdata.forEach((element) => {
    //   this.graphdata.push({
    //     color: '#fff',
    //   });
    // })

  }
}
