var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var contractAmt;
var CouponFreq;
var tempShareName;
var arrRELCI = [];
var maxRELCI;
var finalResponseDataRELCI;
var finalTokenRELCI;
var repriceObjectRELCI;
var TimerRELCI = 0;
var finalObjRELCI;
var getddlList;
var tenorListRELCI = ["1M", "3M", "6M", "9M", "12M"];
var idRELCI = 27;
var dateObj = "";
var currentDate = new Date().toShortFormat();
var uniqueRequestID = "CadB_" + Math.random().toFixed(2) * 100;

// To load the RELCI tile
function onLoadRELCI(currId, isProductCopiedRELCI) {
  try {
    setDeafaultValuesRELCI(currId, isProductCopiedRELCI);
    thisTileRELCI = document.getElementById("td" + currId);

    hideTileLoader(thisTileRELCI, "loader_RELCI");

    fillDropdownlistControl(
      tenorListRELCI,
      $(thisTileRELCI).find('[id^="tenorRELCI"]').attr("id")
    );
    document.querySelector(
      "#" + $(thisTileRELCI).find('[id^="tenorRELCI"]').attr("id")
    ).selectedIndex = 3;

    $(thisTileRELCI)
      .find("div.card input[type='text'],div.card input[type='search'],div.card select")
      .on("change", function () {
        thisTileRELCI = $(this).parents(".sorting")[0];
        clearInterval($(thisTileRELCI).find('[id^="hdnintervalID"]').val());
        clearPricerTable(thisTileRELCI);
      });

    $(thisTileRELCI)
      .find("div.card input[type='text'],div.card input[type='search'],div.card select,div.card .ddlShares")
      .on("select", function () {
        thisTileRELCI = $(this).parents(".sorting")[0];
        clearInterval($(thisTileRELCI).find('[id^="hdnintervalID"]').val());
        clearPricerTable(thisTileRELCI);
      });

    $(thisTileRELCI)
      .find('[id^="solveForRELCI"]')
      .on("change", function (event) {
        thisTileRELCI = $(this).parents(".sorting")[0];
      });

    shareCount = 0;
    $(thisTileRELCI)
      .find('[id^="shareDivRELCI"]')
      .click(function () {
        $(this).find('input[type="search"]').focus();
      });

    $("div.card input,div.card select").change(function () {
      // console.log('change event called RESET')
      thisTileRELCI = $(this).parents(".sorting")[0];
      clearInterval($(thisTileRELCI).find('[id^="hdnintervalID"]').val());
      clearPricerTable(thisTileRELCI);
      hideTileLoader(thisTileRELCI, "loader_RELCI");
      return false;
    });
  } catch (error) {
    console.log(error.message);
  }
}

// To set default values for RELCI
function setDeafaultValuesRELCI(currId, isProductCopiedRELCI) {
  try {
    thisTileRELCI = document.getElementById("td" + currId);
    fillDropdownlistControl(
      tenorListRELCI,
      $(thisTileRELCI).find('[id^="tenorRELCI"]').attr("id")
    );
    Currency_Selection_Drop_Down(currId);
    document.querySelector(
      "#" + $(thisTileRELCI).find('[id^="tenorRELCI"]').attr("id")
    ).selectedIndex = 2;
    $(thisTileRELCI).find('[id^="NoOfShareipboxRELCI"]').val("2,000");
    $(thisTileRELCI).find('[id^="strikeipboxRELCI"]').val("95.67");
    $(thisTileRELCI).find('[id^="upfrontRELCI"]').val("1.50");
    $(thisTileRELCI)
      .find('[id^="RELCISharesDemo"]')
      .val(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CODE1);
    clearPricerTable(thisTileRELCI);
    $(thisTileRELCI)
      .find("span.notionalCcy")
      .html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);

    callautocomplete(
      thisTileRELCI,
      "RELCISharesDemo",
      sessionStorage.getItem(thisTileRELCI.id) != undefined
        ? sessionStorage.getItem(thisTileRELCI.id)
        : "AAPL.OQ"
    );
  } catch (error) {
    console.log(error.message);
  }
}

