import { Injectable } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import { environment } from 'src/environments/environment';
import { LayersService } from './layers.service';
import { FeaturesService } from './features.service';
import { AuthenticationService } from 'src/app/auth/_services';
import { PermissionsService } from 'src/app/auth/_services/permissions.service';
import { ZoomService } from './zoom.service';
import { HomeService } from './home.service';

@Injectable({
  providedIn: 'root',
})
export class FilterDropdownService {
  constructor(
    private layers: LayersService,
    private features: FeaturesService,
    public authService: AuthenticationService,
    public permissions: PermissionsService,
    public zoom: ZoomService,
    public home: HomeService,
  ) {}

  private _view: MapView;

  public checkedStatus: any = '';

  setSelectFilterWidget(view: MapView, container: string) {
    //lets set the view to be used later
    this._view = view;
    view.when(() => {
      const filterDiv = document.getElementById(container);
      view.ui.add(filterDiv, 'top-left');
    });
  }

  populateCountySelectBox(districtFullName: string) {
    try {
      this.clearSelectBoxes(
        environment.countySelectBoxId,
        environment.countySelectBoxInitialVal,
      );
      this.clearSelectBoxes(
        environment.routeSelectBoxId,
        environment.routeSelectBoxInitialVal,
      );
      const whereClause =
        environment.districtAbbreviatedFieldName +
        " = '" +
        districtFullName +
        "'";
      this.populateSelectBox(
        whereClause,
        environment.countyCountyFieldName,
        environment.countySelectBoxId,
      );
    } catch (error) {
      throw new Error(
        'FilterDropdownService.populateCountySelectBox error populating select box ' +
          error,
      );
    }
  }

  populateRouteSelectSegmentStatus(layer: FeatureLayer, countySelected) {
    const whereClause = layer.definitionExpression;

    try {
      if (countySelected) {
        this.clearSelectBoxes(
          environment.routeSelectBoxId,
          environment.routeSelectBoxInitialVal,
        );

        this.populateSelectBox(
          whereClause,
          environment.routeFeatureSrvName,
          environment.routeSelectBoxId,
        );
      }
    } catch (error) {
      throw new Error(
        'FilterDropdownService.populateRouteSelectBox error populating select box ' +
          error,
      );
    }
  }

  populateRouteSelectBox(layer: FeatureLayer, countyFullName: string) {
    let whereClause;
    // since the route zoom is still based on features we must honor the current layer definition
    // so we dont zoooom to Africa
    try {
      if (layer.definitionExpression) {
        //strip the county clause out of the layer definition expression
        let ld = this.stripClause(
          environment.countyCountyFieldName,
          layer.definitionExpression,
        );
        //strip out the route clause if present
        ld = this.stripClause(environment.routeFeatureSrvName, ld);

        if (this.checkedStatus) {
          //strip out the segment status clause if present
          let def = this.stripClause(environment.segmentStatusFieldName, ld);
          ld =
            def +
            ' AND ' +
            `${environment.segmentStatusFieldName} IN ` +
            '(' +
            this.checkedStatus +
            ')';
          whereClause =
            ld +
            ' AND ' +
            `${environment.countyCountyFieldName} = '${countyFullName}'`;
        } else {
          whereClause = `${ld} AND ${environment.countyCountyFieldName} = '${countyFullName}'`;
        }
      } else {
        whereClause = `${environment.countyCountyFieldName} = '${countyFullName}'`;
      }

      this.populateSelectBox(
        whereClause,
        environment.routeFeatureSrvName,
        environment.routeSelectBoxId,
      );
    } catch (error) {
      throw new Error(
        'FilterDropdownService.populateRouteSelectBox error populating select box ' +
          error,
      );
    }
  }

