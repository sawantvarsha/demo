var token = "";
var shareCount;
var QuoteObject;
var CouponFreq;
var arrDRA = [];
var maxDRA;
var finalResponseDataDRA;
var finalTokenDRA;
var repriceObjectDRA;
var TimerDRA = 0;
var finalObjDRA;
var idDRA = 19;
var globalDefaultSharesArrayDRA = ["AMZN.OQ"] //LGTGTWINT-1723 Instant Pricer : Remove FB.OQ ticker from default notes payoff's.
// LGTGTWINT-1808 | Instant Pricing | Share suggestion dropdown missing for single underlying products

// To load the DRA tile
function onLoadDRA(currId,isProductCopiedDRA) {
    try {
        // Added logic for getting current tile //

        setDeafaultValuesDRA(currId,isProductCopiedDRA);
        thisTileDRA = document.getElementById("td" + currId);
        $(thisTileDRA).find('[id^="OverlayDiv"]').hide();

        sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
         $(thisTileDRA).find('[id^="btnBestPriceDRA"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        // clearInterval($(thisTileDRA).find('[id^="hdnintervalID"]').val());  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileDRA,'[id^="btnBestPriceDRA"]', false);
        clearPricerTable(thisTileDRA);  
        // // END

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileDRA).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
        $(thisTileDRA).find('[id^="RFQIDEQC"]').html("");
        //End


        //Added for Clone tile issue | LGTGTWINT-625 | Chaitanya M | 14 Feb 2023 

        checkSolveForDRA($(thisTileDRA).find('[id^="ddlSolveForDRA"]').val(), thisTileDRA);
        $(thisTileDRA).find('[id^="ddlSolveForDRA"]').on('change', function (event) {
            thisTileDRA = $(this).parents('.sorting')[0];
            ChangeSolveForDRA($(this).val(), thisTileDRA);
        }); 
        // END

        //aded by rutika on 26/04/2022 for calculating tenor when changed in input box
         //Start

        $(thisTileDRA).find('[id^="tenor_DRA"]').on("change", function() {
            try {
             
                thisTileDRA = $(this).parents(".sorting")[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileDRA,"btnBestPriceDRA"); 
               $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val("")
               //End

                if( $(thisTileDRA).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_DRA"]').val()) > Number(DRAAllowedTenorinMonths) || $(this).parents(".sorting").find('[id^="tenor_DRA"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_DRA"]').val() == ""){
                        ValidateField($(thisTileDRA).find('[id^="tenor_DRA"]').attr("id"), "Please enter valid tenor.", thisTileDRA);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_DRA"]').val()) > Number(DRAAllowedTenorinYears) || $(this).parents(".sorting").find('[id^="tenor_DRA"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_DRA"]').val() == ""){
                        ValidateField($(thisTileDRA).find('[id^="tenor_DRA"]').attr("id"), "Please enter valid tenor.", thisTileDRA);
                        return false;
                    }
                }
                // calculateTenor(currId); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023         

            } catch (error) {
                console.log(error);
            }
        });

        //Added for LGTGTWINT-1077 Instant Pricing: Input length for all fields for all payoffs | Chaitanya M | 28-01-2023
        $(thisTileDRA).find('[id^="tenor_DRA"]').on("keyup", function (){            

             InputLengthCheckEQC(thisTileDRA, "tenor_DRA",3);
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileDRA).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileDRA).find('[id^="RFQIDEQC"]').html("");
            //End
        });

        $(thisTileDRA).find("[id^='strikeipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileDRA, "strikeipbox",8); //Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            // $(thisTileDRA).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileDRA).find('[id^="RFQIDEQC"]').html("");
            //End
        
        });

        $(thisTileDRA).find("[id^='txtupfrontDRA']").on("keyup", function(){
             InputLengthCheckEQC(thisTileDRA, "txtupfrontDRA",6); //Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
              //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            // $(thisTileDRA).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileDRA).find('[id^="RFQIDEQC"]').html("");
            //End
        
        });

        $(thisTileDRA).find("[id^='kiinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileDRA, "kiinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
              //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            // $(thisTileDRA).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileDRA).find('[id^="RFQIDEQC"]').html("");
            //End
        
        });

        $(thisTileDRA).find("[id^='koinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileDRA, "koinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
             //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            //  $(thisTileDRA).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
             $(thisTileDRA).find('[id^="RFQIDEQC"]').html("");
             //End

        });
        
        $(thisTileDRA).find("[id^='couponipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileDRA, "couponipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            // $(thisTileDRA).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileDRA).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileDRA).find("[id^='IBPriceipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileDRA, "IBPriceipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            // $(thisTileDRA).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileDRA).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileDRA).find("[id^='noncallinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileDRA, "noncallinputbox",3);
         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            // $(thisTileDRA).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileDRA).find('[id^="RFQIDEQC"]').html("");
            //End
            
        });
        
        //End

        $(thisTileDRA).find('[id^="tenorddl"]').on("change", function () {
            try {
                
                thisTileDRA = $(this).parents(".sorting")[0];
                let currId=   thisTileDRA.id.match(/\d+$/)[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileDRA,"btnBestPriceDRA");  
               $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val("")
               //End

                if( $(thisTileDRA).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_DRA"]').val()) > Number(DRAAllowedTenorinMonths)){
                        ValidateField($(thisTileDRA).find('[id^="tenor_DRA"]').attr("id"), "Please enter valid tenor.", thisTileDRA);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_DRA"]').val()) > Number(DRAAllowedTenorinYears)){
                        ValidateField($(thisTileDRA).find('[id^="tenor_DRA"]').attr("id"), "Please enter valid tenor.", thisTileDRA);
                        return false;
                    }
                }
    
                // calculateTenor(currId); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
               
            } catch (error) {
                console.log(error);
            }
        });

        //End
        
        $(thisTileDRA).find("div.card input[type='text'],div.card input[type='search'],div.card select").on('change', function () {

            thisTileDRA = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileDRA).find('[id^="btnBestPriceDRA"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileDRA).find('[id^="hdnintervalID"]').val());
           $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            clearPricerTable(thisTileDRA);
            mapleLoaderStop(thisTileDRA,'[id^="btnBestPriceDRA"]', false);
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileDRA).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileDRA).find('[id^="BookTradeDRA"]').attr("disabled", true);          
            $(thisTileDRA).find('[id^="OrderEmail"]').attr("disabled",true);  //LGTGTWINT-1981 || RizwanS || 12 May 2023  
         })
 
        $(thisTileDRA).find(" div.card .amtPopup").on('select', function () { // INT1FIN47-768 Gateway Markets Instant Pricing issue
          
            thisTileDRA = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileDRA).find('[id^="btnBestPriceDRA"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileDRA).find('[id^="hdnintervalID"]').val());
           $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val("")// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            clearPricerTable(thisTileDRA);
            mapleLoaderStop(thisTileDRA,'[id^="btnBestPriceDRA"]', false);
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileDRA).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileDRA).find('[id^="BookTradeDRA"]').attr("disabled", true);    
            $(thisTileDRA).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023    
             
        })

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        //Start      
        $(thisTileDRA).find('div.card .ddlShares').on("focusout", function (){                
              
            validatesharebasket(thisTileDRA,"shareNameDRA");        
            sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileDRA,"btnBestPriceDRA");  
           $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileDRA).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileDRA).find('[id^="BookTradeDRA"]').attr("disabled", true);
            $(thisTileDRA).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023   
                                     
                
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        $(thisTileDRA).find("div.card .ddlShares").on("keydown", function(){
            
            $("#bodyDiv").hide(); 
            //Added for LGTGTWINT-1292 | Chaitanya M | 28 Feb 2023                    
            _ccylistDRA = getExchangeAndCcyFromBasket($(thisTileDRA).find('[id^="shareDivDRA"]')[0], "share");
            if(_ccylistDRA.length >=4){
                return false;
            }  
            sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileDRA,"btnBestPriceDRA"); 
           $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023n
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileDRA).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileDRA).find('[id^="BookTradeDRA"]').attr("disabled", true);       
            $(thisTileDRA).find('[id^="OrderEmail"]').attr("disabled",true);  //LGTGTWINT-1981 || RizwanS || 12 May 2023  
        }); 

        //Added for Clone tile issue | LGTGTWINT-625 | Chaitanya M | 14 Feb 2023
 
        $(thisTileDRA).find('[id^="ddlDRAType"]').on("change", function() {
            try {
                thisTileDRA = $(this).parents(".sorting")[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileDRA,"btnBestPriceDRA"); 
               $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val("");
               //End
               
                validation_clear(); //To Remove highlighted part if no error 
                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);

            } catch (error) {
                console.log(error.message);
            }
        });

        //END

        shareCount = 0;
        $(thisTileDRA).find('[id^="shareDivDRA"]').click(function() {
            $(this).find('input[type="search"]').focus();
        });

        // Check for upfront/IB Price 

        $(thisTileDRA).find('[id^="txtupfrontDRA"]').on("change", function() {
            try {
                 
             
            thisTileDRA = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileDRA,"btnBestPriceDRA");  
           $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val("");
           //END

            if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

                let _ibprice =   parseFloat(100 -  Number($(thisTileDRA).find('[id^="txtupfrontDRA"]').val())).toFixed(2);;

                $(thisTileDRA).find('[id^="IBPriceipbox"]').val(_ibprice);

            }

            } catch (error) {
                console.log(error.message);
            }
        });

        $(thisTileDRA).find('[id^="IBPriceipbox"]').on("change", function() {
            try { 
             
            thisTileDRA = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileDRA,"btnBestPriceDRA");  
           $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val("");
           //End

            if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

                let _upfront =  parseFloat(100 -  Number($(thisTileDRA).find('[id^="IBPriceipbox"]').val())).toFixed(2);

                $(thisTileDRA).find('[id^="txtupfrontDRA"]').val(_upfront);
            }
            } catch (error) {
                console.log(error.message);
            }
        });

        //Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
        $(thisTileDRA).find('[id^="ContractAmtDRA"]').on("change", function(){
        // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
        sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileDRA,"btnBestPriceDRA");  
           $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val("");
           //End
            if($(thisTileDRA).find('[id^="ContractAmtDRA"]').val()== "" || $(thisTileDRA).find('[id^="ContractAmtDRA"]').val()==null || $(thisTileDRA).find('[id^="ContractAmtDRA"]').val()=="0" ){
              $(thisTileDRA).find('[id^="ContractAmtDRA"]').val("0"); 
            }    
            return false;         
          }); 


    } catch (error) {
        console.log(error);
    }
}

