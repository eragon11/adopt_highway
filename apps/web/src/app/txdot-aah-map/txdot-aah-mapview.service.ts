/*
This service is primarily responsible for getting the Adopt A Higway MapView
*/

import { Injectable } from '@angular/core';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import { environment } from './../../environments/environment';
import { LayerlistService } from './widgets/layerlist.service';
import { LayersService } from './widgets/layers.service';
import { LocateService } from './widgets/locate.service';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import { HomeService } from './widgets/home.service';
import { ZoomService } from './widgets/zoom.service';
import { SearchService } from './widgets/search.service';
import { ScaleBarService } from './widgets/scale-bar.service';
import { FilterDropdownService } from './widgets/filter-dropdown.service';
import { FilterCheckboxService } from './widgets/filter-checkbox.service';
import { UpdateSegmentService } from './widgets/update-segment.service';
import { CreateSegmentService } from './widgets/create-segment.service';
import { MeasurementService } from './widgets/measurement.service';
import { FeatureTableService } from './widgets/feature-table.service';
import { FeaturesService } from './widgets/features.service';
import { AuthenticationService } from 'src/app/auth/_services/authentication.service';
import { PermissionsService } from 'src/app/auth/_services/permissions.service';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Color from '@arcgis/core/Color.js';

//div container the holds the map
const mapContainer = 'viewDiv';
@Injectable({
  //todo: this may need to move down to the map component
  providedIn: 'root',
})
export class TxdotAahMapviewService {
  _mapview: MapView;

  constructor(
    private authService: AuthenticationService,
    private layerlist: LayerlistService,
    private layers: LayersService,
    private locate: LocateService,
    private home: HomeService,
    private zoom: ZoomService,
    private search: SearchService,
    public filterDropdown: FilterDropdownService,
    public filterCheckbox: FilterCheckboxService,
    private features: FeaturesService,
    private featureTable: FeatureTableService,
    private measurement: MeasurementService,
    private updateSegmentSrv: UpdateSegmentService,
    private createSegmentSrv: CreateSegmentService,
    private permissions: PermissionsService,
    private scaleBar: ScaleBarService,
  ) {}

  getMapView(): MapView {
    return this._mapview;
  }

  getConstructedMapView(newMap: WebMap): MapView {
    const mpView = new MapView({
      container: mapContainer,
      map: newMap,
      center: [-99.65, 31.0],
      zoom: 5,
      constraints: {
        minZoom: 5,
        maxZoom: 16,
        rotationEnabled: false,
      },
      ui: {
        components: ['attribution'],
      },
      padding: { top: 55 },
      popup: {
        autoOpenEnabled: true,
      },
      highlightOptions: {
        color: new Color('rgb(0, 255, 255)'),
        haloOpacity: 0.9,
        fillOpacity: 0.2,
      },
    });

    this._mapview = mpView;
    this._mapview.popup.maxInlineActions = 7;

    this.zoom.zoomToRoleArea(mpView);

    const aahLayer = this.layers.getAAHSegmentsFeatureLayer();

    //Once the layer loads we will query all the features and store them in the service to be used later
    mpView.when(() => {
      this.initializeAAHMap(aahLayer, mpView);
      //setup the widgets on the map
      this.setupMapWidgets(mpView);
    });

    // Show/hide the loading icon if the view is being updated by additional data
    // requests to the network, or by processing received data.

    return mpView;
  }

  initializeAAHMap(aahLayer: FeatureLayer, mpView: MapView) {
    this.features.queryAndSetFeatures(aahLayer, mpView);
    this.featureTable.setFeatureTableWidget(mpView, aahLayer);

    //start the events watchers for the segment updates
    this.updateSegmentSrv.startUpdateSegment(mpView);
    this.createSegmentSrv.initializeCreateSegment(mpView);
  }

  setupMapWidgets(view: MapView) {
    this.search.setSearchWidget(view, environment.searchDiv);

    this.layerlist.setLayerListWidget(view, environment.layerDiv);

    this.locate.setLocateWidget(view, environment.locateDiv);

    this.home.setHomeWidget(view, environment.homeDiv);

    this.zoom.setZoomWidget(view, environment.zoomDiv);

    this.measurement.setMeasurementWidget(view, environment.measurementDiv);

    this.filterDropdown.setSelectFilterWidget(view, environment.filterDiv);

    this.filterCheckbox.setMapView(view);

    this.scaleBar.setScaleBar(view);
  }
}
