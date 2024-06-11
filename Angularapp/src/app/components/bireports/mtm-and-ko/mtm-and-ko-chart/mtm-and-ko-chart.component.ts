import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { MtmAndKoFilterService } from '../mtm-and-ko-filter.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BIReportsComponent } from '../../bireports.component';
import { MtmAndKoComponent } from '../mtm-and-ko.component';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-mtm-and-ko-chart',
  templateUrl: './mtm-and-ko-chart.component.html',
  styleUrls: ['./mtm-and-ko-chart.component.css']
})
export class MtmAndKoChartComponent implements OnInit {

  constructor(private service: MtmAndKoFilterService,private bIReportsComponent:BIReportsComponent,private mtmAndKoComponent:MtmAndKoComponent) {
  }


  ko_list: any[] = []
  mtmlist: any[] = []
  isinlist: any[] = []
  productlist: any[] = []
  worstList: any[] = []
  selected!: number
  select: boolean = true
  clickBackgroundcolor1: string = 'rgba(3,32,53,255)'
  clickBackgroundcolor2: string = 'rgba(3,32,53,255)'
  selectedOption:string='Ascending'
  selectedOption1:string='Trace_KO_Distance'
  showDiv:any='false'
  color: string = "#6d97bf";
  hex1: any = '#255272'
  hex2: any = '#6d97bf'
  maxElement:number
  prevElement!: number

  filterData(value:any){
  this.service.selectedOption=value
  this.selectedOption=this.service.selectedOption
  this.setComponentProperties()
  this.setChartProperties()
  this.chart.update()
}

filterData1(value:any){
  this.service.selectedOption1=value
  this.selectedOption1=this.service.selectedOption1
  this.setComponentProperties()
  this.setChartProperties()
  this.chart.update()
  
}
display(){
  if(this.showDiv=='false'){
   this.showDiv='true'
  }else{
   this.showDiv='false'
  }
 }

 
pinChart(e: any, title) {
  this.mtmAndKoComponent.pinned()
  e.preventDefault();
 
  const current_min_KO = this.service.current_min_KO;
  const current_max_KO = this.service.current_max_KO;
  const current_min_MTM = this.service.current_min_MTM
  const current_max_MTM = this.service.current_max_MTM;
  const selectedUnderlying= this.service.selectedUnderlying;
  const selectedCurrency = this.service.selectedCurrency
  const selectedPayOff = this.service.selectedPayOff;
  const selectedCustomer=this.service.selectedCustomer;
  const selectedOption=this.service.selectedOption
  const selectedOption1=this.service.selectedOption1

  const bg1= this.chart.data.datasets[0].backgroundColor
  const bg2= this.chart.data.datasets[1].backgroundColor

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
  const borderColor= 'black';
const id=4
 
  const chart = {
  data,data1,productlist,worstList, labels, backgroundColor,backgroundColor1, borderColor, borderWidth, title,id,current_min_KO,current_max_KO,current_min_MTM,current_max_MTM,selectedUnderlying,
  selectedCurrency,selectedPayOff,selectedCustomer,bg1,bg2,selectedOption,selectedOption1
 }
 
 //debugger
 //console.log(this.chartGraph);
 //this.applicationService.setChart(data,type,options);
this.bIReportsComponent.setChart({type, chart});
  }
  ngOnInit(): void {

    this.selectedOption=this.service.selectedOption
    this.selectedOption1=this.service.selectedOption1
    this.color = this.service.inputColor
    
    this.setComponentProperties()
    this.createChart()
    this.chart.config.data.datasets[0].backgroundColor = Array(this.ko_list.length).fill(this.service.hex1)
    this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill(this.service.hex2)
    // this.hex1 = '#255272'
    // this.hex2 = '#6d97bf'
    this.service.setBg1(this.chart.data.datasets[0].backgroundColor);
    this.service.setBg2(this.chart.data.datasets[1].backgroundColor);

    this.chart.canvas.addEventListener('wheel', (e: string) => {
      this.scroll(e, this.chart)
    })

    this.service.dataReceived.subscribe(() => {

      this.hex1 = '#255272'
      this.hex2 = '#6d97bf'
      this.setComponentProperties()
      this.setChartProperties()
      this.chart.update()
      this.chart.canvas.addEventListener('wheel', (e: string) => {
        this.scroll(e, this.chart)
      })
    })

    this.service.dataFiltered.subscribe(() => {
      this.setComponentProperties()
      this.setChartProperties()
      this.chart.update()
    })

    this.service.filterSelectedEvent.subscribe(() => {
      this.setComponentProperties()
      this.setChartProperties()
      this.chart.update()
    })

    this.service.bg1$.subscribe(value => {
      //console.log(value);
      this.chart.data.datasets[0].backgroundColor = value
      this.color = value[0]
      this.hex1 = value[0]
      this.chart.update()
    })

    this.service.bg2$.subscribe(value => {
     // console.log(value);
      this.chart.data.datasets[1].backgroundColor = value
      this.hex2 = value[0]
      this.chart.update()
    })

  }

