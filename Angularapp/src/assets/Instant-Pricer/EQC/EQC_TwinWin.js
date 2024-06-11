var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var ContractAmtTwinWin;
var CouponFreq;
var tempShareName;
var arrTwinWin = [];
var maxTwinWin;
var finalResponseDataTwinWin;
var finalTokenTwinWin;
var repriceObjectTwinWin;
var TimerTwinWin = 0;
var finalObjTwinWin;
var getddlList;
var idTwinWin = 28;
var dateObj = ""
var globalDefaultSharesArrayTwinWin = ["NFLX.OQ", "MSFT.OQ", "AMZN.OQ"];  //LGTGTWINT-1723 Instant Pricer : Remove FB.OQ ticker from default notes payoff's.

// To load the TwinWin tile 
function onLoadTwinWin(currId,isProductCopiedTwinWin) {
    try {
      
        setDeafaultValuesTwinWin(currId,isProductCopiedTwinWin);
        thisTileTwinWin = document.getElementById("td" + currId);
        $(thisTileTwinWin).find('[id^="OverlayDiv"]').hide();

        sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        $(thisTileTwinWin).find('[id^="btnBestPriceTwinWin"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 25 July 2023
        $(thisTileTwinWin).find('[id^="btnEmailQuote"]').attr("disabled", true);
        $(thisTileTwinWin).find('[id^="BookTradeTwinWin"]').attr("disabled", true);           
        $(thisTileTwinWin).find('[id^="OrderEmail"]').attr("disabled",true);
        //ENd
        // clearInterval($(thisTileTwinWin).find('[id^="hdnintervalID"]').val());  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileTwinWin,'[id^="btnBestPriceTwinWin"]', false);
        clearPricerTable(thisTileTwinWin);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileTwinWin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
        $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html("");
        //end

        $(thisTileTwinWin).find("div.card input[type='text'],div.card input[type='search'],div.card select").on('change', function () {

            thisTileTwinWin = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileTwinWin).find('[id^="btnBestPriceTwinWin"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileTwinWin).find('[id^="hdnintervalID"]').val());
           $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileTwinWin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html("");
            //End

            clearPricerTable(thisTileTwinWin);
            mapleLoaderStop(thisTileTwinWin,'[id^="btnBestPriceTwinWin"]', false);  // Added Loader function ||
            $(thisTileTwinWin).find('[id^="btnEmailQuote"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileTwinWin).find('[id^="BookTradeTwinWin"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileTwinWin).find('[id^="OrderEmail"]').attr("disabled",true);//LGTGTWINT-1981 || RizwanS || 12 May 2023   
        })
 
         $(thisTileTwinWin).find(" div.card .amtPopup").on('select', function () {  // INT1FIN47-768 Gateway Markets Instant Pricing issue
 
             thisTileTwinWin = $(this).parents('.sorting')[0];
             sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
             $(thisTileTwinWin).find('[id^="btnBestPriceTwinWin"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
             clearInterval($(thisTileTwinWin).find('[id^="hdnintervalID"]').val());
            $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
             clearPricerTable(thisTileTwinWin);

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileTwinWin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html("");
            //End

             mapleLoaderStop(thisTileTwinWin,'[id^="btnBestPriceTwinWin"]', false);
             $(thisTileTwinWin).find('[id^="btnEmailQuote"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
             $(thisTileTwinWin).find('[id^="BookTradeTwinWin"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
             $(thisTileTwinWin).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023 
             
          })


        $(thisTileTwinWin).find('[id^="ddlKOKIType"]').on("change", function() {
            try {
             
            thisTileTwinWin = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileTwinWin,"btnBestPriceTwinWin");    
           $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val("");
           //End
            validation_clear(); //To Remove highlighted part if no error 
            checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val().trim(), thisTileTwinWin);

            } catch (error) {
                console.log(error.message);
            }
        });
        //aded by rutika on 26/04/2022 for calculating tenor when changed in input box
         //Start

        $(thisTileTwinWin).find('[id^="tenor_TwinWin"]').on("change", function() {
            try {
        
            thisTileTwinWin = $(this).parents(".sorting")[0];
            let currId=   thisTileTwinWin.id.match(/\d+$/)[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileTwinWin,"btnBestPriceTwinWin");    
            $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val("");
            //End
            if( $(thisTileTwinWin).find('[id^="tenorddl"]').val() == "M"){

                if(Number($(this).parents(".sorting").find('[id^="tenor_TwinWin"]').val()) > Number(FCNAllowedTenorinMonths) || $(this).parents(".sorting").find('[id^="tenor_TwinWin"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_TwinWin"]').val() == ""){
                    ValidateField($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').attr("id"), "Please enter valid tenor.", thisTileTwinWin);
                    return false;
                }
            } else{
                 if(Number($(this).parents(".sorting").find('[id^="tenor_TwinWin"]').val()) > Number(TwinWinAllowedTenorinYears) || $(this).parents(".sorting").find('[id^="tenor_TwinWin"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_TwinWin"]').val() == ""){
                    ValidateField($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').attr("id"), "Please enter valid tenor.", thisTileTwinWin);
                    return false;
                }
            }
            // calculateTenor(currId); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023            

            }   catch (error) {
                console.log(error.message);
            }
        });


        $(thisTileTwinWin).find('[id^="tenorddl"]').on("change", function () {
            try {
                
                thisTileTwinWin = $(this).parents(".sorting")[0];
                let currId=   thisTileTwinWin.id.match(/\d+$/)[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileTwinWin,"btnBestPriceTwinWin");    
                $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val("");
                //End
                if( $(thisTileTwinWin).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_TwinWin"]').val()) > Number(FCNAllowedTenorinMonths)){
                        ValidateField($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').attr("id"), "Please enter valid tenor.", thisTileTwinWin);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_TwinWin"]').val()) > Number(TwinWinAllowedTenorinYears)){
                        ValidateField($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').attr("id"), "Please enter valid tenor.", thisTileTwinWin);
                        return false;
                    }
                }
    
            // calculateTenor(currId); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023                
               
            } catch (error) {
                console.log(error);
            }
        });

        //End
        
        checkSolveForTwinWin($(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val(), thisTileTwinWin)

        $(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').on('change', function (event) {
            thisTileTwinWin = $(this).parents('.sorting')[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileTwinWin,"btnBestPriceTwinWin");    
           $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val("");
           //End
           ChangeSolveForTwinWin($(this).val(), thisTileTwinWin); //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.

        });

        shareCount = 0;
        $(thisTileTwinWin).find('[id^="shareDivTwinWin"]').click(function () {
            $(this).find('input[type="search"]').focus();
        });

        // Check for upfront/IB Price 

           $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').on("change", function() {
            try {
             
            thisTileTwinWin = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileTwinWin,"btnBestPriceTwinWin");    
           $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val("");
           //End

            if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

                let _ibprice =   parseFloat(100 -  Number($(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').val())).toFixed(2);;

                $(thisTileTwinWin).find('[id^="IBPriceipbox"]').val(_ibprice);

            }

            } catch (error) {
                console.log(error.message);
            }
        });

        $(thisTileTwinWin).find('[id^="IBPriceipbox"]').on("change", function() {
            try {
             
            thisTileTwinWin = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileTwinWin,"btnBestPriceTwinWin");    
           $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val("");
           //End

            if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

                let _upfront =  parseFloat(100 -  Number($(thisTileTwinWin).find('[id^="IBPriceipbox"]').val())).toFixed(2);

                $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').val(_upfront);

            }

            } catch (error) {
                console.log(error.message);
            }
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        //Start
        $(thisTileTwinWin).find('.ddlShares').on("focusout", function (){   
        
            //Added for LGTGTWINT-1292 | Chaitanya M | 28 Feb 2023
            _ccylistTwinWin = getExchangeAndCcyFromBasket($(thisTileTwinWin).find('[id^="shareDivTwinWin"]')[0], 'share')
            listnames = _ccylistTwinWin;
            if(_ccylistTwinWin.length >=4){
                return false;
            } 
        validatesharebasket(thisTileTwinWin,"shareNameTwinWin");  
        sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]);
        EQCResetPayoff(thisTileTwinWin,"btnBestPriceTwinWin");    
       $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
        $(thisTileTwinWin).find('[id^="btnEmailQuote"]').attr("disabled", true);// added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
        $(thisTileTwinWin).find('[id^="BookTradeTwinWin"]').attr("disabled", true);// added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023     
        $(thisTileTwinWin).find('[id^="OrderEmail"]').attr("disabled",true);//LGTGTWINT-1981 || RizwanS || 12 May 2023  
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        $(thisTileTwinWin).find("div.card .ddlShares").on("keydown", function(){
        
            $("#bodyDiv").hide();
            sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileTwinWin,"btnBestPriceTwinWin");   

           $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileTwinWin).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileTwinWin).find('[id^="BookTradeTwinWin"]').attr("disabled", true);           
            $(thisTileTwinWin).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023 
        });
     
        //End
        //Added for LGTGTWINT-1077 Instant Pricing: Input length for all fields for all payoffs | Chaitanya M | 28-01-2023
        $(thisTileTwinWin).find('[id^="tenor_TwinWin"]').on("keyup", function (){            

             InputLengthCheckEQC(thisTileTwinWin, "tenor_TwinWin",3); 
        });

        $(thisTileTwinWin).find("[id^='strikeipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileTwinWin, "strikeipbox",8); //Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            $(thisTileTwinWin).find('[id^="EQCRfqidpnl"]').hide();
            $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileTwinWin).find("[id^='txtupfrontTwinWin']").on("keyup", function(){
             InputLengthCheckEQC(thisTileTwinWin, "txtupfrontTwinWin",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
    
        });

        $(thisTileTwinWin).find("[id^='kiinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileTwinWin, "kiinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileTwinWin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileTwinWin).find("[id^='koinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileTwinWin, "koinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileTwinWin).find('[id^="EQCRfqidpnl"]').hide();//LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html("");
            //End

        });
        
        $(thisTileTwinWin).find("[id^='couponipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileTwinWin, "couponipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileTwinWin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileTwinWin).find("[id^='IBPriceipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileTwinWin, "IBPriceipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
        
        });

        $(thisTileTwinWin).find("[id^='noncallinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileTwinWin, "noncallinputbox",3);
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileTwinWin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        //Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
        $(thisTileTwinWin).find('[id^="ContractAmtTwinWin"]').on("change", function(){
            thisTileTwinWin = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileTwinWin,"btnBestPriceTwinWin");    
           $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val("");
           //End
          if($(thisTileTwinWin).find('[id^="ContractAmtTwinWin"]').val() == ""){
            $(thisTileTwinWin).find('[id^="ContractAmtTwinWin"]').val("0");
            return false; 
          }    
                  
        });        
       
        //End

    } catch (error) {
        console.log(error.message)
    }
}

