import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IBreadCrumb } from './breadcrumb.interface';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { CommonApiService } from 'src/app/services/common-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-route-history',
  templateUrl: './route-history.component.html',
  styleUrls: ['./route-history.component.scss']
})
export class RouteHistoryComponent implements OnInit, OnDestroy {
  public breadcrumbs: IBreadCrumb[];
  public routeHistory: IBreadCrumb[];
  menuSubscription: Subscription;
  isMenuCollapsed: any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, public commonApi: CommonApiService) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    this.routeHistory = [];
  }

  ngOnDestroy() {
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
      this.menuSubscription = null;
    }
  }
  ngOnInit(): void {
    this.menuSubscription = this.commonApi.hideMenuObs.subscribe((res) => {
      this.isMenuCollapsed = res;
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), distinctUntilChanged()).subscribe((_event) => {
      this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
      this.routeHistory.push(this.breadcrumbs[0]);
      console.log('BreadCrumbs', this.breadcrumbs);
      console.log('Route History', this.routeHistory);
    });
  }
  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {
    // If no routeConfig is avalailable we are on the root path
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
    let isClickable = route.routeConfig && route.routeConfig.data && route.routeConfig.data.isClickable;
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      label = route.snapshot.data.breadcrumb === '' ? route.snapshot.params[paramName] : route.snapshot.data.breadcrumb;
      isClickable = route.routeConfig && route.routeConfig.data && route.routeConfig.data.isClickable;
      // label = route.snapshot.params[paramName];
    }

    // In the routeConfig the complete path is not available,
    // so we rebuild it each time
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: IBreadCrumb = {
      label: label,
      url: nextUrl,
      isClickable
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      //If we are not on our current path yet,
      //there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
