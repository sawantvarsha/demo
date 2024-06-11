$.support.cors = true;
var tokenELN;
var QuoteObjectForELN;
var basketListELN = [];
var ContractAmtELN;
var tempShareNameELN;
var arrELN = [];
var maxELN;
var finalObj;
var idELN = 5;
var repriceObject;
var Timer = 0;
var intervalID_ELN = 0;
var finalResponseDataELN;
var finalTokenELN;
var flagIB = false;
//by gargi



// To load ELN tile
function onLoadELN(currId, isProductCopiedELN) {
    try {

        setDeafaultValuesELN(currId);
        thisTileELN = document.getElementById("td" + currId);
        $(thisTileELN).find('[id^="OverlayDiv"]').hide();

        sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        $(thisTileELN).find('[id^="btnBestPriceELN"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileELN,'[id^="btnBestPriceELN"]', false);
        clearPricerTable(thisTileELN);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileELN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
        $(thisTileELN).find('[id^="RFQIDEQC"]').html("");
        //End
        
        //aded by rutika on 26/04/2022 for calculating tenor when changed in input box
        //Start

        $(thisTileELN).find('[id^="tenor_ELN"]').on("change", function () {
            try {

                thisTileELN = $(this).parents(".sorting")[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");         
                $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("");
                //End

                if( $(thisTileELN).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_ELN"]').val()) > Number(ELNAllowedTenorinMonths) || $(this).parents(".sorting").find('[id^="tenor_ELN"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_ELN"]').val() == ""){
                        ValidateField($(thisTileELN).find('[id^="tenor_ELN"]').attr("id"), "Please enter valid tenor.", thisTileELN);
                        return false;
                    }

                } else{

                     if(Number($(this).parents(".sorting").find('[id^="tenor_ELN"]').val()) > Number(ELNAllowedTenorinYears) || $(this).parents(".sorting").find('[id^="tenor_ELN"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_ELN"]').val() == ""){
                        ValidateField($(thisTileELN).find('[id^="tenor_ELN"]').attr("id"), "Please enter valid tenor.", thisTileELN);
                        return false;
                    }
                }
               
                loadELNTenorValues(thisTileELN);

            } catch (error) {
                console.log(error);
            }
        });

        $(thisTileELN).find('[id^="tenorddl"]').on("change", function () {
            try {

                thisTileELN = $(this).parents(".sorting")[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
                $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("");
                //End
            

                if( $(thisTileELN).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_ELN"]').val()) > Number(ELNAllowedTenorinMonths)){
                        ValidateField($(thisTileELN).find('[id^="tenor_ELN"]').attr("id"), "Please enter valid tenor.", thisTileELN);
                        return false;
                    }

                } else{
                    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_ELN"]').val()) > Number(ELNAllowedTenorinYears)){
                        ValidateField($(thisTileELN).find('[id^="tenor_ELN"]').attr("id"), "Please enter valid tenor.", thisTileELN);
                        return false;
                    }
                }

                loadELNTenorValues(thisTileELN);
            } catch (error) {
                console.log(error);
            }
        });

        //End

        $(thisTileELN).find("div.card input[type='text'],div.card input[type='search'],div.card select").on("change", function () {
            thisTileELN = $(this).parents(".sorting")[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileELN).find('[id^="btnBestPriceELN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileELN).find('[id^="hdnintervalID"]').val());
            $(thisTileELN).find('[id^="hdnChartPricesELN"]').val(""); // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            clearPricerTable(thisTileELN);

               //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileELN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileELN).find('[id^="RFQIDEQC"]').html("");
            //End

            mapleLoaderStop(thisTileELN,'[id^="btnBestPriceELN"]', false);
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileELN).find('[id^="BookTradeELN"]').attr("disabled", true);
            $(thisTileELN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileELN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
        });

        $(thisTileELN).find(" div.card .amtPopup").on('select', function () { // INT1FIN47-768 Gateway Markets Instant Pricing issue
            
            thisTileELN = $(this).parents(".sorting")[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileELN).find('[id^="btnBestPriceELN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileELN).find('[id^="hdnintervalID"]').val());
           $(thisTileELN).find('[id^="hdnChartPricesELN"]').val(""); // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            clearPricerTable(thisTileELN);

               //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileELN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileELN).find('[id^="RFQIDEQC"]').html("");
            //End

            mapleLoaderStop(thisTileELN,'[id^="btnBestPriceELN"]', false);
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileELN).find('[id^="BookTradeELN"]').attr("disabled", true);
            $(thisTileELN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileELN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
            
        });

        $(thisTileELN).find('[id^="NoteCCY_ELN"]').on("change", function () {// Changed for New UI || LGTGTWINT-980 || Chaitanya M || 07 Feb 2023
            try {
                thisTileELN = $(this).parents(".sorting")[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
                $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("");
                //End
                if ($(thisTileELN).find('[id^="solveForELN"]').val().trim().toUpperCase().includes("STRIKE")) {
                    getIBPriceELN(thisTileELN);
                } else if ($(thisTileELN).find('[id^="solveForELN"]').val().trim().toUpperCase().includes("PRICE")) {
                    $(thisTileELN).find("[id^='priceELN']").val("").prop("disabled", true); //INT1FIN47-768 Gateway Markets Instant Pricing issu
                } 
            } catch (error) {
                console.log(error);
            }
        });

        $(thisTileELN).find('[id^="upfrontELN"]').on("change", function () {
            try {
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
                $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("");
                //end
                if ($(thisTileELN).find('[id^="solveForELN"]').val().trim().toUpperCase().includes("STRIKE")) {
                    getIBPriceELN(thisTileELN);
                } else if ($(thisTileELN).find('[id^="solveForELN"]').val().trim().toUpperCase().includes("PRICE")) {
                    $(thisTileELN).find("[id^='priceELN']").val("").prop("disabled", true); //INT1FIN47-768 Gateway Markets Instant Pricing issu
                }
            } catch (error) {
                console.log(error);
            }
        });

        $(thisTileELN).find('[id^="clientYELN"]').on("change", function () {
            try {
                thisTileELN = $(this).parents(".sorting")[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
                $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("");
                //End
                getIBPriceELN(thisTileELN, this.value);
                if ($(thisTileELN).find('[id^="solveForELN"]').val().trim().toUpperCase().includes("STRIKE")) {
                    if (this.value <= 0 ) {  // Changed for LGTGTWINT-1215  ELN: Validation for negative IB Price | Chaitanya M | 27-Jan-2023
                        ValidateField($(thisTileELN).find('[id^="clientYELN"]').attr("id"), "Client yield cannot be zero or less than zero. Please enter correct value.", thisTileELN); //INT1FIN47-768 Gateway Markets Instant Pricing issu
                        return false;
                    }
                } else {
                    $(thisTileELN).find("[id^='priceELN']").val("").prop("disabled", true); //INT1FIN47-768 Gateway Markets Instant Pricing issu
                }
                return false;
            } catch (error) {
                console.log(error);
            }
        });

        $(thisTileELN).find('[id^="ELNSharesDemo"]').on("select change", function () {
            try {
                thisTileELN = $(this).parents(".sorting")[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
                $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("")
              //End

                if ($(thisTileELN).find('[id^="solveForELN"]').val().trim().toUpperCase().includes("STRIKE")) {
                    getIBPriceELN(thisTileELN);
                } else if ($(thisTileELN).find('[id^="solveForELN"]').val().trim().toUpperCase().includes("PRICE")) {
                    $(thisTileELN).find("[id^='priceELN']").val("").prop("disabled", true); //INT1FIN47-768 Gateway Markets Instant Pricing issu
                }
            } catch (error) {
                console.log(error);
            }
        });

        $(thisTileELN).find('[id^="ddlELNCFreq"]').on("change", function () {
            try {
                thisTileELN = $(this).parents(".sorting")[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
                $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("");
                //end
                validation_clear();
                //To Remove highlighted part if no error || Tina K || 18-Sep-2019
                checkKOKITypeELN($(thisTileELN).find('[id^="ddlELNCFreq"]').val().trim(), thisTileELN);
            } catch (error) {
                console.log(error);
            }
        });

        $(thisTileELN).find('[id^="solveForELN"]').on("change", function () {
            try {

                thisTileELN = $(this).parents(".sorting")[0];
                  // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
                $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("");
                //end
                validation_clear();  //To Remove highlighted on change of Solve for || Chaitanya M || 27-Jan-2023
                if ($(thisTileELN).find('[id^="solveForELN"]').val().trim().toUpperCase().includes("STRIKE")) {

                    getIBPriceELN(thisTileELN); // INT1FIN47-768 Gateway Markets Instant Pricing iss

                } ////INT1FIN47-768 Gateway Markets Instant Pricing issu

                changeSolveForELN($(this).val(), thisTileELN); // Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.

            } catch (error) {
                console.log(error);
            }
        });

        // LGTGTWINT-1638 | Chaitanya M | 21 Jul 2023
        if(!_addtileflag){
            checkSolveForELN($(thisTileELN).find('[id^="solveForELN"]').val(), thisTileELN);
        }
        //End
        
      // Added for LGTGTWINT-1128 | Chaitanya M | 23-Jan-2023 
      //Start
      $(thisTileELN).find('.ddlShares').on("focusout", function (){         
             
            // Added for being Able to price with only share name entered and not selected| Ref:LGTGTWINT-1076, LGTGTWINT-1075 | Chaitanya M | 24-Jan-2023
            //Start
                    
            checkforshares = validateshares(thisTileELN,"ELNSharesDemo" ); 
            $(thisTileELN).find('[id^="ShareCCY_ELN"]').html($(thisTileELN).find('[id^="NoteCCY_ELN"]').val()); // Changed for New UI || LGTGTWINT-980 || Chaitanya M || 07 Feb 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileELN,"btnBestPriceELN");
           $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("")// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023r
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileELN).find('[id^="BookTradeELN"]').attr("disabled", true);
            $(thisTileELN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileELN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023

        if(checkforshares==false){
            //ValidateField($(thisTileELN).find('[id^="ELNSharesDemo"]').attr("id"), "Please Enter Valid Shares", thisTileELN);
            return false;                
        }        
        //End
        
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        $(thisTileELN).find("div.card .ddlShares").on("keydown", function(){
             
            $("#bodyDiv").hide();
            sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
           $(thisTileELN).find('[id^="hdnChartPricesELN"]').val(""); // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileELN).find('[id^="BookTradeELN"]').attr("disabled", true);
            $(thisTileELN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileELN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
        
        });
     
        //End

        //Added for LGTGTWINT-1077 Instant Pricing: Input length for all fields for all payoffs | Chaitanya M | 28-01-2023
          $(thisTileELN).find('[id^="tenor_ELN"]').on("keyup", function (){            

             InputLengthCheckEQC(thisTileELN, "tenor_ELN",3);
        });

        $(thisTileELN).find("[id^='strikeipboxELN']").on("keyup", function(){

             InputLengthCheckEQC(thisTileELN, "strikeipboxELN",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
               //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileELN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileELN).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileELN).find('[id^="upfrontELN"]').on("keyup", function(){

             InputLengthCheckEQC(thisTileELN, "upfrontELN",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
        
        });

        $(thisTileELN).find('[id^="clientYELN"]').on("keyup", function(){

             InputLengthCheckEQC(thisTileELN, "clientYELN",7);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
        
        });

        $(thisTileELN).find('[id^="koinputboxELN"]').on("keyup", function(){

            InputLengthCheckEQC(thisTileELN, "koinputboxELN",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileELN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileELN).find('[id^="RFQIDEQC"]').html("");
            //End
        
        });

        $(thisTileELN).find('[id^="SettlWeeks"]').on("change", function(){
        // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
           $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("");
           //END
            loadELNTenorValues(thisTileELN); // Dates are not calculated on changing Settlement Weeks | LGTGTWINT-1480  | Chaitanya M | 1 March 2023
            calculateDays($(thisTileELN).find('[id^="ELN_Maturity"]').html(),
                $(thisTileELN).find('[id^="ELN_SettlDate"]').html(),
                thisTileELN,
                "NoofDaysELN" );

        });

        $(thisTileELN).find('[id^="SettlDate_ELN"]').on("change", function(){
            try {
                thisTileELN = $(this).parents(".sorting")[0];
                sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
               $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileELN).find('[id^="BookTradeELN"]').attr("disabled", true);
                $(thisTileELN).find('[id^="btnEmailQuote"]').attr("disabled", true);
                $(thisTileELN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023

                let settl_Date = $(thisTileELN).find('[id^="SettlDate_ELN"]').val();                
                $(thisTileELN).find('[id^="ELN_SettlDate"]').html(reformatDate(settl_Date));   
                
                validatedatesELN(currId,"SettlDate_ELN");

                //added for LGTGTWINT-1560 | Chaitanya M | 28 Feb 2023
                // let settlDate = new Date($(thisTileELN).find('[id^="SettlDate_ELN"]').val());
                //  validate_dates(thisTileELN,"ELN_SettlDate",settlDate);    
                //  checkdates(thisTileELN,"settlementDate");
                // //end
                               
                calculateDays($(thisTileELN).find('[id^="ELN_Maturity"]').html(),
                    $(thisTileELN).find('[id^="ELN_SettlDate"]').html(),
                    thisTileELN,
                    "NoofDaysELN" );            

            } catch (error) {
                console.log(error.message);
            }

        });

        $(thisTileELN).find('[id^="Maturity_ELN"]').on("change", function(){
            try {
                thisTileELN = $(this).parents(".sorting")[0];
                sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
               $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileELN).find('[id^="BookTradeELN"]').attr("disabled", true);
                $(thisTileELN).find('[id^="btnEmailQuote"]').attr("disabled", true);
                $(thisTileELN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
                
                let maturty_Date = $(thisTileELN).find('[id^="Maturity_ELN"]').val();                
                $(thisTileELN).find('[id^="ELN_Maturity"]').html(reformatDate(maturty_Date)); 

                validatedatesELN(currId,"Maturity_ELN");

                //added for LGTGTWINT-1560 | Chaitanya M | 28 Feb 2023
                // let maturtyDate = new Date($(this).val());
                // validate_dates(thisTileELN,"ELN_Maturity",maturtyDate); 
                // checkdates(thisTileELN,"MaturityDate");
                //end

                calculateDays($(thisTileELN).find('[id^="ELN_Maturity"]').html(),
                    $(thisTileELN).find('[id^="ELN_SettlDate"]').html(),
                    thisTileELN,
                    "NoofDaysELN");                 

            } catch (error) {
                console.log(error.message);
            }

        });

        $(thisTileELN).find('[id^="ExpiryDate_ELN"]').on("change", function(){
            try {
                thisTileELN = $(this).parents(".sorting")[0];
                sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
               $(thisTileELN).find('[id^="hdnChartPricesELN"]').val(""); // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileELN).find('[id^="BookTradeELN"]').attr("disabled", true);
                $(thisTileELN).find('[id^="btnEmailQuote"]').attr("disabled", true);
                $(thisTileELN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023

                let expiry_Date = $(thisTileELN).find('[id^="ExpiryDate_ELN"]').val();
                $(thisTileELN).find('[id^="ELN_ExpiryDate"]').html(reformatDate(expiry_Date)); 
                 
                validatedatesELN(currId,"ExpiryDate_ELN");

                //added for LGTGTWINT-1560 | Chaitanya M | 28 Feb 2023
                // let expiryDate = new Date($(this).val());
                // validate_dates(thisTileELN,"ELN_ExpiryDate",expiryDate); 
                // checkdates(thisTileELN,"ExpiryDate");
                //end                       

                calculateDays($(thisTileELN).find('[id^="ELN_Maturity"]').html(),
                    $(thisTileELN).find('[id^="ELN_SettlDate"]').html(),
                    thisTileELN,
                    "NoofDaysELN");           

            } catch (error) {
                console.log(error.message);
            }

        });

        //Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
        $(thisTileELN).find('[id^="ContractAmtELN"]').on("change", function(){
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileELN,"btnBestPriceELN");
           $(thisTileELN).find('[id^="hdnChartPricesELN"]').val("");
           //End
            if($(thisTileELN).find('[id^="ContractAmtELN"]').val()== "" || $(thisTileELN).find('[id^="ContractAmtELN"]').val()==null || $(thisTileELN).find('[id^="ContractAmtELN"]').val()=="0" ){
              $(thisTileELN).find('[id^="ContractAmtELN"]').val("0.00"); 
            }    
            return false;         
        }); 

    //End

    } catch (error) {
        console.log(error);
    }
    
}

function checkSolveForELN(solveFor, thisTileELN, calledFromIndexELN) {
    try {
        if (calledFromIndexELN != undefined) {
            if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                $(thisTileELN).find("[id^='upfrontELN']").val("0.50").prop("disabled", false); //INT1FIN47-768 Gateway Markets Instant Pricing issu
                $(thisTileELN).find("[id^='strikeipboxELN']").prop("disabled", true);
                $(thisTileELN).find("[id^='priceELN']").prop("disabled", true); //INT1FIN47-768 Gateway Markets Instant Pricing issue
                $(thisTileELN).find("[id^='clientYELN']").show();
                $(thisTileELN).find("[id^='lblYield']").show();
                loadELNTenorValues(thisTileELN);
                checkKOKITypeELN($(thisTileELN).find('[id^="ddlELNCFreq"]').val(), thisTileELN, true);
            } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                $(thisTileELN).find("[id^='priceELN']").val("").prop("disabled", true); //INT1FIN47-768 Gateway Markets Instant Pricing issu
                $(thisTileELN).find("[id^='strikeipboxELN']").prop("disabled", false);
                $(thisTileELN).find("[id^='upfrontELN']").val("0.50").prop("disabled", false); //INT1FIN47-768 Gateway Markets Instant Pricing issu
                $(thisTileELN).find("[id^='clientYELN']").hide();
                $(thisTileELN).find("[id^='lblYield']").hide();
                checkKOKITypeELN($(thisTileELN).find('[id^="ddlELNCFreq"]').val(), thisTileELN, true);
            }
        } else {
            if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                $(thisTileELN).find("[id^='upfrontELN']").val("0.50").prop("disabled", false);
                $(thisTileELN).find("[id^='strikeipboxELN']").prop("disabled", true);
                $(thisTileELN).find("[id^='priceELN']").val("").prop("disabled", true); //INT1FIN47-768 Gateway Markets Instant Pricing issu
                $(thisTileELN).find("[id^='clientYELN']").show();
                $(thisTileELN).find("[id^='clientYELN']").val(""); //INT1FIN47-768 Gateway Markets Instant Pricing issu
                $(thisTileELN).find("[id^='lblYield']").show();
                loadELNTenorValues(thisTileELN);
                checkKOKITypeELN($(thisTileELN).find('[id^="ddlELNCFreq"]').val(), thisTileELN);
            } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                $(thisTileELN).find("[id^='priceELN']").val("").prop("disabled", true); //INT1FIN47-768 Gateway Markets Instant Pricing issu
                $(thisTileELN).find("[id^='strikeipboxELN']").val("85.00").prop("disabled", false);
                $(thisTileELN).find("[id^='upfrontELN']").val("0.50").prop("disabled", false); //INT1FIN47-768 Gateway Markets Instant Pricing issu
                $(thisTileELN).find("[id^='clientYELN']").hide();
                $(thisTileELN).find("[id^='lblYield']").hide();
                checkKOKITypeELN($(thisTileELN).find('[id^="ddlELNCFreq"]').val(), thisTileELN);
                flagIB = false;
            }
        }
    } catch (error) {
        console.log(error);
    }
}

function checkKOKITypeELN(ELNType, thisTileELN, isCalledFromSolveForCheckELN) {
    try {
        if (isCalledFromSolveForCheckELN != undefined) {
            if (ELNType == "Simple") {
                $(thisTileELN).find('[id^="koinputboxELN"]').prop("disabled", true);  //  Chaitanya M 4 April-2023 || Added for LGTGTWINT-1822 || Changing 'Solve for' shouldn't reset other parameters to the default value.
            } else {
                $(thisTileELN).find('[id^="koinputboxELN"]').prop("disabled", false);
            }
        } else {
            if (ELNType == "Simple") {
                $(thisTileELN).find('[id^="koinputboxELN"]').prop("disabled", true); //  Chaitanya M 4 April-2023 || Added for LGTGTWINT-1822 || Changing 'Solve for' shouldn't reset other parameters to the default value.
            } else {
                $(thisTileELN).find('[id^="koinputboxELN"]').prop("disabled", false);  //  Chaitanya M 4 April-2023 || Added for LGTGTWINT-1822 || Changing 'Solve for' shouldn't reset other parameters to the default value.
            }
        }
    } catch (error) {
        console.log(error);
    }
}
// To set default values for ELN tile after add tile
function setDeafaultValuesELN(currId) {
    try {

        thisTileELN = document.getElementById("td" + currId);

        //   Currency_Selection_Drop_Down(currId);
        EQProductsFillCcy(thisTileELN, "NoteCCY_ELN"); // Changed for New UI || LGTGTWINT-980 || Chaitanya M || 07 Feb 2023

        //    $(thisTileELN).find('[id^="noteCCY"]')[0].selectedIndex = 12;

        // LGTGTWINT-2279 || KO Daily Close to be removed from Instant Pricer || 07 Aug 2023
        let KOTypes = [];

        // Start | Added for Background Color mismatch with other dropdowns.| Chaitanya M | 05 Oct 2023
        let strType = "";
        let ddlELNCFreqControl = $(thisTileELN).find('[id^="ddlELNCFreq"]')[0];
        // End | Added for Background Color mismatch with other dropdowns.| Chaitanya M | 05 Oct 2023

        if(ELNSHOWDAILYCLOSEKO !== "YES"){
            KOTypes = ["Simple","KO Intraday"];
        }else{
            KOTypes = ["Simple","KO Intraday","KO Daily Close"];
        }

        // Start | Added for Background Color mismatch with other dropdowns.| Chaitanya M | 05 Oct 2023
        // fillDropdownlistControl(KOTypes,$(thisTileELN).find('[id^="ddlELNCFreq"]').attr("id")); 
     
        for (let r of KOTypes) {
            strType = strType + `<option style='color:var(--text)' value="${r}">${r}</option>`;
        }
        $(ddlELNCFreqControl).empty().append(strType);

        // End | Chaitanya M | 05 Oct 2023

        //END

        $(thisTileELN).find('[id^="ContractAmtELN"]').val("1,000,000.00");
        $(thisTileELN).find('[id^="ContractAmtELN"]').attr('maxlength','14');
        $(thisTileELN).find('[id^="strikeipboxELN"]').val("85.00");
        $(thisTileELN).find('[id^="tenor_ELN"]').val("6"); 
        $(thisTileELN).find('[id^="koinputboxELN"]').val("105.00");  //  Chaitanya M 4 April-2023 || Added for LGTGTWINT-1822 || Changing 'Solve for' shouldn't reset other parameters to the default value.    

        $(thisTileELN).find('[id^="ELNSharesDemo"]').val(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CODE2); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
        $(thisTileELN).find('[id^="ShareCCY_ELN"]').html($(thisTileELN).find('[id^="NoteCCY_ELN"]').val()); // Changed for New UI || LGTGTWINT-980 || Chaitanya M || 07 Feb 2023
        clearPricerTable(thisTileELN);
        //  $(thisTileELN).find("span.notionalCcy").html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);


        callautocomplete(thisTileELN, "ELNSharesDemo", sessionStorage.getItem(thisTileELN.id) != undefined ? sessionStorage.getItem(thisTileELN.id) : clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CODE2); // LGTGTWINT-1808 | Instant Pricing | Share suggestion dropdown missing for single underlying products || 31 Mar 2023
        // calculateTenor(currId);  // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023

    } catch (error) {
        console.log(error);
    }
}

function loadELNTenorValues(thisTileELN) {

    try {

        $(thisTileELN).find('[id^="btnBestPriceELN"]').attr("disabled", true);  // INT1FIN47-768 Gateway Markets Instant Pricing issue

        let tenorNumb = $(thisTileELN).find("[id^='tenor_ELN']").val();
        let tenorstring = $(thisTileELN).find("[id^='tenorddl']").val();
        let _tenor = tenorNumb + tenorstring;

        request_getDataFromAPI({
            Tenor: _tenor,
            UnderlyingCode: $(thisTileELN).find("[id^='ELNSharesDemo']").val(),
            Settlement_Days: $(thisTileELN).find('[id^="SettlWeeks"]').val(),
            CurrentTileID: thisTileELN.id.match(/\d+$/)[0],
            I_UserID: sessionStorage.getItem("EQC_UserName").toString(),
            I_Entity_Id: sessionStorage.getItem("EQC_EntityID").toString(),
            "Exchange": getExchangeAndCcyFromBasket("", "exchange", $(thisTileELN).find('[id^="ELNSharesDemo"]').val().trim())[0],
            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString()

        }, clientConfigdata.CommonMethods.NodeServer + "calculateTenorEQC45").then((ELNDates) => {

            thisTileELN = document.getElementById("td" + ELNDates.CurrentTileID);
            
            $(thisTileELN).find('[id^="btnBestPriceELN"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue

            if (ELNDates.responseData != null && ELNDates.responseData != "") {

                //$(thisTileELN).find('[id^="hdnMaturityDate_ELN"]').val(reformatDate(ELNDates.responseData[0].MaturityDate));
                //$(thisTileELN).find('[id^="hdnSettlementDate_ELN"]').val(reformatDate(ELNDates.responseData[0].ValueDate));                            
                //$(thisTileELN).find('[id^="hdnExpiryDate_ELN"]').val(reformatDate(ELNDates.responseData[0].FixingDate)); 
                
             
                $(thisTileELN).find("[id^='tenor_ELN']").parent().next().empty().html(reformatDate(ELNDates.responseData[0].MaturityDate));
                $(thisTileELN).find('[id^="ELN_SettlDate"]').html(reformatDate(ELNDates.responseData[0].ValueDate)); // Changed for New UI || LGTGTWINT-980 || Chaitanya M || 06 Feb 2023
                $(thisTileELN).find('[id^="ELN_ExpiryDate"]').html(reformatDate(ELNDates.responseData[0].FixingDate));// Changed for New UI || LGTGTWINT-980 || Chaitanya M || 06 Feb 2023
                $(thisTileELN).find('[id^="ELN_Maturity"]').html(reformatDate(ELNDates.responseData[0].MaturityDate));// Changed for New UI || LGTGTWINT-980 || Chaitanya M || 06 Feb 2023
               
                 
                let _settdate=''
                GetRequiredDate(thisTileELN,"SettlDate_ELN",_settdate,ELNDates.responseData[0].ValueDate);
                GetRequiredDate(thisTileELN,"ExpiryDate_ELN",ELNDates.responseData[0].ValueDate,ELNDates.responseData[0].FixingDate);
                GetRequiredDate(thisTileELN,"Maturity_ELN",ELNDates.responseData[0].FixingDate,ELNDates.responseData[0].MaturityDate);
             
                calculateDays($(thisTileELN).find('[id^="ELN_Maturity"]').html(), //LGTGTWINT-1480 | Chaitanya M | 25 Feb 2023
                    $(thisTileELN).find('[id^="ELN_SettlDate"]').html(),
                    thisTileELN,
                    "NoofDaysELN" ); 

                if ($(thisTileELN).find('[id^="solveForELN"]').val().trim().toUpperCase().includes("STRIKE")) {
                    getIBPriceELN(thisTileELN);
                }

            } else {
                console.log("Error in ELNTenorValues at " + thisTileELN.id);
                $(thisTileELN).find("[id^='priceELN']").val("").prop("disabled", true); //INT1FIN47-768 Gateway Markets Instant Pricing issu
            }
        }
        );
    } catch (error) {
        console.log(error);
    }
}

var globalSolveForValueELN = "";
function getBestPriceELN(that) {
    try {

        thisTileELN = $(that).parents(".sorting")[0]; 

        console.log("Start Interval value =" + $(thisTileELN).find('[id^="hdnintervalID"]').val());

        $(thisTileELN).find('[id^="btnBestPriceELN"]').attr("disabled", true); // INT1FIN47-768 Gateway Markets Instant Pricing issue

        var requestIDELN = "";

        requestIDELN = requestIDELN + RequestIDGenerator(60);

        $(thisTileELN).find('[id^="hdnRequestID"]').val(requestIDELN);  //INT1FIN47-768 Gateway Markets Instant Pricing issue
        
        mapleLoaderStop(thisTileELN,'[id^="btnBestPriceELN"]', false);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileELN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
        $(thisTileELN).find('[id^="RFQIDEQC"]').html("");
        //End

        globalSolveForValueELN = $(thisTileELN).find('[id^="solveForELN"]').val().trim();

        clearInterval($(thisTileELN).find('[id^="hdnintervalID"]').val());
        
        console.log("After clear Interval value =" + $(thisTileELN).find('[id^="hdnintervalID"]').val());

        $(thisTileELN).find('[id^="hdnintervalID"]').val("");

        TileId = that.id.match(/\d+$/)[0];

        sessionStorage.setItem("poolingTimer_" + TileId, 0);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        thisTileELN = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr("id");
        validation_clear();
        clearPricerTable(thisTileELN);

        
        if ($(thisTileELN).find('[id^="ddlELNCFreq"]').val() === "" || $(thisTileELN).find('[id^="ddlELNCFreq"]').val() === null || $(thisTileELN).find('[id^="ddlELNCFreq"]').val() === undefined) {
            ValidateField($(thisTileELN).find('[id^="ddlELNCFreq"]').attr("id"), "Please select valid KO Type.", thisTileELN);
            return false; // LGTGTWINT-2279 || KO Daily Close to be removed from Instant Pricer || 07 Aug 2023
        } else if ($.trim($(thisTileELN).find('[id^="ELNSharesDemo"]').val()) == "") {
            ValidateField($(thisTileELN).find('[id^="ELNSharesDemo"]').attr("id"), "Please Enter Valid Shares", thisTileELN);
            return false;
        } else if ($.trim($(thisTileELN).find('[id^="NoteCCY_ELN"]').val()) == "") {
            ValidateField($(thisTileELN).find('[id^="NoteCCY_ELN"]').attr("id"), "Please Select Valid Note Ccy", thisTileELN);
            return false;
        }else if ($.trim($(thisTileELN).find('[id^="ContractAmtELN"]').val()) == "" || parseFloat($(thisTileELN).find('[id^="ContractAmtELN"]').val()) < 0) {
            ValidateField($(thisTileELN).find('[id^="ContractAmtELN"]').attr("id"), "Please Enter Valid Notional.", thisTileELN); //LGTGTWINT-1487 | Chaitanya M | 22 feb 2023
            return false;
        } else if ($(thisTileELN).find('[id^="solveForELN"]').val().split("(")[0].trim().toUpperCase() == "IB PRICE" && ($.trim($(thisTileELN).find('[id^="strikeipboxELN"]').val()) == "" || parseFloat($(thisTileELN).find('[id^="strikeipboxELN"]').val()) <= 0 || parseFloat($(thisTileELN).find('[id^="strikeipboxELN"]').val()) > Number(ELNMaxStrike))) {
            ValidateField($(thisTileELN).find('[id^="strikeipboxELN"]').attr("id"), "Please Enter Valid Strike", thisTileELN);
            return false;
        }  else if ($.trim($(thisTileELN).find('[id^="tenor_ELN"]').val()) == "" || parseFloat($(thisTileELN).find('[id^="tenor_ELN"]').val()) <=0) {
            ValidateField($(thisTileELN).find('[id^="tenor_ELN"]').attr("id"), "Please Enter Valid Tenor", thisTileELN);
            return false;
        } else if ($.trim($(thisTileELN).find('[id^="ddlELNCFreq"]').val()) != "Simple" && ($.trim($(thisTileELN).find('[id^="koinputboxELN"]').val()) == "" || parseFloat($(thisTileELN).find('[id^="koinputboxELN"]').val()) <= 0)) {
            ValidateField($(thisTileELN).find('[id^="koinputboxELN"]').attr("id"), "Please Enter Valid KO % Initial.", thisTileELN);
            return false;
        } else if ($(thisTileELN).find('[id^="solveForELN"]').val().split("(")[0].trim().toUpperCase() == "STRIKE" && (parseFloat($(thisTileELN).find('[id^="upfrontELN"]').val()) <= 0 || parseFloat($(thisTileELN).find('[id^="upfrontELN"]').val()) > Number(ELNMaxUpfront))) {
            ValidateField($(thisTileELN).find('[id^="upfrontELN"]').attr("id"), "Upfront (%) should be greater than 0 and less than" + " " + Number(ELNMaxUpfront), thisTileELN); //LGTGTWINT-909 ELN configs
            return false;
        }else if ($(thisTileELN).find('[id^="solveForELN"]').val().split("(")[0].trim().toUpperCase() == "IB PRICE" && (parseFloat($(thisTileELN).find('[id^="upfrontELN"]').val()) <= 0 || parseFloat($(thisTileELN).find('[id^="upfrontELN"]').val()) > Number(ELNMaxUpfront))) {
            ValidateField($(thisTileELN).find('[id^="upfrontELN"]').attr("id"), "Upfront (%) should be greater than 0 and less than" + " " + Number(ELNMaxUpfront), thisTileELN); //LGTGTWINT-909 ELN configs
            return false;
        } else if ($(thisTileELN).find('[id^="solveForELN"]').val().split("(")[0].trim().toUpperCase() == "STRIKE" && ($.trim($(thisTileELN).find('[id^="hdnClientYield"]').val()) == "" || $.trim($(thisTileELN).find('[id^="hdnClientYield"]').val()) <= 0)) { //LGTGTWINT-909 ELN configs
            ValidateField($(thisTileELN).find('[id^="clientYELN"]').attr("id"), "Client yield cannot be zero or less than zero. Please enter correct value.", thisTileELN);
            return false;
        }else if ($.trim($(thisTileELN).find('[id^="ddlELNCFreq"]').val()) != "Simple" && (parseFloat($(thisTileELN).find('[id^="koinputboxELN"]').val()) < Number(ELNMinKO) || parseFloat($(thisTileELN).find('[id^="koinputboxELN"]').val()) > Number(ELNMaxKO))) {
            ValidateField($(thisTileELN).find('[id^="koinputboxELN"]').attr("id"), "Please Enter Valid KO % Initial.", thisTileELN);
            return false;
        }

        // RizwanS || LGTGTWINT-2320 || 17 Aug 2023
        if (NotionalMinMaxCheck === "YES") {
            if(parseFloat($(thisTileELN).find('[id^="ContractAmtELN"]').val().replace(/,/g, "")) === 0){     
                ValidateField($(thisTileELN).find('[id^="hdnQuoteID"]').attr('id'),"Please input non zero notional.",thisTileELN);
                return false;
            }
        }
        //END

        // Added by RizwanS for tenor validation before pricing || 03 Jan 2022 ||

        if( $(thisTileELN).find('[id^="tenorddl"]').val() == "M"){

            if(Number($(thisTileELN).find('[id^="tenor_ELN"]').val()) > Number(ELNAllowedTenorinMonths)){
                ValidateField($(thisTileELN).find('[id^="tenor_ELN"]').attr("id"), "Please enter valid tenor.", thisTileELN);
                return false;
            }

        } else{

             if(Number($(thisTileELN).find('[id^="tenor_ELN"]').val()) > Number(ELNAllowedTenorinYears)){
                ValidateField($(thisTileELN).find('[id^="tenor_ELN"]').attr("id"), "Please enter valid tenor.", thisTileELN);
                return false;
            }
        }
        
        // END

        let solveForELN = "";
        if ($(thisTileELN).find('[id^="solveForELN"]').val().split("(")[0].trim().toUpperCase() == "STRIKE") {
            solveForELN = "StrikePercentage";
        } else if ($(thisTileELN).find('[id^="solveForELN"]').val().split("(")[0].trim().toUpperCase() == "IB PRICE") {
            solveForELN = "PricePercentage";
        }
        //END

        // LGTGTWINT-2279 || KO Daily Close to be removed from Instant Pricer || 07 Aug 2023
        let BarrierMode = "";
        if ($(thisTileELN).find('[id^="ddlELNCFreq"]').val().trim().toUpperCase().includes("INTRADAY")) {
            BarrierMode = "CONTINUOUS";
        } else if ($(thisTileELN).find('[id^="ddlELNCFreq"]').val().trim().toUpperCase().includes("DAILY CLOSE")) {
            BarrierMode = "DAILY_CLOSE";
        } 
        //END
       
        maturity_date= new Date( $(thisTileELN).find('[id^="ELN_Maturity"]').text());
        settl_date= new Date($(thisTileELN).find('[id^="ELN_SettlDate"]').text());
        expiry_date = new Date($(thisTileELN).find('[id^="ELN_ExpiryDate"]').text());
      
      if( maturity_date.getDay() =="6" ||  maturity_date.getDay() =="0"){     
        $(thisTileELN).find('[id^="btnBestPrice"]').attr("disabled", true); 
        ValidateField($(thisTileELN).find('[id^="Maturity_ELN"]').attr("id"),"Maturity Date is holiday.",thisTileELN); //LGTGTWINT-1638 | Chaitanya M | 03 July 2023 
        return false;
      } else if( settl_date.getDay() =="6" ||  settl_date.getDay() =="0"){
        $(thisTileELN).find('[id^="btnBestPrice"]').attr("disabled", true); 
        ValidateField($(thisTileELN).find('[id^="SettlDate_ELN"]').attr("id"),"Settlement Date is holiday.",thisTileELN); //LGTGTWINT-1638 | Chaitanya M | 03 July 2023 
        return false; 
      } else if( expiry_date.getDay() =="6" ||  expiry_date.getDay() =="0"){
        $(thisTileELN).find('[id^="btnBestPrice"]').attr("disabled", true); 
        ValidateField($(thisTileELN).find('[id^="ExpiryDate_ELN"]').attr("id"),"Expiry Date is holiday.",thisTileELN); //LGTGTWINT-1638 | Chaitanya M | 03 July 2023 
        return false;
      }   

        var _checkdateresponse = checkdates(thisTileELN,TileId);
        if(_checkdateresponse == false){
            return false
        }
       

        $("body").css("opacity", "0.9");

        let tenorNumb = $(thisTileELN).find("[id^='tenor_ELN']").val();
        let tenorstring = $(thisTileELN).find("[id^='tenorddl']").val();

        let _tenor = tenorNumb + tenorstring;
        
        //INT1FIN47-768 Gateway Markets Instant Pricing issu

        // get strike Percentage || 

        let _strikePerc = "";

        _strikePerc =  $(thisTileELN).find('[id^="strikeipboxELN"]').val();


        // get upfront 

        let _upfront = "";

        _upfront = $(thisTileELN).find('[id^="upfrontELN"]').val();

        $(thisTileELN).find('[id^="hiddenUpfrontELN"]').val(_upfront);

        // get IB Price 

        let _IBprice = "";

        if ($(thisTileELN).find('[id^="solveForELN"]').val().split("(")[0].trim().toUpperCase() == "STRIKE") {

            _IBprice = $(thisTileELN).find('[id^="priceELN"]').val();

        }else{

            _IBprice = 0;
        }


         // Added for being Able to price with only share name entered and not selected| Ref:LGTGTWINT-1076, LGTGTWINT-1075 | Chaitanya M | 24-Jan-2023
        //start
        var checkforshares = validateshares(thisTileELN,"ELNSharesDemo");
        if(checkforshares==false){
            ValidateField($(thisTileELN).find('[id^="ELNSharesDemo"]').attr("id"), "Please Enter Valid Shares", thisTileELN);
            return false;                
        }     

        // Added ER_Quanto flag not getting updated for ELN, FCN and DRA in Instant pricer | LGTGTWINT-1448| Chaitanya M | 20 Feb 2023
        let _QuantoFlagELN = "";
        if($(thisTileELN).find('[id^="NoteCCY_ELN"]').val()== $(thisTileELN).find('[id^="ShareCCY_ELN"]').text()){ //LGTGTWINT-1663 Instant Pricing: FCN,ELN: EQC Ref blank for FCN and hardcoded value for ELN on order popup through place order button
            _QuantoFlagELN = "No";
        }else{
            _QuantoFlagELN = "Yes";
        }
        //End
        
            
        //End          


        // LGTGTWINT-1227 - Instant Pricing: EQC Ref missing for rfqs placed through instant pricing | 24 Feb 2023

        let _tenorELN = ""

        if(tenorstring.toUpperCase().includes("M")){

            _tenorELN= "MONTH";

        }else{

            _tenorELN= "YEAR";
        }

        let getRefELN = "";

        getRefELN = getEQCRefrenceNumber(productName,BarrierMode,"",tenorNumb,_tenorELN,"",_QuantoFlagELN,"Single");

        $(thisTileELN).find('[id^="hdnRefnumber"]').val(getRefELN); //LGTGTWINT-1589 Instant Pricing : EQC ref different on instant pricer and order details,quote mail and order mail

        // END

          mapleLoaderStart(thisTileELN,'[id^="btnBestPriceELN"]', false);

        QuoteObjectForELN = {

            "UserID": sessionStorage.getItem("EQC_UserName").toString(),
            "Type": $(thisTileELN).find('[id^="ddlELNCFreq"]').val().toUpperCase() == "SIMPLE" ? "Simple" : "Barrier",
            "Exchange": getExchangeAndCcyFromBasket("", "exchange", $(thisTileELN).find('[id^="ELNSharesDemo"]').val().trim())[0],
            "UnderlyingCode": $(thisTileELN).find('[id^="ELNSharesDemo"]').val(),
            "Ccy": $(thisTileELN).find('[id^="NoteCCY_ELN"]').val(),
            "strSolveFor": solveForELN,
            "BarrierPerc": $(thisTileELN).find('[id^="ddlELNCFreq"]').val() != "Simple" ? $(thisTileELN).find('[id^="koinputboxELN"]')[0].value : "",
            "Tenor": _tenor,
            "strikePerc":_strikePerc, //INT1FIN47-768 Gateway Markets Instant Pricing issu
            "PricePerc":_IBprice, //INT1FIN47-768 Gateway Markets Instant Pricing issu
            "BarrierMode": BarrierMode,
            "Friday_Preferred_YN": "Y",
            "Settlement_Days": $(thisTileELN).find('[id^="SettlWeeks"]').val().trim(),
            "Upfront": _upfront, //INT1FIN47-768 Gateway Markets Instant Pricing issu
            "SettlmentDate": $(thisTileELN).find('[id^="ELN_SettlDate"]').text(),
            "ExpiryDate": $(thisTileELN).find('[id^="ELN_ExpiryDate"]').text(),
            "MaturityDate": $(thisTileELN).find('[id^="ELN_Maturity"]').text(),
            "TradeDate": GLOBAL_TRADE_DATE,
            "EQC_TOKEN": sessionStorage.getItem("EQC_Token"),
            "CurrentTileID": TileId,
            "requestID":$(thisTileELN).find('[id^="hdnRequestID"]').val(), //INT1FIN47-768 Gateway Markets Instant Pricing issue
            "QuantoYN":_QuantoFlagELN, // LGTGTWINT-1448 | Chaitanya M | 20 Feb 2023
            "BuysideID": getRefELN,
            "Notional":  $(thisTileELN).find('[id^="ContractAmt"]').val().replace(/,/g, "").split(".")[0]
        };
        getQuoteELN(QuoteObjectForELN, $(thisTileELN).find('[id^="hdnintervalID"]')[0]);

    } catch (error) {
        console.log(error);
    } finally { }
}

//To get quote
function getQuoteELN(QuoteObjectForELN, uniqueIntervalID) {
    try {
        request_getDataFromAPI(QuoteObjectForELN, clientConfigdata.CommonMethods.NodeServer + "QuoteELN45").then((dataELN) => {
            thisTileELN = document.getElementById("td" + dataELN.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataELN.CurrentTileID, true);
            mapleLoaderStart(thisTileELN,'[id^="btnBestPriceELN"]', false);
            getUniqQuoteResponseELN(thisTileELN, dataELN, uniqueIntervalID, QuoteObjectForELN.requestID);//INT1FIN47-768 Gateway Markets Instant Pricing issue
        }
        ).catch((error) => {
            console.log(error);
        }
        );
    } catch (err) {
        console.log(err.message);
    } finally { }
}

function getUniqQuoteResponseELN(thisTileELN, dataELN, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {
        var UIID = null;
        // Added by Atharva - EQC Timers - START
        isTimerStarted["td" + dataELN.CurrentTileID] = false;
        myCounter["td" + dataELN.CurrentTileID] = {};
        hasUserClickedEQC["td" + dataELN.CurrentTileID] = false;
        $(thisTileELN).find('[id^="hdnSelectedBank"]').val("");
        
        // END
        uniqueIntervalID.value = setInterval(function () {
 
            if(reqestID != $(thisTileELN).find('[id^="hdnRequestID"]').val() || $(thisTileELN).find('[id^="hdnRequestID"]').val() === ""){ //RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                if($(thisTileELN).find('[id^="hdnRequestID"]').val() === ""){ //RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    mapleLoaderStop(thisTileELN,'[id^="btnBestPriceELN"]', false);
                }
                return false
            } // INT1FIN47-768 Gateway Markets Instant Pricing issue

            sessionStorage.setItem("quoteToken_" + thisTileELN.id.match(/\d+$/)[0], "");
            sessionStorage.setItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0], "");

            sessionStorage.setItem("quoteToken_" + thisTileELN.id.match(/\d+$/)[0], dataELN["token"]);
            sessionStorage.setItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0], dataELN["responseData"]);

            getFinalQuoteResponseELN(sessionStorage.getItem("quoteToken_" + thisTileELN.id.match(/\d+$/)[0]), sessionStorage.getItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]), thisTileELN, uniqueIntervalID, reqestID);
        
        }, clientConfigdata.EQCAQDQ.PollInterval);

        console.log("uniqueIntervalID  " + uniqueIntervalID.value);
    } catch (error) {
        console.log(error);
    }
}

