$.support.cors = true;
var idOptions = 20;

function onLoadOptions(currId,isProductCopiedOption) // To load Options
{
    try {

        setDeafaultValuesOptions(currId);
        thisTileOptions = document.getElementById("td" + currId);
        $(thisTileOptions).find('[id^="OverlayDiv"]').hide();

        sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        $(thisTileOptions).find('[id^="btnBestPriceOptions"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue
        mapleLoaderStop(thisTileOptions,'[id^="btnBestPriceOptions"]', false);
       $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
        clearPricerTable(thisTileOptions);

         //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
         $(thisTileOptions).find('[id^="RFQIDEQC"]').html("");
         //End
    
        callDropDownFunction($(thisTileOptions).find('[id^="OptionsSharesDemo"]').attr("id"), "Option", currId);
        EQProductsFillCcy(thisTileOptions, "ddlCurrencySettlement");
        

        $(thisTileOptions).find("div.card input[type='text'],div.card input[type='search'],div.card select").on('change', function () {

            thisTileOptions = $(this).parents('.sorting')[0];
            sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileOptions).find('[id^="btnBestPriceOptions"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval($(thisTileOptions).find('[id^="hdnintervalID"]').val());
           $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            clearPricerTable(thisTileOptions);
            mapleLoaderStop(thisTileOptions,'[id^="btnBestPriceOptions"]', false);

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileOptions).find('[id^="RFQIDEQC"]').html("");
            //End

            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
            $(thisTileOptions).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileOptions).find('[id^="btnBookTradeOptions"]').attr("disabled", true);           
            $(thisTileOptions).find('[id^="OrderEmail"]').attr("disabled",true);  //LGTGTWINT-1981 || RizwanS || 12 May 2023  
            
         })
 
         $(thisTileOptions).find(" div.card .amtPopup").on('select', function () { // INT1FIN47-768 Gateway Markets Instant Pricing issue
 
             thisTileOptions = $(this).parents('.sorting')[0];
             sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
             $(thisTileOptions).find('[id^="btnBestPriceOptions"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
             clearInterval($(thisTileOptions).find('[id^="hdnintervalID"]').val());
            $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
             clearPricerTable(thisTileOptions);

              //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
            $(thisTileOptions).find('[id^="RFQIDEQC"]').html("");
            //End
            
             mapleLoaderStop(thisTileOptions,'[id^="btnBestPriceOptions"]', false);
             // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
             $(thisTileOptions).find('[id^="btnEmailQuote"]').attr("disabled", true);
             $(thisTileOptions).find('[id^="btnBookTradeOptions"]').attr("disabled", true); 
             $(thisTileOptions).find('[id^="OrderEmail"]').attr("disabled",true);  //LGTGTWINT-1981 || RizwanS || 12 May 2023           
             
          })
        //aded by rutika on 26/04/2022 for calculating tenor when changed in input box
         //Start

          $(thisTileOptions).find('[id^="tenor_Options"]').on("change", function() {
            try {
             
                thisTileOptions = $(this).parents(".sorting")[0];
                let currId=   thisTileOptions.id.match(/\d+$/)[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileOptions,"btnBestPriceOptions");
               $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val("");
               //End
               //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
               // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').hide(); 
                $(thisTileOptions).find('[id^="RFQIDEQC"]').html("");
               //End
            
                if( $(thisTileOptions).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_Options"]').val()) > Number(EQOAllowedTenorinMonths) || $(this).parents(".sorting").find('[id^="tenor_Options"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_Options"]').val() ==""){
                        ValidateField($(thisTileOptions).find('[id^="tenor_Options"]').attr("id"), "Please enter valid tenor.", thisTileOptions);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_Options"]').val()) > Number(EQOAllowedTenorinYears) || $(this).parents(".sorting").find('[id^="tenor_Options"]').val() <=0 || $(this).parents(".sorting").find('[id^="tenor_Options"]').val() ==""){
                        ValidateField($(thisTileOptions).find('[id^="tenor_Options"]').attr("id"), "Please enter valid tenor.", thisTileOptions);
                        return false;
                    }
                }

                loadEQOTenorValues(thisTileOptions);
                

            } catch (error) {
                console.log(error);
            }
        });

        $(thisTileOptions).find('[id^="tenorddl"]').on("change", function () {
            try {
                
                thisTileOptions = $(this).parents(".sorting")[0];
                let currId=   thisTileOptions.id.match(/\d+$/)[0];
                //// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileOptions,"btnBestPriceOptions");
               $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val("");
               //End
               
              //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
               // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').hide(); 
                $(thisTileOptions).find('[id^="RFQIDEQC"]').html("");
               //End

                if( $(thisTileOptions).find('[id^="tenorddl"]').val() == "M"){

                    if(Number($(this).parents(".sorting").find('[id^="tenor_Options"]').val()) > Number(EQOAllowedTenorinMonths)){
                        ValidateField($(thisTileOptions).find('[id^="tenor_Options"]').attr("id"), "Please enter valid tenor.", thisTileOptions);
                        return false;
                    }
    
                } else{
    
                     if(Number($(this).parents(".sorting").find('[id^="tenor_Options"]').val()) > Number(EQOAllowedTenorinYears)){
                        ValidateField($(thisTileOptions).find('[id^="tenor_Options"]').attr("id"), "Please enter valid tenor.", thisTileOptions);
                        return false;
                    }
                }
    
                loadEQOTenorValues(thisTileOptions);
               
            } catch (error) {
                console.log(error);
            }
        });


        //End

        let data = EQCShareNameObj.filter(function (item) {
            return item['Code'] == $(thisTileOptions).find('[id^="OptionsSharesDemo"]').val().trim();
        });
        if ($(thisTileOptions).find("select.ddlEQNoteCcy") != undefined) {
            $(thisTileOptions).find("select.ddlEQNoteCcy").val(data[0]["Ccy"]);
            $(thisTileOptions).find("select.ddlEQNoteCcy").prop("disabled", true);
        }
        $(thisTileOptions).find('[id^="loaderOptions"]').hide();

        $(thisTileOptions).find('[id^="solveForOptions"]').on('change', function () {
            thisTileOptions = $(this).parents(".sorting")[0];
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileOptions,"btnBestPriceOptions");
           $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val("");
           //End
            checkSolveForOptions($(this).val(), thisTileOptions);

        })
        // LGTGTWINT-2170 || RizwanS || 22 Jun 2023
        
        // $(thisTileOptions).find('[id^="ddlSettlement"]').on('change', function () {
        //     thisTileOptions = $(this).parents(".sorting")[0];
        //     // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
        //     sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]);
        //     EQCResetPayoff(thisTileOptions,"btnBestPriceOptions");
        //    $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val("");
        //    //End

        //     if ($(thisTileOptions).find('[id^="ddlSettlement"]').val().trim().toUpperCase() == "CASH") {
        //         // Options_FillCcy(thisTileOptions);
        //         let data = EQCShareNameObj.filter(function (item) {

        //             return item['Code'] == $(thisTileOptions).find('[id^="OptionsSharesDemo"]').val().trim();
        //         });
        //         if ($(thisTileOptions).find("select.ddlEQNoteCcy") != undefined) {
        //             $(thisTileOptions).find("select.ddlEQNoteCcy").val(data[0]["Ccy"]);

        //         }

        //         $(thisTileOptions).find("select.ddlEQNoteCcy").prop("disabled", true);
        //     } else {

        //         let data = EQCShareNameObj.filter(function (item) {

        //             return item['Code'] == $(thisTileOptions).find('[id^="OptionsSharesDemo"]').val().trim();
        //         });

        //         if ($(thisTileOptions).find("select.ddlEQNoteCcy") != undefined) {

        //             $(thisTileOptions).find("select.ddlEQNoteCcy").val(data[0]["Ccy"]);
        //         }
        //         $(thisTileOptions).find("select.ddlEQNoteCcy").prop("disabled", true);

        //     }
        // })


        // loadEQOTenorValues(thisTileOptions);

        // LGTGTWINT-1638 | Chaitanya M | 21 Jul 2023
        if(!_addtileflag){
            checkSolveForOptions($(thisTileOptions).find('[id^="solveForOptions"]').val(), thisTileOptions);
        }
        //End
       
        $(thisTileOptions).find('[id^="EQOchk"]').on("change", function() {
           
            thisTileOptions = $(this).parents(".sorting");
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileOptions,"btnBestPriceOptions");
           $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val("");
           //End
           
           //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
           // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').hide(); 
           $(thisTileOptions).find('[id^="RFQIDEQC"]').html("");
           //End

            if($(thisTileOptions).find('[id^="EQOchk"]').is(':checked') == true){

                $(thisTileOptions).find("[id^='EQONotioanl']").val("1,000,000.00").prop("disabled", false);
                $(thisTileOptions).find("[id^='NoOfShareipboxOptions']").val("").prop("disabled", true);
                

            }else{

                $(thisTileOptions).find("[id^='EQONotioanl']").val("").prop("disabled", true);
                $(thisTileOptions).find("[id^='NoOfShareipboxOptions']").val("2,000").prop("disabled", false);

            }         
        });


        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        //Start      
        $(thisTileOptions).find('div.card .ddlShares').on("focusout", function (){      
           
            // Added for being Able to price with only share name entered and not selected| Ref:LGTGTWINT-1076, LGTGTWINT-1075 | Chaitanya M | 24-Jan-2023
            //Start
            let checkforshares=""       
            checkforshares = validateshares(thisTileOptions,"OptionsSharesDemo");
            $(thisTileOptions).find('[id^="ExchangenameOptions"]').val(getExchangeAndCcyFromBasket("", "exchange", $(thisTileOptions).find('[id^="OptionsSharesDemo"]').val().trim())[0]); // Added for setting the exchange dynamically in new UI | Ref LGTGTWINT-980 | Chaitanya M | 06 Feb 2023  
            sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileOptions,"btnBestPriceOptions");
           $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val("");// Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
            $(thisTileOptions).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileOptions).find('[id^="btnBookTradeOptions"]').attr("disabled", true);
            $(thisTileOptions).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023 

            if(checkforshares==false){
                //ValidateField($(thisTileOptions).find('[id^="OptionsSharesDemo"]').attr("id"), "Please Enter Valid Shares", thisTileOptions);
                return false;                
            }        
            //End                                  
                
        });

        // Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
        $(thisTileOptions).find("div.card .ddlShares").on("keydown", function(){

            $("#bodyDiv").hide();
            btnprice="btnBestPriceOptions";            
            // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
            sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileOptions,"btnBestPriceOptions");
           $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val("");
           //End
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
            $(thisTileOptions).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileOptions).find('[id^="btnBookTradeOptions"]').attr("disabled", true);  
            $(thisTileOptions).find('[id^="OrderEmail"]').attr("disabled",true);//LGTGTWINT-1981 || RizwanS || 12 May 2023           
             
        }); 

        //Added for LGTGTWINT-1077 Instant Pricing: Input length for all fields for all payoffs | Chaitanya M | 28-01-2023
        $(thisTileOptions).find('[id^="tenor_Options"]').on("keyup", function (){            

             InputLengthCheckEQC(thisTileOptions, "tenor_Options",3);
                       //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
          $(thisTileOptions).find('[id^="RFQIDEQC"]').html("");
          //End
        });

        $(thisTileOptions).find("[id^='strikeipboxOptions']").on("keyup", function(){

             InputLengthCheckEQC(thisTileOptions, "strikeipboxOptions", 8);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
                       //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
          $(thisTileOptions).find('[id^="RFQIDEQC"]').html("");
          //End
        });


        $(thisTileOptions).find('[id^="upfrontOptions"]').on("keyup", function(){

             InputLengthCheckEQC(thisTileOptions, "upfrontOptions", 6,4);//Added for LGTGTWINT-1077 Instant Pricing: Rounding decimals for all input fields | Chaitanya M | 31-01-2023
                       //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
          $(thisTileOptions).find('[id^="RFQIDEQC"]').html("");
          //End
        });
        
        //Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
        $(thisTileOptions).find('[id^="NoOfShareipboxOptions"]').on("change", function(){
        // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
        sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]);
            EQCResetPayoff(thisTileOptions,"btnBestPriceOptions");
           $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val("");
           //End

            if($(thisTileOptions).find('[id^="NoOfShareipboxOptions"]').val() == "" || $(thisTileOptions).find('[id^="NoOfShareipboxOptions"]').val() == null){
                $(thisTileOptions).find('[id^="NoOfShareipboxOptions"]').val("0"); 
            }

        });
        // loadEQOTenorValues(thisTileOptions); // LGTGTWINT-1638 | Chaitanya M | 31 July 2023

        $(thisTileOptions).find('[id^="ExpiryDate_Option"]').on("change", function(){
            try {
                thisTileOptions = $(this).parents(".sorting")[0];
                // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
                sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]);
                EQCResetPayoff(thisTileOptions,"btnBestPriceOptions");
                $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val("");
                //End
                // added for UI changes | Ref: LGTGTWINT-980 | Chaitanya M | 15 Feb 2023
                $(thisTileOptions).find('[id^="btnBookTradeOptions"]').attr("disabled", true);
                $(thisTileOptions).find('[id^="btnEmailQuote"]').attr("disabled", true);
                $(thisTileOptions).find('[id^="OrderEmail"]').attr("disabled",true); //LGTGTWINT-1981 || RizwanS || 12 May 2023 

                let expiry_Date = $(thisTileOptions).find('[id^="ExpiryDate_Option"]').val();
                $(thisTileOptions).find('[id^="Options_ExpiryDate"]').html(reformatDate(expiry_Date)); 


                getExpirydatesOptions(thisTileOptions,reformatDate(expiry_Date),expiry_Date);
                 
                //added for LGTGTWINT-1560 | Chaitanya M | 28 Feb 2023
              
                //end                               

            } catch (error) {
                console.log(error.message);
            }

        });

        //End 

    } catch (error) {
        console.log("onLoadOptions " ,error);
    }
}
function checkSolveForOptions(solveFor, thisTileOptions,calledFromIndexOption) {
    try {
        if (calledFromIndexOption != undefined)
            return false;
        else {

            if (solveFor.trim().toUpperCase() == "PREMIUM") {
                $(thisTileOptions).find("[id^='PremiumOptions']").val("").prop("disabled", true);
                $(thisTileOptions).find("[id^='strikeipboxOptions']").val("100.00").prop("disabled", false);

            } else {
                $(thisTileOptions).find("[id^='PremiumOptions']").val("5.00").prop("disabled", false);
                $(thisTileOptions).find("[id^='strikeipboxOptions']").val("").prop("disabled", true);

            }

        }
       // loadEQOTenorValues(thisTileOptions); // Changed for New UI || LGTGTWINT-980 || Chaitanya M || 06 Feb 2023 | LGTGTWINT-1638 | Chaitanya M | 02 Aug 2023
    } catch (error) {
        console.log(error);
    }
}
function loadEQOTenorValues(thisTileOptions, isTenorFailed) {
    try {

        let tenorNumb = $(thisTileOptions).find("[id^='tenor_Options']").val();
        let tenorstring = $(thisTileOptions).find("[id^='tenorddl']").val();
        let _tenor = tenorNumb + tenorstring;     
   
        let EQOptionsDatesReq ={
            "I_UserID":sessionStorage.getItem("EQC_UserName").toString(),             
            //"I_Entity_Id": sessionStorage.getItem("EQC_EntityID").toString(), // Removed unused filed || LGTGTWINT-2248 || Rizwan S || 25 Jul 2023
            "Tenor": _tenor,
            "Settlement_Days": "2",
            "UnderlyingCode": $(thisTileOptions).find("[id^='OptionsSharesDemo']").val(),
            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
            "CurrentTileID": thisTileOptions.id.match(/\d+$/)[0]
        }

        request_getDataFromAPI(EQOptionsDatesReq, clientConfigdata.CommonMethods.NodeServer + "EQOTenor").then(EQODates => {

            thisTileOptions = document.getElementById("td" + EQODates.CurrentTileID);

            if (EQODates.responseData != null && EQODates.responseData != "") {

                let DatesOptions = (EQODates.responseData)[0]
                $(thisTileOptions).find("[id^='hdnDatesOptions']").val(JSON.stringify(DatesOptions));

                $(thisTileOptions).find("[id^='Options_MaturityDate']").html((reformatDate(DatesOptions['MaturityDate']))); // Changed for New UI || LGTGTWINT-980 || Chaitanya M || 06 Feb 2023
                $(thisTileOptions).find("[id^='Options_ExpiryDate']").html((reformatDate(DatesOptions['FixingDate']))); // Changed for New UI || LGTGTWINT-980 || Chaitanya M || 06 Feb 2023
                $(thisTileOptions).find("[id^='Options_TradeDate']").html((reformatDate(DatesOptions['TradeDate']))); // Changed for New UI || LGTGTWINT-980 || Chaitanya M || 06 Feb 2023
                $(thisTileOptions).find("[id^='Options_SettlDate']").html((reformatDate(DatesOptions['ValueDate']))); // Changed for New UI || LGTGTWINT-980 || Chaitanya M || 06 Feb 2023
                if (isTenorFailed) {
                    $(thisTileOptions).find("[id^='btnBestPriceOptions']").trigger("click");
                }

                GetRequiredDate(thisTileOptions,"ExpiryDate_Option",reformatDate(DatesOptions['FixingDate'])); // LGTGTWINT-1638 | Chaitanya M | 5 July 2023
            } else {
                console.log("Error in loadEQOTenorValues at " + thisTileOptions.id,' resposne ', EQODates);

            }
        })

      //  });

    } catch (error) {
        console.log(error);

    }
}

