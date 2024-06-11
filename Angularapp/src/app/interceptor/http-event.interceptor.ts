import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponseBase,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HttpEventInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  private readonly logOnUrl = 'Login?ReturnUrl='.toLowerCase();
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let newRequest = req.clone({
      withCredentials: true,
    });

    return next.handle(newRequest).pipe(
      map((event: any) => {
        if (event instanceof HttpResponseBase) {
          const response = event as HttpResponseBase;
          if (
            response &&
            response.ok &&
            response.url &&
            response.url.toLowerCase().indexOf(this.logOnUrl) >= 0
          ) {
            const queryStringIndex = response.url.indexOf('?');
            const loginUrl =
              queryStringIndex && queryStringIndex > 0
                ? response.url.substring(0, queryStringIndex)
                : response.url;
            console.log(
              'User logout detected, redirecting to login page: %s',
              loginUrl
            );
            window.location.href =
              loginUrl +
              '?ReturnUrl=' +
              window.location.origin +
              '/app/dashboard';
          }
        }

        return event;
      }),
      catchError(
        (
          httpErrorResponse: HttpErrorResponse,
          _: Observable<HttpEvent<any>>
        ) => {
          const response = httpErrorResponse as HttpResponseBase;
          if (
            response &&
            !response.ok &&
            response.url &&
            response.url.toLowerCase().indexOf(this.logOnUrl) >= 0
          ) {
            const queryStringIndex = response.url.indexOf('?');
            const loginUrl =
              queryStringIndex && queryStringIndex > 0
                ? response.url.substring(0, queryStringIndex)
                : response.url;
            console.log(
              'User logout detected, redirecting to login page: %s',
              loginUrl
            );
            window.location.href =
              loginUrl +
              '?ReturnUrl=' +
              window.location.origin +
              '/app/dashboard';
          }
          return throwError(httpErrorResponse);
        }
      )
    );
  }
}
