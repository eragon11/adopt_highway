import { Injectable } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import Locate from '@arcgis/core/widgets/Locate';

@Injectable({
  providedIn: 'root',
})
export class LocateService {
  private locateWidget;

  setLocateWidget(view: MapView, container: string) {
    const locate = new Locate({
      view: view,
      container: container,
      useHeadingEnabled: false,
      goToLocationEnabled: true,
      geolocationOptions: {
        maximumAge: 3,
        timeout: 40000,
        enableHighAccuracy: true,
      }
    });
    this.locateWidget = locate;
  }

  getLocateWidget(): Locate {
    return this.locateWidget;
  }
}
