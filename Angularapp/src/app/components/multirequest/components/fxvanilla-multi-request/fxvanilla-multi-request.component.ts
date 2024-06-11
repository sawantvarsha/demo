import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { MultiRequestService } from 'src/app/services/multi-request.service';
import Helper from '../../helpers/helpers';
import { VanillaModel } from '../../models/vanilla-model';

@Component({
  selector: 'app-fxvanilla-multi-request',
  templateUrl: './fxvanilla-multi-request.component.html',
  styleUrls: ['./fxvanilla-multi-request.component.scss', '../../multirequest.component.scss']
})
export class FXVanillaMultiRequestComponent implements OnInit {
  arr = [1, 2, 3, 3, 3, 3, 3, 3, 3, 3]
  direction = "horizontal"
  arrVanilla: VanillaModel[] = [];

  PPName: string = "";
  BestPrice: any;
  currencyPairs: string[] = [];
  priceProviders: string[] = [];
  tenors: string[] = [];
  optionCuts: string[] = [];
  productDetails: string[] = [];
  productId: string = "";
  templateCode: string = "";
  templateName: string = "";
  templateId: string = "";
  productCode: string = "";
  productName: string = "";
  allProviders: string = "";
  isHorizontal: boolean;
  tradeDate: string = "";

  constructor(private multiRequestApi: MultiRequestService, public helper: Helper, public homeApi: HomeApiService, public authApi: AuthService) {
    this.isHorizontal = true;
  }

