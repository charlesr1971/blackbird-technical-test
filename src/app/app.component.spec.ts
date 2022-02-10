import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let breakpointObservable: Subject<BreakpointState>;

  beforeEach(
    waitForAsync(() => {
      breakpointObservable = new Subject();
      const breakpointObserverFake = {
        observe: () => breakpointObservable,
      };
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule, MatToolbarModule, NoopAnimationsModule],
        declarations: [AppComponent],
        providers: [
          { provide: BreakpointObserver, useValue: breakpointObserverFake },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should complete destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'unsubscribe');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it(`should have as title 'blackbird-technical-test'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('blackbird-technical-test');
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
});
