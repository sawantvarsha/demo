var token = "";
var shareCount;
var QuoteObject;
var CouponFreq;
var arrDCN = [];
var maxDCN;
var finalResponseDataDCN;
var finalTokenDCN;
var repriceObjectDCN;
var TimerDCN = 0;
var finalObjDCN;
var idDCN = 31;
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
var globalDefaultSharesArrayDCN = ["MSFT.OQ", "GOOGL.OQ"];  //LGTGTWINT-1723 Instant Pricer : Remove FB.OQ ticker from default notes payoff's.

// To load the DCN tile 
function onLoadDCN(currId,isProductCopiedDCN) {
    try {
        // Added logic for getting current tile //

        setDeafaultValuesDCN(currId,isProductCopiedDCN);
        thisTileDCN = document.getElementById("td" + currId);
        $(thisTileDCN).find('[id^="OverlayDiv"]').hide();

        
        sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        $(thisTileDCN).find('[id^="btnBestPriceDCN"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 25 July 2023
        $(thisTileDCN).find('[id^="btnEmailQuote"]').attr("disabled", true);
        $(thisTileDCN).find('[id^="BookTradeDCN"]').attr("disabled", true);
        //END
        // clearInterval($(thisTileDCN).find('[id^="hdnintervalID"]').val());  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileDCN,'[id^="btnBestPriceDCN"]', false);
        clearPricerTable(thisTileDCN);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileDCN).find('[id^="EQCRfqidpnl"]').hide();
        $(thisTileDCN).find('[id^="RFQIDEQC"]').html("");
        //End
        

        $(thisTileDCN).find("div.card input[type='text'],div.card input[type='search'],div.card select").on('change', function () {


            thisTileDCN = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileDCN).find('[id^="btnBestPriceDCN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileDCN).find('[id^="hdnintervalID"]').val());
            clearPricerTable(thisTileDCN); 
            $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
             
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileDCN).find('[id^="EQCRfqidpnl"]').hide();
            $(thisTileDCN).find('[id^="RFQIDEQC"]').html("");
            //End

            mapleLoaderStop(thisTileDCN,'[id^="btnBestPriceDCN"]', false);
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileDCN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileDCN).find('[id^="BookTradeDCN"]').attr("disabled", true);
          
            
         })
 
         $(thisTileDCN).find(" div.card .amtPopup").on('select', function () { // INT1FIN47-768 Gateway Markets Instant Pricing issue
 
            thisTileDCN = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileDCN).find('[id^="btnBestPriceDCN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileDCN).find('[id^="hdnintervalID"]').val()); 

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileDCN).find('[id^="EQCRfqidpnl"]').hide();
            $(thisTileDCN).find('[id^="RFQIDEQC"]').html("");
            //End

            $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            clearPricerTable(thisTileDCN);
            mapleLoaderStop(thisTileDCN,'[id^="btnBestPriceDCN"]', false);
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileDCN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileDCN).find('[id^="BookTradeDCN"]').attr("disabled", true);
             
          })


        // Added to check KI Type & Add it's respective properties // 07-04-2020 //

        if ($(thisTileDCN).find('[id^="ddlDCNType"]').val().trim() == "NOKI") {

            $(thisTileDCN).find('[id^="kiinputbox"]').val("").prop("disabled", true);

        } else {
            $(thisTileDCN).find('[id^="kiinputbox"]').prop("disabled", false);
        }

        //END

        checkSolveForDCN($(thisTileDCN).find('[id^="ddlSolveFor"]').val(), thisTileDCN)  //Added for add tile isssue | LGTGTWINT-625 | Chaitanya M | 14 Feb 2023 
 
        
        //aded by rutika on 26/04/2022 for calculating tenor when changed in input box
         //Start

        $(thisTileDCN).find('[id^="tenor_DCN"]').on("change", function() {
            try {
             
                thisTileDCN = $(this).parents(".sorting")[0];
                let currId=   thisTileDCN.id.match(/\d+$/)[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileDCN,"btnBestPriceDCN");  
                $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val("");
                //End    
                
                if( $(thisTileDCN).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_DCN"]').val()) > Number(FCNAllowedTenorinMonths) || $(this).parents(".sorting").find('[id^="tenor_DCN"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_DCN"]').val() == ""){
                        ValidateField($(thisTileDCN).find('[id^="tenor_DCN"]').attr("id"), "Please enter valid tenor.", thisTileDCN);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_DCN"]').val()) > Number(FCNAllowedTenorinYears) || $(this).parents(".sorting").find('[id^="tenor_DCN"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_DCN"]').val() == ""){
                        ValidateField($(thisTileDCN).find('[id^="tenor_DCN"]').attr("id"), "Please enter valid tenor.", thisTileDCN);
                        return false;
                    }
                }

                // calculateTenor(currId);  // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023

            } catch (error) {
                console.log(error.message);
            }
        });

        $(thisTileDCN).find('[id^="tenorddl"]').on("change", function () {
            try {
                
                thisTileDCN = $(this).parents(".sorting")[0];
                let currId=   thisTileDCN.id.match(/\d+$/)[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                 sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileDCN,"btnBestPriceDCN"); 
                $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val("");
                //End

                if( $(thisTileDCN).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_DCN"]').val()) > Number(FCNAllowedTenorinMonths)){
                        ValidateField($(thisTileDCN).find('[id^="tenor_DCN"]').attr("id"), "Please enter valid tenor.", thisTileDCN);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_DCN"]').val()) > Number(FCNAllowedTenorinYears)){
                        ValidateField($(thisTileDCN).find('[id^="tenor_DCN"]').attr("id"), "Please enter valid tenor.", thisTileDCN);
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

        $(thisTileDCN).find('[id^="ddlSolveFor"]').on("change", function () {

            try {

                //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                if ($(this).parents('.sorting').find('[id^="ddlSolveFor"]').val().toUpperCase() == "DIGITAL_STRIKE") {

                    $(this).parents('.sorting').find('[id^="strikeipbox"]').prop("disabled", true);
                    $(this).parents('.sorting').find('[id^="IBPriceinputbox"]').prop("disabled", false);
                    $(this).parents('.sorting').find('[id^="couponipbox"]').prop("disabled", false);
                    $(this).parents('.sorting').find('[id^="txtupfront"]').prop('disabled', false);

                    // checkupfrontPriceDCN(thisTileDCN); //LGTGTWINT-1095

                } else if ($(this).parents('.sorting').find('[id^="ddlSolveFor"]').val().toUpperCase() == "COUPON") {

                    $(this).parents('.sorting').find('[id^="strikeipbox"]').prop("disabled", false);
                    $(this).parents('.sorting').find('[id^="IBPriceinputbox"]').prop("disabled", false);
                    $(this).parents('.sorting').find('[id^="couponipbox"]').prop("disabled", true);
                    $(this).parents('.sorting').find('[id^="txtupfront"]').prop('disabled', false);

                    // checkupfrontPriceDCN(thisTileDCN); //LGTGTWINT-1095

                } else if ($(this).parents('.sorting').find('[id^="ddlSolveFor"]').val().toUpperCase() == "PRICE") {

                    $(this).parents('.sorting').find('[id^="strikeipbox"]').prop("disabled", false);
                    $(this).parents('.sorting').find('[id^="IBPriceinputbox"]').prop("disabled", true);
                    $(this).parents('.sorting').find('[id^="couponipbox"]').prop("disabled", false);
                    $(this).parents('.sorting').find('[id^="txtupfront"]').prop('disabled', true);

                    // checkupfrontPriceDCN(thisTileDCN) //LGTGTWINT-1095
                }

                //End
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileDCN,"btnBestPriceDCN"); 
                $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val("");
                //End
            } catch (error) {
                console.log(error.message)
            }
        })

        // END
        EQProductsFillCcy(thisTileDCN, "CCY_DCN_ddl");

        // Added to Change/Select KI type & Add it's respective properties // 06-04-2020 //

        $(thisTileDCN).find('[id^="ddlDCNType"]').on("change", function () {
            try {
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileDCN,"btnBestPriceDCN");  
                $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val("");
                //End
                if ($(this).parents('.sorting').find('[id^="ddlDCNType"]').val() == "NOKI") {

                    $(this).parents('.sorting').find('[id^="kiinputbox"]').val("").prop("disabled", true);

                } else if ($(this).parents('.sorting').find('[id^="ddlDCNType"]').val() == "European") {

                    $(this).parents('.sorting').find('[id^="kiinputbox"]').val("65.00").prop("disabled", false);
                }
            } catch (error) {
                console.log(error.message)
            }
        })

        //END

         // Check for upfront/IB Price 

         $(thisTileDCN).find('[id^="txtupfront"]').on("change", function() {
            try {
             
            thisTileDCN = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileDCN,"btnBestPriceDCN"); 
            $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val("");
            //End

            if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

                let _ibprice =   parseFloat(100 -  Number($(thisTileDCN).find('[id^="txtupfront"]').val())).toFixed(2);;

                $(thisTileDCN).find('[id^="IBPriceinputbox"]').val(_ibprice);
            }

            } catch (error) {
                console.log(error.message);
            }
        });

        $(thisTileDCN).find('[id^="IBPriceinputbox"]').on("change", function() {
            try {
             
            thisTileDCN = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileDCN,"btnBestPriceDCN");   
            $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val("");
            //End

            if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

                let _upfront =  parseFloat(100 -  Number($(thisTileDCN).find('[id^="IBPriceinputbox"]').val())).toFixed(2);

                $(thisTileDCN).find('[id^="txtupfront"]').val(_upfront);

            }

            } catch (error) {
                console.log(error.message);
            }
        });

        // END

        shareCount = 0;
        $(thisTileDCN).find('[id^="shareDivDCN"]').click(function () {
            $(this).find('input[type="search"]').focus();
        });


        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        //Start      
        $(thisTileDCN).find('div.card .ddlShares').on("focusout", function (){      
                                             
            validatesharebasket(thisTileDCN,"shareNameDCN" );        
            sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileDCN,"btnBestPriceDCN"); 
            $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023          
            $(thisTileDCN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileDCN).find('[id^="BookTradeDCN"]').attr("disabled", true);
  
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        $(thisTileDCN).find("div.card .ddlShares").on("keydown", function(){

            $("#bodyDiv").hide();  
            //Added for LGTGTWINT-1292 | Chaitanya M | 28 Feb 2023
            _ccylistDCN = getExchangeAndCcyFromBasket($(thisTileDCN).find('[id^="shareDivDCN"]')[0], 'share');
            if(_ccylistDCN.length >=4){
                return false;
            } 
            sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileDCN,"btnBestPriceDCN"); 
            $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val(""); // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileDCN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileDCN).find('[id^="BookTradeDCN"]').attr("disabled", true);             
             
        }); 


        //Added for LGTGTWINT-1077 Instant Pricing: Input length for all fields for all payoffs | Chaitanya M | 28-01-2023
        $(thisTileDCN).find('[id^="tenor_DCN"]').on("keyup", function (){           

             InputLengthCheckEQC(thisTileDCN, "tenor_DCN", 3);
        });

        $(thisTileDCN).find("[id^='strikeipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileDCN, "strikeipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileDCN).find('[id^="EQCRfqidpnl"]').hide();
            $(thisTileDCN).find('[id^="RFQIDEQC"]').html("");
            //End
        });

        $(thisTileDCN).find("[id^='txtupfront']").on("keyup", function(){
             InputLengthCheckEQC(thisTileDCN, "txtupfront",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
        
        });

        $(thisTileDCN).find("[id^='kiinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileDCN, "kiinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
             //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileDCN).find('[id^="EQCRfqidpnl"]').hide();
            $(thisTileDCN).find('[id^="RFQIDEQC"]').html("");
            //End
        });
        $(thisTileDCN).find("[id^='couponipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileDCN, "couponipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
             //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            //  $(thisTileDCN).find('[id^="EQCRfqidpnl"]').hide();
             $(thisTileDCN).find('[id^="RFQIDEQC"]').html("");
             //End
        
        });
        $(thisTileDCN).find("[id^='IBPriceinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileDCN, "IBPriceinputbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
        
        });

        //Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
        $(thisTileDCN).find('[id^="ContractAmtDCN"]').on("change", function(){
        // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileDCN,"btnBestPriceDCN"); 
            $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val("");
            //End
            if($(thisTileDCN).find('[id^="ContractAmtDCN"]').val()== "" || $(thisTileDCN).find('[id^="ContractAmtDCN"]').val()==null || $(thisTileDCN).find('[id^="ContractAmtDCN"]').val()=="0" ){
              $(thisTileDCN).find('[id^="ContractAmtDCN"]').val("0"); 
            }    
            return false;         
          }); 

        //End

    } catch (error) {
        console.log(error.message)
    }
}

