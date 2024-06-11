import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ApifunctionsService } from '../services/apifunctions.service';
import { CommonfunctionsService } from '../services/commonfunctions.service';
import { OauthService } from 'src/app/services/oauth/oauth.service';

import { AppConfig } from 'src/app/services/config.service';

import { EcHomeService } from '../../euroconnect/services/ec-home.service';

// import { LanguageService } from '../extras/langService/language.service';
@Component({
  selector: 'app-dashboard-new',
  templateUrl: './dashboard-new.component.html',
  styleUrls: ['./dashboard-new.component.scss']
})


export class DashboardNewComponent implements OnInit {
  public getScreenWidth: any;
  public getScreenHeight: any;
  public innerWidth: any;
  column: any = [];
  column1: any = [];
  column11: any = [];
  showSettings: boolean = false;
  currentTheme: any;
  currentPalette: any;
  currentFont: any;
  username: any = '';
  Welcome : any = "Welcome"
  creditProductData:any = [];
  creditTenorData:any = [];
  creditUnderlyingData:any = [];

  DCNUnderlyingData:any = [];
  
  // DCNUnderlyingData:any = [];
  EQProductData:any = [];
  EQTenorData:any = [];
  EQUnderlyingData:any = [];
  FXProductData:any = [];
  FXTenorData:any = [];
  hiddenCards:any = [];


  cards: any[] = [];
  addList: any[] = [];
  cardDetails: any[] = []

  copyColumn: any[] = []

  SequenceColumn: any = ''
  SequenceRow: any = ''
  ColumnSequence: any[] = []
  RowSequence: any[] = []

  @HostListener('window:resize', ['$event'])
  onresize(_event: any) {
    this.innerWidth = window.innerWidth
    //console.log(this.innerWidth)
    if (this.innerWidth < 1800 && this.innerWidth >= 1200) {

      this.setColumns(3)

    }
    else if (this.innerWidth < 1200 && this.innerWidth >= 900) {
      this.column = this.column1;
      this.setColumns(2)
    } else if (this.innerWidth < 900) {
      this.column = this.column1;
      this.setColumns(1)
    } else {
      this.column = this.column1;
      this.setColumns(4)
      this.column = this.column1;
    }
    //console.log(this.column)

  }
  constructor(
    private elem: ElementRef,
    // public languageApi: LanguageService,
    private apiservice: ApifunctionsService,
    private commonfunctions: CommonfunctionsService,
    public apifunctions: EcHomeService,
    private readonly oauthApi: OauthService,
  ) {
    this.column = [];
  }

