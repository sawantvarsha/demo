var FXDigitaloutput;
var FXDigital = [];
var dataArray;
var FXDigitaloutput;
var bookQuoteIdFXDigital;
var AskRateFXDigital = ""
var BidRateFXDigital = ""
var tenorListFXDigital = ["1W","2W","3W","4W","1M","2M","3M","4M","5M","6M","7M","8M","9M","10M","11M","1Y","2Y","3Y","5Y","7Y"];
var today = new Date();

$(document).ready(function () {
    try {

        // getProductDetailsFXD(clientConfigdata.FXDigital.typeFXDigital);

    } catch (err) {
        console.log(err.message);
    }
})

// To load FX Digital tile
function loadDigital(currId) {
    try {

        setDeafaultValuesFXDigital(currId);
        thisTileFXDigital = document.getElementById("td" + currId);
        $(thisTileFXDigital).find('[id^="loader_FXDigital"]').hide();

        // Added by RizwanS / Channged User id to gateway specific name / 16 Jun 2022 
        $(thisTileFXDigital).find('[id^="FXDRfqidpnl"]').hide();
        $(thisTileFXDigital).find('[id^="RFQIDFXD"]').html("");
        // END


        //Added For Dropdown Checks on save, update and change fields // 10-Dec-2021

        checkForDigitalType($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val(), thisTileFXDigital);

        $(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').on('change', function () {
            try {

                thisTileFXDigital = $(this).parents('.sorting')[0];
                checkForDigitalType($(this).val(), thisTileFXDigital);

            } catch (er) {
                console.log(er.message)
            }
        });

        $(thisTileFXDigital).find('[id^="DigitalTrigger"]').on('change', function () {
            try {

                thisTileFXDigital = $(this).parents(".sorting")[0];
                checkTriggerType($(thisTileFXDigital).find('[id^="DigitalTrigger"]').val().trim(), thisTileFXDigital);

            } catch (er) {
                console.log(er.message)
            }
        });

        //END

        $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').on('select', function () {

            try {

                fillDatesFXDigital($(this).parents('.sorting').find('[id^="FXDigital_CCYPairDemo"]').val(), $(this).parents('.sorting').find('[id^="FXDigital_TenorDemo"]').val(), currId);
                getCurrencyFXDigitalRate(currId);

            } catch (er) {
                console.log(er.message)
            }

        });

        $(thisTileFXDigital).find('[id^="FXDigital_TenorDemo"]').on('change', function () {
            try {
              

                fillDatesFXDigital($(this).parents('.sorting').find('[id^="FXDigital_CCYPairDemo"]').val(), $(this).parents('.sorting').find('[id^="FXDigital_TenorDemo"]').val(), $(this).parents('.sorting')[0].id.match(/\d+$/)[0]);
              

            } catch (error) {
                console.log(error.message);
                $(".lblError").html(error.message)
            }
        });


        //Added By RizwanS / JIRA - INT1FIN47 - 324 // 12 Jan 2022

        $(thisTileFXDigital).find('[id^="ModelPricing"]').on('change', function () {
            try {

                thisTileFXDigital = $(this).parents(".sorting")[0];

                getFNQEstValuesFX("","",thisTileFXDigital);


            } catch (error) { console.log(error.message); }
        });

        //END

    } catch (err) {
        console.log(err.message);
    }
}

//To set default values of FX Digital tile
function setDeafaultValuesFXDigital(currId) {
    try {
        thisTileFXDigital = document.getElementById("td" + currId);
        fillDropdownlistControl(tenorListFXDigital, $(thisTileFXDigital).find('[id^="FXDigital_TenorDemo"]').attr('id'));
        document.querySelector("#" + ($(thisTileFXDigital).find('[id^="FXDigital_TenorDemo"]').attr('id'))).selectedIndex = 5;
        $(thisTileFXDigital).find('[id^="FXDigital_ContractAmt"]').val("1,000,000.00");
        $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').val("EUR - USD");
        $(thisTileFXDigital).find('[id^="FXDigital_BuyVSCall"]').val("EUR");
        $(thisTileFXDigital).find('[id^="rateFXDigital"]').html("1.1097/1.1098");
        $(thisTileFXDigital).find('[id^="FXDigital_Strike"]').val("1.1097");
        
        clearPricerTable(thisTileFXDigital);

        //Added for ccy pair autocomplete / JIRA - FINGUI - 237 / 14 Feb 2022 
        callCcyautocompleteFX(thisTileFXDigital, "FXDigital_CCYPairDemo");
        //END

    } catch (err) {
        console.log(err.message);
    }
}