function setDeafaultValuesOptions(currId) // To set the default values of the tile Options
{
    try {
        thisTileOptions = document.getElementById("td" + currId);
        document.querySelector("#" + ($(thisTileOptions).find('[id^="tenor_Options"]').attr('id'))).selectedIndex = 2;
        $(thisTileOptions).find('[id^="OptionsSharesDemo"]').val(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CODE3); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
        $(thisTileOptions).find('[id^="NoOfShareipboxOptions"]').val("2,000");
        $(thisTileOptions).find('[id^="NoOfShareipboxOptions"]').attr('maxlength','10');
        $(thisTileOptions).find("[id^='EQONotioanl']").attr('maxlength','14');
        $(thisTileOptions).find('[id^="tenor_Options"]').val("6");
        $(thisTileOptions).find('[id^="strikeipboxOptions"]').val("100.00");
        $(thisTileOptions).find('[id^="LeverageipboxOptions"]').val("2");
        $(thisTileOptions).find('[id^="upfrontOptions"]').val("0.50");

        EQCShareNameObj = EQOShareData; // LGTGTWINT-2170 || RizwanS || 22 Jun 2023

        $(thisTileOptions).find('[id^="ExchangenameOptions"]').val(getExchangeAndCcyFromBasket("", "exchange", $(thisTileOptions).find('[id^="OptionsSharesDemo"]').val().trim())[0]); // Added for setting the exchange dynamically in new UI | Ref LGTGTWINT-980 | Chaitanya M | 06 Feb 2023  
       
        clearPricerTable(thisTileOptions);
 
        callautocomplete(thisTileOptions, "OptionsSharesDemo", sessionStorage.getItem(thisTileOptions.id)!=undefined?sessionStorage.getItem(thisTileOptions.id):clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CODE3); // LGTGTWINT-1808 | Instant Pricing | Share suggestion dropdown missing for single underlying products || 31 Mar 2023
      
    } catch (error) {
        console.log(error);
    }
}

