$.support.cors = true;
var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var contractAmt;
var CouponFreq;
var tempShareName;
var arrRA = [];
var maxRA;
var finalResponseDataRA;
var finalTokenRA;
var repriceObjectRA;
var TimerRA = 0;
var finalObjRA;
var getddlList;
var tenorListRA = ["1M", "3M", "6M", "9M", "12M"];
var idRA = 22;
var dateObj = ""
var currentDate = new Date().toShortFormat();
var uniqueRequestID = "CadB_" + Math.random().toFixed(2) * 100;

// To load the RA tile 
function onLoadRA(currId,isProductCopiedRA) {
    try {
        // Added logic for getting current tile : Onkar E.//
        setDeafaultValuesRA(currId,isProductCopiedRA);
        thisTileRA = document.getElementById("td" + currId);


        hideTileLoader(thisTileRA, 'loader_RA');

        loadRAShares(thisTileRA, currId);


        fillDropdownlistControl(tenorListRA, $(thisTileRA).find('[id^="tenor_RA"]').attr('id'));
        document.querySelector("#" + ($(thisTileRA).find('[id^="tenor_RA"]').attr('id'))).selectedIndex = 3


        // $(thisTileRA).find("input[type='text'], input[type='search'], select").on('change', function () {


        //     thisTileRA = $(this).parents('.sorting')[0];
        //     clearInterval($(thisTileRA).find('[id^="hdnintervalID"]').val());
        //     clearPricerTable(thisTileRA);

        // })

        // $(thisTileRA).find("input[type='text'], input[type='search'], select, .ddlShares").on('select', function () {

        //     thisTileRA = $(this).parents('.sorting')[0];
        //     clearInterval($(thisTileRA).find('[id^="hdnintervalID"]').val());
        //     clearPricerTable(thisTileRA);

        // })


        $(thisTileRA).find('[id^="ddlKOKIType"]').on("change", function () {
            try {

                thisTileRA = $(this).parents(".sorting")[0];
                validation_clear(); //To Remove highlighted part if no error 
              //  checkKOKITypeRA($(thisTileRA).find('[id^="ddlKOKIType"]').val().trim(), thisTileRA);

            } catch (error) {
                console.log(error.message);
            }
        });
        checkSolveForRA($(thisTileRA).find('[id^="ddlSolveForRA"]').val(), thisTileRA)
        $(thisTileRA).find('[id^="ddlSolveForRA"]').on('change', function (event) {
            thisTileRA = $(this).parents('.sorting')[0];
            checkSolveForRA($(this).val(), thisTileRA);
        });

        shareCount = 0;
        $(thisTileRA).find('[id^="shareDivRA"]').click(function () {
            $(this).find('input[type="search"]').focus();
        });

        $("div.card input,div.card select").change(function(){
         // console.log('change event called RESET')
            thisTileRA = $(this).parents('.sorting')[0];
            clearInterval($(thisTileRA).find('[id^="hdnintervalID"]').val());
            clearPricerTable(thisTileRA);
            hideTileLoader(thisTileRA, 'loader_RA');
return false;

          });


    } catch (error) {
        console.log(error.message)
    }
}

