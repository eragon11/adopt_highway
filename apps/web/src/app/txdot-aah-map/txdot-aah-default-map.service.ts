/*
This service is primarily responsible for getting the Adopt A Higway default map
which includes the TXDOT approved basemap, the road network feature service
and the AAH segments feature service

*/

import { Injectable } from '@angular/core';
import WebMap from '@arcgis/core/WebMap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { LayersService } from './widgets/layers.service';
import Layer from '@arcgis/core/layers/Layer';
import { environment } from 'src/environments/environment';


@Injectable({
  //todo: this may need to move down to the map component
  providedIn: 'root',
})
export class TxdotAahDefaultMapService {
  constructor(private layers: LayersService) {}

  private _webmap: WebMap;

  getDefaultWebMap(): WebMap {
    const layers = this.layers.getFeatureLayers();
    const aahDefaultWebMap = new WebMap({
      basemap: this.layers.getTxdotBasemap(),
      layers: layers,
    });

    //set the webmap in the layers service for use later
    this.layers.setWebMap(aahDefaultWebMap);

    this._webmap = aahDefaultWebMap;

    return aahDefaultWebMap;
  }

  getWebMap(): WebMap {
    console.log('Getting default web map ' + this._webmap);
    if (!this._webmap) {
      this.getDefaultWebMap();
    }
    return this._webmap;
  }

  removeAAHLayer () {
    let tempLayer = this.layers.getAAHSegmentsFeatureLayer();
    this._webmap.remove(tempLayer);
  }

  addLayer (layer: FeatureLayer) {
    this._webmap.add(layer);
  }
}
