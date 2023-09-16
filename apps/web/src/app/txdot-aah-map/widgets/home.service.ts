import { Injectable } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import Home from '@arcgis/core/widgets/Home';
import { ZoomService } from './zoom.service';
import Extent from '@arcgis/core/geometry/Extent';
import Viewpoint from '@arcgis/core/Viewpoint';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private homeWidget;

  constructor(
    private zoom: ZoomService,
  ) { }

  setHomeWidget(view: MapView, container: string) {
    this.zoom.getRoleExtent().then(extent => {
      this.homeWidget = new Home({
        view: view,
        container: container,
        viewpoint: {
          targetGeometry: extent.extent
        }
      });
    })
  }

  setHome(extent: Extent) {
    let vp = new Viewpoint ({
      targetGeometry: extent.extent
    })
    this.homeWidget.viewpoint = vp;
  }

  zoomTo() {
    if (this.homeWidget) {
      this.homeWidget.go()
    }
  }

  getHomeWidget(): Home {
    return this.homeWidget;
  }
}