  setComponentProperties() {
    this.data = this.service.getData()
    let temp_ko_list: any[] = [];
    let temp_mtm_list: any[] = [];
    let temp_isinlist: any[] = [];
    let tempWorstList: any[] = [];
    let tempProductList: any[] = []


    if(this.service.selectedOption==='Ascending'){
     
      if(this.service.selectedOption1==='WorstOfUnderlying'|| this.service.selectedOption1==='ISIN'){
      this.data.sort((a:any,b:any)=>{
        var m:string=a[this.service.selectedOption1]
        var n:string=b[this.service.selectedOption1]
        console.log(m+""+n)
        return (m.localeCompare(n)) 
      })}
      else{
        this.data.sort((a:any,b:any)=>{
          return a[this.service.selectedOption1]-b[this.service.selectedOption1]
        })
      }
  }
    else{
      
      if(this.service.selectedOption1==='WorstOfUnderlying' || this.service.selectedOption1==='ISIN'){
        this.data.sort((a:any,b:any)=>{
          var m:string=a[this.service.selectedOption1]
          var n:string=b[this.service.selectedOption1]
          return (n.localeCompare(m)) 
        })}
        else{
          this.data.sort((a:any,b:any)=>{
            return b[this.service.selectedOption1]-a[this.service.selectedOption1]
          })
        }
    }
    console.log(this.data)



    this.data.forEach((data) => {
      temp_ko_list = [...temp_ko_list, data["Trace_KO_Distance"]]
      temp_mtm_list = [...temp_mtm_list, data["MTM_Premium"]]
      temp_isinlist = [...temp_isinlist, data["ISIN"]]
      tempProductList = [...tempProductList, data["Product_Name"]]
      tempWorstList = [...tempWorstList, data["WorstOfUnderlying"]]
    })

    let maxMtm = Math.max(...temp_mtm_list)
    let maxKo=Math.max(...temp_ko_list)
    this.maxElement=Math.max(maxMtm,maxKo)

    this.ko_list = [...temp_ko_list]
    this.mtmlist = [...temp_mtm_list]
    this.isinlist = [...temp_isinlist]
    this.productlist = [...tempProductList]
    this.worstList = [...tempWorstList]
    this.prevElement = -1


  }

