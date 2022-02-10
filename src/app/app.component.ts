import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'weather-app';
  mobileQuery: MediaQueryList;
  isMobile = false;

  private mobileQueryListener: () => void;

  private destroy$ = new Subject<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private readonly breakpointObserver: BreakpointObserver,
    private media: MediaMatcher
  ) {

    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);

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
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}

