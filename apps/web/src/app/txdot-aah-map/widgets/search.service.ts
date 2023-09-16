import { Injectable } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import Search from '@arcgis/core/widgets/Search';
import { environment } from 'src/environments/environment';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { AuthenticationService } from 'src/app/auth/_services';
import { PermissionsService } from 'src/app/auth/_services/permissions.service';
import Extent from '@arcgis/core/geometry/Extent';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(
    public authService: AuthenticationService,
    public permissions: PermissionsService,
  ) {}

  private searchWidget;

  setSearchWidget(view: MapView, container: string) {
    const whereClause = this.permissions.getZoomWhereClause();

    const sources = [
      {
        layer: new FeatureLayer({
          url: environment.aahGisSegmentsFS,
          outFields: ['*'],
        }),
        enableHighlight: true,
        resultSymbol: {
          type: 'simple-line', // autocasts as new SimpleLineSymbol()
          color: 'black',
          width: '4px',
          style: 'short-dot',
        },
        searchFields: ['AAH_ROUTE_NAME', 'AAH_SEGMENT_ID'],
        filter: {
          where: whereClause,
        },
        suggestionTemplate: 'Name: {AAH_ROUTE_NAME} <br>ID: { AAH_SEGMENT_ID }',
        exactMatch: false,
        name: 'AAH segment name or ID',
        placeholder: 'Example: SH0018 or 1435',
        popupTemplate: {
          title: 'AAH segment name : {AAH_ROUTE_NAME}',
          content: [
            {
              maxInlineActions: 7,
              includeDefaultActions: false,
              actionsMenuEnabled: false,
              order: 0,
              alignment: 'top-center',
              id: 'edit-segment',
              visible: true,
              type: 'fields',
              fieldInfos: [
                {
                  fieldName: 'AAH_SEGMENT_ID',
                  label: 'Segment ID',
                },
                {
                  fieldName: 'TXDOT_ROUTE_NAME',
                  label: 'TxDOT Route Name',
                },
                {
                  fieldName: 'AAH_ROUTE_NAME',
                  label: 'AAH Route Name',
                },
                {
                  fieldName: 'SEGMENT_STATUS',
                  label: 'Segment Status',
                },

                {
                  fieldName: 'DIST_ABRVN',
                  label: 'District Abbreviation',
                },
                {
                  fieldName: 'DIST_NM',
                  label: 'District Name',
                },
                {
                  fieldName: 'CNTY_NM',
                  label: 'County',
                },
                {
                  fieldName: 'MNT_OFFICE_NM',
                  label: 'Maintenance Office',
                },
                {
                  fieldName: 'MNT_SEC_NBR',
                  label: 'Maintenance Office #',
                },
                {
                  fieldName: 'FROM_TO_DESC',
                  label: 'From / To Description',
                },
                {
                  fieldName: 'SEGMENT_LENGTH_MILES',
                  label: 'Length (miles)',
                },
                {
                  fieldName: 'GROUP_NAME',
                  label: 'Group Name',
                },
                {
                  fieldName: 'UNAVAILABLE_REASON_FIELD',
                  label: 'Unavailable Reason',
                },
                {
                  fieldName: 'UNAVAILABLE_OTHER',
                  label: 'Unavailable Other',
                },
                {
                  fieldName: 'DEACTIVATED_REASON_FIELD',
                  label: 'Deactivate Reason',
                },
                {
                  fieldName: 'DEACTIVATE_OTHER',
                  label: 'Deactivate Other',
                },
                {
                  fieldName: 'CREATED_BY',
                  label: 'Created By',
                },
                {
                  fieldName: 'CREATED_ON',
                  label: 'Created On',
                },
                {
                  fieldName: 'UPDATED_BY',
                  label: 'Updated By',
                },
                {
                  fieldName: 'UPDATED_ON',
                  label: 'Updated On',
                },
              ],
            },
          ],
        },
      },
      {
        layer: new FeatureLayer({
          url: environment.txdotDistrictsFS,
          outFields: ['*'],
        }),
        popupEnabled: false,
        searchFields: ['DIST_NM', 'DIST_ABRVN', 'DIST_NBR'],
        filter: {
          where: whereClause,
        },
        suggestionTemplate: '{ DIST_NM }',
        exactMatch: false,
        placeholder: 'Example: AUS or Austin',
        name: 'District name',
        resultSymbol: {
          type: 'simple-fill',
          style: 'none',
          outline: {
            color: [39, 229, 227, 0.45], // aqua,
            width: 8,
          },
        },
      },
      {
        layer: new FeatureLayer({
          url: environment.txdotMaintenanceSectionsFS,
          outFields: ['*'],
        }),
        popupEnabled: false,
        searchFields: ['MAINT_SEC_NM'],
        filter: {
          where: whereClause,
        },
        suggestionTemplate: '{MAINT_SEC_NM}',
        exactMatch: false,
        placeholder: 'Example: Bowie',
        name: 'Maintenance office name',
        resultSymbol: {
          type: 'simple-fill',
          outline: {
            color: [39, 229, 227, 0.45], // aqua,
            width: 8,
          },
        },
      },
      {
        layer: new FeatureLayer({
          url: environment.txdotCountiesFS,
          outFields: ['CNTY_NM'],
        }),
        popupEnabled: false,
        searchFields: ['CNTY_NM'],
        filter: {
          where: whereClause,
        },
        suggestionTemplate: '{CNTY_NM}',
        exactMatch: false,
        placeholder: 'Example: Gaines',
        name: 'County name',
        resultSymbol: {
          type: 'simple-fill',
          outline: {
            color: [39, 229, 227, 0.45], // aqua,
            width: 8,
          },
        },
      },
      {
        url: environment.gisGeoCodeUrl,
        countryCode: 'US',
        singleLineFieldName: 'SingleLine',
        suffix: ', Texas,TX,USA',
        filter: {
          geometry: new Extent({
            xmax: -10409241.4136,
            xmin: -11871803.9956,
            ymax: 4369693.977600001,
            ymin: 2978934.4059999995,
            spatialReference: { wkid: 102100 },
          }),
        },
        maxResults: 10,
        maxSuggestions: 5,
        suggestionsEnabled: true,
        minSuggestCharacters: 5,
        placeholder: 'Search address or place in Texas',
        name: 'State of Texas',
      },
    ];

    //Add Search widget
    const search = new Search({
      view: view,
      container: container,
      includeDefaultSources: false,
      sources: sources,
      suggestionsEnabled: true,
      allPlaceholder: 'Search segment name, address, place...',
    });

    this.searchWidget = search;
  }

  getSearchWidget(): Search {
    return this.searchWidget;
  }
}
