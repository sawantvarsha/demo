var Insurance_ProductCode = "PRUUNPB";
var ApplicationID = "";
var d = new Date();
var dataFromAjax_xml = "";
var finalArray_Insurance = [];
var idINSURANCE = 9;
$(document).ready(function () {

})

// To load Insurance bond default functions and values
function insuranceOnLoad(currId) {
    try {
        // Added logic for getting current tile : Onkar E.//
        setDeafaultValuesInsurance(currId);
        thisTileInsurance = document.getElementById("td" + currId);
        $(thisTileInsurance).find('[id^="txtCommencementDateIns"]').datepicker({
            dateFormat: "dd-M-yy"
        });
        $(thisTileInsurance).find('[id^="txtCommencementDateIns"]').val(new Date().toShortFormat());
        $(thisTileInsurance).find('[id^="insuranceList"]').autocomplete({
            minLength: 1,
            sortResults: true,
            source: function (request, response) {
                $.ajax({
                    url: clientConfigdata.CommonMethods.NodeServer + "Insurance_getList",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    autoFill: true,
                    type: 'GET',
                    async: false,
                    crossDomain: true,
                    //   timeout:25000,
                    success: function (data) {
                        finalArray_Insurance = [];
                        var index_Insurance = 0;

                        $(data.getProductDetailsResult).each(function (i, n) {

                            if (n.Product_Description.trim().toLowerCase().startsWith(request.term.toLowerCase())) {

                                finalArray_Insurance[index_Insurance] = n;
                                index_Insurance++;

                            }
                        });

                        response(finalArray_Insurance);

                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError);
                    }
                });
            },
            focus: function (event, ui) {

                $(this).parents('.sorting').find('[id^="insuranceList"]').val(ui.item.Product_Description);
                return false;
            },
            select: function (event, ui) {

                $(this).parents('.sorting').find('[id^="insuranceList"]').val(ui.item.Product_Description);

                Insurance_ProductCode = ui.item.Product_Code;

                $(this).parents('.sorting').find('[id^="productCodeInsurance"]').empty().html(Insurance_ProductCode);
                console.log(Insurance_ProductCode);
                validation_clear();

                return false;
            }
        })
            .autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div>" + item.Product_Description + "</div>")
                    .appendTo(ul);
            };


    } catch (error) {
        console.log(error.message);
    }

}
function insuranceData(request, currId) {
    thisTileInsurance = document.getElementById("td" + currId);
    $.ajax({
        url: clientConfigdata.CommonMethods.NodeServer + "Insurance_getList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        autoFill: true,
        type: 'GET',
        async: false,
        crossDomain: true,
        success: function (data) {
            for (i = 0; i < data.getProductDetailsResult.length; i++) {
                if ((data.getProductDetailsResult[i].Product_Description).trim() == (request).trim()) {
                    $(thisTileInsurance).find('[id^="productCodeInsurance"]')[0].textContent = data.getProductDetailsResult[i].Product_Code;
                    break;
                }

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        }
    });
}
// To set default values of parameters
function setDeafaultValuesInsurance(currId) {
    // Added logic for getting current tile : Onkar E.//
    thisTileInsurance = document.getElementById("td" + currId);
    $(thisTileInsurance).find('[id^="insurance_ContractAmt"]').val("1,000,000.00");
    $(thisTileInsurance).find('[id^="insuranceList"]').val("PAYER SECURITY (USD)");
    $(thisTileInsurance).find('[id^="productCodeInsurance"]').html("PRUUNPB");
    $(thisTileInsurance).find('[id^="insurance_AppID"]').val("");
    $(thisTileInsurance).find('[id^="currencyInsurance"]').val("USD");
}

// To get INSA Application Id
function getINSApplicationId() {
    $.ajax({
        type: 'GET',
        url: clientConfigdata.CommonMethods.NodeServer + "Insurance_GetApplnID",
        contentType: "application/json",
        dataType: "json",
        data: "",
        crossDomain: true,
        async: false,
        success: function (data) {

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        }
    });
}
// To add Insurance policy
function Insurace_AddPolicy(that) {
    try {
        // Added logic for getting current tile : Onkar E.//    
        TileId = that.id.match(/\d+$/)[0];
        thisTileInsurance = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
        clearPricerTable(thisTileInsurance); //To clear prices after clicking best price || Tina K || 20-Nov-2019

        //Validation conditions added : Tina Kshirsagar : 6-09-2019
        if ($.trim($(thisTileInsurance).find('[id^="insurance_ContractAmt"]').val()) == '' || parseFloat($(thisTileInsurance).find('[id^="insurance_ContractAmt"]').val()) == 0) {
            ValidateField($(thisTileInsurance).find('[id^="insurance_ContractAmt"]').attr('id'), "Please Enter Valid Contract Amount", thisTileInsurance);
            return false
        }
        else if ($(thisTileInsurance).find('[id^="insuranceList"]').val() == "") {
            ValidateField($(thisTileInsurance).find('[id^="insuranceList"]').attr('id'), "Please select valid product", thisTileInsurance);
            return false
        } else if ($(thisTileInsurance).find('[id^="insurance_AppID"]').val() == "") {
            ValidateField($(thisTileInsurance).find('[id^="insurance_AppID"]').attr('id'), "Please enter valid AppID", thisTileInsurance);
            return false
        } else if ($(thisTileInsurance).find('[id^="productCodeInsurance"]')[0].innerHTML == "-") {
            ValidateField($(thisTileInsurance).find('[id^="insuranceList"]').attr('id'), "Please select valid product", thisTileInsurance);
            return false
        }//Validation END
        //loader_Insurance9
        $(thisTileInsurance).find('[id^="loader_Insurance"]').show();
        var CCY = $(thisTileInsurance).find('[id^="currencyInsurance"]').val();
        var SumAssured = $(thisTileInsurance).find('[id^="insurance_ContractAmt"]').val().replace(/\,/g, "");
        var method = $(thisTileInsurance).find('[id^="PayModeInsurance"]').val();
        var Insurance_ProductCode1 = $(thisTileInsurance).find('[id^="productCodeInsurance"]').html();
        let commeDate = $(thisTileInsurance).find('[id^="txtCommencementDateIns"]').val();
        let policyTerm = $(thisTileInsurance).find('[id^="txtPolicyTermIns"]').val();
        let premPaymentTerm = $(thisTileInsurance).find('[id^="txtPremPaymentTermIns"]').val();
        var xmlStr = "<data>" + $(thisTileInsurance).find('[id^="insurance_AppID"]').val().trim() + "," + Insurance_ProductCode1 + "," + CCY + "," + SumAssured + "," + method + "," + policyTerm + "," + premPaymentTerm + "," + commeDate + "</data>";
        $.ajax({
            type: 'POST',
            url: clientConfigdata.CommonMethods.NodeServer + "Insurance_AddPolicy",
            contentType: "application/xml",
            dataType: "xml",
            data: xmlStr,
            crossDomain: true,
            async: false,
            success: function (data) {
                xmlDoc = data;
                console.log(xmlDoc + " " + xmlDoc.getElementsByTagName("ResponseDescription")[0]);
                var temp = getSyncResponse({ "APPID": $(thisTileInsurance).find('[id^="insurance_AppID"]').val().trim() }, clientConfigdata.CommonMethods.NodeServer + "GetINSDealID");
                $(thisTileInsurance).find('[id^="hdnBlotterURLInsurance"]').val(clientConfigdata.CommonMethods.getBlotter);
                $(thisTileInsurance).find('[id^="OrderBlotter"]').css({ display: "inline" });
                booktradePopup(that, "booktradeInsurance" + TileId, xmlDoc.getElementsByTagName("ResponseDescription")[0].textContent == "SUCCESS" ? "Policy Booked Successfully With Reference ID " + temp.get_INSDealIDResult[0].Note_Master_ID : xmlDoc.getElementsByTagName("ResponseDescription")[0].textContent, "DivOverlayInsurance");

            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
            }
        });
    } catch (error) {
        console.log(error.message);
    } finally {
        $(thisTileInsurance).find('[id^="loader_Insurance"]').hide();

    }
}
//To take correct input in Share Name (onkeydown this function is called) || Tina K || 9-Oct-2019
function Enter_Correct_Name_Insurance(that) {
    try {
        TileId = that.id.match(/\d+$/)[0];
        thisTileInsurance = document.getElementById("td" + TileId);
        productName = $($(that).parents(".sorting").find(".productName")).attr('id');
        var iKeyCode = (event.which) ? event.which : event.keyCode
        if (iKeyCode == 9 || (iKeyCode == 37) || (iKeyCode == 39)) {
            return true;
        } else if (((event.target.selectionStart <= 5) && (iKeyCode == 46 || (iKeyCode >= 65 && iKeyCode <= 90))) || iKeyCode == 8) {
            $(thisTileInsurance).find('[id^="productCodeInsurance"]').html("-");
            clearPricerTable(thisTileInsurance);
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err.message);
    }
}