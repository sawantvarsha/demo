import { Component } from '@angular/core';
import { MtmAndKiFilterService } from '../mtm-and-ki-filter.service';
import { Chart } from 'chart.js';
import { BIReportsComponent } from '../../bireports.component';
import { MtmAndKiComponent } from '../mtm-and-ki.component';
import { DatePipe } from '@angular/common';
import { ChartService } from 'src/app/themeService/chart.service';
import { ThemeserviceService } from 'src/app/themeService/themeservice.service';
@Component({
  selector: 'app-mtm-and-ki-chart',
  templateUrl: './mtm-and-ki-chart.component.html',
  styleUrls: ['./mtm-and-ki-chart.component.css']
})
export class MtmAndKiChartComponent {
  constructor(private service: MtmAndKiFilterService, private bIReportsComponent: BIReportsComponent, private mtmAndKiComponent: MtmAndKiComponent, private datepipe: DatePipe, private chartService: ChartService, private themeService: ThemeserviceService) {
  }


  ki_list: any[] = []
  mtmlist: any[] = []
  isinlist: any[] = []
  productlist: any[] = []
  worstList: any[] = []
  selected!: number
  select: boolean = true
  clickBackgroundcolor1: string = 'rgba(3,32,53,255)'
  clickBackgroundcolor2: string = 'rgba(3,32,53,255)'
  selectedOption: string = 'Ascending'
  selectedOption1: string = 'Trace_KI_Distance'
  selectedExternal: string = ''
  prevElement!: number
  showDiv: any = 'false'
  color: string = "#fd4a4e";
  hex1: any = '#fe9b9c'
  hex2: any = '#fd4a4e'
  maxElement: number
  minElement: number
  inputString: string
  userInputDisplay: boolean = false
  colors: any; // added by AdilP

  //chart inside colors || added by AdilP
  chartTiltecolor;
  chartDefaultBar1;
  chartDefaultBar2;
  chartTooltipColor;
  curTheme;

  loader: Boolean = true;
  copied: boolean = false;

  sortOptionFiltering() {
    try {
      this.selectedOption = this.service.selectedOption
      this.selectedOption1 = this.service.selectedOption1
      this.selectedExternal = this.service.selectedExternal
      this.setComponentProperties()
      this.setChartProperties()
      this.chart?.update()
    } catch (error) {
      console.log("error in sortOptionFiltering", error);

    }
  }

  filterData(value: any) {
    this.service.selectedOption = value
    this.selectedOption = this.service.selectedOption
    this.setComponentProperties()
    this.setChartProperties()
    this.chart?.update()
  }

  filterData1(value: any) {
    this.service.selectedOption1 = value
    this.selectedOption1 = this.service.selectedOption1
    this.setComponentProperties()
    this.setChartProperties()
    this.chart.update()

  }
  display() {
    if (this.showDiv == 'false') {
      this.showDiv = 'true'
    } else {
      this.showDiv = 'false'
    }
  }
  getColorThemeColors() {
    try {
      this.curTheme = sessionStorage.getItem('activeTheme');
      if (this.curTheme == 'dark') {
        this.chartTiltecolor = 'black';
        this.chartDefaultBar1 = 'black';
        this.chartDefaultBar2 = 'black';
        this.chartTooltipColor = 'black';
      } else {
        this.chartTiltecolor = 'red';
        this.chartDefaultBar1 = 'red';
        this.chartDefaultBar2 = 'red';
        this.chartTooltipColor = 'red';
      }
    } catch (error) {
      console.log(error);
    }
  }

  pinChart(e: any, title) {

    this.pinChart1(title)
    this.userInputDisplay = false
  }

