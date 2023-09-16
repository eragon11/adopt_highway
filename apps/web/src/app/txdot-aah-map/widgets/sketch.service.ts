/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import MapView from '@arcgis/core/views/MapView';
import { TxdotAahDefaultMapService } from '../txdot-aah-default-map.service';
import { LayersService } from './layers.service';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Polyline from '@arcgis/core/geometry/Polyline';
import Polygon from '@arcgis/core/geometry/Polygon';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import { FeatureFormsService } from './feature-forms.service';
import { AuthenticationService } from 'src/app/auth/_services';
import { PermissionsService } from 'src/app/auth/_services/permissions.service';
import Extent from '@arcgis/core/geometry/Extent';
import Query from '@arcgis/core/rest/support/Query';
import Geometry from '@arcgis/core/geometry/Geometry';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as watchUtils from '@arcgis/core/core/watchUtils';

@Injectable({
  providedIn: 'root',
})
export class SketchService {
  constructor(
    public layers: LayersService,
    public defaultWebmap: TxdotAahDefaultMapService,
    public authService: AuthenticationService,
    public permissions: PermissionsService,
    public featureForm: FeatureFormsService,
    public snackBar: MatSnackBar,
  ) {}

  private insertSketchViewModel: SketchViewModel = null;
  private updateSketchViewModel: SketchViewModel = null;

  private crossesBoundary: boolean;
  private intersectsSegment: boolean;
  private intersectsItself: boolean;

  roadsGL: GraphicsLayer;
  sketchGL: GraphicsLayer;
  sketchLength = 0;
  finalLength = 0;
  drawState = 'open';
  editFeature: Graphic;
  editFeatureCopy: Graphic;
  update = false;
  isCancel = false;
  view: MapView;
  aahLayer: FeatureLayer;
  boundaryFL: FeatureLayer;
  svm: SketchViewModel;
  // TODO: add an instructional widget
  private instructionsExpand: any = null;
  maintenanceRole = false;

  setupRoadSelection(
    view: MapView,
    editFeature?: Graphic,
    segmentClickGeom?: Geometry,
  ) {
    this.sketchLength = 0;
    this.finalLength = 0;
    this.view = view;
    this.drawState = 'open';
    this.aahLayer = this.layers.getAAHSegmentsFeatureLayer();

    // Construct the temp segment sketch graphic layer
    const tempLayerID = 'sketchID';
    const tempLayerTitle = 'Temp Insert Layer';
    if (!this.sketchGL) {
      this.sketchGL = new GraphicsLayer({
        id: tempLayerID,
        title: tempLayerTitle,
      });
    }

    const roadsLyr = this.layers.getRoadNetworkFeatureLayer();

    this.boundaryFL = this.layers.getMaintenanceSectionsFeatureLayer();

    // if there is an edit feature, an update is occurring
    if (editFeature) {
      this.update = true;
      this.editFeature = editFeature.clone();
      this.editFeatureCopy = editFeature.clone();
      const query = new Query({
        geometry: segmentClickGeom,
        spatialRelationship: 'intersects', // within,
        distance: 6 * view.resolution,
        where: environment.roadNetworkLayerWhereClause,
        returnGeometry: true,
      });
      // find the corresponding road graphic by first querying spatially
      roadsLyr.queryFeatures(query).then((results) => {
        console.log(results);
        this.layers.turnOnMaintenanceLayer();
        // Construct the road graphic layer. to which a road graphic
        // will be added for snapping

        // @ts-ignore
        this.view.map.layers.items.forEach((layer, i) => {
          console.log(i, layer.title);
        });

        if (!this.roadsGL) {
          this.roadsGL = new GraphicsLayer({
            id: 'selectedRoad',
            title: 'Selected Road',
          });
        }

        const roadGraphicsArr = [];
        // no corresponding graphics found
        if (results.features.length === 0) {
          console.log('corresponding road could not be found');
        } else if (results.features.length > 0) {
          results.features.forEach((feature, index) => {
            const roadGraphic = feature.clone();
            roadGraphic.symbol = {
              type: 'simple-line',
              cap: 'round',
              join: 'round',
              width: 10,
              // @ts-ignore
              color: [39, 229, 227, 0.3], // aqua
            };
            roadGraphicsArr.push(roadGraphic);
          });
          this.roadsGL.addMany(roadGraphicsArr);
          view.map.add(this.roadsGL);
          // one match
          if (results.features.length === 1) {
            this.drawState = 'selected';

            this.view.goTo({ target: this.editFeature, zoom: this.view.zoom });
            // user can now edit
            this.setupSketchViewModel();
          }
          // multiple matches. user must select graphic to then edit
          else {
            this.drawState = 'select';
            this.getSelectedRoadGraphic(this.roadsGL);
          }
        }
      });
    } else {
      // Turn on Maintenance section and TxDOT road network feature layers in the map
      this.layers.turnOnMaintenanceLayer();
      this.layers.turnOnRoadNetwork();
      this.getSelectedRoadGraphic(null, roadsLyr);
    }
  }