  ngOnInit(): void {
    if (this.arrVanilla.length === 0) {
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
    // this.changeProductType();
    this.getPriceProviderDetail();
  }

  addRow() {
    let data = new VanillaModel();
    this.arrVanilla.push(data);
    let index = this.arrVanilla.length - 1;
    this.getDates(index);
    this.getBidAsk(index);
    //this.changeProductType(index);
    this.formatAmount(index, 'nominal');
  }

  transpose() {
    this.direction = this.direction === 'horizontal' ? 'vertical' : 'horizontal';
  }

  removeRow(index: number) {
    // let rowindex = 1;
    console.log("index", index);
    if (this.arrVanilla.length > 1) {
      this.arrVanilla.splice(index, 1);
    }
  }



  getPriceProviderDetail() {
    this.multiRequestApi.getPriceProviderDetails(this.authApi.EntityID, this.productId, this.productCode)
      .subscribe((res) => {
        const providers: string[] = res.GetPriceProviderDetailsFAIOResult.map((p: any) => p.PP_Code);
        this.allProviders = providers.join(':');
        this.priceProviders.push("Best Price", ...providers);
      });
  }

  getProductDetails() {
    const productCode = "FXOption";
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

  cloneRow(index: number) {
    let data = new VanillaModel();
    data = JSON.parse(JSON.stringify(this.arrVanilla[index]));
    this.arrVanilla.push(data);
    console.log(data);
    this.reset(this.arrVanilla.length -1 ); 
  }

  getCurrencyPairs() {
    this.multiRequestApi.getCurrencyPairs(this.authApi.EntityID, this.productId, this.productCode, 'FXOSEN', 'TOK')
      .subscribe((res) => {
        this.currencyPairs = res.Get_Ccy_PairsResult.map((c: any) => c.Asset_Pair).sort((a, b) => { return a < b ? -1 : a > b ? 1 : 0 });
      });
  }

  getCcyPointShift(_index = 0) {

  }

  getOptionCut(index = 0) {
    const ccy = this.arrVanilla[index].ccyPair
    this.multiRequestApi.getOptionCut(this.authApi.EntityID, this.productId, this.productCode, 'FXOSEN', ccy, '33308')
      .subscribe((res) => {
        this.optionCuts = res.Get_OptionCutResult.map((o: any) => o.OptionCut);
      })
  }

  getTenor() {
    this.multiRequestApi.getTenor(this.authApi.EntityID, this.productId, this.productCode, 'FXOSEN', 'T')
      .subscribe((res) => {
        this.tenors = res.Get_Entity_Member_Map_DataResult.map((t: any) => t.Member_ID);
      });
  }

  getBidAsk(index = 0) {
    const ccy = this.arrVanilla[index].ccyPair;
    this.multiRequestApi.getBidAsk(this.authApi.UserName, this.productCode, ccy)
      .subscribe((res) => {
        const data = res.Get_FinIQ_BidAsk_WrapperResult;
        const decimal = data.DecimalRate;
        this.arrVanilla[index].bidRate = parseFloat(data.BidRate).toFixed(decimal);
        this.arrVanilla[index].askRate = parseFloat(data.AskRate).toFixed(decimal);
        this.arrVanilla[index].decimalShift = data.DecimalRate;
        this.changeStrikeRate(index);
      })
  }

  getBuisnessDate() {
    this.multiRequestApi.getBuisnessDateVB(this.authApi.EntityID).subscribe((res) => {
      const buisnessDate: string = res.GetBusinessDateResult.BusinessDate;
      this.tradeDate = buisnessDate;
      this.getDates();
      console.log(buisnessDate);
    });
  }
  getDates(index = 0) {
    const ccy = this.arrVanilla[index].ccyPair.split(' - ');
    const tenor = this.arrVanilla[index].tenor;
    const optionCut = this.arrVanilla[index].optionCut || 'TOK'
    this.multiRequestApi.getDatesCalculation(this.authApi.EntityID, this.productId, this.productCode, this.tradeDate, ccy[0], ccy[1], '00', tenor, optionCut)
      .subscribe((res) => {
        const dates = res.Get_FinIQ_CalculateDatesWrapperResult[0]
        this.arrVanilla[index].tenorDays = dates.ExpiryDays;
        // this.arrVanilla[index].tradeDate = dates.SpotDate;
        this.arrVanilla[index].tradeDate = this.tradeDate;
        this.arrVanilla[index].premDate = dates.ValueDate;
        this.arrVanilla[index].finalFixingDate = dates.FixingDate;
        this.arrVanilla[index].FinalSettDate = dates.MaturityDate;
      });
  }

  // change events
  changeTenor(index = 0) {
    this.getDates(index);
  }

  changeCurrency(index = 0) {
    this.getOptionCut(index);
    this.getDates(index);
    this.getBidAsk(index);
  }

  changeStrikeRate(index = 0) {
    const pointShift = parseFloat(this.arrVanilla[index].decimalShift);
    const optionType = this.arrVanilla[index].optionType;
    console.log(index, this.arrVanilla[index].strikepoints);
    if (optionType == "Call") {
      this.arrVanilla[index].strikeRate = (parseFloat(this.arrVanilla[index].askRate) + (parseFloat(this.arrVanilla[index].strikepoints) / Math.pow(10, pointShift))).toFixed(pointShift).toString();
    } else {
      this.arrVanilla[index].strikeRate = (parseFloat(this.arrVanilla[index].bidRate) - (parseFloat(this.arrVanilla[index].strikepoints) / Math.pow(10, pointShift))).toFixed(pointShift).toString();
    }

    console.log(this.arrVanilla[index].strikeRate);
  }

  changeStrikePoint(index = 0) {
    const pointShift = parseFloat(this.arrVanilla[index].decimalShift);
    const optionType = this.arrVanilla[index].optionType;
    if (optionType == "Call") {
      this.arrVanilla[index].strikepoints = ((parseFloat(this.arrVanilla[index].strikeRate) - parseFloat(this.arrVanilla[index].askRate)) * Math.pow(10, pointShift)).toFixed(0).toString();
    } else {
      this.arrVanilla[index].strikepoints = ((parseFloat(this.arrVanilla[index].strikeRate) - parseFloat(this.arrVanilla[index].bidRate)) * Math.pow(10, pointShift)).toFixed(0).toString();
    }
    console.log("strike point", this.arrVanilla[index].strikepoints, ((parseFloat(this.arrVanilla[index].bidRate) - parseFloat(this.arrVanilla[index].strikeRate)) * Math.pow(10, pointShift)).toString());
  }


  changeAmount(_index = 0, _key: string) {
  }
  formatAmount(index = 0, key: string) {
    const data = this.arrVanilla[index];
    data[key] = this.helper.handleAmount(data[key], 1, key === 'nominal' ? '2' : data.decimalShift);
  }
  editNotional(index = 0) {
    const data = this.arrVanilla[index];
    data.nominal = this.helper.amountEdit(data.nominal);
  }

  priceAll() {
    for (let index = 0; index < this.arrVanilla.length; index++) {
      this.arrVanilla[index].price = '';
      this.arrVanilla[index].displayProvider = '';
      this.price(index);
    }
  }

  price(index = 0) {
    const data = this.arrVanilla[index];
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
        <PremiumCcy>${data.ibPremCcy}</PremiumCcy>
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

    this.multiRequestApi.getPrice(this.authApi.EntityID, this.productId, data.productType, data.ccyPair, firstCcy, altCcy, data.ibPremCcy, firstCcy, notional.toString(),
      altNotional.toString(), data.direction, data.optionType, data.strikeRate, data.lowerBarrier, data.upperBarrier, data.barrierType,
      data.tenor, '', '', data.optionCut, provider, 'PREMIUM', data.premDate, data.finalFixingDate, data.FinalSettDate,
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
            data.price = parseFloat(bestPrice[1]).toFixed(4);
            data.ibPrem = parseFloat(prices.premiumAmount).toFixed(2);
            this.calcUpfrontAndIbPrem(index);
          }
        } catch (error) {
          // No prices received
        }
      })
  }

  unformatNumber(value: any) {
    return value.toString().replace(/,/g, '');
  }

  calcUpfrontAndIbPrem(index = 0) {
    const data = this.arrVanilla[index];
    let clientPrem = 0;
    if (data.direction === "Buy") {
      clientPrem = parseFloat(data.ibPrem) + (this.unformatNumber(data.nominal) * (parseFloat(data.upfront) / 100));

    } else {
      clientPrem = Math.abs(parseFloat(data.ibPrem) - (this.unformatNumber(data.nominal) * (parseFloat(data.upfront) / 100)));
    }
    console.log((parseFloat(data.nominal) * (parseFloat(data.upfront) / 100)), (parseFloat(data.nominal)));
    data.clientPrem = this.helper.handleAmount(clientPrem.toString(), clientPrem, '2');
  }

  reset(index) {
    const data = this.arrVanilla[index];
    data.ibPrem = '';
    data.clientPrem = '';
    data.price = '';
    data.displayProvider = '';
    data.error = '';
  }
}
