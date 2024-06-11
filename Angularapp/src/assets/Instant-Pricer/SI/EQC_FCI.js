var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var contractAmt;
var CouponFreq;
var tempShareName;
var arrFCI = [];
var maxFCI;
var finalResponseDataFCI;
var finalTokenFCI;
var repriceObjectFCI;
var TimerFCI = 0;
var finalObjFCI;
var getddlList;
var tenorListFCI = ["1M", "3M", "6M", "9M", "12M"];
var idFCI = 31;
var dateObj = "";
var currentDate = new Date().toShortFormat();
var uniqueRequestID = "CadB_" + Math.random().toFixed(2) * 100;

// To load the FCI tile
function onLoadFCI(currId, isProductCopiedFCI) {
  try {
    // Added logic for getting current tile : Onkar E.//
    setDeafaultValuesFCI(currId, isProductCopiedFCI);
    thisTileFCI = document.getElementById("td" + currId);

    hideTileLoader(thisTileFCI, "loader_FCI");

    //loadFCIShares(thisTileFCI, currId);

    fillDropdownlistControl(
      tenorListFCI,
      $(thisTileFCI).find('[id^="tenor_FCI"]').attr("id")
    );
    document.querySelector(
      "#" + $(thisTileFCI).find('[id^="tenor_FCI"]').attr("id")
    ).selectedIndex = 3;

    $(thisTileFCI)
      .find("div.card input[type='text'],div.card input[type='search'],div.card select")
      .on("change", function () {
        thisTileFCI = $(this).parents(".sorting")[0];
        clearInterval($(thisTileFCI).find('[id^="hdnintervalID"]').val());
        clearPricerTable(thisTileFCI);
      });

    $(thisTileFCI)
      .find("div.card input[type='text'],div.card input[type='search'],div.card select,div.card .ddlShares")
      .on("select", function () {
        thisTileFCI = $(this).parents(".sorting")[0];
        clearInterval($(thisTileFCI).find('[id^="hdnintervalID"]').val());
        clearPricerTable(thisTileFCI);
      });

    $(thisTileFCI)
      .find('[id^="ddlKOKIType"]')
      .on("change", function () {
        try {
          thisTileFCI = $(this).parents(".sorting")[0];
          validation_clear(); //To Remove highlighted part if no error
          // checkKOKITypeFCI($(thisTileFCI).find('[id^="ddlKOKIType"]').val().trim(), thisTileFCI);
        } catch (error) {
          console.log(error.message);
        }
      });
    checkSolveForFCI(
      $(thisTileFCI).find('[id^="ddlSolveForFCI"]').val(),
      thisTileFCI
    );
    $(thisTileFCI)
      .find('[id^="ddlSolveForFCI"]')
      .on("change", function (event) {
        thisTileFCI = $(this).parents(".sorting")[0];
        checkSolveForFCI($(this).val(), thisTileFCI);
      });

    shareCount = 0;
    $(thisTileFCI)
      .find('[id^="shareDivFCI"]')
      .click(function () {
        $(this).find('input[type="search"]').focus();
      });

    $("div.card input,div.card select").change(function () {
      // console.log('change event called RESET')
      thisTileFCI = $(this).parents(".sorting")[0];
      clearInterval($(thisTileFCI).find('[id^="hdnintervalID"]').val());
      clearPricerTable(thisTileFCI);
      hideTileLoader(thisTileFCI, "loader_FCI");
      return false;
    });
    callDropDownFunction(
      $(thisTileFCI).find('[id^="shareName"]'),
      "FCI",
      currId
    );
  } catch (error) {
    console.log(error.message);
  }
}
// To set default values for FCI
function setDeafaultValuesFCI(currId, isProductCopiedFCI) {
  try {
    // Added logic for getting current tile : Onkar E.//
    thisTileFCI = document.getElementById("td" + currId);

    $(thisTileFCI).find('[id^="ContractAmt"]').val("1,000,000.00");
    $(thisTileFCI).find('[id^="upfrontipbox"]').val("0.55");
    $(thisTileFCI).find('[id^="couponinputbox"]').val("5.00");
    $(thisTileFCI).find('[id^="strikeinbox"]').val("90.00");

    $(thisTileFCI).find('[id^="kiinputbox"]').val("75.00");
    $(thisTileFCI).find('[id^="koinputbox"]').val("115.00");
    $(thisTileFCI).find('[id^="KOStepDowninputbox"]').val("115.00");
    $(thisTileFCI).find('[id^="FundingRateinputbox"]').val("15.9823");

    fillDropdownlistControl(
      tenorListFCI,
      $(thisTileFCI).find('[id^="tenor_FCI"]').attr("id")
    );
    document.querySelector(
      "#" + $(thisTileFCI).find('[id^="tenor_FCI"]').attr("id")
    ).selectedIndex = 3;
    EQProductsFillCcy(thisTileFCI, "ddlFCICcy");

    clearPricerTable(thisTileFCI);
    $(thisTileFCI).find('[id^="shareNameCntrlFCI"]').html("");
    $(thisTileFCI).find('[id^="hiddenshareinputFCI"]').html("");
    $(thisTileFCI).find('[id^="CCY_FCI"]').html("");
    //inputsharebasket(currId, "FCI", ($(thisTileFCI).find('[id^="shareName"]')));
    // createElementInBasket(thisTileFCI, 'shareDivFCI', sessionStorage.getItem(thisTileFCI.id) != undefined ? sessionStorage.getItem(thisTileFCI.id).split(" ")[0] : 'AAPL.OQ');
    // createElementInBasket(thisTileFCI, 'shareDivFCI', sessionStorage.getItem(thisTileFCI.id) != undefined ? sessionStorage.getItem(thisTileFCI.id).split(" ")[1] : 'GOOG.OQ');
    // createElementInBasket(thisTileFCI, 'shareDivFCI', sessionStorage.getItem(thisTileFCI.id) != undefined ? sessionStorage.getItem(thisTileFCI.id).split(" ")[2] : 'FB.OQ');

    if (!isProductCopiedFCI) {
      for (
        let s = 0;
        s < clientConfigdata.EQCCommonMethods.MinSharesInBaskets;
        s++
      ) {
        createElementInBasket(
          thisTileFCI,
          "shareDivFCI",
          sessionStorage.getItem(thisTileFCI.id) != undefined
            ? sessionStorage.getItem(thisTileFCI.id).split(" ")[s]
            : globalDefaultSharesArray[s]
        );
      }
    }

    $(thisTileFCI).find('[id^="shareName"]')[0].placeholder = "";
    $(thisTileFCI)
      .find('[id^="CCY_FCI"]')
      .html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);
  } catch (error) {
    console.log(error.message);
  }
}
function checkSolveForFCI(solveFor, thisTileFCI) {
  try {
    if (solveFor.trim() == "COUPON") {
      $(thisTileFCI)
        .find('[id^="upfrontipbox"]')
        .val("0.55")
        .prop("disabled", false);
      $(thisTileFCI)
        .find('[id^="couponinputbox"]')
        .val("")
        .prop("disabled", true);
      $(thisTileFCI)
        .find('[id^="strikeinbox"]')
        .val("100.00")
        .prop("disabled", false);
      $(thisTileFCI)
        .find('[id^="kiinputbox"]')
        .val("75.00")
        .prop("disabled", false);
    } else if (solveFor.trim() == "KNOCKIN_BARRIER") {
      $(thisTileFCI)
        .find('[id^="upfrontipbox"]')
        .val("0.55")
        .prop("disabled", false);
      $(thisTileFCI)
        .find('[id^="couponinputbox"]')
        .val("5.00")
        .prop("disabled", false);
      $(thisTileFCI)
        .find('[id^="strikeinbox"]')
        .val("100.00")
        .prop("disabled", false);
      $(thisTileFCI).find('[id^="kiinputbox"]').val("").prop("disabled", true);
    } else if (solveFor.trim() == "CONVERSION_STRIKE") {
      $(thisTileFCI)
        .find('[id^="upfrontipbox"]')
        .val("0.55")
        .prop("disabled", false);
      $(thisTileFCI)
        .find('[id^="couponinputbox"]')
        .val("5.00")
        .prop("disabled", false);
      $(thisTileFCI).find('[id^="strikeinbox"]').val("").prop("disabled", true);
      $(thisTileFCI)
        .find('[id^="kiinputbox"]')
        .val("75.00")
        .prop("disabled", false);
    } else if (solveFor.trim() == "UPFRONT") {
      $(thisTileFCI)
        .find('[id^="upfrontipbox"]')
        .val("")
        .prop("disabled", true);
      $(thisTileFCI)
        .find('[id^="couponinputbox"]')
        .val("5.00")
        .prop("disabled", false);
      $(thisTileFCI)
        .find('[id^="strikeinbox"]')
        .val("100.00")
        .prop("disabled", false);
      $(thisTileFCI)
        .find('[id^="kiinputbox"]')
        .val("75.00")
        .prop("disabled", false);
    }
  } catch (error) {}
}