  getSelectedRoadGraphic(
    graphicsLayer?: GraphicsLayer,
    featureLayer?: FeatureLayer,
  ) {
    // attempt to disable popups
    this.view.on('click', (evt) => {
      this.sketchLength = 0;
      this.view.popup.close();

      // if update, a GL is passed in; new feature is a FL
      let opts: any;
      if (graphicsLayer) {
        opts = {
          include: graphicsLayer,
        };
      } else {
        opts = {
          include: featureLayer,
        };
      }
      // check if road clicked...

      this.view.hitTest(evt, opts).then((hitResult: any) => {
        if (hitResult.results.length) {
          this.view.popup.close();
          this.drawState = 'selected';
          this.layers.turnOffRoadNetwork();
          // ...yes, road selected
          const roadGraphic = hitResult.results[0].graphic.clone();
          roadGraphic.symbol = {
            type: 'simple-line',
            cap: 'round',
            join: 'round',
            width: 10,
            // @ts-ignore
            color: [255, 255, 0, 0.3], // yellow
          };
          // Construct the road graphic layer. to which a road graphic
          // will be added for snapping
          if (!this.roadsGL) {
            this.roadsGL = new GraphicsLayer({
              id: 'selectedRoad',
              title: 'Selected Road',
            });
          }
          this.roadsGL.removeAll();
          this.roadsGL.add(roadGraphic);

          if (!this.view.map.findLayerById('selectedRoad')) {
            this.view.map.add(this.roadsGL);
          }

          if (this.update) {
            this.view.goTo({ target: this.editFeature, zoom: this.view.zoom });
          } else {
            this.view.goTo({ target: evt.mapPoint, zoom: this.view.zoom });
          }

          this.setupSketchViewModel();
        }
      });
    });
  }

  setupSketchViewModel() {
    this.view.constraints.minZoom = 12;
    // Add user edit boundary extent - this will be used to monitor where the user is editing
    // and stop the sketch feature if they are out of their role's edit Maintenance section
    const roleType = this.authService.getSelectedRoleType();
    if (roleType === environment.maintenanceRoleType) {
      this.maintenanceRole = true;
    }

    if (this.view.map.findLayerById('sketchID')) {
      this.sketchGL.visible = true;
    }

    if (this.update) {
      this.svm = this.getUpdateSketchViewModel();
      if (this.svm.state == 'active') {
        return;
      }
      this.sketchGL.graphics.add(this.editFeature);
      this.sketchLength = this.getSegmentLength(this.editFeature);

      //remove the original feature from the map
      if (this.aahLayer.definitionExpression) {
        this.aahLayer.definitionExpression = `${this.aahLayer.definitionExpression} AND OBJECTID <> ${this.editFeature.attributes.OBJECTID}`;
      } else {
        this.aahLayer.definitionExpression =
          'OBJECTID <> ' + this.editFeature.attributes.OBJECTID;
      }
      console.warn(
        `Layer def after update :${this.aahLayer.definitionExpression}:`,
      );
      this.setSketchViewModelCreateEventHandler();
      this.svm.update(this.editFeature, { tool: 'reshape' });
    } else {
      this.svm = this.getCreateSketchViewModel();
      if (this.svm.state == 'active') {
        return;
      }
      this.setSketchViewModelCreateEventHandler();
      this.svm.create('polyline', { mode: 'hybrid' });
      //Ok, now lets setup the feature to be edited
    }
  }

