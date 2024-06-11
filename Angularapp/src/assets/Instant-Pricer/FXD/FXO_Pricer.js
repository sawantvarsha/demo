var RFQObjectFXO;
var output = [];
var TradeDateFXO;
var BidRateFXO = "";
var AskRateFXO = "";
var out;
var bookQuoteIdFXO = "";
var Cust_Prem_Amt;
var tenorListFXO = ["1W","2W","3W","4W","1M","2M","3M","4M","5M","6M","7M","8M","9M","10M","11M","1Y","2Y","3Y","5Y","7Y"];
var tempPair = [];
var today = new Date();
var OptionCutListFXO = [];
 
var isccymetalflagFXO = false;   //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
var isSaveTradeIdeaFXO; // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
var _defaultflagFXO = false; //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023

//Start - LGTCLI-422 | Chaitanya M | 5 May 2023
var _eventstrikechangeFXO = false;
var _eventccychangeFXO = false;
// End

var MinQuoteTimeOutOccurredFXO = false; // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023

var timeoutFXO=""; //LGTGTWINT-2110 | Chaitanya M | 13 June 2023

//Added by RizwanS || LGTGTWINT-2322 || 22 Aug 2023
var MaxQuoteTimeOutFXOPTION = "";
var MinQuoteTimeOutFXOPTION = "";
var MaxQuoteTimeOutFXBARRIER= "";
var MinQuoteTimeOutFXBARRIER = "";
var LPListFXVanilla = "";
var LPListFXBarrier = "";
//END

$(document).ready(function () {
  try {
 
  } catch (err) {
    console.log(err.message);
  }
});

// To load FX Option default functions and values
function optionsOnLoad(currId) {
  try{

    setDeafaultValuesFXOption(currId); 

    thisTileFXO = document.getElementById("td" + currId);

    mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false);

    resetFXDPrice(thisTileFXO);  
 
    if($(thisTileFXO).find('[id^="FXO_Type"]').val().trim() !== "Vanilla") {

      // Changed by Chaitanya N | 25 July 2023 
      $(thisTileFXO).find('[id^="FXBarrier_Type"]').removeClass("SHowSOlveFor"); 
      $(thisTileFXO).find('[id^="isVanilla"]').removeClass("SHowSOlveFor"); 
      $(thisTileFXO).find('[id^="lblBarrierType"]').removeClass("SHowSOlveFor"); 
      //ENd     
      
      $(thisTileFXO).find('[id^="FXOHedgepanel"]').addClass("showHedgePanel"); 
      
      checkbarriertype(thisTileFXO);

    } else {   
      // Changed by Chaitanya N | 25 July 2023 
      $(thisTileFXO).find('[id^="FXBarrier_Type"]').addClass("SHowSOlveFor");
      $(thisTileFXO).find('[id^="isVanilla"]').addClass("SHowSOlveFor"); 
      $(thisTileFXO).find('[id^="lblBarrierType"]').addClass("SHowSOlveFor"); 
      //ENd

      if (clientConfigdata.CommonMethods.HEDGEPANELYN !== "N") {
        $(thisTileFXO).find('[id^="FXOHedgepanel"]').removeClass("showHedgePanel"); 

        if($(thisTileFXO).find('[id^="FXOHedgeType"]').val().trim() === "NONE"){
          $(thisTileFXO).find('[id^="FXOHedgeTypelbl"]').addClass("showhideCustomspot");
          $(thisTileFXO).find('[id^="FXOCustomeSpot"]').addClass("showhideCustomspot");
        }else{
          $(thisTileFXO).find('[id^="FXOHedgeTypelbl"]').removeClass("showhideCustomspot");
          $(thisTileFXO).find('[id^="FXOCustomeSpot"]').removeClass("showhideCustomspot");

          if($(thisTileFXO).find('[id^="FXOHedgeYN"]').val().trim() === "YES"){
            $(thisTileFXO).find('[id^="FXOCustomeSpot"]').attr("disabled", false);
          }else{
            $(thisTileFXO).find('[id^="FXOCustomeSpot"]').attr("disabled", true);
          }

      }
      }

    }

    if($(thisTileFXO).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase() === "PREMIUM"){

      $(thisTileFXO).find('[id^="FXO_Strike"]').prop("disabled", false);
      $(thisTileFXO).find('[id^="FXO_Premium"]').prop("disabled", true);
      $(thisTileFXO).find('[id^="FXO_Premium"]').val("");

    }else{

      $(thisTileFXO).find('[id^="FXO_Strike"]').prop("disabled", true);
      $(thisTileFXO).find('[id^="FXO_Premium"]').prop("disabled", false);
      $(thisTileFXO).find('[id^="FXO_Strike"]').val("");

    }

    //Change Strike on Pair Change || 30-Sep-2019
    $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').on("select", function () {
      try {

        thisTileFXO = $(this).parents(".sorting")[0]; 
        let ccypairs ="";
        mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false);

        resetFXDPrice(thisTileFXO);
        // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
        //End
        if($(thisTileFXO).find('[id^="FXO_Type"]').val().trim() != "Vanilla") {

          ccypairs = sessionStorage.getItem("CCYListFXBarrier");
    
        } else {
    
          ccypairs = sessionStorage.getItem("CCYListFXVanilla");
    
        }
        
        if(!ccypairs.includes($(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val())){ //LGTGTWINT-1582 | currency pair validation on instant pricer | Chaitanya M | 02-March-2023
          $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val("");
          ValidateField($(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').attr("id"), "Currency pair not found.", thisTileFXO);
          return false;
        }else{

          if( $(this).parents(".sorting").find('[id^="hdnCcyDetailsFXO"]').val() ===  $(this).parents(".sorting").find('[id^="FXO_CCYPairDemo"]').val()){
            return false;
          }else{

            _defaultflagFXO = true;

            getCurrencyFXORate(currId);

            if ($(thisTileFXO).find('[id^="FXObuySell"]').val().toUpperCase() === "BUY") {
              if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {
                $(thisTileFXO).find('[id^="FXO_Strike"]').val(AskRateFXO);
              } else {
                $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO);
              }
            } else {
              if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {
                $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO);
              } else {
                $(thisTileFXO).find('[id^="FXO_Strike"]').val(AskRateFXO);
              }
            }

            $(thisTileFXO).find('[id^="CcySelectionFXO"]').val($(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim());   
    
            return false;

          }
        }
      } catch (er) {
        console.log(er.message);
      }
    });

    $(thisTileFXO).find('[id^="CcySelectionToggleFXO"]').on("click", function () { 
      try {

        thisTileFXO = $(this).parents(".sorting")[0];  
        
        // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
        //End

        mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false);

        resetFXDPrice(thisTileFXO); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
        if(isccymetalflagFXO != true){        
   
        if($(thisTileFXO).find('[id^="CcySelectionFXO"]').val() === $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim()){
          $(thisTileFXO).find('[id^="CcySelectionFXO"]').val($(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim());
        }else{
          $(thisTileFXO).find('[id^="CcySelectionFXO"]').val($(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim());  
        }   
        
        checkDecimalAmt("", thisTileFXO); //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022

        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
      }
      //ENd
      } catch (error) {
        console.log(error.message);
      }
    });

    //Change Strike on BUY / SELL ||  30-Sep-2019
    $(thisTileFXO).find('[id^="FXObuySell"]').on("change",function () {
      try {

        thisTileFXO = $(this).parents(".sorting")[0]; 

        getCurrencyFXORate(currId);
        resetFXDPrice(thisTileFXO);
        checkbarriertype(thisTileFXO);

        // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
        //End
         
        if ($(thisTileFXO).find('[id^="FXObuySell"]').val().toUpperCase() === "BUY") {

          $(thisTileFXO).find('[id^="FXObuySell"]').removeClass("SellDropdown");
          $(thisTileFXO).find('[id^="FXObuySell"]').addClass("BuyDropdown");
        
        } else { 
        
          $(thisTileFXO).find('[id^="FXObuySell"]').addClass("SellDropdown");
          $(thisTileFXO).find('[id^="FXObuySell"]').removeClass("BuyDropdown");
        
        }
    
        return false;
      } catch (er) {
        console.log(er.message);
      }
    });

    //Change Strike on CALL / PUT || 30-Sep-2019
    $(thisTileFXO).find('[id^="FXCallPut"]').on("change",function () {
      try {

        thisTileFXO = $(this).parents(".sorting")[0];
        getCurrencyFXORate(currId);
        resetFXDPrice(thisTileFXO);

        // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
        //End
        
        if($(thisTileFXO).find('[id^="ddlSolveForFX"]').val().toUpperCase() == "PREMIUM"){

          if ($(thisTileFXO).find('[id^="FXObuySell"]').val().toUpperCase() === "BUY") {

            if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {
              $(thisTileFXO).find('[id^="FXO_Strike"]').val(AskRateFXO);
            } else {
              $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO);
            }
          } else {
            if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {
              $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO);
            } else {
              $(thisTileFXO).find('[id^="FXO_Strike"]').val(AskRateFXO);
            }
          }

        }else{
          $(thisTileFXO).find('[id^="FXO_Strike"]').val("");
        }
        
        checkbarriertype(thisTileFXO);
        return false;

      } catch (er) {
        console.log(er.message);
      }
    });

    $(thisTileFXO).find('[id^="FXO_TenorDemo"]').on("change", function () {
      try {

        thisTileFXO = $(this).parents(".sorting")[0];
        resetFXDPrice(thisTileFXO);

        // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
        //End

        fillDatesFXO(
          $(this).parents(".sorting").find('[id^="FXO_CCYPairDemo"]').val(),
          $(this).parents(".sorting").find('[id^="FXO_TenorDemo"]').val(),
          currId
        );        
        return false;

      } catch (er) {
        console.log(er.message);
      }
    });

    //Added By RizwanS / JIRA - INT1FIN47 - 324 // 12 Jan 2022

    // $(thisTileFXO).find('[id^="ModelPricing"]').on("change", function () {
    //   try {
    //     thisTileFXO = $(this).parents(".sorting")[0];

    //     getFNQEstValuesFX("", "", thisTileFXO);
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // });

    //END

    $(thisTileFXO).find('[id^="FXO_Type"]').on("change", function () {
      try {

        thisTileFXO = $(this).parents(".sorting")[0]; 
        resetFXDPrice(thisTileFXO);

        // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
        //End

        if($(thisTileFXO).find('[id^="FXO_Type"]').val().trim() !== "Vanilla") {
         // Changed by Chaitanya N | 25 July 2023 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').removeClass("SHowSOlveFor"); 
          $(thisTileFXO).find('[id^="isVanilla"]').removeClass("SHowSOlveFor"); 
          $(thisTileFXO).find('[id^="lblBarrierType"]').removeClass("SHowSOlveFor"); 
          //END

          $(thisTileFXO).find('[id^="FXOHedgepanel"]').addClass("showHedgePanel"); 
          

          $(thisTileFXO).find('[id^="hdnFXOType"]').val(prodCodeFXO);
        //  $(thisTileFXO).find('[id^="FXBarrier_Type"]').prop("disabled", false);
          checkbarriertype(thisTileFXO);
        } else {
         // Changed by Chaitanya N | 25 July 2023 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').addClass("SHowSOlveFor"); 
          $(thisTileFXO).find('[id^="isVanilla"]').addClass("SHowSOlveFor"); 
          $(thisTileFXO).find('[id^="lblBarrierType"]').addClass("SHowSOlveFor"); 
          //ENd

          $(thisTileFXO).find('[id^="FXOHedgepanel"]').removeClass("showHedgePanel"); 

          if($(thisTileFXO).find('[id^="FXOHedgeType"]').val().trim() === "NONE"){
            $(thisTileFXO).find('[id^="FXOHedgeTypelbl"]').addClass("showhideCustomspot");
            $(thisTileFXO).find('[id^="FXOCustomeSpot"]').addClass("showhideCustomspot");
          }else{
            $(thisTileFXO).find('[id^="FXOHedgeTypelbl"]').removeClass("showhideCustomspot");
            $(thisTileFXO).find('[id^="FXOCustomeSpot"]').removeClass("showhideCustomspot");

            if($(thisTileFXO).find('[id^="FXOHedgeYN"]').val().trim() === "YES"){
              $(thisTileFXO).find('[id^="FXOCustomeSpot"]').attr("disabled", false);
            }else{
              $(thisTileFXO).find('[id^="FXOCustomeSpot"]').attr("disabled", true);
            }
          }

           $(thisTileFXO).find('[id^="hdnFXOType"]').val(prodCodeFXO);
          // $(thisTileFXO).find('[id^="FXBarrier_Type"]').prop("disabled", true);
          // $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').prop("disabled", true);
          // $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').prop("disabled", true);
          $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");
          $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val("");
        }
        getCurrencyFXORate(currId);
        return false;

      } catch (er) {
        console.log(er.message);
      }
    });

    $(thisTileFXO).find('[id^="ContractAmtFXO"]').on("change", function(){

      thisTileFXO = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023  

      mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false);

      resetFXDPrice(thisTileFXO); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      FormatNotional($(this).parents(".sorting").find('[id^="ContractAmtFXO"]').val(),this); // Added for LGTGTWINT-1511  Incorrect max notional calculation | Chaitanya M | 24 feb 2023
      // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
      $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
      //End
       
    });

    $(thisTileFXO).find('[id^="FXO_Strike"]').on("change", function(){

      thisTileFXO = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      _eventstrikechangeFXO = true; //LGTCLI-422 | Chaitanya M | 5 May 2023
      mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false);

      $(thisTileFXO).find('[id^="hdnStrikevalueFX"]').val($(thisTileFXO).find('[id^="FXO_Strike"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      
      resetFXDPrice(thisTileFXO); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
      $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
      //End

    });

    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').on("change", function(){

      thisTileFXO = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
 
      mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false);

      resetFXDPrice(thisTileFXO); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
      $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
      //End

    });

    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').on("change", function(){

      thisTileFXO = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
 
      mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false);

      resetFXDPrice(thisTileFXO); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
      $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
      //End

      return false;
    });

    $(thisTileFXO).find('[id^="Optioncutddl"]').on("change", function(){

      thisTileFXO = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      
      mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false);

      resetFXDPrice(thisTileFXO); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
      $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
      //End

      return false;

    });

    $(thisTileFXO).find('[id^="UpfrontFXO"]').on("change", function(){

      thisTileFXO = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false);

      resetFXDPrice(thisTileFXO); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
      $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
      //End

      return false;

    });

    $(thisTileFXO).find('[id^="FXBarrier_Type"]').on("change", function () {
      try {

        thisTileFXO = $(this).parents(".sorting")[0]; 

        checkbarriertype(thisTileFXO);        
        resetFXDPrice(thisTileFXO);
        getCurrencyFXORate(currId);

        // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
        //End
        return false;

      } catch (er) {
        console.log(er.message);
      }
    });

    $(thisTileFXO).find('[id^="ddlSolveForFX"]').on("change", function(){

      thisTileFXO = $(this).parents(".sorting")[0]; 

      mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false);

      resetFXDPrice(thisTileFXO);

      // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
      $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
      //End

      if($(thisTileFXO).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase() === "PREMIUM"){

        $(thisTileFXO).find('[id^="FXO_Strike"]').prop("disabled", false);
        $(thisTileFXO).find('[id^="FXO_Premium"]').prop("disabled", true);
        $(thisTileFXO).find('[id^="FXO_Premium"]').val("");
        $(thisTileFXO).find('[id^="FXO_Strike"]').val($(thisTileFXO).find('[id^="hdnStrikevalueFX"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
  
      }else{
  
        $(thisTileFXO).find('[id^="FXO_Strike"]').prop("disabled", true);
        $(thisTileFXO).find('[id^="FXO_Premium"]').prop("disabled", false);
        $(thisTileFXO).find('[id^="hdnStrikevalueFX"]').val($(thisTileFXO).find('[id^="FXO_Strike"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        $(thisTileFXO).find('[id^="FXO_Strike"]').val("");
  
      }

    });


    $(thisTileFXO).find('[id^="FXOHedgeType"]').on("change", function () {
      try {

        thisTileFXO = $(this).parents(".sorting")[0]; 
        resetFXDPrice(thisTileFXO);

        // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
        //End

        if($(thisTileFXO).find('[id^="FXOHedgeType"]').val().trim() === "NONE"){
          $(thisTileFXO).find('[id^="FXOHedgeTypelbl"]').addClass("showhideCustomspot");
          $(thisTileFXO).find('[id^="FXOCustomeSpot"]').addClass("showhideCustomspot");
        }else{
          $(thisTileFXO).find('[id^="FXOHedgeTypelbl"]').removeClass("showhideCustomspot");
          $(thisTileFXO).find('[id^="FXOCustomeSpot"]').removeClass("showhideCustomspot");

          if($(thisTileFXO).find('[id^="FXOHedgeYN"]').val().trim() === "YES"){
            $(thisTileFXO).find('[id^="FXOCustomeSpot"]').attr("disabled", false);
          }else{
            $(thisTileFXO).find('[id^="FXOCustomeSpot"]').attr("disabled", true);
          }

        }
  
        return false

      } catch (er) {
        console.log(er.message);
      }
    });

    $(thisTileFXO).find('[id^="FXOHedgeYN"]').on("change", function () {
      try {

        thisTileFXO = $(this).parents(".sorting")[0]; 
        resetFXDPrice(thisTileFXO);

        // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
        //End

        if($(thisTileFXO).find('[id^="FXOHedgeYN"]').val().trim() === "YES"){
          $(thisTileFXO).find('[id^="FXOCustomeSpot"]').attr("disabled", false);
        }else{
          $(thisTileFXO).find('[id^="FXOCustomeSpot"]').attr("disabled", true);
        }
  
        return false

      } catch (er) {
        console.log(er.message);
      }
    });
    
    // Added for reseting on premium change. | Chaitanya M | 22 Aug 2023
    $(thisTileFXO).find('[id^="FXO_Premium"]').on("change", function () {
      try {

        thisTileFXO = $(this).parents(".sorting")[0]; 
        resetFXDPrice(thisTileFXO);

        // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);
        //End
  
        return false

      } catch (er) {
        console.log(er.message);
      }
    });
    //END

    // Start || HSBCFXEINT-107 : Enable fixing and maturity date | CM1025@17-May-2024
    $(thisTileFXO) .find('[id^="FirstFixDate"]').on("change", function () {
      try {
        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

        thisTileFXO = document.getElementById("td" + currId);

        mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXO); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        let firstFix = new Date($(this).val());

        if($(this).val() !=""){ /// LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023
       
          $(thisTileFXO).find('[id^="btnBestPriceFXTRF"]').attr("disabled", false);
         
          let validdateYN = validatefirstfixingday(thisTileFXO,"FirstFixDate",firstFix); //Added to show error if Saturday or Sunday selected as First- Fixing date | LGTGTWINT-1424| Chaitanya M | 20 Feb 2023   

          if(validdateYN != false){
            let formattedDate = firstFix.getDate() + "-" + months[firstFix.getMonth()] +"-" + firstFix.getFullYear();
            
            $(thisTileFXO).find('[id^="hdnFXOFixing"]').val(formattedDate);

            $(thisTileFXO).find('[id^="lblFirstFixDate"]').html(formattedDate);
    
            fnGetFixingMaturityDatesFXO(
              $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val(),  
              $(thisTileFXO).find('[id^="FirstFixDate"]').val(),
              "MATURITY",
              currId
            );

          } else {
            return false;
          }

        }else{// LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023

          $(thisTileFXO).find('[id^="lblFirstFixDate"]').html($(this).val());
          $(thisTileFXO).find('[id^="FXTRF_Expiry"]').html("");
          validatefirstfixingday(thisTileFXO,"",$(this).val());
        }

        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023

      } catch (error) {
        console.log(error.message);
      }
    });
    // End || HSBCFXEINT-107 : Enable fixing and maturity date | CM1025@17-May-2024

    // Start || HSBCFXEINT-107 : Enable fixing and maturity date | CM1025@17-May-2024
    $(thisTileFXO) .find('[id^="FXO_Expiry"]').on("change", function () {
      try {

        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

        thisTileFXO = document.getElementById("td" + currId);

        mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXTRF"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXO); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        let _MaturityDate = new Date($(this).val());

        if($(this).val() !=""){ /// LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023
       
          $(thisTileFXO).find('[id^="btnBestPriceFXTRF"]').attr("disabled", false);
         
          let validdateYN = validatefirstfixingday(thisTileFXO,"FXO_Expiry",_MaturityDate); //Added to show error if Saturday or Sunday selected as First- Fixing date | LGTGTWINT-1424| Chaitanya M | 20 Feb 2023   

          if(validdateYN != false){
            let formattedDate = _MaturityDate.getDate() + "-" + months[_MaturityDate.getMonth()] +"-" + _MaturityDate.getFullYear();

            $(thisTileFXO).find('[id^="hdnFXOExpiry"]').val(formattedDate);

            $(thisTileFXO).find('[id^="lblFXOExpiry"]').html(formattedDate);
    
            fnGetFixingMaturityDatesFXO(
              $(this).parents(".sorting").find('[id^="FXO_CCYPairDemo"]').val(),  
              $(this).parents(".sorting").find('[id^="FXO_Expiry"]').val(),
              "FIXING",
              currId
            );

          } else {
            return false;
          }

        }else{

          $(thisTileFXO).find('[id^="lblFirstFixDate"]').html($(this).val());
          $(thisTileFXO).find('[id^="FXTRF_Expiry"]').html("");
          validatefirstfixingday(thisTileFXO,"",$(this).val());

        }

        return false; 

      } catch (error) {
        console.log(error.message);
      }
    });
    // End || HSBCFXEINT-107 : Enable fixing and maturity date | CM1025@17-May-2024

  } catch (err) {
    console.log(err.message);
  }
  
}

