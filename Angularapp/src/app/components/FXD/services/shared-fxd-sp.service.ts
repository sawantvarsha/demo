import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedFxdSpService {
  constructor() { }

  // Added By Urmila A | RFQ Log details table headers
  getRFQLogMonitorTableHeaders(): any {
    var LogMonitorHeader = [
      {
        tableheader: [        
          {
            key: 'Trade Date',
            value: 'TradeDate',
            type: 'date',
            align: 'center',
          },
          //Added by Urmila A  27-Mar-23 | LGTGTWINT-1743
          
          {
            key: 'RFQ ID',
            value: 'DCDRFQID',
            type: 'text',
            align: 'center',
          },
          //added by Urmila A, 13-April-23 | LGTGTWINT-1873 | start
          {
            key: 'Executed RFQ',
            value: 'Executed_RFQ',
            type: 'text',
            align: 'center',
          },
           //added by Urmila A, 13-April-23 | LGTGTWINT-1873 | end
          {
            key: 'RFQ Details',
            value: 'InternalRFQID',
            type: 'btn',
            align: 'center',
          },
          {
            key: 'FXO RFQ ID',
            value: 'InternalRFQID',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Quote Request ID',
            value: 'QuoteRequestID',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Order Status',
            value: 'OrderStatus',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Provider',
            value: 'Provider',
            type: 'text',
            align: 'left',  //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
          },
          {
            key: 'Product',
            value: 'ProductName',
            type: 'text',
            align: 'left',  //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
          },
          {
            key: 'User ID',  //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
            value: 'Userid',
            type: 'text',
            align: 'left',
          },
          {
            key: 'Option Cut',
            value: 'OptionCut',
            type: 'text',
            align: 'left', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Underlying',
            value: 'Underlying',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Notional Ccy',
            value: 'DepositCcy',  //Added by UrmilaA, 21-April-23 | LGTGTWINT-1905
            type: 'text',
            align: 'center',
          },
          {
            key: 'Notional',
            value: 'Notional',
            type: 'number',
            align: 'right',   //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
          },
          {
            key: 'Strike',
            value: 'StrikeRate',
            type: 'text',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Upper Barrier',
            value: 'UpperBarrier',
            type: 'text',
            align: 'right',
          },
          {
            key: 'Lower Barrier',
            value: 'LowerBarrier',
            type: 'text',
            align: 'right',
          },
          {
            key: 'Premium Ccy',
            value: 'PremiumCcy',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Premium Pct',
            value: 'Premium',
            type: 'text',
            align: 'right',
          },
          {
            key: 'Premium Amt',
            value: 'PremiumAmount',
            type: 'number', //Urmila A | LGTGTWINT-1465 | 21-feb-23
            align: 'right',  //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
          },
          {
            key: 'Spot',
            value: 'SpotRate',
            type: 'text',
            align: 'right',
          },
          {
            key: 'Premium Date',
            value: 'ValueDate',
            type: 'date',
            align: 'center',
          },
          {
            key: 'Fixing Date',
            value: 'FixingDate',
            type: 'date',
            align: 'center',
          },
          {
            key: 'Settlement Date',
            value: 'MaturityDate', //TradeDate , mapping changed by UrmilaA | 31-May-23 | LGTGTWINT-2064
            type: 'date',
            align: 'center',
          },
          {
            key: 'Quote Request Sent At',
            value: 'QuoteRequestAt',
            type: 'datetime',
            align: 'center',
          },
          {
            key: 'Quote Ack At',
            value: 'QuoteAckAt',
            type: 'datetime',
            align: 'center',
          },
          {
            key: 'Quote Response At',
            value: 'QuoteResponseAt',
            type: 'datetime',
            align: 'center',
          },
          {
            key: 'Order Request Sent At',
            value: 'OrderRequestedAt',
            type: 'datetime',
            align: 'center',
          },
          {
            key: 'Order Response At',
            value: 'OrderResponseAt',
            type: 'datetime',
            align: 'center',
          },
          {
            key: 'External Quote ID',
            value: 'ExternalQuoteID',
            type: 'text',
            align: 'left',
          },
          {
            key: 'Counterparty Remark',
            value: 'QuoteRemark',
            type: 'text',
            align: 'left',
          },
          {
            key: 'Order Rejection Reason',
            value: 'OrderRejectionReason',
            type: 'text',
            align: 'left',
          },
        ],
      },
    ];
    return LogMonitorHeader;
  }

  // Added By Urmila A | RFQ Log pop-up leg details table headers
  getRFQQuoteLegWiseDataHeaders(): any {
    var LegDataHeader = [
      {
        shortViewTableHeader: [
          {
            key: 'Leg ID',
            value: 'LegId',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Schedule ID',
            value: 'ScheduleId',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Product',
            value: 'Product',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Client Direction',
            value: 'ClientDirection',
            type: 'text',
            align: 'left', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Option Type',
            value: 'OptionType',
            type: 'text',
            align: 'left', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Underlying',
            value: 'Underlying',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Notional',
            value: 'Notional',
            type: 'number',
            align: 'right', //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
          },
          {
            key: 'Notional Ccy',
            value: 'NotionalCcy',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Strike',
            value: 'Strike',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Lower Barrier',
            value: 'LowerBarrier',
            type: 'number',
            align: 'right',
          },
          {
            key: 'Upper Barrier',
            value: 'UpperBarrier',
            type: 'number',
            align: 'right',
          },
          {
            key: 'Knock-In Style',
            value: 'KnockInStyle',
            type: 'text',
            align: 'left',
          },
          {
            key: 'Knock-Out Style',
            value: 'KnockOutStyle',
            type: 'text',
            align: 'left',
          },
          {
            key: 'Spot',
            value: 'Spot',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Premium Pct',
            value: 'PremiumPct',
            type: 'number',
            align: 'right',
          },
          {
            key: 'Premium Amt',
            value: 'PremiumAmt',
            type: 'number',
            align: 'right',
          },
          {
            key: 'Client Premium Direction',
            value: 'ClientPremiumDirection',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Fixing Date',
            value: 'FixingDate',
            type: 'date',
            align: 'center',
          },
          {
            key: 'Maturity Date',
            value: 'MaturityDate',
            type: 'date',
            align: 'center',
          },
        ],
        longViewTableHeader: [
          {
            key: 'Leg ID',
            value: 'LegId',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Schedule ID',
            value: 'ScheduleId',
            type: 'number',
            align: 'center', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Product',
            value: 'Product',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Client Direction',
            value: 'ClientDirection',
            type: 'text',
            align: 'left', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Option Type',
            value: 'OptionType',
            type: 'text',
            align: 'left', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Underlying',
            value: 'Underlying',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Notional',
            value: 'Notional',
            type: 'number',
            align: 'right', //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
          },
          {
            key: 'Notional Ccy',
            value: 'NotionalCcy',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Strike',
            value: 'Strike',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Lower Barrier',
            value: 'LowerBarrier',
            type: 'number',
            align: 'right',
          },
          {
            key: 'Upper Barrier',
            value: 'UpperBarrier',
            type: 'number',
            align: 'right',
          },
          {
            key: 'Knock-In Style',
            value: 'KnockInStyle',
            type: 'text',
            align: 'left',
          },
          {
            key: 'Knock-Out Style',
            value: 'KnockOutStyle',
            type: 'text',
            align: 'left',
          },
          {
            key: 'Non Deliverable YN',
            value: 'NonDeliverableYN',
            type: 'text',
            align: 'center', //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
          },
          {
            key: 'Settlement Ccy',
            value: 'SettlementCcy',
            type: 'text',
            align: 'center', //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
          },
          {
            key: 'Internal Order ID',
            value: 'InternalOrderID',
            type: 'text',
            align: 'center',
          },
          {
            key: 'External Order ID',
            value: 'ExternalOrderID',
            type: 'text',
            align: 'center',
          },
          {
            key: 'External Execution ID',
            value: 'ExternalExecutionID',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Option Cut',
            value: 'OptionCut',
            type: 'text',
            align: 'left',
          },
          {
            key: 'Trade Date',
            value: 'TradeDate',
            type: 'date',
            align: 'center',
          },
          {
            key: 'Premium Date',
            value: 'PremiumDate',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Fixing Date',
            value: 'FixingDate',
            type: 'date',
            align: 'center',
          },
          {
            key: 'Maturity Date',
            value: 'MaturityDate',
            type: 'date',
            align: 'center',
          },
          {
            key: 'Spot',
            value: 'Spot',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Bid Spot',
            value: 'BidSpot',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Offer Spot',
            value: 'OfferSpot',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Bid Forward Points',
            value: 'BidForwardPoints',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Offer Forward Points',
            value: 'OfferForwardPoints',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Bid Volatility',
            value: 'BidVolatility',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Offer Volatility',
            value: 'OfferVolatility',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'IR 1',
            value: 'IR1',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'IR 2',
            value: 'IR2',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Premium Pct',
            value: 'PremiumPct',
            type: 'number',
            align: 'right',
          },
          {
            key: 'Premium Amt',
            value: 'PremiumAmt',
            type: 'number',
            align: 'right',
          },
          {
            key: 'Hedge Amount',
            value: 'HedgeAmount',
            type: 'number',
            align: 'right', //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
          },
          {
            key: 'Hedge Ccy',
            value: 'HedgeCcy',
            type: 'text',
            align: 'center',
          },
          {
            key: 'Hedge Rate',
            value: 'HedgeRate',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Bid Premium Amt',
            value: 'BidPremiumAmt',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Offer Premium Amt',
            value: 'OfferPremiumAmt',
            type: 'number',
            align: 'right', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'Client Premium Direction',
            value: 'ClientPremiumDirection',
            type: 'text',
            align: 'left', //HSBCFXEINT-105 || By Gargi ||17-05-24
          },
          {
            key: 'External Quote ID',
            value: 'ExternalQuoteID',
            type: 'text',
            align: 'left', //Added by ChaitanyaM on 2-Apr-24 :Code Sync with Five Star
          },
        ],
      },
    ];
    return LegDataHeader;
  }

  // Added by Urmila A | 26-Dec-22 | Export commn function
  ExportData(TableData, TableHeaders) {
    let JSONData = [];
    for (let i = 0; i < TableData.length; i++) {
      let Obj = {};
      TableHeaders.forEach((headerEle, index) => {
        console.log(index, headerEle);
        let val = TableHeaders[index].value;
        Obj[val] = TableData[i][val];
      });
      JSONData.push(Obj);
    }
    return JSONData;
  }

  // Added by Urmila A | 3-Feb-23 | handling buttons visibilities across FXD products | start
  fnHandleBtnVisibilities(Mode) {
    var ButtonControl = [
      {

        SinglePricer: [
          {
            Dealer: [
              {
                AQ: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                ],

                DQ: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                ],

                TRFBuy: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                ],

                TRFSell: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                ],

                Pivot: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: 'SinglePricer',
                  },
                ]
              }
            ],
            RM: [
              {
                AQ: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                DQ: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                TRFBuy: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                TRFSell: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                Pivot: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ]
              }
            ],
            IA: [
              {
                AQ: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'savetradeidea',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                DQ: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'savetradeidea',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                TRFBuy: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'savetradeidea',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                TRFSell: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'savetradeidea',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                Pivot: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'savetradeidea',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ]
              }
            ],
            FXA: [
              {
                AQ: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                DQ: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                TRFBuy: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                TRFSell: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                Pivot: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ]
              }
            ],
          }
        ],
        RedirectedDeals: [
          {
            Dealer: [],
            RM: [],
            IA: [


              {
                AQ: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    isVisibletoExecuted: false,
                    isVisibletoSolve: true,
                    isVisibletoTrade: true,
                    isVisibletoNewRM: true,
                    isVisibletoRejected: true,
                    isVisibletoExpired: true,
                    isEnabletoExecuted: false,
                    isEnabletoSolve: true,
                    isEnabletoTrade: true,
                    isEnabletoNewRM: true,
                    isEnabletoRejected: true,
                    isEnabletoExpired: true,
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'savetradeidea',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                DQ: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'savetradeidea',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                TRFBuy: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'savetradeidea',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                TRFSell: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'savetradeidea',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ],

                Pivot: [
                  {
                    key: 'spread',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'emailquote',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'viewschedule',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'reset',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'routetodealer',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'savetradeidea',
                    isVisible: true,
                    isEnabled: true,
                    Mode: '',
                  },
                  {
                    key: 'order',
                    isVisible: false,
                    isEnabled: false,
                    Mode: '',
                  },
                ]
              }
            ],
            FXA: [],
          }
        ],


      },
    ];

    if (Mode === 'SinglePricer') {
      return ButtonControl[0].SinglePricer
    } else if (Mode === 'RedirectedDeals') {
      return ButtonControl[0].RedirectedDeals
    }
  }
  // Added by Urmila A | 3-Feb-23 | handling buttons visibilities across FXD products | end


  // Added by Urmila A | 15-feb-23 | btn visibility SP for FXD products | start
  FXDGetPricerLayoutConfigurationDetails(prodcode, usertype, isRediredted) {
    console.log('Layout SP:',prodcode,usertype)
    var GetPricerLayoutConfigurationDetailsResult = [
      {
        SinglePricer: [
          {
            key: 'AQDQ',
            usertype: 'dealer',
            VisibleBtn: "spread, emailquote, viewschedule, reset",
            enablebtn: "spread, emailquote, viewschedule, reset",
          },
          {
            key: 'TRF',
            usertype: 'dealer',
            VisibleBtn: "spread, emailquote, viewschedule, reset",
            enablebtn: "spread, emailquote, viewschedule, reset",
          },
          {
            key: 'Pivot',
            usertype: 'dealer',
            VisibleBtn: "spread, emailquote, viewschedule, reset",
            enablebtn: "spread, emailquote, viewschedule, reset",
          },
          {
            key: 'AQDQ',
            usertype: 'RM',
            VisibleBtn: "spread, emailquote, viewschedule, reset, routetodealer",
            enablebtn: "spread, emailquote, viewschedule, reset, routetodealer",
          },
          {
            key: 'TRF',
            usertype: 'RM',
            VisibleBtn: "spread, emailquote, viewschedule, reset, routetodealer",
            enablebtn: "spread, emailquote, viewschedule, reset, routetodealer",
          },
          {
            key: 'Pivot',
            usertype: 'RM',
            VisibleBtn: "spread, emailquote, viewschedule, reset, routetodealer",
            enablebtn: "spread, emailquote, viewschedule, reset, routetodealer",
          },
          {
            key: 'AQDQ',
            usertype: 'IA',
            VisibleBtn: "spread, emailquote, viewschedule, reset, savetradeidea, routetodealer",
            enablebtn: "spread, emailquote, viewschedule, reset, savetradeidea, routetodealer",
          },
          {
            key: 'TRF',
            usertype: 'IA',
            VisibleBtn: "spread, emailquote, viewschedule, reset,savetradeidea, routetodealer",
            enablebtn: "spread, emailquote, viewschedule, reset,savetradeidea, routetodealer",
          },
          {
            key: 'Pivot',
            usertype: 'IA',
            VisibleBtn: "spread, emailquote, viewschedule, reset, savetradeidea, routetodealer",
            enablebtn: "spread, emailquote, viewschedule, reset, savetradeidea,routetodealer",
          },
          {
            key: 'AQDQ',
            usertype: 'FXA',
            VisibleBtn: "spread, emailquote, viewschedule, reset, savetradeidea",
            enablebtn: "spread, emailquote, viewschedule, reset, savetradeidea",
          },
          {
            key: 'TRF',
            usertype: 'FXA',
            VisibleBtn: "spread, emailquote, viewschedule, reset,savetradeidea",
            enablebtn: "spread, emailquote, viewschedule, reset,savetradeidea",
          },
          {
            key: 'Pivot',
            usertype: 'FXA',
            VisibleBtn: "spread, emailquote, viewschedule, reset,savetradeidea",
            enablebtn: "spread, emailquote, viewschedule, reset, savetradeidea",
          },


        ],
        Redirected: [
          {
            key: 'AQDQ',
            usertype:'dealer',
            fromNewOrderfromRM_unlocked: "spread, emailquote, viewschedule, reset, reject, remark, RMremark, originalIBprem, timer",
            fromNewOrderfromRM_locked: "spread, emailquote, viewschedule, reset, reject, remark, RMremark, originalIBprem",
            fromTradeIdea: "spread, emailquote, viewschedule, reset",
            fromExecuted: "emailquote, viewschedule, reset, Remark, RMremark",
            fromExpired: "",
            fromRejected: "emailquote, viewschedule, reset, Remark, RMremark",
            fromExpiredTradeIdea: "spread, emailquote, viewschedule, reset, Remark",
          },
          {
            key: 'TRF',
            usertype:'dealer',
            fromNewOrderfromRM_unlocked: "spread, emailquote, viewschedule, reset, reject, remark, RMremark, originalIBprem, timer",
            fromNewOrderfromRM_locked: "spread, emailquote, viewschedule, reset, reject, remark, RMremark, originalIBprem",
            fromTradeIdea: "spread, emailquote, viewschedule, reset",
            fromExecuted: "emailquote, viewschedule, reset, Remark, RMremark",
            fromExpired: "",
            fromRejected: "emailquote, viewschedule, reset, Remark, RMremark",
            fromExpiredTradeIdea: "spread, emailquote, viewschedule, reset, Remark",
          },
          {
            key: 'Pivot',
            usertype:'dealer',
            fromNewOrderfromRM_unlocked: "spread, emailquote, viewschedule, reset, reject, remark, RMremark, originalIBprem, timer",
            fromNewOrderfromRM_locked: "spread, emailquote, viewschedule, reset, reject, remark, RMremark, originalIBprem",
            fromTradeIdea: "spread, emailquote, viewschedule, reset",
            fromExecuted: "emailquote, viewschedule, reset, Remark, RMremark",
            fromExpired: "",
            fromRejected: "emailquote, viewschedule, reset, Remark, RMremark",
            fromExpiredTradeIdea: "spread, emailquote, viewschedule, reset, Remark",
          },
          {
            key: 'AQDQ',
            usertype:'RM',
            fromNewOrderfromRM_unlocked: "spread, emailquote, viewschedule, reset, routetodealer, remark, RMremark, originalIBprem, timer",
            fromNewOrderfromRM_locked: "spread, emailquote, viewschedule, reset, reject, remark, RMremark, originalIBprem",
            fromTradeIdea: "spread, emailquote, viewschedule, reset, routetodealer",
            fromExecuted: "emailquote, viewschedule, reset, routetodealer, Remark, RMremark",
            fromExpired: "",
            fromRejected: "emailquote, viewschedule, reset, routetodealer, Remark, RMremark",
            fromExpiredTradeIdea: "spread, emailquote, viewschedule, routetodealer ,reset, Remark",
          },
          {
            key: 'TRF',
            usertype:'RM',
            fromNewOrderfromRM_unlocked: "spread, emailquote, viewschedule, reset, routetodealer, remark, RMremark, originalIBprem, timer",
            fromNewOrderfromRM_locked: "spread, emailquote, viewschedule, reset, reject, remark, RMremark, originalIBprem",
            fromTradeIdea: "spread, emailquote, viewschedule, reset, routetodealer",
            fromExecuted: "emailquote, viewschedule, reset, routetodealer, Remark, RMremark",
            fromExpired: "",
            fromRejected: "emailquote, viewschedule, reset, routetodealer, Remark, RMremark",
            fromExpiredTradeIdea: "spread, emailquote, viewschedule, routetodealer ,reset, Remark",
          },
          {
            key: 'Pivot',
            usertype:'RM',
            fromNewOrderfromRM_unlocked: "spread, emailquote, viewschedule, reset, routetodealer, remark, RMremark, originalIBprem, timer",
            fromNewOrderfromRM_locked: "spread, emailquote, viewschedule, reset, reject, remark, RMremark, originalIBprem",
            fromTradeIdea: "spread, emailquote, viewschedule, reset, routetodealer",
            fromExecuted: "emailquote, viewschedule, reset, routetodealer, Remark, RMremark",
            fromExpired: "",
            fromRejected: "emailquote, viewschedule, reset, routetodealer, Remark, RMremark",
            fromExpiredTradeIdea: "spread, emailquote, viewschedule, routetodealer ,reset, Remark",
          },
          {
            key: 'AQDQ',
            usertype:'IA',
            fromNewOrderfromRM_unlocked: "spread, emailquote, viewschedule, reset, savetradeidea, routetodealer, remark, RMremark, originalIBprem",
            fromNewOrderfromRM_locked: " emailquote, viewschedule, reset, savetradeidea,routetodealer, reject, remark, RMremark, originalIBprem",
            fromTradeIdea: "spread, emailquote, viewschedule, reset, routetodealer",
            fromExecuted: "emailquote, viewschedule, reset, savetradeidea , routetodealer, Remark, RMremark",
            fromExpired: "",
            fromRejected: "emailquote, viewschedule, reset, routetodealer, Remark, RMremark",
            fromExpiredTradeIdea: "spread, emailquote, viewschedule, reset, savetradeidea,routetodealer ,Remark",
          },
          {
            key: 'TRF',
            usertype:'IA',
            fromNewOrderfromRM_unlocked: "spread, emailquote, viewschedule, reset, savetradeidea, routetodealer, remark, RMremark, originalIBprem",
            fromNewOrderfromRM_locked: " emailquote, viewschedule, reset, savetradeidea,routetodealer, reject, remark, RMremark, originalIBprem",
            fromTradeIdea: "spread, emailquote, viewschedule, reset, routetodealer",
            fromExecuted: "emailquote, viewschedule, reset, savetradeidea , routetodealer, Remark, RMremark",
            fromExpired: "",
            fromRejected: "emailquote, viewschedule, reset, routetodealer, Remark, RMremark",
            fromExpiredTradeIdea: "spread, emailquote, viewschedule, reset, savetradeidea,routetodealer ,Remark",
          },
          {
            key: 'Pivot',
            usertype:'IA',
            fromNewOrderfromRM_unlocked: "spread, emailquote, viewschedule, reset, savetradeidea, routetodealer, remark, RMremark, originalIBprem",
            fromNewOrderfromRM_locked: " emailquote, viewschedule, reset, savetradeidea,routetodealer, reject, remark, RMremark, originalIBprem",
            fromTradeIdea: "spread, emailquote, viewschedule, reset, routetodealer",
            fromExecuted: "emailquote, viewschedule, reset, savetradeidea , routetodealer, Remark, RMremark",
            fromExpired: "",
            fromRejected: "emailquote, viewschedule, reset, routetodealer, Remark, RMremark",
            fromExpiredTradeIdea: "spread, emailquote, viewschedule, reset, savetradeidea,routetodealer ,Remark",
          },
          {
            key: 'AQDQ',
            usertype:'FXA',
            fromNewOrderfromRM_unlocked: "spread, emailquote, viewschedule, reset, savetradeidea, reject, remark, RMremark, originalIBprem, timer",
            fromNewOrderfromRM_locked: "emailquote, viewschedule, reset, savetradeidea, reject, remark, RMremark, originalIBprem",
            fromTradeIdea: "spread, emailquote, viewschedule, reset, savetradeidea",
            fromExecuted: "emailquote, viewschedule, reset, savetradeidea , Remark, RMremark",
            fromExpired: "",
            fromRejected: "emailquote, viewschedule, reset, savetradeidea, Remark, RMremark",
            fromExpiredTradeIdea: "spread, emailquote, viewschedule, reset, savetradeidea ,Remark",
          },
          {
            key: 'TRF',
            usertype:'FXA',
            fromNewOrderfromRM_unlocked: "spread, emailquote, viewschedule, reset, savetradeidea, reject, remark, RMremark, originalIBprem, timer",
            fromNewOrderfromRM_locked: "emailquote, viewschedule, reset, savetradeidea, reject, remark, RMremark, originalIBprem",
            fromTradeIdea: "spread, emailquote, viewschedule, reset, savetradeidea",
            fromExecuted: "emailquote, viewschedule, reset, savetradeidea , Remark, RMremark",
            fromExpired: "",
            fromRejected: "emailquote, viewschedule, reset, savetradeidea, Remark, RMremark",
            fromExpiredTradeIdea: "spread, emailquote, viewschedule, reset, savetradeidea ,Remark",
          },
          {
            key: 'Pivot',
            usertype:'FXA',
            fromNewOrderfromRM_unlocked: "spread, emailquote, viewschedule, reset, savetradeidea, reject, remark, RMremark, originalIBprem, timer",
            fromNewOrderfromRM_locked: "emailquote, viewschedule, reset, savetradeidea, reject, remark, RMremark, originalIBprem",
            fromTradeIdea: "spread, emailquote, viewschedule, reset, savetradeidea",
            fromExecuted: "emailquote, viewschedule, reset, savetradeidea , Remark, RMremark",
            fromExpired: "",
            fromRejected: "emailquote, viewschedule, reset, savetradeidea, Remark, RMremark",
            fromExpiredTradeIdea: "spread, emailquote, viewschedule, reset, savetradeidea ,Remark",
          },
        ],
      
      }
    ];

    if(!isRediredted){
        return GetPricerLayoutConfigurationDetailsResult[0].SinglePricer
    }else{
        return GetPricerLayoutConfigurationDetailsResult[0].Redirected
    }
    
  }
  // Added by Urmila A | 15-feb-23 | btn visibility SP for FXD products | end


 
}




