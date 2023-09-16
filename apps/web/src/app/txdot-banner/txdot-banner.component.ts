import { Component, OnInit } from '@angular/core';
import { environment } from './../../environments/environment';

@Component({
  selector: 'header',
  templateUrl: './txdot-banner.component.html',
  styleUrls: ['./txdot-banner.component.css'],
})
export class TxdotBannerComponent implements OnInit {
  env = environment;
  environmentBannerColor = 'red';
  isProd = false;
  environment = '';
  txdot_banner_top = '0';
  env_array = [
    {
      env: ['development', 'dev'],
      env_color: 'green',
      env_name: 'Development Environment',
    },
    { env: ['sit'], env_color: 'green', env_name: 'SIT' },
    {
      env: ['testing', 'uat'],
      env_color: 'yellow',
      env_name: 'Test Environment',
    },
    {
      env: ['pre-prod', 'preprod'],
      env_color: 'red',
      env_name: 'Pre-Production Environment',
    },
  ];

  ngOnInit(): void {
    const localEnvironment = this.env.nodeEnv ?? 'production';
    let selectedEnvironment;
    if (
      ['prod', 'production', 'pre-prod', 'preprod'].includes(localEnvironment)
    ) {
      this.isProd = true;
    } else {
      this.txdot_banner_top = '25px';
      this.env_array.forEach(function (env) {
        if (env.env.includes(localEnvironment.toLowerCase())) {
          selectedEnvironment = env;
        }
      });

      this.environment = selectedEnvironment.env_name;
      this.environmentBannerColor = selectedEnvironment.env_color;
    }
  }
}
