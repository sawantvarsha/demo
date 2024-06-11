var InsertPricerobject_ELI;
var a = [];
var PPDetails_ELI;
var ELIchart;
var idELI = 2;
var flag = false;
tenorListELI = ["2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M", "11M"];

// To load ELI default functions and values
function onLoadELI(currId,isProductCopiedELI) {
    try {
        // Added logic for getting current tile : Onkar E.//
        thisTileELI = document.getElementById("td" + currId);
        $(thisTileELI).find('[id^="loaderELI"]').hide();
        setDeafaultValuesELI(currId,isProductCopiedELI);
        //calculateTenor(currId)  added on 26/04/2022

        //aded by rutika on 26/04/2022 for calculating tenor when changed in input box
        //Start
        $(thisTileELI).find('[id^="tenorELI"]').on("change", function() {
            try {
             
                thisTileELI = $(this).parents(".sorting")[0];
                calculateTenor(currId)  
            } catch (error) {
                console.log(error.message);
            }
        });
        //End 






        /*
        $(thisTileELI).find('[id^="ELISharesDemo"]').on('select', function () {
            var ccy_ELI = "";
            if (localStorage.getItem("CCY_" + ($(this).parents('.sorting').find('[id^="ELISharesDemo"]').val().split(",")[0]).trim()) != null || localStorage.getItem("CCY_" + ($(this).parents('.sorting').find('[id^="ELISharesDemo"]').val().split(",")[0]).trim()) != undefined) {
                ccy_ELI = localStorage.getItem("CCY_" + ($(this).parents('.sorting').find('[id^="ELISharesDemo"]').val().split(",")[0]).trim());
            }
            $(this).parents('.sorting').find('[id^="ELI_CCY"]').html(ccy_ELI);
        });

        $(thisTileELI).find('[id^="shareDivELI"]').click(function () {
            $(this).find('input[type="search"]').focus();
        });
        */
    } catch (error) {
        console.log(error.message)
    }
}
// To set default values of parameters
function setDeafaultValuesELI(currId,isProductCopiedELI) {
    try {
        thisTileELI = document.getElementById("td" + currId);

       //fillDropdownlistControl(tenorListELI, $(thisTileELI).find('[id^="tenorELI"]').attr('id'));
        //document.querySelector("#" + ($(thisTileELI).find('[id^="tenorELI"]').attr('id'))).selectedIndex = 1;
        callDropDownFunction($(thisTileELI).find('[id^="ELISharesDemo"]'), "ELI", currId);
        Currency_Selection_Drop_Down(currId);
        $(thisTileELI).find('[id^="noteCCY"]')[0].selectedIndex = 12;
        $(thisTileELI).find('[id^="ContractAmtELI"]').val("1,000,000.00");
        $(thisTileELI).find('[id^="strikeipboxELI"]').val("98.00");
        $(thisTileELI).find('[id^="CouponipboxELI"]').val("6.00");
        $(thisTileELI).find('[id^="tenorELI"]').val("6M"); //added by rutkka on 26/04/2022 for default value of input box
        $(thisTileELI).find('[id^="KOipboxELI"]').val("108.00");
        $(thisTileELI).find('[id^="KIipboxELI"]').val("68.00");
        clearPricerTable(thisTileELI);
        $(thisTileELI).find('[id^="ELI_CCY"]').html("");
        $(thisTileELI).find('[id^="shareNameCntrlELI"]').html("");
        $(thisTileELI).find('[id^="hiddenshareinputELI"]').html("");
        //  inputsharebasket(currId, "ELI", ($(thisTileELI).find('[id^="ELISharesDemo"]')));

        // createElementInBasket(thisTileELI, 'shareDivELI', 'AAPL.OQ');
        // createElementInBasket(thisTileELI, 'shareDivELI', 'GOOG.OQ');
        // createElementInBasket(thisTileELI, 'shareDivELI', 'FB.OQ');
        if(!isProductCopiedELI){
        for (let s=0;s<clientConfigdata.EQCCommonMethods.MinSharesInBaskets;s++){
            createElementInBasket(thisTileELI, 'shareDivELI', sessionStorage.getItem(thisTileELI.id)!=undefined?sessionStorage.getItem(thisTileELI.id).split(" ")[s]:globalDefaultSharesArray[s]);
       
        }
    }
        $(thisTileELI).find('[id^="ELISharesDemo"]')[0].placeholder = "";
        $(thisTileELI).find('[id^="ELI_CCY"]').html("USD");
    } catch (error) {
        console.log(error.message)
    }
}
function wait(ms) {
    try {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
        if ($('input[id$="hdnQuoteIDELI"]').parents(".sorting").length > 3) {
            flag = true;
        }
    } catch (error) {
        console.log(error.message)
    }
}
// To get best price of ELI
function BestPriceForELI(TileId) {
    try {

        var share1, share2, share3; 0
        thisTileELI = document.getElementById("td" + TileId);
        /*        if ($("#hiddeninputshare" + "ELI" + TileId)[0].value.split("~").length == 2) {
                    share1 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[0];
                    share2 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[1];
                    share3 = "";
                }
                if ($("#hiddeninputshare" + "ELI" + TileId)[0].value.split("~").length == 3) {
                    share1 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[0];
                    share2 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[1];
                    share3 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[2];
                }
                if ($("#hiddeninputshare" + "ELI" + TileId)[0].value.split("~").length == 4) {
                    share1 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[0];
                    share2 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[1];
                    share3 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[2];
                }*/
        let exchangeListELI = getExchangeAndCcyFromBasket($(thisTileELI).find('[id^="shareDivELI"]')[0], 'exchange');
        let ccyListELI = getExchangeAndCcyFromBasket($(thisTileELI).find('[id^="shareDivELI"]')[0], 'ccy');
        let shareListELI = getExchangeAndCcyFromBasket($(thisTileELI).find('[id^="shareDivELI"]')[0], 'share');

        InsertPricerobject_ELI = {

            "Exchange1": exchangeListELI[0],
            "UnderlyingCode1": shareListELI[0],
            "Exchange2": exchangeListELI[1],
            "UnderlyingCode2": shareListELI[1],
            "Exchange3": exchangeListELI[2],
            "UnderlyingCode3": shareListELI[2],
			 "Exchange4": exchangeListELI[3],
            "UnderlyingCode4": shareListELI[3],
            "Ccy": $(thisTileELI).find('[id^="noteCCY"]').val(),
            "BarrierPerc": $(thisTileELI).find('[id^="KOipboxELI"]').val(),
            "Tenor": $(thisTileELI).find('[id^="tenorELI"]').val().toUpperCase(),
            "strikePerc": $(thisTileELI).find('[id^="strikeipboxELI"]').val(),
            "KIPerc": $(thisTileELI).find('[id^="KIipboxELI"]').val(),
            "CouponPerc": $(thisTileELI).find('[id^="CouponipboxELI"]').val(),
            "TradeDate": today.toShortFormat()
        }
        var data = getSyncResponse(InsertPricerobject_ELI, clientConfigdata.CommonMethods.NodeServer + "getPPDetailsELI");

        a = data.split("<");
        var PPDetails_ELI = a[0];
        $(thisTileELI).find('[id^="hdnQuoteIDELI"]').val(PPDetails_ELI);
        console.log(TileId, InsertPricerobject_ELI, PPDetails_ELI)

        setTimeout(function () {
            DetailsForAllELI(PPDetails_ELI, TileId);
        }, 3500);

    } catch (error) {
        console.log(error.message);
        if (data == undefined || data == null || data == "") {
            ValidateField($(thisTileELI).find('[id^="hdnBestPriceELI"]').attr('id'), "ELI :: Pricing down please try after some time", thisTileELI);
            return false
        }
        $(thisTileELI).find('[id^="loaderELI"]').hide();
    } finally {

    }
}
// To get prices and display
function DetailsForAllELI(PPDetails_ELI, TileId) {
    try {
        if (flag) {
            wait(3500);
        }
        var data = getSyncResponse({

            "PPDetails": PPDetails_ELI,
            "CurrentTileID": TileId


        }, clientConfigdata.CommonMethods.NodeServer + "getPriceELI")

        thisTileELI = document.getElementById("td" + data.CurrentTileID);
        TileId = data.CurrentTileID
        var temp = [];
        var ExQuoteId;
        if (data.Get_ExternalPriceProvider_Response_DetailsForAll_ELI_Flexi_AllResult != "") {
            $(thisTileELI).find('[id^="btnBookTradeELI"]').attr("disabled", false);
            ExQuoteId = data.Get_ExternalPriceProvider_Response_DetailsForAll_ELI_Flexi_AllResult[0].CommonRFQ;
            thisTileELI = $('input[id$="hdnQuoteIDELI"][value="' + ExQuoteId + '"]').parents(".sorting")[0];
            console.log(ExQuoteId, thisTileELI, data);

            $(thisTileELI).find('[id^="ELIBanksRow"]').empty();
            $(thisTileELI).find('[id^="ELIPrices"]').empty();

            ELIchart = JSON.parse(JSON.stringify(data.Get_ExternalPriceProvider_Response_DetailsForAll_ELI_Flexi_AllResult));
            $(thisTileELI).find('[id^="hdnPriceELI"]').val(JSON.stringify(data.Get_ExternalPriceProvider_Response_DetailsForAll_ELI_Flexi_AllResult));
            $(data.Get_ExternalPriceProvider_Response_DetailsForAll_ELI_Flexi_AllResult).each(function (i, that) {
                temp.push(that['PRICE']);
                var minPRICEELI = Math.min(...temp);
                var strBank = "";
                strBank = strBank + "<td>" + that['PP_CODE'] + "</td>"
                $(thisTileELI).find('[id^="ELIBanksRow"]').append(strBank);
                var strPrice = "";
                // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
                var priceClass = "GlowPrice_Red";
                if (!glowFlag) {
                    priceClass = "noGlow";
                }
                if (that['PRICE'] == minPRICEELI) {
                    strPrice = strPrice + "<td class='" + priceClass + "'>" + parseFloat(that['PRICE']).toFixed(2) + "</td>";
                    $(thisTileELI).find('[id^="hdnBestPriceELI"]').val(parseFloat(that['PRICE']).toFixed(2));
                    $(thisTileELI).find('[id^="hdnissuerELI"]').val(that['PP_CODE']);
                } else {
                    strPrice = strPrice + "<td>" + parseFloat(that['PRICE']).toFixed(2) + "</td>"
                }
                $(thisTileELI).find('[id^="ELIPrices"]').append(strPrice);
            })
            $(thisTileELI).find('[id^="loaderELI"]').hide();
            if (ELIchart != null || ELIchart != undefined) {
                drawgraphELI($(thisTileELI).find('[id^="canvas"]').attr('id'));
            }
        }
        else {

            $(thisTileELI).find('[id^="loaderELI"]').hide();
            $(thisTileELI).find('[id^="btnBookTradeELI"]').attr("disabled", true);
        }

    } catch (error) {
        console.log(error.message);
        $(thisTileELI).find('[id^="loaderELI"]').hide();

    }
}
// To get Best prices 
function BestPrice(that) {
    try {
        // Added logic for getting current tile : Onkar E.//
        TileId = that.id.match(/\d+$/)[0];
        thisTileELI = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        validation_clear();
        clearPricerTable(thisTileELI); //To clear prices after clicking best price || Tina K || 20-Nov-2019
        //To Remove highlighted part if no error || Tina K || 16-Sep-2019
        var elem = $("body").find('.ValidateFieldCSS')
        if (elem.id != "") {
            elem.removeClass("ValidateFieldCSS")
            document.getElementById("required").style.display = "none" //Remove icon '*' || Tina K 
        } //END Remove

        //Validation conditions added || Tina Kshirsagar || 6-09-2019 
        /*if (sharesnames.length != 0) {
            if ($(thisTileELI).find('[id^="shareNameCntrlELI"]')[0].childNodes.length != 0 && $(thisTileELI).find('[id^="ELISharesDemo"]')[0].value != "") {
                arr = jquery.grep(sharesnames, function (n, i) {
                    return (n == $.trim($(thisTileELI).find('[id^="ELISharesDemo"]').val()) && i >= 0);
                });
                if (arr.length == 0) {
                    ValidateField($(thisTileELI).find('[id^="shareDivELI"]').attr('id'), "Please Enter Valid Shares");
                    return false
                }
            }
        }
        if ($(thisTileELI).find('[id^="shareNameCntrlELI"]')[0].childNodes.length == 0) {
            ValidateField($(thisTileELI).find('[id^="shareDivELI"]').attr('id'), "Please Enter Valid Shares");
            return false
        } else
        */
        if ($(thisTileELI).find('[id^="shareDivELI"]')[0].childNodes.length == 3) {     
            ValidateField($(thisTileELI).find('[id^="shareDivELI"]').attr('id'), "Please Enter Valid Shares", thisTileELI);
            return false
        } else if ($.trim($(thisTileELI).find('[id^="ContractAmtELI"]').val()) == '' || parseFloat($(thisTileELI).find('[id^="ContractAmtELI"]').val()) == 0) {
            ValidateField($(thisTileELI).find('[id^="ContractAmtELI"]').attr('id'), "Please Enter Valid Contract Amount", thisTileELI);
            return false
        } else if ($.trim($(thisTileELI).find('[id^="tenorELI"]').val()) == '') {
            ValidateField($(thisTileELI).find('[id^="tenorELI"]').attr('id'), "Please Enter Valid Tenor", thisTileELI);
            return false
        } else if ($.trim($(thisTileELI).find('[id^="strikeipboxELI"]').val()) == '' || $.trim($(thisTileELI).find('[id^="strikeipboxELI"]').val()) == '.' || parseFloat($(thisTileELI).find('[id^="strikeipboxELI"]').val()) == 0) {
            ValidateField($(thisTileELI).find('[id^="strikeipboxELI"]').attr('id'), "Please Enter Valid Strike", thisTileELI);
            return false
        } else if ($.trim($(thisTileELI).find('[id^="CouponipboxELI"]').val()) == '' || $.trim($(thisTileELI).find('[id^="CouponipboxELI"]').val()) == '.' || parseFloat($(thisTileELI).find('[id^="CouponipboxELI"]').val()) == 0) {
            ValidateField($(thisTileELI).find('[id^="CouponipboxELI"]').attr('id'), "Please Enter Valid Coupon", thisTileELI);
            return false
        } else if ($.trim($(thisTileELI).find('[id^="KOipboxELI"]').val()) == '' || $.trim($(thisTileELI).find('[id^="KOipboxELI"]').val()) == '.') {
            ValidateField($(thisTileELI).find('[id^="KOipboxELI"]').attr('id'), "Please Enter Valid KO", thisTileELI);
            return false
        } else if ($.trim($(thisTileELI).find('[id^="KIipboxELI"]').val()) == '' || $.trim($(thisTileELI).find('[id^="KIipboxELI"]').val()) == '.') {
            ValidateField($(thisTileELI).find('[id^="KIipboxELI"]').attr('id'), "Please Enter Valid KI", thisTileELI);
            return false
        } else if (parseFloat($(thisTileELI).find('[id^="strikeipboxELI"]').val()) < 60 || parseFloat($(thisTileELI).find('[id^="strikeipboxELI"]').val()) > 100) {
            ValidateField($(thisTileELI).find('[id^="strikeipboxELI"]').attr('id'), "Please enter valid Strike(%) between 60.00 and 100.00", thisTileELI);
            return false
        } else if (parseFloat($(thisTileELI).find('[id^="CouponipboxELI"]').val()) > 99) {
            ValidateField($(thisTileELI).find('[id^="CouponipboxELI"]').attr('id'), "Coupon(%) should be less than or equal to 99.00.", thisTileELI);
            return false
        } else if (parseFloat($(thisTileELI).find('[id^="KOipboxELI"]').val()) < 100 || parseFloat($(thisTileELI).find('[id^="KOipboxELI"]').val()) > 110) {
            ValidateField($(thisTileELI).find('[id^="KIipboxELI"]').attr('id'), "Please enter valid KO(%) between 100.00 and 110.00", thisTileELI);
            return false
        } else if (parseFloat($(thisTileELI).find('[id^="KIipboxELI"]').val()) >= 95 || (parseFloat($(thisTileELI).find('[id^="KIipboxELI"]').val()) >= parseFloat($(thisTileELI).find('[id^="strikeipboxELI"]').val()))) {
            ValidateField($(thisTileELI).find('[id^="KIipboxELI"]').attr('id'), "KI(%) should be less than min(95.00,Strike)", thisTileELI);
            return false
        } else if (parseFloat($(thisTileELI).find('[id^="KIipboxELI"]').val()) < 10) {
            ValidateField($(thisTileELI).find('[id^="KIipboxELI"]').attr('id'), "KI(%) should be less than min(95.00,Strike)", thisTileELI);
            return false
        } //Validation END

        BestPriceForELI(TileId);
        $(thisTileELI).find('[id^="loaderELI"]').show();
        $(thisTileELI).find('[id^="btnBookTradeELI"]').attr("disabled", true);
    } catch (error) {
        console.log(error.message);
    }
}

