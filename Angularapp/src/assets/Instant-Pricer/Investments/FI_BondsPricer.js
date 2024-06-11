var Timer = 0;
var intervalID_FI = 0;
var QuoteID;
var clientSideBonds = "Sell";
var arrFIB = [];
var arrFIA = [];
var maxFI;
var BestPrice_Bond = "";
var minFI;
var priceObject;
var FIDate;
var idFIBOND = 4;
var BondsInfoData = {};  //ShaheenL
var rfqResObjNew = {}; //ShaheenL
$(document).ready(function () {});

function getBondInfoDemo(NoteMaster_ID, ISIN, currId) {
  try {
    // Added logic for getting current tile : Onkar E.//
    thisTileFIBond = document.getElementById("td" + currId);

    if (
      $(thisTileFIBond)
        .find('[id^="FIC_BondsList"]')[0]
        .classList[0].indexOf("ValidateFieldCSS") == -1
    ) {
      $(thisTileFIBond)
        .find('[id^="FIC_BondsList"]')
        .removeClass("ValidateFieldCSS");
      document.getElementById("required").style.display = "none";
    }
    var BondInfoObject;
    BondInfoObject = getSyncResponse(
      {
        Note_Master_ID: NoteMaster_ID,
        ISIN: ISIN,
        CurrentTileID: currId,
      },
      clientConfigdata.CommonMethods.NodeServer + "getBondInfo"
    );

    $(thisTileFIBond).find('[id^="hdnBondData"]').val(JSON.stringify(BondInfoObject.BondInfoResponse));
    let bondobj = JSON.parse($(thisTileFIBond).find('[id^="hdnBondData"]').val())


    // BondsInfoData = {};
    // BondsInfoData = BondInfoObject;

    // console.log("BondInfoObject")
    // console.log(BondInfoObject)
    // console.log("BondInfoObject")

    $(thisTileFIBond)
      .find('[id^="GetSettlementDate"]')
      .val(bondobj.SettlementDate);
    $(thisTileFIBond)
      .find('[id^="FIC_BondCCY"]')
      .html(bondobj.Currency);
    FIDate = new Date(bondobj.MaturityDate);
    $(thisTileFIBond)
      .find('[id^="FIC_MaturityDate"]')
      .html(FIDate.toShortFormat());
      $(thisTileFIBond)
      .find('[id^="FIC_ISIN"]')
      .html(bondobj.ISIN);
    $(thisTileFIBond)
      .find('[id^="FIC_Issuer"]')
      .html(bondobj.Issuer);
    $(thisTileFIBond)
      .find('[id^="FIC_YTM"]')
      .html(bondobj.BidYield);

      $(thisTileFIBond).find('[id^="FIC_Coupon"]').val(parseFloat(bondobj.Coupon).toFixed(4))//shaheenL
  } catch (error) {
    console.log(error.message);
  }
}

function getNotemasterID(request, currId) {
  try {
    thisTileFIBond = document.getElementById("td" + currId);
    var currNoteMasterId;
    console.log("getNotemasterID");
    $.ajax({
      url: clientConfigdata.CommonMethods.NodeServer + "getBondsList",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      autoFill: true,
      type: "POST",
      async: false,
      crossDomain: true,
      data: JSON.stringify({
        LoginID:userName,
        EntityCode:EntityID,
        RequestAt: today.toShortFormat(),
        ProductName: request,
      }),
      // timeout:25000,
      success: function (data) {
        currNoteMasterId = data.ListProduct.items[0].Note_Master_id;
        getBondInfoDemo(
          currNoteMasterId,
          data.ListProduct.items[0].ISIN,
          currId
        );
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
      },
    });
  } catch (error) {
    Console.log(error.message);
  }
}

function bondOnLoad(currId) {
  try {
    console.log("bondOnLoad");

    console.log(clientConfigdata.CommonMethods.NodeServer + "getBondsList")
    setDeafaultValuesFIBond(currId);
    thisTileFIBond = document.getElementById("td" + currId);
    $(thisTileFIBond).find('[id^="FIC_Spread"]').val("1.0000");
    // $(thisTileFIBond).find('[id^="FIC_Coupon"]').val(parseFloat(0).toFixed(4)) //RizwanS || 06 Oct 2023  
    $(thisTileFIBond).find('[id^="loader_FIBond"]').hide();
    $(".switch").change(function () {
      if ($(thisTileFIBond).find('[id^="rbRowFIC"]').checked) {
        clientSideBonds = "Sell";
      } else {
        clientSideBonds = "Buy";
      }
    });
    console.log("bondOnLoad1");


    $(thisTileFIBond).find('[id^="FIC_BondsList"]').on("change", function(){

      $(thisTileFIBond).find('[id^="FIC_ClientPrice"]').val("");
      $(thisTileFIBond).find('[id^="FIC_YTM"]').val("");
      $(thisTileFIBond).find('[id^="FIC_AI"]').val("");
      $(thisTileFIBond).find('[id^="FIC_YTC"]').val("");
      $(thisTileFIBond).find('[id^="FIC_SettlAmnt"]').val("");
      $(thisTileFIBond).find('[id^="FIC_YTW"]').val("");

    });


    $(thisTileFIBond).find('[id^="FIC_BondsList"]').on("focusout", function (){


      $(thisTileFIBond).find('[id^="FIC_ClientPrice"]').val("");
      $(thisTileFIBond).find('[id^="FIC_YTM"]').val("");
      $(thisTileFIBond).find('[id^="FIC_AI"]').val("");
      $(thisTileFIBond).find('[id^="FIC_YTC"]').val("");
      $(thisTileFIBond).find('[id^="FIC_SettlAmnt"]').val("");
      $(thisTileFIBond).find('[id^="FIC_YTW"]').val("");
     });


     $(thisTileFIBond).find('[id^="FIC_BondsList"]').on("keydown", function(){

      $(thisTileFIBond).find('[id^="FIC_ClientPrice"]').val("");
      $(thisTileFIBond).find('[id^="FIC_YTM"]').val("");
      $(thisTileFIBond).find('[id^="FIC_AI"]').val("");
      $(thisTileFIBond).find('[id^="FIC_YTC"]').val("");
      $(thisTileFIBond).find('[id^="FIC_SettlAmnt"]').val("");
      $(thisTileFIBond).find('[id^="FIC_YTW"]').val("");
    });

    //RizwanS || 06 Oct 2023 

    $(thisTileFIBond).find('[id^="FIC_buySell"]').on("change",function () {
      try {

        thisTileFIBond = $(this).parents(".sorting")[0];
        validation_clear();
        clearPricerTable(thisTileFIBond);
        $(thisTileFIBond).find('[id^="FIC_ClientPrice"]').val("");
        $(thisTileFIBond).find('[id^="FIC_YTM"]').val("");
        $(thisTileFIBond).find('[id^="FIC_AI"]').val("");
        $(thisTileFIBond).find('[id^="FIC_YTC"]').val("");
        $(thisTileFIBond).find('[id^="FIC_SettlAmnt"]').val("");
        $(thisTileFIBond).find('[id^="FIC_YTW"]').val("");


      } catch (er) {
        console.log(er.message);
      }
     });
 //END

    $(thisTileFIBond)
      .find('[id^="FIC_BondsList"]')
      .autocomplete({
        minLength: 3,
        source: function (request, response) {
          $.ajax({
            url: clientConfigdata.CommonMethods.NodeServer + "getBondsList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            autoFill: true,
            type: "POST",
            async: false,
            crossDomain: true,
            data: JSON.stringify({
              LoginID:userName,
              EntityCode:EntityID,
              RequestAt: today.toShortFormat(),
              ProductName: request.term,
            }),
            success: function (data) {
              response(data.ListProduct.items);
            },
            error: function (xhr, ajaxOptions, thrownError) {
              console.log(thrownError);
            },
          });
        },
        focus: function (event, ui) {
          $(this).parents(".sorting").find('[id^="FIC_BondsList"]').val(ui.item.Product_Name);
          return false;
        },
        select: function (event, ui) {
          $(this).parents(".sorting").find('[id^="FIC_BondsList"]').val(ui.item.Product_Name);
          $(this).parents(".sorting").find('[id^="NoteMaster_ID"]').val(ui.item.Note_Master_id);
          $(this).parents(".sorting").find('[id^="FIC_ISIN"]').html(ui.item.ISIN);
          getBondInfoDemo(
            $(this).parents(".sorting").find('[id^="NoteMaster_ID"]').val(),
            $(this).parents(".sorting").find('[id^="FIC_ISIN"]')[0].innerHTML, currId);
          return false;
        },
      })
      .autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>")
        .append("<div>" + item.Product_Name + "</div>")
        .appendTo(ul);
    };
  } catch (err) {
    console.log(err.message);
  }
}

