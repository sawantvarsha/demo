import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { WorkbenchLinksService } from 'src/app/services/workbench-links.service';

@Component({
  selector: 'app-underlying-prices',
  templateUrl: './underlying-prices.component.html',
  styleUrls: ['./underlying-prices.component.scss'],
})
export class UnderlyingPricesComponent implements OnInit {
  @Input('NMID') NMID;

  constructor(
    public workbenchLinksApi: WorkbenchLinksService,
    public datePipe: DatePipe
  ) {}

  ngOnInit(): void {}

  async getUnderlyingPrices() {}
}
