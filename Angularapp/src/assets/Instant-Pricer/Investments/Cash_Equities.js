var CashEQ_NoteMaster_ID = "";
var Feedcode = "";
var Exchange = "";
var Currency = "";
var SettlementDate = "";
var CashEQ_Buy = false;
var AskPrice = "";
var obj = "";
var BidPrice = "";
var BuySell = "SELL";
var CashEQtickr;
var CashEQprice;
var cashEQResponse = [];
var idCASHEQUITIES = 10;

// To load Cash Equities default functions and values
function cashEqOnLoad(currId) {
    try {
        setDeafaultValuesCashEQ(currId);
        $(thisTileCashEq).find('[id^="hdnCashEqBuyFlag"]').val("false");
        $(thisTileCashEq).find('[id^="hdnCashEqBuySell"]').val("SELL");

        thisTileCashEq = document.getElementById("td" + currId);
        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
        var priceClass = "GlowPrice_Red";
        if (!glowFlag) {
            priceClass = "noGlow";
        }
        $(thisTileCashEq).find('[id^="CashEQ_Qnty"]').on("focusout", function () {
            $(this).parents('.sorting').find('[id^="CashEQ_Qnty"]').removeClass('ValidateFieldCSS')
            document.getElementById("required").style.display = "none"
            if (!isNaN(Number($(thisTileCashEq).find('[id^="AskPrice"]').val()))) {
                if ($(thisTileCashEq).find('[id^="hdnCashEqBuyFlag"]').val() == true) {
                    $(this).parents('.sorting').find('[id^="CashEQ_Amount"]').empty().html("");
                } else {
                    $(this).parents('.sorting').find('[id^="CashEQ_Amount"]').empty().html("");

                }
            }
        });

        $(thisTileCashEq).find('[id^="SharesbuySell"]').change(function () {
            try {

                if ($(this).parents('.sorting').find('[id^="rbColShares"]')[0].checked) {
                    $(thisTileCashEq).find('[id^="hdnCashEqBuyFlag"]').val("true");
                    $(thisTileCashEq).find('[id^="hdnCashEqBuySell"]').val("BUY");
                } else {
                    $(thisTileCashEq).find('[id^="hdnCashEqBuyFlag"]').val("false");
                    $(thisTileCashEq).find('[id^="hdnCashEqBuySell"]').val("SELL");
                }

                if (!isNaN(Number($(thisTileCashEq).find('[id^="AskPrice"]').val()))) {
                    if (JSON.parse($(thisTileCashEq).find('[id^="hdnCashEqBuyFlag"]').val()) == true) {
                        $(this).parents('.sorting').find('[id^="CashEQ_Amount"]').empty().html("-")
                        //  $(this).parents('.sorting').find('[id^="CashEQ_Amount"]').empty().html(formatNotionalWithComma_Common((Number($(thisTileCashEq).find('[id^="AskPrice"]').val()) * Number($(this).parents('.sorting').find('[id^="CashEQ_Qnty"]').val().replace(/,/g, "").split(".")[0]))));
                        $(this).parents('.sorting').find('[id^="CashEQ_Shares_BankNameRow"]').empty().append("<td> Ask Price </td>");
                        $(this).parents('.sorting').find('[id^="CashEQ_Shares_PriceRow"]').empty().append("<td class='" + priceClass + "'>" + Number($(thisTileCashEq).find('[id^="AskPrice"]').val()) + "</td>");
                    } else {
                        $(this).parents('.sorting').find('[id^="CashEQ_Amount"]').empty().html("-")
                        //   $(this).parents('.sorting').find('[id^="CashEQ_Amount"]').empty().html(formatNotionalWithComma_Common((Number($(thisTileCashEq).find('[id^="BidPrice"]').val()) * Number($(this).parents('.sorting').find('[id^="CashEQ_Qnty"]').val().replace(/,/g, "").split(".")[0]))));
                        $(this).parents('.sorting').find('[id^="CashEQ_Shares_BankNameRow"]').empty().append("<td> Bid Price </td>");
                        $(this).parents('.sorting').find('[id^="CashEQ_Shares_PriceRow"]').empty().append("<td class='" + priceClass + "'>" + Number($(thisTileCashEq).find('[id^="BidPrice"]').val()) + "</td>");
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        });


        $(thisTileCashEq).find('[id^="Cash_Eq_sharesList"]').autocomplete({
                minLength: 1,
                source: function(request, response) {
                    $.ajax({
                        url: clientConfigdata.CommonMethods.NodeServer + "Cash_EQ_GetShares", //http://40.118.0.203/FinIQservice/BondInfoDemo.svc/FindProductDemo
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        autoFill: true,
                        type: 'POST',
                        async: false,
                        crossDomain: true,
                        data: JSON.stringify({
                            "RequestAt": new Date(),
                            "ProductName": request.term
                        }),
                        success: function(data) {
                            cashEQResponse = [];
                            var indexCashEQ = 0;

                        $(data.ListProduct.items).each(function (i, n) {

                            if (n.Product_Name.trim().toLowerCase().startsWith(request.term.toLowerCase())) {
                                cashEQResponse[indexCashEQ] = n;
                                indexCashEQ++;


                            }

                        })

                        response(cashEQResponse);



                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError);
                    }
                });
            },
            focus: function (event, ui) {
                $(this).parents('.sorting').find('[id^="Cash_Eq_sharesList"]').val(ui.item.Product_Name);
                return false;
            },
            select: function (event, ui) {

                $(this).parents('.sorting').find('[id^="Cash_Eq_sharesList"]').removeClass('ValidateFieldCSS')
                document.getElementById("required").style.display = "none"

                $(this).parents('.sorting').find('[id^="Cash_Eq_sharesList"]').val(ui.item.Product_Name);

                $(this).parents('.sorting').find('[id^="CashEqNMID"]')[0].value = ui.item.Note_Master_Id;

                    obj = request_getDataFromAPI({
                        "RequestAt": new Date(),
                        "NoteMasterID": $(this).parents('.sorting').find('[id^="CashEqNMID"]')[0].value
                    }, clientConfigdata.CommonMethods.NodeServer + "/Cash_EQ_getProductInfo").then(obj => {


                    //fillProductInfo();
                    if (obj.FinIQResponseHeader.Status.toLowerCase() != "failed") {
                        $(this).parents('.sorting').find('[id^="CashEQ_sharesTicker"]').html(obj.ListInfoProduct.ProductDetails.Feedcode);
                        $(this).parents('.sorting').find('[id^="CashEQ_sharesExchange"]').html(obj.ListInfoProduct.ProductDetails.Exchange);
                        $(this).parents('.sorting').find('[id^="CashEQ_sharesCurrency"]').html(obj.ListInfoProduct.ProductDetails.Currency);
                        $(this).parents('.sorting').find('[id^="CashEQ_SettlementDate"]').html(obj.ListInfoProduct.ProductDetails.SettlementDate);
                        $(this).parents('.sorting').find('[id^="CashEQ_Ccy"]').html("(" + obj.ListInfoProduct.ProductDetails.Currency + ")");
                        $(this).parents('.sorting').find('[id^="CashEQ_Amount"]').html("-");
                    } else {
                        console.log("Cash EQ Cash_EQ_GetShares :: " + data.ListProduct.ResponseDetails.Description + " Remark " + data.ListProduct.ResponseDetails.Remark)
                    }
                }).catch(error => { console.log(error); })
                return false;
            }
        })
            .autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.Product_Name + " (" + item.Currency + " | " + item.Exchange + ")" + "</div>")
                    .appendTo(ul);
            };

    } catch (error) {
        console.log(error.message)
    }

}

