$.support.cors = true;
var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var contractAmt;
var CouponFreq;
var tempShareName;
var arrWoBAutocall = [];
var maxWoBAutocall;
var finalResponseDataWoBAutocall;
var finalTokenWoBAutocall;
var repriceObjectWoBAutocall;
var TimerWoBAutocall = 0;
var finalObjWoBAutocall;
var getddlList;
var tenorListWoBAutocall = ["1M", "3M", "6M", "9M", "12M"];
var idWoBAutocall = 24;
var dateObj = "";
var currentDate = new Date().toShortFormat();
var uniqueRequestID = "CadB_" + Math.random().toFixed(2) * 100;

// To load the WoBAutocall tile
function onLoadWoBAutocall(currId, isProductCopiedWoBAutocall) {
  try {
    // Added logic for getting current tile : Onkar E.//
    setDeafaultValuesWoBAutocall(currId, isProductCopiedWoBAutocall);
    thisTileWoBAutocall = document.getElementById("td" + currId);

    hideTileLoader(thisTileWoBAutocall, "loader_WoBAutocall");
    loadWoBAutocallShares(thisTileWoBAutocall, currId);

    fillDropdownlistControl(
      tenorListWoBAutocall,
      $(thisTileWoBAutocall).find('[id^="tenor_WoBAutocall"]').attr("id")
    );
    document.querySelector(
      "#" + $(thisTileWoBAutocall).find('[id^="tenor_WoBAutocall"]').attr("id")
    ).selectedIndex = 3;

    $(thisTileWoBAutocall)
      .find(
        "div.card input[type='text'],div.card input[type='search'],div.card select"
      )
      .on("change", function () {
        thisTileWoBAutocall = $(this).parents(".sorting")[0];
        clearInterval(
          $(thisTileWoBAutocall).find('[id^="hdnintervalID"]').val()
        );
        clearPricerTable(thisTileWoBAutocall);
      });

    $(thisTileWoBAutocall)
      .find(
        "div.card input[type='text'],div.card input[type='search'],div.card select,div.card .ddlShares"
      )
      .on("select", function () {
        thisTileWoBAutocall = $(this).parents(".sorting")[0];
        clearInterval(
          $(thisTileWoBAutocall).find('[id^="hdnintervalID"]').val()
        );
        clearPricerTable(thisTileWoBAutocall);
      });

    $(thisTileWoBAutocall)
      .find('[id^="ddlKOKIType"]')
      .on("change", function () {
        try {
          thisTileWoBAutocall = $(this).parents(".sorting")[0];
          validation_clear(); //To Remove highlighted part if no error
          // checkKOKITypeWoBAutocall($(thisTileWoBAutocall).find('[id^="ddlKOKIType"]').val().trim(), thisTileWoBAutocall);
        } catch (error) {
          console.log(error.message);
        }
      });
    checkSolveForWoBAutocall(
      $(thisTileWoBAutocall).find('[id^="ddlSolveForWoBAutocall"]').val(),
      thisTileWoBAutocall
    );
    $(thisTileWoBAutocall)
      .find('[id^="ddlSolveForWoBAutocall"]')
      .on("change", function (event) {
        thisTileWoBAutocall = $(this).parents(".sorting")[0];
        checkSolveForWoBAutocall($(this).val(), thisTileWoBAutocall);
      });

    shareCount = 0;
    $(thisTileWoBAutocall)
      .find('[id^="shareDivWoBAutocall"]')
      .click(function () {
        $(this).find('input[type="search"]').focus();
      });

    $("div.card input,div.card select").change(function () {
      // console.log('change event called RESET')
      thisTileWoBAutocall = $(this).parents(".sorting")[0];
      clearInterval($(thisTileWoBAutocall).find('[id^="hdnintervalID"]').val());
      clearPricerTable(thisTileWoBAutocall);
      hideTileLoader(thisTileWoBAutocall, "loader_WoBAutocall");
      return false;
    });
  } catch (error) {
    console.log(error.message);
  }
}