function setDeafaultValuesFIBond(currId) {
  try {
    console.log("setDeafaultValuesFIBond");
    thisTileFIBond = document.getElementById("td" + currId);
    $(thisTileFIBond).find('[id^="FIC_ContractAmt"]').val("1,000,000.00");
    $(thisTileFIBond).find('[id^="rbRowFIC"]')[0].checked = false;
    $(thisTileFIBond).find('[id^="FIC_BondsList"]').val("");
    $(thisTileFIBond).find('[id^="NoteMaster_ID"]').val("");

    $(thisTileFIBond).find('[id^="FIC_ClientPrice"]').val("");
    $(thisTileFIBond).find('[id^="FIC_YTM"]').val("");
    $(thisTileFIBond).find('[id^="FIC_AI"]').val("");
    $(thisTileFIBond).find('[id^="FIC_YTC"]').val("");
    $(thisTileFIBond).find('[id^="FIC_SettlAmnt"]').val("");
    $(thisTileFIBond).find('[id^="FIC_YTW"]').val("");

    //$(thisTileFIBond).find('[id^="FIC_Spread42"]').val("1");
    var onLoadBond = getSyncResponse(
      {
        LoginID:userName,
        EntityCode:EntityID,
        ProductName: "MUFG",
        RequestAt: today.toShortFormat(),
      },
      clientConfigdata.CommonMethods.NodeServer + "getBondsList"
    );

    $(thisTileFIBond).find('[id^="FIC_BondsList"]').val(onLoadBond.ListProduct.items[0].Product_Name);
    $(thisTileFIBond).find('[id^="NoteMaster_ID"]').val(onLoadBond.ListProduct.items[0].Note_Master_id);
    $(thisTileFIBond).find('[id^="FIC_ISIN"]').html(onLoadBond.ListProduct.items[0].ISIN);

    getBondInfoDemo(
      $(thisTileFIBond).find('[id^="NoteMaster_ID"]').val(),
      $(thisTileFIBond).find('[id^="FIC_ISIN"]')[0].innerHTML,
      currId
    );
    clearPricerTable(thisTileFIBond);
  } catch (err) {
    console.log(err.message);
  }
}

function getBestPriceFIBOND(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileFIBond = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
    clearPricerTable(thisTileFIBond); //To clear prices after clicking best price || Tina K || 20-Nov-2019
    //Validation conditions added : Tina Kshirsagar : 6-09-2019
    if (
      $(thisTileFIBond).find('[id^="FIC_ContractAmt"]').val() == "" ||
      $(thisTileFIBond).find('[id^="FIC_ContractAmt"]').val() == 0
    ) {
      ValidateField(
        $(thisTileFIBond).find('[id^="FIC_ContractAmt"]').attr("id"),
        "Please Enter Valid Contract Amount",
        thisTileFIBond
      );
      return false;
    } else if ($(thisTileFIBond).find('[id^="FIC_BondsList"]').val() == "") {
      ValidateField(
        $(thisTileFIBond).find('[id^="FIC_BondsList"]').attr("id"),
        "Please Select Valid Bond",
        thisTileFIBond
      );
      return false;
    } else if ($(thisTileFIBond).find('[id^="FIC_ISIN"]').text() == "-") {
      ValidateField(
        $(thisTileFIBond).find('[id^="FIC_BondsList"]').attr("id"),
        "Please Select Valid Bond",
        thisTileFIBond
      );
      return false;
    }

    $(thisTileFIBond).find('[id^="loader_FIBond"]').show();
    $("body").css("opacity", "0.9");

    QuoteObjectForFI = {
      ISIN: $(thisTileFIBond).find('[id^="FIC_ISIN"]').text(),
      currency: $(thisTileFIBond).find('[id^="FIC_BondCCY"]').text(),
      custBS:
        $(thisTileFIBond).find('[name^="view"]:checked').val() == "Row"
          ? "Sell"
          : "Buy",
      nominal: $(thisTileFIBond)
        .find('[id^="FIC_ContractAmt"]')
        .val()
        .replace(/\,/g, "")
        .split(".")[0],
    };

    if (QuoteObjectForFI != undefined && QuoteObjectForFI != "") {
      //QuoteID
      var QuoteObj = getSyncResponse(
        QuoteObjectForFI,
        clientConfigdata.CommonMethods.NodeServer + "getBestPriceBonds"
      );
      console.log(TileId, QuoteObj);
      $(thisTileFIBond).find('[id^="hdnQuoteIDFIBond"]').val(QuoteObj);
      $(thisTileFIBond).find('[id^="hdnintervalID"]').val(window.intervalID_FI);
      console.log(thisTileFIBond);
      let bondobj = JSON.parse($(thisTileFIBond).find('[id^="hdnBondData"]').val())
      //getQuoteDetails(thisTileFIBond);
      mapleLoaderStart(thisTileFIBond,'[id^="btnBestPriceFIBond"]', false);
      getBidAskDetails(bondobj, thisTileFIBond); //ShaheenL
      getBondsCcyAccount(thisTileFIBond);
    }
  } catch (err) {
    console.log(err.message);
  }
}
function getBondsCcyAccount(thisTileFIBond) {
  try {
    $.ajax({
      url: clientConfigdata.CommonMethods.NodeServer + "getBondsCcyAccount",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      autoFill: true,
      type: "POST",
      async: false,
      crossDomain: true,
      data: JSON.stringify({
        RequestAt: today.toShortFormat(),
        Currency: $(thisTileFIBond).find('[id^="FIC_BondCCY"]').text(),
      }),
      success: function (data) {
        $(thisTileFIBond)
          .find('[id^="hdnCSSAccDetails"]')
          .val(data.CSSAccResponse.items[0].AccountNo);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
      },
    });
  } catch (error) {
    Console.log(error.message);
  }
}

