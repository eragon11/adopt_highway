import { Injectable, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  public sideNavToggleSubject: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
  ) { }

  toggleSideNav () {
    return this.sideNavToggleSubject.next('toggle');
  }

  closeSideNav () {
    this.sideNavToggleSubject.next('close');
  }
  
}
