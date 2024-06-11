var token = "";
var shareCount;
var QuoteObject;
var CouponFreq;
var arrBooster = [];
var maxBooster;
var finalResponseDataBooster;
var finalTokenBooster;
var repriceObjectBooster;
var TimerBooster = 0;
var finalObjBooster;
var idBooster = 30;
var globalDefaultSharesArrayBooster = ["AMZN.OQ"] //LGTGTWINT-1723 Instant Pricer : Remove FB.OQ ticker from default notes payoff's.
// LGTGTWINT-1808 | Instant Pricing | Share suggestion dropdown missing for single underlying products

// To load the Booster tile
function onLoadBooster(currId,isProductCopiedBooster) {
    try {
        // Added logic for getting current tile //

        setDeafaultValuesBooster(currId,isProductCopiedBooster);
        thisTileBooster = document.getElementById("td" + currId);
        $(thisTileBooster).find('[id^="OverlayDiv"]').hide();

        sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
         $(thisTileBooster).find('[id^="btnBestPriceBooster"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        // clearInterval($(thisTileBooster).find('[id^="hdnintervalID"]').val());  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileBooster,'[id^="btnBestPriceBooster"]', false);
        clearPricerTable(thisTileBooster);  
        // // END

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileBooster).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
        $(thisTileBooster).find('[id^="RFQIDEQC"]').html("");
        //End


        //Added for Clone tile issue | LGTGTWINT-625 | Chaitanya M | 14 Feb 2023 

        checkSolveForBooster($(thisTileBooster).find('[id^="ddlSolveForBooster"]').val(), thisTileBooster);
        $(thisTileBooster).find('[id^="ddlSolveForBooster"]').on('change', function (event) {
            thisTileBooster = $(this).parents('.sorting')[0];
            ChangeSolveForBooster($(this).val(), thisTileBooster);
        }); 
        // END

        //aded by rutika on 26/04/2022 for calculating tenor when changed in input box
         //Start

        $(thisTileBooster).find('[id^="tenor_Booster"]').on("change", function() {
            try {
             
                thisTileBooster = $(this).parents(".sorting")[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileBooster,"btnBestPriceBooster"); 
               $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val("")
               //End

                if( $(thisTileBooster).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_Booster"]').val()) > Number(DRAAllowedTenorinMonths) || $(this).parents(".sorting").find('[id^="tenor_Booster"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_Booster"]').val() == ""){
                        ValidateField($(thisTileBooster).find('[id^="tenor_Booster"]').attr("id"), "Please enter valid tenor.", thisTileBooster);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_Booster"]').val()) > Number(BoosterAllowedTenorinYears) || $(this).parents(".sorting").find('[id^="tenor_Booster"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_Booster"]').val() == ""){
                        ValidateField($(thisTileBooster).find('[id^="tenor_Booster"]').attr("id"), "Please enter valid tenor.", thisTileBooster);
                        return false;
                    }
                }
                // calculateTenor(currId); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023         

            } catch (error) {
                console.log(error);
            }
        });

        //Added for LGTGTWINT-1077 Instant Pricing: Input length for all fields for all payoffs | Chaitanya M | 28-01-2023
        $(thisTileBooster).find('[id^="tenor_Booster"]').on("keyup", function (){            

             InputLengthCheckEQC(thisTileBooster, "tenor_Booster",3);
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileBooster).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBooster).find('[id^="RFQIDEQC"]').html("");
            //End
        });

        $(thisTileBooster).find("[id^='strikeipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileBooster, "strikeipbox",8); //Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            // $(thisTileBooster).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBooster).find('[id^="RFQIDEQC"]').html("");
            //End
        
        });

        $(thisTileBooster).find("[id^='txtupfrontBooster']").on("keyup", function(){
             InputLengthCheckEQC(thisTileBooster, "txtupfrontBooster",6); //Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
              //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            // $(thisTileBooster).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBooster).find('[id^="RFQIDEQC"]').html("");
            //End
        
        });

        $(thisTileBooster).find("[id^='kiinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileBooster, "kiinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
              //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            // $(thisTileBooster).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBooster).find('[id^="RFQIDEQC"]').html("");
            //End
        
        });

        $(thisTileBooster).find("[id^='koinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileBooster, "koinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
             //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            //  $(thisTileBooster).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
             $(thisTileBooster).find('[id^="RFQIDEQC"]').html("");
             //End

        });
        
        $(thisTileBooster).find("[id^='couponipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileBooster, "couponipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            // $(thisTileBooster).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBooster).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileBooster).find("[id^='IBPriceipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileBooster, "IBPriceipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            // $(thisTileBooster).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBooster).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileBooster).find("[id^='noncallinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileBooster, "noncallinputbox",3);
         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023    
            // $(thisTileBooster).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBooster).find('[id^="RFQIDEQC"]').html("");
            //End
            
        });
        
        //End

        $(thisTileBooster).find('[id^="tenorddl"]').on("change", function () {
            try {
                
                thisTileBooster = $(this).parents(".sorting")[0];
                let currId=   thisTileBooster.id.match(/\d+$/)[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileBooster,"btnBestPriceBooster");  
               $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val("")
               //End

                if( $(thisTileBooster).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_Booster"]').val()) > Number(DRAAllowedTenorinMonths)){
                        ValidateField($(thisTileBooster).find('[id^="tenor_Booster"]').attr("id"), "Please enter valid tenor.", thisTileBooster);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_Booster"]').val()) > Number(BoosterAllowedTenorinYears)){
                        ValidateField($(thisTileBooster).find('[id^="tenor_Booster"]').attr("id"), "Please enter valid tenor.", thisTileBooster);
                        return false;
                    }
                }
    
                // calculateTenor(currId); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
               
            } catch (error) {
                console.log(error);
            }
        });

        //End
        
        $(thisTileBooster).find("div.card input[type='text'],div.card input[type='search'],div.card select").on('change', function () {

            thisTileBooster = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileBooster).find('[id^="btnBestPriceBooster"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileBooster).find('[id^="hdnintervalID"]').val());
           $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            clearPricerTable(thisTileBooster);
            mapleLoaderStop(thisTileBooster,'[id^="btnBestPriceBooster"]', false);
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileBooster).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileBooster).find('[id^="BookTradeBooster"]').attr("disabled", true);          
            $(thisTileBooster).find('[id^="OrderEmail"]').attr("disabled",true);  //LGTGTWINT-1981 || RizwanS || 12 May 2023  
         })
 
        $(thisTileBooster).find(" div.card .amtPopup").on('select', function () { // INT1FIN47-768 Gateway Markets Instant Pricing issue
          
            thisTileBooster = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileBooster).find('[id^="btnBestPriceBooster"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileBooster).find('[id^="hdnintervalID"]').val());
           $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val("")// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            clearPricerTable(thisTileBooster);
            mapleLoaderStop(thisTileBooster,'[id^="btnBestPriceBooster"]', false);
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileBooster).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileBooster).find('[id^="BookTradeBooster"]').attr("disabled", true);    
            $(thisTileBooster).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023    
             
        })

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        //Start      
        $(thisTileBooster).find('div.card .ddlShares').on("focusout", function (){                
              
            validatesharebasket(thisTileBooster,"shareNameBooster");        
            sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileBooster,"btnBestPriceBooster");  
           $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileBooster).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileBooster).find('[id^="BookTradeBooster"]').attr("disabled", true);
            $(thisTileBooster).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023   
                                     
                
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        $(thisTileBooster).find("div.card .ddlShares").on("keydown", function(){
            
            $("#bodyDiv").hide(); 
            //Added for LGTGTWINT-1292 | Chaitanya M | 28 Feb 2023                    
            _ccylistBooster = getExchangeAndCcyFromBasket($(thisTileBooster).find('[id^="shareDivBooster"]')[0], "share");
            if(_ccylistBooster.length >=4){
                return false;
            }  
            sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileBooster,"btnBestPriceBooster"); 
           $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023n
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileBooster).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileBooster).find('[id^="BookTradeBooster"]').attr("disabled", true);       
            $(thisTileBooster).find('[id^="OrderEmail"]').attr("disabled",true);  //LGTGTWINT-1981 || RizwanS || 12 May 2023  
        }); 

        //Added for Clone tile issue | LGTGTWINT-625 | Chaitanya M | 14 Feb 2023
 
        $(thisTileBooster).find('[id^="ddlBoosterType"]').on("change", function() {
            try {
                thisTileBooster = $(this).parents(".sorting")[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileBooster,"btnBestPriceBooster"); 
               $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val("");
               //End
               
                validation_clear(); //To Remove highlighted part if no error 
                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);

            } catch (error) {
                console.log(error.message);
            }
        });

        //END

        shareCount = 0;
        $(thisTileBooster).find('[id^="shareDivBooster"]').click(function() {
            $(this).find('input[type="search"]').focus();
        });

        // Check for upfront/IB Price 

        $(thisTileBooster).find('[id^="txtupfrontBooster"]').on("change", function() {
            try {
                 
             
            thisTileBooster = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileBooster,"btnBestPriceBooster");  
           $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val("");
           //END

            if(DRAFCNUpfrontYN .toUpperCase() != "YES" || !DRAFCNUpfrontYN .toUpperCase().includes("Y")){

                let _ibprice =   parseFloat(100 -  Number($(thisTileBooster).find('[id^="txtupfrontBooster"]').val())).toFixed(2);;

                $(thisTileBooster).find('[id^="IBPriceipbox"]').val(_ibprice);

            }

            } catch (error) {
                console.log(error.message);
            }
        });

        $(thisTileBooster).find('[id^="IBPriceipbox"]').on("change", function() {
            try { 
             
            thisTileBooster = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileBooster,"btnBestPriceBooster");  
           $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val("");
           //End

            if(DRAFCNUpfrontYN .toUpperCase() != "YES" || !DRAFCNUpfrontYN .toUpperCase().includes("Y")){

                let _upfront =  parseFloat(100 -  Number($(thisTileBooster).find('[id^="IBPriceipbox"]').val())).toFixed(2);

                $(thisTileBooster).find('[id^="txtupfrontBooster"]').val(_upfront);
            }
            } catch (error) {
                console.log(error.message);
            }
        });

        //Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
        $(thisTileBooster).find('[id^="ContractAmtBooster"]').on("change", function(){
        // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
        sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileBooster,"btnBestPriceBooster");  
           $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val("");
           //End
            if($(thisTileBooster).find('[id^="ContractAmtBooster"]').val()== "" || $(thisTileBooster).find('[id^="ContractAmtBooster"]').val()==null || $(thisTileBooster).find('[id^="ContractAmtBooster"]').val()=="0" ){
              $(thisTileBooster).find('[id^="ContractAmtBooster"]').val("0"); 
            }    
            return false;         
          }); 


    } catch (error) {
        console.log(error);
    }
}