// To get Book prices 
function bookorderELI(that) {

    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileELI = document.getElementById("td" + TileId);
        var getdateELI = "\/" + "Date" + "(" + ((((today.getMonth() > 8) ? (today.getMonth() + 1) : ('0' + (today.getMonth() + 1))) + '/' + ((today.getDate() > 9) ? today.getDate() : ('0' + today.getDate())) + '/' + today.getFullYear()).replace("/", "")).replace("/", "") + ")\/"


        if ($(thisTileELI).find('[id^="hdnQuoteIDELI"]').val() == "") {
            booktradePopup(that, "booktradeELI" + TileId, "Order Execution Failed!", "DivOverlayELI");
            $(thisTileELI).find('[id^="loaderELI"]').hide();
        } else {

            request_getDataFromAPI({

                "rfqID": $(thisTileELI).find('[id^="hdnQuoteIDELI"]').val(),
                "issuer": $(thisTileELI).find('[id^="hdnissuerELI"]').val(),
                "shareName": getExchangeAndCcyFromBasket($(thisTileELI).find('[id^="shareDivELI"]')[0], 'share')[0],//$(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[0],
                "currency": $(thisTileELI).find('[id^="noteCCY"]').val(),
                "notional": $(thisTileELI).find('[id^="ContractAmtELI"]').val().split('.')[0].replace(/\,/g, ""),
                "strikePer": $(thisTileELI).find('[id^="strikeipboxELI"]').val(),
                "KOPer": $(thisTileELI).find('[id^="KOipboxELI"]').val(),
                "startDate": getdateELI,
                "endDate": getdateELI,
                "KIPer": $(thisTileELI).find('[id^="KIipboxELI"]').val(),
                "couponPer": $(thisTileELI).find('[id^="CouponipboxELI"]').val(),
                "tenor": $(thisTileELI).find('[id^="tenorELI"]').val().toUpperCase(),
                "Price": $(thisTileELI).find('[id^="hdnBestPriceELI"]').val(),
                "CurrentTileID": TileId

            }, clientConfigdata.CommonMethods.NodeServer + "bookOrderELI").then(data => {

                thisTileELI = document.getElementById("td" + data.CurrentTileID);
                TileId = data.CurrentTileID
                if (data.saveTradeResult == "" || data.saveTradeResult == null || data.saveTradeResult == undefined) {
                    var orderplaced = "ELI ::" + " " + "Order may have got executed or may have failed. Contact support!"
                } else {
                    var orderplaced = "ELI :: Order Placed Successfully with Order ID " + " " + data.saveTradeResult + "<br><br>";
                }
                $(thisTileELI).find('[id^="hdnBlotterURLELI"]').val(clientConfigdata.CommonMethods.getBlotter);
                $(thisTileELI).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradeELI" + TileId, orderplaced, "DivOverlayELI");
                $(thisTileELI).find('[id^="loaderELI"]').hide();
                $(thisTileELI).find('[id^="hdnQuoteIDELI"]').val("")
                // $(thisTileELI).find('[id^=""]').val("");
            }).catch(error => { console.log(error); })

        }

    } catch (error) {

        console.log(error.message);
        booktradePopup(that, "booktradeELI" + TileId, "Order may have got executed or may have failed. Contact support!", "DivOverlayELI");
        $(thisTileELI).find('[id^="loaderELI"]').hide();
        $(".lblError").html(error.message)
    } finally {

    }
}