// To get price
function getFinalQuoteResponseELN(finalToken1, finalResponseData1, thisTileELN, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {
        
        var currentDateAndTime = new Date();
       
        sessionStorage.setItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0], finalResponseData1);

        sessionStorage.setItem("quoteToken_" + thisTileELN.id.match(/\d+$/)[0], finalToken1);

        console.log("ELN" + " RFQ's :: " + finalResponseData1 + " " + currentDateAndTime);
        Timer = Timer + 1;

        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileELN.id.match(/\d+$/)[0])) >= Number(ELNrequestCount.toString().split(".")[0]) || sessionStorage.getItem("pricingToggle" + thisTileELN.id.match(/\d+$/)[0]) == "false") { //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
            
            $(thisTileELN).find('[id^="btnBestPriceELN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval(uniqueIntervalID.value);
            mapleLoaderStop(thisTileELN,'[id^="btnBestPriceELN"]', false);
           
            uniqueIntervalID.value = "";
            QuoteObjectForELN = "";
            $(thisTileELN).find('[id^="OverlayDiv"]').hide();
            
            $("body").css("opacity", "");
            arrELN = [];
            maxELN = "";
            Timer = 0;

            // $(thisTileELN).find('[id^="hdnChartPricesELN"]').val(JSON.stringify(finalObj));
            // if (finalObj != null || finalObj != undefined) {
            //     drawgraphELN($(thisTileELN).find('[id^="canvas"]').attr("id"));
            // }
            // INT1FIN47-768 Gateway Markets Instant Pricing issue

            return false;

        } else {
            var repriceObject = request_getDataFromAPI({
                PPDetails: sessionStorage.getItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]),
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token"),
                CurrentTileID: thisTileELN.id.match(/\d+$/)[0],
                UserID: sessionStorage.getItem("EQC_UserName").toString()
            }, clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseELN45").then((repriceObject) => {

                thisTileELN = document.getElementById("td" + repriceObject.CurrentTileID);
                
                if(reqestID != $(thisTileELN).find('[id^="hdnRequestID"]').val() || $(thisTileELN).find('[id^="hdnRequestID"]').val() === ""){ //RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    if($(thisTileELN).find('[id^="hdnRequestID"]').val() === ""){ //RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                        mapleLoaderStop(thisTileELN,'[id^="btnBestPriceELN"]', false);
                    }
                    return false
                } //INT1FIN47-768Gateway Markets Instant Pricing issue
                
                sessionStorage.setItem("poolingTimer_" + repriceObject.CurrentTileID, Number(sessionStorage.getItem("poolingTimer_" + thisTileELN.id.match(/\d+$/)[0])) + 1);

                finalObj = repriceObject["responseData"];

                sessionStorage.setItem("quoteToken_" + thisTileELN.id.match(/\d+$/)[0], repriceObject["token"]);
                sessionStorage.setItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]));
                // Sorted By Best Price LP'S

                finalObj.sort(function (a, b) {
                    if (a.ELNOUT === null || a.ELNOUT == "" || a.ELNOUT == "Timeout" || a.ELNOUT.toUpperCase().trim() == "UNSUPPORTED" || a.ELNOUT.toUpperCase().trim() == "REJECTED") {
                        return 1;
                    } else if (b.ELNOUT === null || b.ELNOUT == "" || b.ELNOUT == "Timeout" || b.ELNOUT.toUpperCase().trim() == "UNSUPPORTED" || b.ELNOUT.toUpperCase().trim() == "REJECTED") {
                        return -1;
                    } else if (a.ELNOUT === b.ELNOUT) {
                        return 0;
                    }
                    return Number(a.ELNOUT) < Number(b.ELNOUT) ? -1 : 1;
                });

                //Removed || LGTGTWINT-1981 || RizwanS || 12 May 2023
                finalTokenELN = repriceObject["token"];
                $(thisTileELN).find('[id^="hdnfinalTokenELN"]').val(finalTokenELN);
                // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileELN).find('[id^="BookTradeELN"]').attr("disabled", false);
                $(thisTileELN).find('[id^="btnEmailQuote"]').attr("disabled", false);
                $(thisTileELN).find('[id^="OrderEmail"]').attr("disabled",false); //LGTGTWINT-1981 || RizwanS || 12 May 2023

                // END
                maxELN = finalObj[0].ELNOUT;

                //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                
                //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
                // $(thisTileELN).find('[id^="EQCRfqidpnl"]').show();
                // $(thisTileELN).find('[id^="RFQIDEQC"]').html("");
                // $(thisTileELN).find('[id^="RFQIDEQC"]').html(finalObj[0].EP_ER_QuoteRequestId);
                //end
                
                //end

                $(thisTileELN).find('[id^="hdnfinalTokenELN"]').val(sessionStorage.getItem("quoteToken_" + thisTileELN.id.match(/\d+$/)[0]));

                if (sessionStorage.getItem("pricingToggle" + thisTileELN.id.match(/\d+$/)[0]) == "true") {
                    // Added by Atharva - EQC Timers - START
                    // every time in new request indexes might change so clearing.
                    var isNonBestPrice = false;
                    if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
                        isNonBestPrice = true;
                    } else {
                        isNonBestPrice = false;
                    }
                    mapIndexToBank["td" + repriceObject.CurrentTileID] = {};
                    // END
                    // $(thisTileELN).find('[id^="ELNBanksRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // $(thisTileELN).find('[id^="ELNPrices"]').empty();//Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // Added by Atharva - EQC Timers - START
                    $(thisTileELN).find('[id^="ELNTimerRow"]').empty();
                    if (!hasUserClickedEQC["td" + repriceObject.CurrentTileID]) {
                        $(thisTileELN).find('[id^="hdnSelectedBank"]').val("");
                    }
                    var itr = 0;
                    // END
                    console.log("Sorted object ELN ", finalObj);

                    // $(thisTileELN).find('[id^="minMaxNotionalLimitRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023

                    //Check for best price count || LGTGTWINT-1981 || RizwanS || 12 May 2023
                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023
                    if (NotesBestPriceDisplayCount != "") { 
                        // LGTGTWINT-2018 - Prices to be displayed for EAM entity on MSP and IP only when the input notional falls within min max range of CPs || RizwanS || 24 May 2023
                        if(NotionalMinMaxCheck.toUpperCase() === 'YES' && parseFloat($(thisTileELN).find('[id^="ContractAmtELN"]').val().replace(/,/g, "")) > 0){ //RizwanS || LGTGTWINT-2153 || 27 Jun 2023
                            
                            let sliceCount = Number(NotesBestPriceDisplayCount); // Count to show best prices as per config set

                            let productname = $(thisTileELN).find(".productName").attr("id");
    
                            // Start - LGTGTWINT-2009, 2005 | Chaitanya M | 18 May 2023 
    
                            let _upfrontvalue = Number($(thisTileELN).find('[id^="upfrontELN"]').val());

                            let _minmaxObj = [];

                            for(i=0;i<finalObj.length;i++){
        

                                if(parseFloat($(thisTileELN).find('[id^="ContractAmtELN"]').val().replace(/,/g, "")) <= parseFloat(finalObj[i].MaxNotional)
                                    && parseFloat($(thisTileELN).find('[id^="ContractAmtELN"]').val().replace(/,/g, "")) >= parseFloat(finalObj[i].MinNotional)){
                                    
                                    _minmaxObj.push(finalObj[i]);
        
                                }
        
                            }
                            
                            if(_minmaxObj.length <= 0){

                                $(thisTileELN).find('[id^="BookTradeELN"]').attr("disabled", true);
                                $(thisTileELN).find('[id^="btnEmailQuote"]').attr("disabled", true);
                                $(thisTileELN).find('[id^="OrderEmail"]').attr("disabled",true);
                                return false;
                            }   
    
                            finalObj = sliceEQCbestprices(_minmaxObj,productname,sliceCount,_upfrontvalue);
                                                    
                        }
                        
                    }

                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023
                    $(thisTileELN).find('[id^="ELNBanksRow"]').empty();
                    $(thisTileELN).find('[id^="ELNPrices"]').empty();
                    $(thisTileELN).find('[id^="minMaxNotionalLimitRow"]').empty();
                    //END

                    bindRFQIDEQC(thisTileELN,finalObj); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
                    
                    $(thisTileELN).find('[id^="hdnChartPricesELN"]').val(JSON.stringify(finalObj));

                    // END

                    $(finalObj).each(function (i, elem) {
                        try {
                            // Added code for changing css class for glowing on/off
                            var priceClass = "GlowPrice_Red";
                            if (!glowFlag) {
                                priceClass = "noGlow";
                            }

                            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                            // $(thisTileELN).find('[id^="EQCRfqidpnl"]').show();
                            // $(thisTileELN).find('[id^="RFQIDEQC"]').html(elem.ParentID);
                            //End

                            var str = "";
                            var str2 = "";
                            if (elem.PP_CODE != null) {
                                // Added by Atharva - EQC Timers - START
                                mapIndexToBank["td" + repriceObject.CurrentTileID][itr] = elem.PP_CODE;
                                if (elem.ELNOUT != null && !isNaN(parseFloat(elem.ELNOUT)) && $(thisTileELN).find('[id^="hdnSelectedBank"]').val() == "") {
                                    $(thisTileELN).find('[id^="hdnSelectedBank"]').val(elem.PP_CODE);
                                }
                                if (elem.PP_CODE == "CITI") {
                                    if (isNonBestPrice) {
                                        if (elem.ELNOUT != null && !isNaN(parseFloat(elem.ELNOUT)) && $(thisTileELN).find('[id^="hdnSelectedBank"]').val().trim() == elem.PP_CODE) {
                                            str = str + "<td class='priceBackground";
                                            if (itr == 0) {
                                                str = str + " bestPriceStyle";
                                            }
                                            str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + "Citi" + "</button></td>";
                                        } else if (elem.ELNOUT != null && !isNaN(parseFloat(elem.ELNOUT))) {
                                            str = str + "<td";
                                            if (itr == 0) {
                                                str = str + " class='bestPriceStyle'";
                                            }
                                            str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + "Citi" + "</td>";
                                        } else {
                                            str = str + "<td>" + "Citi" + "</td>";
                                        }
                                    } else {
                                        str = str + "<td";
                                        if (itr == 0 && elem.ELNOUT != null && !isNaN(parseFloat(elem.ELNOUT))) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + ">Citi</td>";
                                    }
                                } else {
                                    if (isNonBestPrice) {
                                        if (elem.ELNOUT != null && !isNaN(parseFloat(elem.ELNOUT)) && $(thisTileELN).find('[id^="hdnSelectedBank"]').val().trim() == elem.PP_CODE) {
                                            str = str + "<td class='priceBackground";
                                            if (itr == 0) {
                                                str = str + " bestPriceStyle";
                                            }
                                            str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</button></td>";
                                        } else if (elem.ELNOUT != null && !isNaN(parseFloat(elem.ELNOUT))) {
                                            str = str + "<td";
                                            if (itr == 0) {
                                                str = str + " class='bestPriceStyle'";
                                            }
                                            str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</td>";
                                        } else {
                                            str = str + "<td>" + elem.PP_CODE + "</td>";
                                        }
                                    } else {
                                        str = str + "<td";
                                        if (itr == 0 && elem.ELNOUT != null && !isNaN(parseFloat(elem.ELNOUT))) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + ">" + elem.PP_CODE + "</td>";
                                    }
                                }
                                // END
                                $(thisTileELN).find('[id^="ELNBanksRow"]').append(str);
                            } else {
                                str = str + "<td>--</td>";
                                $(thisTileELN).find('[id^="ELNBanksRow"]').append(str);
                            }
                            if (elem.ELNOUT != null && !isNaN(parseFloat(elem.ELNOUT))) {
                                // Added by Atharva - EQC Timers
                                // Added new if condition
                                if (isNonBestPrice) {
                                    if ($(thisTileELN).find('[id^="hdnSelectedBank"]').val() == elem.PP_CODE) {
                                        str2 = str2 + "<td class='priceBackground";
                                        // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023
                                        if( parseFloat(elem.ELNOUT).toFixed(2) < 0){
                                            if (itr == 0) {
                                                str2 = str2 + " negativeprice";
                                            }
                                        }else{
                                            if (itr == 0) {
                                                str2 = str2 + " bestPriceStyle";
                                            }
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.ELNOUT).toFixed(2) + " %</button></td>";
                                        $(thisTileELN).find('[id^="ELNPrices"]').append(str2);
                                    } else {
                                        str2 = str2 + "<td";
                                        // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023
                                        if( parseFloat(elem.ELNOUT).toFixed(2) < 0){
                                            if (itr == 0) {
                                                str2 = str2 + " class='bestPriceStyle'";
                                            }
                                            // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                            str2 = str2 + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.ELNOUT).toFixed(2) + " %</button></td>";
                                            $(thisTileELN).find('[id^="ELNPrices"]').append(str2);

                                        }else{
                                            if (itr == 0) {
                                                str2 = str2 + " class='bestPriceStyle'";
                                            }
                                            // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                            str2 = str2 + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.ELNOUT).toFixed(2) + " %</button></td>";
                                            $(thisTileELN).find('[id^="ELNPrices"]').append(str2);
                                        }
                                        
                                       
                                    }
                                } else {
                                    str2 = str2 + "<td";
                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023
                                    if( parseFloat(elem.ELNOUT).toFixed(2) < 0){
                                        if (itr == 0) {
                                            str2 = str2 + " class='bestPriceStyle'";
                                        }
                                    }else{
                                        if (itr == 0) {
                                            str2 = str2 + " class='bestPriceStyle'";
                                        }
                                    }
                                    // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                    str2 = str2 + ">" + parseFloat(elem.ELNOUT).toFixed(2) + " %</td>";
                                    $(thisTileELN).find('[id^="ELNPrices"]').append(str2);
                                }
                            } else {
                                str2 = str2 + "<td>-</td>";
                                $(thisTileELN).find('[id^="ELNPrices"]').append(str2);
                            }
                            // Added by Atharva - EQC Timers - START
                            if (elem.ELNOUT != null && !isNaN(parseFloat(elem.ELNOUT))) {
                                
                            } else {
                                
                            }
                            itr++;
                            // END
                            // Added by AniruddhaJ for show min max limit instead if time ;

                            let strMinMaxNotionalLimit = '';

                            if (elem.PP_CODE != null) {
                                strMinMaxNotionalLimit = strMinMaxNotionalLimit + `<td style='font-size:12px !important;'>${K_M_B_Formatter(Number(elem.MinNotional))} / ${K_M_B_Formatter(Number(elem.MaxNotional))}</td>`;
                                $(thisTileELN).find('[id^="minMaxNotionalLimitRow"]').append(strMinMaxNotionalLimit);
                            }

                            
                        } catch (error) {
                            console.log(error);
                            $(thisTileELN).find('[id^="OverlayDiv"]').hide();
                            if (finalObj != null || finalObj != undefined) {
                                drawgraphELN($(thisTileELN).find('[id^="canvas"]').attr("id"));
                            }
                        } finally { }
                    });
                }
            }
            ).catch((error) => {
                console.log(error);
                $(thisTileELN).find('[id^="btnBestPriceELN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
                clearInterval(uniqueIntervalID.value);
                mapleLoaderStop(thisTileELN,'[id^="btnBestPriceELN"]', false);
                // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileELN).find('[id^="BookTradeELN"]').attr("disabled", true);
                $(thisTileELN).find('[id^="btnEmailQuote"]').attr("disabled", true);
                $(thisTileELN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
                
                uniqueIntervalID.value = "";
                $(thisTileELN).find('[id^="OverlayDiv"]').hide();
                if (finalObj != null || finalObj != undefined) {
                    drawgraphELN($(thisTileELN).find('[id^="canvas"]').attr("id"));
                }
            }
            );
        }
    } catch (error) {
            

        $(thisTileELN).find('[id^="btnBestPriceELN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issueclearInterval(uniqueIntervalID.value);
        sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        clearInterval(uniqueIntervalID.value);
        mapleLoaderStop(thisTileELN,'[id^="btnBestPriceELN"]', false);

        uniqueIntervalID.value = "";
        $(thisTileELN).find('[id^="OverlayDiv"]').hide();
        $(thisTileELN).find('[id^="BookTradeELN"]').attr("disabled", false);

        console.log("getFinalQuoteResponseELN" + error.message);
        
        return false;
       
        // $(thisTileELN).find('[id^="hdnChartPricesELN"]').val(JSON.stringify(finalObj));
        // if (finalObj != null || finalObj != undefined) {
        //     drawgraphELN($(thisTileELN).find('[id^="canvas"]').attr("id"));
        // }  // INT1FIN47-768 Gateway Markets Instant Pricing issue      
        // sessionStorage.setItem("quoteToken_" + thisTileELN.id.match(/\d+$/)[0], repriceObject["token"]);
        // sessionStorage.setItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]));
         //// INT1FIN47-768 Gateway Markets Instant Pricing issue

    } finally {
    }
}
// To book trade
function booktradeELN(that, suitabilityCheck,redirectOrder) { // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
    try { 
        // startLoader();

        TileId = that.id.match(/\d+$/)[0];
        sessionStorage.setItem("pricingToggle" + TileId, false);
        thisTileELN = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr("id");
        // Added by Atharva - EQC Timers - START
        clearPricesInterrupt["td" + TileId] = true;

      
        var selectedBankIndex = -1;
        var itr = 0;
        var isNonBestPrice = false;
        if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
            isNonBestPrice = true;
        } else {
            isNonBestPrice = false;
        }
        if (isNonBestPrice) {
            $(thisTileELN).find('[id^="ELNBanksRow"]').children().each(function () {
                if ($(thisTileELN).find('[id^="hdnSelectedBank"]').val() == $(this).find("button").html()) {
                    selectedBankIndex = itr;
                }
                itr++;
            });
        } else {
            selectedBankIndex = 0;
        }
     
        if (selectedBankIndex == -1) {
            // endLoader();
            mapleOrderLoaderStop(thisTileELN);
            return false;
        }
        // END


        let AllocationDetails=[];

        $(thisTileELN).find("select.ChildrenddlBookingCenter").each(function(index, element){

            if ($(this).parent().prev().find(".childrenCheckBoxBooking")[0].checked) {

                AllocationDetails.push({

                    "RMName": $(element).parent().parent().find('[id^="ddlRMName"]').val(),
                    "CustBranch": element.value,
                    "Notional":$(element).parent().parent().find('[id^="txtHeaderNotional"]').val().split('.')[0].replace(/\,/g, "")
        
                    })
            }

      })

        let limitPrice1 = "";
        let limitPrice2 = "";
        let limitPrice3 = "";
        let limitPrice4 = "";

        if($(thisTileELN).find('[id^="ddlOrderTypeELN"]').val().trim().toUpperCase() == "LIMIT"){

            if($(thisTileELN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 0){

                limitPrice1 = $(thisTileELN).find('[id^="txtLimitLevel"]').val().trim();

            }else if($(thisTileELN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 1){

                 limitPrice2 = $(thisTileELN).find('[id^="txtLimitLevel"]').val().trim();

            } else if($(thisTileELN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 2){

                 limitPrice3 = $(thisTileELN).find('[id^="txtLimitLevel"]').val().trim();
                 
            } else if($(thisTileELN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 3){

                limitPrice4 = $(thisTileELN).find('[id^="txtLimitLevel"]').val().trim();
                
            }            
        }


        
        //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

        let _confirmReason = "";

        if(selectedBankIndex>0){

             if($(thisTileELN).find('[id^="ddlNONBEST"]').val() != "NONBEST_CUSTOM"){

                 _confirmReason = $(thisTileELN).find('[id^="ddlNONBEST"]').text();
     
             }else{
     
                 _confirmReason =  $(thisTileELN).find('[id^="txtNONBEST"]').val(); 
                 
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
              if ($(thisTileELN).find('[id^="rbRowSuitabilityToggle"]')[0].checked) {
                 _chkSuitability = "NO";
                 if ($(thisTileELN).find('[id^="ddlReason"]').val().trim().includes("SUTSKP_CUSTOM")) { // Added by RizwanS | JIRA-LGTGTWINT-1830
                     _reasonmsg = $(thisTileELN).find('[id^="txtSpecifyReason"]').val();
                 }else{
                     _reasonmsg = $(thisTileELN).find('[id^="ddlReason"]').val();
                 }
              }else{
                 _chkSuitability = "YES"; //RizwanS || LGTGTWINT-2295 || 11 Aug 2023
              }
             //End
            
         }


        // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
        let orderMethodName = "";
        let ELN_BOOK_REQUEST = "";

        if(redirectOrder == true){

            orderMethodName = "redirectOrder";

            ELN_BOOK_REQUEST= {
           

               EntityID: sessionStorage.getItem("EQC_EntityID").toString(),
               orderQty: $(thisTileELN).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
               type:$(thisTileELN).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
               limitPrice1: limitPrice1,
               limitPrice2: limitPrice2,
               limitPrice3: limitPrice3,
               limitPrice4: limitPrice4,
               QuoteRequestId: JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId,
               loginUser: sessionStorage.getItem("EQC_UserName").toString(),
               margin:  $(thisTileELN).find('[id^="txtUpfront"]').val(),
               clientPrice: $(thisTileELN).find('[id^="txtClientPrice"]').val(),
               yield: $(thisTileELN).find('[id^="txtClientYield"]').val(),
               bookingBranch: $(thisTileELN).find('[id^="ddlBookingBranch"]').val(),
               rmNameForOrderConfirmation: $(thisTileELN).find('[id^="ddlRMName"]').val(),
               dealerNotificationEmailID: $(thisTileELN).find('[id^="txtComment"]').val(),
               orderComment: $(thisTileELN).find('[id^="txtComment"]').val(),
               confirmationReason: _confirmReason,
               advisoryReason: $(thisTileELN).find('[id^="txtComment"]').val(),
               preTradeXml: preTradeXml,
               //chkSuitability:$(thisTileELN).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
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

            ELN_BOOK_REQUEST= {
           
                "userName": sessionStorage.getItem("EQC_UserName").toString(),
                "token": "",
                "orderQuantity": $(thisTileELN).find('[id^="txtTotalNotional"]').val().split(".")[0].replace(/\,/g, ""),
                "OrderType":$(thisTileELN).find('[id^="ddlOrderType"]').val(),
                "LimitPrice1": limitPrice1,
                "LimitPrice2": limitPrice2,
                "LimitPrice3": limitPrice3,
                "LimitPrice4": limitPrice4,
                "QuoteRequestId": JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId,
                "PoolID": "",
                "RedirectOrderID": "",
                "OrderComment": $(thisTileELN).find('[id^="txtComment"]').val(),
                "Margin": $(thisTileELN).find('[id^="txtUpfront"]').val(),//$(thisTileELN).find('[id^="hiddenUpfrontELN"]').val(),
                "Notional": $(thisTileELN).find('[id^="txtTotalNotional"]').val().split(".")[0].replace(/\,/g, ""),
                "ClientPrice":  $(thisTileELN).find('[id^="txtClientPrice"]').val(),//(Number(JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[selectedBankIndex].ELNOUT) + Number($(thisTileELN).find('[id^="hiddenUpfrontELN"]').val())).toFixed(2),
                "ClientYield":  $(thisTileELN).find('[id^="txtClientYield"]').val(),//JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[selectedBankIndex].ClientYield,
                //LGTGTWINT-1112 Instant Pricing: Client Yield should get calculated on changing upfront on order popup for ELN
                "BookingBranch": $(thisTileELN).find('[id^="ddlBookingBranch"]').val(),
                "RMNameforOrderConfirm": $(thisTileELN).find('[id^="ddlRMName"]').val(),
                "RMEmailIdforOrderConfirm": "",
                "ConfirmReason":  _confirmReason, //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message
                "PreTradeXml": "",
                "AdvisoryReason": "",
                // "UserRole":_reasonmsg, // Added Chaitanya M | For checking the suitability reason | Ref:LGTGTWINT-603 | 12-Jan-2023
                "CustomerID": "",
                // "chkSuitability":$(thisTileELN).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
                "chkSuitability":_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                "SuitabilityReason": _reasonmsg, // Added by RizwanS | JIRA-LGTGTWINT-1830
                "IntendedSpread": "",
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": TileId,
                "AllocationDetails": AllocationDetails,
                "UserRole" : isEQCDealer === true ? 'Dealer' : isIA=== true ? 'IA' : 'RM' , // Added by RizwanS | JIRA-LGTGTWINT-1830
            }

        }

        console.log('ELN book request ', ELN_BOOK_REQUEST);

        mapleOrderLoaderStart(thisTileELN);

        var bookObject = request_getDataFromAPI(ELN_BOOK_REQUEST, clientConfigdata.CommonMethods.NodeServer + orderMethodName).then((bookObject) => {

            // endLoader();

            TileId = bookObject.CurrentTileID;

            thisTileELN = document.getElementById("td" + bookObject.CurrentTileID);

            let bookstring = bookObject['responseData']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
             
            let OrderStatus = bookObject['message']; // LGTGTWINT-1888 || RizwanS || 30 May 2023

            if (OrderStatus.toUpperCase() === clientConfigdata.EQCCommonMethods.EQC_BOOK_TRADE_RESPONSE_DETAILS.toUpperCase()) {

                // $(thisTileELN).find('[id^="hdnBlotterURLELN"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                // $(thisTileELN).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradeeln" + TileId, bookstring, "DivOverlayeln");
                $(thisTileELN).find('[id^="OverlayDiv"]').hide();
                $(thisTileELN).find('[id^="hdnfinalTokenELN"]').val("");
                clearPricerTable(thisTileELN);

            } else {

                if(OrderStatus == "" || OrderStatus == null || OrderStatus==undefined){

                    OrderStatus = "Order Execution Failed!";

                }else if(OrderStatus.includes("Please select booking centers from same region")){ // LGTGTWINT-1888 || RizwanS || 30 May 2023

                    OrderStatus = "Please select booking centers from same region.";
                }


                booktradePopup(that, "booktradeeln" + TileId, OrderStatus, "DivOverlayeln");
                $(thisTileELN).find('[id^="OverlayDiv"]').hide();
                $(thisTileELN).find('[id^="hdnfinalTokenELN"]').val("");
                clearPricerTable(thisTileELN);

            }
            mapleOrderLoaderStop(thisTileELN);
            sessionStorage.removeItem("quoteResponse_" + thisTileELN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileELN).find('[id^="btnBestPriceELN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileELN).find('[id^="hdnintervalID"]').val());
            mapleLoaderStop(thisTileELN,'[id^="btnBestPriceELN"]', false);
            // Added by Atharva - EQC Timers - START
            $(thisTileELN).find('[id^="ELNPrices"]').children().each(function () {
                $(this).find("button").attr("disabled", true);
            });
            $(thisTileELN).find('[id^="ELNBanksRow"]').children().each(function () {
                $(this).find("button").attr("disabled", true);
            });
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileELN).find('[id^="BookTradeELN"]').attr("disabled", true);
            $(thisTileELN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileELN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
            
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileELN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileELN).find('[id^="RFQIDEQC"]').html("");
            //End

            // END
        }
        ).catch((error) => {
            console.log(error);
        }
        );
    } catch (er) {
        console.log(er.message);
        booktradePopup(that, "booktradeeln" + TileId, "Order Execution Failed!", "DivOverlayeln");
        $(thisTileELN).find('[id^="OverlayDiv"]').hide();
        // endLoader();
        mapleOrderLoaderStop(thisTileELN);
    } finally { }
}

function getIBPriceELN(that, yield) {
    try {
        thisTileELN = that;

        $(thisTileELN).find('[id^="btnBestPriceELN"]').attr("disabled", true);  // INT1FIN47-768 Gateway Markets Instant Pricing issue

        if (yield != undefined) {
            yeildELN = yield;
            $(thisTileELN).find('[id^="hdnClientYield"]').val(yeildELN);
        } else {
            yeildELN = $(thisTileELN).find('input[id^="clientYELN"]').val();
            $(thisTileELN).find('[id^="hdnClientYield"]').val(yeildELN);
        }
        TileId = that.id.match(/\d+$/)[0];
        thisTileELN = document.getElementById("td" + TileId);
        request_getDataFromAPI({
            UserName: sessionStorage.getItem("EQC_UserName").toString(),
            ClientYield: yeildELN,
            Ccy: $(thisTileELN).find('[id^="NoteCCY_ELN"]').val(),
            Upfront: $(thisTileELN).find('[id^="upfrontELN"]').val(),
            SettlementDate: $(thisTileELN).find('[id^="ELN_SettlDate"]').html(),
            MaturityDate: $(thisTileELN).find('[id^="ELN_Maturity"]').html(),
            token: "",
            EQC_TOKEN: sessionStorage.getItem("EQC_Token").toString(),
            CurrentTileID: TileId,
        }, clientConfigdata.CommonMethods.NodeServer + "getIBPriceELN").then((getIBPriceObject) => {

            TileId = getIBPriceObject.CurrentTileID;
            thisTileELN = document.getElementById("td" + getIBPriceObject.CurrentTileID);

            if (flagIB == false) {
                $(thisTileELN).find('[id^="priceELN"]').val(Number(getIBPriceObject.responseData).toFixed(2));
            }

            // Start : Added  for LGTGTWINT-1215 ELN Validation for negative IB Price | Chaitanya M | 27-Jan-2023
            if ($(thisTileELN).find('[id^="priceELN"]').val()<0) { 
                $(thisTileELN).find('[id^="clientYELN"]').val(" ");
                ValidateField($(thisTileELN).find('[id^="priceELN"]').attr("id"), "Price should be positive", thisTileELN); 
                return false;
            } 
            //End
            $(thisTileELN).find('[id^="btnBestPriceELN"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue

        }
        ).catch((error) => {
            console.log(error);
        }
        );
    } catch (er) {
        console.log(er.message);
    } finally { }
}

// Added by AniruddhaJ 11Oct2022

var dialogBoxELN = null;
function emailQuoteELN(that) {
    try {
        thisTileELN = $(that).parents(".sorting")[0];

        let pricingRow = "";
        pricingRow = $(thisTileELN).find("table.pricerTable .pricesRow")[0];
        mapleOrderLoaderStart(thisTileELN); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023

        if (pricingRow.cells[0].innerText.trim().toString() === "-") {
            openValidationpopup('',"No price available for mailing!"); // Changed for Change quote mail validation from "Invalid Price" to "No price available for mailing!" | Ref: LGTGTWINT-1195 | Chaitanya M | 25-jan-2023
            return false;
        }

        //create email pop up here
        let strEmail = ``;

        let emailPriceStream = JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val());
        console.log("email price stream object ", emailPriceStream);

        strEmail = strEmail + `<table class='emailTable'><tr><td class='payOff_Features'>
        <input type='checkbox' class='chkBoxParent_Email_PPCode' onchange='emailParentCheckboxChanged(this)' >
        Issuer</td><td class='payOff_Features'>${globalSolveForValueELN}</td></tr>`;

        for (let e of emailPriceStream) {
            if (e.ELNOUT.trim().toUpperCase() !== "REJECTED" && e.ELNOUT.trim().toUpperCase() !== "" && e.ELNOUT.trim().toUpperCase() !== "UNSUPPORTED") { // Changed the condition for handling Unsupported response | Ref: LGTGTWINT-1321 | Chaitanya M | 06 Feb 2023
                strEmail = strEmail + `<tr><td style='width:40px;padding:15px'><input type='checkbox' class='chkBox_Email_PPCode'  onchange='emailChildrenCheckboxChanged(this)' > ${e.PP_CODE}</td><td style='width:40px;padding:15px'>${e.ELNOUT}</td></tr>`;
            } else {// do nothing
            }
        }
        strEmail = strEmail + `</table>`;

        // Added by Atharva - EQC Timers - START
        var selectedBankIndex = -1;
        var itr = 0;
        //End
        if (dialogBoxELN === null) {
            dialogBoxELN = $(thisTileELN).find('[id^="emailDialog_ELN"]')[0];
            $(thisTileELN).find('[id^="emailDialog_ELN"]').empty().append(strEmail);
          
            $(dialogBoxELN).dialog({                
                resizable: false,
                height: "auto",
                width: 320,
                modal: true,
                open: function (event, ui) { // Added for LGTGTWINT-1283 || Email popup on top change | Chaitanya M | 08 Feb 2023
                    $('.ui-widget.ui-widget-content').css('z-index',999);                    
                },        
                //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                close: function (event, ui){
                    mapleOrderLoaderStop(thisTileELN);
                    //End
                },        
                buttons: {
                    "Mail Quote": function () {
                        //mail single selected rfq

                        //$(this).dialog("close"); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023

                        var Email_PPList = [];
                        var RFQIDList =[];
                        var __mailRFQ=[];

                        if ($(document).find(".ui-dialog").find('[id^="emailDialog_ELN"]').find(".chkBox_Email_PPCode").length > 0) {
                            $(document).find(".ui-dialog").find('[id^="emailDialog_ELN"]').find(".chkBox_Email_PPCode").each(
                                function
                                 (chkIndex, checkboxControl) {
                                if (checkboxControl.checked) {
                                    Email_PPList.push($(checkboxControl).parent().text().trim());

                                    RFQIDList.push(JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val()).filter(function(RFQ_OBJECT){
                                    return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                                    })
                                    )
                                }
                            });
                        }
                        if (Email_PPList.length > 0) {
                            console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);

                            for(let R of RFQIDList){
                                __mailRFQ.push(R[0].EP_ER_QuoteRequestId);
            
                            }

                         //   return true;
                        }
                        if ($(thisTileELN).find('[id^="hdnChartPricesELN"]').val() != undefined && $(thisTileELN).find('[id^="hdnChartPricesELN"]').val().trim() != "")
                            var RFQID =  JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

                        if (RFQID != undefined && RFQID != "") {

                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileELN, "booktradeeln" + thisTileELN.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayeln");
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            }
                            $(this).dialog("close");// Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileELN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({
                                userName: sessionStorage.getItem("EQC_UserName").toString(),
                                rfqId: __mailRFQ.toString(),   //email best price RFQ for now 
                                CurrentTileID: thisTileELN.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType:"English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then((data) => {
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileELN = document.getElementById("td" + TileId);
                                mapleOrderLoaderStop(thisTileELN); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                booktradePopup(thisTileELN, "booktradeeln" + TileId, data.message, "DivOverlayeln");
                            }
                            ).catch((error) => {
                                console.log(error);
                            }
                            );
                        } else {
                            mapleOrderLoaderStop(thisTileELN); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('',"Invalid RFQ ID ");
                        }
                            
                    },
                    "Mail All Quotes": function () {

                        //$(this).dialog("close");// Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023

                        var Email_PPList = [];
                        var RFQIDList =[];
                        var __mailRFQ=[];

                        if ($(document).find(".ui-dialog").find('[id^="emailDialog_ELN"]').find(".chkBox_Email_PPCode").length > 0) {
                            $(document).find(".ui-dialog").find('[id^="emailDialog_ELN"]').find(".chkBox_Email_PPCode").each(
                                function
                                 (chkIndex, checkboxControl) {
                                    // if (checkboxControl.checked)  {
                                    Email_PPList.push($(checkboxControl).parent().text().trim());

                                    RFQIDList.push(JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val()).filter(function(RFQ_OBJECT){
                                    return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                                    })
                                    )
                                    // }
                            });
                        }
                        if (Email_PPList.length > 0) {
                            console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);

                            for(let R of RFQIDList){
                                __mailRFQ.push(R[0].EP_ER_QuoteRequestId);
            
                            }

                         //   return true;
                        }
                        if ($(thisTileELN).find('[id^="hdnChartPricesELN"]').val() != undefined && $(thisTileELN).find('[id^="hdnChartPricesELN"]').val().trim() != "")
                            var RFQID =  JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

                        if (RFQID != undefined && RFQID != "") {

                            if(__mailRFQ == ""){

                                 // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileDRA, "booktradeEQDRA" + thisTileDRA.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayEQDRA");
                                mapleOrderLoaderStop(thisTileELN); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                openValidationpopup('','No price selected for mailing !');
                               //End
                                return false;
                            }
                            $(this).dialog("close");// Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileELN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023

                            request_getDataFromAPI({
                                userName: sessionStorage.getItem("EQC_UserName").toString(),
                                rfqId: __mailRFQ.toString(),   //email best price RFQ for now 
                                CurrentTileID: thisTileELN.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType:"English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then((data) => {
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileELN = document.getElementById("td" + TileId);
                                mapleOrderLoaderStop(thisTileELN); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                booktradePopup(thisTileELN, "booktradeeln" + TileId, data.message, "DivOverlayeln");
                            }
                            ).catch((error) => {
                                console.log(error);
                            }
                            );
                        } else{
                            mapleOrderLoaderStop(thisTileELN); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('',"Invalid RFQ ID ");
                        }

                        return true;

                        //email all quotes here
                    },
                },
            });
            $(dialogBoxELN).dialog("open");
        } else {
            $(document).find(".ui-dialog").find('[id^="emailDialog_ELN"]').empty().append(strEmail);

            $(dialogBoxELN).dialog("open");

            var Email_PPList = [];
            var RFQIDList =[];
            var __mailRFQ=[];

            if ($(document).find(".ui-dialog").find('[id^="emailDialog_ELN"]').find(".chkBox_Email_PPCode").length > 0) {
                $(document).find(".ui-dialog").find('[id^="emailDialog_ELN"]').find(".chkBox_Email_PPCode").each(
                    function
                     (chkIndex, checkboxControl) {
                    if (checkboxControl.checked) {
                        Email_PPList.push($(checkboxControl).parent().text().trim());
                        RFQIDList.push(JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val()).filter(function(RFQ_OBJECT){
                        return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                        })
                        )
                    }
                });
            }
            if (Email_PPList.length > 0) {
                console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);

                for(let R of RFQIDList){
                    __mailRFQ.push(R[0].EP_ER_QuoteRequestId);
                }

             //   return true;
            }
            if ($(thisTileELN).find('[id^="hdnChartPricesELN"]').val() != undefined && $(thisTileELN).find('[id^="hdnChartPricesELN"]').val().trim() != "")
                var RFQID =  JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

            if (RFQID != undefined && RFQID != "") {

                if(__mailRFQ == ""){

                    // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    //booktradePopup(thisTileDRA, "booktradeEQDRA" + thisTileDRA.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayEQDRA");
                    mapleOrderLoaderStop(thisTileELN); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    openValidationpopup('','No price selected for mailing !');
                    //End
                    return false;
                }

                request_getDataFromAPI({
                    userName: sessionStorage.getItem("EQC_UserName").toString(),
                    rfqId: __mailRFQ.toString(),   //email best price RFQ for now 
                    CurrentTileID: thisTileELN.id.match(/\d+$/)[0],
                    "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                    QuoteMailType:"English"
                }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then((data) => {
                    console.log(data);
                    TileId = data.CurrentTileID;
                    thisTileELN = document.getElementById("td" + TileId);
                    mapleOrderLoaderStop(thisTileELN); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    booktradePopup(thisTileELN, "booktradeeln" + TileId, data.message, "DivOverlayeln");
                }
                ).catch((error) => {
                    console.log(error);
                }
                );
            } else{
                mapleOrderLoaderStop(thisTileELN); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                openValidationpopup('',"Invalid RFQ ID ");
            }

        }
        $(thisTileELN).find('[id^="ELNBanksRow"]').children().each(function () {
            if ($(thisTileELN).find('[id^="hdnSelectedBank"]').val() == $(this).find("button").html()) {
                selectedBankIndex = itr;
            }
            itr++;
        });
        console.assert(selectedBankIndex != -1);

    } catch (error) {
        console.log(error);
    
    }
}


