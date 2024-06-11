var token = "";
var shareCount;
var QuoteObject;
var CouponFreq;
var arrBEN = [];
var maxBEN;
var finalResponseDataBEN;
var finalTokenBEN;
var repriceObjectBEN;
var TimerBEN = 0;
var finalObjBEN;
var idBEN = 17;
var exchangeCodeArray = {
    "HKD": "HKG",
    "EUR": "GER",
    "AUD": "ASX",
    "SGD": "SGX",
    "CHF": "VTX",
    "USD": "NASDAQ",
    "KRW": "KSC",
    "JPY": "TYO",
    "GBP": "LSE"
}
var globalDefaultSharesArrayBEN = ["MSFT.OQ", "GOOGL.OQ"];  //LGTGTWINT-1723 Instant Pricer : Remove FB.OQ ticker from default notes payoff's.

// To load the BEN tile 
function onLoadBEN(currId,isProductCopiedBEN) {
    try {
        // Added logic for getting current tile //

        setDeafaultValuesBEN(currId,isProductCopiedBEN);
        thisTileBEN = document.getElementById("td" + currId);
        $(thisTileBEN).find('[id^="OverlayDiv"]').hide();

        
        sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        $(thisTileBEN).find('[id^="btnBestPriceBEN"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        // clearInterval($(thisTileBEN).find('[id^="hdnintervalID"]').val());  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileBEN,'[id^="btnBestPriceBEN"]', false);
        clearPricerTable(thisTileBEN);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileBEN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
        $(thisTileBEN).find('[id^="RFQIDEQC"]').html("");
        //End
        

        $(thisTileBEN).find("div.card input[type='text'],div.card input[type='search'],div.card select").on('change', function () {


            thisTileBEN = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileBEN).find('[id^="btnBestPriceBEN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileBEN).find('[id^="hdnintervalID"]').val());
            clearPricerTable(thisTileBEN); 
            $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
             
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileBEN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBEN).find('[id^="RFQIDEQC"]').html("");
            //End

            mapleLoaderStop(thisTileBEN,'[id^="btnBestPriceBEN"]', false);
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileBEN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileBEN).find('[id^="BookTradeBEN"]').attr("disabled", true);
            $(thisTileBEN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
            
         })
 
         $(thisTileBEN).find(" div.card .amtPopup").on('select', function () { // INT1FIN47-768 Gateway Markets Instant Pricing issue
 
            thisTileBEN = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileBEN).find('[id^="btnBestPriceBEN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileBEN).find('[id^="hdnintervalID"]').val()); 

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileBEN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBEN).find('[id^="RFQIDEQC"]').html("");
            //End

            $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            clearPricerTable(thisTileBEN);
            mapleLoaderStop(thisTileBEN,'[id^="btnBestPriceBEN"]', false);
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileBEN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileBEN).find('[id^="BookTradeBEN"]').attr("disabled", true);
             $(thisTileBEN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
          })


          //Start :: LGTGTWINT-2025 || RizwanS || 30 May 2023

          let benTypeArray =  [];
          let ddlBENTypeControl = $(thisTileBEN).find('[id^="ddlBENType"]')[0];
          let strType = "";
  
          if(BENKIYN.toUpperCase() === "YES"){
            benTypeArray =["Vanilla"];
          }else{
            benTypeArray =["Vanilla","European"];
          }
          for (let r of benTypeArray) {
              strType = strType + `<option style='color:var(--text)' value="${r}">${r}</option>`;  // Not visible until hover issue | Chaitanya M | 05 Oct 2023
          }
          $(ddlBENTypeControl).empty().append(strType);

          //END :: LGTGTWINT-2025 || RizwanS || 30 May 2023


        // Added to check KI Type & Add it's respective properties // 07-04-2020 //

        if ($(thisTileBEN).find('[id^="ddlBENType"]').val().trim() == "Vanilla") {

            $(thisTileBEN).find('[id^="kiinputbox"]').val("").prop("disabled", true);

        } else {
            $(thisTileBEN).find('[id^="kiinputbox"]').prop("disabled", false);
        }

        //END

        checkSolveForBEN($(thisTileBEN).find('[id^="ddlSolveFor"]').val(), thisTileBEN)  //Added for add tile isssue | LGTGTWINT-625 | Chaitanya M | 14 Feb 2023 
 
        
        //aded by rutika on 26/04/2022 for calculating tenor when changed in input box
         //Start

        $(thisTileBEN).find('[id^="tenor_BEN"]').on("change", function() {
            try {
             
                thisTileBEN = $(this).parents(".sorting")[0];
                let currId=   thisTileBEN.id.match(/\d+$/)[0];
// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileBEN,"btnBestPriceBEN");  
                $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val("");
                //End    
                
                if( $(thisTileBEN).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_BEN"]').val()) > Number(BENAllowedTenorinMonths) || $(this).parents(".sorting").find('[id^="tenor_BEN"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_BEN"]').val() == ""){
                        ValidateField($(thisTileBEN).find('[id^="tenor_BEN"]').attr("id"), "Please enter valid tenor.", thisTileBEN);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_BEN"]').val()) > Number(BENAllowedTenorinYears) || $(this).parents(".sorting").find('[id^="tenor_BEN"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_BEN"]').val() == ""){
                        ValidateField($(thisTileBEN).find('[id^="tenor_BEN"]').attr("id"), "Please enter valid tenor.", thisTileBEN);
                        return false;
                    }
                }

                // calculateTenor(currId);  // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023

            } catch (error) {
                console.log(error.message);
            }
        });

        $(thisTileBEN).find('[id^="tenorddl"]').on("change", function () {
            try {
                
                thisTileBEN = $(this).parents(".sorting")[0];
                let currId=   thisTileBEN.id.match(/\d+$/)[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                 sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileBEN,"btnBestPriceBEN"); 
                $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val("");
                //End

                if( $(thisTileBEN).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_BEN"]').val()) > Number(BENAllowedTenorinMonths)){
                        ValidateField($(thisTileBEN).find('[id^="tenor_BEN"]').attr("id"), "Please enter valid tenor.", thisTileBEN);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_BEN"]').val()) > Number(BENAllowedTenorinYears)){
                        ValidateField($(thisTileBEN).find('[id^="tenor_BEN"]').attr("id"), "Please enter valid tenor.", thisTileBEN);
                        return false;
                    }
                }

                  // calculateTenor(currId);  // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
               
            } catch (error) {
                console.log(error);
            }
        });

        // END


        // Added to Change/Select Solve for case & Add it's respective properties // 07-04-2020 //

        $(thisTileBEN).find('[id^="ddlSolveFor"]').on("change", function () {

            try {


                //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                if ($(this).parents('.sorting').find('[id^="ddlSolveFor"]').val() == "Conversion_Strike") {

                    $(this).parents('.sorting').find('[id^="strikeipbox"]').prop("disabled", true);
                    $(this).parents('.sorting').find('[id^="IBPriceinputbox"]').prop("disabled", false);
                    $(this).parents('.sorting').find('[id^="couponipbox"]').prop("disabled", false);
                    $(this).parents('.sorting').find('[id^="txtupfront"]').prop('disabled', false);

                    // checkupfrontPriceBEN(thisTileBEN); //LGTGTWINT-1095

                } else if ($(this).parents('.sorting').find('[id^="ddlSolveFor"]').val() == "Coupon") {

                    $(this).parents('.sorting').find('[id^="strikeipbox"]').prop("disabled", false);
                    $(this).parents('.sorting').find('[id^="IBPriceinputbox"]').prop("disabled", false);
                    $(this).parents('.sorting').find('[id^="couponipbox"]').prop("disabled", true);
                    $(this).parents('.sorting').find('[id^="txtupfront"]').prop('disabled', false);

                    // checkupfrontPriceBEN(thisTileBEN); //LGTGTWINT-1095

                } else if ($(this).parents('.sorting').find('[id^="ddlSolveFor"]').val() == "Price") {

                    $(this).parents('.sorting').find('[id^="strikeipbox"]').prop("disabled", false);
                    $(this).parents('.sorting').find('[id^="IBPriceinputbox"]').prop("disabled", true);
                    $(this).parents('.sorting').find('[id^="couponipbox"]').prop("disabled", false);
                    $(this).parents('.sorting').find('[id^="txtupfront"]').prop('disabled', true);

                    // checkupfrontPriceBEN(thisTileBEN) //LGTGTWINT-1095
                }

                //End
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileBEN,"btnBestPriceBEN"); 
                $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val("");
                //End
            } catch (error) {
                console.log(error.message)
            }
        })

        // END
        EQProductsFillCcy(thisTileBEN, "CCY_BEN_ddl");

        // Added to Change/Select KI type & Add it's respective properties // 06-04-2020 //

        $(thisTileBEN).find('[id^="ddlBENType"]').on("change", function () {
            try {
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileBEN,"btnBestPriceBEN");  
                $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val("");
                //End
                if ($(this).parents('.sorting').find('[id^="ddlBENType"]').val() == "Vanilla") {

                    $(this).parents('.sorting').find('[id^="kiinputbox"]').val("").prop("disabled", true);

                } else if ($(this).parents('.sorting').find('[id^="ddlBENType"]').val() == "European") {

                    $(this).parents('.sorting').find('[id^="kiinputbox"]').val("65.00").prop("disabled", false);
                }
            } catch (error) {
                console.log(error.message)
            }
        })

        //END

         // Check for upfront/IB Price 

         $(thisTileBEN).find('[id^="txtupfront"]').on("change", function() {
            try {
             
            thisTileBEN = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileBEN,"btnBestPriceBEN"); 
            $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val("");
            //End

            if(BENUpfrontYN.toUpperCase() != "YES" || !BENUpfrontYN.toUpperCase().includes("Y")){

                let _ibprice =   parseFloat(100 -  Number($(thisTileBEN).find('[id^="txtupfront"]').val())).toFixed(2);;

                $(thisTileBEN).find('[id^="IBPriceinputbox"]').val(_ibprice);
            }

            } catch (error) {
                console.log(error.message);
            }
        });

        $(thisTileBEN).find('[id^="IBPriceinputbox"]').on("change", function() {
            try {
             
            thisTileBEN = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileBEN,"btnBestPriceBEN");   
            $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val("");
            //End

            if(BENUpfrontYN.toUpperCase() != "YES" || !BENUpfrontYN.toUpperCase().includes("Y")){

                let _upfront =  parseFloat(100 -  Number($(thisTileBEN).find('[id^="IBPriceinputbox"]').val())).toFixed(2);

                $(thisTileBEN).find('[id^="txtupfront"]').val(_upfront);

            }

            } catch (error) {
                console.log(error.message);
            }
        });

        // END

        shareCount = 0;
        $(thisTileBEN).find('[id^="shareDivBEN"]').click(function () {
            $(this).find('input[type="search"]').focus();
        });


        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        //Start      
        $(thisTileBEN).find('div.card .ddlShares').on("focusout", function (){      
                                             
            validatesharebasket(thisTileBEN,"shareNameBEN" );        
            sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileBEN,"btnBestPriceBEN"); 
            $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023          
            $(thisTileBEN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileBEN).find('[id^="BookTradeBEN"]').attr("disabled", true);
            $(thisTileBEN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        $(thisTileBEN).find("div.card .ddlShares").on("keydown", function(){

            $("#bodyDiv").hide();  
            //Added for LGTGTWINT-1292 | Chaitanya M | 28 Feb 2023
            _ccylistBEN = getExchangeAndCcyFromBasket($(thisTileBEN).find('[id^="shareDivBEN"]')[0], 'share');
            if(_ccylistBEN.length >=4){
                return false;
            } 
            sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileBEN,"btnBestPriceBEN"); 
            $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val(""); // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileBEN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileBEN).find('[id^="BookTradeBEN"]').attr("disabled", true);             
            $(thisTileBEN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
        }); 


        //Added for LGTGTWINT-1077 Instant Pricing: Input length for all fields for all payoffs | Chaitanya M | 28-01-2023
        $(thisTileBEN).find('[id^="tenor_BEN"]').on("keyup", function (){           

             InputLengthCheckEQC(thisTileBEN, "tenor_BEN", 3);
        });

        $(thisTileBEN).find("[id^='strikeipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileBEN, "strikeipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileBEN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBEN).find('[id^="RFQIDEQC"]').html("");
            //End
        });

        $(thisTileBEN).find("[id^='txtupfront']").on("keyup", function(){
             InputLengthCheckEQC(thisTileBEN, "txtupfront",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
        
        });

        $(thisTileBEN).find("[id^='kiinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileBEN, "kiinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
             //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileBEN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBEN).find('[id^="RFQIDEQC"]').html("");
            //End
        });
        $(thisTileBEN).find("[id^='couponipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileBEN, "couponipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
             //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            //  $(thisTileBEN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
             $(thisTileBEN).find('[id^="RFQIDEQC"]').html("");
             //End
        
        });
        $(thisTileBEN).find("[id^='IBPriceinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileBEN, "IBPriceinputbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
        
        });

        //Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
        $(thisTileBEN).find('[id^="ContractAmtBEN"]').on("change", function(){
        // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileBEN,"btnBestPriceBEN"); 
            $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val("");
            //End
            if($(thisTileBEN).find('[id^="ContractAmtBEN"]').val()== "" || $(thisTileBEN).find('[id^="ContractAmtBEN"]').val()==null || $(thisTileBEN).find('[id^="ContractAmtBEN"]').val()=="0" ){
              $(thisTileBEN).find('[id^="ContractAmtBEN"]').val("0"); 
            }    
            return false;         
          }); 

        //End


   

    } catch (error) {
        console.log(error.message)
    }
}

