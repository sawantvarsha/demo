var FreqFX = ["Monthly/Monthly", "Weekly/Weekly"];
var tenorListFXTRF = ["1W","2W","3W","4W","1M","2M","3M","4M","5M","6M","7M","8M","9M","10M","11M","1Y","2Y","3Y","5Y","7Y"];
var LeverageArray = ["1", "2"];
var tenorArr = ["1W", "2W", "1M", "1D"];
var FreqTRF = ["Daily", "BiWeekly", "Monthly", "Weekly"];
var FreqTRFArr = ["BiWeekly/BiWeekly", "Monthly/Monthly", "Weekly/Weekly"];
var KIstyleArr = ["No", "E-101", "E-102", "E-112"];
var idFXTRF = 15;
var TradeDateFXTRF = "";
var frequencynameTRF="";
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

var OptionCutListFXTRF = [];
var isccymetalflagFXTRF = false;   //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
var isSaveTradeIdeaFXTRF; // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
var _defaultflagFXTRF = false; //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023

var _eventstrikechangeFXTRF = false; //LGTCLI-422 | Chaitanya M | 5 May 2023
var _eventccychangeFXTRF = false; //LGTCLI-422 | Chaitanya M | 5 May 2023
var MinQuoteTimeOutOccurredTRF = false; // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023

var timeoutFXTRF=""; //LGTGTWINT-2110 | Chaitanya M | 13 June 2023
var IsMetalTRF=""; //LGTCLI-437 | Chaitanya M | 11 July 2023 

//Added by RizwanS || LGTGTWINT-2322 || 22 Aug 2023
var MaxQuoteTimeOutTEKO = "";
var MinQuoteTimeOutTEKO = "";
var LPListTRFBuy = "";
var MaxQuoteTimeOutTARFSELL = "";
var MinQuoteTimeOutTARFSELL = "";
var LPListTRFSell = "";
//END


$(document).ready(function () {
  try {
     
    // getProductDetailsFXD(clientConfigdata.FXTRF.typeTRFBuy);
    // getProductDetailsFXD(clientConfigdata.FXTRF.typeTRFSell);
     
  } catch (err) {
    console.log(err.message);
  }
});