  async ngOnInit(){

    //To be checked later for unnecessary calling of OAuth in this component
    const response : any = await this.oauthApi.getUserData();
    AppConfig.settings.oRes = response;  

    this.GetPopularUnderlyings();
    this.GetPopularProducts();
    this.GetPopularTenors();
    // this.username = sessionStorage.getItem('Username');
    this.username = AppConfig.settings.oRes.userName; //Added by Apurva K || 14-Apr-2023
    this.innerWidth = window.innerWidth;
    this.showSettings = false;
    this.column[0] = [
      {
        value: 'Market Intelligence (Equity)',
        tileCode: 'MarketIntelligence',
        svg: 'DI-MIEquity',
        height: '350px',
        column: 1,
        row: 1,
        disabled: false,
        category:'EQ',
        display:true
        // width: '320px',
      },
      {
        value: 'Add Widget',
        tileCode: 'Addcard',
        svg: 'add-new',
        height: '350px',
        column: 4,
        row: 4,
        disabled: true,
        display: true
        // width: '320px',
      }
      
      

      
    ];
    this.column[1] = [
      {
        value: 'Multi Request Launch',
        tileCode: 'MultiRequestLaunch',
        svg: 'multirequest-icon',
        height: '350px',
        column: 1,
        row: 2,
        disabled: false,
        display:true
        // width: '320px',
      },

      {
        value: 'Previous Quotes',
        tileCode: 'PreviousQuotes',
        svg: 'previous-quotes-icon',
        height: '350px',
        column: 1,
        row: 3,
        disabled: false,
        display:true
        // width: '320px',
      }
      
      // {
      //   value: 'Scheduled Requests',
      //   tileCode: 'ScheduledRequests',
      //   svg: 'scheduled-requests-icon',
      //   height: '350px',
      //   column: 2,
      //   row: 2,
      //   disabled: false,
      //   display:true
      //   // width: '320px',
      // },
      
      
      // {
      //   value: 'Saved Requests',
      //   tileCode: 'SavedRequests',
      //   svg: 'Saved-Quotes-icon',
      //   height: '350px',
      //   column: 2,
      //   row: 2,
      //   disabled: false,
      //   display:true
      //   // width: '320px',
      // }

      // {
      //   value: 'Market Watch',
      //   tileCode: 'MarketWatch',
      //   height: '350px',
      //   // width: '320px',
      //   column: 2,
      //   row: 1
      // },

    ];
    this.column[2] = [
 
      // {
      //   value: 'Equity Trading Axes',
      //   tileCode: 'AppStockRecommendation',
      //   svg: 'Equity-trading-access-icon',
      //   height: '450px',
      //   column: 4,
      //   row: 1,
      //   disabled: false,
      //   display: true
      //   // width: '320px',
      // },
       {
        value: 'Content',
        tileCode: 'Content',
        svg: 'content-card-icon',
        height: '350px',
        column: 3,
        row: 2,
        disabled: false,
        display: true
        // width: '320px',
      },
      {
        //ProductWatchlist 
        value: 'Product Watchlist',
        tileCode: 'ProductWatchlist',
        svg: 'DI-MIEquity',
        height: '350px',
        column: 3,
        row: 3,
        disabled: false,
        category: 'EQ',
        display: true
      },
      
    ];
    // this.column[3] = [



    //   // {
    //   //   value: 'Marketing Material',
    //   //   tileCode: 'MarketingMaterial',
    //   //   svg: 'Marketing-material',
    //   //   height: '350px',
    //   //   column: 4,
    //   //   row: 2,
    //   //   disabled: false,
    //   //   display: true
    //   //   // width: '320px',
    //   // },
    //   // {
    //   //   value: 'Access Videos',
    //   //   tileCode: 'AccessVideos',
    //   //   svg: 'Access-Videos-icon',
    //   //   height: '350px',
    //   //   column: 4,
    //   //   row: 3,
    //   //   disabled: false,
    //   //   display: true
    //   //   // width: '320px',
    //   // },
      
    // ];
    this.column1 = this.column;
    this.copyColumn = JSON.parse(JSON.stringify(this.column1));
    console.log("Columns", this.column)
    for (let i = 0; i < this.column.length; i++) {
      for (let j = 0; j < this.copyColumn[i].length; j++) {
        this.column11.push(this.copyColumn[i][j]);
      }

    }
    await this.apiservice.fnGetLayoutDetails().toPromise().then((res: any) => {
      try {
        // if (res.length > 0) {
        //   if (res.Sequence !== '') {
        //     this.addList = [];
        //     this.cards = [];

        //     let Sequence = res.Sequence.split(',');
        //     this.ColumnSequence = res.Sequence.split('|');
        //     this.RowSequence = res.Sequence.split(';');
        //     console.log("Yeh", Sequence, this.ColumnSequence, this.RowSequence)
        //     Sequence.forEach((item: any) => {
        //       for (let i = 0; i < 4; i++) {
        //         let card = this.column[i].find((x: any) => x.value === item);
        //         if (card) {
        //           this.cards.push(card);
        
        //         }
        //       }
        //     });    
        //   }
        // } 
        // if (res.Sequence !== '' && this.ColumnSequence.length > 1) {
        //   for (let i = 0; i < this.cards.length; i++) {
        //     this.cards[i].column = this.ColumnSequence[i + 1]
        //     this.cards[i].row = this.RowSequence[i + 1]
        //   }
        //  for (let i = 0; i < this.column.length; i++) {
        //     this.column[i] = []
        //   }
        //   for (let k = 0; k < this.cards.length; k++) {
        //     this.column[this.cards[k].column - 1][this.cards[k].row - 1] = this.cards[k]
        //   }
        // }
        // this.AddFilterLayout();
      
      // Changes by Apurva K|| 23-May-2023
      let Sequence = res[0]?.Sequence
      let cols = Sequence?.split('||')
      console.log(cols,"this.column cols")
      if (cols?.length > 1) {
        for (let i = 0; i < cols.length - 1; i++) {
          this.column[i] = JSON.parse(cols[i])
        }

        console.log(this.column,"this.column hello")
        for (let i = 0; i < this.column.length; i++) {
          for (let j = 0; j < this.column[i].length; j++) {
            if (this.column[i][j].display == false) {
              this.hiddenCards.push(this.column[i][j].value);
            }
          }
        }
      }else{
        this.column[0] = [
          {
            value: 'Market Intelligence (Equity)',
            tileCode: 'MarketIntelligence',
            svg: 'DI-MIEquity',
            height: '350px',
            column: 1,
            row: 1,
            disabled: false,
            category:'EQ',
            display:true
            // width: '320px',
          },
          {
            value: 'Add Widget',
            tileCode: 'Addcard',
            svg: 'add-new',
            height: '350px',
            column: 4,
            row: 4,
            disabled: true,
            display: true
            // width: '320px',
          }
          
          
    
          
        ];
        this.column[1] = [
          {
            value: 'Multi Request Launch',
            tileCode: 'MultiRequestLaunch',
            svg: 'multirequest-icon',
            height: '350px',
            column: 1,
            row: 2,
            disabled: false,
            display:true
            // width: '320px',
          },
    
          {
            value: 'Previous Quotes',
            tileCode: 'PreviousQuotes',
            svg: 'previous-quotes-icon',
            height: '350px',
            column: 1,
            row: 3,
            disabled: false,
            display:true
            // width: '320px',
          }
          
          // {
          //   value: 'Scheduled Requests',
          //   tileCode: 'ScheduledRequests',
          //   svg: 'scheduled-requests-icon',
          //   height: '350px',
          //   column: 2,
          //   row: 2,
          //   disabled: false,
          //   display:true
          //   // width: '320px',
          // },
          
          
          // {
          //   value: 'Saved Requests',
          //   tileCode: 'SavedRequests',
          //   svg: 'Saved-Quotes-icon',
          //   height: '350px',
          //   column: 2,
          //   row: 2,
          //   disabled: false,
          //   display:true
          //   // width: '320px',
          // }
    
          // {
          //   value: 'Market Watch',
          //   tileCode: 'MarketWatch',
          //   height: '350px',
          //   // width: '320px',
          //   column: 2,
          //   row: 1
          // },
    
        ];
        this.column[2] = [
     
          // {
          //   value: 'Equity Trading Axes',
          //   tileCode: 'AppStockRecommendation',
          //   svg: 'Equity-trading-access-icon',
          //   height: '450px',
          //   column: 4,
          //   row: 1,
          //   disabled: false,
          //   display: true
          //   // width: '320px',
          // },
           {
            value: 'Content',
            tileCode: 'Content',
            svg: 'content-card-icon',
            height: '350px',
            column: 3,
            row: 2,
            disabled: false,
            display: true
            // width: '320px',
          },
          {
            //ProductWatchlist 
            value: 'Product Watchlist',
            tileCode: 'ProductWatchlist',
            svg: 'DI-MIEquity',
            height: '350px',
            column: 3,
            row: 3,
            disabled: false,
            category: 'EQ',
            display: true
          },
          
        ];
      }
      }
      catch (_ex) {
      }
    });
  }