// To set default values for RA
function setDeafaultValuesRA(currId,isProductCopiedRA) {
    try {
        // Added logic for getting current tile : Onkar E.//
        thisTileRA = document.getElementById("td" + currId);



        $(thisTileRA).find('[id^="ContractAmt"]').val("1,000,000.00");
        $(thisTileRA).find('[id^="couponipbox"]').val("8.00");

        $(thisTileRA).find('[id^="upfrontipbox"]').val("0.50");
        $(thisTileRA).find('[id^="Stepdowninbox"]').val("0.50");
        $(thisTileRA).find('[id^="koinputbox"]').val("3.88");



        fillDropdownlistControl(tenorListRA, $(thisTileRA).find('[id^="tenor_RA"]').attr('id'));
        document.querySelector("#" + ($(thisTileRA).find('[id^="tenor_RA"]').attr('id'))).selectedIndex = 3;
        EQProductsFillCcy(thisTileRA, "ddlRACcy");

        clearPricerTable(thisTileRA);
        $(thisTileRA).find('[id^="shareNameCntrlRA"]').html("");
        $(thisTileRA).find('[id^="hiddenshareinputRA"]').html("");
        $(thisTileRA).find('[id^="CCY_RA"]').html("");
        //inputsharebasket(currId, "RA", ($(thisTileRA).find('[id^="shareName"]')));

        // createElementInBasket(thisTileRA, 'shareDivRA', sessionStorage.getItem(thisTileRA.id) != undefined ? sessionStorage.getItem(thisTileRA.id).split(" ")[0] : 'AAPL.OQ');
        // createElementInBasket(thisTileRA, 'shareDivRA', sessionStorage.getItem(thisTileRA.id) != undefined ? sessionStorage.getItem(thisTileRA.id).split(" ")[1] : 'GOOG.OQ');
        // createElementInBasket(thisTileRA, 'shareDivRA', sessionStorage.getItem(thisTileRA.id) != undefined ? sessionStorage.getItem(thisTileRA.id).split(" ")[2] : 'FB.OQ');

        if(!isProductCopiedRA){
        for (let s=0;s<clientConfigdata.EQCCommonMethods.MinSharesInBaskets;s++){
            createElementInBasket(thisTileRA, 'shareDivRA', sessionStorage.getItem(thisTileRA.id)!=undefined?sessionStorage.getItem(thisTileRA.id).split(" ")[s]:globalDefaultSharesArray[s]);
       
        }
    }
        $(thisTileRA).find('[id^="shareName"]')[0].placeholder = "";
        $(thisTileRA).find('[id^="CCY_RA"]').html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);

    } catch (error) {
        console.log(error.message)
    }
}
function checkSolveForRA(solveFor, thisTileRA) {
    try {
        if (solveFor.trim() == "COUPON") {
            $(thisTileRA).find('[id^="couponipbox"]').val("").prop('disabled', true);
            $(thisTileRA).find('[id^="upfrontipbox"]').val("0.50").prop('disabled', false);
            $(thisTileRA).find('[id^="strikeipbox"]').val("93").prop('disabled', false);
            $(thisTileRA).find('[id^="FundingRateinputbox"]').val("310").prop('disabled', false);

         

        } else if (solveFor.trim() == "UPFRONT") {
            $(thisTileRA).find('[id^="couponipbox"]').val("4").prop('disabled', false);
            $(thisTileRA).find('[id^="upfrontipbox"]').val("").prop('disabled', true);
            $(thisTileRA).find('[id^="strikeipbox"]').val("93").prop('disabled', false);
            $(thisTileRA).find('[id^="FundingRateinputbox"]').val("310").prop('disabled', false);

        } else if (solveFor.trim() == "CONVERSION_STRIKE") {
            $(thisTileRA).find('[id^="couponipbox"]').val("4").prop('disabled', false);
            $(thisTileRA).find('[id^="upfrontipbox"]').val("0.50").prop('disabled', false);
            $(thisTileRA).find('[id^="strikeipbox"]').val("").prop('disabled', true);
            $(thisTileRA).find('[id^="FundingRateinputbox"]').val("310").prop('disabled', false);


        } else if (solveFor.trim() == "FUNDING_SPREAD") {
            $(thisTileRA).find('[id^="couponipbox"]').val("4").prop('disabled', false);
            $(thisTileRA).find('[id^="upfrontipbox"]').val("0.50").prop('disabled', false);
            $(thisTileRA).find('[id^="strikeipbox"]').val("93").prop('disabled', false);
            $(thisTileRA).find('[id^="FundingRateinputbox"]').val("").prop('disabled', true);

        } 
    } catch (error) {
    }
}
// function checkKOKITypeRA(KOKIType, thisTileRA) {
//     try {
//         if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
//             // $(thisTileRA).find('[id^="koinputbox"]').val("3.88").prop('disabled', false);
//             //$(thisTileRA).find('[id^="kiinputbox"]').val("").prop("disabled", true);

//         } else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
//             // $(thisTileRA).find('[id^="koinputbox"]').val("3.88").prop('disabled', false);
//             //  $(thisTileRA).find('[id^="kiinputbox"]').val("65.00").prop('disabled', false);

//         } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
//             //  $(thisTileRA).find('[id^="koinputbox"]').val("").prop("disabled", true);
//             // $(thisTileRA).find('[id^="kiinputbox"]').val("65.00").prop('disabled', false);

//         } else if (KOKIType == "NOKINOKO") {
//             //  $(thisTileRA).find('[id^="koinputbox"]').val("").prop("disabled", true);
//             //  $(thisTileRA).find('[id^="kiinputbox"]').val("").prop('disabled', true);

//         }
//     } catch (error) {
//         console.log(error.message)
//     }
// }




