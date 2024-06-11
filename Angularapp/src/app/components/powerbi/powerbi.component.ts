import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  HostListener,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonApiService } from 'src/app/services/common-api.service';
import { ConfigDataService } from 'src/app/services/config-data.service';
import { SafePipe } from 'src/app/pipes/safe.pipe';
import { Router } from 'express';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-powerbi',
  templateUrl: './powerbi.component.html',
  styleUrls: ['./powerbi.component.scss']
})
export class PowerbiComponent implements OnInit {

  public getScreenWidth: any;
  public getScreenHeight: any;
  public innerWidth: any;
  column: any = [];
  showSettings: boolean = false;
  currentTheme: any;
  currentPalette: any;
  currentFont: any;
  username: any = '';
  srcLink: any;

  @HostListener('window:resize', ['$event'])
  onresize() {
    this.innerWidth = window.innerWidth
    console.log(this.innerWidth)
    if (this.innerWidth < 1800 && this.innerWidth >= 1200) {
      this.setColumns(3)
    }
    else if (this.innerWidth < 1200 && this.innerWidth >= 900) {
      this.setColumns(2)
    } else if (this.innerWidth < 900) {
      this.setColumns(1)
    } else {
      this.setColumns(4)
    }
    console.log(this.column)
  }


  constructor(public commonApi: CommonApiService, public configDataApi: ConfigDataService, public safePipe: SafePipe, public route: ActivatedRoute) { }

  async ngOnInit() {
    this.username = sessionStorage.getItem('UserName')
    this.innerWidth = window.innerWidth;
    this.route.params.subscribe(async res => {
      console.log(res);
      // const url = (await this.configDataApi.GetSourceLink()).Get_Config_ValueResult[0].Config_Value;
      const url = decodeURIComponent(res.srcLink);
      this.srcLink = this.safePipe.transform(
        url,
        'resourceUrl'
      );

    })


    this.showSettings = false;
    this.column[0] = [
      {
        value: 'Portfolio Allocation',
        tileCode: 'PortfolioAllocation',
        height: '350px',
        column: 1,
        row: 1,
        disabled: false
        // width: '320px',
      },
      {
        value: 'Performance Historical',
        tileCode: 'PerformanceHistorical',
        height: '350px',
        column: 1,
        row: 2,
        disabled: false
        // width: '320px',
      }
    ];
    this.column[1] = [

      {
        value: 'Top Performing Assets',
        tileCode: 'TopPerformingAssets',
        height: '350px',
        column: 2,
        row: 2,
        disabled: false
        // width: '320px',
      },


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

      {
        value: 'Cash Balance',
        tileCode: 'CashBalance',
        height: '350px',
        column: 3,
        row: 2,
        disabled: false
        // width: '320px',
      }

    ];
    this.column[3] = [

      {
        value: 'Market Watch',
        tileCode: 'MarketWatch',
        height: '350px',
        column: 4,
        row: 2,
        disabled: false
        // width: '320px',
      },

    ];
    console.log(this.column)
  }

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
    console.log(indexOfObject1)
    if (indexOfObject1 !== -1) {
      this.column[0].splice(indexOfObject1, 1);
    }

    const indexOfObject2 = this.column[1].findIndex((object: { tileCode: string; }) => {
      return object.tileCode === 'EmptyCard';
    });
    console.log(indexOfObject2)
    if (indexOfObject2 !== -1) {
      this.column[1].splice(indexOfObject2, 1);
    }

    const indexOfObject3 = this.column[2].findIndex((object: { tileCode: string; }) => {
      return object.tileCode === 'EmptyCard';
    });
    console.log(indexOfObject3)
    if (indexOfObject3 !== -1) {
      this.column[2].splice(indexOfObject3, 1);
    }

    const indexOfObject4 = this.column[3].findIndex((object: { tileCode: string; }) => {
      return object.tileCode === 'EmptyCard';
    });
    console.log(indexOfObject4)
    if (indexOfObject4 !== -1) {
      this.column[3].splice(indexOfObject4, 1);
    }
  }
  drop(event: CdkDragDrop<any[]>) {
    this.removeEmptyCards()
    console.log(event)
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
    if (this.column[0].length === 0) {
      this.addEmptyCard(0)
    } else if (this.column[1].length === 0) {
      this.addEmptyCard(1)
    } else if (this.column[2].length === 0) {
      this.addEmptyCard(2)
    } else if (this.column[3].length === 0) {
      this.addEmptyCard(3)
    } else {
      this.removeEmptyCards()
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
        disabled: true
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
    console.log(temp)
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
    console.log(this.column)
  }

}
