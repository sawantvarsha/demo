import { Injectable } from '@angular/core';
import {
  ChartPalette,
  RedPallete,
  pastel,
  vibrant,
} from './chart.module';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
//Changes done by Shekhar L || 25-Sep-2023 || START
export class ChartService {
  private active: ChartPalette = vibrant;//Changed the default color pallete to vibrant as suggested by Nitish K || 13-Oct-2023

  private availablePalettes: ChartPalette[] = [
    pastel,
    vibrant,
    RedPallete,
    
  ];

  constructor() { }

  palette = new BehaviorSubject(sessionStorage.getItem('activePalette') || 'vibrant');//Changed the default color pallete to vibrant as suggested by Nitish K || 13-Oct-2023
  paletteObs = this.palette.asObservable();

  paletteEmit = new BehaviorSubject(
    sessionStorage.getItem('activePalette') || 'vibrant'//Changed the default color pallete to vibrant as suggested by Nitish K || 13-Oct-2023
  );
  //Changes done by Shekhar L || 25-Sep-2023 || END
  paletteEmitObs = this.paletteEmit.asObservable();

  getAvailablePalettes(): ChartPalette[] {
    return this.availablePalettes;
  }

  getActivePalette(): ChartPalette {
    return this.active;
  }

  getPallete(palleteName: any) {
    return this.availablePalettes.find(p => p.name === palleteName);
  }
  setActivePalette(palette: ChartPalette): void {
    this.active = palette;
    sessionStorage.setItem('activePalette', palette.name);
    Object.keys(this.active.colors).forEach((property) => {
      document.documentElement.style.setProperty(
        property,
        this.active.colors[property]
      );
    });
  }
}
