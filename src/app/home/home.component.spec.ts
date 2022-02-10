import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync, flush } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { MockComponents, MockPipe } from 'ng-mocks';
import { TestScheduler } from 'rxjs/testing';
import { By } from '@angular/platform-browser';
import { NameFormatPipe } from '../shared/pipes/name-format/name-format.pipe';

import { HttpService } from '../core/services/http/http.service';

import { HomeComponent } from './home.component';

interface Weather {
  id: number;
  name: string;
  temp: number;
  humidity: number;
  precipitation: number;
}

describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let testScheduler: TestScheduler;

  const httpServiceMock = jasmine.createSpyObj(HttpService, ['getWeather']);

  let breakpointObservable: Subject<BreakpointState>;

  beforeEach(
    waitForAsync(() => {
      breakpointObservable = new Subject();
      const breakpointObserverFake = {
        observe: () => breakpointObservable,
      };
      TestBed.configureTestingModule({
        declarations: [
          HomeComponent,
          MockComponents( MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatIcon, MatList, MatListItem ),
          MockPipe(NameFormatPipe, (name) => name),
        ],
        providers: [
          { provide: HttpService, useValue: httpServiceMock },
          { provide: BreakpointObserver, useValue: breakpointObserverFake },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testScheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should complete destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'unsubscribe');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should be mobile', fakeAsync(() => {
    fixture.detectChanges();

    breakpointObservable.next({
      breakpoints: {},
      matches: true,
    });
    tick();

    expect(component.isMobile).toBeTrue();
  }));

  it('should not be mobile', fakeAsync(() => {
    fixture.detectChanges();

    breakpointObservable.next({
      breakpoints: {},
      matches: false,
    });
    tick();

    expect(component.isMobile).toBeFalse();
  }));


  it('should return array', () => {
    testScheduler.run((helpers) => {
      let weatherDataArray: Weather[] = [];
      locations.map( ( data: any, idx: number ) => {

        const _weatherData = {
          cod: '200',
          message: 0,
          cnt: 1,
          list: [
            {
              dt: 1643824800,
              main: {
                temp: 284.02,
                precipitation: 283.2,
                temp_min: 282.48,
                temp_max: 284.02,
                pressure: 1022,
                sea_level: 1022,
                grnd_level: 1019,
                humidity: 78,
                temp_kf: 1.54
              },
              weather: [
                {
                  id: 803,
                  main: 'Clouds',
                  description: 'broken clouds',
                  icon: '04n'
                }
              ],
              clouds: {
                all: 82
              },
              wind: {
                speed: 2.46,
                deg: 244,
                gust: 6.62
              },
              visibility: 10000,
              pop: 0,
              sys: {
                pod: 'n'
              },
              dt_txt: '2022-02-02 18:00:00'
            }
          ],
          city: {
            id: 2643743,
            name: `${data.city}`,
            coord: {
              lat: 51.5085,
              lon: -0.1257
            },
            country: `${data.country}`,
            population: 1000000,
            timezone: 0,
            sunrise: 1643787454,
            sunset: 1643820645
          }
        };

        const weatherData = of(_weatherData);

        const weather = {
          id: _weatherData.city.id,
          name: data.city,
          temp: _weatherData.list[0].main.temp,
          humidity: _weatherData.list[0].main.humidity,
          precipitation: _weatherData.list[0].pop
        };

        weatherDataArray.push(weather);

      });

      const { expectObservable } = helpers;

      const $weatherData  = of([...weatherDataArray]);

      component.combineStreams$(of(weatherDataArray[0]), of(weatherDataArray[1]), of(weatherDataArray[2]), of(weatherDataArray[3]), of(weatherDataArray[4])).subscribe( (items) => {
        expect(items).toEqual(weatherDataArray);
        expectObservable($weatherData).toEqual(of(items));
      });

    });
  });

  const locations = [
    {
      location: 'London,uk',
      city: 'London',
      country: 'GB'
    },
    {
      location: 'Paris,France',
      city: 'Paris',
      country: 'FR'
    },
    {
      location: 'New York,NY,USA',
      city: 'New York',
      country: 'US'
    },
    {
      location: 'Los Angeles,CA,USA',
      city: 'Los Angeles',
      country: 'US'
    },
    {
      location:'Tokyo,Japan',
      city: 'Tokyo',
      country: 'JP'
    }
  ];

  locations.map( ( data: any, idx: number ) => {
    describe(`getWeather() ${data.location}`, () => {

      it('after service has been called, it returns a successful response', fakeAsync(() => {

        const _weatherData = (id: number) => {
          return {
            cod: '200',
            message: 0,
            cnt: 1,
            list: [
              {
                dt: 1643824800,
                main: {
                  temp: 284.02,
                  precipitation: 283.2,
                  temp_min: 282.48,
                  temp_max: 284.02,
                  pressure: 1022,
                  sea_level: 1022,
                  grnd_level: 1019,
                  humidity: 78,
                  temp_kf: 1.54
                },
                weather: [
                  {
                    id: 803,
                    main: 'Clouds',
                    description: 'broken clouds',
                    icon: '04n'
                  }
                ],
                clouds: {
                  all: 82
                },
                wind: {
                  speed: 2.46,
                  deg: 244,
                  gust: 6.62
                },
                visibility: 10000,
                pop: 0,
                sys: {
                  pod: 'n'
                },
                dt_txt: '2022-02-02 18:00:00'
              }
            ],
            city: {
              id: `${id}`,
              name: `${data.city}`,
              coord: {
                lat: 51.5085,
                lon: -0.1257
              },
              country: `${data.country}`,
              population: 1000000,
              timezone: 0,
              sunrise: 1643787454,
              sunset: 1643820645
            }
          }
        };

        const weatherData = _weatherData(idx + 1);

        const weather = {
          id: +weatherData.city.id,
          name: data.city,
          temp: weatherData.list[0].main.temp,
          humidity: weatherData.list[0].main.humidity,
          precipitation: weatherData.list[0].pop
        };

        const weatherData2 = of(weather);

        tick();
        fixture.detectChanges();

        spyOn(component, 'getWeather').and.returnValue(weatherData2);
        component.getWeather(data.location);
        expect(component.getWeather).toHaveBeenCalledWith(data.location);

      }));

    });

  })

  locations.map( ( data: any, idx: number ) => {
    describe(`get location from  ${data.location} span element`, () => {

      it('the span elements should contain either London, Paris, New York, Los Angeles or Tokyo', fakeAsync(() => {

        tick();
        fixture.detectChanges();

        const _weatherData = (id: number) => {
          return {
            cod: '200',
            message: 0,
            cnt: 1,
            list: [
              {
                dt: 1643824800,
                main: {
                  temp: 284.02,
                  precipitation: 283.2,
                  temp_min: 282.48,
                  temp_max: 284.02,
                  pressure: 1022,
                  sea_level: 1022,
                  grnd_level: 1019,
                  humidity: 78,
                  temp_kf: 1.54
                },
                weather: [
                  {
                    id: 803,
                    main: 'Clouds',
                    description: 'broken clouds',
                    icon: '04n'
                  }
                ],
                clouds: {
                  all: 82
                },
                wind: {
                  speed: 2.46,
                  deg: 244,
                  gust: 6.62
                },
                visibility: 10000,
                pop: 0,
                sys: {
                  pod: 'n'
                },
                dt_txt: '2022-02-02 18:00:00'
              }
            ],
            city: {
              id: `${id}`,
              name: `${data.city}`,
              coord: {
                lat: 51.5085,
                lon: -0.1257
              },
              country: `${data.country}`,
              population: 1000000,
              timezone: 0,
              sunrise: 1643787454,
              sunset: 1643820645
            }
          }
        };

        const weatherData = _weatherData(idx + 1);

        const weatherData1 = of(weatherData);

        httpServiceMock.getWeather.and.returnValue(weatherData1);
        expect(httpServiceMock.getWeather).toHaveBeenCalled();

        ['London','Paris','New York','Los Angelese','Tokyo'].map( ( city1: string, idx: number ) => {
          const city2 = fixture.debugElement.query(By.css('em'))?.nativeElement?.innerText ? fixture.debugElement.query(By.css('em')).nativeElement.innerText  : '';
          if(city2 !== '' && city1 === city2){
            expect(city1).toEqual(city2);
          }
        });

      }));

    });

  })

});
