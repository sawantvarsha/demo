$.support.cors = true;
var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var ContractAmtFCN;
var CouponFreq;
var tempShareName;
var arrFCN = [];
var maxFCN;
var finalResponseDataFCN;
var finalTokenFCN;
var repriceObjectFCN;
var TimerFCN = 0;
var finalObjFCN;
var getddlList;
var idFCN = 6;
var dateObj = ""
var globalDefaultSharesArrayFCN = ["NFLX.OQ", "MSFT.OQ", "AMZN.OQ"];  //LGTGTWINT-1723 Instant Pricer : Remove FB.OQ ticker from default notes payoff's.

// To load the FCN tile 
function onLoadFCN(currId,isProductCopiedFCN) {
    try {
      
        setDeafaultValuesFCN(currId,isProductCopiedFCN);
        thisTileFCN = document.getElementById("td" + currId);
        $(thisTileFCN).find('[id^="OverlayDiv"]').hide();

        sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        $(thisTileFCN).find('[id^="btnBestPriceFCN"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        // clearInterval($(thisTileFCN).find('[id^="hdnintervalID"]').val());  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileFCN,'[id^="btnBestPriceFCN"]', false);
        clearPricerTable(thisTileFCN);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileFCN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
        $(thisTileFCN).find('[id^="RFQIDEQC"]').html("");
        //end

        $(thisTileFCN).find("div.card input[type='text'],div.card input[type='search'],div.card select").on('change', function () {

            thisTileFCN = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileFCN).find('[id^="btnBestPriceFCN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileFCN).find('[id^="hdnintervalID"]').val());
           $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileFCN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileFCN).find('[id^="RFQIDEQC"]').html("");
            //End

            clearPricerTable(thisTileFCN);
            mapleLoaderStop(thisTileFCN,'[id^="btnBestPriceFCN"]', false);  // Added Loader function ||
            $(thisTileFCN).find('[id^="btnEmailQuote"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileFCN).find('[id^="BookTradeFCN"]').attr("disabled", true); // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileFCN).find('[id^="OrderEmail"]').attr("disabled",true);//LGTGTWINT-1981 || RizwanS || 12 May 2023   
        })
 
         $(thisTileFCN).find(" div.card .amtPopup").on('select', function () {  // INT1FIN47-768 Gateway Markets Instant Pricing issue
 
             thisTileFCN = $(this).parents('.sorting')[0];
             sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
             $(thisTileFCN).find('[id^="btnBestPriceFCN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
             clearInterval($(thisTileFCN).find('[id^="hdnintervalID"]').val());
            $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
             clearPricerTable(thisTileFCN);

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileFCN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileFCN).find('[id^="RFQIDEQC"]').html("");
            //End

             mapleLoaderStop(thisTileFCN,'[id^="btnBestPriceFCN"]', false);
             $(thisTileFCN).find('[id^="btnEmailQuote"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
             $(thisTileFCN).find('[id^="BookTradeFCN"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
             $(thisTileFCN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023 
             
          })


        $(thisTileFCN).find('[id^="ddlKOKIType"]').on("change", function() {
            try {
             
            thisTileFCN = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileFCN,"btnBestPriceFCN");    
           $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val("");
           //End
            validation_clear(); //To Remove highlighted part if no error 
            checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val().trim(), thisTileFCN);

            } catch (error) {
                console.log(error.message);
            }
        });
        //aded by rutika on 26/04/2022 for calculating tenor when changed in input box
         //Start

        $(thisTileFCN).find('[id^="tenor_FCN"]').on("change", function() {
            try {
        
            thisTileFCN = $(this).parents(".sorting")[0];
            let currId=   thisTileFCN.id.match(/\d+$/)[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileFCN,"btnBestPriceFCN");    
            $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val("");
            //End
            if( $(thisTileFCN).find('[id^="tenorddl"]').val() == "M"){

                if(Number($(this).parents(".sorting").find('[id^="tenor_FCN"]').val()) > Number(FCNAllowedTenorinMonths) || $(this).parents(".sorting").find('[id^="tenor_FCN"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_FCN"]').val() == ""){
                    ValidateField($(thisTileFCN).find('[id^="tenor_FCN"]').attr("id"), "Please enter valid tenor.", thisTileFCN);
                    return false;
                }
            } else{
                 if(Number($(this).parents(".sorting").find('[id^="tenor_FCN"]').val()) > Number(FCNAllowedTenorinYears) || $(this).parents(".sorting").find('[id^="tenor_FCN"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_FCN"]').val() == ""){
                    ValidateField($(thisTileFCN).find('[id^="tenor_FCN"]').attr("id"), "Please enter valid tenor.", thisTileFCN);
                    return false;
                }
            }
            // calculateTenor(currId); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023            

            }   catch (error) {
                console.log(error.message);
            }
        });


        $(thisTileFCN).find('[id^="tenorddl"]').on("change", function () {
            try {
                
                thisTileFCN = $(this).parents(".sorting")[0];
                let currId=   thisTileFCN.id.match(/\d+$/)[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileFCN,"btnBestPriceFCN");    
                $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val("");
                //End
                if( $(thisTileFCN).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_FCN"]').val()) > Number(FCNAllowedTenorinMonths)){
                        ValidateField($(thisTileFCN).find('[id^="tenor_FCN"]').attr("id"), "Please enter valid tenor.", thisTileFCN);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_FCN"]').val()) > Number(FCNAllowedTenorinYears)){
                        ValidateField($(thisTileFCN).find('[id^="tenor_FCN"]').attr("id"), "Please enter valid tenor.", thisTileFCN);
                        return false;
                    }
                }
    
            // calculateTenor(currId); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023                
               
            } catch (error) {
                console.log(error);
            }
        });

        //End
        
        checkSolveForFCN($(thisTileFCN).find('[id^="ddlSolveForFCN"]').val(), thisTileFCN)

        $(thisTileFCN).find('[id^="ddlSolveForFCN"]').on('change', function (event) {
            thisTileFCN = $(this).parents('.sorting')[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileFCN,"btnBestPriceFCN");    
           $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val("");
           //End
           ChangeSolveForFCN($(this).val(), thisTileFCN); //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.

        });

        shareCount = 0;
        $(thisTileFCN).find('[id^="shareDivFCN"]').click(function () {
            $(this).find('input[type="search"]').focus();
        });

        // Check for upfront/IB Price 

           $(thisTileFCN).find('[id^="txtupfrontFCN"]').on("change", function() {
            try {
             
            thisTileFCN = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileFCN,"btnBestPriceFCN");    
           $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val("");
           //End

            if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

                let _ibprice =   parseFloat(100 -  Number($(thisTileFCN).find('[id^="txtupfrontFCN"]').val())).toFixed(2);;

                $(thisTileFCN).find('[id^="IBPriceipbox"]').val(_ibprice);

            }

            } catch (error) {
                console.log(error.message);
            }
        });

        $(thisTileFCN).find('[id^="IBPriceipbox"]').on("change", function() {
            try {
             
            thisTileFCN = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileFCN,"btnBestPriceFCN");    
           $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val("");
           //End

            if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

                let _upfront =  parseFloat(100 -  Number($(thisTileFCN).find('[id^="IBPriceipbox"]').val())).toFixed(2);

                $(thisTileFCN).find('[id^="txtupfrontFCN"]').val(_upfront);

            }

            } catch (error) {
                console.log(error.message);
            }
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        //Start
        $(thisTileFCN).find('.ddlShares').on("focusout", function (){   
        
            //Added for LGTGTWINT-1292 | Chaitanya M | 28 Feb 2023
            _ccylistFCN = getExchangeAndCcyFromBasket($(thisTileFCN).find('[id^="shareDivFCN"]')[0], 'share')
            listnames = _ccylistFCN;
            if(_ccylistFCN.length >=4){
                return false;
            } 
            validatesharebasket(thisTileFCN,"shareNameFCN");  
            sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileFCN,"btnBestPriceFCN");    
            $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val("");// Added For  Mail all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            $(thisTileFCN).find('[id^="btnEmailQuote"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileFCN).find('[id^="BookTradeFCN"]').attr("disabled", true);// added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023     
            $(thisTileFCN).find('[id^="OrderEmail"]').attr("disabled",true);//LGTGTWINT-1981 || RizwanS || 12 May 2023  
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        $(thisTileFCN).find("div.card .ddlShares").on("keydown", function(){
        
            $("#bodyDiv").hide();
            sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileFCN,"btnBestPriceFCN");    
            $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val("");// Added For  Mail all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileFCN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileFCN).find('[id^="BookTradeFCN"]').attr("disabled", true);           
            $(thisTileFCN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023 
        });
     
        //End
        //Added for LGTGTWINT-1077 Instant Pricing: Input length for all fields for all payoffs | Chaitanya M | 28-01-2023
        $(thisTileFCN).find('[id^="tenor_FCN"]').on("keyup", function (){            

             InputLengthCheckEQC(thisTileFCN, "tenor_FCN",3); 
        });

        $(thisTileFCN).find("[id^='strikeipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileFCN, "strikeipbox",8); //Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            $(thisTileFCN).find('[id^="EQCRfqidpnl"]').hide();
            $(thisTileFCN).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileFCN).find("[id^='txtupfrontFCN']").on("keyup", function(){
             InputLengthCheckEQC(thisTileFCN, "txtupfrontFCN",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
    
        });

        $(thisTileFCN).find("[id^='kiinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileFCN, "kiinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileFCN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileFCN).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileFCN).find("[id^='koinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileFCN, "koinputbox",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileFCN).find('[id^="EQCRfqidpnl"]').hide();//LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileFCN).find('[id^="RFQIDEQC"]').html("");
            //End

        });
        
        $(thisTileFCN).find("[id^='couponipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileFCN, "couponipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileFCN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileFCN).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileFCN).find("[id^='IBPriceipbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileFCN, "IBPriceipbox",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
        
        });

        $(thisTileFCN).find("[id^='noncallinputbox']").on("keyup", function(){
             InputLengthCheckEQC(thisTileFCN, "noncallinputbox",3);
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileFCN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileFCN).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        //Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
        $(thisTileFCN).find('[id^="ContractAmtFCN"]').on("change", function(){
            thisTileFCN = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileFCN,"btnBestPriceFCN");    
           $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val("");
           //End
          if($(thisTileFCN).find('[id^="ContractAmtFCN"]').val() == ""){
            $(thisTileFCN).find('[id^="ContractAmtFCN"]').val("0");
            return false; 
          }    
                  
        });        
       
        //End

    } catch (error) {
        console.log(error.message)
    }
}