//Added for add tile isssue | LGTGTWINT-625 | Chaitanya M | 14 Feb 2023
function checkSolveForBEN(solveFor,thisTileBEN,calledFromIndexBEN) {
    try {
        if (calledFromIndexBEN != undefined){
            if (solveFor.trim().includes("Conversion_Strike")) {
                    
                $(thisTileBEN).find('[id^="strikeipbox"]').prop("disabled", true);
                $(thisTileBEN).find('[id^="IBPriceinputbox"]').prop("disabled", false);
                $(thisTileBEN).find('[id^="couponipbox"]').prop("disabled", false);
                $(thisTileBEN).find('[id^="txtupfront"]').prop('disabled', false);
       
            } else if (solveFor.trim().includes("Price")) {
                $(thisTileBEN).find('[id^="strikeipbox"]').prop("disabled", false);
                $(thisTileBEN).find('[id^="IBPriceinputbox"]').prop("disabled", true);
                $(thisTileBEN).find('[id^="couponipbox"]').prop("disabled", false);
                $(thisTileBEN).find('[id^="txtupfront"]').prop('disabled', true);
                      
            } else if (solveFor.trim().includes("Coupon") ) {
                $(thisTileBEN).find('[id^="strikeipbox"]').prop("disabled", false);
                $(thisTileBEN).find('[id^="IBPriceinputbox"]').prop("disabled", false);
                $(thisTileBEN).find('[id^="couponipbox"]').prop("disabled", true);
                $(thisTileBEN).find('[id^="txtupfront"]').prop('disabled', false);
    
            }
        }
        else {
            if (solveFor.trim().includes("Conversion_Strike")) {
              
               $(thisTileBEN).find('[id^="strikeipbox"]').prop("disabled", true);
                $(thisTileBEN).find('[id^="IBPriceinputbox"]').prop("disabled", false);
               $(thisTileBEN).find('[id^="couponipbox"]').prop("disabled", false);
              $(thisTileBEN).find('[id^="txtupfront"]').prop('disabled', false);
             
            } else if (solveFor.trim().includes("Price")) {
                $(thisTileBEN).find('[id^="strikeipbox"]').prop("disabled", false);
                $(thisTileBEN).find('[id^="IBPriceinputbox"]').prop("disabled", true);
                $(thisTileBEN).find('[id^="couponipbox"]').prop("disabled", false);
                $(thisTileBEN).find('[id^="txtupfront"]').prop('disabled', true);
                 
            } else if (solveFor.trim().includes("Coupon")) {
                $(thisTileBEN).find('[id^="strikeipbox"]').prop("disabled", false);
                $(thisTileBEN).find('[id^="IBPriceinputbox"]').prop("disabled", false);
                $(thisTileBEN).find('[id^="couponipbox"]').prop("disabled", true);
                $(thisTileBEN).find('[id^="txtupfront"]').prop('disabled', false);
             
            }
        }
             
        } catch (error) {
            console.log(error.message)
        }
}

function checkupfrontPriceBEN(thisTileBEN){

    try
    {

        let _ibprice =   parseFloat(100 -  Number($(thisTileBEN).find('[id^="txtupfront"]').val())).toFixed(2);;

        $(thisTileBEN).find('[id^="IBPriceinputbox"]').val(_ibprice);
    
        let _upfront =  parseFloat(100 -  Number($(thisTileBEN).find('[id^="IBPriceinputbox"]').val())).toFixed(2);
    
        $(thisTileBEN).find('[id^="txtupfront"]').val(_upfront);

    }catch(er){
        
        console.log(er.message);

    }   
    

}

