import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user-list-header',
  template: `<div class="user-list-header-label">User Management</div>`,
  styleUrls: ['./user-list-header.component.css'],
})

//This HeaderComponent simply provides the template (html) for the list user header
export class UserListHeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
