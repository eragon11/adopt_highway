import { Injectable } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import { LayersService } from './layers.service';
import { AuthenticationService } from 'src/app/auth/_services';
import { PermissionsService } from 'src/app/auth/_services/permissions.service';
import { RoleType } from '../../auth/_models/role-type';
import { FilterDropdownService } from './filter-dropdown.service';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilterCheckboxService {
  constructor(
    private layers: LayersService,
    public authService: AuthenticationService,
    public permissions: PermissionsService,
    public dropDownService: FilterDropdownService,
  ) {}

  public _view: MapView;

  setMapView(view: MapView) {
    // Set the view to be used later to watch for layer.definitionExpression changes
    this._view = view;
  }

  filterCheckedEvent(whereFieldName: string, checkedElements) {
    const layer = this.layers.getAAHSegmentsFeatureLayer();

    let whereClause: string;
    let locationWhereClause: string;

    const segmentStatuses = "'" + checkedElements.join("','") + "'";
    const segmentWhereClause =
      whereFieldName + ' in ' + '(' + segmentStatuses + ')';

    const districtOptionSel = (<HTMLSelectElement>(
      document.getElementById('district')
    )).value;
    const countyOptionSel = (<HTMLSelectElement>(
      document.getElementById('county')
    )).value;
    const routeOptionSel = (<HTMLSelectElement>document.getElementById('route'))
      .value;
    const districtSelected = !districtOptionSel.split(' ').includes('Select');
    const countySelected = !countyOptionSel.split(' ').includes('Select');
    const routeSelected = !routeOptionSel.split(' ').includes('Select');

    const roleType = this.authService.getSelectedRoleType();

    if (districtSelected || countySelected || routeSelected) {
      switch (roleType) {
        case RoleType.ReadOnlyUser:
        case RoleType.Administrator: {
          if (!districtSelected) {
            locationWhereClause = '';
          } else if (districtSelected) {
            locationWhereClause =
              `${environment.Dist_Segment_WhereClause}` +
              "'" +
              districtOptionSel +
              "'";
          }
          if (districtSelected && countySelected) {
            locationWhereClause +=
              ` AND ${environment.CountyWhereClause}` +
              "'" +
              countyOptionSel +
              "'";
          }
          if (routeSelected) {
            locationWhereClause +=
              ` AND ${environment.RouteWhereClause}` +
              "'" +
              routeOptionSel +
              "'";
          }
          break;
        }
        case RoleType.District: {
          if (countySelected) {
            locationWhereClause =
              `${environment.CountyWhereClause}` + "'" + countyOptionSel + "'";
          }
          if (routeSelected) {
            locationWhereClause +=
              ` AND ${environment.routeFeatureSrvName}` +
              "'" +
              routeOptionSel +
              "'";
          }
          break;
        }
        case RoleType.Maintenance: {
          if (countySelected) {
            let whereMnt = `${
              environment.Maint_Segment_WhereClause
            } ${this.authService.getMaintOfficeNum()}`;
            let whereDst = ` AND ${
              environment.Dist_Segment_WhereClause
            } ${this.authService.getMaintDistrictAbr()}`;
            whereMnt += whereDst +=
              ` AND ${environment.CountyWhereClause}` +
              "'" +
              countyOptionSel +
              "'";
            locationWhereClause = whereMnt;
          }
          if (routeSelected) {
            locationWhereClause +=
              ` AND ${environment.RouteWhereClause}` +
              "'" +
              routeOptionSel +
              "'";
          }
          break;
        }
      }
      whereClause = locationWhereClause + ' AND ' + segmentWhereClause;
    } else {
      if (
        roleType !== RoleType.Administrator &&
        roleType !== RoleType.ReadOnlyUser
      ) {
        whereClause = `${this.permissions.getSegmentFilterWhereClause(
          false,
        )} AND ${segmentWhereClause}`;
      } else {
        whereClause = segmentWhereClause;
      }
    }

    layer.when(() => {
      try {
        layer.definitionExpression = whereClause;

        if (!layer.visible) {
          layer.visible = true;
        }

        this.dropDownService.populateRouteSelectSegmentStatus(
          layer,
          countySelected,
        );

        const query = layer.createQuery();
        query.returnGeometry = true;
      } catch (error) {
        if (this._view) {
          throw new Error(
            'FilterCheckboxService.filterCheckedEvent error returning layer query: ' +
              error,
          );
        }
      }
    });
  }
}