// To set default values for FCN
function setDeafaultValuesFCN(currId,isProductCopiedFCN) {
    try {
        // Added logic for getting current tile : Onkar E.//
        thisTileFCN = document.getElementById("td" + currId);


        //Configured UI fileds Start :: || 08 Feb 2023

        if(DRAFCNUpfrontYN.toUpperCase() == "YES" || DRAFCNUpfrontYN.toUpperCase().includes("Y")){

            $(thisTileFCN).find('[id^="txtupfrontFCN"]').val("0.00"); // defualt value
            $(thisTileFCN).find('[id^="txtupfrontFCN"]').hide(); //UI filed
            $(thisTileFCN).find('[id^="upfrontuilbl"]').hide(); //UI label
            $(thisTileFCN).find('[id^="txtupfrontlbl"]').hide(); // hide label order popup
            $(thisTileFCN).find('[id^="txtupfrontVal"]').hide(); //Order popup filed
            
        }else{
            $(thisTileFCN).find('[id^="txtupfrontFCN"]').val("0.00");
        }

        // END

        $(thisTileFCN).find('[id^="ContractAmtFCN"]').val("1,000,000.00");
        $(thisTileFCN).find("[id^='ContractAmtFCN']").attr('maxlength','14');
        $(thisTileFCN).find('[id^="strikeipbox"]').val("92.00");
        $(thisTileFCN).find('[id^="couponipbox"]').val("8.00");
        $(thisTileFCN).find('[id^="noncallinputbox"]').val("1");
        $(thisTileFCN).find('[id^="tenor_FCN"]').val("6");
        $(thisTileFCN).find('[id^="IBPriceipbox"]').val("98.50"); //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 ||  Changed for SCB EAM Demo | Chaitanya | 27 Sep 2023
        $(thisTileFCN).find('[id^="kiinputbox"]').val("65.00");//Chaitanya M 4-April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        $(thisTileFCN).find('[id^="koinputbox"]').val("105.00");//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        callDropDownFunction($(thisTileFCN).find('[id^="shareName"]'), "FCN", currId);
        EQProductsFillCcy(thisTileFCN, "ddlFCNCcy");
        clearPricerTable(thisTileFCN);
        $(thisTileFCN).find('[id^="shareNameCntrlFCN"]').html("");
        $(thisTileFCN).find('[id^="hiddenshareinputFCN"]').html("");
        $(thisTileFCN).find('[id^="CCY_FCN"]').html("");

        if(!isProductCopiedFCN){
        for (let s=0;s<clientConfigdata.EQCFCN.MinSharesInBaskets;s++){
            createElementInBasket(thisTileFCN, 'shareDivFCN', sessionStorage.getItem(thisTileFCN.id)!=undefined?sessionStorage.getItem(thisTileFCN.id).split(" ")[s]:globalDefaultSharesArrayFCN[s]); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
       
        }
    }
       
        $(thisTileFCN).find('[id^="shareName"]')[0].placeholder = "";
        $(thisTileFCN).find('[id^="CCY_FCN"]').html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);


        

    } catch (error) {
        console.log(error.message)
    }
}