// To validate all the fields and call function FXDigital_calBestPrice
function callFXDigitalbestPrice(that) {
    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileFXDigital = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        validation_clear(); 
        clearPricerTable(thisTileFXDigital); 

                // Added by RizwanS / RFQ ID on UI / 16 Jun 2022 
                $(thisTileFXDigital).find('[id^="FXDRfqidpnl"]').hide();
                //END

        //Validation conditions added 

        // if ($.trim($(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').val()) == '') {
            // ValidateField($(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').attr('id'), "Please Select Currency Pair");
            // return false
        // } else if ($.trim($(thisTileFXDigital).find('[id^="FXDigital_ContractAmt"]').val()) == '' || parseFloat($(thisTileFXDigital).find('[id^="FXDigital_ContractAmt"]').val()) <= 0) {
            // ValidateField($(thisTileFXDigital).find('[id^="FXDigital_ContractAmt"]').attr('id'), "Please Enter Valid Contract Amount");
            // return false
        // } else if ($.trim($(thisTileFXDigital).find('[id^="FXDigital_TenorDemo"]').val()) == '') {
            // ValidateField($(thisTileFXDigital).find('[id^="FXDigital_TenorDemo"]').attr('id'), "Please Enter Tenor");
            // return false
        // } else if ($.trim($(thisTileFXDigital).find('[id^="FXDigital_Strike"]').val().replace(/,/g, "")) == '' || parseFloat($(thisTileFXDigital).find('[id^="FXDigital_Strike"]').val().replace(/,/g, "")) <= 0){
            // ValidateField($(thisTileFXDigital).find('[id^="FXDigital_Strike"]').attr('id'), "Please Enter Valid Strike Rate");
            // return false
        // }


        if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DDNTA" || $(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DDTA") {

            if ($.trim($(thisTileFXDigital).find('[id^="FXDigital_UB"]').val().replace(/,/g, "")) == '' || parseFloat($(thisTileFXDigital).find('[id^="FXDigital_UB"]').val().replace(/,/g, "")) <= 0) {
                ValidateField($(thisTileFXDigital).find('[id^="FXDigital_UB"]').attr('id'), "Please Enter Valid Upper Barrier.", thisTileFXDigital);
                return false
            } else if ($.trim($(thisTileFXDigital).find('[id^="FXDigital_LB"]').val().replace(/,/g, "")) == '' || parseFloat($(thisTileFXDigital).find('[id^="FXDigital_LB"]').val().replace(/,/g, "")) <= 0) {
                ValidateField($(thisTileFXDigital).find('[id^="FXDigital_LB"]').attr('id'), "Please Enter Valid Lower Barrier.", thisTileFXDigital);
                return false
            } else if (parseFloat($(thisTileFXDigital).find('[id^="FXDigital_UB"]').val().replace(/,/g, "")) < parseFloat($(thisTileFXDigital).find('[id^="FXDigital_LB"]').val().replace(/,/g, ""))) {
                ValidateField($(thisTileFXDigital).find('[id^="FXDigital_UB"]').attr('id'), "Upper barrier should be greater than lower barrier.", thisTileFXDigital);
                return false
            } else if (parseFloat($(thisTileFXDigital).find('[id^="FXDigital_UB"]').val().replace(/,/g, "")) < parseFloat($(thisTileFXDigital).find('[id^="FXDigital_Strike"]').val().replace(/,/g, ""))) {
                ValidateField($(thisTileFXDigital).find('[id^="FXDigital_UB"]').attr('id'), "Upper barrier should be greater than strike rate.", thisTileFXDigital);
                return false
            } else if (parseFloat($(thisTileFXDigital).find('[id^="FXDigital_Strike"]').val().replace(/,/g, "")) < parseFloat($(thisTileFXDigital).find('[id^="FXDigital_LB"]').val().replace(/,/g, ""))) {
                ValidateField($(thisTileFXDigital).find('[id^="FXDigital_Strike"]').attr('id'), "Strike Rate should be greater than lower barrier.", thisTileFXDigital);
                return false
            }
        } else if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DNTA") {

            if ($(thisTileFXDigital).find('[id^="DigitalTrigger"]').val().trim() == "ABOVE") {

                if ($.trim($(thisTileFXDigital).find('[id^="FXDigital_LB"]').val().replace(/,/g, "")) == '' || parseFloat($(thisTileFXDigital).find('[id^="FXDigital_LB"]').val().replace(/,/g, "")) <= 0) {
                    ValidateField($(thisTileFXDigital).find('[id^="FXDigital_LB"]').attr('id'), "Please Enter Valid Lower Barrier.", thisTileFXDigital);
                    return false
                } else if (parseFloat($(thisTileFXDigital).find('[id^="FXDigital_Strike"]').val().replace(/,/g, "")) < parseFloat($(thisTileFXDigital).find('[id^="FXDigital_LB"]').val().replace(/,/g, ""))) {
                    ValidateField($(thisTileFXDigital).find('[id^="FXDigital_LB"]').attr('id'), "Strike Rate should be greater than lower barrier.", thisTileFXDigital);
                    return false
                }

            } else {

                if ($.trim($(thisTileFXDigital).find('[id^="FXDigital_UB"]').val().replace(/,/g, "")) == '' || parseFloat($(thisTileFXDigital).find('[id^="FXDigital_UB"]').val().replace(/,/g, "")) <= 0) {
                    ValidateField($(thisTileFXDigital).find('[id^="FXDigital_UB"]').attr('id'), "Please Enter Valid Upper Barrier.", thisTileFXDigital);
                    return false
                } else if (parseFloat($(thisTileFXDigital).find('[id^="FXDigital_UB"]').val().replace(/,/g, "")) < parseFloat($(thisTileFXDigital).find('[id^="FXDigital_Strike"]').val().replace(/,/g, ""))) {
                    ValidateField($(thisTileFXDigital).find('[id^="FXDigital_UB"]').attr('id'), "Upper Barrier should be greater than Strike Rate.", thisTileFXDigital);
                    return false
                }

            }           

        } else if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DTA") {

            if ($(thisTileFXDigital).find('[id^="DigitalTrigger"]').val().trim() == "ABOVE") {

                if ($.trim($(thisTileFXDigital).find('[id^="FXDigital_UB"]').val().replace(/,/g, "")) == '' || parseFloat($(thisTileFXDigital).find('[id^="FXDigital_UB"]').val().replace(/,/g, "")) <= 0) {
                    ValidateField($(thisTileFXDigital).find('[id^="FXDigital_UB"]').attr('id'), "Please Enter Valid Upper Barrier.", thisTileFXDigital);
                    return false
                } else if (parseFloat($(thisTileFXDigital).find('[id^="FXDigital_UB"]').val().replace(/,/g, "")) < parseFloat($(thisTileFXDigital).find('[id^="FXDigital_Strike"]').val().replace(/,/g, ""))) {
                    ValidateField($(thisTileFXDigital).find('[id^="FXDigital_UB"]').attr('id'), "Upper Barrier should be greater than Strike Rate.", thisTileFXDigital);
                    return false
                }
            } else {

                if ($.trim($(thisTileFXDigital).find('[id^="FXDigital_LB"]').val().replace(/,/g, "")) == '' || parseFloat($(thisTileFXDigital).find('[id^="FXDigital_LB"]').val().replace(/,/g, "")) <= 0) {
                    ValidateField($(thisTileFXDigital).find('[id^="FXDigital_LB"]').attr('id'), "Please Enter Valid Lower Barrier.", thisTileFXDigital);
                    return false
                } else if (parseFloat($(thisTileFXDigital).find('[id^="FXDigital_Strike"]').val().replace(/,/g, "")) < parseFloat($(thisTileFXDigital).find('[id^="FXDigital_LB"]').val().replace(/,/g, ""))) {
                    ValidateField($(thisTileFXDigital).find('[id^="FXDigital_LB"]').attr('id'), "Strike Rate should be greater than lower barrier.", thisTileFXDigital);
                    return false
                }

            }

        }

        $(thisTileFXDigital).find('[id^="TBLFXDigital"]' + " td").each(function () {
            $(this).html("-");
        })

        $(thisTileFXDigital).find('[id^="loader_FXDigital"]').show();
        $(thisTileFXDigital).find('[id^="btnbtnBookTradeFXDigital"]').attr("disabled", true); // Disabling book trade button while pricing is happening - by Onkar E. 25/11/2019
        FXDigital_calBestPrice(that);


    } catch (err) {
        console.log(err.message);
    }
}

