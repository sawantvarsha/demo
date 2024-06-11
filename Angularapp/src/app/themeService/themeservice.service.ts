import { Injectable } from '@angular/core';
// import { Theme, dark, light } from '../models/theme';
import {
  Theme,
  light,
  dark,
  midnight,
  coral,
  stanhope,
  neu_dark,
  neu_light,
  BankTheme_1,
} from './theme.module';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
//Changes done by Shekhar L || 25-Sep-2023 || START
export class ThemeserviceService {
  private active: Theme = BankTheme_1;
  private availableThemes: Theme[] = [
    dark,
    light,
    midnight,
    coral,
    stanhope,
    neu_dark,
    neu_light,
    BankTheme_1,
  ];

  theme = new BehaviorSubject(sessionStorage.getItem('activeTheme') || 'BankTheme_1');
  themeObs = this.theme.asObservable();

  themeEmit = new BehaviorSubject(
    sessionStorage.getItem('activeTheme') || 'BankTheme_1'
  );
  themeEmitObs = this.themeEmit.asObservable();
//Changes done by Shekhar L || 25-Sep-2023 || END
  constructor() {}

  getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  getActiveTheme(): Theme {
    return this.active;
  }

  isdarkTheme(): boolean {
    return this.active.name === dark.name;
  }

  setdarkTheme(): void {
    this.setActiveTheme(dark);
    // this.theme.next('dark');
  }

  setlightTheme(): void {
    this.setActiveTheme(light);
    // this.theme.next('stanhope');
  }

  setmidnightTheme(): void {
    this.setActiveTheme(midnight);
    // this.theme.next('midnight');
  }

  setActiveTheme(theme: Theme): void {
    this.active = theme;
    sessionStorage.setItem('activeTheme', theme.name);
    //Added by Uddesh on 10 Feb, 2022 for pdf generation of dashboard 
    sessionStorage.setItem('bgcolor', theme.properties["--main-bg-color"])
    Object.keys(this.active.properties).forEach((property) => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
  }
}