// To set default values of parameters
function setDeafaultValuesFXOption(currId) {
  try {

    thisTileFXO = document.getElementById("td" + currId);
    fillDropdownlistControl(tenorListFXO,$(thisTileFXO).find('[id^="FXO_TenorDemo"]').attr("id"));
    document.querySelector("#" + $(thisTileFXO).find('[id^="FXO_TenorDemo"]').attr("id")).selectedIndex = 5;
    $(thisTileFXO).find('[id^="ContractAmtFXO"]').val("100,000.00");
    $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val("EUR - USD");
    $(thisTileFXO).find('[id^="primaryCcyFXO"]').html($(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim());
    $(thisTileFXO).find('[id^="SecondaryCcyFXO"]').html($(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim());
    $(thisTileFXO).find('[id^="UpfrontFXO"]').val("0.05"); // Added by Chaitanya M | 25 July 2023
    clearPricerTable(thisTileFXO);

    //Added for ccy pair autocomlete / JIRA - FINGUI - 237 / 14 Feb 2022
    callCcyautocompleteFX(thisTileFXO, "FXO_CCYPairDemo");
    //END

    if ( $(thisTileFXO).find('[id^="FXObuySell"]').val().trim() === "Buy") {

      $(thisTileFXO).find('[id^="FXObuySell"]').removeClass("SellDropdown");
      $(thisTileFXO).find('[id^="FXObuySell"]').addClass("BuyDropdown");

    }else{

      $(thisTileFXO).find('[id^="FXObuySell"]').removeClass("BuyDropdown");
      $(thisTileFXO).find('[id^="FXObuySell"]').addClass("SellDropdown");
    }

 // Changed by Chaitanya N | 25 July 2023 
    if(clientConfigdata.FXO.SolveFor=="N"){
      $(thisTileFXO).find('[id^="lblsolveforFX"]').hide();
      $(thisTileFXO).find('[id^="ddlSolveForFX"]').hide();
      $(thisTileFXO).find('[id^="lblPremiumFX"]').addClass("SHowSOlveFor");
      $(thisTileFXO).find('[id^="FXO_Premium"]').addClass("SHowSOlveFor");
      
    }
    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() == "Vanilla") {
      $(thisTileFXO).find('[id^="isVanilla"]').addClass("SHowSOlveFor");
      $(thisTileFXO).find('[id^="FXOHedgepanel"]').removeClass("showHedgePanel"); 
    }
    //End
    //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
    $(thisTileFXO).find('[id^="hdnCcyDetailsFXO"]').val($(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val());

  } catch (err) {
    console.log(err.message);
  }
}

// To get required dates from current tenor parameteres
function fillDatesFXO(pair, tenorValue, currId) {
  try {

    thisTileFXO = document.getElementById("td" + currId);

    $(thisTileFXO).find('[id^="btnBestPriceFXOption"]').attr("disabled", true);

    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() != "Vanilla") {
      productIDFXO = productIDFXBarrier;
      prodCodeFXO = productCodeFXBarrier;
    } else {
      productIDFXO = productIDFXVanilla;
      prodCodeFXO = productCodeFXVanilla;
    }

    request_getDataFromAPI({      
      "currencyPair": $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().trim(),
      "tradeDate": setBusinessDate,
      "iEntityID": EntityID,
      "tenor_Code": tenorValue,
      "tenor" : '',
      "fixing_Frequency":"",	
      "settlement_Frequency":"",
      "depoCcy": pair.split("-")[0].trim(),
      "altCcy": pair.split("-")[1].trim(),
      "iProductId": productIDFXO,
      "i_ProductCode": prodCodeFXO, 
      "i_Mode" : "FXOSEN",
      "optioncut": $(thisTileFXO).find('[id^="Optioncutddl"]').val(),
      "firstFixingChangeYN" : "N",  
      "firstFixingDate" : "",
      "defaultFixingDate":'',
      "defaultSettDate":'',
      "prem_Settlement_Days" :'', // Added missing parameters for Date service call | ChaitanyaM | 25-April-2024
      "CurrentTileID": currId + "|" + "",
      //  "RequestID": currId +"|" + userName + '_' + 'CalculateDates_IP'  +'_'+ RequestIDGenerator(10) + RequestIDGenerator(4), //modified by Chaitanya M, LGTGTWINT-1850 | 13-april-23

    },
    clientConfigdata.CommonMethods.NodeServer + "DateCalculationApi/Get_FinIQ_CalculateDatesWrapper","","POST",currId +"|" + userName + '_' + 'CalculateDates_IP'  +'_' + RequestIDGenerator(6)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
    .then((data) => {

     let thisTileFXO = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

     let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

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


      if(responseHeader.toUpperCase() === "SUCCESS"){
        TradeDateFXO = setBusinessDate;
        // Start || HSBCFXEINT-107 : Enable fixing and maturity date | CM1025@17-May-2024

        let strFXOExpiry = new Date(data.dataFromAjax[0].maturityDate);
        let FXOExpiry = strFXOExpiry.getFullYear() + "-" +
          ("0" + (strFXOExpiry.getMonth() + 1)).substr(-2, 2) + "-" +
          ("0" + strFXOExpiry.getDate()).substr(-2, 2);


        $(thisTileFXO).find('[id^="lblFXOExpiry"]').html(data.dataFromAjax[0].maturityDate);
        $(thisTileFXO).find('[id^="FXO_Expiry"]').val(FXOExpiry);


        let strFirstFix = new Date(
          data.dataFromAjax[0].fixingDate
        );
        let firstFix =
          strFirstFix.getFullYear() +
          "-" +
          ("0" + (strFirstFix.getMonth() + 1)).substr(-2, 2) +
          "-" +
          ("0" + strFirstFix.getDate()).substr(-2, 2);


        $(thisTileFXO).find('[id^="lblFirstFixDate"]').html(data.dataFromAjax[0].fixingDate);  //Added by RizwanS || to show fixing date on UI || 27 Jul 2023
        $(thisTileFXO).find('[id^="FirstFixDate"]').val(firstFix);
        // End || HSBCFXEINT-107 : Enable fixing and maturity date | CM1025@17-May-2024

        $(thisTileFXO).find('[id^="hdnFXOPremiumDate"]').val(data.dataFromAjax[0].valueDate);     
        $(thisTileFXO).find('[id^="hdnFXOFixing"]').val(data.dataFromAjax[0].fixingDate);
        $(thisTileFXO).find('[id^="hdnFXOExpiry"]').val(data.dataFromAjax[0].maturityDate);
        $(thisTileFXO).find('[id^="hdnTenorDaysFXO"]').val(data.dataFromAjax[0].expiryDays);
        // Addded for CFINT-992 // 18-Sep-2020 // 
        $(thisTileFXO).find('[id^="FXO_SoftTenorIp"]').val(data.dataFromAjax[0].expiryDays); // Added by LalitG@16May2024 || for enabling Soft Tenor entry || HSBCFXEINT-75
        $(thisTileFXO).find('[id^="hdnFXOTenorCode"]').val(data.dataFromAjax[0].expiryDays + "D");

        $(thisTileFXO).find('[id^="btnBestPriceFXOption"]').attr("disabled", false);
        
        setNDFMetalFlagFXO(
          currId,
          $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val(),
          pair.split("-")[0].trim(),
          pair.split("-")[1].trim(),
          "",
          "",
          $(thisTileFXO).find('[id^="hdnFXOPremiumDate"]').val(),
          $(thisTileFXO).find('[id^="hdnFXOFixing"]').val(),
          $(thisTileFXO).find('[id^="hdnFXOExpiry"]').val()
        );

        //END
      } else {

        let failReason = "System Error occured";
        
        ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), failReason, thisTileFXO);

      }
    }).catch((error) => {
      console.log(error);
    });
  } catch (err) {
    console.log(err.message);
  }
}

function fillFirstFixingDateFXO(pair, tenorValue, currId) {
  try {
    
    thisTileFXO = document.getElementById("td" + currId);

    $(thisTileFXO).find('[id^="btnBestPriceFXOption"]').attr("disabled", true);

    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() != "Vanilla") {

      productIDFXO = productIDFXBarrier;
      prodCodeFXO = productCodeFXBarrier;

    } else {

      productIDFXO = productIDFXVanilla;
      prodCodeFXO = productCodeFXVanilla;
      
    }

    $(thisTileFXO).find('[id^="btnBestPriceFXOption"]').attr("disabled", true);
    $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true); 
    $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);

    request_getDataFromAPI(
      {
        "CurrencyPair": $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().trim(),
        "TradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "Tenor_Code": tenorValue,
        "Fixing_Frequency": "",
        "Settlement_Frequency": "",
        "EntityID": EntityID,
        "LoginID": userName,
        "DepoCcy": pair.split("-")[0].trim(),
        "AltCcy": pair.split("-")[1].trim(),
        "iProductId": productIDFXO,
        "I_ProductCode": prodCodeFXO,
        "ProductCode": prodCodeFXO,
        // "CurrentTileID": currId,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "optioncut": $(thisTileFXO).find('[id^="Optioncutddl"]').val(),
      },
      clientConfigdata.CommonMethods.NodeServer + "fillFirstFixingDate","","POST",currId +"|" + userName + '_' + 'fillFirstFixingDate'  +'_' + RequestIDGenerator(6)).then((data) => {

        let thisTileFXO = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        let TileId = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

        if(responseHeader.toUpperCase() === "SUCCESS"){
        
          let strFirstFix = new Date(data.CalculateDatesResult.Dates[0].FixingDate);
          let firstFix =strFirstFix.getFullYear() +
            "-" + ("0" + (strFirstFix.getMonth() + 1)).substr(-2, 2) +
            "-" + ("0" + strFirstFix.getDate()).substr(-2, 2);

        $(thisTileFXO).find('[id^="FirstFixDate"]').val(firstFix); 
        $(thisTileFXO).find('[id^="lblFirstFixDate"]').html(data.CalculateDatesResult.Dates[0].FixingDate);
        $(thisTileFXO).find('[id^="btnBestPriceFXOption"]').attr("disabled", false);

        //END
        } else {

          let failReason = data.CalculateDatesResult.A_ResponseHeader.FailedReason; 
        
          ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), failReason, thisTileFXO);

        } 
    }).catch((error) => {
        console.log(error);
    });
    
  } catch (error) {
    console.log(error.message);
  }
}
// To initialize pricing and validate the parameters before pricing
function FXO_CalBestPrice(that) {
  try {
    closeContractSummarypopup(that); // Added by Lalit G || 03 June 24 || HSBCFXEINT-97
    closeErrorBox(that) // Added by LalitG@14May2024 || HSBCFXEINT-97
    bestpriceclosepopup(that); // Instant pricer: contract summary loading stuck on extended tab | Chaitanya M | 31-May-2024
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXO = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
    console.log("PricingFor ::", TileId, thisTileFXO, productName);
    //To Remove highlighted part if no error
    validation_clear();
     // Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
  
     // START - LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023    
     resetFXDPrice(thisTileFXO); // LGTGTWINT-2331 | Chaitanya M | 22 Aug 2023

     $(thisTileFXO).find('[id^="btnBestPriceFXOption"]').attr("disabled", true);
     let _RID_AQ = "";
     _RID_AQ = _RID_AQ + RequestIDGenerator(30);
     $(thisTileFXO).find('[id^="hdnRequestID"]').val(_RID_AQ);
     // END - LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
     
     // END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

    // Common Validation conditions || 05-Sep-2019

    if ($.trim($(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val()) === "") {
      ValidateField($(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').attr("id"),"Please Select Currency Pair",thisTileFXO);
      return false;
    } else if ($.trim($(thisTileFXO).find('[id^="ContractAmtFXO"]').val()) === "" ||parseFloat($(thisTileFXO).find('[id^="ContractAmtFXO"]').val()) <= 0) {
      ValidateField($(thisTileFXO).find('[id^="ContractAmtFXO"]').attr("id"),"Please Enter Valid Contract Amount",thisTileFXO);
      return false;
    } else if ($.trim($(thisTileFXO).find('[id^="FXO_SoftTenorIp"]').val()) === "") { // Modified by LalitG@16May2024 || for enabling Soft Tenor entry || HSBCFXEINT-75
      ValidateField($(thisTileFXO).find('[id^="FXO_SoftTenorIp"]').attr("id"),"Please Enter Tenor",thisTileFXO);
      return false;
    } else if($(thisTileFXO).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase() === "PREMIUM"){
    
      if ($.trim($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, "")) === "" ||parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, "")) <= 0) {
        ValidateField($(thisTileFXO).find('[id^="FXO_Strike"]').attr("id"),"Please Enter Valid Strike Rate",thisTileFXO);
        return false;
      }
    } else if($(thisTileFXO).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase() === "STRIKE"){
      if ($.trim($(thisTileFXO).find('[id^="FXO_Premium"]').val().replace(/,/g, "")) === "" ||parseFloat($(thisTileFXO).find('[id^="FXO_Premium"]').val().replace(/,/g, "")) <= 0) {
        ValidateField($(thisTileFXO).find('[id^="FXO_Premium"]').attr("id"),"Please Enter Valid Premium",thisTileFXO);
        return false;
      }
    }

    // if($(thisTileFXO).find('[id^="FXO_Type"]').val().trim() != "Vanilla") { 
    //   validatebarrierFXO(thisTileFXO);
    // }
    //Validation END

    $(thisTileFXO).find('[id^="loader_FXO"]').show();
    $(thisTileFXO).find('[id^="btnBestPriceFXOption"]').attr("disabled", true);
  
    var delayInMilliseconds = 5000;
    calBestPriceForFXO(that);
  } catch (err) {
    console.log(err.message);
  }
}