// To get the FX Digital expiry 
function fillDatesFXDigital(pair, tenorValue, that) {
    try {
        

        thisTileFXDigital = document.getElementById("td" + that);

        
        request_getDataFromAPI({

            "CurrencyPair": $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]')[0].value,
            "TradeDate": setBusinessDate,
            "iEntityID": EntityID,
            "Tenor_Code": tenorValue,
            "Fixing_Frequency":"",	
            "Settlement_Frequency":"",
            "DepoCcy": pair.split("-")[0].trim(),
            "AltCcy": pair.split("-")[1].trim(),
            "iProductId": productIDDigital,
            "I_ProductCode": productCodeDigital,
            "CurrentTileID": that,
            "token":"",
            "EntityID": EntityID,
            "LoginID":userName,
            "ProductCode": productCodeDigital,
            "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString()

        }, clientConfigdata.CommonMethods.NodeServer + "fillDatesFXO").then(data => {

            let thisTileFXDigital = document.getElementById("td" + data.CurrentTileID);
            let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

            if(responseHeader.toUpperCase() == "SUCCESS"){

            TradeDateFXDigital = setBusinessDate;
            $(thisTileFXDigital).find('[id^="FXDigital_Expiry"]').html(data.CalculateDatesResult.Dates[0].MaturityDate);
            $(thisTileFXDigital).find('[id^="hdnFXDigitalPremiumDate"]').val(data.CalculateDatesResult.Dates[0].ValueDate);
            $(thisTileFXDigital).find('[id^="hdnFXDigitalExpiry"]').val(data.CalculateDatesResult.Dates[0].FixingDate);
            $(thisTileFXDigital).find('[id^="hdnFXDigitalDeliveryDate"]').val(data.CalculateDatesResult.Dates[0].MaturityDate);
            $(thisTileFXDigital).find('[id^="hdnTenorDays"]').val(data.CalculateDatesResult.Dates[0].ExpiryDays);
            // Addded for CFINT-992 // 18-Sep-2020 //

            $(thisTileFXDigital).find('[id^="btnBestPriceFXDigital"]').attr("disabled", false);

            //END
        } else {

            let failReason = data.CalculateDatesResult.A_ResponseHeader.FailedReason; 
            
            ValidateField($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').attr('id'), failReason, thisTileFXDigital);

        } 

        }).catch(error => { console.log(error); })

    } catch (error) {
        console.log(error.message);
        $(".lblError").html(error.message)
    }
}

