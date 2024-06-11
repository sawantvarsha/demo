$.support.cors = true;
var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var ContractAmtSharkfin;
var CouponFreq;
var tempShareName;
var arrSharkfin = [];
var maxSharkfin;
var finalResponseDataSharkfin;
var finalTokenSharkfin;
var repriceObjectSharkfin;
var TimerSharkfin = 0;
var finalObjSharkfin;
var getddlList;
var idSharkfin = 29;
var dateObj = ""
var globalDefaultSharesArraySharkfin = ["AMZN.OQ"] //LGTGTWINT-1723 Instant Pricer : Remove FB.OQ ticker from default notes payoff's.

// To load the Sharkfin tile 
function onLoadSharkfin(currId,isProductCopiedSharkfin) {
    try {
      
        setDeafaultValuesSharkfin(currId,isProductCopiedSharkfin);
        thisTileSharkfin = document.getElementById("td" + currId);
        $(thisTileSharkfin).find('[id^="OverlayDiv"]').hide();

        sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        $(thisTileSharkfin).find('[id^="btnBestPriceSharkfin"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        // clearInterval($(thisTileSharkfin).find('[id^="hdnintervalID"]').val());  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileSharkfin,'[id^="btnBestPriceSharkfin"]', false);
        clearPricerTable(thisTileSharkfin);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileSharkfin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
        $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html("");
        //end

        $(thisTileSharkfin).find("div.card input[type='text'],div.card input[type='search'],div.card select").on('change', function () {

            thisTileSharkfin = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileSharkfin).find('[id^="btnBestPriceSharkfin"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileSharkfin).find('[id^="hdnintervalID"]').val());
           $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileSharkfin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html("");
            //End

            clearPricerTable(thisTileSharkfin);
            mapleLoaderStop(thisTileSharkfin,'[id^="btnBestPriceSharkfin"]', false);  // Added Loader function ||
            $(thisTileSharkfin).find('[id^="btnEmailQuote"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileSharkfin).find('[id^="BookTradeSharkfin"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileSharkfin).find('[id^="OrderEmail"]').attr("disabled",true);//LGTGTWINT-1981 || RizwanS || 12 May 2023   
        })
 
         $(thisTileSharkfin).find(" div.card .amtPopup").on('select', function () {  // INT1FIN47-768 Gateway Markets Instant Pricing issue
 
             thisTileSharkfin = $(this).parents('.sorting')[0];
             sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
             $(thisTileSharkfin).find('[id^="btnBestPriceSharkfin"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
             clearInterval($(thisTileSharkfin).find('[id^="hdnintervalID"]').val());
            $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
             clearPricerTable(thisTileSharkfin);

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileSharkfin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html("");
            //End

             mapleLoaderStop(thisTileSharkfin,'[id^="btnBestPriceSharkfin"]', false);
             $(thisTileSharkfin).find('[id^="btnEmailQuote"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
             $(thisTileSharkfin).find('[id^="BookTradeSharkfin"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
             $(thisTileSharkfin).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023 
             
          })


        $(thisTileSharkfin).find('[id^="ddlKOKIType"]').on("change", function() {
            try {
             
            thisTileSharkfin = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileSharkfin,"btnBestPriceSharkfin");    
           $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val("");
           //End
            validation_clear(); //To Remove highlighted part if no error 
            checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val().trim(), thisTileSharkfin);

            } catch (error) {
                console.log(error.message);
            }
        });
        //aded by rutika on 26/04/2022 for calculating tenor when changed in input box
         //Start

        $(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').on("change", function() {
            try {
        
            thisTileSharkfin = $(this).parents(".sorting")[0];
            let currId=   thisTileSharkfin.id.match(/\d+$/)[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileSharkfin,"btnBestPriceSharkfin");    
            $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val("");
            //End
            if( $(thisTileSharkfin).find('[id^="tenorddl"]').val() == "M"){

                if(Number($(this).parents(".sorting").find('[id^="tenor_Sharkfin"]').val()) > Number(FCNAllowedTenorinMonths) || $(this).parents(".sorting").find('[id^="tenor_Sharkfin"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_Sharkfin"]').val() == ""){
                    ValidateField($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').attr("id"), "Please enter valid tenor.", thisTileSharkfin);
                    return false;
                }
            } else{
                 if(Number($(this).parents(".sorting").find('[id^="tenor_Sharkfin"]').val()) > Number(SharkfinAllowedTenorinYears) || $(this).parents(".sorting").find('[id^="tenor_Sharkfin"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_Sharkfin"]').val() == ""){
                    ValidateField($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').attr("id"), "Please enter valid tenor.", thisTileSharkfin);
                    return false;
                }
            }
            // calculateTenor(currId); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023            

            }   catch (error) {
                console.log(error.message);
            }
        });


        $(thisTileSharkfin).find('[id^="tenorddl"]').on("change", function () {
            try {
                
                thisTileSharkfin = $(this).parents(".sorting")[0];
                let currId=   thisTileSharkfin.id.match(/\d+$/)[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileSharkfin,"btnBestPriceSharkfin");    
                $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val("");
                //End
                if( $(thisTileSharkfin).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_Sharkfin"]').val()) > Number(FCNAllowedTenorinMonths)){
                        ValidateField($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').attr("id"), "Please enter valid tenor.", thisTileSharkfin);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_Sharkfin"]').val()) > Number(SharkfinAllowedTenorinYears)){
                        ValidateField($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').attr("id"), "Please enter valid tenor.", thisTileSharkfin);
                        return false;
                    }
                }
    
            // calculateTenor(currId); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023                
               
            } catch (error) {
                console.log(error);
            }
        });

        //End
        
        checkSolveForSharkfin($(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').val(), thisTileSharkfin)

        $(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').on('change', function (event) {
            thisTileSharkfin = $(this).parents('.sorting')[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileSharkfin,"btnBestPriceSharkfin");    
           $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val("");
           //End
           ChangeSolveForSharkfin($(this).val(), thisTileSharkfin); //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.

        });

        shareCount = 0;
        $(thisTileSharkfin).find('[id^="shareDivSharkfin"]').click(function () {
            $(this).find('input[type="search"]').focus();
        });

        // Check for upfront/IB Price 

           $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').on("change", function() {
            try {
             
            thisTileSharkfin = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileSharkfin,"btnBestPriceSharkfin");    
           $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val("");
           //End

            if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

                let _ibprice =   parseFloat(100 -  Number($(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').val())).toFixed(2);;

                $(thisTileSharkfin).find('[id^="IBPriceipbox"]').val(_ibprice);

            }

            } catch (error) {
                console.log(error.message);
            }
        });

        $(thisTileSharkfin).find('[id^="IBPriceipbox"]').on("change", function() {
            try {
             
            thisTileSharkfin = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileSharkfin,"btnBestPriceSharkfin");    
           $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val("");
           //End

            if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

                let _upfront =  parseFloat(100 -  Number($(thisTileSharkfin).find('[id^="IBPriceipbox"]').val())).toFixed(2);

                $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').val(_upfront);

            }

            } catch (error) {
                console.log(error.message);
            }
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        //Start
        $(thisTileSharkfin).find('.ddlShares').on("focusout", function (){   
        
            //Added for LGTGTWINT-1292 | Chaitanya M | 28 Feb 2023
            _ccylistSharkfin = getExchangeAndCcyFromBasket($(thisTileSharkfin).find('[id^="shareDivSharkfin"]')[0], 'share')
            listnames = _ccylistSharkfin;
            if(_ccylistSharkfin.length >=4){
                return false;
            } 
            validatesharebasket(thisTileSharkfin,"shareNameSharkfin");  
            sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileSharkfin,"btnBestPriceSharkfin");    
            $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val("");// Added For  Mail all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            $(thisTileSharkfin).find('[id^="btnEmailQuote"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileSharkfin).find('[id^="BookTradeSharkfin"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023     
            $(thisTileSharkfin).find('[id^="OrderEmail"]').attr("disabled",true);//LGTGTWINT-1981 || RizwanS || 12 May 2023  
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        $(thisTileSharkfin).find("div.card .ddlShares").on("keydown", function(){
        
            $("#bodyDiv").hide();
            sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileSharkfin,"btnBestPriceSharkfin");    
            $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val("");// Added For  Mail all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileSharkfin).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileSharkfin).find('[id^="BookTradeSharkfin"]').attr("disabled", true);           
            $(thisTileSharkfin).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023 
        });
     
        //End
        //Added for LGTGTWINT-1077 Instant Pricing: Input length for all fields for all payoffs | Chaitanya M | 28-01-2023
        $(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').on("keyup", function (){            

             InputLengthCheckEQC(thisTileSharkfin, "tenor_Sharkfin",3); 
        });

        $(thisTileSharkfin).find("[id^='strikeipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileSharkfin, "strikeipbox",8); //Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            $(thisTileSharkfin).find('[id^="EQCRfqidpnl"]').hide();
            $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileSharkfin).find("[id^='txtupfrontSharkfin']").on("keyup", function(){
             InputLengthCheckEQC(thisTileSharkfin, "txtupfrontSharkfin",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
    
        });

        $(thisTileSharkfin).find("[id^='kiinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileSharkfin, "kiinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileSharkfin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileSharkfin).find("[id^='koinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileSharkfin, "koinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileSharkfin).find('[id^="EQCRfqidpnl"]').hide();//LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html("");
            //End

        });
        
        $(thisTileSharkfin).find("[id^='couponipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileSharkfin, "couponipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileSharkfin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileSharkfin).find("[id^='IBPriceipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileSharkfin, "IBPriceipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
        
        });

        $(thisTileSharkfin).find("[id^='noncallinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileSharkfin, "noncallinputbox",3);
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileSharkfin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        //Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
        $(thisTileSharkfin).find('[id^="ContractAmtSharkfin"]').on("change", function(){
            thisTileSharkfin = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileSharkfin,"btnBestPriceSharkfin");    
           $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val("");
           //End
          if($(thisTileSharkfin).find('[id^="ContractAmtSharkfin"]').val() == ""){
            $(thisTileSharkfin).find('[id^="ContractAmtSharkfin"]').val("0");
            return false; 
          }    
                  
        });        
       
        //End

    } catch (error) {
        console.log(error.message)
    }
}

