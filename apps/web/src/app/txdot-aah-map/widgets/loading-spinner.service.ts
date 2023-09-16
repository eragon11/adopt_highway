import { Injectable } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import * as watchUtils from '@arcgis/core/core/watchUtils';
@Injectable({
  providedIn: 'root',
})

export class LoadingSpinnerService {
  // attaches the watcher when page is initialized  - thus loads preloader
  // mouse zoom/pan, buttons zoom +/-, & home/locate buttons
  attachLoadingSpinner(view, segmentFL) {
    view.whenLayerView(segmentFL).then((layerView) => {
      const loadingContainer = document.getElementById('loading-container');
      watchUtils.whenTrue(layerView, 'updating', function () {
        if (view.interacting || !view.stationary) {
          if (loadingContainer) loadingContainer.style.display = 'block';
        }
      });
      watchUtils.whenFalse(layerView, 'updating', function () {
        if (!view.interacting) {
          if (loadingContainer) loadingContainer.style.display = 'none';
        }
      });
    });
  }
  // attaches once when user changes segment status, zoom dropdowns, and role selector
  getLoadingSpinner(view, segmentFL) {
    view.whenLayerView(segmentFL).then((layerView) => {
      const loadingContainer = document.getElementById('loading-container');
      watchUtils.whenTrueOnce(layerView, 'updating', function () {
        if (loadingContainer) loadingContainer.style.display = 'block';
      });
      watchUtils.whenFalseOnce(layerView, 'updating', function () {
        if (loadingContainer) loadingContainer.style.display = 'none';
      });
    });
  }
}