// Added for Clone tile issue | LGTGTWINT-625 | Chaitanya M | 14 Feb 2023
function checkSolveForDRA(solveFor,thisTileDRA,calledFromIndexDRA) {
    try {
        if (calledFromIndexDRA != undefined){
            if (solveFor.trim().includes("Conversion_Strike")) {
                $(thisTileDRA).find('[id^="strikeipbox"]').prop('disabled', true);
                $(thisTileDRA).find('[id^="IBPriceipbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="couponipbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="txtupfrontDRA"]').prop('disabled', false);  
                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);
            } else if (solveFor.trim().includes("Price")) {
                $(thisTileDRA).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="IBPriceipbox"]').prop('disabled', true);
                $(thisTileDRA).find('[id^="couponipbox"]').prop('disabled', false);
		        $(thisTileDRA).find('[id^="txtupfrontDRA"]').prop('disabled', true); //LGTGTWINT-1095
                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);       
            } else if (solveFor.trim().includes("Coupon") ) {
                $(thisTileDRA).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="IBPriceipbox"]').prop('disabled', false);  
                $(thisTileDRA).find('[id^="couponipbox"]').prop("disabled", true);
                $(thisTileDRA).find('[id^="txtupfrontDRA"]').prop('disabled', false);  
                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);
            }
        }
        else {
            if (solveFor.trim().includes("Conversion_Strike")) {
                $(thisTileDRA).find('[id^="strikeipbox"]').prop("disabled", true);
                $(thisTileDRA).find('[id^="IBPriceipbox"]').val("98.50").prop("disabled", false); //LGTGTWINT-1095
                $(thisTileDRA).find('[id^="couponipbox"]').val("8.00").prop("disabled", false);
                $(thisTileDRA).find('[id^="txtupfrontDRA"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);

            } else if (solveFor.trim().includes("Price")) {
                $(thisTileDRA).find('[id^="strikeipbox"]').val("85.00").prop("disabled", false);
                $(thisTileDRA).find('[id^="IBPriceipbox"]').prop("disabled", true);
                $(thisTileDRA).find('[id^="couponipbox"]').val("8.00").prop("disabled", false);
                $(thisTileDRA).find('[id^="txtupfrontDRA"]').prop('disabled', true); //LGTGTWINT-1095
                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);
            } else if (solveFor.trim().includes("Coupon")) {
                $(thisTileDRA).find('[id^="strikeipbox"]').val("85.00").prop("disabled", false);
                $(thisTileDRA).find('[id^="IBPriceipbox"]').val("98.50").prop("disabled", false); //LGTGTWINT-1095
                $(thisTileDRA).find('[id^="couponipbox"]').prop("disabled", true);
                $(thisTileDRA).find('[id^="txtupfrontDRA"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);
            }
        }
             
    } catch (error) {
        console.log(error.message)
    }
}

//Added for Clone tile issue| LGTGTWINT-625 | Chaitanya M | 14 Feb 2023
function checkKOKITypeDRA(KOKIType, thisTileDRA, calledFromIndex) {
    try {
        if(calledFromIndex != true){
            if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
                $(thisTileDRA).find('[id^="koinputbox"]').prop('disabled', false);
                //Chaitanya M 16-March-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
                //START
                $(thisTileDRA).find('[id^="kiinputbox"]').prop("disabled", true);
               //END
                $(thisTileDRA).find('[id^="noncallinputbox"]').prop('disabled', false);
            }  else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
                $(thisTileDRA).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="noncallinputbox"]').prop('disabled', false);
            }
            else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") { //LGTCLI-332  | Chaitanya M | 23 Feb 2023
                $(thisTileDRA).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTileDRA).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="noncallinputbox"]').prop('disabled', true);
            } else if (KOKIType == "NOKINOKO") {
                $(thisTileDRA).find('[id^="koinputbox"]').prop("disabled", true);
                //Chaitanya M 16-March-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
                //START
                $(thisTileDRA).find('[id^="kiinputbox"]').prop('disabled', true);
                $(thisTileDRA).find('[id^="noncallinputbox"]').prop('disabled', true);
            }
        }else{
            if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
                $(thisTileDRA).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="kiinputbox"]').prop("disabled", true);
                $(thisTileDRA).find('[id^="noncallinputbox"]').prop('disabled', false);
            } else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
                $(thisTileDRA).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="noncallinputbox"]').prop('disabled', false);
            }
            else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") { //LGTCLI-332  | Chaitanya M | 23 Feb 2023
                $(thisTileDRA).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTileDRA).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="noncallinputbox"]').prop('disabled', true);
            } else if (KOKIType == "NOKINOKO") {
                $(thisTileDRA).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTileDRA).find('[id^="kiinputbox"]').prop('disabled', true);
                //END
                $(thisTileDRA).find('[id^="noncallinputbox"]').prop('disabled', true);
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}
function checkupfrontPriceDRA(thisTileDRA){

    try
    {
        let _ibprice =   parseFloat(100 -  Number($(thisTileDRA).find('[id^="txtupfrontDRA"]').val())).toFixed(2);;

        $(thisTileDRA).find('[id^="IBPriceipbox"]').val(_ibprice);
    
        let _upfront =  parseFloat(100 -  Number($(thisTileDRA).find('[id^="IBPriceipbox"]').val())).toFixed(2);
    
        $(thisTileDRA).find('[id^="txtupfrontDRA"]').val(_upfront);

    }catch(er){
        
        console.log(er.message);
    }   
}

