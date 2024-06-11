var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var contractAmt;
var CouponFreq;
var tempShareName;
var arrBEI = [];
var maxBEI;
var finalResponseDataBEI;
var finalTokenBEI;
var repriceObjectBEI;
var TimerBEI = 0;
var finalObjBEI;
var getddlList;
var tenorListBEI = ["1M", "3M", "6M", "9M", "12M"];
var idBEI = 29;
var dateObj = "";
var currentDate = new Date().toShortFormat();
var uniqueRequestID = "CadB_" + Math.random().toFixed(2) * 100;

// To load the BEI tile
function onLoadBEI(currId, isProductCopiedBEI) {
  try {
    // Added logic for getting current tile : Onkar E.//
    setDeafaultValuesBEI(currId, isProductCopiedBEI);
    thisTileBEI = document.getElementById("td" + currId);

    hideTileLoader(thisTileBEI, "loader_BEI");

    fillDropdownlistControl(
      tenorListBEI,
      $(thisTileBEI).find('[id^="tenor_BEI"]').attr("id")
    );
    document.querySelector(
      "#" + $(thisTileBEI).find('[id^="tenor_BEI"]').attr("id")
    ).selectedIndex = 3;

    $(thisTileBEI)
      .find("div.card input[type='text'],div.card input[type='search'],div.card select")
      .on("change", function () {
        thisTileBEI = $(this).parents(".sorting")[0];
        clearInterval($(thisTileBEI).find('[id^="hdnintervalID"]').val());
        clearPricerTable(thisTileBEI);
      });

    $(thisTileBEI)
      .find("div.card input[type='text'],div.card input[type='search'],div.card select,div.card .ddlShares")
      .on("select", function () {
        thisTileBEI = $(this).parents(".sorting")[0];
        clearInterval($(thisTileBEI).find('[id^="hdnintervalID"]').val());
        clearPricerTable(thisTileBEI);
      });

    $(thisTileBEI)
      .find('[id^="ddlKOKIType"]')
      .on("change", function () {
        try {
          thisTileBEI = $(this).parents(".sorting")[0];
          validation_clear(); //To Remove highlighted part if no error
          // checkKOKITypeBEI($(thisTileBEI).find('[id^="ddlKOKIType"]').val().trim(), thisTileBEI);
        } catch (error) {
          console.log(error.message);
        }
      });
    checkSolveForBEI(
      $(thisTileBEI).find('[id^="ddlSolveForBEI"]').val(),
      thisTileBEI
    );
    $(thisTileBEI)
      .find('[id^="ddlSolveForBEI"]')
      .on("change", function (event) {
        thisTileBEI = $(this).parents(".sorting")[0];
        checkSolveForBEI($(this).val(), thisTileBEI);
      });

    shareCount = 0;
    $(thisTileBEI)
      .find('[id^="shareDivBEI"]')
      .click(function () {
        $(this).find('input[type="search"]').focus();
      });

    $("div.card input,div.card select").change(function () {
      // console.log('change event called RESET')
      thisTileBEI = $(this).parents(".sorting")[0];
      clearInterval($(thisTileBEI).find('[id^="hdnintervalID"]').val());
      clearPricerTable(thisTileBEI);
      hideTileLoader(thisTileBEI, "loader_BEI");
      return false;
    });

    callDropDownFunction(
      $(thisTileBEI).find('[id^="shareName"]'),
      "BEI",
      currId
    );
  } catch (error) {
    console.log(error.message);
  }
}
// To set default values for BEI
function setDeafaultValuesBEI(currId, isProductCopiedBEI) {
  try {
    // Added logic for getting current tile : Onkar E.//
    thisTileBEI = document.getElementById("td" + currId);

    $(thisTileBEI).find('[id^="ContractAmt"]').val("1,000,000.00");
    $(thisTileBEI).find('[id^="couponipbox"]').val("8.00");

    $(thisTileBEI).find('[id^="couponinputbox"]').val("7.00");
    $(thisTileBEI).find('[id^="strikeinbox"]').val("90.00");
    $(thisTileBEI).find('[id^="upfrontipbox"]').val("1.50");
    $(thisTileBEI).find('[id^="Floorinputbox"]').val("0.50");

    fillDropdownlistControl(
      tenorListBEI,
      $(thisTileBEI).find('[id^="tenor_BEI"]').attr("id")
    );
    document.querySelector(
      "#" + $(thisTileBEI).find('[id^="tenor_BEI"]').attr("id")
    ).selectedIndex = 3;
    EQProductsFillCcy(thisTileBEI, "ddlBEICcy");

    clearPricerTable(thisTileBEI);
    $(thisTileBEI).find('[id^="shareNameCntrlBEI"]').html("");
    $(thisTileBEI).find('[id^="hiddenshareinputBEI"]').html("");
    $(thisTileBEI).find('[id^="CCY_BEI"]').html("");

    if (!isProductCopiedBEI) {
      for (
        let s = 0;
        s < clientConfigdata.EQCCommonMethods.MinSharesInBaskets;
        s++
      ) {
        createElementInBasket(
          thisTileBEI,
          "shareDivBEI",
          sessionStorage.getItem(thisTileBEI.id) != undefined
            ? sessionStorage.getItem(thisTileBEI.id).split(" ")[s]
            : globalDefaultSharesArray[s]
        );
      }
    }

    $(thisTileBEI).find('[id^="shareName"]')[0].placeholder = "";
    $(thisTileBEI)
      .find('[id^="CCY_BEI"]')
      .html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);
  } catch (error) {
    console.log(error.message);
  }
}
function checkSolveForBEI(solveFor, thisTileBEI) {
  try {
    if (solveFor.trim() == "COUPON") {
      $(thisTileBEI)
        .find('[id^="FundingRateinputbox"]')
        .val("310")
        .prop("disabled", false);
      $(thisTileBEI)
        .find('[id^="upfrontipbox"]')
        .val("1.50")
        .prop("disabled", false);
      $(thisTileBEI)
        .find('[id^="couponinputbox"]')
        .val("")
        .prop("disabled", true);
      $(thisTileBEI)
        .find('[id^="strikeinbox"]')
        .val("90.00")
        .prop("disabled", false);
    } else if (solveFor.trim() == "UPFRONT") {
      $(thisTileBEI)
        .find('[id^="FundingRateinputbox"]')
        .val("310")
        .prop("disabled", false);
      $(thisTileBEI)
        .find('[id^="upfrontipbox"]')
        .val("")
        .prop("disabled", true);
      $(thisTileBEI)
        .find('[id^="couponinputbox"]')
        .val("7.00")
        .prop("disabled", false);
      $(thisTileBEI)
        .find('[id^="strikeinbox"]')
        .val("90.00")
        .prop("disabled", false);
    } else if (solveFor.trim() == "CONVERSION_STRIKE") {
      $(thisTileBEI)
        .find('[id^="FundingRateinputbox"]')
        .val("310")
        .prop("disabled", false);
      $(thisTileBEI)
        .find('[id^="upfrontipbox"]')
        .val("1.50")
        .prop("disabled", false);
      $(thisTileBEI)
        .find('[id^="couponinputbox"]')
        .val("7.00")
        .prop("disabled", false);
      $(thisTileBEI).find('[id^="strikeinbox"]').val("").prop("disabled", true);
    }
  } catch (error) {}
}
// function checkKOKITypeBEI(KOKIType, thisTileBEI) {
//     try {
//         if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
//             // $(thisTileBEI).find('[id^="koinputbox"]').val("101.54").prop('disabled', false);
//             //$(thisTileBEI).find('[id^="kiinputbox"]').val("").prop("disabled", true);