// To set default values for WoBAutocall
function setDeafaultValuesWoBAutocall(currId, isProductCopiedWoBAutocall) {
  try {
    // Added logic for getting current tile : Onkar E.//
    thisTileWoBAutocall = document.getElementById("td" + currId);

    $(thisTileWoBAutocall).find('[id^="ContractAmt"]').val("1,000,000.00");
    $(thisTileWoBAutocall).find('[id^="couponipbox"]').val("8.00");

    $(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val("0.50");
    $(thisTileWoBAutocall).find('[id^="Stepdowninbox"]').val("0.50");
    $(thisTileWoBAutocall).find('[id^="koinputbox"]').val("3.88");

    fillDropdownlistControl(
      tenorListWoBAutocall,
      $(thisTileWoBAutocall).find('[id^="tenor_WoBAutocall"]').attr("id")
    );
    document.querySelector(
      "#" + $(thisTileWoBAutocall).find('[id^="tenor_WoBAutocall"]').attr("id")
    ).selectedIndex = 3;
    EQProductsFillCcy(thisTileWoBAutocall, "ddlWoBAutocallCcy");

    clearPricerTable(thisTileWoBAutocall);
    $(thisTileWoBAutocall).find('[id^="shareNameCntrlWoBAutocall"]').html("");
    $(thisTileWoBAutocall).find('[id^="hiddenshareinputWoBAutocall"]').html("");
    $(thisTileWoBAutocall).find('[id^="CCY_WoBAutocall"]').html("");
    //inputsharebasket(currId, "WoBAutocall", ($(thisTileWoBAutocall).find('[id^="shareName"]')));
    // createElementInBasket(thisTileWoBAutocall, 'shareDivWoBAutocall', sessionStorage.getItem(thisTileWoBAutocall.id) != undefined ? sessionStorage.getItem(thisTileWoBAutocall.id).split(" ")[0] : 'AAPL.OQ');
    // createElementInBasket(thisTileWoBAutocall, 'shareDivWoBAutocall', sessionStorage.getItem(thisTileWoBAutocall.id) != undefined ? sessionStorage.getItem(thisTileWoBAutocall.id).split(" ")[1] : 'GOOG.OQ');
    // createElementInBasket(thisTileWoBAutocall, 'shareDivWoBAutocall', sessionStorage.getItem(thisTileWoBAutocall.id) != undefined ? sessionStorage.getItem(thisTileWoBAutocall.id).split(" ")[2] : 'FB.OQ');
    if (!isProductCopiedWoBAutocall) {
      for (
        let s = 0;
        s < clientConfigdata.EQCCommonMethods.MinSharesInBaskets;
        s++
      ) {
        createElementInBasket(
          thisTileWoBAutocall,
          "shareDivWoBAutocall",
          sessionStorage.getItem(thisTileWoBAutocall.id) != undefined
            ? sessionStorage.getItem(thisTileWoBAutocall.id).split(" ")[s]
            : globalDefaultSharesArray[s]
        );
      }
    }
    $(thisTileWoBAutocall).find('[id^="shareName"]')[0].placeholder = "";
    $(thisTileWoBAutocall)
      .find('[id^="CCY_WoBAutocall"]')
      .html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);
  } catch (error) {
    console.log(error.message);
  }
}
function checkSolveForWoBAutocall(solveFor, thisTileWoBAutocall) {
  try {
    if (solveFor.trim() == "KO_COUPON") {
      $(thisTileWoBAutocall)
        .find('[id^="koCouponinputbox"]')
        .val("")
        .prop("disabled", true);

      $(thisTileWoBAutocall)
        .find('[id^="kiCouponinputbox"]')
        .val("2.70")
        .prop("disabled", false);

      $(thisTileWoBAutocall)
        .find('[id^="upfrontipbox"]')
        .val("0.50")
        .prop("disabled", false);
      $(thisTileWoBAutocall)
        .find('[id^="koinputbox"]')
        .val("101")
        .prop("disabled", false);
      $(thisTileWoBAutocall)
        .find('[id^="FundingRateinputbox"]')
        .val("310")
        .prop("disabled", false);
      $(thisTileWoBAutocall)
        .find('[id^="kiinputbox"]')
        .val("90")
        .prop("disabled", false);
    } else if (solveFor.trim() == "UPFRONT") {
      $(thisTileWoBAutocall)
        .find('[id^="koCouponinputbox"]')
        .val("3.60")
        .prop("disabled", false);

      $(thisTileWoBAutocall)
        .find('[id^="kiCouponinputbox"]')
        .val("2.70")
        .prop("disabled", false);

      $(thisTileWoBAutocall)
        .find('[id^="upfrontipbox"]')
        .val("")
        .prop("disabled", true);
      $(thisTileWoBAutocall)
        .find('[id^="koinputbox"]')
        .val("101")
        .prop("disabled", false);
      $(thisTileWoBAutocall)
        .find('[id^="FundingRateinputbox"]')
        .val("310")
        .prop("disabled", false);
      $(thisTileWoBAutocall)
        .find('[id^="kiinputbox"]')
        .val("90")
        .prop("disabled", false);
    } else if (solveFor.trim() == "KNOCKOUT_BARRIER") {
      $(thisTileWoBAutocall)
        .find('[id^="koCouponinputbox"]')
        .val("3.60")
        .prop("disabled", false);

      $(thisTileWoBAutocall)
        .find('[id^="kiCouponinputbox"]')
        .val("2.70")
        .prop("disabled", false);

      $(thisTileWoBAutocall)
        .find('[id^="upfrontipbox"]')
        .val("0.50")
        .prop("disabled", false);
      $(thisTileWoBAutocall)
        .find('[id^="koinputbox"]')
        .val("")
        .prop("disabled", true);
      $(thisTileWoBAutocall)
        .find('[id^="FundingRateinputbox"]')
        .val("310")
        .prop("disabled", false);
      $(thisTileWoBAutocall)
        .find('[id^="kiinputbox"]')
        .val("90")
        .prop("disabled", false);
    } else if (solveFor.trim() == "FUNDING_SPREAD") {
      $(thisTileWoBAutocall)
        .find('[id^="koCouponinputbox"]')
        .val("3.60")
        .prop("disabled", false);

      $(thisTileWoBAutocall)
        .find('[id^="kiCouponinputbox"]')
        .val("2.70")
        .prop("disabled", false);

      $(thisTileWoBAutocall)
        .find('[id^="upfrontipbox"]')
        .val("0.50")
        .prop("disabled", false);
      $(thisTileWoBAutocall)
        .find('[id^="koinputbox"]')
        .val("101")
        .prop("disabled", false);
      $(thisTileWoBAutocall)
        .find('[id^="FundingRateinputbox"]')
        .val("")
        .prop("disabled", true);
      $(thisTileWoBAutocall)
        .find('[id^="kiinputbox"]')
        .val("90")
        .prop("disabled", false);
    } else if (solveFor.trim() == "KNOCKIN_BARRIER") {
      $(thisTileWoBAutocall)
        .find('[id^="koCouponinputbox"]')
        .val("3.60")
        .prop("disabled", false);

      $(thisTileWoBAutocall)
        .find('[id^="kiCouponinputbox"]')
        .val("2.70")
        .prop("disabled", false);

      $(thisTileWoBAutocall)
        .find('[id^="upfrontipbox"]')
        .val("0.50")
        .prop("disabled", false);
      $(thisTileWoBAutocall)
        .find('[id^="koinputbox"]')
        .val("101")
        .prop("disabled", false);
      $(thisTileWoBAutocall)
        .find('[id^="FundingRateinputbox"]')
        .val("310")
        .prop("disabled", false);

      $(thisTileWoBAutocall)
        .find('[id^="kiinputbox"]')
        .val("")
        .prop("disabled", true);
    }
  } catch (error) {}
}

// function checkKOKITypeWoBAutocall(KOKIType, thisTileWoBAutocall) {
//     try {
//         if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
//             // $(thisTileWoBAutocall).find('[id^="koinputbox"]').val("3.88").prop('disabled', false);
//             //$(thisTileWoBAutocall).find('[id^="kiinputbox"]').val("").prop("disabled", true);

