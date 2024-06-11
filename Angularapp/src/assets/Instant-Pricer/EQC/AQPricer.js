$.support.cors = true;
var Type;
var tokenAQDQ;
var QuoteObjectForAQDQ;
var basketListAQDQ = [];
var NoOfShareipboxAQDQ;
var tempShareNameAQDQ;
var arrAQDQ = [];
var maxAQDQ;
var tokenObjAQ = "";
var repriceObject;
var Timer = 0;
var intervalID_AQDQ = 0;
var finalResponseDataAQDQ;
var finalTokenAQDQ;
var dd;
var sas;
var BarrierPercAQDQ;
var FrequencyAQDQ = "MONTHLY";
var Frequency = ["MONTHLY", "BI-WEEKLY"];
var availableTags = ["AQ", "DQ"];
var TypeAQDQ = "ACCUMULATOR";
var value;
var finalObjAQDQ;
var idAQDQ = 7;
var btnprice="btnBestPriceAQDQ";


function onLoadAQDQ(currId, isProductCopiedAQDQ) {
    // To load AQDQ
    try {

        setDeafaultValuesAQDQ(currId, isProductCopiedAQDQ);
        thisTileAQ = document.getElementById("td" + currId);
        $(thisTileAQ).find('[id^="OverlayDiv"]').hide();

        sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        $(thisTileAQ).find('[id^="btnBestPriceAQDQ"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        // clearInterval($(thisTileAQ).find('[id^="hdnintervalID"]').val());   // INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileAQ,'[id^="btnBestPriceAQDQ"]', false);
        clearPricerTable(thisTileAQ);

         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileAQ).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
         $(thisTileAQ).find('[id^="RFQIDEQC"]').html("");
         //End

        $(thisTileAQ).find("div.card input[type='text'],div.card input[type='search'],div.card select").on('change', function (){
            
            thisTileAQ = $(this).parents(".sorting")[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileAQ).find('[id^="btnBestPriceAQDQ"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileAQ).find('[id^="hdnintervalID"]').val()); 
            $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val(""); // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            clearPricerTable(thisTileAQ);

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileAQ).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileAQ).find('[id^="RFQIDEQC"]').html("");
            //End

            mapleLoaderStop(thisTileAQ,'[id^="btnBestPriceAQDQ"]', false);
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileAQ).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileAQ).find('[id^="btnBookTradeAQDQ"]').attr("disabled", true);
            $(thisTileAQ).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023

        });

        $(thisTileAQ).find(" div.card .amtPopup").on('select', function () { // INT1FIN47-768 Gateway Markets Instant Pricing issue
            
            thisTileAQ = $(this).parents(".sorting")[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileAQ).find('[id^="btnBestPriceAQDQ"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileAQ).find('[id^="hdnintervalID"]').val());
            $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val(""); // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            clearPricerTable(thisTileAQ);

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileAQ).find('[id^="EQCRfqidpnl"]').hide();  //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileAQ).find('[id^="RFQIDEQC"]').html("");
            //End

            mapleLoaderStop(thisTileAQ,'[id^="btnBestPriceAQDQ"]', false);      
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023  
            $(thisTileAQ).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileAQ).find('[id^="btnBookTradeAQDQ"]').attr("disabled", true);
            $(thisTileAQ).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
        }); 

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        //Start      
        $(thisTileAQ).find('.ddlShares').on("focusout", function (){  
              
            // Added for being Able to price with only share name entered and not selected| Ref:LGTGTWINT-1076, LGTGTWINT-1075 | Chaitanya M | 24-Jan-2023
            //Start
            let checkforshares=""       
            checkforshares = validateshares(thisTileAQ,"AQDQSharesDemo");
            $(thisTileAQ).find('[id^="ExchangenameAQDQ"]').val(getExchangeAndCcyFromBasket("", "exchange", $(thisTileAQ).find('[id^="AQDQSharesDemo"]').val().trim())[0]); // Added for setting the exchange dynamically in new UI | Ref LGTGTWINT-980 | Chaitanya M | 06 Feb 2023 
            sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileAQ,"btnBestPriceAQDQ");
            $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val(""); // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileAQ).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileAQ).find('[id^="btnBookTradeAQDQ"]').attr("disabled", true);
            $(thisTileAQ).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
            if(checkforshares==false){
                //ValidateField($(thisTileAQ).find('[id^="AQDQSharesDemo"]').attr("id"), "Please Enter Valid Shares", thisTileAQ);
                return false;                
            }        
            //End
                
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        $(thisTileAQ).find("div.card .ddlShares").on("keydown", function(){
            
            $("#bodyDiv").hide();
            sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileAQ,btnprice);
            $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val(""); // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileAQ).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileAQ).find('[id^="btnBookTradeAQDQ"]').attr("disabled", true);
            $(thisTileAQ).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
        }); 
       
        //End
     
        //aded by rutika on 26/04/2022 for calculating tenor when changed in input box
        //Start


        $(thisTileAQ).find('[id^="tenor_AQDQ"]').on("change", function() {
            try {
                thisTileAQ = $(this).parents(".sorting")[0];
                let currId=  thisTileAQ.id.match(/\d+$/)[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileAQ,btnprice);
                $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val("");
                //End
                if($(thisTileAQ).find('[id^="Type"]')[0].value == "AQ"){

                    AllowedTenorinMonths = Number(ACCAllowedTenorinMonths);
                    AllowedTenorinYears = Number(ACCAllowedTenorinYears);

                }else{

                    AllowedTenorinMonths = Number(DACAllowedTenorinMonths);
                    AllowedTenorinYears = Number(DACAllowedTenorinYears);
                }
               
                if( $(thisTileAQ).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_AQDQ"]').val()) > Number(AllowedTenorinMonths) || $(this).parents(".sorting").find('[id^="tenor_AQDQ"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_AQDQ"]').val() ==""){
                        ValidateField($(thisTileAQ).find('[id^="tenor_AQDQ"]').attr("id"), "Please enter valid tenor.", thisTileAQ);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_AQDQ"]').val()) > Number(AllowedTenorinYears) || $(this).parents(".sorting").find('[id^="tenor_AQDQ"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_AQDQ"]').val() ==""){
                        ValidateField($(thisTileAQ).find('[id^="tenor_AQDQ"]').attr("id"), "Please enter valid tenor.", thisTileAQ);
                        return false;
                    }
                }


                calculateAccrualDays(thisTileAQ);

            } catch (error) {
                console.log(error.message);
            }
        });


        $(thisTileAQ).find('[id^="tenorddl"]').on("change", function () {
            try {
                
                thisTileAQ = $(this).parents(".sorting")[0];
                let currId=  thisTileAQ.id.match(/\d+$/)[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileAQ,btnprice);
                $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val("");
                //End

                if($(thisTileAQ).find('[id^="Type"]')[0].value == "AQ"){

                    AllowedTenorinMonths = Number(ACCAllowedTenorinMonths);
                    AllowedTenorinYears = Number(ACCAllowedTenorinYears);

                }else{

                    AllowedTenorinMonths = Number(DACAllowedTenorinMonths);
                    AllowedTenorinYears = Number(DACAllowedTenorinYears);
                }

                if( $(thisTileAQ).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_AQDQ"]').val()) > Number(AllowedTenorinMonths)){
                        ValidateField($(thisTileAQ).find('[id^="tenor_AQDQ"]').attr("id"), "Please enter valid tenor.", thisTileAQ);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_AQDQ"]').val()) > Number(AllowedTenorinYears)){
                        ValidateField($(thisTileAQ).find('[id^="tenor_AQDQ"]').attr("id"), "Please enter valid tenor.", thisTileAQ);
                        return false;
                    }
                }
    
                calculateAccrualDays(thisTileAQ);
               
            } catch (error) {
                console.log(error);
            }
        });

        //End

        $(thisTileAQ).find('[id^="Type"]').on("change", function() {
            try {
                thisTileAQ = $(this).parents(".sorting")[0];
                var label = $(thisTileAQ).find('[id^="Type"]')[0].value;
                if (label == "AQ") {
                    value = "ACCUMULATOR";
                    $(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]')[0].value = "102.00"; // Changed for SCB EAM Demo | Chaitanya M | 27 Sep 2023 
                    TypeAQDQ = value;
                    changeSolveForAQDQ(thisTileAQ, $(thisTileAQ).find('[id^="solveForAQDQ"]').val().split("(")[0].trim()); //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                } else if (label == "DQ") {
                    value = "DECUMULATOR";
                    $(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]')[0].value = "95.00";
                    TypeAQDQ = value;
                    changeSolveForAQDQ(thisTileAQ, $(thisTileAQ).find('[id^="solveForAQDQ"]').val().split("(")[0].trim()); //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
                }
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileAQ,btnprice);
                $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val("");
                //End
            } catch (error) {
                console.log(error.message);
            }
        });

        $(thisTileAQ).find('[id^="solveForAQDQ"]').on("change", function() {
            thisTileAQ = $(this).parents(".sorting")[0]; 
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileAQ,btnprice);
            $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val("");
            //end
            changeSolveForAQDQ(thisTileAQ, $(thisTileAQ).find('[id^="solveForAQDQ"]').val().split("(")[0].trim()); //  Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
        });
        
        $(thisTileAQ).find('[id^="ddlAQDQOptions"]').on("change", function() {
            thisTileAQ = $(this).parents(".sorting")[0];
               // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileAQ,btnprice);
            $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val("");
            //End
            fillGauranteeDropdownAQDQ(thisTileAQ);
      
        });


        //Added for LGTGTWINT-1077 Instant Pricing: Input length for all fields for all payoffs | Chaitanya M | 28-01-2023
        $(thisTileAQ).find('[id^="tenor_AQDQ"]').on("keyup", function (){            

             InputLengthCheckEQC(thisTileAQ, "tenor_AQDQ",3);
        });

        $(thisTileAQ).find("[id^='strikeipboxAQDQ']").on("keyup", function(){

            InputLengthCheckEQC(thisTileAQ, "strikeipboxAQDQ",8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileAQ).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileAQ).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').on("keyup", function(){

             InputLengthCheckEQC(thisTileAQ, "txtUpfrontAQDQ",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileAQ).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileAQ).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        $(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').on("keyup", function(){

             InputLengthCheckEQC(thisTileAQ, "KoGauranteeipBoxAQDQ",6);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileAQ).find('[id^="EQCRfqidpnl"]').hide();//LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileAQ).find('[id^="RFQIDEQC"]').html("");
            //End

        });

        //Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
        $(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').on("change", function(){
        // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileAQ,btnprice);
            $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val("");
            //End
            
            if($(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').val() == "" || $(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').val() == null){
                $(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').val("0"); 
            }

        });

        //End

    } catch (error) {
        console.log(error.message);
    }
}

