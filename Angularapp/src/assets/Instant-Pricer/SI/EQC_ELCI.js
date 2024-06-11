var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var contractAmt;
var CouponFreq;
var tempShareName;
var arrELCI = [];
var maxELCI;
var finalResponseDataELCI;
var finalTokenELCI;
var repriceObjectELCI;
var TimerELCI = 0;
var finalObjELCI;
var getddlList;
var tenorListELCI = ["1M", "3M", "6M", "9M", "12M"];
var idELCI = 26;
var dateObj = "";
var currentDate = new Date().toShortFormat();
var uniqueRequestID = "CadB_" + Math.random().toFixed(2) * 100;

// To load the ELCI tile
function onLoadELCI(currId, isProductCopiedELCI) {
  try {
    // Added logic for getting current tile : Onkar E.//
    setDeafaultValuesELCI(currId, isProductCopiedELCI);
    thisTileELCI = document.getElementById("td" + currId);

    hideTileLoader(thisTileELCI, "loader_ELCI");

    //    loadELCIShares(thisTileELCI, currId);

    fillDropdownlistControl(
      tenorListELCI,
      $(thisTileELCI).find('[id^="tenorELCI"]').attr("id")
    );
    document.querySelector(
      "#" + $(thisTileELCI).find('[id^="tenorELCI"]').attr("id")
    ).selectedIndex = 3;

    $(thisTileELCI)
      .find("div.card input[type='text'],div.card input[type='search'],div.card select")
      .on("change", function () {
        thisTileELCI = $(this).parents(".sorting")[0];
        clearInterval($(thisTileELCI).find('[id^="hdnintervalID"]').val());
        clearPricerTable(thisTileELCI);
      });

    $(thisTileELCI)
      .find("div.card input[type='text'],div.card input[type='search'],div.card select,div.card .ddlShares")
      .on("select", function () {
        thisTileELCI = $(this).parents(".sorting")[0];
        clearInterval($(thisTileELCI).find('[id^="hdnintervalID"]').val());
        clearPricerTable(thisTileELCI);
      });

    $(thisTileELCI)
      .find('[id^="ddlKOKIType"]')
      .on("change", function () {
        try {
          thisTileELCI = $(this).parents(".sorting")[0];
          validation_clear(); //To Remove highlighted part if no error
          // checkKOKITypeELCI($(thisTileELCI).find('[id^="ddlKOKIType"]').val().trim(), thisTileELCI);
        } catch (error) {
          console.log(error.message);
        }
      });
    checkSolveForELCI(
      $(thisTileELCI).find('[id^="solveForELCI"]').val(),
      thisTileELCI
    );
    $(thisTileELCI)
      .find('[id^="solveForELCI"]')
      .on("change", function (event) {
        thisTileELCI = $(this).parents(".sorting")[0];
        checkSolveForELCI($(this).val(), thisTileELCI);
      });

    shareCount = 0;
    $(thisTileELCI)
      .find('[id^="shareDivELCI"]')
      .click(function () {
        $(this).find('input[type="search"]').focus();
      });

    $("div.card input,div.card select").change(function () {
      // console.log('change event called RESET')
      thisTileELCI = $(this).parents(".sorting")[0];
      clearInterval($(thisTileELCI).find('[id^="hdnintervalID"]').val());
      clearPricerTable(thisTileELCI);
      hideTileLoader(thisTileELCI, "loader_ELCI");
      return false;
    });
  } catch (error) {
    console.log(error.message);
  }
}