//         } else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
//             // $(thisTileWoBAutocall).find('[id^="koinputbox"]').val("3.88").prop('disabled', false);
//             //  $(thisTileWoBAutocall).find('[id^="kiinputbox"]').val("65.00").prop('disabled', false);

//         } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
//             //  $(thisTileWoBAutocall).find('[id^="koinputbox"]').val("").prop("disabled", true);
//             // $(thisTileWoBAutocall).find('[id^="kiinputbox"]').val("65.00").prop('disabled', false);

//         } else if (KOKIType == "NOKINOKO") {
//             //  $(thisTileWoBAutocall).find('[id^="koinputbox"]').val("").prop("disabled", true);
//             //  $(thisTileWoBAutocall).find('[id^="kiinputbox"]').val("").prop('disabled', true);

//         }
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// To change tenor
function tenorChange(TileId) {
  try {
    thisTileWoBAutocall = document.getElementById("td" + TileId);
    $(thisTileWoBAutocall)
      .find("div.card .ddlTenorEQProducts,div.card Underlying")
      .each(function (index, dropdownElement) {
        $(this).on("change select", function () {
          Tenor = $("option:selected", this).text();

          thisTileWoBAutocall = $(this).parents(".sorting")[0];
          if ($(thisTileWoBAutocall).find("span.sharesListName").length > 0) {
            UnderlyingCode = $(thisTileWoBAutocall)
              .find("span.sharesListName")[0]
              .innerText.trim()
              .split(" ")[0];
          } else if ($(thisTileWoBAutocall).find(".Underlying").length > 0) {
            UnderlyingCode = $(thisTileWoBAutocall)
              .find(".Underlying")[0]
              .value.trim();
          }

          request_getDataFromAPI(
            {
              Tenor: Tenor,
              UnderlyingCode: UnderlyingCode,
              token: token,
              Settlement_Days: $(thisTileWoBAutocall)
                .find('[id^="SettlWeeks"]')
                .val(),
              CurrentTileID: TileId,
              UserID:sessionStorage.getItem("FinIQUserID").toString(),
I_Entity_Id:sessionStorage.getItem("EntityID").toString()

            },
            clientConfigdata.CommonMethods.NodeServer + "calculateTenorEQC45"
          )
            .then((data) => {
              thisTileWoBAutocall = document.getElementById(
                "td" + data.CurrentTileID
              );

              if (data["responseData"] != "") {
                var dateObj = JSON.parse(data["responseData"]);
                $(thisTileWoBAutocall)
                  .find(".ddlTenorEQProducts")
                  .parent()
                  .next()
                  .empty();
                $(thisTileWoBAutocall)
                  .find(".ddlTenorEQProducts")
                  .parent()
                  .next()
                  .html(dateObj[0]["MaturityDate"]);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    // })
  } catch (err) {
    console.log(err.message);
  }
}

// To get best price for WoBAutocall
function getBestPriceWoBAutocall(that) {
  try {
    // Added logic for getting current tile : Onkar E.//

    //    var uniqueIntervalID;
    thisTileWoBAutocall = $(that).parents(".sorting")[0];
    // console.log('Start Interval value =' + $(thisTileWoBAutocall).find('[id^="hdnintervalID"]').val());

    clearInterval($(thisTileWoBAutocall).find('[id^="hdnintervalID"]').val());
    // console.log('After clear Interval value =' + $(thisTileWoBAutocall).find('[id^="hdnintervalID"]').val());

    $(thisTileWoBAutocall).find('[id^="hdnintervalID"]').val("");

    TileId = that.id.match(/\d+$/)[0];

    sessionStorage.setItem("poolingTimer_" + TileId, 0);
    sessionStorage.setItem("pricingToggle" + TileId, false);
    thisTileWoBAutocall = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    console.log(TileId, thisTileWoBAutocall, productName);
    getddlList = $.trim(
      $(thisTileWoBAutocall).find('[id^="ddlKOKIType"]').val()
    );

    $(thisTileWoBAutocall)
      .find('[id^="TBLWoBAutocall"]' + " td")
      .each(function () {
        //Clear prices || Tina K || 11-Sep-2019
        $(this).html("-");
      });
    validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
    clearPricerTable(thisTileWoBAutocall); //To clear prices after clicking best price || Tina K || 20-Nov-2019
    //Validation conditions added : Tina Kshirsagar : 6-09-2019

    if (
      $(thisTileWoBAutocall).find('[id^="shareDivWoBAutocall"]')[0].childNodes
        .length == 3
    ) {
      ValidateField(
        $(thisTileWoBAutocall).find('[id^="shareDivWoBAutocall"]').attr("id"),
        "Please Enter Valid Shares",
        thisTileWoBAutocall
      );
      return false;
    } else if (
      $.trim($(thisTileWoBAutocall).find('[id^="ContractAmt"]').val()) == "" ||
      parseFloat($(thisTileWoBAutocall).find('[id^="ContractAmt"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileWoBAutocall).find('[id^="ContractAmt"]').attr("id"),
        "Please Enter Valid Contract Amount",
        thisTileWoBAutocall
      );
      return false;
    } else if (
      $.trim($(thisTileWoBAutocall).find('[id^="tenor_WoBAutocall"]').val()) ==
      ""
    ) {
      ValidateField(
        $(thisTileWoBAutocall).find('[id^="tenor_WoBAutocall"]').attr("id"),
        "Please Enter Valid tenor",
        thisTileWoBAutocall
      );
      return false;
    } else if (
      $.trim($(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val()) ==
        "" ||
      $.trim($(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val()) <= 0
    ) {
      ValidateField(
        $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').attr("id"),
        "Please Enter Valid KI Coupon(%)",
        thisTileWoBAutocall
      );
      return false;
    }

    if (
      $(thisTileWoBAutocall)
        .find('[id^="ddlSolveForWoBAutocall"]')
        .val()
        .split("(")[0]
        .trim()
        .toUpperCase() == "KO_COUPON"
    ) {
      if (
        parseFloat($(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val()) ==
          "" ||
        parseFloat($(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val()) <=
          0 ||
        parseFloat($(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val()) >
          1000
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="upfrontipbox"]').attr("id"),
          "Please Enter Valid Upfront(%)",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="FundingRateinputbox"]').val() ==
          "" ||
        $(thisTileWoBAutocall).find('[id^="FundingRateinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="FundingRateinputbox"]').attr("id"),
          "Please Enter Valid Funding Spread",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="koinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="koinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="koinputbox"]').attr("id"),
          "Please Enter Valid KO % Of Intial",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="kiinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="kiinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="kiinputbox"]').attr("id"),
          "Please Enter Valid KI % Of Intial",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').attr("id"),
          "Please Enter Valid KI Coupon(%)",
          thisTileWoBAutocall
        );
        return false;
      }
    } else if (
      $(thisTileWoBAutocall)
        .find('[id^="ddlSolveForWoBAutocall"]')
        .val()
        .split("(")[0]
        .trim()
        .toUpperCase() == "KNOCKIN_BARRIER"
    ) {
      if (
        parseFloat($(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val()) ==
          "" ||
        parseFloat($(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val()) <=
          0 ||
        parseFloat($(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val()) >
          1000
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="upfrontipbox"]').attr("id"),
          "Please Enter Valid Upfront(%)",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        parseFloat(
          $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').val()
        ) == "" ||
        parseFloat(
          $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').val()
        ) <= 0 ||
        parseFloat(
          $(thisTileWoBAutocall).find('[id^="KOcouponipbox"]').val()
        ) >= 1000
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').attr("id"),
          "Please Enter Valid KO Coupon(%)",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="FundingRateinputbox"]').val() ==
          "" ||
        $(thisTileWoBAutocall).find('[id^="FundingRateinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="FundingRateinputbox"]').attr("id"),
          "Please Enter Valid Funding Spread",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').attr("id"),
          "Please Enter Valid KI Coupon(%)",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="koinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="koinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="koinputbox"]').attr("id"),
          "Please Enter Valid KO % Of Intial",
          thisTileWoBAutocall
        );
        return false;
      }
    } else if (
      $(thisTileWoBAutocall)
        .find('[id^="ddlSolveForWoBAutocall"]')
        .val()
        .split("(")[0]
        .trim()
        .toUpperCase() == "UPFRONT"
    ) {
      if (
        parseFloat(
          $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').val()
        ) == "" ||
        parseFloat(
          $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').val()
        ) <= 0 ||
        parseFloat(
          $(thisTileWoBAutocall).find('[id^="KOcouponipbox"]').val()
        ) >= 1000
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').attr("id"),
          "Please Enter Valid KO Coupon(%)",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="FundingRateinputbox"]').val() ==
          "" ||
        $(thisTileWoBAutocall).find('[id^="FundingRateinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="FundingRateinputbox"]').attr("id"),
          "Please Enter Valid Funding Spread",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="kiinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="kiinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="kiinputbox"]').attr("id"),
          "Please Enter Valid KI % Of Intial",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="koinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="koinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="koinputbox"]').attr("id"),
          "Please Enter Valid KO % Of Intial",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').attr("id"),
          "Please Enter Valid KI Coupon(%)",
          thisTileWoBAutocall
        );
        return false;
      }
    } else if (
      $(thisTileWoBAutocall)
        .find('[id^="ddlSolveForWoBAutocall"]')
        .val()
        .split("(")[0]
        .trim()
        .toUpperCase() == "FUNDING_SPREAD"
    ) {
      if (
        $(thisTileWoBAutocall).find('[id^="kiinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="kiinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="kiinputbox"]').attr("id"),
          "Please Enter Valid KI % Of Intial",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="koinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="koinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="koinputbox"]').attr("id"),
          "Please Enter Valid KO % Of Intial",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        parseFloat(
          $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').val()
        ) == "" ||
        parseFloat(
          $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').val()
        ) <= 0 ||
        parseFloat(
          $(thisTileWoBAutocall).find('[id^="KOcouponipbox"]').val()
        ) >= 1000
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').attr("id"),
          "Please Enter Valid KO Coupon(%)",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        parseFloat($(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val()) ==
          "" ||
        parseFloat($(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val()) <=
          0 ||
        parseFloat($(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val()) >
          1000
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="upfrontipbox"]').attr("id"),
          "Please Enter Valid Upfront(%)",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').attr("id"),
          "Please Enter Valid KI Coupon(%)",
          thisTileWoBAutocall
        );
        return false;
      }
    } else if (
      $(thisTileWoBAutocall)
        .find('[id^="ddlSolveForWoBAutocall"]')
        .val()
        .split("(")[0]
        .trim()
        .toUpperCase() == "KNOCKOUT_BARRIER"
    ) {
      if (
        parseFloat($(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val()) ==
          "" ||
        parseFloat($(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val()) <=
          0 ||
        parseFloat($(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val()) >
          1000
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="upfrontipbox"]').attr("id"),
          "Please Enter Valid Upfront(%)",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        parseFloat(
          $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').val()
        ) == "" ||
        parseFloat(
          $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').val()
        ) <= 0 ||
        parseFloat(
          $(thisTileWoBAutocall).find('[id^="KOcouponipbox"]').val()
        ) >= 1000
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').attr("id"),
          "Please Enter Valid KO Coupon(%)",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="FundingRateinputbox"]').val() ==
          "" ||
        $(thisTileWoBAutocall).find('[id^="FundingRateinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="FundingRateinputbox"]').attr("id"),
          "Please Enter Valid Funding Spread",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').attr("id"),
          "Please Enter Valid KI Coupon(%)",
          thisTileWoBAutocall
        );
        return false;
      } else if (
        $(thisTileWoBAutocall).find('[id^="kiinputbox"]').val() == "" ||
        $(thisTileWoBAutocall).find('[id^="kiinputbox"]').val() <= 0
      ) {
        ValidateField(
          $(thisTileWoBAutocall).find('[id^="kiinputbox"]').attr("id"),
          "Please Enter Valid KI % Of Intial",
          thisTileWoBAutocall
        );
        return false;
      }
    }

    setTimeout(
      "$(thisTileWoBAutocall).find('[id^=\"loader_WoBAutocall\"]').show();",
      200
    );

    //$(thisTileWoBAutocall).find('[id^="BookTradeWoBAutocall"]').attr("disabled", true); // Disabling book trade button while pricing is happening - by Onkar E. 25/11/2019
    $("body").css("opacity", "0.9");

    let exchangeList = getExchangeAndCcyFromBasket(
      $(thisTileWoBAutocall).find('[id^="shareDivWoBAutocall"]')[0],
      "exchange",
      undefined,
      WoBAutocallSharesArray
    );
    let ccyList = getExchangeAndCcyFromBasket(
      $(thisTileWoBAutocall).find('[id^="shareDivWoBAutocall"]')[0],
      "ccy",
      undefined,
      WoBAutocallSharesArray
    );
    let shareList = getExchangeAndCcyFromBasket(
      $(thisTileWoBAutocall).find('[id^="shareDivWoBAutocall"]')[0],
      "share",
      undefined,
      WoBAutocallSharesArray
    );

    WoBAutocallQuoteObject = {
      entityCode: "CN",
      loginID: "Dealer1",
      sourceSystem: "FinIQ",
      machineIP: "192.168.26.247",
      requestID: uniqueRequestID,
      requestAt: currentDate,
      token:
        "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
      type: "WOBasketAutocall",
      underlyingCode1: shareList[0],
      underlyingCode2: shareList[1],
      underlyingCode3: shareList[2],
      ccy: ccyList[0],
      solveFor: $(thisTileWoBAutocall)
        .find('[id^="ddlSolveForWoBAutocall"]')
        .val(),
      tenor: $(thisTileWoBAutocall).find('[id^="tenor_WoBAutocall"]').val(),
      strikePerc: "",
      upfront: $(thisTileWoBAutocall).find('[id^="upfrontipbox"]').val(),
      ppDetails: "",
      couponFrq: $(thisTileWoBAutocall)
        .find('[id^="ddlFrequency"]')
        .val()
        .toUpperCase(),
      kiPerc: $(thisTileWoBAutocall).find('[id^="kiinputbox"]').val(),
      kiType: "",
      kiCoupon: $(thisTileWoBAutocall).find('[id^="kiCouponinputbox"]').val(),
      couponPerc: "",
      notional: $(thisTileWoBAutocall)
        .find('[id^="ContractAmt"]')
        .val()
        .replace(/\,/g, "")
        .split(".")[0],
      koPerc: $(thisTileWoBAutocall).find('[id^="koinputbox"]').val(),
      koType: "",
      koCoupon: $(thisTileWoBAutocall).find('[id^="koCouponinputbox"]').val(),
      nonCall: "1",
      settlementDays: "2",
      fundingType: "",
      fundingRate: $(thisTileWoBAutocall).find('[id^="Fundingddl"]').val(),
      fundingSpread: $(thisTileWoBAutocall)
        .find('[id^="FundingRateinputbox"]')
        .val(),
      channel: "01",
      tradeDate: "",
      principalProtection: $(thisTileWoBAutocall)
        .find('[id^="Principalinputbox"]')
        .val(),
      CurrentTileID: TileId,
    };

    // console.log('WoBAutocall quote ', WoBAutocallQuoteObject);

    getQuoteWoBAutocall(
      WoBAutocallQuoteObject,
      $(thisTileWoBAutocall).find('[id^="hdnintervalID"]')[0]
    );
    //  })
  } catch (er) {
    console.log(er.message);
  }
}
var priceProviderArray_WoBAutocall = [];

// To get quote
function getQuoteWoBAutocall(WoBAutocallQuoteObject, uniqueIntervalID) {
  try {
    var dataWoBAutocall = request_getDataFromAPI(
      WoBAutocallQuoteObject,
      clientConfigdata.CommonMethods.NodeServer + "getBestPriceWoBAutocall"
    )
      .then((dataWoBAutocall) => {
        // console.log('quote response ', dataWoBAutocall);

        if (
          dataWoBAutocall.rfqResponse.responseDetails.description
            .trim()
            .toUpperCase() !== "SUCCESS"
        ) {
          alert(dataWoBAutocall.rfqResponse.responseDetails.remark);
          clearInterval(
            $(thisTileWoBAutocall).find('[id^="hdnintervalID"]').val()
          );
          hideTileLoader(thisTileWoBAutocall, "loader_WoBAutocall");

          return false;
        }
        priceProviderArray_WoBAutocall = [];

        for (var x of dataWoBAutocall.rfqResponse.priceProviderDetails) {
          priceProviderArray_WoBAutocall.push({ rfqID: x.rfqID });
        }

        thisTileWoBAutocall = document.getElementById(
          "td" + dataWoBAutocall.CurrentTileID
        );
        sessionStorage.setItem(
          "pricingToggle" + dataWoBAutocall.CurrentTileID,
          true
        );

        getUniqQuoteResponseWoBAutocall(
          priceProviderArray_WoBAutocall,
          thisTileWoBAutocall,
          dataWoBAutocall,
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

function getUniqQuoteResponseWoBAutocall(
  priceProviderArray_WoBAutocall,
  thisTileWoBAutocall,
  dataWoBAutocall,
  uniqueIntervalID
) {
  try {
    var UIID = null;

    uniqueIntervalID.value = setInterval(function () {
      getFinalQuoteResponseWoBAutocall(
        priceProviderArray_WoBAutocall,
        "",
        "",
        thisTileWoBAutocall,
        uniqueIntervalID
      );
    }, clientConfigdata.EQCAVGAUTOCALL.PollInterval);

    // console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
  } catch (error) {
    console.log(error);
  }
}

// To get price

function getFinalQuoteResponseWoBAutocall(
  priceProviderArray_WoBAutocall,
  finalTokenWoBAutocall1,
  finalResponseDataWoBAutocall1,
  thisTileWoBAutocall,
  uniqueIntervalID
) {
  try {
    var currentDateAndTime = new Date();

    console.log(
      "WoBAutocall RFQ's :: " +
        finalResponseDataWoBAutocall1 +
        " " +
        currentDateAndTime
    );
    Timer = Timer + 1;

    if (
      Number(
        sessionStorage.getItem(
          "poolingTimer_" + thisTileWoBAutocall.id.match(/\d+$/)[0]
        )
      ) >= clientConfigdata.EQCWoBAutocall.PoolTimer ||
      sessionStorage.getItem(
        "pricingToggle" + thisTileWoBAutocall.id.match(/\d+$/)[0]
      ) == "false"
    ) {
      $(thisTileWoBAutocall)
        .find('[id^="BookTradeWoBAutocall"]')
        .attr("disabled", false); // Enabling book trade button when pricing is over - by Onkar E. 25/11/2019
      clearInterval(uniqueIntervalID.value);
      uniqueIntervalID.value = "";
      QuoteObject = "";
      hideTileLoader(thisTileWoBAutocall, "loader_WoBAutocall");
      $(thisTileWoBAutocall)
        .find('[id^="hdnChartPricesWoBAutocall"]')
        .val(JSON.stringify(finalObjWoBAutocall));
      $("body").css("opacity", "");
      arrWoBAutocall = [];
      maxWoBAutocall = "";
      TimerWoBAutocall = 0;
      //Call Draw Graph
      if (finalObjWoBAutocall != null || finalObjWoBAutocall != undefined) {
        //   drawgraphWoBAutocall($(thisTileWoBAutocall).find('[id^="canvas"]').attr('id'));
      }

      return false;
    } else {
      let finalQuoteResObjectWoBAutocall = {
        entityCode: "CN",
        loginID: "Dealer1",
        sourceSystem: "FINIQ",
        machineIP: "192.168.0.0",
        requestID: uniqueRequestID,
        requestAt: currentDate,
        token:
          "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
        priceProviderArray_WoBAutocall: priceProviderArray_WoBAutocall,
        CurrentTileID: $(thisTileWoBAutocall).attr("id").match(/\d+$/)[0],
      };

      var repriceObjectWoBAutocall = request_getDataFromAPI(
        finalQuoteResObjectWoBAutocall,
        clientConfigdata.CommonMethods.NodeServer +
          "getQuoteResponseWoBAutocall"
      )
        .then((repriceObjectWoBAutocall) => {
          // console.log('WoBAutocall quote response ', repriceObjectWoBAutocall);

          thisTileWoBAutocall = document.getElementById(
            "td" + repriceObjectWoBAutocall.CurrentTileID
          );
          sessionStorage.setItem(
            "poolingTimer_" + repriceObjectWoBAutocall.CurrentTileID,
            Number(
              sessionStorage.getItem(
                "poolingTimer_" + thisTileWoBAutocall.id.match(/\d+$/)[0]
              )
            ) + 1
          );
          finalObjWoBAutocall =
            repriceObjectWoBAutocall.rfqresponse.quoteresponses;
          console.log("WOB autocall price object ", finalObjWoBAutocall);

          // added by AniruddhaJ for upfront calculatation START
          if (
            $(thisTileWoBAutocall)
              .find('[id^="ddlSolveForWoBAutocall"]')
              .val()
              .trim() === "UPFRONT"
          ) {
            for (let priceWOB of finalObjWoBAutocall) {
              priceWOB.woAutocallOut = (Number(priceWOB.woAutocallOut) / 100)
                .toFixed(2)
                .toString();
            }
          }
          //End

          // // Sorted By Best Price LP'S

          finalObjWoBAutocall.sort(function (a, b) {
            if (
              a.woAutocallOut === null ||
              a.woAutocallOut == "" ||
              a.woAutocallOut == "Timeout" ||
              a.woAutocallOut.toUpperCase().trim() == "REJECTED" ||
              a.woAutocallOut.toUpperCase().trim() == "UNSUPPORTED" ||
              a.woAutocallOut === "NaN" ||
              parseFloat(a.woAutocallOut) == 0
            ) {
              return 1;
            } else if (
              b.woAutocallOut === null ||
              b.woAutocallOut == "" ||
              b.woAutocallOut == "Timeout" ||
              b.woAutocallOut.toUpperCase().trim() == "REJECTED" ||
              b.woAutocallOut.toUpperCase().trim() == "UNSUPPORTED" ||
              a.woAutocallOut === "NaN" ||
              parseFloat(a.woAutocallOut) == 0
            ) {
              return -1;
            } else if (a.woAutocallOut === b.woAutocallOut) {
              return 0;
            }

            if (
              $(thisTileWoBAutocall)
                .find('[id^="ddlSolveForWoBAutocall"]')
                .val() == "KO_COUPON" ||
              $(thisTileWoBAutocall)
                .find('[id^="ddlSolveForWoBAutocall"]')
                .val() == "UPFRONT"
            ) {
              return Number(a.woAutocallOut) > Number(b.woAutocallOut) ? -1 : 1;
            } else {
              return Number(a.woAutocallOut) < Number(b.woAutocallOut) ? -1 : 1;
            }
          });
          maxWoBAutocall = finalObjWoBAutocall[0].woAutocallOut;
          $(thisTileWoBAutocall)
            .find('[id^="hdnChartPricesWoBAutocall"]')
            .val(JSON.stringify(finalObjWoBAutocall));

          //   $(thisTileWoBAutocall).find('[id^="hdnfinalTokenWoBAutocall"]').val(sessionStorage.getItem("quoteToken_" + thisTileWoBAutocall.id.match(/\d+$/)[0]));

          if (
            sessionStorage.getItem(
              "pricingToggle" + thisTileWoBAutocall.id.match(/\d+$/)[0]
            ) == "true"
          ) {
            $(thisTileWoBAutocall).find('[id^="WoBAutocallBanksRow"]').empty();
            $(thisTileWoBAutocall).find('[id^="WoBAutocallPrices"]').empty();
            $(finalObjWoBAutocall).each(function (i, elem) {
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
                $(thisTileWoBAutocall)
                  .find('[id^="WoBAutocallBanksRow"]')
                  .append(str);
              } else {
                str = str + "<td>--</td>";
                $(thisTileWoBAutocall)
                  .find('[id^="WoBAutocallBanksRow"]')
                  .append(str);
              }
              if (
                elem.woAutocallOut != null &&
                elem.woAutocallOut.trim() !== "NaN" &&
                elem.woAutocallOut.trim().toUpperCase() != "REJECTED" &&
                elem.woAutocallOut != "" &&
                parseFloat(elem.woAutocallOut) != 0
              ) {
                if (maxWoBAutocall == elem.woAutocallOut) {
                  str2 =
                    str2 +
                    "<td class='" +
                    priceClass +
                    "'>" +
                    parseFloat(elem.woAutocallOut).toFixed(2) +
                    "</td>";
                  $(thisTileWoBAutocall)
                    .find('[id^="WoBAutocallPrices"]')
                    .append(str2);
                } else {
                  str2 =
                    str2 +
                    "<td class=''>" +
                    parseFloat(elem.woAutocallOut).toFixed(2) +
                    "</td>";
                  $(thisTileWoBAutocall)
                    .find('[id^="WoBAutocallPrices"]')
                    .append(str2);
                }
              } else {
                str2 = str2 + "<td>-</td>";
                $(thisTileWoBAutocall)
                  .find('[id^="WoBAutocallPrices"]')
                  .append(str2);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          hideTileLoader(thisTileWoBAutocall, "loader_WoBAutocall");
          $(thisTileWoBAutocall)
            .find('[id^="hdnChartPricesWoBAutocall"]')
            .val(JSON.stringify(finalObjWoBAutocall));
          if (finalObjWoBAutocall != null || finalObjWoBAutocall != undefined) {
            //  drawgraphWoBAutocall($(thisTileWoBAutocall).find('[id^="canvas"]').attr('id'));
          }
        });
    }
  } catch (error) {
    console.log("getFinalQuoteResponseWoBAutocall : " + error.message);
    $(thisTileWoBAutocall)
      .find('[id^="hdnChartPricesWoBAutocall"]')
      .val(JSON.stringify(finalObjWoBAutocall));
    window.clearInterval(uniqueIntervalID.value);
    uniqueIntervalID.value = "";
    hideTileLoader(thisTileWoBAutocall, "loader_WoBAutocall");
    $(thisTileWoBAutocall)
      .find('[id^="BookTradeWoBAutocall"]')
      .attr("disabled", false);
    if (finalObjWoBAutocall != null || finalObjWoBAutocall != undefined) {
      //   drawgraphWoBAutocall($(thisTileWoBAutocall).find('[id^="canvas"]').attr('id'));
    }
    //  sessionStorage.setItem("quoteToken_" + thisTileWoBAutocall.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileWoBAutocall.id.match(/\d+$/)[0]));

    //  sessionStorage.setItem("quoteResponse_" + thisTileWoBAutocall.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileWoBAutocall.id.match(/\d+$/)[0]));
  } finally {
    $(thisTileWoBAutocall)
      .find('[id^="BookTradeWoBAutocall"]')
      .attr("disabled", false);
  }
}

// To book trade
function booktradeWoBAutocall(that) {
  try {
    // Added logic for getting current tile : Onkar E.//
    TileId = that.id.match(/\d+$/)[0];
    thisTileWoBAutocall = document.getElementById("td" + TileId);
    sessionStorage.setItem("pricingToggle" + TileId, false);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    showTileLoader(thisTileWoBAutocall, "loader_WoBAutocall");

    if (
      $(thisTileWoBAutocall).find('[id^="WoBAutocallPrices"]')[0].firstChild
        .innerHTML == "-" ||
      $(thisTileWoBAutocall).find('[id^="WoBAutocallPrices"]')[0].firstChild
        .innerHTML == ""
    ) {
      booktradePopup(
        that,
        "booktradeWoBAutocall" + TileId,
        "Please Best Price Before Book Trade, Order Execution Failed!",
        "DivOverlayWoBAutocall"
      );
      hideTileLoader(thisTileWoBAutocall, "loader_WoBAutocall");

      return false;
    }

    // Check For Negative prices // CFINT-927 // 10-Sep-2020

    if (
      parseFloat(
        JSON.parse(
          $(thisTileWoBAutocall).find('[id^="hdnChartPricesWoBAutocall"]').val()
        )[0].woAutocallOut
      ) <= 0
    ) {
      booktradePopup(
        that,
        "booktradeWoBAutocall" + TileId,
        "Prices can not be negative 0r zero, Order Execution Failed!",
        "DivOverlayWoBAutocall"
      );
      hideTileLoader(thisTileWoBAutocall, "loader_WoBAutocall");
      return false;
    }
    var Obj = JSON.parse(
      $(thisTileWoBAutocall).find('[id^="hdnChartPricesWoBAutocall"]').val()
    );
    var WoBAutocall_quoteid = Obj[0].quoteRequestId;

    var clientPriceWoBAutocall = Obj[0].woAutocallOut;

    request_getDataFromAPI(
      {
        entityCode: "CN",
        loginID: "1465895",
        sourceSystem: "EQD",
        machineIP: "10.68.117.204",
        requestID: uniqueRequestID,
        requestAt: currentDate,
        token:
          "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
        rfqID: WoBAutocall_quoteid,
        CurrentTileID: TileId,
      },
      clientConfigdata.CommonMethods.NodeServer + "CNSDTranchecreation_API"
    )
      .then((dataTranche) => {
        // console.log('tranche created ', dataTranche);
        thisTileWoBAutocall = document.getElementById(
          "td" + dataTranche.CurrentTileID
        );

        Obj = JSON.parse(
          $(thisTileWoBAutocall).find('[id^="hdnChartPricesWoBAutocall"]').val()
        );

        WoBAutocall_quoteid = Obj[0].quoteRequestId;

        clientPriceWoBAutocall = Obj[0].woAutocallOut;
        booktradePopup(
          that,
          "booktradeWoBAutocall" + TileId,
          dataTranche.tranchecreationResponse.trancheName +
            " " +
            dataTranche.tranchecreationResponse.responseDetails.remark,
          "DivOverlayWoBAutocall"
        );

        request_getDataFromAPI(
          {
            entityCode: "CN",
            loginID: "Dealer1",
            sourceSystem: "FinIQ",
            machineIP: "192.168.26.247",
            requestID: uniqueRequestID,
            requestAt: currentDate,
            token:
              "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
            orderType: "",
            limitPrice1: "",
            limitPrice2: "",
            limitPrice3: "",
            quoteRequestId: WoBAutocall_quoteid,
            orderComment: "",
            margin: "",
            clientPrice: clientPriceWoBAutocall,
            clientYield: "",
            confirmReason: "Test",
            bookingBranch: "China",
            orderQuantity: $(thisTileWoBAutocall)
              .find('[id^="ContractAmt"]')
              .val()
              .split(".")[0]
              .replace(/\,/g, ""),
            customerRef: "98550",
            rmNameForOrderConfirm: "CHRM1",
            channel: "01",
            internalRefNumber: "1234",
            referralRM: "CHRM1",
            CurrentTileID: dataTranche.CurrentTileID,
          },
          clientConfigdata.CommonMethods.NodeServer + "WoBAutocallBookOrder"
        )
          .then((bookObject) => {
            // console.log('WoBAutocallBookOrder', bookObject);

            thisTileWoBAutocall = document.getElementById(
              "td" + bookObject.CurrentTileID
            );
            TileId = bookObject.CurrentTileID;
            var bookstring = bookObject["responseData"];
            //  if (bookstring.toUpperCase() === clientConfigdata.EQCCommonMethods.EQC_BOOK_TWoBAutocallDE_RESPONSE_DETAILS.toUpperCase()) {
            var parentID = "";

            // if (bookObject.UCPProductDetailsResponse !== undefined) {

            //     if (bookObject.UCPProductDetailsResponse._NoteMasterID !== '' && bookObject.UCPProductDetailsResponse._NoteMasterID !== '0') {
            //         parentID = ` and Parent ID ${bookObject.UCPProductDetailsResponse._NoteMasterID}`;

            //     } else {
            //         parentID = '';

            //     }
            // }
            var orderplaced =
              "WoBAutocall :: Order Placed Successfully with Order ID: " +
              bookObject.orderResponse.orderID;
            //   $(thisTileWoBAutocall).find('[id^="hdnBlotterURLWoBAutocall"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
            // $(thisTileWoBAutocall).find('[id^="OrderBlotter"]').css({ display: "inline" });
            booktradePopup(
              that,
              "booktradeWoBAutocall" + TileId,
              orderplaced,
              "DivOverlayWoBAutocall"
            );
            hideTileLoader(thisTileWoBAutocall, "loader_WoBAutocall");

            console.log(
              "WoB Autocall book order :: ",
              bookObject.orderResponse.responseDetails.remark
            );

            //   $(thisTileWoBAutocall).find('[id^="hdnfinalTokenWoBAutocall"]').val("");

            // } else {
            //     booktradePopup(that, "booktradeWoBAutocall" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlayWoBAutocall");
            //     hideTileLoader(thisTileWoBAutocall,'loader_WoBAutocall');
            // }

            clearInterval(
              $(thisTileWoBAutocall).find('[id^="hdnintervalID"]').val()
            );
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (er) {
    console.log(er);
    booktradePopup(
      that,
      "booktradeWoBAutocall" + TileId,
      "Please Best Price Before Book Trade, Order Execution Failed!",
      "DivOverlayWoBAutocall"
    );
    hideTileLoader(thisTileWoBAutocall, "loader_WoBAutocall");
  } finally {
  }
}

// function emailQuoteWoBAutocall(that) {
//     try {

//         thisTileWoBAutocall= $(that).parents(".sorting")[0];
//         if ($(thisTileWoBAutocall).find('[id^="hdnChartPricesWoBAutocall"]').val() != undefined)
//             var RFQID = JSON.parse($(thisTileWoBAutocall).find('[id^="hdnChartPricesWoBAutocall"]').val())[0].EP_ER_QuoteRequestId;

//         if (RFQID != undefined && RFQID != '') {
//             //     MailBestQuote(thisTileWoBAutocall.id.match(/\d+$/)[0], JSON.parse($(thisTileWoBAutocall).find('[id^="hdnChartPricesELN"]').val())[0].EP_ER_QuoteRequestId);
//             request_getDataFromAPI({ "userName": sessionStorage.getItem("FinIQUserID").toString(), "rfqId": RFQID, "CurrentTileID": thisTileWoBAutocall.id.match(/\d+$/)[0] }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
//                 console.log(data);
//                 TileId = data.CurrentTileID;

//                 thisTileWoBAutocall = document.getElementById("td" + TileId)
//                 booktradePopup(thisTileWoBAutocall, "booktradeWoBAutocall" + TileId, data.message, "DivOverlayWoBAutocall");

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
var WoBAutocallSharesArray = [];

function loadWoBAutocallShares(thisTileWoBAutocall, currId) {
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
        product: "WoBAutocall",

        CurrentTileID: $(thisTileWoBAutocall).attr("id").match(/\d+$/)[0],
      },
      clientConfigdata.CommonMethods.NodeServer + "getCNSDSharelist"
    ).then((data) => {
      // console.log('CNSD shares ', data.shareResponse.shareList);
      WoBAutocallSharesArray = data.shareResponse.shareList;

      callDropDownFunction(
        $(thisTileWoBAutocall).find('[id^="shareName"]'),
        "WoBAutocall",
        currId,
        WoBAutocallSharesArray
      );
    });
  } catch (error) {
    console.log(error.message);
  }
}

//CNSD Common shares load function
var WoBAutocallSharesArray = [];

function loadWoBAutocallShares(thisTileWoBAutocall, currId) {
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
        product: "WoB Autocall",

        CurrentTileID: $(thisTileWoBAutocall).attr("id").match(/\d+$/)[0],
      },
      clientConfigdata.CommonMethods.NodeServer + "getCNSDSharelist"
    ).then((data) => {
      // console.log('WoB shares ', data.shareResponse.shareList);
      WoBAutocallSharesArray = data.shareResponse.shareList;

      callDropDownFunction(
        $(thisTileWoBAutocall).find('[id^="shareName"]'),
        "WoB Autocall",
        currId,
        WoBAutocallSharesArray
      );
    });
  } catch (error) {
    console.log(error.message);
  }
}