  setSketchViewModelCreateEventHandler() {
    this.isCancel = false;
    if (this.update) {
      this.view.on('double-click', (evt) => {
        if (this.svm.state !== 'active') {
          console.log('inactive');
        } else {
          this.svm.complete();
          evt.stopPropagation();
        }
      });
    }

    const blackFill = {
      type: 'simple-line',
      color: 'black',
      width: '4',
      style: 'short-dot',
    };

    this.svm.on('create', (event: any) => {
      if (event.state === 'start') {
      } else if (event.state === 'complete') {
        this.view.constraints.minZoom = 5;
        this.drawState = 'drawn';

        if (event.graphic && !this.isCancel) {
          const sketchExtent: Extent = event.graphic.geometry.extent;
          const sketchBuffer = geometryEngine.buffer(sketchExtent, 100, 'feet');

          // @ts-ignore
          const snapGeom = this.roadsGL.graphics.items[0].geometry;
          const segmentGeom = geometryEngine.clip(
            snapGeom,
            // @ts-ignore
            sketchBuffer.extent,
          ) as Polyline;
          const segmentGraphic = new Graphic({
            geometry: segmentGeom,
            symbol: blackFill,
          });
          this.finalLength = this.getSegmentLength(segmentGraphic);

          // confirm non-multipart geom
          if (segmentGeom.paths.length !== 1) {
            this.snackBar.open(
              `Please redraw the segment.  Draw closely along the road segment.`,
              '',
              {
                duration: 6000,
                verticalPosition: 'top',
                panelClass: 'custom-snackbar',
              },
            );
            this.sketchGL.removeAll();
            this.setupSketchViewModel();
          } else {
            const whereClause = this.permissions.getZoomWhereClause();
            const validationMessages = [
              'Segment cannot overlap another segment.',
              'Segment cannot overlap itself.',
              'Segment cannot fall within multiple Maintenance Sections.',
            ];
            this.validateSegment(event.graphic, whereClause).then(
              (validArr) => {
                console.log(validArr);
                // confirm all checks return valid (false)
                if (validArr.every((e) => !e)) {
                  this.sketchGL.removeAll();
                  if (!this.view.map.findLayerById('sketchID')) {
                    this.view.map.add(this.sketchGL);
                  }
                  this.sketchGL.graphics.add(segmentGraphic);
                } else {
                  validArr.forEach((geomCheck, i) => {
                    if (geomCheck) {
                      this.snackBar.open(
                        `${validationMessages[i]} Please re-draw the segment.`,
                        '',
                        {
                          duration: 6000,
                          verticalPosition: 'top',
                          panelClass: 'custom-snackbar',
                        },
                      );
                    }
                  });

                  this.sketchGL.removeAll();
                  this.setupSketchViewModel();
                }
              },
            );
          }
        } else if (this.isCancel) {
          this.sketchGL.removeAll();
          this.roadsGL.removeAll();
          this.isCancel = false;
        }
      }
      if (event.state === 'active') {
        this.sketchLength = this.getSegmentLength(event.graphic);
      }
    });

    this.svm.on('update', (event: any) => {
      if (
        event.toolEventInfo &&
        event.toolEventInfo.type.includes('move-start')
      ) {
        this.svm.cancel();
      }
      if (event.state === 'start') {
      } else if (event.state === 'complete') {
        this.view.constraints.minZoom = 5;
        // if graphic has been updated...
        if (event.graphics && !this.isCancel) {
          if (this.roadsGL.graphics.length) {
            this.drawState = 'drawn';

            const sketchExtent: Extent = event.graphics[0].geometry.extent;
            const sketchBuffer = geometryEngine.buffer(
              sketchExtent,
              100,
              'feet',
            );

            // @ts-ignore
            const snapGeom = this.roadsGL.graphics.items[0].geometry;
            const segmentGeom = geometryEngine.clip(
              snapGeom,
              // @ts-ignore
              sketchBuffer.extent,
            ) as Polyline;
            const segmentGraphic = new Graphic({
              geometry: segmentGeom,
              symbol: blackFill,
            });
            this.finalLength = this.getSegmentLength(segmentGraphic);

            // confirm non-multipart geom
            if (segmentGeom.paths.length !== 1) {
              this.snackBar.open(
                `Please re-do geometry updates.  Draw along the road segment.`,
                '',
                {
                  duration: 6000,
                  verticalPosition: 'top',
                  panelClass: 'custom-snackbar',
                },
              );
              this.editFeature = this.editFeatureCopy.clone();
              this.sketchGL.removeAll();
              this.setupSketchViewModel();
            } else {
              const whereClause = this.permissions.getZoomWhereClause();
              const validationMessages = [
                'Segment cannot overlap another segment.',
                'Segment cannot overlap itself.',
                'Segment cannot fall within multiple Maintenance Sections.',
              ];
              this.validateSegment(event.graphics[0], whereClause).then(
                (validArr) => {
                  console.log(validArr);
                  // confirm all checks return valid (false)
                  if (validArr.every((e) => !e)) {
                    this.sketchGL.removeAll();
                    if (!this.view.map.findLayerById('sketchID')) {
                      this.view.map.add(this.sketchGL);
                    }
                    this.sketchGL.graphics.add(segmentGraphic);
                  } else {
                    validArr.forEach((geomCheck, i) => {
                      if (geomCheck) {
                        this.snackBar.open(
                          `${validationMessages[i]} Please re-draw the segment.`,
                          '',
                          {
                            duration: 6000,
                            verticalPosition: 'top',
                            panelClass: 'custom-snackbar',
                          },
                        );
                      }
                    });
                    this.editFeature = this.editFeatureCopy.clone();
                    this.sketchGL.removeAll();
                    this.setupSketchViewModel();
                  }
                },
              );
            }
          }
        } else if (this.isCancel) {
          this.sketchGL.removeAll();
          this.roadsGL.removeAll();
          this.isCancel = false;
        }
      }
      if (event.state === 'active') {
        this.sketchLength = this.getSegmentLength(event.graphics[0]);
      }
    });
  }