// To set default values for ELCI
function setDeafaultValuesELCI(currId, isProductCopiedELCI) {
  try {
    thisTileELCI = document.getElementById("td" + currId);
    fillDropdownlistControl(
      tenorListELCI,
      $(thisTileELCI).find('[id^="tenorELCI"]').attr("id")
    );
    Currency_Selection_Drop_Down(currId);
    document.querySelector(
      "#" + $(thisTileELCI).find('[id^="tenorELCI"]').attr("id")
    ).selectedIndex = 2;
    $(thisTileELCI).find('[id^="ContractAmtELCI"]').val("1,000,000.00");
    $(thisTileELCI).find('[id^="strikeipboxELCI"]').val("95.67");
    $(thisTileELCI).find('[id^="upfrontELCI"]').val("1.50");
    $(thisTileELCI).find('[id^="koinputboxELCI"]').val("100.00");
    $(thisTileELCI)
      .find('[id^="ELCISharesDemo"]')
      .val(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CODE1);
    clearPricerTable(thisTileELCI);
    $(thisTileELCI)
      .find("span.notionalCcy")
      .html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);

    //  callautocomplete(thisTileELCI, "ELCISharesDemo", "AAPL.OQ");
    callautocomplete(
      thisTileELCI,
      "ELCISharesDemo",
      sessionStorage.getItem(thisTileELCI.id) != undefined
        ? sessionStorage.getItem(thisTileELCI.id)
        : "AAPL.OQ"
    );
  } catch (error) {
    console.log(error.message);
  }
}