// To set default values for BEN
function setDeafaultValuesBEN(currId,isProductCopiedBEN) {
    try {
        // Added logic for getting current tile //

        thisTileBEN = document.getElementById("td" + currId);

          //Configured UI fileds Start :: || 08 Feb 2023

          if(BENUpfrontYN.toUpperCase() == "YES" || BENUpfrontYN.toUpperCase().includes("Y")){

            $(thisTileBEN).find('[id^="txtupfront"]').val("0.00"); //LGTGTWINT-1095
            $(thisTileBEN).find('[id^="txtupfront"]').hide(); //UI filed
            $(thisTileBEN).find('[id^="upfrontuilbl"]').hide(); //UI label
            $(thisTileBEN).find('[id^="txtupfrontlbl"]').hide(); // hide label order popup
            $(thisTileBEN).find('[id^="txtupfrontVal"]').hide(); //Order popup filed
            
        }else{
            $(thisTileBEN).find('[id^="txtupfront"]').val("0.00");
        }

        // END

        $(thisTileBEN).find('[id^="ContractAmtBEN"]').val("1,000,000.00");
        $(thisTileBEN).find('[id^="ContractAmtBEN"]').attr('maxlength','14');
        $(thisTileBEN).find('[id^="strikeipbox"]').val("85.00");
        $(thisTileBEN).find('[id^="couponipbox"]').val("8.00");
        $(thisTileBEN).find('[id^="kiinputbox"]').val("65.00");
        $(thisTileBEN).find('[id^="tenor_BEN"]').val("6");
        $(thisTileBEN).find('[id^="IBPriceinputbox"]').val("99.00");
        callDropDownFunction($(thisTileBEN).find('[id^="shareName"]'), "BEN", currId);
        clearPricerTable(thisTileBEN);
        $(thisTileBEN).find('[id^="shareNameCntrlBEN"]').html("");
        $(thisTileBEN).find('[id^="hiddenshareinputBEN"]').html("");
        $(thisTileBEN).find('[id^="CCY_BEN"]').html("");
       
        if(!isProductCopiedBEN){
        for (let s=0;s<clientConfigdata.EQCBEN.MinSharesInBaskets;s++){
            createElementInBasket(thisTileBEN, 'shareDivBEN', sessionStorage.getItem(thisTileBEN.id)!=undefined?sessionStorage.getItem(thisTileBEN.id).split(" ")[s]:globalDefaultSharesArrayBEN[s]); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
       
        }
    }
        $(thisTileBEN).find('[id^="shareName"]')[0].placeholder = "";
        $(thisTileBEN).find('[id^="CCY_BEN"]').html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);
    } catch (error) {
        console.log(error.message)
    }
}
var globalSolveForValueBEN='';
// To get best price for BEN
function getBestPriceBEN(that) {
    try {
        
         // var uniqueIntervalID;
         thisTileBEN = $(that).parents(".sorting")[0]; 

         console.log('Start Interval value =' + $(thisTileBEN).find('[id^="hdnintervalID"]').val());

         $(thisTileBEN).find('[id^="btnBestPriceBEN"]').attr("disabled", true); // INT1FIN47-768 Gateway Markets Instant Pricing issue

         var requestIDBEN = "";
 
         requestIDBEN = requestIDBEN + RequestIDGenerator(70);
 
         $(thisTileBEN).find('[id^="hdnRequestID"]').val(requestIDBEN);  //INT1FIN47-768 Gateway Markets Instant Pricing issue
         
         mapleLoaderStop(thisTileBEN,'[id^="btnBestPriceBEN"]', false);


        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileBEN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
        $(thisTileBEN).find('[id^="RFQIDEQC"]').html("");
        //End
 
         globalSolveForValueBEN = $(thisTileBEN).find('[id^="ddlSolveFor"]').val().trim();

         clearInterval($(thisTileBEN).find('[id^="hdnintervalID"]').val());

         console.log('After clear Interval value =' + $(thisTileBEN).find('[id^="hdnintervalID"]').val());
 
         $(thisTileBEN).find('[id^="hdnintervalID"]').val("");
        
        TileId = that.id.match(/\d+$/)[0];

        sessionStorage.setItem("poolingTimer_" + TileId, 0);
        sessionStorage.setItem("pricingToggle" + TileId, false);

        thisTileBEN = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        console.log(TileId, thisTileBEN, productName);
        $(thisTileBEN).find('[id^="TBLBEN"]' + " td").each(function () {
           
            $(this).html("-");
        })
        validation_clear(); 
        clearPricerTable(thisTileBEN);


        let tenorNumb = $(thisTileBEN).find("[id^='tenor_BEN']").val();
        let tenorstring = $(thisTileBEN).find("[id^='tenorddl']").val();
        let _tenor = tenorNumb + tenorstring;


        //  Client Side Validation Added for all cases // 07-April-2020
        if ($(thisTileBEN).find('[id^="shareDivBEN"]')[0].childNodes.length <= 1) {     
            ValidateField($(thisTileBEN).find('[id^="shareDivBEN"]').attr('id'), "Please Enter Valid Shares", thisTileBEN);
            return false
        } else if ($.trim($(thisTileBEN).find('[id^="ContractAmtBEN"]').val()) == '' || $.trim($(thisTileBEN).find('[id^="ContractAmtBEN"]').val()) < 0) {
          
            ValidateField($(thisTileBEN).find('[id^="ContractAmtBEN"]').attr('id'), "Please enter valid notional.", thisTileBEN); // LGTGTWINT-1487 | Chaitanya M | 24 Feb 2023
            return false

        } else if ($.trim($(thisTileBEN).find('[id^="tenor_BEN"]').val()) == '' || parseFloat($(thisTileBEN).find('[id^="tenor_BEN"]').val()) <=0) {
           
            ValidateField($(thisTileBEN).find('[id^="tenor_BEN"]').attr('id'), "Please Enter Valid Tenor", thisTileBEN);
            return false

        } else  if ((parseFloat($(thisTileBEN).find('[id^="kiinputbox"]').val()) == '' || parseFloat($(thisTileBEN).find('[id^="kiinputbox"]').val()) <= 0) && $(thisTileBEN).find('[id^="kiinputbox"]').prop('disabled') != true) {
           
            ValidateField($(thisTileBEN).find('[id^="kiinputbox"]').attr('id'), "Please Enter Valid KI (%) Initial.", thisTileBEN);
            return false

        }

        // RizwanS || LGTGTWINT-2320 || 17 Aug 2023
        if (NotionalMinMaxCheck === "YES") {
            if(parseFloat($(thisTileBEN).find('[id^="ContractAmtBEN"]').val().replace(/,/g, "")) === 0){     
                ValidateField($(thisTileBEN).find('[id^="hdnQuoteID"]').attr('id'),"Please input non zero notional.",thisTileBEN);
                return false;
            }
        }    
        //END 

        if ($(thisTileBEN).find('[id^="ddlSolveFor"]').val() == "Conversion_Strike") {

            if ((parseFloat($(thisTileBEN).find('[id^="IBPriceinputbox"]').val()) == '' || parseFloat($(thisTileBEN).find('[id^="IBPriceinputbox"]').val()) <= 0) || parseFloat($(thisTileBEN).find('[id^="IBPriceinputbox"]').val()) > 100) {
                ValidateField($(thisTileBEN).find('[id^="IBPriceinputbox"]').attr('id'), "Price % must be greater than 0 and less than 100", thisTileBEN);
                return false
            } else if (parseFloat($(thisTileBEN).find('[id^="couponipbox"]').val()) == '' || parseFloat($(thisTileBEN).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileBEN).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileBEN).find('[id^="couponipbox"]').attr('id'), "Please Enter Valid Coupon (%)", thisTileBEN);
                return false
            }

        } else if ($(thisTileBEN).find('[id^="ddlSolveFor"]').val() == "Coupon") {

            if (parseFloat($(thisTileBEN).find('[id^="strikeipbox"]').val()) == '' || parseFloat($(thisTileBEN).find('[id^="strikeipbox"]').val()) <= 0 || parseFloat($(thisTileBEN).find('[id^="strikeipbox"]').val()) > 100) {
                ValidateField($(thisTileBEN).find('[id^="strikeipbox"]').attr('id'), "Please Enter Valid Strike (%)", thisTileBEN);
                return false
            } else if ((parseFloat($(thisTileBEN).find('[id^="IBPriceinputbox"]').val()) == '' || parseFloat($(thisTileBEN).find('[id^="IBPriceinputbox"]').val()) <= 0)) {
                ValidateField($(thisTileBEN).find('[id^="IBPriceinputbox"]').attr('id'), "Price % must be greater than 0 and less than 100", thisTileBEN);
                return false
            }else if ($(thisTileBEN).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileBEN).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileBEN).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileBEN).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%)", thisTileBEN);
                return false;
            }

        } else if ($(thisTileBEN).find('[id^="ddlSolveFor"]').val() == "Price") {

            if (parseFloat($(thisTileBEN).find('[id^="strikeipbox"]').val()) == '' || parseFloat($(thisTileBEN).find('[id^="strikeipbox"]').val()) <= 0 || parseFloat($(thisTileBEN).find('[id^="strikeipbox"]').val()) > 100) {
                ValidateField($(thisTileBEN).find('[id^="strikeipbox"]').attr('id'), "Please Enter Valid Strike (%)", thisTileBEN);
                return false
            } else if (parseFloat($(thisTileBEN).find('[id^="couponipbox"]').val()) == '' || parseFloat($(thisTileBEN).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileBEN).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileBEN).find('[id^="couponipbox"]').attr('id'), "Please Enter Valid Coupon (%)", thisTileBEN);
                return false
            }else if ($(thisTileBEN).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileBEN).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileBEN).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileBEN).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%)", thisTileBEN);
                return false;
            }

        } 

          // Added by RizwanS for tenor validation before pricing || 03 Jan 2022 ||

          if( $(thisTileBEN).find('[id^="tenorddl"]').val() == "M"){

            if(Number($(thisTileBEN).find('[id^="tenor_BEN"]').val()) > Number(BENAllowedTenorinMonths)){
                ValidateField($(thisTileBEN).find('[id^="tenor_BEN"]').attr("id"), "Please enter valid tenor.", thisTileBEN);
                return false;
            }

        } else{

             if(Number($(thisTileBEN).find('[id^="tenor_BEN"]').val()) > Number(BENAllowedTenorinYears)){
                ValidateField($(thisTileBEN).find('[id^="tenor_BEN"]').attr("id"), "Please enter valid tenor.", thisTileBEN);
                return false;
            }
        }
        
        // END


        if ($(thisTileBEN).find('[id^="ddlBENType"]').val() != "Vanilla") {

            if ($(thisTileBEN).find('[id^="strikeipbox"]').prop('disabled') == false) {

                if ((parseFloat($(thisTileBEN).find('[id^="kiinputbox"]').val()) >= parseFloat($(thisTileBEN).find('[id^="strikeipbox"]').val()))) {
                    ValidateField($(thisTileBEN).find('[id^="kiinputbox"]').attr('id'), "KI% should be less than strike (%)", thisTileBEN);
                    return false
                }

            }
        }

        // END

        let _upfront = "";

        if(BENUpfrontYN.toUpperCase() != "YES" || !BENUpfrontYN.toUpperCase().includes("Y")){

           _upfront = $(thisTileBEN).find('[id^="txtupfront"]').val();

        }else{

            _upfront =  "0.00"; 
        }


        let exchangeListBEN = getExchangeAndCcyFromBasket($(thisTileBEN).find('[id^="shareDivBEN"]')[0], 'exchange');
        let ccyListBEN = getExchangeAndCcyFromBasket($(thisTileBEN).find('[id^="shareDivBEN"]')[0], 'ccy');
        let shareList = getExchangeAndCcyFromBasket($(thisTileBEN).find('[id^="shareDivBEN"]')[0], 'share');

        // Added ER_Quanto flag not getting updated for ELN, FCN and DRA in Instant pricer | LGTGTWINT-1448| Chaitanya M | 20 Feb 2023
        let _QuantoFlagBEN = "";

        uniqueCCY = ccyListBEN.filter((item, i, ar) => ar.indexOf(item) === i);
        if(uniqueCCY.length==1){
            if($(thisTileBEN).find('[id^="CCY_BEN_ddl"]').val()== uniqueCCY[0]){
                _QuantoFlagBEN = "No";
            } else{
                _QuantoFlagBEN = "Yes";
            }
        }else{
            _QuantoFlagBEN = "Yes";
        }
            //End


        // LGTGTWINT-1227 - Instant Pricing: EQC Ref missing for rfqs placed through instant pricing | 24 Feb 2023

        let _tenorBEN = ""

        if(tenorstring.toUpperCase().includes("M")){
        
            _tenorBEN= "MONTH";
        
        }else{
        
            _tenorBEN= "YEAR";
        }
        
        let getRefBEN = "";
        
        getRefBEN = getEQCRefrenceNumber(productName,"","",tenorNumb,_tenorBEN,($(thisTileBEN).find('[id^="ddlSolveFor"]').val() != "Coupon") ? $(thisTileBEN).find('[id^="couponipbox"]').val() : "",_QuantoFlagBEN,"Worst of");
        
        $(thisTileBEN).find('[id^="hdnRefnumber"]').val(getRefBEN); //LGTGTWINT-1589 Instant Pricing : EQC ref different on instant pricer and order details,quote mail and order mail

        // END
         mapleLoaderStart(thisTileBEN,'[id^="btnBestPriceBEN"]', false);

        QuoteObject = {

            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
            "UserID":sessionStorage.getItem("EQC_UserName").toString(),
            "Exchange1": exchangeListBEN[0],
            "UnderlyingCode1": shareList[0],//$(thisTileBEN).find('[id^="hiddeninputshareBEN"]')[0].value.split("~")[0],
            "Exchange2": exchangeListBEN[1],
            "UnderlyingCode2": shareList[1],//$(thisTileBEN).find('[id^="hiddeninputshareBEN"]')[0].value.split("~")[1],
            "Exchange3": exchangeListBEN[2],
            "UnderlyingCode3": shareList[2],//$(thisTileBEN).find('[id^="hiddeninputshareBEN"]')[0].value.split("~")[2],
            "Exchange4": exchangeListBEN[3],
            "UnderlyingCode4": shareList[3],
            "Ccy": $(thisTileBEN).find('[id^="CCY_BEN_ddl"]').val().trim(),// get from ddl
            "SolveFor": $(thisTileBEN).find('[id^="ddlSolveFor"]').val(),
            "Tenor": _tenor,
            "strikePerc": ($(thisTileBEN).find('[id^="ddlSolveFor"]').val() != "Conversion_Strike") ? $(thisTileBEN).find('[id^="strikeipbox"]').val() : "",
            "PricePerc": ($(thisTileBEN).find('[id^="ddlSolveFor"]').val() != "Price") ? $(thisTileBEN).find('[id^="IBPriceinputbox"]').val() : "",
            "CouponPerc": ($(thisTileBEN).find('[id^="ddlSolveFor"]').val() != "Coupon") ? $(thisTileBEN).find('[id^="couponipbox"]').val() : "",
            "KIPerc": ($(thisTileBEN).find('[id^="ddlBENType"]').val() != "Vanilla") ? $(thisTileBEN).find('[id^="kiinputbox"]').val() : "",
            "KIType": ($(thisTileBEN).find('[id^="ddlBENType"]').val() != "Vanilla") ? "European" : "",
            "Notional": $(thisTileBEN).find('[id^="ContractAmtBEN"]').val().replace(/,/g, "").split(".")[0],
            "Upfront": _upfront,
            "SettlementDays":$(thisTileBEN).find('[id^="SettlWeeks"]').val().trim(),
            "CurrentTileID": TileId,
            "requestID":$(thisTileBEN).find('[id^="hdnRequestID"]').val(), //INT1FIN47-768 Gateway Markets Instant Pricing issue
            "QuantoYN":_QuantoFlagBEN, // LGTGTWINT-1448| Chaitanya M | 20 Feb 2023
            "BuysideID": getRefBEN,
        }

        getQuoteBEN(QuoteObject, $(thisTileBEN).find('[id^="hdnintervalID"]')[0]);



    } catch (er) {
        console.log(er.message);

    }
}