//Added for add tile isssue | LGTGTWINT-625 | Chaitanya M | 14 Feb 2023
function checkSolveForDCN(solveFor,thisTileDCN,calledFromIndexDCN) {
    try {
        if (calledFromIndexDCN != undefined){
            if (solveFor.trim().includes("DIGITAL_STRIKE")) {
                    
                $(thisTileDCN).find('[id^="strikeipbox"]').prop("disabled", true);
                $(thisTileDCN).find('[id^="IBPriceinputbox"]').prop("disabled", false);
                $(thisTileDCN).find('[id^="couponipbox"]').prop("disabled", false);
                $(thisTileDCN).find('[id^="txtupfront"]').prop('disabled', false);
       
            } else if (solveFor.trim().includes("PRICE")) {
                $(thisTileDCN).find('[id^="strikeipbox"]').prop("disabled", false);
                $(thisTileDCN).find('[id^="IBPriceinputbox"]').prop("disabled", true);
                $(thisTileDCN).find('[id^="couponipbox"]').prop("disabled", false);
                $(thisTileDCN).find('[id^="txtupfront"]').prop('disabled', true);
                      
            } else if (solveFor.trim().includes("COUPON") ) {
                $(thisTileDCN).find('[id^="strikeipbox"]').prop("disabled", false);
                $(thisTileDCN).find('[id^="IBPriceinputbox"]').prop("disabled", false);
                $(thisTileDCN).find('[id^="couponipbox"]').prop("disabled", true);
                $(thisTileDCN).find('[id^="txtupfront"]').prop('disabled', false);
    
            }

            if ($(thisTileDCN).find('[id^="ddlDCNType"]').val().trim() == "NOKI") {
                $(thisTileDCN).find('[id^="kiinputbox"]').val("").prop("disabled", true);
            } else {
                $(thisTileDCN).find('[id^="kiinputbox"]').prop("disabled", false);
            }
        }
        else {
            if (solveFor.trim().includes("DIGITAL_STRIKE")) {
              
               $(thisTileDCN).find('[id^="strikeipbox"]').prop("disabled", true);
               $(thisTileDCN).find('[id^="IBPriceinputbox"]').prop("disabled", false);
               $(thisTileDCN).find('[id^="couponipbox"]').prop("disabled", false);
               $(thisTileDCN).find('[id^="txtupfront"]').prop('disabled', false);
             
            } else if (solveFor.trim().includes("PRICE")) {
                $(thisTileDCN).find('[id^="strikeipbox"]').prop("disabled", false);
                $(thisTileDCN).find('[id^="IBPriceinputbox"]').prop("disabled", true);
                $(thisTileDCN).find('[id^="couponipbox"]').prop("disabled", false);
                $(thisTileDCN).find('[id^="txtupfront"]').prop('disabled', true);
                 
            } else if (solveFor.trim().includes("COUPON")) {
                $(thisTileDCN).find('[id^="strikeipbox"]').prop("disabled", false);
                $(thisTileDCN).find('[id^="IBPriceinputbox"]').prop("disabled", false);
                $(thisTileDCN).find('[id^="couponipbox"]').prop("disabled", true);
                $(thisTileDCN).find('[id^="txtupfront"]').prop('disabled', false);
             
            }
        }
             
        } catch (error) {
            console.log(error.message)
        }
}

function checkupfrontPriceDCN(thisTileDCN){

    try
    {

        let _ibprice =   parseFloat(100 -  Number($(thisTileDCN).find('[id^="txtupfront"]').val())).toFixed(2);;

        $(thisTileDCN).find('[id^="IBPriceinputbox"]').val(_ibprice);
    
        let _upfront =  parseFloat(100 -  Number($(thisTileDCN).find('[id^="IBPriceinputbox"]').val())).toFixed(2);
    
        $(thisTileDCN).find('[id^="txtupfront"]').val(_upfront);

    }catch(er){
        
        console.log(er.message);

    }   
    

}