// To set default values for TwinWin
function setDeafaultValuesTwinWin(currId,isProductCopiedTwinWin) {
    try {
        // Added logic for getting current tile : Onkar E.//
        thisTileTwinWin = document.getElementById("td" + currId);


        //Configured UI fileds Start :: || 08 Feb 2023

        // if(DRAFCNUpfrontYN.toUpperCase() == "YES" || DRAFCNUpfrontYN.toUpperCase().includes("Y")){

        //     $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').val("0.00"); // defualt value
        //     $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').hide(); //UI filed
        //     // $(thisTileTwinWin).find('[id^="upfrontuilbl"]').hide(); //UI label
        //     $(thisTileTwinWin).find('[id^="txtupfrontlbl"]').hide(); // hide label order popup
        //     $(thisTileTwinWin).find('[id^="txtupfrontVal"]').hide(); //Order popup filed
            
        // }else{
            $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').val("0.00");
        // }

        // END

        $(thisTileTwinWin).find('[id^="ContractAmtTwinWin"]').val("1,000,000.00");
        $(thisTileTwinWin).find("[id^='ContractAmtTwinWin']").attr('maxlength','14');
        $(thisTileTwinWin).find('[id^="strikeipbox"]').val("92.00");
        $(thisTileTwinWin).find('[id^="couponipbox"]').val("8.00");
        $(thisTileTwinWin).find('[id^="noncallinputbox"]').val("1");
        $(thisTileTwinWin).find('[id^="tenor_TwinWin"]').val("6");
        $(thisTileTwinWin).find('[id^="IBPriceipbox"]').val("0.00"); //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
        $(thisTileTwinWin).find('[id^="kiinputbox"]').val("65.00");//Chaitanya M 4-April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        $(thisTileTwinWin).find('[id^="koinputbox"]').val("105.00");//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        $(thisTileTwinWin).find('[id^="Guaranteeipbox"]').val("1");
        $(thisTileTwinWin).find('[id^="KOStepDowninputbox"]').val("1");
        
        callDropDownFunction($(thisTileTwinWin).find('[id^="shareName"]'), "TwinWin", currId);
        EQProductsFillCcy(thisTileTwinWin, "ddlTwinWinCcy");
        clearPricerTable(thisTileTwinWin);
        $(thisTileTwinWin).find('[id^="shareNameCntrlTwinWin"]').html("");
        $(thisTileTwinWin).find('[id^="hiddenshareinputTwinWin"]').html("");
        $(thisTileTwinWin).find('[id^="CCY_TwinWin"]').html("");

        if(!isProductCopiedTwinWin){
        for (let s=0;s<clientConfigdata.EQCTwinWin.MinSharesInBaskets;s++){
            createElementInBasket(thisTileTwinWin, 'shareDivTwinWin', sessionStorage.getItem(thisTileTwinWin.id)!=undefined?sessionStorage.getItem(thisTileTwinWin.id).split(" ")[s]:globalDefaultSharesArrayTwinWin[s]); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
       
        }
    }
       
        $(thisTileTwinWin).find('[id^="shareName"]')[0].placeholder = "";
        $(thisTileTwinWin).find('[id^="CCY_TwinWin"]').html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);


        

    } catch (error) {
        console.log(error.message)
    }
}

