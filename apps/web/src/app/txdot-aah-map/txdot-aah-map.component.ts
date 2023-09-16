import {
  Component,
  OnInit,
  NgZone,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { environment } from './../../environments/environment';
import { TxdotAahDefaultMapService } from './txdot-aah-default-map.service';
import { TxdotAahMapviewService } from './txdot-aah-mapview.service';
import { FilterDropdownService } from './widgets/filter-dropdown.service';
import { FilterCheckboxService } from './widgets/filter-checkbox.service';
import { CreateSegmentService } from './widgets/create-segment.service';
import { AuthenticationService } from '../auth/_services';
import MapView from '@arcgis/core/views/MapView';
import { User } from '../auth/_models';
import { SidenavService } from '../sidenav/sidenav.service';
import esriId from '@arcgis/core/identity/IdentityManager';
import Portal from '@arcgis/core/portal/Portal';
import { ArcgisTokenService } from '../auth/_services/arcgis-token.service';
import { PermissionsService } from 'src/app/auth/_services/permissions.service';
import { UpdateSegmentService } from './widgets/update-segment.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

interface SegmentStatus {
  name: string;
  selected: boolean;
  disabled: boolean;
  statuses?: SegmentStatus[];
}
@Component({
  selector: 'app-txdot-aah-map',
  templateUrl: './txdot-aah-map.component.html',
  styleUrls: ['./txdot-aah-map.component.css'],
})
export class TxdotAahMapComponent implements OnInit {
  constructor(
    private defaltMap: TxdotAahDefaultMapService,
    private mapsrv: TxdotAahMapviewService,
    public createSegmentService: CreateSegmentService,
    public updateSegmentService: UpdateSegmentService,
    private zone: NgZone,
    public filterDropdown: FilterDropdownService,
    public filterCheckbox: FilterCheckboxService,
    public authService: AuthenticationService,
    public sideNavService: SidenavService,
    private permissions: PermissionsService,
    private ref: ChangeDetectorRef,
    public arcgisTokenService: ArcgisTokenService,
  ) {
    // fixes widget not updating/refreshing distance value
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 100);
  }

  public view: MapView = null;
  public user: User;

  env = environment;
  selectorisvisibility = 'hidden';
  legendVisibility = 'hidden';
  editorVisibility = 'hidden';
  click = 0;
  esriAuth: any;

  checkedStatus: string[] = ['All'];

  segmentStatus: SegmentStatus = {
    name: 'All Statuses',
    selected: false,
    disabled: false,
    statuses: this.permissions.getPermittedStatuses() as any[],
  };

  toggleNav() {
    this.sideNavService.toggleSideNav();
  }

  async initializeMap(): Promise<any> {
    // check if app has a valid AGS token
    this.esriAuth = esriId;
    esriId
      .checkAppAccess(
        `${environment.gisPortalUrl}/sharing`,
        environment.gisClientId,
      )
      .then(() => {
        //calls the default map service to get the basic AAH webmap
        const webmap = this.defaltMap.getDefaultWebMap();
        //Set the private view variable to the new MapView
        this.view = this.mapsrv.getConstructedMapView(webmap);
        return this.view.when();
      })
      .catch(() => {
        console.log('App needs a new ArcGIS token');
        this.arcgisTokenService
          .getToken()
          .pipe(catchError(() => of([])))
          .subscribe((response) => {
            console.log(response);
            esriId.registerToken({
              token: response.token,
              server: `${environment.gisServerUrl}/rest/services`,
            });
            //calls the default map service to get the basic AAH webmap
            const webmap = this.defaltMap.getDefaultWebMap();
            //Set the private view variable to the new MapView
            this.view = this.mapsrv.getConstructedMapView(webmap);
            return this.view.when();
          });
      });
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      // Initialize MapView and return an instance of MapView
      this.initializeMap().then(() => {
        // The map has been initialized
        this.zone.run(() => {
          console.log('view ready: ');
          // console.log(`is focused? ${this.view.focused}`);
        });
      });
    });
  }

  enableLegend() {
    if (this.legendVisibility === 'hidden') {
      this.legendVisibility = 'visible';
    } else {
      this.legendVisibility = 'hidden';
    }
  }

  enableBasemapSelector() {
    if (this.selectorisvisibility === 'hidden') {
      this.selectorisvisibility = 'visible';
    } else {
      this.selectorisvisibility = 'hidden';
    }
  }

  enableCreateSegment() {
    if (!this.view) {
      throw new Error(
        'txdot-aah-map.component: enableLegend: MapView is not initialized',
      );
    }
    this.createSegmentService.startCreateSegment(this.view);
  }

  getLayerListClassNames(): string {
    if (this.legendVisibility) {
      return environment.layerListWidgetOnContainer;
    } else {
      return environment.layerListWidgetOffContainer;
    }
  }

  ngOnDestroy() {
    this.updateSegmentService.updateForm
      ? this.updateSegmentService.updateForm.destroy()
      : null;
    this.createSegmentService.createForm
      ? this.createSegmentService.createForm.destroy()
      : null;
  }
}
