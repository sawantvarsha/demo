import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { MultiRequestService } from 'src/app/services/multi-request.service';
import Helper from '../../helpers/helpers';
import { BarrierModel } from '../../models/barrier-model';

@Component({
  selector: 'app-fxbarrier-multi-request',
  templateUrl: './fxbarrier-multi-request.component.html',
  styleUrls: ['./fxbarrier-multi-request.component.scss', '../../multirequest.component.scss']
})
export class FXBarrierMultiRequestComponent implements OnInit {

  title = 'FXMultipricerSH';
  direction = "horizontal";
  arrBarrier: BarrierModel[] = [];
  currencyPairs: string[] = [];
  tenors: string[] = [];
  optionCuts: string[] = [];
  productDetails: string[] = [];
  priceProviders: string[] = [];
  allProviders: string = "";
  productId: string = "";
  templateCode: string = "";
  templateName: string = "";
  templateId: string = "";
  productCode: string = "";
  productName: string = "";
  isHorizontal: boolean;
  tradeDate: string = "";

  constructor(private multiRequestApi: MultiRequestService, public commonfunctionApi: CommonApiService, private helper: Helper, public authApi: AuthService, public homeApi: HomeApiService) {
    this.isHorizontal = true;
  }

  ngOnInit(): void {

    if (this.arrBarrier.length === 0) {
      this.addRow();
    }
    this.getProductDetails();
  }

  defaultAPICalls() {
    this.getCurrencyPairs();
    this.getOptionCut();
    this.getTenor();
    this.getBuisnessDate();
    this.getBidAsk();
    this.getPriceProviderDetail();
  }

  addRow() {
    let data = new BarrierModel();
    this.arrBarrier.push(data);
    let index = this.arrBarrier.length - 1;
    this.getDates(index);
    this.getBidAsk(index);
    this.changeProductType(index);
    this.formatAmount(index, 'nominal');
  }

  transpose() {
    this.direction = this.direction === 'horizontal' ? 'vertical' : 'horizontal';
  }

  removeRow(index: number) {
    // let rowindex = 1;
    console.log("index", index);
    if (this.arrBarrier.length > 1) {
      this.arrBarrier.splice(index, 1);
    }
  }

  cloneRow(index: number) {
    let data = new BarrierModel();
    data = JSON.parse(JSON.stringify(this.arrBarrier[index]));
    this.arrBarrier.push(data);
    console.log(data);
    this.reset(this.arrBarrier.length -1 ); 
  }

  getProductDetails() {
    const productCode = "FXBarrier";
    this.multiRequestApi.getProductDetails(productCode)
      .subscribe((res) => {
        this.productDetails = res.GetProdDetailsResult[0];
        this.productId = res.GetProdDetailsResult[0].Product_Id;
        this.templateCode = res.GetProdDetailsResult[0].Template_Code;
        this.templateName = res.GetProdDetailsResult[0].Template_Name;
        this.templateId = res.GetProdDetailsResult[0].Template_Id;
        this.productCode = res.GetProdDetailsResult[0].product_code;
        this.productName = res.GetProdDetailsResult[0].Product_Name
        //console.log(this.productDetails,this.productId,this.templateCode,this.templateName, this.templateId, this.product_Code);
        this.defaultAPICalls();
      });
  }

  getCurrencyPairs() {
    this.multiRequestApi.getCurrencyPairs(this.authApi.EntityID, this.productId, this.productName, 'FXOSEN', 'TOK')
      .subscribe((res) => {
        this.currencyPairs = res.Get_Ccy_PairsResult.map((c: any) => c.Asset_Pair).sort((a, b) => { return a < b ? -1 : a > b ? 1 : 0 });
      });
  }

  getOptionCut(index = 0) {
    const ccy = this.arrBarrier[index].ccyPair
    this.multiRequestApi.getOptionCut(this.authApi.EntityID, this.productId, this.productName, 'FXOSEN', ccy, this.homeApi.CustomerId)
      .subscribe((res) => {
        this.optionCuts = res.Get_OptionCutResult.map((o: any) => o.OptionCut);
      })
  }

  getTenor() {
    this.multiRequestApi.getTenor(this.authApi.EntityID, this.productId, this.productName, 'FXOSEN', 'T')
      .subscribe((res) => {
        this.tenors = res.Get_Entity_Member_Map_DataResult.map((t: any) => t.Member_ID);
      });
  }

