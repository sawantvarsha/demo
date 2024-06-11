import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
// import * as $ from 'jquery';
import { ServiceService } from 'src/app/services/service.service';
declare var require: any;
const $: any = require('jquery');

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss'],
})
export class SlideshowComponent implements OnInit, OnDestroy, AfterViewInit {
  isProd: boolean = environment.production;
  interval: any;
  slides: any[];

  constructor(public slideshowService: ServiceService) {}
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    clearInterval(this.interval);
  }

  ngOnInit(): void {
    clearInterval(this.interval);
    this.slideshowService.getSlideshowImages().subscribe((res) => {
      console.log(res);
      this.slides = res;
    });
  }

  ngAfterViewInit(): void {
    const that = this;
    $.fn.slider = function () {
      var $this = this;
      var $controls = $this.nextAll('.controls').first();
      $this.find('li:gt(0)').hide();

      that.interval = setInterval(function () {
        $this
          .find('li:first-child')
          .fadeOut(2000)
          .next('li')
          .fadeIn(2000)
          .end()
          .appendTo($this);
        var index = $this.find('li:first-child').data('index');
        $controls.find('li.active').removeClass('active');
        $controls.find('li').eq(index).addClass('active');
      }, 8000);
    };
    $('#slider').slider();
  }
}
