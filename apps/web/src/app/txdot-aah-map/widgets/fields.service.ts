import { Injectable } from '@angular/core';
import FieldElement from '@arcgis/core/form/elements/FieldElement';
import { LayersService } from './layers.service';
import CodedValueDomain from '@arcgis/core/layers/support/CodedValueDomain';
import Field from '@arcgis/core/layers/support/Field';
import { PermissionsService } from 'src/app/auth/_services/permissions.service';
import { RoleType } from 'src/app/auth/_models/role-type';
import { District } from 'src/app/auth/_models/district';
import { AuthenticationService } from 'src/app/auth/_services';

@Injectable({
  providedIn: 'root',
})
export class FieldsService {
  private _fieldElements: Array<FieldElement> = [];
  private _fieldElementsSet = false;
  private createSegmentFieldElements: Array<FieldElement> = [];
  private _layers: LayersService;
  private _results: Array<FieldElement> = [];
  private _domains: CodedValueDomain;
  private _fields: Field;

  constructor(
    private permissions: PermissionsService,
    private authService: AuthenticationService,
  ) {}

  getStatusDomain(): CodedValueDomain {
    const statusarray = this.permissions.getPermittedStatuses();
    const newarray = [];
    for (const val of statusarray) {
      const jstr = JSON.parse(JSON.stringify(val));
      const str = `{"name": "${jstr.label}", "code": "${jstr.value}"}`;
      const finalStr = JSON.parse(str);
      newarray.push(finalStr);
    }

    const SGMNTSTATUSDOMAIN = new CodedValueDomain({
      type: 'coded-value',
      name: 'SEGMENT_STATUS',
      codedValues: newarray,
    });

    return SGMNTSTATUSDOMAIN;
  }

  getUnavailabeDomain(): CodedValueDomain {
    const SGMNTUNAVAILABLEREASONDOMAIN = new CodedValueDomain({
      type: 'coded-value',
      name: 'UNAVAILABLE_REASON_FIELD',

      codedValues: [
        {
          name: 'Construction',
          code: 'Construction',
        },
        {
          name: 'Weather',
          code: 'Weather',
        },
        {
          name: 'District Change',
          code: 'District Change',
        },

        {
          name: 'Safety Hazard',
          code: 'Safety Hazard',
        },
        {
          name: 'Interstate',
          code: 'Interstate',
        },
        {
          name: 'Other',
          code: 'Other',
        },
      ],
    });

    // add the array of fields to a feature layer
    // created from client-side graphics

    return SGMNTUNAVAILABLEREASONDOMAIN;
  }
  getdeactivateDomain(): CodedValueDomain {
    const SGMNTDEACTIVATEREASONDOMAIN = new CodedValueDomain({
      type: 'coded-value',
      name: 'DEACTIVATED_REASON_FIELD',

      codedValues: [
        {
          name: 'Non-TxDOT Road',
          code: 'Non-TxDOT Road',
        },
        {
          name: 'Road No Longer Exists',
          code: 'Road No Longer Exists',
        },
        {
          name: 'Error',
          code: 'Error',
        },

        {
          name: 'Other',
          code: 'Other',
        },
      ],
    });

    return SGMNTDEACTIVATEREASONDOMAIN;
  }

  updateFields() {
    this._fieldElementsSet = false;
    this._fieldElements = [];
    this.setFields();
  }

