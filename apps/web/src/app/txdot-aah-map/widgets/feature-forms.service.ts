import { Injectable } from '@angular/core';
import FormTemplate from '@arcgis/core/form/FormTemplate';
import GroupElement from '@arcgis/core/form/elements/GroupElement';
import FeatureForm from '@arcgis/core/widgets/FeatureForm';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { FieldsService } from './fields.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeatureFormsService {
  constructor(private fieldsService: FieldsService) {}

  private arcadeExpressionInfos = [
    // Get Arcade expression
    {
      name: 'unavailable',
      title: 'Segment Status Unavailable',
      expression: "$feature.SEGMENT_STATUS == 'Unavailable'",
    },
    {
      name: 'unavailableOther',
      title: 'Segment Status Unavailable Reason',
      expression:
        "($feature.SEGMENT_STATUS == 'Unavailable') && ($feature.UNAVAILABLE_REASON_FIELD == 'Other')",
    },

    {
      name: 'deactivated',
      title: 'Segment Status Deactivated',
      expression: "$feature.SEGMENT_STATUS == 'Deactivate'",
    },
    {
      name: 'deactivatedOther',
      title: 'Segment Status Deactivated  Reason',
      expression:
        "($feature.SEGMENT_STATUS == 'Deactivate') && ($feature.DEACTIVATED_REASON_FIELD == 'Other')",
    },
    {
      name: 'reactivatedOther',
      title: 'Segment Status Reactivated Reason',
      expression: "$feature.SEGMENT_STATUS == 'Reactivate'",
    },
    {
      name: 'alwaysHidden',
      title: 'Always Hidden',
      expression: "$feature.GlobalID == '0'",
    },
  ];

  getUpdateFeatureForm(layer: FeatureLayer): FeatureForm {
    console.log('getting Update FeatureForm.....');
    const formTemplate = new FormTemplate({
      elements: this.fieldsService.getFields(),
      expressionInfos: this.arcadeExpressionInfos,
    });
    const formDiv = document.createElement('div');
    formDiv.id = 'updateForm';
    document.getElementById('update').appendChild(formDiv);
    const form = new FeatureForm({
      container: 'updateForm',
      layer: layer,
      formTemplate: formTemplate,
    });

    return form;
  }

  getCreateFeatureForm(layer: FeatureLayer): FeatureForm {
    console.log('getting Create FeatureForm.....');
    const formTemplate = new FormTemplate({
      title: 'Enter Segment Information',
      elements: this.fieldsService.getCreateFields(),
      expressionInfos: this.arcadeExpressionInfos,
    });
    const formDiv = document.createElement('div');
    formDiv.id = 'createForm';
    document.getElementById('create').appendChild(formDiv);
    const form = new FeatureForm({
      // container: environment.createFormDiv,
      container: 'createForm',
      layer: layer,
      formTemplate: formTemplate,
    });
    return form;
  }

  getAgreementFeatureForm(layer: FeatureLayer): FeatureForm {
    console.log('getting FeatureForm.....');
    const groupElement = new GroupElement({
      elements: this.fieldsService.getFields(),
    });

    const formTemplate = new FormTemplate({
      title: 'Agreement Update',
      description: 'Agreement Attributes',
      elements: [groupElement],
      expressionInfos: this.arcadeExpressionInfos,
    });

    const form = new FeatureForm({
      container: environment.agreementFormDiv,
      layer: layer,
      // groupDisplay: "sequential",
      formTemplate: formTemplate,
    });
    return form;
  }

  showWidget(formId: string) {
    if (document.getElementById(formId).classList.contains('esri-hidden')) {
      document.getElementById(formId).classList.remove('esri-hidden');
    }
  }

  hideWidget(formId: string) {
    if (!document.getElementById(formId).classList.contains('esri-hidden')) {
      document.getElementById(formId).classList.add('esri-hidden');
    }
  }
}