function checkSolveForFCN(solveFor, thisTileFCN,calledFromIndexFCN) {
    try {
        if (calledFromIndexFCN != undefined){
                if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                    $(thisTileFCN).find('[id^="strikeipbox"]').prop('disabled', true);
                    $(thisTileFCN).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTileFCN).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTileFCN).find('[id^="txtupfrontFCN"]').prop('disabled', false);
                    // checkupfrontPriceFCN(thisTileFCN); //LGTGTWINT-1095
                    checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val(), thisTileFCN, calledFromIndexFCN)
                } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                    $(thisTileFCN).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTileFCN).find('[id^="IBPriceipbox"]').prop('disabled', true); ////LGTGTWINT-1095
                    $(thisTileFCN).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTileFCN).find('[id^="txtupfrontFCN"]').prop('disabled', true); ////LGTGTWINT-1095
                    // checkupfrontPriceFCN(thisTileFCN);  //LGTGTWINT-1095
                    checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val(), thisTileFCN, calledFromIndexFCN)
                } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                    $(thisTileFCN).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTileFCN).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTileFCN).find('[id^="couponipbox"]').prop('disabled', true);
                    $(thisTileFCN).find('[id^="txtupfrontFCN"]').prop('disabled', false); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for FCN and DRA
                    // checkupfrontPriceFCN(thisTileFCN);  //LGTGTWINT-1095
                    checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val(), thisTileFCN, calledFromIndexFCN)
                }
        }
        else {
            if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                $(thisTileFCN).find('[id^="strikeipbox"]').prop('disabled', true);
                $(thisTileFCN).find('[id^="IBPriceipbox"]').val("98.50").prop('disabled', false); //LGTGTWINT-1095 || Changed for SCB EAM Demo | Chaitanya | 27 Sep 2023
                $(thisTileFCN).find('[id^="couponipbox"]').val("8.00").prop('disabled', false);
                $(thisTileFCN).find('[id^="txtupfrontFCN"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                // checkupfrontPriceFCN(thisTileFCN);  //LGTGTWINT-1095
                checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val(), thisTileFCN)
            } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                $(thisTileFCN).find('[id^="strikeipbox"]').val("92.00").prop('disabled', false);
                $(thisTileFCN).find('[id^="IBPriceipbox"]').prop('disabled', true);
                $(thisTileFCN).find('[id^="couponipbox"]').val("8.00").prop('disabled', false);
                $(thisTileFCN).find('[id^="txtupfrontFCN"]').prop('disabled', true); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for FCN and DRA
                // checkupfrontPriceFCN(thisTileFCN);  //LGTGTWINT-1095
                checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val(), thisTileFCN)
            } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                $(thisTileFCN).find('[id^="strikeipbox"]').val("92.00").prop('disabled', false);
                $(thisTileFCN).find('[id^="IBPriceipbox"]').val("98.50").prop('disabled', false); //LGTGTWINT-1095 || Changed for SCB EAM Demo | Chaitanya | 27 Sep 2023
                $(thisTileFCN).find('[id^="couponipbox"]').prop('disabled', true);
                $(thisTileFCN).find('[id^="txtupfrontFCN"]').val("0.00").prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val(), thisTileFCN);
                // checkupfrontPriceFCN(thisTileFCN);  //LGTGTWINT-1095

            }

    }
    } catch (error) {
    }
}
function checkKOKITypeFCN(KOKIType, thisTileFCN, calledFromIndex) {
    try {
        if(calledFromIndex != true){
        if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
            $(thisTileFCN).find('[id^="koinputbox"]').prop('disabled', false); //Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileFCN).find('[id^="kiinputbox"]').prop("disabled", true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileFCN).find('[id^="noncallinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        }  else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
            $(thisTileFCN).find('[id^="koinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileFCN).find('[id^="kiinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileFCN).find('[id^="noncallinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
            $(thisTileFCN).find('[id^="koinputbox"]').prop("disabled", true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileFCN).find('[id^="kiinputbox"]').prop('disabled', false);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileFCN).find('[id^="noncallinputbox"]').prop('disabled', true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        } else if (KOKIType == "NOKINOKO") {
            $(thisTileFCN).find('[id^="koinputbox"]').prop("disabled", true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileFCN).find('[id^="kiinputbox"]').prop('disabled', true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            $(thisTileFCN).find('[id^="noncallinputbox"]').prop('disabled', true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
        }
        }else{
            if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
                $(thisTileFCN).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTileFCN).find('[id^="kiinputbox"]').prop("disabled", true);
                $(thisTileFCN).find('[id^="noncallinputbox"]').prop('disabled', false);
            } else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
                $(thisTileFCN).find('[id^="koinputbox"]').prop('disabled', false);
                $(thisTileFCN).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileFCN).find('[id^="noncallinputbox"]').prop('disabled', false);
            } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
                $(thisTileFCN).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTileFCN).find('[id^="kiinputbox"]').prop('disabled', false);
                $(thisTileFCN).find('[id^="noncallinputbox"]').prop('disabled', true);
            } else if (KOKIType == "NOKINOKO") {
                $(thisTileFCN).find('[id^="koinputbox"]').prop("disabled", true);
                $(thisTileFCN).find('[id^="kiinputbox"]').prop('disabled', true);
                $(thisTileFCN).find('[id^="noncallinputbox"]').prop('disabled', true);
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

function checkupfrontPriceFCN(thisTileFCN){

    try{

        let _ibprice =   parseFloat(100 -  Number($(thisTileFCN).find('[id^="txtupfrontFCN"]').val())).toFixed(2);;

        $(thisTileFCN).find('[id^="IBPriceipbox"]').val(_ibprice);
    
        let _upfront =  parseFloat(100 -  Number($(thisTileFCN).find('[id^="IBPriceipbox"]').val())).toFixed(2);
    
        $(thisTileFCN).find('[id^="txtupfrontFCN"]').val(_upfront);

    }catch(er){
        
        console.log(er.message);

    }
    

}

var globalSolveForValueFCN='';
// To get best price for FCN
function getBestPriceFCN(that) {
    try {
       

        thisTileFCN = $(that).parents(".sorting")[0];
        
        console.log('Start Interval value =' + $(thisTileFCN).find('[id^="hdnintervalID"]').val());

        $(thisTileFCN).find('[id^="btnBestPriceFCN"]').attr("disabled", true); // INT1FIN47-768 Gateway Markets Instant Pricing issue

        var requestIDFCN = "";

        requestIDFCN = requestIDFCN + RequestIDGenerator(60);

        $(thisTileFCN).find('[id^="hdnRequestID"]').val(requestIDFCN);  //INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileFCN,'[id^="btnBestPriceFCN"]', false);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        $(thisTileFCN).find('[id^="EQCRfqidpnl"]').hide();
        $(thisTileFCN).find('[id^="RFQIDEQC"]').html("");
        //End

        globalSolveForValueFCN = $(thisTileFCN).find('[id^="ddlSolveForFCN"]').val().trim();

        clearInterval($(thisTileFCN).find('[id^="hdnintervalID"]').val());

        console.log('After clear Interval value =' + $(thisTileFCN).find('[id^="hdnintervalID"]').val());

        $(thisTileFCN).find('[id^="hdnintervalID"]').val("");


        TileId = that.id.match(/\d+$/)[0];

        sessionStorage.setItem("poolingTimer_" + TileId, 0);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        thisTileFCN = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        console.log(TileId, thisTileFCN, productName);
        getddlList = $.trim($(thisTileFCN).find('[id^="ddlKOKIType"]').val());

        $(thisTileFCN).find('[id^="TBLFCN"]' + " td").each(function () {
            //Clear prices || Tina K || 11-Sep-2019
            $(this).html("-");
        })
        validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
        clearPricerTable(thisTileFCN); //To clear prices after clicking best price || Tina K || 20-Nov-2019
        //Validation conditions added : Tina Kshirsagar : 6-09-2019

        
        let tenorNumb = $(thisTileFCN).find("[id^='tenor_FCN']").val();
        let tenorstring = $(thisTileFCN).find("[id^='tenorddl']").val();
        let _tenor = tenorNumb + tenorstring;

        let _tenorinMonths = "";

        if(tenorstring != "M"){

            _tenorinMonths =  parseFloat($(thisTileFCN).find('[id^="tenor_FCN"]').val()) * 12;

        }else{

            _tenorinMonths =  parseFloat($(thisTileFCN).find('[id^="tenor_FCN"]').val());
        }
        
        if ($(thisTileFCN).find('[id^="shareDivFCN"]')[0].childNodes.length <= 1) {     
            ValidateField($(thisTileFCN).find('[id^="shareDivFCN"]').attr('id'), "Please Enter Valid Shares", thisTileFCN);
            return false  
        } else if ($.trim($(thisTileFCN).find('[id^="ContractAmtFCN"]').val()) == '' || parseFloat($(thisTileFCN).find('[id^="ContractAmtFCN"]').val()) < 0) {
            ValidateField($(thisTileFCN).find('[id^="ContractAmtFCN"]').attr('id'), "Please Enter Valid Notional", thisTileFCN); // LGTGTWINT-1487 | Chaitanya M | 24 Feb 2023
            return false
        } else if ($.trim($(thisTileFCN).find('[id^="tenor_FCN"]').val()) == '' || parseFloat($(thisTileFCN).find('[id^="tenor_FCN"]').val()) <=0) {
            ValidateField($(thisTileFCN).find('[id^="tenor_FCN"]').attr('id'), "Please enter valid tenor", thisTileFCN);
            return false
        }else if ($.trim($(thisTileFCN).find('[id^="ddlFCNCcy"]').val()) == '') {
            ValidateField($(thisTileFCN).find('[id^="ddlFCNCcy"]').attr('id'), "Please Select Valid Ccy", thisTileFCN);
            return false
        } else if ((parseFloat($(thisTileFCN).find('[id^="koinputbox"]').val()) == "" || parseFloat($(thisTileFCN).find('[id^="koinputbox"]').val()) <= Number(DRAFCNMinKO) || parseFloat($(thisTileFCN).find('[id^="koinputbox"]').val()) > Number(DRAFCNMaxKO)) && $(thisTileFCN).find('[id^="koinputbox"]').prop("disabled") != true) {
            ValidateField($(thisTileFCN).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO (%) Initial.", thisTileFCN);
            return false;
        } else if ((parseFloat($(thisTileFCN).find('[id^="kiinputbox"]').val()) == "" || parseFloat($(thisTileFCN).find('[id^="kiinputbox"]').val()) <= 0) && $(thisTileFCN).find('[id^="kiinputbox"]').prop("disabled") != true) {
            ValidateField($(thisTileFCN).find('[id^="kiinputbox"]').attr("id"), "Please Enter Valid KI (%)", thisTileFCN);
            return false;
        } else if (($(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "3M")) {
            ValidateField($(thisTileFCN).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTileFCN);
            return false;
        } else if (($(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "QUARTERLY" || $(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "1M")) {
            ValidateField($(thisTileFCN).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTileFCN);
            return false;
        } else if (($(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY" || $(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY" || $(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "9M")) {
            ValidateField($(thisTileFCN).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTileFCN);
            return false;
        }  else if (($(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY") && (_tenor == "6M")) {
            ValidateField($(thisTileFCN).find('[id^="ddlCouponFrequency"]').attr("id"), "Frequency is not Valid ", thisTileFCN);
            return false;
        } else if($(thisTileFCN).find('[id^="noncallinputbox"]').val() <= 0 || $(thisTileFCN).find('[id^="noncallinputbox"]').val() == "") {
            ValidateField($(thisTileFCN).find('[id^="noncallinputbox"]').attr("id"), "Non Call can not be zero negative. ", thisTileFCN);
            return false; 
        } else if($(thisTileFCN).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "MONTHLY")){
            if(parseFloat($(thisTileFCN).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths)){
                ValidateField($(thisTileFCN).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileFCN);
                return false;
            }
        } else if($(thisTileFCN).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "BIMONTHLY")){
            if(parseFloat($(thisTileFCN).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 2)){
                ValidateField($(thisTileFCN).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileFCN);
                return false;
            }
        } else if($(thisTileFCN).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "QUARTERLY")){
            if(parseFloat($(thisTileFCN).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 3)){
                ValidateField($(thisTileFCN).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileFCN);
                return false;
            }
        } else if($(thisTileFCN).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "SEMIANNUALLY")){
            if(parseFloat($(thisTileFCN).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 6)){
                ValidateField($(thisTileFCN).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileFCN);
                return false;
            }
        } else if($(thisTileFCN).find('[id^="koinputbox"]').prop("disabled") != true && ($(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase() == "ANNUALLY")){
            if(parseFloat($(thisTileFCN).find('[id^="noncallinputbox"]').val()) > (_tenorinMonths / 12)){
                ValidateField($(thisTileFCN).find('[id^="noncallinputbox"]').attr("id"), "Non call periods cannot be greater than tenor.", thisTileFCN);
                return false;
            }
        }

        // RizwanS || LGTGTWINT-2320 || 17 Aug 2023
        if (NotionalMinMaxCheck === "YES") {
            if(parseFloat($(thisTileFCN).find('[id^="ContractAmtFCN"]').val().replace(/,/g, "")) === 0){     
                ValidateField($(thisTileFCN).find('[id^="hdnQuoteID"]').attr('id'),"Please input non zero notional.",thisTileFCN);
                return false;
            }
        }
        //END

        
        if ($(thisTileFCN).find('[id^="ddlSolveForFCN"]').val().split("(")[0].trim().toUpperCase() == "STRIKE") {
            if (parseFloat($(thisTileFCN).find('[id^="IBPriceipbox"]').val()) == "" || parseFloat($(thisTileFCN).find('[id^="IBPriceipbox"]').val()) <= 0 || parseFloat($(thisTileFCN).find('[id^="IBPriceipbox"]').val()) > 100) {
                ValidateField($(thisTileFCN).find('[id^="IBPriceipbox"]').attr("id"), "Price % must be greater than 0 and less than 100", thisTileFCN);
                return false;
            } else if (parseFloat($(thisTileFCN).find('[id^="couponipbox"]').val()) == "" || parseFloat($(thisTileFCN).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileFCN).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileFCN).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon (%)", thisTileFCN);
                return false;
            }else if ($(thisTileFCN).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileFCN).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileFCN).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileFCN).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileFCN).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%)", thisTileFCN);
                return false;
            }
        } else if ($(thisTileFCN).find('[id^="ddlSolveForFCN"]').val().split("(")[0].trim().toUpperCase() == "COUPON") {
            if (parseFloat($(thisTileFCN).find('[id^="strikeipbox"]').val()) == "" || parseFloat($(thisTileFCN).find('[id^="strikeipbox"]').val()) <= 0 ) { // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                ValidateField($(thisTileFCN).find('[id^="strikeipbox"]').attr("id"), " Strike % must be greater than 0.", thisTileFCN);  // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                return false;
            } else if (parseFloat($(thisTileFCN).find('[id^="IBPriceipbox"]').val()) == "" || parseFloat($(thisTileFCN).find('[id^="IBPriceipbox"]').val()) <= 0 || parseFloat($(thisTileFCN).find('[id^="IBPriceipbox"]').val()) > 100) {
                ValidateField($(thisTileFCN).find('[id^="IBPriceipbox"]').attr("id"), "Price % must be greater than 0 and less than 100", thisTileFCN);
                return false;
            } else if ($(thisTileFCN).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileFCN).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileFCN).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileFCN).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%)", thisTileFCN);
                return false;
            }else if ($(thisTileFCN).find('[id^="koinputbox"]').prop("disabled") != true && (parseFloat($(thisTileFCN).find('[id^="strikeipbox"]').val()) > parseFloat($(thisTileFCN).find('[id^="koinputbox"]').val()))) {
                //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(DRAFCNEnableStrikeBelowKO.toUpperCase() === "YES"){
                    ValidateField($(thisTileFCN).find('[id^="strikeipbox"]').attr("id"),"Strike (%) should be less than KO (%)", thisTileFCN);
                    return false;
                }
                //END - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
            }else if ($(thisTileFCN).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileFCN).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileFCN).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileFCN).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileFCN).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%)", thisTileFCN);
                return false;               
            }else if(parseFloat($(thisTileFCN).find('[id^="strikeipbox"]').val()) > 100){ //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(DRAFCNStrikeBeyond100Pct.toUpperCase() === "NO"){
                    ValidateField($(thisTileFCN).find('[id^="strikeipbox"]').attr("id"), " Strike % must be less than or equal to 100.", thisTileFCN);
                    return false;
                }
            } //End - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
        } else if ($(thisTileFCN).find('[id^="ddlSolveForFCN"]').val().split("(")[0].trim().toUpperCase() == "IB PRICE") {
            if (parseFloat($(thisTileFCN).find('[id^="strikeipbox"]').val()) == "" || parseFloat($(thisTileFCN).find('[id^="strikeipbox"]').val()) <= 0 ) { //  LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                ValidateField($(thisTileFCN).find('[id^="strikeipbox"]').attr("id"), " Strike % must be greater than 0.", thisTileFCN);// LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                return false;
            } else if (parseFloat($(thisTileFCN).find('[id^="couponipbox"]').val()) == "" ||parseFloat($(thisTileFCN).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileFCN).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileFCN).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon (%)", thisTileFCN);
                return false;
            } else if ($(thisTileFCN).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileFCN).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileFCN).find('[id^="strikeipbox"]').val()))) {
                ValidateField($(thisTileFCN).find('[id^="kiinputbox"]').attr("id"),"KI (%) Should Be Less Than Strke (%)", thisTileFCN);
                return false;
            }else if ($(thisTileFCN).find('[id^="koinputbox"]').prop("disabled") != true && (parseFloat($(thisTileFCN).find('[id^="strikeipbox"]').val()) > parseFloat($(thisTileFCN).find('[id^="koinputbox"]').val()))) {
                // Start- LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(DRAFCNEnableStrikeBelowKO.toUpperCase() === "YES"){
                    ValidateField($(thisTileFCN).find('[id^="strikeipbox"]').attr("id"),"Strike (%) should be less than KO (%)", thisTileFCN);
                    return false;
                }
                //End - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
            }else if ($(thisTileFCN).find('[id^="koinputbox"]').prop("disabled") != true && $(thisTileFCN).find('[id^="kiinputbox"]').prop("disabled") != true && (parseFloat($(thisTileFCN).find('[id^="kiinputbox"]').val()) > parseFloat($(thisTileFCN).find('[id^="koinputbox"]').val()))) {
                ValidateField($(thisTileFCN).find('[id^="kiinputbox"]').attr("id"),"KI (%) should be less than KO (%)", thisTileFCN);
                return false;
            }else if(parseFloat($(thisTileFCN).find('[id^="strikeipbox"]').val()) > 100){ //Start - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
                if(DRAFCNStrikeBeyond100Pct.toUpperCase() === "NO"){
                    ValidateField($(thisTileFCN).find('[id^="strikeipbox"]').attr("id"), "Strike % must be less than or equal to 100.", thisTileFCN);
                    return false;
                }
            } //End - LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
            //Validation End
        }


         // Added by RizwanS for tenor validation before pricing || 03 Jan 2022 ||

         if( $(thisTileFCN).find('[id^="tenorddl"]').val() == "M"){

            if(Number($(thisTileFCN).find('[id^="tenor_FCN"]').val()) > Number(FCNAllowedTenorinMonths)){
                ValidateField($(thisTileFCN).find('[id^="tenor_FCN"]').attr("id"), "Please enter valid tenor.", thisTileFCN);
                return false;
            }

        } else{

             if(Number($(thisTileFCN).find('[id^="tenor_FCN"]').val()) > Number(FCNAllowedTenorinYears)){
                ValidateField($(thisTileFCN).find('[id^="tenor_FCN"]').attr("id"), "Please enter valid tenor.", thisTileFCN);
                return false;
            }
        }
        
        // END

        $("body").css("opacity", "0.9");

    
        if ($(thisTileFCN).find('[id^="ddlKOKIType"]').val() == "NOKIKODC") {
            KIPerc = "";
            KIType = "";
            KOPerc = $(thisTileFCN).find('[id^="koinputbox"]').val();
            KOType = "American";

        } else if ($(thisTileFCN).find('[id^="ddlKOKIType"]').val() == "NOKIKOPE") {
            KIPerc = "";
            KIType = "";
            KOPerc = $(thisTileFCN).find('[id^="koinputbox"]').val();
            KOType = "European";

        } else if ($(thisTileFCN).find('[id^="ddlKOKIType"]').val() == "KIDCKODC") {
            KIPerc = $(thisTileFCN).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileFCN).find('[id^="koinputbox"]').val();
            KIType = "American";
            KOType = "American";
        
        } else if ($(thisTileFCN).find('[id^="ddlKOKIType"]').val() == "KIDCKOPE") {
            KIPerc = $(thisTileFCN).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileFCN).find('[id^="koinputbox"]').val();
            KIType = "American";
            KOType = "European";

        } else if ($(thisTileFCN).find('[id^="ddlKOKIType"]').val() == "KIEURKODC") {
            KIPerc = $(thisTileFCN).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileFCN).find('[id^="koinputbox"]').val();
            KIType = "European";
            KOType = "American";

        } else if ($(thisTileFCN).find('[id^="ddlKOKIType"]').val() == "KIEURKOPE") {
            KIPerc = $(thisTileFCN).find('[id^="kiinputbox"]').val();
            KOPerc = $(thisTileFCN).find('[id^="koinputbox"]').val();
            KIType = "European";
            KOType = "European";
        } else if ($(thisTileFCN).find('[id^="ddlKOKIType"]').val() == "KIDCNOKO") {
            KIPerc = $(thisTileFCN).find('[id^="kiinputbox"]').val();
            KOPerc = ""
            KIType = "American";
            KOType = "";
        } else if ($(thisTileFCN).find('[id^="ddlKOKIType"]').val() == "KIEURNOKO") {
            KIPerc = $(thisTileFCN).find('[id^="kiinputbox"]').val();
            KOPerc = ""
            KIType = "European";
            KOType = "";
        } else if ($(thisTileFCN).find('[id^="ddlKOKIType"]').val() == "NOKINOKO") {
            KIPerc = "";
            KOPerc = ""
            KIType = "";
            KOType = "";
        }
        let solveForFCN = "";
        if ($(thisTileFCN).find('[id^="ddlSolveForFCN"]').val().split("(")[0].trim().toUpperCase() == "STRIKE") {
            solveForFCN = "CONVERSION_STRIKE";
        } else if ($(thisTileFCN).find('[id^="ddlSolveForFCN"]').val().split("(")[0].trim().toUpperCase() == "IB PRICE") {
            solveForFCN = "PRICE";
        } else if ($(thisTileFCN).find('[id^="ddlSolveForFCN"]').val().split("(")[0].trim().toUpperCase() == "COUPON") {
            solveForFCN = "COUPON";
        }


        let _upfront = "";

        if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

           _upfront =  $(thisTileFCN).find('[id^="txtupfrontFCN"]').val().trim() ?$(thisTileFCN).find('[id^="txtupfrontFCN"]').val().trim() :0 

        }else{

            _upfront =  "0.00"; 
        }
    

        let exchangeList = getExchangeAndCcyFromBasket($(thisTileFCN).find('[id^="shareDivFCN"]')[0], 'exchange');
        let ccyList = getExchangeAndCcyFromBasket($(thisTileFCN).find('[id^="shareDivFCN"]')[0], 'ccy');
        let shareList = getExchangeAndCcyFromBasket($(thisTileFCN).find('[id^="shareDivFCN"]')[0], 'share');

        let _QuantoFlagFCN = "";
        uniqueCCY = ccyList.filter((item, i, ar) => ar.indexOf(item) === i);
        if(uniqueCCY.length==1){
            if($(thisTileFCN).find('[id^="ddlFCNCcy"]').val()== uniqueCCY[0]){
                _QuantoFlagFCN = "No";
            } else{
                _QuantoFlagFCN = "Yes";
            }
        }else{
            _QuantoFlagFCN = "Yes";
        }

        //End


        // LGTGTWINT-1227 - Instant Pricing: EQC Ref missing for rfqs placed through instant pricing | 24 Feb 2023

           let _tenorFCN = ""

           if(tenorstring.toUpperCase().includes("M")){
           
            _tenorFCN= "MONTH";
           
           }else{
           
            _tenorFCN= "YEAR";
           }

        //    let getRefFCN = "";
           
           let getRefFCN = getEQCRefrenceNumber(productName,KOType,KIType,tenorNumb,_tenorFCN,$(thisTileFCN).find('[id^="couponipbox"]').val(),_QuantoFlagFCN,"Worst of");
           
           $(thisTileFCN).find('[id^="hdnRefnumber"]').val(getRefFCN); //LGTGTWINT-1589 Instant Pricing : EQC ref different on instant pricer and order details,quote mail and order mail


        // END        
        mapleLoaderStart(thisTileFCN,'[id^="btnBestPriceFCN"]', false);


        QuoteObject = {
          
            "BarrierPerc":  $(thisTileFCN).find('[id^="koinputbox"]').val(),
            "Ccy": $(thisTileFCN).find('[id^="ddlFCNCcy"]').val().trim(),
            "CouponFrq": $(thisTileFCN).find('[id^="ddlCouponFrequency"]').val().toUpperCase(), 
            "CouponPerc":  $(thisTileFCN).find('[id^="couponipbox"]').val(),
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
            "Notional":  $(thisTileFCN).find('[id^="ContractAmtFCN"]').val().replace(/,/g, "").split(".")[0],
            "PPDetails": "",
            "PricePerc":$(thisTileFCN).find('[id^="IBPriceipbox"]').val(), //
            "QuantoYN": _QuantoFlagFCN, // LGTGTWINT-1448| Chaitanya M | 20 Feb 2023
            "RMName": "",
            "Settlement_Days": Number($(thisTileFCN).find('[id^="SettlWeeks"]').val().trim()),
            "Tenor": _tenor,
            "Type": "FCN",
            "UnderlyingCode1": shareList[0],
            "UnderlyingCode2": shareList[1],
            "UnderlyingCode3": shareList[2],
            "UnderlyingCode4": shareList[3] ?? "" ,
            "Upfront":_upfront, // Added by Aniruddhaj 30Nov2022 LGTGTWINT-429
            "UserID":sessionStorage.getItem("EQC_UserName").toString(),
            "nonCall": $(thisTileFCN).find('[id^="noncallinputbox"]').val(),
            "strSolveFor":solveForFCN,
            "strikePerc": $(thisTileFCN).find('[id^="strikeipbox"]').val(),
            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
            "CurrentTileID": TileId,
            "requestID":$(thisTileFCN).find('[id^="hdnRequestID"]').val(), //INT1FIN47-768 Gateway Markets Instant Pricing issue
            "BuysideID": getRefFCN,
        }

        console.log('FCN price req ', QuoteObject);

        getQuoteFCN(QuoteObject, $(thisTileFCN).find('[id^="hdnintervalID"]')[0]);

        

    } catch (er) {
        console.log(er.message);

    }
}

