import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { LcmSimulationServiceService } from '../lcm-simulation-service.service';
import { environment } from 'src/environments/environment';
import { ChartService } from 'src/app/themeService/chart.service';


@Component({
  selector: 'app-simulation-chart',
  templateUrl: './simulation-chart.component.html',
  styleUrls: ['./simulation-chart.component.scss']
})
export class SimulationChartComponent implements OnInit {
  @Input() blotterData: any[] = [];
  @Input() changePer: any = 0;
  @Input() loaderForWhatIF : boolean = false;
  chartLoaded: boolean = false;
  chart!: any
  ki_list: any[] = []
  mtmlist: any[] = []
  isinlist: any[] = []
  productlist: any[] = []
  worstList: any[] = []
  maxElement: number
  minElement: number
  selected!: number;
  prevElement: number;
  select: boolean = true
  color: string = "#fd4a4e";
  hex1: any = '#fe9b9c'
  hex2: any = '#fd4a4e'


  //cards related 
  timeToMaturityCnt: any;
  asseturl = environment.asseturl;
  colors: any = '';
  tradeCount: any;
  notionalCount: any;
  initialDataArr: any = [];
  MTMCount: any;
  loader: boolean = false;
  changePercent: any;
  copied: boolean = false;





  constructor(private readonly chartService: ChartService, private service: LcmSimulationServiceService) { }

  ngOnInit(): void {
    this.loader = true;
    // console.log('herein child chart', this.blotterData);
    if (this.blotterData.length > 0) {
      this.chartLoaded = true
      // console.log('here in oninit');
      this.setChartProperties()
      this.createChart()
    }
    this.hex1 = this.service.hex1
    this.hex2 = this.service.hex2
    this.color = this.service.inputColor
    this.service.inputColorEvent.subscribe(() => {
      //this.loader = true;
      this.onColorChange(this.service.inputColor);
    })
  }