function validateOrderELN(thisTileELN,_flag){    // LGTGTWINT-1279 : Instant Pricing : Order booking valdations.

    try{
        
        var selectedBankIndex = -1;
        var itr = 0;
        var isNonBestPrice = false;
        if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
            isNonBestPrice = true;
        } else {
            isNonBestPrice = false;
        }
        if (isNonBestPrice) {
            $(thisTileELN).find('[id^="ELNBanksRow"]').children().each(function () {
                if ($(thisTileELN).find('[id^="hdnSelectedBank"]').val() == $(this).find("button").html()) {
                    selectedBankIndex = itr;
                }
                itr++;
            });
        } else {
            selectedBankIndex = 0;
        }
     
        if (selectedBankIndex == -1) {
            endLoader();
            return false;
        }

     
        if ($(thisTileELN).find('[id^="hdnfinalTokenELN"]').val() == "" || $(thisTileELN).find('[id^="ELNPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileELN).find('[id^="ELNPrices"]')[0].firstChild.innerHTML == "") {
            if(_flag == false){
                _validateOrderEQC = true; 
            }
           ValidateField($(thisTileELN).find('[id^="hdnChartPricesELN"]').val().attr("id"), "Order Execution Failed!", thisTileELN);
           return false;
        }
        // Check For Negative prices // CFINT-927 // 10-Sep-2020

        if (Number(JSON.parse($(thisTileELN).find('[id^="hdnChartPricesELN"]').val())[selectedBankIndex].ELNOUT) <= 0) {
            if(_flag == false){

                _validateOrderEQC = true; 
            }
            ValidateField($(thisTileELN).find('[id^="hdnChartPricesELN"]').val().attr("id"), "Prices can not be negative 0r zero, Order Execution Failed!", thisTileELN);
            return false;
        }

    }catch(er){

        console.log(er.message);
    }
}


