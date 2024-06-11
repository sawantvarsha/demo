var FreqFX = ["Monthly/Monthly", "Weekly/Weekly"];
var FreqFXAQ = ["Monthly", "Weekly"];
var tenorListFXAQ = ["1W","2W","3W","4W","1M","2M","3M","4M","5M","6M","7M","8M","9M","10M","11M","1Y","2Y","3Y","5Y","7Y"];
var tenorArrAQ = ["1W", "2W", "1M", "1D"];
var FreqAQ = ["Daily", "BiWeekly", "Monthly", "Weekly"];
var FreqAQArr = ["BiWeekly/BiWeekly","Monthly/Monthly","Weekly/Weekly","Daily/Weekly","Daily/Monthly",];
var KIstyleArrAQ = ["No", "E-101", "E-102", "E-112"];
var LeverageArrayAQ = ["1", "2"];
var idFXAQ = 13;

var OptionCutListFXAQ = [];
 
var _defaultflagGXAQ=false; //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
var isSaveTradeIdeaFXQ;
var _eventstrikechangeFXAQ = false; //LGTCLI-422 | Chaitanya M | 5 May 2023
var MinQuoteTimeOutOccurredFXAQ = false; // LGTGTWINT-1934 || ChaitanyaM || 03 Jun 2023  

var timeoutFXAQ=""; //LGTGTWINT-2110 | Chaitanya M | 13 June 2023
var IsMetalAQ ="" // LGTCLI-437 | Chaitanya M | 11 July 2023

//Added by RizwanS || LGTGTWINT-2322 || 22 Aug 2023
var MaxQuoteTimeOutAQ = "";
var MinQuoteTimeOutAQ = "";
var MaxQuoteTimeOutDQ = "";
var MinQuoteTimeOutDQ = "";
var LPListFXAQ = "";
var LPListFXDQ = "";
//END

var frequencyFAQ =""; // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023

var TradeDateFXAQ = "";

$(document).ready(function () {
  try {
    
  } catch (err) {
    console.log(err.message);
  }
});

