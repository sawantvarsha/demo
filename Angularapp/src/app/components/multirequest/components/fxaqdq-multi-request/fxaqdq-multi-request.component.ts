import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { MultiRequestService } from 'src/app/services/multi-request.service';
import Helper from '../../helpers/helpers';
import { AQDQModel } from '../../models/aqdq-model';

@Component({
  selector: 'app-fxaqdq-multi-request',
  templateUrl: './fxaqdq-multi-request.component.html',
  styleUrls: [
    './fxaqdq-multi-request.component.scss',
    '../../multirequest.component.scss',
  ],
})
export class FxaqdqMultiRequestComponent implements OnInit {
  title = 'FXMultipricerSH';
  direction = 'horizontal';
  arrAqDq: AQDQModel[] = [];

  PPName: string = '';
  BestPrice: any;
  currencyPairs: string[] = [];
  tenors: string[] = [];
  optionCuts: string[] = [];
  priceProviders: string[] = [];
  allProviders: string = '';
  productDetails: string[] = [];
  productId: string = '';
  templateCode: string = '';
  templateName: string = '';
  templateId: string = '';
  productCode: string = '';
  productName: string = '';
  ProdCode: string = 'FXAQ';
  isHorizontal: boolean;
  constructor(
    private multiRequestApi: MultiRequestService,
    private helper: Helper,
    private homeApi: HomeApiService,
    private authApi: AuthService
  ) {
    this.isHorizontal = true;
  }

  ngOnInit(): void {
    this.getProductDetails(this.ProdCode);
    if (this.arrAqDq.length === 0) {
      this.addRow();
    }

    console.log('date=', moment().format('DD-MMM-YYYY'));
  }

  defaultAPICalls() {
    this.getCurrencyPairs();
    this.getOptionCut();
    this.getTenor();
    this.getDates();
    this.getBidAsk();
    this.getPriceProviderDetail();
  }
  getProductDetails(productCode: string) {
    this.multiRequestApi.getProductDetails(productCode).subscribe((res) => {
      this.productDetails = res.GetProdDetailsResult[0];
      this.productId = res.GetProdDetailsResult[0].Product_Id;
      this.templateCode = res.GetProdDetailsResult[0].Template_Code;
      this.templateName = res.GetProdDetailsResult[0].Template_Name;
      this.templateId = res.GetProdDetailsResult[0].Template_Id;
      this.productCode = res.GetProdDetailsResult[0].product_code;
      this.productName = res.GetProdDetailsResult[0].Product_Name;
      console.log(
        this.productDetails,
        this.productId,
        this.templateCode,
        this.templateName,
        this.templateId
      );
      this.defaultAPICalls();
    });
  }
  addRow() {
    let data = new AQDQModel();
    this.arrAqDq.push(data);
    let index = this.arrAqDq.length - 1;
    //this.getProductDetails(this.productCode);
    this.getBidAsk(index);
    this.formatAmount(index, 'totalnotional');
    this.formatAmount(index, 'notionalperfix');
    this.formatAmount(index, 'ibpremnotional');
    if (this.productId) {
      this.getDates(index);
    }
    //this.changeNotional(index);
  }
  transpose() {
    this.direction =
      this.direction === 'horizontal' ? 'vertical' : 'horizontal';
  }
  removeRow(index: number) {
    // let rowindex = 1;
    console.log('index', index);
    if (this.arrAqDq.length > 1) {
      this.arrAqDq.splice(index, 1);
    }
  }

  priceAll() {
    for (let index = 0; index < this.arrAqDq.length; index++) {
      this.arrAqDq[index].price = '';
      this.arrAqDq[index].displayProvider = '';
      this.price(index);
    }
  }