function checkSolveForTwinWin(solveFor, thisTileTwinWin,calledFromIndexTwinWin) {
    try {
        if (calledFromIndexTwinWin != undefined){
                if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                    $(thisTileTwinWin).find('[id^="strikeipbox"]').prop('disabled', true);
                    $(thisTileTwinWin).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTileTwinWin).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').prop('disabled', false);
                    // checkupfrontPriceTwinWin(thisTileTwinWin); //LGTGTWINT-1095
                    checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val(), thisTileTwinWin, calledFromIndexTwinWin)
                } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                    $(thisTileTwinWin).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTileTwinWin).find('[id^="IBPriceipbox"]').prop('disabled', true); ////LGTGTWINT-1095
                    $(thisTileTwinWin).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').prop('disabled', true); ////LGTGTWINT-1095
                    // checkupfrontPriceTwinWin(thisTileTwinWin);  //LGTGTWINT-1095
                    checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val(), thisTileTwinWin, calledFromIndexTwinWin)
                } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                    $(thisTileTwinWin).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTileTwinWin).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTileTwinWin).find('[id^="couponipbox"]').prop('disabled', true);
                    $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').prop('disabled', false); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for TwinWin and DRA
                    // checkupfrontPriceTwinWin(thisTileTwinWin);  //LGTGTWINT-1095
                    checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val(), thisTileTwinWin, calledFromIndexTwinWin)
                }
        }
        else {
            if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                $(thisTileTwinWin).find('[id^="strikeipbox"]').prop('disabled', true);
                $(thisTileTwinWin).find('[id^="IBPriceipbox"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                $(thisTileTwinWin).find('[id^="couponipbox"]').val("8.00").prop('disabled', false);
                $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                // checkupfrontPriceTwinWin(thisTileTwinWin);  //LGTGTWINT-1095
                checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val(), thisTileTwinWin)
            } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                $(thisTileTwinWin).find('[id^="strikeipbox"]').val("92.00").prop('disabled', false);
                $(thisTileTwinWin).find('[id^="IBPriceipbox"]').prop('disabled', true);
                $(thisTileTwinWin).find('[id^="couponipbox"]').val("8.00").prop('disabled', false);
                $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').prop('disabled', true); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for TwinWin and DRA
                // checkupfrontPriceTwinWin(thisTileTwinWin);  //LGTGTWINT-1095
                checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val(), thisTileTwinWin)
            } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                $(thisTileTwinWin).find('[id^="strikeipbox"]').val("92.00").prop('disabled', false);
                $(thisTileTwinWin).find('[id^="IBPriceipbox"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                $(thisTileTwinWin).find('[id^="couponipbox"]').prop('disabled', true);
                $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val(), thisTileTwinWin);
                // checkupfrontPriceTwinWin(thisTileTwinWin);  //LGTGTWINT-1095

            }

    }
    } catch (error) {
    }
}
function checkKOKITypeTwinWin(KOKIType, thisTileTwinWin, calledFromIndex) {
    try {
        if(calledFromIndex != true){
        if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
            $(thisTileTwinWin).find('[id^="koinputbox"]').prop('disabled', false); //Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileTwinWin).find('[id^="kiinputbox"]').prop("disabled", true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileTwinWin).find('[id^="noncallinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        }  else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
            $(thisTileTwinWin).find('[id^="koinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileTwinWin).find('[id^="kiinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileTwinWin).find('[id^="noncallinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
            $(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled", true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileTwinWin).find('[id^="kiinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileTwinWin).find('[id^="noncallinputbox"]').prop('disabled', true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        } else if (KOKIType == "NOKINOKO") {
            $(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled", true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileTwinWin).find('[id^="kiinputbox"]').prop('disabled', true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileTwinWin).find('[id^="noncallinputbox"]').prop('disabled', true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        }
        }else{
            if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
                $(thisTileTwinWin).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTileTwinWin).find('[id^="kiinputbox"]').prop("disabled", true);
                $(thisTileTwinWin).find('[id^="noncallinputbox"]').prop('disabled', false);
            } else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
                $(thisTileTwinWin).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTileTwinWin).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileTwinWin).find('[id^="noncallinputbox"]').prop('disabled', false);
            } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
                $(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTileTwinWin).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileTwinWin).find('[id^="noncallinputbox"]').prop('disabled', true);
            } else if (KOKIType == "NOKINOKO") {
                $(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTileTwinWin).find('[id^="kiinputbox"]').prop('disabled', true);
                $(thisTileTwinWin).find('[id^="noncallinputbox"]').prop('disabled', true);
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

function checkupfrontPriceTwinWin(thisTileTwinWin){

    try{

        let _ibprice =   parseFloat(100 -  Number($(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').val())).toFixed(2);;

        $(thisTileTwinWin).find('[id^="IBPriceipbox"]').val(_ibprice);
    
        let _upfront =  parseFloat(100 -  Number($(thisTileTwinWin).find('[id^="IBPriceipbox"]').val())).toFixed(2);
    
        $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').val(_upfront);

    }catch(er){
        
        console.log(er.message);

    }
    

}

var globalSolveForValueTwinWin='';
// To get best price for TwinWin
function getBestPriceTwinWin(that) {
    try {
       

        thisTileTwinWin = $(that).parents(".sorting")[0];
        
        console.log('Start Interval value =' + $(thisTileTwinWin).find('[id^="hdnintervalID"]').val());

        $(thisTileTwinWin).find('[id^="btnBestPriceTwinWin"]').attr("disabled", true); // INT1FIN47-768 Gateway Markets Instant Pricing issue

        var requestIDTwinWin = "";

        requestIDTwinWin = requestIDTwinWin + RequestIDGenerator(60);

        $(thisTileTwinWin).find('[id^="hdnRequestID"]').val(requestIDTwinWin);  //INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileTwinWin,'[id^="btnBestPriceTwinWin"]', false);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        $(thisTileTwinWin).find('[id^="EQCRfqidpnl"]').hide();
        $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html("");
        //End

        globalSolveForValueTwinWin = $(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val().trim();

        clearInterval($(thisTileTwinWin).find('[id^="hdnintervalID"]').val());

        console.log('After clear Interval value =' + $(thisTileTwinWin).find('[id^="hdnintervalID"]').val());

        $(thisTileTwinWin).find('[id^="hdnintervalID"]').val("");


        TileId = that.id.match(/\d+$/)[0];

        sessionStorage.setItem("poolingTimer_" + TileId, 0);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        thisTileTwinWin = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        console.log(TileId, thisTileTwinWin, productName);
        getddlList = $.trim($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val());

        $(thisTileTwinWin).find('[id^="TBLTwinWin"]' + " td").each(function () {
            //Clear prices || Tina K || 11-Sep-2019
            $(this).html("-");
        })
        validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
        clearPricerTable(thisTileTwinWin); //To clear prices after clicking best price || Tina K || 20-Nov-2019
        //Validation conditions added : Tina Kshirsagar : 6-09-2019

        
        let tenorNumb = $(thisTileTwinWin).find("[id^='tenor_TwinWin']").val();
        let tenorstring = $(thisTileTwinWin).find("[id^='tenorddl']").val();
        let _tenor = tenorNumb + tenorstring;

        let _tenorinMonths = "";

        if(tenorstring != "M"){

            _tenorinMonths =  parseFloat($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').val()) * 12;

        }else{

            _tenorinMonths =  parseFloat($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').val());
        }
        
        if ($(thisTileTwinWin).find('[id^="shareDivTwinWin"]')[0].childNodes.length <= 1) {     
            ValidateField($(thisTileTwinWin).find('[id^="shareDivTwinWin"]').attr('id'), "Please Enter Valid Shares", thisTileTwinWin);
            return false  
        } else if ($.trim($(thisTileTwinWin).find('[id^="ContractAmtTwinWin"]').val()) == '' || parseFloat($(thisTileTwinWin).find('[id^="ContractAmtTwinWin"]').val()) < 0) {
            ValidateField($(thisTileTwinWin).find('[id^="ContractAmtTwinWin"]').attr('id'), "Please Enter Valid Notional", thisTileTwinWin); // LGTGTWINT-1487 | Chaitanya M | 24 Feb 2023
            return false
        } else if ($.trim($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').val()) == '' || parseFloat($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').val()) <=0) {
            ValidateField($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').attr('id'), "Please enter valid tenor", thisTileTwinWin);
            return false
        }else if ($.trim($(thisTileTwinWin).find('[id^="ddlTwinWinCcy"]').val()) == '') {
            ValidateField($(thisTileTwinWin).find('[id^="ddlTwinWinCcy"]').attr('id'), "Please Select Valid Ccy", thisTileTwinWin);
            return false
        } else if ((parseFloat($(thisTileTwinWin).find('[id^="koinputbox"]').val()) == "" || parseFloat($(thisTileTwinWin).find('[id^="koinputbox"]').val()) <= Number(DRAFCNMinKO) || parseFloat($(thisTileTwinWin).find('[id^="koinputbox"]').val()) > Number(DRAFCNMaxKO)) && $(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled") != true) {
            ValidateField($(thisTileTwinWin).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO (%) Initial.", thisTileTwinWin);
            return false;
        } else if ((parseFloat($(thisTileTwinWin).find('[id^="kiinputbox"]').val()) == "" || parseFloat($(thisTileTwinWin).find('[id^="kiinputbox"]').val()) <= 0) && $(thisTileTwinWin).find('[id^="kiinputbox"]').prop("disabled") != true) {
            ValidateField($(thisTileTwinWin).find('[id^="kiinputbox"]').attr("id"), "Please Enter Valid KI (%)", thisTileTwinWin);
            return false;
        } 
        // else if (($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "3M")) {
        //     ValidateField($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTileTwinWin);
        //     return false;
        // } else if (($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "QUARTERLY" || $(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "1M")) {
        //     ValidateField($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTileTwinWin);
        //     return false;
        // } else if (($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "9M")) {
        //     ValidateField($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTileTwinWin);
        //     return false;
        // }  else if (($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "6M")) {
        //     ValidateField($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTileTwinWin);
        //     return false;
        // } 
        else if($(thisTileTwinWin).find('[id^="noncallinputbox"]').val() <= 0 || $(thisTileTwinWin).find('[id^="noncallinputbox"]').val() == "") {
            ValidateField($(thisTileTwinWin).find('[id^="noncallinputbox"]').attr("id"), "Non Call can not be zero negative. ", thisTileTwinWin);
            return false; 
        } 
        // else if($(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "MONTHLY")){
        //     if(parseFloat($(thisTileTwinWin).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths)){
        //         ValidateField($(thisTileTwinWin).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileTwinWin);
        //         return false;
        //     }
        // } else if($(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY")){
        //     if(parseFloat($(thisTileTwinWin).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 2)){
        //         ValidateField($(thisTileTwinWin).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileTwinWin);
        //         return false;
        //     }
        // } else if($(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "QUARTERLY")){
        //     if(parseFloat($(thisTileTwinWin).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 3)){
        //         ValidateField($(thisTileTwinWin).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileTwinWin);
        //         return false;
        //     }
        // } else if($(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY")){
        //     if(parseFloat($(thisTileTwinWin).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 6)){
        //         ValidateField($(thisTileTwinWin).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileTwinWin);
        //         return false;
        //     }
        // } else if($(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY")){
        //     if(parseFloat($(thisTileTwinWin).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 12)){
        //         ValidateField($(thisTileTwinWin).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileTwinWin);
        //         return false;
        //     }
        // }

        
        if ($(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val().trim().toUpperCase() == "DIGITAL_STRIKE") {
            if (parseFloat($(thisTileTwinWin).find('[id^="IBPriceipbox"]').val()) == "" || parseFloat($(thisTileTwinWin).find('[id^="IBPriceipbox"]').val()) <= 0 || parseFloat($(thisTileTwinWin).find('[id^="IBPriceipbox"]').val()) > 100) {
                ValidateField($(thisTileTwinWin).find('[id^="IBPriceipbox"]').attr("id"), "Price % must be greater than 0 and less than 100", thisTileTwinWin);
                return false;
            } else if (parseFloat($(thisTileTwinWin).find('[id^="couponipbox"]').val()) == "" || parseFloat($(thisTileTwinWin).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileTwinWin).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileTwinWin).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon (%)", thisTileTwinWin);
                return false;
            }else if ($(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileTwinWin).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileTwinWin).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileTwinWin).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileTwinWin).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%)", thisTileTwinWin);
                return false;
            }
        } else if ($(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val().trim().toUpperCase() == "COUPON") {
            if (parseFloat($(thisTileTwinWin).find('[id^="strikeipbox"]').val()) == "" || parseFloat($(thisTileTwinWin).find('[id^="strikeipbox"]').val()) <= 0 || parseFloat($(thisTileTwinWin).find('[id^="strikeipbox"]').val()) > 100) {
                ValidateField($(thisTileTwinWin).find('[id^="strikeipbox"]').attr("id"), " Strike % must be greater than 0 and less than or equal to 100.", thisTileTwinWin);
                return false;
            } else if (parseFloat($(thisTileTwinWin).find('[id^="IBPriceipbox"]').val()) == "" || parseFloat($(thisTileTwinWin).find('[id^="IBPriceipbox"]').val()) <= 0 || parseFloat($(thisTileTwinWin).find('[id^="IBPriceipbox"]').val()) > 100) {
                ValidateField($(thisTileTwinWin).find('[id^="IBPriceipbox"]').attr("id"), "Price % must be greater than 0 and less than 100", thisTileTwinWin);
                return false;
            } else if ($(thisTileTwinWin).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileTwinWin).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileTwinWin).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileTwinWin).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%)", thisTileTwinWin);
                return false;
            }else if ($(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled") != true && (parseFloat($(thisTileTwinWin).find('[id^="strikeipbox"]').val()) > parseFloat($(thisTileTwinWin).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileTwinWin).find('[id^="strikeipbox"]').attr("id"),"Strike (%) should be less than KO (%)", thisTileTwinWin);
                return false;
            }else if ($(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileTwinWin).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileTwinWin).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileTwinWin).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileTwinWin).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%)", thisTileTwinWin);
                return false;
            }
        } else if ($(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val().trim().toUpperCase() == "PRICE") {
            if (parseFloat($(thisTileTwinWin).find('[id^="strikeipbox"]').val()) == "" || parseFloat($(thisTileTwinWin).find('[id^="strikeipbox"]').val()) <= 0 || parseFloat($(thisTileTwinWin).find('[id^="strikeipbox"]').val()) > 100) {
                ValidateField($(thisTileTwinWin).find('[id^="strikeipbox"]').attr("id"), " Strike % must be greater than 0 and less than or equal to 100.", thisTileTwinWin);
                return false;
            } else if (parseFloat($(thisTileTwinWin).find('[id^="couponipbox"]').val()) == "" ||parseFloat($(thisTileTwinWin).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileTwinWin).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileTwinWin).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon (%)", thisTileTwinWin);
                return false;
            } else if ($(thisTileTwinWin).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileTwinWin).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileTwinWin).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileTwinWin).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%)", thisTileTwinWin);
                return false;
            }else if ($(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled") != true && (parseFloat($(thisTileTwinWin).find('[id^="strikeipbox"]').val()) > parseFloat($(thisTileTwinWin).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileTwinWin).find('[id^="strikeipbox"]').attr("id"),"Strike (%) should be less than KO (%)", thisTileTwinWin);
                return false;
            }else if ($(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileTwinWin).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileTwinWin).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileTwinWin).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileTwinWin).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%)", thisTileTwinWin);
                return false;
        } //Validation End
        }


         // Added by RizwanS for tenor validation before pricing || 03 Jan 2022 ||

         if( $(thisTileTwinWin).find('[id^="tenorddl"]').val() == "M"){

            if(Number($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').val()) > Number(FCNAllowedTenorinMonths)){
                ValidateField($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').attr("id"), "Please enter valid tenor.", thisTileTwinWin);
                return false;
            }

        } else{

             if(Number($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').val()) > Number(TwinWinAllowedTenorinYears)){
                ValidateField($(thisTileTwinWin).find('[id^="tenor_TwinWin"]').attr("id"), "Please enter valid tenor.", thisTileTwinWin);
                return false;
            }
        }
        
        // END

        $("body").css("opacity", "0.9");

    
        if ($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val() == "NOKIKODC") {
            KIPerc = "";
            KIType = "";
            KOPerc = $(thisTileTwinWin).find('[id^="koinputbox"]').val();
            KOType = "American";

        } else if ($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val() == "NOKIKOPE") {
            KIPerc = "";
            KIType = "";
            KOPerc = $(thisTileTwinWin).find('[id^="koinputbox"]').val();
            KOType = "European";

        } else if ($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val() == "KIDCKODC") {
            KIPerc = $(thisTileTwinWin).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileTwinWin).find('[id^="koinputbox"]').val();
            KIType = "American";
            KOType = "American";
        
        } else if ($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val() == "KIDCKOPE") {
            KIPerc = $(thisTileTwinWin).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileTwinWin).find('[id^="koinputbox"]').val();
            KIType = "American";
            KOType = "European";

        } else if ($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val() == "KIEURKODC") {
            KIPerc = $(thisTileTwinWin).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileTwinWin).find('[id^="koinputbox"]').val();
            KIType = "European";
            KOType = "American";

        } else if ($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val() == "KIEURKOPE") {
            KIPerc = $(thisTileTwinWin).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileTwinWin).find('[id^="koinputbox"]').val();
            KIType = "European";
            KOType = "European";
        } else if ($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val() == "KIDCNOKO") {
            KIPerc = $(thisTileTwinWin).find('[id^="kiinputbox"]').val();
            KOPerc = ""
            KIType = "American";
            KOType = "";
        } else if ($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val() == "KIEURNOKO") {
            KIPerc = $(thisTileTwinWin).find('[id^="kiinputbox"]').val();
            KOPerc = ""
            KIType = "European";
            KOType = "";
        } else if ($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val() == "NOKINOKO") {
            KIPerc = "";
            KOPerc = ""
            KIType = "";
            KOType = "";
        }
        let solveForTwinWin = "";
        if ($(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val().trim().toUpperCase() == "DIGITAL_STRIKE") {
            solveForTwinWin = "DIGITAL_STRIKE";
        } else if ($(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val().trim().toUpperCase() == "PRICE") {
            solveForTwinWin = "PRICE";
        } else if ($(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val().trim().toUpperCase() == "COUPON") {
            solveForTwinWin = "COUPON";
        } else if ($(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val().trim().toUpperCase() == "KNOCKIN_BARRIER") {
            solveForTwinWin = "KNOCKIN_BARRIER";
        }


        let _upfront = "";

        if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

           _upfront =  $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').val().trim() ?$(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').val().trim() :0 

        }else{

            _upfront =  "0.00"; 
        }
    

        let exchangeList = getExchangeAndCcyFromBasket($(thisTileTwinWin).find('[id^="shareDivTwinWin"]')[0], 'exchange');
        let ccyList = getExchangeAndCcyFromBasket($(thisTileTwinWin).find('[id^="shareDivTwinWin"]')[0], 'ccy');
        let shareList = getExchangeAndCcyFromBasket($(thisTileTwinWin).find('[id^="shareDivTwinWin"]')[0], 'share');

        let _QuantoFlagTwinWin = "";
        uniqueCCY = ccyList.filter((item, i, ar) => ar.indexOf(item) === i);
        if(uniqueCCY.length==1){
            if($(thisTileTwinWin).find('[id^="ddlTwinWinCcy"]').val()== uniqueCCY[0]){
                _QuantoFlagTwinWin = "No";
            } else{
                _QuantoFlagTwinWin = "Yes";
            }
        }else{
            _QuantoFlagTwinWin = "Yes";
        }

        //End

        mapleLoaderStart(thisTileTwinWin,'[id^="btnBestPriceTwinWin"]', false);


        // LGTGTWINT-1227 - Instant Pricing: EQC Ref missing for rfqs placed through instant pricing | 24 Feb 2023

           let _tenorTwinWin = ""

           if(tenorstring.toUpperCase().includes("M")){
           
            _tenorTwinWin= "MONTH";
           
           }else{
           
            _tenorTwinWin= "YEAR";
           }

        //    let getRefTwinWin = "";
           
           let getRefTwinWin = getEQCRefrenceNumber(productName,KOType,KIType,tenorNumb,_tenorTwinWin,$(thisTileTwinWin).find('[id^="couponipbox"]').val(),_QuantoFlagTwinWin,"Worst of");
           
           $(thisTileTwinWin).find('[id^="hdnRefnumber"]').val(getRefTwinWin); //LGTGTWINT-1589 Instant Pricing : EQC ref different on instant pricer and order details,quote mail and order mail


        // END        


        QuoteObject = {
          
                UserID: userName,
                EntityID: EntityID,
                Type: "TWINWIN",
                Exchange1: exchangeList[0],
                UnderlyingCode1:  shareList[0],
                Exchange2: exchangeList[1],
                UnderlyingCode2:  shareList[1],
                Exchange3: exchangeList[2],
                UnderlyingCode3:  shareList[2],
                Exchange4: exchangeList[3],
                UnderlyingCode4:  shareList[3],
                Ccy:  $(thisTileTwinWin).find('[id^="ddlTwinWinCcy"]').val().trim(),
                SettlementDays: Number($(thisTileTwinWin).find('[id^="SettlWeeks"]').val().trim()),
                SolveFor: solveForTwinWin,
                Tenor: _tenor,
                strikePerc: $(thisTileTwinWin).find('[id^="strikeipbox"]').val(),
                Upfront:_upfront,
                PricePerc: $(thisTileTwinWin).find('[id^="IBPriceipbox"]').val(),
                CouponPerc:  $(thisTileTwinWin).find('[id^="couponipbox"]').val(),
                KIPerc: KIPerc,
                KIType: KIType,
                QuantoYN: _QuantoFlagTwinWin,
                Notional:  $(thisTileTwinWin).find('[id^="ContractAmtTwinWin"]').val().replace(/,/g, "").split(".")[0],
                Branch: "",
                PPDetails: "", 
                GuaranteedDuration:  $(thisTileTwinWin).find('[id^="Guaranteeipbox"]').val(),
                // CouponFrq: $(thisTileTwinWin).find('[id^="ddlCouponFrequency"]').val().toUpperCase(), 
                KOType: KOType,
                KOPerc: KOPerc,
                RMName: "",
                BuySideID: getRefTwinWin,
                NonCall: $(thisTileTwinWin).find('[id^="noncallinputbox"]').val(),
                StepDown: $(thisTileTwinWin).find('[id^="KOStepDowninputbox"]').val(),
                requestID:$(thisTileTwinWin).find('[id^="hdnRequestID"]').val(),
                EQC_TOKEN: sessionStorage.getItem("EQC_Token").toString(),
                CouponFrq: "",
                CurrentTileID: TileId,

        }

        console.log('TwinWin price req ', QuoteObject);

        getQuoteTwinWin(QuoteObject, $(thisTileTwinWin).find('[id^="hdnintervalID"]')[0]);

    } catch (er) {
        console.log(er.message);

    }
}