// To set default values for DCN
function setDeafaultValuesDCN(currId,isProductCopiedDCN) {
    try {
        // Added logic for getting current tile //

        thisTileDCN = document.getElementById("td" + currId);

          //Configured UI fileds Start :: || 08 Feb 2023

        // if(DRAFCNUpfrontYN.toUpperCase() == "YES" || DRAFCNUpfrontYN.toUpperCase().includes("Y")){

            // $(thisTileDCN).find('[id^="txtupfront"]').val("0.00"); //LGTGTWINT-1095
            // $(thisTileDCN).find('[id^="txtupfront"]').hide(); //UI filed
            // $(thisTileDCN).find('[id^="upfrontuilbl"]').hide(); //UI label
            // $(thisTileDCN).find('[id^="txtupfrontlbl"]').hide(); // hide label order popup
            // $(thisTileDCN).find('[id^="txtupfrontVal"]').hide(); //Order popup filed
            
        // }else{
            $(thisTileDCN).find('[id^="txtupfront"]').val("1.35");
        // }

        // END

        $(thisTileDCN).find('[id^="ContractAmtDCN"]').val("1,000,000.00");
        $(thisTileDCN).find('[id^="ContractAmtDCN"]').attr('maxlength','14');
        $(thisTileDCN).find('[id^="strikeipbox"]').val("85.00");
        $(thisTileDCN).find('[id^="couponipbox"]').val("8.00");
        $(thisTileDCN).find('[id^="kiinputbox"]').val("65.00");
        $(thisTileDCN).find('[id^="tenor_DCN"]').val("6");
        $(thisTileDCN).find('[id^="IBPriceinputbox"]').val("99.00");
        callDropDownFunction($(thisTileDCN).find('[id^="shareName"]'), "DCN", currId);
        clearPricerTable(thisTileDCN);
        $(thisTileDCN).find('[id^="shareNameCntrlDCN"]').html("");
        $(thisTileDCN).find('[id^="hiddenshareinputDCN"]').html("");
        $(thisTileDCN).find('[id^="CCY_DCN"]').html("");
       
        if(!isProductCopiedDCN){
        for (let s=0;s<clientConfigdata.EQCDCN.MinSharesInBaskets;s++){
            createElementInBasket(thisTileDCN, 'shareDivDCN', sessionStorage.getItem(thisTileDCN.id)!=undefined?sessionStorage.getItem(thisTileDCN.id).split(" ")[s]:globalDefaultSharesArrayDCN[s]); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
       
        }
    }
        $(thisTileDCN).find('[id^="shareName"]')[0].placeholder = "";
        $(thisTileDCN).find('[id^="CCY_DCN"]').html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);
    } catch (error) {
        console.log(error.message)
    }
}
var globalSolveForValueDCN='';
// To get best price for DCN
function getBestPriceDCN(that) {
    try {
        
         // var uniqueIntervalID;
         thisTileDCN = $(that).parents(".sorting")[0];
         console.log('Start Interval value =' + $(thisTileDCN).find('[id^="hdnintervalID"]').val());

         $(thisTileDCN).find('[id^="btnBestPriceDCN"]').attr("disabled", true); // INT1FIN47-768 Gateway Markets Instant Pricing issue

         var requestIDDCN = "";
 
         requestIDDCN = requestIDDCN + RequestIDGenerator(70);
 
         $(thisTileDCN).find('[id^="hdnRequestID"]').val(requestIDDCN);  //INT1FIN47-768 Gateway Markets Instant Pricing issue
         
         mapleLoaderStop(thisTileDCN,'[id^="btnBestPriceDCN"]', false);


        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileDCN).find('[id^="EQCRfqidpnl"]').hide();
        $(thisTileDCN).find('[id^="RFQIDEQC"]').html("");
        //End
 
         globalSolveForValueDCN = $(thisTileDCN).find('[id^="ddlSolveFor"]').val().trim();

         clearInterval($(thisTileDCN).find('[id^="hdnintervalID"]').val());

         console.log('After clear Interval value =' + $(thisTileDCN).find('[id^="hdnintervalID"]').val());
 
         $(thisTileDCN).find('[id^="hdnintervalID"]').val("");
        
        TileId = that.id.match(/\d+$/)[0];

        sessionStorage.setItem("poolingTimer_" + TileId, 0);
        sessionStorage.setItem("pricingToggle" + TileId, false);

        thisTileDCN = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        console.log(TileId, thisTileDCN, productName);
        $(thisTileDCN).find('[id^="TBLDCN"]' + " td").each(function () {
           
            $(this).html("-");
        })
        validation_clear(); 
        clearPricerTable(thisTileDCN);


        let tenorNumb = $(thisTileDCN).find("[id^='tenor_DCN']").val();
        let tenorstring = $(thisTileDCN).find("[id^='tenorddl']").val();
        let _tenor = tenorNumb + tenorstring;


        //  Client Side Validation Added for all cases // 07-April-2020
        if ($(thisTileDCN).find('[id^="shareDivDCN"]')[0].childNodes.length <= 1) {     
            ValidateField($(thisTileDCN).find('[id^="shareDivDCN"]').attr('id'), "Please Enter Valid Shares", thisTileDCN);
            return false
        } else if ($.trim($(thisTileDCN).find('[id^="ContractAmtDCN"]').val()) == '' || $.trim($(thisTileDCN).find('[id^="ContractAmtDCN"]').val()) < 0) {
          
            ValidateField($(thisTileDCN).find('[id^="ContractAmtDCN"]').attr('id'), "Please enter valid notional.", thisTileDCN); // LGTGTWINT-1487 | Chaitanya M | 24 Feb 2023
            return false

        } else if ($.trim($(thisTileDCN).find('[id^="tenor_DCN"]').val()) == '' || parseFloat($(thisTileDCN).find('[id^="tenor_DCN"]').val()) <=0) {
           
            ValidateField($(thisTileDCN).find('[id^="tenor_DCN"]').attr('id'), "Please Enter Valid Tenor", thisTileDCN);
            return false

        } else  if ((parseFloat($(thisTileDCN).find('[id^="kiinputbox"]').val()) == '' || parseFloat($(thisTileDCN).find('[id^="kiinputbox"]').val()) <= 0) && $(thisTileDCN).find('[id^="kiinputbox"]').prop('disabled') != true) {
           
            ValidateField($(thisTileDCN).find('[id^="kiinputbox"]').attr('id'), "Please Enter Valid KI (%) Initial.", thisTileDCN);
            return false

        }       

        if ($(thisTileDCN).find('[id^="ddlSolveFor"]').val().toUpperCase() == "DIGITAL_STRIKE") {

            if ((parseFloat($(thisTileDCN).find('[id^="IBPriceinputbox"]').val()) == '' || parseFloat($(thisTileDCN).find('[id^="IBPriceinputbox"]').val()) <= 0) || parseFloat($(thisTileDCN).find('[id^="IBPriceinputbox"]').val()) > 100) {
                ValidateField($(thisTileDCN).find('[id^="IBPriceinputbox"]').attr('id'), "Price % must be greater than 0 and less than 100", thisTileDCN);
                return false
            } else if (parseFloat($(thisTileDCN).find('[id^="couponipbox"]').val()) == '' || parseFloat($(thisTileDCN).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileDCN).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileDCN).find('[id^="couponipbox"]').attr('id'), "Please Enter Valid Coupon (%)", thisTileDCN);
                return false
            }

        } else if ($(thisTileDCN).find('[id^="ddlSolveFor"]').val().toUpperCase() == "COUPON") {

            if (parseFloat($(thisTileDCN).find('[id^="strikeipbox"]').val()) == '' || parseFloat($(thisTileDCN).find('[id^="strikeipbox"]').val()) <= 0 || parseFloat($(thisTileDCN).find('[id^="strikeipbox"]').val()) > 100) {
                ValidateField($(thisTileDCN).find('[id^="strikeipbox"]').attr('id'), "Please Enter Valid Strike (%)", thisTileDCN);
                return false
            } else if ((parseFloat($(thisTileDCN).find('[id^="IBPriceinputbox"]').val()) == '' || parseFloat($(thisTileDCN).find('[id^="IBPriceinputbox"]').val()) <= 0)) {
                ValidateField($(thisTileDCN).find('[id^="IBPriceinputbox"]').attr('id'), "Price % must be greater than 0 and less than 100", thisTileDCN);
                return false
            }else if ($(thisTileDCN).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileDCN).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileDCN).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileDCN).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%)", thisTileDCN);
                return false;
            }

        } else if ($(thisTileDCN).find('[id^="ddlSolveFor"]').val().toUpperCase() == "PRICE") {

            if (parseFloat($(thisTileDCN).find('[id^="strikeipbox"]').val()) == '' || parseFloat($(thisTileDCN).find('[id^="strikeipbox"]').val()) <= 0 || parseFloat($(thisTileDCN).find('[id^="strikeipbox"]').val()) > 100) {
                ValidateField($(thisTileDCN).find('[id^="strikeipbox"]').attr('id'), "Please Enter Valid Strike (%)", thisTileDCN);
                return false
            } else if (parseFloat($(thisTileDCN).find('[id^="couponipbox"]').val()) == '' || parseFloat($(thisTileDCN).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileDCN).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileDCN).find('[id^="couponipbox"]').attr('id'), "Please Enter Valid Coupon (%)", thisTileDCN);
                return false
            }else if ($(thisTileDCN).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileDCN).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileDCN).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileDCN).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%)", thisTileDCN);
                return false;
            }

        }


          // Added by RizwanS for tenor validation before pricing || 03 Jan 2022 ||

          if( $(thisTileDCN).find('[id^="tenorddl"]').val() == "M"){

            if(Number($(thisTileDCN).find('[id^="tenor_DCN"]').val()) > Number(FCNAllowedTenorinMonths)){
                ValidateField($(thisTileDCN).find('[id^="tenor_DCN"]').attr("id"), "Please enter valid tenor.", thisTileDCN);
                return false;
            }

        } else{

             if(Number($(thisTileDCN).find('[id^="tenor_DCN"]').val()) > Number(FCNAllowedTenorinYears)){
                ValidateField($(thisTileDCN).find('[id^="tenor_DCN"]').attr("id"), "Please enter valid tenor.", thisTileDCN);
                return false;
            }
        }
        
        // END


        if ($(thisTileDCN).find('[id^="ddlDCNType"]').val() != "NOKI") {

            if ($(thisTileDCN).find('[id^="strikeipbox"]').prop('disabled') == false) {

                if ((parseFloat($(thisTileDCN).find('[id^="kiinputbox"]').val()) >= parseFloat($(thisTileDCN).find('[id^="strikeipbox"]').val()))) {
                    ValidateField($(thisTileDCN).find('[id^="kiinputbox"]').attr('id'), "KI% should be less than strike (%)", thisTileDCN);
                    return false
                }

            }
        }

        // END

        let _upfront = "";

        if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

           _upfront = $(thisTileDCN).find('[id^="txtupfront"]').val();

        }else{

            _upfront =  "0.00"; 
        }


        let exchangeListDCN = getExchangeAndCcyFromBasket($(thisTileDCN).find('[id^="shareDivDCN"]')[0], 'exchange');
        let ccyListDCN = getExchangeAndCcyFromBasket($(thisTileDCN).find('[id^="shareDivDCN"]')[0], 'ccy');
        let shareList = getExchangeAndCcyFromBasket($(thisTileDCN).find('[id^="shareDivDCN"]')[0], 'share');

        // Added ER_Quanto flag not getting updated for ELN, FCN and DRA in Instant pricer | LGTGTWINT-1448| Chaitanya M | 20 Feb 2023
        let _QuantoFlagDCN = "";

        uniqueCCY = ccyListDCN.filter((item, i, ar) => ar.indexOf(item) === i);
        if(uniqueCCY.length==1){
            if($(thisTileDCN).find('[id^="CCY_DCN_ddl"]').val()== uniqueCCY[0]){
                _QuantoFlagDCN = "No";
            } else{
                _QuantoFlagDCN = "Yes";
            }
        }else{
            _QuantoFlagDCN = "Yes";
        }
            //End

        mapleLoaderStart(thisTileDCN,'[id^="btnBestPriceDCN"]', false);


        // LGTGTWINT-1227 - Instant Pricing: EQC Ref missing for rfqs placed through instant pricing | 24 Feb 2023

        let _tenorDCN = ""

        if(tenorstring.toUpperCase().includes("M")){
        
            _tenorDCN= "MONTH";
        
        }else{
        
            _tenorDCN= "YEAR";
        }
        
        let getRefDCN = "";
        
        getRefDCN = getEQCRefrenceNumber(productName,"","",tenorNumb,_tenorDCN,($(thisTileDCN).find('[id^="ddlSolveFor"]').val() != "Coupon") ? $(thisTileDCN).find('[id^="couponipbox"]').val() : "",_QuantoFlagDCN,"Worst of");
        
        $(thisTileDCN).find('[id^="hdnRefnumber"]').val(getRefDCN); //LGTGTWINT-1589 Instant Pricing : EQC ref different on instant pricer and order details,quote mail and order mail

        // END

        QuoteObject = {

                UserID: userName,
                Exchange1: exchangeListDCN[0],
                Exchange2: exchangeListDCN[1],
                Exchange3: exchangeListDCN[2],
                Exchange4: exchangeListDCN[3],
                UnderlyingCode1: shareList[0],
                UnderlyingCode2: shareList[1],
                UnderlyingCode3: shareList[2],
                UnderlyingCode4: shareList[3],
                Ccy:  $(thisTileDCN).find('[id^="CCY_DCN_ddl"]').val().trim(),
                Tenor: _tenor,
                SettlementDays: $(thisTileDCN).find('[id^="SettlWeeks"]').val().trim(),
                SolveFor:  $(thisTileDCN).find('[id^="ddlSolveFor"]').val(),
                strikePerc: ($(thisTileDCN).find('[id^="ddlSolveFor"]').val().toUpperCase() != "DIGITAL_STRIKE") ? $(thisTileDCN).find('[id^="strikeipbox"]').val() : "",
                Upfront: _upfront,
                PricePerc:($(thisTileDCN).find('[id^="ddlSolveFor"]').val() != "Price") ? $(thisTileDCN).find('[id^="IBPriceinputbox"]').val() : "",
                CouponPerc: ($(thisTileDCN).find('[id^="ddlSolveFor"]').val() != "Coupon") ? $(thisTileDCN).find('[id^="couponipbox"]').val() : "",
                KIPerc:  ($(thisTileDCN).find('[id^="ddlDCNType"]').val() != "NOKI") ? $(thisTileDCN).find('[id^="kiinputbox"]').val() : "",
                KIType: ($(thisTileDCN).find('[id^="ddlDCNType"]').val() != "NOKI") ? "European" : "",
                QuantoYN:_QuantoFlagDCN,
                Notional: $(thisTileDCN).find('[id^="ContractAmtDCN"]').val().replace(/,/g, "").split(".")[0],
                Branch: "",
                PPDetails: "",
                DigitalStrikePerc: ($(thisTileDCN).find('[id^="ddlSolveFor"]').val().toUpperCase() != "DIGITAL_STRIKE") ? $(thisTileDCN).find('[id^="strikeipbox"]').val() : "",
                BuysideID: getRefDCN,
                CurrentTileID: TileId,
                requestID:$(thisTileDCN).find('[id^="hdnRequestID"]').val(),
                EQC_TOKEN: sessionStorage.getItem("EQC_Token").toString(),

        }

        getQuoteDCN(QuoteObject, $(thisTileDCN).find('[id^="hdnintervalID"]')[0]);



    } catch (er) {
        console.log(er.message);

    }
}

