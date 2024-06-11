$.support.cors = true;
var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var contractAmt;
var CouponFreq;
var tempShareName;
var arrSPS = [];
var maxSPS;
var finalResponseDataSPS;
var finalTokenSPS;
var repriceObjectSPS;
var TimerSPS = 0;
var finalObjSPS;
var getddlList;
var tenorListSPS = ["1M", "3M", "6M", "9M", "12M"];
var idSPS = 30;
var dateObj = "";
var currentDate = new Date().toShortFormat();
var uniqueRequestID = "CadB_" + Math.random().toFixed(2) * 100;

// To load the SPS tile
function onLoadSPS(currId, isProductCopiedSPS) {
  try {
    // Added logic for getting current tile : Onkar E.//
    setDeafaultValuesSPS(currId, isProductCopiedSPS);
    thisTileSPS = document.getElementById("td" + currId);

    hideTileLoader(thisTileSPS, "loader_SPS");

    //loadSPSShares(thisTileSPS, currId);

    fillDropdownlistControl(
      tenorListSPS,
      $(thisTileSPS).find('[id^="tenor_SPS"]').attr("id")
    );
    document.querySelector(
      "#" + $(thisTileSPS).find('[id^="tenor_SPS"]').attr("id")
    ).selectedIndex = 3;

    $(thisTileSPS)
      .find("div.card input[type='text'],div.card input[type='search'],div.card select")
      .on("change", function () {
        thisTileSPS = $(this).parents(".sorting")[0];
        clearInterval($(thisTileSPS).find('[id^="hdnintervalID"]').val());
        clearPricerTable(thisTileSPS);
      });

    $(thisTileSPS)
      .find("div.card input[type='text'],div.card input[type='search'],div.card select,div.card .ddlShares")
      .on("select", function () {
        thisTileSPS = $(this).parents(".sorting")[0];
        clearInterval($(thisTileSPS).find('[id^="hdnintervalID"]').val());
        clearPricerTable(thisTileSPS);
      });

    $(thisTileSPS)
      .find('[id^="ddlKOKIType"]')
      .on("change", function () {
        try {
          thisTileSPS = $(this).parents(".sorting")[0];
          validation_clear(); //To Remove highlighted part if no error
          // checkKOKITypeSPS($(thisTileSPS).find('[id^="ddlKOKIType"]').val().trim(), thisTileSPS);
        } catch (error) {
          console.log(error.message);
        }
      });
    checkSolveForSPS(
      $(thisTileSPS).find('[id^="ddlSolveForSPS"]').val(),
      thisTileSPS
    );
    $(thisTileSPS)
      .find('[id^="ddlSolveForSPS"]')
      .on("change", function (event) {
        thisTileSPS = $(this).parents(".sorting")[0];
        checkSolveForSPS($(this).val(), thisTileSPS);
      });

    shareCount = 0;
    $(thisTileSPS)
      .find('[id^="shareDivSPS"]')
      .click(function () {
        $(this).find('input[type="search"]').focus();
      });

    $("div.card input,div.card select").change(function () {
      // console.log('change event called RESET')
      thisTileSPS = $(this).parents(".sorting")[0];
      clearInterval($(thisTileSPS).find('[id^="hdnintervalID"]').val());
      clearPricerTable(thisTileSPS);
      hideTileLoader(thisTileSPS, "loader_SPS");
      return false;
    });
    callDropDownFunction(
      $(thisTileSPS).find('[id^="shareName"]'),
      "SPS",
      currId
    );
  } catch (error) {
    console.log(error.message);
  }
}
// To set default values for SPS
function setDeafaultValuesSPS(currId, isProductCopiedSPS) {
  try {
    // Added logic for getting current tile : Onkar E.//
    thisTileSPS = document.getElementById("td" + currId);

    $(thisTileSPS).find('[id^="ContractAmt"]').val("1,000,000.00");
    $(thisTileSPS).find('[id^="couponipbox"]').val("8.00");
    $(thisTileSPS).find('[id^="upfrontipbox"]').val("1.50");
    $(thisTileSPS).find('[id^="couponinputbox"]').val("1.50");
    $(thisTileSPS).find('[id^="strikeinbox"]').val("100.00");
    $(thisTileSPS).find('[id^="NoOfShareipboxSPS"]').val("2,000");

    fillDropdownlistControl(
      tenorListSPS,
      $(thisTileSPS).find('[id^="tenor_SPS"]').attr("id")
    );
    document.querySelector(
      "#" + $(thisTileSPS).find('[id^="tenor_SPS"]').attr("id")
    ).selectedIndex = 3;
    EQProductsFillCcy(thisTileSPS, "ddlSPSCcy");

    clearPricerTable(thisTileSPS);
    $(thisTileSPS).find('[id^="shareNameCntrlSPS"]').html("");
    $(thisTileSPS).find('[id^="hiddenshareinputSPS"]').html("");
    $(thisTileSPS).find('[id^="CCY_SPS"]').html("");
    //inputsharebasket(currId, "SPS", ($(thisTileSPS).find('[id^="shareName"]')));
    // createElementInBasket(thisTileSPS, 'shareDivSPS', sessionStorage.getItem(thisTileSPS.id) != undefined ? sessionStorage.getItem(thisTileSPS.id).split(" ")[0] : 'AAPL.OQ');
    // createElementInBasket(thisTileSPS, 'shareDivSPS', sessionStorage.getItem(thisTileSPS.id) != undefined ? sessionStorage.getItem(thisTileSPS.id).split(" ")[1] : 'GOOG.OQ');
    // createElementInBasket(thisTileSPS, 'shareDivSPS', sessionStorage.getItem(thisTileSPS.id) != undefined ? sessionStorage.getItem(thisTileSPS.id).split(" ")[2] : 'FB.OQ');

    if (!isProductCopiedSPS) {
      for (
        let s = 0;
        s < clientConfigdata.EQCCommonMethods.MinSharesInBaskets;
        s++
      ) {
        createElementInBasket(
          thisTileSPS,
          "shareDivSPS",
          sessionStorage.getItem(thisTileSPS.id) != undefined
            ? sessionStorage.getItem(thisTileSPS.id).split(" ")[s]
            : globalDefaultSharesArray[s]
        );
      }
    }

    $(thisTileSPS).find('[id^="shareName"]')[0].placeholder = "";
    $(thisTileSPS)
      .find('[id^="CCY_SPS"]')
      .html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);
  } catch (error) {
    console.log(error.message);
  }
}
function checkSolveForSPS(solveFor, thisTileSPS) {
  try {
    if (solveFor.trim() == "COST") {
      $(thisTileSPS)
        .find('[id^="upfrontipbox"]')
        .val("1.50")
        .prop("disabled", false);
      $(thisTileSPS)
        .find('[id^="koinputbox"]')
        .val("101.54")
        .prop("disabled", false);
      $(thisTileSPS)
        .find('[id^="FundingRateinputbox"]')
        .val("310")
        .prop("disabled", false);
      $(thisTileSPS)
        .find('[id^="couponinputbox"]')
        .val("")
        .prop("disabled", true);
    }
  } catch (error) {}
}

