import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { HttpService } from './http.service';

describe('HttpService', () => {

  let service: HttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpService
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

  locations.map( ( data: any ) => {
    describe(`getWeather() ${data.location}`, () => {

      const endpoint = 'https://api.openweathermap.org/data/2.5/forecast?cnt=1&q=';
      const apiKey = 'aee8982df68e487a7878e769e4e4ec08';
      const apiUrl = `${endpoint}${data.location}&appid=${apiKey}`;

      const apiResponse: any = {
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

      it('should return values on success', fakeAsync(() => {
        service.getWeather(`${data.location}`).subscribe((response: any) => {
          expect(response).toEqual(apiResponse);
        });

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('GET');

        req.flush(apiResponse);
        flush();
      }));

      it('error', fakeAsync(() => {
        const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
        const error = { message: 'error message' };

        service.getWeather(`${data.location}`).subscribe(
          {
            next: () => {
              fail('error should have been thrown');
            },
            error: (err) => {
              expect(err.status).toEqual(mockErrorResponse.status);
              expect(err.error).toEqual(error);
            }
          }
        );

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('GET');
        req.flush(error, mockErrorResponse);
        flush();
      }));

    });

  })

});
