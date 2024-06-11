import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-custom-tabs',
  templateUrl: './custom-tabs.component.html',
  styleUrls: ['./custom-tabs.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTabsComponent),
      multi: true,
    },
  ],
})
export class CustomTabsComponent implements OnInit, AfterViewChecked, ControlValueAccessor {
  @Input() tabHeaders: string[] = [];
  @Input() tabCase!: string;
  @Output() getSelectedTabIndex = new EventEmitter<any>();

  @ViewChild('marker', { static: false }) marker!: ElementRef;

  selectedTabIndex: number = 0;
  initialMarkerPositionSet = false;
  Visited: any = 0;
  header_case: any;
  tabPadding = 0;
  columns_template = 'repeat('+this.tabHeaders.length+', 1fr)';

  onChange: (value: number) => any = () => {};
  onTouched: () => any = () => {};

  constructor(private elem: ElementRef) {
    this.selectedTabIndex = 0;
  }

  ngOnInit(): void {

    //Added on 5th April 2022 by Ashwini H.
    this.columns_template = 'repeat('+this.tabHeaders.length+', 1fr)';
   
    if (this.tabCase === 'uppercase') {
      this.header_case = 'tabHeaders_uppercase';
    } else if (this.tabCase === 'capitalize') {
      this.header_case = 'tabHeaders_camelcase';
    } else if (this.tabCase === 'lowercase') {
      this.header_case = 'tabHeaders_lowercase';
    }
  }

  ngAfterViewChecked(): void {
    this.tabPadding = parseFloat(
      getComputedStyle(document.getElementsByClassName('tabHeaders')[0])
        .getPropertyValue('padding-right')
        .split('px')[0]
    );
    if (this.selectedTabIndex > -1 && !this.initialMarkerPositionSet) {
      this.positionIndicator();
      this.initialMarkerPositionSet = true;
    }
  }

  writeValue(value: number): void {
    value = value < this.tabHeaders.length && value >= 0 ? value : 0;
    this.selectedTabIndex = value === null ? 0 : value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  changeTab(e: any, value: number) {
    console.log(value)
    this.selectedTabIndex = value;
    this.Visited = value;
    const link = e.target;
    const links = [...this.elem.nativeElement.querySelectorAll('.tabHeaders')];
    if (value === 0) {
      this.marker.nativeElement.style.width =
        'calc(' + link.offsetWidth + 'px - ' + this.tabPadding + 'px)';
      this.marker.nativeElement.style.left = '0';
    } else if (value === links.length - 1) {
      this.marker.nativeElement.style.width =
        'calc(' + link.offsetWidth + 'px - ' + this.tabPadding + 'px)';
      this.marker.nativeElement.style.left =
        'calc(' + link.offsetLeft + 'px + ' + this.tabPadding + 'px)';
    } else {
      this.marker.nativeElement.style.width =
        'calc(' + link.offsetWidth + 'px - ' + this.tabPadding * 2 + 'px)';
      this.marker.nativeElement.style.left =
        'calc(' + link.offsetLeft + 'px + ' + this.tabPadding + 'px)';
    }
    this.onChange(this.selectedTabIndex);
    this.getSelectedTabIndex.emit(this.selectedTabIndex);
  }

  moveIndicator(index: number) {
    const links = [...this.elem.nativeElement.querySelectorAll('.tabHeaders')];
    const link = links[index];
    if (index === 0) {
      this.marker.nativeElement.style.width =
        'calc(' + link.offsetWidth + 'px - ' + this.tabPadding + 'px)';
      this.marker.nativeElement.style.left = '0';
    } else if (index === links.length - 1) {
      this.marker.nativeElement.style.width =
        'calc(' + link.offsetWidth + 'px - ' + this.tabPadding + 'px)';
      this.marker.nativeElement.style.left =
        'calc(' + link.offsetLeft + 'px + ' + this.tabPadding + 'px)';
    } else {
      this.marker.nativeElement.style.width =
        'calc(' + link.offsetWidth + 'px - ' + this.tabPadding * 2 + 'px)';
      this.marker.nativeElement.style.left =
        'calc(' + link.offsetLeft + 'px + ' + this.tabPadding + 'px)';
    }
  }

  positionIndicator() {
    const links = [...this.elem.nativeElement.querySelectorAll('.tabHeaders')];
    this.selectedTabIndex = this.selectedTabIndex || 0;
    if (this.selectedTabIndex === 0) {
      this.marker.nativeElement.style.width =
        'calc(' +
        links[this.selectedTabIndex].offsetWidth +
        'px - ' +
        this.tabPadding +
        'px)';
      this.marker.nativeElement.style.left = '0px';
    } else if (this.selectedTabIndex === links.length - 1) {
      this.marker.nativeElement.style.width =
        'calc(' +
        links[this.selectedTabIndex].offsetWidth +
        'px - ' +
        this.tabPadding +
        'px)';
      this.marker.nativeElement.style.left =
        'calc(' +
        links[this.selectedTabIndex].offsetLeft +
        'px + ' +
        this.tabPadding +
        'px)';
    } else {
      this.marker.nativeElement.style.width =
        'calc(' +
        links[this.selectedTabIndex].offsetWidth +
        'px - ' +
        this.tabPadding * 2 +
        'px)';
      this.marker.nativeElement.style.left =
        'calc(' +
        links[this.selectedTabIndex].offsetLeft +
        'px + ' +
        this.tabPadding +
        'px)';
    }
  }
}