// To set default values of parameters
function setDeafaultValuesCashEQ(currId) {
    try {
        thisTileCashEq = document.getElementById("td" + currId);
        $(thisTileCashEq).find('[id^="CashEQ_Qnty"]').val("100");
        //$(thisTileCashEq).find('[id^="CashEQ_Amount"]').val("-");
        clearPricerTable(thisTileCashEq);
        $(thisTileCashEq).find('[id^="CashEQ_Amount"]').html("-");
        $(thisTileCashEq).find('[id^="rbRowShares"]')[0].checked = false;
        $(thisTileCashEq).find('[id^="Cash_Eq_sharesList"]').val(clientConfigdata.CashEquities.DEFAULT_SHARE);
    } catch (error) {
        console.log(error.message);
    }
}

// To fill Cash Equities parameter information
function fillProductInfo(that) {
    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileCashEq = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        //To Remove highlighted part if no error || Tina K || 18-Sep-2019
        clearPricerTable(thisTileCashEq); //To clear prices after clicking best price || Tina K || 20-Nov-2019

        //Validation conditions added || Tina Kshirsagar || 6-09-2019

        var priceClass = "GlowPrice_Red";
        if (!glowFlag) {
            priceClass = "noGlow";
        }
        if ($.trim($(thisTileCashEq).find('[id^="Cash_Eq_sharesList"]').val()) == '') {
            ValidateField($(thisTileCashEq).find('[id^="Cash_Eq_sharesList"]').attr('id'), "Please Enter Valid Shares", thisTileCashEq);
            return false
        } else if ($.trim($(thisTileCashEq).find('[id^="CashEQ_Qnty"]').val()) == '' || parseFloat($(thisTileCashEq).find('[id^="CashEQ_Qnty"]').val()) == 0) {
            ValidateField($(thisTileCashEq).find('[id^="CashEQ_Qnty"]').attr('id'), "Please Enter Valid Order Quantity", thisTileCashEq);
            return false
        } else if ($.trim($(thisTileCashEq).find('[id^="CashEqNMID"]').val()) == '') {
            ValidateField($(thisTileCashEq).find('[id^="Cash_Eq_sharesList"]').attr('id'), "Please Enter Valid Shares", thisTileCashEq);
            return false
        } //Validation END

        $(thisTileCashEq).find("[id^='loaderShares']").show();

        obj = request_getDataFromAPI({
            "RequestAt": new Date(),
            "NoteMasterID": $(thisTileCashEq).find('[id^="CashEqNMID"]')[0].value
        }, clientConfigdata.CommonMethods.NodeServer + "Cash_EQ_getProductInfo").then(obj => {

            validation_clear();
            $(thisTileCashEq).find('[id^="CashEQ_sharesTicker"]').empty();
            $(thisTileCashEq).find('[id^="CashEQ_sharesExchange"]').empty();
            $(thisTileCashEq).find('[id^="CashEQ_sharesCurrency"]').empty();
            $(thisTileCashEq).find('[id^="CashEQ_SettlementDate"]').empty();
            $(thisTileCashEq).find('[id^="CashEQ_Amount"]').empty();
            $(thisTileCashEq).find('[id^="CashEQ_Ccy"]').empty();
            $(thisTileCashEq).find('[id^="CashEQ_Shares_BankNameRow"]').empty();
            $(thisTileCashEq).find('[id^="CashEQ_Shares_PriceRow"]').empty();
            $(thisTileCashEq).find('[id^="AskPrice"]').val(obj.ListInfoProduct.ProductDetails.AskPx);
            $(thisTileCashEq).find('[id^="BidPrice"]').val(obj.ListInfoProduct.ProductDetails.BidPx);
            AskPrice = obj.ListInfoProduct.ProductDetails.AskPx;
            BidPrice = obj.ListInfoProduct.ProductDetails.BidPx;
            Feedcode = obj.ListInfoProduct.ProductDetails.Feedcode;
            Exchange = obj.ListInfoProduct.ProductDetails.Exchange;
            Currency = obj.ListInfoProduct.ProductDetails.Currency;
            SettlementDate = obj.ListInfoProduct.ProductDetails.SettlementDate;
            $(thisTileCashEq).find('[id^="CashEQ_sharesTicker"]').html(obj.ListInfoProduct.ProductDetails.Feedcode);
            $(thisTileCashEq).find('[id^="CashEQ_sharesExchange"]').html(obj.ListInfoProduct.ProductDetails.Exchange);
            $(thisTileCashEq).find('[id^="CashEQ_sharesCurrency"]').html(obj.ListInfoProduct.ProductDetails.Currency);
            $(thisTileCashEq).find('[id^="CashEQ_SettlementDate"]').html(obj.ListInfoProduct.ProductDetails.SettlementDate);
            $(thisTileCashEq).find('[id^="CashEQ_Ccy"]').html("(" + obj.ListInfoProduct.ProductDetails.Currency + ")");

            if (!isNaN(Number($(thisTileCashEq).find('[id^="AskPrice"]').val()))) {
                if ($(thisTileCashEq).find('[id^="rbColShares"]')[0].checked) {
                    $(thisTileCashEq).find('[id^="CashEQ_Amount"]').empty().html(formatNotionalWithComma_Common((Number(($(thisTileCashEq).find('[id^="AskPrice"]').val())) * Number($(thisTileCashEq).find('[id^="CashEQ_Qnty"]').val().replace(/,/g, "").split(".")[0]))));
                    $(thisTileCashEq).find('[id^="CashEQ_Shares_BankNameRow"]').empty().append("<td> Ask Price </td>");
                    $(thisTileCashEq).find('[id^="CashEQ_Shares_PriceRow"]').empty().append("<td class='" + priceClass + "'>" + Number($(thisTileCashEq).find('[id^="AskPrice"]').val()) + "</td>");
                    CashEQprice = Number($(thisTileCashEq).find('[id^="AskPrice"]').val());
                } else {
                    $(thisTileCashEq).find('[id^="CashEQ_Amount"]').empty().html(formatNotionalWithComma_Common((Number($(thisTileCashEq).find('[id^="BidPrice"]').val()) * Number($(thisTileCashEq).find('[id^="CashEQ_Qnty"]').val().replace(/,/g, "").split(".")[0]))));
                    $(thisTileCashEq).find('[id^="CashEQ_Shares_BankNameRow"]').empty().append("<td> Bid Price </td>");
                    $(thisTileCashEq).find('[id^="CashEQ_Shares_PriceRow"]').empty().append("<td class='" + priceClass + "'>" + Number($(thisTileCashEq).find('[id^="BidPrice"]').val()) + "</td>");
                    CashEQprice = Number($(thisTileCashEq).find('[id^="BidPrice"]').val());
                }
            }
            CashEQtickr = obj.ListInfoProduct.ProductDetails.Feedcode + "-" + $(thisTileCashEq).find('[id^="hdnCashEqBuySell"]').val();
            if (CashEQprice != null || CashEQprice != undefined || CashEQprice != 0) {
                //drawgraphCASHEQ();
                //drawgraphCASHEQ("canvas" + idCASHEQUITIES);
                drawgraphCASHEQ($(thisTileCashEq).find('[id^="canvas"]').attr('id'));
            }
        }).catch(error => { console.log(error); })

    } catch (error) {
        console.log(error.message);
    } finally {
        $(thisTileCashEq).find("[id^='loaderShares']").hide();

    }
}

