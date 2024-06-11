import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class FontModule { }

export interface Font {
  name: string;
  properties: any;
}

export const montserrat: Font = {
  name: 'montserrat',
  properties: {
    '--font-primary': 'Montserrat',
    '--font-secondary': 'Montserrat',
  }
};

export const opensans: Font = {
  name: 'opensans',
  properties: {
    '--font-primary': 'Opensans',
    '--font-secondary': 'Opensans',
  }
};
export const biosans: Font = {
  name: 'biosans',
  properties: {
    '--font-primary': 'bio-sans, sans-serif',
    '--font-secondary': 'bio-sans, sans-serif',
  }
};
export const roboto: Font = {
  name: 'roboto',
  properties: {
    '--font-primary': 'Roboto',
    '--font-secondary': 'Roboto',
  }
};

export const client: Font = {
  name: 'client',
  properties: {
    '--font-primary': 'Client',
    '--font-secondary': 'Client',
  }
};