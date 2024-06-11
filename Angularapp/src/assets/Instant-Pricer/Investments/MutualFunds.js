var units;
var nav = "";
var navDefault;
var Fundccy;
var AppID; 
var fundCode;
var flag = true;
var idMUTUALFUND = 11;
var x_fund;
var y_nav;

$(document).ready(function() {

    // Added By RizwanS For Funds Subscription on :: 13-Nov-2019 
    try{



    }catch(err){
        console.log(err.message)
    }

    // END
})

// Defualt Fund on Page Load :: Start
function getfundonload(currId) {
    try {
        setDeafaultValuesMF(currId);
        thisTileMutualFunds = document.getElementById("td" + currId);
        $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
        $(thisTileMutualFunds).find('[id^="MF_FundList"]').autocomplete({
                minLength: 1,
                sortResults: true,
                source: function(request, response) {
                    $.ajax({
                        url: clientConfigdata.CommonMethods.NodeServer + "getFundList", 
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        autoFill: true,
                        type: 'GET',
                        async: false,
                        crossDomain: true,

                        success: function(data) {
                            FundsList = [];
                            var Fund_Index = 0;
                            $(data.GetMutualFundsDetailsResult).each(function(i, n) {
                                if (n.FundDetails.trim().toLowerCase().startsWith(request.term.toLowerCase())) {
                                    FundsList[Fund_Index] = n;
                                    Fund_Index++;
                                }
                            });
                            response(FundsList);
                        },
                        error: function(xhr, ajaxOptions, thrownError) {
                            console.log(thrownError);
                        }
                    });
                },
                focus: function(event, ui) {

                    $(this).parents('.sorting').find('[id^="MF_FundList"]').val(ui.item.FundDetails);
                    $(this).parents('.sorting').find('[id^="fundsNav"]').html(ui.item.BidNAV);
                    return false;
                },
                select: function(event, ui) {
                    $(this).parents('.sorting').find('[id^="MF_FundList"]').val(ui.item.FundDetails);
                    $(this).parents('.sorting').find('[id^="fundsCurrency"]').html(ui.item.Ccy);
                    $(this).parents('.sorting').find('[id^="fundsRating"]').html(ui.item.Rating);
                    $(this).parents('.sorting').find('[id^="fundsNav"]').html(ui.item.BidNAV);
                    $(this).parents('.sorting').find('[id^="annualFees"]').html(ui.item.AnnualFees)
                    $(this).parents('.sorting').find('[id^="trailerFees"]').html(ui.item.TrailerFees)
                    $(this).parents('.sorting').find('[id^="FundCode"]').html(ui.item.Code);
                    $(this).parents('.sorting').find('[id^="FundSector"]').html(ui.item.Sector);

                    //    Get Reports For Selected Funds modified On 17-Sep-2019 By RizwanS

                    $(this).parents('.sorting').find('[id^="fundsFactsheet"]').addClass("inactiveLink");
                    $(this).parents('.sorting').find('[id^="annualReportMF"]').addClass("inactiveLink");

                    if (ui.item.Factsheet != "" || ui.item.Prospectus != "") {
                        $(this).parents('.sorting').find('[id^="fundsFactsheet"]').removeClass("inactiveLink");
                        $(this).parents('.sorting').find('[id^="annualReportMF"]').removeClass("inactiveLink");
                        $(this).parents('.sorting').find('[id^="fundsFactsheet"]')[0].href = ui.item.Factsheet
                        $(this).parents('.sorting').find('[id^="annualReportMF"]')[0].href = ui.item.Prospectus
                        $('a.external').attr('target', '_blank');

                    } else {
                        $(this).parents('.sorting').find('[id^="fundsFactsheet"]').removeAttr("href");
                        $(this).parents('.sorting').find('[id^="annualReportMF"]').removeAttr("href");
                    }

                    // END  



                    Fundccy = $(this).parents('.sorting').find('[id^="fundsCurrency"]').html(ui.item.Ccy)[0].innerHTML;
                    fundCode = $(this).parents('.sorting').find('[id^="FundCode"]').html(ui.item.Code)[0].innerHTML;
                    nav = $(this).parents('.sorting').find('[id^="fundsNav"]').html(ui.item.BidNAV)[0].innerHTML;
                    $(this).parents('.sorting').find('[id^="navDefault"]')[0].value = nav;
                    notional = $(this).parents('.sorting').find('[id^="funds_ContractAmt"]').val();
                    $(this).parents('.sorting').find('[id^="MF_FundList"]').removeClass('ValidateFieldCSS');
                    document.getElementById("required").style.display = "none"
                        // isNaN condition is added to check whether NaV is present or not then only units will get calculated || Tina K || 6-Dec-2019
                    if (nav == 0 || nav == "FAIL" || nav == undefined || nav == NaN || isNaN($(thisTileMutualFunds).find('[id^="Funds_PriceRow"]')[0].innerText)) {
                        $(this).parents('.sorting').find('[id^="MF_units"]').html("-");
                        return false;
                    } else {
                        if (notional != 0 && notional != NaN && notional != undefined && notional != "FAIL" && notional != null && notional != "") {
                            units = parseInt(notional.replace(/,/g, "")) / parseFloat(nav);
                            $(this).parents('.sorting').find('[id^="MF_units"]').html(units.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
                            return false;
                        } else {
                            $(this).parents('.sorting').find('[id^="MF_units"]').html("-");
                            return false;
                        }
                    }
                }
            })
            .autocomplete("instance")._renderItem = function(ul, item) {
                return $("<li>")
                    .append("<div>" + item.FundDetails + "</div>")
                    .appendTo(ul);
            };
        // Function for Selection Of Fund :: END

        // Function for Units Calculation :: Start
        $(thisTileMutualFunds).find('[id^="funds_ContractAmt"]').on('select', function() {
            // isNaN condition is added to check whether NaV is present or not then only units will get calculated || Tina K || 6-Dec-2019
            try{

            if (!isNaN($(thisTileMutualFunds).find('[id^="Funds_PriceRow"]')[0].innerText)) {
                FormatNotionalCommon(this.value, this);
                notional = $(this).parents('.sorting').find('[id^="funds_ContractAmt"]').val();
                if (notional == "") {
                    return false;

                } else {
                    if (nav == "") {
                        units = parseInt(notional.replace(/,/g, "")) / parseFloat($(this).parents('.sorting').find('[id^="fundsNav"]')[0].textContent);
                    } else {
                        units = parseInt(notional.replace(/,/g, "")) / parseFloat(nav);
                    }
                }
                if (units == Infinity || units == 0 || units == undefined || units == NaN || units == "FAIL") {
                    $(this).parents('.sorting').find('[id^="MF_units"]').html("-");

                } else {
                    if (notional != 0 && notional != NaN && notional != undefined && notional != "FAIL" && notional != null && notional != "") {

                        if (nav == "") {

                            units = parseInt(notional.replace(/,/g, "")) / parseFloat($(this).parents('.sorting').find('[id^="fundsNav"]')[0].textContent);
                            $(this).parents('.sorting').find('[id^="MF_units"]').html(units.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
                            return false;

                        } else {
                            units = parseInt(notional.replace(/,/g, "")) / parseFloat(nav);
                            $(this).parents('.sorting').find('[id^="MF_units"]').html(units.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
                            return false;
                        }

                    } else {
                        $(this).parents('.sorting').find('[id^="MF_units"]').html("-");
                        return false;
                    }

                }
            } else {
                $(this).parents('.sorting').find('[id^="MF_units"]').html("-");
                return false;
            }

        }catch(err){
            console.log(err.message)
        }
        })

        $(thisTileMutualFunds).find('[id^="funds_ContractAmt"]').on('change', function() {
            // isNaN condition is added to check whether NaV is present or not then only units will get calculated || Tina K || 6-Dec-2019
            try{
            if (!isNaN($(thisTileMutualFunds).find('[id^="Funds_PriceRow"]')[0].innerText)) {
                FormatNotionalCommon(this.value, this);
                notional = $(this).parents('.sorting').find('[id^="funds_ContractAmt"]').val();
                if (nav == "") {
                    units = parseInt(notional.replace(/,/g, "")) / parseFloat($(this).parents('.sorting').find('[id^="fundsNav"]')[0].textContent);
                } else {
                    units = parseInt(notional.replace(/,/g, "")) / parseFloat(nav);
                }
                if (units == Infinity || units == 0 || units == undefined || units == NaN || units == "FAIL") {
                    $(this).parents('.sorting').find('[id^="MF_units"]').html("-");

                } else {
                    if (notional != 0 && notional != NaN && notional != undefined && notional != "FAIL" && notional != null && notional != "") {

                        if (nav == "") {

                            units = parseInt(notional.replace(/,/g, "")) / parseFloat($(this).parents('.sorting').find('[id^="fundsNav"]')[0].textContent);
                            $(this).parents('.sorting').find('[id^="MF_units"]').html(units.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
                            return false;

                        } else {
                            units = parseInt(notional.replace(/,/g, "")) / parseFloat(nav);
                            $(this).parents('.sorting').find('[id^="MF_units"]').html(units.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
                            return false;
                        }
                    } else {
                        $(this).parents('.sorting').find('[id^="MF_units"]').html("-");
                        return false;
                    }

                }
            } else {
                $(this).parents('.sorting').find('[id^="MF_units"]').html("-");
                return false;
            }
        }catch(err){
            console.log(err.message)
        }

        })


        $.ajax({
            url: clientConfigdata.CommonMethods.NodeServer + "getFundList", 
            async: false,
            crossDomain: true,
            type: 'GET',
            success: function(data) {
                $(thisTileMutualFunds).find('[id^="MF_FundList"]').val(data.GetMutualFundsDetailsResult[0].FundDetails);
                $(thisTileMutualFunds).find('[id^="fundsCurrency"]').html(data.GetMutualFundsDetailsResult[0].Ccy);
                $(thisTileMutualFunds).find('[id^="fundsRating"]').html(data.GetMutualFundsDetailsResult[0].Rating);
                $(thisTileMutualFunds).find('[id^="fundsNav"]').html(data.GetMutualFundsDetailsResult[0].BidNAV);
                $(thisTileMutualFunds).find('[id^="annualFees"]').html(data.GetMutualFundsDetailsResult[0].AnnualFees);
                $(thisTileMutualFunds).find('[id^="trailerFees"]').html(data.GetMutualFundsDetailsResult[0].TrailerFees);
                $(thisTileMutualFunds).find('[id^="FundCode"]').html(data.GetMutualFundsDetailsResult[0].Code);
                $(thisTileMutualFunds).find('[id^="FundSector"]').html(data.GetMutualFundsDetailsResult[0].Sector);
                Fundccy = data.GetMutualFundsDetailsResult[0].Ccy;
                fundCode = data.GetMutualFundsDetailsResult[0].Code;
                navDefault = data.GetMutualFundsDetailsResult[0].BidNAV;
                notional = $(thisTileMutualFunds).find('[id^="funds_ContractAmt"]').val();
                units = parseInt(notional.replace(/,/g, "")) / parseFloat(navDefault);
                // isNaN condition is added to check whether NaV is present or not then only units will get calculated || Tina K || 6-Dec-2019
                if (navDefault == 0 || navDefault == "FAIL" || navDefault == undefined || navDefault == NaN || isNaN($(thisTileMutualFunds).find('[id^="Funds_PriceRow"]')[0].innerText)) {
                    $(thisTileMutualFunds).find('[id^="MF_units"]').html("-");
                    return false;
                } else {
                    $(thisTileMutualFunds).find('[id^="MF_units"]').html(units.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
                    return false;
                }


            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

// To set default values
function setDeafaultValuesMF(currId) {
    try {
        thisTileMutualFunds = document.getElementById("td" + currId);
        $(thisTileMutualFunds).find('[id^="funds_ContractAmt"]').val("1,000,000.00");
        $(thisTileMutualFunds).find('[id^="navDefault"]')[0].value = "";
        $(thisTileMutualFunds).find('[id^="fundsFactsheet"]').removeAttr("href");
        $(thisTileMutualFunds).find('[id^="annualReportMF"]').removeAttr("href");
        $(thisTileMutualFunds).find('[id^="fundsFactsheet"]').addClass("inactiveLink");
        $(thisTileMutualFunds).find('[id^="annualReportMF"]').addClass("inactiveLink");
        $(thisTileMutualFunds).find('[id^="MF_units"]').html("-");
        clearPricerTable(thisTileMutualFunds);

    } catch (error) {
        console.log(error.message);
    }
}

// Get Current Net Asset Value :: Start
function getcurrentNav(that) {
    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileMutualFunds = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        FormatNotionalCommon($(thisTileMutualFunds).find('[id^="funds_ContractAmt"]').val(), $(thisTileMutualFunds).find('[id^="funds_ContractAmt"]').attr('id'));
        notional = $(thisTileMutualFunds).find('[id^="funds_ContractAmt"]').val();
        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
        var priceClass = "GlowPrice_Red";
        if (!glowFlag) {
            priceClass = "noGlow";
        }
        flag = false;
        validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
        clearPricerTable(thisTileMutualFunds); //To clear prices after clicking best price || Tina K || 20-Nov-2019
        if ($.trim($(thisTileMutualFunds).find('[id^="MF_FundList"]').val()) == '') {
            ValidateField($(thisTileMutualFunds).find('[id^="MF_FundList"]').attr('id'), "Please Select Valid Fund", thisTileMutualFunds);
            return false
        } else if ($.trim($(thisTileMutualFunds).find('[id^="funds_ContractAmt"]').val()) == '' || parseFloat($(thisTileMutualFunds).find('[id^="funds_ContractAmt"]').val()) == 0) {
            ValidateField($(thisTileMutualFunds).find('[id^="funds_ContractAmt"]').attr('id'), "Please Enter Valid Contract Amount", thisTileMutualFunds);
            return false
        } else if ($(thisTileMutualFunds).find('[id^="FundCode"]')[0].innerHTML == '-') {
            ValidateField($(thisTileMutualFunds).find('[id^="MF_FundList"]').attr('id'), "Please Enter Valid Fund", thisTileMutualFunds);
            return false
        }
        nav = $(thisTileMutualFunds).find('[id^="navDefault"]')[0].value;
        navDefault = $(thisTileMutualFunds).find('[id^="fundsNav"]')[0].textContent;
        if (nav == "") {
            if (navDefault == 0 || navDefault == undefined || navDefault == "FAIL" || navDefault == NaN) {

                $(thisTileMutualFunds).find('[id^="Funds_BankNameRow"]').empty();
                $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').empty();
                $(thisTileMutualFunds).find('[id^="Funds_BankNameRow"]').append("<td>" + "Net Asset Value" + "</td>");
                $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').append("<td class='" + priceClass + "'>" + "-" + "</td>");

            } else {
                $(thisTileMutualFunds).find('[id^="Funds_BankNameRow"]').empty();
                $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').empty();
                $(thisTileMutualFunds).find('[id^="Funds_BankNameRow"]').append("<td>" + "Net Asset Value" + "</td>");
                $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').append("<td class='" + priceClass + "'>" + navDefault + "</td>");
                //Draw graph || ESHITA K || 23-Sep-2019
                y_nav = navDefault;
                x_fund = $(thisTileMutualFunds).find('[id^="FundCode"]')[0].innerHTML
                drawgraphMutualFund($(thisTileMutualFunds).find('[id^="canvas"]').attr('id'));
                // To calculate Units after fetching NaV || Tina K || 6-Dec-2019 
                units = parseInt(notional.replace(/,/g, "")) / parseFloat(navDefault);
                $(thisTileMutualFunds).find('[id^="MF_units"]').html(units.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
                // End
            }

        } else {
            if (nav == 0 || nav == undefined || nav == "FAIL" || nav == NaN) {
                $(thisTileMutualFunds).find('[id^="Funds_BankNameRow"]').empty();
                $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').empty();
                $(thisTileMutualFunds).find('[id^="Funds_BankNameRow"]').append("<td>" + "Net Asset Value" + "</td>");
                $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').append("<td class='" + priceClass + "'>" + "-" + "</td>");
            } else {
                $(thisTileMutualFunds).find('[id^="Funds_BankNameRow"]').empty();
                $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').empty();
                $(thisTileMutualFunds).find('[id^="Funds_BankNameRow"]').append("<td>" + "Net Asset Value" + "</td>");
                $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').append("<td class='" + priceClass + "'>" + nav + "</td>");
                y_nav = nav;
                x_fund = $(thisTileMutualFunds).find('[id^="FundCode"]')[0].innerHTML
                drawgraphMutualFund($(thisTileMutualFunds).find('[id^="canvas"]').attr('id'));
                // To calculate Units after fetching NaV || Tina K || 6-Dec-2019 
                units = parseInt(notional.replace(/,/g, "")) / parseFloat(nav);
                $(thisTileMutualFunds).find('[id^="MF_units"]').html(units.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
                // End
            }


        }
    } catch (error) {
        console.log(error.message);
    } finally {
        $(thisTileMutualFunds).find('[id^="btnSubscribeMF"]').attr("disabled", false);
    }
}
// Get Current Net Asset Value :: End

// Get Application ID To Subscribe :: Start
function getFundApplicationID(that, TileId) {

    try {
        
            TileId = that.id.match(/\d+$/)[0];
            thisTileMutualFunds = document.getElementById("td" + TileId);

            request_getDataFromAPI({ 

                "CurrentTileID": TileId

            }, clientConfigdata.CommonMethods.NodeServer + "getApplicationID").then(data => {

                thisTileMutualFunds = document.getElementById("td" + data.CurrentTileID);
                TileId = data.CurrentTileID;
                $(thisTileMutualFunds).find('[id^="hdnAppID"]').val(data.GetNewApplicationIdResult);
                FundSubscribe(that, data.CurrentTileID);
            }).catch(error => { console.log(error); })


    } catch (error) {
        console.log(error.message());
        $(".lblError").html(error.message());
    } finally {

    }
}
//  Get Application ID To Subscribe :: End

// Subscribe For Fund :: Start
function FundSubscribe(that, TileId) {

    try {
        
        TileId = that.id.match(/\d+$/)[0];
        thisTileMutualFunds = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');

        if ($(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').find("td").html() == "" || $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').find("td").html() == "-" || $(thisTileMutualFunds).find('[id^="FundCode"]')[0].innerHTML == "" || $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').find("td").html() == 0) {
            booktradePopup(that, "booktradeMutualFund" + TileId, "Mutual Funds :: Order Execution Failed!", "DivOverlayMutualFund");
            $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
            return false;
        }

          $(thisTileMutualFunds).find('[id^="loader_Funds"]').show();
          $("body").css("opacity", "0.9");
            request_getDataFromAPI({ 

                    "ApplicationID": $(thisTileMutualFunds).find('[id^="hdnAppID"]').val(),
                    "FundCode": $(thisTileMutualFunds).find('[id^="FundCode"]').html(),
                    "PurchaseAmount": $(thisTileMutualFunds).find('[id^="funds_ContractAmt"]').val().replace(/,/g, ""),
                    "CreditingACCurrencyForDividend": $(thisTileMutualFunds).find('[id^="fundsCurrency"]').html(),
                    "CreditingACCurrencyMaturity": $(thisTileMutualFunds).find('[id^="fundsCurrency"]').html(),
                    "CurrentTileID": TileId


            }, clientConfigdata.CommonMethods.NodeServer + "FundSubscribe").then(data => {

                orderplaced = data.FinIQResponseBody.NoteMasterID
                thisTileMutualFunds = document.getElementById("td" + data.CurrentTileID);
                TileId = data.CurrentTileID;
                console.log(TileId);

                if ($(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').val() == "" && $(thisTileMutualFunds).find('[id^="FundCode"]')[0].innerHTML == "" && $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').val() == 0) {
                    booktradePopup(that, "booktradeMutualFund" + TileId, "Mutual Funds :: Order Execution Failed!", "DivOverlayMutualFund");
                    $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
                    $("body").css("opacity", "0.9");
                } else {
                    if (flag) {
                        booktradePopup(that, "booktradeMutualFund" + TileId, "Mutual Funds :: Order Execution Failed!", "DivOverlayMutualFund");
                        $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
                        $("body").css("opacity", "0.9");
                        flag = false;
                    } else {
                        if (orderplaced == 0) {
                            booktradePopup(that, "booktradeMutualFund" + TileId, "Mutual Funds :: Order Execution Failed!", "DivOverlayMutualFund");
                            $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
                            $("body").css("opacity", "0.9");
                        } else {
                            $(thisTileMutualFunds).find('[id^="hdnBlotterURLMutualFund"]').val(clientConfigdata.CommonMethods.getBlotter);
                            $(thisTileMutualFunds).find('[id^="OrderBlotter"]').css({ display: "inline" });
                            booktradePopup(that, "booktradeMutualFund" + TileId, "Mutual Funds :: Order Placed Successfully with Order ID  " + orderplaced, "DivOverlayMutualFund");
                            nav = ""
                            $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
                            $("body").css("opacity", "0.9");
                        }

                    }
                }

            }).catch(error => { console.log(error.message); })


    } catch (error) {
         console.log(error.message());
        $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
        $("body").css("opacity", "0.9");
        $(".lblError").html(error.message())
    } finally {
       // $(thisTileMutualFunds).find('[id^="btnSubscribeMF"]').attr("disabled", true);
    }
}
// Subscribe For Fund :: End

//To Check whether Factsheet and Annual Report is available or not || Tina K || 25-Nov-2019
function Check_Reports(that) {
    try {
        if (that.classList.contains('inactiveLink')) {
            if (event.target.title == 'Factsheet') {
                ValidateField("hdnctlvalidation", "Fact-Sheet not available for this fund");
            } else if (event.target.title == 'Annual Report') {
                ValidateField("hdnctlvalidation", "Prospectus not available for this fund")
            }
        }
    } catch (error) {
        console.log(error.message);
    }
} //End

//To take correct input in Share Name (onkeydown this function is called) || Tina K || 9-Oct-2019
function Enter_Correct_MutualFund(that) {
    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileMutualFunds = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        var iKeyCode = (event.which) ? event.which : event.keyCode
        if (iKeyCode == 9 || (iKeyCode == 37) || (iKeyCode == 39)) {
            return true;
        } else if (((event.target.selectionStart <= 5) && (iKeyCode == 46 || (iKeyCode >= 65 && iKeyCode <= 90))) || iKeyCode == 8) {
            $(thisTileMutualFunds).find('[id^="FundCode"]').html("-");
            $(thisTileMutualFunds).find('[id^="trailerFees"]').html("-");
            $(thisTileMutualFunds).find('[id^="annualFees"]').html("-");
            $(thisTileMutualFunds).find('[id^="MF_units"]').html("-");
            $(thisTileMutualFunds).find('[id^="fundsFactsheet"]').removeAttr("href");
            $(thisTileMutualFunds).find('[id^="annualReportMF"]').removeAttr("href");
            $(thisTileMutualFunds).find('[id^="fundsFactsheet"]').addClass("inactiveLink");
            $(thisTileMutualFunds).find('[id^="annualReportMF"]').addClass("inactiveLink");
            clearPricerTable(thisTileMutualFunds);
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err.message);
    }
}

// function getFundApplicationIDSync() {
//     try {
//         $.ajax({
//             async: false,
//             crossDomain: true,
//             type: 'POST',
//             url: clientConfigdata.CommonMethods.NodeServer + "getApplicationID", 
//             data: { },
//             contentType: "application/json; charset=utf-8",
//             dataType: "json",
//             success: function(data) {
//                 AppID = data.GetNewApplicationIdResult;

//             },
//             error: function(error) {
//                 return "false";
//             }
//         });
//     } catch (error) {
//         console.log(error.message());
//         $(".lblError").html(error.message())
//     }
// }

// function FundSubscribeSync(that) {
//     try {
//         TileId = that.id.match(/\d+$/)[0];
//         thisTileMutualFunds = document.getElementById("td" + TileId);
//         productName = $($(that).parents(".sorting").find(".productName")).attr('id');

//         //if ($(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').val() == "" || $(thisTileMutualFunds).find('[id^="FundCode"]')[0].innerHTML == "" || $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').val() == 0) {
//         if ($(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').find("td").html() == "" || $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').find("td").html() == "-" || $(thisTileMutualFunds).find('[id^="FundCode"]')[0].innerHTML == "" || $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').find("td").html() == 0) {
//             booktradePopup(that, "booktradeMutualFund" + TileId, "Mutual Funds :: Order Execution Failed!", "DivOverlayMutualFund");
//             $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
//             // $("body").css("opacity", "0.9");
//             return false;
//         }

//         $(thisTileMutualFunds).find('[id^="loader_Funds"]').show();
//         $("body").css("opacity", "0.9");
//         getFundApplicationID(TileId);
//         // setTimeout(function() {
//         $.ajax({
//             async: false,
//             crossDomain: true,
//             type: 'POST',
//             url: clientConfigdata.CommonMethods.NodeServer + "FundSubscribe", 
//             data: JSON.stringify({
//                 "RequestAt": currentFundDateTime,
//                 "ApplicationID": $(thisTileMutualFunds).find('[id^="hdnAppID"]').val(),
//                 "SubmittedDateTime": currentFundDateTime,
//                 "FundCode": $(thisTileMutualFunds).find('[id^="FundCode"]').html(),
//                 "TradeDate": currentFundDate,
//                 "PurchaseAmount": $(thisTileMutualFunds).find('[id^="funds_ContractAmt"]').val().replace(/,/g, ""),
//                 "CreditingACCurrencyForDividend": $(thisTileMutualFunds).find('[id^="fundsCurrency"]').html(),
//                 "CreditingACCurrencyMaturity": $(thisTileMutualFunds).find('[id^="fundsCurrency"]').html(),
//                 "CurrentTileID": TileId
//             }),
//             contentType: "application/json; charset=utf-8",
//             dataType: "json",

//             success: function(data) {

//                 orderplaced = data.FinIQResponseBody.NoteMasterID
//                 thisTileMutualFunds = document.getElementById("td" + data.CurrentTileID);
//                 TileId = data.CurrentTileID;
//                 console.log(TileId);

//                 if ($(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').val() == "" && $(thisTileMutualFunds).find('[id^="FundCode"]')[0].innerHTML == "" && $(thisTileMutualFunds).find('[id^="Funds_PriceRow"]').val() == 0) {
//                     booktradePopup(that, "booktradeMutualFund" + TileId, "Mutual Funds :: Order Execution Failed!", "DivOverlayMutualFund");
//                     $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
//                     $("body").css("opacity", "0.9");
//                 } else {
//                     if (flag) {
//                         booktradePopup(that, "booktradeMutualFund" + TileId, "Mutual Funds :: Order Execution Failed!", "DivOverlayMutualFund");
//                         $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
//                         $("body").css("opacity", "0.9");
//                         flag = false;
//                     } else {
//                         if (orderplaced == 0) {
//                             booktradePopup(that, "booktradeMutualFund" + TileId, "Mutual Funds :: Order Execution Failed!", "DivOverlayMutualFund");
//                             $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
//                             $("body").css("opacity", "0.9");
//                         } else {
//                             $(thisTileMutualFunds).find('[id^="hdnBlotterURLMutualFund"]').val(clientConfigdata.CommonMethods.getBlotter);
//                             $(thisTileMutualFunds).find('[id^="OrderBlotter"]').css({ display: "inline" });
//                             booktradePopup(that, "booktradeMutualFund" + TileId, "Mutual Funds :: Order Placed Successfully with Order ID  " + orderplaced, "DivOverlayMutualFund");
//                             nav = ""
//                             $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
//                             $("body").css("opacity", "0.9");
//                         }

//                     }
//                 }
//             },
//             error: function(error) {
//                 return "false";
//             }
//         });
//         // }, 200);
//     } catch (error) {
//         console.log(error.message());
//         $(thisTileMutualFunds).find('[id^="loader_Funds"]').hide();
//         $("body").css("opacity", "0.9");
//         $(".lblError").html(error.message())
//     } finally {
//         $(thisTileMutualFunds).find('[id^="btnSubscribeMF"]').attr("disabled", true);
//     }
// }





