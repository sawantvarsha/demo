$.support.cors = true;
var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var ContractAmtPhoenix;
var CouponFreq;
var tempShareName;
var arrPhoenix = [];
var maxPhoenix;
var finalResponseDataPhoenix;
var finalTokenPhoenix;
var repriceObjectPhoenix;
var TimerPhoenix = 0;
var finalObjPhoenix;
var getddlList;
var idPhoenix = 18;
var dateObj = ""
var globalDefaultSharesArrayPhoenix = ["NFLX.OQ", "MSFT.OQ", "AMZN.OQ"];  //LGTGTWINT-1723 Instant Pricer : Remove FB.OQ ticker from default notes payoff's.

// To load the Phoenix tile 
function onLoadPhoenix(currId,isProductCopiedPhoenix) {
    try {
      
        setDeafaultValuesPhoenix(currId,isProductCopiedPhoenix);
        thisTilePhoenix = document.getElementById("td" + currId);
        $(thisTilePhoenix).find('[id^="OverlayDiv"]').hide();

        sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        $(thisTilePhoenix).find('[id^="btnBestPricePhoenix"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        // clearInterval($(thisTilePhoenix).find('[id^="hdnintervalID"]').val());  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTilePhoenix,'[id^="btnBestPricePhoenix"]', false);
        clearPricerTable(thisTilePhoenix);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTilePhoenix).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
        $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html("");
        //end

        $(thisTilePhoenix).find("div.card input[type='text'],div.card input[type='search'],div.card select").on('change', function () {

            thisTilePhoenix = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTilePhoenix).find('[id^="btnBestPricePhoenix"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 25 July 2023
            $(thisTilePhoenix).find('[id^="btnEmailQuote"]').attr("disabled", true);  
            $(thisTilePhoenix).find('[id^="BookTradePhoenix"]').attr("disabled", true);
            $(thisTilePhoenix).find('[id^="OrderEmail"]').attr("disabled",true);
            //END
            clearInterval($(thisTilePhoenix).find('[id^="hdnintervalID"]').val());
           $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTilePhoenix).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html("");
            //End

            clearPricerTable(thisTilePhoenix);
            mapleLoaderStop(thisTilePhoenix,'[id^="btnBestPricePhoenix"]', false);  // Added Loader function ||
            $(thisTilePhoenix).find('[id^="btnEmailQuote"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTilePhoenix).find('[id^="BookTradePhoenix"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTilePhoenix).find('[id^="OrderEmail"]').attr("disabled",true);//LGTGTWINT-1981 || RizwanS || 12 May 2023   
        })
 
         $(thisTilePhoenix).find(" div.card .amtPopup").on('select', function () {  // INT1FIN47-768 Gateway Markets Instant Pricing issue
 
             thisTilePhoenix = $(this).parents('.sorting')[0];
             sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
             $(thisTilePhoenix).find('[id^="btnBestPricePhoenix"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
             clearInterval($(thisTilePhoenix).find('[id^="hdnintervalID"]').val());
            $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
             clearPricerTable(thisTilePhoenix);

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTilePhoenix).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html("");
            //End

             mapleLoaderStop(thisTilePhoenix,'[id^="btnBestPricePhoenix"]', false);
             $(thisTilePhoenix).find('[id^="btnEmailQuote"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
             $(thisTilePhoenix).find('[id^="BookTradePhoenix"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
             $(thisTilePhoenix).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023 
             
          })


        $(thisTilePhoenix).find('[id^="ddlKOKIType"]').on("change", function() {
            try {
             
            thisTilePhoenix = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTilePhoenix,"btnBestPricePhoenix");    
           $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val("");
           //End
            validation_clear(); //To Remove highlighted part if no error 
            checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val().trim(), thisTilePhoenix);

            } catch (error) {
                console.log(error.message);
            }
        });
        //aded by rutika on 26/04/2022 for calculating tenor when changed in input box
         //Start

        $(thisTilePhoenix).find('[id^="tenor_Phoenix"]').on("change", function() {
            try {
        
            thisTilePhoenix = $(this).parents(".sorting")[0];
            let currId=   thisTilePhoenix.id.match(/\d+$/)[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTilePhoenix,"btnBestPricePhoenix");    
            $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val("");
            //End
            if( $(thisTilePhoenix).find('[id^="tenorddl"]').val() == "M"){

                if(Number($(this).parents(".sorting").find('[id^="tenor_Phoenix"]').val()) > Number(FCNAllowedTenorinMonths) || $(this).parents(".sorting").find('[id^="tenor_Phoenix"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_Phoenix"]').val() == ""){
                    ValidateField($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').attr("id"), "Please enter valid tenor.", thisTilePhoenix);
                    return false;
                }
            } else{
                 if(Number($(this).parents(".sorting").find('[id^="tenor_Phoenix"]').val()) > Number(PhoenixAllowedTenorinYears) || $(this).parents(".sorting").find('[id^="tenor_Phoenix"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_Phoenix"]').val() == ""){
                    ValidateField($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').attr("id"), "Please enter valid tenor.", thisTilePhoenix);
                    return false;
                }
            }
            // calculateTenor(currId); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023            

            }   catch (error) {
                console.log(error.message);
            }
        });


        $(thisTilePhoenix).find('[id^="tenorddl"]').on("change", function () {
            try {
                
                thisTilePhoenix = $(this).parents(".sorting")[0];
                let currId=   thisTilePhoenix.id.match(/\d+$/)[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTilePhoenix,"btnBestPricePhoenix");    
                $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val("");
                //End
                if( $(thisTilePhoenix).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_Phoenix"]').val()) > Number(FCNAllowedTenorinMonths)){
                        ValidateField($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').attr("id"), "Please enter valid tenor.", thisTilePhoenix);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_Phoenix"]').val()) > Number(PhoenixAllowedTenorinYears)){
                        ValidateField($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').attr("id"), "Please enter valid tenor.", thisTilePhoenix);
                        return false;
                    }
                }
    
            // calculateTenor(currId); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023                
               
            } catch (error) {
                console.log(error);
            }
        });

        //End
        
        checkSolveForPhoenix($(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').val(), thisTilePhoenix)

        $(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').on('change', function (event) {
            thisTilePhoenix = $(this).parents('.sorting')[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTilePhoenix,"btnBestPricePhoenix");    
           $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val("");
           //End
           ChangeSolveForPhoenix($(this).val(), thisTilePhoenix); //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.

        });

        shareCount = 0;
        $(thisTilePhoenix).find('[id^="shareDivPhoenix"]').click(function () {
            $(this).find('input[type="search"]').focus();
        });

        // Check for upfront/IB Price 

           $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').on("change", function() {
            try {
             
            thisTilePhoenix = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTilePhoenix,"btnBestPricePhoenix");    
           $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val("");
           //End

            if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

                let _ibprice =   parseFloat(100 -  Number($(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').val())).toFixed(2);;

                $(thisTilePhoenix).find('[id^="IBPriceipbox"]').val(_ibprice);

            }

            } catch (error) {
                console.log(error.message);
            }
        });

        $(thisTilePhoenix).find('[id^="IBPriceipbox"]').on("change", function() {
            try {
             
            thisTilePhoenix = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTilePhoenix,"btnBestPricePhoenix");    
           $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val("");
           //End

            if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

                let _upfront =  parseFloat(100 -  Number($(thisTilePhoenix).find('[id^="IBPriceipbox"]').val())).toFixed(2);

                $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').val(_upfront);

            }

            } catch (error) {
                console.log(error.message);
            }
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        //Start
        $(thisTilePhoenix).find('.ddlShares').on("focusout", function (){   
        
            //Added for LGTGTWINT-1292 | Chaitanya M | 28 Feb 2023
            _ccylistPhoenix = getExchangeAndCcyFromBasket($(thisTilePhoenix).find('[id^="shareDivPhoenix"]')[0], 'share')
            listnames = _ccylistPhoenix;
            if(_ccylistPhoenix.length >=4){
                return false;
            } 
        validatesharebasket(thisTilePhoenix,"shareNamePhoenix");  
        sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]);
        EQCResetPayoff(thisTilePhoenix,"btnBestPricePhoenix");    
       $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
        $(thisTilePhoenix).find('[id^="btnEmailQuote"]').attr("disabled", true);// added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
        $(thisTilePhoenix).find('[id^="BookTradePhoenix"]').attr("disabled", true);// added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023     
        $(thisTilePhoenix).find('[id^="OrderEmail"]').attr("disabled",true);//LGTGTWINT-1981 || RizwanS || 12 May 2023  
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        $(thisTilePhoenix).find("div.card .ddlShares").on("keydown", function(){
        
            $("#bodyDiv").hide();
            sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTilePhoenix,"btnBestPricePhoenix");   

           $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTilePhoenix).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTilePhoenix).find('[id^="BookTradePhoenix"]').attr("disabled", true);           
            $(thisTilePhoenix).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023 
        });
     
        //End
        //Added for LGTGTWINT-1077 Instant Pricing: Input length for all fields for all payoffs | Chaitanya M | 28-01-2023
        $(thisTilePhoenix).find('[id^="tenor_Phoenix"]').on("keyup", function (){            

             InputLengthCheckEQC(thisTilePhoenix, "tenor_Phoenix",3); 
        });

        $(thisTilePhoenix).find("[id^='strikeipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTilePhoenix, "strikeipbox",8); //Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            $(thisTilePhoenix).find('[id^="EQCRfqidpnl"]').hide();
            $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTilePhoenix).find("[id^='txtupfrontPhoenix']").on("keyup", function(){
             InputLengthCheckEQC(thisTilePhoenix, "txtupfrontPhoenix",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
    
        });

        $(thisTilePhoenix).find("[id^='kiinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTilePhoenix, "kiinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTilePhoenix).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTilePhoenix).find("[id^='koinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTilePhoenix, "koinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTilePhoenix).find('[id^="EQCRfqidpnl"]').hide();//LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html("");
            //End

        });
        
        $(thisTilePhoenix).find("[id^='couponipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTilePhoenix, "couponipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTilePhoenix).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTilePhoenix).find("[id^='IBPriceipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTilePhoenix, "IBPriceipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
        
        });

        $(thisTilePhoenix).find("[id^='noncallinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTilePhoenix, "noncallinputbox",3);
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTilePhoenix).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        //Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
        $(thisTilePhoenix).find('[id^="ContractAmtPhoenix"]').on("change", function(){
            thisTilePhoenix = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTilePhoenix,"btnBestPricePhoenix");    
           $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val("");
           //End
          if($(thisTilePhoenix).find('[id^="ContractAmtPhoenix"]').val() == ""){
            $(thisTilePhoenix).find('[id^="ContractAmtPhoenix"]').val("0");
            return false; 
          }    
                  
        });        
       
        //End

    } catch (error) {
        console.log(error.message)
    }
}

