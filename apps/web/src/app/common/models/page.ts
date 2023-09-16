import { environment } from 'src/environments/environment';

export interface meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

// The Page represents the current state of a page returned from the API. Once an instance is created
// it holds the current state of the request to the API for data. It is used by all the reports and
// is being modified to use with the user listing page. Therefore it will need some modifications i.e.
// a search string and some booleans for Active and include the different Role Types
export class Page<T> extends Array<T> {
  public static readonly DEFAULT_PAGE_SIZE = environment.defaultPageSize;

  sortField: string;
  sortDirection: string;
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  startDate: string;
  endDate: string;
  district: string;
  maintOffice: string;
  userName: string;
  userRoles: string[];
  county: string;
  groupName: string;

  constructor(
    sortFld?: string,
    sortDir?: string,
    page?: number,
    pgSize?: number,
    tot?: number,
    sDate?: string,
    eDate?: string,
    dist?: string,
    maintOfc?: string,
    uName?: string,
    uRoles?: string[],
    cty?: string,
    grpName?: string,
    items?: T[],
  ) {
    super();
    this.sortField = sortFld ? sortFld : '';
    this.sortDirection = sortDir ? sortDir : 'ASC';
    this.currentPage = page ? page : 1;
    this.itemsPerPage = pgSize ? pgSize : Page.DEFAULT_PAGE_SIZE;
    this.totalItems = tot ? tot : 0;
    this.startDate = sDate ? sDate : null;
    this.endDate = eDate ? eDate : null;
    this.district = dist ? dist : null;
    this.maintOffice = maintOfc ? maintOfc : null;
    this.userName = uName ? uName : null;
    this.userRoles = uRoles ? uRoles : null;
    this.county = cty ? cty : null;
    this.groupName = grpName ? grpName : null;
    if (items && items.length > 0) {
      //need to clear out the array because we only want the current page
      this.length = 0;
      this.push(...items);
    }
  }

  setFilters(af: any) {
    // If no values are present, the page will reset
    this.setDistrict(af.district);
    this.setMaintOfc(af.maintOffice);
    this.setCounty(af.county);
    this.setSearchName(af.userName);
    this.setUserRoles(af.roles);
    this.setCounty(af.county);
    this.setGroupName(af.groupName);
    if (af.startdate && af.enddate) {
      this.setDateFilters(af.startdate, af.enddate);
    }
  }

  setDistrict(districtID: string): void {
    this.district = districtID;
  }

  getDistrict(): string {
    return this.district;
  }

  setMaintOfc(maintOfcID: string): void {
    this.maintOffice = maintOfcID;
  }

  getMaintOfc(): string {
    return this.maintOffice;
  }

  setSearchName(username: string): void {
    this.userName = username;
  }

  getSearchName(): string {
    return this.userName;
  }

  setUserRoles(userRoles: string[]): void {
    this.userRoles = userRoles;
  }

  getUserRoles(): string[] {
    return this.userRoles;
  }

  setCounty(countyID: string): void {
    this.county = countyID;
  }

  getCounty(): string {
    return this.county;
  }

  getDateFilters(): [string, string] {
    return [this.startDate, this.endDate];
  }

  setDateFilters(startDate: string, endDate: string) {
    console.warn(
      `In Page SET Date filters  INITTAL with start: ${startDate} and end: ${endDate}`,
    );
    this.startDate = startDate;
    this.endDate = endDate;
    console.warn(
      `In Page SET Date filters with start: ${this.startDate} and end: ${this.endDate}`,
    );
  }

  clearDateFilters() {
    this.startDate = null;
    this.endDate = null;
  }

  getSortField(): string {
    return this.sortField;
  }

  setSortField(sortFld: string) {
    this.sortField = sortFld;
  }

  getSortDirection(): string {
    return this.sortDirection;
  }

  setSortDirection(sortDir: string) {
    this.sortDirection = sortDir;
  }

  getItemCount(): number {
    return this.itemCount;
  }

  setPageSize(pgSize: number) {
    this.itemsPerPage = pgSize;
  }

  getPageSize(): number {
    return this.itemsPerPage;
  }

  setPageNumber(pgNum: number) {
    this.currentPage = pgNum;
  }

  getPageNumber(): number {
    return this.currentPage;
  }

  getTotalItemCount(): number {
    return this.totalItems;
  }

  setGroupName(grpName: string) {
    this.groupName = grpName;
  }

  getGroupName(): string {
    return this.groupName;
  }

  setData(data: Array<any>) {
    if (data && data.length > 0) {
      //need to clear out the array because we only want the current page
      this.length = 0;
      this.totalItems = this.push(...data);
    } else {
      console.warn(`No data returned from report call`);
    }
  }

  // The API returns meta data with each call.
  setMetaData(data: meta) {
    this.totalItems = data.totalItems;
    this.itemCount = data.itemCount;
    this.itemsPerPage = data.itemsPerPage;
    this.totalPages = data.totalPages;
    this.currentPage = data.currentPage;
  }
}
