import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  postData(url: any, body: any, headers?: any): Observable<any> {
    const httpOptions = {
      ...(headers ? {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: `Bearer ${headers.token}`
        })
      } : {})
    };
return this.http.post(
  url,
  body,
  httpOptions
)
  }

}