// To set default values for Phoenix
function setDeafaultValuesPhoenix(currId,isProductCopiedPhoenix) {
    try {
        // Added logic for getting current tile : Onkar E.//
        thisTilePhoenix = document.getElementById("td" + currId);


        //Configured UI fileds Start :: || 08 Feb 2023

        if(DRAFCNUpfrontYN.toUpperCase() == "YES" || DRAFCNUpfrontYN.toUpperCase().includes("Y")){

            $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').val("0.00"); // defualt value
            $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').hide(); //UI filed
            $(thisTilePhoenix).find('[id^="upfrontuilbl"]').hide(); //UI label
            $(thisTilePhoenix).find('[id^="txtupfrontlbl"]').hide(); // hide label order popup
            $(thisTilePhoenix).find('[id^="txtupfrontVal"]').hide(); //Order popup filed
            
        }else{
            $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').val("0.00");
        }

        // END

        $(thisTilePhoenix).find('[id^="ContractAmtPhoenix"]').val("1,000,000.00");
        $(thisTilePhoenix).find("[id^='ContractAmtPhoenix']").attr('maxlength','14');
        $(thisTilePhoenix).find('[id^="strikeipbox"]').val("92.00");
        $(thisTilePhoenix).find('[id^="couponipbox"]').val("8.00");
        $(thisTilePhoenix).find('[id^="noncallinputbox"]').val("1");
        $(thisTilePhoenix).find('[id^="tenor_Phoenix"]').val("6");
        $(thisTilePhoenix).find('[id^="IBPriceipbox"]').val("0.00"); //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
        $(thisTilePhoenix).find('[id^="kiinputbox"]').val("65.00");//Chaitanya M 4-April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        $(thisTilePhoenix).find('[id^="koinputbox"]').val("105.00");//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        callDropDownFunction($(thisTilePhoenix).find('[id^="shareName"]'), "Phoenix", currId);
        EQProductsFillCcy(thisTilePhoenix, "ddlPhoenixCcy");
        clearPricerTable(thisTilePhoenix);
        $(thisTilePhoenix).find('[id^="shareNameCntrlPhoenix"]').html("");
        $(thisTilePhoenix).find('[id^="hiddenshareinputPhoenix"]').html("");
        $(thisTilePhoenix).find('[id^="CCY_Phoenix"]').html("");

        if(!isProductCopiedPhoenix){
        for (let s=0;s<clientConfigdata.EQCPHX.MinSharesInBaskets;s++){
            createElementInBasket(thisTilePhoenix, 'shareDivPhoenix', sessionStorage.getItem(thisTilePhoenix.id)!=undefined?sessionStorage.getItem(thisTilePhoenix.id).split(" ")[s]:globalDefaultSharesArrayPhoenix[s]); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
       
        }
    }
       
        $(thisTilePhoenix).find('[id^="shareName"]')[0].placeholder = "";
        $(thisTilePhoenix).find('[id^="CCY_Phoenix"]').html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);


        

    } catch (error) {
        console.log(error.message)
    }
}