  ngOnChanges(changes: SimpleChanges) {

    // console.log(changes);
    // console.log('herein child chart onchnage', this.blotterData);
    if (this.blotterData.length > 0 || this.chartLoaded) {
      // console.log('here in onchange');
      this.setChartProperties()
      if (this.chartLoaded) {
        this.setChartInsides()
        this.chart.update()
      } else {
        this.chartLoaded = true
        this.createChart()
      }
    }

    this.calculateInitialData()
    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      //this.loader = true;
      if (!!paletteres) {
        let pallete = this.chartService.getPallete(paletteres);
        this.colors = pallete.colors
        this.service.inputColor = this.colors[4]; 
        this.service.hex1 = this.colors[4]
        this.service.hex2 = this.colors[1]
        if (this.chart) {
          this.chart.data.datasets[0].backgroundColor = this.colors[4]
          this.chart.data.datasets[1].backgroundColor = this.colors[1]
          // this.setComponentProperties()
          this.setChartInsides();
          this.chart.update()
        }
      }
    });




  }
  calculateInitialData() {
    try {
      let Summary = {};
      Summary['Notional_Amt'] = this.blotterData.reduce(function (a, b) { return a + b.Notional_Amt; }, 0)
      Summary['Notional_Amt'] = this.equivalentNotional(Summary['Notional_Amt']);
      let currentMTM = this.blotterData.reduce(function (a, b) { return a + b.MTM; }, 0)
      Summary['ChangePer'] = (this.changePer > 0) ? ('+' + this.changePer.toFixed(2)) : this.changePer.toFixed(2);
      Summary['MTM_Amt'] = this.equivalentNotional(currentMTM);
      Summary['Time2Maturity'] = this.blotterData.reduce(function (a, b) {
        let bCount : any = 0
        if (b.M2Maturity.includes("day(s)")) {
          bCount = 1; // all days less than 30 round off to 1 
        }
        if (b.M2Maturity.includes("month(s)")) {
          bCount = b.M2Maturity.split(' month(s)')[0] // only taken month  
        }
        let abc = parseInt(a) + parseInt(bCount)
        return abc;
      }, 0)
      Summary['TradeCount'] = this.blotterData.length;
      this.initialDataArr["Summary"] = Summary
      if (this.initialDataArr["Summary"]) {
        this.notionalCount = this.initialDataArr.Summary['Notional_Amt'] ?? "";
        this.MTMCount = this.initialDataArr.Summary['MTM_Amt'] ?? "";
        this.tradeCount = this.initialDataArr.Summary['TradeCount']
        this.timeToMaturityCnt = ((this.initialDataArr.Summary['Time2Maturity']) / (this.tradeCount)).toFixed(0)
        this.changePercent = this.initialDataArr.Summary['ChangePer']
      }
      // split(" ")[0]

    } catch (error) {
      // console.log('Error in calculateInitialData', error);

    }
  }

  setChartInsides() {
    try {
      if (this.chart) {
        this.chart.config.data.datasets[0].data = this.ki_list;
        this.chart.config.data.datasets[1].data = this.mtmlist;
      }
      if (this.hex1 === undefined || this.hex2 === undefined) {
        this.chart.config.data.datasets[0].backgroundColor = Array(this.ki_list.length).fill(this.color)
        this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill(this.invertHexColor(this.color))
      } else {
        this.chart.config.data.datasets[0].backgroundColor = Array(this.ki_list.length).fill(this.service.hex1)
        this.chart.config.data.datasets[1].backgroundColor = Array(this.worstList.length).fill(this.service.hex2)
      }
      this.chart.config.data.xLabels = this.isinlist;

    } catch (error) {
      // console.log("Error inside setChartInsides ", error);

    }
  }
  setChartProperties() {
    try {
      // console.log('setting chart properties', this.blotterData);
      let temp_ki_list: any[] = [];
      let temp_mtm_list: any[] = [];
      let temp_isinlist: any[] = [];
      let tempWorstList: any[] = [];
      let tempProductList: any[] = [];
      if (!this.paginationFlag) {
        this.totalPages = Math.ceil(this.blotterData.length / 15);
        this.CurrentStartPage = 1;
        this.CurrentEndPAge = this.totalPages > 15 ? 15 : this.totalPages;
        this.currentPage = 1;
        console.log("this.totalPageBasedOnRecords", this.totalPages);
      }
      let Only15Data = this.blotterData.slice(((this.currentPage - 1) * 15), ((this.currentPage - 1) * 15) + 15);
      Only15Data.forEach((data) => {
        temp_ki_list = [...temp_ki_list, data["KI_Distance"]]
        temp_mtm_list = [...temp_mtm_list, data["MTM"]]
        temp_isinlist = [...temp_isinlist, data["External"]]
        tempProductList = [...tempProductList, data["Product_Name"]]
        tempWorstList = [...tempWorstList, data["Worst"]]
      })

      let maxMtm = Math.max(...temp_mtm_list)
      let maxKi = Math.max(...temp_ki_list)
      this.maxElement = Math.max(maxMtm, maxKi)
      let minMtm = Math.min(...temp_mtm_list)
      let minKi = Math.min(...temp_ki_list)
      this.minElement = Math.min(minMtm, minKi)

      this.ki_list = [...temp_ki_list]
      this.mtmlist = [...temp_mtm_list]
      this.isinlist = [...temp_isinlist]
      this.productlist = [...tempProductList]
      this.worstList = [...tempWorstList]
      this.prevElement = -1


    } catch (error) {
      // console.log('error in setChartProperties', error);

    }
  }
  createChart() {
    try {
      // console.log('creating chart');
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart("simulation-chart", {
        type: 'bar',
        data: {
          xLabels: this.isinlist,
          datasets: [{
            label: 'Protection',
            data: this.ki_list,
            backgroundColor: this.colors ? this.colors[1] : '#990007',
            // backgroundColor: Array(this.ki_list.length).fill('#990007'),
          },
          {
            label: 'MTM',
            data: this.mtmlist,
            backgroundColor: this.colors ? this.colors[4] : '#cb000d',
            // backgroundColor: Array(this.mtmlist.length).fill('#cb000d'),
          }
          ],
        },
        options: {
          layout: {
            padding: 20
          },
          onClick: (event, elements) => {
            this.copied = false;
            if (elements.length > 0) {
              this.selected = elements[0].index;
              if (this.prevElement !== this.selected || this.select === true) {
                this.prevElement = this.selected
                var backgroundcolor1 = Array(this.ki_list.length).fill(this.ColorLuminance(this.service.hex1, -0.5))
                var backgroundcolor2 = Array(this.mtmlist.length).fill(this.ColorLuminance(this.service.hex2, -0.5))
                backgroundcolor1[this.selected] = this.service.hex1
                backgroundcolor2[this.selected] = this.service.hex2

                this.chart.config.data.datasets[0].backgroundColor = [...backgroundcolor1]
                this.chart.config.data.datasets[1].backgroundColor = [...backgroundcolor2]
                this.select = false
                this.chart.update()
                this.copyToClipboard(this.isinlist[this.selected])
              }
              else {
                this.chart.config.data.datasets[0].backgroundColor = Array(this.ki_list.length).fill(this.service.hex1)
                this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill(this.service.hex2)
                this.select = true
                this.chart.update()
              }
            }

          },

          responsive: true,
          maintainAspectRatio: false,
          datasets: {
            bar: {
              barPercentage: 1,
              categoryPercentage: 0.8,
              barThickness: 'flex'
            }
          },
          scales: {
            y: {
              ticks: {
                padding: 20,
                crossAlign: 'near',
                color: 'rgba(149,149,149,255)',
                font: {
                  size: 10
                }
              },
              border: {
                color: 'white',
                dash: [1, 5],
                display: false
              },
              grid: {
                //color: '#f67e81',
                color: '#808080',
                drawTicks: true,
              },
              title: {
                color: 'rgba(109,151,191,255)', //this.chartTiltecolor,//'var(--text)', //'rgba(109,151,191,255)',
                display: true,
                text: 'MTM and Protection',
                font: {
                  size: 20
                }
              },
              beginAtZero: false,
              // min: Math.round(this.minElement - 20),
              // max: Math.round(this.maxElement + 10)
              grace: "10%"
            },
            x: {
              ticks: {
                color: 'rgba(149,149,149,255)',
                font: {
                  size: 13
                },
                stepSize: 1,
              },
              min: 0,
              max: 20,
              title: {
                color: 'rgba(109,151,191,255)', //this.chartTiltecolor,//'var(--text)',// 'rgba(109,151,191,255)',
                display: true,
                text: 'ISIN',
                font: {
                  size: 20
                },

              },
              border: {
                display: false,
                color: 'white',
              },
              grid: {
                drawTicks: true,
              }
            },

          },

          plugins: {
            datalabels: {
              clip: true,
              clamp: true,
              anchor: function (context) {
                return Number(context.dataset.data[context.dataIndex]) >= 0 ? 'end' : 'start';
              },
              align: (context) => {
                return Number(context.dataset.data[context.dataIndex]) >= 0 ? 'end' : 'start';
                //return "end"    
              },
              color: 'rgba(149,149,149,255)',
              font: {
                size: 12
              },

            },
            tooltip: {
              displayColors: false,
              callbacks: {
                title(tooltipItems) {
                  return ""
                },
                label(tooltipItem) {
                  return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`
                },
                beforeLabel(tooltipItem) {
                  var str = `ISIN: ${tooltipItem.label}`;
                  return str;
                },
                afterLabel: (tooltipItem) => {
                  var pname = this.productlist[tooltipItem.dataIndex]
                  var worstUnder = this.worstList[tooltipItem.dataIndex]
                  var str = `Worst Of UnderLying: ${worstUnder}\nProduct Name: ${pname.substring(0, pname.indexOf("Strike"))}\n${pname.substring(pname.indexOf("Strike"), pname.indexOf("Coupon"))}\n${pname.substring(pname.indexOf("Coupon"))}`;
                  return str;
                },
              },
              backgroundColor: '#ffffe7', //'#EE1919',
              bodyColor: 'black'
            },
            legend: {
              align: 'end',
              labels: {
                color: 'rgba(149,149,149,255)',
                usePointStyle: true,
                font: {
                  size: 12
                }
              }
            }
          }

        },


      })
      // this.chart.canvas.addEventListener('wheel', (e: string) => {
      //   this.scroll(e, this.chart)
      // })
      this.loader = false;

    } catch (error) {
      // console.log('error in createChart', error);

    }
  }
  copyToClipboard(text: any) {
    this.copied = true
    navigator.clipboard.writeText(text);
    // setTimeout(() => {
    //   this.copied = false;
    // }, 10000);
  }
  scroll(scroll: any, chart: any) {
    // // console.log(scroll)
    scroll.preventDefault();
    if (scroll.deltaY > 0) {
      if (chart.config.options.scales.x.max >= this.ki_list.length - 1) {
        chart.config.options.scales.x.min = this.ki_list.length - 21;
        chart.config.options.scales.x.max = this.ki_list.length - 1;
      }
      else {
        chart.config.options.scales.x.min += 1;
        chart.config.options.scales.x.max += 1;
      }

    }
    else if (scroll.deltaY < 0) {
      if (chart.config.options.scales.x.min <= 0) {
        chart.config.options.scales.x.min = 0;
        chart.config.options.scales.x.max = 20;
      }
      else {
        chart.config.options.scales.x.min -= 1;
        chart.config.options.scales.x.max -= 1;
      }

    }
    else {

    }
    chart.update()
  }
  ColorLuminance(hex: any, lum: any) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substring(c.length);
    }
    return rgb;
  }
  invertHexColor(hex: string): string {
    return this.adjustColor(hex)
  }
  adjustColor(color: any) {
    var percentage = 20; var brightness = this.calculateBrightness(color);
    if (brightness > 0.5) {
      percentage = -20;
    } else {
      percentage = 20;
    }

    // Convert HEX to RGB
    var r = parseInt(color.substring(1, 3), 16);
    var g = parseInt(color.substring(3, 5), 16);
    var b = parseInt(color.substring(5, 7), 16);

    // Convert RGB to HSL
    var hsl = this.rgbToHsl(r, g, b);
    var adjustedLightness = hsl.l + (percentage / 100);
    adjustedLightness = Math.max(0, Math.min(1, adjustedLightness));
    var adjustedRgb = this.hslToRgb(hsl.h, hsl.s, adjustedLightness);
    var adjustedColor = this.rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);

    return adjustedColor;
  }

  calculateBrightness(color: any) {
    var r = parseInt(color.substring(1, 3), 16);
    var g = parseInt(color.substring(3, 5), 16);
    var b = parseInt(color.substring(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  }

  rgbToHsl(r: any, g: any, b: any) {
    r /= 255;
    g /= 255;
    b /= 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h: any, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h = h / 6;
    }

    return { h: h, s: s, l: l };
  }

  // Convert HSL to RGB
  hslToRgb(h: any, s: any, l: any) {
    var r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {

      function hueToRgb(p: any, q: any, t: any) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;

      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  // Convert RGB to HEX
  rgbToHex(r: any, g: any, b: any) {
    var hexR = r.toString(16).padStart(2, '0');
    var hexG = g.toString(16).padStart(2, '0');
    var hexB = b.toString(16).padStart(2, '0');
    return '#' + hexR + hexG + hexB;
  }

  equivalentNotional(num: any) {
    try {
      const map = [
        { suffix: 'T', threshold: 1e12 },
        { suffix: 'B', threshold: 1e9 },
        { suffix: 'M', threshold: 1e6 },
        { suffix: 'K', threshold: 1e3 },
        { suffix: '', threshold: 1 },
      ];
      const MatchedNum = map.find((x) => Math.abs(num) >= x.threshold);
      if (MatchedNum) {
        const formatted = (num / MatchedNum.threshold).toFixed(2) + MatchedNum.suffix;
        return formatted;
      }
      return num;
    } catch (error) {
      // console.log(error);
    }
  }

  onColorChange(value: any) {
    this.service.inputColor = value;
    if (this.chart) {
      this.chart.config.data.datasets[0].backgroundColor = Array(this.ki_list.length).fill(value)
      this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill(this.invertHexColor(value))
      this.chart.update();
    }
    this.service.hex1 = value
    this.service.hex2 = this.invertHexColor(value)
  }
  totalPages: number;
  currentPage = 1;
  CurrentStartPage = 1;
  CurrentEndPAge = 20
  paginationFlag: boolean = false;

  changePage(page: number): void {
    this.paginationFlag = true
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      if (this.currentPage > this.CurrentEndPAge) {
        if (this.CurrentEndPAge + 15 <= this.totalPages) {
          if (this.currentPage + 14 <= this.totalPages) {
            this.CurrentStartPage = this.currentPage;
            this.CurrentEndPAge = this.currentPage + 14;
          } else {
            this.CurrentStartPage = this.currentPage;
            this.CurrentEndPAge = this.totalPages;
          }
        } else if (this.CurrentEndPAge + 15 > this.totalPages && this.CurrentEndPAge < this.totalPages) {
          this.CurrentStartPage = this.currentPage;
          this.CurrentEndPAge = this.totalPages;
        }
        if (this.CurrentStartPage == this.CurrentEndPAge) {
          this.CurrentStartPage = this.CurrentEndPAge - 14
        }
      } else if (this.currentPage < this.CurrentStartPage) {
        if (this.CurrentStartPage - 20 >= 0) {
          if (this.currentPage - 19 > 0) {
            this.CurrentEndPAge = this.currentPage;
            this.CurrentStartPage = this.currentPage - 15;
          }
          else {
            this.CurrentEndPAge = 15;
            this.CurrentStartPage = 1;
          }
        } else if (this.CurrentStartPage - 15 < 0 && this.CurrentEndPAge > 0) {
          this.CurrentEndPAge = 15;
          this.CurrentStartPage = 1;
        }
      }
      
      this.setChartProperties()
      this.setChartInsides()
      this.chart.update();
      this.paginationFlag = false
    }
  }

  changePageRange(changeTo: string): void {

    if (changeTo == 'prev') {
      if (this.CurrentStartPage - 15 >= 0) {
        this.CurrentEndPAge = this.CurrentStartPage - 1;
        this.CurrentStartPage = this.CurrentStartPage - 15;
      } else if (this.CurrentStartPage - 15 < 0 && this.CurrentEndPAge > 0) {
        this.CurrentEndPAge = 15;
        this.CurrentStartPage = 1;
      }
    } else {
      if (this.CurrentEndPAge + 15 <= this.totalPages) {
        this.CurrentStartPage = this.CurrentEndPAge + 1;
        this.CurrentEndPAge = this.CurrentEndPAge + 15;
      } else if (this.CurrentEndPAge + 15 > this.totalPages && this.CurrentEndPAge < this.totalPages) {
        this.CurrentStartPage = this.CurrentEndPAge + 1;
        this.CurrentEndPAge = this.totalPages;
      }
    }

  }
  get pages(): number[] {
    const arrayRange = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (value, index) => Number(start + index * step)
      );
    let range = arrayRange(this.CurrentStartPage, this.CurrentEndPAge, 1);
    // return Array.from({ length: this.CurrentEndPAge - this.CurrentStartPage + 1 }, (_, i = this.CurrentStartPage) => i + 1);
    return range;
  }

}