// To get quote 
function getQuoteBEN(QuoteObject, uniqueIntervalID) {
    try {
        var dataBEN = request_getDataFromAPI(QuoteObject, clientConfigdata.CommonMethods.NodeServer + "getBestQuotesBEN45").then(dataBEN => {


            thisTileBEN = document.getElementById("td" + dataBEN.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataBEN.CurrentTileID, true);
            mapleLoaderStart(thisTileBEN,'[id^="btnBestPriceBEN"]', false); //INT1FIN47-768 Gateway Markets Instant Pricing issue
            getUniqQuoteResponseBEN(thisTileBEN, dataBEN, uniqueIntervalID,QuoteObject.requestID);

 
        }).catch(error => { console.log(error); })

    } catch (err) {
        console.log(err.message);
    }
}

function getUniqQuoteResponseBEN(thisTileBEN, dataBEN, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var UIID = null;
        // Added by Atharva - EQC Timers - START
        isTimerStarted["td" + dataBEN.CurrentTileID] = false;
        myCounter["td" + dataBEN.CurrentTileID] = {};
        hasUserClickedEQC["td" + dataBEN.CurrentTileID] = false;
       
        $(thisTileBEN).find('[id^="hdnSelectedBank"]').val("");
    
        // END
        uniqueIntervalID.value = setInterval(function () {

            if(reqestID != $(thisTileBEN).find('[id^="hdnRequestID"]').val() || $(thisTileBEN).find('[id^="hdnRequestID"]').val() ===""){ //RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                if($(thisTileBEN).find('[id^="hdnRequestID"]').val() ===""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    mapleLoaderStop(thisTileBEN,'[id^="btnBestPriceBEN"]', false); 
                }
                return false
            } // INT1FIN47-768 Gateway Markets Instant Pricing issue

            sessionStorage.setItem("quoteToken_" + thisTileBEN.id.match(/\d+$/)[0], "");
            sessionStorage.setItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0], "");

            sessionStorage.setItem("quoteToken_" + thisTileBEN.id.match(/\d+$/)[0], dataBEN['token']);
            sessionStorage.setItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0], dataBEN['responseData']);


            getFinalQuoteResponseBEN(sessionStorage.getItem("quoteToken_" + thisTileBEN.id.match(/\d+$/)[0]), sessionStorage.getItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]), thisTileBEN, uniqueIntervalID, reqestID);

        }, clientConfigdata.EQCBEN.PollInterval);

        console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
    } catch (error) {
        console.log(error)
    }
}