// To set default values for DRA
function setDeafaultValuesDRA(currId,isProductCopiedDRA) {
    try {
        // Added logic for getting current tile //

        thisTileDRA = document.getElementById("td" + currId);


         //Configured UI fileds Start :: || 08 Feb 2023

         if(DRAFCNUpfrontYN.toUpperCase() == "YES" || DRAFCNUpfrontYN.toUpperCase().includes("Y")){

            $(thisTileDRA).find('[id^="txtupfrontDRA"]').val("0.00"); //LGTGTWINT-1095
            $(thisTileDRA).find('[id^="txtupfrontDRA"]').hide(); //UI filed
            $(thisTileDRA).find('[id^="upfrontuilbl"]').hide(); //UI label
            $(thisTileDRA).find('[id^="txtupfrontlbl"]').hide(); // hide label order popup
            $(thisTileDRA).find('[id^="txtupfrontVal"]').hide(); //Order popup filed
            
        }else{
            $(thisTileDRA).find('[id^="txtupfrontDRA"]').val("0.00");
        }
        // END

        $(thisTileDRA).find('[id^="ContractAmtDRA"]').val("1,000,000.00");
        $(thisTileDRA).find('[id^="ContractAmtDRA"]').attr('maxlength','14');
        $(thisTileDRA).find('[id^="strikeipbox"]').val("85.00");
        $(thisTileDRA).find('[id^="couponipbox"]').val("8.00");
        $(thisTileDRA).find('[id^="kiinputbox"]').val("65.00");
        $(thisTileDRA).find('[id^="koinputbox"]').val("105.00");
        $(thisTileDRA).find('[id^="tenor_DRA"]').val("6"); 
        $(thisTileDRA).find('[id^="IBPriceipbox"]').val("98.50"); //LGTGTWINT-1095
        $(thisTileDRA).find('[id^="Guaranteeipbox"]').val("1");
        callDropDownFunction($(thisTileDRA).find('[id^="shareName"]'), "DRA", currId);
        EQProductsFillCcy(thisTileDRA, "ddlDRACcy");
        document.querySelector("#" + $(thisTileDRA).find('[id^="tenor_DRA"]').attr("id")).selectedIndex = 2;
        clearPricerTable(thisTileDRA);
        $(thisTileDRA).find('[id^="shareNameCntrlDRA"]').html("");
        $(thisTileDRA).find('[id^="hiddenshareinputDRA"]').html("");
       
     
        if(!isProductCopiedDRA){
            for (let s=0;s<clientConfigdata.EQCDRA.MinSharesInBaskets;s++){
                createElementInBasket(thisTileDRA, 'shareDivDRA', sessionStorage.getItem(thisTileDRA.id)!=undefined?sessionStorage.getItem(thisTileDRA.id).split(" ")[s]:globalDefaultSharesArrayDRA[s]); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
            
            }
        }
       
        $(thisTileDRA).find('[id^="shareName"]')[0].placeholder = "";
        $(thisTileDRA).find('[id^="ddlDRACcy"]').val(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);
    } catch (error) {
        console.log(error);
    }
}
var globalSolveForValueDRA='';
// To get best price for DRA
function getBestPriceDRA(that) {
    try {
        // Added logic for getting current tile //

             //    var uniqueIntervalID;
             thisTileDRA = $(that).parents(".sorting")[0];

             console.log('Start Interval value =' + $(thisTileDRA).find('[id^="hdnintervalID"]').val());
     
            $(thisTileDRA).find('[id^="btnBestPriceDRA"]').attr("disabled", true); // INT1FIN47-768 Gateway Markets Instant Pricing issue

            var requestIDDRA = "";

            requestIDDRA = requestIDDRA + RequestIDGenerator(40);

            $(thisTileDRA).find('[id^="hdnRequestID"]').val(requestIDDRA);  //INT1FIN47-768 Gateway Markets Instant Pricing issue

            mapleLoaderStop(thisTileDRA,'[id^="btnBestPriceDRA"]', false);

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileDRA).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileDRA).find('[id^="RFQIDEQC"]').html("");
            //End

             globalSolveForValueDRA = $(thisTileDRA).find('[id^="ddlSolveForDRA"]').val().trim();
             
             clearInterval($(thisTileDRA).find('[id^="hdnintervalID"]').val());
          
             console.log('After clear Interval value =' + $(thisTileDRA).find('[id^="hdnintervalID"]').val());
     
             $(thisTileDRA).find('[id^="hdnintervalID"]').val("");
     
     
             TileId = that.id.match(/\d+$/)[0];
     
             sessionStorage.setItem("poolingTimer_" + TileId, 0);
             sessionStorage.setItem("pricingToggle" + TileId, false);
             thisTileDRA = document.getElementById("td" + TileId);
             productName = $($(that).parents(".sorting").find(".productName")).attr('id');
             console.log(TileId, thisTileDRA, productName);
     
             $(thisTileDRA).find('[id^="TBLDRA"]' + " td").each(function () {
                 //Clear prices || Tina K || 11-Sep-2019
                 $(this).html("-");
             })
             validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
             clearPricerTable(thisTileDRA); //To clear prices after clicking best price || Tina K || 20-Nov-2019
             //Validation conditions added : Tina Kshirsagar : 6-09-2019


             let tenorNumb = $(thisTileDRA).find("[id^='tenor_DRA']").val();
             let tenorstring = $(thisTileDRA).find("[id^='tenorddl']").val();
             let _tenor = tenorNumb + tenorstring;
     
             let _tenorinMonths = "";
     
             if(tenorstring != "M"){
     
                 _tenorinMonths =  parseFloat($(thisTileDRA).find('[id^="tenor_DRA"]').val()) * 12;
     
             }else{
     
                 _tenorinMonths =  parseFloat($(thisTileDRA).find('[id^="tenor_DRA"]').val());
             }


        //  Client Side Validation Added for all cases // 07-April-2020

        if ($(thisTileDRA).find('[id^="shareDivDRA"]')[0].childNodes.length <= 1) {     
            ValidateField($(thisTileDRA).find('[id^="shareDivDRA"]').attr('id'), "Please Enter Valid Shares", thisTileDRA);
            return false
        } else if ($.trim($(thisTileDRA).find('[id^="ContractAmtDRA"]').val()) == "" || $.trim($(thisTileDRA).find('[id^="ContractAmtDRA"]').val()) < 0) { // LGTGTWINT-1487 | Chaitanya M | 24 Feb 2023
            ValidateField($(thisTileDRA).find('[id^="ContractAmtDRA"]').attr("id"), "Please enter valid notional.", thisTileDRA); // LGTGTWINT-1487 | Chaitanya M | 24 Feb 2023
            return false;
        } else if ($.trim($(thisTileDRA).find('[id^="tenor_DRA"]').val()) == '' || parseFloat($(thisTileDRA).find('[id^="tenor_DRA"]').val()) <= 0) {
            ValidateField($(thisTileDRA).find('[id^="tenor_DRA"]').attr('id'), "Please Enter Valid Tenor.", thisTileDRA);
            return false
        } else if ($.trim($(thisTileDRA).find('[id^="ddlDRACcy"]').val()) == "") {
            ValidateField($(thisTileDRA).find('[id^="ddlDRACcy"]').attr("id"), "Please Select Valid Note Ccy", thisTileDRA);
            return false;
        } else if (($.trim($(thisTileDRA).find('[id^="koinputbox"]').val()) == "" || parseFloat($(thisTileDRA).find('[id^="koinputbox"]').val()) <= Number(DRAFCNMinKO) || parseFloat($(thisTileDRA).find('[id^="koinputbox"]').val()) > Number(DRAFCNMaxKO)) && $(thisTileDRA).find('[id^="koinputbox"]').prop("disabled") != true) {
            ValidateField($(thisTileDRA).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO (%) Initial.", thisTileDRA);
            return false;
        } else if (($.trim($(thisTileDRA).find('[id^="kiinputbox"]').val()) == "" || parseFloat($(thisTileDRA).find('[id^="kiinputbox"]').val()) <= 0) && $(thisTileDRA).find('[id^="kiinputbox"]').prop("disabled") != true) {
            ValidateField($(thisTileDRA).find('[id^="kiinputbox"]').attr("id"), "Please Enter Valid KI (%).", thisTileDRA);
            return false;
        } else if ($.trim($(thisTileDRA).find('[id^="Guaranteeipbox"]').val()) == "" || parseFloat($(thisTileDRA).find('[id^="Guaranteeipbox"]').val()) <= 0) {
            ValidateField($(thisTileDRA).find('[id^="Guaranteeipbox"]').attr("id"), "Guarantee coupon periods can not be 0 or negative.", thisTileDRA);
            return false;
        } else if (($(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "3M")) {
            ValidateField($(thisTileDRA).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid. ", thisTileDRA);
            return false;
        } else if (($(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "QUARTERLY" || $(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "1M")) {
            ValidateField($(thisTileDRA).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid. ", thisTileDRA);
            return false;
        } else if (($(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "9M")) {
            ValidateField($(thisTileDRA).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid. ", thisTileDRA);
            return false;
        } else if (($(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "6M")) {
            ValidateField($(thisTileDRA).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid.", thisTileDRA);
            return false;
        }else if($(thisTileDRA).find('[id^="noncallinputbox"]').val() <= 0 || $(thisTileDRA).find('[id^="noncallinputbox"]').val() == "") {
            ValidateField($(thisTileDRA).find('[id^="noncallinputbox"]').attr("id"), "Non Call can not be zero negative. ", thisTileDRA);
            return false;    
        // Added by RizwanS || LGTGTWINT-445 || 07 Dec 2022
        }else if($(thisTileDRA).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "MONTHLY")){
            if(parseFloat($(thisTileDRA).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths)){
                ValidateField($(thisTileDRA).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileDRA);
                return false;
            }
        } else if($(thisTileDRA).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY")){
            if(parseFloat($(thisTileDRA).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 2)){
                ValidateField($(thisTileDRA).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileDRA);
                return false;
            }
        } else if($(thisTileDRA).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "QUARTERLY")){
            if(parseFloat($(thisTileDRA).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 3)){
                ValidateField($(thisTileDRA).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileDRA);
                return false;
            }
        } else if($(thisTileDRA).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY")){
            if(parseFloat($(thisTileDRA).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 6)){
                ValidateField($(thisTileDRA).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileDRA);
                return false;
            }
        } else if($(thisTileDRA).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY")){
            if(parseFloat($(thisTileDRA).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 12)){
                ValidateField($(thisTileDRA).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileDRA);
                return false;
            }
        }

        // RizwanS || LGTGTWINT-2320 || 17 Aug 2023
        if (NotionalMinMaxCheck === "YES") {
            if(parseFloat($(thisTileDRA).find('[id^="ContractAmtDRA"]').val().replace(/,/g, "")) === 0){     
                ValidateField($(thisTileDRA).find('[id^="hdnQuoteID"]').attr('id'),"Please input non zero notional.",thisTileDRA); 
                return false;
            }
        }// END

        if ($(thisTileDRA).find('[id^="ddlSolveFor"]').val() == "Conversion_Strike") {
            if (parseFloat($(thisTileDRA).find('[id^="IBPriceipbox"]').val()) == "" || parseFloat($(thisTileDRA).find('[id^="IBPriceipbox"]').val()) <= 0 ) {  // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                ValidateField($(thisTileDRA).find('[id^="IBPriceipbox"]').attr("id"), "Price % must be greater than 0.", thisTileDRA);  // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                return false;
            } else if (parseFloat($(thisTileDRA).find('[id^="couponipbox"]').val()) == "" || parseFloat($(thisTileDRA).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileDRA).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileDRA).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon (%).", thisTileDRA);
                return false;
            } else if ($(thisTileDRA).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileDRA).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileDRA).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileDRA).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileDRA).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%).", thisTileDRA);
                return false;
            }
        } else if ($(thisTileDRA).find('[id^="ddlSolveFor"]').val() == "Coupon") {
            if (parseFloat($(thisTileDRA).find('[id^="strikeipbox"]').val()) == "" || parseFloat($(thisTileDRA).find('[id^="strikeipbox"]').val()) <= 0 ) {  // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                ValidateField($(thisTileDRA).find('[id^="strikeipbox"]').attr("id"), "Strike % must be greater than 0.", thisTileDRA);// LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                return false;
            } else if (parseFloat($(thisTileDRA).find('[id^="IBPriceipbox"]').val()) == "" || parseFloat($(thisTileDRA).find('[id^="IBPriceipbox"]').val()) <= 0 || parseFloat($(thisTileDRA).find('[id^="IBPriceipbox"]').val()) > 100) {
                ValidateField($(thisTileDRA).find('[id^="IBPriceipbox"]').attr("id"), "Price % must be greater than 0 and less than 100.", thisTileDRA);
                return false;
            }else if ($(thisTileDRA).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileDRA).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileDRA).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileDRA).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%).", thisTileDRA);
                return false;
            }else if ($(thisTileDRA).find('[id^="koinputbox"]').prop("disabled") != true && (parseFloat($(thisTileDRA).find('[id^="strikeipbox"]').val()) > parseFloat($(thisTileDRA).find('[id^="koinputbox"]').val()))) {
                //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(DRAFCNEnableStrikeBelowKO.toUpperCase() === "YES"){
                    ValidateField($(thisTileDRA).find('[id^="strikeipbox"]').attr("id"),"Strike (%) should be less than KO (%).", thisTileDRA);
                    return false;
                }
                // End- LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
            }else if ($(thisTileDRA).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileDRA).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileDRA).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileDRA).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileDRA).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%).", thisTileDRA);
                return false;
            }else if(parseFloat($(thisTileDRA).find('[id^="strikeipbox"]').val()) > 100){ //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(DRAFCNStrikeBeyond100Pct.toUpperCase() === "NO"){
                    ValidateField($(thisTileDRA).find('[id^="strikeipbox"]').attr("id"), "Strike % must be less than or equal to 100.", thisTileDRA);
                    return false;
                }
            } //End - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
        } else if ($(thisTileDRA).find('[id^="ddlSolveFor"]').val() == "Price") {
            if (parseFloat($(thisTileDRA).find('[id^="strikeipbox"]').val()) == "" || parseFloat($(thisTileDRA).find('[id^="strikeipbox"]').val()) <= 0 ) { // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                ValidateField($(thisTileDRA).find('[id^="strikeipbox"]').attr("id"), "Strike % must be greater than 0.", thisTileDRA); // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                return false;
            } else if (parseFloat($(thisTileDRA).find('[id^="couponipbox"]').val()) == "" || parseFloat($(thisTileDRA).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileDRA).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileDRA).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon (%).", thisTileDRA);
                return false;
            } if ($(thisTileDRA).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileDRA).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileDRA).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileDRA).find('[id^="kiinputbox"]').attr("id"), "KI (%) Should Be Less Than Strke (%).", thisTileDRA);
                return false;
            }else if ($(thisTileDRA).find('[id^="koinputbox"]').prop("disabled") != true && (parseFloat($(thisTileDRA).find('[id^="strikeipbox"]').val()) > parseFloat($(thisTileDRA).find('[id^="koinputbox"]').val()))) {
                //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(DRAFCNEnableStrikeBelowKO.toUpperCase() === "YES"){
                    ValidateField($(thisTileDRA).find('[id^="strikeipbox"]').attr("id"),"Strike (%) should be less than KO (%).", thisTileDRA);
                    return false;
                }
                // End- LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
            } else if ($(thisTileDRA).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileDRA).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileDRA).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileDRA).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileDRA).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%).", thisTileDRA);
                return false;
            }else if(parseFloat($(thisTileDRA).find('[id^="strikeipbox"]').val()) > 100){ //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(DRAFCNStrikeBeyond100Pct.toUpperCase() === "NO"){
                    ValidateField($(thisTileDRA).find('[id^="strikeipbox"]').attr("id"), "Strike % must be less than or equal to 100.", thisTileDRA);
                    return false;
                }
            } //End - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
        }

        // END


         // Added by RizwanS for tenor validation before pricing || 03 Jan 2022 ||

         if( $(thisTileDRA).find('[id^="tenorddl"]').val() == "M"){

            if(Number($(thisTileDRA).find('[id^="tenor_DRA"]').val()) > Number(DRAAllowedTenorinMonths)){
                ValidateField($(thisTileDRA).find('[id^="tenor_DRA"]').attr("id"), "Please enter valid tenor.", thisTileDRA);
                return false;
            }

        } else{

             if(Number($(thisTileDRA).find('[id^="tenor_DRA"]').val()) > Number(DRAAllowedTenorinYears)){
                ValidateField($(thisTileDRA).find('[id^="tenor_DRA"]').attr("id"), "Please enter valid tenor.", thisTileDRA);
                return false;
            }
        }
        
        // END

        $("body").css("opacity", "0.9");

        if ($(thisTileDRA).find('[id^="ddlDRAType"]').val() == "NOKIKODC") {
            KIPerc = "";
            KIType = "";
            KOPerc = $(thisTileDRA).find('[id^="koinputbox"]').val();
            KOType = "American";

        } else if ($(thisTileDRA).find('[id^="ddlDRAType"]').val() == "NOKIKOPE") {
            KIPerc = "";
            KIType = "";
            KOPerc = $(thisTileDRA).find('[id^="koinputbox"]').val();
            KOType = "European";

        } else if ($(thisTileDRA).find('[id^="ddlDRAType"]').val() == "KIDCKODC") {
            KIPerc = $(thisTileDRA).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileDRA).find('[id^="koinputbox"]').val();
            KIType = "American";
            KOType = "American";
        } else if ($(thisTileDRA).find('[id^="ddlDRAType"]').val() == "KIDCKOPE") {
            KIPerc = $(thisTileDRA).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileDRA).find('[id^="koinputbox"]').val();
            KIType = "American";
            KOType = "European";
        } else if ($(thisTileDRA).find('[id^="ddlDRAType"]').val() == "KIEURKODC") {
            KIPerc = $(thisTileDRA).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileDRA).find('[id^="koinputbox"]').val();
            KIType = "European";
            KOType = "American";
        } else if ($(thisTileDRA).find('[id^="ddlDRAType"]').val() == "KIEURKOPE") {
            KIPerc = $(thisTileDRA).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileDRA).find('[id^="koinputbox"]').val();
            KIType = "European";
            KOType = "European";
        }else if ($(thisTileDRA).find('[id^="ddlDRAType"]').val() == "KIDCNOKO") { //LGTCLI-332  | Chaitanya M | 23 Feb 2023
            KIPerc = $(thisTileDRA).find('[id^="kiinputbox"]').val();
            KOPerc = ""
            KIType = "American";
            KOType = "";
        } else if ($(thisTileDRA).find('[id^="ddlDRAType"]').val() == "KIEURNOKO") {
            KIPerc = $(thisTileDRA).find('[id^="kiinputbox"]').val();
            KOPerc = ""
            KIType = "European";
            KOType = "";
        } else if ($(thisTileDRA).find('[id^="ddlDRAType"]').val() == "NOKINOKO") {
            KIPerc = "";
            KOPerc = ""
            KIType = "";
            KOType = "";
        }
        
        let _upfront = "";

        if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

           _upfront = $(thisTileDRA).find('[id^="txtupfrontDRA"]').val().trim() ?$(thisTileDRA).find('[id^="txtupfrontDRA"]').val().trim() :0;

        }else{

            _upfront =  "0.00"; 
        }

        let exchangeListDRA = getExchangeAndCcyFromBasket($(thisTileDRA).find('[id^="shareDivDRA"]')[0], "exchange");
        let ccyListDRA = getExchangeAndCcyFromBasket($(thisTileDRA).find('[id^="shareDivDRA"]')[0], "ccy");
        let shareList = getExchangeAndCcyFromBasket($(thisTileDRA).find('[id^="shareDivDRA"]')[0], "share");

        // Added ER_Quanto flag not getting updated for ELN, FCN and DRA in Instant pricer | LGTGTWINT-1448| Chaitanya M | 20 Feb 2023
        
        let _QuantoFlagDRA = "";
        uniqueCCY = ccyListDRA.filter((item, i, ar) => ar.indexOf(item) === i);
        if(uniqueCCY.length==1){
            if($(thisTileDRA).find('[id^="ddlDRACcy"]').val() == uniqueCCY[0]){
                _QuantoFlagDRA = "No";
            }else{
                _QuantoFlagDRA = "Yes";
            }
        }else{
            _QuantoFlagDRA = "Yes";
        }
        //End


           // LGTGTWINT-1227 - Instant Pricing: EQC Ref missing for rfqs placed through instant pricing | 24 Feb 2023

           let _tenorDRA = ""

           if(tenorstring.toUpperCase().includes("M")){
           
            _tenorDRA= "MONTH";
           
           }else{
           
            _tenorDRA= "YEAR";
           }

            let getRefDRA = "";
           
            getRefDRA = getEQCRefrenceNumber(productName,KOType,KIType,tenorNumb,_tenorDRA,$(thisTileDRA).find('[id^="ddlSolveForDRA"]').val() != "Coupon" ? $(thisTileDRA).find('[id^="couponipbox"]').val() : "",_QuantoFlagDRA,"Worst of");
           
            $(thisTileDRA).find('[id^="hdnRefnumber"]').val(getRefDRA); //LGTGTWINT-1589 Instant Pricing : EQC ref different on instant pricer and order details,quote mail and order mail

           // END
        mapleLoaderStart(thisTileDRA,'[id^="btnBestPriceDRA"]', false);

        QuoteObject = {
            "BarrierPerc":  "",
            "Ccy": $(thisTileDRA).find('[id^="ddlDRACcy"]').val(),
            "CouponFrq": $(thisTileDRA).find('[id^="ddlCouponFrequency"]').val().toUpperCase(),
            "CouponPerc":  $(thisTileDRA).find('[id^="ddlSolveForDRA"]').val() != "Coupon" ? $(thisTileDRA).find('[id^="couponipbox"]').val() : "",
            "EntityID":     sessionStorage.getItem("EQC_EntityID").toString(),
            "Exchange1":  exchangeListDRA[0],
            "Exchange2": exchangeListDRA[1],
            "Exchange3":  exchangeListDRA[2],
            "Exchange4":  exchangeListDRA[3]?? "",
            "GuaranteedDuration":  $(thisTileDRA).find('[id^="Guaranteeipbox"]').val(),
            "KIPerc": KIPerc,
            "KIType":  KIType,
            "KOPerc": KOPerc,
            "KOType": KOType,
            "Notional": $(thisTileDRA).find('[id^="ContractAmtDRA"]').val().replace(/,/g, "").split(".")[0],
            "PPDetails": "",
            "PricePerc":$(thisTileDRA).find('[id^="ddlSolveForDRA"]').val() != "Price" ? $(thisTileDRA).find('[id^="IBPriceipbox"]').val() : "",
            "QuantoYN": _QuantoFlagDRA, // LGTGTWINT-1448| Chaitanya M | 20 Feb 2023
            "RMName": "",
            "Settlement_Days": $(thisTileDRA).find('[id^="SettlWeeks"]').val().trim(),
            "Tenor": _tenor,
            "Type": "DRA",
            "UnderlyingCode1": shareList[0],
            "UnderlyingCode2": shareList[1],
            "UnderlyingCode3": shareList[2],
            "UnderlyingCode4": shareList[3] ?? "" ,
            "Upfront":_upfront,// Added by Aniruddhaj 30Nov2022 LGTGTWINT-429
            "UserID":sessionStorage.getItem("EQC_UserName").toString(),
            "nonCall": $(thisTileDRA).find('[id^="noncallinputbox"]').val(),
            "strSolveFor":$(thisTileDRA).find('[id^="ddlSolveForDRA"]').val().toUpperCase(),
            "strikePerc": $(thisTileDRA).find('[id^="ddlSolveForDRA"]').val() != "Conversion_Strike" ? $(thisTileDRA).find('[id^="strikeipbox"]').val() : "",
            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
            "CurrentTileID": TileId,
            "requestID":$(thisTileDRA).find('[id^="hdnRequestID"]').val(), //INT1FIN47-768 Gateway Markets Instant Pricing issue
            "BuysideID": getRefDRA,

        };       

        console.log('DRA price request ', QuoteObject);
        getQuoteDRA(QuoteObject, $(thisTileDRA).find('[id^="hdnintervalID"]')[0]);
  
    } catch (er) {
        console.log(er);
    }
}

