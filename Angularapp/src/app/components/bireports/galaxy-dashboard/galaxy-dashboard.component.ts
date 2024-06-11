import { AfterViewInit, Component, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { DashboardServiceService } from './dashboard-service.service';
import { Chart } from 'chart.js';
import { BarrierProbabilityService } from '../barrier-probability/barrier-probability.service';
import { HttpClient } from '@angular/common/http';
import { BIReportsComponent } from '../bireports.component';
import { BarrierWatchService } from '../barrier-watch/barrier-watch.service';
import { KiAndWorstOfPerformanceService } from '../ki-and-worst-of-performance/wof-and-ki-filter.service';
import { KoAndWorstOfPerformanceService } from '../ko-and-worst-of-performance/wof-and-ko-filter.service';
import { MtmAndKiFilterService } from '../mtm-and-ki/mtm-and-ki-filter.service';
import { MtmAndKoFilterService } from '../mtm-and-ko/mtm-and-ko-filter.service';
import { FilterService } from '../sales-and-revenue-performance/filter.service';
import { AssetExposureService } from '../asset-exposure/asset-exposure.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-galaxy-dashboard',
  templateUrl: './galaxy-dashboard.component.html',
  styleUrls: ['./galaxy-dashboard.component.scss']
})
export class GalaxyDashboardComponent implements OnInit {

  constructor(private http: HttpClient, private dashboardService: DashboardServiceService, private reportService: BarrierProbabilityService, private bIReportsComponent: BIReportsComponent, private cdr: ChangeDetectorRef, private barrierWatchService: BarrierWatchService, private kiAndWorstOfPerformanceService: KiAndWorstOfPerformanceService, private koAndWorstOfPerformanceService: KoAndWorstOfPerformanceService, private mtmAndKiFilterService: MtmAndKiFilterService, private mtmAndKoFilterService: MtmAndKoFilterService, private filterService: FilterService, private assetExposureService: AssetExposureService) {

  }
  // ngOnChanges(): void {
  //   this.refresh()
  // }
  apiDataBarrierProbability1: any = []
  apiDataBarrierProbability2: any = []
  apiDataBarrierWatch: any = []
  charts: any = this.dashboardService.chart;
  len: any = 0;
  chart: any;

  originalBackgroundColor = [
    'rgba(57,114,158,255)',
    'rgba(8,80,134,255)',
    'rgba(28,69,99,255)',
    'rgba(81,124,155,255)',
    'rgba(153,207,249,255',
    'rgba(207, 233, 255, 1)',
    'rgb(143, 174, 199)',
    'rgb(197, 219, 237)'
  ];

  colorFromRaw(ctx: any) {
    if (ctx.type !== 'data') {
      return 'transparent';
    }
    return this.originalBackgroundColor[ctx.dataIndex]
  }

  refresh() {
    this.charts = this.dashboardService.getChart()
    this.len = this.charts.length;
    setTimeout(() => {
      this.updateChart();
    }, 0);
  }

  delete(id: any) {
    this.bIReportsComponent.deleteChart(id, this.afterDelete)


  }

  afterDelete: (id: number) => void = (id: number) => {
    this.charts = this.charts.filter((val) => {
      return val.chartId !== id
    })
    this.dashboardService.chart = [...this.charts]
  }