// To set default values for Sharkfin
function setDeafaultValuesSharkfin(currId,isProductCopiedSharkfin) {
    try {
        // Added logic for getting current tile : Onkar E.//
        thisTileSharkfin = document.getElementById("td" + currId);


        //Configured UI fileds Start :: || 08 Feb 2023

        if(DRAFCNUpfrontYN.toUpperCase() == "YES" || DRAFCNUpfrontYN.toUpperCase().includes("Y")){

            $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').val("0.00"); // defualt value
            $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').hide(); //UI filed
            $(thisTileSharkfin).find('[id^="upfrontuilbl"]').hide(); //UI label
            $(thisTileSharkfin).find('[id^="txtupfrontlbl"]').hide(); // hide label order popup
            $(thisTileSharkfin).find('[id^="txtupfrontVal"]').hide(); //Order popup filed
            
        }else{
            $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').val("0.00");
        }

        // END

        $(thisTileSharkfin).find('[id^="ContractAmtSharkfin"]').val("1,000,000.00");
        $(thisTileSharkfin).find("[id^='ContractAmtSharkfin']").attr('maxlength','14');
        $(thisTileSharkfin).find('[id^="strikeipbox"]').val("92.00");
        $(thisTileSharkfin).find('[id^="couponipbox"]').val("8.00");
        $(thisTileSharkfin).find('[id^="noncallinputbox"]').val("1");
        $(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').val("6");
        $(thisTileSharkfin).find('[id^="IBPriceipbox"]').val("98.50"); //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 ||  Changed for SCB EAM Demo | Chaitanya | 27 Sep 2023
        $(thisTileSharkfin).find('[id^="kiinputbox"]').val("65.00");//Chaitanya M 4-April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        $(thisTileSharkfin).find('[id^="koinputbox"]').val("105.00");//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        callDropDownFunction($(thisTileSharkfin).find('[id^="shareName"]'), "Sharkfin", currId);
        EQProductsFillCcy(thisTileSharkfin, "ddlSharkfinCcy");
        clearPricerTable(thisTileSharkfin);
        $(thisTileSharkfin).find('[id^="shareNameCntrlSharkfin"]').html("");
        $(thisTileSharkfin).find('[id^="hiddenshareinputSharkfin"]').html("");
        $(thisTileSharkfin).find('[id^="CCY_Sharkfin"]').html("");

        if(!isProductCopiedSharkfin){
        for (let s=0;s<clientConfigdata.EQCSharkfin.MinSharesInBaskets;s++){
            createElementInBasket(thisTileSharkfin, 'shareDivSharkfin', sessionStorage.getItem(thisTileSharkfin.id)!=undefined?sessionStorage.getItem(thisTileSharkfin.id).split(" ")[s]:globalDefaultSharesArraySharkfin[s]); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
       
        }
    }
       
        $(thisTileSharkfin).find('[id^="shareName"]')[0].placeholder = "";
        $(thisTileSharkfin).find('[id^="CCY_Sharkfin"]').html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);


        

    } catch (error) {
        console.log(error.message)
    }
}