// To get quote
function getQuoteDRA(QuoteObject, uniqueIntervalID) {
    try {
        var dataDRA = request_getDataFromAPI(QuoteObject, clientConfigdata.CommonMethods.NodeServer + "getBestQuotesDRA45").then((dataDRA)=>{            
            
            thisTileDRA = document.getElementById("td" + dataDRA.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataDRA.CurrentTileID, true);
            mapleLoaderStart(thisTileDRA,'[id^="btnBestPriceDRA"]', false); 
            getUniqQuoteResponseDRA(thisTileDRA, dataDRA, uniqueIntervalID, QuoteObject.requestID); //INT1FIN47-768 Gateway Markets Instant Pricing issue
      
        }
        ).catch((error)=>{
            console.log(error);
        }
        );
    } catch (err) {
        console.log(err);
    }
}

function getUniqQuoteResponseDRA(thisTileDRA, dataDRA, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var UIID = null;
        // Added by Atharva - EQC Timers - START
        isTimerStarted["td" + dataDRA.CurrentTileID] = false;
        myCounter["td" + dataDRA.CurrentTileID] = {};
        hasUserClickedEQC["td" + dataDRA.CurrentTileID] = false;
        $(thisTileDRA).find('[id^="hdnSelectedBank"]').val("");
        
    
        // END
        uniqueIntervalID.value = setInterval(function () {

               if(reqestID != $(thisTileDRA).find('[id^="hdnRequestID"]').val() || $(thisTileDRA).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                if($(thisTileDRA).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                mapleLoaderStop(thisTileDRA,'[id^="btnBestPriceDRA"]', false);
                }
                return false
            } // INT1FIN47-768 Gateway Markets Instant Pricing issue

            sessionStorage.setItem("quoteToken_" + thisTileDRA.id.match(/\d+$/)[0], "");
            sessionStorage.setItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0], "");

            sessionStorage.setItem("quoteToken_" + thisTileDRA.id.match(/\d+$/)[0], dataDRA['token']);
            sessionStorage.setItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0], dataDRA['responseData']);


            getFinalQuoteResponseDRA(sessionStorage.getItem("quoteToken_" + thisTileDRA.id.match(/\d+$/)[0]), sessionStorage.getItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]), thisTileDRA, uniqueIntervalID, reqestID); // INT1FIN47-768 Gateway Markets Instant Pricing issue

        }, clientConfigdata.EQCDRA.PollInterval);


        console.log('uniqueIntervalID  ' + uniqueIntervalID.value);

    } catch (error) {
        console.log(error)
    }
}

