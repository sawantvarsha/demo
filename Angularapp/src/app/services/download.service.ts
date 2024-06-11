import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  constructor(public http: HttpClient) {}
  download(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob',
    });
  }
  downloadPDF(url: string): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(url, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }
  downloadWithProgress(url: string) {
    return this.http.get(url, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }
}
