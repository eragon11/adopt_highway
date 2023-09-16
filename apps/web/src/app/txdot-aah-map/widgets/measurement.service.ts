import { Injectable } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import Measurement from '@arcgis/core/widgets/Measurement';

@Injectable({
  providedIn: 'root',
})
export class MeasurementService {
  private distanceButton;
  private clearButton;
  private measurement;

  setMeasurementWidget(view: MapView, container: string) {
    this.measurement = new Measurement({
      view: view,
      linearUnit: 'miles',
      container: container,
    });

    this.distanceButton = document.getElementById('distance');
    this.clearButton = document.getElementById('clearDistance');

    this.setButtons(view);

    view.ui.add(this.measurement, 'bottom-left');
  }

  setButtons(view: MapView) {
    if (this.distanceButton && this.clearButton) {
      this.distanceButton.addEventListener('click', () => {
        this.clearButton.style.display = 'inline-block';
        const type = view.type;
        this.measurement.activeTool =
          type.toUpperCase() === '2D' ? 'distance' : 'direct-line';
      });
      this.clearButton.addEventListener('click', () => {
        this.clearButton.style.display = 'none';
        this.measurement.clear();
      });
    }
  }

  getMeasurementWidget(): Measurement {
    return this.measurement;
  }
}
