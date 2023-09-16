import { Injectable, OnInit } from '@angular/core';
import Basemap from '@arcgis/core/Basemap';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import Layer from '@arcgis/core/layers/Layer';
import UniqueValueRenderer from '@arcgis/core/renderers/UniqueValueRenderer';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { environment } from 'src/environments/environment';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import ActionButton from '@arcgis/core/support/actions/ActionButton';
import MapView from '@arcgis/core/views/MapView';
import { PermissionsService } from 'src/app/auth/_services/permissions.service';
import { AuthenticationService } from 'src/app/auth/_services';
import WebMap from '@arcgis/core/WebMap';

@Injectable({
  providedIn: 'root',
})
export class LayersService {
  constructor(
    private auth: AuthenticationService,
    private permissions: PermissionsService,
  ) {}

  private _baseMap: Basemap;
  private _webMap: WebMap;
  private _layers: Array<Layer> = [];
  private _roadNetworkLayer: Layer;
  private _referenceMarkerLayer: Layer;
  private _aahLayer: Layer;
  private _DistrictsLayer: Layer;
  private _CountiesLayer: Layer;
  private _MaintenanceSectionsLayer: Layer;

  layersSet(): boolean {
    if (this._layers.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  setWebMap(webmap: WebMap) {
    this._webMap = webmap;
  }

  setTxdotBasemap() {
    const txdotBaseMapTileLayer = new VectorTileLayer({
      // URL to the vector tile service
      url: environment.txdotBasemapFS,
      title: 'TxDOT Basemap',
      id: 'TxDOTBasemap',
      listMode: 'show',
    });

    const txdotBaseMap = new Basemap({
      baseLayers: [txdotBaseMapTileLayer],
    });

    this._baseMap = txdotBaseMap;
  }

  getTxdotBasemap(): Basemap {
    if (this._baseMap) {
      return this._baseMap;
    } else {
      this.setTxdotBasemap();
      return this._baseMap;
    }
  }

  setFeatureLayers() {
    this._roadNetworkLayer = this.setRoadNetworkFeatureLayer();
    this._layers.push(this._roadNetworkLayer);
    this._DistrictsLayer = this.setDistrictFeatureLayer();
    this._layers.push(this._DistrictsLayer);
    this._CountiesLayer = this.setCountiesFeatureLayer();
    this._layers.push(this._CountiesLayer);
    this._MaintenanceSectionsLayer = this.setMaintenanceSectionsFeatureLayer();
    this._layers.push(this._MaintenanceSectionsLayer);
    this._aahLayer = this.setAAHSegmentsFeatureLayer();
    this._referenceMarkerLayer = this.setReferenceMarkersFeatureLayer();
    this._layers.push(this._referenceMarkerLayer);
    this._layers.push(this._aahLayer);
  }

  getFeatureLayers(): Array<Layer> {
    if (!this.layersSet()) {
      this.setFeatureLayers();
    }
    return this._layers;
  }

  setAAHSegmentsFeatureLayer(): Layer {
    const editSegmentAction = new ActionButton({
      title: 'Update',
      id: 'edit-segment',
      className: 'esri-icon-edit',
      image: environment.SegmentUpdateIcon,
      visible: true,
    });

    const editAgreementAction = new ActionButton({
      title: 'Agreement',
      id: 'edit-agreement',
      className: 'esri-icon-edit',
      image: environment.AgreementIcon,
      type: 'button',
      visible: true,
    });

    const editGroupAction = new ActionButton({
      title: 'Group',
      id: 'edit-group',
      className: 'esri-icon-edit',
      image: environment.GroupIcon,
      type: 'button',
      visible: true,
    });

    const editPickupAction = new ActionButton({
      title: 'Pickup',
      id: 'edit-pickup',
      className: 'esri-icon-edit',
      image: environment.PickupIcon,
      type: 'button',
      visible: true,
    });

    const editSignAction = new ActionButton({
      title: 'Sign',
      id: 'edit-sign',
      className: 'esri-icon-edit',
      image: environment.SignIcon,
      type: 'button',
      visible: true,
    });

    const aahSegmentsPopup = {
      title: "Adopt A Highway Info",
      maxInlineActions: 7,
      includeDefaultActions: false,
      actionsMenuEnabled: false,
      alignment: 'top-center',
      actions: [
        // titleAction,
        // the following actions will be used once the functionality is completed
        // editAgreementAction,
        // editGroupAction,
        // editPickupAction,
        // editSignAction,
      ],
      content: [
        {
          action: editSegmentAction,
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
    };
    //check and see if this role type is allowed to edit segments
    this.permissions.isAuthorized('UpdateSegment', 'update')
      ? aahSegmentsPopup.actions.push(editSegmentAction)
      : console.warn(
          `Role: ${this.auth.getSelectedRoleType()} not authorized to edit segments`,
        );

    const aahSegmentsFeatureLayer = new FeatureLayer({
      url: environment.aahGisSegmentsFS,
      title: environment.AAHFeatureLayerTitle,
      outFields: ['*'],
      popupTemplate: aahSegmentsPopup,
      // minScale: 1500000,
      // maxScale: 70.5310735,
      legendEnabled: true,
      visible: true,
      templates: [
        {
          name: 'AAH Segments',
          description: 'AAH Segments',
          drawingTool: 'line',
          prototype: {
            attributes: {},
          },
        },
      ],
    });

    const permittedStatuses = [];
    //The following code will be used to update the role specific statuses available to the user
    const legendArray = this.permissions.getPermittedStatuses();
    for (const val of legendArray) {
      const str1 = JSON.parse(JSON.stringify(val));
      permittedStatuses.push(str1);
    }
    aahSegmentsFeatureLayer.renderer = new UniqueValueRenderer({
      field: 'SEGMENT_STATUS',
      uniqueValueInfos: permittedStatuses,
    });

    this.checkFields(aahSegmentsFeatureLayer);

    return aahSegmentsFeatureLayer;
  }

  getAAHSegmentsFeatureLayer(): FeatureLayer {
    //we need to get the layer on demand because we remove the layer if
    //the user changes roles
    let tempLayer: FeatureLayer;
    if (this._webMap) {
      this._webMap.layers.forEach((layer) => {
        if (layer.title === environment.AAHFeatureLayerTitle) {
          tempLayer = layer as FeatureLayer;
        }
      });
    }
    return tempLayer;
  }

  setRoadNetworkFeatureLayer(): Layer {
    //First we need to construct the popup
    const aahPopupRoadways = {
      title: 'TxDOT Roadways',
      content: [
        {
          type: 'fields',
          fieldInfos: [
            {
              fieldName: 'RTE_NM',
              label: 'Route Name',
            },
            {
              fieldName: 'RDBD_TYPE',
              label: 'Roadbed Type',
            },
            {
              fieldName: 'BEGIN_DFO',
              label: 'BEGIN DFO',
            },
            {
              fieldName: 'END_DFO',
              label: 'END DFO',
            },
            {
              fieldName: 'COUNTY',
              label: 'COUNTY',
            },
            {
              fieldName: 'RDWAY_STAT',
              label: 'Roadway Status',
            },

            {
              fieldName: 'MAP_LBL',
              label: 'Map Label',
            },
          ],
        },
      ],
    };

    const txdotRoadNetworkFeatureLayer = new FeatureLayer({
      // URL to the vector tile service
      url: environment.txdotRoadwayFS,
      title: 'TxDOT Roadways',
      outFields: ['RTE_NM'],
      legendEnabled: true,
      popupTemplate: aahPopupRoadways,
      minScale: 0,
      maxScale: 0,
      listMode: 'show',
      visible: false,
    });

    // Symbol for ROADWAYS
    const AAHRoadways = new SimpleLineSymbol({
      color: [96, 96, 96],
      width: 0.5,
      style: 'solid',
    });

    txdotRoadNetworkFeatureLayer.renderer = new SimpleRenderer({
      symbol: AAHRoadways,
    });

    return txdotRoadNetworkFeatureLayer;
  }

  getRoadNetworkFeatureLayer(): FeatureLayer {
    if (!this.layersSet) {
      this.setFeatureLayers();
    }
    return this._roadNetworkLayer as FeatureLayer;
  }

  setMaintenanceSectionsFeatureLayer(): Layer {
    const aahMaintenanceDistricts = {
      title: 'TxDOT Maintenance Sections',
      content: [
        {
          type: 'fields',
          fieldInfos: [
            {
              fieldName: 'MAINT_SEC_NM',
              label: 'Maintenance Office Name',
            },
            {
              fieldName: 'MAINT_SEC_NBR',
              label: 'Maintenance Section Number',
            },
            {
              fieldName: 'DIST_NM',
              label: 'District Name',
            },
          ],
        },
      ],
    };

    const txdotMaintenanceFeautureLayer = new FeatureLayer({
      url: environment.txdotMaintenanceSectionsFS,
      title: 'TxDOT Maintenance Sections',
      outFields: ['MAINT_SEC_NM'],
      legendEnabled: true,
      popupTemplate: aahMaintenanceDistricts,
      minScale: 0,
      maxScale: 0,
      listMode: 'show',
      visible: false,
      labelsVisible: true,
      labelingInfo: [
        {
          labelExpressionInfo: { expression: '$feature.MAINT_SEC_NM' },
          minScale: 1155581,
          maxScale: 70,
          symbol: {
            type: 'text', // autocasts as new TextSymbol()
            color: 'hsl(278, 31%, 49%)',
            haloSize: 2,
            haloColor: 'white',
            yoffset: -25,
            xoffset: 15,
            font: {
              family: 'Avenir Next LT Pro Regular',
              style: 'normal',
              weight: 'normal',
              size: 11,
            },
          },
        },
      ],
    });

    const maintenanceSymbol = new SimpleFillSymbol({
      color: [0, 0, 0, 0],
      style: 'solid',
      outline: {
        color: 'hsl(278, 31%, 59%)',
        width: 1.75,
        style: 'dash-dot',
      },
    });

    txdotMaintenanceFeautureLayer.renderer = new SimpleRenderer({
      symbol: maintenanceSymbol,
    });

    return txdotMaintenanceFeautureLayer;
  }

  getMaintenanceSectionsFeatureLayer(): FeatureLayer {
    if (!this.layersSet) {
      this.setFeatureLayers();
    }
    return this._MaintenanceSectionsLayer as FeatureLayer;
  }

  setDistrictFeatureLayer(): Layer {
    const aahPopupDistricts = {
      title: 'TxDOT Districts',
      content: [
        {
          type: 'fields',
          fieldInfos: [
            {
              fieldName: 'DIST_NM',
              label: 'District Name',
            },
            {
              fieldName: 'DIST_NBR',
              label: 'District Number',
            },
            {
              fieldName: 'DIST_ABRVN',
              label: 'District Abbreviation',
            },
          ],
        },
      ],
    };

    const txdotDistrictsFeautureLayer = new FeatureLayer({
      url: environment.txdotDistrictsFS,
      title: 'TxDOT Districts',
      outFields: ['DIST_NM'],
      legendEnabled: true,
      popupTemplate: aahPopupDistricts,
      listMode: 'show',
      visible: false,
    });

    const districtSymbol = new SimpleFillSymbol({
      color: [0, 0, 0, 0],
      style: 'solid',
      outline: {
        color: 'hsl(100, 38%, 37%)',
        width: 3.5,
        style: 'solid',
      },
    });

    txdotDistrictsFeautureLayer.renderer = new SimpleRenderer({
      symbol: districtSymbol,
    });

    return txdotDistrictsFeautureLayer;
  }

  getDistrictFeatureLayer(): FeatureLayer {
    if (!this.layersSet) {
      this.setFeatureLayers();
    }
    return this._DistrictsLayer as FeatureLayer;
  }

  setCountiesFeatureLayer(): Layer {
    const aahPopupCounties = {
      title: 'TxDOT Counties',
      content: [
        {
          type: 'fields',
          fieldInfos: [
            {
              fieldName: 'CNTY_NM',
              label: 'County Name',
            },
            {
              fieldName: 'CNTY_NBR',
              label: 'County Number',
            },
            {
              fieldName: 'DIST_NM',
              label: 'District Name',
            },
          ],
        },
      ],
    };

    const txdotCountiesFeautureLayer = new FeatureLayer({
      url: environment.txdotCountiesFS,
      title: 'TxDOT Counties',
      outFields: ['CNTY_NM'],
      legendEnabled: true,
      popupTemplate: aahPopupCounties,
      minScale: 0,
      maxScale: 0,
      listMode: 'show',
      visible: false,
      labelingInfo: [
        {
          labelExpressionInfo: { expression: '$feature.CNTY_NM' },
          minScale: 300000,
          maxScale: 10000,
          symbol: {
            type: 'text', // autocasts as new TextSymbol()
            color: 'hsl(216, 2%, 51%)',
            haloSize: 2,
            haloColor: 'white',
            font: {
              family: 'Arial',
              style: 'normal',
              weight: 'normal',
              size: 12,
            },
          },
        },
      ],
    });


    const CountySymbol = new SimpleFillSymbol({
      color: [0, 0, 0, 0],
      style: 'solid',
      outline: {
        color: 'hsl(216, 2%, 51%)',
        width: 3.5,
        style: 'short-dot',
      },
    });

    txdotCountiesFeautureLayer.renderer = new SimpleRenderer({
      symbol: CountySymbol,
    });

    return txdotCountiesFeautureLayer;
  }

  getCountyFeatureLayer(): FeatureLayer {
    if (!this.layersSet) {
      this.setFeatureLayers();
    }
    return this._CountiesLayer as FeatureLayer;
  }

  setReferenceMarkersFeatureLayer(): Layer {
    const aahPopupreferenceMarkers = {
      title: 'Reference Marker Info',
      content: [
        {
          type: 'fields',
          fieldInfos: [
            {
              fieldName: 'MRKR_NBR',
              label: 'Reference Marker Number',
            },
            {
              fieldName: 'RTE_NM',
              label: 'Route Name',
            },
            {
              fieldName: 'DFO',
              label: 'DFO',
            },
          ],
        },
      ],
    };

    const txdotReferenceMarkersFeatureLayer = new FeatureLayer({
      url: environment.txdotReferenceMarkersFS,
      title: 'TxDOT Reference Markers',
      outFields: ['*'],
      popupTemplate: aahPopupreferenceMarkers,
      minScale: 0,
      maxScale: 0,
      legendEnabled: true,
      listMode: 'show',
      visible: false,
      labelsVisible: true,
      labelingInfo: [
        {
          labelExpressionInfo: { expression: '$feature.MRKR_NBR' },
          maxScale: 0,
          minScale: 240000,
          labelPlacement: 'above-center',
        },
      ],
    });
    return txdotReferenceMarkersFeatureLayer;
  }

  getReferenceMarkerlayer(): FeatureLayer {
    if (!this.layersSet) {
      this.setFeatureLayers();
    }
    return this._referenceMarkerLayer as FeatureLayer;
  }

  turnOnRoadNetwork() {
    //need to only show on network roads during the drawing process
    // update road symbology
    const roadsRenderer = {
      type: 'simple', // autocasts as new SimpleRenderer()
      symbol: {
        type: 'simple-line',
        cap: 'round',
        join: 'round',
        width: 8,
        color: 'hsla(179, 78.5%, 52.5%, .45)',
      },
    };

    const roadLayer = this._roadNetworkLayer as FeatureLayer;
    roadLayer.definitionExpression = environment.roadNetworkLayerWhereClause;
    // @ts-ignore
    roadLayer.renderer = roadsRenderer;

    //turn on the roadNetwork layer for snapping
    if (!this._roadNetworkLayer.visible) {
      this._roadNetworkLayer.visible = true;
    }
  }

  turnOffRoadNetwork() {
    //turn off the roadNetwork layer for snapping
    if (this._roadNetworkLayer.visible) {
      this._roadNetworkLayer.visible = false;
    }
    //clear out the lay def that was set when the layer was turned on
    const roadLayer = this._roadNetworkLayer as FeatureLayer;
    roadLayer.definitionExpression = '';
  }

  turnOnMaintenanceLayer() {
    //turn on the roadNetwork layer for snapping
    if (!this._MaintenanceSectionsLayer.visible) {
      this._MaintenanceSectionsLayer.visible = true;
    }
  }

  turnOffMaintenanceLayer() {
    //turn off the roadNetwork layer for snapping
    if (this._MaintenanceSectionsLayer.visible) {
      this._MaintenanceSectionsLayer.visible = false;
    }
  }

  checkFields(layer: FeatureLayer) {
    const missingFields = [];
    layer.when(() => {
      for (const val of environment.AAHfeatureFields) {
        if (!layer.fieldsIndex.get(val)) {
          missingFields.push(val);
        }
      }
      if (missingFields.length > 0) {
        let missingVals = '';
        for (const mvals of missingFields) {
          missingVals += mvals + ' ';
        }
        console.warn(
          'FieldsService.checkFields Error, Field(s) [' +
            missingVals +
            '] missing from the AAH Feature Service ',
        );
        // throw new Error ("FieldsService.checkFields Error, Field [" + missingVals + "] is missing from the AAH Feature Service ")
      }
    });
  }

  dockPopup(view: MapView) {
    //enable docking
    view.popup.dockEnabled = true;
    view.popup.dockOptions = {
      position: 'bottom-center',
    };
  }
}