  // changeLanguage(lang: any) {
  //   this.languageApi.selectedLanguage = lang;
  //   this.languageApi.translate.use(lang.value);
  // }

  tabs = [
    'Order Summary',
    'Previous Quotes',
    'Access Videos',
    'Content',
    'Multi Request Launch',
    'Marketing Material',
    'Market Watch',
    'Saved Requests',
  ];

  toggleSettings() {
    if (!this.showSettings) this.closeAllPopUps();
    this.showSettings = !this.showSettings;
  }
  closeAllPopUps() {
  }

  // positions: any[];

  removeEmptyCards() {
    //remove empty cards
    const indexOfObject1 = this.column[0].findIndex((object: { tileCode: string; }) => {
      return object.tileCode === 'EmptyCard';
    });
    //console.log(indexOfObject1)
    if (indexOfObject1 !== -1) {
      this.column[0].splice(indexOfObject1, 1);
    }

    const indexOfObject2 = this.column[1].findIndex((object: { tileCode: string; }) => {
      return object.tileCode === 'EmptyCard';
    });
    //console.log(indexOfObject2)
    if (indexOfObject2 !== -1) {
      this.column[1].splice(indexOfObject2, 1);
    }

    const indexOfObject3 = this.column[2].findIndex((object: { tileCode: string; }) => {
      return object.tileCode === 'EmptyCard';
    });
    //console.log(indexOfObject3)
    if (indexOfObject3 !== -1) {
      this.column[2].splice(indexOfObject3, 1);
    }

    const indexOfObject4 = this.column[3].findIndex((object: { tileCode: string; }) => {
      return object.tileCode === 'EmptyCard';
    });
    //console.log(indexOfObject4)
    if (indexOfObject4 !== -1) {
      this.column[3].splice(indexOfObject4, 1);
    }
  }
  drop(event: CdkDragDrop<any[]>) {
    //this.removeEmptyCards()// BBVACLI- 784 | Anubhav Goyal | 02-02-2023
    //console.log(event)
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // if(event.previousContainer.data[0])
      if (event.previousContainer.data[0].tileCode !== 'EmptyCard') {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }

    }
    for (let i = 0; i < this.column[0].length; i++) {
      this.column[0][i].column = 1
      this.column[0][i].row = i + 1
    }