  getCreateSketchViewModel(): SketchViewModel {
    this.insertSketchViewModel = new SketchViewModel({
      view: this.view,
      layer: this.sketchGL,
      // creationMode: "single",
      defaultCreateOptions: {
        // set the default options for the create operations
        mode: 'freehand',
      },
      polylineSymbol: {
        type: 'simple-line',
        color: [0, 0, 0, 1], // black
        width: '4px',
        style: 'short-dot',
      },
      defaultUpdateOptions: {
        enableRotation: false,
        enableScaling: false,
        reshapeOptions: {
          edgeOperation: 'none',
          shapeOperation: 'none',
        },
      },
      snappingOptions: {
        enabled: true,
        featureEnabled: true,
        selfEnabled: true,
        featureSources: [
          {
            // @ts-ignore
            layer: this.roadsGL,
          },
        ],
        distance: 25,
      },
    });
    return this.insertSketchViewModel;
  }

  getUpdateSketchViewModel(): SketchViewModel {
    if (!this.view.map.findLayerById('sketchID')) {
      this.view.map.add(this.sketchGL);
    }
    this.updateSketchViewModel = new SketchViewModel({
      view: this.view,
      layer: this.sketchGL,
      updateOnGraphicClick: false,
      defaultUpdateOptions: {
        enableRotation: false,
        enableScaling: false,
        reshapeOptions: {
          edgeOperation: 'none',
          shapeOperation: 'none',
        },
      },
      polylineSymbol: {
        type: 'simple-line',
        color: [0, 0, 0, 0],
        width: '4px',
        style: 'short-dot',
      },
      snappingOptions: {
        enabled: true,
        featureEnabled: true,
        featureSources: [
          {
            // @ts-ignore
            layer: this.roadsGL,
          },
        ],
      },
    });
    return this.updateSketchViewModel;
  }

  isCreateSketchViewModelActive(): boolean {
    const stateValues = ['active'];
    if (this.insertSketchViewModel === null) {
      return false;
    } else {
      console.log('insert sketch state: ' + this.insertSketchViewModel.state);
      if (stateValues.indexOf(this.insertSketchViewModel.state) > -1) {
        return true;
      } else {
        return false;
      }
    }
  }

  isUpdateSketchViewModelActive(): boolean {
    const stateValues = ['active', 'ready', 'disabled'];
    if (this.updateSketchViewModel === null) {
      return false;
    } else {
      console.log('insert sketch state: ' + this.updateSketchViewModel.state);
      if (stateValues.indexOf(this.updateSketchViewModel.state) > -1) {
        return true;
      } else {
        return false;
      }
    }
  }

  getSegmentLength(segment: Graphic) {
    const sketchLength = geometryEngine.geodesicLength(
      segment.geometry,
      'miles',
    );
    return sketchLength;
  }

  createLineSymbol(color, style, width) {
    return {
      type: 'simple-line',
      color: color,
      style: style,
      width: width,
    };
  }

  createBoundarySymbol(roleType: string) {
    const boundaryColor = this.maintenanceRole
      ? [124, 89, 143, 90]
      : [0, 128, 0];

    return {
      type: 'simple-fill',
      color: [0, 0, 0, 0], // black
      outline: {
        color: boundaryColor,
        width: 5,
      },
    };
  }