// To get quote 
function getQuoteFCN(QuoteObject, uniqueIntervalID) {
    try {

        var dataFCN = request_getDataFromAPI(QuoteObject, clientConfigdata.CommonMethods.NodeServer + "getBestPriceFCN45").then(dataFCN => {

            thisTileFCN = document.getElementById("td" + dataFCN.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataFCN.CurrentTileID, true);
            mapleLoaderStart(thisTileFCN,'[id^="btnBestPriceFCN"]', false); 
            getUniqQuoteResponseFCN(thisTileFCN, dataFCN, uniqueIntervalID,QuoteObject.requestID); //INT1FIN47-768 Gateway Markets Instant Pricing issue 

        }).catch(error => { console.log(error); })

    } catch (err) {
        console.log(err.message);
    }
}

function getUniqQuoteResponseFCN(thisTileFCN, dataFCN, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var UIID = null;
        // Added by Atharva - EQC Timers - START
        isTimerStarted["td" + dataFCN.CurrentTileID] = false;
        myCounter["td" + dataFCN.CurrentTileID] = {};
        hasUserClickedEQC["td" + dataFCN.CurrentTileID] = false;
        $(thisTileFCN).find('[id^="hdnSelectedBank"]').val("");
       
        // END

        uniqueIntervalID.value = setInterval(function () {

            if(reqestID != $(thisTileFCN).find('[id^="hdnRequestID"]').val() || $(thisTileFCN).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                if($(thisTileFCN).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                mapleLoaderStop(thisTileFCN,'[id^="btnBestPriceFCN"]', false);
                }
                return false
            } // INT1FIN47-768 Gateway Markets Instant Pricing issue
            sessionStorage.setItem("quoteToken_" + thisTileFCN.id.match(/\d+$/)[0], "");
            sessionStorage.setItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0], "");

            sessionStorage.setItem("quoteToken_" + thisTileFCN.id.match(/\d+$/)[0], dataFCN['token']);
            sessionStorage.setItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0], dataFCN['responseData']);


            getFinalQuoteResponseFCN(sessionStorage.getItem("quoteToken_" + thisTileFCN.id.match(/\d+$/)[0]), sessionStorage.getItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]), thisTileFCN, uniqueIntervalID, reqestID);

        }, clientConfigdata.EQCFCN.PollInterval);


        console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
    } catch (error) {
        console.log(error)
    }
}