// async-------------------------------------------

// function BestPriceForELIAsync(TileId) {

//     try {
//         var share1, share2, share3;
//         thisTileELI = document.getElementById("td" + TileId);
//         if ($("#hiddeninputshare" + "ELI" + TileId)[0].value.split("~").length == 2) {
//             share1 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[0];
//             share2 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[1];
//             share3 = "";
//         }
//         if ($("#hiddeninputshare" + "ELI" + TileId)[0].value.split("~").length == 3) {
//             share1 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[0];
//             share2 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[1];
//             share3 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[2];
//         }
//         if ($("#hiddeninputshare" + "ELI" + TileId)[0].value.split("~").length == 4) {
//             share1 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[0];
//             share2 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[1];
//             share3 = $(thisTileELI).find('[id^="hiddeninputshareELI"]')[0].value.split("~")[2];
//         }

//         request_getDataFromAPI({

//             "Exchange1": $(thisTileELI).find('[id^="hiddeninputExchangeELI"]').val().split("|")[0].trim(),
//             "UnderlyingCode1": share1,
//             "Exchange2": $(thisTileELI).find('[id^="hiddeninputExchangeELI"]').val().split("|")[1].trim(),
//             "UnderlyingCode2": share2,
//             "Exchange3": $(thisTileELI).find('[id^="hiddeninputExchangeELI"]').val().split("|")[2].trim(),
//             "UnderlyingCode3": share3,
//             "Ccy": $(thisTileELI).find('[id^="noteCCY"]').val(),
//             "BarrierPerc": $(thisTileELI).find('[id^="KOipboxELI"]').val(),
//             "Tenor": $(thisTileELI).find('[id^="tenorELI"]').val(),
//             "strikePerc": $(thisTileELI).find('[id^="strikeipboxELI"]').val(),
//             "KIPerc": $(thisTileELI).find('[id^="KIipboxELI"]').val(),
//             "CouponPerc": $(thisTileELI).find('[id^="CouponipboxELI"]').val(),
//             "TradeDate": today.toShortFormat(),
//             "CurrentTileID": TileId