function checkSolveForSharkfin(solveFor, thisTileSharkfin,calledFromIndexSharkfin) {
    try {
        if (calledFromIndexSharkfin != undefined){
                if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                    $(thisTileSharkfin).find('[id^="strikeipbox"]').prop('disabled', true);
                    $(thisTileSharkfin).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTileSharkfin).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').prop('disabled', false);
                    // checkupfrontPriceSharkfin(thisTileSharkfin); //LGTGTWINT-1095
                    checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val(), thisTileSharkfin, calledFromIndexSharkfin)
                } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                    $(thisTileSharkfin).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTileSharkfin).find('[id^="IBPriceipbox"]').prop('disabled', true); ////LGTGTWINT-1095
                    $(thisTileSharkfin).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').prop('disabled', true); ////LGTGTWINT-1095
                    // checkupfrontPriceSharkfin(thisTileSharkfin);  //LGTGTWINT-1095
                    checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val(), thisTileSharkfin, calledFromIndexSharkfin)
                } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                    $(thisTileSharkfin).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTileSharkfin).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTileSharkfin).find('[id^="couponipbox"]').prop('disabled', true);
                    $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').prop('disabled', false); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for Sharkfin and DRA
                    // checkupfrontPriceSharkfin(thisTileSharkfin);  //LGTGTWINT-1095
                    checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val(), thisTileSharkfin, calledFromIndexSharkfin)
                }
        }
        else {
            if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                $(thisTileSharkfin).find('[id^="strikeipbox"]').prop('disabled', true);
                $(thisTileSharkfin).find('[id^="IBPriceipbox"]').val("98.50").prop('disabled', false); //LGTGTWINT-1095 || Changed for SCB EAM Demo | Chaitanya | 27 Sep 2023
                $(thisTileSharkfin).find('[id^="couponipbox"]').val("8.00").prop('disabled', false);
                $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                // checkupfrontPriceSharkfin(thisTileSharkfin);  //LGTGTWINT-1095
                checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val(), thisTileSharkfin)
            } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                $(thisTileSharkfin).find('[id^="strikeipbox"]').val("92.00").prop('disabled', false);
                $(thisTileSharkfin).find('[id^="IBPriceipbox"]').prop('disabled', true);
                $(thisTileSharkfin).find('[id^="couponipbox"]').val("8.00").prop('disabled', false);
                $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').prop('disabled', true); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for Sharkfin and DRA
                // checkupfrontPriceSharkfin(thisTileSharkfin);  //LGTGTWINT-1095
                checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val(), thisTileSharkfin)
            } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                $(thisTileSharkfin).find('[id^="strikeipbox"]').val("92.00").prop('disabled', false);
                $(thisTileSharkfin).find('[id^="IBPriceipbox"]').val("98.50").prop('disabled', false); //LGTGTWINT-1095 || Changed for SCB EAM Demo | Chaitanya | 27 Sep 2023
                $(thisTileSharkfin).find('[id^="couponipbox"]').prop('disabled', true);
                $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val(), thisTileSharkfin);
                // checkupfrontPriceSharkfin(thisTileSharkfin);  //LGTGTWINT-1095

            }

    }
    } catch (error) {
    }
}
function checkKOKITypeSharkfin(KOKIType, thisTileSharkfin, calledFromIndex) {
    try {
        if(calledFromIndex != true){
        if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
            $(thisTileSharkfin).find('[id^="koinputbox"]').prop('disabled', false); //Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileSharkfin).find('[id^="kiinputbox"]').prop("disabled", true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileSharkfin).find('[id^="noncallinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        }  else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
            $(thisTileSharkfin).find('[id^="koinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileSharkfin).find('[id^="kiinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileSharkfin).find('[id^="noncallinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
            $(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled", true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileSharkfin).find('[id^="kiinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileSharkfin).find('[id^="noncallinputbox"]').prop('disabled', true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        } else if (KOKIType == "NOKINOKO") {
            $(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled", true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileSharkfin).find('[id^="kiinputbox"]').prop('disabled', true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileSharkfin).find('[id^="noncallinputbox"]').prop('disabled', true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        }
        }else{
            if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
                $(thisTileSharkfin).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTileSharkfin).find('[id^="kiinputbox"]').prop("disabled", true);
                $(thisTileSharkfin).find('[id^="noncallinputbox"]').prop('disabled', false);
            } else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
                $(thisTileSharkfin).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTileSharkfin).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileSharkfin).find('[id^="noncallinputbox"]').prop('disabled', false);
            } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
                $(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTileSharkfin).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileSharkfin).find('[id^="noncallinputbox"]').prop('disabled', true);
            } else if (KOKIType == "NOKINOKO") {
                $(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTileSharkfin).find('[id^="kiinputbox"]').prop('disabled', true);
                $(thisTileSharkfin).find('[id^="noncallinputbox"]').prop('disabled', true);
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

function checkupfrontPriceSharkfin(thisTileSharkfin){

    try{

        let _ibprice =   parseFloat(100 -  Number($(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').val())).toFixed(2);;

        $(thisTileSharkfin).find('[id^="IBPriceipbox"]').val(_ibprice);
    
        let _upfront =  parseFloat(100 -  Number($(thisTileSharkfin).find('[id^="IBPriceipbox"]').val())).toFixed(2);
    
        $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').val(_upfront);

    }catch(er){
        
        console.log(er.message);

    }
    

}

var globalSolveForValueSharkfin='';
// To get best price for Sharkfin
function getBestPriceSharkfin(that) {
    try {
       

        thisTileSharkfin = $(that).parents(".sorting")[0];
        
        console.log('Start Interval value =' + $(thisTileSharkfin).find('[id^="hdnintervalID"]').val());

        $(thisTileSharkfin).find('[id^="btnBestPriceSharkfin"]').attr("disabled", true); // INT1FIN47-768 Gateway Markets Instant Pricing issue

        var requestIDSharkfin = "";

        requestIDSharkfin = requestIDSharkfin + RequestIDGenerator(60);

        $(thisTileSharkfin).find('[id^="hdnRequestID"]').val(requestIDSharkfin);  //INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileSharkfin,'[id^="btnBestPriceSharkfin"]', false);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        $(thisTileSharkfin).find('[id^="EQCRfqidpnl"]').hide();
        $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html("");
        //End

        globalSolveForValueSharkfin = $(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').val().trim();

        clearInterval($(thisTileSharkfin).find('[id^="hdnintervalID"]').val());

        console.log('After clear Interval value =' + $(thisTileSharkfin).find('[id^="hdnintervalID"]').val());

        $(thisTileSharkfin).find('[id^="hdnintervalID"]').val("");


        TileId = that.id.match(/\d+$/)[0];

        sessionStorage.setItem("poolingTimer_" + TileId, 0);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        thisTileSharkfin = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        console.log(TileId, thisTileSharkfin, productName);
        getddlList = $.trim($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val());

        $(thisTileSharkfin).find('[id^="TBLSharkfin"]' + " td").each(function () {
            //Clear prices || Tina K || 11-Sep-2019
            $(this).html("-");
        })
        validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
        clearPricerTable(thisTileSharkfin); //To clear prices after clicking best price || Tina K || 20-Nov-2019
        //Validation conditions added : Tina Kshirsagar : 6-09-2019

        
        let tenorNumb = $(thisTileSharkfin).find("[id^='tenor_Sharkfin']").val();
        let tenorstring = $(thisTileSharkfin).find("[id^='tenorddl']").val();
        let _tenor = tenorNumb + tenorstring;

        let _tenorinMonths = "";

        if(tenorstring != "M"){

            _tenorinMonths =  parseFloat($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').val()) * 12;

        }else{

            _tenorinMonths =  parseFloat($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').val());
        }
        
        if ($(thisTileSharkfin).find('[id^="shareDivSharkfin"]')[0].childNodes.length <= 1) {     
            ValidateField($(thisTileSharkfin).find('[id^="shareDivSharkfin"]').attr('id'), "Please Enter Valid Shares", thisTileSharkfin);
            return false  
        } else if ($.trim($(thisTileSharkfin).find('[id^="ContractAmtSharkfin"]').val()) == '' || parseFloat($(thisTileSharkfin).find('[id^="ContractAmtSharkfin"]').val()) < 0) {
            ValidateField($(thisTileSharkfin).find('[id^="ContractAmtSharkfin"]').attr('id'), "Please Enter Valid Notional", thisTileSharkfin); // LGTGTWINT-1487 | Chaitanya M | 24 Feb 2023
            return false
        } else if ($.trim($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').val()) == '' || parseFloat($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').val()) <=0) {
            ValidateField($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').attr('id'), "Please enter valid tenor", thisTileSharkfin);
            return false
        }else if ($.trim($(thisTileSharkfin).find('[id^="ddlSharkfinCcy"]').val()) == '') {
            ValidateField($(thisTileSharkfin).find('[id^="ddlSharkfinCcy"]').attr('id'), "Please Select Valid Ccy", thisTileSharkfin);
            return false
        } else if ((parseFloat($(thisTileSharkfin).find('[id^="koinputbox"]').val()) == "" || parseFloat($(thisTileSharkfin).find('[id^="koinputbox"]').val()) <= Number(DRAFCNMinKO) || parseFloat($(thisTileSharkfin).find('[id^="koinputbox"]').val()) > Number(DRAFCNMaxKO)) && $(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled") != true) {
            ValidateField($(thisTileSharkfin).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO (%) Initial.", thisTileSharkfin);
            return false;
        } else if ((parseFloat($(thisTileSharkfin).find('[id^="kiinputbox"]').val()) == "" || parseFloat($(thisTileSharkfin).find('[id^="kiinputbox"]').val()) <= 0) && $(thisTileSharkfin).find('[id^="kiinputbox"]').prop("disabled") != true) {
            ValidateField($(thisTileSharkfin).find('[id^="kiinputbox"]').attr("id"), "Please Enter Valid KI (%)", thisTileSharkfin);
            return false;
        } else if (($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "3M")) {
            ValidateField($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTileSharkfin);
            return false;
        } else if (($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "QUARTERLY" || $(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "1M")) {
            ValidateField($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTileSharkfin);
            return false;
        } else if (($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "9M")) {
            ValidateField($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTileSharkfin);
            return false;
        }  else if (($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "6M")) {
            ValidateField($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTileSharkfin);
            return false;
        } else if($(thisTileSharkfin).find('[id^="noncallinputbox"]').val() <= 0 || $(thisTileSharkfin).find('[id^="noncallinputbox"]').val() == "") {
            ValidateField($(thisTileSharkfin).find('[id^="noncallinputbox"]').attr("id"), "Non Call can not be zero negative. ", thisTileSharkfin);
            return false; 
        } else if($(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "MONTHLY")){
            if(parseFloat($(thisTileSharkfin).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths)){
                ValidateField($(thisTileSharkfin).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileSharkfin);
                return false;
            }
        } else if($(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY")){
            if(parseFloat($(thisTileSharkfin).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 2)){
                ValidateField($(thisTileSharkfin).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileSharkfin);
                return false;
            }
        } else if($(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "QUARTERLY")){
            if(parseFloat($(thisTileSharkfin).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 3)){
                ValidateField($(thisTileSharkfin).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileSharkfin);
                return false;
            }
        } else if($(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY")){
            if(parseFloat($(thisTileSharkfin).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 6)){
                ValidateField($(thisTileSharkfin).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileSharkfin);
                return false;
            }
        } else if($(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY")){
            if(parseFloat($(thisTileSharkfin).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 12)){
                ValidateField($(thisTileSharkfin).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileSharkfin);
                return false;
            }
        }

        // RizwanS || LGTGTWINT-2320 || 17 Aug 2023
        if (NotionalMinMaxCheck === "YES") {
            if(parseFloat($(thisTileSharkfin).find('[id^="ContractAmtSharkfin"]').val().replace(/,/g, "")) === 0){     
                ValidateField($(thisTileSharkfin).find('[id^="hdnQuoteID"]').attr('id'),"Please input non zero notional.",thisTileSharkfin);
                return false;
            }
        }
        //END

        
        if ($(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').val().split("(")[0].trim().toUpperCase() == "STRIKE") {
            if (parseFloat($(thisTileSharkfin).find('[id^="IBPriceipbox"]').val()) == "" || parseFloat($(thisTileSharkfin).find('[id^="IBPriceipbox"]').val()) <= 0 || parseFloat($(thisTileSharkfin).find('[id^="IBPriceipbox"]').val()) > 100) {
                ValidateField($(thisTileSharkfin).find('[id^="IBPriceipbox"]').attr("id"), "Price % must be greater than 0 and less than 100", thisTileSharkfin);
                return false;
            } else if (parseFloat($(thisTileSharkfin).find('[id^="couponipbox"]').val()) == "" || parseFloat($(thisTileSharkfin).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileSharkfin).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileSharkfin).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon (%)", thisTileSharkfin);
                return false;
            }else if ($(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileSharkfin).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileSharkfin).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileSharkfin).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileSharkfin).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%)", thisTileSharkfin);
                return false;
            }
        } else if ($(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').val().split("(")[0].trim().toUpperCase() == "COUPON") {
            if (parseFloat($(thisTileSharkfin).find('[id^="strikeipbox"]').val()) == "" || parseFloat($(thisTileSharkfin).find('[id^="strikeipbox"]').val()) <= 0 ) { // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                ValidateField($(thisTileSharkfin).find('[id^="strikeipbox"]').attr("id"), " Strike % must be greater than 0.", thisTileSharkfin);  // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                return false;
            } else if (parseFloat($(thisTileSharkfin).find('[id^="IBPriceipbox"]').val()) == "" || parseFloat($(thisTileSharkfin).find('[id^="IBPriceipbox"]').val()) <= 0 || parseFloat($(thisTileSharkfin).find('[id^="IBPriceipbox"]').val()) > 100) {
                ValidateField($(thisTileSharkfin).find('[id^="IBPriceipbox"]').attr("id"), "Price % must be greater than 0 and less than 100", thisTileSharkfin);
                return false;
            } else if ($(thisTileSharkfin).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileSharkfin).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileSharkfin).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileSharkfin).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%)", thisTileSharkfin);
                return false;
            }else if ($(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled") != true && (parseFloat($(thisTileSharkfin).find('[id^="strikeipbox"]').val()) > parseFloat($(thisTileSharkfin).find('[id^="koinputbox"]').val()))) {
                //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(DRAFCNEnableStrikeBelowKO.toUpperCase() === "YES"){
                    ValidateField($(thisTileSharkfin).find('[id^="strikeipbox"]').attr("id"),"Strike (%) should be less than KO (%)", thisTileSharkfin);
                    return false;
                }
                //END - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
            }else if ($(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileSharkfin).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileSharkfin).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileSharkfin).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileSharkfin).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%)", thisTileSharkfin);
                return false;               
            }else if(parseFloat($(thisTileSharkfin).find('[id^="strikeipbox"]').val()) > 100){ //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(DRAFCNStrikeBeyond100Pct.toUpperCase() === "NO"){
                    ValidateField($(thisTileSharkfin).find('[id^="strikeipbox"]').attr("id"), " Strike % must be less than or equal to 100.", thisTileSharkfin);
                    return false;
                }
            } //End - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
        } else if ($(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').val().split("(")[0].trim().toUpperCase() == "IB PRICE") {
            if (parseFloat($(thisTileSharkfin).find('[id^="strikeipbox"]').val()) == "" || parseFloat($(thisTileSharkfin).find('[id^="strikeipbox"]').val()) <= 0 ) { //  LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                ValidateField($(thisTileSharkfin).find('[id^="strikeipbox"]').attr("id"), " Strike % must be greater than 0.", thisTileSharkfin);// LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                return false;
            } else if (parseFloat($(thisTileSharkfin).find('[id^="couponipbox"]').val()) == "" ||parseFloat($(thisTileSharkfin).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileSharkfin).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileSharkfin).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon (%)", thisTileSharkfin);
                return false;
            } else if ($(thisTileSharkfin).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileSharkfin).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileSharkfin).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileSharkfin).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%)", thisTileSharkfin);
                return false;
            }else if ($(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled") != true && (parseFloat($(thisTileSharkfin).find('[id^="strikeipbox"]').val()) > parseFloat($(thisTileSharkfin).find('[id^="koinputbox"]').val()))) {
                // Start- LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(DRAFCNEnableStrikeBelowKO.toUpperCase() === "YES"){
                    ValidateField($(thisTileSharkfin).find('[id^="strikeipbox"]').attr("id"),"Strike (%) should be less than KO (%)", thisTileSharkfin);
                    return false;
                }
                //End - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
            }else if ($(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileSharkfin).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileSharkfin).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileSharkfin).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileSharkfin).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%)", thisTileSharkfin);
                return false;
            }else if(parseFloat($(thisTileSharkfin).find('[id^="strikeipbox"]').val()) > 100){ //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(DRAFCNStrikeBeyond100Pct.toUpperCase() === "NO"){
                    ValidateField($(thisTileSharkfin).find('[id^="strikeipbox"]').attr("id"), "Strike % must be less than or equal to 100.", thisTileSharkfin);
                    return false;
                }
            } //End - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
            //Validation End
        }


         // Added by RizwanS for tenor validation before pricing || 03 Jan 2022 ||

         if( $(thisTileSharkfin).find('[id^="tenorddl"]').val() == "M"){

            if(Number($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').val()) > Number(FCNAllowedTenorinMonths)){
                ValidateField($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').attr("id"), "Please enter valid tenor.", thisTileSharkfin);
                return false;
            }

        } else{

             if(Number($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').val()) > Number(SharkfinAllowedTenorinYears)){
                ValidateField($(thisTileSharkfin).find('[id^="tenor_Sharkfin"]').attr("id"), "Please enter valid tenor.", thisTileSharkfin);
                return false;
            }
        }
        
        // END

        $("body").css("opacity", "0.9");

    
        if ($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val() == "NOKIKODC") {
            KIPerc = "";
            KIType = "";
            KOPerc = $(thisTileSharkfin).find('[id^="koinputbox"]').val();
            KOType = "American";

        } else if ($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val() == "NOKIKOPE") {
            KIPerc = "";
            KIType = "";
            KOPerc = $(thisTileSharkfin).find('[id^="koinputbox"]').val();
            KOType = "European";

        } else if ($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val() == "KIDCKODC") {
            KIPerc = $(thisTileSharkfin).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileSharkfin).find('[id^="koinputbox"]').val();
            KIType = "American";
            KOType = "American";
        
        } else if ($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val() == "KIDCKOPE") {
            KIPerc = $(thisTileSharkfin).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileSharkfin).find('[id^="koinputbox"]').val();
            KIType = "American";
            KOType = "European";

        } else if ($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val() == "KIEURKODC") {
            KIPerc = $(thisTileSharkfin).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileSharkfin).find('[id^="koinputbox"]').val();
            KIType = "European";
            KOType = "American";

        } else if ($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val() == "KIEURKOPE") {
            KIPerc = $(thisTileSharkfin).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileSharkfin).find('[id^="koinputbox"]').val();
            KIType = "European";
            KOType = "European";
        } else if ($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val() == "KIDCNOKO") {
            KIPerc = $(thisTileSharkfin).find('[id^="kiinputbox"]').val();
            KOPerc = ""
            KIType = "American";
            KOType = "";
        } else if ($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val() == "KIEURNOKO") {
            KIPerc = $(thisTileSharkfin).find('[id^="kiinputbox"]').val();
            KOPerc = ""
            KIType = "European";
            KOType = "";
        } else if ($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val() == "NOKINOKO") {
            KIPerc = "";
            KOPerc = ""
            KIType = "";
            KOType = "";
        }
        let solveForSharkfin = "";
        if ($(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').val().split("(")[0].trim().toUpperCase() == "STRIKE") {
            solveForSharkfin = "CONVERSION_STRIKE";
        } else if ($(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').val().split("(")[0].trim().toUpperCase() == "IB PRICE") {
            solveForSharkfin = "PRICE";
        } else if ($(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').val().split("(")[0].trim().toUpperCase() == "COUPON") {
            solveForSharkfin = "COUPON";
        }


        let _upfront = "";

        if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

           _upfront =  $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').val().trim() ?$(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').val().trim() :0 

        }else{

            _upfront =  "0.00"; 
        }
    

        let exchangeList = getExchangeAndCcyFromBasket($(thisTileSharkfin).find('[id^="shareDivSharkfin"]')[0], 'exchange');
        let ccyList = getExchangeAndCcyFromBasket($(thisTileSharkfin).find('[id^="shareDivSharkfin"]')[0], 'ccy');
        let shareList = getExchangeAndCcyFromBasket($(thisTileSharkfin).find('[id^="shareDivSharkfin"]')[0], 'share');

        let _QuantoFlagSharkfin = "";
        uniqueCCY = ccyList.filter((item, i, ar) => ar.indexOf(item) === i);
        if(uniqueCCY.length==1){
            if($(thisTileSharkfin).find('[id^="ddlSharkfinCcy"]').val()== uniqueCCY[0]){
                _QuantoFlagSharkfin = "No";
            } else{
                _QuantoFlagSharkfin = "Yes";
            }
        }else{
            _QuantoFlagSharkfin = "Yes";
        }

        //End


        // LGTGTWINT-1227 - Instant Pricing: EQC Ref missing for rfqs placed through instant pricing | 24 Feb 2023

           let _tenorSharkfin = ""

           if(tenorstring.toUpperCase().includes("M")){
           
            _tenorSharkfin= "MONTH";
           
           }else{
           
            _tenorSharkfin= "YEAR";
           }

        //    let getRefSharkfin = "";
           
           let getRefSharkfin = getEQCRefrenceNumber(productName,KOType,KIType,tenorNumb,_tenorSharkfin,$(thisTileSharkfin).find('[id^="couponipbox"]').val(),_QuantoFlagSharkfin,"Worst of");
           
           $(thisTileSharkfin).find('[id^="hdnRefnumber"]').val(getRefSharkfin); //LGTGTWINT-1589 Instant Pricing : EQC ref different on instant pricer and order details,quote mail and order mail


        // END        
        mapleLoaderStart(thisTileSharkfin,'[id^="btnBestPriceSharkfin"]', false);


        QuoteObject = {
          
            "BarrierPerc":  $(thisTileSharkfin).find('[id^="koinputbox"]').val(),
            "Ccy": $(thisTileSharkfin).find('[id^="ddlSharkfinCcy"]').val().trim(),
            "CouponFrq": $(thisTileSharkfin).find('[id^="ddlCouponFrequency"]').val().toUpperCase(), 
            "CouponPerc":  $(thisTileSharkfin).find('[id^="couponipbox"]').val(),
            "EntityID":  sessionStorage.getItem("EQC_EntityID").toString(),
            "Exchange1":  exchangeList[0],
            "Exchange2": exchangeList[1],
            "Exchange3":  exchangeList[2],
            "Exchange4":  exchangeList[3]?? "",
            "GuaranteedDuration": "",
            "KIPerc": KIPerc,
            "KIType":  KIType,
            "KOPerc": KOPerc,
            "KOType": KOType,
            "Notional":  $(thisTileSharkfin).find('[id^="ContractAmtSharkfin"]').val().replace(/,/g, "").split(".")[0],
            "PPDetails": "",
            "PricePerc":$(thisTileSharkfin).find('[id^="IBPriceipbox"]').val(), //
            "QuantoYN": _QuantoFlagSharkfin, // LGTGTWINT-1448| Chaitanya M | 20 Feb 2023
            "RMName": "",
            "Settlement_Days": Number($(thisTileSharkfin).find('[id^="SettlWeeks"]').val().trim()),
            "Tenor": _tenor,
            "Type": "Sharkfin",
            "UnderlyingCode1": shareList[0],
            "UnderlyingCode2": shareList[1],
            "UnderlyingCode3": shareList[2],
            "UnderlyingCode4": shareList[3] ?? "" ,
            "Upfront":_upfront, // Added by Aniruddhaj 30Nov2022 LGTGTWINT-429
            "UserID":sessionStorage.getItem("EQC_UserName").toString(),
            "nonCall": $(thisTileSharkfin).find('[id^="noncallinputbox"]').val(),
            "strSolveFor":solveForSharkfin,
            "strikePerc": $(thisTileSharkfin).find('[id^="strikeipbox"]').val(),
            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
            "CurrentTileID": TileId,
            "requestID":$(thisTileSharkfin).find('[id^="hdnRequestID"]').val(), //INT1FIN47-768 Gateway Markets Instant Pricing issue
            "BuysideID": getRefSharkfin,
        }

        console.log('Sharkfin price req ', QuoteObject);

        getQuoteSharkfin(QuoteObject, $(thisTileSharkfin).find('[id^="hdnintervalID"]')[0]);

        

    } catch (er) {
        console.log(er.message);

    }
}

