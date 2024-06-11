import { Component, Input, OnInit } from '@angular/core';
import { GreekLCMComponent } from '../greek-lcm.component';
import { GreekLcmFilterService } from '../greek-lcm-filter.service';
import { Chart } from 'chart.js';
import { DashboardServiceService } from '../../galaxy-dashboard/dashboard-service.service';
import { BIReportsComponent } from '../../bireports.component';
import { DatePipe } from '@angular/common';
import { ChartService } from 'src/app/themeService/chart.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { log } from 'console';
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-greek-lcm-chart',
  templateUrl: './greek-lcm-chart.component.html',
  styleUrls: ['./greek-lcm-chart.component.scss']
})
export class GreekLcmChartComponent implements OnInit {
  dataLoadedFlag: boolean = false;
  loadedData: any[];
  XvalueList: any;
  copied: boolean = false;



  constructor(private service: GreekLcmFilterService, private dashboardService: DashboardServiceService, private bIReportsComponent: BIReportsComponent, private GreekLCMComponent: GreekLCMComponent, private datepipe: DatePipe, private chartService: ChartService) {
  }

  delta_list: any[] = []
  gamma_list: any[] = []
  vega_list: any[] = []
  notional_list: any[] = []
  external_list: any[] = []
  productlist: any[] = []
  underlying_list: any[] = []
  currency_list: any[] = []
  selected!: number
  select: boolean = true
  clickBackgroundcolor1: string = 'rgba(3,32,53,255)'
  clickBackgroundcolor2: string = 'rgba(3,32,53,255)'
  selectedOption: string = 'Ascending'
  selectedOption1: string = 'Delta'
  selectedExternal: string = ''
  prevElement!: number
  showDiv: any = 'false'
  color: string = "#fd4a4e";
  hex1: any = '#fe9b9c'
  hex2: any = '#fd4a4e'
  maxElement: number
  minElement: number
  maxElementD: number
  maxRangeD: number
  maxRangeG: number
  maxRangeV: number
  minElementD: number
  maxElementG: number
  minElementG: number
  maxElementV: number
  minElementV: number
  inputString: string
  userInputDisplay: boolean = false
  colors: any; // added by AdilP
  allCharts: any;

  selectedChart: string = 'delta';
  selectedXValues: string = 'External'

  //chart inside colors || added by AdilP
  chartTiltecolor;
  chartDefaultBar1;
  chartDefaultBar2;
  chartTooltipColor;
  curTheme;

  loader: boolean = true;

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

  filterData(value: any) {
    try {
      this.service.selectedOption = value
      this.selectedOption = this.service.selectedOption
      this.setComponentProperties()
      this.setChartProperties(this.allCharts)
      this.updateCharts();
    } catch (error) {
      console.log(error);

    }
  }

  filterData1(value: any) {
    try {
      this.service.selectedOption1 = value
      this.selectedOption1 = this.service.selectedOption1
      this.setComponentProperties()
      this.setChartProperties(this.allCharts)
      this.updateCharts()
    } catch (error) {
      console.log(error);

    }

  }
  display() {
    if (this.showDiv == 'false') {
      this.showDiv = 'true'
    } else {
      this.showDiv = 'false'
    }
  }

