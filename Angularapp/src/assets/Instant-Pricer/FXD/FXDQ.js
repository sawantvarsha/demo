var TradeDateFXDQ;
var tenorListFXDQ = ["1W","2W","3W","4W","1M","2M","3M","4M","5M","6M","7M","8M","9M","10M","11M","1Y","2Y","3Y","5Y","7Y"];
var tenorArrDQ = ["1W", "2W", "1M", "1D"];
var FreqDQ = ["Daily", "BiWeekly", "Monthly", "Weekly"];
var FreqDQArr = [
  "BiWeekly/BiWeekly",
  "Monthly/Monthly",
  "Weekly/Weekly",
  "Daily/Weekly",
  "Daily/Monthly",
];
var KIstyleArrDQ = ["No", "E-101", "E-102", "E-112"];
var LeverageArrayDQ = ["1", "2"];
var idFXDQ = 14;

var OptionCutListFXDQ = [];
var _defaultflagGFXDQ ="";   //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
var isSaveTradeIdeaFXDQ; // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
var _GuaranteedPeriodsFXDQ = "";
var _GuaranteedtillFXDQ ="";
$(document).ready(function () {
  try {
    // getProductDetailsFXD(clientConfigdata.FXDQ.ProductType);
  } catch (err) {
    console.log(err.message);
  }
});