// Shaheen Start BidAsk
//Commented by RizwanS as this function already exist || RizwanS || 29 Sep 2023
// function numberWithCommas(x) {
//   x = x.toString();
//   var pattern = /(-?\d+)(\d{3})/;
//   while (pattern.test(x))
//       x = x.replace(pattern, "$1,$2");
//   return x;
// }
//END

function getBidAskDetails(BondsInfoData, tile) {
  try {
        var str = "";
        var str2 = "";
        var rfqResObj = {};
        var rfqRespondObj = {};
        var ICE_PriceObj = {};
        var price = "";
        var is_ICE_Pricing_local = "N";
        var ICE_Pricing_local = "";



        console.log(BondsInfoData);

        //var clientSideBonds = $(thisTileFIBond).find('[name^="view"]:checked').val() == "Row"? "Sell": "Buy";

        getRFQDetails(BondsInfoData, tile);











                    //priceObject = await request_getDataFromAPI(iceObj,clientConfigdata.CommonMethods.NodeServer + "getBonds_ICE").then((priceObject) => {






            //  if(rfqRespondObj.result==true){






                  // if(price!="" && price!=0 && price!=NaN && price!=null){
                  //     booktradePopup("","booktradeFIBond42",obj1.BondCalcResponse.ResponseDetails.Description,"DivOverlayFIBond");
                  // }else{
                  //}

                    //booktradePopup("","booktradeFIBond42","RFQ Respond Success!!!","DivOverlayFIBond");


                      // $(thisTileFIBond).find('[id^="FIC_YTM"]').val(parseFloat(obj1.BondCalcResponse.YTM).toFixed(4));
                      // $(thisTileFIBond).find('[id^="FIC_YTC"]').val(parseFloat(obj1.BondCalcResponse.YTC).toFixed(4));
                      // $(thisTileFIBond).find('[id^="FIC_YTW"]').val(parseFloat(obj1.BondCalcResponse.YTConv).toFixed(4));
                      
              // }else{
              //   $(thisTileFIBond).find('[id^="FIC_Spread42"]').val("");
              //   $(thisTileFIBond).find('[id^="FIC_AI4"]').val("");
              //   $(thisTileFIBond).find('[id^="FIC_YTM4"]').val("");
              //   $(thisTileFIBond).find('[id^="FIC_YTC4"]').val("");
              //   $(thisTileFIBond).find('[id^="FIC_YTW4"]').val("");
              //   $(thisTileFIBond).find('[id^="FIC_SettlAmnt4"]').val("");
              //   $(thisTileFIBond).find('[id^="FIC_ClientPrice4"]').val("");
              // }




  } catch (err) {
    console.log(err.message);
  }
}


async function bondPriceChanged(cp,name){


      let bondobj = JSON.parse($(thisTileFIBond).find('[id^="hdnBondData"]').val())

              TileId = cp.id.match(/\d+$/)[0];
              thisTileFIBond = document.getElementById("td" + TileId);
              var calcObj = {};
              var d = new Date();
              var day = (d.getDate()+2);
              var spread = "";
              d.setDate(day);
              var SettlementDate =  (d.toShortFormat());
              if($(thisTileFIBond).find('[id^="FIC_Spread"]').val()==""){
                spread = "1";
              }

              if(name=="cp"){
                 calcObj = {
                  "NoteMasterID":bondobj.NoteMasterID,
                  "Nominal":$(thisTileFIBond).find('[id^="FIC_ContractAmt"]').val().replace(/,/g, ''),
                  "CustomerBS":$(thisTileFIBond).find('[name^="view"]:checked').val() == "Row"? "Sell": "Buy",
                  "OrderType":"Market",
                  "SettlementDate":SettlementDate,
                  "SolveWith":"2",
                  "CalcMode":"1",
                  "Price":cp.value,
                  "ISIN":bondobj.ISIN,
                  "Spread":"",
                  "YTM":"",
                  "RequestAt":today.toShortFormat()
                }
              }else if(name=="YT"){
                calcObj = {
                  "NoteMasterID":bondobj.NoteMasterID,
                  "Nominal":$(thisTileFIBond).find('[id^="FIC_ContractAmt"]').val().replace(/,/g, ''),
                  "CustomerBS":$(thisTileFIBond).find('[name^="view"]:checked').val() == "Row"? "Sell": "Buy",
                  "OrderType":"Market",
                  "SettlementDate":SettlementDate,
                  "SolveWith":"4",
                  "CalcMode":"1",
                  "Price":"",
                  "ISIN":bondobj.ISIN,
                  "Spread":"",
                  "YTM":cp.value,
                  "RequestAt":today.toShortFormat()
                }
              }else if(name=="SP"){
                calcObj = {
                  "NoteMasterID":bondobj.NoteMasterID,
                  "Nominal":$(thisTileFIBond).find('[id^="FIC_ContractAmt"]').val().replace(/,/g, ''),
                  "CustomerBS":clientSideBonds,
                  "OrderType":"Market",
                  "SettlementDate":SettlementDate,
                  "SolveWith":"3",
                  "CalcMode":"1",
                  "Price":"",
                  "ISIN":bondobj.ISIN,
                  "Spread":cp.value,
                  "YTM":"",
                  "RequestAt":today.toShortFormat()
                }
              }

  console.log(calcObj);

  var obj1 = await getBondCalDetails(calcObj,TileId); //RizwanS || Price all for bond not working || 18 Oct 2023
  console.log(obj1);
  if(obj1.BondCalcResponse.ResponseDetails.Remark=="failed" || obj1.BondCalcResponse.ResponseDetails.Remark==null || obj1.BondCalcResponse.ResponseDetails.Remark==undefined){

    // $(thisTileFIBond).find('[id^="Bonds_DivErrorMsg4"]').css().display = 'block';
    // $(thisTileFIBond).find('[id^="Bonds_SpanErrorMsg4"]').val(obj1.BondCalcResponse.ResponseDetails.Description)
    // $(thisTileFIBond).find('[id^="Bonds_SpanErrorMsg4"]').css().color = 'red';

    $(thisTileFIBond).find('[id^="Bonds_DivErrorMsg"]').css("display","block")
    $(thisTileFIBond).find('[id^="Bonds_SpanErrorMsg"]').html(obj1.BondCalcResponse.ResponseDetails.Description)
    $(thisTileFIBond).find('[id^="Bonds_SpanErrorMsg"]').css("color","red");
    //booktradePopup("","booktradeFIBond42",obj1.BondCalcResponse.ResponseDetails.Description,"DivOverlayFIBond");
    console.log("if calculation...")
  }else{
    console.log("else calculation...")
    $(thisTileFIBond).find('[id^="Bonds_DivErrorMsg"]').css("display","none")
    //booktradePopup("","booktradeFIBond42","RFQ Respond Success!!!","DivOverlayFIBond");
    console.log("out calculation...")
    if(obj1!=null || obj1!=undefined){
      console.log("inside calculation...")
      $(thisTileFIBond).find('[id^="FIC_Spread"]').val(obj1.BondCalcResponse.Spread);
      $(thisTileFIBond).find('[id^="FIC_AI"]').val(numberWithCommas(obj1.BondCalcResponse.AccruedInterest));
      // $(thisTileFIBond).find('[id^="FIC_YTM"]').val(obj1.BondCalcResponse.YTM);
      // $(thisTileFIBond).find('[id^="FIC_YTC"]').val(obj1.BondCalcResponse.YTC);
      // $(thisTileFIBond).find('[id^="FIC_YTW"]').val(obj1.BondCalcResponse.YTConv);
      $(thisTileFIBond).find('[id^="FIC_YTM"]').val(obj1.BondCalcResponse.YTM === "NA"  ? "NA" : obj1.BondCalcResponse.YTM === "NC" ? "NC" :   Number(obj1.BondCalcResponse.YTM) === 0 ? "NA" : parseFloat(obj1.BondCalcResponse.YTM).toFixed(4));
      $(thisTileFIBond).find('[id^="FIC_YTC"]').val(obj1.BondCalcResponse.YTC === "NA"  ? "NA" : obj1.BondCalcResponse.YTC === "NC" ? "NC" :   Number(obj1.BondCalcResponse.YTC) === 0 ? "NA" : parseFloat(obj1.BondCalcResponse.YTC).toFixed(4));
      $(thisTileFIBond).find('[id^="FIC_YTW"]').val(obj1.BondCalcResponse.YTConv === "NA"  ? "NA" : obj1.BondCalcResponse.YTConv === "NC" ? "NC" :   Number(obj1.BondCalcResponse.YTConv) === 0 ? "NA" : parseFloat(obj1.BondCalcResponse.YTConv).toFixed(4));

      $(thisTileFIBond).find('[id^="FIC_ContractAmt"]').val(numberWithCommas(obj1.BondCalcResponse.Nominal));
      $(thisTileFIBond).find('[id^="FIC_SettlAmnt"]').val(numberWithCommas(obj1.BondCalcResponse.CustQuantoCost));
      $(thisTileFIBond).find('[id^="FIC_ClientPrice"]').val(obj1.BondCalcResponse.CustPrice);
  }
}

}