// To get price 
function getFinalQuoteResponseFCN(finalTokenFCN1, finalResponseDataFCN1, thisTileFCN, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var currentDateAndTime = new Date();

        sessionStorage.setItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0], finalResponseDataFCN1);

        sessionStorage.setItem("quoteToken_" + thisTileFCN.id.match(/\d+$/)[0], finalTokenFCN1);

        console.log("FCN RFQ's :: " + finalResponseDataFCN1 + " " + currentDateAndTime);
        
        Timer = Timer + 1;


        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileFCN.id.match(/\d+$/)[0])) >= Number(DRAFCNrequestCount.toString().split(".")[0]) || sessionStorage.getItem("pricingToggle" + thisTileFCN.id.match(/\d+$/)[0]) == "false") { //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
            
            $(thisTileFCN).find('[id^="btnBestPriceFCN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval(uniqueIntervalID.value);
            mapleLoaderStop(thisTileFCN,'[id^="btnBestPriceFCN"]', false);
            
            uniqueIntervalID.value = "";
            QuoteObject = "";
            $(thisTileFCN).find('[id^="OverlayDiv"]').hide();
     
            $("body").css("opacity", "");
            arrFCN = [];
            maxFCN = "";
            TimerFCN = 0;

            //Call Draw Graph
            // $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val(JSON.stringify(finalObjFCN));
            // if (finalObjFCN != null || finalObjFCN != undefined) {
            //     drawgraphFCN($(thisTileFCN).find('[id^="canvas"]').attr('id'));
            // }
            // INT1FIN47-768 Gateway Markets Instant Pricing issue

            return false;

        } else {
            var repriceObjectFCN = request_getDataFromAPI({
                "PPDetails": sessionStorage.getItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]),
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": thisTileFCN.id.match(/\d+$/)[0],
                "UserID":sessionStorage.getItem("EQC_UserName").toString(),
            }, clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseFCN45").then(repriceObjectFCN => {

                thisTileFCN = document.getElementById("td" + repriceObjectFCN.CurrentTileID);
                // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileFCN).find('[id^="btnEmailQuote"]').attr("disabled", false);
                $(thisTileFCN).find('[id^="BookTradeFCN"]').attr("disabled", false);
                $(thisTileFCN).find('[id^="OrderEmail"]').attr("disabled",false); //LGTGTWINT-1981 || RizwanS || 12 May 2023 
                if(reqestID != $(thisTileFCN).find('[id^="hdnRequestID"]').val() || $(thisTileFCN).find('[id^="hdnRequestID"]').val() === ""){ //RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    if($(thisTileFCN).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                        mapleLoaderStop(thisTileFCN,'[id^="btnBestPriceFCN"]', false);
                    }
                    return false
                } //INT1FIN47-768Gateway Markets Instant Pricing issue

                sessionStorage.setItem("poolingTimer_" + repriceObjectFCN.CurrentTileID, Number(sessionStorage.getItem("poolingTimer_" + thisTileFCN.id.match(/\d+$/)[0])) + 1);
                
                finalObjFCN = (repriceObjectFCN['responseData']);

                sessionStorage.setItem("quoteToken_" + thisTileFCN.id.match(/\d+$/)[0], repriceObjectFCN['token']);
                sessionStorage.setItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]));
                // Sorted By Best Price LP'S                                
                finalObjFCN.sort(function (a, b) {
                    if (a.DRAOUT === null || a.DRAOUT == "" || a.DRAOUT == "Timeout" || a.DRAOUT.toUpperCase().trim() == "REJECTED" || a.DRAOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return 1;
                    } else if (b.DRAOUT === null || b.DRAOUT == "" || b.DRAOUT == "Timeout" || b.DRAOUT.toUpperCase().trim() == "REJECTED" || b.DRAOUT.toUpperCase().trim() == "UNSUPPORTED") {
                        return -1;
                    } else if (a.DRAOUT === b.DRAOUT) {
                        return 0;
                    }

                    if ($(thisTileFCN).find('[id^="ddlSolveForFCN"]').val().split("(")[0].trim().toUpperCase() == "COUPON") {
                        return Number(a.DRAOUT) > Number(b.DRAOUT) ? -1 : 1;
                    } else {
                        return Number(a.DRAOUT) < Number(b.DRAOUT) ? -1 : 1;
                    }

                });
                maxFCN = finalObjFCN[0].DRAOUT;
                //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
                //$(thisTileFCN).find('[id^="EQCRfqidpnl"]').show();
                // $(thisTileFCN).find('[id^="RFQIDEQC"]').html("");
                // $(thisTileFCN).find('[id^="RFQIDEQC"]').html("RFQ ID: " + finalObjFCN[0].EP_ER_QuoteRequestId);
                //end
                // END
                //Removed || LGTGTWINT-1981 || RizwanS || 12 May 2023
                $(thisTileFCN).find('[id^="hdnfinalTokenFCN"]').val(sessionStorage.getItem("quoteToken_" + thisTileFCN.id.match(/\d+$/)[0]));
               
               
                if (sessionStorage.getItem("pricingToggle" + thisTileFCN.id.match(/\d+$/)[0]) == "true") {
                    // Added by Atharva - EQC Timers - START
                    var isNonBestPrice = false;
                    if(clientConfigdata.CommonMethods.NonBestPrice == "Y") {
                        isNonBestPrice = true;
                    }
                    else {
                        isNonBestPrice = false;
                    }
                    // every time in new request indexes might change so clearing.
                    mapIndexToBank["td"+repriceObjectFCN.CurrentTileID] = {};
                    // END
                    // $(thisTileFCN).find('[id^="FCNBanksRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // $(thisTileFCN).find('[id^="FCNPrices"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // Added by Atharva - EQC Timers - START
                    $(thisTileFCN).find('[id^="FCNTimerRow"]').empty();
                    if(!hasUserClickedEQC["td"+repriceObjectFCN.CurrentTileID]) {
                        $(thisTileFCN).find('[id^="hdnSelectedBank"]').val("");
                    }
                    var itr = 0;
                    // END
                    // $(thisTileFCN).find('[id^="minMaxNotionalLimitRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023

                    //Check for best price count || LGTGTWINT-1981 || RizwanS || 12 May 2023
                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023
                    if (NotesBestPriceDisplayCount != "") { 

                        // LGTGTWINT-2018 - Prices to be displayed for EAM entity on MSP and IP only when the input notional falls within min max range of CPs || RizwanS || 24 May 2023
                        if(NotionalMinMaxCheck.toUpperCase() === 'YES' && parseFloat($(thisTileFCN).find('[id^="ContractAmtFCN"]').val().replace(/,/g, "")) > 0){  //RizwanS || LGTGTWINT-2153 || 27 Jun 2023
                            
                            let sliceCount = Number(NotesBestPriceDisplayCount); // Count to show best prices as per config set
                        
                            let productname = $(thisTileFCN).find(".productName").attr("id");

                            let _minmaxObj = [];

                            for(i=0;i<finalObjFCN.length;i++){
        

                                if(parseFloat($(thisTileFCN).find('[id^="ContractAmtFCN"]').val().replace(/,/g, "")) <= parseFloat(finalObjFCN[i].MaxNotional)
                                && parseFloat($(thisTileFCN).find('[id^="ContractAmtFCN"]').val().replace(/,/g, "")) >= parseFloat(finalObjFCN[i].MinNotional)){
                                    
                                    _minmaxObj.push(finalObjFCN[i]);
        
                                }
        
                            }

                            if(_minmaxObj.length <= 0){

                                $(thisTileFCN).find('[id^="btnEmailQuote"]').attr("disabled", true);
                                $(thisTileFCN).find('[id^="BookTradeFCN"]').attr("disabled", true);
                                $(thisTileFCN).find('[id^="OrderEmail"]').attr("disabled",true); 
                                return false;
                            } 
    
                            finalObjFCN = sliceEQCbestprices(_minmaxObj,productname,sliceCount);
                           
                        } //END
                    }

                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023
                    $(thisTileFCN).find('[id^="FCNBanksRow"]').empty();
                    $(thisTileFCN).find('[id^="FCNPrices"]').empty();
                    $(thisTileFCN).find('[id^="minMaxNotionalLimitRow"]').empty();
                    //END
 
                    bindRFQIDEQC(thisTileFCN,finalObjFCN); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023

                    $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val(JSON.stringify(finalObjFCN));

                    // END

                    $(finalObjFCN).each(function (i, elem) {
                        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
                        var priceClass = "GlowPrice_Red";
                        if (!glowFlag) {
                            priceClass = "noGlow";
                        }

                        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                        // $(thisTileFCN).find('[id^="EQCRfqidpnl"]').show();
                        // $(thisTileFCN).find('[id^="RFQIDEQC"]').html(elem.ParentID);
                        //end

                        var str = "";
                        var str2 = "";
                        if (elem.PP_CODE != null) {
                            // Added by Atharva - EQC Timers - START
                            mapIndexToBank["td"+repriceObjectFCN.CurrentTileID][itr] = elem.PP_CODE;
                            if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "Rejected" &&  elem.DRAOUT != "" && $(thisTileFCN).find('[id^="hdnSelectedBank"]').val() == "") {
                                $(thisTileFCN).find('[id^="hdnSelectedBank"]').val(elem.PP_CODE);
                            }
                            if (elem.PP_CODE == "CITI") {
                                if(isNonBestPrice) {
                                    if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "Rejected" &&  elem.DRAOUT != "" && ($(thisTileFCN).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectFCN.CurrentTileID + "_" + itr + "'>" + "Citi" + "</button></td>";
                                    }
                                    else if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "Rejected" && elem.DRAOUT != "") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectFCN.CurrentTileID + "_" + itr + "'>" + "Citi" + "</td>";
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
                                    if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "Rejected" &&  elem.DRAOUT != "" && ($(thisTileFCN).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                        str = str + "<td class='priceBackground";
                                        if(itr == 0) {
                                            str = str + " bestPriceStyle";
                                        }
                                        str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectFCN.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</button></td>";
                                    }
                                    else if(elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "Rejected" &&  elem.DRAOUT != "") {
                                        str = str + "<td";
                                        if(itr == 0) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectFCN.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</td>";
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
                            $(thisTileFCN).find('[id^="FCNBanksRow"]').append(str);
                        } else {
                            str = str + "<td>--</td>"
                            $(thisTileFCN).find('[id^="FCNBanksRow"]').append(str);
                        }
                        if (elem.DRAOUT != null && !isNaN(elem.DRAOUT) && elem.DRAOUT != "" && elem.DRAOUT != "Rejected") {
                            // Added by Atharva - EQC Timers
                            // Added new if condition
                            if(isNonBestPrice) {
                                if($(thisTileFCN).find('[id^="hdnSelectedBank"]').val() == elem.PP_CODE) {
                                
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
                                    str2 = str2 + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectFCN.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DRAOUT).toFixed(2) + "%</button></td>"
                                    $(thisTileFCN).find('[id^="FCNPrices"]').append(str2);
                                } else {
                                    str2 = str2 + "<td";

                                    if(parseFloat(elem.DRAOUT).toFixed(2) < 2){

                                        if(itr == 0) {
                                            str2 = str2 + " class='negativeprice_nonbest'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton negativeprice_nonbest' onclick='setPriceEQC(this)' id='td" + repriceObjectFCN.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DRAOUT).toFixed(2) + "%</button></td>"
                                        $(thisTileFCN).find('[id^="FCNPrices"]').append(str2);

                                    } else{

                                        if(itr == 0) {
                                            str2 = str2 + " class='bestPriceStyle'";
                                        }
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObjectFCN.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.DRAOUT).toFixed(2) + "%</button></td>"
                                        $(thisTileFCN).find('[id^="FCNPrices"]').append(str2);
                                        
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
                                $(thisTileFCN).find('[id^="FCNPrices"]').append(str2);
                            }
                        } else {
                            str2 = str2 + "<td>-</td>"
                            $(thisTileFCN).find('[id^="FCNPrices"]').append(str2);
                        }
                       

                        itr++;

                let strMinMaxNotionalLimit = '';

                if (elem.PP_CODE != null) {
                    strMinMaxNotionalLimit = strMinMaxNotionalLimit + `<td style='font-size:12px !important;'>${K_M_B_Formatter(Number(elem.MinNotional))} / ${K_M_B_Formatter(Number(elem.MaxNotional))}</td>`;
                    $(thisTileFCN).find('[id^="minMaxNotionalLimitRow"]').append(strMinMaxNotionalLimit);
                                        }

                        // END
                    });
                    // Added by Atharva - EQC Timers - START
                    // Should run only once
                    // if(!isTimerStarted["td" + repriceObjectFCN.CurrentTileID]) {
                    //     isTimerStarted["td" + repriceObjectFCN.CurrentTileID] = true;
                    //     startTimersEQC(repriceObjectFCN.CurrentTileID);
                    // }
                    // END

                }
                  
            }).catch(error => {
                console.log(error);
                $(thisTileFCN).find('[id^="btnBestPriceFCN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
                clearInterval(uniqueIntervalID.value);
                mapleLoaderStop(thisTileFCN,'[id^="btnBestPriceFCN"]', false);
                uniqueIntervalID.value = "";
                $(thisTileFCN).find('[id^="OverlayDiv"]').hide();

                // $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val(JSON.stringify(finalObjFCN));
                // if (finalObjFCN != null || finalObjFCN != undefined) {
                //     drawgraphFCN($(thisTileFCN).find('[id^="canvas"]').attr('id'));
                // } // INT1FIN47-768 Gateway Markets Instant Pricing issue

            })
        }
    } catch (error) {

        $(thisTileFCN).find('[id^="btnBestPriceFCN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issueclearInterval(uniqueIntervalID.value);
        sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        clearInterval(uniqueIntervalID.value);
        mapleLoaderStop(thisTileFCN,'[id^="btnBestPriceFCN"]', false);

        uniqueIntervalID.value = "";
        $(thisTileFCN).find('[id^="OverlayDiv"]').hide();
        // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
        $(thisTileFCN).find('[id^="btnEmailQuote"]').attr("disabled", true);
        $(thisTileFCN).find('[id^="BookTradeFCN"]').attr("disabled", true);
        $(thisTileFCN).find('[id^="OrderEmail"]').attr("disabled",true);  //LGTGTWINT-1981 || RizwanS || 12 May 2023

        console.log("getFinalQuoteResponseFCN : " + error.message);
        
        // $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val(JSON.stringify(finalObjFCN));
        // if (finalObjFCN != null || finalObjFCN != undefined) {
        //     drawgraphFCN($(thisTileFCN).find('[id^="canvas"]').attr('id'));
        // }// INT1FIN47-768 Gateway Markets Instant Pricing issue
        // sessionStorage.setItem("quoteToken_" + thisTileFCN.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileFCN.id.match(/\d+$/)[0]));
        // sessionStorage.setItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]));
        //// INT1FIN47-768 Gateway Markets Instant Pricing issue
  

    } finally {
      //  $(thisTileFCN).find('[id^="BookTradeFCN"]').attr("disabled", false);
    }
}

