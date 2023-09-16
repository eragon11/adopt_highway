/*
NOTE: Any new enviroment variables in environments.ts also need to be added to environment.prod.ts.

Additionally, any environment.ts variables that require configuration need a token replacement in the following form

#{ <Azure DevOps variable name here> }#

Where there is a prefix of "#{" and a suffix of "}#", with a variable between.

The Azure DevOps (ADO)  library for dev, uat, pre-prod and prod all need to have a value for each added property.

The default convention is to duplicate the property name as the token replacement variable so it is easy to locate in ADO.

example:
importProperty: '#{importProperty}#'

Then, add importProperty with values specific to each environment, or the add and keep them the same for each environment.

When AAH builds, the main.js file will have the #{ importProperty }# replaced with the value for that environment from Azure DevOps.

*/

export const environment = {
  production: false,
  mainTitle: 'Adopt A Highway',
  assetsPath: './assets',
  apiUrl: 'https://localhost:3000',
  SAMLUrl: 'https://localhost:3000/auth/login',
  SAMLExternalUrl: 'https://localhost:3000/external-auth/login',
  WhoAmIUrl: 'https://localhost:3000/auth/whoami',
  RefreshTokenUrl: 'https://localhost:3000/auth/refresh',
  setRoleUrl: 'https://localhost:3000/auth/setrole',
  logoutUrl: 'https://localhost:3000/auth/logout',
  aahDBRESTURL: 'http://localhost:3000/api/roadsegments',
  districtsURL: 'https://localhost:3000/districts',
  maintOfcURL: 'https://localhost:3000/maintenance-sections',
  countiesURL: 'https://localhost:3000/counties',
  usersURL: 'https://localhost:3000/users',
  usersProfileURL: 'https://localhost:3000/users/profile',
  applicationsURL: 'https://localhost:3000/applications',
  // Feature services hosted and maintained by TxDOT
  txdotBasemapFS:
    'https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Vector_Tile_Basemap/VectorTileServer',
  txdotRoadwayFS:
    'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Roadways/FeatureServer/0',
  txdotReferenceMarkersFS:
    'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Reference_Markers/FeatureServer/0',
  txdotMaintenanceSectionsFS:
    'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Maintenance_Section_Boundaries/FeatureServer/0',
  txdotDistrictsFS:
    'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Districts/FeatureServer/0',
  txdotCountiesFS:
    'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Counties/FeatureServer/0',

  // Feature services hosted and maintained by AAH
  aahGisSegmentsFS:
    'https://devarcgis.txdot.gov/arcgis/rest/services/AAH/AAH_SEGMENTS_DEV/FeatureServer/0',

  aahAgreementFS:
    'https://gisext-test.txdot.gov/arcgis/rest/services/AAH/AGREEMENT/FeatureServer/0',

  gisServerUrl: 'https://devarcgis.txdot.gov/arcgis/',
  gisPortalUrl: 'https://devmaps.txdot.gov/portal',
  gisClientId: '4RJp9om3ds6UAZya',
  gisGeoCodeUrl:
    'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer?f=pjson&region=Texas.',

  checkTokenExpiredTimeoutInMinutes: 5,
  // To debounce refresh token on subsequent http calls after token is refreshed,
  // To avoid multiple refresh calls when there are multiple parallel / immediate http calls.
  refreshTokenDebounceTimeInMinutes: 1,

  AAHFeatureLayerTitle: 'AAH Segments',

  AAHfeatureFields: [
    'AAH_SEGMENT_ID',
    'SEGMENT_STATUS',
    'UNAVAILABLE_REASON_FIELD',
    'UNAVAILABLE_OTHER',
    'DEACTIVATED_REASON_FIELD',
    'DEACTIVATE_OTHER',
    'SEGMENT_PREFIX',
    'SEGMENT_RTE_NUMBER',
    'SEGMENT_SUFFIX',
    'FROM_TO_DESC',
    'SEGMENT_LENGTH_MILES',
    'MNT_SEC_NBR',
    'MNT_OFFICE_NM',
    'DIST_ABRVN',
    'DIST_NM',
    'CNTY_NBR',
    'AAH_ROUTE_NAME',
    'CNTY_NM',
    'GlobalID',
    'SEGMENT_FROM_LAT',
    'SEGMENT_FROM_LONG',
    'SEGMENT_TO_LAT',
    'SEGMENT_TO_LONG',
    'GROUP_NAME',
    'REF_MARKER_FROM',
    'REF_MARKER_TO',
    'MAINTAINANCE_OFFICER_EMAIL',
    'DISTRICT_COORDINATOR_EMAIL',
    'TXDOT_ROUTE_NAME',
  ],

  // segment symbology
  adoptedStatusColor: 'hsl(202, 100%, 35%)',
  availableStatusColor: 'hsl(80, 88%, 49%)',
  deactivateStatusColor: 'hsl(310, 43%, 47%)',
  notAssessedStatusColor: 'hsl(0, 0%, 0%)',
  pendingStatusColor: 'hsl(34, 100%, 52%)',
  unavailableStatusColor: 'hsl(0, 81%, 62%)',
  solidSymbol: 'solid',
  shortdotSymbol: 'short-dot',
  shortDashDotSymbol: 'short-dash-dot',
  shortDashSymbol: 'short-dash',
  lineWidth5: '5',
  lineWidth4: '4',
  lineWidth3: '3',
  lineWidth2: '2',
  lineWidth1: '1',

  AdminWhereClause: '1=1',
  Dist_Segment_WhereClause: 'DIST_ABRVN = ',
  Dist_Maint_Segment_WhereClause: 'DIST_NM = ',
  Maint_Segment_WhereClause: 'MNT_SEC_NBR = ',
  DistrictWhereClause: 'DIST_ABRVN = ',
  CountyWhereClause: 'CNTY_NM  = ',
  RouteWhereClause: 'AAH_ROUTE_NAME  = ',
  Maint_WhereClause: 'MAINT_SEC_NBR = ',
  MaintDistAbrWhereClause: 'DIST_NM = ',
  statusWhereClause: 'SEGMENT_STATUS in ',
  roadNetworkLayerWhereClause: `SEARCH LIKE '%KG%' AND FUNC_SYS <> 1`,

  //ESRI LayerList widget container class representing the drawn (on) state
  layerListWidgetOnContainer: 'esri-layer-list esri-widget esri-widget--panel',
  //ESRI container class representing the hidden state
  layerListWidgetOffContainer: 'esri-hidden',
  useGroupLayer: false,
  //URIs
  userManagmentUri: 'users',

  // app components
  showUserManagement: true,
  showReporting: true,
  showDashboard: true,
  showMap: true,
  showAgreements: true,

  //imgs
  AgreementIcon: '/assets/images/AgreementUpdateIcon.png',
  GroupIcon: '/assets/images/GroupUpdateIcon.png',
  PickupIcon: '/assets/images/PickupUpdateIcon.png',
  txdotBmThumbnail: '/assets/images/txdotBasemap.png',
  txdotLtGryThumbnail: '/assets/images/txdotLtGryBasemap.png',
  SegmentUpdateIcon: '/assets/images/SegmentUpdateIcon.png',
  SignIcon: '/assets/images/SignUpdateIcon.png',
  txdotBanner: '/assets/images/blueBanner.png',
  txdotImage: '/assets/images/TXDOTwhiteLogo.png',
  acctMngmntImg: '/assets/images/person_outline_white.png',
  segmentEditImg: '/assets/images/add_circle_white.png',
  layersImg: '/assets/images/layers-24px_white.png',
  transparentImg: '/assets/images/transparentImage.png',
  dashboard_sidenav_documents_black:
    '/assets/images/dashboard-sidenav-documents-black.png',
  dashboard_sidenav_documents_white:
    '/assets/images/dashboard-sidenav-documents-white.png',
  dashboard_sidenav_template_black:
    '/assets/images/dashboard-sidenav-template-black.png',
  dashboard_sidenav_template_white:
    '/assets/images/dashboard-sidenav-template-white.png',
  dashboard_sidenav_dashboard_black:
    '/assets/images/dashboard-sidenav-dashboard-black.png',
  dashboard_sidenav_dashboard_white:
    '/assets/images/dashboard-sidenav-dashboard-white.png',
  dashboard_sidenav_copyright_black:
    '/assets/images/dashboard-sidenav-copyright-black.png',
  dashboard_sidenav_copyright_white:
    '/assets/images/dashboard-sidenav-copyright-white.png',
  reporting_report_download_black:
    '/assets/images/reporting-report-download-black.png',
  map_banner_sidenavHamburger_white:
    '/assets/images/map-banner-map-sidenavHamburger-white.png',
  //for the select boxes
  ABL: 'Abilene',
  LRD: 'Laredo',
  AMA: 'Amarillo',
  LBB: 'Lubbock',
  ATL: 'Atlanta',
  LFK: 'Lufkin',
  AUS: 'Austin',
  ODA: 'Odessa',
  BMT: 'Beaumont',
  PAR: 'Paris',
  BWD: 'Brownwood',
  PHR: 'Pharr',
  BRY: 'Bryan',
  SJT: 'San Angelo',
  CHS: 'Childress',
  SAT: 'San Antonio',
  CRP: 'Corpus Christi',
  TYL: 'Tyler',
  DAL: 'Dallas',
  WAC: 'Waco',
  ELP: 'El Paso',
  WFS: 'Wichita Falls',
  FTW: 'Fort Worth',
  YKM: 'Yoakum',
  HOU: 'Houston',
  segmentCreatedByFieldName: 'CREATED_BY',
  segmentCreatedOnFieldName: 'CREATED_ON',
  segmentUpdatedByFieldName: 'UPDATED_BY',
  segmentUpdatedOnFieldName: 'UPDATED_ON',
  segmentLengthFieldName: 'SEGMENT_LENGTH_MILES',
  segmentIdFieldName: 'AAH_SEGMENT_ID',
  districtFieldName: 'DIST_NM',
  districtAbbreviatedFieldName: 'DIST_ABRVN',
  districtSelectBoxId: 'district',
  districtSelectBoxInitialVal: 'Select District',
  countyDistrictFieldName: 'DIST_NM',
  countyCountyFieldName: 'CNTY_NM',
  countySelectBoxId: 'county',
  countySelectBoxInitialVal: 'Select County',
  routeFeatureSrvName: 'AAH_ROUTE_NAME',
  routeSelectBoxId: 'route',
  routeSelectBoxInitialVal: 'Select Route',
  segmentStatusFieldName: 'SEGMENT_STATUS',
  segmentStatusCheckboxId: 'segmentStatusCheckBox',
  segmentStatusSelectBoxInitialVal: 'All',
  maintOfficeFieldName: 'MNT_SEC_NBR',
  deactivatedReasonName: 'DEACTIVATED_REASON_FIELD',
  deactivatedOtherName: 'DEACTIVATE_OTHER',
  unavailableReasonName: 'UNAVAILABLE_REASON_FIELD',
  unavailableOtherName: 'UNAVAILABLE_OTHER',
  searchDiv: 'searchDiv',
  layerDiv: 'layerDiv',
  BasemapSelectorDiv: 'BasemapSelectorDiv',
  locateDiv: 'locateDiv',
  homeDiv: 'homeDiv',
  zoomDiv: 'zoomDiv',
  filterDiv: 'filterDiv',
  editorDiv: 'editorDiv',
  tableDiv: 'tableDiv',
  measurementDiv: 'measurementDiv',
  updateFormDiv: 'update',
  updateFormSubmit: 'btnUpdate',
  updateFormCancel: 'btnUpdateCancel',
  updateSketch: 'update',
  createSketch: 'create',
  createFormDiv: 'create',
  createFormSubmit: 'btnCreate',
  createFormCancel: 'btnCreateCancel',
  districtRoleType: 'District Coordinator',
  maintenanceRoleType: 'Maintenance Coordinator',
  agreementFormDiv: 'agreement',
  groupFormDiv: 'group',
  pickupFormDiv: 'pickup',
  signFormDiv: 'sign',
  //Reporting
  defaultPageSize: 10,
  paginationSizes: [10, 25, 50, 100],
  showFirstLastButtons: true,
  reportsAdminURLSuffix: 'admin',
  reportsDistrictURLSuffix: 'district',
  reportsMaintURLSuffix: 'maintenance-section',
  reportGroupHeadings: [
    {
      value: '1-next30days',
      text: '< Up for renewal in Next 30 Days',
    },
    {
      value: '2-between30And60days',
      text: '< Up for renewal between 30 and 60 Days',
    },
    {
      value: '3-moreThan60days',
      text: '< Up for renewal after 60 Days',
    },
  ],
  reports: [
    {
      id: 0,
      title: 'Agreements',
      subtitle: 'Total Records: ',
      component: 'AgreementReportComponent',
      defaultSortField: 'id',
      defaultSortDirection: 'ASC',
      url: '/report/agreement',
    },
    {
      id: 1,
      title: 'Agreements by Renewal Date',
      subtitle: 'Total Records: ',
      defaultSortField: 'agreementBeginDate',
      defaultSortDirection: 'DESC',
      url: '/report/agreements-by-renewal-date',
    },
    {
      id: 2,
      title: 'Signs',
      subtitle: 'Total Records: ',
      component: 'SignReportComponent',
      defaultSortField: 'agreementId',
      defaultSortDirection: 'DESC',
      url: '/report/sign',
    },
    {
      id: 3,
      title: 'Segments',
      subtitle: 'Total Records: ',
      defaultSortField: 'aahRouteName',
      defaultSortDirection: 'ASC',
      url: '/report/segment',
    },
    {
      id: 4,
      title: 'Pickups',
      subtitle: 'Total Records: ',
      component: 'PickupReportComponent',
      defaultSortField: 'id',
      defaultSortDirection: 'ASC',
      url: '/report/pickup',
    },
    {
      id: 5,
      title: 'Group Type Summary',
      subtitle: 'Total Records: ',
      component: 'GroupTypeInfoReportComponent',
      defaultSortField: 'type',
      defaultSortDirection: 'ASC',
      url: '/report/group-type-info',
    },
    {
      id: 6,
      title: 'Groups',
      subtitle: 'Total Records: ',
      component: 'GroupReportComponent',
      defaultSortField: 'agreementStartDate',
      defaultSortDirection: 'DESC',
      url: '/report/group',
    },
  ],
  reportDataType: 'reports',

  // users
  defaultUsersPageSize: 12,
  userDataType: 'users',

  aahVersion: '1.0.0-dev.1234',
  nodeEnv: 'dev',
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
//import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
