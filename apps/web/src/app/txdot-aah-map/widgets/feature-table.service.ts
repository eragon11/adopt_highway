import { Injectable } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureTable from '@arcgis/core/widgets/FeatureTable';
import { environment } from 'src/environments/environment';
import { PermissionsService } from 'src/app/auth/_services/permissions.service';

@Injectable({
  providedIn: 'root',
})
export class FeatureTableService {
 
  setFeatureTableWidget(view: MapView, layer: FeatureLayer) {
    // Create the feature table
    let highlights = [];
    const featureTable = new FeatureTable({
      view: view, // required for feature highlight to work
      layer: layer,
      // Autocast the FieldColumnConfigs
      fieldConfigs: [
        {
          name: 'AAH_SEGMENT_ID',
          label: 'Segment ID',
        },
        {
          name: 'SEGMENT_STATUS',
          label: 'Status',
        },
        {
          name: 'DIST_ABRVN',
          label: 'District Short Name',
        },
        {
          name: 'CNTY_NM',
          label: 'County Name',
        },
        {
          name: 'AAH_ROUTE_NAME',
          label: 'Route Name',
        },
        {
          name: ' MNT_SEC_NBR',
          label: 'Maintenance Office Number',
        },
      ],
      container: document.getElementById(environment.tableDiv),
    });

    view.when(function () {
      const featureLayer = layer; //grabs the first layer in the map

  

      let selectedOids = [];
      view.whenLayerView(featureLayer).then(function (layerView) {
        featureTable.on("selection-change", function (changes) {
          // If the selection is removed remove its highlighted feature from the layerView
          const { objectIdField } = featureLayer;
          changes.removed.forEach(function (item) {
            const oid = item.feature.attributes[objectIdField];
            const idx = selectedOids.indexOf(oid);
            selectedOids.splice(idx, 1);
            const data = highlights.find(function (data) {
              return data.feature === item.feature;
            });
            if (data) {
              highlights.splice(highlights.indexOf(data), 1);
              data.highlight.remove();
            }
          });
          // If the selection is added, push all added selections to array and highlight on layerView
          const oids = changes.added.map(({ feature }) => {
            const oid = feature.attributes[objectIdField];
            return oid;
          });
          selectedOids = selectedOids.concat(oids);
          const query = layerView.layer.createQuery();
          query.objectIds = selectedOids;
          // not all table features might be in the layerview
          query.outSpatialReference = view.spatialReference
       layerView.layer.queryExtent(query).then(response => 
          {         view.goTo(response.extent.expand(2)).catch(function (error) {       
                  console.error('this is the error' + error);         
                 });    
                    });   
               
         
        
          changes.added.forEach(function ({ feature }) {
          let highlight = layerView.highlight(feature);
            highlights.push({
              feature: feature,
              highlight: highlight
            });
          });
        });
      });
    });
    
  
  
}}  