// To get quote 
function getQuoteSharkfin(QuoteObject, uniqueIntervalID) {
    try {

        var dataSharkfin = request_getDataFromAPI(QuoteObject, clientConfigdata.CommonMethods.NodeServer + "getBestPriceSharkfin45").then(dataSharkfin => {

            thisTileSharkfin = document.getElementById("td" + dataSharkfin.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataSharkfin.CurrentTileID, true);
            mapleLoaderStart(thisTileSharkfin,'[id^="btnBestPriceSharkfin"]', false); 
            getUniqQuoteResponseSharkfin(thisTileSharkfin, dataSharkfin, uniqueIntervalID,QuoteObject.requestID); //INT1FIN47-768 Gateway Markets Instant Pricing issue 

        }).catch(error => { console.log(error); })

    } catch (err) {
        console.log(err.message);
    }
}

function getUniqQuoteResponseSharkfin(thisTileSharkfin, dataSharkfin, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var UIID = null;
        // Added by Atharva - EQC Timers - START
        isTimerStarted["td" + dataSharkfin.CurrentTileID] = false;
        myCounter["td" + dataSharkfin.CurrentTileID] = {};
        hasUserClickedEQC["td" + dataSharkfin.CurrentTileID] = false;
        $(thisTileSharkfin).find('[id^="hdnSelectedBank"]').val("");
       
        // END

        uniqueIntervalID.value = setInterval(function () {

            if(reqestID != $(thisTileSharkfin).find('[id^="hdnRequestID"]').val() || $(thisTileSharkfin).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                if($(thisTileSharkfin).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                mapleLoaderStop(thisTileSharkfin,'[id^="btnBestPriceSharkfin"]', false);
                }
                return false
            } // INT1FIN47-768 Gateway Markets Instant Pricing issue
            sessionStorage.setItem("quoteToken_" + thisTileSharkfin.id.match(/\d+$/)[0], "");
            sessionStorage.setItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0], "");

            sessionStorage.setItem("quoteToken_" + thisTileSharkfin.id.match(/\d+$/)[0], dataSharkfin['token']);
            sessionStorage.setItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0], dataSharkfin['responseData']);


            getFinalQuoteResponseSharkfin(sessionStorage.getItem("quoteToken_" + thisTileSharkfin.id.match(/\d+$/)[0]), sessionStorage.getItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]), thisTileSharkfin, uniqueIntervalID, reqestID);

        }, clientConfigdata.EQCSharkfin.PollInterval);


        console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
    } catch (error) {
        console.log(error)
    }
}

