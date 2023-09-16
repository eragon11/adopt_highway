import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})

// The UsersComponent class is really just to create the framework for the rest of the
// user managment pages. The template creates the html for the sidenav and the router outlet
// for the remaining pages that will be developed
export class UsersComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
