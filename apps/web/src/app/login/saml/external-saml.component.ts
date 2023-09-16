import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ext-saml',
  template: ``,
  styles: [],
})
export class SamlExternalComponent implements OnInit {
  constructor() {
    window.location.replace(environment.SAMLExternalUrl);
  }

  ngOnInit(): void {}
}
