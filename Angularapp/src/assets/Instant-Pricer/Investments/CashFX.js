//Added by AniruddhaJ
var WebSocketIP = '52.163.118.116'; //'1finiq.finiq-connect.com' //
var USERID;
var clientSideFX = "Sell";
var priceArray = [];
var PriceQuoteRef = "";
var CurrencyPair = "";
var FixingDate = "";
var ValueDate = "";
var productCode = "";
var BankSpread = "";
var CCYAmount1 = "";
var tenorCode = "";
var FinIQPriceQuoteId = "";
var ExternalQuoteID = "";
var objPrice;
var UBSArray = [];
var JPMArray = [];
var OCBCArray = [];
var count = 0;
var spotDate = "";
var d = new Date();
var wsprotocol;
var ws;
var tenorListCashFX = ["1W", "2W", "3W", "1M", "2M", "3M", "6M", "1Y", "3Y"];
var tenorListCashFXSpot = ["TOD", "TOM", "SPOT"];

var BNPPArray = [];

var idCASHFX = 1;

var counterpartyName = {};

$(document).ready(function () {
    if (location.protocol === "http:")
        wsprotocol = "ws:"
    else if (location.protocol === "https:")
        wsprotocol = "wss:"
    else
        wsprotocol = "ws:"
    ws = new WebSocket("" + wsprotocol + "//" + WebSocketIP + "/FinIQService/WSCallback.svc");
});

function cashFXBuySellToggle(that, idCASHFX) {
    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileCashFX = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        if ($(thisTileCashFX).find('[id^="rbRowFXCash"]')[0].checked) {
            clientSideFX = "Sell";
        } else {
            clientSideFX = "Buy";
        }

    } catch (error) {
        console.log(error.message);
    }
}