  navigate(type: any, id: any, chartId: any) {
    console.log(type + "" + id)
    var chart = this.charts.filter((val) => {
      return val.chartId === chartId
    })
    if (type === 'bubble') {
      switch (id) {
        case 11:
          this.reportService.currentminimunKI = chart[0].chartData.currentminimunKI
          this.reportService.currentmaximumKI = chart[0].chartData.currentmaximumKI
          this.reportService.currentminimumKO = chart[0].chartData.currentminimumKO
          this.reportService.currentmaximumKO = chart[0].chartData.currentmaximumKO

          this.reportService.selectedOptionKI = chart[0].chartData.selectedOption
          this.reportService.selectedOption1KI = chart[0].chartData.selectedOption1

          // Code commented by AdilP @05-10-2023     
          //LcmSimulationServiceService(1)
          break;

        case 12:
          this.reportService.currentminimunKI = chart[0].chartData.currentminimunKI
          this.reportService.currentmaximumKI = chart[0].chartData.currentmaximumKI
          this.reportService.currentminimumKO = chart[0].chartData.currentminimumKO
          this.reportService.currentmaximumKO = chart[0].chartData.currentmaximumKO

          this.reportService.selectedOptionKO = chart[0].chartData.selectedOption
          this.reportService.selectedOption1KO = chart[0].chartData.selectedOption1
          // Code commented by AdilP @05-10-2023     
          //LcmSimulationServiceService(1)
          break;

        case 2:
          this.barrierWatchService.currentmaxki = chart[0].chartData.currentmaximumKI
          this.barrierWatchService.currentminki = chart[0].chartData.currentminimunKI
          this.barrierWatchService.currentminko = chart[0].chartData.currentminimumKO
          this.barrierWatchService.currentmaxko = chart[0].chartData.currentmaximumKO
          this.barrierWatchService.asset = chart[0].chartData.asset
          // Code commented by AdilP @05-10-2023     
          //LcmSimulationServiceService(3)
          break;

        case 3:
          this.assetExposureService.valueMonth = chart[0].chartData.valueMonth
          this.assetExposureService.highValueMonth = chart[0].chartData.highValueMonth
          this.assetExposureService.valueQuarter = chart[0].chartData.valueQuarter
          this.assetExposureService.highValueQuarter = chart[0].chartData.highValueQuarter
          this.assetExposureService.valueYear = chart[0].chartData.valueYear
          this.assetExposureService.highValueYear = chart[0].chartData.highValueYear
          this.assetExposureService.dateTypeForSlider = chart[0].chartData.dateTypeForSlider

          this.assetExposureService.selectedExchange = chart[0].chartData.exchange
          this.assetExposureService.selectedSector = chart[0].chartData.sector
          this.assetExposureService.selectedClient = chart[0].chartData.client

          this.assetExposureService.selectedUnderlying = chart[0].chartData.selectedUnderlying
          this.assetExposureService.selectedRedemptionDate = chart[0].chartData.selectedRedemptionDate
          this.assetExposureService.selectedProductExposure = chart[0].chartData.selectedProductExposure
          this.assetExposureService.selectedRedemptionExposure = chart[0].chartData.selectedRedemptionExposure

          this.assetExposureService.selectedOption = chart[0].chartData.selectedOption
          this.assetExposureService.selectedOption1 = chart[0].chartData.selectedOption1

          // Code commented by AdilP @05-10-2023     
          //LcmSimulationServiceService(2)
          break;

      }
    }
    else if (type === 'bar') {
      switch (id) {
        case 1:
          this.kiAndWorstOfPerformanceService.current_min_KI = chart[0].chartData.current_min_KI
          this.kiAndWorstOfPerformanceService.current_max_KI = chart[0].chartData.current_max_KI

          this.kiAndWorstOfPerformanceService.selectedCustomer = chart[0].chartData.client
          this.kiAndWorstOfPerformanceService.selectedUnderlying = chart[0].chartData.worstOfUnderlying

          this.kiAndWorstOfPerformanceService.selectedOption = chart[0].chartData.selectedOption
          this.kiAndWorstOfPerformanceService.selectedOption1 = chart[0].chartData.selectedOption1

          this.kiAndWorstOfPerformanceService.setBg1(chart[0].chartData.bg1)
          this.kiAndWorstOfPerformanceService.setBg2(chart[0].chartData.bg2)
          // Code commented by AdilP @05-10-2023     
          //LcmSimulationServiceService(4)
          break;

        case 2:
          this.koAndWorstOfPerformanceService.current_min_KO = chart[0].chartData.current_min_KO
          this.koAndWorstOfPerformanceService.current_max_KO = chart[0].chartData.current_max_KO

          this.koAndWorstOfPerformanceService.selectedCustomer = chart[0].chartData.client
          this.koAndWorstOfPerformanceService.selectedUnderlying = chart[0].chartData.worstOfUnderlying

          this.koAndWorstOfPerformanceService.selectedOption = chart[0].chartData.selectedOption
          this.koAndWorstOfPerformanceService.selectedOption1 = chart[0].chartData.selectedOption1

          this.koAndWorstOfPerformanceService.setBg1(chart[0].chartData.bg1)
          this.koAndWorstOfPerformanceService.setBg2(chart[0].chartData.bg2)
          // Code commented by AdilP @05-10-2023     
          //LcmSimulationServiceService(5)
          break;

        case 3:
          this.mtmAndKiFilterService.current_min_KI = chart[0].chartData.current_min_KI
          this.mtmAndKiFilterService.current_max_KI = chart[0].chartData.current_max_KI
          this.mtmAndKiFilterService.current_min_MTM = chart[0].chartData.current_min_MTM
          this.mtmAndKiFilterService.current_max_MTM = chart[0].chartData.current_max_MTM
          this.mtmAndKiFilterService.selectedUnderlying = chart[0].chartData.selectedUnderlying
          this.mtmAndKiFilterService.selectedCurrency = chart[0].chartData.selectedCurrency
          this.mtmAndKiFilterService.selectedPayOff = chart[0].chartData.selectedPayOff
          this.mtmAndKiFilterService.selectedCustomer = chart[0].chartData.selectedCustomer
          this.mtmAndKiFilterService.selectedOption = chart[0].chartData.selectedOption
          this.mtmAndKiFilterService.selectedOption1 = chart[0].chartData.selectedOption1

          this.mtmAndKiFilterService.setBg1(chart[0].chartData.bg1)
          this.mtmAndKiFilterService.setBg2(chart[0].chartData.bg2)
          // Code commented by AdilP @05-10-2023     
          //LcmSimulationServiceService(6)
          break;

        case 4:
          this.mtmAndKoFilterService.current_min_KO = chart[0].chartData.current_min_KO
          this.mtmAndKoFilterService.current_max_KO = chart[0].chartData.current_max_KO
          this.mtmAndKoFilterService.current_min_MTM = chart[0].chartData.current_min_MTM
          this.mtmAndKoFilterService.current_max_MTM = chart[0].chartData.current_max_MTM
          this.mtmAndKoFilterService.selectedUnderlying = chart[0].chartData.selectedUnderlying
          this.mtmAndKoFilterService.selectedCurrency = chart[0].chartData.selectedCurrency
          this.mtmAndKoFilterService.selectedPayOff = chart[0].chartData.selectedPayOff
          this.mtmAndKoFilterService.selectedCustomer = chart[0].chartData.selectedCustomer
          this.mtmAndKoFilterService.selectedOption = chart[0].chartData.selectedOption
          this.mtmAndKoFilterService.selectedOption1 = chart[0].chartData.selectedOption1

          this.mtmAndKoFilterService.setBg1(chart[0].chartData.bg1)
          this.mtmAndKoFilterService.setBg2(chart[0].chartData.bg2)
          // Code commented by AdilP @05-10-2023     
          //LcmSimulationServiceService(7)
          break;

      }
    }
    else if (type === 'doughnut' || type === 'treemap') {
      this.filterService.currentMinDate = new Date(chart[0].chartData.currentStartDate)
      this.filterService.currentMaxDate = new Date(chart[0].chartData.currentEndDate)
      this.filterService.selectedLabel = chart[0].chartData.selectedCurrency
      this.filterService.selectedCustomer = chart[0].chartData.selectedCustomer
      if (chart[0].chartData.selectedOption1Currency && chart[0].chartData.selectedOptionCurrency) {
        this.filterService.selectedOption1Currency = chart[0].chartData.selectedOption1Currency
        this.filterService.selectedOptionCurrency = chart[0].chartData.selectedOptionCurrency
      }
      if (chart[0].chartData.selectedOption1Payoff && chart[0].chartData.selectedOptionPayoff) {
        this.filterService.selectedOption1Payoff = chart[0].chartData.selectedOption1Payoff
        this.filterService.selectedOptionPayoff = chart[0].chartData.selectedOptionPayoff
      }
      // Code commented by AdilP @05-10-2023     
      //LcmSimulationServiceService(0)
    }
    else {
      // Code commented by AdilP @05-10-2023     
      //LcmSimulationServiceService(8)
    }
  }