function getBondCalDetails(obj,TileId) { //RizwanS || Price all for bond not working || 18 Oct 2023
  try {

    let thisTileFIBond = document.getElementById("td" + TileId); //RizwanS || Price all for bond not working || 18 Oct 2023

    var rfqResObj1 = {};
    var RFQBondsInsert_API = {
      NoteMasterID: obj.NoteMasterID,
      Nominal: obj.Nominal,
      CustomerBS: obj.CustomerBS,
      OrderType: obj.OrderType,
      Spread: obj.Spread,
      SettlementDate: obj.SettlementDate,
      SolveWith: obj.SolveWith,
      YTM: obj.YTM,
      CalcMode: obj.CalcMode,
      RequestAt:obj.RequestAt,
      Price:obj.Price,
      CurrentTileID:TileId, //RizwanS || Price all for bond not working || 18 Oct 2023
    };
       rfqResObj1 = request_getDataFromAPI(RFQBondsInsert_API,clientConfigdata.CommonMethods.NodeServer + "GetBondCalcDetails").then((data) => {
           if (data) {

            $(thisTileFIBond).find('[id^="btnEmailQuoteFIBond"]').attr("disabled", false);
            thisTileFIBond = document.getElementById("td" + data.CurrentTileID); //RizwanS || Price all for bond not working || 18 Oct 2023

          rfqResObj1 = data;
          if(rfqResObj1.BondCalcResponse.ResponseDetails.Remark=="failed"){
              $(thisTileFIBond).find('[id^="Bonds_DivErrorMsg"]').css("display","block")
              $(thisTileFIBond).find('[id^="Bonds_SpanErrorMsg"]').html(rfqResObj1.BondCalcResponse.ResponseDetails.Description.toString().replace("Bond Calculation Request :",""))
              $(thisTileFIBond).find('[id^="Bonds_SpanErrorMsg"]').css("color","red");
          }else{
              $(thisTileFIBond).find('[id^="Bonds_DivErrorMsg"]').css("display","none")
              console.log(rfqResObj1)
              if(rfqResObj1!=null || rfqResObj1!=undefined){
                $(thisTileFIBond).find('[id^="FIC_Spread"]').val(parseFloat(rfqResObj1.BondCalcResponse.Spread).toFixed(4));
                $(thisTileFIBond).find('[id^="FIC_AI"]').val(numberWithCommas(parseFloat(rfqResObj1.BondCalcResponse.AccruedInterest).toFixed(4)));
                $(thisTileFIBond).find('[id^="FIC_YTM"]').val(rfqResObj1.BondCalcResponse.YTM === "NA"  ? "NA" : rfqResObj1.BondCalcResponse.YTM === "NC" ? "NC" :   Number(rfqResObj1.BondCalcResponse.YTM) === 0 ? "NA" : parseFloat(rfqResObj1.BondCalcResponse.YTM).toFixed(4));
                $(thisTileFIBond).find('[id^="FIC_YTC"]').val(rfqResObj1.BondCalcResponse.YTC === "NA"  ? "NA" : rfqResObj1.BondCalcResponse.YTC === "NC" ? "NC" :   Number(rfqResObj1.BondCalcResponse.YTC) === 0 ? "NA" : parseFloat(rfqResObj1.BondCalcResponse.YTC).toFixed(4));
                $(thisTileFIBond).find('[id^="FIC_YTW"]').val(rfqResObj1.BondCalcResponse.YTConv === "NA"  ? "NA" : rfqResObj1.BondCalcResponse.YTConv === "NC" ? "NC" :   Number(rfqResObj1.BondCalcResponse.YTConv) === 0 ? "NA" : parseFloat(rfqResObj1.BondCalcResponse.YTConv).toFixed(4));
                $(thisTileFIBond).find('[id^="FIC_ContractAmt"]').val(numberWithCommas(parseFloat(rfqResObj1.BondCalcResponse.Nominal).toFixed(4)));
                $(thisTileFIBond).find('[id^="FIC_SettlAmnt"]').val(numberWithCommas(parseFloat(rfqResObj1.BondCalcResponse.CustQuantoCost).toFixed(4)));
                $(thisTileFIBond).find('[id^="FIC_ClientPrice"]').val(parseFloat(rfqResObj1.BondCalcResponse.CustPrice).toFixed(4));
            }
          }
          return rfqResObj1;
        }
      }).catch(err => console.log(err));
      return rfqResObj1;
  } catch (err) {
    console.log(err.message);
  }
}
function getRFQDetails(BondsInfoData, tile) {
  try {

    let TileId = tile.id.match(/\d+$/)[0]; //RizwanS || Price all for bond not working || 18 Oct 2023
    var str = "";
    var str2 = "";
    var rfqResObj = {};
    var rfqRespondObj = {};
    var ICE_PriceObj = {};
    var price = "";
    var is_ICE_Pricing_local = "N";
    var ICE_Pricing_local = "";
    var rfqResObj1 = {};
    var RFQBondsInsert_API = {
      "ISIN":BondsInfoData.ISIN,
      "Currency":BondsInfoData.Currency,
      "Buy_Sell":$(tile).find('[name^="view"]:checked').val() == "Row"? "Sell": "Buy",
      "Status":"",
      "OrderQty":$(tile).find('[id^="FIC_ContractAmt"]').val(),
      "Requested_By":sessionStorage.getItem('Username'),
      "Entity_ID":sessionStorage.getItem('EntityID'),
      "Note_master_Id":BondsInfoData.NoteMasterID,
      "Firm_ToTrade_YN":"N",
      "Spread":$(tile).find('[id^="FIC_Spread"]').val(),
      "Remark":"",
      "CurrentTileID":TileId , //RizwanS || Price all for bond not working || 18 Oct 2023
    };
    var priceClass = "GlowPrice_Red";
    if (!glowFlag) {priceClass = "noGlow";}
    console.log(RFQBondsInsert_API)
       rfqResObj1 =  request_getDataFromAPI(RFQBondsInsert_API,clientConfigdata.CommonMethods.NodeServer + "InsertRFQDetails_API").then((data) => {
         if (data) {
        TileId = data.CurrentTileID;
        let tile = document.getElementById("td" + data.CurrentTileID); //RizwanS || Price all for bond not working || 18 Oct 2023
          rfqResObjNew = data;
          console.log(rfqResObj1);
          $(tile).find('[id^="hdnBondRFQNo"]').val(rfqResObjNew.InternalOrderID)
          var iceObj = {
            bs_direction:$(tile).find('[name^="view"]:checked').val() == "Row"? "Sell": "Buy",
            isin:BondsInfoData.ISIN,
            note_master_id:BondsInfoData.NoteMasterID,
            rfq_id:rfqResObjNew.InternalOrderID
          }
          if(BondsInfoData!=null || BondsInfoData != undefined){
            if(($(tile).find('[name^="view"]:checked').val() == "Row"? "Sell": "Buy")=="Buy"){
                if(BondsInfoData.InterbankAskPrice!="" && BondsInfoData.InterbankAskPrice!=0 && BondsInfoData.InterbankAskPrice!=null){
                  mapleLoaderStop(tile,'[id^="btnBestPriceFIBond"]', true);
                    str = str + "<td>" + "" + "</td>";
                    str = str + "<td>" + "" + "</td>";
                    str = str + "<td>" + "Ask Price (%)" + "</td>";
                    str = str + "<td>" + "" + "</td>";
                    str = str + "<td>" + "" + "</td>";
                    $(tile).find('[id^="BestPrice_Bond"]').val(BondsInfoData.InterbankAskPrice);
                    str2 = str2 + "<td>" + "" + "</td>";
                    str2 = str2 + "<td>" + "" + "</td>";
                    str2 = str2 +"<td class='" +priceClass +"'>" +parseFloat(BondsInfoData.InterbankAskPrice).toFixed(4) +"</td>";
                    str2 = str2 + "<td>" + "" + "</td>";
                    str2 = str2 + "<td>" + "" + "</td>";
                    price = "";
                    price = BondsInfoData.InterbankAskPrice;
                    is_ICE_Pricing_local = "N"
                    ICE_Pricing_local = ""
                    mapleLoaderStop(tile,'[id^="btnBestPriceFIBond"]', false);
                }else{
                  mapleLoaderStop(tile,'[id^="btnBestPriceFIBond"]', true);
                  price = getBonds_ICEDetails(iceObj,"Ask")
                }
              }else if(($(tile).find('[name^="view"]:checked').val() == "Row"? "Sell": "Buy")=="Sell"){
              if(BondsInfoData.InterbankBidPrice!="" && BondsInfoData.InterbankBidPrice!=0 && BondsInfoData.InterbankBidPrice!=null){
                mapleLoaderStop(tile,'[id^="btnBestPriceFIBond"]', true);
                str = str + "<td>" + "" + "</td>";
                str = str + "<td>" + "" + "</td>";
                str = str + "<td>" + "Bid Price (%)" + "</td>";
                str = str + "<td>" + "" + "</td>";
                str = str + "<td>" + "" + "</td>";
                $(tile).find('[id^="BestPrice_Bond"]').val(BondsInfoData.InterbankBidPrice);
                  str2 = str2 + "<td>" + "" + "</td>";
                  str2 = str2 + "<td>" + "" + "</td>";
                  str2 = str2 +"<td class='" +priceClass +"'>" +parseFloat(BondsInfoData.InterbankBidPrice).toFixed(4) +"</td>";
                  str2 = str2 + "<td>" + "" + "</td>";
                  str2 = str2 + "<td>" + "" + "</td>";
                  price = "";
                  price = BondsInfoData.InterbankBidPrice;
                  is_ICE_Pricing_local = "N";
                  ICE_Pricing_local = "";
                  mapleLoaderStop(tile,'[id^="btnBestPriceFIBond"]', false);
              }else{
                mapleLoaderStop(tile,'[id^="btnBestPriceFIBond"]', true);
                  price = getBonds_ICEDetails(iceObj,"Bid");
             }
          }
          if(price!="" && price!=0 && price!=NaN && price!=null){
            let obj = {
              Entity_id:sessionStorage.getItem('EntityID'),
              RFQ_ID:rfqResObjNew.InternalOrderID,
              is_ICE_Pricing:is_ICE_Pricing_local,
              ICE_Pricing:ICE_Pricing_local
            }
            rfqRespondObj = getRFQRespondDetails(obj,tile);

            $(tile).find('[id^="Bonds_DivErrorMsg"]').css("display","none")

            var SolveWith =  "0";
            var Price =  "";
            var YTM =  "";
            var d = new Date();
            var day = (d.getDate()+2);
            d.setDate(day);
            var SettlementDate =  (d.toShortFormat());
            var calcObj = {
            "NoteMasterID":BondsInfoData.NoteMasterID,
            "Nominal":$(tile).find('[id^="FIC_ContractAmt"]').val().replace(/,/g, ''),
            "CustomerBS":$(tile).find('[name^="view"]:checked').val() == "Row"? "Sell": "Buy",
            "OrderType":"Market",
            "SettlementDate":SettlementDate,
            "SolveWith":SolveWith,
            "CalcMode":"1",
            "Price":Price,
            "ISIN":BondsInfoData.ISIN,
            "Spread":$(tile).find('[id^="FIC_Spread"]').val(),
            "YTM":YTM,
            "RequestAt":today.toShortFormat()
            }
            console.log("OBJ")
            console.log(calcObj)
              var obj1 = getBondCalDetails(calcObj,TileId); //RizwanS || Price all for bond not working || 18 Oct 2023
              console.log(obj1)
          }
          $(tile).find('[id^="FIC_BanksRow"]')[0].innerHTML="";
          $(tile).find('[id^="FIC_PriceRow"]')[0].innerHTML="";
          $(tile).find('[id^="FIC_PriceRow"]').append(str2);
          $(tile).find('[id^="FIC_BanksRow"]').append(str);
          return price;
        }
        }
      }).catch(err => console.log(err));
      return rfqResObj1;
  } catch (err) {
    console.log(err.message);
  }
}
function getRFQRespondDetails(obj) {
  try {
    console.log(obj);
    var rfqResObj1 = {};
       rfqResObj1 =  request_getDataFromAPI(obj,clientConfigdata.CommonMethods.NodeServer + "Auto_Respond_RFQ_API").then((data) => {
           if (data) {
          rfqResObj1 = data;
          return rfqResObj1;
        }
      }).catch(err => console.log(err));
      return rfqResObj1;
  } catch (err) {
    console.log(err.message);
  }
}