function calculateAccrualDays(thisTileAQ){
  try {

    let tenorNumb = parseFloat($(thisTileAQ).find('[id^="tenor_AQDQ"]').val());
    let tenorstring = $(thisTileAQ).find("[id^='tenorddl']").val();

    let _exchange =getExchangeAndCcyFromBasket("", "exchange", $(thisTileAQ).find('[id^="AQDQSharesDemo"]').val().trim())[0];
    let _baseCcy =getExchangeAndCcyFromBasket("", "ccy", $(thisTileAQ).find('[id^="AQDQSharesDemo"]').val().trim())[0];
    let _settlementFrequency =$(thisTileAQ).find('[id^="ddlAQDQOptions"]')[0].value;

    request_getDataFromAPI({
        "Tenor": tenorNumb,
        "UserName": sessionStorage.getItem("EQC_UserName").toString(),
        "Exchange":_exchange,
        "baseCCy":_baseCcy,
        "TenorType":tenorstring,
        "strSettleFrequency":_settlementFrequency,
        "CurrentTileID": thisTileAQ.id.match(/\d+$/)[0],
        "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString()

    },clientConfigdata.CommonMethods.NodeServer + "AccrualDays").then(data=>{

       thisTileAQ =  document.getElementById("td" + data.CurrentTileID);
  
        // console.log("Accural Days", data)
  
        $(thisTileAQ).find('[id^="hdnAccuralDaysAQDQ"]').val(Number(data.responseData));
  
        })
 

  } catch (error) {
    console.log(error);

  }
}

function fillGauranteeDropdownAQDQ(thisTileAQ){
    try {
        let value = $(thisTileAQ).find('[id^="ddlAQDQOptions"]')[0].value;

        if (value == "MONTHLY") {
            fillDropdownlistControl([0, 1, 2, 3], $(thisTileAQ).find('[id^="ddlGauranteeAQDQ"]').attr("id"));
            document.querySelector("#" + $(thisTileAQ).find('[id^="ddlGauranteeAQDQ"]').attr("id")).selectedIndex = 0;
        } else if (value == "BI-WEEKLY") {
            fillDropdownlistControl([0, 1, 2, 4, 6], $(thisTileAQ).find('[id^="ddlGauranteeAQDQ"]').attr("id"));
            document.querySelector("#" + $(thisTileAQ).find('[id^="ddlGauranteeAQDQ"]').attr("id")).selectedIndex = 0;
        }
    } catch (error) {
        console.log(error.message);
    }
}