//To initialize FXTRF product functions while the page is being loaded
function onLoadFXTRF(currId) {
  try {
    setDeafaultValuesFXTRF(currId);

    thisTileFXTRF = document.getElementById("td" + currId);

    mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false);

    resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    // Added by RizwanS / Channged User id to gateway specific name / 16 Jun 2022
    // $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
    // $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("");
    // END

    // ADDED FOR NEW UI | Chaitanya M | 02-Feb-2023
    // START
    frequencynameTRF= $(thisTileFXTRF).find('[id^="frequencyFXTRF"]').val();
    if(!$(thisTileFXTRF).find('[id^="rbRowKIToggleTRF"]')[0].checked){      
      
      if(frequencynameTRF.includes("BABS")){
        if(frequencynameTRF=="BABS1N00"){
          frequencynameTRF = "BABS1Y01"
        }else{
          frequencynameTRF = "BABS2Y02"
        }
      }else if(frequencynameTRF.includes("MAMS")){
        if(frequencynameTRF=="MAMS1N00"){
          frequencynameTRF = "MAMS1Y01"
        }else{
          frequencynameTRF = "MAMS2Y02"
        }
      }else if(frequencynameTRF.includes("WAWS")){
        if(frequencynameTRF=="WAWS1N00"){
          frequencynameTRF = "WAWS1Y01"
        }else{
          frequencynameTRF = "WAWS2Y02"
        }
      }  

      if (frequencynameTRF.includes("N")) {
        $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val("").prop("disabled", true);
      } else {
        $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);
      }
    }else{
      if (frequencynameTRF.includes("N")) {
        $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val("").prop("disabled", true);
      } else {
        $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);
      }
    }

    // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    if(AllowSolveForYN !== "YES"){

      $(thisTileFXTRF).find('[id^="solveforrow"]').hide();

    } else{

      if ($(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {

        $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').prop("disabled", true);
        $(thisTileFXTRF).find('[id^="spreadAmtFX"]').prop("disabled", false);
  
      } else {
  
        $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').prop("disabled", false);
        $(thisTileFXTRF).find('[id^="spreadAmtFX"]').prop("disabled", true);
  
      }   
      
    }
    // END - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

    if ($(thisTileFXTRF).find('[id^="TypeFXTRF"]').val() == "ITM") {
      $(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]').val("").prop("disabled", true);
      document.querySelector("#" + $(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]').attr("id")).selectedIndex = 0;
    } else {
      $(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]').prop("disabled", false);
    }
    // Added for calculating Max Leverage Notional || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
    getMaxLevNotionalFXTRF( $(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').val(),
      frequencynameTRF,
      $(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').val(),
      currId
    );

    // Added for LGTGTWINT-1667 | FXD-Instant pricer ccy change doesnt happen with ccy pair change  | Chaitanya M | 06 March 2023
    if($(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val() != $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()){
     
      $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val($(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim());
      $(thisTileFXTRF).find('[id^="maxlevCcyTRF"]').html("(" +$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()+ ")"); //new UI changes | Ref LGTGTWINT-980 | Chaitanya M | 06 Feb 2023 
      $(thisTileFXTRF).find('[id^="lblSprdAmtCCy"]').html("(" +$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()+ ")"); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    }
    //End
    
    // LGTCLI-437 | Chaitanya M | 11 July 2023
    if($(thisTileFXTRF).find('[id^="hdnisMetalFX"]').val() === "Y"){
  
      $(thisTileFXTRF).find('[id^="ccymaxclientprftFX"]').html("(" +$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim()+ ")");
        
    }else{
  
      $(thisTileFXTRF).find('[id^="ccymaxclientprftFX"]').html("(" +$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()+ ")");
  
    }
    //End

    // if ($(thisTileFXTRF).find('[id^="CappedLossCcyFXTRF"]').val() == "No") {
    //   $(thisTileFXTRF)
    //     .find('[id^="CappedLossAmountFXTRF"]')
    //     .val("")
    //     .prop("disabled", true);
    // } else {
    //   $(thisTileFXTRF)
    //     .find('[id^="CappedLossAmountFXTRF"]')
    //     .prop("disabled", false);
    // }

    $(thisTileFXTRF).find('[id^="TargetTypeFXTRF"]').on("change", function () { // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023
        try {
          thisTileFXTRF = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
          $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
          $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
          $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);

          // LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          //  $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
          //  $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
          // End
          // clearPricerTable(thisTileFXTRF);

          mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
          
          if ($(this).parents(".sorting").find('[id^="TargetTypeFXTRF"]').val() =="Big Figure") { // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

            // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023- START

            if($(this).parents(".sorting").find('[id^="targetinpboxFXTRF"]').val() == "" || $(this).parents(".sorting").find('[id^="targetinpboxFXTRF"]').val() == null){

              $(this).parents(".sorting").find('[id^="targetinpboxFXTRF"]').val("100");

            }
            //End

            // $(this).parents(".sorting").find('[id^="TargetPayAdjustFXTRF"]').prop("disabled", false);
            // $(this).parents(".sorting").find('[id^="TargetPayAdjustFXTRF"]')[0].selectedIndex = 0;
          } else {

            // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

            if($(this).parents(".sorting").find('[id^="targetinpboxFXTRF"]').val() == "" || $(this).parents(".sorting").find('[id^="targetinpboxFXTRF"]').val() == null){

              $(this).parents(".sorting").find('[id^="targetinpboxFXTRF"]').val("3")
              
            }
           
          }

          GetMaxClientProfitCCyFXTRF(currId);  // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023
          //end

          return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
        } catch (error) {
          console.log(error.message);
        }
      });

    // $(thisTileFXTRF)
    //   .find('[id^="CappedLossCcyFXTRF"]')
    //   .on("change", function () {
    //     try {
    //       if (
    //         $(this)
    //           .parents(".sorting")
    //           .find('[id^="CappedLossCcyFXTRF"]')
    //           .val() == "No"
    //       ) {
    //         $(this)
    //           .parents(".sorting")
    //           .find('[id^="CappedLossAmountFXTRF"]')
    //           .val("")
    //           .prop("disabled", true);
    //       } else {
    //         $(this)
    //           .parents(".sorting")
    //           .find('[id^="CappedLossAmountFXTRF"]')
    //           .val("10,000.00")
    //           .prop("disabled", false);
    //       }
    //     } catch (error) {
    //       console.log(error.message);
    //     }
    //   });

    $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').on("change", function () {
        try {
          currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0]; // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

          thisTileFXTRF = document.getElementById("td" + currId); // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

          let _toggledirectionFlag = true; //LGTCLI-396 - Instant Pricer TARF Change Direction (First Fixing & Tokyo Cut) || RizwanS || 11 Apr 2023

          mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          if ($(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") { // Added for LGTCLI-348 FX Tiles Buy Sell Toggle UI Follow Single Pricer | Chaitanya M | 17 April 2023
            
            //getProductDetailsFXD(clientConfigdata.FXTRF.typeTRFBuy);  // Commented by ChaitanyaM For the Api config call change.|| 9 -Jan-23 

            // Added for LGTCLI-348 FX Tiles Buy Sell Toggle UI Follow Single Pricer | Chaitanya M | 29 March 2023
            $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').removeClass("SellDropdown");
            $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').addClass("BuyDropdown");
            //End
            
             getCurrencyFXTRFRate(currId, _toggledirectionFlag); // LGTCLI-348 | Chaitanya M | 06 March 2023 && //LGTCLI-396 - Instant Pricer TARF Change Direction (First Fixing & Tokyo Cut) || RizwanS || 11 Apr 2023
              //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
              //  $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
              //  $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
              //End

            $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val(""); // Added for LGTCLI-348 FX Tiles Buy Sell Toggle UI Follow Single Pricer | Chaitanya M | 17 April 2023
            
          } else {

            // Added for LGTCLI-348 FX Tiles Buy Sell Toggle UI Follow Single Pricer | Chaitanya M | 29 March 2023
            $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').removeClass("BuyDropdown");
            $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').addClass("SellDropdown");
            //End

            //getProductDetailsFXD(clientConfigdata.FXTRF.typeTRFSell); // Commented by ChaitanyaM For the Api config call change.|| 9 -Jan-23 
             getCurrencyFXTRFRate(currId, _toggledirectionFlag); // LGTCLI-348 | Chaitanya M | 06 March 2023 && //LGTCLI-396 - Instant Pricer TARF Change Direction (First Fixing & Tokyo Cut) || RizwanS || 11 Apr 2023
            $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val(""); // Added for LGTCLI-348 FX Tiles Buy Sell Toggle UI Follow Single Pricer | Chaitanya M | 17 April 2023

          }

          
        } catch (error) {
          console.log(error.message);
        }
        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
      });

      // changed for LGTGTWINT-1389 | Chaitanya M | 17 Feb 2023
    $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').on("select", function () {  //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike
        try {
          currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

          thisTileFXTRF = document.getElementById("td" + currId);
          // clearPricerTable(thisTileFXTRF);
           //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          //  $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
          //  $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
           //End

           mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

           resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          let ccypairsFXTRF= sessionStorage.getItem("CCYListFXTRFBuy");
          if(!ccypairsFXTRF.includes($(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val())){  //LGTGTWINT-1582 | currency pair validation on instant pricer | Chaitanya M | 02-March-2023
           
            $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val("");
            ValidateField($(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').attr("id"), "Currency pair not found.", thisTileFXTRF);
            return false;

          }else{
             //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
            if( $(this).parents(".sorting").find('[id^="hdnCcyDetailsFXTRF"]').val() ==  $(this).parents(".sorting").find('[id^="FXTRF_CCYPairDemo"]').val()){
              return false;
            }else{   
            //End        
            _defaultflagFXTRF = false; //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
            _eventccychangeFXTRF = true; //LGTCLI-426 Chaitanya M | 08 May 2023
            getCurrencyFXTRFRate(currId);
              //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
              $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val($(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim());
              // $(this)
              //   .parents(".sorting")
              //   .find('[id^="SecondaryCcyTRF"]')
              //   .html(this.value.split("-")[1].trim());

              $(thisTileFXTRF).find('[id^="maxlevCcyTRF"]').html("(" +$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()+ ")");

              $(thisTileFXTRF).find('[id^="lblSprdAmtCCy"]').html("(" +$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()+ ")"); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
              
              $(thisTileFXTRF).find('[id^="BuyCcyFXTRF"]').html("Buy");
              // .html("Buy" + " " + this.value.split("-")[0].trim());
                
              $(thisTileFXTRF).find('[id^="SellCcyFXTRF"]').html("Sell");
              // .html("Sell" + " " + this.value.split("-")[0].trim());            

              $(this).parents(".sorting").find('[id^="NoCcyFXTRF"]').html("No");
              $(this).parents(".sorting").find('[id^="LeftCcyFXTRF"]').html(this.value.split("-")[0].trim());
              $(this).parents(".sorting").find('[id^="RightcyFXTRF"]').html(this.value.split("-")[1].trim());

              // Added for calculating Max Leverage Notional || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
              getMaxLevNotionalFXTRF( $(this).parents(".sorting").find('[id^="ContractAmtFXTRF"]').val(),
                frequencynameTRF,
                $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXTRF"]').val(),
                currId
              );         
              
              // LGTCLI-437 | Chaitanya M | 11 July 2023
              if($(thisTileFXTRF).find('[id^="hdnisMetalFX"]').val() === "Y"){
  
                $(thisTileFXTRF).find('[id^="ccymaxclientprftFX"]').html("(" +$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim()+ ")");
                  
              }else{
            
                $(thisTileFXTRF).find('[id^="ccymaxclientprftFX"]').html("(" +$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()+ ")");
            
              }
              //End

              return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 2023
            }  //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
          }  
        } catch (error) {
          console.log(error.message);
        }
      });

    // $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').on("change", function () {
    //     try {
    //       thisTileFXTRF = $(this).parents(".sorting")[0];
    //       $(this)
    //         .closest(".sorting")
    //         .find('[id^="BuyCcyFXTRF"]')
    //         // .html("Buy" + " " + $(this).val());
    //         .html("Buy");
    //       $(this)
    //         .closest(".sorting")
    //         .find('[id^="SellCcyFXTRF"]')
    //         //.html("Sell" + " " + $(this).val());
    //         .html("Sell");
    //       checkDecimalAmt("", thisTileFXTRF); //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022
    //     } catch (error) {
    //       console.log(error.message);
    //     }
    // });

    //Check for Fixing/Settlement Frequncy // 28 Oct 2020

    $(thisTileFXTRF).find('[id^="CcySelectionToggleFXTRF"]').on("click", function () {
      try {
        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

        thisTileFXTRF = document.getElementById("td" + currId);  
        // clearPricerTable(thisTileFXTRF);

        $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);
        // LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
        // $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
        //End
        
        // clearPricerTable(thisTileFXTRF);

        mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
        if($(thisTileFXTRF).find('[id^="hdnisMetalFX"]').val() === "N"){ // LGTCLI-437 | Chaitanya M | 11 July 2023
 
          if($(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val() == $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()){
            $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val($(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim());
            $(thisTileFXTRF).find('[id^="maxlevCcyTRF"]').html("(" +$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim()+ ")"); //new UI changes | Ref LGTGTWINT-980 | Chaitanya M | 06 Feb 2023 
            $(thisTileFXTRF).find('[id^="lblSprdAmtCCy"]').html("(" +$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim()+ ")"); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

          }else{
            $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val($(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim());
            $(thisTileFXTRF).find('[id^="maxlevCcyTRF"]').html("(" +$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()+ ")"); // new UI changes Ref LGTGTWINT-980 | Chaitanya M | 06 Feb 2023
            $(thisTileFXTRF).find('[id^="lblSprdAmtCCy"]').html("(" +$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()+ ")"); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
          }   
          
          $(thisTileFXTRF).find('[id^="BuyCcyFXTRF"]').html("Buy");
          // .html("Buy" + " " + $(this).val());
          
          $(thisTileFXTRF).find('[id^="SellCcyFXTRF"]').html("Sell");
          //.html("Sell" + " " + $(this).val());          
          
          checkDecimalAmt("", thisTileFXTRF); //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022 

          GetMaxClientProfitCCyFXTRF(currId,"");  // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023
        }     
        //End
     
      } catch (error) {
        console.log(error.message);
      }
    });

    //Check for Fixing/Settlement Frequncy // 28 Oct 2020

    $(thisTileFXTRF).find('[id^="frequencyFXTRF"]').on("change", function () {
        try {
          currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];
          thisTileFXTRF = $(this).parents(".sorting")[0];
          // clearPricerTable(thisTileFXTRF);

           //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          //  $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
          //  $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
           //End

           mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

           resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          checkTRFComboType(
            $(this).parents(".sorting").find('[id^="frequencyFXTRF"]').val(),
            thisTileFXTRF
          );

          fillDatesFXTRF(
            $(this).parents(".sorting").find('[id^="FXTRF_CCYPairDemo"]').val(),
            $(this).parents(".sorting").find('[id^="frequencyFXTRF"]').val(),
            $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXTRF"]').val(),
            currId
          );

          // fillFirstFixingDateFXTRF(
          //   $(this).parents(".sorting").find('[id^="FXTRF_CCYPairDemo"]').val(),
          //   $(this).parents(".sorting").find('[id^="frequencyFXTRF"]').val(),
          //   currId
          // );
          
          // Added for calculating Max Leverage Notional || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
          getMaxLevNotionalFXTRF(
            $(this).parents(".sorting").find('[id^="ContractAmtFXTRF"]').val(),
            frequencynameTRF,
            $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXTRF"]').val(),
            currId
          );
          return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
        } catch (error) {
          console.log(error.message);
        }
    });
        //Check for Fixing/Settlement Frequncy // 28 Oct 2020

    $(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').on("change", function () {
            try {
              currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

              thisTileFXTRF = document.getElementById("td" + currId);
              // clearPricerTable(thisTileFXTRF);

              //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
              // $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
              // $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
              //End

              mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

              resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

              fillDatesFXTRF($(this).parents(".sorting").find('[id^="FXTRF_CCYPairDemo"]').val(),
                $(this).parents(".sorting").find('[id^="frequencyFXTRF"]').val(),
                $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXTRF"]').val(),
                currId
              );

              // fillFirstFixingDateFXTRF($(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val(),
              //   $(thisTileFXTRF).find('[id^="frequencyFXTRF"]').val(),
              //   currId
              // );

              // Added for calculating Max Leverage Notional || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
              getMaxLevNotionalFXTRF($(this).parents(".sorting").find('[id^="ContractAmtFXTRF"]').val(),
                frequencynameTRF,
                $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXTRF"]').val(),
                currId
              );  
              return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
            } catch (error) {
              console.log(error.message);
            }
    });

    //Check for Fixing/Settlement Frequncy // 28 Oct 2020

    $(thisTileFXTRF) .find('[id^="FirstFixDate"]').on("change", function () {
            try {
              currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

              thisTileFXTRF = document.getElementById("td" + currId);
              // clearPricerTable(thisTileFXTRF);
               //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
              // $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
              // $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
              //End

              mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

              resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

              let firstFix = new Date($(this).val());

             if($(this).val() !=""){ /// LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023
             
              $(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("disabled", false);
               
              validatefirstfixingday(thisTileFXTRF,"FirstFixDate",firstFix); //Added to show error if Saturday or Sunday selected as First- Fixing date | LGTGTWINT-1424| Chaitanya M | 20 Feb 2023   

              let formattedDate = firstFix.getDate() + "-" + months[firstFix.getMonth()] +"-" + firstFix.getFullYear();

              $(thisTileFXTRF).find('[id^="lblFirstFixDate"]').html(formattedDate);

              fillDatesONFirstFixTRF(
                $(this).parents(".sorting").find('[id^="FXTRF_CCYPairDemo"]').val(),
                $(this).parents(".sorting").find('[id^="frequencyFXTRF"]').val(),
                $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXTRF"]').val(),
                $(this).parents(".sorting").find('[id^="FirstFixDate"]').val(),
                currId
               );
              }else{// LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023

                $(thisTileFXTRF).find('[id^="lblFirstFixDate"]').html($(this).val());
                $(thisTileFXTRF).find('[id^="FXTRF_Expiry"]').html("");
                validatefirstfixingday(thisTileFXTRF,"",$(this).val());
              }


              return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
            } catch (error) {
              console.log(error.message);
            }
    });
        
    $(thisTileFXTRF).find('[id^="KIToggleTRF"]').on("change", function () {
      try {
        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

        thisTileFXTRF = document.getElementById("td" + currId);
        
        // clearPricerTable(thisTileFXTRF);

         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
         //End

         mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

         resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
       
        checkTRFComboType(
          $(this).parents(".sorting").find('[id^="frequencyFXTRF"]').val(),
          thisTileFXTRF
        );

        //Commented for unwanted calls after discussion with Rahul P |  Chaitanya M | 29 March 2023
        // fillDatesFXTRF(
        //   $(this).parents(".sorting").find('[id^="FXTRF_CCYPairDemo"]').val(),
        //   $(this).parents(".sorting").find('[id^="frequencyFXTRF"]').val(),
        //   $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXTRF"]').val(),
        //   currId
        // );

        // fillFirstFixingDateFXTRF(
        //   $(this).parents(".sorting").find('[id^="FXTRF_CCYPairDemo"]').val(),
        //   $(this).parents(".sorting").find('[id^="frequencyFXTRF"]').val(),
        //   currId
        // );
        //End

        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
      } catch (er) {
        console.log("error in KI Toggle change ", er.message);
      }
    });

    $(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').on("change", function(){
        // Added for calculating Max Leverage Notional || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
        let _notionalamtFXTRF =  FormatNotional($(this).parents(".sorting").find('[id^="ContractAmtFXTRF"]').val(),this); // Added for LGTGTWINT-1511  Incorrect max notional calculation | Chaitanya M | 24 feb 2023
        thisTileFXTRF = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
         $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
         $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
         $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);   
         // clearPricerTable(thisTileFXTRF);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
         //End

        mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        getMaxLevNotionalFXTRF(_notionalamtFXTRF,
          frequencynameTRF,
          $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXTRF"]').val(),
          currId
        );

        GetMaxClientProfitCCyFXTRF(currId);  // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023
        
      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    $(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').on("change", function(){
      thisTileFXTRF = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);   
       //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      //  $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
      //  $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
       GetMaxClientProfitCCyFXTRF(currId);  // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023
       //End
      // clearPricerTable(thisTileFXTRF);

      mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
     
      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    $(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]').on("change", function(){
      thisTileFXTRF = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);  
       //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      //  $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
      //  $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
       //End
      // clearPricerTable(thisTileFXTRF); 

      mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
     
      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    $(thisTileFXTRF).find('[id^="Optioncutddl"]').on("change", function () {
      try {
        thisTileFXTRF = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
        $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);  
         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
         //End  
        // clearPricerTable(thisTileFXTRF);  
        
        mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
     
      } catch (error) {
        console.log(error.message);
      }
    });

    $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').on("change", function () {
      try {       
        thisTileFXTRF = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
        $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);  
         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
         //End   
        // clearPricerTable(thisTileFXTRF); 
        
        mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
     
      } catch (error) {
        console.log(error.message);
      }
    });

    $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').on("change", function () {
      try {    
        thisTileFXTRF = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023  
        $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);    

        $(thisTileFXTRF).find('[id^="hdnStrikevalueFX"]').val($(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
        //End
        // clearPricerTable(thisTileFXTRF);   

        _eventstrikechangeFXTRF = true; //LGTCLI-422 | Chaitanya M | 5 May 2023

        mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
        
        GetMaxClientProfitCCyFXTRF(currId);  // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023
     
      } catch (error) {
        console.log(error.message);
      }
    });

    $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').on("change", function () {
      try {  
        thisTileFXTRF = $(this).parents(".sorting")[0];   // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023   
        $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true); 
         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html(""); 
         //End

        // clearPricerTable(thisTileFXTRF); 
        
        mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXTRF); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
     
      } catch (error) {
        console.log(error.message);
      }
    });

    // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    $(thisTileFXTRF).find('[id^="ddlSolveForFX"]').on("change", function () {

      currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];  

      thisTileFXTRF = document.getElementById("td" + currId);
      resetFXDPrice(thisTileFXTRF);

      if ($(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase().includes("STRIKE")) {

        $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').prop("disabled", true);
        $(thisTileFXTRF).find('[id^="hdnStrikevalueFX"]').val($(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val("");        
        $(thisTileFXTRF).find('[id^="spreadAmtFX"]').prop("disabled", false);
  
      } else {
  
        $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').prop("disabled", false);
        $(thisTileFXTRF).find('[id^="spreadAmtFX"]').prop("disabled", true);
        $(thisTileFXTRF).find('[id^="spreadAmtFX"]').val("");
        $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val($(thisTileFXTRF).find('[id^="hdnStrikevalueFX"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
  
      }

    });
    // END - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    
    //END
  } catch (error) {
    console.log(error.message);
  }
}

//To set the default values of input fields in FXTRF
function setDeafaultValuesFXTRF(currId) {
  try {

    thisTileFXTRF = document.getElementById("td" + currId);

    $(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').val("100,000.00"); // Default Parameters Change | LGTCLI-310 | Chaitanya M | 17 Feb 2023
    // $(thisTileFXTRF).find('[id^="CappedLossAmountFXTRF"]').val("10,000.00");
    // $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val("1.1098");  //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023
    $(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val("0");// Default Parameters Change | LGTCLI-310 | Chaitanya M | 17 Feb 2023
    $(thisTileFXTRF).find('[id^="SalesSpreadFXTRF"]').val("0.2");
    $(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').val("52");// LGTGTWINT-1525 | Chaitanya M | 27 Feb 2023
    $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val("EUR - USD");
   // $(thisTileFXTRF).find('[id^="primaryCcyTRF"]').html("EUR");
   // $(thisTileFXTRF).find('[id^="SecondaryCcyTRF"]').html("USD");
    //$(thisTileFXTRF).find('[id^="rateFXTRF"]').html("1.1097/1.1098");  //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023
    $(thisTileFXTRF).find('[id^="BuyCcyFXTRF"]').html("Buy");
    $(thisTileFXTRF).find('[id^="SellCcyFXTRF"]').html("Sell");
    getcurrentdate(thisTileFXTRF,"FirstFixDate");

    // Added for LGTCLI-348 FX Tiles Buy Sell Toggle UI Follow Single Pricer | Chaitanya M | 29 March 2023
    if ($(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
      $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').removeClass("SellDropdown");
      $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').addClass("BuyDropdown");
    }else{
      $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').removeClass("BuyDropdown");
      $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').addClass("SellDropdown");
    }
    //End

    clearPricerTable(thisTileFXTRF);
    //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
    $(thisTileFXTRF).find('[id^="hdnCcyDetailsFXTRF"]').val($(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val());
    //End

    //Added for ccy pair autocomlete / JIRA - FINGUI - 237 / 14 Feb 2022
    callCcyautocompleteFX(thisTileFXTRF, "FXTRF_CCYPairDemo");
    //END

    GetMaxClientProfitCCyFXTRF(currId);  // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

    $(thisTileFXTRF).find('[id^="loader_FXTRF"]').hide();
  } catch (err) {
    console.log(err.message);
  }
}

//To get Trade, Premium, Expiry, Delivery Dates
function fillDatesFXTRF(pair, typeval, NoofFixing, that) {
  try {
    thisTileFXTRF = document.getElementById("td" + that);
    //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
    if(!$(thisTileFXTRF).find('[id^="rbRowKIToggleTRF"]')[0].checked){    
      
      if(typeval.includes("BABS")){
        if(typeval=="BABS1N00"){
          typeval = "BABS1Y01"
        }else{
          typeval = "BABS2Y02"
        }
      }else if(typeval.includes("MAMS")){
        if(typeval=="MAMS1N00"){
          typeval = "MAMS1Y01"
        }else{
          typeval = "MAMS2Y02" //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
        }
      }else if(typeval.includes("WAWS")){
        if(typeval=="WAWS1N00"){
          typeval = "WAWS1Y01"
        }else{
          typeval = "WAWS2Y02"
        }
      }       
    } 

    frequencynameTRF = typeval;

    if (
      typeval == "MAMS1Y01" ||
      typeval == "MAMS2Y02" ||
      typeval == "MAMS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      FixingFrq = FreqTRF[2];
      SettFrq = FreqTRF[2];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "MAMS1N00" || typeval == "MAMS2N00") {
      FixingFrq = FreqTRF[2];
      SettFrq = FreqTRF[2];
      tenorCode = NoofFixing + SettFrq[0];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    } else if (
      typeval == "WAWS1Y01" ||
      typeval == "WAWS2Y02" ||
      typeval == "WAWS2Y12"
    ) {
      FixingFrq = FreqTRF[3];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      SettFrq = FreqTRF[3];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "WAWS1N00" || typeval == "WAWS2N00") {
      FixingFrq = FreqTRF[3];
      SettFrq = FreqTRF[3];
      tenorCode = NoofFixing + SettFrq[0];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    } else if (
      typeval == "BABS1Y01" ||
      typeval == "BABS2Y02" ||
      typeval == "BABS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      FixingFrq = FreqTRF[1];
      SettFrq = FreqTRF[1];
      tenorCode = NoofFixing * 2 + tenorArr[1][1];
    } else if (typeval == "BABS1N00" || typeval == "BABS2N00") {
      FixingFrq = FreqTRF[1];
      SettFrq = FreqTRF[1];
      tenorCode = NoofFixing * 2 + tenorArr[1][1];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    } else if (
      typeval == "DAWS1Y01" ||
      typeval == "DAWS2Y02" ||
      typeval == "DAWS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      FixingFrq = FreqTRF[0];
      SettFrq = FreqTRF[3];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "DAWS1N00" || typeval == "DAWS2N00") {
      FixingFrq = FreqTRF[0];
      SettFrq = FreqTRF[3];
      tenorCode = NoofFixing + SettFrq[0];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    } else if (
      typeval == "DAMS1Y01" ||
      typeval == "DAMS2Y02" ||
      typeval == "DAMS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      FixingFrq = FreqTRF[0];
      SettFrq = FreqTRF[2];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "DAMS1N00" || typeval == "DAMS2N00") {
      FixingFrq = FreqTRF[0];
      SettFrq = FreqTRF[2];
      tenorCode = NoofFixing + SettFrq[0];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    }

    $(thisTileFXTRF).find('[id^="hdnFXTRFTenorCode"]').val(tenorCode);

    // Addded for CFINT-992 // 18-Sep-2020 //

    $(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("disabled", true);
    $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023 
    $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);

    //END
    if ($(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
      ProductCode_FXTRF = productCodeTRFBuy;
      ProductIDFXTRF = productIDTRFBuy;
    } else {
      ProductCode_FXTRF = productCodeTRFSell;
      ProductIDFXTRF = productIDTRFSell;
    }

    request_getDataFromAPI(
      {    
        "currencyPair": $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().trim(),
        "tradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "tenor_Code": tenorCode,
        "fixing_Frequency":FixingFrq,	
        "settlement_Frequency":FixingFrq,
        "depoCcy": pair.split("-")[0].trim(),
        "altCcy": pair.split("-")[1].trim(),
        "iProductId": ProductIDFXTRF,
        "i_ProductCode": ProductCode_FXTRF,
        "optioncut": $(thisTileFXTRF).find('[id^="Optioncutddl"]').val(),
        "firstFixingChangeYN" : "N",  
        "firstFixingDate" : "",
        "defaultFixingDate":'',
        "defaultSettDate":'',
        "i_Mode" : "FXOSEN",
        "tenor" : '',
        "prem_Settlement_Days" :'', // Added missing parameters for Date service call | ChaitanyaM | 25-April-2024
        "CurrentTileID": that + "|" + "",
      },
      clientConfigdata.CommonMethods.NodeServer + "DateCalculationApi/Get_FinIQ_CalculateDatesWrapper","","POST",that +"|" + userName + '_' + 'fillDatesFXO'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
       
        let thisTileFXTRF = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileID = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        // Start - HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023

        //  let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

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
        // End - HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023

        if(responseHeader.toUpperCase() == "SUCCESS"){
          TradeDateFXTRF = setBusinessDate;
          $(thisTileFXTRF).find('[id^="FXTRF_Expiry"]').html(data.dataFromAjax[0].fixingDate); //LGTCLI-401 - Instant Pricer FX Final Fixing Date (FXD) | Chaitanya M | 12 April 2023
          $(thisTileFXTRF).find('[id^="hdnFXTRFPremiumDate"]').val(data.dataFromAjax[0].valueDate);
          $(thisTileFXTRF).find('[id^="hdnFXTRFExpiry"]').val(data.dataFromAjax[0].fixingDate);
          $(thisTileFXTRF).find('[id^="hdnFXTRFDeliveryDate"]').val(data.dataFromAjax[0].maturityDate);
          $(thisTileFXTRF).find('[id^="hdnTenorDaysTRF"]').val(data.dataFromAjax[0].expiryDays);

          $(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("disabled", false);

          setNDFMetalFlagTRF(
            TileID,
            $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().trim(),
            pair.split("-")[0].trim(),
            pair.split("-")[1].trim(),
            FixingFrq,
            SettFrq,
            $(thisTileFXTRF).find('[id^="hdnFXTRFPremiumDate"]').val(),
            $(thisTileFXTRF).find('[id^="hdnFXTRFExpiry"]').val(),
            $(thisTileFXTRF).find('[id^="hdnFXTRFDeliveryDate"]').val()
          );

          //END
        } else {

          let failReason = "No response received from remote system.";

          ValidateField($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').attr('id'), failReason, thisTileFXTRF);

        }

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

//To get Trade, Premium, Expiry, Delivery Dates
function fillFirstFixingDateFXTRF(pair, typeval, that) {
  try {
    thisTileFXTRF = document.getElementById("td" + that);

    //ADDED FOR NEW UI | Chaitanya M | 02-Feb-2023
    //START
    if(!$(thisTileFXTRF).find('[id^="rbRowKIToggleTRF"]')[0].checked){    
    if(typeval.includes("BABS")){
      if(typeval=="BABS1N00"){
        typeval = "BABS1Y01"
      }else{
        typeval = "BABS2Y02"
      }
    }else if(typeval.includes("MAMS")){
      if(typeval=="MAMS1N00"){
        typeval = "MAMS1Y01"
      }else{
        typeval = "MAMS2Y02"
      }
    }else if(typeval.includes("WAWS")){
      if(typeval=="WAWS1N00"){
        typeval = "WAWS1Y01"
      }else{
        typeval = "WAWS2Y02"
      }
    }         
    
  }  
  frequencynameTRF = typeval;
  //END

    if (
      typeval == "MAMS1Y01" ||
      typeval == "MAMS2Y02" ||
      typeval == "MAMS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      FixingFrq = FreqTRF[2];
      SettFrq = FreqTRF[2];
      tenorCode = tenorArr[2];
    } else if (typeval == "MAMS1N00" || typeval == "MAMS2N00") {
      FixingFrq = FreqTRF[2];
      SettFrq = FreqTRF[2];
      tenorCode = tenorArr[2];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    } else if (
      typeval == "WAWS1Y01" ||
      typeval == "WAWS2Y02" ||
      typeval == "WAWS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      FixingFrq = FreqTRF[3];
      SettFrq = FreqTRF[3];
      tenorCode = tenorArr[0];
    } else if (typeval == "WAWS1N00" || typeval == "WAWS2N00") {
      FixingFrq = FreqTRF[3];
      SettFrq = FreqTRF[3];
      tenorCode = tenorArr[0];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    } else if (
      typeval == "BABS1Y01" ||
      typeval == "BABS2Y02" ||
      typeval == "BABS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      FixingFrq = FreqTRF[1];
      SettFrq = FreqTRF[1];
      tenorCode = tenorArr[1];
    } else if (typeval == "BABS1N00" || typeval == "BABS2N00") {
      FixingFrq = FreqTRF[1];
      SettFrq = FreqTRF[1];
      tenorCode = tenorArr[1];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    } else if (
      typeval == "DAWS1Y01" ||
      typeval == "DAWS2Y02" ||
      typeval == "DAWS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      FixingFrq = FreqTRF[0];
      SettFrq = FreqTRF[3];
      tenorCode = tenorArr[3];
    } else if (typeval == "DAWS1N00" || typeval == "DAWS2N00") {
      FixingFrq = FreqTRF[0];
      SettFrq = FreqTRF[3];
      tenorCode = tenorArr[3];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    } else if (
      typeval == "DAMS1Y01" ||
      typeval == "DAMS2Y02" ||
      typeval == "DAMS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      FixingFrq = FreqTRF[0];
      SettFrq = FreqTRF[2];
      tenorCode = tenorArr[3];
    } else if (typeval == "DAMS1N00" || typeval == "DAMS2N00") {
      FixingFrq = FreqTRF[0];
      SettFrq = FreqTRF[2];
      tenorCode = tenorArr[3];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    }

    $(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("disabled", true);
    $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);

    //END
    if (
      $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy"
    ) {
      ProductCode_FXTRF = productCodeTRFBuy;
      ProductIDFXTRF = productIDTRFBuy;
    } else {
      ProductCode_FXTRF = productCodeTRFSell;
      ProductIDFXTRF = productIDTRFSell;
    }

    request_getDataFromAPI(
      {
        "CurrencyPair": $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().trim(),
        "TradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "Tenor_Code": tenorCode,
        "Fixing_Frequency": FixingFrq,
        "Settlement_Frequency": SettFrq,
        "EntityID": EntityID,
        "LoginID": userName,
        "DepoCcy": pair.split("-")[0].trim(),
        "AltCcy": pair.split("-")[1].trim(),
        "iProductId": ProductIDFXTRF,
        "I_ProductCode": ProductCode_FXTRF,
        "ProductCode": ProductCode_FXTRF,
        "optioncut": $(thisTileFXTRF).find('[id^="Optioncutddl"]').val(),
        "CurrentTileID": that + "|" + "",
      },

      clientConfigdata.CommonMethods.NodeServer + "fillFirstFixingDate","","POST",that +"|" + userName + '_' + 'fillFirstFixingDate'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        let thisTileFXTRF = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        let TileID = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        //$(thisTileFXTRF).find('[id^="FirstFixDate"]').val(data.dataFromAjax[0].FixingDate);
        let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

        if(responseHeader.toUpperCase() == "SUCCESS"){
          let strFirstFix = new Date(
            data.dataFromAjax.FixingDate
          );
          let firstFix = strFirstFix.getFullYear() + "-" + ("0" + (strFirstFix.getMonth() + 1)).substr(-2, 2) + "-" + ("0" + strFirstFix.getDate()).substr(-2, 2);
          $(thisTileFXTRF).find('[id^="FirstFixDate"]').val(firstFix);
          $(thisTileFXTRF).find('[id^="lblFirstFixDate"]').html(data.dataFromAjax.fixingDate);

        } else {

          let failReason = data.CalculateDatesResult.A_ResponseHeader.FailedReason;

          ValidateField($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').attr('id'), failReason, thisTileFXTRF);

      }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
function fillDatesONFirstFixTRF(pair, typeval, NoofFixing, custDate, that) {
  try {
    thisTileFXTRF = document.getElementById("td" + that);

     //ADDED FOR NEW UI | Chaitanya M | 02-Feb-2023
    //START
    if(!$(thisTileFXTRF).find('[id^="rbRowKIToggleTRF"]')[0].checked){    
      
      if(typeval.includes("BABS")){
        if(typeval=="BABS1N00"){
          typeval = "BABS1Y01"
        }else{
          typeval = "BABS2Y02"
        }
      }else if(typeval.includes("MAMS")){
        if(typeval=="MAMS1N00"){
          typeval = "MAMS1Y01"
        }else{
          typeval = "MAMS2Y02"
        }
      }else if(typeval.includes("WAWS")){
        if(typeval=="WAWS1N00"){
          typeval = "WAWS1Y01"
        }else{
          typeval = "WAWS2Y02"
        }
      }     
      
    }  
frequencynameTRF = typeval;  
    //END

    if (
      typeval == "MAMS1Y01" ||
      typeval == "MAMS2Y02" ||
      typeval == "MAMS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
      FixingFrq = FreqTRF[2];
      SettFrq = FreqTRF[2];
      tenorCode = NoofFixing + SettFrq[0];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    } else if (typeval == "MAMS1N00" || typeval == "MAMS2N00") {
      FixingFrq = FreqTRF[2];
      SettFrq = FreqTRF[2];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (
      typeval == "WAWS1Y01" ||
      typeval == "WAWS2Y02" ||
      typeval == "WAWS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
      FixingFrq = FreqTRF[3];
      SettFrq = FreqTRF[3];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "WAWS1N00" || typeval == "WAWS2N00") {
      FixingFrq = FreqTRF[3];
      SettFrq = FreqTRF[3];
      tenorCode = NoofFixing + SettFrq[0];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    } else if (
      typeval == "BABS1Y01" ||
      typeval == "BABS2Y02" ||
      typeval == "BABS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
      FixingFrq = FreqTRF[1];
      SettFrq = FreqTRF[1];
      tenorCode = NoofFixing * 2 + tenorArr[1][1];
    } else if (typeval == "BABS1N00" || typeval == "BABS2N00") {
      FixingFrq = FreqTRF[1];
      SettFrq = FreqTRF[1];
      tenorCode = NoofFixing * 2 + tenorArr[1][1];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    } else if (
      typeval == "DAWS1Y01" ||
      typeval == "DAWS2Y02" ||
      typeval == "DAWS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", );//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
      FixingFrq = FreqTRF[0];
      SettFrq = FreqTRF[3];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "DAWS1N00" || typeval == "DAWS2N00") {
      FixingFrq = FreqTRF[0];
      SettFrq = FreqTRF[3];
      tenorCode = NoofFixing + SettFrq[0];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    } else if (
      typeval == "DAMS1Y01" ||
      typeval == "DAMS2Y02" ||
      typeval == "DAMS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
      FixingFrq = FreqTRF[0];
      SettFrq = FreqTRF[2];
      tenorCode = NoofFixing + SettFrq[0];
    } else if (typeval == "DAMS1N00" || typeval == "DAMS2N00") {
      FixingFrq = FreqTRF[0];
      SettFrq = FreqTRF[2];
      tenorCode = NoofFixing + SettFrq[0];
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", true);//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    }

    $(thisTileFXTRF).find('[id^="hdnFXTRFTenorCode"]').val(tenorCode);

    // Addded for CFINT-992 // 18-Sep-2020 //

    $(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("disabled", true);
    $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);

    //END
    if (
      $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy"
    ) {
      ProductCode_FXTRF = productCodeTRFBuy;
      ProductIDFXTRF = productIDTRFBuy;
    } else {
      ProductCode_FXTRF = productCodeTRFSell;
      ProductIDFXTRF = productIDTRFSell;
    }

    request_getDataFromAPI(
      {

        "EntityID": EntityID,
        "LoginID": userName,
        "DepoCcy": pair.split("-")[0].trim(),
        "AltCcy": pair.split("-")[1].trim(),
        "CurrencyPair" : $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().trim(),
        "TradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "Tenor_Code": tenorCode,
        "Fixing_Frequency":FixingFrq,
        "Settlement_Frequency":SettFrq,
        "iProductId": ProductIDFXTRF,
        "I_ProductCode": ProductCode_FXTRF,
        "ProductCode": ProductCode_FXTRF,
        "FirstFixingDate":custDate,
        "CurrentTileID": that,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "optioncut": $(thisTileFXTRF).find('[id^="Optioncutddl"]').val(),

      },
      clientConfigdata.CommonMethods.NodeServer + "filldatesafterFix","","POST",that +"|" + userName + '_' + 'filldatesafterFix'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        let thisTileFXTRF = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        let TileID = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

        if(responseHeader.toUpperCase() == "SUCCESS"){
        $(thisTileFXTRF).find('[id^="FXTRF_Expiry"]').html("");

        $(thisTileFXTRF).find('[id^="hdnFXTRFExpiry"]').val("");

        $(thisTileFXTRF).find('[id^="hdnFXTRFDeliveryDate"]').val("");

        $(thisTileFXTRF)
          .find('[id^="FXTRF_Expiry"]')
          .html(data.CalculateDatesResult.Dates[0].FixingDate); //LGTCLI-401 - Instant Pricer FX Final Fixing Date (FXD) | Chaitanya M | 12 April 2023

        $(thisTileFXTRF)
          .find('[id^="hdnFXTRFExpiry"]')
          .val(data.CalculateDatesResult.Dates[0].FixingDate);

        $(thisTileFXTRF)
          .find('[id^="hdnFXTRFDeliveryDate"]')
          .val(data.CalculateDatesResult.Dates[0].MaturityDate);

        $(thisTileFXTRF)
          .find('[id^="btnBestPriceFXTRF"]')
          .attr("disabled", false);
        } else {

          let failReason = data.CalculateDatesResult.A_ResponseHeader.FailedReason;

          ValidateField($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').attr('id'), failReason, thisTileFXTRF);

      }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

function checkTRFComboType(ComboType, thisTileFXTRF) {
  try {
    
    //ADDED FOR NEW UI | Chaitanya M | 02-Feb-2023
    //START
    let frqncytrf = $(thisTileFXTRF).find('[id^="frequencyFXTRF"]').val(); // LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

    if(!$(thisTileFXTRF).find('[id^="rbRowKIToggleTRF"]')[0].checked){ //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    
      if(frqncytrf.includes("BABS")){//LGTGTWINT-2110 | Chaitanya M | 10 Aug 2023
        
        if(ComboType=="BABS1N00"){
          ComboType = "BABS1Y01"
        }else{
          ComboType = "BABS2Y02"
        }

      }else if(frqncytrf.includes("MAMS")){ //LGTGTWINT-2110 | Chaitanya M | 10 Aug 2023

        if(ComboType=="MAMS1N00"){
          ComboType = "MAMS1Y01"
        }else{
          ComboType = "MAMS2Y02" //LGTGTWINT-2110 | Chaitanya M | 08 Sep 2023
        }

      }else if(frqncytrf.includes("WAWS")){ //LGTGTWINT-2110 | Chaitanya M | 10 Aug 2023

        if(ComboType=="WAWS1N00"){
          ComboType = "WAWS1Y01"
        }else{
          ComboType = "WAWS2Y02" //LGTGTWINT-2110 | Chaitanya M | 10 Aug 2023
        }

      }

    }
     
    frequencynameTRF = ComboType;
    //END
  
    if (
      ComboType == "MAMS1Y01" ||
      ComboType == "MAMS2Y02" ||
      ComboType == "MAMS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);
    } else if (ComboType == "MAMS1N00" || ComboType == "MAMS2N00") {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val("").prop("disabled", true);
    } else if (
      ComboType == "WAWS1Y01" ||
      ComboType == "WAWS2Y02" ||
      ComboType == "WAWS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);
    } else if (ComboType == "WAWS1N00" || ComboType == "WAWS2N00") {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val("").prop("disabled", true);
    } else if (
      ComboType == "BABS1Y01" ||
      ComboType == "BABS2Y02" ||
      ComboType == "BABS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);
    } else if (ComboType == "BABS1N00" || ComboType == "BABS2N00") {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val("").prop("disabled", true);
    } else if (
      ComboType == "DAWS1Y01" ||
      ComboType == "DAWS2Y02" ||
      ComboType == "DAWS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);
    } else if (ComboType == "DAWS1N00" || ComboType == "DAWS2N00") {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val("").prop("disabled", true);
    } else if (
      ComboType == "DAMS1Y01" ||
      ComboType == "DAMS2Y02" ||
      ComboType == "DAMS2Y12"
    ) {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);
    } else if (ComboType == "DAMS1N00" || ComboType == "DAMS2N00") {
      $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val("").prop("disabled", true);
    }
  } catch (er) {
    console.log(er.message);
  }
}

//To Get Best Price of FXTRF and display the prices
function getBestPriceFXTRF(that, Scheduleflag) {
  try {
    TileIdFXTRF = that.id.match(/\d+$/)[0];
    thisTileFXTRF = document.getElementById("td" + TileIdFXTRF);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
    
    validation_clear(); //To Remove highlighted part if no error

    // Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
    // START - LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    resetFXDPrice(thisTileFXTRF,true); // LGTGTWINT-2331 | Chaitanya M | 22 Aug 2023
    $(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("disabled", true); 
    let _RID_TRF = ""; 
    _RID_TRF = _RID_TRF + RequestIDGenerator(45); 
    $(thisTileFXTRF).find('[id^="hdnRequestID"]').val(_RID_TRF);
    // END - LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    checkTRFComboType($(thisTileFXTRF).find('[id^="frequencyFXTRF"]').val(),thisTileFXTRF); // LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
    // END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
    
    //Validation conditions
    if ($.trim($(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val()) == "") {

      ValidateField($(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').attr("id"),"Please Select Currency Pair",thisTileFXTRF);
      return false;

    } else if ($.trim($(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').val()) == "" ||parseFloat($(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').val()) == 0) {

        ValidateField($(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').attr("id"),"Please Enter Valid Contract Amount",thisTileFXTRF);
        return false;

    } else if ($.trim($(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').val()) == "" ||
        $.trim($(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').val()) <=0) {

        ValidateField($(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').attr("id"),"Please Enter Valid No. Of Settlements.",thisTileFXTRF);
        return false;

    }else if(frequencynameTRF.includes("N") == false) {
      if ($.trim($(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val()) == "" ||parseFloat($(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val()) == 0) {

        ValidateField($(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').attr("id"),"Please Enter Valid KI.",thisTileFXTRF);
        return false;
      }
      
    } else if ($.trim($(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val()) == "" ||
        parseFloat($(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val()) == 0) {

          ValidateField($(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').attr("id"),"Please Enter Valid Target",thisTileFXTRF);
          return false;

    } else if ($.trim($(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').val().replace(/,/g, "")) == "" ||
        $.trim($(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').val().replace(/,/g, "")) == 0) {

        ValidateField($(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').attr("id"),"Please Enter Valid No Of Settlements.",thisTileFXTRF);
        return false;
    } 
    // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    else if($(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("PREMIUM")){
      if ( $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val().replace(/,/g, "") == "" || $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val().replace(/,/g, "") <=0) {
        ValidateField($(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').attr("id"),"Please Enter Valid Strike Rate",thisTileFXTRF);
        return false;
      }      
    }else if($(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")){
      if ( $(thisTileFXTRF).find('[id^="spreadAmtFX"]').val().replace(/,/g, "") == "" || $(thisTileFXTRF).find('[id^="spreadAmtFX"]').val().replace(/,/g, "") <=0) {
        ValidateField($(thisTileFXTRF).find('[id^="spreadAmtFX"]').attr("id"),"Please Enter Valid Premium.",thisTileFXTRF);
        return false;
      }
    }
    // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    
    // else if (
    //   $(thisTileFXTRF)
    //     .find('[id^="CappedLossCcyFXTRF"]')
    //     .val()
    //     .includes("No") == false
    // ) {
    //   if (
    //     $.trim($(thisTileFXTRF).find('[id^="CappedLossAmountFXTRF"]').val()) ==
    //       "" ||
    //     parseFloat(
    //       $(thisTileFXTRF).find('[id^="CappedLossAmountFXTRF"]').val()
    //     ) == 0
    //   ) {
    //     ValidateField(
    //       $(thisTileFXTRF).find('[id^="CappedLossAmountFXTRF"]').attr("id"),
    //       "Please Enter Valid Capped Loss Amount",thisTileFXTRF
    //     );
    //     return false;
    //   }
   // }

    
    let prmiumDate = new Date($(thisTileFXTRF).find('[id^="hdnFXTRFPremiumDate"]').val());
    let FixingDate = new Date($(thisTileFXTRF).find('[id^="FirstFixDate"]').val());
    let tradedate = new Date(TradeDateFXTRF);

    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let weekday = new Date($(thisTileFXTRF).find('[id^="FirstFixDate"]').val());
    let dayName = days[weekday.getDay()];

    if (dayName.toUpperCase().includes("SAT") || dayName.toUpperCase().includes("SUN") ) {
      ValidateField($(thisTileFXTRF).find('[id^="FirstFixDate"]').attr("id"),"First Fixing Date should not fall on holiday.",thisTileFXTRF);
      return false;
    }

    if ($(thisTileFXTRF).find('[id^="frequencyFXTRF"]').val().includes("DAWS") || $(thisTileFXTRF).find('[id^="frequencyFXTRF"]').val().includes("DAMS")) {
      if (FixingDate.getTime() < tradedate.getTime()) {
        ValidateField($(thisTileFXTRF).find('[id^="FirstFixDate"]').attr("id"),"First fixing should not be less than Trade Date.",thisTileFXTRF);
        return false;
      }
      }

    // LGTCLI-370 Instant Pricer First Fixing Date Next Day || Chaitanya M || 27 March 2023
    // else {
    //   if (prmiumDate.getTime() > FixingDate.getTime()) {
    //     ValidateField($(thisTileFXTRF).find('[id^="FirstFixDate"]').attr("id"),"First fixing should not be less than Premium date.",thisTileFXTRF);
    //     return false;
    //   }
    // }
    //end

    // Check for KI

    if (frequencynameTRF.includes("N") ==false) {
      if ($(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
        if ($.trim($(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val().replace(/,/g, "")) >=$.trim($(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val().replace(/,/g, ""))) {
          ValidateField($(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').attr("id"),"KI Rate cannot be greater than or equal to strike.",thisTileFXTRF);
          return false;
        }
      } else {
        if ($.trim($(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val().replace(/,/g, "")) <=$.trim( $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val().replace(/,/g, ""))) {
          ValidateField($(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').attr("id"),"KI Rate cannot be less than or equal to strike.",thisTileFXTRF);
          return false;
        }
      }
    }

    //Validation END

    $(thisTileFXTRF).find('[id^="loader_FXTRF"]').show();
    $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); // Disabling book trade button while pricing is happening -
    $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);// added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    // Check for KIStyle
    // Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
    if (frequencynameTRF.includes("1N") || frequencynameTRF.includes("2N")) {
      KIStyleTRF = KIstyleArr[0];
    } else if (frequencynameTRF.includes("01")) {
      KIStyleTRF = KIstyleArr[1];
    } else if (frequencynameTRF.includes("02")) {
      KIStyleTRF = KIstyleArr[2];
    } else if (frequencynameTRF.includes("12")) {
      KIStyleTRF = KIstyleArr[3];
    }
    // Check For Leverage
    if (frequencynameTRF.includes("1Y") ||frequencynameTRF.includes("1N")) {
      LeverageFXTRF = LeverageArray[0];
    } else if (frequencynameTRF.includes("2Y") ||frequencynameTRF.includes("2N")) {
      LeverageFXTRF = LeverageArray[1];
    }

    // Check For Settlement Freq.

    if (frequencynameTRF.includes("BS")) {
      SettFreqTRF = FreqTRFArr[0];
    } else if (frequencynameTRF.includes("MS")) {
      SettFreqTRF = FreqTRFArr[1];
    } else if (frequencynameTRF.includes("WS")) {
      SettFreqTRF = FreqTRFArr[2];
    }
    // ENd
    
    //  Capped Loss YN check

    // if ($(thisTileFXTRF).find('[id^="CappedLossCcyFXTRF"]').val() == "No") {
    //   cappedLossYN = "No";
    //   cappedLossAmt = "0";
    // } else {
    //   cappedLossYN = "Yes";
    //   cappedLossAmt = $(thisTileFXTRF)
    //     .find('[id^="CappedLossAmountFXTRF"]')
    //     .val();
    // }

    //  Check for Final Pay and FixingAdjustment

    if ($(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]')[0].value == "ExactN") {
      finalPayType = "Exact";
      FixingAdjustment = "Notional";
    } else if ($(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]')[0].value == "ExactS") {
      finalPayType = "Exact";
      FixingAdjustment = "Strike";
    } else if ($(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]')[0].value == "FullNO") {
      finalPayType = "Full";
      FixingAdjustment = "None";
    } else if ($(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]')[0].value == "None") {
      finalPayType = "None";
      FixingAdjustment = "None";
    } else if ($(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]')[0].value == "") {
      finalPayType = "";
      FixingAdjustment = "";
    }

    // $(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("disabled", true);

    //END
    if ($(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
      ProductCode_FXTRF = productCodeTRFBuy;
      ProductIDFXTRF = productIDTRFBuy;
    } else {
      ProductCode_FXTRF = productCodeTRFSell;
      ProductIDFXTRF = productIDTRFSell;
    }

    if ($(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
      ProductName_FXTRF = ProductNameFXTRFBuy;
      TemplateCode_FXTRF = TemplateCodeTRFBuy;
      TemplateID_FXTRF = TemplateIDTRFBuy;
      ProductIDFXTRF = productIDTRFBuy;
      ProductCode_FXTRF = productCodeTRFBuy;
      MaxQuoteTimeOutFXTRF = MaxQuoteTimeOutTEKO; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
      MinQuoteTimeOutFXTRF = MinQuoteTimeOutTEKO; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023

      // Start|| Commented by ChaitanyaM For the Api config call change.| Ref: LGTGTWINT-887 | 9-Jan-23 
      // MaxQtime = MaxQuoteTimeOutTEKO;
      // MinQTime = MinQuoteTimeOutTEKO;
      // MinQValidity = MinQuoteValidityPeriodRFQTEKO;
      // MaxTTL = MaxTTLTEKO;
      // IgnoreValidTill = IgnoreValidTillYNTEKO;
      // CheckOnlyRFQ = CheckOnlyRFQYNTEKO;
      // UseMaxTTL = UseMaxTTLTEKO;
      // End
    } else {
      ProductName_FXTRF = ProductNameFXTRFSell;
      TemplateCode_FXTRF = TemplateCodeTRFSell;
      TemplateID_FXTRF = TemplateIDTRFSell;
      ProductIDFXTRF = productIDTRFSell;
      ProductCode_FXTRF = productCodeTRFSell;
      MaxQuoteTimeOutFXTRF = MaxQuoteTimeOutTARFSELL; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
      MinQuoteTimeOutFXTRF = MinQuoteTimeOutTARFSELL; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023

      // Start|| Commented by ChaitanyaM For the Api config call change.| Ref: LGTGTWINT-887 | 9-Jan-23   
      // MaxQtime = MaxQuoteTimeOutTARFSELL;
      // MinQTime = MinQuoteTimeOutTARFSELL;
      // MinQValidity = MaxTTLTARFSELL;
      // MaxTTL = MinQuoteValidityPeriodRFQTARFSELL;
      // IgnoreValidTill = IgnoreValidTillYNTARFSELL;
      // CheckOnlyRFQ = CheckOnlyRFQYNTARFSELL;
      // UseMaxTTL = UseMaxTTLTARFSELL;
      // End
    }
    //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
    // var targetBFFXTRF = $(thisTileFXTRF)
    //   .find('[id^="targetinpboxFXTRF"]')
    //   .val(); //Added by shubham k on 20-Oct-2021 for Target In pips
    // var NoofKOITMEventsFXTRF = $(thisTileFXTRF)
    //   .find('[id^="targetinpboxFXTRF"]')
    //   .val();
    // var targetPipsFXTRF = ""; //Added by shubham k on 20-Oct-2021 for Target In pips

    // if ($(thisTileFXTRF).find('[id^="TypeFXTRF"]').val() == "Big Figure") {
    //   NoofKOITMEventsFXTRF = "";
    //   targetPipsFXTRF = (parseFloat(targetBFFXTRF) * 100).toString(); //Added by shubham k on 20-Oct-2021 for Target In pips
    // } else {
    //   targetBFFXTRF = "";
    //   targetPipsFXTRF = "";
    // }

    // Added for LGTCLI-368 Instant Pricing BF/Pips Dropdown for FX Tiles | Chaitanya M | 30 March 2023
    // var targetPipsFXTRF = $(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val(); //Added by shubham k on 20-Oct-2021 for Target In pips
    // var NoofKOITMEventsFXTRF=";"
 
    // targetBFFXTRF = (parseFloat(targetPipsFXTRF) / 100).toString(); //Added by shubham k on 20-Oct-2021 for Target In pips
  
    //LGTGTWINT-2110 | Chaitanya M | 13 July 2023
    timeoutFXTRF = parseInt(MinQuoteTimeOutFXTRF) - 1 ;
    $(thisTileFXTRF).find('[id^="hdntimerFX"]').val(timeoutFXTRF);
    //End

    // Added for LGTCLI-368 Instant Pricing BF/Pips Dropdown for FX Tiles | Chaitanya M | 30 March 2023
    var targetBFFXTRF = ""
    var targetPipsFXTRF = ""; 
    var NoofKOITMEventsFXTRF =""

    if ($(thisTileFXTRF).find('[id^="TargetTypeFXTRF"]').val() == "Big Figure") {

      targetBFFXTRF = $(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val(); 
      NoofKOITMEventsFXTRF = "";
      targetPipsFXTRF = (parseFloat(targetBFFXTRF) * 100).toString(); 

    } else {

      targetPipsFXTRF = $(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val(); 
      NoofKOITMEventsFXTRF="" ;
      targetBFFXTRF = (parseFloat(targetPipsFXTRF) / 100).toString(); 

    }  
    //End

    //END

    // Check Added for Spot Rate & LP Mapping

    if ( $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
      spotRateTRF = $(thisTileFXTRF).find('[id^="rateFXTRF"]').html().split("/")[1].replace(/,/g, "").trim();
      
      // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      if(AllowSolveForYN === "YES"){
        if ($(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {
          LPListTRF = LPListTRFBuy.split("|")[1];
        }else{
          LPListTRF = LPListTRFBuy.split("|")[0];
        }
      }else{
        LPListTRF = LPListTRFBuy.split("|")[0];
      }
      // END - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

      callputType = "CALL";
      
    } else {
      spotRateTRF = $(thisTileFXTRF).find('[id^="rateFXTRF"]').html().split("/")[0].replace(/,/g, "").trim();
      
      // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      if(AllowSolveForYN === "YES"){
        if ($(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {
          LPListTRF = LPListTRFSell.split("|")[1];
        }else{
          LPListTRF = LPListTRFSell.split("|")[0];
        }
      }else{
        LPListTRF = LPListTRFSell.split("|")[0];
      }
      // END - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      callputType = "PUT";
    }
    // END


    // LGTGTWINT-975 Instant Pricer | Missing KIYesNo tag in external XML for pricing

    let KIYN = "";

    if (frequencynameTRF.includes("N")) { 

      KIYN = "No"

    } else{

      KIYN = "Yes"

    }

    //END

    // LGTCLI-285 -Instant Pricing TARF PM Prem CCY in 1st CCY || RizwanS || 01 Feb 2023

    let _premCcy = "";

    if($(thisTileFXTRF).find('[id^="hdnisMetalFX"]').val() === "Y"){ // LGTCLI-437 | Chaitanya M | 11 July 2023
  
       _premCcy =  $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim();
        
    }else{
  
      _premCcy =  $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim();
  
    }
  
    // END

    console.log("PricingFor ::", TileIdFXTRF, TemplateCode_FXTRF);

    // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 22 Aug 2023
    let _strikeTRF="";
    let _premiumTRF="";
    let _SolveForFXTRF = "";
    let ShowRFSTRF ="";// SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023

    if(AllowSolveForYN === "YES"){
      if ($(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {

        _strikeTRF = "0";
        _premiumTRF = $(thisTileFXTRF).find('[id^="spreadAmtFX"]').val().replace(/,/g, "");
        _SolveForFXTRF = $(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().toUpperCase();
        ShowRFSTRF = isRFS === true ? false : isRFS;  // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023

      } else {

        _strikeTRF = $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val().replace(/,/g, "");
        _premiumTRF = "0";
        _SolveForFXTRF = $(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().toUpperCase();
        ShowRFSTRF = isRFS ; // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023

      }
    }else{
      _strikeTRF = $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val().replace(/,/g, "");
      _premiumTRF = "0";
      _SolveForFXTRF = "PREMIUM";
      ShowRFSTRF = isRFS ; // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023
    }

    // END - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 22 Aug 2023

    var xmlstrFXTRF =
      "<ExcelSheets>" +
      "<Sheet1>" +
      "<Product_Name>" + ProductName_FXTRF + "</Product_Name>" +
      "<Hedging_x0020_Type>" + clientConfigdata.FXDCommonMethods.Hedging_Type + "</Hedging_x0020_Type>" +
      // COmmented fro syncing with Single Pricer : 
      // "<CustID>" + custID + "</CustID>" +
      // "<Customer_Name>" + custName + "</Customer_Name>" +
      "<TargetInPips>" + targetPipsFXTRF + "</TargetInPips>" +
      //Start Added by shubham k on 20-Oct-2021 for Target In pips
      "<TargetBF>" + targetBFFXTRF + "</TargetBF>" +
      "<TargetGainunit>" + "Big Figure" + "</TargetGainunit>" +
      "<NoofKOITMEvents>0</NoofKOITMEvents>" +
      "<OptionCut>" + $(thisTileFXTRF).find('[id^="Optioncutddl"]').val() + "</OptionCut>" +
      "<NonDeliveryYN>"+ $(thisTileFXTRF).find('[id^="hdnNDFFlagFX"]').val() +"</NonDeliveryYN>" + //HSBCFXEINT-25 || RizwanS || 14 Dec 2023
      "<FirstFixingDate>" + $(thisTileFXTRF).find('[id^="FirstFixDate"]').val() + "</FirstFixingDate>" +
      "<FixingSettFreq>" + SettFreqTRF + "</FixingSettFreq>" +
      "<Currency1>" + $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val() + "</Currency1>" +
      "<CcyPair>" + $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().trim() + "</CcyPair>" +
      "<PremiumCcy>" + _premCcy + "</PremiumCcy>" +
      "<CustPrem>0</CustPrem>" +
      "<TradeDate>" + TradeDateFXTRF + "</TradeDate>" +
      "<PremiumDate>" + $(thisTileFXTRF).find('[id^="hdnFXTRFPremiumDate"]').val() + "</PremiumDate>" +
      "<FixingDate>" + $(thisTileFXTRF).find('[id^="hdnFXTRFExpiry"]').val() + "</FixingDate>" +
      "<SettDate>" + $(thisTileFXTRF).find('[id^="hdnFXTRFDeliveryDate"]').val() + "</SettDate>" +
      "<BuySell>" + $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val().trim().toUpperCase() + "</BuySell>" +//LGTGTWINT-2047 || RizwanS || 30 May 2023
      "<Spotrate>" + spotRateTRF + "</Spotrate>" +
      "<LeverageFactor>" + LeverageFXTRF + "</LeverageFactor>" +
      "<Ccy1PerFixing>" + $(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').val().replace(/,/g, "") + "</Ccy1PerFixing>" +
      "<Strike>" + _strikeTRF + "</Strike>" + //SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 1 Nov 2023
      "<TenorDays>" + $(thisTileFXTRF).find('[id^="hdnTenorDaysTRF"]').val() + "</TenorDays>" +
      "<Tenor>" + $(thisTileFXTRF).find('[id^="hdnFXTRFTenorCode"]').val() + "</Tenor>" +
      "<KIBarrierType>" +KIYN + "</KIBarrierType>" +
      "<KIYesNo>" + KIYN +"</KIYesNo>" + // LGTGTWINT-975 Instant Pricer | Missing KIYesNo tag in external XML for pricing
      "<KI>" + $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val() + "</KI>" +
      "<KIStyle>" + KIStyleTRF + "</KIStyle>" +
      "<UpperKI></UpperKI>" +
      "<FinalPayType>" + finalPayType + "</FinalPayType>" +
      "<FixingAdjustment>" + FixingAdjustment + "</FixingAdjustment>" +
      //Added by shubham k for capped loss currency in CappedLoss column
      //"<CappedLoss></CappedLoss>" +
      //"<CappedLossCcy></CappedLossCcy>" +
      //"<CappedLossYN></CappedLossYN>" +
      //"<CappedLossAmount></CappedLossAmount>" +
      "<Entity_ID>" + sessionStorage.getItem("HomeEntityID") + "</Entity_ID>" +
      "<CAI_ID>" + clientConfigdata.FXDCommonMethods.CAI_ID + "</CAI_ID>" +
      "<NoofSett>" + $(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').val() + "</NoofSett>" +
      "</Sheet1>" +
      "</ExcelSheets>";

      $(thisTileFXTRF).find('[id^="hdnXmlStrFXTRF"]').val(xmlstrFXTRF);

    if (Scheduleflag) {
      GetRulescheduleFXD(TileIdFXTRF,xmlstrFXTRF,TemplateCode_FXTRF,TemplateID_FXTRF);
    } else {
      USERID_FXTRF = "MGU_" + sessionStorage.getItem("Username");
      $(thisTileFXTRF).find('[id^="hdnUserIDFXTRF"]').val(USERID_FXTRF);

      //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      if( $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val() ==  $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim()){
        _AlternateCCy = $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim();
      }else{
        _AlternateCCy = $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim();

      }

      $(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("disabled", true); // LGTGTWINT-2110 | Chaitanya M | 13 July 2023
      mapleLoaderStart(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      request_getDataFromAPI(
        {
          
          ProductType: ProductCode_FXTRF,
          CurrencyPair: $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().trim(),
          DepositCurrency: $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val(),
          PremCurrency:_premCcy,
          AlternateCurrency:_AlternateCCy,
          SettlementCcy: _premCcy,
          AmountInDepositCurrency: $(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').val().replace(/,/g, ""),
          SolveFor : _SolveForFXTRF,
          BuySell: $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val().trim().toUpperCase(),
          CallPut : "",
          Strike: _strikeTRF,
          LowerBarrier: 0,
          UpperBarrier: 0,
          BarrierType: "",
          KnockIn_Style: "",
          KnockOut_Style: "",
          OptionCut: $(thisTileFXTRF).find('[id^="Optioncutddl"]').val(),
          MarketPremium: "0",
          MarketPremiumAmount : _premiumTRF,
          RMMarginPercentage: "0",
          Tenor: $(thisTileFXTRF).find('[id^="hdnFXTRFTenorCode"]').val(),
          TradeDate: TradeDateFXTRF,
          ValueDate: $(thisTileFXTRF).find('[id^="hdnFXTRFPremiumDate"]').val(),
          FixingDate: $(thisTileFXTRF).find('[id^="hdnFXTRFExpiry"]').val(),
          MaturityDate: $(thisTileFXTRF).find('[id^="hdnFXTRFDeliveryDate"]').val(),
          NDFFlag: $(thisTileFXTRF).find('[id^="hdnNDFFlagFX"]').val(),
          IsMetal:  $(thisTileFXTRF).find('[id^="hdnisMetalFX"]').val(),
          UserID: sessionStorage.getItem("Username"),
          EntityId: sessionStorage.getItem("HomeEntityID"),
          IndicativeQuote: "",
          Deal_Rate2: "",
          NoteMasterID: "0",
          blnIsMultiLeg: true,
          InternalLPID: "",
          NotionalInPremCcy: "0",
          PriceProviderDetails: LPListTRF,
          CIF_Code: "",
          BTB_Protfolio_Code: "",
          Marketer_Code: "",
          Strategy_Code: "",
          ExternalXMLString: xmlstrFXTRF,
          UseExternalXML_Source: true,
          TemplateCode: TemplateCode_FXTRF,
          TemplateID: TemplateID_FXTRF,
          ProductID: ProductIDFXTRF, 
          RFQSource:"Instant_Pricer",
          requestID: userName + '_' + 'GetFXOPriceFromExternalProvidersJSON'  +'_' + RequestIDGenerator(8),
          PriceMode:ShowRFSTRF,  // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023
          Mode: "FXOSEN",
          DI_YN: "N",
          KIType: "",
          Remark: "",
          CapLoss: "",
          DCDRFQID: "",
          GroupKey: "",
          Frequency: SettFreqTRF,
          CapLossCcy: "",
          TargetType: "",
          PayAtStrike: "",
          AdjustmentYN: "",
          PricingModel: "Black Scoles",
          CapLossAmount: "",
          AdjustmentType: "",
          ResponseMethod: "",
          DIfromTradeIdea: "",
          Parant_DCDRFQID: "",
          StrikeAdjustment: "",
          CustomerPremAmount: "",
          GuaranteedLeverageYN: "",
          Bank_Prem_CashFlow_Direction: "",
          Target: targetPipsFXTRF,
          CurrentTileID: TileIdFXTRF +  "|" + $(thisTileFXTRF).find('[id^="hdnRequestID"]').val(),
        },
        clientConfigdata.CommonMethods.NodeServer + "fxobestprice/GetFXOPriceFromExternalProvidersJSON","","POST",TileIdFXTRF +"|" + userName + '_' + 'getPriceFXTRF'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        .then((data) => {

          thisTileFXTRF = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
          
          let TileID = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

          // Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
          if($(thisTileFXTRF).find('[id^="hdnRequestID"]').val() != data.CurrentTileID.split("|")[1] || $(thisTileFXTRF).find('[id^="hdnRequestID"]').val() === ""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

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
          if(_SolveForFXTRF === "PREMIUM"){  
            // LGTGTWINT-1934 FXD | Dynamic pricing on Instant pricer || RizwanS || 20 May 2023
          
            if(isRFS){
              
              if(responseHeader == "SUCCESS"){ // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 

              //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("");
              $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);  //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              //End

                let _priceObj = data.dataFromAjax.oPriceResponseBody;

                if (_priceObj.length > 0) {
  
                  $(thisTileFXTRF).find('[id^="hdnNMID"]').val(_priceObj[0].NoteMasterID); 
                  $(thisTileFXTRF).find('[id^="hdno_DCDRFQID"]').val(_priceObj[0].o_DCDRFQID);
  
                  let quoteString = "";
                  for (i = 0;i < _priceObj.length;i++) {
                    let quoteId = _priceObj[i].quoteId;
                    quoteString += quoteString.length == 0 ? quoteId : "," + quoteId;
                  }

                  dictFXD[data.currentTile] = quoteString; //To add element in dictionary
                  $(thisTileFXTRF).find('[id^="hdnPricesFXObj"]').val(JSON.stringify(data));
                  $(thisTileFXTRF).find('[id^="hdnQuoteString"]').val(quoteString);
                  callHub(quoteString,MaxQuoteTimeOutFXTRF);
                  // Start- LGTGTWINT-2110 | Chaitanya M | 13 July 2023  
                  setminimumtimoutFXTRF(MinQuoteTimeOutFXTRF,thisTileFXTRF,$(thisTileFXTRF).find('[id^="hdnRFSMinTimer"]')[0],data._requestID) // LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
                  startRFSTimerFXTRF(thisTileFXTRF,$(thisTileFXTRF).find('[id^="hdntimerInterval"]')[0], data._requestID); //LGTGTWINT-2110 | Chaitanya M | 13 June 2023 
                  //End
                  return false;  

                }
              }else{

              //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              if(_dcdRFQID !== ""){
                $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("");
                $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
              }
              //End

                MapPricesFXTRF(data,thisTileFXTRF,false);  // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 |  LGTGTWINT-2110 | Chaitanya M | 13 July 2023
              }
              
            }else{

            //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
            if(_dcdRFQID !== ""){
              $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("");
              $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
            }
            //End 
              MapPricesFXTRF(data,thisTileFXTRF,false); //FXD || Dynamic pricing on Instant pricer || LGTGTWINT-1934 || RizwanS || 02 May 2023 | LGTGTWINT-2110 | Chaitanya M | 13 July 2023
            }
            //END

          }else{

            if(_dcdRFQID !== ""){
              $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("");
              $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
            }  
            MapPricesFXTRF(data,thisTileFXTRF,false);  
          }
          // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023
        });
      }
    } catch (error) {
      console.log(error.message); 
    }
}

// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
function startRFSTimerFXTRF(thisTileFXTRF, uniqueTimeoutID, _requestID){
  try {
          
    //$(thisTileFXTRF).find('[id^="hdntimerInterval"]').val() = setInterval(function() {  
    uniqueTimeoutID.value = setInterval(function() {

      // Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
      if($(thisTileFXTRF).find('[id^="hdnRequestID"]').val() != _requestID || $(thisTileFXTRF).find('[id^="hdnRequestID"]').val() === ""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

       // mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false);
        return false;

      }
      // END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

      showtimerYNFXTRF="Y";        
        
      if(Number($(thisTileFXTRF).find('[id^="hdntimerFX"]').val())>=0) {  

        if($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val() === "" || $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val() === null || $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val() === undefined ){

          $(thisTileFXTRF).find('[id^="TimerDiv"]').removeClass("Showtimer");      
          $(thisTileFXTRF).find('[id^="hdntimerFX"]').val(Number($(thisTileFXTRF).find('[id^="hdntimerFX"]').val()) - 1) ;
      
        }else{

          $(thisTileFXTRF).find('[id^="btnemailquote"]').attr("disabled", true);
          $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true);
          $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);  

          $(thisTileFXTRF).find('[id^="TimerDiv"]').addClass("Showtimer");        
          $(thisTileFXTRF).find('[id^="SignalRTimer"]').attr('title', 'You can place order after '+ Number($(thisTileFXTRF).find('[id^="hdntimerFX"]').val())+ ' seconds.');               
          $(thisTileFXTRF).find('[id^="SignalRTimer"]').html(Number($(thisTileFXTRF).find('[id^="hdntimerFX"]').val()));
          $(thisTileFXTRF).find('[id^="hdntimerFX"]').val(Number($(thisTileFXTRF).find('[id^="hdntimerFX"]').val()) - 1) ;
          
        }

      }else{

        $(thisTileFXTRF).find('[id^="TimerDiv"]').removeClass("Showtimer");                      
        $(thisTileFXTRF).find('[id^="SignalRTimer"]').html("");
        $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", false);  
        $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", false);   
        
        clearInterval(uniqueTimeoutID.value);
        uniqueTimeoutID.value ="";

      }    

    },1000); 

  } catch (error) {
    console.log(error.message);
  }
}
//End LGTGTWINT-2110 | Chaitanya M | 13 July 2023

// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
function setminimumtimoutFXTRF(MinQuoteTimeOutFXTRF, thisTileFXTRF, _uniqueMinTimerid, _requestID){
  try {

    if($(thisTileFXTRF).find('[id^="hdnRequestID"]').val() != _requestID || $(thisTileFXTRF).find('[id^="hdnRequestID"]').val() === ""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    //  mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false);
      return false;

    } 

   _uniqueMinTimerid.value = setTimeout(minQuoteTimeOccurredTRF,parseInt(MinQuoteTimeOutFXTRF) * 1000,thisTileFXTRF,$(thisTileFXTRF).find('[id^="hdnRFSMinTimer"]')[0], _requestID); // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
  } catch (error) {
    console.log(error.message); 
  }
}
// END - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
// END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

// End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
function closetimerFXTRF(intervalid,thistile){
try {
  
  //if($(thistile).find('[id^="SignalRTimer"]').html() == ""){
    clearTimeout(intervalid.value);
    intervalid.value="";
  //}

} catch (error) {
  
}
}
//END - LGTGTWINT-2110 | Chaitanya M | 13 July 2023

//FXD || Dynamic pricing on Instant pricer || LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 | LGTGTWINT-2110 | Chaitanya M | 13 July 2023
// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
function minQuoteTimeOccurredTRF(thistile,_uniqueMinTimerid, _requestID){
  try{

    MinQuoteTimeOutOccurredTRF =true;

    if($(thistile).find('[id^="hdnRequestID"]').val() != _requestID || $(thistile).find('[id^="hdnRequestID"]').val()===""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    //  mapleLoaderStop(thistile,'[id^="btnBestPriceFXTRF"]',false);
      return false;

    }
  
    if($(thistile).find('[id^="hdnsignalRMsgRecv"]').val().toUpperCase() === "YES"){ 
  
      mapleLoaderStop(thistile,'[id^="btnBestPriceFXTRF"]',false);
      $(thistile).find('[id^="btnBookTradeFXTRF"]').attr("disabled", false);  
      $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
      $(thistile).find('[id*="btnemailquote"]').attr("disabled", false);
      $(thistile).find('[id^="hdnsignalRMsgRecv"]').val("NO");

      MinQuoteTimeOutOccurredTRF = false;
      UnsubcribeRFQID(thistile);
      clearTimeout(_uniqueMinTimerid.value);
      _uniqueMinTimerid.value ="";

    }else{
  
      clearTimeout(_uniqueMinTimerid.value);
      _uniqueMinTimerid.value ="";
      maxQuoteTimeOutRFSTRF(thistile,$(thistile).find('[id^="hdnRFSMaxTimer"]')[0],_requestID); //LGTGTWINT-2110 | Chaitanya M | 13 July 2023
  
    }
  
  }catch(error){
    console.log(error.message); 
  }
}
//End
// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
  
//FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 | LGTGTWINT-2110 | Chaitanya M | 13 July 2023
// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
function maxQuoteTimeOutRFSTRF(thistile,_uniqueMaxTimerid, _requestID){
  try{

    MaxQuoteTimeOut = parseInt(MaxQuoteTimeOutFXTRF) - parseInt(MinQuoteTimeOutFXTRF);

    if($(thistile).find('[id^="hdnRequestID"]').val() != _requestID || $(thistile).find('[id^="hdnRequestID"]').val()===""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    //  mapleLoaderStop(thistile,'[id^="btnBestPriceFXTRF"]',false);
      return false;

    } 
    
    _uniqueMaxTimerid.value = setTimeout(() =>{ //LGTGTWINT-2110 | Chaitanya M | 13 July 2023

      maxQuoteTimeOccurredTRF = true;
      // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023

      if($(thistile).find('[id^="hdnsignalRMsgRecv"]').val().toUpperCase() === "YES"){

        UnsubcribeRFQID(thistile);
        clearTimeout(_uniqueMaxTimerid.value);
        _uniqueMaxTimerid.value="";
        closetimerFXTRF(_uniqueMaxTimerid);

        $(thistile).find('[id^="btnBestPriceFXTRF"]').attr("disabled", false);  
        $(thistile).find('[id^="btnBookTradeFXTRF"]').attr("disabled", false);  
        $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thistile).find('[id*="btnemailquote"]').attr("disabled", false);
        mapleLoaderStop(thistile,'[id^="btnBestPriceFXTRF"]',false);
        $(thistile).find('[id^="hdnsignalRMsgRecv"]').val("NO");
        
      }else if($(thistile).find('[id^="hdnsignalRMsgRecv"]').val() === ""){  
        
        if($(thistile).find('[id^="hdnQuoteString"]').val() !== ""){ // LGTGTWINT-1934 || RizwanS || 05 Jun 2023 
         
          UnsubcribeRFQID(thistile);
          clearTimeout(_uniqueMaxTimerid.value);
          _uniqueMaxTimerid.value="";
          closetimerFXTRF(_uniqueMaxTimerid);

          
          $(thistile).find('[id^="btnBestPriceFXTRF"]').attr("disabled", false);  
          $(thistile).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true);   
          $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
          $(thistile).find('[id*="btnemailquote"]').attr("disabled", true);

          mapleLoaderStop(thistile,'[id^="btnBestPriceFXTRF"]',false);

          if($(thistile).find('[id^="hdnRequestID"]').val() === _requestID){

            ValidateField($(thistile).find('[id^="btnBestPriceFXTRF"]').attr("id"),"No response received from remote system.",thistile);
  
          }
        }
      }
      //ENd
    },MaxQuoteTimeOut *1000);

  } catch(error){
    console.log(error.message);
  }
}

//End
// END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023


//FXD | Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || RizwanS || 02 May 2023
function MapPricesFXTRF(data,thisTileFXTRF,isRFS){
  try{
    
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
    
    if(responseHeader.toUpperCase() == "SUCCESS"){
      
      // console.log("Best Price Log's for Tile FXTRF ::" +" " +data.currentTile +"\n" + data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].o_BestPriceLog);
      // console.log("Log's for Tile FXTRF :: DCDRFQID ==" + data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].o_DCDRFQID +"\n" + "NoteMasterID==" + data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].NoteMasterID + "\n" + "USERID==" + $(thisTileFXTRF).find('[id^="hdnUserIDFXTRF"]').val());

      // Added by RizwanS / RFQ ID on UI / 16 Jun 2022 

      //LGTGTWINT-1740 | Chaitanya M | 05 June 2023
      //$(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').show();
      // $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("");
      // $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("RFQ ID : " + data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].o_DCDRFQID);
      // END

      //End

      $(thisTileFXTRF).find('[id^="FXTRFBanksRow"]').empty();
      $(thisTileFXTRF).find('[id^="FXTRFPrices"]').empty();
      // Added by Atharva - Timers - START
      $(thisTileFXTRF).find('[id^="FXTRF_TimerRow"]').empty();
      // END

      // Storing price object in hidden field of current tile
      let FXTRFPriceData = data.dataFromAjax.oPriceResponseBody; // LGTGTWINT-1934 | Chaitanya M | 01 Jun 2023
      $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val(JSON.stringify(FXTRFPriceData));

      $(thisTileFXTRF).find('[id^="RFQFXTRF"]').val(JSON.stringify(FXTRFPriceData));
      if (JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[0].provider == null || JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[0].NoteMasterID == null || JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[0].bestPriceProvider == "FAIL") {

        $(thisTileFXTRF).find('[id^="FXTRFBanksRow"]').append("<td> - </td>");
        $(thisTileFXTRF).find('[id^="FXTRFPrices"]').append("<td> - </td>");
        // Added by Atharva - Timers - START
        $(thisTileFXTRF).find('[id^="FXTRF_TimerRow"]').append("<td> - </td>");
        // END
        $(thisTileFXTRF).find('[id^="loader_FXTRF"]').hide();

        // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
        if(isRFS != true){
          $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", false);  
          $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
          $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", false);
        }
        //End

        //To fetch error from network response

        if (($(thisTileFXTRF).find('[id^="frequencyFXTRF"]')[0].value == "MAMS 1X" ||
              $(thisTileFXTRF).find('[id^="frequencyFXTRF"]')[0].value == "MAMS 2X" ||
              $(thisTileFXTRF).find('[id^="frequencyFXTRF"]')[0].value == "WAWS 1X" ||
              $(thisTileFXTRF).find('[id^="frequencyFXTRF"]')[0].value =="WAWS 2X") &&
              JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[0].errormessage != "") {

          ValidateField("hdnctlvalidation",JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[0].errorMessage.split(".")[0]);
        } //END Error

        return false;
      } else {
        var BestPP = JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[0].bestPriceProvider.split(":")[0];
        DCDRFQidFXTRF = JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[0].o_DCDRFQID;
        bestProviderFXTRF = JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[0].bestPriceProvider.split(":")[0];
        // Added by Atharva - Timers - START
        // Passing extra parameter to plotprice
        quoteidFXTRF = 
        PlotPrice(JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()),
          JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[0].bestPriceProvider.split(":")[0],
          $(thisTileFXTRF).find('[id^="FXTRFBanksRow"]'),
          $(thisTileFXTRF).find('[id^="FXTRFPrices"]'),
          thisTileFXTRF,$(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase()
        ); //Added for Solve for check | Chaitanya M | 02 Aug 2023

        // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        $(thisTileFXTRF).find('[id^="spreadAmtFX"]').val($(thisTileFXTRF).find('[id^="hdnIBPremFX"]').val());

        if($(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase() !== "PREMIUM"){
          
          $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val($(thisTileFXTRF).find('[id^="hdnClientStrikeFX"]').val()); 
          $(thisTileFXTRF).find('[id^="hdnStrikevalueFX"]').val($(thisTileFXTRF).find('[id^="hdnClientStrikeFX"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

        }
        // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023


        // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
        // ----------------------------------Start-------------------------------
        
        let AskspotFXTRF = $(thisTileFXTRF).find('[id^="rateFXTRF"]').html().split("/")[1].replace(/,/g, "").trim();
        let BidSpotFXTRF = $(thisTileFXTRF).find('[id^="rateFXTRF"]').html().split("/")[0].replace(/,/g, "").trim();
       
        if($(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val().trim().toUpperCase() === "BUY"){

          AskspotFXTRF = numberWithCommas(Number($(thisTileFXTRF).find('[id^="hdnSpotRateFX"]').val()));

          $(thisTileFXTRF).find('[id^="rateFXTRF"]').html(BidSpotFXTRF + " / " + AskspotFXTRF);


        }else{
          
          BidSpotFXTRF = numberWithCommas(Number($(thisTileFXTRF).find('[id^="hdnSpotRateFX"]').val()));

          $(thisTileFXTRF).find('[id^="rateFXTRF"]').html(BidSpotFXTRF + " / " + AskspotFXTRF);

        }

        // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
        // ----------------------------------End---------------------------------
        



        $(thisTileFXTRF).find('[id^="hdnQuoteIDFXTRF"]').val(quoteidFXTRF);
        // Added by Atharva - Timers - START
        if ( BestPP != "FAIL" && BestPP !== undefined && BestPP != "" && BestPP != null) {

          startTimers(data.CurrentTileID.split("|")[0]);

        }
      // END
      }

      $(thisTileFXTRF).find('[id^="loader_FXTRF"]').hide();
     
     // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      if(isRFS != true){
        $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", false);  
        $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", false);
      }
      //End

      if (JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()) != null ||
        JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()) !=undefined ||
        JSON.parse( $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()).bestPriceProvider.split(":")[0] != "FAIL") {
      
        drawgraphFXTRF($(thisTileFXTRF).find('[id^="canvas"]').attr("id"));
      }

      mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023

      // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      if(isRFS != true){
        $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", false);  
        $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", false);
      }
      //End
      

    } else if(data.dataFromAjax == null){

      // if(data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != null || 
      //   data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != ""){
       
      //   _failedreason = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason;
      //   ValidateField($(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr('id'), _failedreason, thisTileFXTRF); 
      
      // }else{
       
        _failedreason = "Pricing Failed!";
        ValidateField($(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr('id'), _failedreason, thisTileFXTRF); 
      
      //}
        // // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 || LGTGTWINT-2128
        // if(isRFS != true){
        //   $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", false);  
        //   $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        //   $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", false);
        // }
        // //End

    }
    //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 
    else if(data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider === null ||
      data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider == ""){
      
      if(data.dataFromAjax.oPriceResponseBody[0].errorMessage === null ||
        data.dataFromAjax.oPriceResponseBody[0].errorMessage === ''){
      //End
        // if(data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != null || 
        //   data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != ""){
         
        //   _failedreason = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason;
        //   ValidateField($(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr('id'), _failedreason, thisTileFXTRF); 
        
        // }else{
         
        //   _failedreason = "Pricing Failed!";
        //   ValidateField($(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr('id'), _failedreason, thisTileFXTRF); 
        
        // }
          _failedreason = "Pricing Failed!";
          ValidateField($(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr('id'), _failedreason, thisTileFXTRF); 

      }else{
        failReason = data.dataFromAjax.oPriceResponseBody[0].errorMessage;
        if(failReason.includes("Aborting further Migration")){

          _failedreason = failReason.replace(". Aborting further Migration for this record.","");  
          ValidateField($(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr('id'), _failedreason, thisTileFXTRF); 

        } else{

          _failedreason = failReason;
          ValidateField($(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr('id'), _failedreason, thisTileFXTRF); 

        }
      }     
      // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      if(isRFS != true){
        $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true);  
        $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);
      }
      //End     

    } 
    //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 
    else if(data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider.includes("FAIL")) {
      // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
      //if(data.dataFromAjax.oPriceResponseBody[0].errorMessage === null || 
      //  data.dataFromAjax.oPriceResponseBody[0].errorMessage === ''){
    
        $(thisTileFXTRF).find('[id^="FXTRFBanksRow"]').append("<td> - </td>");
        $(thisTileFXTRF).find('[id^="FXTRFPrices"]').append("<td> - </td>");
        // Added by Atharva - Timers - START
        $(thisTileFXTRF).find('[id^="FXTRF_TimerRow"]').append("<td> - </td>");

        // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
        ValidateField($(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("id"),"No response received from remote system.",thisTileFXTRF);
      
        //LGTGTWINT-1740 | Chaitanya M | 05 June 2023
        //$(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').show();
        $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("");
        $(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("RFQ ID : " + data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID);  
        //End

       // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
       if(isRFS != true){
        $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true);  
        $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);
      }
      //End  
        
       
      // }else{

      //   failReason = data.dataFromAjax.oPriceResponseBody[0].errorMessage; //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 

      //   if(failReason.includes("Aborting further Migration")){

      //     _failedreason = failReason.replace(". Aborting further Migration for this record.","");    
      //     ValidateField($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').attr('id'), _failedreason, thisTileFXTRF);    

      //   } else{

      //     _failedreason = failReason;
      //     ValidateField($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').attr('id'), _failedreason, thisTileFXTRF); 

      //   }
     // }   
         // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    // $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); 
    // $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    // $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);     
    
    //End
    }
    mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023   
    $(thisTileFXTRF).find('[id*="btnBestPriceFXTRF"]').attr("disabled", false);  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    
    // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 
    // Start - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
    if(isRFS){

      if(MinQuoteTimeOutOccurredTRF == true){
      
        UnsubcribeRFQID(thisTileFXTRF);
        closetimerFXTRF($(thisTileFXTRF).find('[id^="hdnRFSMinTimer"]')[0]);
        MinQuoteTimeOutOccurredTRF = false;
        mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',false);
        $(thisTileFXTRF).find('[id^="hdnsignalRMsgRecv"]').val("YES");
        $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", false);
        $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", false);
        $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
      }
      //END
    }
    // End

  } catch (error) {
    $(thisTileFXTRF).find('[id^="loader_FXTRF"]').hide();
    // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true);
    $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);
    console.log(error.message);
    $(".lblError").html(error.message());
  } finally {
  }
}

//To Get BidAsk Rate and Currency Pair
// LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
function getCurrencyFXTRFRate(currId, _toggledirectionFlag,iscloned) { //LGTCLI-396 - Instant Pricer TARF Change Direction (First Fixing & Tokyo Cut). (FXD)
  try { 
    thisTileFXTRF = document.getElementById("td" + currId);
    // Addded for CFINT-992 // 18-Sep-2020
    //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 16 Feb 2023
    checkmetalccyflagFXTRF(currId,$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val());

    $(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("disabled", true);
    $(thisTileFXTRF).find('[id^="btnBookTradeFXTRF"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true);

    //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
    $(thisTileFXTRF).find('[id^="hdnCcyDetailsFXTRF"]').val($(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val());
    //End

    if ($(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
      ProductCodeTRFbidask = productCodeTRFBuy;
    } else {
      ProductCodeTRFbidask = productCodeTRFSell;
    }

    //END
    request_getDataFromAPI(
      {
        // Start - HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023
        "StandardPair":  $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]')[0] .value,
        "EntityID": EntityID,
        "UserID": userName,
        "ProductCode": ProductCodeTRFbidask, 
        "Mode" : "SEN",
        "CurrentTileID":currId + "|" + "",
        // End - HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023

      },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/BidAskRate","","POST",currId +"|" + userName + '_' + 'GetFXRatesByCurrencyNode'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
       
        thisTileFXTRF = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let currId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        //let responseHeader = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.Status;

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

        if(responseHeader.toUpperCase() == "SUCCESS"){
          $(thisTileFXTRF).find('[id^="hdnDecimalRateFXTRF"]').val(data.dataFromAjax.PointShift); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
          AskRateFXO = numberWithCommas(Number(data.dataFromAjax.AskRate).toFixed(data.dataFromAjax.PointShift)); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
          BidRateFXO = numberWithCommas(Number(data.dataFromAjax.BidRate).toFixed(data.dataFromAjax.PointShift)); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023

          $(thisTileFXTRF).find('[id^="rateFXTRF"]')[0].innerText =BidRateFXO + " / " + AskRateFXO;
          //$(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value =AskRateFXO; //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
          // Addded for CFINT-992 // 18-Sep-2020

          $(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("disabled", false);

          //Added By RizwanS for Option cut // JIRA ID- SCBUPINT-1102 // 15 Jul 2022
 
          
            if ($(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {      //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023        

              //Added by RizwanS || LGTGTWINT-2322 || 22 Aug 2023
              if(MaxQuoteTimeOutTEKO === "" || MinQuoteTimeOutTEKO === ""){
                getProductConfigsFXD(productIDTRFBuy, productCodeTRFBuy);
              }
              if(LPListTRFBuy === ""){
                LPListTRFBuy =  getasyncFXDLP(productIDTRFBuy, productCodeTRFBuy); 
              }
              //END

              if(iscloned !== true){ // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023

                //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
                if(_addtileflag == true ){

                  $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value =AskRateFXO;
                  _addtileflag= false;

                }else if(_defaultflagFXTRF== true){

                  $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value =AskRateFXO;
                  _defaultflagFXTRF = false;

                }else if(!_UpdateFlagFXTRF){//LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
                  
                  // Start - LGTCLI-422 | Chaitanya M | 5 May 2023
                  if( $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val()==""){
                    $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value =AskRateFXO;
                  }
                  //LGTCLI-426 Chaitanya M | 08 May 2023
                  if(_eventccychangeFXTRF == true){
                
                    $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value =AskRateFXO;
                    _eventccychangeFXTRF = false;
                  
                  }
                  //End

                  _UpdateFlagFXTRF = false;
                
                } else if(_eventstrikechangeFXTRF == true){
                  _eventstrikechangeFXTRF = false;
                  //End

                //LGTCLI-426 Chaitanya M | 08 May 2023
                }else if(_eventccychangeFXTRF == true){
                
                  $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value =AskRateFXO;
                  _eventccychangeFXTRF = false;                
                //End
                }else{      
                  
                  if( $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val()==""){
                    $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value =AskRateFXO;
                  }
                  //end
                  _UpdateFlagFXTRF = false;//LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023

                }

              }

              if ($(thisTileFXTRF).find('[id^="frequencyFXTRF"]').val().includes("N")) {

                ProductCode_FXTRF = productCodeTRFBuy;
                ProductIDFXTRF = productIDTRFBuy;
              }
              else {

                ProductCode_FXTRF = productCodeTRFBuyEKI;
                ProductIDFXTRF = productIDTRFBuyEKI;

              }
              //End

            } else {

               //Added by RizwanS || LGTGTWINT-2322 || 22 Aug 2023
              if(MaxQuoteTimeOutTARFSELL === "" || MinQuoteTimeOutTARFSELL === ""){
                getProductConfigsFXD(productIDTRFSell,productCodeTRFSell);
              }
              if(LPListTRFSell === ""){
                LPListTRFSell =  getasyncFXDLP(productIDTRFSell, productCodeTRFSell);
              }
              //END


              if(iscloned !== true){ // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023

                //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
                //START
                if(_addtileflag == true ){

                  $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value =BidRateFXO;
                  _addtileflag= false;

                }else if(_defaultflagFXTRF == true){

                  $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value = BidRateFXO;
                  _defaultflagFXTRF = false; //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023

                }else if(!_UpdateFlagFXTRF){//LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
              
                  // Start - LGTCLI-422 | Chaitanya M | 5 May 2023
                  if( $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val()==""){ 
                    $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value = BidRateFXO; 
                  }
                  //LGTCLI-426 Chaitanya M | 08 May 2023
                  if(_eventccychangeFXTRF == true){
                
                    $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value =AskRateFXO;
                    _eventccychangeFXTRF = false;
                  
                  }
                  //End
                  _UpdateFlagFXTRF = false;
                
                }else if(_eventstrikechangeFXTRF == true){
                
                  _eventstrikechangeFXTRF = false;

                  //End
                  //LGTCLI-426 Chaitanya M | 08 May 2023
                }else if(_eventccychangeFXTRF == true){
                
                  $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value =AskRateFXO;
                  _eventccychangeFXTRF = false;
                  //End
                
                }else{
                
                  if( $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val()==""){ //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023
                    $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]')[0].value = BidRateFXO; //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023
                  }

                  //End
                  _UpdateFlagFXTRF = false;//LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023

                }

              }

              if ($(thisTileFXTRF).find('[id^="frequencyFXTRF"]').val().includes("N")) {

                ProductCode_FXTRF = productCodeTRFSell;
                ProductIDFXTRF = productIDTRFSell;
              }
              else {

                ProductCode_FXTRF = productCodeTRFSellEKI;
                ProductIDFXTRF = productIDTRFSellEKI;

              }
            }
          
          // OptionCutListFXTRF = setasyncOptioncutFXD(currId, $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val(), ProductIDFXTRF, ProductCode_FXTRF);

          // fillDropdownlistControl(OptionCutListFXTRF, $(thisTileFXTRF).find('[id^="Optioncutddl"]').attr('id'));

          //END

          GetMaxClientProfitCCyFXTRF(currId);  // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

          if(_toggledirectionFlag == true){ //LGTCLI-396 - Instant Pricer TARF Change Direction (First Fixing & Tokyo Cut) || RizwanS || 11 Apr 2023

            return false;

          }else{
            // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
            if(iscloned !== true){
              OptionCutListFXTRF = setasyncOptioncutFXD(currId, $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val(), ProductIDFXTRF, ProductCode_FXTRF,"FXOSEN"); //LGTCLI-396 - Instant Pricer TARF Change Direction (First Fixing & Tokyo Cut) || RizwanS || 11 Apr 2023
              fillDropdownlistControl(OptionCutListFXTRF, $(thisTileFXTRF).find('[id^="Optioncutddl"]').attr('id')); //LGTCLI-396 - Instant Pricer TARF Change Direction (First Fixing & Tokyo Cut) || RizwanS || 11 Apr 2023
            // } // Commented for LGTCLI-447 | Chaitanya M | 04 Aug 2023
            //End
            
            fillDatesFXTRF( $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val(),
            $(thisTileFXTRF).find('[id^="frequencyFXTRF"]').val(),
            $(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').val(),
            currId
            ); 


          } //LGTCLI-396 - Instant Pricer TARF Change Direction (First Fixing & Tokyo Cut) || RizwanS || 11 Apr 2023
         
            //End
          } //Added for LGTCLI-447 | Chaitanya M | 04 Aug 2023
            
        } else {

          let failReason = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.FailedReason;

          ValidateField($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').attr('id'), failReason, thisTileFXTRF);

        }
      }).catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message());
  }
}

// Added to set NDFMetalFlag // 05-Feb-2021

function setNDFMetalFlagTRF(currId,CcyPair,DepoCcy,AltCcy,getFrqFix,getSetlfrq,getPremiumDate,getFinalFixingDate,getSettlementDate) {
  try {
    let thisTileFXTRF = document.getElementById("td" + currId);
    if ($(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
      ProductCode_FXTRF = productCodeTRFBuy;
      ProductIDFXTRF = productIDTRFBuy;
      _TempIDFXTRF = TemplateIDTRFBuy;
    } else {
      ProductCode_FXTRF = productCodeTRFSell;
      ProductIDFXTRF = productIDTRFSell;
      _TempIDFXTRF = TemplateIDTRFSell;
    }        

    // Changed for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
    let _TRFCcylist = sessionStorage.getItem("CCYListFXTRFBuy");
    let _FXTRFCcy = JSON.parse(_TRFCcylist);    

    let fxDayBasis =_FXTRFCcy[_FXTRFCcy.findIndex((res) => res.asset_Pair == CcyPair)].asset2_Year_Basis;

      //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022

    $(thisTileFXTRF).find('[id^="hdnCcyPairDataTRF"]').val(
      JSON.stringify(_FXTRFCcy[_FXTRFCcy.findIndex((res) => res.asset_Pair == CcyPair)]));

    let notionalddlId = '[id^="CcySelectionFXTRF"]';
    let hdnpairDataId = '[id^="hdnCcyPairDataTRF"]';
    let notioanlamtId = '[id^="ContractAmtFXTRF"]';

    checkDecimalPlaces(thisTileFXTRF,notionalddlId,hdnpairDataId,notioanlamtId);

    //END

    getNumberOfFixingTRF(currId,ProductIDFXTRF,CcyPair,DepoCcy,AltCcy,getFrqFix,getSetlfrq,getPremiumDate,getFinalFixingDate,getSettlementDate,fxDayBasis,_TempIDFXTRF);
    
  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message());
  }
}

function getNumberOfFixingTRF(currId,ProductIDFXTRF, CcyPair,DepoCcy,AltCcy,setFrqFix, SetSetlfrq,getPremiumDate,getFinalFixingDate,getSettlementDate,getfxDayBasis,_TempIDFXTRF) {
  try {
    request_getDataFromAPI(
      {        
        "EntityID" : EntityID,     
        "ProductID" : ProductIDFXTRF,	
        "CcyPair" : CcyPair,	
        "DayBasis": getfxDayBasis,	
        "DepoCcy" : DepoCcy,	
        "AltCcy" : AltCcy,			
        "FixingFreq" : setFrqFix,	
        "SettlementFreq" : SetSetlfrq,	
        "TradeDate" : setBusinessDate,
        "FirstFixingDate": "",	
        "PremiumDate" : getPremiumDate,	
        "FinalFixingDate" : getFinalFixingDate,	
        "SettlementDate" : getSettlementDate,	
        "OptionCut": $(thisTileFXTRF).find('[id^="Optioncutddl"]').val(),
        "TemplateID": _TempIDFXTRF,
        "RequestID": currId +"|" + userName + '_' + 'GetNumberofFixings'  +'_'+ RequestIDGenerator(10) + RequestIDGenerator(4), //modified by Chaitanya M, LGTGTWINT-1850 | 13-april-23
        "LocalCcy": DepoCcy,
        "GlobalCcy" :AltCcy,
        "GuaranteedPeriods" : "",
        "NotionalPerFixing": $(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').val(),
        "CurrentTileID": currId + "|" + userName + '_' + 'GetNumberofFixings'  +'_'+ RequestIDGenerator(10) + RequestIDGenerator(4),

      },
      clientConfigdata.CommonMethods.NodeServer + "DateCalculationApi/GetNumberofFixings","","POST",currId +"|" + userName + '_' + 'GetNumberofFixings'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        
        let thisTileFXTRF = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileID = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        // let responseHeader = data.GetNumberofFixingsResult.A_ResponseHeader.Status;
        
        let responseHeader = "";

        if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
          responseHeader = "FAIL";
        }else{
          if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
            responseHeader = "FAIL";
          }else{
            responseHeader = "SUCCESS";
          }
        }
       
        if(responseHeader.toUpperCase() == "SUCCESS"){

          $(thisTileFXTRF).find('[id^="hdnFXTRFNoOfFixingDate"]').val(data.dataFromAjax.firstFixingDate);

          $(thisTileFXTRF).find('[id^="hdnFXTRFNoOfFixings"]').val(data.dataFromAjax.noofFixings);

          $(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("disabled", false);

          let strFirstFix = new Date(data.dataFromAjax.firstFixingDate);
          let firstFix = strFirstFix.getFullYear() +"-" +
            ("0" + (strFirstFix.getMonth() + 1)).substr(-2, 2) + "-" +
            ("0" + strFirstFix.getDate()).substr(-2, 2);
  
          $(thisTileFXTRF).find('[id^="FirstFixDate"]').val(firstFix);
          $(thisTileFXTRF).find('[id^="lblFirstFixDate"]').html(data.dataFromAjax.firstFixingDate);

        } else {

          let failReason = "No response received from remote system."; 

          ValidateField($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').attr('id'), failReason, thisTileFXTRF);

          // Need to uncomment after no.of fixing issue resolved.

        }
      }).catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message());
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

function viewScheduleFXTRF(that) {
  try {
    getBestPriceFXTRF(that, true);
  } catch (error) {
    console.log(error.message);
  }
}

//END

//Save Trade Start || 23 Dec 2022 || RijwanS || JIRA ID - LGTGTWINT-607 ||
function SaveTradeFXTRF(that){
  try{  

    booktradeFXTRF(that, true);

  }catch(er){

    console.log(er.message);

  }
}//END

//Book Trade
function booktradeFXTRF(that,RTDflag) {
  try {

    if (RTDflag) {

      TileId = that.id.match(/\d+$/)[0];
      thisTileFXTRF = document.getElementById("td" + TileId);
      $(thisTileFXTRF).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayFXTRF"); // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer

    }else{
       // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
      TileId = that.id.match(/\d+$/)[0];
      thisTileFXTRF = document.getElementById("td" + TileId);
      $(thisTileFXTRF).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayFXTRF");
      //End     

    }
  }catch(error){
    console.log(error.message);
  }
}//END

//Save to Dealer RFQ  || 23 Dec 2022 || RijwanS || JIRA ID - LGTGTWINT-607 ||
function SaveDealerRFQTRF(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXTRF = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
    console.log("BookingFor ::", TileId, thisTileFXTRF, productName);
    $(thisTileFXTRF).find('[id*="btnSaveTrade"]').attr("disabled", true); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    if ($(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
      ProductCode_FXTRF = productCodeTRFBuy;
    } else {
      ProductCode_FXTRF = productCodeTRFSell;
    }

    // Added by Atharva - Timers - START
    if ("td" + TileId in myInterval) {
      clearInterval(myInterval["td" + TileId]);
      delete myInterval["td" + TileId];
    }
    // END

    if ($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val() == "" || $(thisTileFXTRF).find('[id^="FXTRFPrices"]')[0].firstChild.innerHTML =="-" || $(thisTileFXTRF).find('[id^="FXTRFPrices"]')[0].firstChild.innerHTML == "") {
      booktradePopup(that,"booktradeFXTRF" + TileId,"Order Execution Failed!", "DivOverlayFXTRF","E");
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
      priceIndex = parseInt(
        $(thisTileFXTRF).find('[id^="hdnPriceIndexFXTRF"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
    );
    var dcdrfqid_val = "";
    for (let i = 0; i < jsonHdnPrices.length; i++) {
      // Finding the only json entry which contains the DCDRFQID, which got scattered while sorting the hdnPrices.
      //LGTGTWINT-1934 || ChaitanyaM || 01 June 2023
      //Start
      if (jsonHdnPrices[i].o_DCDRFQID == "" || jsonHdnPrices[i].o_DCDRFQID == null || jsonHdnPrices[i].o_DCDRFQID == undefined) { 
      }else{
        dcdrfqid_val = jsonHdnPrices[i].o_DCDRFQID;
        break;
      }
      //End
    }
    // dcdrfqid_val must not be null or empty
    console.assert(dcdrfqid_val != "");
    // below also changed index from 0 to priceIndex variable.
    // END

    mapleLoaderStart(thisTileFXTRF,'[id^="btnBookTradeFXTRF"]',true);

    request_getDataFromAPI(
      {
        "EntityId": EntityID,
        "LoginId": userName,
        "DCD_RFQId": dcdrfqid_val,
        "External_RFQId": JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[0].quoteId.toString(),
        "PriceProviderName": JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[0].provider,
        "ProductCode": ProductCode_FXTRF,
        "Cust_Prem_Amt": Number($(thisTileFXTRF).find('[id^="hdnIBPremFX"]').val()),            
        "order_Response_TimeOut": "", // HSBCFXEINT-29 | Chaitanya M | 11 Dec 2023
        "twoStepOrderExecutionYN":'N',      
        "OrderRetryFlag": true,
        "CurrentTileID": TileId + "|" + "",
        "Remark": $(thisTileFXTRF).find('[id^="inputRemark"]').val(),
      },
      clientConfigdata.CommonMethods.NodeServer + "fxobestprice/FXOBookTradeAndGetExternalTradeNumberJSON", "", "POST", TileId +"|" + userName + '_' + 'BookOrderFXProducts'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        
        let thisTileFXTRF = document.getElementById("td" +data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
       
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

        if(responseHeader.toUpperCase() == "SUCCESS"){
        if (data.dataFromAjax.DealNo == "" || data.dataFromAjax.DealNo == null) {

          //LGTCLI-411 | FXD Rejected Trades Notifications | Chaitanya M | 17 April 2023
          //Start
          if(data.dataFromAjax.isOrderRejected == true) { 

            var orderplaced = "Order rejected due to some technical reasons." ;
            ValidateField($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').attr('id'), orderplaced, thisTileFXTRF);
            mapleLoaderStop(thisTileFXTRF,'[id^="btnBookTradeFXTRF"]',true);
            return false;
    
          }else if(data.dataFromAjax.isOrderRejected == false || data.dataFromAjax.External_TradeID == "" || data.dataFromAjax.External_TradeID == null ){
            
            var orderplaced =  "Order may have got executed or may have failed. Contact support." ;
            ValidateField($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').attr('id'), orderplaced, thisTileFXTRF);
            mapleLoaderStop(thisTileFXTRF,'[id^="btnBookTradeFXTRF"]',true);
            return false;
         
          }else{
            
            var orderplaced = data.dataFromAjax.Message;
            ValidateField($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').attr('id'), orderplaced, thisTileFXTRF);
            mapleLoaderStop(thisTileFXTRF,'[id^="btnBookTradeFXTRF"]',true);
            return false;
          
          }    
          //End      

        } else {
          // var orderno = data.dataFromAjax.Message.split(":")[1];
          // Added by Atharva - Timers - START
          // Changed the provider name in message from bestpriceprovider to whichever the user has selected.
          // var orderplaced ="Deal No." +
          //   data.dataFromAjax.DealNo +"<br>" +"Order Placed Successfully with Counterparty " +
          //   JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[priceIndex].provider + " and  Order ID " + //JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[0].bestPriceProvider.split(":")[0]
          //   orderno;

          //HSBCFXEINT-30 || RizwanS || 12 Dec 2023

          let _msg1 = data.dataFromAjax.Message;
          var orderplaced =
          _msg1 + "<br>" +  //row-1
          "Deal No." + " " + data.dataFromAjax.DealNo + "<br>" + //row-2
          "External Trade ID:" + " " + data.dataFromAjax.External_TradeID; //row-3

         //END

        }
   
        // $(thisTileFXTRF).find('[id^="OrderBlotter"]').css({ display: "inline" });

        booktradePopup(that,"booktradeFXTRF" + TileId,orderplaced,"DivOverlayFXTRF");
        
        $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val("");
        // Added by Atharva - START
        $(thisTileFXTRF).find(".pricesRow").children().each(function () {
            $(this).find("button").attr("disabled", true);
        });

        $(thisTileFXTRF).find(".banksNameRow").children().each(function () {
          $(this).find("button").attr("disabled", true);
        });

        $(thisTileFXTRF).find('[id*="BookTrade"]').attr("disabled", true);
        $(thisTileFXTRF).find('[id*="BookReq"]').attr("disabled", true);
        blockPriceButtons(TileId);
        // END
      } else {

        let failReason =  "Order Execution Failed!";

        ValidateField($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').attr('id'), failReason, thisTileFXTRF);

      }

      mapleLoaderStop(thisTileFXTRF,'[id^="btnBookTradeFXTRF"]',true);

      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      // Commented on 21 March as per discussion with Rahul P
      // $(thisTileFXTRF).find('[id^="FXDRfqidpnl"]').hide();
      //$(thisTileFXTRF).find('[id^="RFQIDFXD"]').html("");
      //End

    })
    .catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error.message);
    booktradePopup(that,"booktradeFXTRF" + TileId,"Order Execution Failed!","DivOverlayFXTRF","E");
    mapleLoaderStop(thisTileFXTRF,'[id^="btnBookTradeFXTRF"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}//END

// Save Route To Dealer RFQ || RijwanS || LGTGTWINT-607 || 26 Dec 2022
function SaveRouteToDealerRFQTRF(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXTRF = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    console.log("BookingFor ::", TileId, thisTileFXTRF, productName);
    $(thisTileFXTRF).find('[id*="btnSaveTrade"]').attr("disabled", true); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    if (
      $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy"
    ) {
      ProductCode_FXTRF = productCodeTRFBuy;
    } else {
      ProductCode_FXTRF = productCodeTRFSell;
    }
    if ("td" + TileId in myInterval) {
      clearInterval(myInterval["td" + TileId]);
      delete myInterval["td" + TileId];
    }
    if (
      $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val() == "" ||
      $(thisTileFXTRF).find('[id^="FXTRFPrices"]')[0].firstChild.innerHTML ==
        "-" ||
      $(thisTileFXTRF).find('[id^="FXTRFPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(that,"booktradeFXTRF" + TileId,"Order Execution Failed!","DivOverlayFXTRF","E");
      return false;
    }
    var isNonBestPrice = false;
    if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
      isNonBestPrice = true;
    } else {
      isNonBestPrice = false;
    }
    var priceIndex = -1;
    if (isNonBestPrice) {
      priceIndex = parseInt(
        $(thisTileFXTRF).find('[id^="hdnPriceIndexFXTRF"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
    );
    var dcdrfqid_val = "";
    for (let i = 0; i < jsonHdnPrices.length; i++) {
      //LGTGTWINT-1934 || ChaitanyaM || 01 June 2023
      //Start
      if (jsonHdnPrices[i].o_DCDRFQID == "" || jsonHdnPrices[i].o_DCDRFQID == null || jsonHdnPrices[i].o_DCDRFQID == undefined) { 
      }else{
        dcdrfqid_val = jsonHdnPrices[i].o_DCDRFQID;
        break;
      }
      //End
    }
    console.assert(dcdrfqid_val != "");

    mapleLoaderStart(thisTileFXTRF,'[id^="btnSaveTradeFX"]',true);

   request_getDataFromAPI(
      {
    
        "EntityID":EntityID,
        "DCDRFQID":dcdrfqid_val,
        "ProductCode":ProductCode_FXTRF,
        "LoginId":userName,
        "LoginID": userName,
        "NoteMasterId":JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[priceIndex].NoteMasterID,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "RMRemark":$(thisTileFXTRF).find('[id^="inputRemark"]').val(),
        "CurrentTileID": TileId + "|" + userName + '_' + 'SaveRouteToDealerRFQ'  +'_' + RequestIDGenerator(5) ,
        
      },
      clientConfigdata.CommonMethods.NodeServer + "SaveRouteToDealerRFQ","","POST",TileId +"|" + userName + '_' + 'SaveRouteToDealerRFQ'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        
        let thisTileFXTRF = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        if(data.SaveRouteToDealerResult.RouteToDealer == true){
          var orderplaced = "RFQ " +
          " " + dcdrfqid_val + " " + "routed to dealing desk successfully."
          booktradePopup(that,"booktradeFXTRF" + TileId,orderplaced,"DivOverlayFXTRF","S");

        }else{

          var orderplaced = "Order placement Failed."
          booktradePopup(that,"booktradeFXTRF" + TileId,orderplaced,"DivOverlayFXTRF","E");

        }
        
        $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val("");
        // Added by Atharva - START
        
        $(thisTileFXTRF).find(".pricesRow").children().each(function () {
          $(this).find("button").attr("disabled", true);
        });

        $(thisTileFXTRF).find(".banksNameRow").children().each(function () {
          $(this).find("button").attr("disabled", true);
        });

        $(thisTileFXTRF).find('[id*="BookTrade"]').attr("disabled", true);
        $(thisTileFXTRF).find('[id*="BookReq"]').attr("disabled", true);
        $(thisTileFXTRF).find('[id*="btnemailquote"]').attr("disabled", true); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
        blockPriceButtons(TileId);
        // END

        mapleLoaderStop(thisTileFXTRF,'[id^="btnSaveTradeFX"]',true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(
      that,
      "booktradeFXTRF" + TileId,
      "Order Execution Failed!",
      "DivOverlayFXTRF","E"
    );
    mapleLoaderStop(thisTileFXTRF,'[id^="btnSaveTradeFX"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

// Email Quote || RijwanS || LGTGTWINT-517  || 27 Dec 2022
function SendQuoteEmailTRF(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXTRF = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    console.log("email quote to ::", TileId, thisTileFXTRF, productName);
    if (
      $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy"
    ) {
      ProductCode_FXTRF = productCodeTRFBuy;
      ProductID_FXTRF = productIDTRFBuy;

    } else {
     
      ProductCode_FXTRF = productCodeTRFSell;
      ProductID_FXTRF = productIDTRFSell;
    }
   
    if (
      $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val() == "" ||
      $(thisTileFXTRF).find('[id^="FXTRFPrices"]')[0].firstChild.innerHTML ==
        "-" ||
      $(thisTileFXTRF).find('[id^="FXTRFPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        thisTileFXTRF,
        "booktradeFXTRF" + TileId,
        "Email Quote Failed!",
        "DivOverlayFXTRF","E"
      );
      return false;
    }
    var isNonBestPrice = false;
    if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
      isNonBestPrice = true;
    } else {
      isNonBestPrice = false;
    }
    var priceIndex = -1;
    if (isNonBestPrice) {
      priceIndex = parseInt(
        $(thisTileFXTRF).find('[id^="hdnPriceIndexFXTRF"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
    );
    var dcdrfqid_val = "";
    for (let i = 0; i < jsonHdnPrices.length; i++) {
      //LGTGTWINT-1934 || ChaitanyaM || 01 June 2023
      //Start
      if (jsonHdnPrices[i].o_DCDRFQID == "" || jsonHdnPrices[i].o_DCDRFQID == null || jsonHdnPrices[i].o_DCDRFQID == undefined) { 
      }else{
        dcdrfqid_val = jsonHdnPrices[i].o_DCDRFQID;
        break;
      }
      //End
    }
    console.assert(dcdrfqid_val != "");

    mapleLoaderStart(thisTileFXTRF,'[id^="btnemailquote"]',true);

   request_getDataFromAPI(
      {
  
        "RequestID": userName + '_' + 'SendQuoteEmailFXDTRF'  +'_' + RequestIDGenerator(7),
        "EntityID": EntityID,
        "ProductID": ProductID_FXTRF,
        "LoginId": userName,
        "NoteMasterId": JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[priceIndex].NoteMasterID,
        "RFQID": dcdrfqid_val,
        // "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "CurrentTileID": TileId + "|" + "",
        
      },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/SendQuoteEmail", "", "POST", TileId +"|" + userName + '_' + 'SendQuoteEmailFXDTRF'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        
        let thisTileFXTRF = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
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
            
        booktradePopup(thisTileFXTRF,"booktradeFXTRF" + TileId,orderplaced,"DivOverlayFXTRF","S");

          } else {

            var orderplaced = "Email Quote Failed."     
            
        booktradePopup(thisTileFXTRF,"booktradeFXTRF" + TileId,orderplaced,"DivOverlayFXTRF","E");     

          }

        }else{

          var orderplaced = "Email Quote Failed."
          
        booktradePopup(thisTileFXTRF,"booktradeFXTRF" + TileId,orderplaced,"DivOverlayFXTRF","E");

        }
       
        mapleLoaderStop(thisTileFXTRF,'[id^="btnemailquote"]',true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(thisTileFXTRF,"booktradeFXTRF" + TileId,"Email Quote Failed!","DivOverlayFXTRF","E");
    mapleLoaderStop(thisTileFXTRF,'[id^="btnemailquote"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

// Save Trade Idea || RijwanS || LGTGTWINT-608  || 28 Dec 2022
function SaveTradeIdeaFXTRF(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXTRF = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    console.log("Save Trade Idea for ::", TileId, thisTileFXTRF, productName);

    if(isFXDDealer){
      _modeFXTRF = "SEN";
    }else{
      _modeFXTRF = "QEN"
    }

    isSaveTradeIdeaFXTRF = false;

    $(thisTileFXTRF).find('[id^="btnSaveTradeFX"]').attr("disabled", true);  // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    if (
      $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy"
    ) {
      ProductCode_FXTRF = productCodeTRFBuy;
      ProductID_FXTRF = productIDTRFBuy;

    } else {
      ProductCode_FXTRF = productCodeTRFSell;
      ProductID_FXTRF = productIDTRFSell;
    }
   
    if (
      $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val() == "" ||
      $(thisTileFXTRF).find('[id^="FXTRFPrices"]')[0].firstChild.innerHTML ==
        "-" ||
      $(thisTileFXTRF).find('[id^="FXTRFPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        thisTileFXTRF,
        "booktradeFXTRF" + TileId,
        "Save trade idea Failed!",
        "DivOverlayFXTRF","E"
      );
      return false;
    }
    var isNonBestPrice = false;
    if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
      isNonBestPrice = true;
    } else {
      isNonBestPrice = false;
    }
    var priceIndex = -1;
    if (isNonBestPrice) {
      priceIndex = parseInt(
        $(thisTileFXTRF).find('[id^="hdnPriceIndexFXTRF"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val()
    );
    var dcdrfqid_val = "";
    for (let i = 0; i < jsonHdnPrices.length; i++) {
      //LGTGTWINT-1934 || ChaitanyaM || 01 June 2023
      //Start
      if (jsonHdnPrices[i].o_DCDRFQID == "" || jsonHdnPrices[i].o_DCDRFQID == null || jsonHdnPrices[i].o_DCDRFQID == undefined) { 
      }else{
        dcdrfqid_val = jsonHdnPrices[i].o_DCDRFQID;
        break;
      }
      //End
    }
    console.assert(dcdrfqid_val != "");

    mapleLoaderStart(thisTileFXTRF,'[id^="btnSaveTradeIdea"]',true);

   request_getDataFromAPI(
      {
  
        "EntityID": EntityID,
        "LoginID": userName,
        "ProductCode": ProductCode_FXTRF,
        "NoteMasterID":JSON.parse($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val())[priceIndex].NoteMasterID,
        "RFQID": dcdrfqid_val,
        "Remark":$(thisTileFXTRF).find('[id^="inputRemark"]').val(), // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
        "Mode": _modeFXTRF,  // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "CurrentTileID": TileId + "|" + "",
        
      },
      clientConfigdata.CommonMethods.NodeServer + "SaveTradeIdeaFXD","","POST",TileId +"|" + userName + '_' + 'SaveTradeIdeaFXD'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        let thisTileFXTRF = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
       
        if (data.SaveTradeRecommendationResult.TradeIdeaSavedYN == true) {
          
          var orderplaced = "RFQ " + " " + dcdrfqid_val + " " + "marked as trade idea successfully."
          booktradePopup(thisTileFXTRF,"booktradeFXTRF" + TileId,orderplaced,"DivOverlayFXTRF","S");

        } else {

          var orderplaced = "Save trade idea Failed."
          booktradePopup(thisTileFXTRF,"booktradeFXTRF" + TileId,orderplaced,"DivOverlayFXTRF","E");

        }
       
        mapleLoaderStop(thisTileFXTRF,'[id^="btnSaveTradeIdea"]',true);

      })
      .catch((error) => {
        console.log(error);
      });

  } catch (error) {
    console.log(error.message);
    booktradePopup(
      thisTileFXTRF,
      "booktradeFXTRF" + TileId,
      "Save trade idea Failed!",
      "DivOverlayFXTRF","E"
    );
    mapleLoaderStop(thisTileFXTRF,'[id^="btnSaveTradeIdea"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

// Added for calculating Max Leverage Notional || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
function getMaxLevNotionalFXTRF(notionalamt, frequencynameTRF,settlementval, currId){
  try {

    thisTileFXTRF = document.getElementById("td" + currId);

    let leverageval = "";
    let maxlevnotional;   

    if (
      frequencynameTRF.includes("1Y") ||
      frequencynameTRF.includes("1N")
    ) {
      leverageval = 1;

    } else if (
      frequencynameTRF.includes("2Y") ||
      frequencynameTRF.includes("2N")
    ) {
      leverageval = 2;
    }
    notionalamt = parseFloat($(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').val().replace(/,/g, ""));
    maxlevnotional = notionalamt * leverageval * settlementval;
    
    $(thisTileFXTRF).find('[id^="MaxLevTRF"]').val(maxlevnotional.toLocaleString("en-US"));    

  } catch (error) {
    console.log(error.message);
  }
}

function confirmRtoDTRF(that) { // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer
  try {


    TileId = that.id.match(/\d+$/)[0];
    thisTileFXTRF = document.getElementById("td" + TileId);

    $(thisTileFXTRF).find('[id^="validatiionMsg"]').html("");

    // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
    if(isSaveTradeIdeaFXTRF){

      SaveTradeIdeaFXTRF(that);
      closeremarkpopup(that);      

    }else{

      if (!isFXDDealer) { // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023, 
        //LGTGTWINT-1954 || RizwanS || 03 May 2023 

        if($(thisTileFXTRF).find('[id^="inputRemark"]').val() == "" || $(thisTileFXTRF).find('[id^="inputRemark"]').val() == undefined || $(thisTileFXTRF).find('[id^="inputRemark"]').val() == null){

          $(thisTileFXTRF).find('[id^="validatiionMsg"]').html("Please enter remark.");
          return false;
    
        } else{
    
          $(thisTileFXTRF).find('[id^="validatiionMsg"]').html("");
          SaveRouteToDealerRFQTRF(that);
          closeremarkpopup(that);

        }

      } else{

        SaveDealerRFQTRF(that);
        closeremarkpopup(that);
      }      

    }

  }catch(er){

    console.log(er.message);

  }

} //END
//Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 16 Feb 2023

function checkmetalccyflagFXTRF(currId,CcyPair){
  try {

    let thisTileFXTRF = document.getElementById("td" + currId);

   // Changed for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
    let _FXTRFCcylist = sessionStorage.getItem("CCYListFXTRFBuy");
    let _CcyFXTRF = JSON.parse(_FXTRFCcylist);        
 
      if (
        _CcyFXTRF[_CcyFXTRF.findIndex((res) => res.asset_Pair === CcyPair)].lcY_Type.toUpperCase() == "NDF" ||
        _CcyFXTRF[_CcyFXTRF.findIndex((res) => res.asset_Pair === CcyPair)].rcY_Type.toUpperCase() == "NDF"
      ) {
        NDFFlagTRF = "Y";
        IsMetalTRF = "N";
        $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').attr("disabled", false); // Added to check LCY_Type & RCY_Type // 10 Feb 2022
        isccymetalflagFXTRF = false;  //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
        $(thisTileFXTRF).find('[id^="FXDCCYiconFXTRF"]').removeClass("ccytoggle");//Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 20 Feb 2023
      } else if (
        _CcyFXTRF[_CcyFXTRF.findIndex((res) => res.asset_Pair === CcyPair)].lcY_Type.toUpperCase() == "METAL" ||  //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
        _CcyFXTRF[_CcyFXTRF.findIndex((res) => res.asset_Pair === CcyPair)].rcY_Type.toUpperCase() == "METAL"
      ) {
        NDFFlagTRF = "N";
        IsMetalTRF = "Y";
        $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').attr("disabled", true); // Added to check LCY_Type & RCY_Type // 10 Feb 2022
        isccymetalflagFXTRF = true;  //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
        $(thisTileFXTRF).find('[id^="FXDCCYiconFXTRF"]').addClass("ccytoggle");//Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 20 Feb 2023
      } else {
        NDFFlagTRF = "N";
        IsMetalTRF = "N";
        $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').attr("disabled", false); // Added to check LCY_Type & RCY_Type // 10 Feb 2022
        isccymetalflagFXTRF = false;  //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
        $(thisTileFXTRF).find('[id^="FXDCCYiconFXTRF"]').removeClass("ccytoggle");//Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 20 Feb 2023
      } 
      $(thisTileFXTRF).find('[id^="hdnisMetalFX"]').val(IsMetalTRF); // LGTCLI-437 | Chaitanya M | 11 July 2023
      $(thisTileFXTRF).find('[id^="hdnNDFFlagFX"]').val(NDFFlagTRF);  // HSBCFXEINT-25 - NDF flag are going blank || Chaitanya M  || 24-Jan 2024 

  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message());
  }
}

//ENd

// Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
function AddremarkFXTRF(that) {  
  try { 
     
      isSaveTradeIdeaFXTRF = true;
      TileId = that.id.match(/\d+$/)[0];
      thisTileFXTRF = document.getElementById("td" + TileId);
      $(thisTileFXTRF).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayFXTRF");  
     

  }catch(er){

    console.log(er.message);

  }

} //END

// LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023 - 
//START
function GetMaxClientProfitCCyFXTRF(TileId,_maxclntccyFXTRF,maxClntPrftCcy1FXTRF,MaxClientvalueFXTRF){
  try {

    thisTileFXTRF = document.getElementById("td" + TileId);
   
    if( $(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val() == "" ||  $(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val() == null ||  $(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val() == "0"){
      $(thisTileFXTRF).find('[id^="MaxProfitCcy"]').val("");  // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023
      return false;
    }

    if ( $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
      spotRateTRF = $(thisTileFXTRF).find('[id^="rateFXTRF"]').html().split("/")[1].replace(/,/g, "").trim();
      
      // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      if ($(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {
        LPListTRF = LPListTRFBuy.split("|")[1];
      }else{
        LPListTRF = LPListTRFBuy.split("|")[0];
      }
      // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      
      callputType = "CALL";
    } else {
      spotRateTRF = $(thisTileFXTRF).find('[id^="rateFXTRF"]').html().split("/")[0].replace(/,/g, "").trim();

      // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 22 Aug 2023
      if ($(thisTileFXTRF).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {
        LPListTRF = LPListTRFSell.split("|")[1];
      }else{
        LPListTRF = LPListTRFSell.split("|")[0];
      }
      // END - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 22 Aug 2023

      callputType = "PUT";
    }

    let _premCcy = "";

    if( $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val() == $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim()){
  
       _premCcy =  $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim();
        
    }else{
  
      _premCcy =  $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim();
  
    }

    var targetinBFFXTRF = ""
    var targetinPipsFXTRF = ""; 

    if ($(thisTileFXTRF).find('[id^="TargetTypeFXTRF"]').val() == "Big Figure") {

      targetinBFFXTRF = $(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val();
      targetinPipsFXTRF = (parseFloat(targetinBFFXTRF) * 100).toString(); 

    } else {

      targetinPipsFXTRF = $(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val();
      targetinBFFXTRF = (parseFloat(targetinPipsFXTRF) / 100).toString(); 

    } 

    if(_maxclntccyFXTRF === 'ccy2'){

      MaxClientProfitCcyFXTRF = 'ccy2';
      MaxClientProfitFXTRF = 'Get_MaxProfitCCy2';

    }else if( $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val() == $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()){ 

      MaxClientProfitCcyFXTRF = 'ccy2';
      MaxClientProfitFXTRF = 'Get_MaxProfitCCy2';
      MaxClientvalueFXTRF = maxClntPrftCcy1FXTRF =0

    }else{

      MaxClientProfitCcyFXTRF = 'ccy1';
      MaxClientProfitFXTRF = 'Get_MaxProfitCCy1';
      MaxClientvalueFXTRF = maxClientProfitCcy2FXTRF = 0    

    }
    
    let param4 = 
      _premCcy + ', ' + $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim() + ', ' + spotRateTRF + ', ' + $(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').val().replace(/,/g, "") 
      + ', ' + $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val().replace(/,/g, "") + ', ' 
      + Number(targetinBFFXTRF).toFixed($(thisTileFXTRF).find('[id^="hdnDecimalRateFXTRF"]').val()) + ',' 
      + MaxClientvalueFXTRF + ',' + $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().trim() + ', ' 
      + (Number(parseFloat(targetinPipsFXTRF).toFixed($(thisTileFXTRF).find('[id^="hdnDecimalRateFXTRF"]').val())));
    //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
    if(MaxClientProfitCcyFXTRF === 'ccy2' || _maxclntccyFXTRF === 'ccy2'){

      maxClientProfitCcy2FXTRF = 0 

      request_getDataFromAPI(
        {       
          Param1:"FINIQ_COMMON",
          Param2:"dbo",
          Param3:MaxClientProfitFXTRF,
          Param4:param4,
          CurrentTileID:TileId + "|" + ""
        },
        clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/Get_FunctionValue_FXDC","","POST",TileId +"|" + userName + '_' + 'FXDMaxclientprofit_IP'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        .then((data) => { 

          let thisTileFXTRF = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

          let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
          
          $(thisTileFXTRF).find('[id^="btnBestPriceFXTRF"]').attr("disabled", false);  // LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
          
          MaxClientvalueFXTRF = ParseMaxClientProfitFXTRF(data.dataFromAjax.FunctionGenericOutput);

          let param4 = 
            _premCcy + ', ' + _premCcy + ', ' + spotRateTRF + ', ' + $(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').val().replace(/,/g, "") 
            + ', ' + $(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val().replace(/,/g, "") + ', ' 
            + Number(targetinBFFXTRF).toFixed($(thisTileFXTRF).find('[id^="hdnDecimalRateFXTRF"]').val()) + ',' 
            + MaxClientvalueFXTRF + ',' + $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().trim() + ', ' 
            + (Number(parseFloat(targetinPipsFXTRF).toFixed($(thisTileFXTRF).find('[id^="hdnDecimalRateFXTRF"]').val())));
          
          //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
          maxClientProfitCcy2FXTRF = numberWithCommas(MaxClientvalueFXTRF);
          MaxClientProfitFXTRF = 'Get_MaxProfitCCy1';
          
          // LGTCLI-437 | Chaitanya M | 11 July 2023
          if($(thisTileFXTRF).find('[id^="hdnisMetalFX"]').val() === "Y"){

            $(thisTileFXTRF).find('[id^="MaxProfitCcy"]').val(maxClientProfitCcy2FXTRF);

          }else{

            if($(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val() == $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()){

              if(maxClntPrftCcy1FXTRF == '0' || maxClntPrftCcy1FXTRF == 0){
    
                CalMaxClientProfitCCy1FXTRF(TileId,MaxClientProfitFXTRF,param4,maxClntPrftCcy1FXTRF,MaxClientvalueFXTRF);
                
              }

            } 

          }       
          //End                       
          
        });

    }else{
      CalMaxClientProfitCCy1FXTRF(TileId,MaxClientProfitFXTRF,param4,maxClntPrftCcy1FXTRF,MaxClientvalueFXTRF);
    }
    
  } catch (error) {
    console.log(error.message);
  }
}
//End

// LGTGTWINT-1832 For Parsing the max client to string.| Chaitanya M | 10 April 2023 - 
// START
function ParseMaxClientProfitFXTRF(response){
  try {
    let parser = new DOMParser()
    let xmlDoc = parser.parseFromString(response, "text/xml")
    let value =  xmlDoc.getElementsByTagName("Column1")[0].childNodes[0].nodeValue
    return Number(value).toFixed(2)
    
  } catch (error) {
    console.log(error.message);    
  }
}
//End

// LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023 
// START
function CalMaxClientProfitCCy1FXTRF(TileId,MaxClientProfitFXTRF,param4,maxClntPrftCcy1FXTRF,MaxClientvalueFXTRF){
  try {

    thisTileFXTRF = document.getElementById("td" + TileId);

    request_getDataFromAPI(
    {       
      Param1:"FINIQ_COMMON",
      Param2:"dbo",
      Param3:MaxClientProfitFXTRF,
      Param4:param4,
      CurrentTileID:TileId + "|" + ""
    },
    clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/Get_FunctionValue_FXDC","","POST",TileId +"|" + userName + '_' + 'FXDMaxclientprofit_IP'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
    .then((data) => { 

      let thisTileFXTRF = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

      let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

      maxClntPrftCcy1FXTRF =0

      MaxClientvalueFXTRF = ParseMaxClientProfitFXTRF(data.dataFromAjax.FunctionGenericOutput);    
      MaxClientProfitFXTRF = 'Get_MaxProfitCCy2'; //LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 17 April 2023 

      if($(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val() == $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim()){       
   
        $(thisTileFXTRF).find('[id^="MaxProfitCcy"]').val(numberWithCommas(MaxClientvalueFXTRF)); //LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 17 April 2023
        GetMaxClientProfitCCyFXTRF(TileId,"ccy2",maxClntPrftCcy1FXTRF,MaxClientvalueFXTRF);        

      }else{
        
        $(thisTileFXTRF).find('[id^="MaxProfitCcy"]').val(numberWithCommas(MaxClientvalueFXTRF));

      }
      
    });
    
  } catch (error) {
    console.log(error.message); 
  }
}
// End


// LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 17 Apr 2023
//Start
function GetContractSummaryFXTRF(that){
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXTRF = document.getElementById("td" + TileId);

    mapleLoaderStart(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',true); //LGTCLI-422 | Chaitanya M | 5 May 2023

    var targetBFFXTRF = "";
    var targetPipsFXTRF = ""; 
    if ($(thisTileFXTRF).find('[id^="TargetTypeFXTRF"]').val() == "Big Figure") {

      targetBFFXTRF = $(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val(); 
      targetPipsFXTRF = (parseFloat(targetBFFXTRF) * 100).toString(); 

    } else {

      targetPipsFXTRF = $(thisTileFXTRF).find('[id^="targetinpboxFXTRF"]').val(); 
      targetBFFXTRF = (parseFloat(targetPipsFXTRF) / 100).toString(); 

    } 

    if ($(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
      ProductName_FXTRF = ProductNameFXTRFBuy;
      TemplateCode_FXTRF = TemplateCodeTRFBuy;
      TemplateID_FXTRF = TemplateIDTRFBuy;
      ProductIDFXTRF = productIDTRFBuy;
      ProductCode_FXTRF = productCodeTRFBuy;
      callputType = "CALL";
      _LowerKIFXTRF = Number($(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val().replace(/,/g, "").trim()); //LGTGTWINT-1919 | Chaitanya M | 27 April 2023 ||| LGTGTWINT-2106 | Chaitanya M | 08 June 2023
      _UpperKIFXTRF = 0; //LGTGTWINT-1919 | Chaitanya M | 27 April 2023
     
    } else {
      ProductName_FXTRF = ProductNameFXTRFSell;
      TemplateCode_FXTRF = TemplateCodeTRFSell;
      TemplateID_FXTRF = TemplateIDTRFSell;
      ProductIDFXTRF = productIDTRFSell;
      ProductCode_FXTRF = productCodeTRFSell;
      callputType = "PUT";
      _UpperKIFXTRF = Number($(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val().replace(/,/g, "").trim()); //LGTGTWINT-1919 | Chaitanya M | 27 April 2023 ||| LGTGTWINT-2106 | Chaitanya M | 08 June 2023
      _LowerKIFXTRF = 0;//LGTGTWINT-1919 | Chaitanya M | 27 April 2023
    }

    if ($(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]')[0].value == "ExactN") {
      finalPayType = "Exact";
      FixingAdjustment = "Notional";
    } else if ($(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]')[0].value == "ExactS") {
      finalPayType = "Exact";
      FixingAdjustment = "Strike";
    } else if ($(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]')[0].value == "FullNO") {
      finalPayType = "Full";
      FixingAdjustment = "None";
    } else if ($(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]')[0].value == "None") {
      finalPayType = "None";
      FixingAdjustment = "None";
    } else if ($(thisTileFXTRF).find('[id^="TargetPayAdjustFXTRF"]')[0].value == "") {
      finalPayType = "";
      FixingAdjustment = "";
    }

    //Checking KI style
    // LGTGTWINT-1986 | Chaitanya M | 11 May 2023 -Start
    frequencyTRF= $(thisTileFXTRF).find('[id^="frequencyFXTRF"]').val();
    if(!$(thisTileFXTRF).find('[id^="rbRowKIToggleTRF"]')[0].checked){      
      
      if(frequencyTRF.includes("BABS")){
        if(frequencyTRF=="BABS1N00"){
          frequencyTRF = "BABS1Y01"
        }else{
          frequencyTRF = "BABS2Y02"
        }
      }else if(frequencyTRF.includes("MAMS")){
        if(frequencyTRF=="MAMS1N00"){
          frequencyTRF = "MAMS1Y01"
        }else{
          frequencyTRF = "MAMS2Y02"
        }
      }else if(frequencyTRF.includes("WAWS")){
        if(frequencyTRF=="WAWS1N00"){
          frequencyTRF = "WAWS1Y01"
        }else{
          frequencyTRF = "WAWS2Y02"
        }
      } 
      if (frequencyTRF.includes("N")) {
        $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val("").prop("disabled", true);
      } else {
        $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);
      }
    }else{
      if (frequencyTRF.includes("N")) {
        $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').val("").prop("disabled", true);
      } else {
        $(thisTileFXTRF).find('[id^="KIinpboxFXTRF"]').prop("disabled", false);
      }
    }

    if (frequencyTRF.includes("1Y") ||frequencyTRF.includes("1N")) {
      LeverageFXTRF = LeverageArray[0];
    } else if (frequencyTRF.includes("2Y") ||frequencyTRF.includes("2N")) {
      LeverageFXTRF = LeverageArray[1];
    }

    if (frequencyTRF.includes("1N") || frequencyTRF.includes("2N")) {
      KIStyleTRF = KIstyleArr[0];
    } else if (frequencyTRF.includes("01")) {
      KIStyleTRF = KIstyleArr[1];
    } else if (frequencyTRF.includes("02")) {
      KIStyleTRF = KIstyleArr[2];
    } else if (frequencyTRF.includes("12")) {
      KIStyleTRF = KIstyleArr[3];
    }

    if (frequencyTRF.includes("BS")) {
      SettFreqTRF = FreqTRFArr[0];
    } else if (frequencyTRF.includes("MS")) {
      SettFreqTRF = FreqTRFArr[1];
    } else if (frequencyTRF.includes("WS")) {
      SettFreqTRF = FreqTRFArr[2];
    }

    //End

    //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
    //Start
    if($(thisTileFXTRF).find('[id^="hdnisMetalFX"]').val() === "Y"){ // LGTCLI-437 | Chaitanya M | 11 July 2023

      _AlternateCCyFXTRF = $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim();
      _InvccyFXTRF = $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim();

    }else{

      if( $(thisTileFXTRF).find('[id^="CcySelectionFXTRF"]').val() ==  $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim()){    
        
        _AlternateCCyFXTRF = $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim();
        _InvccyFXTRF = $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim();
        
      }else{

        _AlternateCCyFXTRF = $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[1].trim();
        _InvccyFXTRF = $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim();
  
      }    
       
    } 

    //End
    _notionalperfixing =Number($(thisTileFXTRF).find('[id^="ContractAmtFXTRF"]').val().replace(/,/g, "").split(".")[0])

    _notional = _notionalperfixing * $(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').val();

    // LGTGTWINT-1987 | Chaitanya M | 11 May 2023 - Start
    let _IBPremiumTRF = 0;
    let _IBPrempercTRF = 0;
    let _IBPremDirTRF = "";

    if($(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val() == "" || $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val() == null || $(thisTileFXTRF).find('[id^="hdnPricesFXTRF"]').val() == undefined){

      _IBPremiumTRF = 0;
      _IBPrempercTRF = 0;
      _IBPremDirTRF = "";     
      
    }else{

      _IBPremiumTRF = Number($(thisTileFXTRF).find('[id^="hdnIBPremFX"]').val().replace(/,/g, ""));
      _IBPrempercTRF = Number($(thisTileFXTRF).find('[id^="hdnIBPremPercFX"]').val());

      // LGTGTWINT-1987 | Chaitanya M | 05 Jun 2023
      if(_IBPrempercTRF > 0 ){
        _IBPremDirTRF = "Pay";
      }else{
        _IBPremDirTRF = "Receive";
        _IBPremiumTRF = _IBPremiumTRF *-1;
        _IBPrempercTRF = _IBPrempercTRF *-1;
      }
      //End
      
    }
    //End

    request_getDataFromAPI(
      {       
        EntityID: sessionStorage.getItem("HomeEntityID"),
        LoginID: sessionStorage.getItem("Username"),
        ProductCode: ProductCode_FXTRF,
        EntityID_: sessionStorage.getItem("HomeEntityID"),
        TemplateCode: TemplateCode_FXTRF,
        producttype:ProductCode_FXTRF.toUpperCase(), //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        BSdirection: $(thisTileFXTRF).find('[id^="CcyBuSellSelectionFXTRF"]').val().trim().toUpperCase(),    
        ccypair:$(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().trim(),
        OptionType: $(thisTileFXTRF).find('[id^="Optioncutddl"]').val(),
        Invccy:_InvccyFXTRF, //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        AltNotionalCcy: _AlternateCCyFXTRF,//LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        PremCcy: $(thisTileFXTRF).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim(),//LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        Notional: _notional,
        notionalperfixing : _notionalperfixing,
        Tenor : $(thisTileFXTRF).find('[id^="hdnFXTRFTenorCode"]').val(),
        Expiry:$(thisTileFXTRF).find('[id^="hdnFXTRFExpiry"]').val(),
        settlement:$(thisTileFXTRF).find('[id^="hdnFXTRFDeliveryDate"]').val(),
        LongDate: "", 
        shortDate: "",
        Strike:Number($(thisTileFXTRF).find('[id^="strikeinpboxFXTRF"]').val().replace(/,/g, "")), // LGTCLI-391 Chaitanya M 9 May 2023
        OptionCut:  $(thisTileFXTRF).find('[id^="Optioncutddl"]').val(),
        BarrierType:"",
        ExoticCode:"",
        DigitalType:"",
        UpperBarrier:0,
        LowerBarrier:0,
        LeverageFactor: Number(LeverageFXTRF),
        noofsett:Number($(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').val()),
        nooffixings: Number($(thisTileFXTRF).find('[id^="NOSettlementinpboxFXTRF"]').val()), 
        FixingFrequency:SettFreqTRF,  
        settfrequency: SettFreqTRF,
        LowerStrike:0,
        UpperStrike:0,
        pivotstrike:0,
        SpreadType: "",
        customerpremdir: "", 
        IBPremDir: _IBPremDirTRF, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
        IBPrem: _IBPremiumTRF, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
        RTC:0,
        IBPremperc: _IBPrempercTRF, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
        RTCPerc:0,
        Target:0,
        TargetNotional:0, 
        KIStyle: KIStyleTRF,
        LowerKI: _LowerKIFXTRF, //LGTGTWINT-1919 | Chaitanya M | 27 April 2023
        UpperKI: _UpperKIFXTRF, //LGTGTWINT-1919 | Chaitanya M | 27 April 2023
        Guaranteedtill:"",
        GuaranteedPeriods:0,
        CappedLossCcy:"",
        CappedLossType:"", 
        CappedLoss:"",
        CappedLossAmt:0,
        TargetBigFigure: targetBFFXTRF,
        Targetgainunit: "BigFigure",
        TargetinPips: Number(targetPipsFXTRF),
        KOITMEvent: 0,
        Striptype: "",
        FirstFixingDate: $(thisTileFXTRF).find('[id^="FirstFixDate"]').val(),
        FinalPayType:finalPayType,
        FixingAdjustment:FixingAdjustment,
        CurrentTileID:TileId + "|" + ""
      },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/GetContractSummary","","POST",TileId +"|" + userName + '_' + 'GetContractSummary_IP'  +'_' + RequestIDGenerator(5)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => { 

        let thisTileFXTRF = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let TileId = data.CurrentTileID.split("|")[0];

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

         // let thisTileFXTRF = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

          // let TileId = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

          res =  data.dataFromAjax.result.toString().replaceAll("\\n", "<br>");  
          if(res.includes('color:green')){
            summary = res.toString().replaceAll("\color:green","color:var(--green) !important");
          }else{
            summary = res.toString().replaceAll("\color:red","color:var(--red) !important");
          }
          
          $(thisTileFXTRF).find('[id^="ContractSummaryFXD"]').append(summary);
          
          summarytradePopup(that,"SummaryFXD" + TileId,res,"DivOverlayFXTRF");    

          mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',true);

        }else{

          mapleLoaderStop(thisTileFXTRF,'[id^="btnBestPriceFXTRF"]',true);
          
        }
        //End
        

      }); 

  } catch (error) {
    
  }
}

//End