var globalSolveForValueOptions='';
function getBestPriceOptions(btnPrice) {
    try {

        //    var uniqueIntervalID;

        thisTileOptions = $(btnPrice).parents(".sorting")[0];
        console.log('Start Interval value =' + $(thisTileOptions).find('[id^="hdnintervalID"]').val());


       // LGTGTWINT-1638 | Chaitanya M | 5 July 2023
       // $(thisTileOptions).find('[id^="btnBestPriceOptions"]').attr("disabled", true); // INT1FIN47-768 Gateway Markets Instant Pricing issue

        var requestIDEQO = "";

        requestIDEQO = requestIDEQO + RequestIDGenerator(80);

        $(thisTileOptions).find('[id^="hdnRequestID"]').val(requestIDEQO);  //INT1FIN47-768 Gateway Markets Instant Pricing issue

        mapleLoaderStop(thisTileOptions, '[id^="btnBestPriceOptions"]', false);

        //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
        // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').hide(); //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
        $(thisTileOptions).find('[id^="RFQIDEQC"]').html("");
        //End

        globalSolveForValueOptions = $(thisTileOptions).find('[id^="solveForOptions"]').val().trim();

        clearInterval($(thisTileOptions).find('[id^="hdnintervalID"]').val());

        console.log('After clear Interval value =' + $(thisTileOptions).find('[id^="hdnintervalID"]').val());
        $(thisTileOptions).find('[id^="hdnintervalID"]').val("");
        TileId = btnPrice.id.match(/\d+$/)[0];
        sessionStorage.setItem("poolingTimer_" + TileId, 0);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        thisTileOptions = document.getElementById("td" + TileId);


        $(thisTileOptions).find('[id^="TBLOptions"]' + " td").each(function () {
            //Clear prices || Tina K || 11-Sep-2019
            $(this).html("-");
        })
        validation_clear();
        clearPricerTable(thisTileOptions);

        //  Client Side Validation Added  // 18- May -2020


        let tenorNumb = $(thisTileOptions).find("[id^='tenor_Options']").val();
        let tenorstring = $(thisTileOptions).find("[id^='tenorddl']").val();
        let _tenor = tenorNumb + tenorstring;


        if ($(thisTileOptions).find('[id^="EQOchk"]').is(':checked') == false) {

            if ($.trim($(thisTileOptions).find('[id^="NoOfShareipboxOptions"]').val()) == '' || $.trim($(thisTileOptions).find('[id^="NoOfShareipboxOptions"]').val()) < 0) { //LGTGTWINT-1557 | Chaitanya M | 28 Feb 2023
                ValidateField($(thisTileOptions).find('[id^="NoOfShareipboxOptions"]').attr('id'), "Please Enter Valid Number Of Shares", thisTileOptions);
                return false
            }

        } else {

            if ($.trim($(thisTileOptions).find('[id^="EQONotioanl"]').val()) == '' || $.trim($(thisTileOptions).find('[id^="EQONotioanl"]').val()) < 0) {//LGTGTWINT-1557 | Chaitanya M | 28 Feb 2023
                ValidateField($(thisTileOptions).find('[id^="EQONotioanl"]').attr('id'), "Please Enter Valid Notional.", thisTileOptions);
                return false
            }
        }

        if ($.trim($(thisTileOptions).find('[id^="OptionsSharesDemo"]').val()) == '' || $.trim($(thisTileOptions).find('[id^="OptionsSharesDemo"]').val()) == null || $.trim($(thisTileOptions).find('[id^="OptionsSharesDemo"]').val()) == undefined) {
            ValidateField($(thisTileOptions).find('[id^="OptionsSharesDemo"]').attr('id'), "Please Enter Valid Share", thisTileOptions);
            return false
        } else if ($.trim($(thisTileOptions).find('[id^="tenor_Options"]').val()) == '' || parseFloat($(thisTileOptions).find('[id^="tenor_Options"]').val()) <= 0) {
            ValidateField($(thisTileOptions).find('[id^="tenor_Options"]').attr('id'), "Please Enter Valid Tenor", thisTileOptions);
            return false

        } else if ($.trim($(thisTileOptions).find('[id^="ddlCurrencySettlement"]').val()) == '' || $.trim($(thisTileOptions).find('[id^="ddlCurrencySettlement"]').val()) <= 0) {
            ValidateField($(thisTileOptions).find('[id^="ddlCurrencySettlement"]').attr('id'), "Please Select Valid Settlement Ccy", thisTileOptions);
            return false
        } 
        // Start - Changed for SCB EAM Demo | Chaitanya M | 27 Sep 2023 
        else if ($.trim($(thisTileOptions).find('[id^="solveForOptions"]').val()).toUpperCase() === 'STRIKE' && ($.trim($(thisTileOptions).find('[id^="PremiumOptions"]').val()) == '' || $.trim($(thisTileOptions).find('[id^="PremiumOptions"]').val()) <= 0)) {
            ValidateField($(thisTileOptions).find('[id^="PremiumOptions"]').attr('id'), "Please Enter Valid Premium (%)", thisTileOptions);
            return false
        } else if ($.trim($(thisTileOptions).find('[id^="solveForOptions"]').val()).toUpperCase() === 'PREMIUM' && ($.trim($(thisTileOptions).find('[id^="strikeipboxOptions"]').val()) == '' || $.trim($(thisTileOptions).find('[id^="strikeipboxOptions"]').val()) <= 0)) {
            ValidateField($(thisTileOptions).find('[id^="strikeipboxOptions"]').attr('id'), "Please Enter Valid Strike (%)", thisTileOptions);
            return false
        }
        // End - Changed for SCB EAM Demo | Chaitanya M | 27 Sep 2023 
        
        // RizwanS || LGTGTWINT-2320 || 17 Aug 2023
        if (NotionalMinMaxCheck === "YES") {
            if(parseFloat($(thisTileOptions).find('[id^="NoOfShareipboxOptions"]').val().replace(/,/g, "")) === 0){     
                ValidateField($(thisTileOptions).find('[id^="hdnQuoteID"]').attr('id'),"Please input non zero notional.",thisTileOptions); 
                return false;
            }
        }
        //END


        // Start - Changed for SCB EAM Demo | Chaitanya M |  27 Sep 2023 
        if($(thisTileOptions).find('[id^="solveForOptions"]').val().toUpperCase() === 'PREMIUM'){

            // LGTGTWINT-1207 - Instant Pricing: Strike validation on Options for Option type - European Call and European Put       

            if ($(thisTileOptions).find('[id^="ddlOptions"]').val().toUpperCase().includes("CALL")) {
                if ($.trim($(thisTileOptions).find('[id^="strikeipboxOptions"]').val()) > Number(EQOCallMaxStrike)) {
                    ValidateField($(thisTileOptions).find('[id^="strikeipboxOptions"]').attr('id'), "Strike % should be less than" + " " + EQOCallMaxStrike, thisTileOptions);
                    return false
                } else if ($.trim($(thisTileOptions).find('[id^="strikeipboxOptions"]').val()) <= Number(EQOCallMinStrike)) {
                    ValidateField($(thisTileOptions).find('[id^="strikeipboxOptions"]').attr('id'), "Strike % should be greater than" + " " + EQOCallMinStrike, thisTileOptions);
                    return false
                }

            } else {

                if ($.trim($(thisTileOptions).find('[id^="strikeipboxOptions"]').val()) >= Number(EQOPutMaxStrike)) {
                    ValidateField($(thisTileOptions).find('[id^="strikeipboxOptions"]').attr('id'), "Strike % should be less than" + " " + EQOPutMaxStrike, thisTileOptions);
                    return false
                } else if ($.trim($(thisTileOptions).find('[id^="strikeipboxOptions"]').val()) < Number(EQOPutMinStrike)) {
                    ValidateField($(thisTileOptions).find('[id^="strikeipboxOptions"]').attr('id'), "Strike % should be greater than" + " " + EQOPutMinStrike, thisTileOptions);
                    return false
                }
            }
            // END

        }else{

            // if ($(thisTileOptions).find('[id^="ddlOptions"]').val().toUpperCase().includes("CALL")) {
            //     if ($.trim($(thisTileOptions).find('[id^="PremiumOptions"]').val()) > Number(EQOCallMaxStrike)) {
            //         ValidateField($(thisTileOptions).find('[id^="PremiumOptions"]').attr('id'), "Strike % should be less than" + " " + EQOCallMaxStrike, thisTileOptions);
            //         return false
            //     } else if ($.trim($(thisTileOptions).find('[id^="PremiumOptions"]').val()) <= Number(EQOCallMinStrike)) {
            //         ValidateField($(thisTileOptions).find('[id^="PremiumOptions"]').attr('id'), "Strike % should be greater than" + " " + EQOCallMinStrike, thisTileOptions);
            //         return false
            //     }

            // } else {

            //     if ($.trim($(thisTileOptions).find('[id^="PremiumOptions"]').val()) >= Number(EQOPutMaxStrike)) {
            //         ValidateField($(thisTileOptions).find('[id^="PremiumOptions"]').attr('id'), "Strike % should be less than" + " " + EQOPutMaxStrike, thisTileOptions);
            //         return false
            //     } else if ($.trim($(thisTileOptions).find('[id^="PremiumOptions"]').val()) < Number(EQOPutMinStrike)) {
            //         ValidateField($(thisTileOptions).find('[id^="PremiumOptions"]').attr('id'), "Strike % should be greater than" + " " + EQOPutMinStrike, thisTileOptions);
            //         return false
            //     }
            // }
        }        
        // End - Changed for SCB EAM Demo | Chaitanya M |  27 Sep 2023 


        // Added by RizwanS for tenor validation before pricing || 03 Jan 2022 ||

        if ($(thisTileOptions).find('[id^="tenorddl"]').val() == "M") {

            if (Number($(thisTileOptions).find('[id^="tenor_Options"]').val()) > Number(EQOAllowedTenorinMonths)) {
                ValidateField($(thisTileOptions).find('[id^="tenor_Options"]').attr("id"), "Please enter valid tenor.", thisTileOptions);
                return false;
            }

        } else {

            if (Number($(thisTileOptions).find('[id^="tenor_Options"]').val()) > Number(EQOAllowedTenorinYears)) {
                ValidateField($(thisTileOptions).find('[id^="tenor_Options"]').attr("id"), "Please enter valid tenor.", thisTileOptions);
                return false;
            }
        }

        // END

        // LGTGTWINT-1638 | Chaitanya M | 5 July 2023
        //Start
        // maturity_date = new Date($(thisTileOptions).find('[id^="MaturityDate_Option"]').text());
        // settl_date = new Date($(thisTileOptions).find('[id^="Options_SettlDate"]').text());
        // expiry_date = new Date($(thisTileOptions).find('[id^="Options_ExpiryDate"]').text());
        // trade_date = new Date($(thisTileOptions).find('[id^="Options_TradeDate"]').text());

        // if (maturity_date.getDay() == "6" || maturity_date.getDay() == "0") {
        //     $(thisTileOptions).find('[id^="btnBestPrice"]').attr("disabled", true);
        //     ValidateField($(thisTileOptions).find('[id^="MaturityDate_Option"]').attr("id"), "Date selected is not valid.", thisTileOptions);
        //     return false;
        // }
        // if (settl_date.getDay() == "6" || settl_date.getDay() == "0") {
        //     $(thisTileOptions).find('[id^="btnBestPrice"]').attr("disabled", true);
        //     ValidateField($(thisTileOptions).find('[id^="Options_SettlDate"]').attr("id"), "Date selected is not valid.", thisTileOptions);
        //     return false;
        // }
        // if (expiry_date.getDay() == "6" || expiry_date.getDay() == "0") {
        //     $(thisTileOptions).find('[id^="btnBestPrice"]').attr("disabled", true);
        //     ValidateField($(thisTileOptions).find('[id^="Options_ExpiryDate"]').attr("id"), "Date selected is not valid.", thisTileOptions);
        //     return false;
        // }
        // if (trade_date.getDay() == "6" || trade_date.getDay() == "0") {
        //     $(thisTileOptions).find('[id^="btnBestPrice"]').attr("disabled", true);
        //     ValidateField($(thisTileOptions).find('[id^="Options_TradeDate"]').attr("id"), "Date selected is not valid.", thisTileOptions);
        //     return false;
        // }

        checkdatesOptions(thisTileOptions,
            $(thisTileOptions).find("[id^='Options_SettlDate']").html(),
            $(thisTileOptions).find("[id^='Options_ExpiryDate']").html(),
            $(thisTileOptions).find("[id^='Options_MaturityDate']").html()
        );
        //END

        $(thisTileOptions).find('[id^="loaderOptions"]').show();

        // LGTGTWINT-1638 | Chaitanya M | 31 July 2023
        // if ($(thisTileOptions).find("[id^='Options_SettlDate']").html() == "" || $(thisTileOptions).find("[id^='Options_ExpiryDate']").html() == "" || $(thisTileOptions).find("[id^='Options_MaturityDate']").html() == "") {

        //     loadEQOTenorValues(thisTileOptions, true);

        // }
        //End

        let _Qtype = "";
        let _noOfShares = "";
        let _notional = "";

        if ($(thisTileOptions).find('[id^="EQOchk"]').is(':checked') == true) {

            _Qtype = "NOTIONAL";
            _noOfShares = "";
            _notional = $(thisTileOptions).find("[id^='EQONotioanl']").val().replace(/,/g, "").split(".")[0];

        } else {

            _Qtype = "SHARES";
            _noOfShares = ($(thisTileOptions).find("[id^='NoOfShareipboxOptions']").val()).replace(/\,/g, "").split(".")[0];
            _notional = "";

        }
        // Added for being Able to price with only share name entered and not selected| Ref:LGTGTWINT-1076, LGTGTWINT-1075 | Chaitanya M | 24-Jan-2023
        //start
        var checkforshares = validateshares(thisTileOptions, "OptionsSharesDemo");
        if (checkforshares == false) {
            ValidateField($(thisTileOptions).find('[id^="OptionsSharesDemo"]').attr("id"), "Please Enter Valid Shares", thisTileOptions);
            return false;
        }
        //End
        
        $(thisTileOptions).find('[id^="btnBestPriceOptions"]').attr("disabled", true);  // LGTGTWINT-1638 | Chaitanya M | 5 July 2023
          mapleLoaderStart(thisTileOptions, '[id^="btnBestPriceOptions"]', false);

        let quoteObjectOption = {

            "UserID": sessionStorage.getItem("EQC_UserName").toString(),
            "ProductType": "EQUITY",
            "Exchange1": getExchangeAndCcyFromBasket("", "exchange", $(thisTileOptions).find('[id^="OptionsSharesDemo"]').val().trim())[0],//$(thisTileOptions).find("[id^='hdnCurrentExchangeCodeOption']").val(),
            "UnderlyingCode1": $(thisTileOptions).find("[id^='OptionsSharesDemo']").val(),
            "Ccy1": $(thisTileOptions).find("[id^='ddlCurrencySettlement']").val(),
            "Exchange2": "",
            "UnderlyingCode2": "",
            "Ccy2": "",
            "Exchange3": "",
            "UnderlyingCode3": "",
            "Ccy3": "",
            "Exchange4": "",
            "UnderlyingCode4": "",
            "Ccy4": "",
            "InvestmentCcy": $(thisTileOptions).find("[id^='ddlCurrencySettlement']").val(),
            "SettlementDays": "2",
            "ClientSide": "Sell",
            "OptionType": $(thisTileOptions).find('[id^="ddlOptions"]').val(),
            "SettlementDate": $(thisTileOptions).find("[id^='Options_SettlDate']").html(),
            "ExpiryDate": $(thisTileOptions).find("[id^='Options_ExpiryDate']").html(),
            "MaturityDate": $(thisTileOptions).find("[id^='Options_MaturityDate']").html(),
            "SolveFor": $(thisTileOptions).find("[id^='solveForOptions']").val().trim(),
            "Tenor": _tenor,
            "strikePerc": $(thisTileOptions).find("[id^='strikeipboxOptions']").val(),
            // "SettlementMethod": $(thisTileOptions).find("[id^='ddlSettlement']").val().trim(), // LGTGTWINT-1910 | Chaitanya M | 24 April 2023
            "SettlementMethod": "Physical", // LGTGTWINT-1910 | Chaitanya M | 24 April 2023
            "SettlementCcy": $(thisTileOptions).find("[id^='ddlCurrencySettlement']").val(),
            "Upfront": $(thisTileOptions).find("[id^='upfrontOptions']").val(),
            "QuantityType": _Qtype,
            "NoOfShares": _noOfShares,
            "Notional": _notional,
            "StrikeType": "Percentage",
            "BarrierType": "",
            "BarrierMonitoringType": "Continuous",
            "PremiumPerc": $(thisTileOptions).find("[id^='PremiumOptions']").val().trim(),
            "BarrierPerc": "90",
            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
            "CurrentTileID": TileId,
            "requestID": $(thisTileOptions).find('[id^="hdnRequestID"]').val() //INT1FIN47-768 Gateway Markets Instant Pricing issue

        }

        console.log('eqc options req ', quoteObjectOption);

        quoteForOption(quoteObjectOption, $(thisTileOptions).find('[id^="hdnintervalID"]')[0]);

    } catch (error) {
        console.log(error);
        $(thisTileOptions).find('[id^="loaderOptions"]').hide();

    }
}

