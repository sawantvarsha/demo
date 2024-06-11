import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HttpCSRFInterceptor implements HttpInterceptor {
  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // let newRequest = req.clone({
    //   withCredentials: true,
    // });

    const cookieheaderName = 'X-XSRF-TOKEN'; //removed commented line || KaustubhS || 09-Oct-2023
    let csrfToken = this.tokenExtractor.getToken() as string;
    // console.log(csrfToken);
    if (csrfToken !== null && !req.headers.has(cookieheaderName)) {
      req = req.clone({
        withCredentials: true,
        headers: req.headers.set(cookieheaderName, csrfToken),
      });
    }
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      })
    );
  }
}