  parseInClause(inStr: string): Array<string> {
    let arr = [];
    //remove parentheses
    inStr = inStr.replace(/[{()}]/g, '');
    //remove single quotes
    inStr = inStr.replace(/'/g, '');
    arr = inStr.split(',');
    return arr;
  }

  stripClause(ident: string, where: string): string {
    let retStr;
    let andComponents = where.split(new RegExp(' and ', 'i'));
    andComponents.forEach((item) => {
      if (item.trim().indexOf(ident) === -1) {
        if (retStr) {
          retStr += `AND ${item} `;
        } else {
          retStr = ` ${item} `;
        }
      }
    });
    return retStr;
  }

  // accepts a sub component of a where clause i.e. 1 part of a muli-part where clause
  // and extracts
  filterAttributes(whereClause: string, values: Array<Object>): Array<Object> {
    let inClause = false;
    let fieldName: string;
    let fieldValues = [];

    if (whereClause.length > 0 && whereClause != 'undefined') {
      if (whereClause.includes('=')) {
        inClause = true;
        var whereComponents = whereClause.split('=');
        fieldName = whereComponents[0].replace(/ /g, '');
        fieldValues.push(whereComponents[1].replace(/'/g, '').trim());
      } else {
        //its an in clause which must be parsed and put into the array
        const inComponents = whereClause.split(new RegExp(' in ', 'i'));
        fieldName = inComponents[0].replace(/ /g, '');
        fieldValues = this.parseInClause(inComponents[1]);
        fieldValues.forEach((val) => {});
      }
    }
    //Since we are querying all of the features from the FeatureLayer, we will have duplicates
    const matches = [];
    values.forEach((item) => {
      fieldValues.forEach((val) => {
        if (item[fieldName] == val.trim()) {
          matches.push(item);
        }
      });
    });
    return matches;
  }

  populateSelectBox(whereClause: string, field: string, selectId: string) {
    if (whereClause.length > 0 && whereClause != 'undefined') {
      //need to get rid of the "where" but cannot uppercase/lowercase the statument due to county clause
      var andComponents = whereClause
        .replace(/where/gi, '')
        .split(new RegExp(' and ', 'i'));
    } else {
      console.error(
        `filter-dropdown.service:populateSelectBox: Error: expecting a where clause but did not receive one`,
      );
    }

    const features = this.features.getAllFeatures();
    const values = features.map((feature) => {
      return feature.attributes;
    });
    let filteredFeatures = values;
    andComponents.forEach((element) => {
      filteredFeatures = this.filterAttributes(element, filteredFeatures);
    });
    //Since we are querying all of the features from the FeatureLayer, we will have duplicates
    const uniqueValues = [];
    filteredFeatures.forEach(function (item) {
      const val = item[field];
      if (
        (uniqueValues.length < 1 || uniqueValues.indexOf(val) === -1) &&
        val !== '' &&
        val !== null
      ) {
        uniqueValues.push(val);
      }
    });
    uniqueValues.sort();

    //get the select box so we can populate it
    const selectBoxId = document.getElementById(selectId) as HTMLSelectElement;
    uniqueValues.forEach(function (value) {
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
      selectBoxId.add(option);
    });
  }

  filterSelectedEvent(whereFieldName: string, ev) {
    let resetMap = false;
    // use the next 3 lines to identify which select box initiated the change event so we can do some prep work
    // i.e. populate the select boxes downstream. We will use the select box ids configured in environment.ts
    const target = ev.target || ev.srcElement || ev.currentTarget;
    const idAttr = target.attributes.id;
    const selectType = idAttr.nodeValue;
    const layer = this.layers.getAAHSegmentsFeatureLayer();
    // create the where clause using the selectType selected by the user
    // but only if it has a real value
    const whereClause = whereFieldName + " = '" + ev.target.value + "'";
    const isInitialVal = ev.target.value.includes('Select');

    const role = this.authService.getSelectedRoleType();

    switch (selectType) {
      case environment.districtSelectBoxId:
        if (ev.target.value === environment.districtSelectBoxInitialVal) {
          resetMap = true;
        }
        this.zoom.zoomToDistrict(this._view, ev.target.value);
        this.populateCountySelectBox(ev.target.value);
        break;
      // Dropdown county map filter
      case environment.countySelectBoxId:
        if (ev.target.value === environment.countySelectBoxInitialVal) {
          resetMap = true;
        }
        this.clearSelectBoxes(
          environment.routeSelectBoxId,
          environment.routeSelectBoxInitialVal,
        );
        if (!resetMap) {
          this.zoom.zoomToCounty(this._view, ev.target.value);
          this.populateRouteSelectBox(layer, ev.target.value);
        }
        break;
      // Dropdown segment map filter
      case environment.routeSelectBoxId:
        if (ev.target.value === environment.routeSelectBoxInitialVal) {
          resetMap = true;
        }
        break;
      default:
        throw new Error(
          'FilterDropdownService.filterSelectedEvent: Was not able to identify the selectbox ID to filter selections ',
        );
    }

    let cleanExpression;

    layer
      .when(() => {
        try {
          //the layer definition is like a query on a layer. It defines the features to be available
          if (!resetMap) {
            if (layer.definitionExpression) {
              // Only add 'AND' operator to the definitionExpression if condition doesn't exist in query
              // i.e. there can only be one DISTRICT_ABBREVIATION, CNTY_NM, or AAH_ROUTE_NAME in a whereClause
              if (!layer.definitionExpression.includes(whereFieldName)) {
                layer.definitionExpression =
                  layer.definitionExpression + ' AND ' + whereClause;
              } else if (selectType === 'district') {
                // if a user updates the district then remove all other expressions
                // and add the new district whereClause
                layer.definitionExpression = whereClause;
              } else if (selectType === 'county') {
                // If the user updates a county then remove the county and the route (if it exists)
                // and add the new county whereClause. If the user changes back to the initial state (i.e. 'Select County')
                // remove it from the expression.
                let cleanExpression = !isInitialVal
                  ? this.stripClause(
                      environment.countyCountyFieldName,
                      layer.definitionExpression,
                    )
                  : layer.definitionExpression.split('AND ')[0];
                cleanExpression = cleanExpression + ' AND ';
                layer.definitionExpression = !isInitialVal
                  ? cleanExpression.concat(whereClause)
                  : cleanExpression;
              } else if (selectType === 'route') {
                // If the user changes back to the initial state (i.e. 'Select Route')
                // remove it from the expression, else if a user updates a route replace the route with the new whereClause.
                if (isInitialVal) {
                  cleanExpression = this.stripClause(
                    environment.routeFeatureSrvName,
                    layer.definitionExpression,
                  );
                  layer.definitionExpression = cleanExpression;
                } else {
                  cleanExpression =
                    this.stripClause(
                      environment.routeFeatureSrvName,
                      layer.definitionExpression,
                    ) + ' AND ';
                  layer.definitionExpression = cleanExpression.concat(
                    whereClause,
                  );
                }
              }
            } else {
              layer.definitionExpression = whereClause;
            }
            // User has gone back to initial selection criteria i.e. "Select County"
          } else {
            if (this.checkedStatus) {
              let defExp = this.stripClause(
                environment.segmentStatusFieldName,
                layer.definitionExpression,
              );
              const segmentStatusClause =
                `${environment.segmentStatusFieldName} IN ` +
                '(' +
                this.checkedStatus +
                ')';
              layer.definitionExpression = defExp
                ? defExp + ' AND ' + segmentStatusClause
                : segmentStatusClause;
            }

            // Determine which dropdown was reset based on selectType. Remove the type from the layer query so only former dropdown selections are maintained in segment results returned
            // Zoom to appropriate extent - county, district, or home extent based on user.
            switch (selectType) {
              case 'district':
                const defExpStrpDist = this.stripClause(
                  environment.districtAbbreviatedFieldName,
                  layer.definitionExpression,
                );
                const defStrp = this.stripClause(
                  environment.countyCountyFieldName,
                  defExpStrpDist,
                );
                layer.definitionExpression = !this.checkedStatus
                  ? this.permissions.getSegmentFilterWhereClause(true)
                  : defStrp;
                this.home.zoomTo();
                break;
              case 'county':
                layer.definitionExpression = this.stripClause(
                  environment.countyCountyFieldName,
                  layer.definitionExpression,
                );
                if (
                  role === 'District Coordinator' ||
                  role === 'Maintenance Coordinator'
                ) {
                  this.home.zoomTo();
                } else {
                  const district = (<HTMLInputElement>(
                    document.getElementById('district')
                  )).value;
                  this.zoom.zoomToDistrict(this._view, district);
                }
                break;
              case 'route':
                const county = (<HTMLInputElement>(
                  document.getElementById('county')
                )).value;
                layer.definitionExpression = this.stripClause(
                  environment.routeFeatureSrvName,
                  layer.definitionExpression,
                );
                this.zoom.zoomToCounty(this._view, county);
                break;
            }
          }
          console.warn(
            'Final query for dropdown selection: ',
            layer.definitionExpression,
          );
          if (!layer.visible) {
            layer.visible = true;
          }

          const query = layer.createQuery();
          //make sure the spatial reference of the query matches the MapView
          query.outSpatialReference = this._view.spatialReference;
          query.returnGeometry = true;
          return layer.queryExtent(query);
        } catch (error) {
          throw new Error(
            'FilterDropdownService.filterSelectedEvent error returning layer queryExtent: ' +
              error,
          );
        }
      })
      .then((response) => {
        try {
          // Zoom to the filter extent of layer but only if its a route and is not reset
          if (
            response &&
            response.extent &&
            selectType === 'route' &&
            !resetMap
          ) {
            this._view.goTo(response.extent);
          }
        } catch (error) {
          throw new Error(
            'FilterDropdownService.filterSelectedEvent error zooming to extent: ' +
              error,
          );
        }
      });
  }

  checkedStatuses(options) {
    const results = "'" + options.map((o) => o.value).join("','") + "'";
    this.checkedStatus = results;
  }

  clearSelectBoxes(boxID: string, intialString: string) {
    const selectBoxId = document.getElementById(boxID) as HTMLSelectElement;
    for (let i = selectBoxId.length; i >= 0; i--) {
      selectBoxId.remove(i);
    }
    const option = document.createElement('option');
    option.text = intialString;
    option.value = intialString;
    selectBoxId.appendChild(option);
  }
}