function getBonds_ICEDetails(obj,name) {
  try {

    var rfqResObj1 = {};

    if(Object.keys(rfqResObj1).length==0){
        Timer = Number($(thisTileFIBond).find('[id^="hdnTimer"]').val());
        Timer = Timer + 1;
        $(thisTileFIBond).find('[id^="hdnTimer"]').val(Timer);

        if (Number(Timer) >= 6) {
          clearInterval($(thisTileFIBond).find('[id^="hdnintervalID"]').val());
          QuoteID = "";
          $(thisTileFIBond).find('[id^="loader_FIBond"]').hide();
          $("body").css("opacity", "");
          arrFIA = [];
          arrFIB = [];
          minFI = "";
          maxFI = "";
          $(thisTileFIBond).find('[id^="hdnTimer"]').val(0);
        }
    }
       rfqResObj1 =  request_getDataFromAPI(obj,clientConfigdata.CommonMethods.NodeServer + "getBonds_ICE").then((data) => {
           if (data) {
          rfqResObj1 = data;

          ICE_PriceObj = priceObject;
          str = str + "<td>" + "" + "</td>";
          str = str + "<td>" + "" + "</td>";
          str = str + "<td>" + name+" Price (%)" + "</td>";
          str = str + "<td>" + "" + "</td>";
          str = str + "<td>" + "" + "</td>";
          if(priceObject!=null || priceObject!=undefined){
            if(priceObject.Price!=""){
              $(thisTileFIBond).find('[id^="Bonds_DivErrorMsg"]').css("display","none");
              $(thisTileFIBond).find('[id^="BestPrice_Bond"]').val(priceObject.Price);
              str2 = str2 + "<td>" + "" + "</td>";
              str2 = str2 + "<td>" + "" + "</td>";
              str2 = str2 +"<td class='" +priceClass +"'>" +parseFloat(priceObject.Price).toFixed(4) +"</td>";
              str2 = str2 + "<td>" + "" + "</td>";
              str2 = str2 + "<td>" + "" + "</td>";
              price = "";
              price = priceObject.Price;
              is_ICE_Pricing_local = "Y";
              ICE_Pricing_local = priceObject.Price;
              mapleLoaderStop(thisTileFIBond,'[id^="btnBestPriceFIBond"]', false);
            }else{
              mapleLoaderStop(thisTileFIBond,'[id^="btnBestPriceFIBond"]', true);
              $(thisTileFIBond).find('[id^="Bonds_DivErrorMsg"]').css("display","block")
              $(thisTileFIBond).find('[id^="Bonds_SpanErrorMsg"]').html("Price not available!")
              $(thisTileFIBond).find('[id^="Bonds_SpanErrorMsg"]').css("color","red");
              $(thisTileFIBond).find('[id^="BestPrice_Bond"]').val(priceObject.Price);
              str2 = str2 + "<td>" + "" + "</td>";
              str2 = str2 + "<td>" + "" + "</td>";
              str2 = str2 +"<td class='" +priceClass +"'>" +parseFloat("0").toFixed(4) +"</td>";
              str2 = str2 + "<td>" + "" + "</td>";
              str2 = str2 + "<td>" + "" + "</td>";
              mapleLoaderStop(thisTileFIBond,'[id^="btnBestPriceFIBond"]', false);
            }
          }
        }
        return price;
      }).catch(err => console.log(err));
      return rfqResObj1;
  } catch (err) {
    console.log(err.message);
  }
}