// To get price 
function getFinalQuoteResponseBEN(finalTokenBEN1, finalResponseDataBEN1, thisTileBEN, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var currentDateAndTime = new Date();

        sessionStorage.setItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0], finalResponseDataBEN1);

        sessionStorage.setItem("quoteToken_" + thisTileBEN.id.match(/\d+$/)[0], finalTokenBEN1);

        console.log("BEN RFQ's :: " + finalResponseDataBEN1 + " " + currentDateAndTime);

        Timer = Timer + 1;


        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileBEN.id.match(/\d+$/)[0])) >= Number(BENrequestCount.toString().split(".")[0]) || sessionStorage.getItem("pricingToggle" + thisTileBEN.id.match(/\d+$/)[0]) == "false") { //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
            
            $(thisTileBEN).find('[id^="btnBestPriceBEN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval(uniqueIntervalID.value);
            mapleLoaderStop(thisTileBEN,'[id^="btnBestPriceBEN"]', false);
            QuoteObject = "";
            $(thisTileBEN).find('[id^="loader_BEN"]').hide();
           
            $("body").css("opacity", "");
            arrBEN = [];
            maxBEN = "";
            TimerBEN = 0;

            //Call Draw Graph
            // $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val(JSON.stringify(finalObjBEN));
            // if (finalObjBEN != null || finalObjBEN != undefined) {
               
            //     drawgraphBEN($(thisTileBEN).find('[id^="canvas"]').attr('id'));
            // }
            // INT1FIN47-768 Gateway Markets Instant Pricing issue

            return false;
        } else {
            var repriceObjectBEN = request_getDataFromAPI({
                "PPDetails": sessionStorage.getItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]),
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "UserID":sessionStorage.getItem("EQC_UserName").toString(),
                "CurrentTileID": thisTileBEN.id.match(/\d+$/)[0],
                //UserID:sessionStorage.getItem("FinIQUserID").toString(), // LGTGTWINT-2248 || RizwanS || 25 Jul 2023
            }, clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseBEN45").then(repriceObjectBEN => {

                thisTileBEN = document.getElementById("td" + repriceObjectBEN.CurrentTileID);
          
                
                if(reqestID != $(thisTileBEN).find('[id^="hdnRequestID"]').val() || $(thisTileBEN).find('[id^="hdnRequestID"]').val() ===""){ //RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    if($(thisTileBEN).find('[id^="hdnRequestID"]').val() ===""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    mapleLoaderStop(thisTileBEN,'[id^="btnBestPriceBEN"]', false);
                    }
                    return false
                } //INT1FIN47-768Gateway Markets Instant Pricing issue

                sessionStorage.setItem("poolingTimer_" + thisTileBEN.id.match(/\d+$/)[0], Number(sessionStorage.getItem("poolingTimer_" + thisTileBEN.id.match(/\d+$/)[0])) + 1);
                finalObjBEN = repriceObjectBEN['responseData'];

                // Sorted By Best Price LP'S
                finalObjBEN.sort(function (a, b) {
                  if (a.BENOUT === null || a.BENOUT == "" || a.BENOUT == "Timeout" ||  a.BENOUT.toUpperCase().trim() == "REJECTED" || a.BENOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return 1;
                    } else if (b.BENOUT === null || b.BENOUT == "" || b.BENOUT == "Timeout" || b.BENOUT.toUpperCase().trim() == "REJECTED" || b.BENOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return -1;
                    } else if (a.BENOUT === b.BENOUT) {
                        return 0;
                    }

                    if ($(thisTileBEN).find('[id^="ddlSolveFor"]').val() == "Coupon"){
                        return Number(a.BENOUT) > Number(b.BENOUT) ? -1 : 1;
                    }else
                    {
                         return Number(a.BENOUT) < Number(b.BENOUT) ? -1 : 1;
                    }

                });
                
                //Removed || LGTGTWINT-1981 || RizwanS || 12 May 2023
                $(thisTileBEN).find('[id^="hdnfinalTokenBEN"]').val(sessionStorage.getItem("quoteToken_" + thisTileBEN.id.match(/\d+$/)[0]));
                // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileBEN).find('[id^="btnEmailQuote"]').attr("disabled", false);
                $(thisTileBEN).find('[id^="BookTradeBEN"]').attr("disabled", false);
                $(thisTileBEN).find('[id^="OrderEmail"]').attr("disabled",false);//LGTGTWINT-1981 || RizwanS || 12 May 2023

                maxBEN = finalObjBEN[0].BENOUT;

                 //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M  | 20 March 2023
                 //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
                //  $(thisTileBEN).find('[id^="EQCRfqidpnl"]').show();
                //  $(thisTileBEN).find('[id^="RFQIDEQC"]').html("");
                //  $(thisTileBEN).find('[id^="RFQIDEQC"]').html(finalObjBEN[0].EP_ER_QuoteRequestId);
                 //end

                // END

                if (sessionStorage.getItem("pricingToggle" + thisTileBEN.id.match(/\d+$/)[0]) == "true") {
                    // Added by Atharva - EQC Timers - START
                    // every time in new request indexes might change so clearing.
                    var isNonBestPrice = false;
                    if(clientConfigdata.CommonMethods.NonBestPrice == "Y") {
                        isNonBestPrice = true;
                    }
                    else {
                        isNonBestPrice = false;
                    }
                    mapIndexToBank["td"+repriceObjectBEN.CurrentTileID] = {};
                    // END
                    //$(thisTileBEN).find('[id^="BENBanksRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    //$(thisTileBEN).find('[id^="BENPrices"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // Added by Atharva - EQC Timers - START
                    $(thisTileBEN).find('[id^="BENTimerRow"]').empty();
                    if(!hasUserClickedEQC["td"+repriceObjectBEN.CurrentTileID]) {
                        $(thisTileBEN).find('[id^="hdnSelectedBank"]').val("");
                    }
                    var itr = 0;
                    // END
                   //$(thisTileBEN).find('[id^="minMaxNotionalLimitRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023

                    //Check for best price count || LGTGTWINT-1981 || RizwanS || 12 May 2023
                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023
                    if (NotesBestPriceDisplayCount != "") { 
                        // LGTGTWINT-2018 - Prices to be displayed for EAM entity on MSP and IP only when the input notional falls within min max range of CPs || RizwanS || 24 May 2023
                        if(NotionalMinMaxCheck.toUpperCase() === 'YES' && parseFloat($(thisTileBEN).find('[id^="ContractAmtBEN"]').val().replace(/,/g, "")) > 0){ //RizwanS || LGTGTWINT-2153 || 27 Jun 2023
                                
                            let sliceCount = Number(NotesBestPriceDisplayCount); // Count to show best prices as per config set

                            let productname = $(thisTileBEN).find(".productName").attr("id");

                            let _minmaxObj = [];

                                for(i=0;i<finalObjBEN.length;i++){
            

                                    if(parseFloat($(thisTileBEN).find('[id^="ContractAmtBEN"]').val().replace(/,/g, "")) <= parseFloat(finalObjBEN[i].MaxNotional)
                                    && parseFloat($(thisTileBEN).find('[id^="ContractAmtBEN"]').val().replace(/,/g, "")) >= parseFloat(finalObjBEN[i].MinNotional)){
                                        
                                        _minmaxObj.push(finalObjBEN[i]);
            
                                    }
            
                                }

                            if(_minmaxObj.length <= 0){

                                $(thisTileBEN).find('[id^="btnEmailQuote"]').attr("disabled", true);
                                $(thisTileBEN).find('[id^="BookTradeBEN"]').attr("disabled", true);
                                $(thisTileBEN).find('[id^="OrderEmail"]').attr("disabled",true);
                                return false;
                            } 

                            finalObjBEN = sliceEQCbestprices(_minmaxObj,productname,sliceCount);
                            
                        } //END
                            
                    }
 
                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023
                    $(thisTileBEN).find('[id^="BENBanksRow"]').empty(); 
                    $(thisTileBEN).find('[id^="BENPrices"]').empty();
                    $(thisTileBEN).find('[id^="minMaxNotionalLimitRow"]').empty();
                    //END

                    bindRFQIDEQC(thisTileBEN,finalObjBEN); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023

                    $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val(JSON.stringify(finalObjBEN));

                    // END

                    $(finalObjBEN).each(function (i, elem) {
                        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
                        var priceClass = "GlowPrice_Red";
                        if (!glowFlag) {
                            priceClass = "noGlow";
                        }

                        
                        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                        // $(thisTileBEN).find('[id^="EQCRfqidpnl"]').show();
                        // $(thisTileBEN).find('[id^="RFQIDEQC"]').html(elem.ParentID);
                        //End

                        var str = "";
                        var str2 = "";
                        if (elem.PP_CODE != null) {
                            // Added by Atharva - EQC Timers - START
                            mapIndexToBank["td"+repriceObjectBEN.CurrentTileID][itr] = elem.PP_CODE;
                            if(elem.BENOUT != null && !isNaN(elem.BENOUT) && elem.BENOUT != "" && elem.BENOUT != "Rejected" && $(thisTileBEN).find('[id^="hdnSelectedBank"]').val() == "") {
                                $(thisTileBEN).find('[id^="hdnSelectedBank"]').val(elem.PP_CODE);
                            }
                            if (elem.PP_CODE == "CITI") {
                                if(isNonBestPrice) {
                                    if(elem.BENOUT != null && !isNaN(elem.BENOUT) && elem.BENOUT != "" && elem.BENOUT != "Rejected" && ($(thisTileBEN).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectBEN.CurrentTileID + "_" + itr + "'>" + "Citi" + "</button></td>";
                                    }
                                    else if(elem.BENOUT != null && !isNaN(elem.BENOUT) && elem.BENOUT != "" && elem.BENOUT != "Rejected") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectBEN.CurrentTileID + "_" + itr + "'>" + "Citi" + "</td>";
                                    }
                                    else {
                                        str = str + "<td>" + "Citi" + "</td>";
                                    }
                                }
                                else {
                                    str = str + "<td";
                                    if(itr == 0 && elem.BENOUT != null && !isNaN(elem.BENOUT) && elem.BENOUT != "" && elem.BENOUT != "Rejected") {
                                        str = str + " class='bestPriceStyle'"
                                    }
                                    str = str + ">Citi</td>";
                                }
                            } else {
                                if(isNonBestPrice) {
                                    if(elem.BENOUT != null && !isNaN(elem.BENOUT) && elem.BENOUT != "" && elem.BENOUT != "Rejected" && ($(thisTileBEN).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectBEN.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</button></td>";
                                    }
                                    else if(elem.BENOUT != null && !isNaN(elem.BENOUT) && elem.BENOUT != "" && elem.BENOUT != "Rejected") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectBEN.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</td>";
                                    }
                                    else {
                                        str = str + "<td>" + elem.PP_CODE + "</td>";
                                    }
                                }
                                else {
                                    str = str + "<td";
                                    if(itr == 0 && elem.BENOUT != null && !isNaN(elem.BENOUT) && elem.BENOUT != "" && elem.BENOUT != "Rejected") {
                                        str = str + " class='bestPriceStyle'"
                                    }
                                    str = str + ">" + elem.PP_CODE + "</td>";
                                }
                            }
                            // END
                            $(thisTileBEN).find('[id^="BENBanksRow"]').append(str);
                        } else {
                            str = str + "<td>--</td>"
                            $(thisTileBEN).find('[id^="BENBanksRow"]').append(str);
                        }
                        if (elem.BENOUT != null && !isNaN(elem.BENOUT) && elem.BENOUT != "" && elem.BENOUT != "Rejected") {
                            // Added by Atharva - EQC Timers
                            // Added new if condition
                            if(isNonBestPrice) {
                                if($(thisTileBEN).find('[id^="hdnSelectedBank"]').val() == elem.PP_CODE) {
                                    str2 = str2 + "<td class='priceBackground";

                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023
                                    if(parseFloat(elem.BENOUT).toFixed(2) <0){
                                        if(itr == 0) {
                                            str2 = str2 + " negativeprice";
                                        }
                                    }else{
                                        if(itr == 0) {
                                            str2 = str2 + " bestPriceStyle";
                                        }
                                    }
                                    // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                    str2 = str2 + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectBEN.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.BENOUT).toFixed(2) + " % </button></td>" 
                                    $(thisTileBEN).find('[id^="BENPrices"]').append(str2);
                                } else {
                                    str2 = str2 + "<td";
                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                    if(parseFloat(elem.BENOUT).toFixed(2) <0){
                                        if(itr == 0) {
                                            str2 = str2 + " class='negativeprice_nonbest'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton negativeprice_nonbest' onclick='setPriceEQC(this)' id='td" + repriceObjectBEN.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.BENOUT).toFixed(2) + " %</button></td>"
                                        $(thisTileBEN).find('[id^="BENPrices"]').append(str2);

                                    }else{
                                        if(itr == 0) {
                                            str2 = str2 + " class='bestPriceStyle'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectBEN.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.BENOUT).toFixed(2) + " %</button></td>"
                                        $(thisTileBEN).find('[id^="BENPrices"]').append(str2);
                                    }                                    
                                }
                            }
                            else {
                                str2 = str2 + "<td";
                                // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                if(parseFloat(elem.BENOUT).toFixed(2) <0){
                                    if(itr == 0) {
                                        str2 = str2 + " class='negativeprice_nonbest'";
                                    }
                                }else{
                                    if(itr == 0) {
                                        str2 = str2 + " class='bestPriceStyle'";
                                    }
                                }
                                // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                str2 = str2 + ">" + parseFloat(elem.BENOUT).toFixed(2) + " %</td>"; 
                                $(thisTileBEN).find('[id^="BENPrices"]').append(str2);
                            }
                        } else {
                            str2 = str2 + "<td>-</td>"
                            $(thisTileBEN).find('[id^="BENPrices"]').append(str2);
                        }
                 

                        itr++;
                        let strMinMaxNotionalLimit = '';
                        if (elem.PP_CODE != null) {
                            strMinMaxNotionalLimit = strMinMaxNotionalLimit + `<td style='font-size:12px !important;'>${K_M_B_Formatter(Number(elem.MinNotional))} / ${K_M_B_Formatter(Number(elem.MaxNotional))}</td>`;
                            $(thisTileBEN).find('[id^="minMaxNotionalLimitRow"]').append(strMinMaxNotionalLimit);
                        }
                        // END
                    });
                    // Added by Atharva - EQC Timers - START
                    // Should run only once
                    // if(!isTimerStarted["td" + repriceObjectBEN.CurrentTileID]) {
                    //     isTimerStarted["td" + repriceObjectBEN.CurrentTileID] = true;
                    //     startTimersEQC(repriceObjectBEN.CurrentTileID);
                    // }
                    // END
            }

            }).catch(error => {
                console.log(error);
                $(thisTileBEN).find('[id^="btnBestPriceBEN"]').attr("disabled", false); 
                clearInterval(uniqueIntervalID.value);
                mapleLoaderStop(thisTileBEN,'[id^="btnBestPriceBEN"]', false);
                uniqueIntervalID.value = "";
                $(thisTileBEN).find('[id^="OverlayDiv"]').hide();  // INT1FIN47-768 Gateway Markets Instant Pricing issue
                
                // $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val(JSON.stringify(finalObjBEN));
                // if (finalObjBEN != null || finalObjBEN != undefined) {
                //     // drawgraphBEN($(thisTileBEN).find('[id^="canvas"]').attr('id'));
                //     drawgraphBEN($(thisTileBEN).find('[id^="canvas"]').attr('id'));
                // }
                // INT1FIN47-768 Gateway Markets Instant Pricing issue
            })
            
            // END
        }
    } catch (error) {

        $(thisTileBEN).find('[id^="btnBestPriceBEN"]').attr("disabled", false); 
        sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        clearInterval(uniqueIntervalID.value);
        mapleLoaderStop(thisTileBEN,'[id^="btnBestPriceBEN"]', false); // INT1FIN47-768 Gateway Markets Instant Pricing issue

        uniqueIntervalID.value = ""
        $(thisTileBEN).find('[id^="BookTradeBEN"]').attr("disabled", false);
        // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
        $(thisTileBEN).find('[id^="btnEmailQuote"]').attr("disabled", true);
        $(thisTileBEN).find('[id^="BookTradeBEN"]').attr("disabled", true);
        $(thisTileBEN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023

        console.log("getFinalQuoteResponseBEN : " + error.message);
        

        // $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val(JSON.stringify(finalObjBEN));
        // if (finalObjBEN != null || finalObjBEN != undefined) {
        //     drawgraphBEN($(thisTileBEN).find('[id^="canvas"]').attr('id'));
        // }
        // sessionStorage.setItem("quoteToken_" + thisTileBEN.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileBEN.id.match(/\d+$/)[0]));
        // sessionStorage.setItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]));
        // INT1FIN47-768 Gateway Markets Instant Pricing issue

    } finally {
       
    }
}