// Added for Clone tile issue | LGTGTWINT-625 | Chaitanya M | 14 Feb 2023
function checkSolveForBooster(solveFor,thisTileBooster,calledFromIndexBooster) {
    try {
        if (calledFromIndexBooster != undefined){
            if (solveFor.trim().includes("Conversion_Strike")) {
                $(thisTileBooster).find('[id^="strikeipbox"]').prop('disabled', true);
                $(thisTileBooster).find('[id^="IBPriceipbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="couponipbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="txtupfrontBooster"]').prop('disabled', false);  
                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);
            } else if (solveFor.trim().includes("Price")) {
                $(thisTileBooster).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="IBPriceipbox"]').prop('disabled', true);
                $(thisTileBooster).find('[id^="couponipbox"]').prop('disabled', false);
		        $(thisTileBooster).find('[id^="txtupfrontBooster"]').prop('disabled', true); //LGTGTWINT-1095
                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);       
            } else if (solveFor.trim().includes("Coupon") ) {
                $(thisTileBooster).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="IBPriceipbox"]').prop('disabled', false);  
                $(thisTileBooster).find('[id^="couponipbox"]').prop("disabled", true);
                $(thisTileBooster).find('[id^="txtupfrontBooster"]').prop('disabled', false);  
                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);
            }
        }
        else {
            if (solveFor.trim().includes("Conversion_Strike")) {
                $(thisTileBooster).find('[id^="strikeipbox"]').prop("disabled", true);
                $(thisTileBooster).find('[id^="IBPriceipbox"]').val("98.50").prop("disabled", false); //LGTGTWINT-1095
                $(thisTileBooster).find('[id^="couponipbox"]').val("8.00").prop("disabled", false);
                $(thisTileBooster).find('[id^="txtupfrontBooster"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);

            } else if (solveFor.trim().includes("Price")) {
                $(thisTileBooster).find('[id^="strikeipbox"]').val("85.00").prop("disabled", false);
                $(thisTileBooster).find('[id^="IBPriceipbox"]').prop("disabled", true);
                $(thisTileBooster).find('[id^="couponipbox"]').val("8.00").prop("disabled", false);
                $(thisTileBooster).find('[id^="txtupfrontBooster"]').prop('disabled', true); //LGTGTWINT-1095
                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);
            } else if (solveFor.trim().includes("Coupon")) {
                $(thisTileBooster).find('[id^="strikeipbox"]').val("85.00").prop("disabled", false);
                $(thisTileBooster).find('[id^="IBPriceipbox"]').val("98.50").prop("disabled", false); //LGTGTWINT-1095
                $(thisTileBooster).find('[id^="couponipbox"]').prop("disabled", true);
                $(thisTileBooster).find('[id^="txtupfrontBooster"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);
            }
        }
             
    } catch (error) {
        console.log(error.message)
    }
}

//Added for Clone tile issue| LGTGTWINT-625 | Chaitanya M | 14 Feb 2023
function checkKOKITypeBooster(KOKIType, thisTileBooster, calledFromIndex) {
    try {
        if(calledFromIndex != true){
            if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
                $(thisTileBooster).find('[id^="koinputbox"]').prop('disabled', false);
                //Chaitanya M 16-March-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
                //START
                $(thisTileBooster).find('[id^="kiinputbox"]').prop("disabled", true);
               //END
                $(thisTileBooster).find('[id^="noncallinputbox"]').prop('disabled', false);
            }  else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
                $(thisTileBooster).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="noncallinputbox"]').prop('disabled', false);
            }
            else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") { //LGTCLI-332  | Chaitanya M | 23 Feb 2023
                $(thisTileBooster).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTileBooster).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="noncallinputbox"]').prop('disabled', true);
            } else if (KOKIType == "NOKINOKO") {
                $(thisTileBooster).find('[id^="koinputbox"]').prop("disabled", true);
                //Chaitanya M 16-March-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
                //START
                $(thisTileBooster).find('[id^="kiinputbox"]').prop('disabled', true);
                $(thisTileBooster).find('[id^="noncallinputbox"]').prop('disabled', true);
            }
        }else{
            if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
                $(thisTileBooster).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="kiinputbox"]').prop("disabled", true);
                $(thisTileBooster).find('[id^="noncallinputbox"]').prop('disabled', false);
            } else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
                $(thisTileBooster).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="noncallinputbox"]').prop('disabled', false);
            }
            else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") { //LGTCLI-332  | Chaitanya M | 23 Feb 2023
                $(thisTileBooster).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTileBooster).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="noncallinputbox"]').prop('disabled', true);
            } else if (KOKIType == "NOKINOKO") {
                $(thisTileBooster).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTileBooster).find('[id^="kiinputbox"]').prop('disabled', true);
                //END
                $(thisTileBooster).find('[id^="noncallinputbox"]').prop('disabled', true);
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}
function checkupfrontPriceBooster(thisTileBooster){

    try
    {
        let _ibprice =   parseFloat(100 -  Number($(thisTileBooster).find('[id^="txtupfrontBooster"]').val())).toFixed(2);;

        $(thisTileBooster).find('[id^="IBPriceipbox"]').val(_ibprice);
    
        let _upfront =  parseFloat(100 -  Number($(thisTileBooster).find('[id^="IBPriceipbox"]').val())).toFixed(2);
    
        $(thisTileBooster).find('[id^="txtupfrontBooster"]').val(_upfront);

    }catch(er){
        
        console.log(er.message);
    }   
}

