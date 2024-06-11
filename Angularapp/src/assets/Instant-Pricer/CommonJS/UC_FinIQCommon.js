today = new Date();

var dictFXD = {}; //LGTGTWINT-1934 FXD | Dynamic pricing on Instant pricer || RizwanS || 20 May 2023

//LGTGTWINT-1567 || RizwanS || 20 Apr 2023
var _sessiontoken; // LGTGTWINT-2146 || RizwanS || 22 Jun 2023

var ELNShareData;
var FCNShareData;
var BENShareData;
var DRAShareData;
var EQOShareData;
var ACCShareData;
var DACShareData;
var PHXShareData;
var DCNShareData;
var TwinWinShareData;
var BoosterShareData;
var SharkfinShareData;

//LGTGTWINT-1567 || RizwanS || 20 Apr 2023, LGTGTWINT-2146 || RizwanS || 22 Jun 2023
if(_sessiontoken !== sessionStorage.getItem('SessionToken')){

  var ELNShareData =[];
  var FCNShareData =[];
  var BENShareData =[];
  var DRAShareData =[];
  var EQOShareData =[];
  var ACCShareData =[];
  var DACShareData =[];
  var PHXShareData = [];
  var DCNShareData = [];
  var TwinWinShareData = [];
  var BoosterShareData = [];
  var SharkfinShareData = [];
  
}
//END

var requestID=""

var solveforStrategies = [];  //LGTGTWINT-1880  || RijwanS || 20 Jun 2023

sessionStorage.setItem("pageurl_", window.location.href); // INT1FIN47-768 Gateway Markets Instant Pricing issue

isFXDDealer = true;
isEQCDealer =  false;
isRM =  false;
isIA =  false;

Date.prototype.toShortFormat = function () {
  try {
    var month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",];
    var day = this.getDate();
    var month_index = this.getMonth();
    var year = this.getFullYear();

    if (day.toString().length > 1) { } else {
      day = "0" + day;
    }

    return "" + day + "-" + month_names[month_index] + "-" + year;
  } catch (error) {
    console.log(error.message);
    //  $(".lblError").html(error());
  }
};

var GLOBAL_TRADE_DATE = today.toShortFormat();

var dataArray;
var LPList_FXD;
var dataFromAjax;
var EQCUserToken = "";
var dataType_ = "";
var idd, productName;

var sharesnames = [];
var sharesnameMF = [];
var EQCShareNameObj = [];
var ccy_exchangeccy = [];
var setBusinessDate;
var custName;
var custID;
// var globalDefaultSharesArray = ["AAPL.OQ", "GOOG.OQ", "FB.OQ", "MSFT.OQ"]; // Commenetd by Rizwan S || 14 Mar 2023

// Added by Atharva - Timers - START
var myInterval = {};
var myCounter = {};
var banksIndex = {};
var clearPricesInterrupt = {};

// eqc global variables
var mapIndexToBank = {};
// 2D Array
var isTimerStarted = {};
// 1D Array
var hasUserClickedEQC = {};
// 1D Array

// END

var getEQCAuthtoken = "";

//FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
var _signalRMsgRecvFXAQ ; 
var _signalRMsgRecvFXTRF;  
var _signalRMsgRecvFXPivot;
var _signalRMsgRecvFXStrategies; 
var _signalRMsgRecvFXO; 
var _SIgnalRCAll; 
//End

var isRFS = false; //LGTGTWINT-1934 FXD | Dynamic pricing on Instant pricer || RizwanS || 20 May 2023

//LGTGTWINT-2110 | Chaitanya M | 13 June 2023
var showtimerYNFXPivot = "N";
var showtimerYNFXAQ = "N";
var showtimerYNFXTRF = "N";
var showtimerYNFXStrategies = "N";
var showtimerYNFXO = "N";
//End

// Added by AniruddhaJ for EQProducts Order Confim Details pop up Start
//left side is pop up id and right one is UI id

var EQC_OrderConfirm = {
  ELN: {
    INPUTSET: {
      txtIssuerELN: "",
      txtUnderlyingELN: "ELNSharesDemo",
      txtOrderNotionalELN: "ContractAmtELN",
      txtStrikeELN: "strikeipboxELN",
      txtTenorlELN: "tenor_ELN",
      txtKOLevelELN: "koinputboxELN",
      txtUpfrontELN: "upfrontELN",
      txtClientYieldELN: "",
      txtLimitLevelELN: "",
      txtCommentELN: "",
      txtNONBESTELN: "",
      txtSettlWeeksELN: "SettlWeeks",
      EQCOrderPopUPCCYELN: "NoteCCY_ELN", //LGTGTWINT-1480 | Chaitanya M | 22 Feb 2023
      txtEQCREFELN:"hdnRefnumber" //LGTGTWINT-1589 REF number

    },
  },
  FCN: {
    INPUTSET: {
      txtIssuerFCN: "",
      txtUnderlyingFCN: "shareDivFCN",
      txtOrderNotionalFCN: "ContractAmt",
      txtStrikeFCN: "strikeipbox",
      txtTenorlFCN: "tenor_FCN",
      txtKOLevelFCN: "koinputbox",
      txtKILevelFCN: "kiinputbox",
      txtUpfrontFCN: "upfront",
      txtCouponFCN: "couponipbox",
      txtNonCallPeriodFCN: "noncallinputbox",
      txtSettlWeeksFCN: "SettlWeeks",
      EQCOrderPopUPCCYFCN: "ddlFCNCcy",
      txtIBPriceFCN: "IBPriceipbox",
      txtnonCallPeriodFCN:"noncallinputbox",
      txtupfrontValFCN:"txtupfront",
      txtEQCREFFCN:"hdnRefnumber" //LGTGTWINT-1589 REF number
    },
  },
  AQDQ: {
    INPUTSET: {
      txtIssuerAQDQ: "",
      txtUnderlyingAQDQ: "AQDQSharesDemo",
      ddlBookingBranchAQDQ: "",
      txtOrderNotionalAQDQ: "NoOfShareipboxAQDQ",
      txtStrikeAQDQ: "strikeipboxAQDQ",
      txtTenorlAQDQ: "tenor_AQDQ",
      txtLeverageAQDQ: "LeverageipboxAQDQ",
      txtUpfrontACCDAC: "txtUpfrontAQDQ",
      txtKOLevelAQDQ: "KoGauranteeipBoxAQDQ",
      txtSettlWeeksAQDQ: "",
      txtKILevelAQDQ: "kiinputbox",
      txtCouponAQDQ: "couponipbox",
      txtNonCallPeriodAQDQ: "",
      txtAccuDayAQDQ: "",
      txtGauranteeAQDQ: "ddlGauranteeAQDQ",
      txtAccDaysAQDQ:"hdnAccuralDaysAQDQ",
      txtFrequencyAQDQ:"ddlAQDQOptions"
    },
  },
  DRA: {
    INPUTSET: {
      txtIssuerDRA: "",
      txtOrderNotionalDRA: "ContractAmt",
      txtStrikeDRA: "strikeipbox",
      txtTenorlDRA: "tenor_DRA",
      txtKOLevelDRA: "koinputbox",
      txtIBPriceDRA: "IBPriceipbox",
      txtKILevelDRA: "kiinputbox",
      txtCouponDRA: "couponipbox",
      txtGauranteeDRA: "Guaranteeipbox",
      txtSettlWeeksDRA: "SettlWeeks",
      EQCOrderPopUPCCYDRA: "ddlDRACcy",
      txtnonCallPeriodDRA:"noncallinputbox",
      txtupfrontValDRA:"txtupfrontDRA",
      txtEQCREFDRA:"hdnRefnumber" //LGTGTWINT-1589 REF number

    },
  },
  BEN: {
    INPUTSET: {
      txtIssuerBEN: "",
      txtUnderlyingBEN: "shareDivBEN",
      ddlBookingBranchBEN: "",
      txtOrderNotionalBEN: "ContractAmt",
      txtStrikeBEN: "strikeipbox",
      txtTenorlBEN: "tenor_BEN",
      txtKILevelBEN: "kiinputbox",
      //  txtUpfrontBEN: "upfrontELN",
      txtIBPriceBEN: "IBPriceinputbox",
      txtCouponBEN: "couponipbox",
      txtNonCallPeriodBEN: "",
      EQCOrderPopUPCCYBEN: "CCY_BEN_ddl",
      txtSettlWeeksBEN: "SettlWeeks",
      txtupfrontValBEN:"txtupfront",
      txtEQCREFBEN:"hdnRefnumber" //LGTGTWINT-1589 REF number
    },
  },
  OPTIONS: {
    INPUTSET: {
      txtIssuerOPTIONS: "",
      txtUnderlyingOPTIONS: "OptionsSharesDemo",
      ddlBookingBranchOPTIONS: "",
      txtOrderNoOfSharesOPTIONS: "NoOfShareipboxOptions",
      txtOrderNotionalOPTIONS: "NoOfShareipboxOptions",
      txtStrikeOPTIONS: "strikeipboxOptions",
      txtTenorlOPTIONS: "tenor_Options",
      txtKOLevelOPTIONS: "koinputbox",
      txtUpfrontOPTIONS: "upfrontOptions",
      txtClientYieldOPTIONS: "",
      txtIBPriceOPTIONS: "IBPriceipbox",
      txtKILevelOPTIONS: "kiinputbox",
      txtCouponOPTIONS: "couponipbox",
      txtNonCallPeriodOPTIONS: "",
      txtOrderNoOfSharesOPTIONS: "NoOfShareipboxOptions",
      txtPremiumOPTIONS: "txtPremiumOptions",
      txtSettlementOPTIONS: "ddlSettlement",
      txtOptionTypeOPTIONS: "ddlOptions",
    },
  },
  PHOENIX: {
    INPUTSET: {
      txtIssuerPhoenix: "",
      txtUnderlyingPhoenix: "shareDivPhoenix",
      txtOrderNotionalPhoenix: "ContractAmt",
      txtStrikePhoenix: "strikeipbox",
      txtTenorlPhoenix: "tenor_Phoenix",
      txtKOLevelPhoenix: "koinputbox",
      txtKILevelPhoenix: "kiinputbox",
      txtUpfrontPhoenix: "upfront",
      txtCouponPhoenix: "couponipbox",
      txtNonCallPeriodPhoenix: "noncallinputbox",
      txtSettlWeeksPhoenix: "SettlWeeks",
      EQCOrderPopUPCCYPhoenix: "ddlPhoenixCcy",
      txtIBPricePhoenix: "IBPriceipbox",
      txtnonCallPeriodPhoenix:"noncallinputbox",
      txtupfrontValPhoenix:"txtupfront",
      txtEQCREFPhoenix:"hdnRefnumber" //LGTGTWINT-1589 REF number
    }
  },
  TWINWIN:{
    INPUTSET: {
      txtIssuerTwinWin: "",
      txtUnderlyingTwinWin: "shareDivTwinWin",
      txtOrderNotionalTwinWin: "ContractAmt",
      txtStrikeTwinWin: "strikeipbox",
      txtTenorlTwinWin: "tenor_TwinWin",
      txtKOLevelTwinWin: "koinputbox",
      txtKILevelTwinWin: "kiinputbox",
      txtUpfrontTwinWin: "upfront",
      txtCouponTwinWin: "couponipbox",
      txtNonCallPeriodTwinWin: "noncallinputbox",
      txtSettlWeeksTwinWin: "SettlWeeks",
      EQCOrderPopUPCCYTwinWin: "ddlTwinWinCcy",
      txtIBPriceTwinWin: "IBPriceipbox",
      txtnonCallPeriodTwinWin:"noncallinputbox",
      txtupfrontValTwinWin:"txtupfront",
      txtEQCREFTwinWin:"hdnRefnumber" //LGTGTWINT-1589 REF number
    }
  },
  DCN: {
    INPUTSET: {
      txtIssuerDCN: "",
      txtUnderlyingDCN: "shareDivDCN",
      ddlBookingBranchDCN: "",
      txtOrderNotionalDCN: "ContractAmt",
      txtStrikeDCN: "strikeipbox",
      txtTenorlDCN: "tenor_DCN",
      txtKILevelDCN: "kiinputbox",
      //  txtUpfrontDCN: "upfrontELN",
      txtIBPriceDCN: "IBPriceinputbox",
      txtCouponDCN: "couponipbox",
      txtNonCallPeriodDCN: "",
      EQCOrderPopUPCCYDCN: "CCY_DCN_ddl",
      txtSettlWeeksDCN: "SettlWeeks",
      txtupfrontValDCN:"txtupfront",
      txtEQCREFDCN:"hdnRefnumber" //LGTGTWINT-1589 REF number
    }
  } , 
  Booster: {
    INPUTSET: {
      txtIssuerBooster: "",
      txtOrderNotionalBooster: "ContractAmt",
      txtStrikeBooster: "strikeipbox",
      txtTenorlBooster: "tenor_Booster",
      txtKOLevelBooster: "koinputbox",
      txtIBPriceBooster: "IBPriceipbox",
      txtKILevelBooster: "kiinputbox",
      txtCouponBooster: "couponipbox",
      txtGauranteeBooster: "Guaranteeipbox",
      txtSettlWeeksBooster: "SettlWeeks",
      EQCOrderPopUPCCYBooster: "ddlBoosterCcy",
      txtnonCallPeriodBooster:"noncallinputbox",
      txtupfrontValBooster:"txtupfrontBooster",
      txtEQCREFBooster:"hdnRefnumber" //LGTGTWINT-1589 REF number

    },
  },
  Sharkfin: {
    INPUTSET: {
      txtIssuerSharkfin: "",
      txtUnderlyingSharkfin: "shareDivSharkfin",
      txtOrderNotionalSharkfin: "ContractAmt",
      txtStrikeSharkfin: "strikeipbox",
      txtTenorlSharkfin: "tenor_FCN",
      txtKOLevelSharkfin: "koinputbox",
      txtKILevelSharkfin: "kiinputbox",
      txtUpfrontSharkfin: "upfront",
      txtCouponSharkfin: "couponipbox",
      txtNonCallPeriodSharkfin: "noncallinputbox",
      txtSettlWeeksSharkfin: "SettlWeeks",
      EQCOrderPopUPCCYSharkfin: "ddlFCNCcy",
      txtIBPriceSharkfin: "IBPriceipbox",
      txtnonCallPeriodSharkfin:"noncallinputbox",
      txtupfrontValSharkfin:"txtupfront",
      txtEQCREFSharkfin:"hdnRefnumber" 
    },
  },
};

//End


function BookingBranchChanged(ddlObject) {
  try {
    console.log("BookingBranchChanged ", ddlObject.value);
    let currentTile = $(ddlObject).parents("td.sorting")[0];

    $(currentTile).find('[id^="errorMsgPanel"]').html("");

    $(currentTile).find("select.ChildrenddlBookingCenter").each(function (i, HTMLField) {
      $(HTMLField).val(ddlObject.options[ddlObject.selectedIndex].value);
    });

    if (ddlObject.options[ddlObject.selectedIndex].text.trim().toUpperCase() === "MULTIPLE") {
      $(currentTile).find('[id^="btn_AddAllocation"]').show();
      $(currentTile).find(".ChildrenddlBookingCenter").each(function (i, HTMLField) {
        $(HTMLField).prop("disabled", false);
      });

      $(currentTile).find("select.ChildrenddlBookingCenter option:contains('Multiple')")[0].remove();
      $(currentTile).find("select.ChildrenddlBookingCenter")[0].selectedIndex = -1;


    } else {
      $(currentTile).find('[id^="btn_AddAllocation"]').hide();
     
      $(currentTile).find('div.orderConfirmPopUpEQC table.tblRMDetails .clonedDynamicRow').each(function (i, HTMLField) { // Added for LGTGTWINT-1625 | Instant Pricing: Limit allocation row count to 10 on order popup | 06 March 2023
        $(HTMLField).remove();
  
      })
    }
  } catch (error) {
    console.log(error.message);
  }
}
function clearPricerTable(that) {
  try {
    
    $($(that).find(".pricerTable").find("tr")[0]).empty().append("<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>");
    $($(that).find(".pricerTable").find("tr")[1]).empty().append("<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>");
    // Added by Atharva - Timers - START
    clearPricesInterrupt[that.id] = true;
    $($(that).find(".pricerTable").find("tr")[2]).empty().append("<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>");
    $(that).find(".pricesRow td").removeClass();
    $(that).find(".banksNameRow td").removeClass();
    // END
    $(that).find(".pricerTable").find("td").removeClass("GlowPrice_Red");
   //$(".orderConfirmPopUpEQC").hide(); // Commented for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 

  } catch (error) {
    console.log(error.message);
  } finally {
    $(that).find('[id^="loader"]').hide();
  }
}

function clearPrices(proudctObject) {
  try {
    if (proudctObject != undefined) {
      // Added by Atharva - START - Timers
      clearPricesInterrupt[proudctObject.id] = true;
      // END
      if ($(proudctObject).find(".hiddenProductName").html() == "CASHFX") {
        if ($(event.target).hasClass("spreadField")) { } else {
          localStorage.setItem("isDataClear_" + idCASHFX, "true");

          $(proudctObject).find("[id^='FXCASH_CustAmt']").val("");
          $(proudctObject).find(".banksNameRow td").empty().html("-");
          $(proudctObject).find(".pricesRow td").empty().removeClass("GlowPrice_Red").html("-");
          // Added by Atharva - Timers - START
          $(proudctObject).find(".pricesRow td").removeClass();
          $(proudctObject).find(".banksNameRow td").removeClass();
          // $(proudctObject).find(".pricesRow td").removeClass("priceBackground");
          // $(proudctObject).find(".banksNameRow td").removeClass("priceBackground");
          $(proudctObject).find(".timersRow td").empty().html("-");
          // $(proudctObject).find(".pricesRow td").css({'border': '0px solid gold'});
          // $(proudctObject).find(".banksNameRow td").css({'border': '0px solid gold'});
          // END
        }
      } else {
        $(proudctObject).find(".banksNameRow td").empty().html("-");
        $(proudctObject).find(".pricesRow td").empty().removeClass("GlowPrice_Red").html("-");
        // Added by Atharva - Timers - START
        $(proudctObject).find(".pricesRow td").removeClass();
        $(proudctObject).find(".banksNameRow td").removeClass();
        // $(proudctObject).find(".pricesRow td").removeClass("priceBackground");
        // $(proudctObject).find(".banksNameRow td").removeClass("priceBackground");
        $(proudctObject).find(".timersRow td").empty().html("-");
        // $(proudctObject).find(".pricesRow td").css({'border': '0px solid gold'});
        // $(proudctObject).find(".banksNameRow td").css({'border': '0px solid gold'});
        // END

        switch ($(proudctObject).find(".hiddenProductName").html()) {
          case "ELN":
            if (window.intervalID_ELN) {
              clearInterval(window.intervalID_ELN);
            }
            $(proudctObject).find('[id^="loader_ELN"]').hide();
            $(proudctObject).find('[id^="BookTradeELN"]').attr("disabled", false);
            return false;
            break;
          case "FCN":
            if (window.intervalID_FCN) {
              clearInterval(window.intervalID_FCN);
            }
            $(proudctObject).find('[id^="loader_FCN"]').hide();
            $(proudctObject).find('[id^="BookTradeFCN"]').attr("disabled", false);
            return false;
            break;
          case "AQDQ":
            if (window.intervalID_AQDQ) {
              clearInterval(window.intervalID_AQDQ);
            }
            $(proudctObject).find('[id^="loaderAQDQ"]').hide();
            $(proudctObject).find('[id^="btnBookTradeAQDQ"]').attr("disabled", false);
            return false;
            break;
          case "BEN":
            if (window.intervalID_BEN) {
              clearInterval(window.intervalID_BEN);
            }
            $(proudctObject).find('[id^="loader_BEN"]').hide();
            $(proudctObject).find('[id^="BookTradeBEN"]').attr("disabled", false);
            return false;
            break;
          case "DRA":
            if (window.intervalID_DRA) {
              clearInterval(window.intervalID_DRA);
            }
            $(proudctObject).find('[id^="loader_DRA"]').hide();
            $(proudctObject).find('[id^="BookTradeDRA"]').attr("disabled", false);
            return false;
            break;
          case "Phoenix":
            if (window.intervalID_Phoenix) {
              clearInterval(window.intervalID_Phoenix);
            }
            $(proudctObject).find('[id^="loader_Phoenix"]').hide();
            $(proudctObject).find('[id^="BookTradePhoenix"]').attr("disabled", false);
            return false;
            break;
          case "TwinWin":
            if (window.intervalID_Phoenix) {
              clearInterval(window.intervalID_TwinWin);
            }
            $(proudctObject).find('[id^="loader_TwinWin"]').hide();
            $(proudctObject).find('[id^="BookTradeTwinWin"]').attr("disabled", false);
            return false;
            break;
          case "DCN":
            if (window.intervalID_DCN) {
              clearInterval(window.intervalID_DCN);
            }
            $(proudctObject).find('[id^="loader_DCN"]').hide();
            $(proudctObject).find('[id^="BookTradeDCN"]').attr("disabled", false);
            return false;
            break;

        }
      }
    } else {
      // Added by Atharva - START - Timers
      clearPricesInterrupt[this.id] = true;
      // END
      $(".removable>td").each(function () {
        if ($(this).find(".hiddenProductName").html() == "CASHFX") {
          localStorage.setItem("isDataClear_" + idCASHFX, true);

          $(this).find(".pricesRow td").empty().removeClass("GlowPrice_Red").html("-");
        } else {
          $(this).find(".banksNameRow td").empty().html("-");
          $(this).find(".pricesRow td").empty().removeClass("GlowPrice_Red").html("-");
          // Added by Atharva - Timers - START
          $(this).find(".pricesRow td").removeClass();
          $(this).find(".banksNameRow td").removeClass();
          // $(this).find(".pricesRow td").removeClass("priceBackground");
          // $(this).find(".banksNameRow td").removeClass("priceBackground");
          $(this).find(".timersRow td").empty().html("-");
          // $(this).find(".timerRow td").css({'border': '0px solid gold'});
          // $(this).find(".banksNameRow td").css({'border': '0px solid gold'});
          // END
        }
      });
    }
    return true;
  } catch (er) { } finally {
    $(proudctObject).find('[id^="loader"]').hide();
  }
}

function getdataMF() {
  try {
    $.ajax({
      url: clientConfigdata.CommonMethods.NodeServer + "getFundList",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      autoFill: true,
      type: "GET",
      async: true,
      crossDomain: true,
      data: {},
      // timeout:25000,
      success: function (data) {
        data.GetMutualFundsDetailsResult.forEach(function myFunction(item, index) {
          sharesnameMF.push(data.GetMutualFundsDetailsResult[index]);
        });
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}

function EQCGetSharesData() {
  try {
    $.ajax({
      url: clientConfigdata.CommonMethods.NodeServer + "ShareListEQC",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      autoFill: true,
      type: "POST",
      async: false,
      crossDomain: true,
      data: JSON.stringify({
        UserName: sessionStorage.getItem("EQC_UserName").toString(),
        "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString()
      }),
      success: function (data) {

        responseData = (data.responseData);
        EQCShareNameObj = responseData;

        responseData.forEach(function myFunction(item, index) {
          for (j = 0; j < responseData[index].Code.length; j++) {
            sharesnames[j] = responseData[index].Code;
          }

          for (i = 0; i < (responseData[index].Ccy + "|" + responseData[index].ExchangeCode).length; i++) {
            ccy_exchangeccy[i] = responseData[index].Ccy + "|" + responseData[index].ExchangeCode;
          }
        });
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);

      },
    });
  } catch (error) {
    console.log(error.message);
  }
}

clientConfigdata = {
  
  EQCCommonMethods: {
    MaxSharesInBaskets: 4,
    MinSharesInBaskets: 3,
    DEFAULT_SHARE_CODE1: "BAC.N",
    DEFAULT_SHARE_CODE2: "MSFT.OQ",
    DEFAULT_SHARE_CODE3: "GOOG.OQ", //LGTGTWINT-1723 Instant Pricer : Remove FB.OQ ticker from default notes payoff's.
    DEFAULT_SHARE_CODE4: "",
    DEFAULT_SHARE_CCY: "USD",
    EQC_BOOK_TRADE_RESPONSE_DETAILS: "Success"
  },
  CommonMethods: {
    NodeServer:sessionStorage.getItem("ServicePath_"), //LGTGTWINT-1966 || Added to bind local app-server enpoint as per defined in environment component || RizwanS || 08 May 2023
    
    //RizwanS || Added for Instant Pricer API calls || 06 Sep 2023
    InstantPricerFXCommon : sessionStorage.getItem("1_"), 
    InstantPricerCommon : sessionStorage.getItem("2_"), 
    InstantPricergetstaticData : sessionStorage.getItem("3_"), 
    InstantPricerDateCalculationApi : sessionStorage.getItem("4_"), 
    FXOBestprice : sessionStorage.getItem("5_"),
    Prortfolio: sessionStorage.getItem("6_"),
    //END
    
    priceAllRequestDelay: 0,
    priceAllRequestDelayFXD: 0,
    SHOW_HISTORY_CHARTS: false,
    MapleOverlay: true,
    TRADEALL: "Y",
    BOOKALL: "N",
    UNPINALL: "Y",
    FLIP: "N",
    BLINK: "Y",
    DELETE: "Y",
    CREATELAYOUT: "Y",
    CLEARGRAPH: "N",
    REF: "Y", //LGTGTWINT-1472 ChaitanyaM 05 May 2023  || LGTGTWINT-1472 Chaitanya M 02 March 2023
    IMPORTEXPORT: "N",
    CLOSEALL: "Y",
    NonBestPrice: "Y",
    BOOKORDERYN: "NO",
    NonbestpriceYN:"N",
    MAILALL:'Y', //Added for LGTGTWINT-1462 'Mail All' functionality | Chaitanya M | 23 Feb 2023
    CLEARPRICE:'Y', //  LGTGTWINT-1912 | Chaitanya M | 28 April 2023,
    MARKETDATAYN:"N", // HSBCFXEINT-22 || RizwanS || 07 Dec 2023
    HEDGEPANELYN: "N"  // HSBCFXEINT-22 || RizwanS || 07 Dec 2023
  },
  Template: {},
  FXDCommonMethods: {
    CustID: "1",
    Customer_Name: "Customer_CH", //LGTGTWINT-688
    OptionCut: "TOK",
    CAI_ID: "7400",
    Hedging_Type: "Dynamic",
    UserID: "Dealer1",
    DisplayViewSchedule:"N" // Config Added for the display of view schedule button | Chaitanya | 12-Jan-2023
  },
  FXO: {
    TypeVanilla: "FXOPTION",
    TypeBarrier: "FXBARRIER",
    // LGTGTWINT-1880 | Chaitanya M | 16-June-2023
    barrierType_KI_Call: "DAI",
    barrierType_KI_Put: "UAI",
    barrierType_RKI_Call: "UAI",  
    barrierType_RKI_Put: "DAI",
    barrierType_KO_Call: "DAO",
    barrierType_KO_Put: "UAO",
    barrierType_RKO_Call: "UAO",  
    barrierType_RKO_Put: "DAO",
    barrierType_EKI_Call: "DAI",  
    barrierType_EKI_Put: "UAI",
    barrierType_ERKI_Call: "UAI",  
    barrierType_ERKI_Put: "DAI",
    barrierType_ERKIKO_Call: "RKIKO",  
    barrierType_ERKIKO_Put: "RKIKO",
    barrierType_RKOKO_Call: "RKOKO",  
    barrierType_RKOKO_Put: "RKOKO",
    barrierType_RKIKO_Call: "RKIKO",  
    barrierType_RKIKO_Put: "RKIKO",
    barrierType_RKOKI_Call: "KIKO",  
    barrierType_RKOKI_Put: "KIKO",
    barrierType_RKIKI_Call: "RKIKI",  
    barrierType_RKIKI_Put: "RKIKI",  
    //End 
    knockInstyle_KI: "AMERICAN",
    knockInstyle_RKI: "AMERICAN",
    knockInstyle_ERKI: "European",
    knockOutstyle_KO: "AMERICAN",
    knockOutstyle_RKO: "AMERICAN",
    Maxtilecount: 300,
  },
  FXAQ: {
    ProductType: "FXAQ",
    Maxtilecount: 300,
  },
  FXDQ: {
    ProductType: "FXDQ",
    Maxtilecount: 300,
  },
  FXTRF: {
    typeTRFBuy: "TEKO",
    typeTRFSell: "TARFSELL",
    Maxtilecount: 300,
  },
  FXPivot: {
    ProductType: "PivotTarn",
    TypeFXPivot: "Pivot",
    ProductCode: "PIVOT",
    Maxtilecount: 300,
  },
  FXDCI: {
    typeFXDCI: "DCD",
  },
  FXStrategies: {
    typeStraddle: "Straddle",
    typeStrangle: "Strangle",
    typeRiskR: "RSKREV",
    typeButterFly: "Butterfly",
    typeOPSPRD: "OPSPRD",
    Maxtilecount: 300,
  },
  FXDigital: {
    typeFXDigital: "Digital",
  },
  EQCELN: {
    // PoolTimer: 60, //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
    PollInterval: 5000,
    MinSharesInBaskets:1 //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
  },
  EQCFCN: {
    // PoolTimer: 60, //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
    PollInterval: 5000,
    MinSharesInBaskets:3 //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
  },
  EQCAQDQ: {
    // PoolTimer: 10, //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
    PollInterval: 5000,
    UpfrontAQYN: false, // Config Added For Solve for Upfront and response received should be in % - Chaitanya M| Ref: LGTGTWINT-580 | 09-Jan-2023
    MinSharesInBaskets:1 //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
  },
  EQCBEN: {
    // PoolTimer: 10, //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
    PollInterval: 5000,
    MinSharesInBaskets:2 //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
  },
  EQO: {
    // PoolTimer: 10, //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
    PollInterval: 5000,
    MinSharesInBaskets:1 //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
  },
  EQCDRA: {
    // PoolTimer: 60,//LGTGTWINT-2154 || RizwanS || 27 Jun 2023
    PollInterval: 5000,
    MinSharesInBaskets:1 //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023 || // LGTGTWINT-1808 | Instant Pricing | Share suggestion dropdown missing for single underlying products || 31 Mar 2023
  },
  EQCPHX: {
    // PoolTimer: 10,//LGTGTWINT-2154 || RizwanS || 27 Jun 2023
    PollInterval: 5000,
    MinSharesInBaskets:3 //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
  },
  EQCSnowball: {
    PoolTimer: 24,
    PollInterval: 5000,
  },
  EQCWoBAutocall: {
    PoolTimer: 24,
    PollInterval: 5000,
  },
  EQCAVGAUTOCALL: {
    PoolTimer: 24,
    PollInterval: 5000,
  },
  EQCRA: {
    PoolTimer: 24,
    PollInterval: 5000,
  },
  EQCELCI: {
    PoolTimer: 3,
    PollInterval: 5000,
  },
  EQCRELCI: {
    PoolTimer: 3,
    PollInterval: 5000,
  },
  EQCSPS: {
    PoolTimer: 3,
    PollInterval: 5000,
  },

  EQCTwinWin: {
    PollInterval: 5000,
    MinSharesInBaskets:3
  },
  EQCBEI: {
    PoolTimer: 3,
    PollInterval: 5000,
  },
  EQCFCI: {
    PoolTimer: 3,
    PollInterval: 5000,
  },
  PAYOFFCOUNT: {
    TILECOUNTER: 33, // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
    MAILALLCOUNTER: 32, // LGTGTWINT-1880 || Chaitanya M | 22 Jun 2023
  },
  EQCDCN: { // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
    PollInterval: 5000,
    MinSharesInBaskets:2 
  },
  EQCBooster: {
    // PoolTimer: 60,//LGTGTWINT-2154 || RizwanS || 27 Jun 2023
    PollInterval: 5000,
    MinSharesInBaskets:1 //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023 || // LGTGTWINT-1808 | Instant Pricing | Share suggestion dropdown missing for single underlying products || 31 Mar 2023
  },
  EQCSharkfin: {
    // PoolTimer: 60,//LGTGTWINT-2154 || RizwanS || 27 Jun 2023
    PollInterval: 5000,
    MinSharesInBaskets:1 //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023 || // LGTGTWINT-1808 | Instant Pricing | Share suggestion dropdown missing for single underlying products || 31 Mar 2023
  },
};

// var shareTags = getDataFromAPI(clientConfigdata.CommonMethods.NodeServer + "getShares", "Share");
// sharesnames = sharesnames.concat(shareTags);  // Commented by RizwanS after hide fav. share poupup || 24 Feb 2023

function request_getDataFromAPI(requestObject, urlAPI, fxdTimeout, requestType,RequestID) { // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
  try {

    if(sessionStorage.getItem("pageurl_") != window.location.href ){

      return false;

    }
    
    requestType = requestType != undefined ? requestType : "POST";

    if (urlAPI.split("/")[urlAPI.split("/").length - 1] == "getPPDetailsELI") {
      dataType_ = "text";
    } else if (urlAPI.split("/")[urlAPI.split("/").length - 1] == "GetShareRate") {
      dataType_ = "xml";
    } else {
      dataType_ = "json";
    }

    hash =  gethash(requestObject,urlAPI,requestType);

    // Adding Ovelay on bestprice - Chaitanya
    return new Promise((resolve, reject) => {
      $.ajax({
        type: requestType,
        url: urlAPI,
        contentType: "application/json",
        headers:{
          'Authorization':"Bearer " + sessionStorage.getItem("nested_"),
          'hash': hash,
          "requestID":RequestID // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
        },
        dataType: dataType_,
        data: JSON.stringify(requestObject),
        crossDomain: true,
        async: true,
        success: function (data, status, xhr) { // RizwanS || HSBCFXEINT-6 || 07 Nov 2023 || Access the response headers
          
          if(sessionStorage.getItem("pageurl_") != window.location.href ){

            return false;
      
          }
          
          // let requestID = xhr.getResponseHeader('requestID');
          let CurrentTileID = requestObject.CurrentTileID;
          dataFromAjax = data;
          resolve({ result: "Success", dataFromAjax, CurrentTileID });
          //END
        },
        error: function (xhr, ajaxOptions, thrownError, status) {
          console.log("Error while calling API => ", this.url, " error objects => ", xhr, ajaxOptions, thrownError, status);

          if (thrownError === "timeout") {
            console.log("request timeout while calling API => ", this.url, " error objects => ", xhr, ajaxOptions, thrownError, status);
          }
        },
      });
      return dataFromAjax;
    }
    );
  } catch (error) {
    console.log(error.message);
  }
}

function getSyncResponse(requestObject, urlAPI, requestType,RequestID) { // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
  try {
    if (urlAPI.split("/")[urlAPI.split("/").length - 1] == "getPPDetailsELI") {
      dataType_ = "text";
    } else {
      dataType_ = "json";
    }

    if (requestType === undefined)
      requestType = "POST";
    else
      requestType = "GET";

    hash =  gethash(requestObject,urlAPI,requestType);
    
    $.ajax({
      type: requestType,
      url: urlAPI,
      contentType: "application/json",
      headers:{
        'Authorization':"Bearer " + sessionStorage.getItem("nested_"),
        'hash': hash,
        "RequestID":RequestID // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      },
      dataType: dataType_,
      data: JSON.stringify(requestObject),
      crossDomain: true,
      async: false,
      //  timeout:8000,
      success: function (data) {
        dataFromAjax = data;
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log("Error while calling API => ", this.url, " error objects => ", xhr, ajaxOptions, thrownError, status);

        if (thrownError === "timeout") {
          console.log("request timeout while calling API => ", this.url, " error objects => ", xhr, ajaxOptions, thrownError, status);
        }
      },
    });
    return dataFromAjax;
  } catch (error) { }
}

//LGTGTWINT-1252 Instant pricer Not Responding message
 function getAsyncResponseFXD(requestObject, urlAPI, requestType) {
  try {

    if(sessionStorage.getItem("pageurl_") != window.location.href ){

      return false;

    } //// INT1FIN47-768 Gateway Markets Instant Pricing issue

    if (urlAPI.split("/")[urlAPI.split("/").length - 1] == "getPPDetailsELI") {
      dataType_ = "text";
    } else {
      dataType_ = "json";
    }

    if (requestType === undefined)
      requestType = "POST";
    else
      requestType = "GET";

   return $.ajax({
      type: requestType,
      url: urlAPI,
      contentType: "application/json; charset=utf-8",
      dataType: dataType_,
      data: JSON.stringify(requestObject),
      crossDomain: true,
      async: true,
      //  timeout:8000,
      success: function (data) {

        if(sessionStorage.getItem("pageurl_") != window.location.href ){

          return false;
    
        } // INT1FIN47-768 Gateway Markets Instant Pricing issue

        dataFromAjax = data;
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log("Error while calling API => ", this.url, " error objects => ", xhr, ajaxOptions, thrownError, status);

        if (thrownError === "timeout") {
          console.log("request timeout while calling API => ", this.url, " error objects => ", xhr, ajaxOptions, thrownError, status);
        }
      },
    });
    // return dataFromAjax;
  } catch (error) { }
}

function getDataFromAPI(para, key) {
  try {
    var temp = [];
    localStorage.setItem("CurrentKey", key);
    $.ajax({
      async: false,
      crossDomain: true,
      type: "POST",
      url: para,
      data: "",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        $(data).each(function (i, ele) {
          var a = localStorage.getItem("CurrentKey").toString();
          temp.push(ele[a]);
          localStorage.setItem("CCY_" + ele[a], ele["Ccy"]);
        });
      },
      error: function (error) { },
    });
    return temp;
  } catch (err) {
    console.log(err.message);
  }
}


// START - Commenting Below code / function as it is used  fro EQC products || Chaitanya M || 07 Sep 2023

// var EQCurrencyList = [];
// request_getDataFromAPI({
//   CurrentTileID: "",
// }, clientConfigdata.CommonMethods.NodeServer + "getcurrencylist", "", "GET").then((data) => {
//   if (JSON.parse(data.responseData) != null && JSON.parse(data.responseData) != "") {
//     EQCurrencyList = JSON.parse(data.responseData);
//   }
// }
// ).catch((error) => {
//   console.log(`error at ${error}`);
// }
// );

// END - Commenting Below code / function as it is used  fro EQC products || Chaitanya M || 07 Sep 2023 

function parentCheckboxChange(__this) {
  try {
    let currentTile = $(__this).parents(".sorting")[0];
    let RMDetailsTable = $(__this).parents("table.tblRMDetails")[0];
    if (__this.checked) {
      $(currentTile).find(".childrenCheckBoxBooking").each(function () {
        $(this).prop("checked", true);

      });
      $(RMDetailsTable).find('input[type="text"], select ').each(function (i, controlsInRow) {

        if ($(controlsInRow).hasClass('parentCheckBoxBooking'))
          ""
        else {
          $(controlsInRow).prop('disabled', false);
        }
      })

    } else {
      $(currentTile).find(".childrenCheckBoxBooking").each(function () {
        $(this).prop("checked", false);


      });
      $(RMDetailsTable).find('input[type="text"], select ').each(function (i, controlsInRow) {

        if ($(controlsInRow).hasClass('parentCheckBoxBooking'))
          ""
        else {
          $(controlsInRow).prop('disabled', true);
          if ($(controlsInRow).prop('tagName').toUpperCase() == "SELECT") {
            controlsInRow.selectedIndex = -1;

          } else {
            controlsInRow.value = '';

          }
        }
      })

    }
  } catch (error) {
    console.log(error.message);
  }
}

function childrenCheckboxChange(__this) {
  try {
    let currentTile = $(__this).parents(".sorting")[0];
    var globalcheckedCheckBox = 0;
    if (__this.checked) {
      $(currentTile).find(".childrenCheckBoxBooking").each(function (index, element) {
        if (element.checked) {
          globalcheckedCheckBox = globalcheckedCheckBox + 1;
        }
        if (Number($(currentTile).find(".childrenCheckBoxBooking").length) == globalcheckedCheckBox) {
          $(currentTile).find(".parentCheckBoxBooking").each(function () {
            $(this).prop("checked", true);
          });
        }
      });
      let selectedRow = $(__this).parents("tr")[0];
      $(selectedRow).find('input[type="text"], select ').each(function (i, controlsInRow) {
        $(controlsInRow).prop('disabled', false);

      })

    } else {
      $(currentTile).find(".parentCheckBoxBooking").prop("checked", false);

      let selectedRow = $(__this).parents("tr")[0];
      $(selectedRow).find('input[type="text"], select ').each(function (i, controlsInRow) {
        $(controlsInRow).prop('disabled', true);

        if ($(controlsInRow).prop('tagName').toUpperCase() == "SELECT") {
          controlsInRow.selectedIndex = -1;
        } else {
          controlsInRow.value = '';
        }

      });     
      // Added for LGTGTWINT-1198 : Calculated notional and Total No. of shares should be displayed on order popup on checkbox change. | Chaitanya M | 3 March 2023
        let notionalamt = $(currentTile).find('[id^="txtHeaderNotional"]').val().replace(/\,/g, "").split('.')[0]
        let tileid = currentTile.id.match(/\d+$/)[0]
        if($(currentTile).find(".productName").attr("id") == "Options"){    

          fillValuesToOtherNotional(notionalamt, tileid,true);

        }else{

          fillValuesToOtherNotional(notionalamt, tileid);

        }
      // end     

    }
  } catch (error) {
    console.log(error.message);
  }
}

var globalEQCConf;

bindFeatures();

$(document).ready(function () {
  
  try {

    //Added by AniruddhaJ for Maple image background 09-Dec-2021 Start

    // getEQCTimerConfig(); // Commneted by RizwanS as it is not used  || 24 Feb 2023

    if (clientConfigdata.CommonMethods.MapleOverlay) {
      $("#overlayer").removeClass("DefaultOverLayer").addClass("MapleOverLayer");

      $("#mapleUserScreen").removeClass("DefaultcenterOverLay").addClass("MaplecenterOverLay");
    }
    //End

    $("#btnUpload").on("click", function () {
      $("#myFile").trigger("click");
    });

    $("#btnExportToExcel").on("click", function () {
      test();
    });

    $("#btnRemoveFile").on("click", function () {
      $("#myFile").val("");
      $("#lblinfo_upload").html("");
    });

    $("#myFile").on("input", function () {
      try {
        var fileUpload = document.getElementById("myFile");

        //Validate whether File is valid Excel file.
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
        if (!regex.test(fileUpload.value.toLowerCase())) {
          if (typeof FileReader != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
              reader.onload = function (e) {
                ProcessExcel(e.target.result);
              }
                ;
              reader.readAsBinaryString(fileUpload.files[0]);
            } else {
              //For IE Browser.
              reader.onload = function (e) {
                var data = "";
                var bytes = new Uint8Array(e.target.result);
                for (var i = 0; i < bytes.byteLength; i++) {
                  data += String.fromCharCode(bytes[i]);
                }
                ProcessExcel(data);
              }
                ;
              reader.readAsArrayBuffer(fileUpload.files[0]);
            }
          } else {
            openValidationpopup('',"This browser does not support HTML5.");
          }
        } else {///  alert("Please upload a valid Excel file.");
        }
      } catch (err) {
        console.log(err.message);
      }
    });

    // getDataFromAPI(clientConfigdata.CommonMethods.NodeServer + "getShares", "Share"); // Commented by RizwanS after hide fav. share poupup || 24 Feb 2023

    $(".btn-default").each(function () {
      try {
        $(this).click(function () {
          if ($(this).html().trim().toUpperCase() == "BEST PRICE" || $(this).html().trim().toUpperCase() == "BEST STRIKE" || $(this).html().trim().toUpperCase() == "BEST YIELD") {
            $(this).parent().next().find("button").prop("disabled", false);
          }
        });
      } catch (err) {
        console.log(err.message);
      }
    });

    $("input[type='text']").each(function () {
      try {
        $(this).attr("autoComplete", "off");
      } catch (err) {
        console.log(err.message);
      }
    });

    //To disable right click on page || Tina K || 23-Oct-2019
    window.oncontextmenu = function () {
      return false;
    }
      ;

    //To access popUp using keyboard || Tina K || 23-Oct-2019
    $(document).keydown(function (event) {
      try {
        if ($("#bodyDiv")[0].style.display == "block") {
          popupAccess();
        }

        //To toggle buy/sell using keyboard || Tina K || 5-Nov-2019
        if (event.target.className.includes("switch")) {
          console.log("found button");
          if (event.keyCode == 37) {
            $("#" + event.target.id).find('[id^="rbRow"]')[0].checked = false;
            $("#" + event.target.id).find('[id^="rbCol"]')[0].checked = true;
            $("#" + event.target.id).change();
          } else if (event.keyCode == 39) {
            $("#" + event.target.id).find('[id^="rbRow"]')[0].checked = true;
            $("#" + event.target.id).find('[id^="rbCol"]')[0].checked = false;
            $("#" + event.target.id).change();
          }
        }

        //To disable keyboard keys which opens console log || Tina K || 23-Oct-2019
        event = event || window.event;
        // if (event.keyCode == 123) {
        //     return false;
        // } else

        if ((event.ctrlKey && event.shiftKey && event.keyCode == 73) || (event.ctrlKey && event.shiftKey && event.keyCode == 74) || (event.ctrlKey && event.keyCode == 85)) {
          return false;
        }
      } catch (err) {
        // console.log(err.message);
      }
    });

    // To fetch customer deatils|| 18-May-2021

    $("#autocompletecust").autocomplete({
      minLength: 1,
      source: function (request, response) {
        $.ajax({
          url: clientConfigdata.CommonMethods.NodeServer + "GetCustDeatils",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          autoFill: true,
          type: "POST",
          async: false,
          crossDomain: true,
          data: JSON.stringify({
            EntityCode: getEnitityCode,
            Customer_name: request.term,
          }),
          success: function (data) {
            custName = "";
            custID = "";

            custResponse = [];
            var indexCust = 0;

            $(data.CustSearchResponse.items).each(function (i, n) {
              if (n.CustomerName.trim().toLowerCase().startsWith(request.term.toLowerCase()) || n.CustomerID.trim().toLowerCase().includes(request.term.toLowerCase())) {
                custResponse[indexCust] = n;
                indexCust++;
              }
            });

            response(custResponse);
          },
          error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
          },
        });
      },
      focus: function (event, ui) {
        $("#autocompletecust").val(ui.item.CustomerName);
        return false;
      },
      select: function (event, ui) {
        $("#autocompletecust").val(ui.item.CustomerName);

        custName = ui.item.CustomerName;
        custID = ui.item.CustomerID;

        return false;
      },
    }).autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>").append("<div>" + item.CustomerName + "</div>").appendTo(ul);
    }
      ;

    //END
  } catch (err) {
    console.log(err.message);
  }
});

function getEQCTimerConfig() {

  try{

    request_getDataFromAPI({
      "userName": sessionStorage.setItem("FinIQUserID").toString()
    }, clientConfigdata.CommonMethods.NodeServer + "EQCConfigurations").then((confData) => {
      globalEQCConf = JSON.parse(confData.body.responseData)[0];
  
      console.log("EQC configs values ", confData);
    }
    ).catch((err) => {
      console.log(err);
    }
    );

  }catch(er){

    console.log(er.message);

  }
 
}

function FillUpTenorsPanel(obj, fillUpParameter, bindingID) {
  try {
    p = $("#" + $(obj).attr("id")).offset();
    left1 = parseFloat(p.left) - 104 + "px";
    top1 = parseFloat(p.top) + 26 + "px";
    $("#TenorDiv").css("left", left1);
    $("#TenorDiv").css("top", top1);
    $("#TenorDiv").show();
    $("#TenorCommon").change(function () {
      $("#" + bindingID).val($("option:selected", this).text());
      $("#TenorDiv").hide();
    });
  } catch (err) {
    console.log(err.message);
  }
}

function fillccy(obj, bindingID) {
  try {
    $("#" + bindingID).val($(obj).text());
    if ($("#" + bindingID)[0].classList[0].indexOf("ValidateFieldCSS") == -1) {
      $("#" + bindingID).removeClass("ValidateFieldCSS");
      document.getElementById("required").style.display = "none";
    }
    $("#moreChoicespopup").hide();
    $("#bodyDiv").hide();
    if (!zoomFlag) {
      $("#DivOverlay").hide();
    }
    $("#" + bindingID).focus().select();

    $(".popup").each(function () {
      this.style.display = "none";
    });

    // $("body")[0].style.overflow = "scroll"; //LGTGTWINT - 687

    let tile = $("#" + bindingID).parents(".sorting")[0];
    let $span = $(tile).find("span.sharesListName").eq(0);
    if ($span.length == 0) {
      if ($("#" + bindingID).prop("tagName") !== "DIV") {
        //it is share control
        // for fav share note ccy selection start

        if ($(tile).find("select.ddlEQNoteCcy") != undefined) {
          data = EQCShareNameObj.filter(function (item) {
            return (item["Code"] == $("#" + bindingID).val().trim());
          });

          $(tile).find("select.ddlEQNoteCcy").val(data[0]["Ccy"]);
          //$(tile).find("select.ddlEQNoteCcy")[0].selectedValue = data[0]["Ccy"];
        }
        //end
      }
    }
    fillBasket(obj, bindingID);
  } catch (error) {
    console.log(error.message);
  }

  //popup
}

function fillBasket(obj, bindingID) {
  try {
    let tile = $("#" + bindingID).parents(".sorting")[0];
    $($(tile).find("[id^=" + bindingID + "]").find("span")).each(function (s, span) {
      $(span).remove();
    });
    if (typeof obj === "object") {
      $(obj).text().split(",").forEach((element) => {
        createElementInBasket(tile, bindingID, element.trim(), true);
      }
      );
    } else {
      obj.split(",").forEach((element) => {
        createElementInBasket(tile, bindingID, element.trim(), true);
      }
      );
    }
  } catch (error) {
    console.log(error.message);
    // $("#lblinfo_upload").html('File Upload Failed..!');
  }

  //popup
}

function callPopUpFunction(callerID, bindingID, fillUpParameter, idForProduct, codeForProduct) {
  try {
    p = $("#" + $(callerID).attr("id")).offset();
    left1 = parseFloat(p.left) - 200 + "px";
    top1 = parseFloat(p.top) - 20 + "px";
    $("#bodyDiv").css("left", left1);
    $("#bodyDiv").css("top", top1);

  //  FillPopupDiv(fillUpParameter, callerID, bindingID, idForProduct, codeForProduct);
  } catch (err) {
    console.log(error.message);
  }
}

sessionStorage.setItem("sharesGlobalData", "");
sessionStorage.setItem("tenorsGlobalData", "");
sessionStorage.setItem("AmountsGlobalData", "");
sessionStorage.setItem("pairGlobalData", "");
sessionStorage.setItem("BasketsGlobalData", "");

function FillPopupDiv(fillUpParameter, callerID, bindingID, idForProduct, codeForProduct) {
  try {
    idForProduct == undefined ? "" : (idForProduct = idForProduct);
    codeForProduct == undefined ? "" : (codeForProduct = codeForProduct);

    var className = "";
    var IsBasketControl = false;
    if (fillUpParameter == "BASKETS") {
      className = "baskets";
    } else {
      className = "pairs";
    }
    var GLOBALARRAY = [];
    $("#bodyDiv").empty();
    switch (fillUpParameter) {
      case "TENORS":
        if (sessionStorage.getItem("tenorsGlobalData") != "") {
          GLOBALARRAY = JSON.parse(sessionStorage.getItem("tenorsGlobalData"));
        } else {
          GLOBALARRAY = getDataFromAPI(clientConfigdata.CommonMethods.NodeServer + "getTenor", "Tenor");
          sessionStorage.setItem("tenorsGlobalData", JSON.stringify(GLOBALARRAY));
        }
        break;
      case "SHARES":
        $("#CommonShares_ID").val("");
        if (sessionStorage.getItem("sharesGlobalData") != "") {
          GLOBALARRAY = JSON.parse(sessionStorage.getItem("sharesGlobalData"));
        } else {
          GLOBALARRAY = getDataFromAPI(clientConfigdata.CommonMethods.NodeServer + "getShares", "Share");
          sessionStorage.setItem("sharesGlobalData", JSON.stringify(GLOBALARRAY));
        }
        break;
      case "AMOUNTS":
        $("#CommonAmount").val("");

        if (sessionStorage.getItem("AmountsGlobalData") != "") {
          GLOBALARRAY = JSON.parse(sessionStorage.getItem("AmountsGlobalData"));
        } else {
          GLOBALARRAY = getDataFromAPI(clientConfigdata.CommonMethods.NodeServer + "getAmount", "Amount");
          sessionStorage.setItem("AmountsGlobalData", JSON.stringify(GLOBALARRAY));
        }
        break;
      case "BASKETS":
        if (sessionStorage.getItem("BasketsGlobalData") != "") {
          GLOBALARRAY = JSON.parse(sessionStorage.getItem("BasketsGlobalData"));
          IsBasketControl = true;
        } else {
          GLOBALARRAY = getDataFromAPI(clientConfigdata.CommonMethods.NodeServer + "getBasket", "Basket");
          sessionStorage.setItem("BasketsGlobalData", JSON.stringify(GLOBALARRAY));
          IsBasketControl = true;
        }
        break;
      case "PAIRS":
        $("#CommonPairs_ID").val("");
        if (sessionStorage.getItem("pairGlobalData") != "") {
          GLOBALARRAY = JSON.parse(sessionStorage.getItem("pairGlobalData"));
        } else {
          GLOBALARRAY = getDataFromAPI(clientConfigdata.CommonMethods.NodeServer + "getPairs", "Pair");
          sessionStorage.setItem("pairGlobalData", JSON.stringify(GLOBALARRAY));
        }
        break;
      default:
      // code block
    }
    counterBodyDiv = -3;
    var ccyPair = "";
    var tbl = "";
    var tbl = tbl + "<table class='tblControl'> ";
    var TREven = Math.floor(GLOBALARRAY.length / 3);
    var TROdd = GLOBALARRAY.length % 3;
    if (TREven > 0) {
      var incr = 0;
      for (var i = 0; i < TREven; i++) {
        tbl = tbl + "<tr id=" + i + ">";
        for (var j = incr; j < incr + 3; j++) {
          tbl = tbl + '<td class="' + className + '" onclick="fillccy(this,  \'' + bindingID + "')\">" + GLOBALARRAY[j] + "</td>";
        }
        tbl = tbl + "</tr>";
        // For More Choices------
        incr = j;
      }
      if (GLOBALARRAY.length % 3 == 0) {
        if (IsBasketControl == true) { } else {
          // tbl = tbl + '<tr> <td colspan="3" class="' + className + '"><a  style="text-decoration:underline;font-size:11px !important;float:right;"  class="moreSubLink" data-codeForProduct="' + codeForProduct + '" data-idForProduct="' + idForProduct + '" id="moreLink1" onclick="openMorepopup(this, \'' + fillUpParameter + "','" + bindingID + "');\"> More >>> </a>  </td> </tr>"; LGTGTWINT-687 - UI distortion after clicking on more
        }
      }
    }
    if (TROdd > 0) {
      tbl = tbl + "<tr>";
      for (var j = incr; j < GLOBALARRAY.length; j++) {
        tbl = tbl + '<td   class="' + className + '" onclick="fillccy(this,  \'' + bindingID + "')\">" + GLOBALARRAY[j] + "</td>";
      }
      var colspan = Number(3 - TROdd);
      if (IsBasketControl == true) { } else {
        // tbl = tbl + " <td  colspan=" + colspan + ' class="' + className + '">   <a  style="text-decoration:underline;font-size:11px !important;float:right;" id="moreLink2"  data-codeForProduct="' + codeForProduct + '" data-idForProduct="' + idForProduct + '" class="moreSubLink" onclick="openMorepopup(this, \'' + fillUpParameter + "','" + bindingID + "');\"> More >>> </a>  </td>"; LGTGTWINT-687 - UI distortion after clicking on more
      }
      tbl = tbl + "</tr>";
    }
    tbl = tbl + "</table> ";
    var str = "";
    str = str + "<div class=''>" + tbl + "</div>";
    $("#bodyDiv").append(str);
    var p = $("#" + $(callerID).attr("id")).offset();

    if (p.left + $("#bodyDiv").width() > window.outerWidth) {
      var res = Number(p.left + $("#bodyDiv").width()) - Number(window.outerWidth);
      p.left = Number(p.left) - res;
    }
    left1 = parseFloat(p.left) - 200 + "px";
    top1 = parseFloat(p.top) - 20 + "px";

    $("#bodyDiv").css("left", left1);
    $("#bodyDiv").css("top", top1);

    $("#bodyDiv").show();
    $("#DivOverlay").show();
    $("#DivOverlay")[0].style.opacity = "0";
    $("body")[0].style.overflow = "hidden";
  } catch (err) {
    console.log(err.message);
  } finally { }
}
//To Remove highlighted part if no error || Tina K || 18-Sep-2019
function validation_clear() {
  try {
    var elem = $("body").find(".ValidateFieldCSS");
    if (elem.id != "") {
      elem.removeClass("ValidateFieldCSS");
      document.getElementById("required").style.display = "none";
    }
  } catch (err) {
    console.log(err.message);
  }
}
//END Remove

function openMorepopup(obj, fillUpParameter, bindingID) {
  try {
    switch (fillUpParameter) {
      case "TENORS":
        FillUpTenorsPanel(obj, fillUpParameter, bindingID);
        break;
      case "AMOUNTS":
        FillUpAMountsPanel(obj, fillUpParameter, bindingID);
        break;
      case "SHARES":
        FillUpSharesPanel(obj, fillUpParameter, bindingID);
        break;
      case "BASKETS":
        FillUpBasketsPanel(obj, fillUpParameter, bindingID);
        break;
      case "PAIRS":
        FillUpPairsPanel(obj, fillUpParameter, bindingID);
        break;
      default:
      // code block
    }
  } catch (err) {
    console.log(err.message);
  }
}

function FillUpAMountsPanel(obj, fillUpParameter, bindingID) {
  try {
    p = $("#" + $(obj).attr("id")).offset();
    left1 = parseFloat(p.left) - 104 + "px";
    top1 = parseFloat(p.top) + 44 + "px";
    $("#amountsdiv").css("left", left1);
    $("#amountsdiv").css("top", top1);
    $("#amountsdiv").show();
    sessionStorage.setItem("moreAmtID", bindingID);
  } catch (err) {
    console.log(err.message);
  }
}

function FillUpPairsPanel(obj, fillUpParameter, bindingID) {
  try {
    p = $("#" + $(obj).attr("id")).offset();
    left1 = parseFloat(p.left) - 104 + "px";
    top1 = parseFloat(p.top) + 26 + "px";
    $("#ccypairdiv").css("left", left1);
    $("#ccypairdiv").css("top", top1);
    $("#ccypairdiv").show();
    var FXOobj = [];

    if ($(obj).attr("data-codeForProduct").trim() != "" && $(obj).attr("data-codeForProduct").trim() != "undefined") {
      $("#CommonPairs_ID").autocomplete({
        minLength: 2,
        source: function (request, response) {
          var FXOSharesList = [];
          $.ajax({
            async: false,
            crossDomain: true,
            type: "POST",
            url: clientConfigdata.CommonMethods.NodeServer + "getCcyPairFXD",
            data: JSON.stringify({

              "iEntityID": EntityID,
              "iProductId": $(obj).attr("data-idForProduct").trim(),
              "ProductCode": $(obj).attr("data-codeForProduct").trim(),
              "EntityID": EntityID,
              "LoginID": userName,
              "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
              "OptionCut":"BFIXTOK"

            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
              cashEQResponse = [];
              var indexCashEQ = 0;

              $(data.Get_Ccy_PairsResult.Pair_Tradable_Details).each(function (i, n) {
                if (n.asset_Pair.trim().toUpperCase().startsWith(request.term.toUpperCase()) || n.asset_Pair.trim().toUpperCase().endsWith(request.term.toUpperCase()) || n.asset_Pair.trim().toUpperCase().includes(request.term.toUpperCase())) {
                  cashEQResponse[indexCashEQ] = n;
                  indexCashEQ++;
                }
              });

              response(cashEQResponse);
              return true;
            },
            error: function (error) {
              return "false";
            },
          });
        },
        focus: function (event, ui) {
          return false;
        },
        select: function (event, ui) {
          $("#" + bindingID).val(ui.item.asset_Pair);
          $("#ccypairdiv").hide();
          $("#" + bindingID).focus().select();
          closeAllPopup();

          return true;
        },
      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>").append("<div>" + item.asset_Pair + "</div>").appendTo(ul);
      }
        ;
    } else {
      $("#CommonPairs_ID").autocomplete({
        minLength: 2,
        source: function (request, response) {
          var FXOSharesList = [];
          $.ajax({
            async: false,
            crossDomain: true,
            type: "POST",
            url: clientConfigdata.CommonMethods.NodeServer + "getCcyPairFXD",
            data: JSON.stringify({

              "iEntityID": EntityID,
              "iProductId": "1",
              //$(obj).attr("data-idForProduct").trim(),
              "ProductCode": "FXOption",
              //$(obj).attr("data-codeForProduct").trim(),
              "EntityID": EntityID,
              "LoginID": userName,
              "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
              "OptionCut":"BFIXTOK"

            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
              cashEQResponse = [];
              var indexCashEQ = 0;

              $(data.Get_Ccy_PairsResult.Pair_Tradable_Details).each(function (i, n) {
                if (n.asset_Pair.trim().toUpperCase().startsWith(request.term.toUpperCase()) || n.asset_Pair.trim().toUpperCase().endsWith(request.term.toUpperCase()) || n.asset_Pair.trim().toUpperCase().includes(request.term.toUpperCase())) {
                  cashEQResponse[indexCashEQ] = n;
                  indexCashEQ++;
                }
              });

              response(cashEQResponse);
              return true;
            },
            error: function (error) {
              return "false";
            },
          });
        },
        focus: function (event, ui) {
          return false;
        },
        select: function (event, ui) {
          $("#" + bindingID).val(ui.item.asset_Pair);
          $("#ccypairdiv").hide();
          $("#" + bindingID).focus().select();
          closeAllPopup();

          return true;
        },
      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>").append("<div>" + item.asset_Pair + "</div>").appendTo(ul);
      }
        ;
    }
  } catch (err) {
    console.log(err.message);
  }
}

function closeAllPopup() {
  try {
    $(".popup").each(function () {
      $(this).hide();
    });
    // $("body")[0].style.overflow = "scroll"; //LGTGTWINT - 687 
  } catch (err) {
    console.log(err.message);
  }
}

//Added by SoumyaP
function closeErrorBox(that) {
  try {
    //$("#" + "DivOverlay" + that.parentElement.parentElement.id.split("notify")[1]).hide(); //LGTGTWINT-2129 | Chaitanya M | 14 June 2023

    TileId = that.id.match(/\d+$/)[0];
    thisTile = document.getElementById("td" + TileId);

    $(thisTile).find('[id^="msg"]').html("");
    $(thisTile).find('[id^="DivOverlay"]').hide(); //LGTGTWINT-2129 | Chaitanya M | 13 June 2023
    $(thisTile).find('[id^="notify"]').css("display", "none");
  } catch (error) {
    console.log(error.message);
  }
}

function FillUpSharesPanel(obj, fillUpParameter, bindingID) {
  try {
    p = $("#" + $(obj).attr("id")).offset();
    left1 = parseFloat(p.left) - 104 + "px";
    top1 = parseFloat(p.top) + 26 + "px";
    $("#sharediv").css("left", left1);
    $("#sharediv").css("top", top1);
    $("#sharediv").show();

    $("#CommonShares_ID").autocomplete({
      minLength: 1,
      source: function (request, response) {
        cashEQResponse = [];
        var indexCashEQ = 0;
        $(EQCShareNameObj).each(function (i, n) {
          if (n.Code.trim().toUpperCase().includes(request.term.toUpperCase())) {
            cashEQResponse[indexCashEQ] = n;
            indexCashEQ++;
          }
        });
        response(cashEQResponse);
        return true;
      },
      focus: function (event, ui) {
        return false;
      },
      select: function (event, ui) {
        $("#" + bindingID).val(ui.item.Code).parents(".MainTable").find("span.notionalCcy").html("").html(ui.item.Ccy);
        $("#" + bindingID).parents(".sorting").find("[id^='hdnCurrentExchangeCode']").val(ui.item.ExchangeCode);

        $("#ccypairdiv").hide();

        $("#" + bindingID).focus().select();
        closeAllPopup();

        let tile = $("#" + bindingID).parents(".sorting")[0];
        data = EQCShareNameObj.filter(function (item) {
          return item["Code"] == ui.item.Code;
        });

        if ($(tile).find("select.ddlEQNoteCcy") != undefined) {
          $(tile).find("select.ddlEQNoteCcy").val(data[0]["Ccy"]);
        }
        return true;
      },
    }).autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>").append("<div>" + item.LongName + "</div>").appendTo(ul);
    }
      ;
  } catch (err) {
    console.log(err.message);
  }
}

function GetShares() {
  try {
    var webMethod = clientConfigdata.CommonMethods.NodeServer + "ShareListEQC";
    var that = this;
    var SharesList = [];
    $.ajax({
      async: true,
      crossDomain: true,
      type: "POST",
      url: webMethod,
      data: JSON.stringify({
        UserName: "Mobile1",
        token: getEQCAuthtoken,
      }),
      success: function (data) {
        var array = JSON.parse(data.responseData);
        for (var i = 0; i < array.length; i++) {
          var counter = array[i];
          SharesList.push({
            Code: counter.Code,
            LongName: counter.LongName,
            Ccy: counter.Ccy,
            ExchangeCode: counter.ExchangeCode,
            ExchangeName: counter.ExchangeName,
          });
        }
        return SharesList;
      },
      error: function (error) {
        return "false";
      },
    });
    return SharesList;
  } catch (err) {
    console.log(err.message);
  }
}

// POPUP JS
$(function () {
  try {
    // Info Message Template Dialog Box Changes - Runal 
    // $("#booktradecashx").dialog({
    //   autoOpen: false,
    //   hide: "puff",
    //   show: "slide",
    //   height: 200,
    //   width: 420,
    // });

    $("#whatifChart").dialog({
      autoOpen: false,
      hide: "slide",
      show: "puff",
      height: 700,
      width: 1600,
    });
  } catch (err) {
    console.log(err.message);
  }
});
// END

function formatNotionalWithComma_Common(n, ccy) {
  try {
    var val = n.toFixed(2);
    var parts = val.toString();

    if (ccy != undefined) {
      if (ccy == "JPY" || ccy == "IDR" || ccy == "KRW") {
        var num = numberWithOnlyCommas(parts);
      }
      return num;
    } else {
      if (n == "") {
//Added for LGTGTWINT-1487 | Chaitanya M | 27 Feb 2023
        if ($(event.currentTarget)[0].id.includes("ContractAmt") == true){
          return "0.00";
        }else if($(event.currentTarget)[0].id.includes("NoOfShareipboxOptions") == true || $(event.currentTarget)[0].id.includes("NoOfShareipboxAQDQ") == true){
          return "0";
        }else{
          return null
        }
        
      } else {
        var val = n.toFixed(2);
        var parts = val.toString();
        if ($(event.currentTarget)[0].id != undefined) {
          if ($(event.currentTarget)[0].id.includes("NoOfShareipboxOptions") == true || $(event.currentTarget)[0].id.includes("NoOfShareipboxAQDQ") == true || $(event.currentTarget)[0].id.includes("CashEQ_Qnty") == true || $(event.currentTarget)[0].id.includes("NoOfShareipboxRELCI") == true || $(event.currentTarget)[0].id.includes("NoOfShareipboxSPS") == true || $(event.currentTarget)[0].id.includes("txtHeaderNotionalAQDQ") == true || $(event.currentTarget)[0].id.includes("txtHeaderNotionalOPTIONS") == true) {
            var num = numberWithOnlyCommas(parts);
          } else {
            var num = parts.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        } else
          var num = parts.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return num;
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

function numberWithOnlyCommas(number) {
  try {

    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts[0];
  } catch (err) {
    console.log(err.message);
  }
}

function formatCurrency(amount) {
  try {

    var amt = parseFloat(amount).toFixed(2);
    return amt.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  } catch (err) {
    console.log(err.message);
  }
}

var minMaxNotionalChecked = false;

function fillValuesToOtherNotional(notional, tileObject, isNoOfSharesAdded,flag,parentid) {
  try {

    currentTile = $(tileObject).parents(".sorting")[0];
    if(currentTile == null || currentTile==undefined){
      currentTile = document.getElementById("td" + tileObject);
    }

    $(currentTile).find('[id^="errorMsgPanel"]').html(""); //LGTGTWINT-1123

    if (isNoOfSharesAdded) {
      // this is added for AQDQ and Options

      let _NoOfShares = 0;

      if(flag == ""|| flag == null){

        $(currentTile).find(".txtNotionalBreakdown").each(function (index, control) {
          if (control.value.trim() != "" && control.value != undefined) {
            _NoOfShares = _NoOfShares + parseFloat(control.value.replaceAll(",", ""));
          } else {
            _NoOfShares = _NoOfShares + parseFloat(0);
          }
        });
        let selectedShareName = $(currentTile).find('[id^="txtUnderlying"]').val().trim();
        let selectedShareCcy = getExchangeAndCcyFromBasket("", "ccy", selectedShareName)[0];
        // startLoader();  
        request_getDataFromAPI({
  
          "UserName" : sessionStorage.getItem("Username"),
          "Share" :selectedShareName,
          "Currency":selectedShareCcy,
          "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
          "CurrentTileID": currentTile.id.match(/\d+$/)[0],
  
        }, clientConfigdata.CommonMethods.NodeServer + "GetShareRateEQC").then(data => {
          // endLoader()
          // let xmlToJSONData = xml2jsonWF(data);
          // console.log('share spot price ', data);
          let shareSpotPrice = Number(data['responseData']);
          console.log('total calulated notional ', shareSpotPrice * _NoOfShares);
          
          // LGTGTWINT-1633 | Chaitanya M | 04 March 2023
           
          if ($(currentTile).find('[id^="ddlOrderType"]').val().toUpperCase() === "LIMIT") {

           
            if ($(currentTile).find('[id^="hdnAccuralDaysAQDQ"]').length > 0) {
              //AQDQ
              var totalNotionalAfterCalculation = Number($(currentTile).find('[id^="txtLimitLevel"]').val()) * _NoOfShares * Number($(currentTile).find('[id^="hdnAccuralDaysAQDQ"]').val().trim());
            } else {
              //Options
              var totalNotionalAfterCalculation = Number($(currentTile).find('[id^="txtLimitLevel"]').val()) * _NoOfShares;
            }

          } else {

            if ($(currentTile).find('[id^="hdnAccuralDaysAQDQ"]').length > 0) {
              //AQDQ
              var totalNotionalAfterCalculation = shareSpotPrice * _NoOfShares * Number($(currentTile).find('[id^="hdnAccuralDaysAQDQ"]').val().trim());
            } else {
              //Options
              var totalNotionalAfterCalculation = shareSpotPrice * _NoOfShares;
            }

          }
  
          var formatOptions = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          };
          $(currentTile).find('[id^="txtTotalNotional"]').val(Number(_NoOfShares));
          $(currentTile).find('[id^="txtAllocatedNotional"]').val(Number(_NoOfShares));
          $(currentTile).find('[id^="txtOrderNotional"]').val(Number(_NoOfShares)); //LGTGTWINT-1596 -Instant Pricing: OTC: decimal values should not be allowed in No. of shares fields on order popup.
          $(currentTile).find('[id^="txtCalculatedNotional"]').val(Number(totalNotionalAfterCalculation).toLocaleString("en", formatOptions));
  
          return true;
        }).catch(err => {
          endLoader()
          console.log(err)
        })

      }else{
        // Added fro LGTGTWINT-1198 | Chaitanya M | 2 MAr 2023
        _NoOfShares= $(currentTile).find('[id^="' + parentid + '"]').val().replace(/,/g, "").split(".")[0];
        let selectedShareName = $(currentTile).find('[id*="SharesDemo"]').val(); 
        let selectedShareCcy = getExchangeAndCcyFromBasket("", "ccy", selectedShareName)[0];
        startLoader();
  
        request_getDataFromAPI({

          "UserName" : sessionStorage.getItem("Username"),
          "Share" :selectedShareName,
          "Currency":selectedShareCcy,
          "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
          "CurrentTileID": currentTile.id.match(/\d+$/)[0],
  
        }, clientConfigdata.CommonMethods.NodeServer + "GetShareRateEQC").then(data => {
          endLoader()
          // let xmlToJSONData = xml2jsonWF(data);
          // console.log('share spot price ', data);
          let shareSpotPrice = Number(data['responseData']);
          console.log('total cal notional ', shareSpotPrice * _NoOfShares);
          if ($(currentTile).find('[id^="hdnAccuralDaysAQDQ"]').length > 0) {
            //AQDQ
            var totalNotionalAfterCalculation = shareSpotPrice * _NoOfShares * Number($(currentTile).find('[id^="hdnAccuralDaysAQDQ"]').val().trim());
          } else {
            //Options
            var totalNotionalAfterCalculation = shareSpotPrice * _NoOfShares;
          }
  
          var formatOptions = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          };
          $(currentTile).find('[id^="txtTotalNotional"]').val(Number(_NoOfShares));
          $(currentTile).find('[id^="txtAllocatedNotional"]').val("0"); 
          $(currentTile).find('[id^="txtOrderNotional"]').val(Number(_NoOfShares));
  
          $(currentTile).find('[id^="txtCalculatedNotional"]').val(Number(totalNotionalAfterCalculation).toLocaleString("en", formatOptions));
          return true;

        }).catch(err => {
          endLoader()
          console.log(err)
        })
      }      

    } else {
      //Changed function for LGTGTWINT-1097 | Chaitanya M | 01 March 2023 
      if(flag == "" || flag == null){
        var _notional = 0;
        $(currentTile).find(".txtNotionalBreakdown").each(function (index, control) {
          if (control.value.trim() != "" && control.value != undefined) {
            _notional = _notional + parseFloat(control.value.replaceAll(",", ""));
          } else {
            _notional = _notional + parseFloat(0);
          }
        });

        var formatOptions = {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        };
        $(currentTile).find('[id^="txtTotalNotional"]').val(Number(_notional).toLocaleString("en", formatOptions));
        $(currentTile).find('[id^="txtAllocatedNotional"]').val(Number(_notional).toLocaleString("en", formatOptions));
        $(currentTile).find('[id^="txtOrderNotional"]').val(Number(_notional).toLocaleString("en", formatOptions));

      }else{
        var _notional = 0;
        _notional= $(currentTile).find('[id^="ContractAmt"]').val().replace(/,/g, "").split(".")[0];

        var formatOptions = {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        };
        
        $(currentTile).find('[id^="txtTotalNotional"]').val(Number(_notional).toLocaleString("en", formatOptions));
        $(currentTile).find('[id^="txtAllocatedNotional"]').val("0");
        $(currentTile).find('[id^="txtOrderNotional"]').val(Number(_notional).toLocaleString("en", formatOptions));
      }   
      return true;
    }
  } catch (error) {
    endLoader();
    console.log("error in fillValuesToOtherNotional ", error);
  }
}

function FormatNotionalCommon(notional, object, ccy) {
  try {
    var thistileFX = $(object).find("td.sorting")[0];

    var rel_Amount = /\d+(K$(?![K|M|B])|M$(?![K|M|B])|B$(?![K|M|B]))/i;
    var rel_Char = /(K|M|B)/i;
    var pos;
    var number;
    var rel_invalidChar = /[\#|\@|!|\&|\*|\%|\\|\+|\*|\^]/;

    if (notional.search(rel_invalidChar) != -1) {
      return null;
    }

    if (notional.indexOf(",") > -1) {
      //|| notional.indexOf(".") > -1
      notional = notional.replace(/\,/g, "").split(".")[0];
    }
    // To convert NaN to 0.00 format (if not a number then 0 will be shown) || Tina K || 14-Oct-2019
    if ((isNaN(Number($(object).val())) && notional.search("'") != -1) || notional.search('"') != -1) {
      $(object).val("0");
      return $(object).val(Number($(object).val()).toFixed(2));
    }
    //End
    // Added By Esheeta
    if (notional.search(rel_Amount) === -1) {
      if (notional != "" && notional.search(",") == -1) {
        number = parseFloat(notional);
        return number.toLocaleString;
        //+ end;
      } else {
        return null;
      }
    }

    if (notional.search(rel_Amount) != -1) {
      if (notional.search("K") != -1 || notional.search("k") != -1) {
        pos = notional.search(rel_Char);
        if (pos != 0) {
          number = notional.substring(0, pos);
          number = number * 1000;
        } else {
          return null;
        }
        return number.toLocaleString();
      }
      if (notional.search("M") != -1 || notional.search("m") != -1) {
        pos = notional.search(rel_Char);
        if (pos != 0) {
          number = notional.substring(0, pos);
          number = number * 1000000;
        } else {
          return null;
        }
        return number.toLocaleString();
      }
      if (notional.search("B") != -1 || notional.search("b") != -1) {
        pos = notional.search(rel_Char);
        if (pos != 0) {
          number = notional.substring(0, pos);
          number = number * 1000000000;
        } else {
          if (notional.search(/[A-Z]/i) != -1)
            return null;
          return null;
        }
        return number.toLocaleString();
      }
    } else {
      if (notional.search(/[A-Z]/i) != -1) {
        return null;
      } else {
        return notional;
      }
    }
  } catch (error) {
    console.log("error in FormatNotionalCommon ", error);
  } finally {
    if (number != undefined) {
      $(object).val(formatNotionalWithComma_Common(number, ccy));
    } else
      $(object).val();
    rel_Amount = null;
    rel_Char = null;
    pos = null;
    number = null;
    rel_invalidChar = null;
    notional = null;

    //  checkDecimalAmt(object, thistileFX); //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022
  }
}

function ValidateField(currentId, message, thisTile) {
  //Message parameter added || Tina K

  try {
    validation_clear();
    //To Remove highlighted part if no error || Tina K || 19-Sep-2019
    var border = $("#" + currentId);
    var position = $("#" + currentId).offset();
    var w = $(window);
    // var req = document.getElementById("required");
    // req.style.left = position.left - w.scrollLeft() + $("#" + currentId).outerWidth() + 2 + "px";
    // req.style.top = position.top - w.scrollTop() - 7 + "px";
    // req.style.display = "block";
    border.addClass("ValidateFieldCSS");
    //Error Message for Validation || Tina K || 05-Sep-2019
    if (typeof message == "undefined") {
      slideNotification("#b34b3b", "Please fill all fields", thisTile);
    } else {
      slideNotification("#b34b3b", message, thisTile);
    }
    //Message END
  } catch (er) {
    console.log(error.message);
  }
}

function onlyString() {
  try {
    validation_clear();
    //To Remove highlighted part if no error || Tina K || 19-Sep-2019
    var key;
    key = window.event.keyCode;

    if (key == 9) {
      $("#bodyDiv").hide();
      return true;
    }
    $("#bodyDiv").hide();

    //For underlying and currency pair no characters are allowed || Tina K || 7-Oct-2019
    if (key == 8 || key == 46 || (key >= 37 && key <= 40)) {
      return true;
    } else if (key >= 65 && key <= 90) {
      return true;
    } else if (event.keyCode == 65 && event.ctrlKey) {
      event.target.select();
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    key = "";
  }
}

//For Auto complete in underlying and currency pair characters allowed || Tina K || 10-Oct-2019
function onlyStringForMore(moreTxtObj) {
  try {
    validation_clear();
    //To Remove highlighted part if no error || Tina K || 19-Sep-2019
    var key;
    key = window.event.keyCode;

    if (key == 9 || key == 13 || key == 46) {
      $("#bodyDiv").hide();
      if (moreTxtObj != undefined) {
        $(moreTxtObj).val("");
        $(moreTxtObj).parent().hide();
      } else {
        $("#bodyDiv").hide();
        //on input box edit
      }

      return true;
    }

    if (key == 8) {
      if ($(event.currentTarget).parent().prop("tagName") === "DIV") {
        //it is basket
        if ($(event.currentTarget).val().length != 0) {
          return true;
        }

        var elem = $(event.currentTarget).parent().find(".sharesListName");
        elem = $(elem)[elem.length - 1];
        $(elem).remove();
      }
    }

    if (!event.shiftKey) {
      if (event.target.value == "") {
        if (key == 110 || key == 190) {
          return false;
        }
      }
      //End '.'
      if (event.keyCode == 65 && event.ctrlKey) {
        event.target.select();
      }
      if ((key > 64 && key < 91) || (key > 105 && key < 123) || key == 45 || key == 32 || key == 46 || key == 17 || key == 8 || key == 109 || key == 189 || key == 37 || key == 39 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
        if (event.target.value.indexOf("-") > -1 && (key == 109 || key == 189)) {
          return false;
        } else {
          return true;
        }
      } else {
        window.event.returnValue = null;
      }
    } else if (key > 64 && key < 91) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    key = "";
  }
}
//END

function onlyNumeric(objFromMore) {
  // With one decimal for notional like 2.5k
  //
  try {
    validation_clear();
    //To Remove highlighted part if no error || Tina K || 19-Sep-2019

    //No special characters allowed, only single dot is allowed, (k,m,b) allowed, used for fields like Contract amounts || Tina K || 24-Sep-2019
    var evt = event || window.event;

    var iKeyCode = evt.which ? evt.which : evt.keyCode;

    if (iKeyCode == 9) {
      if (objFromMore != undefined) {
        $("#" + sessionStorage.getItem("moreAmtID")).val($(objFromMore).val()).focus();
      }
      $("#amountsdiv").hide();
      closeAllPopup();

      return true;
    } else if (event.keyCode == 65 && event.ctrlKey) {
      event.target.select();
    } else {
      if (!evt.shiftKey) {
        if ((evt.target.value == "" || evt.target.selectionStart == 0) && (iKeyCode == 110 || iKeyCode == 190 || iKeyCode == 66 || iKeyCode == 75 || iKeyCode == 77)) {
          return false;
        } else if ((iKeyCode >= 48 && iKeyCode <= 57) || (iKeyCode >= 96 && iKeyCode <= 105) || iKeyCode == 110 || iKeyCode == 190 || iKeyCode == 8 || iKeyCode == 46 || iKeyCode == 66 || iKeyCode == 75 || iKeyCode == 77 || (iKeyCode >= 37 && iKeyCode <= 40)) {
          if ((iKeyCode == 66 || iKeyCode == 75 || iKeyCode == 77) && (evt.target.selectionEnd != evt.target.value.length || evt.target.value[evt.target.selectionEnd - 1] == ".")) {
            return false;
          }
          if (evt.target.value.indexOf(".") > -1 && (iKeyCode == 110 || iKeyCode == 190)) {
            return false;
          } else if (evt.target.value.indexOf("k") > -1 || evt.target.value.indexOf("m") > -1 || evt.target.value.indexOf("b") > -1) {
            if (iKeyCode == 46 || iKeyCode == 8) {
              evt.target.value = evt.target.value.substring(0, evt.target.value.length - 1);
              return true;
            }
            return false;
          } else if (iKeyCode == 46) {
            evt.target.value = evt.target.value.substring(0, evt.target.value.length - 1);
          }
          return true;
        } else {
          return false;
        }
      } else if (iKeyCode == 37 || iKeyCode == 39) {
        return true;
      } else {
        return false;
      }
    }
    //END
  } catch (error) {
    console.log(error.message);
  } finally {
    iKeyCode = "";
  }
}

function toFixedFormat(This, str) {
  //to change coupon to 2 decimal format
  try {
    // changes for 2 decimal places for strike and barrier values in case of 'JPY' currency - Onkar E. (16/10/2019)
    // Getting tileId, tile amd then currency pair in current tile
    var TileId, thisTile, productName;
    TileId = This.id.match(/\d+$/)[0];
    thisTile = document.getElementById("td" + TileId);
    productName = $($(This).parents(".sorting").find(".productName")).attr("id");

    if (!isNaN(Number($(This).val()))) {
      if (str == "four") {
        $(This).val(Number($(This).val()).toFixed(4));
      } else if (str == "zero") {
        $(This).val(Number($(This).val()).toFixed(0));
        // Zero for
      } else {
        $(This).val(Number($(This).val()).toFixed(2));
      }
    } else {
      $(This).val("0");
      $(This).val(Number($(This).val()).toFixed(2));
    }
  } catch (er) {
    console.log(er.message);
  }
}

function toFixedFormatFXD(This) {
  //to change coupon to 2 decimal format
  try {
    var TileId, thisTile, productName;
    TileId = This.id.match(/\d+$/)[0];
    thisTile = document.getElementById("td" + TileId);
    productName = $($(This).parents(".sorting").find(".productName")).attr("id");
    if (!isNaN(Number($(This).val().replace(/,/g, "").split(".")[0]))) {
      if (productName == "FXAQ") {
        $(This).val(numberWithCommas(Number($(This).val().replace(/,/g, "")).toFixed($(thisTile).find('[id^="hdnDecimalRateFXAQ"]').val())));
      } else if (productName == "FXDQ") {
        $(This).val(numberWithCommas(Number($(This).val().replace(/,/g, "")).toFixed($(thisTile).find('[id^="hdnDecimalRateFXDQ"]').val())));
      } else if (productName == "FXOPTION") {
        $(This).val(numberWithCommas(Number($(This).val().replace(/,/g, "")).toFixed($(thisTile).find('[id^="hdnDecimalRateFXO"]').val())));
      } else if (productName == "FXDCI") {
        $(This).val(numberWithCommas(Number($(This).val().replace(/,/g, "")).toFixed($(thisTile).find('[id^="hdnDecimalRateFXDCI"]').val())));
      } else if (productName == "FXTRF") {
        $(This).val(numberWithCommas(Number($(This).val().replace(/,/g, "")).toFixed($(thisTile).find('[id^="hdnDecimalRateFXTRF"]').val())));
      } else if (productName == "FXPIVOT") {
        $(This).val(numberWithCommas(Number($(This).val().replace(/,/g, "")).toFixed($(thisTile).find('[id^="hdnDecimalRateFXPivot"]').val())));
      } else if (productName == "Strategies") {
        $(This).val(numberWithCommas(Number($(This).val().replace(/,/g, "")).toFixed($(thisTile).find('[id^="hdnDecimalRateFXStrategies"]').val())));
      }
    }
  } catch (er) {
    console.log(er.message);
  }
}

function numberWithCommas(number) {
  try {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  } catch (er) {
    console.log(er.message);
  }
}

function isNumber(evt) {
  //Valid for strike, coupon etc.
  try {
    validation_clear();
    //To Remove highlighted part if no error || Tina K || 19-Sep-2019
    var iKeyCode = evt.which ? evt.which : evt.keyCode;

    //No special characters allowed, only single dot is allowed, used for fields like barrier strike etc || Tina K || 24-Sep-2019
    if (iKeyCode == 9) {
      return true;
    } else if (event.keyCode == 65 && event.ctrlKey) {
      event.target.select();
    } else if (!evt.shiftKey) {
      if ((evt.target.value == "" || evt.target.selectionStart == 0) && (iKeyCode == 110 || iKeyCode == 190)) {
        return false;
      } else if ((iKeyCode >= 48 && iKeyCode <= 57) || (iKeyCode >= 96 && iKeyCode <= 105) || iKeyCode == 110 || iKeyCode == 190 || iKeyCode == 8 || iKeyCode == 46 || (iKeyCode >= 37 && iKeyCode <= 40)) {
        if (evt.target.value.indexOf(".") > -1 && (iKeyCode == 110 || iKeyCode == 190)) {
          return false;
        } else if (iKeyCode == 46) {
          evt.target.value = evt.target.value.substring(0, evt.target.value.length - 1);
        }
        return true;
      } else {
        return false;
      }
    } else if (iKeyCode == 37 || iKeyCode == 39) {
      return true;
    } else {
      return false;
    }
    //END
  } catch (error) {
    console.log(error.message);
  }
}

function isOnlyNumber(evt) {
  //With No Decimal
  try {
    validation_clear();
    //To Remove highlighted part if no error || Tina K || 19-Sep-2019
    var iKeyCode = event.which ? event.which : event.keyCode;

    //To allow letters in Insurance AppID field  Tina K  11-Nov-2019
    if ($(event.currentTarget)[0].id.includes("insurance_AppID") == true) {
      if (iKeyCode >= 65 && iKeyCode <= 90) {
        return true;
      }
    }
    //No special characters allowed, No dot is allowed, used for fields like no. of shares etc || Tina K || 23-Sep-2019
    if (iKeyCode == 9) {
      return true;
    } else if (event.keyCode == 65 && event.ctrlKey) {
      event.target.select();
    } else if (!evt.shiftKey) {
      if ((iKeyCode >= 48 && iKeyCode <= 57) || (iKeyCode >= 96 && iKeyCode <= 105) || iKeyCode == 8 || iKeyCode == 46 || iKeyCode == 37 || iKeyCode == 39) {
        if (iKeyCode == 46) {
          evt.target.value = evt.target.value.substring(0, evt.target.value.length - 1);
        }
        return true;
      } else {
        return false;
      }
    } else if (iKeyCode >= 37 && iKeyCode <= 40) {
      return true;
    } else {
      return false;
    }
    //END
  } catch (error) {
    console.log(error.message);
  }
}

var counterBodyDiv = -3;

//To Access the fields in popUP using keyboard || Tina K || 23-Oct-2019
function popupAccess() {
  try {
    if ($("body").find(".moreSubLink:visible").length > 1) {
      return false;
    }

    if (event.keyCode == 37) {
      if (counterBodyDiv > 0) {
        $("#bodyDiv").find("td").removeClass("hoverCntrl");
        $($("#bodyDiv").find("td")[counterBodyDiv - 1]).addClass("hoverCntrl");
        counterBodyDiv -= 1;
      }
    } else if (event.keyCode == 38) {
      if (counterBodyDiv > 2) {
        $("#bodyDiv").find("td").removeClass("hoverCntrl");
        $($("#bodyDiv").find("td")[counterBodyDiv - 3]).addClass("hoverCntrl");
        counterBodyDiv -= 3;
      }
    } else if (event.keyCode == 39) {
      if (counterBodyDiv < $("#bodyDiv").find("td").length - 1) {
        $("#bodyDiv").find("td").removeClass("hoverCntrl");
        $($("#bodyDiv").find("td")[counterBodyDiv + 1]).addClass("hoverCntrl");
        counterBodyDiv += 1;
      }
    } else if (event.keyCode == 40) {
      if (counterBodyDiv < $("#bodyDiv").find("td").length - 3) {
        $("#bodyDiv").find("td").removeClass("hoverCntrl");
        $($("#bodyDiv").find("td")[counterBodyDiv + 3]).addClass("hoverCntrl");
        counterBodyDiv += 3;
      }
    } else if (event.keyCode == 13) {
      var str = $("#bodyDiv").find(".hoverCntrl")[0].innerText;
      if (str.includes("More")) {
        $($("#bodyDiv").find(".hoverCntrl")[0]).find("a").click();
        $($("#bodyDiv").find("input")).addClass("ui-autocomplete-input");
        $($("body").find(".moreSubLink:visible")[1]).focus();
      }
      $($("#bodyDiv").find(".hoverCntrl")[0]).click();
    }
  } catch (err) {
    console.log(err.message);
  }
}

function fillDropdownlistControl(tenor_list, selectID) {
  //change made on 9th aug
  try {
    var x = document.getElementById(selectID);
    if (x.options.length != 0) {
      $(x).empty();
    }
    for (var i = 0; i < tenor_list.length; i++) {
      var option = document.createElement("option");
      option.className = "ddl"; 
      option.text = tenor_list[i];
      option.value = tenor_list[i];
      x.add(option);
    }
  } catch (error) {
    console.log(error.message);
  }
}

// FX :: AQ, DQ, TRF & Pivot Get Price Function

function PlotPrice(outJson, BestPP, FXAQBanksRowTR, PricesTR, thisTile,solvefor) { //Added for Solve for check | Chaitanya M | 02 Aug 2023
  try {
    var iQuoteID;
    //  Added by Atharva - Timers - START
   // var thisTile = document.getElementById("td" + tileId);
    var TimersTR = "#" + $(thisTile).find('[id*="TimerRow"]').attr("id");
    var isNonBestPrice = false;
    if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
      isNonBestPrice = true;
    } else {
      isNonBestPrice = false;
    }
    // END
    // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
    var priceClass = "GlowPrice_Red";
    if (!glowFlag) {
      priceClass = "noGlow";
    }
    var returnedData = $.grep(outJson, function (element, index) {
      return element.provider == BestPP;
    });

    var without_BestPP = $.grep(outJson, function (element, index) {
      return element.provider != BestPP;
    });

    // Added by Atharva - Timers - START
    // Sorting prices and storing in hidden prices input of FX Strategies
    outJson.sort(function (a, b) {
      if (a.premium === null || a.premium == "" || a.premium == "0") {
        return 1;
      } else if (b.premium === null || b.premium == "" || b.premium == "0") {
        return -1;
      } else if (a.premium === b.premium) {
        return 0;
      }
      return a.premium < b.premium ? 1 : -1;
    });
    $(thisTile).find('[id*="hdnPrices"]').val(JSON.stringify(outJson));
    banksIndex[$(thisTile)[0].id] = {};
    myCounter[$(thisTile)[0].id] = {};
    var itr = 0;
    var pricesJson = JSON.parse($(thisTile).find('[id*="hdnPrices"]').val());
    // END

    if (returnedData.length > 0) {
      iQuoteID = returnedData[0].quoteId;

      provider = returnedData[0].provider;
      
      //Added for Solve for check | Chaitanya M | 02 Aug 2023
      
      if(solvefor === "PREMIUM" ){
        premium = returnedData[0].premium;
        _percentstr = " %";
      }else if(solvefor === "STRIKE"){
        premium = returnedData[0].strike;
        _percentstr = "";
      }else{
        premium = returnedData[0].premium;
        _percentstr = " %";
      }
      //ENd      

      // LGTGTWINT-1987 | Chaitanya M | 11 May 2023 
      IBprem = returnedData[0].premiumAmount.toFixed(2);
      IBPremperc = returnedData[0].premium.toFixed(4);
      ClientPremDir = returnedData[0].client_Prem_Dir;
      StrikeRate = returnedData[0].strike;
      //End

      //START : HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
      let ccypair = $(thisTile).find('[id*="CCYPairDemo"]').val();
      cptySpotRate = returnedData[0].spot.toFixed(ccypair.includes('JPY') ? 2 : 4);
      //END : HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024


      // Added by Atharva - Timers - START
      banksIndex[$(thisTile)[0].id][itr] = provider;
      myCounter[$(thisTile)[0].id][banksIndex[$(thisTile)[0].id][itr]] = calculateRemainingSeconds(pricesJson[itr].validTill);
      //Math.floor(Math.random() * 40)+1;
      // END
      if (isNaN(premium) || premium == 0 || premium === "FAIL" || premium === undefined || premium == "") {
        $(FXAQBanksRowTR).append("<td>" + provider + "</td>");
        $(PricesTR).append("<td> - </td>");
        $(TimersTR).append("<td> - </td>");
      } else {
        // Added by Atharva - Timers
        // Added style and classes to prices and banks rows.
        // Added completely new timers row.
        if (isNonBestPrice) {
          if(Number(premium).toFixed(4)<0){ 
            //LGTCLI-344 Counterparty Tiles & Pricing Panel Negative Prices Font Colour | Chaitanya M | 06 March 2023
            $(FXAQBanksRowTR).append("<td class='priceBackground bestPriceStyle'><button type='button' class='priceButton' onclick='setPrice(this)' id='" + $(thisTile)[0].id + "_" + itr + "'>" + provider + "</button></td>");
            $(PricesTR).append("<td class='priceBackground negativeprice'" + priceClass + "'><button type='button' class='priceButton pricevaluesstyle' onclick='setPrice(this)' id='" + $(thisTile)[0].id + "_" + itr + "'>" + Number(premium).toFixed(4) + _percentstr+" </button></td>"); //LGTCLI-328 "%" Added to Prices Label | Chaitanya M | 23 Feb 2023 | Added for Solve for check | Chaitanya M | 02 Aug 2023
            
            // LGTGTWINT-1987 | Chaitanya M | 11 May 2023 
            $(thisTile).find('[id^="hdnIBPremFX"]').val(IBprem);
            $(thisTile).find('[id^="hdnIBPremPercFX"]').val(IBPremperc);
            $(thisTile).find('[id^="hdnClientPremDirFX"]').val(ClientPremDir);
            $(thisTile).find('[id^="hdnClientStrikeFX"]').val(StrikeRate);
            $(thisTile).find('[id^="hdnSpotRateFX"]').val(cptySpotRate); // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024

            //End
 
          }else{ 
            $(FXAQBanksRowTR).append("<td class='priceBackground bestPriceStyle'><button type='button' class='priceButton' onclick='setPrice(this)' id='" + $(thisTile)[0].id + "_" + itr + "'>" + provider + "</button></td>");
            $(PricesTR).append("<td class='priceBackground bestPriceStyle " + priceClass + "'><button type='button' class='priceButton pricevaluesstyle' onclick='setPrice(this)' id='" + $(thisTile)[0].id + "_" + itr + "'>" + Number(premium).toFixed(4) +_percentstr+  " </button></td>"); //LGTCLI-328 "%" Added to Prices Label | Chaitanya M | 23 Feb 2023 | //Added for Solve for check | Chaitanya M | 02 Aug 2023
            
            // LGTGTWINT-1987 | Chaitanya M | 11 May 2023 
            $(thisTile).find('[id^="hdnIBPremFX"]').val(IBprem);
            $(thisTile).find('[id^="hdnIBPremPercFX"]').val(IBPremperc) ;
            $(thisTile).find('[id^="hdnClientPremDirFX"]').val(ClientPremDir);
            $(thisTile).find('[id^="hdnClientStrikeFX"]').val(StrikeRate);
            $(thisTile).find('[id^="hdnSpotRateFX"]').val(cptySpotRate); // HSBCFXEINT-64 : Updating CounterParty Spot | Chaitanya M | 05-Feb-2024
            //End
          }
        } else {
          if(Number(premium).toFixed(4)<0){
            $(FXAQBanksRowTR).append("<td class='bestPriceStyle'>" + provider + "</td>");
            $(PricesTR).append("<td class='negativeprice pricevaluesstyle'>" + Number(premium).toFixed(4)  + _percentstr +" </td>"); //LGTCLI-328 "%" Added to Prices Label | Chaitanya M | 23 Feb 2023 |//Added for Solve for check | Chaitanya M | 02 Aug 2023
          }else{
          $(FXAQBanksRowTR).append("<td class='bestPriceStyle'>" + provider + "</td>");
          $(PricesTR).append("<td class=' bestPriceStyle pricevaluesstyle'>" + Number(premium).toFixed(4)  + _percentstr + " </td>"); //LGTCLI-328 "%" Added to Prices Label | Chaitanya M | 23 Feb 2023 | //Added for Solve for check | Chaitanya M | 02 Aug 2023
          }
        }
        $(TimersTR).append("<td>" + myCounter[$(thisTile)[0].id][banksIndex[$(thisTile)[0].id][itr]] + "</td>");
      }
      itr++;
    } else {
      iQuoteID = "";
    }

    if (without_BestPP.length > 0) {
      sortJson(without_BestPP);

      $(without_BestPP).each(function (i, j) {

        //Added for Solve for check | Chaitanya M | 02 Aug 2023
        let _percentstr ="%";
        if(solvefor === "PREMIUM" ){
          premium = j.premium;
          _percentstr = " %";
        }else if(solvefor === "STRIKE"){
          premium = j.strike;
          _percentstr = "";
        }else{
          premium = j.premium;
          _percentstr = " %";
        }
        //ENd 
        provider = j.provider;
        
        // Added by Atharva - Timers - START
        banksIndex[$(thisTile)[0].id][itr] = provider;
        myCounter[$(thisTile)[0].id][banksIndex[$(thisTile)[0].id][itr]] = calculateRemainingSeconds(pricesJson[itr].validTill);
        //Math.floor(Math.random() * 40)+1;
        // END
        if (isNaN(premium) || premium == 0 || premium === "FAIL" || premium === undefined || premium == "") {
          // $(FXAQBanksRowTR).append("<td>" + provider + "</td>");
          // $(PricesTR).append("<td> - </td>");
          if (without_BestPP[0].bestPriceProvider.split(":")[0] == "FAIL") {
            $(FXAQBanksRowTR).append("<td>" + "-" + "</td>");
            $(PricesTR).append("<td> " + "-" + " </td>");
            $(TimersTR).append("<td> - </td>");
          } else {
            return false;
          }
        } else {
          // Added by Atharva - Timers
          // Added style and classes to prices and banks rows.
          // Added completely new timers row.
          if (isNonBestPrice) {
            if(Number(premium).toFixed(4)<0){
              $(FXAQBanksRowTR).append("<td><button type='button' class='priceButton' onclick='setPrice(this)' id='" + $(thisTile)[0].id + "_" + itr + "'>" + provider + "</button></td>");
              $(PricesTR).append("<td><button type='button' class='priceButton negativeprice_nonbest pricevaluesstyle' onclick='setPrice(this)' id='" + $(thisTile)[0].id + "_" + itr + "'>" + Number(premium).toFixed(4) + _percentstr+ " </button></td>"); //LGTCLI-328 "%" Added to Prices Label | Chaitanya M | 23 Feb 2023 | //Added for Solve for check | Chaitanya M | 02 Aug 2023
            } else{

              $(FXAQBanksRowTR).append("<td><button type='button' class='priceButton' onclick='setPrice(this)' id='" + $(thisTile)[0].id + "_" + itr + "'>" + provider + "</button></td>");
              $(PricesTR).append("<td><button type='button' class='priceButton pricevaluesstyle' onclick='setPrice(this)' id='" + $(thisTile)[0].id + "_" + itr + "'>" + Number(premium).toFixed(4) + _percentstr +" </button></td>"); //LGTCLI-328 "%" Added to Prices Label | Chaitanya M | 23 Feb 2023 | //Added for Solve for check | Chaitanya M | 02 Aug 2023

            }           
          } else {
            $(FXAQBanksRowTR).append("<td>" + provider + "</td>");
            $(PricesTR).append("<td>" + Number(premium).toFixed(4) + _percentstr + " </td>"); //LGTCLI-328 "%" Added to Prices Label | Chaitanya M | 23 Feb 2023 | //Added for Solve for check | Chaitanya M | 02 Aug 2023
          }
          $(TimersTR).append("<td>" + myCounter[$(thisTile)[0].id][banksIndex[$(thisTile)[0].id][itr]] + "</td>");
        }
        itr++;
      });
    }
    return iQuoteID;
  } catch (error) {
    console.log(error.message);
  }
}

function sortJson(JSONOBJ) {
  try {
    JSONOBJ.sort(function (a, b) {
      if (a.premium === null || a.premium == "0") {
        return 1;
      } else if (b.premium === null || b.premium == "0") {
        return -1;
      } else if (a.premium === b.premium) {
        return 0;
      }
      return a.premium > b.premium ? -1 : 1;
    });
  } catch (error) {
    console.log(error.message);
  }
}

function calculateRemainingSeconds(validTillTime) {
  try {

    // Start - Order booking time should be UTC timezone instead of Server time.
    let validTillTimeNew=new Date(Date.parse(validTillTime))
    
    // let clientTime = changeTimeZone(new Date(), 'Asia/Kolkata'); 
	let clientTime = changeTimeZone(new Date(), 'Europe/London'); 

    let remainingSeconds = Math.max(0,Math.floor((validTillTimeNew.getTime() - clientTime.getTime()) / 1000))

    return remainingSeconds;
    

    // // Client_Time.toLocaleString("en-GB", {
    // //   timeZone: "Europe/London"
    // // });

    // // Start - Order TImer not always zero issue || Chaitanya M | 27 Nov 2023
    // let d = new Date();
    // let currentTime = d;
    // // var currentTime = calcTime(+8);
    // // End - Order TImer not always zero issue || Chaitanya M | 27 Nov 2023
    // var remainingSeconds = Math.max(0,Math.floor((validTillTime.getTime() - currentTime.getTime()) / 1000)); //LGTGTWINT-1510 | Chaitanya M | 24 Feb 2023
    // return remainingSeconds;

    // End - Order booking time should be UTC timezone instead of Server time.

  } catch (error) {
    console.log(error.message);
  }
}

// Start - Order booking time should be UTC timezone instead of Server time.
function changeTimeZone(date, timeZone) {
  try
  {
    if (typeof date === 'string') {
      return new Date(
        new Date(date).toLocaleString('en-US', {
          timeZone,
        }),
      );
    }
    return new Date(date.toLocaleString('en-US', {timeZone,}),);
  }catch(error){
    console.log(error.message)
  } 
}
// End - Order booking time should be UTC timezone instead of Server time.

// END

var shareLongname = [];
function callDropDownFunction(id, productName, idd, src) {
  //share basket selection || Eshita K || 05-Sep-2019
  try {
  
    //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
    switch(productName.toUpperCase()){

      case "DRA":
          EQCShareNameObj = DRAShareData;
          break;

      case "FCN":
          EQCShareNameObj = FCNShareData;
          break;

      case "OPTIONS":
          EQCShareNameObj = EQOShareData;
          break;

      case "BEN":
          EQCShareNameObj = BENShareData;
          break;

      case "AQDQ":
            EQCShareNameObj = DACShareData;
            break;

      case "ELN":
            EQCShareNameObj = ELNShareData;
            break; 
        
      case "TWINWIN":
            EQCShareNameObj = TwinWinShareData;
            break; 

      case "PHOENIX":
            EQCShareNameObj = PHXShareData;
            break; 
            
      case "DCN":
            EQCShareNameObj = DCNShareData;
            break;     
            
      case "BOOSTER":
            EQCShareNameObj = BoosterShareData;
            break; 
      case "SHARKFIN":
            EQCShareNameObj = SharkfinShareData;
            break;      
    }
    //END
    var flag = 0;
    var shareCodes = [];
    var shareCcy = [];
    // console.log("Shares autocomplete on ", id, " Src ", src);
    $(id).autocomplete({
      source: src === undefined ? EQCShareNameObj.map((item) => {
        return {
          label: item.LongName,
          value: item.Code,
          description:item.AdvisoryFlag
        };
      }
      ) : src.map((item) => {
        return {
          label: item.longName,
          value: item.shareCode,
          description:item.AdvisoryFlag
        };
      }
      ),
      sortResults: true,
      minLength: 1,
      scroll: true,
      autoFocus: true,
      response: function (event, ui) {
        // ui.content is the array that's about to be sent to the response callback.
        if (ui.content.length === 0) {
          slideNotification("#b34b3b", "No suggestions found");
          $(id).val(event.target.value);
          flag = 1;
        }
      },
      select: function (event, ui) {
        $("#bodyDiv").hide();
        // hide favourites before any autocomplete

        let shareName = ui.item.value;
        let advflag = ui.item.description;

        let tile = $(event.target).parents(".sorting")[0];
        let divId = $(event.target).parent().attr("id");

        createElementInBasket(tile, divId, shareName, "", advflag);

        flag = 0;
      },
      close: function (event, ui) {
        if (flag == 1)
          $(id).val(event.target.value);
        else
          $(id).val("");
      },
    });
  } catch (err) {
    console.log(err.message);
  } finally { }
}

function removeDiv(that) {
  //element remove from basket || Eshita K || 05-Sep-2019
  try {
    $(that).parent().remove();
    // Added by AniruddhaJ
  } catch (err) {
    console.log(err.message);
  }
}


//To Add a Currency Selection drop-down || Tina.K || 2-Dec-2019
//Added ELN Dropdown || Akash Y || 21st-Feb-2020
var CurrencyGlobalArray = [];
var Ccy_length;

function Currency_Selection_Drop_Down(currId) {
  try {
    thisTile = document.getElementById("td" + currId);

    if ($(thisTile).find('[id^="noteCCY"]')[0].value == "") {
      request_getDataFromAPI({
        strUserID: "HRRM2",
      }, clientConfigdata.CommonMethods.NodeServer + "getCurrencyDropDownELI").then((data) => {
        thisTile = document.getElementById("td" + currId);
        CurrencyGlobalArray = data.Get_CcyList_JSONResult;
        Ccy_length = CurrencyGlobalArray.length;
        var ddl = document.getElementById($(thisTile).find('[id^="noteCCY"]').attr("id"));
        //console.log(CurrencyGlobalArray)

        let unique = [...new Set(CurrencyGlobalArray.map((item) => item.Ccy)),];
        unique.sort();
        $(unique).each(function (i, n) {
          var option = document.createElement("option");
          option.text = n;
          option.value = n;
          ddl.add(option);
        });
        $(ddl)[0].selectedIndex = 12;
      }
      ).catch((error) => {
        console.log(error.message);
      }
      );
    }
  } catch (error) { }
}

function setControlvaluesFromExcel(jsonExcel, productSheetName) {
  try {
    var counter = -1;

    $("tr.removable>td.newlyCreated").each(function (index, mainTD) {
      if ($(mainTD).find("td.productName").text().trim().toUpperCase().includes(productSheetName.trim().toUpperCase()) || productSheetName.trim().toUpperCase().includes($(mainTD).find("td.productName").text().trim().toUpperCase())) {
        counter++;

        var s = jsonExcel[counter];
        var key, keys = Object.keys(s);
        var n = keys.length;

        var newobj = {};
        while (n--) {
          key = keys[n];
          newobj[key.toLowerCase()] = s[key];
        }

        $(mainTD).find("div.front>table>tbody>tr>td:first-child").each(function (i, td) {
          for (var t = 0; t < keys.length; t++) {
            if ($(td).text().trim().split("/").length > 1) {
              if (keys[t].toLowerCase().trim().includes($(td).text().trim().split("/")[0].toLowerCase().replace(/\r?\n|\r/g, "").replace(/\s/g, "")) || $(td).text().trim().split("/")[0].toLowerCase().replace(/\r?\n|\r/g, "").replace(/\s/g, "").includes(keys[t].toLowerCase().trim())) {
                if (!$(td).next().find("input").prop("disabled")) {
                  $(td).next().find("input").val(newobj[keys[t].toLowerCase()]);

                  if ($(td).next().find("select").length > 0) {
                    $(td).next().find("select").val(newobj[keys[t].toLowerCase()]);
                    $(td).next().find("select").trigger("change");
                  }

                  if ($($(td).next()).find("table").length > 0) {
                    $($(td).next().find("table>tbody>tr>td")[0]).find("select")[0].value = newobj[keys[t].toLowerCase()];

                    $($($(td).next().find("table>tbody>tr>td")[0]).find("select")[0]).trigger("change");
                  }
                }
              }
              if (keys[t].toLowerCase().trim().includes($(td).text().trim().split("/")[1].toLowerCase().replace(/\r?\n|\r/g, "").replace(/\s/g, "")) || $(td).text().trim().split("/")[1].toLowerCase().replace(/\r?\n|\r/g, "").replace(/\s/g, "").includes(keys[t].toLowerCase().trim())) {
                if (!$(td).next().next().find("input").prop("disabled")) {
                  $(td).next().next().find("input").val(newobj[keys[t].toLowerCase()]);
                }
              }
            } else if (keys[t].toLowerCase().trim().includes($(td).text().trim().toLowerCase().replace(/\r?\n|\r/g, "").replace(/\s/g, "")) || $(td).text().trim().toLowerCase().replace(/\r?\n|\r/g, "").replace(/\s/g, "").includes(keys[t].toLowerCase().trim())) {
              if (!$(td).next().find("input").prop("disabled")) {
                if ($(td).next().find("DIV").length > 0) {
                  //Basket control it is
                  fillBasket(newobj[keys[t].toLowerCase()], $(td).next().find("DIV")[0].id);
                } else {
                  if ($(td).next().find("input").hasClass("Underlying") || $(td).next().find("input").hasClass("pairsPopup")) {
                    // Share control it is

                    $(td).next().find("input").val(newobj[keys[t].toLowerCase()]);
                    $(td).next().find("input").trigger("select");
                    $(td).next().find("input").trigger("blur");
                    $(".popup").hide();
                    //call FillShares for ccy and exchange
                  } else {
                    //     $(td).next().find("input").val(newobj[keys[t].toLowerCase()]);

                    if ($(td).next().find("select").length > 0) {
                      $(td).next().find("select").val(newobj[keys[t].toLowerCase()]);
                      $(td).next().find("select").trigger("change");
                    } else {
                      $(td).next().find("input").val(newobj[keys[t].toLowerCase()]);
                    }
                  }
                }
              }
              if ($(td).find("table").length > 0) {
                $(td).next().find("input")[0].value = newobj[keys[t].toLowerCase()];
                $($(td).next().find("input")[0]).trigger("blur");
              } else {
                if ($(td).find("table").length > 0) {
                  $(td).next().find("input")[0].value = newobj[keys[t].toLowerCase()];
                  $($(td).next().find("input")[0]).trigger("blur");
                }
              }
            }
          }
        });
      }
    });
  } catch (error) {
    console.log(error.message);
    //  $("#lblinfo_upload").html('File Upload Failed..!');
  }
}

function ProcessExcel(data) {
  try {
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
      type: "binary",
    });

    //Fetch the name of First Sheet.
    for (var e = 0; e < workbook.SheetNames.length; e++) {
      var firstSheet = workbook.SheetNames[e];

      //Read all rows from First Sheet into an JSON array.
      var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
      console.log(excelRows);

      setControlvaluesFromExcel(excelRows, firstSheet);
    }

    $("#lblinfo_upload").html("File uploaded successfully..!");
  } catch (error) { }
}

//book trade popup
//Added by eshita khandelwal
function booktradePopup(btn, popup, msg, DivOverlay,errorType) {
  try {

    if(errorType === "S"){
      $("#" + popup + " span").css("color", "green");
    }else if(errorType === "E"){
      $("#" + popup + " span").css("color", "red");
    }

    $("#parentDiv span")

    $("#" + popup).find("#OrderPlaced").html('').html(msg);
    $("#" + popup)[0].style.display = "block";
    $("#" + popup).draggable();
    $("#" + DivOverlay + $("#" + popup)[0].id.match(/\d+$/)[0]).show();

  } catch (error) {
    console.log(error.message);
  }
}

//Added by eshita khandelwal
function booktradeclosepopup(that) {
  try {
    $("#" + "DivOverlay" + that.parentElement.parentElement.id.split("booktrade")[1]).hide();
    that.parentElement.parentElement.style.display = "none";
  } catch (error) {
    console.log(error.message);
  }
}

//#region share autocomplete and its ccy selection
function callautocomplete(tile, inputID, share) {
  try {

    let id = $(tile).find("[id^=" + inputID + "]")[0].id;
    
    //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
    let productname = $(tile).find(".productName").attr("id");

    if(productname=="AQDQ"){

        if ($(tile).find('[id^="Type"]').val().trim().toUpperCase() === "AQ") {
          productname = "AQ";
        }else{
          productname = "DQ";
        }

    }

    switch(productname.toUpperCase()){

      case "DRA":
          EQCShareNameObj = DRAShareData;
          break;

      case "FCN":
          EQCShareNameObj = FCNShareData;
          break;

      case "OPTIONS":
          EQCShareNameObj = EQOShareData;
          break;

      case "BEN":
          EQCShareNameObj = BENShareData;
          break;

      case "DQ":
            EQCShareNameObj = DACShareData;
            break;

      case "AQ":
            EQCShareNameObj = ACCShareData;
            break;

      case "ELN":
            EQCShareNameObj = ELNShareData;
            break;      
    
      case "TWINWIN":
            EQCShareNameObj = TwinWinShareData;
            break; 
  
      case "PHOENIX":
            EQCShareNameObj = PHXShareData;
            break; 
              
      case "DCN":
            EQCShareNameObj = DCNShareData;
            break;       
      case "BOOSTER":
            EQCShareNameObj = BoosterShareData;
            break;     
      case "SHARKFIN":
            EQCShareNameObj = SharkfinShareData;
            break;
    }
    //END
    data = EQCShareNameObj.filter(function (item) {
      return item["Code"] == share;
    });

    if ($(tile).find("select.ddlEQNoteCcy") != undefined) {
      $(tile).find("select.ddlEQNoteCcy").val(data[0]["Ccy"]);
      $(tile).find("select.ddlEQNoteCcy")[0].selectedValue = data[0]["Ccy"];
      
    }
// LGTGTWINT-1605 Instant Pricer : Text colour of Underlying names to be based on Advisory flag (Green for Yes, Red for No) | 03 March 2023

    // let productname = $(tile).find(".productName").attr("id") // Commented || LGTGTWINT-1567 || RizwanS || 20 Apr 2023

    if(productname.toUpperCase() == "AQ" || productname.toUpperCase() == "DQ" || productname.toUpperCase() =="OPTIONS" || productname.toUpperCase() == "ELN"){ // LGTGTWINT-1567  24 April 2023

      if(data[0]["AdvisoryFlag"] == "N"){

        $(tile).find('[id*="SharesDemo"]').removeClass("advYes");
        $(tile).find('[id*="SharesDemo"]').addClass("advNo");
  
      }else{
  
        $(tile).find('[id*="SharesDemo"]').removeClass("advNo");
        $(tile).find('[id*="SharesDemo"]').addClass("advYes");
  
      }

    }


    $("#" + id).autocomplete({
      source: EQCShareNameObj.map((item) => {
        return {
          label: item.LongName,
          value: item.Code
        };
      }
      ),
      sortResults: true,
      minLength: 1,
      scroll: true,
      autoFocus: true,
      select: function (event, ui) {
        // var input=ui.item.label.split(")")[0].split("(")[1];
        // console.log("input value :",input);
        $("#bodyDiv").hide();
        // hide favourites before any autocomplete
        let shareCode = ui.item.value;
        $("#" + id).val(shareCode);

        var temp = $("#" + id).parents(".sorting")[0];
        //fillShareValues(temp, ui.item.value, ui.item.label.split('|')[1].trim(), ui.item.label.split('|')[2].trim());
      
      //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
      let productname = $(tile).find(".productName").attr("id");

      if(productname=="AQDQ"){

        if ($(tile).find('[id^="Type"]').val().trim().toUpperCase() === "AQ") {
          productname = "AQ";
        }else{
          productname = "DQ";
        }

      }

      switch(productname.toUpperCase()){

        case "DRA":
            EQCShareNameObj = DRAShareData;
            break;

        case "FCN":
            EQCShareNameObj = FCNShareData;
            break;

        case "OPTIONS":
            EQCShareNameObj = EQOShareData;
            break;

        case "BEN":
            EQCShareNameObj = BENShareData;
            break;

        case "DQ":
              EQCShareNameObj = DACShareData;
              break;

        case "AQ":
              EQCShareNameObj = ACCShareData;
              break;

        case "ELN":
              EQCShareNameObj = ELNShareData;
              break; 

        case "TWINWIN":
              EQCShareNameObj = TwinWinShareData;
              break; 
    
        case "PHOENIX":
              EQCShareNameObj = PHXShareData;
              break; 

        case "DCN":
              EQCShareNameObj = DCNShareData;
              break;       
        case "BOOSTER":
              EQCShareNameObj = BoosterShareData;
              break;     
        case "SHARKFIN":
              EQCShareNameObj = SharkfinShareData;
              break;
       }
      //END
        data = EQCShareNameObj.filter(function (item) {
          return item["Code"] == shareCode;
        });

        if ($(temp).find("select.ddlEQNoteCcy") != undefined) {
          $(temp).find("select.ddlEQNoteCcy").val(data[0]["Ccy"]);
          $(temp).find('[id^="ShareCCY_ELN"]').val(data[0]["Ccy"]); // Added for LGTGTWINT-1598 | Chaitanya M | 01 Mar 2023
        }

         // LGTGTWINT-1605 Instant Pricer : Text colour of Underlying names to be based on Advisory flag (Green for Yes, Red for No) | 03 March 2023


        // let productname = $(tile).find(".productName").attr("id"); // Commented || LGTGTWINT-1567 || RizwanS || 20 Apr 2023

        if(productname.toUpperCase() == "AQ" || productname.toUpperCase() == "DQ" || productname.toUpperCase() =="OPTIONS" || productname.toUpperCase() == "ELN" ){ // LGTGTWINT-1567  24 April 2023
    
          if(data[0]["AdvisoryFlag"] == "N"){
    
            $(tile).find('[id*="SharesDemo"]').removeClass("advYes");
            $(tile).find('[id*="SharesDemo"]').addClass("advNo");
      
          }else{
      
            $(tile).find('[id*="SharesDemo"]').removeClass("advNo");
            $(tile).find('[id*="SharesDemo"]').addClass("advYes");
      
          }
    
        }

        return true;
        // setcurrency_exchangecurrency($("#" + id), $("#" + id)[0], "hdnCurrentExchangeCodeELN", "noteCCY_ELN");
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}
//#endregion

function fillShareValues(tile, code, ccy, ExchangeCode) {
  try {
    if ($(tile).find(".notionalCcy").prop("tagName") == "SELECT") {
      $(tile).find(".notionalCcy").val(ccy);
    } else {
      $(tile).find(".notionalCcy").html(ccy);
    }
    $(tile).find('[id^="hdnCurrentExchangeCode"]').val(ExchangeCode);
  } catch (error) { }
}

//Added By RizwanS // For Common Function to fetch FXD product details // JIRA -  // 04 Jul 2022

function getallFXDProductDeatils(FXDArray){

  try{
    
    let today = new Date();
    let day = today.getDate();
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let month = monthNames[today.getMonth()];
    let year = today.getFullYear();

    setBusinessDate = `${day}-${month}-${year}`;

    custName = clientConfigdata.FXDCommonMethods.Customer_Name;

    custID = clientConfigdata.FXDCommonMethods.CustID;

    //END

    for(ppdeatis of FXDArray){

      switch(ppdeatis.product_code.toUpperCase()){

        case "FXAQ":

          TemplateIDFXAQ = ppdeatis.Template_Id;
          TemplateCodeFXAQ = ppdeatis.Template_Code;
          productIDFXAQ = ppdeatis.Product_Id;
          ProductNameAQ = ppdeatis.Product_Name;
          productCodeAQ = ppdeatis.product_code;
          //Removed by RizwanS as calling this function from it's own payoff to avoid unwanted function calling on page load || LGTGTWINT-2322 || 22 Aug 2023
          CCYListFXAQ =  FXDccyPairList(productIDFXAQ,productCodeAQ);// added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
          
          break;

        case "FXDQ":

          TemplateIDFXDQ = ppdeatis.Template_Id;
          TemplateCodeFXDQ = ppdeatis.Template_Code;
          productIDFXDQ = ppdeatis.Product_Id;
          ProductNameDQ = ppdeatis.Product_Name;
          productCodeDQ = ppdeatis.product_code;
          //Removed by RizwanS as calling this function from it's own payoff to avoid unwanted function calling on page load || LGTGTWINT-2322 || 22 Aug 2023
          CCYListFXDQ =  FXDccyPairList(productIDFXDQ,productCodeDQ); // added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023          

          //END
        break;
        
        case "TEKO":

          TemplateIDTRFBuy = ppdeatis.Template_Id;
          TemplateCodeTRFBuy = ppdeatis.Template_Code
          productIDTRFBuy = ppdeatis.Product_Id;
          ProductNameFXTRFBuy = ppdeatis.Product_Name;
          productCodeTRFBuy = ppdeatis.product_code;
          //Removed by RizwanS as calling this function from it's own payoff to avoid unwanted function calling on page load || LGTGTWINT-2322 || 22 Aug 2023
          CCYListFXTRFBuy =  FXDccyPairList(productIDTRFBuy,productCodeTRFBuy);// added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023

        break;

        case "TARFSELL":

        TemplateIDTRFSell = ppdeatis.Template_Id;
        TemplateCodeTRFSell = ppdeatis.Template_Code
        productIDTRFSell = ppdeatis.Product_Id;
        ProductNameFXTRFSell = ppdeatis.Product_Name;
        productCodeTRFSell = ppdeatis.product_code;
        //Removed by RizwanS as calling this function from it's own payoff to avoid unwanted function calling on page load || LGTGTWINT-2322 || 22 Aug 2023
        CCYListFXTRFSell =  FXDccyPairList(productIDTRFSell,productCodeTRFSell);// added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
      
        //END

        break;
        
        case "PIVOT":

          TemplateIDFXPivot = ppdeatis.Template_Id;
          TemplateCodeFXPivot = ppdeatis.Template_Code
          productIDFXPivot = ppdeatis.Product_Id;
          ProductNamePivot = ppdeatis.Product_Name;
          productCodePivot = ppdeatis.product_code;
          //Removed by RizwanS as calling this function from it's own payoff to avoid unwanted function calling on page load || LGTGTWINT-2322 || 22 Aug 2023
          CCYListFXPivot = FXDccyPairList(productIDFXPivot,productCodePivot);  // added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023    

        break;

        case "STRADDLE":
          TemplateIDStraddle = ppdeatis.Template_Id;
          TemplateCodeStraddle = ppdeatis.Template_Code
          productIDStraddle = ppdeatis.Product_Id;
          ProductNameStraddle = ppdeatis.Product_Name;
          productCodeStraddle = ppdeatis.product_code;
          solveforStrategies.push("Straddle"); //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
          //Removed by RizwanS as calling this function from it's own payoff to avoid unwanted function calling on page load || LGTGTWINT-2322 || 22 Aug 2023
          CCYListStraddle = FXDccyPairList(productIDStraddle,productCodeStraddle);
        break;
        
        case "STRANGLE":
          TemplateIDStrangle = ppdeatis.Template_Id;
          TemplateCodeStrangle = ppdeatis.Template_Code
          productIDStrangle = ppdeatis.Product_Id;
          ProductNameStrangle = ppdeatis.Product_Name;
          productCodeStrangle = ppdeatis.product_code;
          solveforStrategies.push("Strangle");  //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
          //Removed by RizwanS as calling this function from it's own payoff to avoid unwanted function calling on page load || LGTGTWINT-2322 || 22 Aug 2023
          CCYListStrangle = FXDccyPairList(productIDStrangle,productCodeStrangle);
        break;
        
        case "RSKREV":
          TemplateIDRSKREV = ppdeatis.Template_Id;
          TemplateCodeRSKREV = ppdeatis.Template_Code
          productIDRSKREV = ppdeatis.Product_Id;
          ProductNameRSKREV = ppdeatis.Product_Name;
          productCodeRSKREV = ppdeatis.product_code;
          solveforStrategies.push("Risk Reversal");  //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
          //Removed by RizwanS as calling this function from it's own payoff to avoid unwanted function calling on page load || LGTGTWINT-2322 || 22 Aug 2023
          CCYListRSKREV = FXDccyPairList(productIDRSKREV,productCodeRSKREV);
        break;
        
        case "OPSPRD":
          TemplateIDOPSPRD = ppdeatis.Template_Id;
          TemplateCodeOPSPRD = ppdeatis.Template_Code
          productIDOPSPRD = ppdeatis.Product_Id;
          ProductNameOPSPRD = ppdeatis.Product_Name;
          productCodeOPSPRD = ppdeatis.product_code;
          solveforStrategies.push("Option Spread");  //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
          //Removed by RizwanS as calling this function from it's own payoff to avoid unwanted function calling on page load || LGTGTWINT-2322 || 22 Aug 2023
          CCYListOPSPRD = FXDccyPairList(productIDOPSPRD,productCodeOPSPRD);
        break;
        
        case "FXOPTION":
          TemplateIDFXVanilla = ppdeatis.Template_Id;
          TemplateCodeFXVanilla = ppdeatis.Template_Code
          productIDFXVanilla = ppdeatis.Product_Id;
          ProductNameFXVanilla = ppdeatis.Product_Name;
          productCodeFXVanilla = ppdeatis.product_code;
          //Removed by RizwanS as calling this function from it's own payoff to avoid unwanted function calling on page load || LGTGTWINT-2322 || 22 Aug 2023
          CCYListFXVanilla = FXDccyPairList(productIDFXVanilla,productCodeFXVanilla);
        break;
        
        case "FXBARRIER":
          TemplateIDFXBarrier = ppdeatis.Template_Id;
          TemplateCodeFXBarrier = ppdeatis.Template_Code
          productIDFXBarrier = ppdeatis.Product_Id;
          ProductNameFXBarrier = ppdeatis.Product_Name;
          productCodeFXBarrier = ppdeatis.product_code;
          //Removed by RizwanS as calling this function from it's own payoff to avoid unwanted function calling on page load || LGTGTWINT-2322 || 22 Aug 2023
          CCYListFXBarrier = FXDccyPairList(productIDFXBarrier,productCodeFXBarrier);
        break;
      
        case "FXDCI":
        prodID = productIDDCI;
        prodCode = productCodeDCI;
        break;
        
      }
  }

  }catch(er){

    console.log(er.message);

  }

}

function getasyncFXDLP(productID,productcode,exotic) { //LGTGTWINT-1252 Instant pricer Not Responding message

  try {

      if (exotic != undefined) {

        exoticLName = exotic;

      } else {

        exoticLName = "";

      }

      let getLP =  getSyncResponse( //LGTGTWINT-1252 Instant pricer Not Responding message
      { 
        "iEntityID": EntityID,
        "UserID": userName, 
        // New Header format additional parameters addtion by RizwanS for new header format in FXD for SCBUP // 20 Jul 2022
        "UserGroup": sessionStorage.getItem("FinIQGroupID").toString(),
        "Mode": "FXOSEN",
        "ProductId": productID, 
        "PricingMode": "AUTO",
        "RequestID": userName + 'PriceProviderDetails' +  RequestIDGenerator(4) + RequestIDGenerator(4),

      },clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/PriceProviderDetails"
      );

      let setLP = getLP;
      let LPArrayFXO = [];
      
      //Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 22 Aug 2023
      let SolveForLPArrayFXO =[]; 
      var l = setLP.length;
      for (i = 0; i < l; i++) {
        LPFXO = setLP[i].PP_Code;
        LPArrayFXO.push(LPFXO);
        if(setLP[i].PP_AllowSolveForStrike === "Y"){
          SolveForLPArrayFXO.push(LPFXO);
        }
      }

      LPArrayFXD = LPArrayFXO.toString().replace(/,/g, ":"); 
      SolveForLPArrayFXD = SolveForLPArrayFXO.toString().replace(/,/g, ":"); 
      LPListFXD = LPArrayFXD + "|" + SolveForLPArrayFXD;
      // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 22 Aug 2023

      return LPListFXD;

  } catch (error) {
      console.log(error.message
      );
  }

}
// added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
function FXDccyPairList(Prodct_id, Prodct_Code,RequestID){ // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
  try {

    let urlAPI = clientConfigdata.CommonMethods.NodeServer + "getstaticcontroldata/v1/GetStaticControlData/DB_Get_Tradable_Pair_Details"
    requestObject = {

      "iEntityID": EntityID,
      "iProductId": Prodct_id,
      "ProductCode": Prodct_Code,        
      "Mode": "FXOSEN",        
      "sAssetIdentifier" : "0",
      "FetchOnlyStandardPairs": "Y",
      "selectedDepoCcy" : "",
      "selectedAlternatCcy" : "",        
      "CcySearch" : "",
      "EntityID": EntityID, 
      "OptionCut":"BFIXTOK"
    }
    hash =  gethash(requestObject,urlAPI,"POST");

    $.ajax({
      async: false,
      crossDomain: true,
      type: "POST",
      url: urlAPI,
      data: JSON.stringify(requestObject),
      contentType: "application/json",
      headers:{
        'Authorization':"Bearer " + sessionStorage.getItem("nested_"),
        'hash': hash,
        "RequestID":RequestID // RizwanS || HSBCFXEINT-6 || 06 Nov 2023
      },
      dataType: "json",
      success: function (data) {

      let CCYFXResponse =  data;

      switch (Prodct_Code.toUpperCase()) {
        case "FXAQ":        
          let CCYListFXAQ = CCYFXResponse;
          sessionStorage.setItem("CCYListFXAQ", JSON.stringify(CCYListFXAQ));
            
          break
        case "FXDQ":
          let CCYListFXDQ =CCYFXResponse;
          sessionStorage.setItem("CCYListFXDQ", JSON.stringify(CCYListFXDQ));
          break          
        case "TEKO":
        
            let CCYListFXTRFBuy =CCYFXResponse;
            sessionStorage.setItem("CCYListFXTRFBuy", JSON.stringify(CCYListFXTRFBuy)); 
          break
        case "TARFSELL":
             let CCYListFXTRFSell =CCYFXResponse;
             sessionStorage.setItem("CCYListFXTRFSell", JSON.stringify(CCYListFXTRFSell)); 
          break
        case "PIVOT":
            let CCYListFXPivot =CCYFXResponse;
            sessionStorage.setItem("CCYListFXPivot",  JSON.stringify(CCYListFXPivot));
          break
        case "STRADDLE" :
          let CCYListStraddle =CCYFXResponse;
            sessionStorage.setItem("CCYListStraddle",  JSON.stringify(CCYListStraddle));
          break
        case "STRANGLE" :
          let CCYListStrangle =CCYFXResponse;
            sessionStorage.setItem("CCYListStrangle",  JSON.stringify(CCYListStrangle));
          break
        case "RSKREV" :
          let CCYListRSKREV =CCYFXResponse;
            sessionStorage.setItem("CCYListRSKREV",  JSON.stringify(CCYListRSKREV));
          break
        case "OPSPRD" :
          let CCYListOPSPRD =CCYFXResponse;
            sessionStorage.setItem("CCYListOPSPRD",  JSON.stringify(CCYListOPSPRD));
          break
        case "FXOPTION" :
          let CCYListFXVanilla =CCYFXResponse;
            sessionStorage.setItem("CCYListFXVanilla",  JSON.stringify(CCYListFXVanilla));
          break
        case "FXBARRIER" :
          let CCYListFXBarrier =CCYFXResponse;
            sessionStorage.setItem("CCYListFXBarrier",  JSON.stringify(CCYListFXBarrier));
          break

      }         
      },
    });
    
  } catch (error) {
    console.log(error.message);
  }
}

function getProductConfigsFXD(fxdproductID,fxdroductcode) { //LGTGTWINT-1934 FXD | Dynamic pricing on Instant pricer || RizwanS || 20 May 2023
  try { 

      request_getDataFromAPI({

        "LoginID": sessionStorage.getItem("Username"),
        // "ProductCode": fxdroductcode,
        // New Header format additional parameters addtion by RizwanS for new header format in FXD for SCBUP // 20 Jul 2022
        "EntityID": EntityID,
        "ProductID": fxdproductID,
        "requestID": userName + 'GetProductConfigs' +  RequestIDGenerator(4) + RequestIDGenerator(4)

      },clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/GetProductConfigs").then(data => {

          switch (fxdroductcode.toUpperCase()) {
            

              case "DEFAULT":

                  MaxQuoteTimeOutDefault = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MaxQuoteTimeOut')].Value;
                  MinQuoteTimeOutDefault = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ')].Value;
                 
                  break;

              case "FXAQ":

                  MaxQuoteTimeOutAQ = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MaxQuoteTimeOut')].Value; //LGTGTWINT-1934 FXD || RizwanS || 20 May 2023
                  MinQuoteTimeOutAQ = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ')].Value;//LGTGTWINT-1934 FXD || RizwanS || 20 May 2023
             
                  break;

              case "FXDQ":

                 MaxQuoteTimeOutDQ = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MaxQuoteTimeOut')].Value;//LGTGTWINT-1934 FXD || RizwanS || 20 May 2023
                 MinQuoteTimeOutDQ = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ')].Value;//LGTGTWINT-1934 FXD || RizwanS || 20 May 2023
              

                  break;

              case "PIVOT":

                 MaxQuoteTimeOutPivot = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MaxQuoteTimeOut')].Value;//LGTGTWINT-1934 FXD || RizwanS || 20 May 2023
                 MinQuoteTimeOutPivot = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ')].Value;//LGTGTWINT-1934 FXD || RizwanS || 20 May 2023

                  break;

              case "TEKO":

                 
                MaxQuoteTimeOutTEKO = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MaxQuoteTimeOut')].Value;//LGTGTWINT-1934 FXD || RizwanS || 20 May 2023
                MinQuoteTimeOutTEKO = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ')].Value;//LGTGTWINT-1934 FXD || RizwanS || 20 May 2023


                  break;

              case "TARFSELL":

                  MaxQuoteTimeOutTARFSELL = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MaxQuoteTimeOut')].Value;
                  MinQuoteTimeOutTARFSELL = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ')].Value;
                  
                  break;
              
              case "STRADDLE":
                MaxQuoteTimeOutSTRADDLE = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MaxQuoteTimeOut')].Value;
                MinQuoteTimeOutSTRADDLE = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ')].Value;
                

                break;

              case "STRANGLE":
                MaxQuoteTimeOutSTRANGLE = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MaxQuoteTimeOut')].Value;
                MinQuoteTimeOutSTRANGLE = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ')].Value;
                

                break;

              case "RSKREV":
                MaxQuoteTimeOutRSKREV = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MaxQuoteTimeOut')].Value;
                MinQuoteTimeOutRSKREV = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ')].Value;
               

                break;

              case "OPSPRD":
               
                MaxQuoteTimeOutOPSPRD = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MaxQuoteTimeOut')].Value;
                MinQuoteTimeOutOPSPRD = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ')].Value;
               
                break;

              case "FXOPTION":
               
                MaxQuoteTimeOutFXOPTION = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MaxQuoteTimeOut')].Value;
                MinQuoteTimeOutFXOPTION = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ')].Value;
               

                break;

              case "FXBARRIER":
                MaxQuoteTimeOutFXBARRIER = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MaxQuoteTimeOut')].Value;
                MinQuoteTimeOutFXBARRIER = data.dataFromAjax.Configs[data.dataFromAjax.Configs.findIndex(data => data.Setting_Name === 'BestPrice_MinQuoteTimeOutForFirstQuoteRFQ')].Value;
                
                break;

          }


      }).catch(error => { console.log(error.message); })

  } catch (error) {
      console.log(error.message);
      $(".lblError").html(error.message)
  }
}

//END


function test() {
  try {
    var arrayofjsonExcelObject = [];
    var jsonExcelObject = {};
    var temp_ = "";
    var strVal = "";
    $("tr.removable>td.newlyCreated").each(function (i, mainTD) {
      $(mainTD).find("table.MainTable>tbody>tr>td:first-child").each(function (i, td) {
        if ($(td).text().trim().split("/").length > 1) {
          if ($(td).next().prop("tagName") == "TD") {
            $(td).next().find("input[type='text'], input[type='search'], select,span,div").each(function (i, inp) {
              // if ($(td).next().hasClass("productName")) {
              //     strVal = $(td).next().text().trim() + " " + $(td).next().next().find("select").length > 0 ? $(td).next().next().find("select").val().trim() : $(td).next().text().trim();
              //   } else {
              if ($(inp).prop("tagName") == "SPAN") {
                if ($(inp).text().trim() != "%" && $(inp).text().trim() !== "bp") {
                  strVal = $(inp).text();
                }
              } else if ($(inp).prop("tagName") == "DIV") {
                $(inp).find(".sharesListName").each(function (i, e) {
                  strVal = strVal + " " + $(this).html().trim().replace("X", "");
                });
              } else {
                strVal = $(inp).val();
              }
              //   }
              if ($($(td).next()).find("table").length > 0) {
                strVal = $($(td).next().find("table>tbody>tr>td")[0]).find("select")[0].value.trim();
              }

              jsonExcelObject[$(td).text().trim().split("/")[0].replace(/\r?\n|\r/g, "").replace(/\s/g, "")] = strVal.replace(/\r?\n|\r/g, "");
            });
          }

          if ($(td).next().next().prop("tagName") == "TD") {
            $(td).next().next().find("input[type='text'], input[type='search'], select,span,div").each(function (i, inp) {
              //   if ($(td).next().hasClass("productName")) {
              //     strVal = $(td).next().text().trim() + " " + $(td).next().next().find("select").length > 0 ? $(td).next().next().find("select").val().trim() : $(td).next().text().trim();
              // } else {

              if ($(inp).prop("tagName") == "SPAN") {
                if ($(inp).text().trim() != "%" && $(inp).text().trim() !== "bp") {
                  strVal = $(inp).text();
                }
              } else if ($(inp).prop("tagName") == "DIV") {
                $(inp).find(".sharesListName").each(function (i, e) {
                  strVal = strVal + " " + $(this).html().trim().replace("X", "");
                });
              } else {
                strVal = $(inp).val();
              }

              //}
              jsonExcelObject[$(td).text().trim().split("/")[1].replace(/\r?\n|\r/g, "").replace(/\s/g, "")] = strVal.replace(/\r?\n|\r/g, "");
            });
          } else {
            jsonExcelObject[$(td).text().trim()] = $(td).next().text().trim();
          }
        } else {
          if ($($(td).next()).hasClass("productName")) {
            if ($($(td).next()).find("select").length > 0) {
              strVal = $(td).next().find("select").val().trim();
            } else if ($($(td).next()).find("input").length > 0) {
              strVal = $(td).next().find("input").val().trim();
            } else {
              temp_ = $(td).next().text().trim();
              strVal = $(td).next().next().find("select").length > 0 ? $(td).next().next().find("select").val().trim() : "";
              strVal = temp_ + " " + strVal;
            }
            jsonExcelObject[$(td).text().trim().replace(/\r?\n|\r/g, "").replace(/\s/g, "")] = strVal.replace(/\r?\n|\r/g, "");
          } else {
            $(td).next().find("input[type='text'], input[type='search'], select,span,div").each(function (i, inp) {
              strVal = "";

              if ($(inp).prop("tagName") == "SPAN") {
                if ($(inp).text().trim() != "%" && $(inp).text().trim() !== "bp") {
                  strVal = $(inp).text();
                }
              } else if ($(inp).prop("tagName") == "DIV") {
                $(inp).find(".sharesListName").each(function (i, e) {
                  strVal = strVal + " " + $(e).text().trim().replace(/\s/g, "").slice(0, -1);
                });
              } else {
                strVal = $(inp).val();
              }

              if (jsonExcelObject[$(td).text().trim().replace(/\r?\n|\r/g, "").replace(/\s/g, "")] == undefined) {
                if ($(td).find("table").length > 1) {
                  var tempProp = $($(td).find("table>tbody>tr>td")[0]).text().trim();
                  jsonExcelObject[tempProp.replace(/\r?\n|\r/g, "").replace(/\s/g, "")] = strVal.replace(/\r?\n|\r/g, "");
                } else
                  jsonExcelObject[$(td).text().trim().replace(/\r?\n|\r/g, "").replace(/\s/g, "")] = strVal.replace(/\r?\n|\r/g, "");
              } else { }
            });
          }
        }
      });

      $(mainTD).find("div.Divshadow>table").each(function (index, tableObj) {
        for (var p = 0; p < tableObj.rows[0].cells.length; p++) {
          jsonExcelObject[tableObj.rows[0].cells[p].innerText.trim()] = tableObj.rows[1].cells[p].innerText.trim();
        }
      });

      arrayofjsonExcelObject.push(jsonExcelObject);
      jsonExcelObject = {};
      temp_ = "";
      strVal = "";
    });

    // console.log(arrayofjsonExcelObject);
    exportToExcel(arrayofjsonExcelObject);
  } catch (error) {
    console.log(error.message);
  } finally { }
}

function exportToExcel(xlsRows) {
  try {
    var createXLSLFormatObj = [];
    var innerRowData = [];
    /* File Name */
    var filename = "CADB_" + $("#hiddenCurrentTemplate").html().trim() + ".xlsx";
    var wb = XLSX.utils.book_new();
    /* XLS Head Columns */
    //var xlsHeader = ["EmployeeID", "Full Name"];

    /* XLS Rows Data */
    var c = 0;
    var getMaxKeys = [];
    var maxIndex = 0;
    var bigrow = 0;
    for (var q = 0; q < xlsRows.length; q++) {
      getMaxKeys[q] = Object.keys(xlsRows[q]).length;
      maxIndex = Math.max(...getMaxKeys);
      if (maxIndex === Object.keys(xlsRows[q]).length)
        bigrow = q;
    }
    var xlsHeader = Object.keys(xlsRows[bigrow]);

    createXLSLFormatObj.push(xlsHeader);
    xlsRows.forEach((element) => {
      for (var i = 0; i < xlsHeader.length; i++) {
        innerRowData.push(element[xlsHeader[i]]);
      }

      createXLSLFormatObj.push(innerRowData);
      innerRowData = [];
    }
    );
    /* Sheet Name */
    var temp = $("tr.removable>td.newlyCreated");
    if ($(temp[c]).find("td.productName").find("select").length > 0) {
      var ws_name = $(temp[c]).find("td.productName").find("select")[0].value.trim();
      //+ "_" + c;
    } else {
      var ws_name = $(temp[c]).find("td.productName").text().trim();
      //+ "_" + c;
    }

    if (typeof console !== "undefined")
      console.log(new Date());

    var ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    createXLSLFormatObj = [];
    //     innerRowData = [];
    //   xlsHeader = [];
    //  c++;

    /* Write workbook and Download */
    if (typeof console !== "undefined")
      console.log(new Date());
    XLSX.writeFile(wb, filename);
    if (typeof console !== "undefined")
      console.log(new Date());
  } catch (error) {
    console.log(error.message);
  }
}
//#region to fill ccy dropdown for EQC products Added by AniruddhaJ
function EQProductsFillCcy(tile, dropdownList) {
  try {
    var ccyArray = [];
    //  let response = JSON.parse(data.responseData);
    let response = EQCurrencyList;

    if (response != null && response != "") {
      response.forEach((element) => {
        ccyArray.push(element.Ccy);
      }
      );

      fillDropdownlistControl(ccyArray, $(tile).find("[id^=" + dropdownList + "]").attr("id"));

      $(tile).find("[id^=" + dropdownList + "]")[0].value = "USD";
    }
  } catch (error) {
    console.log(error.message);
  }
}
//#endregion

function getExchangeAndCcyFromBasket(basketControl, exchangeCcyFlag, shareCode, CNSDSharesArray) {
  try {
    let res = [];
    if (CNSDSharesArray === undefined) {
      if (shareCode != undefined) {
        shareCode_ = shareCode.trim();

        if (exchangeCcyFlag == "exchange") {
          data = EQCShareNameObj.filter(function (item) {
            return item["Code"] == shareCode_;
          });
          // console.log(data);
          res.push(data[0]["ExchangeCode"]);
        } else if (exchangeCcyFlag == "ccy") {
          data = EQCShareNameObj.filter(function (item) {
            return item["Code"] == shareCode_;
          });
          // console.log(data);
          res.push(data[0]["Ccy"]);
        } else if (exchangeCcyFlag == "exchangename") {
          data = EQCShareNameObj.filter(function (item) {
            return item["Code"] == shareCode_;
          }); 
          res.push(data[0]["ExchangeName"]);
        }
      } else {
        //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
        let thistile = $(basketControl).parents(".sorting")[0];

        let productname = $(thistile).find(".productName").attr("id");

        if(productname=="AQDQ"){

          if ($(tile).find('[id^="Type"]').val().trim().toUpperCase() === "AQ") {
            productname = "AQ";
          }else{
            productname = "DQ";
          }
  
        }
  
        switch(productname.toUpperCase()){
  
          case "DRA":
              EQCShareNameObj = DRAShareData;
              break;
  
          case "FCN":
              EQCShareNameObj = FCNShareData;
              break;
  
          case "OPTIONS":
              EQCShareNameObj = EQOShareData;
              break;
  
          case "BEN":
              EQCShareNameObj = BENShareData;
              break;
  
          case "DQ":
                EQCShareNameObj = DACShareData;
                break;
  
          case "AQ":
                EQCShareNameObj = ACCShareData;
                break;
  
          case "ELN":
                EQCShareNameObj = ELNShareData;
                break;
          case "TWINWIN":
                EQCShareNameObj = TwinWinShareData;
                break; 
      
          case "PHOENIX":
                EQCShareNameObj = PHXShareData;
                break; 
                  
          case "DCN":
                EQCShareNameObj = DCNShareData;
                break; 
           case "BOOSTER":
                 EQCShareNameObj = BoosterShareData;
                 break;             
            case "SHARKFIN":
                EQCShareNameObj = SharkfinShareData;
                break;   
        }
       //END
        $(basketControl).find("span.sharesListName").each(function (i, span) {
          if (exchangeCcyFlag == "exchange") {
            let shareCode = $(span).text().trim().split(" ")[0].trim();

            data = EQCShareNameObj.filter(function (item) {
              return item["Code"] == shareCode;
            });
            console.log(data);
            res.push(data[0]["ExchangeCode"]);
          } else if (exchangeCcyFlag == "ccy") {
            let shareCode = $(span).text().trim().split(" ")[0].trim();

            data = EQCShareNameObj.filter(function (item) {
              return item["Code"] == shareCode;
            });
            console.log(data);
            res.push(data[0]["Ccy"]);
          } else if (exchangeCcyFlag == "share") {
            let shareCode = $(span).text().trim().split(" ")[0].trim();
            res.push(shareCode);
          } else if (exchangeCcyFlag == "exchangename") {
            data = EQCShareNameObj.filter(function (item) {
              return item["Code"] == shareCode_;
            }); 
            res.push(data[0]["ExchangeName"]);
          }
        });
      }
    } else {
      if (shareCode != undefined) {
        shareCode_ = shareCode.trim();

        if (exchangeCcyFlag == "exchange") {
          data = CNSDSharesArray.filter(function (item) {
            return item["shareCode"] == shareCode_;
          });
          //  console.log(data);
          res.push(data[0]["exchangeCode"]);
        } else if (exchangeCcyFlag == "ccy") {
          data = CNSDSharesArray.filter(function (item) {
            return item["shareCode"] == shareCode_;
          });
          // console.log(data);
          res.push(data[0]["ccy"]);
        } else if (exchangeCcyFlag == "exchangename") {
          data = EQCShareNameObj.filter(function (item) {
            return item["Code"] == shareCode_;
          }); 
          res.push(data[0]["ExchangeName"]);
        }
      } else {
        $(basketControl).find("span.sharesListName").each(function (i, span) {
          if (exchangeCcyFlag == "exchange") {
            let shareCode = $(span).text().trim().split(" ")[0].trim();
            data = CNSDSharesArray.filter(function (item) {
              return item["shareCode"] == shareCode;
            });
            //   console.log(data);
            res.push(data[0]["exchangeCode"]);
          } else if (exchangeCcyFlag == "ccy") {
            let shareCode = $(span).text().trim().split(" ")[0].trim();

            data = CNSDSharesArray.filter(function (item) {
              return item["shareCode"] == shareCode;
            });
            console.log(data);
            res.push(data[0]["ccy"]);
          } else if (exchangeCcyFlag == "share") {
            let shareCode = $(span).text().trim().split(" ")[0].trim();
            res.push(shareCode);
          } else if (exchangeCcyFlag == "exchangename") {
            data = EQCShareNameObj.filter(function (item) {
              return item["Code"] == shareCode_;
            }); 
            res.push(data[0]["ExchangeName"]);
          }
        });
      }
    }

    return res;
  } catch (error) {
    console.log(error.message);
  }
}

function createElementInBasket(tile, parentDivID, shareName, fromFavOrFromExcel, advFlag) {
  try {
    //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
    let productname = $(tile).find(".productName").attr("id");

    switch(productname.toUpperCase()){

      case "DRA":
          EQCShareNameObj = DRAShareData;
          break;

      case "FCN":
          EQCShareNameObj = FCNShareData;
          break;

      case "BEN":
          EQCShareNameObj = BENShareData;
          break;

      case "TWINWIN":
            EQCShareNameObj = TwinWinShareData;
            break; 

      case "PHOENIX":
            EQCShareNameObj = PHXShareData;
            break; 
            
      case "DCN":
            EQCShareNameObj = DCNShareData;
            break;       
      case "BOOSTER":
            EQCShareNameObj = BoosterShareData;
            break; 
      case "SHARKFIN":
            EQCShareNameObj = SharkfinShareData;
            break; 
    }
    //END
    let str = "";

    //LGTGTWINT-1723 || Default share adv flag check ||  Added by RizwanS || 14 Mar 2023
    if(advFlag == undefined){
      data = EQCShareNameObj.filter(function (item) {
        if(shareName == item["Code"]){
           advFlag = item["AdvisoryFlag"] ;
        }
      });
    }
    // END

    if (fromFavOrFromExcel) {
      //Added By AniruddhaJ for Basket Save || 24Sep2021 || CFINT - 1107

      str = str + '<span class="sharesListName" id="ctlShare_' + $("#" + parentDivID).find("span").length + '" readonly>' + shareName + '<span style="font-size:8px;" onclick="removeDiv(this)">&nbsp; X</span></span>';
      let temp = $(tile).find("[id^=" + parentDivID + "]").find("input[type='search']")[0];
      $(str).insertBefore(temp);
    } else {
      if ($(tile).find("[id^=" + parentDivID + "]").find(".sharesListName").length >= clientConfigdata.EQCCommonMethods.MaxSharesInBaskets) {


        setTimeout(function () {

          openValidationpopup(tile,`Can Not Select More Than ${clientConfigdata.EQCCommonMethods.MaxSharesInBaskets} Shares..`);

        }, 50);
  
        return false;
      } else {

// LGTGTWINT-1605 Instant Pricer : Text colour of Underlying names to be based on Advisory flag (Green for Yes, Red for No) | 03 March 2023


        if(advFlag == "N"){

          str = str + '<span class="sharesListName advNo" value="advNo"  id="ctlShare_' + $("#" + parentDivID).find("span").length + '" readonly>' + shareName + '<span style="font-size:8px;" onclick="removeDiv(this)">&nbsp; X</span></span>';
          let temp = $(tile).find("[id^=" + parentDivID + "]").find("input[type='search']")[0];
          $(str).insertBefore(temp);
          
        }else{
          str = str + '<span class="sharesListName advYes"  id="ctlShare_' + $("#" + parentDivID).find("span").length + '" readonly>' + shareName + '<span style="font-size:8px;" onclick="removeDiv(this)">&nbsp; X</span></span>';
          let temp = $(tile).find("[id^=" + parentDivID + "]").find("input[type='search']")[0];
          $(str).insertBefore(temp);

        }

      }
    }

    let $span = $(tile).find("span.sharesListName").eq(0);
    if ($span.length != 0) {
      let shareCode = $($span).text().trim().split(" ")[0].trim();

      data = EQCShareNameObj.filter(function (item) {
        return item["Code"] == shareCode;
      });

      if ($(tile).find("select.ddlEQNoteCcy") != undefined) {
        $(tile).find("select.ddlEQNoteCcy").val(data[0]["Ccy"]);
      }
    } else { }

    
  } catch (error) {
    console.log(error.message);
  }
}

function saveUnderlyings(tileObject, basket) {
  try {
    var productTile = $(tileObject).parents("td.sorting")[0];

    if (basket) {
      var basketList = "";

      for (var t = 0; t < $(productTile).find("span.sharesListName").length; t++) {
        basketList = basketList + $(productTile).find("span.sharesListName")[t].innerText.replace("X", "");
      }
      sessionStorage.setItem($(tileObject).parents("td.sorting")[0].id, basketList);
    } else {
      sessionStorage.setItem($(tileObject).parents("td.sorting")[0].id, $(productTile).find("input.ddlShares").val());
    }
  } catch (error) {
    console.log(error.message);
  }
}

function hideTileLoader(tile, loaderID) {
  try {
    $(tile).find("[id^=" + loaderID + "]").hide();
  } catch (error) {
    console.log("hideTileLoader", error);
  }
}

function showTileLoader(tile, loaderID) {
  try {
    $(tile).find("[id^=" + loaderID + "]").show();
  } catch (error) {
    console.log("showTileLoader", error);
  }
}

function calculateTenor(TileId1) {

  try {
    let UnderlyingCode = "";
    var _exchange = '';
    var _SettlementDays = '';

    var thisTile1 = document.getElementById("td" + TileId1);

    let _prodName = $(thisTile1).find("span.hiddenProductName").text().trim();

    if (_prodName === "AQDQ" || _prodName == undefined)
      return false;


      let tenorNumb = $(thisTile1).find(".ddlTenorEQProducts").val();
      let tenorstring = $(thisTile1).find("[id^='tenorddl']").val();
       _TenorValue = tenorNumb + tenorstring;


    if (_TenorValue === null || _TenorValue == '' || _TenorValue == undefined) {
      return false;
    }

    if ($(thisTile1).find("span.sharesListName").length > 0) {
      //Basket

      UnderlyingCode = $(thisTile1).find("span.sharesListName")[0].innerText.trim().split(" ")[0];

      if ($(thisTile1).find('.DIV_BASKET').length > 0)
        _exchange = getExchangeAndCcyFromBasket($(thisTile1).find('.DIV_BASKET')[0], 'exchange')[0];
      // consider first share exchange only

      _SettlementDays = $(thisTile1).find('[id^="SettlWeeks"]').val();

    } else if ($(thisTile1).find(".Underlying").length > 0) {
      //share

      UnderlyingCode = $(thisTile1).find(".Underlying")[0].value.trim();

      if ($(thisTile1).find('.DIV_SHARE').length > 0)
        _exchange = getExchangeAndCcyFromBasket("", "exchange", $(thisTile1).find('.DIV_SHARE')[0].value.trim())[0];

      _SettlementDays = $(thisTile1).find('[id^="SettlWeeks"]').val();
    }

    let tenorObject = {
      UnderlyingCode: UnderlyingCode,
      Tenor: _TenorValue,
      CurrentTileID: TileId1,
      I_UserID: sessionStorage.getItem("EQC_UserName").toString(),
      I_Entity_Id: sessionStorage.getItem("EQC_EntityID").toString(),
      "Exchange": _exchange,
      "Settlement_Days": _SettlementDays != undefined ? _SettlementDays : "",
      "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString()
    };

    console.log("tenor request ", tenorObject);
    let tenorResponse = getSyncResponse(tenorObject, clientConfigdata.CommonMethods.NodeServer + "calculateTenorEQC45");

    thisTile1 = document.getElementById("td" + tenorResponse.CurrentTileID);
    let dateObj = (tenorResponse["responseData"]);


    if (isNewTile) {
      $(thisTile1).find(".ddlTenorEQProducts").parent().next().html(reformatDate(dateObj[0]["MaturityDate"]));

      isNewTile = false;
    } else {
      $(thisTile1).find(".ddlTenorEQProducts").parent().next().html(reformatDate(dateObj[0]["MaturityDate"]));
    }
  } catch (error) {
    console.log(error.message);
  }
}

// To change tenor
function tenorChange(TileId) {
  try {


    let _currentTile = document.getElementById("td" + TileId);
    var _exchange = '';
    var _SettlementDays = '';

    $(_currentTile).find("div.card select.ddlTenorEQProducts,div.card Underlying").each(function (index, dropdownElement) {
      $(this).on("change select", function () {
        Tenor = $("option:selected", this).text();

        _currentTile = $(this).parents(".sorting")[0];
        if ($(_currentTile).find("span.sharesListName").length > 0) {

          UnderlyingCode = $(_currentTile).find("span.sharesListName")[0].innerText.trim().split(" ")[0];

          if ($(_currentTile).find('.DIV_BASKET').length > 0)
            _exchange = getExchangeAndCcyFromBasket($(_currentTile).find('.DIV_BASKET')[0], 'exchange')[0];

          _SettlementDays = $(_currentTile).find('[id^="SettlWeeks"]').val();

        } else if ($(_currentTile).find(".Underlying").length > 0) {
          UnderlyingCode = $(_currentTile).find(".Underlying")[0].value.trim();

          if ($(_currentTile).find('.DIV_SHARE').length > 0)
            _exchange = getExchangeAndCcyFromBasket("", "exchange", $(_currentTile).find('.DIV_SHARE')[0].value.trim())[0];

          _SettlementDays = $(_currentTile).find('[id^="SettlWeeks"]').val();
        }

        request_getDataFromAPI({
          Tenor: Tenor.toLocaleUpperCase(),
          UnderlyingCode: UnderlyingCode,
          CurrentTileID: TileId,
          I_UserID: sessionStorage.getItem("EQC_UserName").toString(),
          I_Entity_Id: sessionStorage.getItem("EQC_EntityID").toString(),
          "Exchange": _exchange,
          "Settlement_Days": _SettlementDays != undefined ? _SettlementDays : "",
          "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString()
        }, clientConfigdata.CommonMethods.NodeServer + "calculateTenorEQC45").then((data) => {
          console.log("tenor change called", data);

          _currentTile = document.getElementById("td" + data.CurrentTileID);

          if (data["responseData"] != "") {
            var dateObj = (data["responseData"]);
            $(_currentTile).find(".ddlTenorEQProducts").parent().next().empty();
            $(_currentTile).find(".ddlTenorEQProducts").parent().next().html(reformatDate(dateObj[0]["MaturityDate"]));


          }
        }
        ).catch((error) => {
          console.log(error.message);
        }
        );
      });
    });
  } catch (err) {
    console.log(err.message);
  }
}

function removeCommaAndDecimal($Object) {
  try {
    return $Object.toString().replace(/\,/g, "").split(".")[0];
  } catch (error) {
    console.log(error.message);
  }
}

//Selectall function for payoffs
function selectAllforlist(obj, Cname) {
  try {
    if (obj.checked == true) {
      $("." + Cname).each(function (i, j) {
        j.checked = true;
      });
    } else {
      $("." + Cname).each(function (i, j) {
        j.checked = false;
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

//Check/uncheck function for Instrument payoffs // 07 March 2022 // JIRA-INT1FIN47-421
function checkclick(Cname, Mname) {
  try {
    if ($("." + Cname + ":checked").length == $("." + Cname).length) {
      $("." + Mname).prop("checked", true);
    } else {
      $("." + Mname).prop("checked", false);
    }
  } catch (error) {
    console.log(error.message);
  }
}

//Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022

function checkDecimalAmt(commonfiled, thisTileFX) {
  try {
    if (commonfiled != "") {
      thisTileFX = $(commonfiled).parents(".sorting")[0];
    }

    productName = $(thisTileFX).find('[class^="hiddenProductName"]').html();

    let notionalddlId = "";
    let hdnpairDataId = "";
    let notioanlamtId = "";

    switch (productName.toUpperCase()) {
      case "FXAQ":
        notionalddlId = '[id^="CcySelectionFXAQ"]';
        hdnpairDataId = '[id^="hdnCcyPairDataAQ"]';
        notioanlamtId = '[id^="ContractAmtFXAQ"]';

        break;

      case "FXDQ":
        notionalddlId = '[id^="CcySelectionFXDQ"]';
        hdnpairDataId = '[id^="hdnCcyPairDataDQ"]';
        notioanlamtId = '[id^="ContractAmtFXDQ"]';

        break;

      case "FXOPTION":
        notionalddlId = '[id^="CcySelectionFXO"]';
        hdnpairDataId = '[id^="hdnCcyPairDataFXO"]';
        notioanlamtId = '[id^="ContractAmtFXO"]';

        break;

      case "FXTRF":
        notionalddlId = '[id^="CcySelectionFXTRF"]';
        hdnpairDataId = '[id^="hdnCcyPairDataTRF"]';
        notioanlamtId = '[id^="ContractAmtFXTRF"]';

        break;

      case "FXPIVOT":
        notionalddlId = '[id^="CcySelectionFXPivot"]';
        hdnpairDataId = '[id^="hdnCcyPairDataPivot"]';
        notioanlamtId = '[id^="ContractAmtFXPivot"]';

        break;

      case "STRATEGIES":
        notionalddlId = '[id^="CcySelectionFXStrategies"]';
        hdnpairDataId = '[id^="hdnCcyPairDataStrategies"]';
        notioanlamtId = '[id^="ContractAmtFXStrategies"]';

        break;
    }

    checkDecimalPlaces(thisTileFX, notionalddlId, hdnpairDataId, notioanlamtId);
  } catch (er) {
    console.log("checkDecimalAmt " + er.message);
  }
}

function checkDecimalPlaces(thisTileFX, notionalddlId, hdnpairDataId, notioanlamtId) {
  try {
    if ($(thisTileFX).find(notionalddlId).val() == JSON.parse($(thisTileFX).find(hdnpairDataId).val()).asset1) {
      if (JSON.parse($(thisTileFX).find(hdnpairDataId).val()).asset1_DecimalAmount == "0") {
        let tempnum = removeCommaAndDecimal($(thisTileFX).find(notioanlamtId).val());

        let newnum = numberWithOnlyCommas(tempnum);

        $(thisTileFX).find(notioanlamtId).val("");

        $(thisTileFX).find(notioanlamtId).val(newnum);
      } else {
        let newnum1 = $(thisTileFX).find(notioanlamtId).val();
        let tempNum = removeCommaAndDecimal(newnum1);
        let finalNum = Number(tempNum).toFixed(2);
        let strfinalNum = numberWithCommas(finalNum);

        $(thisTileFX).find(notioanlamtId).val("");

        $(thisTileFX).find(notioanlamtId).val(strfinalNum);
      }
    }

    if ($(thisTileFX).find(notionalddlId).val() == JSON.parse($(thisTileFX).find(hdnpairDataId).val()).asset2) {
      if (JSON.parse($(thisTileFX).find(hdnpairDataId).val()).asset2_DecimalAmount == "0") {
        let tempnum = removeCommaAndDecimal($(thisTileFX).find(notioanlamtId).val());

        let newnum = numberWithOnlyCommas(tempnum);

        $(thisTileFX).find(notioanlamtId).val("");

        $(thisTileFX).find(notioanlamtId).val(newnum);
      } else {
        let newnum1 = $(thisTileFX).find(notioanlamtId).val();
        let tempNum = removeCommaAndDecimal(newnum1);
        let finalNum = Number(tempNum).toFixed(2);
        let strfinalNum = numberWithCommas(finalNum);

        $(thisTileFX).find(notioanlamtId).val("");

        $(thisTileFX).find(notioanlamtId).val(strfinalNum);
      }
    }
  } catch (er) {
    console.log("error checkDecimalPlaces ", er.message);
  }
}

//END

//Added for ccy pair autocomlete / JIRA - FINGUI - 237 / 14 Feb 2022
function callCcyautocompleteFX(thisTileFX, inputID) {
  try {
    let id = $(thisTileFX).find("[id^=" + inputID + "]")[0].id;
    let FXDCurrList="";
    productName = $(thisTileFX).find('[class^="hiddenProductName"]').html();

    let prodID = "";
    let prodCode = "";

    switch (productName.toUpperCase()) {
      case "FXAQ":
        prodID = productIDFXAQ;
        prodCode = productCodeAQ;
        // added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
        FXDCurrList = sessionStorage.getItem("CCYListFXAQ");         
        _listCCyFXD = JSON.parse(FXDCurrList);
    
        break;

      case "FXDQ":
        prodID = productIDFXDQ;
        prodCode = productCodeDQ;
        // added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
        FXDCurrList = sessionStorage.getItem("CCYListFXDQ");
        _listCCyFXD = JSON.parse(FXDCurrList); 
        
        break;

      case "FXOPTION":
        if($(thisTileFX).find('[id^="FXO_Type"]').val() === "Vanilla"){
          prodID = productIDFXVanilla;
          prodCode = productCodeFXVanilla;   
          // added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
          FXDCurrList = sessionStorage.getItem("CCYListFXVanilla"); 
          _listCCyFXD = JSON.parse(FXDCurrList);      
          break;
          
        }else{
          prodID = productIDFXBarrier;
          prodCode = productCodeFXBarrier;
          // added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
          FXDCurrList = sessionStorage.getItem("CCYListFXBarrier"); 
          _listCCyFXD = JSON.parse(FXDCurrList); 
          break;
        }       

      case "FXTRF":
        prodID = productIDTRFBuy;
        prodCode = productCodeTRFBuy;  
        // added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
        FXDCurrList = sessionStorage.getItem("CCYListFXTRFBuy"); 
        _listCCyFXD = JSON.parse(FXDCurrList);        
        break;

      case "FXPIVOT":
        prodID = productIDFXPivot;
        prodCode = productCodePivot;
        // added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
        FXDCurrList = sessionStorage.getItem("CCYListFXPivot");
        _listCCyFXD = JSON.parse(FXDCurrList);       
        break;

      case "STRATEGIES":

        // Check Solve for || RijwanS || LGTGTWINT-1880  || 20 Jun 2023
        
        if ($(thisTileFX).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
          prodID = productIDStraddle;
          prodCode = productCodeStraddle;
          // added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
          FXDCurrList = sessionStorage.getItem("CCYListStraddle");
          _listCCyFXD = JSON.parse(FXDCurrList);

        } else if ($(thisTileFX).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
          prodID = productIDStrangle;
          prodCode = productCodeStrangle;
          // added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
          FXDCurrList = sessionStorage.getItem("CCYListStrangle");
          _listCCyFXD = JSON.parse(FXDCurrList);

        } else if ($(thisTileFX).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
          prodID = productIDRSKREV;
          prodCode = productCodeRSKREV;
          // added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
          FXDCurrList = sessionStorage.getItem("CCYListRSKREV");
          _listCCyFXD = JSON.parse(FXDCurrList);

        } else if ($(thisTileFX).find('[id^="SolveforFXStrategies"]').val() == "Option Spread"){

          prodID = productIDOPSPRD;
          prodCode = productCodeOPSPRD;
          // added for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
          FXDCurrList = sessionStorage.getItem("CCYListOPSPRD");
          _listCCyFXD = JSON.parse(FXDCurrList);
        }

        //END
   
        break;

      case "FXDCI":
        prodID = productIDDCI;
        prodCode = productCodeDCI;
        break;

      case "FXDIGITAL":
        prodID = productIDDigital;
        prodCode = productCodeDigital;
        break;
    }

    $("#" + id).autocomplete({
      minLength: 2,
      source: function (request, response) {
        hideccypopup(); // Added for hiding the ccypair popup on autocomplete | LGTGTWINT-687 | Chaitanya M | 17-jan-2023
            FXResponse = [];
            var indexFX = 0;

            $(_listCCyFXD).each(function (i, n) { // changed for ccy pair call onload.| LGTCLI-311 | Chaitanya M | 16 Feb 2023
              let ccyPair = n.asset_Pair.trim().toUpperCase();
              let trimedccyPair = ccyPair.replaceAll(" ", "");
              let withoutDashccyPair = trimedccyPair.replace("-", "");

              if (ccyPair.includes(request.term.toUpperCase().replaceAll(" ", "").replaceAll("-", "")) || withoutDashccyPair.includes(request.term.toUpperCase().replaceAll(" ", "").replaceAll("-", ""))) {
                FXResponse[indexFX] = n;
                indexFX++;
              }
            }); 

            response(FXResponse);
      },
      focus: function (event, ui) {
        return false;
      },
      select: function (event, ui) {
        $("#" + id).val(ui.item.asset_Pair);
        $("#" + id).focus().select();
        closeAllPopup();
        return false;
      },
    }).autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>").append("<div>" + item.asset_Pair + "</div>").appendTo(ul);
    }
      ;
  } catch (error) {
    console.log("error in callCcyautocompleteFX ", error);
  }
}

// Added by Atharva - Timers - START

// function to block prices buttons after trade has been booked.
function blockPriceButtons(tileId) {
  try {
    var thisTile = document.getElementById("td" + tileId);
    $(thisTile).find(".banksNameRow").children().each(function () {
      $(this).find("button").attr("disabled", true);
    });
    $(thisTile).find(".pricesRow").children().each(function () {
      $(this).find("button").attr("disabled", true);
    });
  } catch (error) {
    console.log(error.message);
  }
}

function startTimers(tileId) {
  try {
    var thisTile = document.getElementById("td" + tileId);
    // setting default value of selected price index to 0
    var itr = 0;
    $(thisTile).find('[id^="hdnPriceIndex"]').val("0");
    // $(thisTile).find('.banksNameRow').children().each(function() {
    //     banksIndex["td"+tileId][$(this).html()] = itr;
    //     itr++;
    // });
    // If any interval already exists delete it.
    if ("td" + tileId in myInterval) {
      clearInterval(myInterval["td" + tileId]);
      delete myInterval["td" + tileId];
    }
    clearPricesInterrupt["td" + tileId] = false;
    itr = 0;
    myInterval["td" + tileId] = setInterval(function () {
      // checking if clearPrices function is called.
      // if clearPrices called stop timers.
      if (clearPricesInterrupt["td" + tileId]) {
        // To stop timers if any input changes in tile.
        // Triggered from clearPrices function on changing value of clearPricesInterrupt
        if ("td" + tileId in myInterval) {
          clearInterval(myInterval["td" + tileId]);
          delete myInterval["td" + tileId];
        }
      } else {
        itr = 0;
        $(thisTile).find('[id*="TimerRow"]').children().each(function () {
          if (myCounter["td" + tileId][banksIndex["td" + tileId][itr]] > 0) {
            myCounter["td" + tileId][banksIndex["td" + tileId][itr]]--;
            $(this).html(myCounter["td" + tileId][banksIndex["td" + tileId][itr]]);
          }
          itr++;
        });
      }
      itr = 0;
      var countExpiredTimers = 0;
      $(thisTile).find(".pricesRow").children().each(function () {
        if (myCounter["td" + tileId][banksIndex["td" + tileId][itr]] <= 0) {
          $(this).find("button").attr("disabled", true);
          var pricesRowIndex = parseInt($(thisTile).find('[id^="hdnPriceIndex"]').val());
          if (pricesRowIndex == itr) {
            // disabling book trade button, if selected index timer expires.
            $(thisTile).find('[id*="BookTrade"]').attr("disabled", true);
            $(thisTile).find('[id*="BookReq"]').attr("disabled", true);
          }
          countExpiredTimers++;
        }
        itr++;
      });
      if (countExpiredTimers == $(thisTile).find('[id*="TimerRow"]').children().length) {
        // disabling book trade button if all timers expired
        $(thisTile).find('[id*="BookTrade"]').attr("disabled", true);
        $(thisTile).find('[id*="BookReq"]').attr("disabled", true);
        if ("td" + tileId in myInterval) {
          clearInterval(myInterval["td" + tileId]);
          delete myInterval["td" + tileId];
        }
        blockPriceButtons(tileId);
      }
    }, 1000);
  } catch (error) {
    console.log(error.message);
  }
}


function setPrice(that) {
  try {

    if(clientConfigdata.CommonMethods.NonbestpriceYN == "N"){

      return false;

    } //LGTGTWINT-1507 and LGTGTWINT-1512 FXD: Instant Pricer: Non Best LP selection should be blocked

    const str = that.id.split("_");
    var currentTileId = str[0];
    var pricesRowIndex = parseInt(str[1]);
    var thisTile = document.getElementById(currentTileId);
    var cnt = 0;
    // higlighting the border of the selected price and setting the border to zero of others.
    $(thisTile).find(".pricesRow").children().each(function () {
      $(this).removeClass("priceBackground");
      if (cnt == pricesRowIndex) {
        $(this).addClass("priceBackground");
      }
      cnt++;
    });
    cnt = 0;
    $(thisTile).find(".banksNameRow").children().each(function () {
      $(this).removeClass("priceBackground");
      if (cnt == pricesRowIndex) {
        $(this).addClass("priceBackground");
      }
      cnt++;
    });
    // Saving the index of selected price in the hidden id 'hdnPriceIndexFXO'. This id is later on used while booking the trade.
    $(thisTile).find('[id*="hdnPriceIndex"]').val(pricesRowIndex);
    if (myCounter[currentTileId][banksIndex[currentTileId][pricesRowIndex]] > 0) {
      $(thisTile).find('[id*="BookTrade"]').attr("disabled", false);
      $(thisTile).find('[id*="BookReq"]').attr("disabled", false);
    }
  } catch (error) {
    console.log(error.message);
  }
}

//#region Added by AniruddhaJ for EQProducts Order Confirm Details pop up

var maxNotional;
var minNotional;

function setOrderPopUpPosition(__tile) {
  try {
    let screenW = window.innerWidth;
    let screenH = window.innerHeight;
    let setTop = screenH / 3;
    let setLeft = screenW / 4;
    $(__tile).find(".orderConfirmPopUpEQC").css({
      top: setTop - 200 + "px",
      left: setLeft + "px"
    });
  } catch (error) {
    console.log(error.message);
  }
}

var _validateOrderEQC = false;

var orderConfirmationPopUp = (productName, button) => {
  try {

    checkdefaultException(); //LGTGTWINT-1954 || RizwanS || 03 May 2023

    let currentTile = $(button).parents("td.sorting")[0];


    //----------------------Added to check validations, if prices are recived on pricing grid for EQC Payoff's :: Start -------------------------||
    //------------------------------------------------------------------------------------------------------------------------------||
    let pricingRow = "";
    pricingRow = $(currentTile).find("table.pricerTable .pricesRow")[0];
    if (pricingRow.cells[0].innerText.trim().toString() === "-") {
        ValidateField($(currentTile).find('[id^="hdnChartPrices"]').attr("id"), "Invalid Price", currentTile);
        removeOverlayEQC(); // Added to remove overlay after invalid order booking request  || LGTGTWINT-423 || 01 Dec 2022 ||
        return false;
    }
    // on order double click validations added start 
    if ($(currentTile).find(".pricerTable")[0].rows[0].cells[0].innerText.trim() == "-" || $(currentTile).find(".pricerTable")[0].rows[0].cells[0].innerText.trim() == "") {
        ValidateField($(currentTile).find('[id^="hdnChartPrices"]').attr("id"), "Invalid Price", currentTile);
        removeOverlayEQC(); // Added to remove overlay after invalid order booking request  || LGTGTWINT-423 || 01 Dec 2022 ||
        return false;

    }
    //-------------------------------------------------------END---------------------------------------------------------------------||
    //------------------------------------------------------------------------------------------------------------------------------||



    //-----------------------LGTGTWINT-1279 : Instant Pricing : Order booking valdation's :: Start ---------------------------------------------||
    //------------------------------------------------------------------------------------------------------------------------------||
    switch(productName) {
      
      case "FCN":
                validateOrderFCN(currentTile,_validateOrderEQC);
        break;
      case "DRA":
                validateOrderDRA(currentTile,_validateOrderEQC);
        break;
      case "BEN":
                validateOrderBEN(currentTile,_validateOrderEQC);
          break;
      case "AQDQ":
                validateOrderAQDQ(currentTile,_validateOrderEQC);
          break;
      case "ELN":
                validateOrderELN(currentTile,_validateOrderEQC);
      break;
      case "OPTIONS":
              validateOrderOptions(currentTile,_validateOrderEQC);
      break;
      case "DCN":
        validateOrderDCN(currentTile,_validateOrderEQC);
      break;
      case "TwinWin":
        validateOrderTwinWin(currentTile,_validateOrderEQC);
      break;
      case "Phoenix":
        validateOrderPhoenix(currentTile,_validateOrderEQC);
      break;

      default:
       
    }
    if(_validateOrderEQC == true){

      _validateOrderEQC = false;

      return false;

    
    }//-------------------------------------------------------------END---------------------------------------------------------------||
    //------------------------------------------------------------------------------------------------------------------------------||

    addOverlayEQC();// Added to add overlay effect for valid order's


    //----------------------------------------clear previously opnened pop up values-----------------------------------------------||
    //-----------------------------------------------------------------------------------------------------------------------------||
    $(currentTile).find('[id^="txtHeaderNotional"]').val("");
    $(currentTile).find('[id^="txtAllocatedNotional"]').val("");
    $(currentTile).find('[id^="txtTotalNotional"]').val("");
    $(currentTile).find('[id^="errorMsgPanel"]').html(""); //LGTGTWINT-1124 Instant Pricing: Validation stickiness issue on order popup for all payoffs
   //-------------------------------------------------------------END----------------------------------------------------------------||
   //--------------------------------------------------------------------------------------------------------------------------------||



    //-------------------Changed the condition for Exceptional Order should be by default on order popup | Ref: LGTGTWINT-1081 |Chaitanya M | 18-Jan-2023----------||



    //---------------------Instant Pricing: Suitability Order should be selected by default on order popup for RM and IA: | LGTGTWINT-1481 | 24 Feb 2023

    if (isRM) { // Default exceptional reason to be displayed on order popup based on user group Ref: LGTGTWINT-1732 | Chaitanya M | 16 March 2023 

      if(EQCSendSuitabilityRequestYN === "NO"){ //RizwanS || LGTGTWINT-2295 || 11 Aug 2023

        $(currentTile).find('[id^="suitabilityRow"]').hide();
        $(currentTile).find('[id^="btnConfirm"]').val("Confirm");
        $(currentTile).find('[id^="btnConfirm"]').text("Confirm");
       
      }else{

        $(currentTile).find('[id^="suitabilityRow"]').show(); //RizwanS || LGTGTWINT-2295 || 11 Aug 2023

        if (!$(currentTile).find('[id^="rbRowSuitabilityToggle"]')[0].checked) { 
          $(currentTile).find('[id^="btnConfirm"]').val("Suitability");
          $(currentTile).find('[id^="btnConfirm"]').text("Suitability");
          $(currentTile).find('[id^="rbRowSuitabilityToggle"]')[0].checked = false; // LGTGTWINT-1183 : : Updated flag value for suitability 
          $(currentTile).find(".lblReason").each(function () {
            $(this).hide();
          });
          $(currentTile).find("tr.trSpecifyReason").hide();  // Added for Exceptional reason textbox | Ref:LGTGTWINT-603 |Chaitanya M | 18-Jan-2023
        } else {
          fillDropdownEQC(suitabilityReasons, $(currentTile).find('[id^="ddlReason"]').attr('id')); //LGTGTWINT-428 || 17 Jan 2023
          document.getElementById($(currentTile).find('[id^="ddlReason"]').attr('id')).selectedIndex = defaultReasonIndex; //LGTGTWINT-1954 || RizwanS || 03 May 2023
  
          $(currentTile).find('[id^="btnConfirm"]').val("Confirm");
          $(currentTile).find('[id^="btnConfirm"]').text("Confirm");
          $(currentTile).find('[id^="rbRowSuitabilityToggle"]')[0].checked = true; // LGTGTWINT-1183 : : Updated flag value for suitability 
          $(currentTile).find(".lblReason").each(function () {
            $(this).show();
          });
       
        }
      }
  
     }else {

      if(EQCSendSuitabilityRequestYN === "NO"){ //RizwanS || LGTGTWINT-2295 || 11 Aug 2023

        $(currentTile).find('[id^="suitabilityRow"]').hide();
        $(currentTile).find('[id^="btnConfirm"]').val("Confirm");
        $(currentTile).find('[id^="btnConfirm"]').text("Confirm");
       
      }else{

        $(currentTile).find('[id^="suitabilityRow"]').show(); //RizwanS || LGTGTWINT-2295 || 11 Aug 2023

        if ($(currentTile).find('[id^="rbRowSuitabilityToggle"]')[0].checked) { 

          $(currentTile).find('[id^="btnConfirm"]').val("Suitability");
          $(currentTile).find('[id^="btnConfirm"]').text("Suitability");
          $(currentTile).find('[id^="rbRowSuitabilityToggle"]')[0].checked = false; // LGTGTWINT-1183 : : Updated flag value for suitability 
          $(currentTile).find(".lblReason").each(function () {
            $(this).hide();
          });
          $(currentTile).find("tr.trSpecifyReason").hide();  // Added for Exceptional reason textbox | Ref:LGTGTWINT-603 |Chaitanya M | 18-Jan-2023
        } else {
  
           fillDropdownEQC(suitabilityReasons, $(currentTile).find('[id^="ddlReason"]').attr('id'));
           document.getElementById($(currentTile).find('[id^="ddlReason"]').attr('id')).selectedIndex = defaultReasonIndex; //LGTGTWINT-1954 || RizwanS || 03 May 2023
         
          $(currentTile).find('[id^="btnConfirm"]').val("Confirm");
          $(currentTile).find('[id^="btnConfirm"]').text("Confirm");
          $(currentTile).find('[id^="rbRowSuitabilityToggle"]')[0].checked = true; // LGTGTWINT-1183 : : Updated flag value for suitability 
          $(currentTile).find(".lblReason").each(function () {
            $(this).show();
          }); 
        }
      }
       
    }
     
   
   //--------------------------------------------------------------------END---------------------------------------------------------------------------------------||
   //--------------------------------------------------------------------------------------------------------------------------------------------------------------||



    //----------------------------------Set position of order popup and make it draggable :: Start-----------------------------------------------------------------||
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------||
    $(currentTile).find("div.orderConfirmPopUpEQC").draggable();
    setOrderPopUpPosition(currentTile); // set pop up position to center of screen here
    //---------------------------------------------------------------------END-------------------------------------------------------------------------------------||
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------||



    //-------------------------------------Order popup all on change events checks Start ---------------------------------------------------------------------------||
    $(currentTile).find('[id^="SuitabilityToggle"]').on("change", function () {
      try {
        if (!$(this).parents(".sorting").find('[id^="rbRowSuitabilityToggle"]')[0].checked) {
          $(currentTile).find('[id^="btnConfirm"]').val("Suitability");
          $(currentTile).find('[id^="btnConfirm"]').text("Suitability");
          $(currentTile).find(".lblReason").each(function () {
            $(this).hide();
          });
          $(currentTile).find("tr.trSpecifyReason").hide(); // Added for Exceptional reason textbox | Ref:LGTGTWINT-603 |Chaitanya M | 18-Jan-2023
          console.log("suitability");
        } else {

          fillDropdownEQC(suitabilityReasons, $(currentTile).find('[id^="ddlReason"]').attr('id')); //LGTGTWINT-428 || 17 Jan 202
          document.getElementById($(currentTile).find('[id^="ddlReason"]').attr('id')).selectedIndex = defaultReasonIndex; //LGTGTWINT-1954 || RizwanS || 03 May 2023

          $(currentTile).find('[id^="btnConfirm"]').val("Confirm");
          $(currentTile).find('[id^="btnConfirm"]').text("Confirm");
          $(currentTile).find(".lblReason").each(function () {
            $(this).show();
          });          

        }
      } catch (er) {
        console.log("error in SuitabilityToggle change ", er.message);
      }
    });

    $(currentTile).find('[id^="ddlOrderType"]').on("change", function () {
      try {
        if (this.value.trim().toUpperCase() === "LIMIT") {

          $(currentTile).find('[id^="txtLimitLevel"]').removeClass("orderinputFiled");
          $(currentTile).find('[id^="txtLimitLevel"]').addClass("limitInput");
          $(currentTile).find('[id^="txtLimitLevel"]').prop("disabled", false);
          $(currentTile).find('[id^="ddlLimitLevel"]').show();
           // LGTGTWINT-1633 |  Notional calculation logic incorrect on order pop up when order type is limit for Accu,Decu and Options |  Chaitanya M | 04 March 2023
          if (productName.toUpperCase() == "OPTIONS" || productName.toUpperCase() == "AQDQ" ){
        
            fillValuesToOtherNotional($(currentTile).find('[id^="txtHeaderNotional"]').val(), button,true); // Added for LGTGTWINT-1198 | Chaitanya M | 02 March 2023
    
          }  
        } else {
          $(currentTile).find('[id^="txtLimitLevel"]').removeClass("limitInput");
          $(currentTile).find('[id^="txtLimitLevel"]').addClass("orderinputFiled");
          $(currentTile).find('[id^="txtLimitLevel"]').val(""); // Added for Limit level to be reset to 0 on changing order type after entering limit price. | LGTGTWINT-1082 | Chaitanya M | 18 Jan 2023
          $(currentTile).find('[id^="txtLimitLevel"]').prop("disabled", true);
          $(currentTile).find('[id^="ddlLimitLevel"]').hide();
          $(currentTile).find('[id^="errorMsgPanel"]').html("");// Added for error message to be blank on ordertype change | LGTGTWINT-479 | Chaitanya M | 25 Jan 2023
          
          if (productName.toUpperCase() == "OPTIONS" || productName.toUpperCase() == "AQDQ" ){
        
            fillValuesToOtherNotional($(currentTile).find('[id^="txtHeaderNotional"]').val(), button,true); // Added for LGTGTWINT-1198 | Chaitanya M | 02 March 2023
    
          }
        }
      } catch (er) {
        console.log("error in order type change ", er.message);
      }
    });

    // LGTGTWINT-1633 |  Notional calculation logic incorrect on order pop up when order type is limit for Accu,Decu and Options |  Chaitanya M | 04 March 2023

    $(currentTile).find('[id^="txtLimitLevel"]').on("change", function () {

      if (productName.toUpperCase() == "OPTIONS" || productName.toUpperCase() == "AQDQ" ){
        
        fillValuesToOtherNotional($(currentTile).find('[id^="txtHeaderNotional"]').val(), button,true); // Added for LGTGTWINT-1198 | Chaitanya M | 02 March 2023

      }  
      
    });


    $(currentTile).find('[id^="ddlNONBEST"]').on("change", function () { //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

    
      if($(currentTile).find('[id^="ddlNONBEST"]').val() != "NONBEST_CUSTOM"){

        $(currentTile).find('[id^="txtNONBEST"]').hide();

       }else{
 
          $(currentTile).find('[id^="txtNONBEST"]').show();

      }

    });
    
    $(currentTile).find('[id^="txtClientYield"]').on("change", function () {  //Start LGTGTWINT-1112 Instant Pricing: Client Yield should get calculated on changing upfront on order popup for ELN

            let _cprice = "";

            let _ibprice = "";
            
            let TileID = currentTile.id.match(/\d+$/)[0];

            _cprice = getClientPrice(TileID,$(this).val());

            if(_cprice != ""){

              _ibprice =  $(currentTile).find('[id^="txtIBPrice"]').val();

              $(currentTile).find('[id^="txtClientPrice"]').val(_cprice); // client price
  
              $(currentTile).find('[id^="txtUpfront"]').val((Number(_cprice)-Number(_ibprice)).toFixed(2)); //upfront                 
              
            
            } 

    });

    $(currentTile).find('[id^="txtUpfront"]').on("change", function () {  //Start LGTGTWINT-1112 Instant Pricing: Client Yield should get calculated on changing upfront on order popup for ELN

            let _cprice = "";

            let _ibprice = "";

            let _cYiled = "";

            let _premium = "";

            let _clntpremium = "";

            let TileID = currentTile.id.match(/\d+$/)[0];

            if (productName.toUpperCase() == "OPTIONS"){ // Start LGTGTWINT-1659  Client Premium should be recalculated on updating upfront on order pop up for Options | chaitanya M | 4 March 2023

              _premium =  $(currentTile).find('[id^="txtPremium"]').val(); 

              _clntpremium = (Number(_premium) - Number($(this).val())).toFixed(4);

              $(currentTile).find('[id^="txtClientPremium"]').val(_clntpremium);    

            }else{

              _ibprice =  $(currentTile).find('[id^="txtIBPrice"]').val();

              $(currentTile).find('[id^="txtClientPrice"]').val((Number(_ibprice) + Number($(this).val())).toFixed(2)); //client price

              _cprice =  $(currentTile).find('[id^="txtClientPrice"]').val();

              _cYiled = getClientYield(TileID,_cprice);

              if(_cYiled != ""){

                $(currentTile).find('[id^="txtClientYield"]').val(_cYiled); //Yield

              }

            }

    });

    $(currentTile).find('[id^="txtNONBEST"]').on("change", function () {   // Clear Validation For Non - Best Price Reason:: Start ////LGTGTWINT-1123

          $(currentTile).find('[id^="errorMsgPanel"]').html("");

    });

    $(currentTile).find('[id^="txtSpecifyReason"]').on("change", function () {  // Clear Validation For Non - Best Price Reason:: Start ////LGTGTWINT-1123

        $(currentTile).find('[id^="errorMsgPanel"]').html("");

    });
    //-----------------------------------------------------------END------------------------------------------------------------------------------------------------||
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------||

   
 //-----------------------------------------------------EQC Order popup data binding Start :: ---------------------------------------------------------------------------------------------||
 //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||

    let clientYield = "";
    let RFQ_QUOTEREQID = "";
    let RES_OUT = "";
    let expiryDATE = "";
    let MaturityDATE = "";
    let Max_Notional = "";
    let Min_Notional = "";
    let COUNTERPARTY = "";
    let settlement_Date = "";
    let remark = "";
    let TradeDate = ""; 

    
    let p_Object = EQC_OrderConfirm[productName]["INPUTSET"];
    var saveButton = currentTile;

    console.log("object ", productName, p_Object);

    for (let p of Object.keys(p_Object)) {
      if ($(currentTile).find('[id^="' + p_Object[p] + '"]') != null && $(currentTile).find('[id^="' + p_Object[p] + '"]') != undefined) {
        var control = $(currentTile).find('[id^="' + p_Object[p] + '"]').length > 0 ? $(currentTile).find('[id^="' + p_Object[p] + '"]')[0] : "";
        if (p.toUpperCase().includes("ISSUER")) {
          if ($(currentTile).find("#order-confirm-" + productName.trim()).find('[id^="' + p + '"]').length > 0) {
            $(currentTile).find("#order-confirm-" + productName.trim()).find('[id^="' + p + '"]')[0].value = $($(currentTile).find(".pricerTable .banksNameRow")[0]).find(".priceBackground").text().trim();

            var bestpriceSelectedCP = ($(currentTile).find("#order-confirm-" + productName.trim()).find('[id^="' + p + '"]')[0].value = $($(currentTile).find(".pricerTable .banksNameRow")[0]).find(".priceBackground").text().trim());
          }
        } else if (p.includes("txtOptionTypeOPTIONS")) {
          if ($(currentTile).find('[id^="ddlOptions"]').length > 0) {
            let strBuySellOption = $(currentTile).find("[id^='rbRowbuySellToggleOption']")[0].checked ? "SELL" : "BUY";
            let optionTypeShowOnPopUp = strBuySellOption + " " + $(currentTile).find('[id^="ddlOptions"]').val();
            $(currentTile).find("[id^='txtOptionTypeOPTIONS']").val(optionTypeShowOnPopUp);
          }
        } else {
          if ($(currentTile).find("#order-confirm-" + productName.trim()).find('[id^="' + p + '"]').length > 0) {
            if ($(currentTile).find("#order-confirm-" + productName.trim()).find('[id^="' + p + '"]').prop("tagName") == "SPAN") {
              $(currentTile).find("#order-confirm-" + productName.trim()).find('[id^="' + p + '"]').html("(" + $(control).val() + ")");
            } else {
              $(currentTile).find("#order-confirm-" + productName.trim()).find('[id^="' + p + '"]').val($(control).val());
            }
          }
        }
      }
    }
    let pricedObject = JSON.parse($(currentTile).find('[id^="hdnChartPrices"]').val());

    console.log("priced object after pop up open  ", pricedObject);

    if ($(currentTile).find('[id^="txtIssuer"]').val() !== "") {
      // select yeild and LP of non best price
      let selectedNonBestPriceLP = $(currentTile).find('[id^="txtIssuer"]').val().trim();
      let selectedNonBestPriceArray = [];
      var RESPONSEOUT_NAME = "";
      // check what is response out name here start
      switch (productName) {
        case "ELN":
          RESPONSEOUT_NAME = "ELNOUT";
          break;
        case "FCN":
          RESPONSEOUT_NAME = "DRAOUT";
          break;
        case "DRA":
          RESPONSEOUT_NAME = "DRAOUT";
          break;
        case "AQDQ":
          RESPONSEOUT_NAME = "AccDecOUT";         
          break;
        case "OPTIONS":
          RESPONSEOUT_NAME = "EQOOUT";         
          break;
        case "BEN":
          RESPONSEOUT_NAME = "BENOUT";
          break;
        case "PHOENIX":
          RESPONSEOUT_NAME = "PhoenixOUT";
          break;
        case "DCN":
          RESPONSEOUT_NAME = "DCNOUT";
          break;
        case "TwinWin":
            RESPONSEOUT_NAME = "TwinwinOUT";
            break;
        case "Booster":
            RESPONSEOUT_NAME = "DRAOUT";
            break;  
        case "Sharkfin":
              RESPONSEOUT_NAME = "DRAOUT";
              break;          
      }

    //End

      for (let __OBJ of pricedObject) {
        if (__OBJ["PP_CODE"].trim().toUpperCase() === selectedNonBestPriceLP.toUpperCase()) {
          selectedNonBestPriceArray = __OBJ;
          clientYield = selectedNonBestPriceArray["ClientYield"];
          RFQ_QUOTEREQID = selectedNonBestPriceArray["EP_ER_QuoteRequestId"];
          RES_OUT = selectedNonBestPriceArray[RESPONSEOUT_NAME];
          expiryDATE = Date.parse(selectedNonBestPriceArray["ExpiryDate"]);
          MaturityDATE = Date.parse(selectedNonBestPriceArray["MaturityDate"]);
          Max_Notional = selectedNonBestPriceArray["MaxNotional"];
          Min_Notional = selectedNonBestPriceArray["MinNotional"];
          COUNTERPARTY = selectedNonBestPriceArray["PP_CODE"];
          settlement_Date = selectedNonBestPriceArray["SettlementDate"];
          remark = selectedNonBestPriceArray["Remark"];
          TradeDate = selectedNonBestPriceArray["TradeDate"];
        }
      }
    } else {
      // gather all best price  output values here
      clientYield = pricedObject[0]["ClientYield"];
      RFQ_QUOTEREQID = pricedObject[0]["EP_ER_QuoteRequestId"];
      RES_OUT = pricedObject[0][RESPONSEOUT_NAME];
      expiryDATE = Date.parse(pricedObject[0]["ExpiryDate"]);
      MaturityDATE = Date.parse(pricedObject[0]["MaturityDate"]);
      Max_Notional = pricedObject[0]["MaxNotional"];
      Min_Notional = pricedObject[0]["MinNotional"];
      COUNTERPARTY = pricedObject[0]["PP_CODE"];
      settlement_Date = pricedObject[0]["SettlementDate"];
      remark = pricedObject[0]["Remark"];
      TradeDate = pricedObject[0]["TradeDate"];
    }

    maxNotional = Max_Notional;
    minNotional = Min_Notional;

    //bind client yield and client premium to pop up controls
    if ($(currentTile).find('[id^="txtClientYield"]').length > 0) {
      $(currentTile).find('[id^="txtClientYield"]').val(clientYield);
    } else { }

    if ($(currentTile).find('[id^="txtClientPremium"]').length > 0) {

      let clientUpfrontForOptions = $(currentTile).find('[id^="txtUpfront"]').val(); // LGTGTWINT-2022 | Chaitanya M | 24 May 2023
      let clientPremOptions = 0;
      if ($(currentTile).find("[id^='rbRowbuySellToggleOption']")[0].checked)
        clientPremOptions = Number(Number(RES_OUT) - clientUpfrontForOptions).toFixed(4);
      else
        clientPremOptions = Number(Number(RES_OUT) + clientUpfrontForOptions).toFixed(4);
      $(currentTile).find('[id^="txtClientPremium"]').val(clientPremOptions);
    }

    //// bind solve for response value here to respesctive fields  start
    var GLOBAL_SOLVE_FOR = "";
    if ($(currentTile).find("div.card").find('[id*="solveFor"]').length > 0) {
      GLOBAL_SOLVE_FOR = $(currentTile).find("div.card").find('[id*="solveFor"]').val().trim().toUpperCase();
    } else {
      GLOBAL_SOLVE_FOR = $(currentTile).find("div.card").find('[id^="ddlSolveFor"]').val().trim().toUpperCase();
    }

    // LGTGTWINT-481 - Instant Pricing: Fields for DRA on order confirmation popup || 12 Dec 2022
    if (GLOBAL_SOLVE_FOR === "IB PRICE (%)" || GLOBAL_SOLVE_FOR === "IB PRICE(%)" || GLOBAL_SOLVE_FOR === "PRICE" || GLOBAL_SOLVE_FOR === "STRIKE (%)" || GLOBAL_SOLVE_FOR === "COUPON(%)" || GLOBAL_SOLVE_FOR === "COUPON (%)" || GLOBAL_SOLVE_FOR === "CONVERSION_STRIKE" || GLOBAL_SOLVE_FOR === "COUPON") { //LGTGTWINT-1095
      if ($(currentTile).find('[id^="txtClientPrice"]').length > 0)
        $(currentTile).find('[id^="txtClientPrice"]').val("100.00");
    }
    if (GLOBAL_SOLVE_FOR === "IB PRICE (%)" || GLOBAL_SOLVE_FOR === "IB PRICE(%)" || GLOBAL_SOLVE_FOR === "PRICE") {
      if ($(currentTile).find('[id^="txtIBPrice"]').length > 0)
        $(currentTile).find('[id^="txtIBPrice"]').val(RES_OUT);
    } else if (GLOBAL_SOLVE_FOR === "STRIKE (%)" || GLOBAL_SOLVE_FOR === "STRIKE(%)" || GLOBAL_SOLVE_FOR === "CONVERSION_STRIKE") {
      if ($(currentTile).find('[id^="txtStrike"]').length > 0)
        $(currentTile).find('[id^="txtStrike"]').val(RES_OUT);
    } else if (GLOBAL_SOLVE_FOR === "COUPON (%)" || GLOBAL_SOLVE_FOR === "COUPON(%)" || GLOBAL_SOLVE_FOR === "COUPON") {
      if ($(currentTile).find('[id^="txtCoupon"]').length > 0)
        $(currentTile).find('[id^="txtCoupon"]').val(RES_OUT);
    } else if (GLOBAL_SOLVE_FOR === "PREMIUM") {
      if ($(currentTile).find('[id^="txtPremium"]').length > 0)
        $(currentTile).find('[id^="txtPremium"]').val(RES_OUT);
    } else if (GLOBAL_SOLVE_FOR === "UPFRONT (%)") {
      if ($(currentTile).find('[id^="txtUpfront"]').length > 0)
        $(currentTile).find('[id^="txtUpfront"]').val(RES_OUT);
    } else if (GLOBAL_SOLVE_FOR === "KNOCK IN BARRIER (%)") {
      $(currentTile).find('[id^="txtKILevelPhoenix"]').val(RES_OUT);
    } else if (GLOBAL_SOLVE_FOR === "AUTOCALL BARRIER (%)") {
      $(currentTile).find('[id^="txtKOLevelPhoenix"]').val(RES_OUT);
    }

     //-----------------------------------------------------------------------------END---------------------------------------------------------------------------------------------||
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------||




    //--------------------------------------LGTGTWINT-483 - Instant Pricing: Settl. Days to be displayed as Settl. Weeks on order confirmation popup || 12 Dec 2022-------------||
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------||
    if ($(currentTile).find('[id^="txtSettlWeeks"]').length > 0){

      if($(currentTile).find('[id^="SettlWeeks"]').val() == "14"){

        $(currentTile).find('[id^="txtSettlWeeks"]').val("2W")

      } else if($(currentTile).find('[id^="SettlWeeks"]').val() == "7"){

        $(currentTile).find('[id^="txtSettlWeeks"]').val("1W")

      } else if($(currentTile).find('[id^="SettlWeeks"]').val() == "21"){

        $(currentTile).find('[id^="txtSettlWeeks"]').val("3W")

      }

    }
    //-----------------------------------------------------------------------------END---------------------------------------------------------------------------------------------||
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------||


  
    // -----------------------------------------------LGTGTWINT-540 - Instant Pricing: KO and KI type missing on order confirmation popup for notes :: Start---------------------------------||
    // --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||
    // For FCN/DRA
    if(productName == "FCN" || productName == "DRA"){

      if ($(currentTile).find('[id^="txtKOLevel"]').length > 0){

        let KOKIType = "";

        if(productName == "DRA"){

           KOKIType = $(currentTile).find('[id^="ddlDRAType"]').val();

        } else if(productName == "FCN"){

           KOKIType = $(currentTile).find('[id^="ddlKOKIType"]').val();

        }

        let KIlevel = $(currentTile).find('[id^="txtKILevel"]').val();

        let KOlevel = $(currentTile).find('[id^="txtKOLevel"]').val();

        if(KOKIType == "NOKIKODC"){

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel + " " + "Daily Close");
          $(currentTile).find('[id^="txtKILevel"]').val(KIlevel);

        } else if (KOKIType == "NOKIKOPE") {

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel + " " + "Period End");
          $(currentTile).find('[id^="txtKILevel"]').val(KIlevel);

        } else if (KOKIType == "KIDCKODC") {

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel + "" + "Daily Close");
          $(currentTile).find('[id^="txtKILevel"]').val(KIlevel + "" + "Day Close");

        }else if (KOKIType == "KIDCKOPE") {

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel + " " + "Period End");
          $(currentTile).find('[id^="txtKILevel"]').val(KIlevel + " " + "Day Close");

        }else if (KOKIType == "KIEURKODC") {

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel + " " + "Daily Close");
          $(currentTile).find('[id^="txtKILevel"]').val(KIlevel + " " + "European ");

        }else if (KOKIType == "KIEURKOPE") {

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel + " " + "Period End");
          $(currentTile).find('[id^="txtKILevel"]').val(KIlevel + " " + "European ");

        }else if (KOKIType == "KIDCNOKO") {

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel);
          $(currentTile).find('[id^="txtKILevel"]').val(KIlevel + " " + "Day Close ");


        }else if (KOKIType == "KIEURNOKO") {

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel);
          $(currentTile).find('[id^="txtKILevel"]').val(KIlevel + " " + "European");


        }else if (KOKIType == "NOKINOKO") {

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel);
          $(currentTile).find('[id^="txtKILevel"]').val(KIlevel);

        } else if (KOKIType == "NOKIKOPE") {

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel + " " + "Period End");

        }

      }

    }

    // For ELN
    if(productName == "ELN"){

      if ($(currentTile).find('[id^="txtKOLevel"]').length > 0){

        let KOType =  $(currentTile).find('[id^="ddlELNCFreq"]').val().trim().toUpperCase();

        let KOlevel = $(currentTile).find('[id^="txtKOLevel"]').val();

        if(KOType.includes("SIMPLE")){

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel);

        } else if(KOType.includes("INTRADAY")){

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel + " " + "Intraday");

        }else{

          $(currentTile).find('[id^="txtKOLevel"]').val(KOlevel + " " + "Day Close");

        }
      }
     
     //LGTGTWINT-1089 Instant Pricing: Client Price (%) missing on order popup for ELN
     
      if (GLOBAL_SOLVE_FOR === "IB PRICE (%)" || GLOBAL_SOLVE_FOR === "IB PRICE(%)"){

        let _ibprice =  $(currentTile).find('[id^="txtIBPrice"]').val();
        let _upfront = $(currentTile).find('[id^="txtUpfront"]').val();
        $(currentTile).find('[id^="txtClientPrice"]').val(parseFloat(_ibprice) + Number(_upfront));        

      }else{

        let _ibprice =  $(currentTile).find('[id^="priceELN"]').val();
        let _upfront = $(currentTile).find('[id^="txtUpfront"]').val();
        $(currentTile).find('[id^="txtClientPrice"]').val(parseFloat(_ibprice) + Number(_upfront));
        $(currentTile).find('[id^="txtIBPrice"]').val(parseFloat(_ibprice));

      }
    }

    // BEN
    if(productName == "BEN"){

      $(currentTile).find('[id^="txtupfrontVal"]').prop('disabled', true); // LGTGTWINT-1184 Instant Pricing: BEN: Upfront should not be editable on order popup

      if ($(currentTile).find('[id^="txtKILevel"]').length > 0){

        let KIType =  $(currentTile).find('[id^="ddlBENType"]').val();

        let KIlevel = $(currentTile).find('[id^="txtKILevel"]').val();

        if(KIType.includes("Vanilla")){

          $(currentTile).find('[id^="txtKILevel"]').val(KIlevel);

        } else if(KIType.includes("European")){

          $(currentTile).find('[id^="txtKILevel"]').val(KIlevel + " " + "European");

        }
      }
    }

    //-----------------------------------------------------------------------------END----------------------------------------------------------------------------------------------------------||
    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||
   

   //---------------------------------------------LGTGTWINT-542 - Instant Pricing: Coupon Frequency not reflected on order confirmation popup FCN/DRA || 13 Dec 2022 ---------------||
   //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------||
    if(productName == "FCN" || productName == "DRA"){  

      if ($(currentTile).find('[id^="txtKOLevel"]').length > 0){

        let  couponFrq = $(currentTile).find('[id^="ddlCouponFrequency"]').val().toUpperCase();

        let  couponlevel = $(currentTile).find('[id^="txtCoupon"]').val();

        if(couponFrq.includes("MONTHLY")){

          $(currentTile).find('[id^="txtCoupon"]').val(couponlevel + " " + couponFrq);

        } else if(couponFrq.includes("BIMONTHLY")){

          $(currentTile).find('[id^="txtCoupon"]').val(couponlevel + " " + couponFrq);


        } else if(couponFrq.includes("QUARTERLY")){

          $(currentTile).find('[id^="txtCoupon"]').val(couponlevel + " " + couponFrq);

        }else if(couponFrq.includes("SEMIANNUALLY")){

          $(currentTile).find('[id^="txtCoupon"]').val(couponlevel + " " + couponFrq);

        }else if(couponFrq.includes("ANNUALLY")){

          $(currentTile).find('[id^="txtCoupon"]').val(couponlevel + " " + couponFrq);

        }

      }

      // LGTGTWINT-1095 - Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for FCN and DRA

    if (GLOBAL_SOLVE_FOR === "IB PRICE (%)" || GLOBAL_SOLVE_FOR === "IB PRICE(%)" || GLOBAL_SOLVE_FOR === "PRICE"){

        let _ibprice =  $(currentTile).find('[id^="txtIBPrice"]').val();
        $(currentTile).find('[id^="txtupfrontVal"]').val(parseFloat(Number(100-(_ibprice))).toFixed(2));

      }

    } 
   //-----------------------------------------------------------------------------END------------------------------------------------------------------------------------------------||
   //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------||


    //------------------------------------------ LGTGTWINT-1142 Instant Pricing: ACCU and DECU: Guarantee should be displayed as 6 Settlement Periods on order popup ::Strt--------------||
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||
    if(productName == "AQDQ"){

      let getProductName = "";
      if ($(currentTile).find('[id^="Type"]').length > 0) {
        // This is for AQDQ
        var temp = $(currentTile).find('[id^="Type"]').val().trim();
  
        if (temp == "AQ") {
          getProductName = "Accumulator";
        } else {
          getProductName = "Decumulator";
        }
        $(currentTile).find('.productNameHeader').empty().append("You are placing an order for " + getProductName);
  
      }

      let _aqdqGaurantee = $(currentTile).find('[id^="ddlGaurantee"]').val();

      $(currentTile).find('[id^="txtGaurantee"]').val(_aqdqGaurantee + "  " + "Settlement Periods");

    }
    //-----------------------------------------------------------------------------END------------------------------------------------------------------------------------------------------||  
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||  


  //-------------------------------------------------LGTGTWINT-1080 Instant Pricing: Tenor Type missing in Tenor field on order popup for all payoffs  :: Start---------------------------------------||
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||
  let _tenorStr = "";
  let _tenorNumb ="";
  _tenorNumb = $(currentTile).find('[id^="tenor_"]').val();
  if($(currentTile).find('[id^="tenorddl"]').val().includes("M")){
    _tenorStr = "Month"
  }else{
    _tenorStr = "Year"
  }
  $(currentTile).find('[id^="txtTenorl"]').val(_tenorNumb + " " + _tenorStr);
  //--------------------------------------------------------------------------END--------------------------------------------------------------------------------------------------------------------||
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||


    //---------------------------------------------------------Bind min/max limit for selected issuers on UI :: Start--------------------------------------------------------------------------------||
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||
    $(currentTile).find('[id^="minLimit"]').text(formatMinMaxNotional(minNotional));
    $(currentTile).find('[id^="maxLimit"]').text(formatMinMaxNotional(maxNotional));
    //---------------------------------------------------------------------------END--------------------------------------------------------------------------------------------------------------------||
    //---------------------------------------------------------------------------END--------------------------------------------------------------------------------------------------------------------||



   //--------------------------------------------------------Fill Non Best PriceReasons Reasons :: Start ---------------------------------------------------------------------------------||
   //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||
    if (pricedObject[0]["PP_CODE"].toUpperCase() === bestpriceSelectedCP.toUpperCase()) {
      //
      //if counter party is not best PP then hide non best price reason
      $(currentTile).find(".TRNONBESTPRICE_REASON").each(function () {
        $(this).hide();
      });
    } else {
      $(currentTile).find(".TRNONBESTPRICE_REASON").each(function () {
        $(this).show();

        fillNonBestPriceReasons(NonBestPriceReasons, $(currentTile).find('[id^="ddlNONBEST"]').attr('id')); //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

      });
    }
    //-------------------------------------------------------------------------------END------------------------------------------------------------------------------------------------------||
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||



   //--------------------------------------------------------Bind limit level :: Start ---------------------------------------------------------------------------------||
   //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||
    if (productName == "FCN" || productName == "DRA" || productName == "PHOENIX" || productName == "BEN") {
      // get basket shares
      var underlyingBasketList = "";
      $(currentTile).find(".sharesListName").each(function (index, elem) {
        if (index == $(currentTile).find(".sharesListName").length - 1) {
          // underlyingBasketList = underlyingBasketList + $(this).text();
             underlyingBasketList  = underlyingBasketList + $(this).text().slice(0,-1).trim();  // Changed by RizwanS || LGTGTWINT-1854 Instant Pricing: EQC payoff's share code including "X" on order popup not visible. || 06 Apr 2023
        } else {
          // underlyingBasketList = underlyingBasketList + $(this).text() + ", ";
             underlyingBasketList =  (underlyingBasketList + $(this).text().split(" ")[0]).trim() + ", "; // Changed by RizwanS || LGTGTWINT-1854 Instant Pricing: EQC payoff's share code including "X" on order popup not visible. || 06 Apr 2023
           
        }
      });

       $(currentTile).find('[id^="txtUnderlying"]').val(underlyingBasketList);  // Changed by RizwanS || LGTGTWINT-1854 Instant Pricing: EQC payoff's share code including "X" on order popup not visible. || 06 Apr 2023
       bindDataToLimitlevelddl(currentTile, underlyingBasketList);  // Changed by RizwanS || LGTGTWINT-1854 Instant Pricing: EQC payoff's share code including "X" on order popup not visible. || 06 Apr 2023

    } else {

      bindDataToLimitlevelddl(currentTile, $(currentTile).find('[id^="txtUnderlying"]').val().trim());
   
    }
    //-------------------------------------------------------------------------------END------------------------------------------------------------------------------------------------------||
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||


    //-------------------------------------------------------------Binding the Notional and No of shares --------------------------------------------------------------------------------------||
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||
    if (productName == "FCN" || productName == "DRA" || productName == "PHOENIX" || productName == "BEN" || productName == "ELN" ) { 

      fillValuesToOtherNotional($(currentTile).find('[id^="ContractAmt"]').val(), button,false,"YES","ContractAmt"); // Added for LGTGTWINT-1097 | Chaitanya M | 01 March 2023 

    } else {
    
      fillValuesToOtherNotional($(currentTile).find('[id^="NoOfShareipbox"]').val(), button,true,"YES","NoOfShareipbox"); // Added for LGTGTWINT-1198 | Chaitanya M | 02 March 2023
    }
    //-------------------------------------------------------------------------------END------------------------------------------------------------------------------------------------------||
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------||


    //LGTGTWINT-1910 | Change default mode to Physical settlement instead of cash settlement - OPtions | Chaitanya M | 25 Apr 2023 

    if (productName == "OPTIONS" ) { 

      $(currentTile).find('[id^="txtSettlementOPTIONS"]').val("Physical");

    }

    // ENd

    $(currentTile).find('[id^="ChildrenddlBookingCenter"]').prop("disabled", true);  // Added for LGTGTWINT-1628 | Multiple is displayed under Booking Center on order popup   | Chaitanya M | 3 March 2023

    $(currentTile).find(".orderConfirmPopUpEQC").show(); // Open order confrimation popup :: Start

    GetEQC_OrderTypes(saveButton);
    Get_RMListWithBook(saveButton);

    return true;

  } catch (error) {
    console.log("orderConfirmationPopUp", error.message);
  }
}


function bindDataToLimitlevelddl(currentTile, selectedShares) {
  try {
    let selectedSharesArray = [];
    selectedSharesArray = selectedShares.split(",");
    let option = '';
    for (i = 0; i < selectedSharesArray.length; i++) {
      option += '<option value="' + selectedSharesArray[i] + '">' + selectedSharesArray[i] + '</option>';
    }
    $(currentTile).find('[id^="ddlLimitLevel"]').empty().append(option);
  } catch (error) {
    console.log(error.message);
  }
}

function formatMinMaxNotional(_notional) {
  try {
    var val = Math.round(Number(_notional) * 100) / 100;
    var parts = val.toString().split(".");
    var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    return num;
  } catch (error) {
    console.log(error.message);
  }
}

function addAllocation(_this) {
  try {
    currentTile = $(_this).parents("td.sorting")[0];
    let table = $(currentTile).find("table.tblRMDetails")[0];

    if((table.rows.length ) <= 10){ // LGTGTWINT-1625 | Limit allocation row count to 10 on order popup | Chaitanya M | 03 March

      let clonedRow = $(table.rows[1]).clone();
      $(clonedRow).addClass('clonedDynamicRow');

    $(clonedRow).find('input[type="text"], select').each(function (index, control) {
      //Added by AniruddhaJ LGTGTWINT-524 || 5Dec2022
      if ($(control).prop("tagName").toUpperCase() == "SELECT")
        control.selectedIndex = -1;
      else
        $(control).val("");

    });

      clonedRow.insertAfter(table.rows[table.rows.length - 1]);
      $(currentTile).find('[id^="ddlBookingCenter"]').val($(currentTile).find('[id^="ddlBookingBranch"]').val());

    }else{
      $(currentTile).find('[id^="errorMsgPanel"]').html("Cannot allocate order to more than 10 records.");
    }
    
  } catch (error) {
    console.log(error.message);
  }
}

function ConfirmDeal(productName, btnObj, isNoOfSharesAdded) {
  try {

    let currentTile = $(btnObj).parents("td.sorting")[0];

    $(currentTile).find('[id^="errorMsgPanel"]').html("");
  

    // -----------------------------Commmon Validation's for EQC payoff's for order placement Start || 01 Feb 2023 ---------------------------------------- //
    //------------------------------------------------------------------------------------------------------------------------------------------- //

    // Validation For Booking Branch :: Start
      if ($(currentTile).find('[id^="ddlBookingBranch"]').val() == "" || $(currentTile).find('[id^="ddlBookingBranch"]').val() == null  ) {
              // openValidationpopup(currentTile,"Cannot proceed with order. Please select booking branch");
              $(currentTile).find('[id^="errorMsgPanel"]').html("Cannot proceed with order. Please select booking branch");
              return false;
      } 
      

    // Validation For ELN upfront check :: Start
      if(productName == "ELN"){
          if ((parseFloat($(currentTile).find('[id^="txtUpfront"]').val()) <= 0 || parseFloat($(currentTile).find('[id^="txtUpfront"]').val()) > Number(ELNMaxUpfront))) {
            $(currentTile).find('[id^="errorMsgPanel"]').html("Upfront (%) should be greater than 0 and less than" + " " + Number(ELNMaxUpfront));
            return false;
           }
     }
        // Validation For Order Type :: END

   // Validation For Order Type :: Start
    if ($(currentTile).find('[id^="ddlOrderType"]')[0].value.trim() === "" || $(currentTile).find('[id^="ddlOrderType"]')==null) {
      // openValidationpopup(currentTile,"Please Select Order Type");
      $(currentTile).find('[id^="errorMsgPanel"]').html("Please Select Order Type");
      return false;
    }
    // Validation For Order Type :: END

    
    // Validation For Limit Price :: Start

    var limitLevel = $(currentTile).find('[id^="txtLimitLevel"]').val(); // LGTGTWINT-479 | Instant Pricing: Limit Price to be rounded upto 4 decimals on order confirmation popup | Atharva A
    // Limit Price validation to be displayed on order confirmation popup. | LGTGTWINT-1466| Chaitanya M | 24 Feb 2023
    if($(currentTile).find('[id^="ddlOrderType"]')[0].value.trim().includes("Limit")){
       if(limitLevel == "" ||limitLevel == null || limitLevel <=0){ 
      $(currentTile).find('[id^="errorMsgPanel"]').html("Please enter limit price.");
      return false;
      }      
    }
    
    var limitLevelSplit = limitLevel.split(".");

    if(limitLevelSplit.length >= 2 && limitLevelSplit[1].length > 4) {
      return false;
    }
    
    // Validation For Limit Price :: END


    // validation for comments as per login user group :: start
   // LGTGTWINT-149 Instant Pricing : Comment should be mandatory on order pop up for RM and IA usergroups

   // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023 
    if (isRM || isIA) { //LGTGTWINT-1954 || RizwanS || 03 May 2023
      
      if($(currentTile).find('[id^="txtComment"]').val() == ""){

        $(currentTile).find('[id^="errorMsgPanel"]').html("Please enter a valid comment.");
        return false;

      }
    }
    //END


    // Validation For Non - Best Price Reason:: Start
    if($(currentTile).find('[id^="ddlNONBEST"]').val() == "NONBEST_CUSTOM"){

      if($(currentTile).find('[id^="txtNONBEST"]').val() == ""){

        $(currentTile).find('[id^="errorMsgPanel"]').html("Please provide non best price reason.");
        return false;

      }

    }
    // Validation For Non - Best Price Reason :: END


    // Validation For Exceptional Order Reason:: Start
    
    if ($(currentTile).find('[id^="rbRowSuitabilityToggle"]')[0].checked) { // Added for| Unable to place suitability order for all products | LGTGTWINT-1588 | Chaitanya M | 1 Mar 2023
      if ($(currentTile).find('[id^="ddlReason"]').val().trim().includes("SUTSKP_CUSTOM")) { 
      
        if( $(currentTile).find('[id^="txtSpecifyReason"]').val() == ""){
  
          $(currentTile).find('[id^="errorMsgPanel"]').html("Please provide bypass suitability reason.");
          return false;
  
        }
      } 
    }
   
    // Validation For Exceptional Order Reason:: Start


    // LGTGTWINT-1123 - Instant Pricing: Order popup blank field validations.
    // Booking Center check
    let _bookCenter = "";
    $(currentTile).find("select.ChildrenddlBookingCenter").each(function(){
      if ($(this).parent().prev().find(".childrenCheckBoxBooking")[0].checked) {
        if($(this).val() == "" || $(this).val() == null){
          _bookCenter = "N";
        }
      }
    });

    if(_bookCenter == "N"){
      $(currentTile).find('[id^="errorMsgPanel"]').html("Please select Booking Center.");
      return false;
    }

    //END


    // RM Name check
    let _rmName = "";
    $(currentTile).find('[id^="ddlRMName"]').each(function(){
        if ($(this).parent().prev().prev().find(".childrenCheckBoxBooking")[0].checked) {
          if($(this).val() == "" || $(this).val() == null){
            _rmName = "N";
          }
        }
    });

    if(_rmName == "N"){
        $(currentTile).find('[id^="errorMsgPanel"]').html("Please select RM Name.");
        return false;
    }

    //END
    
    // Validation For RM Name :: END



  //Notinal Calculations Validation :: Start

  // Blank Notional check
  let _blankNotional = "";
  $(currentTile).find('[id^="txtHeaderNotional"]').each(function(){
      if ($(this).parent().prev().prev().prev().find(".childrenCheckBoxBooking")[0].checked) {
        if($(this).val() == "" || $(this).val() == null){
          _blankNotional = "N";
        }
      }
  });

  if(_blankNotional == "N"){
    if(productName == "AQDQ" || productName=="OPTIONS"){
      $(currentTile).find('[id^="errorMsgPanel"]').html("Please Enter valid number of shares."); //LGTGTWINT-1536 Instant Pricing: ACCU, DECU, EQO: Validation for number of shares on order confirmation popup
    }else{
      $(currentTile).find('[id^="errorMsgPanel"]').html("Please Enter valid notional.");
    }
      return false;
  }
  // END

    let _notional = 0;
    let _validateValue = "";
    let _calculatedNotional = "";

    $(currentTile).find(".txtNotionalBreakdown").each(function (index, control) {
      if (control.value.trim() != "" && control.value != undefined) {
        _notional = _notional + parseFloat(control.value.replaceAll(",", ""));
      } else {
        _notional = _notional + parseFloat(0);
      }
    });


    // Notaonl Calculation Check Start 
          
    if(productName == "AQDQ" || productName=="OPTIONS"){
      // commented for now Options and AQDQ later do notional calculation bases on spot rate of share
      _calculatedNotional = $(currentTile).find('[id^="txtCalculatedNotional"]').val();
      if (parseFloat(_calculatedNotional.replaceAll(",", "")) < parseFloat(minNotional.replaceAll(",", ""))) {
        $(currentTile).find('[id^="errorMsgPanel"]').html("Notional is less than allowed notional."); //LGTGTWINT-1123
        return false;
      } else if (parseFloat(_calculatedNotional.replaceAll(",", "")) > parseFloat(maxNotional.replaceAll(",", ""))) {
        $(currentTile).find('[id^="errorMsgPanel"]').html("Notional is greater than allowed notional."); //LGTGTWINT-1123
        return false;
      }

    } else{

        _validateValue =  validateEQCOrders(_notional);
        if(_validateValue == "L"){
          $(currentTile).find('[id^="errorMsgPanel"]').html("Notional is less than allowed notional."); //LGTGTWINT-1123
          return false;
        } else if(_validateValue == "H"){
          $(currentTile).find('[id^="errorMsgPanel"]').html("Notional is greater than allowed notional."); //LGTGTWINT-1123
          return false;
        }
    }
    
   //END   

    if (btnObj.value.trim() === "Suitability") {
      //call suitability api here
      switch (productName) {
        case "ELN":

          $(currentTile).find('[id^="txtTotalNotional"]').val(_notional);
          $(currentTile).find('[id^="txtAllocatedNotional"]').val(_notional);
          $(currentTile).find('[id^="txtOrderNotional"]').val(_notional);

    
          minMaxNotionalChecked = true;

          if (minMaxNotionalChecked) {
            booktradeELN(btnObj, true);
            // true passed as arg
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          //   true passed as arg

          break;
        case "DRA":

          $(currentTile).find('[id^="txtTotalNotional"]').val(_notional);
          $(currentTile).find('[id^="txtAllocatedNotional"]').val(_notional);
          $(currentTile).find('[id^="txtOrderNotional"]').val(_notional);

          minMaxNotionalChecked = true;

          if (minMaxNotionalChecked) {
            BooktradeDRA(btnObj, true);
            // true passed as arg
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          //   true passed as arg

          break;
        case "OPTIONS":
  
          minMaxNotionalChecked = true;

          // $(currentTile).find('[id^="txtTotalNotional"]').val(notional);
          // $(currentTile).find('[id^="txtAllocatedNotional"]').val(notional);
          // $(currentTile).find('[id^="txtOrderNotional"]').val(notional);

          // $(currentTile).find('[id^="txtTotalNotional"]').val($(currentTile).find('[id^="txtHeaderNotional"]').val());
          // $(currentTile).find('[id^="txtAllocatedNotional"]').val($(currentTile).find('[id^="txtHeaderNotional"]').val());
          // $(currentTile).find('[id^="txtOrderNotional"]').val($(currentTile).find('[id^="txtHeaderNotional"]').val());


          if (minMaxNotionalChecked) {
            booktradeOptions(btnObj, true);
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          //   true passed as arg

          //   true passed as arg

          break;
        case "FCN":

          $(currentTile).find('[id^="txtTotalNotional"]').val(_notional);
          $(currentTile).find('[id^="txtAllocatedNotional"]').val(_notional);
          $(currentTile).find('[id^="txtOrderNotional"]').val(_notional);

          minMaxNotionalChecked = true;

          if (minMaxNotionalChecked) {
            booktradeFCN(btnObj, true);
            // true passed as arg
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          //   true passed as arg

          break;
        case "AQDQ":

          minMaxNotionalChecked = true;

          // $(currentTile).find('[id^="txtTotalNotional"]').val(notional);
          // $(currentTile).find('[id^="txtAllocatedNotional"]').val(notional);
          // $(currentTile).find('[id^="txtOrderNotional"]').val(notional);

          if (minMaxNotionalChecked) {
            booktradeAQDQ(btnObj, true);
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          // //   true passed as arg

          $(currentTile).find('[id^="txtTotalNotional"]').val($(currentTile).find('[id^="txtHeaderNotional"]').val());
          $(currentTile).find('[id^="txtAllocatedNotional"]').val($(currentTile).find('[id^="txtHeaderNotional"]').val());
          $(currentTile).find('[id^="txtOrderNotional"]').val($(currentTile).find('[id^="txtHeaderNotional"]').val());

          break;
        case "BEN":
          
          $(currentTile).find('[id^="txtTotalNotional"]').val(_notional);
          $(currentTile).find('[id^="txtAllocatedNotional"]').val(_notional);
          $(currentTile).find('[id^="txtOrderNotional"]').val(_notional);

          minMaxNotionalChecked = true;

          if (minMaxNotionalChecked) {
            BooktradeBEN(btnObj, true);
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          //   true passed as arg
          break;
        case "PHOENIX":

          $(currentTile).find('[id^="txtTotalNotional"]').val(_notional);
          $(currentTile).find('[id^="txtAllocatedNotional"]').val(_notional);
          $(currentTile).find('[id^="txtOrderNotional"]').val(_notional);

          minMaxNotionalChecked = true;

          if (minMaxNotionalChecked) {
            booktradePhoenix(btnObj, true);
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          //   true passed as arg
          break;

        default:
          "";
        break;
      }
    } else {

        if(redirectYN != "Y"){ // LGTGTWINT-1186 Instant Pricing: RM and IA: User should be able to redirect order

        // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023 
        if (isRM || isIA) { //LGTGTWINT-1954 || RizwanS || 03 May 2023

          let checkRedirectFlag = "";
      
          checkRedirectFlag = CheckRedirectBtnEnableDisable(currentTile, productName);
      
          $(currentTile).find('[id^="btnConfirm"]').val("Redirect");
          $(currentTile).find('[id^="btnConfirm"]').text("Redirect");
      
          preTradeXml = getpreTradeXml(currentTile);
      
          redirectYN = "Y";

          return false
          
         }

         } //END
    
      switch (productName) {
        case "ELN":
 
          $(currentTile).find('[id^="txtTotalNotional"]').val(_notional);
          $(currentTile).find('[id^="txtAllocatedNotional"]').val(_notional);
          $(currentTile).find('[id^="txtOrderNotional"]').val(_notional);

          minMaxNotionalChecked = true;

          if (minMaxNotionalChecked) {
            // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
            if(redirectYN == "Y"){

              booktradeELN(btnObj,"",true,);

            }else{
              booktradeELN(btnObj,"",false);
            }
          
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          //   true passed as arg
          break;
        case "DRA":

        $(currentTile).find('[id^="txtTotalNotional"]').val(_notional);
        $(currentTile).find('[id^="txtAllocatedNotional"]').val(_notional);
        $(currentTile).find('[id^="txtOrderNotional"]').val(_notional);

          minMaxNotionalChecked = true;

          if (minMaxNotionalChecked) {
          // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
            if(redirectYN == "Y"){

              BooktradeDRA(btnObj,"",true);

            }else{

              BooktradeDRA(btnObj,"",false);

            }
            
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
            
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          //   true passed as arg
          break;
        case "FCN":

          $(currentTile).find('[id^="txtTotalNotional"]').val(_notional);
          $(currentTile).find('[id^="txtAllocatedNotional"]').val(_notional);
          $(currentTile).find('[id^="txtOrderNotional"]').val(_notional);

          minMaxNotionalChecked = true;

          if (minMaxNotionalChecked) {
            // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
            if(redirectYN == "Y"){

              booktradeFCN(btnObj,"",true);

            }else{

              booktradeFCN(btnObj,"",false);
              
            }

            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          //   true passed as arg
          break;
        case "OPTIONS":
          minMaxNotionalChecked = true;

          // $(currentTile).find('[id^="txtTotalNotional"]').val($(currentTile).find('[id^="txtHeaderNotional"]').val());
          // $(currentTile).find('[id^="txtAllocatedNotional"]').val($(currentTile).find('[id^="txtHeaderNotional"]').val());
          // $(currentTile).find('[id^="txtOrderNotional"]').val($(currentTile).find('[id^="txtHeaderNotional"]').val());

          if (minMaxNotionalChecked) {
            // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
            if(redirectYN == "Y"){

              booktradeOptions(btnObj,"",true);

            }else{

              booktradeOptions(btnObj,"",false);

            }
       
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          //   true passed as arg

          break;
        case "AQDQ":

        minMaxNotionalChecked = true;

          // $(currentTile).find('[id^="txtTotalNotional"]').val(notional);
          // $(currentTile).find('[id^="txtAllocatedNotional"]').val(notional);
          // $(currentTile).find('[id^="txtOrderNotional"]').val(notional);

          $(currentTile).find('[id^="txtTotalNotional"]').val($(currentTile).find('[id^="txtHeaderNotional"]').val());
          $(currentTile).find('[id^="txtAllocatedNotional"]').val($(currentTile).find('[id^="txtHeaderNotional"]').val());
          $(currentTile).find('[id^="txtOrderNotional"]').val($(currentTile).find('[id^="txtHeaderNotional"]').val());

          if (minMaxNotionalChecked) {
           // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
            if(redirectYN == "Y"){

              booktradeAQDQ(btnObj,"",true);

            }else{

              booktradeAQDQ(btnObj,"",false);

            }
          
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123

          break;
        case "BEN":

          $(currentTile).find('[id^="txtTotalNotional"]').val(_notional);
          $(currentTile).find('[id^="txtAllocatedNotional"]').val(_notional);
          $(currentTile).find('[id^="txtOrderNotional"]').val(_notional);

          minMaxNotionalChecked = true;

          if (minMaxNotionalChecked) {
            // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
            if(redirectYN == "Y"){

              BooktradeBEN(btnObj,"",true);

            }else{

              BooktradeBEN(btnObj,"",false);

            }
       
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          //   true passed as arg
          break;
        case "PHOENIX":
                    
          $(currentTile).find('[id^="txtTotalNotional"]').val(_notional);
          $(currentTile).find('[id^="txtAllocatedNotional"]').val(_notional);
          $(currentTile).find('[id^="txtOrderNotional"]').val(_notional);

          minMaxNotionalChecked = true;

          if (minMaxNotionalChecked) {
            // LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
            if(redirectYN == "Y"){

              booktradePhoenix(btnObj,"",true);

            }else{

              booktradePhoenix(btnObj,"",false);

            }
           
            $(currentTile).find(".orderConfirmPopUpEQC").hide();
          } else
          // openValidationpopup(currentTile,"check minimum and maximum notional allowed ");
          $(currentTile).find('[id^="errorMsgPanel"]').html("Check minimum and maximum notional allowed."); //LGTGTWINT-1123
          //   true passed as arg
          break;

        default:
          "";
          break;
      }
    }

     removeOverlayEQC();

     resetOrderConfirmParameters(currentTile);

    $(currentTile).find(".orderConfirmPopUpEQC").hide();
  } catch (error) {
    console.log(error.message);
  }finally{
      //Added by AniruddhaJ LGTGTWINT-524 || 5Dec2022
      // resetOrderConfirmParameters(currentTile);
  }
}

function CancelDeal(btnObj) {
  try {

    removeOverlayEQC();
    let currentTile = $(btnObj).parents("td.sorting")[0];

    $(currentTile).find(".orderConfirmPopUpEQC").hide();
    //Added by AniruddhaJ LGTGTWINT-524 || 5Dec2022
    resetOrderConfirmParameters(currentTile);



  } catch (err) {
    console.log(err);
  }
}

//Added by AniruddhaJ LGTGTWINT-524 || 5Dec2022 Start
function resetOrderConfirmParameters(currentTile) {
  try {

    checkdefaultException(); //LGTGTWINT-1954 || RizwanS || 03 May 2023

    redirectYN = ""; // After reset make redirect yn flag blan || 06 Feb 2023 

    $(currentTile).find('div.orderConfirmPopUpEQC table.tblRMDetails .clonedDynamicRow').each(function (index, TR) {
      $(TR).remove();

    })


    $(currentTile).find('div.orderConfirmPopUpEQC input[type="text"],div.orderConfirmPopUpEQC input[type="search"],div.orderConfirmPopUpEQC select').each(function (index, element) {

      if ($(element).prop('tagName').toUpperCase == "SELECT") {
        element.selectedIndex = -1;

      } else {

        element.value = "";
      }

    })
    $(currentTile).find('div.orderConfirmPopUpEQC').find('[id^="ddlOrderType"]').trigger('change');
    $(currentTile).find('[id^="rbRowSuitabilityToggle"]')[0].checked = false; //default set to suitability

    if(!$(currentTile).find('[id^="rbRowSuitabilityToggle"]')[0].checked){
      $(currentTile).find('[id^="btnConfirm"]').val("Suitability");
      $(currentTile).find('[id^="btnConfirm"]').text("Suitability");
      $(currentTile).find(".lblReason").each(function () {
        $(this).hide();
      });
      console.log("suitability");
      $(currentTile).find("tr.trSpecifyReason").hide(); // Added  Chaitanya | For Resetting the order confirm parameters of SuitabilityReason on cancel order popup | Ref: LGTGTWINT-603 | 12-Jan-2023

    }else{
      fillDropdownEQC(suitabilityReasons, $(currentTile).find('[id^="ddlReason"]').attr('id')); //LGTGTWINT-428 || 17 Jan 2023
      document.getElementById($(currentTile).find('[id^="ddlReason"]').attr('id')).selectedIndex = defaultReasonIndex; //LGTGTWINT-1954 || RizwanS || 03 May 2023

      $(currentTile).find('[id^="btnConfirm"]').val("Confirm");
      $(currentTile).find('[id^="btnConfirm"]').text("Confirm");
      $(currentTile).find(".lblReason").each(function () {
        $(this).show();
      });
    }

    // let userType = sessionStorage.getItem("UserType").toString().trim();
    // if (userType === "RM" || userType === "IA") {
    //   console.log('Usertype ' + userType)
    //   $(currentTile).find('[id^="rbRowSuitabilityToggle"]').prop('disabled', true);
    //   $(currentTile).find('[id^="rbRowSuitabilityToggle"]').next().attr('disabled', true);
    // } else {
    //   console.log('Usertype ' + userType)
    //   $(currentTile).find('[id^="rbRowSuitabilityToggle"]').prop('disabled', false);
    //   $(currentTile).find('[id^="rbRowSuitabilityToggle"]').next().attr('disabled', false);
    // } 
    //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message



  } catch (error) {
    console.log(error.message);

  }
}

//end

function changedOrderType(ddlObject) {
  try {
    let currentTile = $(ddlObject).parents("td.sorting")[0];
    if (ddlObject.value.trim() === "Suitability") {
      $(currentTile).find('[id^="btnConfirm"]').val("Suitability");
      $(currentTile).find('[id^="btnConfirm"]').text("Suitability");
    } else {
      $(currentTile).find('[id^="btnConfirm"]').val("Confirm");
      $(currentTile).find('[id^="btnConfirm"]').text("Confirm");
    }
  } catch (error) { }
}

function Get_RMListWithBook(tileObj) {
  try {
    TileId = tileObj.id.match(/\d+$/)[0];
    // startLoader();
// LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order
    let fLRCflag = "";
    if (isEQCDealer) {
      fLRCflag = "N";
    }else{
      fLRCflag = "Y";
    }

    request_getDataFromAPI({
      "UserName": sessionStorage.getItem("EQC_UserName").toString(),
      // "FollowLRC_YN": fLRCflag,
      "UserGroup":  sessionStorage.getItem("FinIQGroupID").toString(), //Added usergroup as disccused with mangeshW/VaibhavY || 06 Feb 2023
      "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
      "CurrentTileID": TileId
    }, clientConfigdata.CommonMethods.NodeServer + "Get_RMListWithBook").then((data) => {

      // endLoader();
      console.log("RM Data", data);

      currentTile = document.getElementById("td" + data.CurrentTileID);
      var RMNameList_Array = [];
      RMNameList_Array = JSON.parse(data.responseData)

      // console.log("RM List Only ", RMNameList_Array);

      let ddlRMNameControl = $(currentTile).find('[id^="ddlRMName"]')[0];
      let strRM = "";

      for (let r of RMNameList_Array) {
        strRM = strRM + `<option value='${r["Host"]}'>${r["Host"]}</option>`; //LGTGTWINT-1533 - Instant Pricer : RM name to be displayed and sent using 'Host' tag instead of 'Rel_Manager_Name
      }
      $(ddlRMNameControl).empty().append(strRM);
      $(ddlRMNameControl)[0].selectedIndex = -1;

      getBookingCenter(data.CurrentTileID); //LGTGTWINT-1089 Instant Pricing: Client Price (%) missing on order popup for ELN

    }
    ).catch((error) => {
      console.log(error.message);
      endLoader();
    }
    );
  } catch (error) {
    console.log(error.message);
    endLoader();
  } finally { }
}

function GetEQC_OrderTypes(tileObj) {
  try {

    TileId = tileObj.id.match(/\d+$/)[0];
    currentTile = document.getElementById("td" + TileId);
    // startLoader();

    request_getDataFromAPI({
      "UserName": sessionStorage.getItem("EQC_UserName").toString(),
      "BasketYN": "Y",
      "IssuerCode": $(currentTile).find('[id^="txtIssuer"]').val().trim(),
      "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
      "CurrentTileID": TileId
    }, clientConfigdata.CommonMethods.NodeServer + "EQC_OrderTypes").then((data) => {
      // endLoader();
      console.log("order types", data);
      currentTile = document.getElementById("td" + data.CurrentTileID);

      // var OrderTypes_Array = [];
      // OrderTypes_Array = (data.responseData)
      // var CP_OrderTypeArray = OrderTypes_Array.filter(function (KEY) {
      //   return KEY['Key'].trim().toUpperCase() === $(currentTile).find('[id^="txtIssuer"]').val().trim().toUpperCase()
      // })
      // let ddlOrderTypeControl = $(currentTile).find('[id^="ddlOrderType"]')[0];
      // let strOT = "";

      // for (let r of CP_OrderTypeArray[0]['Value']) {

      //   // LGTGTWINT-2023 Gateway order pop-up : Change the name of order type to 'Avg of Mkt and Close' on both Single pricer and Instant pricer || RizwanS || 25 May 2023
      //   let _value;
      //   let _text;
      //   if(r.toUpperCase() == "AVG OF MKT OPEN AND CLOSE"){
      //      _value = r;
      //     //  _text = "Avg of Mkt and Close"; 
      //     _text = "Avg of Mkt Open and Close";  // LGTGTWINT-2023 || RiZwanS || 14 Jul 2023
      //   }else{
      //     _value = r;
      //     _text = r;
      //   }
      //   strOT = strOT + `<option value='${_value}'>${_text}</option>`;
      // }
      //END


      //RizwanS || LGTGTWINT-2363 || EQC Order popup order types are incorrect as compare to EQC Single Pricer || 22 Sep 2023
      let orderRes = JSON.parse(data.responseData);
      let ddlOrderTypeControl = $(currentTile).find('[id^="ddlOrderType"]')[0];
      let strOT = "";

      for(i=0;i<orderRes.length;i++){
        strOT = strOT + `<option value='${orderRes[i].ValidOrderTypes}'>${orderRes[i].ValidOrderTypes}</option>`;
      }
      //END

      $(ddlOrderTypeControl).empty().append(strOT);
      $(ddlOrderTypeControl)[0].selectedIndex = 0;
    }
    )

  } catch (error) {
    console.log(error.message)
  }
}

function getBookingCenter(TileId) { //LGTGTWINT-1089 Instant Pricing: Client Price (%) missing on order popup for ELN
  try {

    // startLoader();

    request_getDataFromAPI({
      "UserName": sessionStorage.getItem("EQC_UserName").toString(),
      "FollowLRC_YN":"N",
      "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
      "CurrentTileID": TileId
    }, clientConfigdata.CommonMethods.NodeServer + "getBookingCenter").then((data) => {

      console.log("getBookingCenter", data);
      // endLoader();
      let currentTile = document.getElementById("td" + data.CurrentTileID);

      let productName = $("#td" + data.CurrentTileID).find(".productName")[0].id;

      var BookingBranchList_Array = [];
      BookingBranchList_Array = JSON.parse(data.responseData)

      // Added By RizwanS To check multiple booking branch || 04 Dec 2022

      if(productName.toUpperCase() == "AQDQ"){

        let removeItem = "MULTIPLE";

        BookingBranchList_Array = jQuery.grep(BookingBranchList_Array, function(value) {

          return value.BookingCenterName.toUpperCase() != removeItem;

        });

      }

      // END

      let ddlBookingBranchControl = $(currentTile).find('[id^="ddlBookingBranch"]')[0];
      let strBookingBranch = "";

      for (let r of BookingBranchList_Array) {
        strBookingBranch = strBookingBranch + `<option value=${r["BookingCenterCode"]}>${r["BookingCenterName"]}</option>`;
      }
      $(ddlBookingBranchControl).empty().append(strBookingBranch);
      $(ddlBookingBranchControl)[0].selectedIndex = -1;

      $(currentTile).find("select.ChildrenddlBookingCenter")
        .each(function (i, selectControl) {
          $(selectControl).empty().append(strBookingBranch);
          $(selectControl)[0].selectedIndex = -1;

        });
       
       
    }
    );
  } catch (error) {
    console.log(error.message);
  }
}

// Suitability Reason API Call || 28 Nov 2022  || Added by RizwanS

var suitabilityReasons = "";

function getEQCSuitabilityReason() { //LGTGTWINT-428 || 17 Jan 2023
  try {

    // startLoader();

    request_getDataFromAPI({

      "userName": sessionStorage.getItem("FinIQUserID").toString(),
      "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),

    }, clientConfigdata.CommonMethods.NodeServer + "SuitabilityReasonIP").then(data => {

      // endLoader();

      // let userType = sessionStorage.getItem('FinIQGroupID').toString().toUpperCase();

      suitabilityReasons = sortedArrayEQC(JSON.parse(data.responseData));
      
      ////LGTGTWINT-428 || 17 Jan 2023
      
    }
    )
  } catch (error) {
    console.log(error.message);
    endLoader();
  }
}


// Default Suitability Reason API Call || LGTGTWINT-1954 || RizwanS || 03 May 2023 03 May 2023  || Added by RizwanS

var defaultsuitabilityReasons = "";

function getdefaultSuitabilityReason() { 
  try {

    request_getDataFromAPI({

      "userName": sessionStorage.getItem("FinIQUserID").toString(),
      "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),

    }, clientConfigdata.CommonMethods.NodeServer + "defaultSuitabilityReasonIP").then(data => {

      defaultsuitabilityReasons = sortedArrayEQC(JSON.parse(data.responseData));
      
    }
    )
  } catch (error) {
    console.log(error.message);
  }
} //END

function sortedArrayEQC(commnData){
  try{

       let ReasonData = $.grep(commnData, function (element, index) {
          return element.Data_Value.toUpperCase();
      });

      return ReasonData;

  }catch(error){
      console.log(error.message)
  }
}

function fillDropdownEQC(dataArray, ctlID) {
  try {

      var x = document.getElementById(ctlID);
      if (x.options.length != 0) {
          $(x).empty();
      }
      for (var i = 0; i < dataArray.length; i++) {
          var option = document.createElement("option");
          option.text = dataArray[i].Data_Value;
          option.value = dataArray[i].Misc1; // Added by RizwanS | JIRA-LGTGTWINT-1830
          x.add(option);
      }
  } catch (error) {
      console.log(error.message);
  }
}

//#endregion

function startTimersEQC(tileId) {
  try {
    //console.log("START TIMERS");
    var thisTile = document.getElementById("td" + tileId);
    if ("td" + tileId in myInterval) {
      clearInterval(myInterval["td" + tileId]);
      delete myInterval["td" + tileId];
    }
    clearPricesInterrupt["td" + tileId] = false;
    var itr = 0;
    myInterval["td" + tileId] = setInterval(function () {
      // checking if clearPrices function is called.
      // if clearPrices called stop timers.
      if (clearPricesInterrupt["td" + tileId]) {
        // To stop timers if any input changes in tile.
        // Triggered from clearPrices function on changing value of clearPricesInterrupt
        if ("td" + tileId in myInterval) {
          clearInterval(myInterval["td" + tileId]);
          delete myInterval["td" + tileId];
        }
      } else {
        itr = 0;
        var skip = false
          , countValidPrices = 0;
        $(thisTile).find('[id*="TimerRow"]').children().each(function () {
          // check whether the current bank exists in myCounter to avoid error.
          // instead of below myCounter condition, we can also check if above price is isNAN().
          if (!(mapIndexToBank["td" + tileId][itr] in myCounter["td" + tileId])) {// do nothing
          }// decreasing the prices timer.
          else if (myCounter["td" + tileId][mapIndexToBank["td" + tileId][itr]] > 0) {
            myCounter["td" + tileId][mapIndexToBank["td" + tileId][itr]]--;
            $(this).html(myCounter["td" + tileId][mapIndexToBank["td" + tileId][itr]]);
          }
          if (mapIndexToBank["td" + tileId][itr] in myCounter["td" + tileId]) {
            countValidPrices++;
          }
          itr++;
        });
        itr = 0;
        var countExpiredTimers = 0;
        // checking which price timers have expired.
        $(thisTile).find(".pricesRow").children().each(function () {
          if (!(mapIndexToBank["td" + tileId][itr] in myCounter["td" + tileId])) {// do nothing
          } else if (myCounter["td" + tileId][mapIndexToBank["td" + tileId][itr]] <= 0) {
            $(this).find("button").attr("disabled", true);
            var itr2 = 0;
            $(thisTile).find(".banksNameRow").children().each(function () {
              if (itr == itr2) {
                $(this).find("button").attr("disabled", true);
              }
              itr2++;
            });
            //var pricesRowIndex = parseInt($(thisTile).find('[id^="hdnPriceIndex"]').val());
            var currentSelectedBank = $(thisTile).find('[id^="hdnSelectedBank"]').val().trim();
            if (currentSelectedBank == mapIndexToBank["td" + tileId][itr]) {
              // disabling book trade button, if selected index timer expires.
              $(thisTile).find('[id*="BookTrade"]').attr("disabled", true);
              $(thisTile).find('[id*="BookReq"]').attr("disabled", true);
            }
            countExpiredTimers++;
          }
          itr++;
        });
      }
    }, 1000);
  } catch (err) {
    console.log(err);
  }
}

function setPriceEQC(that) {
  try {
    const str = that.id.split("_");
    console.assert(str.length == 2);
    var currentTileId = str[0];
    var pricesRowIndex = parseInt(str[1]);
    var thisTile = document.getElementById(currentTileId);
    var itr = 0;
    var selectedBank = "";
    hasUserClickedEQC[currentTileId] = true;
    // Extracting which bank is selected.
    $(thisTile).find(".banksNameRow").children().each(function () {
      $(this).removeClass("priceBackground");
      if (itr == pricesRowIndex) {
        selectedBank = $(this).find("button").html().trim();
        // console.log("SELECTED BANK:");
        // console.log(selectedBank);
        $(this).addClass("priceBackground");
      }
      itr++;
    });
    // confirm selectedBank field is not empty.
    console.assert(selectedBank != "");
    itr = 0;
    // removing the highlight class from all price row buttons except the selected button.
    $(thisTile).find(".pricesRow").children().each(function () {
      $(this).removeClass("priceBackground");
      if (itr == pricesRowIndex) {
        $(this).addClass("priceBackground");
      }
      itr++;
    });
    $(thisTile).find('[id^="hdnSelectedBank"]').val(selectedBank);
    // if timer of the selected bank has not expired enable the booktrade button.
    if (myCounter[currentTileId][mapIndexToBank[currentTileId][pricesRowIndex]] > 0) {
      $(thisTile).find('[id*="BookTrade"]').attr("disabled", false);
      $(thisTile).find('[id*="BookReq"]').attr("disabled", false);
    }
  } catch (err) {
    console.log(err);
  }
}

// Function added for GetRuleschedulexml data // 17 May 2022 //
function GetRulescheduleFXD(currId, xmlstr, tempCode, tempID, that) {
  try {
    $("#commonoverlay").show();
    $("#commonoverlay").addClass("commonloader");

    request_getDataFromAPI({
      UserID: sessionStorage.getItem("Username"),
      EntityId: sessionStorage.getItem("HomeEntityID"),
      ExternalXMLString: xmlstr,
      TemplateCode: tempCode,
      TemplateID: tempID,
      currentTile: currId,
    }, clientConfigdata.CommonMethods.NodeServer + "GetRulescheduleXml").then((data) => {
      if (data.GetRulescheduleXmlResult == null) {
        $("#commonoverlay").removeClass("commonloader");
        $("#commonoverlay").hide();
      }
      let thisTile = document.getElementById("td" + data.currentTile);
      console.log(data.GetRulescheduleXmlResult);
      bindxmldata(data.GetRulescheduleXmlResult, that);
    }
    ).catch((error) => {
      console.log(error.message);
    }
    );
  } catch (error) {
    console.log(error.message);
  }
}

function bindxmldata(xmldata, that) {
  try {
    tempStr = xmldata;

    var dtworkflowData;

    if (tempStr.length > 0) {
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(tempStr, "text/xml");
      dtworkflowData = xml2jsonWF(xmlDoc);
    }

    var wfbdata = dtworkflowData.NewDataSet.FinIQMemoryTable;

    console.log(wfbdata);
    var newxmlarray = [];

    for (i = 0; i < wfbdata.length; i++) {
      if (wfbdata[i].RM_Action_Class == "Input XML") {
        newxmlarray.push(wfbdata[i]);
      }
    }
    console.log("newxmlarray = = ", newxmlarray);
    binddatatotable(newxmlarray, that);
  } catch (error) {
    console.log(error.message);
    $(".lblError").html(error);
  } finally { }
}

function binddatatotable(newxmlarray, that) {
  //let row0=['Alternate_Ccy','Ccy1_Amt', 'Ccy2_Amt' ,'Deal_Dir' ,'Deal_Pair' ,'Deal_Rate' ,'Deal_Type' ,'Deposit_Ccy' ,'EntityID ','Fixing_Date' ,'GuaranteedYN' ,'KnockIn_Style' ,' KnockOut_Style ', 'Leg_ID' ,' Lower_Barrier' , 'Maturity_Date' , 'Non_Delivery_YN' , 'Option_Cut' ,'Prem_Ccy ','Product_Type' ,'Settled_In_Ccy' , 'Target_Solve_Field' , 'Trade_Date' ,' Upper_Barrier' , 'UserID ','Value_Date'];

  let firstrow = ["Fixing Date", "Settlement Date", "Option Direction", "Product Type", "Option", "Underlying", "Strike", "Lower Barrier", "Upper Barrier", "Notional", "Notional ccy",];
  let row0 = ["Fixing_Date", "Maturity_Date", "Deal_Dir", "Product_Type", "Deal_Type", "Deal_Pair", "Deal_Rate", "Lower_Barrier", "Upper_Barrier", "Ccy1_Amt", "Deposit_Ccy",];
  //$("#fxaqviewschedule").html("");
  //ViewSchedulePopUp(that);
  $("#ViewSchedulePopUp").html("");
  str = '<table class="viewschedule">';
  str = str + "<tr>";
  for (var i = 0; i < firstrow.length; i++) {
    str = str + '<th  style="color:white" >' + firstrow[i] + "</th>";
  }
  str = str + "</tr>";
  for (i = 0; i < newxmlarray.length; i++) {
    rsmessageformatstr = newxmlarray[i].RS_Message_Format;

    // 'Fixing_Date','Maturity_Date','Deal_Dir','Product_Type','Deal_Type','Deal_Pair','Deal_Rate','Lower_Barrier','Upper_Barrier','Ccy1_Amt','Alternate_Ccy'

    if (rsmessageformatstr.length > 0) {
      parser = new DOMParser();
      rsmessagexmlDoc = parser.parseFromString(rsmessageformatstr, "text/xml");
      rsmessageformatdata = xml2jsonWF(rsmessagexmlDoc);
      console.log("rsmessageformatdata= = =", rsmessageformatdata);
    }

    user = rsmessageformatdata.NewDataSet.quoteDetails;
    str = str + "<tr>";
    for (var j = 0; j < row0.length; j++) {
      if (row0[j] == "Deal_Rate" || row0[j] == "Lower_Barrier" || row0[j] == "Upper_Barrier" || row0[j] == "Ccy1_Amt") {
        str = str + '<td><input type="text" style="text-align:right" value=' + `${user[row0[j]]}` + " disabled ></td>";
      } else if (row0[j] == "Product_Type") {
        str = str + '<td><input type="text" value=' + `${user[row0[j]]}` + " disabled ></td>";
      } else {
        str = str + '<td><input type="text"   style="text-align:center" value=' + `${user[row0[j]]}` + " disabled ></td>";
      }
      console.log(`${user[row0[j]]}`);
    }
    str = str + "</tr>";
  }

  str = str + "</table>";
  ViewSchedulePopUp(that);
  $("#commonoverlay").removeClass("commonloader");
  $("#commonoverlay").hide();
  //$("#fxaqviewschedule").append(str);
  $("#ViewSchedulePopUp").append(str);
}

function xml2jsonWF(xml) {
  try {
    var obj = {};
    if (xml.children.length > 0) {
      for (var i = 0; i < xml.children.length; i++) {
        var item = xml.children.item(i);
        var nodeName = item.nodeName;

        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = xml2jsonWF(item);
        } else {
          if (typeof obj[nodeName].push == "undefined") {
            var old = obj[nodeName];

            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xml2jsonWF(item));
        }
      }
    } else {
      obj = xml.textContent;
    }
    return obj;
  } catch (e) {
    console.log(e.message);
  }
}

var ViewSchedulePopUp = (button) => {

  $("#ViewSchedulePopUp").html("");

  $("#ViewSchedulePopUp").dialog({
    resizable: false,
    height: "auto",
    width: "50%",
    modal: true,
  });
};

function ddlReasonChangedOnExectionalOrder(__ddlReason) {
  try {
    let currentTile = $(__ddlReason).parents("td.sorting")[0];

    if (__ddlReason.value.trim().includes("SUTSKP_CUSTOM")) { // Changed the Condition | Ref:LGTGTWINT-603 |Chaitanya M | 12-Jan-2023 && // Added by RizwanS | JIRA-LGTGTWINT-1830
      //add one extra comment line SHOW
      $(currentTile).find('[id^="errorMsgPanel"]').html("");
      $(currentTile).find("tr.trSpecifyReason").show();
    } else {
      //hide
      $(currentTile).find("tr.trSpecifyReason").hide();
      $(currentTile).find('[id^="errorMsgPanel"]').html("");
    }
  } catch (error) {
    console.log(error.message);
  }
}

function K_M_B_Formatter(num) {
  try {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  } catch (error) {
    console.log(error.message);
  }
}

function emailParentCheckboxChanged($_CheckBoxControl) {
  try {
    let emailTable = $($_CheckBoxControl).parents('table.emailTable')[0];

    if ($_CheckBoxControl.checked) {
      $(emailTable).find('.chkBox_Email_PPCode').each(function () {
        $(this).prop('checked', true)
      })

    } else {
      $(emailTable).find('.chkBox_Email_PPCode').each(function () {
        $(this).prop('checked', false);

      })
    }
  } catch (err) {
    console.log(err);

  }
}

function emailChildrenCheckboxChanged($_CheckBoxControl) {
  try {
    let emailTable = $($_CheckBoxControl).parents('table.emailTable')[0];
    if ($_CheckBoxControl.checked) {
      if ($(emailTable).find('.chkBox_Email_PPCode:checked').length == $(emailTable).find('.chkBox_Email_PPCode').length) {
        $(emailTable).find('.chkBoxParent_Email_PPCode').prop('checked', true);

      }

    } else {
      $(emailTable).find('.chkBoxParent_Email_PPCode').prop('checked', false);
    }
  } catch (error) {
    console.log(error.message);

  }

}

function reformatDate(dateStr) {

  try{
    let month_names = ['', "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",];
    var dArr = dateStr.split("-");
    return dArr[2] + "-" + month_names[Number(dArr[1])] + "-" + dArr[0];
  }catch(er){
    console.log(er.message)
  }
  
}

function addOverlayEQC(){
  try{

    $("#commonoverlayEQC").show();

  }catch(er){
    console.log(er.message)
}}

function removeOverlayEQC(){
   
  try{

    $("#commonoverlayEQC").hide();

  }catch(er){
    console.log(er.message)
}}

function openValidationpopup(tile,message){
   try {

    $("span#lblValidationText").html(message);

    $("#dialog-EQCValidation").dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
          "Ok": function () {

            closedialogbox();
            //$("#dialog-EQCValidation").dialog("close");

            // $("#commonoverlayEQC").hide();

          }         
      }
  });

   } catch (error) {

   }

}

//END

// Added by RizwanS for || JIRA - LGTGTWINT-569 : Instant Pricing: Loader should be present until response is received || 09 Dec 2022

function mapleLoaderStart(tile, btnid, overlayflag){

  try{

  

    if(overlayflag == true){

      $(tile).find("[id^='OverlayDiv']").addClass("OverlayDiv").show();

    }else{

      $(tile).find(btnid).addClass("wip"); //LGTGTWINT-1425 FXD- Loading icon to be removed from Spread button while pricing

    }

  }catch(er)
    {
      console.log(er.message)
    }
}

function mapleLoaderStop(tile, btnid, overlayflag){
  try{

    if(overlayflag == true){

      $(tile).find("[id^='OverlayDiv']").addClass("OverlayDiv").hide();

    }else{

      $(tile).find(btnid).removeClass("wip"); //LGTGTWINT-1425 FXD- Loading icon to be removed from Spread button while pricing

    }

  }catch(er)
    {
      console.log(er.message)
    }

}

// END

// Added by RizwanS for || JIRA - LGTGTWINT-1626 : Instant Pricing: Loader displayed when clicked on order confirm button || 06 March 2023

function mapleOrderLoaderStart(tile){

  try{

      $(tile).find("[id^='OverlayDiv']").addClass("OverlayDiv").show();

  }catch(er)
    {
      console.log(er.message)
    }
}

function mapleOrderLoaderStop(tile){
  try{

      $(tile).find("[id^='OverlayDiv']").addClass("OverlayDiv").hide();

  }catch(er)
    {
      console.log(er.message)
    }

}

// END


// Added By RizwanS || function to calculate local time in a different city given the cityÃ¢â‚¬â„¢s UTC offset  || 17 Dec 2022
function calcTime(offset) {
  try{
      d = new Date();
      utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      nd = new Date(utc + (3600000*offset));
      return nd;

  }catch(er){
  console.log(er.message);
  }
}// END


//Added by RizwanS || Payoff's configurtion|| 28 Dec 2022 ||
var MAPLE_TABLE;

//RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
var EQC_TABLE; 
var FXD_TABLE;

function getMAPLEAccessControl() { //LGTGTWINT-1252 Instant pricer Not Responding message

  try {

    $("#MAPLEACTBL").empty();

    MAPLE_TABLE = [];

    //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
    EQC_TABLE = [];
    FXD_TABLE = [];

    let FXDArray = '';

    // Added by RizwanS || Check Available EQC Payoff's - Start | 04 Mrach 2023 
    // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023 

    if (isEQCDealer || isIA || isRM) { //LGTGTWINT-1954 || RizwanS || 03 May 2023

          GetDefaultPersonalSettingsInfoEQC();

          // EQCGetSharesData(); // Commented || LGTGTWINT-1567 || RizwanS || 20 Apr 2023

          getNonBestPriceReasons();  //LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

          getEQCSuitabilityReason(); //LGTGTWINT-428 || 17 Jan 2023

         //LGTGTWINT-1954 || RizwanS || 03 May 2023
         
          getdefaultSuitabilityReason();

          if (AllowOrderviaInstantPricer.toUpperCase() != "YES") { 

            $('button.bookReqEQC').each(function () {
        
                $(this).parent('td').remove();
                    
            })

          }

          if(AllowOrderEmailviaInstantPricer.toUpperCase() !="YES"){

            $('button.orderEmailbtn').each(function () {
        
              $(this).parent('td').remove();
                  
            })

          }
          

          //END
          //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
          let shareRequest = {

            'UserName': userName,
            'Product':'',
            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString()
          }//END

          if(ELNTabYN.toUpperCase() == "YES"){
            MAPLE_TABLE.push("ELN");
            EQC_TABLE.push("ELN");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
            //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
            shareRequest.Product="ELN";
            if(ELNShareData == undefined || ELNShareData == "" || ELNShareData == null){
              let ELNObj = getSyncResponse(shareRequest, clientConfigdata.CommonMethods.NodeServer + "ShareListEQC");  // LGTGTWINT-1891 || RizwanS || 20 Apr 2023
              ELNShareData = ELNObj.responseData;
            }//END

          }

          if(FCNTabYN.toUpperCase() == "YES"){
            MAPLE_TABLE.push("FCN");
            EQC_TABLE.push("FCN");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
            //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
            shareRequest.Product="FCN";
            if(FCNShareData == undefined || FCNShareData == "" || FCNShareData == null){
              let FCNObj = getSyncResponse(shareRequest, clientConfigdata.CommonMethods.NodeServer + "ShareListEQC");  // LGTGTWINT-1891 || RizwanS || 20 Apr 2023
              FCNShareData = FCNObj.responseData;
            }//END
          }

            
          if(DRATabYN.toUpperCase() == "YES"){
            MAPLE_TABLE.push("DRA");
            EQC_TABLE.push("DRA");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
            //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
            shareRequest.Product="DRA";
            if(DRAShareData == undefined || DRAShareData == "" || DRAShareData == null){
              let DRAObj =  getSyncResponse(shareRequest, clientConfigdata.CommonMethods.NodeServer + "ShareListEQC");  // LGTGTWINT-1891 || RizwanS || 20 Apr 2023
              DRAShareData = DRAObj.responseData;
            }//END
          }
      
      
          if(ACCTabYN.toUpperCase() == "YES" && DECTabYN.toUpperCase() == "YES"){ // Corrected config names for showing AQDQ | Chaitanya M | 21 Sep 2023
            MAPLE_TABLE.push("AQDQ");
            EQC_TABLE.push("AQDQ");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
            //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
            shareRequest.Product="ACCUMULATOR";
            if(ACCShareData == undefined || ACCShareData == "" || ACCShareData == null){
              let ACCObj =  getSyncResponse(shareRequest, clientConfigdata.CommonMethods.NodeServer + "ShareListEQC");  // LGTGTWINT-1891 || RizwanS || 20 Apr 2023
              ACCShareData = ACCObj.responseData;
            }

            shareRequest.Product="DECUMULATOR";
            if(DACShareData == undefined || DACShareData == "" || DACShareData == null){
              let DACObj =  getSyncResponse(shareRequest, clientConfigdata.CommonMethods.NodeServer + "ShareListEQC");  // LGTGTWINT-1891 || RizwanS || 20 Apr 2023
              DACShareData = DACObj.responseData;
            }//END
       
          }
    
          if(EQOTabYN.toUpperCase() == "YES"){
            MAPLE_TABLE.push("Options");
            EQC_TABLE.push("Options");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
            //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
            shareRequest.Product="VANI";
            if(EQOShareData == undefined || EQOShareData == "" || EQOShareData == null){
              let EQOObj =  getSyncResponse(shareRequest, clientConfigdata.CommonMethods.NodeServer + "ShareListEQC");  // LGTGTWINT-1891 || RizwanS || 20 Apr 2023
              EQOShareData = EQOObj.responseData;
            }//END
          }

          
          if(BENTabYN.toUpperCase() == "YES"){
            MAPLE_TABLE.push("BEN");
            EQC_TABLE.push("BEN");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
            //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
            shareRequest.Product="BEN";
            if(BENShareData == undefined || BENShareData == "" || BENShareData == null){
              let BENObj =  getSyncResponse(shareRequest, clientConfigdata.CommonMethods.NodeServer + "ShareListEQC");  // LGTGTWINT-1891 || RizwanS || 20 Apr 2023
              BENShareData = BENObj.responseData;
            }//END
          }

          ///----------------------------New Payoff's Addtion EQC :: Start--------------------------///
          ///---------------------------------------------------------------------------///
          
          // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
          if(PHXTabYN.toUpperCase() == "YES"){
            MAPLE_TABLE.push("Phoenix");
            EQC_TABLE.push("Phoenix");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
            //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
            shareRequest.Product="Phoenix";
            if(PHXShareData == undefined || PHXShareData == "" || PHXShareData == null){
             let PHXObj =  getSyncResponse(shareRequest, clientConfigdata.CommonMethods.NodeServer + "ShareListEQC");  // LGTGTWINT-1891 || RizwanS || 20 Apr 2023
             PHXShareData = PHXObj.responseData;
           }
            //END
          }
          //END

          // LGTGTWINT-1880 || Rizwan S || 19 Jul 2023
          if(DCNTabYN.toUpperCase() == "YES"){
            MAPLE_TABLE.push("DCN");
            EQC_TABLE.push("DCN");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
            shareRequest.Product="DCN";
            if(DCNShareData == undefined || DCNShareData == "" || DCNShareData == null){
             let DCNObj =  getSyncResponse(shareRequest, clientConfigdata.CommonMethods.NodeServer + "ShareListEQC");  // LGTGTWINT-1891 || RizwanS || 20 Apr 2023
             DCNShareData = DCNObj.responseData;
           }
          }
          //END

         // LGTGTWINT-1880 || Rizwan S || 19 Jul 2023
         if(TwinWinTabYN.toUpperCase() == "YES"){
          MAPLE_TABLE.push("TwinWin");
          EQC_TABLE.push("TwinWin");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
          shareRequest.Product="FCN";
          if(TwinWinShareData == undefined || TwinWinShareData == "" || TwinWinShareData == null){
           let TwinWinObj =  getSyncResponse(shareRequest, clientConfigdata.CommonMethods.NodeServer + "ShareListEQC");  // LGTGTWINT-1891 || RizwanS || 20 Apr 2023
           TwinWinShareData = TwinWinObj.responseData;
         }
        }
        //END  
        
        
        // Booster|| Rizwan S || 09 Oct 2023
          if(BoosterTabYN.toUpperCase() == "YES"){
            MAPLE_TABLE.push("Booster");
            EQC_TABLE.push("Booster");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
            shareRequest.Product="FCN";
            if(BoosterShareData == undefined || BoosterShareData == "" || BoosterShareData == null){
             let BoosterObj =  getSyncResponse(shareRequest, clientConfigdata.CommonMethods.NodeServer + "ShareListEQC");  // LGTGTWINT-1891 || RizwanS || 20 Apr 2023
             BoosterShareData = BoosterObj.responseData;
           }
          }
          //END  

             // Booster|| Rizwan S || 09 Oct 2023
             if(SharkfinTabYN.toUpperCase() == "YES"){
              MAPLE_TABLE.push("Sharkfin");
              EQC_TABLE.push("Sharkfin");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
              shareRequest.Product="FCN";
              if(SharkfinShareData == undefined || SharkfinShareData == "" || SharkfinShareData == null){
                  let SharkfinObj =  getSyncResponse(shareRequest, clientConfigdata.CommonMethods.NodeServer + "ShareListEQC");  // LGTGTWINT-1891 || RizwanS || 20 Apr 2023
                  SharkfinShareData = SharkfinObj.responseData;
             }
            }
            //END 


          ///----------------------------New Payoff's Addtion EQC :: END --------------------------///
          ///---------------------------------------------------------------------------///
          
          
    } 

    // Added by RizwanS || Check Available FXD Payoff's - Start | 04 Mrach 2023 
    // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023 
    // if (isFXDDealer || isIA || isRM || isDubaiRM || isDubaiIA) {
      if (isFXDDealer || isIA || isRM) { //LGTGTWINT-1954 || RizwanS || 03 May 2023
    
      let tempObj = getSyncResponse({
        "LoginID": userName, 
        "product_Code" : "" ,
        "requestID": userName + 'GetProdDetails' +  RequestIDGenerator(4) + RequestIDGenerator(4)
      }, clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/GetProdDetails");
      //LGTGTWINT 2035 | Chaitanya M | 25 May 2023 
      if(tempObj =="" || tempObj ==null || tempObj == undefined ){

      }else{

      FXDArray = tempObj;

       //Added By RizwanS || Check Mode of pricing via entity config || LGTGTWINT-1934 || FXD | Dynamic pricing on Instant pricer || 28 Apr 2023
       
      let getConfig = getSyncResponse({
        "EntityID": EntityID,        
        "requestID": userName + 'GetConfigsForDealEntry' + RequestIDGenerator(4) + RequestIDGenerator(4),
      }, clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/GetConfigsForDealEntry");
       
      // Start - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
      // AllowSolveForYN = getConfig.Configs[getConfig.Configs.findIndex(getConfig => getConfig.Setting_Name === 'AllowUserToPerformSolveForStrike')].Value;
      AllowSolveForYN = "NO";
      isRFS = false;
      // End - SolveFor Changes | LGTGTWINT-2382 | Chaitanya M | 02 Nov 2023
     
      //let vsdbv = getConfig.Configs[getConfig.Configs.findIndex(data => getConfig.Setting_Name === 'AllowDynamicCustomerProductMapping')].Value;
      // SATRT - COmmented as below is applicable fro RFS. || Chaitanya M | 07 Sep 2023
      // if (getConfig !== '') {
      //   // let pricingMode = getConfig.Configs[getConfig.Configs.findIndex(getConfig => getConfig.Setting_Name === 'FXDEnableWebsocketForPricing')].Value;
      //    let pricingMode = getConfig.Configs[getConfig.Configs.findIndex(getConfig => getConfig.Setting_Name === 'FXDEnableWebsocketForPricing')].Value;
      //    if(pricingMode.toUpperCase() == "YES"){
      //      isRFS = true;
      //     //if(sessionStorage.getItem("signalRconnectionID_") == undefined || sessionStorage.getItem("signalRconnectionID_") == null || sessionStorage.getItem("signalRconnectionID_") == ""){ //LGTGTWINT-1934  || RizwanS || 01 Jun 2023
      //       firstload(); // Connect to signalR Hub if logged in with FXD user
      //       //}
      //    }else{
      //      isRFS = false;
      //    }
      // }else{
      //    //ValidateFieldmail("OrderPlacedAll", getConfig.GetConfigsForDealEntryResult.A_ResponseHeader.FailedReason,true,"N");
      //    console.log(getConfig.GetConfigsForDealEntryResult.A_ResponseHeader.FailedReason); //LGTGTWINT-1934 || Chaitanya M  || 01 Jun 2023
      //  } 

      // END - COmmented as below is applicable fro RFS. || Chaitanya M | 07 Sep 2023
      }
       //END
      
      if(FXDArray){

        for(arraOBJ of FXDArray){

          if(arraOBJ.product_code.toUpperCase().includes("TEKO") || arraOBJ.product_code.toUpperCase().includes("TARFSELL") || arraOBJ.product_code.toUpperCase().includes("STRADDLE") || arraOBJ.product_code.toUpperCase().includes("STRANGLE") || arraOBJ.product_code.toUpperCase().includes("RSKREV")){  // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023

              if(!MAPLE_TABLE.includes("FXTRF")){
                
                    MAPLE_TABLE.push("FXTRF");
                    FXD_TABLE.push("FXTRF");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
              }

              if(arraOBJ.product_code.toUpperCase().includes("STRADDLE") || arraOBJ.product_code.toUpperCase().includes("STRANGLE") || arraOBJ.product_code.toUpperCase().includes("RSKREV") || arraOBJ.product_code.toUpperCase().includes("OPSPRD")){  // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
          
                // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
                if(!MAPLE_TABLE.includes("Strategies")){
                  
                  MAPLE_TABLE.push("Strategies");
                  FXD_TABLE.push("Strategies");  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
                 } 
                 //END
  
               }

          } else{


              if(!arraOBJ.product_code.includes("FX")){

                MAPLE_TABLE.push("FX" + arraOBJ.product_code.toLocaleUpperCase());
                FXD_TABLE.push("FX" + arraOBJ.product_code.toLocaleUpperCase());  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
    
              } else{
    
                if(arraOBJ.product_code.toLocaleUpperCase() != "FXDQ"){  //LGTCLI-417 || RizwanS || 04 May 2023
                MAPLE_TABLE.push(arraOBJ.product_code.toLocaleUpperCase());
                FXD_TABLE.push(arraOBJ.product_code.toLocaleUpperCase());  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023
                } 
    
              }

          }

      }

      getallFXDProductDeatils(FXDArray);
      }

      
      ///----------------------------New Payoff's Addtion FXD :: Start--------------------------///
      ///---------------------------------------------------------------------------///
          

      // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
      // let DCITabYN = "YES"
      // if(DCITabYN.toUpperCase() == "YES"){
      //     MAPLE_TABLE.push("FXDCI");
      // }
      //END

      
    ///----------------------------New Payoff's Addtion FXD :: END --------------------------///
    ///---------------------------------------------------------------------------///
          

    }


    // if(sessionStorage.getItem("HomeEntityID").toString() == "50"){ // ShaheenL AND VinayakG for Bonds
    //   if(true){
    //       MAPLE_TABLE.push("FIBOND");
    //   }
    // }
    // Added by RizwanS || Bind Mapped payoff's - Start | 04 Mrach 2023 

    let str = "";
    let str1 = "";
    let str2 = "";

    for(productValue of MAPLE_TABLE){

      if((productValue ==="ELN")|| (productValue==="FCN")|| (productValue==="AQDQ")|| (productValue ==="DRA")|| (productValue==="BEN")|| (productValue == "Options") || (productValue == "DCN" || (productValue == "TwinWin") || (productValue == "Phoenix" || productValue == "Booster" || productValue == "Sharkfin"))){ // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023

            if (str.length == 0) {
              str = str + `<label class="container">
      
                      <input class="cbVisibility_SelectAll1 cbVisibility" style="float:right" id="cbSelectAll" onclick="selectAllforlist(this,'cbVisibility1');"
                          type="checkbox">
                      <span style= "margin-right:5px; margin-left: 5px;"   class="checkmark "></span>
                  </label> ` + "<h5  style='padding-left:35px;'>" + "EQC" + "</h5>" + "<ul>";
            }
      
            str = str + `
            <li>
                <label class="container">
                    <span class="cadb_product">${productValue}</span>
                    <input class="cbVisibility cbVisibility1" id="${productValue}" type="checkbox" onclick="checkclick( 'cbVisibility1','cbVisibility_SelectAll1')">
                        <span class="checkmark"></span>
                                        </label>
                                    </li>`;
      
          
      
       }

       if(productValue ==="FXAQ" || productValue ==="FXTRF" || productValue ==="FXPIVOT" || productValue ==="FXOPTION" || productValue ==="FXDCI" || productValue ==="Strategies"){ //LGTCLI-417 || RizwanS || 04 May 2023
            let productname;
            if(productValue == "FXAQ"){
              productname = "FX AQ/DQ";
            }else{
              productname= productValue;
            }

            if (str1.length == 0) {
              str1 = str1 + `<label class="container">

                  <input class="cbVisibility_SelectAll2 cbVisibility  " id="cbSelectAll" onclick="selectAllforlist(this, 'cbVisibility2');"
                      type="checkbox">

                  <span style= "margin-right:5px; margin-left: 5px;" class="checkmark"></span>
              </label> ` + "<h5  style='padding-left:35px;'>" + "FXD" + "</h5>" + "<ul>";
              }
// LGTCLI-417 || RizwanS || 04 May 2023
        str1 = str1 + `
                      <li>
                          <label class="container">
                              <span class="cadb_product">${productname}</span>
                              <input class="cbVisibility cbVisibility2" id="${productValue}" type="checkbox" onclick="checkclick( 'cbVisibility2','cbVisibility_SelectAll2')">
                                  <span class="checkmark"></span>
                                                      </label>
                                                  </li>`;

        

       }
       //INVESTMENTS Products Start
       if(productValue == "FIBOND"){

        if (str2.length == 0) {
          str2 = str2 + `<label class="container">
                  <input class="cbVisibility_SelectAll3 cbVisibility" style="float:right" id="cbSelectAll" onclick="selectAllforlist(this,'cbVisibility3');"
                      type="checkbox">
                  <span style= "margin-right:5px; margin-left: 5px;"   class="checkmark "></span>
              </label> ` + "<h5  style='padding-left:35px;'>" + "INVESTMENTS" + "</h5>" + "<ul>";
        }
        str2 = str2 + `
        <li>
            <label class="container">
                <span class="cadb_product">Bonds</span>
                <input class="cbVisibility cbVisibility3" id="${productValue}" type="checkbox" onclick="checkclick( 'cbVisibility3','cbVisibility_SelectAll3')">
                    <span class="checkmark"></span>
                                    </label>
                                </li>`;
       }
    }

    str = str + `</ul>`;
    $("#MAPLEACTBL").empty().append(str);
    str1 = str1 + `</ul>`;
    $("#MAPLEACTBL").append(str1);
    str2 = str2 + `</ul>`;
    $("#MAPLEACTBL").append(str2);

    // END

  } catch (error) {
    console.log(error.message);
  }
}//END

//Added by RizwanS || Button configurtion for payoff's || 28 Dec 2022 ||
function bindFeatures() {
  try {

   // RijwanS || Save Trade|| Button configurtion as per user group FXD payoff's || 24 Dec 2022
   // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023 
    if (isRM || isIA) { //LGTGTWINT-1954 || RizwanS || 03 May 2023

    $('button.bookReq').each(function () {

        let productname = $($(this).parents(".sorting").find(".productName")).attr('id');

            if (productname.includes("FX") || productname.includes("Strategies")) {

                $(this).parent('td').remove();
            }

    })

   } //Order button visibility

  // RijwanS || Route to dealer || Button configurtion as per user group FXD payoff's || 24 Dec 2022

    let btnAccess = false;

   // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023 
    // if(isFXDDealer || isIA){ //LGTGTWINT-1954 || RizwanS || 03 May 2023

    //   let buttonAccessobj = getSyncResponse({}, clientConfigdata.CommonMethods.NodeServer + "GetConfigurableCommonDataIP");
          
    //       btnArray = buttonAccessobj.Get_Configurable_Common_DataResult;

    //       if(btnArray){
    //         for(i=0; i< btnArray.length;i++){
    //           if((buttonAccessobj.Get_Configurable_Common_DataResult[i].Misc1).toUpperCase() == sessionStorage.getItem("FinIQGroupID").toString().toUpperCase()){
    //             btnAccess = true;
    //             break;
    //           }
              
    //         }

    //       }
    // }


  if (isFXDDealer) {

      $('button.bookRtoD').each(function () {

          let productname = $($(this).parents(".sorting").find(".productName")).attr('id');

              if (productname.includes("FX") || productname.includes("Strategies")) {

                  $(this).parent('td').remove();
              }

      })


      $('button.bookReq').each(function () {

        let productname = $($(this).parents(".sorting").find(".productName")).attr('id');

            if (productname.includes("FX") || productname.includes("Strategies")) {

                $(this).parent('td').remove();
            }

    })
    

  }  //Route to dealer button visibility

  // RijwanS || Save Trade Idea || Button configurtion as per user group FXD payoff's || 24 Dec 2022
  if (btnAccess == false) {

      $('img.btnSaveTradeIdea').each(function () {
  
          let productname = $($(this).parents(".sorting").find(".productName")).attr('id');
  
              if (productname.includes("FX") || productname.includes("Strategies")) {
  
                  $(this).remove();
              }
  
      })
  
  } //Save trade Idea button visibility


  if (clientConfigdata.CommonMethods.TRADEALL == "Y") {

    $(document).find("[id^=btnBack1]").each(function () {
      var curCell = $(this);
      curCell.show();

    });
  } else {
  }

    $(document).find("[id^=btnDocgen]").each(function () {
      var curCell = $(this);
      curCell.hide();
    });

    if (clientConfigdata.CommonMethods.BOOKALL == "Y") {
      $(document).find("[id^=btntradeAll]").each(function () {
        var curCell = $(this);
        curCell.show();
      });
    } else {
    }

    if (clientConfigdata.CommonMethods.UNPINALL == "Y") {
      $(document).find("[id^=unPinAll]").each(function () {
        var curCell = $(this);
        curCell.show();
      });
    } else {
    }

    if (clientConfigdata.CommonMethods.FLIP == "Y") {
      $(document).find("[id^=flip]").each(function () {
        var curCell = $(this);
        curCell.show();
      });
    } else {
    }

    if (clientConfigdata.CommonMethods.BLINK == "Y") {
      $(document).find("[id^=blink]").each(function () {
        var curCell = $(this);
        curCell.show();
      });
    } else {
    }

    if (clientConfigdata.CommonMethods.DELETE == "Y") {
      $(document).find("[id^=btnDelete]").each(function () {
        var curCell = $(this);
        curCell.show();
      });
    } else {
    }

    if (clientConfigdata.CommonMethods.CREATELAYOUT == "Y") {
      $(document).find("[id^=btnCreateLayout]").each(function () {
        var curCell = $(this);
        curCell.show();
      });
    } else {
    }

    if (clientConfigdata.CommonMethods.CLEARGRAPH == "Y") {
      $(document).find("[id^=btnClearAllGraphs]").each(function () {
        var curCell = $(this);
        curCell.show();
      });
    } else {
    }

    if (clientConfigdata.CommonMethods.REF == "Y") {
      $(document).find("[id^=Ref]").each(function () {
        var curCell = $(this);
        curCell.show();
      });
    } else {
    }
    
    if (clientConfigdata.CommonMethods.IMPORTEXPORT == "Y") {
      $(document).find("[id^=ImportExport1]").each(function () {
        var curCell = $(this);
        curCell.show();
      });
    } else {
    }

    if (!clientConfigdata.CommonMethods.SHOW_HISTORY_CHARTS) {
      $("img.graphBtn").each(function () {
        $(this).hide();
      });
    }
    if (clientConfigdata.CommonMethods.MAILALL == "Y") {
      $(document).find("[id^=btnmail]").each(function () {
        var curCell = $(this);
        curCell.show();
      });
    } else {
    }

    ////  LGTGTWINT-1912 | Chaitanya M | 28 April 2023 
    if (clientConfigdata.CommonMethods.CLEARPRICE == "Y") {
      $(document).find("[id^=btnclearprice]").each(function () {
        var curCell = $(this);
        curCell.show();
      });
    } else {
      
    }
    //End

    // Start : Displaying ViewSchedule Button on config change| Chaitanya | 12-Jan-2023
    if(clientConfigdata.FXDCommonMethods.DisplayViewSchedule == "N"){
    $('img.viewschedule').each(function () {
      
        $(this).hide();

      })
    }

    // LGTGTWINT-2147 | Chaitanya M | 27 Jun 2023
    // if(sessionStorage.getItem("HideAllClientLogos").toString().toUpperCase() === "YES"){

    //   $('div.showlogoYN').each(function () {
            
    //     $(this).removeClass("client-logo-class-IP-FXD client-logo-class-IP-EQC");         
              
    //   });

    // }
    //End
      
    // End

    // HSBCFXEINT-22 || Remove Hedge Type from Instant Pricer

      if (clientConfigdata.CommonMethods.HEDGEPANELYN == "N") {
        $(document).find("[id^=FXOHedgepanel]").each(function () {
          $(this).remove();
        });
      } 
      
      if (clientConfigdata.CommonMethods.MARKETDATAYN == "N") {
        $(document).find("[id^=btnMarketData]").each(function () {
          $(this).remove();
        });
      }
    //END

  } catch (error) {
    console.log("bindFeatures :: Features Not Mapped", error);
  }
}//END


//-----------------------------------------EQC Configuartion :: Start -------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------//

//Added by RizwanS || Get Default Config Values EQC || LGTGTWINT-487 || 02 Jan 2023
function GetDefaultPersonalSettingsInfoEQC() {
    try {
        $.ajax({
            async: false,
            crossDomain: true,
            type: 'GET',
            // url: clientConfigdata.CommonMethods.NodeServer + "getEQConfigNames",
            url: "assets/Instant-Pricer/CommonJS/defaultConfig.json",
            data: "",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                EQCConfigNameObj = data;

                fetchAllEQCConfigs();

            },
            error: function (error) { }
        });
    } catch (error) {
        console.log(error.message);

    }
}//END

//Added by RizwanS || Get Config Value EQC via API || LGTGTWINT-487 || 02 Jan 2023
function GetConfigValuesEQC(AllEQCConfigs) {

  try {
 
    var objCfgList = [];
    
    var cfgRes;

    for (let [key, value] of AllEQCConfigs) {
      // console.log(`${key} = ${value}`);
      var obj =
        
          {
            "ConfigName": `${key}`,
            "DefaultValue": `${value}`
          }
           
          objCfgList.push(obj)
    }

      $.ajax({
          url: clientConfigdata.CommonMethods.NodeServer + "GetConfigValuesEQC",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          autoFill: true,
          type: 'POST',
          async: false,
          crossDomain: true,
          data: JSON.stringify({
            "userName":sessionStorage.getItem("EQC_UserName").toString(),
            "ConfigList":objCfgList,
            "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString()
          }),
          success: function (data) {
              cfgRes = data;
          },
          error: function (xhr, ajaxOptions, thrownError) {
              console.log(thrownError);
              return "";
          }
      });

      // console.log(cfgRes);

      return cfgRes;

  } catch (error) {
      console.log(error.message);
      return "";
  }
}//END

//Added by RizwanS || filter Config value for particular config || LGTGTWINT-487 || 02 Jan 2023
function filtertConfigValueFromArray(configArray,ConfigName){
  try{

      let configVal = '';

       $.grep(configArray, function (element, index) {
         if (element.ConfigName == ConfigName){
          configVal = element.DefaultValue
         } 
      });

      return configVal;

  }catch(error){
      console.log(error.message)
  }
}//END

//Added by RizwanS || filter Config value for particular config || LGTGTWINT-487 || 02 Jan 2023
function filtertConfigValueArray(configArray,ConfigName){
  try{
      
        return configArray[0][ConfigName];

  }catch(error){
      console.log(error.message)
  }
}//END

//Added by RizwanS || getConfig value all EQC payooff's|| LGTGTWINT-487 || 02 Jan 2023
function fetchAllEQCConfigs(){

  try{

      // Set Config Values :: Start

      const collection = new Map();

      //ELN

      collection.set("ELN_AllowedTenorInMonths", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListELN, "ELN_AllowedTenorInMonths"));
      collection.set("ELN_AllowedTenorInYears", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListELN, "ELN_AllowedTenorInYears"));
      collection.set("EQC_ELNMaxKO", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListELN, "EQC_ELNMaxKO"));
      collection.set("EQC_ELNMinKO", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListELN, "EQC_ELNMinKO"));
      collection.set("EQC_MaxUpfront", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListELN, "EQC_MaxUpfront"));
      collection.set("EQC_ELN_Allowed_Max_Strike", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListELN, "EQC_ELN_Allowed_Max_Strike"));
      collection.set("EQC_ShowELNTab_YN", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListELN, "EQC_ShowELNTab_YN"));
      collection.set("FINIQ_ELN_RFQ", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListELN, "FINIQ_ELN_RFQ")); //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
      collection.set("EQC_SHOW_DAILYCLOSE_KO", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListELN, "EQC_SHOW_DAILYCLOSE_KO")); // LGTGTWINT-2279 || KO Daily Close to be removed from Instant Pricer || 07 Aug 2023

     //FCNDRA
     collection.set("FCN_AllowedTenorInMonths", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListDRAFCN, "FCN_AllowedTenorInMonths"));
     collection.set("FCN_AllowedTenorInYears", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListDRAFCN, "FCN_AllowedTenorInYears"));
     collection.set("EQC_DRAFCNMaxKO", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListDRAFCN, "EQC_DRAFCNMaxKO"));
     collection.set("EQC_DRAFCNMinKO", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListDRAFCN, "EQC_DRAFCNMinKO"));
     collection.set("EQC_ShowFCNTab_YN", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListDRAFCN, "EQC_ShowFCNTab_YN"));
     collection.set("EQC_VisibleOffUpfrontField", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListDRAFCN, "EQC_VisibleOffUpfrontField"));
     collection.set("FINIQ_DRAFCN_RFQ", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListDRAFCN, "FINIQ_DRAFCN_RFQ")); //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
     collection.set("EQC_EnableStrikeBelowKO_FCNDRA", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListDRAFCN, "EQC_EnableStrikeBelowKO_FCNDRA")); // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
     collection.set("EQC_DRAFCN_Allow_Strike_Beyond_100Pct", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListDRAFCN, "EQC_DRAFCN_Allow_Strike_Beyond_100Pct")); // LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023


     //DRA
     collection.set("DRA_AllowedTenorInMonths", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListDRAFCN, "DRA_AllowedTenorInMonths"));
     collection.set("DRA_AllowedTenorInYears", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListDRAFCN, "DRA_AllowedTenorInYears"));
     collection.set("EQC_ShowDRATab_YN", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListDRAFCN, "EQC_ShowDRATab_YN"));


     //BEN

     collection.set("BEN_AllowedTenorInMonths", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListBEN, "BEN_AllowedTenorInMonths"));
     collection.set("BEN_AllowedTenorInYears", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListBEN, "BEN_AllowedTenorInYears"));
     collection.set("EQC_ShowBENTab_YN", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListBEN, "EQC_ShowBENTab_YN"));
     collection.set("EQC_VisibleOffUpfrontField", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListBEN, "EQC_VisibleOffUpfrontField"));
     collection.set("EQC_BEN_KI_Disable_YN", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListBEN, "EQC_BEN_KI_Disable_YN")); //RizwanS || LGTGTWINT-2025 || 30 May 2023 
     collection.set("FINIQ_BEN_RFQ", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListBEN, "FINIQ_BEN_RFQ")); //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
     

    //AQDQ

    collection.set("ACC_AllowedTenorInMonths", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListAccDec, "ACC_AllowedTenorInMonths"));
    collection.set("ACC_AllowedTenorInYears", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListAccDec, "ACC_AllowedTenorInYears"));
    collection.set("DAC_AllowedTenorInMonths", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListAccDec, "DAC_AllowedTenorInMonths"));
    collection.set("DEC_AllowedTenorInYears", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListAccDec, "DEC_AllowedTenorInYears"));
    collection.set("EQC_AccMinKO", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListAccDec, "EQC_AccMinKO"));
    collection.set("EQC_DacMaxKO", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListAccDec, "EQC_DacMaxKO")); //LGTGTWINT-1189 & LGTGTWINT-1188
    collection.set("EQC_AccMinStrike", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListAccDec, "EQC_AccMinStrike"));
    collection.set("EQC_DacMaxStrike", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListAccDec, "EQC_DacMaxStrike"));
    collection.set("EQC_ShowAQTab_YN", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListAccDec, "EQC_ShowAQTab_YN")); // Corrected config names for showing AQDQ | Chaitanya M | 21 Sep 2023
    collection.set("EQC_ShowDQTab_YN", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListAccDec, "EQC_ShowDQTab_YN")); // Corrected config names for showing AQDQ | Chaitanya M | 21 Sep 2023
    collection.set("FINIQ_AccumDeccum_RFQ", filtertConfigValueFromArray(EQCConfigNameObj.ConfigListAccDec, "FINIQ_AccumDeccum_RFQ")); //LGTGTWINT-2154 || RizwanS || 27 Jun 2023


    //EQO

    collection.set("EQO_AllowedTenorInMonths", filtertConfigValueFromArray(EQCConfigNameObj.ConfigEQO, "EQO_AllowedTenorInMonths"));
    collection.set("EQO_AllowedTenorInYears", filtertConfigValueFromArray(EQCConfigNameObj.ConfigEQO, "EQO_AllowedTenorInYears"));
    collection.set("EQC_CallMaxStrike", filtertConfigValueFromArray(EQCConfigNameObj.ConfigEQO, "EQC_CallMaxStrike"));
    collection.set("EQC_CallMinStrike", filtertConfigValueFromArray(EQCConfigNameObj.ConfigEQO, "EQC_CallMinStrike"));
    collection.set("EQC_PutMaxStrike", filtertConfigValueFromArray(EQCConfigNameObj.ConfigEQO, "EQC_PutMaxStrike"));
    collection.set("EQC_PutMinStrike", filtertConfigValueFromArray(EQCConfigNameObj.ConfigEQO, "EQC_PutMinStrike"));
    collection.set("EQO_ShowEQOTab", filtertConfigValueFromArray(EQCConfigNameObj.ConfigEQO, "EQO_ShowEQOTab"));
    collection.set("FINIQ_EQO_RFQ", filtertConfigValueFromArray(EQCConfigNameObj.ConfigEQO, "FINIQ_EQO_RFQ")); //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
    //END

    // EQC Common Configs :: Start //LGTGTWINT-1954 || RizwanS || 03 May 2023

    collection.set("EQC_AllowOrderviaInstantPricer", filtertConfigValueFromArray(EQCConfigNameObj.CommonConfig, "EQC_AllowOrderviaInstantPricer"));
    collection.set("EQC_Show_SendOrderRequest_On_Multistock", filtertConfigValueFromArray(EQCConfigNameObj.CommonConfig, "EQC_Show_SendOrderRequest_On_Multistock")); //LGTGTWINT-1981 || RizwanS || 12 May 2023
    collection.set("EQC_ShowExpandButtonOnOTC", filtertConfigValueFromArray(EQCConfigNameObj.CommonConfig, "EQC_ShowExpandButtonOnOTC")); //LGTGTWINT-1981 || RizwanS || 12 May 2023
    collection.set("EQC_HideCounterparty", filtertConfigValueFromArray(EQCConfigNameObj.CommonConfig, "EQC_HideCounterparty")); //LGTGTWINT-1981 || RizwanS || 12 May 2023
    collection.set("EQC_ClientName", filtertConfigValueFromArray(EQCConfigNameObj.CommonConfig, "EQC_ClientName")); //LGTGTWINT-1981 || RizwanS || 12 May 2023
    collection.set("EQC_Notes_Display_Count_On_Multistock", filtertConfigValueFromArray(EQCConfigNameObj.CommonConfig, "EQC_Notes_Display_Count_On_Multistock")); //LGTGTWINT-1981 || RizwanS || 12 May 2023
    collection.set("EQC_Show_OrderQuantity_On_Multistock", filtertConfigValueFromArray(EQCConfigNameObj.CommonConfig, "EQC_Show_OrderQuantity_On_Multistock")); //LGTGTWINT-1981 || RizwanS || 12 May 2023
    collection.set("EQC_SendSuitabilityRequestYN", filtertConfigValueFromArray(EQCConfigNameObj.CommonConfig, "EQC_SendSuitabilityRequestYN")); //RizwanS || LGTGTWINT-2295 || 11 Aug 2023
    
    //END

     //DCN Configs || RizwanS || 19 Jul 2023

     collection.set("EQC_ShowDCNTab_YN", filtertConfigValueFromArray(EQCConfigNameObj.ConfigDCN, "EQC_ShowDCNTab_YN")); //LGTGTWINT-1981 || RizwanS || 12 May 2023

     //END

     //PHX Configs || RizwanS || 19 Jul 2023

     collection.set("EQC_ShowPHXTab_YN", filtertConfigValueFromArray(EQCConfigNameObj.ConfigPHX, "EQC_ShowPHXTab_YN")); //LGTGTWINT-1981 || RizwanS || 12 May 2023

     //END

     //TwinWin Configs || RizwanS || 19 Jul 2023
     
     collection.set("EQC_ShowTwinWinTab_YN", filtertConfigValueFromArray(EQCConfigNameObj.ConfigTwinWin, "EQC_ShowTwinWinTab_YN")); //LGTGTWINT-1981 || RizwanS || 12 May 2023


     //END

     //Booster Configs || RizwanS || 09 Oct 2023
     
     collection.set("EQC_ShowBoosterTab_YN", filtertConfigValueFromArray(EQCConfigNameObj.ConfigBooster, "EQC_ShowBoosterTab_YN")); //LGTGTWINT-1981 || RizwanS || 12 May 2023

     //END

    //Sharkfin Configs || RizwanS || 20 Oct 2023
     
     collection.set("EQC_ShowBoosterTab_YN", filtertConfigValueFromArray(EQCConfigNameObj.ConfigBooster, "EQC_ShowBoosterTab_YN")); //LGTGTWINT-1981 || RizwanS || 12 May 2023

     //END

     // Get Config Values from API :: Start

      var getcfgdata=  GetConfigValuesEQC(collection);

      var res;

      if(getcfgdata.message != ""){

      }else{
          res = JSON.parse( getcfgdata.responseData );
      }

      //----------------------------------------------------ELN :: Start -----------------------------------------------------------//
 
      ELNAllowedTenorinMonths =   filtertConfigValueArray(res, "ELN_AllowedTenorInMonths");
      ELNAllowedTenorinYears =    filtertConfigValueArray(res, "ELN_AllowedTenorInYears");
      ELNMaxKO = filtertConfigValueArray(res, "EQC_ELNMaxKO");
      ELNMinKO = filtertConfigValueArray(res, "EQC_ELNMinKO");
      ELNMaxUpfront = filtertConfigValueArray(res, "EQC_MaxUpfront"); 
      ELNMaxStrike =  filtertConfigValueArray(res, "EQC_ELN_Allowed_Max_Strike");
      ELNTabYN = filtertConfigValueArray(res, "EQC_ShowELNTab_YN");
      ELNrequestCount = Number(filtertConfigValueArray(res, "FINIQ_ELN_RFQ")) / 5; //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
      ELNSHOWDAILYCLOSEKO = filtertConfigValueArray(res,"EQC_SHOW_DAILYCLOSE_KO"); // LGTGTWINT-2279 || KO Daily Close to be removed from Instant Pricer || 07 Aug 2023
      
    //-------------------------------------------------FCN/DRA :: Start---------------------------------------------------------------//

      FCNAllowedTenorinMonths =   filtertConfigValueArray(res, "FCN_AllowedTenorInMonths");
      FCNAllowedTenorinYears =   filtertConfigValueArray(res, "FCN_AllowedTenorInYears");
      DRAFCNMaxKO =   filtertConfigValueArray(res, "EQC_DRAFCNMaxKO");
      DRAFCNMinKO =   filtertConfigValueArray(res, "EQC_DRAFCNMinKO");
      FCNTabYN =   filtertConfigValueArray(res, "EQC_ShowFCNTab_YN");
      DRAFCNUpfrontYN =  filtertConfigValueArray(res, "EQC_VisibleOffUpfrontField");
      DRAFCNrequestCount = Number(filtertConfigValueArray(res, "FINIQ_DRAFCN_RFQ")) / 5; //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
      DRAFCNEnableStrikeBelowKO = filtertConfigValueArray(res, "EQC_EnableStrikeBelowKO_FCNDRA"); //LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
      DRAFCNStrikeBeyond100Pct = filtertConfigValueArray(res, "EQC_DRAFCN_Allow_Strike_Beyond_100Pct"); //LGTGTWINT-2315 | Chaitanya M | 17 Aug 2023
    //-------------------------------------------------DRA :: Start---------------------------------------------------------------//

     DRAAllowedTenorinMonths =   filtertConfigValueArray(res, "DRA_AllowedTenorInMonths");
     DRAAllowedTenorinYears =   filtertConfigValueArray(res, "DRA_AllowedTenorInYears");
     DRATabYN =   filtertConfigValueArray(res, "EQC_ShowDRATab_YN");


    //-------------------------------------------------BEN :: Start---------------------------------------------------------------//

      BENAllowedTenorinMonths =   filtertConfigValueArray(res, "BEN_AllowedTenorInMonths");
      BENAllowedTenorinYears =   filtertConfigValueArray(res, "BEN_AllowedTenorInYears");
      BENTabYN =   filtertConfigValueArray(res, "EQC_ShowBENTab_YN");
      BENUpfrontYN =  filtertConfigValueArray(res, "EQC_VisibleOffUpfrontField");
      BENKIYN = filtertConfigValueArray(res, "EQC_BEN_KI_Disable_YN"); //RizwanS || LGTGTWINT-2025 || 30 May 2023 
      BENrequestCount = Number(filtertConfigValueArray(res, "FINIQ_BEN_RFQ")) / 5; //LGTGTWINT-2154 || RizwanS || 27 Jun 2023

     //-------------------------------------------------ACCDAC :: Start---------------------------------------------------------------//


     ACCAllowedTenorinMonths =   filtertConfigValueArray(res, "ACC_AllowedTenorInMonths");
     ACCAllowedTenorinYears =   filtertConfigValueArray(res, "ACC_AllowedTenorInYears");
     DACAllowedTenorinMonths =   filtertConfigValueArray(res, "DAC_AllowedTenorInMonths");
     DACAllowedTenorinYears =   filtertConfigValueArray(res, "DEC_AllowedTenorInYears");
     ACCMinKO =   filtertConfigValueArray(res, "EQC_AccMinKO");
     DACMaxKO =   filtertConfigValueArray(res, "EQC_DacMaxKO"); //LGTGTWINT-1189 & LGTGTWINT-1188
     ACCMinStrike =   filtertConfigValueArray(res, "EQC_AccMinStrike");
     DACMaxStrike =   filtertConfigValueArray(res, "EQC_DacMaxStrike"); 
     ACCTabYN =   filtertConfigValueArray(res, "EQC_ShowAQTab_YN"); // Corrected config names for showing AQDQ | Chaitanya M | 21 Sep 2023
     DECTabYN =   filtertConfigValueArray(res, "EQC_ShowDQTab_YN"); // Corrected config names for showing AQDQ | Chaitanya M | 21 Sep 2023
     ACCDACrequestCount = Number(filtertConfigValueArray(res, "FINIQ_AccumDeccum_RFQ")) / 5; //LGTGTWINT-2154 || RizwanS || 27 Jun 2023


     //-------------------------------------------------EQO :: Start---------------------------------------------------------------//

     EQOAllowedTenorinMonths =   filtertConfigValueArray(res, "EQO_AllowedTenorInMonths");
     EQOAllowedTenorinYears =   filtertConfigValueArray(res, "EQO_AllowedTenorInYears");
     EQOCallMaxStrike = filtertConfigValueArray(res, "EQC_CallMaxStrike");
     EQOCallMinStrike = filtertConfigValueArray(res, "EQC_CallMinStrike");
     EQOPutMaxStrike = filtertConfigValueArray(res, "EQC_PutMaxStrike");
     EQOPutMinStrike = filtertConfigValueArray(res, "EQC_PutMinStrike");
     EQOTabYN =   filtertConfigValueArray(res, "EQO_ShowEQOTab");
     EQOrequestCount = Number(filtertConfigValueArray(res, "FINIQ_EQO_RFQ")) / 5; //LGTGTWINT-2154 || RizwanS || 27 Jun 2023
      //-------------------------------------------------EQC Common Configs :: Start //LGTGTWINT-1954 || RizwanS || 03 May 2023---------------------------------------------------------------//

      AllowOrderviaInstantPricer =   filtertConfigValueArray(res, "EQC_AllowOrderviaInstantPricer");
      AllowOrderEmailviaInstantPricer =   filtertConfigValueArray(res, "EQC_Show_SendOrderRequest_On_Multistock"); //LGTGTWINT-1981 || RizwanS || 12 May 2023
      ShowExpandButtonOnOTC = filtertConfigValueArray(res, "EQC_ShowExpandButtonOnOTC"); //LGTGTWINT-1981 || RizwanS || 12 May 2023
      OTCEQC_Cpty_BuyerCode = filtertConfigValueArray(res, "EQC_ClientName"); //LGTGTWINT-1981 || RizwanS || 12 May 2023
      OTCHideCounterparty = filtertConfigValueArray(res, "EQC_HideCounterparty"); //LGTGTWINT-1981 || RizwanS || 12 May 2023
      NotesBestPriceDisplayCount = filtertConfigValueArray(res, "EQC_Notes_Display_Count_On_Multistock"); //LGTGTWINT-1981 || RizwanS || 12 May 2023
      NotionalMinMaxCheck = filtertConfigValueArray(res, "EQC_Show_OrderQuantity_On_Multistock"); //LGTGTWINT-1981 || RizwanS || 12 May 2023
      EQCSendSuitabilityRequestYN = filtertConfigValueArray(res, "EQC_SendSuitabilityRequestYN"); //RizwanS || LGTGTWINT-2295 || 11 Aug 2023

      //------------------------------------------------------------END------------------------------------------//
      //------------------------------------------------------------------------------------------------------//



      //-------------------------------------------------DCN :: Start---------------------------------------------//
      DCNTabYN =   filtertConfigValueArray(res, "EQC_ShowDCNTab_YN");
      //----------------------------------------------------END------------------------------------------//


      //-------------------------------------------------PHX :: Start--------------------------------------------//
      PHXTabYN =   filtertConfigValueArray(res, "EQC_ShowPHXTab_YN");
      //----------------------------------------------------END------------------------------------------//

      //-------------------------------------------------TwinWin :: Start---------------------------------------------//
      TwinWinTabYN =   filtertConfigValueArray(res, "EQC_ShowTwinWinTab_YN");
       //----------------------------------------------------END------------------------------------------//

      //-------------------------------------------------Booster :: Start---------------------------------------------//
      BoosterTabYN =   filtertConfigValueArray(res, "EQC_ShowBoosterTab_YN");
      //----------------------------------------------------END------------------------------------------//

      //-------------------------------------------------Sharkfin :: Start---------------------------------------------//
      SharkfinTabYN =   filtertConfigValueArray(res, "EQC_ShowBoosterTab_YN");
      //----------------------------------------------------END------------------------------------------//



  }catch(er){

    console.log(er.message);

  }

}//END

//-----------------------------------------EQC Configuartion :: END ---------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------//

function RequestIDGenerator(length) {

  let result = '';
  let d = new Date();
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {

    result += characters.charAt(Math.floor(Math.random() * charactersLength));

  }

  result = result + d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();
  return result;
} //INT1FIN47-768Gateway Markets Instant Pricing issue

// Added to ferch non best price reasons || 12 01 2023 || LGTGTWINT-574 Instant Pricing: Non Best price Reason field to have default message

var NonBestPriceReasons = "";

function getNonBestPriceReasons() {
  try {

    request_getDataFromAPI({
      
      "userName": sessionStorage.getItem("FinIQUserID").toString(),
      "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
      "EntityID": EntityID

    }, clientConfigdata.CommonMethods.NodeServer + "NonBestPriceReasonsIP").then(data => {


       NonBestPriceReasons= JSON.parse(data.responseData);

    }
    )
  } catch (error) {
    console.log(error.message);
    endLoader();
  }
}

function fillNonBestPriceReasons(dataArray, ctlID)
{
  try {

      var x = document.getElementById(ctlID);
      if (x.options.length != 0) {
          $(x).empty();
      }
      for (var i = 0; i < dataArray.length; i++) {
          var option = document.createElement("option");
          option.text = dataArray[i].Data_Value;
          option.value = dataArray[i].Misc1;
          x.add(option);
      }
  } catch (error) {
      console.log(error.message);
  }
}

// EMD

// LGTGTWINT-479 | Instant Pricing: Limit Price to be rounded upto 4 decimals on order confirmation popup | Atharva A
function FormatNotionalCommon2(notional, object, ccy) {
  try {
    var thistileFX = $(object).find("td.sorting")[0];

    var rel_Amount = /\d+(K$(?![K|M|B])|M$(?![K|M|B])|B$(?![K|M|B]))/i;
    var rel_Char = /(K|M|B)/i;
    var pos;
    var number;
    var rel_invalidChar = /[\#|\@|!|\&|\*|\%|\\|\+|\*|\^]/;

    if (notional.search(rel_invalidChar) != -1) {
      return null;
    }

    if (notional.indexOf(",") > -1) {
      notional = notional.replace(/\,/g, "").split(".")[0];
    }
    // To convert NaN to 0.00 format (if not a number then 0 will be shown) || Tina K || 14-Oct-2019
    if ((isNaN(Number($(object).val())) && notional.search("'") != -1) || notional.search('"') != -1) {
      $(object).val("0");
      return $(object).val(Number($(object).val()).toFixed(4));
    }
    //End
    // Added By Esheeta
    if (notional.search(rel_Amount) === -1) {
      if (notional != "" && notional.search(",") == -1) {
        number = parseFloat(notional);
        return number.toLocaleString;
      } else {
        return null;
      }
    }

    if (notional.search(rel_Amount) != -1) {
      if (notional.search("K") != -1 || notional.search("k") != -1) {
        pos = notional.search(rel_Char);
        if (pos != 0) {
          number = notional.substring(0, pos);
          number = number * 1000;
        } else {
          return null;
        }
        return number.toLocaleString();
      }
      if (notional.search("M") != -1 || notional.search("m") != -1) {
        pos = notional.search(rel_Char);
        if (pos != 0) {
          number = notional.substring(0, pos);
          number = number * 1000000;
        } else {
          return null;
        }
        return number.toLocaleString();
      }
      if (notional.search("B") != -1 || notional.search("b") != -1) {
        pos = notional.search(rel_Char);
        if (pos != 0) {
          number = notional.substring(0, pos);
          number = number * 1000000000;
        } else {
          if (notional.search(/[A-Z]/i) != -1)
            return null;
          return null;
        }
        return number.toLocaleString();
      }
    } else {
      if (notional.search(/[A-Z]/i) != -1) {
        return null;
      } else {
        return notional;
      }
    }
  } catch (error) {
    console.log("error in FormatNotionalCommon2 ", error);
  } finally {
    if (number != undefined) {
      $(object).val(formatNotionalWithComma_Common2(number, object));
    } else
      $(object).val();
    rel_Amount = null;
    rel_Char = null;
    pos = null;
    number = null;
    rel_invalidChar = null;
    notional = null;
  }
}

// LGTGTWINT-479 | Instant Pricing: Limit Price to be rounded upto 4 decimals on order confirmation popup | Atharva A
function formatNotionalWithComma_Common2(n, object) {
  try {
    let thisTile = $(object).parents("td.sorting")[0];
    var num;
    var stringNum;
    if(typeof(n) !== 'string') {
      stringNum = n.toString();
    }
    else {
      stringNum = n;
    }

    if(typeof(n) !== 'number') {
      num = Number(n);
    }
    else {
      num = n;
    }

    var splitStringNum = stringNum.split(".");
    if(splitStringNum.length >= 2 && splitStringNum[1].length > 4) {
      $(thisTile).find('[id^="errorMsgPanel"]').html("Precision of Limit Level cannot exceed four digits after decimal point.");
    }
    else {
      $(thisTile).find('[id^="errorMsgPanel"]').html("");
    }

    if(splitStringNum.length <= 1) {
      num = num.toFixed(4);
    }
    else if(splitStringNum.length >= 2 && splitStringNum[1].length <= 4) {
      num = num.toFixed(4);
    }
    
    return num.toString();

  } catch (err) {
    console.log(err.message);
  }
}

// LGTGTWINT-479 | Instant Pricing: Limit Price to be rounded upto 4 decimals on order confirmation popup | Atharva A
function isValidNumber2(txt, evt) {
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode == 46) {
    //Check if the text already contains the . character
    if (txt.value.indexOf('.') === -1) {
      return true;
    } else {
      return false;
    }
  } else {
    if (charCode > 31 &&
      (charCode < 48 || charCode > 57))
      return false;
  }
  return true;
}

// Added for hiding the ccypair popup on autocomplete | LGTGTWINT-687 | Chaitanya M | 17-jan-2023
function hideccypopup() {
  try {

      $("#bodyDiv").empty();

  } catch (error) {
    console.log(error.message);
  }

}
//End

// LGTGTWINT-1112 Instant Pricing: Client Yield should get calculated on changing upfront on order popup for ELN

// getClientPrice 
function getClientPrice(TildID,yield){

  try{

    let currentTile = document.getElementById("td" + TildID);

    clientPriceObject = {

      "UserName": sessionStorage.getItem("FinIQUserID").toString(),
      "ClientYield": yield,
      "Ccy": $(currentTile).find('[id^="NoteCCY_ELN"]').val(), //LGTGTWINT-1480 | Chaitanya M | 22 Feb 2023
      "SettlementDate": $(currentTile).find('[id^="ELN_SettlDate"]').html(),
      "MaturityDate":$(currentTile).find('[id^="ELN_Maturity"]').html(),
      "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
      "CurrentTileID":TildID
    }

    let res = getSyncResponse(clientPriceObject, clientConfigdata.CommonMethods.NodeServer + "ClientPriceIP"); // LGTGTWINT-1488 | Chaitanya M | 24 Feb 2023

    let clientpriceResponse = "";

    if(res.responseData !=""){

       clientpriceResponse = res.responseData;

    }

    return clientpriceResponse;

  }catch(er){

    console.log(er.message);

  }

}

// getClientYield

function getClientYield(TildID,ClientPrice){

  try{

    let currentTile = document.getElementById("td" + TildID);

    clientYiledObject = {

      "UserID": sessionStorage.getItem("FinIQUserID").toString(),
      "ClientPrice": ClientPrice,
      "cashCurrency": $(currentTile).find('[id^="NoteCCY_ELN"]').val(), //LGTGTWINT-1480 | Chaitanya M | 22 Feb 2023
      "SettlmentDate": $(currentTile).find('[id^="ELN_SettlDate"]').html(), 
      "MaturityDate": $(currentTile).find('[id^="ELN_Maturity"]').html(),
      "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
      "CurrentTileID":TildID
    }

    let res = getSyncResponse(clientYiledObject, clientConfigdata.CommonMethods.NodeServer + "ClientYieldIP");// LGTGTWINT-1488 | Chaitanya M | 24 Feb 2023

    let clientYiledResponse = "";

    if(res.responseData !=""){

      clientYiledResponse = res.responseData;

    }

    return clientYiledResponse;

  }catch(er){

    console.log(er.message);

  }

}

//END
// Changed for LGTGTWINT-1128 for resetting on change of shares / underlying | Chaitanya M | 23-Jan-2023 
//Start
function EQCResetPayoff(thistile, Parentid){
  try {
    $(thistile).find('[id^="'+Parentid+'"]').attr("disabled", false);  // INT1FIN47-768 Gateway Markets Instant Pricing issue
    clearInterval($(thistile).find('[id^="hdnintervalID"]').val());  // INT1FIN47-768 Gateway Markets Instant Pricing issue
    mapleLoaderStop(thistile,'[id^="'+Parentid+'"]', false);
    
    //LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
    $(thistile).find('[id^="EQCRfqidpnl"]').hide();
    $(thistile).find('[id^="RFQIDEQC"]').html("");
    $(thistile).find('[id^="hdnRequestID"]').val(""); //RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
    
    //end
    
    	
     //RizwanS || LGTGTWINT-2333 || Instant Pricer: Clear Price not working || 23 Aug 2023
    setTimeout(() => {
        
      $(thistile).find('[id*="btnBestPrice"]').attr("disabled", false);
      $(thistile).find('[id*="BookTrade"]').attr("disabled", true);
      $(thistile).find('[id^="btnEmailQuote"]').attr("disabled", true);
      $(thistile).find('[id^="OrderEmail"]').attr("disabled",true);
      $(thistile).find('[id^="hdnRequestID"]').val(""); //RizwanS || LGTGTWINT-2333 Instant Pricer: Clear Price not working || 24 Aug 2023
      $(thistile).find('[id^="EQCRfqidpnl"]').hide();
      $(thistile).find('[id^="RFQIDEQC"]').html("");

      clearPricerTable(thistile);

    }, 1000);
    //END
   

  } catch (error) {
    console.log(error.message);
  }
}
//End

// Added for being Able to price with only share name entered and not selected| Ref:LGTGTWINT-1076, LGTGTWINT-1075 | Chaitanya M | 24-Jan-2023
//Start
function validateshares(thisTile, Parentid){
  try {

     var sharelistnames =[];
     
     //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
     let productname = $(thisTile).find(".productName").attr("id");

     if(productname=="AQDQ"){

        if ($(thisTile).find('[id^="Type"]').val().trim().toUpperCase() === "AQ") {
          productname = "AQ";
        }else{
          productname = "DQ";
        }

     }

    switch(productname.toUpperCase()){

      case "DRA":
          EQCShareNameObj = DRAShareData;
          break;

      case "FCN":
          EQCShareNameObj = FCNShareData;
          break;

      case "OPTIONS":
          EQCShareNameObj = EQOShareData;
          break;

      case "BEN":
          EQCShareNameObj = BENShareData;
          break;

      case "DQ":
            EQCShareNameObj = DACShareData;
            break;

      case "AQ":
            EQCShareNameObj = ACCShareData;
            break;

      case "ELN":
            EQCShareNameObj = ELNShareData;
            break;  
            
      case "TWINWIN":
              EQCShareNameObj = TwinWinShareData;
              break; 
  
      case "PHOENIX":
              EQCShareNameObj = PHXShareData;
              break; 
              
      case "DCN":
              EQCShareNameObj = DCNShareData;
              break;  
      case "BOOSTER":
              EQCShareNameObj = BoosterShareData;
              break;                    
      case "SHARKFIN":
              EQCShareNameObj = SharkfinShareData;
              break; 
    }
    //END
    
    for (i = 0; i < EQCShareNameObj.length; i++) {        
       sharelistnames.push(EQCShareNameObj[i].Code);  
    }

    if(!sharelistnames.includes($(thisTile).find('[id^="'+Parentid+'"]').val().trim())){ //Added by RizwanS || LGTGTWINT-1658 - Instant Pricing: share list dropdown not displayed. || 10 Apr 2023
      $(thisTile).find('[id^="'+Parentid+'"]').val(""); //Added by RizwanS || LGTGTWINT-1658 - Instant Pricing: share list dropdown not displayed. || 10 Apr 2023
      return false           
    }  
  } catch (error) {
    console.log(error.message);
  }
}
//End

// Added for being Able to price with only share name entered and not selected| Ref:LGTGTWINT-1076, LGTGTWINT-1075 | Chaitanya M | 24-Jan-2023
//Start
function validatesharebasket(thisTile,Parentid ){
  try {    
 
    var sharelistnames =[];
    //LGTGTWINT-1567 || RizwanS || 20 Apr 2023
    let productname = $(thisTile).find(".productName").attr("id");

     if(productname=="AQDQ"){

        if ($(thisTile).find('[id^="Type"]').val().trim().toUpperCase() === "AQ") {
          productname = "AQ";
        }else{
          productname = "DQ";
        }

     }

    switch(productname.toUpperCase()){

      case "DRA":
          EQCShareNameObj = DRAShareData;
          break;

      case "FCN":
          EQCShareNameObj = FCNShareData;
          break;

      case "OPTIONS":
          EQCShareNameObj = EQOShareData;
          break;

      case "BEN":
          EQCShareNameObj = BENShareData;
          break;

      case "DQ":
            EQCShareNameObj = DACShareData;
            break;

      case "AQ":
            EQCShareNameObj = ACCShareData;
            break;

      case "ELN":
            EQCShareNameObj = ELNShareData;
            break;  
      case "TWINWIN":
              EQCShareNameObj = TwinWinShareData;
              break; 
  
      case "PHOENIX":
              EQCShareNameObj = PHXShareData;
              break; 
              
      case "DCN":
              EQCShareNameObj = DCNShareData;
              break;       
       case "BOOSTER":
             EQCShareNameObj = BoosterShareData;
             break;     
      case "SHARKFIN":
             EQCShareNameObj = SharkfinShareData;
             break;            
    }
    //END

    for (i = 0; i < EQCShareNameObj.length; i++) {        
       sharelistnames.push(EQCShareNameObj[i].Code);  
    }
    if($(thisTile).find('[id^="'+Parentid+'"]').val().trim()!=""){ //Added by RizwanS || LGTGTWINT-1658 - Instant Pricing: share list dropdown not displayed. || 10 Apr 2023
      $(thisTile).find('[id^="'+Parentid+'"]').val("") 
      return false           
    } 
    
  } catch (error) {
    console.log(error.message);

  }
}

// End

// LGTGTWINT-1186 - Instant Pricing: RM and IA: User should be able to redirect order

var preTradeXml = "";
var redirectYN = "";

function CheckRedirectBtnEnableDisable(currentTile,productname){

  try {


    let redirectflag = "";

    let _tenorStr = "";

    let _tenorNumb ="";

    let _groupid = "";

    let _isRM = "";

    let _ccy = "";

  _groupid = sessionStorage.getItem("FinIQGroupID").toString().toUpperCase();

  _tenorNumb = $(currentTile).find('[id^="tenor_"]').val();
  
  if($(currentTile).find('[id^="tenorddl"]').val().includes("M")){

    _tenorStr = "Month"

  }else{

    _tenorStr = "Year"

  }

  if(isRM){ // Added the checks for Dubai IA and RM usergroup Ref: LGTGTWINT-1732 | Chaitanya M | 17 March 2023, //LGTGTWINT-1954 || RizwanS || 03 May 2023

    _isRM = "YES";

   }else{

    _isRM = "NO"

   }

   _ccy =(($(currentTile).find('[id^="EQCOrderPopUPCCY"]').text()).split("(")[1]).split(")")[0];

   //Added check for upfront value as per upfront filed mapped  
   let _upfront = "";
   if(productname == "FCN" || productname == "DRA"){

     if(DRAFCNUpfrontYN.toUpperCase() != "YES" || !DRAFCNUpfrontYN.toUpperCase().includes("Y")){

       _upfront = $(currentTile).find('[id^="txtupfrontVal"]').val();

     }else{

       _upfront = "0.00";

     }

   }else if( productname == "BEN"){

     if(BENUpfrontYN.toUpperCase() != "YES" || !BENUpfrontYN.toUpperCase().includes("Y")){

       _upfront = $(currentTile).find('[id^="txtupfrontVal"]').val();

     }else{

       _upfront = "0.00";

     }

   } else{

     _upfront = $(currentTile).find('[id^="txtupfrontVal"]').val();

   }

  //  END

    $.ajax({
        async: false,
        crossDomain: true,
        type: 'POST',
        url: clientConfigdata.CommonMethods.NodeServer + "CheckRedirectBtnEnableDisable",
        data: JSON.stringify({
              
          userName: sessionStorage.getItem("EQC_UserName").toString(),
          EntityID: sessionStorage.getItem("EQC_EntityID").toString(),
          groupID: _groupid,
          underlyings: $(currentTile).find('[id^="txtUnderlying"]').val(),
          quontoCcy: _ccy,
          currency:  _ccy, 
          orderType: $(currentTile).find('[id^="ddlOrderType"]').val(),
          notional:   $(currentTile).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
          tenorType: _tenorStr,
          tenor: _tenorNumb,
          upfront: _upfront,
          isRM:_isRM,
          EQC_TOKEN: sessionStorage.getItem("EQC_Token").toString(),
          token: sessionStorage.getItem("EQC_Token").toString(),
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

         if(data.responseData[0] != ""){

          redirectflag = JSON.parse(data.responseData)[0].Redirect_Btn_Visible;

         }else{

          $(currentTile).find('[id^="errorMsgPanel"]').html(data.message);
          
         }

        },
        error: function (error) { }
    });

  return redirectflag;

  } catch (error) {
      console.log(error.message);

  }

}

function getpreTradeXml(currentTile){

  try{

    let preTardeXML = "";

    $.ajax({
      async: false,
      crossDomain: true,
      type: 'POST',
      url: clientConfigdata.CommonMethods.NodeServer + "getPreTradeXML",
      data: JSON.stringify({
          
        userName: sessionStorage.getItem("EQC_UserName").toString(),
        EntityID: sessionStorage.getItem("EQC_EntityID").toString(),
        orderID: "",
        orderQty: $(currentTile).find('[id^="txtTotalNotional"]').val().split('.')[0].replace(/\,/g, ""),
        custPortfolio: "",
        custSettleAcc: "",
        rm: sessionStorage.getItem("EQC_UserName").toString(),
        rmCode: "",
        rmLocation: "",
        Branch: $(currentTile).find('[id^="ddlBookingBranch"]').val(),
        EQC_TOKEN: sessionStorage.getItem("EQC_Token").toString(),
        token: sessionStorage.getItem("EQC_Token").toString(),

      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {

       if(data.responseData[0] != ""){

        preTardeXML = data.responseData;

       }else{

        $(currentTile).find('[id^="errorMsgPanel"]').html(data.message);
        
       }

      },
      error: function (error) { }
  });

return preTardeXML;

  }catch(er){

      console.log(er.message);
  }


}

// Start Added for LGTGTWINT-1077 Instant Pricing: Input length and rounding the decimals for all fields for all payoffs | Chaitanya M | 28-01-2023
function InputLengthCheckEQC(thistile, parentid, allowedval,RoundTo){
  try {

    let lengthvalue =  $(thistile).find('[id^="'+parentid+'"]').val().split(".");     
    
    if(lengthvalue[0].length > allowedval){
       var inputvalue =  $(thistile).find('[id^="'+parentid+'"]').val().slice(0,allowedval );
       
      $(thistile).find('[id^="'+parentid+'"]').val(inputvalue);  
    }
     
  // console.log(value_rounded);
    //End
 
  } catch (error) {
    console.log(error.message);

  }
}

//End

 function validateEQCOrders(_notional){ // LGTGTWINT-1123 - Instant Pricing: Order popup blank field validations.

  try{

    let _upFlagVal = "";
    if (parseFloat(_notional) < parseFloat(minNotional.replaceAll(",", ""))) {
      _upFlagVal = "L";
    } else if (parseFloat(_notional) > parseFloat(maxNotional.replaceAll(",", ""))) {
      _upFlagVal = "H";       
    }
    return _upFlagVal;

  }catch(er){

    console.log(er.message);

  }
 }//END


//  LGTGTWINT-1361 FXD : Instant Pricers : Add Option cut on each tile || 08 Feb 2023

function setasyncOptioncutFXD(currId, ccypair, pId, pCode,Mode) {

  try {
      let optioncutobj = {

        "entityID": EntityID,
        "mode": Mode,
        "productId":  pId,
        "productCode":  pCode,
        "pair":  ccypair, 
        "customerID" : custID,
        "requestID": currId +"|" + userName + '_' + 'GetOptionCut'  +'_'+ RequestIDGenerator(10) + RequestIDGenerator(4), //modified by Chaitanya M, LGTGTWINT-1850 | 13-april-23

      }

      let getOC = getSyncResponse(optioncutobj, clientConfigdata.CommonMethods.NodeServer + "fxcommonfunction/Get_OptionCut");

      // let setOC = getOC[0].OptionCut;

    let OptionCutListFXD = [];
    // Added for Default Parameters | LGTCLI-310 | Chaitanya M | 17 Feb 2023
    getOC.forEach((element,i) => {

      if (getOC[i].OptionCut === 'BFIXTOK') {
        getOC.splice(i,1)
        getOC.unshift(element)
      } 
    });
    for (i = 0; i < getOC.length; i++) {

          OptionCutListFXD.push(getOC[i].OptionCut);

      }

      return OptionCutListFXD;


  } catch (error) {
      console.log(error.message
      );
  }

}

//END

// LGTCLI-283 - Instant Pricer FX Pop Up for Route to Dealer

function closeremarkpopup(that) {
  try {

   // $("#" + "DivOverlay" + that.parentElement.parentElement.id.split("remarkFXD")[1]).hide(); //LGTGTWINT-2129 | Chaitanya M | 20 July 2023

    TileId = that.id.match(/\d+$/)[0];
    thisTile = document.getElementById("td" + TileId);

    $(thisTile).find('[id^="inputRemark"]').val("");
    $(thisTile).find('[id^="validatiionMsg"]').html("");
    $(thisTile).find('[id^="DivOverlay"]').hide(); //LGTGTWINT-2129 | Chaitanya M | 20 July 2023
    $(thisTile).find('[id^="remarkFXD"]').css("display", "none");
  } catch (error) {
    console.log(error.message);
  }
}

// END

//Added to show error if Saturday or Sunday selected as First- Fixing date | LGTGTWINT-1424| Chaitanya M | 20 Feb 2023
function validatefirstfixingday(thisTile, fieldid, Fixingdate){
  try { 


    if(Fixingdate !=""){ // LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023

      if(Fixingdate.getDay() =="6" || Fixingdate.getDay() =="0"){     
        $(thisTile).find('[id^="btnBestPrice"]').attr("disabled", true); 
        ValidateField($(thisTile).find('[id^="' + fieldid + '"]').attr("id"),"First Fixing Date should not fall on holiday.",thisTile); 
        return false;    
      } else{
        $(thisTile).find('[id^="' + fieldid + '"]').removeClass("ValidateFieldCSS");
      } 

    } else{ // LGTGTWINT-1821 FXD: Instant Pricer: 'Clear' button on calendar shows system error with NaN || Added By RizwanS || 04 Apr 2023

      $(thisTile).find('[id^="btnBestPrice"]').attr("disabled", true); 
      ValidateField($(thisTile).find('[id^="' + fieldid + '"]').attr("id"),"First Fixing Date can not be blank.",thisTile); 
      return false; 

    }
     


  } catch (error) {
    console.log(error.message);
  }
}

// Added for disabling past date | Chaitanya M | 21 Feb 2023 
function getcurrentdate(thisTile,field_id) {
  try {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }    
    if (mm < 10) {
      mm = '0' + mm;
    }         
    today = yyyy + '-' + mm + '-' + dd;

    $(thisTile).find('[id^="' + field_id + '"]').attr("min", today);  
    
  } catch (error) {
    console.log(error.message);
  }
}


// Added for clear pricing 

// Added for LGTGTWINT-1514 | Chaitanya M | 24 Feb 2023
function closedialogbox(){
	
	try{
		document.getElementById("#OverlayDiv").hide();
		$("#dialog-EQCValidation").dialog("close");
    $("#commonoverlayEQC").hide(); //LGTGTWINT-2129 | Chaitanya M | 13 June 2023
		
	}catch(er){
		console.log(er.message)
	}
    
}

// LGTGTWINT-1227 - Instant Pricing: EQC Ref missing for rfqs placed through instant pricing | 24 Feb 2023
function getEQCRefrenceNumber(_product,_KOType,_KIType,_tenor,_tenorType,_coupon,_QuantoYN,_BasketType){

  try{

    let EQCrefnumb = {

      UserName: userName,
      product: _product,
      KOType: _KOType,
      KIType: _KIType,
      Tenor: _tenor,
      TenorType: _tenorType,
      Coupon: _coupon,
      QuantoYNFlag: _QuantoYN,
      Single_Worst_of: _BasketType,
      EQC_TOKEN: sessionStorage.getItem("EQC_Token").toString()

    }

    let getEQCref = getSyncResponse(EQCrefnumb, clientConfigdata.CommonMethods.NodeServer + "EQCREFIP");

    return getEQCref.responseData;

  }catch(er){

    console.log(er.message);
  }

}


//Added to show error if Saturday or Sunday selected as date |LGTGTWINT-1560| Chaitanya M | 20 Feb 2023
// LGTGTWINT-1638 | Chaitanya M | 5 July 2023
function validate_dates(thisTile, fieldid, dates,datetype){
  try { 
    
    if(dates.getDay() =="6" || dates.getDay() =="0"){     
      $(thisTile).find('[id^="btnBestPrice"]').attr("disabled", true); 
      ValidateField($(thisTile).find('[id^="' + fieldid + '"]').attr("id"), datetype + " is Holiday.",thisTile);  // LGTGTWINT-1638 | Chaitanya M | 5 July 2023
      return false;    
    } else{
      $(thisTile).find('[id^="' + fieldid + '"]').removeClass("ValidateFieldCSS");
    } 

  } catch (error) {
    console.log(error.message);
  }
}

function GetRequiredDate(thisTile,field_id,datename,firstdate){
  try {
    if(datename ==""){
      var today = new Date();
    }else{
      var today = new Date(datename);
    }
    
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }    
    if (mm < 10) {
      mm = '0' + mm;
    }         
    today = yyyy + '-' + mm + '-' + dd;

    $(thisTile).find('[id^="' + field_id + '"]').attr("min", today); 
  
    if(firstdate !=""){
      setinitialdate(thisTile,field_id,firstdate);
    }    

  } catch (error) {
    console.log(error.message);
  }
}


function setinitialdate(thisTile,field_id,firstdate){
  try {
    let strFirstFix = new Date(firstdate);
    let firstFix =
      strFirstFix.getFullYear() +
      "-" +
      ("0" + (strFirstFix.getMonth() + 1)).substr(-2, 2) +
      "-" +
      ("0" + strFirstFix.getDate()).substr(-2, 2);
      $(thisTile).find('[id^="' + field_id + '"]').val(firstFix);  
    
  } catch (error) {
    console.log(error.message);
  }
}


function FormatNotional(notional, object, ccy) {
  try {
    var thistileFX = $(object).find("td.sorting")[0];

    var rel_Amount = /\d+(K$(?![K|M|B])|M$(?![K|M|B])|B$(?![K|M|B]))/i;
    var rel_Char = /(K|M|B)/i;
    var pos;
    var number;
    var rel_invalidChar = /[\#|\@|!|\&|\*|\%|\\|\+|\*|\^]/;

    if (notional.search(rel_invalidChar) != -1) {
      return null;
    }

    if (notional.indexOf(",") > -1) {
      //|| notional.indexOf(".") > -1
      //notional = notional.replace(/\,/g, "").split(".")[0];
    }
    // To convert NaN to 0.00 format (if not a number then 0 will be shown) || Tina K || 14-Oct-2019
    if ((isNaN(Number($(object).val())) && notional.search("'") != -1) || notional.search('"') != -1) {
      $(object).val("0");
      return $(object).val(Number($(object).val()).toFixed(2));
    }
    //End
    // Added By Esheeta
    if (notional.search(rel_Amount) === -1) {
      if (notional != "" && notional.search(",") == -1) {
        number = parseFloat(notional);
        return number.toLocaleString;
        //+ end;
      } else {
        return null;
      }
    }

    if (notional.search(rel_Amount) != -1) {
      if (notional.search("K") != -1 || notional.search("k") != -1) {
        pos = notional.search(rel_Char);
        if (pos != 0) {
          number = notional.substring(0, pos);
          number = number * 1000;
        } else {
          return null;
        }
        return number.toLocaleString();
      }
      if (notional.search("M") != -1 || notional.search("m") != -1) {
        pos = notional.search(rel_Char);
        if (pos != 0) {
          number = notional.substring(0, pos);
          number = number * 1000000;
        } else {
          return null;
        }
        return number.toLocaleString();
      }
      if (notional.search("B") != -1 || notional.search("b") != -1) {
        pos = notional.search(rel_Char);
        if (pos != 0) {
          number = notional.substring(0, pos);
          number = number * 1000000000;
        } else {
          if (notional.search(/[A-Z]/i) != -1)
            return null;
          return null;
        }
        return number.toLocaleString();
      }
    } else {
      if (notional.search(/[A-Z]/i) != -1) {
        return null;
      } else {
        return notional;
      }
    }
  } catch (error) {
    console.log("error in FormatNotional ", error);
  } finally {
    if (number != undefined) {
      $(object).val(formatNotionalWithComma_Common(number, ccy));
    } else
      $(object).val();
    rel_Amount = null;
    rel_Char = null;
    pos = null;
    number = null;
    rel_invalidChar = null;
    notional = null;

    //  checkDecimalAmt(object, thistileFX); //Added By RizwanS for JIRA- NT1FIN47-386 // 11 Feb 2022
  }
}


// LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
function resetFXDPrice(_thisTile){
  try{

    clearPricerTable(_thisTile); //To clear prices after clicking best price

    // START - LGTCLI-375 -Instant Pricer FX Tiles Cancel Pricing || RizwanS || 11 Apr 2023
    $(_thisTile).find('[id*="btnBestPriceFX"]').attr("disabled", false); 
    $(_thisTile).find('[id^="btnemailquote"]').attr("disabled", true);
    $(_thisTile).find('[id*="btnBookReqFX"]').attr("disabled", true);    
    $(_thisTile).find('[id^="btnSaveTradeFX"]').attr("disabled", true);
    $(_thisTile).find('[id*="BookTradeFX"]').attr("disabled", true);  
    
    // START - LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023
    $(_thisTile).find('[id^="hdnRequestID"]').val("");
    $(_thisTile).find('[id^="FXDRfqidpnl"]').hide();
    $(_thisTile).find('[id^="RFQIDFXD"]').html("");  
    $(_thisTile).find('[id^="RFQFX"]').val("");
    $(_thisTile).find('[id^="hdnPricesFX"]').val(""); 
    $(_thisTile).find('[id^="hdnIBPremFX"]').val(""); 
    $(_thisTile).find('[id^="hdnIBPremPercFX"]').val(""); 
    $(_thisTile).find('[id^="hdnClientPremDirFX"]').val(""); 
    // END - LGTGTWINT-1740 || RFQ ID on Instant Pricer || Chaitanya M | 20 March 2023

    if(isRFS){ // LGTGTWINT-1934 || RizwanS || 05 Jun 2023 

      if($(_thisTile).find('[id^="hdnQuoteString"]').val() !== ""){

                   
        $(_thisTile).find('[id^="TimerDiv"]').removeClass("Showtimer");                      
        $(_thisTile).find('[id^="SignalRTimer"]').html(""); 
        $(_thisTile).find('[id^="hdntimerFX"]').val("");
        $(_thisTile).find('[id^="hdnsignalRMsgRecv"]').val(""); 

        mapleLoaderStop(_thisTile,'[id*="btnBestPriceFX"]',false);

        //End
        

        // START - LGTGTWINT-2331 | Chaitanya M | 22 Aug 2023
        if(!_addtileflag){

          if($(_thisTile).find('[id^="hdnQuoteString"]').val() === ""){ // LGTGTWINT-1934 || RizwanS || 05 Jun 2023 
            mapleLoaderStop(_thisTile,'[id*="btnBestPriceFX"]',false);
            return false;
      
          } 

          clearInterval($(_thisTile).find('[id^="hdntimerInterval"]').val());
          clearTimeout($(_thisTile).find('[id^="hdnRFSMinTimer"]').val());
          clearTimeout($(_thisTile).find('[id^="hdnRFSMaxTimer"]').val()); 

          $(_thisTile).find('[id^="hdntimerInterval"]')[0].value = "";
          $(_thisTile).find('[id^="hdnRFSMinTimer"]')[0].value = "";    
          $(_thisTile).find('[id^="hdnRFSMaxTimer"]')[0].value = "";
               
          
          UnsubcribeRFQID(_thisTile);

        }          

        // END - LGTGTWINT-2331 | Chaitanya M | 22 Aug 2023    

        $(_thisTile).find('[id^="hdnQuoteString"]').val("");        

      }else{
        mapleLoaderStop(_thisTile,'[id*="btnBestPriceFX"]',false);
      }


    // START - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
    }else{
      mapleLoaderStop(_thisTile,'[id*="btnBestPriceFX"]',false);
    }
    // END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023


  }catch(er){

    console.log(er.message);

  }

} 
// END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
 

// LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 17 Apr 2023
// Start
function summarytradePopup(btn, popup, msg, DivOverlay) {
  try {
    $("#" + popup).find("#SummaryFXD").html('').html(msg);
    $("#" + popup)[0].style.display = "block";

  } catch (error) {
    console.log(error.message);
  }
}
//End

// LGTCLI-391 Instant Pricer FX Contract Summary Pop Up | Chaitanya M | 17 Apr 2023
//Start
function closeContractSummarypopup(that) {
  try {
    
    TileId = that.id.match(/\d+$/)[0];
    _thisTile = document.getElementById("td" + TileId);
    $(_thisTile).find('[id^="ContractSummaryFXD"]').html("");
    $(_thisTile).find('[id^="SummaryFXD"]').hide();    
    
  } catch (error) {
    console.log(error.message);
  }
}
//End


//LGTGTWINT-1912 | Chaitanya M | 28 April 2023
// Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
function clearallprices(){
  try {
    
    //RizwanS || LGTGTWINT-2333 || Instant Pricer: Clear Price not working || 23 Aug 2023
    xTime = 0;
    var i;

    let products = [];
    let _FXDProducts = FXD_TABLE;
    let FXDProducts = FXD_TABLE; //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023

    $("tr.removable>td.newlyCreated td.productName").each(function (index,element) {
      products.push(element.id);
    });


    for (var t = 0; t < products.length; t++) {
      for (var t_ = 0; t_ < FXDProducts.length; t_++) {
        if (FXDProducts[t_] == products[t]) {
          isFxdTemplate = true;
        } else {
          isFxdTemplate = false;
        }
      }
    }

    
    if (isFxdTemplate){
      xTime = xTime + clientConfigdata.CommonMethods.priceAllRequestDelayFXD;
    }else{
      xTime = xTime + clientConfigdata.CommonMethods.priceAllRequestDelay;
    }


    for (i = 31; i < $("button[id^=btnBestPrice]").length; i++) {
      doSetTimeout(i);
      // Added by ImranP || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 13 Jul 2023
      setTimeout(function () {
        isPriceAllChecked=false;
      }, xTime+500);
      //END
      
    }

    function doSetTimeout(i) {  //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023

      if (isFxdTemplate){
        xTime = xTime + clientConfigdata.CommonMethods.priceAllRequestDelayFXD;
      }else{
        xTime = xTime + clientConfigdata.CommonMethods.priceAllRequestDelay;
      } 

      if (i == 31) {
        thisTile  = $($("button[id^=btnBestPrice]")[i]).parents(".sorting")[0];
        let _productname = $($("button[id^=btnBestPrice]")[i]).parents(".sorting").find(".productName")[0].id; // Added by Chaitanya M for Only FXD Price ALL || LGTGTWINT-2217 || 23 Aug 2023 
        if(_FXDProducts.includes(_productname)){// Added by Chaitanya M for Only FXD Price ALL || LGTGTWINT-2217 || 23 Aug 2023 
          resetFXDPrice(thisTile); 
        }else{
          sessionStorage.removeItem("quoteResponse_" + thisTile.id.match(/\d+$/)[0]); 
          $(thisTile).find('[id^="hdnChartPrices"]').val("");  
  
          EQCResetPayoff(thisTile,"btnBestPrice");
         //RizwanS || LGTGTWINT-2333 || Instant Pricer: Clear Price not working || 23 Aug 2023
          $(thisTile).find('[id*="btnBestPrice"]').attr("disabled", false);
          $(thisTile).find('[id*="BookTrade"]').attr("disabled", true);
          $(thisTile).find('[id^="btnEmailQuote"]').attr("disabled", true);
          $(thisTile).find('[id^="OrderEmail"]').attr("disabled",true);
          $(thisTile).find('[id^="EQCRfqidpnl"]').hide();
          $(thisTile).find('[id^="RFQIDEQC"]').html("");
          //END
        }
      }

      setTimeout(function () {

        thisTile  = $($("button[id^=btnBestPrice]")[i+1]).parents(".sorting")[0];
        
        if ($("button[id^=btnBestPrice]")[i + 1] != undefined){
          let _productname = $($("button[id^=btnBestPrice]")[i+1]).parents(".sorting").find(".productName")[0].id; // Added by Chaitanya M for Only FXD Price ALL || LGTGTWINT-2217 || 23 Aug 2023 
          if(_FXDProducts.includes(_productname)){ // Added by Chaitanya M for Only FXD Price ALL || LGTGTWINT-2217 || 23 Aug 2023 
            resetFXDPrice(thisTile); 
          }else{
            
              sessionStorage.removeItem("quoteResponse_" + thisTile.id.match(/\d+$/)[0]); 
              $(thisTile).find('[id^="hdnChartPrices"]').val("");  
      
              EQCResetPayoff(thisTile,"btnBestPrice");
             //RizwanS || LGTGTWINT-2333 || Instant Pricer: Clear Price not working || 23 Aug 2023
              $(thisTile).find('[id*="btnBestPrice"]').attr("disabled", false);
              $(thisTile).find('[id*="BookTrade"]').attr("disabled", true);
              $(thisTile).find('[id^="btnEmailQuote"]').attr("disabled", true);
              $(thisTile).find('[id^="OrderEmail"]').attr("disabled",true);
              $(thisTile).find('[id^="EQCRfqidpnl"]').hide();
              $(thisTile).find('[id^="RFQIDEQC"]').html("");
              //END
             
          }

        }
          
      }, xTime);

      return false;
    }



    //=====================================================

    // for (i = 31; i < $("button[id^=btnBestPrice]").length; i++) {
    //   for (var t_ = 0; t_ < FXDProducts.length; t_++) {
    //   //RizwanS || LGTGTWINT-2333 || Instant Pricer: Clear Price not working || 23 Aug 2023
    //     if (FXDProducts.includes(products[i])) {
    //       isFxdTemplate = true;
    //     }else{
    //       isFxdTemplate = false;
    //     }
    //   }
    // //END

    //   thisTile  = $($("button[id^=btnBestPrice]")[i]).parents(".sorting")[0];
    //   mapleLoaderStop(thisTile,'[id^="btnBestPrice"]', false);
         
    //   if(!isFxdTemplate){ 

    //     sessionStorage.removeItem("quoteResponse_" + thisTile.id.match(/\d+$/)[0]); 
    //     $(thisTile).find('[id^="hdnChartPrices"]').val("");  

    //     EQCResetPayoff(thisTile,"btnBestPrice");
    //    //RizwanS || LGTGTWINT-2333 || Instant Pricer: Clear Price not working || 23 Aug 2023
    //     $(thisTile).find('[id*="btnBestPrice"]').attr("disabled", false);
    //     $(thisTile).find('[id*="BookTrade"]').attr("disabled", true);
    //     $(thisTile).find('[id^="btnEmailQuote"]').attr("disabled", true);
    //     $(thisTile).find('[id^="OrderEmail"]').attr("disabled",true);
    //     $(thisTile).find('[id^="EQCRfqidpnl"]').hide();
    //     $(thisTile).find('[id^="RFQIDEQC"]').html("");
    //     //END

    //   }else{

    //     isFxdTemplate = false;
    //     resetFXDPrice(thisTile);        
     
    //   } 
    // }
  } catch (error) {
    console.log(error.message);
  }
}
//End - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023


//LGTGTWINT-1954 || RizwanS || 03 May 2023

var defaultReasonIndex = 0;

function checkdefaultException(){
  try{

      defaultsuitabilityReasons.forEach(element => {

        if( sessionStorage.getItem("FinIQGroupID").toString().toUpperCase() === element.Data_Value.toUpperCase() && element.Misc1.toUpperCase() === "1" )
        {
          suitabilityReasons.forEach((element1, index) => {
            if(element1.Misc1.toUpperCase() === element.Misc2.toUpperCase()){
              defaultReasonIndex = index;
            }
          });
          
        }
      });
 
  }catch(error){
    console.log(error.message);
  }
}
//END

// Order email for Instant pricer || LGTGTWINT-1978 || 12 May 2023  || Added by RizwanS  
function OrderEmail(productName, button){
  try{

    let currentTile = $(button).parents("td.sorting")[0];

    let TileId = button.id.match(/\d+$/)[0];

    let pricingRow = "";
    pricingRow = $(currentTile).find("table.pricerTable .pricesRow")[0];
    if (pricingRow.cells[0].innerText.trim().toString() === "-") {
        booktradePopup(currentTile, $(currentTile).find('[id*="booktrade"]')[0].id, "No price available for mailing!", $(currentTile).find('[id*="DivOverlay"]')[0].id);
        return false;
    }

    if(productName == "AQDQ"){

      if($(currentTile).find('[id^="Type"]').val().toUpperCase()=="AQ"){
        productName = "ACCUMULATOR";
      }else{
        productName = "DECUMULATOR";
      }
    }

    mapleLoaderStart(currentTile,'[id^="btnBestPrice"]', true);

    request_getDataFromAPI({
      UserID: userName,
      RFQIDs: $(currentTile).find('[id^="RFQIDEQC"]').html().split(":")[1].trim(), //LGTGTWINT-2141 | Chaitanya M | 26 June 2023
      ProductType:productName,
      RequestType:"ORDER",
      CurrentTileID: TileId,
      EQC_TOKEN: sessionStorage.getItem("EQC_Token").toString()

    }, clientConfigdata.CommonMethods.NodeServer + "OrderEmail_IP").then((data) => {
     
      TileId = data.CurrentTileID;
      currentTile = document.getElementById("td" + TileId);
      mapleLoaderStop(currentTile,'[id^="btnBestPrice"]', true);
      if(data.message =="Success"){
        booktradePopup(currentTile, $(currentTile).find('[id*="booktrade"]')[0].id, data.responseData, $(currentTile).find('[id*="DivOverlay"]')[0].id);
  
      }else{
        booktradePopup(currentTile, $(currentTile).find('[id*="booktrade"]')[0].id, data.responseData, $(currentTile).find('[id*="DivOverlay"]')[0].id);
      }

    }
    ).catch((error) => {
      console.log(`error at ${error}`);
    }
    );

  }catch(er){

  console.log(er.message);  

  }
}//END

// Order email for Instant pricer || LGTGTWINT-1978 || 12 May 2023  || Added by RizwanS 
// LGTGTWINT-2009, 2005 | Chaitanya M | 18 May 2023 
function sliceEQCbestprices(pricerObj,productname,sliceCount,_upfront){
  try{

      let sliceofArray = [];

      let priceOUT= "";

      pricerObj = pricerObj.slice(0, sliceCount);

      for(i=0;i<pricerObj.length;i++){

        switch (productname.toUpperCase()) {
          case "AQDQ":
                priceOUT = pricerObj[i].AccDecOUT; 
                break;
          case "ELN":
                priceOUT = pricerObj[i].ELNOUT; 
                break;
          case "FCN":
                priceOUT = pricerObj[i].DRAOUT; 
                break;
          case "DRA":
                priceOUT = pricerObj[i].DRAOUT; 
                break;
          case "BEN":
                priceOUT = pricerObj[i].BENOUT; 
                break;
          case "OPTIONS":
                priceOUT = pricerObj[i].EQOOUT; 
                break;
          case "DCN":
                priceOUT = pricerObj[i].DCNOUT; 
                break;
          case "TWINWIN":
                priceOUT = pricerObj[i].TwinwinOUT; 
                break;
          case "PHOENIX":
                priceOUT = pricerObj[i].PhoenixOUT; 
                break;
          case "BOOSTER":
                priceOUT = pricerObj[i].DRAOUT; 
                break;
          case "SHARKFIN":
                priceOUT = pricerObj[i].DRAOUT; 
                break;
          default:
          
        }

        if(priceOUT == "" || priceOUT.toUpperCase() == "REJECTED" || priceOUT.toUpperCase() == "UNSUPPORTED"){

          priceOUT = "-";
          pricerObj[i].PP_CODE ="-";
          pricerObj[i].MaxNotional ="0";
          pricerObj[i].MinNotional ="0";
          sliceofArray.push(pricerObj[i]);

        }else{

          // LGTGTWINT-2009, 2005 | Chaitanya M | 18 May 2023 
          if(productname.toUpperCase() == "OPTIONS"){
            pricerObj[i].EQOOUT = (Number(pricerObj[i].EQOOUT) - _upfront).toString(); 
          }else if(productname.toUpperCase() == "ELN"){
            pricerObj[i].ELNOUT = (Number(pricerObj[i].ELNOUT) + _upfront).toString();  
          }
          //End

          sliceofArray.push(pricerObj[i]);
        }
      }

      return sliceofArray;

  }catch(er){
    console.log(er.message);  
  }
}//END


//----------------------------------------- RFS:: Start -------------------------------------------//
//------------------------------------------------------------------------------------------------//

// RFS :: SignalR Region For FXD :: Start || LGTGTWINT-1934 || RizwanS || 13 April 2023

//------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------//

//To Connect with SignalR and Create Connection id and Receive Prices
function firstload() {
  try {

    $.connection.hub.url = sessionStorage.getItem("SignalRPath_") + "/FinIQ_FXD_SignalR_Pricer/signalr/hubs"; // LGTGTWINT-1934 || Rizwan S || 05 Jun 2023
    
    proxy = $.connection.notificationHub;
	
    $.connection.hub.logging = true;
    
    proxy.client.getFXDResponse = function (msg) {

      if(sessionStorage.getItem("pageurl_") != window.location.href ){ // LGTGTWINT-1934 || Rizwan S || 05 Jun 2023

        dictFXD = {};

        return false;

      } 

      if(msg !== "" || msg !== null || msg !== undefined){ // LGTGTWINT-1934 || Rizwan S || 05 Jun 2023

        let split_data = msg.split("|");

        console.table(split_data);
  
        let _TileID = "";
        let _thistile = "";
        let _productname = "";
  
        _TileID = Object.keys(dictFXD).find(key => dictFXD[key].includes(msg.split("|")[0])); //get Tield ID from dictionary. 
        
        //FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023
        _signalRMsgRecvFXAQ =false;
        _signalRMsgRecvFXPivot = false;
        _signalRMsgRecvFXTRFile = false;
        _signalRMsgRecvFXStrategies = false;
        _signalRMsgRecvFXO = false;
        _SIgnalRCAll = true;
       
        //End
  
        _thistile = document.getElementById("td" + _TileID);
  
        $(_thistile).find('[id^="hdnsignalRMsgRecv"]').val(""); // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 
  
        _productname = $(_thistile).find(".productName").attr("id");
  
        let _objFX = $(_thistile).find('[id^="hdnPricesFXObj"]').val();

        // Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
        if(_objFX === undefined){

            return false;        
        }
        // END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
  
        let PRICEOBJ = JSON.parse(_objFX);
  
        let legObj = PRICEOBJ.GetFXOPriceFromExternalProvidersJSONResult.BestPriceResponse.oPriceResponseBody;
  
        //LGTGTWINT-2075 // RizwanS || 03 Jun 2023
        let _SpotRate = "";
        if(msg.split("|")[5].toUpperCase() === "Y"){
          _SpotRate = Number(msg.split("|")[6]);
        }
        //END
  
        for(i=0;i<legObj.length;i++){
  
          if(legObj[i].quoteId == Number(msg.split("|")[0])){
  
            legObj[i].premium = Number(msg.split("|")[3]);
          legObj[i].premiumAmount = Number(msg.split("|")[2]); // LGTGTWINT-1987 | Chaitanya M | 05 June 2023
            legObj[i].validTill = msg.split("|")[4];
            let bestPriceYN =  msg.split("|")[5];
            let bestProvider = "";
            if(bestPriceYN == "Y"){
              if(legObj[i].quoteId == Number(msg.split("|")[0])){
                bestProvider = legObj[i].provider;
                legObj[0].bestPriceProvider =  bestProvider +  ":" + Number(msg.split("|")[3]);
              }           
            } 
          }
        }
  
        switch (_productname.toUpperCase()) {
          case "FXAQ":
  
               _signalRMsgRecvFXAQ = true; //FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023             
              
              //LGTGTWINT-2075 // RizwanS || 03 Jun 2023
              if(_SpotRate !== ""){
                let $rateFXAQDQ = $(_thistile).find('[id^="rateFXAQ"]');
                let indexAQDQ = $(_thistile).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy" ? 1 : 0;
                updateSpotRate($rateFXAQDQ, _SpotRate, indexAQDQ, _thistile); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
              }
              //END
  
              $(_thistile).find('[id^="hdnsignalRMsgRecv"]').val("YES"); // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023             
              MapPricesFXAQ(PRICEOBJ, _thistile,true);
              $(_thistile).find('[id^="hdnPricesFXObj"]').val(JSON.stringify(PRICEOBJ));
              $(_thistile).find('[id*="btnBestPriceFX"]').attr("disabled", false);          
              break;
  
          case "FXTRF":
               _signalRMsgRecvFXTRF = true; // FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023   
               
               //LGTGTWINT-2075 // RizwanS || 03 Jun 2023
               if(_SpotRate !== ""){
                let $rateFXTRF = $(_thistile).find('[id^="rateFXTRF"]');
                let indexTRF = $(_thistile).find('[id^="CcyBuSellSelectionFXTRF"]').val().trim() == "Buy" ? 1 : 0;
                updateSpotRate($rateFXTRF, _SpotRate, indexTRF,_thistile); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
                GetMaxClientProfitCCyFXTRF(_TileID); // LGTGTWINT-1832 | Chaitanya M | 05 Jun 2023
               }
               //END
  
                $(_thistile).find('[id^="hdnsignalRMsgRecv"]').val("YES"); // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023 
                MapPricesFXTRF(PRICEOBJ, _thistile,true);
                $(_thistile).find('[id^="hdnPricesFXObj"]').val(JSON.stringify(PRICEOBJ));
                $(_thistile).find('[id*="btnBestPriceFX"]').attr("disabled", false);
                break;
  
          case "FXPIVOT":
               _signalRMsgRecvFXPivot = true; // FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023   
               
               //LGTGTWINT-2075 // RizwanS || 03 Jun 2023
               if(_SpotRate !== ""){
                let $rateFXPIVOT = $(_thistile).find('[id^="rateFXPivot"]');
                let indexPIVOT = 1;
                updateSpotRate($rateFXPIVOT, _SpotRate, indexPIVOT,_thistile); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
                GetMaxClientProfitCCyFXPivot(_TileID); // LGTGTWINT-1832 | Chaitanya M | 05 Jun 2023
               }
               //END
  
                $(_thistile).find('[id^="hdnsignalRMsgRecv"]').val("YES"); // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023  
                MapPricesFXPIVOT(PRICEOBJ, _thistile,true);
                $(_thistile).find('[id^="hdnPricesFXObj"]').val(JSON.stringify(PRICEOBJ));
                $(_thistile).find('[id*="btnBestPriceFX"]').attr("disabled", false);
                break;
          
          case "STRATEGIES":
  
                _signalRMsgRecvFXStrategies = true; //FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023             
               
               //LGTGTWINT-2075 // RizwanS || 03 Jun 2023
               if(_SpotRate !== ""){
                 let $rateFXFXStrategies = $(_thistile).find('[id^="rateFXStrategies"]');
                 let indexFXStrategies = $(_thistile).find('[id^="strategiesBuySell"]').val().trim() == "Buy" ? 1 : 0;
                 updateSpotRate($rateFXFXStrategies, _SpotRate, indexFXStrategies, _thistile); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
               }
               //END
   
               $(_thistile).find('[id^="hdnsignalRMsgRecv"]').val("YES"); // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023             
               MapPricesFXStrategies(PRICEOBJ, _thistile,true);
               $(_thistile).find('[id^="hdnPricesFXObj"]').val(JSON.stringify(PRICEOBJ));
               $(_thistile).find('[id*="btnBestPriceFXStrategies"]').attr("disabled", false);          
               break;
     case "FXOPTION" :              
              _signalRMsgRecvFXO = true; // FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023   
               
               //LGTGTWINT-2075 // RizwanS || 03 Jun 2023
               if(_SpotRate !== ""){
                let $rateFXO = $(_thistile).find('[id^="rateFXO"]');
                let indexFXO = 1;
                updateSpotRate($rateFXO, _SpotRate, indexFXO,_thistile); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
                 
               }
               //END  
                $(_thistile).find('[id^="hdnsignalRMsgRecv"]').val("YES"); // LGTGTWINT-1934 || ChaitanyaM || 02 Jun 2023  
                MapPricesFXO(PRICEOBJ, _thistile,true);
                $(_thistile).find('[id^="hdnPricesFXObj"]').val(JSON.stringify(PRICEOBJ));
                $(_thistile).find('[id*="btnBestPriceFX"]').attr("disabled", false);
                break;
          default:
            console.log("Invalid product name sent to SignalR..");
            break;
        }    

      }

    };

    $.connection.hub.start().done(function () {
      console.log("firstload Connection id :" + $.connection.hub.id);
      sessionStorage.setItem("signalRconnectionID_", $.connection.hub.id);
    });

    $.connection.hub.connectionSlow(function () {
      console.log("We are currently experiencing difficulties with the connection.");
    });

    $.connection.hub.error(function (error) {
      console.log("SignalR error: " + error);
    });

  } catch (e) {
    console.log("firstload : " + e.message);
  }
}

//To send Quotes to SignalR to fetch prices 
function callHub(quoteID,maxQuoteTimeOut) {
  try {
 
    proxy.server.connectNew(userName, quoteID,maxQuoteTimeOut).fail(function (error) { //FXD || Dynamic pricing on Instant pricer|| LGTGTWINT-1934 || ChaitanyaM || 22 May 2023 
      console.log("connectNew error: " + error);
    });
  } catch (e) {
    console.log("callHub : " + e.message);
  }
}

//To unsubcribe quotes 
// LGTGTWINT-1934 || ChaitanyaM || 03 Jun 2023  
//LGTGTWINT-2110 | Chaitanya M | 13 June 2023
function UnsubcribeRFQID(_thisTile,bestPriceclikced) {
  try {

      // LGTGTWINT-1934 || ChaitanyaM || 03 Jun 2023 
      let _productname = $(_thisTile).find(".productName").attr("id");
      let _prodCode = "";
      switch(_productname.toUpperCase()){
        case "FXAQ":
          if ($(_thisTile).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {
            _prodCode = productCodeAQ; 
          }else{ 
            _prodCode = productCodeDQ; 
          } 
          break; 
        case "FXTRF":
          if ($(_thisTile).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
            _prodCode = productCodeTRFBuy;
          } else {
            _prodCode = productCodeTRFSell;
          } 
          break;
        case "FXPIVOT": 
          _prodCode = productCodePivot;
          break;
        case "STRATEGIES": 
              if ($(_thisTile).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
              _prodCode = productCodeStraddle;
              } else if ($(_thisTile).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
                _prodCode = productCodeStrangle;
              } else if ($(_thisTile).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
                _prodCode = productCodeRSKREV;
              } 
        break;
        
      }
    //End

    if($(_thisTile).find('[id^="hdnQuoteString"]').val() === ""){ // LGTGTWINT-1934 || RizwanS || 05 Jun 2023 

      return false;

    }
    
    let RFQIDs = $(_thisTile).find('[id^="hdnQuoteString"]').val();
    let DCDRFQIDs = $(_thisTile).find('[id^="hdno_DCDRFQID"]').val();
    let NMIDs = $(_thisTile).find('[id^="hdnNMID"]').val();
    let TileId = _thisTile.id.match(/\d+$/)[0];
 
    request_getDataFromAPI(
      {
   
        "iEntityID": EntityID,
        "LoginID": userName,
        "ProductCode": _prodCode, // LGTGTWINT-1934 || ChaitanyaM || 03 Jun 2023  
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "RFQIDs":RFQIDs,
        "DCDRFQID" : DCDRFQIDs,
        "NoteMasterID" : NMIDs,
        // "UpdateOnly" : "Y" // Commented by RizwanS as disccused with Rahul P || 30 May 2023
        "CurrentTileID": TileId

      },
      clientConfigdata.CommonMethods.NodeServer + "UnsubcribeRFQID_IP"
    ).then((data) => {

        let _thisTile = document.getElementById("td" + data.CurrentTileID);
 
        if(data.UnsubcribeRFQIDResult.A_ResponseReceived == true){

          delete dictFXD[data.CurrentTileID]; // To remove single element from dictionary.
         
          // LGTGTWINT-1934 || RizwanS || 05 Jun 2023 
          $(_thisTile).find('[id^="hdnQuoteString"]').val("");
          $(_thisTile).find('[id^="hdno_DCDRFQID"]').val("");
          $(_thisTile).find('[id^="hdnNMID"]').val("");
          $(_thisTile).find('[id^="hdnsignalRMsgRecv"]').val("");
          $(_thisTile).find('[id^="SignalRTimer"]').html(''); //LGTGTWINT-2110 | Chaitanya M | 13 June 2023
          $(_thisTile).find('[id^="SignalRTimer"]').val(''); //LGTGTWINT-2110 | Chaitanya M | 13 June 2023
          //END
          
          // Start - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023
          //start - LGTGTWINT-2110 | Chaitanya M | 13 June 2023
          // if(bestPriceclikced === true){
          //   $(_thisTile).find('[id*="btnBestPriceFX"]').attr("disabled", true); //LGTGTWINT-2110 | Chaitanya M | 13 June 2023
          // }else{
          //   $(_thisTile).find('[id*="btnBestPriceFX"]').attr("disabled", false);
          // }
          // END - LGTGTWINT-2110 | Chaitanya M | 13 June 2023
                  
          
          clearInterval($(_thisTile).find('[id^="hdntimerInterval"]').val());
          clearTimeout($(_thisTile).find('[id^="hdnRFSMinTimer"]').val());
          clearTimeout($(_thisTile).find('[id^="hdnRFSMaxTimer"]').val()); 
      
          $(_thisTile).find('[id^="hdntimerInterval"]').val("");
          $(_thisTile).find('[id^="hdnRFSMinTimer"]').val("");
          $(_thisTile).find('[id^="hdnRFSMaxTimer"]').val("");
          $(_thisTile).find('[id^="SignalRTimer"]').html("");
          
          // END - LGTGTWINT-2332 | Chaitanya M | 24 Aug 2023

        }
        
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

//LGTGTWINT-2075 // RizwanS || 03 Jun 2023
function updateSpotRate(rateFX,spotrate,index,_thistile){
  try{

    rateFX.html((_, oldHtml) => {
      let _parts = oldHtml.split(' / ');
      _parts[index] = spotrate.toFixed($(_thistile).find('[id*="hdnDecimalRateFX"]').val()); //LGTGTWINT-2075 || RizwanS || 09 Jun 2023
      return _parts.join(' / ');
    });

  }catch(error){
    console.log(error);
  }
 }
 //END

 // LGTGTWINT-1934 || Rizwan S || 05 Jun 2023
 function stopSignalRConnection() {
  try{

    $.connection.hub.stop(function() {
      console.log("Disconnected from SignalR server.");
    });

  }catch(error){
    console.log(error.message);
  }
}
//END


 //LGTGTWINT-2110 | Chaitanya M | 13 June 2023
 //Start
function startRFSTimer(thistile){
  try {
     
    let _productname = $(thistile).find(".productName").attr("id");
    var timeravar = setInterval(function() {   

      switch(_productname.toUpperCase()){
        case "FXAQ":
          showtimerYNFXAQ="Y"; 
          break; 
        case "FXTRF":           
            showtimerYNFXTRF="Y";
          break;
        case "FXPIVOT": 
            showtimerYNFXPivot="Y";
          break;
        case "STRATEGIES": 
            showtimerYNFXStrategies="Y";
          break;
          case "FXOPTION": 
            showtimerYNFXO="Y";
          break;
      }
      
              
      if(Number($(thistile).find('[id^="timerFX"]').val())>=0) {  

        if($(thistile).find('[id^="hdnPrices"]').val() === "" || 
        $(thistile).find('[id^="hdnPrices"]').val() === null ||
        $(thistile).find('[id^="hdnPrices"]').val() === undefined ){

        $(thistile).find('[id^="TimerDiv"]').removeClass("Showtimer");      
        $(thistile).find('[id^="SignalRTimer"]').html(Number($(thistile).find('[id^="timerFX"]').val()));
        $(thistile).find('[id^="timerFX"]').val(Number($(thistile).find('[id^="timerFX"]').val()) - 1) ;
      
        }else{
          
          $(thistile).find('[id^="TimerDiv"]').addClass("Showtimer");        
          $(thistile).find('[id^="SignalRTimer"]').attr('title', 'You can place order after '+ Number($(thistile).find('[id^="timerFX"]').val())+ ' seconds.');               
          $(thistile).find('[id^="SignalRTimer"]').html(Number($(thistile).find('[id^="timerFX"]').val()));
          $(thistile).find('[id^="timerFX"]').val(Number($(thistile).find('[id^="timerFX"]').val()) - 1) ;
        }

      }else{

        $(thistile).find('[id^="TimerDiv"]').removeClass("Showtimer");                      
        $(thistile).find('[id^="SignalRTimer"]').html(''); 
        switch(_productname.toUpperCase()){
          case "FXAQ":
            stopRFSTimer(timeravar,thistile,"showtimerYNFXAQ");
            break; 
          case "FXTRF":           
            stopRFSTimer(timeravar,thistile,"showtimerYNFXTRF");
            break;
          case "FXPIVOT": 
            stopRFSTimer(timeravar,thistile,"showtimerYNFXPivot");
            break;
          case "STRATEGIES": 
            stopRFSTimer(timeravar,thistile,"showtimerYNFXStrategies");
            break;
             case "FXOPTION": 
            stopRFSTimer(timeravar,thistile,"showtimerYNFXO");
            break;
        }              

      }    

    },1000); 
 
  } catch (error) {
    
  }
}
//End

//LGTGTWINT-2110 | Chaitanya M | 13 June 2023
//Start
function stopRFSTimer(intervalid,thistile,timerYN){
  try {
    
    if($(thistile).find('[id^="SignalRTimer"]').html() == ""){
      clearInterval(intervalid);
      timerYN="N";
    }

  } catch (error) {
    
  }
}
//End
//----------------------------------------- RFS:: END -------------------------------------------//
//------------------------------------------------------------------------------------------------//

//LGTGTWINT-2141 : LGTEAM RFQ ID wise sequence issue for all payoffs | Chaitanya M | 26 June 2023
function bindRFQIDEQC(thistile,obj){
  try {
    
    $(thistile).find('[id^="RFQIDEQC"]').html("");
    $(thistile).find('[id^="RFQIDEQC"]').html("RFQ ID: " + obj[0].EP_ER_QuoteRequestId);

  } catch (error) {
    console.log(error.message);
  }
}
//End


// RizwanS || LGTGTWINT-2378 Show volsurf, spot history and IR as a shortcut from Maple FXD || 20 Oct 2023
//----------------------------------------------START----------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//

var spotRatesChart;
var IRRatesCharts;
var swappointsCharts;

function getMarketDataFXD(that){
  try{

    TileId = that.id.match(/\d+$/)[0];
    thisTileFX = document.getElementById("td" + TileId);

    let productName = $($(that).parents(".sorting").find(".productName")).attr('id');

    let priceOBJ = "";

        let ccypair = '';
        let ccypairs = '';

        switch (productName) {

            case "FXOPTION":

                if($(thisTileFX).find('[id^="FXO_Type"]').val().trim() != "Vanilla") {
                  ccypairs = sessionStorage.getItem("CCYListFXBarrier");
                } else {
                  ccypairs = sessionStorage.getItem("CCYListFXVanilla");
                }

                if(!ccypairs.includes($(thisTileFX).find('[id^="FXO_CCYPairDemo"]').val())){
                  ValidateFieldmail("OrderPlacedAll", "Invalid currency pair selected.",true ,"N","Error");
                  return false;
                }
              
                ccypair = $(thisTileFX).find('[id^="FXO_CCYPairDemo"]').val();
                priceOBJ = $(thisTileFX).find('[id^="hdnPricesFXO"]').val();
                break;

            case "FXAQ":

               ccypairs = sessionStorage.getItem("CCYListFXAQ"); 
                if(!ccypairs.includes($(thisTileFX).find('[id^="FXAQ_CCYPairDemo"]').val())){
                  ValidateFieldmail("OrderPlacedAll", "Invalid currency pair selected.",true ,"N","Error");
                  return false;
                }
                ccypair = $(thisTileFX).find('[id^="FXAQ_CCYPairDemo"]').val();
                priceOBJ = $(thisTileFX).find('[id^="hdnPricesFXAQ"]').val();
                break;

            case "FXTRF":

                ccypairs= sessionStorage.getItem("CCYListFXTRFBuy");
                if(!ccypairs.includes($(thisTileFX).find('[id^="FXTRF_CCYPairDemo"]').val())){ 
                  ValidateFieldmail("OrderPlacedAll", "Invalid currency pair selected.",true ,"N","Error");
                  return false;
                }

                ccypair = $(thisTileFX).find('[id^="FXTRF_CCYPairDemo"]').val();
                priceOBJ = $(thisTileFX).find('[id^="hdnPricesFXTRF"]').val();
                break;

            case "FXPIVOT":
                ccypairs = sessionStorage.getItem("CCYListFXPivot");
                if(!ccypairs.includes($(thisTileFX).find('[id^="FXPivot_CCYPairDemo"]').val())){ 
                  ValidateFieldmail("OrderPlacedAll", "Invalid currency pair selected.",true ,"N","Error");
                  return false;
                }
                ccypair = $(thisTileFX).find('[id^="FXPivot_CCYPairDemo"]').val();
                priceOBJ = $(thisTileFX).find('[id^="hdnPricesFXPivot"]').val();
                break;

            case "FXDigital":

                ccypair = $(thisTileFX).find('[id^="FXDigital_CCYPairDemo"]').val();
                priceOBJ = $(thisTileFX).find('[id^="hdnPricesFXO"]').val();
                break;
            case "FXDCI":

                ccypair = $(thisTileFX).find('[id^="FXDCI_CCYPairDemo"]').val();
                priceOBJ = $(thisTileFX).find('[id^="hdnPricesFXO"]').val();
                break;
            case "Strategies":

                if ($(thisTileFX).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {
                
                  ccypairs =  sessionStorage.getItem("CCYListStraddle"); 
            
                }else if ($(thisTileFX).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {
            
                  ccypairs =  sessionStorage.getItem("CCYListStrangle"); 
              
                }else if($(thisTileFX).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal"){
                
                  ccypairs =  sessionStorage.getItem("CCYListRSKREV"); 
            
                }else if ($(thisTileFX).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {      
      
                  ccypairs =  sessionStorage.getItem("CCYListOPSPRD"); 
      
                }

                if(!ccypairs.includes($(thisTileFX).find('[id^="FXStrategies_CCYPairDemo"]').val())){ 
                  ValidateFieldmail("OrderPlacedAll", "Invalid currency pair selected.",true ,"N","Error");
                  return false;
                }

                ccypair = $(thisTileFX).find('[id^="FXStrategies_CCYPairDemo"]').val();
                priceOBJ = $(thisTileFX).find('[id^="hdnPricesFXStrategies"]').val();
                break;
        }

        if(priceOBJ !== ""){
          openMarketDataPopUPFXD(TileId,ccypair,productName,priceOBJ,true);
        }else{
          openMarketDataPopUPFXD(TileId,ccypair,productName,priceOBJ,false);
        }

  }catch(error){
    console.log(error.message);
  }
}

function openMarketDataPopUPFXD(TileId,ccypair,productName,priceOBJ,flag){
  try{

    if(ccypair == ""){
      ValidateFieldmail("OrderPlacedAll", "Invalid currency pair selected.",true ,"N","Error");
      return false;
    }

    addOverlayEQC();

    setMarketPopUpPositionFXD();

    $(".marketDataPopUpFXD").show();

    $("#payoffName").html(productName + " " + "(" + ccypair + ")" );
    
    //Volatility Data Start-----
    //---------------------------------------------//
    //---------------------------------------------//
    $("#volatilitySection").css("display", "none");
    getvoldataFX(TileId, ccypair);
    //Volatility Data END-----
    //---------------------------------------------//
    //---------------------------------------------//

    //IR Data Start-----
    //---------------------------------------------//
    //---------------------------------------------//
      $("#IRRatesTbl").empty();
      $("#IRcanvas").empty();
      $("#IRSection").css("display", "none");
      if (IRRatesCharts != undefined) {
            IRRatesCharts.destroy();
      }
      getIRData(TileId, ccypair);
    //IR Data END-----
    //---------------------------------------------//
    //---------------------------------------------//


    //Swap points data Start-----
    //---------------------------------------------//
    //---------------------------------------------//
      $("#SwapPointsTbl").empty();
      $("#swapPointsSection").css("display", "none");
      if (swappointsCharts != undefined) {
        swappointsCharts.destroy();
      }
      getSwapPointsData(TileId,ccypair);
   //Swap points data END-----
   //---------------------------------------------//
   //---------------------------------------------//


    //Spot Histiry Data Start-----
    //---------------------------------------------//
    //---------------------------------------------//
      $("#tableContainer").empty();
      $("#spotHistorySection").css("display", "none");
      $("#tableContainer").css("color", "red");
      if (spotRatesChart != undefined) {
        spotRatesChart.destroy();
      }
      GetSpotHistoryData(TileId, ccypair);
    //Spot Histiry Data Start-----
    //---------------------------------------------//
    //---------------------------------------------//

    if(flag ===true){
      $("#greekstbl").show();
      PlotGreeksGrid(JSON.parse(priceOBJ));
    }else{
      $("#greekstbl").hide();
    }
    
  }catch(error){
    console.log(error.message);
  }
}

function getSpotRatesData(TileID, ccypair) {

  try {

      request_getDataFromAPI({
         
          "paircode": ccypair,
          "optioncut": "TOK",
          "CurrentTileID": TileID

      }, clientConfigdata.CommonMethods.NodeServer + "HistoricalRateFeed/GetRateFeedData").then(data => {

          let thisTileFX = document.getElementById("td" + data.CurrentTileID.split("|")[0]);

          $("#spotHistorySection").css("display", "block");

          if (data.dataFromAjax.GetRateFeedDataResult == '' || data.dataFromAjax.GetRateFeedDataResult == null) {
            $("#spotHistorySection").css("display", "none");
          }else{

            let spotDataValues = [];
            let spotlblDates = [];
  
            for (i = 0; i < data.dataFromAjax.GetRateFeedDataResult.length; i++) {
  
                spotDataValues.push(data.dataFromAjax.GetRateFeedDataResult[i].avgRate);
                spotlblDates.push(data.dataFromAjax.GetRateFeedDataResult[i].rateDate);
  
            }
  
            // $("#spotRatesccy").html(("(" + data.GetRateFeedDataResult[0].PairCode +")"))
            plotchartFX("Spotcanvas", spotDataValues, spotlblDates, "", ccypair, true);

          }

      }).catch(error => { console.log(error); })

     // plot chart


  } catch (error) {
      console.log(error.message);
      $(".lblError").html(error.message)
  } finally {

  }

}

function getIRData(TileID, ccypair) {

  try {


      request_getDataFromAPI({

          "CcyPair": ccypair,
          // "CurrentTileID": TileID

      }, clientConfigdata.CommonMethods.NodeServer + "IRCalculation/IRCalculation").then(data => {

          // let thisTileFX = document.getElementById("td" + data.CurrentTileID);

          if (data.dataFromAjax.getTenorDetailsResult == '' || data.dataFromAjax.getTenorDetailsResult == null) {
            $("#IRSection").css("display", "none");
          }else{

          $("#IRSection").css("display", "block");  
      
          // Plot chart
          let IRlblTenorDays = [];
          let IR1 = [];
          let IR2 = [];

          let _lbl1 = "Bid IR" + " " +  ccypair.split("-")[0];
          let _lbl2 = "Ask IR" + " " +  ccypair.split("-")[0];
          let _lbl3 = "Bid IR" + " " +  ccypair.split("-")[1];
          let _lbl4 = "Ask IR" + " " +  ccypair.split("-")[1];
          let _headers = ["Tenor Days",_lbl1,_lbl2,_lbl3,_lbl4];

          let _tenorDays =[];
          let _ccy1BidIR = [];
          let _ccy1AskIR = [];
          let _ccy2BidIR = [];
          let _ccy2AskIR = [];

          for (i = 0; i < data.dataFromAjax.getTenorDetailsResult.length; i++) {

              IR1.push(((parseFloat(data.dataFromAjax.getTenorDetailsResult[i].ccY1AskIR) + parseFloat(data.dataFromAjax.getTenorDetailsResult[i].ccY1BidIR)) / 2).toFixed(4));
              IR2.push(((parseFloat(data.dataFromAjax.getTenorDetailsResult[i].ccY2AskIR) + parseFloat(data.dataFromAjax.getTenorDetailsResult[i].ccY2BidIR)) / 2).toFixed(4));
              IRlblTenorDays.push(data.dataFromAjax.getTenorDetailsResult[i].tenorDays_MM + "D");

              _tenorDays.push(data.dataFromAjax.getTenorDetailsResult[i].tenorDays_MM);
              _ccy1BidIR.push(data.dataFromAjax.getTenorDetailsResult[i].ccY1BidIR.toFixed(4));
              _ccy1AskIR.push(data.dataFromAjax.getTenorDetailsResult[i].ccY1AskIR.toFixed(4));
              _ccy2BidIR.push(data.dataFromAjax.getTenorDetailsResult[i].ccY2BidIR.toFixed(4));
              _ccy2AskIR.push(data.dataFromAjax.getTenorDetailsResult[i].ccY2AskIR.toFixed(4));
           }
              plotIRChart("IRcanvas",_ccy1BidIR,_ccy1AskIR,_ccy2BidIR,_ccy2AskIR,IRlblTenorDays,ccypair)
              PlotIRGrid(_headers,_tenorDays,_ccy1BidIR,_ccy1AskIR,_ccy2BidIR,_ccy2AskIR);
          }

      }).catch(error => { console.log(error); })
  } catch (error) {
      console.log(error.message);
      $(".lblError").html(error.message)
  } finally {

  }

}

function getSwapPointsData(TildID, ccypair){
  try{

    request_getDataFromAPI({

      "Ccy1": ccypair.split("-")[0].trim(),
      "Ccy2": ccypair.split("-")[1].trim(),
      "CcyPair": "",
      "CurrentTileID": TildID

  }, clientConfigdata.CommonMethods.NodeServer + "getSwapPointsData").then(data => {

      let thisTileFX = document.getElementById("td" + data.CurrentTileID);

      if (data.GetSwapPointsResult == '' || data.GetSwapPointsResult == null) {
        $("#swapPointsSection").css("display", "none");
      }else{
        $("#swapPointsSection").css("display", "block");
        let swapPointArray = data.GetSwapPointsResult;

        let _swappointHeaders =["Tenor Days","Fwd Points Bid","Fwd Points Ask","Fwd Points Mid","Currency"]
        let _swappointMid = [];
        let _swappointBid = [];
        let _swappointAsk = [];
        let _swappointccy = [];
        let _swappointTenorDays = [];
  
        let _ccy1MidRate = [];
        let _ccy2MidRate = [];
        let _tenorDaysSwap1 = [];
        let _tenorDaysSwap2 = [];
  
        for(n=0;n<swapPointArray.length;n++){
  
          _swappointMid.push(swapPointArray[n].YCSwappointsmid);
          _swappointBid.push(swapPointArray[n].YCSwapPointsBid);
          _swappointAsk.push(swapPointArray[n].YCSwapPointsAsk);
          _swappointccy.push(swapPointArray[n].YCCurrency);
          _swappointTenorDays.push(swapPointArray[n].YCTenorDays);
  
          if(ccypair.split("-")[0].trim() === swapPointArray[n].YCCurrency){
            _ccy1MidRate.push(swapPointArray[n].YCSwappointsmid);
            _tenorDaysSwap1.push(swapPointArray[n].YCTenorDays);
          }else{
            _ccy2MidRate.push(swapPointArray[n].YCSwappointsmid);
            _tenorDaysSwap2.push(swapPointArray[n].YCTenorDays);
          }
  
        }
        if(_ccy1MidRate.length === 0){
            plotchartFX("swapPointscanvas", _ccy1MidRate, _tenorDaysSwap2, _ccy2MidRate, ccypair, "");
        }else{
            plotchartFX("swapPointscanvas", _ccy1MidRate, _tenorDaysSwap1, _ccy2MidRate, ccypair, "");
        }  
          PlotSwapPointsGrid(_swappointHeaders,_swappointTenorDays,_swappointMid,_swappointBid,_swappointAsk,_swappointccy);
      }
      
  }).catch(error => { console.log(error); })
    
  }catch(error){

      console.log(error.message);

  }
}

function plotchartFX(ctx, dataset, labels,dataset1,ccy,fill) {

  try {
    
      if (fill == true) {

          if (spotRatesChart != undefined) {

              spotRatesChart.destroy();
          }

          spotRatesChart = new Chart(ctx, {
              type: 'line',
              data: {
                  labels: labels,
                  datasets: [{
                      label: ccy + " " + "(Mid Rate)", // Name the series
                      data: dataset, // Specify the data values array
                      fill: false,
                      borderColor: '#FF8000', // Add custom color border (Line)
                      backgroundColor: '#FF8000', // Add custom color background (Points and Fill)
                      borderWidth: 1.5, // Specify bar border width
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 1000, // Animation duration in milliseconds
                    easing: 'easeOutBounce' // Animation easing function
                },
                  elements: {
                      point: {
                          radius: 0
                      }
                  },
                  scales: {
                    xAxes: [{
                      gridLines: {
                        display: true,
                        color: "#cfcfcf",
                        lineWidth:0.4,
                      },
                        ticks: {
                            // beginAtZero: true
                        }
                    }],
                    yAxes: [{
                      gridLines: {
                        display: true,
                        color: "#cfcfcf",
                        lineWidth:0.4,
                      },
                        ticks: {
                            // beginAtZero: true
                        }
                    }]
                }
              }
          });

      }

      if (fill === "") {

        if (swappointsCharts != undefined) {

            swappointsCharts.destroy();
        }

          swappointsCharts = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: ccy.split('-')[0], // Name the series
                    data: dataset, // Specify the data values array
                    fill: fill,
                    borderColor: '#FF8000', // Add custom color border (Line)
                    backgroundColor: '#FF8000', // Add custom color background (Points and Fill)
                    borderWidth: 1.5, // Specify bar border width
                    
                
                },
                {
                    label: ccy.split('-')[1], // Name the series
                    data: dataset1, // Specify the data values array
                    fill: fill,
                    borderColor: '#ca8793', // Add custom color border (Line)
                    backgroundColor: '#ca8793', // Add custom color background (Points and Fill)
                    borderWidth: 2, // Specify bar border width
                    

                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 1000, // Animation duration in milliseconds
                  easing: 'easeOutBounce' // Animation easing function
              },
                scales: {
                    xAxes: [{
                      gridLines: {
                        display: true,
                        color: "#cfcfcf",
                        lineWidth:0.4,
                      },
                        ticks: {
                            // beginAtZero: true
                        }
                    }],
                    yAxes: [{
                      gridLines: {
                        display: true,
                        color: "#cfcfcf",
                        lineWidth:0.4,
                      },
                        ticks: {
                            // beginAtZero: true
                        }
                    }]
                }
            }
        });

      }

  } catch (error) {
      console.log(error.message);
      $(".lblError").html(error.message)
  } finally {

  }
}

function plotIRChart(ctx,data1,data2,data3,data4,labels,ccy){
  try{
        
      if (IRRatesCharts != undefined) {

          IRRatesCharts.destroy();
      }

      let _ccy1lbl1= ccy.split("-")[0].trim() + " " + "(Bid IR)";
      let _ccy1lbl2= ccy.split("-")[0].trim() + " " + "(Ask IR)";

      let _ccy2lbl1= ccy.split("-")[1].trim() + " " + "(Bid IR)";
      let _ccy2lbl2= ccy.split("-")[1].trim() + " " + "(Ask IR)";

      IRRatesCharts = new Chart(ctx, {
          type: 'line',
          data: {
              labels: labels,
              datasets: [{
                  label:_ccy1lbl1, // Name the series
                  data: data1, // Specify the data values array
                  fill: false,
                  borderColor: '#FF8000', // Add custom color border (Line)
                  backgroundColor: '#FF8000', // Add custom color background (Points and Fill)
                  borderWidth: 1.5, // Specify bar border width
              
              },
              {
                  label: _ccy1lbl2, // Name the series
                  data: data2, // Specify the data values array
                  fill: false,
                  borderColor: '#ca8793', // Add custom color border (Line)
                  backgroundColor: '#ca8793', // Add custom color background (Points and Fill)
                  borderWidth: 1.5, // Specify bar border width

              },
              {
                label: _ccy2lbl1, // Name the series
                data: data3, // Specify the data values array
                fill: false,
                borderColor: '#8dacc7', // Add custom color border (Line)
                backgroundColor: '#8dacc7', // Add custom color background (Points and Fill)
                borderWidth: 1.5, // Specify bar border width

            },
            {
              label: _ccy2lbl2, // Name the series
              data: data4, // Specify the data values array
              fill: false,
              borderColor: '#3dc79f', // Add custom color border (Line)
              backgroundColor: '#3dc79f', // Add custom color background (Points and Fill)
              borderWidth: 1.5, // Specify bar border width

           }
            ]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 1000, // Animation duration in milliseconds
                easing: 'easeOutBounce' // Animation easing function
            },
              scales: {
                  xAxes: [{
                    gridLines: {
                      display: true,
                      color: "#cfcfcf",
                      lineWidth:0.4,
                    },
                      ticks: {
                          // beginAtZero: true
                      }
                  }],
                  yAxes: [{
                    gridLines: {
                      display: true,
                      color: "#cfcfcf",
                      lineWidth:0.4,
                    },
                      ticks: {
                          // beginAtZero: true
                      }
                  }]
              }
          }
      });

  }catch(error){
    console.log(error.message)
  }
}

//VolSurf 3D Chart Start 
function getvoldataFX(TileID, ccypair) {
try {

      $("#Vcanvas").html("");
      // $("#Volerrormsg").html("");

      request_getDataFromAPI({

          "ccyPair": ccypair,
          "CurrentTileID": TileID

      }, clientConfigdata.CommonMethods.NodeServer + "getvoldataFX").then(data => {


          let thisTileFX = document.getElementById("td" + data.CurrentTileID);

          if (data.Get_VolDataResult == '' || data.Get_VolDataResult == null) {
            $("#volatilitySection").css("display", "none");
          }else{
            $("#volatilitySection").css("display", "block");
            volcnt = 0;
          let Pillar1D = [];
          let Pillar1W = [];
          let Pillar2W = [];
          let Pillar1M = [];
          let Pillar2M = [];
          let Pillar3M = [];
          let Pillar6M = [];
          let Pillar1Y = [];
          let Pillar2Y = [];
          let ATMVal;


          //for vol surface 

          let Pillar1DVol = [];
          let Pillar1WVol = [];
          let Pillar2WVol = [];
          let Pillar1MVol = [];
          let Pillar2MVol = [];
          let Pillar3MVol = [];
          let Pillar6MVol = [];
          let Pillar1YVol = [];
          let Pillar2YVol = [];

          for (i = 0; i < data.Get_VolDataResult.length; i++) {

              ATMVal = parseFloat(data.Get_VolDataResult[i].ATM);

              if (data.Get_VolDataResult[i].SoftMaturity === '1D') {
                  Pillar1D[0] = parseFloat(data.Get_VolDataResult[i].s10DP) + ATMVal;
                  Pillar1D[1] = parseFloat(data.Get_VolDataResult[i].s25DP) + ATMVal;
                  Pillar1D[2] = ATMVal;
                  Pillar1D[3] = parseFloat(data.Get_VolDataResult[i].s25DC) + ATMVal;
                  Pillar1D[4] = parseFloat(data.Get_VolDataResult[i].s10DC) + ATMVal;

                  Pillar1DVol[0] = Number(data.Get_VolDataResult[i].Maturity);
                  Pillar1DVol[1] = (parseFloat(data.Get_VolDataResult[i].s10DP)+ ATMVal).toFixed(2);
                  Pillar1DVol[2] = (parseFloat(data.Get_VolDataResult[i].s25DP)+ ATMVal).toFixed(2);;
                  Pillar1DVol[3] = ATMVal.toFixed(2);
                  Pillar1DVol[4] = (parseFloat(data.Get_VolDataResult[i].s25DC)+ ATMVal).toFixed(2);;
                  Pillar1DVol[5] = (parseFloat(data.Get_VolDataResult[i].s10DC)+ ATMVal).toFixed(2);;
                  volcnt = volcnt + 1;
              }
              if (data.Get_VolDataResult[i].SoftMaturity === '1W') {

                  Pillar1W[0] = parseFloat(data.Get_VolDataResult[i].s10DP) + ATMVal;
                  Pillar1W[1] = parseFloat(data.Get_VolDataResult[i].s25DP) + ATMVal;
                  Pillar1W[2] = ATMVal;
                  Pillar1W[3] = parseFloat(data.Get_VolDataResult[i].s25DC) + ATMVal;
                  Pillar1W[4] = parseFloat(data.Get_VolDataResult[i].s10DC) + ATMVal;

                  Pillar1WVol[0] =  Number(data.Get_VolDataResult[i].Maturity);
                  Pillar1WVol[1] = (parseFloat(data.Get_VolDataResult[i].s10DP)+ ATMVal).toFixed(2);
                  Pillar1WVol[2] = (parseFloat(data.Get_VolDataResult[i].s25DP)+ ATMVal).toFixed(2);
                  Pillar1WVol[3] = ATMVal.toFixed(2);
                  Pillar1WVol[4] = (parseFloat(data.Get_VolDataResult[i].s25DC)+ ATMVal).toFixed(2);
                  Pillar1WVol[5] = (parseFloat(data.Get_VolDataResult[i].s10DC)+ ATMVal).toFixed(2);

                  volcnt = volcnt + 1;
              }
              if (data.Get_VolDataResult[i].SoftMaturity === '2W') {

                  Pillar2W[0] = parseFloat(data.Get_VolDataResult[i].s10DP) + ATMVal;
                  Pillar2W[1] = parseFloat(data.Get_VolDataResult[i].s25DP) + ATMVal;
                  Pillar2W[2] = ATMVal;
                  Pillar2W[3] = parseFloat(data.Get_VolDataResult[i].s25DC) + ATMVal;
                  Pillar2W[4] = parseFloat(data.Get_VolDataResult[i].s10DC) + ATMVal;

                  Pillar2WVol[0] = Number(data.Get_VolDataResult[i].Maturity);
                  Pillar2WVol[1] = (parseFloat(data.Get_VolDataResult[i].s10DP)+ ATMVal).toFixed(2);
                  Pillar2WVol[2] = (parseFloat(data.Get_VolDataResult[i].s25DP)+ ATMVal).toFixed(2);
                  Pillar2WVol[3] = ATMVal.toFixed(2);
                  Pillar2WVol[4] = (parseFloat(data.Get_VolDataResult[i].s25DC)+ ATMVal).toFixed(2);
                  Pillar2WVol[5] = (parseFloat(data.Get_VolDataResult[i].s10DC)+ ATMVal).toFixed(2);

                  volcnt = volcnt + 1;
              }
              if (data.Get_VolDataResult[i].SoftMaturity === '1M') {

                  Pillar1M[0] = parseFloat(data.Get_VolDataResult[i].s10DP) + ATMVal;
                  Pillar1M[1] = parseFloat(data.Get_VolDataResult[i].s25DP) + ATMVal;
                  Pillar1M[2] = ATMVal;
                  Pillar1M[3] = parseFloat(data.Get_VolDataResult[i].s25DC) + ATMVal;
                  Pillar1M[4] = parseFloat(data.Get_VolDataResult[i].s10DC) + ATMVal;

                  Pillar1MVol[0] = Number(data.Get_VolDataResult[i].Maturity);
                  Pillar1MVol[1] = (parseFloat(data.Get_VolDataResult[i].s10DP)+ ATMVal).toFixed(2);
                  Pillar1MVol[2] = (parseFloat(data.Get_VolDataResult[i].s25DP)+ ATMVal).toFixed(2);
                  Pillar1MVol[3] = ATMVal.toFixed(2);
                  Pillar1MVol[4] = (parseFloat(data.Get_VolDataResult[i].s25DC)+ ATMVal).toFixed(2);
                  Pillar1MVol[5] = (parseFloat(data.Get_VolDataResult[i].s10DC)+ ATMVal).toFixed(2);


                  volcnt = volcnt + 1;
              }
              if (data.Get_VolDataResult[i].SoftMaturity === '2M') {

                  Pillar2M[0] = parseFloat(data.Get_VolDataResult[i].s10DP) + ATMVal;
                  Pillar2M[1] = parseFloat(data.Get_VolDataResult[i].s25DP) + ATMVal;
                  Pillar2M[2] = ATMVal;
                  Pillar2M[3] = parseFloat(data.Get_VolDataResult[i].s25DC) + ATMVal;
                  Pillar2M[4] = parseFloat(data.Get_VolDataResult[i].s10DC) + ATMVal;

                  Pillar2MVol[0] = Number(data.Get_VolDataResult[i].Maturity);
                  Pillar2MVol[1] = (parseFloat(data.Get_VolDataResult[i].s10DP)+ ATMVal).toFixed(2);
                  Pillar2MVol[2] = (parseFloat(data.Get_VolDataResult[i].s25DP)+ ATMVal).toFixed(2);
                  Pillar2MVol[3] = ATMVal.toFixed(2);
                  Pillar2MVol[4] = (parseFloat(data.Get_VolDataResult[i].s25DC)+ ATMVal).toFixed(2);
                  Pillar2MVol[5] = (parseFloat(data.Get_VolDataResult[i].s10DC)+ ATMVal).toFixed(2);



                  volcnt = volcnt + 1;
              }
              if (data.Get_VolDataResult[i].SoftMaturity === '3M') {

                  Pillar3M[0] = parseFloat(data.Get_VolDataResult[i].s10DP) + ATMVal;
                  Pillar3M[1] = parseFloat(data.Get_VolDataResult[i].s25DP) + ATMVal;
                  Pillar3M[2] = ATMVal;
                  Pillar3M[3] = parseFloat(data.Get_VolDataResult[i].s25DC) + ATMVal;
                  Pillar3M[4] = parseFloat(data.Get_VolDataResult[i].s10DC) + ATMVal;

                  Pillar3MVol[0] = Number(data.Get_VolDataResult[i].Maturity);
                  Pillar3MVol[1] = (parseFloat(data.Get_VolDataResult[i].s10DP)+ ATMVal).toFixed(2);
                  Pillar3MVol[2] = (parseFloat(data.Get_VolDataResult[i].s25DP)+ ATMVal).toFixed(2);
                  Pillar3MVol[3] = ATMVal.toFixed(2);
                  Pillar3MVol[4] = (parseFloat(data.Get_VolDataResult[i].s25DC)+ ATMVal).toFixed(2);
                  Pillar3MVol[5] = (parseFloat(data.Get_VolDataResult[i].s10DC)+ ATMVal).toFixed(2);

                  volcnt = volcnt + 1;
              }
              if (data.Get_VolDataResult[i].SoftMaturity === '6M') {

                  Pillar6M[0] = parseFloat(data.Get_VolDataResult[i].s10DP) + ATMVal;
                  Pillar6M[1] = parseFloat(data.Get_VolDataResult[i].s25DP) + ATMVal;
                  Pillar6M[2] = ATMVal;
                  Pillar6M[3] = parseFloat(data.Get_VolDataResult[i].s25DC) + ATMVal;
                  Pillar6M[4] = parseFloat(data.Get_VolDataResult[i].s10DC) + ATMVal;

                  Pillar6MVol[0] = Number(data.Get_VolDataResult[i].Maturity);
                  Pillar6MVol[1] = (parseFloat(data.Get_VolDataResult[i].s10DP)+ ATMVal).toFixed(2);
                  Pillar6MVol[2] = (parseFloat(data.Get_VolDataResult[i].s25DP)+ ATMVal).toFixed(2);
                  Pillar6MVol[3] = ATMVal.toFixed(2);
                  Pillar6MVol[4] = (parseFloat(data.Get_VolDataResult[i].s25DC)+ ATMVal).toFixed(2);
                  Pillar6MVol[5] = (parseFloat(data.Get_VolDataResult[i].s10DC)+ ATMVal).toFixed(2);

                  volcnt = volcnt + 1;
              }
              if (data.Get_VolDataResult[i].SoftMaturity === '1Y') {
                  Pillar1Y[0] = parseFloat(data.Get_VolDataResult[i].s10DP) + ATMVal;
                  Pillar1Y[1] = parseFloat(data.Get_VolDataResult[i].s25DP) + ATMVal;
                  Pillar1Y[2] = ATMVal;
                  Pillar1Y[3] = parseFloat(data.Get_VolDataResult[i].s25DC) + ATMVal;
                  Pillar1Y[4] = parseFloat(data.Get_VolDataResult[i].s10DC) + ATMVal;

                  Pillar1YVol[0] = Number(data.Get_VolDataResult[i].Maturity);
                  Pillar1YVol[1] = (parseFloat(data.Get_VolDataResult[i].s10DP)+ ATMVal).toFixed(2);
                  Pillar1YVol[2] = (parseFloat(data.Get_VolDataResult[i].s25DP)+ ATMVal).toFixed(2);
                  Pillar1YVol[3] = ATMVal.toFixed(2);
                  Pillar1YVol[4] = (parseFloat(data.Get_VolDataResult[i].s25DC)+ ATMVal).toFixed(2);
                  Pillar1YVol[5] = (parseFloat(data.Get_VolDataResult[i].s10DC)+ ATMVal).toFixed(2);

                  volcnt = volcnt + 1;
              }
              if (data.Get_VolDataResult[i].SoftMaturity === '2Y') {

                 Pillar2Y[0] = parseFloat(data.Get_VolDataResult[i].s10DP) + ATMVal;
                 Pillar2Y[1] = parseFloat(data.Get_VolDataResult[i].s25DP) + ATMVal;
                 Pillar2Y[2] = ATMVal;
                 Pillar2Y[3] = parseFloat(data.Get_VolDataResult[i].s25DC) + ATMVal;
                 Pillar2Y[4] = parseFloat(data.Get_VolDataResult[i].s10DC) + ATMVal;

                  Pillar2YVol[0] = Number(data.Get_VolDataResult[i].Maturity);
                  Pillar2YVol[1] = (parseFloat(data.Get_VolDataResult[i].s10DP)+ ATMVal).toFixed(2);
                  Pillar2YVol[2] = (parseFloat(data.Get_VolDataResult[i].s25DP)+ ATMVal).toFixed(2);
                  Pillar2YVol[3] = ATMVal.toFixed(2);
                  Pillar2YVol[4] = (parseFloat(data.Get_VolDataResult[i].s25DC)+ ATMVal).toFixed(2);
                  Pillar2YVol[5] = (parseFloat(data.Get_VolDataResult[i].s10DC)+ ATMVal).toFixed(2);

                  volcnt = volcnt + 1;

              }

          }

          draw3DVolFX(thisTileFX, Pillar1D, Pillar1W,Pillar2W,Pillar1M,Pillar2M,Pillar3M,Pillar6M,Pillar1Y, Pillar2Y, $(thisTileFX).find('[id^="FXO_CCYPairDemo"]').val());

          fillVolSurfTable(Pillar1DVol, Pillar1WVol, Pillar2WVol, Pillar1MVol, Pillar2MVol, Pillar3MVol, Pillar6MVol, Pillar1YVol, Pillar2YVol)
          }

      }).catch(error => { console.log(error); })



  } catch (error) {
      console.log(error.message);
      $(".lblError").html(error.message)
  } finally {

  }

}

function draw3DVolFX(thisTileFX, Pillar1D, Pillar1W,Pillar2W,Pillar1M,Pillar2M,Pillar3M,Pillar6M,Pillar1Y, Pillar2Y, ccy) {

  try {
         var data = [
             {
                 x: ['10d Put', '25d Put', 'ATM', '25d Call', '10d Call'],
                 y: ['1D','1W', '2W', '1M', '2M', '3M', '6M', '1Y','2Y'],
                 z: [

                     Pillar1D,
                     Pillar1W,
                     Pillar2W,
                     Pillar1M,
                     Pillar2M,
                     Pillar3M,
                     Pillar6M,
                     Pillar1Y,
                     Pillar2Y

                 ],
                 
                 colorscale: [
                     [1, '#FEC29F'],
                     [0.5, '#FFD2AB'],
                     [0, '#FFEAC0']

                      //  [0, '#FF6347'],
                      //  [0.5, '#FFA07A'],
                      //  [1, '#FFDAB9']
                      // [0, '#451a2b'],
                      // [0.5, '#8f5765'],
                      // [1, '#d9939f']


                 ],
                 type: 'surface',
            
                 
        }
          ];
         var layout = {
             title: '', //ccy,
             font: { size: 10 },
                autosize: true,
                 showTips: true,
                 width: 400,
                 height: 400,
                 modebar: false,
                 showlegend: false,
                 displayModeBar: false,
                 showscale: false,
                 paper_bgcolor: "rgba(0,0,0,0", //background color of the chart container space
                 plot_bgcolor: "rgba(0,0,0,0)", //background color of plot area
                 spaceframe: {
                     fill: 0,
                 },
                margin: {
                    l: 50,
                    r: 50,
                    b: 50,
                    t: 50,
                  },
               scene: {
                      xaxis: { title: 'Delta' },
                      yaxis: { title: 'Tenor' },
                      zaxis: { title: 'Vol' }

                  }
              };
         const config = {
              displayModeBar: false, // this is the line that hides the bar.
              responsive: true,
          };

      Plotly.newPlot("Vcanvas", data, layout, config);

  } catch (error) {
      console.log(error.message);
      $(".lblError").html(error.message)
  } finally {

  }

}

function fillVolSurfTable(Pillar1D, Pillar1W, Pillar2W, Pillar1M, Pillar2M, Pillar3M, Pillar6M, Pillar1Y, Pillar2Y) {

  try {

      let row0 = ['Expiry (Code)','Expiry (Days)','10d Put', '25d Put', 'ATM', '25d Call', '10d Call'];

      var str = '<table class="tblvolsurf">'

      //Header
      str = str + '<tr>'
      for (var i = 0; i < row0.length; i++) {
          str = str + '<th>'
          str = str + row0[i]
          str = str + '</th>'
      }
      str = str + '</tr>'
      

      //row0
      str = str + '<tr>'
      str = str + '<td>'
      str = str + '1D'
      str = str + '</td>'
      for (var i = 0; i < Pillar1D.length; i++) {
          str = str + '<td>'
          str = str + Pillar1D[i];
          str = str + '</td>'
      }
      str = str + '</tr>'


      //row1
      str = str + '<tr>'
      str = str + '<td>'
      str = str + '1W'
      str = str + '</td>'
      for (var i = 0; i < Pillar1W.length; i++) {
          str = str + '<td>'
          str = str + Pillar1W[i];
          str = str + '</td>'
      }
      str = str + '</tr>'


      //row2
      str = str + '<tr>'
      str = str + '<td>'
      str = str + '2W'
      str = str + '</td>'
      for (var i = 0; i < Pillar2W.length; i++) {
          str = str + '<td>'
          str = str + Pillar2W[i];
          str = str + '</td>'
      }
      str = str + '</tr>'
      
      
          //row3
          str = str + '<tr>'
          str = str + '<td>'
          str = str + '1M'
          str = str + '</td>'
          for (var i = 0; i < Pillar1M.length; i++) {
              str = str + '<td>'
              str = str + Pillar1M[i];
              str = str + '</td>'
          }
          str = str + '</tr>'

      //row3
      str = str + '<tr>'
      str = str + '<td>'
      str = str + '2M'
      str = str + '</td>'
      for (var i = 0; i < Pillar2M.length; i++) {
          str = str + '<td>'
          str = str + Pillar2M[i];
          str = str + '</td>'
      }
      str = str + '</tr>'


      //row4
      str = str + '<tr>'
      str = str + '<td>'
      str = str + '3M'
      str = str + '</td>'
      for (var i = 0; i < Pillar3M.length; i++) {
          str = str + '<td>'
          str = str + Pillar3M[i];
          str = str + '</td>'
      }
      str = str + '</tr>'


      //row5
      str = str + '<tr>'
      str = str + '<td>'
      str = str + '6M'
      str = str + '</td>'
      for (var i = 0; i < Pillar6M.length; i++) {
          str = str + '<td>'
          str = str + Pillar6M[i];
          str = str + '</td>'
      }
      str = str + '</tr>'


      //row6
      str = str + '<tr>'
      str = str + '<td>'
      str = str + '1Y'
      str = str + '</td>'
      for (var i = 0; i < Pillar1Y.length; i++) {
          str = str + '<td>'
          str = str + Pillar1Y[i];
          str = str + '</td>'
      }
      str = str + '</tr>'

          //row7
          str = str + '<tr>'
          str = str + '<td>'
          str = str + '2Y'
          str = str + '</td>'
          for (var i = 0; i < Pillar2Y.length; i++) {
              str = str + '<td>'
              str = str + Pillar2Y[i];
              str = str + '</td>'
          }
          str = str + '</tr>'
      


      str = str + '</table>'

      $('#volSurfacetbl').html(str);

  } catch (er) {

      console.log(er.message);
  }

}//VolSurf 3D Chart END

function setMarketPopUpPositionFXD() {
  try {

    let screenW = window.innerWidth;
    let screenH = window.innerHeight;
    let setTop = screenH / 3;
    let setLeft = screenW / 4;
    $(".marketDataPopUpFXD").css({
      top: setTop - 200 + "px",
      left: setLeft + "px"
    });

  } catch (error) {
    console.log(error.message);
  }
}

function closeMarketDatapopup() {
  try {
    $(".marketDataPopUpFXD").slideUp(500).fadeOut(200, function() {
      removeOverlayEQC();
    });
  } catch (error) {
    console.log(error.message);
  }
}

function PlotGreeksGrid(priceObj) {
  try {

    let finalpriceObj = [];

    // for(k=0;k<priceObj.length;k++){
    //   if(priceObj[k].premium !== 0){
    //     finalpriceObj.push(priceObj[k]);
    //   }
    // }

    finalpriceObj = priceObj;

    // Reference to the table
    let counterpartyTable = $('#counterpartyTable');
    
    // Clear the table first
    counterpartyTable.empty();

    headerRow = $('<tr>');
    headerRow.append($('<th>').text('Metrics')); // New header for metrics

    for (let i = 0; i < finalpriceObj.length; i++) {
      headerRow.append($('<th class="greekHeader">').text(finalpriceObj[i].provider)); // Use counterparty names as headers
    }
    counterpartyTable.append(headerRow);

    // const metrics = ['Delta(ÃŽâ€)', 'Gamma(ÃŽâ€œ)', 'Theta(ÃŽÂ¸)', 'Vega(v)'];
    const metrics = ['Delta', 'Gamma', 'Theta', 'Vega'];

    for (let i = 0; i < metrics.length; i++) {
      let row = $('<tr>');
      row.append($('<td title="' + metrics[i] +'" class="greekmetrics">').text(metrics[i])); // Metric name as the first column

      for (let j = 0; j < finalpriceObj.length; j++) {
        let metricValue = finalpriceObj[j][metrics[i].toLowerCase()]; // Get metric value
        if(metricValue !== 0){
          metricValue = metricValue.toFixed(2);
        }
        row.append($('<td title="' + metricValue +'" class="greekValues">').text(metricValue)); // Add metric value to the row
      }
      counterpartyTable.append(row);
    }
  } catch (error) {
    console.log(error.message);
  }
}

function GetSpotHistoryData(TileID, ccypair) {

  try {

      request_getDataFromAPI({
         
          "CcyPair": ccypair,
          "FromDate": "15-Jun-2023",//formattedT7Date,
          "ToDate": today.toShortFormat(),
          "CurrentTileID": TileID

      }, clientConfigdata.CommonMethods.NodeServer + "FXDMagnifier/GetSpotHistoryData").then(data => {

          let thisTileFX = document.getElementById("td" + data.CurrentTileID.split("|")[0]);

          if (data.dataFromAjax.GetSpotHistoryDataResult == '' || data.dataFromAjax.GetSpotHistoryDataResult == null) {
            $("#spotHistorySection").css("display", "none");
          }else{

             getSpotRatesData(TileId, ccypair);

             $("#spotHistorySection").css("display", "block");

              let _spotData = data.dataFromAjax.GetSpotHistoryDataResult;
              let _spotHeader =["Date","Bid Rate","Ask Rate", "Mid Rate"];
              let _spotAskRate = [];
              let _spotBidRate = [];
              let _spotMidRate = [];
              let _spotUpdatedAt = [];
  
            for(i=0;i<_spotData.length;i++){
  
              _spotAskRate.push(_spotData[i].SpotAskQuote);
              _spotBidRate.push(_spotData[i].SpotBidQuote);
              _spotMidRate.push(_spotData[i].SpotMidQuote);
              _spotUpdatedAt.push(_spotData[i].UpdatedAt);
  
            }
           PlotSpotHistoryGrid(_spotHeader,_spotAskRate,_spotBidRate,_spotMidRate,_spotUpdatedAt);
        }



      }).catch(error => { console.log(error); })

     // plot chart


  } catch (error) {
      console.log(error.message);
      $(".lblError").html(error.message)
  } finally {

  }

}

function PlotSpotHistoryGrid(headers, askRates, bidRates, midRates, updatedAt) {

  try{

    const tableContainer = $("#tableContainer");

    const table = $("<table>").addClass("spot-history-table");
  
    const headerRow = $("<tr>");
  
    headers.forEach(headerText => {
      const th = $("<th>").text(headerText);
      headerRow.append(th);
    });
  
    table.append(headerRow);
  
    for (let i = 0; i < askRates.length; i++) {
      const row = $("<tr>");

      const updatedAtCell = $("<td>").text(updatedAt[i]);
      row.append(updatedAtCell);
  
      const bidCell = $("<td>").text(bidRates[i]);
      row.append(bidCell);
  
      const askCell = $("<td>").text(askRates[i]);
      row.append(askCell);
  
      const midCell = $("<td>").text(midRates[i]);
      row.append(midCell);
   
      table.append(row);
    }
  
    tableContainer.empty().append(table);

  }catch(error){
    console.log(error.message);
  }

}

function PlotIRGrid(_headers,_tenorDays,_ccy1BidIR,_ccy1AskIR,_ccy2BidIR,_ccy2AskIR) {

  try{

    const IRRatesTbl = $("#IRRatesTbl");

    const table = $("<table>").addClass("IR-table");
  
    const headerRow = $("<tr>");
  
    _headers.forEach(headerText => {
      const th = $("<th>").text(headerText);
      headerRow.append(th);
    });
  
    table.append(headerRow);
  
    for (let i = 0; i < _tenorDays.length; i++) {
      const row = $("<tr>");
  
      const _tenor = $("<td>").text(_tenorDays[i]);
      row.append(_tenor);
  
      const _ccy1Bid = $("<td>").text(_ccy1BidIR[i]);
      row.append(_ccy1Bid);
  
      const _ccy1Ask = $("<td>").text(_ccy1AskIR[i]);
      row.append(_ccy1Ask);

      const _ccy2Bid = $("<td>").text(_ccy2BidIR[i]);
      row.append(_ccy2Bid);

      const _ccy2Ask = $("<td>").text(_ccy2AskIR[i]);
      row.append(_ccy2Ask);
   
      table.append(row);
    }
  
    IRRatesTbl.empty().append(table);

  }catch(error){
    console.log(error.message);
  }

}

function PlotSwapPointsGrid(_swappointHeaders,_swappointTenorDays,_swappointMid,_swappointBid,_swappointAsk,_swappointccy) {

  try{

    const SwapPointsTbl = $("#SwapPointsTbl");

    const table = $("<table>").addClass("SwapPoint-table");
  
    const headerRow = $("<tr>");
  
    _swappointHeaders.forEach(headerText => {
      const th = $("<th>").text(headerText);
      headerRow.append(th);
    });
  
    table.append(headerRow);
  
    for (let i = 0; i < _swappointTenorDays.length; i++) {
      const row = $("<tr>");
  
      const _tenor = $("<td>").text(_swappointTenorDays[i]);
      row.append(_tenor);
  
      const _Bid = $("<td>").text(_swappointBid[i]);
      row.append(_Bid);
  
      const _Ask = $("<td>").text(_swappointAsk[i]);
      row.append(_Ask);

      const _Mid= $("<td>").text(_swappointMid[i]);
      row.append(_Mid);

      const _ccy = $("<td>").text(_swappointccy[i]);
      row.append(_ccy);
   
      table.append(row);
    }
  
    SwapPointsTbl.empty().append(table);

  }catch(error){
    console.log(error.message);
  }

}

//----------------------------------------------END------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//




// Chaitanya M  || Intercept Call | Hash Token generation for Instant Pricer || 20 Oct 2023
//----------------------------------------------START----------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//


function gethash(body,url,method){
  try{

      let ciphertext = "";
      let hKey = 'C1PFxPgKepndcdBCqU6yYODCDlSw0W2v';

      if (method === 'GET') {
          ciphertext = CryptoJS.HmacSHA256(
          url,
          hKey
        ).toString();
      } else if (method === 'POST') {
        const hashSeed = url + (typeof body !== typeof ''
          ? JSON.stringify(body)
          : body);
          ciphertext = CryptoJS.HmacSHA256(hashSeed,hKey).toString().toUpperCase();
      }
    
      return ciphertext;

  }catch(error){
    console.log(error.message)
  }
}

 
//----------------------------------------------END------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------//

// Instant pricer: contract summary loading stuck on extended tab | Chaitanya M | 31-May-2024
function bestpriceclosepopup(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTile = document.getElementById("td" + TileId);

    $(thisTile).find('[id^="msg"]').html("");
    $(thisTile).find('[id^="booktradeFX"]').hide(); //LGTGTWINT-2129 | Chaitanya M | 13 June 2023
    //$(thisTile).find('[id^="OverlayDiv"]').hide();
    $(thisTile).find('[id^="notify"]').css("display", "none");
  } catch (error) {
    console.log(error.message);
  }
}