//To initialize FXDQ product functions while the page is being loaded
function onLoadFXDQ(currId) {
  try {
    setDeafaultValuesFXDQ(currId);
    thisTileFXDQ = document.getElementById("td" + currId);
    $(thisTileFXDQ).find('[id^="SharesbuySellFXDQ"]' + " *").attr("disabled", "disabled").off("click");
    $(thisTileFXDQ).find('[id^="loader_FXDQ"]').hide();

    mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    // Added by RizwanS / Channged User id to gateway specific name / 16 Jun 2022
    // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
    // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
    // END

    resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    $(thisTileFXDQ).find('[id^="BuySellDirectionFXDQ"]').html($(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').val());      

    // Check For KI

    if ($(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("N")) {
      $(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').prop("disabled", true);
    } else {
      $(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').prop("disabled", false);
      $(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').val("");
    }

    // END

    // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    getMaxLevNotionalFXDQ( $(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').val(),  
    $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val(),
    $(thisTileFXDQ).find('[id^="NOSettlementinpboxFXDQ"]').val(),
    currId
  );

  // Added for LGTGTWINT-1667 | FXD-Instant pricer ccy change doesnt happen with ccy pair change  | Chaitanya M | 06 March 2023
  if($(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').val() != $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim()){
    $(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').val($(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim());
    $(thisTileFXDQ).find('[id^="maxlevCcyFXDQ"]').html("(" +$(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim()+ ")"); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
    
  } 

  //End
    //Check for  Frequncy Type // 12 Oct 2021

    $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').on("change", function () {
        try {
          thisTileFXDQ = $(this).parents(".sorting")[0];
          // clearPricerTable(thisTileFXDQ); 
          //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
          // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
        //End 

         mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

         resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        checkDQComboType(
            $(this).parents(".sorting").find('[id^="frequencyFXDQ"]').val(),
            thisTileFXDQ
          );
          fillDatesFXDQ(
            $(this).parents(".sorting").find('[id^="FXDQ_CCYPairDemo"]').val(),
            $(this).parents(".sorting").find('[id^="frequencyFXDQ"]').val(),
            $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXDQ"]').val(),
            currId
          );

          fillFirstFixingDateFXDQ(
            $(this).parents(".sorting").find('[id^="FXDQ_CCYPairDemo"]').val(),
            $(this).parents(".sorting").find('[id^="frequencyFXDQ"]').val(),
            currId
          );

          // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
          getMaxLevNotionalFXDQ( $(this).parents(".sorting").find('[id^="ContractAmtFXDQ"]').val(),
          $(this).parents(".sorting").find('[id^="frequencyFXDQ"]').val(),
          $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXDQ"]').val(),
          currId
          );

          return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
        } catch (error) {
          console.log(error.message());
        }
      });

    //Check for Fixing/Settlement Frequncy // 12 Oct 2021

    $(thisTileFXDQ).find('[id^="NOSettlementinpboxFXDQ"]').on("change", function () {
        try {

          thisTileFXDQ = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
          // clearPricerTable(thisTileFXDQ); 
          //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
          // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
        //End 
        mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

         resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          fillDatesFXDQ(
            $(this).parents(".sorting").find('[id^="FXDQ_CCYPairDemo"]').val(),
            $(this).parents(".sorting").find('[id^="frequencyFXDQ"]').val(),
            $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXDQ"]').val(),
            currId
          );

          fillFirstFixingDateFXDQ(
            $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val(),
            $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val(),
            currId
          );

          // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
          getMaxLevNotionalFXDQ( $(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').val(),
            $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val(),
            $(thisTileFXDQ).find('[id^="NOSettlementinpboxFXDQ"]').val(),
            currId
          );
          return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
        } catch (error) {
          console.log(error.message());
        }

    });
    // END

    //Check for Fixing/Settlement Frequncy // 12 Oct 2021

    $(thisTileFXDQ).find('[id^="FirstFixDate"]').on("change", function () {
        try {
          thisTileFXDQ = $(this).parents(".sorting")[0];
          // clearPricerTable(thisTileFXDQ); 
          //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
          // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
        //End 
        mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
        resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
          
          let firstFix = new Date($(this).val());

          if($(this).val() !=""){ /// LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023
            
            $(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr("disabled", false);
            
            validatefirstfixingday(thisTileFXDQ,"FirstFixDate",firstFix);  

            let formattedDate =firstFix.getDate() +"-" +months[firstFix.getMonth()] +"-" +firstFix.getFullYear();
  
            $(thisTileFXDQ).find('[id^="lblFirstFixDate"]').html(formattedDate);
            fillDatesONFirstFixDQ(
              $(this).parents(".sorting").find('[id^="FXDQ_CCYPairDemo"]').val(),
              $(this).parents(".sorting").find('[id^="frequencyFXDQ"]').val(),
              $(this)
                .parents(".sorting")
                .find('[id^="NOSettlementinpboxFXDQ"]')
                .val(),
              $(this).parents(".sorting").find('[id^="FirstFixDate"]').val(),
              currId
            );
          }else{// LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023

            $(thisTileFXDQ).find('[id^="lblFirstFixDate"]').html($(this).val());
            $(thisTileFXDQ).find('[id^="FXDQ_Expiry"]').html("");
            validatefirstfixingday(thisTileFXDQ,"",$(this).val());
          }  

          return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
        } catch (error) {
          console.log(error.message());
        }
    });

    //END
// changed for LGTGTWINT-1389 | Chaitanya M | 17 Feb 2023
    $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').on("select", function () {   //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike
        try {
          thisTileFXDQ = $(this).parents(".sorting")[0];// LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
          //_defaultflagGFXDQ = true; //LGTCLI-310 | Chaitanya M | 23 feb 2023
          let ccypairsFXDQ = sessionStorage.getItem("CCYListFXDQ");
          // clearPricerTable(thisTileFXDQ); 
          //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
          // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
        //End 
        mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
        resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          if(!ccypairsFXDQ.includes($(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val())){  //LGTGTWINT-1582 | currency pair validation on instant pricer | Chaitanya M | 02-March-2023
           
            $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val("");
            ValidateField($(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').attr("id"), "Currency pair not found.", thisTileFXDQ);
            return false;

          }else{
            // //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
            if( $(this).parents(".sorting").find('[id^="hdnCcyDetailsFXDQ"]').val() ==  $(this).parents(".sorting").find('[id^="FXDQ_CCYPairDemo"]').val()){
              return false;
            }else{
            //End
            _defaultflagGFXDQ = true; //LGTCLI-310 | Chaitanya M | 23 feb 2023
              getCurrencyFXDQRate(currId);
              $(this).parents(".sorting").find('[id^="BuySellDirectionFXDQ"]').html(this.value.split("-")[0].trim());
              $(this) .parents(".sorting").find('[id^="primaryCcyDQ"]').html(this.value.split("-")[0].trim());
              $(this).parents(".sorting").find('[id^="SecondaryCcyDQ"]').html(this.value.split("-")[1].trim());
              //$(this).parents(".sorting").find('[id^="barrieripboxFXDQ"]').val("");
              $(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').val($(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim());          

              $(thisTileFXDQ).find('[id^="maxlevCcyFXDQ"]').html("(" +$(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim()+ ")");
                // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
              getMaxLevNotionalFXDQ( $(this).parents(".sorting").find('[id^="ContractAmtFXDQ"]').val(),
              $(this).parents(".sorting").find('[id^="frequencyFXDQ"]').val(),
              $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXDQ"]').val(),
              currId
              );
              return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 2023
            }  //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
          }
        } catch (error) {
          console.log(error.message);
        }
      });

    // $(thisTileFXDQ)
    //   .find('[id^="CcySelectionFXDQ"]')
    //   .on("change", function () {
    //     try {
    //       thisTileFXDQ = $(this).parents(".sorting")[0];

    //       $(this)
    //         .parents(".sorting")
    //         .find('[id^="BuySellDirectionFXDQ"]')
    //         .html(this.value);

    //       checkDecimalAmt("", thisTileFXDQ); //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022
    //     } catch (error) {
    //       console.log(error.message);
    //     }
    //   });

      $(thisTileFXDQ).find('[id^="CcySelectiontoggleFXDQ"]').on("click", function () {
      try {
        thisTileFXDQ = $(this).parents(".sorting")[0];  
        
        $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
        $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
        // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
      //End 
        // clearPricerTable(thisTileFXDQ); 
        mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
        resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023 
        if(isccymetalflagFXDQ !=true){     
   
        if($(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').val() == $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim()){
          $(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').val($(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[1].trim());
          $(thisTileFXDQ).find('[id^="maxlevCcyFXDQ"]').html("(" +$(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[1].trim()+ ")"); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
          
        }else{
          $(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').val($(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim());
          $(thisTileFXDQ).find('[id^="maxlevCcyFXDQ"]').html("(" +$(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim()+ ")");//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023
        }   
        
        $(this).parents(".sorting").find('[id^="BuySellDirectionFXDQ"]').html(this.value);
        checkDecimalAmt("", thisTileFXDQ); //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022
        return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
      }
      //end
      } catch (error) {
        console.log(error.message);
      }
      });

    //Check for Fixing/Settlement Frequncy // 28 Oct 2020

    $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').on("change", function () {
        try { 
          thisTileFXDQ = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
          // clearPricerTable(thisTileFXDQ); 
          //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
          // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
          // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
        //End 
        mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
        resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

          fillDatesFXDQ(
            $(this).parents(".sorting").find('[id^="FXDQ_CCYPairDemo"]').val(),
            $(this).parents(".sorting").find('[id^="tenorFXDQ"]').val(),
            currId
          );

          // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
          getMaxLevNotionalFXDQ( $(this).parents(".sorting").find('[id^="ContractAmtFXDQ"]').val(),
          $(this).parents(".sorting").find('[id^="frequencyFXDQ"]').val(),
          $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXDQ"]').val(),
          currId
        );
        } catch (error) {
          console.log(error.message);
        }
    });

    $(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').on("change", function(){
      thisTileFXDQ = $(this).parents(".sorting")[0]; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
      $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
      // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
    //End 
      // clearPricerTable(thisTileFXDQ); 
      mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      
      let _notionalamtFXDQ =  FormatNotional($(this).parents(".sorting").find('[id^="ContractAmtFXDQ"]').val(),this); // Added for LGTGTWINT-1511  Incorrect max notional calculation | Chaitanya M | 24 feb 2023
      // Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023 
      getMaxLevNotionalFXDQ(_notionalamtFXDQ,
      $(this).parents(".sorting").find('[id^="frequencyFXDQ"]').val(),
      $(this).parents(".sorting").find('[id^="NOSettlementinpboxFXDQ"]').val(),
      currId
      );
   
      return false; // added for LGTGTWINT-1389 | Chaitanya M | 09 Feb 023
    });

    
    $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]').on("change", function(){
      thisTileFXDQ = $(this).parents(".sorting")[0];// LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);//  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
      // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
    //End 
      // clearPricerTable(thisTileFXDQ); 
      mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    });

    $(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').on("change", function(){
      
      thisTileFXDQ = $(this).parents(".sorting")[0];// LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);//  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true);

      // GetGauranteePeriodsFXDQ(thisTileFXDQ,Number($(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').val()),
      // Number($(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').val().replace(/,/g, "")));

      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
      // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
    //End 
      // clearPricerTable(thisTileFXDQ); 
      mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    });

    $(thisTileFXDQ).find('[id^="Optioncutddl"]').on("change", function(){
      thisTileFXDQ = $(this).parents(".sorting")[0];// LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);//  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
      // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
    //End 
      // // clearPricerTable(thisTileFXDQ); 
      mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    });
    
    $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').on("change", function(){
      thisTileFXDQ = $(this).parents(".sorting")[0];// LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);//  LGTGTWINT-1525 | Chaitanya M | 17 Feb 2023
      $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
      $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true);
      //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
      // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
      // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
    //End 
      // clearPricerTable(thisTileFXDQ); 
      mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    });


    //END
  } catch (error) {
    console.log(error.message);
  }
}

//To set the default values of input fields in FXDQ
function setDeafaultValuesFXDQ(currId) {
  try {
    thisTileFXDQ = document.getElementById("td" + currId);
    $(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').val("100,000.00");  // Default Parameters Change | LGTCLI-310 | Chaitanya M | 17 Feb 2023
    $(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').val("0"); // Default Parameters Change | LGTCLI-310 | Chaitanya M | 17 Feb 2023
    $(thisTileFXDQ).find('[id^="NOSettlementinpboxFXDQ"]').val("52");// LGTGTWINT-1525 | Chaitanya M | 27 Feb 2023
    $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val("EUR - USD");
    $(thisTileFXDQ).find('[id^="rateFXDQ"]').html("1.1097/1.1098");
    $(thisTileFXDQ).find('[id^="BuySellDirectionFXDQ"]').html($(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim());
    $(thisTileFXDQ).find('[id^="primaryCcyDQ"]').html($(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim());
    $(thisTileFXDQ).find('[id^="SecondaryCcyDQ"]').html($(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[1].trim());
    $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val(""); //LGTCLI-310 | Chaitanya M | 23 feb 2023
    //$(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]').val("1.0905"); //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023
 
    getcurrentdate(thisTileFXDQ,"FirstFixDate");
    clearPricerTable(thisTileFXDQ);

    //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
    $(thisTileFXDQ).find('[id^="hdnCcyDetailsFXDQ"]').val($(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val());
    //ENd
    
    if($(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').val()>0){

      _GuaranteedPeriodsFXDQ = Number($(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').val());

    }else{

      _GuaranteedPeriodsFXDQ = Number($(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').val());
      _GuaranteedtillFXDQ = "";
    
    }
    //Added for ccy pair autocomlete / JIRA - FINGUI - 237 / 14 Feb 2022
    callCcyautocompleteFX(thisTileFXDQ, "FXDQ_CCYPairDemo");
    //END
  } catch (err) {
    console.log(err.message);
  }
}

//To get Trade, Premium, Expiry, Delivery Dates
function fillDatesFXDQ(pair, typevalDQ, NoofFixingDQ, that) {
  try {
    thisTileFXDQ = document.getElementById("td" + that);

    if (
      typevalDQ == "MAMS1Y01" ||
      typevalDQ == "MAMS2Y02" ||
      typevalDQ == "MAMS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[2];
      SettFrqDQ = FreqDQ[2];
      tenorCodeDQ = NoofFixingDQ + SettFrqDQ[0];
    } else if (typevalDQ == "MAMS1N00" || typevalDQ == "MAMS2N00") {
      FixingFrqDQ = FreqDQ[2];
      SettFrqDQ = FreqDQ[2];
      tenorCodeDQ = NoofFixingDQ + SettFrqDQ[0];
    } else if (
      typevalDQ == "WAWS1Y01" ||
      typevalDQ == "WAWS2Y02" ||
      typevalDQ == "WAWS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[3];
      SettFrqDQ = FreqDQ[3];
      tenorCodeDQ = NoofFixingDQ + SettFrqDQ[0];
    } else if (typevalDQ == "WAWS1N00" || typevalDQ == "WAWS2N00") {
      FixingFrqDQ = FreqDQ[3];
      SettFrqDQ = FreqDQ[3];
      tenorCodeDQ = NoofFixingDQ + SettFrqDQ[0];
    } else if (
      typevalDQ == "BABS1Y01" ||
      typevalDQ == "BABS2Y02" ||
      typevalDQ == "BABS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[1];
      SettFrqDQ = FreqDQ[1];
      tenorCodeDQ = NoofFixingDQ * 2 + tenorArrDQ[1][1];
    } else if (typevalDQ == "BABS1N00" || typevalDQ == "BABS2N00") {
      FixingFrqDQ = FreqDQ[1];
      SettFrqDQ = FreqDQ[1];
      tenorCodeDQ = NoofFixingDQ * 2 + tenorArrDQ[1][1];
    } else if (
      typevalDQ == "DAWS1Y01" ||
      typevalDQ == "DAWS2Y02" ||
      typevalDQ == "DAWS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[0];
      SettFrqDQ = FreqDQ[3];
      tenorCodeDQ = NoofFixingDQ + SettFrqDQ[0];
    } else if (typevalDQ == "DAWS1N00" || typevalDQ == "DAWS2N00") {
      FixingFrqDQ = FreqDQ[0];
      SettFrqDQ = FreqDQ[3];
      tenorCodeDQ = NoofFixingDQ + SettFrqDQ[0];
    } else if (
      typevalDQ == "DAMS1Y01" ||
      typevalDQ == "DAMS2Y02" ||
      typevalDQ == "DAMS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[0];
      SettFrqDQ = FreqDQ[2];
      tenorCodeDQ = NoofFixingDQ + SettFrqDQ[0];
    } else if (typevalDQ == "DAMS1N00" || typevalDQ == "DAMS2N00") {
      FixingFrqDQ = FreqDQ[0];
      SettFrqDQ = FreqDQ[2];
      tenorCodeDQ = NoofFixingDQ + SettFrqDQ[0];
    }

    // END

    $(thisTileFXDQ).find('[id^="hdnFXDQTenorCode"]').val(tenorCodeDQ);

    // Addded for CFINT-992 // 18-Sep-2020 //

    $(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr("disabled", true);
    $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true);
    clearPricerTable(thisTileFXDQ);

    //END
    request_getDataFromAPI(
      {
        "CurrencyPair": $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().trim(),
        "TradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "Tenor_Code": tenorCodeDQ,
        "Fixing_Frequency":FixingFrqDQ,	
        "Settlement_Frequency":SettFrqDQ,
        "DepoCcy": pair.split("-")[0].trim(),
        "AltCcy": pair.split("-")[1].trim(),
        "iProductId": productIDFXDQ,
        "I_ProductCode": productCodeDQ,
        "CurrentTileID": that,
        "token":"",
        "EntityID": EntityID,
        "LoginID":userName,
        "ProductCode": productCodeDQ,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "OptionCut": $(thisTileFXDQ).find('[id^="Optioncutddl"]').val(),

      },
      clientConfigdata.CommonMethods.NodeServer + "fillDatesFXO"
    )
      .then((data) => {
        let thisTileFXDQ = document.getElementById("td" + data.CurrentTileID);

        let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

        if(responseHeader.toUpperCase() == "SUCCESS"){

        TradeDateFXDQ = setBusinessDate;
        $(thisTileFXDQ)
          .find('[id^="FXDQ_Expiry"]')
          .html(data.CalculateDatesResult.Dates[0].FixingDate); //LGTCLI-401 - Instant Pricer FX Final Fixing Date (FXD) | Chaitanya M | 12 April 2023
        $(thisTileFXDQ)
          .find('[id^="hdnFXDQPremiumDate"]')
          .val(data.CalculateDatesResult.Dates[0].ValueDate);
        $(thisTileFXDQ)
          .find('[id^="hdnFXDQExpiry"]')
          .val(data.CalculateDatesResult.Dates[0].FixingDate);
        $(thisTileFXDQ)
          .find('[id^="hdnFXDQDeliveryDate"]')
          .val(data.CalculateDatesResult.Dates[0].MaturityDate);
        $(thisTileFXDQ)
          .find('[id^="hdnTenorDaysDQ"]')
          .val(data.CalculateDatesResult.Dates[0].ExpiryDays);
        // Addded for CFINT-992 // 18-Sep-2020 //

        $(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr("disabled", false); 
     
        setNDFMetalFlagDQ(
          that,
          productIDFXDQ,
          productCodeDQ,
          $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().trim(),
          pair.split("-")[0].trim(),
          pair.split("-")[1].trim(),
          FixingFrqDQ,
          SettFrqDQ,
          $(thisTileFXDQ).find('[id^="hdnFXDQPremiumDate"]').val(),
          $(thisTileFXDQ).find('[id^="hdnFXDQExpiry"]').val(),
          $(thisTileFXDQ).find('[id^="hdnFXDQDeliveryDate"]').val()
        );

        //END

        } else {

          let failReason = data.CalculateDatesResult.A_ResponseHeader.FailedReason; 
          
          ValidateField($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').attr('id'), failReason, thisTileFXDQ);

      }  

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

function fillFirstFixingDateFXDQ(pair, typevalDQ, that) {
  try {
    thisTileFXDQ = document.getElementById("td" + that);

    if (
      typevalDQ == "MAMS1Y01" ||
      typevalDQ == "MAMS2Y02" ||
      typevalDQ == "MAMS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[2];
      SettFrqDQ = FreqDQ[2];
      tenorCodeDQ = tenorArrDQ[2];
    } else if (typevalDQ == "MAMS1N00" || typevalDQ == "MAMS2N00") {
      FixingFrqDQ = FreqDQ[2];
      SettFrqDQ = FreqDQ[2];
      tenorCodeDQ = tenorArrDQ[2];
    } else if (
      typevalDQ == "WAWS1Y01" ||
      typevalDQ == "WAWS2Y02" ||
      typevalDQ == "WAWS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[3];
      SettFrqDQ = FreqDQ[3];
      tenorCodeDQ = tenorArrDQ[0];
    } else if (typevalDQ == "WAWS1N00" || typevalDQ == "WAWS2N00") {
      FixingFrqDQ = FreqDQ[3];
      SettFrqDQ = FreqDQ[3];
      tenorCodeDQ = tenorArrDQ[0];
    } else if (
      typevalDQ == "BABS1Y01" ||
      typevalDQ == "BABS2Y02" ||
      typevalDQ == "BABS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[1];
      SettFrqDQ = FreqDQ[1];
      tenorCodeDQ = tenorArrDQ[1];
    } else if (typevalDQ == "BABS1N00" || typevalDQ == "BABS2N00") {
      FixingFrqDQ = FreqDQ[1];
      SettFrqDQ = FreqDQ[1];
      tenorCodeDQ = tenorArrDQ[1];
    } else if (
      typevalDQ == "DAWS1Y01" ||
      typevalDQ == "DAWS2Y02" ||
      typevalDQ == "DAWS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[0];
      SettFrqDQ = FreqDQ[3];
      tenorCodeDQ = tenorArrDQ[3];
    } else if (typevalDQ == "DAWS1N00" || typevalDQ == "DAWS2N00") {
      FixingFrqDQ = FreqDQ[0];
      SettFrqDQ = FreqDQ[3];
      tenorCodeDQ = tenorArrDQ[3];
    } else if (
      typevalDQ == "DAMS1Y01" ||
      typevalDQ == "DAMS2Y02" ||
      typevalDQ == "DAMS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[0];
      SettFrqDQ = FreqDQ[2];
      tenorCodeDQ = tenorArrDQ[3];
    } else if (typevalDQ == "DAMS1N00" || typevalDQ == "DAMS2N00") {
      FixingFrqDQ = FreqDQ[0];
      SettFrqDQ = FreqDQ[2];
      tenorCodeDQ = tenorArrDQ[3];
    }

    $(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr("disabled", true);
    $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true);
    clearPricerTable(thisTileFXDQ);

    request_getDataFromAPI(
      {

        "CurrencyPair" : $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().trim(),
        "TradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "Tenor_Code": tenorCodeDQ,
        "Fixing_Frequency": FixingFrqDQ,
        "Settlement_Frequency": SettFrqDQ,
        "EntityID": EntityID,
        "LoginID": userName,
        "DepoCcy": pair.split("-")[0].trim(),
        "AltCcy": pair.split("-")[1].trim(),
        "iProductId": productIDFXDQ,
        "I_ProductCode": productCodeDQ,
        "ProductCode": productCodeDQ,
        "CurrentTileID": that,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "optioncut": $(thisTileFXDQ).find('[id^="Optioncutddl"]').val(),

      },
      clientConfigdata.CommonMethods.NodeServer + "fillFirstFixingDate"
    )
      .then((data) => {
        let thisTileFXDQ = document.getElementById("td" + data.CurrentTileID);

        let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

        if(responseHeader.toUpperCase() == "SUCCESS"){

        //$(thisTileFXDQ).find('[id^="FirstFixDate"]').val(data.CalculateDatesResult.Dates[0].FixingDate);
        let strFirstFix = new Date(
          data.CalculateDatesResult.Dates[0].FixingDate
        );
        let firstFix =
          strFirstFix.getFullYear() +
          "-" +
          ("0" + (strFirstFix.getMonth() + 1)).substr(-2, 2) +
          "-" +
          ("0" + strFirstFix.getDate()).substr(-2, 2);
        $(thisTileFXDQ).find('[id^="FirstFixDate"]').val(firstFix);
        $(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr("disabled", false);
        $(thisTileFXDQ).find('[id^="lblFirstFixDate"]').html(data.CalculateDatesResult.Dates[0].FixingDate);

        } else {

          let failReason = data.CalculateDatesResult.A_ResponseHeader.FailedReason; 
          
          ValidateField($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').attr('id'), failReason, thisTileFXDQ);

      } 
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message());
  }
}

function fillDatesONFirstFixDQ(pair, typeval, NoofFixing, custDate, that) {
  try {
    thisTileFXDQ = document.getElementById("td" + that);

    if (
      typeval == "MAMS1Y01" ||
      typeval == "MAMS2Y02" ||
      typeval == "MAMS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[2];
      SettFrqDQ = FreqDQ[2];
      tenorCodeDQ = NoofFixing + SettFrqDQ[0];
    } else if (typeval == "MAMS1N00" || typeval == "MAMS2N00") {
      FixingFrqDQ = FreqDQ[2];
      SettFrqDQ = FreqDQ[2];
      tenorCodeDQ = NoofFixing + SettFrqDQ[0];
    } else if (
      typeval == "WAWS1Y01" ||
      typeval == "WAWS2Y02" ||
      typeval == "WAWS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[3];
      SettFrqDQ = FreqDQ[3];
      tenorCodeDQ = NoofFixing + SettFrqDQ[0];
    } else if (typeval == "WAWS1N00" || typeval == "WAWS2N00") {
      FixingFrqDQ = FreqDQ[3];
      SettFrqDQ = FreqDQ[3];
      tenorCodeDQ = NoofFixing + SettFrqDQ[0];
    } else if (
      typeval == "BABS1Y01" ||
      typeval == "BABS2Y02" ||
      typeval == "BABS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[1];
      SettFrqDQ = FreqDQ[1];
      tenorCodeDQ = NoofFixing * 2 + tenorArrDQ[1][1];
    } else if (typeval == "BABS1N00" || typeval == "BABS2N00") {
      FixingFrqDQ = FreqDQ[1];
      SettFrqDQ = FreqDQ[1];
      tenorCodeDQ = NoofFixing * 2 + tenorArrDQ[1][1];
    } else if (
      typeval == "DAWS1Y01" ||
      typeval == "DAWS2Y02" ||
      typeval == "DAWS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[0];
      SettFrqDQ = FreqDQ[3];
      tenorCodeDQ = NoofFixing + SettFrqDQ[0];
    } else if (typeval == "DAWS1N00" || typeval == "DAWS2N00") {
      FixingFrqDQ = FreqDQ[0];
      SettFrqDQ = FreqDQ[3];
      tenorCodeDQ = NoofFixing + SettFrqDQ[0];
    } else if (
      typeval == "DAMS1Y01" ||
      typeval == "DAMS2Y02" ||
      typeval == "DAMS2Y12"
    ) {
      FixingFrqDQ = FreqDQ[0];
      SettFrqDQ = FreqDQ[2];
      tenorCodeDQ = NoofFixing + SettFrqDQ[0];
    } else if (typeval == "DAMS1N00" || typeval == "DAMS2N00") {
      FixingFrqDQ = FreqDQ[0];
      SettFrqDQ = FreqDQ[2];
      tenorCodeDQ = NoofFixing + SettFrqDQ[0];
    }

    $(thisTileFXDQ).find('[id^="hdnFXDQTenorCode"]').val(tenorCodeDQ);

    // Addded for CFINT-992 // 18-Sep-2020 //

    $(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr("disabled", true);
    $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true);
    clearPricerTable(thisTileFXDQ);

    request_getDataFromAPI(
      {

        "EntityID": EntityID,
        "LoginID": userName,
        "DepoCcy": pair.split("-")[0].trim(),
        "AltCcy": pair.split("-")[1].trim(),
        "CurrencyPair" : $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().trim(),
        "TradeDate": setBusinessDate,
        "iEntityID": EntityID,
        "Tenor_Code": tenorCodeDQ,
        "Fixing_Frequency":FixingFrqDQ,
        "Settlement_Frequency":SettFrqDQ,
        "iProductId": productIDFXDQ,
        "I_ProductCode": productCodeDQ,
        "ProductCode": productCodeDQ,
        "FirstFixingDate":custDate,
        "CurrentTileID": that,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "optioncut": $(thisTileFXDQ).find('[id^="Optioncutddl"]').val(),

      },
      clientConfigdata.CommonMethods.NodeServer + "filldatesafterFix"
    )
      .then((data) => {
        let thisTileFXDQ = document.getElementById("td" + data.CurrentTileID);

        let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

            if(responseHeader.toUpperCase() == "SUCCESS"){

        $(thisTileFXDQ).find('[id^="FXDQ_Expiry"]').html("");

        $(thisTileFXDQ).find('[id^="hdnFXDQExpiry"]').val("");

        $(thisTileFXDQ).find('[id^="hdnFXDQDeliveryDate"]').val("");

        $(thisTileFXDQ).find('[id^="FXDQ_Expiry"]').html(data.CalculateDatesResult.Dates[0].FixingDate); //LGTCLI-401 - Instant Pricer FX Final Fixing Date (FXD) | Chaitanya M | 12 April 2023

        $(thisTileFXDQ).find('[id^="hdnFXDQExpiry"]').val(data.CalculateDatesResult.Dates[0].FixingDate);

        $(thisTileFXDQ).find('[id^="hdnFXDQDeliveryDate"]').val(data.CalculateDatesResult.Dates[0].MaturityDate);

        $(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr("disabled", false);

        } else {

          let failReason = data.CalculateDatesResult.A_ResponseHeader.FailedReason; 
          
          ValidateField($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').attr('id'), failReason, thisTileFXDQ);

        }  

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message());
  }
}

function checkDQComboType(ComboTypeDQ, thisTileFXDQ) {
  try {

    $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true);

    if (
      ComboTypeDQ == "MAMS1Y01" ||
      ComboTypeDQ == "MAMS2Y02" ||
      ComboTypeDQ == "MAMS2Y12"
    ) {
      $(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').prop("disabled", false);
    } else if (ComboTypeDQ == "MAMS1N00" || ComboTypeDQ == "MAMS2N00") {
      $(thisTileFXDQ)
        .find('[id^="KIinpboxFXDQ"]')
        .val("")
        .prop("disabled", true);
    } else if (
      ComboTypeDQ == "WAWS1Y01" ||
      ComboTypeDQ == "WAWS2Y02" ||
      ComboTypeDQ == "WAWS2Y12"
    ) {
      $(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').prop("disabled", false);
    } else if (ComboTypeDQ == "WAWS1N00" || ComboTypeDQ == "WAWS2N00") {
      $(thisTileFXDQ)
        .find('[id^="KIinpboxFXDQ"]')
        .val("")
        .prop("disabled", true);
    } else if (
      ComboTypeDQ == "BABS1Y01" ||
      ComboTypeDQ == "BABS2Y02" ||
      ComboTypeDQ == "BABS2Y12"
    ) {
      $(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').prop("disabled", false);
    } else if (ComboTypeDQ == "BABS1N00" || ComboTypeDQ == "BABS2N00") {
      $(thisTileFXDQ)
        .find('[id^="KIinpboxFXDQ"]')
        .val("")
        .prop("disabled", true);
    } else if (
      ComboTypeDQ == "DAWS1Y01" ||
      ComboTypeDQ == "DAWS2Y02" ||
      ComboTypeDQ == "DAWS2Y12"
    ) {
      $(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').prop("disabled", false);
    } else if (ComboTypeDQ == "DAWS1N00" || ComboTypeDQ == "DAWS2N00") {
      $(thisTileFXDQ)
        .find('[id^="KIinpboxFXDQ"]')
        .val("")
        .prop("disabled", true);
    } else if (
      ComboTypeDQ == "DAMS1Y01" ||
      ComboTypeDQ == "DAMS2Y02" ||
      ComboTypeDQ == "DAMS2Y12"
    ) {
      $(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').prop("disabled", false);
    } else if (ComboTypeDQ == "DAMS1N00" || ComboTypeDQ == "DAMS2N00") {
      $(thisTileFXDQ)
        .find('[id^="KIinpboxFXDQ"]')
        .val("")
        .prop("disabled", true);
    }
  } catch (er) {
    console.log(er.message);
  }
}

//To Get Best Price of FXDQ and display the prices
function getBestPriceFXDQ(that, Scheduleflag) {
  try {
    TileIdFXDQ = event.currentTarget.id.match(/\d+$/)[0];
    TileIdFXDQ = that.id.match(/\d+$/)[0];
    thisTileFXDQ = document.getElementById("td" + TileIdFXDQ);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    console.log("PricingFor ::", TileIdFXDQ, productName); //Removed unwanted console log || RizwanS || 08 May 2023
    validation_clear(); //To Remove highlighted part if no error
    // clearPricerTable(thisTileFXDQ); //To clear prices after clicking best price

    // Added by RizwanS / RFQ ID on UI / 16 Jun 2022
    // $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').hide();
    // $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");  //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
    //END

    resetFXDPrice(thisTileFXDQ); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    $(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr("disabled", true); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    let _RID_DQ = ""; // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    _RID_DQ = _RID_DQ + RequestIDGenerator(35); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    $(thisTileFXDQ).find('[id^="hdnRequestID"]').val(_RID_DQ);  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

    //To Remove highlighted part if no error
    var elem = $("body").find(".ValidateFieldCSS");
    if (elem.id != "") {
      elem.removeClass("ValidateFieldCSS");
      document.getElementById("required").style.display = "none"; //Remove icon * || Tina K
    } //END Remove

    //Validation conditions

    if ($.trim($(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val()) == "") {
      ValidateField(
        $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').attr("id"),
        "Please Select Currency Pair",
        thisTileFXDQ
      );
      return false;
    } else if (
      $.trim($(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').val()) == "" ||
      parseFloat($(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').val()) == 0
    ) {
      ValidateField(
        $(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').attr("id"),
        "Please Enter Valid Contract Amount",
        thisTileFXDQ
      );
      return false;
    } else if (
      $.trim(
        $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]').val().replace(/,/g, "")
      ) == "" ||
      parseFloat(
        $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]').val().replace(/,/g, "")
      ) <= 0
    ) {
      ValidateField(
        $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]').attr("id"),
        "Please Enter Valid Strike Rate",
        thisTileFXDQ
      );
      return false;
    } else if (
      $.trim($(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').val()) == ""
    ) {
      ValidateField(
        $(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').attr("id"),
        "Please Enter Valid Gauranteed Period",
        thisTileFXDQ
      );
      return false;
    } else if (
      $.trim(
        $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val().replace(/,/g, "")
      ) == "" ||
      parseFloat(
        $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val().replace(/,/g, "")
      ) <= 0
    ) {
      ValidateField(
        $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').attr("id"),
        "Please Enter Valid Barrier",
        thisTileFXDQ
      );
      return false;
    } else if (
      parseFloat(
        $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val().replace(/,/g, "")
      ) >=
      parseFloat(
        $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]').val().replace(/,/g, "")
      )
    ) {
      ValidateField(
        $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').attr("id"),
        "Barrier should be less than Spot and Strike",
        thisTileFXDQ
      );
      return false;
    }

    if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("N") == false
    ) {
      if (
        $.trim($(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').val()) == "" ||
        $.trim($(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').val()) == 0
      ) {
        ValidateField(
          $(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').attr("id"),
          "Please Enter Valid KI.",
          thisTileFXDQ
        );
        return false;
      } else if (
        $.trim($(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').val()) <
        $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]').val().replace(/,/g, "")
      ) {
        ValidateField(
          $(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').attr("id"),
          "KI Rate should be greater than strike.",
          thisTileFXDQ
        );
        return false;
      }
    }

    let prmiumDate = new Date(
      $(thisTileFXDQ).find('[id^="hdnFXDQPremiumDate"]').val()
    );
    let FixingDate = new Date(
      $(thisTileFXDQ).find('[id^="FirstFixDate"]').val()
    );
    let tradedate = new Date(TradeDateFXDQ);

    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let weekday = new Date($(thisTileFXDQ).find('[id^="FirstFixDate"]').val());
    let dayName = days[weekday.getDay()];

    if (
      dayName.toUpperCase().includes("SAT") ||
      dayName.toUpperCase().includes("SUN")
    ) {
      ValidateField(
        $(thisTileFXDQ).find('[id^="FirstFixDate"]').attr("id"),
        "First Fixing Date should not fall on holiday.",
        thisTileFXDQ
      );
      return false;
    }

    if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("DAWS") ||
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("DAMS")
    ) {
      if (FixingDate.getTime() < tradedate.getTime()) {
        ValidateField(
          $(thisTileFXDQ).find('[id^="FirstFixDate"]').attr("id"),
          "First fixing should not be less than Trade Date.",
          thisTileFXDQ
        );
        return false;
      }
    }

    // LGTCLI-370 Instant Pricer First Fixing Date Next Day || Chaitanya M || 27 March 2023

    //else {
    //   if (prmiumDate.getTime() > FixingDate.getTime()) {
    //     ValidateField(
    //       $(thisTileFXDQ).find('[id^="FirstFixDate"]').attr("id"),
    //       "First fixing should not be less than Premium date.",
    //       thisTileFXDQ
    //     );
    //     return false;
    //   }
    // }
    // Validation END

    //End

    $(thisTileFXDQ).find('[id^="loader_FXDQ"]').show();

    // Check for KIStyle

    if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("1N") ||
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("2N")
    ) {
      KIStyleDQ = KIstyleArrDQ[0];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("01")
    ) {
      KIStyleDQ = KIstyleArrDQ[1];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("02")
    ) {
      KIStyleDQ = KIstyleArrDQ[2];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("12")
    ) {
      KIStyleDQ = KIstyleArrDQ[3];
    }

    // END
    // Check For Leverage

    if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("1Y") ||
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("1N")
    ) {
      LeverageFXDQ = LeverageArrayDQ[0];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("2Y") ||
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("2N")
    ) {
      LeverageFXDQ = LeverageArrayDQ[1];
    }
    // END

    // Check For Settlement Freq.

    if ($(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("BABS")) {
      SettFreqDQ = FreqDQArr[0];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("DAMS")
    ) {
      SettFreqDQ = FreqDQArr[4];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("WAWS")
    ) {
      SettFreqDQ = FreqDQArr[2];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("MAMS")
    ) {
      SettFreqDQ = FreqDQArr[1];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("DAWS")
    ) {
      SettFreqDQ = FreqDQArr[3];
    }


      // LGTCLI-285 -Instant Pricing TARF PM Prem CCY in 1st CCY || RizwanS || 01 Feb 2023

      let _premCcy = "";

      if(IsMetalDQ == "Y"){
  
        _premCcy =  $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[1].trim();
        
      }else{
  
        _premCcy =  $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim();
  
      }
  
      // END


    var xmlstrFXDQ =
      "<ExcelSheets>" +
      "<Sheet1>" +
      "<Product_Name>" +
      ProductNameDQ +
      "</Product_Name>" +
      "<Hedging_x0020_Type>" +
      clientConfigdata.FXDCommonMethods.Hedging_Type +
      "</Hedging_x0020_Type>" +
      "<CustID>" +
      custID +
      "</CustID>" +
      "<Customer_Name>" +
      custName +
      "</Customer_Name>" +
      "<GuaranteedPeriods>" +
      $(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').val() +
      "</GuaranteedPeriods>" +
      "<OptionCut>" +
      $(thisTileFXDQ).find('[id^="Optioncutddl"]').val() +
      "</OptionCut>" +
      "<KO>" +
      $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val().replace(/,/g, "") +
      "</KO>" +
      "<FirstFixingDate>" +
      $(thisTileFXDQ).find('[id^="FirstFixDate"]').val() +
      "</FirstFixingDate>" +
      "<NonDeliveryYN>N</NonDeliveryYN>" +
      "<FixingSettFreq>" +
      SettFreqDQ +
      "</FixingSettFreq>" +
      "<Currency1>" +
      $(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').val() +
      "</Currency1>" +
      "<CcyPair>" +
      $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().trim() +
      "</CcyPair>" +
      "<PremiumCcy>" +
      _premCcy +
      "</PremiumCcy>" +
      "<CustPrem>0</CustPrem>" +
      "<BuySell>Sell</BuySell>" +
      "<Spotrate>" +
      $(thisTileFXDQ).find('[id^="rateFXDQ"]').html().split("/")[0].replace(/,/g, "").trim() +
      "</Spotrate>" +
      "<LeverageFactor>" +
      LeverageFXDQ +
      "</LeverageFactor>" +
      "<Ccy1PerFixing>" +
      $(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').val().replace(/,/g, "").split(".")[0] +
      "</Ccy1PerFixing>" +
      "<TradeDate>" +
      TradeDateFXDQ +
      "</TradeDate>" +
      "<PremiumDate>" +
      $(thisTileFXDQ).find('[id^="hdnFXDQPremiumDate"]').val() +
      "</PremiumDate>" +
      "<FixingDate>" +
      $(thisTileFXDQ).find('[id^="hdnFXDQExpiry"]').val() +
      "</FixingDate>" +
      "<SettDate>" +
      $(thisTileFXDQ).find('[id^="hdnFXDQDeliveryDate"]').val() +
      "</SettDate>" +
      "<TenorDays>" +
      $(thisTileFXDQ).find('[id^="hdnTenorDaysDQ"]').val() +
      "</TenorDays>" +
      "<Tenor>" +
      $(thisTileFXDQ).find('[id^="hdnFXDQTenorCode"]').val() +
      "</Tenor>" +
      "<Strike>" +
      $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]').val().replace(/,/g, "") +
      "</Strike>" +
      "<KIBarrierType></KIBarrierType>" +
      // "<KI>" +
      // $(thisTileFXDQ).find('[id^="KIinpboxFXDQ"]').val() +
      // "</KI>" +
      "<KIStyle>" +
      KIStyleDQ +
      "</KIStyle>" +
      "<EntityID>" +
      sessionStorage.getItem("HomeEntityID") +
      "</EntityID>" +
      "<CAI_ID>" +
      clientConfigdata.FXDCommonMethods.CAI_ID +
      "</CAI_ID>" +
      "<NoofSett>" +
      $(thisTileFXDQ).find('[id^="NOSettlementinpboxFXDQ"]').val() +
      "</NoofSett>" +
      "</Sheet1>" +
      "</ExcelSheets>";

      $(thisTileFXDQ).find('[id^="hdnXmlStrFXDQ"]').val(xmlstrFXDQ);
    if (Scheduleflag) {
      GetRulescheduleFXD(
        TileIdFXDQ,
        xmlstrFXDQ,
        TemplateCodeFXDQ,
        TemplateIDFXDQ
      );
    } else {
      // Added by RizwanS / Channged User id to gateway specific name / 16 Jun 2022
      USERID_FXDQ = "MGU_" + sessionStorage.getItem("Username");
      $(thisTileFXDQ).find('[id^="hdnUserIDFXDQ"]').val(USERID_FXDQ);
//Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
      if( $(thisTileFXDQ)
      .find('[id^="CcySelectionFXDQ"]')
      .val() ==  $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[1].trim()){
        _AlternateCCy = $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim();
      }else{
        _AlternateCCy = $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[1].trim();

      }

      mapleLoaderStart(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      request_getDataFromAPI(
        {
          ProductType: productCodeDQ,
          CurrencyPair: $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().trim(),
          DepositCurrency: $(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').val(),
          AlternateCurrency: _AlternateCCy, //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
          PremCurrency: _premCcy,
          SettlementCcy: _premCcy,
          AmountInDepositCurrency: $(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').val().replace(/,/g, "").split(".")[0],
          Strike: $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]').val().replace(/,/g, ""),
          LowerBarrier: $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val().replace(/,/g, ""),
          Tenor: $(thisTileFXDQ).find('[id^="hdnFXDQTenorCode"]').val(),
          TradeDate: TradeDateFXDQ,
          ValueDate: $(thisTileFXDQ).find('[id^="hdnFXDQPremiumDate"]').val(),
          FixingDate: $(thisTileFXDQ).find('[id^="hdnFXDQExpiry"]').val(),
          MaturityDate: $(thisTileFXDQ).find('[id^="hdnFXDQDeliveryDate"]').val(),
          NDFFlag: NDFFlagDQ,
          IsMetal: IsMetalDQ,
          UserID: sessionStorage.getItem("Username"),
          EntityId: sessionStorage.getItem("HomeEntityID"),
          PriceProviderDetails: LPListFXDQ,
          // Start|| Commented by ChaitanyaM the Api config call change.| Ref: LGTGTWINT-887 | 9-Jan-23 
          // MaxQuoteTimeOut:
          //   MaxQuoteTimeOutDQ == ""
          //     ? MaxQuoteTimeOutDefault
          //     : MaxQuoteTimeOutDQ,
          // MinQuoteTimeOutForFirstQuoteRFQ:
          //   MinQuoteTimeOutDQ == ""
          //     ? MinQuoteTimeOutDefault
          //     : MinQuoteTimeOutDQ,
          // MinQuoteValidityPeriodRFQ:
          //   MinQuoteValidityPeriodRFQDQ == ""
          //     ? MinQuoteValidityPeriodRFQDefault
          //     : MinQuoteValidityPeriodRFQDQ,
          // MaxTTL: MaxTTLDQ == "" ? MaxTTLDefault : MaxTTLDQ,
          // IgnoreValidTill:
          //   IgnoreValidTillYNDQ == ""
          //     ? IgnoreValidTillYNDefault
          //     : IgnoreValidTillYNDQ,
          // CheckOnlyRFQ:
          //   CheckOnlyRFQYNDQ == "" ? CheckOnlyRFQYNDefault : CheckOnlyRFQYNDQ,
          // UseMaxTTL: UseMaxTTLDQ == "" ? UseMaxTTLDefault : UseMaxTTLDQ,
          // End
          ExternalXMLString: xmlstrFXDQ,
          TemplateCode: TemplateCodeFXDQ,
          TemplateID: TemplateIDFXDQ,
          ProductID: productIDFXDQ,
          currentTile: TileIdFXDQ,
          token:"",
          EntityID: sessionStorage.getItem("HomeEntityID"),
          LoginID: sessionStorage.getItem("Username"),
          ProductCode: productCodeDQ,
          FXD_TOKEN: sessionStorage.getItem("FXD_Token").toString(),
          OptionCut: $(thisTileFXDQ).find('[id^="Optioncutddl"]').val(),
          _requestID: $(thisTileFXDQ).find('[id^="hdnRequestID"]').val() // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
        },
        clientConfigdata.CommonMethods.NodeServer + "getPriceFXDQ",
        "",
        "POST",
        thisTileFXDQ,
        "btnBestPriceFXDQ"
      )
        .then((data) => {
          thisTileFXDQ = document.getElementById("td" + data.currentTile);

          if($(thisTileFXDQ).find('[id^="hdnRequestID"]').val() != data._requestID){ // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

            return false;

          } //END

          let responseHeader = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.Status;
          let  FXDQPriceData = data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody;

          if(responseHeader.toUpperCase() == "SUCCESS"){

          console.log("Best Price Log's for Tile FXDQ ::" +" " +data.currentTile +"\n" +
              data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].o_BestPriceLog);
          console.log("Log's for Tile FXDQ :: DCDRFQID ==" +data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].o_DCDRFQID +
              "\n" +"NoteMasterID==" +data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].NoteMasterID +"\n" +"USERID==" +
              $(thisTileFXDQ).find('[id^="hdnUserIDFXDQ"]').val());

          // Added by RizwanS / RFQ ID on UI / 16 Jun 2022
          $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').show();
          $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
          $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html(data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].o_DCDRFQID);
          // END

          $(thisTileFXDQ).find('[id^="FXDQBanksRow"]').empty();
          $(thisTileFXDQ).find('[id^="FXDQPrices"]').empty();
          // Added by Atharva - Timers - START
          $(thisTileFXDQ).find('[id^="FXDQ_TimerRow"]').empty();
          // END

          // Storing price object in hidden field of current tile
          FXDQPriceData =data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody;
          $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val(JSON.stringify(FXDQPriceData));
          $(thisTileFXDQ).find('[id^="RFQFXDQ"]').val(JSON.stringify(FXDQPriceData)); // Added for LGTGTWINT-1462 'Mail All' functionality | Chaitanya M | 23 Feb 2023

          if (
            JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].provider == null ||
            JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].NoteMasterID == null ||
            JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].bestPriceProvider == "FAIL"
          ) {
            $(thisTileFXDQ).find('[id^="FXDQBanksRow"]').append("<td> - </td>");
            $(thisTileFXDQ).find('[id^="FXDQPrices"]').append("<td> - </td>");
            // Added by Atharva - Timers - START
            $(thisTileFXDQ).find('[id^="FXDQ_TimerRow"]').append("<td> - </td>");
            // END
            $(thisTileFXDQ).find('[id^="loader_FXDQ"]').hide();
            $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", false);
              $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
            //To fetch error from network response
            if (($(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val() =="MAMS 1X" || $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val() == "MAMS 2X") &&
              JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].errormessage != "") {
              ValidateField("hdnctlvalidation",JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].errorMessage.split(".")[0],thisTileFXDQ);
            } else if (
              JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].errorMessage.split("d")[0] == " Guarantee" &&
              JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].errormessage != ""
            ) {
              ValidateField($(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').attr("id"),JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].errorMessage.split(".")[0],thisTileFXDQ);
            } //END Error
            return false;
          } else {
            var BestPP = JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].bestPriceProvider.split(":")[0];
            DCDRFQidFXDQ = JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].o_DCDRFQID;
            bestProviderFXDQ = JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].bestPriceProvider.split(":")[0];
            // Added by Atharva - Timers - START
            // Passing extra parameter to plotprice
            quoteidFXDQ = PlotPrice(JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()),
              JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].bestPriceProvider.split(":")[0],
              "#" + $(thisTileFXDQ).find('[id^="FXDQBanksRow"]').attr("id"),
              "#" + $(thisTileFXDQ).find('[id^="FXDQPrices"]').attr("id"),
              data.currentTile
            );
            $(thisTileFXDQ).find('[id^="hdnQuoteIDFXDQ"]').val(quoteidFXDQ);
            // Added by Atharva - Timers - START
            if (
              BestPP != "FAIL" &&
              BestPP !== undefined &&
              BestPP != "" &&
              BestPP != null
            ) {
              startTimers(data.currentTile);
            }
            // END
          }

          $(thisTileFXDQ).find('[id^="loader_FXDQ"]').hide();

          // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023   
          $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", false);  
          $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", false);
          $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", false);
          if (JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()) !=null || JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()) !=undefined
          ) {
            drawgraphFXDQ($(thisTileFXDQ).find('[id^="canvas"]').attr("id"));
          }

          mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

        } else if(data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse == null){

          if(data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != null || 
            data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != ""){
           
            _failedreason = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason;
            ValidateField($(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr('id'), _failedreason, thisTileFXDQ); 
          
          }else{
           
            _failedreason = "Pricing Failed!";
            ValidateField($(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr('id'), _failedreason, thisTileFXDQ); 
          
          }
          
          $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);
          $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
          $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true)

        }
        
        //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 
        else if(data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].bestPriceProvider === null ||
          data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].bestPriceProvider == ""){
          
          if(data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].errorMessage === null ||
            data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].errorMessage === ''){
          //End
            if(data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != null || 
              data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason != ""){
             
              _failedreason = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason;
              ValidateField($(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr('id'), _failedreason, thisTileFXDQ); 
            
            }else{
             
              _failedreason = "Pricing Failed!";
              ValidateField($(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr('id'), _failedreason, thisTileFXDQ); 
            
            }
           
          }else{
            failReason = data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].errorMessage;
            if(failReason.includes("Aborting further Migration")){

              _failedreason = failReason.replace(". Aborting further Migration for this record.","");  
              ValidateField($(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr('id'), _failedreason, thisTileFXDQ); 

            } else{

              _failedreason = failReason;
              ValidateField($(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr('id'), _failedreason, thisTileFXDQ); 

            }
          }   
          $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);
          $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
          $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true)        

        } 
        //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 
        else if(data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].bestPriceProvider.includes("FAIL")) {
        // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023
          // if(data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].errorMessage === null || 
          //   data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].errorMessage === ''){
        // End
              $(thisTileFXDQ).find('[id^="FXDQBanksRow"]').append("<td> - </td>");
              $(thisTileFXDQ).find('[id^="FXDQPrices"]').append("<td> - </td>");
              // Added by Atharva - Timers - START
              $(thisTileFXDQ).find('[id^="FXDQ_TimerRow"]').append("<td> - </td>");

            // LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 05 April 2023 - Start
            ValidateField($(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr("id"),"No response received from remote system." ,thisTileFXDQ);
           
            $(thisTileFXDQ).find('[id^="FXDRfqidpnl"]').show();
            $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html("");
            $(thisTileFXDQ).find('[id^="RFQIDFXD"]').html(data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].o_DCDRFQID);

            $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);
            $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
            $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true)   
            
           
        //   }else{

        //     failReason = data.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody[0].errorMessage; //LGTCLI-349 For Handling Failed Cases for best price | Chaitanya M | 29 March 2023 

        //     if(failReason.includes("Aborting further Migration")){

        //       _failedreason = failReason.replace(". Aborting further Migration for this record.","");    
        //       ValidateField($(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr('id'), _failedreason, thisTileFXDQ);    

        //     } else{

        //       _failedreason = failReason;
        //       ValidateField($(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr('id'), _failedreason, thisTileFXDQ); 

        //     }
        //   }   
        //   $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);
        //   $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
        //   $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true)     
        } 
        //End

      mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',false); // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
      $(thisTileFXDQ).find('[id*="btnBestPriceFXDQ"]').attr("disabled", false);  // LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023

      })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    $(thisTileFXDQ).find('[id^="loader_FXDQ"]').hide();
    $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);
    $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
    console.log(error.message());
    $(".lblError").html(error.message);
  } finally {
  }
}

//To Get BidAsk Rate and Currency Pair
function getCurrencyFXDQRate(currId) {
  try {
    thisTileFXDQ = document.getElementById("td" + currId);
    // Addded for CFINT-992 // 18-Sep-2020 //

    checkmetalccyflagFXDQ(currId,$(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val());   //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 16 Feb 2023

    $(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr("disabled", true);
    $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 17 Feb 2023
    $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", true);
    clearPricerTable(thisTileFXDQ);
 
     //LGTCLI-371 Select Ccy Should Auto Populate Spot & Strike|should not populate strikes for pivot|multiple calls | Chaitanya M | 03 April 2023
    $(thisTileFXDQ).find('[id^="hdnCcyDetailsFXDQ"]').val($(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val());
    //End

    //END
    request_getDataFromAPI(
      {
      
        "I_StandardPair": $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]')[0].value,
        "I_ProductCode": productCodeDQ,
        "currentTile": currId,
        "token":"",
        "EntityID": EntityID,
        "LoginID": userName,
        "ProductCode": productCodeDQ,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString()

      },
      clientConfigdata.CommonMethods.NodeServer + "GetFXRatesByCurrencyNode"
    )
      .then((data) => {
        thisTileFXDQ = document.getElementById("td" + data.currentTile);

        let responseHeader = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.Status;

        if(responseHeader.toUpperCase() == "SUCCESS"){
        $(thisTileFXDQ).find('[id^="hdnDecimalRateFXDQ"]').val(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.DecimalRate);
        AskRateFXO = numberWithCommas(Number(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.AskRate).toFixed(
          data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.DecimalRate)
        );
        BidRateFXO = numberWithCommas(Number(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.BidRate).toFixed(
            data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.DecimalRate
          )
        );

        $(thisTileFXDQ).find('[id^="rateFXDQ"]').html(BidRateFXO + " / " + AskRateFXO);
        
        //LGTCLI-310 | Chaitanya M | 23 feb 2023
        if(_addtileflag== true){
          $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val("");
          _addtileflag= false;
          $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]')[0].value = BidRateFXO; //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023

        } else if(_defaultflagGFXDQ==true){

          //LGTGTWINT-1778 KO rate should not auto populated on changing ccy pair || Chaitanya M | 31 March 2023
          //$(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]')[0].value =numberWithCommas((BidRateFXO.replace(/,/g, "") / 1.03).toFixed(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.DecimalRate));
          $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val("");
          //End
          $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]')[0].value = BidRateFXO; //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
          _defaultflagGFXDQ = false;
      //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023 -Start
        }else if (!_UpdateFlagFXDQ){

          _UpdateFlagFXDQ = false;
          // $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val("");//LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
           $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]')[0].value = BidRateFXO; //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023

        }else if(_UpdateFlagFXDQ){

          if($(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]').val() == ""){
            $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]')[0].value = BidRateFXO; 
          }
          _UpdateFlagFXDQ = false; 

        // End
        }else{
          $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val("");
        
        }        

        // Addded for CFINT-992 // 18-Sep-2020 //

        $(thisTileFXDQ).find('[id^="btnBestPriceFXDQ"]').attr("disabled", false);

        //END
        
        //Added By RizwanS for Option cut // JIRA ID- SCBUPINT-1102 // 15 Jul 2022

        OptionCutListFXDQ = setasyncOptioncutFXD(currId, $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val(), productIDFXDQ, productCodeDQ);

        fillDropdownlistControl(OptionCutListFXDQ, $(thisTileFXDQ).find('[id^="Optioncutddl"]').attr('id'));

        //END

        fillDatesFXDQ(
          $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val(),
          $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val(),
          $(thisTileFXDQ).find('[id^="NOSettlementinpboxFXDQ"]').val(),
          currId
        );

        fillFirstFixingDateFXDQ(
          $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val(),
          $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val(),
          currId
        );

      } else {

        let failReason = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.FailedReason; 
        
        ValidateField($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').attr('id'), failReason, thisTileFXDQ);

    }  
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message());
    $(".lblError").html(error.message());
  }
}

function setNDFMetalFlagDQ(
  currId,
  productIDFXDQ,
  productCodeDQ,
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
     
        let thisTileFXDQ = document.getElementById("td" + currId);  
        
        // Changed for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
        let _listCcyDQ = sessionStorage.getItem("CCYListFXDQ");
        let _listCcyFXDQ = JSON.parse(_listCcyDQ);        
        
        
        let fxDayBasis =
          _listCcyFXDQ.Pair_Tradable_Details[
            _listCcyFXDQ.Pair_Tradable_Details.findIndex(
              (res) => res.Asset_Pair == CcyPair
            )
          ].Asset2_Year_Basis;

        //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022

        $(thisTileFXDQ).find('[id^="hdnCcyPairDataDQ"]').val(
            JSON.stringify(
              _listCcyFXDQ.Pair_Tradable_Details[
              _listCcyFXDQ.Pair_Tradable_Details.findIndex(
                 (res) => res.Asset_Pair == CcyPair)
              ]
            )
          );

        let notionalddlId = '[id^="CcySelectionFXDQ"]';
        let hdnpairDataId = '[id^="hdnCcyPairDataDQ"]';
        let notioanlamtId = '[id^="ContractAmtFXDQ"]';

        checkDecimalPlaces(
          thisTileFXDQ,
          notionalddlId,
          hdnpairDataId,
          notioanlamtId
        );

        //END

        getNumberOfFixingDQ(
          currId,
          productIDFXDQ,
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
    console.log(error.message());
    $(".lblError").html(error.message());
  }
}

function getNumberOfFixingDQ(
  currId,
  productIDFXDQ,
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
       
        "EntityID" : EntityID,
        "LoginID":  userName,
        "token":"",
        "ProductCode": productCodeDQ,	
        "ProductID" : productIDFXDQ,	
        "CcyPair" : CcyPair,	
        "DayBasis": getfxDayBasis,	
        "DepoCcy" : DepoCcy,	
        "AltCcy" : AltCcy,			
        "FixingFreq" : setFrqFix,	
        "SettlementFreq" : SetSetlfrq,	
        "TradeDate" : setBusinessDate,	
        "PremiumDate" : getPremiumDate,	
        "FinalFixingDate" : getFinalFixingDate,	
        "SettlementDate" : getSettlementDate,	
        "currentTile": currId,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "OptionCut": $(thisTileFXDQ).find('[id^="Optioncutddl"]').val(),

      },
      clientConfigdata.CommonMethods.NodeServer + "GetNumberofFixings"
    )
      .then((data) => {
        let thisTileFXDQ = document.getElementById("td" + data.currentTile);
        let responseHeader = data.GetNumberofFixingsResult.A_ResponseHeader.Status;

        if(responseHeader.toUpperCase() == "SUCCESS"){
        $(thisTileFXDQ)
          .find('[id^="hdnFXDQNoOfFixingDate"]')
          .val(data.GetNumberofFixingsResult.FixingData.FirstFixingDate);

        $(thisTileFXDQ)
          .find('[id^="hdnFXDQNoOfFixings"]')
          .val(data.GetNumberofFixingsResult.FixingData.NoofFixings);

        $(thisTileFXDQ)
          .find('[id^="btnBestPriceFXDQ"]')
          .attr("disabled", false);
          
        } else {

          let failReason = data.GetNumberofFixingsResult.A_ResponseHeader.FailedReason; 
          
          // ValidateField($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').attr('id'), failReason, thisTileFXDQ);

          // Need to uncomment after no.of fixing issue resolved.

      } 

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message());
    $(".lblError").html(error.message());
  }
}
//END

// For DownloadDocgenPDF

function DownloadDocgenPDF(that) {
  try {
    GenerateTermsheet(that);
  } catch (er) {
    console.log(er.message);
  }
}

function viewScheduleFXDQ(that) {
  try {
    getBestPriceFXDQ(that, true);
  } catch (error) {
    console.log(error.message);
  }
}
//END

//Save Trade Start || 23 Dec 2022 || RijwanS || JIRA ID - LGTGTWINT-607 ||
function SaveTradeFXDQ(that){
  try{  

    booktradeFXDQ(that, true);

  }catch(er){

    console.log(er.message);

  }
}//END

//Book Trade
function booktradeFXDQ(that, RTDflag) {
  try {

    if (RTDflag) {

      TileId = that.id.match(/\d+$/)[0];
      thisTileFXDQ = document.getElementById("td" + TileId);
      $(thisTileFXDQ).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayFXDQ"); // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer

    }else{
 // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up 
      TileId = that.id.match(/\d+$/)[0];
      thisTileFXDQ = document.getElementById("td" + TileId);
      $(thisTileFXDQ).find('[id^="validatiionMsg"]').html("");
      booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayFXDQ");
//End
    }

  }catch(error){

    console.log(error.message);

  }
   
}//END

//Save to Dealer RFQ  || 23 Dec 2022 || RijwanS || JIRA ID - LGTGTWINT-607 ||
function SaveDealerRFQDQ(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXDQ = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    // Added by Atharva - Timers - START
    if ("td" + TileId in myInterval) {
      clearInterval(myInterval["td" + TileId]);
      delete myInterval["td" + TileId];
    }
    // END
    console.log("BookingFor ::", TileId, thisTileFXDQ, productName);
    $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023

    if (
      $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val() == "" ||
      $(thisTileFXDQ).find('[id^="FXDQPrices"]')[0].firstChild.innerHTML ==
        "-" ||
      $(thisTileFXDQ).find('[id^="FXDQPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        that,
        "booktradeFXDQ" + TileId,
        "Order Execution Failed!",
        "DivOverlayFXDQ"
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
        $(thisTileFXDQ).find('[id^="hdnPriceIndexFXDQ"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()
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

    mapleLoaderStart(thisTileFXDQ,'[id^="btnBookReqFXDQ"]',true);

    request_getDataFromAPI(
      {
      
        "EntityId": EntityID,
        "DCD_RFQId": dcdrfqid_val,
        "External_RFQId": $(thisTileFXDQ).find('[id^="hdnQuoteIDFXDQ"]').val(),
        "PriceProviderName":JSON.parse( $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[priceIndex].provider,
        "ProductCode": productCodeDQ,
        "CurrentTileID": TileId,
        "token":"",          
        "EntityID": EntityID,
        "LoginId": userName,
        "LoginID": userName,
        "Remark":$(thisTileFXDQ).find('[id^="inputRemark"]').val(),  // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString()

      },
      clientConfigdata.CommonMethods.NodeServer + "BookOrderFXProducts",
      "",
      "POST",
      thisTileFXDQ
    )
      .then((data) => {
        let thisTileFXDQ = document.getElementById("td" + data.CurrentTileID);
        TileId = data.CurrentTileID;
        let responseHeader = data.BookTradeAndGetExternalTradeNumberReqJSONResult.A_ResponseHeader.Status;

        if(responseHeader.toUpperCase() == "SUCCESS"){
        if (
          data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.DealNo == "" ||
          data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.DealNo == null
        ) {
          //LGTCLI-411 | FXD Rejected Trades Notifications | Chaitanya M | 17 April 2023
          //Start
          if(data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.isOrderRejected == true) { 

            var orderplaced = "Order rejected due to some technical reasons." ;
            ValidateField($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').attr('id'), orderplaced, thisTileFXDQ); 
            mapleLoaderStop(thisTileFXDQ,'[id^="btnBookReqFXDQ"]',true);
            return false;
    
          }else if(data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.isOrderRejected == false || 
            data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.External_TradeID == "" ||
            data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.External_TradeID == null ){
              var orderplaced =  "Order may have got executed or may have failed. Contact support." ;
              ValidateField($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').attr('id'), orderplaced, thisTileFXDQ);
              mapleLoaderStop(thisTileFXDQ,'[id^="btnBookReqFXDQ"]',true);
              return false;
            }else{
              var orderplaced = data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.Message;
              ValidateField($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').attr('id'), orderplaced, thisTileFXDQ);
              mapleLoaderStop(thisTileFXDQ,'[id^="btnBookReqFXDQ"]',true);
              return false;
            }    
            //End    
        } else {
          var orderno =
            data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.Message.split(
              ":"
            )[1];
          // Added by Atharva - Timers - START
          // Changed the provider name in message from bestpriceprovider to whichever the user has selected.
          var orderplaced =
            "Deal No." +
            data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.DealNo +
            "<br>" +
            "Order Placed Successfully with Counterparty " +
            JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[
              priceIndex
            ].provider + //JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[0].bestPriceProvider.split(":")[0]
            " and Order ID " +
            orderno;
        }
  
        // $(thisTileFXDQ).find('[id^="OrderBlotter"]').css({ display: "inline" });
        booktradePopup(
          that,
          "booktradeFXDQ" + TileId,
          orderplaced,
          "DivOverlayFXDQ"
        );

        $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val("");
        // Added by Atharva - START
        $(thisTileFXDQ)
          .find(".pricesRow")
          .children()
          .each(function () {
            $(this).find("button").attr("disabled", true);
          });
        $(thisTileFXDQ)
          .find(".banksNameRow")
          .children()
          .each(function () {
            $(this).find("button").attr("disabled", true);
          });
        $(thisTileFXDQ).find('[id^="BookTrade"]').attr("disabled", true);
        $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", true);
        $(thisTileFXDQ).find("[id^='pricesTimer']").html("");
        $(thisTileFXDQ)
          .find('[id^="pricesTimer"]')
          .css({ background: "transparent" });
        // END
      } else {

        let failReason = data.BookTradeAndGetExternalTradeNumberReqJSONResult.A_ResponseHeader.FailedReason; 
        
        ValidateField($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').attr('id'), failReason, thisTileFXDQ);
        $(thisTileFXDQ).find('[id^="btnBookReqFXDQ"]').attr("disabled", false);  // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023

    } 

    mapleLoaderStop(thisTileFXDQ,'[id^="btnBookReqFXDQ"]',true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(
      that,
      "booktradeFXDQ" + TileId,
      "Order Execution Failed!",
      "DivOverlayFXDQ"
    );
    mapleLoaderStop(thisTileFXDQ,'[id^="btnBookReqFXDQ"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}//END

// Save Route To Dealer RFQ || RijwanS || LGTGTWINT-607 || 26 Dec 2022
function SaveRouteToDealerRFQDQ(that) {
  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXDQ = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    // Added by Atharva - Timers - START
    if ("td" + TileId in myInterval) {
      clearInterval(myInterval["td" + TileId]);
      delete myInterval["td" + TileId];
    }
    // END
    console.log("Route to Dealer ::", TileId, thisTileFXDQ, productName);
    $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", false); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023

    if (
      $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val() == "" ||
      $(thisTileFXDQ).find('[id^="FXDQPrices"]')[0].firstChild.innerHTML ==
        "-" ||
      $(thisTileFXDQ).find('[id^="FXDQPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        that,
        "booktradeFXDQ" + TileId,
        "Order Execution Failed!",
        "DivOverlayFXDQ"
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
        $(thisTileFXDQ).find('[id^="hdnPriceIndexFXDQ"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);
    var jsonHdnPrices = JSON.parse(
      $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()
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

    mapleLoaderStart(thisTileFXDQ,'[id^="btnSaveTradeFX"]',true);

    request_getDataFromAPI(

      {

        "EntityID":EntityID,
        "DCDRFQID":dcdrfqid_val,
        "ProductCode":productCodeDQ,
        "LoginId":userName,
        "LoginID": userName,
        "NoteMasterId":JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[priceIndex].NoteMasterID,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "RMRemark":$(thisTileFXDQ).find('[id^="inputRemark"]').val(),
        "CurrentTileID": TileId,

      },
      clientConfigdata.CommonMethods.NodeServer + "SaveRouteToDealerRFQ",
      "",
      "POST",
      thisTileFXDQ
    )
      .then((data) => {
        let thisTileFXDQ = document.getElementById("td" + data.CurrentTileID);
        TileId = data.CurrentTileID;

        if(data.SaveRouteToDealerResult.RouteToDealer == true){

          var orderplaced = "RFQ " +
          " " + dcdrfqid_val + " " + "routed to dealing desk successfully."

        }else{

          var orderplaced = "Order Placement Failed."

        }
       
        // $(thisTileFXDQ).find('[id^="OrderBlotter"]').css({ display: "inline" });
        booktradePopup(
          that,
          "booktradeFXDQ" + TileId,
          orderplaced,
          "DivOverlayFXDQ"
        );

        $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val("");
        // Added by Atharva - START
        $(thisTileFXDQ)
          .find(".pricesRow")
          .children()
          .each(function () {
            $(this).find("button").attr("disabled", true);
          });
        $(thisTileFXDQ)
          .find(".banksNameRow")
          .children()
          .each(function () {
            $(this).find("button").attr("disabled", true);
          });

        $(thisTileFXDQ).find("[id^='pricesTimer']").html("");
        $(thisTileFXDQ)
          .find('[id^="pricesTimer"]')
          .css({ background: "transparent" });
        // END

        mapleLoaderStop(thisTileFXDQ,'[id^="btnSaveTradeFX"]',true);
        $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", false); // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
        $(thisTileFXDQ).find('[id*="btnemailquote"]').attr("disabled", false);


      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(
      that,
      "booktradeFXDQ" + TileId,
      "Order Execution Failed!",
      "DivOverlayFXDQ"
    );
    mapleLoaderStop(thisTileFXDQ,'[id^="btnSaveTradeFX"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

// Email Quote || RijwanS || LGTGTWINT-517  || 27 Dec 2022
function SendQuoteEmailDQ(that) {
  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXDQ = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
  

    console.log("email quote to ::", TileId, thisTileFXDQ, productName);

    if (
      $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val() == "" ||
      $(thisTileFXDQ).find('[id^="FXDQPrices"]')[0].firstChild.innerHTML ==
        "-" ||
      $(thisTileFXDQ).find('[id^="FXDQPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        thisTileFXDQ,
        "booktradeFXDQ" + TileId,
        "Email Quote Failed!!",
        "DivOverlayFXDQ"
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
        $(thisTileFXDQ).find('[id^="hdnPriceIndexFXDQ"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);

    var jsonHdnPrices = JSON.parse(
      $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()
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

    mapleLoaderStart(thisTileFXDQ,'[id^="btnemailquote"]',true);

    request_getDataFromAPI(

      {

        "EntityID": EntityID,
        "LoginID": userName,
        "LoginId": userName,
        "ProductCode": productCodeDQ,
        "NoteMasterId":JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[priceIndex].NoteMasterID,
        "ProductID":productIDFXDQ,
        "RFQID": dcdrfqid_val,
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "CurrentTileID": TileId,

      },
      clientConfigdata.CommonMethods.NodeServer + "SendQuoteEmailFXD",
      "",
      "POST",
      thisTileFXDQ
    )
      .then((data) => {
        let thisTileFXDQ = document.getElementById("td" + data.CurrentTileID);
        TileId = data.CurrentTileID;

        if (data.SendQuoteEmailResult.QuoteEmailSentYN == true) {

          var orderplaced = "Email Quote Sent Successfully."

        } else {

          var orderplaced = "Email Quote Failed."
         

        }
       
       
        booktradePopup(
          thisTileFXDQ,
          "booktradeFXDQ" + TileId,
          orderplaced,
          "DivOverlayFXDQ"
        );

        mapleLoaderStop(thisTileFXDQ,'[id^="btnemailquote"]',true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(
      thisTileFXDQ,
      "booktradeFXDQ" + TileId,
      "Email Quote Failed!",
      "DivOverlayFXDQ"
    );
    mapleLoaderStop(thisTileFXDQ,'[id^="btnemailquote"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

// Save Trade Idea || RijwanS || LGTGTWINT-608 || 28 Dec 2022
function SaveTradeIdeaFXDQ(that) {
  try {

    TileId = that.id.match(/\d+$/)[0];
    thisTileFXDQ = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr("id");  
    
    // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
    isSaveTradeIdeaFXDQ = false;
    var _modeFXDQ ="";
    if(isFXDDealer){
      _modeFXDQ = "SEN";
    }else{
      _modeFXDQ = "QEN"
    }
    
    //End

    console.log("Save Trade Idea for ::", TileId, thisTileFXDQ, productName);
    
    $(thisTileFXDQ).find('[id^="btnSaveTradeFX"]').attr("disabled", true);  // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023

    if (
      $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val() == "" ||
      $(thisTileFXDQ).find('[id^="FXDQPrices"]')[0].firstChild.innerHTML ==
        "-" ||
      $(thisTileFXDQ).find('[id^="FXDQPrices"]')[0].firstChild.innerHTML == ""
    ) {
      booktradePopup(
        thisTileFXDQ,
        "booktradeFXDQ" + TileId,
        "Save trade idea Failed!",
        "DivOverlayFXDQ"
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
        $(thisTileFXDQ).find('[id^="hdnPriceIndexFXDQ"]').val()
      );
    } else {
      priceIndex = 0;
    }
    console.assert(priceIndex >= 0);

    var jsonHdnPrices = JSON.parse(
      $(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val()
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

    mapleLoaderStart(thisTileFXDQ,'[id^="btnSaveTradeIdea"]',true);

    request_getDataFromAPI(

      {

        "EntityID": EntityID,
        "LoginID": userName,
        "ProductCode": productCodeDQ,
        "NoteMasterID":JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[priceIndex].NoteMasterID,
        "RFQID": dcdrfqid_val,
        "Remark":$(thisTileFXDQ).find('[id^="inputRemark"]').val(), // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "Mode": _modeFXDQ,  // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
        "CurrentTileID": TileId,

      },
      clientConfigdata.CommonMethods.NodeServer + "SaveTradeIdeaFXD",
      "",
      "POST",
      thisTileFXDQ
    )
      .then((data) => {
        let thisTileFXDQ = document.getElementById("td" + data.CurrentTileID);
        TileId = data.CurrentTileID;

        if (data.SaveTradeRecommendationResult.TradeIdeaSavedYN == true) {
          
          var orderplaced = "RFQ " + " " + dcdrfqid_val + " " + "marked as trade idea successfully."

        } else {

          var orderplaced = "Save trade idea Failed."

        }
       
        // $(thisTileFXDQ).find('[id^="OrderBlotter"]').css({ display: "inline" });
        booktradePopup(
          thisTileFXDQ,
          "booktradeFXDQ" + TileId,
          orderplaced,
          "DivOverlayFXDQ"
        );

        mapleLoaderStop(thisTileFXDQ,'[id^="btnSaveTradeIdea"]',true);

      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
    booktradePopup(
      thisTileFXDQ,
      "booktradeFXDQ" + TileId,
      "Save trade idea Failed !",
      "DivOverlayFXDQ"
    );
    mapleLoaderStop(thisTileFXDQ,'[id^="btnSaveTradeIdea"]',true);
    $(".lblError").html(error.message);
  } finally {
  }
}// END

// Added for calculating Max Leverage Notional ||LGTGTWINT-980 || Chaitanya M || 03 Feb 2023
function getMaxLevNotionalFXDQ(notionalamt, frequencynameDQ,settlementval, currId){
  try {

    thisTileFXDQ = document.getElementById("td" + currId);

    let leverageval = "";
    let maxlevnotional;   

    if (
      frequencynameDQ.includes("1Y") ||
      frequencynameDQ.includes("1N")
    ) {
      leverageval = 1;

    } else if (
      frequencynameDQ.includes("2Y") ||
      frequencynameDQ.includes("2N")
    ) {
      leverageval = 2;
    }
    notionalamt = parseFloat( $(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').val().replace(/,/g, ""));
    maxlevnotional = notionalamt * leverageval * settlementval;
    
    $(thisTileFXDQ).find('[id^="MaxLevFXDQ"]').val(maxlevnotional.toLocaleString("en-US")); //Changed for New UI || LGTGTWINT-980 || Chaitanya M || 04 Feb 2023     

  } catch (error) {
    console.log(error.message);
  }
}
//END

function confirmRtoDDQ(that) { // LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXDQ = document.getElementById("td" + TileId);

    $(thisTileFXDQ).find('[id^="validatiionMsg"]').html("");
    //// Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
    
    if(isSaveTradeIdeaFXDQ){

      SaveTradeIdeaFXDQ(that);
      closeremarkpopup(that);
      

    }else{
      
      if (isRM || isIA) { // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023, 
//LGTGTWINT-1954 || RizwanS || 03 May 2023
        if($(thisTileFXDQ).find('[id^="inputRemark"]').val() == "" || $(thisTileFXDQ).find('[id^="inputRemark"]').val() == undefined || $(thisTileFXDQ).find('[id^="inputRemark"]').val() == null){

          $(thisTileFXDQ).find('[id^="validatiionMsg"]').html("Please enter remark.");
          return false;
    
        } else{
    
          $(thisTileFXDQ).find('[id^="validatiionMsg"]').html("");
          SaveRouteToDealerRFQDQ(that);
          closeremarkpopup(that);
          
        }
      }else if(isFXDDealer) {

        SaveDealerRFQDQ(that);
        closeremarkpopup(that);

      }      
//End
    }    

  }catch(er){

    console.log(er.message);

  }

} //END

    //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 16 Feb 2023
function checkmetalccyflagFXDQ(currId,CcyPair){
  try {

    let thisTileFXDQ = document.getElementById("td" + currId);

    // Changed for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
    let _listCcyDQ = sessionStorage.getItem("CCYListFXDQ")
    let _CcyFXDQ = JSON.parse(_listCcyDQ); 

    if (
      _CcyFXDQ.Pair_Tradable_Details[_CcyFXDQ.Pair_Tradable_Details.findIndex((res) => res.Asset_Pair == CcyPair)].LCY_Type.toUpperCase() == "NDF" ||
      _CcyFXDQ.Pair_Tradable_Details[_CcyFXDQ.Pair_Tradable_Details.findIndex((res) => res.Asset_Pair == CcyPair)].RCY_Type.toUpperCase() == "NDF"
    ) {
      NDFFlagDQ = "Y";
      IsMetalDQ = "N";
      $(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').attr("disabled", false); // Added to check LCY_Type & RCY_Type // 10 Feb 2022
      isccymetalflagFXDQ =false; //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      $(thisTileFXDQ).find('[id^="FXDCCYiconFXDQ"]').removeClass("ccytoggle");//Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
    } else if (
      _CcyFXDQ.Pair_Tradable_Details[_CcyFXDQ.Pair_Tradable_Details.findIndex((res) => res.Asset_Pair == CcyPair)].LCY_Type.toUpperCase() == "METAL" || //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      _CcyFXDQ.Pair_Tradable_Details[_CcyFXDQ.Pair_Tradable_Details.findIndex((res) => res.Asset_Pair == CcyPair)].RCY_Type.toUpperCase() == "METAL"
    ) {
      NDFFlagDQ = "N";
      IsMetalDQ = "Y";
      $(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').attr("disabled", true); // Added to check LCY_Type & RCY_Type // 10 Feb 2022
      isccymetalflagFXDQ =true;  //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      $(thisTileFXDQ).find('[id^="FXDCCYiconFXDQ"]').addClass("ccytoggle");//Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
    
    } else {
      NDFFlagDQ = "N";
      IsMetalDQ = "N";
      $(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').attr("disabled", false); // Added to check LCY_Type & RCY_Type // 10 Feb 2022
      isccymetalflagFXDQ =false;   //Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
      $(thisTileFXDQ).find('[id^="FXDCCYiconFXDQ"]').removeClass("ccytoggle");//Added for metair pairs ccytoggle disable | LGTCLI-311 | Chaitanya M | 15 Feb 2023
    }

  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error.message());
  }
}

//End

 // Added by Chaitanya M | 15 march 2023 | For LGTCLI-340 Instant Pricer Remarks Pop Up
function AddremarkFXDQ(that) {  
  try { 
    TileId = that.id.match(/\d+$/)[0];
    $(thisTileFXDQ).find('[id^="validatiionMsg"]').html("");
    isSaveTradeIdeaFXDQ=true;
    booktradePopup(that,"remarkFXD" + TileId,"","DivOverlayFXDQ");    

  }catch(er){

    console.log(er.message);

  }

} //END

// LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 17 Apr 2023
// Start
function GetContractSummaryFXDQ(that){
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFXDQ = document.getElementById("td" + TileId); 

    mapleLoaderStart(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',true);
     
    // Check for KIStyle
    if ($(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("1N") || $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("2N")) {
      KIStyleDQ = KIstyleArrDQ[0];
    } else if ($(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("01")) {
      KIStyleDQ = KIstyleArrDQ[1];
    } else if ($(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("02")) {
      KIStyleDQ = KIstyleArrDQ[2];
    } else if ($(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("12")) {
      KIStyleDQ = KIstyleArrDQ[3];
    }
    //End

    // Check For Leverage 
    let LeverageFXDQ = "";

    if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("1Y") ||
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("1N")
    ) {
      LeverageFXDQ = LeverageArrayDQ[0];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("2Y") ||
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("2N")
    ) {
      LeverageFXDQ = LeverageArrayDQ[1];
    }
    //End

    // Check For Settlement Freq.
    let SettFreqDQ = "";

    if ($(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("BABS")) {
      SettFreqDQ = FreqDQArr[0];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("DAMS")
    ) {
      SettFreqDQ = FreqDQArr[4];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("WAWS")
    ) {
      SettFreqDQ = FreqDQArr[2];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("MAMS")
    ) {
      SettFreqDQ = FreqDQArr[1];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("DAWS")
    ) {
      SettFreqDQ = FreqDQArr[3];
    }
    //End

    // Check fr KI 
    let KIYN = "";

    if ($(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("N")) {

      KIYN = "No"

    } else{

      KIYN = "Yes"

    }
    //End
    
    // Check for Alternate Ccy
    //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
  
    if(IsMetalDQ == "Y"){

      _AlternateCCyFXDQ = $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[1].trim();
      _InvccyFXDQ = $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim();

    }else{

      if( $(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').val() ==  $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[1].trim()){    
        
        _AlternateCCyFXDQ = $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim();
        _InvccyFXDQ = $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[1].trim();
        
      }else{

        _AlternateCCyFXDQ = $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[1].trim();
        _InvccyFXDQ = $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim();
  
      }    
       
    }  
    //End
    mapleLoaderStart(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',true);


    _notionalperfixingFXDQ = Number($(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').val().replace(/,/g, ""));

    _notionalFXDQ = _notionalperfixingFXDQ * $(thisTileFXDQ).find('[id^="NOSettlementinpboxFXDQ"]').val(); 


    // LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 28 Apr 2023
    if($(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').val()>0){

      GetGauranteePeriodsFXDQ(thisTileFXDQ,Number($(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').val()));

    }else{

      _GuaranteedPeriodsFXDQ = Number($(thisTileFXDQ).find('[id^="GauranteeFXDQ"]').val());
      _GuaranteedtillFXDQ = "";
    
    }
    //End

    //LGTGTWINT-1919 | Chaitanya M | 27 April 2023
    //Start
    if($(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val() > 0 || $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val() != null || $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val() != ""){
      _lowerbarrierFXDQ = Number($(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val());
  
    }else{
      _lowerbarrierFXDQ = 0;
    }
    //End

    request_getDataFromAPI(
      {       
        EntityID: Number(sessionStorage.getItem("HomeEntityID")),
        LoginID: sessionStorage.getItem("Username"),
        FXD_TOKEN: sessionStorage.getItem("FXD_Token").toString(),
        ProductCode: productCodeDQ.toUpperCase(),
        EntityID_: Number(sessionStorage.getItem("HomeEntityID")),
        TemplateCode: TemplateCodeFXDQ.toUpperCase(),
        producttype:productCodeDQ.toUpperCase(),
        BSdirection: "Sell",    
        ccypair: $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().trim(),
        OptionType: "Call", //LGTCLI-391 | Chaitanya M | 27 April 2023
        Invccy:_InvccyFXDQ, //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        AltNotionalCcy: _AlternateCCyFXDQ, //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        PremCcy: $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim(), //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        Notional: _notionalFXDQ, //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        notionalperfixing : _notionalperfixingFXDQ, //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        Tenor : $(thisTileFXDQ).find('[id^="hdnFXDQTenorCode"]').val(),
        Expiry:$(thisTileFXDQ).find('[id^="hdnFXDQExpiry"]').val(),
        settlement:$(thisTileFXDQ).find('[id^="hdnFXDQDeliveryDate"]').val(),
        LongDate: "", 
        shortDate: "",
        Strike:Number($(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]').val()),
        OptionCut: $(thisTileFXDQ).find('[id^="Optioncutddl"]').val(),
        BarrierType:"",
        ExoticCode:"",
        DigitalType:"",
        UpperBarrier:0,
        LowerBarrier:_lowerbarrierFXDQ, //LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        LeverageFactor: Number(LeverageFXDQ),
        noofsett: Number($(thisTileFXDQ).find('[id^="NOSettlementinpboxFXDQ"]').val()),
        nooffixings: Number($(thisTileFXDQ).find('[id^="NOSettlementinpboxFXDQ"]').val()), 
        FixingFrequency:SettFreqDQ,  
        settfrequency: SettFreqDQ,
        LowerStrike:0,
        UpperStrike:0,
        pivotstrike:0,
        SpreadType: "",
        customerpremdir: "", 
        IBPremDir: "",
        IBPrem:0,
        RTC:0,
        IBPremperc:0, 
        RTCPerc:0,
        Target:0,
        TargetNotional:0, 
        KIStyle: KIYN,
        LowerKI: 0,
        UpperKI:0,
        Guaranteedtill: _GuaranteedtillFXDQ,     // LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 28 Apr 2023
        GuaranteedPeriods:_GuaranteedPeriodsFXDQ,    // LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 28 Apr 2023
        CappedLossCcy:"",
        CappedLossType:"", 
        CappedLoss:"",
        CappedLossAmt:0,
        TargetBigFigure: "",
        Targetgainunit: "",
        TargetinPips: 0,
        KOITMEvent: 0,
        Striptype: "",
        FirstFixingDate: $(thisTileFXDQ).find('[id^="FirstFixDate"]').val(),
        FinalPayType:"",//LGTGTWINT-1921 | Chaitanya M | 27 April 2023
        FixingAdjustment:"",//LGTGTWINT-1921 | Chaitanya M | 27 April 2023
      },
      clientConfigdata.CommonMethods.NodeServer + "GetContractSummary_IP").then((data) => { 
      
        if(data.GetContractSummaryResult.A_ResponseHeader.Status == "Success"){ // LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 28 Apr 2023
        
        res =  data.GetContractSummaryResult.ContractSummary.toString().replaceAll("\\n", "<br>");  
       
        if(res.includes('color:green')){
          summary = res.toString().replaceAll("\color:green","color:var(--green) !important");
        }else{
          summary = res.toString().replaceAll("\color:red","color:var(--red) !important");
        }       
        
        
        $(thisTileFXDQ).find('[id^="ContractSummaryFXD"]').append(summary);
         
        summarytradePopup(that,"SummaryFXD" + TileId,res,"DivOverlayFXDQ");   
        
        mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',true); // LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 28 Apr 2023

      }else{
        mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',true); 
        let failReason = data.GetContractSummaryResult.A_ResponseHeader.FailedReason;           
        ValidateField($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').attr('id'), failReason, thisTileFXDQ);
      }
      }); 

  } catch (error) {
    mapleLoaderStop(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',true); 
    console.log(error.message);
  }
}

//End

// LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 28 Apr 2023
//Start
function GetGauranteePeriodsFXDQ(thisTileFXDQ,GuaranteedPeriodsFXDQ){
  try {    

    mapleLoaderStart(thisTileFXDQ,'[id^="btnBestPriceFXDQ"]',true);

    let ScheduleXML = "";
    let NoteMasterID ="";

    let SettFreqDQ = "";

    if ($(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("BABS")) {
      SettFreqDQ = FreqDQArr[0];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("DAMS")
    ) {
      SettFreqDQ = FreqDQArr[4];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("WAWS")
    ) {
      SettFreqDQ = FreqDQArr[2];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("MAMS")
    ) {
      SettFreqDQ = FreqDQArr[1];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("DAWS")
    ) {
      SettFreqDQ = FreqDQArr[3];
    }
    //End
    
    if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("1Y") ||
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("1N")
    ) {
      LeverageFXDQ = LeverageArrayDQ[0];
    } else if (
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("2Y") ||
      $(thisTileFXDQ).find('[id^="frequencyFXDQ"]').val().includes("2N")
    ) {
      LeverageFXDQ = LeverageArrayDQ[1];
    }
    
    if($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val() !=""){

      var isNonBestPrice = false;
      if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
        isNonBestPrice = true;
      } else {
        isNonBestPrice = false;
      }
    
      var priceIndex = -1;
      if (isNonBestPrice) {
        priceIndex = parseInt(
          $(thisTileFXDQ).find('[id^="hdnPriceIndexFXDQ"]').val()
        );
      } else {
        priceIndex = 0;
      }
     
      NoteMasterID = JSON.parse($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').val())[priceIndex].NoteMasterID;
      ScheduleXML="";

    }else{

      NoteMasterID="";
      ScheduleXML = "<ExcelSheets><Sheet1><Product_Name>" + ProductNameDQ +"</Product_Name>" +
      "<Hedging_x0020_Type>"+ clientConfigdata.FXDCommonMethods.Hedging_Type + "</Hedging_x0020_Type>"+
      "<CustID>"+ custID + "</CustID>" +
      "<Customer_Name>" + custName + "</Customer_Name>" +
      "<GuaranteedPeriods>"+ GuaranteedPeriodsFXDQ +"</GuaranteedPeriods>"+
      "<OptionCut>"+ $(thisTileFXDQ).find('[id^="Optioncutddl"]').val() + "</OptionCut>" +
      "<KO>" + $(thisTileFXDQ).find('[id^="barrieripboxFXDQ"]').val().replace(/,/g, "") +"</KO>" +
      "<FirstFixingDate>" +$(thisTileFXDQ).find('[id^="FirstFixDate"]').val() +"</FirstFixingDate>" +
      "<NonDeliveryYN>N</NonDeliveryYN>" +
      "<FixingSettFreq>" +SettFreqDQ +"</FixingSettFreq>" + 
      "<Currency1>" + $(thisTileFXDQ).find('[id^="CcySelectionFXDQ"]').val() +"</Currency1>" +
      "<CcyPair>" + $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().trim() +"</CcyPair>" +
      "<PremiumCcy>" + $(thisTileFXDQ).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim() +"</PremiumCcy>" +
      "<CustPrem>0.00</CustPrem>" + 
      "<BuySell>Sell</BuySell>" +
      "<Spotrate>" + $(thisTileFXDQ).find('[id^="rateFXDQ"]').html().split("/")[0].replace(/,/g, "").trim() +"</Spotrate>" +
      "<LeverageFactor>" + LeverageFXDQ +"</LeverageFactor>" +
      "<Ccy1PerFixing>" + $(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').val().replace(/,/g, "") +"</Ccy1PerFixing>" +
      "<Notional>"+ $(thisTileFXDQ).find('[id^="ContractAmtFXDQ"]').val().replace(/,/g, "") + "</Notional>" +
      "<NotionalType>Per Fixing</NotionalType>" +
      "<TradeDate>" + TradeDateFXDQ +"</TradeDate>" +
      "<PremiumDate>" + $(thisTileFXDQ).find('[id^="hdnFXDQPremiumDate"]').val() +"</PremiumDate>" +
      "<FixingDate>" + $(thisTileFXDQ).find('[id^="hdnFXDQExpiry"]').val() +"</FixingDate>" +
      "<SettDate>" + $(thisTileFXDQ).find('[id^="hdnFXDQDeliveryDate"]').val() +"</SettDate>" +
      "<TenorDays>" + $(thisTileFXDQ).find('[id^="hdnTenorDaysDQ"]').val() +"</TenorDays>" +
      "<Tenor>" + $(thisTileFXDQ).find('[id^="hdnFXDQTenorCode"]').val() +"</Tenor>" +
      "<Strike>" + $(thisTileFXDQ).find('[id^="strikeipboxFXDQ"]').val().replace(/,/g, "") +"</Strike>" +
      "<KIBarrierType></KIBarrierType><KI></KI><KIStyle></KIStyle>" +
      "<EntityID>" + sessionStorage.getItem("HomeEntityID") +"</EntityID>" +
      "<CAI_ID>" + clientConfigdata.FXDCommonMethods.CAI_ID +"</CAI_ID>" +
      "<NoofSett>" + $(thisTileFXDQ).find('[id^="NOSettlementinpboxFXDQ"]').val() +"</NoofSett>" +
      "</Sheet1>" +
      "</ExcelSheets>";

    }

    let requestObject = {
            
      EntityID: sessionStorage.getItem("HomeEntityID"),
      LoginID: sessionStorage.getItem("Username"),
      FXD_TOKEN: sessionStorage.getItem("FXD_Token").toString(),
      ProductCode: productCodeDQ.toUpperCase(),
      ExternalXMLString : ScheduleXML,
      NoteMasterID: NoteMasterID,
      TemplateCode: TemplateCodeFXDQ,
      TemplateID:TemplateIDFXDQ,
    
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
                // console.log(SampleObject[key]);
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
              _GuaranteedPeriodsFXDQ = GuaranteedPeriodsFXDQ;
              _GuaranteedtillFXDQ = '0';
          }else{
            _GuaranteedPeriodsFXDQ = GuaranteedPeriodsFXDQ;
            _GuaranteedtillFXDQ = VanillaArr[index].RS_Fixing_Date.toShortFormat();
          }

        }else{
         
          let failReason = data.ViewScheduleResult.A_ResponseHeader.FailedReason;           
          ValidateField($(thisTileFXDQ).find('[id^="hdnPricesFXDQ"]').attr('id'), failReason, thisTileFXDQ);
        
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