// To calculate best price for FX Digital
function FXDigital_calBestPrice(that, Scheduleflag) {
    try {

        TileId = that.id.match(/\d+$/)[0];
        thisTileFXDigital = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        console.log("PricingFor Digital ::", TileId, productName); //Removed unwanted console log || RizwanS || 08 May 2023


        //Digital all UI Check for pricing 14 Dec 2021

        // TiggerCondition

        let TriggerCondition = "";

        if ($(thisTileFXDigital).find('[id^="DigitalTrigger"]').val().trim() == "ABOVE") {

            if ($(thisTileFXDigital).find('[id^="DigitalTrigger"]').children("option")[0].innerText != "always above") {

                TriggerCondition = "at or above"

            } else {

                TriggerCondition = "always above"
            }
            
        } else {

            if ($(thisTileFXDigital).find('[id^="DigitalTrigger"]').children("option")[1].innerText != "always below") {

                TriggerCondition = "at or below"

            } else {

                TriggerCondition = "always below"
            }

        }

        //END

        // DigitalType and Option Type Check

        let DigitalType = "";
        let OptionType = "";

        if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DE") {

            DigitalType = "Digital-European";
            OptionType = "";

        } else if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DNTA") {

            DigitalType = "Digital-No Touch American";
            OptionType = "NOTOUCH";

        } else if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DTA") {

            DigitalType = "Digital-Touch American";
            OptionType = "TOUCH";

        } else if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DDNTA") {

            DigitalType = "Double Digital-Touch American";
            OptionType = "DOUBLENOTOUCH";

        } else if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DDTA") {

            DigitalType = "Double Digital-No Touch American";
            OptionType = "DOUBLETOUCH";
        }

        //END


        var XmlStringFXDigital = "<ExcelSheets>" +
            "<Sheet1>" +
            "<Product_Name>" + ProductNameDigital +"</Product_Name>" +
            "<Hedging_x0020_Type>" + clientConfigdata.FXDCommonMethods.Hedging_Type + "</Hedging_x0020_Type>" +
            "<Spotrate>" + $(thisTileFXDigital).find('[id^="FXDigital_Strike"]').val() + "</Spotrate>" +
            "<Notional>" + $(thisTileFXDigital).find('[id^="FXDigital_ContractAmt"]').val().replace(/,/g, "").split(".")[0] + "</Notional>" +
            "<CustID>" + custID + "</CustID>" +
            "<Customer_Name>" + custName + "</Customer_Name>" +
            "<OptionCut>" + clientConfigdata.FXDCommonMethods.OptionCut + "</OptionCut>" +
            "<NonDeliveryYN>N</NonDeliveryYN>" +
            "<Strike>" + $(thisTileFXDigital).find('[id^="FXDigital_Strike"]').val() + "</Strike>" +
            "<CcyPair>" + $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]')[0].value + "</CcyPair>" +
            "<AltCcy>" + $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').val().split("-")[1].trim() + "</AltCcy>" +
            "<InvCcy>" + $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').val().split("-")[0].trim() + "</InvCcy>" +
            "<PremiumCcy>" + $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').val().split("-")[0].trim() + "</PremiumCcy>" +
            "<PremiumDate>" + $(thisTileFXDigital).find('[id^="hdnFXDigitalPremiumDate"]').val() + "</PremiumDate>" +
            "<BuySell>" + (($(thisTileFXDigital).find('[id^="rbRowFXDigital"]')[0]).checked ? "Sell" : "Buy") + "</BuySell>" +
            "<FixingDate>" + $(thisTileFXDigital).find('[id^="hdnFXDigitalExpiry"]').val() + "</FixingDate>" +
            "<TradeDate>" + setBusinessDate + "</TradeDate>" +
            "<SettDate>" + $(thisTileFXDigital).find('[id^="hdnFXDigitalDeliveryDate"]').val() + "</SettDate>" +
            "<Tenor>" + $(thisTileFXDigital).find('[id^="FXDigital_TenorDemo"]').val() + "</Tenor>" +
            "<TenorDays>" + $(thisTileFXDigital).find('[id^="hdnTenorDays"]').val() + "</TenorDays>" +
            "<optionType>" + OptionType + "</optionType>" +
            "<LowerBarrier>" + $(thisTileFXDigital).find('[id^="FXDigital_LB"]').val() + "</LowerBarrier>" +
            "<UpperBarrier>" + $(thisTileFXDigital).find('[id^="FXDigital_UB"]').val() + "</UpperBarrier>" +
            "<DigitalType>" + DigitalType + "</DigitalType>" +
            "<TriggerCondition>" + TriggerCondition +"</TriggerCondition>" +
            "<GlobalCcy>" + $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').val().split("-")[0].trim()+"</GlobalCcy>" +
            "<Entity_ID>" + sessionStorage.getItem("HomeEntityID") + "</Entity_ID>" +
            "<CAI_ID>" + clientConfigdata.FXDCommonMethods.CAI_ID + "</CAI_ID>" +
            "</Sheet1>" +
            "</ExcelSheets>"


            if(Scheduleflag){
       
                GetRulescheduleFXD(TileId, XmlStringFXDigital, TemplateCodeDigital, TemplateIDDigital);
    
            } else{

            USERID_FXDigital = "MGU_" + sessionStorage.getItem("Username");
            $(thisTileFXDigital).find('[id^="hdnUserIDDigital"]').val(USERID_FXDigital);


        request_getDataFromAPI({

            "ProductType": productCodeDigital,
            "CurrencyPair": $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]')[0].value,
            "DepositCurrency": $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').val().split("-")[0].trim(),
            "AlternateCurrency": $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').val().split("-")[1].trim(),
            "PremCurrency": $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').val().split("-")[0].trim(),
            "SettlementCcy": $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').val().split("-")[0].trim(),
            "AmountInDepositCurrency": $(thisTileFXDigital).find('[id^="FXDigital_ContractAmt"]').val().replace(/,/g, "").split(".")[0],
            "BuySell": (($(thisTileFXDigital).find('[id^="rbRowFXDigital"]')[0]).checked ? "Sell" : "Buy"),
            "CallPut": "CALL",
            "Strike": $(thisTileFXDigital).find('[id^="FXDigital_Strike"]').val(),
            "LowerBarrier": 0,
            "UpperBarrier": 0,
            "BarrierType": "",
            "KnockIn_Style": "EUROPEAN",
            "KnockOut_Style": "EUROPEAN",
            "RMMarginPercentage": 0.150000,
            "Tenor": $(thisTileFXDigital).find('[id^="FXDigital_TenorDemo"]').val(),
            "TradeDate": setBusinessDate,
            "ValueDate": $(thisTileFXDigital).find('[id^="hdnFXDigitalPremiumDate"]').val(),
            "FixingDate": $(thisTileFXDigital).find('[id^="hdnFXDigitalExpiry"]').val(),
            "MaturityDate": $(thisTileFXDigital).find('[id^="hdnFXDigitalDeliveryDate"]').val(),
            "UserID":  sessionStorage.getItem("Username"),
            "EntityId": sessionStorage.getItem("HomeEntityID"),
            "PriceProviderDetails": LPListFXDigital,
            "ExternalXMLString": XmlStringFXDigital,
            "TemplateCode": TemplateCodeDigital,
            "TemplateID": TemplateIDDigital,
            "ProductID": productIDDigital,
            "currentTile": TileId,
            "token":"",
            "EntityID": sessionStorage.getItem("HomeEntityID"),
            "LoginID": sessionStorage.getItem("Username"),
            "ProductCode": productCodeDigital,
            "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString()


        }, clientConfigdata.CommonMethods.NodeServer + "GetPriceFXDigital", "", "POST", thisTileFXDigital,"btnBestPriceFXDigital").then(dataFXDigital => {

            thisTileFXDigital = document.getElementById("td" + dataFXDigital.currentTile);

            let responseHeader = dataFXDigital.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.Status;

            if(responseHeader.toUpperCase() == "SUCCESS"){

            console.log("Best Price Log's for Tile FXDigital ::" + " " + dataFXDigital.currentTile + "\n" + dataFXDigital.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody[0].o_BestPriceLog);
            console.log("Log's for Tile FXDigital :: DCDRFQID ==" + dataFXDigital.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody[0].o_DCDRFQID + "\n" + "NoteMasterID==" + dataFXDigital.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody[0].NoteMasterID + "\n" + "USERID==" + $(thisTileFXDigital).find('[id^="hdnUserIDDigital"]').val());
            
               // Added by RizwanS / RFQ ID on UI / 16 Jun 2022 
               $(thisTileFXDigital).find('[id^="FXDRfqidpnl"]').show();
               $(thisTileFXDigital).find('[id^="RFQIDFXD"]').html("");
               $(thisTileFXDigital).find('[id^="RFQIDFXD"]').html(dataFXDigital.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody[0].o_DCDRFQID);
               // END
            
            $(thisTileFXDigital).find('[id^="FXDigitalBanksRow"]').empty();
            $(thisTileFXDigital).find('[id^="FXDigitalPrices"]').empty();
            // Added by Atharva - Timers - START
            $(thisTileFXDigital).find('[id^="FXDigital_TimerRow"]').empty();
            // END
            // Storing price object in hidden field of current tile 
            FXDigitalPriceData = dataFXDigital.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody;
            $(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val(JSON.stringify(FXDigitalPriceData));


            if (JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val())[0].provider == null || JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val())[0].NoteMasterID == null || JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val())[0].bestPriceProvider == "FAIL") {
                $(thisTileFXDigital).find('[id^="FXDigitalBanksRow"]').append("<td> - </td>");
                $(thisTileFXDigital).find('[id^="FXDigitalPrices"]').append("<td> - </td>");
                // Added by Atharva - Timers - START
                $(thisTileFXDigital).find('[id^="FXDigital_TimerRow"]').append("<td> - </td>");
                // END
                $(thisTileFXDigital).find('[id^="loader_FXDigital"]').hide();
                $(thisTileFXDigital).find('[id^="btnBookReqFXDigital"]').attr("disabled", false);
               
                return false
            } else {
                var BestPP = JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val())[0].bestPriceProvider.split(":")[0];
                DCDRFQidFXDigital = JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val())[0].o_DCDRFQID;
                bestProviderFXDigital = JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val())[0].bestPriceProvider.split(":")[0];
                outJson = JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val());
                // Added by Atharva - Timers - START
                // Passing extra parameter to plotprice
                quoteidFXDigital = PlotPrice(JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val()), JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val())[0].bestPriceProvider.split(":")[0], "#" + ($(thisTileFXDigital).find('[id^="FXDigitalBanksRow"]').attr('id')), "#" + ($(thisTileFXDigital).find('[id^="FXDigitalPrices"]').attr('id')), dataFXDigital.currentTile);
                $(thisTileFXDigital).find('[id^="hdnQuoteIDFXDigital"]').val(quoteidFXDigital);
                // Added by Atharva - Timers - START
                if(BestPP != "FAIL" && BestPP !== undefined && BestPP != "" && BestPP != null) {
                    startTimers(dataFXDigital.currentTile);
                }
                // END
            }

            $(thisTileFXDigital).find('[id^="loader_FXDigital"]').hide();
            $(thisTileFXDigital).find('[id^="btnBookReqFXDigital"]').attr("disabled", false); // Enabling book trade button when pricing is over 

            //if (JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val()) != null || JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val()) != undefined || JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val()).bestPriceProvider.split(":")[0] != "FAIL") {
            //    drawgraphFXDigital($(thisTileFXDigital).find('[id^="canvas"]').attr('id'));
            //}

        } else {

            let failReason = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason; 
            
            ValidateField($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').attr('id'), failReason, thisTileFXDigital);

        } 
            
        }).catch(error => { console.log(error); })
      }
    } catch (error) {
        console.log(error.message);
        $(".lblError").html(error.message);
    }
}