function calculateDays(_maturidydate, _settl_Date,thisTIle, parentid){
    try {
        var date =
        new Date(_maturidydate).getTime() - new Date(_settl_Date).getTime();
        NoofDays = date / (1000 * 3600 * 24);
        
        $(thisTIle).find('[id^="' + parentid + '"]').val(NoofDays); // Changed for New UI || LGTGTWINT-980 || Chaitanya M || 06 Feb 2023

    } catch (error) {
        console.log(error.message());
    }
}

//added for LGTGTWINT-1560 | Chaitanya M | 28 Feb 2023
function checkdates(thistile,currId){
  try {
    var date_setlement =$(thistile).find('[id^="SettlDate_ELN"]').val();
    var date_expiry = $(thistile).find('[id^="ExpiryDate_ELN"]').val();
    var date_maturity = $(thistile).find('[id^="Maturity_ELN"]').val();

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }    
    if (mm < 10) {
      mm = '0' + mm;
    }         
    today = yyyy + '-' + mm + '-' + dd;
        
   // LGTGTWINT-1638 | Chaitanya M | 5 July 2023
    if(Date.parse(date_setlement) <= today ){
        ValidateField(currId,"Please enter valid Settlement date.",thistile); 
        return false;
    }
    if(Date.parse(date_maturity) <= Date.parse(date_expiry)){
        ValidateField(currId,"Please enter valid Maturity date.",thistile); 
        return false;
    }   
    if(Date.parse(date_expiry) <= Date.parse(date_setlement)){
        ValidateField(currId,"Please enter valid Expiry date.",thistile); 
        return false;
    } 
    //End
     
     
  } catch (error) {
    
  }
}
//end