function emailQuoteFIBond(that){

  try{
  let tileId = that.id.match(/\d+$/)[0];
  let tile = document.getElementById("td" + tileId);
  mapleLoaderStart(tile,'[id^="btnEmailQuoteFIBond"]', false);
  var emailRes;
  let reqParam = {
    "AppUserId":sessionStorage.getItem('Username'),
    "AttachmentFullPath":"",
    "BCCEmailByUser":false,
    "BCCEmailID":"",
    "CCEmailByUser":false,
    "CCEmailID":"",
    "ENS_Email_Body":"",
    "ENS_ID":"",
    "ENS_Misc2":"",
    "EmailAlertName":"FI_RFQ_Pricing_Email",
    "EmailBodyByUser":"",
    "EmailSettingName":"EmailSetting",
    "EmailSubject":"",
    "Email_Limit_Counter":"2",
    "Email_Limited_Log":"N",
    "Ens_Misc1":"",
    "Entity_ID":sessionStorage.getItem('EntityID'),
    "RFQID":"",
    "TOEmailByUser":false,
    "TOEmailID":"",
    "UseEmailBodyByDocgen":true,
    "UseEmailQTable":false,
    "UseEmailSubjectByDocgen":true,
    "UseStandardReferanceNo":true,
    "_DataType":"0",
    "_Deal_No":$(tile).find('[id^="hdnBondRFQNo"]')[0].defaultValue,
    "_Dealtype":"4",
    "_ProductType":"0",
    "_dealSubType":"New_RFQ",
    "ens_misc10":"",
    "ens_misc6":"",
    "ens_misc7":"",
    "ens_misc8":"",
    "ens_misc9":"",
    "ens_subject":"",
    "misc4":"",
    "misc5":""
  }
  emailRes =  request_getDataFromAPI(reqParam,clientConfigdata.CommonMethods.NodeServer + "SendEmailUsingEmailSetting").then((data) => {
    if (data) {
   rfqResObj1 = data;
   if(data==true){
    booktradePopup(that,"booktradeFIBond"+tileId,"Mail sent successfully!!!","DivOverlayFIBond");
   }else{
    booktradePopup(that,"booktradeFIBond"+tileId,"Error while sending mail!","DivOverlayFIBond");
   }
   mapleLoaderStop(tile,'[id^="btnEmailQuoteFIBond"]', false);
   return rfqResObj1;
 }
}).catch(err => console.log(err));
return rfqResObj1;
  }catch(err){
    console.log(err.message);
  }
}



// Shaheen End BidAsk