// To get best price for RA
function getBestPriceRA(that) {
    try {
        // Added logic for getting current tile : Onkar E.//

        //    var uniqueIntervalID;
        thisTileRA = $(that).parents(".sorting")[0];
       // console.log('Start Interval value =' + $(thisTileRA).find('[id^="hdnintervalID"]').val());

        clearInterval($(thisTileRA).find('[id^="hdnintervalID"]').val());
       // console.log('After clear Interval value =' + $(thisTileRA).find('[id^="hdnintervalID"]').val());

        $(thisTileRA).find('[id^="hdnintervalID"]').val("");


        TileId = that.id.match(/\d+$/)[0];

        sessionStorage.setItem("poolingTimer_" + TileId, 0);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        thisTileRA = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        console.log(TileId, thisTileRA, productName);
        getddlList = $.trim($(thisTileRA).find('[id^="ddlKOKIType"]').val());

        $(thisTileRA).find('[id^="TBLRA"]' + " td").each(function () {
            //Clear prices || Tina K || 11-Sep-2019
            $(this).html("-");
        })
        validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
        clearPricerTable(thisTileRA); //To clear prices after clicking best price || Tina K || 20-Nov-2019
        //Validation conditions added : Tina Kshirsagar : 6-09-2019


        
        if ($(thisTileRA).find('[id^="shareDivRA"]')[0].childNodes.length == 3) {     
            ValidateField($(thisTileRA).find('[id^="shareDivRA"]').attr('id'), "Please Enter Valid Shares", thisTileRA);
            return false
        } else if ($.trim($(thisTileRA).find('[id^="ContractAmt"]').val()) == '' || parseFloat($(thisTileRA).find('[id^="ContractAmt"]').val()) <= 0) {
            ValidateField($(thisTileRA).find('[id^="ContractAmt"]').attr('id'), "Please Enter Valid Contract Amount", thisTileRA);
            return false
        } else if ($.trim($(thisTileRA).find('[id^="tenor_RA"]').val()) == '') {
            ValidateField($(thisTileRA).find('[id^="tenor_RA"]').attr('id'), "Please Enter Valid tenor", thisTileRA);
            return false
        } 

        if ($(thisTileRA).find('[id^="ddlSolveForRA"]').val().split("(")[0].trim().toUpperCase() == "CONVERSION_STRIKE") {
            if (parseFloat($(thisTileRA).find('[id^="upfrontipbox"]').val()) == "" || parseFloat($(thisTileRA).find('[id^="upfrontipbox"]').val()) <= 0 || parseFloat($(thisTileRA).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileRA).find('[id^="upfrontipbox"]').attr("id"), "Please Enter Valid Upfront(%)", thisTileRA);
                return false;
            } else if (parseFloat($(thisTileRA).find('[id^="couponipbox"]').val()) == "" || parseFloat($(thisTileRA).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileRA).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileRA).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon(%)", thisTileRA);
                return false;
            }else if ($(thisTileRA).find('[id^="FundingRateinputbox"]').val() == "" || $(thisTileRA).find('[id^="FundingRateinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileRA).find('[id^="FundingRateinputbox"]').attr("id"), "Please Enter Valid Funding Spread", thisTileRA);
                return false;
            }
        } else  if ($(thisTileRA).find('[id^="ddlSolveForRA"]').val().split("(")[0].trim().toUpperCase() == "COUPON") {
            if (parseFloat($(thisTileRA).find('[id^="upfrontipbox"]').val()) == "" || parseFloat($(thisTileRA).find('[id^="upfrontipbox"]').val()) <= 0 || parseFloat($(thisTileRA).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileRA).find('[id^="upfrontipbox"]').attr("id"), "Please Enter Valid Upfront(%)", thisTileRA);
                return false;
            } else if (parseFloat($(thisTileRA).find('[id^="strikeipbox"]').val()) == '' || parseFloat($(thisTileRA).find('[id^="strikeipbox"]').val()) <= 0 || parseFloat($(thisTileRA).find('[id^="strikeipbox"]').val()) > 100) {
                ValidateField($(thisTileRA).find('[id^="strikeipbox"]').attr('id'), "Strike % must be greater than 0 and less than or equal to 100.", thisTileRA);
                return false
            } else if ($(thisTileRA).find('[id^="FundingRateinputbox"]').val() == "" || $(thisTileRA).find('[id^="FundingRateinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileRA).find('[id^="FundingRateinputbox"]').attr("id"), "Please Enter Valid Funding Spread", thisTileRA);
                return false;
            }
           } else  if ($(thisTileRA).find('[id^="ddlSolveForRA"]').val().split("(")[0].trim().toUpperCase() == "UPFRONT") {
            if (parseFloat($(thisTileRA).find('[id^="strikeipbox"]').val()) == '' || parseFloat($(thisTileRA).find('[id^="strikeipbox"]').val()) <= 0 || parseFloat($(thisTileRA).find('[id^="strikeipbox"]').val()) > 100) {
                ValidateField($(thisTileRA).find('[id^="strikeipbox"]').attr('id'), "Strike % must be greater than 0 and less than or equal to 100.", thisTileRA);
                return false
            } else if (parseFloat($(thisTileRA).find('[id^="couponipbox"]').val()) == "" || parseFloat($(thisTileRA).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileRA).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileRA).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon(%)", thisTileRA);
                return false;
            }else if ($(thisTileRA).find('[id^="FundingRateinputbox"]').val() == "" || $(thisTileRA).find('[id^="FundingRateinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileRA).find('[id^="FundingRateinputbox"]').attr("id"), "Please Enter Valid Funding Spread", thisTileRA);
                return false;
            }
          }else  if ($(thisTileRA).find('[id^="ddlSolveForRA"]').val().split("(")[0].trim().toUpperCase() == "FUNDING_SPREAD") {
            if (parseFloat($(thisTileRA).find('[id^="upfrontipbox"]').val()) == "" || parseFloat($(thisTileRA).find('[id^="upfrontipbox"]').val()) <= 0 || parseFloat($(thisTileRA).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileRA).find('[id^="upfrontipbox"]').attr("id"), "Please Enter Valid Upfront(%)", thisTileRA);
                return false;
            } else if (parseFloat($(thisTileRA).find('[id^="couponipbox"]').val()) == "" || parseFloat($(thisTileRA).find('[id^="couponipbox"]').val()) <= 0 || parseFloat($(thisTileRA).find('[id^="couponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileRA).find('[id^="couponipbox"]').attr("id"), "Please Enter Valid Coupon(%)", thisTileRA);
                return false;
            }else if (parseFloat($(thisTileRA).find('[id^="strikeipbox"]').val()) == '' || parseFloat($(thisTileRA).find('[id^="strikeipbox"]').val()) <= 0 || parseFloat($(thisTileRA).find('[id^="strikeipbox"]').val()) > 100) {
                ValidateField($(thisTileRA).find('[id^="strikeipbox"]').attr('id'), "Strike % must be greater than 0 and less than or equal to 100.", thisTileRA);
                return false
            }
        }
        


        setTimeout("$(thisTileRA).find('[id^=\"loader_RA\"]').show();", 200);

        //$(thisTileRA).find('[id^="BookTradeRA"]').attr("disabled", true); // Disabling book trade button while pricing is happening - by Onkar E. 25/11/2019
        $("body").css("opacity", "0.9");

        let exchangeList = getExchangeAndCcyFromBasket($(thisTileRA).find('[id^="shareDivRA"]')[0], 'exchange', undefined, RASharesArray);
        let ccyList = getExchangeAndCcyFromBasket($(thisTileRA).find('[id^="shareDivRA"]')[0], 'ccy', undefined, RASharesArray);
        let shareList = getExchangeAndCcyFromBasket($(thisTileRA).find('[id^="shareDivRA"]')[0], 'share', undefined, RASharesArray);

        RAQuoteObject = {

 
                "entityCode": "CN",
                "loginID": "CHNWMPS1",
                "sourceSystem": "FinIQ",
                "machineIP": "192.168.26.247",
                "requestID":uniqueRequestID,
                "requestAt": currentDate,
                "token": "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
                "type": "DRASwap",
                "underlyingCode1":shareList[0],
                "underlyingCode2": shareList[1],
                "underlyingCode3":shareList[2],
                "ccy": ccyList[0],
                "solveFor":  $(thisTileRA).find('[id^="ddlSolveForRA"]').val(),
                "tenor": $(thisTileRA).find('[id^="tenor_RA"]').val(),
                "strikePerc":  $(thisTileRA).find('[id^="strikeipbox"]').val(),
                "upfront":$(thisTileRA).find('[id^="upfrontipbox"]').val(),
                "ppDetails": "",
                "kiPerc": "",
                "kiType": "",
                "couponPerc":$(thisTileRA).find('[id^="couponipbox26"]').val(),
                "couponFrq": "MONTHLY",
                "notional": $(thisTileRA).find('[id^="ContractAmt"]').val().replace(/,/g, "").split(".")[0],
                "koPerc": "",
                "koType": "",
                "nonCall": "1",
                "settlementDays": "",
                "fundingType": "",
                // "fundingRate": $(thisTileRA).find('[id^="Fundingddl"]').val(),
                "fundingSpread":$(thisTileRA).find('[id^="FundingRateinputbox"]').val(),
                "channel": "01",
                "tradeDate" :"",
                "principalProtection" :$(thisTileRA).find('[id^="Principalinputbox"]').val(),
            "CurrentTileID": TileId
        }

        console.log('RA quote ', RAQuoteObject);

        getQuoteRA(RAQuoteObject, $(thisTileRA).find('[id^="hdnintervalID"]')[0]);
        //  })

    } catch (er) {
        console.log(er.message);

    }
}
var priceProviderArray_RA = [];

