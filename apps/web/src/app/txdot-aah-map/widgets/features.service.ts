import { Injectable, OnInit } from '@angular/core';
import * as watchUtils from '@arcgis/core/core/watchUtils.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import MapView from '@arcgis/core/views/MapView';
import { environment } from 'src/environments/environment';
import { PermissionsService } from 'src/app/auth/_services/permissions.service';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  private _featureGraphics: Array<Graphic> = [];
  constructor(private permissions: PermissionsService) {}

  queryAndSetFeatures(aahlayer: FeatureLayer, view: MapView) {
    //setup the where clause per role. Should return nothing if all features are allowed
    const showAllStatuses = true;
    const whereClause = this.permissions.getSegmentFilterWhereClause(showAllStatuses);

    const districtFieldName = environment.districtAbbreviatedFieldName;
    const segmentFieldName = environment.segmentStatusFieldName;
    const countyFieldName = environment.countyCountyFieldName;
    const routeFieldName = environment.routeFeatureSrvName;
    const maintOfficeFieldName = environment.maintOfficeFieldName;
    const tempGraphics: Array<Graphic> = [];
    const outfields = `"${districtFieldName}","${segmentFieldName}","${countyFieldName}","${routeFieldName}","${maintOfficeFieldName}"`;
    aahlayer.definitionExpression = whereClause;

    // Recursive function - Handles calling the service multiple times if necessary.
    function _getAllFeaturesRecursive(rlayer: FeatureLayer, featuresSoFar) {
      const query = rlayer.createQuery();
      query.start = featuresSoFar.length;
      query.num = rlayer.capabilities.query.maxRecordCount;
      //this will filter the features returned by the query
      query.where = whereClause;
      query.outFields = [outfields];
      return rlayer.queryFeatures(query).then((results) => {
        // If "exceededTransferLimit" is true, then make another request (call
        // this same function) with a new "start" position. If not, we're at the end
        // and we should just concatenate the results and return what we have.
        if (
          results.exceededTransferLimit &&
          results.exceededTransferLimit === true
        ) {
          tempGraphics.push(...tempGraphics, ...results.features);
          return _getAllFeaturesRecursive(rlayer, [
            ...featuresSoFar,
            ...results.features,
          ]);
        } else {
          // The queryFeatures returns a FeatureSet which we get from the response
          // The respons.features returns an array of Graphics which have all the info we need
          tempGraphics.push(...tempGraphics, ...results.features);
          return tempGraphics;
        }
      });
    }

    view
      .whenLayerView(aahlayer)
      .then((layerview) => {
        return watchUtils
          .whenFalseOnce(layerview, 'updating')
          .then((layerview) => {
            return _getAllFeaturesRecursive(aahlayer, []);
          });
      })
      .then((graphics) => {
        // console.warn(`adding graphics to the map: ${graphics.length}`)
        //set the private var with the Graphics Array so we can use later
        this._featureGraphics = graphics;
        const values = graphics.map((feature) => {
          return feature.attributes;
        });
        console.warn(
          `Returned from features query with count: ${this._featureGraphics.length}`,
        );
        //Since we are querying all of the features from the FeatureLayer, we will have duplicates
        const uniqueDistricts = [];
        const uniquecounties = [];
        const uniqueSegments = [];
        const districtFieldName = environment.districtAbbreviatedFieldName;
        const segmentFieldName = environment.segmentStatusFieldName;
        const countyFieldName = environment.countyCountyFieldName;

        values.forEach(function (item) {
          const district = item[districtFieldName];
          const county = item[countyFieldName];
          const segment = item[segmentFieldName];
          //console.log("befaore val: " + val)
          if (
            (uniqueDistricts.length < 1 ||
              uniqueDistricts.indexOf(district) === -1) &&
            district !== '' &&
            district !== null
          ) {
            uniqueDistricts.push(district);
          }
          if (
            (uniqueSegments.length < 1 ||
              uniqueSegments.indexOf(segment) === -1) &&
            segment !== '' &&
            segment !== null
          ) {
            uniqueSegments.push(segment);
          }
          if (
            (uniquecounties.length < 1 ||
              uniquecounties.indexOf(county) === -1) &&
            county !== '' &&
            county !== null
          ) {
            uniquecounties.push(county);
          }
        });

        uniqueDistricts.sort();
        uniqueSegments.sort();
        uniquecounties.sort();
        const districtSelectID = environment.districtSelectBoxId;
        //get the select box so we can populate it
        const districtSelectBox = document.getElementById(
          districtSelectID,
        ) as HTMLSelectElement;
        //remove elements if there are any
        districtSelectBox.length = 1;
        uniqueDistricts.forEach(function (value) {
          //create an option element to add to the select box
          const option = document.createElement('option');
          //need to check if there is an entry in the environment.ts file for a more user freindly name.
          //This is primarily used for District since the FeatureLayer only has the District abbreviated name.
          if (typeof environment[value] === 'undefined') {
            option.text = value;
          } else {
            option.text = environment[value];
          }
          option.value = value;
          districtSelectBox.appendChild(option);
        });

        const countySelectID = environment.countySelectBoxId;
        //get the select box so we can populate it
        const countySelectBox = document.getElementById(
          countySelectID,
        ) as HTMLSelectElement;
        //remove elements if there are any
        countySelectBox.length = 1;
        uniquecounties.forEach(function (value) {
          //create an option element to add to the select box
          const option = document.createElement('option');
          //need to check if there is an entry in the environment.ts file for a more user freindly name.
          //This is primarily used for District since the FeatureLayer only has the District abbreviated name.
          if (typeof environment[value] === 'undefined') {
            option.text = value;
          } else {
            option.text = environment[value];
          }
          option.value = value;
          countySelectBox.appendChild(option);
        });
        const routeSelectID = environment.routeSelectBoxId;
        const routeSelectBox = document.getElementById(
          routeSelectID,
        ) as HTMLSelectElement;
        //remove elements if there are any
        routeSelectBox.length = 1;
      })
      .catch((error) => {
        throw new Error(
          `FeaturesService:queryAndSetFeatures: Error adding features to map: ${error}`,
        );
      });
  }

  getFeatures(whereClause: string): Array<Graphic> {
    if (whereClause === 'undefined' || whereClause === '') {
      return this.getAllFeatures();
    } else {
      return this.getSelectFeatures(whereClause);
    }
  }

  getAllFeatures(): Array<Graphic> {
    return this._featureGraphics;
  }

  getSelectFeatures(whereClause: string): Array<Graphic> {
    const tempArray: Array<Graphic> = [];
    if (whereClause === 'undefined' || whereClause === '') {
      return this.getAllFeatures();
    } else {
      try {
        const whereSplit = whereClause.split('=', 2);
        const field = whereSplit[0];
        const filedVal = whereSplit[1];
      } catch (error) {
        throw new Error(
          'FeaturesService.getSelectFeatures error splitting where clause: ' +
            error,
        );
      }
    }
  }
}
