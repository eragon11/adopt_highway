import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../sidenav.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidenav-toggle',
  template: `
    <button (click)="toggleNav()" title="Open Side Menu" tabindex="0">
        <img [src]="env.map_banner_sidenavHamburger_white" id="sidenavImg" class="headerImgs"
            alt="Open/Close Side Menu">
    </button>
  `,
  styles: [`
    .headerImgs {
      height: 40px;
      width: 40px;
      padding: 5px
    }
  `
  ]
})
export class SidenavToggleComponent implements OnInit {

  constructor(
    private sideNavService: SidenavService
  ) { }

  env = environment;

  ngOnInit(): void {
  }

  
  toggleNav() {
    console.log(`toggle nav`)
    this.sideNavService.toggleSideNav();
  }

}
