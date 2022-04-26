import { Component, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,

  ) { }

  typesOfShoes: string[] = ['Profile', 'Logout'];
  width: number;
  selectedOptions: string;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = window.innerWidth;
  }

  list: boolean = false;

  showHideList() {
    this.list = !this.list
  }

  onChange(change) {
    console.log(change.option.value, change.option.selected);
    if (change.option.value == 'Logout') {
      // this.logout()
    }
  }

  gotopage(param) {

  }
}