function validatedatesELN(currId,field_id){
    try {
        thisTileELN = document.getElementById("td" + currId);
   
   let ReqEQCELNDates ={
    "UserName": sessionStorage.getItem("EQC_UserName").toString(),     
    "Share": $(thisTileELN).find('[id^="ELNSharesDemo"]').val(),   
    "QuantoCcy": $(thisTileELN).find('[id^="NoteCCY_ELN"]').val(),  
    "BaseCcy": $(thisTileELN).find('[id^="ShareCCY_ELN"]').text(), 
    "Exchange": getExchangeAndCcyFromBasket("", "exchange", $(thisTileELN).find('[id^="ELNSharesDemo"]').val().trim())[0],
    "MaturityDate": $(thisTileELN).find('[id^="ELN_Maturity"]').text(),
    "ExpiryDate": $(thisTileELN).find('[id^="ELN_ExpiryDate"]').text(),
    "TradeDate": GLOBAL_TRADE_DATE,
    "SettlmentDate": $(thisTileELN).find('[id^="ELN_SettlDate"]').text(),   
    "EQC_TOKEN":sessionStorage.getItem("EQC_Token").toString()
    }

        request_getDataFromAPI(ReqEQCELNDates, clientConfigdata.CommonMethods.NodeServer + "ELNHolidaysIP").then(data => { 

        if(data.message.toUpperCase() == "WARNING"){
          
            ValidateField(currId,  data.responseData,thisTileELN); 
            return false;
        } 
        $(thisTileELN).find('[id^="' + field_id + '"]').removeClass("ValidateFieldCSS");
               
        });

    } catch (error) {
        console.log(error.message);
    }
  }

