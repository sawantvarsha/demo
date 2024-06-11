

$.support.cors = true;
var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var contractAmt;
var CouponFreq;
var tempShareName;
var arrSnowball = [];
var maxSnowball;
var finalResponseDataSnowball;
var finalTokenSnowball;
var repriceObjectSnowball;
var TimerSnowball = 0;
var finalObjSnowball;
var getddlList;
var tenorListSnowball = ["1M", "3M", "6M", "9M", "12M"];
var idSnowball = 23;
var dateObj = ""
var currentDate = new Date().toShortFormat();
var uniqueRequestID = "CadB_" + Math.random().toFixed(2) * 100;

// To load the Snowball tile 
function onLoadSnowball(currId, isProductCopiedSnowball) {
    try {
        // Added logic for getting current tile : Onkar E.//
        setDeafaultValuesSnowball(currId,isProductCopiedSnowball);
        thisTileSnowball = document.getElementById("td" + currId);


        hideTileLoader(thisTileSnowball, 'loader_Snowball');

        loadSnowballShares(thisTileSnowball, currId);


        fillDropdownlistControl(tenorListSnowball, $(thisTileSnowball).find('[id^="tenor_Snowball"]').attr('id'));
        document.querySelector("#" + ($(thisTileSnowball).find('[id^="tenor_Snowball"]').attr('id'))).selectedIndex = 3


        $(thisTileSnowball).find("div.card input[type='text'],div.card input[type='search'],div.card select").on('change', function () {


            thisTileSnowball = $(this).parents('.sorting')[0];
            clearInterval($(thisTileSnowball).find('[id^="hdnintervalID"]').val());
            clearPricerTable(thisTileSnowball);

        })

        $(thisTileSnowball).find("div.card input[type='text'],div.card input[type='search'],div.card select,div.card .ddlShares").on('select', function () {

            thisTileSnowball = $(this).parents('.sorting')[0];
            clearInterval($(thisTileSnowball).find('[id^="hdnintervalID"]').val());
            clearPricerTable(thisTileSnowball);

        })


        $(thisTileSnowball).find('[id^="ddlKOKIType"]').on("change", function () {
            try {

                thisTileSnowball = $(this).parents(".sorting")[0];
                validation_clear(); //To Remove highlighted part if no error 
               // checkKOKITypeSnowball($(thisTileSnowball).find('[id^="ddlKOKIType"]').val().trim(), thisTileSnowball);

            } catch (error) {
                console.log(error.message);
            }
        });
        checkSolveForSnowball($(thisTileSnowball).find('[id^="ddlSolveForSnowball"]').val(), thisTileSnowball)
        $(thisTileSnowball).find('[id^="ddlSolveForSnowball"]').on('change', function (event) {
            thisTileSnowball = $(this).parents('.sorting')[0];
            checkSolveForSnowball($(this).val(), thisTileSnowball);
        });

        shareCount = 0;
        $(thisTileSnowball).find('[id^="shareDivSnowball"]').click(function () {
            $(this).find('input[type="search"]').focus();
        });

        $("div.card input,div.card select").change(function () {
           // console.log('change event called RESET')
            thisTileSnowball = $(this).parents('.sorting')[0];
            clearInterval($(thisTileSnowball).find('[id^="hdnintervalID"]').val());
            clearPricerTable(thisTileSnowball);
            hideTileLoader(thisTileSnowball, 'loader_Snowball');
            return false;

        });

    } catch (error) {
        console.log(error.message)
    }
}