  getBidAsk(index = 0) {
    const ccy = this.arrBarrier[index].ccyPair;
    this.multiRequestApi.getBidAsk(this.authApi.UserName, 'Barrier', ccy)
      .subscribe((res) => {
        const data = res.Get_FinIQ_BidAsk_WrapperResult;
        const decimal = data.DecimalRate;
        this.arrBarrier[index].bidRate = parseFloat(data.BidRate).toFixed(decimal);
        this.arrBarrier[index].askRate = parseFloat(data.AskRate).toFixed(decimal);
        this.arrBarrier[index].decimalShift = data.DecimalRate;
        this.changeStrikeRate(index);
      })
  }

  getDates(index = 0) {
    const ccy = this.arrBarrier[index].ccyPair.split(' - ');
    const tenor = this.arrBarrier[index].tenor;
    const optionCut = this.arrBarrier[index].optionCut || 'TOK'
    this.multiRequestApi.getDatesCalculation(this.authApi.EntityID, this.productId, this.productName, this.tradeDate, ccy[0], ccy[1], '00', tenor, optionCut)
      .subscribe((res) => {
        const dates = res.Get_FinIQ_CalculateDatesWrapperResult[0]
        this.arrBarrier[index].tenorDays = dates.ExpiryDays;
        // this.arrBarrier[index].tradeDate = dates.SpotDate;
        this.arrBarrier[index].tradeDate = this.tradeDate;
        this.arrBarrier[index].premDate = dates.ValueDate;
        this.arrBarrier[index].finalFixingDate = dates.FixingDate;
        this.arrBarrier[index].FinalSettDate = dates.MaturityDate;
      });
  }

  getPriceProviderDetail() {
    this.multiRequestApi.getPriceProviderDetails(this.authApi.EntityID, this.productId, this.productCode)
      .subscribe((res) => {
        const providers: string[] = res.GetPriceProviderDetailsFAIOResult.map((p: any) => p.PP_Code);
        this.allProviders = providers.join(':');
        this.priceProviders.push("Best Price", ...providers);
      });
  }
  getBuisnessDate() {
    this.multiRequestApi.getBuisnessDateVB(this.authApi.EntityID).subscribe((res) => {
      const buisnessDate: string = res.GetBusinessDateResult.BusinessDate;
      this.tradeDate = buisnessDate;
      this.getDates();
      console.log(buisnessDate);
      });
  }

  // change events
  changeTenor(index = 0) {
    this.getDates(index);
  }

  changeCurrency(index = 0) {
    const pair = this.arrBarrier[index].ccyPair.split(' - ');
    this.arrBarrier[index].notionalCcy = pair[0];
    this.arrBarrier[index].ibCcy = pair[0];
    this.getOptionCut(index);
    this.getDates(index);
    this.getBidAsk(index);
  }

  changeStrikeRate(index = 0) {
    const pointShift = parseFloat(this.arrBarrier[index].decimalShift);
    const optionType = this.arrBarrier[index].optionType;
    console.log(index, this.arrBarrier[index].strikepoints);
    if (optionType == "Call") {
      this.arrBarrier[index].strikeRate = (parseFloat(this.arrBarrier[index].askRate) + (parseFloat(this.arrBarrier[index].strikepoints) / Math.pow(10, pointShift))).toFixed(pointShift).toString();
    } else {
      this.arrBarrier[index].strikeRate = (parseFloat(this.arrBarrier[index].bidRate) - (parseFloat(this.arrBarrier[index].strikepoints) / Math.pow(10, pointShift))).toFixed(pointShift).toString();
    }

    console.log(this.arrBarrier[index].strikeRate);
  }

  changeStrikePoint(index = 0) {
    const pointShift = parseFloat(this.arrBarrier[index].decimalShift);
    const optionType = this.arrBarrier[index].optionType;
    if (optionType == "Call") {
      this.arrBarrier[index].strikepoints = ((parseFloat(this.arrBarrier[index].strikeRate) - parseFloat(this.arrBarrier[index].askRate)) * Math.pow(10, pointShift)).toFixed(0).toString();
    } else {
      this.arrBarrier[index].strikepoints = ((parseFloat(this.arrBarrier[index].strikeRate) - parseFloat(this.arrBarrier[index].bidRate)) * Math.pow(10, pointShift)).toFixed(0).toString();
    }
    console.log("strike point", this.arrBarrier[index].strikepoints, ((parseFloat(this.arrBarrier[index].bidRate) - parseFloat(this.arrBarrier[index].strikeRate)) * Math.pow(10, pointShift)).toString());
  }

