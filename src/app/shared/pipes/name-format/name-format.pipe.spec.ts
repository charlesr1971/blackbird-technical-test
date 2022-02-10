import { TestBed } from '@angular/core/testing';
import { NameFormatPipe } from './name-format.pipe';

describe('NameFormatPipe', () => {

  let pipe: NameFormatPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NameFormatPipe],
    });
    pipe = TestBed.inject(NameFormatPipe);
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

      it('transform name', () => {
        const name = data.city;
        const result = data.city.replace(/[\s]+/gi,'-').toLowerCase().trim();

        expect(pipe.transform(name)).toBe(result);
      });

    });
  });

});
