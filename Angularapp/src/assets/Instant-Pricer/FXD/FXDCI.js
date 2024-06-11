var FXDCIoutput;
var FXDCI = [];
var dataArray;
var FXDCIoutput;
var bookQuoteIdFXDCI;
var AskRateFXDCI = ""
var BidRateFXDCI = ""
var tenorListFXDCI = ["1W", "2W", "3W", "1M", "2M", "3M", "6M", "9M", "1Y"];
var today = new Date();

$(document).ready(function () {
    try {

        // getProductDetailsFXD(clientConfigdata.FXDCI.typeFXDCI);

    } catch (err) {
        console.log(err.message);
    }
})

// To load FX DCI tile
function loadDCI(currId) {
    try {
        
        setDeafaultValuesFXDCI(currId);
        thisTileFXDCI = document.getElementById("td" + currId);
        $(thisTileFXDCI).find('[id^="loader_FXDCI"]').hide();

        if ($(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().trim() != "") {

            if ($(thisTileFXDCI).find('[id^="ddlDCIOptions"]').val == "Vanilla Call") {

                $(thisTileFXDCI).find('[id^="FXDCI_BuyVSCall"]')[0].innerText = $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[0].trim()
            } else {
                $(thisTileFXDCI).find('[id^="FXDCI_BuyVSCall"]')[0].innerText = $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim()
            }
        } else {
            $(thisTileFXDCI).find('[id^="FXDCI_BuyVSCall"]')[0].innerText = $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[0].trim() = "";
            $(thisTileFXDCI).find('[id^="FXDCI_BuyVSCall"]')[0].innerText = $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim() = "";
        }

        $(thisTileFXDCI).find('[id^="FXDCICashbuySell"]').change(function () {
            try {
                if ($(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val() == "") {
                    $(this).parents('.sorting').find('[id^="rateFXDCI"]').html("-");
                } else { }
            } catch (error) { console.log(error.message); }
        });

        $(thisTileFXDCI).find('[id^="FXDCI_ContractAmt"]').on('select change', function () {
            try {
               
                if ($(this).parents('.sorting').find('[id^="ddlDCIOptions"]')[0].value != "Vanilla Call") {

                   if($(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim().includes("JPY") || $(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim().includes("KRW") || $(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim().includes("IDR")){
                        
                       FormatNotionalCommon($(thisTileFXDCI).find('[id^="FXDCI_ContractAmt"]').val(), this , $(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim());
                         
                  }

        }
           

            } catch (error) { console.log(error.message); }
        });

        $(thisTileFXDCI).find('[id^="ddlDCIOptions"]').on('change', function () {
            try {

            if ($(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]')[0].value != "") {

                if ($(this).parents('.sorting').find('[id^="ddlDCIOptions"]')[0].value == "Vanilla Call") {
                    $(this).parents('.sorting').find('[id^="FXDCI_BuyVSCall"]')[0].innerText = $(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[0].trim();
                    $(this).parents('.sorting').find('[id^="FXDCI_ContractAmt"]').val(formatCurrency($(this).parents('.sorting').find('[id^="FXDCI_ContractAmt"]')[0].value.replace(/,/g , '')));

                } else {

                    $(this).parents('.sorting').find('[id^="FXDCI_BuyVSCall"]')[0].innerText = $(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim()
                   
                    if($(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim().includes("JPY") || $(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim().includes("KRW") || $(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim().includes("IDR")){
                        
                        $(this).parents('.sorting').find('[id^="FXDCI_ContractAmt"]').val(numberWithOnlyCommas($(this).parents('.sorting').find('[id^="FXDCI_ContractAmt"]')[0].value));
                         
                    }
                }
                }
            } catch(er){
                console.log(er.message)
            }
        });

        $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').on('select', function () {
       
        try {
            
            fillDatesFXDCI($(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val(), $(this).parents('.sorting').find('[id^="FXDCI_TenorDemo"]').val(), currId);
            var val = this.value;
            if ($(this).parents('.sorting').find('[id^="ddlDCIOptions"]')[0].value == "Vanilla Call") {

               $(this).parents('.sorting').find('[id^="FXDCI_BuyVSCall"]')[0].innerText = $(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[0].trim();
               $(this).parents('.sorting').find('[id^="FXDCI_ContractAmt"]').val(formatCurrency($(this).parents('.sorting').find('[id^="FXDCI_ContractAmt"]')[0].value.replace(/,/g , '')));
                    
            } else {
                $(this).parents('.sorting').find('[id^="FXDCI_BuyVSCall"]')[0].innerText = $(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim();

                  if($(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim().includes("JPY") || $(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim().includes("KRW") || $(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim().includes("IDR") ){

                       $(this).parents('.sorting').find('[id^="FXDCI_ContractAmt"]').val(numberWithOnlyCommas($(this).parents('.sorting').find('[id^="FXDCI_ContractAmt"]')[0].value));
                  }
                  else{

                    $(this).parents('.sorting').find('[id^="FXDCI_ContractAmt"]').val(formatCurrency($(this).parents('.sorting').find('[id^="FXDCI_ContractAmt"]')[0].value.replace(/,/g , '')));
                
                }

            }
            getCurrencyFXDCIRate(currId);

        }catch(er){
            console.log(er.message)
        }

        });

        $(thisTileFXDCI).find('[id^="FXDCI_TenorDemo"]').on('change', function () {
            try {
                if (
                    $(this).parents('.sorting').find('[id^="FXDCI_TenorDemo"]')[0].classList[0].indexOf("ValidateFieldCSS") == -1) {
                    $(this).parents('.sorting').find('[id^="FXDCI_TenorDemo"]').removeClass('ValidateFieldCSS')
                    document.getElementById("required").style.display = "none"
                }
                fillDatesFXDCI($(this).parents('.sorting').find('[id^="FXDCI_CCYPairDemo"]').val(), $(this).parents('.sorting').find('[id^="FXDCI_TenorDemo"]').val(), $(this).parents('.sorting')[0].id.match(/\d+$/)[0]);
                // today = new Date()
                // var diffTime = Math.abs(new Date($(thisTileFXDCI).find('[id^="hdnFXDCIExpiry"]').val()) - today)
                // $(thisTileFXDCI).find('[id^="hdnTenorDays"]').val() = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            } catch (error) {
                console.log(error.message);
                $(".lblError").html(error.message)
            }
        });

    } catch (err) {
        console.log(err.message);
    }
}

//To set default values of FX DCI tile
function setDeafaultValuesFXDCI(currId) {
    try {
        thisTileFXDCI = document.getElementById("td" + currId);
        fillDropdownlistControl(tenorListFXDCI, $(thisTileFXDCI).find('[id^="FXDCI_TenorDemo"]').attr('id'));
        document.querySelector("#" + ($(thisTileFXDCI).find('[id^="FXDCI_TenorDemo"]').attr('id'))).selectedIndex = 5;
        $(thisTileFXDCI).find('[id^="FXDCI_ContractAmt"]').val("1,000,000.00");
        $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val("EUR - USD");
        $(thisTileFXDCI).find('[id^="FXDCI_BuyVSCall"]').val("EUR");
        $(thisTileFXDCI).find('[id^="rateFXDCI"]').html("1.1097/1.1098");
        $(thisTileFXDCI).find('[id^="FXDCI_SalesSpread"]').val("1.00");
        $(thisTileFXDCI).find('[id^="FXDCI_Strike"]').val("1.1097");
        $(thisTileFXDCI).find('[id^="GauranteeipBoxAQDQ"]').val("1");
        clearPricerTable(thisTileFXDCI);

        //Added for ccy pair autocomlete / JIRA - FINGUI - 237 / 14 Feb 2022 
        callCcyautocompleteFX(thisTileFXDCI, "FXDCI_CCYPairDemo");
        //END
    } catch (err) {
        console.log(err.message);
    }
}

// To validate all the fields and call function FXDCI_calBestPrice
function callFXDCIbestPrice(that) {
    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileFXDCI = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
        clearPricerTable(thisTileFXDCI); //To clear prices after clicking best price || Tina K || 20-Nov-2019
        //Validation conditions added : Tina Kshirsagar : 6-09-2019
        if ($.trim($(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val()) == '') {
            ValidateField($(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').attr('id'), "Please Select Currency Pair", thisTileFXDCI);
            return false
        } else if ($.trim($(thisTileFXDCI).find('[id^="FXDCI_ContractAmt"]').val()) == '' || parseFloat($(thisTileFXDCI).find('[id^="FXDCI_ContractAmt"]').val()) <= 0) {
            ValidateField($(thisTileFXDCI).find('[id^="FXDCI_ContractAmt"]').attr('id'), "Please Enter Valid Contract Amount", thisTileFXDCI);
            return false
        } else if ($.trim($(thisTileFXDCI).find('[id^="FXDCI_TenorDemo"]').val()) == '') {
            ValidateField($(thisTileFXDCI).find('[id^="FXDCI_TenorDemo"]').attr('id'), "Please Enter Tenor", thisTileFXDCI);
            return false
        } else if ($.trim($(thisTileFXDCI).find('[id^="FXDCI_SalesSpread"]').val().replace(/,/g, "")) == '' || $.trim($(thisTileFXDCI).find('[id^="FXDCI_SalesSpread"]').val().replace(/,/g, "")) <= 0) {
            ValidateField($(thisTileFXDCI).find('[id^="FXDCI_SalesSpread"]').attr('id'), "Please Enter Valid Sales Spread", thisTileFXDCI);
            return false
        } else if ($.trim($(thisTileFXDCI).find('[id^="FXDCI_Strike"]').val().replace(/,/g, "")) == '' || parseFloat($(thisTileFXDCI).find('[id^="FXDCI_Strike"]').val().replace(/,/g, "")) <= 0) {
            ValidateField($(thisTileFXDCI).find('[id^="FXDCI_Strike"]').attr('id'), "Please Enter Valid Strike Rate", thisTileFXDCI);
            return false
        } //Validation End 

        $(thisTileFXDCI).find('[id^="TBLFXDCI"]' + " td").each(function () {
            $(this).html("-");
        })
        $(thisTileFXDCI).find('[id^="loader_FXDCI"]').show();
        $(thisTileFXDCI).find('[id^="btnBookTradeFXDCI"]').attr("disabled", true); // Disabling book trade button while pricing is happening - by Onkar E. 25/11/2019
        FXDCI_calBestPrice(that);


    } catch (err) {
        console.log(err.message);
    }
}

// To get the FX DCI expiry 
function fillDatesFXDCI(pair, tenorValue, that) {
    try {
            // Addded for CFINT-992 // 18-Sep-2020 //

            $(thisTileFXDCI).find('[id^="btnBestPriceFXDCI"]').attr("disabled", true);

            //END
        request_getDataFromAPI({


            "CurrencyPair":$(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]')[0].value,
            "TradeDate": setBusinessDate,
            "iEntityID": EntityID,
            "Tenor_Code": tenorValue,
            "Fixing_Frequency":"",	
            "Settlement_Frequency":"",
            "DepoCcy": pair.split("-")[0].trim(),
            "AltCcy": pair.split("-")[1].trim(),
            "iProductId": productIDDCI,
            "I_ProductCode": productCodeDCI,
            "CurrentTileID": that,
            "token":"",
            "EntityID": EntityID,
            "LoginID":userName,
            "ProductCode": productCodeDCI,
            "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString()

        }, clientConfigdata.CommonMethods.NodeServer + "fillDatesFXO").then(data => {

            let thisTileFXDCI = document.getElementById("td" + data.CurrentTileID);

            let responseHeader = data.CalculateDatesResult.A_ResponseHeader.Status;

            if(responseHeader.toUpperCase() == "SUCCESS"){

            TradeDateFXDCI = setBusinessDate;
            $(thisTileFXDCI).find('[id^="FXDCI_Expiry"]').html(data.CalculateDatesResult.Dates[0].MaturityDate);
            $(thisTileFXDCI).find('[id^="hdnFXDCIPremiumDate"]').val(data.CalculateDatesResult.Dates[0].ValueDate);
            $(thisTileFXDCI).find('[id^="hdnFXDCIExpiry"]').val(data.CalculateDatesResult.Dates[0].FixingDate);
            $(thisTileFXDCI).find('[id^="hdnFXDCIDeliveryDate"]').val(data.CalculateDatesResult.Dates[0].MaturityDate);
            $(thisTileFXDCI).find('[id^="hdnTenorDays"]').val(data.CalculateDatesResult.Dates[0].ExpiryDays);
         // Addded for CFINT-992 // 18-Sep-2020 //

            $(thisTileFXDCI).find('[id^="btnBestPriceFXDCI"]').attr("disabled", false);

          //END
         
        } else {

            let failReason = data.CalculateDatesResult.A_ResponseHeader.FailedReason; 
            
            ValidateField($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').attr('id'), failReason, thisTileFXDCI);

        } 

        }).catch(error => { console.log(error); })

    } catch (error) {
        console.log(error.message);
        $(".lblError").html(error.message)
    }
}

function changeDateFormat(dateStr) {
    try {
        d = dateStr.split(" ")
        return "" + d[1] + "-" + d[0] + "-" + d[2] + ""
    } catch (error) {
        console.log(error.message);
        $(".lblError").html(error.message)
    }
}

// To calculate best price for FX DCI
function FXDCI_calBestPrice(that) {
    try {

        TileId = that.id.match(/\d+$/)[0];
        thisTileFXDCI = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        console.log("PricingFor ::", TileId, productName); //Removed unwanted console log || RizwanS || 08 May 2023
        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
        var priceClass = "GlowPrice_Red";
        if (!glowFlag) {
            priceClass = "noGlow";
        }


        
        var XmlStringFXDCI = "<ExcelSheets>" +
            "<Sheet1>" +
            "<Product_Name>FXOption</Product_Name>" +
            "<Hedging_x0020_Type>"+clientConfigdata.FXDCommonMethods.Hedging_Type+"</Hedging_x0020_Type>" +
            "<CustID>"+clientConfigdata.FXDCommonMethods.CustID+"</CustID>" +
            "<Customer_Name>"+clientConfigdata.FXDCommonMethods.Customer_Name+"</Customer_Name>" +
            "<Notional>" + $(thisTileFXDCI).find('[id^="FXDCI_ContractAmt"]').val().replace(/,/g, "").split(".")[0] + "</Notional>" +
            "<OptionType>"+ ($(thisTileFXDCI).find('[id^="ddlDCIOptions"]').val() == "Vanilla Call" ? "Call" : "Put") +"</OptionType>" +
            "<OptionCut>"+clientConfigdata.FXDCommonMethods.OptionCut+"</OptionCut>" +
            "<NonDeliveryYN>N</NonDeliveryYN>" +
            "<CcyPair>" + $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]')[0].value + "</CcyPair>" +
            "<AltCcy>" +  $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim() + "</AltCcy>" + 
            "<InvCcy>" + $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[0].trim() + "</InvCcy>" + 
            "<PremiumCcy>" + $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[0].trim() + "</PremiumCcy>" + 
            "<CustPrem>0</CustPrem>" +
            "<Tenor>" + $(thisTileFXDCI).find('[id^="FXDCI_TenorDemo"]').val() + "</Tenor>" +
            "<PremiumDate>" + $(thisTileFXDCI).find('[id^="hdnFXDCIPremiumDate"]').val() + "</PremiumDate>" +
            "<BuySell>SELL</BuySell>" +
            "<FixingDate>" + $(thisTileFXDCI).find('[id^="hdnFXDCIExpiry"]').val() + "</FixingDate>" +
            "<Spotrate>" + $(thisTileFXDCI).find('[id^="rateFXDCI"]').html().split("/")[0].replace(/,/g, "").trim() + "</Spotrate>" +
            "<TradeDate>" + setBusinessDate + "</TradeDate>" +
            "<SettDate>" + $(thisTileFXDCI).find('[id^="hdnFXDCIDeliveryDate"]').val() + "</SettDate>" +
            "<TenorDays>" + $(thisTileFXDCI).find('[id^="hdnTenorDays"]').val() + "</TenorDays>" +
            "<Strike>" + $(thisTileFXDCI).find('[id^="FXDCI_Strike"]').val().replace(/,/g, "") + "</Strike>" +
            "<LowerBarrier></LowerBarrier>" +
            "<UpperBarrier></UpperBarrier>" +
            "<EntityID>"+sessionStorage.getItem("HomeEntityID")+"</EntityID>" +
            "<CAI_ID>"+clientConfigdata.FXDCommonMethods.CAI_ID+"</CAI_ID>" +
            "<BarrierType></BarrierType>" +
            "<TemplateID>" + TemplateIDFXVanilla + "</TemplateID>" +
            "</Sheet1>" +
            "</ExcelSheets>"

            USERID_FXDCI= "CADBUser_" + Math.floor((Math.random() * 1000) + 1).toString();
            $(thisTileFXDCI).find('[id^="hdnUserIDDCI"]').val(USERID_FXDCI);
         


        request_getDataFromAPI({

            "ProductType": productCodeVanilla,
            "CurrencyPair": $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]')[0].value,
            "DepositCurrency": $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[0].trim(),
            "AlternateCurrency":$(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[1].trim(),
            "PremCurrency": $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[0].trim(), 
            "SettlementCcy": $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().split("-")[0].trim(),
            "AmountInDepositCurrency":$(thisTileFXDCI).find('[id^="FXDCI_ContractAmt"]').val().replace(/,/g, "").split(".")[0],
            "BuySell":  "SELL",
            "CallPut": $(thisTileFXDCI).find('[id^="ddlDCIOptions"]').val() == "Vanilla Call" ? "Call" : "Put",
            "Strike":  $(thisTileFXDCI).find('[id^="FXDCI_Strike"]').val().replace(/,/g, ""),
            "LowerBarrier": 0,
            "UpperBarrier": 0,
            "BarrierType": "",
            "KnockIn_Style": "EUROPEAN",
            "KnockOut_Style": "EUROPEAN",
            "RMMarginPercentage":parseFloat($(thisTileFXDCI).find('[id^="FXDCI_SalesSpread"]')[0].value),
            "Tenor": $(thisTileFXDCI).find('[id^="FXDCI_TenorDemo"]').val(),
            "TradeDate": setBusinessDate,
            "ValueDate": $(thisTileFXDCI).find('[id^="hdnFXDCIPremiumDate"]').val(),
            "FixingDate": $(thisTileFXDCI).find('[id^="hdnFXDCIExpiry"]').val(),
            "MaturityDate": $(thisTileFXDCI).find('[id^="hdnFXDCIDeliveryDate"]').val(),
            "UserID":  sessionStorage.getItem("Username"),
            "EntityId": sessionStorage.getItem("HomeEntityID"),
            "PriceProviderDetails": LPListFXDCI,//LPListFXDCI,
            "ExternalXMLString": XmlStringFXDCI,
            "TemplateCode": TemplateCodeFXVanilla,
            "TemplateID": TemplateIDFXVanilla,
            "ProductID": productIDFXOVanilla,
            "currentTile": TileId,
            "token":"",
            "EntityID": sessionStorage.getItem("HomeEntityID"),
            "LoginID": sessionStorage.getItem("Username"),
            "ProductCode": productCodeVanilla,
            "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString()



        }, clientConfigdata.CommonMethods.NodeServer + "GetPriceFXDCI", "","POST", thisTileFXDCI, "btnBestPriceFXDCI").then(data => {

           
            thisTileFXDCI = document.getElementById("td" + data.currentTile);

            let responseHeader = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.Status;

            if(responseHeader.toUpperCase() == "SUCCESS"){

            console.log("Best Price Log's for Tile FXDCI ::" + " " + data.currentTile + "\n" + data.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody[0].o_BestPriceLog);
            console.log("Log's for Tile FXDCI :: DCDRFQID ==" + data.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody[0].o_DCDRFQID   + "\n" + "NoteMasterID==" + data.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody[0].NoteMasterID  + "\n" + "USERID==" +  $(thisTileFXDCI).find('[id^="hdnUserIDDCI"]').val());
            FXDCIoutput = data.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody;

            // To Sort Json Response Object || RizwanS || 09-Jan-2020

            FXDCIoutput.sort(function (a, b) {
                if (a.premium === null || a.premium == "") {
                    return 1;
                } else if (b.premium === null || b.premium == "") {
                    return -1;
                } else if (a.premium === b.premium) {
                    return 0;
                }
                return a.premium < b.premium ? 1 : -1;
            });

            $(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val(JSON.stringify(FXDCIoutput));
            FXDCI = [];
            $(thisTileFXDCI).find('[id^="FXDCI_BankNameRow"]').empty();
            $(thisTileFXDCI).find('[id^="FXDCI_PriceRow"]').empty();
           // console.log(JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val()));


            for (i = 0; i < JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val()).length; i++) {
                if (JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].premium != "" || JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].premium != 0) {

                    if (i == 0) {

                        var price = (((Math.abs(parseFloat(Number(JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].premium).toFixed(4)) / $(thisTileFXDCI).find('[id^="hdnTenorDays"]').val()) * 360 + parseFloat(1.50) - parseFloat($(thisTileFXDCI).find('[id^="FXDCI_SalesSpread"]')[0].value)).toFixed(4)))
                        price = parseFloat(price / (100 - Math.abs(parseFloat(Number(JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].premium).toFixed(4)))) * 100).toFixed(4)
                        $(thisTileFXDCI).find('[id^="FXDCI_BankNameRow"]').append("<td>" + JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].provider + "</td>");
                        $(thisTileFXDCI).find('[id^="FXDCI_PriceRow"]').append("<td class='" + priceClass + "' >" + price + "</td>");

                    } else {
                        var price = (((Math.abs(parseFloat(Number(JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].premium).toFixed(4)) / $(thisTileFXDCI).find('[id^="hdnTenorDays"]').val()) * 360 + parseFloat(1.50) - parseFloat($(thisTileFXDCI).find('[id^="FXDCI_SalesSpread"]')[0].value)).toFixed(4)))
                        price = parseFloat(price / (100 - Math.abs(parseFloat(Number(JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].premium).toFixed(4)))) * 100).toFixed(4)
                        $(thisTileFXDCI).find('[id^="FXDCI_BankNameRow"]').append("<td>" + JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].provider + "</td>");
                        $(thisTileFXDCI).find('[id^="FXDCI_PriceRow"]').append("<td>" + price + "</td>");
                      

                    }
					
					  FXDCI.push(JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].provider);
                      FXDCI.push(price);

                }
                if (JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[0].bestPriceProvider.split(":")[0] == JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].provider) {
                    bookQuoteIdFXDCI = JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].quoteId;
                }

            }


            // To Handle FAIL JSON Response || RizwanS || 09-Jan-2020

            for (i = 0; i < JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val()).length; i++) {
                
                if (JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].NoteMasterID == null) {
                    $(thisTileFXDCI).find('[id^="FXDCI_BankNameRow"]').append("<td> - </td>");
                    $(thisTileFXDCI).find('[id^="FXDCI_PriceRow"]').append("<td> - </td>");
                } else if (JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].bestPriceProvider.split(":")[0] == "FAIL") {
                    $(thisTileFXDCI).find('[id^="FXDCI_BankNameRow"]').append("<td> - </td>");
                    $(thisTileFXDCI).find('[id^="FXDCI_PriceRow"]').append("<td> - </td>");
                    ValidateField($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').attr('id'), JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].bestPriceProvider.split(":")[0]);
                }
            }

            //END

            $(thisTileFXDCI).find('[id^="hdnChartPricesDCI"]').val(JSON.stringify(FXDCI));
            if (JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val()) != null || JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val()) != undefined) {
                drawgraphFXDCI($(thisTileFXDCI).find('[id^="canvas"]').attr('id'));
            }
            $(thisTileFXDCI).find('[id^="loader_FXDCI"]').hide();
            $(thisTileFXDCI).find('[id^="btnBookTradeFXDCI"]').attr("disabled", false); // Enabling book trade button when pricing is over - by Onkar E. 25/11/2019

        } else {

            let failReason = data.GetFXOPriceFromExternalProvidersJSONResult.A_ResponseHeader.FailedReason; 
            
            ValidateField($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').attr('id'), failReason, thisTileFXDCI);

        } 

       
        }).catch(error => { console.log(error); })

    } catch (error) {
        console.log(error.message);
        $(".lblError").html(error.message);
    }
}

// To book trade after the best price
function booktradeDCI(that) {
    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileFXDCI = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        console.log("BookingFor ::", TileId, thisTileFXDCI, productName);
        $(thisTileFXDCI).find('[id^="loader_FXDCI"]').show();
        if (JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val()) == "" || $(thisTileFXDCI).find('[id^="FXDCI_BuyVSCall"]')[0].firstChild.innerHTML == "-") {
        
            booktradePopup(that,"booktradeFXDCI"+TileId,"Please Best Price Again Before Book Trade, Order Execution Failed!","DivOverlayFXDCI","E");
            $(thisTileFXDCI).find('[id^="loader_FXDCI"]').hide();
            return false;
        }

        // To Get Best LP RFQID Details || RizwanS || 09-Jan-2020

        var FXDCI_DCDRFQID;

        for (i = 0; i < JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val()).length; i++) {

            if (JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].o_DCDRFQID != "") {
                FXDCI_DCDRFQID = JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[i].o_DCDRFQID
            }
        }

        // END

        var bookObjectDCI = request_getDataFromAPI({
            
            "EntityId": clientConfigdata.FXDCommonMethods.Entity_ID,
            "LoginId":$(thisTileFXDCI).find('[id^="hdnUserIDDCI"]').val(),
            "DCD_RFQId": FXDCI_DCDRFQID, 
            "External_RFQId": JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[0].quoteId,
            "PriceProviderName": JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[0].provider,
            "ProductCode": productCodeVanilla,
            "CurrentTileID": TileId,
            "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString()

        }, clientConfigdata.CommonMethods.NodeServer + "BookOrderFXProducts", "","POST", thisTileFXDCI, "booktradeFXDCI").then(bookObjectDCI => {

            let thisTileFXDCI = document.getElementById("td" + bookObjectDCI.CurrentTileID);

            TileId = bookObjectDCI.CurrentTileID;

            let responseHeader = data.BookTradeAndGetExternalTradeNumberReqJSONResult.A_ResponseHeader.Status;

            if(responseHeader.toUpperCase() == "SUCCESS"){

            // Handle null exception for book request, JIRA ID: CFINT-678 - Added by RijwanS. (03/12/2019)
            if (bookObjectDCI.BookTradeAndGetExternalTradeNumberReqJSONResult.DealNo == "" || bookObjectDCI.BookTradeAndGetExternalTradeNumberReqJSONResult.DealNo == null) {
                //LGTGTWINT-1845 Quote and Order Rejection messages | Chaitanya M | 17 April 2023
          //Start
           if(data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.isOrderRejected == true) { 

            var orderplaced = "Order rejected due to some technical reasons" ;
    
          }else if(data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.isOrderRejected == false || 
            data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.External_TradeID == "" ||
            data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.External_TradeID == null ){
              var orderplaced =  "Order may have got executed or may have failed. Contact support" ;
            }else{
              var orderplaced =
            data.BookTradeAndGetExternalTradeNumberReqJSONResult.ResponseTradeBookParameters.Message;
            }    
            //End    
            } else {
                var orderno = bookObjectDCI.BookTradeAndGetExternalTradeNumberReqJSONResult.Message.split(":")[1];
                var orderplaced = "FX DCI :: Deal No." + bookObjectDCI.BookTradeAndGetExternalTradeNumberReqJSONResult.DealNo + "<br>" + "Order Placed Successfully with Counterparty " + JSON.parse($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val())[0].provider + " and Order ID  " + orderno;
            }

                $(thisTileFXDCI).find('[id^="hdnBlotterURLFXDCI"]').val(clientConfigdata.CommonMethods.getBlotterURLFXD);
                $(thisTileFXDCI).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that,"booktradeFXDCI"+TileId,orderplaced,"DivOverlayFXDCI");
                $(thisTileFXDCI).find('[id^="loader_FXDCI"]').hide();
                $(thisTileFXDCI).find('[id^="hdnPricesDCI"]').val("");

            } else {

                let failReason = data.BookTradeAndGetExternalTradeNumberReqJSONResult.A_ResponseHeader.FailedReason; 
                
                ValidateField($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').attr('id'), failReason, thisTileFXDCI);

            } 
            }).catch(error => { console.log(error); })
        

    } catch (er) {
        console.log(er.message);
        booktradePopup(that,"booktradeFXDCI"+TileId,"Please Best Price Before Book Trade, Order Execution Failed!","DivOverlayFXDCI","E");
        $(thisTileFXDCI).find('[id^="loader_FXDCI"]').hide();
    } finally {

    }
}