function checkSolveForPhoenix(solveFor, thisTilePhoenix,calledFromIndexPhoenix) {
    try {
        if (calledFromIndexPhoenix != undefined){
                if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                    $(thisTilePhoenix).find('[id^="strikeipbox"]').prop('disabled', true);
                    $(thisTilePhoenix).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTilePhoenix).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').prop('disabled', false);
                    // checkupfrontPricePhoenix(thisTilePhoenix); //LGTGTWINT-1095
                    checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val(), thisTilePhoenix, calledFromIndexPhoenix)
                } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                    $(thisTilePhoenix).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTilePhoenix).find('[id^="IBPriceipbox"]').prop('disabled', true); ////LGTGTWINT-1095
                    $(thisTilePhoenix).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').prop('disabled', true); ////LGTGTWINT-1095
                    // checkupfrontPricePhoenix(thisTilePhoenix);  //LGTGTWINT-1095
                    checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val(), thisTilePhoenix, calledFromIndexPhoenix)
                } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                    $(thisTilePhoenix).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTilePhoenix).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTilePhoenix).find('[id^="couponipbox"]').prop('disabled', true);
                    $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').prop('disabled', false); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for Phoenix and DRA
                    // checkupfrontPricePhoenix(thisTilePhoenix);  //LGTGTWINT-1095
                    checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val(), thisTilePhoenix, calledFromIndexPhoenix)
                }
        }
        else {
            if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                $(thisTilePhoenix).find('[id^="strikeipbox"]').prop('disabled', true);
                $(thisTilePhoenix).find('[id^="IBPriceipbox"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                $(thisTilePhoenix).find('[id^="couponipbox"]').val("8.00").prop('disabled', false);
                $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                // checkupfrontPricePhoenix(thisTilePhoenix);  //LGTGTWINT-1095
                checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val(), thisTilePhoenix)
            } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                $(thisTilePhoenix).find('[id^="strikeipbox"]').val("92.00").prop('disabled', false);
                $(thisTilePhoenix).find('[id^="IBPriceipbox"]').prop('disabled', true);
                $(thisTilePhoenix).find('[id^="couponipbox"]').val("8.00").prop('disabled', false);
                $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').prop('disabled', true); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for Phoenix and DRA
                // checkupfrontPricePhoenix(thisTilePhoenix);  //LGTGTWINT-1095
                checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val(), thisTilePhoenix)
            } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                $(thisTilePhoenix).find('[id^="strikeipbox"]').val("92.00").prop('disabled', false);
                $(thisTilePhoenix).find('[id^="IBPriceipbox"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                $(thisTilePhoenix).find('[id^="couponipbox"]').prop('disabled', true);
                $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val(), thisTilePhoenix);
                // checkupfrontPricePhoenix(thisTilePhoenix);  //LGTGTWINT-1095

            }

    }
    } catch (error) {
    }
}
function checkKOKITypePhoenix(KOKIType, thisTilePhoenix, calledFromIndex) {
    try {
        if(calledFromIndex != true){
        if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
            $(thisTilePhoenix).find('[id^="koinputbox"]').prop('disabled', false); //Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTilePhoenix).find('[id^="kiinputbox"]').prop("disabled", true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTilePhoenix).find('[id^="noncallinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        }  else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
            $(thisTilePhoenix).find('[id^="koinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTilePhoenix).find('[id^="kiinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTilePhoenix).find('[id^="noncallinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
            $(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled", true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTilePhoenix).find('[id^="kiinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTilePhoenix).find('[id^="noncallinputbox"]').prop('disabled', true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        } else if (KOKIType == "NOKINOKO") {
            $(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled", true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTilePhoenix).find('[id^="kiinputbox"]').prop('disabled', true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTilePhoenix).find('[id^="noncallinputbox"]').prop('disabled', true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        }
        }else{
            if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
                $(thisTilePhoenix).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTilePhoenix).find('[id^="kiinputbox"]').prop("disabled", true);
                $(thisTilePhoenix).find('[id^="noncallinputbox"]').prop('disabled', false);
            } else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
                $(thisTilePhoenix).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTilePhoenix).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTilePhoenix).find('[id^="noncallinputbox"]').prop('disabled', false);
            } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
                $(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTilePhoenix).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTilePhoenix).find('[id^="noncallinputbox"]').prop('disabled', true);
            } else if (KOKIType == "NOKINOKO") {
                $(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTilePhoenix).find('[id^="kiinputbox"]').prop('disabled', true);
                $(thisTilePhoenix).find('[id^="noncallinputbox"]').prop('disabled', true);
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

function checkupfrontPricePhoenix(thisTilePhoenix){

    try{

        let _ibprice =   parseFloat(100 -  Number($(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').val())).toFixed(2);;

        $(thisTilePhoenix).find('[id^="IBPriceipbox"]').val(_ibprice);
    
        let _upfront =  parseFloat(100 -  Number($(thisTilePhoenix).find('[id^="IBPriceipbox"]').val())).toFixed(2);
    
        $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').val(_upfront);

    }catch(er){
        
        console.log(er.message);

    }
    

}

var globalSolveForValuePhoenix='';
// To get best price for Phoenix
function getBestPricePhoenix(that) {
    try {
       

        thisTilePhoenix = $(that).parents(".sorting")[0];
        
        console.log('Start Interval value =' + $(thisTilePhoenix).find('[id^="hdnintervalID"]').val());

        $(thisTilePhoenix).find('[id^="btnBestPricePhoenix"]').attr("disabled", true); // INT1FIN47-768 Gateway Markets Instant Pricing issue

        var requestIDPhoenix = "";

        requestIDPhoenix = requestIDPhoenix + RequestIDGenerator(60);

        $(thisTilePhoenix).find('[id^="hdnRequestID"]').val(requestIDPhoenix);  //INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTilePhoenix,'[id^="btnBestPricePhoenix"]', false);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        $(thisTilePhoenix).find('[id^="EQCRfqidpnl"]').hide();
        $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html("");
        //End

        globalSolveForValuePhoenix = $(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').val().trim();

        clearInterval($(thisTilePhoenix).find('[id^="hdnintervalID"]').val());

        console.log('After clear Interval value =' + $(thisTilePhoenix).find('[id^="hdnintervalID"]').val());

        $(thisTilePhoenix).find('[id^="hdnintervalID"]').val("");


        TileId = that.id.match(/\d+$/)[0];

        sessionStorage.setItem("poolingTimer_" + TileId, 0);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        thisTilePhoenix = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        console.log(TileId, thisTilePhoenix, productName);
        getddlList = $.trim($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val());

        $(thisTilePhoenix).find('[id^="TBLPhoenix"]' + " td").each(function () {
            //Clear prices || Tina K || 11-Sep-2019
            $(this).html("-");
        })
        validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
        clearPricerTable(thisTilePhoenix); //To clear prices after clicking best price || Tina K || 20-Nov-2019
        //Validation conditions added : Tina Kshirsagar : 6-09-2019

        
        let tenorNumb = $(thisTilePhoenix).find("[id^='tenor_Phoenix']").val();
        let tenorstring = $(thisTilePhoenix).find("[id^='tenorddl']").val();
        let _tenor = tenorNumb + tenorstring;

        let _tenorinMonths = "";

        if(tenorstring != "M"){

            _tenorinMonths =  parseFloat($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').val()) * 12;

        }else{

            _tenorinMonths =  parseFloat($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').val());
        }
        
        if ($(thisTilePhoenix).find('[id^="shareDivPhoenix"]')[0].childNodes.length <= 1) {     
            ValidateField($(thisTilePhoenix).find('[id^="shareDivPhoenix"]').attr('id'), "Please Enter Valid Shares", thisTilePhoenix);
            return false  
        } else if ($.trim($(thisTilePhoenix).find('[id^="ContractAmtPhoenix"]').val()) == '' || parseFloat($(thisTilePhoenix).find('[id^="ContractAmtPhoenix"]').val()) < 0) {
            ValidateField($(thisTilePhoenix).find('[id^="ContractAmtPhoenix"]').attr('id'), "Please Enter Valid Notional", thisTilePhoenix); // LGTGTWINT-1487 | Chaitanya M | 24 Feb 2023
            return false
        } else if ($.trim($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').val()) == '' || parseFloat($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').val()) <=0) {
            ValidateField($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').attr('id'), "Please enter valid tenor", thisTilePhoenix);
            return false
        }else if ($.trim($(thisTilePhoenix).find('[id^="ddlPhoenixCcy"]').val()) == '') {
            ValidateField($(thisTilePhoenix).find('[id^="ddlPhoenixCcy"]').attr('id'), "Please Select Valid Ccy", thisTilePhoenix);
            return false
        } else if ((parseFloat($(thisTilePhoenix).find('[id^="koinputbox"]').val()) == "" || parseFloat($(thisTilePhoenix).find('[id^="koinputbox"]').val()) <= Number(DRAFCNMinKO) || parseFloat($(thisTilePhoenix).find('[id^="koinputbox"]').val()) > Number(DRAFCNMaxKO)) && $(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled") != true) {
            ValidateField($(thisTilePhoenix).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO (%) Initial.", thisTilePhoenix);
            return false;
        } else if ((parseFloat($(thisTilePhoenix).find('[id^="kiinputbox"]').val()) == "" || parseFloat($(thisTilePhoenix).find('[id^="kiinputbox"]').val()) <= 0) && $(thisTilePhoenix).find('[id^="kiinputbox"]').prop("disabled") != true) {
            ValidateField($(thisTilePhoenix).find('[id^="kiinputbox"]').attr("id"), "Please Enter Valid KI (%)", thisTilePhoenix);
            return false;
        } else if (($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "3M")) {
            ValidateField($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTilePhoenix);
            return false;
        } else if (($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "QUARTERLY" || $(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "1M")) {
            ValidateField($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTilePhoenix);
            return false;
        } else if (($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "9M")) {
            ValidateField($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTilePhoenix);
            return false;
        }  else if (($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "6M")) {
            ValidateField($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTilePhoenix);
            return false;
        } else if($(thisTilePhoenix).find('[id^="noncallinputbox"]').val() <= 0 || $(thisTilePhoenix).find('[id^="noncallinputbox"]').val() == "") {
            ValidateField($(thisTilePhoenix).find('[id^="noncallinputbox"]').attr("id"), "Non Call can not be zero negative. ", thisTilePhoenix);
            return false; 
        } else if($(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "MONTHLY")){
            if(parseFloat($(thisTilePhoenix).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths)){
                ValidateField($(thisTilePhoenix).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTilePhoenix);
                return false;
            }
        } else if($(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY")){
            if(parseFloat($(thisTilePhoenix).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 2)){
                ValidateField($(thisTilePhoenix).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTilePhoenix);
                return false;
            }
        } else if($(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "QUARTERLY")){
            if(parseFloat($(thisTilePhoenix).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 3)){
                ValidateField($(thisTilePhoenix).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTilePhoenix);
                return false;
            }
        } else if($(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY")){
            if(parseFloat($(thisTilePhoenix).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 6)){
                ValidateField($(thisTilePhoenix).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTilePhoenix);
                return false;
            }
        } else if($(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY")){
            if(parseFloat($(thisTilePhoenix).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 12)){
                ValidateField($(thisTilePhoenix).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTilePhoenix);
                return false;
            }
        }

        
        if ($(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').val().split("(")[0].trim().toUpperCase() == "STRIKE") {
            if (parseFloat($(thisTilePhoenix).find('[id^="IBPriceipbox"]').val()) == "" || parseFloat($(thisTilePhoenix).find('[id^="IBPriceipbox"]').val()) <= 0 || parseFloat($(thisTilePhoenix).find('[id^="IBPriceipbox"]').val()) > 100) {
                ValidateField($(thisTilePhoenix).find('[id^="IBPriceipbox"]').attr("id"), "Price % must be greater than 0 and less than 100", thisTilePhoenix);
                return false;
            } else if (parseFloat($(thisTilePhoenix).find('[id^="couponipbox"]').val()) == "" || parseFloat($(thisTilePhoenix).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTilePhoenix).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTilePhoenix).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon (%)", thisTilePhoenix);
                return false;
            }else if ($(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTilePhoenix).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTilePhoenix).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTilePhoenix).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTilePhoenix).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%)", thisTilePhoenix);
                return false;
            }
        } else if ($(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').val().split("(")[0].trim().toUpperCase() == "COUPON") {
            if (parseFloat($(thisTilePhoenix).find('[id^="strikeipbox"]').val()) == "" || parseFloat($(thisTilePhoenix).find('[id^="strikeipbox"]').val()) <= 0 || parseFloat($(thisTilePhoenix).find('[id^="strikeipbox"]').val()) > 100) {
                ValidateField($(thisTilePhoenix).find('[id^="strikeipbox"]').attr("id"), " Strike % must be greater than 0 and less than or equal to 100.", thisTilePhoenix);
                return false;
            } else if (parseFloat($(thisTilePhoenix).find('[id^="IBPriceipbox"]').val()) == "" || parseFloat($(thisTilePhoenix).find('[id^="IBPriceipbox"]').val()) <= 0 || parseFloat($(thisTilePhoenix).find('[id^="IBPriceipbox"]').val()) > 100) {
                ValidateField($(thisTilePhoenix).find('[id^="IBPriceipbox"]').attr("id"), "Price % must be greater than 0 and less than 100", thisTilePhoenix);
                return false;
            } else if ($(thisTilePhoenix).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTilePhoenix).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTilePhoenix).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTilePhoenix).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%)", thisTilePhoenix);
                return false;
            }else if ($(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled") != true && (parseFloat($(thisTilePhoenix).find('[id^="strikeipbox"]').val()) > parseFloat($(thisTilePhoenix).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTilePhoenix).find('[id^="strikeipbox"]').attr("id"),"Strike (%) should be less than KO (%)", thisTilePhoenix);
                return false;
            }else if ($(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTilePhoenix).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTilePhoenix).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTilePhoenix).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTilePhoenix).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%)", thisTilePhoenix);
                return false;
            }
        } else if ($(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').val().split("(")[0].trim().toUpperCase() == "IB PRICE") {
            if (parseFloat($(thisTilePhoenix).find('[id^="strikeipbox"]').val()) == "" || parseFloat($(thisTilePhoenix).find('[id^="strikeipbox"]').val()) <= 0 || parseFloat($(thisTilePhoenix).find('[id^="strikeipbox"]').val()) > 100) {
                ValidateField($(thisTilePhoenix).find('[id^="strikeipbox"]').attr("id"), " Strike % must be greater than 0 and less than or equal to 100.", thisTilePhoenix);
                return false;
            } else if (parseFloat($(thisTilePhoenix).find('[id^="couponipbox"]').val()) == "" ||parseFloat($(thisTilePhoenix).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTilePhoenix).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTilePhoenix).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon (%)", thisTilePhoenix);
                return false;
            } else if ($(thisTilePhoenix).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTilePhoenix).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTilePhoenix).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTilePhoenix).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%)", thisTilePhoenix);
                return false;
            }else if ($(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled") != true && (parseFloat($(thisTilePhoenix).find('[id^="strikeipbox"]').val()) > parseFloat($(thisTilePhoenix).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTilePhoenix).find('[id^="strikeipbox"]').attr("id"),"Strike (%) should be less than KO (%)", thisTilePhoenix);
                return false;
            }else if ($(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTilePhoenix).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTilePhoenix).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTilePhoenix).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTilePhoenix).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%)", thisTilePhoenix);
                return false;
        } //Validation End
        }


         // Added by RizwanS for tenor validation before pricing || 03 Jan 2022 ||

         if( $(thisTilePhoenix).find('[id^="tenorddl"]').val() == "M"){

            if(Number($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').val()) > Number(FCNAllowedTenorinMonths)){
                ValidateField($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').attr("id"), "Please enter valid tenor.", thisTilePhoenix);
                return false;
            }

        } else{

             if(Number($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').val()) > Number(PhoenixAllowedTenorinYears)){
                ValidateField($(thisTilePhoenix).find('[id^="tenor_Phoenix"]').attr("id"), "Please enter valid tenor.", thisTilePhoenix);
                return false;
            }
        }
        
        // END

        $("body").css("opacity", "0.9");

    
        if ($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val() == "NOKIKODC") {
            KIPerc = "";
            KIType = "";
            KOPerc = $(thisTilePhoenix).find('[id^="koinputbox"]').val();
            KOType = "American";

        } else if ($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val() == "NOKIKOPE") {
            KIPerc = "";
            KIType = "";
            KOPerc = $(thisTilePhoenix).find('[id^="koinputbox"]').val();
            KOType = "European";

        } else if ($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val() == "KIDCKODC") {
            KIPerc = $(thisTilePhoenix).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTilePhoenix).find('[id^="koinputbox"]').val();
            KIType = "American";
            KOType = "American";
        
        } else if ($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val() == "KIDCKOPE") {
            KIPerc = $(thisTilePhoenix).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTilePhoenix).find('[id^="koinputbox"]').val();
            KIType = "American";
            KOType = "European";

        } else if ($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val() == "KIEURKODC") {
            KIPerc = $(thisTilePhoenix).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTilePhoenix).find('[id^="koinputbox"]').val();
            KIType = "European";
            KOType = "American";

        } else if ($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val() == "KIEURKOPE") {
            KIPerc = $(thisTilePhoenix).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTilePhoenix).find('[id^="koinputbox"]').val();
            KIType = "European";
            KOType = "European";
        } else if ($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val() == "KIDCNOKO") {
            KIPerc = $(thisTilePhoenix).find('[id^="kiinputbox"]').val();
            KOPerc = ""
            KIType = "American";
            KOType = "";
        } else if ($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val() == "KIEURNOKO") {
            KIPerc = $(thisTilePhoenix).find('[id^="kiinputbox"]').val();
            KOPerc = ""
            KIType = "European";
            KOType = "";
        } else if ($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val() == "NOKINOKO") {
            KIPerc = "";
            KOPerc = ""
            KIType = "";
            KOType = "";
        }
        let solveForPhoenix = "";
        if ($(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').val().split("(")[0].trim().toUpperCase() == "STRIKE") {
            solveForPhoenix = "CONVERSION_STRIKE";
        } else if ($(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').val().split("(")[0].trim().toUpperCase() == "IB PRICE") {
            solveForPhoenix = "PRICE";
        } else if ($(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').val().split("(")[0].trim().toUpperCase() == "COUPON") {
            solveForPhoenix = "COUPON";
        }


        let _upfront = "";

        if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

           _upfront =  $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').val().trim() ?$(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').val().trim() :0 

        }else{

            _upfront =  "0.00"; 
        }
    

        let exchangeList = getExchangeAndCcyFromBasket($(thisTilePhoenix).find('[id^="shareDivPhoenix"]')[0], 'exchange');
        let ccyList = getExchangeAndCcyFromBasket($(thisTilePhoenix).find('[id^="shareDivPhoenix"]')[0], 'ccy');
        let shareList = getExchangeAndCcyFromBasket($(thisTilePhoenix).find('[id^="shareDivPhoenix"]')[0], 'share');

        let _QuantoFlagPhoenix = "";
        uniqueCCY = ccyList.filter((item, i, ar) => ar.indexOf(item) === i);
        if(uniqueCCY.length==1){
            if($(thisTilePhoenix).find('[id^="ddlPhoenixCcy"]').val()== uniqueCCY[0]){
                _QuantoFlagPhoenix = "No";
            } else{
                _QuantoFlagPhoenix = "Yes";
            }
        }else{
            _QuantoFlagPhoenix = "Yes";
        }

        //End

        mapleLoaderStart(thisTilePhoenix,'[id^="btnBestPricePhoenix"]', false);


        // LGTGTWINT-1227 - Instant Pricing: EQC Ref missing for rfqs placed through instant pricing | 24 Feb 2023

           let _tenorPhoenix = ""

           if(tenorstring.toUpperCase().includes("M")){
           
            _tenorPhoenix= "MONTH";
           
           }else{
           
            _tenorPhoenix= "YEAR";
           }

        //    let getRefPhoenix = "";
           
           let getRefPhoenix = getEQCRefrenceNumber(productName,KOType,KIType,tenorNumb,_tenorPhoenix,$(thisTilePhoenix).find('[id^="couponipbox"]').val(),_QuantoFlagPhoenix,"Worst of");
           
           $(thisTilePhoenix).find('[id^="hdnRefnumber"]').val(getRefPhoenix); //LGTGTWINT-1589 Instant Pricing : EQC ref different on instant pricer and order details,quote mail and order mail


        // END        


        QuoteObject = {

                Ccy: $(thisTilePhoenix).find('[id^="ddlPhoenixCcy"]').val().trim(),
                CouponFrequency: $(thisTilePhoenix).find('[id^="ddlCouponFrequency"]').val().toUpperCase(), 
                CouponPerc:  $(thisTilePhoenix).find('[id^="couponipbox"]').val(),
                EntityID: EntityID,
                Exchange1:  exchangeList[0],
                Exchange2: exchangeList[1],
                Exchange3:  exchangeList[2],
                Exchange4:  exchangeList[3]?? "",
                UnderlyingCode1: shareList[0],
                UnderlyingCode2: shareList[1],
                UnderlyingCode3: shareList[2],
                UnderlyingCode4: shareList[3] ?? "" ,
                GuaranteedDuration: "",
                KIPerc: KIPerc,
                KIType: KIType,
                KOType: KOType,
                KOPerc: KOPerc,
                Notional: $(thisTilePhoenix).find('[id^="ContractAmtPhoenix"]').val().replace(/,/g, "").split(".")[0],
                PPDetails: "",
                PricePerc: $(thisTilePhoenix).find('[id^="IBPriceipbox"]').val(),
                QuantoYN: "NO", //Not in the scope for LGT Gateway
                RMName: "",
                SettlementDays: Number($(thisTilePhoenix).find('[id^="SettlWeeks"]').val().trim()),
                Tenor: _tenor,
                Type: "Phoenix",
                Upfront: _upfront,
                UserID: userName,
                nonCall: $(thisTilePhoenix).find('[id^="noncallinputbox"]').val(),
                SolveFor: solveForPhoenix,
                strikePerc: $(thisTilePhoenix).find('[id^="strikeipbox"]').val(),
                NonCallPeriods: $(thisTilePhoenix).find('[id^="noncallinputbox"]').val(),
                Branch: "SG",
                BuysideID:getRefPhoenix,
                CurrentTileID: TileId,
                CouponBarrier: "",//$(thisTilePhoenix).find('[id^="coupoBarrier"]').val(),
                CouponType:"Memory",
                StepdownPerc:"",//$(thisTilePhoenix).find('[id^="KOstepinputbox"]').val(),
                requestID:$(thisTilePhoenix).find('[id^="hdnRequestID"]').val(), //INT1FIN47-768 Gateway Markets Instant Pricing issue
                EQC_TOKEN: sessionStorage.getItem("EQC_Token").toString(),

        }

        console.log('Phoenix price req ', QuoteObject);

        getQuotePhoenix(QuoteObject, $(thisTilePhoenix).find('[id^="hdnintervalID"]')[0]);

        

    } catch (er) {
        console.log(er.message);

    }
}