  pinChart1(title) {
    this.mtmAndKiComponent.pinned()
    //e.preventDefault();

    const current_min_KI = this.service.current_min_KI;
    const current_max_KI = this.service.current_max_KI;
    const current_min_MTM = this.service.current_min_MTM
    const current_max_MTM = this.service.current_max_MTM;
    const selectedUnderlying = this.service.selectedUnderlying;
    const selectedCurrency = this.service.selectedCurrency
    const selectedPayOff = this.service.selectedPayOff;
    const selectedCustomer = this.service.selectedCustomer;
    const selectedOption = this.service.selectedOption
    const selectedOption1 = this.service.selectedOption1

    const bg1 = this.chart.data.datasets[0].backgroundColor
    const bg2 = this.chart.data.datasets[1].backgroundColor

    const data = this.chart.config._config.data.datasets[0].data;
    const data1 = this.chart.config._config.data.datasets[1].data;
    const productlist = this.productlist;
    const worstList = this.worstList;
    const type = this.chart.config._config.type;
    const labels = this.chart.config._config.data.xLabels;
    const options = this.chart.config._config.options;
    const backgroundColor = this.chart.config.data.datasets[0].backgroundColor;
    const backgroundColor1 = this.chart.config.data.datasets[1].backgroundColor;
    const borderWidth = 1;
    const borderColor = 'black';
    const id = 3
    const currentTimezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const currentTimezoneOffsetInMilliseconds = currentTimezoneOffsetInMinutes * 60 * 1000;
    const date = this.datepipe.transform(new Date(new Date().toLocaleString()), "dd MMM yyyy h:mm a")
    const inputString = this.inputString

    const chart = {
      data, data1, productlist, worstList, labels, backgroundColor, backgroundColor1, borderColor, borderWidth, title, id, current_min_KI, current_max_KI, current_min_MTM, current_max_MTM, selectedUnderlying,
      selectedCurrency, selectedPayOff, selectedCustomer, bg1, bg2, selectedOption, selectedOption1, date, inputString
    }

    //debugger
    //console.log(this.chartGraph);
    //this.applicationService.setChart(data,type,options);
    this.bIReportsComponent.setChart({ type, chart });
  }


