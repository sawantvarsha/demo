import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ChartModule { }


export interface ChartPalette {
  name: string;
  colors: any;
}

export const pastel: ChartPalette = {
  name: 'pastel',
  colors: [
    '#dfc2e4',
    '#fbe19f',
    '#9ad3f0',
    '#bce4b1',
    '#ed7d31',
    '#a5a5a5',
    '#619010',
    '#388a90',
    '#6143b7',
    '#a3085f',
    '#85593d',
    '#878787',
    '#b19c0c',
  ],
}

export const vibrant: ChartPalette = {
  name: 'vibrant',
  colors: [
    '#435EBE',
    '#06928F',
    '#FE9327',
    '#FFCA33',
    '#5AC8FA',
    '#AF52DE',
    '#34C759',
    '#FF3B30',
    
  ],
}

export const RedPallete: ChartPalette = {
  name: 'RedPallete',
  colors: [
    "#FF0B0B",   
    "#FF4B4B",   
    "#FF8181",    
    "#FFB4B4",
    "#FF9B9B",
    "#FFCDCD",
    "#FF6666",
    "#FFE6E6",
    "#FF2F2F",
  ],
}

export const BluePallete: ChartPalette = {
  name: 'Blue',
  colors: [
    "#D9EEF3",
    "#E4F3F6",
    "#F0F8FA",
    "#F9FCFD", 
  ],
}

export const BlackPallete: ChartPalette = {
  name: 'Black',
  colors: [
    "#000000",
    "#131313",
    "#2F2F2F",
    "#666666",
    "#818181",
    "#9B9B9B",
    "#B4B4B4",
    "#CDCDCD",
    "#E6E6E6",    
  ],
}