function checkSolveForRELCI(solveFor, thisTileRELCI, calledFromIndexRELCI) {
  try {
    if (calledFromIndexRELCI != undefined) {
      if (solveFor.trim().toUpperCase().includes("YIELD")) {
        $(thisTileRELCI).find("[id^='clientYRELCI']").prop("disabled", true);
        $(thisTileRELCI)
          .find("[id^='strikeipboxRELCI']")
          .prop("disabled", false);
      }
    } else {
      if (solveFor.trim().toUpperCase().includes("YIELD")) {
        $(thisTileRELCI)
          .find("[id^='clientYRELCI']")
          .val("")
          .prop("disabled", true);
        $(thisTileRELCI)
          .find("[id^='strikeipboxRELCI']")
          .val("95.67")
          .prop("disabled", false);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

// To get best price for RELCI
function getBestPriceRELCI(that) {
  try {
    //    var uniqueIntervalID;
    thisTileRELCI = $(that).parents(".sorting")[0];

    clearInterval($(thisTileRELCI).find('[id^="hdnintervalID"]').val());

    $(thisTileRELCI).find('[id^="hdnintervalID"]').val("");

    TileId = that.id.match(/\d+$/)[0];

    sessionStorage.setItem("poolingTimer_" + TileId, 0);
    sessionStorage.setItem("pricingToggle" + TileId, false);
    thisTileRELCI = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    console.log(TileId, thisTileRELCI, productName);

    $(thisTileRELCI)
      .find('[id^="TBLRELCI"]' + " td")
      .each(function () {
        $(this).html("-");
      });
    validation_clear();
    clearPricerTable(thisTileRELCI);

    if ($.trim($(thisTileRELCI).find('[id^="RELCISharesDemo"]').val()) == "") {
      ValidateField(
        $(thisTileRELCI).find('[id^="RELCISharesDemo"]').attr("id"),
        "Please Enter Valid Shares",
        thisTileRELCI
      );
      return false;
    } else if (
      $.trim($(thisTileRELCI).find('[id^="NoOfShareipboxRELCI"]').val()) ==
        "" ||
      parseFloat($(thisTileRELCI).find('[id^="NoOfShareipboxRELCI"]').val()) ==
        0
    ) {
      ValidateField(
        $(thisTileRELCI).find('[id^="NoOfShareipboxRELCI"]').attr("id"),
        "Please enter valid Daily No.of shares.",
        thisTileRELCI
      );
      return false;
    } else if (
      $.trim($(thisTileRELCI).find('[id^="tenorRELCI"]').val()) == ""
    ) {
      ValidateField(
        $(thisTileRELCI).find('[id^="tenorRELCI"]').attr("id"),
        "Please Enter Valid tenor",
        thisTileRELCI
      );
      return false;
    } else if (
      $.trim($(thisTileRELCI).find('[id^="upfrontRELCI"]').val()) == "" ||
      $.trim($(thisTileRELCI).find('[id^="upfrontRELCI"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileRELCI).find('[id^="upfrontRELCI"]').attr("id"),
        "Please Enter Valid Upfront",
        thisTileRELCI
      );
      return false;
    } else if (
      $.trim($(thisTileRELCI).find('[id^="strikeipboxRELCI"]').val()) == "" ||
      $.trim($(thisTileRELCI).find('[id^="strikeipboxRELCI"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileRELCI).find('[id^="strikeipboxRELCI"]').attr("id"),
        "Please Enter Valid Strike(%)",
        thisTileRELCI
      );
      return false;
    }

    setTimeout("$(thisTileRELCI).find('[id^=\"loader_RELCI\"]').show();", 200);

    $("body").css("opacity", "0.9");
    let RELCIExchangeCode = getExchangeAndCcyFromBasket(
        "",
        "exchange",
        $(thisTileRELCI).find('[id^="RELCISharesDemo"]').val().trim()
      )[0],
      RELCIQuoteObject = {
        StrikePercentage: $(thisTileRELCI)
          .find('[id^="strikeipboxRELCI"]')
          .val(),
        CashCurrency: $(thisTileRELCI).find('[id^="noteCCY_RELCI"]').val(),
        CashOrderQuantity: Number(
          removeCommaAndDecimal(
            $(thisTileRELCI).find('[id^="NoOfShareipboxRELCI"]').val()
          )
        ),
        ClientYield: $(thisTileRELCI).find('[id^="clientYRELCI"]').val(),
        LoginID: "PratikM",
        EntityName: "CFS SG",
        Entity_ID: 30,
        ExpiryDate: "02-Nov-2021",
        InterBankPrice: "99.25",
        exchange1: RELCIExchangeCode,
        Issuer_Date_Offset: "14",
        MaturityDate: "09-Nov-2021",
        Ppdetails: "14", //Asked by Chitralekha, 05-Jul-22
        RFQ_RMName: "",
        SettlementDate: "05-May-2021",
        SolveFor: $(thisTileRELCI).find('[id^="solveForRELCI20"]').val(),
        Tenor: parseFloat($(thisTileRELCI).find('[id^="tenorRELCI"]').val()),
        TenorType: "Month",
        Text: "2012_QR12",
        TradeDate: currentDate,
        Type: "RELCI",
        underlyingCode1: $(thisTileRELCI).find('[id^="RELCISharesDemo"]').val(),
        Upfront: $(thisTileRELCI).find('[id^="upfrontRELCI"]').val(),
        CurrentTileID: TileId,
      };

    console.log("RELCI quote ", RELCIQuoteObject);

    getQuoteRELCI(
      RELCIQuoteObject,
      $(thisTileRELCI).find('[id^="hdnintervalID"]')[0]
    );
  } catch (er) {
    console.log(er.message);
  }
}
var priceProviderArray_RELCI = [];

// To get quote
function getQuoteRELCI(RELCIQuoteObject, uniqueIntervalID) {
  try {
    var dataRELCI = request_getDataFromAPI(
      RELCIQuoteObject,
      clientConfigdata.CommonMethods.NodeServer + "getBestPriceRELCI"
    )
      .then((dataRELCI) => {
        thisTileRELCI = document.getElementById("td" + dataRELCI.CurrentTileID);

        console.log("RELCI quote response ", dataRELCI);
        if (dataRELCI.body == "") {
          clearInterval($(thisTileRELCI).find('[id^="hdnintervalID"]').val());
          hideTileLoader(thisTileRELCI, "loader_RELCI");

          return false;
        }
        priceProviderArray_RELCI = [];

        for (var x of dataRELCI.body.split(",")) {
          priceProviderArray_RELCI.push({ rfqID: x });
        }

        sessionStorage.setItem("pricingToggle" + dataRELCI.CurrentTileID, true);

        getUniqQuoteResponseRELCI(
          priceProviderArray_RELCI,
          thisTileRELCI,
          dataRELCI,
          uniqueIntervalID
        );
      })
      .catch((error) => {
        hideTileLoader(thisTileRELCI, "loader_RELCI");

        console.log(error);
      });
  } catch (err) {
    hideTileLoader(thisTileRELCI, "loader_RELCI");

    console.log(err.message);
  }
}

function getUniqQuoteResponseRELCI(
  priceProviderArray_RELCI,
  thisTileRELCI,
  dataRELCI,
  uniqueIntervalID
) {
  try {
    var UIID = null;

    uniqueIntervalID.value = setInterval(function () {
      console.log("priceProviderArray_RELCI", priceProviderArray_RELCI);
      getFinalQuoteResponseRELCI(
        priceProviderArray_RELCI,
        "",
        "",
        thisTileRELCI,
        uniqueIntervalID
      );
    }, clientConfigdata.EQCRELCI.PollInterval);
  } catch (error) {
    console.log(error);
  }
}

// To get price

function getFinalQuoteResponseRELCI(
  priceProviderArray_RELCI,
  finalTokenRELCI1,
  finalResponseDataRELCI1,
  thisTileRELCI,
  uniqueIntervalID
) {
  try {
    var currentDateAndTime = new Date();

    console.log(
      "RELCI RFQ's :: " + finalResponseDataRELCI1 + " " + currentDateAndTime
    );
    Timer = Timer + 1;

    if (
      Number(
        sessionStorage.getItem(
          "poolingTimer_" + thisTileRELCI.id.match(/\d+$/)[0]
        )
      ) >= clientConfigdata.EQCRELCI.PoolTimer ||
      sessionStorage.getItem(
        "pricingToggle" + thisTileRELCI.id.match(/\d+$/)[0]
      ) == "false"
    ) {
      $(thisTileRELCI).find('[id^="BookTradeRELCI"]').attr("disabled", false);
      clearInterval(uniqueIntervalID.value);
      uniqueIntervalID.value = "";
      QuoteObject = "";
      hideTileLoader(thisTileRELCI, "loader_RELCI");
      $(thisTileRELCI)
        .find('[id^="hdnChartPricesRELCI"]')
        .val(JSON.stringify(finalObjRELCI));
      $("body").css("opacity", "");
      arrRELCI = [];
      maxRELCI = "";
      TimerRELCI = 0;
      //Call Draw Graph
      if (finalObjRELCI != null || finalObjRELCI != undefined) {
      }

      return false;
    } else {
      var repriceObjectRELCI = request_getDataFromAPI(
        {
          userID: "PratikM",
          rfqDetails: priceProviderArray_RELCI,
          CurrentTileID: $(thisTileRELCI).attr("id").match(/\d+$/)[0],
        },
        clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseSI"
      )
        .then((repriceObjectRELCI) => {
          console.log("RELCI quote response ", repriceObjectRELCI);

          thisTileRELCI = document.getElementById(
            "td" + repriceObjectRELCI.CurrentTileID
          );
          sessionStorage.setItem(
            "poolingTimer_" + repriceObjectRELCI.CurrentTileID,
            Number(
              sessionStorage.getItem(
                "poolingTimer_" + thisTileRELCI.id.match(/\d+$/)[0]
              )
            ) + 1
          );
          finalObjRELCI = repriceObjectRELCI.quoteresponses;
          console.log("snow ball price object before sort", finalObjRELCI);
          // added by AniruddhaJ for upfront calculatation START
          if (
            $(thisTileRELCI).find('[id^="solveForRELCI"]').val().trim() ===
            "UPFRONT"
          ) {
            for (let priceRELCI of finalObjRELCI) {
              priceRELCI.response = (Number(priceRELCI.response) / 100)
                .toFixed(2)
                .toString();
            }
          }
          //End
          // // Sorted By Best Price LP'S

          finalObjRELCI.sort(function (a, b) {
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
              $(thisTileRELCI).find('[id^="solveForRELCI"]').val() == "YIELD" ||
              $(thisTileRELCI).find('[id^="solveForRELCI"]').val() ==
                "COUPON" ||
              $(thisTileRELCI).find('[id^="solveForRELCI"]').val() ==
                "KO_COUPON" ||
              $(thisTileRELCI).find('[id^="solveForRELCI"]').val() == "UPFRONT"
            ) {
              return Number(a.response) > Number(b.response) ? -1 : 1;
            } else {
              return Number(a.response) < Number(b.response) ? -1 : 1;
            }
          });
          maxRELCI = finalObjRELCI[0].response;
          $(thisTileRELCI)
            .find('[id^="hdnChartPricesRELCI"]')
            .val(JSON.stringify(finalObjRELCI));
          console.log("snow ball price object after sort", finalObjRELCI);

          if (
            sessionStorage.getItem(
              "pricingToggle" + thisTileRELCI.id.match(/\d+$/)[0]
            ) == "true"
          ) {
            $(thisTileRELCI).find('[id^="RELCIBanksRow"]').empty();
            $(thisTileRELCI).find('[id^="RELCIPrices"]').empty();
            $(finalObjRELCI).each(function (i, elem) {
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
                $(thisTileRELCI).find('[id^="RELCIBanksRow"]').append(str);
              } else {
                str = str + "<td>--</td>";
                $(thisTileRELCI).find('[id^="RELCIBanksRow"]').append(str);
              }
              if (
                elem.response != null &&
                elem.response.trim() !== "NaN" &&
                elem.response.trim().toUpperCase() != "REJECTED" &&
                elem.response != "" &&
                parseFloat(elem.response) != 0
              ) {
                if (maxRELCI == elem.response) {
                  str2 =
                    str2 +
                    "<td class='" +
                    priceClass +
                    "'>" +
                    parseFloat(elem.response).toFixed(2) +
                    "</td>";
                  $(thisTileRELCI).find('[id^="RELCIPrices"]').append(str2);
                } else {
                  str2 =
                    str2 +
                    "<td class=''>" +
                    parseFloat(elem.response).toFixed(2) +
                    "</td>";
                  $(thisTileRELCI).find('[id^="RELCIPrices"]').append(str2);
                }
              } else {
                str2 = str2 + "<td>-</td>";
                $(thisTileRELCI).find('[id^="RELCIPrices"]').append(str2);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          hideTileLoader(thisTileRELCI, "loader_RELCI");
          $(thisTileRELCI)
            .find('[id^="hdnChartPricesRELCI"]')
            .val(JSON.stringify(finalObjRELCI));
          if (finalObjRELCI != null || finalObjRELCI != undefined) {
            //     drawgraphRELCI($(thisTileRELCI).find('[id^="canvas"]').attr('id'));
          }
        });
    }
  } catch (error) {
    console.log("getFinalQuoteResponseRELCI : " + error.message);
    $(thisTileRELCI)
      .find('[id^="hdnChartPricesRELCI"]')
      .val(JSON.stringify(finalObjRELCI));
    window.clearInterval(uniqueIntervalID.value);
    uniqueIntervalID.value = "";
    hideTileLoader(thisTileRELCI, "loader_RELCI");
    $(thisTileRELCI).find('[id^="BookTradeRELCI"]').attr("disabled", false);
    if (finalObjRELCI != null || finalObjRELCI != undefined) {
      //  drawgraphRELCI($(thisTileRELCI).find('[id^="canvas"]').attr('id'));
    }
    //  sessionStorage.setItem("quoteToken_" + thisTileRELCI.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileRELCI.id.match(/\d+$/)[0]));

    //  sessionStorage.setItem("quoteResponse_" + thisTileRELCI.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileRELCI.id.match(/\d+$/)[0]));
  } finally {
    $(thisTileRELCI).find('[id^="BookTradeRELCI"]').attr("disabled", false);
  }
}

// To book trade
function booktradeRELCI(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileRELCI = document.getElementById("td" + TileId);
    sessionStorage.setItem("pricingToggle" + TileId, false);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    showTileLoader(thisTileRELCI, "loader_RELCI");

    if (
      $(thisTileRELCI).find('[id^="RELCIPrices"]')[0].firstChild.innerHTML ==
        "-" ||
      $(thisTileRELCI).find('[id^="RELCIPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        that,
        "booktradeRELCI" + TileId,
        "Please Best Price Before Book Trade, Order Execution Failed!",
        "DivOverlayRELCI"
      );
      hideTileLoader(thisTileRELCI, "loader_RELCI");

      return false;
    }

    // Check For Negative prices // CFINT-927 // 10-Sep-2020

    if (
      parseFloat(
        JSON.parse(
          $(thisTileRELCI).find('[id^="hdnChartPricesRELCI"]').val()
        )[0].response
      ) <= 0
    ) {
      booktradePopup(
        that,
        "booktradeRELCI" + TileId,
        "Prices can not be negative 0r zero, Order Execution Failed!",
        "DivOverlayRELCI"
      );
      hideTileLoader(thisTileRELCI, "loader_RELCI");
      return false;
    }

    var Obj = JSON.parse(
      $(thisTileRELCI).find('[id^="hdnChartPricesRELCI"]').val()
    );
    var RELCI_quoteid = Obj[0].quoteRequestId;

    let clientPriceRELCI = Obj[0].response;
    var UpfrontbyIBpriceRELCI = 100 - clientPriceRELCI;

    // thisTileRELCI = document.getElementById("td" + dataTranche.CurrentTileID);

    Obj = JSON.parse(
      $(thisTileRELCI).find('[id^="hdnChartPricesRELCI"]').val()
    );

    RELCI_quoteid = Obj[0].quoteRequestId;

    clientPriceRELCI = Obj[0].response;
    let orderObjectRELCI = {
      orderQuantity: removeCommaAndDecimal(
        $(thisTileRELCI).find('[id^="NoOfShareipboxRELCI"]').val()
      ),
      orderType: "",
      limitPrice1: "",
      limitPrice2: "",
      limitPrice3: "",
      limitPrice4: "",
      quoteRequestId: RELCI_quoteid,
      orderComment: "Order Placed from CadB ",
      loginUser: "PratikM",
      margin: "",
      clientPrice: clientPriceRELCI,
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
    console.log("RELCI Order object ", orderObjectRELCI);
    request_getDataFromAPI(
      orderObjectRELCI,
      clientConfigdata.CommonMethods.NodeServer + "RELCIBookOrder"
    )
      .then((bookObject) => {
        console.log("RELCIBookOrder ", bookObject);

        thisTileRELCI = document.getElementById(
          "td" + bookObject.CurrentTileID
        );
        TileId = bookObject.CurrentTileID;

        var bookstring = bookObject.orderPlaceRELCIResult.orderID;

        if (bookstring != "" && bookstring != null && bookstring != undefined) {
          var orderplaced =
            "RELCI :: Order Placed Successfully with Order ID: " +
            bookObject.orderPlaceRELCIResult.orderID;
          booktradePopup(
            that,
            "booktradeRELCI" + TileId,
            orderplaced,
            "DivOverlayRELCI"
          );
          hideTileLoader(thisTileRELCI, "loader_RELCI");
          // $(thisTileRELCI).find('[id^="hdnfinalTokenRELCI"]').val("");
        } else {
          booktradePopup(
            that,
            "booktradeRELCI" + TileId,
            bookObject.orderPlaceRELCIResult.remark,
            "DivOverlayRELCI"
          );
          hideTileLoader(thisTileRELCI, "loader_RELCI");
        }

        clearInterval($(thisTileRELCI).find('[id^="hdnintervalID"]').val());
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (er) {
    console.log(er);
    booktradePopup(
      that,
      "booktradeRELCI" + TileId,
      "Please Best Price Before Book Trade, Order Execution Failed!",
      "DivOverlayRELCI"
    );
    hideTileLoader(thisTileRELCI, "loader_RELCI");
  } finally {
  }
}

// function emailQuoteRELCI(that) {
//     try {

//         thisTileRELCI= $(that).parents(".sorting")[0];
//         if ($(thisTileRELCI).find('[id^="hdnChartPricesRELCI"]').val() != undefined)
//             var RFQID = JSON.parse($(thisTileRELCI).find('[id^="hdnChartPricesRELCI"]').val())[0].EP_ER_QuoteRequestId;

//         if (RFQID != undefined && RFQID != '') {
//             //     MailBestQuote(thisTileRELCI.id.match(/\d+$/)[0], JSON.parse($(thisTileRELCI).find('[id^="hdnChartPricesRELCI"]').val())[0].EP_ER_QuoteRequestId);
//             request_getDataFromAPI({ "userName": sessionStorage.getItem("FinIQUserID").toString(), "rfqId": RFQID, "CurrentTileID": thisTileRELCI.id.match(/\d+$/)[0] }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
//                 console.log(data);
//                 TileId = data.CurrentTileID;

//                 thisTileRELCI = document.getElementById("td" + TileId)
//                 booktradePopup(thisTileRELCI, "booktradeRELCI" + TileId, data.message, "DivOverlayRELCI");

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
var RELCISharesArray = [];

function loadRELCIShares(thisTileRELCI, currId) {
  try {
    request_getDataFromAPI(
      {
        entityCode: "CN",
        loginID: "Dealer1",
        sourceSystem: "FINIQ",
        machineIP: "192.168.0.0",
        requestID: uniqueRequestID,
        requestAt: currentDate,
        token:
          "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",

        currency: "",
        exchangeCode: "",
        product: "RELCI",

        CurrentTileID: $(thisTileRELCI).attr("id").match(/\d+$/)[0],
      },
      clientConfigdata.CommonMethods.NodeServer + "getCNSDSharelist"
    ).then((data) => {
      // console.log('CNSD shares ', data.shareResponse.shareList);
      RELCISharesArray = data.shareResponse.shareList;

      callDropDownFunction(
        $(thisTileRELCI).find('[id^="shareName"]'),
        "RELCI",
        currId,
        RELCISharesArray
      );
    });
  } catch (error) {
    console.log(error.message);
  }
}
