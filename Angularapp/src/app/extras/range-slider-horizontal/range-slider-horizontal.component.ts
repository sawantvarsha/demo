import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
// import { ThemeServiceService } from 'src/app/services/theme-service.service';

@Component({
  selector: 'app-range-slider-horizontal',
  templateUrl: './range-slider-horizontal.component.html',
  styleUrls: ['./range-slider-horizontal.component.scss'],
})
export class RangeSliderHorizontalComponent implements OnInit, AfterViewInit {
  settings = {
    fill: 'var(--icon-active)',
    background: 'var(--input-bg)',
  };
  @Input() labelName;
  @Input() max: any;
  @Input() min: any;
  @Input() id: any;
  @Input() value: any;
  @Input() step: any;
  @Input() range: any;
  @ViewChild('slider1', { static: false }) slider1: ElementRef;
  @Output() valueChangeEvent: EventEmitter<any> = new EventEmitter();
  ticks = 1;
  percentage: any;
  bg: any;
  // @ViewChild('rangeSliderHorzSound', { static: false }) rangeSliderHorzSound: ElementRef;

  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    if (event.wheelDelta > 0) {
      this.ticks = this.ticks > this.min ? this.ticks - this.step : this.ticks;
      this.sliderChange(event);
    }
    if (event.wheelDelta < 0) {
      this.ticks = this.ticks < this.max ? this.ticks + this.step : this.ticks;
      this.sliderChange(event);
    }
  }

  constructor(private ref: ChangeDetectorRef, public elem: ElementRef) {
    // this.slider1 = new ElementRef()
    // this.ticks = this.value;
  }

  ngOnInit(): void {
    console.log(this.ticks, this.value, this.min, this.max);
  }
  ngAfterViewInit() {
    this.ticks = this.value;
    if (this.value) {
      this.percentage =
        (100 * (this.ticks - this.slider1.nativeElement.min)) /
        (this.slider1.nativeElement.max - this.slider1.nativeElement.min);
      this.bg = `linear-gradient(90deg, ${this.settings.fill} ${
        this.percentage
      }%, ${this.settings.background} ${this.percentage + 0.1}%)`;
      this.slider1.nativeElement.style.background = this.bg;
    } else {
      this.ticks = 0;
    }
    // this.sliderChange(this.ticks);
    // this.themeService.themeObs.subscribe(res => {
    //   if (res) {
    //     this.settings = {
    //       fill: '#1abc9c',
    //       background: '#2b2f2e8c'
    //     };
    //     this.sliderChange('event');

    //   } else {
    //     this.settings = {
    //       fill: '#1abc9c',
    //       background: '#d7dcdf'
    //     };
    //     this.sliderChange('event');

    //   }
    // });

    this.ref.detectChanges();
  }

  sliderChange(e) {
    console.log('slider input:', e.target.value);
    console.log(this.ticks);
    this.ticks = e.target.value;
    if (e) {
      this.percentage =
        (100 * (this.ticks - this.slider1.nativeElement.min)) /
        (this.slider1.nativeElement.max - this.slider1.nativeElement.min);
      this.bg = `linear-gradient(90deg, ${this.settings.fill} ${
        this.percentage
      }%, ${this.settings.background} ${this.percentage + 0.1}%)`;
      this.slider1.nativeElement.style.background = this.bg;
      if (Number(this.ticks) > Number(this.slider1.nativeElement.max)) {
        this.ticks = this.slider1.nativeElement.max;
        // e.target.value = this.ticks;
        this.valueChangeEvent.emit({ id: this.id, ticks: this.ticks });
      } else if (Number(this.ticks) < Number(this.slider1.nativeElement.min)) {
        this.ticks = this.slider1.nativeElement.min;
        // e.target.value = this.ticks;
        this.valueChangeEvent.emit({ id: this.id, ticks: this.ticks });
      } else {
        this.valueChangeEvent.emit({ id: this.id, ticks: this.ticks });
      }
    } else {
      this.ticks = 0;
      this.valueChangeEvent.emit({ id: this.id, ticks: this.ticks });
    }

    console.log('Ticks', this.ticks);
    this.ref.detectChanges();
    // this.rangeSliderHorzSound.nativeElement.play();
  }
}