// To get price
function getFinalQuoteResponseDRA(finalTokenDRA1, finalResponsedataDRA1, thisTileDRA, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {
      
        var currentDateAndTime = new Date();

        sessionStorage.setItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0], finalResponsedataDRA1);

        sessionStorage.setItem("quoteToken_" + thisTileDRA.id.match(/\d+$/)[0], finalTokenDRA1);

        console.log("DRA RFQ's :: " + finalResponsedataDRA1 + " " + currentDateAndTime);
        Timer = Timer + 1;


        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileDRA.id.match(/\d+$/)[0])) >= Number(DRAFCNrequestCount.toString().split(".")[0]) || sessionStorage.getItem("pricingToggle" + thisTileDRA.id.match(/\d+$/)[0]) == "false") { //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
          
            // Enabling book trade button when pricing is over
            $(thisTileDRA).find('[id^="btnBestPriceDRA"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval(uniqueIntervalID.value);
            mapleLoaderStop(thisTileDRA,'[id^="btnBestPriceDRA"]', false);

            QuoteObject = "";

            $(thisTileDRA).find('[id^="OverlayDiv"]').hide();

            $("body").css("opacity", "");
            arrDRA = [];
            maxDRA = "";
            TimerDRA = 0;
            //Call Draw Graph
            
            // $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val(JSON.stringify(finalObjDRA));
            // if (finalObjDRA != null || finalObjDRA != undefined) {
            //     drawgraphDRA($(thisTileDRA).find('[id^="canvas"]').attr("id"));
            // }
            // INT1FIN47-768 Gateway Markets Instant Pricing issue

            return false;
        } else {
            var repriceObjectDRA = request_getDataFromAPI({
                "PPDetails": sessionStorage.getItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]),
                "CurrentTileID": thisTileDRA.id.match(/\d+$/)[0],
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "UserID":sessionStorage.getItem("EQC_UserName").toString(),
               
            }, clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseDRA45").then((repriceObjectDRA)=>{

                thisTileDRA = document.getElementById("td" + repriceObjectDRA.CurrentTileID);
                // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileDRA).find('[id^="btnEmailQuote"]').attr("disabled", false);
                $(thisTileDRA).find('[id^="BookTradeDRA"]').attr("disabled", false);
                $(thisTileDRA).find('[id^="OrderEmail"]').attr("disabled",false); //LGTGTWINT-1981 || RizwanS || 12 May 2023    
                
                if(reqestID != $(thisTileDRA).find('[id^="hdnRequestID"]').val() || $(thisTileDRA).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    if($(thisTileDRA).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                        mapleLoaderStop(thisTileDRA,'[id^="btnBestPriceDRA"]', false);
                    }
                    return false
                } //INT1FIN47-768 Gateway Markets Instant Pricing issue
                
                sessionStorage.setItem("poolingTimer_" + thisTileDRA.id.match(/\d+$/)[0], Number(sessionStorage.getItem("poolingTimer_" + thisTileDRA.id.match(/\d+$/)[0])) + 1);
                finalObjDRA = (repriceObjectDRA["responseData"]);

                sessionStorage.setItem("quoteToken_" + thisTileDRA.id.match(/\d+$/)[0], repriceObjectDRA['token']);
                sessionStorage.setItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]));

                // Sorted By Best Price LP'S

                finalObjDRA.sort(function(a, b) {
                    if (a.DRAOUT === null || a.DRAOUT == "" || a.DRAOUT == "Timeout" || a.DRAOUT.toUpperCase().trim() == "REJECTED" || a.DRAOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return 1;
                    } else if (b.DRAOUT === null || b.DRAOUT == "" || b.DRAOUT == "Timeout" || b.DRAOUT.toUpperCase().trim() == "REJECTED" || b.DRAOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return -1;
                    } else if (a.DRAOUT === b.DRAOUT) {
                        return 0;
                    }
                    if ($(thisTileDRA).find('[id^="ddlSolveFor"]').val() == "Coupon") {
                        return Number(a.DRAOUT) > Number(b.DRAOUT) ? -1 : 1;
                    } else {
                        return Number(a.DRAOUT) < Number(b.DRAOUT) ? -1 : 1;
                    }
                });

                //Removed || LGTGTWINT-1981 || RizwanS || 12 May 2023
                finalTokenDRA = repriceObjectDRA['token'];
                $(thisTileDRA).find('[id^="hdnfinalTokenDRA"]').val(finalTokenDRA);
                maxDRA = finalObjDRA[0].DRAOUT;

                //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023

                //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
                // $(thisTileDRA).find('[id^="EQCRfqidpnl"]').show();
                // $(thisTileDRA).find('[id^="RFQIDEQC"]').html("");
                // $(thisTileDRA).find('[id^="RFQIDEQC"]').html("RFQ ID: " +finalObjDRA[0].EP_ER_QuoteRequestId);
                //end

                $(thisTileDRA).find('[id^="hdnfinalTokenDRA"]').val(sessionStorage.getItem("quoteToken_" + thisTileDRA.id.match(/\d+$/)[0]));
                // END
                if (sessionStorage.getItem("pricingToggle" + thisTileDRA.id.match(/\d+$/)[0]) == "true") {
                    // Added by Atharva - EQC Timers - START
                    // every time in new request indexes might change so clearing.
                    var isNonBestPrice = false;
                    if(clientConfigdata.CommonMethods.NonBestPrice == "Y") {
                        isNonBestPrice = true;
                    }
                    else {
                        isNonBestPrice = false;
                    }
                    mapIndexToBank["td"+repriceObjectDRA.CurrentTileID] = {};
                    // END
                    // $(thisTileDRA).find('[id^="DRABanksRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // $(thisTileDRA).find('[id^="DRAPrices"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    if(!hasUserClickedEQC["td"+repriceObjectDRA.CurrentTileID]) {
                        $(thisTileDRA).find('[id^="hdnSelectedBank"]').val("");
                    }
                    // Added by Atharva - EQC Timers - START
                    $(thisTileDRA).find('[id^="DRATimerRow"]').empty();
                    var itr = 0;
                    // END
                    // $(thisTileDRA).find('[id^="minMaxNotionalLimitRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023

                    //Check for best price count || LGTGTWINT-1981 || RizwanS || 12 May 2023
                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023
                    if (NotesBestPriceDisplayCount != "") { 

                        // LGTGTWINT-2018 - Prices to be displayed for EAM entity on MSP and IP only when the input notional falls within min max range of CPs || RizwanS || 24 May 2023
                        if(NotionalMinMaxCheck.toUpperCase() === 'YES' && parseFloat($(thisTileDRA).find('[id^="ContractAmtDRA"]').val().replace(/,/g, "")) > 0){ //RizwanS || LGTGTWINT-2153 || 27 Jun 2023
                            
                            let sliceCount = Number(NotesBestPriceDisplayCount); // Count to show best prices as per config set

                            let productname = $(thisTileDRA).find(".productName").attr("id");

                            let _minmaxObj = [];

                            for(i=0;i<finalObjDRA.length;i++){
        

                                if(parseFloat($(thisTileDRA).find('[id^="ContractAmtDRA"]').val().replace(/,/g, "")) <= parseFloat(finalObjDRA[i].MaxNotional)
                                && parseFloat($(thisTileDRA).find('[id^="ContractAmtDRA"]').val().replace(/,/g, "")) >= parseFloat(finalObjDRA[i].MinNotional)){
                                    
                                    _minmaxObj.push(finalObjDRA[i]);
        
                                }
        
                            }

                            if(_minmaxObj.length <= 0){

                                $(thisTileDRA).find('[id^="btnEmailQuote"]').attr("disabled", true);
                                $(thisTileDRA).find('[id^="BookTradeDRA"]').attr("disabled", true);
                                $(thisTileDRA).find('[id^="OrderEmail"]').attr("disabled",true);
                                return false;
                            } 

                            finalObjDRA = sliceEQCbestprices(_minmaxObj,productname,sliceCount);
                          
                        }//END
                    }
                    
                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023
                    $(thisTileDRA).find('[id^="DRABanksRow"]').empty();
                    $(thisTileDRA).find('[id^="DRAPrices"]').empty();
                    $(thisTileDRA).find('[id^="minMaxNotionalLimitRow"]').empty();
                    //END
 
                    bindRFQIDEQC(thisTileDRA,finalObjDRA); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023

                    $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val(JSON.stringify(finalObjDRA));

                    // END


                    $(finalObjDRA).each(function(i, elem) {
                        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
                        var priceClass = "GlowPrice_Red";
                        if (!glowFlag) {
                            priceClass = "noGlow";
                        }

                        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                        // $(thisTileDRA).find('[id^="EQCRfqidpnl"]').show();
                        // $(thisTileDRA).find('[id^="RFQIDEQC"]').html(elem.ParentID);
                        //End

                        var str = "";
                        var str2 = "";
                        if (elem.PP_CODE != null) {
                            // Added by Atharva - EQC Timers - START
                            mapIndexToBank["td"+repriceObjectDRA.CurrentTileID][itr] = elem.PP_CODE;
                            if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected" && $(thisTileDRA).find('[id^="hdnSelectedBank"]').val() == "") {
                                $(thisTileDRA).find('[id^="hdnSelectedBank"]').val(elem.PP_CODE);
                            }
                            if (elem.PP_CODE == "CITI") {
                                if(isNonBestPrice) {
                                    if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected" && ($(thisTileDRA).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectDRA.CurrentTileID + "_" + itr + "'>" + "Citi" + "</button></td>";
                                    }
                                    else if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectDRA.CurrentTileID + "_" + itr + "'>" + "Citi" + "</td>";
                                    }
                                    else {
                                        str = str + "<td>" + "Citi" + "</td>";
                                    }
                                }
                                else {
                                    str = str + "<td";
                                    if(itr == 0 && elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected") {
                                        str = str + " class='bestPriceStyle'"
                                    }
                                    str = str + ">Citi</td>";
                                }
                            } else {
                                if(isNonBestPrice) {
                                    if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected" && ($(thisTileDRA).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectDRA.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</button></td>";
                                    }
                                    else if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectDRA.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</td>";
                                    }
                                    else {
                                        str = str + "<td>" + elem.PP_CODE + "</td>";
                                    }
                                }
                                else {
                                    str = str + "<td";
                                    if(itr == 0 && elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected") {
                                        str = str + " class='bestPriceStyle'"
                                    }
                                    str = str + ">" + elem.PP_CODE + "</td>";
                                
                                }
                            }
                            // END
                            $(thisTileDRA).find('[id^="DRABanksRow"]').append(str);
                        } else {
                            str = str + "<td>--</td>"
                            $(thisTileDRA).find('[id^="DRABanksRow"]').append(str);
                        }
                        if (elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected") {
                            // Added by Atharva - EQC Timers
                            // Added new if condition
                            if(isNonBestPrice) {
                                if($(thisTileDRA).find('[id^="hdnSelectedBank"]').val() == elem.PP_CODE) {
                                    str2 = str2 + "<td class='priceBackground";
                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023                                    
                                    if(parseFloat(elem.DRAOUT).toFixed(2) < 0){
                                        if(itr == 0) {
                                            str2 = str2 + " negativeprice";
                                        }
                                    }else{
                                        if(itr == 0) {
                                            str2 = str2 + " bestPriceStyle";
                                        }
                                    }
                                    // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                    str2 = str2 + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectDRA.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DRAOUT).toFixed(2) + " %</button></td>"
                                    $(thisTileDRA).find('[id^="DRAPrices"]').append(str2);
                                } else {
                                    str2 = str2 + "<td";
                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                    if(parseFloat(elem.DRAOUT).toFixed(2) < 0){
                                        if(itr == 0) {
                                            str2 = str2 + " class='negativeprice_nonbest'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton negativeprice_nonbest' onclick='setPriceEQC(this)' id='td" + repriceObjectDRA.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DRAOUT).toFixed(2) + " %</button></td>"
                                        $(thisTileDRA).find('[id^="DRAPrices"]').append(str2);

                                    }else{
                                        if(itr == 0) {
                                            str2 = str2 + " class='bestPriceStyle'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectDRA.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DRAOUT).toFixed(2) + " %</button></td>"
                                        $(thisTileDRA).find('[id^="DRAPrices"]').append(str2);
                                    }
                                    
                                }
                            }
                            else {
                                str2 = str2 + "<td";
                                // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                if(parseFloat(elem.DRAOUT).toFixed(2) < 0){

                                    if(itr == 0) {
                                        str2 = str2 + " class='negativeprice_nonbest'";
                                    }

                                }else{

                                    if(itr == 0) {
                                        str2 = str2 + " class='bestPriceStyle'";
                                    }

                                }
                                // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                str2 = str2 + ">" + parseFloat(elem.DRAOUT).toFixed(2) + " %</td>"; 
                                $(thisTileDRA).find('[id^="DRAPrices"]').append(str2);
                            }
                        } else {
                            str2 = str2 + "<td>-</td>"
                            $(thisTileDRA).find('[id^="DRAPrices"]').append(str2);
                        }
                     
                        itr++;
                        let strMinMaxNotionalLimit = '';
                        if (elem.PP_CODE != null) {
                            strMinMaxNotionalLimit = strMinMaxNotionalLimit + `<td style='font-size:12px !important;'>${K_M_B_Formatter(Number(elem.MinNotional))} / ${K_M_B_Formatter(Number(elem.MaxNotional))}</td>`;
                            $(thisTileDRA).find('[id^="minMaxNotionalLimitRow"]').append(strMinMaxNotionalLimit);
                        }
                        // END
                    });
                    // Added by Atharva - EQC Timers - START
                    // Should run only once
                    // if(!isTimerStarted["td" + repriceObjectDRA.CurrentTileID]) {
                    //     isTimerStarted["td" + repriceObjectDRA.CurrentTileID] = true;
                    //     startTimersEQC(repriceObjectDRA.CurrentTileID);
                    // }
                    // END
                }
                
            }
            ).catch((error)=>{
                console.log(error);
                $(thisTileDRA).find('[id^="btnBestPriceDRA"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
                clearInterval(uniqueIntervalID.value);
                mapleLoaderStop(thisTileDRA,'[id^="btnBestPriceDRA"]', false);
                uniqueIntervalID.value = "";

                $(thisTileDRA).find('[id^="OverlayDiv"]').hide();
                if (finalObjDRA != null || finalObjDRA != undefined) {
                    drawgraphDRA($(thisTileDRA).find('[id^="canvas"]').attr("id"));
                }
            }
            );
        }
    } catch (error) {

        $(thisTileDRA).find('[id^="btnBestPriceDRA"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issueclearInterval(uniqueIntervalID.value);
        sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        clearInterval(uniqueIntervalID.value);
        mapleLoaderStop(thisTileDRA,'[id^="btnBestPriceDRA"]', false);

        uniqueIntervalID.value = "";
        $(thisTileDRA).find('[id^="OverlayDiv"]').hide();
        $(thisTileDRA).find('[id^="BookTradeDRA"]').attr("disabled", false);

        console.log("getFinalQuoteResponseDRA : " + error);

        // $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val(JSON.stringify(finalObjDRA));
        // if (finalObjDRA != null || finalObjDRA != undefined) {
        //     drawgraphDRA($(thisTileDRA).find('[id^="canvas"]').attr("id"));
        // }
        // sessionStorage.setItem("quoteToken_" + thisTileDRA.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileDRA.id.match(/\d+$/)[0]));
        // sessionStorage.setItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]));
        // INT1FIN47-768 Gateway Markets Instant Pricing issue
  

    } finally {
        //$(thisTileDRA).find('[id^="BookTradeDRA"]').attr("disabled", false);
    }
}

