import { Injectable } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import Zoom from '@arcgis/core/widgets/Zoom';
import { AuthenticationService } from 'src/app/auth/_services';
import { PermissionsService } from 'src/app/auth/_services/permissions.service';
import { LayersService } from './layers.service';
import { RoleType } from 'src/app/auth/_models/role-type';
import * as watchUtils from '@arcgis/core/core/watchUtils.js';
import Extent from '@arcgis/core/geometry/Extent';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ZoomService {

  constructor(
    private layers: LayersService,
    private authService: AuthenticationService,
    private permissions: PermissionsService
  ) { }
  private zoom;

  getRoleLayer (): FeatureLayer {
    const districtLayer = this.layers.getDistrictFeatureLayer();
    const maintenanceLayer = this.layers.getMaintenanceSectionsFeatureLayer();
    const roleType = this.authService.getSelectedRoleType();
    let zoomLayer;
    switch (roleType) {
      case RoleType.ReadOnlyUser:
      case RoleType.Administrator:
        zoomLayer = districtLayer;
        break;
      case RoleType.District:
        zoomLayer = districtLayer;
        break;
      case RoleType.Maintenance:
        zoomLayer = maintenanceLayer;
        break;
    }
    return zoomLayer;
  }

  zoomToRoleArea (mpView: MapView) {
    // Zoom the mapview based on role type
    const whereClause = this.permissions.getZoomWhereClause();
    const zoomLayer = this.getRoleLayer();

    // Only execute if the user is either a District or Maintenance coordinator
    // Administrator will zoom to home extent set in map view object construction
    if (zoomLayer) {
      mpView.whenLayerView(zoomLayer).then(layerView => {
        watchUtils.whenFalseOnce(layerView, "updating").then(status => {
          const query = zoomLayer.createQuery();
          query.where = whereClause;
          query.outSpatialReference = mpView.spatialReference;
          zoomLayer.queryExtent(query).then(results => {
            let returnPromise = mpView.goTo(results.extent)
            .catch(error => {
            });
          });
        })
      });
    }
  }

  zoomToDistrict (mpView: MapView, district: string) {
    const districtLayer = this.layers.getDistrictFeatureLayer();
    let whereClause = `${environment.DistrictWhereClause} '${district}'`
    mpView.whenLayerView(districtLayer).then(layerView => {
      watchUtils.whenFalseOnce(layerView, "updating").then(status => {
        const query = districtLayer.createQuery();
        query.where = whereClause;
        query.outSpatialReference = mpView.spatialReference;
        districtLayer.queryExtent(query).then(results => {
          if (results.extent) {
            mpView.goTo(results.extent)
            .catch(error => {
              console.error(`Got an error zooming to district: ${error}`)
            });
          }
        });
      })
    });
  }

  zoomToCounty (mpView: MapView, county: string) {
    const countyLayer = this.layers.getCountyFeatureLayer();
    let whereClause = `${environment.CountyWhereClause} '${county}'`
    mpView.whenLayerView(countyLayer).then(layerView => {
      watchUtils.whenFalseOnce(layerView, "updating").then(status => {
        const query = countyLayer.createQuery();
        query.where = whereClause;
        query.outSpatialReference = mpView.spatialReference;
        countyLayer.queryExtent(query).then(results => {
          if (results.extent) {
            mpView.goTo(results.extent)
            .catch(error => {
              console.error(`Got an error zooming to county: ${error}`)
            });
          }
        });
      })
    });
  }

  getRoleExtent(): Promise<Extent> {
    const whereClause = this.permissions.getZoomWhereClause();
    const zoomLayer = this.getRoleLayer();
    if (zoomLayer) {
      const query = zoomLayer.createQuery();
      query.where = whereClause;
      let test = zoomLayer.queryExtent(query).then(results => {
        return results.extent;
      });
      return test;
    } else {
      return null;
    }
  }

  setZoomWidget(view: MapView, container: string) {
    const zoomBtn = new Zoom({
      view: view,
      container: container,
    });
    this.zoom = zoomBtn;
  }

  getZoomWidget(): Zoom {
    return this.zoom;
  }
}