// To get quote 
function getQuoteTwinWin(QuoteObject, uniqueIntervalID) {
    try {

        var dataTwinWin = request_getDataFromAPI(QuoteObject, clientConfigdata.CommonMethods.NodeServer + "getBestPriceTwinWin").then(dataTwinWin => {

            thisTileTwinWin = document.getElementById("td" + dataTwinWin.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataTwinWin.CurrentTileID, true);
            mapleLoaderStart(thisTileTwinWin,'[id^="btnBestPriceTwinWin"]', false); 
            getUniqQuoteResponseTwinWin(thisTileTwinWin, dataTwinWin, uniqueIntervalID,QuoteObject.requestID); //INT1FIN47-768 Gateway Markets Instant Pricing issue 

        }).catch(error => { console.log(error); })

    } catch (err) {
        console.log(err.message);
    }
}

function getUniqQuoteResponseTwinWin(thisTileTwinWin, dataTwinWin, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var UIID = null;
        // Added by Atharva - EQC Timers - START
        isTimerStarted["td" + dataTwinWin.CurrentTileID] = false;
        myCounter["td" + dataTwinWin.CurrentTileID] = {};
        hasUserClickedEQC["td" + dataTwinWin.CurrentTileID] = false;
        $(thisTileTwinWin).find('[id^="hdnSelectedBank"]').val("");
       
        // END

        uniqueIntervalID.value = setInterval(function () {

            if(reqestID != $(thisTileTwinWin).find('[id^="hdnRequestID"]').val()){
                return false
            } // INT1FIN47-768 Gateway Markets Instant Pricing issue
            sessionStorage.setItem("quoteToken_" + thisTileTwinWin.id.match(/\d+$/)[0], "");
            sessionStorage.setItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0], "");

            sessionStorage.setItem("quoteToken_" + thisTileTwinWin.id.match(/\d+$/)[0], dataTwinWin['token']);
            sessionStorage.setItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0], dataTwinWin['responseData']);


            getFinalQuoteResponseTwinWin(sessionStorage.getItem("quoteToken_" + thisTileTwinWin.id.match(/\d+$/)[0]), sessionStorage.getItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]), thisTileTwinWin, uniqueIntervalID, reqestID);

        }, clientConfigdata.EQCTwinWin.PollInterval);


        console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
    } catch (error) {
        console.log(error)
    }
}

