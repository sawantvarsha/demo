import { Component, OnInit } from '@angular/core';
import { FilterService } from '../filter.service';
import Chart from 'chart.js/auto';
import { DashboardServiceService } from '../../galaxy-dashboard/dashboard-service.service';
import { BIReportsComponent } from '../../bireports.component';
import { SalesAndRevenuePerformanceComponent } from '../sales-and-revenue-performance.component';

@Component({
  selector: 'app-doughnut-chart-payoff',
  templateUrl: './doughnut-chart-payoff.component.html',
  styleUrls: ['./doughnut-chart-payoff.component.css']
})
export class DoughnutChartPayoffComponent implements OnInit {
  prevLabel: string = '';
  totalVolume:number=this.service.totalVolume

  constructor(private service: FilterService, private dashboardService: DashboardServiceService,private bIReportsComponent:BIReportsComponent,private salesAndRevenuePerformanceComponent:SalesAndRevenuePerformanceComponent) {

  }

  selectedLabel?: string
  chart2: any;
  selected?: number;
  select = false;
  labels!: string[];
  currency!: string[];
  avgSalesMarginList!: string[]
  selectedOptionPayoff: string = 'Ascending'
  selectedOption1Payoff: string = 'PayOff'
  dataForPayOff: any[] = []

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


  data!: number[];
  newBackgroundColor: string[] =
    ['rgba(3,32,53,255)',
      'rgba(23,46,63,255)',
      'rgba(11,28,39,255)',
      'rgba(32,50,62,255)',
      'rgba(61,83,99,255)',
      'rgb(120, 153, 173, 1)'
    ];

  ngOnInit(): void {
    this.selectedOptionPayoff = this.service.selectedOptionPayoff
    this.selectedOption1Payoff = this.service.selectedOption1Payoff
    this.setComponentProperties();
    this.chart2 = new Chart("sarchart4", {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'USD eqv Trade Volume By PayOff',
          data: this.data,
          backgroundColor: this.originalBackgroundColor,
          hoverOffset: 10,
          borderWidth: 1,
          borderColor:'black'
        }]
      },