// To get quote 
function getQuotePhoenix(QuoteObject, uniqueIntervalID) {
    try {

        var dataPhoenix = request_getDataFromAPI(QuoteObject, clientConfigdata.CommonMethods.NodeServer + "getBestPricePhoenix").then(dataPhoenix => {

            thisTilePhoenix = document.getElementById("td" + dataPhoenix.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataPhoenix.CurrentTileID, true);
            mapleLoaderStart(thisTilePhoenix,'[id^="btnBestPricePhoenix"]', false); 
            getUniqQuoteResponsePhoenix(thisTilePhoenix, dataPhoenix, uniqueIntervalID,QuoteObject.requestID); //INT1FIN47-768 Gateway Markets Instant Pricing issue 

        }).catch(error => { console.log(error); })

    } catch (err) {
        console.log(err.message);
    }
}

function getUniqQuoteResponsePhoenix(thisTilePhoenix, dataPhoenix, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var UIID = null;
        // Added by Atharva - EQC Timers - START
        isTimerStarted["td" + dataPhoenix.CurrentTileID] = false;
        myCounter["td" + dataPhoenix.CurrentTileID] = {};
        hasUserClickedEQC["td" + dataPhoenix.CurrentTileID] = false;
        $(thisTilePhoenix).find('[id^="hdnSelectedBank"]').val("");
       
        // END

        uniqueIntervalID.value = setInterval(function () {

            if(reqestID != $(thisTilePhoenix).find('[id^="hdnRequestID"]').val()){
                return false
            } // INT1FIN47-768 Gateway Markets Instant Pricing issue
            sessionStorage.setItem("quoteToken_" + thisTilePhoenix.id.match(/\d+$/)[0], "");
            sessionStorage.setItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0], "");

            sessionStorage.setItem("quoteToken_" + thisTilePhoenix.id.match(/\d+$/)[0], dataPhoenix['token']);
            sessionStorage.setItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0], dataPhoenix['responseData']);


            getFinalQuoteResponsePhoenix(sessionStorage.getItem("quoteToken_" + thisTilePhoenix.id.match(/\d+$/)[0]), sessionStorage.getItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]), thisTilePhoenix, uniqueIntervalID, reqestID);

        }, clientConfigdata.EQCPHX.PollInterval);


        console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
    } catch (error) {
        console.log(error)
    }
}

