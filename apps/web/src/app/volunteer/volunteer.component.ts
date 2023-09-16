import { Component, OnInit, Output } from '@angular/core';
import { User } from '../auth/_models';
import { AuthenticationService } from '../auth/_services';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.css'],
})
export class VolunteerComponent implements OnInit {
  data: User;

  constructor(public auth: AuthenticationService) {
    console.log('*** VOLUNTEER');
  }

  ngOnInit(): void {
    this.auth.getUserValue().subscribe((data) => {
      this.data = data;
    });
  }
}
