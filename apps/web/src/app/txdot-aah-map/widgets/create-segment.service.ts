import { Injectable } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { FeatureFormsService } from './feature-forms.service';
import { LayersService } from './layers.service';
import { SketchService } from './sketch.service';
import { TxdotAahDefaultMapService } from '../txdot-aah-default-map.service';
import { environment } from './../../../environments/environment';
import Graphic from '@arcgis/core/Graphic';
import { PermissionsService } from 'src/app/auth/_services/permissions.service';
import { AuthenticationService } from 'src/app/auth/_services/authentication.service';
import * as watchUtils from '@arcgis/core/core/watchUtils';
import FeatureForm from '@arcgis/core/widgets/FeatureForm';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CreateSegmentService extends SketchService {
  constructor(
    layers: LayersService,
    defaultWebmap: TxdotAahDefaultMapService,
    auth: AuthenticationService,
    permission: PermissionsService,
    featureForm: FeatureFormsService,
    public snackBar: MatSnackBar,
  ) {
    super(layers, defaultWebmap, auth, permission, featureForm, snackBar);
  }
  createForm: FeatureForm;
  view: MapView;

  initializeCreateSegment(view: MapView) {
    view.ui.add('createWidget', 'bottom-left');
    this.view = view;
  }

  startCreateSegment(view: MapView) {
    // check if the create or update widgets are open
    if (
      !document
        .getElementById('createWidget')
        .classList.contains('esri-hidden') ||
      !document.getElementById('updateWidget').classList.contains('esri-hidden')
    ) {
      console.warn('Create sketch tool is currently active');
    } else {
      const aahLayer = this.layers.getAAHSegmentsFeatureLayer();
      this.setupCreateSegment(view, aahLayer);
      this.featureForm.showWidget('createWidget');
      document.getElementById('district').style.visibility = 'hidden';
      document.getElementById('county').style.visibility = 'hidden';
      document.getElementById('route').style.visibility = 'hidden';
      document.getElementById('measurementDiv').style.visibility = 'hidden';
      document.getElementById('homeLocateBtns').style.visibility = 'hidden';
      document.getElementById('addSegmentImg').style.visibility = 'collapse';
      // disable all view popup's during segment creation
      view.popup.autoOpenEnabled = false;
    }
  }

  setupCreateSegment(view: MapView, layer: FeatureLayer) {
    let editFeature: Graphic;
    this.createForm ? this.createForm.destroy() : null;
    this.createForm = this.featureForm.getCreateFeatureForm(layer);
    this.setupRoadSelection(view);
    this.featureForm.showWidget('createWidget');

    // Listen to the feature form's submit event.
    this.createForm.on('submit', () => {
      // create form submitted, so reenable the view's popups
      view.popup.autoOpenEnabled = true;
      if (this.sketchGL) {
        this.sketchGL.graphics.forEach((ele) => {
          editFeature = ele;
        });
      } else {
        throw new Error(
          'CreateSegmentService: setupCreateSegment: Expected the sketchGL to have a new feature but it does not',
        );
      }

      if (editFeature) {
        // Grab updated attributes from the form.
        const updated = this.createForm.getValues();
        // Loop through updated attributes and assign
        // the updated values to feature attributes.
        Object.keys(updated).forEach((name) => {
          editFeature.setAttribute(name, updated[name]);
        });
        this.createForm.feature = editFeature;
        this.saveSegment(layer, editFeature);
        this.view.map.remove(this.sketchGL);
        // this.sketchGL.destroy();
        this.layers.turnOffRoadNetwork();
        this.layers.turnOffMaintenanceLayer();
        this.featureForm.hideWidget('createWidget');
        this.createForm.destroy();
      }
    });
  }

  cancelSegment() {
    if (this.svm) {
      this.isCancel = true;
      this.svm.complete();
    }
    this.drawState = 'closed';
    // reenable to views popup's if the create event was canceled
    this.view.popup.autoOpenEnabled = true;
    this.featureForm.hideWidget('createWidget');
    this.layers.turnOffRoadNetwork();
    this.layers.turnOffMaintenanceLayer();
    this.createForm.destroy();

    this.restoreMap();
  }

  submitSegmentClick() {
    // Fires feature form's submit event.
    this.createForm.submit();
    this.restoreMap();
  }

  restoreMap() {
    console.log('before restore:');
    // @ts-ignore
    this.view.map.layers.items.forEach((layer, i) => {
      console.log(i, layer.title);
    });
    // remove graphics layers and restore UI
    if (this.view.map.findLayerById('sketchID')) {
      this.view.map.remove(this.sketchGL);
    }
    if (this.sketchGL) {
      this.sketchGL.removeAll();
    }

    if (this.view.map.findLayerById('selectedRoad')) {
      this.view.map.remove(this.roadsGL);
    }
    if (this.roadsGL) {
      this.roadsGL.removeAll();
    }
    console.log('after restore:');
    // @ts-ignore
    this.view.map.layers.items.forEach((layer, i) => {
      console.log(i, layer.title);
    });
    document.getElementById('district').style.visibility = 'visible';
    document.getElementById('county').style.visibility = 'visible';
    document.getElementById('route').style.visibility = 'visible';
    document.getElementById('measurementDiv').style.visibility = 'visible';
    document.getElementById('homeLocateBtns').style.visibility = 'visible';
    document.getElementById('addSegmentImg').style.visibility = 'visible';
  }

  saveSegment(AAHlayer: FeatureLayer, editFeature: Graphic) {
    const createdBy = this.authService.getUserName();
    const createdOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sLength = this.getSegmentLength(editFeature);
    editFeature.setAttribute(environment.segmentCreatedByFieldName, createdBy);
    editFeature.setAttribute(environment.segmentCreatedOnFieldName, createdOn);
    editFeature.setAttribute(environment.segmentLengthFieldName, sLength);
    // Show the create loading icon on submit for a newly created segment
    document.getElementById('loading-container-edit').style.display = 'block';

    // -----------------------------------  Apply Edits   ----------------------------
    const params = { addFeatures: [editFeature] };
    AAHlayer.applyEdits(params)
      .then((addResult) => {
        // Get the objectId of the newly added feature.
        // Call selectFeature function to highlight the new feature.
        if (addResult.addFeatureResults.length > 0) {
          if (addResult.addFeatureResults[0].error) {
            this.snackBar.open(
              `Could not create a new feature, error: ${addResult.addFeatureResults[0].error.name} with error msg: ' +
                ${addResult.addFeatureResults[0].error.message}`,
              '',
              {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: 'custom-snackbar',
              },
            );
            console.error(
              `Could not create a new feature, error: ${addResult.addFeatureResults[0].error.name} with error msg: ' +
                ${addResult.addFeatureResults[0].error.message}`,
            );
            throw new Error(
              'InsertSegmentService: saveSegment: Could not create new segment: ' +
                addResult.addFeatureResults[0].error.name +
                ' with error msg: ' +
                addResult.addFeatureResults[0].error.message,
            );
          } else {
            this.snackBar.open('Segment created!', '', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar',
            });
          }
          // Hide the create loading icon on submit for a newly created segment
          document.getElementById('loading-container-edit').style.display =
            'none';
        }
      })
      // TODO: Add message notifying the user that there was error when creating the segment
      .catch(function (error) {
        console.error(
          '[ applyEdits ] FAILURE: Error trying to create segment: ',
          error.code,
          error.name,
          error.message,
        );
        console.log('error = ', error);
      });

    AAHlayer.definitionExpression = AAHlayer.definitionExpression;
  }
}