function quoteForOption(quoteObjectOption, uniqueIntervalID) {
    try {

        request_getDataFromAPI(quoteObjectOption, clientConfigdata.CommonMethods.NodeServer + "EQOQuote").then(data => {
         
            thisTileOptions = document.getElementById("td" + data.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + data.CurrentTileID, true);
            mapleLoaderStart(thisTileOptions,'[id^="btnBestPriceOptions"]', false);
            getUniqQuoteResponseOption(thisTileOptions, data, uniqueIntervalID,quoteObjectOption.requestID); //INT1FIN47-768 Gateway Markets Instant Pricing issue 

        })


    } catch (error) {
        console.log(error);
        $(thisTileOptions).find('[id^="loaderOptions"]').hide();


    }
}

function getUniqQuoteResponseOption(thisTileOptions, data, uniqueIntervalID, requestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var UIID = null;
        // Added by Atharva - EQC Timers - START
        isTimerStarted["td" + data.CurrentTileID] = false;
        myCounter["td" + data.CurrentTileID] = {};
        hasUserClickedEQC["td" + data.CurrentTileID] = false;
        $(thisTileOptions).find('[id^="hdnSelectedBank"]').val("");
 
        // END
        uniqueIntervalID.value = setInterval(function () {

            if(requestID != $(thisTileOptions).find('[id^="hdnRequestID"]').val() || $(thisTileOptions).find('[id^="hdnRequestID"]').val() ===""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                if($(thisTileOptions).find('[id^="hdnRequestID"]').val() ===""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    mapleLoaderStop(thisTileOptions,'[id^="btnBestPriceOptions"]', false);
                }
                return false
            } // INT1FIN47-768 Gateway Markets Instant Pricing issue
            
            sessionStorage.setItem("quoteToken_" + thisTileOptions.id.match(/\d+$/)[0], "");
            sessionStorage.setItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0], "");

            sessionStorage.setItem("quoteToken_" + thisTileOptions.id.match(/\d+$/)[0], data['token']);
            sessionStorage.setItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0], data['responseData']);


            getFinalQuoteResponseOption(sessionStorage.getItem("quoteToken_" + thisTileOptions.id.match(/\d+$/)[0]), sessionStorage.getItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]), thisTileOptions, uniqueIntervalID, requestID); 

        }, clientConfigdata.EQO.PollInterval);


        console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
    } catch (error) {
        console.log(error)
    }
}