  backgroundcolor1: string[] = []
  backgroundcolor2: string[] = []
  labels!: any
  chart!: any
  data!: any[]
  createChart() {
    this.chart = new Chart("mtm-and-ko-chart", {
      type: 'bar',
      data: {
        xLabels: this.isinlist,
        datasets: [{
          label: 'KO Distance(%)',
          data: this.ko_list,
          backgroundColor: Array(this.ko_list.length).fill('#255272'),
        },
        {
          label: 'MTM(%)',
          data: this.mtmlist,
          backgroundColor: Array(this.mtmlist.length).fill('#6d97bf'),

        }
        ],
      },
      options: {
        layout: {
          padding: 20
        },
        onClick: (event, elements) => {

          this.selected = elements[0].index;
          if (this.prevElement !== this.selected || this.select === true) {
            this.prevElement = this.selected
            var backgroundcolor1 = Array(this.ko_list.length).fill(this.ColorLuminance(this.hex1, -0.5))
            var backgroundcolor2 = Array(this.mtmlist.length).fill(this.ColorLuminance(this.hex2, -0.5))
            backgroundcolor1[this.selected] = this.hex1
            backgroundcolor2[this.selected] = this.hex2

            this.chart.config.data.datasets[0].backgroundColor = [...backgroundcolor1]
            this.chart.config.data.datasets[1].backgroundColor = [...backgroundcolor2]
            this.select = false
            this.chart.update()
          }
          else {
            this.chart.config.data.datasets[0].backgroundColor = Array(this.ko_list.length).fill(this.hex1)
            this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill(this.hex2)
            this.select = true
            this.chart.update()
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
          y: {
            ticks: {
              color:'rgba(149,149,149,255)',
              padding: 20,
              crossAlign: 'near',
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
              text: 'MTM(%) and KO Distance(%)',
              font: {
                size: 20
              }
            },
            beginAtZero: true,
            min: 0,
            max: Math.round(this.maxElement+10)
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
                size: 20
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
                var pname = this.productlist[tooltipItem.dataIndex]
                var worstUnder = this.worstList[tooltipItem.dataIndex]
                var str = `Worst Of UnderLying: ${worstUnder}\nProduct Name: ${pname.substring(0, pname.indexOf("Strike"))}\n${pname.substring(pname.indexOf("Strike"), pname.indexOf("Coupon"))}\n${pname.substring(pname.indexOf("Coupon"))}`;
                return str;
              },
            }

          },
          legend: {
            align: 'end',
            labels: {
              color: `rgba(149,149,149,255)`,
              usePointStyle: true,
              font: {
                size: 15
              }
            }
          }
        }

      },
    })
  }

  scroll(scroll: any, chart: any) {
    console.log(scroll)
    if (scroll.deltaY > 0) {
      if (chart.config.options.scales.x.max >= this.ko_list.length - 1) {
        chart.config.options.scales.x.min = this.ko_list.length - 21;
        chart.config.options.scales.x.max = this.ko_list.length - 1;
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
    this.chart.config.data.datasets[0].data = this.ko_list;
    this.chart.config.data.datasets[1].data = this.mtmlist;
    this.chart.config.data.xLabels = this.isinlist;
    // this.chart.config.data.datasets[0].backgroundColor = Array(this.ko_list.length).fill(this.hex1)
    // this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill(this.hex2)
    if(this.hex1 === undefined || this.hex2 === undefined){
      this.chart.config.data.datasets[0].backgroundColor = Array(this.ko_list.length).fill(this.color)
    this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill(this.invertHexColor(this.color))
    //   this.chart.config.data.datasets[0].backgroundColor = Array(this.ko_list.length).fill(this.service.prevHex1)
    // this.chart.config.data.datasets[1].backgroundColor = Array(this.woflist.length).fill(this.service.prevHex2)
    }else{
      this.chart.config.data.datasets[0].backgroundColor = Array(this.ko_list.length).fill(this.color)
      this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill(this.invertHexColor(this.color))
    }
    // this.hex1 = '#255272'
    // this.hex2 = '#6d97bf'
    this.service.setBg1(this.chart.data.datasets[0].backgroundColor);
    this.service.setBg2(this.chart.data.datasets[1].backgroundColor);
    // this.chart.config.data.datasets[0].backgroundColor = Array(this.ko_list.length).fill('rgba(57,114,158,255)')
    // this.chart.config.data.datasets[1].backgroundColor = Array(this.mtmlist.length).fill('rgba(37,82,114,255)')
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

      h = h/6;
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
    this.chart.config.data.datasets[0].backgroundColor = Array(this.ko_list.length).fill(value)
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

}