function ddl_tenorFXCASH(that) {

    // To select the tenor 
    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileCashFX = document.getElementById("td" + TileId);
        $(thisTileCashFX).find('[id^="tenorFXCASH"]').removeClass('ValidateFieldCSS')
        $(document.getElementById("required")).hide();

        getDatesForCurrentPair_BOS(TileId);

    } catch (error) {
        console.log(error.message)
    }

}
// To set default values of parameters
function setDeafaultValuesCashFX(currId) {
    try {

        thisTileCashFX = document.getElementById("td" + currId);


        $(thisTileCashFX).find('[id^="rbRowFXCash"]')[0].checked = true;
        $(thisTileCashFX).find('[id^="FXCASH_ContractAmt"]').val("1,000,000.00");
        $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val("EUR - USD");
    } catch (error) {
        console.log(error.message)
    }
}
// To select Buy / Sell toggle swtich
function ddl_FXO_Direction(that) {
    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileCashFX = document.getElementById("td" + TileId);

        if ($(thisTileCashFX).find("[id^='FXO_Direction']")[0].value.trim().toUpperCase() === "FORWARD") {
            fillDropdownlistControl(tenorListCashFX, $(thisTileCashFX).find('[id^="tenorFXCASH"]').attr('id'));
            document.querySelector("#" + ($(thisTileCashFX).find('[id^="tenorFXCASH"]').attr('id'))).selectedIndex = 0;
        } else {
            fillDropdownlistControl(tenorListCashFXSpot, $(thisTileCashFX).find('[id^="tenorFXCASH"]').attr('id'));
            document.querySelector("#" + ($(thisTileCashFX).find('[id^="tenorFXCASH"]').attr('id'))).selectedIndex = 0;
        }


        ///  if ($(thisTileCashFX).find('[id^="FXO_Direction"]').val() == "Spot") {
        //    $(thisTileCashFX).find('[id^="tenorFXCashRow"]').hide();

        //} else {

        //  $(thisTileCashFX).find('[id^="tenorFXCashRow"]').show();
        ddl_tenorFXCASH(that);

        /// }
    } catch (error) {
        console.log(error.message);
    }
}
// To load Cash FX default functions and values
function onLoadCashFX(currId) {
    try {

        thisTileCashFX = document.getElementById("td" + currId);
        setDeafaultValuesCashFX(currId);
        ddl_FXO_Direction(thisTileCashFX);


        $(thisTileCashFX).find('[id^="userIDCashFX"]').val(USERID);
        localStorage.setItem("isDataClear_" + currId, "false");



    } catch (error) {
        console.log("Cash FX id " + currId + " " + error.message);
    }

}
window.onbeforeunload = function () {
    if (ws != null && ws != undefined) {
        ws.send("Closing Sockets!");
        ws.close();
    } else {
        var myWebSocket = new WebSocket("ws://" + WebSocketIP + "/FinIQService/WSCallback.svc");
        myWebSocket.send("Closing Sockets!");
        myWebSocket.close();
    }
}
// To start pricing (inital function for pricing)
function startCashFXPricing(that) {

    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileCashFX = document.getElementById("td" + TileId);

        getPPDetails(that);

        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
        idCASHFX = $(that).parents("td.newlyCreated")[0].id.substring(2, $(that).parents("td.newlyCreated")[0].id.length);
        localStorage.setItem("isDataClear_" + TileId, "false");
        //Validation conditions added || Tina Kshirsagar || 6-09-2019 

        if ($.trim($(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val()) == '') {
            ValidateField($(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').attr('id'), "Please Select Valid Currency Pair", thisTileCashFX);
            return false
        } else if ($.trim($(thisTileCashFX).find('[id^="FXCASH_ContractAmt"]').val()) == '' || parseFloat($(thisTileCashFX).find('[id^="FXCASH_ContractAmt"]').val()) == 0) {
            ValidateField($(thisTileCashFX).find('[id^="FXCASH_ContractAmt"]').attr('id'), "Please Enter Valid Contract Amount", thisTileCashFX);
            return false
        } else if ($.trim($(thisTileCashFX).find('[id^="tenorFXCASH"]').val()) == '' && $.trim($(thisTileCashFX).find('[id^="FXO_Direction"]').val()) == 'Forward') {
            ValidateField($(thisTileCashFX).find('[id^="tenorFXCASH"]').attr('id'));
            return false
        } else if ($(thisTileCashFX).find("[id^='FXCASH_SpreadAmt']").val().trim() == "") {
            ValidateField($(thisTileCashFX).find('[id^="FXCASH_SpreadAmt"]').attr('id'), "Please Enter Valid Spread Amount.", thisTileCashFX);

            return false
        }
        //Validation END
        $(thisTileCashFX).find("[id^='loaderCashFX']").show();

        getDatesForCurrentPair_BOS(TileId, that);


    } catch (error) {
        console.log(error.message);
        $(thisTileCashFX).find('[id^="loaderCashFX"]').hide();

    }
}
// To get required dates for current parameters
function getDatesForCurrentPair_BOS(TileId, that) {
    try {
        let ProductId=0;
        thisTileCashFX = document.getElementById("td" + TileId);
        if ($(thisTileCashFX).find('[id^="FXO_Direction"]')[0].value.toUpperCase() == "SPOT") {
            productCode = "FXC";
ProductId=1
        } else {
            productCode = "FXW";
            ProductId=2
        }
        var temp = d.toShortFormat().split("-");
        var nearValueTradeDate = "";
        var a = temp[0];

        if (a.length == 1) {
            nearValueTradeDate = "0" + temp[0] + "-" + temp[1] + "-" + temp[2];
        } else {
            nearValueTradeDate = d.toShortFormat();
        }

        var DateObj = {
            "CurrencyPair": $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val(),
            "TenorCode": $(thisTileCashFX).find('[id^="tenorFXCASH"]')[0].value, ///productCode == "FXC" ? "SPOT" :
            "EntityId": clientConfigdata.CashFX.EntityCode,
            "ProductCode": productCode,
            "ProductId": ProductId,
            "TradeDate": nearValueTradeDate,
            "NearLegValueDate": nearValueTradeDate,
            "SourceSystem": "FinIQ",
            "ModeType": "",
            "currentTileID": TileId
        }
        var dataDates = request_getDataFromAPI(DateObj, clientConfigdata.CommonMethods.NodeServer + "getFxCashPairDates").then(data => {

            thisTileCashFX = document.getElementById("td" + data.currentTileID);


            FixingDate = data.PairDates.PairDateInfo.FinIQFixingDate;
            ValueDate = data.PairDates.PairDateInfo.FinIQValueDate;
            spotDate = data.PairDates.PairDateInfo.FinIQSpotDate;

            $(thisTileCashFX).find('[id^="hdnFixingDate"]').val(FixingDate);
            $(thisTileCashFX).find('[id^="hdnSpotDate"]').val(spotDate);
            $(thisTileCashFX).find('[id^="hdnValueDate"]').val(ValueDate);
            $(thisTileCashFX).find('[id^="cashFXTenorValueDate"]').html(ValueDate);

            if (that != undefined) {

                bindPriceData(that)
            }
            return ValueDate;

        }).catch(error => {
            console.log(error);

        })
    } catch (er) {
        console.log(er.message);
        $(thisTileCashFX).find('[id^="loaderCashFX"]').hide();

    }
}
// To bind the socket for price data
var objPrice = "";
function bindPriceData_Socket(priceStream, appendID, USERID, TileId) {
    try {
        console.log(priceStream);
        var pricingRow = "";
        var minprice = "";

        thisTileCashFX = document.getElementById("td" + TileId);
        $(thisTileCashFX).find('[id^="loaderCashFX"]').hide();
        pricingRow = $(thisTileCashFX).find('[id^="TRCashFXPRICE"]')[0];


        if (localStorage.getItem("isDataClear_" + TileId) == "true") {
            return false;
        } else {

        }
        objPrice = JSON.parse(priceStream);
        if ($(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]')[0].value == "") {
            return false;
        } else if (pricingRow.cells[1].innerText.trim() == "-") {
            return false;
        }



        if (!$(thisTileCashFX).find('[id^="rbRowFXCash"]')[0].checked) {


            if (priceArray.length == Object.keys(counterpartyName).length) {
                priceArray = [];

                $(pricingRow.cells).each((index, element) => {

                    if (index !== 0) {


                        if (element.innerText.trim() != "") {

                            priceArray.push(Number(element.innerText.trim()))

                        }
                    }

                });


                minprice = Math.min(...priceArray)
            } else {
                priceArray.push(objPrice.NearForwardRate);
                minprice = Math.min(...priceArray);
            }



        } else {
            //for Sell
            if (priceArray.length == Object.keys(counterpartyName).length) {
                priceArray = [];
                $(pricingRow.cells).each((index, element) => {

                    if (index !== 0) {
                        if (element.innerText.trim() != "") {

                            priceArray.push(Number(element.innerText.trim()))

                        }
                    }

                });

                minprice = Math.max(...priceArray)
            } else {
                priceArray.push(objPrice.NearForwardRate);
                minprice = Math.max(...priceArray);
            }

        }
        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
        var priceClass = "GlowPrice_Red";
        if (!glowFlag) {
            priceClass = "noGlow";
        }

    // Added code for chart data collection - by Akash Y. 26/05/2020 //
    let chartPriceObj = [];
    var Cashfxbankfound = false;
    var tempPriceArray = [];
    if ($(thisTileCashFX).find('[id^="hdnchartPriceObj"]')[0].value != "") {
      chartPriceObj = JSON.parse(
        $(thisTileCashFX).find('[id^="hdnchartPriceObj"]')[0].value
      );
      chartPriceObj.forEach((element, index) => {
        if (
          element.bankName == counterpartyName[Number(objPrice.PriceProviderId)]
        ) {
          chartPriceObj[index].AllPrices.push({
            price: objPrice.NearForwardRate,
          });
          Cashfxbankfound = true;
        }
      });
      if (!Cashfxbankfound) {
        tempPriceArray.push({ price: objPrice.NearForwardRate });
        chartPriceObj.push({
          bankName: counterpartyName[Number(objPrice.PriceProviderId)],
          AllPrices: tempPriceArray,
        });
      }
    } else {
      tempPriceArray.push({ price: objPrice.NearForwardRate });
      chartPriceObj.push({
        bankName: counterpartyName[Number(objPrice.PriceProviderId)],
        AllPrices: tempPriceArray,
      });
    }

    console.log(JSON.stringify(chartPriceObj));
    $(thisTileCashFX).find(
      '[id^="hdnchartPriceObj"]'
    )[0].value = JSON.stringify(chartPriceObj);
    // END

        UBSArray.push({ ID: USERID, Price: objPrice.NearForwardRate });

        $("#" + USERID + "_" + objPrice.PriceProviderId).empty();

        $("#" + USERID + "_" + objPrice.PriceProviderId).removeClass("priceTD").find("span.GlowPrice_Red").removeClass("GlowPrice_Red");
        $("#" + USERID + "_BankName" + objPrice.PriceProviderId).removeClass("bestbankPriceTD");

        if (objPrice.NearForwardRate >= minprice) {

            //    $("#bestExternalQuoteReqID" + USERID).empty()
            //   $("#bestQuoteReqID" + USERID).empty()
            //  $("#bestPriceProviderId" + USERID).empty()

            $("#bestNearSwapPoint" + USERID).html(objPrice.NearSwapPoint);
            $("#bestNearSpotRate" + USERID).html(objPrice.NearSpotRate);

            $("#bestExternalQuoteReqID" + USERID).html(objPrice.ExternalQuoteID)
            $("#bestQuoteReqID" + USERID).html(objPrice.QuoteId)
            $("#bestPriceProviderId" + USERID).html(objPrice.PriceProviderId)
            //     $("#BestBankToBook" + USERID).find("span").empty();


            $("#BestBankToBook" + USERID).find("span").append(counterpartyName[Number(objPrice.PriceProviderId)]);
            //    $("#BestPrice" + USERID).empty();

            $("#BestPrice" + USERID).html("<span class=''>" + objPrice.NearForwardRate + "</span>");

            $(thisTileCashFX).find('[id^="rbRowFXCash"]')[0].checked ? $("#FXCASH_CustAmt_" + USERID).val((Number(objPrice.NearForwardRate) - (Number($(thisTileCashFX).find("[id^='FXCASH_SpreadAmt']").val().trim()) / Math.pow(10, Number($(thisTileCashFX).find("[id^='hdnpointShift']").val())))).toFixed(Number($(thisTileCashFX).find("[id^='hdnRatedecimal']").val()))) : $("#FXCASH_CustAmt_" + USERID).val((Number(objPrice.NearForwardRate) + (Number($(thisTileCashFX).find("[id^='FXCASH_SpreadAmt']").val().trim()) / Math.pow(10, Number($(thisTileCashFX).find("[id^='hdnpointShift']").val())))).toFixed(Number($(thisTileCashFX).find("[id^='hdnRatedecimal']").val())));


            $("#" + USERID + "_" + objPrice.PriceProviderId).append("<span class='" + priceClass + "'>" + objPrice.NearForwardRate + "</span>").addClass("priceTD");
            $("#" + USERID + "_" + objPrice.PriceProviderId).addClass("bestbankPriceTD");

            var span = "";

            span = span + "<span class='price_QuoteID' style='display:none;'>" + objPrice.QuoteId + "</span>";

            span = span + "<span class='price_ExternalQuoteID' style='display:none;'>" + objPrice.ExternalQuoteID + "</span>";

            span = span + "<span class='price_PriceProviderID' style='display:none;'>" + objPrice.PriceProviderId + "</span>";

            span = span + "<span class='price_NearSwapPoint' style='display:none;'>" + objPrice.NearSwapPoint + "</span>";
            span = span + "<span class='price_NearSpotRate' style='display:none;'>" + objPrice.NearSpotRate + "</span>";

            span = span + "<span class='price_BestBankToBook' style='display:none;'>" + counterpartyName[Number(objPrice.PriceProviderId)] + "</span>";

            $("#" + USERID + "_" + objPrice.PriceProviderId).append(span);

        } else {
            $("#" + USERID + "_" + objPrice.PriceProviderId).append("<span>" + objPrice.NearForwardRate + "</span>");


            var span = "";

            span = span + "<span class='price_QuoteID' style='display:none;'>" + objPrice.QuoteId + "</span>";

            span = span + "<span class='price_ExternalQuoteID' style='display:none;'>" + objPrice.ExternalQuoteID + "</span>";

            span = span + "<span class='price_PriceProviderID' style='display:none;'>" + objPrice.PriceProviderId + "</span>";

            span = span + "<span class='price_NearSwapPoint' style='display:none;'>" + objPrice.NearSwapPoint + "</span>";
            span = span + "<span class='price_NearSpotRate' style='display:none;'>" + objPrice.NearSpotRate + "</span>";

            span = span + "<span class='price_BestBankToBook' style='display:none;'>" + counterpartyName[Number(objPrice.PriceProviderId)] + "</span>";

            $("#" + USERID + "_" + objPrice.PriceProviderId).append(span);
        }




        if (count > 0 && (count % 4) == 0) {

            var currentdate = new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
            CASHFXdate.push({ ID: USERID, Date: currentdate });
             drawgraphCASHFX(CASHFXdate, chartPriceObj, TileId, USERID);
        }

        count++;
    } catch (er) {
        console.log(er.message);
        $(thisTileCashFX).find('[id^="loaderCashFX"]').hide();

    } finally {


        var finalPriceObject = "";
        var temp = "";
        var DummyArray = [];

        if (!$(thisTileCashFX).find('[id^="rbRowFXCash"]')[0].checked) {

            $(pricingRow.cells).each((index, element) => {

                if (index !== 0) {
                    if (element.innerText.trim() != "") {

                        DummyArray.push(Number(element.innerText.trim()))

                    }
                }

            });

            temp = Math.min(...DummyArray);


        } else {

            $(pricingRow.cells).each((index, element) => {

                if (index !== 0) {
                    if (element.innerText.trim() != "") {

                        DummyArray.push(Number(element.innerText.trim()))

                    }
                }

            });

            temp = Math.max(...DummyArray);

        }

        for (var y = 1; y < pricingRow.cells.length; y++) {

            finalPriceObject = pricingRow.cells[y];

            $(finalPriceObject).removeClass("bestbankPriceTD");

            $(finalPriceObject).find("span.GlowPrice_Red").removeClass("GlowPrice_Red");

            if (temp === Number(pricingRow.cells[y].innerText.trim())) {

                finalPriceObject = pricingRow.cells[y];

                $(finalPriceObject).addClass("bestbankPriceTD");
                $(finalPriceObject).find("span").addClass("GlowPrice_Red");


                //  $("#bestExternalQuoteReqID" + USERID).empty()
                // $("#bestQuoteReqID" + USERID).empty()
                //$("#bestPriceProviderId" + USERID).empty()

                $("#bestExternalQuoteReqID" + USERID).html($(finalPriceObject).find("span.price_ExternalQuoteID").text().trim()),
                    $("#bestQuoteReqID" + USERID).html($(finalPriceObject).find("span.price_QuoteID").text().trim()),
                    $("#bestPriceProviderId" + USERID).html($(finalPriceObject).find("span.price_PriceProviderID").text().trim()),
                    $("#bestNearSwapPoint" + USERID).html($(finalPriceObject).find("span.price_NearSwapPoint").text().trim()),
                    $("#bestNearSpotRate" + USERID).html($(finalPriceObject).find("span.price_NearSpotRate").text().trim()),


                    //  $("#BestBankToBook" + USERID).find("span").empty();

                    $("#BestBankToBook" + USERID).find("span").html(counterpartyName[Number($(finalPriceObject).find("span.price_PriceProviderID").text().trim())]);
                // $("#BestPrice" + USERID).empty();
                $("#BestPrice" + USERID).html("<span class=''>" + pricingRow.cells[y].innerText.trim() + "</span>");


                $(thisTileCashFX).find('[id^="rbRowFXCash"]')[0].checked ? $("#FXCASH_CustAmt_" + USERID).val((Number(pricingRow.cells[y].innerText.trim()) - (Number($(thisTileCashFX).find("[id^='FXCASH_SpreadAmt']").val().trim()) / Math.pow(10, Number($(thisTileCashFX).find("[id^='hdnpointShift']").val())))).toFixed(Number($(thisTileCashFX).find("[id^='hdnRatedecimal']").val()))) : $("#FXCASH_CustAmt_" + USERID).val((Number(pricingRow.cells[y].innerText.trim()) + (Number($(thisTileCashFX).find("[id^='FXCASH_SpreadAmt']").val().trim()) / Math.pow(10, Number($(thisTileCashFX).find("[id^='hdnpointShift']").val())))).toFixed(Number($(thisTileCashFX).find("[id^='hdnRatedecimal']").val())));


            }

        }


    }
}
//Get BidAsk Rate By Currency Pair 
function getCurrencyFXRate() {
    try {
        $.ajax({
            async: false,
            crossDomain: true,
            type: 'POST',
            url: clientConfigdata.CommonMethods.NodeServer + "GetFXRatesByCurrencyNode",
            data: JSON.stringify({
                "I_StandardPair": $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]')[0].value,
                "I_ProductCode": "FXOption",
                "I_Mode": "fxosen"
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                BidAsk = data.Get_FinIQ_BidAsk_WrapperResult;
                var BidAskVal = [];
                BidAskVal = BidAsk.split(";")
                BidRate = BidAskVal[0];
                AskRate = BidAskVal[1];
                document.getElementById("rateFXCash" + idCASHFX).innerText = BidRate + " / " + AskRate
            }
        });
    } catch (error) {
        console.log(error.message());
        $(".lblError").html(error.message())
    }
}
var pointShift = "";
var currentUserID = "";

function bindPriceData(that) {
    try {

        TileId = that.id.match(/\d+$/)[0];
        thisTileCashFX = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        USERID = "Request" + Math.floor((Math.random() * 1000) + 1).toString();
        var ccyDetails = "";
        ccyDetails = getSyncResponse({
            "CCYOption": "PAIR",
            "Currency": $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val(),
            "ProductCode": "FXC",
            "EntityID": clientConfigdata.CashFX.EntityCode,
            "Mode": "FXCAPI"
        }, clientConfigdata.CommonMethods.NodeServer + "GetCcyPairDetails")


        pointShift = ccyDetails[0]["PointShift"];

        $(thisTileCashFX).find("[id^='hdnRatedecimal']").val("").val(ccyDetails[0]["RateDecimal"]);
        $(thisTileCashFX).find("[id^='hdnpointShift']").val("").val(pointShift);

        SubScrib(WebSocketIP, $(that).parents("td.newlyCreated")[0], USERID, TileId);


        localStorage.setItem("isDataClear_" + TileId, "false");

        var reqObject;

        if ($(thisTileCashFX).find('[id^="FXO_Direction"]')[0].value.toUpperCase() == "SPOT") {
            productCode = 'FXC';
            //  tenorCode = "SPOT";
            reqObject = {
                "RequestID": USERID,
                "RequestAt": d.toShortFormat() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                "ProductCode": productCode,
                "CurrencyPair": $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val(),
                "Direction": $(thisTileCashFX).find('[id^="rbRowFXCash"]')[0].checked ? "Sell" : "Buy",
                "CCY1Amount": ($(thisTileCashFX).find('[id^="FXCASH_ContractAmt"]').val().replace(/\,/g, "")).split(".")[0],
                "CCY2Amount": 0,
                "TenorCode": $(thisTileCashFX).find('[id^="tenorFXCASH"]')[0].value,
                "TradeDate": d.toShortFormat(),
                "SpotDate": $(thisTileCashFX).find('[id^="hdnSpotDate"]').val().trim(),
                "ValueDate": $(thisTileCashFX).find('[id^="hdnValueDate"]').val().trim(),
                "PointShift": $(thisTileCashFX).find("[id^='hdnpointShift']").val().trim(),
                "RMSpread": Number($(thisTileCashFX).find("[id^='FXCASH_SpreadAmt']").val().trim()) / Math.pow(10, Number(pointShift)),
                "FixingDate": $(thisTileCashFX).find('[id^="hdnFixingDate"]').val(),
                "currentTileID": TileId,
                "PurposeCode": clientConfigdata.CashFX.PurposeCode,
                "EntityCode": clientConfigdata.CashFX.EntityCode,
                "LoginID": clientConfigdata.CashFX.LoginID,
                "SourceSystem": clientConfigdata.CashFX.SourceSystem,
                "MachineIP": clientConfigdata.CashFX.MachineIP,
                "CustomerCIF": clientConfigdata.CashFX.CustomerCIF,
                "CustomerName": clientConfigdata.CashFX.CustomerName,
                "CustomerSegment": clientConfigdata.CashFX.CustomerSegment,
                "CustomerPortfolio": clientConfigdata.CashFX.CustomerPortfolio,
                "CSAAccount": clientConfigdata.CashFX.CSAAccount,
                "RMName": clientConfigdata.CashFX.RMName,
                "CustomerId": clientConfigdata.CashFX.CustomerId,
                "DealerId": clientConfigdata.CashFX.DealerId,
                "PriceProviders":$(thisTileCashFX).find('[id^="hdnPPDetails"]').val(),
            }

        } else if ($(thisTileCashFX).find('[id^="FXO_Direction"]')[0].value.toUpperCase() == "FORWARD") {
            productCode = "FXW";
            //   tenorCode = $(thisTileCashFX).find('[id^="tenorFXCASH"]')[0].value;
            reqObject = {
                "RequestID": USERID,
                "RequestAt": d.toShortFormat() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                "ProductCode": productCode,
                "CurrencyPair": $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val(),
                "Direction": $(thisTileCashFX).find('[id^="rbRowFXCash"]')[0].checked ? "Sell" : "Buy",
                "CCY1Amount": ($(thisTileCashFX).find('[id^="FXCASH_ContractAmt"]').val().replace(/\,/g, "")).split(".")[0],
                "CCY2Amount": 0,
                "TenorCode": $(thisTileCashFX).find('[id^="tenorFXCASH"]')[0].value,
                "TradeDate": d.toShortFormat(),
                "SpotDate": $(thisTileCashFX).find('[id^="hdnSpotDate"]').val().trim(),
                "ValueDate": $(thisTileCashFX).find('[id^="hdnValueDate"]').val().trim(),
                "PointShift": $(thisTileCashFX).find("[id^='hdnpointShift']").val().trim(),
                "RMSpread": Number($(thisTileCashFX).find("[id^='FXCASH_SpreadAmt']").val().trim()) / Math.pow(10, Number(pointShift)),
                "FixingDate": $(thisTileCashFX).find('[id^="hdnFixingDate"]').val(),
                "currentTileID": TileId,
                "PurposeCode": clientConfigdata.CashFX.PurposeCode,
                "EntityCode": clientConfigdata.CashFX.EntityCode,
                "LoginID": clientConfigdata.CashFX.LoginID,
                "SourceSystem": clientConfigdata.CashFX.SourceSystem,
                "MachineIP": clientConfigdata.CashFX.MachineIP,
                "CustomerCIF": clientConfigdata.CashFX.CustomerCIF,
                "CustomerName": clientConfigdata.CashFX.CustomerName,
                "CustomerSegment": clientConfigdata.CashFX.CustomerSegment,
                "CustomerPortfolio": clientConfigdata.CashFX.CustomerPortfolio,
                "CSAAccount": clientConfigdata.CashFX.CSAAccount,
                "RMName": clientConfigdata.CashFX.RMName,
                "CustomerId": clientConfigdata.CashFX.CustomerId,
                "DealerId": clientConfigdata.CashFX.DealerId,
                "PriceProviders": $(thisTileCashFX).find('[id^="hdnPPDetails"]').val(),
            }
        }

        $(thisTileCashFX).find("[id^='hdnUSERID']").val(USERID);
        $(thisTileCashFX).find("[id^='FXCASH_CustAmt']").val("");

        var response = request_getDataFromAPI(reqObject, clientConfigdata.CommonMethods.NodeServer + "getFxCashPrice").then(data => {

            thisTileCashFX = document.getElementById("td" + data.currentTileID);
            currentUserID = data.FinIQResponseHeader.RequestID;
            if (data.FinIQResponseHeader.Status.trim().toUpperCase() === "FAILED") {
                console.log(data.PriceEnquiryResponse.ResponseDetails.Description)
                ValidateField($(thisTileCashFX).find('[id^="tenorFXCASH"]').attr('id'), data.PriceEnquiryResponse.ResponseDetails.Description);

            }
            data.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse.forEach(element => {

                counterpartyName[Number(element.PriceProviderId)] = element.PriceProviderCode;

            });

            renderPriceHTML(thisTileCashFX, $(thisTileCashFX).find("[id^='hdnUSERID']").val(), data.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse)

            PriceQuoteRef = data.PriceEnquiryResponse.PriceQuoteRef;
            $("#PriceQuoteRef" + currentUserID).val(PriceQuoteRef);

            BankSpread = data.PriceEnquiryResponse.NearLeg.BankSpread;
            CCYAmount1 = data.PriceEnquiryResponse.NearLeg.CCY1Amount;
            FinIQPriceQuoteId = data.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse[0].QuoteId;
            ExternalQuoteID = data.PriceEnquiryResponse.ExternalPriceResponse.PriceProviderResponse[0].ExternalQuoteID;




        })
            .catch(error => {
                console.log(error);
                $(thisTileCashFX).find('[id^="loaderCashFX"]').hide();
            })
    } catch (er) {
        console.log(er.message);
        $(thisTileCashFX).find('[id^="loaderCashFX"]').hide();

    }
}


// To attach prices to html objects (displaying prices in page)
function renderPriceHTML(thisTileCashFX, requestID, PriceProviderResponse) {
    try {

        var str = "";

        str = str + "<span id='bestQuoteReqID" + requestID + "' style='display:none;'></span>";
        str = str + "<span id='bestExternalQuoteReqID" + requestID + "' style='display:none;' ></span>";
        str = str + "<span id='bestPriceProviderId" + requestID + "' style='display:none;' ></span>";

        str = str + "<span id='bestNearSwapPoint" + requestID + "' style='display:none;' ></span>";
        str = str + "<span id='bestNearSpotRate" + requestID + "' style='display:none;' ></span>";


        str = str + "<table class='pricerTableCashFX' id= 'TBLCashFX" + requestID + "'>";

        str = str + "<tr class='banksNameRow' id='TRCashFXBankName" + requestID + "'>";

        str = str + " <td class='' style='' id='BestBankToBook" + requestID + "'>Best <span style='display:none;'></span></td>";

        PriceProviderResponse.forEach(element => {
            str = str + "<td id='" + requestID + "_BankName" + element.PriceProviderId + "'>" + element.PriceProviderCode + "</td>";
        });


        str = str + "</tr>";

        str = str + "<tr class='pricesRow' id='TRCashFXPRICE" + requestID + "'>";

        str = str + "<td class='' style='' id='BestPrice" + requestID + "'></td>";

        PriceProviderResponse.forEach(element => {
            str = str + "<td id='" + requestID + "_" + element.PriceProviderId + "'></td>";
        });



        str = str + "</tr></table>";
        str = str + "<input type='hidden' id='PriceQuoteRef" + requestID + "' value=''/>";

        $(thisTileCashFX).find("[id^='FXCASH_CustAmt']").attr("id", "FXCASH_CustAmt_" + requestID);

        $(thisTileCashFX).find(".Divshadow").empty().append(str);

        // Render Chart Div

        var strChartDiv = "<canvas id=" + requestID + " class='canvas-style'></canvas>"

        $(thisTileCashFX).find('[id^="back"]').find(".chartDiv").empty().append(strChartDiv);


    } catch (error) {
        console.log(error.message);

    }
}

// To subscribe user to the socket
function SubScrib(WebSocketIP, appendID, USERID, TileId) {
    try {

        const that = this;
        //   renderPriceHTML(appendID, USERID, TileId);

        var path_Name;
        var TotalChkBx;
        var Counter;
        Counter = 0;
        var secs = 0;
        var count = 0;
        ws = null;
        var rfqid;
        rfqid = Math.random();
        if (WebSocketIP === '' || WebSocketIP === undefined) {
            WebSocketIP = "finiq523";
        }

        var prem;
        if (rfqid === "") { } else {
            $(document).ready(function () {
                try {
                    if (location.protocol === "http:")
                        wsprotocol = "ws:"
                    else if (location.protocol === "https:")
                        wsprotocol = "wss:"
                    else
                        wsprotocol = "ws:"
                    try {
                        if (ws === null || ws === 'undefined') {
                            ws = new WebSocket("" + wsprotocol + "//" + WebSocketIP + "/FinIQService/WSCallback.svc");
                        } else {
                            if (ws.readyState == WebSocket.OPEN) { } else {
                                ws = new WebSocket("" + wsprotocol + "//" + WebSocketIP + "/FinIQService/WSCallback.svc");
                            }
                        }
                    } catch (error) {
                        console.log(error.message)
                    }
                    ws.onopen = function () {
                        try {
                            console.log('Port is opened...');
                            if (ws.readyState === WebSocket.OPEN) {
                                ws.send('MASTERSUBSCRIBE|' + USERID);
                            } else { //alert('Connection is closed', 'success');
                            }
                        } catch (er) {
                            console.log("onopen " + er.message);
                        }
                    };
                    ws.onmessage = function (evt) {
                        try {

                            var msg = evt.data;
                            var strRes = JSON.parse(msg);

                            if (strRes["MesssageType"].toUpperCase() === "PRICEPROVIDERRESPONSE") {

                                bindPriceData_Socket(strRes["MessageContent"], appendID, USERID, TileId);

                            } else {
                                if (ws.readyState === WebSocket.OPEN && strRes["MesssageType"].toUpperCase() === "SUBSCRIBE") { } else if (ws.readyState === WebSocket.OPEN && strRes["MesssageType"].toUpperCase() === "UNSUBSCRIBE") { }

                            }

                        } catch (er) {
                            console.log("onmessage " + er.message);
                        }
                    };
                    ws.onerror = function (evt) { //;

                    };
                    ws.onclose = function (evt) {
                        try {
                            ws.close();
                        } catch (er) {
                            console.log(er.message);
                        }
                    };
                } catch (er) {
                    console.log(er.message);
                }
            });
        }

    } catch (error) {
        console.log(error.message);
        $(thisTileCashFX).find('[id^="loaderCashFX"]').hide();
    }
}
// To book Cash FX request

function BookCashFXTrade(that) {
    try {
        TileId = that.id.match(/\d+$/)[0];

        thisTileCashFX = document.getElementById("td" + TileId);
        $(thisTileCashFX).find('[id^="loaderCashFX"]').show();


        request_getDataFromAPI({

            "CurrencyPair": $(thisTileCashFX).find('[id^="rbRowFXCash"]')[0].checked ? $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val().split("-")[1].trim() + " " + "-" + " " + $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val().split("-")[0].trim() : $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val(),
            "TenorCode": $(thisTileCashFX).find('[id^="tenorFXCASH"]')[0].value,
            "ProductCode": $(thisTileCashFX).find('[id^="FXO_Direction"]')[0].value.toUpperCase() == "SPOT" ? "FXC" : "FXW",
            "LoginID": clientConfigdata.CashFX.LoginID,
            "EntityID": clientConfigdata.CashFX.EntityCode,
            "CurrentTileID": TileId

        }, clientConfigdata.CommonMethods.NodeServer + "GetPairMidRate").then(data => {

            TileId = data.CurrentTileID;
            thisTileCashFX = document.getElementById("td" + TileId);

            productName = $($(that).parents(".sorting").find(".productName")).attr('id');
            var bookTradeObj;
            //loaderCashFX
            currentUserID = $(thisTileCashFX).find("[id^='hdnUSERID']").val();
            USERID = currentUserID;

            var ccyPair = "";
            var ccyAmount1 = "";
            var ccyAmount2 = "";
            var CustomerRate = "";
            var RMSpread = "";
            var RevenueInBaseCcy = "";
            var Revenue = "";
            var Ccy2 = $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val().split("-")[1].trim();

            if ($(thisTileCashFX).find('[id^="rbRowFXCash"]')[0].checked) {
                ccyPair = $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val().split("-")[1].trim() + " " + "-" + " " + $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val().split("-")[0].trim();

                // Sell Standard Pair
                RMSpread = (Number($(thisTileCashFX).find("[id^='FXCASH_SpreadAmt']").val().trim()) / Math.pow(10, Number($(thisTileCashFX).find("[id^='hdnpointShift']").val())));


                CustomerRate = Number($(thisTileCashFX).find("[id^='BestPrice']").find("span").html().trim()) - RMSpread;

                ccyAmount2 = ($(thisTileCashFX).find('[id^="FXCASH_ContractAmt"]').val().replace(/\,/g, "")).split(".")[0];
                ccyAmount1 = ccyAmount2 * CustomerRate;
                Revenue = Number(RMSpread * ccyAmount2);
                if (Ccy2 === clientConfigdata.CashFX.IndRevenueCurrency) {
                    RevenueInBaseCcy = Revenue;

                } else {
                    RevenueInBaseCcy = Number(Revenue / Number(data.MidRate)).toFixed(2);

                }


            } else {
                ccyPair = $(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val();

                RMSpread = (Number($(thisTileCashFX).find("[id^='FXCASH_SpreadAmt']").val().trim()) / Math.pow(10, Number($(thisTileCashFX).find("[id^='hdnpointShift']").val())));


                CustomerRate = Number($(thisTileCashFX).find("[id^='BestPrice']").find("span").html().trim()) + RMSpread;

                ccyAmount1 = ($(thisTileCashFX).find('[id^="FXCASH_ContractAmt"]').val().replace(/\,/g, "")).split(".")[0];
                ccyAmount2 = ccyAmount1 * CustomerRate;
                Revenue = Number(RMSpread * ccyAmount1);

                if (Ccy2 === clientConfigdata.CashFX.IndRevenueCurrency) {
                    RevenueInBaseCcy = Revenue;

                } else {
                    RevenueInBaseCcy = Number(Revenue / Number(data.MidRate)).toFixed(2);
                }
            }


            if ($(thisTileCashFX).find('[id^="FXO_Direction"]')[0].value.toUpperCase() == "SPOT") {
                bookTradeObj = {
                    "RequestID": USERID,
                    "RequestAt": d.toShortFormat() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                    "PriceQuoteRef": ($(thisTileCashFX).find("input[id='PriceQuoteRef" + currentUserID + "']").val()),
                    "ProductCode": $(thisTileCashFX).find('[id^="FXO_Direction"]')[0].value.toUpperCase() == "SPOT" ? "FXC" : "FXW",
                    "CurrencyPair": ccyPair,
                    "Direction": "Buy",
                    "CCY1Amount": ccyAmount1, //($(thisTileCashFX).find('[id^="FXCASH_ContractAmt"]').val().replace(/\,/g, "")).split(".")[0],
                    "CCY2Amount": ccyAmount2, //($(thisTileCashFX).find('[id^="FXCASH_ContractAmt"]').val().replace(/\,/g, "")).split(".")[0],
                    "FixingDate": $(thisTileCashFX).find('[id^="hdnFixingDate"]').val(),
                    "ValueDate": $(thisTileCashFX).find('[id^="hdnValueDate"]').val(),
                    "TenorCode": $(thisTileCashFX).find('[id^="tenorFXCASH"]')[0].value, //$(thisTileCashFX).find('[id^="FXO_Direction"]')[0].value.toUpperCase() == "SPOT" ? "SPOT" : $(thisTileCashFX).find('[id^="tenorFXCASH"]')[0].value,
                    "FinIQPriceQuoteId": Number($(thisTileCashFX).find("[id^='bestQuoteReqID" + currentUserID + "']").html()),
                    "ExternalQuoteID": ($(thisTileCashFX).find("[id^='bestExternalQuoteReqID" + currentUserID + "']").html()),
                    "PriceProviderId": Number($(thisTileCashFX).find("[id^='bestPriceProviderId" + currentUserID + "']").html()),
                    "NearSwapPoint": Number($(thisTileCashFX).find("[id^='bestNearSwapPoint" + currentUserID + "']").html()),
                    "NearSpotRate": Number($(thisTileCashFX).find("[id^='bestNearSpotRate" + currentUserID + "']").html()),

                    "TradeDate": d.toShortFormat(),
                    "SpotDate": $(thisTileCashFX).find('[id^="hdnSpotDate"]').val(),
                    "BankRate": Number($(thisTileCashFX).find("[id^='BestPrice']").find("span").html().trim()),
                    "PointShift": Number($(thisTileCashFX).find("[id^='hdnpointShift']").val()),
                    "CustomerRate": CustomerRate,
                    "RMSpread": RMSpread,
                    "Revenue": Revenue,
                    "RevenueInBaseCcy": RevenueInBaseCcy,
                    "currentTileID": TileId,
                    "PurposeCode": clientConfigdata.CashFX.PurposeCode,
                    "EntityCode": clientConfigdata.CashFX.EntityCode,
                    "LoginID": clientConfigdata.CashFX.LoginID,
                    "SourceSystem": clientConfigdata.CashFX.SourceSystem,
                    "MachineIP": clientConfigdata.CashFX.MachineIP,
                    "CustomerCIF": clientConfigdata.CashFX.CustomerCIF,
                    "CustomerName": clientConfigdata.CashFX.CustomerName,
                    "CustomerSegment": clientConfigdata.CashFX.CustomerSegment,
                    "CustomerPortfolio": clientConfigdata.CashFX.CustomerPortfolio,
                    "CSAAccount": clientConfigdata.CashFX.CSAAccount,
                    "RMName": clientConfigdata.CashFX.RMName,
                    "CustomerId": clientConfigdata.CashFX.CustomerId,
                    "DealerId": clientConfigdata.CashFX.DealerId
                }
            } else {
                bookTradeObj = {
                    "RequestID": USERID,
                    "RequestAt": d.toShortFormat() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                    "PriceQuoteRef": ($(thisTileCashFX).find("input[id='PriceQuoteRef" + currentUserID + "']").val()),
                    "ProductCode": $(thisTileCashFX).find('[id^="FXO_Direction"]')[0].value.toUpperCase() == "SPOT" ? "FXC" : "FXW",
                    "CurrencyPair": ccyPair,
                    "Direction": "Buy",
                    "CCY1Amount": ccyAmount1, //($(thisTileCashFX).find('[id^="FXCASH_ContractAmt"]').val().replace(/\,/g, "")).split(".")[0],
                    "CCY2Amount": ccyAmount2, //($(thisTileCashFX).find('[id^="FXCASH_ContractAmt"]').val().replace(/\,/g, "")).split(".")[0] ,
                    "FixingDate": $(thisTileCashFX).find('[id^="hdnFixingDate"]').val(),
                    "ValueDate": $(thisTileCashFX).find('[id^="hdnValueDate"]').val(),
                    "TenorCode": $(thisTileCashFX).find('[id^="tenorFXCASH"]')[0].value, //$(thisTileCashFX).find('[id^="FXO_Direction"]')[0].value.toUpperCase() == "SPOT" ? "SPOT" : $(thisTileCashFX).find('[id^="tenorFXCASH"]')[0].value,
                    "FinIQPriceQuoteId": Number($(thisTileCashFX).find("[id^='bestQuoteReqID" + currentUserID + "']").html()),
                    "ExternalQuoteID": ($(thisTileCashFX).find("[id^='bestExternalQuoteReqID" + currentUserID + "']").html()),
                    "PriceProviderId": Number($(thisTileCashFX).find("[id^='bestPriceProviderId" + currentUserID + "']").html()),
                    "NearSwapPoint": Number($(thisTileCashFX).find("[id^='bestNearSwapPoint" + currentUserID + "']").html()),
                    "NearSpotRate": Number($(thisTileCashFX).find("[id^='bestNearSpotRate" + currentUserID + "']").html()),

                    "TradeDate": d.toShortFormat(),
                    "SpotDate": $(thisTileCashFX).find('[id^="hdnSpotDate"]').val(),
                    "BankRate": Number($(thisTileCashFX).find("[id^='BestPrice']").find("span").html().trim()),
                    "PointShift": Number($(thisTileCashFX).find("[id^='hdnpointShift']").val()),
                    "CustomerRate": CustomerRate,
                    "RMSpread": RMSpread,
                    "Revenue": Revenue,
                    "RevenueInBaseCcy": RevenueInBaseCcy,
                    "currentTileID": TileId,
                    "PurposeCode": clientConfigdata.CashFX.PurposeCode,
                    "EntityCode": clientConfigdata.CashFX.EntityCode,
                    "LoginID": clientConfigdata.CashFX.LoginID,
                    "SourceSystem": clientConfigdata.CashFX.SourceSystem,
                    "MachineIP": clientConfigdata.CashFX.MachineIP,
                    "CustomerCIF": clientConfigdata.CashFX.CustomerCIF,
                    "CustomerName": clientConfigdata.CashFX.CustomerName,
                    "CustomerSegment": clientConfigdata.CashFX.CustomerSegment,
                    "CustomerPortfolio": clientConfigdata.CashFX.CustomerPortfolio,
                    "CSAAccount": clientConfigdata.CashFX.CSAAccount,
                    "RMName": clientConfigdata.CashFX.RMName,
                    "CustomerId": clientConfigdata.CashFX.CustomerId,
                    "DealerId": clientConfigdata.CashFX.DealerId
                }
            }

            localStorage.setItem("isDataClear_" + TileId, "true");
            //  
            var responseBookTrade = request_getDataFromAPI(bookTradeObj, clientConfigdata.CommonMethods.NodeServer + "FxCashBookOrder").then(data => {

                thisTileCashFX = document.getElementById("td" + data.currentTileID);
                TileId = data.currentTileID;

                if (data.TradeBookingResponse.TradeReferenceID != null && data.TradeBookingResponse.TradeReferenceID != undefined && data.TradeBookingResponse.TradeReferenceID != "") {
                    $(thisTileCashFX).find('[id^="hdnBlotterURLCashFX"]').val(clientConfigdata.CommonMethods.getBlotterURLCashFX);
                    $(thisTileCashFX).find('[id^="OrderBlotter"]').css({ display: "inline" });
                    // $("#OrderPlaced").html("Cash FX : Order Placed Successfully with Counterparty " + $(thisTileCashFX).find("[id^='BestBankToBook']").find("span").text().trim() + " and Order ID " + data.TradeBookingResponse.TradeReferenceID);
                    booktradePopup(that, "booktradeCashfx" + TileId, "Cash FX : Order Placed Successfully with Counterparty " + $(thisTileCashFX).find("[id^='BestBankToBook']").find("span").text().trim() + " and Order ID " + data.TradeBookingResponse.TradeReferenceID, "DivOverlayCashfx");
                } else {
                    booktradePopup(that, "booktradeCashfx" + TileId, "Cash FX :: Please Reprice First, Order Execution Failed! " + data.TradeBookingResponse.ResponseDetails.Description, "DivOverlayCashfx");
                    // $("#OrderPlaced").html("Cash FX :: Please Reprice First, Order Execution Failed! " + data.TradeBookingResponse.ResponseDetails.Description);
                }
                // $("#hdnBlotterURL").val(getBlotterURLCashFX);
                // $('#OrderBlotter').css({ display: "inline" });
                //$("#booktradecashx").dialog("open");
                // $("#booktradecashx").show();
                // $('#DivOverlay').show();

                $(thisTileCashFX).find('[id^="loaderCashFX"]').hide();
                /*
                            if (ws != undefined && ws != null) {
                                ws.close();
                            }
                            ws.onclose = function () {
                                console.log("socket closed..!");
                            }
                */

            })

                .catch(error => {
                    console.log(error);
                })

        })



    } catch (er) {
        console.log(er.message);
        booktradePopup(that, "booktradeCashfx" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlayCashfx");
        // $("#OrderPlaced").html("Please Best Price Before Book Trade, Order Execution Failed!");
        // $("#booktradecashx").dialog("open");
        // $("#booktradecashx").show();
        // $('#DivOverlay').show();
        $(thisTileCashFX).find('[id^="loaderCashFX"]').hide();
    } finally {

    }

}

// To display Cash FX Blotter
function displayCASHFXBlotter(TileId) {
    try {
        thisTileCashFX = document.getElementById("td" + TileId);
        var shortDatev = today.toShortFormat();
        request_getDataFromAPI({ "sToDate": shortDatev }, clientConfigdata.CommonMethods.NodeServer + "displayCASHFXBlotter").then(data => {
            var strjson = xml2json.fromStr(data.getDataFromUSPCustomFilterResult, 'string');
            var str = JSON.parse(strjson);
            $(thisTileCashFX).find('[id^="CASHFXOrderDetails"]' + " table tr:not(:first-child)").empty();
            for (var i = 0; i < 10; i++) {
                var shortDate = new Date(str.Dummy.DUMMY[i].Trade_Date["#text"]);

                var markup = "<tr> <td>" + str.Dummy.DUMMY[i].Deal_No["#text"] + "</td> <td>" + shortDate.toShortFormat() + "</td> <td>" + str.Dummy.DUMMY[i].Counterparty["#text"] + "</td> <td>" + str.Dummy.DUMMY[i].Deal_Rate["#text"] + "</td> </tr>";
                $(thisTileCashFX).find('[id^="CASHFXOrderDetails"]' + " tbody").append(markup);
            }

        }).catch(error => {

            console.log(error.message);
            $("#OrderPlaced").html("Please Best Price Before Book Trade, Order Execution Failed!");
            $("#booktradecashx").dialog("open");
            $("#booktradecashx").show();

        });


        /*$.ajax({
            url: "http://finiqmbappnsk2683.cloudapp.net/CADBServer/displayCASHFXBlotter",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            autoFill: true,
            type: 'POST',
            async: false,
            crossDomain: true,
            data: JSON.stringify({ "sToDate": shortDatev }),
            success: function(data) {
                var strjson = xml2json.fromStr(data.getDataFromUSPCustomFilterResult, 'string');
                var str = JSON.parse(strjson);
                $(thisTileCashFX).find('[id^="CASHFXOrderDetails"]' + " table tr:not(:first-child)").empty();
                for (var i = 0; i < 10; i++) {
                    var shortDate = new Date(str.Dummy.DUMMY[i].Trade_Date["#text"]);
 
                    var markup = "<tr> <td>" + str.Dummy.DUMMY[i].Deal_No["#text"] + "</td> <td>" + shortDate.toShortFormat() + "</td> <td>" + str.Dummy.DUMMY[i].Counterparty["#text"] + "</td> <td>" + str.Dummy.DUMMY[i].Deal_Rate["#text"] + "</td> </tr>";
                    $(thisTileCashFX).find('[id^="CASHFXOrderDetails"]' + " tbody").append(markup);
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }
        });*/

    } catch (error) {
        console.log(error.message);
        $("#OrderPlaced").html("Please Best Price Before Book Trade, Order Execution Failed!");
        $("#booktradecashx").dialog("open");
        $("#booktradecashx").show();
    } finally {

    }
}

// Added to map LP list as per ccy pair / 28 Oct 2021
function getPPDetails(that) {
    try {

        TileId = that.id.match(/\d+$/)[0];
        thisTileCashFX = document.getElementById("td" + TileId);

        let productCode;

        if ($(thisTileCashFX).find('[id^="FXO_Direction"]')[0].value.toUpperCase() == "SPOT") {

            productCode = "FXC";
           
        } else {

            productCode = "FXW";
            
        }
       
        request_getDataFromAPI(
            { 
                
            "ProductCode":productCode,
            "EntityId":clientConfigdata.CashFX.EntityCode,
            "ConsideredForBestPriceOnly":true,
            "PairCode":$(thisTileCashFX).find('[id^="FXCASH_CCYPairDemo"]').val()

            }, clientConfigdata.CommonMethods.NodeServer + "GetPPDetailsCashFX").then(data => {

                TileId = that.id.match(/\d+$/)[0];
                thisTileCashFX = document.getElementById("td" + TileId);
                let getRepsonse = data
                let LPArrayCashFX = [];
                let l = getRepsonse.length;
                for (i = 0; i < l; i++) {
                    LPCashFX = getRepsonse[i].Code;
                    LPArrayCashFX.push(LPCashFX);
                }


                let LPListFXCashFX = LPArrayCashFX.toString().replace(/,/g, ",");

                $(thisTileCashFX).find('[id^="hdnPPDetails"]').val("");

                $(thisTileCashFX).find('[id^="hdnPPDetails"]').val(LPListFXCashFX);
                

        }).catch(error => {

            console.log(error.message);
          
        });



    } catch (error) {
        console.log(error.message);
        $("#OrderPlaced").html("Please Best Price Before Book Trade, Order Execution Failed!");
        $("#booktradecashx").dialog("open");
        $("#booktradecashx").show();
    } finally {

    }
}