    for (let i = 0; i < this.column[1].length; i++) {
      this.column[1][i].column = 2
      this.column[1][i].row = i + 1
    }

    for (let i = 0; i < this.column[2].length; i++) {
      this.column[2][i].column = 3
      this.column[2][i].row = i + 1
    }

    for (let i = 0; i < this.column[3].length; i++) {
      this.column[3][i].column = 4
      this.column[3][i].row = i + 1
    }
    if (this.column[0].length === 0) {
      this.addEmptyCard(0)
    } else if (this.column[1].length === 0) {
      this.addEmptyCard(1)
    } else if (this.column[2].length === 0) {
      this.addEmptyCard(2)
    } else if (this.column[3].length === 0) {
      this.addEmptyCard(3)
    } else {
      //this.removeEmptyCards()
    }
  }

  addEmptyCard(number: any) {
    this.column[number] = [
      {
        value: '',
        tileCode: 'EmptyCard',
        height: '350px',
        column: number,
        row: 1,
        disabled: true,
        display:true
      },
    ]
  }

  setColumns(number: number) {
    let temp: any[] = []
    for (let i = 0; i < 4; i++) {
      temp = temp.concat(this.column[i])
    }
    this.column[0] = []
    this.column[1] = []
    this.column[2] = []
    this.column[3] = []
    //console.log(temp)
    for (let i = 0; i < temp.length; i) {
      this.column[0].push(temp[i])
      i = i + 1
      if (number >= 2 && i !== temp.length) {
        this.column[1].push(temp[i])
        i = i + 1
      }
      if (number >= 3 && i !== temp.length) {
        this.column[2].push(temp[i])
        i = i + 1
      }
      if (number === 4 && i !== temp.length) {
        this.column[3].push(temp[i])
        i = i + 1
      }
    }
    //console.log(this.column)
  }

  async GetPopularProducts() {
    let res: any;
    res = await this.apiservice.BBVAGetPopularProducts(AppConfig.settings.oRes.userID, "Month");
    let d:any = this.apiservice.productChartData;
    //console.log('tile ', res);
    res.forEach((element:any) => {
      switch(element.Product.toLowerCase()){
        //<Sudarshan | 28-Feb-2022>
        case "eqc_europe":
          this.EQProductData.push({'title':'Autocallable', 'value':element.Count});
          break;
        case "yieldenhancement":
          this.EQProductData.push({'title':'Yield Enhancement', 'value':element.Count});
          break;
        case "customstrategy":
          this.EQProductData.push({'title':'Custom Strategy', 'value':element.Count});
          break;
        case "acc":
          this.EQProductData.push({'title':'Accumulator', 'value':element.Count});
          break;
        case "dac":
          this.EQProductData.push({'title':'Decumulator', 'value':element.Count});
          break;
         //</Sudarshan | 28-Feb-2022>
        case "autocallablephoenix":
          this.EQProductData.push({'title':'Autocall', 'value':element.Count});
          break;
        case "dualcurrencynote":
          this.FXProductData.push({ 'title': 'Dual Currency Note', 'value': element.Count });
          break;
        case "credittrancheind":
          this.creditProductData.push({ 'title': 'Credit Tranche', 'value': element.Count });
          break;
        case "creditlinkednote":
          this.creditProductData.push({ 'title': 'Credit Linked Note', 'value': element.Count });
          break;
          //Added case credittranche for CLI | Anubhav Goyal | 30-01-2023 | BBVACLI-773
        case "credittranche":
          this.creditProductData.push({ 'title': 'Credit Linear Index', 'value': element.Count });
          break;
        case "bonusenhancednote":
          this.EQProductData.push({'title':'BEN', 'value':element.Count});
          break;
        case "dailyrangeaccrual":
          this.EQProductData.push({'title':'DRA', 'value':element.Count});
          break;
        case "reverseconvertible":
          this.EQProductData.push({'title':'RC', 'value':element.Count});
          break;
        case "participation":
          this.EQProductData.push({'title':'Participation', 'value':element.Count});
          break;
        case "dualfireverseconvertible":
          this.EQProductData.push({'title':'Dual FI RC', 'value':element.Count});
          break;
        case "dualfiautocallablephoenix":
          this.EQProductData.push({'title':'Dual FI Autocall', 'value':element.Count});
          break;
        case "dualfidailyrangeaccrual":
          this.EQProductData.push({'title':'Dual FI DRA Autocall', 'value':element.Count});
          break;
      }
    });
    

  }


  async GetPopularTenors() {
    let res: any;
    res = await this.apiservice.BBVAGetPopularTenors(AppConfig.settings.oRes.userID, "Month");
    res = res.map((i:any)=>({
      'title':i.Tenor,
      'value':i.Count
    }))
    console.log('tile tenor', res);
    // this.EQTenorData = res.filter((d: any) => {
    //   return d.TypeAsset === 'EQ'
    // });
    // this.creditTenorData = res;
     this.EQTenorData = res;
    // this.FXTenorData = res;

  }

  async GetPopularUnderlyings() {
    let res: any;
    res = await this.apiservice.BBVAGetPopularUnderlyings(AppConfig.settings.oRes.userID.toString(), "Month", "40");
    
    //console.log("element.AssetType", res);
    res.forEach((element:any)=>{
      
      if(element.AssetType === "EQ"){
        this.EQUnderlyingData.push({'title':element.UnderlyingCode, 'value':element.Count});
      }
      else if (element.AssetType === "CR"){
        this.creditUnderlyingData.push({'title':element.UnderlyingCode, 'value':element.Count})
      }
      else if(element.AssetType === "FX"){
        this.DCNUnderlyingData.push({'title':element.UnderlyingCode, 'value':element.Count});
      }
      
    })

    //console.log('tile underlyings', this.EQUnderlyingData, this.creditUnderlyingData)

  }


  displayCard(cardValue:any){
    // let cols = [this.column[0].length,this.column[1].length,this.column[2].length,this.column[3].length]
    // let index = cols.indexOf(Math.min(...cols));
    
    this.hiddenCards = this.hiddenCards.filter((e:any)=>e !== cardValue);
    var saveflag = 0
    console.log("display card ", this.hiddenCards);
    for(let i =0 ;i<4;i++){
      this.column[i].forEach((element:any) => {
        if(element.value === cardValue){
          saveflag = 1
          element.display = true;
        }
      });
    }
    if(saveflag == 0)
    {
     for (let i = 0; i < this.column11.length; i++) {


      if (this.column11[i].value == cardValue) {
        this.column[0].push(this.column11[i]);
 
        saveflag = 1;
        break;
      }



  
    }

    }
  }

  closeCard(card:any, columnNo:any){
    //console.log("close ", card, columnNo);
    this.column[columnNo].forEach((element:any) => {
      if (element.value === card.value) {
        element.display = false;
      }
    });
    // this.column[columnNo].filter((ele:any)=>ele.tileCode !== card.tileCode);
    this.hiddenCards.push(card.value);
    //START :Added by Anubhav Goyal | To check empty column and add Empty Card | 06-02-2023
    var emptyCount=0
    for(let i=0;i<this.column.length;i++)
    {
      emptyCount = 0
      for(var j=0;j<this.column[i].length;j++)
      {
        

        if(this.column[i][j].display == false)
        {
          ++emptyCount
        }
      }
      if(emptyCount == j)
      {
        this.addEmptyCard(i)
      }
    }
     //END :Added by Anubhav Goyal | To check empty column and add Empty Card | 06-02-2023 
  }


  saveMsg: any

  SaveDashboardTile() {

    this.AddFilterLayout()

    let Sequence = '';

    for (let i = 0; i < this.column.length; i++) {
       
      Sequence += JSON.stringify(this.column[i]) + "||"
    }

    
    // for (let i = 0; i < this.column.length; i++) {
    //   this.column[i].forEach((element: any) => {
    //     if (element.display) {
    //       Sequence += element.value + ',';
    //       this.SequenceColumn += element.column + '|'
    //       this.SequenceRow += element.row + ';'
    //       console.log("There", element)
    //     }

    //   });
    // }
    // Sequence += '|' + this.SequenceColumn + ';' + this.SequenceRow;
    // Sequence
    let res = this.apiservice.fnSaveLayout(Sequence);
  }
  AddFilterLayout() {
    var saveflag = 0
    for (let i = 0; i < this.column11.length; i++) {
      saveflag = 0
      for (let j = 0; j < this.cards.length; j++) {
        if (this.column11[i].value == this.cards[j].value) {
          saveflag = 1;
          break;
        }
      }

      if (saveflag == 0) {
        this.hiddenCards.push(this.column11[i].value);
        // console.log("Hidden Cards", this.column11[i]);
      }
    }
    console.log("Hidden Cards", this.hiddenCards);


  }
}