// To get price 
function getFinalQuoteResponseSharkfin(finalTokenSharkfin1, finalResponseDataSharkfin1, thisTileSharkfin, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var currentDateAndTime = new Date();

        sessionStorage.setItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0], finalResponseDataSharkfin1);

        sessionStorage.setItem("quoteToken_" + thisTileSharkfin.id.match(/\d+$/)[0], finalTokenSharkfin1);

        console.log("Sharkfin RFQ's :: " + finalResponseDataSharkfin1 + " " + currentDateAndTime);
        
        Timer = Timer + 1;


        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileSharkfin.id.match(/\d+$/)[0])) >= Number(DRAFCNrequestCount.toString().split(".")[0]) || sessionStorage.getItem("pricingToggle" + thisTileSharkfin.id.match(/\d+$/)[0]) == "false") { //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
            
            $(thisTileSharkfin).find('[id^="btnBestPriceSharkfin"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval(uniqueIntervalID.value);
            mapleLoaderStop(thisTileSharkfin,'[id^="btnBestPriceSharkfin"]', false);
            
            uniqueIntervalID.value = "";
            QuoteObject = "";
            $(thisTileSharkfin).find('[id^="OverlayDiv"]').hide();
     
            $("body").css("opacity", "");
            arrSharkfin = [];
            maxSharkfin = "";
            TimerSharkfin = 0;

            //Call Draw Graph
            // $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val(JSON.stringify(finalObjSharkfin));
            // if (finalObjSharkfin != null || finalObjSharkfin != undefined) {
            //     drawgraphSharkfin($(thisTileSharkfin).find('[id^="canvas"]').attr('id'));
            // }
            // INT1FIN47-768 Gateway Markets Instant Pricing issue

            return false;

        } else {
            var repriceObjectSharkfin = request_getDataFromAPI({
                "PPDetails": sessionStorage.getItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]),
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": thisTileSharkfin.id.match(/\d+$/)[0],
                "UserID":sessionStorage.getItem("EQC_UserName").toString(),
            }, clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseSharkfin45").then(repriceObjectSharkfin => {

                thisTileSharkfin = document.getElementById("td" + repriceObjectSharkfin.CurrentTileID);
                // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileSharkfin).find('[id^="btnEmailQuote"]').attr("disabled", false);
                $(thisTileSharkfin).find('[id^="BookTradeSharkfin"]').attr("disabled", false);
                $(thisTileSharkfin).find('[id^="OrderEmail"]').attr("disabled",false); //LGTGTWINT-1981 || RizwanS || 12 May 2023 
                if(reqestID != $(thisTileSharkfin).find('[id^="hdnRequestID"]').val() || $(thisTileSharkfin).find('[id^="hdnRequestID"]').val() === ""){ //RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    if($(thisTileSharkfin).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                        mapleLoaderStop(thisTileSharkfin,'[id^="btnBestPriceSharkfin"]', false);
                    }
                    return false
                } //INT1FIN47-768Gateway Markets Instant Pricing issue

                sessionStorage.setItem("poolingTimer_" + repriceObjectSharkfin.CurrentTileID, Number(sessionStorage.getItem("poolingTimer_" + thisTileSharkfin.id.match(/\d+$/)[0])) + 1);
                
                finalObjSharkfin = (repriceObjectSharkfin['responseData']);

                sessionStorage.setItem("quoteToken_" + thisTileSharkfin.id.match(/\d+$/)[0], repriceObjectSharkfin['token']);
                sessionStorage.setItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]));
                // Sorted By Best Price LP'S                                
                finalObjSharkfin.sort(function (a, b) {
                    if (a.DRAOUT === null || a.DRAOUT == "" || a.DRAOUT == "Timeout" || a.DRAOUT.toUpperCase().trim() == "REJECTED" || a.DRAOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return 1;
                    } else if (b.DRAOUT === null || b.DRAOUT == "" || b.DRAOUT == "Timeout" || b.DRAOUT.toUpperCase().trim() == "REJECTED" || b.DRAOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return -1;
                    } else if (a.DRAOUT === b.DRAOUT) {
                        return 0;
                    }

                    if ($(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').val().split("(")[0].trim().toUpperCase() == "COUPON") {
                        return Number(a.DRAOUT) > Number(b.DRAOUT) ? -1 : 1;
                    } else {
                        return Number(a.DRAOUT) < Number(b.DRAOUT) ? -1 : 1;
                    }

                });
                maxSharkfin = finalObjSharkfin[0].DRAOUT;
                //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
                //$(thisTileSharkfin).find('[id^="EQCRfqidpnl"]').show();
                // $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html("");
                // $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html("RFQ ID: " + finalObjSharkfin[0].EP_ER_QuoteRequestId);
                //end
                // END
                //Removed || LGTGTWINT-1981 || RizwanS || 12 May 2023
                $(thisTileSharkfin).find('[id^="hdnfinalTokenSharkfin"]').val(sessionStorage.getItem("quoteToken_" + thisTileSharkfin.id.match(/\d+$/)[0]));
               
               
                if (sessionStorage.getItem("pricingToggle" + thisTileSharkfin.id.match(/\d+$/)[0]) == "true") {
                    // Added by Atharva - EQC Timers - START
                    var isNonBestPrice = false;
                    if(clientConfigdata.CommonMethods.NonBestPrice == "Y") {
                        isNonBestPrice = true;
                    }
                    else {
                        isNonBestPrice = false;
                    }
                    // every time in new request indexes might change so clearing.
                    mapIndexToBank["td"+repriceObjectSharkfin.CurrentTileID] = {};
                    // END
                    // $(thisTileSharkfin).find('[id^="SharkfinBanksRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // $(thisTileSharkfin).find('[id^="SharkfinPrices"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // Added by Atharva - EQC Timers - START
                    $(thisTileSharkfin).find('[id^="SharkfinTimerRow"]').empty();
                    if(!hasUserClickedEQC["td"+repriceObjectSharkfin.CurrentTileID]) {
                        $(thisTileSharkfin).find('[id^="hdnSelectedBank"]').val("");
                    }
                    var itr = 0;
                    // END
                    // $(thisTileSharkfin).find('[id^="minMaxNotionalLimitRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023

                    //Check for best price count || LGTGTWINT-1981 || RizwanS || 12 May 2023
                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023
                    if (NotesBestPriceDisplayCount != "") { 

                        // LGTGTWINT-2018 - Prices to be displayed for EAM entity on MSP and IP only when the input notional falls within min max range of CPs || RizwanS || 24 May 2023
                        if(NotionalMinMaxCheck.toUpperCase() === 'YES' && parseFloat($(thisTileSharkfin).find('[id^="ContractAmtSharkfin"]').val().replace(/,/g, "")) > 0){  //RizwanS || LGTGTWINT-2153 || 27 Jun 2023
                            
                            let sliceCount = Number(NotesBestPriceDisplayCount); // Count to show best prices as per config set
                        
                            let productname = $(thisTileSharkfin).find(".productName").attr("id");

                            let _minmaxObj = [];

                            for(i=0;i<finalObjSharkfin.length;i++){
        

                                if(parseFloat($(thisTileSharkfin).find('[id^="ContractAmtSharkfin"]').val().replace(/,/g, "")) <= parseFloat(finalObjSharkfin[i].MaxNotional)
                                && parseFloat($(thisTileSharkfin).find('[id^="ContractAmtSharkfin"]').val().replace(/,/g, "")) >= parseFloat(finalObjSharkfin[i].MinNotional)){
                                    
                                    _minmaxObj.push(finalObjSharkfin[i]);
        
                                }
        
                            }

                            if(_minmaxObj.length <= 0){

                                $(thisTileSharkfin).find('[id^="btnEmailQuote"]').attr("disabled", true);
                                $(thisTileSharkfin).find('[id^="BookTradeSharkfin"]').attr("disabled", true);
                                $(thisTileSharkfin).find('[id^="OrderEmail"]').attr("disabled",true); 
                                return false;
                            } 
    
                            finalObjSharkfin = sliceEQCbestprices(_minmaxObj,productname,sliceCount);
                           
                        } //END
                    }

                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023
                    $(thisTileSharkfin).find('[id^="SharkfinBanksRow"]').empty();
                    $(thisTileSharkfin).find('[id^="SharkfinPrices"]').empty();
                    $(thisTileSharkfin).find('[id^="minMaxNotionalLimitRow"]').empty();
                    //END
 
                    bindRFQIDEQC(thisTileSharkfin,finalObjSharkfin); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023

                    $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val(JSON.stringify(finalObjSharkfin));

                    // END

                    $(finalObjSharkfin).each(function (i, elem) {
                        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
                        var priceClass = "GlowPrice_Red";
                        if (!glowFlag) {
                            priceClass = "noGlow";
                        }

                        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                        // $(thisTileSharkfin).find('[id^="EQCRfqidpnl"]').show();
                        // $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html(elem.ParentID);
                        //end

                        var str = "";
                        var str2 = "";
                        if (elem.PP_CODE != null) {
                            // Added by Atharva - EQC Timers - START
                            mapIndexToBank["td"+repriceObjectSharkfin.CurrentTileID][itr] = elem.PP_CODE;
                            if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "Rejected" &&  elem.DRAOUT != "" && $(thisTileSharkfin).find('[id^="hdnSelectedBank"]').val() == "") {
                                $(thisTileSharkfin).find('[id^="hdnSelectedBank"]').val(elem.PP_CODE);
                            }
                            if (elem.PP_CODE == "CITI") {
                                if(isNonBestPrice) {
                                    if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "Rejected" &&  elem.DRAOUT != "" && ($(thisTileSharkfin).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectSharkfin.CurrentTileID + "_" + itr + "'>" + "Citi" + "</button></td>";
                                    }
                                    else if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "Rejected" && elem.DRAOUT != "") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectSharkfin.CurrentTileID + "_" + itr + "'>" + "Citi" + "</td>";
                                    }
                                    else {
                                        str = str + "<td>" + "Citi" + "</td>";
                                    }
                                }
                                else {
                                    str = str + "<td";
                                    if(itr == 0 && elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "Rejected" &&  elem.DRAOUT != "") {
                                        str = str + " class='bestPriceStyle'"
                                    }
                                    str = str + ">Citi</td>";
                                }
                                
                            } else {
                                if(isNonBestPrice) {
                                    if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "Rejected" &&  elem.DRAOUT != "" && ($(thisTileSharkfin).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectSharkfin.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</button></td>";
                                    }
                                    else if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "Rejected" &&  elem.DRAOUT != "") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectSharkfin.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</td>";
                                    }
                                    else {
                                        str = str + "<td>" + elem.PP_CODE + "</td>";
                                    }
                                }
                                else {
                                    str = str + "<td";
                                    if(itr == 0 && elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "Rejected" &&  elem.DRAOUT != "") {
                                        str = str + " class='bestPriceStyle'"
                                    }
                                    str = str + ">" + elem.PP_CODE + "</td>";
                                }
                            }
                            // END
                            $(thisTileSharkfin).find('[id^="SharkfinBanksRow"]').append(str);
                        } else {
                            str = str + "<td>--</td>"
                            $(thisTileSharkfin).find('[id^="SharkfinBanksRow"]').append(str);
                        }
                        if (elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected") {
                            // Added by Atharva - EQC Timers
                            // Added new if condition
                            if(isNonBestPrice) {
                                if($(thisTileSharkfin).find('[id^="hdnSelectedBank"]').val() == elem.PP_CODE) {
                                
                                    str2 = str2 + "<td class='priceBackground";
                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                    if(parseFloat(elem.DRAOUT).toFixed(2) < 2){
                                       
                                        if(itr == 0) {
                                            str2 = str2 + " negativeprice";
                                        }

                                    }else{

                                        if(itr == 0) {
                                            str2 = str2 + " bestPriceStyle";
                                        }

                                    }
                                    // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                    str2 = str2 + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectSharkfin.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DRAOUT).toFixed(2) + "%</button></td>"
                                    $(thisTileSharkfin).find('[id^="SharkfinPrices"]').append(str2);
                                } else {
                                    str2 = str2 + "<td";

                                    if(parseFloat(elem.DRAOUT).toFixed(2) < 2){

                                        if(itr == 0) {
                                            str2 = str2 + " class='negativeprice_nonbest'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton negativeprice_nonbest' onclick='setPriceEQC(this)' id='td" + repriceObjectSharkfin.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DRAOUT).toFixed(2) + "%</button></td>"
                                        $(thisTileSharkfin).find('[id^="SharkfinPrices"]').append(str2);

                                    } else{

                                        if(itr == 0) {
                                            str2 = str2 + " class='bestPriceStyle'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectSharkfin.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DRAOUT).toFixed(2) + "%</button></td>"
                                        $(thisTileSharkfin).find('[id^="SharkfinPrices"]').append(str2);
                                        
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
                                str2 = str2 + ">" + parseFloat(elem.DRAOUT).toFixed(2) + "%</td>";
                                $(thisTileSharkfin).find('[id^="SharkfinPrices"]').append(str2);
                            }
                        } else {
                            str2 = str2 + "<td>-</td>"
                            $(thisTileSharkfin).find('[id^="SharkfinPrices"]').append(str2);
                        }
                       

                        itr++;

                let strMinMaxNotionalLimit = '';

                if (elem.PP_CODE != null) {
                    strMinMaxNotionalLimit = strMinMaxNotionalLimit + `<td style='font-size:12px !important;'>${K_M_B_Formatter(Number(elem.MinNotional))} / ${K_M_B_Formatter(Number(elem.MaxNotional))}</td>`;
                    $(thisTileSharkfin).find('[id^="minMaxNotionalLimitRow"]').append(strMinMaxNotionalLimit);
                                        }

                        // END
                    });
                    // Added by Atharva - EQC Timers - START
                    // Should run only once
                    // if(!isTimerStarted["td" + repriceObjectSharkfin.CurrentTileID]) {
                    //     isTimerStarted["td" + repriceObjectSharkfin.CurrentTileID] = true;
                    //     startTimersEQC(repriceObjectSharkfin.CurrentTileID);
                    // }
                    // END

                }
                  
            }).catch(error => {
                console.log(error);
                $(thisTileSharkfin).find('[id^="btnBestPriceSharkfin"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
                clearInterval(uniqueIntervalID.value);
                mapleLoaderStop(thisTileSharkfin,'[id^="btnBestPriceSharkfin"]', false);
                uniqueIntervalID.value = "";
                $(thisTileSharkfin).find('[id^="OverlayDiv"]').hide();

                // $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val(JSON.stringify(finalObjSharkfin));
                // if (finalObjSharkfin != null || finalObjSharkfin != undefined) {
                //     drawgraphSharkfin($(thisTileSharkfin).find('[id^="canvas"]').attr('id'));
                // } // INT1FIN47-768 Gateway Markets Instant Pricing issue

            })
        }
    } catch (error) {

        $(thisTileSharkfin).find('[id^="btnBestPriceSharkfin"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issueclearInterval(uniqueIntervalID.value);
        sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        clearInterval(uniqueIntervalID.value);
        mapleLoaderStop(thisTileSharkfin,'[id^="btnBestPriceSharkfin"]', false);

        uniqueIntervalID.value = "";
        $(thisTileSharkfin).find('[id^="OverlayDiv"]').hide();
        // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
        $(thisTileSharkfin).find('[id^="btnEmailQuote"]').attr("disabled", true);
        $(thisTileSharkfin).find('[id^="BookTradeSharkfin"]').attr("disabled", true);
        $(thisTileSharkfin).find('[id^="OrderEmail"]').attr("disabled",true);  //LGTGTWINT-1981 || RizwanS || 12 May 2023

        console.log("getFinalQuoteResponseSharkfin : " + error.message);
        
        // $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val(JSON.stringify(finalObjSharkfin));
        // if (finalObjSharkfin != null || finalObjSharkfin != undefined) {
        //     drawgraphSharkfin($(thisTileSharkfin).find('[id^="canvas"]').attr('id'));
        // }// INT1FIN47-768 Gateway Markets Instant Pricing issue
        // sessionStorage.setItem("quoteToken_" + thisTileSharkfin.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileSharkfin.id.match(/\d+$/)[0]));
        // sessionStorage.setItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]));
        //// INT1FIN47-768 Gateway Markets Instant Pricing issue
  

    } finally {
      //  $(thisTileSharkfin).find('[id^="BookTradeSharkfin"]').attr("disabled", false);
    }
}