// To set default values for Booster
function setDeafaultValuesBooster(currId,isProductCopiedBooster) {
    try {
        // Added logic for getting current tile //

        thisTileBooster = document.getElementById("td" + currId);


         //Configured UI fileds Start :: || 08 Feb 2023

         if(DRAFCNUpfrontYN .toUpperCase() == "YES" || DRAFCNUpfrontYN .toUpperCase().includes("Y")){

            $(thisTileBooster).find('[id^="txtupfrontBooster"]').val("0.00"); //LGTGTWINT-1095
            $(thisTileBooster).find('[id^="txtupfrontBooster"]').hide(); //UI filed
            $(thisTileBooster).find('[id^="upfrontuilbl"]').hide(); //UI label
            $(thisTileBooster).find('[id^="txtupfrontlbl"]').hide(); // hide label order popup
            $(thisTileBooster).find('[id^="txtupfrontVal"]').hide(); //Order popup filed
            
        }else{
            $(thisTileBooster).find('[id^="txtupfrontBooster"]').val("0.00");
        }
        // END

        $(thisTileBooster).find('[id^="ContractAmtBooster"]').val("1,000,000.00");
        $(thisTileBooster).find('[id^="ContractAmtBooster"]').attr('maxlength','14');
        $(thisTileBooster).find('[id^="strikeipbox"]').val("85.00");
        $(thisTileBooster).find('[id^="couponipbox"]').val("8.00");
        $(thisTileBooster).find('[id^="kiinputbox"]').val("65.00");
        $(thisTileBooster).find('[id^="koinputbox"]').val("105.00");
        $(thisTileBooster).find('[id^="tenor_Booster"]').val("6"); 
        $(thisTileBooster).find('[id^="IBPriceipbox"]').val("98.50"); //LGTGTWINT-1095
        $(thisTileBooster).find('[id^="Guaranteeipbox"]').val("1");
        callDropDownFunction($(thisTileBooster).find('[id^="shareName"]'), "Booster", currId);
        EQProductsFillCcy(thisTileBooster, "ddlBoosterCcy");
        document.querySelector("#" + $(thisTileBooster).find('[id^="tenor_Booster"]').attr("id")).selectedIndex = 2;
        clearPricerTable(thisTileBooster);
        $(thisTileBooster).find('[id^="shareNameCntrlBooster"]').html("");
        $(thisTileBooster).find('[id^="hiddenshareinputBooster"]').html("");
       
     
        if(!isProductCopiedBooster){
            for (let s=0;s<clientConfigdata.EQCBooster.MinSharesInBaskets;s++){
                createElementInBasket(thisTileBooster, 'shareDivBooster', sessionStorage.getItem(thisTileBooster.id)!=undefined?sessionStorage.getItem(thisTileBooster.id).split(" ")[s]:globalDefaultSharesArrayBooster[s]); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
            
            }
        }
       
        $(thisTileBooster).find('[id^="shareName"]')[0].placeholder = "";
        $(thisTileBooster).find('[id^="ddlBoosterCcy"]').val(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);
    } catch (error) {
        console.log(error);
    }
}
var globalSolveForValueBooster='';
// To get best price for Booster
function getBestPriceBooster(that) {
    try {
        // Added logic for getting current tile //

             //    var uniqueIntervalID;
             thisTileBooster = $(that).parents(".sorting")[0];

             console.log('Start Interval value =' + $(thisTileBooster).find('[id^="hdnintervalID"]').val());
     
            $(thisTileBooster).find('[id^="btnBestPriceBooster"]').attr("disabled", true); // INT1FIN47-768 Gateway Markets Instant Pricing issue

            var requestIDBooster = "";

            requestIDBooster = requestIDBooster + RequestIDGenerator(40);

            $(thisTileBooster).find('[id^="hdnRequestID"]').val(requestIDBooster);  //INT1FIN47-768 Gateway Markets Instant Pricing issue

            mapleLoaderStop(thisTileBooster,'[id^="btnBestPriceBooster"]', false);

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileBooster).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileBooster).find('[id^="RFQIDEQC"]').html("");
            //End

             globalSolveForValueBooster = $(thisTileBooster).find('[id^="ddlSolveForBooster"]').val().trim();
             
             clearInterval($(thisTileBooster).find('[id^="hdnintervalID"]').val());
          
             console.log('After clear Interval value =' + $(thisTileBooster).find('[id^="hdnintervalID"]').val());
     
             $(thisTileBooster).find('[id^="hdnintervalID"]').val("");
     
     
             TileId = that.id.match(/\d+$/)[0];
     
             sessionStorage.setItem("poolingTimer_" + TileId, 0);
             sessionStorage.setItem("pricingToggle" + TileId, false);
             thisTileBooster = document.getElementById("td" + TileId);
             productName = $($(that).parents(".sorting").find(".productName")).attr('id');
             console.log(TileId, thisTileBooster, productName);
     
             $(thisTileBooster).find('[id^="TBLBooster"]' + " td").each(function () {
                 //Clear prices || Tina K || 11-Sep-2019
                 $(this).html("-");
             })
             validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
             clearPricerTable(thisTileBooster); //To clear prices after clicking best price || Tina K || 20-Nov-2019
             //Validation conditions added : Tina Kshirsagar : 6-09-2019


             let tenorNumb = $(thisTileBooster).find("[id^='tenor_Booster']").val();
             let tenorstring = $(thisTileBooster).find("[id^='tenorddl']").val();
             let _tenor = tenorNumb + tenorstring;
     
             let _tenorinMonths = "";
     
             if(tenorstring != "M"){
     
                 _tenorinMonths =  parseFloat($(thisTileBooster).find('[id^="tenor_Booster"]').val()) * 12;
     
             }else{
     
                 _tenorinMonths =  parseFloat($(thisTileBooster).find('[id^="tenor_Booster"]').val());
             }


        //  Client Side Validation Added for all cases // 07-April-2020

        if ($(thisTileBooster).find('[id^="shareDivBooster"]')[0].childNodes.length <= 1) {     
            ValidateField($(thisTileBooster).find('[id^="shareDivBooster"]').attr('id'), "Please Enter Valid Shares", thisTileBooster);
            return false
        } else if ($.trim($(thisTileBooster).find('[id^="ContractAmtBooster"]').val()) == "" || $.trim($(thisTileBooster).find('[id^="ContractAmtBooster"]').val()) < 0) { // LGTGTWINT-1487 | Chaitanya M | 24 Feb 2023
            ValidateField($(thisTileBooster).find('[id^="ContractAmtBooster"]').attr("id"), "Please enter valid notional.", thisTileBooster); // LGTGTWINT-1487 | Chaitanya M | 24 Feb 2023
            return false;
        } else if ($.trim($(thisTileBooster).find('[id^="tenor_Booster"]').val()) == '' || parseFloat($(thisTileBooster).find('[id^="tenor_Booster"]').val()) <= 0) {
            ValidateField($(thisTileBooster).find('[id^="tenor_Booster"]').attr('id'), "Please Enter Valid Tenor.", thisTileBooster);
            return false
        } else if ($.trim($(thisTileBooster).find('[id^="ddlBoosterCcy"]').val()) == "") {
            ValidateField($(thisTileBooster).find('[id^="ddlBoosterCcy"]').attr("id"), "Please Select Valid Note Ccy", thisTileBooster);
            return false;
        } else if (($.trim($(thisTileBooster).find('[id^="koinputbox"]').val()) == "" || parseFloat($(thisTileBooster).find('[id^="koinputbox"]').val()) <= Number(DRAFCNMinKO) || parseFloat($(thisTileBooster).find('[id^="koinputbox"]').val()) > Number(DRAFCNMaxKO)) && $(thisTileBooster).find('[id^="koinputbox"]').prop("disabled") != true) {
            ValidateField($(thisTileBooster).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO (%) Initial.", thisTileBooster);
            return false;
        } else if (($.trim($(thisTileBooster).find('[id^="kiinputbox"]').val()) == "" || parseFloat($(thisTileBooster).find('[id^="kiinputbox"]').val()) <= 0) && $(thisTileBooster).find('[id^="kiinputbox"]').prop("disabled") != true) {
            ValidateField($(thisTileBooster).find('[id^="kiinputbox"]').attr("id"), "Please Enter Valid KI (%).", thisTileBooster);
            return false;
        } else if ($.trim($(thisTileBooster).find('[id^="Guaranteeipbox"]').val()) == "" || parseFloat($(thisTileBooster).find('[id^="Guaranteeipbox"]').val()) <= 0) {
            ValidateField($(thisTileBooster).find('[id^="Guaranteeipbox"]').attr("id"), "Guarantee coupon periods can not be 0 or negative.", thisTileBooster);
            return false;
        } else if (($(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "3M")) {
            ValidateField($(thisTileBooster).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid. ", thisTileBooster);
            return false;
        } else if (($(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "QUARTERLY" || $(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "1M")) {
            ValidateField($(thisTileBooster).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid. ", thisTileBooster);
            return false;
        } else if (($(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "9M")) {
            ValidateField($(thisTileBooster).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid. ", thisTileBooster);
            return false;
        } else if (($(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "6M")) {
            ValidateField($(thisTileBooster).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid.", thisTileBooster);
            return false;
        }else if($(thisTileBooster).find('[id^="noncallinputbox"]').val() <= 0 || $(thisTileBooster).find('[id^="noncallinputbox"]').val() == "") {
            ValidateField($(thisTileBooster).find('[id^="noncallinputbox"]').attr("id"), "Non Call can not be zero negative. ", thisTileBooster);
            return false;    
        // Added by RizwanS || LGTGTWINT-445 || 07 Dec 2022
        }else if($(thisTileBooster).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "MONTHLY")){
            if(parseFloat($(thisTileBooster).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths)){
                ValidateField($(thisTileBooster).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileBooster);
                return false;
            }
        } else if($(thisTileBooster).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY")){
            if(parseFloat($(thisTileBooster).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 2)){
                ValidateField($(thisTileBooster).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileBooster);
                return false;
            }
        } else if($(thisTileBooster).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "QUARTERLY")){
            if(parseFloat($(thisTileBooster).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 3)){
                ValidateField($(thisTileBooster).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileBooster);
                return false;
            }
        } else if($(thisTileBooster).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY")){
            if(parseFloat($(thisTileBooster).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 6)){
                ValidateField($(thisTileBooster).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileBooster);
                return false;
            }
        } else if($(thisTileBooster).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY")){
            if(parseFloat($(thisTileBooster).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 12)){
                ValidateField($(thisTileBooster).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileBooster);
                return false;
            }
        }

        // RizwanS || LGTGTWINT-2320 || 17 Aug 2023
        if (NotionalMinMaxCheck === "YES") {
            if(parseFloat($(thisTileBooster).find('[id^="ContractAmtBooster"]').val().replace(/,/g, "")) === 0){     
                ValidateField($(thisTileBooster).find('[id^="hdnQuoteID"]').attr('id'),"Please input non zero notional.",thisTileBooster); 
                return false;
            }
        }// END

        if ($(thisTileBooster).find('[id^="ddlSolveFor"]').val() == "Conversion_Strike") {
            if (parseFloat($(thisTileBooster).find('[id^="IBPriceipbox"]').val()) == "" || parseFloat($(thisTileBooster).find('[id^="IBPriceipbox"]').val()) <= 0 ) {  // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                ValidateField($(thisTileBooster).find('[id^="IBPriceipbox"]').attr("id"), "Price % must be greater than 0.", thisTileBooster);  // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                return false;
            } else if (parseFloat($(thisTileBooster).find('[id^="couponipbox"]').val()) == "" || parseFloat($(thisTileBooster).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileBooster).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileBooster).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon (%).", thisTileBooster);
                return false;
            } else if ($(thisTileBooster).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileBooster).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileBooster).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileBooster).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileBooster).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%).", thisTileBooster);
                return false;
            }
        } else if ($(thisTileBooster).find('[id^="ddlSolveFor"]').val() == "Coupon") {
            if (parseFloat($(thisTileBooster).find('[id^="strikeipbox"]').val()) == "" || parseFloat($(thisTileBooster).find('[id^="strikeipbox"]').val()) <= 0 ) {  // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                ValidateField($(thisTileBooster).find('[id^="strikeipbox"]').attr("id"), "Strike % must be greater than 0.", thisTileBooster);// LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                return false;
            } else if (parseFloat($(thisTileBooster).find('[id^="IBPriceipbox"]').val()) == "" || parseFloat($(thisTileBooster).find('[id^="IBPriceipbox"]').val()) <= 0 || parseFloat($(thisTileBooster).find('[id^="IBPriceipbox"]').val()) > 100) {
                ValidateField($(thisTileBooster).find('[id^="IBPriceipbox"]').attr("id"), "Price % must be greater than 0 and less than 100.", thisTileBooster);
                return false;
            }else if ($(thisTileBooster).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileBooster).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileBooster).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileBooster).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%).", thisTileBooster);
                return false;
            }else if ($(thisTileBooster).find('[id^="koinputbox"]').prop("disabled") != true && (parseFloat($(thisTileBooster).find('[id^="strikeipbox"]').val()) > parseFloat($(thisTileBooster).find('[id^="koinputbox"]').val()))) {
                //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(BoosterFCNEnableStrikeBelowKO.toUpperCase() === "YES"){
                    ValidateField($(thisTileBooster).find('[id^="strikeipbox"]').attr("id"),"Strike (%) should be less than KO (%).", thisTileBooster);
                    return false;
                }
                // End- LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
            }else if ($(thisTileBooster).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileBooster).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileBooster).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileBooster).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileBooster).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%).", thisTileBooster);
                return false;
            }else if(parseFloat($(thisTileBooster).find('[id^="strikeipbox"]').val()) > 100){ //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(BoosterFCNStrikeBeyond100Pct.toUpperCase() === "NO"){
                    ValidateField($(thisTileBooster).find('[id^="strikeipbox"]').attr("id"), "Strike % must be less than or equal to 100.", thisTileBooster);
                    return false;
                }
            } //End - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
        } else if ($(thisTileBooster).find('[id^="ddlSolveFor"]').val() == "Price") {
            if (parseFloat($(thisTileBooster).find('[id^="strikeipbox"]').val()) == "" || parseFloat($(thisTileBooster).find('[id^="strikeipbox"]').val()) <= 0 ) { // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                ValidateField($(thisTileBooster).find('[id^="strikeipbox"]').attr("id"), "Strike % must be greater than 0.", thisTileBooster); // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                return false;
            } else if (parseFloat($(thisTileBooster).find('[id^="couponipbox"]').val()) == "" || parseFloat($(thisTileBooster).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileBooster).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileBooster).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon (%).", thisTileBooster);
                return false;
            } if ($(thisTileBooster).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileBooster).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileBooster).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileBooster).find('[id^="kiinputbox"]').attr("id"), "KI (%) Should Be Less Than Strke (%).", thisTileBooster);
                return false;
            }else if ($(thisTileBooster).find('[id^="koinputbox"]').prop("disabled") != true && (parseFloat($(thisTileBooster).find('[id^="strikeipbox"]').val()) > parseFloat($(thisTileBooster).find('[id^="koinputbox"]').val()))) {
                //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(BoosterFCNEnableStrikeBelowKO.toUpperCase() === "YES"){
                    ValidateField($(thisTileBooster).find('[id^="strikeipbox"]').attr("id"),"Strike (%) should be less than KO (%).", thisTileBooster);
                    return false;
                }
                // End- LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
            } else if ($(thisTileBooster).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileBooster).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileBooster).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileBooster).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileBooster).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%).", thisTileBooster);
                return false;
            }else if(parseFloat($(thisTileBooster).find('[id^="strikeipbox"]').val()) > 100){ //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(BoosterFCNStrikeBeyond100Pct.toUpperCase() === "NO"){
                    ValidateField($(thisTileBooster).find('[id^="strikeipbox"]').attr("id"), "Strike % must be less than or equal to 100.", thisTileBooster);
                    return false;
                }
            } //End - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
        }

        // END


         // Added by RizwanS for tenor validation before pricing || 03 Jan 2022 ||

         if( $(thisTileBooster).find('[id^="tenorddl"]').val() == "M"){

            if(Number($(thisTileBooster).find('[id^="tenor_Booster"]').val()) > Number(DRAAllowedTenorinMonths)){
                ValidateField($(thisTileBooster).find('[id^="tenor_Booster"]').attr("id"), "Please enter valid tenor.", thisTileBooster);
                return false;
            }

        } else{

             if(Number($(thisTileBooster).find('[id^="tenor_Booster"]').val()) > Number(BoosterAllowedTenorinYears)){
                ValidateField($(thisTileBooster).find('[id^="tenor_Booster"]').attr("id"), "Please enter valid tenor.", thisTileBooster);
                return false;
            }
        }
        
        // END

        $("body").css("opacity", "0.9");

        if ($(thisTileBooster).find('[id^="ddlBoosterType"]').val() == "NOKIKODC") {
            KIPerc = "";
            KIType = "";
            KOPerc = $(thisTileBooster).find('[id^="koinputbox"]').val();
            KOType = "American";

        } else if ($(thisTileBooster).find('[id^="ddlBoosterType"]').val() == "NOKIKOPE") {
            KIPerc = "";
            KIType = "";
            KOPerc = $(thisTileBooster).find('[id^="koinputbox"]').val();
            KOType = "European";

        } else if ($(thisTileBooster).find('[id^="ddlBoosterType"]').val() == "KIDCKODC") {
            KIPerc = $(thisTileBooster).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileBooster).find('[id^="koinputbox"]').val();
            KIType = "American";
            KOType = "American";
        } else if ($(thisTileBooster).find('[id^="ddlBoosterType"]').val() == "KIDCKOPE") {
            KIPerc = $(thisTileBooster).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileBooster).find('[id^="koinputbox"]').val();
            KIType = "American";
            KOType = "European";
        } else if ($(thisTileBooster).find('[id^="ddlBoosterType"]').val() == "KIEURKODC") {
            KIPerc = $(thisTileBooster).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileBooster).find('[id^="koinputbox"]').val();
            KIType = "European";
            KOType = "American";
        } else if ($(thisTileBooster).find('[id^="ddlBoosterType"]').val() == "KIEURKOPE") {
            KIPerc = $(thisTileBooster).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileBooster).find('[id^="koinputbox"]').val();
            KIType = "European";
            KOType = "European";
        }else if ($(thisTileBooster).find('[id^="ddlBoosterType"]').val() == "KIDCNOKO") { //LGTCLI-332  | Chaitanya M | 23 Feb 2023
            KIPerc = $(thisTileBooster).find('[id^="kiinputbox"]').val();
            KOPerc = ""
            KIType = "American";
            KOType = "";
        } else if ($(thisTileBooster).find('[id^="ddlBoosterType"]').val() == "KIEURNOKO") {
            KIPerc = $(thisTileBooster).find('[id^="kiinputbox"]').val();
            KOPerc = ""
            KIType = "European";
            KOType = "";
        } else if ($(thisTileBooster).find('[id^="ddlBoosterType"]').val() == "NOKINOKO") {
            KIPerc = "";
            KOPerc = ""
            KIType = "";
            KOType = "";
        }
        
        let _upfront = "";

        if(DRAFCNUpfrontYN .toUpperCase() != "YES" || !DRAFCNUpfrontYN .toUpperCase().includes("Y")){

           _upfront = $(thisTileBooster).find('[id^="txtupfrontBooster"]').val().trim() ?$(thisTileBooster).find('[id^="txtupfrontBooster"]').val().trim() :0;

        }else{

            _upfront =  "0.00"; 
        }

        let exchangeListBooster = getExchangeAndCcyFromBasket($(thisTileBooster).find('[id^="shareDivBooster"]')[0], "exchange");
        let ccyListBooster = getExchangeAndCcyFromBasket($(thisTileBooster).find('[id^="shareDivBooster"]')[0], "ccy");
        let shareList = getExchangeAndCcyFromBasket($(thisTileBooster).find('[id^="shareDivBooster"]')[0], "share");

        // Added ER_Quanto flag not getting updated for ELN, FCN and Booster in Instant pricer | LGTGTWINT-1448| Chaitanya M | 20 Feb 2023
        
        let _QuantoFlagBooster = "";
        uniqueCCY = ccyListBooster.filter((item, i, ar) => ar.indexOf(item) === i);
        if(uniqueCCY.length==1){
            if($(thisTileBooster).find('[id^="ddlBoosterCcy"]').val() == uniqueCCY[0]){
                _QuantoFlagBooster = "No";
            }else{
                _QuantoFlagBooster = "Yes";
            }
        }else{
            _QuantoFlagBooster = "Yes";
        }
        //End


           // LGTGTWINT-1227 - Instant Pricing: EQC Ref missing for rfqs placed through instant pricing | 24 Feb 2023

           let _tenorBooster = ""

           if(tenorstring.toUpperCase().includes("M")){
           
            _tenorBooster= "MONTH";
           
           }else{
           
            _tenorBooster= "YEAR";
           }

            let getRefBooster = "";
           
            getRefBooster = getEQCRefrenceNumber(productName,KOType,KIType,tenorNumb,_tenorBooster,$(thisTileBooster).find('[id^="ddlSolveForBooster"]').val() != "Coupon" ? $(thisTileBooster).find('[id^="couponipbox"]').val() : "",_QuantoFlagBooster,"Worst of");
           
            $(thisTileBooster).find('[id^="hdnRefnumber"]').val(getRefBooster); //LGTGTWINT-1589 Instant Pricing : EQC ref different on instant pricer and order details,quote mail and order mail

           // END
        mapleLoaderStart(thisTileBooster,'[id^="btnBestPriceBooster"]', false);

        QuoteObject = {
            "BarrierPerc":  "",
            "Ccy": $(thisTileBooster).find('[id^="ddlBoosterCcy"]').val(),
            "CouponFrq": $(thisTileBooster).find('[id^="ddlCouponFrequency"]').val().toUpperCase(),
            "CouponPerc":  $(thisTileBooster).find('[id^="ddlSolveForBooster"]').val() != "Coupon" ? $(thisTileBooster).find('[id^="couponipbox"]').val() : "",
            "EntityID":     sessionStorage.getItem("EQC_EntityID").toString(),
            "Exchange1":  exchangeListBooster[0],
            "Exchange2": exchangeListBooster[1],
            "Exchange3":  exchangeListBooster[2],
            "Exchange4":  exchangeListBooster[3]?? "",
            "GuaranteedDuration":  $(thisTileBooster).find('[id^="Guaranteeipbox"]').val(),
            "KIPerc": KIPerc,
            "KIType":  KIType,
            "KOPerc": KOPerc,
            "KOType": KOType,
            "Notional": $(thisTileBooster).find('[id^="ContractAmtBooster"]').val().replace(/,/g, "").split(".")[0],
            "PPDetails": "",
            "PricePerc":$(thisTileBooster).find('[id^="ddlSolveForBooster"]').val() != "Price" ? $(thisTileBooster).find('[id^="IBPriceipbox"]').val() : "",
            "QuantoYN": _QuantoFlagBooster, // LGTGTWINT-1448| Chaitanya M | 20 Feb 2023
            "RMName": "",
            "Settlement_Days": $(thisTileBooster).find('[id^="SettlWeeks"]').val().trim(),
            "Tenor": _tenor,
            "Type": "Booster",
            "UnderlyingCode1": shareList[0],
            "UnderlyingCode2": shareList[1],
            "UnderlyingCode3": shareList[2],
            "UnderlyingCode4": shareList[3] ?? "" ,
            "Upfront":_upfront,// Added by Aniruddhaj 30Nov2022 LGTGTWINT-429
            "UserID":sessionStorage.getItem("EQC_UserName").toString(),
            "nonCall": $(thisTileBooster).find('[id^="noncallinputbox"]').val(),
            "strSolveFor":$(thisTileBooster).find('[id^="ddlSolveForBooster"]').val().toUpperCase(),
            "strikePerc": $(thisTileBooster).find('[id^="ddlSolveForBooster"]').val() != "Conversion_Strike" ? $(thisTileBooster).find('[id^="strikeipbox"]').val() : "",
            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
            "CurrentTileID": TileId,
            "requestID":$(thisTileBooster).find('[id^="hdnRequestID"]').val(), //INT1FIN47-768 Gateway Markets Instant Pricing issue
            "BuysideID": getRefBooster,

        };       

        console.log('Booster price request ', QuoteObject);
        getQuoteBooster(QuoteObject, $(thisTileBooster).find('[id^="hdnintervalID"]')[0]);
  
    } catch (er) {
        console.log(er);
    }
}