function getQuoteDetails(thisTileFIBond) {
  try {
    var clientSideBonds =
      $(thisTileFIBond).find('[name^="view"]:checked').val() == "Row"
        ? "Sell"
        : "Buy";

    priceObject = request_getDataFromAPI(
      { QuoteID: $(thisTileFIBond).find('[id^="hdnQuoteIDFIBond"]').val() },
      clientConfigdata.CommonMethods.NodeServer + "getQuoteDetailsBonds"
    ).then((priceObject) => {
      var ExQuoteId;
      if (priceObject != "undefined" && priceObject.length > 0) {
        ExQuoteId = priceObject[0].ExternalQuoteID;
        console.log(ExQuoteId.substr(2, 5));
        thisTileFIBond = $(
          'input[id$="hdnQuoteIDFIBond"][value="' +
            ExQuoteId.substr(2, 5) +
            '"]'
        ).parents(".sorting")[0];
        if (clientSideBonds == "Buy") {
          priceObject.sort(function (a, b) {
            if (a.OfferPx === null) {
              return 1;
            } else if (b.OfferPx === null) {
              return -1;
            } else if (a.OfferPx === b.OfferPx) {
              return 0;
            }
            return a.OfferPx < b.OfferPx ? -1 : 1;
          });
        }
        if (clientSideBonds == "Sell") {
          priceObject.sort(function (a, b) {
            if (a.OfferPx === null) {
              return 1;
            } else if (b.OfferPx === null) {
              return -1;
            } else if (a.OfferPx === b.OfferPx) {
              return 0;
            }
            return a.OfferPx < b.OfferPx ? 1 : -1;
          });
        }
        if (priceObject != null || priceObject != undefined) {
          drawgraphBOND(
            $(thisTileFIBond).find('[id^="canvas"]').attr("id"),
            priceObject
          );
        }

        $(thisTileFIBond).find('[id^="FIC_BanksRow"]').empty();
        $(thisTileFIBond).find('[id^="FIC_PriceRow"]').empty();

        var str = "";
        var str2 = "";
        for (var i = 0; i < priceObject.length; i++) {
          arrFIB.push(priceObject[i].BidPx);
          arrFIA.push(priceObject[i].OfferPx);
        }
        if (arrFIA.length > 0) {
          minFI = arrFIA.reduce(function (a, b) {
            return Math.min(a, b);
          });
        } else {
          minFI = "";
        }
        if (arrFIB.length > 0) {
          maxFI = arrFIB.reduce(function (a, b) {
            return Math.max(a, b);
          });
        } else {
          maxFI = "";
        }
        // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
        var priceClass = "GlowPrice_Red";
        if (!glowFlag) {
          priceClass = "noGlow";
        }
        for (var i = 0; i < priceObject.length; i++) {
          if (priceObject[i].PartyID != null) {
            if (priceObject[i].PartyID == "DOR3") {
              str = str + "<td>" + "Citi" + "</td>";
            } else if (priceObject[i].PartyID == "DOR2") {
              str = str + "<td>" + "JPM" + "</td>";
            } else if (priceObject[i].PartyID == "DOR1") {
              str = str + "<td>" + "UBS" + "</td>";
            }
          } else {
            str = str + "<td>--</td>";
          }
          if (clientSideBonds == "Sell") {
            if (priceObject[i].BidPx != null) {
              if (maxFI == priceObject[i].BidPx) {
                $(thisTileFIBond)
                  .find('[id^="BestPrice_Bond"]')
                  .val(priceObject[i].BidPx);
                str2 =
                  str2 +
                  "<td class='" +
                  priceClass +
                  "'>" +
                  parseFloat(priceObject[i].BidPx).toFixed(4) +
                  "</td>";
              } else {
                str2 =
                  str2 +
                  "<td class=''>" +
                  parseFloat(priceObject[i].BidPx).toFixed(4) +
                  "</td>";
              }
            } else {
              str2 = str2 + "<td>-</td>";
            }
          } else {
            if (priceObject[i].OfferPx != null) {
              if (minFI == priceObject[i].OfferPx) {
                $(thisTileFIBond)
                  .find('[id^="BestPrice_Bond"]')
                  .val(priceObject[i].OfferPx);
                str2 =
                  str2 +
                  "<td class='" +
                  priceClass +
                  "'>" +
                  parseFloat(priceObject[i].OfferPx).toFixed(4) +
                  "</td>";
              } else {
                str2 =
                  str2 +
                  "<td class=''>" +
                  parseFloat(priceObject[i].OfferPx).toFixed(4) +
                  "</td>";
              }
            } else {
              str2 = str2 + "<td>-</td>";
            }
          }
        }
        console.log(
          $(thisTileFIBond).find('[id^="hdnQuoteIDFIBond"]').val(),
          priceObject
        );
        $(thisTileFIBond).find('[id^="FIC_BanksRow"]').append(str);
        $(thisTileFIBond).find('[id^="FIC_PriceRow"]').append(str2);

        clearInterval($(thisTileFIBond).find('[id^="hdnintervalID"]').val());
        QuoteID = "";
        $(thisTileFIBond).find('[id^="loader_FIBond"]').hide();
        $("body").css("opacity", "");
        arrFIA = [];
        arrFIB = [];
        minFI = "";
        maxFI = "";
        $(thisTileFIBond).find('[id^="hdnTimer"]').val(0);
      } else {
        Timer = Number($(thisTileFIBond).find('[id^="hdnTimer"]').val());
        Timer = Timer + 1;
        $(thisTileFIBond).find('[id^="hdnTimer"]').val(Timer);

        if (Number(Timer) >= 6) {
          clearInterval($(thisTileFIBond).find('[id^="hdnintervalID"]').val());
          QuoteID = "";
          $(thisTileFIBond).find('[id^="loader_FIBond"]').hide();
          $("body").css("opacity", "");
          arrFIA = [];
          arrFIB = [];
          minFI = "";
          maxFI = "";
          $(thisTileFIBond).find('[id^="hdnTimer"]').val(0);
        }
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}

function BookTradeFIBOND(that) {
  try {

    let bondobj = JSON.parse($(thisTileFIBond).find('[id^="hdnBondData"]').val())
    console.log(bondobj);
    TileId = that.id.match(/\d+$/)[0];
    thisTileFIBond = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );

    if (
      $(thisTileFIBond).find('[id^="NoteMaster_ID"]').val() == "" ||
      $(thisTileFIBond).find('[id^="FIC_PriceRow"]')[0].cells[2].firstChild.data =="-" ||
      $(thisTileFIBond).find('[id^="FIC_PriceRow"]')[0].cells[2].firstChild.data ==""
    ) {
      booktradePopup(
        that,
        "booktradeFIBond" + TileId,
        "Please Best Price Before Book Trade, Order Execution Failed!",
        "DivOverlayFIBond"
      );
      return false;
    }

    if (
      $.trim($(thisTileFIBond).find('[id^="FIC_ContractAmt"]').val()) == "" ||
      parseFloat($(thisTileFIBond).find('[id^="FIC_ContractAmt"]').val()) == 0
    ) {
      ValidateField(
        $(thisTileFIBond).find('[id^="FIC_ContractAmt"]').attr("id"),
        "Please Enter Valid Contract Amount",
        thisTileFIBond
      );
      return false;
    } else if (
      $.trim($(thisTileFIBond).find('[id^="FIC_BondsList"]').val()) == ""
    ) {
      ValidateField(
        $(thisTileFIBond).find('[id^="FIC_BondsList"]').attr("id"),
        "Please Select Valid Bond",
        thisTileFIBond
      );
      return false;
    } //Validation End

    if ($(thisTileFIBond).find('[id^="BestPrice_Bond"]').val() == "") {
      booktradePopup(
        that,
        "booktradeFIBond" + TileId,
        "Please Best Price Before Book Trade, Order Execution Failed!",
        "DivOverlayFIBond"
      );
      return false;
    }
    $(thisTileFIBond).find('[id^="loader_FIBond"]').show();
    $("body").css("opacity", "0.9");
    //Get Todays Date
    var today = new Date();
    $(thisTileFIBond).find('[id^="Expire_Date"]').val(FIDate.toShortFormat());

    var d = new Date();
    var day = (d.getDate()+2);
    d.setDate(day);
    var SettlementDate =  (d.toShortFormat());
    console.log(BondsInfoData);

      let Login_Id = sessionStorage.getItem('FinIQUserID') ? sessionStorage.getItem('FinIQUserID') : 'Ketan_Dealer';
			let userGroup = sessionStorage.getItem('FinIQGroupID') ? sessionStorage.getItem('FinIQGroupID') : 'Dealer';
      console.log(Login_Id)
      console.log(userGroup)
      console.log(sessionStorage.getItem('EntityID'));
      console.log(sessionStorage.getItem('Username'));
      console.log(sessionStorage.getItem('EntityName'));
      // console.log(BondsInfoData.$BondInfoResponse.Primary_Market_YN)
      // console.log(BondsInfoData.$BondInfoResponse.Primary_Market_YN)

    var OrderObjectForFI = {
      RequestAt: today.toShortFormat(),
      CreatedAt: today.toShortFormat(),
      LoginID:Login_Id,
      EntityCode:sessionStorage.getItem('EntityName'),
      NoteMasterID: bondobj.NoteMasterID,
      TradeDate: today.toShortFormat(),
      SettlementDate: SettlementDate,
      CustomerBS:
        $(thisTileFIBond).find('[name^="view"]:checked').val() == "Row"
          ? "Sell"
          : "Buy",
      Nominal: $(thisTileFIBond)
        .find('[id^="FIC_ContractAmt"]')
        .val()
        .replace(/\,/g, "")
        .split(".")[0],
      Currency: $(thisTileFIBond).find('[id^="FIC_BondCCY"]').text(),
      //ExpireDate: $(thisTileFIBond).find('[id^="Expire_Date"]').val(),
      ExpireDate: today.toShortFormat(),
      CashSettlAccNo: $(thisTileFIBond).find('[id^="hdnCSSAccDetails"]').val(),
      CurrentTileID: TileId,
      OrderSpread: $(thisTileFIBond).find('[id^="FIC_Spread"]').val(),
      Primary_Market_YN:bondobj.Primary_Market_YN


    };

    console.log(OrderObjectForFI)
    console.log(clientConfigdata.CommonMethods.NodeServer)
    data = request_getDataFromAPI(
      OrderObjectForFI,
      clientConfigdata.CommonMethods.NodeServer + "bookTradeBonds"
    )
      .then((data) => {
        orderplaced = data.Order_Save_Res_DTO.objResponseDetails.ClOrdID;
        Description =
          data.Order_Save_Res_DTO.objResponseDetails.OrdResponseDetails
            .Description;
        TileId = data.CurrentTileID;
        if (orderplaced != "") {
          $(thisTileFIBond)
            .find('[id^="hdnBlotterURL"]')
            .val(clientConfigdata.CommonMethods.getBlotter);
          $(thisTileFIBond)
            .find('[id^="OrderBlotter"]')
            .css({ display: "inline" });
          booktradePopup(
            that,
            "booktradeFIBond" + TileId,
            "FI Bond : Order Placed Successfully with Order ID " + orderplaced,
            "DivOverlayFIBond"
          );
          $(thisTileFIBond).find('[id^="BestPrice_Bond"]').html("");
          $(thisTileFIBond).find('[id^="loader_FIBond"]').hide();
          $("body").css("opacity", "");
        } else {
          if (
            Description == null ||
            Description == "" ||
            Description == undefined
          ) {
            booktradePopup(
              that,
              "booktradeFIBond" + TileId,
              "FI Bond : Order Execution Failed!",
              "DivOverlayFIBond"
            );
            $(thisTileFIBond).find('[id^="loader_FIBond"]').hide();
          } else {
            booktradePopup(
              that,
              "booktradeFIBond" + TileId,
              "FI Bond : " + Description,
              "DivOverlayFIBond"
            );
            $(thisTileFIBond).find('[id^="BestPrice_Bond"]').html("");
            $(thisTileFIBond).find('[id^="loader_FIBond"]').hide();
            $("body").css("opacity", "");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    $(thisTileFIBond).find('[id^="loader_FIBond"]').hide();
  } finally {
    $(thisTileFIBond).find('[id^="FIC_ISIN"]').val("");
  }
}

//To take correct input in bondlist (onkeydown this function is called) || Tina K || 5-Oct-2019
function Enter_Correct_Bond(that) {
  try {
    console.log(that)

    TileId = that.id.match(/\d+$/)[0];
    thisTileFIBond = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    $(thisTileFIBond).find('[id^="btnEmailQuoteFIBond"]').attr("disabled", true);   //ShaheenL for email
    var iKeyCode = event.which ? event.which : event.keyCode;
    if (iKeyCode == 9 || iKeyCode == 37 || iKeyCode == 39) {
      return true;
    } else if (
      (event.target.selectionStart <= 5 &&
        (iKeyCode == 46 || (iKeyCode >= 65 && iKeyCode <= 90))) ||
      iKeyCode == 8
    ) {
      $(thisTileFIBond).find('[id^="FIC_ISIN"]').html("-");
      $(thisTileFIBond).find('[id^="FIC_Issuer"]').html("-");
      $(thisTileFIBond).find('[id^="FIC_MaturityDate"]').html("-");
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err.message);
  }
}

// Added Async calls // 23 April 2020

// function getBondInfoDemoAync(NoteMaster_ID, ISIN, currId) {
//     try {
//          // Added logic for getting current tile : Onkar E.//
//          thisTileFIBond = document.getElementById("td" + currId);

//          if ($(thisTileFIBond).find('[id^="FIC_BondsList"]')[0].classList[0].indexOf("ValidateFieldCSS") == -1) {
//              $(thisTileFIBond).find('[id^="FIC_BondsList"]').removeClass('ValidateFieldCSS')
//              document.getElementById("required").style.display = "none"
//          }

//         var BondInfoObject = {

//             "Note_Master_ID": NoteMaster_ID,
//             "ISIN": ISIN,
//             "CurrentTileID": currId

//         }
//         data = request_getDataFromAPI(BondInfoObject, clientConfigdata.CommonMethods.NodeServer + "getBondInfo").then(data => {

//             thisTileFIBond = document.getElementById("td" + data.CurrentTileID);
//             TileId = data.CurrentTileID
//             $(thisTileFIBond).find('[id^="GetSettlementDate"]').val(data.BondInfoResponse.SettlementDate);
//             $(thisTileFIBond).find('[id^="FIC_BondCCY"]').html(data.BondInfoResponse.Currency);
//             FIDate = new Date(data.BondInfoResponse.MaturityDate);
//             $(thisTileFIBond).find('[id^="FIC_MaturityDate"]').html(FIDate.toShortFormat());
//             $(thisTileFIBond).find('[id^="FIC_Issuer"]').html(data.BondInfoResponse.Issuer);
//             $(thisTileFIBond).find('[id^="FIC_YTM"]').html(data.BondInfoResponse.BidYield);
//             $(thisTileFIBond).find('[id^="FIC_Coupon"]').val(data.BondInfoResponse.Coupon);

//         }).catch(error => { console.log(error); })

//     } catch (err) {
//         console.log(err.message);
//     } finally {

//     }
// }

// function getNotemasterIDAync(request, currId) {
//     try {
//         //thisTileFIBond = document.getElementById("td" + currId);
//         //var currNoteMasterId;

//         var bondListObject = {

//             "RequestAt": today.toShortFormat(),
//             "ProductName": request,
//             "CurrentTileID": currId

//         }
//         data = request_getDataFromAPI(bondListObject, clientConfigdata.CommonMethods.NodeServer + "getBondsList").then(data => {

//             thisTileFIBond = document.getElementById("td" + data.CurrentTileID);
//             TileId = data.CurrentTileID
//             $(thisTileFIBond).find('[id^="hdnNoteMaterID"]').val(data.ListProduct.items[0].Note_Master_id);
//             $(thisTileFIBond).find('[id^="hdnISIN"]').val(data.ListProduct.items[0].ISIN,);
//             getBondInfoDemo($(thisTileFIBond).find('[id^="hdnNoteMaterID"]').val(), $(thisTileFIBond).find('[id^="hdnISIN"]').val(), TileId);

//         }).catch(error => { console.log(error); })

//     } catch (err) {
//       console.log(err.message);
//     } finally {

//     }
// }