//To get the spot/strike price according to the currency pair.
function getCurrencyFXDCIRate(currId) {
    try {
        thisTileFXDCI = document.getElementById("td" + currId);
          // Addded for CFINT-992 // 18-Sep-2020 //

          $(thisTileFXDCI).find('[id^="btnBestPriceFXDCI"]').attr("disabled", true);

          //END
        request_getDataFromAPI({
           
            "I_StandardPair": $(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val().trim(),
            "I_ProductCode": productCodeDCI,
            "currentTile": currId,
            "token":"",
            "EntityID": EntityID,
            "LoginID": userName,
            "ProductCode": productCodeDCI,
            "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString()

        }, clientConfigdata.CommonMethods.NodeServer + "GetFXRatesByCurrencyNode").then(data => {

            thisTileFXDCI = document.getElementById("td" + data.currentTile);

            let responseHeader = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.Status;

            if(responseHeader.toUpperCase() == "SUCCESS"){

            $(thisTileFXDCI).find('[id^="hdnDecimalRateFXDCI"]').val(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.DecimalRate);
            $(thisTileFXDCI).find('[id^="hdnFXDCIBid"]').val(numberWithCommas(Number(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.BidRate).toFixed(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.DecimalRate)));
            $(thisTileFXDCI).find('[id^="hdnFXDCIAsk"]').val(numberWithCommas(Number(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.AskRate).toFixed(data.Get_FinIQ_BidAsk_WrapperResult.DC_BidAskRates.DecimalRate)));

            $(thisTileFXDCI).find('[id^="rateFXDCI"]').html($(thisTileFXDCI).find('[id^="hdnFXDCIBid"]').val() + " / " + $(thisTileFXDCI).find('[id^="hdnFXDCIAsk"]').val());
            $(thisTileFXDCI).find('[id^="FXDCI_Strike"]')[0].value = $(thisTileFXDCI).find('[id^="hdnFXDCIBid"]').val();

              // Addded for CFINT-992 // 18-Sep-2020 //

              $(thisTileFXDCI).find('[id^="btnBestPriceFXDCI"]').attr("disabled", false);

              //END
            fillDatesFXDCI($(thisTileFXDCI).find('[id^="FXDCI_CCYPairDemo"]').val(), $(thisTileFXDCI).find('[id^="FXDCI_TenorDemo"]').val(), currId);

            } else {

                let failReason = data.Get_FinIQ_BidAsk_WrapperResult.A_ResponseHeader.FailedReason; 
                
                ValidateField($(thisTileFXDCI).find('[id^="hdnPricesDCI"]').attr('id'), failReason, thisTileFXDCI);

            } 

        }).catch(error => { console.log(error); })

    } catch (error) {

    }
}