      options: {
        maintainAspectRatio: false,
        cutout: "80%",
        // radius: 120,
        backgroundColor: 'rgb(252, 252, 252)',
        onClick: (e, elements, chart) => {
          let selectedindex = elements[0].index
          let label = this.labels[selectedindex]
          if (this.prevLabel !== label && this.select === true) {
            this.select = false
          }

          if (this.select === false && this.prevLabel !== label) {
            this.prevLabel = label
            this.chartSelectedProperties()
            this.setChartProperties()
            this.selected = this.labels.indexOf(label)
            this.highlightElement(this.selected)
            this.select = true
            this.service.destroySelected()
            this.service.selectedChart = 4
            this.service.currentSelectedPayOff = label
          } else {
            this.chartSelectedProperties()
            this.setChartProperties()
            this.select = false
            this.prevLabel = ''
            this.service.destroySelected()
            this.service.selectedChart = 0
            this.service.currentSelectedPayOff = "All"
            this.chart2.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
          }

          this.chart2.update();
          this.service.dateCurrencyAndPayOffFilter();
          this.service.tradeForVolumeByPayOffSelectedEvent.emit()
        },
        responsive: true,
        plugins: {
          tooltip: {
            enabled: false,
            position: 'nearest',
            external: this.externalTooltipHandler
          },
          legend: {
            
            title: {
              text: "PayOff",
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
          }
        }
      },
      plugins:[{
        id:'centertext',
        afterDatasetDraw:(chart)=> {
          let total=''
          if(chart.getDatasetMeta(0).data.length>0){
              var x = chart.getDatasetMeta(0).data[0].x,
              y = chart.getDatasetMeta(0).data[0].y,
              ctx = chart.ctx;
              let displayVolume: string = ''
            if (this.totalVolume > 1000000) {
              displayVolume = (this.totalVolume / 1000000).toString()
              total = displayVolume.substring(0, displayVolume.indexOf(".") + 3) + "M"
            }
            else {
              if (this.totalVolume !== 0) {
                displayVolume = (this.totalVolume / 1000).toString()
                total = displayVolume.substring(0, displayVolume.indexOf(".") + 3) + "K"
              }
            }
              var text = total
              ctx.textAlign='center'
              ctx.fillStyle='white'
              ctx.font ='32px Roboto'
              ctx.fillText(text,x,y)
              ctx.save();
          }
        }
      },
      {
        id:'title',
        afterDatasetDraw: function(chart) {
          if(chart.getDatasetMeta(0).data.length>0){
            var x = chart.getDatasetMeta(0).data[0].x,
              y = chart.getDatasetMeta(0).data[0].y,
              ctx = chart.ctx;
              var text = "Trade Volume($ eqv.)"
              ctx.textAlign='center'
              ctx.fillStyle='white'
              ctx.font ='16px Roboto'
              ctx.fillText(text,x,y+25)
              ctx.save();
          }
          
        }
      }
    ]
    })

    this.service.dataReceived.subscribe(() => {
      this.setComponentProperties()
      this.setChartProperties()
      this.chart2.update();
    });

    this.service.sendStateDataEvent.subscribe(() => {
      this.selectedOptionPayoff = this.service.selectedOptionPayoff
      this.selectedOption1Payoff = this.service.selectedOption1Payoff
      this.prevLabel=''
      if (this.service.selectedChart === 4) {
        this.chartSelectedProperties()
        if (this.prevLabel !== this.service.currentSelectedPayOff && this.select === true) {
          this.select = false
        }
        if (this.select === false && this.prevLabel !== this.service.currentSelectedPayOff) {
          this.prevLabel = this.service.currentSelectedPayOff
          this.selected = this.labels.indexOf(this.service.currentSelectedPayOff)
          this.highlightElement(this.selected)
          this.select = true
        }
      }
      else {
        this.setComponentProperties()
        this.chart2.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
      }
      this.setChartProperties();
      this.chart2.update();
    })

    this.service.dateFilterEvent.subscribe(() => {
      if (this.select === true) {
        this.chartSelectedProperties()
        this.setChartProperties();
        this.highlightConsistent()
        this.chart2.update();
      }
      else {
        this.setComponentProperties()
        this.setChartProperties();
        this.chart2.update();
      }
    })

    this.service.filterSelectedEvent.subscribe(() => {
      if (this.select === true) {
        this.chartSelectedProperties()
        this.setChartProperties();
        this.highlightConsistent()
        this.chart2.update();
      }
      else {
        this.setComponentProperties()
        this.setChartProperties();
        this.chart2.update();
      }
    })

    this.service.tradeForRevenueByPayOffSelectedEvent.subscribe((label) => {
      this.setComponentProperties()
      this.setChartProperties()
      this.select = false
      this.chart2.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
      this.prevLabel = ""
      this.chart2.update();
    })

    this.service.tradeForVolumeByCurrencySelectedEvent.subscribe(() => {
      this.setComponentProperties()
      this.setChartProperties()
      this.select = false
      this.chart2.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
      this.prevLabel = ""
      this.chart2.update();
    })

    this.service.tradeForRevenueByCurrencySelectedEvent.subscribe(() => {
      this.setComponentProperties()
      this.setChartProperties()
      this.select = false
      this.chart2.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
      this.prevLabel = ""
      this.chart2.update();
    })
    //============================================
    this.service.filterEvent2.subscribe(() => {
      this.selectedOptionPayoff = this.service.selectedOptionPayoff
      this.selectedOption1Payoff = this.service.selectedOption1Payoff
      if (this.select === true) {
        this.chartSelectedProperties()
        this.setChartProperties();
        this.highlightConsistent()
        this.chart2.update();
      }
      else {
        this.setComponentProperties()
        this.setChartProperties();
        this.chart2.update();
      }
    })
    //============================================

    this.service.setTotalEvent.subscribe(()=>{
      this.totalVolume=this.service.totalVolume;
      
    })
  }

  pinChart(e: any, title) {
    this.salesAndRevenuePerformanceComponent.pinned()
    e.preventDefault();
    const currentStartDate = new Date(this.service.currentMinDate);
    const currentEndDate = new Date(this.service.currentMaxDate);
    const selectedCurrency = this.service.selectedLabel;
    const selectedCustomer = this.service.selectedCustomer;
    const selectedOption1Payoff = this.service.selectedOption1Payoff
    const selectedOptionPayoff = this.service.selectedOptionPayoff

    const data = this.chart2.config._config.data.datasets[0].data;
    const type = this.chart2.config._config.type;
    const labels = this.chart2.config._config.data.labels;
     const options = this.chart2.config._config.options;
     const backgroundColor = this.originalBackgroundColor;
    const borderWidth = 1;
    const borderColor= 'black';
    const text = 'PayOff';
    let avgSalesMarginList = this.avgSalesMarginList
    //console.log(avgSalesMarginList);
    const chart = {
      data, labels, backgroundColor, borderColor, borderWidth, title, avgSalesMarginList, text,currentStartDate,currentEndDate,selectedCurrency,selectedCustomer,selectedOption1Payoff,
      selectedOptionPayoff
    }

    // const chart = {
    //   data, labels, options, backgroundColor, borderColor, borderWidth
    // }

    //debugger
    //console.log(this.chartGraph);
    //this.applicationService.setChart(data,type,options);
    this.bIReportsComponent.setChart({type, chart});
  }

  setChartProperties() {
    this.chart2.config.data.labels = this.labels
    this.chart2.config.data.datasets[0].data = this.data
    //this.chart2.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
  }

  setComponentProperties() {
    this.totalVolume=this.service.totalVolume
    this.dataForPayOff = this.service.getDataByPayOff()
    this.labels = []
    let avgSalesMargin: string = ''
    // dataForPayOff.sort((a,b)=>a.value-b.value)
    // dataForPayOff.sort((a,b)=>b.value-a.value)
    // dataForPayOff.sort((a,b)=>b.title.localeCompare(a.title))
    let avgSalesMarginList: string[] = []
    // dataForPayOff.sort((a,b)=>a.title.localeCompare(b.title))
    if (this.selectedOptionPayoff === 'Ascending') {
      if (this.selectedOption1Payoff == 'PayOff')
        this.dataForPayOff.sort((a, b) => (a.title).localeCompare(b.title))
      else
        this.dataForPayOff.sort((a, b) => a[this.selectedOption1Payoff] - b[this.selectedOption1Payoff])
    }
    else {
      if (this.selectedOption1Payoff == 'PayOff')
        this.dataForPayOff.sort((a, b) => (b.title).localeCompare(a.title))
      else
        this.dataForPayOff.sort((a, b) => b[this.selectedOption1Payoff] - a[this.selectedOption1Payoff])
    }

    let labels: string[] = []
    this.data = this.dataForPayOff.map((data) => {
      this.labels = [...this.labels, data['title']]
      avgSalesMargin = (1 / (data['volume'] / data['revenue']) * 100).toFixed(2) + "%"
      avgSalesMarginList = [...avgSalesMarginList, avgSalesMargin]
      return data['volume']
    })
    this.avgSalesMarginList = [...avgSalesMarginList]
  }


  highlightElement(selected: number) {
    var temp = [...this.originalBackgroundColor];
    for (var i = 0; i < temp.length; i++) {
      if (selected === i) {
        continue;
      }
      temp[i] = this.newBackgroundColor[i];
    }

    this.chart2.config.data.datasets[0].backgroundColor = temp;
    this.chart2.update();
  }


  getOrCreateTooltip = (chart: any) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.background = 'rgb(31, 30, 30)';
      tooltipEl.style.borderRadius = '3px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';

      const div = document.createElement('div');
      div.style.margin = '0px';
      tooltipEl.appendChild(div);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  externalTooltipHandler = (context: any) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = this.getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set Text
    if (tooltip.body) {
      //console.log(tooltip)
      const value = tooltip.dataPoints[0].raw;
      let titleForTooltip = tooltip.dataPoints[0].label;
      let avgSalesMargin = this.avgSalesMarginList[this.labels.indexOf(titleForTooltip)]
      let imgPath = `http://1europe.test-equity-connect.com/ClientSelfServicePortal/assets/eqcicons-blue/${titleForTooltip}-dark.png`
      let valuestring
      const div = document.createElement('div')

      let displayVolume: string = ''
      if (value > 1000000) {
        displayVolume = (value / 1000000).toString()
        valuestring = displayVolume.substring(0, displayVolume.indexOf(".") + 3) + "M"
      }
      else {
        if (value !== 0) {
          displayVolume = (value / 1000).toString()
          valuestring = displayVolume.substring(0, displayVolume.indexOf(".") + 3) + "K"
        }
      }


      const container = tooltipEl.querySelector('div');
      container.style.width = "240px"
      container.style.height = '150px'
      container.style.display = 'grid'


      while (container.firstChild)
        container.firstChild.remove()

      let string = `<div style="display: grid;grid-template-columns: 60% 40%;grid-template-rows: 50% 50%;row-gap: 10px;column-gap: 10px;height: 90%;width: 95%;z-index: 12;">
      <div style="grid-row: 1/ span 1;grid-column: 1/span 1;">
          <div style="display: flex;justify-content: center;align-items: center;width:100%;height:100%;background-color: rgb(3, 3, 3);text-align:center;font-size:16px">
          <div>
          <div style="font-size:25px;margin-bottom:5px">${avgSalesMargin}</div>
          Margin
      </div>
          </div>
      </div>
      <div style="grid-row: 1/ 2;grid-column: 2/span 1;background-color: rgb(3, 3, 3);padding-left:20px;padding-top:10px">
        <img src=${imgPath} style='height:50px;width:50px'><img>
      </div>
      <div style="grid-row: 2/ span 1;grid-column: 1/ span 2;">
          <div style="display: flex;justify-content: center;align-items: center;width:100%;height:100%;background-color: rgb(3, 3, 3);font-size:16px"">
          <div>
          <div style="text-align: center;font-size:25px">${valuestring}</div>
            $ Eqv. Volume
          </div>
           </div>
      </div>
  </div>`
      container.innerHTML = string
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.befor
    tooltipEl.style.opacity = 0.9;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    if (tooltipEl.caretY < 200)
      tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    else {
      tooltipEl.style.top = positionY + tooltip.caretY - 40 + 'px';
    }
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  };

  chartSelectedProperties() {
    this.totalVolume=this.service.totalVolume
    this.dataForPayOff = this.service.selectedChartPayOffFilter()
    this.labels = []
    let avgSalesMargin: string = ''
    // dataForPayOff.sort((a,b)=>a.value-b.value)
    // dataForPayOff.sort((a,b)=>b.value-a.value)
    // dataForPayOff.sort((a,b)=>b.title.localeCompare(a.title))
    if (this.selectedOptionPayoff === 'Ascending') {
      if (this.selectedOption1Payoff === 'PayOff')
        this.dataForPayOff.sort((a, b) => (a.title).localeCompare(b.title))
      else
        this.dataForPayOff.sort((a, b) => a[this.selectedOption1Payoff] - b[this.selectedOption1Payoff])
    }
    else {
      if (this.selectedOption1Payoff === 'PayOff')
        this.dataForPayOff.sort((a, b) => (b.title).localeCompare(a.title))
      else
        this.dataForPayOff.sort((a, b) => b[this.selectedOption1Payoff] - a[this.selectedOption1Payoff])
    }
    let avgSalesMarginList: string[] = []
    // this.dataForPayOff.sort((a, b) => a.title.localeCompare(b.title))
    let labels: string[] = []
    this.data = this.dataForPayOff.map((data) => {
      this.labels = [...this.labels, data['title']]
      avgSalesMargin = (1 / (data['volume'] / data['revenue']) * 100).toFixed(2) + "%"
      avgSalesMarginList = [...avgSalesMarginList, avgSalesMargin]
      return data['volume']
    })
    this.avgSalesMarginList = [...avgSalesMarginList]
  }
  highlightConsistent() {
    let index = this.labels.indexOf(this.prevLabel)
    this.highlightElement(index)

  }

}