  cloneRow(index: number) {
    let data = new AQDQModel();
    data = JSON.parse(JSON.stringify(this.arrAqDq[index]));
    this.arrAqDq.push(data);
    console.log(data);
  }
  getCurrencyPairs() {
    this.multiRequestApi
      .getCurrencyPairs(
        this.authApi.EntityID,
        this.productId,
        this.productCode,
        'FXOSEN',
        'TOK'
      )
      .subscribe((res) => {
        this.currencyPairs = res.Get_Ccy_PairsResult.map(
          (c: any) => c.Asset_Pair
        );
      });
  }
  getOptionCut(index = 0) {
    const ccy = this.arrAqDq[index].ccy;
    this.multiRequestApi
      .getOptionCut(
        this.authApi.EntityID,
        this.productId,
        this.productCode,
        'FXOSEN',
        ccy,
        '33308'
      )
      .subscribe((res) => {
        this.optionCuts = res.Get_OptionCutResult.map((o: any) => o.OptionCut);
      });
  }
  getTenor() {
    this.multiRequestApi
      .getTenor(
        this.authApi.EntityID,
        this.productId,
        this.productCode,
        'FXOSEN',
        'T'
      )
      .subscribe((res) => {
        this.tenors = res.Get_Entity_Member_Map_DataResult.map(
          (t: any) => t.Member_ID
        );
      });
  }
  getBidAsk(index = 0) {
    const ccy = this.arrAqDq[index].ccyPair;
    this.multiRequestApi
      .getBidAsk('Virat', this.productCode, ccy)
      .subscribe((res) => {
        const data = res.Get_FinIQ_BidAsk_WrapperResult;
        const decimal = data.DecimalRate;
        this.arrAqDq[index].bidRate = parseFloat(data.BidRate).toFixed(decimal);
        this.arrAqDq[index].askRate = parseFloat(data.AskRate).toFixed(decimal);
        this.arrAqDq[index].decimalShift = data.DecimalRate;
        this.arrAqDq[index].pointShift = data.PointShift;
        this.arrAqDq[index].pipsMultiplier = data.PipsMultiplier;
        this.calculateStrikeRate(index);
      });
  }
  getDates(index = 0) {
    const ccy = this.arrAqDq[index].ccyPair.split(' - ');
    const ccyPair = this.arrAqDq[index].ccyPair;
    const productType = this.arrAqDq[index].productType || 'AQ';
    const tenor = this.arrAqDq[index].tenor;
    const tenorDays = this.arrAqDq[index].tenorDays;
    const optionCut = this.arrAqDq[index].optionCut || 'TOK';
    const fixingFreq = this.arrAqDq[index].fixingFreq || 'Monthly';
    const settFreq = this.arrAqDq[index].settFreq || 'Monthly';
    const tradeDate = moment().format('DD-MMM-YYYY').toString();
    this.arrAqDq[index].tradeDate = tradeDate;
    this.multiRequestApi
      .getDatesFX(
        this.authApi.EntityID,
        ccy[0],
        ccy[1],
        ccyPair,
        'FX' + productType,
        tenorDays,
        tenor,
        tradeDate,
        this.productId,
        optionCut,
        fixingFreq,
        settFreq
      )
      .subscribe((res) => {
        const dates = res.Get_FinIQ_CalculateDatesWrapperResult[0];
        this.arrAqDq[index].tenorDays = dates.ExpiryDays;
        this.arrAqDq[index].premDate = dates.ValueDate;
        this.arrAqDq[index].finalFixingDate = dates.FixingDate;
        this.arrAqDq[index].FinalSettDate = dates.MaturityDate;
        console.log('res from getdates', res);
        this.getNoOfFixing(index);
      });
  }
  getPriceProviderDetail() {
    this.multiRequestApi
      .getPriceProviderDetails(
        this.authApi.EntityID,
        this.productId,
        this.productCode
      )
      .subscribe((res) => {
        const providers: string[] = res.GetPriceProviderDetailsFAIOResult.map(
          (p: any) => p.PP_Code
        );
        this.allProviders = providers.join(':');
        this.priceProviders.push('Best Price', ...providers);
        console.log(this.allProviders);
      });
  }
  getNoOfFixing(index = 0) {
    const ccy = this.arrAqDq[index].ccy.split(' - ');
    const ccyPair = this.arrAqDq[index].ccy;
    const optionCut = this.arrAqDq[index].optionCut || 'TOK';
    const fixingFreq = this.arrAqDq[index].fixingFreq || 'Monthly';
    const settFreq = this.arrAqDq[index].settFreq || 'Monthly';
    const tradeDate = this.arrAqDq[index].tradeDate;
    const premiumDate = this.arrAqDq[index].premDate;
    const finalFixingDate = this.arrAqDq[index].finalFixingDate;
    const FinalSettDate = this.arrAqDq[index].FinalSettDate;
    const notionalperfix = this.arrAqDq[index].notionalperfix;
    this.multiRequestApi
      .getNoOfFixings(
        '4',
        this.productId,
        ccyPair,
        '360',
        ccy[0],
        ccy[1],
        'SGD',
        'USD',
        optionCut,
        fixingFreq,
        settFreq,
        tradeDate,
        premiumDate,
        '',
        finalFixingDate,
        FinalSettDate,
        notionalperfix
      )
      .subscribe((res) => {
        console.log('in no of fixing', res);
        this.arrAqDq[index].firstFixingDate =
          res.GetNumberofFixingsResult.FirstFixingDate;
        this.arrAqDq[index].nooffixing =
          res.GetNumberofFixingsResult.NoofFixings;
        this.arrAqDq[index].totalnotional = this.helper.handleAmount(
          res.GetNumberofFixingsResult.TotalNotional,
          res.GetNumberofFixingsResult.TotalNotional,
          '2'
        );
      });
  }
  calculateStrikeRate(index = 0) {
    const productType = this.arrAqDq[index].productType;
    if (productType == 'AQ') {
      this.arrAqDq[index].strikeRate = this.arrAqDq[index].askRate;
    }
    if (productType == 'DQ') {
      this.arrAqDq[index].strikeRate = this.arrAqDq[index].bidRate;
    }
    this.calculateKORate(index);
    console.log(this.arrAqDq[index].strikeRate);
  }
  calculateKORate(index = 0) {
    const pipes = 200 / this.arrAqDq[index].pipsMultiplier;
    const decimalShift = parseInt(this.arrAqDq[index].decimalShift);
    if (this.arrAqDq[index].productType === 'AQ') {
      this.arrAqDq[index].korate = (
        parseFloat(this.arrAqDq[index].askRate) + pipes
      ).toFixed(decimalShift);
    } else if (this.arrAqDq[index].productType === 'DQ') {
      this.arrAqDq[index].korate = (
        parseFloat(this.arrAqDq[index].bidRate) - pipes
      ).toFixed(decimalShift);
    }
  }
  price(index = 0) {
    const data = this.arrAqDq[index];
    data.price = '';
    data.isLoading = true;
    data.displayProvider = '';
    const error = this.helper.validateParameters(
      data.nominal,
      data.upfront,
      data.strikeRate,
      data.bidRate,
      data.askRate,
      data.tradeDate,
      data.premDate,
      data.finalFixingDate,
      data.FinalSettDate,
      data.lowerBarrier,
      data.upperBarrier,
      data.enableLowerBarrier,
      data.enableUpperBarrier
    );
    data.error = error;
    if (error.length > 0) {
      return;
    }
    const firstCcy = data.ccyPair.split(' - ')[0];
    let altCcy = data.ccyPair.split(' - ')[1];
    const notional = Number(data.nominal.replace(/,/g, ''));
    let altNotional = 0;
    if (data.notionalCcy === firstCcy) {
      altNotional = notional * Number(data.strikeRate);
      altCcy = data.ccyPair.split(' - ')[1];
    } else {
      altNotional = notional / Number(data.strikeRate);
      altCcy = firstCcy;
    }
    console.log(altNotional);
    const customerId = this.homeApi.CustomerId;
    const customerName = this.authApi.UserName;
    const provider =
      data.provider === 'Best Price' ? this.allProviders : data.provider;

    const xml3 = `
    <ExcelSheets><Sheet1><Product_Name>FX${data.productType}</Product_Name><Hedging_x0020_Type>Dynamic</Hedging_x0020_Type><CustID>${customerId}</CustID>
    <Customer_Name>${customerName}</Customer_Name>
    <GuaranteedPeriods>${data.gauranteeperiod}</GuaranteedPeriods>
    <Spotrate>${data.strikeRate} </Spotrate>
    <OptionCut>${data.optionCut}</OptionCut>
    <KO>${data.korate}</KO>
    <NonDeliveryYN>N</NonDeliveryYN>
    <KIStyle>No</KIStyle>
    <FixingSettFreq>${data.settFreq}/${data.settFreq}</FixingSettFreq>
    <Currency1>${data.notionalCcy}</Currency1>
    <CcyPair>${data.ccyPair}</CcyPair>
    <PremiumCcy>${data.ibPremCcy}</PremiumCcy>
    <CustPrem>0</CustPrem>
    <PremiumDate>${data.premDate}</PremiumDate>
    <BuySell>${data.direction}</BuySell>
    <FixingDate>${data.finalFixingDate}</FixingDate>
    <LeverageFactor>${data.leverageFactor}</LeverageFactor>
    <Ccy1PerFixing>${data.notionalperfix}</Ccy1PerFixing>
    <SpreadAmt></SpreadAmt>
    <TradeDate>${data.tradeDate}</TradeDate>
    <SettDate>${data.FinalSettDate}</SettDate>
    <TenorDays>${data.tenorDays}</TenorDays>
    <Tenor>${data.tenor}</Tenor>
    <Strike>${data.strikeRate}</Strike>
    <KIBarrierType></KIBarrierType>
    <KIStyle></KIStyle>
    <PricingModel>Black Scholes</PricingModel>
    <CAI_ID>7400</CAI_ID>
    <EntityID>4</EntityID>
    <Notional>${data.totalnotional}</Notional>
    <NotionalType>Per Fixing</NotionalType>
    </Sheet1></ExcelSheets>
    `;
    /*
    this.AuthorAPI.EntityID,this.ProductID, this.ProductName, this.CurrencyPair, this.NotionalCcy, this.NotionalCcy === this.AltCcy ? this.DepCcy : this.AltCcy,
     this.IBPremCcy, this.IBPremCcy, this.NotionalAmt.replace(/,/g, ''),'' + Number(this.Strike) * Number(this.NotionalAmt.replace(/,/g, '')), this.OrderDirection, '',
      this.Strike, this.ProductType === 'aq' ? '0' : this.KORate, this.ProductType === 'aq' ? this.KORate : '0', '', '','', 'TOK', this.Tenor + '', this.Premiumdate, 
      this.FinalFixingDate, this.FinalSettDate, this.PriceProviderString, 'PREMIUM',this.TemplateCode, this.TemplateID, this.NotionalAmt.replace(/,/g, ''), '' + 
      this.Leverage, this.FixingSettFreq, this.GuaranteedPeriods, this.KORate, 0, '', this.XMLString,'0.0', this.UserID, this.SeletcedPricingModel */

    this.multiRequestApi
      .getPrice(
        this.authApi.EntityID,
        this.productId,
        'FX' + data.productType,
        data.ccyPair,
        data.notionalCcy,
        altCcy,
        data.ibPremCcy,
        data.ibPremCcy,
        data.totalnotional.toString(),
        (
          parseFloat(data.totalnotional) * parseFloat(data.strikeRate)
        ).toString(),
        data.direction,
        '',
        data.strikeRate,
        data.productType === 'AQ' ? '0' : data.korate,
        data.productType === 'AQ' ? data.korate : '0',
        '',
        data.tenor,
        '',
        '',
        data.optionCut,
        provider,
        'PREMIUM',
        data.premDate,
        data.finalFixingDate,
        data.FinalSettDate,
        this.templateId,
        this.templateCode,
        data.notionalperfix,
        data.leverageFactor,
        data.settFreq + '/' + data.settFreq,
        data.gauranteeperiod,
        data.korate,
        0,
        '',
        xml3,
        '0.0',
        'Virat',
        'Black Scholes'
      )
      .subscribe((res) => {
        try {
          const prices =
            res.GetFXOPriceFromExternalProvidersJSONResult
              .oPriceResponseBody[0];
          const bestPrice = prices.bestPriceProvider.split(':');
          data.displayProvider = bestPrice[0];
          data.price = this.helper.handleAmount(
            bestPrice[1],
            bestPrice[1],
            data.decimalShift
          );
          data.isLoading = false;
        } catch (error) {
          // No prices received
        }
      });
  }
  // change events
  changeTenor(index = 0) {
    this.getTenor();
    this.getDates(index);
  }

