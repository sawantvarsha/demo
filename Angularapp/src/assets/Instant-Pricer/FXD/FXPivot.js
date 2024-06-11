var FreqFX = ["Monthly/Monthly", "Weekly/Weekly"];
var FreqPivot = ["Daily", "BiWeekly", "Monthly", "Weekly"];
var TradeDateFXPivot;
var frequencynamePivot="";
var tenorListFXPivot = ["1W","2W","3W","4W","1M","2M","3M","4M","5M","6M","7M","8M","9M","10M","11M","1Y","2Y","3Y","5Y","7Y"];
var LeverageArrayPivot = ["1", "2"];

var OptionCutListFXPivot = [];

var FreqPivotArr = ["BiWeekly/BiWeekly", "Monthly/Monthly", "Weekly/Weekly"];
var KIstyleArrPivot = ["No", "E-101", "E-102", "E-112"];
var tenorArrPivot = ["1W", "2W", "1M", "1D"];
var NDFFlagPivot = "";
var IsMetalPivot = '';
var idFXPivot = 16;
var _defaultflagFXPivot = ""; //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
var isSaveTradeIdeaFXPivot; // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
var _eventstrikechangeFXPivot = false; //LGTCLI-422 | Chaitanya M | 5 May 2023
var MinQuoteTimeOutOccurredPivot = false; // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023
var timeoutFXPivot = ""; //LGTGTWINT-2110 | Chaitanya M | 13 June 2023

//Added by RizwanS || LGTGTWINT-2322 || 22 Aug 2023
var MaxQuoteTimeOutPivot = "";
var MinQuoteTimeOutPivot = "";
var LPListPivot = "";
//END

$(document).ready(function () {
  try {
    // getProductDetailsFXD(clientConfigdata.FXPivot.TypeFXPivot);
  } catch (err) {
    console.log(err.message);
  }
});