  changeProductType(index = 0) {
    const productType = this.arrBarrier[index].productType;
    if (["E-RKI+KO", "RKI+KO", "RKO+KI"].includes(productType)) {
      this.arrBarrier[index].enableLowerBarrier = true;
      this.arrBarrier[index].enableUpperBarrier = true;
    }

    if (["Knock-In", "Knock-Out"].includes(productType)) {
      this.arrBarrier[index].enableLowerBarrier = true;
      this.arrBarrier[index].enableUpperBarrier = false;
      this.arrBarrier[index].upperBarrier = '';
    }

    if (["Reverse Knock-In", "Reverse Knock-Out", "European Reverse Knock-In"].includes(productType)) {
      this.arrBarrier[index].enableLowerBarrier = false;
      this.arrBarrier[index].enableUpperBarrier = true;
      this.arrBarrier[index].lowerBarrier = '';
    }

    if (this.arrBarrier[index].optionType === 'Call') {
      switch (productType) {
        case 'Knock-In':
          this.arrBarrier[index].barrierType = 'DAI';
          break;
        case 'Knock-Out':
          this.arrBarrier[index].barrierType = 'DAO';
          break;
        case 'Reverse Knock-In':
          this.arrBarrier[index].barrierType = 'UAI';
          break;
        case 'Reverse Knock-Out':
          this.arrBarrier[index].barrierType = 'UAO';
          break;
        case 'RKI+KO':
          this.arrBarrier[index].barrierType = 'RKIKO';
          break;
        case 'RKO+KI':
          this.arrBarrier[index].barrierType = 'KIKO';
          break;
        case 'E-RKI+KO':
          this.arrBarrier[index].barrierType = 'RKIKO';
          break;
        case 'European Reverse Knock-In':
          this.arrBarrier[index].barrierType = 'UAI';
          break;
        default:
          this.arrBarrier[index].barrierType = "DAI";
          break;
      }
    } else {
      switch (productType) {
        case 'Knock-In':
          this.arrBarrier[index].barrierType = 'UAI';
          break;
        case 'Knock-Out':
          this.arrBarrier[index].barrierType = 'UAO';
          break;
        case 'Reverse Knock-In':
          this.arrBarrier[index].barrierType = 'DAI';
          break;
        case 'Reverse Knock-Out':
          this.arrBarrier[index].barrierType = 'DAO';
          break;
        case 'RKI+KO':
          this.arrBarrier[index].barrierType = 'RKIKO';
          break;
        case 'RKO+KI':
          this.arrBarrier[index].barrierType = 'KIKO';
          break;
        case 'E-RKI+KO':
          this.arrBarrier[index].barrierType = 'RKIKO';
          break;
        case 'European Reverse Knock-In':
          this.arrBarrier[index].barrierType = 'DAI';
          break;
        default:
          this.arrBarrier[index].barrierType = "DAI";
          break;
      }
    }
  }

  changeAmount(_index = 0) {
    // data[key] = this.helper.handleAmount(data[key], 1, data.decimalShift);
  }
  formatAmount(index = 0, key: string) {
    const data = this.arrBarrier[index];
    data[key] = this.helper.handleAmount(data[key], 1, key === 'nominal' ? '2' : data.decimalShift);
  }

  editAmount(index = 0, key: string) {
    const data = this.arrBarrier[index];
    data[key] = this.helper.amountEdit(data[key]);
  }

  priceAll() {
    for (let index = 0; index < this.arrBarrier.length; index++) {
      this.arrBarrier[index].price = '';
      this.arrBarrier[index].displayProvider = '';
      this.price(index);
    }
  }