  ngOnInit(): void {
    this.selectedOption = this.service.selectedOption
    this.selectedOption1 = this.service.selectedOption1
    this.color = this.service.inputColor
    this.setComponentProperties()
    //this.createChart()
    this.chartService.paletteEmitObs.subscribe((paletteres) => {
      if (!!paletteres) {
        let pallete = this.chartService.getPallete(paletteres);
        this.colors = pallete.colors
        this.hex1 = this.colors[4]
        this.hex2 = this.colors[1]
      }
      this.setChartConfiguration();
      this.setChartProperties(this.allCharts)
      this.updateCharts();
    });


    this.service.dataReceived.subscribe(() => {
      this.setComponentProperties()
      this.hex1 = this.colors[4] //'#ec0000'
      this.hex2 = this.colors[1]//'#c76464'
      // this.setChartProperties(this.allCharts)
      // this.chart.update()
      // this.chart1.update()
      // this.chart2.update()
      this.createChart();

    })

    this.service.dataFiltered.subscribe(() => {
      this.dataLoadedFlag = false;
      this.setComponentProperties()
      this.setChartProperties(this.allCharts)
      this.updateCharts()
    })

    this.service.filterSelectedEvent.subscribe(() => {
      this.loader = true;
      this.dataLoadedFlag = false;
      this.setComponentProperties()
      this.setChartProperties(this.allCharts)
      this.updateCharts()
    })
    //added by Adil
    this.service.sendStateDataEvent.subscribe(() => {
      this.loader = true;
      this.setComponentProperties()
      this.setChartProperties(this.allCharts)
      this.updateCharts()
    })

    this.service.filterEvent.subscribe(() => {
      this.loader = true;
      this.sortOptionFiltering();
    })
    this.service.inputColorEvent.subscribe(() => {
      this.loader = true;
      this.onColorChange(this.service.inputColor);
      this.loader = false;
    })
    this.service.ClientFilterEvent.subscribe(() => {
      this.loader = true;
      this.setComponentProperties()
      this.setChartProperties(this.allCharts)
      this.updateCharts()
    })
    this.service.LiveCheckEvent.subscribe(() => {
      this.loader = true;
      this.dataLoadedFlag = false;
      this.setComponentProperties()
      this.setChartProperties(this.allCharts)
      this.updateCharts();
    })

    this.service.bg1$.subscribe(value => {
      this.loader = true;
      //console.log(value);
      this.color = value[0]
      this.hex1 = value[0]
      this.allCharts?.array.forEach(chart => {
        if (chart) {
          chart.data.datasets[0].backgroundColor = value
        }
      });
      this.updateCharts();
    })

    this.service.bg2$.subscribe(value => {
      // console.log(value);
      this.loader = true;
      this.hex2 = value[0]
      this.allCharts?.array.forEach(chart => {
        if (chart) {
          chart.data.datasets[1].backgroundColor = value
        }
      });
      this.updateCharts();
    })

    // this.chart?.canvas.addEventListener('wheel', (e: string) => {
    //   this.scroll(e, this.chart, 1)
    // })
    // this.chart1?.canvas.addEventListener('wheel', (e: string) => {
    //   this.scroll(e, this.chart1, 2)
    // })
    // this.chart2?.canvas.addEventListener('wheel', (e: string) => {
    //   this.scroll(e, this.chart2, 3)
    // })

  }
  updateCharts() {
    try {
      if(this.chart && this.chart.canvas) this.chart?.update();
      if(this.chart1 && this.chart1.canvas) this.chart1?.update();
      if(this.chart2 && this.chart2.canvas) this.chart2?.update();
      //this.loader = false;

    } catch (error) {
      console.log('Error in update charts', error)
    }
  }