//             }, clientConfigdata.CommonMethods.NodeServer + "getPPDetailsELI").then(data => {

//                 // a = data.split("<");
//                 // var PPDetails_ELI = a[0];

//                 thisTileELI = document.getElementById("td" + data.split("<")[1].split("|")[3].split("-")[2]);
//                // TileId = data.split("<")[1].split("|")[3].split("-")[2];
//                 $(thisTileELI).find('[id^="hdnQuoteIDELI"]').val(data.split("<")[0]);
//                // console.log(TileId, InsertPricerobject_ELI, PPDetails_ELI)

//                 setTimeout(function() {
//                     DetailsForAllELI($(thisTileELI).find('[id^="hdnQuoteIDELI"]').val(), data.split("<")[1].split("|")[3].split("-")[2]);
//                 }, 3500);

//             }).catch(error => { console.log(error); })

//     } catch (error) {
//         console.log(error.message);
//         if(data == undefined || data == null || data == ""){
//             ValidateField($(thisTileELI).find('[id^="hdnBestPriceELI"]').attr('id'), "ELI :: Pricing down please try after some time");
//             return false
//         }
//         $(thisTileELI).find('[id^="loaderELI"]').hide();
//     } finally {

//     }
// }

// function DetailsForAllELIAsync(PPDetails_ELI, TileId){

