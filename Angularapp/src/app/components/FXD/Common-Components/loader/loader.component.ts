import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  isProd= environment.production;
  constructor() { }

  ngOnInit(): void {
    // console.log('In LoaderComponent');
  }

}
