var myChart1; //CASH FX
var ELIid; //ELI
var FXOid; //FXO
var BONDid; //BOND
var myChart5; //ELN
var FCNid; //FCN
var DCIid; //FXDCI
var CASHEQid; //CAShEQ
var canvas5;
var DEPOSITid;
var CASHFXdate = [];
var ELNid;
var EQCOptionid;
var EQCPhoenixid;
var FXDQid;
var FXAQid;
var FXPivotid;
var FXTRFid;
var MutualFundid;
var BENid; // BEN
var FXStrategiesid; // Strategies

var opt = {
  scaleShowGridLines: true,
  scaleGridLineColor: "rgba(0,0,0,.05)", // GridLine Colors
  bezierCurve: false,
  spanGaps: true,
  responsive: true,
  lineTension: 0.3,
  legend: {
    labels: {
      fontSize: 10,
    },
    position: "bottom",
  },
  scales: {
    yAxes: [
      {
        ticks: {
          fontColor: colors, // Y axis Font color
          fontStyle: "bold",
          fontSize: 10,
          scaleStartValue: 90,
          scalEndValue: 99,
          padding: 20,
        },
        gridLines: {
          drawTicks: false,
          display: true,
        },
      },
    ],
    xAxes: [
      {
        gridLines: {},
        ticks: {
          padding: 20,
          fontSize: 10,
          fontColor: colors, // X axis Font color
          fontStyle: "bold",
        },
      },
    ],
  },
};

var colors = [
  "#FFD800",
  "#C01080",
  "#008000",
  "#B0FF30",
  "#FF68B0",
  "#D05860",
  "#FF4000",
  "#A02820",
  "#D0A020",
  "#90C830",
  "#B02020",
  "#00D0D0",
]; // For Night Mode
var colorsBar = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
];
var colorsBarBorder = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
];

Chart.defaults.global.legend.labels.usePointStyle = true;
Chart.defaults.global.legend.labels.padding = 18;
Chart.defaults.global.legend.labels.fillStyle = Color;
Chart.defaults.global.animationSteps = 50;

Chart.pluginService.register({
  beforeDraw: function (chart, easing) {
    if (
      chart.config.options.chartArea &&
      chart.config.options.chartArea.backgroundColor
    ) {
      var helpers = Chart.helpers;
      var ctx = chart.chart.ctx;
      var chartArea = chart.chartArea;
      ctx.save();
      ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
      ctx.fillRect(
        chartArea.left,
        chartArea.top,
        chartArea.right - chartArea.left,
        chartArea.bottom - chartArea.top
      );
      ctx.restore();
    }
  },
});

//............................................................... END .....................................................................//

//......................................................// Draw Charts on ELN //...................................................//

function drawgraphELN(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var ELNTileId = Number(canvasid.replace("canvas", ""));
    var thisTileELN = document.getElementById("td" + ELNTileId);

    ELNid = "myChart" + canvasid;
    clearInitialGraph(ELNid);

    var ELNdate = [];
    var ElNfinal = [];

    var ELNdateArray = localStorage.getItem("dateArray" + ELNid);
    var ELNbankArray = localStorage.getItem("bankArray" + ELNid);
    var ELNpriceArray = localStorage.getItem("priceArray" + ELNid);
    if (ELNbankArray != undefined || ELNbankArray != null) {
      var ELNbankname = JSON.parse(ELNbankArray);
      var ELNprice = JSON.parse(ELNpriceArray);
      var ELNdate = JSON.parse(ELNdateArray);
    } else {
      var ELNbankname = [];
      var ELNprice = [];
    }


    for (var i = 0; i < JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val()).length -1;i++) {

      var entrymade = 0;

      for (var j = 0; j < ELNbankname.length; j++) {

        if (ELNbankname[j] ==JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[i].PP_CODE) {

          if (JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[i].ELNOUT == 0 || JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[i].ELNOUT == "") {

            // JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[i].ELNOUT = "null";
            ELNprice[j] =  ELNprice[j] + "," + "null";
            
          }else{
            
          ELNprice[j] =  ELNprice[j] + "," + Number(JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[i] .ELNOUT).toFixed(2);
          
          }
          entrymade = 1;
        }
      }

      if (entrymade == 0) {
        if (JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[i].ELNOUT == 0 || JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[i].ELNOUT == "") {
         
          // JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[i].ELNOUT = "null";
          // ELNbankname.push(JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[i].PP_CODE);
          // ELNprice.push("null");

        }else{
   
        ELNbankname.push(JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[i].PP_CODE);
        ELNprice.push(Number(JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[i] .ELNOUT).toFixed(2));

        }

      }
    }

    var currentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    ELNdate.push(currentdate);

    for (var i = 0; i < ELNbankname.length; i++) {
      var temp = [];
      if (ELNprice[i] != null) {
        temp = ELNprice[i].split(",");
      }
      ElNfinal.push(getGraphData(ELNbankname[i], temp, colors[i]));
    }
    localStorage.setItem("dateArray" + ELNid, JSON.stringify(ELNdate));
    localStorage.setItem("bankArray" + ELNid, JSON.stringify(ELNbankname));
    localStorage.setItem("priceArray" + ELNid, JSON.stringify(ELNprice));

    plotGraph(ELNid, ELNdate, ElNfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}
//....................................................................................................................................//

//....................................................// Draw Charts on FCN //........................................................//

function drawgraphFCN(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var FCNTileId = Number(canvasid.replace("canvas", ""));
    var thisTileFCN = document.getElementById("td" + FCNTileId);

    FCNid = "myChart" + canvasid;
    clearInitialGraph(FCNid);

    var FCNdate = [];
    FCNfinal = [];

    var FCNdateArray = localStorage.getItem("dateArray" + FCNid);
    var FCNbankArray = localStorage.getItem("bankArray" + FCNid);
    var FCNpriceArray = localStorage.getItem("priceArray" + FCNid);
    if (FCNbankArray != undefined || FCNbankArray != null) {
      var FCNbankname = JSON.parse(FCNbankArray);
      var FCNprice = JSON.parse(FCNpriceArray);
      var FCNdate = JSON.parse(FCNdateArray);
    } else {
      var FCNbankname = [];
      var FCNprice = [];
    }

    for (
      var i = 0;
      i <
      JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())
        .length -
        1;
      i++
    ) {
      var entrymade = 0;

      for (var j = 0; j < FCNbankname.length; j++) {
        if (
          FCNbankname[j] ==
          JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[i]
            .PP_CODE
        ) {
          if (
            JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[
              i
            ].DRAOUT == 0 ||  JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[
              i
            ].DRAOUT == ""
          ) {

            // JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[
            //   i
            // ].DRAOUT = null;
            FCNprice[j] =  FCNprice[j] + "," + "null";

          }
          else{
            FCNprice[j] =
            FCNprice[j] +
            "," +
            Number(JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[i].DRAOUT).toFixed(2);
          }
        
          entrymade = 1;
        }
      }
      if (entrymade == 0) {
        if (
          JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[i]
            .DRAOUT == 0 || JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[i]
            .DRAOUT == ""
        ) {
          // JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[
          //   i
          // ].DRAOUT = null;
        }else{
          FCNbankname.push(
            JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[i]
              .PP_CODE
          );
          FCNprice.push(
            Number(JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[i].DRAOUT).toFixed(2)
          );
        }
     
      }
    }

    var currentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    FCNdate.push(currentdate);

    for (var i = 0; i < FCNbankname.length; i++) {
      var FCNtemp = [];
      if (FCNprice[i] != null) {
        FCNtemp = FCNprice[i].split(",");
      }
      FCNfinal.push(getGraphData(FCNbankname[i], FCNtemp, colors[i]));
    }

    localStorage.setItem("dateArray" + FCNid, JSON.stringify(FCNdate));
    localStorage.setItem("bankArray" + FCNid, JSON.stringify(FCNbankname));
    localStorage.setItem("priceArray" + FCNid, JSON.stringify(FCNprice));

    plotGraph(FCNid, FCNdate, FCNfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}

//....................................................................................................................................//

//....................................................// Draw Charts on AQDQ //........................................................//