  sortOptionFiltering() {
    try {
      this.selectedOption = this.service.selectedOption
      this.selectedOption1 = this.service.selectedOption1
      this.selectedExternal = this.service.selectedExternal
      this.dataLoadedFlag = true;
      this.setComponentProperties()
      this.setChartProperties(this.allCharts);
      this.updateCharts();
    } catch (error) {
      console.log("error in sortOptionFiltering", error);

    }
  }
  //Added by AdilP
  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart1?.destroy();
    this.chart2?.destroy();
  }
  setChartConfiguration() {
    try {
      if (this.chart) {
        this.chart.config.data.datasets[0].backgroundColor = this.colors[4]
        this.chart.config.data.datasets[1].backgroundColor = this.colors[1]
        // this.service.setBg1(this.chart.data.datasets[0].backgroundColor);
        // this.service.setBg2(this.chart.data.datasets[1].backgroundColor);

      }

      if (this.chart1) {
        this.chart1.config.data.datasets[0].backgroundColor = this.colors[4]
        this.chart1.config.data.datasets[1].backgroundColor = this.colors[1]
        // this.service.setBg1(this.chart1.data.datasets[0].backgroundColor);
        // this.service.setBg2(this.chart1.data.datasets[1].backgroundColor);

      }

      if (this.chart2) {
        this.chart2.config.data.datasets[0].backgroundColor = this.colors[4]
        this.chart2.config.data.datasets[1].backgroundColor = this.colors[1]
        // this.service.setBg1(this.chart2.data.datasets[0].backgroundColor);
        // this.service.setBg2(this.chart2.data.datasets[1].backgroundColor);

      }

    } catch (error) {
      console.log(error);

    }
  }

  pinChart(e: any, title) {
    try {

      e.preventDefault();
      this.pinChart1(title)
      this.userInputDisplay = false
    } catch (error) {
      console.log(error);

    }
  }

  pinChart1(title) {
    this.GreekLCMComponent.pinned()


    const current_min_Delta = this.service.current_min_Delta
    const current_max_Delta = this.service.current_max_Delta

    const worstOfUnderlying = this.service.selectedUnderlying
    const client = this.service.selectedCustomer

    const selectedOption = this.service.selectedOption
    const selectedOption1 = this.service.selectedOption1

    const bg1 = this.chart.data.datasets[0].backgroundColor
    const bg2 = this.chart.data.datasets[1].backgroundColor

    const data = this.chart.config._config.data.datasets[0].data;
    const data1 = this.chart.config._config.data.datasets[1].data;
    const productlist = this.productlist;
    const underlying_list = this.underlying_list;
    const type = this.chart.config._config.type;
    const labels = this.chart.config._config.data.xLabels;
    const options = this.chart.config._config.options;
    const backgroundColor = this.chart.config.data.datasets[0].backgroundColor;
    const backgroundColor1 = this.chart.config.data.datasets[1].backgroundColor;
    const borderWidth = 1;
    const borderColor = 'black';
    const id = 2
    const currentTimezoneOffsetInMinutes = new Date().getTimezoneOffset();
    const currentTimezoneOffsetInMilliseconds = currentTimezoneOffsetInMinutes * 60 * 1000;
    const date = this.datepipe.transform(new Date(new Date().toLocaleString()), "dd MMM yyyy h:mm a")
    const inputString = this.inputString

    const chart = {
      data, data1, productlist, underlying_list, labels, backgroundColor, backgroundColor1, borderColor, borderWidth, title, id, current_min_Delta, current_max_Delta, worstOfUnderlying, client, selectedOption, selectedOption1, bg1, bg2, date, inputString
    }
    this.bIReportsComponent.setChart({ type, chart });
  }

  setComponentProperties() {
    try {
      let temp_delta_list: any[] = [];
      let temp_gamma_list: any[] = [];
      let temp_vega_list: any[] = [];
      let temp_notional_list: any[] = [];
      let temp_external_list: any[] = [];
      let temp_underlying_list: any[] = [];
      let tempProductList: any[] = []
      let tempCurrency_list: any[] = []


      if (!this.paginationFlag) {
        if (!this.dataLoadedFlag) {
          this.data = this.service.getData()
          // this.dataLoadedFlag = true;
          this.loadedData = this.data
        }
        else
          this.data = this.loadedData;

      if (this.service.selectedOption === 'Ascending') {

        if (this.service.selectedOption1 === 'Underlying' || this.service.selectedOption1 === 'External') {
          this.data.sort((a: any, b: any) => {
            var m: string = a[this.service.selectedOption1]
            var n: string = b[this.service.selectedOption1]
            // console.log(m + "" + n)
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

        if (this.service.selectedOption1 === 'Underlying' || this.service.selectedOption1 === 'External') {
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
        this.data = this.loadedData.filter((s: any) => externalToSearch.some(exteranl_ref => (s.External.includes(exteranl_ref))))
      }

        this.totalPages = Math.ceil(this.data.length / 20);
        this.CurrentStartPage = 1;
        this.CurrentEndPAge = this.totalPages > 20 ? 20 : this.totalPages;
        this.currentPage =1;
        
      }

      let Only20Data = this.data.slice(((this.currentPage-1)*20), ((this.currentPage-1)*20)+20);
      
      Only20Data.forEach((data) => {
        // temp_delta_list = [...temp_delta_list, data["Delta"]]
        temp_delta_list.push(data["Delta"])
        // temp_gamma_list = [...temp_gamma_list, data["Gamma"]]
        temp_gamma_list.push(data["Gamma"])
        // temp_vega_list = [...temp_vega_list, data["Vega"]]
        temp_vega_list.push(data['Vega'])
        // temp_notional_list = [...temp_notional_list, data["Notional_Amt"]]
        temp_notional_list.push(data["Notional_Amt"])
        // temp_external_list = [...temp_external_list, data["External"]]
        temp_external_list.push(data["External"])
        // tempProductList = [...tempProductList, data["Product_Name"]]
        tempProductList.push(data["Product_Name"])
        temp_underlying_list.push(data["Underlying"])
        // temp_underlying_list = [...temp_underlying_list, data["Underlying"]]
        tempCurrency_list.push(data["Currency"])
      })
      let maxNotional = Math.max(...temp_notional_list)
      let minNotional = Math.min(...temp_notional_list)
      // this.maxElement = Math.max(maxNotional, maxNotional)
      this.maxElement = this.calculateRange(maxNotional, minNotional)
      // this.minElement = Math.min(minNotional, minNotional)
      this.maxElementD = Math.max(...temp_delta_list)
      this.minElementD = Math.min(...temp_delta_list)
      this.maxRangeD = this.calculateRange(this.minElementD, this.maxElementD);
      this.maxElementG = Math.max(...temp_gamma_list)
      this.minElementG = Math.min(...temp_gamma_list)
      this.maxRangeG = this.calculateRange(this.minElementG, this.maxElementG);
      this.maxElementV = Math.max(...temp_vega_list)
      this.minElementV = Math.min(...temp_vega_list)
      this.maxRangeV = this.calculateRange(this.minElementV, this.maxElementV);
      // this.delta_list = [...temp_delta_list]
      // this.gamma_list = [...temp_gamma_list]
      // this.vega_list = [...temp_vega_list]
      // this.notional_list = [...temp_notional_list]
      // this.external_list = [...temp_external_list]
      // this.productlist = [...tempProductList]
      // this.underlying_list = [...temp_underlying_list]
      this.delta_list = temp_delta_list;
      this.gamma_list = temp_gamma_list;
      this.vega_list = temp_vega_list;
      this.notional_list = temp_notional_list;
      this.external_list = temp_external_list;
      this.productlist = tempProductList;
      this.underlying_list = temp_underlying_list;
      this.currency_list = tempCurrency_list


      this.prevElement = -1

    } catch (error) {
      console.log(error);

    }





  }

  backgroundcolor1: string[] = []
  backgroundcolor2: string[] = []
  labels!: any
  chart!: any
  chart1!: any
  chart2!: any
  data!: any[]


  createChart() {
    try {
      // if (this.chart) {
      //   this.chart.destroy();
      // }
      let chartStatus = Chart.getChart("greek-lcm-delta"); // <canvas> id
      if (chartStatus != undefined) {
        this.chart= Chart.getChart("greek-lcm-delta");
        this.chart.destroy();
      }
      this.chart = new Chart("greek-lcm-delta", {
        type: 'bar',
        data: {
          xLabels: this.external_list,
          datasets: [{
            label: 'Delta',
            data: this.delta_list,
            // backgroundColor: Array(this.delta_list.length).fill('#255272'),
            backgroundColor: this.colors ? this.colors[1] : this.chartDefaultBar1, //'#990007',
            yAxisID: 'A',

          },
          {
            label: 'Notional',
            data: this.notional_list,
            // backgroundColor: Array(this.notional_list.length).fill('#6d97bf'),
            backgroundColor: this.colors ? this.colors[4] : this.chartDefaultBar2,//'#cb000d',
            yAxisID: 'B',

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
                var backgroundcolor1 = Array(this.delta_list.length).fill(this.ColorLuminance(this.hex1, -0.5))
                var backgroundcolor2 = Array(this.notional_list.length).fill(this.ColorLuminance(this.hex2, -0.5))
                backgroundcolor1[this.selected] = this.hex1
                backgroundcolor2[this.selected] = this.hex2
                
                this.chart.config.data.datasets[0].backgroundColor = [...backgroundcolor1]
                this.chart.config.data.datasets[1].backgroundColor = [...backgroundcolor2]
                this.select = false
                this.chart.update()
                this.copyToClipboard(this.external_list[this.selected])
              }
              else {
                this.chart.config.data.datasets[0].backgroundColor = Array(this.delta_list.length).fill(this.hex1)
                this.chart.config.data.datasets[1].backgroundColor = Array(this.notional_list.length).fill(this.hex2)
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
              categoryPercentage: 0.6,
              barThickness: 'flex'
            }
          },
          scales: {
            A: {
              type: 'linear',
              position: 'right',
              ticks: {
                padding: 20,
                crossAlign: 'near',
                color: 'rgba(149,149,149,255)',
                font: {
                  size: 10
                },
                // stepSize: function():number{
                //   console.log("Math.round((Math.abs( this.maxElement ) + Math.abs( this.minElement ))/10)")
                //   return number(10);
                // },
                //stepSize : 50000 // Math.round((Math.abs( this.maxElement ) + Math.abs( this.minElement ))/10)
                callback: function(value :any, index, values) {
                  return (Math.abs(value) < 1000000) ? (Math.abs(value) >= 1000) ? value/1000 + 'K' : value : value/1000000 + 'M';
                }
              },
              border: {
                color: 'white',
                dash: [1, 5],
                display: false
              },
              grid: {
                //color: '#808080',
                drawTicks: false,
                // display : false
              },
              title: {
                color: 'rgba(109,151,191,255)',
                display: true,
                text: 'Delta',
                font: {
                  size: 20
                }
              },
              beginAtZero: false,
              // min: -Math.round(Math.round(Math.max(Math.abs(this.maxElementD), Math.abs(this.minElementD)))),
              // max: Math.round(Math.round(Math.max(Math.abs(this.maxElementD), Math.abs(this.minElementD)))),
              //  grace: '10%'
              min: -this.maxRangeD,
              max: this.maxRangeD
            },
            B: {
              type: 'linear',
              position: 'left',
              ticks: {
                padding: 20,
                crossAlign: 'near',
                color: 'rgba(149,149,149,255)',
                font: {
                  size: 10
                },
                // stepSize: function():number{
                //   console.log("Math.round((Math.abs( this.maxElement ) + Math.abs( this.minElement ))/10)")
                //   return number(10);
                // },
                //stepSize : 50000 // Math.round((Math.abs( this.maxElement ) + Math.abs( this.minElement ))/10)
                callback: function(value :any, index, values) {
                  return (Math.abs(value) < 1000000) ? (Math.abs(value) >= 1000) ? value/1000 + 'K' : value : value/1000000 + 'M';
                }
              },
              border: {
                color: 'white',
                dash: [1, 5],
                display: false
              },
              grid: {
                color: '#808080',
                drawTicks: true,
                // display : false
              },
              title: {
                color: 'rgba(109,151,191,255)',
                display: true,
                text: 'Notional',
                font: {
                  size: 20
                }
              },
              beginAtZero: false,
              // min: Math.round(this.minElement),
              // max: Math.round(this.maxElement),
              // grace: '10%',
              // min: -Math.round(Math.round(Math.max(Math.abs(this.maxElement), Math.abs(this.minElement)))),
              // max: Math.round(Math.round(Math.max(Math.abs(this.maxElement), Math.abs(this.minElement)))),
              // grace: "10%",
              min: -this.maxElement,
              max: this.maxElement


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
                color: 'rgba(109,151,191,255)',
                display: true,
                text: 'External',
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
                size: 10
              },
              formatter: function (context) {               
                return (Math.abs(Number(context)) < 1000000) ? (Math.abs(Number(context)) >= 1000) ? ((Number(context) / 1000).toFixed(2) + 'K') : Number(context).toFixed(2) : (Number(context) / 1000000).toFixed(2) + 'M';
              },
              display: 'auto',
              rotation : 270


            },
            title: {
              display: true,
              text: 'Delta by Trade',
              font: {
                size: 16
              }

            },
            tooltip: {
              displayColors: false,
              callbacks: {
                title(tooltipItems) {
                  return ""
                },
                label(tooltipItem) {
                  var labelD = Number(tooltipItem.raw).toLocaleString('en-US')
                  return `${tooltipItem.dataset.label}: ${labelD}`
                },
                beforeLabel(tooltipItem) {
                  var str = `External: ${tooltipItem.label}`;
                  return str;
                },
                afterLabel: (tooltipItem) => {
                  var currency = this.currency_list[tooltipItem.dataIndex]
                  var pname = this.productlist[tooltipItem.dataIndex]
                  var worstUnder = this.underlying_list[tooltipItem.dataIndex]
                  var str = `Currency : ${currency}\nUnderlying: ${worstUnder}\nProduct Name: ${pname.substring(pname.indexOf("Strike"), pname.indexOf("Coupon"))}\n${pname.substring(pname.indexOf("Coupon"))}`;
                  return str;
                },
              },
              backgroundColor: '#ffffe7', //'#EE1919',
              bodyColor: 'black'

            },
            legend: {
              // align: 'end',
              position: 'top',
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
      // if (this.chart1) {
      //   this.chart1.destroy();
      // }
      let chartStatus1 = Chart.getChart("greek-lcm-gamma"); // <canvas> id
      if (chartStatus1 != undefined) {
        this.chart1 = Chart.getChart("greek-lcm-gamma"); // <canvas> id
        this.chart1.destroy();
      }
      this.chart1 = new Chart("greek-lcm-gamma", {
        type: 'bar',
        data: {
          xLabels: this.external_list,
          datasets: [{
            label: 'Gamma',
            data: this.gamma_list,
            // backgroundColor: Array(this.gamma_list.length).fill('#255272'),
            backgroundColor: this.colors ? this.colors[1] : this.chartDefaultBar1,//'#990007',
            yAxisID: 'A',

          },
          {
            label: 'Notional',
            data: this.notional_list,
            // backgroundColor: Array(this.notional_list.length).fill('#6d97bf'),
            backgroundColor: this.colors ? this.colors[4] : this.chartDefaultBar2,//'#cb000d',
            yAxisID: 'B',

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
              var backgroundcolor1 = Array(this.gamma_list.length).fill(this.ColorLuminance(this.hex1, -0.5))
              var backgroundcolor2 = Array(this.notional_list.length).fill(this.ColorLuminance(this.hex2, -0.5))
              backgroundcolor1[this.selected] = this.hex1
              backgroundcolor2[this.selected] = this.hex2

              this.chart.config.data.datasets[0].backgroundColor = [...backgroundcolor1]
              this.chart.config.data.datasets[1].backgroundColor = [...backgroundcolor2]
              this.select = false
              this.chart.update()
              this.copyToClipboard(this.external_list[this.selected])
            }
            else {
              this.chart.config.data.datasets[0].backgroundColor = Array(this.gamma_list.length).fill(this.hex1)
              this.chart.config.data.datasets[1].backgroundColor = Array(this.notional_list.length).fill(this.hex2)
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
              categoryPercentage: 0.6,
              barThickness: 'flex'
            }
          },
          scales: {
            A: {
              type: 'linear',
              position: 'right',
              ticks: {
                padding: 20,
                crossAlign: 'near',
                color: 'rgba(149,149,149,255)',
                font: {
                  size: 10
                },
                // stepSize: function():number{
                //   console.log("Math.round((Math.abs( this.maxElement ) + Math.abs( this.minElement ))/10)")
                //   return number(10);
                // },
                //stepSize : 50000 // Math.round((Math.abs( this.maxElement ) + Math.abs( this.minElement ))/10)
                callback: function(value :any, index, values) {
                  return (Math.abs(value) < 1000000) ? (Math.abs(value) >= 1000) ? value/1000 + 'K' : value : value/1000000 + 'M';
                }
              },
              border: {
                color: 'white',
                dash: [1, 5],
                display: false
              },
              grid: {
                //color: '#808080',
                drawTicks: true,
              },
              title: {
                color: 'rgba(109,151,191,255)',
                display: true,
                text: 'Gamma',
                font: {
                  size: 20
                }
              },
              beginAtZero: false,
              // min: Math.round(this.minElement - (this.minElement/10)),
              // max: Math.round(this.maxElement + (this.maxElement/10))
              // grace: '10%'
              min: -this.maxRangeG,
              max: this.maxRangeG
            },
            B: {
              type: 'linear',
              position: 'left',
              ticks: {
                padding: 20,
                crossAlign: 'near',
                color: 'rgba(149,149,149,255)',
                font: {
                  size: 10
                },
                // stepSize: function():number{
                //   console.log("Math.round((Math.abs( this.maxElement ) + Math.abs( this.minElement ))/10)")
                //   return number(10);
                // },
                //stepSize : 50000 // Math.round((Math.abs( this.maxElement ) + Math.abs( this.minElement ))/10)
                callback: function(value :any, index, values) {
                  return (Math.abs(value) < 1000000) ? (Math.abs(value) >= 1000) ? value/1000 + 'K' : value : value/1000000 + 'M';
                }
              },
              border: {
                color: 'white',
                dash: [1, 5],
                display: false
              },
              grid: {
                color: '#808080',
                drawTicks: true,
              },
              title: {
                color: 'rgba(109,151,191,255)',
                display: true,
                text: 'Notional',
                font: {
                  size: 20
                }
              },
              beginAtZero: false,
              // min: Math.round(this.minElement - (this.minElement/10)),
              // max: Math.round(this.maxElement + (this.maxElement/10))
              // grace: '10%'
              min: -this.maxElement,
              max: this.maxElement
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
                color: 'rgba(109,151,191,255)',
                display: true,
                text: 'External',
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
                size: 10
              },
              formatter: function (context) {
                // return Number(context).toLocaleString('en-US');
                return (Math.abs(Number(context)) < 1000000) ? (Math.abs(Number(context)) >= 1000) ? ((Number(context) / 1000).toFixed(2) + 'K') : Number(context).toFixed(2) : (Number(context) / 1000000).toFixed(2) + 'M';
              },
              display: 'auto',
              rotation : 270

            },
            title: {
              display: true,
              text: 'Gamma by Trade',
              font: {
                size: 16
              }
            },
            tooltip: {
              displayColors: false,
              callbacks: {
                title(tooltipItems) {
                  return ""
                },
                label(tooltipItem) {
                  var labelD = Number(tooltipItem.raw).toLocaleString('en-US')
                  return `${tooltipItem.dataset.label}: ${labelD}`
                },
                beforeLabel(tooltipItem) {
                  var str = `External: ${tooltipItem.label}`;
                  return str;
                },
                afterLabel: (tooltipItem) => {
                  var currency = this.currency_list[tooltipItem.dataIndex]
                  var pname = this.productlist[tooltipItem.dataIndex]
                  var worstUnder = this.underlying_list[tooltipItem.dataIndex]
                  var str = `Currency : ${currency}\nUnderlying: ${worstUnder}\nProduct Name: ${pname.substring(pname.indexOf("Strike"), pname.indexOf("Coupon"))}\n${pname.substring(pname.indexOf("Coupon"))}`;
                  return str;
                },
              },
              backgroundColor: '#ffffe7', //'#EE1919',
              bodyColor: 'black'

            },
            legend: {
              // align: 'end',
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
      // if (this.chart2) {
      //   this.chart2.destroy();
      // }
      let chartStatus2 = Chart.getChart("greek-lcm-vega"); // <canvas> id
      if (chartStatus2 != undefined) {
        this.chart2 = Chart.getChart("greek-lcm-vega");
        this.chart2.destroy();
      }
      this.chart2 = new Chart("greek-lcm-vega", {
        type: 'bar',
        data: {
          xLabels: this.external_list,
          datasets: [{
            label: 'Vega',
            data: this.vega_list,
            //backgroundColor: Array(this.vega_list.length).fill('#255272'),
            backgroundColor: this.colors ? this.colors[1] : this.chartDefaultBar1,//'#990007',
            yAxisID: 'A',

          },
          {
            label: 'Notional',
            data: this.notional_list,
            // backgroundColor: Array(this.notional_list.length).fill('#6d97bf'),
            backgroundColor: this.colors ? this.colors[4] : this.chartDefaultBar2,//'#cb000d',
            yAxisID: 'B',

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
              var backgroundcolor1 = Array(this.vega_list.length).fill(this.ColorLuminance(this.hex1, -0.5))
              var backgroundcolor2 = Array(this.notional_list.length).fill(this.ColorLuminance(this.hex2, -0.5))
              backgroundcolor1[this.selected] = this.hex1
              backgroundcolor2[this.selected] = this.hex2

              this.chart.config.data.datasets[0].backgroundColor = [...backgroundcolor1]
              this.chart.config.data.datasets[1].backgroundColor = [...backgroundcolor2]
              this.select = false
              this.chart.update()
              this.copyToClipboard(this.external_list[this.selected])
            }
            else {
              this.chart.config.data.datasets[0].backgroundColor = Array(this.vega_list.length).fill(this.hex1)
              this.chart.config.data.datasets[1].backgroundColor = Array(this.notional_list.length).fill(this.hex2)
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
              categoryPercentage: 0.6,
              barThickness: 'flex'
            }
          },
          scales: {
            A: {
              type: 'linear',
              position: 'right',
              ticks: {
                padding: 20,
                crossAlign: 'near',
                color: 'rgba(149,149,149,255)',
                font: {
                  size: 10
                },
                // stepSize: function():number{
                //   console.log("Math.round((Math.abs( this.maxElement ) + Math.abs( this.minElement ))/10)")
                //   return number(10);
                // },
                //stepSize : 50000 // Math.round((Math.abs( this.maxElement ) + Math.abs( this.minElement ))/10)
                callback: function(value :any, index, values) {
                  return (Math.abs(value) < 1000000) ? (Math.abs(value) >= 1000) ? value/1000 + 'K' : value : value/1000000 + 'M';
                }
              },
              border: {
                color: 'white',
                dash: [1, 5],
                display: false
              },
              grid: {
                color: '#808080',
                drawTicks: true,
              },
              title: {
                color: 'rgba(109,151,191,255)',
                display: true,
                text: 'Vega',
                font: {
                  size: 20
                }
              },
              beginAtZero: false,
              // min: Math.round(this.minElement - (this.minElement/10)),
              // max: Math.round(this.maxElement + (this.maxElement/10))
              // grace: '10%'
              min: -this.maxRangeV,
              max: this.maxRangeV

            },
            B: {
              type: 'linear',
              position: 'left',
              ticks: {
                padding: 20,
                crossAlign: 'near',
                color: 'rgba(149,149,149,255)',
                font: {
                  size: 10
                },
                // stepSize: function():number{
                //   console.log("Math.round((Math.abs( this.maxElement ) + Math.abs( this.minElement ))/10)")
                //   return number(10);
                // },
                //stepSize : 50000 // Math.round((Math.abs( this.maxElement ) + Math.abs( this.minElement ))/10)
                callback: function(value :any, index, values) {
                  return (Math.abs(value) < 1000000) ? (Math.abs(value) >= 1000) ? value/1000 + 'K' : value : value/1000000 + 'M';
                }
              },
              border: {
                color: 'white',
                dash: [1, 5],
                display: false
              },
              grid: {
                // color: '#808080',
                drawTicks: true,
              },
              title: {
                color: 'rgba(109,151,191,255)',
                display: true,
                text: 'Notional',
                font: {
                  size: 20
                }
              },
              beginAtZero: false,
              // min: Math.round(this.minElement - (this.minElement/10)),
              // max: Math.round(this.maxElement + (this.maxElement/10))
              // grace: '10%'
              min: -this.maxElement,
              max: this.maxElement

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
                color: 'rgba(109,151,191,255)',
                display: true,
                text: 'External',
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
                size: 10
              },
              formatter: function (context) {
                // return Number(context).toLocaleString('en-US');
                return (Math.abs(Number(context)) < 1000000) ? (Math.abs(Number(context)) >= 1000) ? ((Number(context) / 1000).toFixed(2) + 'K') : Number(context).toFixed(2) : (Number(context) / 1000000).toFixed(2) + 'M';

              },
              display: 'auto',
              rotation : 270


            },
            title: {
              display: true,
              text: 'Vega by Trade'
            },
            tooltip: {
              displayColors: false,
              callbacks: {
                title(tooltipItems) {
                  return ""
                },
                label(tooltipItem) {
                  var labelD = Number(tooltipItem.raw).toLocaleString('en-US')
                  return `${tooltipItem.dataset.label}: ${labelD}`
                },
                beforeLabel(tooltipItem) {
                  var str = `External: ${tooltipItem.label}`;
                  return str;
                },
                afterLabel: (tooltipItem) => {
                  var currency = this.currency_list[tooltipItem.dataIndex]
                  var pname = this.productlist[tooltipItem.dataIndex]
                  var worstUnder = this.underlying_list[tooltipItem.dataIndex]
                  var str = `Currency : ${currency}\nUnderlying: ${worstUnder}\nProduct Name: ${pname.substring(pname.indexOf("Strike"), pname.indexOf("Coupon"))}\n${pname.substring(pname.indexOf("Coupon"))}`;
                  return str;
                },
              },
              backgroundColor: '#ffffe7', //'#EE1919',
              bodyColor: 'black'

            },
            legend: {
              // align: 'end',
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
      // this.chart?.canvas.addEventListener('wheel', (e: string) => {
      //   this.scroll(e, this.chart, 1)
      // })
      // this.chart1?.canvas.addEventListener('wheel', (e: string) => {
      //   this.scroll(e, this.chart1, 2)
      // })
      // this.chart2?.canvas.addEventListener('wheel', (e: string) => {
      //   this.scroll(e, this.chart2, 3)
      // })
      this.allCharts = [this.chart, this.chart1, this.chart2];

      this.loader = false;


    } catch (error) {
      this.chart?.destroy();
      this.chart1?.destroy();
      this.chart2?.destroy();
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

  scroll(scroll: any, chart: any, chartNo: any) {
    scroll.preventDefault();
    let list: any;
    switch (chartNo) {
      case 1:
        list = this.delta_list;
        break;
      case 2:
        list = this.gamma_list;
        break;
      case 3:
        list = this.vega_list;
        break;
    }

    if (scroll.deltaY > 0) {
      if (chart.config.options.scales.x.max >= list.length - 1) {
        chart.config.options.scales.x.min = list.length - 21;
        chart.config.options.scales.x.max = list.length - 1;
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


  setChartProperties(allCharts: any) {
    try {
      let datalist: any;
      let max : any ;
      let min : any ;

      allCharts?.forEach((chart) => {
        if (chart) {
          switch (chart) {
            case this.chart:
              datalist = this.delta_list;
              min = -this.maxRangeD
              max = this.maxRangeD
              break;
            case this.chart1:
              datalist = this.gamma_list;
              min = -this.maxRangeG
              max = this.maxRangeG
              break;
            case this.chart2:
              datalist = this.vega_list;
              min = -this.maxRangeV
              max = this.maxRangeV
              break;
          }
          chart.config.data.datasets[0].data = datalist
          chart.config.data.datasets[1].data = this.notional_list;
          if (this.hex1 === undefined || this.hex2 === undefined) {
            if (this.color) chart.config.data.datasets[1].backgroundColor = Array(this.notional_list.length).fill(this.invertHexColor(this.color))
          } else {
            chart.config.data.datasets[0].backgroundColor = Array(datalist.length).fill(this.hex1)
            chart.config.data.datasets[1].backgroundColor = Array(this.notional_list.length).fill(this.hex2)
          }
          chart.config.data.xLabels = this.XvalueList || this.external_list;
          chart.config.options.scales.A.min = min
          chart.config.options.scales.A.max = max
          chart.config.options.scales.B.min = -this.maxElement
          chart.config.options.scales.B.max = this.maxElement
        }
      })


      // this.chart.config.data.datasets[0].data = this.delta_list;
      // this.chart.config.data.datasets[1].data = this.notional_list;
      // if (this.hex1 === undefined || this.hex2 === undefined) {
      //   this.chart.config.data.datasets[0].backgroundColor = Array(this.delta_list.length).fill(this.color)
      //   this.chart.config.data.datasets[1].backgroundColor = Array(this.notional_list.length).fill(this.invertHexColor(this.color))
      // } else {
      //   this.chart.config.data.datasets[0].backgroundColor = Array(this.delta_list.length).fill(this.hex1)
      //   this.chart.config.data.datasets[1].backgroundColor = Array(this.notional_list.length).fill(this.hex2)
      // }
      // this.chart.config.data.xLabels = this.external_list;
      this.loader = false;

    } catch (error) {
      console.log(error);

    }

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

    this.service.inputColor = value;
    this.allCharts?.forEach((chart) => {
      chart.config.data.datasets[0].backgroundColor = Array(this.delta_list.length).fill(value)
      chart.config.data.datasets[1].backgroundColor = Array(this.notional_list.length).fill(this.invertHexColor(value))
    })
    // this.chart.config.data.datasets[0].backgroundColor = Array(this.delta_list.length).fill(value)
    // this.chart.config.data.datasets[1].backgroundColor = Array(this.notional_list.length).fill(this.invertHexColor(value))
    this.hex1 = value
    this.hex2 = this.invertHexColor(value)
    //============new ===================
    this.service.setBg1(this.chart.data.datasets[0].backgroundColor);
    this.service.setBg2(this.chart.data.datasets[1].backgroundColor);
    //this.service.setChart(this.chart);
    this.updateCharts();
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
  changeChart(charttype) {
    this.loader = true ;
    this.selectedChart = charttype;
    setTimeout(() => {
      this.loader = false;
    }, 1000 );
  }
  updateScaleXValues(Xvalues) {
    this.loader = true ;
    setTimeout(() => {
      this.loader = false;
    }, 2000);
    
    this.selectedXValues = Xvalues;
    if (Xvalues == 'External') {
      this.XvalueList = this.external_list;

    } else if (Xvalues == 'Underlyings') {
      this.XvalueList = this.underlying_list;
    }
    this.allCharts?.forEach((chart) => {
      chart.config.data.xLabels = this.XvalueList;
      chart.options.scales.x.title.text = Xvalues;
      chart.update();
    })
  }
  calculateRange(num1, num2) {
    // Math.round(Math.round(Math.max(Math.abs(this.maxElementD), Math.abs(this.minElementD))))
    let num: number = Math.round(Math.round(Math.max(Math.abs(num1), Math.abs(num2))))
    let x = 1;
    if (isFinite(num)) {
      while (num > 10) {
        num = num / 10;
        x *= 10
      }
      return (Math.ceil(num) + 1) * x;

    }
    return;
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
      this.setChartProperties(this.allCharts);
      this.updateCharts()
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
