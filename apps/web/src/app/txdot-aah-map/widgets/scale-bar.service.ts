
import { Injectable } from '@angular/core';
import ScaleBar from "@arcgis/core/widgets/ScaleBar";

@Injectable({
  providedIn: 'root',
})
export class ScaleBarService {
  private scaleBar;

  setScaleBar(view) {
    const scaleBar = new ScaleBar({
      view: view,
      style: "line",
    });
    // Add widget to the bottom left corner of the view
    view.ui.add(scaleBar, {
      position: 'bottom-left',
    });
  }
}