// To set default values for Snowball
function setDeafaultValuesSnowball(currId,isProductCopiedSnowball) {
    try {
        // Added logic for getting current tile : Onkar E.//
        thisTileSnowball = document.getElementById("td" + currId);

        $(thisTileSnowball).find('[id^="ContractAmt"]').val("1,000,000.00");
        $(thisTileSnowball).find('[id^="couponipbox"]').val("8.00");

        $(thisTileSnowball).find('[id^="upfrontipbox"]').val("0.50");
        $(thisTileSnowball).find('[id^="Stepdowninbox"]').val("0.50");
        $(thisTileSnowball).find('[id^="koinputbox"]').val("3.88");



        fillDropdownlistControl(tenorListSnowball, $(thisTileSnowball).find('[id^="tenor_Snowball"]').attr('id'));
        document.querySelector("#" + ($(thisTileSnowball).find('[id^="tenor_Snowball"]').attr('id'))).selectedIndex = 3;
        EQProductsFillCcy(thisTileSnowball, "ddlSnowballCcy");

        clearPricerTable(thisTileSnowball);
        $(thisTileSnowball).find('[id^="shareNameCntrlSnowball"]').html("");
        $(thisTileSnowball).find('[id^="hiddenshareinputSnowball"]').html("");
        $(thisTileSnowball).find('[id^="CCY_Snowball"]').html("");
        //inputsharebasket(currId, "Snowball", ($(thisTileSnowball).find('[id^="shareName"]')));
        // createElementInBasket(thisTileSnowball, 'shareDivSnowball', sessionStorage.getItem(thisTileSnowball.id) != undefined ? sessionStorage.getItem(thisTileSnowball.id).split(" ")[0] : 'AAPL.OQ');
        // createElementInBasket(thisTileSnowball, 'shareDivSnowball', sessionStorage.getItem(thisTileSnowball.id) != undefined ? sessionStorage.getItem(thisTileSnowball.id).split(" ")[1] : 'GOOG.OQ');
        // createElementInBasket(thisTileSnowball, 'shareDivSnowball', sessionStorage.getItem(thisTileSnowball.id) != undefined ? sessionStorage.getItem(thisTileSnowball.id).split(" ")[2] : 'FB.OQ');
        
        if (!isProductCopiedSnowball) {
            for (let s = 0; s < clientConfigdata.EQCCommonMethods.MinSharesInBaskets; s++) {
                createElementInBasket(thisTileSnowball, 'shareDivSnowball', sessionStorage.getItem(thisTileSnowball.id) != undefined ? sessionStorage.getItem(thisTileSnowball.id).split(" ")[s] : globalDefaultSharesArray[s]);

            }
        }

        $(thisTileSnowball).find('[id^="shareName"]')[0].placeholder = "";
        $(thisTileSnowball).find('[id^="CCY_Snowball"]').html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);

    } catch (error) {
        console.log(error.message)
    }
}
function checkSolveForSnowball(solveFor, thisTileSnowball) {
    try {
        if (solveFor.trim() == "KO_COUPON") {
            $(thisTileSnowball).find('[id^="KOcouponipbox"]').val("").prop('disabled', true);
            $(thisTileSnowball).find('[id^="upfrontipbox"]').val("0.50").prop('disabled', false);
            $(thisTileSnowball).find('[id^="koinputbox"]').val("100").prop('disabled', false);
            $(thisTileSnowball).find('[id^="FundingRateinputbox"]').val("310").prop('disabled', false);

        } else if (solveFor.trim() == "UPFRONT") {
            $(thisTileSnowball).find('[id^="KOcouponipbox"]').val("4.75").prop('disabled', false);
            $(thisTileSnowball).find('[id^="upfrontipbox"]').val("").prop('disabled', true);
            $(thisTileSnowball).find('[id^="koinputbox"]').val("100").prop('disabled', false);
            $(thisTileSnowball).find('[id^="FundingRateinputbox"]').val("310").prop('disabled', false);

        } else if (solveFor.trim() == "KNOCKOUT_BARRIER") {
            $(thisTileSnowball).find('[id^="KOcouponipbox"]').val("4.75").prop('disabled', false);
            $(thisTileSnowball).find('[id^="upfrontipbox"]').val("0.50").prop('disabled', false);
            $(thisTileSnowball).find('[id^="koinputbox"]').val("").prop('disabled', true);
            $(thisTileSnowball).find('[id^="FundingRateinputbox"]').val("310").prop('disabled', false);

        } else if (solveFor.trim() == "FUNDING_SPREAD") {
            $(thisTileSnowball).find('[id^="FundingRateinputbox"]').val("").prop('disabled', true);
            $(thisTileSnowball).find('[id^="KOcouponipbox"]').val("4.75").prop('disabled', false);
            $(thisTileSnowball).find('[id^="upfrontipbox"]').val("0.50").prop('disabled', false);
            $(thisTileSnowball).find('[id^="koinputbox"]').val("100").prop('disabled', false);
        }
    } catch (error) {
    }
}
// function checkKOKITypeSnowball(KOKIType, thisTileSnowball) {
//     try {
//         if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
//             // $(thisTileSnowball).find('[id^="koinputbox"]').val("3.88").prop('disabled', false);
//             //$(thisTileSnowball).find('[id^="kiinputbox"]').val("").prop("disabled", true);

//         } else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
//             // $(thisTileSnowball).find('[id^="koinputbox"]').val("3.88").prop('disabled', false);
//             //  $(thisTileSnowball).find('[id^="kiinputbox"]').val("65.00").prop('disabled', false);

//         } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
//             //  $(thisTileSnowball).find('[id^="koinputbox"]').val("").prop("disabled", true);
//             // $(thisTileSnowball).find('[id^="kiinputbox"]').val("65.00").prop('disabled', false);

//         } else if (KOKIType == "NOKINOKO") {
//             //  $(thisTileSnowball).find('[id^="koinputbox"]').val("").prop("disabled", true);
//             //  $(thisTileSnowball).find('[id^="kiinputbox"]').val("").prop('disabled', true);

