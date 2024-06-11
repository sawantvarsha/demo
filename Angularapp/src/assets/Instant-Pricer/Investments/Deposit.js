var dAmount;
var dTenor;
var tenorUnit;
var dmatDate;
var sourceAcNo;
var rePaymentAcNo;
var interestAmount;
var todaysDate;
var tempDPair;
var DepositMaturityAmount;
var DepositMaturiyDate;
var tenorUnit;
var DepositFreq;
var datediff;
var depositeAmt;
var dt1;
var dt2;
var displayDepositObj = {};
var bankccydata;
var entityName;
var tenorListDeposit = ["1W", "1M", "2M", "6M", "1Y"]; // Changed for USD 1D not available || 3Feb-2022
var idDEPOSIT = 12;
var interestRateDP;
var SelectedCurrency = "USD";

$(document).ready(function () {
  try {
  } catch (error) {
    console.log(error.message);
  }
});

// To load Deposit default functions and values
function depositOnLoad(currId) {
  try {
    setDeafaultValuesDeposit(currId);
    thisTileDeposit = document.getElementById("td" + currId);
    $(thisTileDeposit).find('[id^="loader_FIBond"]').hide();
    $(thisTileDeposit).find('[id^="tenorDeposit"]');
    fillDropdownlistControl(
      tenorListDeposit,
      $(thisTileDeposit).find('[id^="tenorDeposit"]').attr("id")
    );
    document.querySelector(
      "#" + $(thisTileDeposit).find('[id^="tenorDeposit"]').attr("id")
    ).selectedIndex = 3;
    todaysDate = new Date().toShortFormat();
    getMatdate(thisTileDeposit);

    $(thisTileDeposit)
      .find('[id^="tenorDeposit"]')
      .on("change", function () {
        getMatdate($(this).parents(".sorting"));
      });

    if ($(thisTileDeposit).find('[id^="CCYDeposit"]')[0].value == "") {
      request_getDataFromAPI(
        {},
        clientConfigdata.CommonMethods.NodeServer + "getLocalCcy"
      )
        .then((data) => {
          DepositCcyArray = [];
          var indexDP = 0;

          //New Api link contains CurrencyMnemonic (Unique sorted by CurrencyMnemonic) || Tina K || 18-Nov-2019
          let unique = [...new Set(data.map((item) => item.CurrencyMnemonic))];
          unique.sort();

          $(unique).each(function (i, n) {
            if (n != "NZD" && n != "HKD") {
              // NZD has no interest rate available in Database
              var ddl = document.getElementById(
                $(thisTileDeposit).find('[id^="CCYDeposit"]').attr("id")
              );
              var option = document.createElement("option");
              option.text = n;
              option.value = n;
              ddl.add(option);
              $(ddl)[0].selectedIndex = 11;
            }
          });
          getSoftMaturityDays(thisTileDeposit);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    $("[id^=CCYDeposit]").change(function () {
      thisTileDeposit = $(this).parents(".sorting");
      $(thisTileDeposit).find('[id^="tenorDeposit"]').empty();
      SelectedCurrency = $(thisTileDeposit).find('[id^="CCYDeposit"]')[0].value;
      request_getDataFromAPI(
        {
          Currency: SelectedCurrency,
          EntityName: "GLOBAL",
        },
        clientConfigdata.CommonMethods.NodeServer + "getTenorbyCurrency"
      )
        .then((data) => {
          //New Api link contains CurrencyMnemonic (Unique sorted by CurrencyMnemonic) || Tina K || 18-Nov-2019
          // let unique = [...new Set(data.map(item => item.Soft_Maturity))];
          // unique.sort();
          data.GetTenorbyCurrencyResult.sort();
          $(data.GetTenorbyCurrencyResult).each(function (i, n) {
            console.log(n.Soft_Maturity + ":" + n.MoneyYield);
            if (n.MoneyYield != "0") {
              var ddl = document.getElementById(
                $(thisTileDeposit).find('[id^="tenorDeposit"]').attr("id")
              );
              var option = document.createElement("option");
              option.text = n.Soft_Maturity;
              option.value = n.Soft_Maturity;
              ddl.add(option);
            }
          });
          getMatdate($(this).parents(".sorting"));
          //$(thisTileDeposit).find('[id^="tenorDeposit"]').selectedIndex = 3;
        })
        .catch((error) => {
          console.log(error);
        });
    });
  } catch (err) {
    console.log(err.message);
  }
}
var depoDays = "";

function getSoftMaturityDays(thisTileDeposit) {
  try {
    request_getDataFromAPI(
      {
        DepoCcy: $(thisTileDeposit).find('[id^="CCYDeposit"]').val().trim(),
        AltCcy: "",
        TradeDate: new Date().toShortFormat(),
        Tenor: "0",
        DR_Settlement_Days: "2",
        CR_Settlement_Days: "2",
        CheckHomeLocalCcyHoliday: "N",
        IsRollOverMode: "N",
        RollOver_ValueDate: "",
        iEntityID: 4,
        Tenor_Code: $(thisTileDeposit)
          .find('[id^="tenorDeposit"]')
          .val()
          .trim(),
        Prem_Settlement_Days: "2",
        iProductId: 1,
        I_ProductCode: "fxoption",
        I_Mode: "FXOSEN",
        optioncut: "TOK",
      },
      clientConfigdata.CommonMethods.NodeServer + "maturityDate"
    ).then((data) => {
      depoDays = data.data.Get_FinIQ_CalculateDatesWrapperResult[0].ExpiryDays;
    });
  } catch (error) {
    console.log(error.message);
  }
}
// To set default values of parameters
function setDeafaultValuesDeposit(currId) {
  try {
    thisTileDeposit = document.getElementById("td" + currId);
    fillDropdownlistControl(
      tenorListDeposit,
      $(thisTileDeposit).find('[id^="tenorDeposit"]').attr("id")
    );
    document.querySelector(
      "#" + $(thisTileDeposit).find('[id^="tenorDeposit"]').attr("id")
    ).selectedIndex = 3;
    $(thisTileDeposit).find('[id^="deposit_ContractAmt"]').val("1,000,000.00");
    $(thisTileDeposit).find('[id^="CCYDeposit"]').val("USD");
  } catch (error) {
    console.log(error.message);
  }
}

//------------------- Deposit Amount -----------------//

// To get deposit value
function getDeposit(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileDeposit = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );

    if (
      $(thisTileDeposit).find('[id^="interestRateValue"]')[0].innerHTML ==
        "-" ||
      $(thisTileDeposit).find('[id^="interestRateValue"]')[0].innerHTML == ""
    ) {
      // $("#OrderPlaced").html("Please Price Again Before Book Trade, Order Execution Failed!");
      // $("#booktradecashx").dialog("open");
      // $("#booktradecashx").show();
      // $('#DivOverlay').show();
      booktradePopup(
        that,
        "booktradedeposit" + TileId,
        "Please Best Price Before Book Trade, Order Execution Failed!",
        "DivOverlaydeposit"
      );
      return false;
    }

    if (
      $.trim($(thisTileDeposit).find('[id^="deposit_ContractAmt"]').val()) == ""
    ) {
      ValidateField(
        $(thisTileDeposit).find('[id^="deposit_ContractAmt"]').attr("id")
      );
      return false;
    }
    var depositObj = {};
    DepositFreq = $(thisTileDeposit).find('[id^="DepositFreq"]').val();

    //calculate maturity Amount
    DepositMaturityInstruction = $(thisTileDeposit)
      .find('[id^="DepositMaturityInstruction"]')
      .val();

    var depositReqObj = {
      xmlExcel:
        `<ExcelSheets><Cash_Adjustment><int_rate_fixed>${$(thisTileDeposit)
          .find('[id^="interestRateValue"]')
          .html()
          .trim()}</int_rate_fixed>` +
        `<HEDGING_TYPE>Dynamic</HEDGING_TYPE><InterestPayFrequency>${$(
          thisTileDeposit
        )
          .find('[id^="DepositFreq"]')
          .val()
          .trim()}</InterestPayFrequency>` +
        `<Tenor>${$(thisTileDeposit)
          .find('[id^="tenorDeposit"]')
          .val()
          .trim()}</Tenor><InterestType>Compound Interest</InterestType><dDefaultRT>Fixed</dDefaultRT>` +
        `<DepositAmt>${$(thisTileDeposit)
          .find('[id^="deposit_ContractAmt"]')
          .val()
          .replace(
            /\,/g,
            ""
          )}</DepositAmt><Trade_Date>${new Date().toShortFormat()}</Trade_Date>` +
        `<Maturity_Date>${$(thisTileDeposit)
          .find('[id^="depositMaturity"]')
          .html()
          .trim()}</Maturity_Date><Customer>DAIMOND| 32490</Customer>` +
        `<Currency>${$(thisTileDeposit)
          .find('[id^="CCYDeposit"]')
          .val()}</Currency><Portfolio>0302202001-S-SMF-1</Portfolio><CIF>0302202001</CIF><FDType>Short term</FDType>` +
        `</Cash_Adjustment></ExcelSheets>`,
      userId: "Omkar7",
      templateCode: "fixed_deposit",
      CurrentTileID: TileId,
    };
    //     // "depositAmount": parseInt($(thisTileDeposit).find('[id^="deposit_ContractAmt"]').val().replace(/\,/g, "")),
    // "tenor": parseInt(tenorDValue.substring(0, tenorDValue.length - 1)),
    // "tenorUnit": $(thisTileDeposit).find('[id^="depositMaturity"]').val(),
    // "tradeDate": new Date().toShortFormat(),
    // "maturityDate": $(thisTileDeposit).find('[id^="depositMaturity"]').html(),
    // "interestRate": $(thisTileDeposit).find('[id^="interestRateValue"]').html(),
    // "maturityAmount": $(thisTileDeposit).find('[id^="hdnDepoMatAmt"]').val(),
    // "interestAmount": 324,
    // "intPaymentFreq": $(thisTileDeposit).find('[id^="DepositFreq"]').val(),
    // "maturityInstructions": $(thisTileDeposit).find('[id^="DepositMaturityInstruction"]').val(),
    // "depositType": "Short term",
    // "cif": "110157",
    // "sourceAcNo": "0313168150001234",
    // "rePaymentAcNo": "0113017980200045",
    //     "UserID": "Dealer1",
    //     "Product": "EQC",
    //     "Event": "L1",
    //     "Template": "Fixed_Deposit",
    //     "EntityId": 4,
    //     "EntityName": "PB",
    //     "dataXML": "<dtDataFromXML><int_rate_fixed>" + $(thisTileDeposit).find('[id^="interestRateValue"]').html() +
    //         "</int_rate_fixed><HEDGING_TYPE>Dynamic</HEDGING_TYPE><InterestPayFrequency>" + $(thisTileDeposit).find('[id^="DepositFreq"]').val() +
    //         "</InterestPayFrequency><Tenor>" + $(thisTileDeposit).find('[id^="tenorDeposit"]').val() +
    //         "</Tenor><InterestType></InterestType><dDefaultRT>Fixed</dDefaultRT><DepositAmt>" + $(thisTileDeposit).find('[id^="deposit_ContractAmt"]').val().replace(/\,/g, "") +
    //         "</DepositAmt><Trade_Date>" + new Date().toShortFormat() +
    //         "</Trade_Date><Maturity_Date>" + $(thisTileDeposit).find('[id^="depositMaturity"]').html() +
    //         "</Maturity_Date><Customer_ID>DIAMOND|32490</Customer_ID><Customer>DIAMOND|32490</Customer><Currency>" + $(thisTileDeposit).find('[id^="CCYDeposit"]').val() +
    //         "</Currency><Portfolio>0302202001-S-SMF-1</Portfolio><FDType>Cumulative</FDType></dtDataFromXML>",
    //     "CurrentTileID": TileId,
    // };

    depositObj = request_getDataFromAPI(
      depositReqObj,
      clientConfigdata.CommonMethods.NodeServer + "getDeposit"
    )
      .then((depositObj) => {
        TileId = depositObj.CurrentTileID;
        if (
          depositObj.SaveUCPResult[0].DealNo == "" ||
          depositObj.SaveUCPResult[0].DealNo == null ||
          depositObj.SaveUCPResult[0].DealNo == undefined
        ) {
          booktradePopup(
            that,
            "booktradedeposit" + TileId,
            depositObj.SaveUCPResult[0].WarningMessage,
            "DivOverlaydeposit"
          );
        } else {
          var orderplacedDeposit =
            "Deposits : Order Placed Successfully with Order ID " +
            depositObj.SaveUCPResult[0].NoteMasterID;
          $(thisTileDeposit)
            .find('[id^="hdnBlotterURLdeposit"]')
            .val(clientConfigdata.CommonMethods.getBlotterURLCashFX);
          $(thisTileDeposit)
            .find('[id^="OrderBlotter"]')
            .css({ display: "inline" });
          booktradePopup(
            that,
            "booktradedeposit" + TileId,
            orderplacedDeposit,
            "DivOverlaydeposit"
          );
        }

        displaydepositorder(thisTileDeposit);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (er) {
  } finally {
  }
}
//--------------------------------- END ---------------------------------//

//------------------- Calculate Maturity Date by Tenor -----------------//
// To calculate Maturity Date by Tenor
function getMatdate(thisTileDeposit) {
  try {
    tenorDValue = $(thisTileDeposit).find('[id^="tenorDeposit"]').val();
    var dt1 = new Date();
    var dt2 = new Date();

    switch (tenorDValue.substring(1, tenorDValue.length)) {
      case "D":
        dt2.setDate(
          dt2.getDate() +
            parseInt(tenorDValue.substring(0, tenorDValue.length - 1))
        );
        DepositTenorDays = Math.floor(
          (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
            Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
            (1000 * 60 * 60 * 24)
        );
        tenorUnit = "Day";
        break;

      case "W":
        dt2.setDate(
          dt2.getDate() +
            parseInt(tenorDValue.substring(0, tenorDValue.length - 1)) * 7
        );
        DepositTenorDays = Math.floor(
          (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
            Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
            (1000 * 60 * 60 * 24)
        );
        tenorUnit = "Week";
        break;

      case "M":
        dt2.setMonth(
          dt2.getMonth() +
            parseInt(tenorDValue.substring(0, tenorDValue.length - 1))
        );
        DepositTenorDays = Math.floor(
          (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
            Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
            (1000 * 60 * 60 * 24)
        );
        tenorUnit = "Month";
        break;

      case "Y":
        dt2.setFullYear(
          dt2.getFullYear() +
            parseInt(tenorDValue.substring(0, tenorDValue.length - 1))
        );
        DepositTenorDays = Math.floor(
          (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
            Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
            (1000 * 60 * 60 * 24)
        );
        tenorUnit = "Year";
        break;
    }

    DepositMaturiyDate = dt2.toShortFormat();
    $(thisTileDeposit).find('[id^="depositMaturity"]').val(tenorUnit);
    $(thisTileDeposit).find('[id^="depositMaturity"]').html(DepositMaturiyDate);
  } catch (error) {
    console.log(error.message);
  }
}
//--------------------------------- END ---------------------------------//
// To calculate deposit maturity amount
function maturityAmount(that) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTileDeposit = document.getElementById("td" + TileId);
    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );
    // Added code for changing css class for glowing on/off - by Onkar E. 21/11/2019 //
    var priceClass = "GlowPrice_Red";
    if (!glowFlag) {
      priceClass = "noGlow";
    }
    if (typeof cntrl != "undefined") {
      idDEPOSIT = cntrl;
    }
    validation_clear(); //To Remove highlighted part if no error || Tina K || 18-Sep-2019
    //  clearPricerTable(thisTileDeposit); //To clear prices after clicking best price || Tina K || 20-Nov-2019

    //Validation conditions added || Tina Kshirsagar || 6-09-2019
    if (
      $.trim($(thisTileDeposit).find('[id^="deposit_ContractAmt"]').val()) ==
        "" ||
      parseFloat(
        $(thisTileDeposit).find('[id^="deposit_ContractAmt"]').val()
      ) == 0
    ) {
      ValidateField(
        $(thisTileDeposit).find('[id^="deposit_ContractAmt"]').attr("id"),
        "Please Enter Valid Deposit Amount",
        thisTileDeposit
      );
      return false;
    } //Validation End
    depositeAmt = parseInt(
      $(thisTileDeposit)
        .find('[id^="deposit_ContractAmt"]')
        .val()
        .replace(/\,/g, "")
    );
    todaysDate1 = new Date().toShortFormat();
    dt1 = new Date(todaysDate1);
    dt2 = new Date($(thisTileDeposit).find('[id^="depositMaturity"]').html());
    //difference between two Dates
    datediff = Math.floor(
      (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
        (1000 * 60 * 60 * 24)
    );
    DepositMaturityAmount =
      (parseInt(
        $(thisTileDeposit)
          .find('[id^="deposit_ContractAmt"]')
          .val()
          .replace(/\,/g, "")
      ) *
        0.01 *
        2.42 *
        datediff) /
        360 +
      depositeAmt;

    $(thisTileDeposit).find('[id^="hdnDepoMatAmt"]').val(DepositMaturityAmount);
    $(thisTileDeposit).find('[id^="interestRateValue"]').addClass(priceClass);
    getInterestRate(thisTileDeposit);
  } catch (error) {
    console.log(error.message);
  }
}

// To get interest rate
function getInterestRate(thisTileDeposit) {
  try {
    if (depoDays != "") {
      bankccydata = request_getDataFromAPI(
        {
          Currency: $(thisTileDeposit).find('[id^="CCYDeposit"]').val(),
          SoftMaturity: depoDays,
          EntityName: "GLOBAL",
        },
        clientConfigdata.CommonMethods.NodeServer + "getInterestRate"
      ).then((bankccydata) => {
        // $(thisTileDeposit).find('[id^="interestRatename"]').html("Interest Rate");

        // if (bankccydata.GetBankFDRateResult.length == 0 || bankccydata.GetBankFDRateResult[0].MoneyYield == 0) {
        //     var IR = "Deposit :: Interest Rate not Available";
        //     $("#OrderPlaced").html(IR);
        //     $("#booktradecashx").dialog("open");
        //     $("#booktradecashx").show();
        //     $('#DivOverlay').show();
        //     $("#interestRate").html('-');
        // } else {

        //     $(thisTileDeposit).find('[id^="interestRateValue"]').html(bankccydata.GetBankFDRateResult[0].MoneyYield);
        //     interestRateDP = bankccydata.GetBankFDRateResult[0].MoneyYield;

        //     depositCurrency = $(thisTileDeposit).find('[id^="CCYDeposit"]').val();
        //     drawgraphDeposit($(thisTileDeposit).find('[id^="canvas"]').attr('id'));
        console.log(
          "Updated IR :: ",
          Number(bankccydata.GetBoardRateResult).toFixed(2)
        );

        $(thisTileDeposit)
          .find('[id^="interestRatename"]')
          .html("")
          .html("Interest Rate");
        $(thisTileDeposit)
          .find('[id^="interestRateValue"]')
          .html("")
          .html(Number(bankccydata.GetBoardRateResult).toFixed(2));

        console.log(bankccydata);
      });
    } else {
      getSoftMaturityDays(thisTileDeposit);
      getInterestRate(thisTileDeposit);
    }
  } catch (error) {
    console.log(error.message);
  }
}

//----------------------Display Order History----------------------//
// To display deposit order history
function displaydepositorder(thisTileDeposit) {
  try {
    displayDepositObj = request_getDataFromAPI(
      { product: "CADB" },
      "http://finiqmbappnsk2683.cloudapp.net/FAIOServer/depositsAPI/orderHistory"
    ).then((displayDepositObj) => {
      $(thisTileDeposit)
        .find('[id^="depositOrderDetails"]')
        .find("table tr:not(:first-child)")
        .empty();
      for (var i = 0; i < 10; i++) {
        if (displayDepositObj.data[i].DE_Order_ID == undefined) {
          displayDepositObj.data[i].DE_Order_ID = "-";
        }
        if (displayDepositObj.data[i].DE_INT_Payment_Freq == undefined) {
          displayDepositObj.data[i].DE_INT_Payment_Freq = "-";
        }
        if (displayDepositObj.data[i].DE_Maturity_Amount == undefined) {
          displayDepositObj.data[i].DE_Maturity_Amount = "-";
        }
        if (displayDepositObj.data[i].DE_Maturity_Date == undefined) {
          displayDepositObj.data[i].DE_Maturity_Date = "-";
        }
        var markup =
          "<tr> <td>" +
          displayDepositObj.data[i].DE_Order_ID +
          "</td> <td>" +
          displayDepositObj.data[i].DE_INT_Payment_Freq +
          "</td> <td>" +
          displayDepositObj.data[i].DE_Maturity_Amount +
          "</td> <td>" +
          displayDepositObj.data[i].DE_Maturity_Date.substr(0, 10) +
          "</td> </tr>";
        $(thisTileDeposit)
          .find('[id^="depositOrderDetails"]')
          .find("table")
          .append(markup);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}
