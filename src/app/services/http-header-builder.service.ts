import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpHeaderBuilderService {
  private headers: HttpHeaders = new HttpHeaders();

  constructor() {};

  addContentType(): HttpHeaderBuilderService {
    this.headers = this.headers.set('Content-Type', 'application/json');
    return this;
  }

  build(): HttpHeaders {
    return this.headers;
  }
}