// To book trade
function booktradeSharkfin(that,suitabilityCheck,redirectOrder) {
    try {
      
        // startLoader();

        TileId = that.id.match(/\d+$/)[0];
        thisTileSharkfin = document.getElementById("td" + TileId);
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
            $(thisTileSharkfin).find('[id^="SharkfinBanksRow"]').children().each(function() {
                if($(thisTileSharkfin).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
            mapleOrderLoaderStop(thisTileSharkfin);
               return false;
        
        }

        // END

        let AllocationDetails=[];

        $(thisTileSharkfin).find("select.ChildrenddlBookingCenter").each(function(index, element){

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

        var Obj = JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val());
        var token1 = $(thisTileSharkfin).find('[id^="hdnfinalTokenSharkfin"]').val();
        var quoteid = Obj[selectedBankIndex].EP_ER_QuoteRequestId;
        // Added by Atharva - EQC Timers
        // Replaced 0 with selectedBankIndex

        // Added for upfront% in order blotter // JIRA ID - CFINT-1015 // 20 Oct 2020 //

        // let marginSharkfin;
        
        // if ($(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').val().split("(")[0].trim().toUpperCase()  == "STRIKE" || $(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').val().split("(")[0].trim().toUpperCase()  == "COUPON") {
                    
        //     marginSharkfin = (100 -  parseFloat($(thisTileSharkfin).find('[id^="IBPriceipbox"]').val()));
        // }
        // else {

        //     marginSharkfin = (100 - JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val())[selectedBankIndex].DRAOUT);
        //     // Added by Atharva - EQC Timers
        //     // Replaced 0 with selectedBankIndex
        // }
        
        //END
       // let _clientPrice =(parseFloat(JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val())[selectedBankIndex].DRAOUT) + parseFloat(100 - JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val())[0].DRAOUT)).toFixed(2);


        let limitPrice1 = "";
        let limitPrice2 = "";
        let limitPrice3 = "";
        let limitPrice4 = "";

        if($(thisTileSharkfin).find('[id^="ddlOrderTypeSharkfin"]').val().trim().toUpperCase() == "LIMIT"){

            if($(thisTileSharkfin).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 0){

                limitPrice1 = $(thisTileSharkfin).find('[id^="txtLimitLevel"]').val().trim();

            }else if($(thisTileSharkfin).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 1){

                 limitPrice2 = $(thisTileSharkfin).find('[id^="txtLimitLevel"]').val().trim();

            } else if($(thisTileSharkfin).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 2){

                 limitPrice3 = $(thisTileSharkfin).find('[id^="txtLimitLevel"]').val().trim();
                 
            } else if($(thisTileSharkfin).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 3){

                limitPrice4 = $(thisTileSharkfin).find('[id^="txtLimitLevel"]').val().trim();
                
            }            
        }

        //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

        let _confirmReason = "";

        if(selectedBankIndex>0){
 
            if($(thisTileSharkfin).find('[id^="ddlNONBEST"]').val() != "NONBEST_CUSTOM"){
 
              _confirmReason = $(thisTileSharkfin).find('[id^="ddlNONBEST"]').text();
      
            }else{
      
                 _confirmReason =  $(thisTileSharkfin).find('[id^="txtNONBEST"]').val(); 
                  
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
            if ($(thisTileSharkfin).find('[id^="rbRowSuitabilityToggle"]')[0].checked) {
                _chkSuitability = "NO";
                if ($(thisTileSharkfin).find('[id^="ddlReason"]').val().trim().includes("SUTSKP_CUSTOM")) { // Added by RizwanS | JIRA-LGTGTWINT-1830
                    _reasonmsg = $(thisTileSharkfin).find('[id^="txtSpecifyReason"]').val();
                }else{
                    _reasonmsg = $(thisTileSharkfin).find('[id^="ddlReason"]').val();
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
               orderQty: $(thisTileSharkfin).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
               type:$(thisTileSharkfin).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
               limitPrice1: limitPrice1,
               limitPrice2: limitPrice2,
               limitPrice3: limitPrice3,
               limitPrice4: limitPrice4,
               QuoteRequestId: quoteid,
               loginUser: sessionStorage.getItem("EQC_UserName").toString(),
               margin: "0.00",//Number(marginSharkfin).toFixed(2),
               clientPrice:"0.00",
               yield: "",
               bookingBranch: $(thisTileSharkfin).find('[id^="ddlBookingBranch"]').val(),
               rmNameForOrderConfirmation: $(thisTileSharkfin).find('[id^="ddlRMName"]').val(),
               dealerNotificationEmailID: $(thisTileSharkfin).find('[id^="txtComment"]').val(),
               orderComment: $(thisTileSharkfin).find('[id^="txtComment"]').val(),
               confirmationReason: _confirmReason,
               advisoryReason: $(thisTileSharkfin).find('[id^="txtComment"]').val(),
               preTradeXml: preTradeXml,
            // chkSuitability:$(thisTileSharkfin).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
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
                "orderQuantity": $(thisTileSharkfin).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "OrderType": $(thisTileSharkfin).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
                "LimitPrice1": limitPrice1,
                "LimitPrice2": limitPrice2,
                "LimitPrice3": limitPrice3,
                "LimitPrice4": limitPrice4,
                "QuoteRequestId": quoteid,
                "PoolID": "",
                "RedirectOrderID": "",
                "OrderComment": $(thisTileSharkfin).find('[id^="txtComment"]').val(),
                "Margin": "0.00",//Number(marginSharkfin).toFixed(2),
                "Notional": $(thisTileSharkfin).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "ClientPrice": "0.00",
                "ClientYield": "",
                "BookingBranch": $(thisTileSharkfin).find('[id^="ddlBookingBranch"]').val(),
                "RMNameforOrderConfirm": $(thisTileSharkfin).find('[id^="ddlRMName"]').val(),
                "RMEmailIdforOrderConfirm": "",
                "ConfirmReason": _confirmReason, //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message
                "PreTradeXml": "",
                "AdvisoryReason": "",
                // "UserRole": _reasonmsg, // Added Chaitanya M | For checking the suitability reason | Ref:LGTGTWINT-603 | 12-Jan-2023
                "CustomerID": "",
                // "chkSuitability":$(thisTileSharkfin).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
                "chkSuitability":_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                "SuitabilityReason": _reasonmsg, // Added by RizwanS | JIRA-LGTGTWINT-1830
                "IntendedSpread": "",
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": TileId,
                "AllocationDetails": AllocationDetails,
                "UserRole" : isEQCDealer === true ? 'Dealer' : isIA=== true ? 'IA' : 'RM' , // Added by RizwanS | JIRA-LGTGTWINT-1830
            
            }
        }

        mapleOrderLoaderStart(thisTileSharkfin);
           
       request_getDataFromAPI(bookObject, clientConfigdata.CommonMethods.NodeServer + orderMethodName).then(bookObject => {

            // endLoader()

            thisTileSharkfin = document.getElementById("td" + bookObject.CurrentTileID);

            TileId = bookObject.CurrentTileID;

            let bookstring = bookObject['responseData']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
             
            let OrderStatus = bookObject['message']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
        

            if (OrderStatus.toUpperCase() == clientConfigdata.EQCCommonMethods.EQC_BOOK_TRADE_RESPONSE_DETAILS.toUpperCase()) {

                // $(thisTileSharkfin).find('[id^="hdnBlotterURLSharkfin"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                // $(thisTileSharkfin).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradeSharkfin" + TileId, bookstring, "DivOverlaySharkfin");
                $(thisTileSharkfin).find('[id^="OverlayDiv"]').hide();
                $(thisTileSharkfin).find('[id^="hdnfinalTokenSharkfin"]').val("");
                clearPricerTable(thisTileSharkfin);
                
            } else {

                if(OrderStatus == "" || OrderStatus == null || OrderStatus==undefined){

                    OrderStatus = "Order Execution Failed!";
                    
                
                }else if(OrderStatus.includes("Please select booking centers from same region")){ // LGTGTWINT-1888 || RizwanS || 30 May 2023

                    OrderStatus = "Please select booking centers from same region.";
                }
                
                booktradePopup(that, "booktradeSharkfin" + TileId, OrderStatus, "DivOverlaySharkfin");
                $(thisTileSharkfin).find('[id^="OverlayDiv"]').hide();
                $(thisTileSharkfin).find('[id^="hdnfinalTokenSharkfin"]').val("");
                clearPricerTable(thisTileSharkfin);
            }
            mapleOrderLoaderStop(thisTileSharkfin);
            sessionStorage.removeItem("quoteResponse_" + thisTileSharkfin.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileSharkfin).find('[id^="btnBestPriceSharkfin"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileSharkfin).find('[id^="hdnintervalID"]').val());
            mapleLoaderStop(thisTileSharkfin,'[id^="btnBestPriceSharkfin"]', false);
            // Added by Atharva - EQC Timers - START
            $(thisTileSharkfin).find('[id^="SharkfinPrices"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            $(thisTileSharkfin).find('[id^="SharkfinBanksRow"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileSharkfin).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileSharkfin).find('[id^="BookTradeSharkfin"]').attr("disabled", true);
            $(thisTileSharkfin).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
             
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileSharkfin).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileSharkfin).find('[id^="RFQIDEQC"]').html("");
            //End

            // END
        }).catch(error => { console.log(error); })
    } catch (er) {
        console.log(er);
        booktradePopup(that, "booktradeSharkfin" + TileId, "Order Execution Failed!", "DivOverlaySharkfin");
        $(thisTileSharkfin).find('[id^="OverlayDiv"]').hide();
        // endLoader();
        mapleOrderLoaderStop(thisTileSharkfin);

    } finally {

    }
}

var dialogBoxSharkfin = null;
function emailQuoteSharkfin(that) {
    try {

        thisTileSharkfin= $(that).parents(".sorting")[0];
    
        let pricingRow = "";
        pricingRow = $(thisTileSharkfin).find("table.pricerTable .pricesRow")[0];
        mapleOrderLoaderStart(thisTileSharkfin); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
    
        if (pricingRow.cells[0].innerText.trim().toString() === "-") {
            openValidationpopup('',"No price available for mailing!"); // Changed for Change quote mail validation from "Invalid Price" to "No price available for mailing!" | Ref: LGTGTWINT-1195 | Chaitanya M | 25-jan-2023
          return false;
        }

        //create email pop up here 
        let strEmail =``;
        let emailPriceStream =JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val());
        console.log('email price stream object ', emailPriceStream);

        strEmail=strEmail+`<table class='emailTable'><tr><td class='payOff_Features'>
        <input type='checkbox' class='chkBoxParent_Email_PPCode' onchange='emailParentCheckboxChanged(this)' >
        Issuer</td><td class='payOff_Features'>${globalSolveForValueSharkfin}</td></tr>`;

        for (let e of emailPriceStream){
            if(e.DRAOUT.trim().toUpperCase()!=='REJECTED' && e.DRAOUT.trim().toUpperCase()!=='' && e.DRAOUT.trim().toUpperCase()!=='UNSUPPORTED'){ // Changed the condition for handling Unsupported response | Ref: LGTGTWINT-1321 | Chaitanya M | 06 Feb 2023
                        strEmail=strEmail+`<tr><td style='width:40px;padding:15px'><input type='checkbox' class='chkBox_Email_PPCode'  onchange='emailChildrenCheckboxChanged(this)'> ${e.PP_CODE}</td><td style='width:40px;padding:15px'>${e.DRAOUT}</td></tr>`;
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
        if(dialogBoxSharkfin===null)
        {
            dialogBoxSharkfin= $(thisTileSharkfin).find('[id^="emailDialog_Sharkfin"]')[0];
            $(thisTileSharkfin).find('[id^="emailDialog_Sharkfin"]').empty().append(strEmail);
            $(dialogBoxSharkfin).dialog({
                resizable: false,
                height: "auto",
                width: 320,
                open: function (event, ui) {// Added for LGTGTWINT-1283 || Email popup on top change | Chaitanya M | 08 Feb 2023
                    $('.ui-widget.ui-widget-content').css('z-index',999);                    
                },  
                //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                close: function (event, ui){
                    mapleOrderLoaderStop(thisTileSharkfin);
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

                    
                        if($(document).find('.ui-dialog').find('[id^="emailDialog_Sharkfin"]').find('.chkBox_Email_PPCode').length>0)
                        {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_Sharkfin"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                                if(checkboxControl.checked){
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val()).filter(function(RFQ_OBJECT){
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


                        if ($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val() != undefined && $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val().trim()!='')
                        var RFQID = JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;
    
                        if (RFQID != undefined && RFQID != ''){
                            //     MailBestQuote(thisTileSharkfin.id.match(/\d+$/)[0], JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val())[0].EP_ER_QuoteRequestId);
                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023          
                                //booktradePopup(thisTileSharkfin, "booktradeSharkfin" + thisTileSharkfin.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlaySharkfin");
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            }     
                            $(this).dialog("close"); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileSharkfin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                                "rfqId":__mailRFQ.toString(), //RFQID,
                                "CurrentTileID":thisTileSharkfin.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType:"English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileSharkfin = document.getElementById("td" +TileId);
                                mapleOrderLoaderStop(thisTileSharkfin);
                                booktradePopup(thisTileSharkfin, "booktradeSharkfin" + TileId, data.message, "DivOverlaySharkfin");
                                
                            }).catch(error=>{
                                console.log(error);
                            
                            })
                        }else{
                            mapleOrderLoaderStop(thisTileSharkfin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('','Invalid RFQ ID ');
                        }
                            
             
                    },
                    "Mail All Quotes": function() {
                        //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023


                        var Email_PPList = [];
                        var RFQIDList = [];
                        var __mailRFQ = [];


                        if ($(document).find('.ui-dialog').find('[id^="emailDialog_Sharkfin"]').find('.chkBox_Email_PPCode').length > 0) {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_Sharkfin"]').find('.chkBox_Email_PPCode').each(function (chkIndex, checkboxControl) {
                             //   if (checkboxControl.checked) {
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val()).filter(function (RFQ_OBJECT) {
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

                        if ($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val() != undefined && $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val().trim() != '')
                            var RFQID = JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

                        if (RFQID != undefined && RFQID != '') {
                            //     MailBestQuote(thisTileSharkfin.id.match(/\d+$/)[0], JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val())[0].EP_ER_QuoteRequestId);
                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileSharkfin, "booktradeSharkfin" + thisTileSharkfin.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlaySharkfin");
                                mapleOrderLoaderStop(thisTileSharkfin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            } 
                            $( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileSharkfin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({
                                "userName": sessionStorage.getItem("FinIQUserID").toString(),
                                "rfqId": __mailRFQ.toString(), //RFQID,
                                "CurrentTileID": thisTileSharkfin.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType: "English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileSharkfin = document.getElementById("td" + TileId);
                                mapleOrderLoaderStop(thisTileSharkfin);
                                booktradePopup(thisTileSharkfin, "booktradeSharkfin" + TileId, data.message, "DivOverlaySharkfin");

                            }).catch(error => {
                                console.log(error);

                            })
                        }
                        else{
                            mapleOrderLoaderStop(thisTileSharkfin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('', 'Invalid RFQ ID ');
                        }
                    
                        return true;

                        //email all quotes here 

                    }
                }
            });
            $(dialogBoxSharkfin).dialog('open');

        }else
        {
            $(document).find('.ui-dialog').find('[id^="emailDialog_Sharkfin"]').empty().append(strEmail);

            $(dialogBoxSharkfin).dialog('open');

            var Email_PPList =[];
            var RFQIDList=[];
            var __mailRFQ=[];
            
            if($(document).find('.ui-dialog').find('[id^="emailDialog_Sharkfin"]').find('.chkBox_Email_PPCode').length>0)
            {
                $(document).find('.ui-dialog').find('[id^="emailDialog_Sharkfin"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                    if(checkboxControl.checked){
                    Email_PPList.push($(checkboxControl).parent().text().trim())

                    RFQIDList.push(JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val()).filter(function(RFQ_OBJECT){
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


            if ($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val() != undefined && $(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val().trim()!='')
            var RFQID = JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

            if (RFQID != undefined && RFQID != ''){
                //     MailBestQuote(thisTileSharkfin.id.match(/\d+$/)[0], JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val())[0].EP_ER_QuoteRequestId);
                if(__mailRFQ == ""){
                    // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    //booktradePopup(thisTileSharkfin, "booktradeSharkfin" + thisTileSharkfin.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlaySharkfin");
                    mapleOrderLoaderStop(thisTileSharkfin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    openValidationpopup('','No price selected for mailing !');
                    //End
                    return false;
                }     
                mapleOrderLoaderStart(thisTileSharkfin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                    "rfqId":__mailRFQ.toString(),//RFQID,
                    "CurrentTileID":thisTileSharkfin.id.match(/\d+$/)[0],
                    "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                    QuoteMailType:"English"
                }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                    console.log(data);
                    TileId = data.CurrentTileID;
                    thisTileSharkfin = document.getElementById("td" +TileId)
                    mapleOrderLoaderStop(thisTileSharkfin);
                    booktradePopup(thisTileSharkfin, "booktradeSharkfin" + TileId, data.message, "DivOverlaySharkfin");
                      
                }).catch(error=>{
                    console.log(error);
                   
                })
            }
            else{
                mapleOrderLoaderStop(thisTileSharkfin);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                openValidationpopup('','Invalid RFQ ID ');
                
            }

        }
        $(thisTileSharkfin).find('[id^="SharkfinBanksRow"]').children().each(function() {
           if($(thisTileSharkfin).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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


function validateOrderSharkfin(thisTileSharkfin,_flag){    // LGTGTWINT-1279 : Instant Pricing : Order booking valdations.

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
            $(thisTileSharkfin).find('[id^="SharkfinBanksRow"]').children().each(function() {
                if($(thisTileSharkfin).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
        if ($(thisTileSharkfin).find('[id^="ddlSolveForSharkfin"]').val().split("(")[0].trim().toUpperCase() == "STRIKE") {
            
            if($(thisTileSharkfin).find('[id^="koinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val())[selectedBankIndex].DRAOUT) > parseFloat($(thisTileSharkfin).find('[id^="koinputbox"]').val())){
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTileSharkfin).find('[id^="koinputbox"]').attr("id"), "KO % of Initial should be greater than strike(%)", thisTileSharkfin);
                return false;
            }
        
                else if($(thisTileSharkfin).find('[id^="kiinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val())[selectedBankIndex].DRAOUT) < parseFloat($(thisTileSharkfin).find('[id^="kiinputbox"]').val())){
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTileSharkfin).find('[id^="kiinputbox"]').attr("id"), "KI % of Initial should be less than strike(%)", thisTileSharkfin);
                return false;
            }
        }
    
        if ($(thisTileSharkfin).find('[id^="hdnfinalTokenSharkfin"]').val() == "" || $(thisTileSharkfin).find('[id^="SharkfinPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileSharkfin).find('[id^="SharkfinPrices"]')[0].firstChild.innerHTML == "") {
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').attr("id"), "Order Execution Failed!", thisTileSharkfin);
                return false;
        }
        
        if(parseFloat(JSON.parse($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').val())[selectedBankIndex].DRAOUT) <= 0){
                if(_flag == false){

                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTileSharkfin).find('[id^="hdnChartPricesSharkfin"]').attr("id"), "Prices can not be negative 0r zero, Order Execution Failed!", thisTileSharkfin);
                return false;
        }

    }catch(er){
        console.log(er.message);
    }

}

//  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.

function ChangeSolveForSharkfin(solveFor, thisTileSharkfin,calledFromIndexSharkfin) {
    try {
        if (calledFromIndexSharkfin != undefined){
                if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                    $(thisTileSharkfin).find('[id^="strikeipbox"]').prop('disabled', true);
                    $(thisTileSharkfin).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTileSharkfin).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').prop('disabled', false);
                    // checkupfrontPriceSharkfin(thisTileSharkfin); //LGTGTWINT-1095
                    checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val().trim(), thisTileSharkfin) //  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                    $(thisTileSharkfin).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTileSharkfin).find('[id^="IBPriceipbox"]').prop('disabled', true); ////LGTGTWINT-1095
                    $(thisTileSharkfin).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').prop('disabled', true); ////LGTGTWINT-1095
                    // checkupfrontPriceSharkfin(thisTileSharkfin);  //LGTGTWINT-1095
                    checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val().trim(), thisTileSharkfin) //  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                    $(thisTileSharkfin).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTileSharkfin).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTileSharkfin).find('[id^="couponipbox"]').prop('disabled', true);
                    $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').prop('disabled', false); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for Sharkfin and DRA
                    // checkupfrontPriceSharkfin(thisTileSharkfin);  //LGTGTWINT-1095
                    checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val().trim(), thisTileSharkfin)//  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                }
        }
        else {
            if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                $(thisTileSharkfin).find('[id^="strikeipbox"]').prop('disabled', true);
                $(thisTileSharkfin).find('[id^="IBPriceipbox"]').prop('disabled', false); //LGTGTWINT-1095
                $(thisTileSharkfin).find('[id^="couponipbox"]').prop('disabled', false);
                $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').prop('disabled', false); //LGTGTWINT-1095
                // checkupfrontPriceSharkfin(thisTileSharkfin);  //LGTGTWINT-1095
                checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val().trim(), thisTileSharkfin,true)//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                $(thisTileSharkfin).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileSharkfin).find('[id^="IBPriceipbox"]').prop('disabled', true);
                $(thisTileSharkfin).find('[id^="couponipbox"]').prop('disabled', false);
                $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').prop('disabled', true); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for Sharkfin and DRA
                // checkupfrontPriceSharkfin(thisTileSharkfin);  //LGTGTWINT-1095
                checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val().trim(), thisTileSharkfin,true)//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                $(thisTileSharkfin).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileSharkfin).find('[id^="IBPriceipbox"]').prop('disabled', false); //LGTGTWINT-1095
                $(thisTileSharkfin).find('[id^="couponipbox"]').prop('disabled', true);
                $(thisTileSharkfin).find('[id^="txtupfrontSharkfin"]').prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeSharkfin($(thisTileSharkfin).find('[id^="ddlKOKIType"]').val().trim(), thisTileSharkfin,true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
                // checkupfrontPriceSharkfin(thisTileSharkfin);  //LGTGTWINT-1095

            }

    }
    } catch (error) {
    }
}