// To get quote 
function getQuoteDCN(QuoteObject, uniqueIntervalID) {
    try {
        var dataDCN = request_getDataFromAPI(QuoteObject, clientConfigdata.CommonMethods.NodeServer + "getBestQuotesDCN").then(dataDCN => {


            thisTileDCN = document.getElementById("td" + dataDCN.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataDCN.CurrentTileID, true);
            mapleLoaderStart(thisTileDCN,'[id^="btnBestPriceDCN"]', false); //INT1FIN47-768 Gateway Markets Instant Pricing issue
            getUniqQuoteResponseDCN(thisTileDCN, dataDCN, uniqueIntervalID,QuoteObject.requestID);

 
        }).catch(error => { console.log(error); })

    } catch (err) {
        console.log(err.message);
    }
}

function getUniqQuoteResponseDCN(thisTileDCN, dataDCN, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var UIID = null;
        // Added by Atharva - EQC Timers - START
        isTimerStarted["td" + dataDCN.CurrentTileID] = false;
        myCounter["td" + dataDCN.CurrentTileID] = {};
        hasUserClickedEQC["td" + dataDCN.CurrentTileID] = false;
       
        $(thisTileDCN).find('[id^="hdnSelectedBank"]').val("");
    
        // END
        uniqueIntervalID.value = setInterval(function () {

            if(reqestID != $(thisTileDCN).find('[id^="hdnRequestID"]').val()){
                return false
            } // INT1FIN47-768 Gateway Markets Instant Pricing issue

            sessionStorage.setItem("quoteToken_" + thisTileDCN.id.match(/\d+$/)[0], "");
            sessionStorage.setItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0], "");

            sessionStorage.setItem("quoteToken_" + thisTileDCN.id.match(/\d+$/)[0], dataDCN['token']);
            sessionStorage.setItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0], dataDCN['responseData']);


            getFinalQuoteResponseDCN(sessionStorage.getItem("quoteToken_" + thisTileDCN.id.match(/\d+$/)[0]), sessionStorage.getItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]), thisTileDCN, uniqueIntervalID, reqestID);

        }, clientConfigdata.EQCDCN.PollInterval);

        console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
    } catch (error) {
        console.log(error)
    }
}