// To get best price and display
function calBestPriceForFXO(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXO = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");    
    
    var tempPair = [];
    tempPair = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-");

    let barrierType = "";
    let barrierInXML ="";
    let knockInstyle = "";
    let knockOutstyle = "";
    var upperBarrier = 0;
    var lowerBarrier = 0;

    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla") {

      TemplateIDFXO = TemplateIDFXBarrier;
      TemplateCodeFXO = TemplateCodeFXBarrier;
      productIDFXO = productIDFXBarrier;
      prodCodeFXO = productCodeFXBarrier;

      // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      if ($(thisTileFXO).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {
        LPListFXO = LPListFXBarrier.split("|")[1];
      }else{
        LPListFXO = LPListFXBarrier.split("|")[0];
      }
      // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

      FXOProductName = ProductNameFXBarrier;       
      $(thisTileFXO).find('[id^="hdnFXOType"]').val(prodCodeFXO);
      _minQuoteTimeFXO = MinQuoteTimeOutFXBARRIER; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
      _maxQuoteTimeFXO = MaxQuoteTimeOutFXBARRIER; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023

    } else {

      TemplateIDFXO = TemplateIDFXVanilla;
      TemplateCodeFXO = TemplateCodeFXVanilla;
      productIDFXO = productIDFXVanilla;
      prodCodeFXO = productCodeFXVanilla;      

      // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      if ($(thisTileFXO).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {
        LPListFXO = LPListFXVanilla.split("|")[1];
      }else{
        LPListFXO = LPListFXVanilla.split("|")[0];
      }
      // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

      FXOProductName = ProductNameFXVanilla;
      $(thisTileFXO).find('[id^="hdnFXOType"]').val(prodCodeFXO);
      _minQuoteTimeFXO = MinQuoteTimeOutFXOPTION; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
      _maxQuoteTimeFXO = MaxQuoteTimeOutFXOPTION; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023

    }


    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() == "Vanilla") {
       
      barrierType = "";
      barrierInXML = "";
      knockInstyle = "";
      knockOutstyle = "";
      upperBarrier = 0;
      lowerBarrier = 0; 
      
    } else{

      // Start - Validation in case Double barriers | LGTGTWINT -1933 | Chaitanya M | 23 Aug 2023
      // validatebarrierFXO(thisTileFXO);

      if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {

        if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KI" || $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KO") {
  
          if($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === null ){
           
            ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Please Enter Valid Lower Barrier",thisTileFXO);
            return false;
  
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >= parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {
  
            ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Strike rate",thisTileFXO);            
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;            
  
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >= parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
  
            ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Spot rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
          }
  
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI" || $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "ERKI" || $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO") {
  
          if($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === null ){
              
            ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Please Enter Valid Upper Barrier",thisTileFXO);
            return false;
          
          }else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "")) <= parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {
  
            ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Strike rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
              
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "")) <= parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
            
            ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Spot rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
          
          }
          
        }else if(
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KO" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KI" ||
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KI" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KO" ||
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "E-RKI+KO" 
        ){
            // Validation for Lower Barrier in case of Double barriers.
          if($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === null ){
           
            ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Please Enter Valid Lower Barrier",thisTileFXO);
            return false;
  
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >=parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {
  
            ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Strike rate",thisTileFXO);            
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
  
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >=parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
  
            ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Spot rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
          }
          //End
  
          // Validation for Upper Barrier in case of Double barriers.
          if($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === null ){
          
            ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Please Enter Valid Upper Barrier",thisTileFXO);
            return false;
          
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]')[0].value.replace(/,/g, "")) <= parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {
              
            ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Strike rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
            
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "")) <=parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
            
            ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Spot rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
  
          }
          //End                  
        }
        
      }else{
  
        // Validation FXO - PUT|| 05-Sep-2019
        if ( $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KI" || $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KO") {
            
          if($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === null ){
          
            ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Please Enter Valid Upper Barrier",thisTileFXO);
            return false;
          
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]')[0].value.replace(/,/g, "")) <= parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {
              
            ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Strike rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
            
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "")) <= parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
           
            ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Spot rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
  
          }
  
        } else if (
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI" ||
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "ERKI" ||
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO"
        ) {
  
          if($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === null ){
  
            ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Please Enter Valid Lower Barrier",thisTileFXO);
            return false;
            
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >= parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {
            
            ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Strike rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
              
          }else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >= parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
              
            ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Spot rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;          
            
          } 
  
        }
        // START - Validation in case Double barriers | LGTGTWINT -1933 | Chaitanya M | 23 Aug 2023
        else if(
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KO" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KI" ||
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KI" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KO" ||
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "E-RKI+KO" 
        ){
  
          // Validation for Lower Barrier in case of Double barriers.
          if($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === null ){
           
            ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Please Enter Valid Lower Barrier",thisTileFXO);
            return false;
  
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >=parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {
  
            ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Strike rate",thisTileFXO);            
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;            
  
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >=parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
  
            ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Spot rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
          }
          //End
  
          // Validation for Upper Barrier in case of Double barriers.
          if($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === null ){
          
            ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Please Enter Valid Upper Barrier",thisTileFXO);
            return false;
          
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]')[0].value.replace(/,/g, "")) <=parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {
              
            ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Strike rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
            
          } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "")) <=parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
           
            ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Spot rate",thisTileFXO);
            $(thisTileFXO).find('[id^="loader_FXO"]').hide();
            $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
            return false;
  
          }
          //End
          
        }     
  
      }
      // End - Validation in case Double barriers | LGTGTWINT -1933 | Chaitanya M | 23 Aug 2023
      
      // Start - Validation in case Double barriers | LGTGTWINT -1933 | Chaitanya M | 23 Aug 2023
      //setBarrierValues(thisTileFXO); // Reverted the function change as 
      if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {

        if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KI") {
      
          barrierType = clientConfigdata.FXO.barrierType_KI_Put;
          knockInstyle = clientConfigdata.FXO.knockInstyle_KI;
          barrierInXML = "Knock-In";
          knockOutstyle = "";
          upperBarrier = 0;
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KO") {
       
          barrierType = clientConfigdata.FXO.barrierType_KO_Put;
          barrierInXML = "Knock-Out";
          knockInstyle = "";
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_KO;
          upperBarrier = 0;
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI") {
     
          barrierType = clientConfigdata.FXO.barrierType_RKI_Put;
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          barrierInXML = "Reverse Knock-In";
          knockOutstyle = "";
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "ERKI") {
       
          barrierType = clientConfigdata.FXO.barrierType_ERKI_Put;
          barrierInXML = "European Reverse Knock-In";
          knockInstyle = clientConfigdata.FXO.knockInstyle_ERKI;
          knockOutstyle = "";
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO") {
       
          barrierType = clientConfigdata.FXO.barrierType_RKO_Put;
          barrierInXML = "Reverse Knock-Out";
          knockInstyle = "";
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KO") { 
          
          barrierType = clientConfigdata.FXO.barrierType_ERKIKO_Put;
          barrierInXML = "RKI+KO";
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");      
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KI") { 
          
          barrierType = clientConfigdata.FXO.barrierType_RKIKI_Put;
          barrierInXML = "RKI+KI";
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = "";
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");   
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KI") { 
          
          barrierType = clientConfigdata.FXO.barrierType_RKOKI_Put;
          barrierInXML = "RKO+KI";
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_KO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");  
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KO") { 
          
          barrierType = clientConfigdata.FXO.barrierType_RKOKO_Put;
          barrierInXML = "RKO+KO";
          knockInstyle = "";
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, ""); 
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "EKI") { 
          
          barrierType = clientConfigdata.FXO.barrierType_EKI_Put;
          barrierInXML = "European Knock-In";
          knockInstyle = clientConfigdata.FXO.knockInstyle_ERKI;
          knockOutstyle = "";
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");
          upperBarrier = 0;       
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "E-RKI+KO") { 
          
          barrierType = clientConfigdata.FXO.barrierType_ERKIKO_Put;
          barrierInXML = "E-RKI+KO";
          knockInstyle = clientConfigdata.FXO.knockInstyle_ERKI;
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");          
    
        } 
  
      }
      else{
  
        if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KI") { 
      
          barrierType = clientConfigdata.FXO.barrierType_KI_Put;
          barrierInXML = "Knock-In";
          knockInstyle = clientConfigdata.FXO.knockInstyle_KI;
          knockOutstyle = "";
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KO") { 
       
          barrierType = clientConfigdata.FXO.barrierType_KO_Put;
          barrierInXML = "Knock-Out";
          knockInstyle = "";
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_KO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI") { 
     
          barrierType = clientConfigdata.FXO.barrierType_RKI_Put;
          barrierInXML = "Reverse Knock-In";
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = "";
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");
          upperBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "ERKI") { 
       
          barrierType = clientConfigdata.FXO.barrierType_ERKI_Put;
          barrierInXML = "European Reverse Knock-In";
          knockInstyle = clientConfigdata.FXO.knockInstyle_ERKI;
          knockOutstyle = "";
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");
          upperBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO") { 
       
          barrierType = clientConfigdata.FXO.barrierType_RKO_Put;
          barrierInXML = "Reverse Knock-Out";
          knockInstyle = "";
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");
          upperBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KO") { 
          
          barrierType = clientConfigdata.FXO.barrierType_ERKIKO_Put;
          barrierInXML = "RKI+KO";
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");       
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KI") { 
          
          barrierType = clientConfigdata.FXO.barrierType_RKIKI_Put;
          barrierInXML = "RKI+KI";
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = "";
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");            
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KI") { 
          
          barrierType = clientConfigdata.FXO.barrierType_RKOKI_Put;
          barrierInXML = "RKO+KI";
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_KO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");            
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KO") { 
          
          barrierType = clientConfigdata.FXO.barrierType_RKOKO_Put;
          barrierInXML = "RKO+KO";
          knockInstyle = "";
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");      
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "EKI") { 
          
          barrierType = clientConfigdata.FXO.barrierType_EKI_Put;
          barrierInXML = "European Knock-In";
          knockInstyle = clientConfigdata.FXO.knockInstyle_ERKI;
          knockOutstyle = "";
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = 0;       
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "E-RKI+KO") { 
          
          barrierType = clientConfigdata.FXO.barrierType_ERKIKO_Put;
          barrierInXML = "E-RKI+KO";
          knockInstyle = clientConfigdata.FXO.knockInstyle_ERKI;
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "");
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "");            
    
        }  
      }
    }
    // End - Validation in case Double barriers | LGTGTWINT -1933 | Chaitanya M | 23 Aug 2023

    // Check Added for Spot Rate||  06-Dec-2019

    if ($(thisTileFXO).find('[id^="FXObuySell"]').val().trim().toUpperCase() === "BUY") {// HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
      spotRateFXO = $(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, "").trim();
    } else {
      spotRateFXO = $(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[0].replace(/,/g, "").trim();
    }
    //END

    let CallPut ="";
    if($(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked){
      CallPut = "Put";
    }else{
      CallPut = "Call";
    }


   // Metal Pair check issues | Chaitanya M  | 27 Nov 2023
    // if($(thisTileFXO).find('[id^="hdnisMetalFX"]').val() === "Y"){

    //   _premCcy =  $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim();
    //   _InvccyFXO = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim();
      
    // }else{

    //   _premCcy =  $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim();
    //   _InvccyFXO = 

    // }

    // if( $(thisTileFXO).find('[id^="CcySelectionFXO"]').val() ===  $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim()){
    //   _AlternateCCy = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim();
    // }else{
    //   _AlternateCCy = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim();
    // }

    let _premCcy = "";
    let _InvccyFXO= "";
    let _AlternateCCy ="";
    
    if($(thisTileFXO).find('[id^="hdnisMetalFX"]').val() === "Y"){

      _premCcy =  $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim();
      _AlternateCCy = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim();
      _InvccyFXO = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim();

    }else{

      _premCcy =  $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim();

      if( $(thisTileFXO).find('[id^="CcySelectionFXO"]').val() ===  $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim()){    
        
        _AlternateCCy = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim();
        _InvccyFXO = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim();
        
      }else{

        _AlternateCCy = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim();
        _InvccyFXO = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim();
  
      }    
       
    } 
    
    // End Metal Pair check issues | Chaitanya M  | 27 Nov 2023
    
    let RMMarginperc = "";
    if($(thisTileFXO).find('[id^="UpfrontFXO"]').val() === "" || $(thisTileFXO).find('[id^="UpfrontFXO"]').val() === null || $(thisTileFXO).find('[id^="UpfrontFXO"]').val() === undefined){
      RMMarginperc = "0.00";
    }else{
      RMMarginperc = $(thisTileFXO).find('[id^="UpfrontFXO"]').val();
    }

    //Added for backsolve functionality | Chaitanya M | 16 may 2023
    let _strike="";
    let _premium="";
    let ShowRFSFXO = ""; // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 22 Nov 2023

    if($(thisTileFXO).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase() === "PREMIUM"){
  
      _strike = $(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, "");
      _premium = "0";
      ShowRFSFXO = isRFS ;  // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 22 Nov 2023

    }else{
 
      _strike = "0";
      _premium = $(thisTileFXO).find('[id^="FXO_Premium"]').val().replace(/,/g, "");
      ShowRFSFXO = isRFS === true ? false : isRFS;  // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 22 Nov 2023

    }
    
    //LGTGTWINT-2110 | Chaitanya M | 13 June 2023
    if(isRFS){
      timeoutFXO = parseInt(_minQuoteTimeFXO) - 1 ;
      $(thisTileFXO).find('[id^="hdntimerFX"]').val("");
      $(thisTileFXO).find('[id^="hdntimerFX"]').val(timeoutFXO);
    } 
    //End


    //RizwanS || LGTGTWINT-2261 || Develop delta hedge in Gateway || 08 Aug 2023

    let DeltahedgeType = "";
    let DeltaHedgeAmount = "";
    let DeltaHedgeRate = "";
    let CustomSpotRate = "";
    let CustomSpotYN = ""; 

    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() === "Vanilla") {

      if (clientConfigdata.CommonMethods.HEDGEPANELYN !== "N") {
      
        DeltahedgeType = $(thisTileFXO).find('[id^="FXOHedgeType"]').val();

        if(DeltahedgeType !== "NONE"){

          LPListFXO = "JPM"; //Hardcoded as disccused with SandhayaR || Only JPM supporting delta Hedge || RizwanS || 08 Aug 2023

          CustomSpotYN = $(thisTileFXO).find('[id^="FXOHedgeYN"]').val(); 
    
          if(CustomSpotYN === "YES"){
            CustomSpotRate = $(thisTileFXO).find('[id^="FXOCustomeSpot"]').val(); 
          }

        }
      }

    }

  //END

  // Start || HSBCFXEINT-107 : Enable fixing and maturity date | CM1025@17-May-2024
  let Tenor = "" 
  
  if(
    $(thisTileFXO).find('[id^="FXO_TenorDemo"]').val() == "" || 
    $(thisTileFXO).find('[id^="FXO_TenorDemo"]').val() == null || 
    $(thisTileFXO).find('[id^="FXO_TenorDemo"]').val() == undefined
  ){

    Tenor = $(thisTileFXO).find('[id^="hdnFXOTenorCode"]').val();

  } else {
    Tenor = $(thisTileFXO).find('[id^="FXO_TenorDemo"]').val();
  }
  // End || HSBCFXEINT-107 : Enable fixing and maturity date | CM1025@17-May-2024


    var XmlStringFXO =
      "<ExcelSheets><Sheet1>" +
      "<Product_Name>" + $(thisTileFXO).find('[id^="hdnFXOType"]').val().toUpperCase() +"</Product_Name>" +
      "<Hedging_x0020_Type>" +clientConfigdata.FXDCommonMethods.Hedging_Type +"</Hedging_x0020_Type>" +
      "<CustID>" + custID +"</CustID>" +
      "<Customer_Name>" + custName +"</Customer_Name>" +      
      "<Notional>" +$(thisTileFXO).find('[id^="ContractAmtFXO"]').val().replace(/,/g, "").split(".")[0] +"</Notional>" +  
      "<OptionType>" + CallPut +"</OptionType>" +
      "<OptionCut>" + $(thisTileFXO).find('[id^="Optioncutddl"]').val() +"</OptionCut>" +
      "<NonDeliveryYN>"+ $(thisTileFXO).find('[id^="hdnNDFFlagFX"]').val()  +"</NonDeliveryYN>" + // HSBCFXEINT-25 || Chaitanya M  || 24-Jan 2024  //HSBCFXEINT-25 || RizwanS || 14 Dec 2023
      "<CcyPair>" +$(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val() +"</CcyPair>" +
      "<AltCcy>" +_AlternateCCy +"</AltCcy>" +
      "<InvCcy>" + _InvccyFXO +"</InvCcy>" +
      "<PremiumCcy>" +_premCcy +"</PremiumCcy>" +
      "<CustPrem>0</CustPrem>" +
      "<Tenor>" + Tenor +"</Tenor>" +
      "<PremiumDate>" +$(thisTileFXO).find('[id^="hdnFXOPremiumDate"]').val() +"</PremiumDate>" +
      "<BuySell>" + $(thisTileFXO).find('[id^="FXObuySell"]').val().trim() +"</BuySell>" +
      "<FixingDate>" + $(thisTileFXO).find('[id^="hdnFXOFixing"]').val() +"</FixingDate>" +
      "<TradeDate>" + TradeDateFXO +"</TradeDate>" +
      "<SettDate>" + $(thisTileFXO).find('[id^="hdnFXOExpiry"]').val() +"</SettDate>" +
      "<TenorDays>" + $(thisTileFXO).find('[id^="hdnTenorDaysFXO"]').val() +"</TenorDays>" + 
      "<Spotrate>" + spotRateFXO +"</Spotrate>" +
      "<Strike>" + _strike +"</Strike>" +
      "<LowerBarrier>" + parseFloat(lowerBarrier) +"</LowerBarrier>" +
      "<UpperBarrier>" + parseFloat(upperBarrier) +"</UpperBarrier>" +
      "<Entity_ID>" + sessionStorage.getItem("HomeEntityID") +"</Entity_ID>" +
      "<CAI_ID>" + clientConfigdata.FXDCommonMethods.CAI_ID +"</CAI_ID>" +
      "<BarrierType>" + barrierInXML +"</BarrierType>" +
      "<TemplateID>" + TemplateIDFXO +"</TemplateID>" +
      //RizwanS || LGTGTWINT-2261 || Develop delta hedge in Gateway || 08 Aug 2023
      "<DeltahedgeType>" + DeltahedgeType + "</DeltahedgeType>" +
      "<DeltaHedgeAmount>" + DeltaHedgeAmount + "</DeltaHedgeAmount>" +
      "<DeltaHedgeRate>" + DeltaHedgeRate + "</DeltaHedgeRate>" +
      "<CustomSpotRate>" + CustomSpotRate + "</CustomSpotRate>" +
      "<UseCustomSpotRateYN>" + CustomSpotYN + "</UseCustomSpotRateYN>" +
      //END
      "</Sheet1></ExcelSheets>"; 

    mapleLoaderStart(thisTileFXO,'[id^="btnBestPriceFXOption"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

   request_getDataFromAPI(
    {
      ProductType: $(thisTileFXO).find('[id^="hdnFXOType"]').val().toUpperCase(),
      CurrencyPair: $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val(),
      DepositCurrency: $(thisTileFXO).find('[id^="CcySelectionFXO"]').val(),      
      PremCurrency: _premCcy,
      AlternateCurrency:  _AlternateCCy,
      SettlementCcy: _premCcy,    
      AmountInDepositCurrency: $(thisTileFXO).find('[id^="ContractAmtFXO"]').val().replace(/,/g, "").split(".")[0],   
      SolveFor : $(thisTileFXO).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase(), 
      BuySell: $(thisTileFXO).find('[id^="FXObuySell"]').val().trim().toUpperCase(),
      CallPut: CallPut,
      Strike: _strike,
      LowerBarrier: lowerBarrier,
      UpperBarrier: upperBarrier,
      BarrierType: barrierType,
      KnockIn_Style: knockInstyle,
      KnockOut_Style: knockOutstyle,
      OptionCut : $(thisTileFXO).find('[id^="Optioncutddl"]').val(),
      MarketPremium: "0",
      MarketPremiumAmount : _premium,  //Added for backsolve functionality | Chaitanya M | 16 may 2023
      RMMarginPercentage : RMMarginperc,
      Tenor: Tenor,
      TradeDate: TradeDateFXO,
      ValueDate: $(thisTileFXO).find('[id^="hdnFXOPremiumDate"]').val(),
      FixingDate: $(thisTileFXO).find('[id^="hdnFXOFixing"]').val(),
      MaturityDate: $(thisTileFXO).find('[id^="hdnFXOExpiry"]').val(),
      NDFFlag: $(thisTileFXO).find('[id^="hdnNDFFlagFX"]').val() ,// HSBCFXEINT-25 || Chaitanya M  || 24-Jan 2024
      IsMetal: $(thisTileFXO).find('[id^="hdnisMetalFX"]').val(),
      UserID: sessionStorage.getItem("Username"),
      EntityId: sessionStorage.getItem("HomeEntityID"),
      IndicativeQuote:'',
      Deal_Rate2: '',
      NoteMasterID : '',
      blnIsMultiLeg : true,
      InternalLPID: '',
      NotionalInPremCcy: '',
      PriceProviderDetails: LPListFXO, 
      CIF_Code: "",
      BTB_Protfolio_Code: "",
      Marketer_Code: "",
      Strategy_Code: "",     
      ExternalXMLString: XmlStringFXO,
      UseExternalXML_Source: true,
      TemplateCode: TemplateCodeFXO,
      TemplateID: TemplateIDFXO,
      ProductID: productIDFXO,
      CurrentTileID: TileId + "|" + $(thisTileFXO).find('[id^="hdnRequestID"]').val(),
      LoginID: sessionStorage.getItem("Username"),
      ProductCode: prodCodeFXO,
      RFQSource:"Instant_Pricer",
      RequestID: $(thisTileFXO).find('[id^="hdnRequestID"]').val(), // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      PriceMode:ShowRFSFXO,  // Added for SignalR Request || RizwanS || 28 April 2023 || // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 22 Nov 2023
      Mode:'',  
      DI_YN:'',
      KIType:'' ,
      Remark :'' ,
      CapLoss :'' ,
      DCDRFQID :'' ,
      GroupKey :'' ,
      Frequency :'' ,
      CapLossCcy :'' ,
      TargetType :'' ,
      PayAtStrike :'' ,
      AdjustmentYN :'' ,
      PricingModel :'' ,
      CapLossAmount :'' ,
      AdjustmentType :'' ,
      ResponseMethod: isRFS === true ? "RFS" : "", // Added Missing parameter for Dynamic pricing | Chaitanya M | 18 March 2024
      DIfromTradeIdea :'' ,
      Parant_DCDRFQID :'' ,
      StrikeAdjustment :'' ,
      CustomerPremAmount :'' ,
      GuaranteedLeverageYN :'' ,
      Bank_Prem_CashFlow_Direction :'' ,
      Target:'' ,
      _requestID: $(thisTileFXO).find('[id^="hdnRequestID"]').val(),

    },clientConfigdata.CommonMethods.NodeServer + "fxobestprice/GetFXOPriceFromExternalProvidersJSON","","POST",TileId +"|" + userName + '_' + 'getPriceFXOptions'  +'_' + RequestIDGenerator(6)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
    .then((data) => {

        thisTileFXO = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        let TileId = data.CurrentTileID; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023 

        if($(thisTileFXO).find('[id^="hdnRequestID"]').val() != data.CurrentTileID.split("|")[1]){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          return false;

         } //END

        //LGTGTWINT-2128 || RizwanS || 09 Jun 2023
       // let responseHeader = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.Status;

      //  let currentTile = TileId;

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
       
        let _dcdRFQID = "";
        if (responseHeader.toUpperCase() === "SUCCESS") {
          
          if (data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID !== null && data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID !== undefined) {
            const o_DCDRFQID = data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID;

            _dcdRFQID = o_DCDRFQID;
          }
        } 
        //END
       
        // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 22 Nov 2023
        if($(thisTileFXO).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase() === "PREMIUM"){

          // LGTGTWINT-1934 FXD | Dynamic pricing on Instant pricer || RizwanS || 20 May 2023        
          if(isRFS){

            if(responseHeader.toUpperCase() === "SUCCESS"){ // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 

              let _priceObj = data.dataFromAjax.oPriceResponseBody;

              //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              $(thisTileFXO).find('[id^="RFQIDFXD"]').html("");
              $(thisTileFXO).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);  //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              //End            

              if (_priceObj.length > 0) {

                $(thisTileFXO).find('[id^="hdnNMID"]').val(_priceObj[0].NoteMasterID); 
                $(thisTileFXO).find('[id^="hdno_DCDRFQID"]').val(_priceObj[0].o_DCDRFQID);

                let quoteString = "";
                for (i = 0;i < _priceObj.length;i++) {
                  let quoteId = _priceObj[i].quoteId;
                  quoteString += quoteString.length === 0 ? quoteId : "," + quoteId;
                }

                dictFXD[data.currentTile] = quoteString; //To add element in dictionary
                $(thisTileFXO).find('[id^="hdnPricesFXObj"]').val(JSON.stringify(data));
                $(thisTileFXO).find('[id^="hdnQuoteString"]').val(quoteString);
                callHub(quoteString,_maxQuoteTimeFXO);
  
                // START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
                setminimumtimoutFXO(_minQuoteTimeFXO, thisTileFXO,$(thisTileFXO).find('[id^="hdnRFSMinTimer"]')[0], data.requestID);       //  LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023                       
                startRFSTimerFXO(thisTileFXO, $(thisTileFXO).find('[id^="hdntimerInterval"]')[0], data.requestID);  //LGTGTWINT-2110 | Chaitanya M | 13 June 2023
                // End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
                
                return false;  

              }else{

                //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
                if(_dcdRFQID !== ""){
                  $(thisTileFXO).find('[id^="RFQIDFXD"]').html("");
                  $(thisTileFXO).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
                }
                //End
                MapPricesFXO(data,thisTileFXO);  // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 
              }

            }else{

            //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
            if(_dcdRFQID !== ""){
              $(thisTileFXO).find('[id^="RFQIDFXD"]').html("");
              $(thisTileFXO).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
            }
            //End 
              MapPricesFXO(data,thisTileFXO); //FXD || Dynamic pricing on Instant pricer || LGTGTWINT-1934 || RizwanS || 02 May 2023 
            //END
            }

          }else{
              //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
            if(_dcdRFQID !== ""){
              $(thisTileFXO).find('[id^="RFQIDFXD"]').html("");
              $(thisTileFXO).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
            }
            //End 
            MapPricesFXO(data,thisTileFXO); //FXD || Dynamic pricing on Instant pricer || LGTGTWINT-1934 || RizwanS || 02 May 2023 
          }//END

        }else{

          if(_dcdRFQID !== ""){
            $(thisTileFXO).find('[id^="RFQIDFXD"]').html("");
            $(thisTileFXO).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
          }
          
          MapPricesFXO(data,thisTileFXO);
        }
        // ENd - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 22 Nov 2023
            
    });
   } catch (error) {
      console.log(error.message); 
   }
}

// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
function startRFSTimerFXO(thisTileFXO, uniqueTimeoutID, requestID){
  try {
         
    //$(thisTileFXO).find('[id^="hdntimerInterval"]').val() = setInterval(function() {  
    uniqueTimeoutID.value = setInterval(function() {

     // Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
      if($(thisTileFXO).find('[id^="hdnRequestID"]').val() != requestID || $(thisTileFXO).find('[id^="hdnRequestID"]').val()===""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

       // mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false);
        return false;

      }
      // END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

      showtimerYNFXO="Y";        
        
      if(Number($(thisTileFXO).find('[id^="hdntimerFX"]').val())>=0) {  

        if($(thisTileFXO).find('[id^="hdnPrices"]').val() === "" || $(thisTileFXO).find('[id^="hdnPrices"]').val() === null || $(thisTileFXO).find('[id^="hdnPrices"]').val() === undefined ){

          $(thisTileFXO).find('[id^="TimerDiv"]').removeClass("Showtimer");      
          //$(thisTileFXO).find('[id^="SignalRTimer"]').html(Number($(thisTileFXO).find('[id^="hdntimerFX"]').val()));
          $(thisTileFXO).find('[id^="hdntimerFX"]').val(Number($(thisTileFXO).find('[id^="hdntimerFX"]').val()) - 1) ;
      
        }else{

          $(thisTileFXO).find('[id^="btnemailquote"]').attr("disabled", true);
          $(thisTileFXO).find('[id^="btnBookReqFXAQ"]').attr("disabled", true);
          $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);  

          $(thisTileFXO).find('[id^="TimerDiv"]').addClass("Showtimer");        
          $(thisTileFXO).find('[id^="SignalRTimer"]').attr('title', 'You can place order after '+ Number($(thisTileFXO).find('[id^="hdntimerFX"]').val())+ ' seconds.');               
          $(thisTileFXO).find('[id^="SignalRTimer"]').html(Number($(thisTileFXO).find('[id^="hdntimerFX"]').val()));
          $(thisTileFXO).find('[id^="hdntimerFX"]').val(Number($(thisTileFXO).find('[id^="hdntimerFX"]').val()) - 1) ;
          
        }

      }else{

        $(thisTileFXO).find('[id^="TimerDiv"]').removeClass("Showtimer");                      
        $(thisTileFXO).find('[id^="SignalRTimer"]').html(''); 
        $(thisTileFXO).find('[id^="btnemailquote"]').attr("disabled", false);
        $(thisTileFXO).find('[id^="btnBookReqFXAQ"]').attr("disabled", false);
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", false);    
        //stopRFSTimer(uniqueTimeoutID,thistile,"showtimerYNFXO");    
        
        clearInterval(uniqueTimeoutID.value);
        uniqueTimeoutID.value ="";

      }    

    },1000); 
 
  } catch (error) {
    
  }
}
// End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023

// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
function setminimumtimoutFXO(_minQuoteTimeFXO, thisTileFXO, _uniqueMinTimerid,_requestID){
  try {

    if($(thisTileFXO).find('[id^="hdnRequestID"]').val() != _requestID || $(thisTileFXO).find('[id^="hdnRequestID"]').val() === ""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

     // mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXAQ"]',false);
      return false;

    } 
   _uniqueMinTimerid.value = setTimeout(minQuoteTimeOccurredFXO,parseInt(_minQuoteTimeFXO) * 1000,thisTileFXO,$(thisTileFXO).find('[id^="hdnRFSMinTimer"]')[0],_requestID); // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
  } catch (error) {
    console.log(error.message); 
  }
}
// END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
function closetimerFXO(intervalid){
  try {
        
    clearTimeout(intervalid.value);
    showtimerYNFXO="N";
    

  } catch (error) {
    console.log(error.message);
  }
}
// End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023

//FXD || Dynamic pricing on Instant pricer || LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
function minQuoteTimeOccurredFXO(thistile,_uniqueMinTimerid, _requestID){
  try{

    MinQuoteTimeOutOccurredFXO = true;

    if($(thistile).find('[id^="hdnRequestID"]').val() != _requestID || $(thistile).find('[id^="hdnRequestID"]').val()===""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

     // mapleLoaderStop(thistile,'[id^="btnBestPriceFXOption"]',false);
      return false;

    }     

    if($(thistile).find('[id^="hdnsignalRMsgRecv"]').val().toUpperCase() === "YES"){ 
    
 
      mapleLoaderStop(thistile,'[id^="btnBestPriceFXOption"]',false);
      $(thistile).find('[id^="btnBestPriceFXOption"]').attr("disabled", false);
      $(thistile).find('[id^="btnemailquote"]').attr("disabled", false);
      $(thistile).find('[id^="btnBookReqFX"]').attr("disabled", false);
      $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", false);  
      $(thistile).find('[id^="hdnsignalRMsgRecv"]').val("NO");
      
      MinQuoteTimeOutOccurredFXO = false;
      UnsubcribeRFQID(thistile);
      clearInterval(_uniqueMinTimerid.value);
      _uniqueMinTimerid.value ="";

      // End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023

    }else{
      
      clearInterval(_uniqueMinTimerid.value);
      _uniqueMinTimerid.value ="";
      maxQuoteTimeOutRFSFXO(thistile, $(thistile).find('[id^="hdnRFSMaxTimer"]')[0],_requestID); // LGTGTWINT-2110 | Chaitanya M | 13 July 2023

    }
  
  }catch(error){
      console.log(error.message); 
    }
}
//End

//FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
 function maxQuoteTimeOutRFSFXO(thistile, _uniqueMaxTimerid, _requestID){
    try{
      MaxQuoteTimeOut = parseInt(_maxQuoteTimeFXO) - parseInt(_minQuoteTimeFXO);

      if($(thistile).find('[id^="hdnRequestID"]').val() != _requestID || $(thistile).find('[id^="hdnRequestID"]').val()===""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        mapleLoaderStop(thistile,'[id^="btnBestPriceFXAQ"]',false);
        return false;
  
      } 
      
      _uniqueMaxTimerid.value = setTimeout(() =>{ // LGTGTWINT-2110 | Chaitanya M | 13 July 2023    
  
        maxQuoteTimeOccurredFXO = true;
        // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023
  
        if($(thistile).find('[id^="hdnsignalRMsgRecv"]').val().toUpperCase() === "YES"){

          UnsubcribeRFQID(thistile);
          clearTimeout(_uniqueMaxTimerid.value);
          _uniqueMaxTimerid.value="";
          closetimerFXO(_uniqueMaxTimerid); // LGTGTWINT-2110 | Chaitanya M | 13 July 2023 
          
          $(thistile).find('[id^="btnBestPriceFXOption"]').attr("disabled", false);
          $(thistile).find('[id^="btnemailquote"]').attr("disabled", false);
          $(thistile).find('[id^="btnBookReqFX"]').attr("disabled", false);
          $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", false);  
          mapleLoaderStop(thistile,'[id^="btnBestPriceFXOption"]',false);
          $(thistile).find('[id^="hdnsignalRMsgRecv"]').val("NO");
          
        }else if($(thistile).find('[id^="hdnsignalRMsgRecv"]').val() === ""){  
          
          if($(thistile).find('[id^="hdnQuoteString"]').val() !== ""){ // LGTGTWINT-1934 || RizwanS || 05 Jun 2023 
            UnsubcribeRFQID(thistile);

            // Start- LGTGTWINT-2110 | Chaitanya M | 13 July 2023 
            clearTimeout(_uniqueMaxTimerid.value);
            _uniqueMaxTimerid.value="";
            closetimerFXO(_uniqueMaxTimerid);
            // End- LGTGTWINT-2110 | Chaitanya M | 13 July 2023

            $(thistile).find('[id^="btnBestPriceFXOption"]').attr("disabled", false);
            $(thistile).find('[id^="btnemailquote"]').attr("disabled", false);
            $(thistile).find('[id^="btnBookReqFX"]').attr("disabled", false);
            $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", false);  
            mapleLoaderStop(thistile,'[id^="btnBestPriceFXOption"]',false);

            if($(thistile).find('[id^="hdnRequestID"]').val() === _requestID){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
            
              ValidateField($(thistile).find('[id^="btnBestPriceFXOption"]').attr("id"),"No response received from remote system.",thistile);
            
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
        
//FXD | Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || RizwanS || 02 May 2023
function MapPricesFXO(data,thisTileFXO,isRFS){
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
    
    if(responseHeader.toUpperCase() === "SUCCESS"){         
      
      $(thisTileFXO).find('[id^="FXO_Banks"]').empty();
      $(thisTileFXO).find('[id^="FXO_PriceRow"]').empty();
      // Added by Atharva - Timers - START
      $(thisTileFXO).find('[id^="FXO_TimerRow"]').empty();
      // END

      let FXOdata = data.dataFromAjax.oPriceResponseBody;
      $(thisTileFXO).find('[id^="hdnPricesFXO"]').val(JSON.stringify(FXOdata));

      $(thisTileFXO).find('[id^="RFQFXO"]').val(JSON.stringify(FXOdata));
      if (JSON.parse($(thisTileFXO).find('[id^="hdnPricesFX"]').val())[0].provider === null || 
      JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val())[0].NoteMasterID === null || 
      JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val())[0].bestPriceProvider === "FAIL"
      ) {

        $(thisTileFXO).find('[id^="FXO_Banks"]').append("<td> - </td>");
        $(thisTileFXO).find('[id^="FXO_PriceRow"]').append("<td> - </td>");
        // Added by Atharva - Timers - START
        $(thisTileFXO).find('[id^="FXO_TimerRow"]').append("<td> - </td>");
        // END
         
        // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
        if(isRFS != true){
          $(thisTileFXO).find('[id^="btnBookReqFX"]').attr("disabled", false);  
          $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
          $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", false);
        }
        //End 
        return false;

      }else{
        
        var BestPP = JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val())[0].bestPriceProvider.split(":")[0];
        DCDRFQidFXO = JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val())[0].o_DCDRFQID;
        bestProviderFXO = JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val())[0].bestPriceProvider.split(":")[0];
        // Added by Atharva - Timers - START
        // Passing extra parameter to plotprice
        quoteidFXO = 
        PlotPrice(JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val()),
          JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val())[0].bestPriceProvider.split(":")[0],
          $(thisTileFXO).find('[id^="FXO_Banks"]'),
          $(thisTileFXO).find('[id^="FXO_PriceRow"]'),
          thisTileFXO, $(thisTileFXO).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase()
        ); //Added for Solve for check | Chaitanya M | 02 Aug 2023

        $(thisTileFXO).find('[id^="hdnQuoteIDFXO"]').val(quoteidFXO);
        // Added by Atharva - Timers - START
        if ( BestPP != "FAIL" && BestPP !== undefined && BestPP != "" && BestPP != null) {
          startTimers(data.CurrentTileID.split("|")[0]);
        }

        // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        $(thisTileFXO).find('[id^="FXO_Premium"]').val(parseFloat($(thisTileFXO).find('[id^="hdnIBPremFX"]').val()).toFixed(2));
        if($(thisTileFXO).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase() !== "PREMIUM"){ 

          $(thisTileFXO).find('[id^="FXO_Strike"]').val($(thisTileFXO).find('[id^="hdnClientStrikeFX"]').val());
          $(thisTileFXO).find('[id^="hdnStrikevalueFX"]').val($(thisTileFXO).find('[id^="hdnClientStrikeFX"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

        }
        // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

        // HSBCFXEINT-112 : Updating CounterParty Spot | Chaitanya M | 21-May-2024
        // ----------------------------------Start--------------------------------
        
        let AskspotFXO = $(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, "").trim();
        let BidSpotFXO = $(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[0].replace(/,/g, "").trim();
       
        if($(thisTileFXO).find('[id^="FXObuySell"]').val().trim().toUpperCase() === "BUY"){

          if(!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked){
            AskspotFXO = numberWithCommas(Number($(thisTileFXO).find('[id^="hdnSpotRateFX"]').val()));
          } else {
            BidSpotFXO = numberWithCommas(Number($(thisTileFXO).find('[id^="hdnSpotRateFX"]').val()));
          }

          $(thisTileFXO).find('[id^="rateFXO"]').html(BidSpotFXO + " / " + AskspotFXO);

        }else{
          
          if(!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked){
            BidSpotFXO = numberWithCommas(Number($(thisTileFXO).find('[id^="hdnSpotRateFX"]').val()));
          } else {
            AskspotFXO = numberWithCommas(Number($(thisTileFXO).find('[id^="hdnSpotRateFX"]').val()));
          }

          $(thisTileFXO).find('[id^="rateFXO"]').html(BidSpotFXO + " / " + AskspotFXO);

        }

        // HSBCFXEINT-112 : Updating CounterParty Spot | Chaitanya M | 21-May-2024
        // ----------------------------------End----------------------------------


      }

      if (JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val()) != null ||
        JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val()) !=undefined ||
        JSON.parse( $(thisTileFXO).find('[id^="hdnPricesFXO"]').val()).bestPriceProvider.split(":")[0] != "FAIL") {
      
        // drawgraphFXO($(thisTileFXO).find('[id^="canvas"]').attr("id"));

      }
      
      mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      if(isRFS != true){
        $(thisTileFXO).find('[id^="btnBookReqFX"]').attr("disabled", false);  
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", false);
      }
      //End

    }else if(data.dataFromAjax === null){

      // if(data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != null || data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != ""){
       
      //   _failedreason = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason;

      //   ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), _failedreason, thisTileFXO); 
      
      // }else{
       
        _failedreason = "Pricing Failed!";

        ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), _failedreason, thisTileFXO); 
      
      // }

    }//LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023      
    else if(data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider === null ||
      data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider === ""){
    
        if(data.dataFromAjax.oPriceResponseBody[0].errorMessage === null || data.dataFromAjax.oPriceResponseBody[0].errorMessage === ''){
          
          _failedreason = "Pricing Failed!";

          ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), _failedreason, thisTileFXO); 

        }else{

          failReason = data.dataFromAjax.oPriceResponseBody[0].errorMessage;

          if(failReason.includes("Aborting further Migration")){
  
            _failedreason = failReason.replace(". Aborting further Migration for this record.","");  

            ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), _failedreason, thisTileFXO); 
  
          } else{
  
            _failedreason = failReason;

            ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), _failedreason, thisTileFXO); 
  
          }

        } 

        if(isRFS != true){
          $(thisTileFXO).find('[id^="btnBookReqFX"]').attr("disabled", false);  
          $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
          $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", false);
        }
        
        //End 
    } else if(data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider.includes("FAIL")) {//LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 
      // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
      //if(data.dataFromAjax.oPriceResponseBody[0].errorMessage === null || 
      //  data.dataFromAjax.oPriceResponseBody[0].errorMessage === ''){
    
        $(thisTileFXO).find('[id^="FXO_Banks"]').append("<td> - </td>");
        $(thisTileFXO).find('[id^="FXO_PriceRow"]').append("<td> - </td>");
        // Added by Atharva - Timers - START
        $(thisTileFXO).find('[id^="FXO_TimerRow"]').append("<td> - </td>");

        // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
        ValidateField($(thisTileFXO).find('[id^="btnBestPriceFXOption"]').attr("id"),"No response received from remote system.",thisTileFXO);
      
        //LGTGTWINT-1740 | Chaitanya M | 05 June 2023
        //$(thisTileFXO).find('[id^="FXDRfqidpnl"]').show();
        $(thisTileFXO).find('[id^="RFQIDFXD"]').html("");
        $(thisTileFXO).find('[id^="RFQIDFXD"]').html("RFQ ID : " + data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID);  
        //End

       // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
       if(isRFS != true){
        $(thisTileFXO).find('[id^="btnBookReqFX"]').attr("disabled", false);  
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", false);
      }
      //End 
      // }else{
      //   failReason = data.dataFromAjax.oPriceResponseBody[0].errorMessage; //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 
      //   if(failReason.includes("Aborting further Migration")){
      //     _failedreason = failReason.replace(". Aborting further Migration for this record.","");    
      //     ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), _failedreason, thisTileFXO);    
      //   } else{
      //     _failedreason = failReason;
      //     ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), _failedreason, thisTileFXO); 
      //   }
      // }   
      // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
      //  $(thisTileFXO).find('[id^="btnBookReqFX"]').attr("disabled", false);  
      //  $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
      //  $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", false);        
      //End
    }
     
    mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023   
    $(thisTileFXO).find('[id*="btnBestPriceFXOption"]').attr("disabled", false);  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    
    // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 
    // Start
    if(MinQuoteTimeOutOccurredFXO === true){
     
      UnsubcribeRFQID(thisTileFXO);
      closetimerFXO($(thisTileFXO).find('[id^="hdnRFSMinTimer"]')[0]);
      MinQuoteTimeOutOccurredFXO = false;
      mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',false);
      $(thisTileFXO).find('[id^="hdnsignalRMsgRecv"]').val("YES");
      $(thisTileFXO).find('[id^="btnBookReqFX"]').attr("disabled", false);  
      $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
      $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", false);
    }
    // End

  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message());
  } finally {
  }
} 

// To get currency rates
function getCurrencyFXORate(currId,iscloned) {
  try {
    thisTileFXO = document.getElementById("td" + currId);
    // Addded for CFINT-992 // 18-Sep-2020 //

    checkmetalccyflagFXO(currId,$(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val())

    $(thisTileFXO).find('[id^="btnBestPriceFXOption"]').attr("disabled", true);

    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() != "Vanilla") {
      prodCodeFXO = productCodeFXBarrier;
      productIDFXO = productIDFXBarrier;
    } else {
      prodCodeFXO = productCodeFXVanilla;
      productIDFXO = productIDFXVanilla;
    }

    $(thisTileFXO).find('[id^="hdnCcyDetailsFXO"]').val($(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val()); // Select Ccy Should Auto Populate Spot & Strike| Chaitanya M | 02 Dec 2023

    //END
    request_getDataFromAPI(
    {
      "StandardPair": $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val(),
      "EntityID": EntityID,
      "UserID": userName,
      "ProductCode": prodCodeFXO, 
      "Mode" : "SEN",
      "CurrentTileID":currId + "|" + "",
      // "RequestID": currId +"|" + userName + '_' + 'BidAskRate'  +'_' + RequestIDGenerator(6), //modified by Chaitanya M, LGTGTWINT-1850 | 13-april-23
    },
    clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/BidAskRate","","POST",currId +"|" + userName + '_' + 'BidAskRate'  +'_' + RequestIDGenerator(6))// RizwanS || HSBCFXEINT-6 || 06 Nov 2023
    .then((data) => {
      
      thisTileFXO = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

      let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

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

      if(responseHeader.toUpperCase() === "SUCCESS"){

        AskRateFXO = numberWithCommas(Number(data.dataFromAjax.AskRate).toFixed(data.dataFromAjax.PointShift));
        
        BidRateFXO = numberWithCommas(Number(data.dataFromAjax.BidRate).toFixed(data.dataFromAjax.PointShift));

        $(thisTileFXO).find('[id^="hdnDecimalRateFXO"]').val(data.dataFromAjax.PointShift);

        $(thisTileFXO).find('[id^="rateFXO"]').html(BidRateFXO + " / " + AskRateFXO);

         //Added by RizwanS || LGTGTWINT-2322 || 22 Aug 2023
        if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){
          
          if(MaxQuoteTimeOutFXBARRIER === "" || MinQuoteTimeOutFXBARRIER === ""){
            getProductConfigsFXD(productIDFXBarrier,productCodeFXBarrier);
          }
          if(LPListFXBarrier === ""){
            LPListFXBarrier = getasyncFXDLP(productIDFXBarrier, productCodeFXBarrier);
          }
        }else{
          if(MaxQuoteTimeOutFXOPTION === "" || MinQuoteTimeOutFXOPTION === ""){
            getProductConfigsFXD(productIDFXVanilla,productCodeFXVanilla); 
          }
          if(LPListFXVanilla === ""){
            LPListFXVanilla = getasyncFXDLP(productIDFXVanilla, productCodeFXVanilla);
          }
        }
        //END
                 
        if($(thisTileFXO).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase() === "PREMIUM"){
          if ($(thisTileFXO).find('[id^="FXObuySell"]').val().toUpperCase() === "BUY") {
            if(iscloned !== true){        
              if(_addtileflag === true ){          

                if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {

                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){                    
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                     
                  }
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(AskRateFXO);

                } else {

                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                     
                  }                  
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO);

                }
                _addtileflag= false;

              }else if(_defaultflagFXO === true){
                //LGTGTWINT-1778 KO rate should not auto populated on changing ccy pair || Chaitanya M | 31 March 2023
                if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {
                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){                
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                 
                  }
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(AskRateFXO);
                } else {
                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                 
                  }              
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO);
                } 
                //End        
                _defaultflagFXO = false;
              }else if (!_UpdateFlagFXO){
                // Start - LGTCLI-422 | Chaitanya M | 5 May 2023
                if($(thisTileFXO).find('[id^="FXO_Strike"]').val() === ""){

                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(AskRateFXO);
                  
                }  
                //End       
              _UpdateFlagFXO=false;
              
              }else if(_UpdateFlagFXO){ 

                // Start - LGTCLI-422 | Chaitanya M | 5 May 2023
                if(_eventstrikechangeFXO === true){
                  _eventstrikechangeFXO = false;
                }else if($(thisTileFXO).find('[id^="FXO_Strike"]').val() === ""){
                  
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(AskRateFXO);
                   
                }
                //end
                _UpdateFlagFXO=false;

              }else if(_addtileflag === true && iscloned === true){  
                if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {
                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){                
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                 
                  }
                } else {
                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                 
                  }              
                } 
              }else{
                if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {
                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){                
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                 
                  }
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(AskRateFXO);
                } else {
                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                 
                  }              
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO);
                }                    
              } 
            }
          } else {            
            if(iscloned !== true){ 
              if(_addtileflag === true){

                if(!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {

                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){        

                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");   

                  }

                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO);  

                }else{

                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){        

                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");   

                  }
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO); 

                }
                _addtileflag= false;
              }else if(_defaultflagFXO === true){

                if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {
                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){                
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                 
                  }
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO);
                } else {
                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                 
                  }              
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(AskRateFXO);
                } 
                //End        
                _defaultflagFXO = false;
              }else if (!_UpdateFlagFXO){
                // Start - LGTCLI-422 | Chaitanya M | 5 May 2023
                if($(thisTileFXO).find('[id^="FXO_Strike"]').val() === ""){

                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO);
                  
                }  
                //End       
                _UpdateFlagFXO=false;
              
              }else if(_UpdateFlagFXO){ 
                
                // Start - LGTCLI-422 | Chaitanya M | 5 May 2023
                if(_eventstrikechangeFXO === true){
                  _eventstrikechangeFXO = false;
                }else if($(thisTileFXO).find('[id^="FXO_Strike"]').val() === ""){                  
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO);
                }
                //end
                _UpdateFlagFXO=false;

              }else if(_addtileflag === true && iscloned === true){  
                if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {
                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){                
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                 
                  }
                } else {
                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                 
                  }              
                } 
              }else{
                if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {
                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){                
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                 
                  }
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(BidRateFXO);
                } else {
                  if($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla"){
                    $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(""); 
                    $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");                 
                  }              
                  $(thisTileFXO).find('[id^="FXO_Strike"]').val(AskRateFXO);
                }   
              }              
            }
          }
        } 
        
        // Addded for CFINT-992 // 18-Sep-2020 //

        $(thisTileFXO).find('[id^="btnBestPriceFXOption"]').attr("disabled", false);

        //END
        // Added for Clone action does not clone first fixing date. | Chaitanya M | 01 Aug 2023
        if(iscloned !== true){
          OptionCutListFXO = setasyncOptioncutFXD(currId, $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val(), productIDFXO, prodCodeFXO, "FXOSEN");

   
          fillDropdownlistControl(OptionCutListFXO, $(thisTileFXO).find('[id^="Optioncutddl"]').attr('id'));

          fillDatesFXO(
            $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val(),
            $(thisTileFXO).find('[id^="FXO_TenorDemo"]').val(),
            currId
          ); 

          // fillFirstFixingDateFXO(
          //   $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val(),
          //   $(thisTileFXO).find('[id^="FXO_TenorDemo"]').val(),
          //   currId
          // ); // Commented by RizwanS || For FXOPtion need to remove first fixing date API call, as it is not used || 27 Jul 2023

        }
        
      }else {

       // let failReason = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.FailedReason; 
       let failReason = "No response received from remote system.";
      
        ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), failReason, thisTileFXO);

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
function setNDFMetalFlagFXO(currId, 
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
    thisTileFXO = document.getElementById("td" + currId);

    let _FXOCcylist = "";
    let _FXOCcy="";

    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() != "Vanilla") {
      productIDFXO = productIDFXBarrier;
      prodCodeFXO = productCodeFXBarrier;
      _FXOCcylist = sessionStorage.getItem("CCYListFXBarrier");
      _FXOCcy = JSON.parse(_FXOCcylist);
    } else {
      productIDFXO = productIDFXVanilla;
      prodCodeFXO = productCodeFXVanilla;
      _FXOCcylist = sessionStorage.getItem("CCYListFXVanilla");
      _FXOCcy = JSON.parse(_FXOCcylist);
    }

    let fxDayBasis =_FXOCcy[_FXOCcy.findIndex((res) => res.asset_Pair === CcyPair)].asset2_Year_Basis;

      $(thisTileFXO).find('[id^="hdnCcyPairDataFXO"]').val(
        JSON.stringify(_FXOCcy[ _FXOCcy.findIndex((res) => res.asset_Pair === CcyPair)])
      );

    let notionalddlId = '[id^="CcySelectionFXO"]';
    let hdnpairDataId = '[id^="hdnCcyPairDataFXO"]';
    let notioanlamtId = '[id^="ContractAmtFXO"]';

    checkDecimalPlaces(
      thisTileFXO,
      notionalddlId,
      hdnpairDataId,
      notioanlamtId
    );

    // getNumberOfFixingFXO(
    //   currId,  
    //   CcyPair,
    //   DepoCcy,
    //   AltCcy,
    //   getFrqFix,
    //   getSetlfrq,
    //   getPremiumDate,
    //   getFinalFixingDate,
    //   getSettlementDate,
    //   fxDayBasis
    // );         
    
  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message());
  }
}

function getNumberOfFixingFXO(
  currId,
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

    thisTileFXO = document.getElementById("td" + currId);

    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() != "Vanilla") {
      productIDFXO = productIDFXBarrier;
      prodCodeFXO = productCodeFXBarrier;
      _FXOCcylist = sessionStorage.getItem("CCYListFXBarrier");
      _FXOCcy = JSON.parse(_FXOCcylist);
    } else {
      productIDFXO = productIDFXVanilla;
      prodCodeFXO = productCodeFXVanilla;
      _FXOCcylist = sessionStorage.getItem("CCYListFXVanilla");
      _FXOCcy = JSON.parse(_FXOCcylist);
    }

    request_getDataFromAPI(
      {

        "EntityID": EntityID,
        "LoginID": userName,
        "token": "",
        "ProductCode": prodCodeFXO,
        "ProductID": productIDFXO,
        "CcyPair": CcyPair,
        "DayBasis": getfxDayBasis,
        "DepoCcy": DepoCcy,
        "AltCcy": AltCcy,
        "FixingFreq": setFrqFix,
        "SettlementFreq": SetSetlfrq,
        "TradeDate": setBusinessDate,
        "PremiumDate": getPremiumDate,
        "FinalFixingDate": getFinalFixingDate,
        "SettlementDate": getSettlementDate,
        // "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "OptionCut": $(thisTileFXO).find('[id^="Optioncutddl"]').val(),
        "CurrentTileID": currId + "|" + "",
      },
      clientConfigdata.CommonMethods.NodeServer + "GetNumberofFixings","","POST",currId +"|" + userName + '_' + 'GetNumberofFixings'  +'_' + RequestIDGenerator(6)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        let thisTileFXO = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let TileId =  data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let responseHeader = data.GetNumberofFixingsResult.A_ResponseHeader.Status;

        if(responseHeader.toUpperCase() === "SUCCESS"){

        $(thisTileFXO).find('[id^="hdnFXONoOfFixingDate"]').val(data.GetNumberofFixingsResult.FixingData.FirstFixingDate);

        $(thisTileFXO).find('[id^="hdnFXONoOfFixings"]').val(data.GetNumberofFixingsResult.FixingData.NoofFixingAQs);

        $(thisTileFXO).find('[id^="btnBestPriceFXOption"]').attr("disabled", false);        

        }else {

          let failReason = data.GetNumberofFixingsResult.A_ResponseHeader.FailedReason; 
          
          ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), failReason, thisTileFXO);

           // Need to uncomment after no.of fixing issue resolved.

      }  
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);     
  }
}
//END