// To get price 
function getFinalQuoteResponseTwinWin(finalTokenTwinWin1, finalResponseDataTwinWin1, thisTileTwinWin, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var currentDateAndTime = new Date();

        sessionStorage.setItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0], finalResponseDataTwinWin1);

        sessionStorage.setItem("quoteToken_" + thisTileTwinWin.id.match(/\d+$/)[0], finalTokenTwinWin1);

        console.log("TwinWin RFQ's :: " + finalResponseDataTwinWin1 + " " + currentDateAndTime);
        
        Timer = Timer + 1;


        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileTwinWin.id.match(/\d+$/)[0])) >= Number(DRAFCNrequestCount.toString().split(".")[0]) || sessionStorage.getItem("pricingToggle" + thisTileTwinWin.id.match(/\d+$/)[0]) == "false") { //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
            
            $(thisTileTwinWin).find('[id^="btnBestPriceTwinWin"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval(uniqueIntervalID.value);
            mapleLoaderStop(thisTileTwinWin,'[id^="btnBestPriceTwinWin"]', false);
            
            uniqueIntervalID.value = "";
            QuoteObject = "";
            $(thisTileTwinWin).find('[id^="OverlayDiv"]').hide();
     
            $("body").css("opacity", "");
            arrTwinWin = [];
            maxTwinWin = "";
            TimerTwinWin = 0;

            //Call Draw Graph
            // $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val(JSON.stringify(finalObjTwinWin));
            // if (finalObjTwinWin != null || finalObjTwinWin != undefined) {
            //     drawgraphTwinWin($(thisTileTwinWin).find('[id^="canvas"]').attr('id'));
            // }
            // INT1FIN47-768 Gateway Markets Instant Pricing issue

            return false;

        } else {
            var repriceObjectTwinWin = request_getDataFromAPI({
                "PPDetails": sessionStorage.getItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]),
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": thisTileTwinWin.id.match(/\d+$/)[0],
                "UserID":sessionStorage.getItem("EQC_UserName").toString(),
            }, clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseTwinWin").then(repriceObjectTwinWin => {

                thisTileTwinWin = document.getElementById("td" + repriceObjectTwinWin.CurrentTileID);
                // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileTwinWin).find('[id^="btnEmailQuote"]').attr("disabled", false);
                $(thisTileTwinWin).find('[id^="BookTradeTwinWin"]').attr("disabled", false);
                $(thisTileTwinWin).find('[id^="OrderEmail"]').attr("disabled",false); //LGTGTWINT-1981 || RizwanS || 12 May 2023 
                if(reqestID != $(thisTileTwinWin).find('[id^="hdnRequestID"]').val()){
                    return false
                } //INT1FIN47-768Gateway Markets Instant Pricing issue

                sessionStorage.setItem("poolingTimer_" + repriceObjectTwinWin.CurrentTileID, Number(sessionStorage.getItem("poolingTimer_" + thisTileTwinWin.id.match(/\d+$/)[0])) + 1);
                
                finalObjTwinWin = (repriceObjectTwinWin['responseData']);

                sessionStorage.setItem("quoteToken_" + thisTileTwinWin.id.match(/\d+$/)[0], repriceObjectTwinWin['token']);
                sessionStorage.setItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]));
                // Sorted By Best Price LP'S                                
                finalObjTwinWin.sort(function (a, b) {
                    if (a.TwinwinOUT === null || a.TwinwinOUT == "" || a.TwinwinOUT == "Timeout" || a.TwinwinOUT.toUpperCase().trim() == "REJECTED" || a.TwinwinOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return 1;
                    } else if (b.TwinwinOUT === null || b.TwinwinOUT == "" || b.TwinwinOUT == "Timeout" || b.TwinwinOUT.toUpperCase().trim() == "REJECTED" || b.TwinwinOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return -1;
                    } else if (a.TwinwinOUT === b.TwinwinOUT) {
                        return 0;
                    }

                    if ($(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val().trim().toUpperCase() == "COUPON") {
                        return Number(a.TwinwinOUT) > Number(b.TwinwinOUT) ? -1 : 1;
                    } else {
                        return Number(a.TwinwinOUT) < Number(b.TwinwinOUT) ? -1 : 1;
                    }

                });
                maxTwinWin = finalObjTwinWin[0].TwinwinOUT;
                //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
                //$(thisTileTwinWin).find('[id^="EQCRfqidpnl"]').show();
                // $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html("");
                // $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html("RFQ ID: " + finalObjTwinWin[0].EP_ER_QuoteRequestId);
                //end
                // END
                //Removed || LGTGTWINT-1981 || RizwanS || 12 May 2023
                $(thisTileTwinWin).find('[id^="hdnfinalTokenTwinWin"]').val(sessionStorage.getItem("quoteToken_" + thisTileTwinWin.id.match(/\d+$/)[0]));
               
               
                if (sessionStorage.getItem("pricingToggle" + thisTileTwinWin.id.match(/\d+$/)[0]) == "true") {
                    // Added by Atharva - EQC Timers - START
                    var isNonBestPrice = false;
                    if(clientConfigdata.CommonMethods.NonBestPrice == "Y") {
                        isNonBestPrice = true;
                    }
                    else {
                        isNonBestPrice = false;
                    }
                    // every time in new request indexes might change so clearing.
                    mapIndexToBank["td"+repriceObjectTwinWin.CurrentTileID] = {};
                    // END
                    $(thisTileTwinWin).find('[id^="TwinWinBanksRow"]').empty();
                    $(thisTileTwinWin).find('[id^="TwinWinPrices"]').empty();
                    // Added by Atharva - EQC Timers - START
                    $(thisTileTwinWin).find('[id^="TwinWinTimerRow"]').empty();
                    if(!hasUserClickedEQC["td"+repriceObjectTwinWin.CurrentTileID]) {
                        $(thisTileTwinWin).find('[id^="hdnSelectedBank"]').val("");
                    }
                    var itr = 0;
                    // END
                    $(thisTileTwinWin).find('[id^="minMaxNotionalLimitRow"]').empty();


                    //Check for best price count || LGTGTWINT-1981 || RizwanS || 12 May 2023
                    if (NotesBestPriceDisplayCount != "") { 

                        let sliceCount = Number(NotesBestPriceDisplayCount); // Count to show best prices as per config set
                        
                        let productname = $(thisTileTwinWin).find(".productName").attr("id");

                        finalObjTwinWin = sliceEQCbestprices(finalObjTwinWin,productname,sliceCount);

                        // LGTGTWINT-2018 - Prices to be displayed for EAM entity on MSP and IP only when the input notional falls within min max range of CPs || RizwanS || 24 May 2023
                        
                        if(NotionalMinMaxCheck.toUpperCase() === 'YES' && parseFloat($(thisTileTwinWin).find('[id^="ContractAmtTwinWin"]').val().replace(/,/g, "")) > 0){  //RizwanS || LGTGTWINT-2153 || 27 Jun 2023

                            let _tempObj = [] 
                    
                            for(i=0;i<finalObjTwinWin.length;i++){
        
                                if(parseFloat($(thisTileTwinWin).find('[id^="ContractAmtTwinWin"]').val().replace(/,/g, "")) <= parseFloat(finalObjTwinWin[i].MaxNotional)
                                && parseFloat($(thisTileTwinWin).find('[id^="ContractAmtTwinWin"]').val().replace(/,/g, "")) >= parseFloat(finalObjTwinWin[i].MinNotional)){
                                    
                                        _tempObj.push(finalObjTwinWin[i]);
        
                                }else{
        
                                        finalObjTwinWin[i].TwinwinOUT = "-";
                                        finalObjTwinWin[i].PP_CODE ="-";
                                        finalObjTwinWin[i].MaxNotional = 0;
                                        finalObjTwinWin[i].MinNotional = 0;
                                        _tempObj.push(finalObjTwinWin[i]);
                                }
        
                            }

                            _tempObj.sort((a,b) => a.PP_CODE - b.PP_CODE);

                            let _tempObj1 = [];

                            for (let k = 0; k < _tempObj.length; k++) {

                                if(_tempObj[k].PP_CODE !== "-"){
                                    _tempObj1.push(_tempObj[k]);
                                }
                               
                            }

                            if(_tempObj1.length > 0){

                                finalObjTwinWin = _tempObj1;
                            }
                        }
                        
                        //END
                    }
 
                    bindRFQIDEQC(thisTileTwinWin,finalObjTwinWin); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023

                    $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val(JSON.stringify(finalObjTwinWin));

                    // END

                    $(finalObjTwinWin).each(function (i, elem) {
                        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
                        var priceClass = "GlowPrice_Red";
                        if (!glowFlag) {
                            priceClass = "noGlow";
                        }

                        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                        // $(thisTileTwinWin).find('[id^="EQCRfqidpnl"]').show();
                        // $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html(elem.ParentID);
                        //end

                        var str = "";
                        var str2 = "";
                        if (elem.PP_CODE != null) {
                            // Added by Atharva - EQC Timers - START
                            mapIndexToBank["td"+repriceObjectTwinWin.CurrentTileID][itr] = elem.PP_CODE;
                            if(elem.TwinwinOUT != null && !isNaN(elem.TwinwinOUT) && elem.TwinwinOUT != "Rejected" &&  elem.TwinwinOUT != "" && $(thisTileTwinWin).find('[id^="hdnSelectedBank"]').val() == "") {
                                $(thisTileTwinWin).find('[id^="hdnSelectedBank"]').val(elem.PP_CODE);
                            }
                            if (elem.PP_CODE == "CITI") {
                                if(isNonBestPrice) {
                                    if(elem.TwinwinOUT != null && !isNaN(elem.TwinwinOUT) && elem.TwinwinOUT != "Rejected" &&  elem.TwinwinOUT != "" && ($(thisTileTwinWin).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectTwinWin.CurrentTileID + "_" + itr + "'>" + "Citi" + "</button></td>";
                                    }
                                    else if(elem.TwinwinOUT != null && !isNaN(elem.TwinwinOUT) && elem.TwinwinOUT != "Rejected" && elem.TwinwinOUT != "") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectTwinWin.CurrentTileID + "_" + itr + "'>" + "Citi" + "</td>";
                                    }
                                    else {
                                        str = str + "<td>" + "Citi" + "</td>";
                                    }
                                }
                                else {
                                    str = str + "<td";
                                    if(itr == 0 && elem.TwinwinOUT != null && !isNaN(elem.TwinwinOUT) && elem.TwinwinOUT != "Rejected" &&  elem.TwinwinOUT != "") {
                                        str = str + " class='bestPriceStyle'"
                                    }
                                    str = str + ">Citi</td>";
                                }
                                
                            } else {
                                if(isNonBestPrice) {
                                    if(elem.TwinwinOUT != null && !isNaN(elem.TwinwinOUT) && elem.TwinwinOUT != "Rejected" &&  elem.TwinwinOUT != "" && ($(thisTileTwinWin).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectTwinWin.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</button></td>";
                                    }
                                    else if(elem.TwinwinOUT != null && !isNaN(elem.TwinwinOUT) && elem.TwinwinOUT != "Rejected" &&  elem.TwinwinOUT != "") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectTwinWin.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</td>";
                                    }
                                    else {
                                        str = str + "<td>" + elem.PP_CODE + "</td>";
                                    }
                                }
                                else {
                                    str = str + "<td";
                                    if(itr == 0 && elem.TwinwinOUT != null && !isNaN(elem.TwinwinOUT) && elem.TwinwinOUT != "Rejected" &&  elem.TwinwinOUT != "") {
                                        str = str + " class='bestPriceStyle'"
                                    }
                                    str = str + ">" + elem.PP_CODE + "</td>";
                                }
                            }
                            // END
                            $(thisTileTwinWin).find('[id^="TwinWinBanksRow"]').append(str);
                        } else {
                            str = str + "<td>--</td>"
                            $(thisTileTwinWin).find('[id^="TwinWinBanksRow"]').append(str);
                        }
                        if (elem.TwinwinOUT != null && !isNaN(elem.TwinwinOUT) && elem.TwinwinOUT != "" && elem.TwinwinOUT != "Rejected") {
                            // Added by Atharva - EQC Timers
                            // Added new if condition
                            if(isNonBestPrice) {
                                if($(thisTileTwinWin).find('[id^="hdnSelectedBank"]').val() == elem.PP_CODE) {
                                
                                    str2 = str2 + "<td class='priceBackground";
                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                    if(parseFloat(elem.TwinwinOUT).toFixed(2) < 2){
                                       
                                        if(itr == 0) {
                                            str2 = str2 + " negativeprice";
                                        }

                                    }else{

                                        if(itr == 0) {
                                            str2 = str2 + " bestPriceStyle";
                                        }

                                    }
                                    // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                    str2 = str2 + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectTwinWin.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.TwinwinOUT).toFixed(2) + "%</button></td>"
                                    $(thisTileTwinWin).find('[id^="TwinWinPrices"]').append(str2);
                                } else {
                                    str2 = str2 + "<td";

                                    if(parseFloat(elem.TwinwinOUT).toFixed(2) < 2){

                                        if(itr == 0) {
                                            str2 = str2 + " class='negativeprice_nonbest'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton negativeprice_nonbest' onclick='setPriceEQC(this)' id='td" + repriceObjectTwinWin.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.TwinwinOUT).toFixed(2) + "%</button></td>"
                                        $(thisTileTwinWin).find('[id^="TwinWinPrices"]').append(str2);

                                    } else{

                                        if(itr == 0) {
                                            str2 = str2 + " class='bestPriceStyle'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectTwinWin.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.TwinwinOUT).toFixed(2) + "%</button></td>"
                                        $(thisTileTwinWin).find('[id^="TwinWinPrices"]').append(str2);
                                        
                                    }                                
                                }
                            }
                            else {
                                str2 = str2 + "<td";
                                // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                if(parseFloat(elem.TwinwinOUT).toFixed(2) < 0){

                                    if(itr == 0) {
                                        str2 = str2 + " class='negativeprice_nonbest'";
                                    }

                                }else{

                                    if(itr == 0) {
                                        str2 = str2 + " class='bestPriceStyle'";
                                    }

                                }
                                // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                str2 = str2 + ">" + parseFloat(elem.TwinwinOUT).toFixed(2) + "%</td>";
                                $(thisTileTwinWin).find('[id^="TwinWinPrices"]').append(str2);
                            }
                        } else {
                            str2 = str2 + "<td>-</td>"
                            $(thisTileTwinWin).find('[id^="TwinWinPrices"]').append(str2);
                        }
                       

                        itr++;

                let strMinMaxNotionalLimit = '';

                if (elem.PP_CODE != null) {
                    strMinMaxNotionalLimit = strMinMaxNotionalLimit + `<td style='font-size:12px !important;'>${K_M_B_Formatter(Number(elem.MinNotional))} / ${K_M_B_Formatter(Number(elem.MaxNotional))}</td>`;
                    $(thisTileTwinWin).find('[id^="minMaxNotionalLimitRow"]').append(strMinMaxNotionalLimit);
                                        }

                        // END
                    });
                    // Added by Atharva - EQC Timers - START
                    // Should run only once
                    // if(!isTimerStarted["td" + repriceObjectTwinWin.CurrentTileID]) {
                    //     isTimerStarted["td" + repriceObjectTwinWin.CurrentTileID] = true;
                    //     startTimersEQC(repriceObjectTwinWin.CurrentTileID);
                    // }
                    // END

                }
                  
            }).catch(error => {
                console.log(error);
                $(thisTileTwinWin).find('[id^="btnBestPriceTwinWin"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
                clearInterval(uniqueIntervalID.value);
                mapleLoaderStop(thisTileTwinWin,'[id^="btnBestPriceTwinWin"]', false);
                uniqueIntervalID.value = "";
                $(thisTileTwinWin).find('[id^="OverlayDiv"]').hide();

                // $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val(JSON.stringify(finalObjTwinWin));
                // if (finalObjTwinWin != null || finalObjTwinWin != undefined) {
                //     drawgraphTwinWin($(thisTileTwinWin).find('[id^="canvas"]').attr('id'));
                // } // INT1FIN47-768 Gateway Markets Instant Pricing issue

            })
        }
    } catch (error) {

        $(thisTileTwinWin).find('[id^="btnBestPriceTwinWin"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issueclearInterval(uniqueIntervalID.value);
        sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        clearInterval(uniqueIntervalID.value);
        mapleLoaderStop(thisTileTwinWin,'[id^="btnBestPriceTwinWin"]', false);

        uniqueIntervalID.value = "";
        $(thisTileTwinWin).find('[id^="OverlayDiv"]').hide();
        // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
        $(thisTileTwinWin).find('[id^="btnEmailQuote"]').attr("disabled", true);
        $(thisTileTwinWin).find('[id^="BookTradeTwinWin"]').attr("disabled", true);
        $(thisTileTwinWin).find('[id^="OrderEmail"]').attr("disabled",true);  //LGTGTWINT-1981 || RizwanS || 12 May 2023

        console.log("getFinalQuoteResponseTwinWin : " + error.message);
        
        // $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val(JSON.stringify(finalObjTwinWin));
        // if (finalObjTwinWin != null || finalObjTwinWin != undefined) {
        //     drawgraphTwinWin($(thisTileTwinWin).find('[id^="canvas"]').attr('id'));
        // }// INT1FIN47-768 Gateway Markets Instant Pricing issue
        // sessionStorage.setItem("quoteToken_" + thisTileTwinWin.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileTwinWin.id.match(/\d+$/)[0]));
        // sessionStorage.setItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]));
        //// INT1FIN47-768 Gateway Markets Instant Pricing issue
  

    } finally {
      //  $(thisTileTwinWin).find('[id^="BookTradeTwinWin"]').attr("disabled", false);
    }
}