// To get price 
function getFinalQuoteResponseDCN(finalTokenDCN1, finalResponseDataDCN1, thisTileDCN, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var currentDateAndTime = new Date();

        sessionStorage.setItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0], finalResponseDataDCN1);

        sessionStorage.setItem("quoteToken_" + thisTileDCN.id.match(/\d+$/)[0], finalTokenDCN1);

        console.log("DCN RFQ's :: " + finalResponseDataDCN1 + " " + currentDateAndTime);

        Timer = Timer + 1;


        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileDCN.id.match(/\d+$/)[0])) >= clientConfigdata.EQCDCN.PoolTimer || sessionStorage.getItem("pricingToggle" + thisTileDCN.id.match(/\d+$/)[0]) == "false") {
            
            $(thisTileDCN).find('[id^="btnBestPriceDCN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval(uniqueIntervalID.value);
            mapleLoaderStop(thisTileDCN,'[id^="btnBestPriceDCN"]', false);
            QuoteObject = "";
            $(thisTileDCN).find('[id^="loader_DCN"]').hide();
           
            $("body").css("opacity", "");
            arrDCN = [];
            maxDCN = "";
            TimerDCN = 0;

            //Call Draw Graph
            // $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val(JSON.stringify(finalObjDCN));
            // if (finalObjDCN != null || finalObjDCN != undefined) {
               
            //     drawgraphDCN($(thisTileDCN).find('[id^="canvas"]').attr('id'));
            // }
            // INT1FIN47-768 Gateway Markets Instant Pricing issue

            return false;
        } else {
            var repriceObjectDCN = request_getDataFromAPI({
                "PPDetails": sessionStorage.getItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]),
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "UserID":userName,
                "CurrentTileID": thisTileDCN.id.match(/\d+$/)[0]

            }, clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseDCN").then(repriceObjectDCN => {

                thisTileDCN = document.getElementById("td" + repriceObjectDCN.CurrentTileID);
                
                if(reqestID != $(thisTileDCN).find('[id^="hdnRequestID"]').val()){
                    return false
                } //INT1FIN47-768Gateway Markets Instant Pricing issue

                sessionStorage.setItem("poolingTimer_" + thisTileDCN.id.match(/\d+$/)[0], Number(sessionStorage.getItem("poolingTimer_" + thisTileDCN.id.match(/\d+$/)[0])) + 1);
                finalObjDCN = repriceObjectDCN['responseData'];

                // Sorted By Best Price LP'S
                finalObjDCN.sort(function (a, b) {
                  if (a.DCNOUT === null || a.DCNOUT == "" || a.DCNOUT == "Timeout" ||  a.DCNOUT.toUpperCase().trim() == "REJECTED" || a.DCNOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return 1;
                    } else if (b.DCNOUT === null || b.DCNOUT == "" || b.DCNOUT == "Timeout" || b.DCNOUT.toUpperCase().trim() == "REJECTED" || b.DCNOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return -1;
                    } else if (a.DCNOUT === b.DCNOUT) {
                        return 0;
                    }

                    if ($(thisTileDCN).find('[id^="ddlSolveFor"]').val().toUpperCase() == "COUPON"){
                        return Number(a.DCNOUT) > Number(b.DCNOUT) ? -1 : 1;
                    }else
                    {
                         return Number(a.DCNOUT) < Number(b.DCNOUT) ? -1 : 1;
                    }

                });
                
                $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val(JSON.stringify(finalObjDCN));
                $(thisTileDCN).find('[id^="hdnfinalTokenDCN"]').val(sessionStorage.getItem("quoteToken_" + thisTileDCN.id.match(/\d+$/)[0]));
                // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileDCN).find('[id^="btnEmailQuote"]').attr("disabled", false);
                $(thisTileDCN).find('[id^="BookTradeDCN"]').attr("disabled", false)
                maxDCN = finalObjDCN[0].DCNOUT;

                 //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                //  $(thisTileDCN).find('[id^="EQCRfqidpnl"]').show();
                //  $(thisTileDCN).find('[id^="RFQIDEQC"]').html("");
                //  $(thisTileDCN).find('[id^="RFQIDEQC"]').html(finalObjDCN[0].EP_ER_QuoteRequestId);

                 bindRFQIDEQC(thisTileDCN,finalObjDCN);
                 //end

                // END

                if (sessionStorage.getItem("pricingToggle" + thisTileDCN.id.match(/\d+$/)[0]) == "true") {
                    // Added by Atharva - EQC Timers - START
                    // every time in new request indexes might change so clearing.
                    var isNonBestPrice = false;
                    if(clientConfigdata.CommonMethods.NonBestPrice == "Y") {
                        isNonBestPrice = true;
                    }
                    else {
                        isNonBestPrice = false;
                    }
                    mapIndexToBank["td"+repriceObjectDCN.CurrentTileID] = {};
                    // END
                    $(thisTileDCN).find('[id^="DCNBanksRow"]').empty();
                    $(thisTileDCN).find('[id^="DCNPrices"]').empty();
                    // Added by Atharva - EQC Timers - START
                    $(thisTileDCN).find('[id^="DCNTimerRow"]').empty();
                    if(!hasUserClickedEQC["td"+repriceObjectDCN.CurrentTileID]) {
                        $(thisTileDCN).find('[id^="hdnSelectedBank"]').val("");
                    }
                    var itr = 0;
                    // END
                    $(thisTileDCN).find('[id^="minMaxNotionalLimitRow"]').empty();
                    $(finalObjDCN).each(function (i, elem) {
                        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
                        var priceClass = "GlowPrice_Red";
                        if (!glowFlag) {
                            priceClass = "noGlow";
                        }

                        
                        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                        // $(thisTileDCN).find('[id^="EQCRfqidpnl"]').show();
                        // $(thisTileDCN).find('[id^="RFQIDEQC"]').html(elem.ParentID);
                        //End

                        var str = "";
                        var str2 = "";
                        if (elem.PP_CODE != null) {
                            // Added by Atharva - EQC Timers - START
                            mapIndexToBank["td"+repriceObjectDCN.CurrentTileID][itr] = elem.PP_CODE;
                            if(elem.DCNOUT != null && !isNaN(elem.DCNOUT) && elem.DCNOUT != "" && elem.DCNOUT != "Rejected" && $(thisTileDCN).find('[id^="hdnSelectedBank"]').val() == "") {
                                $(thisTileDCN).find('[id^="hdnSelectedBank"]').val(elem.PP_CODE);
                            }
                            if (elem.PP_CODE == "CITI") {
                                if(isNonBestPrice) {
                                    if(elem.DCNOUT != null && !isNaN(elem.DCNOUT) && elem.DCNOUT != "" && elem.DCNOUT != "Rejected" && ($(thisTileDCN).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectDCN.CurrentTileID + "_" + itr + "'>" + "Citi" + "</button></td>";
                                    }
                                    else if(elem.DCNOUT != null && !isNaN(elem.DCNOUT) && elem.DCNOUT != "" && elem.DCNOUT != "Rejected") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectDCN.CurrentTileID + "_" + itr + "'>" + "Citi" + "</td>";
                                    }
                                    else {
                                        str = str + "<td>" + "Citi" + "</td>";
                                    }
                                }
                                else {
                                    str = str + "<td";
                                    if(itr == 0 && elem.DCNOUT != null && !isNaN(elem.DCNOUT) && elem.DCNOUT != "" && elem.DCNOUT != "Rejected") {
                                        str = str + " class='bestPriceStyle'"
                                    }
                                    str = str + ">Citi</td>";
                                }
                            } else {
                                if(isNonBestPrice) {
                                    if(elem.DCNOUT != null && !isNaN(elem.DCNOUT) && elem.DCNOUT != "" && elem.DCNOUT != "Rejected" && ($(thisTileDCN).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectDCN.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</button></td>";
                                    }
                                    else if(elem.DCNOUT != null && !isNaN(elem.DCNOUT) && elem.DCNOUT != "" && elem.DCNOUT != "Rejected") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectDCN.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</td>";
                                    }
                                    else {
                                        str = str + "<td>" + elem.PP_CODE + "</td>";
                                    }
                                }
                                else {
                                    str = str + "<td";
                                    if(itr == 0 && elem.DCNOUT != null && !isNaN(elem.DCNOUT) && elem.DCNOUT != "" && elem.DCNOUT != "Rejected") {
                                        str = str + " class='bestPriceStyle'"
                                    }
                                    str = str + ">" + elem.PP_CODE + "</td>";
                                }
                            }
                            // END
                            $(thisTileDCN).find('[id^="DCNBanksRow"]').append(str);
                        } else {
                            str = str + "<td>--</td>"
                            $(thisTileDCN).find('[id^="DCNBanksRow"]').append(str);
                        }
                        if (elem.DCNOUT != null && !isNaN(elem.DCNOUT) && elem.DCNOUT != "" && elem.DCNOUT != "Rejected") {
                            // Added by Atharva - EQC Timers
                            // Added new if condition
                            if(isNonBestPrice) {
                                if($(thisTileDCN).find('[id^="hdnSelectedBank"]').val() == elem.PP_CODE) {
                                    str2 = str2 + "<td class='priceBackground";

                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023
                                    if(parseFloat(elem.DCNOUT).toFixed(2) <0){
                                        if(itr == 0) {
                                            str2 = str2 + " negativeprice";
                                        }
                                    }else{
                                        if(itr == 0) {
                                            str2 = str2 + " bestPriceStyle";
                                        }
                                    }
                                    // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                    str2 = str2 + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectDCN.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DCNOUT).toFixed(2) + " % </button></td>" 
                                    $(thisTileDCN).find('[id^="DCNPrices"]').append(str2);
                                } else {
                                    str2 = str2 + "<td";
                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                    if(parseFloat(elem.DCNOUT).toFixed(2) <0){
                                        if(itr == 0) {
                                            str2 = str2 + " class='negativeprice_nonbest'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton negativeprice_nonbest' onclick='setPriceEQC(this)' id='td" + repriceObjectDCN.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DCNOUT).toFixed(2) + " %</button></td>"
                                        $(thisTileDCN).find('[id^="DCNPrices"]').append(str2);

                                    }else{
                                        if(itr == 0) {
                                            str2 = str2 + " class='bestPriceStyle'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectDCN.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DCNOUT).toFixed(2) + " %</button></td>"
                                        $(thisTileDCN).find('[id^="DCNPrices"]').append(str2);
                                    }                                    
                                }
                            }
                            else {
                                str2 = str2 + "<td";
                                // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                if(parseFloat(elem.DCNOUT).toFixed(2) <0){
                                    if(itr == 0) {
                                        str2 = str2 + " class='negativeprice_nonbest'";
                                    }
                                }else{
                                    if(itr == 0) {
                                        str2 = str2 + " class='bestPriceStyle'";
                                    }
                                }
                                // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                str2 = str2 + ">" + parseFloat(elem.DCNOUT).toFixed(2) + " %</td>"; 
                                $(thisTileDCN).find('[id^="DCNPrices"]').append(str2);
                            }
                        } else {
                            str2 = str2 + "<td>-</td>"
                            $(thisTileDCN).find('[id^="DCNPrices"]').append(str2);
                        }
                 

                        itr++;
                        let strMinMaxNotionalLimit = '';
                        if (elem.PP_CODE != null) {
                            strMinMaxNotionalLimit = strMinMaxNotionalLimit + `<td style='font-size:12px !important;'>${K_M_B_Formatter(Number(elem.MinNotional))} / ${K_M_B_Formatter(Number(elem.MaxNotional))}</td>`;
                            $(thisTileDCN).find('[id^="minMaxNotionalLimitRow"]').append(strMinMaxNotionalLimit);
                        }
                        // END
                    });
                    // Added by Atharva - EQC Timers - START
                    // Should run only once
                    // if(!isTimerStarted["td" + repriceObjectDCN.CurrentTileID]) {
                    //     isTimerStarted["td" + repriceObjectDCN.CurrentTileID] = true;
                    //     startTimersEQC(repriceObjectDCN.CurrentTileID);
                    // }
                    // END
            }

            }).catch(error => {
                console.log(error);
                $(thisTileDCN).find('[id^="btnBestPriceDCN"]').attr("disabled", false); 
                clearInterval(uniqueIntervalID.value);
                mapleLoaderStop(thisTileDCN,'[id^="btnBestPriceDCN"]', false);
                uniqueIntervalID.value = "";
                $(thisTileDCN).find('[id^="OverlayDiv"]').hide();  // INT1FIN47-768 Gateway Markets Instant Pricing issue
                
                // $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val(JSON.stringify(finalObjDCN));
                // if (finalObjDCN != null || finalObjDCN != undefined) {
                //     // drawgraphDCN($(thisTileDCN).find('[id^="canvas"]').attr('id'));
                //     drawgraphDCN($(thisTileDCN).find('[id^="canvas"]').attr('id'));
                // }
                // INT1FIN47-768 Gateway Markets Instant Pricing issue
            })
            
            // END
        }
    } catch (error) {

        $(thisTileDCN).find('[id^="btnBestPriceDCN"]').attr("disabled", false); 
        sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        clearInterval(uniqueIntervalID.value);
        mapleLoaderStop(thisTileDCN,'[id^="btnBestPriceDCN"]', false); // INT1FIN47-768 Gateway Markets Instant Pricing issue

        uniqueIntervalID.value = ""
        $(thisTileDCN).find('[id^="BookTradeDCN"]').attr("disabled", false);
        // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
        $(thisTileDCN).find('[id^="btnEmailQuote"]').attr("disabled", true);
        $(thisTileDCN).find('[id^="BookTradeDCN"]').attr("disabled", true)

        console.log("getFinalQuoteResponseDCN : " + error.message);
        

        // $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val(JSON.stringify(finalObjDCN));
        // if (finalObjDCN != null || finalObjDCN != undefined) {
        //     drawgraphDCN($(thisTileDCN).find('[id^="canvas"]').attr('id'));
        // }
        // sessionStorage.setItem("quoteToken_" + thisTileDCN.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileDCN.id.match(/\d+$/)[0]));
        // sessionStorage.setItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]));
        // INT1FIN47-768 Gateway Markets Instant Pricing issue

    } finally {
       
    }
}