// To get price 
function getFinalQuoteResponsePhoenix(finalTokenPhoenix1, finalResponseDataPhoenix1, thisTilePhoenix, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var currentDateAndTime = new Date();

        sessionStorage.setItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0], finalResponseDataPhoenix1);

        sessionStorage.setItem("quoteToken_" + thisTilePhoenix.id.match(/\d+$/)[0], finalTokenPhoenix1);

        console.log("Phoenix RFQ's :: " + finalResponseDataPhoenix1 + " " + currentDateAndTime);
        
        Timer = Timer + 1;


        if (Number(sessionStorage.getItem("poolingTimer_" + thisTilePhoenix.id.match(/\d+$/)[0])) >= Number(DRAFCNrequestCount.toString().split(".")[0]) || sessionStorage.getItem("pricingToggle" + thisTilePhoenix.id.match(/\d+$/)[0]) == "false") { //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
            
            $(thisTilePhoenix).find('[id^="btnBestPricePhoenix"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval(uniqueIntervalID.value);
            mapleLoaderStop(thisTilePhoenix,'[id^="btnBestPricePhoenix"]', false);
            
            uniqueIntervalID.value = "";
            QuoteObject = "";
            $(thisTilePhoenix).find('[id^="OverlayDiv"]').hide();
     
            $("body").css("opacity", "");
            arrPhoenix = [];
            maxPhoenix = "";
            TimerPhoenix = 0;

            //Call Draw Graph
            // $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val(JSON.stringify(finalObjPhoenix));
            // if (finalObjPhoenix != null || finalObjPhoenix != undefined) {
            //     drawgraphPhoenix($(thisTilePhoenix).find('[id^="canvas"]').attr('id'));
            // }
            // INT1FIN47-768 Gateway Markets Instant Pricing issue

            return false;

        } else {
            var repriceObjectPhoenix = request_getDataFromAPI({
                "PPDetails": sessionStorage.getItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]),
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": thisTilePhoenix.id.match(/\d+$/)[0],
                "UserID":sessionStorage.getItem("EQC_UserName").toString(),
            }, clientConfigdata.CommonMethods.NodeServer + "getQuoteResponsePhoenix").then(repriceObjectPhoenix => {

                thisTilePhoenix = document.getElementById("td" + repriceObjectPhoenix.CurrentTileID);
                // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTilePhoenix).find('[id^="btnEmailQuote"]').attr("disabled", false);
                $(thisTilePhoenix).find('[id^="BookTradePhoenix"]').attr("disabled", false);
                $(thisTilePhoenix).find('[id^="OrderEmail"]').attr("disabled",false); //LGTGTWINT-1981 || RizwanS || 12 May 2023 
                if(reqestID != $(thisTilePhoenix).find('[id^="hdnRequestID"]').val()){
                    return false
                } //INT1FIN47-768Gateway Markets Instant Pricing issue

                sessionStorage.setItem("poolingTimer_" + repriceObjectPhoenix.CurrentTileID, Number(sessionStorage.getItem("poolingTimer_" + thisTilePhoenix.id.match(/\d+$/)[0])) + 1);
                
                finalObjPhoenix = (repriceObjectPhoenix['responseData']);

                sessionStorage.setItem("quoteToken_" + thisTilePhoenix.id.match(/\d+$/)[0], repriceObjectPhoenix['token']);
                sessionStorage.setItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]));
                // Sorted By Best Price LP'S                                
                finalObjPhoenix.sort(function (a, b) {
                    if (a.PhoenixOUT === null || a.PhoenixOUT == "" || a.PhoenixOUT == "Timeout" || a.PhoenixOUT.toUpperCase().trim() == "REJECTED" || a.PhoenixOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return 1;
                    } else if (b.PhoenixOUT === null || b.PhoenixOUT == "" || b.PhoenixOUT == "Timeout" || b.PhoenixOUT.toUpperCase().trim() == "REJECTED" || b.PhoenixOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return -1;
                    } else if (a.PhoenixOUT === b.PhoenixOUT) {
                        return 0;
                    }

                    if ($(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').val().split("(")[0].trim().toUpperCase() == "COUPON") {
                        return Number(a.PhoenixOUT) > Number(b.PhoenixOUT) ? -1 : 1;
                    } else {
                        return Number(a.PhoenixOUT) < Number(b.PhoenixOUT) ? -1 : 1;
                    }

                });
                maxPhoenix = finalObjPhoenix[0].PhoenixOUT;
                //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
                //$(thisTilePhoenix).find('[id^="EQCRfqidpnl"]').show();
                // $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html("");
                // $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html("RFQ ID: " + finalObjPhoenix[0].EP_ER_QuoteRequestId);
                //end
                // END
                //Removed || LGTGTWINT-1981 || RizwanS || 12 May 2023
                $(thisTilePhoenix).find('[id^="hdnfinalTokenPhoenix"]').val(sessionStorage.getItem("quoteToken_" + thisTilePhoenix.id.match(/\d+$/)[0]));
               
               
                if (sessionStorage.getItem("pricingToggle" + thisTilePhoenix.id.match(/\d+$/)[0]) == "true") {
                    // Added by Atharva - EQC Timers - START
                    var isNonBestPrice = false;
                    if(clientConfigdata.CommonMethods.NonBestPrice == "Y") {
                        isNonBestPrice = true;
                    }
                    else {
                        isNonBestPrice = false;
                    }
                    // every time in new request indexes might change so clearing.
                    mapIndexToBank["td"+repriceObjectPhoenix.CurrentTileID] = {};
                    // END
                    $(thisTilePhoenix).find('[id^="PhoenixBanksRow"]').empty();
                    $(thisTilePhoenix).find('[id^="PhoenixPrices"]').empty();
                    // Added by Atharva - EQC Timers - START
                    $(thisTilePhoenix).find('[id^="PhoenixTimerRow"]').empty();
                    if(!hasUserClickedEQC["td"+repriceObjectPhoenix.CurrentTileID]) {
                        $(thisTilePhoenix).find('[id^="hdnSelectedBank"]').val("");
                    }
                    var itr = 0;
                    // END
                    $(thisTilePhoenix).find('[id^="minMaxNotionalLimitRow"]').empty();


                    //Check for best price count || LGTGTWINT-1981 || RizwanS || 12 May 2023
                    if (NotesBestPriceDisplayCount != "") { 

                        let sliceCount = Number(NotesBestPriceDisplayCount); // Count to show best prices as per config set
                        
                        let productname = $(thisTilePhoenix).find(".productName").attr("id");

                        finalObjPhoenix = sliceEQCbestprices(finalObjPhoenix,productname,sliceCount);

                        // LGTGTWINT-2018 - Prices to be displayed for EAM entity on MSP and IP only when the input notional falls within min max range of CPs || RizwanS || 24 May 2023
                        
                        if(NotionalMinMaxCheck.toUpperCase() === 'YES' && parseFloat($(thisTilePhoenix).find('[id^="ContractAmtPhoenix"]').val().replace(/,/g, "")) > 0){  //RizwanS || LGTGTWINT-2153 || 27 Jun 2023

                            let _tempObj = [] 
                    
                            for(i=0;i<finalObjPhoenix.length;i++){
        
                                if(parseFloat($(thisTilePhoenix).find('[id^="ContractAmtPhoenix"]').val().replace(/,/g, "")) <= parseFloat(finalObjPhoenix[i].MaxNotional)
                                && parseFloat($(thisTilePhoenix).find('[id^="ContractAmtPhoenix"]').val().replace(/,/g, "")) >= parseFloat(finalObjPhoenix[i].MinNotional)){
                                    
                                        _tempObj.push(finalObjPhoenix[i]);
        
                                }else{
        
                                        finalObjPhoenix[i].PhoenixOUT = "-";
                                        finalObjPhoenix[i].PP_CODE ="-";
                                        finalObjPhoenix[i].MaxNotional = 0;
                                        finalObjPhoenix[i].MinNotional = 0;
                                        _tempObj.push(finalObjPhoenix[i]);
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

                                finalObjPhoenix = _tempObj1;
                            }
                        }
                        
                        //END
                    }
 
                    bindRFQIDEQC(thisTilePhoenix,finalObjPhoenix); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023

                    $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val(JSON.stringify(finalObjPhoenix));

                    // END

                    $(finalObjPhoenix).each(function (i, elem) {
                        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
                        var priceClass = "GlowPrice_Red";
                        if (!glowFlag) {
                            priceClass = "noGlow";
                        }

                        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                        // $(thisTilePhoenix).find('[id^="EQCRfqidpnl"]').show();
                        // $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html(elem.ParentID);
                        //end

                        var str = "";
                        var str2 = "";
                        if (elem.PP_CODE != null) {
                            // Added by Atharva - EQC Timers - START
                            mapIndexToBank["td"+repriceObjectPhoenix.CurrentTileID][itr] = elem.PP_CODE;
                            if(elem.PhoenixOUT != null && !isNaN(elem.PhoenixOUT) && elem.PhoenixOUT != "Rejected" &&  elem.PhoenixOUT != "" && $(thisTilePhoenix).find('[id^="hdnSelectedBank"]').val() == "") {
                                $(thisTilePhoenix).find('[id^="hdnSelectedBank"]').val(elem.PP_CODE);
                            }
                            if (elem.PP_CODE == "CITI") {
                                if(isNonBestPrice) {
                                    if(elem.PhoenixOUT != null && !isNaN(elem.PhoenixOUT) && elem.PhoenixOUT != "Rejected" &&  elem.PhoenixOUT != "" && ($(thisTilePhoenix).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectPhoenix.CurrentTileID + "_" + itr + "'>" + "Citi" + "</button></td>";
                                    }
                                    else if(elem.PhoenixOUT != null && !isNaN(elem.PhoenixOUT) && elem.PhoenixOUT != "Rejected" && elem.PhoenixOUT != "") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectPhoenix.CurrentTileID + "_" + itr + "'>" + "Citi" + "</td>";
                                    }
                                    else {
                                        str = str + "<td>" + "Citi" + "</td>";
                                    }
                                }
                                else {
                                    str = str + "<td";
                                    if(itr == 0 && elem.PhoenixOUT != null && !isNaN(elem.PhoenixOUT) && elem.PhoenixOUT != "Rejected" &&  elem.PhoenixOUT != "") {
                                        str = str + " class='bestPriceStyle'"
                                    }
                                    str = str + ">Citi</td>";
                                }
                                
                            } else {
                                if(isNonBestPrice) {
                                    if(elem.PhoenixOUT != null && !isNaN(elem.PhoenixOUT) && elem.PhoenixOUT != "Rejected" &&  elem.PhoenixOUT != "" && ($(thisTilePhoenix).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectPhoenix.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</button></td>";
                                    }
                                    else if(elem.PhoenixOUT != null && !isNaN(elem.PhoenixOUT) && elem.PhoenixOUT != "Rejected" &&  elem.PhoenixOUT != "") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectPhoenix.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</td>";
                                    }
                                    else {
                                        str = str + "<td>" + elem.PP_CODE + "</td>";
                                    }
                                }
                                else {
                                    str = str + "<td";
                                    if(itr == 0 && elem.PhoenixOUT != null && !isNaN(elem.PhoenixOUT) && elem.PhoenixOUT != "Rejected" &&  elem.PhoenixOUT != "") {
                                        str = str + " class='bestPriceStyle'"
                                    }
                                    str = str + ">" + elem.PP_CODE + "</td>";
                                }
                            }
                            // END
                            $(thisTilePhoenix).find('[id^="PhoenixBanksRow"]').append(str);
                        } else {
                            str = str + "<td>--</td>"
                            $(thisTilePhoenix).find('[id^="PhoenixBanksRow"]').append(str);
                        }
                        if (elem.PhoenixOUT != null && !isNaN(elem.PhoenixOUT) && elem.PhoenixOUT != "" && elem.PhoenixOUT != "Rejected") {
                            // Added by Atharva - EQC Timers
                            // Added new if condition
                            if(isNonBestPrice) {
                                if($(thisTilePhoenix).find('[id^="hdnSelectedBank"]').val() == elem.PP_CODE) {
                                
                                    str2 = str2 + "<td class='priceBackground";
                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                    if(parseFloat(elem.PhoenixOUT).toFixed(2) < 2){
                                       
                                        if(itr == 0) {
                                            str2 = str2 + " negativeprice";
                                        }

                                    }else{

                                        if(itr == 0) {
                                            str2 = str2 + " bestPriceStyle";
                                        }

                                    }
                                    // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                    str2 = str2 + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectPhoenix.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.PhoenixOUT).toFixed(2) + "%</button></td>"
                                    $(thisTilePhoenix).find('[id^="PhoenixPrices"]').append(str2);
                                } else {
                                    str2 = str2 + "<td";

                                    if(parseFloat(elem.PhoenixOUT).toFixed(2) < 2){

                                        if(itr == 0) {
                                            str2 = str2 + " class='negativeprice_nonbest'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton negativeprice_nonbest' onclick='setPriceEQC(this)' id='td" + repriceObjectPhoenix.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.PhoenixOUT).toFixed(2) + "%</button></td>"
                                        $(thisTilePhoenix).find('[id^="PhoenixPrices"]').append(str2);

                                    } else{

                                        if(itr == 0) {
                                            str2 = str2 + " class='bestPriceStyle'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectPhoenix.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.PhoenixOUT).toFixed(2) + "%</button></td>"
                                        $(thisTilePhoenix).find('[id^="PhoenixPrices"]').append(str2);
                                        
                                    }                                
                                }
                            }
                            else {
                                str2 = str2 + "<td";
                                // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                if(parseFloat(elem.PhoenixOUT).toFixed(2) < 0){

                                    if(itr == 0) {
                                        str2 = str2 + " class='negativeprice_nonbest'";
                                    }

                                }else{

                                    if(itr == 0) {
                                        str2 = str2 + " class='bestPriceStyle'";
                                    }

                                }
                                // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                str2 = str2 + ">" + parseFloat(elem.PhoenixOUT).toFixed(2) + "%</td>";
                                $(thisTilePhoenix).find('[id^="PhoenixPrices"]').append(str2);
                            }
                        } else {
                            str2 = str2 + "<td>-</td>"
                            $(thisTilePhoenix).find('[id^="PhoenixPrices"]').append(str2);
                        }
                       

                        itr++;

                let strMinMaxNotionalLimit = '';

                if (elem.PP_CODE != null) {
                    strMinMaxNotionalLimit = strMinMaxNotionalLimit + `<td style='font-size:12px !important;'>${K_M_B_Formatter(Number(elem.MinNotional))} / ${K_M_B_Formatter(Number(elem.MaxNotional))}</td>`;
                    $(thisTilePhoenix).find('[id^="minMaxNotionalLimitRow"]').append(strMinMaxNotionalLimit);
                                        }

                        // END
                    });
                    // Added by Atharva - EQC Timers - START
                    // Should run only once
                    // if(!isTimerStarted["td" + repriceObjectPhoenix.CurrentTileID]) {
                    //     isTimerStarted["td" + repriceObjectPhoenix.CurrentTileID] = true;
                    //     startTimersEQC(repriceObjectPhoenix.CurrentTileID);
                    // }
                    // END

                }
                  
            }).catch(error => {
                console.log(error);
                $(thisTilePhoenix).find('[id^="btnBestPricePhoenix"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
                clearInterval(uniqueIntervalID.value);
                mapleLoaderStop(thisTilePhoenix,'[id^="btnBestPricePhoenix"]', false);
                uniqueIntervalID.value = "";
                $(thisTilePhoenix).find('[id^="OverlayDiv"]').hide();

                // $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val(JSON.stringify(finalObjPhoenix));
                // if (finalObjPhoenix != null || finalObjPhoenix != undefined) {
                //     drawgraphPhoenix($(thisTilePhoenix).find('[id^="canvas"]').attr('id'));
                // } // INT1FIN47-768 Gateway Markets Instant Pricing issue

            })
        }
    } catch (error) {

        $(thisTilePhoenix).find('[id^="btnBestPricePhoenix"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issueclearInterval(uniqueIntervalID.value);
        sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        clearInterval(uniqueIntervalID.value);
        mapleLoaderStop(thisTilePhoenix,'[id^="btnBestPricePhoenix"]', false);

        uniqueIntervalID.value = "";
        $(thisTilePhoenix).find('[id^="OverlayDiv"]').hide();
        // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
        $(thisTilePhoenix).find('[id^="btnEmailQuote"]').attr("disabled", true);
        $(thisTilePhoenix).find('[id^="BookTradePhoenix"]').attr("disabled", true);
        $(thisTilePhoenix).find('[id^="OrderEmail"]').attr("disabled",true);  //LGTGTWINT-1981 || RizwanS || 12 May 2023

        console.log("getFinalQuoteResponsePhoenix : " + error.message);
        
        // $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val(JSON.stringify(finalObjPhoenix));
        // if (finalObjPhoenix != null || finalObjPhoenix != undefined) {
        //     drawgraphPhoenix($(thisTilePhoenix).find('[id^="canvas"]').attr('id'));
        // }// INT1FIN47-768 Gateway Markets Instant Pricing issue
        // sessionStorage.setItem("quoteToken_" + thisTilePhoenix.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTilePhoenix.id.match(/\d+$/)[0]));
        // sessionStorage.setItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]));
        //// INT1FIN47-768 Gateway Markets Instant Pricing issue
  

    } finally {
      //  $(thisTilePhoenix).find('[id^="BookTradePhoenix"]').attr("disabled", false);
    }
}