function checkmetalccyflagFXO(currId, CcyPair) {
  try {

    let thisTileFXO = document.getElementById("td" + currId);

    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() != "Vanilla") {      
      _listCcyFXO = sessionStorage.getItem("CCYListFXBarrier"); 
    } else { 
      _listCcyFXO = sessionStorage.getItem("CCYListFXVanilla");
    }

    let _CcyFXO = JSON.parse(_listCcyFXO);     

    if (
      _CcyFXO[_CcyFXO.findIndex((res) => res.asset_Pair === CcyPair)].lcY_Type.toUpperCase() === "NDF" ||
      _CcyFXO[_CcyFXO.findIndex((res) => res.asset_Pair === CcyPair)].rcY_Type.toUpperCase() === "NDF"
    ) {
      NDFFlagFXO = "Y";
      IsMetalFXO = "N";
      $(thisTileFXO).find('[id^="CcySelectionFXO"]').attr("disabled", false); 
      isccymetalflagFXO = false; 
      $(thisTileFXO).find('[id^="FXDCCYiconFXO"]').removeClass("ccytoggle");
     
    } else if (
      _CcyFXO[_CcyFXO.findIndex((res) => res.asset_Pair === CcyPair)].lcY_Type.toUpperCase() === "METAL" || 
      _CcyFXO[_CcyFXO.findIndex((res) => res.asset_Pair === CcyPair)].rcY_Type.toUpperCase() === "METAL"
    ) {
      NDFFlagFXO = "N";
      IsMetalFXO = "Y";
      $(thisTileFXO).find('[id^="CcySelectionFXO"]').attr("disabled", true);   
      isccymetalflagFXO = true; 
      $(thisTileFXO).find('[id^="FXDCCYiconFXO"]').addClass("ccytoggle"); 
      
    } else {
      NDFFlagFXO = "N";
      IsMetalFXO = "N";
      $(thisTileFXO).find('[id^="CcySelectionFXO"]').attr("disabled", false); 
      isccymetalflagFXO = false; 
      $(thisTileFXO).find('[id^="FXDCCYiconFXO"]').removeClass("ccytoggle");
      
    }  

    $(thisTileFXO).find('[id^="hdnisMetalFX"]').val(IsMetalFXO);
    $(thisTileFXO).find('[id^="hdnNDFFlagFX"]').val(NDFFlagFXO);  // HSBCFXEINT-25 - NDF flag are going blank || Chaitanya M  || 24-Jan 2024 
    
  } catch (error) {
    console.log(error.message);
  }
}

function checkbarriertype(thisTileFXO,iscloned) {
  try {
    
    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() !== "Vanilla") {

      if(iscloned){
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').removeClass("SHowSOlveFor"); 
        $(thisTileFXO).find('[id^="isVanilla"]').removeClass("SHowSOlveFor"); 
        $(thisTileFXO).find('[id^="lblBarrierType"]').removeClass("SHowSOlveFor");

        if (clientConfigdata.CommonMethods.HEDGEPANELYN == "N") {
          $(thisTileFXO).find('[id^="FXOHedgepanel"]').addClass("showHedgePanel");
        }
      }

      if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {
        if(
          // START - LGTGTWINT-1933 Changes for Barrier Types | Chaitanya M | 23 Aug 2023
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KI" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KO" ||
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "EKI" 
          // END - LGTGTWINT-1933 Changes for Barrier Types | Chaitanya M | 23 Aug 2023
        ){

          $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').prop("disabled", true);
          $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').prop("disabled", false);
          if(iscloned === true){

          }else{
            $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");
          }
          

        }else if(
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "ERKI"
        ){

          $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').prop("disabled", false);
          $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').prop("disabled", true);
          if(iscloned === true){

          }else{
            $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val("");
          }

        // Start - LGTGTWINT-1933 Changes for Barrier Types | Chaitanya M | 23 Aug 2023
        } else if($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KO" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KI" ||
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KI" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KO" ||
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "E-RKI+KO" 
        ){

          $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').prop("disabled", false);
          $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').prop("disabled", false);
          if(iscloned === true){

          }else{
            $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");
            $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val("");
          }
        // End - LGTGTWINT-1933 Changes for Barrier Types | Chaitanya M | 23 Aug 2023
        }

      } else {

        if( 
          // START - LGTGTWINT-1933 Changes for Barrier Types | Chaitanya M | 23 Aug 2023
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KI" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KO" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "EKI"   
          // END - LGTGTWINT-1933 Changes for Barrier Types | Chaitanya M | 23 Aug 2023
        ){

          $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').prop("disabled", false);
          $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').prop("disabled", true);
          if(iscloned === true){

          }else{
            $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val("");
          }

        }else if(
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "ERKI"
        ){

          $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').prop("disabled", true);
          $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').prop("disabled", false);
          if(iscloned === true){

          }else{
            $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");
          }

        // START - LGTGTWINT-1933 Changes for Barrier Types | Chaitanya M | 23 Aug 2023
        }else if(
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KO" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KO" ||
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KI" || 
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KI" ||
          $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "E-RKI+KO" 
        ){

          $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').prop("disabled", false);
          $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').prop("disabled", false);
          if(iscloned === true){

          }else{
            $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");
            $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val("");
          }
          // END -  LGTGTWINT-1933 Changes for Barrier Types | Chaitanya M | 23 Aug 2023
        }
      }
    }else{
      $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').prop("disabled", true);
      $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').prop("disabled", true);
      if(iscloned === true){

      $(thisTileFXO).find('[id^="FXBarrier_Type"]').addClass("SHowSOlveFor");
      $(thisTileFXO).find('[id^="isVanilla"]').addClass("SHowSOlveFor"); 
      $(thisTileFXO).find('[id^="lblBarrierType"]').addClass("SHowSOlveFor"); 

      if (clientConfigdata.CommonMethods.HEDGEPANELYN == "N") {
      
        $(thisTileFXO).find('[id^="FXOHedgepanel"]').removeClass("showHedgePanel"); 

        if($(thisTileFXO).find('[id^="FXOHedgeType"]').val().trim() === "NONE"){
          $(thisTileFXO).find('[id^="FXOHedgeTypelbl"]').addClass("showhideCustomspot");
          $(thisTileFXO).find('[id^="FXOCustomeSpot"]').addClass("showhideCustomspot");
        }else{
          $(thisTileFXO).find('[id^="FXOHedgeTypelbl"]').removeClass("showhideCustomspot");
          $(thisTileFXO).find('[id^="FXOCustomeSpot"]').removeClass("showhideCustomspot");

          if($(thisTileFXO).find('[id^="FXOHedgeYN"]').val().trim() === "YES"){
            $(thisTileFXO).find('[id^="FXOCustomeSpot"]').attr("disabled", false);
          }else{
            $(thisTileFXO).find('[id^="FXOCustomeSpot"]').attr("disabled", true);
          }

        }

      }

      }else{
        $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val("");
        $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val("");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}
// Start - Validation in case Double barriers | LGTGTWINT -1933 | Chaitanya M | 23 Aug 2023
function validatebarrierFXO(thisTileFXO){
  try {    
    if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {

      if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KI" || $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KO") {

        if($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === null ){
         
          ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Please Enter Valid Lower Barrier",thisTileFXO);
          return false;

        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >= parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {

          ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Strike rate",thisTileFXO);            
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;            

        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >= parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {

          ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Spot rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;
        }

      } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI" || $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "ERKI" || $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO") {

        if($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === null ){
            
          ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Please Enter Valid Upper Barrier",thisTileFXO);
          return false;
        
        }else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "")) <= parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {

          ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Strike rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;
            
        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "")) <= parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
          
          ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Spot rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;
        
        }
        
      }else if(
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KO" || 
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KI" ||
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KI" || 
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KO" ||
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "E-RKI+KO" 
      ){
          // Validation for Lower Barrier in case of Double barriers.
        if($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === null ){
         
          ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Please Enter Valid Lower Barrier",thisTileFXO);
          return false;

        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >=parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {

          ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Strike rate",thisTileFXO);            
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;

        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >=parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {

          ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Spot rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;
        }
        //End

        // Validation for Upper Barrier in case of Double barriers.
        if($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === null ){
        
          ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Please Enter Valid Upper Barrier",thisTileFXO);
          return false;
        
        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]')[0].value.replace(/,/g, "")) <= parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {
            
          ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Strike rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;
          
        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "")) <=parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
          
          ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Spot rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;

        }
        //End                  
      }
      
    }else{

      // Validation FXO - PUT|| 05-Sep-2019
      if ( $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KI" || $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KO") {
          
        if($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === null ){
        
          ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Please Enter Valid Upper Barrier",thisTileFXO);
          return false;
        
        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]')[0].value.replace(/,/g, "")) <= parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {
            
          ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Strike rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;
          
        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "")) <= parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
         
          ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Spot rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;

        }

      } else if (
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI" ||
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "ERKI" ||
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO"
      ) {

        if($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === null ){

          ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Please Enter Valid Lower Barrier",thisTileFXO);
          return false;
          
        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >= parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {
          
          ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Strike rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;
            
        }else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >= parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
            
          ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Spot rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;          
          
        } 

      }
      // START - Validation in case Double barriers | LGTGTWINT -1933 | Chaitanya M | 23 Aug 2023
      else if(
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KO" || 
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KI" ||
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KI" || 
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KO" ||
        $(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "E-RKI+KO" 
      ){

        // Validation for Lower Barrier in case of Double barriers.
        if($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "") === null ){
         
          ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Please Enter Valid Lower Barrier",thisTileFXO);
          return false;

        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >=parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {

          ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Strike rate",thisTileFXO);            
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;            

        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val().replace(/,/g, "")) >=parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {

          ValidateField($(thisTileFXO).find('[id^="FXO_LowerBarrier"]').attr("id"),"Lower barrier value should be less than Spot rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;
        }
        //End

        // Validation for Upper Barrier in case of Double barriers.
        if($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === "" || $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "") === null ){
        
          ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Please Enter Valid Upper Barrier",thisTileFXO);
          return false;
        
        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]')[0].value.replace(/,/g, "")) <=parseFloat($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""))) {
            
          ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Strike rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;
          
        } else if (parseFloat($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val().replace(/,/g, "")) <=parseFloat($(thisTileFXO).find('[id^="rateFXO"]').html().split("/")[1].replace(/,/g, ""))) {
         
          ValidateField($(thisTileFXO).find('[id^="FXO_UpperBarrier"]').attr("id"),"Upper barrier value should be greater than Spot rate",thisTileFXO);
          $(thisTileFXO).find('[id^="loader_FXO"]').hide();
          $(thisTileFXO).find('[id^="BookTradeFXO"]').attr("disabled", false);
          return false;

        }
        //End
        
      }     

    }
    
   
  } catch (error) {
    console.log(error.message);
  }
}
// End - Validation in case Double barriers | LGTGTWINT -1933 | Chaitanya M | 23 Aug 2023

function DownloadDocgenPDFFXO(that) {
  try {
    GenerateTermsheet(that);
  } catch (er) {
    console.log(er.message);
  }
}

//Save Trade Start || 23 Dec 2022 || RijwanS || JIRA ID - LGTGTWINT-607 ||
function SaveTradeFXO(that){
  try{  

    booktradeFXO(that, true);

  }catch(er){

    console.log(er.message);

  }
}//END

function booktradeFXO(that, RTDflag) {
  try {

    if (RTDflag) {

      TileId = that.id.match(/\d+$/)[0];
      thisTileFXO = document.getElementById("td" + TileId);
      $(thisTileFXO).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayFXO"); // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer

    } else {

      TileId = that.id.match(/\d+$/)[0];
      thisTileFXO = document.getElementById("td" + TileId);
      $(thisTileFXO).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayFXO"); // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer 
    }
  } catch (error) {

    console.log(error.message);
  }

} //END

// To book FX Option request
function SaveDealerRFQFXO(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXO = document.getElementById("td" + TileId);

    // Added by Atharva - Timers - START
    if ("td" + TileId in myInterval) {
      clearInterval(myInterval["td" + TileId]);
      delete myInterval["td" + TileId];
    }
    // END
    // Start LGTCLI-417 || RizwanS || 04 May 2023
    let _prodID = "";
    let _prodCode= "";
    let _prodName = "";    

    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() != "Vanilla") {
      _prodCode = productCodeFXBarrier;
      _prodID = productIDFXBarrier;
      _prodName = ProductNameFXBarrier;
    } else {
      _prodCode = productCodeFXVanilla;
      _prodID = productIDFXVanilla;
      _prodName = ProductNameFXVanilla;
    } 
    console.log("BookingFor ::", TileId, thisTileFXO, productName);

    if (
      JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val()) === "" ||
      $(thisTileFXO).find('[id^="FXO_PriceRow"]')[0].firstChild.innerHTML.trim() === "-" ||
      $(thisTileFXO).find('[id^="FXO_PriceRow"]')[0].firstChild.innerHTML.trim() === ""
    ) {
      booktradePopup(that,"booktradeFXO" + TileId,"Please Best Price Again Before Book Trade, Order Execution Failed!","DivOverlayFXO","E");
      return false;
    }

    // Added by Atharva - START
    // Getting the data of price to be selected.

    var isNonBestPrice = false;
    if (clientConfigdata.CommonMethods.NonBestPrice === "Y") {
      isNonBestPrice = true;
    } else {
      isNonBestPrice = false;
    }
    var priceIndex = -1;
    if (isNonBestPrice) {
      priceIndex = parseInt($(thisTileFXO).find('[id^="hdnPriceIndexFXO"]').val());
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
  
    var jsonHdnPrices = JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val());
    var dcdrfqid_val = "";
    for (let i = 0; i < jsonHdnPrices.length; i++) {
      // Finding the only json entry which contains the DCDRFQID, which got scattered while sorting the hdnPrices.
      if (jsonHdnPrices[i].o_DCDRFQID != "") {
        dcdrfqid_val = jsonHdnPrices[i].o_DCDRFQID;
      }
    }
    // dcdrfqid_val must not be null or empty
    console.assert(dcdrfqid_val != "");
    // below also changed index from 0 to priceIndex variable.
    // END
    mapleLoaderStart(thisTileFXO,'[id^="btnBookReqFXO"]',true);
  
    request_getDataFromAPI(
      {     
          
        "EntityId": EntityID,
        "LoginId": userName,
        "DCD_RFQId": dcdrfqid_val,
        "External_RFQId": JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val())[0].quoteId.toString(),
        "PriceProviderName": JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val())[0].provider,
        "ProductCode": _prodCode,
        "Cust_Prem_Amt": Number($(thisTileFXO).find('[id^="hdnIBPremFX"]').val()),            
        "order_Response_TimeOut":"", // HSBCFXEINT-29 | Chaitanya M | 11 Dec 2023
        "twoStepOrderExecutionYN":'N',      
        "OrderRetryFlag": true,
        "CurrentTileID": TileId + "|" + "",
        "Remark": $(thisTileFXO).find('[id^="inputRemark"]').val(),

      },
      clientConfigdata.CommonMethods.NodeServer + "fxobestprice/FXOBookTradeAndGetExternalTradeNumberJSON","","POST",TileId +"|" + userName + '_' + 'BookOrderFXProducts'  +'_' + RequestIDGenerator(6)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
      
        let thisTileFXO = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.CurrentTileID.split("|")[0] // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      
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

        if(responseHeader.toUpperCase() === "SUCCESS"){ 
          
          if (data.dataFromAjax.DealNo =="" || data.dataFromAjax ==null) {

            // LGTCLI-411 | FXD Rejected Trades Notifications | Chaitanya M | 17 April 2023
          //Start
          if(data.dataFromAjax.isOrderRejected === true) { 

            var orderplaced = "Order rejected due to some technical reasons." ;
            ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), orderplaced, thisTileFXO);
            mapleLoaderStop(thisTileFXO,'[id^="btnBookReqFXO"]',true);
            return false;
    
          }else if(data.dataFromAjax.isOrderRejected === false || 
            data.dataFromAjax.External_TradeID === "" ||
            data.dataFromAjax.External_TradeID === null ){
              var orderplaced =  "Order may have got executed or may have failed. Contact support." ;
              ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), orderplaced, thisTileFXO);
              mapleLoaderStop(thisTileFXO,'[id^="btnBookReqFXO"]',true);
            return false;
            }else{
              var orderplaced = data.dataFromAjax.Message;
              ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), orderplaced, thisTileFXO);
              mapleLoaderStop(thisTileFXO,'[id^="btnBookReqFXO"]',true);
              return false;
            }    
            //End        
           } else {
              // var orderno = data.dataFromAjax.Message.split(":")[1];
              
              // var orderplaced =
              //   "Deal No." + data.dataFromAjax.DealNo + "<br>" +
              //   "Order Placed Successfully with Counterparty " + JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val())[priceIndex].provider + 
              //   " and Order ID  " + orderno;
              // // END
              
              //HSBCFXEINT-30 || RizwanS || 12 Dec 2023
              let _msg1 = data.dataFromAjax.Message;
              var orderplaced =
              _msg1 + "<br>" +  //row-1
              "Deal No." + " " + data.dataFromAjax.DealNo + "<br>" + //row-2
              "External Trade ID:" + " " + data.dataFromAjax.External_TradeID; //row-3
             //END

          }
 
          booktradePopup(that,"booktradeFXO" + TileId,orderplaced,"DivOverlayFXO");

          $(thisTileFXO).find('[id^="hdnPricesFXO"]').val("");
          // Added by Atharva - START
          $(thisTileFXO).find(".FXO_PriceRow").children().each(function () {
            $(this).find("button").attr("disabled", true);
          });
          $(thisTileFXO).find(".FXO_Banks").children().each(function () {
            $(this).find("button").attr("disabled", true);
          });
          $(thisTileFXO).find('[id*="btnBookReqFXO"]').attr("disabled", true);
          // $(thisTileFXO).find("[id^='FXO_TimerRow']").html("");
          // $(thisTileFXO).find('[id^="FXO_TimerRow"]').css({ background: "transparent" });
          blockPriceButtons(TileId);
        
        } else {

          let failReason = "Order Execution Failed!";
                
          ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), failReason, thisTileFXO);
        }

        mapleLoaderStop(thisTileFXO,'[id^="btnBookReqFXO"]',true);
      })
      .catch((error) => {
        console.log(error);
      });
 
  } catch (er) {
    console.log(er.message);
    booktradePopup(that,"booktradeFXO" + TileId,"Order Execution Failed!","DivOverlayFXO","E");
  } finally {
  }
}