  price(index = 0) {
    const data = this.arrBarrier[index];
    data.isLoading = true;
    data.price = '';
    data.displayProvider = '';
    const error = this.helper.validateParameters(
      data.nominal, data.upfront, data.strikeRate, data.bidRate, data.askRate,
      data.tradeDate, data.premDate, data.finalFixingDate, data.FinalSettDate,
      data.lowerBarrier, data.upperBarrier, data.enableLowerBarrier, data.enableUpperBarrier);
    data.error = error;
    if (error.length > 0) {
      return;
    }

    const firstCcy = data.ccyPair.split(' - ')[0];
    let altCcy = data.ccyPair.split(' - ')[1];
    const notional = Number(data.nominal.replace(/,/g, ''))
    let altNotional = 0;
    if (data.notionalCcy === firstCcy) {
      altNotional = notional * Number(data.strikeRate);
      altCcy = data.ccyPair.split(' - ')[1];
    } else {
      altNotional = notional / Number(data.strikeRate);
      altCcy = firstCcy;
    }
    const spotRate =
      (data.direction === 'Sell' && data.optionType === 'Call') ||
        (data.direction === 'Buy' && data.optionType === 'Put')
        ? data.bidRate : data.askRate;
    const customerId = this.homeApi.CustomerId;
    const customerName = this.authApi.UserName;

    const provider = data.provider === 'Best Price' ? this.allProviders : data.provider;

    const xml =
      `
        <ExcelSheets><Sheet1>
        <Product_Name>${this.productName}</Product_Name>
        <Spotrate>${spotRate}</Spotrate>
        <Hedging_x0020_Type>Dynamic</Hedging_x0020_Type>
        <CustID>${customerId}</CustID>
        <Customer_Name>${customerName}</Customer_Name>
        <Notional>${notional}</Notional>
        <OptionType>${data.optionType}</OptionType>
        <OptionCut>${data.optionCut}</OptionCut>
        <NonDeliveryYN>N</NonDeliveryYN>
        <CcyPair>${data.ccyPair}</CcyPair>
        <AltCcy>${altCcy}</AltCcy>
        <InvCcy>${data.notionalCcy}</InvCcy>
        <PremiumCcy>${data.ibCcy}</PremiumCcy>
        <CustPrem>0</CustPrem>
        <Tenor>${data.tenor}</Tenor>
        <PremiumDate>${data.premDate}</PremiumDate>
        <BuySell>${data.direction}</BuySell>
        <FixingDate>${data.finalFixingDate}</FixingDate>
        <SpreadAmt>${data.strikepoints}</SpreadAmt>
        <TradeDate>${data.tradeDate}</TradeDate>
        <SettDate>${data.FinalSettDate}</SettDate>
        <Strike>${data.strikeRate}</Strike>
        <LowerBarrier>${data.lowerBarrier ? '0' : data.lowerBarrier}</LowerBarrier>
        <UpperBarrier>${data.upperBarrier ? '0' : data.upperBarrier}</UpperBarrier>
        <EntityID>4</EntityID>
        <CAI_ID>1565</CAI_ID>
        <BarrierType>${data.barrierType}</BarrierType>
        <PricingModel>Black Scholes</PricingModel>
        <TemplateID>${this.templateId}</TemplateID>
        </Sheet1></ExcelSheets>
    `;

    this.multiRequestApi.getPrice(this.authApi.EntityID, this.productId, data.productType, data.ccyPair, firstCcy, altCcy, data.ibCcy, firstCcy, notional.toString(),
      altNotional.toString(), data.direction, data.optionType, data.strikeRate, data.lowerBarrier, data.upperBarrier, data.barrierType,
      data.tenor, 'EUROPEAN', 'EUROPEAN', data.optionCut, provider, 'PREMIUM', data.premDate, data.finalFixingDate, data.FinalSettDate,
      this.templateId, this.templateCode, '', '', '', '', '', 0, '', xml, data.upfront, this.authApi.UserName, 'Black Scholes')
      .subscribe((res) => {
        try {
          const prices = res.GetFXOPriceFromExternalProvidersJSONResult.oPriceResponseBody[0];
          const bestPrice = prices.bestPriceProvider.split(':');
          if (bestPrice[0] === 'FAIL') {
            data.error = "FAIL";
            data.isLoading = false;

          } else {
            data.displayProvider = bestPrice[0];
            data.isLoading = false;
            // data.price = parseFloat(bestPrice[1]).toFixed(4).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            data.price = this.helper.handleAmount(bestPrice[1], 0, data.decimalShift);
            data.ibPrem = parseFloat(prices.premiumAmount).toFixed(2);
            this.calcUpfrontAndIbPrem(index);
          }
        } catch (error) {
          // No prices receive
        }
      })
  }
  changeDirection(_i) {

  }
  reset(index) {
    const data = this.arrBarrier[index];
    data.ibPrem = '';
    data.clientPrem = '';
    data.price = '';
    data.displayProvider = '';
    data.error = '';
  }
  unformatNumber(value: any) {
    return value.toString().replace(/,/g, '');
  }
  calcUpfrontAndIbPrem(index = 0) {
    const data = this.arrBarrier[index];
    let clientPrem = 0;
    if (data.direction === "Buy") {
      clientPrem = parseFloat(data.ibPrem) + (this.unformatNumber(data.nominal) * (parseFloat(data.upfront) / 100));
    } else {
      clientPrem = Math.abs(parseFloat(data.ibPrem) - (this.unformatNumber(data.nominal) * (parseFloat(data.upfront) / 100)));
    }
    console.log((parseFloat(data.nominal) * (parseFloat(data.upfront) / 100)), (parseFloat(data.nominal)));
    data.clientPrem = this.helper.handleAmount(clientPrem.toString(), clientPrem, '2');
  }
}
