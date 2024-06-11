import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-scorecards',
  templateUrl: './scorecards.component.html',
  styleUrls: ['./scorecards.component.scss']
})

export class ScorecardsComponent implements OnInit {

  subpages = [];
  IsLandingPage: boolean;
  accord: number;
  asseturl = environment.asseturl;
  pageTitle: any;

  constructor(public router: Router, private route: ActivatedRoute){
    this.IsLandingPage = true;
  }
  
  ngOnInit(): void {
    
    this.route.parent.url.subscribe(url => {
      this.pageTitle = 'Lifecycle Scorecards';
      this.IsLandingPage = true
    });

    this.pageTitle = 'Lifecycle Scorecards';
    this.subpages = [
      {
        ActiveYN: false,
        display: true,
        displayName: 'Index History',
        route: 'IndexHistory'
      },
      {
        ActiveYN: false,
        display: true,
        displayName: 'KI Distance',
        route: 'KIDistance'
      },
      {
        ActiveYN: false,
        display: true,
        displayName: 'KO Distance',
        route: 'KODistance'
      },
      {
        ActiveYN: false,
        display: false,
        displayName: 'Greeks Aggregation Scorecard',
        route: 'GreeksAggregation'
      },
      {
        ActiveYN: false,
        display: false,
        displayName: 'Event Watch',
        route: 'EventWatch'
      },

    ];
  }

  eqchangeProduct(choice) {
    
      if (choice !== '') {
        this.IsLandingPage = false;
        this.pageTitle = choice;
        
        const pageToRoute = this.subpages.filter((res) => {
          return res.displayName === choice;
        });
        
        this.router.navigate([(pageToRoute[0].route)], { relativeTo: this.route });
      }
  }

  closeProduct(){
    this.IsLandingPage = true;
    this.pageTitle = 'Lifecycle Scorecards';
    this.router.navigate(['app/LifecycleScorecards']);
  }

}