function setDeafaultValuesAQDQ(currId, isProductCopiedAQDQ) {
    // To set the default values of the tile AQDQ
    try {
        thisTileAQ = document.getElementById("td" + currId);
        EQProductsFillCcy(thisTileAQ, "ddlAQDQCcy");

        $(thisTileAQ).find('[id^="AQDQSharesDemo"]').val(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CODE1); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
        $(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').val("250");
        $(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').attr('maxlength','10');
        $(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').val("0.70");
        $(thisTileAQ).find('[id^="LeverageipboxAQDQ"]').val("2");
        $(thisTileAQ).find('[id^="tenor_AQDQ"]').val("6");
        //added by rutkka on 26/04/2022 for default value of input box
        $(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').val("102.00"); // Changed for SCB EAM Demo | Chaitanya M | 27 Sep 2023
        fillGauranteeDropdownAQDQ(thisTileAQ); // LGTGTWINT-2170 || RizwanS || 22 Jun 2023
        //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
        if ($(thisTileAQ).find('[id^="Type"]').val().trim().toUpperCase() === "AQ") {
            EQCShareNameObj = ACCShareData;
        }else{
            EQCShareNameObj = DACShareData;
        }//END

        $(thisTileAQ).find('[id^="ExchangenameAQDQ"]').val(getExchangeAndCcyFromBasket("", "exchange", $(thisTileAQ).find('[id^="AQDQSharesDemo"]').val().trim())[0]);  // Added for setting the exchange dynamically in new UI | Ref LGTGTWINT-980 | Chaitanya M | 06 Feb 2023

        clearPricerTable(thisTileAQ);
   
        callautocomplete(thisTileAQ, "AQDQSharesDemo", sessionStorage.getItem(thisTileAQ.id) != undefined ? sessionStorage.getItem(thisTileAQ.id) : clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CODE1); // LGTGTWINT-1808 | Instant Pricing | Share suggestion dropdown missing for single underlying products || 31 Mar 2023
        
        let data = EQCShareNameObj.filter(function(item) {
            return (item["Code"] == $(thisTileAQ).find('[id^="AQDQSharesDemo"]').val().trim());
        });
        if ($(thisTileAQ).find("select.ddlEQNoteCcy") != undefined) {
            if (data.length > 0) {
                $(thisTileAQ).find("select.ddlEQNoteCcy").val(data[0]["Ccy"]);
            } else {
                $(thisTileAQ).find("select.ddlEQNoteCcy").val("USD");
            }
        }
        checkSolveForAQDQ(thisTileAQ, $(thisTileAQ).find('[id^="solveForAQDQ"]').val().split("(")[0].trim());
        //calculateAccrualDays(thisTileAQ); //LGTGTWINT-2248 | Chaitanya M | 10 Aug 2023

    } catch (error) {
        console.log(error.message);
    }
}

function checkSolveForAQDQ(thisTileAQ, strSolveForAQDQ, calledFromIndexAQDQ) {
  
    try {
        if (calledFromIndexAQDQ != undefined) {
            if (strSolveForAQDQ.trim().toUpperCase() === "STRIKE") {
                $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').val("95.00").prop("disabled", true); // Changed for SCB EAM Demo | Chaitanya M | 27 Sep 2023
                $(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').prop("disabled", false);
            } else if (strSolveForAQDQ.trim().toUpperCase() === "UPFRONT") {
                if ($(thisTileAQ).find('[id^="Type"]').val().trim().toUpperCase() === "AQ") {
                    $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').prop("disabled", false);
                } else {
                    $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').prop("disabled", false);
                }
                $(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').val("0.70").prop("disabled", true);
            }
        } else {
            if (strSolveForAQDQ.trim().toUpperCase() === "STRIKE") {
                if ($(thisTileAQ).find('[id^="Type"]').val().trim().toUpperCase() === "AQ") {
                    $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').val("95.00").prop("disabled", true); // Changed for SCB EAM Demo | Chaitanya M | 27 Sep 2023
                } else {
                    $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').val("102.00").prop("disabled", true); // Changed for SCB EAM Demo | Chaitanya M | 27 Sep 2023
                }
                $(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').val("0.70").prop("disabled", false);
            } else if (strSolveForAQDQ.trim().toUpperCase() === "UPFRONT") {
                if ($(thisTileAQ).find('[id^="Type"]').val().trim().toUpperCase() === "AQ") {
                    $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').val("95.00").prop("disabled", false); // Changed for SCB EAM Demo | Chaitanya M | 27 Sep 2023
                } else {
                    $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').val("102.00").prop("disabled", false); // Changed for SCB EAM Demo | Chaitanya M | 27 Sep 2023
                }
                $(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').val("0.70").prop("disabled", true);
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

var globalSolveForValueAQDQ = "";
//To calculate best price for AQDQ
function getBestPriceAQDQ(that) {
    try {

        //    var uniqueIntervalID;
        thisTileAQ = $(that).parents(".sorting")[0];      
        
        console.log("Start Interval value =" + $(thisTileAQ).find('[id^="hdnintervalID"]').val());

        $(thisTileAQ).find('[id^="btnBestPriceAQDQ"]').attr("disabled", true); // INT1FIN47-768 Gateway Markets Instant Pricing issue

        var requestIDAQ = "";

        requestIDAQ = requestIDAQ + RequestIDGenerator(50);

        $(thisTileAQ).find('[id^="hdnRequestID"]').val(requestIDAQ);  //INT1FIN47-768 Gateway Markets Instant Pricing issue

        mapleLoaderStop(thisTileAQ,'[id^="btnBestPriceAQDQ"]', false);

         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        //  $(thisTileAQ).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
         $(thisTileAQ).find('[id^="RFQIDEQC"]').html("");
         //End

        globalSolveForValueAQDQ = $(thisTileAQ).find('[id^="solveForAQDQ"]').val().trim();

        clearInterval($(thisTileAQ).find('[id^="hdnintervalID"]').val());
       
        console.log("After clear Interval value =" + $(thisTileAQ).find('[id^="hdnintervalID"]').val());

        $(thisTileAQ).find('[id^="hdnintervalID"]').val("");

        TileId = that.id.match(/\d+$/)[0];

        sessionStorage.setItem("pricingToggle" + TileId, false);
        sessionStorage.setItem("poolingTimer_" + TileId, 0);

        thisTileAQ = document.getElementById("td" + TileId);

        productName = $($(that).parents(".sorting").find(".productName")).attr("id");
        validation_clear();
        
        clearPricerTable(thisTileAQ);
        
        // if (Number($(thisTileAQ).find('[id^="tenor_AQDQ"]').val().split("M")[0]) % 3 != 0 || Number($(thisTileAQ).find('[id^="tenor_AQDQ"]').val().split("Y")[0]) % 3 != 0) {// ValidateField(
        //   $(thisTileAQ).find('[id^="tenor_AQDQ"]').attr("id"),
        //   "Tenor in months should be in multiples of 3",
        //   thisTileAQ
        // );
        // return false;
        // } else 

        let tenorNumb = $(thisTileAQ).find("[id^='tenor_AQDQ']").val();
        let tenorstring = $(thisTileAQ).find("[id^='tenorddl']").val();
        let _tenor = tenorNumb + tenorstring;


                // Added by RizwanS for tenor validation before pricing || 03 Jan 2022 ||

                if($(thisTileAQ).find('[id^="Type"]')[0].value == "AQ"){

                    AllowedTenorinMonths = Number(ACCAllowedTenorinMonths);
                    AllowedTenorinYears = Number(ACCAllowedTenorinYears);                  
    
                }else{
    
                    AllowedTenorinMonths = Number(DACAllowedTenorinMonths);
                    AllowedTenorinYears = Number(DACAllowedTenorinYears);
                    
                }

        
        if ($.trim($(thisTileAQ).find('[id^="AQDQSharesDemo"]').val()) == "") {
            ValidateField($(thisTileAQ).find('[id^="AQDQSharesDemo"]').attr("id"), "Please Enter Valid Shares", thisTileAQ);
            return false;
        } else if ($.trim($(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').val()) == "" || parseFloat($(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').val()) < 0) { //Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
            ValidateField($(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').attr("id"), "Please enter valid Daily No.of shares.", thisTileAQ);
            return false;
        } else if ($.trim($(thisTileAQ).find('[id^="tenor_AQDQ"]').val()) == "" || parseFloat($(thisTileAQ).find('[id^="tenor_AQDQ"]').val()) <=0) {
            ValidateField($(thisTileAQ).find('[id^="tenor_AQDQ"]').attr("id"), "Please Enter Valid tenor", thisTileAQ);
            return false;
        } else if ($.trim($(thisTileAQ).find('[id^="LeverageipboxAQDQ"]').val()) == "") {
            ValidateField($(thisTileAQ).find('[id^="LeverageipboxAQDQ"]').attr("id"), "Please Enter Valid Leverage", thisTileAQ);
            return false;
        } else if ($(thisTileAQ).find('[id^="solveForAQDQ"]').val().split("(")[0].toUpperCase().trim() != "UPFRONT") { //LGTGTWINT-1214 Instant Pricing: ACCU and DECU: Rfqs should be placed for 0 upfront
            if ($.trim($(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').val()) == ""  || parseFloat($(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').val()) > 99) {
                ValidateField($(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').attr("id"), "Please Enter Valid Upfront", thisTileAQ);
                return false;
            } //
        }

        // RizwanS || LGTGTWINT-2320 || 17 Aug 2023
        if (NotionalMinMaxCheck === "YES") {
            if(parseFloat($(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').val().replace(/,/g, "")) === 0){     
                ValidateField($(thisTileAQ).find('[id^="hdnQuoteID"]').attr('id'),"Please input non zero notional.",thisTileAQ);
                return false;
            }
        }
        //END
        
        if ($(thisTileAQ).find('[id^="solveForAQDQ"]').val().split("(")[0].toUpperCase().trim() != "STRIKE") {
            if ($.trim($(thisTileAQ).find('[id^="strikeipboxAQDQ"]').val()) == "" || parseFloat($(thisTileAQ).find('[id^="strikeipboxAQDQ"]').val()) <= 0) {
                ValidateField($(thisTileAQ).find('[id^="strikeipboxAQDQ"]').attr("id"), "Please Enter Valid Strike", thisTileAQ);
                return false;
            } else if ($(thisTileAQ).find('[id^="Type"]')[0].value.trim() == "DQ" && parseFloat($(thisTileAQ).find('[id^="strikeipboxAQDQ"]').val()) <= 100 || parseFloat($(thisTileAQ).find('[id^="strikeipboxAQDQ"]').val()) > Number(DACMaxStrike)) {
                ValidateField($(thisTileAQ).find('[id^="strikeipboxAQDQ"]').attr("id"), "Strike % should be greater than 100 & less than or equal to" + " " + DACMaxStrike , thisTileAQ);
                return false;
            } else if ($(thisTileAQ).find('[id^="Type"]')[0].value.trim() == "AQ" && parseFloat($(thisTileAQ).find('[id^="strikeipboxAQDQ"]').val()) >= 100 || parseFloat($(thisTileAQ).find('[id^="strikeipboxAQDQ"]').val()) < Number(ACCMinStrike)) {
                ValidateField($(thisTileAQ).find('[id^="strikeipboxAQDQ"]').attr("id"), "Strike % should be less than 100 & greater than or equal to" + " " + ACCMinStrike , thisTileAQ);
                return false;
            }
            // LGTGTWINT-1211 - Instant Pricing: Strike Validation for ACCU - "Strike % should be less than 100 & greater than or equal to 1."
            // LGTGTWINT-1210 - Instant Pricing: Strike Validation for DECU - "Strike % should be greater than 100 & less than or equal to 999"
        } 
        
        if ($.trim($(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').val()) == "") {
            ValidateField($(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').attr("id"), "Please Enter Valid KO", thisTileAQ);
            return false;
        } else if ($.trim($(thisTileAQ).find('[id^="ddlGauranteeAQDQ"]').val()) == "") {
            ValidateField($(thisTileAQ).find('[id^="ddlGauranteeAQDQ"]').attr("id"), "Please Enter Valid Gaurantee", thisTileAQ);
            return false;
        } else if (($(thisTileAQ).find('[id^="Type"]')[0].value == "AQ") && parseFloat($(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').val()) <= 0) { //LGTGTWINT-1632 Instant Pricing : Able to price for 0 KO for Decu
            ValidateField($(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').attr("id"), "Please enter valid KO % of intial", thisTileAQ);
            return false;
        } else if (($(thisTileAQ).find('[id^="Type"]')[0].value == "DQ") && parseFloat($(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').val()) <= 0) { //LGTGTWINT-1632 Instant Pricing : Able to price for 0 KO for Decu
            ValidateField($(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').attr("id"), "Please enter valid KO % of intial", thisTileAQ);
            return false;
        }else if ($(thisTileAQ).find('[id^="Type"]')[0].value == "AQ" && parseFloat($(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').val()) < Number(ACCMinKO)) { // //LGTGTWINT-1189
            ValidateField($(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').attr("id"), "KO% should be Greater than or equal to" + " " + ACCMinKO, thisTileAQ);
            return false;
        } else if ($(thisTileAQ).find('[id^="Type"]')[0].value == "DQ" && parseFloat($(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').val()) > Number(DACMaxKO)) { // LGTGTWINT-1188
            ValidateField($(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').attr("id"), "KO% should be less than or equal to" + " " + DACMaxKO, thisTileAQ);
            return false;
        }  else if (parseFloat($(thisTileAQ).find('[id^="LeverageipboxAQDQ"]').val()) != 1 && parseFloat($(thisTileAQ).find('[id^="LeverageipboxAQDQ"]').val()) != 2) {
            ValidateField($(thisTileAQ).find('[id^="LeverageipboxAQDQ"]').attr("id"), "Leverage factor should be 1 or 2", thisTileAQ);
            return false;
        } 
        

        // else if ($(thisTileAQ).find('[id^="Type"]')[0].value == "AQ" && parseFloat($(thisTileAQ).find('[id^="ddlGauranteeAQDQ"]').val()) > (1 / 3) * parseFloat($(thisTileAQ).find('[id^="tenor_AQDQ"]').val())) {
        //     ValidateField($(thisTileAQ).find('[id^="ddlGauranteeAQDQ"]').attr("id"), "Gaurantee period should be less than or equal to 1/3 of tenor", thisTileAQ);
        //     return false;
            //Validation End


            if( $(thisTileAQ).find('[id^="tenorddl"]').val() == "M"){

                if(Number($(thisTileAQ).find('[id^="tenor_AQDQ"]').val()) > Number(AllowedTenorinMonths)){
                    ValidateField($(thisTileAQ).find('[id^="tenor_AQDQ"]').attr("id"), "Please enter valid tenor.", thisTileAQ);
                    return false;
                }

            } else{

                if(Number($(thisTileAQ).find('[id^="tenor_AQDQ"]').val()) > Number(AllowedTenorinYears)){
                    ValidateField($(thisTileAQ).find('[id^="tenor_AQDQ"]').attr("id"), "Please enter valid tenor.", thisTileAQ);
                    return false;
                }
            }
            
            // END



            $(thisTileAQ).find('[id^="TBLAQDQ"]' + " td").each(function() {
                $(this).html("-");
            });

            value = $(thisTileAQ).find('[id^="ddlAQDQOptions"]')[0].value;
            var GuaranteedDurationType;
            if (value == "MONTHLY") {
                FrequencyAQDQ = Frequency[0];
                GuaranteedDurationType = "MONTH";
            } else if (value == "BI-WEEKLY") {
                FrequencyAQDQ = Frequency[1];
                GuaranteedDurationType = "WEEK";
            }

            // Solve for Upfront response changes | Ref: LGTGTWINT-580 | Chaitanya| 10-Jan-2023
            let _Upfrontvalue = "";
            if($(thisTileAQ).find('[id^="solveForAQDQ"]').val().trim().split("(")[0].trim().toUpperCase() === "UPFRONT"){
                _Upfrontvalue = 0;
            }else{
                _Upfrontvalue = Number($(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').val())
            }
            //End

            // Added for being Able to price with only share name entered and not selected| Ref:LGTGTWINT-1076, LGTGTWINT-1075 | Chaitanya M | 24-Jan-2023
            //start
            var checkforshares = validateshares(thisTileAQ,"AQDQSharesDemo" );
            if(checkforshares==false){
                ValidateField($(thisTileAQ).find('[id^="AQDQSharesDemo"]').attr("id"), "Please Enter Valid Shares", thisTileAQ);
                return false;                
            }     
            
            //End

            mapleLoaderStart(thisTileAQ,'[id^="btnBestPriceAQDQ"]', false);

            QuoteObjectForAQDQ = {
                "UserID":sessionStorage.getItem("EQC_UserName").toString(),
                "Type": $(thisTileAQ).find('[id^="Type"]').val().trim() === "AQ" ? "ACCUMULATOR" : "DECUMULATOR",
                "Exchange": getExchangeAndCcyFromBasket("", "exchange", $(thisTileAQ).find('[id^="AQDQSharesDemo"]').val().trim())[0],
                "UnderlyingCode":$(thisTileAQ).find('[id^="AQDQSharesDemo"]').val(),
                "Ccy":$(thisTileAQ).find('[id^="ddlAQDQCcy"]').val().trim(),
                "strSolveFor": $(thisTileAQ).find('[id^="solveForAQDQ"]').val().split("(")[0].trim().toUpperCase(),
                "BarrierPerc": $(thisTileAQ).find('[id^="KoGauranteeipBoxAQDQ"]').val(),
                "Tenor": _tenor,
                "strikePerc":  $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').val().trim(),
                "Upfront": _Upfrontvalue, // As upfront is entered in bps | Ref: LGTGTWINT-580 | Chaitanya| 16-Jan-2023
                "BarrierMode": "KO+1",
                "GearingLeverage": Number($(thisTileAQ).find('[id^="LeverageipboxAQDQ"]').val()),
                "GuaranteedDuration": $(thisTileAQ).find('[id^="ddlGauranteeAQDQ"]').val(),
                "DailyNoOfShares":  $(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').val(),
                "Variation": "",
                "Frequency":$(thisTileAQ).find('[id^="ddlAQDQOptions"]').val().toUpperCase(),
                "GuaranteedDurationType": $(thisTileAQ).find('[id^="ddlAQDQOptions"]').val().toUpperCase() === "MONTHLY" ? "MONTH" : "WEEK",
                "EQC_AllowNotionalCheck": "Y"
                ,"PPDetails":"",
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": TileId,
                "requestID":$(thisTileAQ).find('[id^="hdnRequestID"]').val() //INT1FIN47-768 Gateway Markets Instant Pricing issue
            };
            console.log("AQDQ :: ", QuoteObjectForAQDQ);
            if ($(thisTileAQ).find('[id^="AQDQSharesDemo"]')[0].value != "") {
                getQuoteAQDQ(QuoteObjectForAQDQ, $(thisTileAQ).find('[id^="hdnintervalID"]')[0]);
            } else {
                $(thisTileAQ).find('[id^="OverlayDiv"]').hide();
                $(thisTileAQ).find('[id^="btnBookTradeAQDQ"]').attr("disabled", false);
            }
        
            console.log("After Interval value =" + $(thisTileAQ).find('[id^="hdnintervalID"]').val());

    } catch (error) {
        console.log(error.message);
    }
}

// To get quote
function getQuoteAQDQ(QuoteObjectForAQDQ, uniqueIntervalID) {
    try {
        request_getDataFromAPI(QuoteObjectForAQDQ, clientConfigdata.CommonMethods.NodeServer + "QuoteAQDQ45").then((dataAQDQ)=>{
            thisTileAQ = document.getElementById("td" + dataAQDQ.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataAQDQ.CurrentTileID, true);
            mapleLoaderStart(thisTileAQ,'[id^="btnBestPriceAQDQ"]', false);
            //   finalTokenAQDQ = "";
            getUniqQuoteResponseAQDQ(thisTileAQ, dataAQDQ, uniqueIntervalID,QuoteObjectForAQDQ.requestID); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        }
        ).catch((error)=>{
            console.log(error);
        }
        );
    } catch (err) {
        console.log(err.message);
    } finally {}
}

function getUniqQuoteResponseAQDQ(thisTileAQ, dataAQDQ, uniqueIntervalID,reqestID) { // INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {
        var UIID = null;
        // Added by Atharva - EQC Timers - START
        isTimerStarted["td" + dataAQDQ.CurrentTileID] = false;
        myCounter["td" + dataAQDQ.CurrentTileID] = {};
        hasUserClickedEQC["td" + dataAQDQ.CurrentTileID] = false;
        $(thisTileAQ).find('[id^="hdnSelectedBank"]').val("");
 
        // END
        uniqueIntervalID.value = setInterval(function() {
            
            if(reqestID != $(thisTileAQ).find('[id^="hdnRequestID"]').val() || $(thisTileAQ).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                if($(thisTileAQ).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    mapleLoaderStop(thisTileAQ,'[id^="btnBestPriceAQDQ"]', false);
                }
                return false
            } // INT1FIN47-768 Gateway Markets Instant Pricing issue
            
            sessionStorage.setItem("quoteToken_" + thisTileAQ.id.match(/\d+$/)[0], "");
            sessionStorage.setItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0], "");

            sessionStorage.setItem("quoteToken_" + thisTileAQ.id.match(/\d+$/)[0], dataAQDQ["token"]);
            sessionStorage.setItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0], dataAQDQ["responseData"]);

            getFinalQuoteResponseAQDQ(sessionStorage.getItem("quoteToken_" + thisTileAQ.id.match(/\d+$/)[0]), sessionStorage.getItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]), thisTileAQ, uniqueIntervalID, reqestID); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        }, clientConfigdata.EQCAQDQ.PollInterval);

        console.log("uniqueIntervalID  " + uniqueIntervalID.value);
    } catch (error) {
        console.log(error);
    }
}

//To get price
function getFinalQuoteResponseAQDQ(finalToken1, finalResponseData1, thisTileAQ, uniqueIntervalID, reqestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {
        var currentDateAndTime = new Date();
 
        sessionStorage.setItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0], finalResponseData1);

        sessionStorage.setItem("quoteToken_" + thisTileAQ.id.match(/\d+$/)[0], finalToken1);

        console.log(TypeAQDQ + " RFQ's :: " + finalResponseData1 + " " + currentDateAndTime);
        Timer = Timer + 1;

        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileAQ.id.match(/\d+$/)[0])) >= Number(ACCDACrequestCount.toString().split(".")[0]) || sessionStorage.getItem("pricingToggle" + thisTileAQ.id.match(/\d+$/)[0]) == "false") { //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
            
            $(thisTileAQ).find('[id^="btnBestPriceAQDQ"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval(uniqueIntervalID.value);
            mapleLoaderStop(thisTileAQ,'[id^="btnBestPriceAQDQ"]', false);

            uniqueIntervalID.value = "";
            QuoteObjectForAQDQ = "";
            $(thisTileAQ).find('[id^="OverlayDiv"]').hide();

            arrAQDQ = [];
            maxAQDQ = "";
            Timer = 0;
            
            // $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val(JSON.stringify(finalObjAQDQ));
            // if (finalObjAQDQ != null || finalObjAQDQ != undefined) {
            //     drawgraphAQDQ($(thisTileAQ).find('[id^="canvas"]').attr("id"));
            // }
            //INT1FIN47-768 Gateway Markets Instant Pricing issue

            return false;
        } else {
            var repriceObject = request_getDataFromAPI({
                PPDetails: sessionStorage.getItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]),
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                CurrentTileID: thisTileAQ.id.match(/\d+$/)[0],
                UserID:sessionStorage.getItem("EQC_UserName").toString(),
            }, clientConfigdata.CommonMethods.NodeServer + "QuoteResponseAQDQ45").then((repriceObject)=>{
                thisTileAQ = document.getElementById("td" + repriceObject.CurrentTileID);
                if(reqestID != $(thisTileAQ).find('[id^="hdnRequestID"]').val()|| $(thisTileAQ).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    if($(thisTileAQ).find('[id^="hdnRequestID"]').val() === ""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    mapleLoaderStop(thisTileAQ,'[id^="btnBestPriceAQDQ"]', false);
                    }
                    return false
                } //INT1FIN47-768Gateway Markets Instant Pricing issue

                sessionStorage.setItem("poolingTimer_" + repriceObject.CurrentTileID, Number(sessionStorage.getItem("poolingTimer_" + thisTileAQ.id.match(/\d+$/)[0])) + 1);
                 // Start - Added by Chaitanya For Solve for Upfront and response received should be in % | Ref: LGTGTWINT-580 | 16-Jan-2023
                 
                 if ($(thisTileAQ).find('[id^="solveForAQDQ"]').val().trim().split("(")[0].trim().toUpperCase() === "UPFRONT"){
                    
                    if(!clientConfigdata.EQCAQDQ.UpfrontAQYN){

                   let quoteResponseObj = [];

                        quoteResponseObj = (repriceObject["responseData"]);
                        console.log(quoteResponseObj);

                         for(i=0;i<quoteResponseObj.length;i++){
                            // Addded a condition for Upfront to be displayed upto 4 decimals and issuers with no response should not be displayed on Email Quote popup. | LGTGTWINT-1136 | Chaitanya M | 19-Jan-2023
                            //Start
                           if((repriceObject["responseData"][i].AccDecOUT == "") || (repriceObject["responseData"][i].AccDecOUT.toUpperCase().trim() == "REJECTED" )|| ( repriceObject["responseData"][i].AccDecOUT.toUpperCase().trim() == "UNSUPPORTED" )){ 
                            
                            quoteResponseObj[i].AccDecOUT = quoteResponseObj[i].AccDecOUT;                                
                            
                             }else{
                                quoteResponseObj[i].AccDecOUT  = (quoteResponseObj[i].AccDecOUT / 100).toString();
                                quoteResponseObj[i].AccDecOUT = parseFloat(quoteResponseObj[i].AccDecOUT).toFixed(4)
                             }     
                           }
                           // end
                          finalObjAQDQ = quoteResponseObj;
                    }else{

                        finalObjAQDQ = (repriceObject["responseData"]);
                       }                    
                        
                   } else{

                     finalObjAQDQ = (repriceObject["responseData"]);

                    } 

                //   END
                
               // console.log(finalObjAQDQ);
                //finalObjAQDQ = (repriceObject["responseData"]);
                 
               // finalTokenAQDQ = repriceObject['token'];
                sessionStorage.setItem("quoteToken_" + thisTileAQ.id.match(/\d+$/)[0], repriceObject["token"]);
                sessionStorage.setItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]));
                // Sorted By Best Price LP'S

                if ($(thisTileAQ).find('[id^="Type"]').val() != undefined) {
                    if ($(thisTileAQ).find('[id^="Type"]')[0].value == "AQ") {
                        if ($(thisTileAQ).find('[id^="solveForAQDQ"]').val().trim().split("(")[0].trim().toUpperCase() === "UPFRONT") {
                            finalObjAQDQ.sort(function(a, b) {
                 
                                 if (Number(a.AccDecOUT) === null || Number(a.AccDecOUT) == "" || Number(a.AccDecOUT) == "Timeout" || a.AccDecOUT.toUpperCase().trim() == "REJECTED" || a.AccDecOUT.toUpperCase().trim() == "UNSUPPORTED" || Number(a.AccDecOUT) == 0) { // Added condition For Solve for Upfront and response received should be in % by Chaitanya | Ref: LGTGTWINT-580 | 16-Jan-2023
                                     return 1;
                                 } else if (Number(b.AccDecOUT) === null || Number(b.AccDecOUT) == "" || Number(b.AccDecOUT) == "Timeout" || b.AccDecOUT.toUpperCase().trim() == "REJECTED" || b.AccDecOUT.toUpperCase().trim() == "UNSUPPORTED" || Number(a.AccDecOUT) == 0) {// Added condition For Solve for Upfront and response received should be in % by Chaitanya | Ref: LGTGTWINT-580 | 16-Jan-2023
                                     return -1;
                                 } else if (Number(a.AccDecOUT) === Number(b.AccDecOUT)) {
                                     return 0;
                                 }
                                 return Number(a.AccDecOUT) > Number(b.AccDecOUT) ? -1 : 1;
                                 // Des Order Price            
                             });
                        } else {
                            finalObjAQDQ.sort(function(a, b) {
                                if (Number(a.AccDecOUT) === null || Number(a.AccDecOUT) == "" || Number(a.AccDecOUT) == "Timeout" || a.AccDecOUT.toUpperCase().trim() == "REJECTED" || a.AccDecOUT.toUpperCase().trim() == "UNSUPPORTED") {
                                    return 1;
                                } else if (Number(b.AccDecOUT) === null || Number(b.AccDecOUT) == "" || Number(b.AccDecOUT) == "Timeout" || b.AccDecOUT.toUpperCase().trim() == "REJECTED" || b.AccDecOUT.toUpperCase().trim() == "UNSUPPORTED") {
                                    return -1;
                                } else if (Number(a.AccDecOUT) === Number(b.AccDecOUT)) {
                                    return 0;
                                }
                                return Number(a.AccDecOUT) < Number(b.AccDecOUT) ? -1 : 1;
                                // Asc Order Price
                            });
                        }
                        maxAQDQ = finalObjAQDQ[0].AccDecOUT;
                    } else {
                        if ($(thisTileAQ).find('[id^="solveForAQDQ"]').val().trim().split("(")[0].trim().toUpperCase() === "UPFRONT") {
                            finalObjAQDQ.sort(function(a, b) {
                                if (Number(a.AccDecOUT) === null || Number(a.AccDecOUT) == "" || Number(a.AccDecOUT) == "Timeout" || a.AccDecOUT.toUpperCase().trim() == "REJECTED" || a.AccDecOUT.toUpperCase().trim() == "UNSUPPORTED" || Number(a.AccDecOUT) == 0) { // Added condition For Solve for Upfront and response received should be in % by Chaitanya | Ref: LGTGTWINT-580 | 16-Jan-2023
                                    return 1;
                                } else if (Number(b.AccDecOUT) === null || Number(b.AccDecOUT) == "" || Number(b.AccDecOUT) == "Timeout" || b.AccDecOUT.toUpperCase().trim() == "REJECTED" || b.AccDecOUT.toUpperCase().trim() == "UNSUPPORTED" || Number(a.AccDecOUT) == 0) {// Added condition For Solve for Upfront and response received should be in % by Chaitanya | Ref: LGTGTWINT-580 | 16-Jan-2023
                                    return -1;
                                } else if (Number(a.AccDecOUT) === b.AccDecOUT) {
                                    return 0;
                                }
                                return Number(a.AccDecOUT) > Number(b.AccDecOUT) ? -1 : 1;
                                // Des Order Price
                            });
                        } else {
                            finalObjAQDQ.sort(function(a, b) {
                                if (Number(a.AccDecOUT) === null || Number(a.AccDecOUT) == "" || Number(a.AccDecOUT) == "Timeout" || a.AccDecOUT.toUpperCase().trim() == "REJECTED" || a.AccDecOUT.toUpperCase().trim() == "UNSUPPORTED") {
                                    return 1;
                                } else if (Number(b.AccDecOUT) === null || Number(b.AccDecOUT) == "" || Number(b.AccDecOUT) == "Timeout" || b.AccDecOUT.toUpperCase().trim() == "REJECTED" || b.AccDecOUT.toUpperCase().trim() == "UNSUPPORTED") {
                                    return -1;
                                } else if (Number(a.AccDecOUT) === b.AccDecOUT) {
                                    return 0;
                                }
                                return Number(a.AccDecOUT) > Number(b.AccDecOUT) ? -1 : 1;
                                // Des Order Price
                            });
                        }
                        minAQDQ = finalObjAQDQ[0].AccDecOUT;
                    }
                    // END
                }
                
                // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileAQ).find('[id^="btnEmailQuote"]').attr("disabled", false);
                $(thisTileAQ).find('[id^="btnBookTradeAQDQ"]').attr("disabled", false);
                $(thisTileAQ).find('[id^="OrderEmail"]').attr("disabled",false); //LGTGTWINT-1981 || RizwanS || 12 May 2023
                
                  //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                  //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
                //   $(thisTileAQ).find('[id^="EQCRfqidpnl"]').show();
                 // $(thisTileAQ).find('[id^="RFQIDEQC"]').html("");
                  //$(thisTileAQ).find('[id^="RFQIDEQC"]').html(finalObjAQDQ[0].EP_ER_QuoteRequestId);
                  //end

                $(thisTileAQ).find('[id^="hdnfinalTokenAQDQ"]').val(sessionStorage.getItem("quoteToken_" + thisTileAQ.id.match(/\d+$/)[0]));

                if (sessionStorage.getItem("pricingToggle" + thisTileAQ.id.match(/\d+$/)[0]) == "true") {
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
                    
                    //Removed || LGTGTWINT-1981 || RizwanS || 12 May 2023
                    // $(thisTileAQ).find('[id^="AQDQBanksRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // $(thisTileAQ).find('[id^="AQDQPrices"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // Added by Atharva - EQC Timers - START
                    $(thisTileAQ).find('[id^="AQDQTimerRow"]').empty();
                    if (!hasUserClickedEQC["td" + repriceObject.CurrentTileID]) {
                        $(thisTileAQ).find('[id^="hdnSelectedBank"]').val("");
                    }
                    var itr = 0;
                    // END
                    // $(thisTileAQ).find('[id^="minMaxNotionalLimitRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023

                    //Check for best price count || LGTGTWINT-1981 || RizwanS || 12 May 2023
                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023 
                    if (ShowExpandButtonOnOTC.toUpperCase() == "NO") { 

                        // LGTGTWINT-2018 - Prices to be displayed for EAM entity on MSP and IP only when the input notional falls within min max range of CPs || RizwanS || 24 May 2023
                        if(NotionalMinMaxCheck.toUpperCase() === 'YES' && parseFloat(($(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').val()).replace(/\,/g, "")) > 0){ //RizwanS || LGTGTWINT-2153 || 27 Jun 2023

                            let sliceCount = 1; // Count to show best prices as per config set

                            let productname = $(thisTileAQ).find(".productName").attr("id");
                            
                            let calculatedNotional = '';

                            let _spotRate = '';

                            //Get spot rate of selected share
                            
                            let selectedShareName = $(thisTileAQ).find("[id^='AQDQSharesDemo']").val();
                            
                            let selectedShareCcy = getExchangeAndCcyFromBasket("", "ccy", selectedShareName)[0];

                            let tileID = repriceObject.CurrentTileID;

                            let spotRateRequest = {

                                "UserName" : userName,
                                "Share" :selectedShareName,
                                "Currency":selectedShareCcy,
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                "CurrentTileID": tileID,

                            }
 
                            let _getspotRate =  getSyncResponse(spotRateRequest, clientConfigdata.CommonMethods.NodeServer + "GetShareRateEQC");

                            if(_getspotRate.message.toUpperCase() == "SUCCESS"){

                                _spotRate = _getspotRate.responseData;

                            }

                            //END
                            
                            let noOfShares = ($(thisTileAQ).find('[id^="NoOfShareipboxAQDQ"]').val()).replace(/\,/g, "").split(".")[0]; //get no. of share

                            let _accuralDays = $(thisTileAQ).find('[id^="hdnAccuralDaysAQDQ"]').val() // get accural day's
                            
                            calculatedNotional = Number(noOfShares) * Number(_spotRate) * Number(_accuralDays);
                        
                            console.log( K_M_B_Formatter(Number(calculatedNotional)));

                            let _minmaxObj = [];

                            for(i=0;i<finalObjAQDQ.length;i++){
            
                                if(parseFloat(calculatedNotional) <= parseFloat(finalObjAQDQ[i].MaxNotional)
                                && parseFloat(calculatedNotional) >= parseFloat(finalObjAQDQ[i].MinNotional)){
                                    
                                    _minmaxObj.push(finalObjAQDQ[i]);
        
                                }
        
                            }
                            
                            if(_minmaxObj.length <= 0){

                                $(thisTileAQ).find('[id^="btnEmailQuote"]').attr("disabled", true);
                                $(thisTileAQ).find('[id^="btnBookTradeAQDQ"]').attr("disabled", true);
                                $(thisTileAQ).find('[id^="OrderEmail"]').attr("disabled",true);
                                return false;
                            }   
                        
                            finalObjAQDQ = sliceEQCbestprices(_minmaxObj,productname,sliceCount,OTCEQC_Cpty_BuyerCode);

                        }

                        if(OTCHideCounterparty.toUpperCase() == "YES"){

                            finalObjAQDQ[0].PP_CODE = OTCEQC_Cpty_BuyerCode;

                        }

                    }
                    //END
                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023 
                    $(thisTileAQ).find('[id^="AQDQBanksRow"]').empty();
                    $(thisTileAQ).find('[id^="AQDQPrices"]').empty();
                    $(thisTileAQ).find('[id^="minMaxNotionalLimitRow"]').empty();
                    //END

                    bindRFQIDEQC(thisTileAQ,finalObjAQDQ);//LGTGTWINT-2141 | Chaitanya M | 26 June 2023

                    $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val(JSON.stringify(finalObjAQDQ));

                    $(finalObjAQDQ).each(function(i, elem) {
                        try {
                            // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
                            var priceClass = "GlowPrice_Red";
                            if (!glowFlag) {
                                priceClass = "noGlow";
                            }

                             //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                            // $(thisTileAQ).find('[id^="EQCRfqidpnl"]').show();
                            // $(thisTileAQ).find('[id^="RFQIDEQC"]').html(elem.ParentID);
                            //End
                                                                               
                            var str = "";
                            var str2 = "";
                            if (elem.PP_CODE != null) {
                                // Added by Atharva - EQC Timers - START
                                mapIndexToBank["td" + repriceObject.CurrentTileID][itr] = elem.PP_CODE;
                                if (elem.AccDecOUT != null && !isNaN(parseFloat(elem.AccDecOUT)) && $(thisTileAQ).find('[id^="hdnSelectedBank"]').val() == "") {
                                    $(thisTileAQ).find('[id^="hdnSelectedBank"]').val(elem.PP_CODE);
                                }
                                if (elem.PP_CODE == "CITI") {
                                    if (isNonBestPrice) {
                                        if (elem.AccDecOUT != null && !isNaN(parseFloat(elem.AccDecOUT)) && $(thisTileAQ).find('[id^="hdnSelectedBank"]').val().trim() == elem.PP_CODE) {
                                            str = str + "<td class='priceBackground";
                                            if (itr == 0) {
                                                str = str + " bestPriceStyle";
                                            }
                                            str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + "Citi" + "</button></td>";
                                        } else if (elem.AccDecOUT != null && !isNaN(parseFloat(elem.AccDecOUT))) {
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
                                        if (itr == 0 && elem.AccDecOUT != null && !isNaN(parseFloat(elem.AccDecOUT))) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + ">Citi</td>";
                                    }
                                } else {
                                    if (isNonBestPrice) {
                                        if (elem.AccDecOUT != null && !isNaN(parseFloat(elem.AccDecOUT)) && $(thisTileAQ).find('[id^="hdnSelectedBank"]').val().trim() == elem.PP_CODE) {
                                            str = str + "<td class='priceBackground";
                                            if (itr == 0) {
                                                str = str + " bestPriceStyle";
                                            }
                                            str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</button></td>";
                                        } else if (elem.AccDecOUT != null && !isNaN(parseFloat(elem.AccDecOUT))) {
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
                                        if (itr == 0 && elem.AccDecOUT != null && !isNaN(parseFloat(elem.AccDecOUT))) {
                                            str = str + " class='bestPriceStyle'";
                                        }
                                        str = str + ">" + elem.PP_CODE + "</td>";
                                    }
                                }
                                $(thisTileAQ).find('[id^="AQDQBanksRow"]').append(str);
                            } else {
                                str = str + "<td>--</td>";
                                $(thisTileAQ).find('[id^="AQDQBanksRow"]').append(str);
                            }
                            if (elem.AccDecOUT != null && !isNaN(parseFloat(elem.AccDecOUT))) {
                                // Added by Atharva - EQC Timers
                                // Added new if condition
                                if (isNonBestPrice) {
                                    if ($(thisTileAQ).find('[id^="hdnSelectedBank"]').val() == elem.PP_CODE) {
                                        str2 = str2 + "<td class='priceBackground";
                                        // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                        if(parseFloat(elem.AccDecOUT).toFixed(2) < 0){

                                            if (itr == 0) {
                                                str2 = str2 + " negativeprice";
                                            }

                                        }else{

                                            if (itr == 0) {
                                            str2 = str2 + " bestPriceStyle";
                                            }

                                        }
                                       // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                        str2 = str2 + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.AccDecOUT).toFixed(2) + " % </button></td>";
                                        $(thisTileAQ).find('[id^="AQDQPrices"]').append(str2);
                                    } else {
                                        str2 = str2 + "<td";
                                        // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                        if(parseFloat(elem.AccDecOUT).toFixed(2) < 0){

                                            if (itr == 0) {
                                                str2 = str2 + " class='negativeprice_nonbest'";
                                            }
                                            // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                            str2 = str2 + "><button type='button' class='priceButton negativeprice_nonbest' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.AccDecOUT).toFixed(2) + " %</button></td>";
                                            $(thisTileAQ).find('[id^="AQDQPrices"]').append(str2);

                                        }else{

                                            if (itr == 0) {
                                                str2 = str2 + " class='bestPriceStyle'";

                                            }    
                                            // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                            str2 = str2 + "><button type='button' class='priceButton ' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.AccDecOUT).toFixed(2) + " %</button></td>";
                                            $(thisTileAQ).find('[id^="AQDQPrices"]').append(str2);
                                        }                                        
                                    }
                                } else {
                                    str2 = str2 + "<td";
                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                    if(parseFloat(elem.AccDecOUT).toFixed(2) < 0){

                                        if (itr == 0) {
                                            str2 = str2 + " class='negativeprice'";
                                        }

                                    }else{

                                        if (itr == 0) {
                                            str2 = str2 + " class='bestPriceStyle'";
                                        }

                                    }             
                                    // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023                       
                                    str2 = str2 + ">" + parseFloat(elem.AccDecOUT).toFixed(2) + " %</td>";
                                    $(thisTileAQ).find('[id^="AQDQPrices"]').append(str2);
                                }
                            } else {
                                str2 = str2 + "<td>-</td>";
                                $(thisTileAQ).find('[id^="AQDQPrices"]').append(str2);
                            }
                           
                            itr++;

                            let strMinMaxNotionalLimit = '';

                            if (elem.PP_CODE != null) {
                                strMinMaxNotionalLimit = strMinMaxNotionalLimit + `<td style='font-size:12px !important;'>${K_M_B_Formatter(Number(elem.MinNotional))} / ${K_M_B_Formatter(Number(elem.MaxNotional))}</td>`;
                                $(thisTileAQ).find('[id^="minMaxNotionalLimitRow"]').append(strMinMaxNotionalLimit);
                            }

                        } catch (err) {} finally {}
                    });
                    // Added by Atharva - EQC Timers - START
                    // Should run only once
                    // if (!isTimerStarted["td" + repriceObject.CurrentTileID]) {
                    //     isTimerStarted["td" + repriceObject.CurrentTileID] = true;
                    //     startTimersEQC(repriceObject.CurrentTileID);
                    // }
                    // END

    
                }
            }
            ).catch((error)=>{
                console.log(error);
                $(thisTileAQ).find('[id^="btnBestPriceAQDQ"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
                $(thisTileAQ).find('[id^="btnEmailQuote"]').attr("disabled", true);
                $(thisTileAQ).find('[id^="btnBookTradeAQDQ"]').attr("disabled", true);
                $(thisTileAQ).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
                clearInterval(uniqueIntervalID.value);
                mapleLoaderStop(thisTileAQ,'[id^="btnBestPriceAQDQ"]', false);
                uniqueIntervalID.value = "";
                $(thisTileAQ).find('[id^="OverlayDiv"]').hide();

                if (finalObjAQDQ != null || finalObjAQDQ != undefined) {
                    drawgraphAQDQ($(thisTileAQ).find('[id^="canvas"]').attr("id"));
                }
            }
            );
            // Added by Atharva - EQC Timers - START
            // Should run only once
            // if (!isTimerStarted["td" + repriceObject.CurrentTileID]) {
            //     isTimerStarted["td" + repriceObject.CurrentTileID] = true;
            //     startTimersEQC(repriceObject.CurrentTileID);
            // }
            // END
        }
    } catch (error) {

        $(thisTileAQ).find('[id^="btnBestPriceAQDQ"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        $(thisTileAQ).find('[id^="btnEmailQuote"]').attr("disabled", true);
        $(thisTileAQ).find('[id^="btnBookTradeAQDQ"]').attr("disabled", true);
        $(thisTileAQ).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
        sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        clearInterval(uniqueIntervalID.value);
        mapleLoaderStop(thisTileAQ,'[id^="btnBestPriceAQDQ"]', false);
        uniqueIntervalID.value = "";
        $(thisTileAQ).find('[id^="OverlayDiv"]').hide();
        $(thisTileAQ).find('[id^="btnBookTradeAQDQ"]').attr("disabled", false);

        console.log("getFinalQuoteResponseAQDQ : " + error.message);

        // $(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val(JSON.stringify(finalObjAQDQ));
        // if (finalObjAQDQ != null || finalObjAQDQ != undefined) {
        //     drawgraphAQDQ($(thisTileAQ).find('[id^="canvas"]').attr("id")); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        // }
        // sessionStorage.setItem("quoteToken_" + thisTileAQ.id.match(/\d+$/)[0], repriceObject["token"]);
        // sessionStorage.setItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]));
          //// INT1FIN47-768 Gateway Markets Instant Pricing issue

    } finally {
    }
}

// To book trade for AQDQ
function booktradeAQDQ(that, suitabilityCheck,redirectOrder) { // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
    try {

        // startLoader();

        TileId = that.id.match(/\d+$/)[0];
        thisTileAQ = document.getElementById("td" + TileId);
        sessionStorage.setItem("pricingToggle" + TileId, true);
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
            $(thisTileAQ).find('[id^="AQDQBanksRow"]').children().each(function() {
                if ($(thisTileAQ).find('[id^="hdnSelectedBank"]').val() == $(this).find("button").html()) {
                    selectedBankIndex = itr;
                }
                itr++;
            });
        } else {
            selectedBankIndex = 0;
        }
        console.assert(selectedBankIndex != -1);
        if (selectedBankIndex == -1) {
            // endLoader();
            mapleOrderLoaderStop(thisTileAQ);
            return false;
        }
        // END


        let AllocationDetails=[];

        $(thisTileAQ).find("select.ChildrenddlBookingCenter").each(function(index, element){

            if ($(this).parent().prev().find(".childrenCheckBoxBooking")[0].checked) {

            AllocationDetails.push({

            "RMName": $(element).parent().parent().find('[id^="ddlRMName"]').val(),
            "CustBranch": element.value,
            "Notional":$(element).parent().parent().find('[id^="txtHeaderNotional"]').val().split('.')[0].replace(/\,/g, "")

            })
        }
        
    })
       
        var Obj = JSON.parse($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val());
        var token1 = $(thisTileAQ).find('[id^="hdnfinalTokenAQDQ"]').val();
        // Added by Atharva - EQC Timers
        // Replaced 0 with selectedBankIndex
        var quoteid = Obj[selectedBankIndex].EP_ER_QuoteRequestId;
        var clientPriceAQDQ = Obj[selectedBankIndex].AccDecOUT;
        let ClientYield = Obj[selectedBankIndex].ClientYield;
        // END

        let limitPrice1 = "";
        let limitPrice2 = "";
        let limitPrice3 = "";
        let limitPrice4 = "";

        if($(thisTileAQ).find('[id^="ddlOrderTypeAQDQ"]').val().trim().toUpperCase() == "LIMIT"){

            if($(thisTileAQ).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 0){

                limitPrice1 = $(thisTileAQ).find('[id^="txtLimitLevel"]').val().trim();

            }else if($(thisTileAQ).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 1){

                 limitPrice2 = $(thisTileAQ).find('[id^="txtLimitLevel"]').val().trim();

            } else if($(thisTileAQ).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 2){

                 limitPrice3 = $(thisTileAQ).find('[id^="txtLimitLevel"]').val().trim();
                 
            } else if($(thisTileAQ).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 3){

                limitPrice4 = $(thisTileAQ).find('[id^="txtLimitLevel"]').val().trim();
                
            }            
        }


        //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

           let _confirmReason = "";

           if(selectedBankIndex>0){

                if($(thisTileAQ).find('[id^="ddlNONBEST"]').val() != "NONBEST_CUSTOM"){

                    _confirmReason = $(thisTileAQ).find('[id^="ddlNONBEST"]').text();
        
                }else{
        
                    _confirmReason =  $(thisTileAQ).find('[id^="txtNONBEST"]').val(); 
                    
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
                 if ($(thisTileAQ).find('[id^="rbRowSuitabilityToggle"]')[0].checked) {
                    _chkSuitability = "NO";
                    if ($(thisTileAQ).find('[id^="ddlReason"]').val().trim().includes("SUTSKP_CUSTOM")) { // Added by RizwanS | JIRA-LGTGTWINT-1830
                        _reasonmsg = $(thisTileAQ).find('[id^="txtSpecifyReason"]').val();
                    }else{
                        _reasonmsg = $(thisTileAQ).find('[id^="ddlReason"]').val();
                    }
                 }else{
                    _chkSuitability = "YES"; //RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                 }
                //End
               
            }

        // Solve for Upfront response changes | Ref: LGTGTWINT-580 | Chaitanya| 16-Jan-2023
        // let _Upfrontvalue = "";

        // if($(thisTileAQ).find('[id^="solveForAQDQ"]').val().trim().split("(")[0].trim().toUpperCase() === "UPFRONT"){

        //     _Upfrontvalue = 0;

        // }else{

        //     _Upfrontvalue = Number($(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').val());
        // }

        // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
        let orderMethodName = "";
        let bookObject = "";

        if(redirectOrder == true){

            orderMethodName = "redirectOrder";

            bookObject= {          

               EntityID: sessionStorage.getItem("EQC_EntityID").toString(),
               orderQty:$(thisTileAQ).find('[id^="txtHeaderNotional"]').val().split('.')[0].replace(/\,/g, ""),
               type:$(thisTileAQ).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
               limitPrice1: limitPrice1,
               limitPrice2: limitPrice2,
               limitPrice3: limitPrice3,
               limitPrice4: limitPrice4,
               QuoteRequestId: quoteid,
               loginUser: sessionStorage.getItem("EQC_UserName").toString(),
               margin: Number($(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').val()), //LGTGTWINT-1220 Instant Pricing: ACCU and DECU: Upfront is blank in Order History and Order Details for order placed through Instant Pricing
               clientPrice:clientPriceAQDQ,
               yield: "",
               bookingBranch: $(thisTileAQ).find('[id^="ddlBookingBranch"]').val(),
               rmNameForOrderConfirmation: $(thisTileAQ).find('[id^="ddlRMName"]').val(),
               dealerNotificationEmailID: $(thisTileAQ).find('[id^="txtComment"]').val(),
               orderComment: $(thisTileAQ).find('[id^="txtComment"]').val(),
               confirmationReason: _confirmReason,
               advisoryReason: $(thisTileAQ).find('[id^="txtComment"]').val(),
               preTradeXml: preTradeXml,
               //chkSuitability:$(thisTileAQ).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
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
            "orderQuantity":$(thisTileAQ).find('[id^="txtHeaderNotional"]').val().split('.')[0].replace(/\,/g, ""),
            "OrderType": $(thisTileAQ).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
            "LimitPrice1": limitPrice1,
            "LimitPrice2": limitPrice2,
            "LimitPrice3": limitPrice3,
            "LimitPrice4": limitPrice4,
            "QuoteRequestId": quoteid,
            "PoolID": "",
            "RedirectOrderID": "",
            "OrderComment": $(thisTileAQ).find('[id^="txtComment"]').val(),
            "Margin": Number($(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').val()), //LGTGTWINT-1220 Instant Pricing: ACCU and DECU: Upfront is blank in Order History and Order Details for order placed through Instant Pricing
            "Notional": $(thisTileAQ).find('[id^="txtHeaderNotional"]').val().split('.')[0].replace(/\,/g, ""),
            "ClientPrice": clientPriceAQDQ,
            "ClientYield": "",
            "BookingBranch":  $(thisTileAQ).find('[id^="ddlBookingBranch"]').val(),
            "RMNameforOrderConfirm": $(thisTileAQ).find('[id^="ddlRMName"]').val(),
            "RMEmailIdforOrderConfirm": "",
            "ConfirmReason": _confirmReason, //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message
            "PreTradeXml": "",
            "AdvisoryReason": "",
            // "UserRole": _reasonmsg, // Added Chaitanya M | For checking the suitability reason | Ref:LGTGTWINT-603 | 12-Jan-2023
            "CustomerID": "",
            // "chkSuitability":$(thisTileAQ).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
            "chkSuitability":_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
            "SuitabilityReason": _reasonmsg, // Added by RizwanS | JIRA-LGTGTWINT-1830
            "IntendedSpread": "",
            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
            "CurrentTileID": TileId,
            "AllocationDetails": AllocationDetails,
            "UserRole" : isEQCDealer === true ? 'Dealer' : isIA=== true ? 'IA' : 'RM' , // Added by RizwanS | JIRA-LGTGTWINT-1830
            
            }

        }

        mapleOrderLoaderStart(thisTileAQ);

        request_getDataFromAPI(bookObject, clientConfigdata.CommonMethods.NodeServer + orderMethodName).then(bookObject => {

            // endLoader();

            thisTileAQ = document.getElementById("td" + bookObject.CurrentTileID);

            TileId = bookObject.CurrentTileID;

            let bookstring = bookObject['responseData']; // LGTGTWINT-1888 || RizwanS || 30 May 2023
            
            let OrderStatus = bookObject['message']; // LGTGTWINT-1888 || RizwanS || 30 May 2023

            if (OrderStatus.toUpperCase() === clientConfigdata.EQCCommonMethods.EQC_BOOK_TRADE_RESPONSE_DETAILS.toUpperCase()) {
                
                // $(thisTileAQ).find('[id^="hdnBlotterURLAQDQ"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                // $(thisTileAQ).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradeAQDQ" + TileId, bookstring, "DivOverlayAQDQ");
                $(thisTileAQ).find('[id^="hdnfinalTokenAQDQ"]').val("");
                $(thisTileAQ).find('[id^="OverlayDiv"]').hide();
                clearPricerTable(thisTileAQ);

            } else {

                if(OrderStatus == "" || OrderStatus == null || OrderStatus==undefined){

                    OrderStatus = "Order Execution Failed!";

                }

                booktradePopup(that, "booktradeAQDQ" + TileId, OrderStatus, "DivOverlayAQDQ");
                $(thisTileAQ).find('[id^="hdnfinalTokenAQDQ"]').val("");
                $(thisTileAQ).find('[id^="OverlayDiv"]').hide();
                clearPricerTable(thisTileAQ);
            }

            mapleOrderLoaderStop(thisTileAQ);
            sessionStorage.removeItem("quoteResponse_" + thisTileAQ.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileAQ).find('[id^="btnBestPriceAQDQ"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileAQ).find('[id^="hdnintervalID"]').val());
            mapleLoaderStop(thisTileAQ,'[id^="btnBestPriceAQDQ"]', false);
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
            $(thisTileAQ).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileAQ).find('[id^="btnBookTradeAQDQ"]').attr("disabled", true);
            $(thisTileAQ).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023
            // Added by Atharva - EQC Timers - START
            $(thisTileAQ).find('[id^="AQDQPrices"]').children().each(function() {
                $(this).find("button").attr("disabled", true);
            });
            $(thisTileAQ).find('[id^="AQDQBanksRow"]').children().each(function() {
                $(this).find("button").attr("disabled", true);
            });

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileAQ).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileAQ).find('[id^="RFQIDEQC"]').html("");
            //End
 
            // END
        }
        ).catch((error)=>{
            console.log(error);
        }
        );
    } catch (er) {
        console.log(er.message);
        booktradePopup(that, "booktradeAQDQ" + TileId, "Please Best Strike Before Book Trade, Order Execution Failed!", "DivOverlayAQDQ");
        $(thisTileAQ).find('[id^="OverlayDiv"]').hide();
        // endLoader();
        mapleOrderLoaderStop(thisTileAQ);
    } finally {}
}

var dialogBoxAQDQ = null;
function emailQuoteAQDQ(that) {
    try {
        thisTileAQDQ = $(that).parents(".sorting")[0];

        let pricingRow = "";
        pricingRow = $(thisTileAQDQ).find("table.pricerTable .pricesRow")[0];
        mapleOrderLoaderStart(thisTileAQDQ); //LGTGTWINT-1866 | Chaitanya M | 13 April 2023

        if (pricingRow.cells[0].innerText.trim().toString() === "-") {
            openValidationpopup('',"No price available for mailing!"); // Changed for Change quote mail validation from "Invalid Price" to "No price available for mailing!" | Ref: LGTGTWINT-1195 | Chaitanya M | 25-jan-2023
            return false;
        }

        //create email pop up here
        let strEmail = ``;
        let emailPriceStream = JSON.parse($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val());
        console.log("email price stream object ", emailPriceStream);

        strEmail = strEmail + `<table class='emailTable'><tr><td class='payOff_Features'>
        <input type='checkbox' class='chkBoxParent_Email_PPCode' onchange='emailParentCheckboxChanged(this)' >Issuer</td><td class='payOff_Features'>${globalSolveForValueAQDQ}</td></tr>`; // added a class for CSS issue on email popup.| Chaitanya M | 14 March 2023
        for (let e of emailPriceStream) {
            if (e.AccDecOUT.trim().toUpperCase() !== "REJECTED" && e.AccDecOUT.trim().toUpperCase() !== "" && e.AccDecOUT.trim().toUpperCase() !== "UNSUPPORTED") { // Changed the condition for handling Unsupported response | Ref: LGTGTWINT-1321 | Chaitanya M | 06 Feb 2023
                strEmail = strEmail + `<tr><td style='width:40px;padding:15px'><input type='checkbox' class='chkBox_Email_PPCode'  onchange='emailChildrenCheckboxChanged(this)' > ${e.PP_CODE}</td><td style='width:40px;padding:15px'>${e.AccDecOUT}</td></tr>`;
            } else {// do nothing
            }
        }
        strEmail = strEmail + `</table>`;

        // Added by Atharva - EQC Timers - START
        var selectedBankIndex = -1;
        var itr = 0;
        //End
        if (dialogBoxAQDQ === null) {
            dialogBoxAQDQ = $(thisTileAQDQ).find('[id^="emailDialog_AQDQ"]')[0];
            $(thisTileAQDQ).find('[id^="emailDialog_AQDQ"]').empty().append(strEmail);
            $(dialogBoxAQDQ).dialog({
                resizable: false,
                height: "auto",
                width: 320,
                modal: true,
                open: function (event, ui) { // Added for LGTGTWINT-1283 || Email popup on top change | Chaitanya M | 08 Feb 2023
                    $('.ui-widget.ui-widget-content').css('z-index',999);                    
                },  
                //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                close: function (event, ui){
                    mapleOrderLoaderStop(thisTileAQDQ); //LGTGTWINT-1866 | Chaitanya M | 13 April 2023
                },
                //End
                buttons: {
                    "Mail Quote": function() {
                        //mail single selected rfq

                        //$(this).dialog("close"); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023

                        var Email_PPList = [];
                        var RFQIDList=[];
                        var __mailRFQ =[];

                        if ($(document).find(".ui-dialog").find('[id^="emailDialog_AQDQ"]').find(".chkBox_Email_PPCode").length > 0) {
                            $(document).find(".ui-dialog").find('[id^="emailDialog_AQDQ"]').find(".chkBox_Email_PPCode").each(function(chkIndex, checkboxControl) {
                                if (checkboxControl.checked) {
                                    Email_PPList.push($(checkboxControl).parent().text().trim());

                                     RFQIDList.push(JSON.parse($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val()).filter(function(RFQ_OBJECT){
                                        return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                                    })
                                    )
                                }
                            });
                        }
                        if (Email_PPList.length > 0) {
                            console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);
                            //  return true; 
                            for(let R of RFQIDList){
                                __mailRFQ.push(R[0].EP_ER_QuoteRequestId);
                            }
                        }

                        if ($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val() != undefined && $(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val().trim() != "")
                            var RFQID = JSON.parse($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

                        if (RFQID != undefined && RFQID != "") {
                            //     MailBestQuote(thisTileAQDQ.id.match(/\d+$/)[0], JSON.parse($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val())[0].EP_ER_QuoteRequestId);
                           
                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileAQDQ, "booktradeAQDQ" + thisTileAQDQ.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayAQDQ");
                                openValidationpopup('','No price selected for mailing !');
                                //End

                                return false;
                            }
                            $(this).dialog("close"); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileAQDQ);//LGTGTWINT-1866 | Chaitanya M | 13 April 2023
                            request_getDataFromAPI({
                                userName: sessionStorage.getItem("FinIQUserID").toString(),
                                rfqId: __mailRFQ.toString(),
                                CurrentTileID: thisTileAQDQ.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType:"English"

                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then((data)=>{
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileAQDQ = document.getElementById("td" + TileId);
                                mapleOrderLoaderStop(thisTileAQDQ); //LGTGTWINT-1866 | Chaitanya M | 13 April 2023
                                booktradePopup(thisTileAQDQ, "booktradeAQDQ" + TileId, data.message, "DivOverlayAQDQ");
                            }
                            ).catch((error)=>{
                                console.log(error);
                            }
                            );
                        } else {
                            openValidationpopup('',"Invalid RFQ ID ");
                            mapleOrderLoaderStop(thisTileAQDQ); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                        }
                           
                    },
                    "Mail All Quotes": function() {
                        //$(this).dialog("close"); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023

                        var Email_PPList = [];
                        var RFQIDList=[];
                        var __mailRFQ =[];
                        mapleOrderLoaderStart(thisTileAQDQ); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023

                        if ($(document).find(".ui-dialog").find('[id^="emailDialog_AQDQ"]').find(".chkBox_Email_PPCode").length > 0) {
                            $(document).find(".ui-dialog").find('[id^="emailDialog_AQDQ"]').find(".chkBox_Email_PPCode").each(function(chkIndex, checkboxControl) {
                              //  if (checkboxControl.checked) {
                                Email_PPList.push($(checkboxControl).parent().text().trim());

                                     RFQIDList.push(JSON.parse($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val()).filter(function(RFQ_OBJECT){
                                        return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                                        })
                                        )

                           //     }
                            });
                        }
                        if (Email_PPList.length > 0) {
                            console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);

                            //  return true; 
                            for(let R of RFQIDList){
                            __mailRFQ.push(R[0].EP_ER_QuoteRequestId);

                            }
                        }

                        if ($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val() != undefined && $(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val().trim() != "")
                            var RFQID = JSON.parse($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

                        if (RFQID != undefined && RFQID != "") {
                            //     MailBestQuote(thisTileAQDQ.id.match(/\d+$/)[0], JSON.parse($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val())[0].EP_ER_QuoteRequestId);
                            if(__mailRFQ == ""){
                                // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                                //booktradePopup(thisTileAQDQ, "booktradeAQDQ" + thisTileAQDQ.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayAQDQ");
                                mapleOrderLoaderStop(thisTileAQDQ); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                openValidationpopup('','No price selected for mailing !');
                                //End
                                return false;
                            }
                            mapleOrderLoaderStop(thisTileAQDQ); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            $(this).dialog("close"); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            mapleOrderLoaderStart(thisTileAQDQ);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023

                            request_getDataFromAPI({
                                userName: sessionStorage.getItem("FinIQUserID").toString(),
                                rfqId: __mailRFQ.toString(),
                                CurrentTileID: thisTileAQDQ.id.match(/\d+$/)[0],
                                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                                QuoteMailType:"English"

                            }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then((data)=>{
                                console.log(data);
                                TileId = data.CurrentTileID;
                                thisTileAQDQ = document.getElementById("td" + TileId);
                                mapleOrderLoaderStop(thisTileAQDQ); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                                booktradePopup(thisTileAQDQ, "booktradeAQDQ" + TileId, data.message, "DivOverlayAQDQ");
                            }
                            ).catch((error)=>{
                                console.log(error);
                            }
                            );
                        } else {
                            mapleOrderLoaderStop(thisTileAQ); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('',"Invalid RFQ ID ");
                            }

                        return true;

                        //email all quotes here
                    },
                },
            });
            $(dialogBoxAQDQ).dialog("open");
        } else {

            $(document).find(".ui-dialog").find('[id^="emailDialog_AQDQ"]').empty().append(strEmail);
            $(dialogBoxAQDQ).dialog("open");

            var Email_PPList = [];
            var RFQIDList=[];
            var __mailRFQ =[];

            if ($(document).find(".ui-dialog").find('[id^="emailDialog_AQDQ"]').find(".chkBox_Email_PPCode").length > 0) {
                $(document).find(".ui-dialog").find('[id^="emailDialog_AQDQ"]').find(".chkBox_Email_PPCode").each(function(chkIndex, checkboxControl) {
                    if (checkboxControl.checked) {
                        Email_PPList.push($(checkboxControl).parent().text().trim());

                         RFQIDList.push(JSON.parse($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val()).filter(function(RFQ_OBJECT){
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
              //  return true;
            }

            if ($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val() != undefined && $(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val().trim() != "")
                var RFQID = JSON.parse($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

            if (RFQID != undefined && RFQID != "") {
                //     MailBestQuote(thisTileAQDQ.id.match(/\d+$/)[0], JSON.parse($(thisTileAQDQ).find('[id^="hdnChartPricesAQDQ"]').val())[0].EP_ER_QuoteRequestId);
                if(__mailRFQ == ""){
                    // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    //booktradePopup(thisTileAQDQ, "booktradeAQDQ" + thisTileAQDQ.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayAQDQ");
                    mapleOrderLoaderStop(thisTileAQ); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    openValidationpopup('','No price selected for mailing !');
                    //End

                    return false;
                }

                request_getDataFromAPI({
                    userName: sessionStorage.getItem("FinIQUserID").toString(),
                    rfqId: __mailRFQ.toString(),
                    CurrentTileID: thisTileAQDQ.id.match(/\d+$/)[0],
                    "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                    QuoteMailType:"English"
                }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then((data)=>{
                    console.log(data);
                    TileId = data.CurrentTileID;
                    thisTileAQDQ = document.getElementById("td" + TileId);
                    mapleOrderLoaderStop(thisTileAQ); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    booktradePopup(thisTileAQDQ, "booktradeAQDQ" + TileId, data.message, "DivOverlayAQDQ");
                }
                ).catch((error)=>{
                    console.log(error);
                }
                );
            } else{
                mapleOrderLoaderStop(thisTileAQ); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                openValidationpopup('',"Invalid RFQ ID ");       
                }         
          
        }
        $(thisTileAQDQ).find('[id^="AQDQBanksRow"]').children().each(function() {
            if ($(thisTileAQDQ).find('[id^="hdnSelectedBank"]').val() == $(this).find("button").html()) {
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

function validateOrderAQDQ(thisTileAQ,_flag){    // LGTGTWINT-1279 : Instant Pricing : Order booking valdations.

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
            $(thisTileAQ).find('[id^="AQDQBanksRow"]').children().each(function() {
                if ($(thisTileAQ).find('[id^="hdnSelectedBank"]').val() == $(this).find("button").html()) {
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

       
        if ($(thisTileAQ).find('[id^="hdnfinalTokenAQDQ"]').val() == "" || $(thisTileAQ).find('[id^="AQDQPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileAQ).find('[id^="AQDQPrices"]')[0].firstChild.innerHTML == "") {
            if(_flag == false){
                _validateOrderEQC = true; 
            }
           ValidateField($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').attr("id"), "Order Execution Failed!", thisTileAQ);
           return false;
        }

        if (parseFloat(JSON.parse($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').val())[selectedBankIndex].AccDecOUT) <= 0) {
            if(_flag == false){

                _validateOrderEQC = true; 
            }
            ValidateField($(thisTileAQ).find('[id^="hdnChartPricesAQDQ"]').attr("id"), "Prices can not be negative 0r zero, Order Execution Failed!", thisTileAQ);
            return false;
        }

    }catch(er){

        console.log(er.message);
    }
}

// Chaitanya M 16-March-2023 || Added for LGTGTWINT-1721 || Changing 'Solve for' shouldn't reset other parameters to the default value.
function changeSolveForAQDQ(thisTileAQ, strSolveForAQDQ, calledFromIndexAQDQ) {
  
    try {
        if (calledFromIndexAQDQ != undefined) {
            if (strSolveForAQDQ.trim().toUpperCase() === "STRIKE") {
                $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').prop("disabled", true);
                $(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').prop("disabled", false);
            } else if (strSolveForAQDQ.trim().toUpperCase() === "UPFRONT") {
                if ($(thisTileAQ).find('[id^="Type"]').val().trim().toUpperCase() === "AQ") {
                    $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').prop("disabled", false);
                } else {
                    $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').prop("disabled", false);
                }
                $(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').prop("disabled", true);
            }
        } else {
            if (strSolveForAQDQ.trim().toUpperCase() === "STRIKE") {
                $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').prop("disabled", true);
                $(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').prop("disabled", false);
            } else if (strSolveForAQDQ.trim().toUpperCase() === "UPFRONT") {
                if ($(thisTileAQ).find('[id^="Type"]').val().trim().toUpperCase() === "AQ") {
                    $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').prop("disabled", false);
                } else {
                    $(thisTileAQ).find('[id^="strikeipboxAQDQ"]').prop("disabled", false);
                }
                $(thisTileAQ).find('[id^="txtUpfrontAQDQ"]').prop("disabled", true);
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