// To book CASH EQ request
function CashEQ_BookTrade(that) {
    try {

        TileId = that.id.match(/\d+$/)[0];
        thisTileCashEq = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');

        if ($(thisTileCashEq).find('[id^="CashEQ_sharesTicker"]').html() == "" || $(thisTileCashEq).find('[id^="CashEQ_Shares_PriceRow"]')[0].firstChild.innerHTML == "-" || $(thisTileCashEq).find('[id^="CashEQ_Shares_PriceRow"]')[0].firstChild.innerHTML == "") {
            // $("#OrderPlaced").html("Please Best Price Before Book Trade, Order Execution Failed!");
            // $("#booktradecashx1").dialog("open");
            // $("#booktradecashx1").show();
            booktradePopup(that, "booktradecasheq" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlaycasheq");
            //$('#DivOverlay').show();
            return false;
        }

        if (Number($(thisTileCashEq).find('[id^="CashEQ_Qnty"]').val().replace(/,/g, "").split(".")[0]) == 0) {
            return false;
        }
        $(thisTileCashEq).find("[id^='loaderShares']").show();

        var bookTradeObj = request_getDataFromAPI({
            "RequestAt": today.toShortFormat(),
            "UnderlyingSecurityID": $(thisTileCashEq).find('[id^="CashEQ_sharesTicker"]').html(),
            "Side": $(thisTileCashEq).find('[id^="hdnCashEqBuySell"]').val(),
            "ExDestination": $(thisTileCashEq).find('[id^="CashEQ_sharesExchange"]').html(),
            "Currency": $(thisTileCashEq).find('[id^="CashEQ_sharesCurrency"]').html(),
            "TradeDate": new Date().toShortFormat(),
            "SettlType": "2",
            "OrdType": "MARKET",
            "TimeInForce": "DAY",
            "RM": clientConfigdata.CashEquities.RM_NAME,
            "Customer": clientConfigdata.CashEquities.CUSTOMER_NAME,
            "SettlDate": $(thisTileCashEq).find('[id^="CashEQ_SettlementDate"]').html(),
            "Price": $(thisTileCashEq).find('[id^="rbColShares"]')[0].checked == true ? Number($(thisTileCashEq).find('[id^="AskPrice"]').val()) : Number($(thisTileCashEq).find('[id^="BidPrice"]').val()),
            "ExpireDate": $(thisTileCashEq).find('[id^="CashEQ_SettlementDate"]').html(),
            "OrderQty": Number($(thisTileCashEq).find('[id^="CashEQ_Qnty"]').val().replace(/,/g, "").split(".")[0]),
            "CurrentTileID": TileId
        }, clientConfigdata.CommonMethods.NodeServer + "Cash_EQ_BookTrade").then(bookTradeObj => {
            if (bookTradeObj.FinIQResponseHeader.Status != "Failed") {
                //$("#OrderPlaced").html("Cash Equities : Order Placed Successfully with Order ID " + bookTradeObj.Order_Save_Res_DTO.objResponseDetails.OrdResponseDetails.Remark.split(" ")[4]);
                TileId = bookTradeObj.CurrentTileID
                $(thisTileCashEq).find('[id^="hdnBlotterURLCASHEQUITIES"]').val(clientConfigdata.CommonMethods.getBlotterURLOneFinIQ);
                $(thisTileCashEq).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradecasheq" + TileId, "Cash Equities : Order Placed Successfully with Order ID " + bookTradeObj.Order_Save_Res_DTO.objResponseDetails.OrdResponseDetails.Remark.split(" ")[4], "DivOverlaycasheq");
            } else {

                $(thisTileCashEq).find('[id^="hdnBlotterURLCASHEQUITIES"]').val(getBlotterURLOneFinIQ);
                $(thisTileCashEq).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradecasheq" + TileId, "Cash Equities :: Please Reprice First, Order Execution Failed! " + responseBookTrade.TradeBookingResponse.ResponseDetails.Description, "DivOverlaycasheq");
                // $("#booktradecashx1").dialog("open");
                // $("#booktradecashx1").show();
                // $("#OrderPlaced").html("Cash Equities :: Please Reprice First, Order Execution Failed! " + responseBookTrade.TradeBookingResponse.ResponseDetails.Description);
            }

            //$('#DivOverlay').show();
            //   $(thisTileCashEq).find('[id^="CashEQ_sharesTicker"]').empty();

        }).catch(error => { console.log(error); })

    } catch (error) {
        console.log(error.message);

        booktradePopup(that, "booktradecasheq" + TileId, "Please Best Price Before Book Trade, Order Execution Failed!", "DivOverlaycasheq");

    } finally {

        $(thisTileCashEq).find("[id^='loaderShares']").hide();

    }

}

//To take correct input in Share Name (onkeydown this function is called) || Tina K || 9-Oct-2019
function Enter_Correct_Share_CashEQ(that) {
    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileCashEq = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        var iKeyCode = (event.which) ? event.which : event.keyCode
        if (iKeyCode == 9 || (iKeyCode == 37) || (iKeyCode == 39)) {
            return true;
        } else if (((event.target.selectionStart <= 5) && (iKeyCode == 46 || (iKeyCode >= 65 && iKeyCode <= 90))) || iKeyCode == 8) {
            $(thisTileCashEq).find('[id^="CashEQ_sharesTicker"]').html("-");
            $(thisTileCashEq).find('[id^="CashEQ_SettlementDate"]').html("-");
            $(thisTileCashEq).find('[id^="CashEQ_sharesCurrency"]').html("-");
            $(thisTileCashEq).find('[id^="CashEQ_Amount"]').html("-");
            $(thisTileCashEq).find('[id^="CashEqNMID"]')[0].value = "";
            $(thisTileCashEq).find('[id^="AskPrice"]').val("-");
            $(thisTileCashEq).find('[id^="BidPrice"]').val("-");
            clearPricerTable(thisTileCashEq);
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err.message);
    }
}

