$.support.cors = true;
var token = "";
var shareCount;
var QuoteObject;
var basketList = [];
var Tenor;
var contractAmt;
var CouponFreq;
var tempShareName;
var arrAvgAutocall = [];
var maxAvgAutocall;
var finalResponseDataAvgAutocall;
var finalTokenAvgAutocall;
var repriceObjectAvgAutocall;
var TimerAvgAutocall = 0;
var finalObjAvgAutocall;
var getddlList;
var tenorListAvgAutocall = ["1M", "3M", "6M", "9M", "12M"];
var idAvgAutocall = 25;
var dateObj = ""
var currentDate = new Date().toShortFormat();
var uniqueRequestID = "CadB_" + Math.random().toFixed(2) * 100;

// To load the AvgAutocall tile 
function onLoadAvgAutocall(currId,isProductCopiedAvgAutocall) {
    try {
    
        setDeafaultValuesAvgAutocall(currId,isProductCopiedAvgAutocall);
        thisTileAvgAutocall = document.getElementById("td" + currId);


        hideTileLoader(thisTileAvgAutocall, 'loader_AvgAutocall');

        loadAvgAutocallShares(thisTileAvgAutocall, currId);


        fillDropdownlistControl(tenorListAvgAutocall, $(thisTileAvgAutocall).find('[id^="tenor_AvgAutocall"]').attr('id'));
        document.querySelector("#" + ($(thisTileAvgAutocall).find('[id^="tenor_AvgAutocall"]').attr('id'))).selectedIndex = 3


        // $(thisTileAvgAutocall).find("input[type='text'], input[type='search'], select").on('change', function () {


        //     thisTileAvgAutocall = $(this).parents('.sorting')[0];
        //     clearInterval($(thisTileAvgAutocall).find('[id^="hdnintervalID"]').val());
        //     clearPricerTable(thisTileAvgAutocall);

        // })

        // $(thisTileAvgAutocall).find("input[type='text'], input[type='search'], select, .ddlShares").on('select', function () {

        //     thisTileAvgAutocall = $(this).parents('.sorting')[0];
        //     clearInterval($(thisTileAvgAutocall).find('[id^="hdnintervalID"]').val());
        //     clearPricerTable(thisTileAvgAutocall);

        // })


        $(thisTileAvgAutocall).find('[id^="ddlKOKIType"]').on("change", function () {
            try {

                thisTileAvgAutocall = $(this).parents(".sorting")[0];
                validation_clear(); //To Remove highlighted part if no error 
              //  checkKOKITypeAvgAutocall($(thisTileAvgAutocall).find('[id^="ddlKOKIType"]').val().trim(), thisTileAvgAutocall);

            } catch (error) {
                console.log(error.message);
            }
        });
        checkSolveForAvgAutocall($(thisTileAvgAutocall).find('[id^="ddlSolveForAvgAutocall"]').val(), thisTileAvgAutocall)
        $(thisTileAvgAutocall).find('[id^="ddlSolveForAvgAutocall"]').on('change', function (event) {
            thisTileAvgAutocall = $(this).parents('.sorting')[0];
            checkSolveForAvgAutocall($(this).val(), thisTileAvgAutocall);
        });

        shareCount = 0;
        $(thisTileAvgAutocall).find('[id^="shareDivAvgAutocall"]').click(function () {
            $(this).find('input[type="search"]').focus();
        });

        $("div.card input,div.card select").change(function(){
         // console.log('change event called RESET')
            thisTileAvgAutocall = $(this).parents('.sorting')[0];
            clearInterval($(thisTileAvgAutocall).find('[id^="hdnintervalID"]').val());
            clearPricerTable(thisTileAvgAutocall);
            hideTileLoader(thisTileAvgAutocall, 'loader_AvgAutocall');
return false;

          });


    } catch (error) {
        console.log(error.message)
    }
}
// To set default values for AvgAutocall
function setDeafaultValuesAvgAutocall(currId,isProductCopiedAvgAutocall) {
    try {
       
        thisTileAvgAutocall = document.getElementById("td" + currId);



        $(thisTileAvgAutocall).find('[id^="ContractAmt"]').val("1,000,000.00");
        $(thisTileAvgAutocall).find('[id^="couponipbox"]').val("8.00");

        $(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val("0.50");
        $(thisTileAvgAutocall).find('[id^="Stepdowninbox"]').val("0.50");
        $(thisTileAvgAutocall).find('[id^="koinputbox"]').val("3.88");



        fillDropdownlistControl(tenorListAvgAutocall, $(thisTileAvgAutocall).find('[id^="tenor_AvgAutocall"]').attr('id'));
        document.querySelector("#" + ($(thisTileAvgAutocall).find('[id^="tenor_AvgAutocall"]').attr('id'))).selectedIndex = 3;
        EQProductsFillCcy(thisTileAvgAutocall, "ddlAvgAutocallCcy");

        clearPricerTable(thisTileAvgAutocall);
        $(thisTileAvgAutocall).find('[id^="shareNameCntrlAvgAutocall"]').html("");
        $(thisTileAvgAutocall).find('[id^="hiddenshareinputAvgAutocall"]').html("");
        $(thisTileAvgAutocall).find('[id^="CCY_AvgAutocall"]').html("");
        //inputsharebasket(currId, "AvgAutocall", ($(thisTileAvgAutocall).find('[id^="shareName"]')));

        // createElementInBasket(thisTileAvgAutocall, 'shareDivAvgAutocall', sessionStorage.getItem(thisTileAvgAutocall.id) != undefined ? sessionStorage.getItem(thisTileAvgAutocall.id).split(" ")[0] : 'AAPL.OQ');
        // createElementInBasket(thisTileAvgAutocall, 'shareDivAvgAutocall', sessionStorage.getItem(thisTileAvgAutocall.id) != undefined ? sessionStorage.getItem(thisTileAvgAutocall.id).split(" ")[1] : 'GOOG.OQ');
        // createElementInBasket(thisTileAvgAutocall, 'shareDivAvgAutocall', sessionStorage.getItem(thisTileAvgAutocall.id) != undefined ? sessionStorage.getItem(thisTileAvgAutocall.id).split(" ")[2] : 'FB.OQ');

        if(!isProductCopiedAvgAutocall){
        for (let s=0;s<clientConfigdata.EQCCommonMethods.MinSharesInBaskets;s++){
            createElementInBasket(thisTileAvgAutocall, 'shareDivAvgAutocall', sessionStorage.getItem(thisTileAvgAutocall.id)!=undefined?sessionStorage.getItem(thisTileAvgAutocall.id).split(" ")[s]:globalDefaultSharesArray[s]);
       
        }
    }
        $(thisTileAvgAutocall).find('[id^="shareName"]')[0].placeholder = "";
        $(thisTileAvgAutocall).find('[id^="CCY_AvgAutocall"]').html(clientConfigdata.EQCCommonMethods.DEFAULT_SHARE_CCY);

    } catch (error) {
        console.log(error.message)
    }
}
function checkSolveForAvgAutocall(solveFor, thisTileAvgAutocall) {
    try {
        if (solveFor.trim() == "KO_COUPON") {
            $(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val("").prop('disabled', true);
            $(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val("0.50").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="koinputbox"]').val("100").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val("310").prop('disabled', false);

            $(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val("3.00").prop('disabled', false);

        } else if (solveFor.trim() == "UPFRONT") {
            $(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val("4.75").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val("").prop('disabled', true);
            $(thisTileAvgAutocall).find('[id^="koinputbox"]').val("100").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val("310").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val("3.00").prop('disabled', false);


        } else if (solveFor.trim() == "KNOCKOUT_BARRIER") {
            $(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val("4.75").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val("0.50").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="koinputbox"]').val("").prop('disabled', true);
            $(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val("310").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val("3.00").prop('disabled', false);


        } else if (solveFor.trim() == "FUNDING_SPREAD") {
            $(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val("").prop('disabled', true);
            $(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val("4.75").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val("0.50").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="koinputbox"]').val("100").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val("3.00").prop('disabled', false);

        } else if (solveFor.trim() == "COUPON") {
            $(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val("310").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val("4.75").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val("0.50").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="koinputbox"]').val("100").prop('disabled', false);
            $(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val("").prop('disabled', true);

        }
    } catch (error) {
    }
}
// function checkKOKITypeAvgAutocall(KOKIType, thisTileAvgAutocall) {
//     try {
//         if (KOKIType == "NOKIKODC" || KOKIType == "NOKIKOPE") {
//             // $(thisTileAvgAutocall).find('[id^="koinputbox"]').val("3.88").prop('disabled', false);
//             //$(thisTileAvgAutocall).find('[id^="kiinputbox"]').val("").prop("disabled", true);

//         } else if (KOKIType == "KIDCKODC" || KOKIType == "KIDCKOPE" || KOKIType == "KIEURKODC" || KOKIType == "KIEURKOPE") {
//             // $(thisTileAvgAutocall).find('[id^="koinputbox"]').val("3.88").prop('disabled', false);
//             //  $(thisTileAvgAutocall).find('[id^="kiinputbox"]').val("65.00").prop('disabled', false);

//         } else if (KOKIType == "KIDCNOKO" || KOKIType == "KIEURNOKO") {
//             //  $(thisTileAvgAutocall).find('[id^="koinputbox"]').val("").prop("disabled", true);
//             // $(thisTileAvgAutocall).find('[id^="kiinputbox"]').val("65.00").prop('disabled', false);

//         } else if (KOKIType == "NOKINOKO") {
//             //  $(thisTileAvgAutocall).find('[id^="koinputbox"]').val("").prop("disabled", true);
//             //  $(thisTileAvgAutocall).find('[id^="kiinputbox"]').val("").prop('disabled', true);

//         }
//     } catch (error) {
//         console.log(error.message)
//     }
// }


// To get best price for AvgAutocall
function getBestPriceAvgAutocall(that) {
    try {
    
        thisTileAvgAutocall = $(that).parents(".sorting")[0];
       // console.log('Start Interval value =' + $(thisTileAvgAutocall).find('[id^="hdnintervalID"]').val());

        clearInterval($(thisTileAvgAutocall).find('[id^="hdnintervalID"]').val());
       // console.log('After clear Interval value =' + $(thisTileAvgAutocall).find('[id^="hdnintervalID"]').val());

        $(thisTileAvgAutocall).find('[id^="hdnintervalID"]').val("");


        TileId = that.id.match(/\d+$/)[0];

        sessionStorage.setItem("poolingTimer_" + TileId, 0);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        thisTileAvgAutocall = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        console.log(TileId, thisTileAvgAutocall, productName);
        getddlList = $.trim($(thisTileAvgAutocall).find('[id^="ddlKOKIType"]').val());

        $(thisTileAvgAutocall).find('[id^="TBLAvgAutocall"]' + " td").each(function () {
            
            $(this).html("-");
        })
        validation_clear(); //To Remove highlighted part if no error 
        clearPricerTable(thisTileAvgAutocall); //To clear prices after clicking best price


        if ($(thisTileAvgAutocall).find('[id^="shareDivAvgAutocall"]')[0].childNodes.length == 3) {     
            ValidateField($(thisTileAvgAutocall).find('[id^="shareDivAvgAutocall"]').attr('id'), "Please Enter Valid Shares", thisTileAvgAutocall);
            return false
        } else if ($.trim($(thisTileAvgAutocall).find('[id^="ContractAmt"]').val()) == '' || parseFloat($(thisTileAvgAutocall).find('[id^="ContractAmt"]').val()) <= 0) {
            ValidateField($(thisTileAvgAutocall).find('[id^="ContractAmt"]').attr('id'), "Please Enter Valid Contract Amount", thisTileAvgAutocall);
            return false
        } else if ($.trim($(thisTileAvgAutocall).find('[id^="tenor_AvgAutocall"]').val()) == '') {
            ValidateField($(thisTileAvgAutocall).find('[id^="tenor_AvgAutocall"]').attr('id'), "Please Enter Valid tenor", thisTileAvgAutocall);
            return false
        }  

        if ($(thisTileAvgAutocall).find('[id^="ddlSolveForAvgAutocall"]').val().split("(")[0].trim().toUpperCase() == "KO_COUPON") {
            if (parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) == "" || parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) <= 0 || parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').attr("id"), "Please Enter Valid Upfront(%)", thisTileAvgAutocall);
                return false;
            }else if ($(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val() == "" || $(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').attr("id"), "Please Enter Valid Funding Spread", thisTileAvgAutocall);
                return false;
            }else if ($(thisTileAvgAutocall).find('[id^="koinputbox"]').val() == "" || $(thisTileAvgAutocall).find('[id^="koinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileAvgAutocall).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO % Of Intial", thisTileAvgAutocall);
                return false;
            }else if ($(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val() == "" || $(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileAvgAutocall).find('[id^="nokoinputbox"]').attr("id"), "Please Enter Valid Coupon(%)", thisTileAvgAutocall);
                return false;
            } 
         } else  if ($(thisTileAvgAutocall).find('[id^="ddlSolveForAvgAutocall"]').val().split("(")[0].trim().toUpperCase() == "UPFRONT") {
            if (parseFloat($(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val()) == "" || parseFloat($(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val()) <= 0 || parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').attr("id"), "Please Enter Valid KO Coupon(%)", thisTileAvgAutocall);
                return false;
            }else if ($(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val() == "" || $(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').attr("id"), "Please Enter Valid Funding Spread", thisTileAvgAutocall);
                return false;
            }else if ($(thisTileAvgAutocall).find('[id^="koinputbox"]').val() == "" || $(thisTileAvgAutocall).find('[id^="koinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileAvgAutocall).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO % Of Intial", thisTileAvgAutocall);
                return false;
            }else if ($(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val() == "" || $(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileAvgAutocall).find('[id^="nokoinputbox"]').attr("id"), "Please Enter Valid Coupon(%)", thisTileAvgAutocall);
                return false;
            } 
        } else  if ($(thisTileAvgAutocall).find('[id^="ddlSolveForAvgAutocall"]').val().split("(")[0].trim().toUpperCase() == "KNOCKOUT_BARRIER") {
            if (parseFloat($(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val()) == "" || parseFloat($(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val()) <= 0 || parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').attr("id"), "Please Enter Valid Upfront(%)", thisTileAvgAutocall);
                return false;
            }else if ($(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val() == "" || $(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').attr("id"), "Please Enter Valid Funding Spread", thisTileAvgAutocall);
                return false;
            }else if ($(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val() == "" || $(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileAvgAutocall).find('[id^="nokoinputbox"]').attr("id"), "Please Enter Valid Coupn(%)", thisTileAvgAutocall);
                return false;
            }else if (parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) == "" || parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) <= 0 || parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').attr("id"), "Please Enter Valid Upfront(%)", thisTileAvgAutocall);
                return false;
            }
         } else  if ($(thisTileAvgAutocall).find('[id^="ddlSolveForAvgAutocall"]').val().split("(")[0].trim().toUpperCase() == "COUPON") {
            if (parseFloat($(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val()) == "" || parseFloat($(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val()) <= 0 || parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').attr("id"), "Please Enter Valid KO Coupn(%)", thisTileAvgAutocall);
                return false;
            }else if ($(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val() == "" || $(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').attr("id"), "Please Enter Valid Funding Spread", thisTileAvgAutocall);
                return false;
            }else if ($(thisTileAvgAutocall).find('[id^="koinputbox"]').val() == "" || $(thisTileAvgAutocall).find('[id^="koinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileAvgAutocall).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO % Of Intial", thisTileAvgAutocall);
                return false;
            }else if (parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) == "" || parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) <= 0 || parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').attr("id"), "Please Enter Valid Upfront(%)", thisTileAvgAutocall);
                return false;
            }
        } else  if ($(thisTileAvgAutocall).find('[id^="ddlSolveForAvgAutocall"]').val().split("(")[0].trim().toUpperCase() == "FUNDING_SPREAD") {
            if (parseFloat($(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val()) == "" || parseFloat($(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val()) <= 0 || parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').attr("id"), "Please Enter Valid KO Coupon(%)", thisTileAvgAutocall);
                return false;
            }else if ($(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val() == "" || $(thisTileAvgAutocall).find('[id^="nokoinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileAvgAutocall).find('[id^="nokoinputbox"]').attr("id"), "Please Enter Valid Coupon(%)", thisTileAvgAutocall);
                return false;
            }else if ($(thisTileAvgAutocall).find('[id^="koinputbox"]').val() == "" || $(thisTileAvgAutocall).find('[id^="koinputbox"]').val() <= 0 ) {
                ValidateField($(thisTileAvgAutocall).find('[id^="koinputbox"]').attr("id"), "Please Enter Valid KO % Of Intial", thisTileAvgAutocall);
                return false;
            }else if (parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) == "" || parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) <= 0 || parseFloat($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val()) > 1000) {
                ValidateField($(thisTileAvgAutocall).find('[id^="upfrontipbox"]').attr("id"), "Please Enter Valid Upfront(%)", thisTileAvgAutocall);
                return false;
            }
          }
      

        setTimeout("$(thisTileAvgAutocall).find('[id^=\"loader_AvgAutocall\"]').show();", 200);

        //$(thisTileAvgAutocall).find('[id^="BookTradeAvgAutocall"]').attr("disabled", true); // Disabling book trade button while pricing is happening - by Onkar E. 25/11/2019
        $("body").css("opacity", "0.9");

        let exchangeList = getExchangeAndCcyFromBasket($(thisTileAvgAutocall).find('[id^="shareDivAvgAutocall"]')[0], 'exchange', undefined, AvgAutocallSharesArray);
        let ccyList = getExchangeAndCcyFromBasket($(thisTileAvgAutocall).find('[id^="shareDivAvgAutocall"]')[0], 'ccy', undefined, AvgAutocallSharesArray);
        let shareList = getExchangeAndCcyFromBasket($(thisTileAvgAutocall).find('[id^="shareDivAvgAutocall"]')[0], 'share', undefined, AvgAutocallSharesArray);

        AvgAutocallQuoteObject = {

            "entityCode": "CN",
            "loginID": "CHNWMPS1",
            "sourceSystem": "FinIQ",
            "machineIP": "192.168.26.247",
            "requestID": uniqueRequestID,
            "requestAt": currentDate,
            "token": "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
            "type": "FCSwap",
            "underlyingCode1": shareList[0],
            "underlyingCode2": shareList[1],
            "underlyingCode3": shareList[2],
            "ccy": ccyList[0],
            "solveFor": $(thisTileAvgAutocall).find('[id^="ddlSolveForAvgAutocall"]').val(),
            "tenor": $(thisTileAvgAutocall).find('[id^="tenor_AvgAutocall"]').val(),
            "strikePerc": "",
            "upfront": $(thisTileAvgAutocall).find('[id^="upfrontipbox"]').val(),
            "ppDetails": "",
            "kiPerc": "",
            "kiType": "",
            "couponPerc": "",
            "couponFrq": $(thisTileAvgAutocall).find('[id^="ddlFrequency"]').val().toUpperCase(),
            "notional": $(thisTileAvgAutocall).find('[id^="ContractAmt"]').val().replace(/\,/g, "").split(".")[0],
            "koPerc": $(thisTileAvgAutocall).find('[id^="koinputbox"]').val(),
            "koType": "",

            "koCoupon": $(thisTileAvgAutocall).find('[id^="koCouponinputbox"]').val(),
            "koStepdownPerc": "",
            "nonCall": "1",
            "settlementDays": "2",
            "fundingType": "",
            "fundingRate": $(thisTileAvgAutocall).find('[id^="Fundingddl"]').val(),
            "fundingSpread": $(thisTileAvgAutocall).find('[id^="FundingRateinputbox"]').val(),
            "channel": "01",
            "tradeDate": "",
            "principalProtection": $(thisTileAvgAutocall).find('[id^="Principalinputbox"]').val(),
            "CurrentTileID": TileId
        }

       // console.log('AvgAutocall quote ', AvgAutocallQuoteObject);

        getQuoteAvgAutocall(AvgAutocallQuoteObject, $(thisTileAvgAutocall).find('[id^="hdnintervalID"]')[0]);
        //  })

    } catch (er) {
        console.log(er.message);

    }
}
var priceProviderArray_AvgAutocall = [];

// To get quote 
function getQuoteAvgAutocall(AvgAutocallQuoteObject, uniqueIntervalID) {
    try {
        var dataAvgAutocall = request_getDataFromAPI(AvgAutocallQuoteObject, clientConfigdata.CommonMethods.NodeServer + "getBestPriceAvgAutocall").then(dataAvgAutocall => {


           // console.log('quote response ', dataAvgAutocall);
            if (dataAvgAutocall.rfqResponse.responseDetails.description.trim().toUpperCase() !== "SUCCESS") {
                alert(dataAvgAutocall.rfqResponse.responseDetails.remark);
                clearInterval($(thisTileAvgAutocall).find('[id^="hdnintervalID"]').val());
                hideTileLoader(thisTileAvgAutocall, 'loader_AvgAutocall');

                return false;

            }
            priceProviderArray_AvgAutocall=[];

            for (var x of dataAvgAutocall.rfqResponse.priceProviderDetails) {
                priceProviderArray_AvgAutocall.push({ "rfqID": x.rfqID });

            }

            thisTileAvgAutocall = document.getElementById("td" + dataAvgAutocall.CurrentTileID);
            sessionStorage.setItem("pricingToggle" + dataAvgAutocall.CurrentTileID, true);

            getUniqQuoteResponseAvgAutocall(priceProviderArray_AvgAutocall, thisTileAvgAutocall, dataAvgAutocall, uniqueIntervalID);

        }).catch(error => { console.log(error); })

    } catch (err) {
        console.log(err.message);
    }
}

function getUniqQuoteResponseAvgAutocall(priceProviderArray_AvgAutocall, thisTileAvgAutocall, dataAvgAutocall, uniqueIntervalID) {
    try {

        var UIID = null;

        uniqueIntervalID.value = setInterval(function () {

            getFinalQuoteResponseAvgAutocall(priceProviderArray_AvgAutocall, '', '', thisTileAvgAutocall, uniqueIntervalID);

        }, clientConfigdata.EQCAVGAUTOCALL.PollInterval);


       // console.log('uniqueIntervalID  ' + uniqueIntervalID.value);
    } catch (error) {
        console.log(error)
    }
}

// To get price 

function getFinalQuoteResponseAvgAutocall(priceProviderArray_AvgAutocall, finalTokenAvgAutocall1, finalResponseDataAvgAutocall1, thisTileAvgAutocall, uniqueIntervalID) {
    try {
        var currentDateAndTime = new Date();

        console.log("AvgAutocall RFQ's :: " + finalResponseDataAvgAutocall1 + " " + currentDateAndTime);
        Timer = Timer + 1;


        if (Number(sessionStorage.getItem("poolingTimer_" + thisTileAvgAutocall.id.match(/\d+$/)[0])) >= clientConfigdata.EQCAVGAUTOCALL.PoolTimer || sessionStorage.getItem("pricingToggle" + thisTileAvgAutocall.id.match(/\d+$/)[0]) == "false") {
            $(thisTileAvgAutocall).find('[id^="BookTradeAvgAutocall"]').attr("disabled", false); // Enabling book trade button when pricing is over - by Onkar E. 25/11/2019
            clearInterval(uniqueIntervalID.value);
            uniqueIntervalID.value = "";
            QuoteObject = "";
            hideTileLoader(thisTileAvgAutocall, 'loader_AvgAutocall');
            $(thisTileAvgAutocall).find('[id^="hdnChartPricesAvgAutocall"]').val(JSON.stringify(finalObjAvgAutocall));
            $("body").css("opacity", "");
            arrAvgAutocall = [];
            maxAvgAutocall = "";
            TimerAvgAutocall = 0;
            //Call Draw Graph
            if (finalObjAvgAutocall != null || finalObjAvgAutocall != undefined) {
                // drawgraphAvgAutocall($(thisTileAvgAutocall).find('[id^="canvas"]').attr('id'));
            }

            return false;
        } else {
            var repriceObjectAvgAutocall = request_getDataFromAPI({
                 "entityCode": "CN",
                "loginID": "Dealer1",
                "sourceSystem": "FINIQ",
                "machineIP": "192.168.0.0",
                "requestID": uniqueRequestID,
                "requestAt": currentDate,
                "token": "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
                "priceProviderArray_AvgAutocall": priceProviderArray_AvgAutocall,
                "CurrentTileID": $(thisTileAvgAutocall).attr("id").match(/\d+$/)[0]
            }, clientConfigdata.CommonMethods.NodeServer + "getQuoteResponseAVGAutocall").then(repriceObjectAvgAutocall => {
               // console.log('AvgAutocall quote response ', repriceObjectAvgAutocall);

                thisTileAvgAutocall = document.getElementById("td" + repriceObjectAvgAutocall.CurrentTileID);
                sessionStorage.setItem("poolingTimer_" + repriceObjectAvgAutocall.CurrentTileID, Number(sessionStorage.getItem("poolingTimer_" + thisTileAvgAutocall.id.match(/\d+$/)[0])) + 1);
                finalObjAvgAutocall = repriceObjectAvgAutocall.rfqresponse.quoteresponses;
            console.log('AVGAUTOCALL price object ', finalObjAvgAutocall);

                // added by AniruddhaJ for upfront calculatation START
                if ($(thisTileAvgAutocall).find('[id^="ddlSolveForAvgAutocall"]').val().trim() === "UPFRONT") {
                    for (let priceAvgAutocall of finalObjAvgAutocall) {

                        priceAvgAutocall.fcOut = (Number(priceAvgAutocall.fcOut) / 100).toFixed(2).toString();

                    }
                }
                //End
                // // Sorted By Best Price LP'S     

               
                finalObjAvgAutocall.sort(function (a, b) {
                    if (a.fcOut === null || a.fcOut == "" || a.fcOut == "Timeout" || a.fcOut.toUpperCase().trim() == "REJECTED" || a.fcOut.toUpperCase().trim() == "UNSUPPORTED" ||  (a.fcOut)==="NaN" || parseFloat(a.fcOut)==0) {
                        return 1;
                    } else if (b.fcOut === null || b.fcOut == "" || b.fcOut == "Timeout" || b.fcOut.toUpperCase().trim() == "REJECTED" || b.fcOut.toUpperCase().trim() == "UNSUPPORTED"||  
                    (a.fcOut)==="NaN" || parseFloat(a.fcOut)==0) {
             return -1;
                    } else if (a.fcOut === b.fcOut) {
                        return 0;
                    }

                    if ($(thisTileAvgAutocall).find('[id^="ddlSolveForAvgAutocall"]').val() == "KO_COUPON" || $(thisTileAvgAutocall).find('[id^="ddlSolveForAvgAutocall"]').val() == "UPFRONT" || $(thisTileAvgAutocall).find('[id^="ddlSolveForAvgAutocall"]').val() == "COUPON" ) {
                        return Number(a.fcOut) > Number(b.fcOut) ? -1 : 1;
                    } else {
                        return Number(a.fcOut) < Number(b.fcOut) ? -1 : 1;
                    }

                });
                maxAvgAutocall = finalObjAvgAutocall[0].fcOut;
                $(thisTileAvgAutocall).find('[id^="hdnChartPricesAvgAutocall"]').val(JSON.stringify(finalObjAvgAutocall));


                //   $(thisTileAvgAutocall).find('[id^="hdnfinalTokenAvgAutocall"]').val(sessionStorage.getItem("quoteToken_" + thisTileAvgAutocall.id.match(/\d+$/)[0]));


                if (sessionStorage.getItem("pricingToggle" + thisTileAvgAutocall.id.match(/\d+$/)[0]) == "true") {
                    $(thisTileAvgAutocall).find('[id^="AvgAutocallBanksRow"]').empty();
                    $(thisTileAvgAutocall).find('[id^="AvgAutocallPrices"]').empty();
                    $(finalObjAvgAutocall).each(function (i, elem) {
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
                            $(thisTileAvgAutocall).find('[id^="AvgAutocallBanksRow"]').append(str);
                        } else {
                            str = str + "<td>--</td>"
                            $(thisTileAvgAutocall).find('[id^="AvgAutocallBanksRow"]').append(str);
                        }
                        if (elem.fcOut != null && elem.fcOut.trim() !=='NaN' && elem.fcOut.trim().toUpperCase()!='REJECTED' && elem.fcOut != ""   && parseFloat(elem.fcOut) != 0) {
                            if (maxAvgAutocall == elem.fcOut) {
                                str2 = str2 + "<td class='" + priceClass + "'>" + parseFloat(elem.fcOut).toFixed(2) + "</td>"
                                $(thisTileAvgAutocall).find('[id^="AvgAutocallPrices"]').append(str2);
                            } else {
                                str2 = str2 + "<td class=''>" + parseFloat(elem.fcOut).toFixed(2) + "</td>"
                                $(thisTileAvgAutocall).find('[id^="AvgAutocallPrices"]').append(str2);
                            }
                        } else {
                            str2 = str2 + "<td>-</td>"
                            $(thisTileAvgAutocall).find('[id^="AvgAutocallPrices"]').append(str2);
                        }
                    });



                }

            }).catch(error => {
                console.log(error);
                hideTileLoader(thisTileAvgAutocall, 'loader_AvgAutocall');
                $(thisTileAvgAutocall).find('[id^="hdnChartPricesAvgAutocall"]').val(JSON.stringify(finalObjAvgAutocall));
                if (finalObjAvgAutocall != null || finalObjAvgAutocall != undefined) {
                    //     drawgraphAvgAutocall($(thisTileAvgAutocall).find('[id^="canvas"]').attr('id'));
                }
            })
        }
    } catch (error) {
        console.log("getFinalQuoteResponseAvgAutocall : " + error.message);
        $(thisTileAvgAutocall).find('[id^="hdnChartPricesAvgAutocall"]').val(JSON.stringify(finalObjAvgAutocall));
        window.clearInterval(uniqueIntervalID.value);
        uniqueIntervalID.value = "";
        hideTileLoader(thisTileAvgAutocall, 'loader_AvgAutocall');
        $(thisTileAvgAutocall).find('[id^="BookTradeAvgAutocall"]').attr("disabled", false);
        if (finalObjAvgAutocall != null || finalObjAvgAutocall != undefined) {
            //  drawgraphAvgAutocall($(thisTileAvgAutocall).find('[id^="canvas"]').attr('id'));
        }
        //  sessionStorage.setItem("quoteToken_" + thisTileAvgAutocall.id.match(/\d+$/)[0], sessionStorage.getItem("quoteToken_" + thisTileAvgAutocall.id.match(/\d+$/)[0]));


        //  sessionStorage.setItem("quoteResponse_" + thisTileAvgAutocall.id.match(/\d+$/)[0], sessionStorage.getItem("quoteResponse_" + thisTileAvgAutocall.id.match(/\d+$/)[0]));



    } finally {
        $(thisTileAvgAutocall).find('[id^="BookTradeAvgAutocall"]').attr("disabled", false);
    }
}

// To book trade
function booktradeAvgAutocall(that) {
    try {
        
        TileId = that.id.match(/\d+$/)[0];
        thisTileAvgAutocall = document.getElementById("td" + TileId);
        sessionStorage.setItem("pricingToggle" + TileId, false);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        showTileLoader(thisTileAvgAutocall, 'loader_AvgAutocall');

        if ($(thisTileAvgAutocall).find('[id^="AvgAutocallPrices"]')[0].firstChild.innerHTML == "-" || $(thisTileAvgAutocall).find('[id^="AvgAutocallPrices"]')[0].firstChild.innerHTML == "") {

            booktradePopup(that, "booktradeAvgAutocall" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlayAvgAutocall");
            hideTileLoader(thisTileAvgAutocall, 'loader_AvgAutocall');

            return false;
        }

        // Check For Negative prices // CFINT-927 // 10-Sep-2020

        if (parseFloat(JSON.parse($(thisTileAvgAutocall).find('[id^="hdnChartPricesAvgAutocall"]').val())[0].fcOut) <= 0) {

            booktradePopup(that, "booktradeAvgAutocall" + TileId, "Prices can not be negative 0r zero, Order Execution Failed!", "DivOverlayAvgAutocall");
            hideTileLoader(thisTileAvgAutocall, 'loader_AvgAutocall');
            return false;

        }




        var Obj = JSON.parse($(thisTileAvgAutocall).find('[id^="hdnChartPricesAvgAutocall"]').val());
        var AvgAutocall_quoteid = Obj[0].quoteRequestId;

        let clientPriceAvgAutocall = Obj[0].fcOut;
      


        request_getDataFromAPI({
            "entityCode": "CN",
            "loginID": "1465895",
            "sourceSystem": "EQD",
            "machineIP": "10.68.117.204",
            "requestID": uniqueRequestID,
            "requestAt": currentDate,
            "token": "ZXlKMGVYQWlPaUozWm5naUxDSmhiR2NpT2lKU1V6STFOaUo5Lk1URTVORGM0T1EuZDY4NmNoRVlIeEpka0dyRXE5RVc2OUNyZ3NCdWgzSXEyNjF5VHpDUDV1MHVkNjdzYllhLUpZZWZnSS1yaVlGUjZyN1dHR1VHRllQdmpwckxxbWtucU1UcXNzZy1FcHo0bmtPRHJNTWdVaEhraTVyVXFHbE5iRVZaZWFidWdwS2xLOWlRMF9hdFN2SXlDNXFjYkxXRWFFRlJ0TDJETExpVm1Sdmd6SzFxUHhlQUktLTVRNHdhdzBsQUxxamJRam5FSXVJQldYMDZBY2tfSDEtcDByZXVpQ1BORnRkb0FIYy1RLWs0VEhjdUJOU1NKbG80VTFOX2dRVXNTR1ROT2h6cnFUWmNjSnh0b2FDNzJOeDhlVG5Id3JkTGZyWGl6WFNiNkhTT3RnUUpvbWNsZjQ0aUcwaTdmYVpLcmx6cUJjRzlDUkJPY1RHQjM4ZExPblZRdF9oWll3X1NJR05fbm9yMlVRcXErbTR2T2UzOUVuQjdYc3lrVjB4Z2lwK05LU2NZUHZwSnVqVitrSkJMMThzeFl4UldscU1kbTlHSmJlM1FrdGVLSjJrenROVVVzaDd5Mkl5SUd6cVgzZVI2bXRxb2R2UHlBNWFMUUhaanhGVk9KYzVvM1d6a0V2elc1a3BlM3VkWUVRcDFmNlo4RlBmMS9kVGUydm5odVhTK2prUG03UFplblRMamhRdXFQUGpnbXBCK1N1WXBEaUFuRXlMbldPQlFMZkh4dnRiOEVEeHRXbDB5cllkMUpqck1LVWVXQ1JZbnQwamFRYkhWWEpvWHNBelVoMnNCYnZSUkh1eWJzdHJpNHdCbElXYlNOeXRrcy92STkwYldWT1FrbE1yUHk0LzRJeUZjZlNHYzNpaDhjZUFUZlpERDVYeFloZ1VCWXNac3g0cDlwU2hqR3pkVFlRPT0=",
            "rfqID": AvgAutocall_quoteid,
            "CurrentTileID": TileId
        }, clientConfigdata.CommonMethods.NodeServer + "CNSDTranchecreation_API").then(dataTranche => {
           // console.log('tranche created ', dataTranche);
            thisTileAvgAutocall = document.getElementById("td" + dataTranche.CurrentTileID);

            Obj = JSON.parse($(thisTileAvgAutocall).find('[id^="hdnChartPricesAvgAutocall"]').val());

            AvgAutocall_quoteid = Obj[0].quoteRequestId;

            clientPriceAvgAutocall = Obj[0].fcOut;

            booktradePopup(that, "booktradeAvgAutocall" + TileId, dataTranche.tranchecreationResponse.trancheName + " " + dataTranche.tranchecreationResponse.responseDetails.remark, "DivOverlayAvgAutocall");

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
                "quoteRequestId": AvgAutocall_quoteid,
                "orderComment": "",
                "margin": "",
                "clientPrice": clientPriceAvgAutocall,
                "clientYield": "",
                "confirmReason": "Test",
                "bookingBranch": "China",
                "orderQuantity": $(thisTileAvgAutocall).find('[id^="ContractAmt"]').val().split('.')[0].replace(/\,/g, ""),
                "customerRef": "98550",
                "rmNameForOrderConfirm": "CHRM1",
                "channel": "01",
                "internalRefNumber": "1234",
                "referralRM": "CHRM1",
                "CurrentTileID": dataTranche.CurrentTileID
            }, clientConfigdata.CommonMethods.NodeServer + "AvgAutocallBookOrder").then(bookObject => {
               // console.log('AvgAutocallBookOrder ', bookObject);

                thisTileAvgAutocall = document.getElementById("td" + bookObject.CurrentTileID);
                TileId = bookObject.CurrentTileID;
                var bookstring = bookObject['responseData'];
                // if (bookstring.toUpperCase() === clientConfigdata.EQCCommonMethods.EQC_BOOK_TAvgAutocallDE_RESPONSE_DETAILS.toUpperCase()) {
                //     var parentID = '';

                //     if (bookObject.UCPProductDetailsResponse !== undefined) {

                //         if (bookObject.UCPProductDetailsResponse._NoteMasterID !== '' && bookObject.UCPProductDetailsResponse._NoteMasterID !== '0') {
                //             parentID = ` and Parent ID ${bookObject.UCPProductDetailsResponse._NoteMasterID}`;

                //         } else {
                //             parentID = '';

                //         }
                //     }
                 var orderplaced = "AvgAutocall :: Order Placed Successfully with Order ID: " +    bookObject.orderResponse.orderID;
                //     $(thisTileAvgAutocall).find('[id^="hdnBlotterURLAvgAutocall"]').val(clientConfigdata.CommonMethods.getBlotterURLEQC);
                //     $(thisTileAvgAutocall).find('[id^="OrderBlotter"]').css({ display: "inline" });
                //     booktradePopup(that, "booktradeAvgAutocall" + TileId, "AvgAutocall :: Order Placed Successfully with Order ID: " + quoteid + "1" + parentID, "DivOverlayAvgAutocall");
                booktradePopup(that, "booktradeAvgAutocall" + TileId, orderplaced, "DivOverlayAvgAutocall");
                //     
 console.log('Avg Autocall book order :: ', bookObject.orderResponse.responseDetails.remark);
                
               
                hideTileLoader(thisTileAvgAutocall, 'loader_AvgAutocall');
                //     //   $(thisTileAvgAutocall).find('[id^="hdnfinalTokenAvgAutocall"]').val("");

                // } else {
                //     booktradePopup(that, "booktradeAvgAutocall" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlayAvgAutocall");
                //     hideTileLoader(thisTileAvgAutocall,'loader_AvgAutocall');
                // }

                clearInterval($(thisTileAvgAutocall).find('[id^="hdnintervalID"]').val());

            }).catch(error => { console.log(error); })

        }).catch(error => {
            console.log(error);

        })



    } catch (er) {
        console.log(er);
        booktradePopup(that, "booktradeAvgAutocall" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlayAvgAutocall");
        hideTileLoader(thisTileAvgAutocall, 'loader_AvgAutocall');
    } finally {

    }
}


// function emailQuoteAvgAutocall(that) {
//     try {

//         thisTileAvgAutocall= $(that).parents(".sorting")[0];
//         if ($(thisTileAvgAutocall).find('[id^="hdnChartPricesAvgAutocall"]').val() != undefined)
//             var RFQID = JSON.parse($(thisTileAvgAutocall).find('[id^="hdnChartPricesAvgAutocall"]').val())[0].EP_ER_QuoteRequestId;


//         if (RFQID != undefined && RFQID != '') {
//             //     MailBestQuote(thisTileAvgAutocall.id.match(/\d+$/)[0], JSON.parse($(thisTileAvgAutocall).find('[id^="hdnChartPricesELN"]').val())[0].EP_ER_QuoteRequestId);
//             request_getDataFromAPI({ "userName": sessionStorage.getItem("FinIQUserID").toString(), "rfqId": RFQID, "CurrentTileID": thisTileAvgAutocall.id.match(/\d+$/)[0] }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then(data => {
//                 console.log(data);
//                 TileId = data.CurrentTileID;

//                 thisTileAvgAutocall = document.getElementById("td" + TileId)
//                 booktradePopup(thisTileAvgAutocall, "booktradeAvgAutocall" + TileId, data.message, "DivOverlayAvgAutocall");



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
var AvgAutocallSharesArray = [];

function loadAvgAutocallShares(thisTileAvgAutocall, currId) {
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
            "product": "Averaging Autocall",

            "CurrentTileID": $(thisTileAvgAutocall).attr("id").match(/\d+$/)[0]

        }, clientConfigdata.CommonMethods.NodeServer + "getCNSDSharelist").then(data => {

           // console.log('CNSD AVG AUTOCALL shares ', data.shareResponse.shareList);
            AvgAutocallSharesArray = data.shareResponse.shareList;

            callDropDownFunction($(thisTileAvgAutocall).find('[id^="shareName"]'), "AvgAutocall", currId, AvgAutocallSharesArray);


        })
    } catch (error) {
        console.log(error.message);

    }
}
