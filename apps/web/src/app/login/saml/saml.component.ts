import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-saml',
  template: `
  `,
  styles: [
  ]
})
export class SamlComponent implements OnInit {

  constructor() {
    console.log("In SAML component")
    window.location.replace(environment.SAMLUrl)
  }

  ngOnInit(): void {
  }

}