function getFinalQuoteResponseOption(finalToken1, finalResponseData1, thisTileOptions, uniqueIntervalID, requestID) { //INT1FIN47-768 Gateway Markets Instant Pricing issue
    try {

        var currentDateAndTime = new Date();
        sessionStorage.setItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0], finalResponseData1);
        sessionStorage.setItem("quoteToken_" + thisTileOptions.id.match(/\d+$/)[0], finalToken1);
        console.log("EQC Options RFQ's :: " + finalResponseData1 + " " + currentDateAndTime);
        Timer = Timer + 1;

        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileOptions.id.match(/\d+$/)[0])) >= Number(EQOrequestCount.toString().split(".")[0])  || sessionStorage.getItem("pricingToggle" + thisTileOptions.id.match(/\d+$/)[0]) == "false") { //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
        
            $(thisTileOptions).find('[id^="btnBestPriceOptions"]').attr("disabled", false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            clearInterval(uniqueIntervalID.value);
            mapleLoaderStop(thisTileOptions,'[id^="btnBestPriceOptions"]', false);
            uniqueIntervalID.value = "";
            quoteObjectOption = "";


            // $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val(JSON.stringify(finalObj));
            // if ($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val() != null || $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val() != undefined) {
            //     drawgraphEQCOption($(thisTileOptions).find('[id^="canvas"]').attr('id'));
            // }
            // INT1FIN47-768 Gateway Markets Instant Pricing issue
            
            return false;
        } else {

            request_getDataFromAPI({
                "PPDetails": sessionStorage.getItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]),
                "CurrentTileID": thisTileOptions.id.match(/\d+$/)[0],
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token"),
                UserID: sessionStorage.getItem("EQC_UserName").toString()

            }, clientConfigdata.CommonMethods.NodeServer + "EQO_getQuoteResponse").then(repriceObject => {

                thisTileOptions = document.getElementById("td" + repriceObject.CurrentTileID);
                
                if(requestID != $(thisTileOptions).find('[id^="hdnRequestID"]').val() || $(thisTileOptions).find('[id^="hdnRequestID"]').val() ===""){ //RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    if($(thisTileOptions).find('[id^="hdnRequestID"]').val() ===""){//RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
                    mapleLoaderStop(thisTileOptions,'[id^="btnBestPriceOptions"]', false);
                    }
                    return false
                } //INT1FIN47-768Gateway Markets Instant Pricing issue
                
                sessionStorage.setItem("poolingTimer_" + repriceObject.CurrentTileID, Number(sessionStorage.getItem("poolingTimer_" + thisTileOptions.id.match(/\d+$/)[0])) + 1);
                finalObj =(repriceObject['responseData']);
                sessionStorage.setItem("quoteToken_" + thisTileOptions.id.match(/\d+$/)[0], repriceObject['token']);
                sessionStorage.setItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]));
                
                
                // Sorted By Best Price LP'S       
                if ($(thisTileOptions).find("[id^='rbRowbuySellToggleOption']")[0].checked) {
                    finalObj.sort(function (a, b) {
                        if (a.EQOOUT === null || a.EQOOUT == "" || a.EQOOUT == "Timeout" || a.EQOOUT.toUpperCase().trim() == "REJECTED" || a.EQOOUT.toUpperCase().trim() == "UNSUPPORTED") {
                            return 1;
                        } else if (b.EQOOUT === null || b.EQOOUT == "" || b.EQOOUT == "Timeout" || a.EQOOUT.toUpperCase().trim() == "REJECTED" || b.EQOOUT.toUpperCase().trim() == "UNSUPPORTED") {
                            return -1;
                        } else if (a.EQOOUT === b.EQOOUT) {
                            return 0;
                        }
                        return Number(a.EQOOUT) < Number(b.EQOOUT) ? 1 : -1;
                    });

                } else {
                    finalObj.sort(function (a, b) {
                        if (a.EQOOUT === null || a.EQOOUT == "" || a.EQOOUT == "Timeout" || a.EQOOUT.toUpperCase().trim() == "REJECTED" || a.EQOOUT.toUpperCase().trim() == "UNSUPPORTED") {
                            return 1;
                        } else if (b.EQOOUT === null || b.EQOOUT == "" || b.EQOOUT == "Timeout" || a.EQOOUT.toUpperCase().trim() == "REJECTED" || b.EQOOUT.toUpperCase().trim() == "UNSUPPORTED") {
                            return -1;
                        } else if (a.EQOOUT === b.EQOOUT) {
                            return 0;
                        }
                        return Number(a.EQOOUT) < Number(b.EQOOUT) ? -1 : 1;
                    });

                }

                maxOptions = finalObj[0].EQOOUT;

                 //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023

                //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
                // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').show();
                // $(thisTileOptions).find('[id^="RFQIDEQC"]').html("");
                // $(thisTileOptions).find('[id^="RFQIDEQC"]').html(finalObj[0].EP_ER_QuoteRequestId);
                 //end

                //Removed || LGTGTWINT-1981 || RizwanS || 12 May 2023
                $(thisTileOptions).find('[id^="hdnfinalTokenOptions"]').val(sessionStorage.getItem("quoteToken_" + thisTileOptions.id.match(/\d+$/)[0]));
                // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
                $(thisTileOptions).find('[id^="btnEmailQuote"]').attr("disabled", false);
                $(thisTileOptions).find('[id^="btnBookTradeOptions"]').attr("disabled", false);
                $(thisTileOptions).find('[id^="OrderEmail"]').attr("disabled",false); //LGTGTWINT-1981 || RizwanS || 12 May 2023 

                if (sessionStorage.getItem("pricingToggle" + thisTileOptions.id.match(/\d+$/)[0]) == "true") {
                    // Added by Atharva - EQC Timers - START
                    // every time in new request indexes might change so clearing.
                    var isNonBestPrice = false;
                    if(clientConfigdata.CommonMethods.NonBestPrice == "Y") {
                        isNonBestPrice = true;
                    }
                    else {
                        isNonBestPrice = false;
                    }
                    mapIndexToBank["td"+repriceObject.CurrentTileID] = {};
                    // END
                    $(thisTileOptions).find('[id^="hdnfinalTokenOptions"]').empty();
                    // $(thisTileOptions).find('[id^="OptionsBanksRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // $(thisTileOptions).find('[id^="OptionsPrices"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023
                    // Added by Atharva - EQC Timers - START
                    $(thisTileOptions).find('[id^="OptionsTimerRow"]').empty();
                    if(!hasUserClickedEQC["td"+repriceObject.CurrentTileID]) {
                        $(thisTileOptions).find('[id^="hdnSelectedBank"]').val("");
                    }
                    var itr = 0;
                    // END
                    // $(thisTileOptions).find('[id^="minMaxNotionalLimitRow"]').empty(); //Commented by RizwanS || LGTGTWINT-2320 & LGTGTWINT-2321 || 21 Aug 2023

                    //Check for best price count || LGTGTWINT-1981 || RizwanS || 12 May 2023
                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023 
                    if (ShowExpandButtonOnOTC.toUpperCase() == "NO") {  

                        // LGTGTWINT-2018 - Prices to be displayed for EAM entity on MSP and IP only when the input notional falls within min max range of CPs || RizwanS || 24 May 2023
                         if(NotionalMinMaxCheck.toUpperCase() === 'YES' && parseFloat(($(thisTileOptions).find('[id^="NoOfShareipboxOptions"]').val()).replace(/\,/g, "")) > 0){ //RizwanS || LGTGTWINT-2153 || 27 Jun 2023

                            let sliceCount = 1; // Count to show best prices as per config set

                            let productname = $(thisTileOptions).find(".productName").attr("id");
    
                            // Start - LGTGTWINT-2009, 2005 | Chaitanya M | 18 May 2023 
    
                            let _upfrontvalue = Number($(thisTileOptions).find("[id^='upfrontOptions']").val());

                            let calculatedNotional = '';

                            let _spotRate = '';

                            //Get spot rate of selected share
                            
                            let selectedShareName = $(thisTileOptions).find("[id^='OptionsSharesDemo']").val();
                            
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

                            let noOfShares = ($(thisTileOptions).find("[id^='NoOfShareipboxOptions']").val()).replace(/\,/g, "").split(".")[0]; //get no. of share
                            
                            calculatedNotional = Number(noOfShares) * Number(_spotRate);
                            
                            console.log(calculatedNotional);
                            
                            let _minmaxObj = [];

                            for(i=0;i<finalObj.length;i++){
            
                                if(parseFloat(calculatedNotional) <= parseFloat(finalObj[i].MaxNotional)
                                && parseFloat(calculatedNotional) >= parseFloat(finalObj[i].MinNotional)){
                                    _minmaxObj.push(finalObj[i]);
                                }
                            }

                            if(_minmaxObj.length <= 0){

                                $(thisTileOptions).find('[id^="btnEmailQuote"]').attr("disabled", true);
                                $(thisTileOptions).find('[id^="btnBookTradeOptions"]').attr("disabled", true);
                                $(thisTileOptions).find('[id^="OrderEmail"]').attr("disabled",true);
                                return false;
                            }

                            finalObj = sliceEQCbestprices(_minmaxObj,productname,sliceCount,_upfrontvalue);

                         }
                        //END
                        
                        if(OTCHideCounterparty.toUpperCase() == "YES"){

                            finalObj[0].PP_CODE = OTCEQC_Cpty_BuyerCode;
                 
                        }

                    }
                    //END

                    //EAM Quote Email issue || RizwanS ||| LGTGTWINT-2320 & LGTGTWINT-2321|| 21 Aug 2023 
                    $(thisTileOptions).find('[id^="OptionsBanksRow"]').empty();
                    $(thisTileOptions).find('[id^="OptionsPrices"]').empty();
                    $(thisTileOptions).find('[id^="minMaxNotionalLimitRow"]').empty();
                    //END

                    bindRFQIDEQC(thisTileOptions,finalObj);//LGTGTWINT-2141 | Chaitanya M | 26 June 2023

                    $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val(JSON.stringify(finalObj));

                    // END   

                    $(finalObj).each(function (i, elem) {
                        try {
                            // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
                            var priceClass = "GlowPrice_Red";
                            if (!glowFlag) {
                                priceClass = "noGlow";
                            }

                            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
                            // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').show();
                            // $(thisTileOptions).find('[id^="RFQIDEQC"]').html(elem.ParentID);
                            //End

                            var str = "";
                            var str2 = "";
                            if (elem.PP_CODE != null) {
                                // Added by Atharva - EQC Timers - START
                                mapIndexToBank["td"+repriceObject.CurrentTileID][itr] = elem.PP_CODE;
                                if($(thisTileOptions).find('[id^="hdnSelectedBank"]').val() == "") {
                                    $(thisTileOptions).find('[id^="hdnSelectedBank"]').val(elem.PP_CODE);
                                }
                                // END
                               
                                    if(isNonBestPrice) {
                                        if(elem.EQOOUT != null && !isNaN(parseFloat(elem.EQOOUT)) && ($(thisTileOptions).find('[id^="hdnSelectedBank"]').val().trim()) == elem.PP_CODE) {
                                            str = str + "<td class='priceBackground";
                                            if(itr == 0) {
                                                str = str + " bestPriceStyle";
                                            }
                                            str = str + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</button></td>";
                                        }
                                        else if(elem.EQOOUT != null && !isNaN(parseFloat(elem.EQOOUT))) {
                                            str = str + "<td";
                                            if(itr == 0) {
                                                str = str + " class='bestPriceStyle'";
                                            }
                                            str = str + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + elem.PP_CODE + "</td>";
                                        }
                                        else {
                                            str = str + "<td>" + elem.PP_CODE + "</td>";
                                        }
                                    }
                                    else {
                                        str = str + "<td";
                                        if(itr == 0 && elem.EQOOUT != null && !isNaN(parseFloat(elem.EQOOUT))) {
                                            str = str + " class='bestPriceStyle'"
                                        }
                                        str = str + ">" + elem.PP_CODE + "</td>";
                                    }
                                
                                $(thisTileOptions).find('[id^="OptionsBanksRow"]').append(str);
                            } else {
                                str = str + "<td>--</td>"
                                $(thisTileOptions).find('[id^="OptionsBanksRow"]').append(str);
                            }
                            if (elem.EQOOUT != null && !isNaN(parseFloat(elem.EQOOUT))) {
                                // if (maxOptions == elem.EQOOUT)
                                // Added by Atharva - EQC Timers
                                // Added new if condition
                                if(isNonBestPrice) {
                                    if($(thisTileOptions).find('[id^="hdnSelectedBank"]').val() == elem.PP_CODE) {
                                        str2 = str2 + "<td class='priceBackground";
                                        // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                        if(parseFloat(elem.EQOOUT).toFixed(2) < 0){

                                            if(itr == 0) {
                                                str2 = str2 + " negativeprice";
                                            }

                                        }else{

                                            if(itr == 0) {
                                                str2 = str2 + " bestPriceStyle";
                                            }

                                        }     
                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023                                   
                                        str2 = str2 + "'><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.EQOOUT).toFixed(2) + " %</button></td>"
                                        $(thisTileOptions).find('[id^="OptionsPrices"]').append(str2);
                                    } else {
                                        str2 = str2 + "<td";
                                        // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                        if(parseFloat(elem.EQOOUT).toFixed(2) < 0){
                                            if(itr == 0) {
                                                str2 = str2 + " class='negativeprice_nonbest'";
                                            }
                                            // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                            str2 = str2 + "><button type='button' class='priceButton negativeprice_nonbest' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.EQOOUT).toFixed(2) + " %</button></td>"
                                            $(thisTileOptions).find('[id^="OptionsPrices"]').append(str2);

                                        }else{

                                            if(itr == 0) {
                                                str2 = str2 + " class='bestPriceStyle'";
                                            }
                                            // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                            str2 = str2 + "><button type='button' class='priceButton' onclick='setPriceEQC(this)' id='td" + repriceObject.CurrentTileID + "_" + itr + "'>" + parseFloat(elem.EQOOUT).toFixed(2) + " %</button></td>"
                                            $(thisTileOptions).find('[id^="OptionsPrices"]').append(str2);
                                        }
                                        
                                    }
                                }
                                else {
                                    str2 = str2 + "<td";
                                    // Added a condition to check whether the received response is positive or negative and if negative highligitng it in red color. |  Ref: LGTCLI-344 | Chaitanya M | 13 March 2023 
                                    if(parseFloat(elem.EQOOUT).toFixed(2) < 0){

                                        if(itr == 0) {
                                            str2 = str2 + " class='negativeprice_nonbest'";
                                        }

                                    }else{

                                        if(itr == 0) {
                                            str2 = str2 + " class='bestPriceStyle'";
                                        }

                                        // Added for displaying "%" symbol after the value of each response. Ref: LGTCLI-328 | Chaitanya | 13 March 2023
                                    } 
                                    str2 = str2 + ">" + parseFloat(elem.EQOOUT).toFixed(2) + " %</td>";
                                    $(thisTileOptions).find('[id^="OptionsPrices"]').append(str2);
                                }   
                            } else {
                                str2 = str2 + "<td>-</td>"
                                $(thisTileOptions).find('[id^="OptionsPrices"]').append(str2);
                            }
                            
                            itr++;
                            let strMinMaxNotionalLimit = '';
                            if (elem.PP_CODE != null) {
                                strMinMaxNotionalLimit = strMinMaxNotionalLimit + `<td style='font-size:12px !important;'>${K_M_B_Formatter(Number(elem.MinNotional))} / ${K_M_B_Formatter(Number(elem.MaxNotional))}</td>`;
                                $(thisTileOptions).find('[id^="minMaxNotionalLimitRow"]').append(strMinMaxNotionalLimit);
                            }
                            // END
                        } catch (error) {

                            console.log(error);
                            $(thisTileOptions).find('[id^="loaderOptions"]').hide();

                            // $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val(JSON.stringify(finalObj));
                            // if ($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val() != null || $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val() != undefined) {
                            //     drawgraphEQCOption($(thisTileOptions).find('[id^="canvas"]').attr('id'));
                            // }
                            // INT1FIN47-768 Gateway Markets Instant Pricing issue

                        } finally {


                        }
                    });
                    // Added by Atharva - EQC Timers - START
                    // Should run only once
                    // if(!isTimerStarted["td" + repriceObject.CurrentTileID]) {
                    //     isTimerStarted["td" + repriceObject.CurrentTileID] = true;
                    //     startTimersEQC(repriceObject.CurrentTileID);
                    // }
                    // END
                }

            }).catch(error => {
                console.log(error);

                $(thisTileOptions).find('[id^="btnBestPriceOptions"]').attr("disabled", false); 
                clearInterval(uniqueIntervalID.value);
                mapleLoaderStop(thisTileOptions,'[id^="btnBestPriceOptions"]', false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
               
                // $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val(JSON.stringify(finalObj));
                // if ($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val() != null || $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val() != undefined) {
                //     drawgraphEQCOption($(thisTileOptions).find('[id^="canvas"]').attr('id'));
                // }
                // INT1FIN47-768 Gateway Markets Instant Pricing issue
            })
        }
    } catch (error) {
     

        $(thisTileOptions).find('[id^="btnBestPriceOptions"]').attr("disabled", false); 
        sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        clearInterval(uniqueIntervalID.value);
        mapleLoaderStop(thisTileOptions,'[id^="btnBestPriceOptions"]', false); // INT1FIN47-768 Gateway Markets Instant Pricing issue
        // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
        $(thisTileOptions).find('[id^="btnEmailQuote"]').attr("disabled", true);
        $(thisTileOptions).find('[id^="btnBookTradeOptions"]').attr("disabled", true);
        $(thisTileOptions).find('[id^="OrderEmail"]').attr("disabled",true);  //LGTGTWINT-1981 || RizwanS || 12 May 2023
        uniqueIntervalID.value = "";

        console.log(error.message);
        
        // $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val(JSON.stringify(finalObj));
        // if ($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val() != null || $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val() != undefined) {
        //     drawgraphEQCOption($(thisTileOptions).find('[id^="canvas"]').attr('id'));
        // }
        //sessionStorage.setItem("quoteToken_" + thisTileOptions.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileOptions.id.match(/\d+$/)[0]));
        //sessionStorage.setItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]));
        // INT1FIN47-768 Gateway Markets Instant Pricing issue
    }
}