//         } else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
//             // $(thisTileBEI).find('[id^="koinputbox"]').val("101.54").prop('disabled', false);
//             //  $(thisTileBEI).find('[id^="kiinputbox"]').val("65.00").prop('disabled', false);

//         } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
//             //  $(thisTileBEI).find('[id^="koinputbox"]').val("").prop("disabled", true);
//             // $(thisTileBEI).find('[id^="kiinputbox"]').val("65.00").prop('disabled', false);

//         } else if (KOKIType == "NOKINOKO") {
//             //  $(thisTileBEI).find('[id^="koinputbox"]').val("").prop("disabled", true);
//             //  $(thisTileBEI).find('[id^="kiinputbox"]').val("").prop('disabled', true);

//         }
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// To get best price for BEI
function getBestPriceBEI(that) {
  try {
    // Added logic for getting current tile : Onkar E.//

    //    var uniqueIntervalID;
    thisTileBEI = $(that).parents(".sorting")[0];
    // console.log('Start Interval value =' + $(thisTileBEI).find('[id^="hdnintervalID"]').val());

    clearInterval($(thisTileBEI).find('[id^="hdnintervalID"]').val());
    // console.log('After clear Interval value =' + $(thisTileBEI).find('[id^="hdnintervalID"]').val());

    $(thisTileBEI).find('[id^="hdnintervalID"]').val("");

    TileId = that.id.match(/\d+$/)[0];

    sessionStorage.setItem("poolingTimer_" + TileId, 0);
    sessionStorage.setItem("pricingToggle" + TileId, false);
    thisTileBEI = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    console.log(TileId, thisTileBEI, productName);
    getddlList = $.trim($(thisTileBEI).find('[id^="ddlKOKIType"]').val());

    $(thisTileBEI)
      .find('[id^="TBLBEI"]' + " td")
      .each(function () {
        //Clear prices || Tina K || 11-Sep-2019
        $(this).html("-");
      });
    validation_clear();
    clearPricerTable(thisTileBEI);

    if ($(thisTileBEI).find('[id^="shareDivBEI"]')[0].childNodes.length == 3) {
      ValidateField(
        $(thisTileBEI).find('[id^="shareDivBEI"]').attr("id"),
        "Please Enter Valid Shares",
        thisTileBEI
      );
      return false;
    } else if (
      $.trim($(thisTileBEI).find('[id^="ContractAmt"]').val()) == "" ||
      parseFloat($(thisTileBEI).find('[id^="ContractAmt"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileBEI).find('[id^="ContractAmt"]').attr("id"),
        "Please Enter Valid Contract Amount",
        thisTileBEI
      );
      return false;
    } else if ($.trim($(thisTileBEI).find('[id^="tenor_BEI"]').val()) == "") {
      ValidateField(
        $(thisTileBEI).find('[id^="tenor_BEI"]').attr("id"),
        "Please Enter Valid tenor",
        thisTileBEI
      );
      return false;
    } else if (
      $.trim($(thisTileBEI).find('[id^="FundingRateinputbox"]').val()) == "" ||
      $.trim($(thisTileBEI).find('[id^="FundingRateinputbox"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileBEI).find('[id^="FundingRateinputbox"]').attr("id"),
        "Please Enter Valid Funding Spread",
        thisTileBEI
      );
      return false;
    } else if (
      $.trim($(thisTileBEI).find('[id^="Floorinputbox"]').val()) == "" ||
      $.trim($(thisTileBEI).find('[id^="Floorinputbox"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileBEI).find('[id^="Floorinputbox"]').attr("id"),
        "Please Enter Valid Floor(%)",
        thisTileBEI
      );
      return false;
    }

    if (
      $(thisTileBEI)
        .find('[id^="ddlSolveForBEI"]')
        .val()
        .split("(")[0]
        .trim()
        .toUpperCase() == "CONVERSION_STRIKE"
    ) {
      if (
        parseFloat($(thisTileBEI).find('[id^="upfrontipbox"]').val()) == "" ||
        parseFloat($(thisTileBEI).find('[id^="upfrontipbox"]').val()) <= 0 ||
        parseFloat($(thisTileBEI).find('[id^="upfrontipbox"]').val()) > 1000
      ) {
        ValidateField(
          $(thisTileBEI).find('[id^="upfrontipbox"]').attr("id"),
          "Please Enter Valid Upfront(%)",
          thisTileBEI
        );
        return false;
      } else if (
        parseFloat($(thisTileBEI).find('[id^="couponinputbox"]').val()) == "" ||
        parseFloat($(thisTileBEI).find('[id^="couponinputbox"]').val()) <= 0 ||
        parseFloat($(thisTileBEI).find('[id^="couponinputbox"]').val()) >= 1000
      ) {
        ValidateField(
          $(thisTileBEI).find('[id^="couponinputbox"]').attr("id"),
          "Please Enter Valid Bonus Coupon(%)",
          thisTileBEI
        );
        return false;
      } else if (
        $(thisTileBEI).find('[id^="FundingRateinputbox"]').val() == "" ||
        $(thisTileBEI).find('[id^="FundingRateinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileBEI).find('[id^="FundingRateinputbox"]').attr("id"),
          "Please Enter Valid Funding Spread",
          thisTileBEI
        );
        return false;
      }
    } else if (
      $(thisTileBEI)
        .find('[id^="ddlSolveForBEI"]')
        .val()
        .split("(")[0]
        .trim()
        .toUpperCase() == "COUPON"
    ) {
      if (
        parseFloat($(thisTileBEI).find('[id^="upfrontipbox"]').val()) == "" ||
        parseFloat($(thisTileBEI).find('[id^="upfrontipbox"]').val()) <= 0 ||
        parseFloat($(thisTileBEI).find('[id^="upfrontipbox"]').val()) > 1000
      ) {
        ValidateField(
          $(thisTileBEI).find('[id^="upfrontipbox"]').attr("id"),
          "Please Enter Valid Upfront(%)",
          thisTileBEI
        );
        return false;
      } else if (
        $(thisTileBEI).find('[id^="strikeinbox"]').val() == "" ||
        $(thisTileBEI).find('[id^="strikeinbox"]').val() <= 0 ||
        $(thisTileBEI).find('[id^="strikeinbox"]').val() > 100
      ) {
        ValidateField(
          $(thisTileBEI).find('[id^="strikeinbox"]').attr("id"),
          "Please Enter Valid Strike(%)",
          thisTileBEI
        );
        return false;
      } else if (
        $(thisTileBEI).find('[id^="FundingRateinputbox"]').val() == "" ||
        $(thisTileBEI).find('[id^="FundingRateinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileBEI).find('[id^="FundingRateinputbox"]').attr("id"),
          "Please Enter Valid Funding Spread",
          thisTileBEI
        );
        return false;
      }
    } else if (
      $(thisTileBEI)
        .find('[id^="ddlSolveForBEI"]')
        .val()
        .split("(")[0]
        .trim()
        .toUpperCase() == "UPFRONT"
    ) {
      if (
        parseFloat($(thisTileBEI).find('[id^="couponinputbox"]').val()) == "" ||
        parseFloat($(thisTileBEI).find('[id^="couponinputbox"]').val()) <= 0 ||
        parseFloat($(thisTileBEI).find('[id^="couponinputbox"]').val()) >= 1000
      ) {
        ValidateField(
          $(thisTileBEI).find('[id^="couponinputbox"]').attr("id"),
          "Please Enter Valid Bonus Coupon(%)",
          thisTileBEI
        );
        return false;
      } else if (
        $(thisTileBEI).find('[id^="strikeinbox"]').val() == "" ||
        $(thisTileBEI).find('[id^="strikeinbox"]').val() <= 0 ||
        $(thisTileBEI).find('[id^="strikeinbox"]').val() > 100
      ) {
        ValidateField(
          $(thisTileBEI).find('[id^="strikeinbox"]').attr("id"),
          "Please Enter Valid Strike(%)",
          thisTileBEI
        );
        return false;
      } else if (
        $(thisTileBEI).find('[id^="FundingRateinputbox"]').val() == "" ||
        $(thisTileBEI).find('[id^="FundingRateinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileBEI).find('[id^="FundingRateinputbox"]').attr("id"),
          "Please Enter Valid Funding Spread",
          thisTileBEI
        );
        return false;
      }
    }

    setTimeout("$(thisTileBEI).find('[id^=\"loader_BEI\"]').show();", 200);

    //$(thisTileBEI).find('[id^="BookTradeBEI"]').attr("disabled", true); // Disabling book trade button while pricing is happening - by Onkar E. 25/11/2019
    $("body").css("opacity", "0.9");

    let exchangeList = getExchangeAndCcyFromBasket(
      $(thisTileBEI).find('[id^="shareDivBEI"]')[0],
      "exchange",
      undefined
    );
    let ccyList = getExchangeAndCcyFromBasket(
      $(thisTileBEI).find('[id^="shareDivBEI"]')[0],
      "ccy",
      undefined
    );
    let shareList = getExchangeAndCcyFromBasket(
      $(thisTileBEI).find('[id^="shareDivBEI"]')[0],
      "share",
      undefined
    );
    BEIQuoteObject = {
      OfferPrice: "99",
      Branch: "",
      CashCurrency: $(thisTileBEI).find('[id^="ddlBEICcy"]').val(),
      CashOrderQuantity: Number(
        removeCommaAndDecimal($(thisTileBEI).find('[id^="ContractAmt"]').val())
      ),
      CouponPercentage: $(thisTileBEI).find('[id^="couponinputbox"]').val(),
      LoginID: "PratikM",
      EntityName: "CFS SG",
      Entity_ID: 30,
      exchange1: exchangeList[0],
      exchange2: exchangeList[1],
      exchange3: exchangeList[2],
      exchange4: exchangeList[3],
      ExpiryDate: "04-Nov-2021",
      FundingRate: $(thisTileBEI).find('[id^="funding"]').val(),
      Issuer_Date_Offset: "14",
      KI_Level: "",
      KI_Type: "NONE",
      MaturityDate: "11-Nov-2021",
      Ppdetails: "1,2,9,10,18", //Asked by Chitralekha, 05-Jul-22
      SettlementDate: "04-May-2021",
      SolveFor: $(thisTileBEI).find('[id^="ddlSolveForBEI"]').val(),
      Spread: "-15.913",
      StrikePercentage: $(thisTileBEI).find('[id^="strikeinbox"]').val(),
      Tenor: parseFloat($(thisTileBEI).find('[id^="tenor_BEI"]').val()),
      TenorType: "MONTH",
      TradeDate: "20-Apr-2021",
      Type: "BEI",
      underlyingCode1: shareList[0],
      underlyingCode2: shareList[1],
      underlyingCode3: shareList[2],
      underlyingCode4: shareList[3],
      Upfront: $(thisTileBEI).find('[id^="upfrontipbox"]').val(),
      Floor: $(thisTileBEI).find('[id^="Floorinputbox"]').val(),
      CurrentTileID: TileId,
    };

    console.log("BEI quote ", BEIQuoteObject);

    getQuoteBEI(
      BEIQuoteObject,
      $(thisTileBEI).find('[id^="hdnintervalID"]')[0]
    );
    //  })
  } catch (er) {
    console.log(er.message);
  }
}
var priceProviderArray_BEI = [];

// To get quote
function getQuoteBEI(BEIQuoteObject, uniqueIntervalID) {
  try {
    var dataBEI = request_getDataFromAPI(
      BEIQuoteObject,
      clientConfigdata.CommonMethods.NodeServer + "getBestPriceBEI"
    )
      .then((dataBEI) => {
        console.log("quote response ", dataBEI);
        if (dataBEI.body == "") {
          clearInterval($(thisTileBEI).find('[id^="hdnintervalID"]').val());
          hideTileLoader(thisTileBEI, "loader_BEI");

          return false;
        }
        priceProviderArray_BEI = [];

        for (var x of dataBEI.body.split(",")) {
          priceProviderArray_BEI.push({ rfqID: x });
        }

        thisTileBEI = document.getElementById("td" + dataBEI.CurrentTileID);
        sessionStorage.setItem("pricingToggle" + dataBEI.CurrentTileID, true);

        getUniqQuoteResponseBEI(
          priceProviderArray_BEI,
          thisTileBEI,
          dataBEI,
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

function getUniqQuoteResponseBEI(
  priceProviderArray_BEI,
  thisTileBEI,
  dataBEI,
  uniqueIntervalID
) {
  try {
    var UIID = null;

    uniqueIntervalID.value = setInterval(function () {
      console.log("priceProviderArray_BEI", priceProviderArray_BEI);
      getFinalQuoteResponseBEI(
        priceProviderArray_BEI,
        "",
        "",
        thisTileBEI,
        uniqueIntervalID
      );
    }, clientConfigdata.EQCBEI.PollInterval);

    // console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
  } catch (error) {
    console.log(error);
  }
}

// To get price

function getFinalQuoteResponseBEI(
  priceProviderArray_BEI,
  finalTokenBEI1,
  finalResponseDataBEI1,
  thisTileBEI,
  uniqueIntervalID
) {
  try {
    var currentDateAndTime = new Date();

    console.log(
      "BEI RFQ's :: " + finalResponseDataBEI1 + " " + currentDateAndTime
    );
    Timer = Timer + 1;

    if (
      Number(
        sessionStorage.getItem(
          "poolingTimer_" + thisTileBEI.id.match(/\d+$/)[0]
        )
      ) >= clientConfigdata.EQCBEI.PoolTimer ||
      sessionStorage.getItem(
        "pricingToggle" + thisTileBEI.id.match(/\d+$/)[0]
      ) == "false"
    ) {
      $(thisTileBEI).find('[id^="BookTradeBEI"]').attr("disabled", false); // Enabling book trade button when pricing is over - by Onkar E. 25/11/2019
      clearInterval(uniqueIntervalID.value);
      uniqueIntervalID.value = "";
      QuoteObject = "";
      hideTileLoader(thisTileBEI, "loader_BEI");
      $(thisTileBEI)
        .find('[id^="hdnChartPricesBEI"]')
        .val(JSON.stringify(finalObjBEI));
      $("body").css("opacity", "");
      arrBEI = [];
      maxBEI = "";
      TimerBEI = 0;
      //Call Draw Graph
      if (finalObjBEI != null || finalObjBEI != undefined) {
        // drawgraphBEI($(thisTileBEI).find('[id^="canvas"]').attr('id'));
      }

      return false;
    } else {
      var repriceObjectBEI = request_getDataFromAPI(
        {
          userID: "PratikM",
          rfqDetails: priceProviderArray_BEI,
          CurrentTileID: $(thisTileBEI).attr("id").match(/\d+$/)[0],
        },
        clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseSI"
      )
        .then((repriceObjectBEI) => {
          console.log("BEI quote response ", repriceObjectBEI);

          thisTileBEI = document.getElementById(
            "td" + repriceObjectBEI.CurrentTileID
          );
          sessionStorage.setItem(
            "poolingTimer_" + repriceObjectBEI.CurrentTileID,
            Number(
              sessionStorage.getItem(
                "poolingTimer_" + thisTileBEI.id.match(/\d+$/)[0]
              )
            ) + 1
          );
          finalObjBEI = repriceObjectBEI.quoteresponses;
          console.log("snow ball price object before sort", finalObjBEI);

          // added by AniruddhaJ for upfront calculatation START
          if (
            $(thisTileBEI).find('[id^="ddlSolveForBEI"]').val().trim() ===
            "UPFRONT"
          ) {
            for (let priceBEI of finalObjBEI) {
              priceBEI.response = (Number(priceBEI.response) / 100)
                .toFixed(2)
                .toString();
            }
          }
          //End
          // // Sorted By Best Price LP'S

          finalObjBEI.sort(function (a, b) {
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
              $(thisTileBEI).find('[id^="ddlSolveForBEI"]').val() == "COUPON" ||
              $(thisTileBEI).find('[id^="ddlSolveForBEI"]').val() ==
                "KO_COUPON" ||
              $(thisTileBEI).find('[id^="ddlSolveForBEI"]').val() == "UPFRONT"
            ) {
              return Number(a.response) > Number(b.response) ? -1 : 1;
            } else {
              return Number(a.response) < Number(b.response) ? -1 : 1;
            }
          });
          maxBEI = finalObjBEI[0].response;
          $(thisTileBEI)
            .find('[id^="hdnChartPricesBEI"]')
            .val(JSON.stringify(finalObjBEI));
          console.log("snow ball price object after sort", finalObjBEI);

          //   $(thisTileBEI).find('[id^="hdnfinalTokenBEI"]').val(sessionStorage.getItem("quoteToken_" + thisTileBEI.id.match(/\d+$/)[0]));

          if (
            sessionStorage.getItem(
              "pricingToggle" + thisTileBEI.id.match(/\d+$/)[0]
            ) == "true"
          ) {
            $(thisTileBEI).find('[id^="BEIBanksRow"]').empty();
            $(thisTileBEI).find('[id^="BEIPrices"]').empty();
            $(finalObjBEI).each(function (i, elem) {
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
                $(thisTileBEI).find('[id^="BEIBanksRow"]').append(str);
              } else {
                str = str + "<td>--</td>";
                $(thisTileBEI).find('[id^="BEIBanksRow"]').append(str);
              }
              if (
                elem.response != null &&
                elem.response.trim() !== "NaN" &&
                elem.response.trim().toUpperCase() != "REJECTED" &&
                elem.response != "" &&
                parseFloat(elem.response) != 0
              ) {
                if (maxBEI == elem.response) {
                  str2 =
                    str2 +
                    "<td class='" +
                    priceClass +
                    "'>" +
                    parseFloat(elem.response).toFixed(2) +
                    "</td>";
                  $(thisTileBEI).find('[id^="BEIPrices"]').append(str2);
                } else {
                  str2 =
                    str2 +
                    "<td class=''>" +
                    parseFloat(elem.response).toFixed(2) +
                    "</td>";
                  $(thisTileBEI).find('[id^="BEIPrices"]').append(str2);
                }
              } else {
                str2 = str2 + "<td>-</td>";
                $(thisTileBEI).find('[id^="BEIPrices"]').append(str2);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          hideTileLoader(thisTileBEI, "loader_BEI");
          $(thisTileBEI)
            .find('[id^="hdnChartPricesBEI"]')
            .val(JSON.stringify(finalObjBEI));
          if (finalObjBEI != null || finalObjBEI != undefined) {
            //     drawgraphBEI($(thisTileBEI).find('[id^="canvas"]').attr('id'));
          }
        });
    }
  } catch (error) {
    console.log("getFinalQuoteResponseBEI : " + error.message);
    $(thisTileBEI)
      .find('[id^="hdnChartPricesBEI"]')
      .val(JSON.stringify(finalObjBEI));
    window.clearInterval(uniqueIntervalID.value);
    uniqueIntervalID.value = "";
    hideTileLoader(thisTileBEI, "loader_BEI");
    $(thisTileBEI).find('[id^="BookTradeBEI"]').attr("disabled", false);
    if (finalObjBEI != null || finalObjBEI != undefined) {
      //  drawgraphBEI($(thisTileBEI).find('[id^="canvas"]').attr('id'));
    }
    //  sessionStorage.setItem("quoteToken_" + thisTileBEI.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileBEI.id.match(/\d+$/)[0]));

    //  sessionStorage.setItem("quoteResponse_" + thisTileBEI.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileBEI.id.match(/\d+$/)[0]));
  } finally {
    $(thisTileBEI).find('[id^="BookTradeBEI"]').attr("disabled", false);
  }
}

// To book trade
function booktradeBEI(that) {
  try {
    // Added logic for getting current tile : Onkar E.//
    TileId = that.id.match(/\d+$/)[0];
    thisTileBEI = document.getElementById("td" + TileId);
    sessionStorage.setItem("pricingToggle" + TileId, false);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    showTileLoader(thisTileBEI, "loader_BEI");

    if (
      $(thisTileBEI).find('[id^="BEIPrices"]')[0].firstChild.innerHTML == "-" ||
      $(thisTileBEI).find('[id^="BEIPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        that,
        "booktradeBEI" + TileId,
        "Please Best Price Before Book Trade, Order Execution Failed!",
        "DivOverlayBEI"
      );
      hideTileLoader(thisTileBEI, "loader_BEI");

      return false;
    }

    // Check For Negative prices // CFINT-927 // 10-Sep-2020

    if (
      parseFloat(
        JSON.parse($(thisTileBEI).find('[id^="hdnChartPricesBEI"]').val())[0]
          .response
      ) <= 0
    ) {
      booktradePopup(
        that,
        "booktradeBEI" + TileId,
        "Prices can not be negative 0r zero, Order Execution Failed!",
        "DivOverlayBEI"
      );
      hideTileLoader(thisTileBEI, "loader_BEI");
      return false;
    }

    var Obj = JSON.parse(
      $(thisTileBEI).find('[id^="hdnChartPricesBEI"]').val()
    );
    var BEI_quoteid = Obj[0].quoteRequestId;

    let clientPriceBEI = Obj[0].response;
    var UpfrontbyIBpriceBEI = 100 - clientPriceBEI;

    Obj = JSON.parse($(thisTileBEI).find('[id^="hdnChartPricesBEI"]').val());

    BEI_quoteid = Obj[0].quoteRequestId;

    clientPriceBEI = Obj[0].response;

    let orderObjectBEI = {
      orderQuantity: removeCommaAndDecimal(
        $(thisTileBEI).find('[id^="ContractAmt"]').val()
      ),
      orderType: "",
      limitPrice1: "",
      limitPrice2: "",
      limitPrice3: "",
      limitPrice4: "",
      quoteRequestId: BEI_quoteid,
      orderComment: "Order Placed from CadB ",
      loginUser: "PratikM",
      margin: "",
      clientPrice: clientPriceBEI,
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

    request_getDataFromAPI(
      orderObjectBEI,
      clientConfigdata.CommonMethods.NodeServer + "BEIBookOrder"
    )
      .then((bookObject) => {
        console.log("BEIBookOrder ", bookObject);

        thisTileBEI = document.getElementById("td" + bookObject.CurrentTileID);
        TileId = bookObject.CurrentTileID;

        var bookstring = bookObject.orderPlaceBEIResult.orderID;

        if (bookstring != "" && bookstring != null && bookstring != undefined) {
          var orderplaced =
            "BEI :: Order Placed Successfully with Order ID: " +
            bookObject.orderPlaceBEIResult.orderID;
          booktradePopup(
            that,
            "booktradeBEI" + TileId,
            orderplaced,
            "DivOverlayBEI"
          );
          hideTileLoader(thisTileBEI, "loader_BEI");
          //  $(thisTileBEI).find('[id^="hdnfinalTokenBEI"]').val("");
        } else {
          booktradePopup(
            that,
            "booktradeBEI" + TileId,
            bookObject.orderPlaceBEIResult.remark,
            "DivOverlayBEI"
          );
          hideTileLoader(thisTileBEI, "loader_BEI");
        }

        clearInterval($(thisTileBEI).find('[id^="hdnintervalID"]').val());
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (er) {
    console.log(er);
    booktradePopup(
      that,
      "booktradeBEI" + TileId,
      "Please Best Price Before Book Trade, Order Execution Failed!",
      "DivOverlayBEI"
    );
    hideTileLoader(thisTileBEI, "loader_BEI");
  } finally {
  }
}

// function emailQuoteBEI(that) {
//     try {

//         thisTileBEI= $(that).parents(".sorting")[0];
//         if ($(thisTileBEI).find('[id^="hdnChartPricesBEI"]').val() != undefined)
//             var RFQID = JSON.parse($(thisTileBEI).find('[id^="hdnChartPricesBEI"]').val())[0].EP_ER_QuoteRequestId;

//         if (RFQID != undefined && RFQID != '') {
//             //     MailBestQuote(thisTileBEI.id.match(/\d+$/)[0], JSON.parse($(thisTileBEI).find('[id^="hdnChartPricesELN"]').val())[0].EP_ER_QuoteRequestId);
//             request_getDataFromAPI({ "userName": sessionStorage.getItem("FinIQUserID").toString(), "rfqId": RFQID, "CurrentTileID": thisTileBEI.id.match(/\d+$/)[0] }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
//                 console.log(data);
//                 TileId = data.CurrentTileID;

//                 thisTileBEI = document.getElementById("td" + TileId)
//                 booktradePopup(thisTileBEI, "booktradeBEI" + TileId, data.message, "DivOverlayBEI");

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
var BEISharesArray = [];
