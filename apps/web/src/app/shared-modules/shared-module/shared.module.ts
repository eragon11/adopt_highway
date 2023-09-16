/* eslint-disable prettier/prettier */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavToggleComponent } from 'src/app/sidenav/sidenav-toggle/sidenav-toggle.component';
import { DisableIfNotAuthorizedDirective } from 'src/app/auth/_services/disable-if-not-authorized.directive';



@NgModule({
  declarations: [
    SidenavToggleComponent,
    DisableIfNotAuthorizedDirective
  ],
  exports: [
    SidenavToggleComponent,
    DisableIfNotAuthorizedDirective
  ],
  imports: [
    CommonModule,
  ]
})
export class SharedModule { }
