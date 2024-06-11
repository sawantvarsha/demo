import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexNoData,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStates,
  ApexStroke,
  ApexTheme,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  grid: ApexGrid;
  labels: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  colors: string[];
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  states: ApexStates;
  responsive: ApexResponsive[];
  noData: ApexNoData;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis[];
  theme: ApexTheme;
  markers: ApexMarkers;
};
export type pieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  colors: string[];
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  states: ApexStates;
  responsive: ApexResponsive[];
  noData: ApexNoData;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis[];
  theme: ApexTheme;
};
export class FinancialPlanningModel {
  modes: {};

  lineChartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: 'Cost',
        type: 'column',
        data: [0],
      },
      {
        name: 'Networth',
        type: 'line',
        data: [0],
      },
      // {
      //   name: 'Growth',
      //   type: 'line',
      //   data: [0],
      // },
    ],
    colors: ['#0070C0', '#faad32'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
      },
    },
    markers: {
      size: 2,
      colors: undefined,
      strokeColors: '#fff',
      strokeWidth: 2,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: 'circle',
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: true,
      hover: {
        size: undefined,
        sizeOffset: 3,
      },
    },
    noData: {
      text: 'No Data',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: '14px',
      },
    },
    chart: {
      height: 600,
      width: 480,
      type: 'line',
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    grid: {
      show: false, // you can either change hear to disable all grids
      xaxis: {
        lines: {
          show: true, //or just here to disable only x axis grids
        },
      },
      yaxis: {
        lines: {
          show: true, //or just here to disable only y axis
        },
      },
    },
    stroke: {
      width: [0, 4],
    },
    dataLabels: {
      enabled: false,
      enabledOnSeries: [1],
    },
    legend: {
      show: true,
      position: 'top',
    },
    labels: ['2020'],
    xaxis: {
      type: 'datetime',
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: true,
        minHeight: 100,
        maxHeight: 180,
      },
      tooltip: {
        enabled: false,
      },
    },
    tooltip: {
      enabled: true,
    },
    yaxis: [
      {
        show: false,
      },
    ],
    theme: {
      mode: 'dark',
      palette: 'palette1',
      monochrome: {
        enabled: false,
        color: '#0070C0',
        shadeTo: 'light',
        shadeIntensity: 1,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };
  pieChartOptions: Partial<pieChartOptions> = {
    series: [100],
    chart: {
      width: 380,
      type: 'pie',
      toolbar: {
        show: false,
      },
      background: 'transaparent',
    },
    labels: ['Interest'],
    stroke: {
      width: 0,
    },
    theme: {
      mode: 'dark',
      palette: 'palette1',
      monochrome: {
        enabled: false,
        color: '#255aee',
        shadeTo: 'dark',
        shadeIntensity: 0.65,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };
}
