import { Component, OnChanges, OnInit, SimpleChanges, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { FilterService } from '../filter.service';
import { color } from 'chart.js/helpers';
import { DashboardServiceService } from '../../galaxy-dashboard/dashboard-service.service';
import { BIReportsComponent } from '../../bireports.component';
import { SalesAndRevenuePerformanceComponent } from '../sales-and-revenue-performance.component';
@Component({
  selector: 'app-doughnut-chart-currency',
  templateUrl: './doughnut-chart-currency.component.html',
  styleUrls: ['./doughnut-chart-currency.component.css']
})
export class DoughnutChartCurrencyComponent implements OnInit {
  totalVolume: number=this.service.totalVolume;


  constructor(private service: FilterService,private dashboardService: DashboardServiceService,private bIReportsComponent:BIReportsComponent,private salesAndRevenuePerformanceComponent:SalesAndRevenuePerformanceComponent) {

  }
  selectedLabel?: string
  chart: any;
  selected?: number;
  select = false;
  payOff!: string[];
  dataForCurrency!: any[]
  labels!: string[]
  data!: number[];
  avgSalesMarginList!: string[];
  prevLabel = ""
  selectedOptionCurrency: string = 'Ascending'
  selectedOption1Currency: string = 'Currency'

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


  newBackgroundColor: string[] =
    ['rgba(3,32,53,255)',
      'rgba(23,46,63,255)',
      'rgba(11,28,39,255)',
      'rgba(32,50,62,255)',
      'rgba(61,83,99,255)',
      'rgb(120, 153, 173, 1)'
    ];

  ngOnInit(): void {
    this.selectedOptionCurrency = this.service.selectedOptionCurrency
    this.selectedOption1Currency = this.service.selectedOption1Currency
    this.setComponentProperties();
    this.chart = new Chart("sarchart3", {
      type: 'doughnut',
      // canvas.parentNode.style.height = '128px';
      // canvas.parentNode.style.width = '128px';
      data: {
        labels: this.labels,
        datasets: [{
          label: 'USD eqv Trade Volume By PayOff',
          data: this.data,
          backgroundColor: this.originalBackgroundColor,
          hoverOffset: 4,
          borderWidth: 1,
            borderColor:'black',
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
            this.service.selectedChart = 2
            this.service.currentSelectedCurrency = label
          } else {
            this.chartSelectedProperties()
            this.setChartProperties()
            this.select = false
            this.prevLabel = ''
            this.service.destroySelected()
            this.service.selectedChart = 0
            this.service.currentSelectedCurrency = "All"
            this.chart.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
          }

          this.chart.update();
          this.service.dateCurrencyAndPayOffFilter();
          this.service.tradeForVolumeByCurrencySelectedEvent.emit()
        },
        // onResize:(chart, size) => {
          
        // },
        responsive: true,
        plugins: {
          tooltip: {
            mode: 'point',
            enabled: false,
            position: 'nearest',
            external: this.externalTooltipHandler
          },
          legend: {
            title: {
              text: "Currency",
              display: true,
              color: 'rgb(227, 228, 230)',
              position: 'start',
              font: {
                size: 16
              }
            },
            position: 'right',
            labels: {
              font: {
                size: 13
              },
              color: 'rgb(227, 228, 230)',
              usePointStyle: true
            }
          },
          datalabels: {
            display: false
          },
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
              let displayVolume = ''
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
      this.setChartProperties();
      this.chart.update();
    });


    this.service.dateFilterEvent.subscribe(() => {
      if (this.select === true) {
        this.chartSelectedProperties()
        this.setChartProperties();
        this.highlightConsistent()
        this.chart.update();
      }
      else {
        this.setComponentProperties()
        this.setChartProperties();
        this.chart.update();
      }
    })

    this.service.filterSelectedEvent.subscribe(() => {
      if (this.select === true) {
        this.chartSelectedProperties()
        this.setChartProperties();
        this.highlightConsistent()
        this.chart.update();
      }
      else {
        this.setComponentProperties()
        this.setChartProperties();
        this.chart.update();
      }
    })

    this.service.setTotalEvent.subscribe(()=>{
      this.totalVolume=this.service.totalVolume
    })

    this.service.tradeForVolumeByPayOffSelectedEvent.subscribe(() => {
      this.setComponentProperties()
      this.setChartProperties();
      this.select = false
      this.chart.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
      this.prevLabel = ""
      this.chart.update();
    })

    this.service.tradeForRevenueByPayOffSelectedEvent.subscribe(() => {
      this.setComponentProperties()
      this.setChartProperties();
      this.select = false
      this.chart.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
      this.prevLabel = ""
      this.chart.update();
    })

    this.service.tradeForRevenueByCurrencySelectedEvent.subscribe((label) => {

      this.setComponentProperties()
      this.setChartProperties();
      this.select = false
      this.chart.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
      this.prevLabel = ""
      this.chart.update();
    })


    this.service.sendStateDataEvent.subscribe(() => {
      this.selectedOptionCurrency = this.service.selectedOptionCurrency
      this.selectedOption1Currency = this.service.selectedOption1Currency
      this.prevLabel=''
      if (this.service.selectedChart === 2) {
        this.chartSelectedProperties()
        if (this.prevLabel !== this.service.currentSelectedCurrency && this.select === true) {
          this.select = false
        }
        if (this.select === false && this.prevLabel !== this.service.currentSelectedCurrency) {
          this.prevLabel = this.service.currentSelectedCurrency
          this.selected = this.labels.indexOf(this.service.currentSelectedCurrency)
          this.highlightElement(this.selected)
          this.select = true
        }
      }
      else{
        this.setComponentProperties()
        this.chart.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
      }
        
      this.setChartProperties();
      this.chart.update();
    })

    //============================================
    this.service.filterEvent1.subscribe(() => {
      this.selectedOptionCurrency = this.service.selectedOptionCurrency
      this.selectedOption1Currency = this.service.selectedOption1Currency
      if (this.select === true) {
        this.chartSelectedProperties()
        this.setChartProperties();
        this.highlightConsistent()
        this.chart.update();
      }
      else {
        this.setComponentProperties()
        this.setChartProperties();
        this.chart.update();
      }
    })
    //============================================
    // this.service.setTotalEvent.subscribe(()=>{
    //   console.log()
    //   this.totalVolume=this.service.totalVolume;
    // })
  }

  ngAfterViewInit(){
    window.addEventListener('afterprint', () => {
      this.chart.resize();
    });
  }


  setChartProperties() {
    this.chart.config.data.labels = this.labels
    this.chart.config.data.datasets[0].data = this.data
    // this.chart.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
  }

  setComponentProperties() {
    this.totalVolume=this.service.totalVolume
    this.dataForCurrency = this.service.getDataByCurrency()
    let avgSalesMargin: string = ''
    //this.dataForCurrency.sort((a,b)=>a.value-b.value)
    // this.dataForCurrency.sort((a,b)=>b.value-a.value)
    //this.dataForCurrency.sort((a,b)=>a.title.localeCompare(b.title))
    //this.dataForCurrency.sort((a, b) => b.title.localeCompare(a.title))
    if (this.selectedOptionCurrency === 'Ascending') {
      if (this.selectedOption1Currency == 'Currency')
        this.dataForCurrency.sort((a, b) => (a.title).localeCompare(b.title))
      else
        this.dataForCurrency.sort((a, b) => a[this.selectedOption1Currency] - b[this.selectedOption1Currency])
    }
    else {
      if (this.selectedOption1Currency == 'Currency')
        this.dataForCurrency.sort((a, b) => (b.title).localeCompare(a.title))
      else
        this.dataForCurrency.sort((a, b) => b[this.selectedOption1Currency] - a[this.selectedOption1Currency])
    }
    let avgSalesMarginList: string[] = []

    let labels: string[] = []
    this.data = this.dataForCurrency.map((data) => {
      labels = [...labels, data['title']]
      avgSalesMargin = (1 / (data['volume'] / data['revenue']) * 100).toFixed(2) + "%"
      avgSalesMarginList = [...avgSalesMarginList, avgSalesMargin]
      avgSalesMargin = (1 / (data['volume'] / data['revenue']) * 100).toFixed(2) + "%"
      avgSalesMarginList = [...avgSalesMarginList, avgSalesMargin]
      return data['volume']
    })
    this.labels = labels
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

    this.chart.config.data.datasets[0].backgroundColor = temp;
    this.chart.update();
  }

  pinChart(e: any,title) {
    this.salesAndRevenuePerformanceComponent.pinned()
    e.preventDefault();
    
      const currentStartDate = new Date(this.service.currentMinDate);
      const currentEndDate = new Date(this.service.currentMaxDate);
      const selectedCurrency = this.service.selectedLabel;
      const selectedCustomer = this.service.selectedCustomer;
      const selectedOption1Currency = this.service.selectedOption1Currency
      const selectedOptionCurrency = this.service.selectedOptionCurrency


    const data = this.chart.config._config.data.datasets[0].data;
    const type = this.chart.config._config.type;
    const labels = this.chart.config._config.data.labels;
     const options = this.chart.config._config.options;
     const backgroundColor = this.originalBackgroundColor;
     const total=this.totalVolume
    const borderWidth = 1;
    const borderColor= 'black';
    const text = 'Currency';
    const chart = {
      data, labels, backgroundColor, borderColor, borderWidth,title, text,total,currentStartDate,currentEndDate,selectedCurrency,selectedCustomer,selectedOption1Currency,
      selectedOptionCurrency
    }

    //debugger
    //console.log(this.chartGraph);
    //this.applicationService.setChart(data,type,options);
    this.bIReportsComponent.setChart({type, chart});
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
      let imgPath = `http://1europe.test-equity-connect.com/ClientSelfServicePortal/assets/flags/${titleForTooltip}.png`
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
      tooltipEl.style.top = positionY + tooltip.caretY - 50 + 'px';
    }
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
    tooltipEl.style.zIndex='12px'
  };
  

  chartSelectedProperties() {
    
    this.dataForCurrency = this.service.selectedChartCurrencyFilter()
    
    let avgSalesMargin: string = ''
    //this.dataForCurrency.sort((a,b)=>a.value-b.value)
    // this.dataForCurrency.sort((a,b)=>b.value-a.value)
    //this.dataForCurrency.sort((a,b)=>a.title.localeCompare(b.title))
    let avgSalesMarginList: string[] = []
    // this.dataForCurrency.sort((a, b) => b.title.localeCompare(a.title))
    if (this.selectedOptionCurrency === 'Ascending') {
      if (this.selectedOption1Currency == 'Currency')
        this.dataForCurrency.sort((a, b) => (a.title).localeCompare(b.title))
      else
        this.dataForCurrency.sort((a, b) => a[this.selectedOption1Currency] - b[this.selectedOption1Currency])
    }
    else {
      if (this.selectedOption1Currency == 'Currency')
        this.dataForCurrency.sort((a, b) => (b.title).localeCompare(a.title))
      else
        this.dataForCurrency.sort((a, b) => b[this.selectedOption1Currency] - a[this.selectedOption1Currency])
    }
    let labels: string[] = []
    this.data = this.dataForCurrency.map((data) => {
      labels = [...labels, data['title']]
      avgSalesMargin = (1 / (data['volume'] / data['revenue']) * 100).toFixed(2) + "%"
      avgSalesMarginList = [...avgSalesMarginList, avgSalesMargin]
      avgSalesMargin = (1 / (data['volume'] / data['revenue']) * 100).toFixed(2) + "%"
      avgSalesMarginList = [...avgSalesMarginList, avgSalesMargin]
      return data['volume']
    })
    this.labels = labels
    this.avgSalesMarginList = [...avgSalesMarginList]
  }

  highlightConsistent() {
    let index = this.labels.indexOf(this.prevLabel)
    this.highlightElement(index)

  }

}