// Email Quote || RijwanS || LGTGTWINT-517  || 27 Dec 2022
function SendQuoteEmailFXO(that) {
  try {
    
    TileId = that.id.match(/\d+$/)[0];

    closeErrorBox(that);

    thisTileFXO = document.getElementById("td" + TileId);
    $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);     // Added by Lalit G to disable button after email send || HSBCFXEINT-92 || 24 May 24
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
    console.log("email quote to ::", TileId, thisTileFXO, productName);
    
    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() != "Vanilla") {
      prodCodeFXO = productCodeFXBarrier;
      productIDFXO = productIDFXBarrier;
    } else {
      prodCodeFXO = productCodeFXVanilla;
      productIDFXO = productIDFXBarrier;
    }
   
    if ($(thisTileFXO).find('[id^="hdnPricesFXO"]').val() === "" ||
    $(thisTileFXO).find('[id^="FXO_PriceRow"]')[0].firstChild.innerHTML =="-" || 
    $(thisTileFXO).find('[id^="FXO_PriceRow"]')[0].firstChild.innerHTML === ""
    ) {
      booktradePopup(thisTileFXO,"booktradeFXO" + TileId,"Email Quote Failed!","DivOverlayFXO","E");
      return false;
    }
    var isNonBestPrice = false;
    if (clientConfigdata.CommonMethods.NonBestPrice === "Y") {
      isNonBestPrice = true;
    } else {
      isNonBestPrice = false;
    }
    var priceIndex = -1;
    if (isNonBestPrice) {
      priceIndex = parseInt($(thisTileFXO).find('[id^="hdnPriceIndexFXO"]').val());
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val());
    var dcdrfqid_val = "";
    for (let i = 0; i < jsonHdnPrices.length; i++) {
      //LGTGTWINT-1934 || ChaitanyaM || 01 June 2023
      //Start
      if (jsonHdnPrices[i].o_DCDRFQID === "" || jsonHdnPrices[i].o_DCDRFQID === null || jsonHdnPrices[i].o_DCDRFQID === undefined) { 
      }else{
        dcdrfqid_val = jsonHdnPrices[i].o_DCDRFQID;
        break;
      }
      //End
    }
    console.assert(dcdrfqid_val != "");

    mapleLoaderStart(thisTileFXO,'[id^="btnemailquote"]',true);

   request_getDataFromAPI(
      {  

        "RequestID": userName + '_' + 'SendQuoteEmailFXOPTION'  +'_' + RequestIDGenerator(9),
        "EntityID": EntityID,
        "ProductID": productIDFXO,
        "LoginId": userName,
        "NoteMasterId": JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val())[priceIndex].NoteMasterID.toString(),
        "RFQID": dcdrfqid_val,
        // "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "CurrentTileID": TileId + "|" + "",
        
      },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/SendQuoteEmail","","POST",TileId +"|" + userName + '_' + 'SendQuoteEmailFXOPTION'  +'_' + RequestIDGenerator(6))// RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        let thisTileFXO = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
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
            booktradePopup(thisTileFXO,"booktradeFXO" + TileId,orderplaced,"DivOverlayFXO","S");
            
          } else {
  
            var orderplaced = "Email Quote Failed."
            booktradePopup(thisTileFXO,"booktradeFXO" + TileId,orderplaced,"DivOverlayFXO","E");
            $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", false); // Added by Lalit G to disable button after email send || HSBCFXEINT-92 || 24 May 24
          }

        }else {

          let failReason = "Email Quote Failed."; 
          
          ValidateField($(thisTileFXO).find('[id^="hdnPricesFXO"]').attr('id'), failReason, thisTileFXO);
          $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", false); // Added by Lalit G to disable button after email send || HSBCFXEINT-92 || 24 May 24
        }        
       
        mapleLoaderStop(thisTileFXO,'[id^="btnemailquote"]',true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(thisTileFXO,"booktradeFXO" + TileId,"Email Quote Failed!","DivOverlayFXO","E");
    mapleLoaderStop(thisTileFXO,'[id^="btnemailquote"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

function confirmRtoDFXO(that) { // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer
  try { 

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXO = document.getElementById("td" + TileId);

    $(thisTileFXO).find('[id^="validatiionMsg"]').html("");

    // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
    if(isSaveTradeIdeaFXO){

      SaveTradeIdeaFXO(that);
      closeremarkpopup(that);
      

    }else{

      if (!isFXDDealer) { // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023 || Access Control code changes for FXD Instant Pricer | Chaitanya M | 20 Sep 2023
        //LGTGTWINT-1954 || RizwanS || 03 May 2023 

        if($(thisTileFXO).find('[id^="inputRemark"]').val() === "" || $(thisTileFXO).find('[id^="inputRemark"]').val() === undefined || $(thisTileFXO).find('[id^="inputRemark"]').val() === null){

          $(thisTileFXO).find('[id^="validatiionMsg"]').html("Please enter remark.");
          return false;
    
        } else{
    
          $(thisTileFXO).find('[id^="validatiionMsg"]').html("");
          SaveRouteToDealerRFQFXO(that);
          closeremarkpopup(that);

        }

      } else{

        SaveDealerRFQFXO(that);
        closeremarkpopup(that);
      }      

    }

  }catch(er){

    console.log(er.message);

  }

} //END
// Save Route To Dealer RFQO || Chaitanya M  || LGTGTWINT-607 || 25 July 2022
function SaveRouteToDealerRFQFXO(that) {
  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXO = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    // Added by Atharva - Timers - START
    if ("td" + TileId in myInterval) {
      clearInterval(myInterval["td" + TileId]);
      delete myInterval["td" + TileId];
    }
    // END
    console.log("Routed to ::", TileId, thisTileFXO, productName);
    $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023 

    if (
      $(thisTileFXO).find('[id^="hdnPricesFXO"]').val() == "" ||
      $(thisTileFXO).find('[id^="FXO_PriceRow"]')[0].firstChild.innerHTML ==
      "-" ||
      $(thisTileFXO).find('[id^="FXO_PriceRow"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(that,"booktradeFXO" + TileId,"Order Execution Failed!","DivOverlayFXO","E");
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
        $(thisTileFXO).find('[id^="hdnPriceIndexFXO"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXO).find('[id^="hdnPricesFXO"]').val()
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

    mapleLoaderStart(thisTileFXO,'[id^="btnSaveTradeFX"]',true);


       // Start LGTCLI-417 || RizwanS || 04 May 2023
       let _prodID = "";
       let _prodCode= "";
       let _prodName = "";
   
       if ($(thisTileFXO).find('[id^="FXO_Type"]').val() != "Vanilla") {
   
        _prodCode = productCodeFXBarrier;
        _prodID = productIDFXBarrier;
        _prodName = ProductNameFXBarrier;
   
       }else{
        _prodCode = productCodeFXVanilla;
        _prodID = productIDFXVanilla;
        _prodName = ProductNameFXVanilla;
       }
       //END
  

    request_getDataFromAPI(

      {       
        "EntityID":EntityID,
        "DCDRFQID":dcdrfqid_val,
        "ProductCode":_prodCode, //LGTCLI-417 || RizwanS || 04 May 2023
        "LoginId":userName,
        "LoginID": userName,
        "NoteMasterId":JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val())[priceIndex].NoteMasterID,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "RMRemark":$(thisTileFXO).find('[id^="inputRemark"]').val(),
        "CurrentTileID": TileId + "|" + "", 

      },

      clientConfigdata.CommonMethods.NodeServer + "SaveRouteToDealerRFQ","","POST",TileId +"|" + userName + '_' + 'SaveRouteToDealerRFQ'  +'_' + RequestIDGenerator(6)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
       
        let thisTileFXO = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        if (data.SaveRouteToDealerResult.RouteToDealer == true) {

          var orderplaced = "RFQ " +
            " " + dcdrfqid_val + " " + "routed to dealing desk successfully."
            booktradePopup(that,"booktradeFXO" + TileId,orderplaced,"DivOverlayFXO","S");

        } else {

          var orderplaced = "Order Placement Failed."
          booktradePopup(that,"booktradeFXO" + TileId,orderplaced,"DivOverlayFXO","E");

        }

        // $(thisTileFXO).find('[id^="OrderBlotter"]').css({ display: "inline" });
       

        $(thisTileFXO).find('[id^="hdnPricesFXO"]').val("");
        // Added by Atharva - START
        $(thisTileFXO).find(".pricesRow").children().each(function () {
          $(this).find("button").attr("disabled", true);
        });
        $(thisTileFXO).find(".banksNameRow").children().each(function () {
            $(this).find("button").attr("disabled", true);
          });
        // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
        $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);

        $(thisTileFXO).find("[id^='pricesTimer']").html("");
        $(thisTileFXO).find('[id^="pricesTimer"]').css({ background: "transparent" });
        blockPriceButtons(TileId);
        // END

        mapleLoaderStop(thisTileFXO,'[id^="btnSaveTradeFX"]',true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(
      that,
      "booktradeFXO" + TileId,
      "Order Execution Failed!",
      "DivOverlayFXO","E"
    );

    $(".lblError").html(error.message);
    mapleLoaderStop(thisTileFXO,'[id^="btnSaveTradeFX"]',true);
  } finally {
  }
}// END

// Save Trade Idea || RijwanS || LGTGTWINT-608  || 28 Dec 2022
function SaveTradeIdeaFXO(that) {
  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXO = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
    console.log("Save Trade Idea for ::", TileId, thisTileFXO, productName);

    if(isFXDDealer){
      _modeFXO = "SEN";
    }else{
      _modeFXO = "QEN"
    }

    isSaveTradeIdeaFXO = false;

    $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);  // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    
    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() != "Vanilla") {

      productIDFXO = productIDFXBarrier;
      prodCodeFXO = productCodeFXBarrier;
      _FXOCcylist = sessionStorage.getItem("CCYListFXBarrier");
      _FXOCcy = JSON.parse(_FXOCcylist);

    } else {

      productIDFXO = productIDFXVanilla;
      prodCodeFXO = productCodeFXVanilla;
      _FXOCcylist = sessionStorage.getItem("CCYListFXVanilla");
      _FXOCcy = JSON.parse(_FXOCcylist);

    }
   
    if (
      $(thisTileFXO).find('[id^="hdnPricesFXO"]').val() === "" ||
      $(thisTileFXO).find('[id^="FXO_PriceRow"]')[0].firstChild.innerHTML === "-" ||
      $(thisTileFXO).find('[id^="FXO_PriceRow"]')[0].firstChild.innerHTML === ""
    ) {
      booktradePopup(thisTileFXO,"booktradeFXO" + TileId,"Save trade idea Failed!","DivOverlayFXO","E");
      return false;
    }
    var isNonBestPrice = false;
    if (clientConfigdata.CommonMethods.NonBestPrice === "Y") {
      isNonBestPrice = true;
    } else {
      isNonBestPrice = false;
    }
    var priceIndex = -1;
    if (isNonBestPrice) {
      priceIndex = parseInt($(thisTileFXO).find('[id^="hdnPriceIndexFXO"]').val());
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);

    var jsonHdnPrices = JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val());
    var dcdrfqid_val = "";

    for (let i = 0; i < jsonHdnPrices.length; i++) {
      //LGTGTWINT-1934 || ChaitanyaM || 01 June 2023
      //Start
      if (jsonHdnPrices[i].o_DCDRFQID === "" || jsonHdnPrices[i].o_DCDRFQID === null || jsonHdnPrices[i].o_DCDRFQID === undefined) { 
      }else{
        dcdrfqid_val = jsonHdnPrices[i].o_DCDRFQID;
        break;
      }
      //End
    }
    console.assert(dcdrfqid_val != "");

    mapleLoaderStart(thisTileFXO,'[id^="btnSaveTradeIdea"]',true);

    request_getDataFromAPI(
    {  
      "EntityID": EntityID,
      "LoginID": userName,
      "ProductCode": prodCodeFXO,
      "NoteMasterID":JSON.parse($(thisTileFXO).find('[id^="hdnPricesFXO"]').val())[priceIndex].NoteMasterID,
      "RFQID": dcdrfqid_val,
      "Remark":$(thisTileFXO).find('[id^="inputRemark"]').val(), // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
      "Mode": _modeFXO,  // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
      //"FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
      "CurrentTileID": TileId + "|" + "",
      
    },clientConfigdata.CommonMethods.NodeServer + "SaveTradeIdeaFXD","","POST",TileId +"|" + userName + '_' + 'SaveTradeIdeaFXD'  +'_' + RequestIDGenerator(6)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
    .then((data) => {
      let thisTileFXO = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

      if (data.SaveTradeRecommendationResult.TradeIdeaSavedYN === true) {
        
        var orderplaced = "RFQ " + " " + dcdrfqid_val + " " + "marked as trade idea successfully."
        booktradePopup(thisTileFXO,"booktradeFXO" + TileId,orderplaced,"DivOverlayFXO","S");

      } else {

        var orderplaced = "Save trade idea Failed."
        booktradePopup(thisTileFXO,"booktradeFXO" + TileId,orderplaced,"DivOverlayFXO","E");

      }
      
      mapleLoaderStop(thisTileFXO,'[id^="btnSaveTradeIdea"]',true);

    })
    .catch((error) => {
      console.log(error);
    });

  } catch (error) {
    console.log(error.message);
    booktradePopup(thisTileFXO,"booktradeFXO" + TileId,"Save trade idea Failed!","DivOverlayFXO","E");
    mapleLoaderStop(thisTileFXO,'[id^="btnSaveTradeIdea"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}
// END

// Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
function AddremarkFXO(that) {  
  try { 
     
    isSaveTradeIdeaFXO = true;
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXO = document.getElementById("td" + TileId);
    $(thisTileFXO).find('[id^="validatiionMsg"]').html("");
    booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayFXO");       

  }catch(er){

    console.log(er.message);

  }

} //END

// LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 17 Apr 2023
//Start
function GetContractSummaryFXOPTION(that){
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXO = document.getElementById("td" + TileId);
    let _direction = "";
    let _ExoticCode = ""; // COntract summary loading issue on Instant Pricer | Chaitanya M | 25 Sep 2023
    let _notionalperfixing; // HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
    mapleLoaderStart(thisTileFXO,'[id^="btnBestPriceFXOption"]',true); //LGTCLI-422 | Chaitanya M | 5 May 2023 
   
    if ($(thisTileFXO).find('[id^="FXO_Type"]').val() === "Vanilla") {

      TemplateIDFXO = TemplateIDFXVanilla;
      TemplateCodeFXO = TemplateCodeFXVanilla;
      prodCodeFXO = productCodeFXVanilla;
      productIDFXO = productIDFXVanilla;
      barrierType = "";
      knockInstyle = "No"; 
      upperBarrier = "0";
      lowerBarrier = "0";
      
    } else {

      TemplateIDFXO = TemplateIDFXBarrier;
      TemplateCodeFXO = TemplateCodeFXBarrier;
      prodCodeFXO = productCodeFXBarrier;
      productIDFXO = productIDFXBarrier;

       // START - COntract summary loading issue on Instant Pricer | Chaitanya M | 25 Sep 2023
       if (!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked) {

        if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KI") {
      
          barrierType = "Knock-In";
          knockInstyle = clientConfigdata.FXO.knockInstyle_KI; 
          knockOutstyle = "";
          upperBarrier = 0;
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();
          _ExoticCode = 'DAIC';
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KO") {
       
          barrierType = "Knock-Out";
          _ExoticCode = 'DAOC';
          knockInstyle = "";
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_KO;
          upperBarrier = 0;
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI") {
     
          barrierType = "Reverse Knock-In";
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          _ExoticCode = 'UAIC';
          knockOutstyle = "";
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "ERKI") {
       
          barrierType = "European Reverse Knock-In";
          _ExoticCode = 'UAIC';
          knockInstyle = clientConfigdata.FXO.knockInstyle_ERKI;
          knockOutstyle = "";
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO") {
       
          barrierType = "Reverse Knock-Out";
          _ExoticCode = 'UAOC';
          knockInstyle = "";
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KO") { 
          
          barrierType = "RKI+KO";
          _ExoticCode = 'RKIKOC'; 
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();      
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KI") { 
          
          barrierType = "RKI+KI";
          _ExoticCode = 'RKIKIC'; 
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = "";
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();   
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KI") { 
          
          barrierType = "RKO+KI";
          _ExoticCode = 'KIKOC'; 
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_KO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();  
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KO") { 
          
          barrierType = "RKO+KO";
          _ExoticCode = 'RKOKOC';
          knockInstyle = "";
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val(); 
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "EKI") { 
          
          barrierType = "European Knock-In";
          _ExoticCode = 'DAIC';
          knockInstyle = clientConfigdata.FXO.knockInstyle_ERKI;
          knockOutstyle = "";
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();
          upperBarrier = 0;       
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "E-RKI+KO") { 
          
          barrierType = "E-RKI+KO";
          _ExoticCode = 'RKIKOC';
          knockInstyle = clientConfigdata.FXO.knockInstyle_ERKI;
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();          
    
        } 
  
      }else{
  
        if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KI") { 
      
          barrierType = "Knock-In";
          _ExoticCode = 'UAIP';
          knockInstyle = clientConfigdata.FXO.knockInstyle_KI;
          knockOutstyle = "";
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "KO") { 
       
          barrierType = "Knock-Out";
          _ExoticCode = 'UAOP';
          knockInstyle = "";
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_KO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI") { 
     
          barrierType = "Reverse Knock-In";
          _ExoticCode = 'DAIP';
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = "";
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();
          upperBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "ERKI") { 
       
          barrierType = "European Reverse Knock-In";
          _ExoticCode = 'DAIP'; 
          knockInstyle = clientConfigdata.FXO.knockInstyle_ERKI;
          knockOutstyle = "";
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();
          upperBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO") { 
       
          barrierType = "Reverse Knock-Out";
          _ExoticCode = 'DAOP';
          knockInstyle = "";
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();
          upperBarrier = 0;
       
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KO") { 
          
          barrierType = "RKI+KO";
          _ExoticCode = 'RKIKOP'; 
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();       
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKI+KI") { 
          
          barrierType = "RKI+KI";
          _ExoticCode = 'RKIKIP'; 
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = "";
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();            
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KI") { 
          
          barrierType = "RKO+KI";
          _ExoticCode = 'KIKOP'; 
          knockInstyle = clientConfigdata.FXO.knockInstyle_RKI;
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_KO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();            
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "RKO+KO") { 
          
          barrierType = "RKO+KO";
          _ExoticCode = 'RKOKOP'; 
          knockInstyle = "";
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();      
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "EKI") { 
          
          barrierType = "European Knock-In";
          _ExoticCode = 'UAIP';
          knockInstyle = clientConfigdata.FXO.knockInstyle_ERKI;
          knockOutstyle = "";
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = 0;       
    
        } else if ($(thisTileFXO).find('[id^="FXBarrier_Type"]').val() === "E-RKI+KO") { 
          
          barrierType = "E-RKI+KO";
          _ExoticCode = 'RKIKOP';
          knockInstyle = clientConfigdata.FXO.knockInstyle_ERKI;
          knockOutstyle = clientConfigdata.FXO.knockOutstyle_RKO;
          upperBarrier = $(thisTileFXO).find('[id^="FXO_UpperBarrier"]').val();
          lowerBarrier = $(thisTileFXO).find('[id^="FXO_LowerBarrier"]').val();            
    
        }  
        
        // END - COntract summary loading issue on Instant Pricer | Chaitanya M | 25 Sep 2023
      } 

    }

    // Start - COntract summary loading issue on Instant Pricer | Chaitanya M | 25 Sep 2023
    if(!$(thisTileFXO).find('[id^="rbRowFXO"]')[0].checked){
      _opType = "Call";
    }else{
      _opType = "Put"
    }
    // ENd - COntract summary loading issue on Instant Pricer | Chaitanya M | 25 Sep 2023
    
    //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
    //Start
    if($(thisTileFXO).find('[id^="hdnisMetalFX"]').val() === "Y"){

      _AlternateCCyFXO = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim();
      _InvccyFXO = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim();
      _notionalperfixing =Number($(thisTileFXO).find('[id^="ContractAmtFXO"]').val().replace(/,/g, "").split(".")[0]); // Added by Lalit G || 03-Jun-2024 || HSBCFXEINT-136
    }else{

      if( $(thisTileFXO).find('[id^="CcySelectionFXO"]').val() ===  $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim()){    
        
        _AlternateCCyFXO = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim();
        _InvccyFXO = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim();

        _notionalperfixing =Number($(thisTileFXO).find('[id^="ContractAmtFXO"]').val().replace(/,/g, "")) / Number($(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, "")); // HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
        
      }else{

        _AlternateCCyFXO = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[1].trim();
        _InvccyFXO = $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim();

        _notionalperfixing =Number($(thisTileFXO).find('[id^="ContractAmtFXO"]').val().replace(/,/g, "").split(".")[0]); // HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
  
      }    
       
    } 

    //End
  

    // LGTGTWINT-1987 | Chaitanya M | 11 May 2023 - Start
    let _IBPremiumFXO = 0;
    let _IBPrempercFXO = 0;
    let _IBPremDirFXO = "";

    // Start - HSBCFXEINT-51 | Customer premium missing from contract summary | Chaitanya M | 23-Jan-2024
    let _clientPremiumFXO = '';
    let _clientpercntFXO = '';
    let _upfrontFXO = $(thisTileFXO).find('[id^="UpfrontFXO"]').val().replaceAll(',',''); // HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
    let _upfrontPercntFXO =  (_upfrontFXO * _notionalperfixing )/100; // HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
    // End - HSBCFXEINT-51 | Customer premium missing from contract summary | Chaitanya M | 23-Jan-2024

    if($(thisTileFXO).find('[id^="hdnPricesFXO"]').val() === "" || $(thisTileFXO).find('[id^="hdnPricesFXO"]').val() === null || $(thisTileFXO).find('[id^="hdnPricesFXO"]').val() === undefined){

      _IBPremiumFXO = 0;
      _IBPrempercFXO = 0;
      _IBPremDirFXO = "";    
      _clientPremiumFXO = 0; // HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
      _clientpercntFXO = 0; // HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
      
    }else{

      _IBPremiumFXO = Number($(thisTileFXO).find('[id^="hdnIBPremFX"]').val().replace(/,/g, ""));
      _IBPrempercFXO = Number($(thisTileFXO).find('[id^="hdnIBPremPercFX"]').val());

      // LGTGTWINT-1987 | Chaitanya M | 05 Jun 2023
      // Start - HSBCFXEINT-51 | Customer premium missing from contract summary | Chaitanya M | 23-Jan-2024
      if(_IBPrempercFXO > 0 ){
        _IBPremDirFXO = "Pay";
        // Start : HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
        _clientpercntFXO = (Number(_IBPrempercFXO) - Number(_upfrontFXO)) <0 ? Number(_IBPrempercFXO) - Number(_upfrontFXO) * -1 :Number(_IBPrempercFXO) - Number(_upfrontFXO);
        _clientPremiumFXO = (Number(_IBPremiumFXO) - Number(_upfrontPercntFXO)) <0 ? Number(_IBPremiumFXO) - Number(_upfrontPercntFXO) * -1 :Number(_IBPremiumFXO) - Number(_upfrontPercntFXO);
        // End : HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
      }else{
        _IBPremDirFXO = "Receive";
        
        // Start : HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
        _IBPremiumFXO = _IBPremiumFXO < 0 ? _IBPremiumFXO * -1 : _IBPremiumFXO;
        _IBPrempercFXO = _IBPrempercFXO < 0 ? _IBPrempercFXO * -1 : _IBPrempercFXO;

        _clientpercntFXO = (Number(_IBPrempercFXO) + Number(_upfrontFXO)) <0 ? Number(_IBPrempercFXO) + Number(_upfrontFXO) * -1 :Number(_IBPrempercFXO) + Number(_upfrontFXO);
        _clientPremiumFXO = (Number(_IBPremiumFXO) + Number(_upfrontPercntFXO)) <0 ? Number(_IBPremiumFXO) + Number(_upfrontPercntFXO) * -1 :Number(_IBPremiumFXO) + Number(_upfrontPercntFXO);
        // End : HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
        
      }
      // End - HSBCFXEINT-51 | Customer premium missing from contract summary | Chaitanya M | 23-Jan-2024
      //End
      
    }
    //End

    request_getDataFromAPI(
      {
        CurrentTileID:TileId + "|" + "",
        entityID: sessionStorage.getItem("HomeEntityID"),
        lginID: sessionStorage.getItem("Username"),
        productCode: prodCodeFXO,
        entityID_: sessionStorage.getItem("HomeEntityID"),
        templateCode: TemplateCodeFXO.toUpperCase(), // Added by Chaitanya M | 25 Sep 2023
        producttype : prodCodeFXO, //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        bSdirection : $(thisTileFXO).find('[id^="FXObuySell"]').val().trim(),  // Added by Chaitanya M | 25 Sep 2023   
        ccypair :$(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().trim(),
        optionType : _opType,
        invccy:_InvccyFXO, //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        altNotionalCcy: _AlternateCCyFXO,//LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        premCcy: $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim(),//LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        notional: _notionalperfixing, //HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
        alternatenotional :0,
        notionalperfixing : 0, // Added by Chaitanya M | 25 Sep 2023
        tenor : $(thisTileFXO).find('[id^="hdnTenorDaysFXO"]').val(),
        expiry:$(thisTileFXO).find('[id^="hdnFXOFixing"]').val(),
        settlement:$(thisTileFXO).find('[id^="hdnFXOExpiry"]').val(),
        longDate: "", 
        shortDate: "",
        strike : $(thisTileFXO).find('[id^="FXO_Strike"]').val().replace(/,/g, ""), // LGTCLI-391 Chaitanya M 9 May 2023
        optionCut : $(thisTileFXO).find('[id^="Optioncutddl"]').val(),
        barrierType: barrierType,
        exoticCode : _ExoticCode, // Added by Chaitanya M | 25 Sep 2023
        digitalType :"",
        upperBarrier : upperBarrier !== '' ? upperBarrier : '0', // Added by Chaitanya M | 25 Sep 2023
        lowerBarrier : lowerBarrier !== '' ? lowerBarrier : '0', // Added by Chaitanya M | 25 Sep 2023
        leverageFactor : "0",
        noofsett : 0,
        nooffixings : 0, 
        fixingFrequency : "",  
        settfrequency : "",
        lowerStrike : "0.00",
        upperStrike :"0.00",
        pivotstrike :"0.00",
        spreadType: "",
        customerpremdir: "", 
        ibPremDir: _IBPremDirFXO, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
        ibPrem: _IBPremiumFXO.toFixed(2), // HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
        rtc: _clientPremiumFXO.toFixed(2), // HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
        ibPremperc : _IBPrempercFXO.toFixed(4), // HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
        rtcPerc:_clientpercntFXO.toFixed(4), // HSBCFXEINT-56 | CHaitanya M | 24-Jan-2024
        target:"0.00", 
        targetNotional:"0.00", 
        kiStyle: knockInstyle,
        lowerKI: "0.00", //LGTGTWINT-1919 | Chaitanya M | 27 April 2023
        upperKI: "0.00", //LGTGTWINT-1919 | Chaitanya M | 27 April 2023
        guaranteedtill:"",
        guaranteedPeriods:"0", 
        cappedLossCcy:"",
        cappedLossType:"", 
        cappedLoss:"",
        cappedLossAmt:0.00,
        targetBigFigure: "",
        targetgainunit: "",
        targetinPips: "0.00",
        koitmEvent: "0.00",
        striptype: "",
        firstFixingDate: "", // Added by Chaitanya M | 25 Sep 2023
        finalPayType:"",
        fixingAdjustment:"",
        
      },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/GetContractSummary","","POST",TileId +"|" + userName + '_' + 'GetContractSummary_IP'  +'_' + RequestIDGenerator(6))
      .then((data) => { 
      //LGTCLI-422 | Chaitanya M | 5 May 2023

      let thisTileFXO = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      
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

        if(responseHeader.toUpperCase() === "SUCCESS"){
          
          res =  data.dataFromAjax.result.toString().replaceAll("\\n", "<br>");  
          if(res.includes('color:green')){
            summary = res.toString().replaceAll("\color:green","color:var(--green) !important");
          }else{
            summary = res.toString().replaceAll("\color:red","color:var(--red) !important");
          }
          
          $(thisTileFXO).find('[id^="ContractSummaryFXD"]').append(summary);
          
          summarytradePopup(that,"SummaryFXD" + TileId,res,"DivOverlayFXO");    

          mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',true);
        }else{
          let failReason = "No response received from remote system.";          
          ValidateField($(thisTileFXO).find('[id^="btnBestPriceFXOption"]').attr('id'), failReason, thisTileFXO);

          mapleLoaderStop(thisTileFXO,'[id^="btnBestPriceFXOption"]',true);
        }
        //End        

      }); 

  } catch (error) {
    console.log(error.message);
  }
  
}

// Added by LalitG@14May2024 || HSBCFXEINT-94 || START
function resetPriceFXOptionTile(that){
  try{
    closeContractSummarypopup(that); // Added by Lalit G || 03 June 24 || HSBCFXEINT-97
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXO = document.getElementById("td" + TileId);
    setDeafaultValuesFXOption(TileId); 
    resetFXDPrice(thisTileFXO);    
    _defaultflagFXO = true;  
    getCurrencyFXORate(TileId);
    $(thisTileFXO).find('[id^="CcySelectionFXO"]').val($(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim());   
    $(thisTileFXO).find('[id^="ddlSolveForFX"]').val('Premium').trigger('change');
  
  }catch(error){
    console.log(error.message)
  }
}// Added by LalitG@14May2024 || HSBCFXEINT-94 || END
//Added by LalitG@16May2024 || for enabling Soft Tenor entry || HSBCFXEINT-75 || START
function softTenorInputChanged(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXO = document.getElementById("td" + TileId);

    let value = $(thisTileFXO).find('[id^="FXO_SoftTenorIp"]').val();
    value = value.toUpperCase()

    if (!(value.toUpperCase().includes('M') || value.toUpperCase().includes('Y') || value.toUpperCase().includes('D') || value.toUpperCase().includes('W'))) {
      value = value + "D";
    }
    
    resetFXDPrice(thisTileFXO);

    $(thisTileFXO).find('[id^="btnBookReqFXO"]').attr("disabled", true);
    $(thisTileFXO).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXO).find('[id*="btnemailquote"]').attr("disabled", true);

    $(thisTileFXO).find('[id^="FXO_TenorDemo"]').val("");

    fillDatesFXO(
      $(thisTileFXO).find('[id^="FXO_CCYPairDemo"]').val(),
      value,
      TileId
    );

  } catch (error) {
    console.log(error.message)
  }
}
// Added by LalitG@16May2024 || for enabling Soft Tenor entry || HSBCFXEINT-75 || END
// Start || HSBCFXEINT-107 : Enable fixing and maturity date | CM1025@17-May-2024
function fnGetFixingMaturityDatesFXO(ccypair,Date,fixingOrMaturity,that){
  try {
    
    thisTileFXO = document.getElementById("td" + that);
    clearPricerTable(thisTileFXO);

    let _Tenor = "" 
  
    if(
      $(thisTileFXO).find('[id^="FXO_TenorDemo"]').val() == "" || 
      $(thisTileFXO).find('[id^="FXO_TenorDemo"]').val() == null || 
      $(thisTileFXO).find('[id^="FXO_TenorDemo"]').val() == undefined
    ){

      Tenor = $(thisTileFXO).find('[id^="hdnFXOTenorCode"]').val();

    } else {
      $(thisTileFXO).find('[id^="FXO_TenorDemo"]').val();
    }

    request_getDataFromAPI({      
      "altCcy": ccypair.split("-")[1].trim(),
      "depoCcy": ccypair.split("-")[0].trim(),
      "tradeDate": setBusinessDate,
      "entityID": EntityID,
      "tenor_Code": _Tenor,
      "productId": productIDFXO,
      "mode" : fixingOrMaturity,
      "optioncut": $(thisTileFXO).find('[id^="Optioncutddl"]').val(),
      "fixingOrMaturityDate" : Date,  
      "pageImplemented":"",
      "user" : userName,
      "calcSettlementDate" :"Y",
      "CurrentTileID": that + "|" + "",  
    },
    clientConfigdata.CommonMethods.NodeServer + "DateCalculationApi/Get_FixingMaturityDates","","POST",that +"|" + userName + '_' + 'Get_FixingMaturityDates'  +'_' + RequestIDGenerator(6)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
    .then((data) => {

      let thisTileFXO = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

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

        if(responseHeader.toUpperCase() === "SUCCESS"){

          $(thisTileFXO).find('[id^="hdnFXOPremiumDate"]').val(JSON.parse(data.dataFromAjax.valueDate).m_Date); 

          if(fixingOrMaturity == "MATURITY"){

            let _maturitydate = JSON.parse(data.dataFromAjax.fixingMaturityDate).m_Date

            $(thisTileFXO).find('[id^="lblFXOExpiry"]').html(_maturitydate);
            $(thisTileFXO).find('[id^="FXO_Expiry"]').val(_maturitydate);
            $(thisTileFXO).find('[id^="hdnFXOExpiry"]').val(_maturitydate);

          } else if(fixingOrMaturity == "FIXING"){
            
            let _fixingdate = JSON.parse(data.dataFromAjax.fixingMaturityDate).m_Date;

            $(thisTileFXO).find('[id^="lblFirstFixDate"]').html(_fixingdate);
            $(thisTileFXO).find('[id^="FirstFixDate"]').val(convertDateString(_fixingdate));
            $(thisTileFXO).find('[id^="hdnFXOFixing"]').val(_fixingdate);
            
          }


          calculateTenorDaysFXO(
            $(thisTileFXO).find('[id^="FirstFixDate"]').val(),
            TradeDateFXO,

          );

        }else{

        }
    });

  } catch (error) {
    console.log(error.message);
  }
  
}
// End || HSBCFXEINT-107 : Enable fixing and maturity date | CM1025@17-May-2024

function convertDateString(dateStr) {
  var months = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };

  var parts = dateStr.split('-');
  var day = parts[0];
  var month = months[parts[1]];
  var year = parts[2];

  return `${year}-${month}-${day}`;
}

// Start || HSBCFXEINT-107 : Enable fixing and maturity date | CM1025@17-May-2024
function calculateTenorDaysFXO(fixindate, TradeDate){
  try{

    let date = new Date(TradeDate);

    let currentDate = new Date(fixindate);

    let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);

    $(thisTileFXO).find('[id^="FXO_SoftTenorIp"]').val(days.toString());

    $(thisTileFXO).find('[id^="FXO_TenorDemo"]').val("");

    $(thisTileFXO).find('[id^="hdnFXOTenorCode"]').val(days.toString() + "D");

    $(thisTileFXO).find('[id^="hdnTenorDaysFXO"]').val(days.toString() );
    

    return TenorandDays;

  }catch(error){
    console.log(error.message)
  }
}

// End || HSBCFXEINT-107 : Enable fixing and maturity date | CM1025@17-May-2024