  updateChart() {

    for (var i = 0; i < this.len; i++) {
      console.log(this.charts[i].chartId);
      console.log(this.charts[i].chartData);
      console.log(this.charts[i].chartType);


      switch (this.charts[i].chartType) {

        case 'bar': {
          if (this.charts[i].chartData.id == 1) {
            this.chart = new Chart(`${this.charts[i].chartId}`, {
              type: 'bar',
              data: {
                xLabels: this.charts[i].chartData.labels,
                datasets: [{
                  label: 'KI Distance(%)',
                  data: this.charts[i].chartData.data,
                  backgroundColor: this.charts[i].chartData.bg1,
                },
                {
                  label: 'Worst Of Performance(%)',
                  data: this.charts[i].chartData.data1,
                  backgroundColor: this.charts[i].chartData.bg2,
                }
                ],
              },
              options: {
                layout: {
                  padding: 20
                },

                responsive: false,
                maintainAspectRatio: false,
                datasets: {
                  bar: {
                    barPercentage: 1,
                    categoryPercentage: 0.6,
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
                        size: 13
                      }
                    },
                    border: {
                      color: 'white',
                      dash: [1, 5],
                      display: false
                    },
                    grid: {
                      color: '#808080',
                      drawTicks: false,
                    },
                    title: {
                      color: 'rgba(109,151,191,255)',
                      display: true,
                      text: 'KI Distance(%) and Worst Of Performance(%)',
                      font: {
                        size: 10
                      }
                    },
                    beginAtZero: true,
                    min: 0,
                    max: 120
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
                      text: 'ISIN',
                      font: {
                        size: 10
                      },

                    },
                    border: {
                      display: false,
                      color: 'white',
                    }
                  },

                },

                plugins: {
                  datalabels: {
                    display: false,
                    clip: true,
                    clamp: true,
                    anchor: 'end',
                    align: 'top',
                    color: 'white',
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
                        var pname = this.charts[i].chartData.productlist[tooltipItem.dataIndex]
                        var worstUnder = this.charts[i].chartData.worstList[tooltipItem.dataIndex]
                        var str = `Worst Of UnderLying: ${worstUnder}\nProduct Name: ${pname.substring(0, pname.indexOf("Strike"))}\n${pname.substring(pname.indexOf("Strike"), pname.indexOf("Coupon"))}\n${pname.substring(pname.indexOf("Coupon"))}`;
                        return str;
                      },
                    }

                  },
                  legend: {
                    align: 'end',
                    labels: {
                      color: 'white',
                      usePointStyle: true,
                      font: {
                        size: 10
                      }
                    }
                  }
                }

              },
            })
          }
          else if (this.charts[i].chartData.id == 2) {
            this.chart = new Chart(`${this.charts[i].chartId}`, {
              type: 'bar',
              data: {
                xLabels: this.charts[i].chartData.labels,
                datasets: [{
                  label: 'KO Distance(%)',
                  data: this.charts[i].chartData.data,
                  backgroundColor: this.charts[i].chartData.bg1,
                },
                {
                  label: 'Worst Of Performance(%)',
                  data: this.charts[i].chartData.data1,
                  backgroundColor: this.charts[i].chartData.bg2,
                }
                ],
              },
              options: {
                layout: {
                  padding: 20
                },

                responsive: false,
                maintainAspectRatio: false,
                datasets: {
                  bar: {
                    barPercentage: 1,
                    categoryPercentage: 0.6,
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
                        size: 13
                      }
                    },
                    border: {
                      color: 'white',
                      dash: [1, 5],
                      display: false
                    },
                    grid: {
                      color: '#808080',
                      drawTicks: false,
                    },
                    title: {
                      color: 'rgba(109,151,191,255)',
                      display: true,
                      text: 'KO Distance(%) and Worst Of Performance(%)',
                      font: {
                        size: 10
                      }
                    },
                    beginAtZero: true,
                    min: 0,
                    max: 120
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
                      text: 'ISIN',
                      font: {
                        size: 10
                      },

                    },
                    border: {
                      display: false,
                      color: 'white',
                    }
                  },

                },

                plugins: {
                  datalabels: {
                    display: false,
                    clip: true,
                    clamp: true,
                    anchor: 'end',
                    align: 'top',
                    color: 'white',
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
                        var pname = this.charts[i].chartData.productlist[tooltipItem.dataIndex]
                        var worstUnder = this.charts[i].chartData.worstList[tooltipItem.dataIndex]
                        var str = `Worst Of UnderLying: ${worstUnder}\nProduct Name: ${pname.substring(0, pname.indexOf("Strike"))}\n${pname.substring(pname.indexOf("Strike"), pname.indexOf("Coupon"))}\n${pname.substring(pname.indexOf("Coupon"))}`;
                        return str;
                      },
                    }

                  },
                  legend: {
                    align: 'end',
                    labels: {
                      color: 'white',
                      usePointStyle: true,
                      font: {
                        size: 10
                      }
                    }
                  }
                }

              },
            })
          }
          else if (this.charts[i].chartData.id == 3) {
            this.chart = new Chart(`${this.charts[i].chartId}`, {
              type: 'bar',
              data: {
                xLabels: this.charts[i].chartData.labels,
                datasets: [{
                  label: 'KI Distance(%)',
                  data: this.charts[i].chartData.data,
                  backgroundColor: this.charts[i].chartData.bg1,
                },
                {
                  label: 'MTM(%)',
                  data: this.charts[i].chartData.data1,
                  backgroundColor: this.charts[i].chartData.bg2,
                }
                ],
              },
              options: {
                layout: {
                  padding: 20
                },

                responsive: false,
                maintainAspectRatio: false,
                datasets: {
                  bar: {
                    barPercentage: 1,
                    categoryPercentage: 0.6,
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
                        size: 13
                      }
                    },
                    border: {
                      color: 'white',
                      dash: [1, 5],
                      display: false
                    },
                    grid: {
                      color: '#808080',
                      drawTicks: false,
                    },
                    title: {
                      color: 'rgba(109,151,191,255)',
                      display: true,
                      text: 'KI Distance(%) and MTM',
                      font: {
                        size: 10
                      }
                    },
                    beginAtZero: true,
                    min: 0,
                    max: 120
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
                      text: 'ISIN',
                      font: {
                        size: 10
                      },

                    },
                    border: {
                      display: false,
                      color: 'white',
                    }
                  },

                },

                plugins: {
                  datalabels: {
                    display: false,
                    clip: true,
                    clamp: true,
                    anchor: 'end',
                    align: 'top',
                    color: 'white',
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
                        var pname = this.charts[i].chartData.productlist[tooltipItem.dataIndex]
                        var worstUnder = this.charts[i].chartData.worstList[tooltipItem.dataIndex]
                        var str = `Worst Of UnderLying: ${worstUnder}\nProduct Name: ${pname.substring(0, pname.indexOf("Strike"))}\n${pname.substring(pname.indexOf("Strike"), pname.indexOf("Coupon"))}\n${pname.substring(pname.indexOf("Coupon"))}`;
                        return str;
                      },
                    }

                  },
                  legend: {
                    align: 'end',
                    labels: {
                      color: 'white',
                      usePointStyle: true,
                      font: {
                        size: 10
                      }
                    }
                  }
                }

              },
            })
          }
          else {
            this.chart = new Chart(`${this.charts[i].chartId}`, {
              type: 'bar',
              data: {
                xLabels: this.charts[i].chartData.labels,
                datasets: [{
                  label: 'KO Distance(%)',
                  data: this.charts[i].chartData.data,
                  backgroundColor: this.charts[i].chartData.bg1,
                },
                {
                  label: 'MTM(%)',
                  data: this.charts[i].chartData.data1,
                  backgroundColor: this.charts[i].chartData.bg2,
                }
                ],
              },
              options: {
                layout: {
                  padding: 20
                },

                responsive: false,
                maintainAspectRatio: false,
                datasets: {
                  bar: {
                    barPercentage: 1,
                    categoryPercentage: 0.6,
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
                        size: 13
                      }
                    },
                    border: {
                      color: 'white',
                      dash: [1, 5],
                      display: false
                    },
                    grid: {
                      color: '#808080',
                      drawTicks: false,
                    },
                    title: {
                      color: 'rgba(109,151,191,255)',
                      display: true,
                      text: 'KO Distance(%) and MTM',
                      font: {
                        size: 10
                      }
                    },
                    beginAtZero: true,
                    min: 0,
                    max: 120
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
                      text: 'ISIN',
                      font: {
                        size: 10
                      },

                    },
                    border: {
                      display: false,
                      color: 'white',
                    }
                  },

                },

                plugins: {
                  datalabels: {
                    display: false,
                    clip: true,
                    clamp: true,
                    anchor: 'end',
                    align: 'top',
                    color: 'white',
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
                        var pname = this.charts[i].chartData.productlist[tooltipItem.dataIndex]
                        var worstUnder = this.charts[i].chartData.worstList[tooltipItem.dataIndex]
                        var str = `Worst Of UnderLying: ${worstUnder}\nProduct Name: ${pname.substring(0, pname.indexOf("Strike"))}\n${pname.substring(pname.indexOf("Strike"), pname.indexOf("Coupon"))}\n${pname.substring(pname.indexOf("Coupon"))}`;
                        return str;
                      },
                    }

                  },
                  legend: {
                    align: 'end',
                    labels: {
                      color: 'white',
                      usePointStyle: true,
                      font: {
                        size: 10
                      }
                    }
                  }
                }

              },
            })

          }

          break;

        }
        case 'doughnut': {

          // this.avgSalesMarginList = this.charts[i].chart.avgSalesMarginList;
          // this.labels = this.charts[i].chart.labels;

          this.chart = new Chart(`${this.charts[i].chartId}`, {
            data: {
              labels: this.charts[i].chartData.labels,
              datasets: [{
                data: this.charts[i].chartData.data,
                backgroundColor: this.charts[i].chartData.backgroundColor,
                hoverOffset: this.charts[i].chartData.hoverOffset,
                borderWidth: this.charts[i].chartData.borderWidth,
                borderColor: this.charts[i].chartData.borderColor
              }]
            },
            type: this.charts[i].chartType,
            options: {
              responsive: false,
              cutout: "80%",
              backgroundColor: 'rgb(252, 252, 252)',
              plugins: {
                legend: {

                  title: {
                    text: this.charts[i].chartData.text,
                    display: true,
                    color: 'rgb(227, 228, 230)',
                    position: 'start',
                    font: {
                      size: 16
                    }
                  },
                  position: 'right',
                  labels: {
                    // padding: 20,
                    usePointStyle: true,
                    font: {
                      size: 13
                    },
                    color: 'rgb(227, 228, 230)'
                  }
                },
                datalabels: {
                  display: false
                },
                tooltip: {
                  displayColors: false,
                  callbacks: {
                    title(tooltipItems) {
                      return ""
                    },
                    label(tooltipItem) {
                      return ""
                    },
                    afterLabel: (tooltipItem) => {
                      // console.log(tooltipItem)
                      let valuestring
                      if (tooltipItem.raw > 1000000) {
                        valuestring = (tooltipItem.raw / 1000000).toFixed(2) + 'M'
                      }
                      else {
                        valuestring = (tooltipItem.raw / 1000).toFixed(2) + 'K'
                      }
                      let title = tooltipItem.chart.config._config.options.plugins.legend.title.text;
                      return `${title}: ${tooltipItem.label}\nTrade Volume(USD eqv.): ${valuestring}`
                    }

                  }
                  // mode: 'point',
                  // enabled: false,
                  // position: 'nearest',
                  // external: (ctx, index=i) => {
                  //   console.log(this.charts);
                  //   console.log(index);
                  //   console.log(i);
                  //   if(this.charts[index].chart.options.plugins.legend.title.text === 'Currency'){
                  //     this.externalTooltipHandler(ctx)
                  //   }else{
                  //     this.externalTooltipHandlerPayoff(ctx,this.charts[i].chart.avgSalesMarginList,this.charts[i].chart.labels)
                  //   }
                  // } 
                  // this.charts[i].chart.options.plugins.legend.title.text === 'Currency'? this.externalTooltipHandler: this.externalTooltipHandlerPayoff(this.charts[i].chart.avgSalesMarginList,this.charts[i].chart.labels)
                },

              }
            },
            //   plugins:[{
            //     id:'centertext',
            //     afterDatasetDraw:(chart)=> {
            //       let total=''
            //       if(chart.getDatasetMeta(0).data.length>0){
            //           var x = chart.getDatasetMeta(0).data[0].x,
            //           y = chart.getDatasetMeta(0).data[0].y,
            //           ctx = chart.ctx;
            //           let displayVolume = ''
            //         if (this.charts[i].total > 1000000) {
            //           displayVolume = (this.charts[i].total / 1000000).toString()
            //           total = displayVolume.substring(0, displayVolume.indexOf(".") + 3) + "M"
            //         }
            //         else {
            //           if (this.charts[i].total !== 0) {
            //             displayVolume = (this.charts[i].total / 1000).toString()
            //             total = displayVolume.substring(0, displayVolume.indexOf(".") + 3) + "K"
            //           }
            //         }
            //           var text = total
            //           ctx.textAlign='center'
            //           ctx.fillStyle='white'
            //           ctx.font ='32px Roboto'
            //           ctx.fillText(text,x,y)
            //           ctx.save();
            //       }
            //     }
            //   },
            //   {
            //     id:'title',
            //     afterDatasetDraw: function(chart) {
            //       if(chart.getDatasetMeta(0).data.length>0){
            //         var x = chart.getDatasetMeta(0).data[0].x,
            //           y = chart.getDatasetMeta(0).data[0].y,
            //           ctx = chart.ctx;
            //           var text = "Trade Volume($ eqv.)"
            //           ctx.textAlign='center'
            //           ctx.fillStyle='white'
            //           ctx.font ='16px Roboto'
            //           ctx.fillText(text,x,y+25)
            //           ctx.save();
            //       }

            //     }
            //   }
            // ]
          });
          this.chart.update();
          //console.log(this.chart);
          break;
        }
        case 'treemap': {
          this.chart = new Chart(`${this.charts[i].chartId}`, {
            data: {
              labels: this.charts[i].chartData.labels,
              datasets: [{
                tree: this.charts[i].chartData.tree,
                data: this.charts[i].chartData.data,
                // backgroundColor: this.charts[i].chart.backgroundColor,
                spacing: this.charts[i].chartData.spacing,
                key: this.charts[i].chartData.key,
                groups: this.charts[i].chartData.groups,
                borderWidth: this.charts[i].chartData.borderWidth,
                borderColor: this.charts[i].chartData.borderColor,
                backgroundColor: (ctx) => this.colorFromRaw(ctx),
                labels: {
                  display: true,
                  color: 'white',
                  position: 'bottom',
                  align: 'right',
                  formatter: (ctx) => {
                    // console.log(ctx)
                    let value = 0
                    let valuestring
                    if (ctx.raw.v > 1000000) {
                      value = ctx.raw.v / 1000000;
                      valuestring = '$' + value.toFixed(2) + 'M'
                    }
                    else {
                      value = ctx.raw.v / 1000;
                      valuestring = '$' + value.toFixed(2) + 'K'
                    }
                    return [ctx.raw.g, valuestring]
                  },
                  font: {
                    size: 15
                  }

                },
              }]
            },
            type: this.charts[i].chartType,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  displayColors: false,
                  callbacks: {
                    title(tooltipItems) {
                      return ""
                    },
                    label(tooltipItem) {
                      return ""
                    },
                    afterLabel: (tooltipItem) => {
                      //  console.log(tooltipItem)
                      let valuestring
                      if (tooltipItem.raw.v > 1000000) {
                        valuestring = (tooltipItem.raw.v / 1000000).toFixed(2) + 'M'
                      }
                      else {
                        valuestring = (tooltipItem.raw.v / 1000).toFixed(2) + 'K'
                      }
                      let title = tooltipItem.chart.config._config.data.datasets[0].groups[0];
                      return `${title}: ${tooltipItem.raw.g}\nTrade Revenue(USD eqv.): ${valuestring}`
                    }

                  }
                  // mode: 'point',
                  // enabled: false,
                  // position: 'nearest',
                  // external: (ctx, index=i) => {
                  //   console.log(this.charts);
                  //   console.log(index);
                  //   console.log(i);
                  //   if(this.charts[index].chart.options.plugins.legend.title.text === 'Currency'){
                  //     this.externalTooltipHandler(ctx)
                  //   }else{
                  //     this.externalTooltipHandlerPayoff(ctx,this.charts[i].chart.avgSalesMarginList,this.charts[i].chart.labels)
                  //   }
                  // } 
                  // this.charts[i].chart.options.plugins.legend.title.text === 'Currency'? this.externalTooltipHandler: this.externalTooltipHandlerPayoff(this.charts[i].chart.avgSalesMarginList,this.charts[i].chart.labels)
                },
                legend: {
                  display: false
                },
                datalabels: {
                  display: false
                }
              }
            }
          });
          this.chart.update();
          //console.log(this.chart);
          break;
        }
        case "bubble": {
          // console.log(this.charts[i].chart.id)
          if (this.charts[i].chartData.id == 11) {
            this.chart = new Chart(`${this.charts[i].chartId}`, {
              type: 'bubble',
              data: {
                labels: this.charts[i].chartData.labels,
                datasets: [{
                  data: this.charts[i].chartData.data,
                  backgroundColor: this.charts[i].chartData.backgroundColor,
                  hoverRadius: 10,
                }]
              },

              options: {
                // maintainAspectRatio:false,
                responsive: false,
                plugins: {
                  legend: {
                    display: false,
                    labels: {
                      color: 'white',
                      usePointStyle: true,
                      font: {
                        size: 16
                      }
                    }
                  },
                  datalabels: {

                    color: '#fff',
                    clamp: true,
                    anchor: 'end',
                    align: 'end',
                    display: false

                  },
                  tooltip: {
                    displayColors: false,
                    backgroundColor: "rgba(70,70,70)",
                    callbacks: {
                      title(tooltipItems) {
                        return ""
                      },
                      label() {
                        return 'KI Probabilities & Distance'
                      },
                      afterLabel: (tooltipItem) => {
                        // console.log(tooltipItem)
                        var id = tooltipItem.label
                        var kiProbability = (this.apiDataBarrierProbability1[tooltipItem.dataIndex].KIProbability * 100).toFixed(2)
                        var kiDistance = this.apiDataBarrierProbability1[tooltipItem.dataIndex].KIDistance.toFixed(2)
                        var productName = this.apiDataBarrierProbability1[tooltipItem.dataIndex].ProductName
                        return `Product ID:        ${tooltipItem.label}\nKI Distance:      ${kiDistance}\nKI Probabilty:    ${kiProbability} `
                      },
                    }
                  },

                },
                scales: {
                  x: {
                    max: 70,
                    min: 0,
                    border: {
                      display: false,
                      color: "rgba(172,172,172,255)"
                    },

                    offset: true,
                    type: 'category',
                    ticks: {
                      color: 'rgba(172,172,172,255)' // set color of x-axis ticks to red
                    },
                    title: {
                      color: 'rgba(109,151,191,255)',
                      display: true,
                      text: 'ProductID',
                      font: {
                        size: 15
                      }
                    },
                  },
                  y: {
                    position: 'top',
                    beginAtZero: true,
                    border: {
                      display: false,
                      color: "rgba(172,172,172,255)",
                      dash: [1, 5]
                    },
                    grid: {
                      color: "rgba(172,172,172,255)",
                      tickLength: 2,

                    },

                    ticks: {
                      color: 'rgba(172,172,172,255)',
                      count: 3,// set color of x-axis ticks to red

                    },

                    title: {
                      color: 'rgba(109,151,191,255)',
                      display: true,
                      text: 'KI Probabilty',
                      font: {
                        size: 15
                      }
                    },
                    min: 0,
                    max: 100,
                  },
                }
              },

            })
          }
          else if (this.charts[i].chartData.id == 12) {
            this.chart = new Chart(`${this.charts[i].chartId}`, {
              type: 'bubble',
              data: {
                labels: this.charts[i].chartData.labels,
                datasets: [{
                  data: this.charts[i].chartData.data,
                  backgroundColor: this.charts[i].chartData.backgroundColor,
                  hoverRadius: 10,
                }]
              },

              options: {
                // maintainAspectRatio:false,
                responsive: false,
                plugins: {
                  legend: {
                    display: false,
                    labels: {
                      color: 'white',
                      usePointStyle: true,
                      font: {
                        size: 16
                      }
                    }
                  },
                  datalabels: {

                    color: '#fff',
                    clamp: true,
                    anchor: 'end',
                    align: 'end',
                    display: false

                  },
                  tooltip: {
                    displayColors: false,
                    backgroundColor: "rgba(70,70,70)",
                    callbacks: {
                      title(tooltipItems) {
                        return ""
                      },
                      label() {
                        return 'KO Probabilities & Distance'
                      },
                      afterLabel: (tooltipItem) => {
                        // console.log(tooltipItem)
                        var id = tooltipItem.label
                        var koProbability = (this.apiDataBarrierProbability2[tooltipItem.dataIndex].KOProbability * 100).toFixed(2)
                        var koDistance = this.apiDataBarrierProbability2[tooltipItem.dataIndex].KODistance.toFixed(2)
                        var productName = this.apiDataBarrierProbability2[tooltipItem.dataIndex].ProductName
                        return `Product ID:        ${tooltipItem.label}\nKO Distance:      ${koDistance}\nKO Probabilty:    ${koProbability} `
                      },
                    }
                  },

                },
                scales: {
                  x: {
                    max: 70,
                    min: 0,
                    border: {
                      display: false,
                      color: "rgba(172,172,172,255)"
                    },

                    offset: true,
                    type: 'category',
                    ticks: {
                      color: 'rgba(172,172,172,255)' // set color of x-axis ticks to red
                    },
                    title: {
                      color: 'rgba(109,151,191,255)',
                      display: true,
                      text: 'ProductID',
                      font: {
                        size: 15
                      }
                    },
                  },
                  y: {
                    position: 'top',
                    beginAtZero: true,
                    border: {
                      display: false,
                      color: "rgba(172,172,172,255)",
                      dash: [1, 5]
                    },
                    grid: {
                      color: "rgba(172,172,172,255)",
                      tickLength: 2,

                    },

                    ticks: {
                      color: 'rgba(172,172,172,255)',
                      count: 3,// set color of x-axis ticks to red

                    },

                    title: {
                      color: 'rgba(109,151,191,255)',
                      display: true,
                      text: 'KO Probabilty',
                      font: {
                        size: 15
                      }
                    },
                    min: 0,
                    max: 100,
                  },
                }
              },

            })
          }
          else if (this.charts[i].chartData.id == 2) {
            this.chart = new Chart(`${this.charts[i].chartId}`, {
              type: 'bubble',
              data: {
                labels: this.charts[i].chartData.labels,
                datasets: [{
                  data: this.charts[i].chartData.data,
                  backgroundColor: this.charts[i].chartData.backgroundColor,
                  hoverRadius: 10,
                }]
              },
              options: {

                responsive: false,
                // maintainAspectRatio:false,
                scales: {
                  x: {
                    offset: false,
                    title: {
                      color: 'rgba(109,151,191,255)',
                      display: true,
                      text: 'KI Distance(%)',
                      font: {
                        size: 15
                      }
                    },
                    // min: this.minKID,
                    // max: this.maxKID,
                    grid: {
                      //color:'#5a5a5a',
                      color: (context) => {
                        //console.log(context.tick.value)
                        if (context.tick.value === 0)
                          return '#5a5a5a'
                        else
                          return '#000000'

                      }
                    },
                    border: {

                      dash: [2, 8],
                    },
                    ticks: {
                      color: 'rgb(180,180,180)'

                    },

                  },
                  y: {
                    offset: false,
                    title: {
                      color: 'rgba(109,151,191,255)',
                      display: true,
                      text: 'KO Distance(%)',
                      font: {
                        size: 15
                      }
                    },
                    grid: {
                      color: (context) => {
                        //console.log(context.tick.value)
                        if (context.tick.value === 0)
                          return '#5a5a5a'
                        else
                          return '#000000'

                      }
                    },
                    ticks: {
                      color: 'rgb(180,180,180)'

                    },
                    border: {
                      dash: [2, 8],
                    },
                    // min: this.minKOD-45,
                    // max: this.maxKOD,
                  }
                },
                plugins: {
                  legend: {
                    display: false,
                    align: 'end',
                    labels: {
                      color: 'rgb(180,180,180)',
                      usePointStyle: true,
                      font: {
                        size: 15
                      }
                    }
                  },
                  datalabels: {
                    display: false
                  },
                  tooltip: {
                    displayColors: false,
                    backgroundColor: 'rgba(70,70,70,0.8)',
                    callbacks: {
                      title(tooltipItems) {
                        return ""
                      },
                      label() {
                        return ``
                      },
                      afterLabel: (tooltipItem) => {
                        ////console.log(this.apidata);
                        // //console.log(this.apiData[tooltipItem.dataIndex].Notional);
                        //console.log(this.apiData)
                        var pname = this.apiDataBarrierWatch[tooltipItem.dataIndex].ProductName;

                        var ko = this.apiDataBarrierWatch[tooltipItem.dataIndex].KODistance
                        var ki = this.apiDataBarrierWatch[tooltipItem.dataIndex].KIDistance
                        var pi = this.apiDataBarrierWatch[tooltipItem.dataIndex].ProductID
                        var no = this.apiDataBarrierWatch[tooltipItem.dataIndex].eqvNotional
                        var asst = this.apiDataBarrierWatch[tooltipItem.dataIndex]['Asset'];
                        var str = `Product ID: ${pi}\nKO Distance(%): ${ko}\nKI Distance(%): ${ki}\n$ Eqv. Notional: ${no}`;
                        //var str = `Product Name: ${this.apidata[tooltipItem.dataIndex].Product_Name}`;
                        return str;
                      },
                    }
                  }
                },

              },

            })
          }
          else {
            // var dataList = this.charts[i].chartData.tooltipList
            // var redemption = this.charts[i].chartData.Redemption
            // var displayExposure = this.charts[i].chartData.displayExposureList
            // this.chart = new Chart(
            //   `${this.charts[i].chartId}`, {
            //     data: this.charts[i].chartData.data,
            //     type: 'bubble',
            //     options: {
            //       layout: {
            //         padding: 10,
            //       },
            //       plugins: {
            //         datalabels: {
            //           display: false,
            //           clamp: true,
            //         },
            //         legend: {
            //           display: false,
            //         },
            //         // tooltip: {
            //         //   bodyFont: { size: 13 },
            //         //   displayColors: false,
            //         //   callbacks: {
            //         //     title(tooltipItems) {
            //         //       return '';
            //         //     },
            //         //     label() {
            //         //       return '  ';
            //         //     },
            //         //     afterLabel: (tooltipItem) => {
            //         //       console.log("bubble",id,probabilty,redemption,exposure)

            //         //       var id = tooltipItem.label;
            //         //       var probabilty =
            //         //       dataList[tooltipItem.dataIndex]['y'].toFixed(4);
            //         //       var exposure =
            //         //       displayExposure[
            //         //           tooltipItem.dataIndex
            //         //         ].toLocaleString();
            //         //       var redeemptionDate =
            //         //       redemption[tooltipItem.dataIndex];
            //         //         // console.log("bubble",id,probabilty,this.redeemptionDate,exposure)
            //         //       return ` Underlying: ${id}\n Probability: ${probabilty} \n Exposure: ${exposure} \n Earliest RedeemptionDate: ${redeemptionDate}`;
            //         //     },
            //         //   },
            //         // },
            //       },  
            //       scales: {
            //         x: {
            //           offset: true,
            //           type: 'category',
            //           ticks: { color: 'grey', font: { size: 12,  } },
            //           // fontSize: 40,
            //           title: {
            //             display: true,
            //             text: 'Underlying',
            //             font: {
            //               size: 15,
            //               weight: '',
            //             },
            //             color: '#7c9db5',
            //           },
            //         },
            //         y: {
            //           // offset: true,
            //           beginAtZero: false,
            //           ticks: { color: 'grey', font: { size: 12 } },
            //           grid: {
            //             display: true,
            //             color: '#808080',
            //             tickBorderDash: [1, 5],
            //           },
            //           // min: this.charts[i].chartData.min,
            //           // max: this.charts[i].chartData.max,
            //           border: {
            //             // dashOffset:true,
            //             dash: [2, 4],
            //           },
            //           title: {
            //             display: true,
            //             text: 'Next Redemption Wt. Avg. Probability',
            //             font: {
            //               size: 15,
            //               weight: '',
            //             },
            //             color: '#39729e',
            //           },
            //         },
            //       },

            //       responsive: true,
            //       interaction: {
            //         mode: 'nearest',
            //       },
            //       animations: {
            //         tension: {
            //           duration: 1000,
            //           easing: 'linear',
            //           from: 1,
            //           to: 0,
            //           loop: true,
            //         },
            //       }, // plugins: { // zoom: { //   zoom: { //     wheel: { //       enabled: true, //     }, //     pinch: { //       enabled: true, //     }, //     mode: 'y', //   }, // }, // },
            //     }
            //   }
            // );
            this.chart = new Chart(`${this.charts[i].chartId}`, {
              type: 'bubble',
              data: this.charts[i].chartData.data,

              options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                    labels: {
                      color: 'white',
                      usePointStyle: true,
                      font: {
                        size: 16
                      }
                    }
                  },
                  tooltip: {
                    enabled: false
                    //   bodyFont: { size: 15 },
                    //   displayColors: false,
                    //   callbacks: {
                    //     title(tooltipItems) {
                    //       return '';
                    //     },
                    //     label() {
                    //       return '';
                    //     },
                    //     afterLabel: (tooltipItem) => {
                    //       let id = tooltipItem.label;
                    //       console.log(tooltipItem)
                    //       this.data1[tooltipItem.dataIndex]['y'].toFixed(4);
                    //       let index=this.label.indexOf(id)
                    //       let temp:pbi_data=this.originalData[index]
                    //       return ` Underlying: ${id}\n Probability: ${temp['probability']} \n Exposure: ${temp['next_red_exp']} \n Earliest Redemption Date: ${this.datepipe.transform(temp['redemptionDate'],'EEE dd MMM yyyy')}`;
                    //     },
                    //   },
                  },
                  datalabels: {

                    color: '#fff',
                    clamp: true,
                    anchor: 'end',
                    align: 'end',
                    display: false

                  },
                },
                scales: {
                  x: {
                    offset: true,
                    max: 70,
                    min: 0,
                    border: {
                      display: false,
                      color: "rgba(172,172,172,255)"
                    },

                    // offset:true,
                    type: 'category',
                    ticks: {
                      color: 'rgba(172,172,172,255)' // set color of x-axis ticks to red
                    },
                    title: {
                      color: 'rgba(109,151,191,255)',
                      display: true,
                      text: 'Underlying',
                      font: {
                        size: 15
                      }
                    },

                  },
                  y: {
                    min: 0,
                    position: 'top',
                    beginAtZero: true,
                    border: {
                      display: false,
                      color: "rgba(172,172,172,255)",
                      dash: [1, 5]
                    },
                    grid: {
                      color: "rgba(172,172,172,255)",
                      tickLength: 5,

                    },

                    ticks: {
                      color: 'rgba(172,172,172,255)',
                      count: 6,

                    },

                    title: {
                      color: 'rgba(109,151,191,255)',
                      display: true,
                      text: 'Next Redemption Wt.Avg Probability',
                      font: {
                        size: 15
                      }
                    },
                  },
                }
              },

            })
          }
        }
      }
      console.log(this.charts);
      this.chart.update()


    }

  }

  ngOnInit() {
    this.apiDataBarrierProbability1 = this.reportService.filterDataKI
    this.apiDataBarrierProbability2 = this.reportService.filterDataKO
    this.apiDataBarrierWatch = this.barrierWatchService.filterData
    this.charts = [...this.dashboardService.chart]
    this.len = this.charts.length;
    setTimeout(() => {
      this.updateChart();
    }, 0);


    this.dashboardService.chartEvent1.subscribe((val) => {
      setTimeout(() => {
        this.updateChart();
      }, 0);
    })
  }

}