// To get quote 
function getQuoteRA(RAQuoteObject, uniqueIntervalID) {
    try {
        var dataRA = request_getDataFromAPI(RAQuoteObject, clientConfigdata.CommonMethods.NodeServer + "getBestPriceRA").then(dataRA => {


           // console.log('quote response ', dataRA);
            if (dataRA.rfqResponse.responseDetails.description.trim().toUpperCase() !== "SUCCESS") {
                alert(dataRA.rfqResponse.responseDetails.remark);
                clearInterval($(thisTileRA).find('[id^="hdnintervalID"]').val());
                hideTileLoader(thisTileRA, 'loader_RA');

                return false;

            }
            priceProviderArray_RA=[];

            for (var x of dataRA.rfqResponse.priceProviderDetails) {
                priceProviderArray_RA.push({ "rfqID": x.rfqID });

            }

            thisTileRA = document.getElementById("td" + dataRA.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataRA.CurrentTileID, true);

            getUniqQuoteResponseRA(priceProviderArray_RA, thisTileRA, dataRA, uniqueIntervalID);

        }).catch(error => { console.log(error); })

    } catch (err) {
        console.log(err.message);
    }
}

function getUniqQuoteResponseRA(priceProviderArray_RA, thisTileRA, dataRA, uniqueIntervalID) {
    try {

        var UIID = null;

        uniqueIntervalID.value = setInterval(function () {

            getFinalQuoteResponseRA(priceProviderArray_RA, '', '', thisTileRA, uniqueIntervalID);

        }, clientConfigdata.EQCRA.PollInterval);


       // console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
    } catch (error) {
        console.log(error)
    }
}