  ngOnInit(): void {
    this.selectedOption = this.service.selectedOption
    this.selectedOption1 = this.service.selectedOption1
    this.color = this.service.inputColor
    //this.getColorThemeColors();
    this.setComponentProperties()
    //this.createChart()

    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      //this.loader = true;
      if (!!paletteres) {
        let pallete = this.chartService.getPallete(paletteres);
        this.colors = pallete.colors
        this.hex1 = this.colors[4]
        this.hex2 = this.colors[1]
        if (this.chart) {
          this.chart.data.datasets[0].backgroundColor = this.colors[4]
          this.chart.data.datasets[1].backgroundColor = this.colors[1]
          // this.setComponentProperties()
          this.setChartProperties();
          this.chart?.update()
        }
      }
    });
    if (this.chart) {
      this.chart.config.data.datasets[0].backgroundColor = Array(this.ki_list.length).fill(this.service.hex1)
      this.chart.config.data.datasets[1].backgroundColor = Array(this.worstList.length).fill(this.service.hex2)
      this.hex1 = this.colors[4] // '#39FF14'
      this.hex2 = this.colors[1]// '#FF0099'
      this.service.setBg1(this.chart.data.datasets[0].backgroundColor);
      this.service.setBg2(this.chart.data.datasets[1].backgroundColor);

    }


    this.service.dataReceived.subscribe(() => {
      this.hex1 = this.colors[4] //'#ec0000'
      this.hex2 = this.colors[1]//'#c76464'
      this.setComponentProperties()
      this.createChart();
      // this.setChartProperties();
      // this.chart.update()
    })

    this.service.dataFiltered.subscribe(() => {
      //this.loader = true;
      this.setComponentProperties()
      this.setChartProperties()
      this.chart?.update()
    })

    this.service.filterSelectedEvent.subscribe(() => {
      //this.loader = true;
      this.setComponentProperties()
      this.setChartProperties()
      this.chart.update()
    })

    //added by Adil
    this.service.sendStateDataEvent.subscribe(() => {
      //this.loader = true;
      this.setComponentProperties()
      this.setChartProperties()
      this.chart?.update()
    })


    this.service.filterSelectedEvent.subscribe(() => {
      //this.loader = true;
      this.setComponentProperties()
      this.setChartProperties()
      this.chart?.update()
    })

    this.service.filterEvent.subscribe(() => {
      //this.loader = true;
      this.sortOptionFiltering();
    })
    this.service.inputColorEvent.subscribe(() => {
      //this.loader = true;
      this.onColorChange(this.service.inputColor);
    })

    this.service.ClientFilterEvent.subscribe(() => {
      //this.loader = true;
      this.setComponentProperties()
      this.setChartProperties()
      this.chart?.update()
    })

    this.service.bg1$.subscribe(value => {
      //console.log(value);
      if (this.chart) {
        this.chart.data.datasets[0].backgroundColor = value
        this.color = value[0]
        this.hex1 = value[0]
        this.chart?.update()
      }
    })

    this.service.bg2$.subscribe(value => {
      // console.log(value);
      if (this.chart) {
        this.chart.data.datasets[1].backgroundColor = value
        this.hex2 = value[0]
        this.chart.update()
      }
    })

    this.chart?.canvas.addEventListener('wheel', (e: string) => {
      this.scroll(e, this.chart)
    })

    // this.service.sendStateDataEvent.subscribe(()=>{
    //   this.selectedOption=this.service.selectedOption
    //   this.selectedOption1=this.service.selectedOption1

    //   this.setComponentProperties()
    //   this.setChartProperties()
    //   this.chart.update()
    // })
    // this.loader= false;

  }
  //Added by AdilP
  ngOnDestroy(): void {
    this.chart?.destroy();
  }
  setComponentProperties() {
    this.data = this.service.getData()

    let temp_ki_list: any[] = [];
    let temp_mtm_list: any[] = [];
    let temp_isinlist: any[] = [];
    let tempWorstList: any[] = [];
    let tempProductList: any[] = []

    if (!this.paginationFlag) {
      if (this.service.selectedOption === 'Ascending') {

        if (this.service.selectedOption1 === 'WorstOfUnderlying' || this.service.selectedOption1 === 'ISIN') {
          this.data.sort((a: any, b: any) => {
            var m: string = a[this.service.selectedOption1]
            var n: string = b[this.service.selectedOption1]
            // console.log(m+""+n)
            return (m.localeCompare(n))
          })
        }
        else {
          this.data.sort((a: any, b: any) => {
            return a[this.service.selectedOption1] - b[this.service.selectedOption1]
          })
        }
      }
      else {

        if (this.service.selectedOption1 === 'WorstOfUnderlying' || this.service.selectedOption1 === 'ISIN') {
          this.data.sort((a: any, b: any) => {
            var m: string = a[this.service.selectedOption1]
            var n: string = b[this.service.selectedOption1]
            return (n.localeCompare(m))
          })
        }
        else {
          this.data.sort((a: any, b: any) => {
            return b[this.service.selectedOption1] - a[this.service.selectedOption1]
          })
        }
      }
      if (this.selectedExternal != "") {
        const externalToSearch = this.selectedExternal.split(',').map(arg => arg.trim().toLowerCase());
        this.data = this.data.filter((s: any) => externalToSearch.some(exteranl_ref => (s.ISIN.includes(exteranl_ref))))
      }
      this.totalPages = Math.ceil(this.data.length / 30);
      this.CurrentStartPage = 1;
      this.CurrentEndPAge = this.totalPages > 20 ? 20 : this.totalPages;
      this.currentPage = 1;


    }
    let Only20Data = this.data.slice(((this.currentPage - 1) * 20), ((this.currentPage - 1) * 20) + 20);
    Only20Data.forEach((data) => {
      // temp_ki_list = [...temp_ki_list, data["Trace_KI_Distance"]]
      // temp_mtm_list = [...temp_mtm_list, data["MTM_Premium"]]
      // temp_isinlist = [...temp_isinlist, data["ISIN"]]
      // tempProductList = [...tempProductList, data["Product_Name"]]
      // tempWorstList = [...tempWorstList, data["WorstOfUnderlying"]]
      temp_ki_list.push(data["Trace_KI_Distance"]);
      temp_mtm_list.push(data["MTM_Premium"]);
      temp_isinlist.push(data["ISIN"]);
      tempProductList.push(data["Product_Name"]);
      tempWorstList.push(data["WorstOfUnderlying"]);
    })

    let maxMtm = Math.max(...temp_mtm_list)
    let maxKi = Math.max(...temp_ki_list)
    this.maxElement = Math.max(maxMtm, maxKi)
    let minMtm = Math.min(...temp_mtm_list)
    let minKi = Math.min(...temp_ki_list)
    this.minElement = Math.min(minMtm, minKi)

    this.ki_list = temp_ki_list
    this.mtmlist = temp_mtm_list
    this.isinlist = temp_isinlist
    this.productlist = tempProductList
    this.worstList = tempWorstList
    this.prevElement = -1



  }

  backgroundcolor1: string[] = []
  backgroundcolor2: string[] = []
  labels!: any
  chart!: any
  data!: any[]


  createChart() {
    try {
      let chartStatus = Chart.getChart("mtm-and-ki-chart"); // <canvas> id
      if (chartStatus != undefined) {
        this.chart = Chart.getChart("mtm-and-ki-chart");
        this.chart.destroy();
      }
      this.chart = new Chart("mtm-and-ki-chart", {
        type: 'bar',
        data: {
          xLabels: this.isinlist,
          datasets: [{
            label: 'KI Distance(%)',
            data: this.ki_list,
            backgroundColor: this.colors ? this.colors[1] : this.chartDefaultBar1//'#990007',
            // backgroundColor: Array(this.ki_list.length).fill('#990007'),
          },
          {
            label: 'MTM(%)',
            data: this.mtmlist,
            backgroundColor: this.colors ? this.colors[4] : this.chartDefaultBar2//'#cb000d',
            // backgroundColor: Array(this.woflist.length).fill('#cb000d'),
          }
          ],
        },
        options: {
          layout: {
            padding: 20
          },
          onClick: (event, elements) => {
            this.copied = false
            if (elements.length > 0) {
              this.selected = elements[0].index;
              if (this.prevElement !== this.selected || this.select === true) {
                this.prevElement = this.selected
                var backgroundcolor1 = Array(this.ki_list.length).fill(this.ColorLuminance(this.hex1, -0.5))
                var backgroundcolor2 = Array(this.mtmlist.length).fill(this.ColorLuminance(this.hex2, -0.5))
                backgroundcolor1[this.selected] = this.hex1
                backgroundcolor2[this.selected] = this.hex2

                this.chart.config.data.datasets[0].backgroundColor = [...backgroundcolor1]
                this.chart.config.data.datasets[1].backgroundColor = [...backgroundcolor2]
                this.select = false
                this.chart.update()
                this.copyToClipboard(this.isinlist[this.selected])
              }
              else {
                this.chart.config.data.datasets[0].backgroundColor = Array(this.ki_list.length).fill(this.hex1)
                this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill(this.hex2)
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
              grace: "5%"
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
                display: true,
                drawTicks: true
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
                  var str = `Worst Of Underlying: ${worstUnder}\nProduct Name: ${pname.substring(0, pname.indexOf("Strike"))}\n${pname.substring(pname.indexOf("Strike"), pname.indexOf("Coupon"))}\n${pname.substring(pname.indexOf("Coupon"))}`;
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
      this.chart?.destroy()
      this.loader = false;
    }
  }

  copyToClipboard(text: any) {
    this.copied = true
    navigator.clipboard.writeText(text);
    // setTimeout(() => {
    //   this.copied = false;
    // }, 1000);
  }

  scroll(scroll: any, chart: any) {
    // console.log(scroll)
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


  setChartProperties() {
    if (this.chart) {
      this.chart.config.data.datasets[0].data = this.ki_list;
      this.chart.config.data.datasets[1].data = this.mtmlist;
      // this.chart.config.data.datasets[0].backgroundColor = Array(this.ki_list.length).fill('rgba(57,114,158,255)')
      // this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill('rgba(37,82,114,255)')
      // this.chart.config.data.datasets[0].backgroundColor = Array(this.ki_list.length).fill(this.hex1)
      // this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill(this.hex2)
      // this.hex1 = '#39FF14'
      // this.hex2 = '#FF0099'
      if (this.hex1 === undefined || this.hex2 === undefined) {
        this.chart.config.data.datasets[0].backgroundColor = Array(this.ki_list.length).fill(this.color)
        this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill(this.invertHexColor(this.color))
        //   this.chart.config.data.datasets[0].backgroundColor = Array(this.ko_list.length).fill(this.service.prevHex1)
        // this.chart.config.data.datasets[1].backgroundColor = Array(this.woflist.length).fill(this.service.prevHex2)
      } else {
        this.chart.config.data.datasets[0].backgroundColor = Array(this.ki_list.length).fill(this.hex1)
        this.chart.config.data.datasets[1].backgroundColor = Array(this.worstList.length).fill(this.hex2)
        // this.chart.config.data.datasets[0].backgroundColor = Array(this.ki_list.length).fill(this.color)
        // this.chart.config.data.datasets[1].backgroundColor = Array(this.woflist.length).fill(this.invertHexColor(this.color))
      }
      // this.service.setBg1(this.chart.data.datasets[0].backgroundColor);
      // this.service.setBg2(this.chart.data.datasets[1].backgroundColor);
      this.chart.config.data.xLabels = this.isinlist;
    }
    this.loader = false;

  }

  //===================================================

  adjustColor(color: any) {
    var percentage = 20; // Default percentage value for adjustment

    // Determine whether to lighten or darken the color based on its brightness
    var brightness = this.calculateBrightness(color);
    if (brightness > 0.5) {
      // Darken the light color by 20%
      percentage = -20;
    } else {
      // Lighten the dark color by 20%
      percentage = 20;
    }

    // Convert HEX to RGB
    var r = parseInt(color.substring(1, 3), 16);
    var g = parseInt(color.substring(3, 5), 16);
    var b = parseInt(color.substring(5, 7), 16);

    // Convert RGB to HSL
    var hsl = this.rgbToHsl(r, g, b);

    // Adjust the lightness value by the percentage
    var adjustedLightness = hsl.l + (percentage / 100);

    // Clamp the adjusted lightness value between 0 and 1
    adjustedLightness = Math.max(0, Math.min(1, adjustedLightness));

    // Convert HSL to RGB
    var adjustedRgb = this.hslToRgb(hsl.h, hsl.s, adjustedLightness);

    // Convert RGB to HEX
    var adjustedColor = this.rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);

    return adjustedColor;
  }

  // Calculate brightness based on HEX color
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


  //===================================================


  invertHexColor(hex: string): string {
    // Remove the leading # if present
    // if (hex.startsWith('#')) {
    //   hex = hex.substring(1);
    // }
    // const decimalValue = parseInt(hex, 16);
    // const invertedValue = 0xffffff ^ decimalValue;
    // const invertedHex = invertedValue.toString(16).padStart(6, '0');
    // return '#' + invertedHex;
    // return this.ColorLuminance(hex, 0.8)
    return this.adjustColor(hex)
  }

  onColorChange(value: any) {
    // this.arr1 = Array(this.apidata.length).fill(value);
    // this.chart.data.datasets[0].backgroundColor = this.arr1;
    // this.arr2 = Array(this.apidata.length).fill(this.invertHexColor(value));
    // this.chart.data.datasets[1].backgroundColor = this.arr2;
    this.service.inputColor = value;
    this.chart.config.data.datasets[0].backgroundColor = Array(this.ki_list.length).fill(value)
    this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill(this.invertHexColor(value))


    this.hex1 = value
    this.hex2 = this.invertHexColor(value)


    //============new ===================
    this.service.setBg1(this.chart.data.datasets[0].backgroundColor);
    this.service.setBg2(this.chart.data.datasets[1].backgroundColor);
    //this.service.setChart(this.chart);
    this.chart.update();
  }

  ColorLuminance(hex: any, lum: any) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substring(c.length);
    }

    return rgb;
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
        if (this.CurrentEndPAge + 20 <= this.totalPages) {
          if (this.currentPage + 19 <= this.totalPages) {
            this.CurrentStartPage = this.currentPage;
            this.CurrentEndPAge = this.currentPage + 19;
          } else {
            this.CurrentStartPage = this.currentPage;
            this.CurrentEndPAge = this.totalPages;
          }
        } else if (this.CurrentEndPAge + 20 > this.totalPages && this.CurrentEndPAge < this.totalPages) {
          this.CurrentStartPage = this.currentPage;
          this.CurrentEndPAge = this.totalPages;
        }
        if (this.CurrentStartPage == this.CurrentEndPAge) {
          this.CurrentStartPage = this.CurrentEndPAge - 19
        }
      } else if (this.currentPage < this.CurrentStartPage) {
        if (this.CurrentStartPage - 20 >= 0) {
          if (this.currentPage - 19 > 0) {
            this.CurrentEndPAge = this.currentPage;
            this.CurrentStartPage = this.currentPage - 19;
          }
          else {
            this.CurrentEndPAge = 20;
            this.CurrentStartPage = 1;
          }
        } else if (this.CurrentStartPage - 20 < 0 && this.CurrentEndPAge > 0) {
          this.CurrentEndPAge = 20;
          this.CurrentStartPage = 1;
        }
      }

      this.setComponentProperties()
      this.setChartProperties();
      this.chart.update();
      this.paginationFlag = false
    }
  }

  changePageRange(changeTo: string): void {

    if (changeTo == 'prev') {
      if (this.CurrentStartPage - 20 >= 0) {
        this.CurrentEndPAge = this.CurrentStartPage - 1;
        this.CurrentStartPage = this.CurrentStartPage - 20;
      } else if (this.CurrentStartPage - 20 < 0 && this.CurrentEndPAge > 0) {
        this.CurrentEndPAge = 20;
        this.CurrentStartPage = 1;
      }
    } else {
      if (this.CurrentEndPAge + 20 <= this.totalPages) {
        this.CurrentStartPage = this.CurrentEndPAge + 1;
        this.CurrentEndPAge = this.CurrentEndPAge + 20;
      } else if (this.CurrentEndPAge + 20 > this.totalPages && this.CurrentEndPAge < this.totalPages) {
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