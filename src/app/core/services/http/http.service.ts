import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  endpoint = 'https://api.openweathermap.org/data/2.5/forecast?cnt=1&q=';
  apiKey = 'aee8982df68e487a7878e769e4e4ec08';

  constructor(
    private http: HttpClient
  ) { }

  getWeather(location: string) {

    const apiUrl = `${this.endpoint}${location}&appid=${this.apiKey}`;

    return this.http.get<any>(apiUrl).pipe(
      catchError((error) => {
        console.log('HttpService: getWeather: error: ', error); // normally this would be passed to a centralised logService that would act as a wrapper around the console
        return throwError(() => error);
      })
    );

  }

}