// To get price 

function getFinalQuoteResponseRA(priceProviderArray_RA, finalTokenRA1, finalResponseDataRA1, thisTileRA, uniqueIntervalID) {
    try {
        var currentDateAndTime = new Date();

        console.log("RA RFQ's :: " + finalResponseDataRA1 + " " + currentDateAndTime);
        Timer = Timer + 1;


        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileRA.id.match(/\d+$/)[0])) >= clientConfigdata.EQCRA.PoolTimer || sessionStorage.getItem("pricingToggle" + thisTileRA.id.match(/\d+$/)[0]) == "false") {
            $(thisTileRA).find('[id^="BookTradeRA"]').attr("disabled", false); // Enabling book trade button when pricing is over - by Onkar E. 25/11/2019
            clearInterval(uniqueIntervalID.value);
            uniqueIntervalID.value = "";
            QuoteObject = "";
            hideTileLoader(thisTileRA, 'loader_RA');
            $(thisTileRA).find('[id^="hdnChartPricesRA"]').val(JSON.stringify(finalObjRA));
            $("body").css("opacity", "");
            arrRA = [];
            maxRA = "";
            TimerRA = 0;
            //Call Draw Graph
            if (finalObjRA != null || finalObjRA != undefined) {
                // drawgraphRA($(thisTileRA).find('[id^="canvas"]').attr('id'));
            }

            return false;
        } else {
            var repriceObjectRA = request_getDataFromAPI({
                 "entityCode": "CN",
                "loginID": "Dealer1",
                "sourceSystem": "FINIQ",
                "machineIP": "192.168.0.0",
                "requestID": uniqueRequestID,
                "requestAt": currentDate,
                "token": "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
                "priceProviderArray_RA": priceProviderArray_RA,
                "CurrentTileID": $(thisTileRA).attr("id").match(/\d+$/)[0]
            }, clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseRA").then(repriceObjectRA => {
               // console.log('RA quote response ', repriceObjectRA);

                thisTileRA = document.getElementById("td" + repriceObjectRA.CurrentTileID);
                sessionStorage.setItem("poolingTimer_" + repriceObjectRA.CurrentTileID, Number(sessionStorage.getItem("poolingTimer_" + thisTileRA.id.match(/\d+$/)[0])) + 1);
                finalObjRA = repriceObjectRA.rfqresponse.quoteresponses;

               console.log('RA price object ', finalObjRA);

                // added by AniruddhaJ for upfront calculatation START
                if ($(thisTileRA).find('[id^="ddlSolveForRA"]').val().trim() === "UPFRONT") {
                    for (let priceRA of finalObjRA) {

                        priceRA.draOut = (Number(priceRA.draOut) / 100).toFixed(2).toString();

                    }
                }
                //End
                // // Sorted By Best Price LP'S     

                finalObjRA.sort(function (a, b) {
                    if (a.draOut === null || a.draOut == "" || a.draOut == "Timeout" || a.draOut.toUpperCase().trim() == "REJECTED" || a.draOut.toUpperCase().trim() == "UNSUPPORTED" || (a.draOut)==="NaN" || parseFloat(a.draOut)==0 ) {
                        return 1;
                    } else if (b.draOut === null || b.draOut == "" || b.draOut == "Timeout" || b.draOut.toUpperCase().trim() == "REJECTED" || b.draOut.toUpperCase().trim() == "UNSUPPORTED"  || (a.draOut)==="NaN" || parseFloat(a.draOut)==0) {
                        return -1;
                    } else if (a.draOut === b.draOut) {
                        return 0;
                    }

                    if ($(thisTileRA).find('[id^="ddlSolveForRA"]').val() == "COUPON" || $(thisTileRA).find('[id^="ddlSolveForRA"]').val() == "UPFRONT") {
                        return Number(a.draOut) > Number(b.draOut) ? -1 : 1;
                    } else {
                        return Number(a.draOut) < Number(b.draOut) ? -1 : 1;
                    }

                });
                maxRA = finalObjRA[0].draOut;
                $(thisTileRA).find('[id^="hdnChartPricesRA"]').val(JSON.stringify(finalObjRA));


                //   $(thisTileRA).find('[id^="hdnfinalTokenRA"]').val(sessionStorage.getItem("quoteToken_" + thisTileRA.id.match(/\d+$/)[0]));


                if (sessionStorage.getItem("pricingToggle" + thisTileRA.id.match(/\d+$/)[0]) == "true") {
                    $(thisTileRA).find('[id^="RABanksRow"]').empty();
                    $(thisTileRA).find('[id^="RAPrices"]').empty();
                    $(finalObjRA).each(function (i, elem) {
                        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
                        var priceClass = "GlowPrice_Red";
                        if (!glowFlag) {
                            priceClass = "noGlow";
                        }
                        var str = "";
                        var str2 = "";
                        if (elem.ppCode != null) {
                            if (elem.ppCode == "CITI") {
                                str = str + "<td>" + "Citi" + "</td>"
                            } else {
                                str = str + "<td>" + elem.ppCode + "</td>"
                            }
                            $(thisTileRA).find('[id^="RABanksRow"]').append(str);
                        } else {
                            str = str + "<td>--</td>"
                            $(thisTileRA).find('[id^="RABanksRow"]').append(str);
                        }
                        if (elem.draOut != null && elem.draOut.trim() !=='NaN' && elem.draOut.trim().toUpperCase()!='REJECTED' && elem.draOut != ""  && parseFloat(elem.draOut) != 0) {
                            if (maxRA == elem.draOut) {
                                str2 = str2 + "<td class='" + priceClass + "'>" + parseFloat(elem.draOut).toFixed(2) + "</td>"
                                $(thisTileRA).find('[id^="RAPrices"]').append(str2);
                            } else {
                                str2 = str2 + "<td class=''>" + parseFloat(elem.draOut).toFixed(2) + "</td>"
                                $(thisTileRA).find('[id^="RAPrices"]').append(str2);
                            }
                        } else {
                            str2 = str2 + "<td>-</td>"
                            $(thisTileRA).find('[id^="RAPrices"]').append(str2);
                        }
                    });



                }

            }).catch(error => {
                console.log(error);
                hideTileLoader(thisTileRA, 'loader_RA');
                $(thisTileRA).find('[id^="hdnChartPricesRA"]').val(JSON.stringify(finalObjRA));
                if (finalObjRA != null || finalObjRA != undefined) {
                    //     drawgraphRA($(thisTileRA).find('[id^="canvas"]').attr('id'));
                }
            })
        }
    } catch (error) {
        console.log("getFinalQuoteResponseRA : " + error.message);
        $(thisTileRA).find('[id^="hdnChartPricesRA"]').val(JSON.stringify(finalObjRA));
        window.clearInterval(uniqueIntervalID.value);
        uniqueIntervalID.value = "";
        hideTileLoader(thisTileRA, 'loader_RA');
        $(thisTileRA).find('[id^="BookTradeRA"]').attr("disabled", false);
        if (finalObjRA != null || finalObjRA != undefined) {
            //  drawgraphRA($(thisTileRA).find('[id^="canvas"]').attr('id'));
        }
        //  sessionStorage.setItem("quoteToken_" + thisTileRA.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileRA.id.match(/\d+$/)[0]));


        //  sessionStorage.setItem("quoteResponse_" + thisTileRA.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileRA.id.match(/\d+$/)[0]));



    } finally {
        $(thisTileRA).find('[id^="BookTradeRA"]').attr("disabled", false);
    }
}

