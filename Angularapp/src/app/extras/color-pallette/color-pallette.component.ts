import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-color-pallette',
  templateUrl: './color-pallette.component.html',
  styleUrls: ['./color-pallette.component.scss']
})
export class ColorPalletteComponent implements OnInit {
  pallette: any;

  constructor() { }

  ngOnInit(): void {
    this.pallette = [
      {
        label: '--black',
        value: ' black'
      },
      {
        label: '--blue',
        value: '#29304d'
      },
      {
        label: '--red',
        value: '#d23f31'
      },
      {
        label: '--brown',
        value: '#d97d54'
      },
      {
        label: '--light- brown',
        value: '#f7d1c0'
      },
      {
        label: '--green',
        value: '#0f9d55'
      },
      {
        label: '--gray',
        value: '#e0e0e0'
      },
      {
        label: '--light-gray',
        value: '#f5f5f5'
      },
      {
        label: '--very-light-gray',
        value: '#fafafa'
      },
      {
        label: '--very-dark-gray',
        value: '#212121'
      },
      {
        label: '--dark-gray',
        value: '#303030'
      },
      {
        label: '--light-dark-gray',
        value: '#424242'
      },
      {
        label: '--main-bg-color',
        value: '#ffffff'
      },
      {
        label: '--navbar',
        value: '#ffffff'
      },
      {
        label: '--navbar-main',
        value: '#2e2f32'
      },
      {
        label: '--sidebar-li',
        value: '#000000'
      },
      {
        label: '--sidebar-li-active',
        value: '#1261a0'
      },
      {
        label: '--sidebar-bg',
        value: '#eeeeee'
      },
      {
        label: '--scroll-bar',
        value: '#1a4269'
      },
      {
        label: '--profile-name',
        value: '#1a4269'
      },
      {
        label: '--label',
        value: '#1a4269'
      },
      {
        label: '--text',
        value: '#000000'
      },
      {
        label: '--icons',
        value: '#1261a0'
      },
      {
        label: '--headers',
        value: '#1a4269'
      },
      {
        label: '--containers',
        value: '#ffffff'
      },
      {
        label: '--box-content',
        value: '#eeeeee'
      },
      {
        label: '--table-header-bg',
        value: '#4a4c51'
      },
      {
        label: '--table-header-text',
        value: '#ffffff'
      },
      {
        label: '--table-row-odd',
        value: '#f8f8f8'
      },
      {
        label: '--table-row-even',
        value: '#e8e8e8'
      },
      {
        label: '--table-row-hovered',
        value: '#d6d6d6'
      },
      {
        label: '--btn-bg',
        value: '#1261a0'
      },
      {
        label: '--btn-text',
        value: '#ffffff'
      },
      {
        label: '--btn-hover-bg',
        value: '#174d77'
      },
      {
        label: '--btn-hover-text',
        value: '#ffffff'
      },
      {
        label: '--disabled',
        value: '#d3d3d3'
      },
      {
        label: '--placeholder-text',
        value: '#6c757d'
      },
      {
        label: '--risk-rating-bg',
        value: '#62696e'
      },
      {
        label: '--links',
        value: '#1a4269'
      },
      {
        label: '--active',
        value: '#1a4269'
      },
      {
        label: '--footer-text',
        value: '#343a40'
      }
    ];
  }

}
