import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(
    private http: HttpClient
  ) { }

  postData(frmData:any){
    return this.http.post('https://r7fekl6mzegp2rrrcp26ch47hq0srobg.lambda-url.us-east-1.on.aws/', frmData)
                    .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    return throwError(error || 'Server Error');
  }
}