// To book trade after the best price
function booktradeDigital(that) {
    try {

        TileId = that.id.match(/\d+$/)[0];
        thisTileFXDigital = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        // Added by Atharva - Timers - START
        if(("td"+TileId) in myInterval) {
            clearInterval(myInterval["td"+TileId]);
            delete myInterval["td"+TileId];
        }
        // END
        console.log("BookingFor ::", TileId, thisTileFXDigital, productName);
        $(thisTileFXDigital).find('[id^="loader_FXDigital"]').show();
        if (JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val()) == "") {

            booktradePopup(that, "btnBookTradeFXDigital" + TileId, "Please Best Price Again Before Book Trade, Order Execution Failed!", "DivOverlayFXDigital");
            $(thisTileFXDigital).find('[id^="loader_FXDigital"]').hide();
            return false;
        }
        // Added by Atharva - START
        // Getting the data of price to be selected.
        var isNonBestPrice = false;
        if(clientConfigdata.CommonMethods.NonBestPrice == "Y") {
            isNonBestPrice = true;
        }
        else {
            isNonBestPrice = false;
        }
        var priceIndex = -1;
        if(isNonBestPrice) {
            priceIndex = parseInt($(thisTileFXDigital).find('[id^="hdnPriceIndexFXDigital"]').val());
        }
        else {
            priceIndex = 0;
        }
        console.assert(priceIndex >= 0);
        var jsonHdnPrices = JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val());
        var dcdrfqid_val = '';
        for(let i = 0; i < jsonHdnPrices.length; i++) {
            // Finding the only json entry which contains the DCDRFQID, which got scattered while sorting the hdnPrices.
            if(jsonHdnPrices[i].o_DCDRFQID != '') {
                dcdrfqid_val = jsonHdnPrices[i].o_DCDRFQID;
            }
        }
        // dcdrfqid_val must not be null or empty
        console.assert(dcdrfqid_val != '');
        // below also changed index from 0 to priceIndex variable.
        // END
        // To Get Best LP RFQID Details || RizwanS || 09-Jan-2020

        var FXDigital_DCDRFQID;

        for (i = 0; i < JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val()).length; i++) {

            if (JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val())[i].o_DCDRFQID != "") {
                FXDigital_DCDRFQID = JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val())[i].o_DCDRFQID
            }
        }


        // END

        var bookObjectDigital = request_getDataFromAPI({

            "EntityId": EntityID,
            "DCD_RFQId": FXDigital_DCDRFQID,
            "External_RFQId":$(thisTileFXDigital).find('[id^="hdnQuoteIDFXDigital"]').val(),
            "PriceProviderName": JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val())[priceIndex].provider,
            "ProductCode": productCodeDigital,
            "CurrentTileID": TileId,
            "token":"",          
            "EntityID": EntityID,
            "LoginId": userName,
            "LoginID": userName,
            "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString()


        }, clientConfigdata.CommonMethods.NodeServer + "BookOrderFXProducts").then(bookObjectDigital => {

            let thisTileFXDigital = document.getElementById("td" + bookObjectDigital.CurrentTileID);

            TileId = bookObjectDigital.CurrentTileID;

            let responseHeader = data.BookTradeAndGetExternalTradeNumberReqJSONResult.A_ResponseHeader.Status; 

            if(responseHeader.toUpperCase() == "SUCCESS"){

            // Handle null exception for book request, JIRA ID: CFINT-678 - Added by RijwanS. (03/12/2019)
            if (bookObjectDigital.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.DealNo == "" || bookObjectDigital.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.DealNo == null) {
                var orderplaced = "FX Digital ::" + " " + bookObjectDigital.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.Message
            } else {
                var orderno = bookObjectDigital.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.Message.split(":")[1];
                // Added by Atharva - Timers - START
                // Changed the provider name in message from bestpriceprovider to whichever the user has selected.
                var orderplaced = "FX Digital :: Deal No." + bookObjectDigital.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.DealNo + "<br>" + "Order Placed Successfully with Counterparty " + JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val())[priceIndex].provider //JSON.parse($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val())[0].provider 
                    + " and Order ID  " + orderno;
            }

            $(thisTileFXDigital).find('[id^="hdnBlotterURLFXDigital"]').val(clientConfigdata.CommonMethods.getBlotterURLFXD);
            $(thisTileFXDigital).find('[id^="OrderBlotter"]').css({ display: "inline" });
            
            // booktradePopup(that, "btnBookTradeFXDigital" + TileId, orderplaced, "DivOverlayFXDigital");

            slideNotification("#b34b3b", orderplaced, thisTileFXDigital);

            $(thisTileFXDigital).find('[id^="loader_FXDigital"]').hide();
            $(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').val("");
            // Added by Atharva - START
            $(thisTileFXDigital).find('.pricesRow').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            $(thisTileFXDigital).find('.banksNameRow').children().each(function() {
                $(this).find("button").attr('disabled', true);
            });
            $(thisTileFXDigital).find('[id^="BookTrade"]').attr('disabled', true);
            $(thisTileFXDigital).find('[id*="BookReq"]').attr('disabled', true);
            blockPriceButtons(TileId);
            // END

        } else {
            
            let failReason = data.BookTradeAndGetExternalTradeNumberReqJSONResult.A_ResponseHeader.FailedReason; 
                        
            ValidateField($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').attr('id'), failReason, thisTileFXDigital);
        
        } 

        }).catch(error => { console.log(error); })


    } catch (er) {
        console.log(er.message);
        booktradePopup(that, "btnBookTradeFXDigital" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlayFXDigital");
        $(thisTileFXDigital).find('[id^="loader_FXDigital"]').hide();
    } finally {

    }
}