//  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.

  function changeSolveForELN(solveFor, thisTileELN, calledFromIndexELN) {
    try {
        if (calledFromIndexELN != undefined) {
            if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                $(thisTileELN).find("[id^='upfrontELN']").prop("disabled", false); 
                $(thisTileELN).find("[id^='strikeipboxELN']").prop("disabled", true);
                $(thisTileELN).find("[id^='priceELN']").prop("disabled", true); 
                $(thisTileELN).find("[id^='clientYELN']").show();
                $(thisTileELN).find("[id^='lblYield']").show();
                // loadELNTenorValues(thisTileELN); //  Chaitanya M 4 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                checkKOKITypeELN($(thisTileELN).find('[id^="ddlELNCFreq"]').val(), thisTileELN,true); //  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
            } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                $(thisTileELN).find("[id^='priceELN']").val("0.00").prop("disabled", true); 
                $(thisTileELN).find("[id^='strikeipboxELN']").prop("disabled", false);
                $(thisTileELN).find("[id^='upfrontELN']").prop("disabled", false); 
                $(thisTileELN).find("[id^='clientYELN']").hide();
                $(thisTileELN).find("[id^='lblYield']").hide();
                checkKOKITypeELN($(thisTileELN).find('[id^="ddlELNCFreq"]').val(), thisTileELN,true); //  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
            }
        } else {
            if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                $(thisTileELN).find("[id^='upfrontELN']").prop("disabled", false);
                $(thisTileELN).find("[id^='strikeipboxELN']").prop("disabled", true);
                $(thisTileELN).find("[id^='priceELN']").prop("disabled", true); 
                $(thisTileELN).find("[id^='clientYELN']").show();
                $(thisTileELN).find("[id^='clientYELN']");
                $(thisTileELN).find("[id^='lblYield']").show();
                //loadELNTenorValues(thisTileELN); //  Chaitanya M 4 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                checkKOKITypeELN($(thisTileELN).find('[id^="ddlELNCFreq"]').val(), thisTileELN,true);
            } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                $(thisTileELN).find("[id^='priceELN']").val("0.00").prop("disabled", true); 
                $(thisTileELN).find("[id^='strikeipboxELN']").prop("disabled", false);
                $(thisTileELN).find("[id^='upfrontELN']").prop("disabled", false);
                $(thisTileELN).find("[id^='clientYELN']").hide();
                $(thisTileELN).find("[id^='lblYield']").hide();
                checkKOKITypeELN($(thisTileELN).find('[id^="ddlELNCFreq"]').val(), thisTileELN,true);  //  Chaitanya M 4 April-2023 || Added for LGTGTWINT-1822 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                flagIB = false;
            }
        }
    } catch (error) {
        console.log(error);
    }
}