function drawgraphAQDQ(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var AQDQTileId = Number(canvasid.replace("canvas", ""));
    var thisTileAQ = document.getElementById("td" + AQDQTileId);

    AQDQid = "myChart" + canvasid;
    clearInitialGraph(AQDQid);

    var AQDQdate = [];
    AQDQfinal = [];
    var AQDQdateArray = localStorage.getItem("dateArray" + AQDQid);
    var AQDQbankArray = localStorage.getItem("bankArray" + AQDQid);
    var AQDQpriceArray = localStorage.getItem("priceArray" + AQDQid);
    if (AQDQbankArray != undefined || AQDQbankArray != null) {
      var AQDQbankname = JSON.parse(AQDQbankArray);
      var AQDQprice = JSON.parse(AQDQpriceArray);
      var AQDQdate = JSON.parse(AQDQdateArray);
    } else {
      var AQDQbankname = [];
      var AQDQprice = [];
    }

    for (
      var i = 0;
      i <
      JSON.parse($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val()).length;
      i++
    ) {
      var entrymade = 0;

      for (var j = 0; j < AQDQbankname.length; j++) {
        if (
          AQDQbankname[j] ==
          JSON.parse($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val())[i]
            .PP_CODE
        ) {
          if (
            JSON.parse($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val())[
              i
            ].AccDecOUT == 0 || JSON.parse($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val())[
              i
            ].AccDecOUT == ""
          ) {
            
            AQDQprice[j] = AQDQprice[j] + "," + null;

          }else{
            AQDQprice[j] =
            AQDQprice[j] +
            "," +
            Number(JSON.parse($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val())[i].AccDecOUT).toFixed(2);
          }
          entrymade = 1;
        }
      }
      if (entrymade == 0) {
        if (
          JSON.parse($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val())[i]
            .AccDecOUT == 0 ||  JSON.parse($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val())[i]
            .AccDecOUT == ""
        ) {
          // AQDQprice.push(null);
        }
        else{
          AQDQbankname.push(
            JSON.parse($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val())[i]
              .PP_CODE
          );
          AQDQprice.push(
            Number(JSON.parse($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val())[i].AccDecOUT).toFixed(2)
          );
        }
      
      }
    }
    label = document.getElementById("Type" + idAQDQ).value;
    var currentdate =
      new Date()
        .toLocaleTimeString()
        .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") +
      "-" +
      label;

    AQDQdate.push(currentdate);

    for (var i = 0; i < AQDQbankname.length; i++) {
      var AQDQtemp = [];
      if (AQDQprice[i] != null) {
        AQDQtemp = AQDQprice[i].split(",");
      }
      AQDQfinal.push(getGraphData(AQDQbankname[i], AQDQtemp, colors[i]));
    }

    localStorage.setItem("dateArray" + AQDQid, JSON.stringify(AQDQdate));
    localStorage.setItem("bankArray" + AQDQid, JSON.stringify(AQDQbankname));
    localStorage.setItem("priceArray" + AQDQid, JSON.stringify(AQDQprice));

    plotGraph(AQDQid, AQDQdate, AQDQfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}

//....................................................................................................................................//

//....................................................// Draw Charts on CASH FX //........................................................//

function drawgraphCASHFX(CASHFXdate, CashfxchartPriceObj, TileId, USERID) {
  try {
    if (window[USERID].chart != undefined) {
      window[USERID].destroy();
    }
    var CASHFXfinal = [];

    var CASHFXdateMap = CASHFXdate.filter(function (id) {
      return USERID == id.ID;
    });

    var CASHFXdateArray = CASHFXdateMap.map(function (x) {
      return x[Object.keys(x)[1]];
    });

    CashfxchartPriceObj.forEach((element, index) => {
      let AllrpiceArray = [];
      element.AllPrices.forEach((element, index) => {
        AllrpiceArray.push(element.price);
      });
      CASHFXfinal.push(
        getGraphData(element.bankName, AllrpiceArray, colors[index + 2])
      );
    });

    plotGraph(USERID, CASHFXdateArray, CASHFXfinal, USERID);
  } catch (error) {
    console.log(error.message);
  }
}

//..........................................................................................................................................//

//....................................................// Draw Charts on FX Option //........................................................//

function drawgraphFXO(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var FXOTileId = Number(canvasid.replace("canvas", ""));
    var thisTileFXO = document.getElementById("td" + FXOTileId);

    FXOid = "myChart" + canvasid;
    clearInitialGraph(FXOid);

    var FXOdate = [];
    var FXOfinal = [];
    var FXObankname;
    var FXOprice;
    var FXOdateArray = localStorage.getItem("dateArray" + FXOid);
    var FXObankArray = localStorage.getItem("bankArray" + FXOid);
    var FXOpriceArray = localStorage.getItem("priceArray" + FXOid);
    if (FXObankArray != undefined || FXObankArray != null) {
      var FXObankname = JSON.parse(FXObankArray);
      var FXOprice = JSON.parse(FXOpriceArray);
      var FXOdate = JSON.parse(FXOdateArray);
    } else {
      var FXOfinal = [];
      var FXOdate = [];
      var FXOprice = [];
      var FXObankname = [];
    }

    var FXOcurrentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    var entrymade = 0;
    for (
      var i = 0;
      i <
      JSON.parse($(thisTileFXO).find('[id^="hdnChartPricesFXO"]').val())
        .length -
        1;
      i += 2
    ) {
      entrymade = 0;

      for (var j = 0; j < FXObankname.length; j++) {
        if (
          FXObankname[j] ==
          JSON.parse($(thisTileFXO).find('[id^="hdnChartPricesFXO"]').val())[i]
        ) {
          if (
            JSON.parse($(thisTileFXO).find('[id^="hdnChartPricesFXO"]').val())[
              i + 1
            ] != "0"
          ) {
            FXOprice[j] =
              FXOprice[j] +
              "," +
              JSON.parse(
                $(thisTileFXO).find('[id^="hdnChartPricesFXO"]').val()
              )[i + 1];
          } else {
            JSON.parse($(thisTileFXO).find('[id^="hdnChartPricesFXO"]').val())[
              i + 1
            ] = null;
            FXOprice[j] =
              FXOprice[j] +
              "," +
              JSON.parse(
                $(thisTileFXO).find('[id^="hdnChartPricesFXO"]').val()
              )[i + 1];
          }
          entrymade = 1;
        }
      }
      if (entrymade == 0) {
        if (
          JSON.parse($(thisTileFXO).find('[id^="hdnChartPricesFXO"]').val())[
            i + 1
          ] != "0"
        ) {
          FXObankname.push(
            JSON.parse($(thisTileFXO).find('[id^="hdnChartPricesFXO"]').val())[
              i
            ]
          );
          FXOprice.push(
            JSON.parse($(thisTileFXO).find('[id^="hdnChartPricesFXO"]').val())[
              i + 1
            ]
          );
        } else {
          JSON.parse($(thisTileFXO).find('[id^="hdnChartPricesFXO"]').val())[
            i + 1
          ] = null;
          FXOprice[j] =
            FXOprice[j] +
            "," +
            JSON.parse($(thisTileFXO).find('[id^="hdnChartPricesFXO"]').val())[
              i + 1
            ];
        }
      }
    }

    FXOdate.push(FXOcurrentdate);

    for (var i = 0; i < FXObankname.length; i++) {
      var FXOtempArray = [];
      if (FXOprice[i] != null) {
        FXOtempArray = FXOprice[i].toString().split(",");
      }
      FXOfinal.push(getGraphData(FXObankname[i], FXOtempArray, colors[i]));
    }

    localStorage.setItem("dateArray" + FXOid, JSON.stringify(FXOdate));
    localStorage.setItem("bankArray" + FXOid, JSON.stringify(FXObankname));
    localStorage.setItem("priceArray" + FXOid, JSON.stringify(FXOprice));

    plotGraph(FXOid, FXOdate, FXOfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}

//....................................................................................................................................//

//....................................................// Draw Charts on FX DCI //........................................................//

function drawgraphFXDCI(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var FXDCITileId = Number(canvasid.replace("canvas", ""));
    var thisTileFXDCI = document.getElementById("td" + FXDCITileId);

    DCIid = "myChart" + canvasid;
    clearInitialGraph(DCIid);

    var DCIdate = [];
    DCIfinal = [];
    var DCIdateArray = localStorage.getItem("dateArray" + DCIid);
    var DCIbankArray = localStorage.getItem("bankArray" + DCIid);
    var DCIpriceArray = localStorage.getItem("priceArray" + DCIid);
    if (DCIbankArray != undefined || DCIbankArray != null) {
      var DCIbankname = JSON.parse(DCIbankArray);
      var DCIprice = JSON.parse(DCIpriceArray);
      var DCIdate = JSON.parse(DCIdateArray);
    } else {
      var DCIbankname = [];
      var DCIprice = [];
    }

    var entrymade = 0;
    for (
      var i = 0;
      i <
      JSON.parse($(thisTileFXDCI).find('[id^="hdnChartPricesDCI"]').val())
        .length;
      i += 2
    ) {
      entrymade = 0;

      for (var j = 0; j < DCIbankname.length; j++) {
        if (
          DCIbankname[j] ==
          JSON.parse($(thisTileFXDCI).find('[id^="hdnChartPricesDCI"]').val())[
            i
          ]
        ) {
          if (
            JSON.parse(
              $(thisTileFXDCI).find('[id^="hdnChartPricesDCI"]').val()
            )[i + 1] != "0"
          ) {
            DCIprice[j] =
              DCIprice[j] +
              "," +
              JSON.parse(
                $(thisTileFXDCI).find('[id^="hdnChartPricesDCI"]').val()
              )[i + 1];
          } else {
            JSON.parse(
              $(thisTileFXDCI).find('[id^="hdnChartPricesDCI"]').val()
            )[i] = null;
            DCIprice[j] =
              DCIprice[j] +
              "," +
              JSON.parse(
                $(thisTileFXDCI).find('[id^="hdnChartPricesDCI"]').val()
              )[i + 1];
          }
          entrymade = 1;
        }
      }
      if (entrymade == 0) {
        if (
          JSON.parse($(thisTileFXDCI).find('[id^="hdnChartPricesDCI"]').val())[
            i + 1
          ] != "0"
        ) {
          DCIbankname.push(
            JSON.parse(
              $(thisTileFXDCI).find('[id^="hdnChartPricesDCI"]').val()
            )[i]
          );
          DCIprice.push(
            JSON.parse(
              $(thisTileFXDCI).find('[id^="hdnChartPricesDCI"]').val()
            )[i + 1]
          );
        } else {
          JSON.parse($(thisTileFXDCI).find('[id^="hdnChartPricesDCI"]').val())[
            i + 1
          ] = null;
          DCIprice[j] =
            DCIprice[j] +
            "," +
            JSON.parse(
              $(thisTileFXDCI).find('[id^="hdnChartPricesDCI"]').val()
            )[i + 1];
        }
      }
    }

    var currentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"); //+ "-(" + $("#FXDCI_CCYPairDemo").val() + ")"
    DCIdate.push(currentdate);

    for (var i = 0; i < DCIbankname.length; i++) {
      var temp = [];
      if (DCIprice[i] != null) {
        temp = DCIprice[i].toString().split(",");
      }
      DCIfinal.push(getGraphData(DCIbankname[i], temp, colors[i]));
    }
    localStorage.setItem("dateArray" + DCIid, JSON.stringify(DCIdate));
    localStorage.setItem("bankArray" + DCIid, JSON.stringify(DCIbankname));
    localStorage.setItem("priceArray" + DCIid, JSON.stringify(DCIprice));

    plotGraph(DCIid, DCIdate, DCIfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}

//....................................................................................................................................//

//....................................................// Draw Charts on FI BOND //........................................................//

function drawgraphBOND(canvasid, priceObject) {
  try {
    BONDid = "myChart" + canvasid;
    clearInitialGraph(BONDid);

    var BONDdate = [];
    BONDfinal = [];
    var BONDdateArray = localStorage.getItem("dateArray" + BONDid);
    var BONDbankArray = localStorage.getItem("bankArray" + BONDid);
    var BONDpriceArray = localStorage.getItem("priceArray" + BONDid);
    if (BONDbankArray != undefined || BONDbankArray != null) {
      var BONDbankname = JSON.parse(BONDbankArray);
      var BONDprice = JSON.parse(BONDpriceArray);
      var BONDdate = JSON.parse(BONDdateArray);
    } else {
      var BONDbankname = [];
      var BONDprice = [];
    }

    for (var i = 0; i < priceObject.length; i++) {
      var entrymade = 0;

      if (priceObject[i].PartyID == "DOR3") {
        BONDbname = "Citi";
      } else if (priceObject[i].PartyID == "DOR2") {
        BONDbname = "JPM";
      } else if (priceObject[i].PartyID == "DOR1") {
        BONDbname = "UBS";
      }

      for (var j = 0; j < BONDbankname.length; j++) {
        if (BONDbankname[j] == BONDbname) {
          if (priceObject[i].BidPx == "0") {
            priceObject[i].BidPx = null;
          }
          BONDprice[j] = BONDprice[j] + "," + priceObject[i].BidPx;
          entrymade = 1;
        }
      }
      if (entrymade == 0) {
        if (priceObject[i].BidPx == "0") {
          priceObject[i].BidPx = null;
        }
        if (priceObject[i].PartyID == "DOR3") {
          BONDbankname.push("Citi");
        } else if (priceObject[i].PartyID == "DOR2") {
          BONDbankname.push("JPM");
        } else if (priceObject[i].PartyID == "DOR1") {
          BONDbankname.push("UBS");
        }

        BONDprice.push(priceObject[i].BidPx);
      }
    }
    var currentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");

    BONDdate.push(currentdate);

    for (var i = 0; i < BONDbankname.length; i++) {
      var BONDtemp = [];
      if (BONDprice[i] != null) {
        BONDtemp = BONDprice[i].toString().split(",");
      }
      BONDfinal.push(getGraphData(BONDbankname[i], BONDtemp, colors[i]));
    }

    localStorage.setItem("dateArray" + BONDid, JSON.stringify(BONDdate));
    localStorage.setItem("bankArray" + BONDid, JSON.stringify(BONDbankname));
    localStorage.setItem("priceArray" + BONDid, JSON.stringify(BONDprice));

    plotGraph(BONDid, BONDdate, BONDfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}

//....................................................................................................................................//

//......................................................// Draw Charts on ELI //...................................................//

function drawgraphELI(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var ELITileId = Number(canvasid.replace("canvas", ""));
    var thisTileELI = document.getElementById("td" + ELITileId);
    //var ELIchart = JSON.parse($(thisTileELI).find('[id^="hdnPriceELI"]').val());
    ELIid = "myChart" + canvasid;
    clearInitialGraph(ELIid);

    var ELIdate = [];
    ELIfinal = [];
    var ELIdateArray = localStorage.getItem("dateArray" + ELIid);
    var ELIbankArray = localStorage.getItem("bankArray" + ELIid);
    var ELIpriceArray = localStorage.getItem("priceArray" + ELIid);
    if (ELIbankArray != undefined || ELIbankArray != null) {
      var ELIbankname = JSON.parse(ELIbankArray);
      var ELIprice = JSON.parse(ELIpriceArray);
      var ELIdate = JSON.parse(ELIdateArray);
    } else {
      var ELIbankname = [];
      var ELIprice = [];
    }

    for (
      var i = 0;
      i < JSON.parse($(thisTileELI).find('[id^="hdnPriceELI"]').val()).length;
      i++
    ) {
      var entrymade = 0;

      for (var j = 0; j < ELIbankname.length; j++) {
        if (
          ELIbankname[j] ==
          JSON.parse($(thisTileELI).find('[id^="hdnPriceELI"]').val())[i]
            .PP_CODE
        ) {
          if (
            JSON.parse($(thisTileELI).find('[id^="hdnPriceELI"]').val())[i]
              .PRICE == 0 ||
            JSON.parse($(thisTileELI).find('[id^="hdnPriceELI"]').val())[i]
              .PRICE == null
          ) {
            JSON.parse($(thisTileELI).find('[id^="hdnPriceELI"]').val())[
              i
            ].PRICE = null;
          }
          ELIprice[j] =
            ELIprice[j] +
            "," +
            JSON.parse($(thisTileELI).find('[id^="hdnPriceELI"]').val())[i]
              .PRICE;
          entrymade = 1;
        }
      }
      if (entrymade == 0) {
        if (
          JSON.parse($(thisTileELI).find('[id^="hdnPriceELI"]').val())[i]
            .PRICE == 0 ||
          JSON.parse($(thisTileELI).find('[id^="hdnPriceELI"]').val())[i]
            .PRICE == null
        ) {
          JSON.parse($(thisTileELI).find('[id^="hdnPriceELI"]').val())[
            i
          ].PRICE = null;
        }
        ELIbankname.push(
          JSON.parse($(thisTileELI).find('[id^="hdnPriceELI"]').val())[i]
            .PP_CODE
        );
        ELIprice.push(
          JSON.parse($(thisTileELI).find('[id^="hdnPriceELI"]').val())[i].PRICE
        );
      }
    }
    var currentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");

    ELIdate.push(currentdate);

    for (var i = 0; i < ELIbankname.length; i++) {
      var ELItemp = [];
      if (ELIprice[i] != null) {
        ELItemp = ELIprice[i].toString().split(",");
      }
      ELIfinal.push(getGraphData(ELIbankname[i], ELItemp, colors[i]));
    }

    localStorage.setItem("dateArray" + ELIid, JSON.stringify(ELIdate));
    localStorage.setItem("bankArray" + ELIid, JSON.stringify(ELIbankname));
    localStorage.setItem("priceArray" + ELIid, JSON.stringify(ELIprice));

    plotGraph(ELIid, ELIdate, ELIfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}

//......................................................// Draw Charts on CASH EQ //...................................................//

function drawgraphCASHEQ(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var CashEQId = Number(canvasid.replace("canvas", ""));
    var thisTileCashEq = document.getElementById("td" + CashEQId);

    CASHEQid = "myChart" + canvasid;
    clearInitialGraph(CASHEQid);
    var CashEQtickr;
    CashEQtickr =
      $(thisTileCashEq).find('[id^="CashEQ_sharesTicker"]').html() +
      "-" +
      $(thisTileCashEq).find('[id^="hdnCashEqBuySell"]').val();
    CASHEQfinal = [];

    var CASHEQbankArray = localStorage.getItem("bankArray" + CASHEQid);
    var CASHEQpriceArray = localStorage.getItem("priceArray" + CASHEQid);
    if (CASHEQbankArray != undefined || CASHEQbankArray != null) {
      var CASHEQbankname = JSON.parse(CASHEQbankArray);
      var CASHEQprice = JSON.parse(CASHEQpriceArray);

      CASHEQbankname.push(CashEQtickr);
      CASHEQprice.push(CashEQprice);
    } else {
      var CASHEQbankname = [];
      var CASHEQprice = [];
      CASHEQbankname.push(CashEQtickr);
      CASHEQprice.push(CashEQprice);
    }

    var ctx = document.getElementById(canvasid).getContext("2d");

    var colorstack = [];
    var colorstack2 = [];
    for (var i = 0; i < CASHEQprice.length; i++) {
      var color = getRandomColor();
      colorstack.push(color);
      colorstack2.push(color + "33");
    }

    localStorage.setItem(
      "bankArray" + CASHEQid,
      JSON.stringify(CASHEQbankname)
    );
    localStorage.setItem("priceArray" + CASHEQid, JSON.stringify(CASHEQprice));

    window[CASHEQid] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: CASHEQbankname,
        datasets: [
          {
            data: CASHEQprice,
            backgroundColor: colorstack2,
            borderColor: colorstack,
            borderWidth: 1,
            barPercentage: 0.2,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        responsive: true,
        scales: {
          xAxes: [
            {
              ticks: {},
              barPercentage: 0.2,
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}

//.................................................................................................................................//

//......................................................// Draw Charts on Deposit //...................................................//

function drawgraphDeposit(canvasid) {
  try {
    DEPOSITid = "myChart" + canvasid;
    clearInitialGraph(DEPOSITid);

    Depositfinal = [];

    var DepositbankArray = localStorage.getItem("bankArray" + DEPOSITid);
    var DepositpriceArray = localStorage.getItem("priceArray" + DEPOSITid);
    if (DepositbankArray != undefined || DepositbankArray != null) {
      var Depositbankname = JSON.parse(DepositbankArray);
      var Depositprice = JSON.parse(DepositpriceArray);

      Depositbankname.push(depositCurrency);
      Depositprice.push(interestRateDP);
    } else {
      var Depositbankname = [];
      var Depositprice = [];
      Depositbankname.push(depositCurrency);
      Depositprice.push(interestRateDP);
    }

    var ctx = document.getElementById(canvasid).getContext("2d");

    var colorstack = [];
    var colorstack2 = [];
    for (var i = 0; i < Depositprice.length; i++) {
      var color = getRandomColor();
      colorstack.push(color);
      colorstack2.push(color + "33");
    }

    localStorage.setItem(
      "bankArray" + DEPOSITid,
      JSON.stringify(Depositbankname)
    );
    localStorage.setItem(
      "priceArray" + DEPOSITid,
      JSON.stringify(Depositprice)
    );

    window[DEPOSITid] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Depositbankname,
        datasets: [
          {
            data: Depositprice,
            backgroundColor: colorstack2,
            borderColor: colorstack,
            borderWidth: 1,
            barPercentage: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              ticks: {},
              barPercentage: 0.2,
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}
//.................................................................................................................................//

//......................................................// Draw Charts on FXAQ //...................................................//

function drawgraphFXAQ(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var FXAQTileId = Number(canvasid.replace("canvas", ""));
    var thisTileFXAQ = document.getElementById("td" + FXAQTileId);

    FXAQid = "myChart" + canvasid;
    clearInitialGraph(FXAQid);

    var FXAQdate = [];
    var FXAQfinal = [];

    var FXAQdateArray = localStorage.getItem("dateArray" + FXAQid);
    var FXAQbankArray = localStorage.getItem("bankArray" + FXAQid);
    var FXAQpriceArray = localStorage.getItem("priceArray" + FXAQid);
    if (FXAQbankArray != undefined || FXAQbankArray != null) {
      var FXAQbankname = JSON.parse(FXAQbankArray);
      var FXAQprice = JSON.parse(FXAQpriceArray);
      var FXAQdate = JSON.parse(FXAQdateArray);
    } else {
      var FXAQbankname = [];
      var FXAQprice = [];
    }

    for (
      var i = 0;
      i <
      JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()).length;
      i++
    ) {
      var entrymade = 0;

      if (i == 0) {
        for (var j = 0; j < FXAQbankname.length; j++) {
          if (
            FXAQbankname[j] ==
            JSON.parse(
              $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
            )[0].bestPriceProvider.split(":")[0]
          ) {
            if (
              JSON.parse(
                $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
              )[0].bestPriceProvider.split(":")[1] == 0
            ) {
              FXAQprice[j] = FXAQprice[j] + "," + "null";
            } else {
              FXAQprice[j] =
                FXAQprice[j] +
                "," +
                JSON.parse(
                  $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
                )[0].bestPriceProvider.split(":")[1];
            }
            entrymade = 1;
          }
        }

        if (entrymade == 0) {
          if (
            JSON.parse(
              $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
            )[0].bestPriceProvider.split(":")[1] == 0
          ) {
          } else {
            FXAQbankname.push(
              JSON.parse(
                $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
              )[0].bestPriceProvider.split(":")[0]
            );
            FXAQprice.push(
              JSON.parse(
                $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
              )[0].bestPriceProvider.split(":")[1]
            );
          }
        }
      } else {
        if (
          JSON.parse(
            $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
          )[0].bestPriceProvider.split(":")[0] !=
          JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[i]
            .provider
        ) {
          for (var j = 0; j < FXAQbankname.length; j++) {
            if (
              FXAQbankname[j] ==
              JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[i]
                .provider
            ) {
              if (
                JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[
                  i
                ].premium == 0
              ) {
                FXAQprice[j] = FXAQprice[j] + "," + "null";
              } else {
                FXAQprice[j] =
                  FXAQprice[j] +
                  "," +
                  JSON.parse(
                    $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
                  )[i].premium.toString();
              }
              entrymade = 1;
            }
          }

          if (entrymade == 0) {
            if (
              JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[i]
                .premium == 0
            ) {
            } else {
              FXAQbankname.push(
                JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[
                  i
                ].provider
              );
              FXAQprice.push(
                JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[
                  i
                ].premium.toString()
              );
            }
          }
        }
      }
    }

    var currentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    FXAQdate.push(currentdate);

    for (var i = 0; i < FXAQbankname.length; i++) {
      var temp = [];
      if (FXAQprice[i] != null) {
        temp = FXAQprice[i].split(",");
      }
      FXAQfinal.push(getGraphData(FXAQbankname[i], temp, colors[i]));
    }

    localStorage.setItem("dateArray" + FXAQid, JSON.stringify(FXAQdate));
    localStorage.setItem("bankArray" + FXAQid, JSON.stringify(FXAQbankname));
    localStorage.setItem("priceArray" + FXAQid, JSON.stringify(FXAQprice));

    plotGraph(FXAQid, FXAQdate, FXAQfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}

//....................................................................................................................................//

//......................................................// Draw Charts on FXDQ //...................................................//

function drawgraphFXDQ(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var FXDQTileId = Number(canvasid.replace("canvas", ""));
    var thisTileFXDQ = document.getElementById("td" + FXDQTileId);

    FXDQid = "myChart" + canvasid;
    clearInitialGraph(FXDQid);

    var FXDQdate = [];
    var FXDQfinal = [];

    var FXDQdateArray = localStorage.getItem("dateArray" + FXDQid);
    var FXDQbankArray = localStorage.getItem("bankArray" + FXDQid);
    var FXDQpriceArray = localStorage.getItem("priceArray" + FXDQid);
    if (FXDQbankArray != undefined || FXDQbankArray != null) {
      var FXDQbankname = JSON.parse(FXDQbankArray);
      var FXDQprice = JSON.parse(FXDQpriceArray);
      var FXDQdate = JSON.parse(FXDQdateArray);
    } else {
      var FXDQbankname = [];
      var FXDQprice = [];
    }

    for (
      var i = 0;
      i <
      JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()).length;
      i++
    ) {
      var entrymade = 0;

      if (i == 0) {
        for (var j = 0; j < FXDQbankname.length; j++) {
          if (
            FXDQbankname[j] ==
            JSON.parse(
              $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()
            )[0].bestPriceProvider.split(":")[0]
          ) {
            if (
              JSON.parse(
                $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()
              )[0].bestPriceProvider.split(":")[1] == 0
            ) {
              FXDQprice[j] = FXDQprice[j] + "," + "null";
            } else {
              FXDQprice[j] =
                FXDQprice[j] +
                "," +
                JSON.parse(
                  $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()
                )[0].bestPriceProvider.split(":")[1];
            }
            entrymade = 1;
          }
        }

        if (entrymade == 0) {
          if (
            JSON.parse(
              $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()
            )[0].bestPriceProvider.split(":")[1] == 0
          ) {
          } else {
            FXDQbankname.push(
              JSON.parse(
                $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()
              )[0].bestPriceProvider.split(":")[0]
            );
            FXDQprice.push(
              JSON.parse(
                $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()
              )[0].bestPriceProvider.split(":")[1]
            );
          }
        }
      } else {
        if (
          JSON.parse(
            $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()
          )[0].bestPriceProvider.split(":")[0] !=
          JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[i]
            .provider
        ) {
          for (var j = 0; j < FXDQbankname.length; j++) {
            if (
              FXDQbankname[j] ==
              JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[i]
                .provider
            ) {
              if (
                JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[
                  i
                ].premium == 0
              ) {
                FXDQprice[j] = FXDQprice[j] + "," + "null";
              } else {
                FXDQprice[j] =
                  FXDQprice[j] +
                  "," +
                  JSON.parse(
                    $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()
                  )[i].premium.toString();
              }
              entrymade = 1;
            }
          }

          if (entrymade == 0) {
            if (
              JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[i]
                .premium == 0
            ) {
            } else {
              FXDQbankname.push(
                JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[
                  i
                ].provider
              );
              FXDQprice.push(
                JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[
                  i
                ].premium.toString()
              );
            }
          }
        }
      }
    }

    var currentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    FXDQdate.push(currentdate);

    for (var i = 0; i < FXDQbankname.length; i++) {
      var temp = [];
      if (FXDQprice[i] != null) {
        temp = FXDQprice[i].split(",");
      }
      FXDQfinal.push(getGraphData(FXDQbankname[i], temp, colors[i]));
    }

    localStorage.setItem("dateArray" + FXDQid, JSON.stringify(FXDQdate));
    localStorage.setItem("bankArray" + FXDQid, JSON.stringify(FXDQbankname));
    localStorage.setItem("priceArray" + FXDQid, JSON.stringify(FXDQprice));

    plotGraph(FXDQid, FXDQdate, FXDQfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}
//....................................................................................................................................//

//......................................................// Draw Charts on FXPivot //...................................................//

function drawgraphFXPivot(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var FXPivotTileId = Number(canvasid.replace("canvas", ""));
    var thisTileFXPivot = document.getElementById("td" + FXPivotTileId);

    FXPivotid = "myChart" + canvasid;
    clearInitialGraph(FXPivotid);

    var FXPivotdate = [];
    var FXPivotfinal = [];

    var FXPivotdateArray = localStorage.getItem("dateArray" + FXPivotid);
    var FXPivotbankArray = localStorage.getItem("bankArray" + FXPivotid);
    var FXPivotpriceArray = localStorage.getItem("priceArray" + FXPivotid);
    if (FXPivotbankArray != undefined || FXPivotbankArray != null) {
      var FXPivotbankname = JSON.parse(FXPivotbankArray);
      var FXPivotprice = JSON.parse(FXPivotpriceArray);
      var FXPivotdate = JSON.parse(FXPivotdateArray);
    } else {
      var FXPivotbankname = [];
      var FXPivotprice = [];
    }

    for (
      var i = 0;
      i <
      JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())
        .length;
      i++
    ) {
      var entrymade = 0;

      if (i == 0) {
        for (var j = 0; j < FXPivotbankname.length; j++) {
          if (
            FXPivotbankname[j] ==
            JSON.parse(
              $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
            )[0].bestPriceProvider.split(":")[0]
          ) {
            if (
              JSON.parse(
                $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
              )[0].bestPriceProvider.split(":")[1] == 0
            ) {
              FXPivotprice[j] = FXPivotprice[j] + "," + "null";
            } else {
              FXPivotprice[j] =
                FXPivotprice[j] +
                "," +
                JSON.parse(
                  $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
                )[0].bestPriceProvider.split(":")[1];
            }
            entrymade = 1;
          }
        }

        if (entrymade == 0) {
          if (
            JSON.parse(
              $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
            )[0].bestPriceProvider.split(":")[1] == 0
          ) {
          } else {
            FXPivotbankname.push(
              JSON.parse(
                $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
              )[0].bestPriceProvider.split(":")[0]
            );
            FXPivotprice.push(
              JSON.parse(
                $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
              )[0].bestPriceProvider.split(":")[1]
            );
          }
        }
      } else {
        if (
          JSON.parse(
            $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
          )[0].bestPriceProvider.split(":")[0] !=
          JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[
            i
          ].provider
        ) {
          for (var j = 0; j < FXPivotbankname.length; j++) {
            if (
              FXPivotbankname[j] ==
              JSON.parse(
                $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
              )[i].provider
            ) {
              if (
                JSON.parse(
                  $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
                )[i].premium == 0
              ) {
                FXPivotprice[j] = FXPivotprice[j] + "," + "null";
              } else {
                FXPivotprice[j] =
                  FXPivotprice[j] +
                  "," +
                  JSON.parse(
                    $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
                  )[i].premium.toString();
              }
              entrymade = 1;
            }
          }

          if (entrymade == 0) {
            if (
              JSON.parse(
                $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
              )[i].premium == 0
            ) {
            } else {
              FXPivotbankname.push(
                JSON.parse(
                  $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
                )[i].provider
              );
              FXPivotprice.push(
                JSON.parse(
                  $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()
                )[i].premium.toString()
              );
            }
          }
        }
      }
    }

    var currentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    FXPivotdate.push(currentdate);

    for (var i = 0; i < FXPivotbankname.length; i++) {
      var temp = [];
      if (FXPivotprice[i] != null) {
        temp = FXPivotprice[i].split(",");
      }
      FXPivotfinal.push(getGraphData(FXPivotbankname[i], temp, colors[i]));
    }

    localStorage.setItem("dateArray" + FXPivotid, JSON.stringify(FXPivotdate));
    localStorage.setItem(
      "bankArray" + FXPivotid,
      JSON.stringify(FXPivotbankname)
    );
    localStorage.setItem(
      "priceArray" + FXPivotid,
      JSON.stringify(FXPivotprice)
    );

    plotGraph(FXPivotid, FXPivotdate, FXPivotfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}

//....................................................................................................................................//

//......................................................// Draw Charts on FXTRF //...................................................//

function drawgraphFXTRF(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var FXTRFTileId = Number(canvasid.replace("canvas", ""));
    var thisTileFXTRF = document.getElementById("td" + FXTRFTileId);

    FXTRFid = "myChart" + canvasid;
    clearInitialGraph(FXTRFid);

    var FXTRFdate = [];
    var FXTRFfinal = [];

    var FXTRFdateArray = localStorage.getItem("dateArray" + FXTRFid);
    var FXTRFbankArray = localStorage.getItem("bankArray" + FXTRFid);
    var FXTRFpriceArray = localStorage.getItem("priceArray" + FXTRFid);
    if (FXTRFbankArray != undefined || FXTRFbankArray != null) {
      var FXTRFbankname = JSON.parse(FXTRFbankArray);
      var FXTRFprice = JSON.parse(FXTRFpriceArray);
      var FXTRFdate = JSON.parse(FXTRFdateArray);
    } else {
      var FXTRFbankname = [];
      var FXTRFprice = [];
    }
    for (
      var i = 0;
      i <
      JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()).length;
      i++
    ) {
      var entrymade = 0;

      if (i == 0) {
        for (var j = 0; j < FXTRFbankname.length; j++) {
          if (
            FXTRFbankname[j] ==
            JSON.parse(
              $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
            )[0].bestPriceProvider.split(":")[0]
          ) {
            if (
              JSON.parse(
                $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
              )[0].bestPriceProvider.split(":")[1] == 0
            ) {
              FXTRFprice[j] = FXTRFprice[j] + "," + "null";
            } else {
              FXTRFprice[j] =
                FXTRFprice[j] +
                "," +
                JSON.parse(
                  $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
                )[0].bestPriceProvider.split(":")[1];
            }
            entrymade = 1;
          }
        }

        if (entrymade == 0) {
          if (
            JSON.parse(
              $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
            )[0].bestPriceProvider.split(":")[1] == 0
          ) {
          } else {
            FXTRFbankname.push(
              JSON.parse(
                $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
              )[0].bestPriceProvider.split(":")[0]
            );
            FXTRFprice.push(
              JSON.parse(
                $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
              )[0].bestPriceProvider.split(":")[1]
            );
          }
        }
      } else {
        if (
          JSON.parse(
            $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
          )[0].bestPriceProvider.split(":")[0] !=
          JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[i]
            .provider
        ) {
          for (var j = 0; j < FXTRFbankname.length; j++) {
            if (
              FXTRFbankname[j] ==
              JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[
                i
              ].provider
            ) {
              if (
                JSON.parse(
                  $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
                )[i].premium == 0
              ) {
                FXTRFprice[j] = FXTRFprice[j] + "," + "null";
              } else {
                FXTRFprice[j] =
                  FXTRFprice[j] +
                  "," +
                  JSON.parse(
                    $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
                  )[i].premium.toString();
              }
              entrymade = 1;
            }
          }

          if (entrymade == 0) {
            if (
              JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[
                i
              ].premium == 0
            ) {
            } else {
              FXTRFbankname.push(
                JSON.parse(
                  $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
                )[i].provider
              );
              FXTRFprice.push(
                JSON.parse(
                  $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
                )[i].premium.toString()
              );
            }
          }
        }
      }
    }

    var currentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    FXTRFdate.push(currentdate);

    for (var i = 0; i < FXTRFbankname.length; i++) {
      var temp = [];
      if (FXTRFprice[i] != null) {
        temp = FXTRFprice[i].split(",");
      }
      FXTRFfinal.push(getGraphData(FXTRFbankname[i], temp, colors[i]));
    }
    localStorage.setItem("dateArray" + FXTRFid, JSON.stringify(FXTRFdate));
    localStorage.setItem("bankArray" + FXTRFid, JSON.stringify(FXTRFbankname));
    localStorage.setItem("priceArray" + FXTRFid, JSON.stringify(FXTRFprice));

    plotGraph(FXTRFid, FXTRFdate, FXTRFfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}

//....................................................................................................................................//

//......................................................// Draw Charts on MUTUAL FUNDS || ESHITA K || 23-Sep-2019//...................................................//

function drawgraphMutualFund(canvasid) {
  try {
    MutualFundid = "myChart" + canvasid;
    clearInitialGraph(MutualFundid);

    var FundArray = localStorage.getItem("bankArray" + MutualFundid);
    var NavArray = localStorage.getItem("priceArray" + MutualFundid);
    if (FundArray != undefined || FundArray != null) {
      var Fundname = JSON.parse(FundArray);
      var Navprice = JSON.parse(NavArray);

      Fundname.push(x_fund);
      Navprice.push(y_nav);
    } else {
      var Fundname = [];
      var Navprice = [];
      Fundname.push(x_fund);
      Navprice.push(y_nav);
    }

    var ctx = document.getElementById(canvasid).getContext("2d");

    var colorstack = [];
    var colorstack2 = [];
    for (var i = 0; i < Navprice.length; i++) {
      var color = getRandomColor();
      colorstack.push(color);
      colorstack2.push(color + "33");
    }

    localStorage.setItem("bankArray" + MutualFundid, JSON.stringify(Fundname));
    localStorage.setItem("priceArray" + MutualFundid, JSON.stringify(Navprice));

    window[MutualFundid] = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: Fundname,
        datasets: [
          {
            data: Navprice,
            backgroundColor: colorstack2,
            borderColor: colorstack,
            borderWidth: 1,
            barPercentage: 0.2,
          },
        ],
      },

      options: {
        responsive: true,
        legend: {
          display: false,
        },
        animation: {
          duration: 1,
          onComplete: function () {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;

            ctx.font = Chart.helpers.fontString(
              8,
              Chart.defaults.global.defaultFontStyle,
              Chart.defaults.global.defaultFontFamily
            );
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillStyle = "rgba(192,192,192,0.3)"; //rgba(192,192,192,0.3) //grey

            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x + 16, bar._model.y + 3);
              });
            });
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {},
              barPercentage: 0.2,
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}

//......................................................// Draw Charts on EQBEN || 23-Sep-2019//...................................................//

function drawgraphBEN(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var BENTileId = Number(canvasid.replace("canvas", ""));
    var thisTileBEN = document.getElementById("td" + BENTileId);

    BENid = "myChart" + canvasid;
    clearInitialGraph(BENid);

    var BENdate = [];
    BENfinal = [];

    var BENdateArray = localStorage.getItem("dateArray" + BENid);
    var BENbankArray = localStorage.getItem("bankArray" + BENid);
    var BENpriceArray = localStorage.getItem("priceArray" + BENid);
    if (BENdateArray != undefined || BENbankArray != null) {
      var BENbankname = JSON.parse(BENbankArray);
      var BENprice = JSON.parse(BENpriceArray);
      var BENdate = JSON.parse(BENdateArray);
    } else {
      var BENbankname = [];
      var BENprice = [];
    }
    var BENchatObj = JSON.parse(
      $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val()
    );
    for (var i = 0; i < BENchatObj.length - 1; i++) {
      var entrymade = 0;

      for (var j = 0; j < BENbankname.length; j++) {
        if (BENbankname[j] == BENchatObj[i].PP_CODE) {

          if (BENchatObj[i].BENOUT == 0 || BENchatObj[i].BENOUT == "") {
                      
            // BENchatObj[i].BENOUT = null;
            BENprice[j] = BENprice[j] + "," + "null";
         
          }else{

            BENprice[j] = BENprice[j] + "," + BENchatObj[i].BENOUT;
          }

          entrymade = 1;
        }
      }
      if (entrymade == 0) {
        if (BENchatObj[i].BENOUT == 0 || BENchatObj[i].BENOUT == "") {
           BENchatObj[i].BENOUT = null;
        }else{
          BENbankname.push(BENchatObj[i].PP_CODE);
          BENprice.push(BENchatObj[i].BENOUT);
        }
       
      }
    }

    var currentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      BENdate.push(currentdate);

    for (var i = 0; i < BENbankname.length; i++) {
      var BENtemp = [];
      if (BENprice[i] != null) {
        BENtemp = BENprice[i].split(",");
      }
      BENfinal.push(getGraphData(BENbankname[i], BENtemp, colors[i]));
    }

    localStorage.setItem("dateArray" + BENid, JSON.stringify(BENdate));
    localStorage.setItem("bankArray" + BENid, JSON.stringify(BENbankname));
    localStorage.setItem("priceArray" + BENid, JSON.stringify(BENprice));

    plotGraph(BENid, BENdate, BENfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}

//....................................................................................................................................//

//......................................................// Draw Charts on FXStrategies || 23-Sep-2019//...................................................//

function drawgraphFXStrategies(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var FXStrategiesTileId = Number(canvasid.replace("canvas", ""));
    var thisTileFXStrategies = document.getElementById(
      "td" + FXStrategiesTileId
    );

    FXStrategiesid = "myChart" + canvasid;
    clearInitialGraph(FXStrategiesid);

    var FXStrategiesdate = [];
    var FXStrategiesfinal = [];

    var FXStrategiesdateArray = localStorage.getItem(
      "dateArray" + FXStrategiesid
    );
    var FXStrategiesbankArray = localStorage.getItem(
      "bankArray" + FXStrategiesid
    );
    var FXStrategiespriceArray = localStorage.getItem(
      "priceArray" + FXStrategiesid
    );
    if (FXStrategiesbankArray != undefined || FXStrategiesbankArray != null) {
      var FXStrategiesbankname = JSON.parse(FXStrategiesbankArray);
      var FXStrategiesprice = JSON.parse(FXStrategiespriceArray);
      var FXStrategiesdate = JSON.parse(FXStrategiesdateArray);
    } else {
      var FXStrategiesbankname = [];
      var FXStrategiesprice = [];
    }

    for (
      var i = 0;
      i <
      JSON.parse(
        $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val()
      ).length;
      i++
    ) {
      var entrymade = 0;

      if (i == 0) {
        for (var j = 0; j < FXStrategiesbankname.length; j++) {
          if (
            FXStrategiesbankname[j] ==
            JSON.parse(
              $(thisTileFXStrategies)
                .find('[id^="hdnPricesFXStrategies"]')
                .val()
            )[0].bestPriceProvider.split(":")[0]
          ) {
            if (
              JSON.parse(
                $(thisTileFXStrategies)
                  .find('[id^="hdnPricesFXStrategies"]')
                  .val()
              )[0].bestPriceProvider.split(":")[1] == 0
            ) {
              FXStrategiesprice[j] = FXStrategiesprice[j] + "," + "null";
            } else {
              FXStrategiesprice[j] =
                FXStrategiesprice[j] +
                "," +
                JSON.parse(
                  $(thisTileFXStrategies)
                    .find('[id^="hdnPricesFXStrategies"]')
                    .val()
                )[0].bestPriceProvider.split(":")[1];
            }
            entrymade = 1;
          }
        }

        if (entrymade == 0) {
          if (
            JSON.parse(
              $(thisTileFXStrategies)
                .find('[id^="hdnPricesFXStrategies"]')
                .val()
            )[0].bestPriceProvider.split(":")[1] == 0
          ) {
          } else {
            FXStrategiesbankname.push(
              JSON.parse(
                $(thisTileFXStrategies)
                  .find('[id^="hdnPricesFXStrategies"]')
                  .val()
              )[0].bestPriceProvider.split(":")[0]
            );
            FXStrategiesprice.push(
              JSON.parse(
                $(thisTileFXStrategies)
                  .find('[id^="hdnPricesFXStrategies"]')
                  .val()
              )[0].bestPriceProvider.split(":")[1]
            );
          }
        }
      } else {
        if (
          JSON.parse(
            $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val()
          )[0].bestPriceProvider.split(":")[0] !=
          JSON.parse(
            $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val()
          )[i].provider
        ) {
          for (var j = 0; j < FXStrategiesbankname.length; j++) {
            if (
              FXStrategiesbankname[j] ==
              JSON.parse(
                $(thisTileFXStrategies)
                  .find('[id^="hdnPricesFXStrategies"]')
                  .val()
              )[i].provider
            ) {
              if (
                JSON.parse(
                  $(thisTileFXStrategies)
                    .find('[id^="hdnPricesFXStrategies"]')
                    .val()
                )[i].premium == 0
              ) {
                FXStrategiesprice[j] = FXStrategiesprice[j] + "," + "null";
              } else {
                FXStrategiesprice[j] =
                  FXStrategiesprice[j] +
                  "," +
                  JSON.parse(
                    $(thisTileFXStrategies)
                      .find('[id^="hdnPricesFXStrategies"]')
                      .val()
                  )[i].premium.toString();
              }
              entrymade = 1;
            }
          }

          if (entrymade == 0) {
            if (
              JSON.parse(
                $(thisTileFXStrategies)
                  .find('[id^="hdnPricesFXStrategies"]')
                  .val()
              )[i].premium == 0
            ) {
            } else {
              FXStrategiesbankname.push(
                JSON.parse(
                  $(thisTileFXStrategies)
                    .find('[id^="hdnPricesFXStrategies"]')
                    .val()
                )[i].provider
              );
              FXStrategiesprice.push(
                JSON.parse(
                  $(thisTileFXStrategies)
                    .find('[id^="hdnPricesFXStrategies"]')
                    .val()
                )[i].premium.toString()
              );
            }
          }
        }
      }
    }

    var currentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    FXStrategiesdate.push(currentdate);

    for (var i = 0; i < FXStrategiesbankname.length; i++) {
      var temp = [];
      if (FXStrategiesprice[i] != null) {
        temp = FXStrategiesprice[i].split(",");
      }
      FXStrategiesfinal.push(
        getGraphData(FXStrategiesbankname[i], temp, colors[i])
      );
    }

    localStorage.setItem(
      "dateArray" + FXStrategiesid,
      JSON.stringify(FXStrategiesdate)
    );
    localStorage.setItem(
      "bankArray" + FXStrategiesid,
      JSON.stringify(FXStrategiesbankname)
    );
    localStorage.setItem(
      "priceArray" + FXStrategiesid,
      JSON.stringify(FXStrategiesprice)
    );

    plotGraph(FXStrategiesid, FXStrategiesdate, FXStrategiesfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}

//....................................................................................................................................//

//....................................................// Draw Charts on DRA //........................................................//

function drawgraphDRA(canvasid) {
  try {
    // Added logic to get price object from current tile - by Onkar E. 13/11/2019
    var DRATileId = Number(canvasid.replace("canvas", ""));
    var thisTileDRA = document.getElementById("td" + DRATileId);

    DRAid = "myChart" + canvasid;
    clearInitialGraph(DRAid);

    var DRAdate = [];
    DRAfinal = [];

    var DRAdateArray = localStorage.getItem("dateArray" + DRAid);
    var DRAbankArray = localStorage.getItem("bankArray" + DRAid);
    var DRApriceArray = localStorage.getItem("priceArray" + DRAid);
    if (DRAbankArray != undefined || DRAbankArray != null) {
      var DRAbankname = JSON.parse(DRAbankArray);
      var DRAprice = JSON.parse(DRApriceArray);
      var DRAdate = JSON.parse(DRAdateArray);
    } else {
      var DRAbankname = [];
      var DRAprice = [];
    }
    var DRAchatObj = JSON.parse(
      $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val()
    );
    for (var i = 0; i < DRAchatObj.length - 1; i++) {
      var entrymade = 0;

      for (var j = 0; j < DRAbankname.length; j++) {
        if (DRAbankname[j] == DRAchatObj[i].PP_CODE) {
                    if (DRAchatObj[i].DRAOUT == 0 || DRAchatObj[i].DRAOUT == "") {
            DRAchatObj[i].DRAOUT = null;
          }
          DRAprice[j] = DRAprice[j] + "," + DRAchatObj[i].DRAOUT;
          entrymade = 1;
        }
      }
      if (entrymade == 0) {
        if (DRAchatObj[i].DRAOUT == 0 || DRAchatObj[i].DRAOUT == "") {
          DRAchatObj[i].DRAOUT = null;
        }
        DRAbankname.push(DRAchatObj[i].PP_CODE);
        DRAprice.push(DRAchatObj[i].DRAOUT);
      }
    }

    var currentdate = new Date()
      .toLocaleTimeString()
      .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    DRAdate.push(currentdate);

    for (var i = 0; i < DRAbankname.length; i++) {
      var DRAtemp = [];
      if (DRAprice[i] != null) {
        DRAtemp = DRAprice[i].split(",");
      }
      DRAfinal.push(getGraphData(DRAbankname[i], DRAtemp, colors[i]));
    }

    localStorage.setItem("dateArray" + DRAid, JSON.stringify(DRAdate));
    localStorage.setItem("bankArray" + DRAid, JSON.stringify(DRAbankname));
    localStorage.setItem("priceArray" + DRAid, JSON.stringify(DRAprice));

    plotGraph(DRAid, DRAdate, DRAfinal, canvasid);
  } catch (error) {
    console.log(error.message);
  }
}

//....................................................................................................................................//

function drawgraphEQCOption(canvasid) {
    try {
        var EQCOptionTileId = Number(canvasid.replace("canvas", ""));
        var thisTileEQCOption = document.getElementById("td" + EQCOptionTileId);
        EQCOptionid = "myChart" + canvasid;
        clearInitialGraph(EQCOptionid);
        var EQCOptiondate = [];
        var EQCOptionfinal = [];
        var EQCOptiondateArray = localStorage.getItem("dateArray" + EQCOptionid);
        var EQCOptionbankArray = localStorage.getItem("bankArray" + EQCOptionid);
        var EQCOptionpriceArray = localStorage.getItem("priceArray" + EQCOptionid);
        if (EQCOptionbankArray != undefined || EQCOptionbankArray != null) {
            var EQCOptionbankname = JSON.parse(EQCOptionbankArray);
            var EQCOptionprice = JSON.parse(EQCOptionpriceArray);
            var EQCOptiondate = JSON.parse(EQCOptiondateArray);
        } else {
            var EQCOptionbankname = [];
            var EQCOptionprice = [];
        }
        for (
            var i = 0; i <
            JSON.parse($(thisTileEQCOption).find('[id^="hdnChartPricesOptions"]').val())
                .length -
            1; i++
        ) {
            var entrymade = 0;
            for (var j = 0; j < EQCOptionbankname.length; j++) {
                if (
                    EQCOptionbankname[j] ==
                    JSON.parse($(thisTileEQCOption).find('[id^="hdnChartPricesOptions"]').val())[i]
                        .PP_CODE
                ) {
                    if (
                        JSON.parse($(thisTileEQCOption).find('[id^="hdnChartPricesOptions"]').val())[
                            i
                        ].EQOOUT == 0 || JSON.parse($(thisTileEQCOption).find('[id^="hdnChartPricesOptions"]').val())[i]
                            .EQOOUT == ""
                    ) {
                        // JSON.parse($(thisTileEQCOption).find('[id^="hdnChartPricesOptions"]').val())[
                        //     i
                        // ].EQOOUT = "null";
                        
                        EQCOptionprice[j] =
                        EQCOptionprice[j] + 
                        "," + 'null'
                    }else{
                      EQCOptionprice[j] =
                      EQCOptionprice[j] +
                      "," +
                      Number(JSON.parse($(thisTileEQCOption).find('[id^="hdnChartPricesOptions"]').val())[i].EQOOUT).toFixed(2)
                    }
                    
                    entrymade = 1;
                }
            }
            if (entrymade == 0) {
                if (
                    JSON.parse($(thisTileEQCOption).find('[id^="hdnChartPricesOptions"]').val())[i]
                        .EQOOUT == 0 || JSON.parse($(thisTileEQCOption).find('[id^="hdnChartPricesOptions"]').val())[i]
                            .EQOOUT == ""
                ) {
                    // JSON.parse($(thisTileEQCOption).find('[id^="hdnChartPricesOptions"]').val())[
                    //     i
                    // ].EQOOUT = "null";
                }else{
                  EQCOptionbankname.push(
                    JSON.parse($(thisTileEQCOption).find('[id^="hdnChartPricesOptions"]').val())[i]
                    .PP_CODE
                );
                EQCOptionprice.push(
                  Number(JSON.parse($(thisTileEQCOption).find('[id^="hdnChartPricesOptions"]').val())[i].EQOOUT).toFixed(2));
                }
           
            }
        }
        var currentdate = new Date()
            .toLocaleTimeString()
            .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        EQCOptiondate.push(currentdate);
        for (var i = 0; i < EQCOptionbankname.length; i++) {
            var temp = [];
            if (EQCOptionprice[i] != null) {
                temp = EQCOptionprice[i].split(",");
            }
            EQCOptionfinal.push(getGraphData(EQCOptionbankname[i], temp, colors[i]));
        }
        localStorage.setItem("dateArray" + EQCOptionid, JSON.stringify(EQCOptiondate));
        localStorage.setItem("bankArray" + EQCOptionid, JSON.stringify(EQCOptionbankname));
        localStorage.setItem("priceArray" + EQCOptionid, JSON.stringify(EQCOptionprice));
        plotGraph(EQCOptionid, EQCOptiondate, EQCOptionfinal, canvasid);
    } catch (error) {
        console.log(error.message);
    }
}
function drawgraphEQCPhoenix(canvasid) {
    try {
        var EQCPhoenixTileId = Number(canvasid.replace("canvas", ""));
        var thisTileEQCPhoenix = document.getElementById("td" + EQCPhoenixTileId);
        EQCPhoenixid = "myChart" + canvasid;
        clearInitialGraph(EQCPhoenixid);
        var EQCPhoenixdate = [];
        var EQCPhoenixfinal = [];
        var EQCPhoenixdateArray = localStorage.getItem("dateArray" + EQCPhoenixid);
        var EQCPhoenixbankArray = localStorage.getItem("bankArray" + EQCPhoenixid);
        var EQCPhoenixpriceArray = localStorage.getItem("priceArray" + EQCPhoenixid);
        if (EQCPhoenixbankArray != undefined || EQCPhoenixbankArray != null) {
            var EQCPhoenixbankname = JSON.parse(EQCPhoenixbankArray);
            var EQCPhoenixprice = JSON.parse(EQCPhoenixpriceArray);
            var EQCPhoenixdate = JSON.parse(EQCPhoenixdateArray);
        } else {
            var EQCPhoenixbankname = [];
            var EQCPhoenixprice = [];
        }
        for (
            var i = 0; i <
            JSON.parse($(thisTileEQCPhoenix).find('[id^="hdnChartPricesPhoenix"]').val())
                .length -
            1; i++
        ) {
            var entrymade = 0;
            for (var j = 0; j < EQCPhoenixbankname.length; j++) {
                if (
                    EQCPhoenixbankname[j] ==
                    JSON.parse($(thisTileEQCPhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[i]
                        .PP_CODE
                ) {
                    if (
                        JSON.parse($(thisTileEQCPhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[
                            i
                        ].PhoenixOUT == 0 || JSON.parse($(thisTileEQCPhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[i].PhoenixOUT == ""
                    ) {
                        JSON.parse($(thisTileEQCPhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[
                            i
                        ].PhoenixOUT = "null";
                    }
                    EQCPhoenixprice[j] =
                        EQCPhoenixprice[j] +
                        "," +
                        JSON.parse($(thisTileEQCPhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[
                            i
                        ].PhoenixOUT;
                    entrymade = 1;
                }
            }
            if (entrymade == 0) {
                if (JSON.parse($(thisTileEQCPhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[i].PhoenixOUT === 0 || JSON.parse($(thisTileEQCPhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[i].PhoenixOUT == "") {
                    JSON.parse($(thisTileEQCPhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[i].PhoenixOUT = "null";
                }
                EQCPhoenixbankname.push(
                    JSON.parse($(thisTileEQCPhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[i]
                        .PP_CODE
                );
                EQCPhoenixprice.push(
                    JSON.parse($(thisTileEQCPhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[i]
                        .PhoenixOUT
                );
            }
        }
        var currentdate = new Date()
            .toLocaleTimeString()
            .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        EQCPhoenixdate.push(currentdate);
        for (var i = 0; i < EQCPhoenixbankname.length; i++) {
            var temp = [];
            if (EQCPhoenixprice[i] != null) {
                temp = EQCPhoenixprice[i].split(",");
            }
            EQCPhoenixfinal.push(getGraphData(EQCPhoenixbankname[i], temp, colors[i]));
        }
        localStorage.setItem("dateArray" + EQCPhoenixid, JSON.stringify(EQCPhoenixdate));
        localStorage.setItem("bankArray" + EQCPhoenixid, JSON.stringify(EQCPhoenixbankname));
        localStorage.setItem("priceArray" + EQCPhoenixid, JSON.stringify(EQCPhoenixprice));
        plotGraph(EQCPhoenixid, EQCPhoenixdate, EQCPhoenixfinal, canvasid);
    } catch (error) {
        console.log(error.message);
    }
}
//........................... Code Optimization : Functions in Graph (by Onkar) .................................................................//

//---------- Create Object for Graph || Onkar E || 13-Sep-2019 -----------//
function getGraphData(bank, price, color) {
  try {
    var jsonObj = {};
    jsonObj = {
      label: bank,
      color: color,
      borderColor: color,
      pointBorderColor: color,
      pointBackgroundColor: color,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: color,
      pointBorderWidth: 3,
      pointHoverRadius: 3,
      pointHoverBorderWidth: 1,
      pointRadius: 0.5,
      backgroundColor: color,
      fill: false,
      borderWidth: 1,
      lineTension: 0.3,
      data: price,
    };
    return jsonObj;
  } catch (error) {
    console.log(error.message);
  }
}
//END
//---------- Plot Graph || Onkar E || 13-Sep-2019 -----------//

function plotGraph(name, labels, datasets, canvasid) {
  try {
    var ctx = document.getElementById(canvasid).getContext("2d");
    window[name] = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: opt,
    });
  } catch (error) {
    console.log(error.message);
  }
}
//END

//---------- Clear Graph || Onkar E || 13-Sep-2019 -----------//

function ClearGraphAll(that) {
  try {
    var productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    if (productName == "CASHFX") {
      window[
        $($(that).parents(".sorting").find("canvas")).attr("id")
      ].destroy();
    } else {
      canvasId = $($(that).parents(".sorting").find("canvas")).attr("id");
      canvasId = "myChart" + canvasId;
      localStorage.removeItem("bankArray" + canvasId);
      localStorage.removeItem("priceArray" + canvasId);
      localStorage.removeItem("dateArray" + canvasId);
      window[canvasId].destroy();
    }
  } catch (error) {
    console.log(error.message);
  }
}
//END
//---------- Clear Initial Graph || Onkar E || 13-Sep-2019 -----------//
function clearInitialGraph(graphId) {
  try {
    if (window[graphId] != undefined) {
      window[graphId].destroy();
    }
  } catch (error) {
    console.log(error.message);
  }
}
//END
//------------------------- Random Color Generator for bar chart ---------------------------//

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