// To book trade
function booktradeFCN(that,suitabilityCheck,redirectOrder) {
    try {
      
        // startLoader();

        TileId = that.id.match(/\d+$/)[0];
        thisTileFCN = document.getElementById("td" + TileId);
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
            $(thisTileFCN).find('[id^="FCNBanksRow"]').children().each(function() {
                if($(thisTileFCN).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
            mapleOrderLoaderStop(thisTileFCN);
               return false;
        
        }

        // END

        let AllocationDetails=[];

        $(thisTileFCN).find("select.ChildrenddlBookingCenter").each(function(index, element){

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

        var Obj = JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val());
        var token1 = $(thisTileFCN).find('[id^="hdnfinalTokenFCN"]').val();
        var quoteid = Obj[selectedBankIndex].EP_ER_QuoteRequestId;
        // Added by Atharva - EQC Timers
        // Replaced 0 with selectedBankIndex

        // Added for upfront% in order blotter // JIRA ID - CFINT-1015 // 20 Oct 2020 //

        // let marginFCN;
        
        // if ($(thisTileFCN).find('[id^="ddlSolveForFCN"]').val().split("(")[0].trim().toUpperCase()  == "STRIKE" || $(thisTileFCN).find('[id^="ddlSolveForFCN"]').val().split("(")[0].trim().toUpperCase()  == "COUPON") {
                    
        //     marginFCN = (100 -  parseFloat($(thisTileFCN).find('[id^="IBPriceipbox"]').val()));
        // }
        // else {

        //     marginFCN = (100 - JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[selectedBankIndex].DRAOUT);
        //     // Added by Atharva - EQC Timers
        //     // Replaced 0 with selectedBankIndex
        // }
        
        //END
       // let _clientPrice =(parseFloat(JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[selectedBankIndex].DRAOUT) + parseFloat(100 - JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[0].DRAOUT)).toFixed(2);


        let limitPrice1 = "";
        let limitPrice2 = "";
        let limitPrice3 = "";
        let limitPrice4 = "";

        if($(thisTileFCN).find('[id^="ddlOrderTypeFCN"]').val().trim().toUpperCase() == "LIMIT"){

            if($(thisTileFCN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 0){

                limitPrice1 = $(thisTileFCN).find('[id^="txtLimitLevel"]').val().trim();

            }else if($(thisTileFCN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 1){

                 limitPrice2 = $(thisTileFCN).find('[id^="txtLimitLevel"]').val().trim();

            } else if($(thisTileFCN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 2){

                 limitPrice3 = $(thisTileFCN).find('[id^="txtLimitLevel"]').val().trim();
                 
            } else if($(thisTileFCN).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 3){

                limitPrice4 = $(thisTileFCN).find('[id^="txtLimitLevel"]').val().trim();
                
            }            
        }

        //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

        let _confirmReason = "";

        if(selectedBankIndex>0){
 
            if($(thisTileFCN).find('[id^="ddlNONBEST"]').val() != "NONBEST_CUSTOM"){
 
              _confirmReason = $(thisTileFCN).find('[id^="ddlNONBEST"]').text();
      
            }else{
      
                 _confirmReason =  $(thisTileFCN).find('[id^="txtNONBEST"]').val(); 
                  
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
            if ($(thisTileFCN).find('[id^="rbRowSuitabilityToggle"]')[0].checked) {
                _chkSuitability = "NO";
                if ($(thisTileFCN).find('[id^="ddlReason"]').val().trim().includes("SUTSKP_CUSTOM")) { // Added by RizwanS | JIRA-LGTGTWINT-1830
                    _reasonmsg = $(thisTileFCN).find('[id^="txtSpecifyReason"]').val();
                }else{
                    _reasonmsg = $(thisTileFCN).find('[id^="ddlReason"]').val();
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
               orderQty: $(thisTileFCN).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
               type:$(thisTileFCN).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
               limitPrice1: limitPrice1,
               limitPrice2: limitPrice2,
               limitPrice3: limitPrice3,
               limitPrice4: limitPrice4,
               QuoteRequestId: quoteid,
               loginUser: sessionStorage.getItem("EQC_UserName").toString(),
               margin: "0.00",//Number(marginFCN).toFixed(2),
               clientPrice:"0.00",
               yield: "",
               bookingBranch: $(thisTileFCN).find('[id^="ddlBookingBranch"]').val(),
               rmNameForOrderConfirmation: $(thisTileFCN).find('[id^="ddlRMName"]').val(),
               dealerNotificationEmailID: $(thisTileFCN).find('[id^="txtComment"]').val(),
               orderComment: $(thisTileFCN).find('[id^="txtComment"]').val(),
               confirmationReason: _confirmReason,
               advisoryReason: $(thisTileFCN).find('[id^="txtComment"]').val(),
               preTradeXml: preTradeXml,
            // chkSuitability:$(thisTileFCN).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
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
                "orderQuantity": $(thisTileFCN).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "OrderType": $(thisTileFCN).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
                "LimitPrice1": limitPrice1,
                "LimitPrice2": limitPrice2,
                "LimitPrice3": limitPrice3,
                "LimitPrice4": limitPrice4,
                "QuoteRequestId": quoteid,
                "PoolID": "",
                "RedirectOrderID": "",
                "OrderComment": $(thisTileFCN).find('[id^="txtComment"]').val(),
                "Margin": "0.00",//Number(marginFCN).toFixed(2),
                "Notional": $(thisTileFCN).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
                "ClientPrice": "0.00",
                "ClientYield": "",
                "BookingBranch": $(thisTileFCN).find('[id^="ddlBookingBranch"]').val(),
                "RMNameforOrderConfirm": $(thisTileFCN).find('[id^="ddlRMName"]').val(),
                "RMEmailIdforOrderConfirm": "",
                "ConfirmReason": _confirmReason, //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message
                "PreTradeXml": "",
                "AdvisoryReason": "",
                // "UserRole": _reasonmsg, // Added Chaitanya M | For checking the suitability reason | Ref:LGTGTWINT-603 | 12-Jan-2023
                "CustomerID": "",
                // "chkSuitability":$(thisTileFCN).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
                "chkSuitability":_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                "SuitabilityReason": _reasonmsg, // Added by RizwanS | JIRA-LGTGTWINT-1830
                "IntendedSpread": "",
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": TileId,
                "AllocationDetails": AllocationDetails,
                "UserRole" : isEQCDealer === true ? 'Dealer' : isIA=== true ? 'IA' : 'RM' , // Added by RizwanS | JIRA-LGTGTWINT-1830
            
            }
        }

        mapleOrderLoaderStart(thisTileFCN);
           
       request_getDataFromAPI(bookObject, clientConfigdata.CommonMethods.NodeServer + orderMethodName).then(bookObject => {

            // endLoader()

            thisTileFCN = document.getElementById("td" + bookObject.CurrentTileID);

            TileId = bookObject.CurrentTileID;

            let bookstring = bookObject['responseData']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
             
            let OrderStatus = bookObject['message']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
        

            if (OrderStatus.toUpperCase() == clientConfigdata.EQCCommonMethods.EQC_BOOK_TRADE_RESPONSE_DETAILS.toUpperCase()) {

                // $(thisTileFCN).find('[id^="hdnBlotterURLFCN"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                // $(thisTileFCN).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradefcn" + TileId, bookstring, "DivOverlayfcn");
                $(thisTileFCN).find('[id^="OverlayDiv"]').hide();
                $(thisTileFCN).find('[id^="hdnfinalTokenFCN"]').val("");
                clearPricerTable(thisTileFCN);
                
            } else {

                if(OrderStatus == "" || OrderStatus == null || OrderStatus==undefined){

                    OrderStatus = "Order Execution Failed!";
                    
                
                }else if(OrderStatus.includes("Please select booking centers from same region")){ // LGTGTWINT-1888 || RizwanS || 30 May 2023

                    OrderStatus = "Please select booking centers from same region.";
                }
                
                booktradePopup(that, "booktradefcn" + TileId, OrderStatus, "DivOverlayfcn");
                $(thisTileFCN).find('[id^="OverlayDiv"]').hide();
                $(thisTileFCN).find('[id^="hdnfinalTokenFCN"]').val("");
                clearPricerTable(thisTileFCN);
            }
            mapleOrderLoaderStop(thisTileFCN);
            sessionStorage.removeItem("quoteResponse_" + thisTileFCN.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileFCN).find('[id^="btnBestPriceFCN"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileFCN).find('[id^="hdnintervalID"]').val());
            mapleLoaderStop(thisTileFCN,'[id^="btnBestPriceFCN"]', false);
            // Added by Atharva - EQC Timers - START
            $(thisTileFCN).find('[id^="FCNPrices"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            $(thisTileFCN).find('[id^="FCNBanksRow"]').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileFCN).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileFCN).find('[id^="BookTradeFCN"]').attr("disabled", true);
            $(thisTileFCN).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
             
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileFCN).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileFCN).find('[id^="RFQIDEQC"]').html("");
            //End

            // END
        }).catch(error => { console.log(error); })
    } catch (er) {
        console.log(er);
        booktradePopup(that, "booktradefcn" + TileId, "Order Execution Failed!", "DivOverlayfcn");
        $(thisTileFCN).find('[id^="OverlayDiv"]').hide();
        // endLoader();
        mapleOrderLoaderStop(thisTileFCN);

    } finally {

    }
}

var dialogBoxFCN = null;
function emailQuoteFCN(that) {
    try {

        thisTileFCN= $(that).parents(".sorting")[0];
    
        let pricingRow = "";
        pricingRow = $(thisTileFCN).find("table.pricerTable .pricesRow")[0];
        mapleOrderLoaderStart(thisTileFCN); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
    
        if (pricingRow.cells[0].innerText.trim().toString() === "-") {
            openValidationpopup('',"No price available for mailing!"); // Changed for Change quote mail validation from "Invalid Price" to "No price available for mailing!" | Ref: LGTGTWINT-1195 | Chaitanya M | 25-jan-2023
          return false;
        }

        //create email pop up here 
        let strEmail =``;
        let emailPriceStream =JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val());
        console.log('email price stream object ', emailPriceStream);

        strEmail=strEmail+`<table class='emailTable'><tr><td class='payOff_Features'>
        <input type='checkbox' class='chkBoxParent_Email_PPCode' onchange='emailParentCheckboxChanged(this)' >
        Issuer</td><td class='payOff_Features'>${globalSolveForValueFCN}</td></tr>`;

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
        if(dialogBoxFCN===null)
        {
            dialogBoxFCN= $(thisTileFCN).find('[id^="emailDialog_FCN"]')[0];
            $(thisTileFCN).find('[id^="emailDialog_FCN"]').empty().append(strEmail);
            $(dialogBoxFCN).dialog({
                resizable: false,
                height: "auto",
                width: 320,
                open: function (event, ui) {// Added for LGTGTWINT-1283 || Email popup on top change | Chaitanya M | 08 Feb 2023
                    $('.ui-widget.ui-widget-content').css('z-index',999);                    
                },  
                //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                close: function (event, ui){
                    mapleOrderLoaderStop(thisTileFCN);
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

                    
                        if($(document).find('.ui-dialog').find('[id^="emailDialog_FCN"]').find('.chkBox_Email_PPCode').length>0)
                        {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_FCN"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                                if(checkboxControl.checked){
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val()).filter(function(RFQ_OBJECT){
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


                        if ($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val() != undefined && $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val().trim()!='')
                        var RFQID = JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;
    
                        if (RFQID != undefined && RFQID != ''){
                            //     MailBestQuote(thisTileFCN.id.match(/\d+$/)[0], JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[0].EP_ER_QuoteRequestId);
                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023          
                                //booktradePopup(thisTileFCN, "booktradefcn" + thisTileFCN.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayfcn");
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            }     
                            $(this).dialog("close"); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileFCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                                "rfqId":__mailRFQ.toString(), //RFQID,
                                "CurrentTileID":thisTileFCN.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType:"English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileFCN = document.getElementById("td" +TileId);
                                mapleOrderLoaderStop(thisTileFCN);
                                booktradePopup(thisTileFCN, "booktradefcn" + TileId, data.message, "DivOverlayfcn");
                                
                            }).catch(error=>{
                                console.log(error);
                            
                            })
                        }else{
                            mapleOrderLoaderStop(thisTileFCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('','Invalid RFQ ID ');
                        }
                            
             
                    },
                    "Mail All Quotes": function() {
                        //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023


                        var Email_PPList = [];
                        var RFQIDList = [];
                        var __mailRFQ = [];


                        if ($(document).find('.ui-dialog').find('[id^="emailDialog_FCN"]').find('.chkBox_Email_PPCode').length > 0) {
                            $(document).find('.ui-dialog').find('[id^="emailDialog_FCN"]').find('.chkBox_Email_PPCode').each(function (chkIndex, checkboxControl) {
                             //   if (checkboxControl.checked) {
                                    Email_PPList.push($(checkboxControl).parent().text().trim())

                                    RFQIDList.push(JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val()).filter(function (RFQ_OBJECT) {
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

                        if ($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val() != undefined && $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val().trim() != '')
                            var RFQID = JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

                        if (RFQID != undefined && RFQID != '') {
                            //     MailBestQuote(thisTileFCN.id.match(/\d+$/)[0], JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[0].EP_ER_QuoteRequestId);
                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileFCN, "booktradefcn" + thisTileFCN.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayfcn");
                                mapleOrderLoaderStop(thisTileFCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            } 
                            $( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileFCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({
                                "userName": sessionStorage.getItem("FinIQUserID").toString(),
                                "rfqId": __mailRFQ.toString(), //RFQID,
                                "CurrentTileID": thisTileFCN.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType: "English"
                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileFCN = document.getElementById("td" + TileId);
                                mapleOrderLoaderStop(thisTileFCN);
                                booktradePopup(thisTileFCN, "booktradefcn" + TileId, data.message, "DivOverlayfcn");

                            }).catch(error => {
                                console.log(error);

                            })
                        }
                        else{
                            mapleOrderLoaderStop(thisTileFCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('', 'Invalid RFQ ID ');
                        }
                    
                        return true;

                        //email all quotes here 

                    }
                }
            });
            $(dialogBoxFCN).dialog('open');

        }else
        {
            $(document).find('.ui-dialog').find('[id^="emailDialog_FCN"]').empty().append(strEmail);

            $(dialogBoxFCN).dialog('open');

            var Email_PPList =[];
            var RFQIDList=[];
            var __mailRFQ=[];
            
            if($(document).find('.ui-dialog').find('[id^="emailDialog_FCN"]').find('.chkBox_Email_PPCode').length>0)
            {
                $(document).find('.ui-dialog').find('[id^="emailDialog_FCN"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                    if(checkboxControl.checked){
                    Email_PPList.push($(checkboxControl).parent().text().trim())

                    RFQIDList.push(JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val()).filter(function(RFQ_OBJECT){
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


            if ($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val() != undefined && $(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val().trim()!='')
            var RFQID = JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

            if (RFQID != undefined && RFQID != ''){
                //     MailBestQuote(thisTileFCN.id.match(/\d+$/)[0], JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[0].EP_ER_QuoteRequestId);
                if(__mailRFQ == ""){
                    // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    //booktradePopup(thisTileFCN, "booktradefcn" + thisTileFCN.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayfcn");
                    mapleOrderLoaderStop(thisTileFCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    openValidationpopup('','No price selected for mailing !');
                    //End
                    return false;
                }     
                mapleOrderLoaderStart(thisTileFCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                request_getDataFromAPI({"userName": sessionStorage.getItem("FinIQUserID").toString(),
                    "rfqId":__mailRFQ.toString(),//RFQID,
                    "CurrentTileID":thisTileFCN.id.match(/\d+$/)[0],
                    "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                    QuoteMailType:"English"
                }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                    console.log(data);
                    TileId = data.CurrentTileID;
                    thisTileFCN = document.getElementById("td" +TileId)
                    mapleOrderLoaderStop(thisTileFCN);
                    booktradePopup(thisTileFCN, "booktradefcn" + TileId, data.message, "DivOverlayfcn");
                      
                }).catch(error=>{
                    console.log(error);
                   
                })
            }
            else{
                mapleOrderLoaderStop(thisTileFCN);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                openValidationpopup('','Invalid RFQ ID ');
                
            }

        }
        $(thisTileFCN).find('[id^="FCNBanksRow"]').children().each(function() {
           if($(thisTileFCN).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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


function validateOrderFCN(thisTileFCN,_flag){    // LGTGTWINT-1279 : Instant Pricing : Order booking valdations.

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
            $(thisTileFCN).find('[id^="FCNBanksRow"]').children().each(function() {
                if($(thisTileFCN).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
        if ($(thisTileFCN).find('[id^="ddlSolveForFCN"]').val().split("(")[0].trim().toUpperCase() == "STRIKE") {
            
            if($(thisTileFCN).find('[id^="koinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[selectedBankIndex].DRAOUT) > parseFloat($(thisTileFCN).find('[id^="koinputbox"]').val())){
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTileFCN).find('[id^="koinputbox"]').attr("id"), "KO % of Initial should be greater than strike(%)", thisTileFCN);
                return false;
            }
        
                else if($(thisTileFCN).find('[id^="kiinputbox"]').prop("disabled") != true && parseFloat(JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[selectedBankIndex].DRAOUT) < parseFloat($(thisTileFCN).find('[id^="kiinputbox"]').val())){
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTileFCN).find('[id^="kiinputbox"]').attr("id"), "KI % of Initial should be less than strike(%)", thisTileFCN);
                return false;
            }
        }
    
        if ($(thisTileFCN).find('[id^="hdnfinalTokenFCN"]').val() == "" || $(thisTileFCN).find('[id^="FCNPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileFCN).find('[id^="FCNPrices"]')[0].firstChild.innerHTML == "") {
                if(_flag == false){
                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').attr("id"), "Order Execution Failed!", thisTileFCN);
                return false;
        }
        
        if(parseFloat(JSON.parse($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').val())[selectedBankIndex].DRAOUT) <= 0){
                if(_flag == false){

                    _validateOrderEQC = true; 
                }
                ValidateField($(thisTileFCN).find('[id^="hdnChartPricesFCN"]').attr("id"), "Prices can not be negative 0r zero, Order Execution Failed!", thisTileFCN);
                return false;
        }

    }catch(er){
        console.log(er.message);
    }

}

//  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.

function ChangeSolveForFCN(solveFor, thisTileFCN,calledFromIndexFCN) {
    try {
        if (calledFromIndexFCN != undefined){
                if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                    $(thisTileFCN).find('[id^="strikeipbox"]').prop('disabled', true);
                    $(thisTileFCN).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTileFCN).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTileFCN).find('[id^="txtupfrontFCN"]').prop('disabled', false);
                    // checkupfrontPriceFCN(thisTileFCN); //LGTGTWINT-1095
                    checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val().trim(), thisTileFCN) //  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                    $(thisTileFCN).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTileFCN).find('[id^="IBPriceipbox"]').prop('disabled', true); ////LGTGTWINT-1095
                    $(thisTileFCN).find('[id^="couponipbox"]').prop('disabled', false);
                    $(thisTileFCN).find('[id^="txtupfrontFCN"]').prop('disabled', true); ////LGTGTWINT-1095
                    // checkupfrontPriceFCN(thisTileFCN);  //LGTGTWINT-1095
                    checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val().trim(), thisTileFCN) //  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                    $(thisTileFCN).find('[id^="strikeipbox"]').prop('disabled', false);
                    $(thisTileFCN).find('[id^="IBPriceipbox"]').prop('disabled', false);
                    $(thisTileFCN).find('[id^="couponipbox"]').prop('disabled', true);
                    $(thisTileFCN).find('[id^="txtupfrontFCN"]').prop('disabled', false); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for FCN and DRA
                    // checkupfrontPriceFCN(thisTileFCN);  //LGTGTWINT-1095
                    checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val().trim(), thisTileFCN)//  Chaitanya M 3 April-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                }
        }
        else {
            if (solveFor.trim().toUpperCase().includes("STRIKE")) {
                $(thisTileFCN).find('[id^="strikeipbox"]').prop('disabled', true);
                $(thisTileFCN).find('[id^="IBPriceipbox"]').prop('disabled', false); //LGTGTWINT-1095
                $(thisTileFCN).find('[id^="couponipbox"]').prop('disabled', false);
                $(thisTileFCN).find('[id^="txtupfrontFCN"]').prop('disabled', false); //LGTGTWINT-1095
                // checkupfrontPriceFCN(thisTileFCN);  //LGTGTWINT-1095
                checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val().trim(), thisTileFCN,true)//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            } else if (solveFor.trim().toUpperCase().includes("PRICE")) {
                $(thisTileFCN).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileFCN).find('[id^="IBPriceipbox"]').prop('disabled', true);
                $(thisTileFCN).find('[id^="couponipbox"]').prop('disabled', false);
                $(thisTileFCN).find('[id^="txtupfrontFCN"]').prop('disabled', true); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for FCN and DRA
                // checkupfrontPriceFCN(thisTileFCN);  //LGTGTWINT-1095
                checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val().trim(), thisTileFCN,true)//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
            } else if (solveFor.trim().toUpperCase().includes("COUPON")) {
                $(thisTileFCN).find('[id^="strikeipbox"]').prop('disabled', false);
                $(thisTileFCN).find('[id^="IBPriceipbox"]').prop('disabled', false); //LGTGTWINT-1095
                $(thisTileFCN).find('[id^="couponipbox"]').prop('disabled', true);
                $(thisTileFCN).find('[id^="txtupfrontFCN"]').prop('disabled', false); //LGTGTWINT-1095
                checkKOKITypeFCN($(thisTileFCN).find('[id^="ddlKOKIType"]').val().trim(), thisTileFCN,true);//Chaitanya M 4 April-2023 || LGTGTWINT-1822 Parameters values changed back to default on changing solve for on Instant Pricer
                // checkupfrontPriceFCN(thisTileFCN);  //LGTGTWINT-1095

            }

    }
    } catch (error) {
    }
}