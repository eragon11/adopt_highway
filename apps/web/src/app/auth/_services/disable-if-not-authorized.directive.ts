import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '.';
import { PermissionsService } from './permissions.service';

@Directive({
  selector: '[disableIfNotAuthorized]'
})
export class DisableIfNotAuthorizedDirective implements OnInit {

  constructor(
    private element: ElementRef,
    private permissions: PermissionsService,
    private auth: AuthenticationService
  ) { }

  @Input() action: string;
  @Input() resource: string;

  ngOnInit() {
    this.auth.getUserValue().subscribe((data) => {
      this.permissions.isAuthorized(this.resource, this.action) ? 
      this.element.nativeElement.style.display="block": this.element.nativeElement.style.display = "none"
    });

  }
}