// To get best price for SPS
function getBestPriceSPS(that) {
  try {
    // Added logic for getting current tile : Onkar E.//

    //    var uniqueIntervalID;
    thisTileSPS = $(that).parents(".sorting")[0];
    // console.log('Start Interval value =' + $(thisTileSPS).find('[id^="hdnintervalID"]').val());

    clearInterval($(thisTileSPS).find('[id^="hdnintervalID"]').val());
    // console.log('After clear Interval value =' + $(thisTileSPS).find('[id^="hdnintervalID"]').val());

    $(thisTileSPS).find('[id^="hdnintervalID"]').val("");

    TileId = that.id.match(/\d+$/)[0];

    sessionStorage.setItem("poolingTimer_" + TileId, 0);
    sessionStorage.setItem("pricingToggle" + TileId, false);
    thisTileSPS = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    console.log(TileId, thisTileSPS, productName);
    getddlList = $.trim($(thisTileSPS).find('[id^="ddlKOKIType"]').val());

    $(thisTileSPS)
      .find('[id^="TBLSPS"]' + " td")
      .each(function () {
        $(this).html("-");
      });
    validation_clear();
    clearPricerTable(thisTileSPS);

    if ($(thisTileSPS).find('[id^="shareDivSPS"]')[0].childNodes.length == 3) {
      ValidateField(
        $(thisTileSPS).find('[id^="shareDivSPS"]').attr("id"),
        "Please Enter Valid Shares",
        thisTileSPS
      );
      return false;
    } else if (
      $.trim($(thisTileSPS).find('[id^="NoOfShareipboxSPS"]').val()) == "" ||
      $.trim($(thisTileSPS).find('[id^="NoOfShareipboxSPS"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileSPS).find('[id^="NoOfShareipboxSPS"]').attr("id"),
        "Please Enter Valid No.Of Shares",
        thisTileSPS
      );
      return false;
    } else if ($.trim($(thisTileSPS).find('[id^="tenor_SPS"]').val()) == "") {
      ValidateField(
        $(thisTileSPS).find('[id^="tenor_SPS"]').attr("id"),
        "Please Enter Valid tenor",
        thisTileSPS
      );
      return false;
    } else if (
      $.trim($(thisTileSPS).find('[id^="upfrontipbox"]').val()) == "" ||
      $.trim($(thisTileSPS).find('[id^="upfrontipbox"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileSPS).find('[id^="upfrontipbox"]').attr("id"),
        "Please Enter Valid Upfront(%)",
        thisTileSPS
      );
      return false;
    } else if (
      $.trim($(thisTileSPS).find('[id^="strikeinbox"]').val()) == "" ||
      $.trim($(thisTileSPS).find('[id^="strikeinbox"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileSPS).find('[id^="strikeinbox"]').attr("id"),
        "Please Enter Valid Strike(%)",
        thisTileSPS
      );
      return false;
    }

    setTimeout("$(thisTileSPS).find('[id^=\"loader_SPS\"]').show();", 200);

    //$(thisTileSPS).find('[id^="BookTradeSPS"]').attr("disabled", true); // Disabling book trade button while pricing is happening - by Onkar E. 25/11/2019
    $("body").css("opacity", "0.9");

    let exchangeList = getExchangeAndCcyFromBasket(
      $(thisTileSPS).find('[id^="shareDivSPS"]')[0],
      "exchange",
      undefined
    );
    let ccyList = getExchangeAndCcyFromBasket(
      $(thisTileSPS).find('[id^="shareDivSPS"]')[0],
      "ccy",
      undefined
    );
    let shareList = getExchangeAndCcyFromBasket(
      $(thisTileSPS).find('[id^="shareDivSPS"]')[0],
      "share",
      undefined
    );

    SPSQuoteObject = {
      CouponPercentage: $(thisTileSPS).find('[id^="couponinputbox"]').val(),
      OfferPrice: "",
      RM_Margin: 0,
      StrikePercentage: $(thisTileSPS).find('[id^="strikeinbox"]').val(),
      CashCurrency: $(thisTileSPS).find('[id^="ddlSPSCcy"]').val(),
      CashOrderQuantity: Number(
        removeCommaAndDecimal(
          $(thisTileSPS)
            .find('[id^="NoOfShareipboxSPS"]')
            .val()
            .replace(/\,/g, "")
            .split(".")[0]
        )
      ),
      LoginID: "PratikM",
      EntityName: "CFS SG",
      Entity_ID: 30,
      exchange1: exchangeList[0],
      exchange2: exchangeList[1],
      exchange3: exchangeList[2],
      exchange4: exchangeList[3],
      ExpiryDate: "05-Nov-2021",
      Issuer_Date_Offset: "14",
      MaturityDate: "12-Nov-2021",
      PledgedUnderlying: shareList[0],
      Ppdetails: "14", //Asked by Chitralekha, 05-Jul-22
      RFQ_RMName: "",
      SettlementDate: "05-May-2021",
      SolveFor: "COST",
      Tenor: parseFloat($(thisTileSPS).find('[id^="tenor_SPS"]').val()),
      TenorType: "MONTH",
      TradeDate: "21-Apr-2021",
      Type: "EQLAGGARD",
      underlyingCode1: shareList[0],
      underlyingCode2: shareList[1],
      underlyingCode3: shareList[2],
      underlyingCode4: shareList[3],
      Upfront: $(thisTileSPS).find('[id^="upfrontipbox"]').val(),
      CurrentTileID: TileId,
    };

    console.log("SPS quote ", SPSQuoteObject);

    getQuoteSPS(
      SPSQuoteObject,
      $(thisTileSPS).find('[id^="hdnintervalID"]')[0]
    );
    //  })
  } catch (er) {
    console.log(er.message);
  }
}
var priceProviderArray_SPS = [];

// To get quote
function getQuoteSPS(SPSQuoteObject, uniqueIntervalID) {
  try {
    var dataSPS = request_getDataFromAPI(
      SPSQuoteObject,
      clientConfigdata.CommonMethods.NodeServer + "getBestPriceSPS"
    )
      .then((dataSPS) => {
        console.log("quote response ", dataSPS);
        if (dataSPS.body == "") {
          clearInterval($(thisTileSPS).find('[id^="hdnintervalID"]').val());
          hideTileLoader(thisTileSPS, "loader_SPS");

          return false;
        }
        priceProviderArray_SPS = [];

        for (var x of dataSPS.body.split(",")) {
          priceProviderArray_SPS.push({ rfqID: x });
        }

        thisTileSPS = document.getElementById("td" + dataSPS.CurrentTileID);
        sessionStorage.setItem("pricingToggle" + dataSPS.CurrentTileID, true);

        getUniqQuoteResponseSPS(
          priceProviderArray_SPS,
          thisTileSPS,
          dataSPS,
          uniqueIntervalID
        );
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err.message);
  }
}

function getUniqQuoteResponseSPS(
  priceProviderArray_SPS,
  thisTileSPS,
  dataSPS,
  uniqueIntervalID
) {
  try {
    var UIID = null;

    uniqueIntervalID.value = setInterval(function () {
      console.log("priceProviderArray_SPS", priceProviderArray_SPS);
      getFinalQuoteResponseSPS(
        priceProviderArray_SPS,
        "",
        "",
        thisTileSPS,
        uniqueIntervalID
      );
    }, clientConfigdata.EQCSPS.PollInterval);
  } catch (error) {
    console.log(error);
  }
}

// To get price

function getFinalQuoteResponseSPS(
  priceProviderArray_SPS,
  finalTokenSPS1,
  finalResponseDataSPS1,
  thisTileSPS,
  uniqueIntervalID
) {
  try {
    var currentDateAndTime = new Date();

    console.log(
      "SPS RFQ's :: " + finalResponseDataSPS1 + " " + currentDateAndTime
    );
    Timer = Timer + 1;

    if (
      Number(
        sessionStorage.getItem(
          "poolingTimer_" + thisTileSPS.id.match(/\d+$/)[0]
        )
      ) >= clientConfigdata.EQCSPS.PoolTimer ||
      sessionStorage.getItem(
        "pricingToggle" + thisTileSPS.id.match(/\d+$/)[0]
      ) == "false"
    ) {
      $(thisTileSPS).find('[id^="BookTradeSPS"]').attr("disabled", false); // Enabling book trade button when pricing is over - by Onkar E. 25/11/2019
      clearInterval(uniqueIntervalID.value);
      uniqueIntervalID.value = "";
      QuoteObject = "";
      hideTileLoader(thisTileSPS, "loader_SPS");
      $(thisTileSPS)
        .find('[id^="hdnChartPricesSPS"]')
        .val(JSON.stringify(finalObjSPS));
      $("body").css("opacity", "");
      arrSPS = [];
      maxSPS = "";
      TimerSPS = 0;
      //Call Draw Graph
      if (finalObjSPS != null || finalObjSPS != undefined) {
        // drawgraphSPS($(thisTileSPS).find('[id^="canvas"]').attr('id'));
      }

      return false;
    } else {
      var repriceObjectSPS = request_getDataFromAPI(
        {
          userID: "PratikM",
          rfqDetails: priceProviderArray_SPS,
          CurrentTileID: $(thisTileSPS).attr("id").match(/\d+$/)[0],
        },
        clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseSI"
      )
        .then((repriceObjectSPS) => {
          console.log("SPS quote response ", repriceObjectSPS);

          thisTileSPS = document.getElementById(
            "td" + repriceObjectSPS.CurrentTileID
          );
          sessionStorage.setItem(
            "poolingTimer_" + repriceObjectSPS.CurrentTileID,
            Number(
              sessionStorage.getItem(
                "poolingTimer_" + thisTileSPS.id.match(/\d+$/)[0]
              )
            ) + 1
          );
          finalObjSPS = repriceObjectSPS.quoteresponses;
          console.log("snow ball price object before sort", finalObjSPS);
          // added by AniruddhaJ for upfront calculatation START
          if (
            $(thisTileSPS).find('[id^="ddlSolveForSPS"]').val().trim() ===
            "UPFRONT"
          ) {
            for (let priceSPS of finalObjSPS) {
              priceSPS.response = (Number(priceSPS.response) / 100)
                .toFixed(2)
                .toString();
            }
          }
          //End
          // // Sorted By Best Price LP'S

          finalObjSPS.sort(function (a, b) {
            if (
              a.response === null ||
              a.response == "" ||
              a.response == "Timeout" ||
              a.response.toUpperCase().trim() == "REJECTED" ||
              a.response.toUpperCase().trim() == "UNSUPPORTED" ||
              a.response === "NaN" ||
              parseFloat(a.response) == 0
            ) {
              return 1;
            } else if (
              b.response === null ||
              b.response == "" ||
              b.response == "Timeout" ||
              b.response.toUpperCase().trim() == "REJECTED" ||
              b.response.toUpperCase().trim() == "UNSUPPORTED" ||
              b.response === "NaN" ||
              parseFloat(b.response) == 0
            ) {
              return -1;
            } else if (a.response === b.response) {
              return 0;
            }

            if (
              $(thisTileSPS).find('[id^="ddlSolveForSPS"]').val() == "COUPON" ||
              $(thisTileSPS).find('[id^="ddlSolveForSPS"]').val() ==
                "KO_COUPON" ||
              $(thisTileSPS).find('[id^="ddlSolveForSPS"]').val() == "UPFRONT"
            ) {
              return Number(a.response) > Number(b.response) ? -1 : 1;
            } else {
              return Number(a.response) < Number(b.response) ? -1 : 1;
            }
          });
          maxSPS = finalObjSPS[0].response;
          $(thisTileSPS)
            .find('[id^="hdnChartPricesSPS"]')
            .val(JSON.stringify(finalObjSPS));
          console.log("snow ball price object after sort", finalObjSPS);

          //   $(thisTileSPS).find('[id^="hdnfinalTokenSPS"]').val(sessionStorage.getItem("quoteToken_" + thisTileSPS.id.match(/\d+$/)[0]));

          if (
            sessionStorage.getItem(
              "pricingToggle" + thisTileSPS.id.match(/\d+$/)[0]
            ) == "true"
          ) {
            $(thisTileSPS).find('[id^="SPSBanksRow"]').empty();
            $(thisTileSPS).find('[id^="SPSPrices"]').empty();
            $(finalObjSPS).each(function (i, elem) {
              // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
              var priceClass = "GlowPrice_Red";
              if (!glowFlag) {
                priceClass = "noGlow";
              }
              var str = "";
              var str2 = "";
              if (elem.ppCode != null) {
                if (elem.ppCode == "CITI") {
                  str = str + "<td>" + "Citi" + "</td>";
                } else {
                  str = str + "<td>" + elem.ppCode + "</td>";
                }
                $(thisTileSPS).find('[id^="SPSBanksRow"]').append(str);
              } else {
                str = str + "<td>--</td>";
                $(thisTileSPS).find('[id^="SPSBanksRow"]').append(str);
              }
              if (
                elem.response != null &&
                elem.response.trim() !== "NaN" &&
                elem.response.trim().toUpperCase() != "REJECTED" &&
                elem.response != "" &&
                parseFloat(elem.response) != 0
              ) {
                if (maxSPS == elem.response) {
                  str2 =
                    str2 +
                    "<td class='" +
                    priceClass +
                    "'>" +
                    parseFloat(elem.response).toFixed(2) +
                    "</td>";
                  $(thisTileSPS).find('[id^="SPSPrices"]').append(str2);
                } else {
                  str2 =
                    str2 +
                    "<td class=''>" +
                    parseFloat(elem.response).toFixed(2) +
                    "</td>";
                  $(thisTileSPS).find('[id^="SPSPrices"]').append(str2);
                }
              } else {
                str2 = str2 + "<td>-</td>";
                $(thisTileSPS).find('[id^="SPSPrices"]').append(str2);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          hideTileLoader(thisTileSPS, "loader_SPS");
          $(thisTileSPS)
            .find('[id^="hdnChartPricesSPS"]')
            .val(JSON.stringify(finalObjSPS));
          if (finalObjSPS != null || finalObjSPS != undefined) {
            //     drawgraphSPS($(thisTileSPS).find('[id^="canvas"]').attr('id'));
          }
        });
    }
  } catch (error) {
    console.log("getFinalQuoteResponseSPS : " + error.message);
    $(thisTileSPS)
      .find('[id^="hdnChartPricesSPS"]')
      .val(JSON.stringify(finalObjSPS));
    window.clearInterval(uniqueIntervalID.value);
    uniqueIntervalID.value = "";
    hideTileLoader(thisTileSPS, "loader_SPS");
    $(thisTileSPS).find('[id^="BookTradeSPS"]').attr("disabled", false);
    if (finalObjSPS != null || finalObjSPS != undefined) {
      //  drawgraphSPS($(thisTileSPS).find('[id^="canvas"]').attr('id'));
    }
    //  sessionStorage.setItem("quoteToken_" + thisTileSPS.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileSPS.id.match(/\d+$/)[0]));

    //  sessionStorage.setItem("quoteResponse_" + thisTileSPS.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileSPS.id.match(/\d+$/)[0]));
  } finally {
    $(thisTileSPS).find('[id^="BookTradeSPS"]').attr("disabled", false);
  }
}

// To book trade
function booktradeSPS(that) {
  try {
    // Added logic for getting current tile : Onkar E.//
    TileId = that.id.match(/\d+$/)[0];
    thisTileSPS = document.getElementById("td" + TileId);
    sessionStorage.setItem("pricingToggle" + TileId, false);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    showTileLoader(thisTileSPS, "loader_SPS");

    if (
      $(thisTileSPS).find('[id^="SPSPrices"]')[0].firstChild.innerHTML == "-" ||
      $(thisTileSPS).find('[id^="SPSPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        that,
        "booktradeSPS" + TileId,
        "Please Best Price Before Book Trade, Order Execution Failed!",
        "DivOverlaySPS"
      );
      hideTileLoader(thisTileSPS, "loader_SPS");

      return false;
    }

    // Check For Negative prices // CFINT-927 // 10-Sep-2020

    if (
      parseFloat(
        JSON.parse($(thisTileSPS).find('[id^="hdnChartPricesSPS"]').val())[0]
          .response
      ) <= 0
    ) {
      booktradePopup(
        that,
        "booktradeSPS" + TileId,
        "Prices can not be negative 0r zero, Order Execution Failed!",
        "DivOverlaySPS"
      );
      hideTileLoader(thisTileSPS, "loader_SPS");
      return false;
    }

    var Obj = JSON.parse(
      $(thisTileSPS).find('[id^="hdnChartPricesSPS"]').val()
    );
    var SPS_quoteid = Obj[0].quoteRequestId;

    let clientPriceSPS = Obj[0].response;
    var UpfrontbyIBpriceSPS = 100 - clientPriceSPS;

    // console.log('tranche created ', dataTranche);
    // thisTileSPS = document.getElementById("td" + dataTranche.CurrentTileID);

    Obj = JSON.parse($(thisTileSPS).find('[id^="hdnChartPricesSPS"]').val());

    SPS_quoteid = Obj[0].quoteRequestId;

    clientPriceSPS = Obj[0].response;

    let orderObjectSPS = {
      orderQuantity: removeCommaAndDecimal(
        $(thisTileSPS).find('[id^="NoOfShareipboxSPS"]').val()
      ),
      orderType: "",
      limitPrice1: "",
      limitPrice2: "",
      limitPrice3: "",
      limitPrice4: "",
      quoteRequestId: SPS_quoteid,
      orderComment: "Order Placed from CadB ",
      loginUser: "PratikM",
      margin: "",
      clientPrice: clientPriceSPS,
      clientYield: "",
      bookingBranch: "",
      RMNameforOrderConfirm: "",
      RMEmailIdforOrderConfirm: "",
      confirmReason: "",
      advisoryReason: "",
      prefImprov: "",
      entityCode: "CFSSG",
      customerID: "100208",
      CurrentTileID: TileId,
    };
    console.log("SPS Order object ", orderObjectSPS);

    request_getDataFromAPI(
      orderObjectSPS,
      clientConfigdata.CommonMethods.NodeServer + "SPSBookOrder"
    )
      .then((bookObject) => {
        console.log("SPSBookOrder ", bookObject);

        thisTileSPS = document.getElementById("td" + bookObject.CurrentTileID);
        TileId = bookObject.CurrentTileID;

        var bookstring = bookObject.orderPlaceSPSResult.orderID;

        if (bookstring != "" && bookstring != null && bookstring != undefined) {
          var orderplaced =
            "SPS :: Order Placed Successfully with Order ID: " +
            bookObject.orderPlaceSPSResult.orderID;
          booktradePopup(
            that,
            "booktradeSPS" + TileId,
            orderplaced,
            "DivOverlaySPS"
          );
          hideTileLoader(thisTileSPS, "loader_SPS");
          // $(thisTileSPS).find('[id^="hdnfinalTokenSPS"]').val("");
        } else {
          booktradePopup(
            that,
            "booktradeSPS" + TileId,
            bookObject.orderPlaceSPSResult.remark,
            "DivOverlaySPS"
          );
          hideTileLoader(thisTileSPS, "loader_SPS");
        }

        clearInterval($(thisTileSPS).find('[id^="hdnintervalID"]').val());
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (er) {
    console.log(er);
    booktradePopup(
      that,
      "booktradeSPS" + TileId,
      "Please Best Price Before Book Trade, Order Execution Failed!",
      "DivOverlaySPS"
    );
    hideTileLoader(thisTileSPS, "loader_SPS");
  } finally {
  }
}

// function emailQuoteSPS(that) {
//     try {

//         thisTileSPS= $(that).parents(".sorting")[0];
//         if ($(thisTileSPS).find('[id^="hdnChartPricesSPS"]').val() != undefined)
//             var RFQID = JSON.parse($(thisTileSPS).find('[id^="hdnChartPricesSPS"]').val())[0].EP_ER_QuoteRequestId;

//         if (RFQID != undefined && RFQID != '') {
//             //     MailBestQuote(thisTileSPS.id.match(/\d+$/)[0], JSON.parse($(thisTileSPS).find('[id^="hdnChartPricesELN"]').val())[0].EP_ER_QuoteRequestId);
//             request_getDataFromAPI({ "userName": sessionStorage.getItem("FinIQUserID").toString(), "rfqId": RFQID, "CurrentTileID": thisTileSPS.id.match(/\d+$/)[0] }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
//                 console.log(data);
//                 TileId = data.CurrentTileID;

//                 thisTileSPS = document.getElementById("td" + TileId)
//                 booktradePopup(thisTileSPS, "booktradeSPS" + TileId, data.message, "DivOverlaySPS");

//             }).catch(error => {
//                 console.log(error);

//             })
//         } else
//             alert('Invalid RFQ ID ')
//     } catch (error) {
//         console.log(error)
//         alert('Invalid RFQ ID ')

//     }

// }

//CNSD Common shares load function
var SPSSharesArray = [];

// function loadSPSShares(thisTileSPS, currId) {
//     try {
//         request_getDataFromAPI({

//             "entityCode": "CN",
//             "loginID": "Dealer1",
//             "sourceSystem": "FINIQ",
//             "machineIP": "192.168.0.0",
//             "requestID": uniqueRequestID,
//             "requestAt": currentDate,
//             "token": "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",

//             "currency": "",
//             "exchangeCode": "",
//             "product": "SPS",

//             "CurrentTileID": $(thisTileSPS).attr("id").match(/\d+$/)[0]

//         }, clientConfigdata.CommonMethods.NodeServer + "getCNSDSharelist").then(data => {

//            // console.log('CNSD shares ', data.shareResponse.shareList);
//             SPSSharesArray = data.shareResponse.shareList;

//             callDropDownFunction($(thisTileSPS).find('[id^="shareName"]'), "SPS", currId, SPSSharesArray);

//         })
//     } catch (error) {
//         console.log(error.message);

//     }
// }
