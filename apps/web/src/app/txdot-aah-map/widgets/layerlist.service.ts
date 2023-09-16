import { Injectable } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import LayerList from '@arcgis/core/widgets/LayerList';
import { environment } from 'src/environments/environment';
import { FilterDropdownService} from './filter-dropdown.service';
import { LayersService } from './layers.service';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Basemap from '@arcgis/core/Basemap';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';

@Injectable({
  providedIn: 'root',
})

export class LayerlistService {
  constructor(
    public filter: FilterDropdownService,
    private layers: LayersService,
  ) {}

  private _view: MapView;

  setLayerListWidget(view: MapView, container: string) {
    this._view = view;

    const segmentStatusSelector = document.getElementById(
      environment.segmentStatusCheckboxId,
    );

    function layerListItems(event) {
      // Get the item in the layerlist
      const item = event.item;
      if (
        item.layer.type !== 'group' &&
        item.title == environment.AAHFeatureLayerTitle
      ) {
        item.watch('visible', (ev) => {
          const segmentStatusElement = item.panel.content[0];
          if (ev) {
            segmentStatusElement.hidden = false;
          } else {
            segmentStatusElement.hidden = true;
          }
        });
        item.panel = {
          content: [segmentStatusSelector, 'legend'],
          className: 'esri-icon-chart',
          open: item.visible,
        };
      } else {
        item.panel = {
          content: ['legend'],
          className: 'esri-icon-chart',
          open: item.visible,
        };
      }
    }

    view.when(() => {
      const layerList = new LayerList({
        view: view,
        selectionEnabled: true,
        container: container,
        listItemCreatedFunction: layerListItems,
      });

      const txdotBasemap = new Basemap({
        baseLayers: [
          new VectorTileLayer({
            title: 'TxDOT Basemap',
            url: environment.txdotBasemapFS,
            visible: true,
          }),
        ],
        id: 'TxDOT Basemap',
        title: 'TxDOT Basemap',
        thumbnailUrl: environment.txdotBmThumbnail,
      });

      const txdotGryBasemap = new Basemap({
        baseLayers: [
          new VectorTileLayer({
            portalItem: {
              id: '507a9905e7154ce484617c7327ee8bc4',
            },
          }),
        ],
        id: 'TxDOT Light Gray Basemap',
        title: 'TxDOT Light Gray Basemap',
        thumbnailUrl: environment.txdotLtGryThumbnail,
      });

      const accessibleBasemap = new Basemap({
        portalItem: {
          id: '64d70a0e9d4646fcacb5469dcf0e7634', // Accessible Basemap Gray version 2
        },
      });

      const basemapGallery = new BasemapGallery({
        view: view,
        container: container,
        source: [
          txdotBasemap,
          txdotGryBasemap,
          accessibleBasemap,
          Basemap.fromId('hybrid'),
          Basemap.fromId('streets-navigation-vector'),
          Basemap.fromId('streets-vector'),
        ],
      });
      view.ui.add(basemapGallery, 'top-right');

      layerList.operationalItems.on('before-add', (event) => {
        if (event.item.layer.type == 'graphics') {
          event.preventDefault();
        }
      });

      view.ui.add(layerList, 'top-right');
    });
  }
}
