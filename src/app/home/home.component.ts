import { Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, Subject, EMPTY, combineLatest, of, from } from 'rxjs';
import { takeUntil, map, catchError, concatMap  } from 'rxjs/operators';

import { HttpService } from '../core/services/http/http.service';

interface Weather {
  id: number;
  name: string;
  temp: number;
  humidity: number;
  precipitation: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  isMobile = false;

  $weatherData1!: Observable<Weather>;
  $weatherData2!: Observable<Weather>;
  $weatherData3!: Observable<Weather>;
  $weatherData4!: Observable<Weather>;
  $weatherData5!: Observable<Weather>;

  $weatherDataArray!: Observable<Weather>[];
  $weatherData!: Observable<Weather[]>;

  readonly destroy$ = new Subject<void>();

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    public elementRef: ElementRef,
    private httpService: HttpService,
    private titleService: Title
  ) {

    this.setTitle('Weather App Home');

  }

  /**
   *
   * @param new title
   * Description:
   *
   * Set page title for accessibility purposes
   *
   * @returns {<void>}
   */
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  /**
   *
   * Description:
   *
   * ANGULAR LIFE CYCLE METHOD: ngOnInit
   *
   * @returns {<void>}
   */
  ngOnInit() {

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this.destroy$))
      .subscribe((breakpointState: BreakpointState) => {
        this.isMobile = breakpointState.matches;
      });

      setTimeout(() => {

        this.$weatherData1 = this.getWeather('London,uk');
        this.$weatherData2 = this.getWeather('Paris,France');
        this.$weatherData3 = this.getWeather('New York,NY,USA');
        this.$weatherData4 = this.getWeather('Los Angeles,CA,USA');
        this.$weatherData5 = this.getWeather('Tokyo,Japan');

        this.$weatherDataArray = [
          this.$weatherData1,
          this.$weatherData2,
          this.$weatherData3,
          this.$weatherData4,
          this.$weatherData5
        ];

        this.$weatherData = this.combineStreams$(...this.$weatherDataArray);

      });

  }

  /**
   *
   * @param observable streams to combine
   * Description:
   *
   * Returns a combined observable stream as an array of Weather items
   * Added to wrapper method, so that unit tests can use the combineLatest operator
   *
   * @returns {Observable<Weather[]>}
   */
  combineStreams$(...streams: Observable<Weather>[]): Observable<Weather[]> {
    return combineLatest(streams);
  }

  /**
   *
   * @param geographical location
   * Description:
   *
   * Get weather using an observable
   *
   * @returns {Observable<Weather>}
   */
  getWeather(location: string): Observable<Weather> {
    return this.httpService.getWeather(location).pipe(
      map( (weatherData: any) => {
        return {
          id: weatherData.city.id,
          name: weatherData.city.name,
          temp: weatherData.list[0].main.temp,
          humidity: weatherData.list[0].main.humidity,
          precipitation: weatherData.list[0].pop
        }
      }),
      catchError((error, caught) => {
        console.log('HomeComponent: getWeather: error: ', error); // normally this would be passed to a centralised logService that would act as a wrapper around the console
        return EMPTY;
      })
    );
  }

  /**
   *
   * Description:
   *
   * ANGULAR LIFE CYCLE METHOD: ngOnDestroy
   *
   * @returns {<void>}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    // no need to unsubscribe the $weatherData observables, as the async pipe will do this automatically
  }

}