// To get quote
function getQuoteBooster(QuoteObject, uniqueIntervalID) {
    try {
        var dataBooster = request_getDataFromAPI(QuoteObject, clientConfigdata.CommonMethods.NodeServer + "getBestQuotesBooster45").then((dataBooster)=>{            
            
            thisTileBooster = document.getElementById("td" + dataBooster.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataBooster.CurrentTileID, true);
            mapleLoaderStart(thisTileBooster,'[id^="btnBestPriceBooster"]', false); 
            getUniqQuoteResponseBooster(thisTileBooster, dataBooster, uniqueIntervalID, QuoteObject.requestID); //INT1FIN47-768 Gateway Markets Instant Pricing issue
      
        }
        ).catch((error)=>{
            console.log(error);
        }
        );
    } catch (err) {
        console.log(err);
    }
}

function getUniqQuoteResponseBooster(thisTileBooster, dataBooster, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var UIID = null;
        // Added by Atharva - EQC Timers - START
        isTimerStarted["td" + dataBooster.CurrentTileID] = false;
        myCounter["td" + dataBooster.CurrentTileID] = {};
        hasUserClickedEQC["td" + dataBooster.CurrentTileID] = false;
        $(thisTileBooster).find('[id^="hdnSelectedBank"]').val("");
        
    
        // END
        uniqueIntervalID.value = setInterval(function () {

               if(reqestID != $(thisTileBooster).find('[id^="hdnRequestID"]').val() || $(thisTileBooster).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                if($(thisTileBooster).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                mapleLoaderStop(thisTileBooster,'[id^="btnBestPriceBooster"]', false);
                }
                return false
            } // INT1FIN47-768 Gateway Markets Instant Pricing issue

            sessionStorage.setItem("quoteToken_" + thisTileBooster.id.match(/\d+$/)[0], "");
            sessionStorage.setItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0], "");

            sessionStorage.setItem("quoteToken_" + thisTileBooster.id.match(/\d+$/)[0], dataBooster['token']);
            sessionStorage.setItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0], dataBooster['responseData']);


            getFinalQuoteResponseBooster(sessionStorage.getItem("quoteToken_" + thisTileBooster.id.match(/\d+$/)[0]), sessionStorage.getItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]), thisTileBooster, uniqueIntervalID, reqestID); // INT1FIN47-768 Gateway Markets Instant Pricing issue

        }, clientConfigdata.EQCBooster.PollInterval);


        console.log('uniqueIntervalID  ' + uniqueIntervalID.value);

    } catch (error) {
        console.log(error)
    }
}

