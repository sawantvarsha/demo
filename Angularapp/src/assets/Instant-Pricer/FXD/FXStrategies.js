var TradeDateFXStrategies;
var tenorListFXStrategies = ["1W","2W","3W","4W","1M","2M","3M","4M","5M","6M","7M","8M","9M","10M","11M","1Y","2Y","3Y","5Y","7Y"];
var idFXStrategies = 21;
var OptionCutListFXStrategies = []; 
var _defaultflagGXStrategies=false; //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
var isSaveTradeIdeaFXStrategies;
var _eventstrikechangeFXStrategies = false; //LGTCLI-422 | Chaitanya M | 5 May 2023
var MinQuoteTimeOutOccurredFXStrategies = false; // LGTGTWINT-1934 || ChaitanyaM || 03 Jun 2023  
var timeoutFXStrategies=""; //LGTGTWINT-2110 | Chaitanya M | 13 June 2023

//Added by RizwanS || LGTGTWINT-2322 || 22 Aug 2023
var MaxQuoteTimeOutSTRADDLE = "";
var MinQuoteTimeOutSTRADDLE = "";
var MaxQuoteTimeOutSTRANGLE = "";
var MinQuoteTimeOutSTRANGLE = "";
var MaxQuoteTimeOutRSKREV = "";
var MinQuoteTimeOutRSKREV= "";
var MaxQuoteTimeOutOPSPRD = "";
var MinQuoteTimeOutOPSPRD = "";
var LPListOPSPRD = "";
var LPListRSKREV = "";
var LPListStrangle = "";
var LPListStraddle = "";
//END


$(document).ready(function () {
  try {
  
  } catch (err) {
    console.log(err.message);
  }
});

//To initialize FXStrategies product functions while the page is being loaded
function onLoadFXStrategies(currId) {
  try {
   
    setDeafaultValuesFXStrategies(currId);

    thisTileFXStrategies = document.getElementById("td" + currId);
    
    mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);

    resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    $(thisTileFXStrategies).find('[id^="tenorFXStrategies"]').on("change", function () {
      try {
        
        thisTileFXStrategies = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
        $(this).parents(".sorting").find('[id^="FXStrategies_CCYPairDemo"]').removeClass("ValidateFieldCSS");
        document.getElementById("required").style.display = "none";
        var val = this.value;

        mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);

        resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        fillDatesFXStrategies(
          $(this).parents(".sorting").find('[id^="FXStrategies_CCYPairDemo"]').val(),
          $(this).parents(".sorting").find('[id^="tenorFXStrategies"]').val(),
          currId);

          return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
          
      } catch (error) {
        console.log(error.message);
      }
    });

    //Change Strike on BUY / SELL

    $(thisTileFXStrategies).find('[id^="strategiesBuySell"]').on("change", function () {

      currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0]; // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

      thisTileFXStrategies = document.getElementById("td" + currId); // LGTGTWINT-1832 Max client profit for TRF and Pivot| Chaitanya M | 10 April 2023

      mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        if ($(thisTileFXStrategies).find('[id^="strategiesBuySell"]').val().trim() == "Buy") { 
            
          // Added for LGTCLI-348 FX Tiles Buy Sell Toggle UI Follow Single Pricer | Chaitanya M | 29 March 2023
          $(thisTileFXStrategies).find('[id^="strategiesBuySell"]').removeClass("SellDropdown");
          $(thisTileFXStrategies).find('[id^="strategiesBuySell"]').addClass("BuyDropdown");
          //End
          
          getCurrencyFXStrategiesRate(currId);
  
          
        } else {

          // Added for LGTCLI-348 FX Tiles Buy Sell Toggle UI Follow Single Pricer | Chaitanya M | 29 March 2023
          $(thisTileFXStrategies).find('[id^="strategiesBuySell"]').removeClass("BuyDropdown");
          $(thisTileFXStrategies).find('[id^="strategiesBuySell"]').addClass("SellDropdown");
          //End

          getCurrencyFXStrategiesRate(currId);

        }

        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
       
      });

 
    $(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').on("change", function () {
        try {

          currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0]; 

          thisTileFXStrategies = document.getElementById("td" + currId);    
      
          checkSolveForStrategies(thisTileFXStrategies);
      
          getCurrencyFXStrategiesRate(currId);

          return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
      
        } catch (error) {
          console.log(error.message);
        }
    });

    $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').on("select", function () {
      try {
        
        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0]; 
        thisTileFXStrategies = document.getElementById("td" + currId);

        mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);

        resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        let ccypairs;

        if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
          
          ccypairs =  sessionStorage.getItem("CCYListStraddle"); 
          $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val(""); //LGTGTWINT-2552 || RizwanS || 31 Jan 2024
    
        }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
    
          ccypairs =  sessionStorage.getItem("CCYListStrangle"); 
          $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val(""); //LGTGTWINT-2552 || RizwanS || 31 Jan 2024
          $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(""); //LGTGTWINT-2552 || RizwanS || 31 Jan 2024
        
        }else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal"){
        
          ccypairs =  sessionStorage.getItem("CCYListRSKREV"); 
          $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val(""); //LGTGTWINT-2552 || RizwanS || 31 Jan 2024
          $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(""); //LGTGTWINT-2552 || RizwanS || 31 Jan 2024
    
        }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {      

          ccypairs =  sessionStorage.getItem("CCYListOPSPRD"); 
          $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val(""); //LGTGTWINT-2552 || RizwanS || 31 Jan 2024
          $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(""); //LGTGTWINT-2552 || RizwanS || 31 Jan 2024

        }

        if(!ccypairs.includes($(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val())){ //LGTGTWINT-1582 | currency pair validation on instant pricer | Chaitanya M | 02-March-2023
          $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val("");
          ValidateField($(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').attr("id"), "Currency pair not found.", thisTileFXStrategies);
          return false;
        }else{

          //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
          if( $(this).parents(".sorting").find('[id^="hdnCcyDetailsFXStrategies"]').val() ==  $(this).parents(".sorting").find('[id^="FXStrategies_CCYPairDemo"]').val()){
            return false;
          }else{

            getCurrencyFXStrategiesRate(currId);
            $(thisTileFXStrategies).find('[id^="CcySelectionFXStrategies"]').val($(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[0].trim());
            return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
          }

        }

      } catch (error) {
        console.log(error.message);
      }
    });

    //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022

    $(thisTileFXStrategies).find('[id^="CcySelectionToggleFXStrategies"]').on("click", function () { 
      try { 

        currId = $(this).parents(".sorting")[0].id.match(/\d+/)[0]; 
        thisTileFXStrategies = document.getElementById("td" + currId);

        $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true); // LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
        $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);

        mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);

        resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        if($(thisTileFXStrategies).find('[id^="hdnisMetalFX"]').val() !== true){        
  
          if($(thisTileFXStrategies).find('[id^="CcySelectionFXStrategies"]').val() === $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[0].trim()){
            
            $(thisTileFXStrategies).find('[id^="CcySelectionFXStrategies"]').val($(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[1].trim());
      
          }else{
            
            $(thisTileFXStrategies).find('[id^="CcySelectionFXStrategies"]').val($(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[0].trim());  
          
          }   
        
          checkDecimalAmt("", thisTileFXStrategies);

        }

        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023

      } catch (error) {
        console.log(error.message);
      }
    });

    $(thisTileFXStrategies).find('[id^="ContractAmtFXStrategies"]').on("change", function(){
      thisTileFXStrategies = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023  
      $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);
      mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);
      resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      FormatNotional($(this).parents(".sorting").find('[id^="ContractAmtFXStrategies"]').val(),this); // Added for LGTGTWINT-1511  Incorrect max notional calculation | Chaitanya M | 24 feb 2023
    });

    $(thisTileFXStrategies).find('[id^="Optioncutddl"]').on("change", function(){
      thisTileFXStrategies = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023  
      $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);
      mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);
      resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    });

    $(thisTileFXStrategies).find('[id^="FirstFixDate"]').on("change", function(){
      thisTileFXStrategies = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023  
      $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);
      mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);
      resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    });

    $(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').on("change", function(){
      thisTileFXStrategies = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023  
      $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);
      mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);
      resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    });

    $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').on("change", function(){
      thisTileFXStrategies = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023  
      $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);
      mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);
      resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      _eventstrikechangeFXStrategies = true; // F5SAAINT-687 | Chaitanya M | 04 Dec 2023
    });

    $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').on("change", function(){
      thisTileFXStrategies = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023  
      $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);
      mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);
      resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      _eventstrikechangeFXStrategies = true; // F5SAAINT-687 | Chaitanya M | 04 Dec 2023
    });

    $(thisTileFXStrategies).find('[id^="UpfrontFXStrategies"]').on("change", function(){
      thisTileFXStrategies = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023  
      $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);
      mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);
      resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    });

    $(thisTileFXStrategies).find('[id^="LevergeFXStrategies"]').on("change", function(){
      thisTileFXStrategies = $(this).parents(".sorting")[0];  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023  
      $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true); //  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);
      mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);
      resetFXDPrice(thisTileFXStrategies); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    });
    
    //END
  } catch (error) {
    console.log(error.message);
  }
}