  changeCurrency(index = 0) {
    this.getOptionCut(index);
    this.getDates(index);
    this.getBidAsk(index);
  }
  changeNotionalCcy(index = 0) {
    const depccy = this.arrAqDq[index].ccyPair.split(' - ')[0];
    const altCcy = this.arrAqDq[index].ccyPair.split(' - ')[1];
    console.log('here', depccy, altCcy);
    if (this.arrAqDq[index].notionalCcy === depccy) {
      this.arrAqDq[index].notionalperfix = '10000';
    }
    if (this.arrAqDq[index].notionalCcy === altCcy) {
      this.arrAqDq[index].notionalperfix = (
        parseFloat(this.arrAqDq[index].notionalperfix) *
        parseFloat(this.arrAqDq[index].askRate)
      ).toString();
    }
  }
  changeProductType(index = 0) {
    const productType = this.arrAqDq[index].productType;
    this.getProductDetails('FX' + productType);
    if (this.arrAqDq[index].productType === 'AQ')
      this.arrAqDq[index].direction = 'Buy';
    else this.arrAqDq[index].direction = 'Sell';
    this.calculateStrikeRate(index);
  }
  formatAmount(index = 0, key: string) {
    const data = this.arrAqDq[index];
    data[key] = this.helper.handleAmount(
      data[key],
      1,
      key === 'nominal' ? '2' : data.decimalShift
    );
  }

  editAmount(index = 0, key: string) {
    const data = this.arrAqDq[index];
    data[key] = this.helper.amountEdit(data[key]);
  }
  changeStrike(index = 0) {
    this.calculateKORate(index);
  }
  changeFixingFrequency(index = 0) {
    this.arrAqDq[index].settFreq = this.arrAqDq[index].fixingFreq;
    this.getDates(index);
  }
}