// To get price
function getFinalQuoteResponseBooster(finalTokenBooster1, finalResponsedataBooster1, thisTileBooster, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {
      
        var currentDateAndTime = new Date();

        sessionStorage.setItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0], finalResponsedataBooster1);

        sessionStorage.setItem("quoteToken_" + thisTileBooster.id.match(/\d+$/)[0], finalTokenBooster1);

        console.log("Booster RFQ's :: " + finalResponsedataBooster1 + " " + currentDateAndTime);
        Timer = Timer + 1;


        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileBooster.id.match(/\d+$/)[0])) >= Number(DRAFCNrequestCount .toString().split(".")[0]) || sessionStorage.getItem("pricingToggle" + thisTileBooster.id.match(/\d+$/)[0]) == "false") { //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
          
            // Enabling book trade button when pricing is over
            $(thisTileBooster).find('[id^="btnBestPriceBooster"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval(uniqueIntervalID.value);
            mapleLoaderStop(thisTileBooster,'[id^="btnBestPriceBooster"]', false);

            QuoteObject = "";

            $(thisTileBooster).find('[id^="OverlayDiv"]').hide();

            $("body").css("opacity", "");
            arrBooster = [];
            maxBooster = "";
            TimerBooster = 0;
            //Call Draw Graph
            
            // $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val(JSON.stringify(finalObjBooster));
            // if (finalObjBooster != null || finalObjBooster != undefined) {
            //     drawgraphBooster($(thisTileBooster).find('[id^="canvas"]').attr("id"));
            // }
            // INT1FIN47-768 Gateway Markets Instant Pricing issue

            return false;
        } else {
            var repriceObjectBooster = request_getDataFromAPI({
                "PPDetails": sessionStorage.getItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]),
                "CurrentTileID": thisTileBooster.id.match(/\d+$/)[0],
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "UserID":sessionStorage.getItem("EQC_UserName").toString(),
               
            }, clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseBooster45").then((repriceObjectBooster)=>{

                thisTileBooster = document.getElementById("td" + repriceObjectBooster.CurrentTileID);
                // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileBooster).find('[id^="btnEmailQuote"]').attr("disabled", false);
                $(thisTileBooster).find('[id^="BookTradeBooster"]').attr("disabled", false);
                $(thisTileBooster).find('[id^="OrderEmail"]').attr("disabled",false); //LGTGTWINT-1981 || RizwanS || 12 May 2023    
                
                if(reqestID != $(thisTileBooster).find('[id^="hdnRequestID"]').val() || $(thisTileBooster).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    if($(thisTileBooster).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                        mapleLoaderStop(thisTileBooster,'[id^="btnBestPriceBooster"]', false);
                    }
                    return false
                } //INT1FIN47-768 Gateway Markets Instant Pricing issue
                
                sessionStorage.setItem("poolingTimer_" + thisTileBooster.id.match(/\d+$/)[0], Number(sessionStorage.getItem("poolingTimer_" + thisTileBooster.id.match(/\d+$/)[0])) + 1);
                finalObjBooster = (repriceObjectBooster["responseData"]);

                sessionStorage.setItem("quoteToken_" + thisTileBooster.id.match(/\d+$/)[0], repriceObjectBooster['token']);
                sessionStorage.setItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]));

                // Sorted By Best Price LP'S

                finalObjBooster.sort(function(a, b) {
                    if (a.DRAOUT === null || a.DRAOUT == "" || a.DRAOUT == "Timeout" || a.DRAOUT.toUpperCase().trim() == "REJECTED" || a.DRAOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return 1;
                    } else if (b.DRAOUT === null || b.DRAOUT == "" || b.DRAOUT == "Timeout" || b.DRAOUT.toUpperCase().trim() == "REJECTED" || b.DRAOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return -1;
                    } else if (a.DRAOUT === b.DRAOUT) {
                        return 0;
                    }
                    if ($(thisTileBooster).find('[id^="ddlSolveFor"]').val() == "Coupon") {
                        return Number(a.DRAOUT) > Number(b.DRAOUT) ? -1 : 1;
                    } else {
                        return Number(a.DRAOUT) < Number(b.DRAOUT) ? -1 : 1;
                    }
                });

                //Removed || LGTGTWINT-1981 || RizwanS || 12 May 2023
                finalTokenBooster = repriceObjectBooster['token'];
                $(thisTileBooster).find('[id^="hdnfinalTokenBooster"]').val(finalTokenBooster);
                maxBooster = finalObjBooster[0].DRAOUT;

                //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023

                //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
                // $(thisTileBooster).find('[id^="EQCRfqidpnl"]').show();
                // $(thisTileBooster).find('[id^="RFQIDEQC"]').html("");
                // $(thisTileBooster).find('[id^="RFQIDEQC"]').html("RFQ ID: " +finalObjBooster[0].EP_ER_QuoteRequestId);
                //end

                $(thisTileBooster).find('[id^="hdnfinalTokenBooster"]').val(sessionStorage.getItem("quoteToken_" + thisTileBooster.id.match(/\d+$/)[0]));
                // END
                if (sessionStorage.getItem("pricingToggle" + thisTileBooster.id.match(/\d+$/)[0]) == "true") {
                    // Added by Atharva - EQC Timers - START
                    // every time in new request indexes might change so clearing.
                    var isNonBestPrice = false;
                    if(clientConfigdata.CommonMethods.NonBestPrice == "Y") {
                        isNonBestPrice = true;
                    }
                    else {
                        isNonBestPrice = false;
                    }
                    mapIndexToBank["td"+repriceObjectBooster.CurrentTileID] = {};
                    // END
                    // $(thisTileBooster).find('[id^="BoosterBanksRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // $(thisTileBooster).find('[id^="BoosterPrices"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    if(!hasUserClickedEQC["td"+repriceObjectBooster.CurrentTileID]) {
                        $(thisTileBooster).find('[id^="hdnSelectedBank"]').val("");
                    }
                    // Added by Atharva - EQC Timers - START
                    $(thisTileBooster).find('[id^="BoosterTimerRow"]').empty();
                    var itr = 0;
                    // END
                    // $(thisTileBooster).find('[id^="minMaxNotionalLimitRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023

                    //Check for best price count || LGTGTWINT-1981 || RizwanS || 12 May 2023
                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023
                    if (NotesBestPriceDisplayCount != "") { 

                        // LGTGTWINT-2018 - Prices to be displayed for EAM entity on MSP and IP only when the input notional falls within min max range of CPs || RizwanS || 24 May 2023
                        if(NotionalMinMaxCheck.toUpperCase() === 'YES' && parseFloat($(thisTileBooster).find('[id^="ContractAmtBooster"]').val().replace(/,/g, "")) > 0){ //RizwanS || LGTGTWINT-2153 || 27 Jun 2023
                            
                            let sliceCount = Number(NotesBestPriceDisplayCount); // Count to show best prices as per config set

                            let productname = $(thisTileBooster).find(".productName").attr("id");

                            let _minmaxObj = [];

                            for(i=0;i<finalObjBooster.length;i++){
        

                                if(parseFloat($(thisTileBooster).find('[id^="ContractAmtBooster"]').val().replace(/,/g, "")) <= parseFloat(finalObjBooster[i].MaxNotional)
                                && parseFloat($(thisTileBooster).find('[id^="ContractAmtBooster"]').val().replace(/,/g, "")) >= parseFloat(finalObjBooster[i].MinNotional)){
                                    
                                    _minmaxObj.push(finalObjBooster[i]);
        
                                }
        
                            }

                            if(_minmaxObj.length <= 0){

                                $(thisTileBooster).find('[id^="btnEmailQuote"]').attr("disabled", true);
                                $(thisTileBooster).find('[id^="BookTradeBooster"]').attr("disabled", true);
                                $(thisTileBooster).find('[id^="OrderEmail"]').attr("disabled",true);
                                return false;
                            } 

                            finalObjBooster = sliceEQCbestprices(_minmaxObj,productname,sliceCount);
                          
                        }//END
                    }
                    
                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023
                    $(thisTileBooster).find('[id^="BoosterBanksRow"]').empty();
                    $(thisTileBooster).find('[id^="BoosterPrices"]').empty();
                    $(thisTileBooster).find('[id^="minMaxNotionalLimitRow"]').empty();
                    //END
 
                    bindRFQIDEQC(thisTileBooster,finalObjBooster); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023

                    $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val(JSON.stringify(finalObjBooster));

                    // END


                    $(finalObjBooster).each(function(i, elem) {
                        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
                        var priceClass = "GlowPrice_Red";
                        if (!glowFlag) {
                            priceClass = "noGlow";
                        }

                        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                        // $(thisTileBooster).find('[id^="EQCRfqidpnl"]').show();
                        // $(thisTileBooster).find('[id^="RFQIDEQC"]').html(elem.ParentID);
                        //End

                        var str = "";
                        var str2 = "";
                        if (elem.PP_CODE != null) {
                            // Added by Atharva - EQC Timers - START
                            mapIndexToBank["td"+repriceObjectBooster.CurrentTileID][itr] = elem.PP_CODE;
                            if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected" && $(thisTileBooster).find('[id^="hdnSelectedBank"]').val() == "") {
                                $(thisTileBooster).find('[id^="hdnSelectedBank"]').val(elem.PP_CODE);
                            }
                            if (elem.PP_CODE == "CITI") {
                                if(isNonBestPrice) {
                                    if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected" && ($(thisTileBooster).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectBooster.CurrentTileID + "_" + itr + "'>" + "Citi" + "</button></td>";
                                    }
                                    else if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectBooster.CurrentTileID + "_" + itr + "'>" + "Citi" + "</td>";
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
                                    if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected" && ($(thisTileBooster).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectBooster.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</button></td>";
                                    }
                                    else if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectBooster.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</td>";
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
                            $(thisTileBooster).find('[id^="BoosterBanksRow"]').append(str);
                        } else {
                            str = str + "<td>--</td>"
                            $(thisTileBooster).find('[id^="BoosterBanksRow"]').append(str);
                        }
                        if (elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected") {
                            // Added by Atharva - EQC Timers
                            // Added new if condition
                            if(isNonBestPrice) {
                                if($(thisTileBooster).find('[id^="hdnSelectedBank"]').val() == elem.PP_CODE) {
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
                                    str2 = str2 + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectBooster.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DRAOUT).toFixed(2) + " %</button></td>"
                                    $(thisTileBooster).find('[id^="BoosterPrices"]').append(str2);
                                } else {
                                    str2 = str2 + "<td";
                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                    if(parseFloat(elem.DRAOUT).toFixed(2) < 0){
                                        if(itr == 0) {
                                            str2 = str2 + " class='negativeprice_nonbest'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton negativeprice_nonbest' onclick='setPriceEQC(this)' id='td" + repriceObjectBooster.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DRAOUT).toFixed(2) + " %</button></td>"
                                        $(thisTileBooster).find('[id^="BoosterPrices"]').append(str2);

                                    }else{
                                        if(itr == 0) {
                                            str2 = str2 + " class='bestPriceStyle'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectBooster.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DRAOUT).toFixed(2) + " %</button></td>"
                                        $(thisTileBooster).find('[id^="BoosterPrices"]').append(str2);
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
                                $(thisTileBooster).find('[id^="BoosterPrices"]').append(str2);
                            }
                        } else {
                            str2 = str2 + "<td>-</td>"
                            $(thisTileBooster).find('[id^="BoosterPrices"]').append(str2);
                        }
                     
                        itr++;
                        let strMinMaxNotionalLimit = '';
                        if (elem.PP_CODE != null) {
                            strMinMaxNotionalLimit = strMinMaxNotionalLimit + `<td style='font-size:12px !important;'>${K_M_B_Formatter(Number(elem.MinNotional))} / ${K_M_B_Formatter(Number(elem.MaxNotional))}</td>`;
                            $(thisTileBooster).find('[id^="minMaxNotionalLimitRow"]').append(strMinMaxNotionalLimit);
                        }
                        // END
                    });
                    // Added by Atharva - EQC Timers - START
                    // Should run only once
                    // if(!isTimerStarted["td" + repriceObjectBooster.CurrentTileID]) {
                    //     isTimerStarted["td" + repriceObjectBooster.CurrentTileID] = true;
                    //     startTimersEQC(repriceObjectBooster.CurrentTileID);
                    // }
                    // END
                }
                
            }
            ).catch((error)=>{
                console.log(error);
                $(thisTileBooster).find('[id^="btnBestPriceBooster"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
                clearInterval(uniqueIntervalID.value);
                mapleLoaderStop(thisTileBooster,'[id^="btnBestPriceBooster"]', false);
                uniqueIntervalID.value = "";

                $(thisTileBooster).find('[id^="OverlayDiv"]').hide();
                if (finalObjBooster != null || finalObjBooster != undefined) {
                    drawgraphBooster($(thisTileBooster).find('[id^="canvas"]').attr("id"));
                }
            }
            );
        }
    } catch (error) {

        $(thisTileBooster).find('[id^="btnBestPriceBooster"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issueclearInterval(uniqueIntervalID.value);
        sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        clearInterval(uniqueIntervalID.value);
        mapleLoaderStop(thisTileBooster,'[id^="btnBestPriceBooster"]', false);

        uniqueIntervalID.value = "";
        $(thisTileBooster).find('[id^="OverlayDiv"]').hide();
        $(thisTileBooster).find('[id^="BookTradeBooster"]').attr("disabled", false);

        console.log("getFinalQuoteResponseBooster : " + error);

        // $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val(JSON.stringify(finalObjBooster));
        // if (finalObjBooster != null || finalObjBooster != undefined) {
        //     drawgraphBooster($(thisTileBooster).find('[id^="canvas"]').attr("id"));
        // }
        // sessionStorage.setItem("quoteToken_" + thisTileBooster.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileBooster.id.match(/\d+$/)[0]));
        // sessionStorage.setItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]));
        // INT1FIN47-768 Gateway Markets Instant Pricing issue
  

    } finally {
        //$(thisTileBooster).find('[id^="BookTradeBooster"]').attr("disabled", false);
    }
}