// To book trade
function BooktradeDCN(that,suitabilityCheck,redirectOrder) { // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
    try {

        // startLoader();

        TileId = that.id.match(/\d+$/)[0];
        thisTileDCN = document.getElementById("td" + TileId);
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
            $(thisTileDCN).find('[id^="DCNBanksRow"]').children().each(function() {
                if($(thisTileDCN).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
            mapleOrderLoaderStop(thisTileDCN);
            return false;
        }
        // END

        let AllocationDetails=[];

        $(thisTileDCN).find("select.ChildrenddlBookingCenter").each(function(index, element){

            if ($(this).parent().prev().find(".childrenCheckBoxBooking")[0].checked) {

            AllocationDetails.push({

            "RMName": $(element).parent().parent().find('[id^="ddlRMName"]').val(),
            "CustBranch": element.value,
            "Notional":$(element).parent().parent().find('[id^="txtHeaderNotional"]').val().split('.')[0].replace(/\,/g, "")

            })

         }
        })

        // Added for upfront% in order blotter // JIRA ID - CFINT-905 // 20 Oct 2020 //

        // let marginDCN;
        
        // if ($(thisTileDCN).find('[id^="ddlSolveFor"]').val().trim() == "DIGITAL_STRIKE" || $(thisTileDCN).find('[id^="ddlSolveFor"]').val().trim().toUpperCase() == "COUPON") {
        //     marginDCN = (100 -  parseFloat($(thisTileDCN).find('[id^="IBPriceinputbox"]').val()));
        // }
        // else {
        //     // Added by Atharva - EQC Timers
        //     // Replaced 0 with selectedBankIndex
        //     marginDCN = (100 - JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[selectedBankIndex].DCNOUT);
        // }

        //END

        let limitPrice1 = "";
        let limitPrice2 = "";
        let limitPrice3 = "";
        let limitPrice4 = "";

        if($(thisTileDCN).find('[id^="ddlOrderTypeDCN"]').val().trim().toUpperCase() == "LIMIT"){

            if($(thisTileDCN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 0){

                limitPrice1 = $(thisTileDCN).find('[id^="txtLimitLevel"]').val().trim();

            }else if($(thisTileDCN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 1){

                 limitPrice2 = $(thisTileDCN).find('[id^="txtLimitLevel"]').val().trim();

            } else if($(thisTileDCN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 2){

                 limitPrice3 = $(thisTileDCN).find('[id^="txtLimitLevel"]').val().trim();
                 
            } else if($(thisTileDCN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 3){

                limitPrice4 = $(thisTileDCN).find('[id^="txtLimitLevel"]').val().trim();
                
            }            
        }

            //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

            let _confirmReason = "";

            if(selectedBankIndex>0){
    
                 if($(thisTileDCN).find('[id^="ddlNONBEST"]').val() != "NONBEST_CUSTOM"){
    
                     _confirmReason = $(thisTileDCN).find('[id^="ddlNONBEST"]').text();
         
                 }else{
         
                     _confirmReason =  $(thisTileDCN).find('[id^="txtNONBEST"]').val(); 
                     
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
             if ($(thisTileDCN).find('[id^="rbRowSuitabilityToggle"]')[0].checked) {
                 _chkSuitability = "NO";
                 if ($(thisTileDCN).find('[id^="ddlReason"]').val().trim().includes("SUTSKP_CUSTOM")) { // Added by RizwanS | JIRA-LGTGTWINT-1830
                     _reasonmsg = $(thisTileDCN).find('[id^="txtSpecifyReason"]').val();
                 }else{
                     _reasonmsg = $(thisTileDCN).find('[id^="ddlReason"]').val();
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
               orderQty: $(thisTileDCN).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
               type:$(thisTileDCN).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
               limitPrice1: limitPrice1,
               limitPrice2: limitPrice2,
               limitPrice3: limitPrice3,
               limitPrice4: limitPrice4,
               QuoteRequestId: JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId,
               loginUser: sessionStorage.getItem("EQC_UserName").toString(),
               margin: "0.00",
               clientPrice: "0.00",//(parseFloat(JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[selectedBankIndex].DCNOUT) + parseFloat(100 - JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[0].DCNOUT)).toFixed(2),
               yield: "",
               bookingBranch: $(thisTileDCN).find('[id^="ddlBookingBranch"]').val(),
               rmNameForOrderConfirmation: $(thisTileDCN).find('[id^="ddlRMName"]').val(),
               dealerNotificationEmailID: $(thisTileDCN).find('[id^="txtComment"]').val(),
               orderComment: $(thisTileDCN).find('[id^="txtComment"]').val(),
               confirmationReason: _confirmReason,
               advisoryReason: $(thisTileDCN).find('[id^="txtComment"]').val(),
               preTradeXml: preTradeXml,
               //chkSuitability:$(thisTileDCN).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
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
                "orderQuantity":$(thisTileDCN).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "OrderType":$(thisTileDCN).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
                "LimitPrice1": limitPrice1,
                "LimitPrice2": limitPrice2,
                "LimitPrice3": limitPrice3,
                "LimitPrice4": limitPrice4,
                "QuoteRequestId":JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId,
                "PoolID": "",
                "RedirectOrderID": "",
                "OrderComment":  $(thisTileDCN).find('[id^="txtComment"]').val(),
                "Margin": "0.00",//marginDCN,
                "Notional": $(thisTileDCN).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "ClientPrice": "0.00",//(parseFloat(JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[selectedBankIndex].DCNOUT) + parseFloat(100 - JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[0].DCNOUT)).toFixed(2),
                "ClientYield": "",
                "BookingBranch": $(thisTileDCN).find('[id^="ddlBookingBranch"]').val(),
                "RMEmailIdforOrderConfirm": "",
                "ConfirmReason":  _confirmReason, //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message
                "PreTradeXml": "",
                "AdvisoryReason": "",
                // "UserRole": _reasonmsg, // Added Chaitanya M | For checking the suitability reason | Ref:LGTGTWINT-603 | 12-Jan-2023
                "RMNameforOrderConfirm": $(thisTileDCN).find('[id^="ddlRMName"]').val(),
                "CustomerID": "",
                // "chkSuitability":$(thisTileDCN).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
                "chkSuitability":_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                "SuitabilityReason":_reasonmsg, // Added by RizwanS | JIRA-LGTGTWINT-1830
                "IntendedSpread": "",
                "AllocationDetails": AllocationDetails,
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": TileId,
                "UserRole" : isEQCDealer === true ? 'Dealer' : isIA=== true ? 'IA' : 'RM' , // Added by RizwanS | JIRA-LGTGTWINT-1830
            
            }

        }
 
        mapleOrderLoaderStart(thisTileDCN);

        request_getDataFromAPI(bookObject, clientConfigdata.CommonMethods.NodeServer + orderMethodName).then(bookObject => {

            // endLoader();

            thisTileDCN = document.getElementById("td" + bookObject.CurrentTileID);

            TileId = bookObject.CurrentTileID;

            var bookstring = bookObject['responseData'];
            
            var OrderStatus = bookObject['message'];

            if (OrderStatus.toUpperCase() === clientConfigdata.EQCCommonMethods.EQC_BOOK_TRADE_RESPONSE_DETAILS.toUpperCase()) {

                // $(thisTileDCN).find('[id^="hdnBlotterURLDCN"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                // $(thisTileDCN).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradeEQDCN" + TileId, bookstring, "DivOverlayEQDCN");
                $(thisTileDCN).find('[id^="hdnfinalTokenDCN"]').val("");
                $(thisTileDCN).find('[id^="OverlayDiv"]').hide();
                clearPricerTable(thisTileDCN);
          
            } else{

                if(OrderStatus == "" || OrderStatus == null || OrderStatus==undefined){

                    OrderStatus = "Order Execution Failed!";
                }

                booktradePopup(that, "booktradeEQDCN" + TileId, OrderStatus, "DivOverlayEQDCN");
                $(thisTileDCN).find('[id^="hdnfinalTokenDCN"]').val("");
                $(thisTileDCN).find('[id^="OverlayDiv"]').hide();
                clearPricerTable(thisTileDCN);
            }

             mapleOrderLoaderStop(thisTileDCN);
             sessionStorage.removeItem("quoteResponse_" + thisTileDCN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
             $(thisTileDCN).find('[id^="btnBestPriceDCN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue 
             clearInterval($(thisTileDCN).find('[id^="hdnintervalID"]').val());
             mapleLoaderStop(thisTileDCN,'[id^="btnBestPriceDCN"]', false);

            // Added by Atharva - EQC Timers - START
            $(thisTileDCN).find('[id^="DCNPrices"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            $(thisTileDCN).find('[id^="DCNBanksRow"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileDCN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileDCN).find('[id^="BookTradeDCN"]').attr("disabled", true);
            // END

            
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileDCN).find('[id^="EQCRfqidpnl"]').hide();
            $(thisTileDCN).find('[id^="RFQIDEQC"]').html("");
            //End

        }).catch(error => { console.log(error); })
    } catch (er) {
        console.log(er.message);
        booktradePopup(that, "booktradeEQDCN" + TileId, "Order may have got executed or may have failed. Contact support!", "DivOverlayEQDCN");
        $(thisTileDCN).find('[id^="loader_DCN"]').hide();
        // endLoader();
        mapleOrderLoaderStop(thisTileDCN);

    } finally {

    }
}

var dialogBoxDCN = null;
function emailQuoteDCN(that) {
    try {

        thisTileDCN= $(that).parents(".sorting")[0];
    
        let pricingRow = "";
        pricingRow = $(thisTileDCN).find("table.pricerTable .pricesRow")[0];
        mapleOrderLoaderStart(thisTileDCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
    
        if (pricingRow.cells[0].innerText.trim().toString() === "-") {
          openValidationpopup('',"No price available for mailing!"); // Changed for Change quote mail validation from "Invalid Price" to "No price available for mailing!" | Ref: LGTGTWINT-1195 | Chaitanya M | 25-jan-2023
          return false;
        }

        //create email pop up here 
        let strEmail =``;
        let emailPriceStream =JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val());
        console.log('email price stream object ', emailPriceStream);

        // Added for Email Quotes popup label for strike, coupon and IB Pricer | Ref: LGTGTWINT-1134 | Chaitanya M | 25-jan-2023
        let DCNsolveforvalue="";
        if(globalSolveForValueDCN =="DIGITAL_STRIKE"){
            DCNsolveforvalue = " Strike (%)";
        }else if(globalSolveForValueDCN =="COUPON"){
            DCNsolveforvalue = "  Coupon (%)";
        }else if(globalSolveForValueDCN =="PRICE"){
            DCNsolveforvalue = " IB Price (%)";
        }
        //End
        strEmail=strEmail+`<table class='emailTable'><tr><td class='payOff_Features'>
        <input type='checkbox' class='chkBoxParent_Email_PPCode' onchange='emailParentCheckboxChanged(this)' >
        Issuer</td><td class='payOff_Features'>${DCNsolveforvalue}</td></tr>`; // Changed for Email Quotes popup label for strike, coupon and IB Pricer | Ref: LGTGTWINT-1134 | Chaitanya M | 25-jan-2023

        for (let e of emailPriceStream){
            if(e.DCNOUT.trim().toUpperCase()!=='REJECTED' && e.DCNOUT.trim().toUpperCase()!=='' && e.DCNOUT.trim().toUpperCase()!=='UNSUPPORTED' ){ // Changed the condition for handling Unsupported response | Ref: LGTGTWINT-1321 | Chaitanya M | 06 Feb 2023
                        strEmail=strEmail+`<tr><td style='width:40px;padding:15px'><input type='checkbox' class='chkBox_Email_PPCode'  onchange='emailChildrenCheckboxChanged(this)' > ${e.PP_CODE}</td><td style='width:40px;padding:15px'>${e.DCNOUT}</td></tr>`;
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
        if(dialogBoxDCN===null)
        {
            dialogBoxDCN= $(thisTileDCN).find('[id^="emailDialog_DCN"]')[0];
            $(thisTileDCN).find('[id^="emailDialog_DCN"]').empty().append(strEmail);

            $(dialogBoxDCN).dialog({
                resizable: false,
                height: "auto",
                width: 320,
                modal: true,
                open: function (event, ui) { // Added for LGTGTWINT-1283 || Email popup on top change | Chaitanya M | 08 Feb 2023
                    $('.ui-widget.ui-widget-content').css('z-index',999);                    
                },     
                //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                close: function (event, ui){
                    mapleOrderLoaderStop(thisTileDCN);
                },      
                //End
                buttons: {
                    "Mail Quote": function() {
                        //mail single selected rfq 

                        //  $( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    
                        var Email_PPList =[];
                        var RFQIDList=[];
                        var __mailRFQ=[];
            
                        if($(document).find('.ui-dialog').find('[id^="emailDialog_DCN"]').find('.chkBox_Email_PPCode').length>0)
                        {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_DCN"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                                if(checkboxControl.checked){
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val()).filter(function(RFQ_OBJECT){
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

                        if ($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val() != undefined && $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val().trim()!='')
                        var RFQID = JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;
            
                        if (RFQID != undefined && RFQID != ''){
                            // MailBestQuote(thisTileDCN.id.match(/\d+$/)[0], JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[0].EP_ER_QuoteRequestId);
                        
                            if(__mailRFQ == ""){

                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileDCN, "booktradeEQDRA" + thisTileDCN.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayEQDRA");
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            }

                            $( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileDCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                                "rfqId":__mailRFQ.toString(), //RFQID,
                                "CurrentTileID":thisTileDCN.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType:"English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileDCN = document.getElementById("td" +TileId);
                                mapleOrderLoaderStop(thisTileDCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                booktradePopup(thisTileDCN, "booktradeEQDCN" + TileId, data.message, "DivOverlayEQDCN");
                            
                            }).catch(error=>{
                            console.log(error);
                        
                            })
                        }
                        else{
                            mapleOrderLoaderStop(thisTileDCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('','Invalid RFQ ID ');
                        }
             
                    },
                    "Mail All Quotes": function() {
                        //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023

              
                        var Email_PPList =[];
                        var RFQIDList=[];
                        var __mailRFQ=[];
            
                        if($(document).find('.ui-dialog').find('[id^="emailDialog_DCN"]').find('.chkBox_Email_PPCode').length>0)
                        {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_DCN"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                                //  if(checkboxControl.checked){
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val()).filter(function(RFQ_OBJECT){
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


                        if ($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val() != undefined && $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val().trim()!='')
                        var RFQID = JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

                        if (RFQID != undefined && RFQID != ''){

                            if(__mailRFQ == ""){

                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileDCN, "booktradeDCN" + thisTileDCN.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayfcn");
                                mapleOrderLoaderStop(thisTileDCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            }

                            $( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileDCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            // MailBestQuote(thisTileDCN.id.match(/\d+$/)[0], JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[0].EP_ER_QuoteRequestId);
                            request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                            "rfqId":__mailRFQ.toString(), //RFQID,
                            "CurrentTileID":thisTileDCN.id.match(/\d+$/)[0],
                            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                            QuoteMailType:"English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileDCN = document.getElementById("td" +TileId);
                                mapleOrderLoaderStop(thisTileDCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                booktradePopup(thisTileDCN, "booktradeEQDCN" + TileId, data.message, "DivOverlayEQDCN");
                            
                            }).catch(error=>{
                            console.log(error);
                        
                            })
                        }
                        else{
                            mapleOrderLoaderStop(thisTileDCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('','Invalid RFQ ID ');      
                        }       

                        return true;

                    //email all quotes here 

                    }
                }
            });
            $(dialogBoxDCN).dialog('open');

        }else
        {
            $(document).find('.ui-dialog').find('[id^="emailDialog_DCN"]').empty().append(strEmail);

            $(dialogBoxDCN).dialog('open');

            var Email_PPList =[];
            var RFQIDList=[];
            var __mailRFQ=[];
            
            if($(document).find('.ui-dialog').find('[id^="emailDialog_DCN"]').find('.chkBox_Email_PPCode').length>0)
            {
                $(document).find('.ui-dialog').find('[id^="emailDialog_DCN"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                    if(checkboxControl.checked){
                    Email_PPList.push($(checkboxControl).parent().text().trim())

                    RFQIDList.push(JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val()).filter(function(RFQ_OBJECT){
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

            if ($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val() != undefined && $(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val().trim()!='')
            var RFQID = JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

            if (RFQID != undefined && RFQID != ''){
                // MailBestQuote(thisTileDCN.id.match(/\d+$/)[0], JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[0].EP_ER_QuoteRequestId);
                if(__mailRFQ == ""){

                    // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    //booktradePopup(thisTileDCN, "booktradeDCN" + thisTileDCN.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayfcn");
                    mapleOrderLoaderStop(thisTileDCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    openValidationpopup('','No price selected for mailing !');
                    //End
                    return false;
                }    
                request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                    "rfqId":__mailRFQ.toString(),//RFQID,
                    "CurrentTileID":thisTileDCN.id.match(/\d+$/)[0],
                    "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                    QuoteMailType:"English"
                }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                console.log(data);
                TileId = data.CurrentTileID;
                thisTileDCN = document.getElementById("td" +TileId);
                mapleOrderLoaderStop(thisTileDCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                booktradePopup(thisTileDCN, "booktradeEQDCN" + TileId, data.message, "DivOverlayEQDCN");
                      
                }).catch(error=>{
                console.log(error);
            
                })
            }
            else{
                mapleOrderLoaderStop(thisTileDCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                openValidationpopup('','Invalid RFQ ID ');
            }
        }
        $(thisTileDCN).find('[id^="DCNBanksRow"]').children().each(function() {
           if($(thisTileDCN).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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

function validateOrderDCN(thisTileDCN,_flag){    // LGTGTWINT-1279 : Instant Pricing : Order booking valdations.

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
            $(thisTileDCN).find('[id^="DCNBanksRow"]').children().each(function() {
                if($(thisTileDCN).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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

        if ($(thisTileDCN).find('[id^="ddlSolveFor"]').val().trim() == "DIGITAL_STRIKE") {
      
         if($(thisTileDCN).find('[id^="kiinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[selectedBankIndex].DCNOUT)< parseFloat($(thisTileDCN).find('[id^="kiinputbox"]').val())){
                ValidateField($(thisTileDCN).find('[id^="kiinputbox"]').attr("id"), "KI % of Initial should be less than strike(%)", thisTileDCN);
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                return false;
            }
        }
        
        if ($(thisTileDCN).find('[id^="hdnfinalTokenDCN"]').val() == "" || $(thisTileDCN).find('[id^="DCNPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileDCN).find('[id^="DCNPrices"]')[0].firstChild.innerHTML == "") {
            if(_flag == false){
                _validateOrderEQC = true; 
            }
           ValidateField($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').attr("id"), "Order Execution Failed!", thisTileDCN);
           return false;
        }
  
        if(parseFloat(JSON.parse($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').val())[selectedBankIndex].DCNOUT) <= 0){
            if(_flag == false){

                _validateOrderEQC = true; 
            }
            ValidateField($(thisTileDCN).find('[id^="hdnChartPricesDCN"]').attr("id"), "Prices can not be negative 0r zero, Order Execution Failed!", thisTileDCN);
            return false;
        }

    }catch(er){

        console.log(er.message);
    }

}