// To book trade
function booktradeRA(that) {
    try {
        // Added logic for getting current tile : Onkar E.//
        TileId = that.id.match(/\d+$/)[0];
        thisTileRA = document.getElementById("td" + TileId);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        showTileLoader(thisTileRA, 'loader_RA');

        if ($(thisTileRA).find('[id^="RAPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileRA).find('[id^="RAPrices"]')[0].firstChild.innerHTML == "") {

            booktradePopup(that, "booktradeRA" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlayRA");
            hideTileLoader(thisTileRA, 'loader_RA');

            return false;
        }

        // Check For Negative prices // CFINT-927 // 10-Sep-2020

        if (parseFloat(JSON.parse($(thisTileRA).find('[id^="hdnChartPricesRA"]').val())[0].draOut) <= 0) {

            booktradePopup(that, "booktradeRA" + TileId, "Prices can not be negative 0r zero, Order Execution Failed!", "DivOverlayRA");
            hideTileLoader(thisTileRA, 'loader_RA');
            return false;

        }




        var Obj = JSON.parse($(thisTileRA).find('[id^="hdnChartPricesRA"]').val());
        var RA_quoteid = Obj[0].quoteRequestId;

        let clientPriceRA = Obj[0].draOut;
      

        request_getDataFromAPI({
            "entityCode": "CN",
            "loginID": "1465895",
            "sourceSystem": "EQD",
            "machineIP": "10.68.117.204",
            "requestID": uniqueRequestID,
            "requestAt": currentDate,
            "token": "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
            "rfqID": RA_quoteid,
            "CurrentTileID": TileId
        }, clientConfigdata.CommonMethods.NodeServer + "CNSDTranchecreation_API").then(dataTranche => {
           // console.log('tranche created ', dataTranche);
            thisTileRA = document.getElementById("td" + dataTranche.CurrentTileID);

            Obj = JSON.parse($(thisTileRA).find('[id^="hdnChartPricesRA"]').val());

            RA_quoteid = Obj[0].quoteRequestId;

            clientPriceRA = Obj[0].draOut;

            booktradePopup(that, "booktradeRA" + TileId, dataTranche.tranchecreationResponse.trancheName + " " + dataTranche.tranchecreationResponse.responseDetails.remark, "DivOverlayRA");

            var bookObject = request_getDataFromAPI({
                "entityCode": "CN",
                "loginID": "Dealer1",
                "sourceSystem": "FinIQ",
                "machineIP": "192.168.26.247",
                "requestID": uniqueRequestID,
                "requestAt": currentDate,
                "token": "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
                "orderType": "",
                "limitPrice1": "",
                "limitPrice2": "",
                "limitPrice3": "",
                "quoteRequestId": RA_quoteid,
                "orderComment": "",
                "margin": "",
                "clientPrice": clientPriceRA,
                "clientYield": "",
                "confirmReason": "Test",
                "bookingBranch": "China",
                "orderQuantity": $(thisTileRA).find('[id^="ContractAmt"]').val().split('.')[0].replace(/\,/g, ""),
                "customerRef": "98550",
                "rmNameForOrderConfirm": "CHRM1",
                "channel": "01",
                "internalRefNumber": "1234",
                "referralRM": "CHRM1",
                "CurrentTileID": dataTranche.CurrentTileID
            }, clientConfigdata.CommonMethods.NodeServer + "RABookOrder").then(bookObject => {
               // console.log('RABookOrder ', bookObject);

                thisTileRA = document.getElementById("td" + bookObject.CurrentTileID);
                TileId = bookObject.CurrentTileID;
                var bookstring = bookObject['responseData'];
                // if (bookstring.toUpperCase() === clientConfigdata.EQCCommonMethods.EQC_BOOK_TRADE_RESPONSE_DETAILS.toUpperCase()) {
                //     var parentID = '';

                //     if (bookObject.UCPProductDetailsResponse !== undefined) {

                //         if (bookObject.UCPProductDetailsResponse._NoteMasterID !== '' && bookObject.UCPProductDetailsResponse._NoteMasterID !== '0') {
                //             parentID = ` and Parent ID ${bookObject.UCPProductDetailsResponse._NoteMasterID}`;

                //         } else {
                //             parentID = '';

                //         }
                //     }
           var orderplaced = "RA :: Order Placed Successfully with Order ID: " +bookObject.orderResponse.orderID;
                //     $(thisTileRA).find('[id^="hdnBlotterURLRA"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                //     $(thisTileRA).find('[id^="OrderBlotter"]').css({ display: "inline" });
                //     booktradePopup(that, "booktradeRA" + TileId, "RA :: Order Placed Successfully with Order ID: " + quoteid + "1" + parentID, "DivOverlayRA");
                booktradePopup(that, "booktradeRA" + TileId, orderplaced, "DivOverlayRA");
                
 console.log('Range Accrual book order :: ', bookObject.orderResponse.responseDetails.remark);
                
                hideTileLoader(thisTileRA, 'loader_RA');
                //     //   $(thisTileRA).find('[id^="hdnfinalTokenRA"]').val("");

                // } else {
                //     booktradePopup(that, "booktradeRA" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlayRA");
                //     hideTileLoader(thisTileRA,'loader_RA');
                // }

                clearInterval($(thisTileRA).find('[id^="hdnintervalID"]').val());

            }).catch(error => { console.log(error); })

        }).catch(error => {
            console.log(error);

        })



    } catch (er) {
        console.log(er);
        booktradePopup(that, "booktradeRA" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlayRA");
        hideTileLoader(thisTileRA, 'loader_RA');
    } finally {

    }
}


// function emailQuoteRA(that) {
//     try {

//         thisTileRA= $(that).parents(".sorting")[0];
//         if ($(thisTileRA).find('[id^="hdnChartPricesRA"]').val() != undefined)
//             var RFQID = JSON.parse($(thisTileRA).find('[id^="hdnChartPricesRA"]').val())[0].EP_ER_QuoteRequestId;


//         if (RFQID != undefined && RFQID != '') {
//             //     MailBestQuote(thisTileRA.id.match(/\d+$/)[0], JSON.parse($(thisTileRA).find('[id^="hdnChartPricesELN"]').val())[0].EP_ER_QuoteRequestId);
//             request_getDataFromAPI({ "userName": sessionStorage.getItem("FinIQUserID").toString(), "rfqId": RFQID, "CurrentTileID": thisTileRA.id.match(/\d+$/)[0] }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
//                 console.log(data);
//                 TileId = data.CurrentTileID;

//                 thisTileRA = document.getElementById("td" + TileId)
//                 booktradePopup(thisTileRA, "booktradeRA" + TileId, data.message, "DivOverlayRA");



//             }).catch(error => {
//                 console.log(error);

//             })
//         } else
//             alert('Invalid RFQ ID ')
//     } catch (error) {
//         console.log(error)
//         alert('Invalid RFQ ID ')

//     }


// }


//CNSD Common shares load function 
var RASharesArray = [];

function loadRAShares(thisTileRA, currId) {
    try {
        request_getDataFromAPI({

            "entityCode": "CN",
            "loginID": "Dealer1",
            "sourceSystem": "FINIQ",
            "machineIP": "192.168.0.0",
            "requestID": uniqueRequestID,
            "requestAt": currentDate,
            "token": "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",

            "currency": "",
            "exchangeCode": "",
            "product": "Range Accrual",

            "CurrentTileID": $(thisTileRA).attr("id").match(/\d+$/)[0]

        }, clientConfigdata.CommonMethods.NodeServer + "getCNSDSharelist").then(data => {

           // console.log('CNSD RA shares ', data.shareResponse.shareList);
            RASharesArray = data.shareResponse.shareList;

            callDropDownFunction($(thisTileRA).find('[id^="shareName"]'), "RA", currId, RASharesArray);


        })
    } catch (error) {
        console.log(error.message);

    }
}