// To book trade
function BooktradeBEN(that,suitabilityCheck,redirectOrder) { // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
    try {

        // startLoader();

        TileId = that.id.match(/\d+$/)[0];
        thisTileBEN = document.getElementById("td" + TileId);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        // Added by Atharva - EQC Timers - START
        clearPricesInterrupt["td" + TileId] = true;

        var selectedBankIndex = -1;
        var itr = 0;
        var isNonBestPrice = false;
        if(clientConfigdata.CommonMethods.NonBestPrice == "Y") {
            isNonBestPrice = true;
        }
        else {
            isNonBestPrice = false;
        }
        if(isNonBestPrice) {
            $(thisTileBEN).find('[id^="BENBanksRow"]').children().each(function() {
                if($(thisTileBEN).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
                    selectedBankIndex = itr;
                }
                itr++;
            });
        }
        else {
            selectedBankIndex = 0;
        }
        console.assert(selectedBankIndex != -1);
        if(selectedBankIndex == -1) {
            // endLoader();
            mapleOrderLoaderStop(thisTileBEN);
            return false;
        }
        // END

        let AllocationDetails=[];

        $(thisTileBEN).find("select.ChildrenddlBookingCenter").each(function(index, element){

            if ($(this).parent().prev().find(".childrenCheckBoxBooking")[0].checked) {

            AllocationDetails.push({

            "RMName": $(element).parent().parent().find('[id^="ddlRMName"]').val(),
            "CustBranch": element.value,
            "Notional":$(element).parent().parent().find('[id^="txtHeaderNotional"]').val().split('.')[0].replace(/\,/g, "")

            })

         }
        })

        // Added for upfront% in order blotter // JIRA ID - CFINT-905 // 20 Oct 2020 //

        // let marginBEN;
        
        // if ($(thisTileBEN).find('[id^="ddlSolveFor"]').val().trim() == "Conversion_Strike" || $(thisTileBEN).find('[id^="ddlSolveFor"]').val().trim() == "Coupon") {
        //     marginBEN = (100 -  parseFloat($(thisTileBEN).find('[id^="IBPriceinputbox"]').val()));
        // }
        // else {
        //     // Added by Atharva - EQC Timers
        //     // Replaced 0 with selectedBankIndex
        //     marginBEN = (100 - JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[selectedBankIndex].BENOUT);
        // }

        //END

        let limitPrice1 = "";
        let limitPrice2 = "";
        let limitPrice3 = "";
        let limitPrice4 = "";

        if($(thisTileBEN).find('[id^="ddlOrderTypeBEN"]').val().trim().toUpperCase() == "LIMIT"){

            if($(thisTileBEN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 0){

                limitPrice1 = $(thisTileBEN).find('[id^="txtLimitLevel"]').val().trim();

            }else if($(thisTileBEN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 1){

                 limitPrice2 = $(thisTileBEN).find('[id^="txtLimitLevel"]').val().trim();

            } else if($(thisTileBEN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 2){

                 limitPrice3 = $(thisTileBEN).find('[id^="txtLimitLevel"]').val().trim();
                 
            } else if($(thisTileBEN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 3){

                limitPrice4 = $(thisTileBEN).find('[id^="txtLimitLevel"]').val().trim();
                
            }            
        }

            //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

            let _confirmReason = "";

            if(selectedBankIndex>0){
    
                 if($(thisTileBEN).find('[id^="ddlNONBEST"]').val() != "NONBEST_CUSTOM"){
    
                     _confirmReason = $(thisTileBEN).find('[id^="ddlNONBEST"]').text();
         
                 }else{
         
                     _confirmReason =  $(thisTileBEN).find('[id^="txtNONBEST"]').val(); 
                     
                 }
    
            }
    
         // END

            // Added Chaitanya M | For checking the suitability reason | Ref:LGTGTWINT-603 | 12-Jan-2023
            let _reasonmsg ='';
            let _chkSuitability; //RizwanS || LGTGTWINT-2295 || 11 Aug 2023

            if(EQCSendSuitabilityRequestYN === "NO"){ //RizwanS || LGTGTWINT-2295 || 11 Aug 2023

                _chkSuitability = "NO";

            }else{ //RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                // Added for| Unable to place suitability order for all products | LGTGTWINT-1588 | Chaitanya M | 1 Mar 2023
                if ($(thisTileBEN).find('[id^="rbRowSuitabilityToggle"]')[0].checked) {
                    _chkSuitability = "NO";
                    if ($(thisTileBEN).find('[id^="ddlReason"]').val().trim().includes("SUTSKP_CUSTOM")) { // Added by RizwanS | JIRA-LGTGTWINT-1830
                        _reasonmsg = $(thisTileBEN).find('[id^="txtSpecifyReason"]').val();
                    }else{
                        _reasonmsg = $(thisTileBEN).find('[id^="ddlReason"]').val();
                    }
                }else{
                    _chkSuitability = "YES"; //RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                }
                //End
                
            }

// LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
        let orderMethodName = "";
        let bookObject = "";

        if(redirectOrder == true){

            orderMethodName = "redirectOrder";

            bookObject= {
           

               EntityID: sessionStorage.getItem("EQC_EntityID").toString(),
               orderQty: $(thisTileBEN).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
               type:$(thisTileBEN).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
               limitPrice1: limitPrice1,
               limitPrice2: limitPrice2,
               limitPrice3: limitPrice3,
               limitPrice4: limitPrice4,
               QuoteRequestId: JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId,
               loginUser: sessionStorage.getItem("EQC_UserName").toString(),
               margin: "0.00",
               clientPrice: "0.00",//(parseFloat(JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[selectedBankIndex].BENOUT) + parseFloat(100 - JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[0].BENOUT)).toFixed(2),
               yield: "",
               bookingBranch: $(thisTileBEN).find('[id^="ddlBookingBranch"]').val(),
               rmNameForOrderConfirmation: $(thisTileBEN).find('[id^="ddlRMName"]').val(),
               dealerNotificationEmailID: $(thisTileBEN).find('[id^="txtComment"]').val(),
               orderComment: $(thisTileBEN).find('[id^="txtComment"]').val(),
               confirmationReason: _confirmReason,
               advisoryReason: $(thisTileBEN).find('[id^="txtComment"]').val(),
               preTradeXml: preTradeXml,
               //chkSuitability:$(thisTileBEN).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
               chkSuitability:_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
               SuitabilityReason:_reasonmsg, // Added by RizwanS | JIRA-LGTGTWINT-1830
               EQC_TOKEN: sessionStorage.getItem("EQC_Token").toString(),
               token: sessionStorage.getItem("EQC_Token").toString(),
               AllocationDetails: AllocationDetails,
               CurrentTileID: TileId,
               UserRole : isEQCDealer === true ? 'Dealer' : isIA=== true ? 'IA' : 'RM' , // Added by RizwanS | JIRA-LGTGTWINT-1830
            
            }

            redirectYN = "";

        }else{

            orderMethodName = "BookOrderEQC45";
            bookObject= {
           
                "userName": sessionStorage.getItem("FinIQUserID").toString(),
                "token": "",
                "orderQuantity":$(thisTileBEN).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "OrderType":$(thisTileBEN).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
                "LimitPrice1": limitPrice1,
                "LimitPrice2": limitPrice2,
                "LimitPrice3": limitPrice3,
                "LimitPrice4": limitPrice4,
                "QuoteRequestId":JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId,
                "PoolID": "",
                "RedirectOrderID": "",
                "OrderComment":  $(thisTileBEN).find('[id^="txtComment"]').val(),
                "Margin": "0.00",//marginBEN,
                "Notional": $(thisTileBEN).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "ClientPrice": "0.00",//(parseFloat(JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[selectedBankIndex].BENOUT) + parseFloat(100 - JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[0].BENOUT)).toFixed(2),
                "ClientYield": "",
                "BookingBranch": $(thisTileBEN).find('[id^="ddlBookingBranch"]').val(),
                "RMEmailIdforOrderConfirm": "",
                "ConfirmReason":  _confirmReason, //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message
                "PreTradeXml": "",
                "AdvisoryReason": "",
                // "UserRole": _reasonmsg, // Added Chaitanya M | For checking the suitability reason | Ref:LGTGTWINT-603 | 12-Jan-2023
                "RMNameforOrderConfirm": $(thisTileBEN).find('[id^="ddlRMName"]').val(),
                "CustomerID": "",
                // "chkSuitability":$(thisTileBEN).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
                "chkSuitability":_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                "SuitabilityReason":_reasonmsg, // Added by RizwanS | JIRA-LGTGTWINT-1830
                "IntendedSpread": "",
                "AllocationDetails": AllocationDetails,
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": TileId,
                "UserRole" : isEQCDealer === true ? 'Dealer' : isIA=== true ? 'IA' : 'RM' , // Added by RizwanS | JIRA-LGTGTWINT-1830
            
            }

        }
 
        mapleOrderLoaderStart(thisTileBEN);

        request_getDataFromAPI(bookObject, clientConfigdata.CommonMethods.NodeServer + orderMethodName).then(bookObject => {

            // endLoader();

            thisTileBEN = document.getElementById("td" + bookObject.CurrentTileID);

            TileId = bookObject.CurrentTileID;

            let bookstring = bookObject['responseData']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
            
            let OrderStatus = bookObject['message']; // LGTGTWINT-1888 || RizwanS || 30 May 2023

            if (OrderStatus.toUpperCase() === clientConfigdata.EQCCommonMethods.EQC_BOOK_TRADE_RESPONSE_DETAILS.toUpperCase()) {

                // $(thisTileBEN).find('[id^="hdnBlotterURLBEN"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                // $(thisTileBEN).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradeEQBEN" + TileId, bookstring, "DivOverlayEQBEN");
                $(thisTileBEN).find('[id^="hdnfinalTokenBEN"]').val("");
                $(thisTileBEN).find('[id^="OverlayDiv"]').hide();
                clearPricerTable(thisTileBEN);
          
            } else{

                if(OrderStatus == "" || OrderStatus == null || OrderStatus==undefined){

                    OrderStatus = "Order Execution Failed!";
                }
                else if(OrderStatus.includes("Please select booking centers from same region")){ // LGTGTWINT-1888 || RizwanS || 30 May 2023

                    OrderStatus = "Please select booking centers from same region.";
                }

                booktradePopup(that, "booktradeEQBEN" + TileId, OrderStatus, "DivOverlayEQBEN");
                $(thisTileBEN).find('[id^="hdnfinalTokenBEN"]').val("");
                $(thisTileBEN).find('[id^="OverlayDiv"]').hide();
                clearPricerTable(thisTileBEN);
            }

             mapleOrderLoaderStop(thisTileBEN);
             sessionStorage.removeItem("quoteResponse_" + thisTileBEN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
             $(thisTileBEN).find('[id^="btnBestPriceBEN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue 
             clearInterval($(thisTileBEN).find('[id^="hdnintervalID"]').val());
             mapleLoaderStop(thisTileBEN,'[id^="btnBestPriceBEN"]', false);

            // Added by Atharva - EQC Timers - START
            $(thisTileBEN).find('[id^="BENPrices"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            $(thisTileBEN).find('[id^="BENBanksRow"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileBEN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileBEN).find('[id^="BookTradeBEN"]').attr("disabled", true);
            $(thisTileBEN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
            // END

            
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileBEN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBEN).find('[id^="RFQIDEQC"]').html("");
            //End

        }).catch(error => { console.log(error); })
    } catch (er) {
        console.log(er.message);
        booktradePopup(that, "booktradeEQBEN" + TileId, "Order may have got executed or may have failed. Contact support!", "DivOverlayEQBEN");
        $(thisTileBEN).find('[id^="loader_BEN"]').hide();
        // endLoader();
        mapleOrderLoaderStop(thisTileBEN);

    } finally {

    }
}

var dialogBoxBEN = null;
function emailQuoteBEN(that) {
    try {

        thisTileBEN= $(that).parents(".sorting")[0];
    
        let pricingRow = "";
        pricingRow = $(thisTileBEN).find("table.pricerTable .pricesRow")[0];
        mapleOrderLoaderStart(thisTileBEN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
    
        if (pricingRow.cells[0].innerText.trim().toString() === "-") {
          openValidationpopup('',"No price available for mailing!"); // Changed for Change quote mail validation from "Invalid Price" to "No price available for mailing!" | Ref: LGTGTWINT-1195 | Chaitanya M | 25-jan-2023
          return false;
        }

        //create email pop up here 
        let strEmail =``;
        let emailPriceStream =JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val());
        console.log('email price stream object ', emailPriceStream);

        // Added for Email Quotes popup label for strike, coupon and IB Pricer | Ref: LGTGTWINT-1134 | Chaitanya M | 25-jan-2023
        let BENsolveforvalue="";
        if(globalSolveForValueBEN =="Conversion_Strike"){
            BENsolveforvalue = " Strike (%)";
        }else if(globalSolveForValueBEN =="Coupon"){
            BENsolveforvalue = "  Coupon (%)";
        }else if(globalSolveForValueBEN =="Price"){
            BENsolveforvalue = " IB Price (%)";
        }
        //End
        strEmail=strEmail+`<table class='emailTable'><tr><td class='payOff_Features'>
        <input type='checkbox' class='chkBoxParent_Email_PPCode' onchange='emailParentCheckboxChanged(this)' >
        Issuer</td><td class='payOff_Features'>${BENsolveforvalue}</td></tr>`; // Changed for Email Quotes popup label for strike, coupon and IB Pricer | Ref: LGTGTWINT-1134 | Chaitanya M | 25-jan-2023

        for (let e of emailPriceStream){
            if(e.BENOUT.trim().toUpperCase()!=='REJECTED' && e.BENOUT.trim().toUpperCase()!=='' && e.BENOUT.trim().toUpperCase()!=='UNSUPPORTED' ){ // Changed the condition for handling Unsupported response | Ref: LGTGTWINT-1321 | Chaitanya M | 06 Feb 2023
                        strEmail=strEmail+`<tr><td style='width:40px;padding:15px'><input type='checkbox' class='chkBox_Email_PPCode'  onchange='emailChildrenCheckboxChanged(this)' > ${e.PP_CODE}</td><td style='width:40px;padding:15px'>${e.BENOUT}</td></tr>`;
            }else
            {
                // do nothing 
            }
        }
        strEmail=strEmail+`</table>`        

        // Added by Atharva - EQC Timers - START
        var selectedBankIndex = -1;
        var itr = 0;
        //End
        if(dialogBoxBEN===null)
        {
            dialogBoxBEN= $(thisTileBEN).find('[id^="emailDialog_BEN"]')[0];
            $(thisTileBEN).find('[id^="emailDialog_BEN"]').empty().append(strEmail);

            $(dialogBoxBEN).dialog({
                resizable: false,
                height: "auto",
                width: 320,
                modal: true,
                open: function (event, ui) { // Added for LGTGTWINT-1283 || Email popup on top change | Chaitanya M | 08 Feb 2023
                    $('.ui-widget.ui-widget-content').css('z-index',999);                    
                },     
                //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                close: function (event, ui){
                    mapleOrderLoaderStop(thisTileBEN);
                },      
                //End
                buttons: {
                    "Mail Quote": function() {
                        //mail single selected rfq 

                        //  $( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    
                        var Email_PPList =[];
                        var RFQIDList=[];
                        var __mailRFQ=[];
            
                        if($(document).find('.ui-dialog').find('[id^="emailDialog_BEN"]').find('.chkBox_Email_PPCode').length>0)
                        {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_BEN"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                                if(checkboxControl.checked){
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val()).filter(function(RFQ_OBJECT){
                                        return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                                        })
                                    )
                                }
                            })
                        }
                        if(Email_PPList.length>0){
                            console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);

                            for(let R of RFQIDList){
                                __mailRFQ.push(R[0].EP_ER_QuoteRequestId);
            
                            }
                            // return true;    
                        }

                        if ($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val() != undefined && $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val().trim()!='')
                        var RFQID = JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;
            
                        if (RFQID != undefined && RFQID != ''){
                            // MailBestQuote(thisTileBEN.id.match(/\d+$/)[0], JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[0].EP_ER_QuoteRequestId);
                        
                            if(__mailRFQ == ""){

                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileBEN, "booktradeEQDRA" + thisTileBEN.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayEQDRA");
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            }

                            $( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileBEN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                                "rfqId":__mailRFQ.toString(), //RFQID,
                                "CurrentTileID":thisTileBEN.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType:"English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileBEN = document.getElementById("td" +TileId);
                                mapleOrderLoaderStop(thisTileBEN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                booktradePopup(thisTileBEN, "booktradeEQBEN" + TileId, data.message, "DivOverlayEQBEN");
                            
                            }).catch(error=>{
                            console.log(error);
                        
                            })
                        }
                        else{
                            mapleOrderLoaderStop(thisTileBEN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('','Invalid RFQ ID ');
                        }
             
                    },
                    "Mail All Quotes": function() {
                        //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023

              
                        var Email_PPList =[];
                        var RFQIDList=[];
                        var __mailRFQ=[];
            
                        if($(document).find('.ui-dialog').find('[id^="emailDialog_BEN"]').find('.chkBox_Email_PPCode').length>0)
                        {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_BEN"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                                //  if(checkboxControl.checked){
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val()).filter(function(RFQ_OBJECT){
                                        return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                                        })
                                    )
                            //  }
                            })
                        }
                        if(Email_PPList.length>0){
                            console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);

                            for(let R of RFQIDList){
                                __mailRFQ.push(R[0].EP_ER_QuoteRequestId);
            
                            }
                           // return true;    
                        }


                        if ($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val() != undefined && $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val().trim()!='')
                        var RFQID = JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

                        if (RFQID != undefined && RFQID != ''){

                            if(__mailRFQ == ""){

                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileBEN, "booktradeben" + thisTileBEN.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayfcn");
                                mapleOrderLoaderStop(thisTileBEN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            }

                            $( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileBEN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            // MailBestQuote(thisTileBEN.id.match(/\d+$/)[0], JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[0].EP_ER_QuoteRequestId);
                            request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                            "rfqId":__mailRFQ.toString(), //RFQID,
                            "CurrentTileID":thisTileBEN.id.match(/\d+$/)[0],
                            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                            QuoteMailType:"English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileBEN = document.getElementById("td" +TileId);
                                mapleOrderLoaderStop(thisTileBEN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                booktradePopup(thisTileBEN, "booktradeEQBEN" + TileId, data.message, "DivOverlayEQBEN");
                            
                            }).catch(error=>{
                            console.log(error);
                        
                            })
                        }
                        else{
                            mapleOrderLoaderStop(thisTileBEN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('','Invalid RFQ ID ');      
                        }       

                        return true;

                    //email all quotes here 

                    }
                }
            });
            $(dialogBoxBEN).dialog('open');

        }else
        {
            $(document).find('.ui-dialog').find('[id^="emailDialog_BEN"]').empty().append(strEmail);

            $(dialogBoxBEN).dialog('open');

            var Email_PPList =[];
            var RFQIDList=[];
            var __mailRFQ=[];
            
            if($(document).find('.ui-dialog').find('[id^="emailDialog_BEN"]').find('.chkBox_Email_PPCode').length>0)
            {
                $(document).find('.ui-dialog').find('[id^="emailDialog_BEN"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                    if(checkboxControl.checked){
                    Email_PPList.push($(checkboxControl).parent().text().trim())

                    RFQIDList.push(JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val()).filter(function(RFQ_OBJECT){
                        return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                        })
                        )

                    }
                })
            }
            if(Email_PPList.length>0){
                console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);

                for(let R of RFQIDList){
                    __mailRFQ.push(R[0].EP_ER_QuoteRequestId);

                }
             // return true;    
            }

            if ($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val() != undefined && $(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val().trim()!='')
            var RFQID = JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

            if (RFQID != undefined && RFQID != ''){
                // MailBestQuote(thisTileBEN.id.match(/\d+$/)[0], JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[0].EP_ER_QuoteRequestId);
                if(__mailRFQ == ""){

                    // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    //booktradePopup(thisTileBEN, "booktradeben" + thisTileBEN.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayfcn");
                    mapleOrderLoaderStop(thisTileBEN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    openValidationpopup('','No price selected for mailing !');
                    //End
                    return false;
                }    
                request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                    "rfqId":__mailRFQ.toString(),//RFQID,
                    "CurrentTileID":thisTileBEN.id.match(/\d+$/)[0],
                    "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                    QuoteMailType:"English"
                }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                console.log(data);
                TileId = data.CurrentTileID;
                thisTileBEN = document.getElementById("td" +TileId);
                mapleOrderLoaderStop(thisTileBEN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                booktradePopup(thisTileBEN, "booktradeEQBEN" + TileId, data.message, "DivOverlayEQBEN");
                      
                }).catch(error=>{
                console.log(error);
            
                })
            }
            else{
                mapleOrderLoaderStop(thisTileBEN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                openValidationpopup('','Invalid RFQ ID ');
            }
        }
        $(thisTileBEN).find('[id^="BENBanksRow"]').children().each(function() {
           if($(thisTileBEN).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
               selectedBankIndex = itr;
           }
           itr++;
        });
        console.assert(selectedBankIndex != -1);
        // END
        // Added by Atharva - EQC Timers
        // Replaced 0 with selectedBankIndex  

    } catch (error) {
        console.log(error);
        //openValidationpopup('','Invalid RFQ ID ') //LGTGTWINT-1133 :Invalid RFQ ID popup when clicked on Email button
    }
}

