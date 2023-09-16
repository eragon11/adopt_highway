import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../auth/_services';

@Component({
  selector: 'app-logout',
  template: ` <p>&nbsp;</p> `,
  styles: [],
})
export class LogoutComponent implements OnInit {
  constructor(private readonly authService: AuthenticationService) {
    // no implementation
  }

  ngOnInit(): void {
    console.log('Logging out...');
    this.authService.logout();
  }
}