function checkSolveForELCI(solveFor, thisTileELCI, calledFromIndexELCI) {
  try {
    if (calledFromIndexELCI != undefined) {
      if (solveFor.trim().toUpperCase().includes("YIELD")) {
        $(thisTileELCI).find("[id^='clientYELCI']").prop("disabled", true);
        $(thisTileELCI).find("[id^='strikeipboxELCI']").prop("disabled", false);

        //      checkKOKITypeELCI($(thisTileELCI).find('[id^="ddlELCICFreq"]').val(), thisTileELCI, true);
      }
    } else {
      if (solveFor.trim().toUpperCase().includes("YIELD")) {
        $(thisTileELCI)
          .find("[id^='clientYELCI']")
          .val("")
          .prop("disabled", true);
        $(thisTileELCI)
          .find("[id^='strikeipboxELCI']")
          .val("95.67")
          .prop("disabled", false);
        //   checkKOKITypeELCI($(thisTileELCI).find('[id^="ddlELCICFreq"]').val(), thisTileELCI);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}
// function checkKOKITypeELCI(KOKIType, thisTileELCI) {
//     try {
//         if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
//             // $(thisTileELCI).find('[id^="koinputbox"]').val("3.88").prop('disabled', false);
//             //$(thisTileELCI).find('[id^="kiinputbox"]').val("").prop("disabled", true);

//         } else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
//             // $(thisTileELCI).find('[id^="koinputbox"]').val("3.88").prop('disabled', false);
//             //  $(thisTileELCI).find('[id^="kiinputbox"]').val("65.00").prop('disabled', false);

//         } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
//             //  $(thisTileELCI).find('[id^="koinputbox"]').val("").prop("disabled", true);
//             // $(thisTileELCI).find('[id^="kiinputbox"]').val("65.00").prop('disabled', false);

//         } else if (KOKIType == "NOKINOKO") {
//             //  $(thisTileELCI).find('[id^="koinputbox"]').val("").prop("disabled", true);
//             //  $(thisTileELCI).find('[id^="kiinputbox"]').val("").prop('disabled', true);

//         }
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// To get best price for ELCI
function getBestPriceELCI(that) {
  try {
    // Added logic for getting current tile : Onkar E.//

    //    var uniqueIntervalID;
    thisTileELCI = $(that).parents(".sorting")[0];
    // console.log('Start Interval value =' + $(thisTileELCI).find('[id^="hdnintervalID"]').val());

    clearInterval($(thisTileELCI).find('[id^="hdnintervalID"]').val());
    // console.log('After clear Interval value =' + $(thisTileELCI).find('[id^="hdnintervalID"]').val());

    $(thisTileELCI).find('[id^="hdnintervalID"]').val("");

    TileId = that.id.match(/\d+$/)[0];

    sessionStorage.setItem("poolingTimer_" + TileId, 0);
    sessionStorage.setItem("pricingToggle" + TileId, false);
    thisTileELCI = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    console.log(TileId, thisTileELCI, productName);

    $(thisTileELCI)
      .find('[id^="TBLELCI"]' + " td")
      .each(function () {
        //Clear prices || Tina K || 11-Sep-2019
        $(this).html("-");
      });
    validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
    clearPricerTable(thisTileELCI); //To clear prices after clicking best price || Tina K || 20-Nov-2019
    //Validation conditions added : Tina Kshirsagar : 6-09-2019

    if ($.trim($(thisTileELCI).find('[id^="ELCISharesDemo"]').val()) == "") {
      ValidateField(
        $(thisTileELCI).find('[id^="ELCISharesDemo"]').attr("id"),
        "Please Enter Valid Shares",
        thisTileELCI
      );
      return false;
    } else if (
      $.trim($(thisTileELCI).find('[id^="ContractAmtELCI"]').val()) == "" ||
      parseFloat($(thisTileELCI).find('[id^="ContractAmtELCI"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileELCI).find('[id^="ContractAmtELCI"]').attr("id"),
        "Please Enter Valid Contract Amount",
        thisTileELCI
      );
      return false;
    } else if ($.trim($(thisTileELCI).find('[id^="tenorELCI"]').val()) == "") {
      ValidateField(
        $(thisTileELCI).find('[id^="tenorELCI"]').attr("id"),
        "Please Enter Valid tenor",
        thisTileELCI
      );
      return false;
    } else if (
      $.trim($(thisTileELCI).find('[id^="upfrontELCI"]').val()) == "" ||
      $.trim($(thisTileELCI).find('[id^="upfrontELCI"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileELCI).find('[id^="upfrontELCI"]').attr("id"),
        "Please Enter Valid Upfront",
        thisTileELCI
      );
      return false;
    } else if (
      $.trim($(thisTileELCI).find('[id^="strikeipboxELCI"]').val()) == "" ||
      $.trim($(thisTileELCI).find('[id^="strikeipboxELCI"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileELCI).find('[id^="strikeipboxELCI"]').attr("id"),
        "Please Enter Valid Strike(%)",
        thisTileELCI
      );
      return false;
    } else if (
      $.trim($(thisTileELCI).find('[id^="koinputboxELCI"]').val()) == "" ||
      $.trim($(thisTileELCI).find('[id^="koinputboxELCI"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileELCI).find('[id^="koinputboxELCI"]').attr("id"),
        "Please Enter Valid KO(%)",
        thisTileELCI
      );
      return false;
    }

    setTimeout("$(thisTileELCI).find('[id^=\"loader_ELCI\"]').show();", 200);

    //$(thisTileELCI).find('[id^="BookTradeELCI"]').attr("disabled", true); // Disabling book trade button while pricing is happening - by Onkar E. 25/11/2019
    $("body").css("opacity", "0.9");
    let ELCIExchangeCode = getExchangeAndCcyFromBasket(
        "",
        "exchange",
        $(thisTileELCI).find('[id^="ELCISharesDemo"]').val().trim()
      )[0], //$(thisTileELCI).find('[id^="hdnCurrentExchangeCodeELCI"]').val().trim(),
      ELCIQuoteObject = {
        StrikePercentage: $(thisTileELCI).find('[id^="strikeipboxELCI"]').val(),
        CashCurrency: $(thisTileELCI).find('[id^="noteCCY_ELCI"]').val(),
        CashOrderQuantity: Number(
          removeCommaAndDecimal(
            $(thisTileELCI).find('[id^="ContractAmtELCI"]').val()
          )
        ),
        ClientYield: $(thisTileELCI).find('[id^="clientYELCI"]').val(),
        LoginID: "PratikM",
        EntityName: "CFS SG",
        Entity_ID: 30,
        ExpiryDate: "02-Nov-2021",
        InterBankPrice: "99.25", //clientYELCI
        exchange1: ELCIExchangeCode,
        Issuer_Date_Offset: "14",
        KO_Level: $(thisTileELCI).find('[id^="koinputboxELCI"]').val(),
        KO_Type: "",
        MaturityDate: "09-Nov-2021",
        Ppdetails: "14", //Asked by Chitralekha, 05-Jul-22
        RFQ_RMName: "",
        SettlementDate: "05-May-2021",
        SolveFor: $(thisTileELCI).find('[id^="solveForELCI20"]').val(),
        Tenor: parseFloat($(thisTileELCI).find('[id^="tenorELCI"]').val()),
        TenorType: "Month",
        Text: "2012_QR12",
        TradeDate: currentDate,
        Type: "ELCI",
        underlyingCode1: $(thisTileELCI).find('[id^="ELCISharesDemo"]').val(),
        Upfront: $(thisTileELCI).find('[id^="upfrontELCI"]').val(),
        CurrentTileID: TileId,
      };
    console.log($(thisTileELCI).find('[id^="ContractAmtELCI"]').val());
    console.log("ELCI quote ", ELCIQuoteObject);

    getQuoteELCI(
      ELCIQuoteObject,
      $(thisTileELCI).find('[id^="hdnintervalID"]')[0]
    );
  } catch (er) {
    console.log(er.message);
  }
}
var priceProviderArray_ELCI = [];

// To get quote
function getQuoteELCI(ELCIQuoteObject, uniqueIntervalID) {
  try {
    var dataELCI = request_getDataFromAPI(
      ELCIQuoteObject,
      clientConfigdata.CommonMethods.NodeServer + "getBestPriceELCI"
    )
      .then((dataELCI) => {
        thisTileELCI = document.getElementById("td" + dataELCI.CurrentTileID);

        console.log("ELCI quote response ", dataELCI);
        if (dataELCI.body == "") {
          clearInterval($(thisTileELCI).find('[id^="hdnintervalID"]').val());
          hideTileLoader(thisTileELCI, "loader_ELCI");

          return false;
        }
        priceProviderArray_ELCI = [];

        for (var x of dataELCI.body.split(",")) {
          priceProviderArray_ELCI.push({ rfqID: x });
        }

        sessionStorage.setItem("pricingToggle" + dataELCI.CurrentTileID, true);

        getUniqQuoteResponseELCI(
          priceProviderArray_ELCI,
          thisTileELCI,
          dataELCI,
          uniqueIntervalID
        );
      })
      .catch((error) => {
        hideTileLoader(thisTileELCI, "loader_ELCI");

        console.log(error);
      });
  } catch (err) {
    hideTileLoader(thisTileELCI, "loader_ELCI");

    console.log(err.message);
  }
}

function getUniqQuoteResponseELCI(
  priceProviderArray_ELCI,
  thisTileELCI,
  dataELCI,
  uniqueIntervalID
) {
  try {
    var UIID = null;

    uniqueIntervalID.value = setInterval(function () {
      console.log("priceProviderArray_ELCI", priceProviderArray_ELCI);
      getFinalQuoteResponseELCI(
        priceProviderArray_ELCI,
        "",
        "",
        thisTileELCI,
        uniqueIntervalID
      );
    }, clientConfigdata.EQCELCI.PollInterval);

    // console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
  } catch (error) {
    console.log(error);
  }
}

// To get price

function getFinalQuoteResponseELCI(
  priceProviderArray_ELCI,
  finalTokenELCI1,
  finalResponseDataELCI1,
  thisTileELCI,
  uniqueIntervalID
) {
  try {
    var currentDateAndTime = new Date();

    console.log(
      "ELCI RFQ's :: " + finalResponseDataELCI1 + " " + currentDateAndTime
    );
    Timer = Timer + 1;

    if (
      Number(
        sessionStorage.getItem(
          "poolingTimer_" + thisTileELCI.id.match(/\d+$/)[0]
        )
      ) >= clientConfigdata.EQCELCI.PoolTimer ||
      sessionStorage.getItem(
        "pricingToggle" + thisTileELCI.id.match(/\d+$/)[0]
      ) == "false"
    ) {
      $(thisTileELCI).find('[id^="BookTradeELCI"]').attr("disabled", false); // Enabling book trade button when pricing is over - by Onkar E. 25/11/2019
      clearInterval(uniqueIntervalID.value);
      uniqueIntervalID.value = "";
      QuoteObject = "";
      hideTileLoader(thisTileELCI, "loader_ELCI");
      $(thisTileELCI)
        .find('[id^="hdnChartPricesELCI"]')
        .val(JSON.stringify(finalObjELCI));
      $("body").css("opacity", "");
      arrELCI = [];
      maxELCI = "";
      TimerELCI = 0;
      //Call Draw Graph
      if (finalObjELCI != null || finalObjELCI != undefined) {
        // drawgraphELCI($(thisTileELCI).find('[id^="canvas"]').attr('id'));
      }

      return false;
    } else {
      var repriceObjectELCI = request_getDataFromAPI(
        {
          userID: "PratikM",
          rfqDetails: priceProviderArray_ELCI,
          CurrentTileID: $(thisTileELCI).attr("id").match(/\d+$/)[0],
        },
        clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseSI"
      )
        .then((repriceObjectELCI) => {
          console.log("ELCI quote response ", repriceObjectELCI);

          thisTileELCI = document.getElementById(
            "td" + repriceObjectELCI.CurrentTileID
          );
          sessionStorage.setItem(
            "poolingTimer_" + repriceObjectELCI.CurrentTileID,
            Number(
              sessionStorage.getItem(
                "poolingTimer_" + thisTileELCI.id.match(/\d+$/)[0]
              )
            ) + 1
          );
          finalObjELCI = repriceObjectELCI.quoteresponses;
          console.log("snow ball price object before sort", finalObjELCI);
          // added by AniruddhaJ for upfront calculatation START
          if (
            $(thisTileELCI).find('[id^="solveForELCI"]').val().trim() ===
            "UPFRONT"
          ) {
            for (let priceELCI of finalObjELCI) {
              priceELCI.response = (Number(priceELCI.response) / 100)
                .toFixed(2)
                .toString();
            }
          }
          //End
          // // Sorted By Best Price LP'S

          finalObjELCI.sort(function (a, b) {
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
              $(thisTileELCI).find('[id^="solveForELCI"]').val() == "YIELD" ||
              $(thisTileELCI).find('[id^="solveForELCI"]').val() == "COUPON" ||
              $(thisTileELCI).find('[id^="solveForELCI"]').val() ==
                "KO_COUPON" ||
              $(thisTileELCI).find('[id^="solveForELCI"]').val() == "UPFRONT"
            ) {
              return Number(a.response) > Number(b.response) ? -1 : 1;
            } else {
              return Number(a.response) < Number(b.response) ? -1 : 1;
            }
          });
          maxELCI = finalObjELCI[0].response;
          $(thisTileELCI)
            .find('[id^="hdnChartPricesELCI"]')
            .val(JSON.stringify(finalObjELCI));
          console.log("snow ball price object after sort", finalObjELCI);

          //   $(thisTileELCI).find('[id^="hdnfinalTokenELCI"]').val(sessionStorage.getItem("quoteToken_" + thisTileELCI.id.match(/\d+$/)[0]));

          if (
            sessionStorage.getItem(
              "pricingToggle" + thisTileELCI.id.match(/\d+$/)[0]
            ) == "true"
          ) {
            $(thisTileELCI).find('[id^="ELCIBanksRow"]').empty();
            $(thisTileELCI).find('[id^="ELCIPrices"]').empty();
            $(finalObjELCI).each(function (i, elem) {
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
                $(thisTileELCI).find('[id^="ELCIBanksRow"]').append(str);
              } else {
                str = str + "<td>--</td>";
                $(thisTileELCI).find('[id^="ELCIBanksRow"]').append(str);
              }
              if (
                elem.response != null &&
                elem.response.trim() !== "NaN" &&
                elem.response.trim().toUpperCase() != "REJECTED" &&
                elem.response != "" &&
                parseFloat(elem.response) != 0
              ) {
                if (maxELCI == elem.response) {
                  str2 =
                    str2 +
                    "<td class='" +
                    priceClass +
                    "'>" +
                    parseFloat(elem.response).toFixed(2) +
                    "</td>";
                  $(thisTileELCI).find('[id^="ELCIPrices"]').append(str2);
                } else {
                  str2 =
                    str2 +
                    "<td class=''>" +
                    parseFloat(elem.response).toFixed(2) +
                    "</td>";
                  $(thisTileELCI).find('[id^="ELCIPrices"]').append(str2);
                }
              } else {
                str2 = str2 + "<td>-</td>";
                $(thisTileELCI).find('[id^="ELCIPrices"]').append(str2);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          hideTileLoader(thisTileELCI, "loader_ELCI");
          $(thisTileELCI)
            .find('[id^="hdnChartPricesELCI"]')
            .val(JSON.stringify(finalObjELCI));
          if (finalObjELCI != null || finalObjELCI != undefined) {
            //     drawgraphELCI($(thisTileELCI).find('[id^="canvas"]').attr('id'));
          }
        });
    }
  } catch (error) {
    console.log("getFinalQuoteResponseELCI : " + error.message);
    $(thisTileELCI)
      .find('[id^="hdnChartPricesELCI"]')
      .val(JSON.stringify(finalObjELCI));
    window.clearInterval(uniqueIntervalID.value);
    uniqueIntervalID.value = "";
    hideTileLoader(thisTileELCI, "loader_ELCI");
    $(thisTileELCI).find('[id^="BookTradeELCI"]').attr("disabled", false);
    if (finalObjELCI != null || finalObjELCI != undefined) {
      //  drawgraphELCI($(thisTileELCI).find('[id^="canvas"]').attr('id'));
    }
    //  sessionStorage.setItem("quoteToken_" + thisTileELCI.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileELCI.id.match(/\d+$/)[0]));

    //  sessionStorage.setItem("quoteResponse_" + thisTileELCI.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileELCI.id.match(/\d+$/)[0]));
  } finally {
    $(thisTileELCI).find('[id^="BookTradeELCI"]').attr("disabled", false);
  }
}

// To book trade
function booktradeELCI(that) {
  try {
    // Added logic for getting current tile : Onkar E.//
    TileId = that.id.match(/\d+$/)[0];
    thisTileELCI = document.getElementById("td" + TileId);
    sessionStorage.setItem("pricingToggle" + TileId, false);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    showTileLoader(thisTileELCI, "loader_ELCI");

    if (
      $(thisTileELCI).find('[id^="ELCIPrices"]')[0].firstChild.innerHTML ==
        "-" ||
      $(thisTileELCI).find('[id^="ELCIPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        that,
        "booktradeELCI" + TileId,
        "Please Best Price Before Book Trade, Order Execution Failed!",
        "DivOverlayELCI"
      );
      hideTileLoader(thisTileELCI, "loader_ELCI");

      return false;
    }

    // Check For Negative prices // CFINT-927 // 10-Sep-2020

    if (
      parseFloat(
        JSON.parse($(thisTileELCI).find('[id^="hdnChartPricesELCI"]').val())[0]
          .response
      ) <= 0
    ) {
      booktradePopup(
        that,
        "booktradeELCI" + TileId,
        "Prices can not be negative 0r zero, Order Execution Failed!",
        "DivOverlayELCI"
      );
      hideTileLoader(thisTileELCI, "loader_ELCI");
      return false;
    }
    var Obj = JSON.parse(
      $(thisTileELCI).find('[id^="hdnChartPricesELCI"]').val()
    );
    var ELCI_quoteid = Obj[0].quoteRequestId;

    let clientPriceELCI = Obj[0].response;
    var UpfrontbyIBpriceELCI = 100 - clientPriceELCI;

    let orderObjectELCI = {
      orderQuantity: removeCommaAndDecimal(
        $(thisTileELCI).find('[id^="ContractAmtELCI"]').val()
      ),
      orderType: "",
      limitPrice1: "",
      limitPrice2: "",
      limitPrice3: "",
      limitPrice4: "",
      quoteRequestId: ELCI_quoteid,
      orderComment: "Order Placed from CadB ",
      loginUser: "PratikM",
      margin: "",
      clientPrice: clientPriceELCI,
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
    console.log("ELCI Order object ", orderObjectELCI);
    request_getDataFromAPI(
      orderObjectELCI,
      clientConfigdata.CommonMethods.NodeServer + "ELCIBookOrder"
    )
      .then((bookObject) => {
        console.log("ELCIBookOrder ", bookObject);

        thisTileELCI = document.getElementById("td" + bookObject.CurrentTileID);
        TileId = bookObject.CurrentTileID;
        var bookstring = bookObject.orderPlaceELCIResult.orderID;

        if (bookstring != "" && bookstring != null && bookstring != undefined) {
          var orderplaced =
            "ELCI :: Order Placed Successfully with Order ID: " +
            bookObject.orderPlaceELCIResult.orderID;
          booktradePopup(
            that,
            "booktradeELCI" + TileId,
            orderplaced,
            "DivOverlayELCI"
          );
          hideTileLoader(thisTileELCI, "loader_ELCI");
          // $(thisTileELCI).find('[id^="hdnfinalTokenELCI"]').val("");
        } else {
          booktradePopup(
            that,
            "booktradeELCI" + TileId,
            bookObject.orderPlaceELCIResult.remark,
            "DivOverlayELCI"
          );
          hideTileLoader(thisTileELCI, "loader_ELCI");
        }

        clearInterval($(thisTileELCI).find('[id^="hdnintervalID"]').val());
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (er) {
    console.log(er);
    booktradePopup(
      that,
      "booktradeELCI" + TileId,
      "Please Best Price Before Book Trade, Order Execution Failed!",
      "DivOverlayELCI"
    );
    hideTileLoader(thisTileELCI, "loader_ELCI");
  } finally {
  }
}

// function emailQuoteELCI(that) {
//     try {

//         thisTileELCI= $(that).parents(".sorting")[0];
//         if ($(thisTileELCI).find('[id^="hdnChartPricesELCI"]').val() != undefined)
//             var RFQID = JSON.parse($(thisTileELCI).find('[id^="hdnChartPricesELCI"]').val())[0].EP_ER_QuoteRequestId;

//         if (RFQID != undefined && RFQID != '') {
//             //     MailBestQuote(thisTileELCI.id.match(/\d+$/)[0], JSON.parse($(thisTileELCI).find('[id^="hdnChartPricesELCI"]').val())[0].EP_ER_QuoteRequestId);
//             request_getDataFromAPI({ "userName": sessionStorage.getItem("FinIQUserID").toString(), "rfqId": RFQID, "CurrentTileID": thisTileELCI.id.match(/\d+$/)[0] }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
//                 console.log(data);
//                 TileId = data.CurrentTileID;

//                 thisTileELCI = document.getElementById("td" + TileId)
//                 booktradePopup(thisTileELCI, "booktradeELCI" + TileId, data.message, "DivOverlayELCI");

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
var ELCISharesArray = [];

function loadELCIShares(thisTileELCI, currId) {
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
        product: "ELCI",

        CurrentTileID: $(thisTileELCI).attr("id").match(/\d+$/)[0],
      },
      clientConfigdata.CommonMethods.NodeServer + "getCNSDSharelist"
    ).then((data) => {
      // console.log('CNSD shares ', data.shareResponse.shareList);
      ELCISharesArray = data.shareResponse.shareList;

      callDropDownFunction(
        $(thisTileELCI).find('[id^="shareName"]'),
        "ELCI",
        currId,
        ELCISharesArray
      );
    });
  } catch (error) {
    console.log(error.message);
  }
}
