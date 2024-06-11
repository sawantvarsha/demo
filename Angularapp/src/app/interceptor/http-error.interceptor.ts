import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(public router: Router) { }
  errorRedirectUrls = ['.well-known/openid-configuration'];
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          console.log(err)
          if (!err.ok && err.status !== HttpStatusCode.NotFound) {
            const url: any = err.url?.replace(/http[s]:\/\/[^./]+\//g, '');
            if (this.errorRedirectUrls.includes(url))
              this.router.navigate(['error']);
          }
          console.log(err);
        }
        throw new Error(err?.message);
      })
    );
  }
}