//To initialize FXPivot product functions while the page is being loaded
function onLoadFXPivot(currId) {
  try {
    thisTileFXPivot = document.getElementById("td" + currId);
    setDeafaultValuesFXPivot(currId);
    $("#" + $(thisTileFXPivot).find('[id^="SharesbuySellPivot"]').attr("id") + " *").attr("disabled", "disabled").off("click");
    $(thisTileFXPivot).find('[id^="loader_FXPivot"]').hide();

    mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false);

    resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    // Added by RizwanS / Channged User id to gateway specific name / 16 Jun 2022
    // $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
    // $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("");  //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023

    // END

    //ADDED FOR NEW UI | Chaitanya M | 02-Feb-2023
    //START
    frequencynamePivot = $(thisTileFXPivot).find('[id^="frequencyFXPivot"]').val();
    if (!$(thisTileFXPivot).find('[id^="rbRowKITogglePivot"]')[0].checked) {

      if (frequencynamePivot.includes("BABS")) {
        if (frequencynamePivot == "BABS1N00") {
          frequencynamePivot = "BABS1Y01"
        } else {
          frequencynamePivot = "BABS2Y02"
        }
      } else if (frequencynamePivot.includes("MAMS")) {
        if (frequencynamePivot == "MAMS1N00") {
          frequencynamePivot = "MAMS1Y01"
        } else {
          frequencynamePivot = "MAMS2Y02"
        }
      } else if (frequencynamePivot.includes("WAWS")) {
        if (frequencynamePivot == "WAWS1N00") {
          frequencynamePivot = "WAWS1Y01"
        } else {
          frequencynamePivot = "WAWS2Y02"
        }
      }
      if (frequencynamePivot.includes("N")) {
        $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').val("").prop("disabled", true);

        $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').val("").prop("disabled", true);
      } else {
        $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').prop("disabled", false);

        $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').prop("disabled", false);
      }

    } else {

      if (frequencynamePivot.includes("N")) {
        $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').val("").prop("disabled", true);

        $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').val("").prop("disabled", true);
      } else {
        $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').prop("disabled", false);

        $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').prop("disabled", false);
      }
    }


    // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
    getMaxLevNotionalFXPivot($(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').val(), frequencynamePivot,
      $(thisTileFXPivot).find('[id^="NOSettlementinpboxFXPivot"]').val(), currId
    );

    if ($(thisTileFXPivot).find('[id^="TypeFXPivot"]').val() == "ITM") {
      $(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]').val("").prop("disabled", true);
      document.querySelector("#" + $(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]').attr("id")).selectedIndex = 0;
    } else {
      $(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]').prop("disabled", false);
    }

    // Added for LGTGTWINT-1667 | FXD-Instant pricer ccy change doesnt happen with ccy pair change  | Chaitanya M | 06 March 2023
    if ($(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val() != $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim()) {
      $(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val($(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim());
      $(thisTileFXPivot).find('[id^="maxlevCCYPivot"]').html("(" + $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim() + ")");
      $(thisTileFXPivot).find('[id^="lblSprdAmtCCy"]').html("(" + $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim() + ")");

      //LGTCLI-437 | Chaitanya M | 11 July 2023
      if ($(thisTileFXPivot).find('[id^="hdnisMetalFX"]').val() === "Y") {

        $(thisTileFXPivot).find('[id^="ccymaxclientprftFX"]').html("(" + $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[1].trim() + ")");

      } else {

        $(thisTileFXPivot).find('[id^="ccymaxclientprftFX"]').html("(" + $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim() + ")");

      }
      //End

    }

    //End

    // if ($(thisTileFXPivot).find('[id^="CappedLossCcyFXPivot"]').val() == "No") {
    //   $(thisTileFXPivot).find('[id^="CappedLossAmountFXPivot"]').val("").prop("disabled", true);
    // } else {
    //   $(thisTileFXPivot).find('[id^="CappedLossAmountFXPivot"]').prop("disabled", false);
    // }

    // $(thisTileFXPivot).find('[id^="CappedLossCcyFXPivot"]').on("change", function () {
    //     try {
    //       if (
    //         $(this).parents(".sorting").find('[id^="CappedLossCcyFXPivot"]').val() == "No"
    //       ) {
    //         $(this).parents(".sorting").find('[id^="CappedLossAmountFXPivot"]').val("").prop("disabled", true);
    //       } else {
    //         $(this).parents(".sorting").find('[id^="CappedLossAmountFXPivot"]').val("10,000.00").prop("disabled", false);
    //       }
    //     } catch (error) {
    //       console.log(error.message());
    //     }
    //   });
    // $(thisTileFXPivot).find('[id^="tenorFXPivot"]').on('change', function() {
    //     try {
    //         $(this).parents(".sorting").find('[id^="FXPivot_CCYPairDemo"]').removeClass('ValidateFieldCSS')
    //         document.getElementById("required").style.display = "none"
    //         var val = this.value;
    //         fillDatesFXPivot($(this).parents(".sorting").find('[id^="FXPivot_CCYPairDemo"]').val(), $(this).parents(".sorting").find('[id^="tenorFXPivot"]').val(), currId);
    //     } catch (error) { console.log(error.message); }
    // });

    // START - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    if (AllowSolveForYN !== "YES") {

      $(thisTileFXPivot).find('[id^="solveforrow"]').hide();

    } else {

      if ($(thisTileFXPivot).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {

        $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').prop("disabled", true);
        $(thisTileFXPivot).find('[id^="spreadAmtFX"]').prop("disabled", false);

      } else {

        $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').prop("disabled", false);
        $(thisTileFXPivot).find('[id^="spreadAmtFX"]').prop("disabled", true);

      }

    }
    // END - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023




    $(thisTileFXPivot).find('[id^="TargetTypeFXPivot"]').on("change", function () { // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023
      try {

        thisTileFXPivot = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
        $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
        $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
        // $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
        //End

        mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        if ($(this).parents(".sorting").find('[id^="TargetTypeFXPivot"]').val() == "Big Figure") { // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

          // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

          if ($(this).parents(".sorting").find('[id^="targetinpboxFXPivot"]').val() == "" || $(this).parents(".sorting").find('[id^="targetinpboxFXPivot"]').val() == null) {

            $(this).parents(".sorting").find('[id^="targetinpboxFXPivot"]').val("100");

          }
        } else {

          // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

          if ($(this).parents(".sorting").find('[id^="targetinpboxFXPivot"]').val() == "" || $(this).parents(".sorting").find('[id^="targetinpboxFXPivot"]').val() == null) {

            $(this).parents(".sorting").find('[id^="targetinpboxFXPivot"]').val("3");

          }

          // $(this).parents(".sorting").find('[id^="TargetPayAdjustFXPivot"]').prop("disabled", true);
          // $(this).parents(".sorting").find('[id^="TargetPayAdjustFXPivot"]')[0].selectedIndex = 0;
          //End
        }

        GetMaxClientProfitCCyFXPivot(currId); // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
      } catch (error) {
        console.log(error.message);
      }
    });

    // changed for LGTGTWINT-1389 | Chaitanya M | 17 Feb 2023
    $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').on("select", function () {   //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike
      try {
        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];
        thisTileFXPivot = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
        _addtileflag = false;
        //_defaultflagFXPivot =true;  //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023      
        // clearPricerTable(thisTileFXPivot);
        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
        //End


        mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        let ccypairsFXPivot = sessionStorage.getItem("CCYListFXPivot");
        if (!ccypairsFXPivot.includes($(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val())) {  //LGTGTWINT-1582 | currency pair validation on instant pricer | Chaitanya M | 02-March-2023

          $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val("");
          ValidateField($(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').attr("id"), "Currency pair not found.", thisTileFXPivot);
          return false;

        } else {

          //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
          //Start
          if ($(this).parents(".sorting").find('[id^="hdnCcyDetailsFXPivot"]').val() == $(this).parents(".sorting").find('[id^="FXPivot_CCYPairDemo"]').val()) {
            return false;
          } else {
            //End

            _defaultflagFXPivot = false;  //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023 
            _eventstrikechangeFXPivot = true; //LGTCLI-426 Chaitanya M | 08 May 2023
            getCurrencyFXPivotRate(currId);
            //ADDED FOR NEW UI | Chaitanya M | 02-Feb-2023
            //START

            // GetMaxClientProfitCCyFXPivot(currId); // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

            $(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val($(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim());
            // $(this).parents(".sorting").find('[id^="SecondaryCcyPivot"]').html(this.value.split("-")[1].trim());
            //END

            $(thisTileFXPivot).find('[id^="maxlevCCYPivot"]').html("(" + $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim() + ")");

            $(thisTileFXPivot).find('[id^="lblSprdAmtCCy"]').html("(" + $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim() + ")");

            $(this).parents(".sorting").find('[id^="BuyCcyFXPivot"]').html("Buy" + " " + this.value.split("-")[0].trim());
            $(this).parents(".sorting").find('[id^="SellCcyFXPivot"]').html("Sell" + " " + this.value.split("-")[0].trim());

            $(this).parents(".sorting").find('[id^="NoCcyFXPivot"]').html("No");
            $(this).parents(".sorting").find('[id^="LeftCcyFXPivot"]').html(this.value.split("-")[0].trim());
            $(this).parents(".sorting").find('[id^="RightcyFXPivot"]').html(this.value.split("-")[1].trim());
            // $(this).parents(".sorting").find('[id^="CcySelectionFXPivot"]')[0].selectedIndex = 0;   
            // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023

            //LGTCLI-437 | Chaitanya M | 11 July 2023
            if ($(thisTileFXPivot).find('[id^="hdnisMetalFX"]').val() === "Y") {

              $(thisTileFXPivot).find('[id^="ccymaxclientprftFX"]').html("(" + $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[1].trim() + ")");

            } else {

              $(thisTileFXPivot).find('[id^="ccymaxclientprftFX"]').html("(" + $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim() + ")");

            }
            //End
            getMaxLevNotionalFXPivot($(this).parents(".sorting").find('[id^="ContractAmtFXPivot"]').val(),
              frequencynamePivot,
              $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXPivot"]').val(),
              currId
            );

            return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
          }     //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
        }

      } catch (error) {
        console.log(error.message);
      }
    });

    //Check for Fixing/Settlement Frequncy // 28 Oct 2020

    $(thisTileFXPivot).find('[id^="frequencyFXPivot"]').on("change", function () {
      try {
        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

        thisTileFXPivot = document.getElementById("td" + currId);
        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
        //End

        // clearPricerTable(thisTileFXPivot);


        mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        checkPivotComboType($(this).parents(".sorting").find('[id^="frequencyFXPivot"]').val(), thisTileFXPivot);

        fillDatesFXPivot(
          $(this).parents(".sorting").find('[id^="FXPivot_CCYPairDemo"]').val(),
          $(this).parents(".sorting").find('[id^="frequencyFXPivot"]').val(),
          $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXPivot"]').val(),
          currId
        );

        // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
        getMaxLevNotionalFXPivot($(this).parents(".sorting").find('[id^="ContractAmtFXPivot"]').val(),
          frequencynamePivot,
          $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXPivot"]').val(),
          currId
        );
        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
      } catch (error) {
        console.log(error.message);
      }
    });

    //END

    //Check for Fixing/Settlement Frequncy // 28 Oct 2020

    $(thisTileFXPivot).find('[id^="NOSettlementinpboxFXPivot"]').on("change", function () {
      try {
        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

        thisTileFXPivot = document.getElementById("td" + currId);
        // clearPricerTable(thisTileFXPivot);
        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
        //End

        mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        fillDatesFXPivot(
          $(this).parents(".sorting").find('[id^="FXPivot_CCYPairDemo"]').val(),
          $(this).parents(".sorting").find('[id^="frequencyFXPivot"]').val(),
          $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXPivot"]').val(),
          currId
        );

        // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
        getMaxLevNotionalFXPivot($(this).parents(".sorting").find('[id^="ContractAmtFXPivot"]').val(),
          frequencynamePivot,
          $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXPivot"]').val(),
          currId
        );
        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
      } catch (error) {
        console.log(error.message);
      }
    });

    //Check for Fixing/Settlement Frequncy // 28 Oct 2020

    $(thisTileFXPivot).find('[id^="FirstFixDate"]').on("change", function () {
      try {
        thisTileFXPivot = $(this).parents(".sorting")[0];

        // clearPricerTable(thisTileFXPivot);
        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
        //End

        mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

        let firstFix = new Date($(this).val());

        if ($(this).val() != "") { /// LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023

          $(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr("disabled", false);

          validatefirstfixingday(thisTileFXPivot, "FirstFixDate", firstFix);  //Added to show error if Saturday or Sunday selected as First- Fixing date | LGTGTWINT-1424| Chaitanya M | 20 Feb 2023

          let formattedDate = firstFix.getDate() + "-" + months[firstFix.getMonth()] + "-" + firstFix.getFullYear();
          $(thisTileFXPivot).find('[id^="lblFirstFixDate"]').html(formattedDate);

          fillDatesONFirstFixFXPIVOT(
            $(this).parents(".sorting").find('[id^="FXPivot_CCYPairDemo"]').val(),
            $(this).parents(".sorting").find('[id^="frequencyFXPivot"]').val(),
            $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXPivot"]').val(),
            $(this).parents(".sorting").find('[id^="FirstFixDate"]').val(),
            currId
          );
        } else {// LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023

          $(thisTileFXPivot).find('[id^="lblFirstFixDate"]').html($(this).val());
          $(thisTileFXPivot).find('[id^="FXPivot_Expiry"]').html("");
          validatefirstfixingday(thisTileFXPivot, "", $(this).val());
        }

        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
      } catch (error) {
        console.log(error.message);
      }
    });

    //END
    //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022

    //ADDED FOR NEW UI | Chaitanya M | 02-Feb-2023
    //START
    $(thisTileFXPivot).find('[id^="CcySelectionToggleFXPivot"]').on("click", function () {
      try {
        thisTileFXPivot = $(this).parents(".sorting")[0];

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
        //End

        $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
        $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
        // clearPricerTable(thisTileFXPivot);

        mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        if ($(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val() == $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim()) {
          $(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val($(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[1].trim());
        } else {
          $(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val($(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim());
        }

        checkDecimalAmt("", thisTileFXPivot);

      } catch (error) {
        console.log(error.message);
      }
    });
    //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
    $(thisTileFXPivot).find('[id^="KITogglePivot"]').on("change", function () {
      try {
        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

        thisTileFXPivot = document.getElementById("td" + currId);

        // clearPricerTable(thisTileFXPivot);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
        //End

        mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        checkPivotComboType(
          $(this).parents(".sorting").find('[id^="frequencyFXPivot"]').val(),
          thisTileFXPivot
        );

         fillDatesFXPivot(
          $(this).parents(".sorting").find('[id^="FXPivot_CCYPairDemo"]').val(),
          $(this).parents(".sorting").find('[id^="frequencyFXPivot"]').val(),
          $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXPivot"]').val(),
          currId
        );

        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
      } catch (er) {
        console.log("error in KI Toggle change ", er.message);
      }
    });

    $(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').on("change", function () {

      thisTileFXPivot = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
      $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
      //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
      //End
      // clearPricerTable(thisTileFXPivot);

      mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      let _notionalamtFXPivot = FormatNotional($(this).parents(".sorting").find('[id^="ContractAmtFXPivot"]').val(), this); // Added for LGTGTWINT-1511  Incorrect max notional calculation | Chaitanya M | 24 feb 2023
      getMaxLevNotionalFXPivot(_notionalamtFXPivot,
        frequencynamePivot,
        $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXPivot"]').val(),
        currId
      );

      GetMaxClientProfitCCyFXPivot(currId, "",); // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').on("change", function () {
      thisTileFXPivot = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
      $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
      //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
      //End
      // clearPricerTable(thisTileFXPivot);

      mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').on("change", function () {
      thisTileFXPivot = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
      $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
      //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
      //End
      // clearPricerTable(thisTileFXPivot);


      mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').on("change", function () {
      thisTileFXPivot = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
      $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
      //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
      //End
      // clearPricerTable(thisTileFXPivot);

      mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    $(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').on("change", function () {
      thisTileFXPivot = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
      $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
      //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
      //End
      // clearPricerTable(thisTileFXPivot);


      mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').on("change", function () {
      thisTileFXPivot = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
      $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);

      $(thisTileFXPivot).find('[id^="hdnStrikevalueFX"]').val($(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
      //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
      //End
      // clearPricerTable(thisTileFXPivot);


      mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      GetMaxClientProfitCCyFXPivot(currId); // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    $(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').on("change", function () {
      thisTileFXPivot = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
      $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
      //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
      //End
      // clearPricerTable(thisTileFXPivot);

      mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      GetMaxClientProfitCCyFXPivot(currId); // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    $(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]').on("change", function () {
      thisTileFXPivot = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
      $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
      //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
      //End
      // clearPricerTable(thisTileFXPivot);

      mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    $(thisTileFXPivot).find('[id^="Optioncutddl"]').on("change", function () {
      thisTileFXPivot = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
      $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      //  $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
      //  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html(""); 
      //End
      // clearPricerTable(thisTileFXPivot);


      mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      resetFXDPrice(thisTileFXPivot); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    $(thisTileFXPivot).find('[id^="ddlSolveForFX"]').on("change", function () {

      currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

      thisTileFXPivot = document.getElementById("td" + currId);
      resetFXDPrice(thisTileFXPivot);

      if ($(thisTileFXPivot).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase().includes("STRIKE")) {

        $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').prop("disabled", true);
        $(thisTileFXPivot).find('[id^="spreadAmtFX"]').prop("disabled", false);
        $(thisTileFXPivot).find('[id^="hdnStrikevalueFX"]').val($(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val(""); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
  
      } else {

        $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').prop("disabled", false);
        $(thisTileFXPivot).find('[id^="spreadAmtFX"]').prop("disabled", true);
        $(thisTileFXPivot).find('[id^="spreadAmtFX"]').val(""); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val($(thisTileFXPivot).find('[id^="hdnStrikevalueFX"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

      }

    });
    // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

    //END
  } catch (error) {
    console.log(error.message);
  }
}

//To set the default values of input fields in FXPivot
function setDeafaultValuesFXPivot(currId) {
  try {
    thisTileFXPivot = document.getElementById("td" + currId);
    $(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').val("100,000.00"); // Default Parameters Change | LGTCLI-310 | Chaitanya M | 17 Feb 2023
    $(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').val("0"); // Default Parameters Change | LGTCLI-310 | Chaitanya M | 17 Feb 2023
    $(thisTileFXPivot).find('[id^="NOSettlementinpboxFXPivot"]').val("52"); // LGTGTWINT-1525 | Chaitanya M | 27 Feb 2023
    $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val("EUR - USD");
    $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val("");
    var lowerStrike = $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').val("");
    var upperStrike = $(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').val("");
    // $(thisTileFXPivot).find('[id^="primaryCcyPivot"]').html("EUR");
    // $(thisTileFXPivot).find('[id^="SecondaryCcyPivot"]').html("USD");
    // $(thisTileFXPivot).find('[id^="CappedLossAmountFXPivot"]').val("10,000.00");    
    getcurrentdate(thisTileFXPivot, "FirstFixDate");
    clearPricerTable(thisTileFXPivot);

    //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
    $(thisTileFXPivot).find('[id^="hdnCcyDetailsFXPivot"]').val($(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val());
    //End

    //Added for ccy pair autocomlete / JIRA - FINGUI - 237 / 14 Feb 2022
    callCcyautocompleteFX(thisTileFXPivot, "FXPivot_CCYPairDemo");

    GetMaxClientProfitCCyFXPivot(currId); // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023


    //END
  } catch (error) {
    console.log(error.message);
  }
}

//To get Trade, Premium, Expiry, Delivery Dates
function fillDatesFXPivot(pair, typeval, NoofFixing, currId) {
  try {

    thisTileFXPivot = document.getElementById("td" + currId);

    //ADDED FOR NEW UI | Chaitanya M | 02-Feb-2023
    //START
    if (!$(thisTileFXPivot).find('[id^="rbRowKITogglePivot"]')[0].checked) {

      if (typeval.includes("BABS")) {
        if (typeval == "BABS1N00") {
          typeval = "BABS1Y01"
        } else {
          typeval = "BABS2Y02"
        }
      } else if (typeval.includes("MAMS")) {
        if (typeval == "MAMS1N00") {
          typeval = "MAMS1Y01"
        } else {
          typeval = "MAMS2Y02"
        }
      } else if (typeval.includes("WAWS")) {
        if (typeval == "WAWS1N00") {
          typeval = "WAWS1Y01"
        } else {
          typeval = "WAWS2Y02"
        }
      }
    }

    frequencynamePivot = typeval;
    //END

    if (
      typeval == "MAMS1Y01" ||
      typeval == "MAMS2Y02" ||
      typeval == "MAMS2Y12"
    ) {
      FixingFrq = FreqPivot[2];
      SettFrq = FreqPivot[2];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "MAMS1N00" || typeval == "MAMS2N00") {
      FixingFrq = FreqPivot[2];
      SettFrq = FreqPivot[2];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (
      typeval == "WAWS1Y01" ||
      typeval == "WAWS2Y02" ||
      typeval == "WAWS2Y12"
    ) {
      FixingFrq = FreqPivot[3];
      SettFrq = FreqPivot[3];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "WAWS1N00" || typeval == "WAWS2N00") {
      FixingFrq = FreqPivot[3];
      SettFrq = FreqPivot[3];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (
      typeval == "BABS1Y01" ||
      typeval == "BABS2Y02" ||
      typeval == "BABS2Y12"
    ) {
      FixingFrq = FreqPivot[1];
      SettFrq = FreqPivot[1];
      tenorCode = NoofFixing * 2 + tenorArrPivot[1][1];
    } else if (typeval == "BABS1N00" || typeval == "BABS2N00") {
      FixingFrq = FreqPivot[1];
      SettFrq = FreqPivot[1];
      tenorCode = NoofFixing * 2 + tenorArrPivot[1][1];
    } else if (
      typeval == "DAWS1Y01" ||
      typeval == "DAWS2Y02" ||
      typeval == "DAWS2Y12"
    ) {
      FixingFrq = FreqPivot[0];
      SettFrq = FreqPivot[3];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "DAWS1N00" || typeval == "DAWS2N00") {
      FixingFrq = FreqPivot[0];
      SettFrq = FreqPivot[3];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (
      typeval == "DAMS1Y01" ||
      typeval == "DAMS2Y02" ||
      typeval == "DAMS2Y12"
    ) {
      FixingFrq = FreqPivot[0];
      SettFrq = FreqPivot[2];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "DAMS1N00" || typeval == "DAMS2N00") {
      FixingFrq = FreqPivot[0];
      SettFrq = FreqPivot[2];
      tenorCode = NoofFixing + SettFrq[0];
    }

    $(thisTileFXPivot).find('[id^="hdnFXPivotTenorCode"]').val(tenorCode);

    // Addded for CFINT-992 // 18-Sep-2020 //

    $(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr("disabled", true);
    $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
    $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
    clearPricerTable(thisTileFXPivot);

    //END
    request_getDataFromAPI(
      {
        "currencyPair": $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().trim(),
        "tradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "tenor_Code": tenorCode,
        "fixing_Frequency": FixingFrq,
        "settlement_Frequency": SettFrq,
        "depoCcy": pair.split("-")[0].trim(),
        "altCcy": pair.split("-")[1].trim(),
        "iProductId": productIDFXPivot,
        "i_ProductCode": productCodePivot,
        "optioncut": $(thisTileFXPivot).find('[id^="Optioncutddl"]').val(),
        "firstFixingChangeYN": "N",
        "firstFixingDate": "",
        "defaultFixingDate": '',
        "defaultSettDate": '',
        "i_Mode": "FXOSEN",
        "tenor": '',
        "prem_Settlement_Days" :'', // Added missing parameters for Date service call | ChaitanyaM | 25-April-2024
        "CurrentTileID": currId + "|" + "",
      },
      clientConfigdata.CommonMethods.NodeServer + "DateCalculationApi/Get_FinIQ_CalculateDatesWrapper", "", "POST", currId + "|" + userName + '_' + 'fillDatesFXO' + '_' + RequestIDGenerator(7)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        let thisTileFXPivot = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        // let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

        let responseHeader = "";

        if(data === "" || data === undefined || data === null){
          responseHeader = "FAIL";
        }else{
          if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
            responseHeader = "FAIL";
          }else{
            responseHeader = "SUCCESS";
          }
        }

        if (responseHeader.toUpperCase() == "SUCCESS") {

          TradeDateFXPivot = setBusinessDate;
          $(thisTileFXPivot).find('[id^="FXPivot_Expiry"]').html(data.dataFromAjax[0].fixingDate); //LGTCLI-401 - Instant Pricer FX Final Fixing Date (FXD) | Chaitanya M | 12 April 2023
          $(thisTileFXPivot).find('[id^="hdnFXPivotPremiumDate"]').val(data.dataFromAjax[0].valueDate);
          $(thisTileFXPivot).find('[id^="hdnFXPivotExpiry"]').val(data.dataFromAjax[0].fixingDate);
          $(thisTileFXPivot).find('[id^="hdnFXPivotDeliveryDate"]').val(data.dataFromAjax[0].maturityDate);
          $(thisTileFXPivot).find('[id^="hdnTenorDaysPivot"]').val(data.dataFromAjax[0].expiryDays);
          $(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr("disabled", false);
          // Addded for CFINT-992 // 18-Sep-2020 //

          setNDFMetalFlagPivot(
            currId,
            productIDFXPivot,
            productCodePivot,
            $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().trim(),
            pair.split("-")[0].trim(),
            pair.split("-")[1].trim(),
            FixingFrq,
            SettFrq,
            $(thisTileFXPivot).find('[id^="hdnFXPivotPremiumDate"]').val(),
            $(thisTileFXPivot).find('[id^="hdnFXPivotExpiry"]').val(),
            $(thisTileFXPivot).find('[id^="hdnFXPivotDeliveryDate"]').val()
          );

          //END
        } else {

          let failReason = "No response received from remote system.";

          ValidateField($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').attr('id'), failReason, thisTileFXPivot);

        }

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

function fillFirstFixingDateFXPivot(pair, typeval, that) {
  try {

    thisTileFXPivot = document.getElementById("td" + that);

    //ADDED FOR NEW UI | Chaitanya M | 02-Feb-2023
    //START
    if (!$(thisTileFXPivot).find('[id^="rbRowKITogglePivot"]')[0].checked) {

      if (typeval.includes("BABS")) {
        if (typeval == "BABS1N00") {
          typeval = "BABS1Y01"
        } else {
          typeval = "BABS2Y02"
        }
      } else if (typeval.includes("MAMS")) {
        if (typeval == "MAMS1N00") {
          typeval = "MAMS1Y01"
        } else {
          typeval = "MAMS2Y02"
        }
      } else if (typeval.includes("WAWS")) {
        if (typeval == "WAWS1N00") {
          typeval = "WAWS1Y01"
        } else {
          typeval = "WAWS2Y02"
        }
      }


    }
    frequencynamePivot = typeval;
    //END

    if (
      typeval == "MAMS1Y01" ||
      typeval == "MAMS2Y02" ||
      typeval == "MAMS2Y12"
    ) {
      FixingFrq = FreqPivot[2];
      SettFrq = FreqPivot[2];
      tenorCode = tenorArrPivot[2];
    } else if (typeval == "MAMS1N00" || typeval == "MAMS2N00") {
      FixingFrq = FreqPivot[2];
      SettFrq = FreqPivot[2];
      tenorCode = tenorArrPivot[2];
    } else if (
      typeval == "WAWS1Y01" ||
      typeval == "WAWS2Y02" ||
      typeval == "WAWS2Y12"
    ) {
      FixingFrq = FreqPivot[3];
      SettFrq = FreqPivot[3];
      tenorCode = tenorArrPivot[0];
    } else if (typeval == "WAWS1N00" || typeval == "WAWS2N00") {
      FixingFrq = FreqPivot[3];
      SettFrq = FreqPivot[3];
      tenorCode = tenorArrPivot[0];
    } else if (
      typeval == "BABS1Y01" ||
      typeval == "BABS2Y02" ||
      typeval == "BABS2Y12"
    ) {
      FixingFrq = FreqPivot[1];
      SettFrq = FreqPivot[1];
      tenorCode = tenorArrPivot[1];
    } else if (typeval == "BABS1N00" || typeval == "BABS2N00") {
      FixingFrq = FreqPivot[1];
      SettFrq = FreqPivot[1];
      tenorCode = tenorArrPivot[1];
    } else if (
      typeval == "DAWS1Y01" ||
      typeval == "DAWS2Y02" ||
      typeval == "DAWS2Y12"
    ) {
      FixingFrq = FreqPivot[0];
      SettFrq = FreqPivot[3];
      tenorCode = tenorArrPivot[3];
    } else if (typeval == "DAWS1N00" || typeval == "DAWS2N00") {
      FixingFrq = FreqPivot[0];
      SettFrq = FreqPivot[3];
      tenorCode = tenorArrPivot[3];
    } else if (
      typeval == "DAMS1Y01" ||
      typeval == "DAMS2Y02" ||
      typeval == "DAMS2Y12"
    ) {
      FixingFrq = FreqPivot[0];
      SettFrq = FreqPivot[2];
      tenorCode = tenorArrPivot[3];
    } else if (typeval == "DAMS1N00" || typeval == "DAMS2N00") {
      FixingFrq = FreqPivot[0];
      SettFrq = FreqPivot[2];
      tenorCode = tenorArrPivot[3];
    }

    $(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr("disabled", true);
    $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
    $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
    clearPricerTable(thisTileFXPivot);

    //END

    request_getDataFromAPI(
      {

        "CurrencyPair": $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().trim(),
        "TradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "Tenor_Code": tenorCode,
        "Fixing_Frequency": FixingFrq,
        "Settlement_Frequency": SettFrq,
        "EntityID": EntityID,
        "LoginID": userName,
        "DepoCcy": pair.split("-")[0].trim(),
        "AltCcy": pair.split("-")[1].trim(),
        "iProductId": productIDFXPivot,
        "I_ProductCode": productCodePivot,
        "ProductCode": productCodePivot,
        // "CurrentTileID": that,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "optioncut": $(thisTileFXPivot).find('[id^="Optioncutddl"]').val()
      },
      clientConfigdata.CommonMethods.NodeServer + "fillFirstFixingDate", "", "POST", that + "|" + userName + '_' + 'fillFirstFixingDate' + '_' + RequestIDGenerator(7)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        let thisTileFXPivot = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let TileId = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

        if (responseHeader.toUpperCase() == "SUCCESS") {

          //$(thisTileFXPivot).find('[id^="FirstFixDate"]').val(data.CalculateDatesResult.Dates[0].FixingDate);
          let strFirstFix = new Date(
            data.CalculateDatesResult.Dates[0].FixingDate
          );
          let firstFix = strFirstFix.getFullYear() +
            "-" +
            ("0" + (strFirstFix.getMonth() + 1)).substr(-2, 2) +
            "-" +
            ("0" + strFirstFix.getDate()).substr(-2, 2);
          $(thisTileFXPivot).find('[id^="FirstFixDate"]').val(firstFix);
          $(thisTileFXPivot).find('[id^="lblFirstFixDate"]').html(data.CalculateDatesResult.Dates[0].FixingDate);
        } else {

          let failReason = data.CalculateDatesResult.A_ResponseHeader.FailedReason;

          ValidateField($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').attr('id'), failReason, thisTileFXPivot);

        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

function fillDatesONFirstFixFXPIVOT(pair, typeval, NoofFixing, custDate, currId) {
  try {

    thisTileFXPivot = document.getElementById("td" + currId);

    //ADDED FOR NEW UI | Chaitanya M | 02-Feb-2023
    //START
    if (!$(thisTileFXPivot).find('[id^="rbRowKITogglePivot"]')[0].checked) {

      if (typeval.includes("BABS")) {
        if (typeval == "BABS1N00") {
          typeval = "BABS1Y01"
        } else {
          typeval = "BABS2Y02"
        }
      } else if (typeval.includes("MAMS")) {
        if (typeval == "MAMS1N00") {
          typeval = "MAMS1Y01"
        } else {
          typeval = "MAMS2Y02"
        }
      } else if (typeval.includes("WAWS")) {
        if (typeval == "WAWS1N00") {
          typeval = "WAWS1Y01"
        } else {
          typeval = "WAWS2Y02"
        }
      }

    }
    frequencynamePivot = typeval;
    //END

    if (
      typeval == "MAMS1Y01" ||
      typeval == "MAMS2Y02" ||
      typeval == "MAMS2Y12"
    ) {
      FixingFrq = FreqPivot[2];
      SettFrq = FreqPivot[2];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "MAMS1N00" || typeval == "MAMS2N00") {
      FixingFrq = FreqPivot[2];
      SettFrq = FreqPivot[2];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (
      typeval == "WAWS1Y01" ||
      typeval == "WAWS2Y02" ||
      typeval == "WAWS2Y12"
    ) {
      FixingFrq = FreqPivot[3];
      SettFrq = FreqPivot[3];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "WAWS1N00" || typeval == "WAWS2N00") {
      FixingFrq = FreqPivot[3];
      SettFrq = FreqPivot[3];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (
      typeval == "BABS1Y01" ||
      typeval == "BABS2Y02" ||
      typeval == "BABS2Y12"
    ) {
      FixingFrq = FreqPivot[1];
      SettFrq = FreqPivot[1];
      tenorCode = NoofFixing * 2 + tenorArrPivot[1][1];
    } else if (typeval == "BABS1N00" || typeval == "BABS2N00") {
      FixingFrq = FreqPivot[1];
      SettFrq = FreqPivot[1];
      tenorCode = NoofFixing * 2 + tenorArrPivot[1][1];
    } else if (
      typeval == "DAWS1Y01" ||
      typeval == "DAWS2Y02" ||
      typeval == "DAWS2Y12"
    ) {
      FixingFrq = FreqPivot[0];
      SettFrq = FreqPivot[3];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "DAWS1N00" || typeval == "DAWS2N00") {
      FixingFrq = FreqPivot[0];
      SettFrq = FreqPivot[3];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (
      typeval == "DAMS1Y01" ||
      typeval == "DAMS2Y02" ||
      typeval == "DAMS2Y12"
    ) {
      FixingFrq = FreqPivot[0];
      SettFrq = FreqPivot[2];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "DAMS1N00" || typeval == "DAMS2N00") {
      FixingFrq = FreqPivot[0];
      SettFrq = FreqPivot[2];
      tenorCode = NoofFixing + SettFrq[0];
    }

    $(thisTileFXPivot).find('[id^="hdnFXPivotTenorCode"]').val(tenorCode);

    // Addded for CFINT-992 // 18-Sep-2020 //

    $(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr("disabled", true);
    $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
    clearPricerTable(thisTileFXPivot);

    //END

    request_getDataFromAPI(
      { 

        "currencyPair": $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().trim(),
        "tradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "tenor_Code": tenorCode,
        "fixing_Frequency": FixingFrq,
        "settlement_Frequency": SettFrq,
        "depoCcy": pair.split("-")[0].trim(),
        "altCcy": pair.split("-")[1].trim(),
        "iProductId": productIDFXPivot,
        "i_ProductCode": productCodePivot,
        "optioncut": $(thisTileFXPivot).find('[id^="Optioncutddl"]').val(),
        "firstFixingChangeYN": "Y",
        "firstFixingDate": custDate,
        "defaultFixingDate": '',
        "defaultSettDate": '',
        "i_Mode": "FXOSEN",
        "tenor": '',
        "prem_Settlement_Days" :'', // Added missing parameters for Date service call | ChaitanyaM | 25-April-2024
        "CurrentTileID": currId + "|" + "",

      },
      clientConfigdata.CommonMethods.NodeServer + "DateCalculationApi/Get_FinIQ_CalculateDatesWrapper", "", "POST", currId + "|" + userName + '_' + 'filldatesafterFix' + '_' + RequestIDGenerator(7)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        
        let thisTileFXPivot = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        // let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

        let responseHeader = "";

        if(data === "" || data === undefined || data === null){
          responseHeader = "FAIL";
        }else{
          if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
            responseHeader = "FAIL";
          }else{
            responseHeader = "SUCCESS";
          }
        }

        if (responseHeader.toUpperCase() == "SUCCESS") {

          $(thisTileFXPivot).find('[id^="FXPivot_Expiry"]').html("");
          $(thisTileFXPivot).find('[id^="hdnFXPivotExpiry"]').val("").val(data.dataFromAjax[0].fixingDate);
          $(thisTileFXPivot).find('[id^="hdnFXPivotDeliveryDate"]').val("").val(data.dataFromAjax[0].maturityDate);
          $(thisTileFXPivot).find('[id^="FXPivot_Expiry"]').html(data.dataFromAjax[0].fixingDate); //LGTCLI-401 - Instant Pricer FX Final Fixing Date (FXD) | Chaitanya M | 12 April 2023
          $(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr("disabled", false);

        } else {

          let failReason = "No response received from remote system."; 

          ValidateField($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').attr('id'), failReason, thisTileFXPivot);

        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}
//To Get Best Price of FXPivot and display the prices
function getBestPriceFXPivot(that, Scheduleflag) {
  try {
    TileIdFXPivot = that.id.match(/\d+$/)[0];
    thisTileFXPivot = document.getElementById("td" + TileIdFXPivot);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");

    validation_clear(); //To Remove highlighted part if no error
    // clearPricerTable(thisTileFXPivot); //To clear prices after clicking best price

    // Added by RizwanS / RFQ ID on UI / 16 Jun 2022
    // $(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').hide();
    // $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("");     //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
    //END


    // Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
    // START - LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    resetFXDPrice(thisTileFXPivot);
    $(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr("disabled", true);
    let _RID_Pivot = "";
    _RID_Pivot = _RID_Pivot + RequestIDGenerator(40);
    $(thisTileFXPivot).find('[id^="hdnRequestID"]').val(_RID_Pivot);
    // END - LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    checkPivotComboType($(thisTileFXPivot).find('[id^="frequencyFXPivot"]').val(), thisTileFXPivot); // LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

    // END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

    let upperKI = $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').val();
    let lowerKI = $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').val();
    var lowerStrike = $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').val();
    var upperStrike = $(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').val();
    var pivotValue = $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val();
    var ki = false;

    if (
      frequencynamePivot.includes("N")
    ) {
      ki = false;
    } else {
      ki = true;
    }
    //Validation conditions added
    if (
      $.trim($(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val()) == ""
    ) {
      ValidateField($(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').attr("id"), "Please Select Currency Pair", thisTileFXPivot);
      return false;
    } else if (
      $.trim($(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').val()) ==
      "" ||
      parseFloat($(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').val()) ==
      0
    ) {
      ValidateField($(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').attr("id"), "Please Enter Valid Notional", thisTileFXPivot);
      return false;
      // } else if ($.trim($(thisTileFXPivot).find('[id^="tenorFXPivot"]').val()) == '') {
      //     ValidateField($(thisTileFXPivot).find('[id^="tenorFXPivot"]').attr('id'), "Please Enter Valid Tenor");
      //     return false
    } else if (
      $.trim(
        $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').val().replace(/,/g, "")) == "" ||
      parseFloat(
        $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').val().replace(/,/g, "")) <= 0
    ) {
      ValidateField($(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').attr("id"), "Please Enter Valid Strike Rate", thisTileFXPivot);
      return false;
    } else if (
      $.trim($(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').val().replace(/,/g, "")) == "" ||
      parseFloat($(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').val().replace(/,/g, "")) <= 0
    ) {
      ValidateField($(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').attr("id"), "Please Enter Valid Strike Rate", thisTileFXPivot);
      return false;
    } else if (
      $.trim($(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').val().replace(/,/g, "")) == "" ||
      parseFloat($(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').val().replace(/,/g, "")) <= 0) {
      ValidateField($(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').attr("id"), "Please Enter Valid Target", thisTileFXPivot);
      return false;
    } else if (lowerStrike == "" || parseFloat(lowerStrike) == 0) {
      ValidateField($(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').attr("id"), "lower strike should be greater than zero", thisTileFXPivot);
      return false;
    } else if (upperStrike == "" || parseFloat(upperStrike) == 0) {
      ValidateField($(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').attr("id"), "upper strike should be greater than zero", thisTileFXPivot);
      return false;
    } else if (ki) {
      if (parseFloat(lowerKI) == "" || parseFloat(lowerKI) == 0 || lowerKI == "") {
        ValidateField($(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').attr("id"), "lower ki should be greater than zero", thisTileFXPivot);
        return false;
      } else if (parseFloat(upperKI) == "" || parseFloat(upperKI) == 0 || upperKI == "") {
        ValidateField($(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').attr("id"), "upper ki should be greater than zero", thisTileFXPivot);
        return false;
      }
      if (parseFloat(upperKI) < parseFloat(upperStrike)) {
        ValidateField($(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').attr("id"), "Upper KI Should be greater than upper strike", thisTileFXPivot);
        return false;
      } else if (parseFloat(lowerStrike) < parseFloat(lowerKI)) {
        ValidateField($(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').attr("id"), "lower stike Should be greater than lower ki", thisTileFXPivot);
        return false;
      } else if (parseFloat(lowerKI) > parseFloat(lowerStrike)) {
        ValidateField($(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').attr("id"), "lower KI Should be less than lower strike ", thisTileFXPivot);
        return false;
      }
    } else if (parseFloat(upperStrike) < parseFloat(pivotValue)) {
      ValidateField($(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').attr("id"), "Upper Strike Should be greater than pivot", thisTileFXPivot);
      return false;
    }
    // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    else if ($(thisTileFXPivot).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("PREMIUM")) {
      if ($.trim($(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val().replace(/,/g, "")) == "" ||
        parseFloat($(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val().replace(/,/g, "")) <= 0
      ) {
        ValidateField($(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').attr("id"), "Please Enter Valid Pivot", thisTileFXPivot);
        return false;
      } else if (parseFloat(pivotValue) < parseFloat(lowerStrike)) {
        ValidateField($(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').attr("id"), "pivot Should be greater than lower strike", thisTileFXPivot);
        return false;
      } else if (pivotValue == "" || parseFloat(pivotValue) == 0) {
        ValidateField($(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').attr("id"), "Pivot should be greater than zero", thisTileFXPivot);
        return false;
      } else if (
        parseFloat($(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val().replace(/,/g, "")) >=
        parseFloat($(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').val().replace(/,/g, ""))
      ) {
        ValidateField($(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').attr("id"), "Pivot should be less than upper strike", thisTileFXPivot);
        return false;
      } else if (
        parseFloat($(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val().replace(/,/g, "")) <=
        parseFloat($(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').val().replace(/,/g, ""))
      ) {
        ValidateField($(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').attr("id"), "Pivot should be greater than lower strike", thisTileFXPivot);
        return false;
      }

    } else if ($(thisTileFXPivot).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {
      if ($.trim($(thisTileFXPivot).find('[id^="spreadAmtFX"]').val().replace(/,/g, "")) == "" ||
        parseFloat($(thisTileFXPivot).find('[id^="spreadAmtFX"]').val().replace(/,/g, "")) <= 0
      ) {
        ValidateField($(thisTileFXPivot).find('[id^="spreadAmtFX"]').attr("id"), "Please Enter Valid Spread Amount", thisTileFXPivot);
        return false;
      }

      // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    }

    //Validation END

    let prmiumDate = new Date(
      $(thisTileFXPivot).find('[id^="hdnFXPivotPremiumDate"]').val()
    );
    let FixingDate = new Date(
      $(thisTileFXPivot).find('[id^="FirstFixDate"]').val()
    );
    let tradedate = new Date(TradeDateFXPivot);

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
    let weekday = new Date($(thisTileFXPivot).find('[id^="FirstFixDate"]').val());
    let dayName = days[weekday.getDay()];

    if (
      dayName.toUpperCase().includes("SAT") ||
      dayName.toUpperCase().includes("SUN")
    ) {
      ValidateField($(thisTileFXPivot).find('[id^="FirstFixDate"]').attr("id"), "First Fixing Date should not fall on holiday.", thisTileFXPivot);
      return false;
    }

    if (
      frequencynamePivot.includes("DAWS") ||
      frequencynamePivot.includes("DAMS")
    ) {
      if (FixingDate.getTime() < tradedate.getTime()) {
        ValidateField($(thisTileFXPivot).find('[id^="FirstFixDate"]').attr("id"), "First fixing should not be less than Trade Date.", thisTileFXPivot);
        return false;
      }
    }

    // LGTCLI-370 Instant Pricer First Fixing Date Next Day || Chaitanya M || 27 March 2023
    // else {
    //   if (prmiumDate.getTime() > FixingDate.getTime()) {
    //     ValidateField($(thisTileFXPivot).find('[id^="FirstFixDate"]').attr("id"),"First fixing should not be less than Premium date.",thisTileFXPivot);
    //     return false;
    //   }
    // }

    //End

    $(thisTileFXPivot).find('[id^="loader_FXPivot"]').show();
    $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true); // Disabling book trade button while pricing is happening
    $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    // Check for KIStyle

    let KIStylePivot = "";
    //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
    if (
      frequencynamePivot.includes("1N") ||
      frequencynamePivot.includes("2N")
    ) {
      KIStylePivot = KIstyleArrPivot[0];
    } else if (
      frequencynamePivot.includes("01")
    ) {
      KIStylePivot = KIstyleArrPivot[1];
    } else if (
      frequencynamePivot.includes("02")
    ) {
      KIStylePivot = KIstyleArrPivot[2];
    } else if (
      frequencynamePivot.includes("12")
    ) {
      KIStylePivot = KIstyleArrPivot[3];
    }

    // END

    // Check For Leverage

    let LeverageFXPivot = "";

    if (
      frequencynamePivot.includes("1Y") ||
      frequencynamePivot.includes("1N")
    ) {
      LeverageFXPivot = LeverageArrayPivot[0];
    } else if (
      frequencynamePivot.includes("2Y") ||
      frequencynamePivot.includes("2N")
    ) {
      LeverageFXPivot = LeverageArrayPivot[1];
    }

    // END

    // Check For Settlement Freq.

    let SettFreqPivot = "";

    if (
      frequencynamePivot.includes("BS")
    ) {
      SettFreqPivot = FreqPivotArr[0];
    } else if (
      frequencynamePivot.includes("MS")
    ) {
      SettFreqPivot = FreqPivotArr[1];
    } else if (
      frequencynamePivot.includes("WS")
    ) {
      SettFreqPivot = FreqPivotArr[2];
    }

    // END

    //  Capped Loss YN check

    // let cappedLossYNPivot = "";
    // let CappedLossAmountFXPivot = "";

    // if ($(thisTileFXPivot).find('[id^="CappedLossCcyFXPivot"]').val() == "No") {
    //   cappedLossYNPivot = "No";
    //   CappedLossAmountFXPivot = "0";
    // } else {
    //   cappedLossYNPivot = "Yes";
    //   CappedLossAmountFXPivot = $(thisTileFXPivot)
    //     .find('[id^="CappedLossAmountFXPivot"]')
    //     .val();
    // }

    //  END

    //  Check for Final Pay and FixingAdjustment

    let finalPayType = "";
    let FixingAdjustment = "";

    if (
      $(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]')[0].value ==
      "ExactN"
    ) {
      finalPayType = "Exact";
      FixingAdjustment = "Notional";
    } else if (
      $(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]')[0].value ==
      "ExactS"
    ) {
      finalPayType = "Exact";
      FixingAdjustment = "Strike";
    } else if (
      $(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]')[0].value ==
      "FullNO"
    ) {
      finalPayType = "Full";
      FixingAdjustment = "None";
    } else if (
      $(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]')[0].value ==
      "None"
    ) {
      finalPayType = "None";
      FixingAdjustment = "None";
    } else if (
      $(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]')[0].value == ""
    ) {
      finalPayType = "";
      FixingAdjustment = "";
    }

    // COMMENTED FOR NEW UI | Chaitanya M| 02 feb-2023

    // var targetBFFXPivot = $(thisTileFXPivot)
    //   .find('[id^="targetinpboxFXPivot"]')
    //   .val(); //Added by shubham k on 20-Oct-2021 for Target In pips
    // var NoofKOITMEventsFXPivot = $(thisTileFXPivot)
    //   .find('[id^="targetinpboxFXPivot"]')
    //   .val();
    // var targetPipsFXPivot = ""; //Added by shubham k on 20-Oct-2021 for Target In pips

    // if ($(thisTileFXPivot).find('[id^="TypeFXPivot"]').val() == "Big Figure") {
    //   NoofKOITMEventsFXPivot = "";
    //   targetPipsFXPivot = (parseFloat(targetBFFXPivot) * 100).toString(); //Added by shubham k on 20-Oct-2021 for Target In pips
    // } else {
    //   targetBFFXPivot = "";
    //   targetPipsFXPivot = "";
    // }

    //END

    // ADDED FOR NEW UI | Chaitanya M| 02 feb-2023

    //   var targetPipsFXPivot = $(thisTileFXPivot)
    //   .find('[id^="targetinpboxFXPivot"]')
    //   .val(); //Added by shubham k on 20-Oct-2021 for Target In pips
    // var NoofKOITMEventsFXPivot = " ";    

    // Added for LGTCLI-368 Instant Pricing BF/Pips Dropdown for FX Tiles | Chaitanya M | 30 March 2023
    // NoofKOITMEventsFXPivot = "";
    // targetBFFXPivot = (parseFloat(targetPipsFXPivot) / 100).toString(); //Added by shubham k on 20-Oct-2021 for Target In pips  

    // Added for LGTCLI-368 Instant Pricing BF/Pips Dropdown for FX Tiles | Chaitanya M | 30 March 2023
    var targetBFFXPivot = ""
    var targetPipsFXPivot = "";
    var NoofKOITMEventsFXPivot = ""

    if ($(thisTileFXPivot).find('[id^="TargetTypeFXPivot"]').val() == "Big Figure") { // Added for LGTCLI-368 Instant Pricing BF/Pips Dropdown for FX Tiles | Chaitanya M | 30 March 2023

      targetBFFXPivot = $(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').val();
      targetPipsFXPivot = (parseFloat(targetBFFXPivot) * 100).toString();

    } else {

      targetPipsFXPivot = $(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').val();
      targetBFFXPivot = (parseFloat(targetPipsFXPivot) / 100).toString();

    }
    //End
    //END

    // LGTGTWINT-975 Instant Pricer | Missing KIYesNo tag in external XML for pricing

    let KIYN = "";

    if (frequencynamePivot.includes("N")) {

      KIYN = "No"

    } else {

      KIYN = "Yes"

    }

    //END

    let lowerKIVal =
      ki === true
        ? $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').val()
        : "";
    let upperKIVal =
      ki === true
        ? $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').val()
        : "";

    // LGTCLI-285 -Instant Pricing TARF PM Prem CCY in 1st CCY || RizwanS || 01 Feb 2023

    let _premCcy = "";

    if ($(thisTileFXPivot).find('[id^="hdnisMetalFX"]').val() === "Y") { //LGTCLI-437 | Chaitanya M | 11 July 2023

      _premCcy = $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[1].trim();

    } else {

      _premCcy = $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim();

    }

    // END

    // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    let _LPList = "";
    if (AllowSolveForYN === "YES") {
      if ($(thisTileFXPivot).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {
        _LPList = LPListPivot.split("|")[1];
      } else {
        _LPList = LPListPivot.split("|")[0];
      }
    } else {
      _LPList = LPListPivot.split("|")[0];
    }
    // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023


    //LGTGTWINT-2110 | Chaitanya M | 13 JJuly 2023
    timeoutFXPivot = parseInt(MinQuoteTimeOutPivot) - 1;
    $(thisTileFXPivot).find('[id^="hdntimerFX"]').val("");
    $(thisTileFXPivot).find('[id^="hdntimerFX"]').val(timeoutFXPivot);
    //End

    //SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 1 Nov 2023
    let _strikePivot = "";
    let _premiumPivot = "";
    let _SolveForPivot = "";
    let ShowRFSPivot =""; // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023

    if (AllowSolveForYN === "YES") {
      if ($(thisTileFXPivot).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {

        _strikePivot = "0";
        _premiumPivot = $(thisTileFXPivot).find('[id^="spreadAmtFX"]').val().replace(/,/g, "");
        _SolveForPivot = $(thisTileFXPivot).find('[id^="ddlSolveForFX"]').val().toUpperCase();
        ShowRFSPivot = isRFS === true ? false : isRFS; // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023

      } else {

        _strikePivot = $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val().replace(/,/g, "");
        _premiumPivot = "0";
        _SolveForPivot = $(thisTileFXPivot).find('[id^="ddlSolveForFX"]').val().toUpperCase();
        ShowRFSPivot = isRFS ;  // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023

      }
    } else {
      _strikePivot = $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val().replace(/,/g, "");
      _premiumPivot = "0";
      _SolveForPivot = "PREMIUM";
      ShowRFSPivot = isRFS ; // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023
    }
    // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

    console.log("PricingFor ::", TileIdFXPivot, productCodePivot); //Removed unwanted console log || RizwanS || 08 May 2023

    var xmlstrPivot =
      "<ExcelSheets>" +
      "<Sheet1>" +
      "<Product_Name>" + ProductNamePivot + "</Product_Name>" +
      "<Hedging_x0020_Type>" + clientConfigdata.FXDCommonMethods.Hedging_Type + "</Hedging_x0020_Type>" +
      "<CustID>" + custID + "</CustID>" +
      "<Customer_Name>" + custName + "</Customer_Name>" +
      "<CAI_ID>" + clientConfigdata.FXDCommonMethods.CAI_ID + "</CAI_ID>" +
      "<TargetInPips>" + targetPipsFXPivot + "</TargetInPips>" +
      "<TargetGainunit>" + "Big Figure" + "</TargetGainunit>" + //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023      
      "<TargetBF>" + targetBFFXPivot + "</TargetBF>" + // Added for sending Target in Big Figure in XML || Chaitanya M || 16 March 2023
      //Start Added by shubham k on 20-Oct-2021 for Target In pips
      //"<NoofKOITMEvents>" +NoofKOITMEventsFXPivot +"</NoofKOITMEvents>" + // Added for LGTCLI-368 Instant Pricing BF/Pips Dropdown for FX Tiles | Chaitanya M | 30 March 2023
      "<NoofKOITMEvents></NoofKOITMEvents>" +// Added for LGTCLI-368 Instant Pricing BF/Pips Dropdown for FX Tiles | Chaitanya M | 30 March 2023
      "<OptionCut>" + $(thisTileFXPivot).find('[id^="Optioncutddl"]').val() + "</OptionCut>" +
      "<NonDeliveryYN>"+$(thisTileFXPivot).find('[id^="hdnNDFFlagFX"]').val()+"</NonDeliveryYN>" + // HSBCFXEINT-25 || Chaitanya M  || 24-Jan 2024// HSBCFXEINT-25 || RizwanS || 14 Dec 2023 
      "<Freq>" + SettFreqPivot + "</Freq>" +
      "<FirstFixingDate>" + $(thisTileFXPivot).find('[id^="FirstFixDate"]').val() + "</FirstFixingDate>" +
      // "<FixingSettFreq>" + SettFreqPivot + "</FixingSettFreq>" +
      "<Currency1>" + $(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val() + "</Currency1>" +
      "<CcyPair>" + $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().trim() + "</CcyPair>" +
      "<PremiumCcy>" + _premCcy + "</PremiumCcy>" +
      "<CustPrem>0</CustPrem>" +
      "<TradeDate>" + TradeDateFXPivot + "</TradeDate>" +
      "<PremiumDate>" + $(thisTileFXPivot).find('[id^="hdnFXPivotPremiumDate"]').val() + "</PremiumDate>" +
      "<FixingDate>" + $(thisTileFXPivot).find('[id^="hdnFXPivotExpiry"]').val() + "</FixingDate>" +
      "<SettDate>" + $(thisTileFXPivot).find('[id^="hdnFXPivotDeliveryDate"]').val() + "</SettDate>" +
      "<TenorDays>" + $(thisTileFXPivot).find('[id^="hdnTenorDaysPivot"]').val() + "</TenorDays>" +
      "<Tenor>" + $(thisTileFXPivot).find('[id^="hdnFXPivotTenorCode"]').val() + "</Tenor>" +
      "<BuySell>Buy</BuySell>" +
      "<Spotrate>" + $(thisTileFXPivot).find('[id^="rateFXPivot"]').html().split("/")[1].replace(/,/g, "").trim() + "</Spotrate>" +
      "<LeverageFactor>" + LeverageFXPivot + "</LeverageFactor>" +
      "<Ccy1PerFixing>" + $(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').val().replace(/,/g, "").split(".")[0] + "</Ccy1PerFixing>" +
      "<Strike>" + _strikePivot + "</Strike>" + // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      "<PivotStrike>" + $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val().replace(/,/g, "") + "</PivotStrike>" +
      "<LowerStrike>" + $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').val().replace(/,/g, "") + "</LowerStrike>" +
      "<UpperStrike>" + $(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').val().replace(/,/g, "") + "</UpperStrike>" +
      "<KIBarrierType></KIBarrierType>" +
      "<KI>" + lowerKIVal + "</KI>" +
      "<KIStyle>" + KIStylePivot + "</KIStyle>" +
      "<FinalPayType>" + finalPayType + "</FinalPayType>" +
      "<FixingAdjustment>" + FixingAdjustment + "</FixingAdjustment>" +
      "<UpperKI>" + upperKIVal + "</UpperKI>" +
      // "<CappedLossCcy>" + $(thisTileFXPivot).find('[id^="CappedLossCcyFXPivot"]').val() + "</CappedLossCcy>" +
      // "<CappedLossYN>" + cappedLossYNPivot + "</CappedLossYN>" +
      // "<CappedLossAmount>" +  CappedLossAmountFXPivot + "</CappedLossAmount>" +
      "<EntityID>" + sessionStorage.getItem("HomeEntityID") + "</EntityID>" +
      "<NoofSett>" + $(thisTileFXPivot).find('[id^="hdnFXPivotNoOfFixings"]').val() + "</NoofSett>" +
      "<KIYesNo>" + KIYN + "</KIYesNo>" + // LGTGTWINT-975 Instant Pricer | Missing KIYesNo tag in external XML for pricing
      "</Sheet1>" +
      "</ExcelSheets>";

    $(thisTileFXPivot).find('[id^="hdnXmlStrFXPivot"]').val(xmlstrPivot);
    if (Scheduleflag) {
      GetRulescheduleFXD(TileIdFXPivot, xmlstrPivot, TemplateCodeFXPivot, TemplateIDFXPivot
      );
    } else {
      USERID_FXPivot = "MGU_" + sessionStorage.getItem("Username");
      $(thisTileFXPivot).find('[id^="hdnUserIDFXPivot"]').val(USERID_FXPivot);

      if ($(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val() == $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[1].trim()) {
        _AlternateCCy = $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim();
      } else {
        _AlternateCCy = $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[1].trim();
      }

      mapleLoaderStart(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      let FXPivotPricingObject = {       
        
        "ProductType": productCodePivot.toUpperCase(),
        "CurrencyPair": $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().trim(),
        "DepositCurrency": $(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val(),
        "PremCurrency": _premCcy,
        "AlternateCurrency": _AlternateCCy,
        "SettlementCcy": _premCcy,
        "AmountInDepositCurrency": $(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').val().replace(/,/g, "").split(".")[0],
        "SolveFor": _SolveForPivot,
        "BuySell": "Buy",
        "CallPut": "",
        "Strike": _strikePivot,
        "LowerBarrier": 0,
        "UpperBarrier": 0,
        "BarrierType": "",
        "KnockIn_Style": KIStylePivot,
        "KnockOut_Style": "EUROPEAN",
        "OptionCut": $(thisTileFXPivot).find('[id^="Optioncutddl"]').val(),
        "MarketPremium": "0",
        "MarketPremiumAmount": _premiumPivot,
        "RMMarginPercentage": "0",
        "Tenor": $(thisTileFXPivot).find('[id^="hdnFXPivotTenorCode"]').val(),
        "TradeDate": TradeDateFXPivot,
        "ValueDate": $(thisTileFXPivot).find('[id^="hdnFXPivotPremiumDate"]').val(),
        "FixingDate": $(thisTileFXPivot).find('[id^="hdnFXPivotExpiry"]').val(),
        "MaturityDate": $(thisTileFXPivot).find('[id^="hdnFXPivotDeliveryDate"]').val(),
        "NDFFlag": $(thisTileFXPivot).find('[id^="hdnNDFFlagFX"]').val() ,// HSBCFXEINT-25 || Chaitanya M  || 24-Jan 2024
        "IsMetal": $(thisTileFXPivot).find('[id^="hdnisMetalFX"]').val(),
        "UserID": userName,
        "EntityId": EntityID,
        "IndicativeQuote": "",
        "Deal_Rate2": "",
        "NoteMasterID": "0",
        "blnIsMultiLeg": true,
        "InternalLPID": "",
        "NotionalInPremCcy": "0",
        "PriceProviderDetails": _LPList,
        "CIF_Code": "",
        "BTB_Protfolio_Code": "",
        "Marketer_Code": "",
        "Strategy_Code": "",
        "ExternalXMLString": xmlstrPivot,
        "UseExternalXML_Source": true,
        "TemplateCode": TemplateCodeFXPivot,
        "TemplateID": TemplateIDFXPivot,
        "ProductID": productIDFXPivot,
        "RFQSource": "Instant_Pricer",
        "requestID": userName + '_' + 'getPriceFXPivot' + '_' + RequestIDGenerator(7),
        "PriceMode":ShowRFSPivot,  // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023
        "Mode": "FXOSEN",
        "DI_YN": "N",
        "KIType": "",
        "Remark": "",
        "CapLoss": "",
        "DCDRFQID": "",
        "GroupKey": "",
        "Frequency": SettFreqPivot,
        "CapLossCcy": "",
        "TargetType": "",
        "PayAtStrike": "",
        "AdjustmentYN": "",
        "PricingModel": "Black Scoles",
        "CapLossAmount": "",
        "AdjustmentType": "",
        "ResponseMethod": "",
        "DIfromTradeIdea": "",
        "Parant_DCDRFQID": "",
        "StrikeAdjustment": "",
        "CustomerPremAmount": "",
        "GuaranteedLeverageYN": "",
        "Bank_Prem_CashFlow_Direction": "",
        "Target": "",
        "CurrentTileID": TileIdFXPivot +  "|" + $(thisTileFXPivot).find('[id^="hdnRequestID"]').val(),

      };

      request_getDataFromAPI(FXPivotPricingObject, clientConfigdata.CommonMethods.NodeServer + "fxobestprice/GetFXOPriceFromExternalProvidersJSON", "", "POST", TileIdFXPivot + "|" + userName + '_' + 'getPriceFXPivot' + '_' + RequestIDGenerator(7)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        .then((data) => {

          thisTileFXPivot = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
          let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

          // Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
          if ($(thisTileFXPivot).find('[id^="hdnRequestID"]').val() != data.CurrentTileID.split("|")[1] || $(thisTileFXPivot).find('[id^="hdnRequestID"]').val() === "") { // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

            mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false);
            return false;

          } 
          // END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

          //LGTGTWINT-2128 || RizwanS || 09 Jun 2023
          // let responseHeader = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.Status;
          
          let responseHeader = "";
          if(data === "" || data === undefined || data === null){
            responseHeader = "FAIL";
          }else{
            if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
              responseHeader = "FAIL";
            }else{
              responseHeader = "SUCCESS";
            }
          }
          
          let _dcdRFQID = "";
          if (responseHeader.toUpperCase() === "SUCCESS") {
            const o_DCDRFQID = data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID;
            if (o_DCDRFQID && o_DCDRFQID !== null && o_DCDRFQID !== undefined) {
              _dcdRFQID = o_DCDRFQID;
            }
          }
          //END

          // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023
          if(_SolveForPivot === "PREMIUM"){

            // LGTGTWINT-1934 FXD | Dynamic pricing on Instant pricer || RizwanS || 20 May 2023
            if (isRFS) {

              if (responseHeader == "SUCCESS") { // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023  

                //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
                $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("");
                $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);  //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
                //End

                let _priceObj = data.dataFromAjax.oPriceResponseBody;

                if (_priceObj.length > 0) {

                  $(thisTileFXPivot).find('[id^="hdnNMID"]').val(_priceObj[0].NoteMasterID);
                  $(thisTileFXPivot).find('[id^="hdno_DCDRFQID"]').val(_priceObj[0].o_DCDRFQID);

                  let quoteString = "";
                  for (i = 0; i < _priceObj.length; i++) {
                    let quoteId = _priceObj[i].quoteId;
                    quoteString += quoteString.length == 0 ? quoteId : "," + quoteId;
                  }
                  dictFXD[data.currentTile] = quoteString; //To add element in dictionary
                  $(thisTileFXPivot).find('[id^="hdnPricesFXObj"]').val(JSON.stringify(data));
                  $(thisTileFXPivot).find('[id^="hdnQuoteString"]').val(quoteString);
                  callHub(quoteString, MaxQuoteTimeOutPivot);

                  // START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
                  setminimumtimoutFXPivot(MinQuoteTimeOutPivot, thisTileFXPivot, $(thisTileFXPivot).find('[id^="hdnRFSMinTimer"]')[0], data._requestID); // LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
                  startRFSTimerFXPivot(thisTileFXPivot, $(thisTileFXPivot).find('[id^="hdntimerInterval"]')[0], data._requestID); //LGTGTWINT-2110 | Chaitanya M | 13 June 2023 
                  // End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023

                  return false;
                }

              } else {

                //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
                if (_dcdRFQID !== "") {
                  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("");
                  $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
                }
                //End

                MapPricesFXPIVOT(data, thisTileFXPivot, false); // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 
              }

            } else {

              //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              if (_dcdRFQID !== "") {
                $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("");
                $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
              }
              //End

              MapPricesFXPIVOT(data, thisTileFXPivot, false); //FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || RizwanS || 02 May 2023 
            }//END

          }else{
            
            if (_dcdRFQID !== "") {
              $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("");
              $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
            }
            
            MapPricesFXPIVOT(data, thisTileFXPivot, false); //FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || RizwanS || 02 May 2023 

          }

        }).catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    console.log(error.message);
  }
}

// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023

function startRFSTimerFXPivot(thisTileFXPivot, uniqueTimeoutID, _requestID) {
  try {
    uniqueTimeoutID.value = setInterval(function () {

      // Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
      if ($(thisTileFXPivot).find('[id^="hdnRequestID"]').val() != _requestID || $(thisTileFXPivot).find('[id^="hdnRequestID"]').val() === "") { // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        // mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false);
        return false;

      }
      // END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

      showtimerYNFXPivot = "Y";
      if (Number($(thisTileFXPivot).find('[id^="hdntimerFX"]').val()) >= 0) {

        if ($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val() === "" || $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val() === null || $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val() === undefined) {

          $(thisTileFXPivot).find('[id^="TimerDiv"]').removeClass("Showtimer");
          //$(thisTileFXPivot).find('[id^="SignalRTimer"]').html(Number($(thisTileFXPivot).find('[id^="hdntimerFX"]').val()));
          $(thisTileFXPivot).find('[id^="hdntimerFX"]').val(Number($(thisTileFXPivot).find('[id^="hdntimerFX"]').val()) - 1)

        } else {

          $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
          $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
          $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);

          $(thisTileFXPivot).find('[id^="TimerDiv"]').addClass("Showtimer");
          $(thisTileFXPivot).find('[id^="SignalRTimer"]').attr('title', 'You can place order after ' + Number($(thisTileFXPivot).find('[id^="hdntimerFX"]').val()) + ' seconds.');
          $(thisTileFXPivot).find('[id^="SignalRTimer"]').html(Number($(thisTileFXPivot).find('[id^="hdntimerFX"]').val()));
          $(thisTileFXPivot).find('[id^="hdntimerFX"]').val(Number($(thisTileFXPivot).find('[id^="hdntimerFX"]').val()) - 1);

        }
      } else {
        $(thisTileFXPivot).find('[id^="TimerDiv"]').addClass("Showtimer");
        $(thisTileFXPivot).find('[id^="SignalRTimer"]').html("");
        $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", false);
        $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", false);

        clearInterval(uniqueTimeoutID.value);
        uniqueTimeoutID.value = "";
      }
    }, 1000);


  } catch (error) {
    console.log(error.message);
  }
}
// End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023

// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
function setminimumtimoutFXPivot(MinQuoteTimeOutPivot, thisTileFXPivot, _uniqueMinTimerid, _requestID) {
  try {

    if ($(thisTileFXPivot).find('[id^="hdnRequestID"]').val() != _requestID || $(thisTileFXPivot).find('[id^="hdnRequestID"]').val() === "") { // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      // mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false);
      return false;

    }

    _uniqueMinTimerid.value = setTimeout(minQuoteTimeOccurredPivot, parseInt(MinQuoteTimeOutPivot) * 1000, thisTileFXPivot, $(thisTileFXPivot).find('[id^="hdnRFSMinTimer"]')[0], _requestID); // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 

  } catch (error) {
    console.log(error.message);
  }
}
// End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
// END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
function closetimerFXPivot(validInterval, thisTileFXPivot) {
  try {

    // if($(thisTileFXPivot).find('[id^="SignalRTimer"]').html() == ""){
    clearInterval(validInterval);
    showtimerYNFXPivot = "N";
    //  }

  } catch (error) {
    console.log(error.message);
  }
}
// End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023

//FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
function minQuoteTimeOccurredPivot(thistile, _uniqueMinTimerid, _requestID) { // LGTGTWINT-2110 | Chaitanya M | 13 July 2023
  try {

    MinQuoteTimeOutOccurredPivot = true;

    if ($(thistile).find('[id^="hdnRequestID"]').val() != _requestID || $(thistile).find('[id^="hdnRequestID"]').val() === "") { // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      //mapleLoaderStop(thistile, '[id^="btnBestPriceFXPivot"]', false);
      return false;

    }

    if ($(thistile).find('[id^="hdnsignalRMsgRecv"]').val().toUpperCase() === "YES") {

      mapleLoaderStop(thistile, '[id^="btnBestPriceFXPivot"]', false);
      $(thistile).find('[id^="hdnsignalRMsgRecv"]').val("NO");
      $(thistile).find('[id^="BookTradeFXPivot"]').attr("disabled", false);
      $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
      $(thistile).find('[id*="btnemailquote"]').attr("disabled", false);

      MinQuoteTimeOutOccurredPivot = false;
      UnsubcribeRFQID(thistile);
      clearTimeout(_uniqueMinTimerid.value);
      _uniqueMinTimerid.value = "";

    } else {

      clearTimeout(_uniqueMinTimerid.value);
      _uniqueMinTimerid.value = "";
      maxQuoteTimeOutRFSPivot(thistile, $(thistile).find('[id^="hdnRFSMaxTimer"]')[0], _requestID);  //LGTGTWINT-2110 | Chaitanya M | 13 July 2023

    }

  } catch (error) {
    console.log(error.message);
  }
}
//End
// END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

//FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
function maxQuoteTimeOutRFSPivot(thistile, _uniqueMaxTimerid, _requestID) {
  try {
    MaxQuoteTimeOut = parseInt(MaxQuoteTimeOutPivot) - parseInt(MinQuoteTimeOutPivot);

    if ($(thistile).find('[id^="hdnRequestID"]').val() != _requestID || $(thistile).find('[id^="hdnRequestID"]').val() === "") { // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      //mapleLoaderStop(thistile, '[id^="btnBestPriceFXPivot"]', false);
      return false;

    }

    _uniqueMaxTimerid.value = setTimeout(() => { // LGTGTWINT-2110 | Chaitanya M | 13 July 2023

      maxQuoteTimeOccurredPivot = true;
      // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023

      if ($(thistile).find('[id^="hdnsignalRMsgRecv"]').val().toUpperCase() === "YES") {

        UnsubcribeRFQID(thistile);

        clearTimeout(_uniqueMaxTimerid.value);
        _uniqueMaxTimerid.value = "";
        closetimerFXPivot(_uniqueMaxTimerid);

        $(thistile).find('[id^="btnBestPriceFXPivot"]').attr("disabled", false);
        $(thistile).find('[id^="btnemailquote"]').attr("disabled", false);
        $(thistile).find('[id^="BookTradeFXPivot"]').attr("disabled", false);
        $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        mapleLoaderStop(thistile, '[id^="btnBestPriceFXPivot"]', false);
        $(thistile).find('[id^="hdnsignalRMsgRecv"]').val("NO");

      } else if ($(thistile).find('[id^="hdnsignalRMsgRecv"]').val() == "") {

        if ($(thistile).find('[id^="hdnQuoteString"]').val() !== "") { // LGTGTWINT-1934 || RizwanS || 05 Jun 2023 

          UnsubcribeRFQID(thistile);
          clearTimeout(_uniqueMaxTimerid.value);
          _uniqueMaxTimerid.value = "";

          $(thistile).find('[id^="btnBestPriceFXPivot"]').attr("disabled", false);
          $(thistile).find('[id^="btnemailquote"]').attr("disabled", true);
          $(thistile).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
          $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", true);

          mapleLoaderStop(thistile, '[id^="btnBestPriceFXPivot"]', false);

          if ($(thistile).find('[id^="hdnRequestID"]').val() === _requestID) { // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

            ValidateField($(thistile).find('[id^="btnBestPriceFXPivot"]').attr("id"), "No response received from remote system.", thistile);

          }
        }
      }
      //End

    }, MaxQuoteTimeOut * 1000);

  } catch (error) {
    console.log(error.message);
  }
}

//End
// END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023


//FXD | Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || RizwanS || 02 May 2023
function MapPricesFXPIVOT(data, thisTileFXPivot, isRFS) {
  try {

    // let responseHeader = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.Status;

    let _failedreason ="";
    let failReason=""; 
    let responseHeader = "";
    
    if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
      responseHeader = "FAIL";
    }else{
      if(data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider === "FAIL:FAIL" || data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider === "" ||
      data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider === undefined || data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider === null){
        responseHeader = "FAIL";
      }else{
        responseHeader = "SUCCESS";
      }      
    }

    if (responseHeader.toUpperCase() == "SUCCESS") {

      // console.log("Best Price Log's for Tile FXPivot ::" +" " +data.currentTile +"\n" + data.dataFromAjax.oPriceResponseBody[0].o_BestPriceLog);
      // console.log("Log's for Tile FXPivot :: DCDRFQID ==" + data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID +"\n" +"NoteMasterID==" + data.dataFromAjax.oPriceResponseBody[0].NoteMasterID +"\n" +"USERID==" +$(thisTileFXPivot).find('[id^="hdnUserIDFXPivot"]').val());

      // Added by RizwanS / RFQ ID on UI / 16 Jun 2022

      //LGTGTWINT-1740 | Chaitanya M | 05 June 2023
      //$(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').show();
      // $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("");
      // $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("RFQ ID : " + data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID);  
      //End

      // END

      $(thisTileFXPivot).find('[id^="FXPivot_BankNameRow"]').empty();
      $(thisTileFXPivot).find('[id^="FXPivot_PriceRow"]').empty();
      // Added by Atharva - Timers - START
      $(thisTileFXPivot).find('[id^="FXPivot_TimerRow"]').empty();
      // END

      // Storing price object in hidden field of current tile
      let FXPivotPriceData = data.dataFromAjax.oPriceResponseBody; // LGTGTWINT-1934 | Chaitanya M | 01 Jun 2023
      $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val(JSON.stringify(FXPivotPriceData));

      $(thisTileFXPivot).find('[id^="RFQFXPivot"]').val(JSON.stringify(FXPivotPriceData));
      if (
        JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[0].provider == null ||
        JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[0].NoteMasterID == null ||
        JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[0].bestPriceProvider == "FAIL"
      ) {
        $(thisTileFXPivot).find('[id^="FXPivot_BankNameRow"]').append("<td> - </td>");
        $(thisTileFXPivot).find('[id^="FXPivot_PriceRow"]').append("<td> - </td>");
        // Added by Atharva - Timers - START
        $(thisTileFXPivot).find('[id^="FXPivot_TimerRow"]').append("<td> - </td>");
        // END
        $(thisTileFXPivot).find('[id^="loader_FXPivot"]').hide();

        // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
        if (isRFS != true) {
          $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", false);
          $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
          $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", false);
        }
        //End


        //To fetch error from network response
        if (
          JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[0].errormessage != ""
        ) {
          ValidateField("hdnctlvalidation", JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[0].errorMessage.split(".")[0], thisTileFXPivot);
        } //END Error
        return false;
      } else {
        var BestPP = JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[0].bestPriceProvider.split(":")[0];
        DCDRFQidFXPivot = JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[0].o_DCDRFQID;
        bestProviderFXPivot = JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[0].bestPriceProvider.split(":")[0];
        // Added by Atharva - Timers - START
        // Passing extra parameter to plotprice
        // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        quoteidFXPivot = PlotPrice(
          JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()),
          BestPP,
          "#" + $(thisTileFXPivot).find('[id^="FXPivot_BankNameRow"]').attr("id"),
          "#" + $(thisTileFXPivot).find('[id^="FXPivot_PriceRow"]').attr("id"),
          thisTileFXPivot, $(thisTileFXPivot).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase()
        );

        // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        $(thisTileFXPivot).find('[id^="spreadAmtFX"]').val($(thisTileFXPivot).find('[id^="hdnIBPremFX"]').val());

        if($(thisTileFXPivot).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase() !== "PREMIUM"){ 
  
          $(thisTileFXPivot).find('[id^="hdnStrikevalueFX"]').val($(thisTileFXPivot).find('[id^="hdnClientStrikeFX"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
          $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val($(thisTileFXPivot).find('[id^="hdnClientStrikeFX"]').val());
        }
        // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        $(thisTileFXPivot).find('[id^="hdnQuoteIDFXPivot"]').val(quoteidFXPivot);


        // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
        // ----------------------------------Start-------------------------------
        
        let AskspotFXPivot = $(thisTileFXPivot).find('[id^="rateFXPivot"]').html().split("/")[1].replace(/,/g, "").trim();
        let BidSpotFXPivot = $(thisTileFXPivot).find('[id^="rateFXPivot"]').html().split("/")[0].replace(/,/g, "").trim();
       
        AskspotFXPivot = numberWithCommas(Number($(thisTileFXPivot).find('[id^="hdnSpotRateFX"]').val()));

        $(thisTileFXPivot).find('[id^="rateFXPivot"]').html(BidSpotFXPivot + " / " + AskspotFXPivot);

        // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
        // ----------------------------------End---------------------------------


        // Added by Atharva - Timers - START
        if (BestPP != "FAIL" && BestPP !== undefined && BestPP != "" && BestPP != null) {

          startTimers(data.CurrentTileID.split("|")[0]);
        }
        // END
      }

      $(thisTileFXPivot).find('[id^="loader_FXPivot"]').hide();

      // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      if (isRFS != true) {
        $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", false);
        $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", false);
      }
      //End

      if (
        JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()) != null ||
        JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val()) != undefined
      ) {
        drawgraphFXPivot($(thisTileFXPivot).find('[id^="canvas"]').attr("id"));
      }

      mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023

      // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      if (isRFS != true) {
        $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", false);
        $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", false);
      }
      //End

    } else if (data.dataFromAjax == null) {

      // if (data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != null ||
      //   data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != "") {

      //   _failedreason = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason;
      //   ValidateField($(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr('id'), _failedreason, thisTileFXPivot);

      // } else {

        _failedreason = "Pricing Failed!";
        ValidateField($(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr('id'), _failedreason, thisTileFXPivot);

      // }
        $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", false);  
        $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", false);
      // // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 || LGTGTWINT-2128
      // if(isRFS != true){
      //   $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", false);  
      //   $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
      //   $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", false);
      // }
      // //End

    }
    //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 
    else if (data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider === null ||
      data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider == "") {

      if (data.dataFromAjax.oPriceResponseBody[0].errorMessage === null ||
        data.dataFromAjax.oPriceResponseBody[0].errorMessage === '') {
        //End
        // if (data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != null ||
        //   data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != "") {

        //   _failedreason = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason;
        //   ValidateField($(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr('id'), _failedreason, thisTileFXPivot);

        // } else {

          _failedreason = "Pricing Failed!";
          ValidateField($(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr('id'), _failedreason, thisTileFXPivot);

        // }

      } else {
        failReason = data.dataFromAjax.oPriceResponseBody[0].errorMessage;
        if (failReason.includes("Aborting further Migration")) {

          _failedreason = failReason.replace(". Aborting further Migration for this record.", "");
          ValidateField($(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr('id'), _failedreason, thisTileFXPivot);

        } else {

          _failedreason = failReason;
          ValidateField($(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr('id'), _failedreason, thisTileFXPivot);

        }
      }

      $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("");
      $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("RFQ ID : " +data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID); 
      //End

      // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      if (isRFS != true) {
        $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
        $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
      }
      //End

    }
    //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 
    else if (data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider.includes("FAIL")) {

      // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
      // if(data.dataFromAjax.oPriceResponseBody[0].errorMessage === null || 
      //   data.dataFromAjax.oPriceResponseBody[0].errorMessage === ''){

      $(thisTileFXPivot).find('[id^="FXPivot_BankNameRow"]').append("<td> - </td>");
      $(thisTileFXPivot).find('[id^="FXPivot_PriceRow"]').append("<td> - </td>");
      // Added by Atharva - Timers - START
      $(thisTileFXPivot).find('[id^="FXPivot_TimerRow"]').append("<td> - </td>");

      ValidateField($(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr("id"), "No response received from remote system.", thisTileFXPivot);

      //LGTGTWINT-1740 | Chaitanya M | 05 June 2023
      //$(thisTileFXPivot).find('[id^="FXDRfqidpnl"]').show();
      $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("");
      $(thisTileFXPivot).find('[id^="RFQIDFXD"]').html("RFQ ID : " + data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID);
      //End

      // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      if (isRFS != true) {
        $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
        $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
      }
      //End

      //   }else{

      //     failReason = data.dataFromAjax.oPriceResponseBody[0].errorMessage; //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 

      //     if(failReason.includes("Aborting further Migration")){

      //       _failedreason = failReason.replace(". Aborting further Migration for this record.","");    
      //       ValidateField($(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr('id'), _failedreason, thisTileFXPivot);    

      //     } else{

      //       _failedreason = failReason;
      //       ValidateField($(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr('id'), _failedreason, thisTileFXPivot); 

      //     }
      //   }  
      //   // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
      //   $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
      //   $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      //   $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true); 

      //End
    }

    mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false);   // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023          
    $(thisTileFXPivot).find('[id*="btnBestPriceFXPivot"]').attr("disabled", false);  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 
    // Start

    // START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
    if (isRFS) {
      if (MinQuoteTimeOutOccurredPivot == true) {

        UnsubcribeRFQID(thisTileFXPivot);
        closetimerFXPivot($(thisTileFXPivot).find('[id^="hdnRFSMinTimer"]')[0]);
        MinQuoteTimeOutOccurredPivot = false;
        mapleLoaderStop(thisTileFXPivot, '[id^="btnBestPriceFXPivot"]', false);
        $(thisTileFXPivot).find('[id^="hdnsignalRMsgRecv"]').val("NO");
        $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", false);
        $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", false);

      }
      // End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
    }
    //End

  } catch (error) {
    $(thisTileFXPivot).find('[id^="loader_FXPivot"]').hide();
    $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);
    $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
    console.log(error.message);
    $(".lblError").html(error.message);
  } finally {
  }
}//END

//To Get BidAsk Rate and Currency Pair
function getCurrencyFXPivotRate(currId, iscloned) { // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
  try {
    thisTileFXPivot = document.getElementById("td" + currId);
    // Addded for CFINT-992 // 18-Sep-2020 //

    //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 16 Feb 2023
    checkmetalccyflagFXPivot(currId, $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().trim());

    $(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr("disabled", true);
    $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
    clearPricerTable(thisTileFXPivot);

    //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
    $(thisTileFXPivot).find('[id^="hdnCcyDetailsFXPivot"]').val($(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val());
    //End

    //END
    request_getDataFromAPI(
      {

        "StandardPair": $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]')[0].value,
        "EntityID": EntityID,
        "UserID": userName,
        "ProductCode": productCodePivot,
        "Mode": "SEN",
        "CurrentTileID":currId + "|" + "",
      },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/BidAskRate", "", "POST", currId + "|" + userName + '_' + 'GetFXRatesByCurrencyNode' + '_' + RequestIDGenerator(7)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        
        thisTileFXPivot = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let currId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        // let responseHeader = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.Status;

        if(data === "" || data === undefined || data === null){
          responseHeader = "FAIL";
        }else{
          if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
            responseHeader = "FAIL";
          }else{
            responseHeader = "SUCCESS";
          }
        }


        if (responseHeader.toUpperCase() == "SUCCESS") {

          $(thisTileFXPivot).find('[id^="hdnDecimalRateFXPivot"]').val(data.dataFromAjax.PointShift); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
          // $(thisTileFXPivot).find('[id^="hdnPointShiftFXPivot"]').val(data.dataFromAjax.PointShift); // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023
          AskRateFXO = numberWithCommas(Number(data.dataFromAjax.AskRate).toFixed(data.dataFromAjax.PointShift)); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
          BidRateFXO = numberWithCommas(Number(data.dataFromAjax.BidRate).toFixed(data.dataFromAjax.PointShift)); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023

          document.getElementById(
            $(thisTileFXPivot).find('[id^="rateFXPivot"]').attr("id")).innerText = BidRateFXO + " / " + AskRateFXO;
          // $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]')[0].value =

          //Added by RizwanS || LGTGTWINT-2322 || 22 Aug 2023 
          if (MaxQuoteTimeOutPivot === "" || MinQuoteTimeOutPivot === "") {
            getProductConfigsFXD(productIDFXPivot, productCodePivot);
          }
          if (LPListPivot === "") {
            LPListPivot = getasyncFXDLP(productIDFXPivot, productCodePivot);
          }
          //END

          if (iscloned !== true) { // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023

            if (_addtileflag == true) {
              $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').val("");
              $(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').val("");
              _addtileflag = false;
            } else if (_defaultflagFXPivot == true) {
              //LGTGTWINT-1778 KO rate should not auto populated on changing ccy pair || Chaitanya M | 31 March 2023
              //Start
              // $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]')[0].value =
              // numberWithCommas((AskRateFXO.replace(/,/g, "") / 1.03).toFixed(data.dataFromAjax.PointShift)); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              //$(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]')[0].value =
              // numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.PointShift)); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').val("");
              $(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').val("");
              _defaultflagFXPivot = false;

              //End     
              //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
            } else if (!_UpdateFlagFXPivot) {
              //LGTCLI-426 Chaitanya M | 08 May 2023
              if (_eventstrikechangeFXPivot == true) {

                $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.PointShift)); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
                $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').val("");
                $(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').val("");

                _eventstrikechangeFXPivot = false;
              }

              _UpdateFlagFXPivot = false;

            } else if (_eventstrikechangeFXPivot == true) {

              $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") / 1.03).toFixed(data.dataFromAjax.PointShift)); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              $(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.PointShift)); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              _eventstrikechangeFXPivot = false;


            } else {

              if (_UpdateFlagFXPivot) {

                _UpdateFlagFXPivot = false;

              } else {

                $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').val("");
                $(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').val("");

              }

              //End
            }

          }
          // Addded for CFINT-992 // 18-Sep-2020 //

          // $(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr("disabled", false);

          //END

          GetMaxClientProfitCCyFXPivot(currId); // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

          $(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr("disabled", false); // LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

          //Added By RizwanS for Option cut // JIRA ID- SCBUPINT-1102 // 15 Jul 2022
          // Added for LGTCLI-447 | Chaitanya M | 04 Aug 2023
          if (iscloned !== true) {

            OptionCutListFXPivot = setasyncOptioncutFXD(currId, $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val(), productIDFXPivot, productCodePivot, "FXOSEN");

            fillDropdownlistControl(OptionCutListFXPivot, $(thisTileFXPivot).find('[id^="Optioncutddl"]').attr('id'));

            //END

            fillDatesFXPivot(
              $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val(),
              $(thisTileFXPivot).find('[id^="frequencyFXPivot"]').val(),
              $(thisTileFXPivot).find('[id^="NOSettlementinpboxFXPivot"]').val(),
              currId
            );

          }
          //End


        } else {

          let failReason = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.FailedReason;

          ValidateField($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').attr('id'), failReason, thisTileFXPivot);

        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message);
  }
}

// Added to set NDFMetalFlag // 05-Feb-2021

function setNDFMetalFlagPivot(
  currId,
  productIDFXPivot,
  productCodePivot,
  CcyPair,
  DepoCcy,
  AltCcy,
  getFrqFix,
  getSetlfrq,
  getPremiumDate,
  getFinalFixingDate,
  getSettlementDate
) {
  try {

    let thisTileFXPivot = document.getElementById("td" + currId);

    // Changed for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
    let _FXPivotlistCcy = sessionStorage.getItem("CCYListFXPivot")
    let _FXPivotCcy = JSON.parse(_FXPivotlistCcy);

    let fxDayBasis =
      _FXPivotCcy[_FXPivotCcy.findIndex((res) => res.asset_Pair == CcyPair)].asset2_Year_Basis;

    //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022

    $(thisTileFXPivot).find('[id^="hdnCcyPairDataPivot"]').val(
      JSON.stringify(_FXPivotCcy[_FXPivotCcy.findIndex((res) => res.asset_Pair == CcyPair)])
    );

    let notionalddlId = '[id^="CcySelectionFXPivot"]';
    let hdnpairDataId = '[id^="hdnCcyPairDataPivot"]';
    let notioanlamtId = '[id^="ContractAmtFXPivot"]';

    checkDecimalPlaces(
      thisTileFXPivot,
      notionalddlId,
      hdnpairDataId,
      notioanlamtId
    );

    //END

    getNumberOfFixingPivot(
      currId,
      productIDFXPivot,
      CcyPair,
      DepoCcy,
      AltCcy,
      getFrqFix,
      getSetlfrq,
      getPremiumDate,
      getFinalFixingDate,
      getSettlementDate,
      fxDayBasis
    );


  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message);
  }
}

function getNumberOfFixingPivot(
  currId,
  productIDFXPivot,
  CcyPair,
  DepoCcy,
  AltCcy,
  setFrqFix,
  SetSetlfrq,
  getPremiumDate,
  getFinalFixingDate,
  getSettlementDate,
  getfxDayBasis
) {
  try {
    request_getDataFromAPI(
      {
        "EntityID": EntityID, 
        "ProductID": productIDFXPivot,
        "CcyPair": CcyPair,
        "DayBasis": getfxDayBasis,
        "DepoCcy": DepoCcy,
        "AltCcy": AltCcy,
        "FixingFreq": setFrqFix,
        "SettlementFreq": SetSetlfrq,
        "TradeDate": setBusinessDate,
        "FirstFixingDate": "",
        "PremiumDate": getPremiumDate,
        "FinalFixingDate": getFinalFixingDate,
        "SettlementDate": getSettlementDate,
        "OptionCut": $(thisTileFXPivot).find('[id^="Optioncutddl"]').val(),
        "TemplateID": TemplateIDFXPivot,
        "RequestID": currId +"|" + userName + '_' + 'GetNumberofFixings'  +'_'+ RequestIDGenerator(10) + RequestIDGenerator(4), //modified by Chaitanya M, LGTGTWINT-1850 | 13-april-23
        "LocalCcy": DepoCcy,
        "GlobalCcy" :AltCcy,
        "GuaranteedPeriods" : "",
        "NotionalPerFixing": $(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').val(),
        "CurrentTileID": currId + "|" + userName + '_' + 'GetNumberofFixings'  +'_' + RequestIDGenerator(4),
      },
      clientConfigdata.CommonMethods.NodeServer + "DateCalculationApi/GetNumberofFixings", "", "POST", currId + "|" + userName + '_' + 'GetNumberofFixings' + '_' + RequestIDGenerator(7)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        
        let thisTileFXPivot = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.CurrentTileID.split("|")[0];  // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        // let responseHeader = data.GetNumberofFixingsResult.A_ResponseHeader.Status;

        let responseHeader = "";

        if(data === "" || data === undefined || data === null){
          responseHeader = "FAIL";
        }else{
          if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
            responseHeader = "FAIL";
          }else{
            responseHeader = "SUCCESS";
          }
        }
       
        if (responseHeader.toUpperCase() == "SUCCESS") {
          $(thisTileFXPivot).find('[id^="hdnFXPivotNoOfFixingDate"]').val(data.dataFromAjax.firstFixingDate);

          $(thisTileFXPivot).find('[id^="hdnFXPivotNoOfFixings"]').val(data.dataFromAjax.noofFixings);

          $(thisTileFXPivot).find('[id^="btnBestPriceFXPivot"]').attr("disabled", false);

          let strFirstFix = new Date(data.dataFromAjax.firstFixingDate);
          let firstFix = strFirstFix.getFullYear() +"-" +
            ("0" + (strFirstFix.getMonth() + 1)).substr(-2, 2) + "-" +
            ("0" + strFirstFix.getDate()).substr(-2, 2);
  
          $(thisTileFXPivot).find('[id^="FirstFixDate"]').val(firstFix);
          $(thisTileFXPivot).find('[id^="lblFirstFixDate"]').html(data.dataFromAjax.firstFixingDate);
          
        } else {

          let failReason = "No response received from remote system."; 

          ValidateField($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').attr('id'), failReason, thisTileFXPivot);

        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message);
  }
}

function checkPivotComboType(ComboType, thisTileFXPivot) {
  try {

    $(thisTileFXPivot).find('[id^="BookTradeFXPivot"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true);
    //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023

    let frqncypivot = $(thisTileFXPivot).find('[id^="frequencyFXPivot"]').val(); //LGTGTWINT-2332 | Chaitanya M | 10 Aug 2023

    if (!$(thisTileFXPivot).find('[id^="rbRowKITogglePivot"]')[0].checked) {
      if (frqncypivot.includes("BABS")) { //LGTGTWINT-2110 | Chaitanya M | 10 Aug 2023
        if (ComboType == "BABS1N00") {
          ComboType = "BABS1Y01"
        } else {
          ComboType = "BABS2Y02"
        }
      } else if (frqncypivot.includes("MAMS")) { //LGTGTWINT-2110 | Chaitanya M | 10 Aug 2023
        if (ComboType == "MAMS1N00") {
          ComboType = "MAMS1Y01"
        } else {
          ComboType = "MAMS1Y02"
        }
      } else if (frqncypivot.includes("WAWS")) { //LGTGTWINT-2110 | Chaitanya M | 10 Aug 2023
        if (ComboType == "WAWS1N00") {
          ComboType = "WAWS1Y01"
        } else {
          ComboType = "WAWS1Y01"
        }
      }
    }
    frequencynamePivot = ComboType;

    if (
      ComboType == "MAMS1Y01" ||
      ComboType == "MAMS2Y02" ||
      ComboType == "MAMS2Y12"
    ) {
      $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').prop("disabled", false);
      $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').prop("disabled", false);
    } else if (ComboType == "MAMS1N00" || ComboType == "MAMS2N00") {
      $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').val("").prop("disabled", true);
      $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').val("").prop("disabled", true);
    } else if (
      ComboType == "WAWS1Y01" ||
      ComboType == "WAWS2Y02" ||
      ComboType == "WAWS2Y12"
    ) {
      $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').prop("disabled", false);
      $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').prop("disabled", false);
    } else if (ComboType == "WAWS1N00" || ComboType == "WAWS2N00") {
      $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').val("").prop("disabled", true);
      $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').val("").prop("disabled", true);
    } else if (
      ComboType == "BABS1Y01" ||
      ComboType == "BABS2Y02" ||
      ComboType == "BABS2Y12"
    ) {
      $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').prop("disabled", false);
      $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').prop("disabled", false);
    } else if (ComboType == "BABS1N00" || ComboType == "BABS2N00") {
      $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').val("").prop("disabled", true);
      $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').val("").prop("disabled", true);
    } else if (
      ComboType == "DAWS1Y01" ||
      ComboType == "DAWS2Y02" ||
      ComboType == "DAWS2Y12"
    ) {
      $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').prop("disabled", false);
      $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').prop("disabled", false);
    } else if (ComboType == "DAWS1N00" || ComboType == "DAWS2N00") {
      $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').val("").prop("disabled", true);
      $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').val("").prop("disabled", true);
    } else if (
      ComboType == "DAMS1Y01" ||
      ComboType == "DAMS2Y02" ||
      ComboType == "DAMS2Y12"
    ) {
      $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').prop("disabled", false);
      $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').prop("disabled", false);
    } else if (ComboType == "DAMS1N00" || ComboType == "DAMS2N00") {
      $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').val("").prop("disabled", true);
      $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').val("").prop("disabled", true);
    }
  } catch (er) {
    console.log(er.message);
  }
}

// For DownloadDocgenPDF
function DownloadDocgenPDF(that) {
  try {
    GenerateTermsheet(that);
  } catch (er) {
    console.log(er.message);
  }
}

function viewScheduleFXPivot(that) {
  try {
    getBestPriceFXPivot(that, true);
  } catch (error) {
    console.log(error.message);
  }
}
//END


//Save Trade Start || 23 Dec 2022 || RijwanS || JIRA ID - LGTGTWINT-607 ||
function SaveTradeFXPivot(that) {
  try {

    booktradeFXPivot(that, true);

  } catch (er) {

    console.log(er.message);

  }
}//END

//Book Trade
function booktradeFXPivot(that, RTDflag) {
  try {

    if (RTDflag) {

      TileId = that.id.match(/\d+$/)[0];
      thisTileFXPivot = document.getElementById("td" + TileId);
      $(thisTileFXPivot).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that, "remarkFXD" + TileId, "", "DivOverlayFXPivot"); // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer

    } else {
      // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
      TileId = that.id.match(/\d+$/)[0];
      thisTileFXPivot = document.getElementById("td" + TileId);
      $(thisTileFXPivot).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that, "remarkFXD" + TileId, "", "DivOverlayFXPivot");
      //End

    }


  } catch (error) {

    console.log(error.message);
  }
}//END

//Save to Dealer RFQ  || 23 Dec 2022 || RijwanS || JIRA ID - LGTGTWINT-607 ||
function SaveDealerRFQPivot(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXPivot = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
    // Added by Atharva - Timers - START
    if ("td" + TileId in myInterval) {
      clearInterval(myInterval["td" + TileId]);
      delete myInterval["td" + TileId];
    }
    // END
    console.log("BookingFor ::", TileId, thisTileFXPivot, productName);
    $(thisTileFXPivot).find('[id^="BookTrade"]').attr("disabled", true); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023

    if (
      $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val() == "" ||
      $(thisTileFXPivot).find('[id^="FXPivot_PriceRow"]')[0].firstChild.innerHTML == "-" ||
      $(thisTileFXPivot).find('[id^="FXPivot_PriceRow"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(that, "booktradeFXPivot" + TileId, "Order Execution Failed!", "DivOverlayFXPivot","E");

      return false;
    }
    // Added by Atharva - START
    // Getting the data of price to be selected.
    var isNonBestPrice = false;
    if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
      isNonBestPrice = true;
    } else {
      isNonBestPrice = false;
    }
    var priceIndex = -1;
    if (isNonBestPrice) {
      priceIndex = parseInt($(thisTileFXPivot).find('[id^="hdnPriceIndexFXPivot"]').val());
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val());
    var dcdrfqid_val = "";
    for (let i = 0; i < jsonHdnPrices.length; i++) {
      // Finding the only json entry which contains the DCDRFQID, which got scattered while sorting the hdnPrices.
      //LGTGTWINT-1934 || ChaitanyaM || 01 June 2023
      //Start
      if (jsonHdnPrices[i].o_DCDRFQID == "" || jsonHdnPrices[i].o_DCDRFQID == null || jsonHdnPrices[i].o_DCDRFQID == undefined) {
      } else {
        dcdrfqid_val = jsonHdnPrices[i].o_DCDRFQID;
        break;
      }
      //End
    }

    // dcdrfqid_val must not be null or empty
    console.assert(dcdrfqid_val != "");
    // below also changed index from 0 to priceIndex variable.
    // END

    mapleLoaderStart(thisTileFXPivot, '[id^="BookTradeFXPivot"]', true);

    request_getDataFromAPI(
      {
      
        "EntityId": EntityID,
        "LoginId": userName,
        "DCD_RFQId": dcdrfqid_val,
        "External_RFQId": JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[0].quoteId.toString(),
        "PriceProviderName": JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[0].provider,
        "ProductCode": productCodePivot,
        "Cust_Prem_Amt": Number($(thisTileFXPivot).find('[id^="hdnIBPremFX"]').val()),            
        "order_Response_TimeOut": "", // HSBCFXEINT-29 | Chaitanya M | 11 Dec 2023
        "twoStepOrderExecutionYN":'N',      
        "OrderRetryFlag": true,
        "CurrentTileID": TileId + "|" + "",
        "Remark": $(thisTileFXPivot).find('[id^="inputRemark"]').val(),
      },
      clientConfigdata.CommonMethods.NodeServer + "fxobestprice/FXOBookTradeAndGetExternalTradeNumberJSON", "", "POST", TileId + "|" + userName + '_' + 'BookOrderFXProducts' + '_' + RequestIDGenerator(7))  // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        let thisTileFXPivot = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.CurrentTileID.split("|")[0];  // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        // let responseHeader = data.BookTradeAndGetExternalTradeNumberReqJSONResult.A_ResponseHeader.Status;

        let responseHeader = "";

        if(data === "" || data === undefined || data === null){
          responseHeader = "FAIL";
        }else{
          if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
            responseHeader = "FAIL";
          }else{
            responseHeader = "SUCCESS";
          }
        }

        if (responseHeader.toUpperCase() == "SUCCESS") {
          if (data.dataFromAjax.DealNo == "" || data.dataFromAjax.DealNo == null) {
            //LGTCLI-411 | FXD Rejected Trades Notifications | Chaitanya M | 17 April 2023
            //Start
            if (data.dataFromAjax.isOrderRejected == true) {

              var orderplaced = "Order rejected due to some technical reasons.";
              ValidateField($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').attr('id'), orderplaced, thisTileFXPivot);
              mapleLoaderStop(thisTileFXPivot, '[id^="BookTradeFXPivot"]', true);
              return false;

            } else if (data.dataFromAjax.isOrderRejected == false ||
              data.dataFromAjax.External_TradeID == "" ||
              data.dataFromAjax.External_TradeID == null) {
              var orderplaced = "Order may have got executed or may have failed. Contact support.";
              ValidateField($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').attr('id'), orderplaced, thisTileFXPivot);
              mapleLoaderStop(thisTileFXPivot, '[id^="BookTradeFXPivot"]', true);
              return false;
            } else {
              var orderplaced = data.dataFromAjax.Message;
              ValidateField($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').attr('id'), orderplaced, thisTileFXPivot);
              mapleLoaderStop(thisTileFXPivot, '[id^="BookTradeFXPivot"]', true);
              return false;
            }
            //End    
          } else {
            // Added by Atharva - Timers - START
            // Changed the provider name in message from bestpriceprovider to whichever the user has selected.
            // var orderplaced = "Deal No." + " " + data.dataFromAjax.DealNo + "<br>" +
            //   "Order Placed Successfully with Counterparty " +
            //   JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[priceIndex].provider + //JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[0].bestPriceProvider.split(":")[0]
            //   " and Order ID " + data.dataFromAjax.Message.split(":")[1];

            //HSBCFXEINT-30 || RizwanS || 12 Dec 2023
            let _msg1 = data.dataFromAjax.Message;
            var orderplaced =
            _msg1 + "<br>" +  //row-1
            "Deal No." + " " + data.dataFromAjax.DealNo + "<br>" + //row-2
            "External Trade ID:" + " " + data.dataFromAjax.External_TradeID; //row-3
           //END

          }

          booktradePopup(that, "booktradeFXPivot" + TileId, orderplaced, "DivOverlayFXPivot");

          $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val("");

          $(thisTileFXPivot).find(".pricesRow").children().each(function () {
            $(this).find("button").attr("disabled", true);
          });

          $(thisTileFXPivot).find(".banksNameRow").children().each(function () {
            $(this).find("button").attr("disabled", true);
          });

          $(thisTileFXPivot).find('[id^="BookTrade"]').attr("disabled", true);
          $(thisTileFXPivot).find('[id*="BookReq"]').attr("disabled", true);
          $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
          blockPriceButtons(TileId);
          // END
        } else {

          let failReason = "Order Execution Failed!";

          ValidateField($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').attr('id'), failReason, thisTileFXPivot);

        }

        mapleLoaderStop(thisTileFXPivot, '[id^="BookTradeFXPivot"]', true);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(that, "booktradeFXPivot" + TileId, "Order Execution Failed!", "DivOverlayFXPivot","E");
    mapleLoaderStop(thisTileFXPivot, '[id^="BookTradeFXPivot"]', true);
    $(".lblError").html(error.message);
  } finally {
  }
}//END

// Save Route To Dealer RFQ || RijwanS || LGTGTWINT-607 || 26 Dec 2022
function SaveRouteToDealerRFQPivot(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXPivot = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
    // Added by Atharva - Timers - START
    if ("td" + TileId in myInterval) {
      clearInterval(myInterval["td" + TileId]);
      delete myInterval["td" + TileId];
    }
    // END
    console.log("BookingFor ::", TileId, thisTileFXPivot, productName);

    $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023


    if (
      $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val() == "" ||
      $(thisTileFXPivot).find('[id^="FXPivot_PriceRow"]')[0].firstChild.innerHTML == "-" ||
      $(thisTileFXPivot).find('[id^="FXPivot_PriceRow"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(that, "booktradeFXPivot" + TileId, "Order Execution Failed!", "DivOverlayFXPivot","E");

      return false;
    }
    // Added by Atharva - START
    // Getting the data of price to be selected.
    var isNonBestPrice = false;
    if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
      isNonBestPrice = true;
    } else {
      isNonBestPrice = false;
    }
    var priceIndex = -1;
    if (isNonBestPrice) {
      priceIndex = parseInt($(thisTileFXPivot).find('[id^="hdnPriceIndexFXPivot"]').val());
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val());
    var dcdrfqid_val = "";
    for (let i = 0; i < jsonHdnPrices.length; i++) {
      // Finding the only json entry which contains the DCDRFQID, which got scattered while sorting the hdnPrices.
      //LGTGTWINT-1934 || ChaitanyaM || 01 June 2023
      //Start
      if (jsonHdnPrices[i].o_DCDRFQID == "" || jsonHdnPrices[i].o_DCDRFQID == null || jsonHdnPrices[i].o_DCDRFQID == undefined) {
      } else {
        dcdrfqid_val = jsonHdnPrices[i].o_DCDRFQID;
        break;
      }
      //End
    }
    // dcdrfqid_val must not be null or empty
    console.assert(dcdrfqid_val != "");
    // below also changed index from 0 to priceIndex variable.
    // END

    mapleLoaderStart(thisTileFXPivot, '[id^="btnSaveTradeFX"]', true);

    request_getDataFromAPI(
      {
        "EntityID": EntityID,
        "DCDRFQID": dcdrfqid_val,
        "ProductCode": productCodePivot,
        "LoginId": userName,
        "LoginID": userName,
        "NoteMasterId": JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[priceIndex].NoteMasterID,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "RMRemark": $(thisTileFXPivot).find('[id^="inputRemark"]').val(),
        "CurrentTileID": TileId + "|" + userName + '_' + 'SaveRouteToDealerRFQ'  +'_' + RequestIDGenerator(5) ,

      },
      clientConfigdata.CommonMethods.NodeServer + "SaveRouteToDealerRFQ", "", "POST", TileId + "|" + userName + '_' + 'SaveRouteToDealerRFQ' + '_' + RequestIDGenerator(7)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        
        let thisTileFXPivot = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        if (data.SaveRouteToDealerResult.RouteToDealer == true) {

          var orderplaced = "RFQ " + " " + dcdrfqid_val + " " + "routed to dealing desk successfully."
          booktradePopup(that, "booktradeFXPivot" + TileId, orderplaced, "DivOverlayFXPivot","S");

        } else {

          var orderplaced = "Order execution Failed."
          booktradePopup(that, "booktradeFXPivot" + TileId, orderplaced, "DivOverlayFXPivot","E");
        }

        
        $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val("");
        // Added by Atharva - START
        $(thisTileFXPivot).find(".pricesRow").children().each(function () {
          $(this).find("button").attr("disabled", true);
        });

        $(thisTileFXPivot).find(".banksNameRow").children().each(function () {
          $(this).find("button").attr("disabled", true);
        });

        $(thisTileFXPivot).find('[id^="BookTrade"]').attr("disabled", true);
        $(thisTileFXPivot).find('[id*="BookReq"]').attr("disabled", true);
        $(thisTileFXPivot).find('[id*="btnemailquote"]').attr("disabled", true); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
        blockPriceButtons(TileId);
        // END

        mapleLoaderStop(thisTileFXPivot, '[id^="btnSaveTradeFX"]', true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(that, "booktradeFXPivot" + TileId, "Order Execution Failed!", "DivOverlayFXPivot","E");
    mapleLoaderStop(thisTileFXPivot, '[id^="btnSaveTradeFX"]', true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

// Email Quote || RijwanS || LGTGTWINT-517  || 27 Dec 2022
function SendQuoteEmailPivot(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXPivot = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");

    console.log("email quote to ::", TileId, thisTileFXPivot, productName);

    if (
      $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val() == "" ||
      $(thisTileFXPivot).find('[id^="FXPivot_PriceRow"]')[0].firstChild.innerHTML == "-" ||
      $(thisTileFXPivot).find('[id^="FXPivot_PriceRow"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(thisTileFXPivot, "booktradeFXPivot" + TileId, "Email Quote Failed!", "DivOverlayFXPivot","E");

      return false;
    }
    // Added by Atharva - START
    // Getting the data of price to be selected.
    var isNonBestPrice = false;
    if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
      isNonBestPrice = true;
    } else {
      isNonBestPrice = false;
    }
    var priceIndex = -1;
    if (isNonBestPrice) {
      priceIndex = parseInt($(thisTileFXPivot).find('[id^="hdnPriceIndexFXPivot"]').val());
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val());
    var dcdrfqid_val = "";
    for (let i = 0; i < jsonHdnPrices.length; i++) {
      // Finding the only json entry which contains the DCDRFQID, which got scattered while sorting the hdnPrices.
      //LGTGTWINT-1934 || ChaitanyaM || 01 June 2023
      //Start
      if (jsonHdnPrices[i].o_DCDRFQID == "" || jsonHdnPrices[i].o_DCDRFQID == null || jsonHdnPrices[i].o_DCDRFQID == undefined) {
      } else {
        dcdrfqid_val = jsonHdnPrices[i].o_DCDRFQID;
        break;
      }
      //End
    }
    // dcdrfqid_val must not be null or empty
    console.assert(dcdrfqid_val != "");
    // below also changed index from 0 to priceIndex variable.
    // END

    mapleLoaderStart(thisTileFXPivot, '[id^="btnemailquote"]', true);

    request_getDataFromAPI(

      {

        "RequestID": userName + '_' + 'SendQuoteEmailFXDPivot'  +'_' + RequestIDGenerator(8),
        "EntityID": EntityID,
        "ProductID": productIDFXPivot,
        "LoginId": userName,
        "NoteMasterId": JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[priceIndex].NoteMasterID,
        "RFQID": dcdrfqid_val
        // "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        // "CurrentTileID": TileId,

      }, clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/SendQuoteEmail", "", "POST", TileId + "|" + userName + '_' + 'SendQuoteEmailFXDPivot' + '_' + RequestIDGenerator(7)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        // let thisTileFXPivot = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        // let TileId = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let responseHeader = "";
        if(data === "" || data === undefined || data === null){
          responseHeader = "FAIL";
        }else{
          if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
            responseHeader = "FAIL";
          }else{
            responseHeader = "SUCCESS";
          }
        }

        if(responseHeader === "SUCCESS"){

          if (data.dataFromAjax.result === true) {

            var orderplaced = "Email Quote Sent Successfully."
            booktradePopup(thisTileFXPivot, "booktradeFXPivot" + TileId, orderplaced, "DivOverlayFXPivot","S");

          } else {

            var orderplaced = "Email Quote Failed."
            booktradePopup(thisTileFXPivot, "booktradeFXPivot" + TileId, orderplaced, "DivOverlayFXPivot","E");
          

          }

        }else{

          var orderplaced = "Email Quote Failed."
          booktradePopup(thisTileFXPivot, "booktradeFXPivot" + TileId, orderplaced, "DivOverlayFXPivot","E");

        }

        // END

        mapleLoaderStop(thisTileFXPivot, '[id^="btnemailquote"]', true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(thisTileFXPivot, "booktradeFXPivot" + TileId, "Email Quote Failed!", "DivOverlayFXPivot","E");
    mapleLoaderStop(thisTileFXPivot, '[id^="btnemailquote"]', true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

// Save Trade Idea || RijwanS || LGTGTWINT-608  || 28 Dec 2022
function SaveTradeIdeaFXPivot(that) {
  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXPivot = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");

    console.log("Save Trade Idea for ::", TileId, thisTileFXPivot, productName);
    $(thisTileFXPivot).find('[id^="btnSaveTradeFX"]').attr("disabled", true);  // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
    if (isFXDDealer) {
      _modeFXPivot = "SEN";
    } else {
      _modeFXPivot = "QEN"
    }
    //End

    if (
      $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val() == "" ||
      $(thisTileFXPivot).find('[id^="FXPivot_PriceRow"]')[0].firstChild.innerHTML == "-" ||
      $(thisTileFXPivot).find('[id^="FXPivot_PriceRow"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(thisTileFXPivot, "booktradeFXPivot" + TileId, "Save trade idea Failed !", "DivOverlayFXPivot","E");
      return false;
    }
    // Added by Atharva - START
    // Getting the data of price to be selected.
    var isNonBestPrice = false;
    if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
      isNonBestPrice = true;
    } else {
      isNonBestPrice = false;
    }
    var priceIndex = -1;
    if (isNonBestPrice) {
      priceIndex = parseInt($(thisTileFXPivot).find('[id^="hdnPriceIndexFXPivot"]').val());
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val());
    var dcdrfqid_val = "";
    for (let i = 0; i < jsonHdnPrices.length; i++) {
      // Finding the only json entry which contains the DCDRFQID, which got scattered while sorting the hdnPrices.
      //LGTGTWINT-1934 || ChaitanyaM || 01 June 2023
      //Start
      if (jsonHdnPrices[i].o_DCDRFQID == "" || jsonHdnPrices[i].o_DCDRFQID == null || jsonHdnPrices[i].o_DCDRFQID == undefined) {
      } else {
        dcdrfqid_val = jsonHdnPrices[i].o_DCDRFQID;
        break;
      }
      //End
    }
    // dcdrfqid_val must not be null or empty
    console.assert(dcdrfqid_val != "");
    // below also changed index from 0 to priceIndex variable.
    // END

    mapleLoaderStart(thisTileFXPivot, '[id^="btnSaveTradeIdea"]', true);

    request_getDataFromAPI(

      {
        "EntityID": EntityID,
        "LoginID": userName,
        "ProductCode": productCodePivot,
        "NoteMasterID": JSON.parse($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val())[priceIndex].NoteMasterID,
        "RFQID": dcdrfqid_val,
        "Remark": $(thisTileFXPivot).find('[id^="inputRemark"]').val(), // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "Mode": _modeFXPivot, // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
        // "CurrentTileID": TileId,

      },
      clientConfigdata.CommonMethods.NodeServer + "SaveTradeIdeaFXD", "", "POST", TileId + "|" + userName + '_' + 'SaveTradeIdeaFXD' + '_' + RequestIDGenerator(7))
      .then((data) => {
        let thisTileFXPivot = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        let TileId = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023     
        if (data.SaveTradeRecommendationResult.TradeIdeaSavedYN == true) {

          var orderplaced = "RFQ " + " " + dcdrfqid_val + " " + "marked as trade idea successfully."
          
        booktradePopup(thisTileFXPivot, "booktradeFXPivot" + TileId, orderplaced, "DivOverlayFXPivot","S");

        } else {

          var orderplaced = "Save trade idea Failed."
          
        booktradePopup(thisTileFXPivot, "booktradeFXPivot" + TileId, orderplaced, "DivOverlayFXPivot","E");

        }

        mapleLoaderStop(thisTileFXPivot, '[id^="btnSaveTradeIdea"]', true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(thisTileFXPivot, "booktradeFXPivot" + TileId, "Save trade idea Failed!", "DivOverlayFXPivot","E");
    mapleLoaderStop(thisTileFXPivot, '[id^="btnSaveTradeIdea"]', true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

// Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
function getMaxLevNotionalFXPivot(notionalamt, frequencynamePivot, settlementval, currId) {
  try {

    thisTileFXPivot = document.getElementById("td" + currId);

    let leverageval = "";
    let maxlevnotional;

    if (
      frequencynamePivot.includes("1Y") ||
      frequencynamePivot.includes("1N")
    ) {
      leverageval = 1;

    } else if (
      frequencynamePivot.includes("2Y") ||
      frequencynamePivot.includes("2N")
    ) {
      leverageval = 2;
    }

    notional_amt = parseFloat($(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').val().replace(/,/g, ""));
    maxlevnotional = notional_amt * leverageval * settlementval;

    $(thisTileFXPivot).find('[id^="MaxLevPivot"]').val(maxlevnotional.toLocaleString("en-US"));

  } catch (error) {
    console.log(error.message);
  }
}

function confirmRtoDPivot(that) { // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer
  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXPivot = document.getElementById("td" + TileId);

    $(thisTileFXPivot).find('[id^="validatiionMsg"]').html("");

    // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up

    if (isSaveTradeIdeaFXPivot) {

      SaveTradeIdeaFXPivot(that);
      closeremarkpopup(that);


    } else {

      // if (isRM || isIA || isEAM) { // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023, 
      if (!isFXDDealer) { // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023, 
        //LGTGTWINT-1954 || RizwanS || 03 May 2023

        if ($(thisTileFXPivot).find('[id^="inputRemark"]').val() == "" || $(thisTileFXPivot).find('[id^="inputRemark"]').val() == undefined || $(thisTileFXPivot).find('[id^="inputRemark"]').val() == null) {

          $(thisTileFXPivot).find('[id^="validatiionMsg"]').html("Please enter remark.");
          return false;

        } else {

          $(thisTileFXPivot).find('[id^="validatiionMsg"]').html("");
          SaveRouteToDealerRFQPivot(that);
          closeremarkpopup(that);
        }

      } else {

        $(thisTileFXPivot).find('[id^="validatiionMsg"]').html("");
        SaveDealerRFQPivot(that);
        closeremarkpopup(that);

      }

      //END
    }

  } catch (er) {

    console.log(er.message);

  }

} //END

//Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 16 Feb 2023
function checkmetalccyflagFXPivot(currId, CcyPair) {
  try {

    let thisTileFXPivot = document.getElementById("td" + currId);

    // Changed for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023

    let _listCcyPivot = sessionStorage.getItem("CCYListFXPivot")
    let _CcyFXPivot = JSON.parse(_listCcyPivot);

    if (
      _CcyFXPivot[_CcyFXPivot.findIndex((res) => res.asset_Pair === CcyPair)].lcY_Type.toUpperCase() == "NDF" ||
      _CcyFXPivot[_CcyFXPivot.findIndex((res) => res.asset_Pair === CcyPair)].rcY_Type.toUpperCase() == "NDF"
    ) {
      NDFFlagPivot = "Y";
      IsMetalPivot = "N";
      $(thisTileFXPivot).find('[id^="CCYListFXPivot"]').attr("disabled", false); // Added to check LCY_Type & RCY_Type // 10 Feb 2022
      isccymetalflagFXPivot = false;   //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      $(thisTileFXPivot).find('[id^="FXDCCYiconFXPIVOT"]').removeClass("ccytoggle");//Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
    } else if (
      _CcyFXPivot[_CcyFXPivot.findIndex((res) => res.asset_Pair === CcyPair)].lcY_Type.toUpperCase() == "METAL" || //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      _CcyFXPivot[_CcyFXPivot.findIndex((res) => res.asset_Pair === CcyPair)].rcY_Type.toUpperCase() == "METAL"
    ) {
      NDFFlagPivot = "N";
      IsMetalPivot = "Y";
      $(thisTileFXPivot).find('[id^="CCYListFXPivot"]').attr("disabled", true); // Added to check LCY_Type & RCY_Type // 10 Feb 2022        
      isccymetalflagFXPivot = true;   //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023

      $(thisTileFXPivot).find('[id^="FXDCCYiconFXPIVOT"]').addClass("ccytoggle");//Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
    } else {
      NDFFlagPivot = "N";
      IsMetalPivot = "N";
      $(thisTileFXPivot).find('[id^="CCYListFXPivot"]').attr("disabled", false); // Added to check LCY_Type & RCY_Type // 10 Feb 2022
      isccymetalflagFXPivot = false;   //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      $(thisTileFXPivot).find('[id^="FXDCCYiconFXPIVOT"]').removeClass("ccytoggle");//Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
    }

    $(thisTileFXPivot).find('[id^="hdnisMetalFX"]').val(IsMetalPivot); //LGTCLI-437 | Chaitanya M | 11 July 2023
    $(thisTileFXPivot).find('[id^="hdnNDFFlagFX"]').val(NDFFlagPivot);  // HSBCFXEINT-25 - NDF flag are going blank || Chaitanya M  || 24-Jan 2024 

  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message());
  }
}
//end

// Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
function AddremarkFXPivot(that) {
  try {

    TileId = that.id.match(/\d+$/)[0];
    isSaveTradeIdeaFXPivot = true;
    $(thisTileFXPivot).find('[id^="validatiionMsg"]').html("");
    booktradePopup(that, "remarkFXD" + TileId, "", "DivOverlayFXPivot");


  } catch (er) {

    console.log(er.message);

  }

} //END
// LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023 - 
//START
function GetMaxClientProfitCCyFXPivot(TileId, _maxclntccyFXPivot, maxClntPrftCcy1FXPivot, MaxClientvalueFXPivot) {
  try {

    thisTileFXPivot = document.getElementById("td" + TileId);

    if ($(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').val() == "" || $(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').val() == null || $(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').val() == 0) {
      $(thisTileFXPivot).find('[id^="MaxProfitCcy"]').val(""); // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023
      return false;
    }

    let _premCcy = "";

    if ($(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val() == $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[1].trim()) {

      _premCcy = $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[1].trim();

    } else {

      _premCcy = $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim();

    }

    spotRatePivot = $(thisTileFXPivot).find('[id^="rateFXPivot"]').html().split("/")[1].replace(/,/g, "").trim();

    var targetinBFFXPivot = ""
    var targetinPipsFXPivot = "";

    if ($(thisTileFXPivot).find('[id^="TargetTypeFXPivot"]').val() == "Big Figure") {

      targetinBFFXPivot = $(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').val();
      targetinPipsFXPivot = (parseFloat(targetinBFFXPivot) * 100).toString();

    } else {

      targetinPipsFXPivot = $(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').val();
      targetinBFFXPivot = (parseFloat(targetinPipsFXPivot) / 100).toString();

    }

    if (_maxclntccyFXPivot === 'ccy2') {

      MaxClientProfitCcyFXPivot = 'ccy2';
      MaxClientProfitFXPivot = 'Get_MaxProfitCCy2';

    } else if ($(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val() == $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim()) {

      MaxClientProfitCcyFXPivot = 'ccy2';
      MaxClientProfitFXPivot = 'Get_MaxProfitCCy2';
      MaxClientvalueFXPivot = maxClntPrftCcy1FXPivot = 0

    } else {

      MaxClientProfitCcyFXPivot = 'ccy1';
      MaxClientProfitFXPivot = 'Get_MaxProfitCCy1';
      MaxClientvalueFXPivot = maxClntPrftCcy2FXPivot = 0

    }

    let param4 =
      _premCcy + ', ' + _premCcy + ', ' + spotRatePivot + ', ' + $(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').val().replace(/,/g, "")
      + ', ' + $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val().replace(/,/g, "") + ', '
      + Number(targetinBFFXPivot).toFixed($(thisTileFXPivot).find('[id^="hdnDecimalRateFXPivot"]').val()) + ','
      + MaxClientvalueFXPivot + ',' + $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().trim() + ', '
      + (Number(parseFloat(targetinPipsFXPivot).toFixed($(thisTileFXPivot).find('[id^="hdnDecimalRateFXPivot"]').val())));
    //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
    if (MaxClientProfitCcyFXPivot === 'ccy2' || _maxclntccyFXPivot === 'ccy2') {

      maxClntPrftCcy2FXPivot = 0

      request_getDataFromAPI(
        {
          Param1:"FINIQ_COMMON",
          Param2:"dbo",
          Param3: MaxClientProfitFXPivot,
          Param4: param4,
        },
        clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/Get_FunctionValue_FXDC","","POST", TileId + "|" + userName + '_' + 'FXDMaxclientprofit_IP' + '_' + RequestIDGenerator(7)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        .then((data) => {

          // let thisTileFXPivot = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
          // let TileId = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023 

          MaxClientvalueFXPivot = ParseMaxClientProfitFXPivot(data.dataFromAjax.FunctionGenericOutput);

          let param4 =
            _premCcy + ', ' + _premCcy + ', ' + spotRatePivot + ', ' + $(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').val().replace(/,/g, "")
            + ', ' + $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val().replace(/,/g, "") + ', '
            + Number(targetinBFFXPivot).toFixed($(thisTileFXPivot).find('[id^="hdnDecimalRateFXPivot"]').val()) + ','
            + MaxClientvalueFXPivot + ',' + $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().trim() + ', '
            + (Number(parseFloat(targetinPipsFXPivot).toFixed($(thisTileFXPivot).find('[id^="hdnDecimalRateFXPivot"]').val())));
          //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
          maxClntPrftCcy2FXPivot = numberWithCommas(MaxClientvalueFXPivot);
          MaxClientProfitFXPivot = 'Get_MaxProfitCCy1';

          // LGTCLI-437 | Chaitanya M | 11 July 2023
          if ($(thisTileFXPivot).find('[id^="hdnisMetalFX"]').val() === "Y") {

            $(thisTileFXPivot).find('[id^="MaxProfitCcy"]').val(maxClntPrftCcy2FXPivot);

          } else {

            if ($(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val() == $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim()) {

              if (maxClntPrftCcy1FXPivot == '0' || maxClntPrftCcy1FXPivot == 0) {
                CalMaxClientProfitCCy1FXPivot(TileId, MaxClientProfitFXPivot, param4, maxClntPrftCcy1FXPivot, MaxClientvalueFXPivot);
              }

            } else {
              $(thisTileFXPivot).find('[id^="MaxProfitCcy"]').val(maxClntPrftCcy2FXPivot);
            }

          }

          // End     


        });

    } else {

      CalMaxClientProfitCCy1FXPivot(TileId, MaxClientProfitFXPivot, param4, maxClntPrftCcy1FXPivot, MaxClientvalueFXPivot);
    }

  } catch (error) {
    console.log(error.message);
  }
}
//End

// LGTGTWINT-1832 For Parsing the max client to string.| Chaitanya M | 10 April 2023 - 
// START
function ParseMaxClientProfitFXPivot(response) {
  try {
    let parser = new DOMParser()
    let xmlDoc = parser.parseFromString(response, "text/xml")
    let value = xmlDoc.getElementsByTagName("Column1")[0].childNodes[0].nodeValue
    return Number(value).toFixed(2)

  } catch (error) {
    console.log(error.message);
  }
}
//End

// LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023 
// START
function CalMaxClientProfitCCy1FXPivot(TileId, MaxClientProfitFXPivot, param4, maxClntPrftCcy1FXPivot, MaxClientvalueFXPivot) {
  try {

    thisTileFXPivot = document.getElementById("td" + TileId);

    request_getDataFromAPI(
      {
        Param1:"FINIQ_COMMON",
        Param2:"dbo",
        Param3: MaxClientProfitFXPivot,
        Param4: param4,
      },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/Get_FunctionValue_FXDC", "", "POST", TileId + "|" + userName + '_' + 'FXDMaxclientprofit_IP' + '_' + RequestIDGenerator(7)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023 
      .then((data) => {

        // let thisTileFXPivot = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        // let TileId = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023 

        maxClntPrftCcy1FXPivot = 0

        MaxClientvalueFXPivot = ParseMaxClientProfitFXPivot(data.dataFromAjax.FunctionGenericOutput);

        if ($(thisTileFXPivot).find('[id^="CcySelectionFXPivot"]').val() == $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[1].trim()) {

          GetMaxClientProfitCCyFXPivot(TileId, "ccy2", maxClntPrftCcy1FXPivot, MaxClientvalueFXPivot);

        } else {

          $(thisTileFXPivot).find('[id^="MaxProfitCcy"]').val(numberWithCommas(MaxClientvalueFXPivot));
        }

      });

  } catch (error) {
    console.log(error.message);
  }
}
// End

// LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 17 Apr 2023
// Start
function GetContractSummaryFXPivot(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXPivot = document.getElementById("td" + TileId);

    var targetBFFXPivot = ""
    var targetPipsFXPivot = "";

    if ($(thisTileFXPivot).find('[id^="TargetTypeFXPivot"]').val() == "Big Figure") { // Added for LGTCLI-368 Instant Pricing BF/Pips Dropdown for FX Tiles | Chaitanya M | 30 March 2023

      targetBFFXPivot = $(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').val();
      targetPipsFXPivot = (parseFloat(targetBFFXPivot) * 100).toString();

    } else {

      targetPipsFXPivot = $(thisTileFXPivot).find('[id^="targetinpboxFXPivot"]').val();
      targetBFFXPivot = (parseFloat(targetPipsFXPivot) / 100).toString();

    }

    let _premCcy = "";

    if ($(thisTileFXPivot).find('[id^="hdnisMetalFX"]').val() === "Y") { //LGTCLI-437 | Chaitanya M | 11 July 2023

      _premCcy = $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[1].trim();

    } else {

      _premCcy = $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim();

    }

    let finalPayType = "";
    let FixingAdjustment = "";

    if ($(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]')[0].value == "ExactN") {
      finalPayType = "Exact";
      FixingAdjustment = "Notional";
    } else if ($(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]')[0].value == "ExactS") {
      finalPayType = "Exact";
      FixingAdjustment = "Strike";
    } else if ($(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]')[0].value == "FullNO") {
      finalPayType = "Full";
      FixingAdjustment = "None";
    } else if ($(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]')[0].value == "None") {
      finalPayType = "None";
      FixingAdjustment = "None";
    } else if ($(thisTileFXPivot).find('[id^="TargetPayAdjustFXPivot"]')[0].value == "") {
      finalPayType = "";
      FixingAdjustment = "";
    }

    if (frequencynamePivot.includes("1N") || frequencynamePivot.includes("2N")) {
      KIStylePivot = KIstyleArrPivot[0];
    } else if (frequencynamePivot.includes("01")) {
      KIStylePivot = KIstyleArrPivot[1];
    } else if (frequencynamePivot.includes("02")) {
      KIStylePivot = KIstyleArrPivot[2];
    } else if (frequencynamePivot.includes("12")) {
      KIStylePivot = KIstyleArrPivot[3];
    }

    let LeverageFXPivot = "";

    if (frequencynamePivot.includes("1Y") || frequencynamePivot.includes("1N")) {
      LeverageFXPivot = LeverageArrayPivot[0];
    } else if (frequencynamePivot.includes("2Y") || frequencynamePivot.includes("2N")) {
      LeverageFXPivot = LeverageArrayPivot[1];
    }

    let SettFreqPivot = "";

    if (frequencynamePivot.includes("BS")) {
      SettFreqPivot = FreqPivotArr[0];
    } else if (frequencynamePivot.includes("MS")) {
      SettFreqPivot = FreqPivotArr[1];
    } else if (frequencynamePivot.includes("WS")) {
      SettFreqPivot = FreqPivotArr[2];
    }

    _AlternateCCy = $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[1].trim();

    let KIYN = "";

    if (frequencynamePivot.includes("N")) {

      KIYN = "No"

    } else {

      KIYN = "Yes"

    }
    //END

    // LGTCLI-391 | Chaitanya M | 17 Apr 2023
    let upperKI = $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').val().replace(/,/g, "");
    let lowerKI = $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').val().replace(/,/g, "");
    var lowerStrike = $(thisTileFXPivot).find('[id^="lstrikeinpboxFXPivot"]').val().replace(/,/g, ""); //LGTGTWINT-1982 Chaitanya M 11 May 2023
    var upperStrike = $(thisTileFXPivot).find('[id^="UpperinpboxFXPivot"]').val().replace(/,/g, "");
    var pivotValue = $(thisTileFXPivot).find('[id^="pivotinpboxFXPivot"]').val().replace(/,/g, "");
    //End

    if (upperKI == "" || upperKI == null) {
      upperKI = 0;
    }
    if (lowerKI == "" || lowerKI == null) {
      lowerKI = 0;
    }
    if (lowerStrike == "" || lowerStrike == null) {
      lowerStrike = 0;
    }
    if (upperStrike == "" || upperStrike == null) {
      upperStrike = 0;
    }
    if (pivotValue == "" || pivotValue == null) {
      pivotValue = 0;
    }

    _notionalperfixing = Number($(thisTileFXPivot).find('[id^="ContractAmtFXPivot"]').val().replace(/,/g, "").split(".")[0])

    _notional = _notionalperfixing * $(thisTileFXPivot).find('[id^="NOSettlementinpboxFXPivot"]').val();

    // LGTGTWINT-1987 | Chaitanya M | 11 May 2023 - Start
    let _IBPremiumPivot = 0;
    let _IBPrempercPivot = 0;
    let _IBPremDirPivot = "";

    if ($(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val() == "" || $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val() == null || $(thisTileFXPivot).find('[id^="hdnPricesFXPivot"]').val() == undefined) {

      _IBPremiumPivot = 0;
      _IBPrempercPivot = 0;
      _IBPremDirPivot = "";

    } else {

      _IBPremiumPivot = Number($(thisTileFXPivot).find('[id^="hdnIBPremFX"]').val().replace(/,/g, ""));
      _IBPrempercPivot = Number($(thisTileFXPivot).find('[id^="hdnIBPremPercFX"]').val());

      // LGTGTWINT-1987 | Chaitanya M | 05 Jun 2023
      if (_IBPrempercPivot > 0) {
        _IBPremDirPivot = "Pay";
      } else {
        _IBPremDirPivot = "Receive";
        _IBPrempercPivot = _IBPrempercPivot * -1;
        _IBPremiumPivot = _IBPremiumPivot * -1;
      }
      //End

    }
    //End

    request_getDataFromAPI(
      {
        EntityID: sessionStorage.getItem("HomeEntityID"),
        LoginID: sessionStorage.getItem("Username"),
        ProductCode: productCodePivot.toUpperCase(),
        EntityID_: sessionStorage.getItem("HomeEntityID"),
        TemplateCode: productCodePivot.toUpperCase(),
        producttype: productCodePivot.toUpperCase(),
        BSdirection: "BUY",
        ccypair: $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().trim(),
        OptionType: "European",
        Invccy: $(thisTileFXPivot).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim(),
        AltNotionalCcy: _AlternateCCy,
        PremCcy: _premCcy,
        Notional: _notional,
        notionalperfixing: _notionalperfixing,
        Tenor: $(thisTileFXPivot).find('[id^="hdnFXPivotTenorCode"]').val(),
        Expiry: $(thisTileFXPivot).find('[id^="hdnFXPivotExpiry"]').val(),
        settlement: $(thisTileFXPivot).find('[id^="hdnFXPivotDeliveryDate"]').val(),
        LongDate: "",
        shortDate: "",
        Strike: Number(pivotValue),
        OptionCut: $(thisTileFXPivot).find('[id^="Optioncutddl"]').val(),
        BarrierType: "",
        ExoticCode: "",
        DigitalType: "",
        UpperBarrier: 0,
        LowerBarrier: 0,
        LeverageFactor: Number(LeverageFXPivot),
        noofsett: Number($(thisTileFXPivot).find('[id^="NOSettlementinpboxFXPivot"]').val()),
        nooffixings: Number($(thisTileFXPivot).find('[id^="NOSettlementinpboxFXPivot"]').val()),
        FixingFrequency: SettFreqPivot,
        settfrequency: SettFreqPivot,
        LowerStrike: Number(lowerStrike),
        UpperStrike: Number(upperStrike),
        pivotstrike: Number(pivotValue),
        SpreadType: "",
        customerpremdir: "",
        IBPremDir: _IBPremDirPivot, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
        IBPrem: _IBPremiumPivot, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
        RTC: 0,
        IBPremperc: _IBPrempercPivot, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
        RTCPerc: 0,
        Target: 0,
        TargetNotional: 0,
        KIStyle: KIYN,
        LowerKI: Number(lowerKI),
        UpperKI: Number(upperKI),
        Guaranteedtill: "",
        GuaranteedPeriods: 0,
        CappedLossCcy: "",
        CappedLossType: "",
        CappedLoss: "",
        CappedLossAmt: 0,
        TargetBigFigure: targetBFFXPivot,
        Targetgainunit: "Big Figure",
        TargetinPips: Number(targetPipsFXPivot),
        KOITMEvent: 0,
        Striptype: "",
        FirstFixingDate: $(thisTileFXPivot).find('[id^="FirstFixDate"]').val(),
        FinalPayType: finalPayType,
        FixingAdjustment: FixingAdjustment,
      },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/GetContractSummary", "", "POST", TileId + "|" + userName + '_' + 'GetContractSummary_IP' + '_' + RequestIDGenerator(7)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        //  let thisTileFXPivot = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        // let TileId = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023 
        let responseHeader = "";

        if(data === "" || data === undefined || data === null){
          responseHeader = "FAIL";
        }else{
          if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
            responseHeader = "FAIL";
          }else{
            responseHeader = "SUCCESS";
          }
        }
        if(responseHeader.toUpperCase() === "SUCCESS"){
          res = data.dataFromAjax.result.toString().replaceAll("\\n", "<br>");

          summary = res.toString().replaceAll("\color:black", "color:var(--btn-bg) !important");

          $(thisTileFXPivot).find('[id^="ContractSummaryFXD"]').append(summary);

          summarytradePopup(that, "SummaryFXD" + TileId, res, "DivOverlayFXPivot");

          mapleLoaderStop(thisTileFXPivot,'[id^="btnBestPriceFXPivot"]',true);

        }else{
          summary = "";

          $(thisTileFXPivot).find('[id^="ContractSummaryFXD"]').append(summary);

          summarytradePopup(that, "SummaryFXD" + TileId, res, "DivOverlayFXPivot");

          mapleLoaderStop(thisTileFXPivot,'[id^="btnBestPriceFXPivot"]',true);
        }

      });

  } catch (error) {

  }
}

//End