//     try {
//         if (flag) {
//             wait(3500);
//         }

//         request_getDataFromAPI({

//             "PPDetails": PPDetails_ELI,
//             "CurrentTileID": TileId

//             }, clientConfigdata.CommonMethods.NodeServer + "getPriceELI").then(data => {

//                 thisTileELI = document.getElementById("td" + data.CurrentTileID);
//                 TileId = data.CurrentTileID
//                 var temp = [];
//                 var ExQuoteId;
//                 if (data.Get_ExternalPriceProvider_Response_DetailsForAll_ELI_Flexi_AllResult != "") {
//                     $(thisTileELI).find('[id^="btnBookTradeELI"]').attr("disabled", false);
//                     ExQuoteId = data.Get_ExternalPriceProvider_Response_DetailsForAll_ELI_Flexi_AllResult[0].CommonRFQ;
//                     thisTileELI = $('input[id$="hdnQuoteIDELI"][value="' + ExQuoteId + '"]').parents(".sorting")[0];
//                     console.log(ExQuoteId, thisTileELI, data);

//                     $(thisTileELI).find('[id^="ELIBanksRow"]').empty();
//                     $(thisTileELI).find('[id^="ELIPrices"]').empty();

//                     ELIchart = JSON.parse(JSON.stringify(data.Get_ExternalPriceProvider_Response_DetailsForAll_ELI_Flexi_AllResult));
//                     $(thisTileELI).find('[id^="hdnPriceELI"]').val(JSON.stringify(data.Get_ExternalPriceProvider_Response_DetailsForAll_ELI_Flexi_AllResult));
//                     $(data.Get_ExternalPriceProvider_Response_DetailsForAll_ELI_Flexi_AllResult).each(function(i, that) {
//                         temp.push(that['PRICE']);
//                         var minPRICEELI = Math.min(...temp);
//                         var strBank = "";
//                         strBank = strBank + "<td>" + that['PP_CODE'] + "</td>"
//                         $(thisTileELI).find('[id^="ELIBanksRow"]').append(strBank);
//                         var strPrice = "";
//                         // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
//                         var priceClass = "GlowPrice_Red";
//                         if (!glowFlag) {
//                             priceClass = "noGlow";
//                         }
//                         if (that['PRICE'] == minPRICEELI) {
//                             strPrice = strPrice + "<td class='" + priceClass + "'>" + parseFloat(that['PRICE']).toFixed(2) + "</td>";
//                             $(thisTileELI).find('[id^="hdnBestPriceELI"]').val(parseFloat(that['PRICE']).toFixed(2));
//                             $(thisTileELI).find('[id^="hdnissuerELI"]').val(that['PP_CODE']);
//                         } else {
//                             strPrice = strPrice + "<td>" + parseFloat(that['PRICE']).toFixed(2) + "</td>"
//                         }
//                         $(thisTileELI).find('[id^="ELIPrices"]').append(strPrice);
//                     })
//                     $(thisTileELI).find('[id^="loaderELI"]').hide();
//                     if (ELIchart != null || ELIchart != undefined) {
//                         drawgraphELI($(thisTileELI).find('[id^="canvas"]').attr('id'));
//                     }
//                 }
//                 else{

//                     $(thisTileELI).find('[id^="loaderELI"]').hide();
//                     $(thisTileELI).find('[id^="btnBookTradeELI"]').attr("disabled", true);    
//                 }

//             }).catch(error => { console.log(error); })

//     } catch (error) {
//         console.log(error.message);
//         $(thisTileELI).find('[id^="loaderELI"]').hide();
//     } finally {

//     }
// }








