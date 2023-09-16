import { Component, OnInit } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import * as query from '@arcgis/core/rest/query';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-agreements-signed',
  templateUrl: './new-agreements-signed.component.html',
  styleUrls: ['./new-agreements-signed.component.css'],
})
export class NewAgreementsSignedComponent implements OnInit {
  constructor() {
    this.setQueryTask();
  }

  setQueryTask() {
    console.log('setquerytask');
    const aahAgreementFsURL = environment.aahAgreementFS;
    const aahAgreementFL = new FeatureLayer({ url: aahAgreementFsURL });

    const agreementQuery = aahAgreementFL.createQuery();
    agreementQuery.returnGeometry = false;
    agreementQuery.outFields = ['*'];
    agreementQuery.where =
      'EXTRACT(MONTH FROM BEGIN_DATE) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM BEGIN_DATE) = EXTRACT(YEAR FROM CURRENT_DATE)';
    // Return all cities with a population greater than 1 million
    // When resolved, returns features and graphics that satisfy the query.
    aahAgreementFL.queryFeatures(agreementQuery).then(function (results) {
      console.log(results.features);
    });

    // // When resolved, returns a count of the features that satisfy the query.
    // const t = query
    //   .executeForCount(aahAgreementFsURL, agreementQuery)
    //   .then(function (result) {
    //     console.log('Count:', result);
    //     document.getElementById('AgreementNumberSigned').innerHTML =
    //       '0' + result;
    //     return t;
    //   });

    // console.log('setquerytask1');
    // let AgreeementsLayerUrl1 = environment.aahAgreementFS;
    // let queryTask1 = new QueryTask({
    //   url: AgreeementsLayerUrl1,
    // });
    // var query1 = new query();
    // query1.returnGeometry = false;
    // query1.outFields = ['*'];
    // query1.where =
    //   'EXTRACT(MONTH FROM BEGIN_DATE) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM BEGIN_DATE) = EXTRACT(YEAR FROM CURRENT_DATE)';

    // queryTask1.execute(query).then(function (results) {
    //   console.log(results.features);
    // });

    // // When resolved, returns a count of the features that satisfy the query.
    // let t1 = queryTask1.executeForCount(query1).then(function (result) {
    //   console.log('Count:', ((result / 30) * 100).toFixed(2));
    //   document.getElementById('AgrementPercentageSigned').innerHTML =
    //     '+' + ((result / 30) * 100).toFixed(2) + '%';
    //   return t1;
    // });
  }

  ngOnInit(): void {}
}