// To book trade
function booktradePhoenix(that,suitabilityCheck,redirectOrder) {
    try {
      
        // startLoader();

        TileId = that.id.match(/\d+$/)[0];
        thisTilePhoenix = document.getElementById("td" + TileId);
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
            $(thisTilePhoenix).find('[id^="PhoenixBanksRow"]').children().each(function() {
                if($(thisTilePhoenix).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
            mapleOrderLoaderStop(thisTilePhoenix);
               return false;
        
        }

        // END

        let AllocationDetails=[];

        $(thisTilePhoenix).find("select.ChildrenddlBookingCenter").each(function(index, element){

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

        var Obj = JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val());
        var token1 = $(thisTilePhoenix).find('[id^="hdnfinalTokenPhoenix"]').val();
        var quoteid = Obj[selectedBankIndex].EP_ER_QuoteRequestId;
        // Added by Atharva - EQC Timers
        // Replaced 0 with selectedBankIndex

        // Added for upfront% in order blotter // JIRA ID - CFINT-1015 // 20 Oct 2020 //

        // let marginPhoenix;
        
        // if ($(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').val().split("(")[0].trim().toUpperCase()  == "STRIKE" || $(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').val().split("(")[0].trim().toUpperCase()  == "COUPON") {
                    
        //     marginPhoenix = (100 -  parseFloat($(thisTilePhoenix).find('[id^="IBPriceipbox"]').val()));
        // }
        // else {

        //     marginPhoenix = (100 - JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[selectedBankIndex].PhoenixOUT);
        //     // Added by Atharva - EQC Timers
        //     // Replaced 0 with selectedBankIndex
        // }
        
        //END
       // let _clientPrice =(parseFloat(JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[selectedBankIndex].PhoenixOUT) + parseFloat(100 - JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[0].PhoenixOUT)).toFixed(2);


        let limitPrice1 = "";
        let limitPrice2 = "";
        let limitPrice3 = "";
        let limitPrice4 = "";

        if($(thisTilePhoenix).find('[id^="ddlOrderTypePhoenix"]').val().trim().toUpperCase() == "LIMIT"){

            if($(thisTilePhoenix).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 0){

                limitPrice1 = $(thisTilePhoenix).find('[id^="txtLimitLevel"]').val().trim();

            }else if($(thisTilePhoenix).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 1){

                 limitPrice2 = $(thisTilePhoenix).find('[id^="txtLimitLevel"]').val().trim();

            } else if($(thisTilePhoenix).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 2){

                 limitPrice3 = $(thisTilePhoenix).find('[id^="txtLimitLevel"]').val().trim();
                 
            } else if($(thisTilePhoenix).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 3){

                limitPrice4 = $(thisTilePhoenix).find('[id^="txtLimitLevel"]').val().trim();
                
            }            
        }

        //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

        let _confirmReason = "";

        if(selectedBankIndex>0){
 
            if($(thisTilePhoenix).find('[id^="ddlNONBEST"]').val() != "NONBEST_CUSTOM"){
 
              _confirmReason = $(thisTilePhoenix).find('[id^="ddlNONBEST"]').text();
      
            }else{
      
                 _confirmReason =  $(thisTilePhoenix).find('[id^="txtNONBEST"]').val(); 
                  
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
                if ($(thisTilePhoenix).find('[id^="rbRowSuitabilityToggle"]')[0].checked) {
                    _chkSuitability = "NO";
                    if ($(thisTilePhoenix).find('[id^="ddlReason"]').val().trim().includes("SUTSKP_CUSTOM")) { // Added by RizwanS | JIRA-LGTGTWINT-1830
                        _reasonmsg = $(thisTilePhoenix).find('[id^="txtSpecifyReason"]').val();
                    }else{
                        _reasonmsg = $(thisTilePhoenix).find('[id^="ddlReason"]').val();
                    }
                }else{
                    _chkSuitability = "YES"; //RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                }
                //End
                
            }


//End
        // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
        let orderMethodName = "";
        let bookObject = "";

        if(redirectOrder == true){

            orderMethodName = "redirectOrder";

            bookObject= {           

               EntityID: sessionStorage.getItem("EQC_EntityID").toString(),
               orderQty: $(thisTilePhoenix).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
               type:$(thisTilePhoenix).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
               limitPrice1: limitPrice1,
               limitPrice2: limitPrice2,
               limitPrice3: limitPrice3,
               limitPrice4: limitPrice4,
               QuoteRequestId: quoteid,
               loginUser: sessionStorage.getItem("EQC_UserName").toString(),
               margin: "0.00",//Number(marginPhoenix).toFixed(2),
               clientPrice:"0.00",
               yield: "",
               bookingBranch: $(thisTilePhoenix).find('[id^="ddlBookingBranch"]').val(),
               rmNameForOrderConfirmation: $(thisTilePhoenix).find('[id^="ddlRMName"]').val(),
               dealerNotificationEmailID: $(thisTilePhoenix).find('[id^="txtComment"]').val(),
               orderComment: $(thisTilePhoenix).find('[id^="txtComment"]').val(),
               confirmationReason: _confirmReason,
               advisoryReason: $(thisTilePhoenix).find('[id^="txtComment"]').val(),
               preTradeXml: preTradeXml,
               //chkSuitability:$(thisTilePhoenix).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
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
                "orderQuantity": $(thisTilePhoenix).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "OrderType": $(thisTilePhoenix).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
                "LimitPrice1": limitPrice1,
                "LimitPrice2": limitPrice2,
                "LimitPrice3": limitPrice3,
                "LimitPrice4": limitPrice4,
                "QuoteRequestId": quoteid,
                "PoolID": "",
                "RedirectOrderID": "",
                "OrderComment": $(thisTilePhoenix).find('[id^="txtComment"]').val(),
                "Margin": "0.00",//Number(marginPhoenix).toFixed(2),
                "Notional": $(thisTilePhoenix).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "ClientPrice": "0.00",
                "ClientYield": "",
                "BookingBranch": $(thisTilePhoenix).find('[id^="ddlBookingBranch"]').val(),
                "RMNameforOrderConfirm": $(thisTilePhoenix).find('[id^="ddlRMName"]').val(),
                "RMEmailIdforOrderConfirm": "",
                "ConfirmReason": _confirmReason, //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message
                "PreTradeXml": "",
                "AdvisoryReason": "",
                // "UserRole": _reasonmsg, // Added Chaitanya M | For checking the suitability reason | Ref:LGTGTWINT-603 | 12-Jan-2023
                "CustomerID": "",
                // "chkSuitability":$(thisTilePhoenix).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
                "chkSuitability":_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                "SuitabilityReason": _reasonmsg, // Added by RizwanS | JIRA-LGTGTWINT-1830
                "IntendedSpread": "",
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": TileId,
                "AllocationDetails": AllocationDetails,
                "UserRole" : isEQCDealer === true ? 'Dealer' : isIA=== true ? 'IA' : 'RM' , // Added by RizwanS | JIRA-LGTGTWINT-1830
            
            }
        }

        mapleOrderLoaderStart(thisTilePhoenix);
           
       request_getDataFromAPI(bookObject, clientConfigdata.CommonMethods.NodeServer + orderMethodName).then(bookObject => {

            // endLoader()

            thisTilePhoenix = document.getElementById("td" + bookObject.CurrentTileID);

            TileId = bookObject.CurrentTileID;

            let bookstring = bookObject['responseData']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
             
            let OrderStatus = bookObject['message']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
        

            if (OrderStatus.toUpperCase() == clientConfigdata.EQCCommonMethods.EQC_BOOK_TRADE_RESPONSE_DETAILS.toUpperCase()) {

                // $(thisTilePhoenix).find('[id^="hdnBlotterURLPhoenix"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                // $(thisTilePhoenix).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradePhoenix" + TileId, bookstring, "DivOverlayPhoenix");
                $(thisTilePhoenix).find('[id^="OverlayDiv"]').hide();
                $(thisTilePhoenix).find('[id^="hdnfinalTokenPhoenix"]').val("");
                clearPricerTable(thisTilePhoenix);
                
            } else {

                if(OrderStatus == "" || OrderStatus == null || OrderStatus==undefined){

                    OrderStatus = "Order Execution Failed!";
                    
                
                }else if(OrderStatus.includes("Please select booking centers from same region")){ // LGTGTWINT-1888 || RizwanS || 30 May 2023

                    OrderStatus = "Please select booking centers from same region.";
                }
                
                booktradePopup(that, "booktradePhoenix" + TileId, OrderStatus, "DivOverlayPhoenix");
                $(thisTilePhoenix).find('[id^="OverlayDiv"]').hide();
                $(thisTilePhoenix).find('[id^="hdnfinalTokenPhoenix"]').val("");
                clearPricerTable(thisTilePhoenix);
            }
            mapleOrderLoaderStop(thisTilePhoenix);
            sessionStorage.removeItem("quoteResponse_" + thisTilePhoenix.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTilePhoenix).find('[id^="btnBestPricePhoenix"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTilePhoenix).find('[id^="hdnintervalID"]').val());
            mapleLoaderStop(thisTilePhoenix,'[id^="btnBestPricePhoenix"]', false);
            // Added by Atharva - EQC Timers - START
            $(thisTilePhoenix).find('[id^="PhoenixPrices"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            $(thisTilePhoenix).find('[id^="PhoenixBanksRow"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTilePhoenix).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTilePhoenix).find('[id^="BookTradePhoenix"]').attr("disabled", true);
            $(thisTilePhoenix).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
             
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTilePhoenix).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTilePhoenix).find('[id^="RFQIDEQC"]').html("");
            //End

            // END
        }).catch(error => { console.log(error); })
    } catch (er) {
        console.log(er);
        booktradePopup(that, "booktradePhoenix" + TileId, "Order Execution Failed!", "DivOverlayPhoenix");
        $(thisTilePhoenix).find('[id^="OverlayDiv"]').hide();
        // endLoader();
        mapleOrderLoaderStop(thisTilePhoenix);

    } finally {

    }
}

var dialogBoxPhoenix = null;
function emailQuotePhoenix(that) {
    try {

        thisTilePhoenix= $(that).parents(".sorting")[0];
    
        let pricingRow = "";
        pricingRow = $(thisTilePhoenix).find("table.pricerTable .pricesRow")[0];
        mapleOrderLoaderStart(thisTilePhoenix); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
    
        if (pricingRow.cells[0].innerText.trim().toString() === "-") {
            openValidationpopup('',"No price available for mailing!"); // Changed for Change quote mail validation from "Invalid Price" to "No price available for mailing!" | Ref: LGTGTWINT-1195 | Chaitanya M | 25-jan-2023
          return false;
        }

        //create email pop up here 
        let strEmail =``;
        let emailPriceStream =JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val());
        console.log('email price stream object ', emailPriceStream);

        strEmail=strEmail+`<table class='emailTable'><tr><td class='payOff_Features'>
        <input type='checkbox' class='chkBoxParent_Email_PPCode' onchange='emailParentCheckboxChanged(this)' >
        Issuer</td><td class='payOff_Features'>${globalSolveForValuePhoenix}</td></tr>`;

        for (let e of emailPriceStream){
            if(e.PhoenixOUT.trim().toUpperCase()!=='REJECTED' && e.PhoenixOUT.trim().toUpperCase()!=='' && e.PhoenixOUT.trim().toUpperCase()!=='UNSUPPORTED'){ // Changed the condition for handling Unsupported response | Ref: LGTGTWINT-1321 | Chaitanya M | 06 Feb 2023
                        strEmail=strEmail+`<tr><td style='width:40px;padding:15px'><input type='checkbox' class='chkBox_Email_PPCode'  onchange='emailChildrenCheckboxChanged(this)'> ${e.PP_CODE}</td><td style='width:40px;padding:15px'>${e.PhoenixOUT}</td></tr>`;
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
        if(dialogBoxPhoenix===null)
        {
            dialogBoxPhoenix= $(thisTilePhoenix).find('[id^="emailDialog_Phoenix"]')[0];
            $(thisTilePhoenix).find('[id^="emailDialog_Phoenix"]').empty().append(strEmail);
            $(dialogBoxPhoenix).dialog({
                resizable: false,
                height: "auto",
                width: 320,
                open: function (event, ui) {// Added for LGTGTWINT-1283 || Email popup on top change | Chaitanya M | 08 Feb 2023
                    $('.ui-widget.ui-widget-content').css('z-index',999);                    
                },  
                //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                close: function (event, ui){
                    mapleOrderLoaderStop(thisTilePhoenix);
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

                    
                        if($(document).find('.ui-dialog').find('[id^="emailDialog_Phoenix"]').find('.chkBox_Email_PPCode').length>0)
                        {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_Phoenix"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                                if(checkboxControl.checked){
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val()).filter(function(RFQ_OBJECT){
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


                        if ($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val() != undefined && $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val().trim()!='')
                        var RFQID = JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;
    
                        if (RFQID != undefined && RFQID != ''){
                            //     MailBestQuote(thisTilePhoenix.id.match(/\d+$/)[0], JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[0].EP_ER_QuoteRequestId);
                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023          
                                //booktradePopup(thisTilePhoenix, "booktradePhoenix" + thisTilePhoenix.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayPhoenix");
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            }     
                            $(this).dialog("close"); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTilePhoenix);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                                "rfqId":__mailRFQ.toString(), //RFQID,
                                "CurrentTileID":thisTilePhoenix.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType:"English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTilePhoenix = document.getElementById("td" +TileId);
                                mapleOrderLoaderStop(thisTilePhoenix);
                                booktradePopup(thisTilePhoenix, "booktradePhoenix" + TileId, data.message, "DivOverlayPhoenix");
                                
                            }).catch(error=>{
                                console.log(error);
                            
                            })
                        }else{
                            mapleOrderLoaderStop(thisTilePhoenix);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('','Invalid RFQ ID ');
                        }
                            
             
                    },
                    "Mail All Quotes": function() {
                        //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023


                        var Email_PPList = [];
                        var RFQIDList = [];
                        var __mailRFQ = [];


                        if ($(document).find('.ui-dialog').find('[id^="emailDialog_Phoenix"]').find('.chkBox_Email_PPCode').length > 0) {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_Phoenix"]').find('.chkBox_Email_PPCode').each(function (chkIndex, checkboxControl) {
                             //   if (checkboxControl.checked) {
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val()).filter(function (RFQ_OBJECT) {
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

                        if ($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val() != undefined && $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val().trim() != '')
                            var RFQID = JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

                        if (RFQID != undefined && RFQID != '') {
                            //     MailBestQuote(thisTilePhoenix.id.match(/\d+$/)[0], JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[0].EP_ER_QuoteRequestId);
                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTilePhoenix, "booktradePhoenix" + thisTilePhoenix.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayPhoenix");
                                mapleOrderLoaderStop(thisTilePhoenix);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            } 
                            $( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTilePhoenix);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({
                                "userName": sessionStorage.getItem("FinIQUserID").toString(),
                                "rfqId": __mailRFQ.toString(), //RFQID,
                                "CurrentTileID": thisTilePhoenix.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType: "English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTilePhoenix = document.getElementById("td" + TileId);
                                mapleOrderLoaderStop(thisTilePhoenix);
                                booktradePopup(thisTilePhoenix, "booktradePhoenix" + TileId, data.message, "DivOverlayPhoenix");

                            }).catch(error => {
                                console.log(error);

                            })
                        }
                        else{
                            mapleOrderLoaderStop(thisTilePhoenix);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('', 'Invalid RFQ ID ');
                        }
                    
                        return true;

                        //email all quotes here 

                    }
                }
            });
            $(dialogBoxPhoenix).dialog('open');

        }else
        {
            $(document).find('.ui-dialog').find('[id^="emailDialog_Phoenix"]').empty().append(strEmail);

            $(dialogBoxPhoenix).dialog('open');

            var Email_PPList =[];
            var RFQIDList=[];
            var __mailRFQ=[];
            
            if($(document).find('.ui-dialog').find('[id^="emailDialog_Phoenix"]').find('.chkBox_Email_PPCode').length>0)
            {
                $(document).find('.ui-dialog').find('[id^="emailDialog_Phoenix"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                    if(checkboxControl.checked){
                    Email_PPList.push($(checkboxControl).parent().text().trim())

                    RFQIDList.push(JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val()).filter(function(RFQ_OBJECT){
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


            if ($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val() != undefined && $(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val().trim()!='')
            var RFQID = JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

            if (RFQID != undefined && RFQID != ''){
                //     MailBestQuote(thisTilePhoenix.id.match(/\d+$/)[0], JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[0].EP_ER_QuoteRequestId);
                if(__mailRFQ == ""){
                    // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    //booktradePopup(thisTilePhoenix, "booktradePhoenix" + thisTilePhoenix.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayPhoenix");
                    mapleOrderLoaderStop(thisTilePhoenix);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    openValidationpopup('','No price selected for mailing !');
                    //End
                    return false;
                }     
                mapleOrderLoaderStart(thisTilePhoenix);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                    "rfqId":__mailRFQ.toString(),//RFQID,
                    "CurrentTileID":thisTilePhoenix.id.match(/\d+$/)[0],
                    "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                    QuoteMailType:"English"
                }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                    console.log(data);
                    TileId = data.CurrentTileID;
                    thisTilePhoenix = document.getElementById("td" +TileId)
                    mapleOrderLoaderStop(thisTilePhoenix);
                    booktradePopup(thisTilePhoenix, "booktradePhoenix" + TileId, data.message, "DivOverlayPhoenix");
                      
                }).catch(error=>{
                    console.log(error);
                   
                })
            }
            else{
                mapleOrderLoaderStop(thisTilePhoenix);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                openValidationpopup('','Invalid RFQ ID ');
                
            }

        }
        $(thisTilePhoenix).find('[id^="PhoenixBanksRow"]').children().each(function() {
           if($(thisTilePhoenix).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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


function validateOrderPhoenix(thisTilePhoenix,_flag){    // LGTGTWINT-1279 : Instant Pricing : Order booking valdations.

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
            $(thisTilePhoenix).find('[id^="PhoenixBanksRow"]').children().each(function() {
                if($(thisTilePhoenix).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
        if ($(thisTilePhoenix).find('[id^="ddlSolveForPhoenix"]').val().split("(")[0].trim().toUpperCase() == "STRIKE") {
            
            if($(thisTilePhoenix).find('[id^="koinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[selectedBankIndex].PhoenixOUT) > parseFloat($(thisTilePhoenix).find('[id^="koinputbox"]').val())){
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTilePhoenix).find('[id^="koinputbox"]').attr("id"), "KO % of Initial should be greater than strike(%)", thisTilePhoenix);
                return false;
            }
        
                else if($(thisTilePhoenix).find('[id^="kiinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[selectedBankIndex].PhoenixOUT) < parseFloat($(thisTilePhoenix).find('[id^="kiinputbox"]').val())){
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTilePhoenix).find('[id^="kiinputbox"]').attr("id"), "KI % of Initial should be less than strike(%)", thisTilePhoenix);
                return false;
            }
        }
    
        if ($(thisTilePhoenix).find('[id^="hdnfinalTokenPhoenix"]').val() == "" || $(thisTilePhoenix).find('[id^="PhoenixPrices"]')[0].firstChild.innerHTML == "-" || $(thisTilePhoenix).find('[id^="PhoenixPrices"]')[0].firstChild.innerHTML == "") {
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').attr("id"), "Order Execution Failed!", thisTilePhoenix);
                return false;
        }
        
        if(parseFloat(JSON.parse($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').val())[selectedBankIndex].PhoenixOUT) <= 0){
                if(_flag == false){

                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTilePhoenix).find('[id^="hdnChartPricesPhoenix"]').attr("id"), "Prices can not be negative 0r zero, Order Execution Failed!", thisTilePhoenix);
                return false;
        }

    }catch(er){
        console.log(er.message);
    }

}

//  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.

function ChangeSolveForPhoenix(solveFor, thisTilePhoenix,calledFromIndexPhoenix) {
    try {
        if (calledFromIndexPhoenix != undefined){
                if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                    $(thisTilePhoenix).find('[id^="strikeipbox"]').prop('disabled', true);
                    $(thisTilePhoenix).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTilePhoenix).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').prop('disabled', false);
                    // checkupfrontPricePhoenix(thisTilePhoenix); //LGTGTWINT-1095
                    checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val().trim(), thisTilePhoenix) //  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                    $(thisTilePhoenix).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTilePhoenix).find('[id^="IBPriceipbox"]').prop('disabled', true); ////LGTGTWINT-1095
                    $(thisTilePhoenix).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').prop('disabled', true); ////LGTGTWINT-1095
                    // checkupfrontPricePhoenix(thisTilePhoenix);  //LGTGTWINT-1095
                    checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val().trim(), thisTilePhoenix) //  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                    $(thisTilePhoenix).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTilePhoenix).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTilePhoenix).find('[id^="couponipbox"]').prop('disabled', true);
                    $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').prop('disabled', false); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for Phoenix and DRA
                    // checkupfrontPricePhoenix(thisTilePhoenix);  //LGTGTWINT-1095
                    checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val().trim(), thisTilePhoenix)//  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                }
        }
        else {
            if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                $(thisTilePhoenix).find('[id^="strikeipbox"]').prop('disabled', true);
                $(thisTilePhoenix).find('[id^="IBPriceipbox"]').prop('disabled', false); //LGTGTWINT-1095
                $(thisTilePhoenix).find('[id^="couponipbox"]').prop('disabled', false);
                $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').prop('disabled', false); //LGTGTWINT-1095
                // checkupfrontPricePhoenix(thisTilePhoenix);  //LGTGTWINT-1095
                checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val().trim(), thisTilePhoenix,true)//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                $(thisTilePhoenix).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTilePhoenix).find('[id^="IBPriceipbox"]').prop('disabled', true);
                $(thisTilePhoenix).find('[id^="couponipbox"]').prop('disabled', false);
                $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').prop('disabled', true); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for Phoenix and DRA
                // checkupfrontPricePhoenix(thisTilePhoenix);  //LGTGTWINT-1095
                checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val().trim(), thisTilePhoenix,true)//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                $(thisTilePhoenix).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTilePhoenix).find('[id^="IBPriceipbox"]').prop('disabled', false); //LGTGTWINT-1095
                $(thisTilePhoenix).find('[id^="couponipbox"]').prop('disabled', true);
                $(thisTilePhoenix).find('[id^="txtupfrontPhoenix"]').prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypePhoenix($(thisTilePhoenix).find('[id^="ddlKOKIType"]').val().trim(), thisTilePhoenix,true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
                // checkupfrontPricePhoenix(thisTilePhoenix);  //LGTGTWINT-1095

            }

    }
    } catch (error) {
    }
}