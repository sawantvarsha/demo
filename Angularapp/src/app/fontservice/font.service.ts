import { Injectable } from '@angular/core';
import { Font, roboto, client } from './font.module';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//Changes done by Shekhar L || 25-Sep-2023 || START
export class FontService {

  private active: Font = client;

  font = new BehaviorSubject(sessionStorage.getItem('activeFont') || 'client');
  fontObs = this.font.asObservable();

  fontEmit = new BehaviorSubject(sessionStorage.getItem('activeFont') || 'client');
  fontEmitObs = this.fontEmit.asObservable();
//Changes done by Shekhar L || 25-Sep-2023 || END
  constructor() { }


  setActiveFont(font: Font): void {
    this.active = font;
    sessionStorage.setItem('activeFont', font.name);
    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
  }
}