//To get the spot/strike price according to the currency pair.
function getCurrencyFXDigitalRate(currId) {
    try {
        thisTileFXDigital = document.getElementById("td" + currId);
        // Addded for CFINT-992 // 18-Sep-2020 //

        //  $(thisTileFXDigital).find('[id^="btnBestPriceFXDigital"]').attr("disabled", true);

        //END
        request_getDataFromAPI({
            

            "I_StandardPair": $(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').val().trim(),
            "I_ProductCode": productCodeDigital,
            "currentTile": currId,
            "token":"",
            "EntityID": EntityID,
            "LoginID": userName,
            "ProductCode": productCodeDigital,
            "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString()

        }, clientConfigdata.CommonMethods.NodeServer + "GetFXRatesByCurrencyNode").then(data => {
            thisTileFXDigital = document.getElementById("td" + data.currentTile);

            let responseHeader = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.Status; 

            if(responseHeader.toUpperCase() == "SUCCESS"){

            $(thisTileFXDigital).find('[id^="hdnDecimalRateFXDigital"]').val(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.DecimalRate);
            $(thisTileFXDigital).find('[id^="hdnFXDigitalBid"]').val(numberWithCommas(Number(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.BidRate).toFixed(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.DecimalRate)));
            $(thisTileFXDigital).find('[id^="hdnFXDigitalAsk"]').val(numberWithCommas(Number(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.AskRate).toFixed(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.DecimalRate)));

            $(thisTileFXDigital).find('[id^="rateFXDigital"]').html($(thisTileFXDigital).find('[id^="hdnFXDigitalBid"]').val() + " / " + $(thisTileFXDigital).find('[id^="hdnFXDigitalAsk"]').val());
            $(thisTileFXDigital).find('[id^="FXDigital_Strike"]')[0].value = $(thisTileFXDigital).find('[id^="hdnFXDigitalBid"]').val();

            // Addded for CFINT-992 // 18-Sep-2020 //

            $(thisTileFXDigital).find('[id^="btnBestPriceFXDigital"]').attr("disabled", false);

            //END
            fillDatesFXDigital($(thisTileFXDigital).find('[id^="FXDigital_CCYPairDemo"]').val(), $(thisTileFXDigital).find('[id^="FXDigital_TenorDemo"]').val(), currId);

        } else {
            
            let failReason = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.FailedReason; 
                        
            ValidateField($(thisTileFXDigital).find('[id^="hdnPricesFXDigital"]').attr('id'), failReason, thisTileFXDigital);
        
        } 

        }).catch(error => { console.log(error); })

    } catch (error) {

    }
}


//Added For Dropdown Combo checks / 14 Dec 2021 / RizwanS

function checkForDigitalType(checkFor, thisTileFXDigital, calledFromIndexDigital) {

    try {
        if (calledFromIndexDigital != undefined) {

            if (checkFor.trim().toUpperCase() == "DE") {

                
                $(thisTileFXDigital).find('[id^="DigitalTrigger"]').prop('disabled', false);
                checkTriggerOptions(thisTileFXDigital, false);
                checkTriggerType($(thisTileFXDigital).find('[id^="DigitalTrigger"]').val().trim(), thisTileFXDigital, calledFromIndexDigital);


            } else if (checkFor.trim().toUpperCase() == "DNTA") {

                $(thisTileFXDigital).find('[id^="DigitalTrigger"]').prop('disabled', false);
                checkTriggerOptions(thisTileFXDigital, true);
                checkTriggerType($(thisTileFXDigital).find('[id^="DigitalTrigger"]').val().trim(), thisTileFXDigital, calledFromIndexDigital);

            } else if (checkFor.trim().toUpperCase() == "DTA") {

                $(thisTileFXDigital).find('[id^="DigitalTrigger"]').prop('disabled', false);
                checkTriggerOptions(thisTileFXDigital, false);
                checkTriggerType($(thisTileFXDigital).find('[id^="DigitalTrigger"]').val().trim(), thisTileFXDigital, calledFromIndexDigital);

            } else if (checkFor.trim().toUpperCase() == "DDNTA" || checkFor.trim().toUpperCase() == "DDTA") {

                $(thisTileFXDigital).find('[id^="DigitalTrigger"]').prop('disabled', true);
                checkTriggerOptions(thisTileFXDigital, false);
                checkTriggerType($(thisTileFXDigital).find('[id^="DigitalTrigger"]').val().trim(), thisTileFXDigital, calledFromIndexDigital);

            } 
        }

        else {

            if (checkFor.trim().toUpperCase() == "DE") {

                $(thisTileFXDigital).find('[id^="DigitalTrigger"]').prop('disabled', false);
                checkTriggerOptions(thisTileFXDigital, false);
                checkTriggerType($(thisTileFXDigital).find('[id^="DigitalTrigger"]').val().trim(), thisTileFXDigital);

            } else if (checkFor.trim().toUpperCase() == "DNTA") {

                $(thisTileFXDigital).find('[id^="DigitalTrigger"]').prop('disabled', false);
                checkTriggerOptions(thisTileFXDigital,true);
                checkTriggerType($(thisTileFXDigital).find('[id^="DigitalTrigger"]').val().trim(), thisTileFXDigital);

            } else if (checkFor.trim().toUpperCase() == "DTA") {

                $(thisTileFXDigital).find('[id^="DigitalTrigger"]').prop('disabled', false);
                checkTriggerOptions(thisTileFXDigital, false);
                checkTriggerType($(thisTileFXDigital).find('[id^="DigitalTrigger"]').val().trim(), thisTileFXDigital);


            } else if (checkFor.trim().toUpperCase() == "DDNTA" || checkFor.trim().toUpperCase() == "DDTA") {

                $(thisTileFXDigital).find('[id^="DigitalTrigger"]').prop('disabled', true);
                checkTriggerOptions(thisTileFXDigital, false);
                checkTriggerType($(thisTileFXDigital).find('[id^="DigitalTrigger"]').val().trim(), thisTileFXDigital);
               
            }
         }

    } catch (error) {

    }
}

function checkTriggerType(triggerType, thisTileFXDigital, calledFromIndex) {
    try {

        if (calledFromIndex != undefined) {

            if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DE") {

                $(thisTileFXDigital).find('[id^="FXDigital_UB"]').prop('disabled', true);
                $(thisTileFXDigital).find('[id^="FXDigital_LB"]').prop('disabled', true);

            } else if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DNTA") {

                if (triggerType == "ABOVE") {

                    $(thisTileFXDigital).find('[id^="FXDigital_UB"]').prop('disabled', true);
                    $(thisTileFXDigital).find('[id^="FXDigital_LB"]').prop('disabled', false);

                } else {

                    $(thisTileFXDigital).find('[id^="FXDigital_UB"]').prop('disabled', false);
                    $(thisTileFXDigital).find('[id^="FXDigital_LB"]').prop('disabled', true);
                }

            } else if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DTA") {

                if (triggerType == "ABOVE") {

                    $(thisTileFXDigital).find('[id^="FXDigital_UB"]').prop('disabled', false);
                    $(thisTileFXDigital).find('[id^="FXDigital_LB"]').prop('disabled', true);

                } else {

                    $(thisTileFXDigital).find('[id^="FXDigital_UB"]').prop('disabled', true);
                    $(thisTileFXDigital).find('[id^="FXDigital_LB"]').prop('disabled', false);
                }

            } else if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DDNTA" || $(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DDTA") {

                $(thisTileFXDigital).find('[id^="FXDigital_UB"]').prop('disabled', false);
                $(thisTileFXDigital).find('[id^="FXDigital_LB"]').prop('disabled', false);
            }


        } else {

            if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val()== "DE") {

                $(thisTileFXDigital).find('[id^="FXDigital_UB"]').val("").prop('disabled', true);
                $(thisTileFXDigital).find('[id^="FXDigital_LB"]').val("").prop('disabled', true);

            } else if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DNTA") {

                if (triggerType == "ABOVE") {

                    $(thisTileFXDigital).find('[id^="FXDigital_UB"]').val("").prop('disabled', true);
                    $(thisTileFXDigital).find('[id^="FXDigital_LB"]').val("").prop('disabled', false);

                } else {

                    $(thisTileFXDigital).find('[id^="FXDigital_UB"]').val("").prop('disabled', false);
                    $(thisTileFXDigital).find('[id^="FXDigital_LB"]').val("").prop('disabled', true);
                }

            } else if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DTA") {

                if (triggerType == "ABOVE") {

                    $(thisTileFXDigital).find('[id^="FXDigital_UB"]').val("").prop('disabled', false);
                    $(thisTileFXDigital).find('[id^="FXDigital_LB"]').val("").prop('disabled', true);

                } else {

                    $(thisTileFXDigital).find('[id^="FXDigital_UB"]').val("").prop('disabled', true);
                    $(thisTileFXDigital).find('[id^="FXDigital_LB"]').val("").prop('disabled', false);
                }

            } else if ($(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DDNTA" || $(thisTileFXDigital).find('[id^="ddlDigitalOptions"]').val() == "DDTA") {

                $(thisTileFXDigital).find('[id^="FXDigital_UB"]').val("").prop('disabled', false);
                $(thisTileFXDigital).find('[id^="FXDigital_LB"]').val("").prop('disabled', false);
            }


        }

    } catch (error) {

    }

}

function checkTriggerOptions(thisTileFXDigital, flag) {

    try {

        if (flag != false) {

            $(thisTileFXDigital).find('[id^="DigitalTrigger"]').children("option")[0].innerText = "always above"
            $(thisTileFXDigital).find('[id^="DigitalTrigger"]').children("option")[1].innerText = "always below"

        } else {

            $(thisTileFXDigital).find('[id^="DigitalTrigger"]').children("option")[0].innerText = "at or above"
            $(thisTileFXDigital).find('[id^="DigitalTrigger"]').children("option")[1].innerText = "at or below"
        }

    } catch (error) {

        console.log(error.message);

    }

}


function viewScheduleFXDigital(that){

    try {

        FXDigital_calBestPrice(that, true);

    }catch(error){

        console.log(error.message);
    }
}

// EMD



