import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/_services';

@Component({
  templateUrl: './not-logged-in.component.html',
  styleUrls: ['./not-logged-in.component.css'],
})
export class NotLoggedInComponent {
  @Output() showPage = true;

  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router,
  ) {
    const user = this.authService.userSubject$;
    console.log(`user in not logged in: ${JSON.stringify(user.getValue)}`);
    if (user.getValue() !== null) {
      this.showPage = false;
      this.router.navigate(['/map']);
    }
  }
}
