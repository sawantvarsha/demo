import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TreemapController, TreemapElement, TreemapScriptableContext } from 'chartjs-chart-treemap';
import { Chart } from 'chart.js';
import { color } from 'chart.js/helpers';
import { FilterService } from '../filter.service';
import { BIReportsComponent } from '../../bireports.component';
import { SalesAndRevenuePerformanceComponent } from '../sales-and-revenue-performance.component';

type dataObject = {
  currency: string;
  value: number;
  avgSalesMargin:string
}

Chart.register(TreemapController, TreemapElement)


@Component({
  selector: 'app-treemap-currency',
  templateUrl: './treemap-currency.component.html',
  styleUrls: ['./treemap-currency.component.css']
})
export class TreemapCurrencyComponent implements OnInit {
  chart: any
  data: dataObject[] = []
  labels: string[] = []
  select = false;
  selected!: number;
  avgSalesMarginList!: string[];
  prevLabel: string="All";

  constructor(private service: FilterService,private bIReportsComponent:BIReportsComponent,private salesAndRevenuePerformanceComponent:SalesAndRevenuePerformanceComponent) {


  }

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

    pinChart(e: any, title) {
      this.salesAndRevenuePerformanceComponent.pinned()
      e.preventDefault();
       console.log(this.chart);
       const currentStartDate = new Date(this.service.currentMinDate);
       const currentEndDate = new Date(this.service.currentMaxDate);
       const selectedCurrency = this.service.selectedLabel;
       const selectedCustomer = this.service.selectedCustomer;

      const data = this.chart.config._config.data.datasets[0].data;
      const tree = this.chart.config._config.data.datasets[0].tree;
      const type = this.chart.config._config.type;
      const labels = this.chart.config._config.data.labels;
       const options = this.chart.config._config.options;
      //  const backgroundColor = this.originalBackgroundColor;
      const borderWidth = 1;
      const borderColor= 'black';
      const spacing = 0;
      const key = this.chart.config._config.data.datasets[0].key;
      const groups = this.chart.config._config.data.datasets[0].groups;
  
      const chart = {
        data, tree, labels, options, borderColor, borderWidth, spacing, key, groups,title,currentStartDate,currentEndDate,selectedCurrency,selectedCustomer
      }
      //debugger
      //console.log(this.chartGraph);
      //this.applicationService.setChart(data,type,options);
      this.bIReportsComponent.setChart({type, chart});
    }
  ngOnInit(): void {

    this.setComponentProperties();
    this.chart = new Chart("sarchart1", {
      type: 'treemap',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'USD Eqv Revenue',
            tree: [...this.data],
            data: [...this.data],
            key: 'value',
            groups: ['currency'],
            borderWidth: 1,
            borderColor:'black',
            spacing: 0,
            labels: {
              display: true,
              color: 'white',
              position: 'bottom',
              align: 'right',
              formatter: (ctx) => {
                console.log(ctx)
            
                  let value = ctx.raw.v
                  let valuestring
                  let displayRevenue: string = ''
                if (value > 1000000) {
                  displayRevenue = (value / 1000000).toString()
                  valuestring = displayRevenue.substring(0, displayRevenue.indexOf(".") + 3) + "M"
                }
                else {
                  if (value !== 0) {
                    displayRevenue = (value / 1000).toString()
                    valuestring = displayRevenue.substring(0, displayRevenue.indexOf(".") + 3) + "K"
                  }
                }
                return [this.labels[ctx.dataIndex], valuestring]
              },
              font: {
                size: 15
              }
            },
            backgroundColor: (ctx) => this.colorFromRaw(ctx),
          }
        ],
      },
      options: {
        // maintainAspectRatio: false,
        onClick: (e, elements, chart) => {
          let selectedindex=elements[0].index
          let label=this.labels[selectedindex]
          if(this.prevLabel!==label && this.select===true){
            this.select=false
          }

          if(this.select===false && this.prevLabel!==label){
            this.prevLabel=label
            this.chartSelectedProperties()
            this.setChartProperties()
            this.selected=this.labels.indexOf(label)
            this.highlightElement(this.selected)
            this.select=true
            this.service.destroySelected()
            this.service.selectedChart=1
            this.service.currentSelectedCurrency=label
          }else{
            this.chartSelectedProperties()
            this.setChartProperties()
            this.select=false
            this.prevLabel=''
            this.service.destroySelected()
            this.service.selectedChart=0
            this.service.currentSelectedCurrency="All"
            this.chart.config.data.datasets[0].backgroundColor = (ctx: any) => this.colorFromRaw(ctx);
          }
          
          this.chart.update();
          this.service.dateCurrencyAndPayOffFilter();
          this.service.tradeForRevenueByCurrencySelectedEvent.emit()
        },
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            display: false
          },
          tooltip: {
            mode: 'point',
            enabled: false,
            position: 'nearest',
            external: this.externalTooltipHandler
          }
        }
      }

    })

    this.service.dataReceived.subscribe(() => {
      this.setComponentProperties()
      this.setChartProperties();
      this.chart.update();
    })

    this.service.sendStateDataEvent.subscribe(() => {
      this.prevLabel=''
      if (this.service.selectedChart === 1) {
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
      else {
        this.setComponentProperties()
        this.chart.config.data.datasets[0].backgroundColor = (ctx: any) => this.colorFromRaw(ctx)
      }
      this.setChartProperties();
      this.chart.update();
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

    this.service.dateFilterEvent.subscribe(() => {
      console.log("total")
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

    this.service.tradeForVolumeByCurrencySelectedEvent.subscribe((label) => {
      this.setComponentProperties()
      this.setChartProperties();
      this.chart.config.data.datasets[0].backgroundColor = (ctx: any) => this.colorFromRaw(ctx)
      this.select=false
      this.prevLabel=''
      this.chart.update();
    })

    this.service.tradeForVolumeByPayOffSelectedEvent.subscribe(() => {
      this.setComponentProperties()
      this.setChartProperties();
      this.chart.config.data.datasets[0].backgroundColor = (ctx: any) => this.colorFromRaw(ctx)
      this.select=false
      this.prevLabel=''
      this.chart.update();
    })

    this.service.tradeForRevenueByPayOffSelectedEvent.subscribe(() => {
      this.setComponentProperties()
      this.setChartProperties();
      this.chart.config.data.datasets[0].backgroundColor = (ctx: any) => this.colorFromRaw(ctx)
      this.select=false
      this.prevLabel=''
      this.chart.update();
    })
  }

  setComponentProperties() {
    let avgSalesMargin: string = ''
    this.data = this.service.getDataByCurrency().map((data) => {
      let tempDataObject: dataObject = {
        currency: "",
        value: 0,
        avgSalesMargin:''
      }
      avgSalesMargin = (data['revenue'] / data['volume'] * 100).toFixed(2) + "%"
      tempDataObject['avgSalesMargin'] = avgSalesMargin
      tempDataObject['currency'] = data['title']
      tempDataObject['value'] = data['revenue']
      return tempDataObject;
    })
    this.data.sort((a, b) => b.value - a.value)
    this.labels = this.data.map(data => data['currency'])
    this.avgSalesMarginList = this.data.map(data => data['avgSalesMargin'])
  }

  setChartProperties() {
    this.chart.config.data.labels = this.labels
    this.chart.config.data.datasets[0].data = this.data
    this.chart.config.data.datasets[0].tree = this.data
    // this.chart.config.data.datasets[0].backgroundColor = this.originalBackgroundColor;
  }


  colorFromRaw(ctx: any) {
    if (ctx.type !== 'data') {
      return 'transparent';
    }
    return this.originalBackgroundColor[ctx.dataIndex]
  }

  colorFromRawOnClick(ctx: any, colors: string[]) {
    if (ctx.type !== 'data') {
      return 'transparent';
    }
    return colors[ctx.dataIndex]
  }

  highlightElement(selected: number) {
    var temp = [...this.originalBackgroundColor];
    for (var i = 0; i < temp.length; i++) {
      if (selected === i) {
        continue;
      }
      temp[i] = this.newBackgroundColor[i];
    }

    this.chart.config.data.datasets[0].backgroundColor = (ctx: any) => this.colorFromRawOnClick(ctx, temp);
    this.chart.update();
  }


  getOrCreateTooltip = (chart: any) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.zIndex='12'
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
      console.log(tooltip)
      const title = tooltip._tooltipItems[0].dataIndex;
      const value = tooltip._tooltipItems[0].raw.v;
      let titleForTooltip = this.labels[title]
      let avgSalesMargin = this.avgSalesMarginList[this.labels.indexOf(titleForTooltip)]
      let imgPath = `http://1europe.test-equity-connect.com/ClientSelfServicePortal/assets/flags/${titleForTooltip}.png`
      let valuestring
      const div = document.createElement('div')

      let displayRevenue: string = ''
      if (value > 1000000) {
        displayRevenue = (value / 1000000).toString()
        valuestring = displayRevenue.substring(0, displayRevenue.indexOf(".") + 3) + "M"
      }
      else {
        if (value !== 0) {
          displayRevenue = (value / 1000).toString()
          valuestring= displayRevenue.substring(0, displayRevenue.indexOf(".") + 3) + "K"
        }
      }


      const container = tooltipEl.querySelector('div');
      container.style.width = "240px"
      container.style.height = '150px'
      container.style.display = 'grid'


      while (container.firstChild)
        container.firstChild.remove()

      let string = `<div style="display: grid;grid-template-columns: 60% 40%;grid-template-rows: 50% 50%;row-gap: 10px;column-gap: 10px;height: 90%;width: 95%; z-index: 12;">
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
            $ Eqv. Revenue
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
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  };

  chartSelectedProperties() {
    let avgSalesMargin: string = ''
    let avgSalesMarginList: string[] = []
    this.data = this.service.selectedChartCurrencyFilter().map((data) => {
      let tempDataObject: dataObject = {
        currency: "",
        value: 0,
        avgSalesMargin:''
      }
      avgSalesMargin = (data['revenue'] / data['volume'] * 100).toFixed(2) + "%"
      tempDataObject['avgSalesMargin'] = avgSalesMargin
      tempDataObject['currency'] = data['title']
      tempDataObject['value'] = data['revenue']
      return tempDataObject;
    })
    this.data.sort((a, b) => b.value - a.value)
    this.labels = this.data.map(data => data['currency'])
    this.avgSalesMarginList = this.data.map(data => data['avgSalesMargin'])
  }

  highlightConsistent() {
    let index = this.labels.indexOf(this.prevLabel)
    this.highlightElement(index)
    
  }

}