// To get best price for FCI
function getBestPriceFCI(that) {
  try {
    // Added logic for getting current tile : Onkar E.//

    //    var uniqueIntervalID;
    thisTileFCI = $(that).parents(".sorting")[0];
    // console.log('Start Interval value =' + $(thisTileFCI).find('[id^="hdnintervalID"]').val());

    clearInterval($(thisTileFCI).find('[id^="hdnintervalID"]').val());
    // console.log('After clear Interval value =' + $(thisTileFCI).find('[id^="hdnintervalID"]').val());

    $(thisTileFCI).find('[id^="hdnintervalID"]').val("");

    TileId = that.id.match(/\d+$/)[0];

    sessionStorage.setItem("poolingTimer_" + TileId, 0);
    sessionStorage.setItem("pricingToggle" + TileId, false);
    thisTileFCI = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    console.log(TileId, thisTileFCI, productName);
    getddlList = $.trim($(thisTileFCI).find('[id^="ddlKOKIType"]').val());

    $(thisTileFCI)
      .find('[id^="TBLFCI"]' + " td")
      .each(function () {
        $(this).html("-");
      });
    validation_clear();
    clearPricerTable(thisTileFCI);

    if ($(thisTileFCI).find('[id^="shareDivFCI"]')[0].childNodes.length == 3) {
      ValidateField(
        $(thisTileFCI).find('[id^="shareDivFCI"]').attr("id"),
        "Please Enter Valid Shares",
        thisTileFCI
      );
      return false;
    } else if (
      $.trim($(thisTileFCI).find('[id^="ContractAmt"]').val()) == "" ||
      parseFloat($(thisTileFCI).find('[id^="ContractAmt"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileFCI).find('[id^="ContractAmt"]').attr("id"),
        "Please Enter Valid Contract Amount",
        thisTileFCI
      );
      return false;
    } else if ($.trim($(thisTileFCI).find('[id^="tenor_FCI"]').val()) == "") {
      ValidateField(
        $(thisTileFCI).find('[id^="tenor_FCI"]').attr("id"),
        "Please Enter Valid tenor",
        thisTileFCI
      );
      return false;
    } else if (
      $.trim($(thisTileFCI).find('[id^="FundingRateinputbox"]').val()) == "" ||
      $.trim($(thisTileFCI).find('[id^="FundingRateinputbox"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileFCI).find('[id^="FundingRateinputbox"]').attr("id"),
        "Please Enter Valid Funding Spread",
        thisTileFCI
      );
      return false;
    } else if (
      $.trim($(thisTileFCI).find('[id^="KOStepDowninputbox"]').val()) == "" ||
      $.trim($(thisTileFCI).find('[id^="KOStepDowninputbox"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileFCI).find('[id^="KOStepDowninputbox"]').attr("id"),
        "Please Enter Valid KO Stepdown(%)",
        thisTileFCI
      );
      return false;
    } else if (
      $.trim($(thisTileFCI).find('[id^="koinputbox"]').val()) == "" ||
      $.trim($(thisTileFCI).find('[id^="koinputbox"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileFCI).find('[id^="koinputbox"]').attr("id"),
        "Please Enter Valid KO(%)",
        thisTileFCI
      );
      return false;
    }

    if (
      $(thisTileFCI)
        .find('[id^="ddlSolveForFCI"]')
        .val()
        .split("(")[0]
        .trim()
        .toUpperCase() == "CONVERSION_STRIKE"
    ) {
      if (
        parseFloat($(thisTileFCI).find('[id^="upfrontipbox"]').val()) == "" ||
        parseFloat($(thisTileFCI).find('[id^="upfrontipbox"]').val()) <= 0 ||
        parseFloat($(thisTileFCI).find('[id^="upfrontipbox"]').val()) > 1000
      ) {
        ValidateField(
          $(thisTileFCI).find('[id^="upfrontipbox"]').attr("id"),
          "Please Enter Valid Upfront(%)",
          thisTileFCI
        );
        return false;
      } else if (
        parseFloat($(thisTileFCI).find('[id^="couponinputbox"]').val()) == "" ||
        parseFloat($(thisTileFCI).find('[id^="couponinputbox"]').val()) <= 0 ||
        parseFloat($(thisTileFCI).find('[id^="couponinputbox"]').val()) >= 1000
      ) {
        ValidateField(
          $(thisTileFCI).find('[id^="couponinputbox"]').attr("id"),
          "Please Enter Valid Coupon(%)",
          thisTileFCI
        );
        return false;
      } else if (
        $(thisTileFCI).find('[id^="kiinputbox"]').val() == "" ||
        $(thisTileFCI).find('[id^="kiinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileFCI).find('[id^="kiinputbox"]').attr("id"),
          "Please Enter Valid KI % Of Initial",
          thisTileFCI
        );
        return false;
      }
    } else if (
      $(thisTileFCI)
        .find('[id^="ddlSolveForFCI"]')
        .val()
        .split("(")[0]
        .trim()
        .toUpperCase() == "COUPON"
    ) {
      if (
        parseFloat($(thisTileFCI).find('[id^="upfrontipbox"]').val()) == "" ||
        parseFloat($(thisTileFCI).find('[id^="upfrontipbox"]').val()) <= 0 ||
        parseFloat($(thisTileFCI).find('[id^="upfrontipbox"]').val()) > 1000
      ) {
        ValidateField(
          $(thisTileFCI).find('[id^="upfrontipbox"]').attr("id"),
          "Please Enter Valid Upfront(%)",
          thisTileFCI
        );
        return false;
      } else if (
        $(thisTileFCI).find('[id^="strikeinbox"]').val() == "" ||
        $(thisTileFCI).find('[id^="strikeinbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileFCI).find('[id^="strikeinbox"]').attr("id"),
          "Please Enter Valid Strike(%)",
          thisTileFCI
        );
        return false;
      } else if (
        $(thisTileFCI).find('[id^="kiinputbox"]').val() == "" ||
        $(thisTileFCI).find('[id^="kiinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileFCI).find('[id^="kiinputbox"]').attr("id"),
          "Please Enter Valid KI % Of Initial",
          thisTileFCI
        );
        return false;
      }
    } else if (
      $(thisTileFCI)
        .find('[id^="ddlSolveForFCI"]')
        .val()
        .split("(")[0]
        .trim()
        .toUpperCase() == "UPFRONT"
    ) {
      if (
        $(thisTileFCI).find('[id^="strikeinbox"]').val() == "" ||
        $(thisTileFCI).find('[id^="strikeinbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileFCI).find('[id^="strikeinbox"]').attr("id"),
          "Please Enter Valid Strike(%)",
          thisTileFCI
        );
        return false;
      } else if (
        parseFloat($(thisTileFCI).find('[id^="couponinputbox"]').val()) == "" ||
        parseFloat($(thisTileFCI).find('[id^="couponinputbox"]').val()) <= 0 ||
        parseFloat($(thisTileFCI).find('[id^="couponinputbox"]').val()) >= 1000
      ) {
        ValidateField(
          $(thisTileFCI).find('[id^="couponinputbox"]').attr("id"),
          "Please Enter Valid Coupon(%)",
          thisTileFCI
        );
        return false;
      } else if (
        $(thisTileFCI).find('[id^="kiinputbox"]').val() == "" ||
        $(thisTileFCI).find('[id^="kiinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileFCI).find('[id^="kiinputbox"]').attr("id"),
          "Please Enter Valid KI % Of Initial",
          thisTileFCI
        );
        return false;
      }
    } else if (
      $(thisTileFCI)
        .find('[id^="ddlSolveForFCI"]')
        .val()
        .split("(")[0]
        .trim()
        .toUpperCase() == "KNOCKIN_BARRIER"
    ) {
      if (
        parseFloat($(thisTileFCI).find('[id^="upfrontipbox"]').val()) == "" ||
        parseFloat($(thisTileFCI).find('[id^="upfrontipbox"]').val()) <= 0 ||
        parseFloat($(thisTileFCI).find('[id^="upfrontipbox"]').val()) > 1000
      ) {
        ValidateField(
          $(thisTileFCI).find('[id^="upfrontipbox"]').attr("id"),
          "Please Enter Valid Upfront(%)",
          thisTileFCI
        );
        return false;
      } else if (
        parseFloat($(thisTileFCI).find('[id^="couponinputbox"]').val()) == "" ||
        parseFloat($(thisTileFCI).find('[id^="couponinputbox"]').val()) <= 0 ||
        parseFloat($(thisTileFCI).find('[id^="couponinputbox"]').val()) >= 1000
      ) {
        ValidateField(
          $(thisTileFCI).find('[id^="couponinputbox"]').attr("id"),
          "Please Enter Valid Coupon(%)",
          thisTileFCI
        );
        return false;
      } else if (
        $(thisTileFCI).find('[id^="strikeinbox"]').val() == "" ||
        $(thisTileFCI).find('[id^="strikeinbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileFCI).find('[id^="strikeinbox"]').attr("id"),
          "Please Enter Valid Strike(%)",
          thisTileFCI
        );
        return false;
      }
    }

    setTimeout("$(thisTileFCI).find('[id^=\"loader_FCI\"]').show();", 200);

    //$(thisTileFCI).find('[id^="BookTradeFCI"]').attr("disabled", true); // Disabling book trade button while pricing is happening - by Onkar E. 25/11/2019
    $("body").css("opacity", "0.9");

    let exchangeList = getExchangeAndCcyFromBasket(
      $(thisTileFCI).find('[id^="shareDivFCI"]')[0],
      "exchange",
      undefined
    );
    let ccyList = getExchangeAndCcyFromBasket(
      $(thisTileFCI).find('[id^="shareDivFCI"]')[0],
      "ccy",
      undefined
    );
    let shareList = getExchangeAndCcyFromBasket(
      $(thisTileFCI).find('[id^="shareDivFCI"]')[0],
      "share",
      undefined
    );

    FCIQuoteObject = {
      OfferPrice: "99",
      Branch: "",
      CashCurrency: $(thisTileFCI).find('[id^="ddlFCICcy"]').val(),
      CashOrderQuantity: Number(
        removeCommaAndDecimal($(thisTileFCI).find('[id^="ContractAmt"]').val())
      ),
      CouponMemory_YN: "Y",
      CouponPercentage: $(thisTileFCI).find('[id^="couponinputbox"]').val(),
      LoginID: "PratikM",
      EntityName: "CFS SG",
      Entity_ID: 30,
      exchange1: exchangeList[0],
      exchange2: exchangeList[1],
      exchange3: exchangeList[2],
      exchange4: exchangeList[3],
      ExpiryDate: "04-Nov-2021",
      FundingRate: $(thisTileFCI).find('[id^="funding"]').val(),
      GuaranteedDuration: "1",
      Host: "PratikM",
      Issuer_Date_Offset: "14",
      KI_Level: $(thisTileFCI).find('[id^="kiinputbox"]').val(),
      obsFrequency: "MONTHLY",
      KI_Type: "MONTHLY",
      KO_Level: $(thisTileFCI).find('[id^="koinputbox"]').val(),
      KO_Type: "DAILYCLOSE",
      MaturityDate: "11-Nov-2021",
      NoncallDuration: 0,
      PaymentLag: 2,
      Ppdetails: "1,2,4,5,7,9,10,11,14,18", //Asked by Chitralekha, 05-Jul-22
      SettlementDate: "04-May-2021",
      SolveFor: $(thisTileFCI).find('[id^="ddlSolveForFCI"]').val(),
      Spread: "-" + $(thisTileFCI).find('[id^="FundingRateinputbox"]').val(),
      StepDown: "2",
      StrikePercentage: $(thisTileFCI).find('[id^="strikeinbox"]').val(),
      Tenor: parseFloat($(thisTileFCI).find('[id^="tenor_FCI"]').val()),
      TenorType: "MONTH",
      TradeDate: "20-Apr-2021",
      Type: "FCSWAP",
      underlyingCode1: shareList[0],
      underlyingCode2: shareList[1],
      underlyingCode3: shareList[2],
      underlyingCode4: shareList[3],
      Upfront: $(thisTileFCI).find('[id^="upfrontipbox"]').val(),
      CurrentTileID: TileId,
    };

    console.log("FCI quote ", FCIQuoteObject);

    getQuoteFCI(
      FCIQuoteObject,
      $(thisTileFCI).find('[id^="hdnintervalID"]')[0]
    );
    //  })
  } catch (er) {
    console.log(er.message);
  }
}
var priceProviderArray_FCI = [];

// To get quote
function getQuoteFCI(FCIQuoteObject, uniqueIntervalID) {
  try {
    var dataFCI = request_getDataFromAPI(
      FCIQuoteObject,
      clientConfigdata.CommonMethods.NodeServer + "getBestPriceFCI"
    )
      .then((dataFCI) => {
        console.log("quote response ", dataFCI);
        if (dataFCI.body == "") {
          clearInterval($(thisTileFCI).find('[id^="hdnintervalID"]').val());
          hideTileLoader(thisTileFCI, "loader_FCI");

          return false;
        }
        priceProviderArray_FCI = [];

        for (var x of dataFCI.body.split(",")) {
          priceProviderArray_FCI.push({ rfqID: x });
        }

        thisTileFCI = document.getElementById("td" + dataFCI.CurrentTileID);
        sessionStorage.setItem("pricingToggle" + dataFCI.CurrentTileID, true);

        getUniqQuoteResponseFCI(
          priceProviderArray_FCI,
          thisTileFCI,
          dataFCI,
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

function getUniqQuoteResponseFCI(
  priceProviderArray_FCI,
  thisTileFCI,
  dataFCI,
  uniqueIntervalID
) {
  try {
    var UIID = null;

    uniqueIntervalID.value = setInterval(function () {
      console.log("priceProviderArray_FCI", priceProviderArray_FCI);
      getFinalQuoteResponseFCI(
        priceProviderArray_FCI,
        "",
        "",
        thisTileFCI,
        uniqueIntervalID
      );
    }, clientConfigdata.EQCFCI.PollInterval);
  } catch (error) {
    console.log(error);
  }
}

// To get price

function getFinalQuoteResponseFCI(
  priceProviderArray_FCI,
  finalTokenFCI1,
  finalResponseDataFCI1,
  thisTileFCI,
  uniqueIntervalID
) {
  try {
    var currentDateAndTime = new Date();

    console.log(
      "FCI RFQ's :: " + finalResponseDataFCI1 + " " + currentDateAndTime
    );
    Timer = Timer + 1;

    if (
      Number(
        sessionStorage.getItem(
          "poolingTimer_" + thisTileFCI.id.match(/\d+$/)[0]
        )
      ) >= clientConfigdata.EQCFCI.PoolTimer ||
      sessionStorage.getItem(
        "pricingToggle" + thisTileFCI.id.match(/\d+$/)[0]
      ) == "false"
    ) {
      $(thisTileFCI).find('[id^="BookTradeFCI"]').attr("disabled", false); // Enabling book trade button when pricing is over - by Onkar E. 25/11/2019
      clearInterval(uniqueIntervalID.value);
      uniqueIntervalID.value = "";
      QuoteObject = "";
      hideTileLoader(thisTileFCI, "loader_FCI");
      $(thisTileFCI)
        .find('[id^="hdnChartPricesFCI"]')
        .val(JSON.stringify(finalObjFCI));
      $("body").css("opacity", "");
      arrFCI = [];
      maxFCI = "";
      TimerFCI = 0;
      //Call Draw Graph
      if (finalObjFCI != null || finalObjFCI != undefined) {
        // drawgraphFCI($(thisTileFCI).find('[id^="canvas"]').attr('id'));
      }

      return false;
    } else {
      var repriceObjectFCI = request_getDataFromAPI(
        {
          userID: "PratikM",
          rfqDetails: priceProviderArray_FCI,
          CurrentTileID: $(thisTileFCI).attr("id").match(/\d+$/)[0],
        },
        clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseSI"
      )
        .then((repriceObjectFCI) => {
          console.log("FCI quote response ", repriceObjectFCI);

          thisTileFCI = document.getElementById(
            "td" + repriceObjectFCI.CurrentTileID
          );
          sessionStorage.setItem(
            "poolingTimer_" + repriceObjectFCI.CurrentTileID,
            Number(
              sessionStorage.getItem(
                "poolingTimer_" + thisTileFCI.id.match(/\d+$/)[0]
              )
            ) + 1
          );
          finalObjFCI = repriceObjectFCI.quoteresponses;
          console.log("snow ball price object before sort", finalObjFCI);
          // added by AniruddhaJ for upfront calculatation START
          if (
            $(thisTileFCI).find('[id^="ddlSolveForFCI"]').val().trim() ===
            "UPFRONT"
          ) {
            for (let priceFCI of finalObjFCI) {
              priceFCI.response = (Number(priceFCI.response) / 100)
                .toFixed(2)
                .toString();
            }
          }
          //End
          // // Sorted By Best Price LP'S

          finalObjFCI.sort(function (a, b) {
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
              $(thisTileFCI).find('[id^="ddlSolveForFCI"]').val() == "COUPON" ||
              $(thisTileFCI).find('[id^="ddlSolveForFCI"]').val() ==
                "KO_COUPON" ||
              $(thisTileFCI).find('[id^="ddlSolveForFCI"]').val() == "UPFRONT"
            ) {
              return Number(a.response) > Number(b.response) ? -1 : 1;
            } else {
              return Number(a.response) < Number(b.response) ? -1 : 1;
            }
          });
          maxFCI = finalObjFCI[0].response;
          $(thisTileFCI)
            .find('[id^="hdnChartPricesFCI"]')
            .val(JSON.stringify(finalObjFCI));
          console.log("snow ball price object after sort", finalObjFCI);

          //   $(thisTileFCI).find('[id^="hdnfinalTokenFCI"]').val(sessionStorage.getItem("quoteToken_" + thisTileFCI.id.match(/\d+$/)[0]));

          if (
            sessionStorage.getItem(
              "pricingToggle" + thisTileFCI.id.match(/\d+$/)[0]
            ) == "true"
          ) {
            $(thisTileFCI).find('[id^="FCIBanksRow"]').empty();
            $(thisTileFCI).find('[id^="FCIPrices"]').empty();
            $(finalObjFCI).each(function (i, elem) {
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
                $(thisTileFCI).find('[id^="FCIBanksRow"]').append(str);
              } else {
                str = str + "<td>--</td>";
                $(thisTileFCI).find('[id^="FCIBanksRow"]').append(str);
              }
              if (
                elem.response != null &&
                elem.response.trim() !== "NaN" &&
                elem.response.trim().toUpperCase() != "REJECTED" &&
                elem.response != "" &&
                parseFloat(elem.response) != 0
              ) {
                if (maxFCI == elem.response) {
                  str2 =
                    str2 +
                    "<td class='" +
                    priceClass +
                    "'>" +
                    parseFloat(elem.response).toFixed(2) +
                    "</td>";
                  $(thisTileFCI).find('[id^="FCIPrices"]').append(str2);
                } else {
                  str2 =
                    str2 +
                    "<td class=''>" +
                    parseFloat(elem.response).toFixed(2) +
                    "</td>";
                  $(thisTileFCI).find('[id^="FCIPrices"]').append(str2);
                }
              } else {
                str2 = str2 + "<td>-</td>";
                $(thisTileFCI).find('[id^="FCIPrices"]').append(str2);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          hideTileLoader(thisTileFCI, "loader_FCI");
          $(thisTileFCI)
            .find('[id^="hdnChartPricesFCI"]')
            .val(JSON.stringify(finalObjFCI));
          if (finalObjFCI != null || finalObjFCI != undefined) {
            //     drawgraphFCI($(thisTileFCI).find('[id^="canvas"]').attr('id'));
          }
        });
    }
  } catch (error) {
    console.log("getFinalQuoteResponseFCI : " + error.message);
    $(thisTileFCI)
      .find('[id^="hdnChartPricesFCI"]')
      .val(JSON.stringify(finalObjFCI));
    window.clearInterval(uniqueIntervalID.value);
    uniqueIntervalID.value = "";
    hideTileLoader(thisTileFCI, "loader_FCI");
    $(thisTileFCI).find('[id^="BookTradeFCI"]').attr("disabled", false);
    if (finalObjFCI != null || finalObjFCI != undefined) {
      //  drawgraphFCI($(thisTileFCI).find('[id^="canvas"]').attr('id'));
    }
    //  sessionStorage.setItem("quoteToken_" + thisTileFCI.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileFCI.id.match(/\d+$/)[0]));

    //  sessionStorage.setItem("quoteResponse_" + thisTileFCI.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileFCI.id.match(/\d+$/)[0]));
  } finally {
    $(thisTileFCI).find('[id^="BookTradeFCI"]').attr("disabled", false);
  }
}

// To book trade
function booktradeFCI(that) {
  try {
    // Added logic for getting current tile : Onkar E.//
    TileId = that.id.match(/\d+$/)[0];
    thisTileFCI = document.getElementById("td" + TileId);
    sessionStorage.setItem("pricingToggle" + TileId, false);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    showTileLoader(thisTileFCI, "loader_FCI");

    if (
      $(thisTileFCI).find('[id^="FCIPrices"]')[0].firstChild.innerHTML == "-" ||
      $(thisTileFCI).find('[id^="FCIPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        that,
        "booktradeFCI" + TileId,
        "Please Best Price Before Book Trade, Order Execution Failed!",
        "DivOverlayFCI"
      );
      hideTileLoader(thisTileFCI, "loader_FCI");

      return false;
    }

    // Check For Negative prices // CFINT-927 // 10-Sep-2020

    if (
      parseFloat(
        JSON.parse($(thisTileFCI).find('[id^="hdnChartPricesFCI"]').val())[0]
          .response
      ) <= 0
    ) {
      booktradePopup(
        that,
        "booktradeFCI" + TileId,
        "Prices can not be negative 0r zero, Order Execution Failed!",
        "DivOverlayFCI"
      );
      hideTileLoader(thisTileFCI, "loader_FCI");
      return false;
    }

    var Obj = JSON.parse(
      $(thisTileFCI).find('[id^="hdnChartPricesFCI"]').val()
    );
    var FCI_quoteid = Obj[0].quoteRequestId;

    let clientPriceFCI = Obj[0].response;
    var UpfrontbyIBpriceFCI = 100 - clientPriceFCI;

    // console.log('tranche created ', dataTranche);
    // thisTileFCI = document.getElementById("td" + dataTranche.CurrentTileID);

    Obj = JSON.parse($(thisTileFCI).find('[id^="hdnChartPricesFCI"]').val());

    FCI_quoteid = Obj[0].quoteRequestId;

    clientPriceFCI = Obj[0].response;

    let orderObjectFCI = {
      orderQuantity: removeCommaAndDecimal(
        $(thisTileFCI).find('[id^="ContractAmt"]').val()
      ),
      orderType: "",
      limitPrice1: "",
      limitPrice2: "",
      limitPrice3: "",
      limitPrice4: "",
      quoteRequestId: FCI_quoteid,
      orderComment: "Order Placed from CadB ",
      loginUser: "PratikM",
      margin: "",
      clientPrice: clientPriceFCI,
      clientYield: "",
      bookingBranch: "",
      RMNameforOrderConfirm: "",
      RMEmailIdforOrderConfirm: "",
      confirmReason: "",
      advisoryReason: "",
      prefImprov: "",
      entityCode: "CFSSG",
      customerID: "1065474",
      CurrentTileID: TileId,
    };
    console.log("FCI Order object ", orderObjectFCI);

    request_getDataFromAPI(
      orderObjectFCI,
      clientConfigdata.CommonMethods.NodeServer + "FCIBookOrder"
    )
      .then((bookObject) => {
        console.log("FCIBookOrder ", bookObject);

        thisTileFCI = document.getElementById("td" + bookObject.CurrentTileID);
        TileId = bookObject.CurrentTileID;

        var bookstring = bookObject.orderPlaceFCIResult.orderID;

        if (bookstring != "" && bookstring != null && bookstring != undefined) {
          var orderplaced =
            "FCI :: Order Placed Successfully with Order ID: " +
            bookObject.orderPlaceFCIResult.orderID;
          booktradePopup(
            that,
            "booktradeFCI" + TileId,
            orderplaced,
            "DivOverlayFCI"
          );
          hideTileLoader(thisTileFCI, "loader_FCI");
          // $(thisTileFCI).find('[id^="hdnfinalTokenFCI"]').val("");
        } else {
          booktradePopup(
            that,
            "booktradeFCI" + TileId,
            bookObject.orderPlaceFCIResult.remark,
            "DivOverlayFCI"
          );
          hideTileLoader(thisTileFCI, "loader_FCI");
        }

        clearInterval($(thisTileFCI).find('[id^="hdnintervalID"]').val());
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (er) {
    console.log(er);
    booktradePopup(
      that,
      "booktradeFCI" + TileId,
      "Please Best Price Before Book Trade, Order Execution Failed!",
      "DivOverlayFCI"
    );
    hideTileLoader(thisTileFCI, "loader_FCI");
  } finally {
  }
}

// function emailQuoteFCI(that) {
//     try {

//         thisTileFCI= $(that).parents(".sorting")[0];
//         if ($(thisTileFCI).find('[id^="hdnChartPricesFCI"]').val() != undefined)
//             var RFQID = JSON.parse($(thisTileFCI).find('[id^="hdnChartPricesFCI"]').val())[0].EP_ER_QuoteRequestId;

//         if (RFQID != undefined && RFQID != '') {
//             //     MailBestQuote(thisTileFCI.id.match(/\d+$/)[0], JSON.parse($(thisTileFCI).find('[id^="hdnChartPricesELN"]').val())[0].EP_ER_QuoteRequestId);
//             request_getDataFromAPI({ "userName": sessionStorage.getItem("FinIQUserID").toString(), "rfqId": RFQID, "CurrentTileID": thisTileFCI.id.match(/\d+$/)[0] }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
//                 console.log(data);
//                 TileId = data.CurrentTileID;

//                 thisTileFCI = document.getElementById("td" + TileId)
//                 booktradePopup(thisTileFCI, "booktradeFCI" + TileId, data.message, "DivOverlayFCI");

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
var FCISharesArray = [];

// function loadFCIShares(thisTileFCI, currId) {
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
//             "product": "FCI",

//             "CurrentTileID": $(thisTileFCI).attr("id").match(/\d+$/)[0]

//         }, clientConfigdata.CommonMethods.NodeServer + "getCNSDSharelist").then(data => {

//            // console.log('CNSD shares ', data.shareResponse.shareList);
//             FCISharesArray = data.shareResponse.shareList;

//             callDropDownFunction($(thisTileFCI).find('[id^="shareName"]'), "FCI", currId, FCISharesArray);

//         })
//     } catch (error) {
//         console.log(error.message);

//     }
// }