// To book trade
function booktradeTwinWin(that,suitabilityCheck,redirectOrder) {
    try {
      
        // startLoader();

        TileId = that.id.match(/\d+$/)[0];
        thisTileTwinWin = document.getElementById("td" + TileId);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
    

        // Added by Atharva - EQC Timers - START
        clearPricesInterrupt["td" + TileId] = true;
       
        // END
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
            $(thisTileTwinWin).find('[id^="TwinWinBanksRow"]').children().each(function() {
                if($(thisTileTwinWin).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
            //   endLoader() 
            mapleOrderLoaderStop(thisTileTwinWin);
               return false;
        
        }

        // END

        let AllocationDetails=[];

        $(thisTileTwinWin).find("select.ChildrenddlBookingCenter").each(function(index, element){

            if ($(this).parent().prev().find(".childrenCheckBoxBooking")[0].checked) {

                AllocationDetails.push({

                "RMName": $(element).parent().parent().find('[id^="ddlRMName"]').val(),
                "CustBranch": element.value,
                "Notional":$(element).parent().parent().find('[id^="txtHeaderNotional"]').val().split('.')[0].replace(/\,/g, "")

                })
            }
        })        

        // Check For Negative prices // CFINT-927 // 10-Sep-2020
        // Added by Atharva - EQC Timers
        // Replaced 0 with selectedBankIndex

        var Obj = JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val());
        var token1 = $(thisTileTwinWin).find('[id^="hdnfinalTokenTwinWin"]').val();
        var quoteid = Obj[selectedBankIndex].EP_ER_QuoteRequestId;
        // Added by Atharva - EQC Timers
        // Replaced 0 with selectedBankIndex

        // Added for upfront% in order blotter // JIRA ID - CFINT-1015 // 20 Oct 2020 //

        // let marginTwinWin;
        
        // if ($(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val().trim().toUpperCase()  == "STRIKE" || $(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val().trim().toUpperCase()  == "COUPON") {
                    
        //     marginTwinWin = (100 -  parseFloat($(thisTileTwinWin).find('[id^="IBPriceipbox"]').val()));
        // }
        // else {

        //     marginTwinWin = (100 - JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val())[selectedBankIndex].TwinwinOUT);
        //     // Added by Atharva - EQC Timers
        //     // Replaced 0 with selectedBankIndex
        // }
        
        //END
       // let _clientPrice =(parseFloat(JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val())[selectedBankIndex].TwinwinOUT) + parseFloat(100 - JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val())[0].TwinwinOUT)).toFixed(2);


        let limitPrice1 = "";
        let limitPrice2 = "";
        let limitPrice3 = "";
        let limitPrice4 = "";

        if($(thisTileTwinWin).find('[id^="ddlOrderTypeTwinWin"]').val().trim().toUpperCase() == "LIMIT"){

            if($(thisTileTwinWin).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 0){

                limitPrice1 = $(thisTileTwinWin).find('[id^="txtLimitLevel"]').val().trim();

            }else if($(thisTileTwinWin).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 1){

                 limitPrice2 = $(thisTileTwinWin).find('[id^="txtLimitLevel"]').val().trim();

            } else if($(thisTileTwinWin).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 2){

                 limitPrice3 = $(thisTileTwinWin).find('[id^="txtLimitLevel"]').val().trim();
                 
            } else if($(thisTileTwinWin).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 3){

                limitPrice4 = $(thisTileTwinWin).find('[id^="txtLimitLevel"]').val().trim();
                
            }            
        }

        //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

        let _confirmReason = "";

        if(selectedBankIndex>0){
 
            if($(thisTileTwinWin).find('[id^="ddlNONBEST"]').val() != "NONBEST_CUSTOM"){
 
              _confirmReason = $(thisTileTwinWin).find('[id^="ddlNONBEST"]').text();
      
            }else{
      
                 _confirmReason =  $(thisTileTwinWin).find('[id^="txtNONBEST"]').val(); 
                  
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
              if ($(thisTileTwinWin).find('[id^="rbRowSuitabilityToggle"]')[0].checked) {
                 _chkSuitability = "NO";
                 if ($(thisTileTwinWin).find('[id^="ddlReason"]').val().trim().includes("SUTSKP_CUSTOM")) { // Added by RizwanS | JIRA-LGTGTWINT-1830
                     _reasonmsg = $(thisTileTwinWin).find('[id^="txtSpecifyReason"]').val();
                 }else{
                     _reasonmsg = $(thisTileTwinWin).find('[id^="ddlReason"]').val();
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
               orderQty: $(thisTileTwinWin).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
               type:$(thisTileTwinWin).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
               limitPrice1: limitPrice1,
               limitPrice2: limitPrice2,
               limitPrice3: limitPrice3,
               limitPrice4: limitPrice4,
               QuoteRequestId: quoteid,
               loginUser: sessionStorage.getItem("EQC_UserName").toString(),
               margin: "0.00",//Number(marginTwinWin).toFixed(2),
               clientPrice:"0.00",
               yield: "",
               bookingBranch: $(thisTileTwinWin).find('[id^="ddlBookingBranch"]').val(),
               rmNameForOrderConfirmation: $(thisTileTwinWin).find('[id^="ddlRMName"]').val(),
               dealerNotificationEmailID: $(thisTileTwinWin).find('[id^="txtComment"]').val(),
               orderComment: $(thisTileTwinWin).find('[id^="txtComment"]').val(),
               confirmationReason: _confirmReason,
               advisoryReason: $(thisTileTwinWin).find('[id^="txtComment"]').val(),
               preTradeXml: preTradeXml,
              // chkSuitability:$(thisTileTwinWin).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
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
                "orderQuantity": $(thisTileTwinWin).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "OrderType": $(thisTileTwinWin).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
                "LimitPrice1": limitPrice1,
                "LimitPrice2": limitPrice2,
                "LimitPrice3": limitPrice3,
                "LimitPrice4": limitPrice4,
                "QuoteRequestId": quoteid,
                "PoolID": "",
                "RedirectOrderID": "",
                "OrderComment": $(thisTileTwinWin).find('[id^="txtComment"]').val(),
                "Margin": "0.00",//Number(marginTwinWin).toFixed(2),
                "Notional": $(thisTileTwinWin).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "ClientPrice": "0.00",
                "ClientYield": "",
                "BookingBranch": $(thisTileTwinWin).find('[id^="ddlBookingBranch"]').val(),
                "RMNameforOrderConfirm": $(thisTileTwinWin).find('[id^="ddlRMName"]').val(),
                "RMEmailIdforOrderConfirm": "",
                "ConfirmReason": _confirmReason, //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message
                "PreTradeXml": "",
                "AdvisoryReason": "",
                // "UserRole": _reasonmsg, // Added Chaitanya M | For checking the suitability reason | Ref:LGTGTWINT-603 | 12-Jan-2023
                "CustomerID": "",
                // "chkSuitability":$(thisTileTwinWin).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
                "chkSuitability":_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                "SuitabilityReason": _reasonmsg, // Added by RizwanS | JIRA-LGTGTWINT-1830
                "IntendedSpread": "",
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": TileId,
                "AllocationDetails": AllocationDetails,
                "UserRole" : isEQCDealer === true ? 'Dealer' : isIA=== true ? 'IA' : 'RM' , // Added by RizwanS | JIRA-LGTGTWINT-1830
            
            }
        }

        mapleOrderLoaderStart(thisTileTwinWin);
           
       request_getDataFromAPI(bookObject, clientConfigdata.CommonMethods.NodeServer + orderMethodName).then(bookObject => {

            // endLoader()

            thisTileTwinWin = document.getElementById("td" + bookObject.CurrentTileID);

            TileId = bookObject.CurrentTileID;

            let bookstring = bookObject['responseData']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
             
            let OrderStatus = bookObject['message']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
        

            if (OrderStatus.toUpperCase() == clientConfigdata.EQCCommonMethods.EQC_BOOK_TRADE_RESPONSE_DETAILS.toUpperCase()) {

                // $(thisTileTwinWin).find('[id^="hdnBlotterURLTwinWin"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                // $(thisTileTwinWin).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradeTwinWin" + TileId, bookstring, "DivOverlayTwinWin");
                $(thisTileTwinWin).find('[id^="OverlayDiv"]').hide();
                $(thisTileTwinWin).find('[id^="hdnfinalTokenTwinWin"]').val("");
                clearPricerTable(thisTileTwinWin);
                
            } else {

                if(OrderStatus == "" || OrderStatus == null || OrderStatus==undefined){

                    OrderStatus = "Order Execution Failed!";
                    
                
                }else if(OrderStatus.includes("Please select booking centers from same region")){ // LGTGTWINT-1888 || RizwanS || 30 May 2023

                    OrderStatus = "Please select booking centers from same region.";
                }
                
                booktradePopup(that, "booktradeTwinWin" + TileId, OrderStatus, "DivOverlayTwinWin");
                $(thisTileTwinWin).find('[id^="OverlayDiv"]').hide();
                $(thisTileTwinWin).find('[id^="hdnfinalTokenTwinWin"]').val("");
                clearPricerTable(thisTileTwinWin);
            }
            mapleOrderLoaderStop(thisTileTwinWin);
            sessionStorage.removeItem("quoteResponse_" + thisTileTwinWin.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileTwinWin).find('[id^="btnBestPriceTwinWin"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileTwinWin).find('[id^="hdnintervalID"]').val());
            mapleLoaderStop(thisTileTwinWin,'[id^="btnBestPriceTwinWin"]', false);
            // Added by Atharva - EQC Timers - START
            $(thisTileTwinWin).find('[id^="TwinWinPrices"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            $(thisTileTwinWin).find('[id^="TwinWinBanksRow"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileTwinWin).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileTwinWin).find('[id^="BookTradeTwinWin"]').attr("disabled", true);
            $(thisTileTwinWin).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
             
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileTwinWin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileTwinWin).find('[id^="RFQIDEQC"]').html("");
            //End

            // END
        }).catch(error => { console.log(error); })
    } catch (er) {
        console.log(er);
        booktradePopup(that, "booktradeTwinWin" + TileId, "Order Execution Failed!", "DivOverlayTwinWin");
        $(thisTileTwinWin).find('[id^="OverlayDiv"]').hide();
        // endLoader();
        mapleOrderLoaderStop(thisTileTwinWin);

    } finally {

    }
}

var dialogBoxTwinWin = null;
function emailQuoteTwinWin(that) {
    try {

        thisTileTwinWin= $(that).parents(".sorting")[0];
    
        let pricingRow = "";
        pricingRow = $(thisTileTwinWin).find("table.pricerTable .pricesRow")[0];
        mapleOrderLoaderStart(thisTileTwinWin); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
    
        if (pricingRow.cells[0].innerText.trim().toString() === "-") {
            openValidationpopup('',"No price available for mailing!"); // Changed for Change quote mail validation from "Invalid Price" to "No price available for mailing!" | Ref: LGTGTWINT-1195 | Chaitanya M | 25-jan-2023
          return false;
        }

        //create email pop up here 
        let strEmail =``;
        let emailPriceStream =JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val());
        console.log('email price stream object ', emailPriceStream);

        strEmail=strEmail+`<table class='emailTable'><tr><td class='payOff_Features'>
        <input type='checkbox' class='chkBoxParent_Email_PPCode' onchange='emailParentCheckboxChanged(this)' >
        Issuer</td><td class='payOff_Features'>${globalSolveForValueTwinWin}</td></tr>`;

        for (let e of emailPriceStream){
            if(e.TwinwinOUT.trim().toUpperCase()!=='REJECTED' && e.TwinwinOUT.trim().toUpperCase()!=='' && e.TwinwinOUT.trim().toUpperCase()!=='UNSUPPORTED'){ // Changed the condition for handling Unsupported response | Ref: LGTGTWINT-1321 | Chaitanya M | 06 Feb 2023
                        strEmail=strEmail+`<tr><td style='width:40px;padding:15px'><input type='checkbox' class='chkBox_Email_PPCode'  onchange='emailChildrenCheckboxChanged(this)'> ${e.PP_CODE}</td><td style='width:40px;padding:15px'>${e.TwinwinOUT}</td></tr>`;
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
        if(dialogBoxTwinWin===null)
        {
            dialogBoxTwinWin= $(thisTileTwinWin).find('[id^="emailDialog_TwinWin"]')[0];
            $(thisTileTwinWin).find('[id^="emailDialog_TwinWin"]').empty().append(strEmail);
            $(dialogBoxTwinWin).dialog({
                resizable: false,
                height: "auto",
                width: 320,
                open: function (event, ui) {// Added for LGTGTWINT-1283 || Email popup on top change | Chaitanya M | 08 Feb 2023
                    $('.ui-widget.ui-widget-content').css('z-index',999);                    
                },  
                //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                close: function (event, ui){
                    mapleOrderLoaderStop(thisTileTwinWin);
                    //End
                },
                modal: true,
          
                buttons: {
                    "Mail Quote": function() {
                        //mail single selected rfq 

                        //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023

                        var Email_PPList =[];
                        var RFQIDList=[];
                        var __mailRFQ=[];

                    
                        if($(document).find('.ui-dialog').find('[id^="emailDialog_TwinWin"]').find('.chkBox_Email_PPCode').length>0)
                        {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_TwinWin"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                                if(checkboxControl.checked){
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val()).filter(function(RFQ_OBJECT){
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


                        if ($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val() != undefined && $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val().trim()!='')
                        var RFQID = JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;
    
                        if (RFQID != undefined && RFQID != ''){
                            //     MailBestQuote(thisTileTwinWin.id.match(/\d+$/)[0], JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val())[0].EP_ER_QuoteRequestId);
                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023          
                                //booktradePopup(thisTileTwinWin, "booktradeTwinWin" + thisTileTwinWin.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayTwinWin");
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            }     
                            $(this).dialog("close"); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileTwinWin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                                "rfqId":__mailRFQ.toString(), //RFQID,
                                "CurrentTileID":thisTileTwinWin.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType:"English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileTwinWin = document.getElementById("td" +TileId);
                                mapleOrderLoaderStop(thisTileTwinWin);
                                booktradePopup(thisTileTwinWin, "booktradeTwinWin" + TileId, data.message, "DivOverlayTwinWin");
                                
                            }).catch(error=>{
                                console.log(error);
                            
                            })
                        }else{
                            mapleOrderLoaderStop(thisTileTwinWin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('','Invalid RFQ ID ');
                        }
                            
             
                    },
                    "Mail All Quotes": function() {
                        //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023


                        var Email_PPList = [];
                        var RFQIDList = [];
                        var __mailRFQ = [];


                        if ($(document).find('.ui-dialog').find('[id^="emailDialog_TwinWin"]').find('.chkBox_Email_PPCode').length > 0) {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_TwinWin"]').find('.chkBox_Email_PPCode').each(function (chkIndex, checkboxControl) {
                             //   if (checkboxControl.checked) {
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val()).filter(function (RFQ_OBJECT) {
                                        return RFQ_OBJECT['PP_CODE'].trim().toUpperCase() === $(checkboxControl).parent().text().toString().trim().toUpperCase();
                                    })
                                    )

                               // }
                            })
                        }
                        if (Email_PPList.length > 0) {
                            console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);

                            for (let R of RFQIDList) {
                                __mailRFQ.push(R[0].EP_ER_QuoteRequestId);

                            }
                            // return true;    
                        }

                        if ($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val() != undefined && $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val().trim() != '')
                            var RFQID = JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

                        if (RFQID != undefined && RFQID != '') {
                            //     MailBestQuote(thisTileTwinWin.id.match(/\d+$/)[0], JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val())[0].EP_ER_QuoteRequestId);
                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileTwinWin, "booktradeTwinWin" + thisTileTwinWin.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayTwinWin");
                                mapleOrderLoaderStop(thisTileTwinWin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            } 
                            $( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileTwinWin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({
                                "userName": sessionStorage.getItem("FinIQUserID").toString(),
                                "rfqId": __mailRFQ.toString(), //RFQID,
                                "CurrentTileID": thisTileTwinWin.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType: "English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileTwinWin = document.getElementById("td" + TileId);
                                mapleOrderLoaderStop(thisTileTwinWin);
                                booktradePopup(thisTileTwinWin, "booktradeTwinWin" + TileId, data.message, "DivOverlayTwinWin");

                            }).catch(error => {
                                console.log(error);

                            })
                        }
                        else{
                            mapleOrderLoaderStop(thisTileTwinWin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('', 'Invalid RFQ ID ');
                        }
                    
                        return true;

                        //email all quotes here 

                    }
                }
            });
            $(dialogBoxTwinWin).dialog('open');

        }else
        {
            $(document).find('.ui-dialog').find('[id^="emailDialog_TwinWin"]').empty().append(strEmail);

            $(dialogBoxTwinWin).dialog('open');

            var Email_PPList =[];
            var RFQIDList=[];
            var __mailRFQ=[];
            
            if($(document).find('.ui-dialog').find('[id^="emailDialog_TwinWin"]').find('.chkBox_Email_PPCode').length>0)
            {
                $(document).find('.ui-dialog').find('[id^="emailDialog_TwinWin"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                    if(checkboxControl.checked){
                    Email_PPList.push($(checkboxControl).parent().text().trim())

                    RFQIDList.push(JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val()).filter(function(RFQ_OBJECT){
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


            if ($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val() != undefined && $(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val().trim()!='')
            var RFQID = JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

            if (RFQID != undefined && RFQID != ''){
                //     MailBestQuote(thisTileTwinWin.id.match(/\d+$/)[0], JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val())[0].EP_ER_QuoteRequestId);
                if(__mailRFQ == ""){
                    // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    //booktradePopup(thisTileTwinWin, "booktradeTwinWin" + thisTileTwinWin.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayTwinWin");
                    mapleOrderLoaderStop(thisTileTwinWin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    openValidationpopup('','No price selected for mailing !');
                    //End
                    return false;
                }     
                mapleOrderLoaderStart(thisTileTwinWin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                    "rfqId":__mailRFQ.toString(),//RFQID,
                    "CurrentTileID":thisTileTwinWin.id.match(/\d+$/)[0],
                    "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                    QuoteMailType:"English"
                }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                    console.log(data);
                    TileId = data.CurrentTileID;
                    thisTileTwinWin = document.getElementById("td" +TileId)
                    mapleOrderLoaderStop(thisTileTwinWin);
                    booktradePopup(thisTileTwinWin, "booktradeTwinWin" + TileId, data.message, "DivOverlayTwinWin");
                      
                }).catch(error=>{
                    console.log(error);
                   
                })
            }
            else{
                mapleOrderLoaderStop(thisTileTwinWin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                openValidationpopup('','Invalid RFQ ID ');
                
            }

        }
        $(thisTileTwinWin).find('[id^="TwinWinBanksRow"]').children().each(function() {
           if($(thisTileTwinWin).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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


function validateOrderTwinWin(thisTileTwinWin,_flag){    // LGTGTWINT-1279 : Instant Pricing : Order booking valdations.

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
            $(thisTileTwinWin).find('[id^="TwinWinBanksRow"]').children().each(function() {
                if($(thisTileTwinWin).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
        // END

        //Validation before order bokking
        if ($(thisTileTwinWin).find('[id^="ddlSolveForTwinWin"]').val().trim().toUpperCase() == "DIGITAL_STRIKE") {
            
            if($(thisTileTwinWin).find('[id^="koinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val())[selectedBankIndex].TwinwinOUT) > parseFloat($(thisTileTwinWin).find('[id^="koinputbox"]').val())){
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTileTwinWin).find('[id^="koinputbox"]').attr("id"), "KO % of Initial should be greater than strike(%)", thisTileTwinWin);
                return false;
            }
        
                else if($(thisTileTwinWin).find('[id^="kiinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val())[selectedBankIndex].TwinwinOUT) < parseFloat($(thisTileTwinWin).find('[id^="kiinputbox"]').val())){
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTileTwinWin).find('[id^="kiinputbox"]').attr("id"), "KI % of Initial should be less than strike(%)", thisTileTwinWin);
                return false;
            }
        }
    
        if ($(thisTileTwinWin).find('[id^="hdnfinalTokenTwinWin"]').val() == "" || $(thisTileTwinWin).find('[id^="TwinWinPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileTwinWin).find('[id^="TwinWinPrices"]')[0].firstChild.innerHTML == "") {
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').attr("id"), "Order Execution Failed!", thisTileTwinWin);
                return false;
        }
        
        if(parseFloat(JSON.parse($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').val())[selectedBankIndex].TwinwinOUT) <= 0){
                if(_flag == false){

                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTileTwinWin).find('[id^="hdnChartPricesTwinWin"]').attr("id"), "Prices can not be negative 0r zero, Order Execution Failed!", thisTileTwinWin);
                return false;
        }

    }catch(er){
        console.log(er.message);
    }

}

//  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.

function ChangeSolveForTwinWin(solveFor, thisTileTwinWin,calledFromIndexTwinWin) {
    try {
        if (calledFromIndexTwinWin != undefined){
                if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                    $(thisTileTwinWin).find('[id^="strikeipbox"]').prop('disabled', true);
                    $(thisTileTwinWin).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTileTwinWin).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').prop('disabled', false);
                    // checkupfrontPriceTwinWin(thisTileTwinWin); //LGTGTWINT-1095
                    checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val().trim(), thisTileTwinWin) //  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                    $(thisTileTwinWin).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTileTwinWin).find('[id^="IBPriceipbox"]').prop('disabled', true); ////LGTGTWINT-1095
                    $(thisTileTwinWin).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').prop('disabled', true); ////LGTGTWINT-1095
                    // checkupfrontPriceTwinWin(thisTileTwinWin);  //LGTGTWINT-1095
                    checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val().trim(), thisTileTwinWin) //  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                    $(thisTileTwinWin).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTileTwinWin).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTileTwinWin).find('[id^="couponipbox"]').prop('disabled', true);
                    $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').prop('disabled', false); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for TwinWin and DRA
                    // checkupfrontPriceTwinWin(thisTileTwinWin);  //LGTGTWINT-1095
                    checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val().trim(), thisTileTwinWin)//  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                }
        }
        else {
            if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                $(thisTileTwinWin).find('[id^="strikeipbox"]').prop('disabled', true);
                $(thisTileTwinWin).find('[id^="IBPriceipbox"]').prop('disabled', false); //LGTGTWINT-1095
                $(thisTileTwinWin).find('[id^="couponipbox"]').prop('disabled', false);
                $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').prop('disabled', false); //LGTGTWINT-1095
                // checkupfrontPriceTwinWin(thisTileTwinWin);  //LGTGTWINT-1095
                checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val().trim(), thisTileTwinWin,true)//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                $(thisTileTwinWin).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileTwinWin).find('[id^="IBPriceipbox"]').prop('disabled', true);
                $(thisTileTwinWin).find('[id^="couponipbox"]').prop('disabled', false);
                $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').prop('disabled', true); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for TwinWin and DRA
                // checkupfrontPriceTwinWin(thisTileTwinWin);  //LGTGTWINT-1095
                checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val().trim(), thisTileTwinWin,true)//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                $(thisTileTwinWin).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileTwinWin).find('[id^="IBPriceipbox"]').prop('disabled', false); //LGTGTWINT-1095
                $(thisTileTwinWin).find('[id^="couponipbox"]').prop('disabled', true);
                $(thisTileTwinWin).find('[id^="txtupfrontTwinWin"]').prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeTwinWin($(thisTileTwinWin).find('[id^="ddlKOKIType"]').val().trim(), thisTileTwinWin,true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
                // checkupfrontPriceTwinWin(thisTileTwinWin);  //LGTGTWINT-1095

            }

    }
    } catch (error) {
    }
}