//To initialize FXAQ product functions while the page is being loaded
function onLoadFXAQ(currId) {
  try {

    setDeafaultValuesFXAQ(currId);
    thisTileFXAQ = document.getElementById("td" + currId);
  
    mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    // Added by RizwanS / Channged User id to gateway specific name / 16 Jun 2022
    // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
    // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
    // END

    resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    $(thisTileFXAQ).find('[id^="BuySellDirectionFXAQ"]').html($(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').val());

    // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
    getMaxLevNotionalFXAQ( $(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').val(),
    $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val(),
      $(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').val(),
      currId
    );

     // Added for LGTGTWINT-1667 | FXD-Instant pricer ccy change doesnt happen with ccy pair change  | Chaitanya M | 06 March 2023
    if($(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').val() != $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim()){

      $(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').val($(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim());
      $(thisTileFXAQ).find('[id^="maxlevCcyFXAQ"]').html("(" +$(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim()+ ")");
      $(thisTileFXAQ).find('[id^="lblSprdAmtCCy"]').html("(" +$(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim()+ ")"); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      
    }

    //End

    $(thisTileFXAQ).find('[id^="tenorFXAQ"]').on("change", function () {
        try {
          thisTileFXAQ = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
          $(this).parents(".sorting").find('[id^="FXAQ_CCYPairDemo"]').removeClass("ValidateFieldCSS");
          document.getElementById("required").style.display = "none";
          var val = this.value;

          // clearPricerTable(thisTileFXAQ);

          mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);
         
          //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
          // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
          //End

          resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          fillDatesFXAQ(
            $(this).parents(".sorting").find('[id^="FXAQ_CCYPairDemo"]').val(),
            $(this).parents(".sorting").find('[id^="tenorFXAQ"]').val(),
            currId
          );
          
          return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
        } catch (er) {
          console.log(er.message);
        }
      });

    // Check For KI
    
    // START - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
    frequencyFAQ= $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val();
    if(!$(thisTileFXAQ).find('[id^="rbRowKIToggleAQ"]')[0].checked){      
      
      if(frequencyFAQ.includes("BABS")){
        if(frequencyFAQ=="BABS1N00"){
          frequencyFAQ = "BABS1Y01"
        }else{
          frequencyFAQ = "BABS2Y02"
        }
      }else if(frequencyFAQ.includes("MAMS")){
        if(frequencyFAQ=="MAMS1N00"){
          frequencyFAQ = "MAMS1Y01"
        }else{
          frequencyFAQ = "MAMS2Y02"
        }
      }else if(frequencyFAQ.includes("WAWS")){
        if(frequencyFAQ=="WAWS1N00"){
          frequencyFAQ = "WAWS1Y01"
        }else{
          frequencyFAQ = "WAWS2Y02"
        }
      } 

      if (frequencyFAQ.includes("N")) {
        $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val("").prop("disabled", true);
      } else {
        $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').prop("disabled", false);
      }

    }else{

      if (frequencyFAQ.includes("N")) {
        $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val("").prop("disabled", true);
      } else {
        $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').prop("disabled", false);
      }

    }
    // End - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023

    
    // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    if(AllowSolveForYN !== "YES"){ 

      $(thisTileFXAQ).find('[id^="solveforrow"]').hide(); 

    }else{

      if ($(thisTileFXAQ).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {

        $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').prop("disabled", true);
        $(thisTileFXAQ).find('[id^="PremiumipboxFX"]').prop("disabled", false);
  
      } else {
  
        $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').prop("disabled", false);
        $(thisTileFXAQ).find('[id^="PremiumipboxFX"]').prop("disabled", true);
  
      }

    }  
    // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

    //Check for  Frequncy Type // 12 Oct 2021

    $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').on("change", function () {
        try {
          thisTileFXAQ = $(this).parents(".sorting")[0];         

          // clearPricerTable(thisTileFXAQ);

          mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);

          //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
          // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
          //End

          resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          checkAQComboType(
            $(this).parents(".sorting").find('[id^="frequencyFXAQ"]').val(),
            thisTileFXAQ
          );
          fillDatesFXAQ(
            $(this).parents(".sorting").find('[id^="FXAQ_CCYPairDemo"]').val(),
            $(this).parents(".sorting").find('[id^="frequencyFXAQ"]').val(),
            $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXAQ"]').val(),
            currId
          );
          // fillFirstFixingDateFXAQ(
          //   $(this).parents(".sorting").find('[id^="FXAQ_CCYPairDemo"]').val(),
          //   $(this).parents(".sorting").find('[id^="frequencyFXAQ"]').val(),
          //   currId
          // );

          // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
          getMaxLevNotionalFXAQ( $(this).parents(".sorting").find('[id^="ContractAmtFXAQ"]').val(),
          $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val(),
          $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXAQ"]').val(),
          currId
        );
  
          return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 2023
        } catch (error) {
          console.log(error.message);
        }
      });

    //Check for Fixing/Settlement Frequncy // 12 Oct 2021

    $(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').on("change", function () {
        try {

          // clearPricerTable(thisTileFXAQ);
          thisTileFXAQ = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);

          //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
          // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
          //End

          resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          fillDatesFXAQ(
            $(this).parents(".sorting").find('[id^="FXAQ_CCYPairDemo"]').val(),
            $(this).parents(".sorting").find('[id^="frequencyFXAQ"]').val(),
            $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXAQ"]').val(),
            currId
          );

          // fillFirstFixingDateFXAQ(
          //   $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val(),
          //   $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val(),
          //   currId
          // );

          // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
          getMaxLevNotionalFXAQ( $(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').val(), 
          $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val(),
            $(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').val(),
            currId
          );
          return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
        } catch (error) {
          console.log(error.message);
        }
      });

    // END

    //Check for Fixing/Settlement Frequncy // 12 Oct 2021

      $(thisTileFXAQ).find('[id^="FirstFixDate"]').on("change", function () {
        try {
          thisTileFXAQ = $(this).parents(".sorting")[0];

          // clearPricerTable(thisTileFXAQ);

          mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);

          //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
          // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
          //End

          resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          let firstFix = new Date($(this).val());

          if($(this).val() !=""){ /// LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023

            $(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("disabled", false);

            validatefirstfixingday(thisTileFXAQ,"FirstFixDate",firstFix); //Added to show error if Saturday or Sunday selected as First- Fixing date | LGTGTWINT-1424| Chaitanya M | 20 Feb 2023
          
            let formattedDate =firstFix.getDate() +"-" +months[firstFix.getMonth()] +"-" +firstFix.getFullYear();
  
            $(thisTileFXAQ).find('[id^="lblFirstFixDate"]').html(formattedDate);
            fillDatesONFirstFixAQ(
              $(this).parents(".sorting").find('[id^="FXAQ_CCYPairDemo"]').val(),
              $(this).parents(".sorting").find('[id^="frequencyFXAQ"]').val(),
              $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXAQ"]').val(),
              $(this).parents(".sorting").find('[id^="FirstFixDate"]').val(),
              currId
            );
          }else{// LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023

            $(thisTileFXAQ).find('[id^="lblFirstFixDate"]').html($(this).val());
            $(thisTileFXAQ).find('[id^="FXAQ_Expiry"]').html("");
            validatefirstfixingday(thisTileFXAQ,"",$(this).val());
          }
        
          return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
        } catch (error) {
          console.log(error.message);
        }
      });

    //END
    // changed for LGTGTWINT-1389 | Chaitanya M | 17 Feb 2023
    $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').on("select", function () {   //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike
        try {
           
          thisTileFXAQ = $(this).parents(".sorting")[0];    // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
          //_defaultflagGXAQ = true; //LGTCLI-310 | Chaitanya M | 23 feb 2023  //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023
          
          // clearPricerTable(thisTileFXAQ);

          mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);

          //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
          // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
          //End
          
          resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          let ccypairs = sessionStorage.getItem("CCYListFXAQ"); 

          if(!ccypairs.includes($(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val())){ //LGTGTWINT-1582 | currency pair validation on instant pricer | Chaitanya M | 02-March-2023
            $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val("");
            ValidateField($(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').attr("id"), "Currency pair not found.", thisTileFXAQ);
            return false;
          }else{

            //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
            //Start
            if( $(this).parents(".sorting").find('[id^="hdnCcyDetailsFXAQ"]').val() ==  $(this).parents(".sorting").find('[id^="FXAQ_CCYPairDemo"]').val()){
              return false;
            }else{
            //End
             _defaultflagGXAQ = true;  //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023
              getCurrencyFXAQRate(currId);
              $(this).parents(".sorting").find('[id^="BuySellDirectionFXAQ"]').html(this.value.split("-")[0].trim());
              $(this).parents(".sorting").find('[id^="primaryCcyAQ"]').html(this.value.split("-")[0].trim());
              $(this).parents(".sorting").find('[id^="SecondaryCcyAQ"]').html(this.value.split("-")[1].trim());   

              $(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').val($(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim());
              $(thisTileFXAQ).find('[id^="maxlevCcyFXAQ"]').html("(" +$(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim()+ ")");
              $(thisTileFXAQ).find('[id^="lblSprdAmtCCy"]').html("(" +$(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim()+ ")"); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

              // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
              getMaxLevNotionalFXAQ( $(this).parents(".sorting").find('[id^="ContractAmtFXAQ"]').val(),
                $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val(),
                $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXAQ"]').val(),
                currId
              );                    
              return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
   
            }    //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
          }         

        } catch (error) {
          console.log(error.message);
        }
      });

    // $(thisTileFXAQ)
    //   .find('[id^="CcySelectionFXAQ"]')
    //   .on("change", function () {
    //     try {
    //       thisTileFXAQ = $(this).parents(".sorting")[0];
    //       $(this)
    //         .parents(".sorting")
    //         .find('[id^="BuySellDirectionFXAQ"]')
    //         .html(this.value);
    //       checkDecimalAmt("", thisTileFXAQ); //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022
    //     } catch (error) {
    //       console.log(error.message);
    //     }
    //   });

    $(thisTileFXAQ).find('[id^="CcySelectiontoggleFXAQ"]').on("click", function () { 
      try {
        thisTileFXAQ = $(this).parents(".sorting")[0];  

        $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true); // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
         //End
        // clearPricerTable(thisTileFXAQ);
        mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);

        resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
        if($(thisTileFXAQ).find('[id^="hdnisMetalFX"]').val() === "N"){ // LGTCLI-437 | Chaitanya M | 11 July 2023        
   
        if($(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').val() == $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim()){
          $(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').val($(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[1].trim());
          $(thisTileFXAQ).find('[id^="maxlevCcyFXAQ"]').html("(" +$(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[1].trim()+ ")");
          $(thisTileFXAQ).find('[id^="lblSprdAmtCCy"]').html("(" +$(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[1].trim()+ ")"); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
          
        }else{
          $(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').val($(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim());
          $(thisTileFXAQ).find('[id^="maxlevCcyFXAQ"]').html("(" +$(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim()+ ")");
          $(thisTileFXAQ).find('[id^="lblSprdAmtCCy"]').html("(" +$(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim()+ ")"); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        }   
        
        $(this).parents(".sorting").find('[id^="BuySellDirectionFXAQ"]').html(this.value);
        checkDecimalAmt("", thisTileFXAQ); //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022
        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
      }
      //ENd
      } catch (error) {
        console.log(error.message);
      }
    });

    //Check for Fixing Frequncy/Settlement // 28 Oct 2020

    $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').on("change", function () {
        try {

          thisTileFXAQ = $(this).parents(".sorting")[0];    // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
          // clearPricerTable(thisTileFXAQ);

          mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);

         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
        //  $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
         //End

         resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          fillDatesFXAQ(
            $(this).parents(".sorting").find('[id^="FXAQ_CCYPairDemo"]').val(),
            $(this).parents(".sorting").find('[id^="tenorFXAQ"]').val(),
            currId
          );
          // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
          getMaxLevNotionalFXAQ( $(this).parents(".sorting").find('[id^="ContractAmtFXAQ"]').val(),
          $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val(),
          $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXAQ"]').val(),
          currId
        );
        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
        } catch (error) {
          console.log(error.message);
        }
    });

    $(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').on("change", function(){

      thisTileFXAQ = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023  
      $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
      // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
      //End
      // clearPricerTable(thisTileFXAQ);

      mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);

      resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      let _notionalamtFXAQ =  FormatNotional($(this).parents(".sorting").find('[id^="ContractAmtFXAQ"]').val(),this); // Added for LGTGTWINT-1511  Incorrect max notional calculation | Chaitanya M | 24 feb 2023

      getMaxLevNotionalFXAQ(_notionalamtFXAQ,
        $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val(),
          $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXAQ"]').val(),
          currId
        );
    });

    $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').on("change", function(){

      thisTileFXAQ = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);

      $(thisTileFXAQ).find('[id^="hdnStrikevalueFX"]').val($(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
      // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
      //End      
      // clearPricerTable(thisTileFXAQ);

      _eventstrikechangeFXAQ = true; //LGTCLI-422 | Chaitanya M | 5 May 2023
      mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);

      resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    });

    $(thisTileFXAQ).find('[id^="GauranteeFXAQ"]').on("change", function(){

      thisTileFXAQ = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
    //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
    // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
    // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
    //End 
      // clearPricerTable(thisTileFXAQ);
      mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);

      resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    });

    $(thisTileFXAQ).find('[id^="Optioncutddl"]').on("change", function(){

      thisTileFXAQ = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
      // LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
      // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
      // End 
      // clearPricerTable(thisTileFXAQ);
      mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);

      resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    });
    
    $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').on("change", function(){

      thisTileFXAQ = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
      // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
    //End 
      // clearPricerTable(thisTileFXAQ);
      mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);

      resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    });

    //END
     //LGTCLI-417 || RizwanS || 04 May 2023
    $(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').on("change", function () {
      try {

        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0]; // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

        thisTileFXAQ = document.getElementById("td" + currId); // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

        mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") { 
          
          // Added for LGTCLI-348 FX Tiles Buy Sell Toggle UI Follow Single Pricer | Chaitanya M | 29 March 2023
          $(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').removeClass("SellDropdown");
          $(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').addClass("BuyDropdown");
          //End
          
          getCurrencyFXAQRate(currId); 
          
        } else {

          // Added for LGTCLI-348 FX Tiles Buy Sell Toggle UI Follow Single Pricer | Chaitanya M | 29 March 2023
          $(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').removeClass("BuyDropdown");
          $(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').addClass("SellDropdown");
          //End

          getCurrencyFXAQRate(currId); 

        }
        
      } catch (error) {
        console.log(error.message);
      }
      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    //Added for backsolve functionality | Chaitanya M | 16 may 2023
    //START

    $(thisTileFXAQ).find('[id^="ddlSolveForFX"]').on("change", function () {

      currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];  

      thisTileFXAQ = document.getElementById("td" + currId);
      resetFXDPrice(thisTileFXAQ);

      if ($(thisTileFXAQ).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase().includes("STRIKE")) {

        $(thisTileFXAQ).find('[id^="hdnStrikevalueFX"]').val($(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').prop("disabled", true);
        $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val(""); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        $(thisTileFXAQ).find('[id^="PremiumipboxFX"]').prop("disabled", false);
  
      } else {
  
        $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').prop("disabled", false);
        $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val($(thisTileFXAQ).find('[id^="hdnStrikevalueFX"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        $(thisTileFXAQ).find('[id^="PremiumipboxFX"]').prop("disabled", true);
        $(thisTileFXAQ).find('[id^="PremiumipboxFX"]').val(""); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
  
      }

    });
    //END

    //Added for Premium Amunt on change event to enable Price button | Chaitanya M | 22 Aug 2023
    $(thisTileFXAQ).find('[id^="PremiumipboxFX"]').on("change", function(){

      thisTileFXAQ = $(this).parents(".sorting")[0];
      $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true); 
      $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);      

      _eventstrikechangeFXAQ = true;
      mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);

      resetFXDPrice(thisTileFXAQ); 

    });
    //End

    // START - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
    $(thisTileFXAQ).find('[id^="KIToggleAQ"]').on("change", function () {
      try {
        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0];

        thisTileFXAQ = document.getElementById("td" + currId);        
 
        mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        resetFXDPrice(thisTileFXAQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
       
        checkAQComboType(
          $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val(),
          thisTileFXAQ
        );        

        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
      
      } catch (er) {
        console.log("error in KI Toggle change ", er.message);
      }
    });
    //End - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
  

  } catch (er) {
    console.log(er.message);
  }
}

//To set the default values of input fields in FXAQ
function setDeafaultValuesFXAQ(currId) {
  try {
    thisTileFXAQ = document.getElementById("td" + currId);

    $(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').val("100,000.00");  // Default Parameters Change | LGTCLI-310 | Chaitanya M | 17 Feb 2023
    $(thisTileFXAQ).find('[id^="GauranteeFXAQ"]').val("0");  // Default Parameters Change | LGTCLI-310 | Chaitanya M | 17 Feb 2023
    $(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').val("52"); // LGTGTWINT-1525 | Chaitanya M | 27 Feb 2023
    $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val("EUR - USD");
    $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val(""); 
   // $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val("1.0906"); //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023
    $(thisTileFXAQ).find('[id^="BuySellDirectionFXAQ"]').html(
    $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim()
    );
    $(thisTileFXAQ).find('[id^="primaryCcyAQ"]').html(
      $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim()
    );
    $(thisTileFXAQ).find('[id^="SecondaryCcyAQ"]').html(
      $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[1].trim()
    );
    
    //LGTCLI-417 || RizwanS || 04 May 2023

    if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {
      $(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').removeClass("SellDropdown");
      $(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').addClass("BuyDropdown");
    }else{
      $(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').removeClass("BuyDropdown");
      $(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').addClass("SellDropdown");
    }

    //END

    getcurrentdate(thisTileFXAQ,"FirstFixDate");
    clearPricerTable(thisTileFXAQ);
 
    //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
    $(thisTileFXAQ).find('[id^="hdnCcyDetailsFXAQ"]').val($(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val());
    //End
    
    //Added for ccy pair autocomlete / JIRA - FINGUI - 237 / 14 Feb 2022
    callCcyautocompleteFX(thisTileFXAQ, "FXAQ_CCYPairDemo");
    //END
  } catch (err) {
    console.log(err.message);
  }
}

function fillDatesFXAQ(pair, typevalAQ, NoofFixingAQ, currId) {
  try {
    thisTileFXAQ = document.getElementById("td" + currId);

    FreqFXAQType = setFrequencyType(thisTileFXAQ, typevalAQ); // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023

    SetDateValues( FreqFXAQType, NoofFixingAQ,thisTileFXAQ,FreqAQ,tenorArrAQ); // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023   

    // Addded for CFINT-992 // 18-Sep-2020 //

    $(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("disabled", true);
    $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
    clearPricerTable(thisTileFXAQ);

    //END

    // Start LGTCLI-417 || RizwanS || 04 May 2023
    let _prodID = "";
    let _prodCode= "";
    let _prodName = "";

    if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

      _prodID = productIDFXAQ;
      _prodCode = productCodeAQ;
      _prodName = ProductNameAQ;

    }else{
      _prodID = productIDFXDQ;
      _prodCode = productCodeDQ;
      _prodName = ProductNameDQ;
    }
    //END

    request_getDataFromAPI(
      { 
        // Start - HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023
        
        "currencyPair": $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().trim(),
        "tradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "tenor_Code": $(thisTileFXAQ).find('[id^="hdnFXAQTenorCode"]').val(), // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
        "fixing_Frequency": $(thisTileFXAQ).find('[id^="hdnFixingFrequencyFXAQ"]').val(), // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
        "settlement_Frequency": $(thisTileFXAQ).find('[id^="hdnSettlementFrequencyFXAQ"]').val(), // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
        "depoCcy": pair.split("-")[0].trim(),
        "altCcy": pair.split("-")[1].trim(),
        "iProductId": _prodID, //LGTCLI-417 || RizwanS || 04 May 2023
        "i_ProductCode": _prodCode, //LGTCLI-417 || RizwanS || 04 May 2023
        "optionCut": $(thisTileFXAQ).find('[id^="Optioncutddl"]').val(),
        "firstFixingChangeYN" : "N",  
        "firstFixingDate" : "",
        "defaultFixingDate":'',
        "defaultSettDate":'',
        "i_Mode" : "FXOSEN",
        "tenor" : '',
        "prem_Settlement_Days" :'', // Added missing parameters for Date service call | ChaitanyaM | 25-April-2024
        "CurrentTileID": currId + "|" + "",
        
        // End - HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023
      },
      clientConfigdata.CommonMethods.NodeServer + "DateCalculationApi/Get_FinIQ_CalculateDatesWrapper","","POST",currId +"|" + userName + '_' + 'CalculateDates_IP'  +'_' + RequestIDGenerator(4)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
        let thisTileFXAQ = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      
        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

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

        TradeDateFXAQ = setBusinessDate;
        // Start - HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023
        $(thisTileFXAQ).find('[id^="FXAQ_Expiry"]').html(data.dataFromAjax[0].fixingDate); //LGTCLI-401 - Instant Pricer FX Final Fixing Date (FXD) | Chaitanya M | 12 April 2023
        $(thisTileFXAQ).find('[id^="hdnFXAQPremiumDate"]').val(data.dataFromAjax[0].valueDate);
        $(thisTileFXAQ).find('[id^="hdnTenorDaysAQ"]').val(data.dataFromAjax[0].expiryDays);
        // Addded for CFINT-992 // 18-Sep-2020 //

        $(thisTileFXAQ).find('[id^="hdnFXAQExpiry"]').val(data.dataFromAjax[0].fixingDate);
        $(thisTileFXAQ).find('[id^="hdnFXAQDeliveryDate"]').val(data.dataFromAjax[0].maturityDate);
        // End - HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023

        $(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("disabled", false);

        // Start LGTCLI-417 || RizwanS || 04 May 2023
        let _prodID = "";
        let _prodCode= "";
        let _prodName = "";

        if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

          _prodID = productIDFXAQ;
          _prodCode = productCodeAQ;
          _prodName = ProductNameAQ;

        }else{
          _prodID = productIDFXDQ;
          _prodCode = productCodeDQ;
          _prodName = ProductNameDQ;
        }
        //END

        setNDFMetalFlagAQ(
          TileId,
          _prodID, //LGTCLI-417 || RizwanS || 04 May 2023
          _prodCode, //LGTCLI-417 || RizwanS || 04 May 2023
          $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().trim(),
          pair.split("-")[0].trim(),
          pair.split("-")[1].trim(),
          $(thisTileFXAQ).find('[id^="hdnFixingFrequencyFXAQ"]').val(), // HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023
          $(thisTileFXAQ).find('[id^="hdnSettlementFrequencyFXAQ"]').val(), //  HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023
          $(thisTileFXAQ).find('[id^="hdnFXAQPremiumDate"]').val(),
          $(thisTileFXAQ).find('[id^="hdnFXAQExpiry"]').val(),
          $(thisTileFXAQ).find('[id^="hdnFXAQDeliveryDate"]').val()
        );

        } else {

          // Start - HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023
          let failReason = "No response received from remote system.";                       
          ValidateField($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').attr('id'), failReason, thisTileFXAQ);
          // End - HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023
       }

        //END
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

function fillFirstFixingDateFXAQ(pair, typevalAQ, that) {
  try {
    thisTileFXAQ = document.getElementById("td" + that);
    
    typevalAQ = setFrequencyType(thisTileFXAQ, typevalAQ); // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023

    if (
      typevalAQ == "MAMS1Y01" ||
      typevalAQ == "MAMS2Y02" ||
      typevalAQ == "MAMS2Y12"
    ) {
      FixingFrqAQ = FreqAQ[2];
      SettFrqAQ = FreqAQ[2];
      tenorCodeAQ = tenorArrAQ[2];
    } else if (typevalAQ == "MAMS1N00" || typevalAQ == "MAMS2N00") {
      FixingFrqAQ = FreqAQ[2];
      SettFrqAQ = FreqAQ[2];
      tenorCodeAQ = tenorArrAQ[2];
    } else if (
      typevalAQ == "WAWS1Y01" ||
      typevalAQ == "WAWS2Y02" ||
      typevalAQ == "WAWS2Y12"
    ) {
      FixingFrqAQ = FreqAQ[3];
      SettFrqAQ = FreqAQ[3];
      tenorCodeAQ = tenorArrAQ[0];
    } else if (typevalAQ == "WAWS1N00" || typevalAQ == "WAWS2N00") {
      FixingFrqAQ = FreqAQ[3];
      SettFrqAQ = FreqAQ[3];
      tenorCodeAQ = tenorArrAQ[0];
    } else if (
      typevalAQ == "BABS1Y01" ||
      typevalAQ == "BABS2Y02" ||
      typevalAQ == "BABS2Y12"
    ) {
      FixingFrqAQ = FreqAQ[1];
      SettFrqAQ = FreqAQ[1];
      tenorCodeAQ = tenorArrAQ[1];
    } else if (typevalAQ == "BABS1N00" || typevalAQ == "BABS2N00") {
      FixingFrqAQ = FreqAQ[1];
      SettFrqAQ = FreqAQ[1];
      tenorCodeAQ = tenorArrAQ[1];
    } else if (
      typevalAQ == "DAWS1Y01" ||
      typevalAQ == "DAWS2Y02" ||
      typevalAQ == "DAWS2Y12"
    ) {
      FixingFrqAQ = FreqAQ[0];
      SettFrqAQ = FreqAQ[3];
      tenorCodeAQ = tenorArrAQ[3];
    } else if (typevalAQ == "DAWS1N00" || typevalAQ == "DAWS2N00") {
      FixingFrqAQ = FreqAQ[0];
      SettFrqAQ = FreqAQ[3];
      tenorCodeAQ = tenorArrAQ[3];
    } else if (
      typevalAQ == "DAMS1Y01" ||
      typevalAQ == "DAMS2Y02" ||
      typevalAQ == "DAMS2Y12"
    ) {
      FixingFrqAQ = FreqAQ[0];
      SettFrqAQ = FreqAQ[2];
      tenorCodeAQ = tenorArrAQ[3];
    } else if (typevalAQ == "DAMS1N00" || typevalAQ == "DAMS2N00") {
      FixingFrqAQ = FreqAQ[0];
      SettFrqAQ = FreqAQ[2];
      tenorCodeAQ = tenorArrAQ[3];
    }

    $(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("disabled", true);
    $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
    clearPricerTable(thisTileFXAQ);


    // Start LGTCLI-417 || RizwanS || 04 May 2023
    let _prodID = "";
    let _prodCode= "";
    let _prodName = "";

    if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

    _prodID = productIDFXAQ;
    _prodCode = productCodeAQ;
    _prodName = ProductNameAQ;

    }else{
      _prodID = productIDFXDQ;
      _prodCode = productCodeDQ;
      _prodName = ProductNameDQ;
    }
    //END

    request_getDataFromAPI(
      {

        "CurrencyPair": $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().trim(),
        "TradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "Tenor_Code": tenorCodeAQ,
        "Fixing_Frequency": FixingFrqAQ,
        "Settlement_Frequency": SettFrqAQ,
        "EntityID": EntityID,
        "LoginID": userName,
        "DepoCcy": pair.split("-")[0].trim(),
        "AltCcy": pair.split("-")[1].trim(),
        "iProductId": _prodID, //LGTCLI-417 || RizwanS || 04 May 2023
        "I_ProductCode": _prodCode, //LGTCLI-417 || RizwanS || 04 May 2023
        "ProductCode": _prodCode, //LGTCLI-417 || RizwanS || 04 May 2023
        "optioncut": $(thisTileFXAQ).find('[id^="Optioncutddl"]').val(),
        "CurrentTileID": that + "|" + "",
      },
      clientConfigdata.CommonMethods.NodeServer + "fillFirstFixingDate","","POST",that +"|" + userName + '_' + 'fillFirstFixingDate'  +'_' + RequestIDGenerator(4)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        let thisTileFXAQ = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        let TileId = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;
        if(responseHeader.toUpperCase() == "SUCCESS"){
        //$(thisTileFXAQ).find('[id^="FirstFixDate"]').val(data.CalculateDatesResult.Dates[0].FixingDate);
        let strFirstFix = new Date(
          data.CalculateDatesResult.Dates[0].FixingDate
        );
        let firstFix =
          strFirstFix.getFullYear() +
          "-" +
          ("0" + (strFirstFix.getMonth() + 1)).substr(-2, 2) +
          "-" +
          ("0" + strFirstFix.getDate()).substr(-2, 2);
        $(thisTileFXAQ).find('[id^="FirstFixDate"]').val(firstFix);
        $(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("disabled", false);
        $(thisTileFXAQ).find('[id^="lblFirstFixDate"]').html(data.CalculateDatesResult.Dates[0].FixingDate);
        } else {

          let failReason = data.CalculateDatesResult.A_ResponseHeader.FailedReason; 
          
          ValidateField($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').attr('id'), failReason, thisTileFXAQ);

        }  
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

function fillDatesONFirstFixAQ(pair, typeval, NoofFixing, custDate, that) {
  try {
    thisTileFXAQ = document.getElementById("td" + that);

    FreqFXAQType = setFrequencyType(thisTileFXAQ, typeval); // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023

    SetDateValues(FreqFXAQType ,NoofFixing, thisTileFXAQ, FreqAQ, tenorArrAQ); // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023

    // Addded for CFINT-992 // 18-Sep-2020 //

    $(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("disabled", true);
    $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
    clearPricerTable(thisTileFXAQ);


    // Start LGTCLI-417 || RizwanS || 04 May 2023
    let _prodID = "";
    let _prodCode= "";

    if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

      _prodID = productIDFXAQ;
      _prodCode = productCodeAQ;

    }else{
       _prodID = productIDFXDQ;
       _prodCode = productCodeDQ;
    }
    //END

    request_getDataFromAPI(
      {

        "EntityID": EntityID,
        "LoginID": userName,
        "DepoCcy": pair.split("-")[0].trim(),
        "AltCcy": pair.split("-")[1].trim(),
        "CurrencyPair": $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().trim(),
        "TradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "Tenor_Code": $(thisTileFXAQ).find('[id^="hdnFXAQTenorCode"]').val(), // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
        "Fixing_Frequency": $(thisTileFXAQ).find('[id^="hdnFixingFrequencyFXAQ"]').val(), // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
        "Settlement_Frequency": $(thisTileFXAQ).find('[id^="hdnSettlementFrequencyFXAQ"]').val(), // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
        "iProductId": _prodID, //LGTCLI-417 || RizwanS || 04 May 2023
        "I_ProductCode": _prodCode, //LGTCLI-417 || RizwanS || 04 May 2023
        "ProductCode": _prodCode, //LGTCLI-417 || RizwanS || 04 May 2023
        "FirstFixingDate": custDate,
        // "CurrentTileID":that,
        // "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "optioncut": $(thisTileFXAQ).find('[id^="Optioncutddl"]').val(),
        "CurrentTileID": TileId + "|" + "",
      },
      clientConfigdata.CommonMethods.NodeServer + "filldatesafterFix","","POST",that +"|" + userName + '_' + 'filldatesafterFix'  +'_' + RequestIDGenerator(4)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        let thisTileFXAQ = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

        if(responseHeader.toUpperCase() == "SUCCESS"){

        $(thisTileFXAQ).find('[id^="FXAQ_Expiry"]').html("");

        $(thisTileFXAQ).find('[id^="hdnFXAQExpiry"]').val("");

        $(thisTileFXAQ).find('[id^="hdnFXAQDeliveryDate"]').val("");

        $(thisTileFXAQ).find('[id^="FXAQ_Expiry"]').html(data.CalculateDatesResult.Dates[0].FixingDate); //LGTCLI-401 - Instant Pricer FX Final Fixing Date (FXD) | Chaitanya M | 12 April 2023

        $(thisTileFXAQ).find('[id^="hdnFXAQExpiry"]').val(data.CalculateDatesResult.Dates[0].FixingDate);

        $(thisTileFXAQ).find('[id^="hdnFXAQDeliveryDate"]').val(data.CalculateDatesResult.Dates[0].MaturityDate);

        $(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("disabled", false);

        } else {

          let failReason = data.CalculateDatesResult.A_ResponseHeader.FailedReason; 
          
          ValidateField($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').attr('id'), failReason, thisTileFXAQ);

      } 
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

function checkAQComboType(ComboTypeAQ, thisTileFXAQ) {
  try {

   // START - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
   let _FXAQFreqName = $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val();  
    
    if(!$(thisTileFXAQ).find('[id^="rbRowKIToggleAQ"]')[0].checked){      
      
      if(_FXAQFreqName.includes("BABS")){
        if(ComboTypeAQ=="BABS1N00"){
          ComboTypeAQ = "BABS1Y01"
        }else{
          ComboTypeAQ = "BABS2Y02"
        }
      }else if(_FXAQFreqName.includes("MAMS")){
        if(ComboTypeAQ=="MAMS1N00"){
          ComboTypeAQ = "MAMS1Y01"
        }else{
          ComboTypeAQ = "MAMS2Y02"
        }
      }else if(_FXAQFreqName.includes("WAWS")){
        if(ComboTypeAQ=="WAWS1N00"){
          ComboTypeAQ = "WAWS1Y01"
        }else{
          ComboTypeAQ = "WAWS2Y02"
        }
      } 

    }

    frequencyFAQ = ComboTypeAQ;
    
    if (ComboTypeAQ == "MAMS1Y01" || ComboTypeAQ == "MAMS2Y02" || ComboTypeAQ == "MAMS2Y12" ) {
      
      $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').prop("disabled", false);
    
    } else if (ComboTypeAQ == "MAMS1N00" || ComboTypeAQ == "MAMS2N00") {

      $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val("").prop("disabled", true);

    } else if (ComboTypeAQ == "WAWS1Y01" || ComboTypeAQ == "WAWS2Y02" || ComboTypeAQ == "WAWS2Y12") {
      
      $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').prop("disabled", false);
  
    } else if (ComboTypeAQ == "WAWS1N00" || ComboTypeAQ == "WAWS2N00") {
     
      $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val("").prop("disabled", true);
  
    } else if (ComboTypeAQ == "BABS1Y01" || ComboTypeAQ == "BABS2Y02" || ComboTypeAQ == "BABS2Y12") {

      $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').prop("disabled", false);

    } else if (ComboTypeAQ == "BABS1N00" || ComboTypeAQ == "BABS2N00") {

      $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val("").prop("disabled", true);

    } else if (ComboTypeAQ == "DAWS1Y01" || ComboTypeAQ == "DAWS2Y02" || ComboTypeAQ == "DAWS2Y12") {

      $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').prop("disabled", false);

    } else if (ComboTypeAQ == "DAWS1N00" || ComboTypeAQ == "DAWS2N00") {

      $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val("").prop("disabled", true);

    } else if (ComboTypeAQ == "DAMS1Y01" || ComboTypeAQ == "DAMS2Y02" || ComboTypeAQ == "DAMS2Y12") {

      $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').prop("disabled", false);

    } else if (ComboTypeAQ == "DAMS1N00" || ComboTypeAQ == "DAMS2N00") {

      $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val("").prop("disabled", true);

    }
    
    // END - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
  } catch (er) {
    console.log(er.message);
  }
}

//To Get Best Price of FXAQ and display the prices
function getBestPriceFXAQ(that, Scheduleflag) {
  try {
    TileIdFXAQ = that.id.match(/\d+$/)[0];
    thisTileFXAQ = document.getElementById("td" + TileIdFXAQ);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
    validation_clear(); //To Remove highlighted part if no error
 
    // Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
  
    // START - LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023    
    resetFXDPrice(thisTileFXAQ); // LGTGTWINT-2331 | Chaitanya M | 22 Aug 2023

    $(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("disabled", true);
    let _RID_AQ = "";
    _RID_AQ = _RID_AQ + RequestIDGenerator(30);
    $(thisTileFXAQ).find('[id^="hdnRequestID"]').val(_RID_AQ);
    // END - LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
     
    // END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
     
    checkAQComboType($(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val(),thisTileFXAQ); // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023

    //Validation conditions

    if ($.trim($(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val()) == "") {
      ValidateField($(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').attr("id"),"Please Select Currency Pair",thisTileFXAQ);
      return false;
    } else if (
      $.trim($(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').val()) == "" ||
      parseFloat($(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').val()) == 0
    ) {
      ValidateField($(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').attr("id"),"Please Enter Valid Contract Amount",thisTileFXAQ);
      return false;
    } // Removed as validation is added below | Chaitanya M | 27-Oct-2023
    else if (
      $.trim($(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').val().replace(/,/g, "")) == "" ||
      $.trim($(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').val().replace(/,/g, "")) == 0
    ) {
      ValidateField($(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').attr("id"),"Please Enter Valid No Of Settlements.",thisTileFXAQ);
      return false;
    } else if (
      $.trim($(thisTileFXAQ).find('[id^="GauranteeFXAQ"]').val()) == ""
    ) {
      ValidateField($(thisTileFXAQ).find('[id^="GauranteeFXAQ"]').attr("id"),"Please Enter Valid Gaurantee Period",thisTileFXAQ);
      return false;
    } else if (
      $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "") == "" ||
      $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "") <= 0
    ) {
      ValidateField($(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').attr("id"),"Please Enter Valid Barrier",thisTileFXAQ);
      return false;
    }  // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    else if($(thisTileFXAQ).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("PREMIUM")){
      if ( $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val().replace(/,/g, "") == "" || $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val().replace(/,/g, "") <=0) {
        ValidateField($(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').attr("id"),"Please Enter Valid Strike Rate",thisTileFXAQ);
        return false;
      }      
    }else if($(thisTileFXAQ).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")){
      if ( $(thisTileFXAQ).find('[id^="PremiumipboxFX"]').val().replace(/,/g, "") == "" || $(thisTileFXAQ).find('[id^="PremiumipboxFX"]').val().replace(/,/g, "") <=0) {
        ValidateField($(thisTileFXAQ).find('[id^="PremiumipboxFX"]').attr("id"),"Please Enter Valid Premium.",thisTileFXAQ);
        return false;
      } 
    //END
    }

    //LGTCLI-417 || RizwanS || 04 May 2023

    if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {
      if (parseFloat($(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "")) <= parseFloat($(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val().replace(/,/g, ""))
      ) {
        ValidateField($(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').attr("id"),"Barrier should be greater than spot and strike",thisTileFXAQ);
        return false;
      }
    }else if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Sell") {
      if (parseFloat($(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "")) >= parseFloat($(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val().replace(/,/g, ""))
      ) {
        ValidateField($(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').attr("id"),"Barrier should be less than Spot and Strike",thisTileFXAQ);
        return false;
      }
    }
    //END

    if (frequencyFAQ.includes("N") == false) {
      if ($.trim($(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val().replace(/,/g, "")) == "" || $.trim($(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val().replace(/,/g, "")) == 0) {
        ValidateField($(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').attr("id"),"Please Enter Valid KI.",thisTileFXAQ);
        return false;
      }
    }

    let prmiumDate = new Date($(thisTileFXAQ).find('[id^="hdnFXAQPremiumDate"]').val());
    let FixingDate = new Date($(thisTileFXAQ).find('[id^="FirstFixDate"]').val());
    let tradedate = new Date(TradeDateFXAQ);

    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",];
    let weekday = new Date($(thisTileFXAQ).find('[id^="FirstFixDate"]').val());
    let dayName = days[weekday.getDay()];

    if (
      dayName.toUpperCase().includes("SAT") ||
      dayName.toUpperCase().includes("SUN")
    ) {
      ValidateField($(thisTileFXAQ).find('[id^="FirstFixDate"]').attr("id"),"First Fixing Date should not fall on holiday.",thisTileFXAQ);
      return false;
    }
    if (
      $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val().includes("DAWS") ||
      $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val().includes("DAMS")
    ) {
      if (FixingDate.getTime() < tradedate.getTime()) {
        ValidateField($(thisTileFXAQ).find('[id^="FirstFixDate"]').attr("id"),"First fixing should not be less than Trade Date.",thisTileFXAQ);
        return false;
      }
    }
    
    // LGTCLI-370 Instant Pricer First Fixing Date Next Day || Chaitanya M || 27 March 2023

    // else {
    //   if (prmiumDate.getTime() > FixingDate.getTime()) {
    //     ValidateField($(thisTileFXAQ).find('[id^="FirstFixDate"]').attr("id"),"First fixing should not be less than Premium date.",thisTileFXAQ);
    //     return false;
    //   }
    // }
    // else if ($(thisTileFXAQ).find('[id^="SalesSpreadFXAQ"]').val().replace(/,/g, "") == "" || $(thisTileFXAQ).find('[id^="SalesSpreadFXAQ"]').val().replace(/,/g, "") <=0 ) {
    // ValidateField($(thisTileFXAQ).find('[id^="SalesSpreadFXAQ"]').attr('id'), "Please Enter Valid Sales Spread",thisTileFXAQ);
    // return false
    // }
    // Validation END

    //End
    
    $(thisTileFXAQ).find('[id^="loader_FXAQ"]').show(); // Disabling book trade button while pricing is happening
    $(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("disabled", true); // LGTGTWINT-2110 | Chaitanya M | 13 July 2023
    $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true);
    $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true); 
    $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023

    // Check for KIStyle

    // START - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
    if (frequencyFAQ.includes("N") == false) {
      if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {
        if (
          $.trim($(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val().replace(/,/g, "")) >= $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val().replace(/,/g, "")
        ) {
          ValidateField($(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').attr("id"),"KI Rate cannot be greater than or equal to strike.",thisTileFXAQ);
          return false;
        }
      }else{

        if (
          $.trim($(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val().replace(/,/g, "")) <= $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val().replace(/,/g, "")
        ) {
          ValidateField($(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').attr("id"),"KI Rate cannot be less than or equal to strike.",thisTileFXAQ);
          return false;
        }

      }
      
    }

    if (frequencyFAQ.includes("1N") || frequencyFAQ.includes("2N")) {
      KIStyleAQ = KIstyleArrAQ[0];
    } else if (frequencyFAQ.includes("01")) {
      KIStyleAQ = KIstyleArrAQ[1];
    } else if (frequencyFAQ.includes("02")) {
      KIStyleAQ = KIstyleArrAQ[2];
    } else if (frequencyFAQ.includes("12")) {
      KIStyleAQ = KIstyleArrAQ[3];
    }
    // END

    // Check For Leverage

    if (
      frequencyFAQ.includes("1Y") ||
      frequencyFAQ.includes("1N")
    ) {
      LeverageFXAQ = LeverageArrayAQ[0];
    } else if (
      frequencyFAQ.includes("2Y") ||
      frequencyFAQ.includes("2N")
    ) {
      LeverageFXAQ = LeverageArrayAQ[1];
    }
    // END

    // Check For Settlement Freq.

    if (frequencyFAQ.includes("BABS")) {
      SettFreqAQ = FreqAQArr[0];
    } else if (
      frequencyFAQ.includes("DAMS")
    ) {
      SettFreqAQ = FreqAQArr[4];
    } else if (
      frequencyFAQ.includes("WAWS")
    ) {
      SettFreqAQ = FreqAQArr[2];
    } else if (
      frequencyFAQ.includes("MAMS")
    ) {
      SettFreqAQ = FreqAQArr[1];
    } else if (
      frequencyFAQ.includes("DAWS")
    ) {
      SettFreqAQ = FreqAQArr[3];
    }
    
    // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023

    // LGTCLI-285 -Instant Pricing TARF PM Prem CCY in 1st CCY || RizwanS || 01 Feb 2023

    let _premCcy = "";

    if($(thisTileFXAQ).find('[id^="hdnisMetalFX"]').val() == "Y"){ // LGTCLI-437 | Chaitanya M | 11 July 2023

      _premCcy =  $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[1].trim();
      
    }else{

      _premCcy =  $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim();

    }

    // END

    // Start LGTCLI-417 || RizwanS || 04 May 2023
    let _prodID = "";
    let _prodCode= "";
    let _prodName = "";
    let _LPList = "";
    let _buysell = "";
    let _tempCode = "";
    let _templateID = "";

    if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

      _prodID = productIDFXAQ;
      _prodCode = productCodeAQ;
      _prodName = ProductNameAQ;

      // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      if(AllowSolveForYN === "YES"){
        if ($(thisTileFXAQ).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {
          _LPList = LPListFXAQ.split("|")[1];
        }else{
          _LPList = LPListFXAQ.split("|")[0];
        }
      }else{
        _LPList = LPListFXAQ.split("|")[0];
      }
      // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      
      _buysell = "Buy";
      _opType = "Call";
      _templateID = TemplateIDFXAQ;
      _tempCode = TemplateCodeFXAQ;
      _minQuoteTimeAQDQ = MinQuoteTimeOutAQ; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
      _maxQuoteTimeAQDQ = MaxQuoteTimeOutAQ; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023

    }else{

      _prodID = productIDFXDQ;
      _prodCode = productCodeDQ;
      _prodName = ProductNameDQ; 
      _TempID = TemplateIDFXDQ;

      // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      if(AllowSolveForYN === "YES"){
        if ($(thisTileFXAQ).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {
          _LPList = LPListFXDQ.split("|")[1];
        }else{
          _LPList = LPListFXDQ.split("|")[0];
        }
      }else{
        _LPList = LPListFXDQ.split("|")[0];
      }
      // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      
      _buysell = "Sell";
      _opType = "Put";
      _templateID = TemplateIDFXDQ;
      _tempCode = TemplateCodeFXDQ;
      _minQuoteTimeAQDQ = MinQuoteTimeOutDQ; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
      _maxQuoteTimeAQDQ = MaxQuoteTimeOutDQ; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023

    }
    //END

    //LGTGTWINT-2110 | Chaitanya M | 13 June 2023
    if(isRFS){
      timeoutFXAQ = parseInt(_minQuoteTimeAQDQ) - 1 ;
      $(thisTileFXAQ).find('[id^="hdntimerFX"]').val("");
      $(thisTileFXAQ).find('[id^="hdntimerFX"]').val(timeoutFXAQ);
    } 
   //End
    console.log("PricingFor ::", TileIdFXAQ, _prodCode); //Removed unwanted console log || RizwanS || 08 May 2023
    
    // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
    let _strikeFXAQ="";
    let _premiumFXAQ="";
    let _SolveForFXAQ = "";
    let ShowRFSAQ =""; //SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023

    if(AllowSolveForYN === "YES"){
      if ($(thisTileFXAQ).find('[id^="ddlSolveForFX"]').val().toUpperCase().includes("STRIKE")) {

        _strikeFXAQ = "0";
        _premiumFXAQ = $(thisTileFXAQ).find('[id^="PremiumipboxFX"]').val().replace(/,/g, "");
        _SolveForFXAQ = $(thisTileFXAQ).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase();
        ShowRFSAQ = isRFS === true ? false : isRFS;  //SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023

      } else {

        _strikeFXAQ = $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val().replace(/,/g, "");
        _premiumFXAQ = "0";
        _SolveForFXAQ = $(thisTileFXAQ).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase();
        ShowRFSAQ = isRFS ; // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023

      }
    }else{

      _strikeFXAQ = $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val().replace(/,/g, "");
      _premiumFXAQ = "0";
      _SolveForFXAQ = "PREMIUM";
      ShowRFSAQ = isRFS ; // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023

    }

    // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

    // KI CHeck
    let KIYN = "";
    let _LowerBarrier = '0'; 
    let _UpperBarrier = '0';
    let _KORate = "";
    let _KIRate = "";
    if(!$(thisTileFXAQ).find('[id^="rbRowKIToggleAQ"]')[0].checked){ 
      
      KIYN = "Yes";

      if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

        _UpperBarrier = $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "");
        _LowerBarrier = $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val().replace(/,/g, "");

        _KORate = $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "");
        _KIRate = $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val().replace(/,/g, "");

      }else{
        
        _UpperBarrier = $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val().replace(/,/g, "");
        _LowerBarrier = $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "");

        _KIRate = $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val().replace(/,/g, "");
        _KORate = $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "");

      }
      
    }else{
      
         KIYN = "No";
        _UpperBarrier = $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, ""); 
        _KORate = $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "");       
    }

    // Start - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
    // let _LowerBarrier = '0'; 
    // let _UpperBarrier = '0';
    // if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {
      
    //   _LowerBarrier = $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val().replace(/,/g, "");
    //   _UpperBarrier = $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "");
      

    // }else if(this.Product_Code === 'FXAQ'){
    //   _LowerBarrier = $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val().replace(/,/g, "");
    //   _UpperBarrier = $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "")
    // }
    // End - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023


    let xmlstrFXAQ =
      "<ExcelSheets>" +
      "<Sheet1>" +
      "<Product_Name>" + _prodName +"</Product_Name>" + //LGTCLI-417 || RizwanS || 04 May 2023
      "<Hedging_x0020_Type>" +clientConfigdata.FXDCommonMethods.Hedging_Type +"</Hedging_x0020_Type>" +
      // "<CustID>" + custID + "</CustID>" +
      // "<Customer_Name>" + custName +"</Customer_Name>" +
      "<GuaranteedPeriods>" + $(thisTileFXAQ).find('[id^="GauranteeFXAQ"]').val() + "</GuaranteedPeriods>" +
      "<OptionCut>" + $(thisTileFXAQ).find('[id^="Optioncutddl"]').val() + "</OptionCut>" +
      "<KO>" + _KORate + "</KO>" + // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
      "<FirstFixingDate>" + $(thisTileFXAQ).find('[id^="FirstFixDate"]').val() + "</FirstFixingDate>" +
      "<NonDeliveryYN>"+ $(thisTileFXAQ).find('[id^="hdnNDFFlagFX"]').val()  +"</NonDeliveryYN>" + // HSBCFXEINT-25 || Chaitanya M  || 24-Jan 2024 //HSBCFXEINT-25 || RizwanS || 14 Dec 2023
      "<FixingSettFreq>" + SettFreqAQ + "</FixingSettFreq>" +
      "<Currency1>" +  $(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').val() +  "</Currency1>" +
      "<CcyPair>" + $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().trim() +  "</CcyPair>" +
      "<PremiumCcy>" +  _premCcy + "</PremiumCcy>" +
      "<CustPrem>0</CustPrem>" +
      "<BuySell>"+ _buysell.toUpperCase()+"</BuySell>" + //LGTCLI-417 || RizwanS || 04 May 2023
      "<Spotrate>" + $(thisTileFXAQ).find('[id^="rateFXAQ"]').html().split("/")[1].replace(/,/g, "").trim() + "</Spotrate>" +
      "<LeverageFactor>" + LeverageFXAQ + "</LeverageFactor>" +
      "<Ccy1PerFixing>" + $(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').val().replace(/,/g, "") + "</Ccy1PerFixing>" +
      "<TradeDate>" + setBusinessDate + "</TradeDate>" +
      "<PremiumDate>" + $(thisTileFXAQ).find('[id^="hdnFXAQPremiumDate"]').val() + "</PremiumDate>" +
      "<FixingDate>" + $(thisTileFXAQ).find('[id^="hdnFXAQExpiry"]').val() + "</FixingDate>" +
      "<SettDate>" + $(thisTileFXAQ).find('[id^="hdnFXAQDeliveryDate"]').val() + "</SettDate>" +
      "<TenorDays>" +  $(thisTileFXAQ).find('[id^="hdnTenorDaysAQ"]').val() + "</TenorDays>" +
      "<Tenor>" + $(thisTileFXAQ).find('[id^="hdnFXAQTenorCode"]').val() + "</Tenor>" +
      "<Strike>" + _strikeFXAQ + "</Strike>" +  //SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      "<KIBarrierType>"+ KIYN +"</KIBarrierType>" + // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
      "<KIYesNo>"+ KIYN +"</KIYesNo>" + // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
      "<KI>" + _KIRate + "</KI>" + // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
      "<KIStyle>" + KIStyleAQ + "</KIStyle>" +
      "<EntityID>" + sessionStorage.getItem("HomeEntityID") + "</EntityID>" +
      "<CAI_ID>" + clientConfigdata.FXDCommonMethods.CAI_ID + "</CAI_ID>" +
      "<NoofSett>" + $(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').val() + "</NoofSett>" +
      "</Sheet1>" +
      "</ExcelSheets>";

    $(thisTileFXAQ).find('[id^="hdnXmlStrFXAQ"]').val(xmlstrFXAQ);
    if (Scheduleflag) {
      GetRulescheduleFXD(
        TileIdFXAQ,
        xmlstrFXAQ,
        _tempCode , //LGTCLI-417 || RizwanS || 04 May 2023
        _templateID  //LGTCLI-417 || RizwanS || 04 May 2023
      );
    } else {
      // Added by RizwanS / Channged User id to gateway specific name / 16 Jun 2022
      USERID_FXAQ = "MGU_" + sessionStorage.getItem("Username");
      $(thisTileFXAQ).find('[id^="hdnUserIDFXAQ"]').val(USERID_FXAQ);

      mapleLoaderStart(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      if( $(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').val() ==  $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[1].trim()){
        _AlternateCCy = $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim();
      }else{
        _AlternateCCy = $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[1].trim();

      }

      request_getDataFromAPI(
      {
        ProductType: _prodCode,  //LGTCLI-417 || RizwanS || 04 May 2023
        CurrencyPair: $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().trim(),
        DepositCurrency: $(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').val(),
        AlternateCurrency: _AlternateCCy, //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023           
        PremCurrency:_premCcy,
        SettlementCcy: _premCcy,
        AmountInDepositCurrency: $(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').val().replace(/,/g, "").split(".")[0],
        Strike: _strikeFXAQ,  //SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        SolveFor : _SolveForFXAQ,  //SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        MarketPremiumAmount : _premiumFXAQ,  //SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        UpperBarrier:_UpperBarrier === '' ? '0' : _UpperBarrier, // HSBCPBIN-502 | Chaitanya M | 27 Sep 2023
        LowerBarrier: _LowerBarrier === '' ? '0' : _LowerBarrier, // HSBCPBIN-502 | Chaitanya M | 27 Sep 2023
        Tenor: $(thisTileFXAQ).find('[id^="hdnFXAQTenorCode"]').val(),
        TradeDate: setBusinessDate,
        ValueDate: $(thisTileFXAQ).find('[id^="hdnFXAQPremiumDate"]').val(),
        FixingDate: $(thisTileFXAQ).find('[id^="hdnFXAQExpiry"]').val(),
        MaturityDate: $(thisTileFXAQ).find('[id^="hdnFXAQDeliveryDate"]').val(),
        NDFFlag: $(thisTileFXAQ).find('[id^="hdnNDFFlagFX"]').val() ,// HSBCFXEINT-25 || Chaitanya M  || 24-Jan 2024
        IsMetal: $(thisTileFXAQ).find('[id^="hdnisMetalFX"]').val(), // LGTCLI-437 | Chaitanya M | 11 July 2023
        UserID:  sessionStorage.getItem("Username"),
        EntityId: sessionStorage.getItem("HomeEntityID"),
        PriceProviderDetails: _LPList, //LGTCLI-417 || RizwanS || 04 May 2023
        ExternalXMLString: xmlstrFXAQ,
        TemplateCode: _tempCode, 
        TemplateID: _templateID, 
        ProductID: _prodID, 
        ProductCode: _prodCode, 
        OptionCut: $(thisTileFXAQ).find('[id^="Optioncutddl"]').val(),
        CurrentTileID: TileIdFXAQ +  "|" + $(thisTileFXAQ).find('[id^="hdnRequestID"]').val(),
        RequestID: TileIdFXAQ +"|" + userName + '_' + 'getPriceFXAQDQ_' + $(thisTileFXAQ).find('[id^="hdnRequestID"]').val(), // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
        BuySell: _buysell.toUpperCase(), //LGTCLI-417 || RizwanS || 04 May 2023
        Mode : 'FXOSEN', // HSBCPBIN-502 | Chaitanya M | 27 Sep 2023
        PriceMode: ShowRFSAQ,  // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 19 Nov 2023 |||  Added for SignalR Request || RizwanS || 28 April 2023
        CallPut : _opType,
        ShowLegWisePremium: true,
        BarrierType : KIYN,
        CIF_Code : "",
        Strategy_Code : "",
        BTB_Protfolio_Code : "",
        KnockIn_Style: "",
        Marketer_Code: "",
        KnockOut_Style: "",
        MarketPremium: "0",
        RMMarginPercentage :"0.0",
        DI_YN:'',
        KIType:'' ,
        Remark :'' ,
        CapLoss :'' ,
        DCDRFQID :'' ,
        GroupKey :'' ,
        Frequency :SettFreqAQ,
        CapLossCcy :'' ,
        TargetType :'' ,
        PayAtStrike :'' ,
        AdjustmentYN :'' ,
        PricingModel :'' ,
        CapLossAmount :'' ,
        AdjustmentType :'' ,
        ResponseMethod :'' ,
        DIfromTradeIdea :'' ,
        Parant_DCDRFQID :'' ,
        StrikeAdjustment :'' ,
        CustomerPremAmount :'' ,
        GuaranteedLeverageYN :'' ,
        Bank_Prem_CashFlow_Direction :'' ,
        Target:'' ,
        RFQSource:"Instant_Pricer",
        IndicativeQuote: "False",
        Deal_Rate2: "",
        NoteMasterID: "0",
        blnIsMultiLeg: true,
        InternalLPID: "",
        NotionalInPremCcy: "0",

      },clientConfigdata.CommonMethods.NodeServer + "fxobestprice/GetFXOPriceFromExternalProvidersJSON","","POST",TileIdFXAQ +"|" + userName + '_' + 'getPriceFXAQDQ'  +'_' + RequestIDGenerator(4)).then((dataFXAQ) => { // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        thisTileFXAQ = document.getElementById("td" + dataFXAQ.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = dataFXAQ.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        if($(thisTileFXAQ).find('[id^="hdnRequestID"]').val() != dataFXAQ.CurrentTileID.split("|")[1] || $(thisTileFXAQ).find('[id^="hdnRequestID"]').val() === ""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          return false;

        } //END

        // LGTGTWINT-2128 || RizwanS || 09 Jun 2023
        // let responseHeader = dataFXAQ.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.Status;

        let responseHeader = "";
        if(dataFXAQ === "" || dataFXAQ === undefined || dataFXAQ === null){
          responseHeader = "FAIL";
        }else{
          if(dataFXAQ.dataFromAjax === "" || dataFXAQ.dataFromAjax === undefined || dataFXAQ.dataFromAjax === null){
            responseHeader = "FAIL";
          }else{
            responseHeader = "SUCCESS";
          }
        }

        let _dcdRFQID = "";
        if (responseHeader.toUpperCase() === "SUCCESS") {
          const o_DCDRFQID = dataFXAQ.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID;
          if (o_DCDRFQID && o_DCDRFQID !== null && o_DCDRFQID !== undefined) {
            _dcdRFQID = o_DCDRFQID;
          }
        }   
        //END

        // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
        if(_SolveForFXAQ === "PREMIUM"){  

          // LGTGTWINT-1934 FXD | Dynamic pricing on Instant pricer || RizwanS || 20 May 2023          
          if(isRFS){

            if(responseHeader.toUpperCase() == "SUCCESS"){  // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 
            
            let _priceObj = dataFXAQ.dataFromAjax.oPriceResponseBody;

              //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
              $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);  //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              //End
              
              $(thisTileFXAQ).find('[id^="hdnRFSID"]').val(dataFXAQ._requestID);     // LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

              if (_priceObj.length > 0) {

                $(thisTileFXAQ).find('[id^="hdnNMID"]').val(_priceObj[0].NoteMasterID); 
                $(thisTileFXAQ).find('[id^="hdno_DCDRFQID"]').val(_priceObj[0].o_DCDRFQID);

                let quoteString = "";
                for (i = 0;i < _priceObj.length;i++) {
                  let quoteId = _priceObj[i].quoteId;
                  quoteString += quoteString.length == 0 ? quoteId : "," + quoteId;
                }
                
                dictFXD[dataFXAQ.currentTile] = quoteString; //To add element in dictionary
                $(thisTileFXAQ).find('[id^="hdnPricesFXObj"]').val(JSON.stringify(dataFXAQ));
                $(thisTileFXAQ).find('[id^="hdnQuoteString"]').val(quoteString);                                
                callHub(quoteString, _maxQuoteTimeAQDQ);       
              // START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
                setminimumtimoutFXAQ(_minQuoteTimeAQDQ,thisTileFXAQ,$(thisTileFXAQ).find('[id^="hdnRFSMinTimer"]')[0], dataFXAQ._requestID);       //  LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023                       
                startRFSTimerFXAQ(thisTileFXAQ,$(thisTileFXAQ).find('[id^="hdntimerInterval"]')[0], dataFXAQ._requestID);  //LGTGTWINT-2110 | Chaitanya M | 13 June 2023
                // End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
                return false;            
              }

            }else{

            //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
            if(_dcdRFQID !== ""){
              $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
              $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
            }
            //End

              MapPricesFXAQ(dataFXAQ,thisTileFXAQ,false);  // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 
            }

          }else{

          //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
          if(_dcdRFQID !== ""){
            $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
            $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
          }
          //End      
          
            MapPricesFXAQ(dataFXAQ,thisTileFXAQ,false); // LGTGTWINT-1934 || RizwanS || 02 May 2023 
          }//END

        }else{
 
          if(_dcdRFQID !== ""){
            $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
            $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
          }              
          MapPricesFXAQ(dataFXAQ,thisTileFXAQ,false); 

        }
        // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

      });
    }
  } catch (error) {
    console.log(error.message); 
  }
}

// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
function startRFSTimerFXAQ(thisTileFXAQ, uniqueTimeoutID, _requestID){
  try {
         
    //$(thisTileFXAQ).find('[id^="hdntimerInterval"]').val() = setInterval(function() {  
    uniqueTimeoutID.value = setInterval(function() {

     // Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
      if($(thisTileFXAQ).find('[id^="hdnRequestID"]').val() != _requestID || $(thisTileFXAQ).find('[id^="hdnRequestID"]').val()===""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

       // mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);
        return false;

      }
      // END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

      showtimerYNFXAQ="Y";        
        
      if(Number($(thisTileFXAQ).find('[id^="hdntimerFX"]').val())>=0) {  

        if($(thisTileFXAQ).find('[id^="hdnPrices"]').val() === "" || $(thisTileFXAQ).find('[id^="hdnPrices"]').val() === null || $(thisTileFXAQ).find('[id^="hdnPrices"]').val() === undefined ){

          $(thisTileFXAQ).find('[id^="TimerDiv"]').removeClass("Showtimer");      
          //$(thisTileFXAQ).find('[id^="SignalRTimer"]').html(Number($(thisTileFXAQ).find('[id^="hdntimerFX"]').val()));
          $(thisTileFXAQ).find('[id^="hdntimerFX"]').val(Number($(thisTileFXAQ).find('[id^="hdntimerFX"]').val()) - 1) ;
      
        }else{

          $(thisTileFXAQ).find('[id^="btnemailquote"]').attr("disabled", true);
          $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true);
          $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);  

          $(thisTileFXAQ).find('[id^="TimerDiv"]').addClass("Showtimer");        
          $(thisTileFXAQ).find('[id^="SignalRTimer"]').attr('title', 'You can place order after '+ Number($(thisTileFXAQ).find('[id^="hdntimerFX"]').val())+ ' seconds.');               
          $(thisTileFXAQ).find('[id^="SignalRTimer"]').html(Number($(thisTileFXAQ).find('[id^="hdntimerFX"]').val()));
          $(thisTileFXAQ).find('[id^="hdntimerFX"]').val(Number($(thisTileFXAQ).find('[id^="hdntimerFX"]').val()) - 1) ;
          
        }

      }else{

        $(thisTileFXAQ).find('[id^="TimerDiv"]').removeClass("Showtimer");                      
        $(thisTileFXAQ).find('[id^="SignalRTimer"]').html(''); 
        $(thisTileFXAQ).find('[id^="btnemailquote"]').attr("disabled", false);
        $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", false);
        $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", false);    
        //stopRFSTimer(uniqueTimeoutID,thistile,"showtimerYNFXAQ");    
        
        clearInterval(uniqueTimeoutID.value);
        uniqueTimeoutID.value ="";

      }    

    },1000); 
 
  } catch (error) {
    
  }
}
// End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023

// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
function setminimumtimoutFXAQ(_minQuoteTimeAQDQ, thisTileFXAQ, _uniqueMinTimerid,_requestID){
  try {

    if($(thisTileFXAQ).find('[id^="hdnRequestID"]').val() != _requestID || $(thisTileFXAQ).find('[id^="hdnRequestID"]').val() === ""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

     // mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);
      return false;

    } 
   _uniqueMinTimerid.value = setTimeout(minQuoteTimeOccurredFXAQ,parseInt(_minQuoteTimeAQDQ) * 1000,thisTileFXAQ,$(thisTileFXAQ).find('[id^="hdnRFSMinTimer"]')[0],_requestID); // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
  } catch (error) {
    console.log(error.message); 
  }
}
// End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
// END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
function closetimerFXAQ(intervalid,thistile){
  try {
    
   // if($(thistile).find('[id^="SignalRTimer"]').html() == ""){
    clearTimeout(intervalid.value);
    showtimerYNFXAQ="N";
    //}

  } catch (error) {
    console.log(error.message);
  }
}
// End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023

//FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
function minQuoteTimeOccurredFXAQ(thistile,_uniqueMinTimerid, _requestID){
  try{

    MinQuoteTimeOutOccurredFXAQ = true;

    if($(thistile).find('[id^="hdnRequestID"]').val() != _requestID || $(thistile).find('[id^="hdnRequestID"]').val()===""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

     // mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);
      return false;

    }     

    if($(thistile).find('[id^="hdnsignalRMsgRecv"]').val().toUpperCase() === "YES"){ 
    
 
      mapleLoaderStop(thistile,'[id^="btnBestPriceFXAQ"]',false);
      $(thistile).find('[id^="btnBestPriceFXAQ"]').attr("disabled", false);
      $(thistile).find('[id^="btnemailquote"]').attr("disabled", false);
      $(thistile).find('[id^="btnBookReqFXAQ"]').attr("disabled", false);
      $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", false);  
      $(thistile).find('[id^="hdnsignalRMsgRecv"]').val("NO");
      
      MinQuoteTimeOutOccurredFXAQ = false;
      UnsubcribeRFQID(thistile);
      clearInterval(_uniqueMinTimerid.value);
      _uniqueMinTimerid.value ="";

      // End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023

    }else{
      
      clearInterval(_uniqueMinTimerid.value);
      _uniqueMinTimerid.value ="";
      maxQuoteTimeOutRFSFXAQ(thistile, $(thistile).find('[id^="hdnRFSMaxTimer"]')[0],_requestID); // LGTGTWINT-2110 | Chaitanya M | 13 July 2023

    }

  }catch(error){
    console.log(error.message); 
  }
}
// End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
//End - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

// FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
// START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023 
// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
function maxQuoteTimeOutRFSFXAQ(thistile, _uniqueMaxTimerid,_requestID){
  try{
     
    MaxQuoteTimeOut = parseInt(_maxQuoteTimeAQDQ) - parseInt(_minQuoteTimeAQDQ);

    if($(thistile).find('[id^="hdnRequestID"]').val() != _requestID || $(thistile).find('[id^="hdnRequestID"]').val()===""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);
      return false;

    } 

    _uniqueMaxTimerid.value = setTimeout(() =>{  // LGTGTWINT-2110 | Chaitanya M | 13 July 2023    

      maxQuoteTimeOccurredAQ = true;
     // LGTGTWINT-1934 || ChaitanyaM || 03 Jun 2023  
      if($(thistile).find('[id^="hdnsignalRMsgRecv"]').val().toUpperCase() === "YES"){
        
        UnsubcribeRFQID(thistile);
        clearTimeout(_uniqueMaxTimerid.value);
        _uniqueMaxTimerid.value="";
        closetimerFXAQ(_uniqueMaxTimerid); // LGTGTWINT-2110 | Chaitanya M | 13 July 2023 
        $(thistile).find('[id^="btnBestPriceFXAQ"]').attr("disabled", false);
        $(thistile).find('[id^="btnemailquote"]').attr("disabled", false);
        $(thistile).find('[id^="btnBookReqFXAQ"]').attr("disabled", false);
        $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", false); 
        mapleLoaderStop(thistile,'[id^="btnBestPriceFXAQ"]',false);
        $(thistile).find('[id^="hdnsignalRMsgRecv"]').val("NO");


      }else if($(thistile).find('[id^="hdnsignalRMsgRecv"]').val() == ""){
        
        if($(thistile).find('[id^="hdnQuoteString"]').val() !== ""){ // LGTGTWINT-1934 || RizwanS || 05 Jun 2023 

          UnsubcribeRFQID(thistile);
          // Start- LGTGTWINT-2110 | Chaitanya M | 13 July 2023 
          clearTimeout(_uniqueMaxTimerid.value);
          _uniqueMaxTimerid.value="";
          closetimerFXAQ(_uniqueMaxTimerid);
          // End- LGTGTWINT-2110 | Chaitanya M | 13 July 2023
          $(thistile).find('[id^="btnBestPriceFXAQ"]').attr("disabled", false);
          $(thistile).find('[id^="btnemailquote"]').attr("disabled", true);
          $(thistile).find('[id^="btnBookReqFXAQ"]').attr("disabled", true);
          $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", true); 
 
          mapleLoaderStop(thistile,'[id^="btnBestPriceFXAQ"]',false);

          if($(thistile).find('[id^="hdnRequestID"]').val() === _requestID){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
            
            ValidateField($(thistile).find('[id^="btnBestPriceFXAQ"]').attr("id"),"No response received from remote system.",thistile);
          
          }

        }

      }
      //End

    },MaxQuoteTimeOut * 1000);

  } catch(error){
    console.log(error.message);
  }
}
// End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
// END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

// FXD | Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || RizwanS || 02 May 2023
function MapPricesFXAQ(dataFXAQ,thisTileFXAQ,isRFS){
  try{

    let _failedreason ="";
    let failReason=""; 
    let responseHeader = "";
    
    if(dataFXAQ.dataFromAjax === "" || dataFXAQ.dataFromAjax === undefined || dataFXAQ.dataFromAjax === null){
      responseHeader = "FAIL";
    }else{
      if(dataFXAQ.dataFromAjax.oPriceResponseBody[0].bestPriceProvider === "FAIL:FAIL" || dataFXAQ.dataFromAjax.oPriceResponseBody[0].bestPriceProvider === "" ||
      dataFXAQ.dataFromAjax.oPriceResponseBody[0].bestPriceProvider === undefined || dataFXAQ.dataFromAjax.oPriceResponseBody[0].bestPriceProvider === null){
        responseHeader = "FAIL";
      }else{
        responseHeader = "SUCCESS";
      }      
    }
          
    if(responseHeader.toUpperCase() == "SUCCESS"){

    // console.log("Best Price Log's for Tile FXAQ ::" +" " +dataFXAQ.currentTile +"\n" + dataFXAQ.dataFromAjax.oPriceResponseBody[0].o_BestPriceLog);
    // console.log("Log's for Tile FXAQ :: DCDRFQID ==" + dataFXAQ.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID +"\n" +"NoteMasterID==" + dataFXAQ.dataFromAjax.oPriceResponseBody[0].NoteMasterID +"\n" +"USERID==" +$(thisTileFXAQ).find('[id^="hdnUserIDFXAQ"]').val());

    // Added by RizwanS / RFQ ID on UI / 16 Jun 2022 
    // LGTGTWINT-1740 | Chaitanya M | 05 June 2023
    // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').show();
    // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
    // $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("RFQ ID : " + dataFXAQ.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID);
    // End

    $(thisTileFXAQ).find('[id^="FXAQBanksRow"]').empty();
    $(thisTileFXAQ).find('[id^="FXAQPrices"]').empty();
    // Added by Atharva - Timers - START
    $(thisTileFXAQ).find('[id^="FXAQ_TimerRow"]').empty();
    // END
    // Storing price object in hidden field of current tile
    let FXAQPriceData = dataFXAQ.dataFromAjax.oPriceResponseBody; //LGTGTWINT-1934  || RizwanS || 01 Jun 2023
    $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val(JSON.stringify(FXAQPriceData));
    $(thisTileFXAQ).find('[id^="RFQFXAQ"]').val(JSON.stringify(FXAQPriceData)); // Added for LGTGTWINT-1462 'Mail All' functionality | Chaitanya M | 23 Feb 2023
    
    if (
      JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].provider == null ||
      JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].NoteMasterID == null ||
      JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].bestPriceProvider == "FAIL"
    ) {
      $(thisTileFXAQ).find('[id^="FXAQBanksRow"]').append("<td> - </td>");
      $(thisTileFXAQ).find('[id^="FXAQPrices"]').append("<td> - </td>");
      // Added by Atharva - Timers - START
      $(thisTileFXAQ).find('[id^="FXAQ_TimerRow"]').append("<td> - </td>");
      // END
      $(thisTileFXAQ).find('[id^="loader_FXAQ"]').hide();

      // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      if(isRFS != true){
        $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", false);
        $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", false);
      }
      //End

      //To fetch error from network response
      if (
        ($(thisTileFXAQ).find('[id^="frequencyFXAQ"]').value =="MAMS 1X" ||
          $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').value =="MAMS 2X") &&JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].errormessage != "") {
        ValidateField( "hdnctlvalidation",JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].errorMessage.split(".")[0],thisTileFXAQ);
      } else if (
        JSON.parse(
          $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].errorMessage.split("d")[0] == " Guarantee" &&
        JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0]
          .errormessage != ""
      ) {
        ValidateField($(thisTileFXAQ).find('[id^="GauranteeFXAQ"]').attr("id"),JSON.parse( $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].errorMessage.split(".")[0],thisTileFXAQ);
      } //END Error
      return false;
    } else {

      var BestPP = JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].bestPriceProvider.split(":")[0];
      DCDRFQidFXAQ = JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].o_DCDRFQID;
      bestProviderFXAQ = JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].bestPriceProvider.split(":")[0];
      outJson = JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val());
      // Added by Atharva - Timers - START
      // Passing extra parameter to plotprice
      quoteidFXAQ = PlotPrice(JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()),
        JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].bestPriceProvider.split(":")[0],
        "#" + $(thisTileFXAQ).find('[id^="FXAQBanksRow"]').attr("id"),
        "#" + $(thisTileFXAQ).find('[id^="FXAQPrices"]').attr("id"),
        thisTileFXAQ,$(thisTileFXAQ).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase()
      );

      // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      $(thisTileFXAQ).find('[id^="PremiumipboxFX"]').val($(thisTileFXAQ).find('[id^="hdnIBPremFX"]').val());

      if($(thisTileFXAQ).find('[id^="ddlSolveForFX"]').val().trim().toUpperCase() !== "PREMIUM"){
        
        $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val($(thisTileFXAQ).find('[id^="hdnClientStrikeFX"]').val());
        $(thisTileFXAQ).find('[id^="hdnStrikevalueFX"]').val($(thisTileFXAQ).find('[id^="hdnClientStrikeFX"]').val()); // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      }
      // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023

      $(thisTileFXAQ).find('[id^="hdnQuoteIDFXAQ"]').val(quoteidFXAQ);


      // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
      // ----------------------------------Start-------------------------------
        
      let AskspotFXAQ = $(thisTileFXAQ).find('[id^="rateFXAQ"]').html().split("/")[1].replace(/,/g, "").trim();
      let BidSpotFXAQ = $(thisTileFXAQ).find('[id^="rateFXAQ"]').html().split("/")[0].replace(/,/g, "").trim();
      
      if($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim().toUpperCase() === "BUY"){

        AskspotFXAQ = numberWithCommas(Number($(thisTileFXAQ).find('[id^="hdnSpotRateFX"]').val()));

        $(thisTileFXAQ).find('[id^="rateFXAQ"]').html(BidSpotFXAQ + " / " + AskspotFXAQ);


      }else{
        
        BidSpotFXAQ = numberWithCommas(Number($(thisTileFXAQ).find('[id^="hdnSpotRateFX"]').val()));

        $(thisTileFXAQ).find('[id^="rateFXAQ"]').html(BidSpotFXAQ + " / " + AskspotFXAQ);

      }

      // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
      // ----------------------------------End---------------------------------


      // Added by Atharva - Timers - START
      if (BestPP != "FAIL" && BestPP !== undefined && BestPP != "" && BestPP != null) {
        startTimers(dataFXAQ.CurrentTileID.split("|")[0]);
      }
    }

    $(thisTileFXAQ).find('[id^="loader_FXAQ"]').hide();
   
    if (
      JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()) != null ||
      JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()) !=undefined ||
      JSON.parse(
        $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
      ).bestPriceProvider.split(":")[0] != "FAIL"
    ) {
      drawgraphFXAQ($(thisTileFXAQ).find('[id^="canvas"]').attr("id"));
    }

    mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023

    // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
    if(isRFS != true){
      $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", false);
      $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
      $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", false);
    }
    //End


    } else if(dataFXAQ.dataFromAjax == null){

      // if(dataFXAQ.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != null || 
      //   dataFXAQ.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != ""){
      
      //   _failedreason = dataFXAQ.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason;
      //   ValidateField($(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr('id'), _failedreason, thisTileFXAQ); 
      
      // }else{
      
        _failedreason = "Pricing Failed!";
        ValidateField($(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr('id'), _failedreason, thisTileFXAQ); 
      
     // }
      $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true); 
      $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
    
    }
    //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023
    else if(dataFXAQ.dataFromAjax.oPriceResponseBody[0].bestPriceProvider == null || 
      dataFXAQ.dataFromAjax.oPriceResponseBody[0].bestPriceProvider == ""){

      if(dataFXAQ.dataFromAjax.oPriceResponseBody[0].errorMessage == null ||
        dataFXAQ.dataFromAjax.oPriceResponseBody[0].errorMessage == ''){
      //End
        // if(dataFXAQ.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != null || 
        //   dataFXAQ.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != ""){
        
        //   _failedreason = dataFXAQ.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason;
        //   ValidateField($(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr('id'), _failedreason, thisTileFXAQ); 
        
        // }else{
        
          _failedreason = "Pricing Failed!";
          ValidateField($(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr('id'), _failedreason, thisTileFXAQ); 
        
       // }
      
      }else{
        failReason = dataFXAQ.dataFromAjax.oPriceResponseBody[0].errorMessage;
        if(failReason.includes("Aborting further Migration")){

          _failedreason = failReason.replace(". Aborting further Migration for this record.","");  
          ValidateField($(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr('id'), _failedreason, thisTileFXAQ); 

        } else{

          _failedreason = failReason;
          ValidateField($(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr('id'), _failedreason, thisTileFXAQ); 

        }
      }   
      // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
      // LGTGTWINT-1740 | Chaitanya M | 05 June 2023
      // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').show();
      $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
      $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("RFQ ID : " +dataFXAQ.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID); //LGTGTWINT-1740 | Chaitanya M | 05 June 2023
      //End
      //End
      
      // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      if(isRFS != true){
        $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true);
        $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
      }
      //End       

    }
    //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 
    else if(dataFXAQ.dataFromAjax.oPriceResponseBody[0].bestPriceProvider.includes("FAIL")) {

      // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
      // if(dataFXAQ.dataFromAjax.oPriceResponseBody[0].errorMessage == null || 
      //   dataFXAQ.dataFromAjax.oPriceResponseBody[0].errorMessage == ''){
      
          $(thisTileFXAQ).find('[id^="FXAQBanksRow"]').append("<td> - </td>");
          $(thisTileFXAQ).find('[id^="FXAQPrices"]').append("<td> - </td>");
          // Added by Atharva - Timers - START
          $(thisTileFXAQ).find('[id^="FXAQ_TimerRow"]').append("<td> - </td>");

        // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
        ValidateField($(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("id"),"No response received from remote system.",thisTileFXAQ);

        //LGTGTWINT-1740 | Chaitanya M | 05 June 2023

        //$(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').show();
        $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
        $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("RFQ ID : " + dataFXAQ.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID); 
        //End
        
        //End

        // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
        if(isRFS != true){
          $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true);
          $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
          $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
        }
        //End
      
      // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
      //Start
      // }else{

      //   failReason = dataFXAQ.dataFromAjax.oPriceResponseBody[0].errorMessage; //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 

      //   if(failReason.includes("Aborting further Migration")){

      //     _failedreason = failReason.replace(". Aborting further Migration for this record.","");    
      //     ValidateField($(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr('id'), _failedreason, thisTileFXAQ);    

      //   } else{

      //     _failedreason = failReason;
      //     ValidateField($(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr('id'), _failedreason, thisTileFXAQ); 


      //   }
      // }   
      
      // $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true); 
      // $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      // $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
      //End

    }

    mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    $(thisTileFXAQ).find('[id*="btnBestPriceFXAQ"]').attr("disabled", false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023    
    
    // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023  
    // Start
    // START - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
    if(isRFS){

      if(MinQuoteTimeOutOccurredFXAQ == true){
      
        UnsubcribeRFQID(thisTileFXAQ);
        closetimerFXAQ($(thisTileFXAQ).find('[id^="hdnRFSMinTimer"]')[0]);
        mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',false);
        MinQuoteTimeOutOccurredFXAQ = false;
        $(thisTileFXAQ).find('[id^="hdnsignalRMsgRecv"]').val("NO");
        $(thisTileFXAQ).find('[id*="btnBestPriceFX"]').attr("disabled", true);
        $(thisTileFXAQ).find('[id^="btnemailquote"]').attr("disabled", false);
        $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", false);
        $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", false);  
      }
      // End - LGTGTWINT-2110 | Chaitanya M | 13 July 2023
      
    }
    //End
  } catch (error) {
    $(thisTileFXAQ).find('[id^="loader_FXAQ"]').hide();
    $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);
    console.log(error.message);
    $(".lblError").html(error.message);
  } finally {
  }
}//END

//To Get BidAsk Rate and Currency Pair
function getCurrencyFXAQRate(currId,iscloned) { // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
  try {
    thisTileFXAQ = document.getElementById("td" + currId);
    // Addded for CFINT-992 // 18-Sep-2020 //

    //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 16 Feb 2023
    checkmetalccyflagFXAQ(currId,$(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val())

    //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
    $(thisTileFXAQ).find('[id^="hdnCcyDetailsFXAQ"]').val($(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val());
    //End

    $(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("disabled", true);
    $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);

    //END

     // Start LGTCLI-417 || RizwanS || 04 May 2023
     let _prodID = "";
     let _prodCode= "";
     let _prodName = "";
 
     if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {
 
       _prodID = productIDFXAQ;
       _prodCode = productCodeAQ;
       _prodName = ProductNameAQ;
 
     }else{
        _prodID = productIDFXDQ;
        _prodCode = productCodeDQ;
        _prodName = ProductNameDQ;
     }
     //END

    request_getDataFromAPI(
      {

        // Start - HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023
        "StandardPair": $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]')[0].value,
        "EntityID": EntityID,
        "UserID": userName,
        "ProductCode": _prodCode, //LGTCLI-417 || RizwanS || 04 May 2023 
        "Mode" : "SEN",
        "CurrentTileID":currId + "|" + "",
        // End - HSBCFXEINT-2 | Chaitanya M | 15 Nov 2023
      },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/BidAskRate","","POST",currId +"|" + userName + '_' + 'GetFXRatesByCurrencyNode'  +'_' + RequestIDGenerator(4)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023  )
      .then((data) => {

        thisTileFXAQ = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
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

          AskRateFXO = numberWithCommas(Number(data.dataFromAjax.AskRate).toFixed(data.dataFromAjax.PointShift)); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
          BidRateFXO = numberWithCommas(Number(data.dataFromAjax.BidRate).toFixed(data.dataFromAjax.PointShift)); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023

          $(thisTileFXAQ).find('[id^="hdnDecimalRateFXAQ"]').val(data.dataFromAjax.PointShift); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
          $(thisTileFXAQ).find('[id^="rateFXAQ"]').html(BidRateFXO + " / " + AskRateFXO);        
        
          if(iscloned !== true){ // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023

            //LGTCLI-310 | Chaitanya M | 23 feb 2023
            if(_addtileflag == true){
              $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val(""); 
              _addtileflag= false;

              $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]')[0].value = AskRateFXO;  //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023

            }else if(_defaultflagGXAQ == true){

              //LGTGTWINT-1778 KO rate should not auto populated on changing ccy pair || Chaitanya M | 31 March 2023
              
              // $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.PointShift)); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val("");
              //End
              
              $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]')[0].value = AskRateFXO;  //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
              _defaultflagGXAQ = false;

              //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023 -Start
            }else if (!_UpdateFlagFXAQ){
              // Start - LGTCLI-422 | Chaitanya M | 5 May 2023
              if($(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val() == ""){

                $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]')[0].value = AskRateFXO; 
                  
              }  
              //End       
              _UpdateFlagFXAQ=false;
          
            }else if(_UpdateFlagFXAQ){

              // Start - LGTCLI-422 | Chaitanya M | 5 May 2023
              if(_eventstrikechangeFXAQ == true){
                _eventstrikechangeFXAQ = false;
              }else if($(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val() == ""){
                $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]')[0].value = AskRateFXO;
              }
              //end
              _UpdateFlagFXAQ=false;

            }else{
              $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val("");
              $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]')[0].value = AskRateFXO; //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023
            } 

          }    

          // Addded for CFINT-992 // 18-Sep-2020 //

          $(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("disabled", false);

          //END

         // Start LGTCLI-417 || RizwanS || 04 May 2023
          let _prodID = "";
          let _prodCode= "";
          let _prodName = "";

          if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

            _prodID = productIDFXAQ;
            _prodCode = productCodeAQ;
            _prodName = ProductNameAQ;

            //Added by RizwanS || LGTGTWINT-2322 || 22 Aug 2023
            if(MaxQuoteTimeOutAQ === "" || MinQuoteTimeOutAQ === ""){
              getProductConfigsFXD(productIDFXAQ,productCodeAQ);
            }
            if(LPListFXAQ === ""){
              LPListFXAQ = getasyncFXDLP(productIDFXAQ, productCodeAQ);
            }
            //END
          

          }else{

            _prodID = productIDFXDQ;
            _prodCode = productCodeDQ;
            _prodName = ProductNameDQ;

            //Added by RizwanS || LGTGTWINT-2322 || 22 Aug 2023
            if(MaxQuoteTimeOutDQ === "" || MinQuoteTimeOutDQ === ""){
              getProductConfigsFXD(productIDFXDQ,productCodeDQ); 
            }
            if(LPListFXDQ === ""){
              LPListFXDQ =  getasyncFXDLP(productIDFXDQ, productCodeDQ);
            }
            //END
            
          }
          //END

          //Added By RizwanS for Option cut // JIRA ID- SCBUPINT-1102 // 15 Jul 2022
          // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
          if(iscloned !==true){    
          OptionCutListFXAQ = setasyncOptioncutFXD(currId, $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val(), _prodID, _prodCode,"FXOSEN"); //LGTCLI-417 || RizwanS || 04 May 2023    
          fillDropdownlistControl(OptionCutListFXAQ, $(thisTileFXAQ).find('[id^="Optioncutddl"]').attr('id'));
          // } // Commented for LGTCLI-447 | Chaitanya M | 03 Aug 2023
          //End

          //END

          fillDatesFXAQ(
            $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val(),
            $(thisTileFXAQ).find('[id^="frequencyFXAQ"]').val(),
            $(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').val(),
            currId
          );

        } 

      } else {

          let failReason = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.FailedReason; 
          
          ValidateField($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').attr('id'), failReason, thisTileFXAQ);

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

function setNDFMetalFlagAQ(
  currId,
  productIDFXAQ,
  productCodeAQ,
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

    let thisTileFXAQ = document.getElementById("td" + currId);

    // Changed for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
    let _FXAQCcylist = sessionStorage.getItem("CCYListFXAQ");

    let _FXAQCcy = JSON.parse(_FXAQCcylist);         

    let fxDayBasis = _FXAQCcy[_FXAQCcy.findIndex((res) => res.asset_Pair == CcyPair)].asset2_Year_Basis;

    //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022

    $(thisTileFXAQ).find('[id^="hdnCcyPairDataAQ"]').val(
      JSON.stringify(_FXAQCcy[_FXAQCcy.findIndex((res) => res.asset_Pair == CcyPair)])
    );

    let notionalddlId = '[id^="CcySelectionFXAQ"]';
    let hdnpairDataId = '[id^="hdnCcyPairDataAQ"]';
    let notioanlamtId = '[id^="ContractAmtFXAQ"]';

    checkDecimalPlaces(thisTileFXAQ,notionalddlId,hdnpairDataId,notioanlamtId);

    //END

    getNumberOfFixingAQ(
      currId,
      productIDFXAQ,
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
    $(".lblError").html(error.message());
  }
}

function getNumberOfFixingAQ(
  currId,
  productIDFXAQ,
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

    // Start LGTCLI-417 || RizwanS || 04 May 2023
    let _prodID = "";
    let _prodCode= "";
    let _prodName = "";
    let _tempID = "";

    if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

      _prodID = productIDFXAQ;
      _prodCode = productCodeAQ;
      _prodName = ProductNameAQ;
      _tempID = TemplateIDFXAQ;

    }else{
      _prodID = productIDFXDQ;
      _prodCode = productCodeDQ;
      _prodName = ProductNameDQ;
      _tempID = TemplateIDFXDQ;
    }
    //END

    request_getDataFromAPI(
      {
        "entityID": EntityID,
        "productID": _prodID, 
        "depoCcy": DepoCcy,
        "altCcy": AltCcy,
        "globalCcy": AltCcy,
        "localCcy": DepoCcy,
        "optionCut": $(thisTileFXAQ).find('[id^="Optioncutddl"]').val(),
        "fixingFreq": setFrqFix,
        "settlementFreq": SetSetlfrq,
        "tradeDate": setBusinessDate,
        "firstFixingDate": "",
        "settlementDate": getSettlementDate,
        "finalFixingDate": getFinalFixingDate,
        "notionalPerFixing": $(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').val(),
        "guaranteedPeriods": $(thisTileFXAQ).find('[id^="GauranteeFXAQ"]').val(),
        "ccyPair": CcyPair,
        "premiumDate": getPremiumDate,
        "templateID": _tempID,
        "dayBasis": getfxDayBasis,
        "CurrentTileID": currId + "|" + userName + '_' + 'GetNumberofFixings'  +'_' + RequestIDGenerator(4),
        "requestID": currId +"|" + userName + '_' + 'GetNumberofFixings'  +'_' + RequestIDGenerator(4)
      },
      clientConfigdata.CommonMethods.NodeServer + "DateCalculationApi/GetNumberofFixings","","POST",currId +"|" + userName + '_' + 'GetNumberofFixings'  +'_' + RequestIDGenerator(4)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        let thisTileFXAQ = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        //let responseHeader = data.GetNumberofFixingsResult.A_ResponseHeader.Status;

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

          $(thisTileFXAQ).find('[id^="hdnFXAQNoofFixingAQDate"]').val(data.dataFromAjax.firstFixingDate);

          $(thisTileFXAQ).find('[id^="hdnFXAQNoofFixingAQs"]').val(data.dataFromAjax.noofFixings);

          $(thisTileFXAQ).find('[id^="btnBestPriceFXAQ"]').attr("disabled", false); 
        
          let strFirstFix = new Date(data.dataFromAjax.firstFixingDate);
          let firstFix = strFirstFix.getFullYear() +"-" +
            ("0" + (strFirstFix.getMonth() + 1)).substr(-2, 2) + "-" +
            ("0" + strFirstFix.getDate()).substr(-2, 2);

          $(thisTileFXAQ).find('[id^="FirstFixDate"]').val(firstFix);
          $(thisTileFXAQ).find('[id^="lblFirstFixDate"]').html(data.dataFromAjax.firstFixingDate);

        }else {

          let failReason = "No response received from remote system."; 
          
          ValidateField($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').attr('id'), failReason, thisTileFXAQ);

          // Need to uncomment after no.of fixing issue resolved.

        }  

      })
      .catch((error) => {
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

function viewScheduleFXAQ(that) {
  try {
    getBestPriceFXAQ(that, true);
  } catch (error) {
    console.log(error.message);
  }
}

//END

//Save Trade Start || 23 Dec 2022 || RijwanS || JIRA ID - LGTGTWINT-607 ||
function SaveTradeFXAQ(that){
  try{  

    booktradeFXAQ(that, true);

  }catch(er){

    console.log(er.message);

  }
}//END

//Book Trade
function booktradeFXAQ(that, RTDflag) {
  try {

    if (RTDflag) {

      TileId = that.id.match(/\d+$/)[0];
      thisTileFXAQ = document.getElementById("td" + TileId);
      $(thisTileFXAQ).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayFXAQ"); // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer

    } else {

      TileId = that.id.match(/\d+$/)[0];
      thisTileFXAQ = document.getElementById("td" + TileId);
      $(thisTileFXAQ).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayFXAQ"); // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer 
    }
  } catch (error) {

    console.log(error.message);
  }

} //END

//Save to Dealer RFQ || 23 Dec 2022 || RijwanS || JIRA ID - LGTGTWINT-607 ||
function SaveDealerRFQAQ(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXAQ = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");

    // Added by Atharva - Timers - START
    if ("td" + TileId in myInterval) {
      clearInterval(myInterval["td" + TileId]);
      delete myInterval["td" + TileId];
    }
    // END
    console.log("BookingFor ::", TileId, thisTileFXAQ, productName);
    $(thisTileFXAQ).find('[id^="btnBookReqFXAQ"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023

    if (
      $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val() == "" ||
      $(thisTileFXAQ).find('[id^="FXAQPrices"]')[0].firstChild.innerHTML =="-" ||
      $(thisTileFXAQ).find('[id^="FXAQPrices"]')[0].firstChild.innerHTML == ""
    ) {

      booktradePopup(that,"booktradeFXAQ" + TileId,"Order Execution Failed!","DivOverlayFXAQ","E");

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
        $(thisTileFXAQ).find('[id^="hdnPriceIndexFXAQ"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
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

    mapleLoaderStart(thisTileFXAQ,'[id^="btnBookReqFXAQ"]',true);

    // Start LGTCLI-417 || RizwanS || 04 May 2023
    let _prodID = "";
    let _prodCode= "";
    let _prodName = "";
   
    if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

      _prodID = productIDFXAQ;
      _prodCode = productCodeAQ;
      _prodName = ProductNameAQ;

    }else{
      _prodID = productIDFXDQ;
      _prodCode = productCodeDQ;
      _prodName = ProductNameDQ;
    }
    //END

    request_getDataFromAPI(
      {

        "EntityId": EntityID,
        "LoginId": userName,
        "DCD_RFQId": dcdrfqid_val,
        "External_RFQId": JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].quoteId.toString(),
        "PriceProviderName": JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].provider,
        "ProductCode": _prodCode,
        "Cust_Prem_Amt": Number($(thisTileFXAQ).find('[id^="hdnIBPremFX"]').val()),            
        "order_Response_TimeOut":"", // HSBCFXEINT-29 | Chaitanya M | 11 Dec 2023
        "twoStepOrderExecutionYN":'N',      
        "OrderRetryFlag": true,
        "CurrentTileID": TileId + "|" + "",
        "Remark": $(thisTileFXAQ).find('[id^="inputRemark"]').val(),

      },clientConfigdata.CommonMethods.NodeServer + "fxobestprice/FXOBookTradeAndGetExternalTradeNumberJSON","","POST",TileId +"|" + userName + '_' + 'BookOrderFXProducts'  +'_' + RequestIDGenerator(4)).then((data) => { // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let thisTileFXAQ = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
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

        if (
          data.dataFromAjax.DealNo == "" ||
          data.dataFromAjax.DealNo == null
        ) {
          // LGTCLI-411 | FXD Rejected Trades Notifications | Chaitanya M | 17 April 2023
          //Start
          if(data.dataFromAjax.isOrderRejected == true) { 

            var orderplaced = "Order rejected due to some technical reasons." ;
            ValidateField($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').attr('id'), orderplaced, thisTileFXAQ);
            mapleLoaderStop(thisTileFXAQ,'[id^="btnBookReqFXAQ"]',true);
            return false;
    
          }else if(data.dataFromAjax.isOrderRejected == false || 
            data.dataFromAjax.External_TradeID == "" ||
            data.dataFromAjax.External_TradeID == null ){
              var orderplaced =  "Order may have got executed or may have failed. Contact support." ;
              ValidateField($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').attr('id'), orderplaced, thisTileFXAQ);
              mapleLoaderStop(thisTileFXAQ,'[id^="btnBookReqFXAQ"]',true);
            return false;
            }else{
              var orderplaced = data.dataFromAjax.Message;
            ValidateField($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').attr('id'), orderplaced, thisTileFXAQ);
            mapleLoaderStop(thisTileFXAQ,'[id^="btnBookReqFXAQ"]',true);
            return false;
            }    
            //End  
        } else {
          // var orderno =data.dataFromAjax.Message.split(":")[1];
          // Added by Atharva - Timers - START
          // Changed the provider name in message from bestpriceprovider to whichever the user has selected.
          // var orderplaced ="Deal No." +data.dataFromAjax.DealNo +
          //   "<br>" +
          //   "Order Placed Successfully with Counterparty " +
          //   JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[priceIndex].provider + //JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[0].bestPriceProvider.split(":")[0]
          //   " and Order ID  " +orderno;
          // END

          //HSBCFXEINT-30 || RizwanS || 12 Dec 2023
          let _msg1 = data.dataFromAjax.Message;
          var orderplaced =
          _msg1 + "<br>" +  //row-1
          "Deal No." + " " + data.dataFromAjax.DealNo + "<br>" + //row-2
          "External Trade ID:" + " " + data.dataFromAjax.External_TradeID; //row-3
         //END

        }

        // $(thisTileFXAQ).find('[id^="OrderBlotter"]').css({ display: "inline" });
        booktradePopup(that,"booktradeFXAQ" + TileId,orderplaced,"DivOverlayFXAQ");

        $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val("");
        // Added by Atharva - START
        $(thisTileFXAQ).find(".pricesRow").children().each(function () {
          $(this).find("button").attr("disabled", true);
        });
        $(thisTileFXAQ).find(".banksNameRow").children().each(function () {
          $(this).find("button").attr("disabled", true);
        });
        $(thisTileFXAQ).find('[id^="BookTrade"]').attr("disabled", true);
        $(thisTileFXAQ).find('[id*="BookReq"]').attr("disabled", true);
        // $(thisTileFXAQ).find("[id^='pricesTimer']").html("");
        // $(thisTileFXAQ).find('[id^="pricesTimer"]').css({ background: "transparent" });
        blockPriceButtons(TileId);
        // END

        } else {

          let failReason = "Order Execution Failed!";
                
          ValidateField($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').attr('id'), failReason, thisTileFXAQ);
        }

        mapleLoaderStop(thisTileFXAQ,'[id^="btnBookReqFXAQ"]',true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      // Commented on 21 March as per discussion with Rahul P
     // $(thisTileFXAQ).find('[id^="FXDRfqidpnl"]').hide();
    //  $(thisTileFXAQ).find('[id^="RFQIDFXD"]').html("");
    //End 

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(
      that,
      "booktradeFXAQ" + TileId,
      "Order Execution Failed!",
      "DivOverlayFXAQ","E"
    );

    mapleLoaderStop(thisTileFXAQ,'[id^="btnBookReqFXAQ"]',true);

    $(".lblError").html(error.message);
  } finally {
  }
}//END

// Save Route To Dealer RFQAQ || RijwanS || LGTGTWINT-607 || 26 Dec 2022
function SaveRouteToDealerRFQAQ(that) {
  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXAQ = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    // Added by Atharva - Timers - START
    if ("td" + TileId in myInterval) {
      clearInterval(myInterval["td" + TileId]);
      delete myInterval["td" + TileId];
    }
    // END
    console.log("Routed to ::", TileId, thisTileFXAQ, productName);
    $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023 

    if (
      $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val() == "" ||
      $(thisTileFXAQ).find('[id^="FXAQPrices"]')[0].firstChild.innerHTML ==
      "-" ||
      $(thisTileFXAQ).find('[id^="FXAQPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        that,
        "booktradeFXAQ" + TileId,
        "Order Execution Failed!",
        "DivOverlayFXAQ","E"
      );

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
        $(thisTileFXAQ).find('[id^="hdnPriceIndexFXAQ"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
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

    mapleLoaderStart(thisTileFXAQ,'[id^="btnSaveTradeFX"]',true);


       // Start LGTCLI-417 || RizwanS || 04 May 2023
       let _prodID = "";
       let _prodCode= "";
       let _prodName = "";
   
       if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {
   
         _prodID = productIDFXAQ;
         _prodCode = productCodeAQ;
         _prodName = ProductNameAQ;
   
       }else{
          _prodID = productIDFXDQ;
          _prodCode = productCodeDQ;
          _prodName = ProductNameDQ;
       }
       //END
  

    request_getDataFromAPI(

      {
       
        "EntityID":EntityID,
        "DCDRFQID":dcdrfqid_val,
        "ProductCode":_prodCode, //LGTCLI-417 || RizwanS || 04 May 2023
        "LoginId":userName,
        "LoginID": userName,
        "NoteMasterId":JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[priceIndex].NoteMasterID,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "RMRemark":$(thisTileFXAQ).find('[id^="inputRemark"]').val(),
        "CurrentTileID": TileId + "|" + userName + '_' + 'SaveRouteToDealerRFQ'  +'_' + RequestIDGenerator(5) ,

      },clientConfigdata.CommonMethods.NodeServer + "SaveRouteToDealerRFQ","","POST",TileId +"|" + userName + '_' + 'SaveRouteToDealerRFQ'  +'_' + RequestIDGenerator(4)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023)
      .then((data) => {
       
        let thisTileFXAQ = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        if (data.SaveRouteToDealerResult.RouteToDealer == true) {

          var orderplaced = "RFQ " + " " + dcdrfqid_val + " " + "routed to dealing desk successfully."
          booktradePopup(that,"booktradeFXAQ" + TileId,orderplaced,"DivOverlayFXAQ","S");

        } else {

          var orderplaced = "Order Placement Failed."
          booktradePopup(that,"booktradeFXAQ" + TileId,orderplaced,"DivOverlayFXAQ","E");

        }

        // $(thisTileFXAQ).find('[id^="OrderBlotter"]').css({ display: "inline" });
       

        $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val("");
        // Added by Atharva - START
        $(thisTileFXAQ).find(".pricesRow").children().each(function () {
          $(this).find("button").attr("disabled", true);
        });

        $(thisTileFXAQ).find(".banksNameRow").children().each(function () {
          $(this).find("button").attr("disabled", true);
        });

        // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
        $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXAQ).find('[id*="btnemailquote"]').attr("disabled", true);

        $(thisTileFXAQ).find("[id^='pricesTimer']").html("");
        $(thisTileFXAQ).find('[id^="pricesTimer"]').css({ background: "transparent" });
        blockPriceButtons(TileId);
        // END

        mapleLoaderStop(thisTileFXAQ,'[id^="btnSaveTradeFX"]',true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(that,"booktradeFXAQ" + TileId,"Order Execution Failed!","DivOverlayFXAQ","E");

    $(".lblError").html(error.message);
    mapleLoaderStop(thisTileFXAQ,'[id^="btnSaveTradeFX"]',true);
  } finally {
  }
}// END

// Email Quote || RijwanS || LGTGTWINT-608  || 27 Dec 2022
function SendQuoteEmailAQ(that) {
  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXAQ = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
  
    console.log("email quote to ::", TileId, thisTileFXAQ, productName); 

    if ($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val() == "" || $(thisTileFXAQ).find('[id^="FXAQPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileFXAQ).find('[id^="FXAQPrices"]')[0].firstChild.innerHTML == "") {
      booktradePopup(that,"booktradeFXAQ" + TileId,"Email Quote Failed!","DivOverlayFXAQ","E");
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
        $(thisTileFXAQ).find('[id^="hdnPriceIndexFXAQ"]').val()
      );
    } else {
      priceIndex = 0;
    }
    
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
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


    mapleLoaderStart(thisTileFXAQ,'[id^="btnemailquote"]',true);
  
       // Start LGTCLI-417 || RizwanS || 04 May 2023
       let _prodID = "";
       let _prodCode= "";
       let _prodName = "";
   
       if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {
   
         _prodID = productIDFXAQ;
         _prodCode = productCodeAQ;
         _prodName = ProductNameAQ;
   
       }else{
          _prodID = productIDFXDQ;
          _prodCode = productCodeDQ;
          _prodName = ProductNameDQ;
       }
       //END

    request_getDataFromAPI(
    {               

      "RequestID": userName + '_' + 'SendQuoteEmailFXDAQDQ'  +'_' + RequestIDGenerator(5),
      "EntityID": EntityID,
      "ProductID": _prodID,
      "LoginId": userName,
      "NoteMasterId": JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[priceIndex].NoteMasterID,
      "RFQID": dcdrfqid_val,
      // "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
      "CurrentTileID": TileId + "|" + "",

    },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/SendQuoteEmail","","POST",TileId +"|" + userName + '_' + 'SendQuoteEmailFXDAQDQ'  +'_' + RequestIDGenerator(4)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {
       
        let thisTileFXAQ = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        
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
            booktradePopup(thisTileFXAQ, "booktradeFXAQ" + TileId, orderplaced, "DivOverlayFXAQ","S");

          } else {
            var orderplaced = "Email Quote Failed." 
            booktradePopup(thisTileFXAQ, "booktradeFXAQ" + TileId, orderplaced, "DivOverlayFXAQ","E");       
          }

        }else{
          var orderplaced = "Email Quote Failed."
          booktradePopup(thisTileFXAQ, "booktradeFXAQ" + TileId, orderplaced, "DivOverlayFXAQ","E");
        }

        mapleLoaderStop(thisTileFXAQ,'[id^="btnemailquote"]',true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(thisTileFXAQ, "booktradeFXAQ" + TileId, "Email Quote Failed.", "DivOverlayFXAQ","E");
    mapleLoaderStop(thisTileFXAQ,'[id^="btnemailquote"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

// Save Trade Idea || RijwanS || LGTGTWINT-608  || 28 Dec 2022
function SaveTradeIdeaFXAQ(that) {
  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXAQ = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
  
    console.log("Save Trade Idea for ::", TileId, thisTileFXAQ, productName);
    $(thisTileFXAQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);  // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    
    // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
    isSaveTradeIdeaFXQ = false;
    var _modeFXAQ ="";
    if(isFXDDealer){
      _modeFXAQ = "SEN";
    }else{
      _modeFXAQ = "QEN"
    }
    //End


    if ($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val() == "" || $(thisTileFXAQ).find('[id^="FXAQPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileFXAQ).find('[id^="FXAQPrices"]')[0].firstChild.innerHTML == "") {
      booktradePopup(that,"booktradeFXAQ" + TileId,"Save trade idea Failed !","DivOverlayFXAQ","E");
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
        $(thisTileFXAQ).find('[id^="hdnPriceIndexFXAQ"]').val()
      );
    } else {
      priceIndex = 0;
    }
    
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val()
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

    mapleLoaderStart(thisTileFXAQ,'[id^="btnSaveTradeIdea"]',true);
  
    // Start LGTCLI-417 || RizwanS || 04 May 2023
    let _prodID = "";
    let _prodCode= "";
    let _prodName = "";

    if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

      _prodID = productIDFXAQ;
      _prodCode = productCodeAQ;
      _prodName = ProductNameAQ;

    }else{
        _prodID = productIDFXDQ;
        _prodCode = productCodeDQ;
        _prodName = ProductNameDQ;
    }
    //END

    request_getDataFromAPI(

      {
               
        "EntityID": EntityID,
        "LoginID": userName,
        "ProductCode": _prodCode, //LGTCLI-417 || RizwanS || 04 May 2023
        "NoteMasterID":JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[priceIndex].NoteMasterID,
        "RFQID": dcdrfqid_val,
        "Remark":$(thisTileFXAQ).find('[id^="inputRemark"]').val(),  // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "Mode": _modeFXAQ, // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
        "CurrentTileID": TileId + "|" + "",

      },
      clientConfigdata.CommonMethods.NodeServer + "SaveTradeIdeaFXD","","POST",TileId +"|" + userName + '_' + 'SaveTradeIdeaFXD'  +'_' + RequestIDGenerator(4)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

       
        let thisTileFXAQ = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        if (data.SaveTradeRecommendationResult.TradeIdeaSavedYN == true) {
          
          var orderplaced = "RFQ " + " " + dcdrfqid_val + " " + "marked as trade idea successfully."
          booktradePopup(thisTileFXAQ, "booktradeFXAQ" + TileId, orderplaced, "DivOverlayFXAQ","S");

        } else {

          var orderplaced = "Save trade idea Failed."
          booktradePopup(thisTileFXAQ, "booktradeFXAQ" + TileId, orderplaced, "DivOverlayFXAQ","E");

        }

        // $(thisTileFXAQ).find('[id^="OrderBlotter"]').css({ display: "inline" });
        

        mapleLoaderStop(thisTileFXAQ,'[id^="btnSaveTradeIdea"]',true);


      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(thisTileFXAQ, "booktradeFXAQ" + TileId, "Save trade idea Failed.", "DivOverlayFXAQ","E");
    mapleLoaderStop(thisTileFXAQ,'[id^="btnSaveTradeIdea"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END


// Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
function getMaxLevNotionalFXAQ(notionalamt, frequencynameAQ,settlementval, currId){
  try {

    thisTileFXAQ = document.getElementById("td" + currId);

    let leverageval = "";
    let maxlevnotional;   

    if (
      frequencynameAQ.includes("1Y") ||
      frequencynameAQ.includes("1N")
    ) {
      leverageval = 1;

    } else if (
      frequencynameAQ.includes("2Y") ||
      frequencynameAQ.includes("2N")
    ) {
      leverageval = 2;
    }
    notionalamt = parseFloat( $(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').val().replace(/,/g, ""));
    maxlevnotional = notionalamt * leverageval * settlementval;
    
    $(thisTileFXAQ).find('[id^="MaxLevFXAQ"]').val(maxlevnotional.toLocaleString("en-US")); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023    

  } catch (error) {
    console.log(error.message);
  }
}


function confirmRtoDAQ(that) { // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer
  try {


    TileId = that.id.match(/\d+$/)[0];
    thisTileFXAQ = document.getElementById("td" + TileId);

    $(thisTileFXAQ).find('[id^="validatiionMsg"]').html("");

    // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
    if(isSaveTradeIdeaFXQ){

      SaveTradeIdeaFXAQ(that);
      closeremarkpopup(that);
            

    }else{
        // if (isRM || isIA || isDubaiRM || isDubaiIA) { // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023 
        if (!isFXDDealer) { // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023, 
//LGTGTWINT-1954 || RizwanS || 03 May 2023

        if($(thisTileFXAQ).find('[id^="inputRemark"]').val() == "" || $(thisTileFXAQ).find('[id^="inputRemark"]').val() == undefined || $(thisTileFXAQ).find('[id^="inputRemark"]').val() == null){
  
          $(thisTileFXAQ).find('[id^="validatiionMsg"]').html("Please enter remark.");
          return false;
    
        } else{   
          
          $(thisTileFXAQ).find('[id^="validatiionMsg"]').html("");
          SaveRouteToDealerRFQAQ(that);
          closeremarkpopup(that);
          
        }
  
      } else{
  
        SaveDealerRFQAQ(that);
        closeremarkpopup(that);
  
      }
      //End
    }

  }catch(er){

    console.log(er.message);

  }

} //END


function checkmetalccyflagFXAQ(currId,CcyPair){
  try {

    let thisTileFXAQ = document.getElementById("td" + currId);

    // Changed for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
    let _listCcyAQ = sessionStorage.getItem("CCYListFXAQ")
    let _CcyFXAQ = JSON.parse(_listCcyAQ);        

    if (
      _CcyFXAQ[_CcyFXAQ.findIndex((res) => res.asset_Pair === CcyPair)].lcY_Type.toUpperCase() == "NDF" ||
      _CcyFXAQ[_CcyFXAQ.findIndex((res) => res.asset_Pair === CcyPair)].rcY_Type.toUpperCase() == "NDF"
      ) {
      NDFFlagAQ = "Y";
      IsMetalAQ = "N";
      $(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').attr("disabled", false); // Added to check LCY_Type & RCY_Type // 10 Feb 2022
      isccymetalflagFXAQ = false;   //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      $(thisTileFXAQ).find('[id^="FXDCCYiconFXAQ"]').removeClass("ccytoggle"); //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
     
    } else if (
      _CcyFXAQ[_CcyFXAQ.findIndex((res) => res.asset_Pair == CcyPair)].lcY_Type.toUpperCase() == "METAL" || //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      _CcyFXAQ[_CcyFXAQ.findIndex((res) => res.asset_Pair === CcyPair)].rcY_Type.toUpperCase() == "METAL"
    ) {
      NDFFlagAQ = "N";
      IsMetalAQ = "Y";
      $(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').attr("disabled", true); // Added to check LCY_Type & RCY_Type // 10 Feb 2022        
      isccymetalflagFXAQ = true;   //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      $(thisTileFXAQ).find('[id^="FXDCCYiconFXAQ"]').addClass("ccytoggle"); //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      
    } else {
      NDFFlagAQ = "N";
      IsMetalAQ = "N";
      $(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').attr("disabled", false); // Added to check LCY_Type & RCY_Type // 10 Feb 2022
      isccymetalflagFXAQ = false;   //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      $(thisTileFXAQ).find('[id^="FXDCCYiconFXAQ"]').removeClass("ccytoggle"); //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      
    }  
    $(thisTileFXAQ).find('[id^="hdnisMetalFX"]').val(IsMetalAQ); // LGTCLI-437 | Chaitanya M | 11 July 2023
    $(thisTileFXAQ).find('[id^="hdnNDFFlagFX"]').val(NDFFlagAQ);  // HSBCFXEINT-25 - NDF flag are going blank || Chaitanya M  || 24-Jan 2024 

  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message());
  }
}

// Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
function AddremarkFXAQ(that) {  
  try {
    TileId = that.id.match(/\d+$/)[0];
      $(thisTileFXAQ).find('[id^="validatiionMsg"]').html("");
      isSaveTradeIdeaFXQ = true;
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayFXAQ");  
     

  }catch(er){

    console.log(er.message);

  }

} //END


// Start // LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 17 Apr 2023
function GetContractSummaryFXAQ(that){
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXAQ = document.getElementById("td" + TileId); 
 
    mapleLoaderStart(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',true); // Start - LGTCLI-422 | Chaitanya M | 5 May 2023

     
    // Check for KIStyle
    // START - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
    if (frequencyFAQ.includes("1N") || frequencyFAQ.includes("2N")) {
      KIStyleAQ = KIstyleArrAQ[0];
    } else if (frequencyFAQ.includes("01")) {
      KIStyleAQ = KIstyleArrAQ[1];
    } else if (frequencyFAQ.includes("02")) {
      KIStyleAQ = KIstyleArrAQ[2];
    } else if (frequencyFAQ.includes("12")) {
      KIStyleAQ = KIstyleArrAQ[3];
    }

    // Check For Leverage 
    let LeverageFXAQ = "";

    if (
      frequencyFAQ.includes("1Y") ||
      frequencyFAQ.includes("1N")
    ) {
      LeverageFXAQ = LeverageArrayAQ[0];
    } else if (
      frequencyFAQ.includes("2Y") ||
      frequencyFAQ.includes("2N")
    ) {
      LeverageFXAQ = LeverageArrayAQ[1];
    }
    //End

    // Check For Settlement Freq.
    let SettFreqAQ = "";

    if (frequencyFAQ.includes("BABS")) {
      SettFreqAQ = FreqAQArr[0];
    } else if (
      frequencyFAQ.includes("DAMS")
    ) {
      SettFreqAQ = FreqAQArr[4];
    } else if (
      frequencyFAQ.includes("WAWS")
    ) {
      SettFreqAQ = FreqAQArr[2];
    } else if (
      frequencyFAQ.includes("MAMS")
    ) {
      SettFreqAQ = FreqAQArr[1];
    } else if (
      frequencyFAQ.includes("DAWS")
    ) {
      SettFreqAQ = FreqAQArr[3];
    }
    //End


    // END - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023

    // Check fr KI 
    let KIYN = "";

    if (frequencyFAQ.includes("N")) {

      KIYN = "No"

    } else{

      KIYN = "Yes"

    }
    if($(thisTileFXAQ).find('[id^="hdnisMetalFX"]').val() == "Y"){ // LGTCLI-437 | Chaitanya M | 11 July 2023

      _AlternateCCy = $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[1].trim();
      _Invccy = $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim();
    }else{

      if( $(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').val() ==  $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[1].trim()){    
        
        _AlternateCCy = $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim();
        _Invccy = $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[1].trim();
        
      }else{

        _AlternateCCy = $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[1].trim();
        _Invccy = $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim();
  
      }    
       
    }  

    _notionalperfixingFXAQ = Number($(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').val().replace(/,/g, "").split(".")[0])

    _notionalFXAQ = _notionalperfixingFXAQ * $(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').val(); 

    // Start - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
    //Start
    let _upperbarrierFXAQ ;
    let _lowerbarrierFXAQ ;
    let LowerKIFXAQ ;
    let UpperKIFXAQ;
    
    if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

     if($(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val() > 0 || $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val() != "" || $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val() != null){
      
      _upperbarrierFXAQ = $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "").trim(); // LGTGTWINT-2106 | Chaitanya M | 18 Sep 2023
      _lowerbarrierFXAQ = 0;
      
      }else{
      
        _upperbarrierFXAQ = 0;
        _lowerbarrierFXAQ = 0;
      
      }

      if($(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val() > 0 || $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val() != "" || $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val() != null){
      
        LowerKIFXAQ = $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val().replace(/,/g, ""); // LGTGTWINT-2106 | Chaitanya M | 18 Sep 2023
        UpperKIFXAQ = 0;
        
      }


    }else{

      if($(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val() > 0 || $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val() != "" || $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val() != null){
      
        _lowerbarrierFXAQ = $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "").trim(); // LGTGTWINT-2106 | Chaitanya M | 18 Sep 2023
        _upperbarrierFXAQ = 0;
    
      }else{
      
        _lowerbarrierFXAQ = 0;
        _upperbarrierFXAQ = 0;
      
      }

      if($(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val() > 0 || $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val() != "" || $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val() != null){
      
        UpperKIFXAQ = $(thisTileFXAQ).find('[id^="KIinpboxFXAQ"]').val().replace(/,/g, "").trim(); // LGTGTWINT-2106 | Chaitanya M | 18 Sep 2023
        LowerKIFXAQ = 0;
        
      }

    }
    //End
    // END - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023

    mapleLoaderStart(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',true);

    if($(thisTileFXAQ).find('[id^="GauranteeFXAQ"]').val()>0){

      GetGauranteePeriodsFXAQ(thisTileFXAQ,Number($(thisTileFXAQ).find('[id^="GauranteeFXAQ"]').val()));

    }else{

      _GuaranteedPeriodsFXAQ = Number($(thisTileFXAQ).find('[id^="GauranteeFXAQ"]').val());
      _GuaranteedtillFXAQ = "";
    
    }

    // Start LGTCLI-417 || RizwanS || 04 May 2023
    let _prodID = "";
    let _prodCode= "";
    let _prodName = "";
    let _direction = "";
    let _opType= "";
    let _templateID = "";
    let _tempCode = "";

    if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

      _prodID = productIDFXAQ;
      _prodCode = productCodeAQ;
      _prodName = ProductNameAQ;
      _direction = "Buy";
      _opType = "Call";
      _templateID = TemplateIDFXAQ;
      _tempCode = TemplateCodeFXAQ;

    }else{
       _prodID = productIDFXDQ;
       _prodCode = productCodeDQ;
       _prodName = ProductNameDQ;
       _direction = "Sell";
       _opType = "Call";
       _templateID = TemplateIDFXDQ;
       _tempCode = TemplateCodeFXDQ;
    }
    //END

    // LGTGTWINT-1987 | Chaitanya M | 11 May 2023 - Start
    let _IBPremiumAQ = 0;
    let _IBPrempercAQ = 0;
    let _IBPremDirAQ = "";

    if($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val() == "" || $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val() == null || $(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val() == undefined){

      _IBPremiumAQ = 0;
      _IBPrempercAQ = 0;
      _IBPremDirAQ = "";     

    }else{

      _IBPremiumAQ = Number($(thisTileFXAQ).find('[id^="hdnIBPremFX"]').val().replace(/,/g, ""));
      _IBPrempercAQ = Number($(thisTileFXAQ).find('[id^="hdnIBPremPercFX"]').val());

      // LGTGTWINT-1987 | Chaitanya M | 05 Jun 2023
      if(_IBPrempercAQ > 0 ){ 
        _IBPremDirAQ = "Pay";      
      }else{
        _IBPremDirAQ = "Receive";
        _IBPremiumAQ = _IBPremiumAQ * -1;
        _IBPrempercAQ = _IBPrempercAQ * -1;
      }
      //End

    }
    //End

    request_getDataFromAPI(
      {       
        EntityID: sessionStorage.getItem("HomeEntityID"),
        LoginID: sessionStorage.getItem("Username"),
        ProductCode: _prodCode.toUpperCase(), //LGTCLI-417 || RizwanS || 04 May 2023     
        EntityID_: sessionStorage.getItem("HomeEntityID"),
        TemplateCode: _tempCode.toUpperCase(), //LGTCLI-417 || RizwanS || 04 May 2023     
        producttype:_prodCode.toUpperCase(), //LGTCLI-417 || RizwanS || 04 May 2023     
        BSdirection: _direction, //LGTCLI-417 || RizwanS || 04 May 2023     
        ccypair: $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().trim(),
        OptionType: _opType, //LGTCLI-417 || RizwanS || 04 May 2023     
        Invccy: _Invccy,
        AltNotionalCcy: _AlternateCCy,
        PremCcy: $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim(),
        Notional: _notionalFXAQ,//LGTCLI-391 | Chaitanya M | 27 April 2023
        notionalperfixing : _notionalperfixingFXAQ, //LGTCLI-391 | Chaitanya M | 27 April 2023
        Tenor : $(thisTileFXAQ).find('[id^="hdnFXAQTenorCode"]').val(),
        Expiry:$(thisTileFXAQ).find('[id^="hdnFXAQExpiry"]').val(),
        settlement:$(thisTileFXAQ).find('[id^="hdnFXAQDeliveryDate"]').val(),
        LongDate: "", 
        shortDate: "",
        Strike: Number($(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val().replace(/,/g, "")), // LGTCLI-391 Chaitanya M 9 May 2023
        OptionCut: $(thisTileFXAQ).find('[id^="Optioncutddl"]').val(),
        BarrierType:KIYN, // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
        ExoticCode:"",
        DigitalType:"",
        UpperBarrier: _upperbarrierFXAQ == "" ? 0 : _upperbarrierFXAQ, //LGTGTWINT-1919 | Chaitanya M | 27 April 2023
        LowerBarrier: _lowerbarrierFXAQ == "" ? 0 : _lowerbarrierFXAQ, //LGTGTWINT-1919 | Chaitanya M | 27 April 2023
        LeverageFactor: Number(LeverageFXAQ),
        noofsett: Number($(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').val()),
        nooffixings: Number($(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').val()), 
        FixingFrequency:SettFreqAQ,  
        settfrequency: SettFreqAQ,
        LowerStrike:0,
        UpperStrike:0,
        pivotstrike:0,
        SpreadType: "",
        customerpremdir: "", 
        IBPremDir: _IBPremDirAQ, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
        IBPrem: _IBPremiumAQ, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
        RTC:0,
        IBPremperc: _IBPrempercAQ, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
        RTCPerc:0,
        Target:0,
        TargetNotional:0, 
        KIStyle: KIStyleAQ, // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
        LowerKI: LowerKIFXAQ == "" ? 0 : LowerKIFXAQ,  // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
        UpperKI: UpperKIFXAQ == "" ? 0 : UpperKIFXAQ, // HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
        Guaranteedtill: _GuaranteedtillFXAQ,
        GuaranteedPeriods: _GuaranteedPeriodsFXAQ,
        CappedLossCcy:"",
        CappedLossType:"", 
        CappedLoss:"",
        CappedLossAmt:0,
        TargetBigFigure:"",
        Targetgainunit: "",
        TargetinPips: 0,
        KOITMEvent: 0,
        Striptype: "",
        FirstFixingDate: $(thisTileFXAQ).find('[id^="FirstFixDate"]').val(),
        FinalPayType:"",
        FixingAdjustment:"", //LGTGTWINT-1919 | Chaitanya M | 27 April 2023
        CurrentTileID:TileId + "|" + ""
      },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/GetContractSummary","","POST",TileId +"|" + userName + '_' + 'GetContractSummary_IP'  +'_' + RequestIDGenerator(4)).then((data) => { // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      
        let thisTileFXAQ = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

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

          res =  data.dataFromAjax.result.toString().replaceAll("\\n", "<br>");  
        
          if(res.includes('color:green')){
            summary = res.toString().replaceAll("\color:green","color:var(--green) !important");
          }else{
            summary = res.toString().replaceAll("\color:red","color:var(--red) !important");
          }       
          
          $(thisTileFXAQ).find('[id^="ContractSummaryFXD"]').append(summary);
          
          summarytradePopup(that,"SummaryFXD" + TileId,res,"DivOverlayFXAQ"); 

          mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',true);   

        }else{
          
          mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',true);   
          let failReason = "No response received from remote system.";          
          ValidateField($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').attr('id'), failReason, thisTileFXAQ);

        }
        
      }); 

  } catch (error) {
      
    mapleLoaderStop(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',true);   
    console.log(error.message);
  }
}

function GetGauranteePeriodsFXAQ(thisTileFXAQ,GuaranteedPeriodsFXAQ){
  try {    

    mapleLoaderStart(thisTileFXAQ,'[id^="btnBestPriceFXAQ"]',true);

    let ScheduleXML = "";
    let NoteMasterID ="";
    let SettFreqAQ = "";

    // START - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023

    // HSBCPBIN-502 | Chaitanya M | 18 Sep 2023
    if (frequencyFAQ.includes("N")) {

      KIYN = "No"

    } else{

      KIYN = "Yes"

    }
    // End
    
    if (frequencyFAQ.includes("BABS")) {
      SettFreqAQ = FreqAQArr[0];
    } else if (
      frequencyFAQ.includes("DAMS")
    ) {
      SettFreqAQ = FreqAQArr[4];
    } else if (
      frequencyFAQ.includes("WAWS")
    ) {
      SettFreqAQ = FreqAQArr[2];
    } else if (
      frequencyFAQ.includes("MAMS")
    ) {
      SettFreqAQ = FreqAQArr[1];
    } else if (
      frequencyFAQ.includes("DAWS")
    ) {
      SettFreqAQ = FreqAQArr[3];
    }
    //End
    
    if (
      frequencyFAQ.includes("1Y") ||
      frequencyFAQ.includes("1N")
    ) {
      LeverageFXAQ = LeverageArrayAQ[0];
    } else if (
      frequencyFAQ.includes("2Y") ||
      frequencyFAQ.includes("2N")
    ) {
      LeverageFXAQ = LeverageArrayAQ[1];
    }
    // END - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023


    // Start LGTCLI-417 || RizwanS || 04 May 2023
    let _prodID = "";
    let _prodCode= "";
    let _prodName = "";
    let _direction = "";
    let _opType= "";
    let _templateID = "";
    let _tempCode = "";

    if ($(thisTileFXAQ).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

      _prodID = productIDFXAQ;
      _prodCode = productCodeAQ;
      _prodName = ProductNameAQ;
      _direction = "BUY";
      _opType = "Call";
      _templateID = TemplateIDFXAQ;
      _tempCode = TemplateCodeFXAQ;

    }else{
      _prodID = productIDFXDQ;
      _prodCode = productCodeDQ;
      _prodName = ProductNameDQ;
      _direction = "SELL";
      _opType = "Put";
      _templateID = TemplateIDFXDQ;
      _tempCode = TemplateCodeFXDQ;
    }
    //END
    
    if($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val() !=""){

      var isNonBestPrice = false;
      if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
        isNonBestPrice = true;
      } else {
        isNonBestPrice = false;
      }
      var priceIndex = -1;
      if (isNonBestPrice) {
        priceIndex = parseInt(
          $(thisTileFXAQ).find('[id^="hdnPriceIndexFXAQ"]').val()
        );
      } else {
        priceIndex = 0;
      }
           
      NoteMasterID = JSON.parse($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').val())[priceIndex].NoteMasterID;
      ScheduleXML="";

    }else{

      NoteMasterID="";
      ScheduleXML = "<ExcelSheets><Sheet1><Product_Name>" + _prodName +"</Product_Name>" +  //LGTCLI-417 || RizwanS || 04 May 2023
      "<Hedging_x0020_Type>"+ clientConfigdata.FXDCommonMethods.Hedging_Type + "</Hedging_x0020_Type>"+
      "<CustID>"+ custID + "</CustID>" +
      "<Customer_Name>" + custName + "</Customer_Name>" +
      "<GuaranteedPeriods>"+ GuaranteedPeriodsFXAQ +"</GuaranteedPeriods>"+
      "<OptionCut>"+ $(thisTileFXAQ).find('[id^="Optioncutddl"]').val() + "</OptionCut>" +
      "<KO>" + $(thisTileFXAQ).find('[id^="barrieripboxFXAQ"]').val().replace(/,/g, "") +"</KO>" +
      "<FirstFixingDate>" +$(thisTileFXAQ).find('[id^="FirstFixDate"]').val() +"</FirstFixingDate>" +
      "<NonDeliveryYN>N</NonDeliveryYN>" +
      "<FixingSettFreq>" +SettFreqAQ +"</FixingSettFreq>" + 
      "<Currency1>" + $(thisTileFXAQ).find('[id^="CcySelectionFXAQ"]').val() +"</Currency1>" +
      "<CcyPair>" + $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().trim() +"</CcyPair>" +
      "<PremiumCcy>" + $(thisTileFXAQ).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim() +"</PremiumCcy>" +
      "<CustPrem>0.00</CustPrem>" + 
      "<BuySell>"+ _direction +"</BuySell>" + //LGTCLI-417 || RizwanS || 04 May 2023
      "<Spotrate>" + $(thisTileFXAQ).find('[id^="rateFXAQ"]').html().split("/")[0].replace(/,/g, "").trim() +"</Spotrate>" +
      "<LeverageFactor>" + LeverageFXAQ +"</LeverageFactor>" +
      "<Ccy1PerFixing>" + $(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').val().replace(/,/g, "") +"</Ccy1PerFixing>" +
      "<Notional>"+ $(thisTileFXAQ).find('[id^="ContractAmtFXAQ"]').val().replace(/,/g, "") + "</Notional>" +
      "<NotionalType>Per Fixing</NotionalType>" +
      "<TradeDate>" + TradeDateFXAQ +"</TradeDate>" +
      "<PremiumDate>" + $(thisTileFXAQ).find('[id^="hdnFXAQPremiumDate"]').val() +"</PremiumDate>" +
      "<FixingDate>" + $(thisTileFXAQ).find('[id^="hdnFXAQExpiry"]').val() +"</FixingDate>" +
      "<SettDate>" + $(thisTileFXAQ).find('[id^="hdnFXAQDeliveryDate"]').val() +"</SettDate>" +
      "<TenorDays>" + $(thisTileFXAQ).find('[id^="hdnTenorDaysAQ"]').val() +"</TenorDays>" +
      "<Tenor>" + $(thisTileFXAQ).find('[id^="hdnFXAQTenorCode"]').val() +"</Tenor>" +
      "<Strike>" + $(thisTileFXAQ).find('[id^="strikeipboxFXAQ"]').val().replace(/,/g, "") +"</Strike>" +
      "<KIBarrierType>"+ KIYN +"</KIBarrierType>" +  // HSBCPBIN-502 | Chaitanya M | 18 Sep 2023
      "<KIYesNo>" + KIYN +"</KIYesNo>" + // HSBCPBIN-502 | Chaitanya M | 18 Sep 2023
      "<KI></KI><KIStyle></KIStyle>" + // HSBCPBIN-502 | Chaitanya M | 18 Sep 2023
      "<EntityID>" + sessionStorage.getItem("HomeEntityID") +"</EntityID>" +
      "<CAI_ID>" + clientConfigdata.FXDCommonMethods.CAI_ID +"</CAI_ID>" +
      "<NoofSett>" + $(thisTileFXAQ).find('[id^="NOSettlementinpboxFXAQ"]').val() +"</NoofSett>" +
      "</Sheet1>" +
      "</ExcelSheets>";

    }
  
    let requestObject = {
             
      EntityID: sessionStorage.getItem("HomeEntityID"),
      LoginID: sessionStorage.getItem("Username"),
      FXD_TOKEN: sessionStorage.getItem("FXD_Token").toString(),
      ProductCode: _prodCode.toUpperCase(), ////LGTCLI-417 || RizwanS || 04 May 2023
      ExternalXMLString : ScheduleXML,
      NoteMasterID: NoteMasterID,
      TemplateCode: _tempCode, //LGTCLI-417 || RizwanS || 04 May 2023
      TemplateID:_templateID, //LGTCLI-417 || RizwanS || 04 May 2023
    
    }

    $.ajax({
      type: "POST",
      url: clientConfigdata.CommonMethods.NodeServer + "GetScheduleNew_IP",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(requestObject),
      crossDomain: true,
      async: false,
      success: function (data) {
    
        if(data.ViewScheduleResult.A_ResponseHeader.Status == 'Success'){ 
          SampleArray = JSON.parse(JSON.stringify(data.ViewScheduleResult.ScheduleDetails).toString()).SchdeuleData;

          for (let i = 0; i < SampleArray.length; i++) {
            SampleObject = SampleArray[i];
            for (var key in SampleObject) {
              if(key === 'RM_Action_Class' && SampleObject[key] == "Input XML" ){
                xml2js.parseString(SampleObject['RS_Message_Format'], function () {
                  console.log(SampleObject['RS_Message_Format']);
                  const parser = new DOMParser();
                  const xml = parser.parseFromString(SampleObject['RS_Message_Format'], 'text/xml');
                  Values.push(xml2json.fromStr(xml)['NewDataSet'].quoteDetails)
                });
              }
              
              if (SampleObject[key]== 0 || SampleObject[key] == null) {
                
                SampleObject[key] = "";
          
                }
              if (SampleObject[key] == ' ') {
                
                SampleObject[key] = '0.00';
              
              }

              if (key === 'Notional') {
                
                SampleObject[key] = SampleObject[key].replace(/,/g, '');
              
              }
            }
            SampleArray[i] = SampleObject;
          }  

          Values = SampleArray;  
          Values.forEach((element) => {
            _RSfixingdate = new Date(element.RS_Fixing_Date);
            _RSfixingdate = _RSfixingdate.getFullYear() +  "-" + ("0" + (_RSfixingdate.getMonth() + 1)).substr(-2, 2) +
              "-" +("0" + _RSfixingdate.getDate()).substr(-2, 2);
            element.RS_Fixing_Date = new Date(_RSfixingdate);
          });

          Values = Values.sort((objA, objB) => objA.RS_Fixing_Date.getTime() - objB.RS_Fixing_Date.getTime(),);

          let VanillaArr = Values.filter(item => item.Product_Type === 'VANILLA')

          let index = VanillaArr.findLastIndex(n => n.Product_Type === "VANILLA")
          if(VanillaArr.length === 0 || VanillaArr.length === undefined) { 
            _GuaranteedPeriodsFXAQ = GuaranteedPeriodsFXAQ;
            _GuaranteedtillFXAQ = '0';
          }else{
            _GuaranteedPeriodsFXAQ = GuaranteedPeriodsFXAQ;
            _GuaranteedtillFXAQ = VanillaArr[index].RS_Fixing_Date.toShortFormat();
          }

        }else{
         
          let failReason = data.ViewScheduleResult.A_ResponseHeader.FailedReason;           
          ValidateField($(thisTileFXAQ).find('[id^="hdnPricesFXAQ"]').attr('id'), failReason, thisTileFXAQ);
        
        }
      },

      error: function (xhr, ajaxOptions, thrownError) {
        console.log("Error while calling API => ", this.url, " error objects => ", xhr, ajaxOptions, thrownError, status);

        if (thrownError === "timeout") {
          console.log("request timeout while calling API => ", this.url, " error objects => ", xhr, ajaxOptions, thrownError, status);
        }
      },
    });
  
  } catch (error) {
    console.log(error.message);
  }
}

//End

// Start - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
function setFrequencyType(thisTileFXAQ,typeval){
  try{
    if(!$(thisTileFXAQ).find('[id^="rbRowKIToggleAQ"]')[0].checked){ 
      
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

    frequencyFAQ = typeval;
    return typeval
  }catch (error){
    console.log(error.message);
  }
}
// End - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023

// Start - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023
function SetDateValues(typeval,NoofFixing, thisTileFXAQ, FreqAQ, tenorArrAQ){
  try {
    
    if( typeval == "MAMS1Y01" || typeval == "MAMS2Y02" || typeval == "MAMS2Y12"){
      Fixing_Frequency = FreqAQ[2];
      Settlement_Frequency = FreqAQ[2];
      Tenor_Codes = NoofFixing + Settlement_Frequency[0];
    }else if( typeval == "MAMS1N00" || typeval == "MAMS2N00") {
      Fixing_Frequency = FreqAQ[2];
      Settlement_Frequency = FreqAQ[2];
      Tenor_Codes = NoofFixing + Settlement_Frequency[0];
    }else if ( typeval == "WAWS1Y01" || typeval == "WAWS2Y02" || typeval == "WAWS2Y12") {
      Fixing_Frequency = FreqAQ[3];
      Settlement_Frequency = FreqAQ[3];
      Tenor_Codes = NoofFixing + Settlement_Frequency[0];
    }else if (typeval == "WAWS1N00" || typeval == "WAWS2N00") {
      Fixing_Frequency = FreqAQ[3];
      Settlement_Frequency = FreqAQ[3];
      Tenor_Codes = NoofFixing + Settlement_Frequency[0];
    } else if (typeval == "BABS1Y01" || typeval == "BABS2Y02" || typeval == "BABS2Y12") {
      Fixing_Frequency = FreqAQ[1];
      Settlement_Frequency = FreqAQ[1];
      Tenor_Codes = NoofFixing * 2 + tenorArrAQ[1][1];
    } else if (typeval == "BABS1N00" || typeval == "BABS2N00") {
      Fixing_Frequency = FreqAQ[1];
      Settlement_Frequency = FreqAQ[1];
      Tenor_Codes = NoofFixing * 2 + tenorArrAQ[1][1];
    } else if ( typeval == "DAWS1Y01" || typeval == "DAWS2Y02" || typeval == "DAWS2Y12") {
      Fixing_Frequency = FreqAQ[0];
      Settlement_Frequency = FreqAQ[3];
      Tenor_Codes = NoofFixing + Settlement_Frequency[0];
    } else if (typeval == "DAWS1N00" || typeval == "DAWS2N00") {
      Fixing_Frequency = FreqAQ[0];
      Settlement_Frequency = FreqAQ[3];
      Tenor_Codes = NoofFixing + Settlement_Frequency[0];
    } else if (typeval == "DAMS1Y01" || typeval == "DAMS2Y02" || typeval == "DAMS2Y12") {
      Fixing_Frequency = FreqAQ[0];
      Settlement_Frequency = FreqAQ[2];
      Tenor_Codes = NoofFixing + Settlement_Frequency[0];
    } else if (typeval == "DAMS1N00" || typeval == "DAMS2N00") {
      Fixing_Frequency = FreqAQ[0];
      Settlement_Frequency = FreqAQ[2];
      Tenor_Codes = NoofFixing + Settlement_Frequency[0];
    }

    $(thisTileFXAQ).find('[id^="hdnFXAQTenorCode"]').val(Tenor_Codes);
    $(thisTileFXAQ).find('[id^="hdnFixingFrequencyFXAQ"]').val(Fixing_Frequency);
    $(thisTileFXAQ).find('[id^="hdnSettlementFrequencyFXAQ"]').val(Settlement_Frequency);

  } catch (error) {
    console.log(error.message);
  }
}
// End - HSBCPBIN-502 | Chaitanya M | 06 Sep 2023