function getShareInfo(request, currId) {
    thisTileCashEq = document.getElementById("td" + currId);
    var currNoteMasterId;
    $.ajax({
        url: clientConfigdata.CommonMethods.NodeServer + "Cash_EQ_GetShares", 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        autoFill: true,
        type: 'POST',
        async: false,
        crossDomain: true,
        data: JSON.stringify({
            "RequestAt": new Date(),
            "ProductName": request //"AAP"
        }),
        success: function (data) {
            console.log("From index set filters", data);
            for (var i = 0; i < data.ListProduct.items.length; i++) {
                if (data.ListProduct.items[i].Product_Name == $(thisTileCashEq).find('[id^="Cash_Eq_sharesList"]').val().replace(".", "").trim()) {
                    currNoteMasterId = data.ListProduct.items[i].Note_Master_Id;
                    console.log(data.ListProduct.items[i].Product_Name, data.ListProduct.items[i].Note_Master_Id);
                    break;
                }
            }
            getShareDetails(currNoteMasterId, currId);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        }
    });
}

function getShareDetails(currNoteMasterId, currId) {
    //thisTileCashEq = document.getElementById("td" + currId);
    console.log(currNoteMasterId);
    obj = request_getDataFromAPI({
        "RequestAt": new Date(),
        "NoteMasterID": currNoteMasterId,
        "CurrentTileID": currId
    }, clientConfigdata.CommonMethods.NodeServer + "Cash_EQ_getProductInfo").then(obj => {
        thisTileCashEq = document.getElementById("td" + obj.CurrentTileID);

        if (obj.FinIQResponseHeader.Status.toLowerCase() != "failed") {
            $(thisTileCashEq).find('[id^="CashEqNMID"]')[0].value = currNoteMasterId;
            $(thisTileCashEq).find('[id^="CashEQ_sharesTicker"]').html(obj.ListInfoProduct.ProductDetails.Feedcode);
            $(thisTileCashEq).find('[id^="CashEQ_sharesExchange"]').html(obj.ListInfoProduct.ProductDetails.Exchange);
            $(thisTileCashEq).find('[id^="CashEQ_sharesCurrency"]').html(obj.ListInfoProduct.ProductDetails.Currency);
            $(thisTileCashEq).find('[id^="CashEQ_SettlementDate"]').html(obj.ListInfoProduct.ProductDetails.SettlementDate);
            $(thisTileCashEq).find('[id^="CashEQ_Ccy"]').html("(" + obj.ListInfoProduct.ProductDetails.Currency + ")");
            $(thisTileCashEq).find('[id^="CashEQ_Amount"]').html("-");
            //      console.log(currId, $(thisTileCashEq).find('[id^="CashEQ_sharesTicker"]').html(), $(thisTileCashEq).find('[id^="CashEQ_sharesExchange"]').html(), $(thisTileCashEq).find('[id^="CashEQ_sharesCurrency"]').html(), $(thisTileCashEq).find('[id^="CashEQ_SettlementDate"]').html());
        } else {
            console.log("Cash EQ Cash_EQ_GetShares :: " + data.ListProduct.ResponseDetails.Description + " Remark " + data.ListProduct.ResponseDetails.Remark)
        }
    }).catch(error => { console.log(error); })

}