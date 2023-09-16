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
import { AuthenticationService } from 'src/app/auth/_services';
import FeatureForm from '@arcgis/core/widgets/FeatureForm';
import Geometry from '@arcgis/core/geometry/Geometry';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UpdateSegmentService extends SketchService {
  view: MapView;
  aahLayer: FeatureLayer;
  private origLayerDefExpression: any;
  updateForm: FeatureForm;
  private segmentClickGeom: Geometry;

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

  startUpdateSegment(view: MapView) {
    this.view = view;
    this.drawState = 'select';
    this.aahLayer = this.layers.getAAHSegmentsFeatureLayer();
    const opts = {
      include: this.aahLayer,
    };

    this.view.on('click', (evt) => {
      // check if segment clicked...
      this.view.hitTest(evt, opts).then((hitResult) => {
        if (hitResult.results.length) {
          console.log(evt);
          this.segmentClickGeom = evt.mapPoint;
        }
      });
    });

    view.popup.on('trigger-action', (event) => {
      view.popup.close();
      if (event.action.id === 'edit-segment') {
        this.featureForm.showWidget('updateWidget');
        this.setupUpdateSegment(view);
        document.getElementById('district').style.visibility = 'hidden';
        document.getElementById('county').style.visibility = 'hidden';
        document.getElementById('route').style.visibility = 'hidden';
        document.getElementById('measurementDiv').style.visibility = 'hidden';
        document.getElementById('homeLocateBtns').style.visibility = 'hidden';
        document.getElementById('addSegmentImg').style.visibility = 'hidden';
      } else if (event.action.id === 'edit-agreement') {
        this.setupUpdateAgreement(view, this.aahLayer);
        this.featureForm.showWidget(environment.agreementFormDiv);
      } else if (event.action.id === 'edit-group') {
        this.featureForm.showWidget(environment.groupFormDiv);
      } else if (event.action.id === 'edit-pickup') {
        this.featureForm.showWidget(environment.pickupFormDiv);
      } else if (event.action.id === 'edit-sign') {
        this.featureForm.showWidget(environment.signFormDiv);
      }
    });
    view.ui.add('updateWidget', 'bottom-left');
    view.ui.add('agreement', 'bottom-left');
    view.ui.add('group', 'bottom-left');
    view.ui.add('pickup', 'bottom-left');
    view.ui.add('sign', 'bottom-left');
  }

  setupUpdateSegment(view: MapView) {
    this.updateForm ? this.updateForm.destroy() : null;
    this.updateForm = this.featureForm.getUpdateFeatureForm(this.aahLayer);
    this.origLayerDefExpression = this.aahLayer.definitionExpression;
    const editFeature = view.popup.selectedFeature;
    this.layers.dockPopup(view);
    this.updateForm.feature = editFeature;
    this.setupRoadSelection(view, editFeature, this.segmentClickGeom);
  }

  cancelUpdate() {
    this.isCancel = true;
    this.svm.complete();
    console.warn(
      `Cancelling update with layer def: ${this.origLayerDefExpression}`,
    );
    this.drawState = 'closed';
    if (this.sketchGL.graphics.length) {
      this.snackBar.open('Segment geometry changes will not be saved.', '', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: 'custom-snackbar',
      });
    }

    this.aahLayer.definitionExpression = this.origLayerDefExpression;
    this.restoreMap();
  }

  submitUpdate() {
    this.svm.complete();
    // Listen to the feature form's submit event.
    this.updateForm.on('submit', () => {
      if (this.editFeature) {
        // Grab updated attributes from the form.
        const updated = this.updateForm.getValues();
        // Loop through updated attributes and assign
        // the updated values to feature attributes.
        Object.keys(updated).forEach((name) => {
          this.editFeature.attributes[name] = updated[name];
        });
        // we only want to save the status fields which are associated with
        // the status that the user has chosen
        const status = updated[environment.segmentStatusFieldName];
        switch (status) {
          case 'Unavailable':
            this.editFeature.attributes[environment.deactivatedOtherName] = '';
            this.editFeature.attributes[environment.deactivatedReasonName] = '';
            break;
          case 'Deactivate':
            this.editFeature.attributes[environment.unavailableOtherName] = '';
            this.editFeature.attributes[environment.unavailableReasonName] = '';
            break;
        }

        //Save the updated graphic and attributes
        this.updateSegment(this.origLayerDefExpression);
      }
    });

    // Fires feature form's submit event.
    this.updateForm.submit();
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

    this.layers.turnOffRoadNetwork();
    this.layers.turnOffMaintenanceLayer();
    this.unselectFeature('updateWidget');
    this.updateForm.destroy();

    document.getElementById('district').style.visibility = 'visible';
    document.getElementById('county').style.visibility = 'visible';
    document.getElementById('route').style.visibility = 'visible';
    document.getElementById('measurementDiv').style.visibility = 'visible';
    document.getElementById('homeLocateBtns').style.visibility = 'visible';
    document.getElementById('addSegmentImg').style.visibility = 'visible';
  }

  updateSegment(origLayerDefExpression: string) {
    let updateGraphic = new Graphic();
    if (this.sketchGL) {
      // @ts-ignore
      this.sketchGL.graphics.items.forEach((ele) => {
        // Only keep the temp layer graphic (not the boundary graphic)
        if (!ele.attributes) {
          // if (!ele.attributes.hasOwnProperty('boundaryExtent')) {
          updateGraphic = ele;
          // }
        }
        // updateGraphic = ele;
      });
    } else {
      throw new Error(
        'EditorServce: updadateSegment: Expected the private graphics variable (this._tempGraphicLayer) to be set but it is not',
      );
    }
    //new graphic has the changed geometry but not the attributes so lets set them
    updateGraphic.attributes = this.editFeature.attributes;

    // Remove the temp graphics layer
    this.view.map.remove(this.sketchGL);
    const sLength = this.getSegmentLength(updateGraphic);
    const updatedBy = this.authService.getUserName();
    const updatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    updateGraphic.setAttribute(
      environment.segmentUpdatedByFieldName,
      updatedBy,
    );
    updateGraphic.setAttribute(
      environment.segmentUpdatedOnFieldName,
      updatedOn,
    );
    updateGraphic.setAttribute(environment.segmentLengthFieldName, sLength);

    // Show the create loading icon on submit for a newly created segment
    document.getElementById('loading-container-edit').style.display = 'block';

    // -----------------------------------  Apply Edits   ----------------------------
    const params = { updateFeatures: [updateGraphic] };
    this.aahLayer
      .applyEdits(params)
      .then((editsResult) => {
        // Get the objectId of the newly added feature.
        // Call selectFeature function to highlight the new feature.
        if (editsResult.updateFeatureResults.length > 0) {
          if (editsResult.updateFeatureResults[0].error) {
            this.snackBar.open(
              `Could not update feature, error: ${editsResult.updateFeatureResults[0].error.name} with error msg: ' +
                ${editsResult.updateFeatureResults[0].error.message}`,
              '',
              {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: 'custom-snackbar',
              },
            );
            console.error(
              `Could not update feature, error: ${editsResult.updateFeatureResults[0].error.name} with error msg: ' +
                ${editsResult.updateFeatureResults[0].error.message}`,
            );
            throw new Error(
              'InsertSegmentService: saveSegment: Could not update segment: ' +
                editsResult.updateFeatureResults[0].error.name +
                ' with error msg: ' +
                editsResult.updateFeatureResults[0].error.message,
            );
          } else {
            this.snackBar.open('Segment updated!', '', {
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
      .catch(function (error) {
        console.log('===============================================');
        console.error(
          '[ applyEdits ] FAILURE: Error trying to update segment: ',
          error.code,
          error.name,
          error.message,
        );
        console.log('error = ', error);
      });

    this.aahLayer.definitionExpression = origLayerDefExpression;
  }

  setupUpdateAgreement(view: MapView, layer: FeatureLayer) {
    const agreementForm = this.featureForm.getAgreementFeatureForm(layer);
    const editFeature = view.popup.selectedFeature;
    this.layers.dockPopup(view);
    agreementForm.feature = editFeature;
    // Listen to the feature form's submit event.
    agreementForm.on('submit', () => {
      if (editFeature) {
        // Grab updated attributes from the form.
        const updated = agreementForm.getValues();
        // Loop through updated attributes and assign
        // the updated values to feature attributes.
        Object.keys(updated).forEach((name) => {
          editFeature.attributes[name] = updated[name];
        });
        // Setup the applyEdits parameter with updates.
        const edits = {
          updateFeatures: [editFeature],
        };
        this.unselectFeature(environment.agreementFormDiv);
      }
    });
    document.getElementById('btnUpdateAgreement').onclick = () => {
      // Fires feature form's submit event.
      agreementForm.submit();
    };
    document.getElementById('btnAgreementCancel').onclick = () => {
      this.unselectFeature(environment.agreementFormDiv);
    };
  }

  unselectFeature(formId: string) {
    if (this.view) {
      this.view.popup.dockEnabled = false;
      this.view.popup.close();
      // this._highlightSelect.remove();
    }
    this.featureForm.hideWidget(formId);
  }
}