//         }
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// // To authenticate user




// To get best price for Snowball
function getBestPriceSnowball(that) {
    try {
        // Added logic for getting current tile : Onkar E.//

        //    var uniqueIntervalID;
        thisTileSnowball = $(that).parents(".sorting")[0];
       // console.log('Start Interval value =' + $(thisTileSnowball).find('[id^="hdnintervalID"]').val());

        clearInterval($(thisTileSnowball).find('[id^="hdnintervalID"]').val());
       // console.log('After clear Interval value =' + $(thisTileSnowball).find('[id^="hdnintervalID"]').val());

        $(thisTileSnowball).find('[id^="hdnintervalID"]').val("");


        TileId = that.id.match(/\d+$/)[0];

        sessionStorage.setItem("poolingTimer_" + TileId, 0);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        thisTileSnowball = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        console.log(TileId, thisTileSnowball, productName);
        getddlList = $.trim($(thisTileSnowball).find('[id^="ddlKOKIType"]').val());

        $(thisTileSnowball).find('[id^="TBLSnowball"]' + " td").each(function () {
            //Clear prices || Tina K || 11-Sep-2019
            $(this).html("-");
        })
        validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
        clearPricerTable(thisTileSnowball); //To clear prices after clicking best price || Tina K || 20-Nov-2019
        //Validation conditions added : Tina Kshirsagar : 6-09-2019


        if ($(thisTileSnowball).find('[id^="shareDivSnowball"]')[0].childNodes.length == 3) {     
            ValidateField($(thisTileSnowball).find('[id^="shareDivSnowball"]').attr('id'), "Please Enter Valid Shares", thisTileSnowball);
            return false
        } else if ($.trim($(thisTileSnowball).find('[id^="ContractAmt"]').val()) == '' || parseFloat($(thisTileSnowball).find('[id^="ContractAmt"]').val()) <= 0) {
            ValidateField($(thisTileSnowball).find('[id^="ContractAmt"]').attr('id'), "Please Enter Valid Contract Amount", thisTileSnowball);
            return false
        } else if ($.trim($(thisTileSnowball).find('[id^="tenor_Snowball"]').val()) == '') {
            ValidateField($(thisTileSnowball).find('[id^="tenor_Snowball"]').attr('id'), "Please Enter Valid tenor", thisTileSnowball);
            return false
        }  else if ($.trim($(thisTileSnowball).find('[id^="Stepdowninbox"]').val()) == '' || $.trim($(thisTileSnowball).find('[id^="Stepdowninbox"]').val()) <= 0) {
            ValidateField($(thisTileSnowball).find('[id^="Stepdowninbox"]').attr('id'), "Please Enter Valid Stepdown(%)", thisTileSnowball);
            return false
        } 

        if ($(thisTileSnowball).find('[id^="ddlSolveForSnowball"]').val().split("(")[0].trim().toUpperCase() == "KO_COUPON") {
            if (parseFloat($(thisTileSnowball).find('[id^="upfrontipbox"]').val()) == "" || parseFloat($(thisTileSnowball).find('[id^="upfrontipbox"]').val()) <= 0 || parseFloat($(thisTileSnowball).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileSnowball).find('[id^="upfrontipbox"]').attr("id"), "Please Enter Valid Upfront(%)", thisTileSnowball);
                return false;
            }else if ($(thisTileSnowball).find('[id^="FundingRateinputbox"]').val() == "" || $(thisTileSnowball).find('[id^="FundingRateinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileSnowball).find('[id^="FundingRateinputbox"]').attr("id"), "Please Enter Valid Funding Spread", thisTileSnowball);
                return false;
            }else if ($(thisTileSnowball).find('[id^="koinputbox"]').val() == "" || $(thisTileSnowball).find('[id^="koinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileSnowball).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO % Of Intial", thisTileSnowball);
                return false;
            }
        } else  if ($(thisTileSnowball).find('[id^="ddlSolveForSnowball"]').val().split("(")[0].trim().toUpperCase() == "KNOCKOUT_BARRIER") {
            if (parseFloat($(thisTileSnowball).find('[id^="upfrontipbox"]').val()) == "" || parseFloat($(thisTileSnowball).find('[id^="upfrontipbox"]').val()) <= 0 || parseFloat($(thisTileSnowball).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileSnowball).find('[id^="upfrontipbox"]').attr("id"), "Please Enter Valid Upfront(%)", thisTileSnowball);
                return false;
            }else if (parseFloat($(thisTileSnowball).find('[id^="KOcouponipbox"]').val()) == "" || parseFloat($(thisTileSnowball).find('[id^="KOcouponipbox"]').val()) <= 0 || parseFloat($(thisTileSnowball).find('[id^="KOcouponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileSnowball).find('[id^="KOcouponipbox"]').attr("id"), "Please Enter Valid KO Coupon(%)", thisTileSnowball);
                return false;
            } else if ($(thisTileSnowball).find('[id^="FundingRateinputbox"]').val() == "" || $(thisTileSnowball).find('[id^="FundingRateinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileSnowball).find('[id^="FundingRateinputbox"]').attr("id"), "Please Enter Valid Funding Spread", thisTileSnowball);
                return false;
            }
           } else  if ($(thisTileSnowball).find('[id^="ddlSolveForSnowball"]').val().split("(")[0].trim().toUpperCase() == "UPFRONT") {
            if ($(thisTileSnowball).find('[id^="koinputbox"]').val() == "" || $(thisTileSnowball).find('[id^="koinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileSnowball).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO % Of Intial", thisTileSnowball);
                return false;
            }else if (parseFloat($(thisTileSnowball).find('[id^="KOcouponipbox"]').val()) == "" || parseFloat($(thisTileSnowball).find('[id^="KOcouponipbox"]').val()) <= 0 || parseFloat($(thisTileSnowball).find('[id^="KOcouponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileSnowball).find('[id^="KOcouponipbox"]').attr("id"), "Please Enter Valid KO Coupon(%)", thisTileSnowball);
                return false;
            }else if ($(thisTileSnowball).find('[id^="FundingRateinputbox"]').val() == "" || $(thisTileSnowball).find('[id^="FundingRateinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileSnowball).find('[id^="FundingRateinputbox"]').attr("id"), "Please Enter Valid Funding Spread", thisTileSnowball);
                return false;
            }
          }else  if ($(thisTileSnowball).find('[id^="ddlSolveForSnowball"]').val().split("(")[0].trim().toUpperCase() == "FUNDING_SPREAD") {
            if (parseFloat($(thisTileSnowball).find('[id^="upfrontipbox"]').val()) == "" || parseFloat($(thisTileSnowball).find('[id^="upfrontipbox"]').val()) <= 0 || parseFloat($(thisTileSnowball).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileSnowball).find('[id^="upfrontipbox"]').attr("id"), "Please Enter Valid Upfront(%)", thisTileSnowball);
                return false;
            } else if (parseFloat($(thisTileSnowball).find('[id^="KOcouponipbox"]').val()) == "" || parseFloat($(thisTileSnowball).find('[id^="KOcouponipbox"]').val()) <= 0 || parseFloat($(thisTileSnowball).find('[id^="KOcouponipbox"]').val()) >= 1000) {
                ValidateField($(thisTileSnowball).find('[id^="KOcouponipbox"]').attr("id"), "Please Enter Valid KO Coupon(%)", thisTileSnowball);
                return false;
            }else if ($(thisTileSnowball).find('[id^="koinputbox"]').val() == "" || $(thisTileSnowball).find('[id^="koinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileSnowball).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO % Of Intial", thisTileSnowball);
                return false;
            }
        }
        




        setTimeout("$(thisTileSnowball).find('[id^=\"loader_Snowball\"]').show();", 200);

        //$(thisTileSnowball).find('[id^="BookTradeSnowball"]').attr("disabled", true); // Disabling book trade button while pricing is happening - by Onkar E. 25/11/2019
        $("body").css("opacity", "0.9");

        let exchangeList = getExchangeAndCcyFromBasket($(thisTileSnowball).find('[id^="shareDivSnowball"]')[0], 'exchange', undefined, snowballSharesArray);
        let ccyList = getExchangeAndCcyFromBasket($(thisTileSnowball).find('[id^="shareDivSnowball"]')[0], 'ccy', undefined, snowballSharesArray);
        let shareList = getExchangeAndCcyFromBasket($(thisTileSnowball).find('[id^="shareDivSnowball"]')[0], 'share', undefined, snowballSharesArray);

        snowballQuoteObject = {

            "entityCode": "CN",
            "loginID": "CHNWMPS1",
            "sourceSystem": "FinIQ",
            "machineIP": "192.168.26.247",
            "requestID": uniqueRequestID,
            "requestAt": currentDate,
            "token": "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
            "type": "SnowballSwap",
            "underlyingCode1": shareList[0],
            "underlyingCode2": shareList[1],
            "underlyingCode3": shareList[2],
            "ccy": ccyList[0],
            "solveFor": $(thisTileSnowball).find('[id^="ddlSolveForSnowball"]').val().trim().toUpperCase(),
            "tenor": $(thisTileSnowball).find('[id^="tenor_Snowball"]').val(),
            "strikePerc": "98",
            "upfront": $(thisTileSnowball).find('[id^="upfrontipbox"]').val(),
            "ppDetails": "",
            "kiPerc": "50",
            "kiType": "",
            "couponPerc": "",
            "couponFreq": $(thisTileSnowball).find('[id^="ddlFrequency"]').val().toUpperCase(),
            "couponBarrier": "",
            "notional": $(thisTileSnowball).find('[id^="ContractAmt"]').val(),
            "koPerc": "101",// $(thisTileSnowball).find('[id^="koinputbox"]').val(),
            "koType": "",
            "koCoupon": $(thisTileSnowball).find('[id^="KOcouponipbox"]').val(),
            "koStepdownPerc": $(thisTileSnowball).find('[id^="Stepdowninbox"]').val(),
            "nonCall": "2",
            "settlementDays": "",
            "quantoYN": "",
            "fundingType": "",
            "fundingRate": "",
            "fundingSpread": $(thisTileSnowball).find('[id^="FundingRateinputbox"]').val(),
            "channel": "01",
            "tradeDate": "",
            "principalProtection": $(thisTileSnowball).find('[id^="Principalinputbox"]').val(),
            "CurrentTileID": TileId
        }

       // console.log('snowball quote ', snowballQuoteObject);

        getQuoteSnowball(snowballQuoteObject, $(thisTileSnowball).find('[id^="hdnintervalID"]')[0]);
        //  })

    } catch (er) {
        console.log(er.message);

    }
}
var priceProviderArray_Snowball = [];

// To get quote 
function getQuoteSnowball(snowballQuoteObject, uniqueIntervalID) {
    try {
        var dataSnowball = request_getDataFromAPI(snowballQuoteObject, clientConfigdata.CommonMethods.NodeServer + "getBestPriceSnowball").then(dataSnowball => {


           // console.log('quote response ', dataSnowball);
            if (dataSnowball.rfqResponse.responseDetails.description.trim().toUpperCase() !== "SUCCESS") {
                alert(dataSnowball.rfqResponse.responseDetails.remark);
                clearInterval($(thisTileSnowball).find('[id^="hdnintervalID"]').val());
                hideTileLoader(thisTileSnowball, 'loader_Snowball');

                return false;

            }
            priceProviderArray_Snowball=[];

            for (var x of dataSnowball.rfqResponse.priceProviderDetails) {
                priceProviderArray_Snowball.push({ "rfqID": x.rfqID });

            }

            thisTileSnowball = document.getElementById("td" + dataSnowball.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataSnowball.CurrentTileID, true);

            getUniqQuoteResponseSnowball(priceProviderArray_Snowball, thisTileSnowball, dataSnowball, uniqueIntervalID);

        }).catch(error => { console.log(error); })

    } catch (err) {
        console.log(err.message);
    }
}

function getUniqQuoteResponseSnowball(priceProviderArray_Snowball, thisTileSnowball, dataSnowball, uniqueIntervalID) {
    try {

        var UIID = null;

        uniqueIntervalID.value = setInterval(function () {
console.log('priceProviderArray_Snowball',priceProviderArray_Snowball)
            getFinalQuoteResponseSnowball(priceProviderArray_Snowball, '', '', thisTileSnowball, uniqueIntervalID);

        }, clientConfigdata.EQCSnowball.PollInterval);


       // console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
    } catch (error) {
        console.log(error)
    }
}

// To get price 

function getFinalQuoteResponseSnowball(priceProviderArray_Snowball, finalTokenSnowball1, finalResponseDataSnowball1, thisTileSnowball, uniqueIntervalID) {
    try {
        var currentDateAndTime = new Date();

        console.log("Snowball RFQ's :: " + finalResponseDataSnowball1 + " " + currentDateAndTime);
        Timer = Timer + 1;


        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileSnowball.id.match(/\d+$/)[0])) >= clientConfigdata.EQCSnowball.PoolTimer || sessionStorage.getItem("pricingToggle" + thisTileSnowball.id.match(/\d+$/)[0]) == "false") {
            $(thisTileSnowball).find('[id^="BookTradeSnowball"]').attr("disabled", false); // Enabling book trade button when pricing is over - by Onkar E. 25/11/2019
            clearInterval(uniqueIntervalID.value);
            uniqueIntervalID.value = "";
            QuoteObject = "";
            hideTileLoader(thisTileSnowball, 'loader_Snowball');
            $(thisTileSnowball).find('[id^="hdnChartPricesSnowball"]').val(JSON.stringify(finalObjSnowball));
            $("body").css("opacity", "");
            arrSnowball = [];
            maxSnowball = "";
            TimerSnowball = 0;
            //Call Draw Graph
            if (finalObjSnowball != null || finalObjSnowball != undefined) {
                // drawgraphSnowball($(thisTileSnowball).find('[id^="canvas"]').attr('id'));
            }

            return false;
        } else {
            var repriceObjectSnowball = request_getDataFromAPI({

                "entityCode": "CN",
                "loginID": "Dealer1",
                "sourceSystem": "FINIQ",
                "machineIP": "192.168.0.0",
                "requestID": uniqueRequestID,
                "requestAt": currentDate,
                "token": "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
                "priceProviderArray_Snowball": priceProviderArray_Snowball,
                "CurrentTileID": $(thisTileSnowball).attr("id").match(/\d+$/)[0]
            }, clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseSnowball").then(repriceObjectSnowball => {
               // console.log('snowball quote response ', repriceObjectSnowball);

                thisTileSnowball = document.getElementById("td" + repriceObjectSnowball.CurrentTileID);
                sessionStorage.setItem("poolingTimer_" + repriceObjectSnowball.CurrentTileID, Number(sessionStorage.getItem("poolingTimer_" + thisTileSnowball.id.match(/\d+$/)[0])) + 1);
                finalObjSnowball = repriceObjectSnowball.rfqresponse.quoteresponses;
 console.log('snow ball price object before sort', finalObjSnowball);
                // added by AniruddhaJ for upfront calculatation START
                if ($(thisTileSnowball).find('[id^="ddlSolveForSnowball"]').val().trim() === "UPFRONT") {
                    for (let priceSnowball of finalObjSnowball) {

                        priceSnowball.snowballOut = (Number(priceSnowball.snowballOut) / 100).toFixed(2).toString();

                    }
                }
                //End
                // // Sorted By Best Price LP'S     

           

                finalObjSnowball.sort(function (a, b) {
                    if (a.snowballOut === null || a.snowballOut == "" || a.snowballOut == "Timeout" || a.snowballOut.toUpperCase().trim() == "REJECTED" || a.snowballOut.toUpperCase().trim() == "UNSUPPORTED" || (a.snowballOut)==="NaN" || parseFloat(a.snowballOut)==0 ) {
                        return 1;
                    } else if (b.snowballOut === null || b.snowballOut == "" || b.snowballOut == "Timeout" || b.snowballOut.toUpperCase().trim() == "REJECTED" || b.snowballOut.toUpperCase().trim() == "UNSUPPORTED" || (b.snowballOut)==="NaN" || parseFloat(b.snowballOut)==0) {
                        return -1;
                    } else if (a.snowballOut === b.snowballOut) {
                        return 0;
                    }

                    if ($(thisTileSnowball).find('[id^="ddlSolveForSnowball"]').val() == "COUPON" || $(thisTileSnowball).find('[id^="ddlSolveForSnowball"]').val() == "KO_COUPON" || $(thisTileSnowball).find('[id^="ddlSolveForSnowball"]').val() == "UPFRONT") {
                        return Number(a.snowballOut) > Number(b.snowballOut) ? -1 : 1;
                    } else {
                        return Number(a.snowballOut) < Number(b.snowballOut) ? -1 : 1;
                    }

                });
                maxSnowball = finalObjSnowball[0].snowballOut;
                $(thisTileSnowball).find('[id^="hdnChartPricesSnowball"]').val(JSON.stringify(finalObjSnowball));
                console.log('snow ball price object after sort', finalObjSnowball);
   

                //   $(thisTileSnowball).find('[id^="hdnfinalTokenSnowball"]').val(sessionStorage.getItem("quoteToken_" + thisTileSnowball.id.match(/\d+$/)[0]));


                if (sessionStorage.getItem("pricingToggle" + thisTileSnowball.id.match(/\d+$/)[0]) == "true") {
                    $(thisTileSnowball).find('[id^="SnowballBanksRow"]').empty();
                    $(thisTileSnowball).find('[id^="SnowballPrices"]').empty();
                    $(finalObjSnowball).each(function (i, elem) {
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
                            $(thisTileSnowball).find('[id^="SnowballBanksRow"]').append(str);
                        } else {
                            str = str + "<td>--</td>"
                            $(thisTileSnowball).find('[id^="SnowballBanksRow"]').append(str);
                        }
                        if (elem.snowballOut != null && elem.snowballOut.trim() !=='NaN' && elem.snowballOut.trim().toUpperCase()!='REJECTED' && elem.snowballOut != "" && parseFloat(elem.snowballOut) != 0) {
                            if (maxSnowball == elem.snowballOut) {
                                str2 = str2 + "<td class='" + priceClass + "'>" + parseFloat(elem.snowballOut).toFixed(2) + "</td>"
                                $(thisTileSnowball).find('[id^="SnowballPrices"]').append(str2);
                            } else {
                                str2 = str2 + "<td class=''>" + parseFloat(elem.snowballOut).toFixed(2) + "</td>"
                                $(thisTileSnowball).find('[id^="SnowballPrices"]').append(str2);
                            }
                        } else {
                            str2 = str2 + "<td>-</td>"
                            $(thisTileSnowball).find('[id^="SnowballPrices"]').append(str2);
                        }
                    });



                }

            }).catch(error => {
                console.log(error);
                hideTileLoader(thisTileSnowball, 'loader_Snowball');
                $(thisTileSnowball).find('[id^="hdnChartPricesSnowball"]').val(JSON.stringify(finalObjSnowball));
                if (finalObjSnowball != null || finalObjSnowball != undefined) {
                    //     drawgraphSnowball($(thisTileSnowball).find('[id^="canvas"]').attr('id'));
                }
            })
        }
    } catch (error) {
        console.log("getFinalQuoteResponseSnowball : " + error.message);
        $(thisTileSnowball).find('[id^="hdnChartPricesSnowball"]').val(JSON.stringify(finalObjSnowball));
        window.clearInterval(uniqueIntervalID.value);
        uniqueIntervalID.value = "";
        hideTileLoader(thisTileSnowball, 'loader_Snowball');
        $(thisTileSnowball).find('[id^="BookTradeSnowball"]').attr("disabled", false);
        if (finalObjSnowball != null || finalObjSnowball != undefined) {
            //  drawgraphSnowball($(thisTileSnowball).find('[id^="canvas"]').attr('id'));
        }
        //  sessionStorage.setItem("quoteToken_" + thisTileSnowball.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileSnowball.id.match(/\d+$/)[0]));


        //  sessionStorage.setItem("quoteResponse_" + thisTileSnowball.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileSnowball.id.match(/\d+$/)[0]));



    } finally {
        $(thisTileSnowball).find('[id^="BookTradeSnowball"]').attr("disabled", false);
    }
}

// To book trade
function booktradeSnowball(that) {
    try {
        // Added logic for getting current tile : Onkar E.//
        TileId = that.id.match(/\d+$/)[0];
        thisTileSnowball = document.getElementById("td" + TileId);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        showTileLoader(thisTileSnowball, 'loader_Snowball');

        if ($(thisTileSnowball).find('[id^="SnowballPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileSnowball).find('[id^="SnowballPrices"]')[0].firstChild.innerHTML == "") {

            booktradePopup(that, "booktradeSnowball" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlaySnowball");
            hideTileLoader(thisTileSnowball, 'loader_Snowball');

            return false;
        }

        // Check For Negative prices // CFINT-927 // 10-Sep-2020

        if (parseFloat(JSON.parse($(thisTileSnowball).find('[id^="hdnChartPricesSnowball"]').val())[0].snowballOut) <= 0) {

            booktradePopup(that, "booktradeSnowball" + TileId, "Prices can not be negative 0r zero, Order Execution Failed!", "DivOverlaySnowball");
            hideTileLoader(thisTileSnowball, 'loader_Snowball');
            return false;

        }




        var Obj = JSON.parse($(thisTileSnowball).find('[id^="hdnChartPricesSnowball"]').val());
        var snowball_quoteid = Obj[0].quoteRequestId;

        let clientPriceSnowball = Obj[0].snowballOut;
        var UpfrontbyIBpriceSnowball = 100 - clientPriceSnowball;



        request_getDataFromAPI({
            "entityCode": "CN",
            "loginID": "1465895",
            "sourceSystem": "EQD",
            "machineIP": "10.68.117.204",
            "requestID": uniqueRequestID,
            "requestAt": currentDate,
            "token": "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
            "rfqID": snowball_quoteid,
            "CurrentTileID": TileId
        }, clientConfigdata.CommonMethods.NodeServer + "CNSDTranchecreation_API").then(dataTranche => {
           // console.log('tranche created ', dataTranche);
            thisTileSnowball = document.getElementById("td" + dataTranche.CurrentTileID);

            Obj = JSON.parse($(thisTileSnowball).find('[id^="hdnChartPricesSnowball"]').val());

            snowball_quoteid = Obj[0].quoteRequestId;

            clientPriceSnowball = Obj[0].snowballOut;

            booktradePopup(that, "booktradeSnowball" + TileId, dataTranche.tranchecreationResponse.trancheName + " " + dataTranche.tranchecreationResponse.responseDetails.remark, "DivOverlaySnowball");

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
                "quoteRequestId": snowball_quoteid,
                "orderComment": "",
                "margin": "",
                "clientPrice": clientPriceSnowball,
                "clientYield": "",
                "confirmReason": "Test",
                "bookingBranch": "China",
                "orderQuantity": $(thisTileSnowball).find('[id^="ContractAmt"]').val().split('.')[0].replace(/\,/g, ""),
                "customerRef": "98550",
                "rmNameForOrderConfirm": "CHRM1",
                "channel": "01",
                "internalRefNumber": "1234",
                "referralRM": "CHRM1",
                "CurrentTileID": dataTranche.CurrentTileID
            }, clientConfigdata.CommonMethods.NodeServer + "snowballBookOrder").then(bookObject => {
               // console.log('snowballBookOrder ', bookObject);

                thisTileSnowball = document.getElementById("td" + bookObject.CurrentTileID);
                TileId = bookObject.CurrentTileID;
                var bookstring = bookObject['responseData'];
                // if (bookstring.toUpperCase() === clientConfigdata.EQCCommonMethods.EQC_BOOK_TSnowballDE_RESPONSE_DETAILS.toUpperCase()) {
                //     var parentID = '';

                //     if (bookObject.UCPProductDetailsResponse !== undefined) {

                //         if (bookObject.UCPProductDetailsResponse._NoteMasterID !== '' && bookObject.UCPProductDetailsResponse._NoteMasterID !== '0') {
                //             parentID = ` and Parent ID ${bookObject.UCPProductDetailsResponse._NoteMasterID}`;

                //         } else {
                //             parentID = '';

                //         }
                //     }

                     var orderplaced = "Snowball :: Order Placed Successfully with Order ID: " + bookObject.orderResponse.orderID;
                                                        //     $(thisTileSnowball).find('[id^="hdnBlotterURLSnowball"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                //     $(thisTileSnowball).find('[id^="OrderBlotter"]').css({ display: "inline" });
                //     booktradePopup(that, "booktradeSnowball" + TileId, "Snowball :: Order Placed Successfully with Order ID: " + quoteid + "1" + parentID, "DivOverlaySnowball");
                booktradePopup(that, "booktradeSnowball" + TileId, orderplaced, "DivOverlaySnowball");
                console.log('Snowball book order :: ', bookObject.orderResponse.responseDetails.remark);
                
                hideTileLoader(thisTileSnowball, 'loader_Snowball');
                //     //   $(thisTileSnowball).find('[id^="hdnfinalTokenSnowball"]').val("");

                // } else {
                //     booktradePopup(that, "booktradeSnowball" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlaySnowball");
                //     hideTileLoader(thisTileSnowball,'loader_Snowball');
                // }

                clearInterval($(thisTileSnowball).find('[id^="hdnintervalID"]').val());

            }).catch(error => { console.log(error); })

        }).catch(error => {
            console.log(error);

        })



    } catch (er) {
        console.log(er);
        booktradePopup(that, "booktradeSnowball" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlaySnowball");
        hideTileLoader(thisTileSnowball, 'loader_Snowball');
    } finally {

    }
}


// function emailQuoteSnowball(that) {
//     try {

//         thisTileSnowball= $(that).parents(".sorting")[0];
//         if ($(thisTileSnowball).find('[id^="hdnChartPricesSnowball"]').val() != undefined)
//             var RFQID = JSON.parse($(thisTileSnowball).find('[id^="hdnChartPricesSnowball"]').val())[0].EP_ER_QuoteRequestId;


//         if (RFQID != undefined && RFQID != '') {
//             //     MailBestQuote(thisTileSnowball.id.match(/\d+$/)[0], JSON.parse($(thisTileSnowball).find('[id^="hdnChartPricesELN"]').val())[0].EP_ER_QuoteRequestId);
//             request_getDataFromAPI({ "userName": sessionStorage.getItem("FinIQUserID").toString(), "rfqId": RFQID, "CurrentTileID": thisTileSnowball.id.match(/\d+$/)[0] }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
//                 console.log(data);
//                 TileId = data.CurrentTileID;

//                 thisTileSnowball = document.getElementById("td" + TileId)
//                 booktradePopup(thisTileSnowball, "booktradeSnowball" + TileId, data.message, "DivOverlaySnowball");



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
var snowballSharesArray = [];

function loadSnowballShares(thisTileSnowball, currId) {
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
            "product": "Snowball",

            "CurrentTileID": $(thisTileSnowball).attr("id").match(/\d+$/)[0]

        }, clientConfigdata.CommonMethods.NodeServer + "getCNSDSharelist").then(data => {

           // console.log('CNSD shares ', data.shareResponse.shareList);
            snowballSharesArray = data.shareResponse.shareList;

            callDropDownFunction($(thisTileSnowball).find('[id^="shareName"]'), "Snowball", currId, snowballSharesArray);


        })
    } catch (error) {
        console.log(error.message);

    }
}