  setFields(): Array<FieldElement> {
    if (this._fieldElementsSet) {
      return this._fieldElements;
    } else {
      const AAH_SGMNT_ID = new FieldElement({
        fieldName: 'AAH_SEGMENT_ID',
        label: 'Segment ID',
        editable: false,
      });
      this._fieldElements.push(AAH_SGMNT_ID);

      const SEGMENT_STATUS = new FieldElement({
        fieldName: 'SEGMENT_STATUS',
        label: 'Status',
        domain: this.getStatusDomain(),
        input: { type: 'combo-box' },
      });
      this.createSegmentFieldElements.push(SEGMENT_STATUS);
      this._fieldElements.push(SEGMENT_STATUS);

      const UNAVAILABLE_REASON_FIELD = new FieldElement({
        fieldName: 'UNAVAILABLE_REASON_FIELD',
        label: 'Unavailable Reason',
        visibilityExpression: 'unavailable',
        domain: this.getUnavailabeDomain(),
        input: { type: 'combo-box' },
      });
      this._fieldElements.push(UNAVAILABLE_REASON_FIELD);

      const UNAVAILABLE_OTHER = new FieldElement({
        fieldName: 'UNAVAILABLE_OTHER',
        label: 'Unavailable Explanation',
        visibilityExpression: 'unavailableOther',
      });
      this._fieldElements.push(UNAVAILABLE_OTHER);

      const DEACTIVATED_REASON_FIELD = new FieldElement({
        fieldName: 'DEACTIVATED_REASON_FIELD',
        label: 'Deactivate Reason',
        domain: this.getdeactivateDomain(),
        visibilityExpression: 'deactivated',
        input: { type: 'combo-box' },
      });
      this._fieldElements.push(DEACTIVATED_REASON_FIELD);

      const DEACTIVATE_OTHER = new FieldElement({
        fieldName: 'DEACTIVATE_OTHER',
        label: 'Deactivated Explanation',
        visibilityExpression: 'deactivatedOther',
      });
      this._fieldElements.push(DEACTIVATE_OTHER);

      const RTE_PRFX_CD = new FieldElement({
        fieldName: 'SEGMENT_PREFIX',
        label: 'Segment Prefix',
        visibilityExpression: 'alwaysHidden',
      });
      this._fieldElements.push(RTE_PRFX_CD);

      const RTE_NBR = new FieldElement({
        fieldName: 'SEGMENT_RTE_NUMBER',
        label: 'Segment Route Number',
        visibilityExpression: 'alwaysHidden',
      });
      this._fieldElements.push(RTE_NBR);

      const RTE_SFX_NM = new FieldElement({
        fieldName: 'SEGMENT_SUFFIX',
        label: 'Segment Suffix',
        visibilityExpression: 'alwaysHidden',
      });
      this._fieldElements.push(RTE_SFX_NM);

      const FROM_TO_DESC = new FieldElement({
        fieldName: 'FROM_TO_DESC',
        label: 'Description',
      });

      this._fieldElements.push(FROM_TO_DESC);
      this.createSegmentFieldElements.push(FROM_TO_DESC);

      const SEGMENT_LENGTH_MILES = new FieldElement({
        fieldName: 'SEGMENT_LENGTH_MILES',
        label: 'Length (Miles)',
        editable: false,
      });
      this._fieldElements.push(SEGMENT_LENGTH_MILES);

      const MNT_SECT_NBR = new FieldElement({
        fieldName: 'MNT_SEC_NBR',
        label: 'Maintenance Office Number',
        editable: false,
        visibilityExpression: 'alwaysHidden',
      });
      this._fieldElements.push(MNT_SECT_NBR);

      const MNT_OFFICE_NM = new FieldElement({
        fieldName: 'MNT_OFFICE_NM',
        label: 'Maintenance Office Name',
        editable: false,
      });
      this._fieldElements.push(MNT_OFFICE_NM);

      const DIST_ABRVN = new FieldElement({
        fieldName: 'DIST_ABRVN',
        label: 'District Abbreviation',
        editable: false,
        visibilityExpression: 'alwaysHidden',
      });
      this._fieldElements.push(DIST_ABRVN);

      const DIST_NM = new FieldElement({
        fieldName: 'DIST_NM',
        label: 'District Name',
        editable: false,
      });
      this._fieldElements.push(DIST_NM);

      const CNTY_NBR = new FieldElement({
        fieldName: 'CNTY_NBR',
        label: 'TxDOT County Number',
        editable: false,
      });
      this._fieldElements.push(CNTY_NBR);

      const TXDOT_ROUTE_NAME = new FieldElement({
        fieldName: 'TXDOT_ROUTE_NAME',
        label: 'TxDOT Route Name',
        editable: false,
      });
      this._fieldElements.push(TXDOT_ROUTE_NAME);

      const RTE_NM = new FieldElement({
        fieldName: 'AAH_ROUTE_NAME',
        label: 'AAH Route Name',
      });
      this._fieldElements.push(RTE_NM);
      this.createSegmentFieldElements.push(RTE_NM);

      const CNTY_NM = new FieldElement({
        fieldName: 'CNTY_NM',
        label: 'County Name',
        editable: false,
      });
      this._fieldElements.push(CNTY_NM);

      const GlobalID = new FieldElement({
        fieldName: 'GlobalID',
        label: 'GlobalID',
        visibilityExpression: 'alwaysHidden',
      });
      this._fieldElements.push(GlobalID);

      const GROUP_NAME = new FieldElement({
        fieldName: 'GROUP_NAME',
        label: 'Group Name',
        editable: false,
      });
      this._fieldElements.push(GROUP_NAME);

      this._fieldElementsSet = true;
      return this._fieldElements;
    }
  }

  getFields(): Array<FieldElement> {
    if (this._fieldElements.length < 1) {
      console.log('number before: ' + this._fieldElements.length);
      this.setFields();
      console.log('number after: ' + this._fieldElements.length);
    }
    return this._fieldElements;
  }

  getCreateFields(): Array<FieldElement> {
    if (this.createSegmentFieldElements.length < 1) {
      this.setFields();
    }
    return this.createSegmentFieldElements;
  }
}