function validateOrderBEN(thisTileBEN,_flag){    // LGTGTWINT-1279 : Instant Pricing : Order booking valdations.

    try{

        var selectedBankIndex = -1;
        var itr = 0;
        var isNonBestPrice = false;
        if(clientConfigdata.CommonMethods.NonBestPrice == "Y") {
            isNonBestPrice = true;
        }
        else {
            isNonBestPrice = false;
        }
        if(isNonBestPrice) {
            $(thisTileBEN).find('[id^="BENBanksRow"]').children().each(function() {
                if($(thisTileBEN).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
                    selectedBankIndex = itr;
                }
                itr++;
            });
        }
        else {
            selectedBankIndex = 0;
        }
  
        if(selectedBankIndex == -1) {
            endLoader()
            return false;
        }

        if ($(thisTileBEN).find('[id^="ddlSolveFor"]').val().trim() == "Conversion_Strike") {
      
         if($(thisTileBEN).find('[id^="kiinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[selectedBankIndex].BENOUT)< parseFloat($(thisTileBEN).find('[id^="kiinputbox"]').val())){
                ValidateField($(thisTileBEN).find('[id^="kiinputbox"]').attr("id"), "KI % of Initial should be less than strike(%)", thisTileBEN);
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                return false;
            }
        }
        
        if ($(thisTileBEN).find('[id^="hdnfinalTokenBEN"]').val() == "" || $(thisTileBEN).find('[id^="BENPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileBEN).find('[id^="BENPrices"]')[0].firstChild.innerHTML == "") {
            if(_flag == false){
                _validateOrderEQC = true; 
            }
           ValidateField($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').attr("id"), "Order Execution Failed!", thisTileBEN);
           return false;
        }
  
        if(parseFloat(JSON.parse($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').val())[selectedBankIndex].BENOUT) <= 0){
            if(_flag == false){

                _validateOrderEQC = true; 
            }
            ValidateField($(thisTileBEN).find('[id^="hdnChartPricesBEN"]').attr("id"), "Prices can not be negative 0r zero, Order Execution Failed!", thisTileBEN);
            return false;
        }

    }catch(er){

        console.log(er.message);
    }

}