function booktradeOptions(that,suitabilityCheck,redirectOrder) { // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
    try {
        // startLoader()
        TileId = that.id.match(/\d+$/)[0];
        sessionStorage.setItem("pricingToggle" + TileId, false);
        thisTileOptions = document.getElementById("td" + TileId);
        mapleLoaderStart(thisTileOptions, "", true);
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
            $(thisTileOptions).find('[id^="OptionsBanksRow"]').children().each(function() {
                if($(thisTileOptions).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
            mapleOrderLoaderStop(thisTileOptions);
            return false;
        }
        // END

        let AllocationDetails = [];

        $(thisTileOptions).find("select.ChildrenddlBookingCenter").each(function (index, element) {

            if ($(this).parent().prev().find(".childrenCheckBoxBooking")[0].checked) {

                AllocationDetails.push({

                    "RMName": $(element).parent().parent().find('[id^="ddlRMName"]').val(),
                    "CustBranch": element.value,
                    "Notional": $(element).parent().parent().find('[id^="txtHeaderNotional"]').val().split('.')[0].replace(/\,/g, "")

                })
            }
        })

        var Obj = JSON.parse($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val());
        // Added by Atharva - EQC Timers
        // Replaced 0 with selectedBankIndex
        var token1 = $(thisTileOptions).find('[id^="hdnfinalTokenOptions"]').val();
        var quoteid = Obj[selectedBankIndex].EP_ER_QuoteRequestId;
        var clientPrice = Obj[selectedBankIndex].EQOOUT;
        var clientYield = Obj[selectedBankIndex].ClientYield;
        var UpfrontbyIBpriceOptions = $(thisTileOptions).find('[id^="txtUpfrontOPTIONS"]').val(); //LGTGTWINT-1629 Instant Pricing: Options: Upfront values is not passed to API. Hardcoded value 0.5 is displayed.
        let clientPrice_Options = $(thisTileOptions).find("[id^='rbRowbuySellToggleOption']")[0].checked ? Number(Number(clientPrice) - UpfrontbyIBpriceOptions).toFixed(4) : Number(Number(clientPrice) + UpfrontbyIBpriceOptions).toFixed(4);


        let limitPrice1 = "";
        let limitPrice2 = "";
        let limitPrice3 = "";
        let limitPrice4 = "";

        if($(thisTileOptions).find('[id^="ddlOrderTypeOPTIONS"]').val().trim().toUpperCase() == "LIMIT"){

            if($(thisTileOptions).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 0){

                limitPrice1 = $(thisTileOptions).find('[id^="txtLimitLevel"]').val().trim();

            }else if($(thisTileOptions).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 1){

                 limitPrice2 = $(thisTileOptions).find('[id^="txtLimitLevel"]').val().trim();

            } else if($(thisTileOptions).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 2){

                 limitPrice3 = $(thisTileOptions).find('[id^="txtLimitLevel"]').val().trim();
                 
            } else if($(thisTileOptions).find('[id^="ddlLimitLevel"]')[0].selectedIndex == 3){

                limitPrice4 = $(thisTileOptions).find('[id^="txtLimitLevel"]').val().trim();
                
            }            
        }


        //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

        let _confirmReason = "";

        if (selectedBankIndex > 0) {

            if ($(thisTileOptions).find('[id^="ddlNONBEST"]').val() != "NONBEST_CUSTOM") {

                _confirmReason = $(thisTileOptions).find('[id^="ddlNONBEST"]').text();

            } else {

                _confirmReason = $(thisTileOptions).find('[id^="txtNONBEST"]').val();

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
                if ($(thisTileOptions).find('[id^="rbRowSuitabilityToggle"]')[0].checked) {
                    _chkSuitability = "NO";
                    if ($(thisTileOptions).find('[id^="ddlReason"]').val().trim().includes("SUTSKP_CUSTOM")) { // Added by RizwanS | JIRA-LGTGTWINT-1830
                        _reasonmsg = $(thisTileOptions).find('[id^="txtSpecifyReason"]').val();
                    }else{
                        _reasonmsg = $(thisTileOptions).find('[id^="ddlReason"]').val();
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

        if (redirectOrder == true) {

            orderMethodName = "redirectOrder";

            bookObject = {

               EntityID: sessionStorage.getItem("EQC_EntityID").toString(),
               orderQty: $(thisTileOptions).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
               type:$(thisTileOptions).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
               limitPrice1: limitPrice1,
               limitPrice2: limitPrice2,
               limitPrice3: limitPrice3,
               limitPrice4: limitPrice4,
               QuoteRequestId: quoteid,
               loginUser: sessionStorage.getItem("EQC_UserName").toString(),
               margin: UpfrontbyIBpriceOptions,
               clientPrice:clientPrice_Options,
               yield: "",
               bookingBranch: $(thisTileOptions).find('[id^="ddlBookingBranch"]').val(),
               rmNameForOrderConfirmation: $(thisTileOptions).find('[id^="ddlRMName"]').val(),
               dealerNotificationEmailID: $(thisTileOptions).find('[id^="txtComment"]').val(),
               orderComment: $(thisTileOptions).find('[id^="txtComment"]').val(),
               confirmationReason: _confirmReason,
               advisoryReason: $(thisTileOptions).find('[id^="txtComment"]').val(),
               preTradeXml: preTradeXml,
               // chkSuitability:$(thisTileOptions).find('[id^="rbRowSuitabilityToggle"]')[0].checked ?"NO":"YES",
               chkSuitability:_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
               SuitabilityReason:_reasonmsg,  // Added by RizwanS | JIRA-LGTGTWINT-1830
               EQC_TOKEN: sessionStorage.getItem("EQC_Token").toString(),
               token: sessionStorage.getItem("EQC_Token").toString(),
               AllocationDetails: AllocationDetails,
               CurrentTileID: TileId,
               UserRole : isEQCDealer === true ? 'Dealer' : isIA=== true ? 'IA' : 'RM' , // Added by RizwanS | JIRA-LGTGTWINT-1830
            
            }

            redirectYN = "";

        } else {

            orderMethodName = "BookOrderEQC45";
            bookObject = {

                "userName": sessionStorage.getItem("EQC_UserName").toString(),
                "token": "",
                "orderQuantity": Number(($(thisTileOptions).find("[id^='txtTotalNotional']").val()).replace(/\,/g, "").split(".")[0]),
                "OrderType": $(thisTileOptions).find('[id^="ddlOrderType"]').val().trim().toUpperCase(),
                "LimitPrice1": limitPrice1,
                "LimitPrice2": limitPrice2,
                "LimitPrice3": limitPrice3,
                "LimitPrice4": limitPrice4,
                "QuoteRequestId": quoteid,
                "PoolID": "",
                "RedirectOrderID": "",
                "OrderComment": $(thisTileOptions).find('[id^="txtComment"]').val(),//suitabilityCheck === true ? "Suitability" : "MAPLEUser",
                "Margin": UpfrontbyIBpriceOptions,
                "Notional": $(thisTileOptions).find("[id^='txtCalculatedNotional']").val().replace(/\,/g, ""),
                "ClientPrice": clientPrice_Options,
                "ClientYield": "",
                "BookingBranch": $(thisTileOptions).find('[id^="ddlBookingBranch"]').val(),
                "RMNameforOrderConfirm": $(thisTileOptions).find('[id^="ddlRMName"]').val(),
                "RMEmailIdforOrderConfirm": "",
                "ConfirmReason": _confirmReason, //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message
                "PreTradeXml": "",
                "AdvisoryReason": "",
                // "UserRole": _reasonmsg, // Added Chaitanya M | For checking the suitability reason | Ref:LGTGTWINT-603 | 12-Jan-2023
                "CustomerID": "",
                // "chkSuitability": $(thisTileOptions).find('[id^="rbRowSuitabilityToggle"]')[0].checked ? "NO" : "YES",
                "chkSuitability":_chkSuitability,//RizwanS || LGTGTWINT-2295 || 11 Aug 2023
                "SuitabilityReason": _reasonmsg,  // Added by RizwanS | JIRA-LGTGTWINT-1830
                "IntendedSpread": "",
                "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                "CurrentTileID": TileId,
                "AllocationDetails": AllocationDetails,
                "UserRole": isEQCDealer === true ? 'Dealer' : isIA === true ? 'IA' : 'RM', // Added by RizwanS | JIRA-LGTGTWINT-1830

            }

        }

        mapleOrderLoaderStart(thisTileOptions);

        request_getDataFromAPI(bookObject, clientConfigdata.CommonMethods.NodeServer + orderMethodName).then(bookObject => {

            // endLoader();

            TileId = bookObject.CurrentTileID;

            thisTileOptions = document.getElementById("td" + bookObject.CurrentTileID);

            let bookstring = bookObject['responseData']; // LGTGTWINT-1888 || RizwanS || 30 May 2023

            let OrderStatus = bookObject['message']; // LGTGTWINT-1888 || RizwanS || 30 May 2023

            if (OrderStatus.toUpperCase() === clientConfigdata.EQCCommonMethods.EQC_BOOK_TRADE_RESPONSE_DETAILS.toUpperCase()) {

                // $(thisTileOptions).find('[id^="hdnBlotterURLOptions"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                // $(thisTileOptions).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradeOption" + TileId, bookstring, "DivOverlayOption");
                $(thisTileOptions).find('[id^="hdnfinalTokenOptions"]').val("");
                $(thisTileOptions).find('[id^="OverlayDiv"]').hide();
                clearPricerTable(thisTileOptions);

            } else {

                if (OrderStatus == "" || OrderStatus == null || OrderStatus == undefined) {

                    OrderStatus = "Order Execution Failed!";

                } else if (OrderStatus.includes("Please select booking centers from same region")) { // LGTGTWINT-1888 || RizwanS || 30 May 2023

                    OrderStatus = "Please select booking centers from same region.";
                }

                booktradePopup(that, "booktradeOption" + TileId, OrderStatus, "DivOverlayOption");
                $(thisTileOptions).find('[id^="hdnfinalTokenOptions"]').val("");
                $(thisTileOptions).find('[id^="OverlayDiv"]').hide();
                clearPricerTable(thisTileOptions);
            }

            mapleOrderLoaderStop(thisTileOptions);
            sessionStorage.removeItem("quoteResponse_" + thisTileOptions.id.match(/\d+$/)[0]); // INT1FIN47-768 Gateway Markets Instant Pricing issue
            $(thisTileOptions).find('[id^="btnBestPriceOptions"]').attr("disabled", false); // INT1FIN47-768 Gateway Mar
            clearInterval($(thisTileOptions).find('[id^="hdnintervalID"]').val());
            mapleLoaderStop(thisTileOptions, '[id^="btnBestPriceOptions"]', false);
            // Added by Atharva - EQC Timers - START
            $(thisTileOptions).find('[id^="OptionsPrices"]').children().each(function () {
                $(this).find("button").attr('disabled', true);
            });
            $(thisTileOptions).find('[id^="OptionsBanksRow"]').children().each(function () {
                $(this).find("button").attr('disabled', true);
            });
            // added for UI cahnges | Ref: LGTGTWINT-980 | Chaitanya M | 10 Feb 2023
            $(thisTileOptions).find('[id^="btnEmailQuote"]').attr("disabled", true);
            $(thisTileOptions).find('[id^="btnBookTradeOptions"]').attr("disabled", true);
            $(thisTileOptions).find('[id^="OrderEmail"]').attr("disabled", true); //LGTGTWINT-1981 || RizwanS || 12 May 2023 

            //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
            // $(thisTileOptions).find('[id^="EQCRfqidpnl"]').hide(); 
            $(thisTileOptions).find('[id^="RFQIDEQC"]').html("");
            //End

            // END
        }).catch(error => { console.log(error); })

    } catch (error) {
        console.log(error);
        // endLoader();
        mapleOrderLoaderStop(thisTileOptions);

    }
}

var dialogBoxOptions = null;
function emailQuoteOptions(that) {
    try {

        thisTileOptions= $(that).parents(".sorting")[0];
    
        let pricingRow = "";
        pricingRow = $(thisTileOptions).find("table.pricerTable .pricesRow")[0];
        mapleOrderLoaderStart(thisTileOptions);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
    
        if (pricingRow.cells[0].innerText.trim().toString() === "-") {

            openValidationpopup('',"No price available for mailing!"); // Changed for Change quote mail validation from "Invalid Price" to "No price available for mailing!" | Ref: LGTGTWINT-1195 | Chaitanya M | 25-jan-2023
          
          return false;
        }

        //create email pop up here 
       let strEmail =``;
       let emailPriceStream =JSON.parse($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val());
       console.log('email price stream object ', emailPriceStream);

       strEmail=strEmail+`<table class='emailTable'><tr><td class='payOff_Features'>
       <input type='checkbox' class='chkBoxParent_Email_PPCode' onchange='emailParentCheckboxChanged(this)' >
       Issuer</td><td class='payOff_Features'>${globalSolveForValueOptions}</td></tr>`;

        for (let e of emailPriceStream){
            if(e.EQOOUT.trim().toUpperCase()!=='REJECTED' && e.EQOOUT.trim().toUpperCase()!=='' && e.EQOOUT.trim().toUpperCase()!=='UNSUPPORTED' ){ // Changed the condition for handling Unsupported response | Ref: LGTGTWINT-1321 | Chaitanya M | 06 Feb 2023
                strEmail=strEmail+`<tr><td style='width:40px;padding:15px'><input type='checkbox' class='chkBox_Email_PPCode'  onchange='emailChildrenCheckboxChanged(this)'> ${e.PP_CODE}</td><td style='width:40px;padding:15px'>${e.EQOOUT}</td></tr>`;
            }else
            {
                // do nothing 
            }
        }
        strEmail = strEmail + `</table>`

        // Added by Atharva - EQC Timers - START
        var selectedBankIndex = -1;
        var itr = 0;
        //End
        if(dialogBoxOptions===null)
        {
         dialogBoxOptions= $(thisTileOptions).find('[id^="emailDialog_Options"]')[0];
         $(thisTileOptions).find('[id^="emailDialog_Options"]').empty().append(strEmail);
           $(dialogBoxOptions).dialog({
            resizable: false,
            height: "auto",
            width: 320,
            modal: true,
            open: function (event, ui) { // Added for LGTGTWINT-1283 || Email popup on top change | Chaitanya M | 08 Feb 2023
                $('.ui-widget.ui-widget-content').css('z-index',999);                    
            },   
            //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
            close: function (event, ui){
                mapleOrderLoaderStop(thisTileOptions);
                //End
            },        
            buttons: {
                "Mail Quote": function() {
                    //mail single selected rfq 

                    //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                
                    var Email_PPList = [];
                    var RFQIDList =[];
                    var __mailRFQ=[];
                    
                    if($(document).find('.ui-dialog').find('[id^="emailDialog_Options"]').find('.chkBox_Email_PPCode').length>0)
                    {
                        $(document).find('.ui-dialog').find('[id^="emailDialog_Options"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                            if(checkboxControl.checked){
                            Email_PPList.push($(checkboxControl).parent().text().trim())
                            RFQIDList.push(JSON.parse($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val()).filter(function(RFQ_OBJECT){
                                return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                                })
                                )

                            }
                        })
                    }
                    if (Email_PPList.length > 0) {
                        console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);
        
                        for(let R of RFQIDList){
                            __mailRFQ.push(R[0].EP_ER_QuoteRequestId);
        
                        }
        
                    //   return true;
                    }
                    if ($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val() != undefined && $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val().trim()!='')
                    var RFQID = JSON.parse($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;
        
                    if (RFQID != undefined && RFQID != ''){
                        //     MailBestQuote(thisTileOptions.id.match(/\d+$/)[0], JSON.parse($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val())[0].EP_ER_QuoteRequestId);
                        
                        if(__mailRFQ == ""){

                            // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            //booktradePopup(thisTileOptions, "booktradefcn" + thisTileOptions.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayfcn");
                        
                            openValidationpopup('','No price selected for mailing !');
                            //End
                            return false;
                        } 
                        $( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                        mapleOrderLoaderStart(thisTileOptions);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023

                        request_getDataFromAPI(
                        {
                            userName: sessionStorage.getItem("EQC_UserName").toString(),
                            rfqId: __mailRFQ.toString(),   //email best price RFQ for now 
                            CurrentTileID: thisTileOptions.id.match(/\d+$/)[0],
                            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                            QuoteMailType:"English"
                        },clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                            console.log(data);
                            TileId = data.CurrentTileID;
                            thisTileOptions = document.getElementById("td" +TileId);
                            mapleOrderLoaderStop(thisTileOptions); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            booktradePopup(thisTileOptions, "booktradeOption" + TileId, data.message, "DivOverlayOption");                          
                        }).catch(error=>{
                            console.log(error);                
                        })
                    }else{
                        mapleOrderLoaderStop(thisTileOptions); //LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                        openValidationpopup('','Invalid RFQ ID ');
                    }
                    
                },
                "Mail All Quotes": function() {  
              
                //$( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023              

                
                    var Email_PPList = [];
                    var RFQIDList =[];
                    var __mailRFQ=[];
                    
                    if($(document).find('.ui-dialog').find('[id^="emailDialog_Options"]').find('.chkBox_Email_PPCode').length>0)
                    {
                        $(document).find('.ui-dialog').find('[id^="emailDialog_Options"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                            //  if(checkboxControl.checked){
                            Email_PPList.push($(checkboxControl).parent().text().trim())
                            RFQIDList.push(JSON.parse($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val()).filter(function(RFQ_OBJECT){
                                return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                                })
                            )
                            //   }
                        })
                    }
                    if (Email_PPList.length > 0) {
                        console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);
        
                        for(let R of RFQIDList){
                            __mailRFQ.push(R[0].EP_ER_QuoteRequestId);
        
                        }
        
                    //   return true;
                    }
                    if ($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val() != undefined && $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val().trim()!='')
                    var RFQID = JSON.parse($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;
        
                    if (RFQID != undefined && RFQID != ''){
                        //     MailBestQuote(thisTileOptions.id.match(/\d+$/)[0], JSON.parse($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val())[0].EP_ER_QuoteRequestId);
                        if(__mailRFQ == ""){
                            // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                            //booktradePopup(thisTileOptions, "booktradefcn" + thisTileOptions.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayfcn");
                            mapleOrderLoaderStop(thisTileOptions);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                            openValidationpopup('','No price selected for mailing !');
                            //End
                            return false;
                        }    
                        $( this ).dialog( "close" ); // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                        mapleOrderLoaderStart(thisTileOptions);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                        request_getDataFromAPI(
                        {
                            userName: sessionStorage.getItem("EQC_UserName").toString(),
                            rfqId: __mailRFQ.toString(),   //email best price RFQ for now 
                            CurrentTileID: thisTileOptions.id.match(/\d+$/)[0],
                            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                            QuoteMailType:"English"
                        },clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                            console.log(data);
                            TileId = data.CurrentTileID;
                            thisTileOptions = document.getElementById("td" +TileId);
                            mapleOrderLoaderStop(thisTileOptions); //LGTGTWINT-1866 | Chaitanya M | 13 April 2023
                            booktradePopup(thisTileOptions, "booktradeOption" + TileId, data.message, "DivOverlayOption");  //LGTGTWINT-1642 | Chaitanya M | 19 Apr 2023
                            
                        }).catch(error=>{
                        console.log(error);
                    
                        })
                    }else {
                        mapleOrderLoaderStop(thisTileOptions);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                        openValidationpopup('','Invalid RFQ ID ');
                    }                     

                    return true;
                    //email all quotes here             
                }
            }
          });
          $(dialogBoxOptions).dialog('open');

        }else
        {
            $(document).find('.ui-dialog').find('[id^="emailDialog_Options"]').empty().append(strEmail);
            $(dialogBoxOptions).dialog('open');
               
            var Email_PPList = [];
            var RFQIDList =[];
            var __mailRFQ=[];
            
            if($(document).find('.ui-dialog').find('[id^="emailDialog_Options"]').find('.chkBox_Email_PPCode').length>0)
            {
                $(document).find('.ui-dialog').find('[id^="emailDialog_Options"]').find('.chkBox_Email_PPCode').each(function(chkIndex,checkboxControl){
                    if(checkboxControl.checked){
                    Email_PPList.push($(checkboxControl).parent().text().trim())
                    RFQIDList.push(JSON.parse($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val()).filter(function(RFQ_OBJECT){
                        return RFQ_OBJECT['PP_CODE'].trim().toUpperCase()===$(checkboxControl).parent().text().toString().trim().toUpperCase();
                        })
                        )
                    }
                })
            }
            if (Email_PPList.length > 0) {
                console.log("Quote Email Initiated for " + Email_PPList.toString(), ' and for RFQS , ', RFQIDList);

                for(let R of RFQIDList){
                    __mailRFQ.push(R[0].EP_ER_QuoteRequestId);
                }

             //   return true;
            }
            if ($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val() != undefined && $(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val().trim()!='')
            var RFQID = JSON.parse($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val())[selectedBankIndex].EP_ER_QuoteRequestId;

            if (RFQID != undefined && RFQID != ''){
                //     MailBestQuote(thisTileOptions.id.match(/\d+$/)[0], JSON.parse($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val())[0].EP_ER_QuoteRequestId);
                if(__mailRFQ == ""){
                    // Changed for LGTGTWINT-1285: Message to be displayed on Email quote popup | Chaitanya M| 01-Feb-2023
                    //booktradePopup(thisTileOptions, "booktradefcn" + thisTileOptions.id.match(/\d+$/)[0], "No price selected for mailing !", "DivOverlayfcn");
                    mapleOrderLoaderStop(thisTileOptions);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    openValidationpopup('','No price selected for mailing !');
                    //End
                    return false;
                }     
                request_getDataFromAPI(
                {
                    userName: sessionStorage.getItem("EQC_UserName").toString(),
                    rfqId: __mailRFQ.toString(),   //email best price RFQ for now 
                    CurrentTileID: thisTileOptions.id.match(/\d+$/)[0],
                    "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
                    QuoteMailType:"English"
                },clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data=>{
                    console.log(data);
                    TileId = data.CurrentTileID;
                    thisTileOptions = document.getElementById("td" +TileId);
                    mapleOrderLoaderStop(thisTileOptions);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                    booktradePopup(thisTileOptions, "btnBookTradeOptions" + TileId, data.message, "DivOverlayOption");                      
                }).catch(error=>{
                    console.log(error);
                   
                })
            } else{
                mapleOrderLoaderStop(thisTileOptions);//LGTGTWINT-1866 Add a loader between the messages 'Emails have been initiated' and 'Email quotes sent successfully' | Chaitanya M | 13 April 2023
                openValidationpopup('','Invalid RFQ ID ');                      
            }         

        }
        $(thisTileOptions).find('[id^="OptionsBanksRow"]').children().each(function() {
           if($(thisTileOptions).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
      //  openValidationpopup('','Invalid RFQ ID ')
    }
}

function validateOrderOptions(thisTileOptions,_flag){    // LGTGTWINT-1279 : Instant Pricing : Order booking valdations.

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
            $(thisTileOptions).find('[id^="OptionsBanksRow"]').children().each(function() {
                if($(thisTileOptions).find('[id^="hdnSelectedBank"]').val() == $(this).find('button').html()) {
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
            return false;
        }


        if ($(thisTileOptions).find('[id^="hdnfinalTokenOptions"]').val() == "" || $(thisTileOptions).find('[id^="OptionsPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileOptions).find('[id^="OptionsPrices"]')[0].firstChild.innerHTML == "") {
            if(_flag == false){
                _validateOrderEQC = true; 
            }
           ValidateField($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').attr("id"), "Order Execution Failed!", thisTileOptions);
           return false;
        }


        if(parseFloat(JSON.parse($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').val())[0].EQOOUT) <= 0){
            if(_flag == false){

                _validateOrderEQC = true; 
            }
            ValidateField($(thisTileOptions).find('[id^="hdnChartPricesOptions"]').attr("id"), "Prices can not be negative 0r zero, Order Execution Failed!", thisTileOptions);
            return false;
        }

    }catch(er){

        console.log(er.message);
    }

}

function getExpirydatesOptions(thisTileOptions,_expiryDate, date){
    try {
        let tenorNumb = $(thisTileOptions).find("[id^='tenor_Options']").val();
        let tenorstring ="";
        if($(thisTileOptions).find("[id^='tenorddl']").val().toUpperCase() == "M"){
            tenorstring = "Month"
        }else{
            tenorstring = "Year"
        }
         
        let _tenorstr = tenorNumb + tenorstring;     
   
        let ReqEQOptionsDates ={
            "userName":sessionStorage.getItem("EQC_UserName").toString(),     
            "SoftTenor": _tenorstr,
            "UserMode":"Dealer",  
            "Exchange":getExchangeAndCcyFromBasket("", "exchangename", $(thisTileOptions).find('[id^="OptionsSharesDemo"]').val().trim())[0],
            "SettlementCcy":$(thisTileOptions).find("[id^='ddlCurrencySettlement']").val(),
            "Ccy":$(thisTileOptions).find("[id^='ddlCurrencySettlement']").val(),
            "Settlement_Days":"2",
            "Maturity_Days":"2",
            "Expiry_date":_expiryDate,
            "UnderlyingCode":$(thisTileOptions).find("[id^='OptionsSharesDemo']").val(),
            "EQC_TOKEN":sessionStorage.getItem("EQC_Token").toString()
        }

        request_getDataFromAPI(ReqEQOptionsDates, clientConfigdata.CommonMethods.NodeServer + "GetExpiryDatesIP").then(EQO => { 

             if (EQO.responseData != null && EQO.responseData != "") {

                let DatesOptions = (EQO.responseData)[0]['MaturityDate'] ;

                maturitydate = DatesOptions;
                TradeDate = DatesOptions['TradeDate'];
                ValueDate = DatesOptions['ValueDate'];

                $(thisTileOptions).find("[id^='hdnDatesOptions']").val(JSON.stringify(DatesOptions));
                $(thisTileOptions).find("[id^='Options_MaturityDate']").html((EQO.responseData)[0]['MaturityDate']); 
                $(thisTileOptions).find("[id^='Options_TradeDate']").html((EQO.responseData)[0]['TradeDate']); 
           
                let expiryDate = new Date(date);
                validate_dates(thisTileOptions,"Options_ExpiryDate",expiryDate,"Expiry Date");  // LGTGTWINT-1638 | Chaitanya M | 5 July 2023
                var date_setlement =$(thisTileOptions).find("[id^='Options_SettlDate']").html(); 
                var date_expiry = $(thisTileOptions).find("[id^='Options_ExpiryDate']").html();
                var date_maturity = $(thisTileOptions).find("[id^='Options_MaturityDate']").html();
            
                // LGTGTWINT-1638 | Chaitanya M | 05 Aug 2023
                //START
                checkdatesOptions(thisTileOptions,date_setlement,date_expiry,date_maturity);
                    
                // if(Date.parse(date_expiry) < Date.parse(date_setlement)){

                //     ValidateField($(thisTileOptions).find('[id^="Options_ExpiryDate"]').attr("id"),"Please enter valid Expiry date.",thisTileOptions); 
                //     return false;

                // }else if(Date.parse(date_maturity) < Date.parse(date_expiry)){ 

                //     ValidateField($(thisTileOptions).find('[id^="Options_ExpiryDate"]').attr("id"),"Please enter valid Expiry date.",thisTileOptions); 
                //     return false;
                // } 

                // GetRequiredDate(thisTileOptions,"ExpiryDate_Option",date_expiry);
                // GetRequiredDate(thisTileOptions,"MaturityDate_Option",date_expiry);  
                //END

            } else {
                 console.log("Error in Loading Expiry Dates at " + thisTileOptions.id,' resposne ', EQO);

            }
        })

    } catch (error) {
        
    }
}

//added for LGTGTWINT-1560 | Chaitanya M | 28 Feb 2023
// LGTGTWINT-1638 | Chaitanya M | 5 July 2023
//START
function checkdatesOptions(thistile,_setledate,_expirydate, _maturitydate) {
    try {
    
        // var date_setlement =$(thistile).find("[id^='Options_SettlDate']").html(); 
        // var date_expiry = $(thistile).find("[id^='Options_ExpiryDate']").html();
        // var date_maturity = $(thistile).find("[id^='Options_MaturityDate']").html();
             
        if(Date.parse(_expirydate) < Date.parse(_setledate)){

            ValidateField($(thistile).find('[id^="Options_ExpiryDate"]').attr("id"),"Please enter valid Expiry date.",thistile); 
            return false;

        }else if(Date.parse(_maturitydate) < Date.parse(_expirydate)){ 

            ValidateField($(thistile).find('[id^="Options_ExpiryDate"]').attr("id"),"Please enter valid Expiry date.",thistile); 
            return false;
        } 

        GetRequiredDate(thistile,"ExpiryDate_Option",_expirydate);
        //GetRequiredDate(thistile,"MaturityDate_Option",date_expiry); 
        $(thisTileOptions).find('[id^="btnBestPriceOptions"]').attr("disabled", false); 
       
    } catch (error) {
      
    }
  }
  //end
 