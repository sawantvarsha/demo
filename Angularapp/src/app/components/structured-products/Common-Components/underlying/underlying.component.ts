import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { EqcApifunctionService } from '../../Services/eqc-apifunction.service';
import { EqcCommonfunctionsService } from '../../Services/eqc-commonfunctions.service';
import { SearchUnderlyingPipe } from '../pipes/search-underlying.pipe';
declare var require: any;
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-underlying',
  templateUrl: './underlying.component.html',
  styleUrls: ['./underlying.component.scss'],
})
export class UnderlyingComponent implements OnInit {
  @Input() ClassModel: any;
  @Output() UnderlyingChanged = new EventEmitter<boolean>();

  showUnderlyingList: boolean = false;
  EnteredUnderlying: boolean = false;
  UnderlyingList = [];
  selectedBIndex: number = 0;
  shareCode: any;
  ShareName: string;

  constructor(
    public EQC_afs: EqcApifunctionService,
    public EQC_cfs: EqcCommonfunctionsService,
    public elem: ElementRef
  ) {}

  ngOnInit(): void {
    this.EQC_afs.loadShares().subscribe((_sharesListObj) => {
      if (_sharesListObj) {
        this.UnderlyingList = []; // Clear Underlying list Array
        this.UnderlyingList = JSON.parse(_sharesListObj.responseData);
        this.EQC_afs.SetToken(_sharesListObj.token);
        this.InsertDefaultUnderlying();
      }
    });
  }

  InsertDefaultUnderlying() {
    this.showUnderlying(
      SearchUnderlyingPipe.prototype.transform(
        this.UnderlyingList,
        this.ClassModel.Underlying,
        1
      )[0]
    );
    this.showUnderlyingList = false;
    this.EnteredUnderlying = false;
  }

  ChangeIndex() {
    try {
      this.shareCode = '';
      this.selectedBIndex = 0;
      this.elem.nativeElement.querySelectorAll('.SelectorBox').scrollTop = 0;
      this.EnteredUnderlying = true;
    } catch (Error) {}
  }

  backKeyPress() {
    try {
      this.shareCode = '';
      this.selectedBIndex = 0;
    } catch (error) {}
  }

  EnterUnderlying() {
    try {
      if ($('.HoverSuggestion').data('share') != undefined) {
        this.shareCode = $('.HoverSuggestion').data('share');
      }
      this.ShareName = this.shareCode;
      this.showUnderlying(
        SearchUnderlyingPipe.prototype.transform(
          this.UnderlyingList,
          this.shareCode,
          1
        )[0]
      );
      this.showUnderlyingList = false;
      this.EnteredUnderlying = false;
    } catch (Error) {}
  }

  // share selection
  showUnderlying(item) {
    try {
      this.selectedBIndex = 0;
      this.ShareName = item.LongName;
      this.ClassModel.UnderlyingCode = item.Code;
      this.ClassModel.UnderlyingCurrency = item.Ccy;
      this.ClassModel.UnderlyingExchangeCode = item.ExchangeCode;
      this.ClassModel.UnderlyingExchange =
        item.ExchangeCode + ' - ' + item.ExchangeName;
      this.ClassModel.UnderlyingStrPair = item.Code + ' - ' + item.Ccy;
      this.ClassModel.Underlying = item.Code;
      this.showUnderlyingList = false;
      this.EnteredUnderlying = false;
      this.UnderlyingChanged.emit(true);
    } catch (error) {}
  }

  ScrollTo(container, element, direction) {
    try {
      const $container = $(container);
      const $scrollTo = $(element);
      switch (direction) {
        case 'up':
          $container.animate(
            {
              scrollTop:
                $scrollTo.offset().top -
                $container.offset().top +
                $container.scrollTop(),
              scrollLeft: 0,
            },
            10
          );
          break;
        case 'down':
          $container.animate(
            {
              scrollTop:
                $scrollTo.offset().top -
                $container.offset().top +
                $container.scrollTop() -
                100,
              scrollLeft: 0,
            },
            10
          );
          break;
        default:
          break;
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  moveUpSelection(selectedIndex) {
    try {
      if (selectedIndex !== undefined) {
        if (selectedIndex > 0) {
          selectedIndex--;
        }
        if ($('.SelectorBox').length > 0) {
          this.ScrollTo('.SelectorBox', '.HoverSuggestion', 'down');
          return selectedIndex;
        } else {
          return 0;
        }
      }
    } catch (error) {}
  }

  moveDownSelection(selectedIndex) {
    try {
      if ($('.SelectorBox').length > 0) {
        if (selectedIndex < $('.SelectorBox')[0].childElementCount - 1) {
          selectedIndex++;
        }
        if ($('.SelectorBox')[0].childElementCount > selectedIndex) {
          this.ScrollTo('.SelectorBox', '.HoverSuggestion', 'up');
          return selectedIndex;
        }
      } else {
        return 0;
      }
    } catch (error) {}
  }
}