// To book trade
function BooktradeBooster(that,suitabilityCheck,redirectOrder) { // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
    try {
        // startLoader();
        TileId = that.id.match(/\d+$/)[0];
        thisTileBooster = document.getElementById("td" + TileId);
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
            $(thisTileBooster).find('[id^="BoosterBanksRow"]').children().each(function() {
                if($(thisTileBooster).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
            mapleOrderLoaderStop(thisTileBooster);
            return false;
        }
        // END
       
        let AllocationDetails=[];

        $(thisTileBooster).find("select.ChildrenddlBookingCenter").each(function(index, element){

            if ($(this).parent().prev().find(".childrenCheckBoxBooking")[0].checked) {

            AllocationDetails.push({

            "RMName": $(element).parent().parent().find('[id^="ddlRMName"]').val(),
            "CustBranch": element.value,
            "Notional":$(element).parent().parent().find('[id^="txtHeaderNotional"]').val().split('.')[0].replace(/\,/g, "")

            })
          }
        })


       // let calculatedMargin= (100 - JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[selectedBankIndex].DRAOUT);
       // let calClientPrice= (parseFloat(JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[selectedBankIndex].DRAOUT) + parseFloat(100 - JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[selectedBankIndex].DRAOUT)).toFixed(2);
        
        let limitPrice1 = "";
        let limitPrice2 = "";
        let limitPrice3 = "";
        let limitPrice4 = "";

        if($(thisTileBooster).find('[id^="ddlOrderTypeBooster"]').val().trim().toUpperCase() == "LIMIT"){

            if($(thisTileBooster).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 0){

                limitPrice1 = $(thisTileBooster).find('[id^="txtLimitLevel"]').val().trim();

            }else if($(thisTileBooster).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 1){

                 limitPrice2 = $(thisTileBooster).find('[id^="txtLimitLevel"]').val().trim();

            } else if($(thisTileBooster).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 2){

                 limitPrice3 = $(thisTileBooster).find('[id^="txtLimitLevel"]').val().trim();
                 
            } else if($(thisTileBooster).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 3){

                limitPrice4 = $(thisTileBooster).find('[id^="txtLimitLevel"]').val().trim();
                
            }            
        }

        //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

        let _confirmReason = "";

        if(selectedBankIndex>0){

            if($(thisTileBooster).find('[id^="ddlNONBEST"]').val() != "NONBEST_CUSTOM"){

                _confirmReason = $(thisTileBooster).find('[id^="ddlNONBEST"]').text();
    
            }else{
    
                _confirmReason =  $(thisTileBooster).find('[id^="txtNONBEST"]').val(); 
                
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
                if ($(thisTileBooster).find('[id^="rbRowSuitabilityToggle"]')[0].checked) {
                    _chkSuitability = "NO";
                    if ($(thisTileBooster).find('[id^="ddlReason"]').val().trim().includes("SUTSKP_CUSTOM")) { // Added by RizwanS | JIRA-LGTGTWINT-1830
                        _reasonmsg = $(thisTileBooster).find('[id^="txtSpecifyReason"]').val();
                    }else{
                        _reasonmsg = $(thisTileBooster).find('[id^="ddlReason"]').val();
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
               orderQty: $(thisTileBooster).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
               type:$(thisTileBooster).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
               limitPrice1: limitPrice1,
               limitPrice2: limitPrice2,
               limitPrice3: limitPrice3,
               limitPrice4: limitPrice4,
               QuoteRequestId: JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[selectedBankIndex].EP_ER_QuoteRequestId,
               loginUser: sessionStorage.getItem("EQC_UserName").toString(),
               margin: "0.00",
               clientPrice:"0.00",
               yield: "",
               bookingBranch: $(thisTileBooster).find('[id^="ddlBookingBranch"]').val(),
               rmNameForOrderConfirmation: $(thisTileBooster).find('[id^="ddlRMName"]').val(),
               dealerNotificationEmailID: $(thisTileBooster).find('[id^="txtComment"]').val(),
               orderComment: $(thisTileBooster).find('[id^="txtComment"]').val(),
               confirmationReason: _confirmReason,
               advisoryReason: $(thisTileBooster).find('[id^="txtComment"]').val(),
               preTradeXml: preTradeXml,
               //chkSuitability:$(thisTileBooster).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
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
                "orderQuantity": $(thisTileBooster).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "OrderType":$(thisTileBooster).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
                "LimitPrice1": limitPrice1,
                "LimitPrice2": limitPrice2,
                "LimitPrice3": limitPrice3,
                "LimitPrice4": limitPrice4,
                "QuoteRequestId":JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[selectedBankIndex].EP_ER_QuoteRequestId,
                "PoolID": "",
                "RedirectOrderID": "",
                "OrderComment": $(thisTileBooster).find('[id^="txtComment"]').val(),
                "Margin":"0.00",
                "Notional": $(thisTileBooster).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "ClientPrice": "0.00",
                "ClientYield": "",
                "BookingBranch": $(thisTileBooster).find('[id^="ddlBookingBranch"]').val(),
                "RMNameforOrderConfirm":  $(thisTileBooster).find('[id^="ddlRMName"]').val(),
                "RMEmailIdforOrderConfirm": "",
                "ConfirmReason": _confirmReason, //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message
                "PreTradeXml": "",
                "AdvisoryReason": "",
                // "UserRole": _reasonmsg, // Added Chaitanya M | For checking the suitability reason | Ref:LGTGTWINT-603 | 12-Jan-2023
                "CustomerID": "",
                // "chkSuitability":$(thisTileBooster).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
                "chkSuitability":_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                "SuitabilityReason": _reasonmsg, // Added by RizwanS | JIRA-LGTGTWINT-1830
                "IntendedSpread": "",
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": TileId,
                "AllocationDetails": AllocationDetails,
                "UserRole" : isEQCDealer === true ? 'Dealer' : isIA=== true ? 'IA' : 'RM' , // Added by RizwanS | JIRA-LGTGTWINT-1830
            
            }

        }

        mapleOrderLoaderStart(thisTileBooster);

            request_getDataFromAPI(bookObject, clientConfigdata.CommonMethods.NodeServer + orderMethodName).then(bookObject => {
            
            // endLoader();

            thisTileBooster = document.getElementById("td" + bookObject.CurrentTileID);

            TileId = bookObject.CurrentTileID;

            console.log('Booster after book object ', bookObject);

            let bookstring = bookObject['responseData']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
            
            let OrderStatus = bookObject['message']; // LGTGTWINT-1888 || RizwanS || 30 May 2023

            if (OrderStatus.toUpperCase() === clientConfigdata.EQCCommonMethods.EQC_BOOK_TRADE_RESPONSE_DETAILS.toUpperCase()) {

                // $(thisTileBooster).find('[id^="hdnBlotterURLBooster"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                // $(thisTileBooster).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradeEQBooster" + TileId, bookstring, "DivOverlayEQBooster");
                $(thisTileBooster).find('[id^="hdnfinalTokenBooster"]').val("");
                $(thisTileBooster).find('[id^="OverlayDiv"]').hide();
                clearPricerTable(thisTileBooster);
                 

            } else{

                if(OrderStatus == "" || OrderStatus == null || OrderStatus==undefined){

                    OrderStatus = "Order Execution Failed!";
                
                }else if(OrderStatus.includes("Please select booking centers from same region")){ // LGTGTWINT-1888 || RizwanS || 30 May 2023

                    OrderStatus = "Please select booking centers from same region.";
                }

                booktradePopup(that, "booktradeEQBooster" + TileId, OrderStatus, "DivOverlayEQBooster");
                $(thisTileBooster).find('[id^="hdnfinalTokenBooster"]').val("");
                $(thisTileBooster).find('[id^="OverlayDiv"]').hide();
                clearPricerTable(thisTileBooster);

            }
            mapleOrderLoaderStop(thisTileBooster);
            sessionStorage.removeItem("quoteResponse_" + thisTileBooster.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileBooster).find('[id^="btnBestPriceBooster"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileBooster).find('[id^="hdnintervalID"]').val());
            mapleLoaderStop(thisTileBooster,'[id^="btnBestPriceBooster"]', false);
            // Added by Atharva - EQC Timers - START
            $(thisTileBooster).find('[id^="BoosterPrices"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            $(thisTileBooster).find('[id^="BoosterBanksRow"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileBooster).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileBooster).find('[id^="BookTradeBooster"]').attr("disabled", true);
            $(thisTileBooster).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023   
            // END

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            
            //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            // $(thisTileBooster).find('[id^="EQCRfqidpnl"]').hide();
            $(thisTileBooster).find('[id^="RFQIDEQC"]').html("");
            //End
            
            //End

        }
        ).catch(error=>{
            console.log(error);
        }
        )
    } catch (er) {
        console.log(er);
        booktradePopup(that, "booktradeEQBooster" + TileId, "Order may have got executed or may have failed. Contact support!", "DivOverlayEQBooster");
        $(thisTileBooster).find('[id^="OverlayDiv"]').hide();
        // endLoader();
        mapleOrderLoaderStop(thisTileBooster);

    } finally {}
}

var dialogBoxBooster = null;
function emailQuoteBooster(that) {
    try {

        thisTileBooster= $(that).parents(".sorting")[0];
    
        let pricingRow = "";
        pricingRow = $(thisTileBooster).find("table.pricerTable .pricesRow")[0];
        mapleOrderLoaderStart(thisTileBooster);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
    
        if (pricingRow.cells[0].innerText.trim().toString() === "-") {
            openValidationpopup('',"No price available for mailing!"); // Changed for Change quote mail validation from "Invalid Price" to "No price available for mailing!" | Ref: LGTGTWINT-1195 | Chaitanya M | 25-jan-2023
          return false;
        }

        //create email pop up here 
        let strEmail =``;
        let emailPriceStream =JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val());
        console.log('email price stream object ', emailPriceStream);

        // Added for Email Quotes popup label for strike, coupon and IB Pricer | Ref: LGTGTWINT-1134 | Chaitanya M | 25-jan-2023
        let Boostersolveforvalue= document.getElementById("ddlSolveFor" + TileId);

        if(globalSolveForValueBooster =="Conversion_Strike"){
                Boostersolveforvalue = " Strike (%)";
        }else if(globalSolveForValueBooster =="Coupon"){
                Boostersolveforvalue = "  Coupon (%)";
        }else if(globalSolveForValueBooster =="Price"){
                Boostersolveforvalue = " IB Price (%)";
        }

       //End

        strEmail=strEmail+`<table class='emailTable'><tr><td class='payOff_Features'>
        <input type='checkbox' class='chkBoxParent_Email_PPCode' onchange='emailParentCheckboxChanged(this)' >
        Issuer</td><td class='payOff_Features'>${Boostersolveforvalue}</td></tr>`;  // Changed for Email Quotes popup label for strike, coupon and IB Pricer | Ref: LGTGTWINT-1134 | Chaitanya M | 25-jan-2023

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
        if(dialogBoxBooster===null)
        {
            dialogBoxBooster= $(thisTileBooster).find('[id^="emailDialog_Booster"]')[0];
            $(thisTileBooster).find('[id^="emailDialog_Booster"]').empty().append(strEmail);
            $(dialogBoxBooster).dialog({
                resizable: false,
                height: "auto",
                width: 320,
                modal: true,
                open: function (event, ui) { // Added for LGTGTWINT-1283 || Email popup on top change | Chaitanya M | 08 Feb 2023
                    $('.ui-widget.ui-widget-content').css('z-index',999);                    
                }, 
                //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                close: function (event, ui){
                    mapleOrderLoaderStop(thisTileBooster);
                },
                //End

                buttons: {
                    "Mail Quote": function() {
                    //mail single selected rfq 

                    //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023

                
                    var Email_PPList =[];
                    var RFQIDList=[];
                    var __mailRFQ=[];

                    if($(document).find('.ui-dialog').find('[id^="emailDialog_Booster"]').find('.chkBox_Email_PPCode').length>0)
                    {
                        $(document).find('.ui-dialog').find('[id^="emailDialog_Booster"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                            if(checkboxControl.checked){
                                Email_PPList.push($(checkboxControl).parent().text().trim())

                                RFQIDList.push(JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val()).filter(function(RFQ_OBJECT){
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

                    if ($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val() != undefined && $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val().trim()!='')
                    var RFQID = JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;
        
                    if (RFQID != undefined && RFQID != ''){
                        // MailBestQuote(thisTileBooster.id.match(/\d+$/)[0], JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[0].EP_ER_QuoteRequestId);
                        if(__mailRFQ == ""){

                            // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            //booktradePopup(thisTileBooster, "booktradeEQBooster" + thisTileBooster.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayEQBooster");
                            openValidationpopup('','No price selected for mailing !');
                            //End
                            return false;
                        }

                        $( this ).dialog( "close" );     // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                        mapleOrderLoaderStart(thisTileBooster);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                        request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                            "rfqId":__mailRFQ.toString(),
                            "CurrentTileID":thisTileBooster.id.match(/\d+$/)[0],
                            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                            QuoteMailType:"English"
                        }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                            console.log(data);
                            TileId = data.CurrentTileID;
                            thisTileBooster = document.getElementById("td" +TileId);
                            mapleOrderLoaderStop(thisTileBooster); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            booktradePopup(thisTileBooster, "booktradeEQBooster" + TileId, data.message, "DivOverlayEQBooster");
                          
                        }).catch(error=>{
                          console.log(error);
                       
                        })
                    }
                    else {
                        mapleOrderLoaderStop(thisTileBooster); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                        openValidationpopup('','Invalid RFQ ID '); 
                    }            
                    },

                    "Mail All Quotes": function() {
                        //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                
                        var Email_PPList =[];
                        var RFQIDList=[];
                        var __mailRFQ=[];

                        if($(document).find('.ui-dialog').find('[id^="emailDialog_Booster"]').find('.chkBox_Email_PPCode').length>0)
                        {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_Booster"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                                //if(checkboxControl.checked){
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val()).filter(function(RFQ_OBJECT){
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

                        if ($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val() != undefined && $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val().trim()!='')
                        var RFQID = JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;
            
                        if (RFQID != undefined && RFQID != ''){
                            //     MailBestQuote(thisTileBooster.id.match(/\d+$/)[0], JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[0].EP_ER_QuoteRequestId);
                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileBooster, "booktradeEQBooster" + thisTileBooster.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayEQBooster");
                                mapleOrderLoaderStop(thisTileBooster); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            }
                            $( this ).dialog( "close" );  // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileBooster);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                                "rfqId":__mailRFQ.toString(),
                                "CurrentTileID":thisTileBooster.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType:"English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileBooster = document.getElementById("td" +TileId)
                                mapleOrderLoaderStop(thisTileBooster); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                booktradePopup(thisTileBooster, "booktradeEQBooster" + TileId, data.message, "DivOverlayEQBooster");
                            
                            }).catch(error=>{
                            console.log(error);
                        
                            })
                        }
                        else{
                            mapleOrderLoaderStop(thisTileBooster); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('','Invalid RFQ ID ');
                        }

                        return true;
                        //email all quotes here 
                    }
                }
            });
            $(dialogBoxBooster).dialog('open');

        }else
        {
            $(document).find('.ui-dialog').find('[id^="emailDialog_Booster"]').empty().append(strEmail);

            $(dialogBoxBooster).dialog('open');
                            
            var Email_PPList =[];
            var RFQIDList=[];
            var __mailRFQ=[];

            if($(document).find('.ui-dialog').find('[id^="emailDialog_Booster"]').find('.chkBox_Email_PPCode').length>0)
            {
                $(document).find('.ui-dialog').find('[id^="emailDialog_Booster"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                    if(checkboxControl.checked){
                        Email_PPList.push($(checkboxControl).parent().text().trim())

                        RFQIDList.push(JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val()).filter(function(RFQ_OBJECT){
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

            if ($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val() != undefined && $(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val().trim()!='')
            var RFQID = JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

            if (RFQID != undefined && RFQID != ''){
                //     MailBestQuote(thisTileBooster.id.match(/\d+$/)[0], JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[0].EP_ER_QuoteRequestId);
                if(__mailRFQ == ""){
                    // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    //booktradePopup(thisTileBooster, "booktradeEQBooster" + thisTileBooster.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayEQBooster");
                    mapleOrderLoaderStop(thisTileBooster); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    openValidationpopup('','No price selected for mailing !');
                    //End
                    return false;
                }      
                request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                        "rfqId":__mailRFQ.toString(),
                        "CurrentTileID":thisTileBooster.id.match(/\d+$/)[0],
                        "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                        QuoteMailType:"English"
                }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                    console.log(data);
                    TileId = data.CurrentTileID;
                    thisTileBooster = document.getElementById("td" +TileId);
                    mapleOrderLoaderStop(thisTileBooster); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    booktradePopup(thisTileBooster, "booktradeEQBooster" + TileId, data.message, "DivOverlayEQBooster");
                
                }).catch(error=>{
                console.log(error);
            
                })
            }
            else{
                mapleOrderLoaderStop(thisTileBooster); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                openValidationpopup('','Invalid RFQ ID ');
            }

        }
        $(thisTileBooster).find('[id^="BoosterBanksRow"]').children().each(function() {
           if($(thisTileBooster).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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

function validateOrderBooster(thisTileBooster,_flag){    // LGTGTWINT-1279 : Instant Pricing : Order booking valdations.

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
            $(thisTileBooster).find('[id^="BoosterBanksRow"]').children().each(function() {
                if($(thisTileBooster).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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


        if ($(thisTileBooster).find('[id^="ddlSolveFor"]').val() == "Conversion_Strike")  {
           
            if($(thisTileBooster).find('[id^="koinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[selectedBankIndex].DRAOUT) > parseFloat($(thisTileBooster).find('[id^="koinputbox"]').val())){
                ValidateField($(thisTileBooster).find('[id^="koinputbox"]').attr("id"), "KO % of Initial should be greater than strike(%)",thisTileBooster);
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                return false;
            } 
    
            else if($(thisTileBooster).find('[id^="kiinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[selectedBankIndex].DRAOUT)< parseFloat($(thisTileBooster).find('[id^="kiinputbox"]').val())){
                ValidateField($(thisTileBooster).find('[id^="kiinputbox"]').attr("id"), "KI % of Initial should be less than strike(%)",thisTileBooster);
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                return false;
            }
        }

        if ($(thisTileBooster).find('[id^="hdnfinalTokenBooster"]').val() == "" || $(thisTileBooster).find('[id^="BoosterPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileBooster).find('[id^="BoosterPrices"]')[0].firstChild.innerHTML == "") {
            if(_flag == false){
                _validateOrderEQC = true; 
            }
            ValidateField($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').attr("id"), "Order Execution Failed!", thisTileBooster);
            return false;
        }
        
        if(parseFloat(JSON.parse($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').val())[selectedBankIndex].DRAOUT) <= 0){
            if(_flag == false){

                _validateOrderEQC = true; 
            }
            ValidateField($(thisTileBooster).find('[id^="hdnChartPricesBooster"]').attr("id"), "Prices can not be negative 0r zero, Order Execution Failed!", thisTileBooster);
            return false;
        }

    }catch(er){
        console.log(message);
    }
}

//  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
function ChangeSolveForBooster(solveFor,thisTileBooster,calledFromIndexBooster) {
    try {
        if (calledFromIndexBooster != undefined){
            if (solveFor.trim().includes("Conversion_Strike")) {
                $(thisTileBooster).find('[id^="strikeipbox"]').prop('disabled', true);
                $(thisTileBooster).find('[id^="IBPriceipbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="couponipbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="txtupfrontBooster"]').prop('disabled', false);  
                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);
            } else if (solveFor.trim().includes("Price")) {
                $(thisTileBooster).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="IBPriceipbox"]').prop('disabled', true);
                $(thisTileBooster).find('[id^="couponipbox"]').prop('disabled', false);
		        $(thisTileBooster).find('[id^="txtupfrontBooster"]').prop('disabled', true); 
                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);       
            } else if (solveFor.trim().includes("Coupon") ) {
                $(thisTileBooster).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileBooster).find('[id^="IBPriceipbox"]').prop('disabled', false);  
                $(thisTileBooster).find('[id^="couponipbox"]').prop("disabled", true);
                $(thisTileBooster).find('[id^="txtupfrontBooster"]').prop('disabled', false);  
                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);
            }
        }
        else {
            if (solveFor.trim().includes("Conversion_Strike")) {
                $(thisTileBooster).find('[id^="strikeipbox"]').prop("disabled", true);
                $(thisTileBooster).find('[id^="IBPriceipbox"]').prop("disabled", false); 
                $(thisTileBooster).find('[id^="couponipbox"]').prop("disabled", false);
                $(thisTileBooster).find('[id^="txtupfrontBooster"]').prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);

            } else if (solveFor.trim().includes("Price")) {
                $(thisTileBooster).find('[id^="strikeipbox"]').prop("disabled", false);
                $(thisTileBooster).find('[id^="IBPriceipbox"]').prop("disabled", true);
                $(thisTileBooster).find('[id^="couponipbox"]').prop("disabled", false);
                $(thisTileBooster).find('[id^="txtupfrontBooster"]').prop('disabled', true); //LGTGTWINT-1095

                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);
            } else if (solveFor.trim().includes("Coupon")) {
                $(thisTileBooster).find('[id^="strikeipbox"]').prop("disabled", false);
                $(thisTileBooster).find('[id^="IBPriceipbox"]').prop("disabled", false); //LGTGTWINT-1095
                $(thisTileBooster).find('[id^="couponipbox"]').prop("disabled", true);
                $(thisTileBooster).find('[id^="txtupfrontBooster"]').prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeBooster($(thisTileBooster).find('[id^="ddlBoosterType"]').val().trim(), thisTileBooster);
            }
        }
             
    } catch (error) {
        console.log(error.message)
    }
}