// To book trade
function BooktradeDRA(that,suitabilityCheck,redirectOrder) { // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
    try {
        // startLoader();
        TileId = that.id.match(/\d+$/)[0];
        thisTileDRA = document.getElementById("td" + TileId);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        productName = $($(that).parents(".sorting").find(".productName")).attr("id");
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
            $(thisTileDRA).find('[id^="DRABanksRow"]').children().each(function() {
                if($(thisTileDRA).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
            mapleOrderLoaderStop(thisTileDRA);
            return false;
        }
        // END
       
        let AllocationDetails=[];

        $(thisTileDRA).find("select.ChildrenddlBookingCenter").each(function(index, element){

            if ($(this).parent().prev().find(".childrenCheckBoxBooking")[0].checked) {

            AllocationDetails.push({

            "RMName": $(element).parent().parent().find('[id^="ddlRMName"]').val(),
            "CustBranch": element.value,
            "Notional":$(element).parent().parent().find('[id^="txtHeaderNotional"]').val().split('.')[0].replace(/\,/g, "")

            })
          }
        })


       // let calculatedMargin= (100 - JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[selectedBankIndex].DRAOUT);
       // let calClientPrice= (parseFloat(JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[selectedBankIndex].DRAOUT) + parseFloat(100 - JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[selectedBankIndex].DRAOUT)).toFixed(2);
        
        let limitPrice1 = "";
        let limitPrice2 = "";
        let limitPrice3 = "";
        let limitPrice4 = "";

        if($(thisTileDRA).find('[id^="ddlOrderTypeDRA"]').val().trim().toUpperCase() == "LIMIT"){

            if($(thisTileDRA).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 0){

                limitPrice1 = $(thisTileDRA).find('[id^="txtLimitLevel"]').val().trim();

            }else if($(thisTileDRA).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 1){

                 limitPrice2 = $(thisTileDRA).find('[id^="txtLimitLevel"]').val().trim();

            } else if($(thisTileDRA).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 2){

                 limitPrice3 = $(thisTileDRA).find('[id^="txtLimitLevel"]').val().trim();
                 
            } else if($(thisTileDRA).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 3){

                limitPrice4 = $(thisTileDRA).find('[id^="txtLimitLevel"]').val().trim();
                
            }            
        }

        //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

        let _confirmReason = "";

        if(selectedBankIndex>0){

            if($(thisTileDRA).find('[id^="ddlNONBEST"]').val() != "NONBEST_CUSTOM"){

                _confirmReason = $(thisTileDRA).find('[id^="ddlNONBEST"]').text();
    
            }else{
    
                _confirmReason =  $(thisTileDRA).find('[id^="txtNONBEST"]').val(); 
                
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
                if ($(thisTileDRA).find('[id^="rbRowSuitabilityToggle"]')[0].checked) {
                    _chkSuitability = "NO";
                    if ($(thisTileDRA).find('[id^="ddlReason"]').val().trim().includes("SUTSKP_CUSTOM")) { // Added by RizwanS | JIRA-LGTGTWINT-1830
                        _reasonmsg = $(thisTileDRA).find('[id^="txtSpecifyReason"]').val();
                    }else{
                        _reasonmsg = $(thisTileDRA).find('[id^="ddlReason"]').val();
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
               orderQty: $(thisTileDRA).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
               type:$(thisTileDRA).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
               limitPrice1: limitPrice1,
               limitPrice2: limitPrice2,
               limitPrice3: limitPrice3,
               limitPrice4: limitPrice4,
               QuoteRequestId: JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[selectedBankIndex].EP_ER_QuoteRequestId,
               loginUser: sessionStorage.getItem("EQC_UserName").toString(),
               margin: "0.00",
               clientPrice:"0.00",
               yield: "",
               bookingBranch: $(thisTileDRA).find('[id^="ddlBookingBranch"]').val(),
               rmNameForOrderConfirmation: $(thisTileDRA).find('[id^="ddlRMName"]').val(),
               dealerNotificationEmailID: $(thisTileDRA).find('[id^="txtComment"]').val(),
               orderComment: $(thisTileDRA).find('[id^="txtComment"]').val(),
               confirmationReason: _confirmReason,
               advisoryReason: $(thisTileDRA).find('[id^="txtComment"]').val(),
               preTradeXml: preTradeXml,
               //chkSuitability:$(thisTileDRA).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
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

                "userName": sessionStorage.getItem("EQC_UserName").toString(),
                "token": "",
                "orderQuantity": $(thisTileDRA).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "OrderType":$(thisTileDRA).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
                "LimitPrice1": limitPrice1,
                "LimitPrice2": limitPrice2,
                "LimitPrice3": limitPrice3,
                "LimitPrice4": limitPrice4,
                "QuoteRequestId":JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[selectedBankIndex].EP_ER_QuoteRequestId,
                "PoolID": "",
                "RedirectOrderID": "",
                "OrderComment": $(thisTileDRA).find('[id^="txtComment"]').val(),
                "Margin":"0.00",
                "Notional": $(thisTileDRA).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "ClientPrice": "0.00",
                "ClientYield": "",
                "BookingBranch": $(thisTileDRA).find('[id^="ddlBookingBranch"]').val(),
                "RMNameforOrderConfirm":  $(thisTileDRA).find('[id^="ddlRMName"]').val(),
                "RMEmailIdforOrderConfirm": "",
                "ConfirmReason": _confirmReason, //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message
                "PreTradeXml": "",
                "AdvisoryReason": "",
                // "UserRole": _reasonmsg, // Added Chaitanya M | For checking the suitability reason | Ref:LGTGTWINT-603 | 12-Jan-2023
                "CustomerID": "",
                // "chkSuitability":$(thisTileDRA).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
                "chkSuitability":_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                "SuitabilityReason": _reasonmsg, // Added by RizwanS | JIRA-LGTGTWINT-1830
                "IntendedSpread": "",
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": TileId,
                "AllocationDetails": AllocationDetails,
                "UserRole" : isEQCDealer === true ? 'Dealer' : isIA=== true ? 'IA' : 'RM' , // Added by RizwanS | JIRA-LGTGTWINT-1830
            
            }

        }

        mapleOrderLoaderStart(thisTileDRA);

            request_getDataFromAPI(bookObject, clientConfigdata.CommonMethods.NodeServer + orderMethodName).then(bookObject => {
            
            // endLoader();

            thisTileDRA = document.getElementById("td" + bookObject.CurrentTileID);

            TileId = bookObject.CurrentTileID;

            console.log('DRA after book object ', bookObject);

            let bookstring = bookObject['responseData']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
            
            let OrderStatus = bookObject['message']; // LGTGTWINT-1888 || RizwanS || 30 May 2023

            if (OrderStatus.toUpperCase() === clientConfigdata.EQCCommonMethods.EQC_BOOK_TRADE_RESPONSE_DETAILS.toUpperCase()) {

                // $(thisTileDRA).find('[id^="hdnBlotterURLDRA"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                // $(thisTileDRA).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradeEQDRA" + TileId, bookstring, "DivOverlayEQDRA");
                $(thisTileDRA).find('[id^="hdnfinalTokenDRA"]').val("");
                $(thisTileDRA).find('[id^="OverlayDiv"]').hide();
                clearPricerTable(thisTileDRA);
                 

            } else{

                if(OrderStatus == "" || OrderStatus == null || OrderStatus==undefined){

                    OrderStatus = "Order Execution Failed!";
                
                }else if(OrderStatus.includes("Please select booking centers from same region")){ // LGTGTWINT-1888 || RizwanS || 30 May 2023

                    OrderStatus = "Please select booking centers from same region.";
                }

                booktradePopup(that, "booktradeEQDRA" + TileId, OrderStatus, "DivOverlayEQDRA");
                $(thisTileDRA).find('[id^="hdnfinalTokenDRA"]').val("");
                $(thisTileDRA).find('[id^="OverlayDiv"]').hide();
                clearPricerTable(thisTileDRA);

            }
            mapleOrderLoaderStop(thisTileDRA);
            sessionStorage.removeItem("quoteResponse_" + thisTileDRA.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileDRA).find('[id^="btnBestPriceDRA"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileDRA).find('[id^="hdnintervalID"]').val());
            mapleLoaderStop(thisTileDRA,'[id^="btnBestPriceDRA"]', false);
            // Added by Atharva - EQC Timers - START
            $(thisTileDRA).find('[id^="DRAPrices"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            $(thisTileDRA).find('[id^="DRABanksRow"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileDRA).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileDRA).find('[id^="BookTradeDRA"]').attr("disabled", true);
            $(thisTileDRA).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023   
            // END

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            
            //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            // $(thisTileDRA).find('[id^="EQCRfqidpnl"]').hide();
            $(thisTileDRA).find('[id^="RFQIDEQC"]').html("");
            //End
            
            //End

        }
        ).catch(error=>{
            console.log(error);
        }
        )
    } catch (er) {
        console.log(er);
        booktradePopup(that, "booktradeEQDRA" + TileId, "Order may have got executed or may have failed. Contact support!", "DivOverlayEQDRA");
        $(thisTileDRA).find('[id^="OverlayDiv"]').hide();
        // endLoader();
        mapleOrderLoaderStop(thisTileDRA);

    } finally {}
}

var dialogBoxDRA = null;
function emailQuoteDRA(that) {
    try {

        thisTileDRA= $(that).parents(".sorting")[0];
    
        let pricingRow = "";
        pricingRow = $(thisTileDRA).find("table.pricerTable .pricesRow")[0];
        mapleOrderLoaderStart(thisTileDRA);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
    
        if (pricingRow.cells[0].innerText.trim().toString() === "-") {
            openValidationpopup('',"No price available for mailing!"); // Changed for Change quote mail validation from "Invalid Price" to "No price available for mailing!" | Ref: LGTGTWINT-1195 | Chaitanya M | 25-jan-2023
          return false;
        }

        //create email pop up here 
        let strEmail =``;
        let emailPriceStream =JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val());
        console.log('email price stream object ', emailPriceStream);

        // Added for Email Quotes popup label for strike, coupon and IB Pricer | Ref: LGTGTWINT-1134 | Chaitanya M | 25-jan-2023
        let DRAsolveforvalue= document.getElementById("ddlSolveFor" + TileId);

        if(globalSolveForValueDRA =="Conversion_Strike"){
                DRAsolveforvalue = " Strike (%)";
        }else if(globalSolveForValueDRA =="Coupon"){
                DRAsolveforvalue = "  Coupon (%)";
        }else if(globalSolveForValueDRA =="Price"){
                DRAsolveforvalue = " IB Price (%)";
        }

       //End

        strEmail=strEmail+`<table class='emailTable'><tr><td class='payOff_Features'>
        <input type='checkbox' class='chkBoxParent_Email_PPCode' onchange='emailParentCheckboxChanged(this)' >
        Issuer</td><td class='payOff_Features'>${DRAsolveforvalue}</td></tr>`;  // Changed for Email Quotes popup label for strike, coupon and IB Pricer | Ref: LGTGTWINT-1134 | Chaitanya M | 25-jan-2023

        for (let e of emailPriceStream){
            if(e.DRAOUT.trim().toUpperCase()!=='REJECTED' && e.DRAOUT.trim().toUpperCase()!=='' && e.DRAOUT.trim().toUpperCase()!=='UNSUPPORTED' ){ // Changed the condition for handling Unsupported response | Ref: LGTGTWINT-1321 | Chaitanya M | 06 Feb 2023
                        strEmail=strEmail+`<tr><td style='width:40px;padding:15px'><input type='checkbox' class='chkBox_Email_PPCode'  onchange='emailChildrenCheckboxChanged(this)' > ${e.PP_CODE}</td><td style='width:40px;padding:15px'>${e.DRAOUT}</td></tr>`;
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
        if(dialogBoxDRA===null)
        {
            dialogBoxDRA= $(thisTileDRA).find('[id^="emailDialog_DRA"]')[0];
            $(thisTileDRA).find('[id^="emailDialog_DRA"]').empty().append(strEmail);
            $(dialogBoxDRA).dialog({
                resizable: false,
                height: "auto",
                width: 320,
                modal: true,
                open: function (event, ui) { // Added for LGTGTWINT-1283 || Email popup on top change | Chaitanya M | 08 Feb 2023
                    $('.ui-widget.ui-widget-content').css('z-index',999);                    
                }, 
                //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                close: function (event, ui){
                    mapleOrderLoaderStop(thisTileDRA);
                },
                //End

                buttons: {
                    "Mail Quote": function() {
                    //mail single selected rfq 

                    //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023

                
                    var Email_PPList =[];
                    var RFQIDList=[];
                    var __mailRFQ=[];

                    if($(document).find('.ui-dialog').find('[id^="emailDialog_DRA"]').find('.chkBox_Email_PPCode').length>0)
                    {
                        $(document).find('.ui-dialog').find('[id^="emailDialog_DRA"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                            if(checkboxControl.checked){
                                Email_PPList.push($(checkboxControl).parent().text().trim())

                                RFQIDList.push(JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val()).filter(function(RFQ_OBJECT){
                                    return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                                    })
                                )
                            }
                        })
                    }
                    if(Email_PPList.length>0){
                        console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);
                        //return true;    
                        for(let R of RFQIDList){
                            __mailRFQ.push(R[0].EP_ER_QuoteRequestId);

                        }
                    }

                    if ($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val() != undefined && $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val().trim()!='')
                    var RFQID = JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;
        
                    if (RFQID != undefined && RFQID != ''){
                        // MailBestQuote(thisTileDRA.id.match(/\d+$/)[0], JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[0].EP_ER_QuoteRequestId);
                        if(__mailRFQ == ""){

                            // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            //booktradePopup(thisTileDRA, "booktradeEQDRA" + thisTileDRA.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayEQDRA");
                            openValidationpopup('','No price selected for mailing !');
                            //End
                            return false;
                        }

                        $( this ).dialog( "close" );     // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                        mapleOrderLoaderStart(thisTileDRA);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                        request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                            "rfqId":__mailRFQ.toString(),
                            "CurrentTileID":thisTileDRA.id.match(/\d+$/)[0],
                            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                            QuoteMailType:"English"
                        }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                            console.log(data);
                            TileId = data.CurrentTileID;
                            thisTileDRA = document.getElementById("td" +TileId);
                            mapleOrderLoaderStop(thisTileDRA); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            booktradePopup(thisTileDRA, "booktradeEQDRA" + TileId, data.message, "DivOverlayEQDRA");
                          
                        }).catch(error=>{
                          console.log(error);
                       
                        })
                    }
                    else {
                        mapleOrderLoaderStop(thisTileDRA); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                        openValidationpopup('','Invalid RFQ ID '); 
                    }            
                    },

                    "Mail All Quotes": function() {
                        //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                
                        var Email_PPList =[];
                        var RFQIDList=[];
                        var __mailRFQ=[];

                        if($(document).find('.ui-dialog').find('[id^="emailDialog_DRA"]').find('.chkBox_Email_PPCode').length>0)
                        {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_DRA"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                                //if(checkboxControl.checked){
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val()).filter(function(RFQ_OBJECT){
                                        return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                                        })
                                    )

                                //}
                            })
                        }
                        if(Email_PPList.length>0){
                            console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);
                            //return true;    
                            for(let R of RFQIDList){
                                __mailRFQ.push(R[0].EP_ER_QuoteRequestId);

                            }
                        }

                        if ($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val() != undefined && $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val().trim()!='')
                        var RFQID = JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;
            
                        if (RFQID != undefined && RFQID != ''){
                            //     MailBestQuote(thisTileDRA.id.match(/\d+$/)[0], JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[0].EP_ER_QuoteRequestId);
                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileDRA, "booktradeEQDRA" + thisTileDRA.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayEQDRA");
                                mapleOrderLoaderStop(thisTileDRA); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            }
                            $( this ).dialog( "close" );  // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileDRA);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                                "rfqId":__mailRFQ.toString(),
                                "CurrentTileID":thisTileDRA.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType:"English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileDRA = document.getElementById("td" +TileId)
                                mapleOrderLoaderStop(thisTileDRA); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                booktradePopup(thisTileDRA, "booktradeEQDRA" + TileId, data.message, "DivOverlayEQDRA");
                            
                            }).catch(error=>{
                            console.log(error);
                        
                            })
                        }
                        else{
                            mapleOrderLoaderStop(thisTileDRA); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('','Invalid RFQ ID ');
                        }

                        return true;
                        //email all quotes here 
                    }
                }
            });
            $(dialogBoxDRA).dialog('open');

        }else
        {
            $(document).find('.ui-dialog').find('[id^="emailDialog_DRA"]').empty().append(strEmail);

            $(dialogBoxDRA).dialog('open');
                            
            var Email_PPList =[];
            var RFQIDList=[];
            var __mailRFQ=[];

            if($(document).find('.ui-dialog').find('[id^="emailDialog_DRA"]').find('.chkBox_Email_PPCode').length>0)
            {
                $(document).find('.ui-dialog').find('[id^="emailDialog_DRA"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                    if(checkboxControl.checked){
                        Email_PPList.push($(checkboxControl).parent().text().trim())

                        RFQIDList.push(JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val()).filter(function(RFQ_OBJECT){
                            return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                            })
                        )
                    }
                })
            }
            if(Email_PPList.length>0){
                console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);
                //return true;    
                for(let R of RFQIDList){
                    __mailRFQ.push(R[0].EP_ER_QuoteRequestId);

                }
            }

            if ($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val() != undefined && $(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val().trim()!='')
            var RFQID = JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

            if (RFQID != undefined && RFQID != ''){
                //     MailBestQuote(thisTileDRA.id.match(/\d+$/)[0], JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[0].EP_ER_QuoteRequestId);
                if(__mailRFQ == ""){
                    // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    //booktradePopup(thisTileDRA, "booktradeEQDRA" + thisTileDRA.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayEQDRA");
                    mapleOrderLoaderStop(thisTileDRA); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    openValidationpopup('','No price selected for mailing !');
                    //End
                    return false;
                }      
                request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                        "rfqId":__mailRFQ.toString(),
                        "CurrentTileID":thisTileDRA.id.match(/\d+$/)[0],
                        "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                        QuoteMailType:"English"
                }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                    console.log(data);
                    TileId = data.CurrentTileID;
                    thisTileDRA = document.getElementById("td" +TileId);
                    mapleOrderLoaderStop(thisTileDRA); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    booktradePopup(thisTileDRA, "booktradeEQDRA" + TileId, data.message, "DivOverlayEQDRA");
                
                }).catch(error=>{
                console.log(error);
            
                })
            }
            else{
                mapleOrderLoaderStop(thisTileDRA); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                openValidationpopup('','Invalid RFQ ID ');
            }

        }
        $(thisTileDRA).find('[id^="DRABanksRow"]').children().each(function() {
           if($(thisTileDRA).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
     
    }
}

function validateOrderDRA(thisTileDRA,_flag){    // LGTGTWINT-1279 : Instant Pricing : Order booking valdations.

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
            $(thisTileDRA).find('[id^="DRABanksRow"]').children().each(function() {
                if($(thisTileDRA).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
                    selectedBankIndex = itr;
                }
                itr++;
             });
        }
        else {
            selectedBankIndex = 0;
        }

        if(selectedBankIndex == -1) {
            return false;
        }


        if ($(thisTileDRA).find('[id^="ddlSolveFor"]').val() == "Conversion_Strike")  {
           
            if($(thisTileDRA).find('[id^="koinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[selectedBankIndex].DRAOUT) > parseFloat($(thisTileDRA).find('[id^="koinputbox"]').val())){
                ValidateField($(thisTileDRA).find('[id^="koinputbox"]').attr("id"), "KO % of Initial should be greater than strike(%)",thisTileDRA);
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                return false;
            } 
    
            else if($(thisTileDRA).find('[id^="kiinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[selectedBankIndex].DRAOUT)< parseFloat($(thisTileDRA).find('[id^="kiinputbox"]').val())){
                ValidateField($(thisTileDRA).find('[id^="kiinputbox"]').attr("id"), "KI % of Initial should be less than strike(%)",thisTileDRA);
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                return false;
            }
        }

        if ($(thisTileDRA).find('[id^="hdnfinalTokenDRA"]').val() == "" || $(thisTileDRA).find('[id^="DRAPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileDRA).find('[id^="DRAPrices"]')[0].firstChild.innerHTML == "") {
            if(_flag == false){
                _validateOrderEQC = true; 
            }
            ValidateField($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').attr("id"), "Order Execution Failed!", thisTileDRA);
            return false;
        }
        
        if(parseFloat(JSON.parse($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').val())[selectedBankIndex].DRAOUT) <= 0){
            if(_flag == false){

                _validateOrderEQC = true; 
            }
            ValidateField($(thisTileDRA).find('[id^="hdnChartPricesDRA"]').attr("id"), "Prices can not be negative 0r zero, Order Execution Failed!", thisTileDRA);
            return false;
        }

    }catch(er){
        console.log(message);
    }
}

//  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
function ChangeSolveForDRA(solveFor,thisTileDRA,calledFromIndexDRA) {
    try {
        if (calledFromIndexDRA != undefined){
            if (solveFor.trim().includes("Conversion_Strike")) {
                $(thisTileDRA).find('[id^="strikeipbox"]').prop('disabled', true);
                $(thisTileDRA).find('[id^="IBPriceipbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="couponipbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="txtupfrontDRA"]').prop('disabled', false);  
                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);
            } else if (solveFor.trim().includes("Price")) {
                $(thisTileDRA).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="IBPriceipbox"]').prop('disabled', true);
                $(thisTileDRA).find('[id^="couponipbox"]').prop('disabled', false);
		        $(thisTileDRA).find('[id^="txtupfrontDRA"]').prop('disabled', true); 
                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);       
            } else if (solveFor.trim().includes("Coupon") ) {
                $(thisTileDRA).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileDRA).find('[id^="IBPriceipbox"]').prop('disabled', false);  
                $(thisTileDRA).find('[id^="couponipbox"]').prop("disabled", true);
                $(thisTileDRA).find('[id^="txtupfrontDRA"]').prop('disabled', false);  
                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);
            }
        }
        else {
            if (solveFor.trim().includes("Conversion_Strike")) {
                $(thisTileDRA).find('[id^="strikeipbox"]').prop("disabled", true);
                $(thisTileDRA).find('[id^="IBPriceipbox"]').prop("disabled", false); 
                $(thisTileDRA).find('[id^="couponipbox"]').prop("disabled", false);
                $(thisTileDRA).find('[id^="txtupfrontDRA"]').prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);

            } else if (solveFor.trim().includes("Price")) {
                $(thisTileDRA).find('[id^="strikeipbox"]').prop("disabled", false);
                $(thisTileDRA).find('[id^="IBPriceipbox"]').prop("disabled", true);
                $(thisTileDRA).find('[id^="couponipbox"]').prop("disabled", false);
                $(thisTileDRA).find('[id^="txtupfrontDRA"]').prop('disabled', true); //LGTGTWINT-1095

                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);
            } else if (solveFor.trim().includes("Coupon")) {
                $(thisTileDRA).find('[id^="strikeipbox"]').prop("disabled", false);
                $(thisTileDRA).find('[id^="IBPriceipbox"]').prop("disabled", false); //LGTGTWINT-1095
                $(thisTileDRA).find('[id^="couponipbox"]').prop("disabled", true);
                $(thisTileDRA).find('[id^="txtupfrontDRA"]').prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeDRA($(thisTileDRA).find('[id^="ddlDRAType"]').val().trim(), thisTileDRA);
            }
        }
             
    } catch (error) {
        console.log(error.message)
    }
}