//To set the default values of input fields in FXStrategies
function setDeafaultValuesFXStrategies(currId) {
  try {
    thisTileFXStrategies = document.getElementById("td" + currId);
    fillDropdownlistControl(tenorListFXStrategies,$(thisTileFXStrategies).find('[id^="tenorFXStrategies"]').attr("id"));
    fillDropdownlistControl(solveforStrategies,$(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').attr("id"));
    document.querySelector("#" + $(thisTileFXStrategies).find('[id^="tenorFXStrategies"]').attr("id")).selectedIndex = 6;
    $(thisTileFXStrategies).find('[id^="LevergeFXStrategies"]').val("1");
    $(thisTileFXStrategies).find('[id^="ContractAmtFXStrategies"]').val("1,000,000.00");
    $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val("EUR - USD");
    $(thisTileFXStrategies).find('[id^="primaryCcyStrategies"]').html("EUR");
    $(thisTileFXStrategies).find('[id^="SecondaryCcyStrategies"]').html("USD");
    $(thisTileFXStrategies).find('[id^="UpfrontFXStrategies"]').val("0.05");  // Added by Chaitanya M | 25 July 2023
    


    //LGTCLI-417 || RizwanS || 04 May 2023

    if ($(thisTileFXStrategies).find('[id^="strategiesBuySell"]').val().trim() == "Buy") {
      $(thisTileFXStrategies).find('[id^="strategiesBuySell"]').removeClass("SellDropdown");
      $(thisTileFXStrategies).find('[id^="strategiesBuySell"]').addClass("BuyDropdown");
    }else{
      $(thisTileFXStrategies).find('[id^="strategiesBuySell"]').removeClass("BuyDropdown");
      $(thisTileFXStrategies).find('[id^="strategiesBuySell"]').addClass("SellDropdown");
    }

    //END

    clearPricerTable(thisTileFXStrategies);


  //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
    $(thisTileFXStrategies).find('[id^="hdnCcyDetailsFXStrategies"]').val($(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val());
  //End

    //Added for ccy pair autocomlete / JIRA - FINGUI - 237 / 14 Feb 2022
    callCcyautocompleteFX(thisTileFXStrategies, "FXStrategies_CCYPairDemo");
    //END
  } catch (error) {
    console.log(error.message);
  }
}

//To get Trade, Premium, Expiry, Delivery Dates
function fillDatesFXStrategies(pair, tenorValue, currId) {
  try {
    thisTileFXStrategies = document.getElementById("td" + currId);

    // Addded for CFINT-992 // 18-Sep-2020 //

    $(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", true);

    //END
    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
      productIDStrategies = productIDStraddle;
      productCodeStrategies = productCodeStraddle;
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
      productIDStrategies = productIDStrangle;
      productCodeStrategies = productCodeStrangle;
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
      productIDStrategies = productIDRSKREV;
      productCodeStrategies = productCodeRSKREV;
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {
      productIDStrategies = productIDOPSPRD;
      productCodeStrategies = productCodeOPSPRD;
    }

     // Addded for CFINT-992 // 18-Sep-2020 //
     $(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", true);
     $(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", true);
     $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
     $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);
     clearPricerTable(thisTileFXStrategies);
     //END

    request_getDataFromAPI(
      {

        "currencyPair": $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().trim(),
        "tradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "tenor_Code": tenorValue,
        "tenor" : '',
        "fixing_Frequency":"",	
        "settlement_Frequency":"",
        "depoCcy": pair.split("-")[0].trim(),
        "altCcy": pair.split("-")[1].trim(),
        "iProductId": productIDStrategies,
        "i_ProductCode": productCodeStrategies,
        "i_Mode" : "FXOSEN",
        // "CurrentTileID": currId,
        "optionCut": $(thisTileFXStrategies).find('[id^="Optioncutddl"]').val(),
        "firstFixingChangeYN" : "",  
        "firstFixingDate" : "",
        "defaultFixingDate":'',
        "defaultSettDate":'',
        "prem_Settlement_Days" :'', // Added missing parameters for Date service call | ChaitanyaM | 25-April-2024
        "CurrentTileID": currId + "|" + "",
      },
      clientConfigdata.CommonMethods.NodeServer + "DateCalculationApi/Get_FinIQ_CalculateDatesWrapper","","POST",currId +"|" + userName + '_' + 'CalculateDates_IP'  +'_' + RequestIDGenerator(8)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        let thisTileFXStrategies = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        // let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

        let responseHeader = "";

        if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
          responseHeader = "FAIL";
        }else{
          responseHeader = "SUCCESS";
        }

        if(responseHeader.toUpperCase() == "SUCCESS"){
        TradeDateFXStrategies = setBusinessDate;
        $(thisTileFXStrategies).find('[id^="FXStrategies_Expiry"]').html(data.dataFromAjax[0].maturityDate);
        $(thisTileFXStrategies).find('[id^="FXStrategies_FixingDate"]').html(data.dataFromAjax[0].fixingDate); //Added by RizwanS || to show fixing date on UI || 27 Jul 2023
        $(thisTileFXStrategies).find('[id^="hdnFXStrategiesPremiumDate"]').val(data.dataFromAjax[0].valueDate);
        $(thisTileFXStrategies).find('[id^="hdnFXStrategiesExpiry"]').val(data.dataFromAjax[0].fixingDate);
        $(thisTileFXStrategies).find('[id^="hdnFXStrategiesDeliveryDate"]').val(data.dataFromAjax[0].maturityDate);
        $(thisTileFXStrategies).find('[id^="hdnTenorDaysStrategies"]').val(data.dataFromAjax[0].expiryDays);
        // Addded for CFINT-992 // 18-Sep-2020 //

        $(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", false);

        setNDFMetalFlagStrategies(
          currId,
          $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().trim(),
          pair.split("-")[0].trim(),
          pair.split("-")[1].trim(),
          "",
          "",
          $(thisTileFXStrategies).find('[id^="hdnFXStrategiesPremiumDate"]').val(),
          $(thisTileFXStrategies).find('[id^="hdnFXStrategiesExpiry"]').val(),
          $(thisTileFXStrategies).find('[id^="hdnFXStrategiesDeliveryDate"]').val()
        );

        //END
      } else {

        let failReason = data.dataFromAjax.CalculateDatesResult.A_ResponseHeader.FailedReason; 
        
        ValidateField($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').attr('id'), failReason, thisTileFXStrategies);

      } 
    }).catch((error) => {
          console.log(error);
    });
  } catch (error) {
    console.log(error.message);
  }
}

function fillFirstFixingDateFXStrategie(pair, tenorValue, currId) {
  try {
    thisTileFXStrategies = document.getElementById("td" + currId);

    // Addded for CFINT-992 // 18-Sep-2020 //

    $(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", true);

    //END
    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
      productIDStrategies = productIDStraddle;
      productCodeStrategies = productCodeStraddle;
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
      productIDStrategies = productIDStrangle;
      productCodeStrategies = productCodeStrangle;
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
      productIDStrategies = productIDRSKREV;
      productCodeStrategies = productCodeRSKREV;
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {
      productIDStrategies = productIDOPSPRD;
      productCodeStrategies = productCodeOPSPRD;
    } 

    $(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", true);
    $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);

    clearPricerTable(thisTileFXStrategies);

    request_getDataFromAPI(
      {

        "CurrencyPair": $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().trim(),
        "TradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "Tenor_Code": tenorValue,
        "Fixing_Frequency": "",
        "Settlement_Frequency": "",
        "EntityID": EntityID,
        "LoginID": userName,
        "DepoCcy": pair.split("-")[0].trim(),
        "AltCcy": pair.split("-")[1].trim(),
        "iProductId": productIDStrategies,
        "I_ProductCode": productCodeStrategies,
        "ProductCode": productCodeStrategies,
        // "CurrentTileID": currId,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "optioncut": $(thisTileFXStrategies).find('[id^="Optioncutddl"]').val(),

      },
      clientConfigdata.CommonMethods.NodeServer + "fillFirstFixingDate","","POST",currId +"|" + userName + '_' + 'fillFirstFixingDate'  +'_' + RequestIDGenerator(8)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        let thisTileFXStrategies = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let TileId = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

        if(responseHeader.toUpperCase() == "SUCCESS"){
        
          let strFirstFix = new Date(data.CalculateDatesResult.Dates[0].FixingDate);
          let firstFix =strFirstFix.getFullYear() +
            "-" + ("0" + (strFirstFix.getMonth() + 1)).substr(-2, 2) +
            "-" + ("0" + strFirstFix.getDate()).substr(-2, 2);


        $(thisTileFXStrategies).find('[id^="FirstFixDate"]').val(firstFix); 
        $(thisTileFXStrategies).find('[id^="lblFirstFixDate"]').html(data.CalculateDatesResult.Dates[0].FixingDate);

        $(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", false);


        //END
      } else {

        let failReason = data.CalculateDatesResult.A_ResponseHeader.FailedReason; 
        
        ValidateField($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').attr('id'), failReason, thisTileFXStrategies);

      } 
    }).catch((error) => {
          console.log(error);
    });
  } catch (error) {
    console.log(error.message);
  }
}

//To Get Best Price of FXStrategies and display the prices
function getBestPriceFXStrategies(that, Scheduleflag) {
  try {

    TileId  = that.id.match(/\d+$/)[0];
    thisTileFXStrategies = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
    validation_clear(); //To Remove highlighted part if no error

    resetFXDPrice(thisTileFXStrategies);
    
    $(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", true); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    
    let _RID_Strategies = ""; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    _RID_Strategies = _RID_Strategies + RequestIDGenerator(30); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    $(thisTileFXStrategies).find('[id^="hdnRequestID"]').val(_RID_Strategies);  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    //Validation conditions

    if ($.trim($(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val()) ===""
    ) {
      ValidateField($(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').attr("id"),"Please Select Currency Pair",thisTileFXStrategies);
      return false;
    } else if ($.trim($(thisTileFXStrategies).find('[id^="ContractAmtFXStrategies"]').val()) === "" ||parseFloat($(thisTileFXStrategies).find('[id^="ContractAmtFXStrategies"]').val()) == 0) {
      ValidateField($(thisTileFXStrategies).find('[id^="ContractAmtFXStrategies"]').attr("id"),"Please Enter Valid Notional Amount",thisTileFXStrategies);
      return false;
    }
    // else if ($.trim($(thisTileFXStrategies).find('[id^="UpfrontFXStrategies"]').val().replace(/,/g, "")) === ""
    // || $.trim($(thisTileFXStrategies).find('[id^="UpfrontFXStrategies"]').val().replace(/,/g, "")) <= 0) {
    //   ValidateField($(thisTileFXStrategies).find('[id^="UpfrontFXStrategies"]').attr("id"),"Please Enter Valid Upfront",thisTileFXStrategies);
    //   return false;
    // }
    

    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {

      if ($.trim($(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val().replace(/,/g, "")) == "" || parseFloat($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val().replace(/,/g, "")) <= 0) {
        ValidateField($(thisTileFXStrategies).find('[id^="StrikeStraddle"]').attr("id"),"Please Enter Valid Strike",thisTileFXStrategies);
        return false;
      }

   
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() ==="Strangle") {
      if ($.trim($(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val().replace(/,/g, "")) == "" ||
        parseFloat($(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val().replace(/,/g, "")) <= 0) {
          
          ValidateField($(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').attr("id"),"Please Enter Valid Put Strike",thisTileFXStrategies);
          return false;
     
      } else if ($.trim($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val().replace(/,/g, "")) === "" ||
        parseFloat($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val().replace(/,/g, "")) <= 0) {
          ValidateField($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').attr("id"),"Please Enter Valid Call Strike",thisTileFXStrategies);
          return false;
     
        }

    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
      if ($.trim($(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val().replace(/,/g, "")) === "" ||
        parseFloat($(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val().replace(/,/g, "")) <= 0) {
          ValidateField($(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').attr("id"),"Please Enter Valid Put Strike",thisTileFXStrategies);
        return false;
      } else if ($.trim($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val().replace(/,/g, "")
        ) ==="" || parseFloat($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val().replace(/,/g, "")) <= 0
      ) {
        ValidateField($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').attr("id"),"Please Enter Valid Call Strike",thisTileFXStrategies);
        return false;
      }

     
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {

      if ($.trim($(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').val().replace(/,/g, "")) === "" ||
      parseFloat($(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').val().replace(/,/g, "")) <= 0) {
        
        ValidateField($(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').attr("id"),"Please Enter Valid Long Strike",thisTileFXStrategies);
        return false;
   
    } else if ($.trim($(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val().replace(/,/g, "")) == "" ||
      parseFloat($(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val().replace(/,/g, "")) <= 0) {
        ValidateField($(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').attr("id"),"Please Enter Valid Short Strike",thisTileFXStrategies);
        return false;
   
      }
    }

    // END


    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {

      productIDStrategies = productIDStraddle;
      productCodeStrategies = productCodeStraddle;
      TemplateCodeStrategies = TemplateCodeStraddle;
      TemplateIDStrategies = TemplateIDStraddle;
      ProductType_Strategies = ProductNameStraddle;
      LPListFXStrategies = LPListStraddle.split('|')[0]; // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      _minQuoteTimeStrategies = "7"; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
      _maxQuoteTimeStrategies = "20"; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023

    }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {

      productIDStrategies = productIDStrangle;
      productCodeStrategies = productCodeStrangle;
      TemplateCodeStrategies = TemplateCodeStrangle;
      TemplateIDStrategies = TemplateIDStrangle;
      ProductType_Strategies = ProductNameStrangle;
      LPListFXStrategies = LPListStrangle.split('|')[0]; // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      _minQuoteTimeStrategies = "7"; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
      _maxQuoteTimeStrategies = "20"; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023

    }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
    
      
      productIDStrategies = productIDRSKREV;
      productCodeStrategies = productCodeRSKREV;
      TemplateCodeStrategies = TemplateCodeRSKREV;
      TemplateIDStrategies = TemplateIDRSKREV;
      ProductType_Strategies = ProductNameRSKREV;
      LPListFXStrategies = LPListRSKREV.split('|')[0]; // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      _minQuoteTimeStrategies = "7"; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
      _maxQuoteTimeStrategies = "20"; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023

    }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {

      productIDStrategies = productIDOPSPRD;
      productCodeStrategies = productCodeOPSPRD;
      TemplateCodeStrategies = TemplateCodeOPSPRD;
      TemplateIDStrategies = TemplateIDOPSPRD;
      ProductType_Strategies = ProductNameOPSPRD;
      LPListFXStrategies = LPListOPSPRD.split('|')[0]; // SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      _minQuoteTimeStrategies = "7"; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
      _maxQuoteTimeStrategies = "20"; //FXD LGTGTWINT-1934 || ChaitanyaM || 22 May 2023

    }

    //RizwanS || Clear Timer || 14 Sep 2023
    if(isRFS){
      timeoutFXStrategies = parseInt(_minQuoteTimeStrategies) - 1 ;
      $(thisTileFXStrategies).find('[id^="hdntimerFX"]').val("");
      $(thisTileFXStrategies).find('[id^="hdntimerFX"]').val(timeoutFXStrategies);
    } 
    //END

    console.log("PricingFor ::", thisTileFXStrategies, productCodeStrategies); //Removed unwanted console log || RizwanS || 08 May 2023

    $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);


    let _premCcy = "";

    if($(thisTileFXStrategies).find('[id^="hdnisMetalFX"]').val() == "Y"){

      _premCcy =  $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[1].trim();
      
    }else{

      _premCcy =  $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[0].trim();

    }

    if( $(thisTileFXStrategies).find('[id^="CcySelectionFXStrategies"]').val() ==  $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[1].trim()){
      _AlternateCCy = $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[0].trim();
    }else{
      _AlternateCCy = $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[1].trim();

    }

    $(thisTileFXStrategies).find('[id^="loader_FXStrategies"]').show();
    $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true); // Disabling book trade button while pricing is happening - by Onkar E. 25/11/2019


    let _buysell = "";
    let _spotrate =""; // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024

    if ($(thisTileFXStrategies).find('[id^="strategiesBuySell"]').val().trim() == "Sell") {
      _buysell = "Sell";
      _spotrate = $(thisTileFXStrategies).find('[id^="rateFXStrategies"]').html().split("/")[0].replace(/,/g, "").trim(); // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
    }else{
      _buysell = "Buy";
      _spotrate = $(thisTileFXStrategies).find('[id^="rateFXStrategies"]').html().split("/")[1].replace(/,/g, "").trim(); // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
    }

     
    let spreadType = "";
    let LongStrike = "";
    let ShortStrike = "";
    let callStrike = "";
    let putStrike = "";
    let _strike = "";


    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {

      _strike = $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val().replace(/,/g, "");

    }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle" || $(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {

      if ($(thisTileFXStrategies).find('[id^="strategiesBuySell"]').val().trim() == "Sell") {
        _strike =  $(thisTileFXStrategies).find('[id^="rateFXStrategies"]').html().split("/")[1].replace(/,/g, "").trim()
      }else{
        _strike = $(thisTileFXStrategies).find('[id^="rateFXStrategies"]').html().split("/")[0].replace(/,/g, "").trim()
      }
      callStrike = $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val().replace(/,/g, "");
      putStrike = $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val().replace(/,/g, "");

    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {

      if ($(thisTileFXStrategies).find('[id^="strategiesBuySell"]').val().trim() == "Sell") {
        _strike =  $(thisTileFXStrategies).find('[id^="rateFXStrategies"]').html().split("/")[1].replace(/,/g, "").trim()
      }else{
        _strike = $(thisTileFXStrategies).find('[id^="rateFXStrategies"]').html().split("/")[0].replace(/,/g, "").trim()
      }
      
      spreadType = (($(thisTileFXStrategies).find('[id^="rbColCallPutToggle"]')[0]).checked ? "CALL" : "PUT");
      LongStrike = $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').val().replace(/,/g, "");
      ShortStrike =$(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val().replace(/,/g, "");

    }
    // Added by Chaitanya M | 25 July 2023

    // Start - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023 
    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
        
      var xmlstrStrategies =
        "<ExcelSheets><Sheet1>" +
        "<Product_Name>" + ProductType_Strategies + "</Product_Name>" +
        "<Hedging_x0020_Type>" + clientConfigdata.FXDCommonMethods.Hedging_Type + "</Hedging_x0020_Type>" +
        "<Spotrate>" + _spotrate + "</Spotrate>" + // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
        "<Notional>" + $(thisTileFXStrategies).find('[id^="ContractAmtFXStrategies"]').val().replace(/,/g, "").split(".")[0] +"</Notional>" +
        "<CustID>" + custID +"</CustID>" +
        "<Customer_Name>" + custName +"</Customer_Name>" +
        "<OptionCut>" + $(thisTileFXStrategies).find('[id^="Optioncutddl"]').val() +"</OptionCut>" +
        "<NonDeliveryYN>"+ $(thisTileFXStrategies).find('[id^="hdnNDFFlagFX"]').val() +"</NonDeliveryYN>" + //HSBCFXEINT-25 || RizwanS || 14 Dec 2023
        "<CcyPair>" + $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().trim() +"</CcyPair>" +
        "<AltCcy>" + _AlternateCCy +"</AltCcy>" +
        "<InvCcy>" + _premCcy +"</InvCcy>" +
        "<PremiumCcy>" + _premCcy +"</PremiumCcy>" +
        "<PremiumDate>" + $(thisTileFXStrategies).find('[id^="hdnFXStrategiesPremiumDate"]').val() +"</PremiumDate>" +
        "<BuySell>" + _buysell +"</BuySell>" +
        "<FixingDate>" + $(thisTileFXStrategies).find('[id^="hdnFXStrategiesExpiry"]').val() +"</FixingDate>" +
        "<TradeDate>" + TradeDateFXStrategies +"</TradeDate>" +
        "<SettDate>" + $(thisTileFXStrategies).find('[id^="hdnFXStrategiesDeliveryDate"]').val() +"</SettDate>" +
        "<Tenor>" + $(thisTileFXStrategies).find('[id^="tenorFXStrategies"]').val() +"</Tenor>" +
        "<TenorDays>" + $(thisTileFXStrategies).find('[id^="hdnTenorDaysStrategies"]').val() +"</TenorDays>" +
        "<Strike>" + _strike +"</Strike>" +
        "<Entity_ID>" + EntityID +"</Entity_ID>" +
        "<CAI_ID>" + clientConfigdata.FXDCommonMethods.CAI_ID +"</CAI_ID>" +
        "</Sheet1>" + "</ExcelSheets>";

    }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
        
      var xmlstrStrategies =
        "<ExcelSheets><Sheet1>" +
        "<Product_Name>" + ProductType_Strategies + "</Product_Name>" +
        "<Hedging_x0020_Type>" + clientConfigdata.FXDCommonMethods.Hedging_Type + "</Hedging_x0020_Type>" +
        "<Spotrate>" + _spotrate + "</Spotrate>" + // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
        "<Notional>" + $(thisTileFXStrategies).find('[id^="ContractAmtFXStrategies"]').val().replace(/,/g, "").split(".")[0] +"</Notional>" +
        "<CustID>" + custID +"</CustID>" +
        "<Customer_Name>" + custName +"</Customer_Name>" +
        "<OptionCut>" + $(thisTileFXStrategies).find('[id^="Optioncutddl"]').val() +"</OptionCut>" +
        "<NonDeliveryYN>"+ $(thisTileFXStrategies).find('[id^="hdnNDFFlagFX"]').val() +"</NonDeliveryYN>" + //HSBCFXEINT-25 || RizwanS || 14 Dec 2023
        "<CcyPair>" + $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().trim() +"</CcyPair>" +
        "<AltCcy>" + _AlternateCCy +"</AltCcy>" +
        "<InvCcy>" + _premCcy +"</InvCcy>" +
        "<PremiumCcy>" + _premCcy +"</PremiumCcy>" +
        "<PremiumDate>" + $(thisTileFXStrategies).find('[id^="hdnFXStrategiesPremiumDate"]').val() +"</PremiumDate>" +
        "<BuySell>" + _buysell +"</BuySell>" +
        "<FixingDate>" + $(thisTileFXStrategies).find('[id^="hdnFXStrategiesExpiry"]').val() +"</FixingDate>" +
        "<TradeDate>" + TradeDateFXStrategies +"</TradeDate>" +
        "<SettDate>" + $(thisTileFXStrategies).find('[id^="hdnFXStrategiesDeliveryDate"]').val() +"</SettDate>" +
        "<Tenor>" + $(thisTileFXStrategies).find('[id^="tenorFXStrategies"]').val() +"</Tenor>" +
        "<TenorDays>" + $(thisTileFXStrategies).find('[id^="hdnTenorDaysStrategies"]').val() +"</TenorDays>" +
        "<CallStrike>" + callStrike +"</CallStrike>" +
        "<PutStrike>" + putStrike +"</PutStrike>" +
        "<Entity_ID>" + EntityID +"</Entity_ID>" +
        "<CAI_ID>" + clientConfigdata.FXDCommonMethods.CAI_ID +"</CAI_ID>" +
        "</Sheet1>" + "</ExcelSheets>";

    }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
        
      var xmlstrStrategies =          
        "<ExcelSheets><Sheet1>" +
        "<Product_Name>" + ProductType_Strategies + "</Product_Name>" +
        "<Hedging_x0020_Type>" + clientConfigdata.FXDCommonMethods.Hedging_Type + "</Hedging_x0020_Type>" +
        "<Spotrate>" + _spotrate + "</Spotrate>" + // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
        "<Notional>" + $(thisTileFXStrategies).find('[id^="ContractAmtFXStrategies"]').val().replace(/,/g, "").split(".")[0] +"</Notional>" +
        "<LeverageFactor>" + $(thisTileFXStrategies).find('[id^="LevergeFXStrategies"]').val() + "</LeverageFactor>" + // HSBCFXEINT-36 || RizwanS || 12 Dec 2023
        "<CustID>" + custID +"</CustID>" +
        "<Customer_Name>" + custName +"</Customer_Name>" +
        "<OptionCut>" + $(thisTileFXStrategies).find('[id^="Optioncutddl"]').val() +"</OptionCut>" +
        "<NonDeliveryYN>"+ $(thisTileFXStrategies).find('[id^="hdnNDFFlagFX"]').val() +"</NonDeliveryYN>" + //HSBCFXEINT-25 || RizwanS || 14 Dec 2023
        "<CcyPair>" + $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().trim() +"</CcyPair>" +
        "<AltCcy>" + _AlternateCCy +"</AltCcy>" +
        "<InvCcy>" + _premCcy +"</InvCcy>" +
        "<PremiumCcy>" + _premCcy +"</PremiumCcy>" +
        "<PremiumDate>" + $(thisTileFXStrategies).find('[id^="hdnFXStrategiesPremiumDate"]').val() +"</PremiumDate>" +
        "<BuySell>" + _buysell +"</BuySell>" +
        "<FixingDate>" + $(thisTileFXStrategies).find('[id^="hdnFXStrategiesExpiry"]').val() +"</FixingDate>" +
        "<TradeDate>" + TradeDateFXStrategies +"</TradeDate>" +
        "<SettDate>" + $(thisTileFXStrategies).find('[id^="hdnFXStrategiesDeliveryDate"]').val() +"</SettDate>" +
        "<Tenor>" + $(thisTileFXStrategies).find('[id^="tenorFXStrategies"]').val() +"</Tenor>" +
        "<TenorDays>" + $(thisTileFXStrategies).find('[id^="hdnTenorDaysStrategies"]').val() +"</TenorDays>" +
        "<CallStrike>" + callStrike +"</CallStrike>" +
        "<PutStrike>" + putStrike +"</PutStrike>" +
        "<Entity_ID>" + EntityID +"</Entity_ID>" +
        "<CAI_ID>" + clientConfigdata.FXDCommonMethods.CAI_ID +"</CAI_ID>" +
        "</Sheet1>" + "</ExcelSheets>";

    }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {
        
      var xmlstrStrategies =
        "<ExcelSheets><Sheet1>" +
        "<Product_Name>" + ProductType_Strategies + "</Product_Name>" +
        "<Hedging_x0020_Type>" + clientConfigdata.FXDCommonMethods.Hedging_Type + "</Hedging_x0020_Type>" +
        "<Spotrate>" +_spotrate + "</Spotrate>" + // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
        "<LongNotional>" + $(thisTileFXStrategies).find('[id^="ContractAmtFXStrategies"]').val().replace(/,/g, "").split(".")[0] +"</LongNotional>" +
        "<CustID>" + custID +"</CustID>" +
        "<Customer_Name>" + custName +"</Customer_Name>" +
        "<OptionCut>" + $(thisTileFXStrategies).find('[id^="Optioncutddl"]').val() +"</OptionCut>" +
        "<NonDeliveryYN>"+ $(thisTileFXStrategies).find('[id^="hdnNDFFlagFX"]').val() +"</NonDeliveryYN>" + //HSBCFXEINT-25 || RizwanS || 14 Dec 2023
        "<CcyPair>" + $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().trim() +"</CcyPair>" +
        "<AltCcy>" + _AlternateCCy +"</AltCcy>" +
        "<InvCcy>" + _premCcy +"</InvCcy>" +
        "<PremiumCcy>" + _premCcy +"</PremiumCcy>" +
        "<TradeDate>" + TradeDateFXStrategies +"</TradeDate>" +
        "<PremiumDate>" + $(thisTileFXStrategies).find('[id^="hdnFXStrategiesPremiumDate"]').val() +"</PremiumDate>" +
        "<BuySell>" + _buysell +"</BuySell>" +
        "<FixingDate>" + $(thisTileFXStrategies).find('[id^="hdnFXStrategiesExpiry"]').val() +"</FixingDate>" +
        
        "<SettDate>" + $(thisTileFXStrategies).find('[id^="hdnFXStrategiesDeliveryDate"]').val() +"</SettDate>" +
        "<Tenor>" + $(thisTileFXStrategies).find('[id^="tenorFXStrategies"]').val() +"</Tenor>" +
        "<TenorDays>" + $(thisTileFXStrategies).find('[id^="hdnTenorDaysStrategies"]').val() +"</TenorDays>" +
        "<ShortStrike>" + ShortStrike + "</ShortStrike>" +
        "<LongStrike>" + LongStrike + "</LongStrike>" +
        "<SpreaType>" + spreadType + "</SpreaType>" +
        "<Entity_ID>" + EntityID +"</Entity_ID>" +
        "<CAI_ID>" + clientConfigdata.FXDCommonMethods.CAI_ID +"</CAI_ID>" +
        "</Sheet1>" + "</ExcelSheets>";

    }
    // End - LGTGTWINT-2451 | Chaitanya M | 29 Nov 2023 



    if (Scheduleflag) {
      GetRulescheduleFXD(TileId,xmlstrStrategies,TemplateIDStrategies,TemplateIDStrategies);
    } else {
      USERID_FXStrategies = "MGU_" + sessionStorage.getItem("Username");
      $(thisTileFXStrategies).find('[id^="hdnUserIDFXStrategies"]').val(USERID_FXStrategies);

      
      mapleLoaderStart(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      if( $(thisTileFXStrategies).find('[id^="CcySelectionFXStrategies"]').val() ==  $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[1].trim()){
        _AlternateCCy = $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[0].trim();
      }else{
        _AlternateCCy = $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[1].trim();

      }

      request_getDataFromAPI(
        {
            "ProductType": productCodeStrategies,
            "CurrencyPair": $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().trim(),
            "DepositCurrency": $(thisTileFXStrategies).find('[id^="CcySelectionFXStrategies"]').val(),
            "PremCurrency": _premCcy,
            "AlternateCurrency": _AlternateCCy,
            "SettlementCcy": _premCcy,
            "AmountInDepositCurrency": $(thisTileFXStrategies).find('[id^="ContractAmtFXStrategies"]').val().replace(/,/g, "").split(".")[0],
            "SolveFor": "PREMIUM",
            "BuySell": _buysell,
            "CallPut": spreadType,
            "Strike": _strike,
            "LowerBarrier": "0",
            "UpperBarrier": "0",
            "BarrierType": "",
            "KnockIn_Style": "",
            "KnockOut_Style": "",
            "OptionCut":  $(thisTileFXStrategies).find('[id^="Optioncutddl"]').val(),
            "MarketPremium": "0",
            "MarketPremiumAmount": "0",
            "RMMarginPercentage": $(thisTileFXStrategies).find('[id^="UpfrontFXStrategies"]').val(),
            "Tenor": $(thisTileFXStrategies).find('[id^="tenorFXStrategies"]').val(),
            "TradeDate": setBusinessDate,
            "ValueDate":  $(thisTileFXStrategies).find('[id^="hdnFXStrategiesPremiumDate"]').val(),
            "FixingDate": $(thisTileFXStrategies).find('[id^="hdnFXStrategiesExpiry"]').val(),
            "MaturityDate": $(thisTileFXStrategies).find('[id^="hdnFXStrategiesDeliveryDate"]').val(),
            "NDFFlag": $(thisTileFXStrategies).find('[id^="hdnNDFFlagFX"]').val(),
            "IsMetal": $(thisTileFXStrategies).find('[id^="hdnisMetalFX"]').val(),
            "UserID": userName,
            "EntityId": EntityID,
            "IndicativeQuote": "",
            "Deal_Rate2": "",
            "NoteMasterID": "0",
            "blnIsMultiLeg": true,
            "InternalLPID": "",
            "NotionalInPremCcy": "0",
            "PriceProviderDetails": LPListFXStrategies,
            "CIF_Code": "",
            "BTB_Protfolio_Code": "",
            "Marketer_Code": "",
            "Strategy_Code": "",
            "ExternalXMLString": xmlstrStrategies,
            "UseExternalXML_Source": true,
            "TemplateCode": TemplateCodeStrategies,
            "TemplateID": TemplateIDStrategies,
            "ProductID": productIDStrategies,
            "RFQSource": "Instant_Pricer",
            "requestID": userName + '_' + 'GetFXOPriceFromExternalProvidersJSON'  +'_' + RequestIDGenerator(8),
            "Mode": "FXOSEN",
            "DI_YN": "N",
            "KIType": "",
            "Remark": "",
            "CapLoss": "",
            "DCDRFQID": "",
            "GroupKey": "",
            "Frequency": "",
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
            "CurrentTileID": TileId +  "|" + $(thisTileFXStrategies).find('[id^="hdnRequestID"]').val(),
        },
        clientConfigdata.CommonMethods.NodeServer + "fxobestprice/GetFXOPriceFromExternalProvidersJSON","","POST",TileId +"|" + userName + '_' + 'GetFXOPriceFromExternalProvidersJSON'  +'_' + RequestIDGenerator(8)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        .then((data) => {
          
          thisTileFXStrategies = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

          let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
          
          if($(thisTileFXStrategies).find('[id^="hdnRequestID"]').val() != data.CurrentTileID.split("|")[1] || $(thisTileFXStrategies).find('[id^="hdnRequestID"]').val() === ''){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

            return false;
  
          } //END
          
        //LGTGTWINT-2128 || RizwanS || 09 Jun 2023
        // let responseHeader = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.Status;

        let currentTile = TileId;

        let responseHeader = "";
        if(data.dataFromAjax === "" || data.dataFromAjax === undefined || data.dataFromAjax === null){
          responseHeader = "FAIL";
        }else{
          responseHeader = "SUCCESS";
        }

        let _dcdRFQID = "";
        if (responseHeader.toUpperCase() === "SUCCESS") {
          const o_DCDRFQID = data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID;
          if (o_DCDRFQID && o_DCDRFQID !== null && o_DCDRFQID !== undefined) {
            _dcdRFQID = o_DCDRFQID;
          }
        }   
        //END

        // LGTGTWINT-1934 FXD | Dynamic pricing on Instant pricer || RizwanS || 20 May 2023
          
        if(isRFS){

          if(data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.Status.toUpperCase() == "SUCCESS"){  // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 
          
          let _priceObj = data.dataFromAjax.oPriceResponseBody;

          //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
          $(thisTileFXStrategies).find('[id^="RFQIDFXD"]').html("");
          $(thisTileFXStrategies).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);  //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
          //End

          $(thisTileFXStrategies).find('[id^="hdnRFSID"]').val(data._requestID);

            if (_priceObj.length > 0) {

              $(thisTileFXStrategies).find('[id^="hdnNMID"]').val(_priceObj[0].NoteMasterID); 
              $(thisTileFXStrategies).find('[id^="hdno_DCDRFQID"]').val(_priceObj[0].o_DCDRFQID);

              let quoteString = "";
              for (i = 0;i < _priceObj.length;i++) {
                let quoteId = _priceObj[i].quoteId;
                quoteString += quoteString.length == 0 ? quoteId : "," + quoteId;
              }
              
              dictFXD[data.currentTile] = quoteString; //To add element in dictionary
              $(thisTileFXStrategies).find('[id^="hdnPricesFXObj"]').val(JSON.stringify(data));
              $(thisTileFXStrategies).find('[id^="hdnQuoteString"]').val(quoteString);                                
              callHub(quoteString, _maxQuoteTimeStrategies);       
              setminimumtimoutFXStrategies(_minQuoteTimeStrategies,thisTileFXStrategies,$(thisTileFXStrategies).find('[id^="hdnRFSMinTimer"]')[0], data._requestID);       //  LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023                       
              startRFSTimerFXStrategies(thisTileFXStrategies, $(thisTileFXStrategies).find('[id^="hdntimerInterval"]')[0], data._requestID); 

             return false;            
            }

          }else{

          //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
          if(_dcdRFQID !== ""){
            $(thisTileFXStrategies).find('[id^="RFQIDFXD"]').html("");
            $(thisTileFXStrategies).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
          }
          //End

            MapPricesFXStrategies(data,thisTileFXStrategies,false);  // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 
          }

        }else{

        //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
        if(_dcdRFQID !== ""){
          $(thisTileFXStrategies).find('[id^="RFQIDFXD"]').html("");
          $(thisTileFXStrategies).find('[id^="RFQIDFXD"]').html("RFQ ID : " + _dcdRFQID);
        }
        //End      
        
          MapPricesFXStrategies(data,thisTileFXStrategies,false); // LGTGTWINT-1934 || RizwanS || 02 May 2023 
        }//END

      });
    }

  } catch (error) {
   console.log(error.message);
  }
}


//FXD | Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || RizwanS || 02 May 2023
function MapPricesFXStrategies(data,thisTileFXStrategies,isRFS){
  try{

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
          
    if(responseHeader.toUpperCase() == "SUCCESS"){


    $(thisTileFXStrategies).find('[id^="FXStrategies_BankNameRow"]').empty();
    $(thisTileFXStrategies).find('[id^="FXStrategies_PriceRow"]').empty();
    $(thisTileFXStrategies).find('[id^="FXStrategies_TimerRow"]').empty();
    
    // Storing price object in hidden field of current tile
    let FXStrategiesPriceData =data.dataFromAjax.oPriceResponseBody; //LGTGTWINT-1934  || RizwanS || 01 Jun 2023
    $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val(JSON.stringify(FXStrategiesPriceData));
    $(thisTileFXStrategies).find('[id^="RFQFXStrategies"]').val(JSON.stringify(FXStrategiesPriceData)); // Added for LGTGTWINT-1462 'Mail All' functionality | Chaitanya M | 23 Feb 2023
    
    if (JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[0].provider == null ||
      JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[0].NoteMasterID == null ||
      JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[0].bestPriceProvider == "FAIL"
    ) {
      $(thisTileFXStrategies).find('[id^="FXStrategies_BankNameRow"]').append("<td> - </td>");
      $(thisTileFXStrategies).find('[id^="FXStrategies_PriceRow"]').append("<td> - </td>");
      // Added by Atharva - Timers - START
      $(thisTileFXStrategies).find('[id^="FXStrategies_TimerRow"]').append("<td> - </td>");
      // END

      // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      if(isRFS != true){
        $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", false);
        $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", false);
      }
      //End
    }else{
      var BestPP = JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[0].bestPriceProvider.split(":")[0];
      DCDRFQidFXStrategies = JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[0].o_DCDRFQID;
      bestProviderFXStrategies = JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[0].bestPriceProvider.split(":")[0];
      outJson = JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val());

      // Passing extra parameter to plotprice
      quoteidFXStrategies = PlotPrice(JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val()),
        JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[0].bestPriceProvider.split(":")[0],
        "#" + $(thisTileFXStrategies).find('[id^="FXStrategies_BankNameRow"]').attr("id"),
        "#" + $(thisTileFXStrategies).find('[id^="FXStrategies_PriceRow"]').attr("id"),
        thisTileFXStrategies,""
      ); //Added for Solve for check | Chaitanya M | 02 Aug 2023
      $(thisTileFXStrategies).find('[id^="hdnQuoteIDFXStrategies"]').val(quoteidFXStrategies);


      // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
      // ----------------------------------Start-------------------------------
      
      let AskspotFXStrategies = $(thisTileFXStrategies).find('[id^="rateFXStrategies"]').html().split("/")[1].replace(/,/g, "").trim();
      let BidSpotFXStrategies = $(thisTileFXStrategies).find('[id^="rateFXStrategies"]').html().split("/")[0].replace(/,/g, "").trim();
      
      if($(thisTileFXStrategies).find('[id^="strategiesBuySell"]').val().trim().toUpperCase() === "BUY"){

        AskspotFXStrategies = numberWithCommas(Number($(thisTileFXStrategies).find('[id^="hdnSpotRateFX"]').val()));

        $(thisTileFXStrategies).find('[id^="rateFXStrategies"]').html(BidSpotFXStrategies + " / " + AskspotFXStrategies);


      }else{
        
        BidSpotFXStrategies = numberWithCommas(Number($(thisTileFXStrategies).find('[id^="hdnSpotRateFX"]').val()));

        $(thisTileFXStrategies).find('[id^="rateFXStrategies"]').html(BidSpotFXStrategies + " / " + AskspotFXStrategies);

      }

      // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
      // ----------------------------------End---------------------------------


      if (
        BestPP != "FAIL" &&
        BestPP !== undefined &&
        BestPP != "" &&
        BestPP != null
      ) {
        startTimers(data.CurrentTileID.split("|")[0]);
      }
    
    }
    if (
      JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val()) != null ||
      JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val()) !=undefined ||
      JSON.parse(
        $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val()
      ).bestPriceProvider.split(":")[0] != "FAIL"
    ) {
      drawgraphFXStrategies($(thisTileFXStrategies).find('[id^="canvas"]').attr("id"));
    }

    mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023

    // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
    if(isRFS != true){
      $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", false);
      $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
      $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", false);
    }
    //End


    }  else if(data.dataFromAjax == null){

      // if(data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != null || 
      //   data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != ""){
      
      //   _failedreason = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason;
      //   ValidateField($(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr('id'), _failedreason, thisTileFXStrategies); 
      
      // }else{
      
      //   _failedreason = "Pricing Failed!";
      //   ValidateField($(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr('id'), _failedreason, thisTileFXStrategies); 
      
      // }

      _failedreason = "Pricing Failed!";
      ValidateField($(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr('id'), _failedreason, thisTileFXStrategies);

      $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true);
      $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);

    
    }
    //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023
    else if(data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider == null || 
      data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider == ""){

      if(data.dataFromAjax.oPriceResponseBody[0].errorMessage == null ||
        data.dataFromAjax.oPriceResponseBody[0].errorMessage == ''){
      //End
        // if(data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != null || 
        //   data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != ""){
        
        //   _failedreason = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason;
        //   ValidateField($(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr('id'), _failedreason, thisTileFXStrategies); 
        
        // }else{
        
        //   _failedreason = "Pricing Failed!";
        //   ValidateField($(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr('id'), _failedreason, thisTileFXStrategies); 
        
        // }
        _failedreason = "Pricing Failed!";
        ValidateField($(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr('id'), _failedreason, thisTileFXStrategies); 
      
      }else{
        failReason = data.dataFromAjax.oPriceResponseBody[0].errorMessage;
        if(failReason.includes("Aborting further Migration")){

          _failedreason = failReason.replace(". Aborting further Migration for this record.","");  
          ValidateField($(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr('id'), _failedreason, thisTileFXStrategies); 

        } else{

          _failedreason = failReason;
          ValidateField($(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr('id'), _failedreason, thisTileFXStrategies); 

        }
      }   
      // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
      //LGTGTWINT-1740 | Chaitanya M | 05 June 2023
      $(thisTileFXStrategies).find('[id^="RFQIDFXD"]').html("");
      $(thisTileFXStrategies).find('[id^="RFQIDFXD"]').html("RFQ ID : " + data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID); //LGTGTWINT-1740 | Chaitanya M | 05 June 2023
      //End
      //End
      
      // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      if(isRFS != true){
        $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", false);
        $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
        $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", false);
      }
      //End       

    }
    //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 
    else if(data.dataFromAjax.oPriceResponseBody[0].bestPriceProvider.includes("FAIL")) {

      // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
      // if(data.dataFromAjax.oPriceResponseBody[0].errorMessage == null || 
      //   data.dataFromAjax.oPriceResponseBody[0].errorMessage == ''){
      
          $(thisTileFXStrategies).find('[id^="FXStrategies_BankNameRow"]').append("<td> - </td>");
          $(thisTileFXStrategies).find('[id^="FXStrategies_PriceRow"]').append("<td> - </td>");
          $(thisTileFXStrategies).find('[id^="FXStrategies_TimerRow"]').append("<td> - </td>");

        // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
        ValidateField($(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr("id"),"No response received from remote system.",thisTileFXStrategies);

        //LGTGTWINT-1740 | Chaitanya M | 05 June 2023

        //$(thisTileFXStrategies).find('[id^="FXDRfqidpnl"]').show();
        $(thisTileFXStrategies).find('[id^="RFQIDFXD"]').html("");
        $(thisTileFXStrategies).find('[id^="RFQIDFXD"]').html("RFQ ID : " + data.dataFromAjax.oPriceResponseBody[0].o_DCDRFQID); 
        //End
        
        //End

        // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
        if(isRFS != true){
          $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", false);
          $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
          $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", false);
        }
        //End
      
    }

    mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    $(thisTileFXStrategies).find('[id*="btnBestPriceFXStrategies"]').attr("disabled", false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023    
    
    // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023  
    //Start
    if(MinQuoteTimeOutOccurredFXStrategies == true){
      
      UnsubcribeRFQID(thisTileFXStrategies);
     
      mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);
      MinQuoteTimeOutOccurredFXStrategies = false;
      $(thisTileFXStrategies).find('[id^="hdnsignalRMsgRecv"]').val("NO");
      $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", false);
      $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
      $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", false);  
    }
    //End
  } catch (error) {
    $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true);
    $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);
    console.log(error.message);
    $(".lblError").html(error.message);
  } finally {
  }
}//END



//RizwanS || RFS Timer Changes Start || 14 Sep 2023

function startRFSTimerFXStrategies(thisTileFXStrategies, uniqueTimeoutID, _requestID){
  try {
         
    uniqueTimeoutID.value = setInterval(function() {

      if($(thisTileFXStrategies).find('[id^="hdnRequestID"]').val() != _requestID || $(thisTileFXStrategies).find('[id^="hdnRequestID"]').val()===""){ 
        return false;
      }

      showtimerYNFXStrategies="Y";        
        
      if(Number($(thisTileFXStrategies).find('[id^="hdntimerFX"]').val())>=0) {  

        if($(thisTileFXStrategies).find('[id^="hdnPrices"]').val() === "" || $(thisTileFXStrategies).find('[id^="hdnPrices"]').val() === null || $(thisTileFXStrategies).find('[id^="hdnPrices"]').val() === undefined ){
          $(thisTileFXStrategies).find('[id^="TimerDiv"]').removeClass("Showtimer");      
          $(thisTileFXStrategies).find('[id^="hdntimerFX"]').val(Number($(thisTileFXStrategies).find('[id^="hdntimerFX"]').val()) - 1) ;
      
        }else{

          $(thisTileFXStrategies).find('[id^="btnemailquote"]').attr("disabled", true);
          $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true);
          $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);  

          $(thisTileFXStrategies).find('[id^="TimerDiv"]').addClass("Showtimer");        
          $(thisTileFXStrategies).find('[id^="SignalRTimer"]').attr('title', 'You can place order after '+ Number($(thisTileFXStrategies).find('[id^="hdntimerFX"]').val())+ ' seconds.');               
          $(thisTileFXStrategies).find('[id^="SignalRTimer"]').html(Number($(thisTileFXStrategies).find('[id^="hdntimerFX"]').val()));
          $(thisTileFXStrategies).find('[id^="hdntimerFX"]').val(Number($(thisTileFXStrategies).find('[id^="hdntimerFX"]').val()) - 1) ;
          
        }

      }else{

        $(thisTileFXStrategies).find('[id^="TimerDiv"]').removeClass("Showtimer");                      
        $(thisTileFXStrategies).find('[id^="SignalRTimer"]').html(''); 
        $(thisTileFXStrategies).find('[id^="btnemailquote"]').attr("disabled", false);
        $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", false);
        $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", false);    
    
        
        clearInterval(uniqueTimeoutID.value);
        uniqueTimeoutID.value ="";

      }    

    },1000); 
 
  } catch (error) {
    
  }
}

function setminimumtimoutFXStrategies(_minQuoteTimeStrategies, thisTileFXStrategies, _uniqueMinTimerid,_requestID){
  try {

    if($(thisTileFXStrategies).find('[id^="hdnRequestID"]').val() != _requestID || $(thisTileFXStrategies).find('[id^="hdnRequestID"]').val() === ""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      return false;
    } 
   _uniqueMinTimerid.value = setTimeout(minQuoteTimeOccurredFXStrategies,parseInt(_minQuoteTimeStrategies) * 1000,thisTileFXStrategies,$(thisTileFXStrategies).find('[id^="hdnRFSMinTimer"]')[0],_requestID); // LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
  } catch (error) {
    console.log(error.message); 
  }
}

function closetimerFXStrategies(intervalid){
  try {
    
    clearTimeout(intervalid.value);
    showtimerYNFXStrategies="N";

  } catch (error) {
    console.log(error.message);
  }
}

function minQuoteTimeOccurredFXStrategies(thistile,_uniqueMinTimerid, _requestID){
  try{

    MinQuoteTimeOutOccurredFXStrategies = true;

    if($(thistile).find('[id^="hdnRequestID"]').val() != _requestID || $(thistile).find('[id^="hdnRequestID"]').val()===""){ 

      return false;

    }     

    if($(thistile).find('[id^="hdnsignalRMsgRecv"]').val().toUpperCase() === "YES"){ 
    
      mapleLoaderStop(thistile,'[id^="btnBestPriceFXStrategies"]',false);
      $(thistile).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", false);
      $(thistile).find('[id^="btnemailquote"]').attr("disabled", false);
      $(thistile).find('[id^="BookTradeFXStrategies"]').attr("disabled", false);
      $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", false);  
      $(thistile).find('[id^="hdnsignalRMsgRecv"]').val("NO");
      
      MinQuoteTimeOutOccurredFXStrategies = false;
      UnsubcribeRFQID(thistile);
      clearInterval(_uniqueMinTimerid.value);_minQuoteTimeStrategies
      _uniqueMinTimerid.value ="";


    }else{
      
      clearInterval(_uniqueMinTimerid.value);
      _uniqueMinTimerid.value ="";
      maxQuoteTimeOutRFSFXStrategies(thistile, $(thistile).find('[id^="hdnRFSMaxTimer"]')[0],_requestID); // LGTGTWINT-2110 | Chaitanya M | 13 July 2023

    }

  }catch(error){
    console.log(error.message); 
  }
}

function maxQuoteTimeOutRFSFXStrategies(thistile, _uniqueMaxTimerid,_requestID){
  try{
     
    MaxQuoteTimeOut = parseInt(_maxQuoteTimeStrategies) - parseInt(_minQuoteTimeStrategies);

    if($(thistile).find('[id^="hdnRequestID"]').val() != _requestID || $(thistile).find('[id^="hdnRequestID"]').val()===""){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',false);
      return false;

    } 

    _uniqueMaxTimerid.value = setTimeout(() =>{  // LGTGTWINT-2110 | Chaitanya M | 13 July 2023    

      maxQuoteTimeOccurredAQ = true;
     // LGTGTWINT-1934 || ChaitanyaM || 03 Jun 2023  
      if($(thistile).find('[id^="hdnsignalRMsgRecv"]').val().toUpperCase() === "YES"){
        UnsubcribeRFQID(thistile);
        clearTimeout(_uniqueMaxTimerid.value);
        _uniqueMaxTimerid.value="";
        closetimerFXStrategies(_uniqueMaxTimerid); // LGTGTWINT-2110 | Chaitanya M | 13 July 2023 
        $(thistile).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", false);
        $(thistile).find('[id^="btnemailquote"]').attr("disabled", false);
        $(thistile).find('[id^="BookTradeFXStrategies"]').attr("disabled", false);
        $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", false); 
        mapleLoaderStop(thistile,'[id^="btnBestPriceFXStrategies"]',false);
        $(thistile).find('[id^="hdnsignalRMsgRecv"]').val("NO");


      }else if($(thistile).find('[id^="hdnsignalRMsgRecv"]').val() == ""){
        
        if($(thistile).find('[id^="hdnQuoteString"]').val() !== ""){ // LGTGTWINT-1934 || RizwanS || 05 Jun 2023 

          UnsubcribeRFQID(thistile);
          // Start- LGTGTWINT-2110 | Chaitanya M | 13 July 2023 
          clearTimeout(_uniqueMaxTimerid.value);
          _uniqueMaxTimerid.value="";
          closetimerFXAQ(_uniqueMaxTimerid);
          // End- LGTGTWINT-2110 | Chaitanya M | 13 July 2023
          $(thistile).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", false);
          $(thistile).find('[id^="btnemailquote"]').attr("disabled", true);
          $(thistile).find('[id^="BookTradeFXStrategies"]').attr("disabled", true);
          $(thistile).find('[id^="btnSaveTradeFX"]').attr("disabled", true); 
 
          mapleLoaderStop(thistile,'[id^="btnBestPriceFXStrategies"]',false);

          if($(thistile).find('[id^="hdnRequestID"]').val() === _requestID){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
            
            ValidateField($(thistile).find('[id^="btnBestPriceFXStrategies"]').attr("id"),"No response received from remote system.",thistile);
          
          }

        }

      }
      //End

    },MaxQuoteTimeOut * 1000);

  } catch(error){
    console.log(error.message);
  }
}

//END

//To Get BidAsk Rate and Currency Pair
function getCurrencyFXStrategiesRate(currId, iscloned) {
  try {
    thisTileFXStrategies = document.getElementById("td" + currId);
    // Addded for CFINT-992 // 18-Sep-2020 //

    checkmetalccyflagFXStrategies(currId,$(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val())

    $(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", true);

    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
      productIDStrategies = productIDStraddle;
      productCodeStrategies = productCodeStraddle;
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
      productIDStrategies = productIDStrangle;
      productCodeStrategies = productCodeStrangle;
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
      productIDStrategies = productIDRSKREV;
      productCodeStrategies = productCodeRSKREV;
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {
      productIDStrategies = productIDOPSPRD;
      productCodeStrategies = productCodeOPSPRD;
    }
    
    $(thisTileFXStrategies).find('[id^="hdnCcyDetailsFXStrategies"]').val($(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val()); // Select Ccy Should Auto Populate Spot & Strike| Chaitanya M | 02 Dec 2023

    //END
    request_getDataFromAPI(
      {
      
        "StandardPair":  $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]')[0].value,
        "EntityID": EntityID,
        "UserID": userName,
        "ProductCode": productCodeStrategies,
        "Mode" : "SEN",
        "CurrentTileID":currId + "|" + "",
        
      },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/BidAskRate","","POST",currId +"|" + userName + '_' + 'GetFXRatesByCurrencyNode'  +'_' + RequestIDGenerator(8)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        thisTileFXStrategies = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        // let responseHeader = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.Status;

        let responseHeader = "";
        if(data === "" || data === undefined || data === null){
          responseHeader = "FAIL";
        }else{
          responseHeader = "SUCCESS";
        }

        if(responseHeader.toUpperCase() == "SUCCESS"){
       
        AskRateFXO = numberWithCommas(Number(data.dataFromAjax.AskRate).toFixed(data.dataFromAjax.DecimalRate));

        BidRateFXO = numberWithCommas(Number(data.dataFromAjax.BidRate).toFixed(data.dataFromAjax.DecimalRate));

        $(thisTileFXStrategies).find('[id^="hdnDecimalRateFXStrategies"]').val(data.dataFromAjax.DecimalRate);


        //Added by RizwanS || LGTGTWINT-2322 || 22 Aug 2023
        if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Straddle"){
          if(MaxQuoteTimeOutSTRADDLE === "" || MinQuoteTimeOutSTRADDLE === ""){
            getProductConfigsFXD(productIDStraddle,productCodeStraddle);
          }
          if(LPListStraddle === ""){
            LPListStraddle = getasyncFXDLP(productIDStraddle, productCodeStraddle);
          }
        }

        if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Strangle"){
          if(MaxQuoteTimeOutSTRANGLE === "" || MinQuoteTimeOutSTRANGLE === ""){
            getProductConfigsFXD(productIDStrangle, productCodeStrangle); 
          }
          if(LPListStrangle === ""){
            LPListStrangle = getasyncFXDLP(productIDStrangle, productCodeStrangle);
          }
        }

        if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Risk Reversal"){
          if(MaxQuoteTimeOutRSKREV === "" || MinQuoteTimeOutRSKREV === ""){
            getProductConfigsFXD(productIDRSKREV, productCodeRSKREV); //Added By RizwanS || LGTGTWINT-1934 || FXD | Dynamic pricing on Instant pricer || 28 Apr 2023
          }
          if(LPListRSKREV === ""){
            LPListRSKREV = getasyncFXDLP(productIDRSKREV, productCodeRSKREV);
          }
        }

        if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Option Spread"){
          if(MaxQuoteTimeOutOPSPRD === "" || MinQuoteTimeOutOPSPRD === ""){
            getProductConfigsFXD(productIDOPSPRD,productCodeOPSPRD); //Added By RizwanS || LGTGTWINT-1934 || FXD | Dynamic pricing on Instant pricer || 28 Apr 2023
          }
          if(LPListOPSPRD === ""){
            LPListOPSPRD = getasyncFXDLP(productIDOPSPRD, productCodeOPSPRD);
          }
        }
        //END


        document.getElementById($(thisTileFXStrategies).find('[id^="rateFXStrategies"]').attr("id")).innerText = BidRateFXO + " / " + AskRateFXO;
   
        // Start - Clone Tile issue | Chaitanya M | 04 Dec 2023
        if ($(thisTileFXStrategies).find('[id^="strategiesBuySell"]').val().trim() === "Sell") {
          if(iscloned !== true) {
            if(_addtileflag === true ){ 
              
              if ( $(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Strangle" || $(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Risk Reversal") {
    
                $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(AskRateFXO);
                $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]')[0].value = numberWithCommas((BidRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
              
              } else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Option Spread") {
                
                $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val(AskRateFXO);
                $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]')[0].value = numberWithCommas((BidRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
    
              }else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Straddle"){
                
                $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val(BidRateFXO);
             
              }
              _addtileflag = false;

            }else if(_defaultflagGXStrategies === true) { 
              
              if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Strangle" || $(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Risk Reversal") {
    
                $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(AskRateFXO);
                $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]')[0].value = numberWithCommas((BidRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
              
              } else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Option Spread") {
                
                $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val(AskRateFXO);
                $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]')[0].value = numberWithCommas((BidRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
    
              }else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Straddle"){
                
                $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val(BidRateFXO);

              }
              _defaultflagGXStrategies = false;

            }else if(!_UpdateFlagFXStrategies){
              
              if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Strangle" || $(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Risk Reversal") {
                
                if($(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(AskRateFXO);                
                }  

                if($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]')[0].value = numberWithCommas((BidRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
                }

              } else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Option Spread") {
               
                if($(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val(AskRateFXO);    
                }

                if($(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]')[0].value = numberWithCommas((BidRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
                }

              }else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Straddle"){
                
                if($(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val(BidRateFXO);
                }
                
              }
      
              _UpdateFlagFXStrategies=false;

            }else if(_UpdateFlagFXStrategies ){

              if(_eventstrikechangeFXStrategies === true){
               
                _eventstrikechangeFXStrategies = false;
              
              }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Strangle" ||$(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Risk Reversal") {
               
                if($(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(AskRateFXO);                
                }  
                
                if($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]')[0].value = numberWithCommas((BidRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
                }

              } else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Option Spread") {
               
                if($(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val(AskRateFXO);    
                }

                if($(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]')[0].value = numberWithCommas((BidRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
                }

              }else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Straddle"){
                
                if($(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val(BidRateFXO);
                }
                
              }

              _UpdateFlagFXStrategies=false;

            } else{            
                
              if ( $(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Strangle" ||$(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Risk Reversal") {

                if($(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(AskRateFXO);
                }
                
                if($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]')[0].value === ""){
                  $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]')[0].value = numberWithCommas((BidRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
                }
              } else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Option Spread") {

                if($(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val(AskRateFXO);
                }

                if($(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]')[0].value = numberWithCommas((BidRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
                }

              }
              else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Straddle"){
                
                if($(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val(BidRateFXO);
                }

              }
            }
          }

        } else {
          if(iscloned !== true) {
            if(_addtileflag === true ){ 
              if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Strangle" || $(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Risk Reversal") {
    
                $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(BidRateFXO);
                $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
              
              } else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Option Spread") {
                
                $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val(BidRateFXO);
                $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
    
              }else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Straddle"){
                
                $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val(AskRateFXO);
             
              }
              _addtileflag = false;

            }else if(_defaultflagGXStrategies === true) { 
              if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Strangle" ||$(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Risk Reversal") {
    
                $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(BidRateFXO);
                $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
              
              } else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Option Spread") {
                
                $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val(BidRateFXO);
                $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
    
              }else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Straddle"){
                
                $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val(AskRateFXO);

              }
              _defaultflagGXStrategies = false;

            }else if(!_UpdateFlagFXStrategies){

              if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Strangle" ||$(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Risk Reversal") {
               
                if($(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(BidRateFXO);                
                } 

                if($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
                }

              } else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Option Spread") {
                
                if($(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val(BidRateFXO);    
                }

                if($(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
                }

              }else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Straddle"){
                
                if($(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val(AskRateFXO);
                }
                
              }
      
              _UpdateFlagFXStrategies=false;
  
            }else if(_UpdateFlagFXStrategies ){

              if(_eventstrikechangeFXStrategies === true){
               
                _eventstrikechangeFXStrategies = false;
              
              }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Strangle" || $(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Risk Reversal") {
               
                if($(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(BidRateFXO);                
                }  
                
                if($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
                }

              } else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Option Spread") {
               
                if($(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val(BidRateFXO);    
                }

                if($(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
                }

              }else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Straddle"){
                
                if($(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val(AskRateFXO);
                }
                
              }

              _UpdateFlagFXStrategies=false;

            } else{  
          
              if ( $(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Strangle" ||$(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Risk Reversal") {

                if($(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val(BidRateFXO);
                }
                
                if($(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]')[0].value === ""){
                  $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
                }
              } else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() === "Option Spread") {

                if($(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val(BidRateFXO);
                }

                if($(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]')[0].value = numberWithCommas((AskRateFXO.replace(/,/g, "") * 1.03).toFixed(data.dataFromAjax.DecimalRate));
                }

              }
              else if($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Straddle"){
                
                if($(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val() === ""){
                  $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val(AskRateFXO);
                }

              }

            }
          }
        }
        // End - Clone Tile issue | Chaitanya M | 04 Dec 2023

        // Addded for CFINT-992 // 18-Sep-2020 //

        $(thisTileFXStrategies).find('[id^="btnBestPriceFXStrategies"]').attr("disabled", false);

        //END        
        if(iscloned !== true){
          OptionCutListFXStrategies = setasyncOptioncutFXD(currId,  $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val(), productIDStrategies, productCodeStrategies,"FXOSEN");
        
          fillDropdownlistControl(OptionCutListFXStrategies, $(thisTileFXStrategies).find('[id^="Optioncutddl"]').attr('id')); 

          fillDatesFXStrategies(
            $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val(),
            $(thisTileFXStrategies).find('[id^="tenorFXStrategies"]').val(),
            currId
          );

          // fillFirstFixingDateFXStrategie(
          //   $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val(),
          //   $(thisTileFXStrategies).find('[id^="tenorFXStrategies"]').val(),
          //   currId
          // ); // Commented by RizwanS || For FX Strategies need to remove first fixing date API call, as it is not used || 27 Jul 2023
        
        }
        
      } else {

        //let failReason = data.dataFromAjax.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.FailedReason; 
        let failReason = "No response received from remote system.";
        
        ValidateField($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').attr('id'), failReason, thisTileFXStrategies);

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

// Added to set NDFMetalFlag // 05-Feb-2021

function setNDFMetalFlagStrategies(
  currId, 
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
    thisTileFXStrategies = document.getElementById("td" + currId);
    let _strategiesCcylist = "";
    let _strategiesCcy="";

    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
      productIDStrategies = productIDStraddle;
      productCodeStrategies = productCodeStraddle;
      _strategiesCcylist = sessionStorage.getItem("CCYListStraddle");
      _strategiesCcy = JSON.parse(_strategiesCcylist);  

    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
      productIDStrategies = productIDStrangle;
      productCodeStrategies = productCodeStrangle;
      _strategiesCcylist = sessionStorage.getItem("CCYListStrangle");
      _strategiesCcy = JSON.parse(_strategiesCcylist);  

    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
      productIDStrategies = productIDRSKREV;
      productCodeStrategies = productCodeRSKREV;
      _strategiesCcylist = sessionStorage.getItem("CCYListRSKREV");
      _strategiesCcy = JSON.parse(_strategiesCcylist);  

    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {
      productIDStrategies = productIDOPSPRD;
      productCodeStrategies = productCodeOPSPRD;
      _strategiesCcylist = sessionStorage.getItem("CCYListOPSPRD");
      _strategiesCcy = JSON.parse(_strategiesCcylist);  

    } 

    let fxDayBasis =
    _strategiesCcy[
      _strategiesCcy.findIndex(
          (res) => res.asset_Pair == CcyPair
        )
      ].Asset2_Year_Basis;

      $(thisTileFXStrategies).find('[id^="hdnCcyPairDataStrategies"]').val(
        JSON.stringify(
          _strategiesCcy[
            _strategiesCcy.findIndex(
            (res) => res.asset_Pair == CcyPair
          )
          ]
        )
      );

      let notionalddlId = '[id^="CcySelectionFXStrategies"]';
      let hdnpairDataId = '[id^="hdnCcyPairDataStrategies"]';
      let notioanlamtId = '[id^="ContractAmtFXStrategies"]';

      checkDecimalPlaces(
        thisTileFXStrategies,
        notionalddlId,
        hdnpairDataId,
        notioanlamtId
      );
    
  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message);
  }
}

function viewScheduleFXStrategies(that) {
  try {
    getBestPriceFXStrategies(that, true);
  } catch (error) {
    console.log(error.message);
  }
}
 
function checkmetalccyflagFXStrategies(currId,CcyPair){
  try {

    let thisTileFXStrategies = document.getElementById("td" + currId);

    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
      
      _listCcyStrategies = sessionStorage.getItem("CCYListStraddle");

    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
     
      _listCcyStrategies = sessionStorage.getItem("CCYListStrangle");
 
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
      
      _listCcyStrategies = sessionStorage.getItem("CCYListRSKREV");  

    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {
      
      _listCcyStrategies = sessionStorage.getItem("CCYListOPSPRD");  

    }
 
    let _CcyFXStrategies = JSON.parse(_listCcyStrategies);        

    if (
      _CcyFXStrategies[_CcyFXStrategies.findIndex((res) => res.asset_Pair == CcyPair)].lcY_Type.toUpperCase() == "NDF" ||
      _CcyFXStrategies[_CcyFXStrategies.findIndex((res) => res.asset_Pair == CcyPair)].rcY_Type.toUpperCase() == "NDF"
    ) {
      NDFFlagStrategies = "Y";
      IsMetalStrategies = "N";
      $(thisTileFXStrategies).find('[id^="CcySelectionFXStrategies"]').attr("disabled", false); 
      isccymetalflagStrategies = false; 
      $(thisTileFXStrategies).find('[id^="FXDCCYiconFXStrategies"]').removeClass("ccytoggle");
     
    } else if (
      _CcyFXStrategies[_CcyFXStrategies.findIndex((res) => res.asset_Pair == CcyPair)].lcY_Type.toUpperCase() == "METAL" || 
      _CcyFXStrategies[_CcyFXStrategies.findIndex((res) => res.asset_Pair == CcyPair)].rcY_Type.toUpperCase() == "METAL"
    ) {
      NDFFlagStrategies = "N";
      IsMetalStrategies = "Y";
      $(thisTileFXStrategies).find('[id^="CcySelectionFXStrategies"]').attr("disabled", true);   
      isccymetalflagStrategies = true; 
      $(thisTileFXStrategies).find('[id^="FXDCCYiconFXStrategies"]').addClass("ccytoggle"); 
      
    } else {
      NDFFlagStrategies = "N";
      IsMetalStrategies = "N";
      $(thisTileFXStrategies).find('[id^="CcySelectionFXStrategies"]').attr("disabled", false); 
      isccymetalflagStrategies = false; 
      $(thisTileFXStrategies).find('[id^="FXDCCYiconFXStrategies"]').removeClass("ccytoggle");
      
    }  

    $(thisTileFXStrategies).find('[id^="hdnisMetalFX"]').val(IsMetalStrategies);
    $(thisTileFXStrategies).find('[id^="hdnNDFFlagFX"]').val(NDFFlagStrategies);  // HSBCFXEINT-25 - NDF flag are going blank || Chaitanya M  || 24-Jan 2024 

  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message());
  }
}

//Added By Rizwan S || LGTGTWINT-1880 || 19 Jun 2023

//Save Trade Start || 23 Dec 2022 || RijwanS || JIRA ID - LGTGTWINT-607 ||
function SaveTradeFXStrategies(that){
  try{  

    booktradeFXStrategies(that, true);

  }catch(er){

    console.log(er.message);

  }
}//END

//Book Trade
function booktradeFXStrategies(that, RTDflag) {
  try {

    if (RTDflag) {

      TileId = that.id.match(/\d+$/)[0];
      thisTileFXStrategies = document.getElementById("td" + TileId);
      $(thisTileFXStrategies).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayStrategies"); // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer

    } else {

      TileId = that.id.match(/\d+$/)[0];
      thisTileFXStrategies = document.getElementById("td" + TileId);
      $(thisTileFXStrategies).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayStrategies"); // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer 
    }
  } catch (error) {

    console.log(error.message);
  }

} //END

//Save to Dealer RFQ || 23 Dec 2022 || RijwanS || JIRA ID - LGTGTWINT-607 ||
function SaveDealerRFQStrategies(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXStrategies = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");

    // Added by Atharva - Timers - START
    if ("td" + TileId in myInterval) {
      clearInterval(myInterval["td" + TileId]);
      delete myInterval["td" + TileId];
    }
    // END
    console.log("BookingFor ::", TileId, thisTileFXStrategies, productName);
    $(thisTileFXStrategies).find('[id^="BookTradeFXStrategies"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023

    if (
      $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val() == "" ||
      $(thisTileFXStrategies).find('[id^="FXStrategies_PriceRow"]')[0].firstChild.innerHTML =="-" ||
      $(thisTileFXStrategies).find('[id^="FXStrategies_PriceRow"]')[0].firstChild.innerHTML == ""
    ) {

      booktradePopup(that,"booktradeStrategies" + TileId,"Order Execution Failed!","DivOverlayStrategies","E");

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
        $(thisTileFXStrategies).find('[id^="hdnPriceIndexStrategies"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val()
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

    mapleLoaderStart(thisTileFXStrategies,'[id^="BookTradeFXStrategies"]',true);

    // Start LGTCLI-417 || RizwanS || 04 May 2023

    let _prodCode= "";

    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
      _prodCode = productCodeStraddle;
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
      _prodCode = productCodeStrangle;
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
      _prodCode = productCodeRSKREV;
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {
      _prodCode = productCodeOPSPRD;
    }
     //END
    //END

    request_getDataFromAPI(
      {

        "EntityId": EntityID,
        "LoginId": userName,
        "DCD_RFQId": dcdrfqid_val,
        "External_RFQId": JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[0].quoteId.toString(),
        "PriceProviderName": JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[priceIndex].provider,
        "ProductCode": _prodCode, //LGTCLI-417 || RizwanS || 04 May 2023
        "order_Response_TimeOut": "", // HSBCFXEINT-29 | Chaitanya M | 11 Dec 2023
        "twoStepOrderExecutionYN":'N',      
        "OrderRetryFlag": true,
        "CurrentTileID": TileId + "|" + "",
        "Remark": $(thisTileFXStrategies).find('[id^="inputRemark"]').val(),

      },
      clientConfigdata.CommonMethods.NodeServer + "fxobestprice/FXOBookTradeAndGetExternalTradeNumberJSON","","POST",TileId +"|" + userName + '_' + 'BookOrderFXProducts'  +'_' + RequestIDGenerator(8)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      .then((data) => {

        let thisTileFXStrategies = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId =data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

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
            ValidateField($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').attr('id'), orderplaced, thisTileFXStrategies);
            mapleLoaderStop(thisTileFXStrategies,'[id^="BookTradeFXStrategies"]',true);
            return false;
    
          }else if(data.dataFromAjax.isOrderRejected == false || 
            data.dataFromAjax.External_TradeID == "" ||
            data.dataFromAjax.External_TradeID == null ){
              var orderplaced =  "Order may have got executed or may have failed. Contact support." ;
              ValidateField($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').attr('id'), orderplaced, thisTileFXStrategies);
              mapleLoaderStop(thisTileFXStrategies,'[id^="BookTradeFXStrategies"]',true);
            return false;
            }else{
              var orderplaced = data.dataFromAjax.Message;
            ValidateField($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').attr('id'), orderplaced, thisTileFXStrategies);
            mapleLoaderStop(thisTileFXStrategies,'[id^="BookTradeFXStrategies"]',true);
            return false;
            }    
            //End  
        } else {
          // var orderno = data.dataFromAjax.Message.split(":")[1];
          // Added by Atharva - Timers - START
          // Changed the provider name in message from bestpriceprovider to whichever the user has selected.
          // var orderplaced ="Deal No." +data.dataFromAjax.DealNo +"<br>" +
          //   "Order Placed Successfully with Counterparty " +
          //   JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[priceIndex].provider + //JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[0].bestPriceProvider.split(":")[0]
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

        // $(thisTileFXStrategies).find('[id^="OrderBlotter"]').css({ display: "inline" });
        booktradePopup(that,"booktradeStrategies" + TileId,orderplaced,"DivOverlayStrategies");

        $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val("");
        // Added by Atharva - START
        $(thisTileFXStrategies).find(".pricesRow").children().each(function () {
          $(this).find("button").attr("disabled", true);
        });

        $(thisTileFXStrategies).find(".banksNameRow").children().each(function () {
          $(this).find("button").attr("disabled", true);
        });

        $(thisTileFXStrategies).find('[id^="BookTrade"]').attr("disabled", true);
        $(thisTileFXStrategies).find('[id*="BookReq"]').attr("disabled", true);

        blockPriceButtons(TileId);
        // END

        } else {

          let failReason = "Order Execution Failed!";
                
          ValidateField($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').attr('id'), failReason, thisTileFXStrategies);
        }

        mapleLoaderStop(thisTileFXStrategies,'[id^="BookTradeFXStrategies"]',true);
  

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(
      that,
      "booktradeStrategies" + TileId,
      "Order Execution Failed!",
      "DivOverlayStrategies","E"
    );

    mapleLoaderStop(thisTileFXStrategies,'[id^="BookTradeFXStrategies"]',true);

    $(".lblError").html(error.message);
  } finally {
  }
}//END

// Save Route To Dealer RFQAQ || RijwanS || LGTGTWINT-607 || 26 Dec 2022
function SaveRouteToDealerRFQStrategies(that) {
  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXStrategies = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    // Added by Atharva - Timers - START
    if ("td" + TileId in myInterval) {
      clearInterval(myInterval["td" + TileId]);
      delete myInterval["td" + TileId];
    }
    // END
    console.log("Routed to ::", TileId, thisTileFXStrategies, productName);
    $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023 

    if (
      $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val() == "" ||
      $(thisTileFXStrategies).find('[id^="FXStrategies_PriceRow"]')[0].firstChild.innerHTML ==
      "-" ||
      $(thisTileFXStrategies).find('[id^="FXStrategies_PriceRow"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        that,
        "booktradeStrategies" + TileId,
        "Order Execution Failed!",
        "DivOverlayStrategies","E"
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
        $(thisTileFXStrategies).find('[id^="hdnPriceIndexStrategies"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val()
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

    mapleLoaderStart(thisTileFXStrategies,'[id^="btnSaveTradeFX"]',true);


       // Start LGTCLI-417 || RizwanS || 04 May 2023

       let _prodCode= "";

      if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
        _prodCode = productCodeStraddle;
      } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
        _prodCode = productCodeStrangle;
      } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
        _prodCode = productCodeRSKREV;
      } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {
        _prodCode = productCodeOPSPRD;
      }
       //END
  

    request_getDataFromAPI(

      {
       
        "EntityID":EntityID,
        "DCDRFQID":dcdrfqid_val,
        "ProductCode":_prodCode, //LGTCLI-417 || RizwanS || 04 May 2023
        "LoginId":userName,
        "LoginID": userName,
        "NoteMasterId":JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[priceIndex].NoteMasterID,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "RMRemark":$(thisTileFXStrategies).find('[id^="inputRemark"]').val(),
        "CurrentTileID": TileId + "|" + userName + '_' + 'SaveRouteToDealerRFQ'  +'_' + RequestIDGenerator(5) ,

      },
      clientConfigdata.CommonMethods.NodeServer + "SaveRouteToDealerRFQ",
      "",
      "POST",
      TileId +"|" + userName + '_' + 'SaveRouteToDealerRFQ'  +'_' + RequestIDGenerator(8) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
    )
      .then((data) => {
      
        let thisTileFXStrategies = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        
        let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        if (data.SaveRouteToDealerResult.RouteToDealer == true) {

          var orderplaced = "RFQ " + " " + dcdrfqid_val + " " + "routed to dealing desk successfully."
          booktradePopup(that,"booktradeStrategies" + TileId,orderplaced,"DivOverlayStrategies","S");

        } else {

          var orderplaced = "Order Placement Failed."
          booktradePopup(that,"booktradeStrategies" + TileId,orderplaced,"DivOverlayStrategies","E");

        }    

        $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val("");
        // Added by Atharva - START
        $(thisTileFXStrategies)
          .find(".pricesRow")
          .children()
          .each(function () {
            $(this).find("button").attr("disabled", true);
          });
        $(thisTileFXStrategies)
          .find(".banksNameRow")
          .children()
          .each(function () {
            $(this).find("button").attr("disabled", true);
          });
 // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
        $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXStrategies).find('[id*="btnemailquote"]').attr("disabled", true);

        $(thisTileFXStrategies).find("[id^='pricesTimer']").html("");
        $(thisTileFXStrategies)
          .find('[id^="pricesTimer"]')
          .css({ background: "transparent" });
        blockPriceButtons(TileId);
        // END

        mapleLoaderStop(thisTileFXStrategies,'[id^="btnSaveTradeFX"]',true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(
      that,
      "booktradeStrategies" + TileId,
      "Order Execution Failed!",
      "DivOverlayStrategies","E"
    );

    $(".lblError").html(error.message);
    mapleLoaderStop(thisTileFXStrategies,'[id^="btnSaveTradeFX"]',true);
  } finally {
  }
}// END

// Save Trade Idea || RijwanS || LGTGTWINT-608  || 28 Dec 2022
function SaveTradeIdeaFXStrategies(that) {

  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXStrategies = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
  
    console.log("Save Trade Idea for ::", TileId, thisTileFXStrategies, productName);
    $(thisTileFXStrategies).find('[id^="btnSaveTradeFX"]').attr("disabled", true);  // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    
     // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
    isSaveTradeIdeaFXStrategies = false;
    var _modeFXStrategies ="";
    if(isFXDDealer){
      _modeFXStrategies = "SEN";
    }else{
      _modeFXStrategies = "QEN"
    }
    //End


    if ($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val() == "" || $(thisTileFXStrategies).find('[id^="FXStrategies_PriceRow"]')[0].firstChild.innerHTML == "-" || $(thisTileFXStrategies).find('[id^="FXStrategies_PriceRow"]')[0].firstChild.innerHTML == "") {
      booktradePopup(that,"booktradeStrategies" + TileId,"Save trade idea Failed !","DivOverlayStrategies","E");
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
        $(thisTileFXStrategies).find('[id^="hdnPriceIndexStrategies"]').val()
      );
    } else {
      priceIndex = 0;
    }
    
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val()
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


    mapleLoaderStart(thisTileFXStrategies,'[id^="btnSaveTradeIdea"]',true);
  
      // Start LGTCLI-417 || RizwanS || 04 May 2023
      let _prodID = "";
      let _prodCode= "";
      let _prodName = "";
  
      if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
        _prodID = productIDStraddle;
        _prodCode = productCodeStraddle;
        _prodName = ProductNameStraddle;
      } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
        _prodID = productIDStrangle;
        _prodCode = productCodeStrangle;
        _prodName = ProductNameStrangle;
      } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
        _prodID = productIDRSKREV;
        _prodCode = productCodeRSKREV;
        _prodName = ProductNameRSKREV;
      } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {
        _prodID = productIDOPSPRD;
        _prodCode = productCodeOPSPRD;
        _prodName = ProductNameOPSPRD;
      }
      //END

    request_getDataFromAPI(

      {
               
        "EntityID": EntityID,
        "LoginID": userName,
        "ProductCode": _prodCode, //LGTCLI-417 || RizwanS || 04 May 2023
        "NoteMasterID":JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[priceIndex].NoteMasterID,
        "RFQID": dcdrfqid_val,
        "Remark":$(thisTileFXStrategies).find('[id^="inputRemark"]').val(),  // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "Mode": _modeFXStrategies, // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
        // "CurrentTileID": TileId,

      },
      clientConfigdata.CommonMethods.NodeServer + "SaveTradeIdeaFXD",
      "",
      "POST",
      TileId +"|" + userName + '_' + 'SaveTradeIdeaFXD'  +'_' + RequestIDGenerator(8)  // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
    ) .then((data) => {

        let thisTileFXStrategies = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        let TileId = data.RequestID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023

        if (data.SaveTradeRecommendationResult.TradeIdeaSavedYN == true) {
          var orderplaced = "RFQ " + " " + dcdrfqid_val + " " + "marked as trade idea successfully."
          booktradePopup(thisTileFXStrategies, "booktradeStrategies" + TileId, orderplaced, "DivOverlayStrategies","S");
        } else {
          var orderplaced = "Save trade idea Failed."
          booktradePopup(thisTileFXStrategies, "booktradeStrategies" + TileId, orderplaced, "DivOverlayStrategies","E");
        }
        mapleLoaderStop(thisTileFXStrategies,'[id^="btnSaveTradeIdea"]',true);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(thisTileFXStrategies, "booktradeStrategies" + TileId, "Save trade idea Failed.", "DivOverlayStrategies","E");
    mapleLoaderStop(thisTileFXStrategies,'[id^="btnSaveTradeIdea"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

function confirmRtoDStrategies(that) { // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer
  try {


    TileId = that.id.match(/\d+$/)[0];
    thisTileFXStrategies = document.getElementById("td" + TileId);

    $(thisTileFXStrategies).find('[id^="validatiionMsg"]').html("");

    // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
    if(isSaveTradeIdeaFXStrategies){

      SaveTradeIdeaFXStrategies(that);
      closeremarkpopup(that);
            

    }else{

      if (!isFXDDealer) {  // Access Control code changes for FXD Instant Pricer | Chaitanya M | 20 Sep 2023

        if($(thisTileFXStrategies).find('[id^="inputRemark"]').val() == "" || $(thisTileFXStrategies).find('[id^="inputRemark"]').val() == undefined || $(thisTileFXStrategies).find('[id^="inputRemark"]').val() == null){
  
          $(thisTileFXStrategies).find('[id^="validatiionMsg"]').html("Please enter remark.");
          return false;
    
        } else{   
          
          SaveRouteToDealerRFQStrategies(that);
          closeremarkpopup(that);
          
        }
  
      }else if(isFXDDealer){
  
        SaveDealerRFQStrategies(that);
        closeremarkpopup(that);
  
      }
      //End
    }

  }catch(er){

    console.log(er.message);

  }

} //END

// Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
function AddremarkFXStrategies(that) {  
  try {
    TileId = that.id.match(/\d+$/)[0];
      $(thisTileFXStrategies).find('[id^="validatiionMsg"]').html("");
      isSaveTradeIdeaFXStrategies = true;
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayStrategies");  
     

  }catch(er){

    console.log(er.message);

  }

} //END

// Email Quote || RijwanS || LGTGTWINT-608  || 27 Dec 2022
function SendQuoteEmailFXStrategies(that) {
  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXStrategies = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
  
    console.log("email quote to ::", TileId, thisTileFXStrategies, productName);
 

    if ($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val() == "" || $(thisTileFXStrategies).find('[id^="FXStrategies_PriceRow"]')[0].firstChild.innerHTML == "-" || $(thisTileFXStrategies).find('[id^="FXStrategies_PriceRow"]')[0].firstChild.innerHTML == "") {
      booktradePopup(that,"BookTradeFXStrategies" + TileId,"Email Quote Failed!","DivOverlayStrategies","E");
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
        $(thisTileFXStrategies).find('[id^="hdnPriceIndexStrategies"]').val()
      );
    } else {
      priceIndex = 0;
    }
    
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val()
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


    mapleLoaderStart(thisTileFXStrategies,'[id^="btnemailquote"]',true);
  
      // Start LGTCLI-417 || RizwanS || 04 May 2023
      let _prodID = "";
      let _prodCode= "";
      let _prodName = "";
  
      if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
        _prodID = productIDStraddle;
        _prodCode = productCodeStraddle;
        _prodName = ProductNameStraddle;
      } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
        _prodID = productIDStrangle;
        _prodCode = productCodeStrangle;
        _prodName = ProductNameStrangle;
      } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
        _prodID = productIDRSKREV;
        _prodCode = productCodeRSKREV;
        _prodName = ProductNameRSKREV;
      } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {
        _prodID = productIDOPSPRD;
        _prodCode = productCodeOPSPRD;
        _prodName = ProductNameOPSPRD;
      }
      //END

    request_getDataFromAPI(

      {               

        "RequestID": userName + '_' + 'SendQuoteEmailFXDStrategies'  +'_' + RequestIDGenerator(6),
        "EntityID": EntityID,
        "ProductID": _prodID,
        "LoginId": userName,
        "NoteMasterId": JSON.parse($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val())[priceIndex].NoteMasterID,
        "RFQID": dcdrfqid_val
        // "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        // "CurrentTileID": TileId,

      },
      clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/SendQuoteEmail","","POST",TileId +"|" + userName + '_' + 'SendQuoteEmailFXDStrategies'  +'_' + RequestIDGenerator(8)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023 
      .then((data) => {

      // let thisTileFXStrategies = document.getElementById("td" + data.RequestID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
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
            booktradePopup(thisTileFXStrategies, "booktradeStrategies" + TileId, orderplaced, "DivOverlayStrategies","S");
  
          } else {
  
            var orderplaced = "Email Quote Failed."   
            booktradePopup(thisTileFXStrategies, "booktradeStrategies" + TileId, orderplaced, "DivOverlayStrategies","E");        
  
          }
        
        }else {

          let failReason = "Email Quote Failed."
          
          ValidateField($(thisTileFXStrategies).find('[id^="hdnPricesFXO"]').attr('id'), failReason, thisTileFXStrategies);
  
        } 

        mapleLoaderStop(thisTileFXStrategies,'[id^="btnemailquote"]',true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(thisTileFXStrategies, "BookTradeFXStrategies" + TileId, "Email Quote Failed.", "DivOverlayStrategies","E");
    mapleLoaderStop(thisTileFXStrategies,'[id^="btnemailquote"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

// Check Solve for || RijwanS || LGTGTWINT-1880  || 20 Jun 2023
function checkSolveForStrategies(thisTileFXStrategies){
  try{

    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {

      $(thisTileFXStrategies).find('[id^="lblStraddleStrike"]').show();
      $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').show();

      $(thisTileFXStrategies).find('[id^="TypecallStrike"]').hide();
      $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').hide();

      $(thisTileFXStrategies).find('[id^="TypeputStrike"]').hide();
      $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').hide();

      $(thisTileFXStrategies).find('[id^="TypeLSStrike"]').hide();
      $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').hide();
      
      
      $(thisTileFXStrategies).find('[id^="TypeSStrike"]').hide();
      $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').hide();
    

      $(thisTileFXStrategies).find('[id^="LevergeFXStrategies"]').hide();
      $(thisTileFXStrategies).find('[id^="lblLeverage"]').hide();

      $(thisTileFXStrategies).find('[id^="Strategiescallput"]').hide();
      $(thisTileFXStrategies).find('[id^="optionTypelbl"]').hide();


    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {

      $(thisTileFXStrategies).find('[id^="lblStraddleStrike"]').hide();
      $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').hide();

      $(thisTileFXStrategies).find('[id^="TypecallStrike"]').show();
      $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').show();

      $(thisTileFXStrategies).find('[id^="TypeputStrike"]').show();
      $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').show();

      $(thisTileFXStrategies).find('[id^="TypeLSStrike"]').hide();
      $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').hide();
      
      
      $(thisTileFXStrategies).find('[id^="TypeSStrike"]').hide();
      $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').hide();
    

      $(thisTileFXStrategies).find('[id^="LevergeFXStrategies"]').hide();
      $(thisTileFXStrategies).find('[id^="lblLeverage"]').hide();

      $(thisTileFXStrategies).find('[id^="Strategiescallput"]').hide();
      $(thisTileFXStrategies).find('[id^="optionTypelbl"]').hide();
      
    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {

            $(thisTileFXStrategies).find('[id^="lblStraddleStrike"]').hide();
            $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').hide();

            $(thisTileFXStrategies).find('[id^="TypecallStrike"]').show();
            $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').show();

            $(thisTileFXStrategies).find('[id^="TypeputStrike"]').show();
            $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').show();

            $(thisTileFXStrategies).find('[id^="TypeLSStrike"]').hide();
            $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').hide();
            
            
            $(thisTileFXStrategies).find('[id^="TypeSStrike"]').hide();
            $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').hide();
          

            $(thisTileFXStrategies).find('[id^="LevergeFXStrategies"]').show();
            $(thisTileFXStrategies).find('[id^="lblLeverage"]').show();

            $(thisTileFXStrategies).find('[id^="Strategiescallput"]').hide();
            $(thisTileFXStrategies).find('[id^="optionTypelbl"]').hide();

    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() == "Option Spread"){

          $(thisTileFXStrategies).find('[id^="lblStraddleStrike"]').hide();
          $(thisTileFXStrategies).find('[id^="StrikeStraddle"]').hide();

          $(thisTileFXStrategies).find('[id^="TypecallStrike"]').hide();
          $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').hide();

          $(thisTileFXStrategies).find('[id^="TypeputStrike"]').hide();
          $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').hide();

          $(thisTileFXStrategies).find('[id^="TypeLSStrike"]').show();
          $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').show();
          
          
          $(thisTileFXStrategies).find('[id^="TypeSStrike"]').show();
          $(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').show();
        

          $(thisTileFXStrategies).find('[id^="LevergeFXStrategies"]').hide();
          $(thisTileFXStrategies).find('[id^="lblLeverage"]').hide();

          $(thisTileFXStrategies).find('[id^="Strategiescallput"]').show();
          $(thisTileFXStrategies).find('[id^="optionTypelbl"]').show();
     
    } 

  }catch(error){
    console.log(error.message);
  }
}

// Start - Contract Summary Strategies | Chaitanya M | 25 Sep 2023
function GetContractSummaryFXStrategies(that){
  try {
    
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXStrategies = document.getElementById("td" + TileId);
    mapleLoaderStart(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',true); //LGTCLI-422 | Chaitanya M | 5 May 2023

    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {

      productIDStrategies = productIDStraddle;
      productCodeStrategies = productCodeStraddle;
      TemplateCodeStrategies = TemplateCodeStraddle;
      TemplateIDStrategies = TemplateIDStraddle;
      ProductType_Strategies = ProductNameStraddle;

    }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {

      productIDStrategies = productIDStrangle;
      productCodeStrategies = productCodeStrangle;
      TemplateCodeStrategies = TemplateCodeStrangle;
      TemplateIDStrategies = TemplateIDStrangle;
      ProductType_Strategies = ProductNameStrangle;

    }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {    
      
      productIDStrategies = productIDRSKREV;
      productCodeStrategies = productCodeRSKREV;
      TemplateCodeStrategies = TemplateCodeRSKREV;
      TemplateIDStrategies = TemplateIDRSKREV;
      ProductType_Strategies = ProductNameRSKREV;

    }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {

      productIDStrategies = productIDOPSPRD;
      productCodeStrategies = productCodeOPSPRD;
      TemplateCodeStrategies = TemplateCodeOPSPRD;
      TemplateIDStrategies = TemplateIDOPSPRD;
      ProductType_Strategies = ProductNameOPSPRD;

    }

    let _buysell = "";

    if ($(thisTileFXStrategies).find('[id^="strategiesBuySell"]').val().trim() == "Sell") {
      _buysell = "Sell";
    }else{
      _buysell = "Buy";
    }

    let _premCcy = "";
    let _AlternateCCy = "";
    let _InvccyFXstrategies = "";

    if($(thisTileFXStrategies).find('[id^="hdnisMetalFX"]').val() == "Y"){

      _premCcy =  $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[1].trim();
      
    }else{

      _premCcy =  $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[0].trim();

    }

    if($(thisTileFXStrategies).find('[id^="hdnisMetalFX"]').val() === "Y"){
      
      _AlternateCCy = $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[1].trim();
      _InvccyFXstrategies = $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[0].trim();

    }else{

      if( $(thisTileFXStrategies).find('[id^="CcySelectionFXStrategies"]').val() ==  $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[1].trim()){
        
        _AlternateCCy = $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[0].trim();
        _InvccyFXstrategies = $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[1].trim();

      }else{
       
        _AlternateCCy = $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[1].trim();
        _InvccyFXstrategies = $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[0].trim();

      }

    }

    let spreadType = "";
    let UpperStrike = "";
    let LowerStrike = ""; 
    let _strike = "";


    if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {

      _strike = Number($(thisTileFXStrategies).find('[id^="StrikeStraddle"]').val().replace(/,/g, ""));

    }else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Strangle" || $(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {

      UpperStrike = $(thisTileFXStrategies).find('[id^="CallStrikeStrategies"]').val().replace(/,/g, "");
      LowerStrike = $(thisTileFXStrategies).find('[id^="PutStrikeStrategies"]').val().replace(/,/g, "");

    } else if ($(thisTileFXStrategies).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {

      spreadType = (($(thisTileFXStrategies).find('[id^="rbColCallPutToggle"]')[0]).checked ? "CALL" : "PUT");
      UpperStrike = $(thisTileFXStrategies).find('[id^="LongStrikeStrategies"]').val().replace(/,/g, "");
      LowerStrike =$(thisTileFXStrategies).find('[id^="ShortStrikeStrategies"]').val().replace(/,/g, "");

    }
 
    let _notional = "";
    _notional =Number($(thisTileFXStrategies).find('[id^="ContractAmtFXStrategies"]').val().replace(/,/g, "").split(".")[0])

        // LGTGTWINT-1987 | Chaitanya M | 11 May 2023 - Start
        let _IBPremiumFXStrategies = 0;
        let _IBPrempercFXStrategies = 0;
        let _IBPremDirFXStrategies = "";
    
        if($(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val() === "" || $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val() === null || $(thisTileFXStrategies).find('[id^="hdnPricesFXStrategies"]').val() === undefined){
    
          _IBPremiumFXStrategies = 0;
          _IBPrempercFXStrategies = 0;
          _IBPremDirFXStrategies = "";     
          
        }else{
    
          _IBPremiumFXStrategies = Number($(thisTileFXStrategies).find('[id^="hdnIBPremFX"]').val().replace(/,/g, ""));
          _IBPrempercFXStrategies = Number($(thisTileFXStrategies).find('[id^="hdnIBPremPercFX"]').val());
    
          // LGTGTWINT-1987 | Chaitanya M | 05 Jun 2023
          if(_IBPrempercFXStrategies > 0 ){
            _IBPremDirFXStrategies = "Pay";
          }else{
            _IBPremDirFXStrategies = "Receive";
            _IBPremiumFXStrategies = _IBPremiumFXStrategies *-1;
            _IBPrempercFXStrategies = _IBPrempercFXStrategies *-1;
          }
          //End
          
        }
        //End

    request_getDataFromAPI(
    {       
      EntityID: sessionStorage.getItem("HomeEntityID"),
      LoginID: sessionStorage.getItem("Username"),
      ProductCode: productCodeStrategies,
      EntityID_: sessionStorage.getItem("HomeEntityID"),
      TemplateCode: TemplateCodeStrategies, // Added by Chaitanya M | 25 Sep 2023
      producttype : productCodeStrategies, // LGTGTWINT-1921 | Chaitanya M | 27 April 2023
      BSdirection : _buysell,  // Added by Chaitanya M | 25 Sep 2023   
      ccypair : $(thisTileFXStrategies).find('[id^="FXStrategies_CCYPairDemo"]').val().trim(),
      OptionType : spreadType,
      Invccy:_InvccyFXstrategies, //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
      AltNotionalCcy: _AlternateCCy,//LGTGTWINT-1921 | Chaitanya M | 27 April 2023
      PremCcy: _premCcy, //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
      Notional: _notional,
      notionalperfixing : _notional, // Added by Chaitanya M | 25 Sep 2023
      Tenor : $(thisTileFXStrategies).find('[id^="hdnTenorDaysStrategies"]').val(),
      Expiry:$(thisTileFXStrategies).find('[id^="hdnFXStrategiesExpiry"]').val(),
      settlement:$(thisTileFXStrategies).find('[id^="hdnFXStrategiesDeliveryDate"]').val(),
      LongDate: "", 
      shortDate: "",
      Strike : _strike > 0 ? _strike : 0,
      OptionCut : $(thisTileFXStrategies).find('[id^="Optioncutddl"]').val(),
      BarrierType: "",
      ExoticCode : "", // Added by Chaitanya M | 25 Sep 2023
      DigitalType :"",
      UpperBarrier : '0', 
      LowerBarrier : '0', 
      LeverageFactor : productCodeStrategies === 'RSKREV' ? $(thisTileFXStrategies).find('[id^="LevergeFXStrategies"]').val() : '0', // productCodeStrategies === 'RSKREV' ? this.Leverage : '0',
      noofsett : "0",
      nooffixings : "0", 
      FixingFrequency : "",  
      settfrequency : "",
      LowerStrike : LowerStrike > 0 ? LowerStrike : '0', // Put strike
      UpperStrike : UpperStrike > 0 ? UpperStrike : '0', // Call Strike
      pivotstrike :0,
      SpreadType: "",
      customerpremdir: "", 
      IBPremDir: _IBPremDirFXStrategies, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
      IBPrem: _IBPremiumFXStrategies, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
      RTC:0,
      IBPremperc: _IBPrempercFXStrategies, // LGTGTWINT-1987 | Chaitanya M | 11 May 2023
      RTCPerc:"0",
      Target:"0", 
      TargetNotional:"0", 
      KIStyle: "No",
      LowerKI: "0", //LGTGTWINT-1919 | Chaitanya M | 27 April 2023
      UpperKI: "0", //LGTGTWINT-1919 | Chaitanya M | 27 April 2023
      Guaranteedtill:"",
      GuaranteedPeriods:"0", 
      CappedLossCcy:"",
      CappedLossType:"", 
      CappedLoss:"",
      CappedLossAmt:"0",
      TargetBigFigure: "",
      Targetgainunit: "",
      TargetinPips: 0,
      KOITMEvent: "0",
      Striptype: "",
      FirstFixingDate:  $(thisTileFXStrategies).find('[id^="hdnFXStrategiesExpiry"]').val(), // Added by Chaitanya M | 25 Sep 2023
      FinalPayType:"",
      FixingAdjustment:"",
      CurrentTileID:TileId + "|" + ""
    },
    clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/GetContractSummary","","POST",TileId +"|" + userName + '_' + 'CalculateDates_IP'  +'_' + RequestIDGenerator(8)) // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
    .then((data) => { 
      
      let thisTileFXStrategies = document.getElementById("td" + data.CurrentTileID.split("|")[0]); // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      
      let TileId = data.CurrentTileID.split("|")[0]; // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      
      //LGTCLI-422 | Chaitanya M | 5 May 2023
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
          
          $(thisTileFXStrategies).find('[id^="ContractSummaryFXD"]').append(summary);
          
          summarytradePopup(that,"SummaryFXD" + TileId,res,"DivOverlayStrategies");    

          mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',true);
        }else{
          summary = "";
          $(thisTileFXStrategies).find('[id^="ContractSummaryFXD"]').append(summary);

          mapleLoaderStop(thisTileFXStrategies,'[id^="btnBestPriceFXStrategies"]',true);
        }
        //End        

      }); 

  } catch (error) {
    console.log(error.message);
  }
}

// END - Contract Summary Strategies | Chaitanya M | 25 Sep 2023