  validateSegment(segmentSketch, whereClause?: string) {
    // Get the segment graphic once complete and updated

    const intersectsOther = this.intersectsOtherSegment(segmentSketch);
    const intersectsSelf = this.intersectsSelf(segmentSketch);

    let validateArr = [];
    if (this.maintenanceRole) {
      const crossesBoundary = this.containsSegment(segmentSketch, whereClause);
      validateArr = [intersectsOther, intersectsSelf, crossesBoundary];
    } else {
      validateArr = [intersectsOther, intersectsSelf];
    }

    const ruleResults = Promise.all(validateArr).then((validateArr) => {
      return validateArr;
    });

    return ruleResults;
  }

  containsSegment(segmentSketch, whereClause: string) {
    const query = this.boundaryFL.createQuery();
    query.where = whereClause;
    query.returnGeometry = true;
    query.outFields = ['*'];

    return this.boundaryFL.queryFeatures(query).then((featureSet) => {
      // @ts-ignore
      const boundaryGeometry = featureSet.features[0].geometry.rings;
      const boundaryPolygon = new Polygon({
        rings: boundaryGeometry,
        spatialReference: this.boundaryFL.spatialReference,
      });

      // Check that the segment is contained by the MO boundary
      // as the graphic is being updated/created
      const containsSegment = geometryEngine.contains(
        boundaryPolygon,
        segmentSketch.geometry,
      );
      this.crossesBoundary = !containsSegment;
      return this.crossesBoundary;
    });
  }

  intersectsSelf(segmentSketch) {
    this.intersectsItself = this.isSelfIntersecting(segmentSketch.geometry);
    return this.intersectsItself;
  }

  intersectsOtherSegment(segmentSketch) {
    return this.view
      .whenLayerView(this.aahLayer)
      .then((layerView) => {
        return watchUtils
          .whenFalseOnce(layerView, 'updating')
          .then((layerView) => {
            // Get the segments from the layerView that are in the view's extent in order to create a polyline for the geometryEngine to do
            // an intersect analysis on
            return layerView.target
              .queryFeatures({
                geometry: this.view.extent,
                returnGeometry: true,
              })
              .then((results) => {
                const roadBuffer = geometryEngine.geodesicBuffer(
                  // @ts-ignore
                  this.roadsGL.graphics.items[0].geometry,
                  100,
                );

                const segmentPaths = results.features
                  .filter((feature) => {
                    // only capture segments that are along the same roadway
                    return geometryEngine.contains(
                      // @ts-ignore
                      roadBuffer,
                      feature.geometry,
                    );
                  })
                  .map((feature) => {
                    return feature.geometry.paths[0];
                  });

                if (segmentPaths.length > 0) {
                  const segmentPolylines = new Polyline({
                    hasZ: false,
                    hasM: false,
                    paths: segmentPaths,
                    spatialReference: this.aahLayer.spatialReference,
                  });

                  // intersect is not always catching overlaps, so instead, check for when the distance between the sketch and other segments === 0

                  // this.intersectsSegment = geometryEngine.intersects(
                  //   segmentSketch.geometry,
                  //   segmentPolylines,
                  // );

                  const intersectDist = geometryEngine.distance(
                    segmentPolylines,
                    segmentSketch.geometry,
                  );

                  if (intersectDist < 20) {
                    this.intersectsSegment = true;
                  } else {
                    this.intersectsSegment = false;
                  }
                  return this.intersectsSegment;
                } else {
                  this.intersectsSegment = false;
                  return this.intersectsSegment;
                }
              });
          });
      })
      .catch((err) => {
        console.log(
          'Error querying segments within view.extent of the LayerView: ',
          err,
        );
      });
  }

  isSelfIntersecting(polyline) {
    if (polyline.paths[0].length < 3) {
      return false;
    }
    const line = polyline.clone();
    //get the last segment from the polyline that is being drawn
    const lastSegment = this.getLastSegment(polyline);
    line.removePoint(0, line.paths[0].length - 1);
    // returns true if the line intersects itself, false otherwise
    return geometryEngine.crosses(lastSegment, line);
  }

  getLastSegment(polyline) {
    const line = polyline.clone();
    const lastXYPoint = line.removePoint(0, line.paths[0].length - 1);
    const existingLineFinalPoint = line.getPoint(0, line.paths[0].length - 1);

    const lastSegment = new Polyline({
      spatialReference: this.view.spatialReference,
      hasZ: false,
      hasM: false,
      paths: [
        [
          [existingLineFinalPoint.x, existingLineFinalPoint.y],
          [lastXYPoint.x, lastXYPoint.y],
        ],
      ],
    });
    return lastSegment;
  }
}
